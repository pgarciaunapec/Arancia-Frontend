# CHECKLIST - Arancia Frontend

## Pre-flight Git
- [x] Workspace saneado antes de nuevas tareas
- [x] `dev` sincronizada
- [x] Rama por tarea creada desde `dev`
- [x] Aislamiento de cambios por tarea

## Task 1 (TanStack Form + Yup)
- [x] Dependencias instaladas (`@tanstack/react-form`, `yup`)
- [x] Esquemas Yup centralizados
- [x] Adaptador de errores Yup -> TanStack
- [x] Componentes reutilizables de input/textarea/select
- [x] Login migrado
- [x] Register migrado
- [x] Contact migrado
- [x] Reservations migrado
- [x] Profile migrado
- [x] Checkout migrado
- [x] AdminLogin migrado
- [x] Manejo de errores backend estructurados en cliente
- [x] Build exitoso
- [x] Tests exitosos

## Cierre de tarea
- [x] Commit Task 1
- [x] Merge a `dev`
- [x] Borrado de rama local/remota Task 1

## Task 2 (Tracking + About + Events)
- [x] Rediseño de seguimiento con mapa de fondo
- [x] Stepper dinámico con estados de envío reales
- [x] Alineación profesional de sección Nosotros
- [x] Contraste de botones de Eventos
- [x] Formularios de solicitud migrados a modal moderno
- [x] Build exitoso
- [x] Tests exitosos

## Cierre de tarea
- [x] Commit Task 2
- [x] Merge a `dev`
- [x] Borrado de rama local/remota Task 2

## Task 3 (Prellenado de contacto)
- [x] Nombre prellenado desde estado global autenticado
- [x] Email prellenado desde estado global autenticado
- [x] Teléfono prellenado desde estado global autenticado
- [x] Campos permanecen editables por consulta
- [x] Build exitoso
- [x] Tests exitosos

## Cierre de tarea
- [x] Commit Task 3
- [x] Merge a `dev`
- [x] Borrado de rama local/remota Task 3

## Ciclo 2026-04-10 - Backlog de Ejecucion

### Task 1 (Checkout desbloqueado)
- [x] Inputs de direccion y tarjeta operativos
- [x] Validacion por metodo de pago
- [x] Boton Pagar ejecuta flujo completo a backend
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 2 (Menu Amazon + filtros)
- [x] Sidebar izquierda implementada
- [x] Filtros por categoria/precio/ingredientes/populares funcionales
- [x] Resultados reactivos en tiempo real
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 3 (Cards y flujo producto UI)
- [x] Controles de cantidad `+/-` en cards
- [x] Panel expandible con detalle e ingredientes
- [x] Tipos/mappers/cart ajustados para metadata extendida
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 4 (Eventos UI)
- [x] Contraste hover de `Contactar Ahora` corregido
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 5 (Telefonos RD)
- [x] Mascara `+1 (XXX) XXX-XXXX` en formularios objetivo
- [x] Saneo a digitos `1809XXXXXXX` antes de enviar al backend
- [x] Validacion Yup alineada a formato dominicano
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 6 (Modernizacion Tu Pedido)
- [x] Rediseño completo del layout del carrito
- [x] Animaciones suaves y vista interactiva
- [x] Desglose profesional de costos pre-pago
- [x] Build exitoso
- [x] Commit + merge --no-ff

## Nota operativa
- [x] Limpieza local de ramas completada por tarea
- [x] Intento de borrado remoto ejecutado (si la rama no fue publicada, Git devolvio `remote ref does not exist`)

## Ciclo 2026-04-11 - Backlog Admin

### Task 1 (Dashboard real + moneda dominicana global)
- [x] Dashboard admin conectado a metricas reales de backend
- [x] Cards con `ventasTotales`, `pedidosActivos`, `nuevosUsuarios` consumidos desde API
- [x] Formateo monetario unificado con `formatCurrencyDOP` en vistas admin/usuario
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 2 (Pedidos en tiempo real + notificaciones)
- [x] Estado `Enviado` implementado como `shipped` en frontend
- [x] Polling eficiente de ordenes en `OrdersContext`
- [x] Seguimiento de pedido (`OrderTracking`) sincronizado en tiempo real
- [x] Panel de notificaciones de pedidos en `MyOrders`
- [x] Build exitoso
- [x] Commit + merge --no-ff
