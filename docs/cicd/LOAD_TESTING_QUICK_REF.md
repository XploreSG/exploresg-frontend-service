# 🚀 Load Testing Dashboard - Quick Reference

**Dashboard:** ExploreSG - Load Testing Dashboard (Pre-HPA)  
**Purpose:** Monitor performance during load tests to establish HPA baselines

---

## ⚡ Quick Deploy

```bash
# 1. Apply the dashboard
kubectl apply -f k8s/monitoring/grafana-loadtest-dashboard.yaml

# 2. Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80

# 3. Open dashboard
# http://localhost:3001 → Dashboards → Browse → "ExploreSG - Load Testing Dashboard (Pre-HPA)"
```

---

## 🎯 What This Dashboard Monitors

### Frontend (React/Nginx)
- ✅ CPU & Memory usage
- ✅ Pod count (static, pre-HPA)
- ✅ Network I/O
- ✅ Pod restarts

### Backend Services (Spring Boot)
- ✅ Request rate (req/s)
- ✅ Response time (avg & P95)
- ✅ Error rates (4xx, 5xx)
- ✅ CPU & Memory usage
- ✅ Database connection pool

---

## 📊 Key Metrics to Watch

| Metric | Good | Warning | Critical | Action |
|--------|------|---------|----------|--------|
| **Frontend CPU %** | <70% | 70-85% | >85% | Scale! |
| **Frontend Memory %** | <70% | 70-85% | >85% | Check for leaks |
| **Avg Response Time** | <500ms | 500-1000ms | >1000ms | Investigate |
| **P95 Response Time** | <1000ms | 1000-2000ms | >2000ms | Scale urgently |
| **Error Rate** | 0% | <0.1% | >0.1% | Already broken |
| **5xx Errors** | 0 | Any | Many | Too late! |

---

## 🧪 Run Quick Load Test

### Using k6 (Fastest)

```bash
# Install k6
brew install k6  # macOS
# or sudo apt install k6  # Linux

# Create test file
cat > loadtest.js << 'EOF'
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  http.get('http://localhost:3000/');
  sleep(1);
}
EOF

# Port forward frontend
kubectl port-forward -n exploresg svc/exploresg-frontend-service 3000:3000

# Run test (in another terminal)
k6 run loadtest.js
```

### Using Apache Bench (Simplest)

```bash
# Port forward frontend
kubectl port-forward -n exploresg svc/exploresg-frontend-service 3000:3000

# Run load test (10000 requests, 100 concurrent)
ab -n 10000 -c 100 http://localhost:3000/

# For sustained load
while true; do ab -n 1000 -c 50 http://localhost:3000/; sleep 1; done
```

---

## 🔍 How to Analyze Results

### Step 1: Record Baseline (No Load)

```
✏️ Baseline Metrics:
- Frontend CPU: _____%
- Frontend Memory: _____%
- Avg Response Time: _____ ms
- P95 Response Time: _____ ms
```

### Step 2: Run Load Test & Record

```
✏️ Under Load (100 users):
- Frontend CPU: _____%      ← If >70%, set HPA threshold at 65-70%
- Frontend Memory: _____%
- Avg Response Time: _____ ms
- P95 Response Time: _____ ms
- Error Rate: _____%        ← If >0%, load is too high
- Pod Count: _____          ← Current static replicas
```

### Step 3: Find Breaking Point

**Gradually increase load until:**
- CPU hits 90%+
- Response time >2 seconds
- Errors appear

**This is your breaking point!**

---

## ⚙️ HPA Configuration Formula

Based on your load test results:

```yaml
# Set HPA threshold 10-15% BEFORE breaking point
# If CPU breaks at 85% → Set HPA at 70%

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: exploresg-frontend-hpa
  namespace: exploresg
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: exploresg-frontend-service
  minReplicas: 2              # Current baseline from dashboard
  maxReplicas: 6              # 3x capacity = 3x traffic handling
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # From load test observations
```

---

## 🎓 Common Patterns & Interpretations

### Pattern 1: CPU Spikes, Memory Stable
```
CPU: 80% → 90% → 85% → 75% (oscillating)
Memory: 40% (flat)
```
**Interpretation:** CPU-bound, perfect for CPU-based HPA  
**Action:** Implement HPA with CPU metric

### Pattern 2: Both CPU & Memory High
```
CPU: 85%
Memory: 80%
```
**Interpretation:** Resource constrained  
**Action:** Increase resource limits first, then add HPA

### Pattern 3: Response Time Doubles, CPU at 70%
```
CPU: 70%
Avg Response: 200ms → 600ms
```
**Interpretation:** Approaching capacity limit  
**Action:** Set HPA threshold at 60-65% CPU

### Pattern 4: Backend Struggles, Frontend Fine
```
Frontend CPU: 45%
Auth Service CPU: 88%
```
**Interpretation:** Backend is bottleneck  
**Action:** Implement HPA on Auth Service first

---

## 🚨 Warning Signs

| Observation | Meaning | Immediate Action |
|-------------|---------|------------------|
| **CPU flat at 100%** | Throttling | Already need to scale |
| **Memory climbing steadily** | Memory leak | Fix code before HPA |
| **P95 >> 2x Average** | High variance | Investigate outliers |
| **5xx errors appear** | System breaking | Reduce load immediately |
| **Pod restarts increase** | Crashing | Check logs, increase limits |

---

## 📋 Dashboard Checklist

### Before Load Test
- [ ] Dashboard opens successfully
- [ ] All panels showing data
- [ ] Time range: Last 15 minutes
- [ ] Auto-refresh: 10 seconds
- [ ] Record baseline metrics

### During Load Test
- [ ] Monitor Frontend CPU gauge (top left)
- [ ] Watch Response Time graphs
- [ ] Check for any 5xx errors
- [ ] Observe pod restart count
- [ ] Note when CPU hits 70%, 80%, 90%

### After Load Test
- [ ] Save dashboard snapshot (Settings → Save)
- [ ] Document breaking point
- [ ] Calculate HPA thresholds
- [ ] Screenshot key moments
- [ ] Plan HPA configuration

---

## 🔧 Troubleshooting

### "No Data" in Dashboard
```bash
# Check Prometheus is scraping
kubectl get servicemonitor -n exploresg

# Check pods are running
kubectl get pods -n exploresg

# Check Prometheus targets
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
# Open: http://localhost:9090/targets
```

### Frontend Metrics Partial
**Expected:** Frontend only has CPU/Memory/Network (no HTTP metrics)  
**Reason:** React app doesn't expose Prometheus endpoint  
**Backend:** All HTTP metrics available

### Load Test Not Impacting Metrics
- Verify you're hitting correct URL
- Check load is actually reaching pods: `kubectl logs -n exploresg -l app=exploresg-frontend-service`
- Increase load (more users, more requests)

---

## 📚 Related Docs

- **Full Guide:** `docs/LOAD_TESTING_DASHBOARD_GUIDE.md`
- **Grafana Basics:** `docs/GRAFANA_BEGINNERS_GUIDE.md`
- **Monitoring Setup:** `docs/MONITORING.md`

---

## 🎯 Success Criteria

**You're ready to implement HPA when you can answer:**

✅ At what CPU % should pods scale?  
✅ How many min replicas are needed?  
✅ How many max replicas are needed?  
✅ Which services need HPA first?  
✅ What's the breaking point (req/s, CPU %, response time)?

---

## 💡 Pro Tips

1. **Run tests multiple times** - Results should be consistent
2. **Test different times of day** - Traffic patterns vary
3. **Document everything** - Screenshots + metrics snapshots
4. **Compare before/after HPA** - Use same dashboard
5. **Start conservative** - Can always lower HPA threshold later
6. **Monitor DB connections** - They might be the real bottleneck
7. **Check backend impact** - Frontend load affects all services

---

**Dashboard Ready! Start Load Testing! 🚀**

```bash
# Quick start in one command
kubectl apply -f k8s/monitoring/grafana-loadtest-dashboard.yaml && \
echo "✅ Dashboard deployed! Access at http://localhost:3001"
```
