#!/bin/bash
REPO="238164213705.dkr.ecr.ap-southeast-2.amazonaws.com"

docker tag "nookr-ui:latest" "$REPO/nookr-ui:latest"
docker tag "nookr-api:latest" "$REPO/nookr-api:latest"
docker tag "nookr-proxy:latest" "$REPO/nookr-proxy:latest"

echo "[INFO] Pushing UI"
docker push "$repo/nookr-ui:latest"
echo "[INFO] Pushing API"
docker push "$repo/nookr-api:latest"
echo "[INFO] Pushing Proxy"
docker push "$repo/nookr-proxy:latest"
