# US-07 — Flujo de Pago Completo en el UI de Checkout

**Feature:** [FEAT-06 — Checkout con Pago Real](../features/FEAT-06_Checkout_Pago_Real.md)
**Épica:** EPIC-02 — Pasarela de Pago Propia

---

## Definición

**Como** cliente que ha confirmado su pedido,
**quiero** poder elegir un método de pago y procesarlo en la misma plataforma,
**para** completar mi compra de forma segura sin salir del sitio.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: UI de Pago en Checkout

  Scenario: Pago con efectivo es el más simple
    Given completé el Paso 1 del checkout y tengo orderId guardado
    And estoy en el Paso 2 "Pago"
    When selecciono "Efectivo"
    And hago click en "Confirmar Pedido — Pago en Efectivo"
    Then se llama POST /api/payments { orderId, method: 'cash' }
    And en éxito soy redirigido a /order-confirmation con la referencia del pago

  Scenario: Pago con tarjeta — datos mínimos requeridos
    Given estoy en el formulario de pago con método "Tarjeta"
    When ingreso: número tarjeta "4111111111111111", nombre "ANA LOPEZ", venc. 12/28, CVV "123"
    And hago click en "Pagar"
    Then el payload enviado al backend es SOLO: { orderId, method: 'card', last4Digits: '1111', cardHolder: 'ANA LOPEZ' }
    And el CVV ('123') NO está en el payload
    And el número completo ('4111...') NO está en el payload

  Scenario: Número de tarjeta con menos de 16 dígitos bloquea el submit
    Given estoy en el formulario de tarjeta
    When ingreso un número de 15 dígitos
    Then el botón "Pagar" está deshabilitado
    And se muestra: "El número de tarjeta debe tener 16 dígitos"

  Scenario: Pago con transferencia — referencia obligatoria
    Given selecciono "Transferencia Bancaria"
    When dejo el campo "Referencia de transferencia" vacío
    And hago click en confirmar
    Then el botón NO hace ninguna llamada al API
    And se muestra: "La referencia de transferencia es obligatoria"

  Scenario: Pago fallido — reintentar sin nueva Order
    Given el pago con tarjeta es rechazado por el API (422)
    Then se muestra el error específico del servidor (ej: "Datos de tarjeta inválidos")
    And el formulario de pago permanece visible para corregir
    And el orderId sigue siendo el mismo (NO se crea nueva Order)
    And puedo cambiar a pago en efectivo y reintentar exitosamente

  Scenario: Error de red durante el pago
    Given el servidor no responde al procesar el pago
    Then se muestra: "Error de conexión. Verifica tu internet e intenta nuevamente."
    And el botón vuelve a estar habilitado após 3s

  Scenario: Pantalla de confirmación post-pago exitoso
    Given el pago fue procesado exitosamente
    When llego a /order-confirmation
    Then veo:
      - Referencia del pago: ARN-20260310-AB123
      - Total pagado: RD$ 1,425.00
      - Método utilizado: Efectivo / Tarjeta (últimos 4 dígitos) / Transferencia
      - Si es delivery: mensaje "Tu pedido está siendo preparado para entrega"
      - Si es pickup: mensaje "Puedes recoger tu pedido en el restaurante"
    And hay un botón "Ver mis pedidos" que lleva a /my-orders
```

---

## Desglose de Tareas

### Backend
- [ ] Verificar que FEAT-05 / US-06 está completo y `POST /api/payments` funciona
- [ ] Verificar que la respuesta incluye: `{ payment: { reference, amount, method }, order: { _id, status } }`
- [ ] Verificar que `method: 'cash'` no requiere ningún campo adicional (no retorna error 400)

### Frontend — Componente `<PaymentForm />`
- [ ] Crear `src/components/PaymentForm.tsx`:
  - Props: `orderId: string`, `total: number`, `onSuccess: (payment) => void`, `onError: (msg) => void`
  - Estado local: `method: 'cash' | 'card' | 'transfer'`, `isProcessing: boolean`
  - Renderiza diferente formulario según método seleccionado

- [ ] **Método Efectivo**: solo un botón con el total, sin campos adicionales

- [ ] **Método Tarjeta**:
  - Campo número de tarjeta: isMasked input (`**** **** **** XXXX`)
  - Campo nombre en tarjeta
  - Campos vencimiento (MM/AA) y CVV (visible en form, NO enviado al backend)
  - Validación: número = 16 dígitos, vencimiento válido (no expirado), CVV = 3-4 dígitos
  - En submit: `payload = { orderId, method: 'card', last4Digits: cardNumber.slice(-4), cardHolder }`
  - CVV y número completo: descartados en submit, **nunca en el payload**

- [ ] **Método Transferencia**:
  - Mostrar datos bancarios del restaurante (hardcodeados como constantes)
  - Campo referencia de transferencia (requerido)
  - En submit: `payload = { orderId, method: 'transfer', transferRef }`

- [ ] Botón de pago: deshabilitar + spinner mientras `isProcessing === true`
- [ ] En éxito: llamar `onSuccess(payment)` → el padre maneja la redirección
- [ ] En error: mostrar el mensaje de error inline bajo el formulario (no solo toast)

### Frontend — Checkout.tsx (Paso 2)
- [ ] Tras crear la Order en Paso 1, guardar `orderId` en `useState`
- [ ] Cambiar `checkoutStep` a `'payment'`
- [ ] Renderizar `<PaymentForm orderId={orderId} total={order.total} onSuccess={handleSuccess} />`
- [ ] `handleSuccess(payment)`: navegar a `/order-confirmation` con state: `{ payment, order }`
- [ ] Agregar `paymentApi.create()` en `src/services/api.ts`

### Frontend — Nueva página `OrderConfirmation.tsx`
- [ ] Crear `src/pages/OrderConfirmation.tsx`
- [ ] Leer `location.state.payment` y `location.state.order`
- [ ] Si no hay state (acceso directo a la URL): redirigir a `/my-orders`
- [ ] Mostrar: referencia, total formateado, método, y mensaje contextual (delivery vs pickup)
- [ ] Si delivery: link "Rastrear mi pedido" → `/order-tracking/:orderId`
- [ ] Agregar la ruta `/order-confirmation` a `App.tsx`

### Pruebas
- [ ] Test: inspeccionar payload de red — CVV no aparece
- [ ] Test: inspeccionar payload de red — número de tarjeta completo no aparece
- [ ] Test: validación de número < 16 dígitos bloquea el submit
- [ ] Test: pago fallido permite reintentar con diferente método sin nueva Order
- [ ] Test: /order-confirmation acepta state; si se accede directamente, redirige a /my-orders
