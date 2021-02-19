#!/bin/bash

clear
cd ../dev/
docker-compose up -d 2> /dev/null
cd ..
# gnome-terminal -- /bin/sh -c 'npm start'
# sleep 5
npm run test
docker rm $(docker ps -a -q) -f > /dev/null
docker volume prune -f > /dev/null
