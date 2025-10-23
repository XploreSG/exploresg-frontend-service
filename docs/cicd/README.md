# ExploreSG Cloud - Documentation

Complete documentation for the ExploreSG Cloud Kubernetes platform.

---

## 🚀 Quick Start

**New to the project? Start here:**

### 1. [QUICKSTART.md](QUICKSTART.md) ⭐
Get your Kubernetes cluster running in 10 minutes.

### 2. [MONITORING.md](MONITORING.md) 📊
Add Prometheus and Grafana monitoring.

### 3. [ARGOCD.md](ARGOCD.md) 🔄
Setup GitOps automation.

---

## 📚 Complete Documentation

### Getting Started

| Document | Purpose | Time |
|----------|---------|------|
| **[QUICKSTART.md](QUICKSTART.md)** | Fast Minikube setup | 10 min |
| [MINIKUBE_SETUP_GUIDE.md](MINIKUBE_SETUP_GUIDE.md) | Detailed setup guide | 30 min |
| [SETUP.md](SETUP.md) | Prerequisites & tools | 15 min |

### Deployment

| Document | Purpose |
|----------|---------|
| [DIGITAL_OCEAN_DEPLOYMENT.md](DIGITAL_OCEAN_DEPLOYMENT.md) | Production deployment |
| [DEPLOYMENT_READINESS_REVIEW.md](DEPLOYMENT_READINESS_REVIEW.md) | Pre-deployment checklist |

### Operations & Tools

| Document | Purpose |
|----------|---------|
| [MONITORING.md](MONITORING.md) | Prometheus & Grafana |
| [ARGOCD.md](ARGOCD.md) | GitOps with ArgoCD |
| **[ARGO_ROLLOUTS_GUIDE.md](ARGO_ROLLOUTS_GUIDE.md)** | Progressive delivery strategies |
| [DEPLOYMENT_STRATEGIES_COMPARISON.md](DEPLOYMENT_STRATEGIES_COMPARISON.md) | Blue-Green vs Canary comparison |
| [ARGO_ROLLOUTS_IMPLEMENTATION_PLAN.md](ARGO_ROLLOUTS_IMPLEMENTATION_PLAN.md) | Rollouts implementation roadmap |
| [OPERATIONS.md](OPERATIONS.md) | Daily operations |
| [INGRESS_SETUP.md](INGRESS_SETUP.md) | Network routing |

### Reference

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) | System architecture |

---

## 🎯 Common Tasks

```bash
# Start local cluster
→ Follow QUICKSTART.md

# Add monitoring
→ Follow MONITORING.md

# Setup GitOps
→ Follow ARGOCD.md

# Deploy to production
→ Follow DIGITAL_OCEAN_DEPLOYMENT.md
```

---

## 🏗️ System Architecture

```
Frontend (React) :3000
      ↓
NGINX Ingress
      ↓
├─→ Auth Service (Spring Boot) :8080 → Auth DB (PostgreSQL) :5432
└─→ Fleet Service (Spring Boot) :8080 → Fleet DB (PostgreSQL) :5432
```

Full details: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

---

## 🆘 Troubleshooting

**Pods not starting?**
```bash
kubectl describe pod -n exploresg <pod-name>
kubectl logs -n exploresg <pod-name>
```

**Port forward disconnected?**
```bash
./scripts/port-forward.sh
```

**Need more help?**
- Check [OPERATIONS.md](OPERATIONS.md) - Troubleshooting section
- Check [MINIKUBE_SETUP_GUIDE.md](MINIKUBE_SETUP_GUIDE.md) - Troubleshooting section

---

## 📝 Service URLs (Local Development)

With port-forwarding active:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Auth API | http://localhost:8080 |
| Fleet API | http://localhost:8081 |
| Auth DB | localhost:5432 |
| Fleet DB | localhost:5433 |
| Grafana | http://localhost:3001 |
| Prometheus | http://localhost:9090 |
| ArgoCD | https://localhost:8443 |

---

**Last Updated:** October 14, 2025  
**Version:** 2.0.0
