# 🛠️ ExploreSG Operations Guide# ExploreSG Kubernetes Cheat Sheet

> **Complete guide for day-to-day operations, debugging, and troubleshooting**## Quick Commands

## 📋 Table of Contents### Deployment

- [Quick Start](#quick-start)```powershell

- [kubectl Commands](#kubectl-commands)# Deploy everything

- [Port Forwarding](#port-forwarding).\scripts\deploy-k8s.ps1

- [Database Access](#database-access)

- [Monitoring & Debugging](#monitoring--debugging)# Deploy specific component

- [Common Operations](#common-operations)kubectl apply -f k8s/exploresg-auth-db/

- [Troubleshooting](#troubleshooting)kubectl apply -f k8s/exploresg-auth-service/

kubectl apply -f k8s/exploresg-fleet-db/

## 🚀 Quick Startkubectl apply -f k8s/exploresg-fleet-service/

kubectl apply -f k8s/exploresg-frontend-service/

### Access All Services```

````powershell### Port Forwarding

# Windows

.\scripts\port-forward.ps1```powershell

# Frontend

# Linux/Mackubectl port-forward -n exploresg svc/exploresg-frontend-service 3000:3000

./scripts/port-forward.sh

```# Auth Service

kubectl port-forward -n exploresg svc/exploresg-auth-service 8080:8080

### Quick Health Check

# Fleet Service

```bashkubectl port-forward -n exploresg svc/exploresg-fleet-service 8081:8080

# Check all pods

kubectl get pods -n exploresg# Auth DB (for debugging)

kubectl port-forward -n exploresg svc/exploresg-auth-db-service 5432:5432

# Check services

kubectl get svc -n exploresg# Fleet DB (for debugging)

kubectl port-forward -n exploresg svc/exploresg-fleet-db-service 5433:5432

# Check recent events```

kubectl get events -n exploresg --sort-by='.lastTimestamp' | Select-Object -Last 10

```### Monitoring



---```powershell

# Get all resources

## 📘 kubectl Commandskubectl get all -n exploresg



### 📦 Deployment# Get pods only

kubectl get pods -n exploresg

```powershell

# Deploy everything# Get pods with wide output (shows node, IP)

.\scripts\deploy-k8s.ps1kubectl get pods -n exploresg -o wide



# Deploy specific component# Watch pods in real-time

kubectl apply -f k8s/exploresg-auth-db/kubectl get pods -n exploresg --watch

kubectl apply -f k8s/exploresg-auth-service/

kubectl apply -f k8s/exploresg-fleet-db/# Get services

kubectl apply -f k8s/exploresg-fleet-service/kubectl get svc -n exploresg

kubectl apply -f k8s/exploresg-frontend-service/

# Get deployments

# Deploy with namespacekubectl get deployments -n exploresg

kubectl apply -f k8s/ -R -n exploresg

```# Get persistent volume claims

kubectl get pvc -n exploresg

### 🔍 Resource Viewing```



```bash### Logs

# Get all resources

kubectl get all -n exploresg```powershell

# View logs

# Get pods with detailskubectl logs <pod-name> -n exploresg

kubectl get pods -n exploresg -o wide

# Follow logs (tail -f)

# Watch pods in real-timekubectl logs -f <pod-name> -n exploresg

kubectl get pods -n exploresg --watch

# View previous logs (if pod restarted)

# Get serviceskubectl logs <pod-name> -n exploresg --previous

kubectl get svc -n exploresg

# Logs for all pods with a label

# Get deploymentskubectl logs -l app=exploresg-auth-service -n exploresg

kubectl get deployments -n exploresg

# Logs from multiple pods

# Get persistent volume claimskubectl logs -l tier=backend -n exploresg --all-containers=true

kubectl get pvc -n exploresg```



# Get config maps### Debugging

kubectl get configmap -n exploresg

```powershell

# Get secrets (names only)# Describe resource (shows events)

kubectl get secrets -n exploresgkubectl describe pod <pod-name> -n exploresg

```kubectl describe svc <service-name> -n exploresg

kubectl describe deployment <deployment-name> -n exploresg

### 📊 Resource Details

# Get events

```bashkubectl get events -n exploresg --sort-by='.lastTimestamp'

# Describe pod (shows events, conditions)

kubectl describe pod <pod-name> -n exploresg# Execute command in pod

kubectl exec -it <pod-name> -n exploresg -- /bin/bash

# Describe servicekubectl exec -it <pod-name> -n exploresg -- /bin/sh

kubectl describe svc <service-name> -n exploresg

# Execute single command

# Describe deploymentkubectl exec <pod-name> -n exploresg -- env

kubectl describe deployment <deployment-name> -n exploresgkubectl exec <pod-name> -n exploresg -- ps aux



# Get pod YAML# Check ConfigMaps

kubectl get pod <pod-name> -n exploresg -o yamlkubectl get configmap -n exploresg

kubectl describe configmap <configmap-name> -n exploresg

# Get service endpoints

kubectl get endpoints -n exploresg# Check Secrets

```kubectl get secrets -n exploresg

kubectl describe secret <secret-name> -n exploresg

### 📝 Logs

# Decode secret

```bashkubectl get secret <secret-name> -n exploresg -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d

# View logs```

kubectl logs <pod-name> -n exploresg

### Database Access

# Follow logs (tail -f)

kubectl logs -f <pod-name> -n exploresg```powershell

# Connect to Auth Database

# View previous logs (if pod restarted)kubectl exec -it $(kubectl get pod -n exploresg -l app=exploresg-auth-db -o jsonpath='{.items[0].metadata.name}') -n exploresg -- psql -U exploresguser -d exploresg-auth-service-db

kubectl logs <pod-name> -n exploresg --previous

# Connect to Fleet Database

# Logs for all pods with labelkubectl exec -it $(kubectl get pod -n exploresg -l app=exploresg-fleet-db -o jsonpath='{.items[0].metadata.name}') -n exploresg -- psql -U exploresguser -d exploresg-fleet-service-db

kubectl logs -l app=exploresg-auth-service -n exploresg

# Useful PostgreSQL commands once connected:

# Logs from multiple containers# \dt                 - List tables

kubectl logs <pod-name> -c <container-name> -n exploresg# \d table_name       - Describe table

# \l                  - List databases

# Last 100 lines# \du                 - List users

kubectl logs <pod-name> -n exploresg --tail=100# SELECT * FROM ...   - Query data

```# \q                  - Quit

````

### 🐛 Debugging

### Restart Services

````bash

# Execute shell in pod```powershell

kubectl exec -it <pod-name> -n exploresg -- /bin/bash# Restart by deleting pods (Deployment will recreate them)

kubectl exec -it <pod-name> -n exploresg -- /bin/shkubectl delete pod <pod-name> -n exploresg



# Execute single command# Restart all pods of a deployment

kubectl exec <pod-name> -n exploresg -- envkubectl rollout restart deployment <deployment-name> -n exploresg

kubectl exec <pod-name> -n exploresg -- ps aux

kubectl exec <pod-name> -n exploresg -- ls -la# Examples:

kubectl rollout restart deployment exploresg-auth-service -n exploresg

# Copy files from podkubectl rollout restart deployment exploresg-fleet-service -n exploresg

kubectl cp <pod-name>:/path/to/file ./local-file -n exploresgkubectl rollout restart deployment exploresg-frontend-service -n exploresg

````

# Copy files to pod

kubectl cp ./local-file <pod-name>:/path/to/file -n exploresg### Scaling

````

```powershell

### 🔄 Resource Management# Scale deployment

kubectl scale deployment <deployment-name> -n exploresg --replicas=3

```bash

# Restart deployment (rolling restart)# Examples:

kubectl rollout restart deployment/<name> -n exploresgkubectl scale deployment exploresg-auth-service -n exploresg --replicas=2

kubectl scale deployment exploresg-frontend-service -n exploresg --replicas=3

# Scale deployment```

kubectl scale deployment/<name> --replicas=3 -n exploresg

### Update Configuration

# Update image

kubectl set image deployment/<name> <container>=<image:tag> -n exploresg```powershell

# Edit ConfigMap

# Check rollout statuskubectl edit configmap <configmap-name> -n exploresg

kubectl rollout status deployment/<name> -n exploresg

# Edit Secret

# Rollout historykubectl edit secret <secret-name> -n exploresg

kubectl rollout history deployment/<name> -n exploresg

# Apply updated manifests

# Rollback to previous versionkubectl apply -f k8s/exploresg-auth-service/configmap.yaml

kubectl rollout undo deployment/<name> -n exploresgkubectl apply -f k8s/exploresg-auth-service/secret.yaml



# Rollback to specific revision# Restart pods to pick up changes

kubectl rollout undo deployment/<name> --to-revision=2 -n exploresgkubectl rollout restart deployment <deployment-name> -n exploresg

````

### 🗑️ Cleanup### Cleanup

`bash`powershell

# Delete specific resource# Clean up all resources (keep namespace)

kubectl delete pod <pod-name> -n exploresg.\scripts\cleanup-k8s.ps1

kubectl delete svc <service-name> -n exploresg

# Clean up including namespace

# Delete by label.\scripts\cleanup-k8s.ps1 -DeleteNamespace

kubectl delete pods -l app=exploresg-frontend-service -n exploresg

# Delete specific component

# Delete all resources in namespacekubectl delete -f k8s/exploresg-frontend-service/

kubectl delete all --all -n exploresg

# Force delete stuck pod

# Delete namespace (removes everything)kubectl delete pod <pod-name> -n exploresg --force --grace-period=0

kubectl delete namespace exploresg```

# Force delete stuck pod### Minikube Commands

kubectl delete pod <pod-name> -n exploresg --grace-period=0 --force

```````powershell

# Start Minikube

### 📋 Events & Monitoringminikube start --cpus=4 --memory=8192 --driver=docker



```bash# Stop Minikube

# Get events sorted by timeminikube stop

kubectl get events -n exploresg --sort-by='.lastTimestamp'

# Delete Minikube cluster

# Watch eventsminikube delete

kubectl get events -n exploresg --watch

# Get Minikube IP

# Filter events by typeminikube ip

kubectl get events -n exploresg --field-selector type=Warning

# Open Kubernetes dashboard

# Resource usageminikube dashboard

kubectl top pods -n exploresg

kubectl top nodes# SSH into Minikube

```minikube ssh



---# Access service via NodePort

minikube service <service-name> -n exploresg

## 🔌 Port Forwarding

# Enable addons

### Quick Access Scriptsminikube addons enable metrics-server

minikube addons enable ingress

**Windows:**

```powershell# Tunnel (for LoadBalancer services)

# Interactive menuminikube tunnel

.\scripts\port-forward.ps1```



# Kill existing forwards### Database Port Forwarding

.\scripts\kill-port-forwards.ps1

``````powershell

# Auth Database (PostgreSQL)

**Linux/Mac:**kubectl port-forward -n exploresg svc/exploresg-auth-service-db 5432:5432

```bash

./scripts/port-forward.sh# Fleet Database (PostgreSQL)

```kubectl port-forward -n exploresg svc/exploresg-fleet-service-db 5433:5432



### Manual Port Forwarding# Connect with psql (Auth DB)

psql -h localhost -p 5432 -U exploresguser -d exploresg_auth

```bash

# Frontend (React)# Connect with psql (Fleet DB)

kubectl port-forward -n exploresg svc/exploresg-frontend-service 3000:3000psql -h localhost -p 5433 -U exploresguser -d exploresg_fleet



# Auth Service (Spring Boot)# Password for both databases: exploresgpass

kubectl port-forward -n exploresg svc/exploresg-auth-service 8080:8080```



# Fleet Service (Spring Boot)📖 **See [DATABASE_ACCESS.md](./DATABASE_ACCESS.md) for comprehensive database connection guide**

kubectl port-forward -n exploresg svc/exploresg-fleet-service 8081:8080

### Useful Aliases (Add to PowerShell Profile)

# Auth Database (PostgreSQL)

kubectl port-forward -n exploresg svc/exploresg-auth-db-service 5432:5432```powershell

# Edit profile: notepad $PROFILE

# Fleet Database (PostgreSQL)

kubectl port-forward -n exploresg svc/exploresg-fleet-db-service 5433:5432# Add these aliases:

```function k { kubectl $args }

function kgp { kubectl get pods -n exploresg $args }

### Service URLsfunction kgs { kubectl get svc -n exploresg $args }

function kgd { kubectl get deployments -n exploresg $args }

| Service | Local URL | Description |function kga { kubectl get all -n exploresg $args }

|---------|-----------|-------------|function kl { kubectl logs -n exploresg $args }

| Frontend | http://localhost:3000 | React application |function klf { kubectl logs -f -n exploresg $args }

| Auth API | http://localhost:8080 | Authentication API |function kd { kubectl describe -n exploresg $args }

| Fleet API | http://localhost:8081 | Fleet management API |function ke { kubectl exec -it -n exploresg $args }

| Auth DB | localhost:5432 | PostgreSQL database |```

| Fleet DB | localhost:5433 | PostgreSQL database |

### Export/Backup

### Port Forward Troubleshooting

```powershell

#### Port Already in Use# Export all resources

kubectl get all -n exploresg -o yaml > backup.yaml

```powershell

# Find what's using the port# Export specific resources

netstat -ano | findstr :3000kubectl get deployment exploresg-auth-service -n exploresg -o yaml > auth-deployment.yaml

kubectl get configmap -n exploresg -o yaml > configmaps.yaml

# Kill specific process```

Stop-Process -Id <PID> -Force

### Resource Usage

# Or kill all kubectl processes

.\scripts\kill-port-forwards.ps1 -Force```powershell

```# Check resource usage (requires metrics-server)

kubectl top nodes

#### Port Forward Stops Unexpectedlykubectl top pods -n exploresg



```bash# Get resource requests/limits

# Check pod statuskubectl describe pod <pod-name> -n exploresg | Select-String -Pattern "Limits|Requests"

kubectl get pods -n exploresg```



# Check pod logs### Troubleshooting Common Issues

kubectl logs <pod-name> -n exploresg

#### Pod in CrashLoopBackOff

# Restart port forward with longer timeout

kubectl port-forward -n exploresg svc/exploresg-frontend-service 3000:3000 --pod-running-timeout=5m```powershell

```kubectl logs <pod-name> -n exploresg --previous

kubectl describe pod <pod-name> -n exploresg

#### Can't Connect After Port Forward```



```bash#### ImagePullBackOff

# 1. Verify port forward is running

netstat -ano | findstr :3000```powershell

kubectl describe pod <pod-name> -n exploresg

# 2. Test connection# Check image name and registry

curl http://localhost:3000```



# 3. Check service is ready#### Service Not Accessible

kubectl get pods -n exploresg

```powershell

# 4. Check service endpointskubectl get svc -n exploresg

kubectl get endpoints -n exploresgkubectl get endpoints -n exploresg

```kubectl describe svc <service-name> -n exploresg

```

---

#### Database Connection Failed

## 🗄️ Database Access

```powershell

### Quick Access# Test DNS resolution

kubectl exec -it <backend-pod> -n exploresg -- nslookup exploresg-auth-db-service.exploresg.svc.cluster.local

#### Using Port Forward Script

# Check database logs

```powershellkubectl logs -l app=exploresg-auth-db -n exploresg

.\scripts\port-forward.ps1

# Select option 4 (Auth DB) or 5 (Fleet DB)# Verify database is ready

```kubectl get pods -n exploresg -l app=exploresg-auth-db

```

#### Manual Port Forward

## Access URLs

```bash

# Auth DatabaseAfter port forwarding:

kubectl port-forward -n exploresg svc/exploresg-auth-db-service 5432:5432

- **Frontend**: http://localhost:3000

# Fleet Database- **Auth API**: http://localhost:8080

kubectl port-forward -n exploresg svc/exploresg-fleet-db-service 5433:5432- **Fleet API**: http://localhost:8081

```- **Auth API Health**: http://localhost:8080/actuator/health

- **Fleet API Health**: http://localhost:8081/actuator/health

### Connecting to Databases

## Pod Labels

#### Auth Database

Use these labels for filtering:

**Using psql:**

```bash- `app=exploresg-auth-db`

psql -h localhost -p 5432 -U exploresguser -d exploresg-auth-service-db- `app=exploresg-auth-service`

# Password: exploresgpass- `app=exploresg-fleet-db`

```- `app=exploresg-fleet-service`

- `app=exploresg-frontend-service`

**Connection Details:**- `tier=database`

- **Host:** localhost- `tier=backend`

- **Port:** 5432- `tier=frontend`

- **Database:** exploresg-auth-service-db

- **Username:** exploresguser## Namespace

- **Password:** exploresgpass

All resources are in the `exploresg` namespace.

#### Fleet Database

**Using psql:**
```bash
psql -h localhost -p 5433 -U exploresguser -d exploresg-fleet-service-db
# Password: exploresgpass
```

**Connection Details:**
- **Host:** localhost
- **Port:** 5433
- **Database:** exploresg-fleet-service-db
- **Username:** exploresguser
- **Password:** exploresgpass

### Direct Pod Access (No Port Forward)

```bash
# Auth Database
kubectl exec -it -n exploresg $(kubectl get pod -n exploresg -l app=exploresg-auth-db -o jsonpath='{.items[0].metadata.name}') -- psql -U exploresguser -d exploresg-auth-service-db

# Fleet Database
kubectl exec -it -n exploresg $(kubectl get pod -n exploresg -l app=exploresg-fleet-db -o jsonpath='{.items[0].metadata.name}') -- psql -U exploresguser -d exploresg-fleet-service-db
```

### Useful PostgreSQL Commands

```sql
-- List all tables
\dt

-- Describe table
\d table_name

-- List databases
\l

-- List users
\du

-- Show current database
SELECT current_database();

-- Show table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Exit
\q
```

### Database Backup

```bash
# Auth Database
pg_dump -h localhost -p 5432 -U exploresguser exploresg-auth-service-db > auth-backup.sql

# Fleet Database
pg_dump -h localhost -p 5433 -U exploresguser exploresg-fleet-service-db > fleet-backup.sql
```

### Database Restore

```bash
# Auth Database
psql -h localhost -p 5432 -U exploresguser exploresg-auth-service-db < auth-backup.sql

# Fleet Database
psql -h localhost -p 5433 -U exploresguser exploresg-fleet-service-db < fleet-backup.sql
```

### GUI Database Clients

**Recommended Tools:**
- **pgAdmin** - https://www.pgadmin.org/
- **DBeaver** - https://dbeaver.io/
- **Azure Data Studio** - https://aka.ms/azuredatastudio

**Connection Setup:**
1. Start port forwarding
2. Create new PostgreSQL connection
3. Use `localhost` and appropriate port (5432 or 5433)
4. Enter credentials above

---

## 📊 Monitoring & Debugging

### Quick Health Check

```bash
# Check everything
kubectl get all -n exploresg

# Check pod status
kubectl get pods -n exploresg -o wide

# Check events
kubectl get events -n exploresg --sort-by='.lastTimestamp' | tail -20

# Check resource usage
kubectl top pods -n exploresg
```

### Pod Debugging

```bash
# Why is my pod not starting?
kubectl describe pod <pod-name> -n exploresg

# Check logs
kubectl logs <pod-name> -n exploresg

# Previous logs (if crashed)
kubectl logs <pod-name> -n exploresg --previous

# Shell into pod
kubectl exec -it <pod-name> -n exploresg -- /bin/sh
```

### Service Debugging

```bash
# Check service
kubectl describe svc <service-name> -n exploresg

# Check endpoints
kubectl get endpoints <service-name> -n exploresg

# Test service from another pod
kubectl run test --rm -it --image=busybox -n exploresg -- wget -O- http://<service-name>:8080
```

### Network Debugging

```bash
# Test DNS resolution
kubectl run test --rm -it --image=busybox -n exploresg -- nslookup exploresg-auth-service

# Test connectivity
kubectl run test --rm -it --image=busybox -n exploresg -- telnet exploresg-auth-service 8080

# Check network policies
kubectl get networkpolicies -n exploresg
```

### ConfigMap & Secrets

```bash
# View ConfigMap
kubectl get configmap <name> -n exploresg -o yaml

# Edit ConfigMap
kubectl edit configmap <name> -n exploresg

# View Secret (base64 encoded)
kubectl get secret <name> -n exploresg -o yaml

# Decode secret value
kubectl get secret <name> -n exploresg -o jsonpath='{.data.KEY}' | base64 -d
```

---

## 🔧 Common Operations

### Restart Services

```bash
# Restart all deployments
kubectl rollout restart deployment -n exploresg

# Restart specific deployment
kubectl rollout restart deployment/exploresg-auth-service -n exploresg

# Delete pod (will auto-restart)
kubectl delete pod <pod-name> -n exploresg
```

### Scale Services

```bash
# Scale up
kubectl scale deployment/exploresg-auth-service --replicas=3 -n exploresg

# Scale down
kubectl scale deployment/exploresg-auth-service --replicas=1 -n exploresg

# Auto-scale (HPA)
kubectl autoscale deployment/exploresg-auth-service --min=2 --max=5 --cpu-percent=80 -n exploresg
```

### Update Images

```bash
# Update image tag
kubectl set image deployment/exploresg-auth-service auth-service=myregistry/auth-service:v2 -n exploresg

# Check rollout status
kubectl rollout status deployment/exploresg-auth-service -n exploresg

# View history
kubectl rollout history deployment/exploresg-auth-service -n exploresg
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/exploresg-auth-service -n exploresg

# Rollback to specific revision
kubectl rollout undo deployment/exploresg-auth-service --to-revision=2 -n exploresg

# Pause rollout
kubectl rollout pause deployment/exploresg-auth-service -n exploresg

# Resume rollout
kubectl rollout resume deployment/exploresg-auth-service -n exploresg
```

---

## 🚨 Troubleshooting

### Pod Won't Start

**Symptoms:** Pod stuck in Pending, ContainerCreating, or CrashLoopBackOff

**Solutions:**

```bash
# 1. Check pod status
kubectl describe pod <pod-name> -n exploresg

# 2. Check events
kubectl get events -n exploresg --sort-by='.lastTimestamp'

# 3. Check logs
kubectl logs <pod-name> -n exploresg

# 4. Common fixes:
# - Image pull error: Check image name/tag
# - Resource limits: Check if cluster has capacity
# - Volume mount: Check PVC exists and is bound
```

### Service Not Accessible

**Symptoms:** Can't reach service via port-forward or internally

**Solutions:**

```bash
# 1. Check service exists
kubectl get svc <service-name> -n exploresg

# 2. Check endpoints
kubectl get endpoints <service-name> -n exploresg

# 3. Check pod labels match service selector
kubectl describe svc <service-name> -n exploresg
kubectl get pods -n exploresg --show-labels

# 4. Test from inside cluster
kubectl run test --rm -it --image=busybox -n exploresg -- wget -O- http://<service-name>:8080
```

### Database Connection Issues

**Symptoms:** Application can't connect to database

**Solutions:**

```bash
# 1. Check database pod is running
kubectl get pods -n exploresg -l tier=database

# 2. Check database logs
kubectl logs -l app=exploresg-auth-db -n exploresg

# 3. Test connection from app pod
kubectl exec -it <app-pod> -n exploresg -- nc -zv exploresg-auth-db-service 5432

# 4. Verify credentials in secrets
kubectl get secret exploresg-auth-db-secret -n exploresg -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d
```

### Out of Resources

**Symptoms:** Pods pending, evicted, or failing

**Solutions:**

```bash
# Check node resources
kubectl describe nodes

# Check pod resource requests
kubectl describe pod <pod-name> -n exploresg

# Delete unused resources
kubectl delete pod <completed-pod> -n exploresg

# Scale down non-critical services
kubectl scale deployment/exploresg-frontend-service --replicas=0 -n exploresg
```

### Configuration Issues

**Symptoms:** Application behaving incorrectly

**Solutions:**

```bash
# 1. Check ConfigMap
kubectl get configmap -n exploresg -o yaml

# 2. Check environment variables
kubectl exec <pod-name> -n exploresg -- env

# 3. Restart after config change
kubectl rollout restart deployment/<name> -n exploresg
```

---

## 🎯 Quick Reference

### Service Names

- `exploresg-frontend-service` - React Frontend
- `exploresg-auth-service` - Auth Backend
- `exploresg-fleet-service` - Fleet Backend
- `exploresg-auth-db-service` - Auth Database
- `exploresg-fleet-db-service` - Fleet Database

### Pod Labels

- `app=exploresg-frontend-service` - Frontend pods
- `app=exploresg-auth-service` - Auth service pods
- `app=exploresg-fleet-service` - Fleet service pods
- `app=exploresg-auth-db` - Auth DB pods
- `app=exploresg-fleet-db` - Fleet DB pods

### Common Ports

| Port | Service | Protocol |
|------|---------|----------|
| 3000 | Frontend | HTTP |
| 8080 | Auth Service | HTTP |
| 8081 | Fleet Service | HTTP |
| 5432 | Auth DB | PostgreSQL |
| 5433 | Fleet DB | PostgreSQL |

---

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)

---

<div align="center">

**Need more help?** Check [SETUP.md](./SETUP.md) | [ARGOCD.md](./ARGOCD.md)

[Main README](../README.md) | [Scripts](../scripts/README.md)

</div>
```````
