import unittest
import requests

class Petition:

    uri = "http://localhost:4000/"
    access_token = None

    def __init__(self, access_token):
        self.access_token = access_token

    def sendQuery(self, query):
        response = requests.post(
            self.uri,
            json={'query': query},
            headers={"Authorization": f"{self.access_token}"}
        )

        return response.json()