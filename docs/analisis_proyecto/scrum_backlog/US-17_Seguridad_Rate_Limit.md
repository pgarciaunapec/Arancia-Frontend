# US-17 — Seguridad: Rate Limiting, Helmet y Saneamiento de Deuda Técnica

**Feature:** [FEAT-05 — Motor de Pago en BD](../features/FEAT-05_Motor_Pago_BD.md) / [EPIC-05 — Seguridad y Deuda Técnica](../epicas/EPIC-05_Seguridad_y_Deuda_Tecnica.md)
**Épica:** EPIC-05 — Seguridad y Deuda Técnica

---

## Definición

**Como** equipo de desarrollo,
**quiero** resolver toda la deuda técnica de seguridad identificada antes de hacer deploy a producción,
**para** que la plataforma no sea vulnerable a ataques de fuerza bruta, injection, ni exposición de secretos.

**Prioridad:** `Must Have` — Blocker para producción

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Hardening de Seguridad antes de Producción

  Scenario: JWT_SECRET sin valor por defecto inseguro
    Given el archivo backend/src/config/env.ts existe
    When el servidor inicia SIN la variable JWT_SECRET en el entorno
    Then el proceso Node.js termina con: "FATAL: JWT_SECRET env var is required"
    And el servidor NO inicia parcialmente ni usa un fallback hardcodeado

  Scenario: Rate limiting en login previene brute force
    Given el endpoint POST /api/auth/login existe
    When una IP realiza 6 intentos de login fallidos en menos de 15 minutos
    Then el 6to intento retorna 429 { error: "Demasiados intentos. Espera 15 minutos." }
    And después de 15 minutos el contador se resetea

  Scenario: Rate limiting en registro previene spam de cuentas
    Given el endpoint POST /api/auth/register existe
    When una IP realiza más de 10 registros en 1 hora
    Then los registros excedentes retornan 429

  Scenario: Helmet aplica headers de seguridad HTTP
    Given el servidor Express tiene helmet() configurado
    When cualquier respuesta del API es inspeccionada
    Then los headers incluyen:
      - X-Content-Type-Options: nosniff
      - X-Frame-Options: DENY
      - Strict-Transport-Security (en producción con HTTPS)
    And el header "X-Powered-By: Express" NO está presente

  Scenario: .env.example existe y documenta todas las variables
    Given el proyecto tiene variables de entorno requeridas
    When un desarrollador clona el repositorio
    Then encuentra un archivo .env.example en la raíz del backend con:
      - PORT=
      - MONGODB_URI=
      - JWT_SECRET=  (con nota: "Mínimo 32 chars aleatorios - NO usar en producción")
      - JWT_EXPIRES_IN=7d
      - NODE_ENV=development
    And no hay ninguna variable de entorno hardcodeada en el código fuente

  Scenario: Input sanitización en endpoints públicos
    Given el formulario de contacto tiene el campo "message"
    When un usuario envía: "<script>alert('xss')</script>"
    Then el campo es sanitizado (HTML escapado o rechazado) antes de guardarse en DB
    And la respuesta del servidor NO ejecuta el script

  Scenario: Carrito anónimo migrado correctamente al hacer login (UX)
    Given tengo 3 items en el carrito como usuario anónimo
    When hago login con mi cuenta
    Then los 3 items del carrito anónimo se fusionan con el carrito del servidor
    And el localStorage es limpiado post-migración
    And si había items duplicados, la cantidad se suma (no duplica)

  Scenario: Sin console.log de datos sensibles en producción
    Given NODE_ENV=production
    When se ejecutan operaciones de autenticación y pagos
    Then los logs del servidor no contienen: passwords, JWT tokens, card numbers, CVV
```

---

## Inventario de la Deuda Técnica a Resolver

| ID | Descripción | Severidad | Archivo Afectado |
|---|---|---|---|
| DT-01 | JWT_SECRET con fallback `'default-secret-key'` | **CRÍTICA** | `backend/src/config/env.ts` |
| DT-02 | Sin rate limiting en `/auth/login` | **ALTA** | `backend/src/routes/auth.routes.ts` |
| DT-03 | Sin `PrivateRoute` en frontend | **ALTA** | `src/App.tsx` |
| DT-04 | Sin campo `role` en User model | **ALTA** | `backend/src/models/User.ts` |
| DT-05 | Sin sanitización de inputs en endpoints públicos | **ALTA** | Todos los controllers |
| DT-06 | Carrito anónimo no migrado al login | **MEDIA** | `src/contexts/AuthContext.tsx` |
| DT-07 | Sin `.env.example` en el proyecto | **MEDIA** | raíz + backend/ |
| DT-08 | Sin `helmet.js` en Express | **MEDIA** | `backend/src/server.ts` |
| DT-09 | Componentes duplicados (Header, Footer, Modal) | **BAJA** | `src/components/` |

---

## Desglose de Tareas

### Backend — DT-01: Eliminar JWT secret fallback
- [ ] En `backend/src/config/env.ts`: cambiar la línea del JWT_SECRET:
  - ANTES: `jwtSecret: process.env.JWT_SECRET || 'default-secret-key'`
  - DESPUÉS: validar que existe y hacer `process.exit(1)` si no — con mensaje claro en stderr
- [ ] Aplicar la misma validación a `MONGODB_URI` si no existe

### Backend — DT-02: Rate Limiting
- [ ] Instalar: `express-rate-limit` (no necesita nueva dependencia si ya está, verificar)
- [ ] Configurar dos limiters:
  - `authLimiter`: 5 requests / 15 min / IP — para `/api/auth/login`
  - `registerLimiter`: 10 requests / 60 min / IP — para `/api/auth/register`
- [ ] Aplicar `app.use('/api/auth/login', authLimiter)` antes de las rutas en `server.ts`
- [ ] Mensaje de error 429 en español: "Demasiados intentos. Por favor espera X minutos."

### Backend — DT-08: Helmet
- [ ] Instalar: `helmet` si no está instalado
- [ ] En `server.ts`: `app.use(helmet())` como uno de los primeros middlewares
- [ ] Verificar que `X-Powered-By` queda eliminado (helmet lo hace por defecto)

### Backend — DT-05: Sanitización de Inputs
- [ ] Verificar que `express-validator` ya está instalado (ya está como dependencia)
- [ ] En todos los controladores con inputs de texto libre (contact, eventRequest, reservation, order): agregar `.trim().escape()` en las validaciones existentes de `express-validator`
- [ ] Ejemplo en `contact.controller.ts`: validar que el campo `message` pasa por `.trim().escape()`

### Backend — DT-07: .env.example
- [ ] Crear `backend/.env.example` con todas las variables documentadas (ver criterio de aceptación)
- [ ] Crear `.env.example` en la raíz del proyecto (para variables de Vite si aplica: `VITE_API_URL`)
- [ ] Agregar `.env` y `.env.local` a `.gitignore` si no están ya

### Backend — DT-04: Role en User Model (resuelto en US-11, verificar aquí)
- [ ] Confirmar que el campo `role` fue agregado en US-11
- [ ] Si no: agregar `role: { type: String, enum: ['customer','staff','admin'], default: 'customer' }` en User.ts

### Frontend — DT-03: PrivateRoute (resuelto en US-05, verificar aquí)
- [ ] Confirmar que `PrivateRoute.tsx` fue creado en US-05
- [ ] Confirmar que las rutas `/checkout`, `/profile`, `/my-reservations`, `/my-orders`, `/order-tracking` están protegidas en `App.tsx`

### Frontend — DT-06: Cart Migration (resuelto en US-05, verificar aquí)
- [ ] Confirmar que `AuthContext.login()` llama a la función de migración de carrito post-login

### Limpieza General — DT-09 (Could Have)
- [ ] Identificar cuáles de los componentes duplicados se usan activamente (Header vs ModernHeader)
- [ ] Marcar los no usados; proponer eliminación (no eliminar sin confirmar con el equipo)
- [ ] No eliminar archivos sin revisión — solo documentar los candidatos

### Pruebas
- [ ] Test: iniciar servidor sin JWT_SECRET → proceso termina con mensaje de error claro
- [ ] Test: 6 requests a /api/auth/login en 15 min → 6to retorna 429
- [ ] Test: respuesta del API tiene header `X-Content-Type-Options: nosniff`
- [ ] Test: respuesta del API NO tiene header `X-Powered-By`
- [ ] Test: input con `<script>` en contacto → se guarda escapado, no ejecutable
- [ ] Test: `.env.example` existe y tiene todas las variables listadas
