# AUDIT - Arancia Frontend

## Protocolo de Git aplicado
- Rama base verificada: `dev`
- Rama de trabajo Task 1: `task/1/forms-tanstack-yup`
- Saneamiento previo completado en rama temporal: `cleanup/dev-20260410-160054`
- Aislamiento por tarea: habilitado

## Task 1 - Estandarizacion de validacion y formularios
### Estado
- Completada y mergeada a `dev`

### Cambios clave
- Migracion de formularios a TanStack Form + Yup en:
  - `src/pages/Login.tsx`
  - `src/pages/Register.tsx`
  - `src/pages/Contact.tsx`
  - `src/pages/Reservations.tsx`
  - `src/pages/Profile.tsx`
  - `src/pages/Checkout.tsx`
  - `src/pages/admin/AdminLogin.tsx`
- Componentes reutilizables de formulario:
  - `src/components/forms/TanstackFormInput.tsx`
  - `src/components/forms/TanstackFormTextarea.tsx`
  - `src/components/forms/TanstackFormSelect.tsx`
- Adaptador de validacion Yup->TanStack:
  - `src/lib/forms/yupTanstack.ts`
- Esquemas centralizados de validacion:
  - `src/schemas/forms.schema.ts`
- Manejo de errores estructurados del backend en API client:
  - `src/lib/api.ts`

### Verificacion
- Build: OK (`pnpm run build`)
- Tests: OK (`pnpm run test`)

## Riesgos observados
- `src/main.tsx` mantiene providers duplicados en `contexts/` ademas de `App.tsx` (context). No bloquea Task 1, pero requiere normalizacion posterior.
- Flujo de checkout y reservas depende de decisiones de Task 4/5 (store global y ajustes de reserva pagada).

## Task 2 - Experiencia Amazon Style y refactor visual
### Rama de trabajo
- `task/2/amazon-ui-tracking`

### Estado
- Completada y mergeada a `dev`

### Cambios clave
- Vista de seguimiento redisenada con fondo mapa y card flotante:
  - `src/pages/OrderTracking.tsx`
- Timeline dinamica de estados: `Recibido`, `Cocina`, `Camino`, `Entregado`
- Seccion `Nosotros` alineada con layout de grilla profesional:
  - `src/pages/About.tsx`
- Contraste reforzado de botones en `Eventos`:
  - `src/pages/Events.tsx`
- Formularios de solicitud de informacion migrados a modal moderno:
  - `src/pages/Events.tsx`
  - Uso de `Dialog` + TanStack Form + Yup
- Esquema de validacion de cotizacion de eventos extendido:
  - `src/schemas/forms.schema.ts`

### Verificacion
- Build: OK (`pnpm run build`)
- Tests: OK (`pnpm run test`)

## Task 3 - Inteligencia de datos y prellenado
### Rama de trabajo
- `task/3/contact-prefill`

### Estado
- Implementacion completada en rama, con build/tests exitosos

### Cambios clave
- Prellenado editable de `Nombre`, `Email` y `Telefono` en contacto para usuario autenticado:
  - `src/pages/Contact.tsx`
- El formulario mantiene valores del perfil como default, pero el usuario puede sobrescribirlos para esa consulta.

### Verificacion
- Build: OK (`pnpm run build`)
- Tests: OK (`pnpm run test`)

## Ciclo 2026-04-10 - Backlog de Ejecucion (Protocolo Godmode)

### Task 1 - Desbloqueo y reparacion de pago
#### Rama
- `feature/task1-checkout-unblock`

#### Cambios clave
- Checkout endurecido con validacion por modo de pago/envio y normalizacion de tarjeta.
- Entradas de tarjeta (`numero`, `MM/AA`, `CVV`) con mascara y control de formato.
- Error de submit centralizado para evitar bloqueos silenciosos.
- Payload de orden/pago limpiado antes de backend.
- Ajuste de `OrdersContext` para respetar contacto capturado en checkout.

#### Archivos principales
- `src/pages/Checkout.tsx`
- `src/context/OrdersContext.tsx`
- `src/schemas/forms.schema.ts`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 5 - Gestion de empleados, asignaciones y selector de delivery
#### Rama
- `feature/task5-employee-fleet-assignment`

#### Cambios clave
- `admin/orders` ampliado con panel de asignaciones por pedido:
  - responsable (empleado)
  - mesa para flujo dine-in
  - vehiculo para delivery
  - notas de asignacion
- Selector de delivery integrado al avance de estado a `shipped` con envio de repartidor/vehiculo al backend.
- `admin/delivery` refactorizado para operar asignaciones reales y gestionar flota en la misma vista.
- CRUD de flota frontend conectado a `/api/admin/fleet`.
- `admin/table-bills` ampliado con selector de mesero al abrir cuenta y visualizacion de responsable.
- `admin/tables` actualizado para asignar empleado responsable por mesa.
- Contextos y mappers sincronizados para nuevas entidades y campos:
  - `OrdersContext` hacia endpoints admin
  - `AdminContext` con `assignedStaff` en CRUD de mesas
  - `mapBackendOrder`, `mapBackendTable`, `mapBackendVehicle`

#### Archivos principales
- `src/pages/admin/AdminOrders.tsx`
- `src/pages/admin/AdminDelivery.tsx`
- `src/pages/admin/AdminTableBills.tsx`
- `src/pages/admin/AdminTables.tsx`
- `src/context/OrdersContext.tsx`
- `src/context/AdminContext.tsx`
- `src/lib/mappers.ts`
- `src/types/index.ts`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 4 - Modulo de Mesas e Inventario CRUD con sincronizacion de reservas
#### Rama
- `feature/task4-tables-inventory-sync`

#### Cambios clave
- `admin/tables` refactorizado a CRUD completo con:
  - alta/edicion/eliminacion de mesa
  - soporte de `imagen` y `descripcion`
  - control de estado (`available`, `reserved`, `occupied`, `maintenance`)
- `AdminContext` extendido con operaciones de mesas (`createTable`, `updateTable`, `deleteTable`).
- `Reservations` conectado a disponibilidad real por comensales usando `GET /api/reservations/availability`.
- `BookingConfirmation` actualizado para mostrar numero de mesa asignada cuando aplica.
- `admin/inventory` ampliado con modal de trazabilidad por item consumiendo historial de movimientos.
- Tipos y mappers sincronizados para propagar metadata de mesa y `tableNumber` desde backend.

#### Archivos principales
- `src/pages/admin/AdminTables.tsx`
- `src/context/AdminContext.tsx`
- `src/pages/Reservations.tsx`
- `src/pages/BookingConfirmation.tsx`
- `src/pages/admin/AdminInventory.tsx`
- `src/lib/mappers.ts`
- `src/types/index.ts`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 2 - Rediseño Menu Amazon Style con filtros dinamicos
#### Rama
- `feature/task2-amazon-menu-filters`

#### Cambios clave
- Layout de menu refactorizado a sidebar izquierda + area de resultados.
- Filtros funcionales por categoria, precio, ingredientes y populares.
- Chips activos y limpieza de filtros.
- Skeleton de carga y experiencia responsive.

#### Archivos principales
- `src/pages/Menu.tsx`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 3 - Refactor cards y flujo de productos (UI)
#### Rama
- `feature/task3-product-cards-ui`

#### Cambios clave
- Cards de menu con controles inmediatos `+/-` por item.
- Estado expandible por card para descripcion e ingredientes completos.
- Badge de cantidad en pedido y mejor lectura por categoria/precio.
- Tipos/mappers/cart frontend extendidos para detalle de producto.

#### Archivos principales
- `src/pages/Menu.tsx`
- `src/types/index.ts`
- `src/lib/mappers.ts`
- `src/context/CartContext.tsx`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 4 - Correccion visual CTA Eventos
#### Rama
- `feature/task4-events-ui-contrast`

#### Cambios clave
- Correccion de contraste en hover del boton `Contactar Ahora`.

#### Archivos principales
- `src/pages/Events.tsx`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 5 - Mascara de telefono dominicano y limpieza antes de API
#### Rama
- `feature/task5-phone-mask` (reconstruida sin comandos destructivos para mantener protocolo)

#### Cambios clave
- Utilidad central de telefonia dominicana: mascara `+1 (XXX) XXX-XXXX` y normalizacion a `1809XXXXXXX`.
- Aplicada en formularios de registro, contacto, eventos, reservas y perfil.
- Payloads saneados antes de backend en `AuthContext` y `ReservationsContext`.
- Validacion Yup alineada a telefono dominicano.

#### Archivos principales
- `src/lib/phone.ts`
- `src/components/forms/TanstackFormInput.tsx`
- `src/schemas/forms.schema.ts`
- `src/pages/Register.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Events.tsx`
- `src/pages/Reservations.tsx`
- `src/pages/Profile.tsx`
- `src/context/AuthContext.tsx`
- `src/context/ReservationsContext.tsx`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 6 - Modernizacion vista Tu Pedido
#### Rama
- `feature/task6-modern-cart-view`

#### Cambios clave
- Rediseño completo de `Cart` con jerarquia visual profesional.
- Animaciones suaves de entrada/salida y layout interactivo.
- Desglose de costos ampliado (subtotal, ITBIS, servicio, ETA).
- Indicadores de confianza previos al pago y barra de progreso para envio gratis.

#### Archivos principales
- `src/pages/Cart.tsx`

#### Verificacion
- Build: OK (`pnpm run build`)

## Observaciones de cierre Git
- Todas las tareas cerradas con merge `--no-ff` a `dev`.
- La eliminacion remota de ramas reporto `remote ref does not exist` cuando la rama no habia sido publicada previamente; limpieza local completada en todos los casos.

## Ciclo 2026-04-11 - Backlog Admin de Ejecucion

### Task 1 - Dashboard real y formateo financiero global
#### Rama
- `feature/task1-dashboard-currency`

#### Cambios clave
- Dashboard admin conectado a metricas reales ampliadas desde backend:
  - `newUsersToday`
  - `activeOrders`
  - `totalRevenue`
- Formateo monetario unificado con utilidad global `formatCurrencyDOP` en vistas Admin y Usuario.
- Sustitucion de concatenaciones `RD$` manuales por formateo consistente para evitar divergencias visuales y de separadores.

#### Archivos principales
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/AdminCashRegister.tsx`
- `src/pages/admin/AdminOrders.tsx`
- `src/pages/admin/AdminClients.tsx`
- `src/pages/admin/AdminInventory.tsx`
- `src/pages/admin/AdminTableBills.tsx`
- `src/pages/MyOrders.tsx`
- `src/pages/MyReservations.tsx`
- `src/pages/BookingConfirmation.tsx`
- `src/pages/Menu.tsx`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 2 - Sincronizacion de pedidos y notificaciones en tiempo real
#### Rama
- `feature/task2-orders-realtime-notifications`

#### Cambios clave
- Estado de orden migrado a `shipped` (visible como `Enviado`) en todo el frontend.
- Polling eficiente de ordenes cada 8 segundos para sincronizacion admin/usuario sin refresco manual.
- Vista `MyOrders` conectada a notificaciones persistidas del backend con marcado de leidas.
- Seguimiento `OrderTracking` convertido a polling continuo para reflejo inmediato de cambios de estado.

#### Archivos principales
- `src/types/index.ts`
- `src/lib/mappers.ts`
- `src/context/OrdersContext.tsx`
- `src/pages/admin/AdminOrders.tsx`
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/MyOrders.tsx`
- `src/pages/OrderTracking.tsx`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 3 - Modernizacion de filtros y UI de usuarios
#### Rama
- `feature/task3-admin-filters-toolbar`

#### Cambios clave
- `admin/users` redisenado con toolbar horizontal moderna y filtros avanzados:
  - busqueda por texto
  - filtro por rol
  - filtro por estado (VIP/Regular)
  - filtro por fecha de alta (7/30/90 dias)
- `admin/orders` alineado al mismo patron de toolbar horizontal con filtros por estado, fecha y tipo de entrega.
- Boton `Nuevo Usuario` reforzado con contraste accesible y `aria-label`.

#### Archivos principales
- `src/pages/admin/AdminUsers.tsx`
- `src/pages/admin/AdminOrders.tsx`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 6 - Comprobantes con QR y mejoras en colecciones
#### Rama
- `feature/task6-invoices-qr-collections`

#### Cambios clave
- `MyOrders` ampliado para consultar comprobante por orden y mostrar modal con QR descargable.
- `admin/table-bills` integrado con respuesta de cierre que incluye comprobante e interfaz POS para visualizar QR emitido.
- `admin/collections` mejorado con:
  - filtro por nombre en cliente
  - ordenamiento estable alfabetico
  - estado vacio cuando no hay coincidencias
- `admin/collections/:collection` robustecido con:
  - serializacion segura/truncada de celdas complejas
  - claves de fila estables
  - limpieza de seleccion al refrescar registros
- Mappers y tipos sincronizados para nueva entidad `Invoice`.

#### Archivos principales
- `src/pages/MyOrders.tsx`
- `src/pages/admin/AdminTableBills.tsx`
- `src/pages/admin/AdminCollections.tsx`
- `src/pages/admin/AdminCollectionView.tsx`
- `src/lib/mappers.ts`
- `src/types/index.ts`

#### Verificacion
- Build: OK (`pnpm run build`)
