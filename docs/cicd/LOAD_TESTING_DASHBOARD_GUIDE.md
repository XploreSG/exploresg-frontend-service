# 🚀 Load Testing Dashboard Guide - Pre-HPA Baseline

**Created:** October 20, 2025  
**Purpose:** Establish performance baselines before implementing HPA (Horizontal Pod Autoscaler)  
**Dashboard:** `ExploreSG - Load Testing Dashboard (Pre-HPA)`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [What This Dashboard Shows](#what-this-dashboard-shows)
3. [Quick Start](#quick-start)
4. [Dashboard Layout](#dashboard-layout)
5. [Key Metrics Explained](#key-metrics-explained)
6. [How to Run Load Tests](#how-to-run-load-tests)
7. [Analyzing Results for HPA](#analyzing-results-for-hpa)
8. [Example Scenario](#example-scenario)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What Problem Does This Solve?

Before implementing HPA, you need to answer:
- ❓ **At what CPU/Memory % should pods scale?**
- ❓ **How many min/max replicas do we need?**
- ❓ **Which services are bottlenecks under load?**
- ❓ **What's the breaking point of our current setup?**

### This Dashboard Helps You:

✅ **Establish Baselines** - Know your current performance  
✅ **Identify Bottlenecks** - Which service struggles first?  
✅ **Set HPA Thresholds** - Data-driven scaling decisions  
✅ **Validate HPA** - Compare before/after metrics  

---

## What This Dashboard Shows

### Using ONLY Existing Metrics (No Configuration Changes Needed!)

| Metric Source | What You Get | Available For |
|---------------|--------------|---------------|
| **Kubernetes Metrics** | CPU, Memory, Pod count, Restarts, Network I/O | All services (Frontend + Backend) |
| **Spring Boot Actuator** | Request rate, Response time, P95 latency, Error rates, DB connections | Backend services (Auth, Fleet, Booking, Payment) |
| **ServiceMonitors** | Already configured for all backend services | ✅ Ready to use |

---

## Quick Start

### Step 1: Apply the Dashboard

```bash
# Apply the dashboard ConfigMap
kubectl apply -f k8s/monitoring/grafana-loadtest-dashboard.yaml

# Verify it was created
kubectl get configmap -n monitoring exploresg-loadtest-dashboard

# Restart Grafana to pick up new dashboard (if needed)
kubectl rollout restart deployment -n monitoring prometheus-grafana
```

### Step 2: Access the Dashboard

```bash
# Port forward Grafana (if not already running)
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80
```

**Open:** http://localhost:3001

**Navigate:**
1. Login (admin / prom-operator)
2. Go to **Dashboards** → **Browse**
3. Look for: **"ExploreSG - Load Testing Dashboard (Pre-HPA)"**
4. Open it

### Step 3: Set Time Range

- **For Load Testing:** Set to **"Last 15 minutes"** with **10s refresh**
- **For Analysis:** Set to **"Last 1 hour"** after test completes

---

## Dashboard Layout

### Top Section: Frontend Overview (Quick Status)

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Frontend    │ Frontend    │ Frontend    │ Frontend    │ Total       │ Error Rate  │
│ CPU %       │ Memory %    │ Pod Count   │ Restarts    │ Req/sec     │ %           │
│ (Gauge)     │ (Gauge)     │ (Number)    │ (Number)    │ (Number)    │ (Number)    │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Middle Section: Resource Utilization

```
┌────────────────────────────────────────────────┬────────────────────────────────────────────────┐
│ Frontend CPU Usage (Cores)                     │ Frontend Memory Usage                          │
│ - Shows actual CPU cores used                  │ - Shows memory usage vs limits                 │
│ - Red line = CPU limit (500m = 0.5 cores)     │ - Red line = Memory limit (512Mi)             │
│ - Watch for throttling!                        │ - Watch for OOMKill!                          │
└────────────────────────────────────────────────┴────────────────────────────────────────────────┘
```

### Lower Section: Backend Impact & Performance

```
┌────────────────────────────────────────────────┬────────────────────────────────────────────────┐
│ Backend Request Rate                           │ Backend Response Time (Average)                │
│ - Shows which backends are hit by frontend     │ - When does response time degrade?            │
└────────────────────────────────────────────────┴────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┬────────────────────────────────────────────────┐
│ Backend Response Time P95                      │ 5xx Errors by Service                         │
│ - Worst case scenarios (95th percentile)       │ - System breaking points                      │
└────────────────────────────────────────────────┴────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┬────────────────────────────────────────────────┐
│ Backend CPU Usage %                            │ Backend Memory Usage %                        │
│ - HPA trigger candidates                       │ - Memory pressure detection                   │
└────────────────────────────────────────────────┴────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┬────────────────────────────────────────────────┐
│ Database Connection Pool                       │ Pod Count by Service                          │
│ - Saturation point detection                   │ - Current static replicas (Pre-HPA)           │
└────────────────────────────────────────────────┴────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┬────────────────────────────────────────────────┐
│ Frontend Network I/O                           │ HPA Decision Table                            │
│ - Bandwidth usage                              │ - Which services need scaling?                │
└────────────────────────────────────────────────┴────────────────────────────────────────────────┘
```

---

## Key Metrics Explained

### 🎯 Critical Metrics for HPA Planning

#### 1. **Frontend CPU %** (Gauge - Top Left)

**What it shows:** Average CPU usage across all frontend pods as a percentage

**Colors:**
- 🟢 Green: 0-70% (Healthy)
- 🟡 Yellow: 70-85% (Scale soon)
- 🔴 Red: 85%+ (Scale NOW!)

**HPA Implication:**
- If this hits 75-80% under moderate load → Set HPA threshold at **70% CPU**
- If it stays at 90%+ → Your requests are **too low**, increase them

**Example:**
```
Current: 82% CPU
Interpretation: Frontend is struggling, needs more replicas
HPA Action: Scale from 2 → 3 or 4 pods
```

---

#### 2. **Frontend Memory %** (Gauge)

**What it shows:** Memory usage vs memory limit (512Mi)

**Why it matters:**
- Memory doesn't scale down like CPU
- If hitting limit → Pods will OOMKill (crash)
- Not recommended as HPA metric for stateless apps

**Warning Signs:**
- 🔴 85%+ constantly → Increase memory limits before HPA
- 📈 Steadily climbing → Possible memory leak

---

#### 3. **Frontend CPU Usage (Cores)** (Time Series Graph)

**What it shows:** Actual CPU cores used (0 to 0.5 cores = 500m limit)

**How to read:**
```
CPU Usage: 0.42 cores
CPU Limit: 0.50 cores
Usage: 84%
```

**HPA Insights:**
- **Spiky pattern** → CPU-based HPA works well
- **Flat at limit** → You're CPU throttled, scale immediately
- **Oscillating** → HPA will scale up/down frequently

**Red Line:** Your CPU limit (500m)
- If actual usage touches red line → You're throttled
- Throttling = Slower response times even with free memory

---

#### 4. **Backend Request Rate** (Time Series Graph)

**What it shows:** Requests/sec hitting each backend service

**Why it matters:**
- Shows which backends are impacted by frontend load
- Helps identify bottlenecks in the system

**Expected Pattern During Load Test:**
```
Frontend load test starts:
  ↓
Auth Service: 50 req/s → 200 req/s  (Login/JWT validation)
Fleet Service: 20 req/s → 80 req/s   (Homepage shows vehicles)
Booking Service: 5 req/s → 20 req/s  (Not heavily used on homepage)
Payment Service: 2 req/s → 5 req/s   (Minimal homepage usage)
```

**Insights:**
- If **Auth** spikes heavily → Consider Auth HPA first
- If **Fleet** struggles → Fleet needs HPA
- Uneven distribution → Check frontend API call patterns

---

#### 5. **Backend Response Time (Average)** (Time Series Graph)

**What it shows:** Average response time in milliseconds

**Thresholds:**
- 🟢 Green: <500ms (Good)
- 🟡 Yellow: 500-1000ms (Acceptable)
- 🔴 Red: >1000ms (Poor user experience)

**Watch For:**
- **Gradual increase** → Service degrading under load
- **Sudden spike** → Service hit capacity limit
- **Stays low** → Service handling load well (no HPA needed yet)

**HPA Decision:**
```
Before Load:  100ms average
During Load:  800ms average
Interpretation: Service is degrading, needs scaling
```

---

#### 6. **Backend Response Time P95** (Time Series Graph)

**What it shows:** 95% of requests complete within this time

**Why P95 matters:**
- Average can hide problems
- P95 shows worst-case user experience
- Better indicator of system stress

**Example:**
```
Average: 500ms (looks OK)
P95:    2500ms (5% of users wait 2.5 seconds!)
Action: Need HPA to reduce P95
```

**HPA Goal:**
- Keep P95 under 1000ms (1 second)
- If P95 > 2x average → System is struggling

---

#### 7. **5xx Errors by Service** (Time Series Graph)

**What it shows:** Server errors per second

**Critical Indicator:**
- **Any 5xx errors** = System breaking point reached
- Time to scale is BEFORE errors appear

**Pattern:**
```
0-50 req/s:  No errors (Green zone)
50-100 req/s: No errors (Yellow zone - scaling recommended)
100+ req/s:  5xx errors start (Red zone - too late!)
```

**HPA Threshold Should Be Set BEFORE This Point!**

---

#### 8. **Pod Count by Service** (Time Series Graph)

**What it shows:** Number of running pods per service (static, pre-HPA)

**Current State (Pre-HPA):**
```
Frontend: 2 pods (static)
Auth:     2 pods (static)
Fleet:    2 pods (static)
Booking:  2 pods (static)
Payment:  2 pods (static)
```

**After HPA Implementation:**
- This graph will show pods scaling up/down
- Use to validate HPA is working

---

#### 9. **HPA Decision Table** (Table)

**What it shows:** Current CPU % by service, sorted by highest usage

**How to Use:**
```
Service          | CPU %
-----------------|-------
Frontend         | 85%    ← Needs HPA urgently
Auth Service     | 78%    ← Needs HPA soon
Fleet Service    | 45%    ← Healthy
Booking Service  | 30%    ← Healthy
Payment Service  | 25%    ← Healthy
```

**HPA Priority:**
1. Implement HPA for Frontend first (85%)
2. Then Auth (78%)
3. Monitor others

---

## How to Run Load Tests

### Option 1: Using k6 (Recommended)

**Install k6:**
```bash
# macOS
brew install k6

# Ubuntu/Debian
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows
choco install k6
```

**Create Load Test Script:**
```javascript
// loadtest-frontend.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

export default function () {
  // Get frontend URL (replace with your actual URL)
  const res = http.get('http://localhost:3000/');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

**Run the Test:**
```bash
# Port forward frontend if testing locally
kubectl port-forward -n exploresg svc/exploresg-frontend-service 3000:3000

# Run k6 load test
k6 run loadtest-frontend.js
```

---

### Option 2: Using Apache JMeter (GUI-based)

**Install JMeter:**
```bash
# macOS
brew install jmeter

# Linux/Windows - Download from:
# https://jmeter.apache.org/download_jmeter.cgi
```

**Configure Test Plan:**
1. Open JMeter
2. Add **Thread Group**:
   - Number of Threads: 100
   - Ramp-up Period: 60 seconds
   - Loop Count: Infinite
   - Duration: 600 seconds (10 minutes)
3. Add **HTTP Request**:
   - Server: `localhost` (or your frontend URL)
   - Port: 3000
   - Path: `/`
4. Add **Listeners**:
   - View Results Tree
   - Summary Report
   - Response Time Graph

**Run Test:**
- Click green "Start" button
- Monitor in Grafana simultaneously

---

### Option 3: Quick & Dirty - Apache Bench (ab)

**Simple Load Test:**
```bash
# Port forward frontend
kubectl port-forward -n exploresg svc/exploresg-frontend-service 3000:3000

# Run ab with 100 concurrent connections, 10000 total requests
ab -n 10000 -c 100 http://localhost:3000/

# For sustained load (run in background)
while true; do ab -n 1000 -c 50 http://localhost:3000/; sleep 1; done
```

---

## Analyzing Results for HPA

### Step-by-Step Analysis Workflow

#### **Phase 1: Baseline (No Load)**

1. Open dashboard
2. Set time range: Last 15 minutes
3. Record baseline metrics:

```
Baseline Metrics (No Load):
- Frontend CPU: _____%
- Frontend Memory: _____%
- Frontend Pods: _____
- Avg Response Time: _____ ms
- P95 Response Time: _____ ms
- Request Rate: _____ req/s
- Error Rate: _____%
```

#### **Phase 2: Low Load**

1. Start load test (50 virtual users)
2. Wait 5 minutes
3. Record metrics:

```
Low Load Metrics (50 users):
- Frontend CPU: _____%
- Frontend Memory: _____%
- Avg Response Time: _____ ms
- P95 Response Time: _____ ms
- Request Rate: _____ req/s
- Error Rate: _____%
- Any 5xx errors? YES / NO
```

#### **Phase 3: Medium Load**

1. Increase to 100 virtual users
2. Wait 5 minutes
3. Record metrics (same as above)

#### **Phase 4: High Load**

1. Increase to 200 virtual users
2. Wait 5 minutes
3. Record metrics
4. **Watch for:**
   - CPU hitting 80%+
   - Response time doubling
   - 5xx errors appearing

#### **Phase 5: Breaking Point**

1. Gradually increase load until:
   - CPU maxes out (90%+)
   - Errors appear
   - Response time > 2 seconds
2. **This is your breaking point!**

---

### HPA Configuration Decision Matrix

Based on your load test results, use this matrix:

| Observation | HPA Configuration |
|-------------|-------------------|
| **CPU hits 80% at 100 users** | Set HPA threshold: 70% CPU<br>Min replicas: 2<br>Max replicas: 6 |
| **Memory hits 80%** | Increase memory limits first<br>Don't use memory as HPA metric |
| **Response time doubles at 150 req/s** | Set HPA to scale before this (at ~75-80% CPU) |
| **5xx errors appear at 200 req/s** | HPA must scale before this point |
| **Frontend struggles but backends fine** | HPA on Frontend only initially |
| **Auth service degrades first** | Implement HPA on Auth first, then Frontend |

---

## Example Scenario

### Real Load Test Example

**Scenario:** Testing frontend homepage with gradual load increase

**Dashboard Observations:**

```
Time: 0-5 minutes (Baseline)
- Frontend CPU: 15%
- Frontend Memory: 35%
- Frontend Pods: 2
- Request Rate: 10 req/s
- Avg Response: 120ms
- P95 Response: 180ms
- Errors: 0

Time: 5-10 minutes (50 users added)
- Frontend CPU: 42%  ← Increasing
- Frontend Memory: 38%
- Frontend Pods: 2
- Request Rate: 85 req/s
- Avg Response: 250ms  ← Degrading
- P95 Response: 420ms
- Errors: 0

Time: 10-15 minutes (100 users total)
- Frontend CPU: 78%  ← ⚠️ High!
- Frontend Memory: 40%
- Frontend Pods: 2
- Request Rate: 165 req/s
- Avg Response: 580ms  ← Degrading significantly
- P95 Response: 950ms
- Errors: 0

Time: 15-20 minutes (150 users total)
- Frontend CPU: 94%  ← 🔴 Maxed out!
- Frontend Memory: 42%
- Frontend Pods: 2
- Request Rate: 220 req/s
- Avg Response: 1250ms  ← Unacceptable
- P95 Response: 2800ms  ← 🔴 Very poor
- Errors: 12 (5xx)  ← 🔴 System breaking!
```

### HPA Decision Based on Results

**Analysis:**
- System is **stable until 100 users**
- CPU reaches **78%** at comfortable load (100 users, 165 req/s)
- System **breaks** at 150 users (94% CPU, errors appear)

**HPA Configuration:**

```yaml
# k8s/exploresg-frontend-service/hpa.yaml
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
  minReplicas: 2
  maxReplicas: 6
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Scale BEFORE hitting 78%
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300  # Wait 5 min before scaling down
      policies:
      - type: Pods
        value: 1
        periodSeconds: 60
```

**Rationale:**
- **70% threshold:** Scales before reaching 78% stress point
- **Min 2 replicas:** Baseline from current deployment
- **Max 6 replicas:** 3x capacity = handles 3x load (450 req/s)
- **Fast scale-up:** Respond quickly to traffic spikes
- **Slow scale-down:** Avoid thrashing

---

## Troubleshooting

### Dashboard Shows "No Data"

**Check 1: Is Prometheus scraping?**
```bash
# Check Prometheus targets
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090

# Open: http://localhost:9090/targets
# Look for: exploresg-* targets
# Status should be: UP
```

**Check 2: Are ServiceMonitors applied?**
```bash
kubectl get servicemonitor -n exploresg
```

Should show:
- exploresg-auth-service
- exploresg-fleet-service
- exploresg-booking-service
- exploresg-payment-service

**Check 3: Are pods running?**
```bash
kubectl get pods -n exploresg
```

---

### Frontend Metrics Missing

**Frontend only has Kubernetes-level metrics** (CPU, Memory, Network)

**Expected:** No HTTP request metrics from frontend
**Reason:** React app served by Nginx, no Prometheus metrics endpoint

**Backend metrics are available** for all Spring Boot services

---

### Inconsistent CPU Readings

**Issue:** CPU % shows different values in different panels

**Explanation:**
- **Gauge (top):** Average across all pods, right now
- **Graph (middle):** Per-pod CPU usage over time
- **Table (bottom):** Instant snapshot

**All are correct,** just different views!

---

### HPA Table Empty

**Reason:** Query might be too specific

**Fix:** Check time range
- Dashboard default: Last 15 minutes
- If no recent activity → Extend to Last 1 hour

---

## Next Steps

### After Load Testing

1. ✅ **Save Dashboard Snapshot**
   - Settings → Save As... → "Pre-HPA Baseline - [Date]"

2. ✅ **Document Results**
   - Create a file: `docs/LOAD_TEST_RESULTS.md`
   - Include screenshots
   - Note breaking points

3. ✅ **Implement HPA**
   - Use findings to configure HPA
   - See: `docs/HPA_IMPLEMENTATION_GUIDE.md` (to be created)

4. ✅ **Re-test After HPA**
   - Run same load tests
   - Use same dashboard
   - Compare pod count scaling
   - Validate response times improve

5. ✅ **Continuous Monitoring**
   - Use this dashboard regularly
   - Run monthly load tests
   - Adjust HPA as traffic patterns change

---

## Additional Resources

### Related Dashboards

- **ExploreSG Production - Complete Overview** - Daily monitoring
- **ExploreSG - Pod Health & Restarts** - Infrastructure health
- **ExploreSG - Database Connections** - Database performance

### Documentation

- **Prometheus Query Language (PromQL):**  
  https://prometheus.io/docs/prometheus/latest/querying/basics/

- **Kubernetes HPA:**  
  https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/

- **k6 Load Testing:**  
  https://k6.io/docs/

### Tools

- **k6:** https://k6.io/
- **Apache JMeter:** https://jmeter.apache.org/
- **Locust:** https://locust.io/
- **Grafana k6 Cloud:** https://grafana.com/products/cloud/k6/

---

## Summary

### What You Now Have:

✅ **Dedicated Load Testing Dashboard** - Pre-HPA baseline monitoring  
✅ **All Metrics Available** - Using existing setup (no config changes!)  
✅ **Frontend Monitoring** - CPU, Memory, Network, Pod count  
✅ **Backend Impact Visibility** - See how frontend load affects backends  
✅ **HPA Planning Data** - Clear thresholds for autoscaling  
✅ **Comparison Baseline** - Validate HPA effectiveness later  

### Key Takeaways:

- 🎯 Run load tests **before** implementing HPA
- 📊 Use this dashboard to establish baselines
- 🔍 Identify bottlenecks (which services need HPA first)
- ⚙️ Set HPA thresholds based on data, not guesses
- ✅ Re-test after HPA to validate improvements

---

**Happy Load Testing! 🚀📊**

**Questions or issues?** Check the troubleshooting section or review the dashboard guide embedded in the dashboard itself.

---

**Last Updated:** October 20, 2025  
**Dashboard Version:** v1.0  
**Compatible With:** Kubernetes 1.28+, Prometheus Operator, kube-prometheus-stack
