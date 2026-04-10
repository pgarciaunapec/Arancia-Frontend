# US-04 — Página de Historial de Pedidos

**Feature:** [FEAT-03 — Perfil y Mis Pedidos](../features/FEAT-03_Perfil_y_Mis_Pedidos.md)
**Épica:** EPIC-01 — Completar MVP Core

---

## Definición

**Como** cliente autenticado,
**quiero** ver el historial completo de mis pedidos con sus detalles y estado,
**para** hacer seguimiento de mis compras y saber si están siendo procesadas.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Historial de Pedidos del Cliente

  Scenario: Ver historial con pedidos existentes
    Given soy un usuario autenticado con 3 pedidos previos
    When navego a /my-orders
    Then se llama GET /api/orders (que excluye orders status='cart')
    And veo los 3 pedidos listados del más reciente al más antiguo
    And cada pedido muestra: fecha, número de ítems, total, badge de estado

  Scenario: Estado de pedido con color correcto
    Given tengo un pedido en 'pending' y uno en 'confirmed'
    When veo /my-orders
    Then el pedido 'pending' muestra badge amarillo "Pendiente"
    And el pedido 'confirmed' muestra badge verde "Confirmado"

  Scenario: Sin pedidos previos — estado vacío
    Given soy un usuario autenticado sin ningún pedido
    When navego a /my-orders
    Then veo el mensaje: "Aún no has realizado ningún pedido"
    And hay un botón "Explorar el Menú" que me lleva a /menu
    And NO veo una lista vacía sin mensaje

  Scenario: Carga del historial — loading state
    Given navego a /my-orders
    When la llamada al API está en proceso
    Then veo 3 tarjetas skeleton mientras carga
    And no veo ningún error ni pantalla en blanco

  Scenario: Pedido con delivery activo muestra enlace de rastreo
    Given tengo un pedido con delivery en status='in_transit'
    When veo /my-orders
    Then ese pedido tiene un botón "Rastrear pedido 🛵"
    And al hacer click me lleva a /order-tracking/:orderId

  Scenario: Pedido cancelado
    Given tengo un pedido cancelado
    When veo /my-orders
    Then el badge muestra "Cancelado" en rojo
    And no hay botón de rastreo para ese pedido
```

---

## Diseño de la Tarjeta de Pedido

```
┌──────────────────────────────────────────────────────────┐
│  Pedido #ARN-20260310-AB123              [🟡 Pendiente]  │
│                                                          │
│  10 de Marzo, 2026 — 8:45 PM                            │
│                                                          │
│  Lomo Saltado x2, Limonada x1  y 1 más...               │
│                                                          │
│  Total:  RD$ 1,425.00          [Pickup / Delivery 🛵]   │
│                                                          │
│                          [ Rastrear pedido → ]          │
└──────────────────────────────────────────────────────────┘
```

---

## Desglose de Tareas

### Backend
- [ ] Verificar que `GET /api/orders` filtra y excluye `status: 'cart'`
- [ ] Verificar que `GET /api/orders` ordena por `createdAt: -1`
- [ ] Verificar que la respuesta incluye: `_id`, `items[]`, `total`, `status`, `isDelivery`, `createdAt`
- [ ] Asegurar que `GET /api/orders` incluye correctamente la referencia del DeliveryOrder si existe

### Frontend (Nueva página: MyOrders.tsx)
- [ ] Crear `src/pages/MyOrders.tsx`
- [ ] Agregar ruta `/my-orders` en `App.tsx` dentro de `<PrivateRoute>`
- [ ] Al montar: llamar `orderApi.getAll()` con `useEffect`
- [ ] Implementar 3 estados:
  - `isLoading`: mostrar 3 `<Skeleton>` cards
  - `orders.length === 0`: pantalla vacía con mensaje + botón
  - `orders.length > 0`: lista con tarjetas
- [ ] Cada tarjeta muestra: referencia, fecha formateada, primeros 2 ítems + "y X más", total, badge de estado
- [ ] Colores de badge según status: `pending`=amarillo, `confirmed`=azul, `preparing`=naranja, `delivered`=verde, `cancelled`=rojo
- [ ] Si el pedido tiene `isDelivery === true` y delivery status es `in_transit` o `assigned`: mostrar botón "Rastrear"
- [ ] Agregar link a "Mis Pedidos" en el menú de usuario (`TopNav.tsx`) y en la página `/profile`

### Pruebas
- [ ] Test: usuario sin pedidos ve estado vacío con CTA
- [ ] Test: usuario con pedidos los ve ordenados del más reciente al primero
- [ ] Test: badge de color correcto según status
- [ ] Test: botón "Rastrear" solo aparece en pedidos con delivery activo
