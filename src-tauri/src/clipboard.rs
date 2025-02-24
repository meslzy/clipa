use base64::{engine::general_purpose::STANDARD, Engine as _};
use image::{ImageBuffer, Rgba};
use std::io::Cursor;
use windows::Win32::{
    Foundation::{HANDLE, HGLOBAL, HWND},
    Graphics::Gdi::{GetBitmapBits, GetObjectW, BITMAP, HBITMAP, HGDIOBJ},
    System::{
        DataExchange::{
            CloseClipboard, EmptyClipboard, EnumClipboardFormats, GetClipboardData, OpenClipboard,
            SetClipboardData,
        },
        Memory::{GlobalAlloc, GlobalLock, GlobalUnlock, GMEM_MOVEABLE},
        Ole::{CF_BITMAP, CF_HDROP, CF_UNICODETEXT},
    },
    UI::Shell::{DragQueryFileW, HDROP},
};

#[derive(Debug)]
pub enum ClipboardContentKind {
    Text,
    Image,
    Files,
    Unknown,
}

impl ClipboardContentKind {
    fn as_str(&self) -> &'static str {
        match self {
            ClipboardContentKind::Text => "text",
            ClipboardContentKind::Image => "image",
            ClipboardContentKind::Files => "files",
            ClipboardContentKind::Unknown => "unknown",
        }
    }
}

//

unsafe fn get_text_content(handle: HANDLE) -> Option<String> {
    let lp_clip_mem = GlobalLock(std::mem::transmute::<_, HGLOBAL>(handle));
    if lp_clip_mem.is_null() {
        return None;
    }

    let mut len = 0;
    while *(lp_clip_mem as *const u16).offset(len) != 0 {
        len += 1;
    }

    let slice = std::slice::from_raw_parts(lp_clip_mem as *const u16, len as usize);

    String::from_utf16(slice).ok()
}

unsafe fn set_text_content(content: String) -> bool {
    let content = content.encode_utf16().collect::<Vec<u16>>();
    let size = (content.len() + 1) * 2;

    let h_mem = GlobalAlloc(GMEM_MOVEABLE, size).unwrap();

    let lp_clip_mem = GlobalLock(h_mem);
    if lp_clip_mem.is_null() {
        return false;
    }

    std::ptr::copy_nonoverlapping(content.as_ptr(), lp_clip_mem as *mut u16, content.len());
    *(lp_clip_mem as *mut u16).offset(content.len() as isize) = 0;

    GlobalUnlock(h_mem).unwrap_or(());

    SetClipboardData(
        CF_UNICODETEXT.0 as u32,
        std::mem::transmute::<HGLOBAL, HANDLE>(h_mem),
    )
    .is_ok()
}

//

unsafe fn get_image_content(handle: HANDLE) -> Option<String> {
    let mut bitmap = BITMAP::default();

    GetObjectW(
        std::mem::transmute::<HANDLE, HGDIOBJ>(handle),
        std::mem::size_of::<BITMAP>() as i32,
        Some(&mut bitmap as *mut _ as *mut std::ffi::c_void),
    );

    let size = (bitmap.bmWidth * bitmap.bmHeight * 4) as usize;
    let mut buffer = vec![0u8; size];

    GetBitmapBits(
        std::mem::transmute::<HANDLE, HBITMAP>(handle),
        buffer.len() as i32,
        buffer.as_mut_ptr() as *mut _,
    );

    for pixel in buffer.chunks_mut(4) {
        pixel.swap(0, 2);
    }

    let img_buffer = ImageBuffer::<Rgba<u8>, _>::from_raw(
        bitmap.bmWidth as u32,
        bitmap.bmHeight as u32,
        buffer,
    )?;

    let mut png_data = Vec::new();
    let mut cursor = Cursor::new(&mut png_data);

    img_buffer
        .write_to(&mut cursor, image::ImageFormat::Png)
        .ok()?;

    Some(STANDARD.encode(&png_data))
}

unsafe fn set_image_content(_content: String) -> bool {
    // TODO: Implement image content setting
    false
}

//

unsafe fn get_files_content(handle: HANDLE) -> Option<String> {
    let hdrop = HDROP(handle.0);
    let file_count = DragQueryFileW(hdrop, 0xFFFFFFFF, None);
    let mut file_paths = Vec::new();

    for i in 0..file_count {
        let size = DragQueryFileW(hdrop, i, None) as usize;
        let mut buffer = vec![0u16; size + 1];

        if DragQueryFileW(hdrop, i, Some(&mut buffer)) != 0 {
            if let Ok(path) = String::from_utf16(&buffer[..size]) {
                file_paths.push(path);
            }
        }
    }

    Some(serde_json::to_string(&file_paths).unwrap_or_default())
}

unsafe fn set_files_content(_content: String) -> bool {
    // TODO: Implement files content setting
    false
}

//

pub unsafe fn get_clipboard_content(hwnd: HWND) -> Option<(String, String)> {
    let mut retry_count = 0;

    while OpenClipboard(hwnd).is_err() {
        std::thread::sleep(std::time::Duration::from_millis(50));

        retry_count += 1;

        if retry_count > 10 {
            return Some((
                ClipboardContentKind::Unknown.as_str().to_string(),
                "Failed to open clipboard".to_string(),
            ));
        }
    }

    let mut format = EnumClipboardFormats(0);
    let mut content_type: ClipboardContentKind = ClipboardContentKind::Unknown;
    let mut content = String::new();

    while format != 0 {
        match format {
            f if f == CF_UNICODETEXT.0 as u32 => {
                content_type = ClipboardContentKind::Text;
                if let Some(handle) = GetClipboardData(CF_UNICODETEXT.0 as u32).ok() {
                    content = get_text_content(handle).unwrap_or_default();
                }
                break;
            }
            f if f == CF_BITMAP.0 as u32 => {
                content_type = ClipboardContentKind::Image;
                if let Some(handle) = GetClipboardData(CF_BITMAP.0 as u32).ok() {
                    content = get_image_content(handle).unwrap_or_default();
                }
                break;
            }
            f if f == CF_HDROP.0 as u32 => {
                content_type = ClipboardContentKind::Files;
                if let Some(handle) = GetClipboardData(CF_HDROP.0 as u32).ok() {
                    content = get_files_content(handle).unwrap_or_default();
                }
                break;
            }
            _ => {}
        }

        format = EnumClipboardFormats(format);
    }

    CloseClipboard().unwrap();

    Some((content_type.as_str().to_string(), content))
}

pub unsafe fn set_clipboard_content(hwnd: HWND, kind: String, content: String) -> bool {
    let mut retry_count = 0;

    while OpenClipboard(hwnd).is_err() {
        std::thread::sleep(std::time::Duration::from_millis(50));
        retry_count += 1;
        if retry_count > 10 {
            return false;
        }
    }

    EmptyClipboard().unwrap();

    let result = match kind.as_str() {
        "text" => set_text_content(content),
        "image" => set_image_content(content),
        "files" => set_files_content(content),
        _ => false,
    };

    CloseClipboard().unwrap();

    result
}
