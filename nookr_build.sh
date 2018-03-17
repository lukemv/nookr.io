#!/bin/bash
# This script will build and run the container stack locally in much
# the same way that it would be run in production.
# Valid environments are (local|dev|prod)
env="${1:?Usage: ./run.sh (local|dev|prod)}"
base_dir=".nookr"

if ! [ -d $base_dir ]; then
  echo "[INFO] Making directory: $base_dir"
  mkdir $base_dir
fi

env_folder="$base_dir/$env"
mkdir -p "$env_folder"

if [ "$env" != "local" ]; then
  echo "[INFO] Building API"
  pushd ./api
  ./build.sh
  popd

  echo "[INFO] Building UI"
  pushd ./ui
  ./build.sh
  popd

  echo "[INFO] Building Gateway Proxy"
  pushd ./proxy
  ./build.sh
  popd

  echo "[INFO] Building Website"
  pushd ./docs
  ./build.sh
  popd

  docker-compose --file "compose.yml" up
else
  docker-compose --file "compose_local.yml" up
fi
