from entities.Petition import Petition
import requests
from string import Template

class Register:
    uri = "http://localhost:4000/"

    def register(self, data):
        template = Template('''
        mutation {
            signUp(input: {
                name: "$name",
                lastname: "$lastname",
                password: "$password",
                email: "$email",
                phone: "$phone"
            }) {
                access_token
            }
        }
        ''')

        mutation = template.substitute(
            name=data['name'],
            lastname=data['lastname'],
            password=data['password'],
            email=data['email'],
            phone=data['phone']
        )

        response = requests.post(self.uri, json={'query': mutation})

        access_token = response.json()['data']['signUp']['access_token']
        return access_token

    def deleteUser(self, accessToken, password):
        template = Template('''
        mutation {
            deleteUser(input: {
                password: "$pwd"
            })
        }
        ''')

        mutation = template.substitute(pwd=password)

        petition = Petition(accessToken)
        
        return petition.sendQuery(mutation)