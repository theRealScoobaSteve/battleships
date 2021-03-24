# battleships

- fork/download repo
- cd into battleship directory
- create a .env file and add the following
```SERVER_PORT=8080
REACT_APP_PORT=3000
DB_PASSWORD=123456
DB_USERNAME=root
DB_NAME=battle_ship
PGADMIN_DEFAULT_EMAIL=pgadmin4@pgadmin.org
PGADMIN_DEFAULT_PASSWORD=admin
PGADMIN_PORT=5050
```
- run ```docker-compose up```
- open a new terminal
- cd back into main directory
- run ```docker ps```
- copy the id of the API container
- run ```docker exec -it <docker_container_id> npx typeorm migrations:run```
- go to localhost:3000
