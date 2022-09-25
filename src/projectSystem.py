import os


rootProjectDir = "QSYS-Projects"

class Project:
    #initilization of the project with the name and the path
    def __init__(self, name, path):
        self.name = name
        self.path = f'{path}'
        self.files = []
        self.folders = []

    # create a project with the name and the path then create the directory and the folders and files
    def createProject(self):
        os.mkdir(self.path)
        os.chdir(self.path)
        for folder in self.folders:
            os.mkdir(folder)
        for file in self.files:
            open(file, 'w')
        self.createProjectReadme()

    def createProjectReadme(self):
        with open('README.md', 'w') as readme:
            readme.write(f'# {self.name}\n')
            readme.write(f'Path: {self.path}\n')
            readme.write(f'Files: {self.files}\n')
            readme.write(f'Folders: {self.folders}\n')

if __name__ == "__main__":
    project = Project("ProjectName-Test", "ProjectName-Test-Milwaukee-WI")
    project.folders = ["resources", ".backup-rev"]
    project.files = ["testproject.qsys", "Readme.md"]
    project.createProject()