#!/bin/bash

npm run docker.build

docker-compose build --no-cache
docker-compose down
docker-compose up -d

exit 0