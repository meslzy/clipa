use tauri::WebviewWindow;
use windows::Win32::System::DataExchange::{
    AddClipboardFormatListener, RemoveClipboardFormatListener,
};

use crate::clipboard::set_clipboard_content;

#[tauri::command]
pub fn set_clipboard_command(webview_window: WebviewWindow, kind: String, content: String) {
    let hwnd = webview_window.hwnd().unwrap();

    unsafe {
        RemoveClipboardFormatListener(hwnd).unwrap();
        set_clipboard_content(hwnd, kind, content);
        AddClipboardFormatListener(hwnd).unwrap();
    }
}
