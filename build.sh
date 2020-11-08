#!/bin/bash

pushd frontend/ &&
    docker build -t calendar:frontend .
popd &&

pushd backend/ &&
    docker build -t calendar:springboot .
popd &&

docker tag calendar:frontend 177032586869.dkr.ecr.eu-west-1.amazonaws.com/calendar:frontend
docker tag calendar:springboot 177032586869.dkr.ecr.eu-west-1.amazonaws.com/calendar:springboot

docker push 177032586869.dkr.ecr.eu-west-1.amazonaws.com/calendar:frontend &&
docker push 177032586869.dkr.ecr.eu-west-1.amazonaws.com/calendar:springboot &&
echo "Build Success"
