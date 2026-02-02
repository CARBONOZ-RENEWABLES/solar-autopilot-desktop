# Publish to Docker Hub (Public - No Auth Required for Users)

## One-Time Setup

1. Create Docker Hub account at https://hub.docker.com (free)
2. Create public repository: `carbonoz/solarautopilot`

## Build and Push

```bash
# Start Docker Desktop

# Login (one time)
docker login
# Username: carbonoz
# Password: your_password

# Build
cd /Users/digitalaxis/Desktop/SolarAutopilotApp
docker build -t carbonoz/solarautopilot:latest .

# Push (makes it public)
docker push carbonoz/solarautopilot:latest
```

## Users Run (No Login Required)

```bash
# One command - pulls and runs automatically
docker-compose up -d
```

Or without docker-compose:

```bash
docker run -d -p 3000:3000 -p 8000:8000 carbonoz/solarautopilot:latest
```

**That's it!** Public images on Docker Hub don't require authentication to pull.
