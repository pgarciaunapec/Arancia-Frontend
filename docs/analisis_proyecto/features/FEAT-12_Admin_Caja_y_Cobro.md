# FEAT-12 — Admin: Caja y Cobro Diario

**Épica:** [EPIC-04 — Panel de Administración](../epicas/EPIC-04_Panel_Administracion.md)

> El restaurante necesita un control de caja diario: apertura al inicio del turno con un saldo inicial, registro de todas las transacciones del día (cuentas de mesa + pedidos online), y cierre al final del turno con el resumen financiero por método de pago.

## Descripción

**Como** cajero o administrador del restaurante,
**quiero** gestionar la caja diaria con apertura, registro de operaciones y cierre con resumen,
**para** tener un control financiero preciso de cada turno de trabajo.

**Prioridad:** `Must Have`

---

## Pantalla: Caja del Día (`/admin/cash-register`)

### Estado: Caja Cerrada

```
Caja — Lunes 10 de Marzo, 2026

Estado: ⛔ CERRADA

No hay caja abierta para hoy.

[ Abrir Caja ]
```

### Estado: Caja Abierta

```
Caja — Lunes 10 de Marzo, 2026

Estado: ✅ ABIERTA  |  Apertura: 9:00 AM  |  Por: Juan Admin

Saldo Apertura:          RD$  2,500.00

──────────────────────────────────────────────
VENTAS DEL DÍA (EN VIVO)

  Cuentas de Mesa (6 pagadas)     RD$  8,450.00
  Pedidos Online (4 pagados)      RD$  3,200.00
                                  ─────────────
  TOTAL VENTAS:                   RD$ 11,650.00

──────────────────────────────────────────────
DESGLOSE POR MÉTODO DE PAGO

  Efectivo:       RD$  5,200.00
  Tarjeta:        RD$  4,950.00
  Transferencia:  RD$  1,500.00

──────────────────────────────────────────────
EFECTIVO EN CAJA (estimado)
  Saldo apertura:  RD$  2,500.00
  + Ventas ef.:   +RD$  5,200.00
  = Total:         RD$  7,700.00

                            [ Cerrar Caja ]
```

### Modal: Cerrar Caja

```
┌───────────────────────────────────────────┐
│  Cerrar Caja — 10 de Marzo, 2026          │
│                                           │
│  Total ventas del día:  RD$ 11,650.00     │
│                                           │
│  Efectivo en caja (real contado):         │
│  [  7,650.00  ]  ← Staff ingresa el real  │
│                                           │
│  Diferencia:  -RD$ 50.00 ⚠️               │
│  (Puede ser propinas o error de conteo)   │
│                                           │
│  Notas del cierre:                        │
│  [________________________________]       │
│                                           │
│  [ Cancelar ]    [ Confirmar Cierre ]     │
└───────────────────────────────────────────┘
```

---

## Modelo `CashRegister`

Ver definición completa en [EPIC-04](../epicas/EPIC-04_Panel_Administracion.md#cashregister-schema).

Al **cerrar la caja**, el backend calcula automáticamente el `summary`:

```typescript
// En cash-register.controller.ts — closeCashRegister():
const today = startOfDay(new Date());

// Sumar ventas de TableBills pagadas hoy
const tableBillSales = await TableBill.aggregate([
  { $match: { paidAt: { $gte: today }, status: 'paid' } },
  { $group: {
    _id: '$payments.method',
    total: { $sum: '$total' }
  }}
]);

// Sumar ventas de Payments (pedidos online) completados hoy
const onlinePayments = await Payment.aggregate([
  { $match: { paidAt: { $gte: today }, status: 'completed' } },
  { $group: {
    _id: '$method',
    total: { $sum: '$amount' }
  }}
]);

// Combinar ambos en el summary
register.summary = { totalCash, totalCard, totalTransfer, totalSales, totalOrders, totalTableBills };
register.closingBalance = closingBalanceFromForm;
register.status = 'closed';
register.closedAt = new Date();
register.closedBy = req.user.id;
```

---

## Reglas de Negocio

1. **Solo puede haber una caja activa por día.** Si ya hay una caja abierta hoy, `POST /api/admin/cash-register/open` retorna 409.
2. **El cierre es definitivo.** Una vez cerrada, la caja no puede reabrirse.
3. **Los datos son de solo lectura en histórico.** El historial muestra las cajas anteriores sin posibilidad de edición.
4. **Diferencia de efectivo se registra** como dato informativo, no se bloquea el cierre.

---

## Criterios de Aceptación

```
SCENARIO: Apertura de caja
  Given no hay caja abierta hoy
  When admin hace click en "Abrir Caja" e ingresa saldo apertura = RD$ 2,500
  Then POST /api/admin/cash-register/open se llama
  And CashRegister se crea con status='open', openingBalance=2500
  And la pantalla muestra la caja activa con los totales en cero

SCENARIO: Datos en vivo de la caja
  Given hay una caja abierta
  When se paga una cuenta de mesa de RD$ 850 (efectivo)
  Then la sección "VENTAS DEL DÍA" se actualiza al refrescar la página
  And "Efectivo" muestra RD$ 850

SCENARIO: Intento de abrir segunda caja el mismo día
  Given ya hay una caja abierta hoy
  When admin intenta abrir otra caja
  Then el backend retorna 409 "Ya existe una caja abierta para hoy"
  And el botón "Abrir Caja" no aparece si hay una activa

SCENARIO: Cierre de caja con diferencia de efectivo
  Given la caja tiene RD$ 7,700 estimados en efectivo
  When el cajero ingresa RD$ 7,650 como efectivo real contado
  Then se registra la diferencia: -RD$ 50
  And CashRegister.closingBalance = 7,650
  And la caja cierra sin error (la diferencia es informativa)

SCENARIO: Histórico de cajas
  Given hay 5 cajas cerradas de días anteriores
  When admin navega a "Histórico" en /admin/cash-register
  Then ve la lista de las 5 cajas con fecha, total ventas y quien la cerró
  And puede hacer click en cualquiera para ver el detalle
```

---

## Task Breakdown

### Backend
- [ ] Crear `backend/src/models/CashRegister.ts` con el schema definido
- [ ] Crear `backend/src/controllers/cashregister.controller.ts`:
  - `openCashRegister`: validar que no exista una abierta hoy (409 si ya existe)
  - `getTodayCashRegister`: obtener la caja activa de hoy con totales calculados en vivo
  - `closeCashRegister`: calcular summary desde TableBill + Payment + guardar closingBalance
  - `getCashRegisterHistory`: lista paginada de cajas anteriores
- [ ] Crear `backend/src/routes/cashregister.routes.ts`
- [ ] Al calcular totales en vivo: hacer aggregate sobre `TableBill` y `Payment` del mismo día

### Frontend
- [ ] Crear `src/pages/admin/CashRegister.tsx` con los 3 estados: cerrada / abierta / historial
- [ ] Crear `<OpenCashDialog />` con campo de saldo apertura
- [ ] Crear `<CloseCashDialog />` con campo de efectivo real + visualización de diferencia
- [ ] Crear `<CashRegisterSummary />` con el desglose por método de pago
- [ ] Agregar `cashRegisterApi` en `api.ts`
- [ ] Los totales en vivo se obtienen al montar con `GET /api/admin/cash-register/today`

### Pruebas
- [ ] Verificar que el total en caja suma correctamente las cuentas de mesa + pedidos online
- [ ] Verificar que no se puede abrir segunda caja el mismo día
- [ ] Verificar que el cierre calcula correctamente la diferencia de efectivo
- [ ] Verificar que el histórico muestra cajas ordenadas por fecha DESC
