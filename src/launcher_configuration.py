import json
import os
import datetime

configuration_information = {}

def write_json(new_data, filename='config'):
    with open('config', 'r') as file:
        

def create_configuration():
    data = {'configuration_creation_timestamp':str(datetime.datetime.now())}
    header = 'settings'
    write_json(data, header)

def check_for_configuration():
    config_location = 'config'
    if os.path.exists(config_location):
        config = open(config_location)
        config = json.load(config)
        print('Configruation file found.')
        print(config)
        return config
    else:
        print('Configuration file not found.')
        create_configuration()


def add_project_to_configuration(project_name='template_project', project_directory='C:\\Users\\zlisko\\OneDrive - Lamacchia Group\\Desktop\\qsys-catcher\\QSC-QSYS-Launcher\\template_design.qsys', project_number=''):
    project_information = {
            'project_name': project_name, 
            'project_directory': project_directory, 
            'project_number': project_number, 
            'timestamp': str(datetime.datetime.now())
            }
    write_json(project_information)



if __name__ == "__main__":
    write_json({'test': 'testing'})
    # check_for_configuration()
    # add_project_to_configuration(project_name='tester', project_number='181820')
    # add_project_to_configuration(project_name='tester1', project_number='18567')
    # add_project_to_configuration(project_name='tester2', project_number='184242')