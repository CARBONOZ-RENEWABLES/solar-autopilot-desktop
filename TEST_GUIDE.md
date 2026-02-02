# ✅ Corrected Configuration

## Port Setup:
- **Node Backend**: Port 6789 (unchanged)
- **React Frontend**: Port 48732 (development server)
- **WebSocket**: Port 8000

---

## 🧪 Test Locally

### Step 1: Start Backend (Terminal 1)
```bash
cd /Users/digitalaxis/Desktop/SolarAutopilotApp
npm start
```
Backend will run on: http://localhost:6789

### Step 2: Start Frontend (Terminal 2)
```bash
cd /Users/digitalaxis/Desktop/SolarAutopilotApp/frontend
npm run dev
```
Frontend will run on: http://localhost:48732

### Step 3: Test Access
Open browser: **http://localhost:48732**

The React app on port 48732 will proxy API calls to Node backend on port 6789.

---

## 🌐 Access URLs

**Development:**
- Frontend: http://localhost:48732
- Backend API: http://localhost:6789/api/health
- WebSocket: ws://localhost:8000

**Network Access:**
- http://<your-ip>:48732 (frontend)
- http://solarautopilot.local:48732 (with mDNS)

---

## 🐳 Docker Configuration

For Docker deployment, the built frontend will be served via nginx on port 80, which proxies to backend on port 6789.

```bash
# Build image
docker build -t elitedesire/solarautopilot:latest .

# Run container
docker run -d -p 6789:6789 -p 8000:8000 elitedesire/solarautopilot:latest
```

---

## ✅ What Changed

1. ✅ Node backend: Port 6789 (restored)
2. ✅ React dev server: Port 48732
3. ✅ Vite proxy: Points to localhost:6789
4. ✅ Docker: Exposes port 6789
5. ✅ Nginx: Proxies to port 6789

---

## 🚀 Quick Test Commands

```bash
# Test backend
curl http://localhost:6789/api/health

# Test frontend (after starting both servers)
curl http://localhost:48732

# Check if ports are in use
lsof -i :6789
lsof -i :48732
lsof -i :8000
```
