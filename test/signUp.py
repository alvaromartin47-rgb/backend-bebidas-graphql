import unittest
from entities.Register import Register
from entities.Petition import Petition

class SignUp(unittest.TestCase):
    data = {
        "name": "Alvaro",
        "lastname": "Martin",
        "password": "riverplate2018",
        "email": "alvaro.martin1307@gmail.com.ar"
    }

    def test00SignUp(self):
        accessToken = Register.register(self.data)

        self.assertTrue(accessToken)

        Register.deleteUser(accessToken)
    
    def test01AlRegistrarseDevuelveTokenQueNoTieneAccessoARecursoPing(self):
        accessToken = Register.register(self.data)
        
        query = '''
        {
            ping
        }
        '''
        
        petition = Petition(accessToken)
        response = petition.sendQuery(query)

        expected = "Token is invalid"
        message = response["errors"][0]["message"]
        
        self.assertEquals(message, expected)

        Register.deleteUser(accessToken)

    def test02AlRegistrarseDevuelveTokenQueNoTieneAccessoARecursoUpdateProfile(self):
        accessToken = Register.register(self.data)
        
        query = '''
        mutation {
            updateProfile(input: {
                name: "Juan Ignacio",
                lastname: "Coronel"
            }) {
                message
            }
        }
        '''
        
        petition = Petition(accessToken)
        response = petition.sendQuery(query)

        expected = "Token is invalid"
        message = response["errors"][0]["message"]
        
        self.assertEquals(message, expected)

        Register.deleteUser(accessToken)

    def test03AlRegistrarseSeAgregaUnNuevoUsuarioALaBaseDeDatos(self):
        accessToken = Register.register(self.data)
        
        query = '''
        {
            profile {
                name
                lastname
                email
            }
        }
        '''

        petition = Petition(accessToken)
        response = petition.sendQuery(query)
        
        content = response["data"]["profile"][0]

        self.assertEquals(content["name"], self.data_user["name"])
        self.assertEquals(content["lastname"], self.data_user["lastname"])
        self.assertEquals(content["email"], self.data_user["email"])

        Register.deleteUser(accessToken)

    def test04AlRegistrarseElUsuarioHaceLogoutYSeInhabilitaElToken(self):
        accessToken = Register.register(self.data)
        
        query = '''
        {
            logout {
                message
            }
        }
        '''

        petition = Petition(accessToken)
        response = petition.sendQuery(query)
        
        content = response["data"]["logout"]
        expected = ""

        self.assertEquals(expected, content["message"])
        
        response = petition.sendQuery(query)
        recived = response["errors"]["message"]
        expected = "Token is invalid"

        self.assertEquals(expected, recived)

        Register.deleteUser(accessToken)


##########################################################################################

if __name__ == '__main__':
    unittest.main()