# 🚀 ExploreSG Platform - Complete Deployment Guide

**Last Updated:** October 19, 2025  
**Target:** Digital Ocean Kubernetes  
**Status:** ✅ ALL SERVICES VALIDATED (183/183 checks passed)

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [Pre-Deployment Validation](#pre-deployment-validation)
3. [Deployment Order](#deployment-order)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedures](#rollback-procedures)

---

## 🏗️ Platform Overview

### Services Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ExploreSG Platform                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Infrastructure Layer                    │  │
│  │  • RabbitMQ Message Broker                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Database Layer                          │  │
│  │  • Auth DB    • Fleet DB                            │  │
│  │  • Booking DB • Payment DB                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Backend Services                        │  │
│  │  • Auth Service    • Fleet Service                  │  │
│  │  • Booking Service • Payment Service                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Frontend Services                       │  │
│  │  • Main Application • Developer Portal              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Ingress & SSL                           │  │
│  │  • NGINX Ingress Controller                         │  │
│  │  • Let's Encrypt SSL Certificates                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Service Registry

| Service | Type | Port | Public URL | ArgoCD App |
|---------|------|------|------------|------------|
| **Infrastructure** |
| RabbitMQ | Messaging | 5672, 15672 | - | ✅ |
| **Databases** |
| Auth DB | PostgreSQL | 5432 | - | ✅ |
| Fleet DB | PostgreSQL | 5432 | - | ✅ |
| Booking DB | PostgreSQL | 5432 | - | ✅ |
| Payment DB | PostgreSQL | 5432 | - | ✅ |
| **Backend APIs** |
| Auth Service | Spring Boot | 8080 | api.xplore.town/auth | ✅ |
| Fleet Service | Spring Boot | 8080 | api.xplore.town/fleet | ✅ |
| Booking Service | Spring Boot | 8080 | api.xplore.town/booking | ✅ |
| Payment Service | Spring Boot | 8080 | api.xplore.town/payment | ✅ |
| **Frontend** |
| Main App | React/Next.js | 3000 | xplore.town | ✅ |
| Dev Portal | Static/Nginx | 80 | tools.xplore.town | ✅ |

**Total:** 11 services, all managed by ArgoCD

---

## ✅ Pre-Deployment Validation

### Run Validation Script

```bash
# Full validation
./scripts/validate-all-services.sh

# Summary only
./scripts/validate-all-services.sh --summary

# Verbose output
./scripts/validate-all-services.sh --verbose
```

### Expected Output

```
✓ ALL CHECKS PASSED ✓
ExploreSG Platform is READY for deployment!

Services Validated:
  • Infrastructure:  1 (RabbitMQ)
  • Databases:       4 (Auth, Fleet, Booking, Payment)
  • Backend APIs:    4 (Auth, Fleet, Booking, Payment)
  • Frontend:        2 (Main App, Dev Portal)
  Total Services:    11

Check Results:
  Passed:    183
  Failed:    0
  Warnings:  8
  Success Rate: 100%
```

### Pre-Deployment Checklist

- [ ] Validation script shows 100% success
- [ ] Kubernetes cluster is accessible (`kubectl cluster-info`)
- [ ] ArgoCD is installed and accessible
- [ ] DNS records point to cluster IP
- [ ] SSL certificates will be auto-provisioned (cert-manager ready)
- [ ] Storage class `do-block-storage` is available
- [ ] Namespace `exploresg` exists or will be created

---

## 🎯 Deployment Order

**CRITICAL: Deploy services in this order to satisfy dependencies**

### Phase 1: Infrastructure (Required First)
```bash
1. RabbitMQ Message Broker
```
**Why first:** Backend services depend on RabbitMQ for messaging

### Phase 2: Databases (Can deploy in parallel)
```bash
2a. Auth Database
2b. Fleet Database
2c. Booking Database
2d. Payment Database
```
**Why second:** Backend services need databases to start

### Phase 3: Backend Services (Can deploy in parallel after databases)
```bash
3a. Auth Service (depends on: auth-db)
3b. Fleet Service (depends on: fleet-db, rabbitmq)
3c. Booking Service (depends on: booking-db, rabbitmq)
3d. Payment Service (depends on: payment-db, rabbitmq)
```
**Why third:** Frontend needs backend APIs

### Phase 4: Frontend Services (Can deploy in parallel after backends)
```bash
4a. Main Application (depends on: auth-service)
4b. Developer Portal (standalone)
```
**Why last:** Depends on backend services being available

---

## 🚀 Step-by-Step Deployment

### Method 1: ArgoCD (Recommended - GitOps)

#### Option A: Deploy Root Application (One Command)

```bash
# Deploy everything via ArgoCD App-of-Apps pattern
kubectl apply -f argocd/applications/root-app.yaml

# Wait for all apps to sync
argocd app sync -l app.kubernetes.io/instance=root-app
```

#### Option B: Deploy Services Individually

```bash
# Phase 1: Infrastructure
kubectl apply -f argocd/applications/rabbitmq.yaml
argocd app sync exploresg-rabbitmq
kubectl wait --for=condition=ready pod -l app=exploresg-rabbitmq -n exploresg --timeout=300s

# Phase 2: Databases (parallel)
kubectl apply -f argocd/applications/auth-db.yaml
kubectl apply -f argocd/applications/fleet-db.yaml
kubectl apply -f argocd/applications/booking-db.yaml
kubectl apply -f argocd/applications/payment-db.yaml

argocd app sync exploresg-auth-db
argocd app sync exploresg-fleet-db
argocd app sync exploresg-booking-db
argocd app sync exploresg-payment-db

# Wait for all databases
kubectl wait --for=condition=ready pod -l tier=database -n exploresg --timeout=300s

# Phase 3: Backend Services (parallel)
kubectl apply -f argocd/applications/auth-service.yaml
kubectl apply -f argocd/applications/fleet-service.yaml
kubectl apply -f argocd/applications/booking-service.yaml
kubectl apply -f argocd/applications/payment-service.yaml

argocd app sync exploresg-auth-service
argocd app sync exploresg-fleet-service
argocd app sync exploresg-booking-service
argocd app sync exploresg-payment-service

# Wait for all backends
kubectl wait --for=condition=ready pod -l tier=backend -n exploresg --timeout=300s

# Phase 4: Frontend Services (parallel)
kubectl apply -f argocd/applications/frontend-service.yaml
kubectl apply -f argocd/applications/dev-portal.yaml

argocd app sync exploresg-frontend-service
argocd app sync exploresg-dev-portal

# Wait for all frontends
kubectl wait --for=condition=ready pod -l tier=frontend -n exploresg --timeout=300s
```

### Method 2: Direct kubectl

```bash
# Use the deployment script
./scripts/deploy-k8s.sh

# Or manually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/exploresg-rabbitmq/
kubectl apply -f k8s/exploresg-auth-db/
kubectl apply -f k8s/exploresg-fleet-db/
kubectl apply -f k8s/exploresg-booking-db/
kubectl apply -f k8s/exploresg-payment-db/
# Wait for databases...
kubectl apply -f k8s/exploresg-auth-service/
kubectl apply -f k8s/exploresg-fleet-service/
kubectl apply -f k8s/exploresg-booking-service/
kubectl apply -f k8s/exploresg-payment-service/
# Wait for backends...
kubectl apply -f k8s/exploresg-frontend-service/
kubectl apply -f k8s/exploresg-dev-portal/
```

---

## 🔍 Verification & Testing

### 1. Check All Pods are Running

```bash
# All services
kubectl get pods -n exploresg

# By tier
kubectl get pods -n exploresg -l tier=messaging
kubectl get pods -n exploresg -l tier=database
kubectl get pods -n exploresg -l tier=backend
kubectl get pods -n exploresg -l tier=frontend

# Expected: All pods should show 1/1 or 2/2 Running
```

### 2. Check Services

```bash
kubectl get svc -n exploresg

# Expected: All services should have ClusterIP assigned
```

### 3. Check Ingress

```bash
kubectl get ingress -n exploresg

# Expected: All ingress should show hosts and IP addresses
```

### 4. Check ArgoCD Sync Status

```bash
argocd app list

# Expected: All apps should show "Synced" and "Healthy"
```

### 5. Test Public Endpoints

```bash
# Health checks (no auth required)
curl https://api.xplore.town/auth/actuator/health
curl https://api.xplore.town/fleet/actuator/health
curl https://api.xplore.town/booking/actuator/health
curl https://api.xplore.town/payment/actuator/health

# Frontend
curl https://xplore.town
curl https://tools.xplore.town

# Expected: All should return 200 OK
```

### 6. Test API Functionality

```bash
# Login to get JWT token
TOKEN=$(curl -X POST "https://api.xplore.town/auth/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' | jq -r '.token')

# Test authenticated endpoints
curl -H "Authorization: Bearer $TOKEN" https://api.xplore.town/fleet/api/v1/vehicles
curl -H "Authorization: Bearer $TOKEN" https://api.xplore.town/booking/api/v1/bookings
curl -H "Authorization: Bearer $TOKEN" https://api.xplore.town/payment/api/v1/payments
```

### 7. Check Logs

```bash
# Specific service
kubectl logs -n exploresg -l app=exploresg-auth-service --tail=50

# All backend services
kubectl logs -n exploresg -l tier=backend --tail=20 --max-log-requests=10

# Look for errors
kubectl logs -n exploresg --all-containers --tail=100 | grep -i error
```

### 8. Verify RabbitMQ Connections

```bash
# Port forward to RabbitMQ management UI
kubectl port-forward -n exploresg svc/exploresg-rabbitmq-service 15672:15672

# Open browser: http://localhost:15672
# Login: exploresguser / exploresgpass
# Check: Connections tab should show fleet, booking, payment services
```

### 9. Test Database Connections

```bash
# Connect to auth database
kubectl exec -it -n exploresg deployment/exploresg-auth-db -- \
  psql -U exploresguser -d exploresg-auth-service-db -c "\dt"

# Connect to payment database
kubectl exec -it -n exploresg deployment/exploresg-payment-db -- \
  psql -U exploresguser -d exploresg-payment-service-db -c "\dt"
```

### 10. Monitor Prometheus Metrics

```bash
# Check ServiceMonitors
kubectl get servicemonitor -n exploresg

# Access Grafana dashboards (if configured)
# Check metrics for all services
```

---

## 🐛 Troubleshooting

### Pod CrashLoopBackOff

**Symptoms:** Pod keeps restarting

**Diagnosis:**
```bash
kubectl describe pod <pod-name> -n exploresg
kubectl logs <pod-name> -n exploresg --previous
```

**Common Causes:**
- Database not ready → Check database pod status
- RabbitMQ not ready → Check RabbitMQ pod status
- Wrong configuration → Check configmap and secret
- Image pull error → Check image name and registry access

### Database Connection Failed

**Symptoms:** Backend service can't connect to database

**Diagnosis:**
```bash
# Check database pod
kubectl get pods -n exploresg -l app=exploresg-<service>-db

# Check database service
kubectl get svc -n exploresg | grep <service>-db

# Test DNS resolution
kubectl exec -n exploresg deployment/exploresg-<service>-service -- \
  nslookup exploresg-<service>-db-service.exploresg.svc.cluster.local

# Check database logs
kubectl logs -n exploresg -l app=exploresg-<service>-db --tail=100
```

**Solutions:**
- Wait for database to be fully ready (check readiness probe)
- Verify database service exists and has endpoints
- Check ConfigMap has correct database URL
- Verify Secret has correct credentials

### 502 Bad Gateway from Ingress

**Symptoms:** Public URL returns 502 error

**Diagnosis:**
```bash
# Check service endpoints
kubectl get endpoints -n exploresg <service-name>

# Check ingress configuration
kubectl describe ingress -n exploresg <ingress-name>

# Check pod readiness
kubectl get pods -n exploresg -l app=<service-name>
```

**Solutions:**
- Pod not passing readiness probe → Check health endpoint
- Service selector mismatch → Verify labels match
- Backend service not running → Check pod status
- Wrong service port → Verify service and deployment ports match

### RabbitMQ Connection Timeout

**Symptoms:** Backend service can't connect to RabbitMQ

**Diagnosis:**
```bash
# Check RabbitMQ pod
kubectl get pods -n exploresg -l app=exploresg-rabbitmq

# Check RabbitMQ service
kubectl get svc -n exploresg exploresg-rabbitmq-service

# Test connectivity from backend pod
kubectl exec -n exploresg deployment/exploresg-<service>-service -- \
  nc -zv exploresg-rabbitmq-service.exploresg.svc.cluster.local 5672
```

**Solutions:**
- Deploy RabbitMQ first before backend services
- Wait for RabbitMQ to be fully ready
- Verify ConfigMap has correct RabbitMQ host
- Check Secret has correct RabbitMQ credentials

### ArgoCD Application OutOfSync

**Symptoms:** ArgoCD shows "OutOfSync" status

**Diagnosis:**
```bash
argocd app get <app-name>
argocd app diff <app-name>
```

**Solutions:**
```bash
# Sync the application
argocd app sync <app-name>

# Sync with force if needed (caution: may cause downtime)
argocd app sync <app-name> --force
```

### SSL Certificate Not Issuing

**Symptoms:** HTTPS not working, certificate pending

**Diagnosis:**
```bash
# Check certificate status
kubectl get certificate -n exploresg

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager --tail=100

# Check certificate details
kubectl describe certificate <cert-name> -n exploresg
```

**Solutions:**
- Verify cert-manager is installed and running
- Check DNS records point to correct IP
- Verify Let's Encrypt rate limits not exceeded
- Check ingress annotations are correct

---

## 🔄 Rollback Procedures

### Rollback Single Service (ArgoCD)

```bash
# View history
argocd app history <app-name>

# Rollback to previous version
argocd app rollback <app-name>

# Rollback to specific revision
argocd app rollback <app-name> <revision-id>
```

### Rollback Single Service (kubectl)

```bash
# View rollout history
kubectl rollout history deployment/<deployment-name> -n exploresg

# Rollback to previous version
kubectl rollout undo deployment/<deployment-name> -n exploresg

# Rollback to specific revision
kubectl rollout undo deployment/<deployment-name> -n exploresg --to-revision=<revision>

# Check rollout status
kubectl rollout status deployment/<deployment-name> -n exploresg
```

### Rollback All Services

```bash
# Using ArgoCD
argocd app rollback -l app.kubernetes.io/instance=root-app

# Using kubectl (caution!)
for deployment in $(kubectl get deployments -n exploresg -o name); do
  kubectl rollout undo $deployment -n exploresg
done
```

### Emergency Rollback (Delete and Redeploy)

```bash
# Delete service
kubectl delete -f argocd/applications/<service>.yaml
kubectl delete -f k8s/exploresg-<service>/

# Wait for cleanup
kubectl wait --for=delete pod -l app=exploresg-<service> -n exploresg --timeout=120s

# Redeploy previous working version
git checkout <previous-commit>
kubectl apply -f argocd/applications/<service>.yaml
argocd app sync exploresg-<service>
```

---

## 📊 Monitoring & Observability

### Key Metrics to Monitor

1. **Pod Health**
   - All pods running: `kubectl get pods -n exploresg`
   - Restart count should be low

2. **Resource Usage**
   - CPU: `kubectl top pods -n exploresg`
   - Memory: `kubectl top pods -n exploresg`

3. **API Response Times**
   - Check via Prometheus/Grafana dashboards
   - Monitor p95, p99 latencies

4. **Error Rates**
   - HTTP 5xx errors
   - Application exceptions in logs

5. **Database Connections**
   - Connection pool usage
   - Query performance

6. **RabbitMQ Queue Depth**
   - Message backlog
   - Consumer lag

### Access Monitoring Tools

```bash
# Prometheus (if configured)
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Grafana (if configured)
kubectl port-forward -n monitoring svc/grafana 3000:3000

# RabbitMQ Management
kubectl port-forward -n exploresg svc/exploresg-rabbitmq-service 15672:15672
```

---

## 🎯 Success Criteria

Deployment is successful when:

- ✅ All 11 services show "Running" status
- ✅ All ArgoCD applications show "Synced" and "Healthy"
- ✅ All public URLs return 200 OK
- ✅ Health endpoints return `{"status":"UP"}`
- ✅ Can login and get JWT token
- ✅ Can access protected API endpoints with token
- ✅ RabbitMQ shows connections from all messaging services
- ✅ No error logs in any service
- ✅ SSL certificates issued and HTTPS working
- ✅ Prometheus metrics being scraped

---

## 📝 Post-Deployment Tasks

1. **Update DNS records** (if not already done)
   - `xplore.town` → Cluster IP
   - `api.xplore.town` → Cluster IP
   - `tools.xplore.town` → Cluster IP

2. **Configure monitoring alerts**
   - Set up PagerDuty/Slack notifications
   - Configure alert rules in Prometheus

3. **Set up backups**
   - Database backups (automated snapshots)
   - Configuration backups

4. **Documentation**
   - Update runbooks
   - Document custom configurations

5. **Load Testing**
   - Test with realistic traffic patterns
   - Verify auto-scaling works

6. **Security Audit**
   - Review secret management
   - Check RBAC policies
   - Verify network policies

---

## 🆘 Support & Resources

### Documentation
- **Quickstart:** `docs/QUICKSTART.md`
- **Architecture:** `docs/ARCHITECTURE_DIAGRAM.md`
- **API Endpoints:** `docs/API-ENDPOINTS.md`
- **Operations:** `docs/OPERATIONS.md`

### Tools
- **Validation Script:** `./scripts/validate-all-services.sh`
- **Deployment Script:** `./scripts/deploy-k8s.sh`
- **Port Forward Script:** `./scripts/port-forward.sh`

### Contact
- **Repository:** https://github.com/Project-Be-Better/exploresg-cloud
- **Branch:** digitalocean
- **Namespace:** exploresg

---

**Last Validated:** October 19, 2025  
**Validation Score:** 100% (183/183 checks passed)  
**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT
