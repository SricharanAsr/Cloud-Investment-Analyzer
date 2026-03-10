# AWS EKS Deployment Script for Windows
# This script automates the build, push, and deploy process.

$ECR_REGISTRY = "992382753275.dkr.ecr.us-east-1.amazonaws.com"
$IMAGE_NAME = "cloud-news-frontend"
$REGION = "us-east-1"

Write-Host "--- Starting EKS Deployment Automation ---" -ForegroundColor Cyan

# 1. Login to ECR
Write-Host "[1/4] Logging in to Amazon ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# 2. Build Docker Image
Write-Host "[2/4] Building Docker image..." -ForegroundColor Yellow
docker build -t $IMAGE_NAME .

# 3. Tag and Push
Write-Host "[3/4] Tagging and Pushing image to ECR..." -ForegroundColor Yellow
docker tag ${IMAGE_NAME}:latest ${ECR_REGISTRY}/${IMAGE_NAME}:latest
docker push ${ECR_REGISTRY}/${IMAGE_NAME}:latest

# 4. Apply K8s Manifests
Write-Host "[4/4] Applying Kubernetes manifests..." -ForegroundColor Yellow
kubectl apply -f k8s-deploy.yaml

Write-Host "--- Deployment Complete! ---" -ForegroundColor Green
Write-Host "Check service status with: kubectl get svc cloud-news-service"
