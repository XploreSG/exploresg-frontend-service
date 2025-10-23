# 🎫 Booking Service - Quick Reference

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| API Endpoints | https://api.xplore.town/booking |
| Health Check | https://api.xplore.town/booking/actuator/health |
| Swagger Docs | https://api.xplore.town/booking/swagger-ui.html |
| Prometheus Metrics | https://api.xplore.town/booking/actuator/prometheus |

## 🚀 Quick Deploy

```bash
# Deploy via ArgoCD (recommended)
kubectl apply -f argocd/applications/booking-db.yaml
kubectl apply -f argocd/applications/booking-service.yaml

# Or deploy manually
kubectl apply -f k8s/exploresg-booking-db/
kubectl apply -f k8s/exploresg-booking-service/
```

## 🔍 Quick Check

```bash
# Check status
kubectl get all -l service=booking -n exploresg

# Check ingress
kubectl get ingress exploresg-booking-ingress -n exploresg

# Check logs
kubectl logs -l app=exploresg-booking-service -n exploresg -f

# Test endpoint
curl https://api.xplore.town/booking/actuator/health
```

## 📦 Resources Created

### Kubernetes
- k8s/exploresg-booking-db/ (5 files)
- k8s/exploresg-booking-service/ (6 files)

### ArgoCD
- argocd/applications/booking-db.yaml
- argocd/applications/booking-service.yaml

### Environment
- booking.env

## 🔧 Configuration

**Database:**
- Service: `exploresg-booking-db-service.exploresg.svc.cluster.local:5432`
- Database: `exploresg-booking-service-db`
- Storage: 10Gi (do-block-storage)

**Service:**
- Image: `sreerajrone/exploresg-booking-service:v1.0.0`
- Port: 8080
- Replicas: 1

**Ingress:**
- Host: api.xplore.town
- Path: /booking(/|$)(.*)
- SSL: Enabled (Let's Encrypt)

## ✅ Deployment Pattern

Same as payment service:
1. PostgreSQL database with persistent storage
2. Spring Boot service with health probes
3. ClusterIP services (internal)
4. Ingress for external HTTPS access
5. ServiceMonitor for Prometheus
6. ArgoCD GitOps deployment

## 📝 Documentation

Full details: [BOOKING_SERVICE_DEPLOYMENT.md](./BOOKING_SERVICE_DEPLOYMENT.md)
