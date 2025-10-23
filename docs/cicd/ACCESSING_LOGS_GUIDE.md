# 🔍 How to Access Logs - Quick Guide

**TL;DR:** All logs are in **Grafana** - no separate tool needed!

---

## 🌐 Access Grafana

### **Production URL (Recommended):**
**https://grafana.tools.xplore.town**

### **Local Access (Alternative):**
```bash
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80
# Then open: http://localhost:3001
```

### **Login:**
- Username: `admin`
- Password: `prom-operator`

---

## 📊 Method 1: Explore (Best for Troubleshooting)

### **Step-by-Step:**

1. **Open Grafana** → Click **🧭 Explore** (compass icon in left sidebar)

2. **Select Loki datasource** (dropdown at top)

3. **Enter a query:**
   ```logql
   {namespace="exploresg"}
   ```

4. **Click Run Query** (or press Shift+Enter)

5. **View Results:**
   - Log lines appear in chronological order
   - Click any line to see **full details**
   - Colored by log level (red = error, yellow = warn)

### **What You'll See:**
```
┌─────────────────────────────────────────────────────────┐
│ Time: 2025-10-18 07:30:45                               │
│ Labels:                                                  │
│   namespace: exploresg                                   │
│   pod: exploresg-payment-service-6d4f7fd44d-j5tdq       │
│   container: payment-service                             │
│   app: exploresg-payment-service                         │
│                                                          │
│ Log Message:                                             │
│ Started PaymentServiceApplication in 19.899 seconds     │
└─────────────────────────────────────────────────────────┘
```

### **Common Queries:**

```logql
# All logs from payment service
{namespace="exploresg", app="exploresg-payment-service"}

# Error logs only
{namespace="exploresg"} |= "ERROR"

# Logs from specific pod
{pod="exploresg-payment-service-6d4f7fd44d-j5tdq"}

# Exclude health checks
{namespace="exploresg"} != "actuator/health"

# HTTP 5xx errors
{namespace="exploresg"} |~ "HTTP/1.1\" 5\\d\\d"

# Slow requests (>1000ms)
{namespace="exploresg"} |= "Completed" | regexp "in (?P<duration>\\d+)ms" | duration > 1000
```

---

## 📈 Method 2: Dashboard (Best for Monitoring)

### **Step-by-Step:**

1. **Open Grafana** → Click **📊 Dashboards** → **Browse**

2. **Find Dashboard:**
   - Search for: "ExploreSG Application Logs"
   - Or look in "exploresg" tag

3. **View Pre-built Panels:**
   - **All ExploreSG Logs** - Real-time log stream
   - **Errors & Warnings** - Filtered error view
   - **Auth Service Logs** - Auth-specific logs
   - **Fleet Service Logs** - Fleet-specific logs
   - **Payment Service Logs** - Payment-specific logs
   - **Log Rate by Service** - Volume graphs
   - **Error Rate by Service** - Error trends

4. **Interact with Logs:**
   - Click any log line to expand
   - Use time picker to change range
   - Auto-refreshes every 10 seconds

---

## 🔎 Detailed Log View Features

When you **click on a log entry**, you get:

### **1. Full Message**
```
Started PaymentServiceApplication in 19.899 seconds (process running for 20.571)
```

### **2. All Labels**
```
namespace: exploresg
pod: exploresg-payment-service-6d4f7fd44d-j5tdq
container: payment-service
app: exploresg-payment-service
service: exploresg-payment-service
node: node-1
stream: stdout
```

### **3. Action Buttons**
- **📋 Copy** - Copy log text to clipboard
- **🔍 Show Context** - See logs before/after this entry
- **🏷️ Filter for** - Add label to current query
- **🚫 Filter out** - Exclude this label from query
- **📊 Add to dashboard** - Create panel from query

### **4. Parsed Fields**
If your logs are structured (JSON), you'll see:
```json
{
  "timestamp": "2025-10-18T07:30:45.123Z",
  "level": "INFO",
  "message": "Payment processed successfully",
  "userId": "user123",
  "amount": 50.00,
  "transactionId": "txn_abc123"
}
```

---

## 🎯 Real-World Examples

### **Example 1: Debug a Failed Payment**

**Goal:** Find why payment failed for user `user123`

**Steps:**
1. Go to Explore
2. Query:
   ```logql
   {namespace="exploresg", app="exploresg-payment-service"} |= "user123"
   ```
3. Click on error logs
4. Check full stack trace in details
5. Use "Show Context" to see what happened before/after

### **Example 2: Monitor Service Health**

**Goal:** Watch for errors across all services

**Steps:**
1. Go to Dashboard: "ExploreSG Application Logs"
2. Look at "Errors & Warnings" panel
3. Click any error to investigate
4. Check "Error Rate by Service" graph to identify problematic service

### **Example 3: Trace a Request**

**Goal:** Follow a request through multiple services

**Steps:**
1. Find initial request log with trace ID
2. Copy trace ID
3. Query:
   ```logql
   {namespace="exploresg"} |= "traceId_xyz123"
   ```
4. See logs from Auth → Fleet → Payment in chronological order

---

## 🎨 Customize Your View

### **Change Time Range:**
- Top-right corner: "Last 1 hour" dropdown
- Options: Last 5m, 15m, 1h, 3h, 6h, 12h, 24h, 7d
- Custom: Pick exact start/end times

### **Auto-Refresh:**
- Top-right: Refresh dropdown
- Options: Off, 5s, 10s, 30s, 1m, 5m
- Useful for live monitoring

### **Split View:**
- Click "Split" button
- Run different queries side-by-side
- Compare logs from different services

### **Dark/Light Mode:**
- Click profile icon (bottom-left)
- Preferences → UI Theme

---

## 🚨 Alerting from Logs

You can create alerts based on log patterns!

### **Example: Alert on High Error Rate**

1. Go to **Alerting** → **Alert rules**
2. Click **New alert rule**
3. Configure:
   - **Datasource:** Loki
   - **Query:**
     ```logql
     sum(rate({namespace="exploresg"} |= "ERROR" [5m]))
     ```
   - **Condition:** Is above 10 (errors per second)
   - **For:** 5 minutes
4. Add notification channel (email, Slack, etc.)

---

## 💡 Pro Tips

### **1. Use Label Filters First**
```logql
# ✅ Good - Fast (uses index)
{namespace="exploresg", app="exploresg-payment-service"} |= "ERROR"

# ❌ Slow - No index
{namespace="exploresg"} |= "payment" |= "ERROR"
```

### **2. Limit Results**
```logql
# Add limit to speed up query
{namespace="exploresg"} | limit 100
```

### **3. Use Regex for Patterns**
```logql
# Find errors OR warnings OR failures
{namespace="exploresg"} |~ "(?i)(error|warning|failed)"
```

### **4. Aggregate for Metrics**
```logql
# Turn logs into metrics
rate({namespace="exploresg"} |= "ERROR" [5m])
```

### **5. Parse Structured Logs**
```logql
# Extract JSON fields
{namespace="exploresg"} | json | level="ERROR" | user_id="123"
```

---

## 📱 Mobile Access

Grafana works great on mobile browsers!

1. Open https://grafana.tools.xplore.town on your phone
2. Login with same credentials
3. View dashboards and logs on the go
4. Get push notifications (if configured)

---

## 🔧 Troubleshooting

### **Problem: No logs showing**

**Check:**
```bash
# Verify Loki is running
kubectl get pods -n monitoring -l app.kubernetes.io/name=loki

# Check Promtail is collecting
kubectl logs -n monitoring -l app.kubernetes.io/name=promtail --tail=50

# Test Loki directly
curl https://loki.tools.xplore.town/ready
```

### **Problem: Can't see recent logs**

**Solution:**
- Check time range (top-right)
- Verify auto-refresh is on
- Try query: `{namespace="exploresg"}` with "Last 5 minutes"

### **Problem: Logs are truncated**

**Solution:**
- Click the log line to see full message
- Or adjust max lines in datasource settings:
  - Configuration → Data Sources → Loki
  - Set "Max lines" to higher value (default: 1000)

---

## 📚 Learn More

### **LogQL Documentation:**
https://grafana.com/docs/loki/latest/logql/

### **Video Tutorials:**
- Grafana Loki Tutorial: https://www.youtube.com/watch?v=h_GGd7HfKQ8
- LogQL Basics: https://www.youtube.com/watch?v=D8VHZ3HG5iY

### **Interactive Tutorial:**
In Grafana → Help → Loki Tutorial

---

## ✅ Quick Access Checklist

- [ ] Bookmark: https://grafana.tools.xplore.town
- [ ] Save login credentials
- [ ] Try Explore with: `{namespace="exploresg"}`
- [ ] Open "ExploreSG Application Logs" dashboard
- [ ] Click on a log entry to see details
- [ ] Try filtering by error: `|= "ERROR"`
- [ ] Create a custom dashboard panel
- [ ] Set up your first log alert

---

## 🎉 You're Ready!

**Remember:**
- ✅ Logs are in **Grafana** (no separate tool)
- ✅ Use **Explore** for ad-hoc queries
- ✅ Use **Dashboards** for monitoring
- ✅ Click log lines to see **full details**
- ✅ All data is persistent (7 days retention)

**Need help?** Check `k8s/monitoring/LOKI_SETUP.md` for detailed guide.

---

**Happy Log Hunting! 🔍📊**
