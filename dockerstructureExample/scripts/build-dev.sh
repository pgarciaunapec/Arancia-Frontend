#!/bin/bash
# Build development Docker image locally
# Useful for testing the Dockerfile before pushing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🔨 Building Docker image for development..."
echo "   Context: $PROJECT_ROOT"
echo "   Dockerfile: $SCRIPT_DIR/../Dockerfile.dev"

cd "$PROJECT_ROOT"

docker build \
  -f docker/Dockerfile.dev \
  -t medicalpro/authentication:dev-latest \
  -t medicalpro/authentication:dev \
  .

echo ""
echo "✅ Build successful!"
echo ""
echo "📝 Next steps:"
echo "   Option 1: Run locally with hot reload:"
echo "     cd compose && docker-compose -f docker-compose.dev.yml up"
echo ""
echo "   Option 2: Test the image manually:"
echo "     docker run -it -p 5239:5239 medicalpro/authentication:dev"
