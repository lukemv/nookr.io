#!/bin/bash
revision=$(aws ecs register-task-definition --cli-input-json file://task-definition.json | jq  '.taskDefinition.revision')
aws ecs update-service --cluster "nookr" --service "nookr-uat" --force-new-deployment --task-definition "nookr:$revision" \
