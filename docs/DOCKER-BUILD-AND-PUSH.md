# Docker Build and Push Guide

## Prerequisites

1. **Docker Desktop** installed and running
2. **Docker Hub account** (create one at https://hub.docker.com if you don't have one)
3. **Docker Hub username** (you'll need this for tagging)

## Step 1: Login to Docker Hub

Open PowerShell and login to Docker Hub:

```powershell
docker login
```

Enter your Docker Hub username and password when prompted.

## Step 2: Build the Docker Image

### Option A: Build with a specific tag (Recommended)

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:

```powershell
# Build for Docker Hub
docker build -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest .
docker build -t sreerajrone/exploresg-frontend-service:latest .

# Example:
# docker build -t sreerajrone/exploresg-frontend-service:latest .
```

### Option B: Build with version tag

```powershell
# Build with version tag
docker build -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:v1.0.0 .

# Also tag as latest
docker tag YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:v1.0.0 YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

### Option C: Multi-platform build (for ARM64 + AMD64)

If you want to support both architectures (useful for Apple Silicon Macs and standard servers):

```powershell
# Create a builder instance (one-time setup)
docker buildx create --name multiplatform --use

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 `
  -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest `
  --push .
```

## Step 3: Verify the Image

Check that the image was built successfully:

```powershell
docker images | Select-String "exploresg-frontend-service"
```

You should see output like:

```
YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service   latest    abc123def456   2 minutes ago   50MB
```

## Step 4: Test the Image Locally (Optional but Recommended)

Before pushing, test the image locally:

```powershell
# Test with environment variables
docker run -d `
  --name test-frontend `
  -p 3000:3000 `
  --env-file ./frontend.env `
  YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Check if it's running
docker ps

# View logs
docker logs test-frontend

# Test in browser: http://localhost:3000

# Stop and remove test container
docker stop test-frontend
docker rm test-frontend
```

## Step 5: Push to Docker Hub

Push the image to Docker Hub:

```powershell
docker push YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

If you tagged multiple versions:

```powershell
docker push YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:v1.0.0
docker push YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

## Step 6: Verify on Docker Hub

1. Go to https://hub.docker.com
2. Login to your account
3. You should see `exploresg-frontend-service` in your repositories
4. Click on it to see the tags and details

## Step 7: Pull and Test on Another Machine

To test pulling the image from Docker Hub:

```powershell
# Pull the image
docker pull YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Run it
docker run -d `
  --name prod-frontend `
  -p 3000:3000 `
  --env-file ./frontend.env `
  YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

## Using Docker Compose

### Update docker-compose.yml

Edit `docker-compose.yml` and replace the build section with your pushed image:

```yaml
services:
  frontend:
    # Pull from Docker Hub instead of building locally
    image: YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

    # Comment out or remove the build section:
    # build:
    #   context: .
    #   dockerfile: Dockerfile

    container_name: prod-exploresg-frontend-service
    ports:
      - "3000:3000"
    env_file:
      - ./frontend.env
    environment:
      NODE_ENV: production
    networks:
      - exploresg-network

networks:
  exploresg-network:
    name: exploresg-net
    external: true
```

### Run with Docker Compose

```powershell
# Create the network if it doesn't exist
docker network create exploresg-net

# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

## Quick Reference Commands

```powershell
# Build
docker build -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest .

# Test locally
docker run -d --name test-frontend -p 3000:3000 --env-file ./frontend.env YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Push
docker push YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Pull (on another machine)
docker pull YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Check running containers
docker ps

# View logs
docker logs <container-name>

# Stop container
docker stop <container-name>

# Remove container
docker rm <container-name>

# Remove image
docker rmi YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

## Best Practices

### 1. Use Semantic Versioning

```powershell
# Tag with version
docker build -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:v1.0.0 .
docker build -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest .

# Push both
docker push YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:v1.0.0
docker push YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

### 2. Use Build Arguments for Flexibility

Update Dockerfile to accept build args:

```dockerfile
# Example: Pass build-time configuration
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
```

Build with arguments:

```powershell
docker build --build-arg NODE_ENV=production -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest .
```

### 3. Keep frontend.env Secure

**NEVER** commit `frontend.env` to version control if it contains secrets!

Add to `.gitignore`:

```
frontend.env
.env
.env.local
```

### 4. Use Docker Build Cache

Speed up builds by leveraging cache:

```powershell
# Build with cache
docker build -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest .

# Build without cache (force fresh build)
docker build --no-cache -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest .
```

### 5. Inspect Image Size

```powershell
# Check image size
docker images YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service

# Analyze layers
docker history YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

## Troubleshooting

### Build fails with "npm ci" error

```powershell
# Try building with legacy npm install
# Edit Dockerfile to use "npm install" instead of "npm ci"
```

### Image size too large

```powershell
# Check .dockerignore to exclude unnecessary files
# Ensure node_modules is NOT copied to Docker context
```

### Container exits immediately

```powershell
# Check logs
docker logs <container-name>

# Run interactively to debug
docker run -it --rm --entrypoint /bin/sh YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

### Environment variables not working

```powershell
# Verify frontend.env exists and has correct format
cat frontend.env

# Check if env.js is generated
docker exec <container-name> cat /usr/share/nginx/html/env.js

# Check docker-entrypoint.sh execution
docker logs <container-name>
```

### Port 3000 already in use

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Use a different port
docker run -d -p 3001:3000 --env-file ./frontend.env YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/docker-build-push.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/exploresg-frontend-service:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/exploresg-frontend-service:${{ github.sha }}
```

## Complete Example Workflow

```powershell
# 1. Login
docker login

# 2. Build (replace with your Docker Hub username)
docker build -t sreerajrone/exploresg-frontend-service:latest .

# 3. Test locally
docker run -d --name test-frontend -p 3000:3000 --env-file ./frontend.env sreerajrone/exploresg-frontend-service:latest

# 4. Open browser to http://localhost:3000 and verify
# Check that MAPBOX_TOKEN is working (check browser console)

# 5. If everything works, push to Docker Hub
docker stop test-frontend
docker rm test-frontend
docker push sreerajrone/exploresg-frontend-service:latest

# 6. On deployment server, pull and run
docker pull sreerajrone/exploresg-frontend-service:latest
docker run -d --name prod-frontend -p 3000:3000 --env-file ./frontend.env sreerajrone/exploresg-frontend-service:latest
```

## Verify Runtime Environment Variables

After starting the container, verify the runtime env injection is working:

```powershell
# Check env.js was generated
docker exec <container-name> cat /usr/share/nginx/html/env.js

# Should show:
# window._env_ = {
#   API_BASE_URL: "http://localhost:8080",
#   FLEET_API_BASE_URL: "http://localhost:8081",
#   GOOGLE_CLIENT_ID: "182715694192-6q156lo1066sf1vi4o99kmfd1b22qqi7.apps.googleusercontent.com",
#   MAPBOX_TOKEN: "pk.eyJ1Ijoic3JlZS1yLW9uZSIsImEiOiJjbTY1OTJjemQxc25zMmpvdWQ2MWN2aDlvIn0.VMrL_nkV5-W7-T4AcEY3qA",
#   APP_ENV: "production",
#   DEBUG: "false",
# };
```

Open browser console and check:

```javascript
console.log(window._env_);
// Should show your environment variables
```

## Related Files

- `Dockerfile` - Multi-stage build configuration
- `docker-compose.yml` - Docker Compose configuration
- `docker-entrypoint.sh` - Runtime env injection script
- `public/env.template.js` - Template for runtime env
- `frontend.env` - Runtime environment variables
- `nginx.conf` - Nginx configuration

## Next Steps

1. Build the image with your Docker Hub username
2. Test it locally with `docker run`
3. Push to Docker Hub with `docker push`
4. Pull on your deployment server
5. Verify all environment variables (especially MAPBOX_TOKEN) are working

---

**Note**: Make sure your `frontend.env` file contains all required variables:

- `API_BASE_URL`
- `FLEET_API_BASE_URL`
- `GOOGLE_CLIENT_ID`
- `MAPBOX_TOKEN` ⭐ (now properly picked up at runtime!)
- `APP_ENV`
- `DEBUG`
