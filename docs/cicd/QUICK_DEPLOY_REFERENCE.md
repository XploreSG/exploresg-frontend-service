# 🚀 ExploreSG Platform - Quick Deploy Reference

## ⚡ One-Command Deployment

### Deploy Everything (ArgoCD App-of-Apps)
```bash
kubectl apply -f argocd/applications/root-app.yaml
argocd app sync -l app.kubernetes.io/instance=root-app
```

### Watch All Pods Start
```bash
watch kubectl get pods -n exploresg
```

---

## 📝 Pre-Flight Check

```bash
# Validate all services (183 checks)
./scripts/validate-all-services.sh --summary

# Expected: 100% success rate
```

---

## 🎯 Deployment Order (if deploying manually)

```bash
# 1. Infrastructure (FIRST!)
kubectl apply -f argocd/applications/rabbitmq.yaml && argocd app sync exploresg-rabbitmq

# 2. Databases (parallel)
kubectl apply -f argocd/applications/{auth,fleet,booking,payment}-db.yaml
argocd app sync exploresg-{auth,fleet,booking,payment}-db

# 3. Backend Services (parallel, after databases ready)
kubectl apply -f argocd/applications/{auth,fleet,booking,payment}-service.yaml
argocd app sync exploresg-{auth,fleet,booking,payment}-service

# 4. Frontend (parallel, after backends ready)
kubectl apply -f argocd/applications/{frontend,dev-portal}.yaml
argocd app sync exploresg-{frontend-service,dev-portal}
```

---

## 🔍 Quick Verification

```bash
# All pods running
kubectl get pods -n exploresg

# All services healthy
argocd app list | grep exploresg

# Test public endpoints
curl https://api.xplore.town/auth/actuator/health
curl https://api.xplore.town/fleet/actuator/health
curl https://api.xplore.town/booking/actuator/health
curl https://api.xplore.town/payment/actuator/health
curl https://xplore.town
curl https://tools.xplore.town
```

---

## 🐛 Quick Troubleshooting

### Check pod status
```bash
kubectl get pods -n exploresg | grep -v Running
```

### Check recent logs
```bash
kubectl logs -n exploresg -l tier=backend --tail=20 --max-log-requests=10
```

### Check ArgoCD sync status
```bash
argocd app list | grep -v Synced
```

### Restart a service
```bash
kubectl rollout restart deployment/<service-name> -n exploresg
```

---

## 🔄 Quick Rollback

```bash
# Single service
argocd app rollback <app-name>

# Or using kubectl
kubectl rollout undo deployment/<deployment-name> -n exploresg
```

---

## 📊 Service Status Dashboard

```bash
# Custom one-liner status check
echo "=== Service Status ===" && \
kubectl get pods -n exploresg -o custom-columns=\
NAME:.metadata.name,\
STATUS:.status.phase,\
RESTARTS:.status.containerStatuses[0].restartCount,\
READY:.status.containerStatuses[0].ready
```

---

## 🎯 Services Quick Reference

| Service | Type | URL | Health Check |
|---------|------|-----|--------------|
| RabbitMQ | Infrastructure | - | `kubectl get pods -n exploresg -l app=exploresg-rabbitmq` |
| Auth | Backend | api.xplore.town/auth | `curl https://api.xplore.town/auth/actuator/health` |
| Fleet | Backend | api.xplore.town/fleet | `curl https://api.xplore.town/fleet/actuator/health` |
| Booking | Backend | api.xplore.town/booking | `curl https://api.xplore.town/booking/actuator/health` |
| Payment | Backend | api.xplore.town/payment | `curl https://api.xplore.town/payment/actuator/health` |
| Frontend | Web App | xplore.town | `curl https://xplore.town` |
| Dev Portal | Tools | tools.xplore.town | `curl https://tools.xplore.town` |

---

## 📚 Full Documentation

- **Complete Guide:** `docs/COMPLETE_DEPLOYMENT_GUIDE.md`
- **Validation:** `./scripts/validate-all-services.sh --help`
- **Payment Setup:** `docs/PAYMENT_DEPLOYMENT_CHECKLIST.md`
- **Architecture:** `docs/ARCHITECTURE_DIAGRAM.md`

---

## 🆘 Emergency Commands

```bash
# Delete and redeploy everything
kubectl delete -f argocd/applications/
kubectl apply -f argocd/applications/
argocd app sync -l app.kubernetes.io/instance=root-app

# Check cluster resources
kubectl top nodes
kubectl top pods -n exploresg

# Get all events (last 10 minutes)
kubectl get events -n exploresg --sort-by='.lastTimestamp' | tail -20
```

---

**Quick Access:**
- Validation: `./scripts/validate-all-services.sh --summary`
- Deploy: `kubectl apply -f argocd/applications/root-app.yaml`
- Status: `kubectl get pods -n exploresg && argocd app list`

**Total Services:** 11 (1 infrastructure + 4 databases + 4 backends + 2 frontends)
