# All imports for the project
import os
import sys
from time import sleep, time
from pick import pick
import subprocess
import PySimpleGUI as sg


# Variables
program_version = 'v0.0.1[alpha]'
programfiles = os.environ['PROGRAMFILES']
qsc_root_path = f'{programfiles}/QSC'
sg.theme('DarkGrey6')


# Try to asign the file if any
def file_to_open():
    print('checking')
    if len(sys.argv) > 1:
        print("argument")
        return True
    else:
        print("no argument")
        return False

# Check for Installed Versions
def check_installed_versions():
    versions = os.listdir(qsc_root_path)
    for item in versions:
        if os.path.isfile(f'{qsc_root_path}/{item}/Q-Sys Designer.exe'):
            print(f'{item} is Installed')
        elif os.path.isfile(f'{qsc_root_path}/{item}/uci.exe'):
            print(f'{item} is Installed')
        elif os.path.isfile(f'{qsc_root_path}/{item}/Q-Sys Administrator.exe'):
            print(f'{item} is Installed')
        else:
            print(f'Application folder found but {item} not Installed.')
    return versions



# Launch with Selected Options
def open_design_file(option):
    if file_to_open():
        file = sys.argv[1]
        try:
            subprocess.Popen([f'{qsc_root_path}/{option}/Q-Sys Designer.exe', file])
        except FileNotFoundError:
            try:
                os.startfile(f'{qsc_root_path}/{option}/uci.exe')
            except FileNotFoundError:
                os.startfile(f'{qsc_root_path}/{option}/Q-Sys Administrator.exe')
            else:
                pass
    else:
        subprocess.Popen([f'{qsc_root_path}/{option}/Q-Sys Designer.exe'])

def open_application(option):
    subprocess.Popen([f'{qsc_root_path}/{option}/Q-Sys Designer.exe'])

# Startup Functions Called
def startup_initilize(program_version):
    print('Q-Launcher')
    print(program_version)
    print('Author: Zach Lisko')


# GUI Setup
versions = os.listdir(qsc_root_path)
version_count = 0
for item in versions:
    version_count = version_count + 1


# GUI Layouts
version_selection = [  [sg.Text('Select the version to open:')],
           *[[sg.Button(f'{versions[i]}')] for i in range(version_count)]]

# Main Program Sequence
if __name__ == "__main__":
    # startup_initilize(program_version)
    # if file_to_open():
    # Create the Window
    window = sg.Window('Q-Launcher', version_selection, element_justification='c')
    # Event Loop to process "events" and get the "values" of the inputs
    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED: # if user closes window or clicks cancel
            break
        else:
            print(f'Opening the selected version of application: {event}')
            open_design_file(event)
            sleep(3)
            break

    window.close()