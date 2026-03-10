# US-01 — Conectar el Formulario de Reservaciones al API Real

**Feature:** [FEAT-01 — Conectar Reservaciones](../features/FEAT-01_Conectar_Reservaciones.md)
**Épica:** EPIC-01 — Completar MVP Core

---

## Definición

**Como** cliente del restaurante,
**quiero** que mi formulario de reservación se envíe realmente al sistema,
**para** que el restaurante tenga registro real de mi reserva y pueda confirmarla.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Formulario de Reservaciones Real

  Scenario: Reservación enviada exitosamente
    Given estoy en /reservations
    And he completado: fecha=15/03/2026, hora=7:00 PM, comensales=4, nombre, email, teléfono
    When hago click en "Confirmar Reserva" en el paso 3
    Then se ejecuta POST /api/reservations con los datos del formulario
    And soy redirigido a /booking-confirmation
    And la página muestra: fecha, hora, número de comensales, ID de reserva real

  Scenario: Error de servidor al crear reservación
    Given he completado el formulario correctamente
    When el servidor retorna error 500
    Then se muestra un toast de error: "No se pudo crear la reservación. Por favor intente nuevamente."
    And permanezco en el formulario en el paso 3
    And el botón "Confirmar Reserva" vuelve a estar habilitado

  Scenario: Ver mis reservaciones reales
    Given estoy autenticado y tengo 2 reservaciones en el sistema
    When navego a /my-reservations
    Then se ejecuta GET /api/reservations/my
    And veo las 2 reservaciones con sus fechas y estados reales
    And NO veo el array hardcodeado de datos ficticios

  Scenario: Cancelar una reservación
    Given tengo una reservación en estado 'confirmed'
    When hago click en "Cancelar" y confirmo el diálogo
    Then se ejecuta PUT /api/reservations/:id/cancel
    And el badge de la reservación cambia a "Cancelada" (rojo)
    And la lista no se recarga completa (solo actualizo ese ítem)

  Scenario: Reservación sin autenticación — nombre y email son obligatorios
    Given NO estoy autenticado
    When accedo a /reservations
    Then el formulario solicita nombre, email y teléfono manualmente
    And no hay opción de "autocompletar desde mi cuenta"
```

---

## Desglose de Tareas

### Backend
- [ ] Verificar que `POST /api/reservations` retorna el objeto completo: `{ _id, date, time, guests, name, status }`
- [ ] Verificar que `GET /api/reservations/my` requiere JWT y retorna solo reservas del usuario autenticado
- [ ] Verificar que `PUT /api/reservations/:id/cancel` verifica que el `reservation.user === req.user.id`
- [ ] Confirmar que reservaciones sin usuario autenticado (walk-in opt-auth) también funcionan con `optionalAuthMiddleware`

### Frontend
- [ ] En `Reservations.tsx`: localizar el `handleSubmit` del paso 3 que usa `setTimeout`
- [ ] Reemplazar `setTimeout` por: `const result = await reservationApi.create(formData)` en `try/catch`
- [ ] En el `try`: llamar `navigate('/booking-confirmation', { state: { reservation: result } })`
- [ ] En el `catch`: mostrar `toast.error(error.message)` y resetear el estado de carga del botón
- [ ] Agregar `isSubmitting` state: deshabilitar botón y mostrar spinner durante la llamada
- [ ] En `BookingConfirmation.tsx`: leer `location.state?.reservation` y mostrar datos reales
- [ ] En `MyReservations.tsx`: agregar `useEffect(() => { reservationApi.getMyReservations().then(setReservations) }, [])`
- [ ] En `MyReservations.tsx`: eliminar el array hardcodeado de datos ficticios
- [ ] En `MyReservations.tsx`: agregar estado `isLoading` con `<Skeleton />` cards durante la carga
- [ ] En `MyReservations.tsx`: reemplazar la función `cancelReservation` por llamada real a `reservationApi.cancel(id)` seguida de actualización local del estado (no reload)

### Pruebas
- [ ] Test visual: llenar los 3 pasos → confirmar → verificar que aparece en /my-reservations
- [ ] Test: cancelar reservation → badge cambia a rojo sin recargar la página
- [ ] Test: simular error 500 → verificar que toast aparece y formulario queda activo
- [ ] Test: navegar a /my-reservations sin autenticación → redirect a /login (depende de US-05)
