# AWS EKS Cloud Computing Project

A modern, containerized web application deployed on Amazon Elastic Kubernetes Service (EKS).

## Project Overview

This project demonstrates a full CI/CD lifecycle for a cloud-native application:
1.  **Containerization**: Using Docker to package the frontend application.
2.  **Infrastructure as Code**: Using `eksctl` to provision the EKS cluster.
3.  **Orchestration**: Deploying to Kubernetes with high availability.

## Tech Stack

- **Frontend**: HTML5, CSS3 (Premium Dark UI)
- **Containerization**: Docker (Nginx Alpine)
- **Orchestration**: Kubernetes (AWS EKS)
- **Infrastructure**: AWS Academy v2

## Getting Started

### Prerequisites

- AWS CLI configured
- `eksctl` installed
- `kubectl` installed
- Docker Desktop

### Local Development

```bash
# Build the image
docker build -t cloud-news-frontend .

# Run locally
docker run -p 8080:80 cloud-news-frontend
```

### Deployment to EKS

1.  **Create Cluster**: 
    ```bash
    eksctl create cluster -f cluster.yaml
    ```
2.  **Deploy Application**:
    ```bash
    kubectl apply -f k8s-deploy.yaml
    ```
3.  **Access URL**:
    ```bash
    kubectl get service cloud-news-service
    ```

## Lessons Learned

- **EKS Complexity**: Provisioning a cluster with `eksctl` is straightforward, but IAM permissions (`LabRole`) can be a bottleneck in restricted environments like AWS Academy.
- **Container Lifecycle**: Proper tagging and registry management (ECR) are critical for smooth Kubernetes deployments.
- **UI & UX**: Minimal frontend applications benefit significantly from modern CSS features like glassmorphism and specialized typography to feel "premium".

---
&copy; 2026 Sricharan | Cloud Computing
