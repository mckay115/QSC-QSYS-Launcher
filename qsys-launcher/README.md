# QSC Q-Sys Launcher

A modern Tauri-based application for selecting and launching the correct version of QSC Q-Sys software. Built with a native Windows feel using Fluent UI components.

## Features

- **Native Windows Look & Feel**: Uses Fluent UI React components for authentic Windows appearance
- **Automatic Detection**: Scans for all installed QSC Q-Sys software versions
- **Version Selection**: Lets you choose which version to launch
- **File Association**: Can be set as the default application for .qsys files
- **Light/Dark Mode**: Automatically adapts to your system theme preferences

## Screenshots

![QSC Q-Sys Launcher - Light Mode](screenshots/app-light.png)
![QSC Q-Sys Launcher - Dark Mode](screenshots/app-dark.png)

## Development

### Prerequisites

1. **Rust and Cargo**
   - Install Rust from [rust-lang.org](https://www.rust-lang.org/tools/install)
   - Verify installation with `rustc --version` and `cargo --version`

2. **Node.js and npm**
   - Install Node.js from [nodejs.org](https://nodejs.org/) (LTS version recommended)
   - Verify installation with `node --version` and `npm --version`

3. **Additional Windows dependencies**
   - Microsoft Visual C++ Build Tools
   - WebView2

### Running the Application in Development Mode

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

## Building for Production

To create a production build with an installer:

```bash
npm run tauri build
```

The installer will be located in the `src-tauri/target/release/bundle/` directory.

## Setting Up File Associations

While the application includes built-in file association capabilities, you need to set it as the default handler for .qsys files:

1. Right-click on any .qsys file
2. Select "Open with" → "Choose another app"
3. Browse to the QSC Q-Sys Launcher executable
4. Check "Always use this app to open .qsys files"

## Technical Notes

This application is built with:

- **Tauri 2.0**: For the cross-platform application framework
- **Rust**: For the backend functionality
- **React**: For the frontend UI
- **Fluent UI React**: For Windows-native styling components

## Future Enhancements

- Add recently used files list
- Implement version comparison features
- Support for additional QSC file types
- Add project management capabilities
