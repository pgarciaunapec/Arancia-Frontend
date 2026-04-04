# Arancia

# Restaurant01 - Sistema de Gestión Restaurante

**Estado:** ✅ **MVP COMPLETADO Y FUNCIONAL** (2026-04-04)

Un sistema web completo para gestión de restaurante con frontend moderno y backend API robusto.

## 🎯 Características Principales

### Para Clientes
- ✅ Autenticación segura con JWT
- ✅ Menú dinámico interactivo
- ✅ Carrito de compras (guest + autenticado)
- ✅ Checkout con múltiples métodos de pago
- ✅ Rastreo de órdenes en tiempo real
- ✅ Reservas de mesa
- ✅ Historial de pedidos
- ✅ Perfil de usuario

### Para Administración
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de menús y precios
- ✅ Seguimiento de órdenes
- ✅ Gestión de reservas y mesas
- ✅ Control de inventario
- ✅ Caja registradora digital
- ✅ Análisis de ventas

## 🚀 Quick Start

### Opción 1: Script automático (Recomendado)

```bash
./start.sh
```

Esto levantará backend y frontend automáticamente.

### Opción 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
pnpm install  # Primera vez
pnpm start    # O: node dist/server.js
```

**Terminal 2 - Frontend:**
```bash
pnpm install  # Primera vez
pnpm dev
```

### Acceso

- 🌐 **Frontend:** http://localhost:3000
- ⚙️ **Backend:** http://localhost:5000
- 📚 **API Docs:** http://localhost:5000/api/docs

---

## 📋 Estructura del Proyecto

```
Restaurant01/
├── src/                    # Frontend React + Vite
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── context/           # Contextos (Auth, Cart, Orders, etc.)
│   ├── lib/               # API client y mappers
│   └── types/             # Tipos TypeScript
├── backend/               # Backend Express + MongoDB
│   ├── dist/              # Código compilado
│   ├── src/               # Fuente TypeScript
│   ├── node_modules/      # Dependencias
│   └── package.json
├── .env                   # Variables de entorno frontend
├── .env.example           # Ejemplo de .env
├── start.sh              # Script para iniciar system
└── package.json
```

---

## ⚙️ Configuración

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Restaurant01
VITE_APP_VERSION=0.1.0
```

### Backend (backend/.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://user:password@host:port/...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

---

## 🔐 Seguridad

- ✅ Autenticación JWT con tokens
- ✅ Passwords hasheados con bcryptjs
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ MongoDB sanitization
- ✅ Rate limiting básico

---

## 📚 Stack Tecnológico

### Frontend
- **React** 18.3 - UI library
- **TypeScript** - Type safety
- **Vite** 6.3 - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Jest/Vitest** - Testing

### Backend
- **Express** 4.22 - Web framework
- **Mongoose** 8.23 - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Swagger** - API documentation
- **TypeScript** - Type safety

---

## 🧪 Testing

```bash
# Frontend tests
pnpm test

# Frontend tests con coverage
pnpm test:coverage

# Backend tests
cd backend
pnpm test

# Backend coverage
pnpm test:coverage
```

---

## 📖 Documentación Adicional

- Auditoría de producción: [PRODUCTION_READINESS_AUDIT_2026-03-24.md](PRODUCTION_READINESS_AUDIT_2026-03-24.md)
- Completamiento de implementación: [IMPLEMENTATION_COMPLETION_2026-04-04.md](IMPLEMENTATION_COMPLETION_2026-04-04.md)
- Refactorización: [REFACTORING_COMPLETION.md](REFACTORING_COMPLETION.md)

---

## 🛠️ Desarrollo

### Instalar dependencias
```bash
# Frontend
pnpm install

# Backend
cd backend
pnpm install
```

### Compilar backend
```bash
cd backend
pnpm build  # Compila TypeScript → JavaScript
```

### Build frontend para producción
```bash
pnpm build
# Output: ./build/
```

---

## 🐛 Troubleshooting

**Puerto 3000 o 5000 ya está en uso:**
```bash
# Cambiar puerto en package.json o usando variable de entorno
PORT=3001 pnpm dev

# O para backend
PORT=5001 pnpm start
```

**MongoDB no conecta:**
- Verificar credenciales en `.env`
- Verificar ruta de certificado si usa TLS

**CORS error en API calls:**
- Verificar `VITE_API_URL` en `.env` frontend
- Verificar `FRONTEND_URL` en backend `.env`

---

## 📝 Notas de Versión

**v0.1.0 - MVP (2026-04-04)**
- ✅ Sistema completo funcional
- ✅ Autenticación JWT
- ✅ Integración API end-to-end
- ✅ Admin panel
- ✅ Múltiples flujos de usuario

---

## 📄 Licencia

Privado - Restaurant01

---

## 👥 Contacto

Para preguntas o reporte de bugs, contactar al equipo de desarrollo.

---

**Última actualización:** 2026-04-04  
**Mantenido por:** GitHub Copilot

  