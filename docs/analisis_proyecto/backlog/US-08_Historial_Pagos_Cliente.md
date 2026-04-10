# US-08 — Historial de Pagos del Cliente

**Feature:** EPIC-02 — Pasarela de Pago Propia
**Épica:** EPIC-02

---

## Definición

**Como** cliente registrado,
**quiero** ver el historial de todos mis pagos con sus referencias, montos y estados,
**para** tener trazabilidad de mis transacciones y poder reclamar si algo falla.

**Prioridad:** `Should Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Historial de Pagos del Cliente

  Scenario: Ver lista de pagos propios
    Given estoy autenticado como cliente
    And tengo 3 pagos registrados (2 completados, 1 fallido)
    When navego a /my-orders y abro la pestaña "Mis Pagos"
    Then veo una tabla/lista con:
      - Referencia: ARN-20260310-AB123
      - Pedido asociado (ej: Pedido #ORD-0001)
      - Método: Efectivo / Tarjeta ****1234 / Transferencia
      - Monto: RD$ 1,425.00
      - Estado: Completado (verde) / Fallido (rojo)
      - Fecha: "10 mar 2026, 7:45 PM"
    And los pagos están ordenados del más reciente al más antiguo

  Scenario: Cliente sin pagos ve estado vacío
    Given soy un cliente nuevo sin pedidos completados
    When navego a la sección de pagos
    Then veo el mensaje: "Aún no tienes pagos registrados."
    And un botón "Explorar el menú" que lleva a /menu

  Scenario: Pago con tarjeta oculta número completo
    Given tengo un pago realizado con tarjeta
    When veo el método de pago en mi historial
    Then se muestra: "Tarjeta terminada en 1234"
    And NUNCA se muestra el número completo ni el CVV

  Scenario: Acceso denegado si no autenticado
    Given NO estoy autenticado
    When intento acceder a /my-payments
    Then soy redirigido a /login con state.from = '/my-payments'
    And tras autenticarme, regreso a /my-payments

  Scenario: Ver detalle de un pago fallido
    Given tengo un pago en estado "Fallido"
    When hago click en ese pago
    Then veo el motivo del fallo si está disponible (ej: "Datos de tarjeta inválidos")
    And veo el botón "Ir a mis pedidos" para gestionar el pedido afectado
```

---

## Desglose de Tareas

### Backend
- [ ] Crear endpoint `GET /api/payments/my`:
  - Protected: `requireAuth` middleware
  - Query MongoDB: `Payment.find({ user: req.user.id }).populate('order', 'orderNumber createdAt').sort({ createdAt: -1 })`
  - Proyección: excluir `cardHash` (field con `select: false` en schema)
  - Response: `{ payments: [...] }`
- [ ] Agregar campo `orderNumber` a Order model (formato `ORD-XXXX` incremental) o usar `_id` como identificador human-readable
- [ ] Registrar ruta en `backend/src/routes/` (puede ir en `order.routes.ts` o nuevo `payment.routes.ts`)

### Frontend
- [ ] Agregar `paymentApi.getMyPayments()` en `src/services/api.ts`
- [ ] En `MyOrders.tsx`: agregar pestaña "Mis Pagos" junto a "Mis Pedidos"
- [ ] Crear componente `<PaymentHistoryList payments={payments} />`:
  - Skeleton de carga mientras fetching
  - Estado vacío con call-to-action
  - Lista: referencia, pedido vinculado (link a detalle), método formateado, monto, badge de estado, fecha
  - Badge de estado: `Completado` → `badge-success`, `Fallido` → `badge-destructive`, `Pendiente` → `badge-warning`
  - Formato de tarjeta: si `last4Digits` existe → "Tarjeta ****{last4Digits}"
- [ ] Agregar ruta `/my-payments` o manejar como tab en `/my-orders` → decidir estructura con UX

### Pruebas
- [ ] Test: `GET /api/payments/my` solo retorna pagos del usuario autenticado, no de otros
- [ ] Test: campo `cardHash` no aparece en la respuesta JSON
- [ ] Test: usuario sin pagos retorna `200 { payments: [] }`
