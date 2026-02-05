# 🐳 CARBONOZ SolarAutopilot - Docker Quick Start

## Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))

## Quick Start - Single Command

### Option 1: Docker Run (Simplest)
```bash
docker run -d \
  --name carbonoz-solarautopilot \
  -p 3000:3000 \
  -p 8000:8000 \
  -p 8087:8087 \
  -p 3001:3001 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v solarautopilot-data:/app/data \
  -v solarautopilot-logs:/app/logs \
  --restart unless-stopped \
  elitedesire/solarautopilot:latest
```

### Option 2: Docker Compose
```bash
curl -O https://raw.githubusercontent.com/eelitedesire/SolarAutopilotApp/main/docker-compose.standalone.yml
mv docker-compose.standalone.yml docker-compose.yml
docker-compose up -d
```

That's it! 🎉

## What Happens Automatically

When you run the container, it automatically:
1. ✅ Starts InfluxDB database container
2. ✅ Starts Grafana dashboard container
3. ✅ Configures networking between services
4. ✅ Initializes database
5. ✅ Starts SolarAutopilot application

**Ready in ~30 seconds!**

## Manage Services

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Update to Latest Version
```bash
docker-compose pull
docker-compose up -d
```

## Data Persistence

Your data is stored in Docker volumes:
- `app-data` - Application data and configuration
- `app-logs` - Application logs
- `influxdb-data` - Time-series database
- `grafana-data` - Grafana dashboards and settings

Data persists even when containers are stopped or removed.

## Troubleshooting

### Port Already in Use
If you see "port is already allocated":
```bash
# Change ports in docker-compose.yml
ports:
  - "3100:3000"  # Change 3000 to 3100
```

### Reset Everything
```bash
docker-compose down -v  # Warning: Deletes all data!
docker-compose up -d
```

### Check Container Status
```bash
docker-compose ps
```

## Configuration

Edit `options.json` in the app data volume or configure via the web UI at http://localhost:3000/settings

## Support

- 🌐 Website: [carbonoz.com](https://carbonoz.com)
- 🐛 Issues: [GitHub Issues](https://github.com/eelitedesire/SolarAutopilotApp/issues)
- 📚 Documentation: [Full Docs](https://github.com/eelitedesire/SolarAutopilotApp)
