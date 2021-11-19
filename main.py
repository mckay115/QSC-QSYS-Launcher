# All imports for the project
import os
import sys
from pyfiglet import Figlet
from pick import pick
import time
import subprocess


# Variables
program_version = 'v0.0.1[alpha]'
programfiles = os.environ['PROGRAMFILES']
qsc_root_path = f'{programfiles}/QSC'

# Try to asign the file if any
try:
    file_to_open = sys.argv[1]
except IndexError:
    print(f'File not indicated to open, moving to standard launcher.')
    pass


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




# Startup Functions Called
def startup_initilize():
    title_heading = Figlet(font='cybermedium')
    print('')
    print('')
    print(title_heading.renderText('Q-Sys Launcher'))
    print(program_version)
    print('Author: Zach Lisko')
    print('Copyright (C) 2021, Zach Lisko')
    print('')
    print('')
    print('')
    print('')
    time.sleep(3)


# Launch with Selected Options
def launch_selection():
    title = 'Please select the version of Q-SYS Designer you wish to launch.'
    options = os.listdir(qsc_root_path)
    option, index = pick(options, title)
    try:
        # os.startfile(f'{qsc_root_path}/{option}/Q-Sys Designer.exe')
        subprocess.Popen([f'{qsc_root_path}/{option}/Q-Sys Designer.exe', file_to_open])
    except FileNotFoundError:
        try:
            os.startfile(f'{qsc_root_path}/{option}/uci.exe')
        except FileNotFoundError:
            os.startfile(f'{qsc_root_path}/{option}/Q-Sys Administrator.exe')
        else:
            pass




# Main Program Sequence
if __name__ == "__main__":
    startup_initilize()
    launch_selection()