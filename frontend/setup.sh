#!/bin/bash

# CARBONOZ SolarAutopilot - React Frontend Setup Script

echo "🚀 Setting up CARBONOZ SolarAutopilot React Frontend..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Navigate to frontend directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# CARBONOZ SolarAutopilot Frontend Configuration
VITE_API_BASE_URL=http://localhost:6789
VITE_APP_TITLE=CARBONOZ SolarAutopilot
VITE_APP_VERSION=1.0.0
EOL
    echo "✅ .env file created"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure the CARBONOZ SolarAutopilot backend is running on port 6789"
echo "   2. Start the development server:"
echo "      npm run dev  (or yarn dev)"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "🔧 Available commands:"
echo "   npm run dev      - Start development server"
echo "   npm run build    - Build for production"
echo "   npm run preview  - Preview production build"
echo "   npm run lint     - Run code linting"
echo ""
echo "📚 For more information, see README.md"
echo ""

# Ask if user wants to start the dev server
read -p "🚀 Would you like to start the development server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌟 Starting development server..."
    if command -v yarn &> /dev/null; then
        yarn dev
    else
        npm run dev
    fi
fi