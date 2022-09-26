import os


rootProjectDir = "QSYS-Projects"

class Project:
    #initilization of the project with the name and the path located in a folder named QSYS-Projects
    def __init__(self, name):
        self.name = name
        self.path = f'{name}'
        self.files = []
        self.folders = []

    # create a project with the name and the path then create the directory and the folders and files
    def createProject(self):
        if os.path.exists(rootProjectDir):
            os.chdir(rootProjectDir)
        else:
            os.mkdir(rootProjectDir)
            os.chdir(rootProjectDir)
        if os.path.exists(self.path):
            print(f'Project {self.name} already exists')
        else:
            os.mkdir(self.path)
            os.chdir(self.path)
            self.createProjectReadme()
            for folder in self.folders:
                os.mkdir(folder)
            for file in self.files:
                open(file, 'w')
            self.createProjectReadme()

    def createProjectReadme(self):
        with open('README.md', 'w') as readme:
            readme.write(f'# {self.name}\n\n')
            readme.write(f'Path: `{self.path}`\n\n')
            readme.write(f'Files: `{self.files}`\n\n')
            readme.write(f'Folders: `{self.folders}`\n')

if __name__ == "__main__":
    project = Project(input('Project Name: '))
    project.folders = ["resources", ".backup-rev"]
    project.files = ["testproject.qsys", "Readme.md"]
    project.createProject()