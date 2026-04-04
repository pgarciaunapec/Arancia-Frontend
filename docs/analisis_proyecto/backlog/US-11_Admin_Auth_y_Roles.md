# US-11 — Admin Auth, Roles y Layout Base del Panel

**Feature:** [FEAT-09 — Admin — Auth y Layout Base](../features/FEAT-09_Admin_Auth_Layout.md)
**Épica:** EPIC-04 — Panel de Administración

---

## Definición

**Como** administrador o cajero del restaurante,
**quiero** autenticarme con mis credenciales y acceder a un panel de administración protegido según mi rol,
**para** gestionar las operaciones del restaurante sin que estos datos sean accesibles por clientes regulares.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Autenticación y Layout Base del Panel Admin

  Scenario: Admin accede al panel con rol correcto
    Given tengo una cuenta con role='admin'
    And estoy autenticado con JWT válido
    When navego a /admin
    Then veo el Layout de administración con:
      - Sidebar con secciones: Dashboard, Pedidos, Mesas, Clientes, Caja, Inventario
      - Nombre de usuario y rol en el header del panel
      - Botón de cerrar sesión

  Scenario: Usuario con role='customer' es bloqueado del admin
    Given estoy autenticado como cliente normal (role='customer')
    When intento acceder a /admin (o cualquier subruta /admin/*)
    Then soy redirigido a / (página principal del restaurante)
    And se muestra un toast: "No tienes permisos para acceder a esta sección."

  Scenario: Usuario no autenticado es redirigido al login admin
    Given NO estoy autenticado
    When navego a /admin/tables
    Then soy redirigido a /admin/login

  Scenario: Login admin específico (/admin/login)
    Given tengo credenciales de admin (email/password)
    When ingreso mis datos en /admin/login y hago submit
    Then se llama POST /api/auth/login con las mismas credenciales
    And si el rol retornado es 'admin' o 'staff', se redirige a /admin/dashboard
    And si el rol retornado es 'customer', se muestra error: "Acceso restringido al panel admin"

  Scenario: Staff solo ve secciones de su competencia
    Given estoy autenticado con role='staff'
    When accedo a /admin
    Then el Sidebar muestra: Pedidos, Mesas, Caja
    And NO muestra: Clientes/VIP, Inventario (solo admin)

  Scenario: Dashboard muestra métricas del día
    Given accedo a /admin/dashboard
    Then veo tarjetas resumen:
      - Pedidos del día: N
      - Reservas activas: N
      - Mesas ocupadas: X de Y
      - Monto cobrado hoy: RD$ X,XXX
    And cada tarjeta hace su propia llamada al API de métricas

  Scenario: Cierre de sesión desde el panel admin
    Given estoy en cualquier ruta del panel admin
    When hago click en "Cerrar sesión"
    Then se limpia el JWT del storage
    And soy redirigido a /admin/login
```

---

## Especificación de Roles

| Rol | Valor en DB | Acceso |
|---|---|---|
| Cliente | `'customer'` | Solo rutas públicas del restaurante |
| Cajero/Mesero | `'staff'` | Pedidos, Mesas, Caja del Admin Panel |
| Administrador | `'admin'` | Acceso completo al Admin Panel |
| Super-Admin | (futuro) | No en scope |

---

## Estructura de Rutas Admin (React Router)

```
/admin               → Redirect a /admin/dashboard
/admin/login         → Página de login admin (pública, pero si auth → dashboard)
/admin/dashboard     → Dashboard
/admin/orders        → Gestión de pedidos
/admin/tables        → Gestión de mesas
/admin/customers     → Solo admin
/admin/cash          → Caja y cobro
/admin/inventory     → Solo admin
/admin/delivery      → Gestión de deliveries activos
```

---

## Desglose de Tareas

### Backend — Rol en User Model
- [ ] Agregar campo `role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' }` al modelo `User`
- [ ] Actualizar el middleware de autenticación: incluir `role` en el payload del JWT al hacer login
- [ ] Crear `backend/src/middleware/role.middleware.ts`:
  ```
  requireRole(roles: string[]): Middleware
  ```
  - Verifica que `req.user.role` esté en el array de roles permitidos
  - Si no: responde 403 { message: 'Forbidden: Insufficient role' }
- [ ] Agregar índice en `User.role` para queries de admin

### Backend — Endpoint Dashboard
- [ ] Crear `GET /api/admin/dashboard`:
  - Protected: `requireAuth + requireRole(['admin', 'staff'])`
  - Respuesta: `{ ordersToday, activeReservations, occupiedTables, revenueToday }`
  - Cada valor con una query MongoDB (`Order.countDocuments`, `Payment.aggregate`, etc.)

### Frontend — AdminRoute Component
- [ ] Crear `src/components/AdminRoute.tsx`:
  - Wrapper que verifica: `isAuthenticated && (user.role === 'admin' || user.role === 'staff')`
  - Si no auth: redirige a `/admin/login`
  - Si auth pero sin rol admin/staff: redirige a `/` con toast de error
- [ ] Crear `src/components/StaffRoute.tsx` (o usar `AdminRoute` con prop `allowedRoles`):
  - Para rutas que son solo para `admin` (no staff): `allowedRoles={['admin']}`

### Frontend — AdminLayout
- [ ] Crear `src/components/admin/AdminLayout.tsx`:
  - Layout base con sidebar y header
  - Sidebar links: Dashboard, Pedidos, Delivery, Mesas, Clientes (solo admin), Caja, Inventario (solo admin)
  - Renderización condicional de links según `user.role`
  - Header: nombre de usuario, badge de rol, botón cerrar sesión

### Frontend — Páginas Admin
- [ ] Crear `src/pages/admin/Dashboard.tsx` — métricas del día
- [ ] Crear `src/pages/admin/AdminLogin.tsx` — formulario login dedicado
  - Si ya auth con rol correcto → redirect a /admin/dashboard
  - Post-login: verificar que role sea admin/staff; si es customer → error
- [ ] Estructurar rutas en `App.tsx`:
  ```jsx
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
    <Route index element={<Navigate to="/admin/dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    ...
  </Route>
  ```

### Frontend — AuthContext extension
- [ ] Verificar que `AuthContext` expone `user.role` en el objeto User
- [ ] Si el tipo `IUser` no tiene `role`: agregar a `src/types/index.ts`

### Pruebas
- [ ] Test: POST /api/auth/login responde con `user.role` en la respuesta
- [ ] Test: acceso a `/api/admin/dashboard` sin auth → 401
- [ ] Test: acceso a `/api/admin/dashboard` con role='customer' → 403
- [ ] Test: acceso a `/api/admin/dashboard` con role='admin' → 200
- [ ] Test: `AdminRoute` redirige a /admin/login si no auth
- [ ] Test: `AdminRoute` redirige a / si auth como customer
- [ ] Test: `AdminLogin` post-login con customer → muestra error, no redirige al panel
