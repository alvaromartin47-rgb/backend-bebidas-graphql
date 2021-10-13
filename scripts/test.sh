#!/bin/bash

echo "Running unit tests in docker container..."
docker run --name test -v `pwd`:/app/api -it api-graphql-bebidas /bin/sh /app/api/scripts/execute-graphql-test.sh
echo ""
echo "Finishing..."
docker rm test
