# 🚨 CRITICAL: Image Tag Discovery & Fix

## ⚠️ Issue Found

**Date:** October 18, 2025  
**Severity:** HIGH  
**Impact:** Production deployments using `:latest` tag instead of specific versions

---

## 🔍 Root Cause

The K8s cluster was using **Argo Rollouts** instead of regular Deployments for some services. The rollout files had `:latest` tags while the deployment.yaml files had specific versions.

### Files Affected:

| Service | File | Issue | Fixed |
|---------|------|-------|-------|
| **Frontend** | `k8s/exploresg-frontend-service/rollout.yaml` | Using `:latest` | ✅ Changed to `v1.2.5.1` |
| **Fleet** | `k8s/exploresg-fleet-service/rollout.yaml` | Using `:latest` | ✅ Changed to `v1.2.4.2` |
| **Auth** | `k8s/exploresg-auth-service/rollout.yaml` | ✅ Already using `v1.2.6.1` | ✅ OK |

### Services NOT using Rollouts (using Deployments):
- ✅ **Booking** - Using deployment.yaml with `v1.2.6.1`
- ✅ **Payment** - Using deployment.yaml with `v1.0.0`

---

## 🐛 Why This is a Problem

Using `:latest` tag in production is dangerous because:

1. **Unpredictable Updates**: Any push to `:latest` gets pulled automatically
2. **No Rollback**: Can't rollback to specific version easily
3. **Inconsistent State**: Different nodes might have different `:latest` versions
4. **Hard to Debug**: Can't tell which code version is running
5. **No Version Control**: Can't track which version caused issues

---

## ✅ Fix Applied

### Frontend Service
**File:** `k8s/exploresg-frontend-service/rollout.yaml`

```diff
- image: sreerajrone/exploresg-frontend-service:latest
+ image: sreerajrone/exploresg-frontend-service:v1.2.5.1
```

### Fleet Service
**File:** `k8s/exploresg-fleet-service/rollout.yaml`

```diff
- image: sreerajrone/exploresg-fleet-service:latest
+ image: sreerajrone/exploresg-fleet-service:v1.2.4.2
```

---

## 📋 Complete Image Tag Audit

### Current Production Versions:

| Service | Type | Image Tag | Status |
|---------|------|-----------|--------|
| **Frontend** | Rollout | `v1.2.5.1` | ✅ Fixed |
| **Auth** | Rollout | `v1.2.6.1` | ✅ OK |
| **Fleet** | Rollout | `v1.2.4.2` | ✅ Fixed |
| **Booking** | Deployment | `v1.2.6.1` | ✅ OK |
| **Payment** | Deployment | `v1.0.0` | ✅ OK |

---

## 🔄 Deployment Strategy

### Services Using Argo Rollouts (Canary):
1. **Frontend** - 3 replicas, canary with 10% → 25% → 50% → 75% → 100%
2. **Auth** - 2 replicas, canary with automatic rollback
3. **Fleet** - 2 replicas, canary with Prometheus analysis

### Services Using Standard Deployments:
1. **Booking** - 1 replica, rolling update
2. **Payment** - 1 replica, rolling update

---

## 📝 Checklist for Future Updates

Before deploying any new version:

### 1. Update Image Tags in ALL Files:
```bash
# For services with rollouts
- [ ] k8s/exploresg-[service]-service/rollout.yaml
- [ ] k8s/exploresg-[service]-service/deployment.yaml (if exists)

# For services with deployments only
- [ ] k8s/exploresg-[service]-service/deployment.yaml
```

### 2. Update Docker Compose:
```bash
- [ ] docker-compose.yaml
```

### 3. Verify Tags:
```bash
# Check all rollout files
grep -r "image:.*:latest" k8s/

# Check all deployment files  
grep -r "image:.*exploresg.*:latest" k8s/

# Should return NO results!
```

### 4. Test Locally First:
```bash
# Pull the specific version
docker pull sreerajrone/exploresg-[service]-service:v1.2.x

# Test with docker-compose
docker-compose up -d [service]
```

### 5. Commit and Push:
```bash
git add k8s/exploresg-[service]-service/
git add docker-compose.yaml
git commit -m "Update [service] to version v1.2.x"
git push origin digitalocean
```

### 6. Monitor ArgoCD Sync:
```bash
# Watch the rollout
kubectl argo rollouts get rollout exploresg-[service]-service -n exploresg --watch

# Or check ArgoCD UI
# https://argocd.xplore.town
```

---

## 🛠️ How to Check Running Versions

### Check K8s Cluster:
```bash
# For rollouts
kubectl get rollout exploresg-frontend-service -n exploresg -o yaml | grep image:

# For deployments  
kubectl get deployment exploresg-booking-service -n exploresg -o yaml | grep image:

# For running pods (actual running version)
kubectl get pods -n exploresg -o yaml | grep "image:"
```

### Check Docker Hub:
```bash
# List available tags
curl -s https://hub.docker.com/v2/repositories/sreerajrone/exploresg-frontend-service/tags/ | grep -o '"name":"[^"]*"'
```

---

## 🚀 Rollback Procedure

If you need to rollback to a previous version:

### For Rollouts:
```bash
# Undo the rollout
kubectl argo rollouts undo exploresg-[service]-service -n exploresg

# Or set to specific revision
kubectl argo rollouts set image exploresg-[service]-service \
  [container-name]=sreerajrone/exploresg-[service]-service:v1.2.x \
  -n exploresg
```

### For Deployments:
```bash
# Undo the deployment
kubectl rollout undo deployment/exploresg-[service]-service -n exploresg

# Or set specific image
kubectl set image deployment/exploresg-[service]-service \
  [container-name]=sreerajrone/exploresg-[service]-service:v1.2.x \
  -n exploresg
```

---

## 📚 Related Files

- [Docker Image Versions](./DOCKER_IMAGE_VERSIONS.md)
- [Docker Compose Testing](./DOCKER_COMPOSE_TESTING.md)
- [Argo Rollouts Guide](./ARGO_ROLLOUTS_GUIDE.md)
- [Deployment Readiness Review](./DEPLOYMENT_READINESS_REVIEW.md)

---

## ✅ Action Items

- [x] Fix frontend rollout.yaml (`:latest` → `v1.2.5.1`)
- [x] Fix fleet rollout.yaml (`:latest` → `v1.2.4.2`)
- [x] Apply changes to cluster
- [ ] Commit and push changes to GitHub
- [ ] Monitor rollout completion
- [ ] Update team documentation
- [ ] Add CI/CD check to prevent `:latest` tags

---

**Remember:** ALWAYS use specific semantic version tags (`v1.2.3`) in production, NEVER `:latest`!

---

**Last Updated:** October 18, 2025
