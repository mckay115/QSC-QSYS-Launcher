# QSC-QSYS Version Selection Launcher
 Launcher program to select which version of the Q-Sys software to launch.

![screenshot](https://github.com/mckay115/QSC-QSYS-Launcher/blob/main/screenshots/icon.png?raw=true)
 
 
 
![screenshot](https://raw.githubusercontent.com/mckay115/QSC-QSYS-Launcher/main/screenshots/choice2.png?token=ABXNU2J4JIVAESPW6NSTDMLBQU3ES)


---


## Instructions

- [Download the latest release from GitHub](https://github.com/mckay115/QSC-QSYS-Launcher/releases/latest)
- To use the application simply save the "Q-Launcher.exe" to the location of your choice. (This is considered a portable installation for the time being, an installer version will be released at a later date.)
- Right click on a ".qsys" file and select open with.
- Navigate to the location of your "Q-Launcher.exe" and select it. Make sure to check "Always Open With" to allow the qsys files to open with the launcher every time.
- To open any file from that point simply double click the file and it will prompt you to select which version of Q-Sys Designer to use from your installed versions.


---
## Project Goals:

- Simplify interactions with multiple versions of Designer and multiple versions of firmware on installs.
    - [ ] When opening a file directly, only show compatible programs to open with (if opening a design file, only show designer versions to open with)
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