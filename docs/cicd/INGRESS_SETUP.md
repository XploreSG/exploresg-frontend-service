# 🌐 Ingress Setup Guide for ExploreSG

**Simple Path-Based Routing**  
**Last Updated:** October 14, 2025

---

## 📌 Overview

This guide explains how to set up **NGINX Ingress Controller** for the ExploreSG application using **path-based routing**. No custom domains, no `/etc/hosts` modifications - just simple, straightforward access to your services.

---

## 🎯 What You Get

Access all services through the Minikube IP (or Load Balancer IP in production) using different paths:

| Service | Path | Description |
|---------|------|-------------|
| **Frontend** | `/` | React application (default) |
| **Auth Service** | `/auth` | Authentication API |
| **Fleet Service** | `/fleet` | Fleet management API |
| **Grafana** | `/grafana` | Monitoring dashboards |
| **Prometheus** | `/prometheus` | Metrics & queries |
| **ArgoCD** | `/argocd` | GitOps management |

---

## ⚙️ Minikube Setup

### Step 1: Enable Ingress

```bash
# Enable the ingress addon
minikube addons enable ingress

# Verify it's running
kubectl get pods -n ingress-nginx
```

Expected output:
```
NAME                                        READY   STATUS    
ingress-nginx-controller-xxx                1/1     Running
```

### Step 2: Deploy Ingress Resources

```bash
# Apply all ingress manifests
kubectl apply -f k8s/exploresg-frontend-service/ingress.yaml
kubectl apply -f k8s/exploresg-auth-service/ingress.yaml
kubectl apply -f k8s/exploresg-fleet-service/ingress.yaml
kubectl apply -f k8s/monitoring/ingress.yaml
kubectl apply -f k8s/argocd/ingress.yaml

# Verify ingress resources
kubectl get ingress --all-namespaces
```

### Step 3: Get Your Access URL

```bash
# Get Minikube IP
minikube ip
# Example output: 192.168.49.2
```

### Step 4: Access Your Services

Once ingress is deployed, access services at:

```bash
# Frontend (root path)
http://192.168.49.2/

# Auth Service
http://192.168.49.2/auth/actuator/health

# Fleet Service
http://192.168.49.2/fleet/actuator/health

# Grafana
http://192.168.49.2/grafana

# Prometheus
http://192.168.49.2/prometheus

# ArgoCD
http://192.168.49.2/argocd
```

**Tip:** Replace `192.168.49.2` with your actual Minikube IP from Step 3.

---

## 🧪 Testing

### Test Frontend
```bash
MINIKUBE_IP=$(minikube ip)
curl -I http://$MINIKUBE_IP/
```

### Test Auth Service
```bash
MINIKUBE_IP=$(minikube ip)
curl http://$MINIKUBE_IP/auth/actuator/health
```

### Test Fleet Service
```bash
MINIKUBE_IP=$(minikube ip)
curl http://$MINIKUBE_IP/fleet/actuator/health
```

### Open in Browser
```bash
# Linux
xdg-open http://$(minikube ip)/

# Or just copy-paste in your browser
# http://192.168.49.2/
```

---

## 🔍 How Path-Based Routing Works

**How it works:**
1. Request comes to `http://192.168.49.2/auth/login`
2. NGINX Ingress Controller receives the request
3. Ingress reads the path (`/auth/...`)
4. Routes to `exploresg-auth-service` on port 8080
5. Path is rewritten from `/auth/login` → `/login` 
6. Service responds

**Path mapping:**
- `/` → Frontend (Port 3000)
- `/auth/*` → Auth Service (Port 8080)
- `/fleet/*` → Fleet Service (Port 8080)
- `/grafana/*` → Grafana (Port 80)
- `/prometheus/*` → Prometheus (Port 9090)
- `/argocd/*` → ArgoCD (Port 443)

---

## ☁️ Production Setup (Digital Ocean / Cloud)

### Prerequisites
- Kubernetes cluster running
- `kubectl` configured to access cluster
- Domain name (optional, configure later)

### Step 1: Install NGINX Ingress

```bash
# Add Helm repo
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX Ingress Controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### Step 2: Get Load Balancer IP

```bash
# Wait for external IP to be assigned
kubectl get svc -n ingress-nginx ingress-nginx-controller -w

# Copy the EXTERNAL-IP value
# Example: 147.182.123.45
```

### Step 3: Deploy Ingress Resources

```bash
# Apply all ingress manifests (same as Minikube!)
kubectl apply -f k8s/exploresg-frontend-service/ingress.yaml
kubectl apply -f k8s/exploresg-auth-service/ingress.yaml
kubectl apply -f k8s/exploresg-fleet-service/ingress.yaml
kubectl apply -f k8s/monitoring/ingress.yaml
kubectl apply -f k8s/argocd/ingress.yaml
```

### Step 4: Access Services

Access using the Load Balancer IP:

```bash
# Example: If your LoadBalancer IP is 147.182.123.45

http://147.182.123.45/              # Frontend
http://147.182.123.45/auth          # Auth Service  
http://147.182.123.45/fleet         # Fleet Service
http://147.182.123.45/grafana       # Grafana
http://147.182.123.45/prometheus    # Prometheus
http://147.182.123.45/argocd        # ArgoCD
```

### Step 5: Configure DNS (Later)

When you're ready to add a custom domain:

1. **Add DNS A Record:**
   ```
   Type: A
   Name: @
   Value: <your-load-balancer-ip>
   ```

2. **Update Ingress (if needed):**
   - Add `host:` field to ingress rules
   - Configure TLS/SSL certificates

---

## 📊 Check Ingress Status

```bash
# View all ingress resources
kubectl get ingress --all-namespaces

# Describe specific ingress
kubectl describe ingress exploresg-frontend-ingress -n exploresg

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx -f
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused"

**Check 1: Is Minikube running?**
```bash
minikube status
# If not running:
minikube start
```

**Check 2: Is Ingress controller running?**
```bash
kubectl get pods -n ingress-nginx
# Should show: ingress-nginx-controller-xxx   Running
```

**Check 3: Are ingress resources created?**
```bash
kubectl get ingress -n exploresg
kubectl get ingress -n monitoring
kubectl get ingress -n argocd
```

### Issue: "404 Not Found"

**Check if services are running:**
```bash
kubectl get svc -n exploresg
kubectl get svc -n monitoring
kubectl get svc -n argocd
```

**Check ingress rules:**
```bash
kubectl describe ingress exploresg-frontend-ingress -n exploresg
```

### Issue: Path not routing correctly

**Check the rewrite annotations:**
```bash
kubectl get ingress exploresg-auth-ingress -n exploresg -o yaml
# Should have: nginx.ingress.kubernetes.io/rewrite-target annotation
```

---

## 🎨 Update Application Configuration

### Frontend API URLs

Update your frontend to use the path-based URLs:

**Before (with port-forward):**
```javascript
const AUTH_API = "http://localhost:8080"
const FLEET_API = "http://localhost:8081"
```

**After (path-based routing):**
```javascript
// Use relative paths or construct based on window.location
const BASE_URL = window.location.origin
const AUTH_API = `${BASE_URL}/auth`
const FLEET_API = `${BASE_URL}/fleet`
```

### Backend CORS Configuration

Ensure your backend services allow requests from the frontend:

```yaml
# In your Spring Boot application.properties
spring.web.cors.allowed-origins=http://192.168.49.2,http://localhost:3000
```

---

## ✅ Benefits of This Approach

| Aspect | Benefit |
|--------|---------|
| **No DNS Configuration** | Works immediately with IP address |
| **Simple** | No /etc/hosts file modifications needed |
| **Production-Ready** | Same config works locally and in cloud |
| **Easy Sharing** | Just share the IP address |
| **DNS-Ready** | Easy to add custom domain later |

---

## 🚀 Next Steps

1. ✅ **Verify ingress is working** (see Testing section above)
2. ✅ **Test all service paths** 
3. ⚠️ **Update frontend API URLs** to use path-based routing
4. ⚠️ **Update CORS settings** in backend services
5. 📝 **Optional:** Add custom domain when moving to production
6. 📝 **Optional:** Set up TLS/HTTPS certificates

---

## 📋 Quick Reference

### All Service Paths
```bash
# Save your Minikube/LoadBalancer IP
export BASE_URL="http://192.168.49.2"  # Change to your IP

# Then access:
$BASE_URL/                    # Frontend
$BASE_URL/auth                # Auth Service
$BASE_URL/fleet               # Fleet Service  
$BASE_URL/grafana             # Grafana
$BASE_URL/prometheus          # Prometheus
$BASE_URL/argocd              # ArgoCD
```

### Common Commands
```bash
# Check all ingresses
kubectl get ingress -A

# Test with curl
curl -I http://$(minikube ip)/

# Restart ingress controller
kubectl rollout restart deployment -n ingress-nginx ingress-nginx-controller

# View ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=50
```

---

## 📚 Resources

- **Kubernetes Ingress Docs:** https://kubernetes.io/docs/concepts/services-networking/ingress/
- **NGINX Ingress Controller:** https://kubernetes.github.io/ingress-nginx/
- **Path-Based Routing:** https://kubernetes.github.io/ingress-nginx/examples/rewrite/

---

**Questions?** Check the troubleshooting section above or refer to other documentation in the `docs/` folder.
