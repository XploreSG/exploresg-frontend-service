# 🎯 Argo Rollouts Implementation Plan

## Overview

This document outlines the plan to add Argo Rollouts to ExploreSG for advanced deployment strategies like Blue-Green and Canary deployments.

## What's Been Added

### 1. Documentation
- **`docs/ARGO_ROLLOUTS_GUIDE.md`** - Comprehensive guide covering:
  - What Argo Rollouts is and why to use it
  - Deployment strategies (Blue-Green, Canary, Progressive)
  - Installation instructions
  - Migration guide
  - Examples and best practices
  - Integration with ArgoCD
  - Troubleshooting

### 2. Example Rollout Manifests

Created example Rollout configurations for three services:

#### Auth Service - Blue-Green Strategy
- **File**: `k8s/exploresg-auth-service/rollout.yaml`
- **Strategy**: Blue-Green with manual promotion
- **Reason**: Critical service requiring instant rollback capability
- **Features**:
  - Manual promotion gates
  - 5-minute rollback window
  - Preview service for testing

#### Frontend Service - Canary Strategy
- **File**: `k8s/exploresg-frontend-service/rollout.yaml`
- **Strategy**: Progressive Canary (10% → 25% → 50% → 75% → 100%)
- **Reason**: Lower risk service, benefits from gradual rollout
- **Features**:
  - Automatic promotion with timed pauses
  - Progressive traffic shifting
  - Simple to understand and implement

#### Fleet Service - Canary with Analysis
- **File**: `k8s/exploresg-fleet-service/rollout.yaml`
- **Strategy**: Automated Canary with Prometheus analysis
- **Reason**: Demonstrates advanced capabilities
- **Features**:
  - Automated success rate checks
  - Latency monitoring
  - Error rate validation
  - Automatic rollback on metric failures

### 3. Installation Script
- **File**: `scripts/setup-argo-rollouts.sh`
- **Purpose**: One-command installation of:
  - Argo Rollouts controller
  - Argo Rollouts dashboard
  - ArgoCD integration (if ArgoCD is installed)

## Implementation Roadmap

### Phase 1: Setup (15-30 minutes)

**Goal**: Install Argo Rollouts and verify it works

```bash
# 1. Install Argo Rollouts
./scripts/setup-argo-rollouts.sh

# 2. Verify installation
kubectl get pods -n argo-rollouts

# 3. Access dashboard
kubectl port-forward -n argo-rollouts service/argo-rollouts-dashboard 3100:3100
# Open: http://localhost:3100

# 4. Install CLI plugin (optional but recommended)
# Linux:
curl -LO https://github.com/argoproj/argo-rollouts/releases/latest/download/kubectl-argo-rollouts-linux-amd64
chmod +x kubectl-argo-rollouts-linux-amd64
sudo mv kubectl-argo-rollouts-linux-amd64 /usr/local/bin/kubectl-argo-rollouts
```

**Success Criteria**:
- ✅ Argo Rollouts pods running in `argo-rollouts` namespace
- ✅ Dashboard accessible at http://localhost:3100
- ✅ CLI command `kubectl argo rollouts version` works

### Phase 2: Test with Frontend (1-2 hours)

**Goal**: Convert one non-critical service to use Rollouts

```bash
# 1. Backup existing deployment
kubectl get deployment exploresg-frontend-service -n exploresg -o yaml > backup-frontend-deployment.yaml

# 2. Delete existing deployment
kubectl delete deployment exploresg-frontend-service -n exploresg

# 3. Apply Rollout
kubectl apply -f k8s/exploresg-frontend-service/rollout.yaml

# 4. Watch rollout
kubectl argo rollouts get rollout exploresg-frontend-service -n exploresg --watch

# 5. Test image update
# Edit rollout.yaml, change image tag
kubectl apply -f k8s/exploresg-frontend-service/rollout.yaml

# 6. Watch canary progression
kubectl argo rollouts get rollout exploresg-frontend-service -n exploresg --watch

# 7. Manual promotion (if needed)
kubectl argo rollouts promote exploresg-frontend-service -n exploresg

# 8. Test rollback
kubectl argo rollouts undo exploresg-frontend-service -n exploresg
```

**Success Criteria**:
- ✅ Rollout deploys successfully
- ✅ Canary steps progress (10% → 25% → 50% → 75% → 100%)
- ✅ Image updates trigger new rollout
- ✅ Manual promotion works
- ✅ Rollback works

### Phase 3: Add Analysis (2-3 hours)

**Goal**: Set up Prometheus and add automated analysis

**Prerequisites**:
- Prometheus installed (from your monitoring setup)
- Services exposing metrics (Spring Boot Actuator already does this)

```bash
# 1. Verify Prometheus is accessible
kubectl get svc -n monitoring | grep prometheus

# 2. Apply Fleet Service Rollout (includes AnalysisTemplates)
kubectl apply -f k8s/exploresg-fleet-service/rollout.yaml

# 3. Update image to trigger rollout with analysis
# Edit rollout.yaml, change image tag
kubectl apply -f k8s/exploresg-fleet-service/rollout.yaml

# 4. Watch rollout with analysis
kubectl argo rollouts get rollout exploresg-fleet-service -n exploresg --watch

# 5. View analysis runs
kubectl get analysisrun -n exploresg

# 6. Check analysis details
kubectl describe analysisrun <name> -n exploresg
```

**Success Criteria**:
- ✅ AnalysisRuns execute during rollout
- ✅ Prometheus queries return valid metrics
- ✅ Rollout auto-promotes on successful analysis
- ✅ Rollout auto-aborts on failed analysis (test by breaking service)

### Phase 4: Migrate Critical Services (2-3 hours)

**Goal**: Convert Auth and Payment services to Blue-Green

```bash
# Auth Service
# 1. Create preview service
kubectl apply -f k8s/exploresg-auth-service/service-preview.yaml

# 2. Backup and delete deployment
kubectl get deployment exploresg-auth-service -n exploresg -o yaml > backup-auth-deployment.yaml
kubectl delete deployment exploresg-auth-service -n exploresg

# 3. Apply Rollout
kubectl apply -f k8s/exploresg-auth-service/rollout.yaml

# 4. Test Blue-Green deployment
# Update image tag in rollout.yaml
kubectl apply -f k8s/exploresg-auth-service/rollout.yaml

# 5. Check preview service
kubectl port-forward -n exploresg svc/exploresg-auth-service-preview 8081:8080
# Test: curl http://localhost:8081/actuator/health

# 6. Promote to production (manual)
kubectl argo rollouts promote exploresg-auth-service -n exploresg

# 7. Verify production updated
kubectl get pods -n exploresg -l app=exploresg-auth-service
```

**Success Criteria**:
- ✅ Blue-Green deployment works
- ✅ Preview service accessible during deployment
- ✅ Manual promotion works
- ✅ Old version kept running for rollback window
- ✅ Quick rollback works

### Phase 5: ArgoCD Integration (1 hour)

**Goal**: Make Rollouts work seamlessly with ArgoCD

```bash
# 1. Update ArgoCD Application manifests
# Add ignoreDifferences for Rollouts
# See example in docs/ARGO_ROLLOUTS_GUIDE.md

# 2. Apply updated ArgoCD Applications
kubectl apply -f argocd/applications/

# 3. Make a change in Git
# Edit k8s/exploresg-frontend-service/rollout.yaml
# Change image tag
# Commit and push

# 4. Watch ArgoCD sync
kubectl get applications -n argocd -w

# 5. Watch Rollout progress
kubectl argo rollouts get rollout exploresg-frontend-service -n exploresg --watch

# 6. Verify both UIs
# ArgoCD: https://localhost:8080
# Rollouts: http://localhost:3100
```

**Success Criteria**:
- ✅ ArgoCD syncs Rollout changes
- ✅ ArgoCD shows Rollout health correctly
- ✅ Git changes trigger rollout progression
- ✅ Both dashboards show consistent state

## Decision: Should You Implement This?

### ✅ Reasons TO Implement

1. **Production Readiness**
   - Industry-standard progressive delivery
   - Reduced deployment risk
   - Faster recovery from bad deployments

2. **Learning & Portfolio**
   - Demonstrates advanced Kubernetes knowledge
   - Shows understanding of production best practices
   - Great for interviews and resume

3. **Better Operations**
   - Automated rollback on failures
   - Metrics-driven deployment decisions
   - Gradual rollout reduces incident impact

4. **Already Using ArgoCD**
   - Natural progression in GitOps journey
   - Complements existing setup well
   - Same company (Argo project)

5. **Microservices Architecture**
   - Different strategies for different services
   - Independent deployment control
   - Better for your multi-service setup

### ⚠️ Reasons to WAIT

1. **Complexity**
   - Additional learning curve
   - More moving parts to manage
   - Need to understand metrics and analysis

2. **Resource Overhead**
   - Additional controller running
   - More pods in cluster
   - Monitoring requirements (Prometheus)

3. **Still Learning K8s**
   - If you're still mastering basic Deployments
   - If debugging K8s is still challenging
   - If you want to keep things simple

4. **Time Constraints**
   - If you need to ship features quickly
   - If you're focused on application development
   - If DevOps is not your primary focus

5. **Local Development Only**
   - Less valuable for Minikube/local testing
   - More useful for actual production deployments
   - Might be overkill for learning project

## Recommendation

### Implement if:
- ✅ You're deploying to actual cloud (DigitalOcean)
- ✅ You want to learn production DevOps practices
- ✅ You're building your portfolio/resume
- ✅ You have monitoring (Prometheus) already set up
- ✅ You're comfortable with current K8s setup

### Skip if:
- ❌ Still learning basic Kubernetes
- ❌ Only running locally in Minikube
- ❌ Focused on feature development, not DevOps
- ❌ Don't have monitoring set up yet
- ❌ Want to keep infrastructure simple

## Phased Approach (Recommended)

If you're unsure, use this phased approach:

### Week 1: Experiment
- Install Argo Rollouts
- Try frontend service with simple canary
- See if you like the workflow

### Week 2: Decide
- If it feels valuable → continue to Phase 3
- If it feels too complex → stick with current setup
- You can always come back later

### Week 3+: Full Implementation
- Add analysis templates
- Migrate all services
- Integrate with ArgoCD

## Alternative: Simpler Progressive Delivery

If Argo Rollouts feels too complex, you can achieve some benefits with simpler approaches:

### Option 1: Multiple Replicas + Manual Testing
```yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Add one new pod at a time
      maxUnavailable: 0  # Keep all old pods until new ones ready
```

### Option 2: Namespace-based Blue-Green
```bash
# Create staging namespace
kubectl create namespace exploresg-staging

# Deploy to staging first
kubectl apply -f k8s/ -n exploresg-staging

# Test, then promote to prod
kubectl apply -f k8s/ -n exploresg
```

### Option 3: Manual Canary with Services
```yaml
# Create canary service alongside main service
# Manually shift traffic by updating ingress weights
```

## Quick Start Command

If you want to try it:

```bash
# Install everything
./scripts/setup-argo-rollouts.sh

# Try frontend service
kubectl delete deployment exploresg-frontend-service -n exploresg
kubectl apply -f k8s/exploresg-frontend-service/rollout.yaml

# Watch it work
kubectl argo rollouts get rollout exploresg-frontend-service -n exploresg --watch
```

## Resources

- **Guide**: `docs/ARGO_ROLLOUTS_GUIDE.md`
- **Examples**: `k8s/*/rollout.yaml`
- **Installation**: `scripts/setup-argo-rollouts.sh`
- **Official Docs**: https://argo-rollouts.readthedocs.io/

## Questions to Ask Yourself

Before implementing:

1. **Am I deploying to production?**
   - Yes → Rollouts add real value
   - No → Maybe wait

2. **Do I understand my current setup well?**
   - Yes → Good time to add Rollouts
   - No → Master basics first

3. **Do I have monitoring?**
   - Yes → Can use advanced features (analysis)
   - No → Still useful, but less powerful

4. **Is this for learning or production?**
   - Learning → Great learning opportunity
   - Production → Industry best practice

5. **How much time can I invest?**
   - 4+ hours → Full implementation
   - 2 hours → Try one service
   - <1 hour → Wait for later

## Summary

Argo Rollouts is a powerful addition that would:
- ✅ Make your deployments safer
- ✅ Add impressive portfolio features
- ✅ Teach you production practices
- ⚠️ Add some complexity
- ⚠️ Require learning time

**My Recommendation**: Try Phase 1 and 2 (install + test frontend). If you like it and find it valuable, continue. If it feels overwhelming, you can always come back to it later. The files are ready, so you can experiment risk-free!
