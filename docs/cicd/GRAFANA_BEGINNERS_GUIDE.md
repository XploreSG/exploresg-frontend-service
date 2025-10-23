# 📊 Grafana for Dummies - Complete Beginner's Guide

**Last Updated:** October 14, 2025  
**For:** ExploreSG Cloud Monitoring Stack

---

## Table of Contents

1. [What is Grafana?](#what-is-grafana)
2. [First Time Setup](#first-time-setup)
3. [Understanding the Interface](#understanding-the-interface)
4. [Your First Dashboard](#your-first-dashboard)
5. [Monitoring Your Applications](#monitoring-your-applications)
6. [Common Queries for Spring Boot Apps](#common-queries-for-spring-boot-apps)
7. [Setting Up Alerts](#setting-up-alerts)
8. [Troubleshooting](#troubleshooting)

---

## What is Grafana?

Think of Grafana as your **visual dashboard** for monitoring:

```
┌─────────────────────────────────────────────────┐
│  Prometheus = Data Collector & Storage          │
│  (Technical, raw metrics)                       │
└────────────────┬────────────────────────────────┘
                 │
                 │ Grafana queries this
                 ▼
┌─────────────────────────────────────────────────┐
│  Grafana = Pretty Visualization Layer           │
│  (Dashboards, graphs, easy to understand)       │
└─────────────────────────────────────────────────┘
```

**In simple terms:**
- Prometheus = Excel spreadsheet with raw data
- Grafana = Beautiful PowerPoint presentation of that data

---

## First Time Setup

### Step 1: Access Grafana

```bash
# If not already running, start port-forward
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80
```

**Open in browser:** http://localhost:3001

### Step 2: Login

**Default Credentials:**
- **Username:** `admin`
- **Password:** `prom-operator`

⚠️ **Important:** Change this password after first login!

### Step 3: Change Password (Recommended)

1. Click on profile icon (bottom-left)
2. Click **"Profile"**
3. Click **"Change Password"**
4. Set a new secure password

---

## Understanding the Interface

### Main Navigation (Left Sidebar)

```
🏠 Home           → Main landing page
🔍 Search         → Find dashboards
📊 Dashboards     → Browse all dashboards
📈 Explore        → Ad-hoc queries (like Prometheus)
🔔 Alerting       → Manage alerts
⚙️  Configuration → Data sources, plugins, settings
👤 Admin          → User management (if admin)
```

### Top Bar

```
⏰ Time Range Picker  → Select time period (Last 1h, Last 24h, etc.)
🔄 Refresh           → Auto-refresh interval
⭐ Star              → Favorite this dashboard
⚙️  Settings         → Dashboard settings
💾 Save              → Save dashboard changes
```

---

## Your First Dashboard

### Option A: Use Pre-Built Dashboards (Easiest)

Your Prometheus Helm chart comes with **pre-built Kubernetes dashboards**!

#### 1. Click **"Dashboards"** (left sidebar)
#### 2. Click **"Browse"**
#### 3. Look for these folders:

**General:**
- `General` → Default dashboards

**Kubernetes Dashboards:**
- Look for these pre-installed dashboards:
  - **Kubernetes / Compute Resources / Cluster**
  - **Kubernetes / Compute Resources / Namespace (Pods)**
  - **Kubernetes / Compute Resources / Namespace (Workloads)**
  - **Node Exporter / Nodes**

#### 4. Click on **"Kubernetes / Compute Resources / Namespace (Pods)"**

#### 5. At the top, select:
- **Datasource:** Prometheus
- **Namespace:** `exploresg` (your applications!)

**🎉 You're now seeing your applications' metrics!**

---

### What You'll See in the Dashboard:

**Common Panels:**

| Panel Name | What It Shows | Why It Matters |
|------------|---------------|----------------|
| **CPU Usage** | How much CPU your pods use | High = might need scaling |
| **Memory Usage** | RAM consumption | High = possible memory leak |
| **Network I/O** | Data sent/received | High = lots of traffic |
| **Pod Restarts** | How many times pods crashed | High = stability issues |

---

## Monitoring Your Applications

### Current Setup Status:

| Service | Health Endpoints | Metrics Endpoint | Status |
|---------|------------------|------------------|--------|
| **auth-service** | ✅ `/actuator/health/liveness`<br>✅ `/actuator/health/readiness` | ⚠️ `/actuator/prometheus` | Partially Ready |
| **fleet-service** | ❌ Not yet added | ❌ Not yet added | Not Ready |
| **frontend-service** | ❌ N/A (React app) | ❌ Not yet added | Not Ready |

### What This Means:

**auth-service:**
- ✅ Kubernetes health checks are configured (liveness/readiness probes)
- ⚠️ Application metrics need to be exposed and scraped by Prometheus
- 📝 Need to configure ServiceMonitor (see below)

---

## Setting Up Application Metrics

### Step 1: Verify Spring Boot Actuator is Configured

Your `auth-service` should have this in `application.yml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,prometheus
      base-path: /actuator
  endpoint:
    health:
      probes:
        enabled: true
      show-details: always
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
  metrics:
    export:
      prometheus:
        enabled: true
```

### Step 2: Create ServiceMonitor for Prometheus

This tells Prometheus to scrape metrics from your auth-service:

```yaml
# k8s/exploresg-auth-service/servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: exploresg-auth-service
  namespace: exploresg
  labels:
    app: exploresg-auth-service
    release: prometheus  # Important! Matches Prometheus selector
spec:
  selector:
    matchLabels:
      app: exploresg-auth-service
  endpoints:
  - port: http
    path: /actuator/prometheus
    interval: 30s
```

### Step 3: Ensure Service has Correct Labels

Your service needs to match the ServiceMonitor selector:

```yaml
# k8s/exploresg-auth-service/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: exploresg-auth-service
  namespace: exploresg
  labels:
    app: exploresg-auth-service  # Must match ServiceMonitor selector
spec:
  selector:
    app: exploresg-auth-service
  ports:
  - name: http  # Named port for ServiceMonitor
    port: 8080
    targetPort: 8080
```

### Step 4: Apply and Verify

```bash
# Apply ServiceMonitor
kubectl apply -f k8s/exploresg-auth-service/servicemonitor.yaml

# Wait 30 seconds for Prometheus to discover it

# Check if Prometheus found your service
# Go to Prometheus: http://localhost:9090
# Status → Targets
# Look for "exploresg-auth-service"
```

---

## Common Queries for Spring Boot Apps

Once your ServiceMonitor is working, try these queries in Grafana:

### How to Run a Query:

1. Click **"Explore"** (left sidebar)
2. Select **"Prometheus"** as data source
3. Paste query below
4. Click **"Run query"**

### Useful Queries:

#### **1. HTTP Request Rate**
```promql
rate(http_server_requests_seconds_count{namespace="exploresg", service="exploresg-auth-service"}[5m])
```
**Shows:** Requests per second

---

#### **2. HTTP Request Duration (95th percentile)**
```promql
histogram_quantile(0.95, 
  rate(http_server_requests_seconds_bucket{namespace="exploresg", service="exploresg-auth-service"}[5m])
)
```
**Shows:** How long requests take (95% of requests)

---

#### **3. JVM Memory Usage**
```promql
jvm_memory_used_bytes{namespace="exploresg", service="exploresg-auth-service"}
```
**Shows:** Java memory consumption

---

#### **4. JVM Heap Usage Percentage**
```promql
(jvm_memory_used_bytes{area="heap", namespace="exploresg"} / jvm_memory_max_bytes{area="heap", namespace="exploresg"}) * 100
```
**Shows:** % of heap memory used

---

#### **5. Thread Count**
```promql
jvm_threads_live_threads{namespace="exploresg", service="exploresg-auth-service"}
```
**Shows:** Number of active threads

---

#### **6. Database Connection Pool**
```promql
hikaricp_connections_active{namespace="exploresg"}
```
**Shows:** Active DB connections (if using HikariCP)

---

#### **7. Error Rate (5xx responses)**
```promql
rate(http_server_requests_seconds_count{namespace="exploresg", status=~"5.."}[5m])
```
**Shows:** Server errors per second

---

#### **8. Pod CPU Usage**
```promql
rate(container_cpu_usage_seconds_total{namespace="exploresg", pod=~"exploresg-auth-service.*"}[5m])
```
**Shows:** CPU usage by pod

---

#### **9. Pod Memory Usage**
```promql
container_memory_usage_bytes{namespace="exploresg", pod=~"exploresg-auth-service.*"}
```
**Shows:** Memory usage by pod

---

#### **10. Pod Restart Count**
```promql
kube_pod_container_status_restarts_total{namespace="exploresg", pod=~"exploresg-auth-service.*"}
```
**Shows:** How many times pods restarted

---

## Creating Your First Custom Dashboard

### Step 1: Create New Dashboard

1. Click **"Dashboards"** → **"+ New"** → **"New Dashboard"**
2. Click **"Add visualization"**
3. Select **"Prometheus"** as data source

### Step 2: Add a Panel

**Example: Auth Service Request Rate**

1. In the query box, paste:
```promql
rate(http_server_requests_seconds_count{namespace="exploresg", service="exploresg-auth-service"}[5m])
```

2. **Panel Options** (right side):
   - **Title:** "Auth Service - Requests per Second"
   - **Description:** "HTTP request rate over 5 minutes"

3. **Graph Type:**
   - Choose **"Time series"** (default)
   - Or **"Stat"** for single number
   - Or **"Gauge"** for percentage

4. Click **"Apply"** (top-right)

### Step 3: Add More Panels

Click **"Add"** → **"Visualization"** to add more panels

**Suggested panels for a Spring Boot dashboard:**

| Panel | Query | Visualization |
|-------|-------|---------------|
| Request Rate | `rate(http_server_requests_seconds_count[5m])` | Time series |
| Response Time (p95) | `histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))` | Time series |
| Error Rate | `rate(http_server_requests_seconds_count{status=~"5.."}[5m])` | Time series |
| JVM Heap Usage | `(jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"}) * 100` | Gauge |
| Active Threads | `jvm_threads_live_threads` | Stat |
| DB Connections | `hikaricp_connections_active` | Stat |

### Step 4: Save Dashboard

1. Click **💾 "Save"** (top-right)
2. Enter name: "Auth Service Monitoring"
3. Click **"Save"**

---

## Setting Up Alerts

### Step 1: Create Alert Rule

1. Open your dashboard
2. Click on a panel → **"Edit"**
3. Click **"Alert"** tab
4. Click **"Create alert rule from this panel"**

### Step 2: Define Alert Conditions

**Example: Alert when error rate is high**

**Alert Rule:**
```
Alert name: High Error Rate - Auth Service

Condition:
  WHEN avg() OF query(A, 5m, now) IS ABOVE 0.01

Query A:
  rate(http_server_requests_seconds_count{namespace="exploresg", status=~"5..", service="exploresg-auth-service"}[5m])

Evaluation:
  For: 5m
  
Labels:
  severity: warning
  service: auth-service
  
Annotations:
  Summary: Auth service is experiencing high error rate
  Description: Error rate is {{ $value }} errors/sec
```

### Step 3: Configure Notification Channel (Optional)

1. Go to **"Alerting"** → **"Contact points"**
2. Click **"+ New contact point"**
3. Choose integration:
   - Email
   - Slack
   - PagerDuty
   - Webhook
   - etc.

---

## Common Use Cases

### 📈 Daily Monitoring Routine

**Morning Check:**
```
1. Open Grafana
2. Check "Kubernetes / Compute Resources / Namespace (Pods)"
3. Select namespace: exploresg
4. Look for:
   - ✅ All pods green/healthy
   - ✅ CPU/Memory within normal range
   - ✅ No restarts
```

### 🔥 Investigating Performance Issues

**"App is slow!" - What to check:**

1. **Request Duration:**
```promql
histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))
```
*Is p95 latency high?*

2. **CPU Usage:**
```promql
rate(container_cpu_usage_seconds_total{namespace="exploresg"}[5m])
```
*CPU maxed out?*

3. **Memory:**
```promql
container_memory_usage_bytes{namespace="exploresg"}
```
*Memory leak?*

4. **Database Connections:**
```promql
hikaricp_connections_active
```
*Connection pool exhausted?*

### 🚨 Troubleshooting Crashes

**"Pod keeps restarting!" - What to check:**

1. **Restart Count:**
```promql
kube_pod_container_status_restarts_total{namespace="exploresg"}
```

2. **Memory Usage Before Crash:**
```promql
container_memory_usage_bytes{namespace="exploresg"}
```
*OOMKilled (Out of Memory)?*

3. **Check Liveness Probe Failures:**
Go to Kubernetes dashboard in Grafana

---

## Grafana Best Practices

### Dashboard Organization

```
✅ Do This:
- One dashboard per service/team
- Group related metrics together
- Use descriptive panel titles
- Add descriptions to complex queries

❌ Don't Do This:
- 50 panels on one dashboard (too cluttered)
- Generic titles like "Panel 1"
- Mix unrelated services
```

### Time Ranges

| Use Case | Time Range |
|----------|------------|
| Real-time monitoring | Last 15m, auto-refresh 30s |
| Incident investigation | Last 1h or 3h |
| Trend analysis | Last 7d or 30d |
| Capacity planning | Last 90d |

### Panel Colors

```
Green  → Good (CPU < 70%, success rate)
Yellow → Warning (CPU 70-85%, slow responses)
Red    → Critical (CPU > 85%, errors, downtime)
```

---

## Quick Reference

### Essential Shortcuts

| Shortcut | Action |
|----------|--------|
| `d` → `d` | Go to dashboard |
| `d` → `s` | Save dashboard |
| `e` | Edit panel |
| `v` | View panel fullscreen |
| `Ctrl/Cmd + S` | Save dashboard |
| `Esc` | Exit fullscreen |
| `?` | Show all shortcuts |

### Common PromQL Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `rate()` | Per-second rate | `rate(requests[5m])` |
| `increase()` | Total increase | `increase(requests[1h])` |
| `sum()` | Add values | `sum(cpu_usage)` |
| `avg()` | Average | `avg(response_time)` |
| `max()` | Maximum | `max(memory_usage)` |
| `histogram_quantile()` | Percentile | `histogram_quantile(0.95, ...)` |

---

## Troubleshooting

### "No data" in dashboard

**Check:**
1. ✅ Is Prometheus running? `kubectl get pods -n monitoring`
2. ✅ Is ServiceMonitor created? `kubectl get servicemonitor -n exploresg`
3. ✅ Is Prometheus scraping? Check Status → Targets in Prometheus UI
4. ✅ Is time range correct? Try "Last 1 hour"
5. ✅ Are metrics exposed? `curl http://localhost:8080/actuator/prometheus`

### "Query returned too much data"

**Solution:**
- Add more specific labels to query
- Reduce time range
- Use aggregation (sum, avg, max)

**Example:**
```promql
# ❌ Too broad
container_memory_usage_bytes

# ✅ More specific
container_memory_usage_bytes{namespace="exploresg", pod=~"exploresg-auth.*"}
```

### Dashboard not updating

**Solutions:**
1. Check auto-refresh is enabled (top-right)
2. Click 🔄 refresh icon
3. Hard refresh browser (Ctrl+Shift+R)
4. Check Prometheus is receiving new data

---

## Next Steps

### For auth-service (Current Priority):

1. ✅ Create ServiceMonitor
```bash
kubectl apply -f k8s/exploresg-auth-service/servicemonitor.yaml
```

2. ✅ Verify in Prometheus
- Go to http://localhost:9090
- Status → Targets
- Find `exploresg-auth-service`

3. ✅ Create Custom Dashboard
- Use queries from "Common Queries" section
- Add panels for request rate, latency, errors

### For fleet-service (Next):

1. Add Spring Boot Actuator endpoints
2. Update Kubernetes deployment with health probes
3. Create ServiceMonitor
4. Create Grafana dashboard

### For frontend-service (Later):

Frontend (React) metrics are different:
- Use client-side monitoring (e.g., Sentry, LogRocket)
- Or add custom metrics endpoint
- Or monitor via reverse proxy (Nginx metrics)

---

## Additional Resources

### Official Documentation

- **Grafana Docs:** https://grafana.com/docs/grafana/latest/
- **Prometheus Docs:** https://prometheus.io/docs/
- **PromQL Guide:** https://prometheus.io/docs/prometheus/latest/querying/basics/

### Grafana Dashboards (Import Ready-Made)

- **Grafana Dashboard Library:** https://grafana.com/grafana/dashboards/
- **Spring Boot Dashboard:** #12900 (JVM Micrometer)
- **Kubernetes Cluster:** #7249
- **Node Exporter:** #1860

**How to Import:**
1. Dashboards → New → Import
2. Enter dashboard ID (e.g., 12900)
3. Select Prometheus data source
4. Click "Import"

---

## Summary

**You Now Know:**
- ✅ What Grafana is and why it's useful
- ✅ How to navigate the Grafana interface
- ✅ How to use pre-built Kubernetes dashboards
- ✅ How to set up metrics for Spring Boot apps
- ✅ Common queries for monitoring your applications
- ✅ How to create custom dashboards
- ✅ How to set up alerts

**Your Setup Status:**
- ✅ Prometheus installed and scraping
- ✅ Grafana installed and accessible
- ⚠️ auth-service: Health checks configured, metrics pending ServiceMonitor
- ❌ fleet-service: Not yet configured
- ❌ frontend-service: Not yet configured

**Next Action:**
Create ServiceMonitor for auth-service to start seeing application metrics!

---

**Questions?** Open an issue or check the troubleshooting section!

**Happy Monitoring! 📊🚀**
