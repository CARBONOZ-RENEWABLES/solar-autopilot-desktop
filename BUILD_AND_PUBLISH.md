# Build and Publish to Docker Hub

## Prerequisites
1. Docker Desktop installed and running
2. Docker Hub account (create at https://hub.docker.com)

## Steps

### 1. Start Docker
```bash
# macOS: Open Docker Desktop app
# Linux: sudo systemctl start docker
# Verify: docker ps
```

### 2. Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username and password
```

### 3. Build the Image
```bash
cd /Users/digitalaxis/Desktop/SolarAutopilotApp
docker build -t carbonoz/solarautopilot:1.0.0 .
docker tag carbonoz/solarautopilot:1.0.0 carbonoz/solarautopilot:latest
```

### 4. Push to Docker Hub
```bash
docker push carbonoz/solarautopilot:1.0.0
docker push carbonoz/solarautopilot:latest
```

### 5. Test Locally
```bash
docker-compose up -d
# Open http://localhost:3000
```

## User Instructions (After Publishing)

Users can now run your app with just:

```bash
# Download docker-compose.yml
curl -O https://raw.githubusercontent.com/eelitedesire/SolarAutopilotApp/main/docker-compose.yml

# Start
docker-compose up -d

# Access at http://localhost:3000
```

Or even simpler:

```bash
docker run -d \
  -p 3000:3000 \
  -p 8000:8000 \
  --name solarautopilot \
  carbonoz/solarautopilot:latest
```

## Update README.md

Add this to your GitHub README:

```markdown
## 🐳 Docker Installation (Recommended)

### Quick Start
\`\`\`bash
curl -O https://raw.githubusercontent.com/eelitedesire/SolarAutopilotApp/main/docker-compose.yml
docker-compose up -d
\`\`\`

Access at: **http://localhost:3000**

Configure everything in the web UI!
\`\`\`
```
