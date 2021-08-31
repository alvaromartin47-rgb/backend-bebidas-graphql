from Petition import Petition
from string import Template

class Product:

    def __init__(self, access_token):
        self.access_token = access_token

    def getProducts(self, category):
        petition = Petition(self.access_token)

        template = Template('''
        {
            categories(input: {
                name: $name
            }) {
                products
            }
        }
        ''')

        query = template.substitute(name=category)
        
        return petition.sendQuery(query)
