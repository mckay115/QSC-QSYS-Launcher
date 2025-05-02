// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
use tauri::Manager;

#[derive(serde::Serialize, Clone)]
struct QSysVersion {
    name: String,
    path: String,
    exe_type: String,
}

// Function to check for installed QSC software versions
#[tauri::command]
fn get_installed_versions() -> Result<Vec<QSysVersion>, String> {
    let mut versions = Vec::new();

    if let Ok(program_files) = env::var("PROGRAMFILES") {
        let qsc_path = Path::new(&program_files).join("QSC");

        if !qsc_path.exists() {
            return Err("QSC directory not found in Program Files".to_string());
        }

        match fs::read_dir(&qsc_path) {
            Ok(entries) => {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_dir() {
                        let version_name = path
                            .file_name()
                            .and_then(|name| name.to_str())
                            .unwrap_or("Unknown")
                            .to_string();

                        // Check for Designer executable - only add these by default
                        let designer_exe = path.join("Q-Sys Designer.exe");
                        if designer_exe.exists() {
                            versions.push(QSysVersion {
                                name: version_name.clone(),
                                path: designer_exe.to_string_lossy().to_string(),
                                exe_type: "Designer".to_string(),
                            });
                            continue;
                        }

                        // Skip UCI and Administrator executables by default
                        // Uncomment these if you want to show them in the future
                        /*
                        // Check for UCI executable
                        let uci_exe = path.join("uci.exe");
                        if uci_exe.exists() {
                            versions.push(QSysVersion {
                                name: version_name.clone(),
                                path: uci_exe.to_string_lossy().to_string(),
                                exe_type: "UCI".to_string(),
                            });
                            continue;
                        }

                        // Check for Administrator executable
                        let admin_exe = path.join("Q-Sys Administrator.exe");
                        if admin_exe.exists() {
                            versions.push(QSysVersion {
                                name: version_name,
                                path: admin_exe.to_string_lossy().to_string(),
                                exe_type: "Administrator".to_string(),
                            });
                        }
                        */
                    }
                }
            }
            Err(e) => {
                return Err(format!("Error reading QSC directory: {}", e));
            }
        }
    } else {
        return Err("PROGRAMFILES environment variable not found".to_string());
    }

    if versions.is_empty() {
        return Err("No Q-Sys Designer installations found".to_string());
    }

    // Sort versions in descending order (newest/highest first)
    versions.sort_by(|a, b| b.name.to_lowercase().cmp(&a.name.to_lowercase()));

    Ok(versions)
}

// Function to launch the selected version with an optional file
#[tauri::command]
fn launch_application(path: &str, file_path: Option<String>) -> Result<(), String> {
    let mut command = Command::new(path);

    // Add the file argument if provided
    if let Some(file) = file_path {
        // Verify file exists
        if !Path::new(&file).exists() {
            return Err(format!("File does not exist: {}", file));
        }
        command.arg(file);
    }

    match command.spawn() {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to launch application: {}", e)),
    }
}

// Main application entry point
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Get command line arguments
            let args: Vec<String> = env::args().collect();

            // If we have more than one argument, it might be a file path
            if args.len() > 1 {
                let file_path = &args[1];

                // Make sure it exists and has the .qsys extension
                if Path::new(file_path).exists() && file_path.to_lowercase().ends_with(".qsys") {
                    // Store the file path in app state
                    app.manage(tauri::State::new(file_path.clone()));

                    // Make it available to the window event
                    let file_path_clone = file_path.clone();
                    let window = app.get_window("main").unwrap();
                    window.once_ready(move |_| {
                        let _ = window.emit("ready", file_path_clone);
                    });
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_installed_versions,
            launch_application
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
