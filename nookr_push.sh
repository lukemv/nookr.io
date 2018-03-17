#!/bin/bash
repo="238164213705.dkr.ecr.ap-southeast-2.amazonaws.com"

echo "[INFO] Authenticating with AWS"
aws ecr get-login --no-include-email --region ap-southeast-2 | sh

echo "[INFO] Tagging UI"
docker tag "nookr-ui:latest" "$repo/nookr-ui:latest"

echo "[INFO] Tagging Website"
docker tag "nookr-docs:latest" "$repo/nookr-docs:latest"

echo "[INFO] Tagging Proxy"
docker tag "nookr-proxy:latest" "$repo/nookr-proxy:latest"

echo "[INFO] Tagging API"
docker tag "nookr-api:latest" "$repo/nookr-api:latest"

echo "[INFO] Pushing UI"
docker push "$repo/nookr-ui:latest"
echo "[INFO] Pushing Website"
docker push "$repo/nookr-docs:latest"
echo "[INFO] Pushing Proxy"
docker push "$repo/nookr-proxy:latest"
echo "[INFO] Pushing API"
docker push "$repo/nookr-api:latest"