# Quick Reference: Building CARBONOZ SolarAutopilot

## ✅ Pre-Build Checklist

Run verification:
```bash
cd desktop
./verify-packaging.sh
```

All checks should pass before building.

## 🔨 Build Commands

### macOS (Universal Binary)
```bash
cd desktop
npm run dist-mac
```
Output: `desktop/dist/CARBONOZ SolarAutopilot-1.0.0-universal.dmg`

### Windows
```bash
cd desktop
npm run dist-win
```
Output: `desktop/dist/CARBONOZ SolarAutopilot Setup 1.0.0.exe`

### Linux
```bash
cd desktop
npm run dist-linux
```
Output: `desktop/dist/CARBONOZ SolarAutopilot-1.0.0.AppImage`

## 🧪 Testing the Packaged App

### 1. Install the App
- **macOS**: Open the .dmg and drag to Applications
- **Windows**: Run the .exe installer
- **Linux**: Make .AppImage executable and run

### 2. Check Startup Logs
1. Launch the app
2. Open Developer Tools: View → Toggle Developer Tools
3. Look for these success messages:
   ```
   🎁 Running in packaged Electron app
   📁 Resources path: [path]
   📦 Module paths: [...]
   ✅ Backend started successfully
   ✅ Frontend ready
   ```

### 3. Verify Functionality
- [ ] App window opens
- [ ] Loading screen appears
- [ ] Backend starts (check port 3000)
- [ ] Frontend loads
- [ ] Dashboard displays
- [ ] No console errors

## 🐛 Troubleshooting

### Backend Won't Start

**Check 1: Module Resolution**
```javascript
// In Developer Tools Console
console.log(process.env.RESOURCES_PATH)
console.log(process.env.NODE_PATH)
```

**Check 2: File Existence**
Look for these files in the app bundle:
- `server.js`
- `node_modules/` directory
- `frontend/dist/index.html`

**Check 3: Permissions**
```bash
# macOS
ls -la "/Applications/CARBONOZ SolarAutopilot.app/Contents/Resources/"

# Linux
ls -la ~/.local/share/applications/
```

### "Cannot find module" Error

This means module paths aren't configured correctly.

**Fix:**
1. Verify `NODE_PATH` is set in main.js
2. Check `module.paths` configuration in server.js
3. Ensure node_modules are in extraResources (package.json)

### Port 3000 Already in Use

**Solution 1: Kill existing process**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

**Solution 2: Change port**
Edit `desktop/main.js` and `server.js` to use different port.

## 📊 Build Sizes (Approximate)

- **macOS**: ~200-300 MB (universal binary)
- **Windows**: ~150-200 MB
- **Linux**: ~150-200 MB

## 🔄 Rebuild After Changes

If you modify code:

1. **Frontend changes:**
   ```bash
   cd frontend
   npm run build
   cd ../desktop
   npm run dist-mac  # or dist-win, dist-linux
   ```

2. **Backend changes:**
   ```bash
   cd desktop
   npm run dist-mac  # or dist-win, dist-linux
   ```

3. **Desktop app changes:**
   ```bash
   cd desktop
   npm run dist-mac  # or dist-win, dist-linux
   ```

## 📝 Key Files

| File | Purpose |
|------|---------|
| `server.js` | Backend Node.js server |
| `desktop/main.js` | Electron main process |
| `desktop/preload.js` | Electron security bridge |
| `desktop/package.json` | Build configuration |
| `frontend/dist/` | Built React app |

## 🎯 Success Criteria

✅ App launches without errors
✅ Backend starts within 10 seconds  
✅ Frontend loads successfully
✅ No "Cannot find module" errors
✅ All features work as expected

## 📞 Support

If issues persist:
1. Check `PACKAGING_FIXES.md` for detailed information
2. Review console logs in Developer Tools
3. Verify all files are packaged correctly
4. Test in development mode first: `npm start`

## 🚀 Distribution

Once tested:
1. Sign the app (macOS/Windows)
2. Notarize (macOS)
3. Create release notes
4. Upload to distribution platform
5. Update download links

---

**Last Updated:** $(date)
**Version:** 1.0.0
