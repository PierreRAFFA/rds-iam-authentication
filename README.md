## Build the image
docker build -t 000000000000.dkr.ecr.us-east-2.amazonaws.com/company/demoapp .
docker push 000000000000.dkr.ecr.us-east-2.amazonaws.com/company/demoapp:latest

## Deploy
helm upgrade --install demoapp demoapp/ --namespace demoapp --create-namespace

## Start the app
HOST=localhost PORT=3000 RDS_REMOTE_HOST=pierre1.cluster-ck1sf8cklfwf.us-east-2.rds.amazonaws.com RDS_REMOTE_PORT=5432 RDS_LOCAL_HOST=localhost RDS_LOCAL_PORT=5433 RDS_DATABASE=demo RDS_USER=xxxxx.com node src/demoapp.js

