# 🚀 ExploreSG DevOps Complete Setup Guide

> **Complete guide for setting up the entire DevOps stack for ExploreSG project**

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation Order](#installation-order)
- [Platform-Specific Instructions](#platform-specific-instructions)
- [Post-Installation](#post-installation)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This guide covers the complete DevOps toolchain setup for ExploreSG:

| Component          | Purpose         | Why We Need It                                           |
| ------------------ | --------------- | -------------------------------------------------------- |
| **Helm**           | Package Manager | Install complex applications (Prometheus, ArgoCD) easily |
| **ArgoCD**         | GitOps Platform | Automated deployments, self-healing, rollbacks           |
| **Prometheus**     | Monitoring      | Metrics collection and alerting                          |
| **Grafana**        | Visualization   | Beautiful dashboards for metrics                         |
| **ExploreSG Apps** | Your Services   | Auth, Fleet, Frontend microservices                      |

## ✅ Prerequisites

### Required Software

1. **Kubernetes Cluster** (Minikube recommended)

   ```bash
   # Start Minikube with sufficient resources
   minikube start --cpus=4 --memory=8192 --driver=docker
   ```

2. **kubectl** - Kubernetes CLI

   ```bash
   # Verify installation
   kubectl version --client
   ```

3. **Git** - Version control
   ```bash
   git --version
   ```

### System Requirements

- **CPU**: 4+ cores recommended
- **RAM**: 8GB+ recommended
- **Disk**: 20GB+ free space
- **OS**: Windows 10+, Linux (Ubuntu 20.04+), macOS 11+

## 🚀 Quick Start

### Windows (PowerShell)

```powershell
# Clone the repository
git clone https://github.com/Project-Be-Better/exploresg-cloud.git
cd exploresg-cloud

# Run the complete setup script
.\scripts\setup-complete-devops-stack.ps1
```

### Linux/Mac (Bash)

```bash
# Clone the repository
git clone https://github.com/Project-Be-Better/exploresg-cloud.git
cd exploresg-cloud

# Make script executable
chmod +x scripts/setup-complete-devops-stack.sh

# Run the complete setup script
./scripts/setup-complete-devops-stack.sh
```

## 📦 Installation Order

The script automatically installs components in the correct order:

```
1. Prerequisites Check
   ↓
2. Helm (Package Manager) ⭐ CRITICAL - Install First
   ↓
3. ArgoCD (GitOps Platform)
   ↓
4. Prometheus + Grafana (Monitoring)
   ↓
5. ExploreSG Applications
```

### Why This Order Matters

- **Helm first**: Required to install ArgoCD and Prometheus
- **ArgoCD before apps**: Enables GitOps workflow
- **Monitoring anytime**: Can be added independently

## 🖥️ Platform-Specific Instructions

### Windows

**Option A: Full Installation**

```powershell
.\scripts\setup-complete-devops-stack.ps1
```

**Option B: Skip Components**

```powershell
# Skip Helm if already installed
.\scripts\setup-complete-devops-stack.ps1 -SkipHelm

# Skip multiple components
.\scripts\setup-complete-devops-stack.ps1 -SkipHelm -SkipArgoCD
```

**Option C: Install Helm Manually**

```powershell
# Using Chocolatey
choco install kubernetes-helm

# Using Scoop
scoop install helm

# Verify
helm version
```

### Linux/Mac

**Option A: Full Installation**

```bash
./scripts/setup-complete-devops-stack.sh
```

**Option B: Skip Components**

```bash
# Skip Helm if already installed
./scripts/setup-complete-devops-stack.sh --skip-helm

# Skip multiple components
./scripts/setup-complete-devops-stack.sh --skip-helm --skip-argocd
```

**Option C: Install Helm Manually**

```bash
# Linux/Mac
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# macOS with Homebrew
brew install helm

# Verify
helm version
```

## 🎉 Post-Installation

### Access Your Services

After successful installation, you'll receive access information for:

#### ArgoCD

- **URL**: `http://<minikube-ip>:30080`
- **Username**: `admin`
- **Password**: Displayed in terminal output

#### Grafana

- **URL**: `http://<minikube-ip>:30300`
- **Username**: `admin`
- **Password**: `admin123`

#### Prometheus

- **URL**: `http://<minikube-ip>:30900`

### Verify Installation

```bash
# Check all Helm releases
helm list -A

# Check ArgoCD applications
kubectl get applications -n argocd

# Check all pods in exploresg namespace
kubectl get pods -n exploresg

# Check monitoring stack
kubectl get pods -n monitoring
```

### Port Forwarding

For easy access to all services:

**Windows:**

```powershell
.\scripts\port-forward.ps1
```

**Linux/Mac:**

```bash
./scripts/port-forward.sh
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Helm Installation Failed

**Windows:**

```powershell
# Install Chocolatey first
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Then install Helm
choco install kubernetes-helm -y
```

**Linux/Mac:**

```bash
# Use official script
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

#### 2. Minikube Not Running

```bash
# Start Minikube
minikube start --cpus=4 --memory=8192 --driver=docker

# Verify
minikube status
kubectl cluster-info
```

#### 3. ArgoCD Installation Timeout

```bash
# Increase timeout
helm install argocd argo/argo-cd \
    --namespace argocd \
    --create-namespace \
    --wait \
    --timeout 10m
```

#### 4. Prometheus Installation Fails (Disk Space)

```bash
# Check available space
df -h

# Reduce storage requirements in values.yaml
# Change storage from 10Gi to 5Gi
```

#### 5. Applications Not Syncing

```bash
# Check ArgoCD application status
kubectl get applications -n argocd

# Force sync
kubectl patch application <app-name> -n argocd \
  --type merge \
  -p '{"metadata":{"annotations":{"argocd.argoproj.io/refresh":"hard"}}}'
```

### Getting Help

```bash
# View script help
.\scripts\setup-complete-devops-stack.ps1 -?           # Windows
./scripts/setup-complete-devops-stack.sh --help        # Linux/Mac

# Check Kubernetes events
kubectl get events -n exploresg --sort-by='.lastTimestamp'

# Check logs
kubectl logs -n argocd deployment/argocd-application-controller
kubectl logs -n monitoring deployment/prometheus-operator
```

## 📚 Next Steps

After successful setup:

1. **Explore ArgoCD UI** - See GitOps in action
2. **Set up Grafana Dashboards** - Import Kubernetes dashboards
3. **Test Deployments** - Make changes and watch auto-sync
4. **Practice Rollbacks** - Demonstrate to your professor
5. **Set up CI/CD** - GitHub Actions integration

## 📖 Related Documentation

- [ArgoCD Guide](./ARGOCD_GUIDE.md) - Complete ArgoCD usage
- [ArgoCD Quick Reference](./ARGOCD_QUICK_REFERENCE.md) - Command cheatsheet
- [Kubernetes Cheatsheet](./K8S_CHEATSHEET.md) - Kubectl commands
- [Port Forwarding Guide](./PORT_FORWARDING_TROUBLESHOOTING.md) - Access troubleshooting

## 🎓 For Academic Demonstration

This setup demonstrates:

- ✅ **Package Management** - Helm
- ✅ **GitOps** - ArgoCD
- ✅ **Infrastructure as Code** - Kubernetes manifests
- ✅ **Monitoring & Observability** - Prometheus + Grafana
- ✅ **Microservices Architecture** - Multiple services
- ✅ **Automated Deployments** - Push to Git → Auto-deploy
- ✅ **Rollback Capabilities** - Both K8s native and Helm
- ✅ **Self-Healing** - ArgoCD auto-correction

## 🤝 Contributing

Found an issue? Have suggestions?

1. Open an issue on GitHub
2. Submit a pull request
3. Contact the development team

---

<div align="center">

**Made with ❤️ for ExploreSG Project**

[Main README](../README.md) | [Quick Start](./QUICKSTART.md) | [Deployment Guide](./MINIKUBE_DEPLOYMENT.md)

</div>
