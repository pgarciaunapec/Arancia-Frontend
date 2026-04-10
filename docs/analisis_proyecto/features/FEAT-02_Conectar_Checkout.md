# FEAT-02 — Conectar Checkout al API Real

**Épica:** [EPIC-01 — Completar MVP Core](../epicas/EPIC-01_Completar_MVP_Core.md)

> `Checkout.tsx` es la página más críticamente desconectada del sistema. Actualmente: (1) muestra datos del cliente hardcodeados ("Juan Pérez", "juan@demo.com"), (2) no lee los ítems reales del `CartContext`, (3) el pago es un `setTimeout` que navega directamente. Esta feature conecta el checkout real con el `CartContext` y el `orderApi`, preparando el terreno para EPIC-02 (pago real).

## Descripción

**Como** cliente con ítems en el carrito,
**quiero** que el checkout use mis datos reales y cree un pedido real en el sistema,
**para** que el restaurante reciba mi orden y pueda prepararla.

**Prioridad:** `Must Have`

---

## Archivos Afectados

| Archivo | Cambio |
|---|---|
| `src/pages/Checkout.tsx` | Refactor completo: leer CartContext + AuthContext + llamar orderApi |
| `src/pages/BookingConfirmation.tsx` | Recibir y mostrar datos reales del pedido creado |
| `src/contexts/CartContext.tsx` | Llamar `clearCart()` post-creación de orden exitosa |
| `src/services/api.ts` | Ya existe `orderApi.create()` — verificar tipos TypeScript |

---

## Datos que el Checkout debe recopilar

| Campo | Fuente | Tipo |
|---|---|---|
| Nombre del cliente | `AuthContext.user.name` (pre-llenado, editable) | String |
| Email | `AuthContext.user.email` (pre-llenado, no editable) | String |
| Teléfono | `AuthContext.user.phone` (pre-llenado, editable) | String |
| Tipo de entrega | Radio: "Recoger en restaurante" / "Delivery a domicilio" | Boolean `isDelivery` |
| Dirección de entrega | Solo si `isDelivery = true`; no requerida para pickup | Object |
| Ítems del pedido | `CartContext.items` — solo lectura, no editable en checkout | Array |
| Total | `CartContext.total` — solo lectura | Number |
| Instrucciones especiales | Campo de texto libre opcional | String |

---

## Estructura del Request al Backend

```typescript
// POST /api/orders
{
  isDelivery: boolean,
  shippingAddress?: {
    name: string,
    address: string,
    city: string,
    zip?: string,
    reference?: string
  },
  notes?: string
  // Los items y el total se calculan desde el carrito del usuario en el servidor,
  // nunca se envían desde el cliente (seguridad)
}
```

---

## Criterios de Aceptación

```
SCENARIO: Checkout con pickup (recogida en restaurante)
  Given el usuario está autenticado con ítems en el carrito
  And está en /checkout
  When selecciona "Recoger en restaurante"
  And hace click en "Confirmar Pedido"
  Then se llama POST /api/orders con { isDelivery: false, notes? }
  And el carrito se limpia automáticamente
  And el usuario es redirigido a /booking-confirmation con los datos del pedido

SCENARIO: Checkout con delivery a domicilio
  Given el usuario selecciona "Delivery"
  And completa el formulario de dirección de entrega
  When hace click en "Confirmar Pedido"
  Then se llama POST /api/orders con { isDelivery: true, shippingAddress: {...} }
  And la Order se crea en el backend con status = 'pending'
  And el carrito se limpia
  And el usuario ve la confirmación con su dirección y el total

SCENARIO: Carrito vacío — no puede llegar a /checkout
  Given el usuario está autenticado
  And su carrito está vacío
  When navega directamente a /checkout
  Then es redirigido automáticamente a /menu con un toast informativo

SCENARIO: Error del servidor al crear pedido
  Given el usuario completa el checkout
  When POST /api/orders retorna error 500
  Then se muestra toast de error específico
  And el carrito NO se limpia (el pedido no fue creado)
  And el botón de confirmar vuelve a estar activo para reintentar

SCENARIO: Formulario de checkout pre-llena datos del AuthContext
  Given el usuario está autenticado como "María García"
  When abre /checkout
  Then el campo "Nombre" muestra "María García" pre-llenado
  And el campo "Email" muestra el email del usuario autenticado
```

---

## Task Breakdown

### Backend
- [ ] Verificar que `POST /api/orders` usa los items del carrito del servidor (no del request)
- [ ] Verificar que el total en la Order se calcula en el backend, no se acepta del request
- [ ] Verificar que `POST /api/orders` retorna la Order completa incluyendo `_id`, `total`, `items`
- [ ] Verificar que el carrito (Order con status='cart') se marca como inactivo o se elimina al crear la nueva Order

### Frontend
- [ ] Leer `user` de `AuthContext` para pre-llenar nombre, email, teléfono
- [ ] Leer `items`, `subtotal`, `tax`, `total` de `CartContext` para mostrar resumen
- [ ] Si `CartContext.items.length === 0`, redirigir a `/menu`
- [ ] Agregar toggle UI: "Recoger en restaurante" vs "Delivery a domicilio"
- [ ] Mostrar formulario de dirección condicionalmente si `isDelivery === true`
- [ ] Validación client-side con `react-hook-form`: dirección requerida si `isDelivery === true`
- [ ] En `handleSubmit`: llamar `orderApi.create({ isDelivery, shippingAddress?, notes? })`
- [ ] En éxito: llamar `CartContext.clearCart()` luego `navigate('/booking-confirmation', { state: { order } })`
- [ ] Agregar estado `isSubmitting` para deshabilitar el botón durante la llamada
- [ ] Wrapper del botón con spinner mientras `isSubmitting === true`

### Pruebas
- [ ] Flujo completo pickup: menú → carrito → checkout → confirmación
- [ ] Flujo completo delivery: menú → carrito → checkout → confirmación con dirección
- [ ] Verificar que el carrito queda vacío posterior al pedido exitoso
- [ ] Verificar redirección a `/menu` si carrito vacío
- [ ] Verificar manejo de error de red (API sin respuesta)
