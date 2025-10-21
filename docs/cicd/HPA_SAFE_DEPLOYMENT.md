# HPA Safe Deployment Guide

## ⚠️ IMPORTANT: This Guide Ensures Zero Downtime

This guide walks you through deploying HPA safely without breaking your application.

## 🛡️ Safety Features

### What Won't Break Your App
✅ **HPA only scales existing deployments** - it doesn't modify your app code  
✅ **Non-destructive** - HPA just watches and adjusts replica counts  
✅ **Can be removed instantly** - Delete HPA and your pods stay running  
✅ **No service interruption** - Scaling happens gradually, not all at once  

### What HPA Does
- Monitors CPU and memory usage of your pods
- Adds more pods when load is high
- Removes pods when load is low
- Never goes below `minReplicas` (your safety net)

## 📋 Pre-Deployment Checklist

### ✅ Before You Start

1. **Verify Current Deployment Status**
   ```bash
   kubectl get deployments -n default
   kubectl get pods -n default
   ```
   **Expected**: All deployments should be running and healthy

2. **Check Resource Requests Are Set**
   ```bash
   ./scripts/manage-hpa.sh verify
   ```
   **Expected**: All services should have CPU and memory requests configured

3. **Verify Metrics Server**
   ```bash
   kubectl top nodes
   kubectl top pods -n default
   ```
   **Expected**: Should show resource usage without errors

4. **Backup Current Replica Counts**
   ```bash
   kubectl get deployments -n default -o custom-columns=NAME:.metadata.name,REPLICAS:.spec.replicas
   ```
   Save this output - you can restore these values if needed

## 🚀 Safe Deployment Steps

### Step 1: Deploy HPA for ONE Service First (Test)

Start with a non-critical service like Fleet:

```bash
# Deploy only fleet service HPA
kubectl apply -f k8s/exploresg-fleet-service/hpa.yaml

# Watch what happens
kubectl get hpa fleet-service-hpa --watch
```

**What to expect:**
- HPA will appear with TARGETS showing `<unknown>/<target>%` initially
- After 15-30 seconds, actual metrics will appear
- Replica count may adjust based on current load
- **Your service continues running normally**

### Step 2: Verify First HPA Works

```bash
# Check HPA status
kubectl describe hpa fleet-service-hpa

# Check pods are still running
kubectl get pods -l app=exploresg-fleet-service

# Test the service still works
curl http://<your-service-url>/health
```

**Success Criteria:**
- ✅ HPA shows valid CPU/Memory percentages
- ✅ Pods are running normally
- ✅ Service responds to requests
- ✅ No error events in HPA description

### Step 3: Deploy Remaining HPAs (One at a Time)

```bash
# Auth Service
kubectl apply -f k8s/exploresg-auth-service/hpa.yaml
kubectl get hpa auth-service-hpa
# Wait 1 minute and verify

# Booking Service
kubectl apply -f k8s/exploresg-booking-service/hpa.yaml
kubectl get hpa booking-service-hpa
# Wait 1 minute and verify

# Payment Service
kubectl apply -f k8s/exploresg-payment-service/hpa.yaml
kubectl get hpa payment-service-hpa
# Wait 1 minute and verify

# Frontend Service
kubectl apply -f k8s/exploresg-frontend-service/hpa.yaml
kubectl get hpa frontend-service-hpa
# Wait 1 minute and verify
```

### Step 4: Monitor All HPAs

```bash
# View all HPAs
kubectl get hpa

# Expected output:
# NAME                   REFERENCE                            TARGETS              MINPODS   MAXPODS   REPLICAS
# auth-service-hpa       Deployment/exploresg-auth-service    45%/70%, 60%/80%    1         5         1
# fleet-service-hpa      Deployment/exploresg-fleet-service   30%/70%, 50%/80%    1         5         1
# booking-service-hpa    Deployment/exploresg-booking-service 55%/65%, 65%/75%    2         10        2
# payment-service-hpa    Deployment/exploresg-payment-service 40%/60%, 55%/70%    2         8         2
# frontend-service-hpa   Deployment/exploresg-frontend-service 60%/70%, 70%/75%   2         10        2
```

### Step 5: Deploy Grafana Dashboard

```bash
kubectl apply -f k8s/monitoring/grafana-hpa-dashboard.yaml
```

Access Grafana and look for "ExploreSG - HPA Monitoring" dashboard.

## 🔍 Monitoring After Deployment

### First Hour: Active Monitoring

```bash
# Terminal 1: Watch HPAs
kubectl get hpa --watch

# Terminal 2: Watch Pods
kubectl get pods -n default --watch

# Terminal 3: Check application logs
kubectl logs -f deployment/exploresg-booking-service
```

### What to Watch For

✅ **Good Signs:**
- HPA shows actual CPU/Memory percentages (not `<unknown>`)
- Replica counts are stable or scaling appropriately
- Services responding normally
- No error events

⚠️ **Warning Signs:**
- TARGETS show `<unknown>` for more than 2 minutes
- Constant scaling up and down (flapping)
- Services timing out or erroring
- Pods in CrashLoopBackOff

## 🚨 Rollback Procedures

### If Something Goes Wrong

#### Option 1: Delete Specific HPA (Safest)
```bash
# This ONLY removes the autoscaler, pods keep running
kubectl delete hpa <hpa-name>

# Example:
kubectl delete hpa booking-service-hpa
```

**Effect:** Stops autoscaling, current pods remain unchanged

#### Option 2: Delete All HPAs
```bash
./scripts/manage-hpa.sh delete
```

#### Option 3: Restore Original Replica Counts
```bash
# Use the backup you made earlier
kubectl scale deployment exploresg-auth-service --replicas=<original-count>
kubectl scale deployment exploresg-fleet-service --replicas=<original-count>
# etc.
```

#### Option 4: Full Rollback with Script
```bash
# Delete all HPAs
kubectl delete hpa -n default --all

# Verify HPAs are gone
kubectl get hpa

# Deployments will keep their current replica count
# Manually scale if needed
```

## 🔧 Troubleshooting

### Issue: HPA Shows `<unknown>` for Metrics

**Cause:** Metrics server not working or no resource requests

**Fix:**
```bash
# Check metrics server
kubectl get pods -n kube-system | grep metrics-server

# Test metrics
kubectl top pods

# If metrics server missing (unlikely on DigitalOcean)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### Issue: HPA Constantly Scaling Up/Down (Flapping)

**Cause:** Metrics fluctuating around threshold

**Fix:**
```bash
# Increase stabilization window or adjust thresholds
kubectl edit hpa <hpa-name>

# Or temporarily disable by deleting HPA
kubectl delete hpa <hpa-name>
```

### Issue: Pods Being Killed Too Quickly

**Cause:** Scale-down too aggressive

**Fix:**
```bash
# HPAs already have 5-minute stabilization window
# If still too fast, increase in the HPA YAML:
#   scaleDown:
#     stabilizationWindowSeconds: 600  # 10 minutes

kubectl apply -f k8s/exploresg-<service>/hpa.yaml
```

### Issue: Not Enough Pods During High Load

**Cause:** maxReplicas too low or thresholds too high

**Fix:**
```bash
# Temporarily increase max replicas
kubectl patch hpa booking-service-hpa -p '{"spec":{"maxReplicas":15}}'

# Or lower CPU threshold for faster scaling
kubectl patch hpa booking-service-hpa -p '{"spec":{"metrics":[{"type":"Resource","resource":{"name":"cpu","target":{"type":"Utilization","averageUtilization":50}}}]}}'
```

## 📊 Validation Checklist

After deployment, verify everything is working:

- [ ] All HPAs show in `kubectl get hpa`
- [ ] All HPAs show actual metrics (not `<unknown>`)
- [ ] All services are responding to health checks
- [ ] Application logs show no errors
- [ ] Grafana dashboard shows HPA data
- [ ] Can manually trigger scaling with load test
- [ ] Scale-down works after load decreases
- [ ] No pods in error state

## 💡 Best Practices for Safety

### 1. Start with Higher Min Replicas
Set `minReplicas` to your current stable count or higher. You can lower it later.

### 2. Set Conservative Max Replicas
Don't set `maxReplicas` too high initially. Gradually increase based on observed patterns.

### 3. Monitor for 24-48 Hours
Watch scaling behavior across different times of day before considering it stable.

### 4. Test During Low Traffic
Deploy HPA during off-peak hours when rollback is easier.

### 5. Have Slack/Alerting Ready
Set up alerts for:
- HPA at max replicas
- HPA unable to scale
- Frequent scaling events

## 🎯 What to Expect

### Normal Behavior
- **First 5 minutes:** HPA collects baseline metrics
- **First hour:** May see 1-2 scaling events as HPA finds equilibrium
- **First day:** Scaling based on traffic patterns
- **After 3 days:** Stable patterns emerge, can optimize thresholds

### Scaling Timeline
- **Scale-Up:** 30-90 seconds (new pods start + health checks)
- **Scale-Down:** 5+ minutes (stabilization window)

### Resource Usage
- **HPA Controller:** Negligible (checks every 15 seconds)
- **No extra memory per pod**
- **No CPU overhead on application**

## 📝 Deployment Log Template

Keep notes during deployment:

```
Date: _________________
Time: _________________

Pre-Deployment:
- [ ] Deployments healthy
- [ ] Metrics server working
- [ ] Resource requests verified
- [ ] Backup replica counts saved

Deployment:
- [ ] Fleet HPA deployed at: _____
- [ ] Auth HPA deployed at: _____
- [ ] Booking HPA deployed at: _____
- [ ] Payment HPA deployed at: _____
- [ ] Frontend HPA deployed at: _____

Post-Deployment:
- [ ] All HPAs showing metrics
- [ ] Services responding normally
- [ ] Grafana dashboard working

Issues Encountered:
____________________________
____________________________

Resolution:
____________________________
____________________________
```

## ✅ Summary: Why This Won't Break Your App

1. **HPA is non-invasive** - Only changes replica counts, not your code
2. **Always maintains minimum replicas** - Services never go to zero
3. **Gradual scaling** - Adds/removes pods slowly
4. **Instant rollback** - Delete HPA, pods stay running
5. **No data loss** - Stateless services, no database impact
6. **Battle-tested** - Standard Kubernetes feature used everywhere

## 🚀 Ready to Deploy?

If you've completed the pre-deployment checklist and understand the rollback procedures, you're ready!

```bash
# One command to deploy all (only if you're confident):
./scripts/manage-hpa.sh deploy

# Or safer approach - one at a time (recommended):
kubectl apply -f k8s/exploresg-fleet-service/hpa.yaml
# Wait, verify, then continue...
```

---

**Remember:** You can always delete an HPA without affecting your running pods. When in doubt, remove the HPA and investigate!

**Last Updated:** October 20, 2025  
**Safety Level:** 🛡️ Production Ready
