# 🎯 Argo Rollouts Implementation Guide for ExploreSG

![Argo Rollouts](https://img.shields.io/badge/Argo_Rollouts-Progressive_Delivery-orange?logo=argo&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28+-blue?logo=kubernetes&logoColor=white)

Complete guide for implementing progressive delivery strategies with Argo Rollouts.

## 📋 Table of Contents

- [What is Argo Rollouts?](#-what-is-argo-rollouts)
- [Why Add Rollouts?](#-why-add-rollouts)
- [Architecture](#-architecture)
- [Deployment Strategies](#-deployment-strategies)
- [Installation](#-installation)
- [Migration Guide](#-migration-guide)
- [Examples](#-examples)
- [Integration with ArgoCD](#-integration-with-argocd)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

## 🎯 What is Argo Rollouts?

Argo Rollouts is a Kubernetes controller that provides advanced deployment strategies:

- **Blue-Green**: Run two versions simultaneously, switch traffic instantly
- **Canary**: Gradually shift traffic to new version (10% → 50% → 100%)
- **Analysis Runs**: Automated metrics-based promotion/rollback
- **Experimentation**: A/B testing and feature flags

### Key Differences from Standard Deployments

| Feature | Standard Deployment | Argo Rollout |
|---------|-------------------|--------------|
| **Strategy** | RollingUpdate only | Blue-Green, Canary, Progressive |
| **Traffic Control** | None | Granular traffic splitting |
| **Metrics** | Manual checks | Automated analysis |
| **Rollback** | Manual | Automated on failure |
| **Progressive** | All-or-nothing | Gradual with pauses |

## 💡 Why Add Rollouts?

### For ExploreSG Specifically:

1. **Production Safety**
   - Test auth-service changes with 10% of users first
   - Automatic rollback if login failures spike
   - Zero-downtime for payment service updates

2. **Better Testing in Production**
   - Canary fleet-service updates to monitor performance
   - A/B test frontend features with traffic splits
   - Real user validation before full rollout

3. **Portfolio/Resume Value**
   - Shows knowledge of advanced Kubernetes patterns
   - Demonstrates production-ready deployment strategies
   - Aligns with industry best practices (Netflix, Intuit, etc.)

4. **Risk Mitigation**
   - Reduce blast radius of bad deployments
   - Quick rollback capabilities
   - Confidence to deploy more frequently

## 🏗️ Architecture

### Current Setup (ArgoCD + Deployments)

```
Git Repo → ArgoCD → K8s Deployments → Pods
                    (RollingUpdate)
```

### With Argo Rollouts

```
Git Repo → ArgoCD → Argo Rollouts → ReplicaSets → Pods
                    (Blue-Green/Canary)
                         ↓
                    Analysis Runs
                    (Prometheus/Datadog)
                         ↓
                    Traffic Management
                    (NGINX/Istio)
```

### Component Interaction

```
┌─────────────────┐
│   ArgoCD        │ ← GitOps Sync
│   (CD Tool)     │
└────────┬────────┘
         │ Manages
         ↓
┌─────────────────┐
│ Argo Rollouts   │ ← Progressive Delivery
│ (Controller)    │
└────────┬────────┘
         │ Creates
         ↓
┌─────────────────┐
│  ReplicaSets    │ ← Blue/Green or Canary
│  (Versions)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│     Pods        │ ← Application Instances
└─────────────────┘
```

## 🎨 Deployment Strategies

### 1. Blue-Green Deployment

**Use Case**: Auth Service, Payment Service (critical services)

**How it works**:
1. Deploy new version (Green) alongside old (Blue)
2. Test Green version with health checks
3. Switch all traffic to Green instantly
4. Keep Blue running for quick rollback

**Benefits**:
- Instant rollback
- Full testing before cutover
- Zero downtime

**Diagram**:
```
Before:  [Blue v1.0] ← 100% traffic
Deploy:  [Blue v1.0] [Green v1.1] ← testing
Switch:  [Blue v1.0] [Green v1.1] ← 100% traffic
Cleanup: [Green v1.1] ← 100% traffic
```

### 2. Canary Deployment

**Use Case**: Frontend, Fleet Service (less critical services)

**How it works**:
1. Deploy new version to subset of pods
2. Gradually increase traffic (10% → 25% → 50% → 100%)
3. Monitor metrics at each step
4. Auto-promote or rollback based on metrics

**Benefits**:
- Limited blast radius
- Real user feedback
- Automated decision making

**Diagram**:
```
Step 1: [v1.0] [v1.0] [v1.0] [v1.1] ← 10% traffic
Step 2: [v1.0] [v1.0] [v1.1] [v1.1] ← 25% traffic
Step 3: [v1.0] [v1.1] [v1.1] [v1.1] ← 50% traffic
Step 4: [v1.1] [v1.1] [v1.1] [v1.1] ← 100% traffic
```

### 3. Canary with Analysis

**Use Case**: All production services with monitoring

**How it works**:
1. Deploy canary version
2. Shift traffic gradually
3. Run automated analysis (check Prometheus metrics)
4. Auto-promote if metrics pass, auto-rollback if fail

**Benefits**:
- Fully automated
- No manual intervention
- Data-driven decisions

## 🚀 Installation

### Step 1: Install Argo Rollouts Controller

```bash
# Create namespace
kubectl create namespace argo-rollouts

# Install Argo Rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml

# Verify installation
kubectl get pods -n argo-rollouts
```

### Step 2: Install Argo Rollouts Dashboard (Optional)

```bash
# Install dashboard
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/dashboard-install.yaml

# Port forward to access
kubectl port-forward -n argo-rollouts service/argo-rollouts-dashboard 3100:3100

# Access at: http://localhost:3100
```

### Step 3: Install Argo Rollouts CLI (Optional)

```bash
# macOS/Linux
curl -LO https://github.com/argoproj/argo-rollouts/releases/latest/download/kubectl-argo-rollouts-linux-amd64
chmod +x ./kubectl-argo-rollouts-linux-amd64
sudo mv ./kubectl-argo-rollouts-linux-amd64 /usr/local/bin/kubectl-argo-rollouts

# Verify
kubectl argo rollouts version
```

### Step 4: Update ArgoCD to Track Rollouts

```bash
# Add health check for Rollouts in ArgoCD ConfigMap
kubectl patch configmap argocd-cm -n argocd --type merge -p '
{
  "data": {
    "resource.customizations.health.argoproj.io_Rollout": "hs = {}\nif obj.status ~= nil then\n  if obj.status.phase ~= nil then\n    if obj.status.phase == \"Degraded\" then\n      hs.status = \"Degraded\"\n      hs.message = obj.status.message\n      return hs\n    end\n    if obj.status.phase == \"Progressing\" then\n      hs.status = \"Progressing\"\n      hs.message = obj.status.message\n      return hs\n    end\n  end\nend\nhs.status = \"Healthy\"\nreturn hs"
  }
}'

# Restart ArgoCD application controller
kubectl rollout restart deployment argocd-application-controller -n argocd
```

## 🔄 Migration Guide

### Phase 1: Migrate One Service (Recommended Start)

Let's start with **frontend-service** (least critical):

#### Before (Standard Deployment)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: exploresg-frontend-service
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
```

#### After (Argo Rollout - Canary)
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: exploresg-frontend-service
spec:
  replicas: 2
  strategy:
    canary:
      steps:
      - setWeight: 25
      - pause: {duration: 30s}
      - setWeight: 50
      - pause: {duration: 30s}
      - setWeight: 75
      - pause: {duration: 30s}
```

### Phase 2: Migration Steps

1. **Backup Current Deployment**
   ```bash
   kubectl get deployment exploresg-frontend-service -n exploresg -o yaml > backup-frontend-deployment.yaml
   ```

2. **Delete Existing Deployment**
   ```bash
   kubectl delete deployment exploresg-frontend-service -n exploresg
   ```

3. **Apply Rollout**
   ```bash
   kubectl apply -f k8s/exploresg-frontend-service/rollout.yaml
   ```

4. **Verify**
   ```bash
   kubectl argo rollouts get rollout exploresg-frontend-service -n exploresg --watch
   ```

### Phase 3: Roll Out to All Services

Migration order:
1. ✅ Frontend (lowest risk)
2. ✅ Fleet Service (medium risk)
3. ✅ Auth Service (high risk - use Blue-Green)
4. ✅ Payment Service (critical - use Blue-Green)

## 📚 Examples

### Example 1: Simple Blue-Green (Auth Service)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: exploresg-auth-service
  namespace: exploresg
  labels:
    app: exploresg-auth-service
spec:
  replicas: 2
  revisionHistoryLimit: 3
  selector:
    matchLabels:
      app: exploresg-auth-service
  
  template:
    metadata:
      labels:
        app: exploresg-auth-service
    spec:
      containers:
      - name: auth-service
        image: sreerajrone/exploresg-auth-service:v1.2.6.1
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 50
        envFrom:
        - configMapRef:
            name: exploresg-auth-service-config
        - secretRef:
            name: exploresg-auth-service-secret
  
  strategy:
    blueGreen:
      activeService: exploresg-auth-service
      previewService: exploresg-auth-service-preview
      autoPromotionEnabled: false  # Manual approval required
      scaleDownDelaySeconds: 30
```

### Example 2: Progressive Canary (Frontend)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: exploresg-frontend-service
  namespace: exploresg
spec:
  replicas: 3
  selector:
    matchLabels:
      app: exploresg-frontend-service
  
  template:
    metadata:
      labels:
        app: exploresg-frontend-service
    spec:
      containers:
      - name: frontend
        image: sreerajrone/exploresg-frontend-service:latest
        ports:
        - containerPort: 80
  
  strategy:
    canary:
      # Traffic split steps
      steps:
      - setWeight: 10   # 10% to canary
      - pause: {duration: 2m}
      
      - setWeight: 25   # 25% to canary
      - pause: {duration: 2m}
      
      - setWeight: 50   # 50% to canary
      - pause: {duration: 2m}
      
      - setWeight: 75   # 75% to canary
      - pause: {duration: 2m}
      
      # If all passes, go to 100%
```

### Example 3: Automated Canary with Analysis

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: exploresg-fleet-service
  namespace: exploresg
spec:
  replicas: 2
  selector:
    matchLabels:
      app: exploresg-fleet-service
  
  template:
    metadata:
      labels:
        app: exploresg-fleet-service
    spec:
      containers:
      - name: fleet-service
        image: sreerajrone/exploresg-fleet-service:latest
        ports:
        - containerPort: 8082
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8082
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8082
        envFrom:
        - configMapRef:
            name: exploresg-fleet-service-config
        - secretRef:
            name: exploresg-fleet-service-secret
  
  strategy:
    canary:
      steps:
      - setWeight: 20
      - pause: {duration: 1m}
      
      # Run analysis before promoting further
      - analysis:
          templates:
          - templateName: success-rate
          args:
          - name: service-name
            value: exploresg-fleet-service
      
      - setWeight: 50
      - pause: {duration: 2m}
      
      - analysis:
          templates:
          - templateName: success-rate
          - templateName: latency-check
      
      - setWeight: 100
---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
  namespace: exploresg
spec:
  args:
  - name: service-name
  metrics:
  - name: success-rate
    interval: 1m
    successCondition: result >= 0.95
    failureLimit: 3
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          sum(rate(
            http_requests_total{
              service="{{args.service-name}}",
              status=~"2.."
            }[5m]
          )) /
          sum(rate(
            http_requests_total{
              service="{{args.service-name}}"
            }[5m]
          ))
---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: latency-check
  namespace: exploresg
spec:
  metrics:
  - name: p95-latency
    interval: 1m
    successCondition: result < 500
    failureLimit: 3
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket[5m])
          ) * 1000
```

## 🔗 Integration with ArgoCD

### Update ArgoCD Application to Use Rollouts

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: exploresg-auth-service
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/Project-Be-Better/exploresg-cloud.git
    targetRevision: main
    path: k8s/exploresg-auth-service
  destination:
    server: https://kubernetes.default.svc
    namespace: exploresg
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    # Important: Respect ignore differences for Rollouts
    - RespectIgnoreDifferences=true
  ignoreDifferences:
  - group: argoproj.io
    kind: Rollout
    jsonPointers:
    - /spec/replicas  # Allow HPA to manage replicas
```

### GitOps Workflow with Rollouts

1. **Developer commits image tag update**
   ```yaml
   # k8s/exploresg-auth-service/rollout.yaml
   image: sreerajrone/exploresg-auth-service:v1.2.7  # Changed
   ```

2. **ArgoCD syncs to cluster**
   - Detects Rollout resource changed
   - Applies new manifest

3. **Argo Rollouts takes over**
   - Starts Blue-Green or Canary strategy
   - Creates new ReplicaSet
   - Gradually shifts traffic

4. **Monitoring**
   ```bash
   # Watch rollout progress
   kubectl argo rollouts get rollout exploresg-auth-service -n exploresg --watch
   
   # View in UI
   # ArgoCD: https://localhost:8080
   # Rollouts Dashboard: http://localhost:3100
   ```

5. **Manual Promotion (if needed)**
   ```bash
   kubectl argo rollouts promote exploresg-auth-service -n exploresg
   ```

6. **Rollback (if issues)**
   ```bash
   kubectl argo rollouts undo exploresg-auth-service -n exploresg
   ```

## ✅ Best Practices

### 1. Start Small
- ✅ Begin with one non-critical service (frontend)
- ✅ Use simple canary without analysis first
- ✅ Add complexity gradually

### 2. Choose Right Strategy per Service

| Service | Strategy | Reason |
|---------|----------|--------|
| **Auth** | Blue-Green | Critical, needs instant rollback |
| **Payment** | Blue-Green | Critical, zero tolerance for errors |
| **Fleet** | Canary | Less critical, good for testing |
| **Frontend** | Canary | Low risk, benefits from gradual rollout |

### 3. Set Appropriate Pause Durations

```yaml
# Development
- pause: {duration: 30s}

# Staging
- pause: {duration: 2m}

# Production
- pause: {duration: 5m}
```

### 4. Use Analysis for Production

Always use AnalysisTemplates in production:
- Success rate checks
- Latency monitoring
- Error rate thresholds

### 5. Manual Gates for Critical Services

```yaml
strategy:
  blueGreen:
    autoPromotionEnabled: false  # Require manual approval
```

### 6. Keep Rollback Window

```yaml
strategy:
  blueGreen:
    scaleDownDelaySeconds: 300  # 5 minutes to rollback
```

### 7. Monitor Rollout Progress

Set up alerts for:
- Rollout stuck in progressing
- Analysis failures
- Automatic rollbacks

## 🔍 Troubleshooting

### Issue 1: Rollout Stuck in Progressing

```bash
# Check status
kubectl argo rollouts get rollout <name> -n exploresg

# Check events
kubectl describe rollout <name> -n exploresg

# Common causes:
# - Pods not becoming ready (check readiness probe)
# - Analysis failing (check AnalysisRun)
# - Manual pause waiting for promotion
```

### Issue 2: Analysis Keeps Failing

```bash
# View analysis details
kubectl get analysisrun -n exploresg

# Check specific run
kubectl describe analysisrun <run-name> -n exploresg

# Check Prometheus query
kubectl logs -n exploresg deployment/<name> | grep analysis
```

### Issue 3: Traffic Not Splitting

```bash
# Requires ingress controller support
# Install NGINX ingress with canary annotations

# Verify ingress supports canary
kubectl get ingress -n exploresg -o yaml
```

### Issue 4: Rollback Not Working

```bash
# Manual rollback
kubectl argo rollouts undo <name> -n exploresg

# Or to specific revision
kubectl argo rollouts undo <name> --to-revision=3 -n exploresg
```

## 📊 Monitoring

### CLI Commands

```bash
# Watch rollout status
kubectl argo rollouts get rollout <name> -n exploresg --watch

# List all rollouts
kubectl argo rollouts list rollouts -n exploresg

# Get rollout history
kubectl argo rollouts history <name> -n exploresg

# Promote to next step
kubectl argo rollouts promote <name> -n exploresg

# Abort rollout
kubectl argo rollouts abort <name> -n exploresg
```

### Dashboard Access

```bash
# Port forward dashboard
kubectl port-forward -n argo-rollouts service/argo-rollouts-dashboard 3100:3100

# Open: http://localhost:3100
```

## 🎓 Learning Resources

- [Official Argo Rollouts Docs](https://argo-rollouts.readthedocs.io/)
- [Getting Started Guide](https://argo-rollouts.readthedocs.io/en/stable/getting-started/)
- [Best Practices](https://argo-rollouts.readthedocs.io/en/stable/best-practices/)
- [Examples Repository](https://github.com/argoproj/argo-rollouts/tree/master/examples)

## 🚀 Next Steps

1. **Install Argo Rollouts** (15 min)
   ```bash
   kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
   ```

2. **Migrate Frontend Service** (30 min)
   - Convert Deployment to Rollout
   - Test simple canary
   - Verify in dashboard

3. **Add Analysis** (1 hour)
   - Set up Prometheus (if not already)
   - Create AnalysisTemplates
   - Test automated promotion/rollback

4. **Migrate Critical Services** (2 hours)
   - Convert Auth Service (Blue-Green)
   - Convert Payment Service (Blue-Green)
   - Test rollback scenarios

5. **Production Hardening** (ongoing)
   - Add comprehensive analysis
   - Set up alerting
   - Document runbooks

---

**Ready to implement?** Start with the installation script in the next section!
