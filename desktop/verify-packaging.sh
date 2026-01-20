#!/bin/bash

# CARBONOZ SolarAutopilot - Packaging Verification Script
# Verifies that all required files and fixes are in place

echo "🔍 =========================================="
echo "   CARBONOZ SolarAutopilot"
echo "   Packaging Verification"
echo "=========================================="
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

ERRORS=0

# Check 1: Verify fork import in server.js
echo "📝 Checking server.js imports..."
if grep -q "const { fork } = require('child_process')" server.js; then
    print_success "fork import found in server.js"
else
    print_error "fork import missing in server.js"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Verify APP_ROOT constant
echo "📝 Checking APP_ROOT constant..."
if grep -q "const APP_ROOT = isElectronPackaged" server.js; then
    print_success "APP_ROOT constant defined"
else
    print_error "APP_ROOT constant missing"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: Verify module paths setup
echo "📝 Checking module paths configuration..."
if grep -q "module.paths.unshift" server.js; then
    print_success "Module paths configured for packaged app"
else
    print_error "Module paths configuration missing"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: Verify frontend build exists
echo "📝 Checking frontend build..."
if [ -f "frontend/dist/index.html" ]; then
    print_success "Frontend build exists"
else
    print_warning "Frontend build not found (run: cd frontend && npm run build)"
fi

# Check 5: Verify critical backend files
echo "📝 Checking backend files..."
BACKEND_FILES=(
    "server.js"
    "package.json"
    "services/aiChargingEngine.js"
    "services/tibberService.js"
    "routes/health.js"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        print_error "Missing: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check 6: Verify desktop app files
echo "📝 Checking desktop app files..."
DESKTOP_FILES=(
    "desktop/main.js"
    "desktop/package.json"
    "desktop/preload.js"
)

for file in "${DESKTOP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        print_error "Missing: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check 7: Verify node_modules
echo "📝 Checking dependencies..."
if [ -d "node_modules" ]; then
    print_success "Root node_modules exists"
else
    print_warning "Root node_modules missing (run: npm install)"
fi

if [ -d "desktop/node_modules" ]; then
    print_success "Desktop node_modules exists"
else
    print_warning "Desktop node_modules missing (run: cd desktop && npm install)"
fi

# Check 8: Verify main.js fork usage
echo "📝 Checking main.js backend startup..."
if grep -q "const { fork } = require('child_process')" desktop/main.js; then
    print_success "fork import found in main.js"
else
    print_error "fork import missing in main.js"
    ERRORS=$((ERRORS + 1))
fi

# Check 9: Verify environment variable handling
echo "📝 Checking environment variable handling..."
if grep -q "RESOURCES_PATH" server.js && grep -q "NODE_PATH" server.js; then
    print_success "Environment variables properly handled"
else
    print_error "Environment variable handling incomplete"
    ERRORS=$((ERRORS + 1))
fi

# Summary
echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    print_success "All checks passed! Ready for packaging."
    echo ""
    echo "📦 To build the app, run:"
    echo "   cd desktop"
    echo "   npm run dist-mac    # for macOS"
    echo "   npm run dist-win    # for Windows"
    echo "   npm run dist-linux  # for Linux"
else
    print_error "Found $ERRORS error(s). Please fix before packaging."
    exit 1
fi
echo "=========================================="
