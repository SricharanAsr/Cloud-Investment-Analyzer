# Step-by-Step Guide: Deploying a Web App to Amazon EKS

This guide details the exact steps I followed to recreate this project manually from my terminal. I used my AWS Academy account, which has specific IAM restrictions (`LabRole`).

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
*   **AWS CLI** (`aws --version`)
*   **Docker Desktop** (must be running)
*   **kubectl** (`kubectl version --client`)
*   **eksctl** (`eksctl version`)

---

## 🏗️ Phase 1: Authentication and Setup

### 1.1 Configure AWS Credentials
1. Log in to your AWS Academy Learner Lab.
2. Click on **AWS Details** to reveal your temporary credentials.
3. Open your terminal and set your credentials (usually stored in `~/.aws/credentials`):
    ```ini
    [default]
    aws_access_key_id=YOUR_ACCESS_KEY
    aws_secret_access_key=YOUR_SECRET_KEY
    aws_session_token=YOUR_SESSION_TOKEN
    ```
4. Verify your identity:
    ```bash
    aws sts get-caller-identity
    ```

---

## 💻 Phase 2: Application Containerization

### 2.1 Create the Frontend Code
Create a file named `index.html` with your web content (e.g., a simple HTML news article).

### 2.2 Create the Dockerfile
In the same directory as `index.html`, create a file exactly named `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.3 Build the Docker Image
Run the following command in your terminal to build the image tagged as `cloud-news-frontend`:
```bash
docker build -t cloud-news-frontend .
```

---

## ☁️ Phase 3: Push to Amazon Elastic Container Registry (ECR)

### 3.1 Create an ECR Repository
Create a repository in AWS to hold your Docker image:
```bash
aws ecr create-repository --repository-name cloud-news-frontend --region us-east-1
```

### 3.2 Authenticate Docker with ECR
*(Replace `YOUR_ACCOUNT_ID` with your actual 12-digit AWS Account ID)*
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### 3.3 Tag and Push the Image
Tag your local image to match the remote ECR repository, then push it:
```bash
docker tag cloud-news-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cloud-news-frontend:latest

docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cloud-news-frontend:latest
```

---

## 🚀 Phase 4: Create the Amazon EKS Cluster

*⚠️ **Important for AWS Academy**: You cannot use standard `eksctl` commands because you lack the permissions to create new IAM roles. You MUST use the pre-existing `LabRole`.*

### 4.1 Create `cluster.yaml`
Create a configuration file named `cluster.yaml`:
```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: cloud-project-cluster
  region: us-east-1
  version: "1.30"

iam:
  serviceRoleARN: "arn:aws:iam::YOUR_ACCOUNT_ID:role/LabRole"

managedNodeGroups:
  - name: standard-nodes
    instanceType: t3.medium
    minSize: 1
    maxSize: 3
    desiredCapacity: 2
    iam:
      instanceRoleARN: "arn:aws:iam::YOUR_ACCOUNT_ID:role/LabRole"
```

### 4.2 Provision the Cluster (Takes 15-20 Minutes)
Run the following command to build the VPC and the EKS cluster:
```bash
eksctl create cluster -f cluster.yaml
```

---

## ☸️ Phase 5: Kubernetes Deployment

Once the cluster is ready, your `kubeconfig` should be automatically updated. Verify by running `kubectl get nodes`.

### 5.1 Create Kubernetes Manifests
Create a file named `k8s-deploy.yaml`. *Make sure to replace `YOUR_ACCOUNT_ID`!*
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloud-news-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cloud-news
  template:
    metadata:
      labels:
        app: cloud-news
    spec:
      containers:
      - name: frontend
        image: YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cloud-news-frontend:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: cloud-news-service
spec:
  type: LoadBalancer
  selector:
    app: cloud-news
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

### 5.2 Deploy the Details
Apply the manifests to your cluster:
```bash
kubectl apply -f k8s-deploy.yaml
```

### 5.3 Verify and Access the Application
Check if the pods are running:
```bash
kubectl get pods
```

Get the public URL (External-IP) of the LoadBalancer:
```bash
kubectl get services cloud-news-service
```
Copy the `EXTERNAL-IP` and open it in your web browser. (Note: It may take 1-3 minutes for AWS to configure the DNS for the new LoadBalancer link).

---

## 🧹 Phase 6: Clean Up (Crucial!)
To delete the resources and stop consuming AWS credits:
```bash
eksctl delete cluster --name cloud-project-cluster --region us-east-1
```
