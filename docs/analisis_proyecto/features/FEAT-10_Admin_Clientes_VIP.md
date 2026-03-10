# FEAT-10 — Admin: Gestión de Clientes y Clientes VIP

**Épica:** [EPIC-04 — Panel de Administración](../epicas/EPIC-04_Panel_Administracion.md)

> El restaurante necesita gestionar su base de clientes, identificar y marcar clientes VIP, configurar su descuento porcentual, y que ese descuento se aplique automáticamente en las cuentas por mesa y en el checkout online.

## Descripción

**Como** administrador del restaurante,
**quiero** gestionar los perfiles de mis clientes y designar a los más importantes como VIP con un descuento personalizado,
**para** ofrecer un servicio diferenciado y fidelizar a mis mejores clientes.

**Prioridad:** `Must Have`

---

## API Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/admin/users` | admin | Lista usuarios con búsqueda, filtros y paginación |
| `GET` | `/api/admin/users/:id` | admin | Perfil completo del usuario con historial |
| `PUT` | `/api/admin/users/:id` | admin | Edita nombre, email, teléfono |
| `PATCH` | `/api/admin/users/:id/vip` | admin | Toggle VIP + configura descuento |
| `DELETE` | `/api/admin/users/:id` | admin | Soft delete (isActive=false, no borrar físicamente) |

---

## Pantalla: Lista de Clientes (`/admin/customers`)

```
Clientes                                          [ + Nuevo Cliente ]

[ 🔍 Buscar por nombre o email... ]   [ Todos | Regulares | VIP ]

┌──────────────────────────────────────────────────────────────────┐
│  Avatar │ Nombre         │ Email           │ Pedidos │ VIP │ Acc │
├──────────────────────────────────────────────────────────────────┤
│  👤     │ María García   │ maria@email.com │   12    │ ⭐  │ ··· │
│  👤     │ Pedro López    │ pedro@email.com │    3    │     │ ··· │
│  👤     │ Ana Martínez   │ ana@email.com   │   28    │ ⭐  │ ··· │
└──────────────────────────────────────────────────────────────────┘

Mostrando 1-20 de 45 clientes    [< Anterior]  [Siguiente >]
```

---

## Pantalla: Perfil de Cliente (`/admin/customers/:id`)

```
← Volver a Clientes

👤 María García                               [ ⭐ Marcar VIP ]

[  INFORMACIÓN  ] [  PEDIDOS  ] [  RESERVACIONES  ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre:   María García
Email:    maria@email.com
Teléfono: (809) 555-0101
Registrado: 15 de enero, 2025
Estado VIP: ✅ Activo desde: 1 de marzo, 2026
Descuento VIP: 15%             [ Editar % ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Últimos pedidos:
- Pedido #ARN-20260315-AB123  |  RD$ 1,250  |  Completado
- Pedido #ARN-20260310-CD456  |  RD$ 890    |  Completado
```

---

## Pantalla: Editar VIP (`Dialog`)

Al hacer click en "Marcar VIP" o el badge VIP:

```
┌─────────────────────────────────────┐
│  Configuración VIP — María García   │
│                                     │
│  Estado VIP: [ON ●────────] OFF     │
│                                     │
│  Descuento: [15]%                   │
│  (0 a 50% máximo permitido)         │
│                                     │
│  Notas internas:                    │
│  [Cliente habitual desde 2024...]   │
│                                     │
│  [ Cancelar ]    [ Guardar ]        │
└─────────────────────────────────────┘
```

---

## Aplicación del Descuento VIP en Checkout Online

Cuando un cliente VIP realiza un pedido online, el descuento se debe aplicar automáticamente:

```typescript
// En order.controller.ts — POST /api/orders:
const user = await User.findById(req.user.id);
if (user.isVip && user.vipDiscount > 0) {
  order.vipDiscountApplied = user.vipDiscount;
  // El cálculo del total ya incluye el descuento
}
```

El modelo `Order` necesita el campo: `vipDiscountApplied: Number` (default 0).

---

## Criterios de Aceptación

```
SCENARIO: Admin busca un cliente por nombre
  Given hay 45 clientes en el sistema
  When admin escribe "María" en el buscador
  Then la lista filtra en tiempo real mostrando solo los clientes con "María"

SCENARIO: Admin designa cliente como VIP con 20% de descuento
  Given el cliente Pedro López NO es VIP
  When admin abre su perfil, activa VIP y configura 20%
  And hace click en "Guardar"
  Then PATCH /api/admin/users/:id/vip { isVip: true, vipDiscount: 20 } se llama
  And el badge VIP aparece junto al nombre del cliente en la lista
  And vipSince se actualiza a la fecha actual

SCENARIO: Descuento VIP mayor al 50% no es permitido
  Given admin intenta configurar un descuento de 75%
  Then el backend retorna 422 con error "El descuento máximo permitido es 50%"
  And el campo muestra error de validación

SCENARIO: Cliente VIP realiza pedido online — descuento aplicado automáticamente
  Given María García es VIP con 15% de descuento
  When realiza un pedido con subtotal de RD$ 1,000
  Then la Order se crea con discountAmount = 150 y total = 1,003 (subtotal - desc + IVA)
  And en el checkout el cliente ve el descuento desglosado

SCENARIO: Admin desactiva VIP de un cliente
  Given María García tiene VIP activo
  When admin desactiva su estado VIP
  Then isVip = false, vipDiscount = 0
  And sus próximos pedidos no recibirán descuento
```

---

## Task Breakdown

### Backend
- [ ] Verificar que `User` schema tiene `role`, `isVip`, `vipDiscount`, `vipSince`, `vipNotes`
- [ ] Crear `backend/src/controllers/admin.users.controller.ts`
- [ ] `GET /api/admin/users`: paginación (page, limit=20), búsqueda por nombre/email, filtro isVip
- [ ] `PATCH /api/admin/users/:id/vip`: validar `vipDiscount` entre 0-50; actualizar `vipSince` si se activa
- [ ] `DELETE /api/admin/users/:id`: soft delete (agregar campo `isActive: Boolean` al User schema)
- [ ] En `order.controller.ts` (POST /orders): leer `user.isVip` y aplicar descuento al pedido si aplica
- [ ] Agregar campo `vipDiscountApplied: Number` (default 0) al schema `Order`
- [ ] Registrar todas las rutas en el archivo de rutas admin

### Frontend
- [ ] Crear `src/pages/admin/Customers.tsx` con tabla y búsqueda
- [ ] Crear `src/pages/admin/CustomerDetail.tsx` con perfil y pestañas (info / pedidos / reservas)
- [ ] Crear componente `<VipDialog />` (modal) para editar estado VIP y descuento
- [ ] Agregar `adminUserApi` al `api.ts`: `getAll()`, `getById()`, `update()`, `toggleVip()`, `delete()`
- [ ] Mostrar badge "VIP" con color dorado en la tabla y en el perfil

### Pruebas
- [ ] Verificar que el descuento VIP se aplica correctamente en el checkout online
- [ ] Verificar que descuento > 50% es rechazado por el backend
- [ ] Verificar que admin puede buscar clientes por nombre y email simultáneamente
