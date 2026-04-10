# FEAT-01 — Conectar Reservaciones al API Real

**Épica:** [EPIC-01 — Completar MVP Core](../epicas/EPIC-01_Completar_MVP_Core.md)

> El formulario multi-paso de reservaciones en `/reservations` ya está construido con todos los campos necesarios. El método `reservationApi.create()` ya existe en `src/services/api.ts`. El problema es que el `handleSubmit` usa `setTimeout(() => navigate('/booking-confirmation'), 1500)` en lugar de llamar la API real.

## Descripción

**Como** cliente,
**quiero** que mi reservación se guarde realmente en el sistema,
**para** que el restaurante la reciba y pueda confirmarla.

**Prioridad:** `Must Have`

---

## Archivos Afectados

| Archivo | Cambio |
|---|---|
| `src/pages/Reservations.tsx` | Reemplazar `setTimeout` por `reservationApi.create()` real |
| `src/pages/MyReservations.tsx` | Reemplazar array hardcodeado por `reservationApi.getMyReservations()` |
| `src/pages/BookingConfirmation.tsx` | Mostrar datos reales pasados via `location.state` o query param |
| `src/services/api.ts` | Ya existe — sin cambios requeridos |

---

## Criterios de Aceptación

```
SCENARIO: Cliente completa reservación exitosamente
  Given el cliente está autenticado en /reservations
  And ha completado los 3 pasos del formulario con datos válidos
  When hace click en "Confirmar Reserva"
  Then se llama POST /api/reservations con los datos del formulario
  And el usuario es redirigido a /booking-confirmation
  And la página de confirmación muestra la fecha, hora y número de comensales reales

SCENARIO: Error de API al crear reservación
  Given el cliente está en el paso 3 del formulario
  When el API retorna un error (500 o 400)
  Then se muestra un toast/mensaje de error específico
  And el usuario permanece en el formulario (no se redirige)
  And el botón de "Confirmar" vuelve a estar habilitado

SCENARIO: Cliente ve sus reservaciones en /my-reservations
  Given el cliente está autenticado
  When navega a /my-reservations
  Then se llama GET /api/reservations/my
  And se muestran las reservaciones reales del usuario desde MongoDB
  And las reservaciones con status 'confirmed' muestran badge verde

SCENARIO: Cliente cancela una reservación
  Given hay una reservación en estado 'pending' o 'confirmed'
  When el cliente hace click en "Cancelar"
  And confirma el diálogo
  Then se llama PUT /api/reservations/:id/cancel
  And el estado de la reservación en la UI se actualiza a 'cancelled'
  And NO se vuelve a cargar toda la lista (actualización local de estado)
```

---

## Task Breakdown

### Backend
- [ ] Verificar que `POST /api/reservations` retorna el objeto completo de la reservación incluyendo `_id`
- [ ] Verificar que `GET /api/reservations/my` retorna el array correcto para el usuario autenticado
- [ ] Verificar que `PUT /api/reservations/:id/cancel` requiere autenticación y pertenencia

### Frontend
- [ ] En `Reservations.tsx`: reemplazar el `handleSubmit` con llamada real a `reservationApi.create(formData)`
- [ ] Pasar el resultado de la API a `/booking-confirmation` via `navigate('/booking-confirmation', { state: { reservation } })`
- [ ] En `BookingConfirmation.tsx`: leer `location.state.reservation` para mostrar los datos reales
- [ ] En `MyReservations.tsx`: agregar `useEffect` que llama a `reservationApi.getMyReservations()` al montar
- [ ] En `MyReservations.tsx`: reemplazar el array hardcodeado por el estado cargado de la API
- [ ] En `MyReservations.tsx`: agregar estado `isLoading` con skeleton loader durante la carga
- [ ] En `MyReservations.tsx`: reemplazar `cancelReservation()` local por llamada real a `reservationApi.cancel(id)`
- [ ] Agregar manejo de errores en todos los `try/catch` con toast de error usando `sonner`
- [ ] Envolver el step 3 del formulario con `isLoading` para deshabilitar el botón durante la llamada

### Pruebas
- [ ] Verificar flujo completo: llenar los 3 pasos → confirmar → ver en /my-reservations
- [ ] Verificar que una reservación cancelada cambia de estado en UI sin recargar la página
- [ ] Verificar que un error de red muestra toast de error sin romper la UI
- [ ] Verificar que `/my-reservations` sin autenticación redirige a `/login` (depende de FEAT-04)
