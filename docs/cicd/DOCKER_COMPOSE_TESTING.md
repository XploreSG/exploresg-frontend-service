# 🧪 Testing with Docker Compose

This guide shows how to test all services locally using Docker Compose with the exact same image versions deployed in production.

## 📦 Image Versions

The `docker-compose.yaml` now uses specific version tags matching production:

- **Frontend**: `v1.2.5.1`
- **Auth Service**: `v1.2.6.1`
- **Fleet Service**: `v1.2.4.2`
- **Booking Service**: `v1.2.6.1`
- **Payment Service**: `v1.0.0`

## 🚀 Quick Start

### 1. Create Network (One-time setup)

```bash
docker network create exploresg-net
```

### 2. Start All Services

```bash
docker-compose up -d
```

### 3. Run Automated Tests

```bash
./scripts/test-docker-compose.sh
```

### 4. Access Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Auth API | http://localhost:8080/swagger-ui/index.html |
| Fleet API | http://localhost:8081/swagger-ui/index.html |
| Booking API | http://localhost:8082/swagger-ui/index.html |
| Payment API | http://localhost:8083/swagger-ui/index.html |

## 🧹 Cleanup

```bash
# Stop services
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
```

## 📊 Manual Testing

### Health Checks

```bash
# Auth Service
curl http://localhost:8080/actuator/health

# Fleet Service
curl http://localhost:8081/actuator/health

# Booking Service
curl http://localhost:8082/actuator/health

# Payment Service
curl http://localhost:8083/actuator/health
```

### API Endpoints

```bash
# Auth Hello
curl http://localhost:8080/hello

# Fleet Hello
curl http://localhost:8081/hello

# Booking Hello
curl http://localhost:8082/hello

# Payment Hello
curl http://localhost:8083/hello
```

## 🔍 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f prod-exploresg-auth
docker-compose logs -f prod-exploresg-fleet
docker-compose logs -f prod-exploresg-booking
docker-compose logs -f prod-exploresg-payment
docker-compose logs -f prod-exploresg-frontend
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check container status
docker-compose ps

# Check logs for errors
docker-compose logs [service-name]

# Restart a specific service
docker-compose restart [service-name]
```

### Port Already in Use

If you see "port is already allocated" error:

```bash
# Check what's using the port
sudo lsof -i :8080  # or whichever port

# Kill the process or change the port in docker-compose.yaml
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps prod-exploresg-auth-db

# Connect to database
docker exec -it prod-exploresg-auth-db psql -U exploresguser -d exploresg-auth-service-db

# Check database logs
docker-compose logs prod-exploresg-auth-db
```

## 🔄 Testing New Versions

To test a new version before deploying to production:

1. **Build the new image:**
   ```bash
   cd [service-directory]
   docker build -t sreerajrone/exploresg-[service]-service:v1.2.7 .
   ```

2. **Update docker-compose.yaml:**
   ```yaml
   image: sreerajrone/exploresg-[service]-service:v1.2.7
   ```

3. **Pull the image and restart:**
   ```bash
   docker-compose pull [service-name]
   docker-compose up -d [service-name]
   ```

4. **Test the endpoints:**
   ```bash
   ./scripts/test-docker-compose.sh
   ```

5. **If successful, push to Docker Hub:**
   ```bash
   docker push sreerajrone/exploresg-[service]-service:v1.2.7
   ```

6. **Update Kubernetes manifests and commit to Git**

## 📚 Related Documentation

- [Docker Image Versions](./DOCKER_IMAGE_VERSIONS.md)
- [Deployment Guide](./QUICKSTART.md)
- [API Endpoints](./API-ENDPOINTS.md)

---

**Tip**: Always test with Docker Compose before deploying to Kubernetes to catch issues early!
