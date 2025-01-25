# RDS IAM Authentication from EKS
In today’s cloud-driven world, securing database access without the hassle of managing static credentials is crucial.  
Amazon RDS offers a powerful feature: IAM Authentication, enabling you to connect to your databases securely using temporary credentials.

For more information on how to implemebt it, please follow the article in Medium:  
https://pierreraffa.medium.com/rds-iam-authentication-from-eks-3635056e98af

## Build the image
```bash
docker build -t 000000000000.dkr.ecr.us-east-2.amazonaws.com/company/demoapp .  
docker push 000000000000.dkr.ecr.us-east-2.amazonaws.com/company/demoapp:latest
```

## Deploy
```bash
helm upgrade --install demoapp demoapp/ --namespace demoapp --create-namespace
```

## Start the app
```bash
HOST=localhost PORT=3000 RDS_REMOTE_HOST=demoapp.cluster-ck1sf8cklfwf.us-east-2.rds.amazonaws.com RDS_REMOTE_PORT=5432 RDS_LOCAL_HOST=localhost RDS_LOCAL_PORT=5433 RDS_DATABASE=demo RDS_USER=an_user node src/demoapp.js
```

