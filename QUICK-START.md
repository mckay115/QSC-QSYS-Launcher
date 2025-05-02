# QSC Q-Sys Launcher - Quick Start Guide

This guide will help you get the QSC Q-Sys Launcher Tauri application up and running for development.

## Prerequisites

1. **Rust and Cargo**
   - Install Rust from [rust-lang.org](https://www.rust-lang.org/tools/install)
   - Verify installation with `rustc --version` and `cargo --version`

2. **Node.js and npm**
   - Install Node.js from [nodejs.org](https://nodejs.org/) (LTS version recommended)
   - Verify installation with `node --version` and `npm --version`

3. **Tauri CLI**
   - Install with `npm install -g @tauri-apps/cli`
   - Verify installation with `tauri --version`

4. **Additional Windows dependencies**
   - Microsoft Visual C++ Build Tools
   - WebView2

## Project Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/qsc-qsys-launcher.git
   cd qsc-qsys-launcher
   ```

2. **Install frontend dependencies**
   ```bash
   cd src-ui
   npm install
   cd ..
   ```

3. **Build and run in development mode**
   ```bash
   npm run tauri dev
   ```

4. **Build for production**
   ```bash
   npm run tauri build
   ```

## Project Structure

- `src/` - Rust backend code
- `src-ui/` - React frontend code
- `public/` - Static assets
- `tauri.conf.json` - Tauri configuration

## Development Tasks

- **Update UI components**: Edit files in the `src-ui/` directory
- **Modify backend logic**: Edit files in the `src/` directory
- **Configure app settings**: Edit the `tauri.conf.json` file

## File Associations

The app is configured to handle `.qsys` files. After installation, you can:

1. Right-click on a `.qsys` file
2. Select "Open with..." and choose QSC Q-Sys Launcher
3. Check "Always use this app" to set as default

## Building the Installer

The production build will create an installer that sets up file associations automatically:

```bash
npm run tauri build
```

The installer will be located in the `src-tauri/target/release/bundle/` directory.

## Troubleshooting

- **Missing dependencies**: Run `npm install` in the `src-ui` directory
- **Rust compiler errors**: Make sure Rust is up to date with `rustup update`
- **Windows file permission errors**: Run the command prompt/PowerShell as Administrator 