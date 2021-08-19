import requests
import unittest

def get_token_signUp(url):
    mutation = """
        mutation {
            signUp(input: {
                name: "Alvaro",
                lastname: "Martin",
                password: "riverplate",
                email: "alvaro.martin@live.com.a"
            }) {
                access_token
            }
        }
        """

    response = requests.post(url, json={'query': mutation})
    return response.json()['data']['signUp']['access_token']

class Prueba(unittest.TestCase):
    url = "http://localhost:4000/"
    access_token_signUp = get_token_signUp(url)
    
    def test01AlRegistrarseDevuelveTokenQueNoTieneAccessoARecursoPing(self):
        query = """
        {
            ping
        }
        """
        
        response = requests.post(
            self.url,
            json={'query': query},
            headers={"Authorization": f"{self.access_token_signUp}"}
        )

        expected = "Token is invalid"
        message = response.json()["errors"][0]["message"]
        
        self.assertEquals(message, expected)


if __name__ == '__main__':
    unittest.main()