# FEAT-08 — UI de Tiempo Estimado de Delivery

**Épica:** [EPIC-03 — Sistema de Delivery](../epicas/EPIC-03_Sistema_Delivery.md)

> Esta feature implementa la experiencia visual del cliente para el seguimiento de su delivery. La UI se limita estrictamente al tiempo estimado restante y una barra de progreso. **No hay mapa, no hay GPS, no hay trayectoria en vivo.** Esa es la decisión de diseño para el MVP.

## Descripción

**Como** cliente con un pedido de delivery activo,
**quiero** ver cuánto tiempo falta para que llegue mi pedido,
**para** saber cuándo estar disponible para recibirlo.

**Prioridad:** `Must Have`

---

## Nuevas Páginas y Componentes

| Artefacto | Tipo | Propósito |
|---|---|---|
| `src/pages/OrderConfirmation.tsx` | Página | Confirmación post-pago con enlace al tracker |
| `src/pages/DeliveryTracking.tsx` | Página | Seguimiento de entrega activa (`/order-tracking/:orderId`) |
| `src/components/DeliveryTracker.tsx` | Componente | Widget de cuenta regresiva reutilizable |

---

## Diseño del Componente `<DeliveryTracker />`

```
Estado: in_transit

┌─────────────────────────────────────────────────────────┐
│  🛵  Tu pedido está en camino                           │
│                                                         │
│  ████████████████░░░░░░░░  70%                         │
│                                                         │
│  Tiempo estimado de llegada                            │
│  ⏱  ~8 minutos                                        │
│                                                         │
│  Repartidor: Carlos M.  📞 (809) 555-0123             │
│                                                         │
│  [ Ver mis pedidos ]                                   │
└─────────────────────────────────────────────────────────┘

Estado: pending/assigned

┌─────────────────────────────────────────────────────────┐
│  🍳  Tu pedido está siendo preparado                    │
│                                                         │
│  El repartidor saldrá en breve...                       │
│  [spinner animado]                                      │
│                                                         │
│  [ Ver mis pedidos ]                                   │
└─────────────────────────────────────────────────────────┘

Estado: delivered

┌─────────────────────────────────────────────────────────┐
│  ✅  ¡Tu pedido fue entregado!                          │
│                                                         │
│  Esperamos que lo disfrutes. ¡Buen provecho!            │
│                                                         │
│  [ Calificar pedido ]  [ Ver mis pedidos ]             │
└─────────────────────────────────────────────────────────┘
```

---

## Lógica de la Cuenta Regresiva

```typescript
// En DeliveryTracker.tsx
const [timeLeft, setTimeLeft] = useState<number>(0); // segundos restantes
const [progress, setProgress] = useState<number>(0); // porcentaje 0-100

useEffect(() => {
  if (!delivery || delivery.status !== 'in_transit') return;

  const updateTimer = () => {
    const now = Date.now();
    const arrival = new Date(delivery.estimatedArrival).getTime();
    const total = delivery.estimatedMinutes * 60 * 1000;
    const elapsed = now - new Date(delivery.startedAt).getTime();

    const remaining = Math.max(0, arrival - now);
    const prog = Math.min(100, (elapsed / total) * 100);

    setTimeLeft(Math.ceil(remaining / 1000));
    setProgress(prog);
  };

  updateTimer();
  const timer = setInterval(updateTimer, 1000); // actualiza cada segundo

  return () => clearInterval(timer);
}, [delivery]);
```

---

## Polling al Backend

El componente hace polling al backend para actualizar el estado del delivery:

```typescript
// Polling cada 30 segundos para verificar cambios de estado
useEffect(() => {
  const poll = async () => {
    const data = await deliveryApi.getMyActive();
    if (data) setDelivery(data);
  };

  const interval = setInterval(poll, 30 * 1000);
  return () => clearInterval(interval);
}, []);
```

**¿Por qué 30 segundos?** El estado solo cambia cuando un humano (el staff) hace una acción manual, o el job de auto-complete se ejecuta. No necesitamos actualizar más frecuente que eso.

---

## Nuevo Servicio en `api.ts`

```typescript
// src/services/api.ts — agregar:
export const deliveryApi = {
  getMyActive: () => api.get('/delivery/my-active').then(r => r.data.data),
  getById: (id: string) => api.get(`/delivery/${id}`).then(r => r.data.data),
};
```

---

## Criterios de Aceptación

```
SCENARIO: Cliente con delivery en tránsito ve el tracker
  Given hay un DeliveryOrder activo en status='in_transit'
  When el cliente navega a /order-tracking/:orderId
  Then ve el mensaje "Tu pedido está en camino"
  And ve el nombre del repartidor y su teléfono
  And ve la cuenta regresiva en formato "~X minutos"
  And ve una barra de progreso
  And NO ve ningún mapa ni trayectoria GPS

SCENARIO: Cuenta regresiva se actualiza en tiempo real
  Given la UI está mostrando "~12 minutos"
  When pasan 60 segundos sin recargar la página
  Then la cuenta regresiva muestra "~11 minutos"
  (la actualización es local con setInterval, sin llamada a la API)

SCENARIO: Polling detecta cambio de estado
  Given el reparto fue marcado como entregado por el staff
  When el polling de 30s se ejecuta en el cliente
  Then GET /api/delivery/my-active retorna status='delivered'
  And la UI cambia al estado "¡Tu pedido fue entregado!"

SCENARIO: Delivery en estado pending o assigned
  Given el DeliveryOrder está en status='pending' o 'assigned'
  When el cliente ve el tracker
  Then ve el mensaje "Tu pedido está siendo preparado"
  And ve un spinner de espera
  And NO ve cuenta regresiva (aún no se sabe el tiempo)

SCENARIO: No hay delivery activo
  Given el cliente navega a /order-tracking pero no tiene delivery activo
  Then ve un mensaje "No hay entregas activas en este momento"
  And hay un botón "Ver mis pedidos"
```

---

## Task Breakdown

### Backend
- [ ] Verificar que `GET /api/delivery/my-active` retorna correctamente `null` si no hay delivery activo
- [ ] Verificar que la respuesta incluye: `status`, `estimatedMinutes`, `startedAt`, `estimatedArrival`, `deliveryAgent`

### Frontend
- [ ] Agregar `deliveryApi` a `src/services/api.ts`
- [ ] Crear `src/pages/OrderConfirmation.tsx`:
  - Leer `location.state.payment` y `location.state.order`
  - Mostrar: referencia, total, método, y si es delivery → enlace "Rastrear mi pedido"
  - Reemplazar la actual `BookingConfirmation.tsx` como destino post-pago
- [ ] Crear `src/components/DeliveryTracker.tsx` con la lógica de cuenta regresiva
- [ ] Crear `src/pages/DeliveryTracking.tsx` que usa `<DeliveryTracker />` y maneja el polling
- [ ] Agregar la ruta `/order-tracking/:orderId` a `App.tsx` envuelta en `PrivateRoute`
- [ ] Agregar enlace "Rastrear pedido" en la página `/my-orders` para órdenes con delivery activo
- [ ] La barra de progreso usa `Progress` de shadcn/ui (ya instalado)

### Pruebas
- [ ] Verificar que la cuenta regresiva baja correctamente cada segundo
- [ ] Verificar que el polling detecta el cambio a 'delivered' y actualiza la UI
- [ ] Verificar que en estado 'pending' no se muestra cuenta regresiva
- [ ] Verificar que no hay ningún elemento de mapa en el DOM
