#!/bin/bash

# Quick Build and Push Script (Bash)
# Replace YOUR_DOCKERHUB_USERNAME with your actual Docker Hub username

# Configuration
DOCKER_USERNAME="YOUR_DOCKERHUB_USERNAME"  # ⚠️ CHANGE THIS
IMAGE_NAME="exploresg-frontend-service"
VERSION="latest"  # or use "v1.0.0" for versioning

FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

echo "====================================="
echo "Docker Build and Push Script"
echo "====================================="
echo ""

# Check if Docker is running
echo "Checking Docker status..."
if docker ps >/dev/null 2>&1; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Check if logged in to Docker Hub
echo ""
echo "Checking Docker Hub login..."
if docker info 2>&1 | grep -q "Username"; then
    echo "✅ Logged in to Docker Hub"
else
    echo "⚠️  Not logged in to Docker Hub"
    echo "Running: docker login"
    docker login
    if [ $? -ne 0 ]; then
        echo "❌ Login failed"
        exit 1
    fi
fi

# Check if frontend.env exists
echo ""
echo "Checking frontend.env file..."
if [ -f "./frontend.env" ]; then
    echo "✅ frontend.env found"
    
    # Display env vars (masked)
    echo ""
    echo "Environment variables in frontend.env:"
    while IFS='=' read -r key value; do
        if [[ $key == *"TOKEN"* ]] || [[ $key == *"CLIENT_ID"* ]]; then
            if [ ${#value} -gt 20 ]; then
                masked="${value:0:10}...${value: -6}"
                echo "  $key=$masked"
            else
                echo "  $key=$value"
            fi
        else
            echo "  $key=$value"
        fi
    done < frontend.env
else
    echo "❌ frontend.env not found!"
    echo "Please create frontend.env with required variables"
    exit 1
fi

# Build the image
echo ""
echo "====================================="
echo "Building Docker image..."
echo "Image: $FULL_IMAGE_NAME"
echo "====================================="
echo ""

docker build -t "$FULL_IMAGE_NAME" .

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build successful!"

# Show image info
echo ""
echo "Image details:"
docker images "$FULL_IMAGE_NAME"

# Ask if user wants to test locally
echo ""
read -p "Do you want to test the image locally before pushing? (y/n) " test

if [ "$test" = "y" ] || [ "$test" = "Y" ]; then
    echo ""
    echo "Starting test container..."
    echo "Container name: test-frontend"
    echo "Port: 3000"
    echo ""
    
    # Stop and remove existing test container if it exists
    docker stop test-frontend 2>/dev/null
    docker rm test-frontend 2>/dev/null
    
    # Run the container
    docker run -d \
        --name test-frontend \
        -p 3000:3000 \
        --env-file ./frontend.env \
        "$FULL_IMAGE_NAME"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Container started successfully!"
        echo ""
        echo "Test your application at: http://localhost:3000"
        echo ""
        echo "Showing container logs (Ctrl+C to stop viewing logs):"
        echo ""
        
        sleep 2
        docker logs -f test-frontend
        
        # After user stops viewing logs
        echo ""
        read -p "Do you want to stop and remove the test container? (y/n) " cleanup
        if [ "$cleanup" = "y" ] || [ "$cleanup" = "Y" ]; then
            docker stop test-frontend
            docker rm test-frontend
            echo "✅ Test container removed"
        else
            echo "Test container is still running. To stop it manually:"
            echo "  docker stop test-frontend"
            echo "  docker rm test-frontend"
        fi
    else
        echo "❌ Failed to start container"
        exit 1
    fi
fi

# Ask if user wants to push to Docker Hub
echo ""
read -p "Do you want to push the image to Docker Hub? (y/n) " push

if [ "$push" = "y" ] || [ "$push" = "Y" ]; then
    echo ""
    echo "====================================="
    echo "Pushing to Docker Hub..."
    echo "====================================="
    echo ""
    
    docker push "$FULL_IMAGE_NAME"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to Docker Hub!"
        echo ""
        echo "Your image is available at:"
        echo "  https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
        echo ""
        echo "To pull this image on another machine:"
        echo "  docker pull $FULL_IMAGE_NAME"
        echo ""
        echo "To run this image:"
        echo "  docker run -d --name prod-frontend -p 3000:3000 --env-file ./frontend.env $FULL_IMAGE_NAME"
    else
        echo ""
        echo "❌ Push failed"
        exit 1
    fi
else
    echo ""
    echo "Image built but not pushed to Docker Hub"
    echo "To push manually later:"
    echo "  docker push $FULL_IMAGE_NAME"
fi

echo ""
echo "====================================="
echo "Done!"
echo "====================================="
