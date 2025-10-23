# 🔧 Auth Service Degraded - Root Cause & Fix

**Date:** October 18, 2025  
**Service:** exploresg-auth-service  
**Status:** ✅ Fixed  

---

## 🐛 Problem

The auth service was showing as **"Degraded"** in ArgoCD with pods in CrashLoopBackOff.

### Symptoms:
- Pods repeatedly failing liveness probe
- Containers restarting every 1-2 minutes
- Service never becoming fully available
- Multiple replica sets running simultaneously

---

## 🔍 Root Cause Analysis

### Issue: **Probe Timing Mismatch**

The auth service takes **~90-100 seconds** to fully start up due to:
- Spring Boot initialization
- Hibernate/JPA entity mapping
- Database connection pool setup
- Security configuration loading

However, the liveness probe was configured to start checking at **60 seconds**:

```yaml
livenessProbe:
  initialDelaySeconds: 60  # TOO EARLY!
  periodSeconds: 10
```

### What Happened:
1. Pod starts
2. At 60 seconds, liveness probe checks `/actuator/health/liveness`
3. Application still starting → Connection refused
4. After 3 failures (60s, 70s, 80s), pod is killed
5. Pod restarts → cycle repeats forever ♻️

### Evidence from Logs:
```
2025-10-18 03:54:59 - Application starting
2025-10-18 03:56:33 - Application fully ready (94 seconds)

Events:
  Warning  Unhealthy  Liveness probe failed at 60s
  Normal   Killing    Container killed at 90s  
  Normal   Started    Container restarted
```

---

## ✅ Solution

### Fix: Increase Probe Initial Delays

Updated both `rollout.yaml` and `deployment.yaml`:

**Before:**
```yaml
livenessProbe:
  initialDelaySeconds: 60  # ❌ Too early
readinessProbe:
  initialDelaySeconds: 50  # ❌ Too early
```

**After:**
```yaml
livenessProbe:
  initialDelaySeconds: 120  # ✅ Wait 2 minutes
readinessProbe:
  initialDelaySeconds: 100  # ✅ Wait 1:40
```

### Why These Values:
- **100 seconds** for readiness: Allows app to start accepting traffic
- **120 seconds** for liveness: Extra buffer to prevent premature kills
- Gives ~30 second safety margin for slower startups

---

## 📝 Files Modified

1. `k8s/exploresg-auth-service/rollout.yaml` - Argo Rollout configuration
2. `k8s/exploresg-auth-service/deployment.yaml` - Standard deployment (for consistency)

### Changes Applied:
```bash
# Applied the rollout with new probe timings
kubectl apply -f k8s/exploresg-auth-service/rollout.yaml

# Cleaned up crashing pods
kubectl delete pod <old-pods>
```

---

## 📊 Results

### Before Fix:
```
NAME                                   READY   STATUS             RESTARTS
exploresg-auth-service-xxx-smdnx       0/1     CrashLoopBackOff   7
exploresg-auth-service-xxx-sn2xx       0/1     Running            10
```

### After Fix:
```
NAME                                   READY   STATUS    RESTARTS   AGE
exploresg-auth-service-c847f9bcf-92vh7  1/1     Running   0          5m
exploresg-auth-service-c847f9bcf-cpjtd  1/1     Running   0          5m
```

✅ **Both pods healthy and running**  
✅ **No more restarts**  
✅ **Service fully available**

---

## 🎓 Lessons Learned

### 1. **Know Your Application Startup Time**
- Measure how long your app actually takes to start
- Set probes with 20-30% safety margin
- Monitor startup logs to find bottlenecks

### 2. **Liveness vs Readiness Probes**
- **Readiness**: Can I serve traffic? (check earlier)
- **Liveness**: Am I alive? (check later, be generous)
- Liveness kills pods → be conservative!

### 3. **Spring Boot Startup Can Be Slow**
- JPA entity scanning takes time
- Database connections need warmup
- Security configuration is heavy
- Consider startup probes for very slow apps

### 4. **Test Probe Timings Locally**
```bash
# Time your app startup
time docker run my-app

# Add 20% buffer for production
startup_time = measured_time * 1.2
```

---

## 🚀 Recommended Probe Configuration

For Spring Boot services with JPA/Hibernate:

```yaml
# For apps that take 60-90 seconds to start
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 120  # 2 minutes
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 100  # 1:40
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 5

# Optional: For very slow starting apps (120+ seconds)
startupProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 0
  periodSeconds: 10
  failureThreshold: 18  # 180 seconds max (18 * 10s)
```

---

## 📋 Checklist for Similar Issues

When you see CrashLoopBackOff:

- [ ] Check pod events: `kubectl describe pod <name>`
- [ ] Look for probe failures in events
- [ ] Check application startup logs
- [ ] Measure actual startup time
- [ ] Compare with probe `initialDelaySeconds`
- [ ] Increase probe delays if needed
- [ ] Test in development first
- [ ] Apply to production
- [ ] Monitor for successful startups

---

## 🔄 Next Steps

1. **Commit Changes to Git:**
   ```bash
   git add k8s/exploresg-auth-service/
   git commit -m "Fix: Increase probe delays for auth service startup"
   git push origin digitalocean
   ```

2. **Let ArgoCD Sync:**
   - ArgoCD will automatically sync from Git
   - Or manually sync in ArgoCD UI

3. **Monitor the Rollout:**
   ```bash
   kubectl get pods -n exploresg -l app=exploresg-auth-service -w
   ```

4. **Verify Health:**
   ```bash
   curl https://api.xplore.town/auth/actuator/health
   ```

---

## 📚 Related Documentation

- [Kubernetes Liveness, Readiness, and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Spring Boot Actuator Health](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.endpoints.health)
- [Argo Rollouts Documentation](https://argoproj.github.io/argo-rollouts/)

---

**Status:** ✅ Auth service is now healthy and stable!

**Last Updated:** October 18, 2025
