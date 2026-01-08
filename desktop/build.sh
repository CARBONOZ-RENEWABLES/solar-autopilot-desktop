#!/bin/bash

# CARBONOZ SolarAutopilot Build Script

echo "🚀 Building CARBONOZ SolarAutopilot Desktop App..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🎨 Building React frontend..."
cd ../frontend
npm install
npm run build
cd ../desktop

# Build desktop app
echo "🖥️  Building desktop application..."

# Build for current platform
npm run dist

echo "✅ Build complete! Check the dist/ folder for installers."
echo ""
echo "📁 Available installers:"
ls -la dist/

echo ""
echo "🎯 To build for all platforms:"
echo "   npm run dist-all"
echo ""
echo "🎯 To build for specific platforms:"
echo "   npm run dist-mac    (macOS)"
echo "   npm run dist-win    (Windows)"
echo "   npm run dist-linux  (Linux)"