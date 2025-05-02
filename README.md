# QSC Q-Sys Launcher

A modern, Windows-native launcher for QSC Q-Sys software that makes it easy to select which version of Q-Sys software to run.

![QSC Q-Sys Launcher](screenshots/launcher-screenshot.png)

## Features

- **Clean Windows-native UI**: Seamlessly integrates with Windows using Fluent UI design
- **Version Detection**: Automatically detects all installed Q-Sys software versions
- **Smart Sorting**: Prioritizes Designer versions and sorts numerically
- **File Association**: Open .qsys files directly by associating them with the launcher
- **Keyboard Navigation**: Use arrow keys, Enter to launch, Escape to cancel
- **High DPI Support**: Proper scaling on high-resolution displays

## Usage

1. **Launch the application** either from the Start menu or by opening a .qsys file
2. **Select a version** from the list of installed Q-Sys software
3. **Launch** the selected version by clicking on it, pressing Enter, or clicking the Launch button

### Keyboard Shortcuts

- **Arrow Up/Down**: Navigate through versions
- **Enter**: Launch selected version
- **Escape**: Close the launcher

## Technical Details

This application is built with:

- **Tauri 2.0**: Lightweight, secure framework for building desktop apps
- **React**: Frontend UI framework
- **Fluent UI**: Microsoft's design system for Windows-like native experience
- **Rust**: Backend for system integration and file handling

## Development

### Prerequisites

- Node.js (v16+)
- Rust (latest stable)
- Tauri CLI

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run in development mode: `npm run tauri dev`

### Building

To build the application:

```
npm run tauri build
```

The installer will be created in the `target/release/bundle` directory.

## License

See LICENSE file for details.

---

*QSC and Q-Sys are trademarks of QSC Audio Products, LLC. This application is not affiliated with or endorsed by QSC.*

# QSC-QSYS Version Selection Launcher
 Launcher program to select which version of the Q-Sys software to launch.
<!--
![screenshot](https://github.com/mckay115/QSC-QSYS-Launcher/blob/main/screenshots/icon.png?raw=true)
 -->
 <p align="center">
  <img src="https://github.com/mckay115/QSC-QSYS-Launcher/blob/main/screenshots/icon-small.png?raw=true" />
</p>

 
 <!--
![screenshot](https://raw.githubusercontent.com/mckay115/QSC-QSYS-Launcher/main/screenshots/choice2.png?token=ABXNU2J4JIVAESPW6NSTDMLBQU3ES)
-->

<p align="center">
  <img src="https://raw.githubusercontent.com/mckay115/QSC-QSYS-Launcher/main/screenshots/choice2.png?token=ABXNU2J4JIVAESPW6NSTDMLBQU3ES" />
</p>

---


## Instructions

- [Download the latest release from GitHub](https://github.com/mckay115/QSC-QSYS-Launcher/releases/latest)
- To use the application simply save the "Q-Launcher.exe" to the location of your choice. (This is considered a portable installation for the time being, an installer version will be released at a later date.)
- Right click on a ".qsys" file and select open with.
- Navigate to the location of your "Q-Launcher.exe" and select it. Make sure to check "Always Open With" to allow the qsys files to open with the launcher every time.
- To open any file from that point simply double click the file and it will prompt you to select which version of Q-Sys Designer to use from your installed versions.


---
---
---
## Project Goals:

- Simplify interactions with multiple versions of Designer and multiple versions of firmware on installs.
    - [x] When opening a file directly, only show compatible programs to open with (if opening a design file, only show designer versions to open with)
- Create a tool that adds design managment and version coordination to the Q-Sys Designer Application
    - Create Project
        - Project Info/Settings:
            - Client
            - Location/Project Number
            - Project Template
                - Can be part of designer version selection
                - Can also allow a template file to be used (custom or included)
            - Designer version
        - Create Change Log at project creation
            - on close of designer or save of project ask for info on changes and automatically append to change log.
        - Setup / Manage a Projects Directory
            - Allow custom directory location and layout
        - Version project files
            - Create copied versions in a "repository" with proper version numbering
        - Allow "safe" upgrades between versions
            - Save a version of the file to be updated both before and after the version is updated and saved in Designer. Include proper version info in the name to identify the designer version.