Entregable Primer

Parcial

--Integrantes--

## Pedro Antonio García Encarnación - A

## Roberto Daniel Marte Tejada - A

## Cristofer De La Mota Alberto - A

## Carlos Yael De Los Santos - A

## Andy José Peña - A

## Marcos Colón Rosario - A 00120607


**Historial de Versiones
Fecha Versión Descripción Autor**
30 / 01 / 2026 0.1 Propuesta Inicial del Documento
Visión

Pedro García
Encarnación
Roberto Daniel Marte
Tejada
Cristofer De La Mota
Carlos De Los Santos
Andy José Peña
Marcos Colón Rosario
02 / 02 / 2026 0.2 Se incluyó la definición del
producto y su contexto, junto con
el análisis de interesados y el
posicionamiento. Además, se
agregaron las funcionalidades
principales, el dashboard y los
enlaces de referencia.

Pedro García
Encarnación
Roberto Daniel Marte
Tejada
Cristofer De La Mota
Carlos De Los Santos
Andy José Peña
Marcos Colón Rosario
05 / 02 / 2026 0.3 Se documentó la visión general
del sistema y las suposiciones del
negocio. También se incorporó la
especificación funcional, vistas
del sistema y el repositorio del
proyecto.

Pedro García
Encarnación
Roberto Daniel Marte
Tejada
Cristofer De La Mota
Carlos De Los Santos
Andy José Peña
Marcos Colón Rosario
10 / 02 / 2026 0.4 Revisión final Pedro García
Encarnación
Roberto Daniel Marte
Tejada
Cristofer De La Mota
Carlos De Los Santos
Andy José Peña
Marcos Colón Rosario
10 / 02 / 2026 1.0 Versión final Pedro García
Encarnación
Roberto Daniel Marte
Tejada
Cristofer De La Mota
Carlos De Los Santos
Andy José Peña
Marcos Colón Rosario


## índice

- --Documento Visión--
- -- Propósito..................................................................................................................................................
- -- Alcance
- -- Objetivos
- -- Definiciones y Abreviaciones
   - Posicionamiento
- -- Oportunidad de Negocio
- -- Sentencia del Problema
- -- Sentencia de Posición del Producto
   - Descripción de Interesados y Usuarios
- -- Resumen de Interesados
- -- Resumen de Usuarios
   - Descripción General del Producto
- -- Perspectiva del Producto
   - Diagrama Entidad-Relación (ER) del Sistema
   - Esquema General del Sistema
   - Suposiciones y Dependencias
- -- Oportunidad de Negocio
   - Funcionalidades del Producto
- -- Funcionalidades Principales
   - --DASHBOARD--
- -- Vista de Menú--
   - Links
- -- Link del Repositorio


## --Documento Visión--

```
Plataforma Digital de Restaurante
Arancia
```
Arancia, es un restaurante de reciente creación ubicado en República Dominicana. Desde su concepción,
incorporará una plataforma web como parte central de su operación, con el objetivo de diferenciarse de
los demás restaurantes de la zona que no cuentan con herramientas digitales propias.

Este documento define el problema que se busca resolver, los objetivos del proyecto, el alcance de la
solución y las funcionalidades que debe incluir la plataforma. Y servirá como referencia para todas las
partes involucradas en el desarrollo. El contenido se basa en un estudio rápido y leve del mercado
gastronómico local, la identificación de carencias en los servicios digitales de restaurantes de la zona, y
las capacidades del equipo de desarrollo.

## -- Propósito..................................................................................................................................................

Este documento define qué se va a construir, por qué y para quién. Su función es que todas las partes
involucradas tengan una comprensión común del proyecto antes y durante el desarrollo.

**Audiencia principal:**

```
o Responsables del producto y gestión del proyecto
o Equipo de desarrollo (interfaz de usuario y servidor)
o Fundadores del restaurante Arancia
o Equipo de pruebas, diseño y documentación
```
## -- Alcance

El proyecto comprende el diseño, desarrollo y puesta en marcha de una plataforma web para el
restaurante Arancia. La plataforma permite a los clientes consultar el menú, realizar pedidos en línea,
reservar mesas y solicitar cotizaciones para eventos privados.

**Áreas Afectadas:**

```
o Comensales y clientes del restaurante (usuarios finales)
o Personal de cocina y servicio (gestión de pedidos y reservaciones)
o Área administrativa y gerencia (reportes y métricas)
o Equipo de eventos (coordinación de eventos privados y paquetes)
```

```
o Soporte técnico y mantenimiento de la plataforma
```
**Problemas que Resuelve:**

1. Los restaurantes de la zona no cuentan con sistemas de pedidos en línea y dependen de procesos
    manuales con errores frecuentes
2. No existe disponibilidad visible de mesas para reservar en línea en los restaurantes locales
3. Los restaurantes de la competencia no ofrecen un catálogo digital de su menú con precios,
    ingredientes e imágenes
4. La coordinación de eventos privados y cotizaciones se realiza de forma desorganizada en el
    sector
5. No hay un canal digital directo entre los restaurantes de la zona y sus clientes

**INCLUIDO en el Alcance:**

```
o Página de inicio con presentación del restaurante y servicios destacados
o Menú digital con búsqueda por nombre o ingredientes y filtrado por categorías
o Carrito de compras con cálculo automático de subtotal, impuestos (ITBIS 18%) y total
o Sistema de pedidos en línea con dirección de envío
o Sistema de reservaciones en línea (fecha, hora, número de comensales, notas)
o Confirmación y gestión de reservaciones por parte del usuario
o Módulo de eventos privados con paquetes (Esencial RD 2 , 500 /𝑃𝑟𝑒𝑚𝑖𝑢𝑚𝑅𝐷5,000 / Elite
RD$10,000)
o Formulario de contacto y solicitud de cotización de eventos
o Galería de imágenes del restaurante
o Página "Acerca de" con visión, misión y valores del restaurante
o Página de servicios ofrecidos
o Registro e inicio de sesión de usuarios
o Perfil de usuario con edición de datos personales y cambio de contraseña
o Servidor de datos con 8 módulos (autenticación, usuarios, menú, reservaciones, carrito,
pedidos, contacto, imágenes)
o Diseño adaptable a computadoras y dispositivos móviles
o Panel de administración interno para el personal del restaurante
```
**NO INCLUIDO (Fuera del Alcance):**

```
o Pagos en línea con tarjeta
o Aplicaciones móviles para iOS o Android
o Rastreo de entregas en tiempo real
o Programa de puntos o recompensas
o Conexión con plataformas de delivery externas (Uber Eats, PedidosYa, etc.)
```

```
o Módulos de análisis de datos avanzado
```
## -- Objetivos

Los objetivos del proyecto fueron definidos y planeados de forma clara y medible dentro de los plazos
de este periodo académico.

**Objetivos de Negocio:**

1. **Digitalización del Menú y Pedidos**

```
o Meta: Establecer el sistema de menú digital y carrito de compras en línea como canal
principal de pedidos desde la apertura del restaurante
o Métrica: Porcentaje de pedidos realizados a través de la plataforma vs. pedidos manuales
o Fecha límite: Q3 2026
```
2. **Optimización de Reservaciones**

```
o Meta: Lograr que el 80% de las reservaciones se realicen a través de la plataforma web desde
el lanzamiento, estableciendo el canal digital como vía principal
o Métrica: Porcentaje de reservaciones online vs. otros canales
o Fecha límite: Q4 2026
```
3. **Captación de Eventos desde el Lanzamiento**

```
o Meta: Captar al menos 10 solicitudes de cotización de eventos privados mensuales mediante
la visibilidad de los paquetes (Esencial, Premium, Elite) en la plataforma desde el primer mes
de operación
o Métrica: Número de solicitudes de eventos recibidas mensualmente a través del sistema
o Fecha límite: Q3 2026
```
**Objetivos Técnicos:**

1. **Disponibilidad del Sistema**

```
o Meta: Que la plataforma esté disponible el 99.5% del tiempo
o Métrica: Seguimiento continuo del estado del sistema
```
2. **Velocidad de Respuesta**

```
o Meta: Que cualquier acción del usuario en la plataforma responda en menos de 2 segundos
o Métrica: Tiempo de respuesta promedio del servidor
```

3. **Seguridad y Protección de Datos**

```
o Meta: Proteger el acceso de usuarios y sus contraseñas con métodos seguros de la industria
o Métrica: Revisiones de seguridad cada tres meses sin problemas graves
```
## -- Definiciones y Abreviaciones

```
o ITBIS: Impuesto a las Transferencias de Bienes Industrializados y Servicios (18% en RD)
o RD$: Pesos Dominicanos, moneda oficial de República Dominicana
o Interfaz: La parte del sistema que el usuario ve y con la que interactúa (las páginas web)
o Servidor: La parte del sistema que procesa los datos y la lógica del negocio (no visible al
usuario)
o Base de datos: Donde se almacena toda la información del sistema (usuarios, menú,
pedidos, etc.)
o Sprint: Período de trabajo de 2 semanas donde se desarrollan funcionalidades específicas
```

### Posicionamiento

## -- Oportunidad de Negocio

La mayoría de los restaurantes en República Dominicana operan sin herramientas digitales propias. Los
pedidos se toman de forma manual, las reservaciones se gestionan por teléfono y no existe un canal
directo en línea entre el restaurante y sus clientes. Arancia se funda con una plataforma web propia
desde el primer día de operación, lo que lo posiciona de forma distinta en el mercado local.

Las plataformas de entrega de terceros cobran comisiones elevadas y no representan la imagen del
restaurante. Con una plataforma propia, Arancia opera sin depender de intermediarios y controla
directamente la relación con sus clientes.

La inversión se justifica por los siguientes factores: independencia de comisiones a terceros, operación
digital desde la apertura, gestión ordenada de reservaciones y captación de eventos privados mediante
los paquetes ofrecidos (Esencial, Premium, Elite).

**Beneficios Esperados:**

```
o Operación eficiente: Pedidos y cálculo de impuestos (ITBIS 18%) de forma automática desde el
primer día, sin depender de procesos manuales
o Mejor experiencia para el cliente: Menú con imágenes, búsqueda por ingredientes y filtrado
por categorías disponible en línea
o Reservaciones ordenadas: Sistema que muestra la disponibilidad real y evita errores de reservas
duplicadas (1-20 comensales por reserva)
o Captación de eventos: Paquetes de eventos privados (20-150 personas) visibles en la plataforma
con solicitud de cotización incluida
o Presencia en línea: Sitio web propio que presenta al restaurante y lo diferencia de la
competencia local
```
## -- Sentencia del Problema

**_El Problema_****.** Los restaurantes de la zona dependen de métodos manuales y llamadas telefónicas para
tomar pedidos, gestionar reservaciones y coordinar eventos. Esto genera errores, pérdida de clientes y
oportunidades desaprovechadas. Arancia necesita una plataforma digital desde su apertura para no caer
en los mismos problemas.

**_Afecta a._** Clientes de la zona que no tienen forma de reservar mesas o hacer pedidos en línea. El equipo
de Arancia, que necesita herramientas digitales para operar de forma ordenada. Los fundadores, que
requieren información sobre la operación y las preferencias de los clientes desde el inicio.


**_Impacto Negativo._** Sin la plataforma, Arancia operaría igual que los demás restaurantes de la zona: con
procesos manuales, errores en reservaciones, baja captación de eventos y sin datos para tomar decisiones
sobre el menú y la operación.

**_Solución Exitosa._** Una plataforma web que desde la apertura del restaurante permita a los clientes ver el
menú con imágenes e ingredientes, agregar platillos al carrito con cálculo automático de ITBIS, reservar
mesas seleccionando fecha, hora y comensales, solicitar cotizaciones de eventos privados
(Esencial/Premium/Elite) y contactar al restaurante directamente.

## -- Sentencia de Posición del Producto

**_Para:_** Clientes y organizadores de eventos que buscan un restaurante con servicios digitales en
República Dominicana.

**_Que tienen la necesidad de:_** Consultar el menú, hacer pedidos en línea, reservar mesas y solicitar
cotizaciones de eventos de forma rápida y confiable.

**_La Plataforma Digital Arancia:_** Es una aplicación web de página única.

**_Que ofrece:_** Menú digital, carrito de compras con cálculo automático de impuestos, reservaciones en
línea, paquetes de eventos privados y contacto directo con el restaurante.

**_A diferencia de:_** Restaurantes que dependen de procesos manuales y telefónicos, y plataformas de
entrega de terceros que cobran comisiones altas y no representan la imagen del restaurante.

**_Nuestro producto:_** Fue construido desde el inicio para Arancia y se adapta a las necesidades reales de
sus clientes.


### Descripción de Interesados y Usuarios

## -- Resumen de Interesados

1. **Fundadores del Restaurante** -- Patrocinador (Influencia alta)
    - Interés: Retorno de inversión, construcción de imagen del restaurante
2. **Responsable de Producto** -- Dueño de producto (Influencia alta)
    - Interés: Éxito del producto, satisfacción de los clientes
3. **Líder Técnico** -- Líder de desarrollo (Influencia alta)
    - Interés: Calidad de la solución y decisiones de construcción
4. **Gerente del Restaurante** -- Líder operativo (Influencia media-alta)
    - Interés: Que el personal use la plataforma, operación ordenada desde el inicio
5. **Chef Ejecutivo** -- Responsable de menú (Influencia media)
    - Interés: Que los platillos, ingredientes y categorías se muestren correctamente
6. **Coordinador de Eventos** -- Líder de eventos (Influencia media)
    - Interés: Recepción ordenada de solicitudes de eventos y paquetes
7. **Equipo Técnico** -- Soporte e infraestructura (Influencia media)
    - Interés: Funcionamiento continuo del sistema
8. **Clientes** -- Usuarios finales (Influencia media)
    - Interés: Facilidad de uso, rapidez en pedidos y reservaciones

## -- Resumen de Usuarios

**1. Cliente General (Experiencia básica)**
    - **Descripción:** Persona que visita el sitio para ver el menú, hacer pedidos y reservar mesas
    - **Necesidades:** Diseño fácil de usar, menú con imágenes e ingredientes, pedido rápido
**2. Organizador de Eventos (Experiencia básica - intermedia)**
    - **Descripción:** Persona que busca contratar servicios de eventos privados (bodas,
       corporativos)
    - **Necesidades:** Ver paquetes (Esencial/Premium/Elite), solicitar cotización, contactar al
       restaurante
    -


**3. Usuario con Cuenta (Experiencia intermedia)**
    - **Descripción:** Cliente registrado en la plataforma
    - **Necesidades:** Perfil editable, historial de pedidos, ver sus reservaciones
**4. Administrador del Sistema (Experiencia avanzada)**
    - **Descripción:** Personal técnico que gestiona la plataforma
    - **Necesidades:** Gestión de menú, usuarios, pedidos y reservaciones

### Descripción General del Producto

## -- Perspectiva del Producto

```
☑ Producto Independiente con capacidad de integración
☐ Parte de una familia de productos
☑ Componente que se integra con sistemas existentes
```
**Descripción:**

La plataforma de Arancia es una aplicación web que opera de forma independiente. Está compuesta por
dos partes: la interfaz que ve el usuario (construida con React 18, Vite y TailwindCSS) y el servidor que
procesa los datos (construido con Express.js, TypeScript y MongoDB). Es el canal digital principal del
restaurante.

El servidor está organizado en 8 módulos (autenticación, usuarios, menú, reservaciones, carrito, pedidos,
contacto, imágenes), lo que permite agregar funcionalidades en el futuro sin afectar las existentes.

**Funciones de Integración:**

```
o Sistema propio de registro e inicio de sesión con contraseñas protegidas
o Almacenamiento de imágenes directamente en la base de datos
o Comunicación documentada entre la interfaz y el servidor
o Configuración separada por ambiente (desarrollo, pruebas, producción)
```
**Componentes Técnicos del Sistema:**

```
o Interfaz (React 18 + TypeScript + Vite): 15 páginas y más de 60 elementos de interfaz
o Estilos (TailwindCSS 4 + Radix UI): Diseño visual accesible y profesional
o Animaciones (Motion / Framer Motion): Transiciones y movimientos en la interfaz
o Servidor (Express.js + TypeScript): 8 módulos de datos y lógica de negocio
o Base de Datos (MongoDB + Mongoose): 7 colecciones de datos con validaciones
o Inicio de sesión (JWT + bcryptjs): Acceso seguro y contraseñas protegidas
```

o Validación (express-validator): Verificación de datos antes de guardarlos
o Gráficos (Recharts): Visualización de datos y métricas


### Diagrama Entidad-Relación (ER) del Sistema


### Esquema General del Sistema


### Suposiciones y Dependencias

## -- Oportunidad de Negocio

**Supuestos:**

```
o Los clientes del restaurante tienen acceso a internet y a un navegador web actualizado
o El restaurante cuenta con personal para atender los pedidos y reservaciones que llegan por la
plataforma
o El menú se carga en la base de datos desde el inicio y se mantendrá actualizado mediante un
panel administrativo futuro
o Los precios están en Pesos Dominicanos (RD$) con ITBIS del 18%
o Los involucrados en el proyecto estarán disponibles para revisiones cada 2 semanas
o El servidor contratado soportará la cantidad esperada de usuarios
```
**Dependencias Externas:**

1. **Base de datos** -- Criticidad crítica -- Estado: Disponible -- Responsable: Desarrolladores que
    hacen de Equipo Técnico
       - Almacenamiento de usuarios, menú, pedidos y reservaciones (MongoDB)
2. **Servidor de hospedaje** -- Criticidad crítica -- Estado: Por definir -- Responsable:
    Desarrolladores que hacen de Equipo Técnico
       - Donde se ejecutan la interfaz y el servidor del sistema
3. **Imágenes de Platillos** -- Criticidad alta -- Estado: En proceso (usando imágenes temporales) --
    Responsable: Desarrollador que hace de Equipo de Diseño
       - Fotografías profesionales de los platillos del menú
4. **Diseño de Interfaz** -- Criticidad alta -- Estado: Completado -- Responsable: Desarrollador que
    hace de Equipo de Diseño
       - Diseño visual de todas las pantallas de la plataforma
5. **Dominio y Certificado** -- Criticidad alta -- Estado: Pendiente -- Responsable: Equipo Técnico
    - Dirección web del restaurante y certificado de seguridad


### Funcionalidades del Producto

## -- Funcionalidades Principales

1. **Menú Digital** (Prioridad alta)
    - Descripción: Catálogo de platillos con imágenes, precios (RD$), ingredientes, búsqueda y
       filtrado por categorías
    - Beneficio: El cliente ve el menú completo en línea
2. **Carrito de Compras** (Prioridad alta)
    - Descripción: Agregar y quitar platillos, actualizar cantidades, cálculo automático de
       subtotal, ITBIS (18%) y total
    - Beneficio: Pedido rápido y sin errores de cálculo
3. **Pedidos en Línea** (Prioridad alta)
    - Descripción: Proceso completo de pedido con dirección de envío, confirmación y
       seguimiento de estados
    - Beneficio: Ventas digitales con seguimiento
4. **Registro y Perfiles** (Prioridad alta)
    - Descripción: Registro, inicio de sesión, perfil editable y cambio de contraseña
    - Beneficio: Seguridad y datos personalizados
5. **Reservaciones en Línea** (Prioridad alta)
    - Descripción: Formulario con fecha, hora, número de comensales (1-20), notas opcionales
       y estados de la reservación
    - Beneficio: Gestión ordenada de mesas
6. **Mis Reservaciones** (Prioridad alta)
    - Descripción: Sección del usuario para ver el historial, estado y cancelar reservaciones
       activas
    - Beneficio: El cliente gestiona sus propias reservas
7. **Eventos Privados** (Prioridad media)
    - Descripción: Tipos de eventos (Social, Corporativo, Privado) y paquetes (Esencial
       RD 2 , 500 /𝑃𝑟𝑒𝑚𝑖𝑢𝑚𝑅𝐷5,000 / Elite RD$10,000) con solicitud de cotización
    - Beneficio: Captación de eventos y ventas
8. **Formulario de Contacto** (Prioridad media)
    - Descripción: Envío de mensajes con nombre, correo, teléfono y mensaje


- Beneficio: Comunicación directa con los clientes
9. **Galería del Restaurante** (Prioridad media)
- Descripción: Imágenes del restaurante, ambientes y platillos
- Beneficio: Presentación visual del restaurante
10. **Gestión de Imágenes** (Prioridad baja)
- Descripción: Almacenamiento de imágenes directamente en la base de datos del sistema
- Beneficio: Sin dependencia de servicios externos
**Lista de Funcionalidades:**

```
☐ Menú digital con búsqueda y filtros por categoría
☐ Carrito de compras con cálculo de ITBIS
☐ Pedidos en línea con proceso completo
☐ Registro, inicio de sesión y perfiles de usuario
☐ Reservaciones en línea (1-20 comensales)
☐ Gestión de reservaciones del usuario
☐ Eventos privados con paquetes
☐ Formulario de contacto y cotización de eventos
☐ Galería de imágenes
☐ Almacenamiento de imágenes en la base de datos
```

### --Vista de Dashboard --

### Capturas del diseño deseado

### --DASHBOARD--





## -- Vista de Menú--







### --Vista de Servicios--




#### 31

```
Diseño-Web
ISO300
```
### Links

## -- Link del Repositorio

https://github.com/pgarciaunapec/Restaurant01


