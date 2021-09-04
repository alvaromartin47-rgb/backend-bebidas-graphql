import unittest
from entities.Register import Register
from entities.Order import Order
from entities.Product import Product

class Orders(unittest.TestCase):
    data = {
        "name":"Alvaro",
        "lastname": "Martin",
        "password": "riverplate2018",
        "email": "alvaro.martin1307@gmail.com",
        "phone": "2396603429"
    }

    def test01SignUpIsSuccessfully(self):
        registrator = Register()
        
        accessToken = registrator.register(self.data)
    
        self.assertTrue(accessToken)

        # Delete user
    
        registrator.deleteUser(accessToken, self.data['password'])

    # def test02InitiallyUserHasNotOrders(self):
    #     # Register

    #     registrator = Register()
    #     accessToken = registrator.register(self.data)
        
    #     order = Order()
    #     orders = order.getOrders(accessToken)

    #     self.assertTrue(len(orders) == 0)

    #     # Delete user

    #     registrator.deleteUser(accessToken, self.data['password'])

    # def test03CreateOrderIsOk(self):
    #     # Register

    #     registrator = Register()
    #     accessToken = registrator.register(self.data)

    #     # Get products
        
    #     product = Product(accessToken)
    #     products = product.getProducts("aperitivos")

    #     body = [
    #         {
    #             "product_id": products[0]["_id"],
    #             "quantity": 1
    #         },
    #         {
    #             "product_id": products[1]["_id"],
    #             "quantity": 1
    #         }
    #     ]

    #     # Add orders

    #     order = Order(accessToken)

    #     orderBody = order.createOrder(body)
    #     orderId = order.addOrder(orderBody)

    #     self.assertTrue(orderId)

    #     # Delete user

    #     registrator.deleteUser(accessToken)

    # def getOrdersFromUserUsingToken(self):
    #     # Register

    #     registrator = Register()
    #     accessToken = registrator.register(self.data)

    #     # Get products

    #     product = Product(accessToken)
    #     products = product.getProducts("aperitivos")
        
    #     bodyOne = [
    #         {
    #             "product_id": products[0]["_id"],
    #             "quantity": 1
    #         },
    #         {
    #             "product_id": products[1]["_id"],
    #             "quantity": 1
    #         }
    #     ]

    #     bodyTwo = [
    #         {
    #             "product_id": products[1]["_id"],
    #             "quantity": 5
    #         }
    #     ]

    #     # Add order

    #     order = Order(accessToken)

    #     orderBodyOne = order.createOrder(bodyOne)
    #     orderBodyTwo = order.createOrder(bodyTwo)
        
    #     orderIdOne = order.addOrder(orderBodyOne)
    #     orderIdTwo = order.addOrder(orderBodyTwo)

    #     self.assertTrue(orderIdOne)
    #     self.assertTrue(orderIdTwo)

    #     # Get orders

    #     orders = order.getOrders()

    #     self.assertEquals(products[0]["name"], orders[0]["data"][0]["product"]["name"])
    #     self.assertEquals(products[1]["name"], orders[0]["data"][1]["product"]["name"])
    #     self.assertEquals(products[1]["name"], orders[1]["data"][0]["product"]["name"])

    #     # Delete user

    #     registrator.deleteUser(accessToken)

    # def createOrderDiscountStockOfTheOrder(self):
    #     # Register

    #     registrator = Register()
    #     accessToken = registrator.register(self.data)
        
    #     # Get products

    #     product = Product(accessToken)
    #     products = product.getProducts("aperitivos")
        
    #     bodyOne = [
    #         {
    #             "product_id": products[0]["_id"],
    #             "quantity": 1
    #         }
    #     ]

    #     # Add order

    #     order = Order(accessToken)

    #     orderBodyOne = order.createOrder(bodyOne)
    #     orderIdOne = order.addOrder(orderBodyOne)

    #     self.assertTrue(orderIdOne)

    #     # Get orders

    #     orders = order.getOrders()
    #     self.assertTrue(orders[0]["data"][0]["product"]["stock"] == products[0]["stock"] - 1)

    #     # Delete user

    #     registrator.deleteUser(accessToken)

    # def getOrdersFromDifferentUsersIsOk(self):
    #     # Registration
        
    #     data = {
    #         "name":"Juan Ignacio",
    #         "lastname": "Coronel",
    #         "password": "fulbo",
    #         "email": "almartin@fi.uba.ar",
    #         "phone": "2343567773"
    #     }
        
    #     registrator = Register()
    #     accessToken1 = registrator.register(self.data)
    #     accessToken2 = registrator.register(data)

    #     # Get products

    #     product = Product(accessToken1)
    #     products = product.getProducts("aperitivos")
        
    #     bodyOne = [
    #         {
    #             "product_id": products[0]["_id"],
    #             "quantity": 1
    #         }
    #     ]

    #     bodyTwo = [
    #         {
    #             "product_id": products[1]["_id"],
    #             "quantity": 1
    #         }
    #     ]

    #     # Add order

    #     orderOne = Order(accessToken1)
    #     orderTwo = Order(accessToken2)

    #     orderBodyOne = orderOne.createOrder(bodyOne)
    #     orderBodyTwo = orderTwo.createOrder(bodyTwo)
        
    #     orderIdOne = orderOne.addOrder(orderBodyOne)
    #     orderIdTwo = orderTwo.addOrder(orderBodyTwo)

    #     self.assertTrue(orderIdOne)
    #     self.assertTrue(orderIdTwo)

    #     # Get orders

    #     ordersOne = orderOne.getOrders()
    #     ordersTwo = orderTwo.getOrders()

    #     self.assertEquals(products[0]["name"], ordersOne[0]["data"][0]["product"]["name"])
    #     self.assertEquals(products[1]["name"], ordersTwo[0]["data"][0]["product"]["name"])
        
    #     # Delete user

    #     registrator.deleteUser(accessToken1)
    #     registrator.deleteUser(accessToken2)

    # def userHasOneOrderAndOneIsDeletedSoHeHasZeroLeft(self):
    #     # Registration
        
    #     registrator = Register(self.data)
    #     accessToken = registrator.register()

    #     # Get products

    #     product = Product(accessToken)
    #     products = product.getProducts("aperitivos")
        
    #     bodyOne = [
    #         {
    #             "product_id": products[0]["_id"],
    #             "quantity": 1
    #         }
    #     ]

    #     # Add order

    #     order = Order(accessToken)

    #     orderBodyOne = order.createOrder(bodyOne)
    #     orderIdOne = order.addOrder(orderBodyOne)

    #     self.assertTrue(orderIdOne)

    #     # Get orders

    #     orders = order.getOrders()
        
    #     # Delete order

    #     orderId = orders["_id"]
    #     order.delete(orderId)

    #     # Get orders

    #     orders = order.getOrders()
    #     self.assertTrue(len(orders) == 0)

    #     # Delete user

    #     registrator.deleteUser(accessToken)


unittest.main()