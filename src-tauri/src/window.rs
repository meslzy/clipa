use std::{mem::zeroed, sync::Mutex, time::{SystemTime, Duration}};
use tauri::{
    App, AppHandle, Emitter, Manager, PhysicalPosition, PhysicalSize, Position, WindowEvent,
};
use windows::Win32::{
    Foundation::{HWND, LPARAM, LRESULT, POINT, WPARAM},
    Graphics::Gdi::{GetMonitorInfoW, MonitorFromPoint, MONITORINFO, MONITOR_DEFAULTTOPRIMARY},
    System::DataExchange::AddClipboardFormatListener,
    UI::WindowsAndMessaging::{
        CallWindowProcW, DefWindowProcW, GetCursorPos, GetWindowLongPtrW, SetWindowLongPtrW,
        GWL_WNDPROC, WM_CLIPBOARDUPDATE,
    },
};

use crate::{clipboard::get_clipboard_content, state::AppState};

static mut ORIGINAL_WNDPROC: Option<isize> = None;
static WINDOW: Mutex<Option<tauri::WebviewWindow>> = Mutex::new(None);
static LAST_UPDATE: Mutex<SystemTime> = Mutex::new(SystemTime::UNIX_EPOCH);
static mut LAST_CONTENT: Mutex<Option<(String, String)>> = Mutex::new(None);

unsafe extern "system" fn clipboard_wndproc(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    if msg == WM_CLIPBOARDUPDATE {
        if let Some(window) = WINDOW.lock().unwrap().as_ref() {
            window.emit("clipboard_update_start", Option::<()>::None).unwrap();

            let now = SystemTime::now();
            let mut last_update = LAST_UPDATE.lock().unwrap();
            
            if now.duration_since(*last_update).unwrap_or(Duration::from_secs(1)) > Duration::from_millis(100) {
                let hwnd = window.hwnd().unwrap();
                if let Some(clipboard) = get_clipboard_content(hwnd) {
                    let mut last_content = LAST_CONTENT.lock().unwrap();
                    if last_content.as_ref() != Some(&clipboard) {
                        window.emit("clipboard_update", Some(clipboard.clone())).unwrap();
                        *last_content = Some(clipboard);
                        *last_update = now;
                    }
                }
            }
        }
    }

    if let Some(orig_proc) = ORIGINAL_WNDPROC {
        CallWindowProcW(std::mem::transmute(orig_proc), hwnd, msg, wparam, lparam)
    } else {
        DefWindowProcW(hwnd, msg, wparam, lparam)
    }
}

pub fn get_mouse_position(size: PhysicalSize<u32>) -> Position {
    unsafe {
        let mut point: POINT = zeroed();
        GetCursorPos(&mut point).unwrap();

        let screen = MonitorFromPoint(point, MONITOR_DEFAULTTOPRIMARY);
        let mut monitor_info: MONITORINFO = zeroed();
        monitor_info.cbSize = std::mem::size_of::<MONITORINFO>() as u32;
        GetMonitorInfoW(screen, &mut monitor_info).unwrap();

        let work_area = monitor_info.rcWork;

        let x = point
            .x
            .clamp(work_area.left, work_area.right - size.width as i32);
        let y = point
            .y
            .clamp(work_area.top, work_area.bottom - size.height as i32);

        Position::Physical(PhysicalPosition::new(x, y))
    }
}

pub fn toggle_clipa(app_handle: &AppHandle) {
    if let Some(clipa_window) = app_handle.get_webview_window("clipa") {
        if clipa_window.is_visible().unwrap() {
            clipa_window.hide().unwrap();
        } else {
            let window_size = clipa_window.outer_size().unwrap();
            let position = get_mouse_position(window_size);
            clipa_window.set_position(position).unwrap();
            clipa_window.show().unwrap();
        }
    }
}

pub fn setup_clipa(app: &mut App) {
    let app_handle = app.app_handle().clone();

    if let Some(clipa_window) = app_handle.get_webview_window("clipa") {
        let hwnd = clipa_window.hwnd().unwrap();

        unsafe {
            *WINDOW.lock().unwrap() = Some(clipa_window.clone());
            AddClipboardFormatListener(hwnd).unwrap();

            let prev_proc = GetWindowLongPtrW(hwnd, GWL_WNDPROC);
            ORIGINAL_WNDPROC = Some(prev_proc);
            SetWindowLongPtrW(hwnd, GWL_WNDPROC, clipboard_wndproc as isize);
        }

        let clipa_window_clone = clipa_window.clone();
        clipa_window.on_window_event(move |event| match event {
            WindowEvent::Focused(false) => {
                let state = app_handle.state::<Mutex<AppState>>();
                let state = state.lock().unwrap();
                if state.keep_visible {
                    clipa_window_clone.show().unwrap();
                } else {
                    clipa_window_clone.hide().unwrap();
                }
            }
            _ => (),
        });
    }
}
