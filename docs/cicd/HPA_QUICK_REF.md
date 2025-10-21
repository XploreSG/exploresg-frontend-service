# HPA Quick Reference Guide

## 🚀 Quick Start

### Deploy All HPAs
```bash
./scripts/manage-hpa.sh deploy
```

### Check HPA Status
```bash
./scripts/manage-hpa.sh status
```

### Watch HPAs in Real-Time
```bash
kubectl get hpa --watch
# or
./scripts/manage-hpa.sh watch
```

## 📊 Common Commands

### List All HPAs
```bash
kubectl get hpa
kubectl get hpa -n default
```

### Describe HPA (Detailed Info)
```bash
kubectl describe hpa auth-service-hpa
kubectl describe hpa booking-service-hpa
```

### Get HPA Metrics
```bash
./scripts/manage-hpa.sh metrics
```

### View Pod Resource Usage
```bash
kubectl top pods
kubectl top pods -l app=auth-service
```

### View Node Resource Usage
```bash
kubectl top nodes
```

## 🔧 HPA Configuration Summary

| Service | Min Replicas | Max Replicas | CPU Target | Memory Target |
|---------|-------------|--------------|------------|---------------|
| Auth | 1 | 5 | 70% | 80% |
| Fleet | 1 | 5 | 70% | 80% |
| Booking | 2 | 10 | 65% | 75% |
| Payment | 2 | 8 | 60% | 70% |
| Frontend | 2 | 10 | 70% | 75% |

## 🧪 Testing

### Run Load Test on Specific Service
```bash
./scripts/manage-hpa.sh test auth
./scripts/manage-hpa.sh test booking
./scripts/manage-hpa.sh test payment
```

### Manual Load Test (Alternative)
```bash
# Port forward service
kubectl port-forward svc/booking-service 8080:80

# Generate load (in another terminal)
while true; do curl http://localhost:8080/health; done
```

### Watch Scaling Events
```bash
# Terminal 1: Watch HPA
kubectl get hpa --watch

# Terminal 2: Watch Pods
kubectl get pods --watch

# Terminal 3: Generate Load
./scripts/manage-hpa.sh test booking
```

## 📈 Monitoring

### View Recent Events
```bash
kubectl get events --sort-by='.lastTimestamp' | grep -i hpa
# or
./scripts/manage-hpa.sh events
```

### Check Scaling History
```bash
kubectl describe hpa <hpa-name> | grep -A 10 "Events:"
```

### Grafana Dashboards
- **Dashboard**: Kubernetes / Compute Resources / Pod
- **Metrics to Monitor**:
  - Current vs Desired Replicas
  - CPU/Memory Utilization
  - Scaling Events

## 🔍 Troubleshooting

### HPA Shows "unknown" for Metrics
```bash
# Check metrics server
kubectl get deployment metrics-server -n kube-system

# Check pod metrics available
kubectl top pods

# Verify resource requests are set
./scripts/manage-hpa.sh verify
```

**Fix**: Ensure pods have resource requests defined

### HPA Not Scaling
```bash
# Check HPA conditions
kubectl describe hpa <hpa-name>

# Look for errors in events
kubectl get events | grep -i hpa

# Check current metrics
kubectl get hpa <hpa-name> -o yaml
```

**Common Causes**:
- No resource requests set
- Metrics server not running
- Target already met
- Min/Max replicas reached

### Pods Constantly Restarting During Scale
```bash
# Check pod logs
kubectl logs <pod-name>

# Check pod describe for events
kubectl describe pod <pod-name>
```

**Common Causes**:
- Resource limits too low
- Health checks too aggressive
- Application startup slow

## 🎯 Best Practices

### ✅ DO
- Set appropriate resource requests and limits
- Monitor scaling patterns over time
- Adjust thresholds based on actual usage
- Use stabilization windows to prevent flapping
- Keep min replicas ≥ 2 for critical services
- Test HPA before production

### ❌ DON'T
- Set CPU target < 50% (wastes resources)
- Set CPU target > 90% (risks performance)
- Scale based on single metric without context
- Ignore scaling events and patterns
- Deploy HPA without resource requests

## 📋 Maintenance Tasks

### Daily
```bash
# Quick status check
./scripts/manage-hpa.sh status
```

### Weekly
```bash
# Review metrics and adjust if needed
./scripts/manage-hpa.sh metrics

# Check for any issues
kubectl get hpa
kubectl describe hpa <hpa-name>
```

### Monthly
```bash
# Review scaling patterns in Grafana
# Adjust min/max replicas based on growth
# Update resource requests/limits if needed
```

## 🔄 Update HPA Configuration

### Edit HPA
```bash
kubectl edit hpa auth-service-hpa
```

### Update from File
```bash
# Edit the file
vim k8s/exploresg-auth-service/hpa.yaml

# Apply changes
kubectl apply -f k8s/exploresg-auth-service/hpa.yaml
```

### Patch HPA (Quick Changes)
```bash
# Change max replicas
kubectl patch hpa auth-service-hpa -p '{"spec":{"maxReplicas":10}}'

# Change CPU target
kubectl patch hpa auth-service-hpa -p '{"spec":{"metrics":[{"type":"Resource","resource":{"name":"cpu","target":{"type":"Utilization","averageUtilization":80}}}]}}'
```

## 🗑️ Remove HPA

### Delete Single HPA
```bash
kubectl delete hpa auth-service-hpa
```

### Delete All HPAs
```bash
./scripts/manage-hpa.sh delete
```

**Note**: Deleting HPA doesn't delete pods, just stops autoscaling

## 📊 Expected Behavior

### Scale Up Scenario
```
1. Load increases → CPU/Memory rises above target
2. HPA calculates desired replicas (every 15s)
3. HPA updates deployment replicas
4. New pods created (30-60s startup time)
5. New pods become ready
6. Load distributed across more pods
7. CPU/Memory returns to normal
```

### Scale Down Scenario
```
1. Load decreases → CPU/Memory drops below target
2. HPA waits (stabilization window: 5 minutes)
3. If still low, HPA reduces replicas (max 50% reduction)
4. Pods terminated gracefully
5. Remaining pods handle load
```

## 🎓 Quick Tips

### Calculate Desired Replicas
```
desiredReplicas = ceil[currentReplicas * (currentMetric / targetMetric)]
```

**Example**:
- Current: 2 replicas
- Current CPU: 90%
- Target CPU: 70%
- Desired: ceil[2 * (90/70)] = ceil[2.57] = 3 replicas

### Check if HPA is Active
```bash
kubectl get hpa
```
Look for:
- `TARGETS` column showing current/target
- `REPLICAS` matching current pod count

### Force Immediate Scaling
```bash
# Temporarily lower target (scales up immediately)
kubectl patch hpa booking-service-hpa -p '{"spec":{"metrics":[{"type":"Resource","resource":{"name":"cpu","target":{"type":"Utilization","averageUtilization":30}}}]}}'

# Restore original target
kubectl apply -f k8s/exploresg-booking-service/hpa.yaml
```

## 📚 Useful Queries

### Get All HPA Info in JSON
```bash
kubectl get hpa -o json | jq '.items[] | {name: .metadata.name, minReplicas: .spec.minReplicas, maxReplicas: .spec.maxReplicas, currentReplicas: .status.currentReplicas}'
```

### Monitor Specific Service
```bash
watch -n 2 'kubectl get hpa booking-service-hpa; echo; kubectl get pods -l app=booking-service; echo; kubectl top pods -l app=booking-service'
```

### Export HPA Config
```bash
kubectl get hpa auth-service-hpa -o yaml > backup-auth-hpa.yaml
```

## 🔗 Related Documentation

- [HPA Implementation Guide](./HPA_IMPLEMENTATION_GUIDE.md) - Detailed guide
- [Monitoring Guide](./MONITORING.md) - Grafana setup
- [Load Testing Guide](./LOAD_TESTING_QUICK_REF.md) - Testing procedures

## 🆘 Need Help?

### Check Logs
```bash
# HPA controller logs (if using custom controller)
kubectl logs -n kube-system -l app=horizontal-pod-autoscaler

# Metrics server logs
kubectl logs -n kube-system -l k8s-app=metrics-server
```

### Verify Setup
```bash
# Run verification script
./scripts/manage-hpa.sh verify

# Check cluster autoscaler (if enabled)
kubectl describe configmap cluster-autoscaler-status -n kube-system
```

---

**Last Updated**: October 20, 2025  
**Quick Access**: `./scripts/manage-hpa.sh help`
