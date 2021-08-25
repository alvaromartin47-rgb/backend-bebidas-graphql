from Register import Register

class User:
    
    def __init__(self, data):
        self.data = data

    def register(self):
        registrator = Register(self.data)
        registrator.register()