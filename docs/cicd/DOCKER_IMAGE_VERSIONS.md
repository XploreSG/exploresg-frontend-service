# 🐳 Docker Image Versions

This document tracks the Docker image versions used across different environments.

## 📦 Current Production Versions (DigitalOcean K8s)

| Service | Image | Version | Status | Notes |
|---------|-------|---------|--------|-------|
| **Frontend** | `sreerajrone/exploresg-frontend-service` | `v1.2.5.1` | ✅ Stable | React + Vite |
| **Auth Service** | `sreerajrone/exploresg-auth-service` | `v1.2.6.1` | ✅ Stable | Spring Boot + JWT |
| **Fleet Service** | `sreerajrone/exploresg-fleet-service` | `v1.2.4.2` | ✅ Stable | Spring Boot + JPA |
| **Booking Service** | `sreerajrone/exploresg-booking-service` | `v1.2.6.1` | ✅ Stable | Spring Boot + JPA |
| **Payment Service** | `sreerajrone/exploresg-payment-service` | `v1.0.0` | ✅ Stable | Spring Boot + JPA |
| **PostgreSQL** | `postgres` | `15` | ✅ Stable | All databases |

---

## 🧪 Testing with Docker Compose

The `docker-compose.yaml` file has been updated with the specific versions currently running in production. You can test these locally:

```bash
# Create the network (one-time setup)
docker network create exploresg-net

# Start all services with specific versions
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Service Ports (Docker Compose)

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Auth Service | 8080 | http://localhost:8080 |
| Fleet Service | 8081 | http://localhost:8081 |
| Booking Service | 8082 | http://localhost:8082 |
| Payment Service | 8083 | http://localhost:8083 |
| Auth DB | 5432 | localhost:5432 |
| Fleet DB | 5433 | localhost:5433 |
| Booking DB | 5434 | localhost:5434 |
| Payment DB | 5435 | localhost:5435 |

---

## 🔄 Version History

### v1.2.6.1 (October 18, 2025)
- **Auth Service**: Updated to v1.2.6.1
- **Booking Service**: Initial deployment with v1.2.6.1

### v1.2.5.1 (October 2025)
- **Frontend Service**: Updated to v1.2.5.1

### v1.2.4.2 (October 2025)
- **Fleet Service**: Stable version v1.2.4.2

### v1.0.0 (October 2025)
- **Payment Service**: Initial stable release

---

## 📝 Version Management Guidelines

### Before Updating Versions:

1. **Build and test locally** with Docker Compose
2. **Push to Docker Hub** with semantic version tag
3. **Update manifests** in `k8s/exploresg-*/deployment.yaml`
4. **Update docker-compose.yaml** for local testing
5. **Commit changes** to Git
6. **Let ArgoCD sync** automatically or manually sync

### Semantic Versioning:

- `v1.0.0` - Major release
- `v1.1.0` - Minor feature release
- `v1.0.1` - Patch/bug fix

### Tagging Strategy:

```bash
# Build the image
docker build -t sreerajrone/exploresg-[service]-service:v1.2.3 .

# Also tag as latest (optional)
docker tag sreerajrone/exploresg-[service]-service:v1.2.3 \
           sreerajrone/exploresg-[service]-service:latest

# Push both tags
docker push sreerajrone/exploresg-[service]-service:v1.2.3
docker push sreerajrone/exploresg-[service]-service:latest
```

---

## 🚨 Troubleshooting

### Image Pull Errors

If you see `ErrImagePull` or `ImagePullBackOff`:

1. Verify the image exists on Docker Hub:
   ```bash
   curl -s https://hub.docker.com/v2/repositories/sreerajrone/exploresg-[service]-service/tags/ | grep -o '"name":"[^"]*"'
   ```

2. Check the deployment manifest:
   ```bash
   kubectl get deployment exploresg-[service]-service -n exploresg -o yaml | grep image:
   ```

3. Pull the image manually to test:
   ```bash
   docker pull sreerajrone/exploresg-[service]-service:v1.2.3
   ```

### Rollback to Previous Version

```bash
# Via kubectl
kubectl rollout undo deployment/exploresg-[service]-service -n exploresg

# Or update the image directly
kubectl set image deployment/exploresg-[service]-service \
  [service]-service=sreerajrone/exploresg-[service]-service:v1.2.2 \
  -n exploresg
```

---

## 📚 Related Documentation

- [Deployment Guide](./QUICKSTART.md)
- [ArgoCD Guide](./ARGOCD.md)
- [Kubernetes Setup](./MINIKUBE_SETUP_GUIDE.md)
- [Booking Service Test Report](./BOOKING_SERVICE_ENDPOINT_TEST_REPORT.md)

---

**Last Updated:** October 18, 2025
