#!/bin/bash
aws cloudformation create-stack \
  --stack-name nookr-ecr-repositories \
  --template-body file://repositories.yml