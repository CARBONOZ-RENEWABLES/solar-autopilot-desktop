# Quick Fix: Grafana Dashboard Not Loading

## Problem
You see "localhost refused to connect" in the dashboard panels.

## Solution
The system now automatically detects and connects to Grafana. Just follow these steps:

### For Docker Users

1. **Restart the container**:
   ```bash
   docker restart carbonoz-solarautopilot
   ```

2. **Wait 30 seconds** for Grafana to start

3. **Refresh your browser** at `http://localhost:3000`

4. **Check if Grafana is accessible**:
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"database":"ok"}`

### For Desktop App Users

1. **Restart the application**

2. **Wait for "Grafana detected" message** in logs

3. **Dashboards should load automatically**

### Still Not Working?

#### Check 1: Is Grafana Running?
```bash
docker ps | grep grafana
```
Should show a running container.

#### Check 2: Is Port 3001 Available?
```bash
lsof -i :3001
```
Should show Grafana using the port.

#### Check 3: Manual Start Grafana
```bash
docker run -d --name solarautopilot-grafana \
  -p 3001:3000 \
  -e GF_SECURITY_ADMIN_PASSWORD=admin \
  -e GF_AUTH_ANONYMOUS_ENABLED=true \
  -e GF_AUTH_ANONYMOUS_ORG_ROLE=Admin \
  grafana/grafana:latest
```

#### Check 4: View Logs
```bash
# Docker
docker logs carbonoz-solarautopilot | grep -i grafana

# Desktop
Check console for "Grafana detected at:" message
```

### Force Specific URL (Advanced)

If auto-detection fails, you can force a specific URL:

```bash
# Docker
docker run -d \
  --name carbonoz-solarautopilot \
  -p 3000:3000 -p 8000:8000 \
  -e GRAFANA_URL=http://localhost:3001 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  elitedesire/solarautopilot:latest

# Desktop
export GRAFANA_URL=http://localhost:3001
npm start
```

## What Changed?

The system now:
- ✅ Automatically finds Grafana wherever it's running
- ✅ Works with Docker, desktop, and custom deployments
- ✅ Falls back to safe defaults if detection fails
- ✅ No manual configuration needed

## Need More Help?

1. Check full documentation: [GRAFANA_AUTO_DETECTION.md](GRAFANA_AUTO_DETECTION.md)
2. Open an issue: [GitHub Issues](https://github.com/eelitedesire/SolarAutopilotApp/issues)
3. Join our community: [Discord/Forum Link]

---

**Quick Test**: Open `http://localhost:3001` in your browser. If you see Grafana login, it's working!
