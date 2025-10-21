# ExploreSG Tools Dashboard - All Access URLs

Complete list of all monitoring, management, and development tools for ExploreSG.

## 🛠️ DevOps Tools

| Tool | URL | Purpose | Credentials |
|------|-----|---------|-------------|
| **Argo Rollouts** | https://rollout.tools.xplore.town | Progressive delivery dashboard | admin / rollouts@2025 |
| **ArgoCD** | https://argo.tools.xplore.town | GitOps continuous delivery | admin / (see below) |
| **Grafana** | https://grafana.tools.xplore.town | Metrics visualization | admin / admin |
| **Prometheus** | https://prom.tools.xplore.town | Metrics collection | None needed |
| **Loki** | https://loki.tools.xplore.town | Log aggregation | None needed |

## 🌐 Application Services

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | https://xplore.town<br>https://www.xplore.town | Main application |
| **Developer Portal** | https://dev.xplore.town | API documentation |
| **Auth API** | https://api.xplore.town/auth | Authentication service |
| **Fleet API** | https://api.xplore.town/fleet | Fleet management service |
| **Payment API** | https://api.xplore.town/payment | Payment service |

## 🔐 Getting Credentials

### Argo Rollouts
- Username: `admin`
- Password: `rollouts@2025`
- Protected with HTTP Basic Authentication

### ArgoCD Password
```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

### Grafana
- Default: `admin` / `admin`
- Change on first login

## 📊 What Each Tool Does

### Argo Rollouts (NEW!)
- **Purpose**: Manage progressive deployments (Blue-Green, Canary)
- **Use it for**: 
  - Monitoring rollout progress
  - Manual promotion of deployments
  - Viewing deployment history
  - Aborting/rolling back deployments
- **Access**: https://rollout.tools.xplore.town

### ArgoCD
- **Purpose**: GitOps continuous delivery
- **Use it for**:
  - Deploying applications from Git
  - Monitoring sync status
  - Viewing application health
  - Managing multiple environments
- **Access**: https://argo.tools.xplore.town

### Grafana
- **Purpose**: Metrics visualization and dashboards
- **Use it for**:
  - System performance monitoring
  - Creating custom dashboards
  - Setting up alerts
  - Viewing application metrics
- **Access**: https://grafana.tools.xplore.town

### Prometheus
- **Purpose**: Time-series metrics database
- **Use it for**:
  - Querying raw metrics (PromQL)
  - Setting up recording rules
  - Debugging metric collection
  - Testing queries for Grafana
- **Access**: https://prom.tools.xplore.town

### Loki
- **Purpose**: Log aggregation and querying
- **Use it for**:
  - Searching application logs
  - Log-based alerting
  - Correlating logs with metrics
- **Access**: https://loki.tools.xplore.town
- **Note**: Usually accessed through Grafana

## 🔄 Typical Workflow

### Deploying New Version
```
1. Push code to Git
   ↓
2. ArgoCD detects changes (https://argo.tools.xplore.town)
   ↓
3. Argo Rollouts manages progressive deployment (https://rollout.tools.xplore.town)
   ↓
4. Monitor metrics in Grafana (https://grafana.tools.xplore.town)
   ↓
5. Check logs in Loki (via Grafana)
   ↓
6. Promote or rollback in Argo Rollouts
```

### Debugging Issues
```
1. Check application in ArgoCD
   → Is it synced? Healthy?
   
2. View metrics in Grafana
   → CPU/Memory usage? Error rates?
   
3. Search logs in Loki (via Grafana)
   → What errors are happening?
   
4. Query Prometheus directly
   → Deep dive into specific metrics
   
5. Check rollout status in Argo Rollouts
   → Is deployment progressing correctly?
```

## 🎯 Quick Links

### Development
- API Docs: https://dev.xplore.town
- Frontend: https://xplore.town

### Operations
- Deployments: https://argo.tools.xplore.town
- Rollouts: https://rollout.tools.xplore.town
- Monitoring: https://grafana.tools.xplore.town

### Debugging
- Metrics: https://prom.tools.xplore.town
- Logs: https://grafana.tools.xplore.town (Explore → Loki)

## 📱 Bookmark These

Add to your browser bookmarks for quick access:

```
Tools
├── 🚀 Rollouts: https://rollout.tools.xplore.town
├── 🔄 ArgoCD: https://argo.tools.xplore.town
├── 📊 Grafana: https://grafana.tools.xplore.town
└── 🔍 Prometheus: https://prom.tools.xplore.town

Apps
├── 🌐 Frontend: https://xplore.town
├── 📖 API Docs: https://dev.xplore.town
└── 🔌 API: https://api.xplore.town
```

## 🔒 Security Notes

- ✅ All tools use HTTPS (Let's Encrypt SSL)
- ✅ Automatic certificate renewal
- ✅ Argo Rollouts protected with Basic Auth
- ✅ Secure by default
- ⚠️ Change default Grafana password
- ⚠️ Rotate ArgoCD password regularly
- ⚠️ Consider changing Argo Rollouts password in production

### Change Argo Rollouts Password

```bash
# Generate new password
NEW_PASSWORD="your-secure-password"
NEW_HASH=$(echo "admin:$(openssl passwd -apr1 "$NEW_PASSWORD")" | base64 -w 0)

# Update secret
kubectl patch secret rollouts-basic-auth -n argo-rollouts \
  -p "{\"data\":{\"auth\":\"$NEW_HASH\"}}"
```

## 🆘 Troubleshooting

### Can't Access Tool
```bash
# Check ingress
kubectl get ingress -A

# Check certificate
kubectl get certificate -A

# Check if service is running
kubectl get pods -n <namespace>
```

### Certificate Issues
```bash
# Check cert-manager
kubectl get pods -n cert-manager

# Check certificate details
kubectl describe certificate <cert-name> -n <namespace>

# Check challenges
kubectl get challenges -A
```

### DNS Issues
```bash
# Test DNS resolution
nslookup rollout.tools.xplore.town 8.8.8.8

# Check ingress IP
kubectl get ingress -A | grep tools
```

## 📈 Next Steps

1. **Bookmark all URLs** above
2. **Login to each tool** to familiarize yourself
3. **Set up Grafana dashboards** for your services
4. **Try a rollout** with Argo Rollouts
5. **Create alerts** in Grafana

---

**Last Updated**: October 18, 2025  
**Cluster**: DigitalOcean Kubernetes  
**Ingress IP**: 129.212.208.126
