# Argo Rollouts Quick Reference Card

## Installation
```bash
# One command to install everything
./scripts/setup-argo-rollouts.sh
```

## Access Dashboards
```bash
# Rollouts Dashboard
kubectl port-forward -n argo-rollouts svc/argo-rollouts-dashboard 3100:3100
# http://localhost:3100

# ArgoCD (if installed)
kubectl port-forward -n argocd svc/argocd-server 8080:443
# https://localhost:8080
```

## Basic Commands
```bash
# List rollouts
kubectl argo rollouts list rollouts -n exploresg

# Watch rollout status
kubectl argo rollouts get rollout <name> -n exploresg --watch

# View rollout history
kubectl argo rollouts history <name> -n exploresg

# Get current status
kubectl argo rollouts status <name> -n exploresg
```

## Control Commands
```bash
# Promote to next step
kubectl argo rollouts promote <name> -n exploresg

# Abort rollout
kubectl argo rollouts abort <name> -n exploresg

# Pause rollout
kubectl argo rollouts pause <name> -n exploresg

# Resume rollout
kubectl argo rollouts resume <name> -n exploresg

# Rollback/Undo
kubectl argo rollouts undo <name> -n exploresg

# Restart rollout
kubectl argo rollouts restart <name> -n exploresg
```

## Deployment Strategies Quick Ref

### Blue-Green (Auth, Payment)
```yaml
strategy:
  blueGreen:
    activeService: service-name
    previewService: service-name-preview
    autoPromotionEnabled: false
```
**When to use**: Critical services, need instant rollback

### Simple Canary (Frontend)
```yaml
strategy:
  canary:
    steps:
    - setWeight: 25
    - pause: {duration: 2m}
    - setWeight: 50
    - pause: {duration: 2m}
```
**When to use**: Gradual rollout, low-risk services

### Canary with Analysis (Fleet)
```yaml
strategy:
  canary:
    steps:
    - setWeight: 20
    - analysis:
        templates:
        - templateName: success-rate
```
**When to use**: Automated validation, production

## Common Scenarios

### Scenario 1: Deploy New Version
```bash
# 1. Update image in rollout.yaml
vim k8s/exploresg-frontend-service/rollout.yaml

# 2. Apply changes
kubectl apply -f k8s/exploresg-frontend-service/rollout.yaml

# 3. Watch progress
kubectl argo rollouts get rollout exploresg-frontend-service -n exploresg -w
```

### Scenario 2: Manual Promotion (Blue-Green)
```bash
# 1. New version deploys to "green"
# 2. Test via preview service
kubectl port-forward -n exploresg svc/exploresg-auth-service-preview 8081:8080

# 3. If good, promote
kubectl argo rollouts promote exploresg-auth-service -n exploresg

# 4. If bad, abort
kubectl argo rollouts abort exploresg-auth-service -n exploresg
```

### Scenario 3: Emergency Rollback
```bash
# Immediate rollback to previous version
kubectl argo rollouts undo exploresg-auth-service -n exploresg

# Rollback to specific version
kubectl argo rollouts undo exploresg-auth-service --to-revision=3 -n exploresg
```

### Scenario 4: Stuck Rollout
```bash
# Check status
kubectl argo rollouts get rollout <name> -n exploresg

# Check events
kubectl describe rollout <name> -n exploresg

# Check pods
kubectl get pods -n exploresg -l app=<name>

# Abort and retry
kubectl argo rollouts abort <name> -n exploresg
kubectl argo rollouts restart <name> -n exploresg
```

## Analysis Commands
```bash
# List analysis runs
kubectl get analysisrun -n exploresg

# Describe analysis run
kubectl describe analysisrun <run-name> -n exploresg

# View analysis template
kubectl get analysistemplate -n exploresg

# Check analysis logs
kubectl logs -n exploresg -l analysisrun=<name>
```

## Monitoring
```bash
# Watch all rollouts
watch -n 2 'kubectl get rollouts -n exploresg'

# Get rollout phase
kubectl get rollout <name> -n exploresg -o jsonpath='{.status.phase}'

# Get current step
kubectl get rollout <name> -n exploresg -o jsonpath='{.status.currentStepIndex}'

# Check replicas
kubectl get rollout <name> -n exploresg -o jsonpath='{.status.replicas}'
```

## Troubleshooting

### Issue: Rollout not progressing
```bash
# Check if paused
kubectl get rollout <name> -n exploresg -o jsonpath='{.status.pauseConditions}'

# Resume if paused
kubectl argo rollouts resume <name> -n exploresg
```

### Issue: Analysis failing
```bash
# Get analysis details
kubectl get analysisrun -n exploresg
kubectl describe analysisrun <latest-run> -n exploresg

# Check Prometheus connection
kubectl exec -n exploresg <pod> -- curl http://prometheus-server.monitoring:9090/-/healthy
```

### Issue: Pods not ready
```bash
# Check pod status
kubectl get pods -n exploresg -l app=<name>

# Check pod logs
kubectl logs -n exploresg <pod-name>

# Check events
kubectl describe pod -n exploresg <pod-name>
```

## Integration with ArgoCD

### GitOps Workflow
```bash
# 1. Make changes in Git
git add k8s/exploresg-frontend-service/rollout.yaml
git commit -m "Update frontend to v2.0"
git push

# 2. ArgoCD syncs automatically
kubectl get applications -n argocd -w

# 3. Rollout starts automatically
kubectl argo rollouts get rollout exploresg-frontend-service -n exploresg -w

# 4. Monitor in both UIs
# ArgoCD: https://localhost:8080
# Rollouts: http://localhost:3100
```

## Service-Specific Commands

### Auth Service (Blue-Green)
```bash
# Deploy and test preview
kubectl apply -f k8s/exploresg-auth-service/rollout.yaml
kubectl port-forward -n exploresg svc/exploresg-auth-service-preview 8081:8080
curl http://localhost:8081/actuator/health

# Promote if good
kubectl argo rollouts promote exploresg-auth-service -n exploresg
```

### Frontend Service (Canary)
```bash
# Deploy and watch auto-progression
kubectl apply -f k8s/exploresg-frontend-service/rollout.yaml
kubectl argo rollouts get rollout exploresg-frontend-service -n exploresg -w

# Steps: 10% → 25% → 50% → 75% → 100% (auto)
```

### Fleet Service (Canary + Analysis)
```bash
# Deploy with automated analysis
kubectl apply -f k8s/exploresg-fleet-service/rollout.yaml
kubectl argo rollouts get rollout exploresg-fleet-service -n exploresg -w

# Watch analysis runs
kubectl get analysisrun -n exploresg -w
```

## Useful Aliases (Add to ~/.zshrc)
```bash
alias kr='kubectl argo rollouts'
alias krg='kubectl argo rollouts get rollout'
alias krp='kubectl argo rollouts promote'
alias kra='kubectl argo rollouts abort'
alias kru='kubectl argo rollouts undo'
alias krl='kubectl argo rollouts list rollouts -n exploresg'

# Usage:
# krg exploresg-frontend-service -n exploresg -w
# krp exploresg-auth-service -n exploresg
```

## Quick Verification Checklist

After installation:
- [ ] Controller pods running: `kubectl get pods -n argo-rollouts`
- [ ] Dashboard accessible: http://localhost:3100
- [ ] CLI works: `kubectl argo rollouts version`
- [ ] Can list rollouts: `kubectl argo rollouts list rollouts -A`

After deploying rollout:
- [ ] Rollout created: `kubectl get rollout <name> -n exploresg`
- [ ] Pods created: `kubectl get pods -n exploresg -l app=<name>`
- [ ] Service accessible: `kubectl get svc <name> -n exploresg`
- [ ] Visible in dashboard: http://localhost:3100

## Documentation Files

Quick access to all docs:
```bash
# Main guide (comprehensive)
cat docs/ARGO_ROLLOUTS_GUIDE.md | less

# Strategy comparison
cat docs/DEPLOYMENT_STRATEGIES_COMPARISON.md | less

# Implementation plan
cat docs/ARGO_ROLLOUTS_IMPLEMENTATION_PLAN.md | less

# This summary
cat ARGO_ROLLOUTS_SUMMARY.md | less

# Examples
cat k8s/exploresg-auth-service/rollout.yaml
cat k8s/exploresg-frontend-service/rollout.yaml
cat k8s/exploresg-fleet-service/rollout.yaml
```

## URLs at a Glance

| Service | URL | Credentials |
|---------|-----|-------------|
| Rollouts Dashboard | http://localhost:3100 | None needed |
| ArgoCD | https://localhost:8080 | admin / (see secret) |
| Prometheus | http://localhost:9090 | None needed |
| Grafana | http://localhost:3001 | admin / admin |

Get ArgoCD password:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

---

**Print this card and keep it handy!** 📋
