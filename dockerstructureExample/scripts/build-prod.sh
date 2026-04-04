#!/bin/bash
# Build production Docker image
# Used by: Dokploy (automatically) or manual testing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Optional: Get version from git tag or default to latest
VERSION=${1:-latest}

echo "🔨 Building Docker image for production..."
echo "   Context: $PROJECT_ROOT"
echo "   Dockerfile: $SCRIPT_DIR/../Dockerfile"
echo "   Tag: medicalpro/authentication:$VERSION"

cd "$PROJECT_ROOT"

docker build \
  -f docker/Dockerfile \
  -t medicalpro/authentication:$VERSION \
  -t medicalpro/authentication:latest \
  .

echo ""
echo "✅ Build successful!"
echo ""
echo "📝 Image: medicalpro/authentication:$VERSION"
echo "   For Dokploy to use: Push to registry or let Dokploy build automatically"
