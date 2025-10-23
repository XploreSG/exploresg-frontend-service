# 🚀 Payment Service - Quick Deploy Reference

## ⚡ Deployment Commands (Copy & Paste)

### Step 1: Deploy RabbitMQ (FIRST!)
```bash
kubectl apply -f argocd/applications/rabbitmq.yaml
argocd app sync exploresg-rabbitmq
kubectl wait --for=condition=ready pod -l app=exploresg-rabbitmq -n exploresg --timeout=300s
```

### Step 2: Deploy Payment Database
```bash
kubectl apply -f argocd/applications/payment-db.yaml
argocd app sync exploresg-payment-db
kubectl wait --for=condition=ready pod -l app=exploresg-payment-db -n exploresg --timeout=180s
```

### Step 3: Deploy Payment Service
```bash
kubectl apply -f argocd/applications/payment-service.yaml
argocd app sync exploresg-payment-service
kubectl wait --for=condition=ready pod -l app=exploresg-payment-service -n exploresg --timeout=180s
```

---

## 🔍 Quick Verification

```bash
# Check all payment pods
kubectl get pods -n exploresg -l service=payment

# Check all payment components (including RabbitMQ)
kubectl get pods -n exploresg | grep -E "payment|rabbitmq"

# Test health endpoint
kubectl port-forward -n exploresg svc/exploresg-payment-service 8080:8080 &
curl http://localhost:8080/actuator/health
```

---

## 🌐 Public API Test

```bash
# Test public endpoint
curl https://api.xplore.town/payment/actuator/health

# Open Swagger UI
open https://api.xplore.town/payment/swagger-ui.html
```

---

## 📊 Monitor Logs

```bash
# Payment service logs
kubectl logs -n exploresg -l app=exploresg-payment-service -f --tail=50

# RabbitMQ logs
kubectl logs -n exploresg -l app=exploresg-rabbitmq -f --tail=50

# Database logs
kubectl logs -n exploresg -l app=exploresg-payment-db -f --tail=50
```

---

## 🔄 Rollback (If Needed)

```bash
argocd app rollback exploresg-payment-service
# OR
kubectl rollout undo deployment/exploresg-payment-service -n exploresg
```

---

## 🐰 RabbitMQ Management UI

```bash
kubectl port-forward -n exploresg svc/exploresg-rabbitmq-service 15672:15672
# Open: http://localhost:15672
# User: exploresguser / exploresgpass
```

---

## ✅ Success Indicators

- ✅ All pods show `1/1 Running`
- ✅ `curl https://api.xplore.town/payment/actuator/health` returns `{"status":"UP"}`
- ✅ ArgoCD shows all apps as `Synced` and `Healthy`
- ✅ RabbitMQ shows payment-service connection

---

## 📞 Troubleshooting

**Pod CrashLoopBackOff?**
```bash
kubectl logs -n exploresg -l app=exploresg-payment-service --previous
```

**502 Bad Gateway?**
```bash
kubectl get endpoints -n exploresg exploresg-payment-service
# Should show pod IP, if empty → readiness probe failing
```

**Database connection issues?**
```bash
kubectl exec -n exploresg deployment/exploresg-payment-service -- nslookup exploresg-payment-db-service.exploresg.svc.cluster.local
```

---

**📖 Full Guide:** `docs/PAYMENT_DEPLOYMENT_CHECKLIST.md`
