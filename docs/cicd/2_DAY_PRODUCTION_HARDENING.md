# 🚀 2-Day Production Hardening Plan

**Current Grade**: A- (88/100)  
**Target Grade**: A (95/100)  
**Time Required**: 2 days  
**Cost**: $10/month

---

## ✅ What You Already Have (No Need to Do!)

- ✅ **Loki + Promtail** - Centralized logging working
- ✅ **SSL/TLS** - Let's Encrypt certificates auto-renewing
- ✅ **Ingress** - Production-ready with multiple domains
- ✅ **Monitoring** - Prometheus + Grafana + Alertmanager
- ✅ **HPA** - Auto-scaling just deployed
- ✅ **Cert-manager** - Automatic certificate management

**You're already at 88/100!** 🎉

---

## 🔴 Day 1: Disaster Recovery (8 hours)

### Morning: Install Velero (4 hours)

```bash
# 1. Install Velero CLI
cd ~
wget https://github.com/vmware-tanzu/velero/releases/download/v1.12.0/velero-v1.12.0-linux-amd64.tar.gz
tar -xvf velero-v1.12.0-linux-amd64.tar.gz
sudo mv velero-v1.12.0-linux-amd64/velero /usr/local/bin/
velero version --client-only

# 2. Create DigitalOcean Spaces for backups
# Go to DO Console → Spaces → Create Space
# Name: exploresg-backups
# Region: Singapore (sgp1)
# Generate Spaces access keys

# 3. Create credentials file
cat > credentials-velero << EOF
[default]
aws_access_key_id=YOUR_SPACES_ACCESS_KEY
aws_secret_access_key=YOUR_SPACES_SECRET_KEY
EOF

# 4. Install Velero in cluster
velero install \
    --provider aws \
    --plugins velero/velero-plugin-for-aws:v1.8.0 \
    --bucket exploresg-backups \
    --backup-location-config region=sgp1,s3ForcePathStyle="true",s3Url=https://sgp1.digitaloceanspaces.com \
    --snapshot-location-config region=sgp1 \
    --use-volume-snapshots=true \
    --secret-file ./credentials-velero

# 5. Verify installation
kubectl get pods -n velero
velero version
```

### Afternoon: Configure Backups (4 hours)

```bash
# 1. Create backup schedule for all namespaces
velero schedule create daily-full-backup \
    --schedule="0 2 * * *" \
    --ttl 720h0m0s \
    --include-cluster-resources=true

# 2. Create backup schedule for exploresg namespace only
velero schedule create hourly-exploresg-backup \
    --schedule="0 * * * *" \
    --include-namespaces exploresg \
    --ttl 168h0m0s

# 3. Create backup schedule for monitoring
velero schedule create daily-monitoring-backup \
    --schedule="0 3 * * *" \
    --include-namespaces monitoring \
    --ttl 720h0m0s

# 4. Test immediate backup
velero backup create test-backup \
    --include-namespaces exploresg \
    --wait

# 5. Verify backup completed
velero backup describe test-backup
velero backup logs test-backup

# 6. Test restore (to verify it works!)
# Create a test namespace first
kubectl create namespace restore-test

# Restore to test namespace
velero restore create test-restore \
    --from-backup test-backup \
    --namespace-mappings exploresg:restore-test \
    --wait

# Verify restoration
kubectl get all -n restore-test

# Clean up test
kubectl delete namespace restore-test
velero backup delete test-backup --confirm

# 7. Check scheduled backups
velero schedule get
```

### Create Backup Runbook

```bash
# Create documentation
cat > ~/exploresg-backup-runbook.md << 'EOF'
# ExploreSG Backup & Recovery Runbook

## Backup Schedule
- **Daily Full**: 2 AM (30-day retention)
- **Hourly exploresg**: Every hour (7-day retention)
- **Daily monitoring**: 3 AM (30-day retention)

## List Backups
```bash
velero backup get
```

## Create Manual Backup
```bash
velero backup create manual-$(date +%Y%m%d-%H%M) \
    --include-namespaces exploresg \
    --wait
```

## Restore Entire Cluster
```bash
# 1. List available backups
velero backup get

# 2. Restore from specific backup
velero restore create restore-$(date +%Y%m%d-%H%M) \
    --from-backup daily-full-backup-YYYYMMDD \
    --wait

# 3. Check restoration status
velero restore get
kubectl get pods --all-namespaces
```

## Restore Specific Namespace
```bash
velero restore create \
    --from-backup BACKUP_NAME \
    --include-namespaces exploresg \
    --wait
```

## Disaster Recovery Steps
1. Verify cluster is accessible
2. Install Velero if cluster is fresh
3. Restore from latest backup
4. Verify all pods are running
5. Test application endpoints
6. Update DNS if needed

## RTO: 1 hour
## RPO: 1 hour (due to hourly backups)
EOF
```

**✅ Day 1 Complete**: You can now recover from disasters!

---

## 🟡 Day 2: Network Security (4 hours)

### Morning: Network Policies (4 hours)

```bash
# 1. Create network policies directory
mkdir -p k8s/network-policies
cd k8s/network-policies

# 2. Default Deny All (Base Security)
cat > 00-default-deny-all.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: exploresg
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
EOF

# 3. Allow DNS (Required for all pods)
cat > 01-allow-dns.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: exploresg
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
EOF

# 4. Allow Ingress from Nginx
cat > 02-allow-ingress-nginx.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-ingress-nginx
  namespace: exploresg
spec:
  podSelector:
    matchLabels:
      tier: frontend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
    - protocol: TCP
      port: 8080
EOF

# 5. Allow Frontend to Backend Services
cat > 03-frontend-to-backend.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-to-backend
  namespace: exploresg
spec:
  podSelector:
    matchLabels:
      app: exploresg-frontend-service
  policyTypes:
  - Egress
  egress:
  # Allow to auth service
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-auth-service
    ports:
    - protocol: TCP
      port: 8080
  # Allow to fleet service
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-fleet-service
    ports:
    - protocol: TCP
      port: 8080
  # Allow to booking service
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-booking-service
    ports:
    - protocol: TCP
      port: 8080
  # Allow to payment service
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-payment-service
    ports:
    - protocol: TCP
      port: 8080
EOF

# 6. Allow Backend Services to Databases
cat > 04-backend-to-databases.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-to-databases
  namespace: exploresg
spec:
  podSelector:
    matchExpressions:
    - key: app
      operator: In
      values:
      - exploresg-auth-service
      - exploresg-fleet-service
      - exploresg-booking-service
      - exploresg-payment-service
  policyTypes:
  - Egress
  egress:
  # Allow to auth-db
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-auth-db
    ports:
    - protocol: TCP
      port: 5432
  # Allow to fleet-db
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-fleet-db
    ports:
    - protocol: TCP
      port: 5432
  # Allow to booking-db
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-booking-db
    ports:
    - protocol: TCP
      port: 5432
  # Allow to payment-db
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-payment-db
    ports:
    - protocol: TCP
      port: 5432
EOF

# 7. Allow Backend Services to RabbitMQ
cat > 05-backend-to-rabbitmq.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-to-rabbitmq
  namespace: exploresg
spec:
  podSelector:
    matchExpressions:
    - key: app
      operator: In
      values:
      - exploresg-auth-service
      - exploresg-fleet-service
      - exploresg-booking-service
      - exploresg-payment-service
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: exploresg-rabbitmq
    ports:
    - protocol: TCP
      port: 5672
    - protocol: TCP
      port: 15672
EOF

# 8. Allow Monitoring (Prometheus to scrape)
cat > 06-allow-prometheus-scraping.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-prometheus-scraping
  namespace: exploresg
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 8080
    - protocol: TCP
      port: 9090
EOF

# 9. Apply all network policies
kubectl apply -f k8s/network-policies/

# 10. Verify network policies
kubectl get networkpolicies -n exploresg

# 11. Test connectivity (make sure services still work!)
kubectl run test-pod --image=busybox --rm -it --restart=Never -n exploresg -- sh
# Inside pod, try:
# wget -O- http://exploresg-auth-service:8080/actuator/health
# (Should work from within namespace)

# 12. Test from outside (should be blocked)
kubectl run test-pod-outside --image=busybox --rm -it --restart=Never -n default -- sh
# Inside pod, try:
# wget -O- http://exploresg-auth-service.exploresg:8080/actuator/health
# (Should timeout - this is good!)
```

### Create Network Policy Documentation

```bash
cat > k8s/network-policies/README.md << 'EOF'
# Network Policies for ExploreSG

## Overview
These network policies implement zero-trust networking for the exploresg namespace.

## Default Behavior
- **Deny all** ingress and egress by default
- Explicit allow rules for required communication

## Policies Applied

1. **00-default-deny-all.yaml**
   - Blocks all traffic by default
   
2. **01-allow-dns.yaml**
   - Allows DNS resolution (required for service discovery)
   
3. **02-allow-ingress-nginx.yaml**
   - Allows traffic from ingress-nginx to frontend services
   
4. **03-frontend-to-backend.yaml**
   - Allows frontend to call backend APIs
   
5. **04-backend-to-databases.yaml**
   - Allows backend services to access their databases
   
6. **05-backend-to-rabbitmq.yaml**
   - Allows backend services to use message queue
   
7. **06-allow-prometheus-scraping.yaml**
   - Allows Prometheus to scrape metrics

## Testing Network Policies

### Verify Allowed Traffic
```bash
# From frontend to auth service (should work)
kubectl exec -it -n exploresg <frontend-pod> -- curl http://exploresg-auth-service:8080/actuator/health
```

### Verify Blocked Traffic
```bash
# From default namespace to exploresg (should fail)
kubectl run test --image=curlimages/curl --rm -it --restart=Never -- curl http://exploresg-auth-service.exploresg:8080/actuator/health
```

## Troubleshooting

### Service Can't Connect
1. Check network policy applied: `kubectl get netpol -n exploresg`
2. Check pod labels match policy selectors
3. Check port numbers are correct
4. Test DNS: `kubectl exec -it <pod> -n exploresg -- nslookup exploresg-auth-service`

### Remove Network Policies (Emergency)
```bash
kubectl delete networkpolicies --all -n exploresg
```

## Security Benefits
- ✅ Prevents lateral movement if pod is compromised
- ✅ Limits blast radius of security incidents
- ✅ Compliance requirement for SOC2/ISO27001
- ✅ Zero-trust architecture
EOF
```

**✅ Day 2 Complete**: Network security hardened!

---

## ✅ Post-Implementation Checklist

### Backups ✅
- [ ] Velero installed and running
- [ ] Daily backup schedule created
- [ ] Hourly exploresg backup configured
- [ ] Test restore completed successfully
- [ ] Backup runbook documented
- [ ] Team trained on recovery procedures

### Network Security ✅
- [ ] Default deny-all policy applied
- [ ] DNS access allowed
- [ ] Ingress access configured
- [ ] Service-to-service communication allowed
- [ ] Database access restricted
- [ ] Monitoring access maintained
- [ ] Policies tested and working

---

## 📊 Impact Assessment

### Before (A- / 88%)
```
✅ Monitoring, Logging, SSL, Ingress, HPA
❌ Backups
❌ Network policies
```

### After (A / 95%)
```
✅ Everything from before
✅ Automated disaster recovery
✅ Zero-trust networking
✅ Security hardened
```

---

## 💰 Cost Impact

```
Current: $62/month
+ Velero backups (DO Spaces): $10/month
+ Network policies: $0
NEW TOTAL: $72/month (+16%)
```

**ROI**: Prevents potential $100K+ losses from:
- Data loss incidents
- Security breaches
- Compliance violations

---

## 📈 New Capabilities

### Disaster Recovery
- **RPO**: 1 hour (hourly backups)
- **RTO**: 1 hour (fast restore)
- Can recover from:
  - Accidental deletions
  - Cluster failures
  - Namespace corruption
  - Database corruption

### Security
- **Zero-trust networking**
- **Lateral movement prevention**
- **Compliance ready** (SOC2 path)
- **Reduced attack surface**

---

## 🎯 Optional Next Steps (Not Urgent)

### Week 2-3 (If Needed)
- **External Secrets Operator** - Better secret management
- **CI/CD Pipeline** - GitHub Actions automation
- **Rate Limiting** - Verify and configure in ingress

### Month 2 (If Scaling)
- **Database HA** - DO Managed PostgreSQL
- **Distributed Tracing** - Tempo for request tracing
- **Cost Monitoring** - Kubecost for optimization

---

## 🎓 Summary

### What You Need to Do:
1. **Day 1**: Install Velero + Configure backups (8 hours)
2. **Day 2**: Apply network policies (4 hours)

### Result:
- **Grade**: A- → A (88% → 95%)
- **Cost**: +$10/month
- **Time**: 2 days
- **Status**: Production-hardened ✅

---

## 🚨 Emergency Contacts

### Backup Issues
```bash
# Check Velero status
velero backup get
velero schedule get

# Check Velero logs
kubectl logs -n velero deployment/velero
```

### Network Policy Issues
```bash
# Temporarily disable if services break
kubectl delete networkpolicy --all -n exploresg

# Re-apply after fixing
kubectl apply -f k8s/network-policies/
```

---

**You're SO close to perfection!** 🚀  
**Just 2 days of work and you're production-hardened!** 💪

---

**Files Created**:
- `~/exploresg-backup-runbook.md` - Backup procedures
- `k8s/network-policies/*.yaml` - Network security
- `k8s/network-policies/README.md` - Network policy docs

**Start with Day 1 (backups) - it's the most critical!** 🔥
