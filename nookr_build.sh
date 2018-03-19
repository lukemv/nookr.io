#!/bin/bash
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

echo "[INFO] Tagging UI"
docker tag "nookr-ui:latest" "$REPO/nookr-ui:latest"

echo "[INFO] Tagging Proxy"
docker tag "nookr-proxy:latest" "$REPO/nookr-proxy:latest"

echo "[INFO] Tagging API"
docker tag "nookr-api:latest" "$REPO/nookr-api:latest"