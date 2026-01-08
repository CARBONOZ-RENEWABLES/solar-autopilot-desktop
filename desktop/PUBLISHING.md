# 📦 CARBONOZ SolarAutopilot - Desktop App Publishing Guide

## 🚀 Quick Start

### 1. Build Desktop App
```bash
cd desktop
./build.sh
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build for Current Platform
```bash
npm run dist
```

## 🎯 Platform-Specific Builds

### macOS (.dmg)
```bash
npm run dist-mac
```
**Output:** `dist/CARBONOZ SolarAutopilot-1.0.0.dmg`

### Windows (.exe)
```bash
npm run dist-win
```
**Output:** `dist/CARBONOZ SolarAutopilot Setup 1.0.0.exe`

### Linux (.AppImage, .deb)
```bash
npm run dist-linux
```
**Output:** 
- `dist/CARBONOZ SolarAutopilot-1.0.0.AppImage`
- `dist/carbonoz-solarautopilot-desktop_1.0.0_amd64.deb`

### All Platforms
```bash
npm run dist-all
```

## 📱 Publishing Options

### 1. **GitHub Releases** (Recommended)
- Push code to GitHub
- Create tag: `git tag v1.0.0 && git push origin v1.0.0`
- GitHub Actions automatically builds and releases

### 2. **Mac App Store**
```bash
# Add to package.json build config:
"mas": {
  "category": "public.app-category.utilities",
  "provisioningProfile": "path/to/profile.provisionprofile"
}
```

### 3. **Microsoft Store**
```bash
# Add to package.json build config:
"appx": {
  "applicationId": "CarbonozSolarAutopilot",
  "displayName": "CARBONOZ SolarAutopilot"
}
```

### 4. **Snap Store (Linux)**
```bash
# Add to package.json build config:
"snap": {
  "summary": "AI-powered solar battery management"
}
```

## 🔧 Auto-Updates Setup

### 1. Configure Update Server
```javascript
// In main.js
const { autoUpdater } = require('electron-updater');
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'carbonoz',
  repo: 'solarautopilot'
});
```

### 2. Release Process
1. Update version in `package.json`
2. Commit changes
3. Create git tag: `git tag v1.0.1`
4. Push: `git push origin v1.0.1`
5. GitHub Actions builds and publishes

## 📋 Distribution Checklist

- [ ] Test on all target platforms
- [ ] Update version numbers
- [ ] Create release notes
- [ ] Sign applications (for security)
- [ ] Test auto-updater
- [ ] Upload to distribution platforms

## 🔐 Code Signing

### macOS
```bash
# Get Developer ID certificate from Apple
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate_password"
npm run dist-mac
```

### Windows
```bash
# Get code signing certificate
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate_password"
npm run dist-win
```

## 🌐 Web Distribution
Your React app can also run as a web app:
```bash
cd frontend
npm run build
# Deploy dist/ folder to any web server
```

## 📊 Analytics & Monitoring
Add to your React app:
```javascript
// Track desktop app usage
if (window.isElectron) {
  // Desktop-specific analytics
}
```

## 🎉 Ready to Publish!

Your app will be available as:
- **macOS**: `.dmg` installer
- **Windows**: `.exe` installer  
- **Linux**: `.AppImage` and `.deb` packages
- **Raspberry Pi**: ARM64 builds included

Run `./build.sh` to get started!