#!/bin/bash

echo "🔧 Starting SolarAutopilot in Development Mode..."

# Start services in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

echo "🛠️ Development environment ready!"
echo "   Frontend: http://localhost:5173 (Vite dev server)"
echo "   Backend:  http://localhost:3000 (with hot reload)"
echo "   Grafana:  http://localhost:3001"