# Docker Hub Setup Guide

## Step 1: Create Repository on Docker Hub

1. Go to https://hub.docker.com
2. Sign in with your account (elitedesire0@gmail.com)
3. Click "Create Repository"
4. Repository name: `solarautopilot`
5. Description: `CARBONOZ SolarAutopilot - AI-Powered Solar Battery Charging System`
6. Visibility: **Public** (so users can pull without login)
7. Click "Create"

## Step 2: Push Your Image

Once the repository is created, run:

```bash
# Build and push the image
bash docker-publish.sh
```

## Step 3: Verify

Your image will be available at:
- **Docker Hub URL:** https://hub.docker.com/r/elitedesire0/solarautopilot
- **Pull Command:** `docker pull elitedesire0/solarautopilot:latest`

## Step 4: Update Documentation

Update your README.md with the new Docker Hub repository:

```markdown
## 🐳 Docker Installation

### Quick Start
```bash
docker run -d -p 3000:3000 -p 8000:8000 elitedesire0/solarautopilot:latest
```

### With Docker Compose
```bash
git clone https://github.com/eelitedesire/SolarAutopilotApp.git
cd SolarAutopilotApp
docker-compose up -d
```
```

## Next Steps

After creating the repository on Docker Hub:
1. Run `bash docker-publish.sh` to push the image
2. Test with `docker pull elitedesire0/solarautopilot:latest`
3. Update your project documentation