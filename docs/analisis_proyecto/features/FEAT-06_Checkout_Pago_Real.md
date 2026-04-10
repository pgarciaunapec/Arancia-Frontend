# FEAT-06 — Checkout Integrado con Pago Real

**Épica:** [EPIC-02 — Pasarela de Pago Propia](../epicas/EPIC-02_Pasarela_de_Pago_Propia.md)

> Con el motor de pago del backend construido en FEAT-05, esta feature amplía el flujo de checkout del frontend para incluir el paso de pago real. El checkout se convierte en un flujo de 2 pasos: (1) Confirmar pedido y (2) Seleccionar método de pago y pagar.

## Descripción

**Como** cliente que ha confirmado su pedido,
**quiero** poder pagar con efectivo, tarjeta o transferencia directamente en la plataforma,
**para** completar mi compra sin salir del sitio web.

**Prioridad:** `Must Have`

---

## Flujo de Checkout Extendido (2 Pasos)

```
Paso 1: Confirmar Pedido (FEAT-02)
  - Ver ítems del carrito
  - Pre-llenar datos de contacto
  - Elegir pickup vs delivery
  - Si delivery: ingresar dirección
  - Al hacer click "Continuar al Pago" → crear Order en backend → ir al Paso 2

Paso 2: Pagar (FEAT-06 — NUEVO)
  - Ver resumen del pedido (total, referencia de pedido)
  - Seleccionar método de pago: Efectivo / Tarjeta / Transferencia
  - Si Tarjeta: formulario de datos de tarjeta
  - Si Transferencia: campo para referencia bancaria
  - Botón "Confirmar Pago"
  - Llamar POST /api/payments
  - Si éxito: → /order-confirmation
  - Si error: mostrar error + opción de reintentar
```

---

## UI de Formulario de Pago

### Método: Efectivo

```
┌──────────────────────────────────────────────────────┐
│  💵 Pago en Efectivo                                │
│                                                     │
│  Pagarás RD$ 1,250.00 al recibir tu pedido.        │
│  (Para delivery) o al recoger en el restaurante.   │
│                                                     │
│  [   Confirmar Pedido — Pago en Efectivo   ]        │
└──────────────────────────────────────────────────────┘
```

### Método: Tarjeta

```
┌──────────────────────────────────────────────────────┐
│  💳 Pago con Tarjeta                                │
│                                                     │
│  Número de Tarjeta: [**** **** **** ____]           │
│  Nombre en la Tarjeta: [________________]           │
│  Vencimiento: [MM/AA]   CVV: [___] *               │
│                                                     │
│  * El CVV se verifica localmente y no se almacena. │
│                                                     │
│  [   Pagar RD$ 1,250.00   ]                        │
└──────────────────────────────────────────────────────┘
```

### Método: Transferencia Bancaria

```
┌──────────────────────────────────────────────────────┐
│  🏦 Transferencia Bancaria                          │
│                                                     │
│  Cuenta: Arancia Restaurant                        │
│  Banco: BanReservas                                 │
│  Cta. No: 000-123456-7                              │
│                                                     │
│  Una vez realizada la transferencia, ingresa el    │
│  número de confirmación:                           │
│  Referencia: [________________________]             │
│                                                     │
│  [   Confirmar Transferencia   ]                   │
└──────────────────────────────────────────────────────┘
```

---

## Criterios de Aceptación

```
SCENARIO: Cliente selecciona pago en efectivo
  Given el cliente está en el Paso 2 del checkout
  And la Order fue creada exitosamente
  When selecciona "Efectivo" y hace click en "Confirmar"
  Then se llama POST /api/payments { orderId, method: 'cash' }
  And en caso de éxito, navega a /order-confirmation con payment.reference
  And el carrito queda vacío

SCENARIO: Cliente paga con tarjeta
  Given el cliente selecciona método "Tarjeta"
  When completa: número de tarjeta (16 dígitos), nombre, vencimiento, CVV
  And hace click en "Pagar"
  Then se llama POST /api/payments { orderId, method: 'card', last4Digits, cardHolder }
  And el CVV NUNCA se envía al backend
  And el número completo de la tarjeta NUNCA se envía al backend

SCENARIO: Tarjeta con datos incompletos
  Given el cliente está en el formulario de tarjeta
  When el número de tarjeta tiene menos de 16 dígitos
  Then el botón "Pagar" está deshabilitado
  And se muestra mensaje de validación inline

SCENARIO: Pago fallido — cliente puede reintentar
  Given el pago es rechazado por la API
  When la API retorna 422 con { error: 'Datos de tarjeta inválidos' }
  Then se muestra el mensaje de error específico
  And el formulario de pago sigue visible
  And el cliente puede corregir los datos y reintentar
  And la Order NO se cancela por los reintentos

SCENARIO: Error de red durante el pago
  Given el servidor no responde durante el pago
  When la llamada a la API falla con error de red
  Then se muestra "Error de conexión. Por favor verifica tu internet y reintenta."
  And la Order permanece en 'pending'

SCENARIO: Pantalla de confirmación post-pago
  Given el pago fue procesado exitosamente
  When el cliente llega a /order-confirmation
  Then ve el número de referencia ARN-XXXXXX
  And el total pagado
  And el método de pago utilizado
  And el tiempo estimado de preparación
  And un botón "Ver mis pedidos" que lleva a /my-orders
```

---

## Seguridad del Formulario de Tarjeta

| Dato | Manejo en Frontend |
|---|---|
| Número de tarjeta (16 dígitos) | Solo se extraen los últimos 4; el resto se descarta |
| CVV (3-4 dígitos) | Se muestra campo para UX, pero **NUNCA se envía al backend** |
| Nombre en la tarjeta | Se envía como `cardHolder` |
| Vencimiento | Solo validación visual de formato; se envía en request |

---

## Task Breakdown

### Backend
- [ ] Verificar que FEAT-05 está completado (`POST /api/payments` funcional)
- [ ] Verificar que la respuesta de `POST /api/payments` incluye `reference` y `amount`
- [ ] Asegurar que el campo `method: 'cash'` no requiere campos de tarjeta

### Frontend (Nuevo componente `<PaymentForm />`)
- [ ] Crear `src/components/PaymentForm.tsx` con props: `orderId`, `total`, `onSuccess`, `onError`
- [ ] Implementar selector de método de pago: tabs o radio buttons (Efectivo / Tarjeta / Transferencia)
- [ ] Formulario de tarjeta: enmascarar número mientras se escribe (`**** **** **** XXXX`)
- [ ] Extraer solo `last4Digits` del número de tarjeta; descartar el resto en el submit
- [ ] Campo CVV presente en UI pero **no incluido en el payload** al hacer POST
- [ ] Validación con `react-hook-form`: número 16 dígitos, vencimiento válido, CVV 3-4 dígitos
- [ ] Estado `isProcessing` para mostrar spinner y deshabilitar botón durante la llamada

### Frontend (Checkout.tsx — integración en Paso 2)
- [ ] Dividir checkout en 2 pasos con estado local `checkoutStep: 'order' | 'payment'`
- [ ] Post-creación de Order exitosa: guardar `orderId` en estado y pasar a `checkoutStep = 'payment'`
- [ ] Renderizar `<PaymentForm orderId={...} total={...} onSuccess={handlePaymentSuccess} />`
- [ ] En `handlePaymentSuccess(payment)`: navegar a `/order-confirmation` con la referencia
- [ ] Nuevo servicio en `api.ts`: `paymentApi.create({ orderId, method, last4Digits?, cardHolder?, transferRef? })`

### Pruebas
- [ ] Verificar que el CVV no aparece en ninguna llamada de red (DevTools → Network tab)
- [ ] Verificar que el número completo de la tarjeta no aparece en ninguna llamada de red
- [ ] Verificar que un pago fallido permite reintentar sin crear una nueva Order
- [ ] Verificar que /order-confirmation muestra la referencia correcta
