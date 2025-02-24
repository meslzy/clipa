use std::sync::Mutex;

use tauri::{App, Manager, Result};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

use crate::{state::AppState, window::toggle_clipa};

pub fn register_global_shortcut(app: &mut App) -> Result<()> {
    let toggle_shortcut = Shortcut::new(Some(Modifiers::SUPER), Code::Backquote);
    let app_handle = app.handle();

    app_handle.plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |app, shortcut, event| {
                if shortcut == &toggle_shortcut {
                    let state = app.state::<Mutex<AppState>>();
                    let mut state = state.lock().unwrap();

                    match event.state() {
                        ShortcutState::Pressed => {
                            state.update_shortcut_press();
                            toggle_clipa(app);
                        }
                        ShortcutState::Released => {
                            if state.is_long_press() {
                                toggle_clipa(app);
                            }
                            state.clear_shortcut_press();
                        }
                    }
                }
            })
            .build(),
    )?;

    app.global_shortcut().register(toggle_shortcut).unwrap();

    Ok(())
}
