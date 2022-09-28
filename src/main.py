# All imports for the project
import os
from time import sleep, time
from pick import pick
import PySimpleGUI as sg

from qsysDesigner import *

from projectSystem import *

# from userInterface import version_selection, actionButtons, projectWindow, projectInfoPane
from userInterface import layout


# Variables
program_version = 'v0.6[beta]'
programFiles = os.environ['PROGRAMFILES']
qsc_root_path = f'{programFiles}/QSC'
sg.theme('DefaultNoMoreNagging')


# projectSystem = ProjectSystem()
# projectList = projectSystem.projects


# # GUI Setup
# versions = check_installed_versions()
# version_count = 0
# for item in versions:
#     version_count = version_count + 1


# # GUI Layouts
# version_selection = [
#     [sg.Text('Select Designer version to open:')],
#     *[[sg.Button(f'{versions[i]}')] for i in range(version_count)],
#     [sg.Text('Other Applications:')],
#     [sg.Button('Administrator'), sg.Button('UCI Viewer')]
#     ]

# actionButtons = [
#         [
#             sg.Button('Open Folder', key='-OPENFOLDER-'),
#             sg.Button('Open Design', key='-OPENDESIGN-'),
#         ],
# ]

# projectWindow = [
#         [
#             sg.Text('Project List:'),
#             sg.Button('Refresh'),
#         ],
#         [
#             sg.Listbox(projectList, enable_events=True, size=(35, 15), key='-FILELIST-'),
#         ],
#         [
#             sg.Button('Import'),
#             sg.Button('Export'),
#             sg.Push(),
#             sg.Button('New', key='-NEWPROJECT-'),
#         ],
#     ]

# projectInfoPane = [
#         [
#             sg.Text('Project Information:'),
#         ],
#         [
#             sg.Text('Project Name:'),
#             sg.InputText(key='-PROJECTNAME-', s=35),
#         ],
#         [
#             sg.Text('Project Number:'),
#             sg.InputText(key='-PROJECTNUMBER-', s=35),
#         ],
#         [
#             sg.Text('Project City:'),
#             sg.InputText(key='-PROJECTCITY-', s=35),
#         ],
#         [
#             sg.Text('Project State:'),
#             sg.InputText(key='-PROJECTSTATE-', s=35),
#         ],
#         [
#             sg.Text('Designer Version:'),
#             sg.InputText(key='-DESIGNERVERSION-', s=35),
#         ],
#         [
#             sg.Text('Design File Revision:'),
#             sg.InputText(key='-DESIGNFILE-', s=35),
#         ],
#         [
#             sg.Text('File Revision Date:'),
#             sg.InputText(key='-DESIGNFILEDATE-', s=35),
#         ],
#         [
#             sg.Text('Author:'),
#             sg.InputText(key='-AUTHOR-', s=35),
#         ],
#         [
#             sg.Button('Update Project Info', key='-UPDATEPROJECTINFO-'),
#         ],
#     ]

# layout = [
#     [
#         sg.Column(projectWindow, element_justification='l', vertical_alignment='t'),
#         sg.VSeperator(),
#         sg.Column(projectInfoPane, element_justification='r', vertical_alignment='t'),
#     ],
#     [
#         sg.Push(),
#         sg.Button('Open Folder', key='-OPENFOLDER-'),
#         sg.Button('Open Design', key='-OPENDESIGN-'),
#     ],
# ]

# Main Program Sequence
if __name__ == "__main__":
    # Create the Window
    window = sg.Window('Q-Launcher', layout, icon='./screenshots/logo_OEB_icon.ico')
    projectSystem = ProjectSystem()
    # Event Loop to process "events" and get the "values" of the inputs
    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED: # if user closes window or clicks cancel
            break
        elif event == '-NEWPROJECT-':
            print('New Project')
            projectSystem.createProject('Template Project')
            sleep(1)
            projectList = projectSystem.listProjects()
            window['-FILELIST-'].update(projectList)
        elif event == 'Refresh':
            projectList = projectSystem.listProjects()
            window['-FILELIST-'].update(projectList)
            print('Refresh')
        elif event == '-FILELIST-':  # A file was chosen from the listbox
            try:
                global selection
                selection = values['-FILELIST-'][0]
                window['-PROJECTNAME-'].update(selection)
                window['-PROJECTNUMBER-'].update(projectSystem.readConfigFile(selection, key='projectNumber'))
                window['-PROJECTCITY-'].update(projectSystem.readConfigFile(selection, key='projectCity'))
                window['-PROJECTSTATE-'].update(projectSystem.readConfigFile(selection, key='projectState'))
                window['-DESIGNERVERSION-'].update(projectSystem.readConfigFile(selection, key='designerVersion'))
                window['-DESIGNFILE-'].update(projectSystem.readConfigFile(selection, key='designFile'))
                window['-DESIGNFILEDATE-'].update(projectSystem.readConfigFile(selection, key='designFileDate'))
                window['-AUTHOR-'].update(projectSystem.readConfigFile(selection, key='author'))
                # print(selection)
            except IndexError:
                sg.Popup('No Projects Found, Create a new project or import an existing one to begin.', no_titlebar=True, keep_on_top=True)
        elif event == '-OPENFOLDER-':
            try:
                os.startfile(projectSystem.rootProjectDir + '/' + selection)
            except:
                sg.Popup('No Project Selected', no_titlebar=True, keep_on_top=True)
            print('Open Folder')
        elif event == '-UPDATEPROJECTINFO-':
            projectSystem.updateConfigFile(projectName=selection, newProjectName=values['-PROJECTNAME-'], projectNumber=values['-PROJECTNUMBER-'], projectCity=values['-PROJECTCITY-'], projectState=values['-PROJECTSTATE-'], designerVersion=values['-DESIGNERVERSION-'], designFile=values['-DESIGNFILE-'], designFileDate=values['-DESIGNFILEDATE-'], author=values['-AUTHOR-'])
            print('Update Project Info')
            print(values['-PROJECTNAME-'], values['-PROJECTNUMBER-'], values['-PROJECTCITY-'], values['-PROJECTSTATE-'], values['-DESIGNERVERSION-'], values['-DESIGNFILEDATE-'], values['-AUTHOR-'])
            projectList = projectSystem.listProjects()
            window['-FILELIST-'].update(projectList)
        elif event == '-OPENDESIGN-':
            print('Open Design')
            try:
                if values['-DESIGNERVERSION-'] != "":
                    open_design_file(option=values['-DESIGNERVERSION-'])
                else:
                    print('No Designer Version Selected')
                    open_design_file()
            except Exception as e:
                print(e)
                sg.Popup('No Project Selected', no_titlebar=True, keep_on_top=True)

    window.close()