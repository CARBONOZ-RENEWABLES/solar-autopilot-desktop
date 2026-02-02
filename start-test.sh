#!/bin/bash

echo "🧹 Cleaning up ports..."
lsof -ti:6789 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:48732 | xargs kill -9 2>/dev/null

echo ""
echo "✅ Ports cleared!"
echo ""
echo "🚀 Starting servers..."
echo ""
echo "📝 Instructions:"
echo "1. Terminal 1: cd /Users/digitalaxis/Desktop/SolarAutopilotApp && npm start"
echo "2. Terminal 2: cd /Users/digitalaxis/Desktop/SolarAutopilotApp/frontend && npm run dev"
echo ""
echo "🌐 Access: http://localhost:48732"
echo ""
echo "Press Ctrl+C to stop"
