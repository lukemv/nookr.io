#!/bin/bash
# This script will build and run the container stack locally in much
# the same way that it would be run in production.

# Valid environments are (local|dev|prod)
env="${1:?Usage: ./run.sh (local|dev|prod)}"
echo "[INFO] Environment: $env"
export environment=$env

base_dir=".nookr"

if ! [ -d $base_dir ]; then
  echo "[INFO] Making directory: $base_dir"
  mkdir $base_dir
fi

env_folder="$base_dir/$env"
mkdir -p "$env_folder"

if [ "$env" != "local" ]; then
  echo "[INFO] Full build requested"

  echo "[INFO] Building API"
  docker build -t "nookr_api_${env}" ./api

  echo "[INFO] Building UI"
  pushd ./ui
  node ./build/build.js
  popd
  docker build -t "nookr_ui_${env}" ./ui

  echo "[INFO] Building Gateway Proxy"
  docker build -t "nookr_proxy_${env}" ./proxy


  echo "[INFO] Building Website"
  docker build -t "nookr_docs_${env}" ./docs

  compose_file="compose_env.yml"
  docker-compose --file $compose_file up
else
  docker-compose --file "compose_local.yml" up
fi
