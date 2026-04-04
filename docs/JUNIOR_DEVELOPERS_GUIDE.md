# 🎓 Guía Completa para Junior Developers — Restaurant01 (Arancia)

**Última actualización:** 4 de Abril, 2026  
**Versión del proyecto:** 0.1.0 (MVP en desarrollo)  
**Rama de trabajo:** `copilot/complete-mvp-preparation`

---

## 📌 Tabla de Contenidos

1. [¿Qué es Restaurant01?](#qué-es-restaurant01)
2. [Stack Tecnológico Explicado](#stack-tecnológico-explicado)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Cómo Levantar el Proyecto](#cómo-levantar-el-proyecto)
6. [Autenticación y Seguridad](#autenticación-y-seguridad)
7. [Flujos Principales (Paso a Paso)](#flujos-principales-paso-a-paso)
8. [Frontend — React + TypeScript](#frontend--react--typescript)
9. [Backend — Express + MongoDB](#backend--express--mongodb)
10. [Base de Datos — MongoDB](#base-de-datos--mongodb)
11. [Cómo Hacer Cambios](#cómo-hacer-cambios)
12. [Testing y Debugging](#testing-y-debugging)
13. [Recursos y Referencias](#recursos-y-referencias)

---

## ¿Qué es Restaurant01?

**Restaurant01** es una plataforma web completa para gestión de restaurante. Permite:

### Para Clientes
- Ver menú y agregar items al carrito
- Hacer compras online (checkout)
- Hacer reservaciones de mesa
- Rastrear órdenes en tiempo real
- Ver historial de compras
- Gestionar perfil personal

### Para el Restaurante (Admin/Staff)
- Dashboard con métricas en tiempo real
- Gestionar órdenes (estado, entregas)
- Gestionar mesas y reservaciones
- Control de caja registradora
- Control de inventario
- Gestión de clientes VIP

**Objetivo principal:** Ser un sistema **100% propio** sin dependencia de terceros (sin Stripe, PayPal, etc.).

---

## Stack Tecnológico Explicado

### 🎨 Frontend — React + TypeScript + Tailwind

| Tecnología | Versión | ¿Qué es? | ¿Por qué la usamos? |
|-----------|---------|---------|------------------|
| **React** | 18.3.1 | Library de JavaScript para construir interfaces | Permite componentes reutilizables y reactividad |
| **TypeScript** | 5.5.4 | JavaScript con tipos estáticos | Detecta errores antes de ejecutar; mejor autocompletado |
| **Vite** | (latest) | Bundler y dev server | Compilación rápida, HMR (hot reload) |
| **Tailwind CSS** | (latest) | Framework de estilos utility-first | Estilos rápidos sin CSS manual |
| **React Router** | (latest) | Enrutamiento (navegación entre páginas) | Control de URLs `/menu`, `/checkout`, etc |
| **Radix UI** | v1.x (multiple) | Componentes accesibles pre-hechos | Botones, modales, inputs, etc. sin construir from scratch |
| **React Hook Form** | 7.55.0 | Gestión de formularios | Validación, estado de inputs, submit |
| **Recharts** | 2.15.2 | Gráficos y charts | Mostrar datos en gráficos (ventas, métricas admin) |
| **Sonner** | 2.0.3 | Toast notifications | Mensajes "Orden creada!", "Error al login" |
| **Context API** | (built-in) | State management sin librerías externas | Compartir datos entre componentes (usuario, carrito, órdenes) |

#### ¿Cómo funciona en el navegador?

```
1. Usuario entra a http://localhost:3000
2. Vite carga main.tsx
3. React renderiza <App />
4. Context Providers envuelven todo (Auth, Cart, Orders, etc)
5. Router detecta URL actual
6. Componentes se renderizando basados en la ruta
7. Al hacer clic, Context actualiza estado o se llama a API
8. React re-renderiza componentes que usan ese estado
```

### 🔧 Backend — Express + TypeScript + Mongoose

| Tecnología | Versión | ¿Qué es? | ¿Por qué la usamos? |
|-----------|---------|---------|------------------|
| **Node.js** | 16+ | Runtime de JavaScript en servidor | Permite ejecutar JS sin navegador |
| **Express** | 4.21.0 | Framework HTTP/REST | Crea endpoints (`/api/menu`, `/api/orders`, etc) |
| **TypeScript** | 5.5.4 | Tipos estáticos en JavaScript | Errores detectados antes de ir a producción |
| **Mongoose** | 8.6.0 | ODM (Object Document Mapper) para MongoDB | Convierte documentos MongoDB a objetos JS con validación |
| **JWT (jsonwebtoken)** | 9.0.2 | JSON Web Tokens para autenticación | Token que prueba que un usuario está logueado |
| **bcryptjs** | 2.4.3 | Hash de contraseñas | Encripta contraseñas para no guardarlas en texto plano |
| **Helmet** | 8.1.0 | Seguridad HTTP | Agrega headers de seguridad automáticamente |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing | Permite que frontend (localhost:3000) hable con backend (localhost:5000) |
| **Swagger** | 6.2.8 | Documentación automática de API | En `/api/docs` se ve qué endpoints existen y cómo usarlos |

#### ¿Cómo funciona en el servidor?

```
1. User hace clic "Crear Orden" en frontend
2. Frontend hace fetch POST a http://localhost:5000/api/orders
3. Express recibe el request en router
4. Middleware valida el JWT token
5. Controller procesa la lógica (calcula total, crea documento)
6. Mongoose guarda en MongoDB
7. Controller retorna JSON con datos de la orden creada
8. Frontend recibe respuesta y actualiza UI
```

### 📦 Base de Datos — MongoDB

| Concepto | Explicación |
|---------|------------|
| **MongoDB** | Base de datos NoSQL (documentos JSON, no tablas SQL) |
| **Documentos** | En lugar de filas, tienes objetos JSON flexibles |
| **Colecciones** | En lugar de tablas, tienes colecciones (ej: `users`, `orders`) |
| **Mongoose** | Validador que asegura que documentos tengan estructura correcta |
| **Ubicación** | Remota en `mongo-dev.nauvolan.abrdns.com:27017` con SSL |
| **Usuario/Pass** | `mongo` / `Pantonio2404` (está en `backend/.env`) |

#### Ejemplo de documento en MongoDB

```javascript
// Colección: orders
// Un documento:
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  items: [
    { name: "Pizza", price: 800, quantity: 2 },
    { name: "Coca Cola", price: 250, quantity: 1 }
  ],
  subtotal: 1850,
  tax: 370,
  total: 2220,
  status: "confirmed",
  deliveryType: "delivery",
  deliveryAddress: "Calle 5 #123, Apto 4B",
  createdAt: ISODate("2026-04-04T15:30:00Z"),
  updatedAt: ISODate("2026-04-04T15:32:00Z")
}
```

---

## Arquitectura del Proyecto

### Vista General (Diagrama)

```
┌─────────────────────────────────────────────────────────────────┐
│                   NAVEGADOR DEL USUARIO                         │
│                  (http://localhost:3000)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    HTTP REST API
                  (Bearer Token JWT)
                         │
        ┌────────────────▼────────────────┐
        │                                 │
┌───────▼──────────────────────┐  ┌──────▼───────────────────┐
│   FRONTEND (React + Vite)    │  │   BACKEND (Express)     │
├──────────────────────────────┤  ├───────────────────────────┤
│ /src/pages                   │  │ /backend/dist/routes   │
│ /src/components              │  │ /backend/dist/controllers
│ /src/context (State)         │  │ /backend/dist/models   │
│ /src/lib/api.ts              │  │ /backend/dist/services │
│ localStorage (User, Token)   │  │ /backend/dist/middleware
└──────────────────────────────┘  └───────────┬─────────────┘
                                              │
                                    Mongoose ODM
                                     (Queries)
                                              │
                                   ┌──────────▼────────────┐
                                   │  MongoDB Remota       │
                                   │  TLS/SSL Encryption   │
                                   ├──────────────────────┤
                                   │ Collections:          │
                                   │ - users               │
                                   │ - menuItems           │
                                   │ - orders              │
                                   │ - reservations        │
                                   │ - payments            │
                                   │ - ... (más)           │
                                   └──────────────────────┘
```

### Flujo de Datos (Ejemplo: Crear Orden)

```
┌──────────────────────────────────┐
│ Usuario hace clic en "Pagar"     │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Frontend: onClick en <Checkout />            │
│ - Lee carrito de CartContext                 │
│ - Lee usuario de AuthContext                 │
│ - Prepara JSON con items, total, datos      │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ apiRequest POST /api/orders                  │
│ - Agrega Authorization: Bearer {JWT_TOKEN}   │
│ - Env a http://localhost:5000/api/orders    │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Backend: Express Router                      │
│ POST /api/orders (order.routes.ts)          │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Middleware: Validar JWT token                │
│ - Extrae userId del payload del JWT         │
│ - Si no válido → retorna 401                │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Controller: order.controller.ts              │
│ - Valida items (existen en BD?)              │
│ - Calcula subtotal, impuestos, total        │
│ - Crea objeto Order nuevo                    │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Mongoose: Order.create(orderData)            │
│ - Valida schema (tipos, campos requeridos)   │
│ - Genera _id único                           │
│ - Inserta documento en MongoDB               │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ MongoDB: Inserta en colección "orders"       │
│ - Crea timestamps (createdAt, updatedAt)    │
│ - Retorna documento con _id asignado        │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Backend: Retorna Response JSON               │
│ {                                            │
│   orderId: "507f...",                       │
│   status: "confirmed",                      │
│   total: 2220,                              │
│   createdAt: "2026-04-04T15:30:00Z"        │
│ }                                            │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Frontend: Recibe respuesta JSON              │
│ - Valida que no haya error                   │
│ - Limpia carrito (CartContext)              │
│ - Navega a /track/{orderId}                 │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Usuario ve página de rastreo de orden       │
│ Fin del flujo ✅                            │
└──────────────────────────────────────────────┘
```

---

## Estructura de Carpetas

```
Restaurant01/
│
├── 📁 src/                              # FRONTEND (React + Vite)
│   ├── pages/                           # Páginas principales (vistas)
│   │   ├── Home.tsx                     # Página de inicio
│   │   ├── Menu.tsx                     # Catálogo de platos
│   │   ├── Cart.tsx                     # Carrito de compras
│   │   ├── Checkout.tsx                 # Procesar pago 💰
│   │   ├── Login.tsx                    # Iniciar sesión usuario
│   │   ├── Register.tsx                 # Crear cuenta usuario
│   │   ├── Profile.tsx                  # Mi perfil
│   │   ├── MyOrders.tsx                 # Historial de órdenes
│   │   ├── MyReservations.tsx           # Mis reservaciones
│   │   ├── Reservations.tsx             # Hacer reservación
│   │   ├── OrderTracking.tsx            # Rastrear orden en vivo
│   │   ├── [otras páginas]              # About, Gallery, Events, etc
│   │   └── admin/                       # Páginas de administrador
│   │       ├── AdminLogin.tsx           # Login para admin
│   │       ├── AdminDashboard.tsx       # Panel principal admin
│   │       ├── AdminOrders.tsx          # Gestión de órdenes
│   │       ├── AdminClients.tsx         # Gestión de clientes
│   │       ├── AdminTables.tsx          # Gestión de mesas
│   │       ├── AdminCashRegister.tsx    # Control de caja
│   │       ├── AdminInventory.tsx       # Inventario
│   │       └── [más páginas admin]
│   │
│   ├── components/                      # Componentes reutilizables
│   │   ├── Header.tsx                   # Encabezado
│   │   ├── Footer.tsx                   # Pie de página
│   │   ├── TopNav.tsx                   # Navegación superior
│   │   ├── Sidebar.tsx                  # Menú lateral
│   │   ├── Modal.tsx                    # Modal genérico
│   │   ├── guards/                      # Protección de rutas
│   │   │   ├── PrivateRoute.tsx         # Solo usuarios logueados
│   │   │   └── AdminRoute.tsx           # Solo admin/staff
│   │   ├── ui/                          # Componentes de Radix UI
│   │   │   ├── button.tsx               # Botones
│   │   │   ├── input.tsx                # Inputs de texto
│   │   │   ├── dialog.tsx               # Modales
│   │   │   ├── [más componentes UI]
│   │   └── [otros componentes]
│   │
│   ├── context/                         # State Management (Context API)
│   │   ├── AuthContext.tsx              # Estado de usuario logueado
│   │   ├── CartContext.tsx              # Estado del carrito
│   │   ├── OrdersContext.tsx            # Estado de órdenes
│   │   ├── ReservationsContext.tsx      # Estado de reservaciones
│   │   └── AdminContext.tsx             # Estado del panel admin
│   │
│   ├── hooks/                           # Custom Hooks (funciones reutilizables)
│   │   ├── useAuth.ts                   # Hook para usar AuthContext
│   │   ├── useMenu.ts                   # Hook para cargar menú
│   │   ├── useOrders.ts                 # Hook para órdenes
│   │   └── useReservations.ts           # Hook para reservaciones
│   │
│   ├── lib/                             # Utilidades y clientes HTTP
│   │   ├── api.ts                       # Cliente HTTP (fetch wrapper)
│   │   └── mappers.ts                   # Transformar datos backend→frontend
│   │
│   ├── types/                           # Tipos TypeScript globales
│   │   └── index.ts                     # User, MenuItem, Order, etc
│   │
│   ├── styles/                          # Estilos CSS globales
│   │   └── globals.css                  # Tailwind + custom CSS
│   │
│   ├── App.tsx                          # Componente raíz
│   └── main.tsx                         # Entry point
│
├── 📁 backend/                          # BACKEND (Express + Node)
│   ├── dist/                            # ⚠️ Código compilado (NO editar)
│   │   ├── routes/                      # Rutas compiladas
│   │   ├── controllers/                 # Lógica compilada
│   │   ├── models/                      # Modelos compilados
│   │   ├── services/                    # Servicios compilados
│   │   ├── middleware/                  # Middleware compilado
│   │   └── server.js                    # Servidor principal compilado
│   │
│   ├── package.json                     # Dependencias del backend
│   ├── tsconfig.json                    # Configuración TypeScript backend
│   ├── vitest.config.ts                 # Configuración de tests
│   └── .env                             # ⚠️ Variables de entorno (NO commitear)
│
├── 📁 docs/                             # Documentación del proyecto
│   ├── analisis_proyecto/               # Análisis y planificación
│   │   ├── vision/                      # Visión del producto
│   │   ├── calidad/                     # Atributos de calidad
│   │   ├── epicas/                      # Épicas del proyecto
│   │   ├── features/                    # Features detalladas
│   │   └── backlog/                     # User stories del backlog
│   ├── PROJECT_STATUS.md                # Estado actual del proyecto
│   └── JUNIOR_DEVELOPERS_GUIDE.md       # Este archivo 📖
│
├── 📁 public/                           # Assets estáticos (imágenes, fuentes)
│
├── 📁 build/                            # Frontend compilado para producción
│
├── 📄 package.json                      # Dependencias frontend
├── 📄 tsconfig.json                     # Configuración TypeScript frontend
├── 📄 vite.config.ts                    # Configuración Vite
├── 📄 tailwind.config.js                # Configuración Tailwind CSS
├── 📄 postcss.config.js                 # Configuración PostCSS
│
├── 📄 .env                              # ⚠️ Variables de entorno frontend
├── 📄 .env.example                      # Template de .env (SÍ commitear)
├── 📄 .gitignore                        # Archivos a ignorar en Git
│
└── 📄 README.md                         # Readme principal del proyecto
```

**⚠️ Archivos importantes a recordar:**

- **`backend/.env`** — Credenciales de MongoDB y JWT. **NO COMITEAR** a git
- **`.env`** — Variables de entorno frontend (API URL). **NO COMITEAR**
- **`backend/dist/`** — Código compilado. Se genera con `pnpm build` en backend
- **`build/`** — Frontend compilado. Se genera con `pnpm build` en frontend

---

## Cómo Levantar el Proyecto

### Opción 1: Script Automático (Recomendado)

```bash
cd c:\Users\pagar\Nextcloud\Projects\Restaurant01
chmod +x start.sh
./start.sh
```

Esto levanta frontend y backend automáticamente en dos procesos paralelos.

### Opción 2: Manual (Dos Terminales)

#### Terminal 1 — Backend

```bash
cd backend
pnpm install  # Solo la primera vez
pnpm start    # O pnpm dev para modo watch
```

Esperas a ver:
```
🚀 Servidor corriendo en http://localhost:5000
📚 Documentación Swagger: http://localhost:5000/api/docs
```

#### Terminal 2 — Frontend

```bash
pnpm install  # Solo la primera vez
pnpm dev
```

Esperas a ver:
```
VITE ready in 234 ms
➜  Local: http://localhost:3000
```

### Verificar que todo funciona

```
✅ Frontend:      http://localhost:3000  (deberías ver la página de inicio)
✅ Backend:       http://localhost:5000/api/health  (retorna {"status":"ok"})
✅ Swagger Docs:  http://localhost:5000/api/docs  (documentación interactiva)
```

### Variables de Entorno Necesarias

**Frontend (`.env` en raíz)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Restaurant01
VITE_APP_VERSION=0.1.0
```

**Backend (`backend/.env`)**
```env
PORT=5000
NODE_ENV=development

# MongoDB (ya configurado, no cambies a menos que tu BD sea diferente)
MONGODB_URI=mongodb://mongo:Pantonio2404@mongo-dev.nauvolan.abrdns.com:27017/?tls=true&tlsCAFile=/home/nauvolanl/Nextcloud/Projects/Restaurant01/backend/mongo-cert.crt&authSource=admin&tlsAllowInvalidCertificates=true

# JWT (clave para firmar tokens)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS (permitir frontend hacer requests)
FRONTEND_URL=http://localhost:3000
```

---

## Autenticación y Seguridad

### ¿Cómo funciona el login?

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario ingresa email y contraseña en formulario (Login)  │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend: POST /api/auth/login                           │
│    Body: { email: "user@mail.com", password: "123456" }    │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend: auth.controller.ts                              │
│    - Busca usuario en BD por email                          │
│    - Compare contraseña hasheada con bcryptjs              │
│    - Si no coincide → retorna 401 "Contraseña incorrecta"   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼ (si password es correcto)
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend: Genera JWT Token                                │
│    const token = jwt.sign(                                  │
│      { userId: user._id, email: user.email, role: ... },   │
│      JWT_SECRET,                                            │
│      { expiresIn: "7d" }                                     │
│    )                                                         │
│    ⏱️ Token válido por 7 días                                │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend: Retorna JSON                                    │
│    {                                                        │
│      success: true,                                         │
│      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",     │
│      user: { id: "507f...", name: "Juan", role: "customer"}│
│    }                                                         │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend: setAuthToken(token)                            │
│    - Guarda token en localStorage['restaurant_auth_token']  │
│    - Actualiza AuthContext (isAuthenticated = true)        │
│    - Redirige a / (home)                                   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Requests Posteriores con Autenticación                   │
│    Cuando haces fetch, el token se agrega automáticamente:   │
│    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Backend: Middleware auth.middleware.ts verifica token    │
│    - Extrae token del header Authorization                 │
│    - Verifica firma con JWT_SECRET                         │
│    - Si válido → extrae userId y pasa al controller       │
│    - Si inválido → retorna 401 "Token expirado/inválido"   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Controller accede a req.userId automáticamente           │
│    y sabe quién es el usuario                              │
└─────────────────────────────────────────────────────────────┘
```

### Dónde se usa la autenticación en el código

**Frontend:**
- `src/context/AuthContext.tsx` — Guarda usuario y token
- `src/lib/api.ts` — Agrega token automáticamente en headers
- `src/components/guards/PrivateRoute.tsx` — Protege rutas privadas

**Backend:**
- `backend/dist/middleware/auth.middleware.ts` — Valida JWT en cada request
- `backend/dist/routes/*.routes.ts` — Usa `requireAuth` para rutas protegidas

### Roles y Permisos

```typescript
// En backend/dist/types/index.ts (o similar)
type UserRole = 'customer' | 'staff' | 'admin';

// CUSTOMER (cliente normal)
// Puede: ver menú, hacer compras, reservar, ver su perfil
// NO puede: acceder a /admin

// STAFF (personal restaurante)
// Puede: todo lo que CUSTOMER + gestionar órdenes/mesas
// NO puede: eliminar usuarios, gestionar inventario completo

// ADMIN (administrador)
// Puede: TODO
```

---

## Flujos Principales (Paso a Paso)

### 1️⃣ Flujo de Compra Completo (Home → Carrito → Checkout → Orden Creada)

#### Paso 1: Usuario ve el menú

**Archivo:** `src/pages/Menu.tsx`

```typescript
// Menu.tsx carga items al montar
useEffect(() => {
  const loadMenu = async () => {
    const response = await apiRequest('/menu');
    setMenuItems(response.data);
  };
  loadMenu();
}, []);

// Muestra cada item
menuItems.map(item => (
  <div key={item.id}>
    <h3>{item.name}</h3>
    <p>${item.price}</p>
    <button onClick={() => addToCart(item)}>Agregar</button>
  </div>
))
```

**Backend que lo respalda:** `backend/dist/routes/menu.routes.ts`
```javascript
router.get('/', getMenu);  // GET /api/menu
```

**Controller:** `backend/dist/controllers/menu.controller.ts`
```javascript
// Obtiene todos los items de MongoDB
// Retorna: { success: true, data: [...] }
```

#### Paso 2: Usuario agrega items al carrito

**Archivo:** `src/context/CartContext.tsx`

```typescript
// Cuando hace clic "Agregar al Carrito"
const addToCart = (item: MenuItem) => {
  setCartItems([...cartItems, {
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: 1,
    image: item.image
  }]);
  // Además, si está autenticado, estos se sincronizan con el backend
};
```

#### Paso 3: Usuario va a /cart y ve resumen

**Archivo:** `src/pages/Cart.tsx`

```typescript
// Ve los items que agregó
cartItems.map(item => (
  <div>
    <p>{item.name} x {item.quantity} = ${item.price * item.quantity}</p>
    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
    <button onClick={() => removeFromCart(item.id)}>Remover</button>
  </div>
))

// Ve total
const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
<p>Total: ${total}</p>
```

#### Paso 4: Usuario hace clic "Ir a Checkout"

**Archivo:** `src/pages/Checkout.tsx`

```typescript
// Formulario de pago
<form onSubmit={handleCheckout}>
  <input name="cardNumber" placeholder="1234 5678 9012 3456" />
  <input name="expiry" placeholder="MM/YY" />
  <input name="cvv" placeholder="123" />
  <select name="deliveryType">
    <option>Delivery (llevar a domicilio)</option>
    <option>Pickup (retiro en local)</option>
    <option>Dine-in (comer acá)</option>
  </select>
  {deliveryType === 'delivery' && (
    <input name="address" placeholder="Calle y número" />
  )}
  <button type="submit">Pagar ${total}</button>
</form>
```

#### Paso 5: Backend procesa la orden

**Archivo:** `backend/dist/controllers/order.controller.ts`

```javascript
// POST /api/orders
exports.createOrder = async (req, res) => {
  const { items, deliveryType, deliveryAddress, cardNumber, ... } = req.body;
  const userId = req.userId; // Del JWT middleware
  
  // Valida que items existan
  const menuItems = await MenuItem.find({ _id: { $in: items.map(i => i.id) } });
  
  // Calcula totales
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.2); // 20% IVA
  const total = subtotal + tax;
  
  // Crea documento Order en BD
  const order = new Order({
    userId,
    items: items.map(i => ({ ...i })),
    subtotal,
    tax,
    total,
    status: 'pending',
    deliveryType,
    deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
    paymentStatus: 'pending'
  });
  
  await order.save();
  
  // Retorna JSON al frontend
  res.json({
    success: true,
    orderId: order._id,
    total: order.total,
    status: order.status
  });
};
```

#### Paso 6: Frontend redirige a rastreo

**Archivo:** `src/pages/OrderTracking.tsx`

```typescript
// Parámetro de URL: /track/:orderId
const { orderId } = useParams();

// Carga datos de la orden
useEffect(() => {
  const loadOrder = async () => {
    const response = await apiRequest(`/orders/${orderId}`, { auth: true });
    setOrder(response.data);
  };
  loadOrder();
}, [orderId]);

// Muestra estado
<div>
  <h2>Orden #{orderId}</h2>
  <p>Estado: {order.status} (Pending/Confirmed/Preparing/Ready/Delivering/Delivered)</p>
  <p>Total: ${order.total}</p>
  <p>Dirección: {order.deliveryAddress}</p>
  <p>Tiempo estimado: {order.estimatedMinutes} minutos</p>
</div>
```

**Backend (GET /api/orders/:id):**
```javascript
// Obtiene orden de BD y retorna
const order = await Order.findById(req.params.id).populate('userId');
res.json({ success: true, data: order });
```

### 2️⃣ Flujo de Autenticación

Ver la sección [Autenticación y Seguridad](#autenticación-y-seguridad) arriba.

### 3️⃣ Flujo de Reservación

**Archivo:** `src/pages/Reservations.tsx`

```typescript
// 1. Usuario ingresa datos del formulario
<form>
  <input type="date" name="date" />
  <input type="time" name="time" />
  <input type="number" name="guestCount" min="1" max="20" />
  <textarea name="specialRequests" />
  <button onClick={handleReserve}>Reservar</button>
</form>

// 2. Click "Reservar" → POST /api/reservations
const handleReserve = async () => {
  const response = await apiRequest('/reservations', {
    method: 'POST',
    body: JSON.stringify({
      date: selectedDate,
      time: selectedTime,
      guestCount: parseInt(guestCount),
      specialRequests: specialRequests,
      userId: currentUser.id
    }),
    auth: true
  });
  
  if (response.success) {
    navigate('/booking-confirmation', { state: { reservation: response.data } });
  }
};
```

**Backend (backend/dist/routes/reservation.routes.ts y controllers):**
```javascript
// POST /api/reservations
// 1. Busca mesas disponibles en esa fecha/hora
// 2. Asigna una mesa
// 3. Crea documento Reservation en BD
// 4. Retorna confirmación con número y detalles
```

### 4️⃣ Flujo del Panel de Administración

#### Vista Admin de Órdenes

**Archivo:** `src/pages/admin/AdminOrders.tsx`

```typescript
// Carga todas las órdenes
useEffect(() => {
  const loadOrders = async () => {
    const response = await apiRequest('/admin/orders', { auth: true });
    setOrders(response.data); // Array de todas las órdenes del sistema
  };
  loadOrders();
}, []);

// Muestra tabla con órdenes
<table>
  <thead>
    <tr>
      <th>Orden #</th>
      <th>Cliente</th>
      <th>Total</th>
      <th>Estado</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {orders.map(order => (
      <tr>
        <td>{order._id}</td>
        <td>{order.user.name}</td>
        <td>${order.total}</td>
        <td>
          <select 
            value={order.status}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
          >
            <option>pending</option>
            <option>confirmed</option>
            <option>preparing</option>
            <option>ready</option>
            <option>delivering</option>
            <option>delivered</option>
          </select>
        </td>
        <td>
          <button onClick={() => viewDetails(order._id)}>Ver</button>
          <button onClick={() => assignDriver(order._id)}>Asignar Repartidor</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

**Backend (backend/dist/routes/admin/order.routes.ts):**
```javascript
// GET /api/admin/orders → obtiene todas las órdenes
// PATCH /api/admin/orders/:id/status → actualiza estado
// POST /api/admin/orders/:id/delivery → asigna delivery
```

---

## Frontend — React + TypeScript

### Context API (State Management)

En lugar de Redux, usamos **Context API** que viene con React.

#### AuthContext — "¿Quién soy yo?"

**Archivo:** `src/context/AuthContext.tsx`

```typescript
// Crea contexto
const AuthContext = createContext<AuthContextValue | null>(null);

// Define qué datos guarda
interface AuthContextValue {
  user: User | null;           // El usuario logueado
  isAuthenticated: boolean;     // ¿Está logueado?
  isAdmin: boolean;             // ¿Es admin?
  login: (email, password) => Promise<...>;
  logout: () => void;
  register: (data) => Promise<...>;
  updateProfile: (data) => Promise<...>;
}

// Proveedor
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setAuthToken(response.token);
    setUser(response.user);
    return { success: true, user: response.user };
  };
  
  // ... más funciones
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, ... }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar en componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe estar dentro de AuthProvider');
  return context;
};
```

**Cómo usarlo en un componente:**

```typescript
// En cualquier componente
function MiComponente() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return <p>No estás logueado</p>;
  
  return (
    <div>
      <p>Hola, {user.name}!</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

#### CartContext — "¿Qué tengo en el carrito?"

**Archivo:** `src/context/CartContext.tsx`

```typescript
interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

// Guarda items en localStorage para persistencia
const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Al recargar, recupera carrito del localStorage
    const stored = localStorage.getItem('restaurant_cart');
    return stored ? JSON.parse(stored) : [];
  });
  
  const addToCart = (item) => {
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
  };
  
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };
  
  // Guarda en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('restaurant_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, total, ... }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe estar dentro de CartProvider');
  return context;
};
```

**Cómo usarlo:**

```typescript
function ProductCard({ item }) {
  const { addToCart } = useCart();
  
  return (
    <div>
      <h3>{item.name}</h3>
      <p>${item.price}</p>
      <button onClick={() => addToCart(item)}>
        Agregar al carrito
      </button>
    </div>
  );
}
```

### Custom Hooks

Son funciones que reutilizan lógica y usan Context/API.

**Ejemplo: backend/dist/hooks/useAuth.ts**

```typescript
export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return { user, isAuthenticated, login, logout };
};
```

### API Client (`src/lib/api.ts`)

Centraliza todos los requests HTTP.

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = false, headers, ...rest } = options;
  const token = getAuthToken();
  
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers
  };
  
  // Si es una ruta protegida, agrega el token JWT
  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders
  });
  
  const payload = await response.json();
  
  if (!response.ok) {
    throw new Error(payload.message || `HTTP ${response.status}`);
  }
  
  return payload as T;
}
```

**Cómo usarlo en componentes:**

```typescript
// GET
const response = await apiRequest('/menu');

// POST con token
const response = await apiRequest('/orders', {
  method: 'POST',
  body: JSON.stringify({ items, total, ... }),
  auth: true // Agrega JWT automáticamente
});

// PATCH (actualizar)
const response = await apiRequest(`/orders/${id}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status: 'preparing' }),
  auth: true
});
```

### Route Guards

Protegen rutas para que solo usuarios autenticados/admin puedan acceder.

**Archivo:** `src/components/guards/PrivateRoute.tsx`

```typescript
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Si no está logueado, redirige a /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si está logueado, permite acceso
  return <>{children}</>;
};

export default PrivateRoute;
```

**Archivo:** `src/components/guards/AdminRoute.tsx`

```typescript
interface AdminRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'staff'>;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, allowedRoles = ['admin', 'staff'] }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (user && !allowedRoles.includes(user.role as 'admin' | 'staff')) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;
```

**Cómo usarlo en App.tsx:**

```typescript
<Routes>
  // Rutas públicas
  <Route path="/" element={<Home />} />
  <Route path="/menu" element={<Menu />} />
  
  // Rutas privadas (solo usuarios autenticados)
  <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
  <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
  
  // Rutas admin (solo admin/staff)
  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
</Routes>
```

---

## Backend — Express + MongoDB

### Estructura de una Ruta

Todas las rutas siguen el patrón: **Router → Middleware → Controller → Service → Mongoose → MongoDB**

**Ejemplo: Crear una orden (POST /api/orders)**

#### 1. Definir la ruta (backend/dist/routes/order.routes.ts)

```javascript
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { createOrder, getOrders, getOrderById } = require('../controllers/order.controller');

// POST /api/orders — crear orden (requiere autenticación)
router.post('/', requireAuth, createOrder);

// GET /api/orders — obtener mis órdenes (requiere autenticación)
router.get('/', requireAuth, getOrders);

// GET /api/orders/:id — obtener detalle de una orden
router.get('/:id', requireAuth, getOrderById);

module.exports = router;
```

#### 2. Implementar el controlador (backend/dist/controllers/order.controller.ts)

```javascript
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryType, deliveryAddress, paymentMethod } = req.body;
    const userId = req.userId; // Del middleware auth
    
    // Validar que items existan
    const menuItems = await MenuItem.find({ _id: { $in: items.map(i => i.id) } });
    if (menuItems.length !== items.length) {
      return res.status(400).json({ error: 'Algunos items no existen' });
    }
    
    // Calcular totales
    const subtotal = items.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m._id.toString() === item.id);
      return sum + (menuItem.price * item.quantity);
    }, 0);
    
    const tax = Math.round(subtotal * 0.2); // 20% IVA
    const total = subtotal + tax;
    
    // Crear orden
    const order = new Order({
      userId,
      items: items.map(i => ({
        ...i,
        menuItemId: i.id
      })),
      subtotal,
      tax,
      total,
      status: 'pending',
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
      paymentMethod,
      paymentStatus: 'pending'
    });
    
    // Guardar en BD
    await order.save();
    
    // Retornar respuesta
    res.json({
      success: true,
      data: order,
      message: 'Orden creada exitosamente'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId }).populate('userId');
    
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId');
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### 3. Modelo/Schema (backend/dist/models/Order.ts)

```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    menuItemId: mongoose.Schema.Types.ObjectId
  }],
  subtotal: Number,
  tax: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryType: {
    type: String,
    enum: ['delivery', 'pickup', 'dine-in'],
    required: true
  },
  deliveryAddress: String,
  estimatedMinutes: { type: Number, default: 30 },
  paymentMethod: { type: String, enum: ['card', 'cash', 'transfer'] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
```

### Middleware (Autenticación)

**Archivo:** `backend/dist/middleware/auth.middleware.ts`

```javascript
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

exports.requireAuth = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const token = authHeader.slice(7); // Quita "Bearer "
    
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar userId al request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    // Continuar a next middleware/controller
    next();
    
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

exports.requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'No tienes permisos para esto' });
    }
    next();
  };
};
```

### Server Principal (backend/dist/server.ts)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDatabase } = require('./config/database');
const { env } = require('./config/env');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const menuRoutes = require('./routes/menu.routes');
const reservationRoutes = require('./routes/reservation.routes');
const adminOrderRoutes = require('./routes/admin/order.routes');

const createApp = () => {
  const app = express();
  
  // Middlewares de seguridad
  app.use(helmet()); // Headers de seguridad
  app.use(cors({ origin: env.frontendUrl })); // Permitir requests del frontend
  
  // Parsear JSON
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Documentación Swagger
  app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));
  
  // Registrar rutas
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/menu', menuRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/admin/orders', adminOrderRoutes);
  
  // Error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: env.nodeEnv === 'development' ? err.message : undefined
    });
  });
  
  return app;
};

const startServer = async () => {
  await connectDatabase();
  const app = createApp();
  
  app.listen(env.port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
    console.log(`📚 Documentación: http://localhost:${env.port}/api/docs`);
  });
};

if (env.nodeEnv !== 'test') {
  startServer();
}

module.exports = { createApp, startServer };
```

---

## Base de Datos — MongoDB

### ¿Cómo funciona MongoDB?

MongoDB es una base de datos **NoSQL** (no relacional). En lugar de tablas SQL, tiene:

- **Documentos** = objetos JSON
- **Colecciones** = grupos de documentos (como tablas, pero flexibles)
- **_id** = identificador único de cada documento (generada automáticamente)

### Colecciones principales

#### Colección: `users`

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Juan Pérez",
  email: "juan@mail.com",
  password: "$2b$10$...", // Hash bcrypt (NO texto plano)
  phone: "555-1234",
  address: "Calle 5 #123",
  role: "customer", // "customer" | "staff" | "admin"
  isVIP: false,
  loyaltyPoints: 150,
  createdAt: ISODate("2026-03-01T10:00:00Z"),
  updatedAt: ISODate("2026-04-04T15:30:00Z")
}
```

#### Colección: `menuItems`

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  name: "Pizza Margarita",
  category: "pizzas",
  description: "Pizza clásica con mozzarella y tomate",
  price: 1200,
  image: "https://.../pizza-margarita.jpg",
  ingredients: ["harina", "queso mozzarella", "tomate", "bases"],
  isAvailable: true,
  createdAt: ISODate("2026-02-01T10:00:00Z")
}
```

#### Colección: `orders`

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // Referencia a usuario
  items: [
    { name: "Pizza Margarita", price: 1200, quantity: 2, menuItemId: ObjectId("...") },
    { name: "Coca Cola", price: 250, quantity: 1, menuItemId: ObjectId("...") }
  ],
  subtotal: 2650,
  tax: 530,
  total: 3180,
  status: "preparing", // pending/confirmed/preparing/ready/delivering/delivered
  deliveryType: "delivery", // delivery/pickup/dine-in
  deliveryAddress: "Calle 5 #123, Apto 4B",
  estimatedMinutes: 30,
  paymentMethod: "card",
  paymentStatus: "paid",
  createdAt: ISODate("2026-04-04T15:00:00Z"),
  updatedAt: ISODate("2026-04-04T15:30:00Z")
}
```

### Queries comunes (Mongoose)

```javascript
// Buscar un documento por _id
const order = await Order.findById('507f1f77bcf86cd799439013');

// Buscar varios documentos
const orders = await Order.find({ userId: '507f1f77bcf86cd799439011' }); // Todas mis órdenes

// Buscar con filtros múltiples
const pendingOrders = await Order.find({ status: 'pending', deliveryType: 'delivery' });

// Contar documentos
const totalOrders = await Order.countDocuments();

// Actualizar un documento
await Order.findByIdAndUpdate(
  '507f1f77bcf86cd799439013',
  { $set: { status: 'delivered' } }, // Qué cambiar
  { new: true } // Retorna documento actualizado
);

// Eliminar
await Order.findByIdAndDelete('507f1f77bcf86cd799439013');

// Relaciones (populate)
const order = await Order.findById('507f1f77bcf86cd799439013')
  .populate('userId'); // Reemplaza userId con el documento completo del usuario

// Agregaciones (reportes)
const salesByDay = await Order.aggregate([
  { $match: { createdAt: { $gte: new Date('2026-04-01') } } },
  { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$total' } } },
  { $sort: { _id: 1 } }
]);
```

### Conexión a MongoDB en `backend/dist/config/database.ts`

```javascript
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

exports.connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};
```

---

## Cómo Hacer Cambios

### Escenario 1: Agregar un campo nuevo a la orden

**Requisito:** Los órdenes ahora deben tener un field `specialInstructions` (instrucciones especiales del cliente).

#### Paso 1: Actualizar el modelo

**Archivo:** `backend/dist/models/Order.ts`

```typescript
// Encontrar este esquema:
const orderSchema = new mongoose.Schema({
  userId: { ... },
  items: [ ... ],
  total: Number,
  status: String,
  // ...
});

// Agregar el nuevo campo:
const orderSchema = new mongoose.Schema({
  userId: { ... },
  items: [ ... ],
  total: Number,
  status: String,
  specialInstructions: { // ← NUEVO
    type: String,
    default: ''
  },
  // ...
});
```

#### Paso 2: Actualizar el frontend (formulario de checkout)

**Archivo:** `src/pages/Checkout.tsx`

```typescript
// Agregar input:
<form>
  <input name="cardNumber" ... />
  <select name="deliveryType" ... />
  {/* ↓ NUEVO ↓ */}
  <textarea 
    name="specialInstructions" 
    placeholder="Ej: Sin cebolla, extra queso, etc."
  />
  {/* ↑ NUEVO ↑ */}
  <button type="submit">Pagar</button>
</form>

// En handleSubmit:
const handleSubmit = async (e) => {
  const formData = newFormData(e.target);
  const specialInstructions = formData.get('specialInstructions'); // ← NUEVO
  
  await apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({
      items: cartItems,
      deliveryType: formData.get('deliveryType'),
      specialInstructions, // ← NUEVO
      // ... resto de campos
    }),
    auth: true
  });
};
```

#### Paso 3: Actualizar el backend (controller)

**Archivo:** `backend/dist/controllers/order.controller.ts`

```javascript
exports.createOrder = async (req, res) => {
  const { items, deliveryType, specialInstructions, ... } = req.body; // ← NUEVO
  
  const order = new Order({
    userId,
    items,
    subtotal,
    tax,
    total,
    status: 'pending',
    deliveryType,
    specialInstructions, // ← NUEVO
    // ...
  });
  
  await order.save();
  res.json({ success: true, data: order });
};
```

#### Paso 4: Actualizar vista de admin (para que vea instrucciones)

**Archivo:** `src/pages/admin/AdminOrders.tsx`

```typescript
// En la tabla o modal de detalles:
<div>
  <p><strong>Instrucciones especiales:</strong> {order.specialInstructions}</p>
</div>
```

#### Paso 5: Test

```bash
# En terminal backend:
pnpm start

# En terminal frontend:
pnpm dev

# En navegador:
# 1. Ve a http://localhost:3000/menu
# 2. Agrega items al carrito
# 3. Ve a /checkout
# 4. Ingresa "Sin cebolla" en el textarea nuevo
# 5. Paga
# 6. Mira en Admin Panel (/admin/orders) que aparezca la instrucción
```

### Escenario 2: Agregar un nuevo endpoint en el backend

**Requisito:** Crear un endpoint que retorne todas las órdenes entregadas hoy.

#### Paso 1: Agregar en el controller

**Archivo:** `backend/dist/controllers/order.controller.ts`

```javascript
// Agregar esta función nueva:
exports.getTodayDelivered = async (req, res) => {
  try {
    // Hoy a las 00:00
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    // Hoy a las 23:59
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    
    // Buscar órdenes entregadas hoy
    const orders = await Order.find({
      status: 'delivered',
      updatedAt: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    }).populate('userId');
    
    // Calcular total de ventas
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    
    res.json({
      success: true,
      data: {
        ordersDelivered: orders.length,
        totalSales: totalSales,
        orders: orders
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Paso 2: Registrar la ruta

**Archivo:** `backend/dist/routes/order.routes.ts`

```javascript
const { getTodayDelivered } = require('../controllers/order.controller');

// Agregar esta línea:
router.get('/today/delivered', requireAuth, getTodayDelivered);
```

#### Paso 3: Usar en frontend (dashboard admin)

**Archivo:** `src/pages/admin/AdminDashboard.tsx`

```typescript
useEffect(() => {
  const loadTodayStats = async () => {
    const response = await apiRequest('/orders/today/delivered', { auth: true });
    setTodayDelivered(response.data.ordersDelivered);
    setTodayRevenue(response.data.totalSales);
  };
  loadTodayStats();
}, []);

return (
  <div>
    <h2>Reportes de Hoy</h2>
    <p>Órdenes entregadas: {todayDelivered}</p>
    <p>Ingresos totales: ${todayRevenue}</p>
  </div>
);
```

#### Paso 4: Test

```bash
# En Postman o curl:
GET http://localhost:5000/api/orders/today/delivered
Authorization: Bearer {JWT_TOKEN}

# Respuesta:
{
  "success": true,
  "data": {
    "ordersDelivered": 5,
    "totalSales": 15900,
    "orders": [...]
  }
}
```

---

## Testing y Debugging

### Swagger Docs (Prueba endpoints sin código)

1. Inicia el servidor (`pnpm start`)
2. Ve a **http://localhost:5000/api/docs**
3. Verás todos los endpoints listados
4. Haz clic en uno y pruébalo

### Console del Navegador

**Developer Tools (F12)**

```javascript
// Verificar que el token se guarda
localStorage.getItem('restaurant_auth_token');

// Verificar carrito
localStorage.getItem('restaurant_cart');

// Hacer un request manual
fetch('http://localhost:5000/api/menu')
  .then(r => r.json())
  .then(data => console.log(data));
```

### Logs del Backend

En terminal donde corre backend:

```
🚀 Servidor corriendo en http://localhost:5000
📝 Ambiente: development
📚 Documentación Swagger: http://localhost:5000/api/docs

[Cuando haces un request]
GET /api/menu
POST /api/orders ← Aquí verías logs
Error: ... (si hay error)
```

### MongoDB (Verificar datos)

Si quieres ver directamente qué está en la BD:

```javascript
// En terminal de backend, puedes conectar a MongoDB:
// (Requiere instalar MongoDB Compass o usar mongo shell)

// Comando para listar órdenes:
db.orders.find() // En MongoDB shell
```

---

## Recursos y Referencias

### Documentación Oficial

- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Express:** https://expressjs.com
- **Mongoose:** https://mongoosejs.com/docs/guide.html
- **TailwindCSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com/docs

### Archivos Clave del Proyecto

| Archivo | ¿Qué hace? |
|---------|-----------|
| `src/App.tsx` | Estructura general, rutas principales |
| `src/context/*.tsx` | State management global |
| `src/lib/api.ts` | Cliente HTTP para llamar backend |
| `src/pages/*.tsx` | Páginas (vistas) principales |
| `backend/dist/server.js` | Servidor Express principal |
| `backend/dist/routes/*.js` | Definición de endpoints |
| `backend/dist/controllers/*.js` | Lógica de cada endpoint |
| `backend/dist/models/*.js` | Esquemas de MongoDB |
| `.env` | Variables de entorno frontend |
| `backend/.env` | Variables de entorno backend |

### Conceptos Importantes a Dominar

1. **React Hooks:** `useState`, `useEffect`, `useContext`
2. **Context API:** Compartir datos sin props drilling
3. **REST API:** GET, POST, PATCH, DELETE
4. **JWT Tokens:** Autenticación stateless
5. **MongoDB:** Documentos, colecciones, queries
6. **Express Middleware:** Funciones que se ejecutan antes de controllers
7. **TypeScript:** Tipos estáticos para detectar errores

### Próximos Pasos Recomendados

1. **Lee el código principal:**
   - `src/pages/Menu.tsx` — entender cómo carga datos
   - `src/context/AuthContext.tsx` — entender autenticación
   - `backend/dist/routes/order.routes.ts` → `backend/dist/controllers/order.controller.ts` — ver flujo completo

2. **Crea algo pequeño:**
   - Un nuevo campo en User (ej: `favoriteFood`)
   - Un nuevo endpoint en backend (ej: `GET /users/top-spenders`)
   - Una nueva página en frontend (ej: `/loyalty-program`)

3. **Debuggea algo existente:**
   - Ve a `/my-orders` y verifica que cargan tus órdenes
   - Ve a `/admin` y verifica que solo accede con rol admin
   - Abre Swagger docs y prueba cada endpoint manualmente

---

**¡Felicidades! Aprendiste la arquitectura completa de Restaurant01. 🎉**

**Para preguntas específicas, consulta los documentos en `docs/analisis_proyecto/`**
