#!/bin/bash
TAG=$(git rev-parse --short HEAD)
REPO="238164213705.dkr.ecr.ap-southeast-2.amazonaws.com"
aws ecr get-login --no-include-email --region ap-southeast-2 | sh

docker tag "nookr-ui:latest" "$REPO/nookr-ui:$TAG"
docker tag "nookr-api:latest" "$REPO/nookr-api:$TAG"
docker tag "nookr-proxy:latest" "$REPO/nookr-proxy:$TAG"

echo "[INFO] Pushing UI"
docker push "$REPO/nookr-ui:$TAG"
echo "[INFO] Pushing API"
docker push "$REPO/nookr-api:$TAG"
echo "[INFO] Pushing Proxy"
docker push "$REPO/nookr-proxy:$TAG"
