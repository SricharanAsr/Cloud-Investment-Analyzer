# Project Report: Cloud Article Deployment on Amazon EKS

## Project Overview
This project demonstrates my practical implementation of containerizing and deploying a web-based news article focused on "Cloud Computing" using highly scalable cloud infrastructure on Amazon Web Services (AWS). I built this to showcase my understanding of modern cloud architectures.

---

## AWS Services Used

| Service | Role in Project |
| :--- | :--- |
| **Amazon EKS** | Managed Kubernetes service used to orchestrate and run the containerized frontend. |
| **Amazon ECR** | Docker container registry used to store and manage the application images. |
| **AWS IAM** | Managed access using the `LabRole` to ensure secure interactions between EKS and other AWS services. |
| **Amazon VPC** | Networking foundation (Subnets, Route Tables, NAT Gateways) created by `eksctl` to isolate the cluster. |
| **Elastic Load Balancing (ELB)** | Automatically provisioned by the Kubernetes Service to provide a public URL for the application. |
| **Amazon EC2** | The underlying virtual machines (t3.medium) that acted as worker nodes in the EKS cluster. |
| **CloudFormation** | Used by `eksctl` as the "Infrastructure as Code" engine to provision the entire stack. |

---

## Infrastructure Implementation Steps

### 1. Environment Preparation
- **Tooling**: Installed AWS CLI, `kubectl` (K8s client), `eksctl` (EKS CLI), and Docker Desktop.
- **Authentication**: Configured AWS CLI with session-based credentials from the AWS Academy Learner Lab.

### 2. Application Containerization
- **Frontend Development**: Created a semantic HTML5 news article about Cloud Computing.
- **Dockerization**: Wrote a `Dockerfile` using the lightweight `nginx:alpine` base image.
- **Build**: Built the local image: `docker build -t cloud-news-frontend .`.

### 3. Registry Setup (ECR)
- **Repo Creation**: Created a private repository in Amazon ECR.
- **Push**: Authenticated Docker to ECR, tagged the local image, and pushed it to the cloud registry.

### 4. EKS Cluster Provisioning
- **Configuration**: Defined a `cluster.yaml` to specify the use of the pre-existing `LabRole` (mandatory for AWS Academy).
- **Deployment**: Used `eksctl create cluster -f cluster.yaml` to provision the VPC, control plane, and managed node group.

### 5. Kubernetes Orchestration
- **Manifests**: Created a `Deployment` (replicas=2) and a `Service` (type=LoadBalancer).
- **Apply**: Deployed the manifests using `kubectl apply -f k8s-deploy.yaml`.
- **Exposure**: The LoadBalancer generated a unique DNS name to access the site publicly.

---

## Final Results
- **URL**: [http://a103019166e4a478a9670abdc7a0790e-347212273.us-east-1.elb.amazonaws.com](http://a103019166e4a478a9670abdc7a0790e-347212273.us-east-1.elb.amazonaws.com)
- **Redundancy**: 2 active pods running across multiple nodes for high availability.
- **Scalability**: The Managed Node Group is configured to scale between 1 and 3 nodes automatically.
