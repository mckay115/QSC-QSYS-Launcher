# All imports for the project
import os
import sys
from time import sleep, time
from pick import pick
import subprocess
import PySimpleGUI as sg

from qsysDesigner import *


# Variables
program_version = 'v0.6[beta]'
programfiles = os.environ['PROGRAMFILES']
qsc_root_path = f'{programfiles}/QSC'
sg.theme('DefaultNoMoreNagging')

# Startup Functions Called
# def startup_initilize(program_version):
#     print('Q-Launcher')
#     print(program_version)
#     print('Author: Zach Lisko')


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

# Main Program Sequence
if __name__ == "__main__":
    # startup_initilize(program_version)
    # if file_to_open():
    # Create the Window
    window = sg.Window('Q-Launcher', version_selection, element_justification='c', icon='screenshots\logo_OEB_icon.ico')
    # Event Loop to process "events" and get the "values" of the inputs
    while True:
        event, values = window.read()
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

    window.close()