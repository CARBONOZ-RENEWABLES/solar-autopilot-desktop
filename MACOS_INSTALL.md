# macOS Installation Guide

## Security Warning Fix

When you see "cannot be verified" error:

### Method 1: Right-click Open
1. Right-click the app
2. Select "Open" 
3. Click "Open" in the dialog

### Method 2: System Preferences
1. Go to System Preferences → Security & Privacy
2. Click "Open Anyway" button
3. Enter your password

### Method 3: Terminal (Advanced)
```bash
sudo xattr -rd com.apple.quarantine "/Applications/CARBONOZ SolarAutopilot.app"
```

The app is safe - this warning appears because it's not signed with an Apple Developer certificate ($99/year).