# 🐳 Docker Deployment - CARBONOZ SolarAutopilot

## Quick Start

```bash
docker pull elitedesire/solarautopilot:latest
docker run -d -p 3000:3000 -p 8000:8000 elitedesire/solarautopilot:latest
```

## Full Stack with Docker Compose

```bash
git clone https://github.com/eelitedesire/SolarAutopilotApp.git
cd SolarAutopilotApp
docker-compose up -d
```

## Access Points

- **Main App:** http://localhost:3000
- **Grafana:** http://localhost:3001 (admin/admin)
- **InfluxDB:** http://localhost:8086

## Docker Hub

**Repository:** https://hub.docker.com/r/elitedesire/solarautopilot
**Pull Command:** `docker pull elitedesire/solarautopilot:latest`