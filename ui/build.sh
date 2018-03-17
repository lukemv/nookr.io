#!/bin/bash
echo "[INFO] Re-building npm_modules directory"
rm -rf ./node_modules
npm install
echo "[INFO] Building UI SPA"
node ./build/build.js
echo "[INFO] Building nookr_ui docker image"
docker build -t "nookr_ui" .
