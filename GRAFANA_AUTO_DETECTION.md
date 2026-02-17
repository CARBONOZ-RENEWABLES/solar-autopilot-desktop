# Grafana Auto-Detection Fix

## Problem
The Grafana dashboards were showing "localhost refused to connect" errors because the application was using hardcoded URLs (`http://localhost:3001`) that didn't work in all deployment scenarios.

## Solution
Implemented automatic Grafana URL detection that works across all platforms and deployment methods.

## What Was Changed

### 1. Backend (server.js)
- **Dynamic URL Detection**: Added `detectGrafanaUrl()` function that automatically finds the correct Grafana instance
- **Multiple URL Support**: Checks multiple possible Grafana URLs:
  - `http://localhost:3001` (Desktop/local)
  - `http://127.0.0.1:3001` (Alternative local)
  - `http://carbonoz-grafana:3000` (Docker network)
  - `http://solarautopilot-grafana:3000` (Alternative Docker)
- **API Endpoint**: Added `/api/grafana/url` endpoint to provide the correct URL to frontend
- **Dynamic Proxy**: Updated Grafana proxy to use dynamic target URL

### 2. Frontend (EnergyDashboard.jsx & Chart.jsx)
- **Dynamic URL Fetching**: Frontend now fetches Grafana URL from backend API on load
- **State Management**: Added `grafanaUrl` state to store the detected URL
- **All iframes Updated**: Replaced all hardcoded URLs with dynamic `grafanaUrl` variable

## How It Works

1. **On Server Start**:
   ```javascript
   detectGrafanaUrl() → Tests multiple URLs → Sets GRAFANA_URL
   ```

2. **Frontend Requests**:
   ```javascript
   fetch('/api/grafana/url') → Gets correct URL → Updates all iframes
   ```

3. **Automatic Fallback**:
   - If detection fails, defaults to `http://localhost:3001`
   - Ensures system always works even if Grafana isn't running yet

## Benefits

✅ **Works Everywhere**: Automatically adapts to Docker, desktop, or any deployment
✅ **No Configuration**: Users don't need to manually set Grafana URLs
✅ **Resilient**: Falls back to safe defaults if detection fails
✅ **Future-Proof**: Easy to add new URL patterns as needed

## Testing

### Test 1: Docker Deployment
```bash
docker run -d --name carbonoz-solarautopilot \
  -p 3000:3000 -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  elitedesire/solarautopilot:latest
```
**Expected**: Grafana dashboards load correctly on `http://localhost:3000`

### Test 2: Desktop App
```bash
npm start
```
**Expected**: Grafana dashboards load correctly in Electron app

### Test 3: Manual Grafana Port
```bash
docker run -d --name grafana -p 3002:3000 grafana/grafana
GRAFANA_URL=http://localhost:3002 npm start
```
**Expected**: System detects and uses port 3002

## Environment Variables

You can override auto-detection by setting:
```bash
export GRAFANA_URL=http://your-grafana-url:port
```

## Troubleshooting

### Dashboards Still Not Loading?

1. **Check Grafana is Running**:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check Backend Logs**:
   Look for: `✅ Grafana detected at: http://...`

3. **Check Frontend Console**:
   Look for: `Grafana URL set to: http://...`

4. **Manual Override**:
   ```bash
   export GRAFANA_URL=http://localhost:3001
   docker restart carbonoz-solarautopilot
   ```

### Docker Network Issues?

If using Docker Compose, ensure containers are on the same network:
```yaml
networks:
  solarautopilot-network:
    driver: bridge
```

## API Reference

### GET /api/grafana/url
Returns the detected Grafana URL for frontend use.

**Response**:
```json
{
  "success": true,
  "url": "http://localhost:3001",
  "internalUrl": "http://carbonoz-grafana:3000"
}
```

- `url`: URL for browser/frontend to use
- `internalUrl`: URL backend uses for proxying

## Future Enhancements

- [ ] Add health check retry logic
- [ ] Support custom Grafana authentication
- [ ] Add Grafana connection status indicator in UI
- [ ] Support multiple Grafana instances

## Related Files

- `/server.js` - Backend detection logic
- `/frontend/src/pages/EnergyDashboard.jsx` - Dashboard iframes
- `/frontend/src/pages/Chart.jsx` - Chart page iframes
- `/desktop/docker-manager.js` - Docker container management

## Version History

- **v1.0.1**: Initial auto-detection implementation
- **v1.0.2**: Added multiple URL fallbacks
- **v1.0.3**: Added API endpoint for frontend

---

**Note**: This fix ensures Grafana dashboards work automatically in all deployment scenarios without manual configuration.
