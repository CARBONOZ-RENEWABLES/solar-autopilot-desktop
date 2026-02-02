# 🚀 Single Command Start Guide

## ✅ Configuration Summary

- **Backend**: Port 6789
- **Frontend**: Port 48732
- **WebSocket**: Port 8000

---

## 🎯 Development (Single Command)

### Start Both Backend & Frontend:
```bash
npm run dev
```

This will start:
- ✅ Backend on http://localhost:6789
- ✅ Frontend on http://localhost:48732

**Access:** http://localhost:48732

---

## 🐳 Docker (Single Command)

### Start All Services:
```bash
docker-compose up -d
```

This will start:
- ✅ Backend (port 6789)
- ✅ Frontend (port 48732)
- ✅ InfluxDB (port 8086)
- ✅ Grafana (port 3001)

**Access:** http://localhost:48732

### View Logs:
```bash
docker-compose logs -f
```

### Stop All Services:
```bash
docker-compose down
```

---

## 📦 Available Commands

### Development:
```bash
npm run dev              # Start both backend & frontend
npm run dev:backend      # Start only backend
npm run dev:frontend     # Start only frontend
```

### Production:
```bash
npm start                # Start optimized backend
```

### Docker:
```bash
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
docker-compose restart   # Restart all services
```

---

## 🧪 Test Locally

1. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   ```
   http://localhost:48732
   ```

---

## 🐳 Test with Docker

1. **Build and start:**
   ```bash
   docker-compose up -d --build
   ```

2. **Check status:**
   ```bash
   docker-compose ps
   ```

3. **Access:**
   ```
   http://localhost:48732
   ```

---

## 🔧 Troubleshooting

### Ports in use:
```bash
# Kill all processes
lsof -ti:6789 | xargs kill -9
lsof -ti:8000 | xargs kill -9
lsof -ti:48732 | xargs kill -9
```

### Docker issues:
```bash
# Clean and rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

---

## ✅ Quick Start Checklist

- [ ] Install dependencies: `npm install && cd frontend && npm install`
- [ ] Start development: `npm run dev`
- [ ] Access: http://localhost:48732
- [ ] Test Docker: `docker-compose up -d`

---

**Ready to go!** 🎉
