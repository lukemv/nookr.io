#!/bin/bash
revision=$(aws ecs register-task-definition --cli-input-json file://task-definition.json | jq  '.taskDefinition.revision')
sed "s/TASK_DEFINITION/$revision/g" service-template.json > service.json
aws ecs create-service --cli-input-json file://service.json