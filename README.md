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

## Project Structure

- `index.html`: Main application entry point.
- `styles.css`: Premium CSS design system.
- `Dockerfile`: Container definition.
- `k8s-deploy.yaml`: Kubernetes Deployment and Service.
- `cluster.yaml`: EKS cluster configuration.
- `Project_Report.md`: Detailed academic report.
- `Step_By_Step_Guide.md`: Tutorial for reproduction.

---
&copy; 2026 Sricharan | Cloud Computing
