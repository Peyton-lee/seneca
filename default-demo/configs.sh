#!/bin/bash

# 拷贝配置目录到各服务目录下
cp -r ./configs ./api/
cp -r ./configs ./srv1/
cp -r ./configs ./srv2/

docker-compose build --no-cache
docker-compose down
docker-compose up -d

exit 0