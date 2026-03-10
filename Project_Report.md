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
...
### 6. Modernization and Automation (Added Enhancements)
- **UI/UX**: Refactored the frontend with a premium dark-themed design system using Google Fonts (`Inter`, `Outfit`) and modern CSS variables.
- **CI/CD**: Implemented a GitHub Actions workflow to automate the multi-environment deployment lifecycle.
- **Automation**: Created a PowerShell deployment script (`deploy.ps1`) for local automation.
- **Hardening**: Added resource quotas and health probes to Kubernetes manifests to ensure application stability.

---

## Final Results
- **URL**: [http://a103019166e4a478a9670abdc7a0790e-347212273.us-east-1.elb.amazonaws.com](http://a103019166e4a478a9670abdc7a0790e-347212273.us-east-1.elb.amazonaws.com)
- **Git History**: 17 structured commits documenting the evolution from a basic static site to a production-ready EKS deployment.
- **Redundancy**: 2 active pods running across multiple nodes for high availability.
- **Scalability**: Managed Node Group scaling (1-3 nodes) ensures cost-efficiency and performance.
