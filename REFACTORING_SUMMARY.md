# Refactorización de Arquitectura - Arancia Restaurant

## Resumen de Cambios

Esta refactorización completa de arquitectura ha reorganizado tanto el backend como el frontend para seguir patrones profesionales de desarrollo y mejorar la mantenibilidad del código.

---

## Backend - Node.js / Express / MongoDB

### Nuevas Estructuras Creadas

1. **DTOs (Data Transfer Objects)** - `/backend/src/dtos/`
   - `auth.dto.ts` - Interfaces para autenticación
   - `menuItem.dto.ts` - Interfaces para menú
   - `order.dto.ts` - Interfaces para órdenes
   - `reservation.dto.ts` - Interfaces para reservaciones
   - `common.dto.ts` - Interfaces compartidas
   - Proporciona tipado fuerte entre capas

2. **Servicios Refactorizados** - `/backend/src/services/`
   - `auth.service.ts` - Lógica de autenticación centralizada
   - `menu.service.ts` - Operaciones CRUD de menú
   - `order.service.ts` - Gestión de órdenes
   - `reservation.service.ts` - Gestión de reservaciones
   - `user.service.ts` - Operaciones de usuario
   - `contact.service.ts` - Gestión de contactos
   - Separa la lógica de negocio de las rutas

3. **Controladores Completos** - `/backend/src/controllers/`
   - `auth.controller.ts` - Endpoints de autenticación
   - `menu.controller.ts` - Endpoints de menú
   - `order.controller.ts` - Endpoints de órdenes
   - `reservation.controller.ts` - Endpoints de reservaciones
   - `user.controller.ts` - Endpoints de usuarios
   - `contact.controller.ts` - Endpoints de contacto
   - Maneja validación y transformación de datos

4. **Utilidades** - `/backend/src/utils/`
   - `response.util.ts` - Respuestas HTTP standardizadas
   - `validation.util.ts` - Reglas de validación centralizadas
   - `validation.middleware.ts` - Middleware de validación
   - Proporciona funciones reutilizables

5. **Middleware Adicional** - `/backend/src/middleware/`
   - `admin.middleware.ts` - Verificación de rol administrador
   - Complementa middleware existente

### Rutas Refactorizadas

- `auth.routes.ts` - Ahora usa AuthController
- `menu.routes.ts` - Ahora usa MenuItemController
- `order.routes.ts` - Ahora usa OrderController
- `reservation.routes.ts` - Ahora usa ReservationController
- `user.routes.ts` - Ahora usa UserController
- `contact.routes.ts` - Ahora usa ContactController

**Beneficios:**
- Lógica separada por responsabilidad
- Validación centralizada y consistente
- Manejo de errores unificado
- Rutas más limpias y legibles

---

## Frontend - React / TypeScript

### Nuevos Servicios por Dominio - `/src/services/`

1. **AuthService** - Autenticación y gestión de usuario
   - `register()`, `login()`, `logout()`
   - `getCurrentUser()`, `updateProfile()`, `changePassword()`
   - Gestión de tokens en localStorage

2. **MenuService** - Operaciones de menú
   - `getAll()`, `getById()`, `search()`
   - `getCategories()`
   - CRUD completo (admin)

3. **OrderService** - Gestión de órdenes
   - `create()`, `getUserOrders()`, `getById()`
   - `updateStatus()`, `cancel()`
   - Acceso admin a todas las órdenes

4. **ReservationService** - Gestión de reservaciones
   - `create()`, `getUserReservations()`, `update()`, `cancel()`
   - Operaciones admin: `getAll()`, `confirm()`
   - Filtrado por fecha

5. **ContactService** - Gestión de contactos
   - `send()` - Enviar mensaje
   - Admin: `getAll()`, `updateStatus()`, `delete()`

**Beneficio:** Separación clara por dominio, fácil de mantener y testear.

### Custom Hooks - `/src/hooks/`

1. **useAuth** - Hook de autenticación
   - Manejo de login, registro, logout
   - Actualización de perfil, cambio de contraseña
   - Integración con AuthContext

2. **useMenu** - Hook de menú
   - Carga de ítems con filtrado
   - Gestión de categorías
   - Búsqueda en tiempo real

3. **useOrders** - Hook de órdenes
   - Creación de órdenes
   - Historial de órdenes
   - Cancelación de órdenes

4. **useReservations** - Hook de reservaciones
   - Creación de reservaciones
   - Historial de reservaciones
   - Cancelación de reservaciones

**Beneficio:** Lógica reutilizable, reduce código duplicado en componentes.

### Estructura Mejorada

```
src/
├── services/          ← Servicios por dominio
│   ├── auth.service.ts
│   ├── menu.service.ts
│   ├── order.service.ts
│   ├── reservation.service.ts
│   ├── contact.service.ts
│   └── index.ts
├── hooks/            ← Custom hooks reutilizables
│   ├── use Auth.ts
│   ├── useMenu.ts
│   ├── useOrders.ts
│   ├── useReservations.ts
│   └── index.ts
├── contexts/         ← Contextos globales
├── components/       ← Componentes UI
├── pages/            ← Páginas
└── ...
```

---

## Patrones Implementados

### Backend

1. **Layers Architecture**
   - DTOs → Controllers → Services → Models → Database
   - Separación clara de responsabilidades

2. **Service Layer Pattern**
   - Lógica de negocio en servicios
   - Controllers delegam a servicios

3. **Validation Layer**
   - express-validator centralizado
   - Middleware de validación consistente

4. **Error Handling**
   - Respuestas standardizadas
   - Mensajes claros en español

### Frontend

1. **Custom Hooks Pattern**
   - Lógica reutilizable en hooks
   - Evita duplicación de código

2. **Service Layer**
   - Servicios separados por dominio
   - Cada servicio maneja su endpoint

3. **Type Safety**
   - Interfaces TypeScript para cada servicio
   - DTOs del backend reflejados en frontend

---

## Cómo Usar

### Backend - Agregar un Nuevo Endpoint

1. Crear DTO en `/dtos/`
2. Crear método en `/services/`
3. Crear método en `/controllers/`
4. Agregar ruta en `/routes/`
5. Agregar validación en `/utils/validation.util.ts`

### Frontend - Usar un Servicio

```typescript
import { MenuService } from '@/services';

const items = await MenuService.getAll({ category: 'Main Courses' });
```

### Frontend - Usar un Hook (Recomendado)

```typescript
import { useMenu } from '@/hooks';

function MyComponent() {
  const { items, isLoading, error } = useMenu();
  return <>{/* render items */}</>;
}
```

---

## Testing

Ambas capas están organizadas para:
- Tests unitarios de servicios
- Tests de integración de rutas
- Tests de componentes con hooks
- Mock de servicios en tests

---

## Conclusión

Esta refactorización proporciona:
✅ Código más mantenible y escalable
✅ Mejor separación de responsabilidades
✅ Reutilización de lógica
✅ Tipado TypeScript robusto
✅ Validación centralizada
✅ Responses HTTP consistentes
✅ Fácil de agregar nuevas features

El sistema está listo para crecer y evolucionar manteniendo calidad y consistencia.
