import json
import os

configuration_information = {}

def create_configuration():
    configuration_information = {}
    configuration_information['projects'] = {'project_name': 'test_project', 'project_directory': 'C:\\Users\\zlisko\\OneDrive - Lamacchia Group\\Desktop\\qsys-catcher\\QSC-QSYS-Launcher\\template_design.qsys'}
    with open('config', 'w') as f:
        json.dump(configuration_information, f)

def check_for_configuration():
    config_location = 'config'
    if os.path.exists(config_location):
        config = open(config_location)
        config = json.load(config)
        print('Configruation file found.')
        print(config)
    else:
        print('Configuration file not found.')
        create_configuration()




if __name__ == "__main__":
    check_for_configuration()