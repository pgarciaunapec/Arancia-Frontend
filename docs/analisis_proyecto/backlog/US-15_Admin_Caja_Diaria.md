# US-15 — Admin: Caja Diaria (Apertura, Cierre y Resumen)

**Feature:** [FEAT-12 — Admin — Caja y Cobro](../features/FEAT-12_Admin_Caja_y_Cobro.md)
**Épica:** EPIC-04 — Panel de Administración

---

## Definición

**Como** cajero o administrador,
**quiero** abrir la caja al inicio del turno y cerrarla al final del día con un resumen automatizado de ingresos,
**para** tener control financiero diario y un registro auditado de cada sesión de caja.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Caja Diaria

  Scenario: Abrir la caja del día
    Given no hay ninguna caja abierta hoy
    When hago click en "Abrir caja" en /admin/cash
    And ingreso el monto de apertura: RD$ 5,000
    Then se llama POST /api/admin/cash-register { openingBalance: 5000 }
    And se crea un CashRegister con:
      - date: hoy (solo la fecha, sin hora)
      - status: 'open'
      - openingBalance: 5000
      - openedBy: usuario actual
      - openedAt: ahora

  Scenario: Solo se puede abrir una caja por día
    Given ya existe una caja abierta para hoy
    When otro cajero intenta abrir otra caja para hoy
    Then el backend retorna 409 { error: "Ya existe una caja abierta para el día de hoy" }
    And se muestra el error en la UI

  Scenario: Caja abierta muestra resumen en tiempo real
    Given la caja del día está abierta
    When accedo a /admin/cash
    Then veo:
      - Estado: Abierta (badge verde)
      - Hora de apertura
      - Monto de apertura: RD$ 5,000
      - Ingresos del día (calculado): total de TableBills pagados + Payments completados del día
      - Desglose: Efectivo: RD$ X | Tarjeta: RD$ X | Transferencia: RD$ X
      - Balance proyectado: apertura + efectivo cobrado

  Scenario: Cerrar la caja del día
    Given la caja está abierta con ingresos calculados = RD$ 12,500 efectivo + RD$ 4,200 otros
    When hago click en "Cerrar caja"
    And confirmo el cierre en el modal de confirmación
    Then se llama PATCH /api/admin/cash-register/:id/close
    And el backend calcula el closingBalance y los totales aggregados desde MongoDB
    And CashRegister.status = 'closed'
    And CashRegister.closedAt = ahora
    And CashRegister.closedBy = usuario actual
    And se genera el resumen final con todos los ingresos del día

  Scenario: Ver historial de cierres de caja anteriores
    Given existen registros de caja cerrados
    When accedo a /admin/cash y hago click en "Historial"
    Then veo una lista paginada: fecha, abrió, cerró, monto apertura, total ingresos, balance cierre
    And al hacer click en una fila veo el desglose completo

  Scenario: No se puede cerrar una caja si hay TableBills abiertos
    Given hay 2 mesas con cuentas abiertas (status='open')
    When intento cerrar la caja
    Then el backend retorna 400 { error: "Existen 2 cuentas de mesa abiertas. Ciérralas antes de cerrar la caja." }
    And la UI muestra el error con acceso directo a "Ver mesas con cuenta abierta"

  Scenario: Resumen de cierre incluye todos los métodos de pago
    Given la caja del día tiene los siguientes cobros:
      - 3 TableBills pagados en efectivo: RD$ 2,000, RD$ 1,500, RD$ 3,000
      - 2 TableBills pagados con tarjeta: RD$ 800, RD$ 1,200
      - 1 Pago online (Order.Payment): RD$ 2,500 en transferencia
    When cierro la caja
    Then el resumen muestra:
      - Efectivo cobrado hoy: RD$ 6,500
      - Tarjeta cobrado hoy: RD$ 2,000
      - Transferencia cobrado hoy: RD$ 2,500
      - Total general: RD$ 11,000
      - Balance de cierre: RD$ 5,000 (apertura) + RD$ 6,500 (efectivo) = RD$ 11,500
```

---

## Modelo de Datos: `CashRegister`

```typescript
// backend/src/models/CashRegister.ts
{
  date:            { type: Date, required: true },   // Solo la fecha (sin hora, para unicidad diaria)
  status:          { type: String, enum: ['open', 'closed'], default: 'open' },
  openingBalance:  { type: Number, required: true, min: 0 },
  closingBalance:  { type: Number },                 // Calculado al cerrar
  openedBy:        { type: ObjectId, ref: 'User', required: true },
  closedBy:        { type: ObjectId, ref: 'User' },
  openedAt:        { type: Date, default: Date.now },
  closedAt:        { type: Date },
  summary: {
    cashTotal:     { type: Number, default: 0 },
    cardTotal:     { type: Number, default: 0 },
    transferTotal: { type: Number, default: 0 },
    grandTotal:    { type: Number, default: 0 },
    billsCount:    { type: Number, default: 0 },
    onlinePaymentsCount: { type: Number, default: 0 }
  },
  timestamps: true
}
// Índice único: { date: 1, status: 'open' } para prevenir doble apertura
```

---

## Desglose de Tareas

### Backend — CashRegister Model y API
- [ ] Crear `backend/src/models/CashRegister.ts` con el schema documentado
- [ ] Índice único compuesto: prevenir más de una caja 'open' por fecha
- [ ] Crear `backend/src/routes/cashRegister.routes.ts`:
  - `GET /api/admin/cash-register/today` — caja del día (si existe)
  - `POST /api/admin/cash-register` — abrir caja
  - `PATCH /api/admin/cash-register/:id/close` — cerrar caja
  - `GET /api/admin/cash-register` — historial paginado
  - `GET /api/admin/cash-register/:id` — detalle de una caja
- [ ] Lógica de cierre: aggregar con MongoDB:
  - `TableBill`: `{ status: 'paid', closedAt: { $gte: startOfDay, $lte: endOfDay } }` agrupado por `paymentMethod`
  - `Payment`: `{ status: 'completed', paidAt: { $gte: startOfDay, $lte: endOfDay } }` agrupado por `method`
  - `closingBalance = openingBalance + cashTotal`
- [ ] En `POST /close`: verificar que no haya TableBills con status='open' del día; si los hay → 400 con count

### Frontend — Página `/admin/cash`
- [ ] Crear `src/pages/admin/CashRegister.tsx`
- [ ] Al cargar: `GET /api/admin/cash-register/today`
- [ ] Si sin caja → mostrar botón "Abrir caja" + modal con input de monto de apertura
- [ ] Si caja abierta → mostrar dashboard de la caja activa con métricas en tiempo real (refetch cada 60s)
- [ ] Botón "Cerrar caja" → modal de confirmación → `PATCH /close`
- [ ] Botón "Historial" → tabla de cajas pasadas

### Frontend — Dashboard de Caja Activa
- [ ] Cards de métricas: Efectivo, Tarjeta, Transferencia, Total General (coloridos)
- [ ] Balance proyectado: `apertura + efectivo`
- [ ] Tabla de últimas transacciones del día (TableBills + Payments online)
- [ ] Badge de estado: "Caja Abierta" verde | "Caja Cerrada" gris

### Pruebas
- [ ] Test: POST /cash-register cuando ya existe caja abierta hoy → 409
- [ ] Test: PATCH /close con TableBills abiertos → 400 con mensaje de error
- [ ] Test: PATCH /close exitoso → summary calculado correctamente
- [ ] Test: closingBalance = openingBalance + cashTotal
- [ ] Test: GET /today retorna 404 si no hay caja hoy
