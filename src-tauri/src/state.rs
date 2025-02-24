use std::time::Instant;

#[derive(Debug, Default)]
pub struct AppState {
    pub keep_visible: bool,
    pub shortcut_pressed_at: Option<Instant>,
}

impl AppState {
    pub fn init() -> Self {
        Self {
            keep_visible: true,
            shortcut_pressed_at: None,
        }
    }

    pub fn update_shortcut_press(&mut self) {
        self.shortcut_pressed_at = Some(Instant::now());
    }

    pub fn clear_shortcut_press(&mut self) {
        self.shortcut_pressed_at = None;
    }

    pub fn is_long_press(&self) -> bool {
        self.shortcut_pressed_at
            .map(|instant| instant.elapsed().as_millis() > 200)
            .unwrap_or(false)
    }
}
