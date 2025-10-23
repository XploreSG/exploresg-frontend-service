# 🏥 Health Probe Standards

## Overview
This document defines the standardized health probe configuration for all ExploreSG services to ensure high availability and prevent premature pod termination during startup.

## Philosophy
**Conservative and High Availability First**: We prioritize service stability over fast startup times. It's better to wait an extra minute during deployment than to have services constantly restarting and affecting production traffic.

---

## Standard Probe Configurations

### Spring Boot Services (Java)
**Applies to:** Auth, Booking, Fleet, Payment services

```yaml
# Optional but recommended for slow-starting services
startupProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 15  # Allows up to 180 seconds total (30 + 15*10)

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
  initialDelaySeconds: 100  # 1 minute 40 seconds
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 5
```

**Rationale:**
- Spring Boot apps with JPA/Hibernate/Database connections typically take 60-90 seconds to start
- Conservative 120s liveness delay ensures app is fully initialized
- Readiness starts slightly earlier (100s) to begin accepting traffic as soon as possible
- With startupProbe, liveness/readiness probes are disabled until startup succeeds

---

### Next.js/React Frontend Services
**Applies to:** Frontend service

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 60
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

**Rationale:**
- Node.js apps start faster than Java apps (typically 20-40 seconds)
- 60s liveness provides safety buffer
- 30s readiness allows traffic as soon as app is ready

---

### Nginx/Static Content Services
**Applies to:** Dev Portal

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 15
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

**Rationale:**
- Nginx starts very quickly (typically <10 seconds)
- 30s liveness is conservative but not excessive
- 15s readiness allows quick traffic routing

---

### RabbitMQ Message Broker

```yaml
livenessProbe:
  exec:
    command: ["rabbitmq-diagnostics", "ping"]
  initialDelaySeconds: 90
  periodSeconds: 30
  timeoutSeconds: 10
  failureThreshold: 3

readinessProbe:
  exec:
    command: ["rabbitmq-diagnostics", "check_port_connectivity"]
  initialDelaySeconds: 60
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

**Rationale:**
- RabbitMQ initialization can take 30-60 seconds
- Uses exec probes with diagnostics commands
- Longer periodSeconds (30s) for liveness to reduce overhead

---

### PostgreSQL Databases

```yaml
livenessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - pg_isready -U postgres
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - pg_isready -U postgres
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

**Rationale:**
- PostgreSQL starts quickly (typically 10-20 seconds)
- Uses pg_isready for accurate health checks
- Lower delays acceptable as databases are critical dependencies

---

## Key Principles

### 1. **Startup Time Budget**
Every service gets a generous startup time budget:
- **Java Services:** 120+ seconds
- **Node.js Services:** 60 seconds
- **Static Services:** 30 seconds
- **Databases:** 30 seconds
- **Message Brokers:** 90 seconds

### 2. **Probe Timing Hierarchy**
```
startupProbe (if present)
  ↓ (disables other probes until successful)
readinessProbe (starts slightly before liveness)
  ↓
livenessProbe (last resort - only kills truly stuck pods)
```

### 3. **Conservative Failure Thresholds**
- **Liveness:** 3 failures (prevents killing temporarily overloaded pods)
- **Readiness:** 3-5 failures (more tolerant for traffic routing)
- **Startup:** 12-15 failures (very tolerant during initial boot)

### 4. **Never Use Short Delays for Java Apps**
❌ **NEVER DO THIS:**
```yaml
initialDelaySeconds: 10  # Too short for Spring Boot!
initialDelaySeconds: 30  # Still too short!
initialDelaySeconds: 60  # Might work, but risky!
```

✅ **ALWAYS DO THIS:**
```yaml
initialDelaySeconds: 120  # Safe for all Spring Boot apps
```

### 5. **When in Doubt, Add More Time**
If you see CrashLoopBackOff with "connection refused" errors:
1. Check the actual startup time in logs
2. Add 30-60 seconds buffer to that time
3. Update initialDelaySeconds

---

## Resource Configuration Standards

Along with health probes, ensure proper resource allocation:

```yaml
resources:
  requests:
    memory: "512Mi"  # Minimum for Java apps
    cpu: "250m"      # Minimum for Java apps
  limits:
    memory: "768Mi"  # Reasonable limit
    cpu: "500m"      # Reasonable limit
```

**Note:** Insufficient memory/CPU can slow startup and cause probe failures!

---

## Troubleshooting Guide

### Symptom: Pod keeps restarting (CrashLoopBackOff)

**Check:**
```bash
# Get pod status
kubectl get pods -n exploresg -l app=<service-name>

# Check recent events
kubectl describe pod <pod-name> -n exploresg

# Look for probe failures
kubectl logs <pod-name> -n exploresg | grep -E "(Started|Tomcat|JPA)"
```

**Common Issues:**
1. **Liveness probe starting too early** → Increase `initialDelaySeconds`
2. **App stuck in startup** → Check database connectivity, add startupProbe
3. **Resource constraints** → Increase memory/CPU limits

---

## Rollout Strategy

When applying probe changes:

```bash
# Apply the updated deployment
kubectl apply -f k8s/<service>/deployment.yaml

# Watch the rollout
kubectl rollout status deployment/<service-name> -n exploresg

# If issues occur, rollback
kubectl rollout undo deployment/<service-name> -n exploresg
```

---

## Testing New Services

For new services, follow this process:

1. **Deploy without probes first** (or with very high delays)
2. **Monitor actual startup time:**
   ```bash
   kubectl logs -f <pod-name> -n exploresg
   ```
3. **Note the time from start to "Started Application"**
4. **Set probes with 30-50% buffer above observed time**
5. **Test with rolling update to verify**

---

## Summary

| Service Type | Liveness Delay | Readiness Delay | Startup Probe |
|--------------|----------------|-----------------|---------------|
| Spring Boot | 120s | 100s | Optional (30s, 15 failures) |
| Node.js | 60s | 30s | Not needed |
| Nginx | 30s | 15s | Not needed |
| PostgreSQL | 30s | 10s | Not needed |
| RabbitMQ | 90s | 60s | Not needed |

**Golden Rule:** When in doubt, wait longer. High availability > fast startup.

---

*Last Updated: October 19, 2025*
*Applies to: ExploreSG Cloud Platform v1.x*
