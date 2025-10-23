# ExploreSG Cloud - Quick Start Guide

**Get your entire Kubernetes cluster running in under 10 minutes!**

---

## Prerequisites

- **Docker** installed and running
- **8GB RAM** available
- **20GB disk space**
- **Internet connection**

---

## Step 1: Install Required Tools

### Install kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
kubectl version --client
```

### Install Minikube
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64
minikube version
```

---

## Step 2: Start Minikube Cluster

```bash
# Start cluster with sufficient resources
minikube start --cpus=4 --memory=8192 --disk-size=20g --driver=docker

# Enable required addons
minikube addons enable ingress
minikube addons enable metrics-server

# Verify cluster is running
kubectl get nodes
```

**Expected output:** One node in "Ready" status

---

## Step 3: Deploy Applications

```bash
# Clone the repository
git clone https://github.com/Project-Be-Better/exploresg-cloud.git
cd exploresg-cloud

# Create namespace
kubectl create namespace exploresg

# Deploy all services
kubectl apply -f k8s/exploresg-auth-db/
kubectl apply -f k8s/exploresg-fleet-db/
kubectl apply -f k8s/exploresg-auth-service/
kubectl apply -f k8s/exploresg-fleet-service/
kubectl apply -f k8s/exploresg-frontend-service/

# Wait for pods to be ready (2-3 minutes)
kubectl get pods -n exploresg -w
```

Press `Ctrl+C` when all pods show "Running" status.

---

## Step 4: Setup Port Forwarding

### Option A: Automated Script (Recommended)

```bash
# Make script executable
chmod +x scripts/port-forward.sh

# Run port-forward script
./scripts/port-forward.sh
```

### Option B: Manual Port Forwards

```bash
# Kill any existing port-forwards
pkill -f "port-forward"

# Start all port-forwards
nohup kubectl port-forward -n exploresg --address 0.0.0.0 svc/exploresg-frontend-service 3000:3000 > /tmp/pf-frontend.log 2>&1 &
nohup kubectl port-forward -n exploresg --address 0.0.0.0 svc/exploresg-auth-service 8080:8080 > /tmp/pf-auth.log 2>&1 &
nohup kubectl port-forward -n exploresg --address 0.0.0.0 svc/exploresg-fleet-service 8081:8080 > /tmp/pf-fleet.log 2>&1 &
nohup kubectl port-forward -n exploresg --address 0.0.0.0 svc/exploresg-auth-db-service 5432:5432 > /tmp/pf-auth-db.log 2>&1 &
nohup kubectl port-forward -n exploresg --address 0.0.0.0 svc/exploresg-fleet-db-service 5433:5432 > /tmp/pf-fleet-db.log 2>&1 &
```

---

## Step 5: Access Your Applications

Open your browser and visit:

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Auth API** | http://localhost:8080 |
| **Fleet API** | http://localhost:8081 |
| **Auth Database** | localhost:5432 |
| **Fleet Database** | localhost:5433 |

### Verify Services

```bash
# Test frontend
curl http://localhost:3000

# Test auth service
curl http://localhost:8080/actuator/health

# Test fleet service
curl http://localhost:8081/actuator/health
```

---

## Common Commands

### Check Status
```bash
# Check all pods
kubectl get pods -n exploresg

# Check services
kubectl get svc -n exploresg

# Check logs
kubectl logs -n exploresg deployment/exploresg-frontend-service
```

### Restart Services
```bash
# Restart a specific service
kubectl rollout restart deployment/exploresg-frontend-service -n exploresg

# Restart all services
kubectl rollout restart deployment -n exploresg
```

### Stop Port Forwards
```bash
pkill -f "port-forward"
```

### Stop Minikube (Keeps Data)
```bash
minikube stop
```

### Delete Everything
```bash
minikube delete
```

---

## Troubleshooting

### Pods not starting?
```bash
kubectl describe pod -n exploresg <pod-name>
kubectl logs -n exploresg <pod-name>
```

### Port forward disconnected?
```bash
# Kill and restart
pkill -f "port-forward"
./scripts/port-forward.sh
```

### Not enough resources?
```bash
minikube delete
minikube start --cpus=6 --memory=12288 --disk-size=30g --driver=docker
```

---

## Next Steps

- **Setup Monitoring:** See [MONITORING.md](MONITORING.md)
- **Setup ArgoCD:** See [ARGOCD.md](ARGOCD.md)
- **Production Deployment:** See [DIGITAL_OCEAN_DEPLOYMENT.md](DIGITAL_OCEAN_DEPLOYMENT.md)

---

## Summary

✅ Minikube cluster running  
✅ All services deployed  
✅ Port forwards active  
✅ Applications accessible at localhost

**You're ready to develop!** 🚀

---

**Last Updated:** October 14, 2025
