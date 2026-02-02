#!/bin/bash

# CARBONOZ SolarAutopilot - Docker Publish Script
# This script builds and pushes the Docker image to Docker Hub

set -e

echo "🐳 CARBONOZ SolarAutopilot - Docker Publish"
echo "=========================================="

# Configuration
DOCKER_USERNAME="elitedesire"
IMAGE_NAME="solarautopilot"
TAG="latest"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "📦 Building Docker image: ${FULL_IMAGE_NAME}"
docker build -t ${FULL_IMAGE_NAME} .

echo "✅ Build completed successfully!"

echo "🚀 Pushing to Docker Hub..."
docker push ${FULL_IMAGE_NAME}

echo "✅ Successfully pushed ${FULL_IMAGE_NAME} to Docker Hub!"
echo ""
echo "🎉 Your image is now available publicly at:"
echo "   docker pull ${FULL_IMAGE_NAME}"
echo ""
echo "📋 To run the application:"
echo "   docker-compose up -d"
echo ""
echo "🌐 Access the application at:"
echo "   - Main App: http://localhost:3000"
echo "   - Grafana: http://localhost:3001"