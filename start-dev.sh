#!/bin/bash

# Start both backend and frontend servers
echo "🚀 Starting CARBONOZ SolarAutopilot Development Servers..."

# Kill any existing processes on ports 6789 and 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:6789 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start backend server in background
echo "🔧 Starting backend server on port 6789..."
cd "$(dirname "$0")"
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "⚛️  Starting React frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit
}

# Trap cleanup function on script exit
trap cleanup SIGINT SIGTERM

echo "✅ Servers started!"
echo "📊 Backend: http://localhost:6789"
echo "🌐 Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait