# US-13 — Admin: Gestión de Mesas del Salón

**Feature:** [FEAT-11 — Admin — Mesas y Cuentas](../features/FEAT-11_Admin_Mesas_y_Cuentas.md)
**Épica:** EPIC-04 — Panel de Administración

---

## Definición

**Como** mesero o administrador,
**quiero** ver el estado actual de todas las mesas del salón en un panel visual,
**para** saber rápidamente cuáles están disponibles, ocupadas o reservadas sin tener que recorrer el salón.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Gestión Visual de Mesas en el Admin Panel

  Scenario: Vista de planta del salón
    Given estoy en /admin/tables
    When la página carga
    Then veo una grilla con tarjetas representando cada mesa:
      - Número de mesa
      - Capacidad (N personas)
      - Estado coloreado:
          Verde → 'available'
          Rojo → 'occupied'
          Amarillo → 'reserved'
          Gris → 'maintenance'
    And veo un contador resumen: "X mesas disponibles / Y ocupadas / Z reservadas"

  Scenario: Cambiar estado de mesa manualmente
    Given veo la mesa #5 en estado 'available'
    When hago click en "Mesa #5" y selecciono "Marcar como ocupada"
    Then se llama PATCH /api/admin/tables/:id { status: 'occupied' }
    And la tarjeta cambia a color rojo inmediatamente

  Scenario: Abrir cuenta en una mesa
    Given la mesa #3 está en estado 'available'
    When hago click en "Abrir cuenta" y confirmo el número de comensales (ej: 4)
    Then se llama POST /api/admin/table-bills { tableId, guestCount: 4 }
    And la mesa pasa a estado 'occupied'
    And soy redirigido (o se abre panel lateral) con la cuenta de la mesa #3 activa

  Scenario: Mesa ocupada muestra botón "Ver cuenta"
    Given la mesa #3 está en estado 'occupied'
    When veo la tarjeta de la mesa
    Then veo el botón "Ver cuenta"
    And al hacer click me lleva a /admin/tables/:id/bill (o abre el panel de cuenta)

  Scenario: Crear nueva mesa
    Given soy admin
    When hago click en "Agregar mesa"
    And lleno: número=10, capacidad=6, sección=Terraza
    And confirmo
    Then se llama POST /api/admin/tables { number: 10, capacity: 6, section: 'Terraza' }
    And la nueva mesa aparece en la grilla con estado 'available'

  Scenario: No se puede duplicar número de mesa
    Given ya existe la mesa #5
    When intento crear una nueva mesa con número 5
    Then el backend retorna 409 { error: "Ya existe una mesa con ese número" }
    And se muestra el error en el formulario

  Scenario: Poner mesa en mantenimiento
    Given soy admin
    When selecciono mesa #2 → "Poner en mantenimiento"
    Then status = 'maintenance'
    Y la mesa aparece en gris y no se puede abrir cuenta en ella
```

---

## Modelo de Datos: `Table`

```typescript
// backend/src/models/Table.ts
{
  number:    { type: Number, required: true, unique: true, min: 1 },
  capacity:  { type: Number, required: true, min: 1, max: 20 },
  section:   { type: String, default: 'Main Hall' },  // Terraza, Barra, VIP, etc.
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  activeBill: { type: ObjectId, ref: 'TableBill', default: null },  // FK a cuenta abierta
  timestamps: true
}
```

---

## Desglose de Tareas

### Backend — Table Model y Rutas
- [ ] Crear `backend/src/models/Table.ts` con el schema documentado
- [ ] Crear `backend/src/routes/table.routes.ts`:
  - `GET /api/admin/tables` — requireRole(['admin','staff']) — listar todas
  - `POST /api/admin/tables` — requireRole(['admin']) — crear mesa
  - `PATCH /api/admin/tables/:id` — requireRole(['admin','staff']) — actualizar status
  - `DELETE /api/admin/tables/:id` — requireRole(['admin']) — solo si status='available' y sin bills activos
- [ ] Crear `backend/src/controllers/table.controller.ts`
- [ ] En POST /tables: validar unicidad del `number`; si duplicado → 409
- [ ] En PATCH /tables/:id status='maintenance': verificar que no haya `activeBill` abierto

### Backend — Seed de Mesas Iniciales
- [ ] Crear script `backend/src/seeds/tableSeed.ts`: poblar con 10 mesas por defecto (número 1-10, capacidades variadas)

### Frontend — Página `/admin/tables`
- [ ] Crear `src/pages/admin/Tables.tsx`
- [ ] Fetch `GET /api/admin/tables` al montar
- [ ] Grid de cards usando `<Card>` de shadcn/ui
- [ ] Color de card por status:
  - available → `border-green-500 bg-green-50`
  - occupied → `border-red-500 bg-red-50`
  - reserved → `border-yellow-500 bg-yellow-50`
  - maintenance → `border-gray-300 bg-gray-100`
- [ ] Contador resumen en el header de la página

### Frontend — Card de Mesa (`<TableCard />`)
- [ ] Número de mesa (grande)
- [ ] Icono de personas + capacidad
- [ ] Badge de estado
- [ ] Acciones según estado:
  - `available` → "Abrir cuenta"
  - `occupied` → "Ver cuenta"
  - `reserved` → "Confirmar llegada" (→ occupied) | "Cancelar reserva" (→ available)
  - `maintenance` → solo admin: "Disponible"
- [ ] Dropdown de acciones adicionales (Cambiar estado, Editar, Eliminar) para admin

### Frontend — Modal "Abrir cuenta"
- [ ] Input numérico de comensales (1 a capacity)
- [ ] Opción de asociar cliente registrado (búsqueda por nombre/email, opcional)
- [ ] Llamar POST /api/admin/table-bills y redirigir al la vista de cuenta

### Pruebas
- [ ] Test: POST /tables con número duplicado → 409
- [ ] Test: PATCH /tables/:id status='maintenance' cuando hay bill activo → 400
- [ ] Test: GET /tables retorna array con status correcto
- [ ] Test: `TableCard` rendered con cada estado muestra el color correcto
