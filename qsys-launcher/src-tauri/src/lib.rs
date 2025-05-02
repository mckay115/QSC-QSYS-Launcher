// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
use tauri::Emitter;
use tauri::Manager;

#[derive(Serialize, Deserialize, Debug)]
pub struct QSysVersion {
    name: String,
    path: String,
    exe_type: String,
}

// Function to check for installed QSC software versions
#[tauri::command]
fn get_installed_versions() -> Vec<QSysVersion> {
    let mut versions = Vec::new();

    if let Ok(program_files) = env::var("PROGRAMFILES") {
        let qsc_path = Path::new(&program_files).join("QSC");

        if qsc_path.exists() {
            if let Ok(entries) = fs::read_dir(qsc_path) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_dir() {
                        let version_name = path
                            .file_name()
                            .and_then(|name| name.to_str())
                            .unwrap_or("Unknown")
                            .to_string();

                        // Check for Designer executable - only include these
                        let designer_exe = path.join("Q-Sys Designer.exe");
                        if designer_exe.exists() {
                            versions.push(QSysVersion {
                                name: version_name.clone(),
                                path: designer_exe.to_string_lossy().to_string(),
                                exe_type: "Designer".to_string(),
                            });
                        }

                        // Skip UCI and Administrator executables
                        // If you want to enable them later, uncomment this code:
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

    // Close the app after launching
    std::thread::spawn(|| {
        std::thread::sleep(std::time::Duration::from_millis(500));
        std::process::exit(0);
    });

    Ok(())
}

// Command to close the window when the user cancels
#[tauri::command]
fn close_window() {
    std::process::exit(0);
}

// Get the file path from CLI arguments
fn get_file_arg() -> Option<String> {
    let args: Vec<String> = env::args().collect();
    let mut file_arg: Option<String> = None;

    // Look for --file argument followed by the actual file path
    for i in 0..args.len() {
        if args[i] == "--file" && i + 1 < args.len() {
            file_arg = Some(args[i + 1].clone());
            break;
        }
    }

    // If not found with --file flag, look for any .qsys file in arguments
    if file_arg.is_none() {
        for arg in args.iter().skip(1) {
            if arg.ends_with(".qsys") {
                file_arg = Some(arg.clone());
                break;
            }
        }
    }

    file_arg
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

                // Set a timeout to emit the file path to the frontend
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_millis(1000));
                    let _ = app_handle.emit("file-requested", file_path);
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_installed_versions,
            launch_application,
            close_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
