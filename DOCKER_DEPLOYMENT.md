# CARBONOZ SolarAutopilot - Docker Deployment

## Quick Start (One Command)

```bash
# Download and start
curl -O https://raw.githubusercontent.com/eelitedesire/SolarAutopilotApp/main/docker-compose.yml
docker-compose up -d
```

**That's it!** Access the app at: **http://localhost:3000**

Configure everything in the UI:
- Go to Settings → Configuration
- Enter MQTT broker details
- Set inverter/battery count
- Configure Tibber API (optional)

## What's Included

- ✅ SolarAutopilot Web UI (port 3000)
- ✅ InfluxDB Database (port 8086)
- ✅ Grafana Dashboard (port 3001)
- ✅ Automatic restarts
- ✅ Persistent data storage

## Access Services

- **SolarAutopilot**: http://localhost:3000
- **Grafana**: http://localhost:3001 (admin/admin)

## Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f solarautopilot

# Update to latest version
docker-compose pull
docker-compose up -d

# Restart
docker-compose restart
```

## Configuration

All configuration is done via the web UI at http://localhost:3000/settings

No manual file editing required!

## Troubleshooting

### Check if running
```bash
docker-compose ps
```

### View logs
```bash
docker-compose logs -f
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d
```
