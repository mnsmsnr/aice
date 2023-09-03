### ■ドッカー起動
```
docker-compose up
```
### ■ドッカー滅びの呪文
```
docker rm -f $(docker ps -aq) && docker rmi -f $(docker images -aq) && docker volume rm $(docker volume ls -q)
```

### ■フロント開発
/aice
```
docker-compose up aice_api
```
/aice/aice_front
```
npm start
```

### ■API開発
/aice
```
docker-compose up aice_front
```
/aice/aice_api
```
python -m flask run --port=8000
```

### ■フロント & API開発
/aice
```
docker-compose up aice_db
```
/aice/aice_api
```
python -m flask run --port=8000
```
/aice/aice_front
```
npm start
```

### ■DB接続
```
psql -h localhost -p 5432 -U aice_db_user -d aice_db
password
```