# Horizontal Pod Autoscaler (HPA) Implementation Guide

## 📋 Overview

This guide covers the implementation of Horizontal Pod Autoscaler (HPA) for the ExploreSG microservices platform on DigitalOcean Kubernetes.

## 🎯 What is HPA?

Horizontal Pod Autoscaler automatically scales the number of pods in a deployment based on observed metrics such as:
- CPU utilization
- Memory utilization
- Custom metrics (requests per second, queue length, etc.)

## 🏗️ Architecture

### HPA Components
```
┌─────────────────────────────────────────────────────────────┐
│                     Metrics Server                          │
│         (Collects CPU/Memory metrics from pods)             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 HPA Controller                              │
│   - Monitors metrics every 15s (default)                    │
│   - Calculates desired replicas                            │
│   - Updates Deployment replica count                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Deployment Controllers                         │
│   - Auth Service    (1-5 replicas)                         │
│   - Fleet Service   (1-5 replicas)                         │
│   - Booking Service (2-10 replicas)                        │
│   - Payment Service (2-8 replicas)                         │
│   - Frontend        (2-10 replicas)                        │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Scaling Strategy by Service

### Auth Service
- **Min Replicas**: 1
- **Max Replicas**: 5
- **Target CPU**: 70%
- **Target Memory**: 80%
- **Rationale**: Moderate load, authentication required for all requests

### Fleet Service
- **Min Replicas**: 1
- **Max Replicas**: 5
- **Target CPU**: 70%
- **Target Memory**: 80%
- **Rationale**: Read-heavy service for vehicle information

### Booking Service
- **Min Replicas**: 2
- **Max Replicas**: 10
- **Target CPU**: 65%
- **Target Memory**: 75%
- **Rationale**: High transaction volume, needs more capacity for peak times

### Payment Service
- **Min Replicas**: 2
- **Max Replicas**: 8
- **Target CPU**: 60%
- **Target Memory**: 70%
- **Rationale**: Critical service, lower thresholds for better availability

### Frontend Service
- **Min Replicas**: 2
- **Max Replicas**: 10
- **Target CPU**: 70%
- **Target Memory**: 75%
- **Rationale**: User-facing, needs to handle traffic spikes

## 🔧 Prerequisites

### 1. Metrics Server
HPA requires metrics-server to collect resource metrics.

```bash
# Check if metrics-server is running
kubectl get deployment metrics-server -n kube-system

# If not installed, install it
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# For DigitalOcean, metrics-server is pre-installed
```

### 2. Resource Requests and Limits
All pods MUST have CPU and memory requests defined for HPA to work:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

## 📝 HPA Configuration

### Basic HPA Structure
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: service-name-hpa
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: service-name
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
      - type: Pods
        value: 2
        periodSeconds: 30
      selectPolicy: Max
```

## 🚀 Deployment Steps

### 1. Verify Metrics Server
```bash
kubectl top nodes
kubectl top pods -n default
```

### 2. Deploy HPA Manifests
```bash
# Deploy individual HPA
kubectl apply -f k8s/exploresg-auth-service/hpa.yaml
kubectl apply -f k8s/exploresg-fleet-service/hpa.yaml
kubectl apply -f k8s/exploresg-booking-service/hpa.yaml
kubectl apply -f k8s/exploresg-payment-service/hpa.yaml
kubectl apply -f k8s/exploresg-frontend-service/hpa.yaml

# Or deploy all at once
kubectl apply -f k8s/exploresg-*/hpa.yaml
```

### 3. Verify HPA Status
```bash
# List all HPAs
kubectl get hpa

# Describe specific HPA
kubectl describe hpa auth-service-hpa

# Watch HPA in real-time
kubectl get hpa --watch
```

## 📈 Monitoring HPA

### Check Current Metrics
```bash
# View current CPU/Memory usage
kubectl top pods

# View HPA status
kubectl get hpa

# Detailed HPA information
kubectl describe hpa <hpa-name>
```

### Expected Output
```
NAME                REFERENCE                      TARGETS           MINPODS   MAXPODS   REPLICAS
auth-service-hpa    Deployment/auth-service        45%/70%, 60%/80%  1         5         2
fleet-service-hpa   Deployment/fleet-service       30%/70%, 50%/80%  1         5         1
booking-service-hpa Deployment/booking-service     55%/65%, 65%/75%  2         10        3
payment-service-hpa Deployment/payment-service     40%/60%, 55%/70%  2         8         2
frontend-hpa        Deployment/frontend-service    60%/70%, 70%/75%  2         10        4
```

## 🧪 Testing HPA

### Load Testing
```bash
# Install Apache Bench or use existing load testing tools
# Generate load on auth service
ab -n 10000 -c 100 http://<service-url>/health

# Watch HPA scale up
kubectl get hpa --watch

# Monitor pod count
kubectl get pods --watch
```

### Stress Test Script
```bash
#!/bin/bash
# stress-test.sh
SERVICE_URL=$1
DURATION=${2:-300}  # 5 minutes default

echo "Starting load test on $SERVICE_URL for ${DURATION}s"
timeout ${DURATION}s bash -c "while true; do curl -s $SERVICE_URL > /dev/null; done" &

echo "Monitoring HPA..."
kubectl get hpa --watch
```

## 🎛️ HPA Behavior Configuration

### Scale-Up Behavior
- **Stabilization Window**: 0 seconds (immediate response)
- **Policies**: 
  - Increase by 100% every 30 seconds OR
  - Add 2 pods every 30 seconds
  - Whichever is greater

### Scale-Down Behavior
- **Stabilization Window**: 300 seconds (5 minutes)
- **Policies**: 
  - Decrease by max 50% every 60 seconds
- **Rationale**: Prevent flapping, ensure stable performance

## 📊 Grafana Dashboard Integration

### HPA Metrics to Monitor
1. **Current Replicas**: Track scaling events
2. **Target vs Current Utilization**: CPU and Memory
3. **Scaling Events**: Scale-up and scale-down frequency
4. **Pod Readiness**: Time for new pods to become ready

### Prometheus Queries
```promql
# Current replica count
kube_deployment_status_replicas{deployment="auth-service"}

# Desired replica count from HPA
kube_horizontalpodautoscaler_status_desired_replicas

# CPU utilization
rate(container_cpu_usage_seconds_total[5m])

# Memory utilization
container_memory_usage_bytes / container_spec_memory_limit_bytes * 100
```

## 🔍 Troubleshooting

### HPA Not Scaling
```bash
# Check metrics are available
kubectl top pods

# Check HPA events
kubectl describe hpa <hpa-name>

# Verify resource requests are set
kubectl describe deployment <deployment-name>
```

### Common Issues

#### 1. "unable to get metrics"
- **Cause**: Metrics server not running or pods lack resource requests
- **Solution**: 
  ```bash
  kubectl get apiservice v1beta1.metrics.k8s.io -o yaml
  kubectl top nodes
  ```

#### 2. "failed to get cpu utilization"
- **Cause**: No CPU requests defined on pods
- **Solution**: Add resource requests to deployment

#### 3. Constant Scaling (Flapping)
- **Cause**: Metrics fluctuating around threshold
- **Solution**: Increase stabilization window or adjust thresholds

## 💡 Best Practices

### 1. Set Appropriate Resource Requests
- Base requests on actual usage + 20% buffer
- Use historical metrics from Grafana

### 2. Choose Meaningful Thresholds
- Don't set too low (< 50%) - wastes resources
- Don't set too high (> 90%) - risks performance issues
- Sweet spot: 60-80% for most services

### 3. Configure Scaling Behavior
- Fast scale-up for responsiveness
- Slow scale-down for stability

### 4. Monitor Scaling Events
- Track frequency of scaling
- Identify patterns (time of day, specific events)
- Adjust thresholds based on patterns

### 5. Set Realistic Min/Max Replicas
- Min: Enough for basic availability (at least 2 for critical services)
- Max: Within cluster capacity and budget

## 📋 Maintenance Checklist

### Daily
- [ ] Check HPA status: `kubectl get hpa`
- [ ] Monitor scaling events in Grafana

### Weekly
- [ ] Review average replica counts
- [ ] Analyze scaling patterns
- [ ] Adjust thresholds if needed

### Monthly
- [ ] Review resource usage trends
- [ ] Update min/max replicas based on growth
- [ ] Update resource requests/limits

## 🚨 Alerts to Configure

### Recommended Prometheus Alerts
```yaml
# HPA at max replicas
- alert: HPAMaxedOut
  expr: kube_horizontalpodautoscaler_status_current_replicas >= kube_horizontalpodautoscaler_spec_max_replicas
  for: 15m
  annotations:
    summary: "HPA {{ $labels.horizontalpodautoscaler }} is at maximum replicas"

# HPA unable to scale
- alert: HPAScalingDisabled
  expr: kube_horizontalpodautoscaler_status_condition{status="false",condition="ScalingActive"} == 1
  for: 5m
  annotations:
    summary: "HPA {{ $labels.horizontalpodautoscaler }} unable to scale"
```

## 📚 Additional Resources

- [Kubernetes HPA Documentation](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [DigitalOcean Kubernetes Autoscaling](https://docs.digitalocean.com/products/kubernetes/how-to/autoscale-workloads/)
- [HPA Walkthrough](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)

## 🎯 Next Steps

1. Deploy HPA configurations for all services
2. Run load tests to verify autoscaling
3. Set up Grafana dashboards for HPA monitoring
4. Configure alerts for scaling events
5. Document observed scaling patterns

---

**Last Updated**: October 20, 2025  
**Version**: 1.0  
**Author**: DevOps Team
