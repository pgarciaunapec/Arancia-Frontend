# US-02 — Checkout Real: Crear Pedido desde el Carrito

**Feature:** [FEAT-02 — Conectar Checkout](../features/FEAT-02_Conectar_Checkout.md)
**Épica:** EPIC-01 — Completar MVP Core

---

## Definición

**Como** cliente autenticado con ítems en mi carrito,
**quiero** que el checkout use mis datos reales y cree un pedido real en el sistema,
**para** que el restaurante reciba mi orden correctamente.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Checkout Conectado al API Real

  Scenario: Checkout de pickup exitoso
    Given soy "Ana López" autenticada con 2 ítems en el carrito (total RD$ 1,180)
    And estoy en /checkout
    When veo el formulario: mi nombre "Ana López" pre-llenado, email pre-llenado
    And selecciono "Recoger en el restaurante"
    And hago click en "Continuar al Pago"
    Then se llama POST /api/orders { isDelivery: false }
    And la Order se crea en MongoDB con status='pending'
    And el carrito se marca como inactivo en el servidor
    And soy llevada al Paso 2 (pago) con el orderId guardado en estado

  Scenario: Checkout de delivery exitoso
    Given tengo ítems en el carrito
    When selecciono "Delivery a domicilio"
    And completo: calle="Av. Winston Churchill 1099", ciudad="Santo Domingo", referencia="Frente al parque"
    And hago click en "Continuar al Pago"
    Then se llama POST /api/orders { isDelivery: true, shippingAddress: {...} }
    And la Order incluye la dirección de entrega

  Scenario: Carrito vacío bloquea acceso a /checkout
    Given mi carrito está vacío
    When navego a /checkout
    Then soy redirigida a /menu
    And se muestra toast: "Tu carrito está vacío. Agrega algunos platos primero."

  Scenario: Datos del cliente pre-llenados desde AuthContext
    Given soy "Carlos Méndez" autenticado con email "carlos@email.com"
    When abro /checkout
    Then el campo "Nombre" muestra "Carlos Méndez" (editable)
    And el campo "Email" muestra "carlos@email.com" (no editable, es informativo)
    And NO veo "Juan Pérez" ni ningún dato hardcodeado

  Scenario: Dirección de delivery es obligatoria si se selecciona delivery
    Given selecciono "Delivery a domicilio"
    When dejo el campo "Calle" vacío
    And hago click en "Continuar al Pago"
    Then el botón NO hace la llamada al API
    And se muestra mensaje de validación inline: "La dirección es obligatoria para delivery"

  Scenario: Error de servidor al crear pedido
    Given el servidor retorna 500 al intentar crear la Order
    Then se muestra toast de error específico
    And el carrito NO se limpia (el pedido no fue creado)
    And el botón "Continuar" vuelve a estar activo
```

---

## Desglose de Tareas

### Backend
- [ ] Verificar que `POST /api/orders` obtiene los items del carrito del usuario desde MongoDB (no del request)
- [ ] Verificar que el `total` en la Order se calcula en el pre-save hook (no aceptado del request)
- [ ] Verificar que `POST /api/orders` retorna la Order completa: `{ _id, total, items, isDelivery, shippingAddress }`
- [ ] Verificar que posteriormente al crear la Order, el carrito (Order status='cart') se maneja correctamente (limpiado o marcado)
- [ ] Verificar que `POST /api/orders` requiere JWT (authMiddleware)

### Frontend (Checkout.tsx — refactoring)
- [ ] Al montar el componente: verificar `CartContext.items.length > 0`; si es vacío, redirigir a `/menu` con toast
- [ ] Pre-llenar campos de nombre y teléfono desde `AuthContext.user`
- [ ] El campo email es display-only (desde `AuthContext.user.email`, no editable)
- [ ] Implementar `checkoutStep: 'order' | 'payment'` con `useState`
- [ ] Agregar radio input: "Recoger en restaurante" vs "Delivery a domicilio"
- [ ] Mostrar formulario de dirección condicionalmente: `isDelivery === true`
- [ ] Validación con `react-hook-form`: dirección requerida si `isDelivery === true`
- [ ] En `handleOrderSubmit`: llamar `orderApi.create({ isDelivery, shippingAddress?, notes? })`
- [ ] En éxito: guardar `orderId` en estado local y cambiar `checkoutStep = 'payment'`
- [ ] En error: mostrar `toast.error(error.message)`, el carrito permanece intacto
- [ ] Mostrar `Spinner` en el botón mientras `isSubmitting === true`
- [ ] En el paso de pago (step 2): mostrar resumen de la Order con total y tipo de entrega
- [ ] Actualizar `api.ts`: agregar `isDelivery?: boolean` y `shippingAddress?` al tipo de request de `orderApi.create()`

### Pruebas
- [ ] Test: checkout con campo nombre vacío → botón deshabilitado
- [ ] Test: delivery con dirección vacía → error de validación inline
- [ ] Test: navegar a /checkout con carrito vacío → redirect a /menu
- [ ] Test: post-checkout exitoso, el CartContext.items.length === 0
