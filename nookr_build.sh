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
