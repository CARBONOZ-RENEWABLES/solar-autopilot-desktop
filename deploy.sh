#!/bin/bash

# SolarAutopilot Build and Deploy Script
set -e

echo "🚀 Starting SolarAutopilot Build and Deploy Process..."

# Get version from user or use default
read -p "Enter version tag (e.g., v1.2.3): " VERSION
if [ -z "$VERSION" ]; then
    VERSION="v1.0.0"
fi

echo "📦 Version: $VERSION"

# 1. Build Frontend
echo ""
echo "🎨 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Build Desktop App
echo ""
echo "🖥️  Building Desktop App..."
cd desktop
npm install
npm run dist
cd ..

# 3. Git Operations
echo ""
echo "📝 Git Operations..."
git add .
read -p "Enter commit message: " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update: $VERSION"
fi
git commit -m "$COMMIT_MSG"
git tag -a "$VERSION" -m "Release $VERSION"
git push origin main
git push origin "$VERSION"

# 4. Docker Build and Push
echo ""
echo "🐳 Building and Pushing Docker Image..."
docker build -t elitedesire/solarautopilot:latest .
docker tag elitedesire/solarautopilot:latest elitedesire/solarautopilot:$VERSION
docker push elitedesire/solarautopilot:latest
docker push elitedesire/solarautopilot:$VERSION

echo ""
echo "✅ Deployment Complete!"
echo "   • Version: $VERSION"
echo "   • GitHub: https://github.com/eelitedesire/SolarAutopilotApp"
echo "   • Docker Hub: https://hub.docker.com/r/elitedesire/solarautopilot"
