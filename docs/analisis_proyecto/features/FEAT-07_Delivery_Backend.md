# FEAT-07 — Backend de Delivery

**Épica:** [EPIC-03 — Sistema de Delivery](../epicas/EPIC-03_Sistema_Delivery.md)

> Esta feature construye completamente el backend del sistema de delivery: el modelo `DeliveryOrder`, los controladores, los endpoints REST, y la lógica de simulación del tiempo estimado. No incluye la UI del cliente (ver FEAT-08).

## Descripción

**Como** plataforma del restaurante,
**quiero** un sistema backend que gestione el ciclo completo de las entregas a domicilio,
**para** que el staff pueda asignar repartidores y los clientes puedan ver el estado de su entrega.

**Prioridad:** `Must Have`

---

## Archivos Nuevos a Crear

| Archivo | Propósito |
|---|---|
| `backend/src/models/DeliveryOrder.ts` | Schema Mongoose del delivery |
| `backend/src/controllers/delivery.controller.ts` | Lógica CRUD y máquina de estados |
| `backend/src/routes/delivery.routes.ts` | Endpoints REST |
| `backend/src/services/delivery.service.ts` | Lógica reutilizable (simulación tiempo, auto-complete) |

---

## Integración Automática con el Flujo de Pago

Al completar exitosamente `POST /api/payments` (en `payment.controller.ts`):

```typescript
// Al final del pago exitoso, en el mismo código:
if (order.isDelivery) {
  await DeliveryService.createFromOrder(order);
}
```

El método `createFromOrder(order)`:
1. Crea `DeliveryOrder` con `status: 'pending'`
2. Copia la `shippingAddress` de la Order
3. Vincula `order._id` y `user._id`

---

## Lógica de Simulación de Tiempo

```typescript
// delivery.service.ts
const DELIVERY_MIN_MINUTES = 20;
const DELIVERY_MAX_MINUTES = 45;

const dispatchDelivery = async (deliveryId: string, agentInfo: { name: string, phone: string }) => {
  const estimatedMinutes = Math.floor(
    Math.random() * (DELIVERY_MAX_MINUTES - DELIVERY_MIN_MINUTES + 1)
  ) + DELIVERY_MIN_MINUTES;

  const startedAt = new Date();
  const estimatedArrival = new Date(startedAt.getTime() + estimatedMinutes * 60_000);

  return DeliveryOrder.findByIdAndUpdate(deliveryId, {
    status: 'in_transit',
    startedAt,
    estimatedArrival,
    estimatedMinutes,
    deliveryAgent: agentInfo,
  }, { new: true });
};
```

---

## Job de Auto-Complete (Simulated Arrival)

Cuando un `DeliveryOrder` está en `in_transit` y `estimatedArrival < Date.now()`, el sistema lo actualiza automáticamente a `delivered`. Esto se implementa con un intervalo en el servidor:

```typescript
// En server.ts — se ejecuta cada 2 minutos
setInterval(async () => {
  const now = new Date();
  await DeliveryOrder.updateMany(
    { status: 'in_transit', estimatedArrival: { $lt: now } },
    { status: 'delivered', deliveredAt: now }
  );
}, 2 * 60 * 1000);
```

---

## API Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/delivery/my-active` | Private (customer) | Entrega activa del usuario autenticado |
| `GET` | `/api/delivery/:id` | Private (customer/staff) | Detalle de entrega específica |
| `PATCH` | `/api/delivery/:id/assign` | Private (staff/admin) | Asigna nombre y teléfono del repartidor |
| `PATCH` | `/api/delivery/:id/dispatch` | Private (staff/admin) | Despacha — inicia el timer |
| `PATCH` | `/api/delivery/:id/complete` | Private (staff/admin) | Marca como entregado manualmente |
| `PATCH` | `/api/delivery/:id/fail` | Private (staff/admin) | Marca como fallido con motivo |
| `GET` | `/api/admin/delivery` | Private (staff/admin) | Lista todas las entregas con filtros |

---

## Criterios de Aceptación

```
SCENARIO: DeliveryOrder se crea automáticamente al pagar un pedido con delivery
  Given una Order con isDelivery=true fue pagada exitosamente
  Then se crea automáticamente un DeliveryOrder con status='pending'
  And DeliveryOrder.order = order._id
  And DeliveryOrder.deliveryAddress = order.shippingAddress

SCENARIO: Staff asigna repartidor
  Given existe un DeliveryOrder en status='pending'
  When staff hace PATCH /api/delivery/:id/assign { name, phone }
  Then DeliveryOrder.deliveryAgent = { name, phone }
  And DeliveryOrder.status = 'assigned'

SCENARIO: Staff despacha la entrega
  Given un DeliveryOrder en status='assigned'
  When staff hace PATCH /api/delivery/:id/dispatch
  Then estimatedMinutes = random entre 20 y 45
  And startedAt = now
  And estimatedArrival = now + estimatedMinutes * 60000
  And status = 'in_transit'

SCENARIO: Auto-complete al expirar el tiempo estimado
  Given un DeliveryOrder status='in_transit' con estimatedArrival en el pasado
  When el job de auto-complete se ejecuta (cada 2 min)
  Then DeliveryOrder.status = 'delivered'
  And DeliveryOrder.deliveredAt = timestamp del job

SCENARIO: Staff solo ve los deliveries de la fecha actual por defecto
  Given hay 20 deliveries de días anteriores y 3 del día de hoy
  When staff hace GET /api/admin/delivery (sin filtros)
  Then retorna los 3 deliveries de hoy
  And están ordenados por createdAt DESC

SCENARIO: Cliente sin delivery activo
  Given el usuario no tiene DeliveryOrder en status in_transit/assigned/pending
  When llama GET /api/delivery/my-active
  Then retorna 200 con data: null
  And no retorna 404
```

---

## Task Breakdown

### Backend
- [ ] Crear `backend/src/models/DeliveryOrder.ts` con el schema completo
- [ ] Agregar `isDelivery: Boolean` al schema `Order` si no existe
- [ ] Agregar `DeliveryOrder` al barrel `backend/src/models/index.ts`
- [ ] Crear `backend/src/services/delivery.service.ts` con: `createFromOrder()`, `dispatchDelivery()`
- [ ] Crear `backend/src/controllers/delivery.controller.ts` con todos los métodos
- [ ] Crear `backend/src/routes/delivery.routes.ts` con los endpoints protegidos
- [ ] En `server.ts`: registrar rutas de delivery
- [ ] En `server.ts`: agregar el `setInterval` para auto-complete cada 2 minutos
- [ ] En `payment.controller.ts`: llamar `DeliveryService.createFromOrder(order)` al confirmar pago con delivery
- [ ] Agregar indices en `DeliveryOrder`: `{ user: 1, status: 1 }` y `{ status: 1, estimatedArrival: 1 }`

### Pruebas
- [ ] Test: pago exitoso con isDelivery=true crea DeliveryOrder automáticamente
- [ ] Test: PATCH /dispatch genera estimatedArrival correcto
- [ ] Test: auto-complete job actualiza status a 'delivered' cuando estimatedArrival < now
- [ ] Test: cliente solo ve su propio delivery activo (no el de otro usuario)
- [ ] Test: staff sin rol no puede acceder a endpoints de admin/delivery
