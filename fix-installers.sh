#!/bin/bash

echo "🔧 SolarAutopilot Installer Fix Script"
echo "======================================"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from your project root."
    exit 1
fi

echo "✅ Installing dependencies..."
npm install

echo "✅ Building frontend..."
cd frontend && npm install && npm run build && cd ..

echo "✅ Installing desktop dependencies..."
cd desktop && npm install && cd ..

echo "✅ Testing local build..."
cd desktop && npm run pack && cd ..

echo ""
echo "🚀 Next Steps:"
echo "1. Push these changes to GitHub"
echo "2. Go to GitHub Settings > Pages"
echo "3. Set Source to 'GitHub Actions'"
echo "4. Create a release tag: git tag v1.0.0 && git push origin v1.0.0"
echo ""
echo "📦 Your installers will be available at:"
echo "   https://github.com/YOUR_USERNAME/SolarAutopilotApp/actions"