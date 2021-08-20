import requests
import unittest

class SignUp(unittest.TestCase):
    data_user = {
        "name": "Alvaro",
        "lastname": "Martin",
        "password": "riverplate2018",
        "email": "alvaro.martin1307@gmail.com.ar"
    }

    url = "http://localhost:4000/"

    access_token_signUp = get_token_signUp(url, data_user)
    
    def test01AlRegistrarseDevuelveTokenQueNoTieneAccessoARecursoPing(self):
        query = '''
        {
            ping
        }
        '''
        
        response = _query(self.url, query, self.access_token_signUp)

        expected = "Token is invalid"
        message = response["errors"][0]["message"]
        
        self.assertEquals(message, expected)

    def test02AlRegistrarseDevuelveTokenQueNoTieneAccessoARecursoUpdateProfile(self):
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
        
        response = _query(self.url, query, self.access_token_signUp)

        expected = "Token is invalid"
        message = response["errors"][0]["message"]
        
        self.assertEquals(message, expected)

    def testAlRegistrarseSeAgregaUnNuevoUsuarioALaBaseDeDatos(self):
        query = '''
        {
            users(filters: {
                email: "alvaro.martin1307@gmail.com.ar"
            }) {
                name
                lastname
                email
            }
        }
        '''

        response = _query(self.url, query, self.access_token_signUp)

        content = response["data"]["users"][0]

        self.assertEquals(content["name"], self.data_user["name"])
        self.assertEquals(content["lastname"], self.data_user["lastname"])
        self.assertEquals(content["email"], self.data_user["email"])

# Auxiliars

def get_token_signUp(url, data_user):
    mutation = '''
    mutation {
        signUp(input: {
            name: "Alvaro",
            lastname: "Martin",
            password: "riverplate2018",
            email: "alvaro.martin1307@gmail.com.ar"
        }) {
            access_token
        }
    }
    '''
    
    response = requests.post(url, json={'query': mutation})

    return response.json()['data']['signUp']['access_token']

def _query(url, query, token):
    response = requests.post(
        url,
        json={'query': query},
        headers={"Authorization": f"{token}"}
    )

    return response.json()

##########################################################################################

if __name__ == '__main__':
    unittest.main()