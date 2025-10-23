# 🌊 Digital Ocean Kubernetes Deployment Guide

> **Complete guide for deploying ExploreSG to Digital Ocean Kubernetes (DOKS)**

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Phase 1: Digital Ocean Setup](#phase-1-digital-ocean-setup)
- [Phase 2: Kubernetes Cluster Setup](#phase-2-kubernetes-cluster-setup)
- [Phase 3: Install Required Tools](#phase-3-install-required-tools)
- [Phase 4: Deploy Applications](#phase-4-deploy-applications)
- [Phase 5: Configure Monitoring](#phase-5-configure-monitoring)
- [Phase 6: Setup CI/CD with ArgoCD](#phase-6-setup-cicd-with-argocd)
- [Phase 7: Configure Domain & SSL](#phase-7-configure-domain--ssl)
- [Phase 8: Production Hardening](#phase-8-production-hardening)
- [Maintenance & Operations](#maintenance--operations)
- [Troubleshooting](#troubleshooting)
- [Cost Optimization](#cost-optimization)

---

## 🎯 Overview

This guide walks you through deploying ExploreSG to Digital Ocean's managed Kubernetes service (DOKS).

### What You'll Deploy

| Component | Purpose | Resources Required |
|-----------|---------|-------------------|
| **DOKS Cluster** | Kubernetes cluster | 3 nodes (2 vCPU, 4GB each) |
| **PostgreSQL DBs** | Auth & Fleet databases | 2 StatefulSets with PVCs |
| **Backend Services** | Spring Boot APIs | 2 Deployments |
| **Frontend** | React application | 1 Deployment |
| **ArgoCD** | GitOps deployment | 1 namespace |
| **Prometheus + Grafana** | Monitoring stack | 1 namespace |
| **Load Balancer** | External access | 1 DigitalOcean LB |

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  DigitalOcean Cloud                     │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │         Load Balancer (External IP)               │ │
│  └────────────────┬──────────────────────────────────┘ │
│                   │                                     │
│  ┌────────────────▼──────────────────────────────────┐ │
│  │         DOKS Kubernetes Cluster                   │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────┐    │ │
│  │  │  exploresg namespace                     │    │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌────────┐ │    │ │
│  │  │  │Frontend  │  │Auth API  │  │Fleet API│ │    │ │
│  │  │  └────┬─────┘  └────┬─────┘  └────┬───┘ │    │ │
│  │  │       │             │             │      │    │ │
│  │  │  ┌────▼─────┐  ┌────▼─────┐             │    │ │
│  │  │  │Auth DB   │  │Fleet DB  │             │    │ │
│  │  │  │(PVC 10GB)│  │(PVC 10GB)│             │    │ │
│  │  │  └──────────┘  └──────────┘             │    │ │
│  │  └──────────────────────────────────────────┘    │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────┐    │ │
│  │  │  argocd namespace                        │    │ │
│  │  │  (GitOps Deployment)                     │    │ │
│  │  └──────────────────────────────────────────┘    │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────┐    │ │
│  │  │  monitoring namespace                    │    │ │
│  │  │  (Prometheus + Grafana)                  │    │ │
│  │  └──────────────────────────────────────────┘    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Prerequisites

### 1. Digital Ocean Account

- Sign up at https://www.digitalocean.com
- Add payment method
- Enable 2FA for security

### 2. Local Tools Required

| Tool | Version | Installation |
|------|---------|-------------|
| **kubectl** | 1.28+ | https://kubernetes.io/docs/tasks/tools/ |
| **doctl** | Latest | https://docs.digitalocean.com/reference/doctl/ |
| **helm** | 3.0+ | https://helm.sh/docs/intro/install/ |
| **git** | Latest | https://git-scm.com/downloads |

### 3. GitHub Repository Access

- Fork or clone: https://github.com/Project-Be-Better/exploresg-cloud
- Ensure you have push access

### 4. Domain (Optional but Recommended)

- Purchase domain from any registrar
- Configure nameservers to point to DigitalOcean

---

## 📦 Phase 1: Digital Ocean Setup

### Step 1.1: Install Digital Ocean CLI (doctl)

**Linux/Mac:**
```bash
# Download and install
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.98.1/doctl-1.98.1-linux-amd64.tar.gz
tar xf doctl-1.98.1-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin
```

**Windows:**
```powershell
# Using Chocolatey
choco install doctl

# Or download from: https://github.com/digitalocean/doctl/releases
```

**Verify Installation:**
```bash
doctl version
```

### Step 1.2: Authenticate doctl

1. **Get API Token:**
   - Login to DigitalOcean
   - Go to API → Tokens/Keys
   - Generate New Token (Read & Write scopes)
   - Copy the token

2. **Initialize doctl:**
   ```bash
   doctl auth init
   # Paste your API token when prompted
   ```

3. **Verify:**
   ```bash
   doctl account get
   ```

---

## ☸️ Phase 2: Kubernetes Cluster Setup

### Step 2.1: Create DOKS Cluster

**Option A: Using doctl (Recommended)**

```bash
# Create cluster with 3 nodes
```bash
# Create cluster with 3 nodes (check for latest version first)
doctl kubernetes options versions

# Example: Use the latest stable version (replace with latest from above)
doctl kubernetes cluster create exploresg-cluster \
  --region sgp1 \
  --version 1.33.1-do.4  \
  --node-pool "name=worker-pool;size=s-2vcpu-4gb;count=3;auto-scale=true;min-nodes=2;max-nodes=5" \
  --wait
```
> **Tip:** Always run `doctl kubernetes options versions` to see the latest available Kubernetes versions before creating or upgrading your cluster.

# This takes 5-10 minutes
```

**Option B: Using Web UI**

1. Login to DigitalOcean
2. Go to Kubernetes → Create Cluster
3. Configure:
   - **Region:** Singapore (sgp1) or closest to you
   - **Version:** Latest stable (1.28+)
   - **Node Pool:** 
     - Size: Basic (2 vCPU, 4GB RAM)
     - Count: 3 nodes
     - Enable auto-scaling: 2-5 nodes
4. Click "Create Cluster"

**Cost Estimate:** ~$72/month for 3 nodes

### Step 2.2: Configure kubectl

```bash
# Download kubeconfig
doctl kubernetes cluster kubeconfig save exploresg-cluster

# Verify connection
kubectl cluster-info
kubectl get nodes

# Should show 3 nodes in Ready state
```

### Step 2.3: Verify Cluster

```bash
# Check nodes
kubectl get nodes -o wide

# Check system pods
kubectl get pods -n kube-system

# Check available storage classes
kubectl get storageclass
```

---

## 🛠️ Phase 3: Install Required Tools

### Step 3.1: Install Helm

**Already installed?** Check with:
```bash
helm version
```

**Not installed?** See [Prerequisites](#prerequisites) section.

**Configure Helm:**
```bash
# Add required repositories
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

### Step 3.2: Install ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
helm install argocd argo/argo-cd \
  --namespace argocd \
  --set server.service.type=LoadBalancer \
  --set server.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-name"="argocd-lb" \
  --wait \
  --timeout 10m

# Wait for LoadBalancer to get external IP (takes 2-3 minutes)
kubectl get svc argocd-server -n argocd -w
```

**Get ArgoCD Access Details:**
```bash
# Get external IP
export ARGOCD_IP=$(kubectl get svc argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "ArgoCD URL: http://${ARGOCD_IP}"

# Get admin password
export ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo "Username: admin"
echo "Password: ${ARGOCD_PASSWORD}"
```

**Access ArgoCD:**
- Open `http://<ARGOCD_IP>` in browser
- Login with admin credentials

### Step 3.3: Install Prometheus + Grafana

```bash
# Create namespace
kubectl create namespace monitoring

# Create custom values file
cat > prometheus-values.yaml << 'EOF'
grafana:
  adminPassword: admin123
  service:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/do-loadbalancer-name: "grafana-lb"
  persistence:
    enabled: true
    size: 10Gi

prometheus:
  prometheusSpec:
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false
    retention: 15d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: do-block-storage
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 20Gi

alertmanager:
  enabled: true
  alertmanagerSpec:
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: do-block-storage
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 10Gi
EOF

# Install monitoring stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values prometheus-values.yaml \
  --wait \
  --timeout 15m

# Get Grafana URL
export GRAFANA_IP=$(kubectl get svc prometheus-grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Grafana URL: http://${GRAFANA_IP}"
echo "Username: admin"
echo "Password: admin123"
```

---

## 🚀 Phase 4: Deploy Applications

### Step 4.1: Create Namespace

```bash
# Create exploresg namespace
kubectl create namespace exploresg
```

### Step 4.2: Update Kubernetes Manifests for Production

**Important Changes for Digital Ocean:**

1. **Update Storage Class** (for databases):

```bash
# Update PVC files to use Digital Ocean storage
sed -i 's/storageClassName: standard/storageClassName: do-block-storage/g' k8s/exploresg-auth-db/pvc.yaml
sed -i 's/storageClassName: standard/storageClassName: do-block-storage/g' k8s/exploresg-fleet-db/pvc.yaml
```

2. **Update Service Types** (for external access):

Edit `k8s/exploresg-frontend-service/service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: exploresg-frontend-service
  namespace: exploresg
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-name: "exploresg-frontend-lb"
spec:
  type: LoadBalancer  # Changed from ClusterIP
  selector:
    app: exploresg-frontend-service
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
```

3. **Update ConfigMaps** for production URLs:

Edit `k8s/exploresg-frontend-service/configmap.yaml`:
```yaml
# Update CORS origins with your actual domain/IPs
CORS_ALLOWED_ORIGINS: "http://your-domain.com,https://your-domain.com"
```

### Step 4.3: Deploy via ArgoCD (GitOps Method)

**Step A: Push Changes to Git**
```bash
# Commit your changes
git add .
git commit -m "Configure for Digital Ocean deployment"
git push origin main
```

**Step B: Deploy ArgoCD Applications**
```bash
# Deploy all applications
kubectl apply -f argocd/applications/

# Verify applications
kubectl get applications -n argocd

# Watch sync status
watch kubectl get applications -n argocd
```

**Step C: Monitor Deployment**
```bash
# Watch pods
watch kubectl get pods -n exploresg

# Check services
kubectl get svc -n exploresg

# Get application logs
kubectl logs -f -l app=exploresg-auth-service -n exploresg
```

### Step 4.4: Alternative - Direct Deployment (Non-GitOps)

If you prefer not to use ArgoCD:

```bash
# Deploy in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/exploresg-auth-db/
kubectl apply -f k8s/exploresg-fleet-db/

# Wait for databases
kubectl wait --for=condition=ready pod -l app=exploresg-auth-db -n exploresg --timeout=300s
kubectl wait --for=condition=ready pod -l app=exploresg-fleet-db -n exploresg --timeout=300s

# Deploy services
kubectl apply -f k8s/exploresg-auth-service/
kubectl apply -f k8s/exploresg-fleet-service/

# Wait for services
sleep 30

# Deploy frontend
kubectl apply -f k8s/exploresg-frontend-service/
```

### Step 4.5: Get Application URLs

```bash
# Frontend URL
export FRONTEND_IP=$(kubectl get svc exploresg-frontend-service -n exploresg -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Frontend: http://${FRONTEND_IP}"

# Auth Service (if exposed via LoadBalancer)
export AUTH_IP=$(kubectl get svc exploresg-auth-service -n exploresg -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Auth API: http://${AUTH_IP}:8080"

# Fleet Service
export FLEET_IP=$(kubectl get svc exploresg-fleet-service -n exploresg -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Fleet API: http://${FLEET_IP}:8080"
```

---

## 📊 Phase 5: Configure Monitoring

### Step 5.1: Access Grafana

```bash
# Get Grafana URL (from Phase 3)
kubectl get svc prometheus-grafana -n monitoring

# Open in browser
# Default: admin / admin123
```

### Step 5.2: Import Kubernetes Dashboards

1. Login to Grafana
2. Go to Dashboards → Import
3. Import these popular dashboards:
   - **15760** - Kubernetes / Views / Global
   - **15757** - Kubernetes / Views / Namespaces
   - **15758** - Kubernetes / Views / Pods
   - **12740** - Kubernetes Monitoring

### Step 5.3: Setup Alerts (Optional)

Configure Prometheus alerts for:
- Pod restarts
- High memory usage
- High CPU usage
- Database connection failures

Example alert rule:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: custom-alerts
  namespace: monitoring
data:
  custom-rules.yaml: |
    groups:
    - name: exploresg-alerts
      interval: 30s
      rules:
      - alert: PodRestarting
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod {{ $labels.pod }} is restarting"
```

---

## 🔄 Phase 6: Setup CI/CD with ArgoCD

### Step 6.1: Configure Repository

ArgoCD is already pointing to your Git repo (from `argocd/applications/`).

### Step 6.2: Enable Auto-Sync

All applications are configured with:
```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
```

This means:
- Changes pushed to Git are automatically deployed
- Manual changes are reverted
- Deleted resources are cleaned up

### Step 6.3: Test GitOps Workflow

```bash
# 1. Make a change
# Edit k8s/exploresg-auth-service/deployment.yaml
# Change replicas from 1 to 2

# 2. Commit and push
git add .
git commit -m "Scale auth service to 2 replicas"
git push origin main

# 3. Watch ArgoCD sync (happens within 3 minutes)
watch kubectl get applications -n argocd

# 4. Verify change applied
kubectl get pods -n exploresg -l app=exploresg-auth-service
```

### Step 6.4: Setup Webhooks (Optional)

For instant deployments without waiting 3 minutes:

1. Go to GitHub → Your Repo → Settings → Webhooks
2. Add webhook:
   - **Payload URL:** `http://<ARGOCD_IP>/api/webhook`
   - **Content type:** application/json
   - **Events:** Just the push event
3. Save

Now changes deploy immediately on git push!

---

## 🌐 Phase 7: Configure Domain & SSL

### Step 7.1: Point Domain to Load Balancer

1. Get your LoadBalancer IPs:
```bash
kubectl get svc -A | grep LoadBalancer
```

2. Add DNS records at your domain registrar:
```
Type    Name                Value
A       exploresg.com       <FRONTEND_IP>
A       www                 <FRONTEND_IP>
A       api                 <AUTH_IP>
A       argocd              <ARGOCD_IP>
A       grafana             <GRAFANA_IP>
```

### Step 7.2: Install cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s
```

### Step 7.3: Configure Let's Encrypt

```bash
cat > letsencrypt-prod.yaml << 'EOF'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com  # Change this!
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

kubectl apply -f letsencrypt-prod.yaml
```

### Step 7.4: Install Ingress Controller

```bash
# Install nginx ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-name"="nginx-ingress-lb"
```

### Step 7.5: Create Ingress Resources

```yaml
cat > ingress.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: exploresg-ingress
  namespace: exploresg
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - exploresg.com
    - www.exploresg.com
    - api.exploresg.com
    secretName: exploresg-tls
  rules:
  - host: exploresg.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: exploresg-frontend-service
            port:
              number: 3000
  - host: www.exploresg.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: exploresg-frontend-service
            port:
              number: 3000
  - host: api.exploresg.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: exploresg-auth-service
            port:
              number: 8080
EOF

kubectl apply -f ingress.yaml
```

---

## 🔒 Phase 8: Production Hardening

### Step 8.1: Update Secrets

**Never use default passwords in production!**

```bash
# Generate secure passwords
export AUTH_DB_PASSWORD=$(openssl rand -base64 32)
export FLEET_DB_PASSWORD=$(openssl rand -base64 32)
export JWT_SECRET=$(openssl rand -hex 64)

# Update secrets
kubectl create secret generic exploresg-auth-db-secret \
  --from-literal=POSTGRES_PASSWORD=${AUTH_DB_PASSWORD} \
  --namespace=exploresg \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic exploresg-auth-service-secret \
  --from-literal=SPRING_DATASOURCE_PASSWORD=${AUTH_DB_PASSWORD} \
  --from-literal=JWT_SECRET_KEY=${JWT_SECRET} \
  --namespace=exploresg \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart pods to pick up new secrets
kubectl rollout restart deployment -n exploresg
```

### Step 8.2: Enable Resource Limits

Update deployments with resource requests/limits:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Step 8.3: Enable Network Policies

```bash
cat > network-policy.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: exploresg-network-policy
  namespace: exploresg
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: exploresg
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  egress:
  - to:
    - namespaceSelector: {}
  - to:
    - podSelector: {}
  - ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
EOF

kubectl apply -f network-policy.yaml
```

### Step 8.4: Setup Backups

**Database Backups:**

```bash
# Create backup script
cat > backup-databases.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup Auth DB
kubectl exec -n exploresg $(kubectl get pod -n exploresg -l app=exploresg-auth-db -o jsonpath='{.items[0].metadata.name}') -- \
  pg_dump -U exploresguser exploresg-auth-service-db > ${BACKUP_DIR}/auth-db-${DATE}.sql

# Backup Fleet DB
kubectl exec -n exploresg $(kubectl get pod -n exploresg -l app=exploresg-fleet-db -o jsonpath='{.items[0].metadata.name}') -- \
  pg_dump -U exploresguser exploresg-fleet-service-db > ${BACKUP_DIR}/fleet-db-${DATE}.sql

# Upload to DigitalOcean Spaces (S3-compatible)
# s3cmd put ${BACKUP_DIR}/*.sql s3://your-backup-bucket/
EOF

chmod +x backup-databases.sh

# Setup cron job to run daily
crontab -e
# Add: 0 2 * * * /path/to/backup-databases.sh
```

### Step 8.5: Enable Pod Security

```bash
kubectl label namespace exploresg pod-security.kubernetes.io/enforce=restricted
kubectl label namespace exploresg pod-security.kubernetes.io/audit=restricted
kubectl label namespace exploresg pod-security.kubernetes.io/warn=restricted
```

---

## 🔧 Maintenance & Operations

### Daily Operations

```bash
# Check cluster health
kubectl get nodes
kubectl top nodes

# Check application health
kubectl get pods -n exploresg
kubectl get applications -n argocd

# Check resource usage
kubectl top pods -n exploresg
```

### Weekly Maintenance

```bash
# Update ArgoCD
helm upgrade argocd argo/argo-cd -n argocd

# Update monitoring stack
helm upgrade prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Review logs for errors
kubectl logs --tail=100 -l app=exploresg-auth-service -n exploresg
```

### Monthly Tasks

1. Review and rotate secrets
2. Check DigitalOcean billing
3. Review resource usage and optimize
4. Update Kubernetes version if available
5. Review and update container images

### Scaling Operations

**Scale Application:**
```bash
# Scale frontend to 3 replicas
kubectl scale deployment exploresg-frontend-service -n exploresg --replicas=3

# Or update via GitOps
# Edit k8s/exploresg-frontend-service/deployment.yaml
# git commit and push
```

**Scale Cluster:**
```bash
# Via doctl
doctl kubernetes cluster node-pool update exploresg-cluster worker-pool --count 5

# Or use auto-scaling (already configured)
```

---

## 🚨 Troubleshooting

### Issue: Pods Not Starting

```bash
# Check pod status
kubectl get pods -n exploresg

# Describe pod for events
kubectl describe pod <pod-name> -n exploresg

# Check logs
kubectl logs <pod-name> -n exploresg

# Common fixes:
# 1. Check image pull secrets
# 2. Verify resource limits
# 3. Check PVC binding
```

### Issue: Database Connection Failed

```bash
# Test database connectivity
kubectl exec -it <app-pod> -n exploresg -- nc -zv exploresg-auth-db-service 5432

# Check database logs
kubectl logs -l app=exploresg-auth-db -n exploresg

# Verify secret
kubectl get secret exploresg-auth-service-secret -n exploresg -o yaml
```

### Issue: LoadBalancer Stuck in Pending

```bash
# Check LoadBalancer status
kubectl describe svc exploresg-frontend-service -n exploresg

# Check DigitalOcean console for LoadBalancer creation
# Sometimes takes 3-5 minutes

# If stuck, delete and recreate
kubectl delete svc exploresg-frontend-service -n exploresg
kubectl apply -f k8s/exploresg-frontend-service/service.yaml
```

### Issue: ArgoCD Not Syncing

```bash
# Check application status
kubectl get application exploresg-auth-service -n argocd -o yaml

# Force refresh
kubectl patch application exploresg-auth-service -n argocd \
  --type merge \
  -p '{"metadata":{"annotations":{"argocd.argoproj.io/refresh":"hard"}}}'

# Check ArgoCD logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller
```

---

## 💰 Cost Optimization

### Current Estimated Costs

| Resource | Monthly Cost |
|----------|-------------|
| DOKS Cluster (3 nodes, 2vCPU/4GB) | $72 |
| LoadBalancers (3x) | $30 |
| Block Storage (50GB total) | $5 |
| Bandwidth (1TB included) | $0-10 |
| **Total Estimate** | **$107-117/month** |

### Optimization Tips

1. **Use single LoadBalancer with Ingress**
   - Saves $20/month
   - Implement in Phase 7

2. **Enable auto-scaling down**
   - Scale to 2 nodes during low traffic
   - Saves ~$24/month

3. **Use spot instances** (when available)
   - 50-70% cost reduction
   - Check DigitalOcean for availability

4. **Reduce block storage**
   - Use smaller PVC sizes if sufficient
   - Enable compression in PostgreSQL

5. **Optimize images**
   - Use multi-stage Docker builds
   - Reduce image sizes

### Student Credits

- **GitHub Student Developer Pack:** $200 DO credit
- **DigitalOcean for Students:** Sometimes offers credits

---

## 📚 Additional Resources

### Documentation

- [DigitalOcean Kubernetes Docs](https://docs.digitalocean.com/products/kubernetes/)
- [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Prometheus Docs](https://prometheus.io/docs/)

### Monitoring

- **DigitalOcean Dashboard:** https://cloud.digitalocean.com/kubernetes/clusters
- **ArgoCD UI:** `http://<ARGOCD_IP>`
- **Grafana:** `http://<GRAFANA_IP>`

### Support

- **DigitalOcean Community:** https://www.digitalocean.com/community
- **DigitalOcean Support:** Submit ticket in dashboard
- **Your GitHub Repo Issues:** For application-specific issues

---

## ✅ Deployment Checklist

Use this checklist to track your deployment progress:

- [ ] Phase 1: Digital Ocean Setup
  - [ ] Install doctl
  - [ ] Authenticate doctl
  - [ ] Verify account access

- [ ] Phase 2: Kubernetes Cluster
  - [ ] Create DOKS cluster
  - [ ] Configure kubectl
  - [ ] Verify cluster access

- [ ] Phase 3: Install Tools
  - [ ] Install Helm
  - [ ] Install ArgoCD
  - [ ] Install Prometheus + Grafana
  - [ ] Access all UIs

- [ ] Phase 4: Deploy Applications
  - [ ] Update manifests for DO
  - [ ] Create namespace
  - [ ] Deploy via ArgoCD
  - [ ] Verify all pods running
  - [ ] Test applications

- [ ] Phase 5: Configure Monitoring
  - [ ] Access Grafana
  - [ ] Import dashboards
  - [ ] Setup alerts

- [ ] Phase 6: Setup CI/CD
  - [ ] Verify ArgoCD sync
  - [ ] Test GitOps workflow
  - [ ] Setup webhooks (optional)

- [ ] Phase 7: Domain & SSL
  - [ ] Configure DNS
  - [ ] Install cert-manager
  - [ ] Setup Ingress
  - [ ] Verify HTTPS

- [ ] Phase 8: Production Hardening
  - [ ] Update all secrets
  - [ ] Configure resource limits
  - [ ] Enable network policies
  - [ ] Setup backups
  - [ ] Enable pod security

---

## 🎉 Congratulations!

You've successfully deployed ExploreSG to Digital Ocean Kubernetes!

### What's Next?

1. **Monitor your application** using Grafana dashboards
2. **Practice GitOps workflow** by making changes via Git
3. **Setup CI/CD pipelines** with GitHub Actions
4. **Optimize costs** using tips from this guide
5. **Add more features** to your application

### Share Your Success

- Add deployment badge to README
- Share on LinkedIn/Twitter
- Document your learnings
- Help others with deployment

---

<div align="center">

**Built with ❤️ for ExploreSG**

[Main README](../README.md) | [Local Setup](./SETUP.md) | [Operations Guide](./OPERATIONS.md)

</div>
