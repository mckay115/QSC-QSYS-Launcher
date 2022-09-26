# All imports for the project
import os
import sys
from time import sleep, time
from pick import pick
import subprocess
import PySimpleGUI as sg

from main import qsc_root_path, file_to_open

# Try to asign the file if any
def file_to_open():
    print('checking')
    if len(sys.argv) > 1:
        print("argument")
        return True
    else:
        print("no argument")
        return False

def filter_dict(list, filter_string):
    if filter_string in list:
        return True
    else:
        return False


# Check for Installed Versions
def check_installed_versions(filter="Designer"):
    versions = os.listdir(qsc_root_path)
    filtered_versions = []
    for item in versions:
        if os.path.isfile(f'{qsc_root_path}/{item}/Q-Sys Designer.exe'):
            print(f'{item} is Installed')
        elif os.path.isfile(f'{qsc_root_path}/{item}/uci.exe'):
            print(f'{item} is Installed')
        elif os.path.isfile(f'{qsc_root_path}/{item}/Q-Sys Administrator.exe'):
            print(f'{item} is Installed')
        else:
            print(f'Application folder found but {item} not Installed.')
    # filtered_versions = filter(filter_dict(d, some_string), versions)
    for item in versions:
        if filter in item:
            filtered_versions.append(item)
        else:
            pass
    return filtered_versions



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