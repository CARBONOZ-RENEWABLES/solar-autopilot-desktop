#!/bin/bash

# CARBONOZ SolarAutopilot - Complete Build Script with Error Handling
# This script builds everything needed for the desktop app

set -e  # Exit on error

echo "🌞 =========================================="
echo "   CARBONOZ SolarAutopilot Build Script"
echo "=========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Step 1: Install root dependencies
echo "📦 Step 1: Installing root dependencies..."
cd "$PROJECT_ROOT"
if npm install; then
    print_success "Root dependencies installed"
else
    print_error "Failed to install root dependencies"
    exit 1
fi
echo ""

# Step 2: Build frontend
echo "🎨 Step 2: Building React frontend..."
cd "$PROJECT_ROOT/frontend"

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    if npm install; then
        print_success "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
fi

# Build the frontend
if npm run build; then
    print_success "Frontend build complete"
else
    print_error "Frontend build failed"
    exit 1
fi

# Verify the build
if [ ! -f "dist/index.html" ]; then
    print_error "Frontend build failed - dist/index.html not found"
    exit 1
fi

print_success "Frontend build verified (dist/index.html exists)"
echo ""

# Step 3: Install desktop dependencies
echo "🖥️  Step 3: Installing desktop dependencies..."
cd "$PROJECT_ROOT/desktop"
if npm install; then
    print_success "Desktop dependencies installed"
else
    print_error "Failed to install desktop dependencies"
    exit 1
fi
echo ""

# Step 4: Create necessary directories
echo "📂 Step 4: Creating data directories..."
mkdir -p "$PROJECT_ROOT/data"
mkdir -p "$PROJECT_ROOT/logs"
print_success "Directories created"
echo ""

# Step 5: Create default options.json if it doesn't exist
echo "📋 Step 5: Creating default options.json..."
if [ ! -f "$PROJECT_ROOT/options.json" ]; then
    cat > "$PROJECT_ROOT/options.json" << 'EOF'
{
  "inverter_number": 1,
  "battery_number": 1,
  "mqtt_topic_prefix": "solar",
  "mqtt_host": "localhost",
  "mqtt_port": 1883,
  "mqtt_username": "",
  "mqtt_password": "",
  "clientId": "",
  "clientSecret": "",
  "timezone": "Europe/Berlin"
}
EOF
    print_success "Created default options.json"
else
    print_warning "options.json already exists"
fi
echo ""

# Step 6: Verify all critical files exist
echo "🔍 Step 6: Verifying critical files..."
CRITICAL_FILES=(
    "$PROJECT_ROOT/server.js"
    "$PROJECT_ROOT/package.json"
    "$PROJECT_ROOT/frontend/dist/index.html"
    "$PROJECT_ROOT/desktop/main.js"
    "$PROJECT_ROOT/desktop/package.json"
)

ALL_EXIST=true
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        print_error "Missing: $file"
        ALL_EXIST=false
    fi
done

if [ "$ALL_EXIST" = false ]; then
    print_error "Some critical files are missing!"
    exit 1
fi
print_success "All critical files verified"
echo ""

# Step 7: Create preload.js if missing
echo "📝 Step 7: Checking preload.js..."
if [ ! -f "$PROJECT_ROOT/desktop/preload.js" ]; then
    cat > "$PROJECT_ROOT/desktop/preload.js" << 'EOF'
// Preload script for Electron security
const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// specific features without exposing the whole of Node.js
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});
EOF
    print_success "Created preload.js"
else
    print_success "preload.js exists"
fi
echo ""

# Step 8: Build the desktop app
echo "🔨 Step 8: Building desktop application..."
cd "$PROJECT_ROOT/desktop"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist

# Build based on platform
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Building for macOS..."
    if npm run dist-mac; then
        print_success "macOS build complete!"
    else
        print_error "macOS build failed"
        exit 1
    fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "Building for Windows..."
    if npm run dist-win; then
        print_success "Windows build complete!"
    else
        print_error "Windows build failed"
        exit 1
    fi
else
    echo "Building for Linux..."
    if npm run dist-linux; then
        print_success "Linux build complete!"
    else
        print_error "Linux build failed"
        exit 1
    fi
fi

echo ""
echo "✅ =========================================="
echo "   Build Complete! 🎉"
echo "=========================================="
echo ""
echo "📦 Your installer can be found in:"
echo "   $PROJECT_ROOT/desktop/dist/"
echo ""

# List the built installers
if ls "$PROJECT_ROOT/desktop/dist/"*.{dmg,exe,AppImage} 2>/dev/null; then
    echo ""
    print_success "Installers found!"
else
    print_warning "No installer files found (this might be expected for --dir builds)"
fi

echo ""
echo "🚀 To test in development mode:"
echo "   cd $PROJECT_ROOT/desktop"
echo "   npm start"
echo ""

# Step 9: Create startup verification script
echo "📝 Creating startup verification script..."
cat > "$PROJECT_ROOT/desktop/verify-startup.sh" << 'EOF'
#!/bin/bash
# Quick verification script for packaged app

echo "🔍 Verifying CARBONOZ SolarAutopilot Installation..."
echo ""

# Check if running from packaged app
if [ -n "$RESOURCES_PATH" ]; then
    echo "✓ Running from packaged app"
    echo "  Resources: $RESOURCES_PATH"
else
    echo "✓ Running in development mode"
fi

# Check critical files
FILES=(
    "server.js"
    "frontend/dist/index.html"
    "package.json"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing!"
    fi
done

echo ""
echo "Node version: $(node --version 2>/dev/null || echo 'Not found')"
echo "npm version: $(npm --version 2>/dev/null || echo 'Not found')"
echo ""
EOF

chmod +x "$PROJECT_ROOT/desktop/verify-startup.sh"
print_success "Created startup verification script"

echo ""
print_success "Build process completed successfully!"