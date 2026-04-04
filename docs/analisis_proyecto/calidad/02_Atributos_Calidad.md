# 02 – Atributos de Calidad: ISO/IEC 25010

## 1. Marco de Referencia

Este documento define los atributos de calidad del sistema **Arancia Restaurant Platform** bajo el estándar **ISO/IEC 25010:2011 — Systems and Software Quality Requirements and Evaluation (SQuaRE)**.

Cada característica incluye:
- Definición aplicada al contexto del proyecto
- Métricas de aceptación medibles y verificables
- Riesgos identificados en el estado actual del codebase

---

## 2. Características de Calidad

### 2.1 Adecuación Funcional

> *El sistema provee funciones que satisfacen las necesidades establecidas cuando es usado bajo condiciones específicas.*

**Sub-características aplicadas:**

- **Completitud funcional**: El sistema debe cubrir el 100% de los flujos críticos del cliente (menú → carrito → checkout → pago → confirmación) y del operador (mesas → cuenta → cobro → caja).
- **Corrección funcional**: Los cálculos financieros (subtotal + IVA 18% + total + descuentos VIP) deben coincidir al centavo entre frontend y backend. El backend es la fuente de verdad.
- **Pertinencia funcional**: Ningún módulo del panel admin es accesible desde rutas de cliente, y viceversa.

**Métricas de Aceptación:**

- `0` páginas con datos hardcodeados o mock en build de producción
- `100%` de cálculos financieros validados en backend (frontend es solo visualización)
- `0` endpoints de admin devuelven datos sin verificar rol `admin` o `staff`
- Flujo completo: cliente puede completar un pedido con pago desde `/menu` hasta recibo en ≤ 6 pasos

**Riesgos Actuales:**

- `Checkout.tsx` usa datos ficticios y `setTimeout` — **CRÍTICO**: ningún pedido real se crea
- `Profile.tsx` muestra "Juan Pérez" hardcodeado — **ALTO**: UX rota para cualquier usuario real
- Sin middleware de rol en rutas futuras de admin — **CRÍTICO**: cualquier usuario podría ejecutar operaciones admin

---

### 2.2 Eficiencia en el Rendimiento

> *El rendimiento relativo a la cantidad de recursos utilizados bajo condiciones establecidas.*

**Sub-características aplicadas:**

- **Comportamiento temporal**: Las respuestas de la API deben estar dentro de umbrales aceptables bajo carga normal del restaurante.
- **Utilización de recursos**: Las imágenes del menú no deben bloquear la renderización inicial (Core Web Vitals).
- **Capacidad**: El sistema debe mantener rendimiento aceptable con 50 usuarios concurrentes (horario pico de reservas/pedidos).

**Métricas de Aceptación:**

- `GET /api/menu` responde en ≤ 200ms con índices MongoDB correctos
- `POST /api/orders` (checkout) ≤ 500ms incluyendo creación de Payment
- `GET /api/admin/orders` con filtros de fecha responde ≤ 300ms (requiere índices en `createdAt`)
- Imágenes renderizadas con `loading="lazy"` y dimensiones fijas (sin Cumulative Layout Shift)
- Paginación en todos los endpoints de listado cuando resultado supera 50 documentos
- LCP (Largest Contentful Paint) ≤ 2.5s en conexión 4G estándar

**Riesgos Actuales:**

- Sin paginación: `GET /api/menu` devuelve todos los ítems en una sola respuesta
- Imágenes almacenadas como Buffer en MongoDB (alto I/O para galerías con muchos ítems)
- Sin índices en campos de fecha para queries de admin (futura degradación de performance)

---

### 2.3 Compatibilidad

> *Grado en que el producto puede intercambiar información con otros productos y compartir el mismo entorno sin impacto negativo.*

**Sub-características aplicadas:**

- **Coexistencia**: La API REST sigue convenciones HTTP estándar con códigos de estado semánticamente correctos.
- **Interoperabilidad**: Los endpoints de delivery exponen estructura compatible con webhooks de terceros de logística (para v2).

**Métricas de Aceptación:**

- Todos los endpoints retornan `Content-Type: application/json`
- Códigos HTTP semánticamente correctos implementados: `200`, `201`, `400`, `401`, `403`, `404`, `422`, `500`
- Estructura de respuesta estandarizada en todos los controladores:
  ```json
  { "success": true, "data": {}, "message": "string" }
  ```
- CORS configurado con lista blanca explícita (no `*`) en producción
- Sin dependencias cíclicas entre módulos del backend

**Riesgos Actuales:**

- CORS configurado con posible wildcard en desarrollo — debe restringirse para producción
- Estructura de response no estandarizada en todos los controladores existentes

---

### 2.4 Usabilidad

> *Grado en que el sistema puede ser usado por usuarios específicos para lograr objetivos con efectividad, eficiencia y satisfacción.*

**Sub-características aplicadas:**

- **Capacidad de aprendizaje**: Un cliente nuevo debe poder completar un pedido con pago sin instrucciones externas.
- **Operabilidad**: El panel admin debe ser completamente operable sin shortcuts de teclado complejos.
- **Protección contra errores del usuario**: Validaciones client-side antes de enviar al servidor; mensajes de error específicos.
- **Accesibilidad**: Componentes Radix UI (ya instalados) garantizan accesibilidad ARIA por defecto.
- **Estética de interfaz**: El sistema de diseño Tailwind + shadcn/ui es consistente en todas las pantallas nuevas.

**Métricas de Aceptación:**

- Flujo menú → carrito → checkout → pago ≤ 4 pantallas distintas
- `100%` de formularios con validación client-side antes de submit (usando `react-hook-form` existente)
- Mensajes de error específicos y accionables (no genéricos "algo salió mal")
- Todas las acciones destructivas con diálogo de confirmación (`AlertDialog` de shadcn/ui)
- Responsive: funcional en 320px (mobile) hasta 1440px (desktop)
- Panel Admin accesible en tablet (768px) — staff puede usarlo desde iPad en el salón

**Riesgos Actuales:**

- `Checkout.tsx` no valida campos antes de enviar al servidor
- `Profile.tsx` usa `alert()` nativo del browser para feedback — UX inconsistente
- Sin confirmación antes de acciones destructivas (cancelar reserva, eliminar ítem de inventario)

---

### 2.5 Fiabilidad

> *Grado en que el sistema realiza funciones especificadas bajo condiciones específicas durante un período de tiempo definido.*

**Sub-características aplicadas:**

- **Madurez**: El sistema no tiene condiciones de carrera ni estados corruptos (ej: carrito que no se limpia post-pago, pago confirmado sin orden asociada).
- **Disponibilidad**: La API está operativa ≥ 99% en horario operacional del restaurante (8am–11pm).
- **Tolerancia a fallos**: Si el servidor no responde, el frontend muestra error controlado y accionable (no pantalla en blanco ni crash).
- **Capacidad de recuperación**: Si un pago falla, el pedido permanece en `pending` y puede reintentarse sin duplicar la orden.

**Métricas de Aceptación:**

- Post-pago exitoso: carrito se limpia **automáticamente** y pedido pasa a `confirmed`
- `100%` de llamadas a la API envueltas en `try/catch` con feedback visual al usuario
- Flujo de estados de pago respeta máquina de estados: `pending → processing → completed/failed`; sin saltos
- Si `POST /api/payments` falla, la Order permanece en `pending` (no se auto-confirma)
- Tests de flujo crítico: pago exitoso + pago fallido + reintentar pago + delivery creado

**Riesgos Actuales:**

- `Checkout.tsx` no tiene ningún manejo de errores de API
- Sin MongoDB sessions/transactions para operaciones atómicas multi-documento (pago + actualizar pedido)
- CartContext no limpia el carrito automáticamente al completar una compra

---

### 2.6 Seguridad

> *Grado en que el producto protege la información y los datos de manera que personas u otros sistemas tengan el nivel de acceso adecuado.*

**Sub-características aplicadas:**

- **Confidencialidad**: Datos de tarjeta nunca almacenados en texto plano ni transmitidos sin necesidad.
- **Integridad**: Los montos de pago siempre validados en el servidor; el cliente no puede manipular el total.
- **Autenticidad**: JWT verificado en cada request privado; roles verificados en cada endpoint sensible.
- **No repudio**: Cada transacción tiene timestamp, referencia única e IP registrada para auditoría.
- **Responsabilidad (Accountability)**: Log de acciones del admin (qué usuario canceló qué pedido, qué cambios se hicieron al inventario).
- **Resistencia**: Rate limiting en endpoints de autenticación y pago.

**Métricas de Aceptación:**

- Datos de tarjeta: solo almacenar últimos 4 dígitos + hash bcrypt del número completo. **NUNCA CVV. NUNCA número completo.**
- `JWT_SECRET` sin valor por defecto en código — el servidor falla al arrancar si la variable de entorno está ausente
- Rate limiting: máx. 5 intentos de login por IP en 15 minutos (`express-rate-limit`)
- `100%` de endpoints de admin protegidos con `requireRole(['admin', 'staff'])` como middleware
- Montos de pago: `payment.amount` siempre calculado desde `Order.total` en backend, nunca del request del cliente
- Contraseñas: bcrypt salt = 10 (ya implementado — mantener)
- Todos los inputs de texto público sanitizados contra XSS e injection (`express-validator`)
- Headers de seguridad HTTP configurados con `helmet.js`

**Riesgos Actuales (OWASP Top 10):**

| Riesgo OWASP | Manifestación Actual | Severidad |
|---|---|---|
| A01 — Broken Access Control | Sin `PrivateRoute` en FE; sin guards de rol en rutas vendor | **CRÍTICA** |
| A02 — Cryptographic Failures | `JWT_SECRET` con fallback hardcodeado `'default-secret-key'` en `env.ts` | **ALTA** |
| A03 — Injection | Sin sanitización en campos de texto de endpoints públicos | **ALTA** |
| A05 — Security Misconfiguration | CORS probablemente permisivo; sin `helmet.js` | **MEDIA** |
| A07 — Auth Failures | Sin rate limiting en `POST /auth/login` | **ALTA** |
| A04 — Insecure Design | Monto de pago nunca validado en servidor (futuro) | **CRÍTICA** |

---

### 2.7 Mantenibilidad

> *Grado de efectividad y eficiencia con la que el producto puede ser modificado por los mantenedores previstos.*

**Sub-características aplicadas:**

- **Modularidad**: Cada feature tiene su propio controlador, ruta y servicio frontend. Sin acoplamiento cruzado.
- **Reusabilidad**: Componentes UI de shadcn/ui reutilizados en todas las interfaces nuevas. API client centralizado en `src/services/api.ts`.
- **Analizabilidad**: Estructura de carpetas predecible: `models/`, `routes/`, `controllers/`, `pages/`, `contexts/`.
- **Modificabilidad**: Cero lógica de negocio en componentes de presentación `.tsx`.
- **Capacidad de prueba**: Controladores con una única responsabilidad; servicios inyectables.

**Métricas de Aceptación:**

- `0` llamadas `fetch()` directas en componentes `.tsx` — todo pasa por `src/services/api.ts`
- `0` lógica de cálculo financiero en componentes de React — toda en backend
- Todos los nuevos modelos Mongoose con interfaces TypeScript explícitas en `backend/src/types/`
- Nuevas rutas de admin bajo el prefijo `/api/admin/*` de forma consistente
- Componentes duplicados heredados eliminados o unificados antes de agregar nuevos

**Riesgos Actuales:**

- Componentes duplicados: `Header/ModernHeader`, `Footer/ModernFooter`, `Modal/ModernModal` — introduce confusión
- `Profile.tsx` tiene `alert()` — lógica de feedback de UX en componente de presentación

---

### 2.8 Portabilidad

> *Grado de efectividad y eficiencia con el que el sistema puede ser transferido de un entorno a otro.*

**Sub-características aplicadas:**

- **Adaptabilidad**: El sistema funciona sin cambios en Linux, macOS y Windows para el entorno de desarrollo.
- **Instalabilidad**: `pnpm install` + configurar `.env` + `pnpm dev` es suficiente para levantar el frontend; equivalente en backend.
- **Sustituibilidad**: Un cambio de base de datos a nivel Mongoose no requiere cambios en la capa de presentación React.

**Métricas de Aceptación:**

- `.env.example` presente en raíz del proyecto y en `backend/` con **todas** las variables documentadas
- `README.md` actualizado con instrucciones de setup completas (frontend + backend + MongoDB)
- Sin rutas absolutas hardcodeadas en el código fuente
- Sin dependencias de sistema operativo específico en scripts de `package.json`

---

## 3. Matriz de Riesgos de Calidad

| ID | Riesgo | Probabilidad | Impacto | Prioridad | Mitigación |
|---|---|---|---|---|---|
| RQ-01 | `JWT_SECRET` usa valor por defecto en producción | Alta | Crítico | **P1** | Validar presencia en startup; lanzar excepción fatal si ausente |
| RQ-02 | Monto de pago aceptado desde el cliente sin validar | Alta | Crítico | **P1** | Siempre calcular total desde `Order` en backend antes de confirmar |
| RQ-03 | Datos de tarjeta almacenados en texto plano | Media | Crítico | **P1** | Solo guardar últimos 4 dígitos + bcrypt hash del número |
| RQ-04 | Sin rate limiting en `POST /auth/login` | Alta | Alto | **P1** | `express-rate-limit`: 5 intentos / 15 min por IP |
| RQ-05 | Rutas de admin sin verificación de rol | Alta | Crítico | **P1** | Middleware `requireRole(['admin','staff'])` en todas las rutas admin |
| RQ-06 | Carrito anónimo perdido al hacer login | Alta | Medio | **P2** | Migrar items de localStorage al servidor post-login exitoso |
| RQ-07 | Pedido confirmado aunque el pago falle | Media | Crítico | **P1** | MongoDB session para operación atómica: Payment + Order update |
| RQ-08 | XSS en campos de texto de formularios públicos | Media | Alto | **P2** | Sanitizar inputs con `express-validator` en endpoints públicos |
| RQ-09 | Admin puede acceder al carrito/pedidos de otro usuario | Media | Alto | **P2** | Siempre filtrar por `user: req.user.id` en queries de usuario |
| RQ-10 | Desbordamiento de stock por pedidos simultáneos | Baja | Medio | **P3** | Decrementar stock con `$inc: -qty` atómico en MongoDB |

---

## 4. Resumen de Conformidad ISO 25010

| Característica | Estado Actual | Meta MVP |
|---|---|---|
| Adecuación Funcional | 🔴 40% (mocks críticos) | ✅ 95% |
| Eficiencia en Rendimiento | 🟡 60% (sin paginación) | ✅ 85% |
| Compatibilidad | 🟡 70% (CORS pendiente) | ✅ 90% |
| Usabilidad | 🟡 65% (sin validaciones) | ✅ 90% |
| Fiabilidad | 🔴 50% (sin manejo de errores) | ✅ 90% |
| Seguridad | 🔴 40% (múltiples riesgos críticos) | ✅ 85% |
| Mantenibilidad | 🟡 70% (duplicados, acoplamiento) | ✅ 85% |
| Portabilidad | 🟡 65% (sin .env.example) | ✅ 85% |
