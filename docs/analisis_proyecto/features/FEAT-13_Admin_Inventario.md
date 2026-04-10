# FEAT-13 — Admin: Gestión de Inventario

**Épica:** [EPIC-04 — Panel de Administración](../epicas/EPIC-04_Panel_Administracion.md)

> El restaurante necesita rastrear el stock de sus ingredientes e insumos, recibir alertas cuando un ítem está por debajo del mínimo, y registrar las reposiciones. Esta feature construye el CRUD del inventario y el sistema de alertas de stock bajo.

## Descripción

**Como** administrador o encargado del restaurante,
**quiero** gestionar el inventario de ingredientes e insumos con alertas de stock bajo,
**para** nunca quedarme sin ingredientes durante el servicio y planificar las compras a tiempo.

**Prioridad:** `Must Have`

---

## Pantalla: Lista de Inventario (`/admin/inventory`)

```
Inventario                              [ + Nuevo Ítem ]  [⚠️ 3 Alertas]

[ 🔍 Buscar...  ]    Categoría: [ Todas ▼ ]    [ Solo bajo stock ]

┌───────────────────────────────────────────────────────────────────────┐
│  Ítem           │ Categoría  │ Stock Actual │ Mínimo │ Unidad │ Acc  │
├───────────────────────────────────────────────────────────────────────┤
│ Filete de res   │ Carnes     │ ⚠️  2 kg     │  5 kg  │ kg     │ ···  │
│ Pollo entero    │ Carnes     │ ✅ 15 kg     │  8 kg  │ kg     │ ···  │
│ Aceite de oliva │ Condimentos│ ⚠️  0.5 L    │  2 L   │ litros │ ···  │
│ Arroz blanco    │ Granos     │ ✅ 25 kg     │  10 kg │ kg     │ ···  │
│ Limones         │ Frutas     │ ✅ 30 u      │  20 u  │ unid.  │ ···  │
└───────────────────────────────────────────────────────────────────────┘

Mostrando 1-20 de 48 ítems
```

---

## Pantalla: Alertas de Stock (`/admin/inventory/alerts`)

```
⚠️ Alertas de Stock Bajo — 3 ítems requieren atención

┌──────────────────────────────────────────────────────────────────┐
│  Ítem           │ Stock Actual │ Mínimo │ Faltante │ Acción    │
├──────────────────────────────────────────────────────────────────┤
│ Filete de res   │  2 kg        │  5 kg  │   3 kg   │ [Reponer] │
│ Aceite de oliva │  0.5 L       │  2 L   │  1.5 L   │ [Reponer] │
│ Mantequilla     │  200 g       │  500 g │   300 g  │ [Reponer] │
└──────────────────────────────────────────────────────────────────┘
```

---

## Modal: Reposición de Stock

```
┌─────────────────────────────────────────┐
│  Reposición — Filete de res             │
│                                         │
│  Stock actual:   2 kg                   │
│  Stock mínimo:   5 kg                   │
│                                         │
│  Cantidad a agregar:  [   3  ] kg       │
│  Nuevo stock total:   5 kg              │
│                                         │
│  Proveedor:  [BovicarneSRL___________]  │
│  Costo total: [  840.00  ] RD$          │
│                                         │
│  [ Cancelar ]    [ Confirmar Reposición ]│
└─────────────────────────────────────────┘
```

---

## Lógica de Alertas

Un ítem está en "alerta" cuando:

```
InventoryItem.currentStock < InventoryItem.minimumStock
```

El endpoint `GET /api/inventory/alerts` retorna solo los ítems en esta condición. El dashboard del admin muestra el conteo de alertas como un badge.

---

## Criterios de Aceptación

```
SCENARIO: Admin crea un nuevo ítem de inventario
  Given admin está en /admin/inventory
  When hace click en "Nuevo Ítem" y completa el formulario:
    nombre="Filete de res", categoría="Carnes", unidad="kg", stock=10, mínimo=5
  And hace click en "Guardar"
  Then POST /api/inventory se llama con los datos
  And el ítem aparece en la lista de inventario
  And como stock(10) >= mínimo(5), no hay alerta

SCENARIO: Ítem con stock bajo genera alerta
  Given el ítem "Filete de res" tiene currentStock=2 y minimumStock=5
  Then aparece con indicador ⚠️ en la lista
  And aparece en la pantalla de alertas /admin/inventory/alerts
  And el dashboard muestra el conteo de alertas actualizado

SCENARIO: Staff repone stock de un ítem
  Given "Filete de res" tiene stock=2 (alerta activa)
  When staff hace click en "Reponer" e ingresa cantidad=5
  Then PATCH /api/inventory/:id/restock { quantity: 5 } se llama
  And currentStock = 2 + 5 = 7
  And el ítem ya NO aparece en alertas (7 >= 5)
  And lastRestockedAt = now, lastRestockedBy = req.user.id

SCENARIO: Admin desactiva un ítem sin eliminarlo
  Given existe el ítem "Filete de merluza" que ya no se usa
  When admin hace click en "Desactivar" en el menú de acciones
  Then InventoryItem.isActive = false
  And el ítem desaparece de la lista activa
  And puede recuperarse desde "Ver desactivados"

SCENARIO: Filtrar inventario por categoría
  Given hay 48 ítems de 6 categorías diferentes
  When staff selecciona "Carnes" en el dropdown de categorías
  Then solo se muestran los ítems de la categoría "Carnes"

SCENARIO: Búsqueda de ítem
  Given hay items de "arroz blanco" y "arroz integral"
  When staff escribe "arroz" en el buscador
  Then ambos ítems aparecen en los resultados
```

---

## Task Breakdown

### Backend
- [ ] Crear `backend/src/models/InventoryItem.ts` con el schema definido
- [ ] Agregar `InventoryItem` al barrel `backend/src/models/index.ts`
- [ ] Crear `backend/src/controllers/inventory.controller.ts`:
  - `getAll`: paginación, búsqueda por nombre, filtro por categoría, filtro `isActive`, filtro `lowStock`
  - `create`: validar nombre único por categoría
  - `update`: actualizar campos editables
  - `restock`: `$inc: { currentStock: quantity }` + actualizar `lastRestockedAt`, `lastRestockedBy`
  - `getAlerts`: retornar solo `{ currentStock: { $lt: minimumStock }, isActive: true }`
  - `deactivate`: soft delete (`isActive = false`)
- [ ] Crear `backend/src/routes/inventory.routes.ts`
- [ ] Índices en `InventoryItem`: `{ name: 'text' }`, `{ category: 1 }`, `{ isActive: 1 }`
- [ ] En `GET /api/admin/dashboard`: incluir conteo de alertas con `InventoryItem.countDocuments({ currentStock: { $lt: ... }, isActive: true })`

### Frontend
- [ ] Crear `src/pages/admin/Inventory.tsx` con tabla filtrable
- [ ] Crear `src/pages/admin/InventoryAlerts.tsx` (lista simplificada de ítems con alerta)
- [ ] Crear `<NewInventoryItemDialog />` para el formulario de creación
- [ ] Crear `<RestockDialog />` para el formulario de reposición con cálculo de nuevo total
- [ ] Agregar `inventoryApi` en `api.ts`: `getAll`, `create`, `update`, `restock`, `getAlerts`, `deactivate`
- [ ] Badge de alerta en el sidebar de admin junto a "Inventario" si hay alertas activas
- [ ] El badge también aparece en el widget del dashboard

### Pruebas
- [ ] Verificar que `restock` es un `$inc` atómico (no una sobreescritura)
- [ ] Verificar que el badge de alertas en el dashboard se actualiza después de reponer
- [ ] Verificar que desactivar un ítem lo saca de la lista activa pero no lo borra de BD
- [ ] Verificar búsqueda case-insensitive
