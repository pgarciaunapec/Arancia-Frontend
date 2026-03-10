# US-09 — Modelo de Delivery en Base de Datos y Backend

**Feature:** [FEAT-07 — Backend de Delivery](../features/FEAT-07_Delivery_Backend.md)
**Épica:** EPIC-03 — Sistema de Delivery

---

## Definición

**Como** plataforma,
**quiero** que al confirmar un pago de pedido con delivery se cree automáticamente una `DeliveryOrder` en la base de datos,
**para** poder gestionar el ciclo de vida de la entrega desde el panel de administración.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Modelo DeliveryOrder y flujo backend

  Scenario: DeliveryOrder creada al pagar un pedido con delivery
    Given un pedido fue creado con isDelivery=true y deliveryAddress válida
    When el pago es procesado exitosamente (Payment.status = 'completed')
    Then se crea automáticamente una DeliveryOrder con:
      - order: ObjectId del pedido
      - user: ObjectId del cliente
      - deliveryAddress: { street, city, reference? }
      - status: 'pending'
      - estimatedMinutes: null (se asigna al despachar)

  Scenario: No se crea DeliveryOrder si el pedido es para recoger
    Given un pedido fue creado con isDelivery=false
    When el pago es procesado exitosamente
    Then NO se crea ninguna DeliveryOrder
    And la respuesta del API no contiene campo 'delivery'

  Scenario: Staff despacha el pedido — tiempo estimado calculado
    Given tengo una DeliveryOrder con status='assigned'
    And estoy autenticado como staff o admin
    When hago PATCH /api/delivery/:id/dispatch con { agentName, agentPhone }
    Then DeliveryOrder se actualiza:
      - status: 'in_transit'
      - startedAt: now (timestamp del servidor)
      - estimatedMinutes: número aleatorio entre 20 y 45
      - estimatedArrival: startedAt + estimatedMinutes * 60000
      - deliveryAgent: { name: agentName, phone: agentPhone }
    And la respuesta incluye estimatedArrival en formato ISO 8601

  Scenario: DeliveryOrder archivada automáticamente como 'delivered'
    Given una DeliveryOrder tiene status='in_transit'
    And su estimatedArrival.getTime() < Date.now()
    When el job periódico de auto-complete se ejecuta
    Then DeliveryOrder.status se actualiza a 'delivered'
    And Order.status se actualiza a 'delivered'
    And DeliveryOrder.deliveredAt = ahora

  Scenario: Mark entrega manual por staff (respaldo)
    Given una DeliveryOrder con status='in_transit'
    When staff llama PATCH /api/delivery/:id/complete
    Then DeliveryOrder.status = 'delivered'
    And Order.status = 'delivered'
    And DeliveryOrder.deliveredAt = ahora

  Scenario: Cliente consulta su DeliveryOrder activa
    Given tengo un pedido activo con delivery en tránsito
    When llamo GET /api/delivery/my-active
    Then recibo:
      - deliveryOrder._id
      - status: 'in_transit'
      - estimatedArrival: ISO timestamp
      - deliveryAgent.name (sin teléfono)
      - order.orderNumber (para referencia)
    And NO recibo deliveryAgent.phone (privacidad)

  Scenario: Pedido fallido de delivery
    Given una DeliveryOrder en tránsito no puede ser entregada
    When staff llama PATCH /api/delivery/:id/fail con { reason }
    Then DeliveryOrder.status = 'failed'
    And se registra el motivo del fallo
    And Order.status permanece en 'confirmed' (no en 'delivered')
```

---

## Especificación del Modelo: `DeliveryOrder`

```typescript
// backend/src/models/DeliveryOrder.ts
{
  order:             { type: ObjectId, ref: 'Order', required: true, unique: true },
  user:              { type: ObjectId, ref: 'User', required: true },
  deliveryAddress: {
    street:          { type: String, required: true, maxLength: 200 },
    city:            { type: String, required: true, maxLength: 100 },
    reference:       { type: String, maxLength: 300 }  // Opcional
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_transit', 'delivered', 'failed'],
    default: 'pending'
  },
  estimatedMinutes: { type: Number, min: 0, max: 120 },
  startedAt:        { type: Date },
  estimatedArrival: { type: Date },
  deliveredAt:      { type: Date },
  deliveryAgent: {
    name:  { type: String },
    phone: { type: String, select: false }  // No exponer al cliente
  },
  failureReason:    { type: String },
  timestamps: true
}
```

## Desglose de Tareas

### Backend — Modelo y Servicio
- [ ] Crear `backend/src/models/DeliveryOrder.ts` con el schema documentado arriba
- [ ] Crear `backend/src/services/delivery.service.ts` con:
  - `createDeliveryOrder(orderId, userId, deliveryAddress)`: crea DeliveryOrder con status 'pending'
  - `dispatchDelivery(deliveryOrderId, agentName, agentPhone)`: calcula estimatedMinutes = Math.floor(Math.random() * 26) + 20, setea startedAt + estimatedArrival
  - `autoCompleteExpiredDeliveries()`: query DeliveryOrder { status: 'in_transit', estimatedArrival: { $lt: new Date() } } → actualizar status a 'delivered'
  - `completeDelivery(deliveryOrderId)`: manual complete por staff
  - `failDelivery(deliveryOrderId, reason)`: marcar como fallido
  - `getClientActiveDelivery(userId)`: retorna DeliveryOrder activa del cliente (sin agent.phone)
- [ ] En `payment.controller.ts` (o payment.service.ts): tras confirmar Payment exitoso, si `order.isDelivery === true` → llamar `createDeliveryOrder()`

### Backend — Rutas y Controlador
- [ ] Crear `backend/src/routes/delivery.routes.ts`:
  - `GET /api/delivery/my-active` — requireAuth (cliente)
  - `GET /api/delivery` — requireAuth + requireRole(['admin','staff']) — listar todas activas
  - `GET /api/delivery/:id` — requireAuth + requireRole(['admin','staff'])
  - `PATCH /api/delivery/:id/assign` — requireRole(['admin','staff'])
  - `PATCH /api/delivery/:id/dispatch` — requireRole(['admin','staff'])
  - `PATCH /api/delivery/:id/complete` — requireRole(['admin','staff'])
  - `PATCH /api/delivery/:id/fail` — requireRole(['admin','staff'])
- [ ] Crear `backend/src/controllers/delivery.controller.ts`
- [ ] Registrar rutas en `server.ts`

### Backend — Job de Auto-Complete
- [ ] En `server.ts`, al iniciar la app: `setInterval(() => autoCompleteExpiredDeliveries(), 60 * 1000)` (cada 60 segundos)
- [ ] El job actualiza tanto `DeliveryOrder.status` como `Order.status` en la misma operación

### Frontend
- [ ] Agregar métodos en `src/services/api.ts`:
  - `deliveryApi.getMyActive()` → `GET /api/delivery/my-active`
- [ ] (pendiente US-10 para la UI de tracking)

### Pruebas
- [ ] Test: crear pedido con isDelivery=true → pagar → DeliveryOrder creada en DB
- [ ] Test: crear pedido con isDelivery=false → pagar → DeliveryOrder NO creada
- [ ] Test: PATCH /dispatch → estimatedMinutes entre 20 y 45, estimatedArrival = startedAt + estimatedMinutes
- [ ] Test: GET /my-active → no incluye deliveryAgent.phone
- [ ] Test: autoCompleteExpiredDeliveries → solo afecta deliveries con estimatedArrival vencido
