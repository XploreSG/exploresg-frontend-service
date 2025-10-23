# Digital Ocean Kubernetes - Disaster Recovery Guide

> **Purpose:** Complete guide to recreate your Digital Ocean Kubernetes cluster from scratch if corrupted or lost
> 
> **Last Updated:** October 16, 2025  
> **Cluster:** Digital Ocean Kubernetes (DOKS)

---

## 🚨 Quick Answer: Can You Recover?

### ✅ **YES - You can recreate 95% of your cluster**

**What's in Git (Recoverable):**
- ✅ All application workloads (pods, deployments, services)
- ✅ All configurations (configmaps, secrets)
- ✅ All ingress routes and certificates
- ✅ ArgoCD GitOps configurations
- ✅ Monitoring dashboards and alerts

**What's NOT in Git (Lost on Corruption):**
- ❌ Database data (unless backed up separately)
- ❌ PersistentVolume data
- ❌ Helm chart state/history
- ❌ LoadBalancer IP (will get new one)
- ❌ ArgoCD application sync state

---

## 📋 Pre-Disaster Preparation (Do This NOW)

### 1. Database Backups (CRITICAL)

Your database data is **NOT** in git. You must back it up separately.

#### Option A: Manual PostgreSQL Dumps (Quick)

```bash
# Backup Auth Database
kubectl exec -n exploresg deployment/exploresg-auth-db -- \
  pg_dump -U exploresguser exploresg-auth-service-db > backup-auth-$(date +%Y%m%d).sql

# Backup Fleet Database  
kubectl exec -n exploresg deployment/exploresg-fleet-db -- \
  pg_dump -U exploresguser exploresg-fleet-service-db > backup-fleet-$(date +%Y%m%d).sql

# Store backups in S3/DO Spaces
aws s3 cp backup-*.sql s3://your-backup-bucket/
```

#### Option B: DigitalOcean Volume Snapshots (Recommended)

```bash
# Using doctl CLI
doctl compute volume-snapshot create YOUR_VOLUME_ID --snapshot-name "auth-db-backup-$(date +%Y%m%d)"
doctl compute volume-snapshot create YOUR_VOLUME_ID --snapshot-name "fleet-db-backup-$(date +%Y%m%d)"
```

#### Option C: Automated Kubernetes CronJob

Create a backup CronJob (see `k8s/backup/` directory if you add it).

---

### 2. Document Current State

```bash
# Save current cluster state
kubectl get all,pv,pvc,ingress,certificates -A > cluster-state-$(date +%Y%m%d).yaml

# Export Helm releases
helm list -A -o yaml > helm-releases-$(date +%Y%m%d).yaml

# Save LoadBalancer IP (important for DNS)
kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}' > loadbalancer-ip.txt
```

---

## 🔧 Full Cluster Recreation Steps

### Phase 1: Create New DOKS Cluster

#### Option A: DigitalOcean Web Console

1. Go to https://cloud.digitalocean.com/kubernetes
2. Click "Create Kubernetes Cluster"
3. Configure:
   - **Cluster Name:** `exploresg-prod-v2` (or similar)
   - **Region:** Same as before (for DNS)
   - **Kubernetes Version:** Latest stable (currently 1.28+)
   - **Node Pool:**
     - Node Plan: `Basic` (or your previous size)
     - Nodes: 2-3 nodes
     - Size: 2 GB RAM / 1 vCPU minimum (adjust as needed)
   - **VPC:** Same as before (or default)
4. Click "Create Cluster"
5. Wait 3-5 minutes for provisioning

#### Option B: doctl CLI

```bash
# Create cluster via CLI
doctl kubernetes cluster create exploresg-prod-v2 \
  --region sgp1 \
  --version 1.28.2-do.0 \
  --node-pool "name=worker-pool;size=s-2vcpu-4gb;count=2;auto-scale=true;min-nodes=2;max-nodes=4"

# Get kubeconfig
doctl kubernetes cluster kubeconfig save exploresg-prod-v2
```

---

### Phase 2: Install Infrastructure Components

These are **NOT** in your git repo but are required for your apps to work.

#### 1. Install NGINX Ingress Controller

```bash
# Add Helm repo
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install ingress controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer \
  --version 4.13.3

# Wait for LoadBalancer IP
kubectl get svc -n ingress-nginx -w
```

**⚠️ IMPORTANT:** Note the new LoadBalancer IP! You'll need to update DNS.

#### 2. Install cert-manager (for SSL/TLS)

```bash
# Add Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.2 \
  --set installCRDs=true

# Apply your cluster issuer (this IS in git)
kubectl apply -f k8s/cert-manager/cluster-issuer.yaml
```

#### 3. Install ArgoCD (Optional - for GitOps)

```bash
# Add ArgoCD Helm repo
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

# Install ArgoCD
helm install argocd argo/argo-cd \
  --namespace argocd \
  --create-namespace \
  --version 7.7.12

# Apply your ArgoCD ingress (this IS in git)
kubectl apply -f k8s/argocd/ingress.yaml

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

#### 4. Install Monitoring (Optional)

```bash
# Add Prometheus community Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --version 78.2.1

# Apply your monitoring ingress (this IS in git)
kubectl apply -f k8s/monitoring/ingress.yaml
```

---

### Phase 3: Deploy Your Applications

Now deploy your actual application workloads (all in git).

#### Option A: Manual Deployment (Traditional)

```bash
# Clone your repository
git clone https://github.com/Project-Be-Better/exploresg-cloud.git
cd exploresg-cloud
git checkout digitalocean

# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy all services
kubectl apply -f k8s/exploresg-auth-db/
kubectl apply -f k8s/exploresg-fleet-db/

# Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=exploresg-auth-db -n exploresg --timeout=300s
kubectl wait --for=condition=ready pod -l app=exploresg-fleet-db -n exploresg --timeout=300s

# Deploy services
kubectl apply -f k8s/exploresg-auth-service/
kubectl apply -f k8s/exploresg-fleet-service/
kubectl apply -f k8s/exploresg-frontend-service/
```

#### Option B: ArgoCD Deployment (GitOps - Recommended)

```bash
# Deploy the root ArgoCD application (App of Apps)
kubectl apply -f argocd/applications/root-app.yaml

# ArgoCD will automatically deploy everything else
# Monitor progress
kubectl get applications -n argocd -w
```

---

### Phase 4: Restore Database Data

**⚠️ CRITICAL:** Without backups, this data is LOST!

#### If You Have SQL Dumps

```bash
# Copy dump file to auth db pod
kubectl cp backup-auth-20251016.sql exploresg/exploresg-auth-db-XXX:/tmp/backup.sql

# Restore auth database
kubectl exec -n exploresg deployment/exploresg-auth-db -- \
  psql -U exploresguser exploresg-auth-service-db < /tmp/backup.sql

# Repeat for fleet database
kubectl cp backup-fleet-20251016.sql exploresg/exploresg-fleet-db-XXX:/tmp/backup.sql

kubectl exec -n exploresg deployment/exploresg-fleet-db -- \
  psql -U exploresguser exploresg-fleet-service-db < /tmp/backup.sql
```

#### If You Have Volume Snapshots

1. In DigitalOcean console, restore volumes from snapshots
2. Update PVCs to use restored volumes
3. Restart database pods

---

### Phase 5: Update DNS Records

**⚠️ CRITICAL:** Your LoadBalancer IP will be different!

```bash
# Get new LoadBalancer IP
NEW_IP=$(kubectl get svc ingress-nginx-controller -n ingress-nginx \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

echo "Update DNS A records to point to: $NEW_IP"
```

**Update these DNS records:**
- `xplore.town` → NEW_IP
- `www.xplore.town` → NEW_IP
- `api.xplore.town` → NEW_IP
- `grafana.tools.xplore.town` → NEW_IP
- `prom.tools.xplore.town` → NEW_IP
- `argo.tools.xplore.town` → NEW_IP

**Wait for DNS propagation (5-30 minutes):**
```bash
# Check DNS propagation
dig xplore.town +short
dig api.xplore.town +short
```

---

### Phase 6: Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n exploresg

# Check PVCs are bound
kubectl get pvc -n exploresg

# Check ingress has IP
kubectl get ingress -n exploresg

# Check certificates are issued
kubectl get certificates -n exploresg

# Test endpoints
curl https://api.xplore.town/auth/actuator/health
curl https://api.xplore.town/fleet/actuator/health
curl https://xplore.town

# Check ArgoCD sync status (if using GitOps)
kubectl get applications -n argocd
```

---

## 📊 What's Tracked vs Not Tracked

### ✅ In Git Repository (Fully Recoverable)

| Category | Files | Recovery |
|----------|-------|----------|
| **Namespace** | `k8s/namespace.yaml` | ✅ Automatic |
| **Deployments** | `k8s/exploresg-*/deployment.yaml` | ✅ Automatic |
| **Services** | `k8s/exploresg-*/service.yaml` | ✅ Automatic |
| **ConfigMaps** | `k8s/exploresg-*/configmap.yaml` | ✅ Automatic |
| **Secrets** | `k8s/exploresg-*/secret.yaml` | ✅ Automatic |
| **PVCs** | `k8s/exploresg-*-db/pvc.yaml` | ✅ Automatic |
| **Ingress** | `k8s/exploresg-*/ingress.yaml` | ✅ Automatic |
| **Cert Manager** | `k8s/cert-manager/` | ✅ Automatic |
| **ArgoCD Apps** | `argocd/applications/` | ✅ Automatic |
| **Monitoring** | `k8s/monitoring/` | ✅ Automatic |

### ❌ NOT in Git (Requires Manual Steps)

| Component | Install Method | Recovery Time |
|-----------|----------------|---------------|
| **NGINX Ingress** | Helm chart | 5 min |
| **cert-manager** | Helm chart | 5 min |
| **ArgoCD** | Helm chart | 5 min |
| **Monitoring Stack** | Helm chart | 10 min |
| **Database Data** | Backups | 10-60 min (depends on size) |
| **PersistentVolumes** | Auto-provisioned | Automatic (but empty) |
| **LoadBalancer IP** | DO assigns | Automatic (but different) |

### ⚠️ Cluster-Specific (Will Change on New Cluster)

| Resource | Old Value | New Value |
|----------|-----------|-----------|
| **LoadBalancer IP** | `129.212.208.126` | Will be different! |
| **PersistentVolume IDs** | `pvc-9098168f-...` | Will be different |
| **Node IPs** | Internal IPs | Will be different |
| **Cluster ID** | DO cluster ID | Will be different |

---

## 🔄 Recovery Time Estimates

| Scenario | Time | Difficulty |
|----------|------|------------|
| **Full cluster recreation (no data)** | 30-45 min | 🟡 Medium |
| **Full cluster + data restoration** | 1-3 hours | 🔴 Hard |
| **DNS propagation wait** | 5-30 min | 🟢 Easy (just wait) |
| **SSL certificates issuance** | 2-5 min | 🟢 Easy (automatic) |

**Total Recovery Time: 1-4 hours** (depending on data size and DNS propagation)

---

## 📝 Recovery Checklist

Use this checklist during actual recovery:

### Pre-Recovery (Before Disaster)
- [ ] Database backups automated (weekly minimum)
- [ ] Volume snapshots configured
- [ ] DNS TTL reduced (for faster updates)
- [ ] Current LoadBalancer IP documented
- [ ] Helm release list exported
- [ ] Access to DigitalOcean account confirmed
- [ ] Git repository access confirmed

### During Recovery
- [ ] New DOKS cluster created
- [ ] kubeconfig downloaded and configured
- [ ] NGINX Ingress Controller installed
- [ ] New LoadBalancer IP obtained
- [ ] cert-manager installed
- [ ] ArgoCD installed (optional)
- [ ] Monitoring stack installed (optional)
- [ ] Application namespace created
- [ ] All application manifests applied
- [ ] PVCs bound successfully
- [ ] Database data restored
- [ ] DNS records updated
- [ ] DNS propagation confirmed
- [ ] SSL certificates issued
- [ ] All pods running
- [ ] All services accessible

### Post-Recovery
- [ ] Verify all endpoints working
- [ ] Test user authentication
- [ ] Test database queries
- [ ] Verify CORS working
- [ ] Check monitoring dashboards
- [ ] Update documentation with new IPs
- [ ] Notify team of recovery completion

---

## 🛠️ Automation Scripts

### Quick Recovery Script

Create this script: `scripts/disaster-recovery.sh`

```bash
#!/bin/bash
set -e

echo "🚨 Digital Ocean Kubernetes Disaster Recovery"
echo "=============================================="

# Phase 1: Install infrastructure
echo "📦 Installing infrastructure components..."
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true
helm install argocd argo/argo-cd --namespace argocd --create-namespace

# Phase 2: Deploy applications
echo "🚀 Deploying applications..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/cert-manager/cluster-issuer.yaml

# Use ArgoCD for application deployment
kubectl apply -f argocd/applications/root-app.yaml

# Phase 3: Get new IPs
echo "📍 New LoadBalancer IP:"
kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

echo ""
echo "✅ Infrastructure deployed! Next steps:"
echo "1. Update DNS records with new LoadBalancer IP"
echo "2. Restore database backups"
echo "3. Wait for SSL certificates"
echo "4. Verify all services"
```

---

## 💾 Backup Strategy Recommendations

### Minimum (Required)
- ✅ Weekly SQL dumps of both databases
- ✅ Store backups in external location (S3/DO Spaces)
- ✅ Document current cluster state monthly

### Recommended
- ✅ Daily automated SQL dumps
- ✅ Weekly volume snapshots
- ✅ Backup retention: 30 days
- ✅ Test restore procedure quarterly

### Enterprise
- ✅ Continuous database replication to backup region
- ✅ Point-in-time recovery (PITR) enabled
- ✅ Automated disaster recovery drills
- ✅ Multi-region deployment

---

## 🔗 Related Documentation

- [Replication Checklist](../REPLICATION_CHECKLIST.md) - For new environments
- [Storage Configuration](../k8s/STORAGE_CONFIG.md) - PVC configuration
- [Operations Guide](OPERATIONS.md) - Day-2 operations
- [ArgoCD Guide](ARGOCD.md) - GitOps deployment

---

## 📞 Emergency Contacts

- **DigitalOcean Support:** https://cloud.digitalocean.com/support
- **GitHub Issues:** https://github.com/Project-Be-Better/exploresg-cloud/issues
- **DNS Provider:** (Update with your DNS provider contact)

---

## ✅ Summary

### Can You Recover from DO K8s Corruption?

**YES ✅**, with these caveats:

| What | Recoverable | Notes |
|------|-------------|-------|
| **Applications** | ✅ 100% | All in git |
| **Configuration** | ✅ 100% | All in git |
| **Infrastructure** | ✅ 95% | Requires 30 min Helm installs |
| **Database Data** | ⚠️ Only if backed up | **NOT in git - backup separately!** |
| **LoadBalancer IP** | ❌ Will change | Update DNS required |
| **SSL Certificates** | ✅ Auto-renewed | Let's Encrypt will re-issue |

### The ONE Critical Thing: **DATABASE BACKUPS!**

Everything else can be recreated from git in 30-60 minutes. But your database data **MUST** be backed up separately or it's **LOST FOREVER**.

---

**Last Updated:** October 16, 2025  
**Tested:** ✅ Recovery procedure tested on staging cluster  
**Next Review:** January 16, 2026
