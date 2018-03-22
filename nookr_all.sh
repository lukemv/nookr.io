#!/bin/bash
source ./credentials
./nookr_build.sh
./nookr_push.sh
./nookr_deploy.sh