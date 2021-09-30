docker rm $(docker ps -a -q) -f
sleep 2
docker volume prune -f
sleep 2
docker network prune -f
docker-compose up -d
python3 test/add_datasets.py