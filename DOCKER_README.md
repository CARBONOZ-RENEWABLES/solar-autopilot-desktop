# CARBONOZ SolarAutopilot - Standalone Application

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports 80, 3000, 3001, 6379, 8086 available

### Production Deployment
```bash
./start.sh
```

### Development Mode
```bash
./start-dev.sh
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | React.js UI |
| Backend | 3000 | Node.js API |
| Grafana | 3001 | Analytics Dashboard |
| InfluxDB | 8086 | Time Series Database |
| Redis | 6379 | Cache & Sessions |

## Configuration

1. Copy `.env` and update with your API keys:
   - Tibber API token
   - Telegram bot credentials
   - Security secrets

2. Configure your solar system in the web interface

## Management Commands

```bash
# View logs
docker-compose logs -f [service]

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Update and rebuild
docker-compose up --build -d

# Clean up
docker-compose down -v
docker system prune -f
```

## Access URLs

- **Main App**: http://localhost
- **Grafana**: http://localhost/grafana (admin/solarautopilot123)
- **API**: http://localhost/api
- **InfluxDB**: http://localhost:8086

## Data Persistence

All data is stored in Docker volumes:
- `influxdb_data`: Time series data
- `grafana_data`: Dashboards and settings
- `redis_data`: Cache and sessions