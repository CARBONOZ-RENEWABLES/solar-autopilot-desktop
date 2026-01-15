#!/bin/bash

# Verify that the build includes all necessary files

echo "🔍 Verifying CARBONOZ SolarAutopilot Build..."
echo ""

ERRORS=0

# Check frontend build
if [ -f "frontend/dist/index.html" ]; then
    echo "✅ Frontend built (frontend/dist/index.html exists)"
else
    echo "❌ Frontend NOT built (frontend/dist/index.html missing)"
    ERRORS=$((ERRORS + 1))
fi

# Check server.js
if [ -f "server.js" ]; then
    echo "✅ Backend exists (server.js)"
else
    echo "❌ Backend missing (server.js)"
    ERRORS=$((ERRORS + 1))
fi

# Check desktop main.js
if [ -f "desktop/main.js" ]; then
    echo "✅ Desktop app exists (desktop/main.js)"
else
    echo "❌ Desktop app missing (desktop/main.js)"
    ERRORS=$((ERRORS + 1))
fi

# Check node_modules
if [ -d "node_modules" ]; then
    echo "✅ Root dependencies installed"
else
    echo "⚠️  Root dependencies not installed"
fi

if [ -d "desktop/node_modules" ]; then
    echo "✅ Desktop dependencies installed"
else
    echo "⚠️  Desktop dependencies not installed"
fi

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ Build verification PASSED - Ready to create installers!"
    exit 0
else
    echo "❌ Build verification FAILED - $ERRORS critical errors found"
    echo ""
    echo "Run: ./pre-build.sh"
    exit 1
fi
