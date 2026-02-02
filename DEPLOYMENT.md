# CARBONOZ SolarAutopilot - Deployment Guide

## 🚀 Quick Start

Your server is now configured to run on **port 48732**.

### Access URLs:
- **Local:** http://localhost:48732
- **Network:** http://<your-ip>:48732
- **Hostname:** http://solarautopilot.local:48732 (requires mDNS/Avahi)

---

## 📦 Docker Deployment

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Push to Docker Hub

```bash
# Build and push with automatic tag
./docker-push.sh

# Build and push with custom tag
./docker-push.sh v1.0.0
```

**Docker Hub Repository:** `elitedesire/solarautopilot`

### Option 3: Pull and Run from Docker Hub

```bash
# Pull the latest image
docker pull elitedesire/solarautopilot:latest

# Run the container
docker run -d \
  --name solarautopilot \
  -p 48732:48732 \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  elitedesire/solarautopilot:latest
```

---

## 🌐 Network Access Configuration

### Enable mDNS/Avahi (for solarautopilot.local)

#### On Linux (Ubuntu/Debian):
```bash
# Install Avahi
sudo apt-get update
sudo apt-get install avahi-daemon avahi-utils

# Start Avahi service
sudo systemctl start avahi-daemon
sudo systemctl enable avahi-daemon

# Verify
avahi-browse -a
```

#### On macOS:
mDNS (Bonjour) is built-in, no configuration needed.

#### On Windows:
Install Bonjour Print Services or use IP address directly.

### Configure Hostname Resolution

Add to `/etc/hosts` (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
<your-server-ip>  solarautopilot.local
```

---

## 🔧 Port Configuration

The application now uses:
- **Frontend/API:** Port 48732
- **WebSocket:** Port 8000
- **InfluxDB:** Port 8086 (internal)
- **Grafana:** Port 3001 (internal)

### Firewall Configuration

```bash
# Ubuntu/Debian
sudo ufw allow 48732/tcp
sudo ufw allow 8000/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=48732/tcp
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload
```

---

## 🐳 Docker Hub Credentials

**Username:** elitedesire  
**Email:** elitedesire0@gmail.com  
**Repository:** https://hub.docker.com/r/elitedesire/solarautopilot

### Manual Docker Login

```bash
docker login -u elitedesire
# Password: Umwukawanjye@12
```

---

## 📝 Environment Variables

Create a `.env` file for custom configuration:

```env
# Server Configuration
PORT=48732
NODE_ENV=production

# Database
INFLUXDB_HOST=influxdb
INFLUXDB_PORT=8086
INFLUXDB_DATABASE=solarautopilot

# MQTT Configuration
MQTT_HOST=your-mqtt-broker
MQTT_PORT=1883
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password
```

---

## 🔄 Update Deployment

### Update from Docker Hub:
```bash
# Pull latest version
docker pull elitedesire/solarautopilot:latest

# Stop and remove old container
docker stop solarautopilot
docker rm solarautopilot

# Run new version
docker run -d \
  --name solarautopilot \
  -p 48732:48732 \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  elitedesire/solarautopilot:latest
```

### Update with Docker Compose:
```bash
docker-compose pull
docker-compose up -d
```

---

## 🧪 Testing

### Test Local Access:
```bash
curl http://localhost:48732/api/health
```

### Test Network Access:
```bash
curl http://<your-ip>:48732/api/health
```

### Test Hostname Access:
```bash
curl http://solarautopilot.local:48732/api/health
```

---

## 📊 Monitoring

### View Container Logs:
```bash
docker logs -f carbonoz-solarautopilot
```

### Check Container Status:
```bash
docker ps | grep solarautopilot
```

### Monitor Resource Usage:
```bash
docker stats carbonoz-solarautopilot
```

---

## 🛠️ Troubleshooting

### Port Already in Use:
```bash
# Find process using port 48732
sudo lsof -i :48732

# Kill the process
sudo kill -9 <PID>
```

### Cannot Access via Hostname:
1. Check Avahi/mDNS is running
2. Verify hostname resolution: `ping solarautopilot.local`
3. Use IP address as fallback

### Docker Build Fails:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

## 🔐 Security Recommendations

1. **Change default passwords** in Grafana and InfluxDB
2. **Use HTTPS** in production (configure reverse proxy)
3. **Restrict network access** with firewall rules
4. **Keep Docker images updated** regularly
5. **Use secrets management** for sensitive data

---

## 📞 Support

- **Website:** https://carbonoz.com
- **Documentation:** See README.md
- **Issues:** https://github.com/eelitedesire/SolarAutopilotApp/issues

---

## ✅ Deployment Checklist

- [ ] Server configured for port 48732
- [ ] Docker installed and running
- [ ] Firewall rules configured
- [ ] mDNS/Avahi configured (optional)
- [ ] Docker Hub credentials verified
- [ ] Environment variables set
- [ ] Data volumes configured
- [ ] Application tested locally
- [ ] Application tested on network
- [ ] Monitoring configured
- [ ] Backup strategy in place

---

**Last Updated:** $(date)
**Version:** 1.0.0
