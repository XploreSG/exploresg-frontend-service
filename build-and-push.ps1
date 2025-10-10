# Quick Build and Push Script
# Replace YOUR_DOCKERHUB_USERNAME with your actual Docker Hub username

# Configuration
$DOCKER_USERNAME = "YOUR_DOCKERHUB_USERNAME"  # ⚠️ CHANGE THIS
$IMAGE_NAME = "exploresg-frontend-service"
$VERSION = "latest"  # or use "v1.0.0" for versioning

$FULL_IMAGE_NAME = "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Docker Build and Push Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if logged in to Docker Hub
Write-Host ""
Write-Host "Checking Docker Hub login..." -ForegroundColor Yellow
$dockerInfo = docker info 2>&1 | Select-String "Username"
if ($dockerInfo) {
    Write-Host "✅ Logged in to Docker Hub" -ForegroundColor Green
} else {
    Write-Host "⚠️  Not logged in to Docker Hub" -ForegroundColor Yellow
    Write-Host "Running: docker login" -ForegroundColor Cyan
    docker login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed" -ForegroundColor Red
        exit 1
    }
}

# Check if frontend.env exists
Write-Host ""
Write-Host "Checking frontend.env file..." -ForegroundColor Yellow
if (Test-Path ".\frontend.env") {
    Write-Host "✅ frontend.env found" -ForegroundColor Green
    
    # Display env vars (masked)
    Write-Host ""
    Write-Host "Environment variables in frontend.env:" -ForegroundColor Cyan
    Get-Content ".\frontend.env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1]
            $value = $matches[2]
            if ($key -like "*TOKEN*" -or $key -like "*CLIENT_ID*") {
                if ($value.Length -gt 20) {
                    $masked = $value.Substring(0, 10) + "..." + $value.Substring($value.Length - 6)
                    Write-Host "  $key=$masked" -ForegroundColor Gray
                } else {
                    Write-Host "  $key=$value" -ForegroundColor Gray
                }
            } else {
                Write-Host "  $key=$value" -ForegroundColor Gray
            }
        }
    }
} else {
    Write-Host "❌ frontend.env not found!" -ForegroundColor Red
    Write-Host "Please create frontend.env with required variables" -ForegroundColor Yellow
    exit 1
}

# Build the image
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Building Docker image..." -ForegroundColor Yellow
Write-Host "Image: $FULL_IMAGE_NAME" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

docker build -t $FULL_IMAGE_NAME .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful!" -ForegroundColor Green

# Show image info
Write-Host ""
Write-Host "Image details:" -ForegroundColor Cyan
docker images $FULL_IMAGE_NAME

# Ask if user wants to test locally
Write-Host ""
$test = Read-Host "Do you want to test the image locally before pushing? (y/n)"

if ($test -eq "y" -or $test -eq "Y") {
    Write-Host ""
    Write-Host "Starting test container..." -ForegroundColor Yellow
    Write-Host "Container name: test-frontend" -ForegroundColor Cyan
    Write-Host "Port: 3000" -ForegroundColor Cyan
    Write-Host ""
    
    # Stop and remove existing test container if it exists
    docker stop test-frontend 2>$null
    docker rm test-frontend 2>$null
    
    # Run the container
    docker run -d `
        --name test-frontend `
        -p 3000:3000 `
        --env-file ./frontend.env `
        $FULL_IMAGE_NAME
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Container started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Test your application at: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Showing container logs (Ctrl+C to stop viewing logs):" -ForegroundColor Yellow
        Write-Host ""
        
        Start-Sleep -Seconds 2
        docker logs -f test-frontend
        
        # After user stops viewing logs
        Write-Host ""
        $cleanup = Read-Host "Do you want to stop and remove the test container? (y/n)"
        if ($cleanup -eq "y" -or $cleanup -eq "Y") {
            docker stop test-frontend
            docker rm test-frontend
            Write-Host "✅ Test container removed" -ForegroundColor Green
        } else {
            Write-Host "Test container is still running. To stop it manually:" -ForegroundColor Yellow
            Write-Host "  docker stop test-frontend" -ForegroundColor Gray
            Write-Host "  docker rm test-frontend" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Failed to start container" -ForegroundColor Red
        exit 1
    }
}

# Ask if user wants to push to Docker Hub
Write-Host ""
$push = Read-Host "Do you want to push the image to Docker Hub? (y/n)"

if ($push -eq "y" -or $push -eq "Y") {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "Pushing to Docker Hub..." -ForegroundColor Yellow
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    
    docker push $FULL_IMAGE_NAME
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully pushed to Docker Hub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your image is available at:" -ForegroundColor Cyan
        Write-Host "  https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}" -ForegroundColor Gray
        Write-Host ""
        Write-Host "To pull this image on another machine:" -ForegroundColor Cyan
        Write-Host "  docker pull $FULL_IMAGE_NAME" -ForegroundColor Gray
        Write-Host ""
        Write-Host "To run this image:" -ForegroundColor Cyan
        Write-Host "  docker run -d --name prod-frontend -p 3000:3000 --env-file ./frontend.env $FULL_IMAGE_NAME" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "❌ Push failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "Image built but not pushed to Docker Hub" -ForegroundColor Yellow
    Write-Host "To push manually later:" -ForegroundColor Cyan
    Write-Host "  docker push $FULL_IMAGE_NAME" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Done!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
