#!/bin/bash
revision=$(aws ecs register-task-definition --cli-input-json file://task-definition.json | jq  '.taskDefinition.revision')
aws ecs update-service \
  --task-definition "nookr:$revision" \
  --service "nookr-uat" \
  --cluster "nookr"
