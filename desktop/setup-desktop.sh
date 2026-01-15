#!/bin/bash

echo "🌞 Setting up CARBONOZ SolarAutopilot Desktop Application..."

# Get the parent directory (main app directory)
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DESKTOP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📁 App Directory: $APP_DIR"
echo "📁 Desktop Directory: $DESKTOP_DIR"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is available and running"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$APP_DIR"
npm install

# Build frontend
echo "🏗️ Building React frontend..."
cd "$APP_DIR/frontend"
npm install
npm run build

# Install desktop dependencies
echo "📱 Installing desktop dependencies..."
cd "$DESKTOP_DIR"
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the desktop application:"
echo "   cd $DESKTOP_DIR"
echo "   npm start"
echo ""
echo "🔧 To start in development mode:"
echo "   cd $DESKTOP_DIR"
echo "   npm run dev"