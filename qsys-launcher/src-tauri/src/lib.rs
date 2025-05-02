// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
use std::sync::Arc;
use tauri::Emitter;
use tauri::Manager;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct QSysVersion {
    name: String,
    path: String,
    exe_type: String,
}

// Function to check for installed QSC software versions - optimized
#[tauri::command]
fn get_installed_versions() -> Vec<QSysVersion> {
    let mut versions = Vec::with_capacity(10); // Pre-allocate capacity

    if let Ok(program_files) = env::var("PROGRAMFILES") {
        let qsc_path = Path::new(&program_files).join("QSC");

        if qsc_path.exists() {
            if let Ok(entries) = fs::read_dir(qsc_path) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if !path.is_dir() {
                        continue;
                    }

                    // Get version name
                    let version_name = match path.file_name().and_then(|name| name.to_str()) {
                        Some(name) => name.to_string(),
                        None => continue, // Skip if we can't get a name
                    };

                    // Check for Designer executable - only include these
                    let designer_exe = path.join("Q-Sys Designer.exe");
                    if designer_exe.exists() {
                        versions.push(QSysVersion {
                            name: version_name,
                            path: designer_exe.to_string_lossy().to_string(),
                            exe_type: "Designer".to_string(),
                        });
                    }
                }
            }
        }
    }

    // Sort versions in descending order (highest/newest version at the top)
    versions.sort_by(|a, b| b.name.to_lowercase().cmp(&a.name.to_lowercase()));

    versions
}

// Function to launch the selected version with an optional file
#[tauri::command]
fn launch_application(path: &str, file_path: Option<String>) -> Result<(), String> {
    let mut command = Command::new(path);

    if let Some(file) = file_path {
        command.arg(file);
    }

    command
        .spawn()
        .map_err(|e| format!("Failed to launch application: {}", e))?;

    // Close the app after launching - reduced delay for faster response
    std::thread::spawn(|| {
        std::thread::sleep(std::time::Duration::from_millis(300));
        std::process::exit(0);
    });

    Ok(())
}

// Command to close the application when the user cancels
#[tauri::command]
fn close_application() {
    std::process::exit(0);
}

// Get the file path from CLI arguments - optimized
fn get_file_arg() -> Option<String> {
    let args: Vec<String> = env::args().collect();

    // First check for .qsys file in arguments (most common case)
    for arg in args.iter().skip(1) {
        if arg.ends_with(".qsys") {
            return Some(arg.clone());
        }
    }

    // Then look for --file argument followed by the actual file path
    for i in 0..args.len().saturating_sub(1) {
        if args[i] == "--file" {
            return Some(args[i + 1].clone());
        }
    }

    None
}

// Simple struct to store file path in app state
struct FilePath(String);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get file arg if present
            if let Some(file_path) = get_file_arg() {
                // Store the file path in app state
                println!("Passing file argument: {}", file_path);

                // Create app state with file path
                app.manage(FilePath(file_path.clone()));

                // Get a handle to the app to emit events
                let app_handle = app.app_handle().clone();
                let file_path_arc = Arc::new(file_path);

                // Set a timeout to emit the file path to the frontend - reduced delay
                let file_path_clone = Arc::clone(&file_path_arc);
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_millis(500));
                    let _ = app_handle.emit("file-requested", (*file_path_clone).clone());
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_installed_versions,
            launch_application,
            close_application
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
