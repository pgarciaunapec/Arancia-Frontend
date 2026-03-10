# US-12 — Admin: Gestión de Clientes y Clientes VIP

**Feature:** [FEAT-10 — Admin — Gestión de Clientes y VIP](../features/FEAT-10_Admin_Clientes_VIP.md)
**Épica:** EPIC-04 — Panel de Administración

---

## Definición

**Como** administrador,
**quiero** ver y gestionar todos los clientes registrados y poder designar a algunos como VIP con un descuento personalizado,
**para** ofrecer beneficios diferenciados a los mejores clientes del restaurante.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Gestión de Clientes y VIP en Admin Panel

  Scenario: Listar todos los clientes
    Given estoy en /admin/customers
    When la página carga
    Then veo una tabla paginada con:
      - Nombre completo del cliente
      - Email
      - Fecha de registro
      - Número de pedidos realizados
      - Badge "VIP" si el cliente es VIP (con porcentaje de descuento)
      - Botones: "Ver perfil" | "Gestionar VIP"

  Scenario: Buscar cliente por nombre o email
    Given estoy en /admin/customers
    When escribo "carol" en el buscador
    Then la tabla se filtra en tiempo real mostrando solo clientes cuyo nombre o email contiene "carol"

  Scenario: Convertir cliente en VIP
    Given estoy viendo el perfil de un cliente normal
    When abro el diálogo "Convertir a VIP"
    And establezco descuento: 15%
    And hago click en "Guardar"
    Then se llama PATCH /api/admin/users/:id/vip { isVip: true, vipDiscount: 15 }
    And en éxito: el badge VIP aparece junto al nombre del cliente
    And el campo vipSince se guarda con la fecha actual

  Scenario: Validación de descuento VIP
    Given estoy en el diálogo VIP
    When ingreso un descuento de 51%
    Then el botón "Guardar" está deshabilitado
    And se muestra: "El descuento VIP no puede superar el 50%"
    When corrijo a 20%
    Then el botón se habilita

  Scenario: Revocar estado VIP
    Given un cliente tiene isVip=true y vipDiscount=20%
    When abro el diálogo VIP y hago toggle "Revocar VIP"
    And confirmo en el modal de confirmación
    Then se llama PATCH /api/admin/users/:id/vip { isVip: false, vipDiscount: 0 }
    And el badge VIP desaparece del cliente
    And vipSince se limpia

  Scenario: Descuento VIP se aplica automáticamente en checkout
    Given soy un cliente con isVip=true y vipDiscount=15
    When llego al Paso 2 del checkout (pago)
    Then el resumen muestra:
      - Subtotal: RD$ 1,000
      - Descuento VIP (15%): -RD$ 150
      - IVA (18%): RD$ 153
      - Total: RD$ 1,003
    And el Order se crea con total = 1,003 (no 1,180)

  Scenario: Cambio de rol de cliente a staff (solo admin)
    Given estoy en el perfil de un cliente
    And soy admin
    When selecciono "Cambiar rol: Staff"
    And confirmo en el modal
    Then se llama PATCH /api/admin/users/:id/role { role: 'staff' }
    And el cliente ahora aparece con badge "Staff" en lugar de "Cliente"

  Scenario: Staff no puede cambiar roles ni ver sección Clientes
    Given estoy autenticado como role='staff'
    When intento navegar a /admin/customers
    Then soy redirigido a /admin/dashboard
    And se muestra: "Acceso restringido — solo administradores"
```

---

## Campos VIP en User Model

Agregar al schema `User` existente:
```typescript
isVip:       { type: Boolean, default: false },
vipDiscount: { type: Number, min: 0, max: 50, default: 0 },  // % de descuento
vipSince:    { type: Date },
```

---

## Desglose de Tareas

### Backend — User Model
- [ ] Agregar campos VIP al schema `User` existente: `isVip`, `vipDiscount`, `vipSince`
- [ ] Asegurar que el campo `role` de US-11 ya esté aplicado

### Backend — Endpoints Admin/Users
- [ ] `GET /api/admin/users`:
  - requireRole(['admin'])
  - Soporte: `?search=texto&page=1&limit=20`
  - Proyección: excluir `password`, `cardHash`, cualquier dato sensible
  - Incluir: `ordersCount` (agregación de Order donde user = _id y status != 'cart')
- [ ] `GET /api/admin/users/:id`:
  - requireRole(['admin'])
  - Detalle del usuario + historial de pedidos resumido
- [ ] `PATCH /api/admin/users/:id/vip`:
  - requireRole(['admin'])
  - Body: `{ isVip: boolean, vipDiscount?: number }`
  - Validación: si `isVip=true` y `vipDiscount > 50` → 422
  - Si `isVip=true`: setear `vipSince = new Date()` si antes era false
  - Si `isVip=false`: clearear `vipSince`, `vipDiscount = 0`
- [ ] `PATCH /api/admin/users/:id/role`:
  - requireRole(['admin']) — solo admin puede cambiar roles
  - Body: `{ role: 'customer' | 'staff' | 'admin' }`
  - Validación: no se puede cambiar el rol del último admin

### Backend — Descuento VIP en Order
- [ ] En `POST /api/orders` (crear pedido): obtener el usuario autenticado
- [ ] Si `user.isVip === true` y `user.vipDiscount > 0`:
  - Calcular `discount = subtotal * (vipDiscount / 100)`
  - `total = subtotal - discount + tax`
  - Guardar en Order: `vipDiscountApplied: true, vipDiscountPercent: user.vipDiscount, discountAmount: discount`
- [ ] Si el usuario no es VIP: no cambios en el cálculo actual

### Frontend — Página `/admin/customers`
- [ ] Crear `src/pages/admin/Customers.tsx`
- [ ] Input de búsqueda con debounce (300ms)
- [ ] Tabla paginada usando `<Table>` de shadcn/ui
- [ ] Badge VIP: verde con % ("VIP 15%")
- [ ] Botón "Gestionar VIP" → abre `<VIPDialog />`

### Frontend — Componente `<VIPDialog />`
- [ ] Modal con:
  - Toggle "Es VIP" (switch)
  - Input numérico "% de descuento" (solo visible si toggle ON)
  - Validación: 0-50
  - Botón "Guardar" — llama `adminApi.updateUserVip(userId, { isVip, vipDiscount })`
  - Confirmación de revocar si se apaga el toggle

### Frontend — Checkout VIP
- [ ] En Checkout (Paso 1 — Resumen): si `user.isVip`:
  - Mostrar línea de descuento en el resumen del carrito
  - El backend calcula el total real; el frontend solo visualiza

### Pruebas
- [ ] Test: PATCH /vip con vipDiscount=51 → 422
- [ ] Test: PATCH /vip { isVip: true } registra vipSince
- [ ] Test: PATCH /vip { isVip: false } limpia vipSince y vipDiscount
- [ ] Test: GET /admin/users requiere role='admin'
- [ ] Test: Order creada por usuario VIP incluye discountAmount correcto
- [ ] Test: ruta /admin/customers inaccesible con role='staff'
