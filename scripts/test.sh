#!/bin/bash

cd ../dev/
docker-compose up -d
cd ..
# gnome-terminal -- /bin/sh -c 'npm start'
# sleep 5
npm run test
docker rm $(docker ps -a -q) -f
docker volume prune -f
