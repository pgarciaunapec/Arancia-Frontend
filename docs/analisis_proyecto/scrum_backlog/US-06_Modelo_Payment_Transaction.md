# US-06 — Modelo de Pago en BD y Motor de Transacciones

**Feature:** [FEAT-05 — Motor de Pago en BD](../features/FEAT-05_Motor_Pago_BD.md)
**Épica:** EPIC-02 — Pasarela de Pago Propia

---

## Definición

**Como** sistema de cobro del restaurante,
**quiero** modelos de datos seguros para registrar pagos y transacciones,
**para** tener un registro auditable y nunca exponer datos sensibles del cliente.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Motor de Pago en Base de Datos

  Scenario: Pago exitoso con efectivo — flujo atómico
    Given existe Order X con total=RD$ 850.00 y status='pending'
    When se llama POST /api/payments { orderId: X, method: 'cash' }
    Then Payment se crea con amount=850.00 (calculado desde la Order, no del request)
    And Payment.status = 'completed'
    And Order X.status = 'confirmed'
    And Order X.paymentStatus = 'paid'
    And Transaction creada: { type: 'charge', status: 'success', amount: 850.00 }
    And la operación es atómica: si cualquier paso falla, todo hace rollback

  Scenario: El monto del request se ignora completamente
    Given Order X tiene total=RD$ 850.00
    When el cliente envía POST /api/payments { orderId: X, method: 'cash', amount: 1 }
    Then el Payment se crea con amount=850.00 (del servidor)
    And el campo 'amount' del request body es completamente ignorado
    And no se devuelve error por el amount del request (se ignora silenciosamente)

  Scenario: CVV y número de tarjeta nunca se almacenan
    Given un pago con method='card'
    When se envía { cardNumber: '4111111111111111', cvv: '123', last4Digits: '1111', cardHolder: 'ANA LOPEZ' }
    Then Payment.last4Digits = '1111'
    And Payment.cardHolder = 'ANA LOPEZ'
    And Payment.cardHash = bcrypt.hash('4111...') — solo para verificación futura
    And cardNumber NO existe en ningún campo del documento Payment
    And cvv NO existe en ningún campo del documento Payment

  Scenario: Pago fallido mantiene Order en pending
    Given el pago es rechazado (datos inválidos)
    Then Payment.status = 'failed'
    And Order.status permanece 'pending'
    And Order.paymentStatus permanece 'pending'
    And el cliente puede reintentar con un nuevo POST /api/payments para la misma Order

  Scenario: Segunda solicitud de pago para la misma Order exitosamente pagada
    Given Order X ya fue pagada (Payment.status='completed')
    When se intenta POST /api/payments { orderId: X, method: 'cash' }
    Then el API retorna 409 "Esta orden ya ha sido pagada"
    And NO se crea un segundo Payment

  Scenario: Referencia generada es única y tiene el formato correcto
    Given se procesa un pago exitoso el 10 de marzo de 2026
    Then el Payment.reference tiene el formato: "ARN-20260310-XXXXX"
    Where XXXXX son 5 caracteres alfanuméricos en mayúsculas
    And la referencia es única en la colección de Payments

  Scenario: Admin emite reembolso
    Given existe Payment con status='completed' y amount=850.00
    When admin llama POST /api/payments/:id/refund
    Then Payment.status = 'refunded', refundedAt = now
    And Order.status = 'cancelled'
    And Transaction nueva: { type: 'refund', status: 'success', amount: 850.00 }
```

---

## Desglose de Tareas

### Backend — Modelos
- [ ] Crear `backend/src/models/Payment.ts` con todos los campos especificados
- [ ] Asegurar `cardHash: { type: String, select: false }` — nunca en responses por defecto
- [ ] Crear `backend/src/models/Transaction.ts`
- [ ] Agregar `paymentStatus: { type: String, enum: ['pending','paid','refunded'], default: 'pending' }` al schema `Order`
- [ ] Agregar `Payment` y `Transaction` al barrel `backend/src/models/index.ts`

### Backend — Servicio de Pago
- [ ] Crear `backend/src/services/payment.service.ts`:
  - `generateReference(): Promise<string>` — genera ARN-YYYYMMDD-XXXXX único
  - `hashCardNumber(cardNumber: string): Promise<string>` — bcrypt hash del número
- [ ] Import de `bcryptjs` ya disponible en el proyecto

### Backend — Controlador
- [ ] Crear `backend/src/controllers/payment.controller.ts`:
  - `createPayment`:
    1. Validar `orderId`, `method` requeridos
    2. Buscar Order — verificar `order.user.toString() === req.user.id` (403 si no pertenece)
    3. Verificar `order.status === 'pending'` (409 si ya confirmada/pagada)
    4. `amount = order.total` (ignorar cantidad del request)
    5. Generar `reference` único
    6. Iniciar MongoDB session
    7. Crear Payment `{ status: 'pending' }`
    8. Procesar según método (ver lógica en FEAT-05)
    9. Update Payment → `completed`, Order → `confirmed/paid`, crear Transaction
    10. Commit o rollback session
  - `getMyPayments`: filtrar por `user: req.user.id`
  - `getPaymentById`: verificar que pertenece al usuario o es admin
  - `refundPayment`: solo admin; actualizar Payment + Order + crear Transaction de refund
  - `adminGetAllPayments`: con filtros de fecha, método, status; solo admin/staff

### Backend — Rutas y Rate Limiting
- [ ] Crear `backend/src/routes/payment.routes.ts`
- [ ] Instalar `express-rate-limit` si no está: `npm install express-rate-limit`
- [ ] Aplicar rate limit de 3 requests por usuario/15min en `POST /api/payments`
- [ ] Registrar rutas en `server.ts`

### Pruebas
- [ ] Test unitario: `generateReference()` — formato correcto, sin colisiones en 1000 ejecuciones
- [ ] Test de integración: POST /payments — amount del request ignorado, se usa order.total
- [ ] Test de seguridad: verificar que `cardHash` field nunca aparece en respuesta JSON
- [ ] Test de atomicidad: si `Order.update` falla, el Payment hace rollback
- [ ] Test: segundo intento de pago en Order ya pagada retorna 409
- [ ] Test: pago de Order de otro usuario retorna 403
