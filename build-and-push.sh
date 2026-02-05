#!/bin/bash

set -e

# Configuration
IMAGE_NAME="elitedesire/solarautopilot"
VERSION=$(date +%Y%m%d-%H%M%S)

echo "🏗️  Building Docker image..."
echo "📦 Image: $IMAGE_NAME"
echo "🏷️  Version: $VERSION"
echo ""

# Build the image
docker build -t $IMAGE_NAME:latest -t $IMAGE_NAME:$VERSION .

echo ""
echo "✅ Build complete!"
echo ""
echo "🏷️  Tagged as:"
echo "   - $IMAGE_NAME:latest"
echo "   - $IMAGE_NAME:$VERSION"
echo ""

# Push to Docker Hub
read -p "🚀 Push to Docker Hub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Pushing $IMAGE_NAME:latest..."
    docker push $IMAGE_NAME:latest
    
    echo "📤 Pushing $IMAGE_NAME:$VERSION..."
    docker push $IMAGE_NAME:$VERSION
    
    echo ""
    echo "✅ Push complete!"
    echo ""
    echo "🎯 Pull command:"
    echo "   docker pull $IMAGE_NAME:latest"
    echo "   docker pull $IMAGE_NAME:$VERSION"
else
    echo "⏭️  Skipped push"
fi

echo ""
echo "🔄 To update running container:"
echo "   docker stop carbonoz-solarautopilot"
echo "   docker rm carbonoz-solarautopilot"
echo "   docker run -d --name carbonoz-solarautopilot \\"
echo "     -p 3000:3000 -p 8000:8000 \\"
echo "     -v /var/run/docker.sock:/var/run/docker.sock \\"
echo "     -v solarautopilot-data:/app/data \\"
echo "     -v solarautopilot-logs:/app/logs \\"
echo "     --restart unless-stopped \\"
echo "     $IMAGE_NAME:latest"
