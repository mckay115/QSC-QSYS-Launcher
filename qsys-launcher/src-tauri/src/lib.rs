// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
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

    // Sort versions in ascending order using semantic versioning
    versions.sort_by(|a, b| {
        let a_nums = extract_version_numbers(&a.name);
        let b_nums = extract_version_numbers(&b.name);
        a_nums.cmp(&b_nums)
    });

    versions
}

// Helper function to extract version numbers for proper sorting
fn extract_version_numbers(name: &str) -> Vec<u32> {
    // Find all numbers in the version string (e.g., "Q-SYS Designer 9.13" -> [9, 13])
    let re = Regex::new(r"(\d+)").unwrap();
    re.find_iter(name)
        .filter_map(|m| m.as_str().parse::<u32>().ok())
        .collect()
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

// Extract version number from .qsys file content
fn get_version_from_file(file_path: &str) -> Option<String> {
    // Read file as binary
    let content = match fs::read(file_path) {
        Ok(bytes) => bytes,
        Err(e) => {
            println!("Error reading file: {}", e);
            return None;
        }
    };

    // Search for Version=X.X.X.X pattern in binary content
    // Convert to string lossy to handle any encoding
    let content_str = String::from_utf8_lossy(&content);
    
    // Use regex to find Version=X.X.X.X pattern (with or without quotes)
    let re = Regex::new(r#"Version="?(\d+(\.\d+)*)"?"#).unwrap();
    
    if let Some(captures) = re.captures(&content_str) {
        if let Some(version_match) = captures.get(1) {
            return Some(version_match.as_str().to_string());
        }
    }
    
    None
}

// Struct to hold file info passed to frontend
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct FileInfo {
    path: String,
    version: Option<String>,
}

// Command to get file info from app state
#[tauri::command]
fn get_file_info(state: tauri::State<FileInfo>) -> FileInfo {
    (*state).clone()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get file arg if present and create FileInfo
            let file_info = if let Some(file_path) = get_file_arg() {
                println!("Passing file argument: {}", file_path);

                // Extract version from the .qsys file
                let file_version = get_version_from_file(&file_path);
                if let Some(ref version) = file_version {
                    println!("Detected file version: {}", version);
                }

                FileInfo {
                    path: file_path,
                    version: file_version,
                }
            } else {
                FileInfo::default()
            };

            // Always manage state (even if empty)
            app.manage(file_info);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_installed_versions,
            launch_application,
            close_application,
            get_file_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
