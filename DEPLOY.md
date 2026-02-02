# SolarAutopilot Deployment Guide

## Quick Deploy (Automated)
```bash
./deploy.sh
```

## Manual Steps

### 1. Build Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### 2. Build Desktop App (Optional - for releases)
```bash
cd desktop
npm install
npm run dist
cd ..
```

### 3. Git Commit and Tag
```bash
# Stage all changes
git add .

# Commit with message
git commit -m "feat: cheapest price charging + config auto-apply + message filters"

# Create version tag
git tag -a v1.2.0 -m "Release v1.2.0 - Cheapest price charging"

# Push to GitHub
git push origin main
git push origin v1.2.0
```

### 4. Docker Build and Push
```bash
# Build Docker image
docker build -t elitedesire/solarautopilot:latest .

# Tag with version
docker tag elitedesire/solarautopilot:latest elitedesire/solarautopilot:v1.2.0

# Push to Docker Hub
docker push elitedesire/solarautopilot:latest
docker push elitedesire/solarautopilot:v1.2.0
```

## What's New in This Release

### Features
- ✅ Configuration auto-apply (no restart required)
- ✅ Real server-side message filtering by inverter/battery/total/load/pv/grid
- ✅ Price display in cents (¢) instead of euros
- ✅ AI charges only at absolute cheapest price (0th percentile)
- ✅ SMARD timeout reduced to 5 seconds

### Improvements
- Dynamic category generation based on user config
- Immediate config updates via WebSocket broadcast
- Better price optimization strategy
- Faster fallback to alternative pricing sources

## Docker Hub
https://hub.docker.com/repository/docker/elitedesire/solarautopilot/

## GitHub
https://github.com/eelitedesire/SolarAutopilotApp
