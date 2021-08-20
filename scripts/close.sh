docker rm $(docker ps -a -q) -f
sleep 2
docker volume prune -f