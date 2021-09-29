import unittest
from requests.api import request
from entities.Register import Register
from entities.Product import Product
from entities.Petition import Petition
from dotenv import load_dotenv
import os
import requests
from string import Template

load_dotenv("./src/.env")

class payment(unittest.TestCase):
    # data = {
    #     "name": "Alvaro",
    #     "lastname": "Martin",
    #     "password": "riverplate2018",
    #     "email": "alvaro.martin1307@gmail.com.ar",
    #     "phone": "2396603429"
    # }

    # registrator = Register()
    # accessToken = registrator.register(data)

    accessTokenMP = os.getenv("ACCESS_TOKEN_MP")
    publicKeyMP = os.getenv("PUBLIC_KEY_MP")

    user_comprador = {
        'id': 832071419,
        'nickname': 'TETE9988823',
        'password': 'qatest7809',
        'site_status': 'active', 
        'email': 'test_user_73030762@testuser.com'
    }

    user_vendedor = {
        'id': 832071514, 
        'nickname': 'TETE5482072',
        'password': 'qatest6613',
        'site_status': 'active',
        'email': 'test_user_10654613@testuser.com'
    }

    # def test01IntegrationPayment(self):
        # response = requests.post(
        #     "https://api.mercadopago.com/users/test_user",
        #     json={"site_id": "MLA"},
        #     headers={
        #         "Content-Type": "aplication/json",
        #         "Authorization": f"Bearer {self.accessTokenMP}"
        #     }
        # )
        
        # product = Product(self.accessToken)
        # products = product.getProducts("Vinos")

        # Agregar un producto a la orden

        # petition = Petition(self.accessToken)

        # template = Template('''
        
        # ''')
        
        # preference_id = petition.sendQuery()

unittest.main()
