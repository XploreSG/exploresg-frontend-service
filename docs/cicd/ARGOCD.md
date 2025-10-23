# ArgoCD Deployment Guide for ExploreSG

This guide explains how to deploy ExploreSG using ArgoCD GitOps workflow.

## 📋 Table of Contents

- [What is ArgoCD?](#what-is-argocd)
- [Why Use ArgoCD?](#why-use-argocd)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Deployment Methods](#deployment-methods)
- [Using ArgoCD](#using-argocd)
- [Troubleshooting](#troubleshooting)

## What is ArgoCD?

ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes. It automatically:

- Syncs your cluster state with Git repository
- Monitors for drift and auto-heals
- Provides a beautiful UI to visualize your deployments
- Tracks deployment history and enables easy rollbacks

## Why Use ArgoCD?

### Benefits for ExploreSG:

1. **GitOps Workflow** - Your K8s manifests in Git are the source of truth
2. **Automatic Sync** - Push to Git → ArgoCD deploys automatically
3. **Self-Healing** - If someone manually changes something, ArgoCD fixes it
4. **Easy Rollbacks** - One-click rollback to any previous version
5. **Visual Dashboard** - See all deployments, health, and sync status
6. **Audit Trail** - Track who deployed what and when
7. **Multi-Environment** - Easily manage dev, staging, prod

### Industry Standard:

- Used by Netflix, Red Hat, Tesla, and many enterprises
- Great for your portfolio and learning production practices

## Quick Start

### Option 1: Interactive Deployment (Recommended)

```powershell
# Run the new deployment script
.\scripts\deploy-k8s-with-argocd.ps1

# Choose option 2 when prompted for ArgoCD
```

### Option 2: Direct ArgoCD Deployment

```powershell
# Deploy with ArgoCD flag
.\scripts\deploy-k8s-with-argocd.ps1 -UseArgoCD
```

### Option 3: Traditional Deployment

```powershell
# Skip ArgoCD, use traditional kubectl
.\scripts\deploy-k8s-with-argocd.ps1 -SkipArgoCD
```

## Architecture

### ArgoCD Structure for ExploreSG

```
ArgoCD (argocd namespace)
  │
  ├── exploresg-auth-db          → k8s/exploresg-auth-db/
  ├── exploresg-fleet-db         → k8s/exploresg-fleet-db/
  ├── exploresg-auth-service     → k8s/exploresg-auth-service/
  ├── exploresg-fleet-service    → k8s/exploresg-fleet-service/
  └── exploresg-frontend-service → k8s/exploresg-frontend-service/
                                      ↓
                              (deployed to exploresg namespace)
```

### Sync Waves

Applications deploy in order:

1. **Wave 0** (Default): Databases (auth-db, fleet-db)
2. **Wave 10**: Backend Services (auth-service, fleet-service)
3. **Wave 20**: Frontend (frontend-service)

This ensures databases are ready before services start.

## Deployment Methods

### Method 1: App-of-Apps Pattern (Recommended)

Uses individual ArgoCD Applications for each service:

```powershell
# Deploy root app
kubectl apply -f argocd/applications/root-app.yaml

# This creates all child applications automatically
```

**Benefits:**

- Fine-grained control per service
- Independent sync policies
- Better visualization in UI
- Easy to enable/disable specific services

### Method 2: Single Application

One ArgoCD Application manages all manifests:

```powershell
# Automatically created by deploy script
# Points to entire k8s/ directory
```

**Benefits:**

- Simpler setup
- Single sync operation
- Good for getting started

## Using ArgoCD

### Accessing ArgoCD UI

1. **Port Forward the ArgoCD Server:**

   ```powershell
   kubectl port-forward svc/argocd-server -n argocd 8080:443
   ```

2. **Open in Browser:**

   Navigate to: https://localhost:8080

   (Accept the self-signed certificate warning)

3. **Login:**

   - **Username:** `admin`
   - **Password:** Get it with:
     ```powershell
     kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
     ```

### ArgoCD UI Overview

The UI shows:

- **Applications**: All your deployed apps
- **Sync Status**: In Sync, Out of Sync, Syncing
- **Health Status**: Healthy, Degraded, Progressing
- **Resource Tree**: Visual representation of all K8s resources
- **Diff View**: Compare Git vs Cluster state
- **History**: All previous deployments

### Common Operations

#### View Applications

```powershell
# List all applications
kubectl get applications -n argocd

# Watch sync status
kubectl get applications -n argocd -w

# Detailed view
kubectl describe application exploresg-auth-service -n argocd
```

#### Force Sync

```powershell
# Force refresh from Git
kubectl patch application exploresg-auth-service -n argocd \
  --type merge \
  -p '{"metadata":{"annotations":{"argocd.argoproj.io/refresh":"hard"}}}'

# Or use ArgoCD CLI
argocd app sync exploresg-auth-service
```

#### View Sync Status

```powershell
# Get sync status
kubectl get application exploresg-auth-service -n argocd \
  -o jsonpath='{.status.sync.status}'

# Should show: Synced
```

#### Rollback

In ArgoCD UI:

1. Click on application
2. Go to "History" tab
3. Select previous version
4. Click "Rollback"

Or via CLI:

```powershell
argocd app rollback exploresg-auth-service <revision-number>
```

### GitOps Workflow

1. **Make Changes:**

   ```bash
   # Edit K8s manifests in k8s/ directory
   vim k8s/exploresg-auth-service/deployment.yaml
   ```

2. **Commit and Push:**

   ```bash
   git add .
   git commit -m "Update auth service replicas to 3"
   git push origin main
   ```

3. **ArgoCD Auto-Syncs:**

   - ArgoCD detects changes (within 3 minutes)
   - Automatically applies to cluster
   - Shows sync status in UI

4. **Monitor:**
   ```powershell
   kubectl get applications -n argocd -w
   ```

### Configuration

#### Change Sync Policy

Edit application to disable auto-sync:

```yaml
syncPolicy:
  automated: null # Disable auto-sync
```

#### Change Target Branch

```yaml
spec:
  source:
    targetRevision: develop # Or feature-branch
```

#### Add Sync Options

```yaml
syncPolicy:
  syncOptions:
    - CreateNamespace=true
    - PruneLast=true
    - Replace=true
```

## ArgoCD CLI (Optional)

### Installation

```powershell
# Windows (using Chocolatey)
choco install argocd-cli

# Or download from:
# https://github.com/argoproj/argo-cd/releases
```

### Common Commands

```powershell
# Login
argocd login localhost:8080 --insecure

# List apps
argocd app list

# Get app status
argocd app get exploresg-auth-service

# Sync app
argocd app sync exploresg-auth-service

# View logs
argocd app logs exploresg-auth-service

# Delete app
argocd app delete exploresg-auth-service
```

## Troubleshooting

### Application Stuck in "OutOfSync"

**Check:**

```powershell
# View application details
kubectl describe application exploresg-auth-service -n argocd

# Check conditions
kubectl get application exploresg-auth-service -n argocd -o jsonpath='{.status.conditions}'
```

**Solution:**

```powershell
# Force hard refresh
kubectl patch application exploresg-auth-service -n argocd \
  --type merge \
  -p '{"metadata":{"annotations":{"argocd.argoproj.io/refresh":"hard"}}}'

# Or sync via UI
```

### Application Shows "Unknown" Health

**Possible Causes:**

- Pods are still starting
- Resources don't have health checks defined
- Custom resources need health check configuration

**Solution:**

```powershell
# Check pod status
kubectl get pods -n exploresg -l app=exploresg-auth-service

# View pod logs
kubectl logs -l app=exploresg-auth-service -n exploresg
```

### Sync Fails with "ComparisonError"

**Check:**

```powershell
# View sync status
kubectl get application exploresg-auth-service -n argocd -o yaml

# Look at .status.operationState.message
```

**Common Issues:**

- Invalid YAML syntax in manifests
- Missing required fields
- Resource conflicts

**Solution:**

```powershell
# Validate manifests locally
kubectl apply --dry-run=client -f k8s/exploresg-auth-service/

# Fix errors and push to Git
```

### ArgoCD Server Not Accessible

**Check:**

```powershell
# Verify ArgoCD pods are running
kubectl get pods -n argocd

# Check service
kubectl get svc argocd-server -n argocd
```

**Solution:**

```powershell
# Restart port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Or restart ArgoCD
kubectl rollout restart deployment argocd-server -n argocd
```

### "Repository not found" Error

**Issue:** ArgoCD can't access your Git repo

**Solution:**

For private repos, add credentials:

```powershell
# Add Git repo credentials
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: private-repo
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
stringData:
  type: git
  url: https://github.com/Project-Be-Better/exploresg-cloud
  password: <your-github-token>
  username: <your-github-username>
EOF
```

### Application Won't Delete

**Issue:** ArgoCD Application stuck in "Deleting" state

**Solution:**

```powershell
# Remove finalizer
kubectl patch application exploresg-auth-service -n argocd \
  --type json \
  -p='[{"op": "remove", "path": "/metadata/finalizers"}]'
```

## Best Practices

### 1. Use App-of-Apps Pattern

✅ **DO:** Create separate Applications for each service

```yaml
# One app per service
- auth-db.yaml
- auth-service.yaml
- frontend-service.yaml
```

❌ **DON'T:** Put everything in one giant Application

### 2. Enable Auto-Sync with Self-Heal

✅ **DO:**

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
```

This ensures cluster always matches Git.

### 3. Use Sync Waves

✅ **DO:** Order deployments with sync waves

```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "10"
```

### 4. Monitor Sync Status

✅ **DO:** Watch for sync failures

```powershell
kubectl get applications -n argocd -w
```

### 5. Use Namespaced ArgoCD

✅ **DO:** Keep ArgoCD in separate namespace (`argocd`)

❌ **DON'T:** Deploy ArgoCD in same namespace as your apps

### 6. Version Control Everything

✅ **DO:** Keep all K8s manifests in Git

❌ **DON'T:** Make manual changes with kubectl (ArgoCD will revert them)

### 7. Use Proper Git Branches

✅ **DO:** Use branches for environments

- `main` → Production
- `staging` → Staging
- `develop` → Development

### 8. Test Locally First

✅ **DO:** Validate manifests before pushing

```powershell
kubectl apply --dry-run=client -f k8s/
```

## Comparison: Traditional vs ArgoCD

| Feature              | Traditional (kubectl) | ArgoCD GitOps |
| -------------------- | --------------------- | ------------- |
| **Deployment**       | Manual script         | Auto from Git |
| **State Management** | Manual                | Declarative   |
| **Drift Detection**  | None                  | Automatic     |
| **Rollback**         | Manual YAML restore   | One-click UI  |
| **Visibility**       | CLI only              | Beautiful UI  |
| **Audit Trail**      | Git commits           | Full history  |
| **Multi-Cluster**    | Complex               | Built-in      |
| **Learning Curve**   | Easy                  | Medium        |
| **Setup Time**       | 5 min                 | 10-15 min     |
| **Maintenance**      | Low                   | Medium        |

## Migration Path

### Phase 1: Try ArgoCD (Week 1)

```powershell
# Deploy with ArgoCD alongside traditional method
.\scripts\deploy-k8s-with-argocd.ps1 -UseArgoCD
```

### Phase 2: Use ArgoCD for One Service (Week 2)

- Deploy frontend via ArgoCD
- Keep backend services traditional
- Learn the UI and workflow

### Phase 3: Full GitOps (Week 3+)

- Move all services to ArgoCD
- Enable auto-sync
- Remove manual deployment scripts

## Resources

### Official Documentation

- [ArgoCD Docs](https://argo-cd.readthedocs.io/)
- [Getting Started Guide](https://argo-cd.readthedocs.io/en/stable/getting_started/)
- [Best Practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)

### Video Tutorials

- [ArgoCD Tutorial for Beginners](https://www.youtube.com/watch?v=MeU5_k9ssrs)
- [GitOps with ArgoCD](https://www.youtube.com/watch?v=vpWQeoaiRM4)

### Community

- [ArgoCD Slack](https://argoproj.github.io/community/join-slack/)
- [GitHub Discussions](https://github.com/argoproj/argo-cd/discussions)

## Summary

### When to Use ArgoCD:

✅ **YES** - Use ArgoCD if you want to:

- Learn industry-standard GitOps
- Practice production workflows
- Get automatic deployments
- Have better visibility
- Build your portfolio

⚠️ **MAYBE** - Consider waiting if:

- Still learning basic Kubernetes
- Just need quick local testing
- Don't want added complexity

### Quick Decision Matrix:

| Your Goal                 | Recommended Approach                 |
| ------------------------- | ------------------------------------ |
| **Learn K8s basics**      | Start with kubectl, add ArgoCD later |
| **Portfolio/Resume**      | Use ArgoCD (shows advanced skills)   |
| **Quick local dev**       | Traditional kubectl is faster        |
| **Production-like setup** | ArgoCD is essential                  |
| **Team collaboration**    | ArgoCD prevents conflicts            |

---

**Next Steps:**

1. Try ArgoCD deployment: `.\scripts\deploy-k8s-with-argocd.ps1 -UseArgoCD`
2. Access the UI and explore
3. Make a change in Git and watch it sync
4. Try a rollback
5. Compare with traditional deployment

Good luck with your GitOps journey! 🚀
