import requests
from string import Template

class Register:
    uri = "http://localhost:4000/"

    def __init__(self, data):
        self.data = data

    def register(self):
        template = Template('''
        mutation {
            signUp(input: {
                name: $name,
                lastname: $lastname,
                password: $password,
                email: $email,
                phone: $phone 
            }) {
                access_token
            }
        }
        ''')

        mutation = template.substitute(
            name=self.data['name'],
            lastname=self.data['lastname'],
            password=self.data['password'],
            email=self.data['email'],
            phone=self.data['phone']
        )

        response = requests.post(self.uri, json={'query': mutation})
        print(response.json())
        return response.json()['data']['signUp']['access_token']