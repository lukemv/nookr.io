#!/bin/bash
# Valid environments are (local|dev|prod)
env="${1:?Usage: ./run.sh (local|dev|prod)}"
docker-compose --file "docker-compose-app-${env}.yml" down