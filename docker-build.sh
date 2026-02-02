#!/bin/bash

# CARBONOZ SolarAutopilot - Docker Build & Publish Script

set -e

VERSION=${1:-latest}
DOCKER_USERNAME=${DOCKER_USERNAME:-carbonoz}
IMAGE_NAME="solarautopilot"

echo "🐳 Building CARBONOZ SolarAutopilot Docker Image"
echo "Version: $VERSION"
echo ""

# Build the image
echo "📦 Building Docker image..."
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} .

# Tag as latest if version is specified
if [ "$VERSION" != "latest" ]; then
    echo "🏷️  Tagging as latest..."
    docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "To push to Docker Hub:"
echo "  docker login"
echo "  docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
if [ "$VERSION" != "latest" ]; then
    echo "  docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
fi
echo ""
echo "To test locally:"
echo "  docker-compose up -d"
