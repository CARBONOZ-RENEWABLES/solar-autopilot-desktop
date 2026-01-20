# macOS DMG Crash Fix - Summary

## Problem
The Electron desktop app crashed when launched from the macOS DMG installer with error:
```
Backend crashed with exit code 1
The app is trying to write files to a read-only mounted DMG volume
```

## Root Cause
The app was using `APP_ROOT` (read-only resources path) for ALL file operations, including writable files like:
- `options.json` (user configuration)
- `settings.json` (app settings)
- `telegram_config.json` (notifications)
- `warnings_config.json` (warnings)
- `timezone.json` (timezone settings)
- `data/` folder (all data files)
- `logs/` folder (all log files)

## Solution
Separated read-only code files from writable data files:

### 1. Added USER_DATA_PATH Environment Variable
**File:** `desktop/main.js`
- Added `USER_DATA_PATH: app.getPath('userData')` to backend environment variables
- This provides a writable location on macOS: `~/Library/Application Support/CARBONOZ SolarAutopilot`

### 2. Created DATA_ROOT Constant
**File:** `server.js`
- Added `DATA_ROOT` constant for writable files
- `APP_ROOT` = read-only resources (code, modules)
- `DATA_ROOT` = writable user data (configs, logs, data)

### 3. Updated All Writable File Paths
Updated the following to use `DATA_ROOT`:
- `options.json`
- `settings.json`
- `telegram_config.json`
- `warnings_config.json`
- `timezone.json`
- `data/` directory
- `logs/` directory
- `dynamic_pricing_config.json`

### 4. Updated Services
**Files updated:**
- `services/tibberService.js` - Config file path
- `services/telegramService.js` - Config file path
- `services/warningService.js` - Config file path
- `services/notificationService.js` - Condition rules path
- `ai/index.js` - Added DATA_ROOT constant

## File Structure After Fix

### Read-Only (APP_ROOT)
```
/Applications/CARBONOZ SolarAutopilot.app/Contents/Resources/
├── server.js (code)
├── ai/ (code)
├── services/ (code)
├── routes/ (code)
├── utils/ (code)
├── frontend/dist/ (static files)
└── node_modules/ (dependencies)
```

### Writable (DATA_ROOT)
```
~/Library/Application Support/CARBONOZ SolarAutopilot/
├── options.json
├── settings.json
├── timezone.json
├── data/
│   ├── tibber_config.json
│   ├── telegram_config.json
│   ├── warnings_config.json
│   ├── condition-rules.json
│   └── dynamic_pricing_config.json
└── logs/
    └── (log files)
```

## Testing
After this fix:
1. The app will create writable directories in user data location on first launch
2. All configuration files will be stored in writable location
3. The app will no longer crash when launched from DMG
4. User data persists across app updates

## Benefits
- ✅ App works correctly when launched from DMG
- ✅ User data stored in proper macOS location
- ✅ Data persists across app updates
- ✅ Follows macOS app guidelines
- ✅ No permission issues
