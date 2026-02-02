#!/bin/bash

# CARBONOZ SolarAutopilot - Docker Push Script
# This script builds and pushes the Docker image to Docker Hub

set -e

# Configuration
DOCKER_USERNAME="elitedesire"
DOCKER_REPO="solarautopilot"
TAG="${1:-latest}"

echo "🐳 CARBONOZ SolarAutopilot - Docker Build & Push"
echo "================================================"
echo "Repository: ${DOCKER_USERNAME}/${DOCKER_REPO}"
echo "Tag: ${TAG}"
echo ""

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "Umwukawanjye@12" | docker login -u "${DOCKER_USERNAME}" --password-stdin

# Build the Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t ${DOCKER_USERNAME}/${DOCKER_REPO}:${TAG} .

# Tag as latest if not already
if [ "$TAG" != "latest" ]; then
    echo "🏷️  Tagging as latest..."
    docker tag ${DOCKER_USERNAME}/${DOCKER_REPO}:${TAG} ${DOCKER_USERNAME}/${DOCKER_REPO}:latest
fi

# Push to Docker Hub
echo ""
echo "📤 Pushing to Docker Hub..."
docker push ${DOCKER_USERNAME}/${DOCKER_REPO}:${TAG}

if [ "$TAG" != "latest" ]; then
    docker push ${DOCKER_USERNAME}/${DOCKER_REPO}:latest
fi

echo ""
echo "✅ Successfully pushed to Docker Hub!"
echo "   Image: ${DOCKER_USERNAME}/${DOCKER_REPO}:${TAG}"
echo ""
echo "🚀 To run the container:"
echo "   docker run -d -p 48732:48732 -p 8000:8000 ${DOCKER_USERNAME}/${DOCKER_REPO}:${TAG}"
echo ""
echo "🌐 Access the application:"
echo "   http://localhost:48732"
echo "   http://solarautopilot.local:48732 (if mDNS is configured)"
echo "   http://<your-ip>:48732"
