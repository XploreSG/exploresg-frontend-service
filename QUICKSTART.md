# 🚀 Quick Start: Build and Push to Docker Hub

This guide shows you the fastest way to build your Docker image and push it to Docker Hub.

## Prerequisites ✅

- Docker Desktop installed and running
- Docker Hub account (sign up at https://hub.docker.com)
- Your Docker Hub username

## Method 1: Using the Automated Script (Recommended) 🎯

### For PowerShell (Windows):

1. **Edit the script** - Open `build-and-push.ps1` and change line 4:

   ```powershell
   $DOCKER_USERNAME = "YOUR_DOCKERHUB_USERNAME"  # ⚠️ CHANGE THIS
   ```

   Replace with your actual Docker Hub username (e.g., `sreerajrone`)

2. **Run the script:**

   ```powershell
   .\build-and-push.ps1
   ```

3. **Follow the prompts:**
   - Script will check Docker status
   - Login to Docker Hub (if needed)
   - Build the image
   - Offer to test locally
   - Offer to push to Docker Hub

### For Bash (Linux/Mac/Git Bash):

1. **Make the script executable:**

   ```bash
   chmod +x build-and-push.sh
   ```

2. **Edit the script** - Open `build-and-push.sh` and change line 6:

   ```bash
   DOCKER_USERNAME="YOUR_DOCKERHUB_USERNAME"  # ⚠️ CHANGE THIS
   ```

3. **Run the script:**
   ```bash
   ./build-and-push.sh
   ```

## Method 2: Manual Commands (Step-by-Step) 📝

### Step 1: Login to Docker Hub

```powershell
docker login
```

Enter your Docker Hub username and password.

### Step 2: Build the Image

```powershell
# Replace YOUR_DOCKERHUB_USERNAME with your actual username
docker build -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest .

# Example:
# docker build -t sreerajrone/exploresg-frontend-service:latest .
```

### Step 3: Test Locally (Recommended)

```powershell
# Run the container with your environment variables
docker run -d `
  --name test-frontend `
  -p 3000:3000 `
  --env-file ./frontend.env `
  YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Check if it's running
docker ps

# View logs
docker logs test-frontend

# Open http://localhost:3000 in your browser

# Check browser console to verify MAPBOX_TOKEN is loaded:
# console.log(window._env_)

# Stop and remove when done testing
docker stop test-frontend
docker rm test-frontend
```

### Step 4: Push to Docker Hub

```powershell
docker push YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

### Step 5: Verify on Docker Hub

1. Go to https://hub.docker.com
2. Login and navigate to your repository
3. You should see `exploresg-frontend-service` with the `latest` tag

## Method 3: Using Docker Compose 🐳

### Option A: Build and Run Locally

```powershell
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option B: Update docker-compose.yml to Use Docker Hub Image

1. **Edit `docker-compose.yml`:**

   ```yaml
   services:
     frontend:
       # Use your pushed image
       image: YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

       # Comment out the build section:
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

2. **Create the network (if it doesn't exist):**

   ```powershell
   docker network create exploresg-net
   ```

3. **Pull and run:**
   ```powershell
   docker-compose pull
   docker-compose up -d
   ```

## Testing Your Deployed Application 🧪

After running your container, verify everything is working:

### 1. Check Container Status

```powershell
docker ps
```

You should see your container running.

### 2. Check Logs

```powershell
docker logs <container-name>
```

Look for any errors or warnings.

### 3. Test the Application

Open http://localhost:3000 in your browser.

### 4. Verify Environment Variables

Open browser console (F12) and run:

```javascript
console.log(window._env_);
```

You should see:

```javascript
{
  API_BASE_URL: "http://localhost:8080",
  FLEET_API_BASE_URL: "http://localhost:8081",
  GOOGLE_CLIENT_ID: "182715694192-...",
  MAPBOX_TOKEN: "pk.eyJ1Ijoic3JlZS1yLW9uZSIsImEiOiJjbTY1OTJjemQxc25zMmpvdWQ2MWN2aDlvIn0.VMrL_nkV5-W7-T4AcEY3qA",
  APP_ENV: "production",
  DEBUG: "false"
}
```

### 5. Test Mapbox Integration

- Navigate to the Explore page or Eagle View page
- The map should load correctly
- If there's an issue, check the browser console for errors

### 6. Verify env.js was Generated

```powershell
docker exec <container-name> cat /usr/share/nginx/html/env.js
```

Should output:

```javascript
window._env_ = {
  API_BASE_URL: "http://localhost:8080",
  FLEET_API_BASE_URL: "http://localhost:8081",
  GOOGLE_CLIENT_ID:
    "182715694192-6q156lo1066sf1vi4o99kmfd1b22qqi7.apps.googleusercontent.com",
  MAPBOX_TOKEN:
    "pk.eyJ1Ijoic3JlZS1yLW9uZSIsImEiOiJjbTY1OTJjemQxc25zMmpvdWQ2MWN2aDlvIn0.VMrL_nkV5-W7-T4AcEY3qA",
  APP_ENV: "production",
  DEBUG: "false",
};
```

## Troubleshooting 🔧

### Problem: Build fails with "npm ci" error

**Solution:** The Dockerfile already handles this with fallback to `npm install`

### Problem: MAPBOX_TOKEN not working

**Solution:**

1. Check `frontend.env` has `MAPBOX_TOKEN=your_token`
2. Verify env.js was generated (see step 6 above)
3. Check browser console for `window._env_`
4. Ensure you're using the fixed code from `ExplorePage.tsx`

### Problem: Port 3000 already in use

**Solution:**

```powershell
# Use a different port
docker run -d -p 3001:3000 --env-file ./frontend.env YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

### Problem: Container exits immediately

**Solution:**

```powershell
# Check logs
docker logs <container-name>

# Run interactively to debug
docker run -it --rm --entrypoint /bin/sh YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest
```

## Quick Reference Commands 📚

```powershell
# Build
docker build -t YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest .

# Run locally
docker run -d --name frontend -p 3000:3000 --env-file ./frontend.env YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Push
docker push YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Pull (on another machine)
docker pull YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# Logs
docker logs -f <container-name>

# Stop
docker stop <container-name>

# Remove
docker rm <container-name>

# Check status
docker ps

# Execute command in container
docker exec <container-name> <command>
```

## Deployment on Server 🚀

Once pushed to Docker Hub, deploy on your server:

```bash
# 1. Pull the image
docker pull YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# 2. Create frontend.env on the server with production values
cat > frontend.env << 'EOF'
API_BASE_URL=https://api.yourproduction.com
FLEET_API_BASE_URL=https://fleet-api.yourproduction.com
GOOGLE_CLIENT_ID=your-production-client-id
MAPBOX_TOKEN=your-mapbox-token
APP_ENV=production
DEBUG=false
EOF

# 3. Create network (if needed)
docker network create exploresg-net

# 4. Run the container
docker run -d \
  --name prod-frontend \
  --restart unless-stopped \
  -p 80:3000 \
  --env-file ./frontend.env \
  --network exploresg-net \
  YOUR_DOCKERHUB_USERNAME/exploresg-frontend-service:latest

# 5. Check status
docker ps
docker logs prod-frontend
```

## Next Steps ➡️

1. ✅ Build and test your image locally
2. ✅ Push to Docker Hub
3. ✅ Pull on your production server
4. ✅ Configure production environment variables
5. ✅ Set up SSL/TLS (HTTPS) with nginx or reverse proxy
6. ✅ Configure domain name
7. ✅ Set up monitoring and logging
8. ✅ Configure automated backups

## Related Documentation 📖

- `docs/DOCKER-BUILD-AND-PUSH.md` - Comprehensive guide with all details
- `docs/MAPBOX-TOKEN-RUNTIME-FIX.md` - Fix for runtime env variables
- `Dockerfile` - Multi-stage build configuration
- `docker-compose.yml` - Compose configuration
- `docker-entrypoint.sh` - Runtime env injection script

---

**Remember:** Always test locally before pushing to production! 🎯
