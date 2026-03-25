# Auditoría de readiness MVP/Producción (Frontend + Backend)

Fecha: 2026-03-24
Repositorio: Restaurant01
Rama revisada: `copilot/complete-mvp-preparation`

## Resumen ejecutivo

**Estado actual: NO está 100% production-ready.**

- El **frontend** compila y tipa correctamente, pero **opera con estado local (`localStorage`) y seeds demo**, no contra backend real.
- El **backend** compilado existe en `backend/dist`, pero **no arranca en este workspace** por problemas de runtime/paquetización.
- Hay varios flujos MVP implementados visual/funcionalmente en UI, pero **no están integrados end-to-end con datos reales del backend**.

---

## Qué sí está hecho

### Frontend (implementado)

- Contextos y flujo funcional de:
  - Auth (`AuthContext`)
  - Carrito (`CartContext`)
  - Órdenes (`OrdersContext`)
  - Reservas (`ReservationsContext`)
  - Admin (`AdminContext`)
- Rutas protegidas:
  - `PrivateRoute`
  - `AdminRoute`
- Panel admin con páginas de dashboard, órdenes, clientes, mesas, caja e inventario.

### Backend (implementado en artefacto compilado)

- API Express con rutas públicas y admin en `backend/dist/server.js`:
  - `/api/auth`, `/api/users`, `/api/menu`, `/api/orders`, `/api/reservations`, `/api/payments`, `/api/delivery`, etc.
  - rutas admin (`/api/admin/*`)
- Configuración de JWT y MongoDB en `backend/dist/config/env.js`.
- Swagger habilitado en `/api/docs` (según código de `server.js`).

---

## Qué falta / bloquea producción

## 1) Integración real frontend ↔ backend: **FALLA CRÍTICA**

No se encontraron llamadas HTTP desde `src/` (`fetch`/`axios`/cliente API).

Evidencia:
- El frontend persiste datos en `localStorage` en:
  - `src/context/AuthContext.tsx`
  - `src/context/CartContext.tsx`
  - `src/context/OrdersContext.tsx`
  - `src/context/ReservationsContext.tsx`
  - `src/context/AdminContext.tsx`
- Menú consumido desde data estática:
  - `src/data/menuData.ts`
  - `src/pages/Menu.tsx`
- Credenciales demo hardcodeadas en login/admin:
  - `src/pages/Login.tsx`
  - `src/pages/admin/AdminLogin.tsx`

Impacto:
- No hay consistencia server-side.
- No hay multiusuario real.
- No hay seguridad real de sesión/autorización.

## 2) Backend no ejecutable “as-is” en este repo: **FALLA CRÍTICA**

Resultado al iniciar backend:
- `node backend/dist/server.js` falla por conflicto ESM/CJS:
  - `exports is not defined in ES module scope`
- Cargando `backend/dist/server.js` en modo CommonJS, falla por dependencias faltantes:
  - `Cannot find module 'express'`

Causas observadas:
- `package.json` raíz tiene `"type": "module"`.
- No hay `backend/package.json` para aislar runtime/backend deps.
- Dependencias de backend (express, cors, helmet, mongoose, etc.) no están en deps del workspace actual.

## 3) Seguridad/Auth no production-grade en frontend actual: **FALLA CRÍTICA**

Evidencia:
- Comentario explícito en `src/context/AuthContext.tsx`:
  - `Passwords are stored as plain text for this demo (no real backend)`
- Usuarios y passwords seed demo en cliente.

Impacto:
- Contraseñas en cliente/localStorage.
- Vulnerable y no apto para producción.

## 4) Flujos funcionales con inconsistencias pendientes: **ALTO**

Pendientes observados en código actual:
- `Checkout` navega con `type: 'order'`, pero `BookingConfirmation` renderiza solo flujo de reserva (`booking`) y fallback de reserva.
  - `src/pages/Checkout.tsx`
  - `src/pages/BookingConfirmation.tsx`
- `AdminLogin` llama `navigate()` durante render si `isAdmin` (patrón problemático en React).
  - `src/pages/admin/AdminLogin.tsx`
- `OrderTracking` mantiene paso `delivering` incluso para tipos no delivery (pickup/dine-in), con progresión simulada.
  - `src/pages/OrderTracking.tsx`
- Sección “Actualizar Contraseña” en perfil no tiene handler real de cambio de password.
  - `src/pages/Profile.tsx`
- `AdminCashRegister` usa `parseFloat` sin validación robusta de NaN/valores inválidos antes de abrir/cerrar caja.
  - `src/pages/admin/AdminCashRegister.tsx`
- `AdminDashboard` muestra `cashSession.totalSales` pero no hay sincronización clara de ese valor con órdenes/pagos reales.
  - `src/pages/admin/AdminDashboard.tsx`

---

## Validaciones ejecutadas

- `pnpm install` ✅
- `pnpm build` ✅ (Vite build completo)
- `pnpm exec tsc --noEmit` ✅
- `node backend/dist/server.js` ❌ (ESM/CJS)
- `node --input-type=commonjs --eval "require('./backend/dist/server.js')"` ❌ (`Cannot find module 'express'`)

---

## Veredicto de readiness (MVP real con backend)

- Frontend UX/features MVP: **PARCIALMENTE COMPLETO**
- Integración con backend real: **NO COMPLETO**
- Backend operativo en este repo: **NO COMPLETO**
- Seguridad y autenticación para producción: **NO COMPLETO**
- Estado global producción: **NO APTO AÚN**

---

## Plan mínimo para llegar a “100% listo” (prioridad)

1. **Unificar arquitectura runtime**
   - Crear/recuperar `backend/package.json` con scripts (`dev`, `build`, `start`) y deps reales.
   - Resolver módulo CJS/ESM del backend (compilar a ESM o ejecutar aislado como CJS).

2. **Conectar frontend al backend real**
   - Implementar capa API (`src/services/api/*`) con `baseURL` por `VITE_API_URL`.
   - Migrar todos los contextos de `localStorage` a llamadas API + estado cache.

3. **Cerrar seguridad mínima de producción**
   - Auth con JWT/sesión server-side, refresh strategy, expiración y manejo de 401.
   - Eliminar password storage en cliente y credenciales demo del flujo normal.

4. **Corregir flujos inconsistentes detectados**
   - Confirmación de pedido separada o compatible en `BookingConfirmation`.
   - Fix de `AdminLogin`, caja, tracking por tipo de entrega y cambio de contraseña.

5. **Hardening y release**
   - `.env` fuera de repo y plantillas `.env.example`.
   - Observabilidad/logging, rate limit, CORS estricto, validación payloads, smoke tests E2E críticos.

---

## Nota final

Con el estado actual, el proyecto muestra una base MVP funcional de interfaz y dominio, pero **aún no cumple el requisito de “datos reales del backend al 100%” ni de “ready for production” end-to-end**.