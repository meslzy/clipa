mod clipboard;
mod commands;
mod shortcuts;
mod state;
mod tray;
mod window;

use std::sync::Mutex;

use shortcuts::register_global_shortcut;
use state::AppState;
use tray::setup_tray;
use window::setup_clipa;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(AppState::init()))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![commands::set_clipboard_command])
        .setup(|app| {
            setup_clipa(app);
            setup_tray(app);
            register_global_shortcut(app).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
