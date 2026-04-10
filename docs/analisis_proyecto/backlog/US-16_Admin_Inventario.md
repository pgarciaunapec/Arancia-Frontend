# US-16 — Admin: Inventario de Ingredientes y Alertas de Stock Bajo

**Feature:** [FEAT-13 — Admin — Inventario](../features/FEAT-13_Admin_Inventario.md)
**Épica:** EPIC-04 — Panel de Administración

---

## Definición

**Como** administrador del restaurante,
**quiero** gestionar el inventario de ingredientes con cantidades y niveles mínimos,
**para** saber cuándo reabastecer antes de que se acabe el stock y evitar quedarnos sin ingredientes durante el servicio.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Gestión de Inventario de Ingredientes

  Scenario: Ver lista completa de inventario
    Given estoy en /admin/inventory
    When la página carga
    Then veo una tabla con todos los items del inventario:
      - Nombre del ingrediente
      - Categoría (Proteínas, Vegetales, Bebidas, Lácteos, etc.)
      - Unidad (kg, litros, unidades, etc.)
      - Stock actual
      - Stock mínimo
      - Badge de alerta si stock actual ≤ stock mínimo
      - Botones: Editar | Reabastecer | Eliminar(soft)

  Scenario: Items con stock bajo se destacan visualmente
    Given el ingrediente "Salmón" tiene currentStock=0.5 y minimumStock=1
    When veo la lista de inventario
    Then la fila de Salmón tiene badge rojo "Stock Bajo"
    And en el sidebar hay un indicador de notificación con el count de items con stock bajo

  Scenario: Crear nuevo item en inventario
    Given soy admin
    When hago click en "Agregar ingrediente"
    And lleno: nombre="Tomate cherry", categoría="Vegetales", unidad="kg", stockActual=5, stockMínimo=1
    And confirmo
    Then se llama POST /api/admin/inventory { name, category, unit, currentStock: 5, minimumStock: 1 }
    And el item aparece en la lista

  Scenario: Editar item (cambiar stock mínimo o renombrar)
    Given existe el item "Limón"
    When hago click en "Editar" de Limón
    And cambio stockMínimo de 2 a 3
    And guardo
    Then se llama PATCH /api/admin/inventory/:id { minimumStock: 3 }
    And el cambio se refleja en la tabla

  Scenario: Reabastecer stock de un ingrediente
    Given el ingrediente "Camarón" tiene currentStock=0.3 kg
    When hago click en "Reabastecer"
    And ingreso cantidad a agregar: 5 kg
    And confirmo
    Then se llama PATCH /api/admin/inventory/:id/restock { quantityToAdd: 5 }
    And currentStock pasa a 5.3 kg automáticamente (operación $inc en MongoDB)
    And si antes tenía badge "Stock Bajo" y ahora currentStock > minimumStock, el badge desaparece

  Scenario: Eliminar item de inventario (soft delete)
    Given existe el item "Ingrediente obsoleto"
    When hago click en "Eliminar" y confirmo
    Then se llama DELETE /api/admin/inventory/:id
    And el item pasa a isActive=false (soft delete)
    And desaparece de la lista activa (pero queda en BD para historial)

  Scenario: Filtrar inventario por categoría
    Given hay 20 ítems de inventario en 4 categorías
    When selecciono el filtro "Proteínas"
    Then la tabla muestra solo los ítems de categoría "Proteínas"

  Scenario: Buscar ingrediente por nombre
    Given estoy en /admin/inventory
    When escribo "pollo" en el buscador
    Then se filtran los items cuyo nombre contiene "pollo"

  Scenario: Solo admin puede gestionar inventario (staff no puede)
    Given estoy autenticado como role='staff'
    When intento navegar a /admin/inventory
    Then soy redirigido a /admin/dashboard
    And se muestra: "Acceso restringido — solo administradores"
```

---

## Modelo de Datos: `InventoryItem`

```typescript
// backend/src/models/InventoryItem.ts
{
  name:         { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Proteínas', 'Vegetales', 'Frutas', 'Lácteos', 'Bebidas', 'Condimentos', 'Granos', 'Otros'],
    required: true
  },
  unit:         { type: String, required: true },   // 'kg', 'litros', 'unidades', 'gramos', etc.
  currentStock: { type: Number, required: true, min: 0 },
  minimumStock: { type: Number, required: true, min: 0 },
  isActive:     { type: Boolean, default: true },   // false = soft delete
  lastRestocked: { type: Date },
  timestamps: true
}
// Virtual: isLowStock = currentStock <= minimumStock
```

---

## Desglose de Tareas

### Backend — InventoryItem Model y API
- [ ] Crear `backend/src/models/InventoryItem.ts` con el schema documentado
- [ ] Agregar virtual `isLowStock` (getter): `return this.currentStock <= this.minimumStock`
- [ ] Crear `backend/src/routes/inventory.routes.ts`:
  - `GET /api/admin/inventory` — requireRole(['admin']) — listar (solo isActive=true, soporte: ?category=&search=)
  - `POST /api/admin/inventory` — crear item
  - `PATCH /api/admin/inventory/:id` — editar (nombre, categoría, unidad, stockMínimo)
  - `PATCH /api/admin/inventory/:id/restock` — reabastecer con `$inc: { currentStock: quantityToAdd }`
  - `DELETE /api/admin/inventory/:id` — soft delete (setear isActive=false)
- [ ] En `GET /api/admin/inventory`: incluir el virtual `isLowStock` en la respuesta (`.lean({ virtuals: true })`)
- [ ] En `GET /api/admin/inventory`: agregar endpoint separado o query param `?lowStock=true` para items con stock bajo
- [ ] En `GET /api/admin/dashboard` (US-11): incluir `lowStockCount` = count de { isActive: true, currentStock: { $lte: "$minimumStock" } }

### Frontend — Página `/admin/inventory`
- [ ] Crear `src/pages/admin/Inventory.tsx`
- [ ] Fetch `GET /api/admin/inventory` al montar
- [ ] Controles: buscador (debounce 300ms), filtro por categoría (select)
- [ ] Tabla: columnas documentadas, row highlight/badge si `isLowStock === true`
- [ ] Botones por fila: "Editar" → modal de edición, "Reabastecer" → modal de restock, "Eliminar" → confirm dialog

### Frontend — Modales
- [ ] `<InventoryItemDialog />` — crear/editar: formulario con campos del modelo, validación react-hook-form
- [ ] `<RestockDialog />` — input numérico de cantidad a agregar, preview del nuevo stock
- [ ] Confirmación de eliminación con `<AlertDialog>` de shadcn/ui

### Frontend — Indicador en Sidebar Admin
- [ ] Si hay items con `isLowStock === true`, mostrar badge rojo con el count en el ítem "Inventario" del sidebar
- [ ] Fetch del count cada vez que el sidebar se renderiza (podrá venir del mismo `GET /inventory` o del dashboard

### Pruebas
- [ ] Test: PATCH /restock → usa $inc (no replace), currentStock = previo + quantityToAdd
- [ ] Test: DELETE /inventory/:id → isActive=false, no aparece en GET /inventory
- [ ] Test: GET /inventory?lowStock=true → solo items con currentStock <= minimumStock
- [ ] Test: isLowStock virtual retorna true cuando currentStock <= minimumStock
- [ ] Test: ruta /admin/inventory con role='staff' → 403
