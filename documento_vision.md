# Documento de Visión del Proyecto

## Arancia — Plataforma Digital de Restaurante

---

## Información del Documento

| Propiedad   | Valor         |
| ----------- | ------------- |
| Versión     | 1.0           |
| Fecha       | 22/01/2026    |
| Estado      | Borrador      |
| Responsable | Product Owner |

## Historial de Revisiones

| Fecha      | Versión | Descripción                    | Autor         |
| ---------- | ------- | ------------------------------ | ------------- |
| 22/01/2026 | 1.0     | Creación inicial del documento | Product Owner |

---

## Tabla de Contenidos

- ✓ 1. Introducción
- ✓ 2. Posicionamiento
- ✓ 3. Stakeholders y Usuarios
- ✓ 4. Descripción Global del Producto
- ✓ 5. Características del Producto
- ✓ 6. Restricciones
- ✓ 7. Precedencia y Prioridad
- ✓ 8. Otros Requisitos
- ✓ 9. Requisitos de Documentación

---

## 1. Introducción

En el contexto de la transformación digital del sector gastronómico y la creciente demanda de experiencias de usuario omnicanal, el restaurante **Arancia** — con más de 40 años de tradición culinaria en Santa Fe — ha identificado la necesidad de desarrollar una plataforma web integral que modernice la interacción con sus clientes. Este proyecto surge como respuesta a las limitaciones de los procesos manuales tradicionales de toma de pedidos, gestión de reservaciones y organización de eventos privados, y a la demanda de una solución digital eficiente, escalable e integrada.

El presente documento de visión establece las bases estratégicas del producto, definiendo el problema a resolver, los objetivos a alcanzar y las características principales que guiarán el desarrollo. Este documento servirá como punto de referencia común para todos los stakeholders involucrados, asegurando alineación en las expectativas y prioridades del proyecto.

La visión aquí presentada es el resultado de un análisis exhaustivo de las necesidades del negocio gastronómico, los requisitos de los comensales y el personal del restaurante, las oportunidades del mercado de delivery y reservaciones online, y las capacidades técnicas disponibles mediante un stack moderno de desarrollo web.

### 1.1 Propósito

Este documento establece la visión estratégica de la plataforma digital de Arancia y define los objetivos, alcance y características principales que guiarán su desarrollo e implementación. Su propósito es alinear a todos los stakeholders sobre el problema que se está resolviendo, la solución propuesta, los beneficios esperados y los criterios de éxito del proyecto.

**Audiencia principal:**

- Product Owners y Product Managers
- Equipos de desarrollo y arquitectura técnica (Frontend React / Backend Node.js)
- Stakeholders de negocio: dueños y gerentes del restaurante Arancia
- Equipos de QA, UX/UI y documentación
- Gerentes de proyecto y Scrum Masters

### 1.2 Alcance

Este proyecto abarca el diseño, desarrollo e implementación de una plataforma web integral que digitaliza la experiencia gastronómica del restaurante Arancia, permitiendo a los comensales explorar el menú, realizar pedidos en línea, reservar mesas y solicitar cotizaciones para eventos privados.

**Áreas Afectadas:**

- Comensales y clientes del restaurante (usuarios finales)
- Personal de cocina y servicio (gestión de pedidos y reservaciones)
- Área administrativa y gerencia (reportes y métricas)
- Equipo de eventos (coordinación de eventos privados y paquetes)
- Soporte técnico y mantenimiento de la plataforma

**Problemas que Resuelve:**

1. Proceso manual de toma de pedidos que genera demoras y errores, especialmente en horas pico
2. Gestión de reservaciones vía telefónica sin visibilidad centralizada de disponibilidad y riesgo de sobreventa
3. Ausencia de un catálogo digital del menú con precios, ingredientes e imágenes actualizadas
4. Dificultad para coordinar solicitudes de eventos privados y cotizaciones de paquetes (Esencial, Premium, Elite)
5. Falta de una herramienta de contacto directo entre clientes y el restaurante

**✅ INCLUIDO en el Alcance:**

- Página de inicio (Home) con hero section, servicios destacados e historia del restaurante
- Menú digital interactivo con búsqueda por nombre/ingredientes y filtrado por categorías
- Carrito de compras con cálculo automático de subtotal, impuestos (ITBIS 18%) y total
- Sistema de pedidos en línea con dirección de envío
- Sistema de reservaciones online (fecha, hora, número de comensales, notas)
- Confirmación de reservaciones y gestión de reservaciones del usuario
- Módulo de eventos privados con paquetes (Esencial RD$2,500 / Premium RD$5,000 / Elite RD$10,000)
- Formulario de contacto y solicitud de cotización de eventos
- Galería de imágenes del restaurante
- Página "Acerca de" con historia y valores del restaurante
- Página de servicios ofrecidos
- Sistema de autenticación (registro, login) con JWT
- Perfil de usuario con edición de datos personales y cambio de contraseña
- API REST completa (auth, users, menu, reservations, cart, orders, contact, images)
- Interfaz responsive (desktop y móvil con sidebar mobile)

**❌ NO INCLUIDO (Fuera del Alcance):**

- Sistema de pagos en línea integrado (pasarela de pagos)
- Panel de administración para personal del restaurante (back-office)
- Aplicaciones móviles nativas (iOS/Android)
- Sistema de delivery con rastreo en tiempo real
- Programa de fidelización o puntos de recompensa
- Integración con plataformas de terceros (Uber Eats, PedidosYa, etc.)
- Módulos de analítica avanzada e inteligencia artificial

### 1.3 Objetivos

Los objetivos del proyecto están definidos siguiendo el marco SMART para garantizar su claridad, medibilidad y alcance realista dentro de los plazos establecidos.

**Objetivos de Negocio:**

1. **Digitalización del Menú y Pedidos**
   - Meta: Reducir el tiempo de toma de pedidos en un 40% mediante el sistema de menú digital y carrito de compras en línea
   - Métrica: Tiempo promedio desde selección del platillo hasta confirmación del pedido
   - Fecha límite: Q3 2026

2. **Optimización de Reservaciones**
   - Meta: Alcanzar que el 60% de las reservaciones se realicen a través de la plataforma web, reduciendo llamadas telefónicas
   - Métrica: Porcentaje de reservaciones online vs. telefónicas
   - Fecha límite: Q4 2026

3. **Incremento en Solicitudes de Eventos**
   - Meta: Aumentar las solicitudes de cotización de eventos privados en un 30% mediante la visibilidad de los paquetes (Esencial, Premium, Elite) en la plataforma
   - Métrica: Número de solicitudes de eventos recibidas mensualmente a través del sistema
   - Fecha límite: Q3 2026

**Objetivos Técnicos:**

1. **Alta Disponibilidad del Sistema**
   - Meta: Garantizar 99.5% de uptime del sistema
   - Métrica: Monitoreo continuo de disponibilidad mediante herramientas de observabilidad

2. **Performance y Velocidad**
   - Meta: Tiempo de respuesta promedio inferior a 2 segundos para operaciones estándar de la API REST
   - Métrica: Latencia del API medida en percentil 95

3. **Seguridad y Protección de Datos**
   - Meta: Implementar autenticación segura con JWT y hash de contraseñas con bcrypt, cumpliendo mejores prácticas de la industria
   - Métrica: Auditorías de seguridad trimestrales sin hallazgos críticos

### 1.4 Definiciones, Acrónimos y Abreviaciones

| Término/Sigla | Definición                                                                       |
| ------------- | -------------------------------------------------------------------------------- |
| MVP           | Minimum Viable Product - Producto mínimo viable con funcionalidades esenciales   |
| API           | Application Programming Interface - Interfaz de programación de aplicaciones     |
| REST          | Representational State Transfer - Estilo de arquitectura de la API               |
| JWT           | JSON Web Token - Estándar de autenticación basado en tokens                      |
| ITBIS         | Impuesto a las Transferencias de Bienes Industrializados y Servicios (18% en RD) |
| SPA           | Single Page Application - Aplicación de página única (React)                     |
| CRUD          | Create, Read, Update, Delete - Operaciones básicas de datos                      |
| SSO           | Single Sign-On - Autenticación única                                             |
| UI/UX         | User Interface / User Experience - Interfaz y experiencia de usuario             |
| NPS           | Net Promoter Score - Indicador de satisfacción y lealtad del cliente             |
| ROI           | Return on Investment - Retorno de inversión                                      |

---

## 2. Posicionamiento

### 2.1 Oportunidad de Negocio

El sector gastronómico dominicano experimenta una transformación digital acelerada, donde los restaurantes que adoptan plataformas de pedidos y reservaciones en línea obtienen ventajas competitivas significativas frente a competidores que operan únicamente de manera presencial o telefónica. Arancia, con más de 40 años de excelencia gastronómica en Santa Fe, enfrenta el desafío de modernizar sus procesos de atención al cliente que actualmente dependen de métodos manuales y llamadas telefónicas.

Las plataformas genéricas de delivery e intermediarios (como Uber Eats o PedidosYa) cobran comisiones elevadas y no reflejan la identidad de marca premium del restaurante. Esta brecha representa una oportunidad estratégica para desarrollar una plataforma propia que no solo resuelva los problemas operativos actuales, sino que también posicione a Arancia como líder en innovación digital dentro del sector gastronómico de la región.

La inversión en este proyecto se justifica por el impacto directo en indicadores clave de negocio: eliminación de comisiones a intermediarios, aumento en la eficiencia de toma de pedidos, mejor gestión de reservaciones y mayor captación de eventos privados a través de los paquetes (Esencial, Premium, Elite).

**Beneficios Clave Esperados:**

- **Eficiencia Operativa:** Reducción del 35% en tiempo de procesamiento de pedidos mediante el sistema de carrito digital con cálculo automático de impuestos (ITBIS 18%)
- **Mejora en Experiencia del Comensal:** Menú digital interactivo con búsqueda por ingredientes, imágenes de platillos y filtrado por categorías
- **Gestión de Reservaciones:** Sistema centralizado que elimina la sobredimensión y errores de las reservaciones telefónicas (soporte de 1-20 comensales por reserva)
- **Captación de Eventos:** Visibilidad de paquetes de eventos privados (20-150 personas) con solicitud de cotización integrada
- **Presencia Digital:** Sitio web moderno que refleja la identidad premium del restaurante con más de 40 años de tradición

**ROI Proyectado:**

| Concepto               | Detalle                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Inversión Total        | Según alcance final y stack tecnológico (React + Node.js + MongoDB)                         |
| Retorno Esperado       | Ahorro en comisiones a terceros + incremento en pedidos online + mayor captación de eventos |
| Tiempo de Recuperación | 18-24 meses basado en proyecciones conservadoras                                            |

### 2.2 Sentencia del Problema

| Aspecto              | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El Problema**      | Los procesos actuales de Arancia para toma de pedidos, reservaciones y coordinación de eventos dependen de métodos manuales y comunicación telefónica, lo que genera ineficiencias operativas, errores en la gestión de reservaciones (sin visibilidad centralizada de disponibilidad), y pérdida de oportunidades de negocio en eventos privados por falta de visibilidad de los paquetes ofrecidos.                                                             |
| **Afecta a**         | Comensales que desean reservar mesas o realizar pedidos de manera ágil, personal de servicio que gestiona reservaciones y pedidos manualmente, el equipo de eventos que recibe solicitudes de forma dispersa, y la gerencia que carece de datos consolidados sobre operaciones y preferencias de clientes.                                                                                                                                                        |
| **Impacto Negativo** | Pérdida de clientes potenciales que prefieren plataformas digitales para ordenar y reservar, sobrecarga del personal telefónico en horas pico, errores en reservaciones (doble-booking) que afectan la experiencia del comensal, baja tasa de conversión en solicitudes de eventos privados, y dificultad para analizar patrones de consumo y optimizar el menú.                                                                                                  |
| **Solución Exitosa** | Una plataforma web integrada que permita a los comensales explorar el menú digital con imágenes e ingredientes, agregar platillos al carrito con cálculo automático de ITBIS, realizar reservaciones online seleccionando fecha/hora/comensales, solicitar cotizaciones de eventos privados con paquetes definidos (Esencial/Premium/Elite), y contactar al restaurante directamente — todo con una experiencia de usuario premium acorde a la imagen de Arancia. |

### 2.3 Sentencia de Posición del Producto

| Elemento                           | Descripción                                                                                                                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Para:**                          | Comensales, clientes frecuentes y organizadores de eventos del restaurante Arancia                                                                                                                                |
| **Que tienen la necesidad de:**    | Explorar el menú, realizar pedidos en línea, reservar mesas y solicitar cotizaciones de eventos privados de manera digital, rápida y confiable                                                                    |
| **La Plataforma Digital Arancia:** | Es una aplicación web moderna tipo SPA (Single Page Application)                                                                                                                                                  |
| **Que ofrece:**                    | Menú digital interactivo, carrito de compras con cálculo automático de impuestos, reservaciones online, paquetes de eventos privados y comunicación directa con el restaurante                                    |
| **A diferencia de:**               | Plataformas genéricas de delivery que cobran altas comisiones y no reflejan la identidad premium del restaurante, o la gestión telefónica manual actual                                                           |
| **Nuestro producto:**              | Está diseñado específicamente para el modelo de negocio gastronómico de Arancia, refleja su identidad visual premium con más de 40 años de tradición, y evoluciona según las necesidades reales de sus comensales |

---

## 3. Descripción de Stakeholders y Usuarios

### 3.1 Resumen de Stakeholders (Interesados)

| Stakeholder                  | Rol                       | Interés                                                       | Influencia |
| ---------------------------- | ------------------------- | ------------------------------------------------------------- | ---------- |
| Propietarios del Restaurante | Sponsor Ejecutivo         | ROI del proyecto, alineación con imagen de marca              | Alta       |
| Product Owner                | Dueño de producto         | Éxito del producto, satisfacción de comensales                | Alta       |
| Tech Lead                    | Líder técnico             | Arquitectura (React + Node.js + MongoDB), calidad técnica     | Alta       |
| Gerente del Restaurante      | Líder operativo           | Adopción por parte del personal, mejora en operaciones        | Media-Alta |
| Chef Ejecutivo               | Responsable de menú       | Presentación correcta de platillos, ingredientes y categorías | Media      |
| Coordinador de Eventos       | Líder de eventos          | Flujo de solicitudes de eventos y paquetes                    | Media      |
| Equipo de TI                 | Infraestructura y soporte | Integración con sistemas, despliegue y mantenibilidad         | Media      |
| Comensales / Clientes        | Usuarios finales          | Facilidad de uso, rapidez en pedidos y reservaciones          | Media      |

### 3.2 Resumen de Usuarios

| Perfil de Usuario         | Descripción                                                                           | Necesidades                                                                           | Experiencia         |
| ------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------- |
| Comensal General          | Cliente que visita el sitio para explorar menú, hacer pedidos y reservar mesas        | Interfaz intuitiva, menú visual con imágenes e ingredientes, proceso de pedido rápido | Básica              |
| Organizador de Eventos    | Persona que busca contratar servicios de eventos privados (bodas, corporativos, etc.) | Ver paquetes (Esencial/Premium/Elite), solicitar cotización, contactar al restaurante | Básica - Intermedia |
| Usuario Registrado        | Cliente con cuenta en la plataforma                                                   | Gestión de perfil, historial de pedidos, mis reservaciones, carrito persistente       | Intermedia          |
| Administrador del Sistema | Personal técnico que gestiona la plataforma                                           | Gestión de menú, usuarios, pedidos, reservaciones vía API                             | Avanzada            |

### 3.3 Entorno de Usuario

```
Contexto de Trabajo:
├─ Ubicación: Acceso desde cualquier lugar (clientes remotos y presenciales)
├─ Dispositivos: Desktop/laptop y dispositivos móviles (diseño responsive)
├─ Conectividad: Conexión estable a internet
├─ Disponibilidad: 24/7 para consulta de menú y reservaciones
├─ Navegadores: Chrome, Firefox, Edge (versiones recientes)
├─ Frontend: React 18 SPA con React Router
└─ Moneda: Pesos Dominicanos (RD$)
```

---

## 4. Descripción Global del Producto

### 4.1 Perspectiva del Producto

- ☑ Producto Independiente con capacidad de integración
- ☐ Parte de una familia de productos
- ☑ Componente que se integra con sistemas existentes

**Descripción:**

La plataforma digital de Arancia funciona como una aplicación web independiente con arquitectura moderna de dos capas: un frontend SPA construido con **React 18 + Vite + TailwindCSS** y un backend API REST construido con **Express.js + TypeScript + MongoDB (Mongoose)**. La aplicación está diseñada para operar de forma autónoma, sirviendo como canal digital principal del restaurante para interactuar con sus clientes.

La arquitectura está basada en una API REST bien estructurada con 8 módulos de rutas (auth, users, menu, reservations, cart, orders, contact, images), lo que facilita tanto las integraciones futuras como la expansión del ecosistema.

**Integraciones Actuales/Requeridas:**

- Sistema de autenticación propio basado en JWT con hash bcrypt para contraseñas
- Gestión de imágenes mediante almacenamiento binario en MongoDB (modelo Image) con endpoint `/api/images/:id`
- API REST documentada para comunicación frontend-backend
- Variables de entorno para configuración de URLs de API y base de datos

**Componentes Técnicos del Sistema:**

| Componente    | Tecnología                   | Descripción                               |
| ------------- | ---------------------------- | ----------------------------------------- |
| Frontend      | React 18 + TypeScript + Vite | SPA con 15 páginas y 60+ componentes UI   |
| Estilos       | TailwindCSS 4 + Radix UI     | Componentes accesibles con diseño premium |
| Animaciones   | Motion (Framer Motion)       | Transiciones y micro-animaciones fluidas  |
| Backend       | Express.js + TypeScript      | API REST con 8 módulos de rutas           |
| Base de Datos | MongoDB + Mongoose           | 7 modelos con esquemas validados          |
| Autenticación | JWT + bcryptjs               | Tokens seguros y hash de contraseñas      |
| Validación    | express-validator            | Validación de datos en el servidor        |
| Gráficos      | Recharts                     | Visualización de datos y métricas         |

### 4.2 Suposiciones y Dependencias

**Supuestos Clave:**

- Los comensales del restaurante tienen acceso a dispositivos con navegadores web modernos y conexión a internet
- El restaurante cuenta con personal para gestionar los pedidos y reservaciones que ingresan a través de la plataforma
- El menú del restaurante se mantiene actualizado en la base de datos mediante seeds o una interfaz administrativa futura
- Los precios están definidos en Pesos Dominicanos (RD$) con impuesto ITBIS del 18%
- Los stakeholders estarán disponibles para sesiones de revisión y feedback cada 2 semanas
- La infraestructura de hosting soportará el volumen esperado de tráfico

**Dependencias Externas:**

| Dependencia           | Descripción                                                                           | Criticidad | Estado                                | Responsable         |
| --------------------- | ------------------------------------------------------------------------------------- | ---------- | ------------------------------------- | ------------------- |
| MongoDB Atlas / Local | Base de datos para almacenamiento de usuarios, menú, pedidos, reservaciones           | Crítica    | Disponible                            | Equipo de TI        |
| Hosting/Cloud         | Ambiente de desarrollo, staging y producción para frontend (Vite) y backend (Express) | Crítica    | Por definir                           | Equipo de TI        |
| Imágenes de Platillos | Fotografías profesionales de los platillos del menú                                   | Alta       | En proceso (usando Unsplash temporal) | Equipo de Marketing |
| Diseño UX/UI          | Diseño basado en Figma (Rediseño moderno de app)                                      | Alta       | Implementado                          | Design Team         |
| Dominio y SSL         | Dominio web y certificado HTTPS                                                       | Alta       | Pendiente                             | Equipo de TI        |

### 4.3 Costo y Precio

| Modelo de Negocio | Detalles                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Inversión Inicial | Desarrollo del frontend React, backend Node.js, base de datos MongoDB, diseño UI/UX                               |
| Costos Operativos | Hosting cloud (frontend + backend + MongoDB), mantenimiento y evolución continua                                  |
| Ahorros Esperados | Eliminación de comisiones a plataformas de delivery de terceros, reducción de tiempo en reservaciones telefónicas |
| ROI Esperado      | Retorno positivo proyectado en 18-24 meses post-implementación                                                    |

---

## 5. Características del Producto

### Funcionalidades Principales

| #   | Característica            | Descripción                                                                                                                                                     | Beneficio                                  | Prioridad |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------- |
| 1   | Menú Digital Interactivo  | Catálogo de platillos con imágenes, precios (RD$), ingredientes, búsqueda y filtrado por categorías                                                             | Experiencia de exploración visual del menú | Alta      |
| 2   | Carrito de Compras        | Sistema de carrito con agregar/eliminar items, actualizar cantidades, cálculo automático de subtotal, ITBIS (18%) y total                                       | Proceso de pedido ágil y sin errores       | Alta      |
| 3   | Sistema de Pedidos Online | Flujo completo de checkout con dirección de envío, confirmación de pedido y seguimiento de estados (cart → pending → confirmed → preparing → ready → delivered) | Ventas digitales y trazabilidad            | Alta      |
| 4   | Autenticación y Perfiles  | Registro, login con JWT, perfil de usuario editable, cambio de contraseña, tokens seguros con bcrypt                                                            | Seguridad y personalización                | Alta      |
| 5   | Reservaciones Online      | Formulario de reservación con fecha, hora, número de comensales (1-20), notas opcionales, ubicación y estados (pending/confirmed/cancelled/completed)           | Gestión eficiente de mesas                 | Alta      |
| 6   | Mis Reservaciones         | Panel del usuario para ver historial, estado de reservaciones y cancelar reservaciones activas                                                                  | Autogestión del comensal                   | Alta      |
| 7   | Eventos Privados          | Presentación de tipos de eventos (Social, Corporativo, Privado) y paquetes (Esencial RD$2,500 / Premium RD$5,000 / Elite RD$10,000) con solicitud de cotización | Captación de eventos y ventas              | Media     |
| 8   | Formulario de Contacto    | Envío de mensajes con nombre, email, teléfono y mensaje; estados de lectura (unread/read/responded)                                                             | Comunicación directa con clientes          | Media     |
| 9   | Galería del Restaurante   | Exhibición visual de imágenes del restaurante, ambientes y platillos                                                                                            | Atractivo visual y marketing               | Media     |
| 10  | Gestión de Imágenes       | Almacenamiento y servicio de imágenes binarias en MongoDB con endpoint dedicado /api/images/:id                                                                 | Independencia de servicios externos        | Baja      |

### Features Checklist:

- ☐ Menú Digital con Búsqueda y Filtros por Categoría
- ☐ Carrito de Compras con Cálculo de ITBIS
- ☐ Sistema de Pedidos Online con Checkout
- ☐ Autenticación JWT y Perfiles de Usuario
- ☐ Reservaciones Online (1-20 comensales)
- ☐ Gestión de Mis Reservaciones
- ☐ Eventos Privados con Paquetes
- ☐ Formulario de Contacto y Cotización de Eventos
- ☐ Galería de Imágenes
- ☐ Almacenamiento de Imágenes en MongoDB

---

## 6. Restricciones

Las siguientes restricciones son consideraciones críticas y no negociables que deben respetarse durante todo el ciclo de vida del proyecto.

### Limitaciones de Diseño y Desarrollo

| Tipo        | Restricción                                                | Impacto | Justificación                                              |
| ----------- | ---------------------------------------------------------- | ------- | ---------------------------------------------------------- |
| Tecnológica | Frontend: React 18 + TypeScript + Vite + TailwindCSS 4     | Alto    | Stack moderno con Figma design token, componentes Radix UI |
| Tecnológica | Backend: Express.js + TypeScript + MongoDB/Mongoose        | Alto    | API REST escalable con validación de datos                 |
| Tecnológica | Autenticación: JWT + bcryptjs (sin SSO externo por ahora)  | Alto    | Seguridad de acceso y protección de contraseñas            |
| Normativa   | Manejo correcto del ITBIS (18%) en cálculos de pedidos     | Crítico | Cumplimiento fiscal dominicano                             |
| Normativa   | Protección de datos personales de los comensales           | Crítico | Marco legal vigente de protección de datos                 |
| Presupuesto | Inversión limitada según presupuesto aprobado              | Alto    | Restricción financiera de la organización                  |
| Tiempo      | Lanzamiento del MVP en ventana de tiempo acordada          | Alto    | Alineación con objetivos estratégicos                      |
| Recursos    | Equipo de desarrollo de tamaño limitado (3-5 personas)     | Medio   | Disponibilidad actual de talento técnico                   |
| UX/UI       | Diseño responsive (desktop + móvil) basado en diseño Figma | Medio   | Accesibilidad desde cualquier dispositivo                  |
| Moneda      | Todos los precios en Pesos Dominicanos (RD$)               | Alto    | Mercado objetivo: República Dominicana                     |

### Checklist de Restricciones Identificadas

- ☐ Stack tecnológico obligatorio definido (React + Express + MongoDB)
- ☐ Cumplimiento fiscal (ITBIS 18%) implementado
- ☐ Limitaciones presupuestarias claras
- ☐ Fechas límite establecidas
- ☐ Restricciones de equipo documentadas

---

## 7. Precedencia y Prioridad

### MVP (Producto Mínimo Viable)

#### Fase 1 — CRÍTICA (v1.0 - MVP)

| Feature                                             | Estado      | Responsable     | Fecha Estimada |
| --------------------------------------------------- | ----------- | --------------- | -------------- |
| ☐ Página Home con hero, servicios e historia        | Por iniciar | Frontend Team   | Sprint 1-2     |
| ☐ Menú digital con búsqueda, filtros y categorías   | Por iniciar | Full Stack Team | Sprint 2-3     |
| ☐ Sistema de autenticación (registro/login con JWT) | Por iniciar | Backend Team    | Sprint 1-2     |
| ☐ Carrito de compras con cálculo de ITBIS           | Por iniciar | Full Stack Team | Sprint 3-4     |
| ☐ Checkout y creación de pedidos                    | Por iniciar | Full Stack Team | Sprint 4-5     |
| ☐ Reservaciones online                              | Por iniciar | Full Stack Team | Sprint 3-5     |
| ☐ API REST completa (8 módulos de rutas)            | Por iniciar | Backend Team    | Sprint 1-5     |

#### Fase 2 — IMPORTANTE (v1.1)

- ☐ Módulo de eventos privados con paquetes (Esencial/Premium/Elite)
- ☐ Formulario de contacto y solicitud de cotización de eventos
- ☐ Galería del restaurante
- ☐ Página "Acerca de" con historia de Arancia
- ☐ Página de servicios
- ☐ Perfil de usuario con edición de datos y cambio de contraseña

#### Fase 3 — DESEABLE (v1.2+)

- ☐ Panel de administración (back-office) para gestión del restaurante
- ☐ Integración con pasarela de pagos (tarjeta de crédito/débito)
- ☐ Sistema de notificaciones por email (confirmación de pedidos y reservaciones)
- ☐ Dashboard con métricas y KPIs para la gerencia
- ☐ Aplicación móvil nativa (React Native)
- ☐ Sistema de delivery con rastreo en tiempo real
- ☐ Programa de fidelización y recompensas
- ☐ Integración con herramientas de BI y analítica

### Matriz de Priorización

| Feature                    | Valor | Esfuerzo | Prioridad |
| -------------------------- | ----- | -------- | --------- |
| Menú digital interactivo   | Alto  | Medio    | 1         |
| Autenticación y perfiles   | Alto  | Medio    | 2         |
| Carrito de compras + ITBIS | Alto  | Medio    | 3         |
| Reservaciones online       | Alto  | Medio    | 4         |
| Checkout y pedidos         | Alto  | Alto     | 5         |
| API REST backend           | Alto  | Alto     | 6         |
| Eventos y paquetes         | Medio | Medio    | 7         |
| Contacto y cotizaciones    | Medio | Bajo     | 8         |
| Galería                    | Medio | Bajo     | 9         |
| Panel de administración    | Alto  | Alto     | 10        |

---

## 8. Otros Requisitos del Producto

### Requisitos No Funcionales

| Categoría      | Requisito                                           | Métrica                                     | Estado |
| -------------- | --------------------------------------------------- | ------------------------------------------- | ------ |
| Desempeño      | Tiempo de respuesta de API REST                     | < 2 segundos (P95)                          | ☐      |
| Desempeño      | Tiempo de carga inicial del SPA (React + Vite)      | < 3 segundos                                | ☐      |
| Seguridad      | Encriptación de datos en tránsito                   | HTTPS/TLS 1.3                               | ☐      |
| Seguridad      | Hash de contraseñas                                 | bcrypt con salt rounds                      | ☐      |
| Seguridad      | Autenticación y autorización                        | JWT + middleware de auth                    | ☐      |
| Seguridad      | Protección de rutas sensibles del API               | Bearer Token + validación                   | ☐      |
| Usabilidad     | Compatibilidad con navegadores                      | Chrome, Firefox, Edge (últimas 2 versiones) | ☐      |
| Usabilidad     | Diseño responsive                                   | Desktop (1920x1080) + Mobile + Tablet       | ☐      |
| Usabilidad     | Interfaz en idioma español                          | 100% de la UI en español                    | ☐      |
| Disponibilidad | Uptime del sistema                                  | 99.5% mensual                               | ☐      |
| Disponibilidad | Ventana de mantenimiento                            | < 4 horas mensuales                         | ☐      |
| Escalabilidad  | Usuarios concurrentes                               | 100-500 usuarios simultáneos                | ☐      |
| Escalabilidad  | Crecimiento de datos (menú, pedidos, reservaciones) | Soporte para 3 años de histórico            | ☐      |
| Mantenibilidad | Cobertura de tests                                  | > 70% código crítico (backend)              | ☐      |
| Mantenibilidad | Documentación técnica                               | API docs + esquema de base de datos         | ☐      |

### Requisitos de Calidad

```
┌─ Pruebas
│  ├─ ☐ Unit Testing (>80% cobertura en modelos y controladores)
│  ├─ ☐ Integration Testing (endpoints API)
│  └─ ☐ Pruebas de Carga (100-500 usuarios concurrentes)
├─ Documentación
│  ├─ ☐ API Documentation (endpoints REST)
│  ├─ ☐ Database Schema (Mermaid ER Diagram — disponible)
│  └─ ☐ Código documentado (TypeScript con tipos explícitos)
└─ Soporte
   ├─ ☐ SLA definido
   └─ ☐ Centro de ayuda / FAQ
```

---

## 9. Requisitos de Documentación

### Documentos a Entregar

| Documento               | Descripción                                                                                                                 | Responsable      | Status                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------- |
| Manual de Usuario       | Guía paso a paso para comensales: cómo navegar el menú, hacer pedidos, reservar y solicitar eventos                         | Technical Writer | ☐                      |
| Manual de Administrador | Guía para administradores: gestión de menú, pedidos, reservaciones y usuarios vía API                                       | Technical Writer | ☐                      |
| Documentación Técnica   | Arquitectura React + Express + MongoDB, decisiones técnicas y stack                                                         | Tech Lead        | ☐                      |
| API Reference           | Especificación completa de los 8 módulos de endpoints REST (auth, users, menu, reservations, cart, orders, contact, images) | Backend Team     | ☐                      |
| Database Schema         | Diagrama ER de las 7 colecciones MongoDB con relaciones y enums                                                             | Backend Team     | ☑ (database_schema.md) |
| Guía de Instalación     | Instrucciones de deployment: variables de entorno, `pnpm install`, seeds del menú                                           | DevOps Team      | ☐                      |
| Guía de Integración     | Cómo integrar con sistemas externos mediante la API REST                                                                    | Backend Team     | ☐                      |
| Plan de Capacitación    | Programa de training para personal del restaurante                                                                          | Product Owner    | ☐                      |
| FAQ y Troubleshooting   | Preguntas frecuentes y solución de problemas comunes                                                                        | Support Team     | ☐                      |

### Checklist de Documentación

- ☐ Guías de usuario (comensales y administradores)
- ☐ Material de capacitación para personal del restaurante
- ☑ Documentación de esquema de base de datos (database_schema.md)
- ☐ Documentación de API REST
- ☐ Procedimientos de soporte
- ☐ Release notes
- ☐ Políticas de privacidad y términos de uso

---

## Aprobaciones

| Rol                              | Nombre      | Firma    | Fecha     |
| -------------------------------- | ----------- | -------- | --------- |
| Product Owner                    | Por asignar | \_\_\_\_ | Pendiente |
| Sponsor Ejecutivo (Propietarios) | Por asignar | \_\_\_\_ | Pendiente |
| Tech Lead                        | Por asignar | \_\_\_\_ | Pendiente |
| Gerente del Restaurante          | Por asignar | \_\_\_\_ | Pendiente |

---

## Información de Contacto

- **Product Owner:** productowner@bobtoronja.com
- **Tech Lead:** techlead@bobtoronja.com
- **Project Manager:** pm@bobtoronja.com
- **Restaurante:** Arancia — Santa Fe

---

> **Documento Confidencial:** Este documento contiene información propietaria y confidencial. Su distribución está restringida al equipo del proyecto y stakeholders autorizados. Prohibida su reproducción total o parcial sin autorización expresa.

> © 2026 Arancia — Todos los derechos reservados
