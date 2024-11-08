mod CreateProfile;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![create_profile_endpoint])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
use std::fs;
use serde::Deserialize;

const INSTALL_DIR: &str = "C:\\Users\\%USERNAME%\\AppData\\Roaming\\.modloader";

#[tauri::command]
async fn create_profile_endpoint(loader: String, profile_name: String, version: String) {
    CreateProfile::create_profile(loader.as_str(), profile_name.as_str(), version.as_str(), INSTALL_DIR);
}