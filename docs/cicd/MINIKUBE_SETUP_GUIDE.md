# ExploreSG Cloud - Minikube Setup Guide

## Complete Step-by-Step Guide from Scratch to Port Forward

This guide will walk you through setting up the entire ExploreSG Cloud infrastructure on Minikube from scratch, including all monitoring and GitOps tools.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Install Required Tools](#install-required-tools)
4. [Start Minikube](#start-minikube)
5. [Install Helm Charts](#install-helm-charts)
6. [Deploy Applications](#deploy-applications)
7. [Setup Port Forwarding](#setup-port-forwarding)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- A Linux/macOS/Windows machine with admin privileges
- At least 8GB RAM available
- At least 20GB free disk space
- Internet connection for downloading tools and images

---

## Step 1: Initial Setup

### 1.1 Clone the Repository

```bash
git clone https://github.com/Project-Be-Better/exploresg-cloud.git
cd exploresg-cloud
```

---

## Step 2: Install Required Tools

### 2.1 Install Docker

**Ubuntu/Debian:**
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# IMPORTANT: Log out and log back in for group changes to take effect
# Or run: newgrp docker
```

**Verify Docker:**
```bash
docker --version
docker ps
```

### 2.2 Install kubectl

```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Make it executable
chmod +x kubectl

# Move to PATH
sudo mv kubectl /usr/local/bin/

# Verify installation
kubectl version --client
```

### 2.3 Install Minikube

```bash
# Download Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Install Minikube
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Clean up
rm minikube-linux-amd64

# Verify installation
minikube version
```

### 2.4 Install Helm

```bash
# Download Helm installation script
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3

# Make it executable
chmod 700 get_helm.sh

# Run the installation script
./get_helm.sh

# Clean up
rm get_helm.sh

# Verify installation
helm version
```

---

## Step 3: Start Minikube

### 3.1 Start Minikube Cluster

```bash
# Start Minikube with sufficient resources
minikube start --cpus=4 --memory=8192 --disk-size=20g --driver=docker

# This will:
# - Create a Kubernetes cluster
# - Configure kubectl to use minikube context
# - May take 5-10 minutes on first run
```

### 3.2 Verify Cluster is Running

```bash
# Check cluster status
minikube status

# Check kubectl connection
kubectl cluster-info

# Check nodes
kubectl get nodes

# You should see a node in "Ready" status
```

### 3.3 Enable Minikube Addons

```bash
# Enable ingress (for external access)
minikube addons enable ingress

# Enable metrics-server (for resource monitoring)
minikube addons enable metrics-server

# Verify addons
minikube addons list
```

---

## Step 4: Install Helm Charts

### 4.1 Add Helm Repositories

```bash
# Add Prometheus Community repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Add Grafana repo
helm repo add grafana https://grafana.github.io/helm-charts

# Add ArgoCD repo
helm repo add argo https://argoproj.github.io/argo-helm

# Update repositories
helm repo update

# Verify repositories
helm repo list
```

### 4.2 Create Monitoring Namespace

```bash
# Create namespace for monitoring tools
kubectl create namespace monitoring

# Verify namespace
kubectl get namespaces
```

### 4.3 Install Prometheus

```bash
# Install Prometheus using Helm
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set prometheus.prometheusSpec.retention=7d \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=10Gi

# This installs:
# - Prometheus server
# - Grafana
# - Alertmanager
# - Node exporters
# - kube-state-metrics

# Wait for pods to be ready (may take 2-3 minutes)
kubectl wait --for=condition=ready pod -l "release=prometheus" -n monitoring --timeout=300s

# Verify installation
kubectl get pods -n monitoring
```

**Note:** All pods should show "Running" status. If some pods are in "Pending" or "CrashLoopBackOff", wait a minute and check again.

### 4.4 Install ArgoCD

```bash
# Create ArgoCD namespace
kubectl create namespace argocd

# Install ArgoCD using Helm
helm install argocd argo/argo-cd \
  --namespace argocd \
  --set server.service.type=ClusterIP

# Wait for ArgoCD pods to be ready (may take 2-3 minutes)
kubectl wait --for=condition=ready pod -l "app.kubernetes.io/name=argocd-server" -n argocd --timeout=300s

# Verify installation
kubectl get pods -n argocd
```

### 4.5 Get ArgoCD Initial Admin Password

```bash
# Retrieve the initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

# Save this password! You'll need it to login to ArgoCD
# Username: admin
# Password: (the output from above command)
```

---

## Step 5: Deploy Applications

### 5.1 Create Application Namespace

```bash
# Create namespace for ExploreSG applications
kubectl create namespace exploresg

# Verify namespace
kubectl get namespaces
```

### 5.2 Deploy Using kubectl (Manual Method)

```bash
# Deploy namespace (if not already created)
kubectl apply -f k8s/namespace.yaml

# Deploy Auth Database
kubectl apply -f k8s/exploresg-auth-db/

# Deploy Fleet Database
kubectl apply -f k8s/exploresg-fleet-db/

# Deploy Auth Service
kubectl apply -f k8s/exploresg-auth-service/

# Deploy Fleet Service
kubectl apply -f k8s/exploresg-fleet-service/

# Deploy Frontend Service
kubectl apply -f k8s/exploresg-frontend-service/

# Wait for all pods to be ready (may take 3-5 minutes)
kubectl get pods -n exploresg -w
# Press Ctrl+C when all pods are Running
```

### 5.3 Verify Deployments

```bash
# Check all pods
kubectl get pods -n exploresg

# Check all services
kubectl get svc -n exploresg

# Check deployments
kubectl get deployments -n exploresg

# Expected pods:
# - exploresg-auth-db-*
# - exploresg-auth-service-*
# - exploresg-fleet-db-*
# - exploresg-fleet-service-*
# - exploresg-frontend-service-*
```

### 5.4 Check Pod Logs (if needed)

```bash
# Check logs for any pod
kubectl logs -n exploresg <pod-name>

# Follow logs in real-time
kubectl logs -n exploresg <pod-name> -f

# Check previous logs if pod restarted
kubectl logs -n exploresg <pod-name> --previous
```

---

## Step 6: Setup Port Forwarding

### 6.1 Port Forward to Frontend

```bash
# Forward frontend service to localhost:3000
kubectl port-forward -n exploresg svc/exploresg-frontend-service 3000:3000
```

**Keep this terminal open. Open a new terminal for additional port forwards.**

### 6.2 Port Forward to Auth Service (in new terminal)

```bash
cd exploresg-cloud
kubectl port-forward -n exploresg svc/exploresg-auth-service 8080:8080
```

### 6.3 Port Forward to Fleet Service (in new terminal)

```bash
cd exploresg-cloud
kubectl port-forward -n exploresg svc/exploresg-fleet-service 8081:8080
```

### 6.4 Port Forward to Auth Database (in new terminal)

```bash
cd exploresg-cloud
kubectl port-forward -n exploresg svc/exploresg-auth-db-service 5432:5432
```

### 6.5 Port Forward to Fleet Database (in new terminal)

```bash
cd exploresg-cloud
kubectl port-forward -n exploresg svc/exploresg-fleet-db-service 5433:5432
```

### 6.7 Port Forward to Grafana (in new terminal)

```bash
cd exploresg-cloud
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80
```

### 6.8 Port Forward to Prometheus (in new terminal)

```bash
cd exploresg-cloud
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
```

### 6.9 Port Forward to ArgoCD (in new terminal)

```bash
cd exploresg-cloud
kubectl port-forward -n argocd svc/argocd-server 8443:443
```

### 6.10 Alternative: Use the Port Forward Script

**For Linux/macOS:**
```bash
# Make script executable
chmod +x scripts/port-forward.sh

# Run the script
./scripts/port-forward.sh
```

**Script starts port forwards in background for:**
- Frontend: http://localhost:3000
- Auth Service: http://localhost:8080
- Fleet Service: http://localhost:8081
- Auth Database: localhost:5432
- Fleet Database: localhost:5433
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090
- ArgoCD: https://localhost:8443

---

## Step 7: Verification

### 7.1 Access Applications

Open your browser and access:

**Main Applications:**
- **Frontend:** http://localhost:3000
- **Auth Service:** http://localhost:8080/health
- **Fleet Service:** http://localhost:8081/health

**Databases:**
- **Auth Database:** localhost:5432 (PostgreSQL)
- **Fleet Database:** localhost:5433 (PostgreSQL)

**Monitoring & GitOps:**
- **Grafana:** http://localhost:3001
  - Username: `admin`
  - Password: `prom-operator` (default)
  
- **Prometheus:** http://localhost:9090

- **ArgoCD:** https://localhost:8443 (accept self-signed cert)
  - Username: `admin`
  - Password: (from Step 4.5)

### 7.2 Test Database Connections

**Option 1: From within the cluster**
```bash
# Test Auth Database
kubectl exec -n exploresg -it deployment/exploresg-auth-db -- psql -U authuser -d authdb -c "SELECT version();"

# Test Fleet Database
kubectl exec -n exploresg -it deployment/exploresg-fleet-db -- psql -U fleetuser -d fleetdb -c "SELECT version();"
```

**Option 2: Via port-forward (requires port-forward to be running)**
```bash
# Connect to Auth Database
psql -h localhost -p 5432 -U authuser -d authdb

# Connect to Fleet Database
psql -h localhost -p 5433 -U fleetuser -d fleetdb
```

**Note:** You'll need the PostgreSQL password from the secrets. Get them with:
```bash
kubectl get secret exploresg-auth-db-secret -n exploresg -o jsonpath="{.data.POSTGRES_PASSWORD}" | base64 -d && echo
kubectl get secret exploresg-fleet-db-secret -n exploresg -o jsonpath="{.data.POSTGRES_PASSWORD}" | base64 -d && echo
```

### 7.3 Check Service Health

```bash
# Using curl
curl http://localhost:8080/health
curl http://localhost:8081/health

# Or check from within cluster
kubectl run curl-test --image=curlimages/curl -it --rm --restart=Never -- \
  curl http://exploresg-auth-service.exploresg.svc.cluster.local:8080/health
```

### 7.4 View Metrics in Grafana

1. Open Grafana: http://localhost:3001
2. Login with admin/prom-operator
3. Go to Dashboards → Browse
4. You should see pre-installed dashboards:
   - Kubernetes / Compute Resources / Cluster
   - Kubernetes / Compute Resources / Namespace (Pods)
   - Node Exporter / Nodes

### 7.5 Check Prometheus Targets

1. Open Prometheus: http://localhost:9090
2. Go to Status → Targets
3. All targets should be "UP"

---

## Step 8: Troubleshooting

### 8.1 Common Issues

**Pods not starting:**
```bash
# Describe pod to see events
kubectl describe pod -n exploresg <pod-name>

# Check logs
kubectl logs -n exploresg <pod-name>

# Check if images are being pulled
kubectl get events -n exploresg --sort-by='.lastTimestamp'
```

**Minikube not starting:**
```bash
# Delete and recreate cluster
minikube delete
minikube start --cpus=4 --memory=8192 --disk-size=20g --driver=docker
```

**Port forward disconnects:**
```bash
# Restart port forward
# Press Ctrl+C in the terminal running port-forward
# Run the command again
kubectl port-forward -n exploresg svc/frontend 3000:3000
```

**Insufficient resources:**
```bash
# Check Minikube resources
minikube ssh
free -h
df -h
exit

# If needed, recreate with more resources
minikube delete
minikube start --cpus=6 --memory=12288 --disk-size=30g --driver=docker
```

### 8.2 Restart Services

```bash
# Restart a specific deployment
kubectl rollout restart deployment/<deployment-name> -n exploresg

# Restart all deployments in namespace
kubectl rollout restart deployment -n exploresg
```

### 8.3 Clean and Redeploy

```bash
# Delete all resources in namespace
kubectl delete namespace exploresg

# Recreate and redeploy
kubectl create namespace exploresg
kubectl apply -f k8s/exploresg-auth-db/
kubectl apply -f k8s/exploresg-fleet-db/
kubectl apply -f k8s/exploresg-auth-service/
kubectl apply -f k8s/exploresg-fleet-service/
kubectl apply -f k8s/exploresg-frontend-service/
```

### 8.4 Check Cluster Resources

```bash
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n exploresg

# Check all resources
kubectl get all -n exploresg
```

---

## Step 9: Stopping and Starting

### 9.1 Stop Port Forwards

```bash
# If using manual port forwards, press Ctrl+C in each terminal

# If using script, kill port forwards
./scripts/kill-port-forwards.sh  # Windows: kill-port-forwards.ps1
```

### 9.2 Stop Minikube (Keep Data)

```bash
# Stop the cluster (preserves all data)
minikube stop

# Later, restart the cluster
minikube start

# Port forwards will need to be restarted after cluster restart
```

### 9.3 Delete Everything

```bash
# Delete the entire cluster and all data
minikube delete

# This removes:
# - All Kubernetes resources
# - All persistent data
# - All configurations
```

---

## Step 10: Next Steps

### 10.1 Setup ArgoCD for GitOps

Once you've verified everything works, you can set up ArgoCD to manage deployments:

```bash
# Apply ArgoCD applications
kubectl apply -f argocd/applications/root-app.yaml

# This will set up ArgoCD to manage all your applications
# from the Git repository
```

### 10.2 Configure Monitoring Dashboards

1. Import custom dashboards to Grafana
2. Set up alerts in Prometheus
3. Configure notification channels

### 10.3 Development Workflow

For development:
```bash
# Make changes to K8s manifests
vim k8s/exploresg-frontend-service/deployment.yaml

# Apply changes
kubectl apply -f k8s/exploresg-frontend-service/deployment.yaml

# Watch rollout
kubectl rollout status deployment/frontend -n exploresg
```

---

## Quick Reference

### Common Commands

```bash
# Check cluster status
minikube status
kubectl get nodes

# Check all pods
kubectl get pods --all-namespaces

# Check specific namespace
kubectl get all -n exploresg

# View logs
kubectl logs -n exploresg <pod-name> -f

# Execute command in pod
kubectl exec -n exploresg -it <pod-name> -- /bin/sh

# Port forward
kubectl port-forward -n exploresg svc/<service-name> <local-port>:<service-port>

# Restart deployment
kubectl rollout restart deployment/<name> -n exploresg
```

### Service URLs (after port forward)

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | N/A |
| Auth Service | http://localhost:8080 | N/A |
| Fleet Service | http://localhost:8081 | N/A |
| Auth Database | localhost:5432 | authuser / (from secret) |
| Fleet Database | localhost:5433 | fleetuser / (from secret) |
| Grafana | http://localhost:3001 | admin / prom-operator |
| Prometheus | http://localhost:9090 | N/A |
| ArgoCD | https://localhost:8443 | admin / (from secret) |

---

## Summary

You have now:
- ✅ Installed all required tools (Docker, kubectl, Minikube, Helm)
- ✅ Started a Minikube cluster
- ✅ Installed Prometheus, Grafana, and ArgoCD
- ✅ Deployed all ExploreSG applications
- ✅ Set up port forwarding to access all services
- ✅ Verified everything is working

Your local Kubernetes development environment is ready! 🚀

For production deployment to Digital Ocean, refer to `DIGITAL_OCEAN_DEPLOYMENT.md`.

---

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Kubernetes events: `kubectl get events -n exploresg`
3. Check pod logs: `kubectl logs -n exploresg <pod-name>`
4. Consult Minikube documentation: https://minikube.sigs.k8s.io/docs/

---

**Last Updated:** October 14, 2025
**Version:** 1.1.0

````
