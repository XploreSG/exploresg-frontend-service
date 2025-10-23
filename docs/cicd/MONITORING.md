# Monitoring Setup Guide

Complete guide to setting up Prometheus and Grafana monitoring for ExploreSG Cloud.

---

## Prerequisites

- Minikube cluster running
- Helm installed
- kubectl configured

---

## Step 1: Install Helm (if not already installed)

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
rm get_helm.sh
helm version
```

---

## Step 2: Add Helm Repositories

```bash
# Add Prometheus Community repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Update repositories
helm repo update

# Verify
helm repo list
```

---

## Step 3: Create Monitoring Namespace

```bash
kubectl create namespace monitoring
```

---

## Step 4: Install Prometheus Stack

This installs Prometheus, Grafana, Alertmanager, and all exporters:

```bash
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set prometheus.prometheusSpec.retention=7d \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=10Gi
```

Wait for pods to be ready (2-3 minutes):
```bash
kubectl get pods -n monitoring -w
```

---

## Step 5: Port Forward Monitoring Tools

### Grafana
```bash
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80
```

Access: http://localhost:3001
- **Username:** admin
- **Password:** prom-operator

### Prometheus
```bash
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
```

Access: http://localhost:9090

---

## Step 6: Configure Dashboards

### Pre-installed Dashboards

Grafana comes with these dashboards:
- **Kubernetes / Compute Resources / Cluster**
- **Kubernetes / Compute Resources / Namespace (Pods)**
- **Node Exporter / Nodes**

Access them: Dashboards → Browse

### Import Custom Dashboards

1. Go to Dashboards → Import
2. Enter dashboard ID or paste JSON
3. Select Prometheus data source
4. Click Import

**Recommended Dashboard IDs:**
- **3119** - Kubernetes Cluster Monitoring
- **1860** - Node Exporter Full
- **6417** - Kubernetes Deployment Statefulset Daemonset metrics

---

## Step 7: Setup Application Metrics

### Enable ServiceMonitor for Auth Service

ServiceMonitor is already configured in:
- `k8s/exploresg-auth-service/servicemonitor.yaml`

Apply it:
```bash
kubectl apply -f k8s/exploresg-auth-service/servicemonitor.yaml
```

Verify Prometheus is scraping:
1. Open Prometheus: http://localhost:9090
2. Go to Status → Targets
3. Look for `exploresg-auth-service` target

---

## Step 8: Setup Alerts (Optional)

### View Default Alerts

Prometheus comes with default Kubernetes alerts.

View them in Prometheus:
- Alerts → View all alerts

### Create Custom Alert

Create file `k8s/monitoring/custom-alerts.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: custom-alerts
  namespace: monitoring
data:
  custom-alerts.yaml: |
    groups:
      - name: exploresg
        interval: 30s
        rules:
          - alert: PodDown
            expr: up{namespace="exploresg"} == 0
            for: 1m
            labels:
              severity: critical
            annotations:
              summary: "Pod {{ $labels.pod }} is down"
```

Apply:
```bash
kubectl apply -f k8s/monitoring/custom-alerts.yaml
```

---

## Monitoring Commands

### Check Prometheus Status
```bash
kubectl get pods -n monitoring
kubectl logs -n monitoring prometheus-kube-prometheus-prometheus-0
```

### Check Grafana Status
```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=grafana
```

### Get Grafana Admin Password
```bash
kubectl get secret -n monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d && echo
```

### Restart Monitoring Stack
```bash
kubectl rollout restart statefulset -n monitoring
kubectl rollout restart deployment -n monitoring
```

---

## Troubleshooting

### Prometheus not scraping targets?

Check ServiceMonitor:
```bash
kubectl get servicemonitor -n exploresg
kubectl describe servicemonitor -n exploresg exploresg-auth-service
```

### Grafana not showing data?

1. Check Prometheus data source configuration
2. Verify Prometheus is running: `kubectl get pods -n monitoring`
3. Check Prometheus logs

### Out of storage?

Increase retention or storage:
```bash
helm upgrade prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.retention=3d \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=20Gi
```

---

## Uninstall Monitoring

```bash
helm uninstall prometheus -n monitoring
kubectl delete namespace monitoring
```

---

## Summary

✅ Prometheus installed and running  
✅ Grafana accessible with dashboards  
✅ Metrics being collected  
✅ Alerts configured  

Your monitoring stack is ready! 📊

---

**Last Updated:** October 14, 2025
