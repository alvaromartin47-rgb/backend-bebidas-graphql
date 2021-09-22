from string import Template
from entities.Petition import Petition

class Order:

    def __init__(self, access_token):
        self.access_token = access_token

    def createOrder(self, bodyOrder):
        template = Template('''
        mutation {
            addOrder(input: $body) {
                ID
            }
        }
        ''')

        return template.substitute(body=bodyOrder)

    def getOrders(self):
        query = '''
        {
            orders {
                data {
                    product {
                        name
                        description
                        stock
                        visible
                        photo
                        max_order
                        discount
                        promotion
                    }
                    quantity
                }
            }
        }
        '''

        petition = Petition(self.access_token)
        
        return petition.sendQuery(query)

    def addOrder(self, order):
        petition = Petition(self.access_token)

        return petition.sendQuery(order)

    def getOrderWithStatusPendient(self):
        query = '''
        {
            orders(filters: {
                status: "Pendient"
            }) {
                _id
            }
        }
        '''

        petition = Petition(self.access_token)
        
        return petition.sendQuery(query)