#!/bin/bash

echo "Ejecutando tests unitarios en contenedor..."
docker run --name test -v `pwd`:/app/api -it api-graphql-bebidas /bin/sh /app/api/scripts/execute-graphql-test.sh
echo ""
echo "Finalizando ejecución..."
docker rm test
