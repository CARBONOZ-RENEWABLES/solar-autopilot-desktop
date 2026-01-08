#!/bin/bash

# Auto-release script
set -e

echo "🚀 Preparing release..."

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "📦 Version: $VERSION"

# Build everything
echo "🔨 Building application..."
cd desktop
npm run build

# Create git tag
echo "🏷️  Creating git tag v$VERSION..."
cd ..
git add .
git commit -m "Release v$VERSION" || echo "No changes to commit"
git tag "v$VERSION" || echo "Tag already exists"

# Push to GitHub (triggers auto-build)
echo "📤 Pushing to GitHub..."
git push origin main
git push origin "v$VERSION"

echo "✅ Release v$VERSION pushed! GitHub Actions will build installers."
echo "🔗 Check: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"