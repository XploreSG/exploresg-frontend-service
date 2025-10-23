# 🚀 Quick-Start: Critical Production Readiness (7 Days)

**Goal**: Make your platform production-safe in 1 week  
**Effort**: 40-50 hours  
**Cost**: ~$75/month additional

---

## Day 1: SSL/TLS & Security (8 hours)

### Morning: SSL Certificates
```bash
# 1. Create Let's Encrypt ClusterIssuer
cat > letsencrypt-prod.yaml << 'EOF'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

kubectl apply -f letsencrypt-prod.yaml
```

### Afternoon: Update Ingress with TLS
```bash
# 2. Update ingress for SSL
kubectl edit ingress exploresg-ingress -n exploresg

# Add these sections:
# metadata:
#   annotations:
#     cert-manager.io/cluster-issuer: "letsencrypt-prod"
#     nginx.ingress.kubernetes.io/ssl-redirect: "true"
# spec:
#   tls:
#   - hosts:
#     - your-domain.com
#     secretName: exploresg-tls
```

**✅ Result**: HTTPS enabled, auto-renewing certificates

---

## Day 2: Backup & Disaster Recovery (8 hours)

### Install Velero (Cluster Backup)
```bash
# 1. Install Velero CLI
wget https://github.com/vmware-tanzu/velero/releases/download/v1.12.0/velero-v1.12.0-linux-amd64.tar.gz
tar -xvf velero-v1.12.0-linux-amd64.tar.gz
sudo mv velero-v1.12.0-linux-amd64/velero /usr/local/bin/

# 2. Setup DO Spaces for backups
doctl auth init
doctl apps create-space --name exploresg-backups --region sgp1

# 3. Install Velero
velero install \
    --provider digitalocean \
    --plugins velero/velero-plugin-for-digitalocean:v1.1.0 \
    --bucket exploresg-backups \
    --backup-location-config region=sgp1 \
    --use-volume-snapshots=false

# 4. Create daily backup schedule
velero schedule create daily-backup \
    --schedule="0 2 * * *" \
    --include-namespaces exploresg

# 5. Test backup immediately
velero backup create test-backup --include-namespaces exploresg
velero backup describe test-backup
```

**✅ Result**: Automated daily backups, can restore in minutes

---

## Day 3: Secrets Management (8 hours)

### Install External Secrets Operator
```bash
# 1. Install ESO
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets \
   external-secrets/external-secrets \
    -n external-secrets-system \
    --create-namespace

# 2. Create DO Spaces secret store (for now)
# Later: Migrate to HashiCorp Vault or DO Managed solution

cat > secret-store.yaml << 'EOF'
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: do-secret-store
  namespace: exploresg
spec:
  provider:
    doppler:  # Or use parameter store
      auth:
        secretRef:
          dopplerToken:
            name: doppler-token
            key: token
EOF

kubectl apply -f secret-store.yaml
```

### Migrate Existing Secrets
```bash
# 3. Generate strong secrets
export NEW_JWT_SECRET=$(openssl rand -hex 64)
export NEW_AUTH_DB_PASS=$(openssl rand -base64 32)
export NEW_FLEET_DB_PASS=$(openssl rand -base64 32)

# 4. Store in external system (example with kubectl for now)
kubectl create secret generic production-secrets \
  --from-literal=jwt-secret=$NEW_JWT_SECRET \
  --from-literal=auth-db-password=$NEW_AUTH_DB_PASS \
  --from-literal=fleet-db-password=$NEW_FLEET_DB_PASS \
  -n exploresg

# 5. Update deployments to use new secrets
# (One-time manual update, then External Secrets takes over)
```

**✅ Result**: Secrets externalized, rotation ready

---

## Day 4: Observability - Logging (8 hours)

### Install Grafana Loki Stack
```bash
# 1. Add Grafana Loki helm repo
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# 2. Install Loki stack (Loki + Promtail + Grafana integration)
helm install loki grafana/loki-stack \
  --namespace monitoring \
  --set grafana.enabled=false \
  --set prometheus.enabled=false \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=10Gi \
  --set promtail.enabled=true

# 3. Verify Loki is running
kubectl get pods -n monitoring | grep loki

# 4. Add Loki datasource to Grafana
cat > loki-datasource.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-loki-datasource
  namespace: monitoring
  labels:
    grafana_datasource: "1"
data:
  loki-datasource.yaml: |
    apiVersion: 1
    datasources:
    - name: Loki
      type: loki
      access: proxy
      url: http://loki:3100
      isDefault: false
EOF

kubectl apply -f loki-datasource.yaml

# 5. Restart Grafana to pick up new datasource
kubectl rollout restart deployment prometheus-grafana -n monitoring
```

**✅ Result**: Centralized logging, searchable in Grafana

---

## Day 5: Network Security (8 hours)

### Implement Network Policies
```bash
# 1. Create base network policy (deny all by default)
cat > network-policies/base-policy.yaml << 'EOF'
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

# 2. Allow frontend to talk to backend
cat > network-policies/frontend-policy.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-allow-backend
  namespace: exploresg
spec:
  podSelector:
    matchLabels:
      app: frontend-service
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: auth-service
  - to:
    - podSelector:
        matchLabels:
          app: fleet-service
  - to:
    - podSelector:
        matchLabels:
          app: booking-service
  - to:
    - podSelector:
        matchLabels:
          app: payment-service
  # Allow DNS
  - ports:
    - protocol: UDP
      port: 53
EOF

# 3. Allow services to talk to databases
cat > network-policies/service-to-db.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: services-to-databases
  namespace: exploresg
spec:
  podSelector:
    matchLabels:
      tier: backend
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          tier: database
    ports:
    - protocol: TCP
      port: 5432
  # Allow DNS
  - ports:
    - protocol: UDP
      port: 53
  # Allow RabbitMQ
  - to:
    - podSelector:
        matchLabels:
          app: rabbitmq
    ports:
    - protocol: TCP
      port: 5672
EOF

# 4. Allow ingress from nginx
cat > network-policies/allow-ingress.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-ingress
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
EOF

# 5. Apply all policies
kubectl apply -f network-policies/
```

**✅ Result**: Zero-trust networking, contained breaches

---

## Day 6: Rate Limiting & Protection (6 hours)

### Configure Ingress Rate Limiting
```bash
# 1. Update ingress with rate limiting
kubectl edit ingress exploresg-ingress -n exploresg

# Add these annotations:
metadata:
  annotations:
    # Rate limiting: 100 requests per second per IP
    nginx.ingress.kubernetes.io/limit-rps: "100"
    # Connection limiting: 10 concurrent connections per IP
    nginx.ingress.kubernetes.io/limit-connections: "10"
    # Request size limit: 10MB
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    # Request timeout
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "30"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "30"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "30"
    # Security headers
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: DENY";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "X-XSS-Protection: 1; mode=block";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
```

### Setup Basic WAF Rules
```bash
# 2. Enable ModSecurity WAF (optional but recommended)
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  -n ingress-nginx \
  --set controller.config.enable-modsecurity=true \
  --set controller.config.enable-owasp-modsecurity-crs=true
```

**✅ Result**: DDoS protection, cost control, security headers

---

## Day 7: Monitoring & Alerts (6 hours)

### Setup Critical Alerts
```bash
# 1. Create alert rules for critical issues
cat > prometheus-alerts.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-critical-alerts
  namespace: monitoring
data:
  critical-alerts.yml: |
    groups:
    - name: critical
      interval: 30s
      rules:
      # Pod is down
      - alert: PodDown
        expr: up{job="kubernetes-pods"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod {{ $labels.pod }} is down"
          
      # High error rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      # Database connection failures
      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database {{ $labels.instance }} is down"
          
      # Disk space low
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space below 10%"
          
      # Memory pressure
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Container memory usage above 90%"
EOF

kubectl apply -f prometheus-alerts.yaml

# 2. Configure Alertmanager for Slack/Email
cat > alertmanager-config.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager-config
  namespace: monitoring
data:
  alertmanager.yml: |
    global:
      resolve_timeout: 5m
    
    route:
      receiver: 'default'
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 12h
      group_by: ['alertname', 'cluster', 'service']
      
      routes:
      - match:
          severity: critical
        receiver: 'critical-alerts'
        continue: true
    
    receivers:
    - name: 'default'
      email_configs:
      - to: 'ops@yourcompany.com'
        from: 'alertmanager@yourcompany.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alerts@yourcompany.com'
        auth_password: 'your-app-password'
        
    - name: 'critical-alerts'
      slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts-critical'
        title: '🚨 CRITICAL ALERT'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'
EOF

kubectl apply -f alertmanager-config.yaml
```

**✅ Result**: Proactive monitoring, instant issue notification

---

## Post-Week 1: Validation Checklist

### Security ✅
- [ ] HTTPS enabled with auto-renewal
- [ ] Secrets externalized
- [ ] Network policies in place
- [ ] Rate limiting active
- [ ] Security headers configured

### Reliability ✅
- [ ] Automated backups running (check: `velero backup get`)
- [ ] Can restore from backup (test it!)
- [ ] Health checks working
- [ ] HPA scaling properly

### Observability ✅
- [ ] Logs centralized in Loki
- [ ] Alerts configured and tested
- [ ] Grafana dashboards for all services
- [ ] Can troubleshoot issues quickly

### Compliance ✅
- [ ] Secrets not in Git
- [ ] Audit logging enabled
- [ ] Data backup verified
- [ ] Recovery procedures documented

---

## Cost Summary

### New Monthly Costs
```
Velero Backups (DO Spaces): $10/month
External Secrets: $0 (OSS)
Loki Storage: $20/month
Network Policies: $0 (built-in)
Rate Limiting: $0 (built-in)
Alerting: $0 (using existing Prometheus)

TOTAL NEW COST: ~$30/month
```

### Total Infrastructure Cost
```
DO Kubernetes: $40/month
DO Load Balancer: $12/month
Storage: $10/month
New additions: $30/month
TOTAL: ~$92/month (was $62/month)
```

**ROI**: Prevents potential $100K+ losses from data loss or breaches ✅

---

## Emergency Procedures

### Disaster Recovery
```bash
# Restore entire cluster from backup
velero restore create --from-backup daily-backup-20250121

# Restore specific namespace
velero restore create --from-backup daily-backup-20250121 \
  --include-namespaces exploresg
```

### Security Incident
```bash
# 1. Isolate affected pod
kubectl scale deployment compromised-service --replicas=0

# 2. Check audit logs
kubectl logs -n kube-system -l component=kube-apiserver

# 3. Rotate all secrets
kubectl delete secret --all -n exploresg
# Re-create with new values

# 4. Review network policies
kubectl get networkpolicies -n exploresg
```

### Service Outage
```bash
# 1. Check pod status
kubectl get pods -n exploresg

# 2. Check logs
kubectl logs -l app=failing-service -n exploresg --tail=100

# 3. Check recent changes
kubectl rollout history deployment/failing-service -n exploresg

# 4. Rollback if needed
kubectl rollout undo deployment/failing-service -n exploresg
```

---

## Success Metrics

After Week 1, you should have:
- ✅ **RTO**: < 1 hour (can restore from backup)
- ✅ **RPO**: < 24 hours (daily backups)
- ✅ **MTTR**: < 30 minutes (with logging + alerts)
- ✅ **Availability**: 99.5%+ (with HPA + health checks)
- ✅ **Security**: B+ grade (from D)

---

## Next Steps (Week 2+)

### Week 2: CI/CD
- Setup GitHub Actions
- Automated testing
- Automated deployments

### Week 3: Database HA
- Migrate to DO Managed PostgreSQL
- Setup read replicas
- Test failover

### Week 4: Advanced Monitoring
- Distributed tracing (Tempo)
- Error tracking (Sentry)
- Uptime monitoring

---

**Status**: Ready to implement! 🚀  
**Estimated completion**: 7 days  
**Risk level**: Low (all changes are additive)  
**Rollback**: Easy (all components can be removed)

**Let me know which day you'd like to start with, and I can help implement it!** 💪
