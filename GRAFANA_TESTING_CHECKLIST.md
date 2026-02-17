# Grafana Auto-Detection Testing Checklist

## Pre-Testing Setup

- [ ] Backup current codebase
- [ ] Stop all running containers
- [ ] Clear Docker volumes (optional, for clean test)
  ```bash
  docker volume prune
  ```

## Test 1: Fresh Docker Deployment

### Steps
1. [ ] Pull latest image
   ```bash
   docker pull elitedesire/solarautopilot:1.0.1
   ```

2. [ ] Run container
   ```bash
   docker run -d \
     --name carbonoz-solarautopilot \
     -p 3000:3000 -p 8000:8000 \
     -v /var/run/docker.sock:/var/run/docker.sock \
     elitedesire/solarautopilot:1.0.1
   ```

3. [ ] Check logs for Grafana detection
   ```bash
   docker logs carbonoz-solarautopilot | grep -i grafana
   ```
   **Expected**: `✅ Grafana detected at: http://...`

4. [ ] Wait 30 seconds for Grafana to start

5. [ ] Open browser to `http://localhost:3000`

6. [ ] Navigate to Energy Dashboard

7. [ ] Verify all dashboard panels load (no "refused to connect")

8. [ ] Check browser console for Grafana URL
   **Expected**: `Grafana URL set to: http://localhost:3001`

9. [ ] Navigate to Chart page

10. [ ] Verify main dashboard loads

### Success Criteria
- [ ] No "localhost refused to connect" errors
- [ ] All 9 dashboard panels on Energy Dashboard load
- [ ] Chart page dashboard loads
- [ ] Theme switching works (dark/light)

## Test 2: Existing Grafana Container

### Steps
1. [ ] Start Grafana manually first
   ```bash
   docker run -d --name test-grafana \
     -p 3001:3000 \
     -e GF_SECURITY_ADMIN_PASSWORD=admin \
     grafana/grafana:latest
   ```

2. [ ] Start SolarAutopilot
   ```bash
   docker run -d \
     --name carbonoz-solarautopilot \
     -p 3000:3000 -p 8000:8000 \
     elitedesire/solarautopilot:1.0.1
   ```

3. [ ] Check detection logs

4. [ ] Verify dashboards load

### Success Criteria
- [ ] Detects existing Grafana
- [ ] Connects successfully
- [ ] All panels load

## Test 3: Custom Grafana Port

### Steps
1. [ ] Start Grafana on custom port
   ```bash
   docker run -d --name custom-grafana \
     -p 3002:3000 \
     grafana/grafana:latest
   ```

2. [ ] Start SolarAutopilot with override
   ```bash
   docker run -d \
     --name carbonoz-solarautopilot \
     -p 3000:3000 -p 8000:8000 \
     -e GRAFANA_URL=http://localhost:3002 \
     elitedesire/solarautopilot:1.0.1
   ```

3. [ ] Verify connection to port 3002

### Success Criteria
- [ ] Uses custom port
- [ ] Dashboards load from port 3002

## Test 4: Desktop App

### Steps
1. [ ] Start Grafana locally
   ```bash
   docker run -d --name grafana \
     -p 3001:3000 \
     grafana/grafana:latest
   ```

2. [ ] Start desktop app
   ```bash
   cd desktop
   npm start
   ```

3. [ ] Check console for detection message

4. [ ] Verify dashboards in app

### Success Criteria
- [ ] App detects local Grafana
- [ ] All dashboards load in Electron window

## Test 5: Grafana Not Running (Fallback)

### Steps
1. [ ] Ensure no Grafana is running
   ```bash
   docker stop $(docker ps -q --filter "name=grafana")
   ```

2. [ ] Start SolarAutopilot
   ```bash
   docker run -d \
     --name carbonoz-solarautopilot \
     -p 3000:3000 -p 8000:8000 \
     elitedesire/solarautopilot:1.0.1
   ```

3. [ ] Check logs for fallback message
   **Expected**: `⚠️ Could not detect Grafana URL, using default`

4. [ ] Open app in browser

5. [ ] Verify graceful error handling (no crashes)

### Success Criteria
- [ ] App starts successfully
- [ ] Falls back to default URL
- [ ] Shows appropriate error in dashboard panels
- [ ] App remains functional

## Test 6: API Endpoint

### Steps
1. [ ] Start SolarAutopilot with Grafana

2. [ ] Test API endpoint
   ```bash
   curl http://localhost:3000/api/grafana/url
   ```

3. [ ] Verify response
   ```json
   {
     "success": true,
     "url": "http://localhost:3001",
     "internalUrl": "http://..."
   }
   ```

### Success Criteria
- [ ] API returns correct URL
- [ ] Response format is valid JSON
- [ ] URL matches detected Grafana

## Test 7: Theme Switching

### Steps
1. [ ] Open Energy Dashboard

2. [ ] Toggle dark mode

3. [ ] Verify all iframes reload with dark theme

4. [ ] Toggle light mode

5. [ ] Verify all iframes reload with light theme

### Success Criteria
- [ ] Theme changes apply to all panels
- [ ] No broken iframes after theme change
- [ ] Smooth transition

## Test 8: Multiple Users

### Steps
1. [ ] Open app in Browser 1

2. [ ] Open app in Browser 2 (different browser/incognito)

3. [ ] Verify both load dashboards correctly

4. [ ] Change theme in Browser 1

5. [ ] Verify Browser 2 unaffected

### Success Criteria
- [ ] Both users see dashboards
- [ ] Independent theme settings
- [ ] No conflicts

## Test 9: Container Restart

### Steps
1. [ ] Start SolarAutopilot with Grafana

2. [ ] Verify dashboards load

3. [ ] Restart container
   ```bash
   docker restart carbonoz-solarautopilot
   ```

4. [ ] Wait 30 seconds

5. [ ] Refresh browser

6. [ ] Verify dashboards still load

### Success Criteria
- [ ] Grafana re-detected after restart
- [ ] Dashboards load without manual intervention

## Test 10: Network Issues

### Steps
1. [ ] Start SolarAutopilot

2. [ ] Stop Grafana while app is running
   ```bash
   docker stop solarautopilot-grafana
   ```

3. [ ] Refresh dashboard page

4. [ ] Verify graceful error handling

5. [ ] Restart Grafana
   ```bash
   docker start solarautopilot-grafana
   ```

6. [ ] Refresh page again

7. [ ] Verify dashboards recover

### Success Criteria
- [ ] No app crashes when Grafana stops
- [ ] Clear error messages shown
- [ ] Automatic recovery when Grafana restarts

## Performance Tests

### Test 11: Detection Speed
- [ ] Measure time from container start to Grafana detection
  **Target**: < 5 seconds

### Test 12: Page Load Speed
- [ ] Measure time to load Energy Dashboard
  **Target**: < 3 seconds

### Test 13: Memory Usage
- [ ] Check memory before and after detection
  **Target**: < 10MB increase

## Documentation Tests

### Test 14: Quick Fix Guide
- [ ] Follow GRAFANA_QUICK_FIX.md steps
- [ ] Verify all commands work
- [ ] Confirm instructions are clear

### Test 15: Technical Docs
- [ ] Review GRAFANA_AUTO_DETECTION.md
- [ ] Verify code examples are accurate
- [ ] Test API examples

## Cleanup

After all tests:
```bash
# Stop all containers
docker stop $(docker ps -q)

# Remove test containers
docker rm carbonoz-solarautopilot test-grafana custom-grafana

# Optional: Clean volumes
docker volume prune
```

## Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Fresh Docker Deployment | ⬜ | |
| Existing Grafana | ⬜ | |
| Custom Port | ⬜ | |
| Desktop App | ⬜ | |
| Fallback | ⬜ | |
| API Endpoint | ⬜ | |
| Theme Switching | ⬜ | |
| Multiple Users | ⬜ | |
| Container Restart | ⬜ | |
| Network Issues | ⬜ | |
| Detection Speed | ⬜ | |
| Page Load Speed | ⬜ | |
| Memory Usage | ⬜ | |
| Quick Fix Guide | ⬜ | |
| Technical Docs | ⬜ | |

**Legend**: ✅ Pass | ❌ Fail | ⬜ Not Tested

## Issues Found

Document any issues discovered during testing:

1. 
2. 
3. 

## Sign-Off

- [ ] All critical tests passed
- [ ] Documentation reviewed and accurate
- [ ] No blocking issues found
- [ ] Ready for production deployment

**Tester**: _______________
**Date**: _______________
**Version**: _______________
