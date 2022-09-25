import os


class Project:
    #initilization of the project with the name and the path
    def __init__(self, name, path):
        self.name = name
        self.path = path
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