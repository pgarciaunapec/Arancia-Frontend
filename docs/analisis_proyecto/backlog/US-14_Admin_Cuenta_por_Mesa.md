# US-14 — Admin: Cuenta por Mesa (Abrir, Agregar Items, Cobrar)

**Feature:** [FEAT-11 — Admin — Mesas y Cuentas](../features/FEAT-11_Admin_Mesas_y_Cuentas.md)
**Épica:** EPIC-04 — Panel de Administración

---

## Definición

**Como** cajero o mesero,
**quiero** abrir una cuenta por mesa, agregar los platos que consume la mesa, y cobrar al final con efectivo, tarjeta o transferencia,
**para** gestionar el ciclo completo de una visita presencial desde el punto de venta.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Cuenta por Mesa (TableBill)

  Scenario: Abrir nueva cuenta en una mesa
    Given la mesa #4 está en estado 'available'
    When hago click en "Abrir cuenta" con 3 comensales
    Then se crea un TableBill:
      - table: referencia a Mesa #4
      - status: 'open'
      - guestCount: 3
      - items: []
      - subtotal: 0, tax: 0, total: 0
    And la mesa #4 pasa a status='occupied'
    And Table.activeBill = el nuevo TableBill._id

  Scenario: Agregar item a la cuenta abierta
    Given tengo una cuenta abierta para Mesa #4
    When busco "Ceviche" en el menú y hago click en "Agregar + 1"
    Then se llama PATCH /api/admin/table-bills/:id/add-item { menuItemId, quantity: 1 }
    And el ítem aparece en la lista con: nombre, precio unitario, cantidad, subtotal
    And el total de la cuenta se recalcula automáticamente

  Scenario: Modificar cantidad de un item
    Given la cuenta tiene 2x Ceviche
    When hago click en '-' junto a Ceviche
    Then la cantidad pasa a 1x y el total se actualiza
    When hago click en '-' nuevamente
    Then el item es eliminado de la lista

  Scenario: Eliminar item manualmente de la cuenta
    Given la cuenta tiene Ceviche en la lista
    When hago click en el ícono de eliminar de Ceviche
    Then se llama PATCH /api/admin/table-bills/:id/remove-item { menuItemId }
    And Ceviche desaparece de la lista
    And el total se recalcula

  Scenario: Cobrar cuenta con efectivo
    Given la cuenta de Mesa #4 tiene total = RD$ 1,200
    When hago click en "Cobrar cuenta"
    And selecciono "Efectivo"
    And ingreso monto recibido: RD$ 1,500
    Then se muestra: "Vuelto: RD$ 300"
    And confirmo el cobro
    Then se llama POST /api/admin/table-bills/:id/close { paymentMethod: 'cash', receivedAmount: 1500 }
    And TableBill.status = 'paid'
    And Table.status = 'available'
    And Table.activeBill = null

  Scenario: Cobrar cuenta con tarjeta
    Given la cuenta de Mesa #4 tiene total = RD$ 850
    When selecciono "Tarjeta" en el cobro
    And confirmo sin ingresar monto extra (tarjeta carga exacto)
    Then se cierra la cuenta con paymentMethod='card'
    And NO hay cálculo de vuelto

  Scenario: Descuento VIP aplicado al cobrar
    Given el cliente asociado a la cuenta es VIP con 20% de descuento
    When visualizo el resumen de cobro
    Then veo:
      - Subtotal: RD$ 1,000
      - Descuento VIP (20%): -RD$ 200
      - IVA (18%): RD$ 144
      - Total: RD$ 944
    And el cobro se procesa sobre RD$ 944

  Scenario: No se puede cerrar una cuenta vacía
    Given una cuenta abierta no tiene ningún item
    When intento hacer click en "Cobrar cuenta"
    Then el botón está deshabilitado
    And se muestra: "Agrega al menos un ítem antes de cobrar"

  Scenario: Ver cuenta activa de una mesa ocupada
    Given la mesa #4 está occupied con tableBill activo
    When accedo a /admin/tables/4/bill
    Then veo el detalle completo: items, totales, tiempo transcurrido desde apertura
```

---

## Modelo de Datos: `TableBill`

```typescript
// backend/src/models/TableBill.ts
{
  table:      { type: ObjectId, ref: 'Table', required: true },
  openedBy:   { type: ObjectId, ref: 'User', required: true },    // staff o admin que abrió
  closedBy:   { type: ObjectId, ref: 'User' },
  customer:   { type: ObjectId, ref: 'User' },                    // Opcional: cliente registrado
  guestCount: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['open', 'closed', 'paid'],
    default: 'open'
  },
  items: [{
    menuItem:    { type: ObjectId, ref: 'MenuItem', required: true },
    name:        { type: String, required: true },      // Snapshot del nombre al momento de agregar
    price:       { type: Number, required: true },      // Snapshot del precio al momento
    quantity:    { type: Number, required: true, min: 1 }
  }],
  subtotal:       { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  tax:            { type: Number, default: 0 },
  total:          { type: Number, default: 0 },
  paymentMethod:  { type: String, enum: ['cash', 'card', 'transfer'] },
  receivedAmount: { type: Number },       // Para cálculo de vuelto en efectivo
  changeAmount:   { type: Number },       // Vuelto calculado
  openedAt:       { type: Date, default: Date.now },
  closedAt:       { type: Date },
  timestamps: true
}
```

---

## Desglose de Tareas

### Backend — TableBill Model y API
- [ ] Crear `backend/src/models/TableBill.ts` con el schema documentado
- [ ] Crear `backend/src/routes/tableBill.routes.ts`:
  - `POST /api/admin/table-bills` — crear (abrir cuenta): requireRole(['admin','staff'])
  - `GET /api/admin/table-bills/:id` — obtener cuenta activa
  - `PATCH /api/admin/table-bills/:id/add-item` — agregar item
  - `PATCH /api/admin/table-bills/:id/remove-item` — eliminar item
  - `PATCH /api/admin/table-bills/:id/update-item` — cambiar cantidad
  - `POST /api/admin/table-bills/:id/close` — cobrar y cerrar
- [ ] Lógica de recálculo de totales (helper): tras cada cambio de items, recalcular `subtotal`, `tax` (subtotal * 0.18), `total` (subtotal - discount + tax)
- [ ] `POST /close`: validar que `items.length > 0`; si cash: calcular `changeAmount = receivedAmount - total`; actualizar Table.status='available' y Table.activeBill=null en la misma operación
- [ ] Aplicar descuento VIP si `customer` es VIP: obtener `user.vipDiscount`, calcular `discountAmount`

### Frontend — Página `/admin/tables/:id/bill`
- [ ] Crear `src/pages/admin/TableBillPage.tsx`
- [ ] Split view: panel izquierdo (búsqueda de menú + agregar items) | panel derecho (cuenta activa)
- [ ] Panel izquierdo: `<MenuSearch />` — búsqueda de MenuItem, botones +/- para cantidad, botón "Agregar"
- [ ] Panel derecho: lista de items con nombre, precio unitario, cantidad (editable), subtotal por línea, y resumen de totales
- [ ] Botón "Cobrar cuenta" → abre `<BillPaymentDialog />`

### Frontend — `<BillPaymentDialog />`
- [ ] Selector de método de pago: Efectivo / Tarjeta / Transferencia
- [ ] Si Efectivo: input "Monto recibido", cálculo de vuelto en tiempo real
- [ ] Si VIP: resumen con línea de descuento visible
- [ ] Botón confirmar: llama `POST /api/admin/table-bills/:id/close`
- [ ] En éxito: redirigir a `/admin/tables`, mostrar toast "Mesa liberada correctamente"

### Pruebas
- [ ] Test: POST /close con items vacíos → 400
- [ ] Test: POST /close con cash, receivedAmount < total → 422 "Monto insuficiente"
- [ ] Test: POST /close éxito → Table.status='available', Table.activeBill=null
- [ ] Test: PATCH /add-item → totales recalculados correctamente (subtotal + IVA)
- [ ] Test: PATCH /add-item con cliente VIP → discountAmount calculado
