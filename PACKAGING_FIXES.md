# Backend Server Fixes for Packaged Electron App

## Issues Fixed

### 1. Missing `fork` Import in server.js
**Problem:** The `child_process.fork` function was used but not imported.
**Fix:** Added `const { fork } = require('child_process')` at line 6 of server.js.

### 2. Path Resolution Issues
**Problem:** Paths were inconsistently resolved between development and packaged modes.
**Fix:** 
- Created `APP_ROOT` constant that properly resolves to `RESOURCES_PATH` in packaged mode
- Replaced all `__dirname` references with `APP_ROOT` for consistency
- Updated paths for:
  - Frontend dist directory
  - Data directory
  - Options.json
  - Timezone.json
  - Dashboard config
  - Public/views directories

### 3. Module Resolution in Packaged Environment
**Problem:** Node.js couldn't find modules in the packaged app.
**Fix:**
- Added module path configuration in server.js:
  ```javascript
  if (process.env.NODE_PATH) {
    module.paths.unshift(process.env.NODE_PATH);
  }
  module.paths.unshift(path.join(APP_ROOT, 'node_modules'));
  ```
- Set `NODE_PATH` environment variable in main.js when spawning backend

### 4. Backend Process Spawning
**Problem:** Backend wasn't starting properly in packaged app.
**Fix:**
- Simplified main.js to use `fork` consistently
- Removed complex platform-specific exec path logic
- Use `process.execPath` (Electron's Node.js) for all platforms
- Improved error handling and logging

### 5. Missing preload.js
**Problem:** Desktop app referenced preload.js but file didn't exist.
**Fix:** Created preload.js with proper Electron security context bridge.

## Files Modified

1. **server.js**
   - Added fork import
   - Created APP_ROOT constant
   - Added module paths configuration
   - Updated all path references to use APP_ROOT

2. **desktop/main.js**
   - Simplified backend spawning logic
   - Improved error handling
   - Better progress reporting

3. **desktop/preload.js** (created)
   - Added Electron context bridge
   - Exposed safe APIs to renderer

## Verification

Run the verification script to ensure all fixes are in place:
```bash
cd desktop
./verify-packaging.sh
```

## Building the App

After verification passes, build the app:

```bash
cd desktop

# macOS
npm run dist-mac

# Windows
npm run dist-win

# Linux
npm run dist-linux
```

## Testing the Packaged App

1. Install the built app
2. Check the console logs (View → Toggle Developer Tools)
3. Verify these messages appear:
   - "🎁 Running in packaged Electron app"
   - "📁 Resources path: [path]"
   - "📦 Module paths: [paths]"
   - "✅ Backend started successfully"

## Environment Variables Set

The packaged app sets these environment variables:
- `NODE_ENV=production`
- `RESOURCES_PATH=[app resources path]`
- `PORT=3000`
- `NODE_PATH=[app resources]/node_modules`

## Key Changes Summary

| Component | Before | After |
|-----------|--------|-------|
| Module import | Missing fork | ✅ fork imported |
| Path resolution | Inconsistent __dirname | ✅ Consistent APP_ROOT |
| Module paths | Not configured | ✅ Properly configured |
| Backend spawn | Complex platform logic | ✅ Simplified fork usage |
| Error handling | Basic | ✅ Comprehensive logging |

## Troubleshooting

If the backend still fails to start:

1. **Check logs in Developer Tools**
   - Look for "Cannot find module" errors
   - Check RESOURCES_PATH is correct

2. **Verify node_modules are packaged**
   - Check `[app]/Contents/Resources/node_modules` exists (macOS)
   - Verify all dependencies are present

3. **Test module resolution**
   - Add console.log in server.js to print module.paths
   - Verify paths include the packaged node_modules

4. **Check file permissions**
   - Ensure server.js is readable
   - Verify node_modules have correct permissions

## Additional Notes

- The app uses Electron's bundled Node.js (process.execPath)
- All paths are resolved relative to RESOURCES_PATH in packaged mode
- Module resolution follows Node.js standard paths plus custom paths
- Frontend is served from `RESOURCES_PATH/frontend/dist`
- Data directory is created at `RESOURCES_PATH/data`

## Success Indicators

When properly packaged, you should see:
1. ✅ App launches without errors
2. ✅ Backend starts within 10 seconds
3. ✅ Frontend loads at http://localhost:3000
4. ✅ No "Cannot find module" errors
5. ✅ All services initialize correctly
