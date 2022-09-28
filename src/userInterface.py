# All imports for the project
import os
import sys
from time import sleep, time
from pick import pick
import subprocess
import PySimpleGUI as sg

from qsysDesigner import *
from projectSystem import *


# Variables
program_version = 'v0.6[beta]'
programfiles = os.environ['PROGRAMFILES']
qsc_root_path = f'{programfiles}/QSC'
sg.theme('DefaultNoMoreNagging')

projectSystem = ProjectSystem()
projectList = projectSystem.projects


# GUI Setup
versions = check_installed_versions()
version_count = 0
for item in versions:
    version_count = version_count + 1


# GUI Layouts
version_selection = [
    [sg.Text('Select Designer version to open:')],
    *[[sg.Button(f'{versions[i]}')] for i in range(version_count)],
    [sg.Text('Other Applications:')],
    [sg.Button('Administrator'), sg.Button('UCI Viewer')]
    ]

# GUI Layouts
version_selection = [
    [sg.Text('Select Designer version to open:')],
    *[[sg.Button(f'{versions[i]}')] for i in range(version_count)],
    [sg.Text('Other Applications:')],
    [sg.Button('Administrator'), sg.Button('UCI Viewer')]
    ]

actionButtons = [
        [
            sg.Button('Open Folder', key='-OPENFOLDER-'),
            sg.Button('Open Design', key='-OPENDESIGN-'),
        ],
]

projectWindow = [
        [
            sg.Text('Project List:'),
            sg.Button('Refresh'),
        ],
        [
            sg.Listbox(projectList, enable_events=True, size=(35, 15), key='-FILELIST-'),
        ],
        [
            sg.Button('Import'),
            sg.Button('Export'),
            sg.Push(),
            sg.Button('New', key='-NEWPROJECT-'),
        ],
    ]

projectInfoPane = [
        [
            sg.Text('Project Information:'),
        ],
        [
            sg.Text('Project Name:'),
            sg.InputText(key='-PROJECTNAME-', s=35),
        ],
        [
            sg.Text('Project Number:'),
            sg.InputText(key='-PROJECTNUMBER-', s=35),
        ],
        [
            sg.Text('Project City:'),
            sg.InputText(key='-PROJECTCITY-', s=35),
        ],
        [
            sg.Text('Project State:'),
            sg.InputText(key='-PROJECTSTATE-', s=35),
        ],
        [
            sg.Text('Designer Version:'),
            sg.InputText(key='-DESIGNERVERSION-', s=35),
        ],
        [
            sg.Text('Design File Revision:'),
            sg.InputText(key='-DESIGNFILE-', s=35),
        ],
        [
            sg.Text('File Revision Date:'),
            sg.InputText(key='-DESIGNFILEDATE-', s=35),
        ],
        [
            sg.Text('Author:'),
            sg.InputText(key='-AUTHOR-', s=35),
        ],
        [
            sg.Button('Update Project Info', key='-UPDATEPROJECTINFO-'),
        ],
    ]

layout = [
    [
        sg.Column(projectWindow, element_justification='l', vertical_alignment='t'),
        sg.VSeperator(),
        sg.Column(projectInfoPane, element_justification='r', vertical_alignment='t'),
    ],
    [
        sg.Push(),
        sg.Button('Open Folder', key='-OPENFOLDER-'),
        sg.Button('Open Design', key='-OPENDESIGN-'),
    ],
]

# Main Program Sequence
if __name__ == "__main__":
    # Create the Window
    launcher_window = sg.Window('Q-Launcher', version_selection, element_justification='c', icon='screenshots\logo_OEB_icon.ico')
    # Event Loop to process "events" and get the "values" of the inputs
    while True:
        event, values = launcher_window.read()
        print(f'event:{event}, value:{values}')
        if event == sg.WIN_CLOSED: # if user closes window or clicks cancel
            break
        elif event == 'Administrator':
            currentVersion = versions[-1].split()
            currentVersion = currentVersion[-1]
            open_administrator(f'Q-SYS Administrator {currentVersion}')
            sleep(3)
            break
        elif event == 'UCI Viewer':
            open_uciViewer()
            sleep(3)
            break
        else:
            print(f'Opening the selected version of application: {event}')
            open_design_file(event)
            # open_application(event)
            sleep(3)
            break

    launcher_window.close()