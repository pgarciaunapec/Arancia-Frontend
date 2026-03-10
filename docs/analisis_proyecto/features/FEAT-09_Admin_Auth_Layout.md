# FEAT-09 — Panel Admin: Autenticación, Roles y Layout Base

**Épica:** [EPIC-04 — Panel de Administración](../epicas/EPIC-04_Panel_Administracion.md)

> Esta feature es la fundación del panel admin. Establece el sistema de roles en el backend, el layout base del panel, la protección de rutas, y el dashboard principal. Es el prerequisito de todas las demás features de admin (FEAT-10 a FEAT-13).

## Descripción

**Como** administrador del restaurante,
**quiero** un panel de control interno accesible desde `/admin`,
**para** gestionar todas las operaciones del restaurante desde una sola interfaz.

**Prioridad:** `Must Have`

---

## Cambios al Backend

### Modelo `User`: Agregar Roles y VIP

```typescript
// Nuevos campos en backend/src/models/User.ts
role: {
  type: String,
  enum: ['customer', 'staff', 'admin'],
  default: 'customer',
  index: true,
},
isVip: { type: Boolean, default: false },
vipDiscount: { type: Number, default: 0, min: 0, max: 100 },
vipSince: { type: Date },
```

### Nuevo Middleware: `role.middleware.ts`

```typescript
// backend/src/middleware/role.middleware.ts
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }
    if (!roles.includes((req.user as any).role)) {
      return res.status(403).json({ success: false, message: 'Acceso no autorizado para este rol' });
    }
    next();
  };
};
```

### Actualizar `auth.middleware.ts`

El middleware existente debe poblar `req.user` con el campo `role` al verificar el JWT. Verificar que `User.findById(decoded.id).select('+role')` retorna el role.

### Dashboard Endpoint

| Método | Ruta | Datos retornados |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Ventas del día, mesas ocupadas, pedidos pendientes, deliveries activos, alertas de inventario |

---

## Estructura de Rutas del Panel Admin (React Router)

```
/admin                     → AdminLayout (+AdminRoute guard)
├── /admin                 → Dashboard (index)
├── /admin/customers       → Lista de clientes
├── /admin/customers/:id   → Perfil de cliente
├── /admin/tables          → Gestión de mesas
├── /admin/tables/:id/bill → Cuenta activa de mesa
├── /admin/cash-register   → Caja del día
├── /admin/inventory       → Inventario
├── /admin/inventory/alerts→ Alertas de stock bajo
├── /admin/orders          → Pedidos online
├── /admin/reservations    → Reservaciones
└── /admin/delivery        → Entregas activas
```

---

## Layout del Panel Admin

El layout usa un `Sidebar` de navegación izquierdo en desktop y un `BottomNav` en tablet, diferente al layout público del restaurante:

```
┌──────────────────────────────────────────────────────────┐
│  🍊 Arancia Admin     [Juan Admin]  [Cerrar Sesión]     │  ← Header Admin
├────────────────┬─────────────────────────────────────────┤
│                │                                         │
│ Dashboard      │   Contenido de la sección activa        │
│ Clientes       │                                         │
│ ─── VIP        │                                         │
│ Mesas          │                                         │
│ ─── Cuentas    │                                         │
│ Caja           │                                         │
│ Inventario     │                                         │
│ ─── Alertas    │                                         │
│ Pedidos Online │                                         │
│ Reservaciones  │                                         │
│ Delivery       │                                         │
│                │                                         │
└────────────────┴─────────────────────────────────────────┘
```

---

## Dashboard — Widgets

| Widget | Endpoint | Actualización |
|---|---|---|
| 💰 Ventas del día | `GET /api/admin/dashboard` | Al montar |
| 🍽️ Mesas ocupadas / total | `GET /api/admin/dashboard` | Al montar |
| 📦 Pedidos pendientes | `GET /api/admin/dashboard` | Al montar |
| 🛵 Deliveries en tránsito | `GET /api/admin/dashboard` | Al montar |
| ⚠️ Alertas de inventario | `GET /api/admin/dashboard` | Al montar |
| 📅 Reservas de hoy | `GET /api/admin/dashboard` | Al montar |

---

## Criterios de Aceptación

```
SCENARIO: Admin accede al panel
  Given el usuario tiene role='admin'
  When navega a /admin
  Then ve el dashboard con los widgets de resumen del día
  And el sidebar muestra todas las secciones disponibles

SCENARIO: Staff accede al panel
  Given el usuario tiene role='staff'
  When navega a /admin
  Then ve el dashboard
  And el sidebar NO muestra "Gestión de Clientes" (solo visible para admin)

SCENARIO: Cliente intenta acceder a /admin
  Given el usuario tiene role='customer'
  When navega a /admin
  Then es redirigido a / con un toast "No tienes acceso a esta sección"

SCENARIO: Usuario no autenticado intenta acceder a /admin
  Given el usuario no está autenticado
  When navega a /admin
  Then es redirigido a /login

SCENARIO: Dashboard muestra datos reales del día
  Given hay 3 mesas ocupadas, 2 pedidos pendientes y 1 alerta de inventario
  When admin abre /admin
  Then los widgets muestran exactamente esos valores
```

---

## Task Breakdown

### Backend
- [ ] Agregar campos `role`, `isVip`, `vipDiscount`, `vipSince` al schema `User`
- [ ] Crear o migrar usuarios existentes con `role: 'customer'` por defecto
- [ ] Crear `backend/src/middleware/role.middleware.ts` con `requireRole()`
- [ ] Actualizar `auth.middleware.ts` para incluir `role` en `req.user`
- [ ] Crear endpoint `GET /api/admin/dashboard` protegido con `requireRole(['admin', 'staff'])`
- [ ] Implementar la lógica del dashboard: agregar queries de conteo de cada widget
- [ ] Actualizar `GET /api/auth/me` para retornar el campo `role` en la respuesta

### Frontend (Layout y Routing)
- [ ] Crear `src/components/AdminLayout.tsx` con sidebar + header de admin
- [ ] Crear `src/components/AdminRoute.tsx` (con verificación de rol — ver FEAT-04)
- [ ] Agregar rutas `/admin/*` a `App.tsx` dentro de `<AdminRoute roles={['admin','staff']}>`
- [ ] Crear `src/pages/admin/Dashboard.tsx` con los 6 widgets de resumen
- [ ] Agregar `adminApi.getDashboard()` en `api.ts`
- [ ] Crear `src/pages/admin/` como directorio para todas las páginas de admin
- [ ] Asegurar que el sidebar del admin muestra/oculta secciones según role del usuario

### Pruebas
- [ ] Verificar que `/admin` con JWT de customer redirige a `/`
- [ ] Verificar que `/admin` sin JWT redirige a `/login`
- [ ] Verificar que el dashboard muestra valores reales, no ceros
- [ ] Verificar que `GET /api/admin/dashboard` retorna 403 para usuarios con role='customer'
