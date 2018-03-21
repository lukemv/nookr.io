#!/bin/bash
TAG=$(git rev-parse --short HEAD)
sed "s/GITHASH/$TAG/g" task-template.json > task-definition.json
revision=$(aws ecs register-task-definition --cli-input-json file://task-definition.json | jq  '.taskDefinition.revision')
aws ecs update-service --cluster "nookr" --service "nookr-uat" --force-new-deployment --task-definition "nookr:$revision" \
