# Migration Guide: Grafana Auto-Detection Update

## For Existing Users

If you're already running SolarAutopilot and experiencing Grafana connection issues, this guide will help you upgrade to the new auto-detection system.

## What's New?

✨ **Automatic Grafana Detection** - No more manual URL configuration
✨ **Works Everywhere** - Docker, desktop, custom deployments
✨ **Zero Configuration** - Just restart and it works

## Do I Need to Migrate?

### You SHOULD migrate if:
- ✅ You see "localhost refused to connect" in dashboards
- ✅ Grafana panels are blank or showing errors
- ✅ You manually configured Grafana URLs
- ✅ You want the latest improvements

### You DON'T need to migrate if:
- ✅ Your dashboards are working perfectly
- ✅ You're on the latest version already
- ✅ You prefer manual configuration

## Migration Steps

### For Docker Users

#### Option 1: Simple Restart (Recommended)
```bash
# Stop current container
docker stop carbonoz-solarautopilot

# Remove old container
docker rm carbonoz-solarautopilot

# Pull latest image
docker pull elitedesire/solarautopilot:latest

# Start with new version
docker run -d \
  --name carbonoz-solarautopilot \
  -p 3000:3000 -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v solarautopilot-data:/app/data \
  -v solarautopilot-logs:/app/logs \
  --restart unless-stopped \
  elitedesire/solarautopilot:latest
```

#### Option 2: Docker Compose Update
```bash
# Pull latest images
docker-compose pull

# Restart services
docker-compose down
docker-compose up -d
```

### For Desktop App Users

#### Option 1: Download New Installer
1. Visit [GitHub Actions](https://github.com/eelitedesire/SolarAutopilotApp/actions)
2. Download latest build for your platform
3. Install over existing version
4. Launch app

#### Option 2: Build from Source
```bash
# Pull latest code
git pull origin main

# Rebuild
./pre-build.sh
cd desktop
npm run dist-mac  # or dist-win, dist-linux
```

## Verification Steps

After migration, verify everything works:

### 1. Check Server Logs
```bash
# Docker
docker logs carbonoz-solarautopilot | grep -i grafana

# Desktop
Check console output
```

**Look for**: `✅ Grafana detected at: http://...`

### 2. Test Dashboard Access
1. Open `http://localhost:3000`
2. Navigate to Energy Dashboard
3. Verify all panels load (no errors)
4. Check Chart page

### 3. Verify API
```bash
curl http://localhost:3000/api/grafana/url
```

**Expected response**:
```json
{
  "success": true,
  "url": "http://localhost:3001"
}
```

## Troubleshooting Migration Issues

### Issue 1: Dashboards Still Not Loading

**Solution**:
```bash
# Ensure Grafana is running
docker ps | grep grafana

# If not, wait 30 seconds and check again
# Grafana takes time to start

# Force restart Grafana
docker restart solarautopilot-grafana
```

### Issue 2: Old URL Still Being Used

**Solution**:
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

# Or restart container
docker restart carbonoz-solarautopilot
```

### Issue 3: Port Conflicts

**Solution**:
```bash
# Check what's using port 3001
lsof -i :3001

# If another Grafana is running, stop it
docker stop <other-grafana-container>

# Or use custom port
docker run -d \
  --name carbonoz-solarautopilot \
  -p 3000:3000 -p 8000:8000 \
  -e GRAFANA_URL=http://localhost:3002 \
  elitedesire/solarautopilot:latest
```

### Issue 4: Docker Socket Permission Denied

**Solution**:
```bash
# Linux only
sudo chmod 666 /var/run/docker.sock

# Or run with sudo (not recommended)
sudo docker run ...
```

## Rollback Plan

If you need to rollback to the previous version:

### Docker
```bash
# Stop new version
docker stop carbonoz-solarautopilot
docker rm carbonoz-solarautopilot

# Run specific old version
docker run -d \
  --name carbonoz-solarautopilot \
  -p 3000:3000 -p 8000:8000 \
  elitedesire/solarautopilot:1.0.0  # Replace with your version
```

### Desktop
1. Uninstall current version
2. Reinstall previous version from backup
3. Or download older release from GitHub

## Data Preservation

✅ **Your data is safe!** This update only changes how Grafana URLs are detected. All your:
- Historical data
- Settings
- Configurations
- Dashboards

...remain unchanged.

## Configuration Changes

### Before (Manual Configuration)
```bash
# Had to manually set Grafana URL
docker run -d \
  -e GRAFANA_URL=http://localhost:3001 \
  ...
```

### After (Automatic)
```bash
# No Grafana URL needed - auto-detected!
docker run -d \
  ...
```

### Optional Override (Still Available)
```bash
# Can still override if needed
docker run -d \
  -e GRAFANA_URL=http://custom-url:port \
  ...
```

## Performance Impact

- **Startup Time**: +2 seconds (one-time detection)
- **Runtime**: No impact
- **Memory**: No significant change
- **CPU**: No impact

## New Features Available

After migration, you get:

1. **Automatic Detection** - Works in any environment
2. **Better Error Messages** - Clear feedback if issues occur
3. **API Endpoint** - `/api/grafana/url` for integrations
4. **Improved Logging** - Better debugging information
5. **Fallback Support** - Graceful degradation if Grafana unavailable

## Support During Migration

### Getting Help

1. **Quick Fix Guide**: [GRAFANA_QUICK_FIX.md](GRAFANA_QUICK_FIX.md)
2. **Technical Docs**: [GRAFANA_AUTO_DETECTION.md](GRAFANA_AUTO_DETECTION.md)
3. **GitHub Issues**: [Report a problem](https://github.com/eelitedesire/SolarAutopilotApp/issues)
4. **Community**: [Discord/Forum]

### Common Questions

**Q: Will this break my existing setup?**
A: No, it's fully backward compatible. Existing configurations continue to work.

**Q: Do I need to reconfigure anything?**
A: No, the system auto-detects everything.

**Q: What if I have a custom Grafana setup?**
A: Use the `GRAFANA_URL` environment variable to override auto-detection.

**Q: Can I test before fully migrating?**
A: Yes, run the new version in a separate container first.

**Q: How long does migration take?**
A: 2-5 minutes including download and restart.

## Migration Checklist

- [ ] Backup current configuration (optional)
- [ ] Stop current SolarAutopilot instance
- [ ] Pull/download latest version
- [ ] Start new version
- [ ] Wait 30 seconds for Grafana
- [ ] Verify dashboards load
- [ ] Check logs for detection message
- [ ] Test theme switching
- [ ] Confirm all features work

## Post-Migration

After successful migration:

1. **Monitor for 24 hours** - Ensure stability
2. **Check logs periodically** - Look for any warnings
3. **Test all features** - Verify everything works
4. **Update documentation** - If you have custom docs
5. **Share feedback** - Help improve the system

## Success Indicators

✅ Server logs show: `✅ Grafana detected at: http://...`
✅ All dashboard panels load without errors
✅ Theme switching works smoothly
✅ No "localhost refused to connect" messages
✅ API endpoint returns correct URL

## Need More Help?

If you encounter issues during migration:

1. Check [GRAFANA_QUICK_FIX.md](GRAFANA_QUICK_FIX.md)
2. Review [GRAFANA_AUTO_DETECTION.md](GRAFANA_AUTO_DETECTION.md)
3. Search [GitHub Issues](https://github.com/eelitedesire/SolarAutopilotApp/issues)
4. Open a new issue with:
   - Your platform (Docker/Desktop/etc)
   - Error messages from logs
   - Steps you've tried
   - Screenshots if applicable

---

**Welcome to the improved SolarAutopilot!** 🎉

Your dashboards should now work seamlessly across all platforms without manual configuration.
