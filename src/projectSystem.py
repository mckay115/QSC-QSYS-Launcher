import os
import json

class ProjectSystem:
    def __init__(self):
        self.projects = self.listProjects()
        self.documentsFolder = os.environ['HOMEPATH'] + "/Documents"
        self.qscDocsFolder = self.documentsFolder + "/QSC"
        self.rootProjectDir = self.qscDocsFolder + "/Q-Sys Projects"

    def listProjects(self):
        projectsFolder = os.environ['HOMEPATH'] + "/Documents" + "/QSC" + "/Q-Sys Projects"
        if os.path.exists(projectsFolder):
            os.chdir(projectsFolder)
            return os.listdir()
        else:
            print('No projects found')

    # read and return the info from the config file
    def readConfigFile(self, projectName, key=None):
        if key != None:
            if os.path.exists(self.rootProjectDir):
                os.chdir(self.rootProjectDir)
                if os.path.exists(projectName):
                    os.chdir(projectName)
                    if os.path.exists('config.json'):
                        with open('config.json', 'r') as config:
                            data = json.load(config)
                            try:
                                return data[key]
                            except KeyError:
                                print(f'Key {key} does not exist')
                    else:
                        print(f'Project {projectName} does not have a config file')
                else:
                    print(f'Project {projectName} does not exist')
            else:
                print('No projects found')

    #if json file exists in project folder read it and update it else create it
    def updateConfigFile(self, projectName, newProjectName, projectNumber, projectCity, projectState, designerVersion, designFile, designFileDate, author):
        # if project name dosent match newProjectName then rename the project folder
        if projectName != newProjectName:
            os.chdir(self.rootProjectDir)
            os.rename(projectName, newProjectName)
            projectName = newProjectName
        if os.path.exists(self.rootProjectDir):
            os.chdir(self.rootProjectDir)
            if os.path.exists(projectName):
                os.chdir(projectName)
                if os.path.exists('config.json'):
                    with open('config.json', 'r') as config:
                        data = json.load(config)
                        data['projectName'] = projectName
                        data['projectNumber'] = projectNumber
                        data['projectCity'] = projectCity
                        data['projectState'] = projectState
                        data['designerVersion'] = designerVersion
                        data['designFileDate'] = designFileDate
                        data['designFile'] = designFile
                        data['author'] = author
                    with open('config.json', 'w') as config:
                        json.dump(data, config, indent=4)
                else:
                    with open('config.json', 'w') as config:
                        data = {}
                        data['projectName'] = projectName
                        data['projectNumber'] = projectNumber
                        data['projectCity'] = projectCity
                        data['projectState'] = projectState
                        data['designerVersion'] = designerVersion
                        data['designFileDate'] = designFileDate
                        data['designFile'] = designFile
                        data['author'] = author
                        json.dump(data, config, indent=4)
            else:
                print(f'Project {projectName} does not exist')
        
    # create a new project folder and config file
    def createProject(self, projectName):
        if os.path.exists(self.rootProjectDir):
            os.chdir(self.rootProjectDir)
            if not os.path.exists(projectName):
                os.mkdir(projectName)
                os.chdir(projectName)
                with open('config.json', 'w') as config:
                    data = {}
                    data['project_name'] = projectName
                    data['folders'] = ['.backup', 'resources']
                    data['files'] = [f'{projectName}.qsys', 'config.json']
                    json.dump(data, config, indent=4)
            else:
                print(f'Project {projectName} already exists')
        else:
            print('No projects found')

# create a new project from a template
# list all projects in the project directory
# remove a project
# list the details of a project
# update the details of a project

if __name__ == "__main__":
    print('This is a module, please import it into your program.')
