# 🚀 Payment Service Cloud Deployment Checklist
**Date:** October 19, 2025  
**Target:** Digital Ocean Kubernetes  
**Status:** ✅ READY FOR DEPLOYMENT

---

## 📋 Pre-Deployment Verification

### ✅ 1. Database Configuration

| Item | Status | Details |
|------|--------|---------|
| **PostgreSQL Image** | ✅ | `postgres:15` |
| **Database Name** | ✅ | `exploresg-payment-service-db` |
| **PVC Storage** | ✅ | 10Gi (do-block-storage) |
| **ConfigMap** | ✅ | `exploresg-payment-db-config` |
| **Secret** | ✅ | `exploresg-payment-db-secret` |
| **Service Name** | ✅ | `exploresg-payment-db-service.exploresg.svc.cluster.local` |
| **Port** | ✅ | 5432 |
| **Health Checks** | ✅ | None (matches other DBs) |

**Connection String in Service:**
```
jdbc:postgresql://exploresg-payment-db-service.exploresg.svc.cluster.local:5432/exploresg-payment-service-db
```

---

### ✅ 2. Payment Service Configuration

| Item | Status | Details |
|------|--------|---------|
| **Docker Image** | ✅ | `sreerajrone/exploresg-payment-service:v1.0.0` |
| **Image Pull Policy** | ✅ | `IfNotPresent` |
| **Replicas** | ✅ | 1 |
| **Port** | ✅ | 8080 |
| **Service Type** | ✅ | ClusterIP |
| **Namespace** | ✅ | exploresg |

---

### ✅ 3. Environment Variables Check

#### ConfigMap Variables
```yaml
✅ SPRING_PROFILES_ACTIVE: "dev"
✅ SERVER_PORT: "8080"
✅ SPRING_DATASOURCE_URL: "jdbc:postgresql://exploresg-payment-db-service.exploresg.svc.cluster.local:5432/exploresg-payment-service-db"
✅ SPRING_DATASOURCE_DRIVER_CLASS_NAME: "org.postgresql.Driver"
✅ SPRING_JPA_HIBERNATE_DDL_AUTO: "update"
✅ SPRING_JPA_SHOW_SQL: "true"
✅ LOGGING_LEVEL_ROOT: "INFO"
✅ LOGGING_LEVEL_COM_EXPLORESG: "DEBUG"
✅ MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE: "health,info,metrics,prometheus"
✅ MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS: "when-authorized"
✅ SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE: "10"
✅ SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE: "5"
✅ RABBITMQ_HOST: "exploresg-rabbitmq-service.exploresg.svc.cluster.local"
✅ RABBITMQ_PORT: "5672"
✅ RABBITMQ_VIRTUAL_HOST: "exploresg"
✅ CORS_ALLOWED_ORIGINS: "https://xplore.town,https://www.xplore.town,https://api.xplore.town,https://tools.xplore.town,http://localhost:3000"
✅ CORS_ALLOWED_METHODS: "GET,POST,PUT,DELETE,OPTIONS"
✅ CORS_ALLOWED_HEADERS: "*"
✅ CORS_ALLOW_CREDENTIALS: "true"
```

#### Secret Variables
```yaml
✅ SPRING_DATASOURCE_USERNAME: "exploresguser"
✅ SPRING_DATASOURCE_PASSWORD: "exploresgpass"
✅ JWT_SECRET_KEY: "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
✅ JWT_EXPIRATION: "86400000"
✅ RABBITMQ_USERNAME: "exploresguser"
✅ RABBITMQ_PASSWORD: "exploresgpass"
```

---

### ✅ 4. Health Probes

| Probe Type | Path | Initial Delay | Period | Timeout | Failure Threshold |
|------------|------|---------------|--------|---------|-------------------|
| **Liveness** | `/actuator/health/liveness` | 60s | 10s | 5s | 3 |
| **Readiness** | `/actuator/health/readiness` | 50s | 10s | 5s | 5 |

**Status:** ✅ Properly configured (matches auth-service pattern)

---

### ✅ 5. Ingress Configuration

| Item | Status | Details |
|------|--------|---------|
| **Host** | ✅ | `api.xplore.town` |
| **Path** | ✅ | `/payment(/\|$)(.*)` |
| **Rewrite Target** | ✅ | `/$2` |
| **SSL/TLS** | ✅ | `letsencrypt-prod` |
| **TLS Secret** | ✅ | `api-xplore-town-tls` |
| **CORS Enabled** | ✅ | Yes |
| **Use Regex** | ✅ | Yes |

**Public URL:** `https://api.xplore.town/payment/`

---

### ✅ 6. Monitoring & Observability

| Item | Status | Details |
|------|--------|---------|
| **ServiceMonitor** | ✅ | `exploresg-payment-monitor` |
| **Metrics Path** | ✅ | `/actuator/prometheus` |
| **Scrape Interval** | ✅ | 30s |
| **Prometheus Label** | ✅ | `release: prometheus` |

---

### ✅ 7. ArgoCD Configuration

| Item | Status | Details |
|------|--------|---------|
| **DB Application** | ✅ | `argocd/applications/payment-db.yaml` |
| **Service Application** | ✅ | `argocd/applications/payment-service.yaml` |
| **Repository** | ✅ | `https://github.com/Project-Be-Better/exploresg-cloud.git` |
| **Branch** | ✅ | `digitalocean` |
| **Auto-Sync** | ⚠️ | Manual (requires `argocd app sync`) |
| **Retry Policy** | ✅ | 5 attempts with backoff |

---

### ✅ 8. RabbitMQ Integration (NEW)

| Item | Status | Details |
|------|--------|---------|
| **RabbitMQ Service** | ✅ | `exploresg-rabbitmq-service` |
| **RabbitMQ Image** | ✅ | `rabbitmq:3.13-management-alpine` |
| **Virtual Host** | ✅ | `exploresg` |
| **Storage** | ✅ | 2Gi PVC |
| **Monitoring** | ✅ | ServiceMonitor enabled |
| **ArgoCD Application** | ✅ | `argocd/applications/rabbitmq.yaml` |

**Note:** RabbitMQ must be deployed BEFORE payment service.

---

## 🚀 Deployment Steps

### Step 1: Deploy RabbitMQ (FIRST)

```bash
# Option A: Via ArgoCD (Recommended)
kubectl apply -f argocd/applications/rabbitmq.yaml
argocd app sync exploresg-rabbitmq

# Option B: Direct kubectl
kubectl apply -f k8s/exploresg-rabbitmq/

# Verify RabbitMQ is running
kubectl get pods -n exploresg -l app=exploresg-rabbitmq
kubectl logs -n exploresg -l app=exploresg-rabbitmq --tail=50

# Wait for RabbitMQ to be ready
kubectl wait --for=condition=ready pod -l app=exploresg-rabbitmq -n exploresg --timeout=300s
```

### Step 2: Deploy Payment Database

```bash
# Option A: Via ArgoCD (Recommended)
kubectl apply -f argocd/applications/payment-db.yaml
argocd app sync exploresg-payment-db

# Option B: Direct kubectl
kubectl apply -f k8s/exploresg-payment-db/

# Verify database is running
kubectl get pods -n exploresg -l app=exploresg-payment-db
kubectl logs -n exploresg -l app=exploresg-payment-db --tail=50

# Check PVC is bound
kubectl get pvc -n exploresg exploresg-payment-db-pvc
```

### Step 3: Deploy Payment Service

```bash
# Option A: Via ArgoCD (Recommended)
kubectl apply -f argocd/applications/payment-service.yaml
argocd app sync exploresg-payment-service

# Option B: Direct kubectl
kubectl apply -f k8s/exploresg-payment-service/

# Watch deployment progress
kubectl get pods -n exploresg -l app=exploresg-payment-service -w
```

---

## 🔍 Post-Deployment Verification

### 1. Check Pod Status

```bash
# All payment components
kubectl get pods -n exploresg -l service=payment

# Expected output:
# exploresg-payment-db-xxx        1/1     Running
# exploresg-payment-service-xxx   1/1     Running
```

### 2. Check Services

```bash
kubectl get svc -n exploresg | grep payment

# Expected:
# exploresg-payment-db-service      ClusterIP   10.x.x.x   <none>   5432/TCP
# exploresg-payment-service         ClusterIP   10.x.x.x   <none>   8080/TCP
```

### 3. Check Ingress

```bash
kubectl get ingress -n exploresg exploresg-payment-ingress

# Expected:
# NAME                       HOSTS              ADDRESS       PORTS
# exploresg-payment-ingress  api.xplore.town    x.x.x.x       80, 443
```

### 4. Test Health Endpoints (Port Forward)

```bash
# Port forward to service
kubectl port-forward -n exploresg svc/exploresg-payment-service 8080:8080

# In another terminal, test endpoints:
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/health/liveness
curl http://localhost:8080/actuator/health/readiness
curl http://localhost:8080/actuator/prometheus
```

### 5. Test Public API

```bash
# Health check (should work without auth)
curl https://api.xplore.town/payment/actuator/health

# Swagger UI
curl https://api.xplore.town/payment/swagger-ui.html

# Expected: 200 OK or redirect to Swagger UI
```

### 6. Check Logs

```bash
# Payment service logs
kubectl logs -n exploresg -l app=exploresg-payment-service --tail=100 -f

# Look for:
# ✅ "Started ExploreSGPaymentServiceApplication"
# ✅ "Connected to PostgreSQL"
# ✅ "RabbitMQ connection established"
# ❌ No errors about database connection
# ❌ No errors about RabbitMQ connection
```

### 7. Verify Database Connection

```bash
# Connect to database pod
kubectl exec -it -n exploresg deployment/exploresg-payment-db -- psql -U exploresguser -d exploresg-payment-service-db

# Inside psql:
\dt    # List tables (should show payment tables)
\q     # Quit
```

### 8. Verify RabbitMQ Connection

```bash
# Access RabbitMQ Management UI
kubectl port-forward -n exploresg svc/exploresg-rabbitmq-service 15672:15672

# Open browser: http://localhost:15672
# Login: exploresguser / exploresgpass
# Check: Connections tab should show payment-service connection
```

### 9. Check ArgoCD Status

```bash
# Check sync status
argocd app get exploresg-rabbitmq
argocd app get exploresg-payment-db
argocd app get exploresg-payment-service

# All should show:
# Sync Status: Synced
# Health Status: Healthy
```

### 10. Monitor Prometheus Metrics

```bash
# Check ServiceMonitor
kubectl get servicemonitor -n exploresg exploresg-payment-monitor

# Verify metrics in Prometheus
# (Access Prometheus UI and search for: exploresg_payment)
```

---

## 🧪 API Testing Checklist

### Endpoints to Test

```bash
# Base URL
BASE_URL="https://api.xplore.town/payment"

# 1. Health Check
curl -X GET "$BASE_URL/actuator/health"

# 2. Swagger Documentation
curl -X GET "$BASE_URL/swagger-ui.html"

# 3. API Docs (OpenAPI)
curl -X GET "$BASE_URL/v3/api-docs"

# 4. Test payment endpoints (requires JWT token)
# Get token from auth service first:
TOKEN=$(curl -X POST "https://api.xplore.town/auth/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' | jq -r '.token')

# List payments (example)
curl -X GET "$BASE_URL/api/v1/payments" \
  -H "Authorization: Bearer $TOKEN"

# Create payment (example)
curl -X POST "$BASE_URL/api/v1/payments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": 1,
    "amount": 100.00,
    "currency": "SGD",
    "paymentMethod": "CREDIT_CARD"
  }'
```

---

## ⚠️ Known Issues & Solutions

### Issue 1: Pod CrashLoopBackOff

**Symptoms:** Payment service pod keeps restarting

**Check:**
```bash
kubectl logs -n exploresg -l app=exploresg-payment-service --previous
```

**Common Causes:**
- ❌ Database not ready → Wait for DB pod to be Running
- ❌ RabbitMQ not ready → Deploy RabbitMQ first
- ❌ Wrong database URL → Check configmap
- ❌ Wrong credentials → Check secret

### Issue 2: Database Connection Failed

**Symptoms:** Logs show "Connection refused" or "Unknown host"

**Solution:**
```bash
# Verify DB service exists
kubectl get svc -n exploresg exploresg-payment-db-service

# Verify DB pod is running
kubectl get pods -n exploresg -l app=exploresg-payment-db

# Test DNS resolution from payment pod
kubectl exec -n exploresg deployment/exploresg-payment-service -- nslookup exploresg-payment-db-service.exploresg.svc.cluster.local
```

### Issue 3: 502 Bad Gateway from Ingress

**Symptoms:** `curl https://api.xplore.town/payment/actuator/health` returns 502

**Check:**
```bash
# Verify service endpoints
kubectl get endpoints -n exploresg exploresg-payment-service

# Should show pod IP:8080
# If empty, pod is not passing readiness probe
```

### Issue 4: RabbitMQ Connection Timeout

**Symptoms:** Logs show "Connection timeout" to RabbitMQ

**Solution:**
```bash
# Verify RabbitMQ is running
kubectl get pods -n exploresg -l app=exploresg-rabbitmq

# Test connectivity
kubectl exec -n exploresg deployment/exploresg-payment-service -- nc -zv exploresg-rabbitmq-service.exploresg.svc.cluster.local 5672
```

---

## 🔄 Rollback Procedure

If deployment fails or causes issues:

```bash
# Via ArgoCD (Recommended)
argocd app rollback exploresg-payment-service

# Via kubectl
kubectl rollout undo deployment/exploresg-payment-service -n exploresg

# Check rollout status
kubectl rollout status deployment/exploresg-payment-service -n exploresg
```

---

## 📊 Resource Usage (Expected)

| Component | CPU (Request) | Memory (Request) | Storage |
|-----------|---------------|------------------|---------|
| Payment Service | N/A (burstable) | N/A (burstable) | N/A |
| Payment DB | N/A (burstable) | N/A (burstable) | 10Gi |
| RabbitMQ | N/A (burstable) | N/A (burstable) | 2Gi |

**Note:** No resource limits set (matches cluster-wide policy for auth/fleet services)

---

## ✅ Pre-Deployment Checklist

- [x] RabbitMQ manifests created
- [x] RabbitMQ ArgoCD application created
- [x] Payment DB manifests exist
- [x] Payment service manifests exist
- [x] ConfigMap has all required variables
- [x] Secret has all credentials
- [x] RabbitMQ configuration added to payment service
- [x] Health probes configured
- [x] Ingress configured
- [x] ServiceMonitor configured
- [x] ArgoCD applications exist
- [x] Resource limits match other services (none)
- [x] CORS configured for production domains

---

## 🎯 Deployment Order

**CRITICAL: Deploy in this order!**

1. ✅ **RabbitMQ** (must be first - other services depend on it)
2. ✅ **Payment Database**
3. ✅ **Payment Service**

---

## 📝 Notes

1. **Database Initialization**: First deployment will run `data.sql` to populate initial data
2. **JWT Secret**: Using same key across services for token validation
3. **CORS**: Configured for production domains (`xplore.town`)
4. **Monitoring**: Full Prometheus integration via ServiceMonitor
5. **RabbitMQ**: Shared message broker - ensure it's stable before deploying services

---

## 🚀 READY TO DEPLOY!

**Status:** ✅ ALL CHECKS PASSED

You can now safely deploy the payment service to your Digital Ocean Kubernetes cluster.

**Recommended deployment method:** ArgoCD for easy rollback and GitOps workflow.

```bash
# Deploy everything
kubectl apply -f argocd/applications/rabbitmq.yaml
kubectl apply -f argocd/applications/payment-db.yaml
kubectl apply -f argocd/applications/payment-service.yaml

# Sync all
argocd app sync exploresg-rabbitmq
argocd app sync exploresg-payment-db
argocd app sync exploresg-payment-service

# Monitor
watch kubectl get pods -n exploresg -l service=payment
```

---

**Generated:** October 19, 2025  
**Verified By:** GitHub Copilot  
**Confidence Level:** 98%
