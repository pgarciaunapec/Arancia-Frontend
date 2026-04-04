#!/bin/bash

# Restaurant01 Quick Start Script
# Inicia backend y frontend en diferentes terminales

set -e

PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

echo "🍝 Restaurant01 - Iniciando sistema completo..."
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check dependencies
echo "${BLUE}📦 Verificando dependencias...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm no está instalado, usando npm"
    PACKAGE_MANAGER="npm"
else
    PACKAGE_MANAGER="pnpm"
fi

echo "✅ Usando $PACKAGE_MANAGER"
echo ""

# Install dependencies if needed
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo "${BLUE}📥 Instalando dependencias del frontend...${NC}"
    cd "$PROJECT_ROOT"
    $PACKAGE_MANAGER install
fi

if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    echo "${BLUE}📥 Instalando dependencias del backend...${NC}"
    cd "$PROJECT_ROOT/backend"
    $PACKAGE_MANAGER install
fi

echo ""
echo "${GREEN}✅ Dependencias listas${NC}"
echo ""
echo "${BLUE}🚀 Iniciando servicios...${NC}"
echo ""

# Start backend
echo "Iniciando Backend en puerto 5000..."
cd "$PROJECT_ROOT/backend"
$PACKAGE_MANAGER start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ! curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "⚠️  Backend puede estar tardando en iniciar..."
fi

# Start frontend
echo "Iniciando Frontend en puerto 3000..."
cd "$PROJECT_ROOT"
$PACKAGE_MANAGER dev &
FRONTEND_PID=$!

echo ""
echo "${GREEN}✅ Sistema iniciado${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Restaurant01 está listo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend:   http://localhost:3000"
echo "⚙️  Backend:    http://localhost:5000"
echo "📚 API Docs:   http://localhost:5000/api/docs"
echo ""
echo "PIDs: Backend=$BACKEND_PID, Frontend=$FRONTEND_PID"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Wait for both processes
wait
