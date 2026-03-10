# FEAT-05 — Motor de Pago en Base de Datos

**Épica:** [EPIC-02 — Pasarela de Pago Propia](../epicas/EPIC-02_Pasarela_de_Pago_Propia.md)

> Esta feature construye todo el backend de la pasarela de pago propia: los modelos de datos `Payment` y `Transaction`, los controladores, los endpoints de la API y las reglas de negocio críticas de seguridad. Es la fundación sobre la que se construye FEAT-06 (la UI de checkout con pago real).

## Descripción

**Como** sistema de cobro del restaurante,
**quiero** un motor de pagos propio sobre MongoDB,
**para** registrar y validar todas las transacciones financieras sin depender de procesadores externos.

**Prioridad:** `Must Have`

---

## Archivos Nuevos a Crear

| Archivo | Propósito |
|---|---|
| `backend/src/models/Payment.ts` | Schema Mongoose del pago |
| `backend/src/models/Transaction.ts` | Schema Mongoose de la transacción individual |
| `backend/src/controllers/payment.controller.ts` | Lógica de negocio de pagos |
| `backend/src/routes/payment.routes.ts` | Endpoints REST del módulo de pagos |
| `backend/src/services/payment.service.ts` | Lógica reutilizable (genera reference, valida método) |

---

## Schema Detallado: `Payment`

```typescript
// backend/src/models/Payment.ts
const PaymentSchema = new Schema({
  order:         { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  user:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount:        { type: Number, required: true, min: 0 },
  method:        { type: String, enum: ['card', 'cash', 'transfer'], required: true },
  status:        { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending' },
  reference:     { type: String, unique: true },   // ARN-YYYYMMDD-XXXXX
  last4Digits:   { type: String, match: /^\d{4}$/ },
  cardHolder:    { type: String },
  cardHash:      { type: String, select: false },  // NUNCA en responses
  transferRef:   { type: String },
  paidAt:        { type: Date },
  failureReason: { type: String },
  refundedAt:    { type: Date },
}, { timestamps: true });
```

## Schema Detallado: `Transaction`

```typescript
// backend/src/models/Transaction.ts
const TransactionSchema = new Schema({
  payment:   { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
  type:      { type: String, enum: ['charge', 'refund'], required: true },
  status:    { type: String, enum: ['success', 'failed'], required: true },
  amount:    { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String, required: true },
  userAgent: { type: String },
  notes:     { type: String },
});
```

---

## Lógica del Controlador: `POST /api/payments`

```
1. Validar input: orderId, method son requeridos
2. Buscar Order por orderId — debe existir y pertenecer a req.user.id
3. Verificar que Order.status === 'pending' (no podemos pagar una ya confirmada)
4. Calcular amount = order.total (NUNCA del request body)
5. Generar reference único: ARN-{YYYYMMDD}-{random 5 chars uppercase}
6. Iniciar MongoDB session (para atomicidad)
7. Crear Payment { order, user, amount, method, status: 'pending', reference }
8. Procesar según método:
   - 'cash': Aprobar directamente (sin datos de tarjeta)
   - 'card': Validar last4Digits (4 dígitos), cardHolder (requerido), 
             hashear número completo con bcrypt (si se proporciona), 
             NUNCA guardar CVV
   - 'transfer': Validar transferRef requerido
9. Actualizar Payment.status = 'completed', paidAt = now
10. Actualizar Order.status = 'confirmed', Order.paymentStatus = 'paid'
11. Crear Transaction { payment._id, type: 'charge', status: 'success', amount, ipAddress, userAgent }
12. Commit session
13. Si hay error en cualquier paso: abort session, Payment.status = 'failed', crear Transaction failed
14. Return: { success: true, data: { payment (sin cardHash), order } }
```

---

## Generación de Referencia Única

```typescript
// payment.service.ts
const generateReference = async (): Promise<string> => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref: string;
  let exists = true;
  while (exists) {
    const random = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    ref = `ARN-${date}-${random}`;
    exists = !!(await Payment.findOne({ reference: ref }));
  }
  return ref!;
};
```

---

## Criterios de Aceptación

```
SCENARIO: Pago exitoso con método efectivo
  Given existe una Order en status='pending' con total=850.00
  When se hace POST /api/payments { orderId, method: 'cash' }
  Then Payment se crea con amount=850.00 (del servidor, no del request)
  And Payment.status = 'completed'
  And Order.status = 'confirmed', Order.paymentStatus = 'paid'
  And Transaction se crea con type='charge', status='success'
  And la respuesta incluye Payment.reference tipo "ARN-20260310-X7K2P"

SCENARIO: Monto manipulado por el cliente es rechazado
  Given una Order con total=850.00
  When se envía POST /api/payments { orderId, method: 'cash', amount: 1 }
  Then el amount del Payment se calcula desde order.total = 850.00
  And el campo 'amount' del request body se ignora completamente

SCENARIO: CVV nunca se almacena
  Given un pago con método 'card'
  When se envía cardCvv en el request body
  Then el campo cardCvv se descarta antes de cualquier persistencia
  And ningún documento en MongoDB contiene el CVV

SCENARIO: Pago fallido — Order permanece en pending
  Given el método de pago es inválido o rechazado
  When POST /api/payments falla la validación
  Then Payment.status = 'failed'
  And Order.status permanece 'pending'
  And se puede reintentar el pago con un nuevo POST /api/payments

SCENARIO: Admin emite reembolso
  Given existe un Payment con status='completed'
  When admin hace POST /api/payments/:id/refund
  Then Payment.status = 'refunded', refundedAt = now
  And Order.status = 'cancelled'
  And Transaction nueva con type='refund', status='success'
```

---

## Task Breakdown

### Backend
- [ ] Crear `backend/src/models/Payment.ts` con el schema definido
- [ ] Crear `backend/src/models/Transaction.ts` con el schema definido
- [ ] Agregar ambos modelos al barrel `backend/src/models/index.ts`
- [ ] Agregar campos `paymentStatus: 'pending'|'paid'|'refunded'` al schema `Order` si no existe
- [ ] Crear `backend/src/services/payment.service.ts` con `generateReference()` y `hashCardNumber()`
- [ ] Crear `backend/src/controllers/payment.controller.ts` con métodos: `createPayment`, `getMyPayments`, `getPaymentById`, `refundPayment`, `adminGetAllPayments`
- [ ] Implementar lógica de MongoDB session para atomicidad en `createPayment`
- [ ] Asegurar que `cardHash` tiene `select: false` (nunca en responses por defecto)
- [ ] Instalar `express-rate-limit` si no está instalado; aplicar límite en `POST /api/payments`
- [ ] Crear `backend/src/routes/payment.routes.ts` con todos los endpoints
- [ ] Registrar las rutas en `backend/src/server.ts`

### Pruebas
- [ ] Test unitario: `generateReference()` genera formato correcto y es único
- [ ] Test de integración: POST /api/payments con method='cash' — verifica atomicidad
- [ ] Test de seguridad: amount del request se ignora; se usa order.total
- [ ] Test de seguridad: cardHash no aparece en la respuesta
- [ ] Test de error: Order de otro usuario retorna 403
- [ ] Test de reintento: pago fallido no bloquea reintento
