#!/bin/bash
echo "[INFO] Building Website"
echo "[INFO] Re-building npm_modules directory"
rm -rf node_modules
npm install
echo "[INFO] Compiling website"
./node_modules/.bin/harp compile src/ dist/
echo "[INFO] Building docker image"
docker build -t "nookr_docs" .
echo "[INFO] Cleaning up build artefacts"
rm -rf dist
