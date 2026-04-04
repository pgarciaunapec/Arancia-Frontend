# US-10 — UI de Tiempo Estimado de Delivery (DeliveryTracker)

**Feature:** [FEAT-08 — UI de Seguimiento de Delivery](../features/FEAT-08_Delivery_UI_Seguimiento.md)
**Épica:** EPIC-03 — Sistema de Delivery

---

## Definición

**Como** cliente con un pedido de delivery activo,
**quiero** ver una pantalla que me muestre cuánto tiempo falta para que llegue mi pedido,
**para** saber cuándo estar disponible sin necesidad de llamar al restaurante.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: UI de Tiempo Estimado de Delivery

  Scenario: Cliente llega a la página de tracking post-pago
    Given completé un pago de pedido con delivery exitosamente
    When soy redirigido a /order-confirmation
    Then veo un botón "Rastrear mi pedido"
    And al hacerlo voy a /order-tracking

  Scenario: Página de tracking muestra el tiempo restante correctamente
    Given tengo un delivery activo con estimatedArrival en 23 minutos
    When navego a /order-tracking
    Then veo:
      - Número de pedido o referencia
      - Estado visual del pedido: "En camino 🛵"
      - Tiempo restante calculado: "23 min restantes"
      - Nombre del repartidor (si está asignado)
      - Dirección de entrega confirmada
    And la pantalla NO muestra ningún mapa

  Scenario: Cuenta regresiva se actualiza en tiempo real
    Given estoy en /order-tracking con 23 min restantes
    When pasan 30 segundos
    Then el tiempo mostrado se actualiza automáticamente (sin recargar la página)
    And si el backend responde con estimatedArrival actualizado, se usa ese valor

  Scenario: Polling sigue el estado del backend
    Given estoy en /order-tracking
    Then el frontend consulta GET /api/delivery/my-active cada 30 segundos
    And si el estado cambia a 'delivered', la pantalla actualiza autoáticamente

  Scenario: Pedido entregado — pantalla de confirmación
    Given el delivery pasó a status='delivered' (automático o manual)
    When el polling detecta status='delivered'
    Then la pantalla cambia a:
      - "¡Tu pedido ha llegado! 🎉"
      - Mensaje de agradecimiento
      - Botón "Calificar pedido" (Could Have — por ahora, solo "Ver mis pedidos")
    And el polling se detiene

  Scenario: Delivery pendiente — repartidor no asignado aún
    Given el delivery está en status='pending'
    When navego a /order-tracking
    Then veo:
      - "Tu pedido está siendo preparado"
      - Sin tiempo estimado aún (spinner o mensaje explicativo)
      - "El restaurante asignará un repartidor pronto"
    And el polling sigue activo para detectar el cambio a 'in_transit'

  Scenario: No hay delivery activo para el cliente
    Given no tengo ningún delivery activo
    When navego a /order-tracking
    Then veo: "No tienes entregas activas en este momento."
    And un botón "Ver mis pedidos" lleva a /my-orders

  Scenario: Usuario no autenticado no puede ver /order-tracking
    Given NO estoy autenticado
    When intento acceder a /order-tracking
    Then soy redirigido a /login con state.from = '/order-tracking'
```

---

## Especificación de la UI

### Pantalla: `/order-tracking` — Estados visuales

| Estado del Delivery | Ícono | Mensaje principal | Timer |
|---|---|---|---|
| `pending` | 🍳 | "Tu pedido está siendo preparado" | Sin timer, spinner |
| `assigned` | 🛵 | "Repartidor asignado, saliendo pronto..." | Sin timer aún |
| `in_transit` | 🚀 | "En camino a tu dirección" | Cuenta regresiva activa |
| `delivered` | ✅ | "¡Tu pedido ha llegado!" | "Entregado" |
| `failed` | ⚠️ | "Hubo un problema con tu entrega" | "Contáctanos" |

### Componente `<DeliveryTracker />`
- Props: `deliveryOrder: DeliveryOrder | null`, `isLoading: boolean`
- Estado interno: `timeLeft: number` (segundos restantes)
- Deriva `timeLeft` de: `Math.max(0, estimatedArrival.getTime() - Date.now()) / 1000`
- Actualiza cada segundo con `setInterval` local (solo afecta la visualización, no hace fetch)
- Fetch real a API: cada 30 segundos (polling externo al componente, en el padre)
- Al `timeLeft === 0`: cambiar mensaje a "Verificando entrega..." hasta que polling confirme `delivered`
- Formateo del timer: si < 60s → "Menos de 1 minuto", else → "X min restantes"

---

## Desglose de Tareas

### Frontend — Página `DeliveryTracking.tsx`
- [ ] Crear `src/pages/DeliveryTracking.tsx` (ruta: `/order-tracking`)
- [ ] En `useEffect`: llamar `deliveryApi.getMyActive()` al montar
- [ ] Configurar polling: `setInterval(fetchActiveDelivery, 30000)` — limpiar en unmount
- [ ] Manejar estados: `isLoading`, `deliveryOrder | null`, `error`
- [ ] Pasar `deliveryOrder` como prop a `<DeliveryTracker />`
- [ ] Cuando `deliveryOrder.status === 'delivered'`: detener polling con `clearInterval`

### Frontend — Componente `<DeliveryTracker />`
- [ ] Crear `src/components/DeliveryTracker.tsx`
- [ ] Props: `deliveryOrder: IDeliveryOrder | null`, `isLoading: boolean`
- [ ] Estado local: `timeLeft: number` (en segundos)
- [ ] `useEffect` con `estimatedArrival`: inicializar `timeLeft`, luego decrementar con `setInterval(1000)`
- [ ] Renderización condicional por status (tabla de estados arriba)
- [ ] Visualización del timer:
  - Mostrar en formato legible: `Math.ceil(timeLeft / 60)` min restantes
  - Si `timeLeft <= 0` y status sigue 'in_transit': mostrar "Verificando entrega..."
- [ ] **NO** incluir ningún componente de mapa (`<Map>`, Leaflet, Google Maps, etc.)
- [ ] Badge de estado coloreado: `pending` → gray, `in_transit` → amber, `delivered` → green, `failed` → red

### Frontend — API y Tipos
- [ ] En `src/services/api.ts`: agregar `deliveryApi.getMyActive(): Promise<DeliveryOrder | null>`
- [ ] En `src/types/index.ts`: definir interfaz `IDeliveryOrder` con todos los campos del modelo

### Frontend — Routing
- [ ] Agregar ruta `/order-tracking` en `App.tsx`
- [ ] Proteger con `<PrivateRoute>` (de US-05)
- [ ] Desde `OrderConfirmation.tsx`: si pedido tiene isDelivery → mostrar link "Rastrear mi pedido"

### Pruebas
- [ ] Test: `DeliveryTracker` con `status='in_transit'` muestra cuenta regresiva
- [ ] Test: `DeliveryTracker` con `status='pending'` no muestra timer
- [ ] Test: `DeliveryTracker` con `status='delivered'` muestra mensaje de confirmación y no reanuda timer
- [ ] Test: sin delivery activo (null) muestra estado vacío
- [ ] Test: comprobar que ningún elemento de mapa/Leaflet/geo está en el DOM
- [ ] Test: polling se detiene (clearInterval) cuando status === 'delivered'
