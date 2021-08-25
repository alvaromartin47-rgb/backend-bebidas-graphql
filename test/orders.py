import unittest
from User import User

class Orders(unittest.TestCase):
    
    def testIniciarSesion(self):
        data = {
            "name":"Alvaro",
            "lastname": "Martin",
            "password": "riverplate2018",
            "email": "alvaro.martin1307@gmail.com",
            "phone": 2396603429
        }

        user = User(data)
        
        access_token = user.register()

        print(access_token)
    

unittest.main()