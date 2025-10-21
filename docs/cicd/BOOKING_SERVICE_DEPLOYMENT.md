# 🎫 Booking Service - Deployment Summary

**Service:** ExploreSG Booking Service  
**URL:** https://api.xplore.town/booking  
**Status:** ✅ Ready for Deployment  
**Date:** October 18, 2025

---

## 📋 What Was Created

### Kubernetes Manifests

#### Booking Database (`k8s/exploresg-booking-db/`)
- ✅ `configmap.yaml` - Database name configuration
- ✅ `secret.yaml` - Database credentials
- ✅ `deployment.yaml` - PostgreSQL 15 deployment
- ✅ `pvc.yaml` - 10Gi persistent storage
- ✅ `service.yaml` - Internal ClusterIP service
- ✅ `README.md` - Documentation

#### Booking Service (`k8s/exploresg-booking-service/`)
- ✅ `configmap.yaml` - Application configuration
- ✅ `secret.yaml` - JWT secrets and DB credentials
- ✅ `deployment.yaml` - Spring Boot application deployment
- ✅ `service.yaml` - Internal ClusterIP service
- ✅ `servicemonitor.yaml` - Prometheus monitoring
- ✅ `ingress.yaml` - HTTPS ingress at api.xplore.town/booking
- ✅ `README.md` - Documentation

### ArgoCD Applications

- ✅ `argocd/applications/booking-db.yaml` - Database GitOps config
- ✅ `argocd/applications/booking-service.yaml` - Service GitOps config

### Environment Files

- ✅ `booking.env` - Environment variables for local development

---

## 🚀 Deployment Instructions

### Option 1: Deploy via ArgoCD (Recommended)

The root ArgoCD application will automatically detect and deploy the booking service since the new application files are in the `argocd/applications/` directory.

```bash
# Sync the root application to pick up new apps
kubectl get app exploresg-root -n argocd

# Or manually apply the booking apps
kubectl apply -f argocd/applications/booking-db.yaml
kubectl apply -f argocd/applications/booking-service.yaml
```

ArgoCD will automatically:
1. Deploy the booking database first
2. Wait for database to be ready
3. Deploy the booking service
4. Configure ingress for https://api.xplore.town/booking

### Option 2: Manual Deployment

```bash
# Deploy database
kubectl apply -f k8s/exploresg-booking-db/

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=exploresg-booking-db -n exploresg --timeout=300s

# Deploy service
kubectl apply -f k8s/exploresg-booking-service/

# Wait for service to be ready
kubectl wait --for=condition=ready pod -l app=exploresg-booking-service -n exploresg --timeout=300s
```

---

## 🔍 Verification Steps

### 1. Check Deployments
```bash
# Check all booking resources
kubectl get all -l service=booking -n exploresg

# Expected output:
# - deployment.apps/exploresg-booking-db
# - deployment.apps/exploresg-booking-service
# - pod/exploresg-booking-db-xxx
# - pod/exploresg-booking-service-xxx
# - service/exploresg-booking-db-service
# - service/exploresg-booking-service
```

### 2. Check Ingress
```bash
# Verify ingress is configured
kubectl get ingress exploresg-booking-ingress -n exploresg

# Should show:
# HOST: api.xplore.town
# PATH: /booking(/|$)(.*)
```

### 3. Test Health Endpoint
```bash
# Test from outside cluster
curl https://api.xplore.town/booking/actuator/health

# Expected response:
# {"status":"UP"}
```

### 4. Check Prometheus Monitoring
```bash
# Verify ServiceMonitor exists
kubectl get servicemonitor exploresg-booking-service -n exploresg

# Check if Prometheus is scraping
# Visit Prometheus UI and search for: booking
```

### 5. Check Logs
```bash
# Database logs
kubectl logs -l app=exploresg-booking-db -n exploresg

# Service logs
kubectl logs -l app=exploresg-booking-service -n exploresg -f
```

---

## 🌐 Access Points

| Endpoint | URL | Description |
|----------|-----|-------------|
| **API Base** | https://api.xplore.town/booking | Booking API endpoints |
| **Health Check** | https://api.xplore.town/booking/actuator/health | Service health status |
| **Swagger UI** | https://api.xplore.town/booking/swagger-ui.html | API documentation |
| **Metrics** | https://api.xplore.town/booking/actuator/prometheus | Prometheus metrics |

---

## ⚙️ Configuration Details

### Database Configuration
- **Service DNS:** `exploresg-booking-db-service.exploresg.svc.cluster.local:5432`
- **Database Name:** `exploresg-booking-service-db`
- **User:** `exploresguser`
- **Storage:** 10Gi Digital Ocean Block Storage
- **Image:** postgres:15

### Application Configuration
- **Image:** `sreerajrone/exploresg-booking-service:v1.0.0`
- **Replicas:** 1
- **Port:** 8080 (internal)
- **Health Probes:** Liveness (60s), Readiness (50s)

### Ingress Configuration
- **Host:** api.xplore.town
- **Path Pattern:** /booking(/|$)(.*)
- **Rewrite:** Strips /booking prefix before forwarding
- **SSL/TLS:** Enabled via Let's Encrypt (cert-manager)
- **CORS:** Enabled for xplore.town domains

### Monitoring
- **Prometheus:** Enabled via ServiceMonitor
- **Scrape Interval:** 30s
- **Metrics Path:** /actuator/prometheus

---

## 🔐 Security Features

✅ **SSL/TLS Encryption** - Automatic HTTPS via cert-manager  
✅ **Secret Management** - Kubernetes Secrets for credentials  
✅ **CORS Protection** - Restricted to xplore.town domains  
✅ **Network Isolation** - ClusterIP for database (internal only)  
✅ **Health Monitoring** - Kubernetes probes for auto-healing  

---

## 📊 Monitoring & Observability

### Prometheus Metrics
The booking service exposes metrics at `/actuator/prometheus` including:
- JVM metrics (heap, threads, GC)
- HTTP request metrics
- Database connection pool metrics
- Custom business metrics

### Grafana Dashboards
Suggested dashboards to create:
- Spring Boot Application Dashboard
- PostgreSQL Database Dashboard
- API Request Rate & Latency

### Logging
Logs are available via:
```bash
# Service logs
kubectl logs -l app=exploresg-booking-service -n exploresg -f

# Database logs
kubectl logs -l app=exploresg-booking-db -n exploresg -f
```

---

## 🔄 Scaling

### Horizontal Pod Autoscaling (HPA)
```bash
# Example: Scale based on CPU usage
kubectl autoscale deployment exploresg-booking-service \
  --cpu-percent=70 \
  --min=1 \
  --max=5 \
  -n exploresg
```

### Manual Scaling
```bash
# Scale to 3 replicas
kubectl scale deployment exploresg-booking-service --replicas=3 -n exploresg
```

---

## 🐛 Troubleshooting

### Service Not Accessible
```bash
# Check ingress
kubectl describe ingress exploresg-booking-ingress -n exploresg

# Check nginx ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

### Database Connection Issues
```bash
# Check if database pod is running
kubectl get pods -l app=exploresg-booking-db -n exploresg

# Test database connection from service pod
kubectl exec -it deployment/exploresg-booking-service -n exploresg -- \
  nc -zv exploresg-booking-db-service 5432
```

### Pod Crashes / CrashLoopBackOff
```bash
# Check pod events
kubectl describe pod -l app=exploresg-booking-service -n exploresg

# Check logs from crashed pod
kubectl logs -l app=exploresg-booking-service -n exploresg --previous
```

---

## 📝 Next Steps

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Add booking service deployment configuration"
   git push origin digitalocean
   ```

2. **Sync ArgoCD** (if using GitOps)
   - ArgoCD will automatically detect changes
   - Or manually sync via ArgoCD UI

3. **Monitor Deployment**
   - Watch pod status in ArgoCD UI
   - Check Grafana dashboards
   - Verify health endpoints

4. **Update Frontend**
   - Update frontend to use `https://api.xplore.town/booking` endpoints
   - Test booking functionality end-to-end

5. **Load Testing** (Optional)
   - Test API performance under load
   - Adjust resource limits if needed
   - Configure HPA based on results

---

## ✅ Deployment Checklist

- [x] Kubernetes manifests created for booking database
- [x] Kubernetes manifests created for booking service
- [x] ArgoCD applications configured
- [x] Ingress configured for api.xplore.town/booking
- [x] SSL/TLS enabled via cert-manager
- [x] Prometheus monitoring configured
- [x] CORS configured for xplore.town domains
- [x] Documentation created
- [ ] Docker image built and pushed to registry
- [ ] Git changes committed and pushed
- [ ] ArgoCD synced
- [ ] Deployment verified
- [ ] Health checks passing
- [ ] Frontend integration tested

---

## 🎉 Summary

The booking service is now fully configured and ready for deployment! It follows the same pattern as the payment service:

- **Database:** PostgreSQL 15 with persistent storage
- **Service:** Spring Boot application with health checks
- **Access:** HTTPS via api.xplore.town/booking
- **Monitoring:** Prometheus + Grafana integration
- **GitOps:** ArgoCD for automated deployment

The service will be accessible at **https://api.xplore.town/booking** once deployed! 🚀
