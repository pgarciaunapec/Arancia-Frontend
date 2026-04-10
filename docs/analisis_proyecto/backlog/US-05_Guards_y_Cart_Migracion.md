# US-05 — Guards de Rutas y Migración del Carrito Anónimo

**Feature:** [FEAT-04 — Guards y Rutas Privadas](../features/FEAT-04_Guards_Rutas_Privadas.md)
**Épica:** EPIC-01 / EPIC-05

---

## Definición

**Como** sistema de seguridad del frontend,
**quiero** proteger las rutas privadas y los recursos de administración,
**y quiero** que el carrito del usuario se preserve al hacer login,
**para** garantizar seguridad mínima y una experiencia de compra sin fricción.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Protección de Rutas y Migración de Carrito

  Scenario: Cliente sin autenticación intenta acceder a /checkout
    Given no tengo JWT en localStorage (no estoy autenticado)
    When navego manualmente a /checkout
    Then soy redirigido a /login
    And la URL de /checkout se guarda en el state del redirect

  Scenario: Post-login regresa a la ruta original
    Given fui redirigido a /login desde /checkout
    When hago login exitosamente
    Then soy redirigido a /checkout (no a /menu)

  Scenario: AuthContext en estado isLoading no redirige prematuramente
    Given el token JWT está siendo validado (GET /auth/me en proceso)
    When el estado es isLoading=true
    Then el PrivateRoute muestra un spinner/skeleton
    And NO redirige a /login antes de completar la validación

  Scenario: Usuario con role='customer' no puede acceder a /admin
    Given estoy autenticado con role='customer'
    When navego a /admin
    Then soy redirigido a / (home)
    And veo toast: "No tienes permiso para acceder a esta sección"

  Scenario: Migración del carrito al hacer login
    Given tengo 2 ítems en el carrito sin autenticar (localStorage key 'arancia-guest-cart')
    And el valor es: [{ menuItemId: 'X', quantity: 2 }, { menuItemId: 'Y', quantity: 1 }]
    When hago login exitosamente
    Then el sistema detecta los ítems del carrito anónimo
    And llama POST /api/cart para cada ítem (si no existe en el carrito del servidor)
    And limpia el carrito de localStorage
    And el CartContext.items.length === 2 (los ítems migrados)

  Scenario: Migración con ítem que ya existe en carrito del servidor
    Given mi carrito del servidor tiene { menuItemId: 'X', quantity: 1 }
    And mi carrito anónimo tiene { menuItemId: 'X', quantity: 2 }
    When hago login
    Then el ítem 'X' suma cantidades: quantity = 1 + 2 = 3 (PUT /api/cart/X con quantity=3)
    And NO se duplica el ítem

  Scenario: Rutas protegidas — lista completa
    Given no estoy autenticado
    Then /checkout → redirect a /login
    And /profile → redirect a /login
    And /my-reservations → redirect a /login
    And /my-orders → redirect a /login
    And /admin → redirect a /login

  Scenario: Admin route — acceso denegado por rol insuficiente
    Given estoy autenticado con role='customer'
    When navego a /admin/customers
    Then soy redirigido a / (NO a /login, porque SÍ estoy autenticado)
```

---

## Desglose de Tareas

### Backend
- [ ] Agregar campo `role: 'customer' | 'staff' | 'admin'` al schema `User` (default: `'customer'`)
- [ ] Verificar que `GET /api/auth/me` incluye el campo `role` en la respuesta
- [ ] Crear `backend/src/middleware/role.middleware.ts` exportando `requireRole(roles: string[])`
- [ ] En `auth.middleware.ts`: asegurarse que `req.user` incluye el campo `role` al hacer `User.findById(decoded.id)`

### Frontend (Nuevos Componentes)
- [ ] Crear `src/components/PrivateRoute.tsx`:
  ```tsx
  // Si isLoading → <LoadingSpinner />
  // Si !isAuthenticated → <Navigate to="/login" state={{ from: location }} replace />
  // Si isAuthenticated → children
  ```
- [ ] Crear `src/components/AdminRoute.tsx`:
  ```tsx
  // Si !isAuthenticated → <Navigate to="/login" replace />
  // Si !allowedRoles.includes(user.role) → <Navigate to="/" replace /> + toast
  // Si autorizado → children
  ```
- [ ] En `App.tsx`: envolver las rutas privadas con `<PrivateRoute>`:
  - `/checkout`, `/profile`, `/my-reservations`, `/my-orders`
- [ ] En `App.tsx`: envolver rutas de admin con `<AdminRoute roles={['admin','staff']}>`:
  - `/admin`, `/admin/*`
- [ ] Actualizar `AuthContext`: agregar campo `role` al tipo `User`

### Frontend (Migración del Carrito — AuthContext.tsx)
- [ ] En la función `login()`, DESPUÉS de guardar el token y llamar `GET /api/auth/me`:
  1. Leer `localStorage.getItem('arancia-guest-cart')` (verificar el key real usado en `CartContext.tsx`)
  2. Si hay ítems en el carrito anónimo:
     - Obtener el carrito del servidor con `GET /api/cart`
     - Para cada ítem del carrito local:
       - Si el `menuItemId` ya existe en el carrito del servidor: llamar `PUT /api/cart/:id` con la suma de cantidades
       - Si no existe: llamar `POST /api/cart` con el ítem
  3. Limpiar el carrito de localStorage
  4. Llamar `CartContext.refreshCart()` para sincronizar el estado

### Frontend (Login.tsx — redirect post-login)
- [ ] Leer `location.state?.from` después del login exitoso
- [ ] Si existe: `navigate(location.state.from, { replace: true })`
- [ ] Si no existe: `navigate('/menu', { replace: true })` (comportamiento actual)

### Pruebas
- [ ] Test: /checkout sin JWT → redirect a /login con state.from = '/checkout'
- [ ] Test: /login → login exitoso → redirect a /checkout (state.from preservado)
- [ ] Test: /admin con role='customer' → redirect a / con toast
- [ ] Test: migración de carrito → ítems del localStorage aparecen en carrito del servidor
- [ ] Test: isLoading=true → PrivateRoute no redirige prematuramente
