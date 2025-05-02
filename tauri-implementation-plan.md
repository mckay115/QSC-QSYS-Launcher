# QSC-QSYS Launcher Tauri 2.0 Implementation Plan

## Overview
Recreate the QSC-QSYS version selection launcher in Tauri 2.0 with a modern, Windows native UI feel.

## Core Features
1. Scan for installed QSC Q-Sys software versions
2. Display available versions in a clean, modern UI
3. Launch selected version
4. Open specific .qsys files with the selected version
5. File association support for .qsys files

## Technology Stack
- **Backend**: Rust (Tauri)
- **Frontend**: React with [Windows UI Library](https://www.npmjs.com/package/@microsoft/windows-ui) or [Fluent UI React](https://developer.microsoft.com/en-us/fluentui#/get-started) for native Windows appearance
- **Build**: Tauri CLI

## Project Structure
```
qsys-launcher/
├── src/ (Rust backend)
│   ├── main.rs (Main Tauri application entry)
│   └── commands.rs (Custom Tauri commands)
├── src-ui/ (Frontend)
│   ├── App.tsx (Main application component)
│   ├── components/ (UI components)
│   │   ├── VersionSelector.tsx (Version selection UI)
│   │   └── Header.tsx (Application header)
│   ├── styles/ (CSS/styling)
│   └── utils/ (Helper functions)
├── public/ (Static assets)
│   └── icons/ (Application icons)
└── tauri.conf.json (Tauri configuration)
```

## Implementation Steps

### 1. Project Setup
- Initialize new Tauri 2.0 project with React template
- Configure application metadata and icons
- Setup Windows file associations for .qsys files

### 2. Backend Implementation (Rust)
- Create function to scan Program Files for Q-Sys software versions
- Implement command to launch selected version
- Add file handling for .qsys files passed as arguments
- Setup application configuration storage

### 3. Frontend Implementation (React + Fluent UI)
- Create a modern UI with Windows native styling
- Implement version selection interface
- Add loading indicators and error handling
- Design responsive layout for different window sizes

### 4. File Association Support
- Register as a handler for .qsys files
- Process file paths passed on application launch
- Allow setting as default application

### 5. Packaging and Distribution
- Configure application bundling
- Create installer with file associations
- Setup automatic updates (optional)

## Windows Native UI Elements
- Use Mica/Acrylic material for background
- Implement Windows 11 rounded corners
- Use system accent colors
- Follow Windows design guidelines for spacing and typography
- Add animations for smooth transitions
- Support light/dark mode based on system settings

## Enhanced Features (Beyond Current Implementation)
- Add recently opened files list
- Create settings panel for customization
- Implement version comparison feature
- Add sorting/filtering of versions
- Create project management features as outlined in original README goals 