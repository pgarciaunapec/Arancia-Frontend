# FEAT-03 — Perfil Dinámico y Página Mis Pedidos

**Épica:** [EPIC-01 — Completar MVP Core](../epicas/EPIC-01_Completar_MVP_Core.md)

> `Profile.tsx` muestra datos hardcodeados de "Juan Pérez" y guarda con `alert()`. No usa `AuthContext` ni `userApi`. Adicionalmente, no existe ninguna página `/my-orders` aunque el endpoint `GET /api/orders` ya funciona correctamente.

## Descripción

**Como** cliente autenticado,
**quiero** ver y editar mis datos reales de perfil, y consultar el historial de mis pedidos,
**para** gestionar mi cuenta y hacer seguimiento de mis compras anteriores.

**Prioridad:** `Must Have`

---

## Cambios Requeridos

### Perfil (`Profile.tsx`) — Refactoring

| Problema Actual | Solución |
|---|---|
| Datos "Juan Pérez" hardcodeados | Leer de `AuthContext.user` al montar |
| Guardar con `alert()` | Llamar `userApi.updateProfile()` con feedback via toast |
| Sin manejo de errores | `try/catch` + toast de error específico |
| Sin estado de carga | `isLoading` + spinner en botón durante guardado |
| Sin sección de contraseña funcional | Llamar `userApi.changePassword()` en formulario separado |

### Nueva Página: `MyOrders.tsx`

- Ruta: `/my-orders`
- Protegida con `PrivateRoute`
- Lista todas las órdenes del usuario (excepto las de status `'cart'`)
- Muestra: fecha, total, status, número de ítems, método de pago (futuro)
- Permite navegar al detalle de cada orden

---

## Criterios de Aceptación

```
SCENARIO: Perfil muestra datos reales del usuario autenticado
  Given el usuario "Ana López" está autenticado
  When navega a /profile
  Then el campo "Nombre" muestra "Ana López"
  And el campo "Email" muestra el email real de la cuenta
  And el campo "Teléfono" muestra el teléfono guardado o vacío si no existe

SCENARIO: Usuario actualiza su nombre y teléfono exitosamente
  Given el usuario está en /profile
  When modifica el nombre a "Ana M. López"
  And hace click en "Guardar Cambios"
  Then se llama PUT /api/users/profile con los nuevos datos
  And se muestra toast de éxito "Perfil actualizado correctamente"
  And AuthContext.user se actualiza con los nuevos valores

SCENARIO: Error al actualizar perfil
  Given el usuario está en /profile
  When la API retorna error 500 al guardar
  Then se muestra toast de error con el mensaje del servidor
  And los campos vuelven a los valores guardados anteriores

SCENARIO: Usuario cambia su contraseña exitosamente
  Given el usuario está en la sección "Cambiar Contraseña" de /profile
  When completa: contraseña actual, nueva contraseña y confirmación
  And las contraseñas nueva y confirmación coinciden
  Then se llama PUT /api/users/password
  And se muestra toast de éxito
  And los campos de contraseña se limpian

SCENARIO: Nueva contraseña demasiado corta
  Given el usuario intenta cambiar la contraseña
  When escribe una nueva contraseña de menos de 6 caracteres
  Then el botón de guardar está deshabilitado
  And se muestra mensaje de validación inline

SCENARIO: Cliente ve historial de pedidos en /my-orders
  Given el cliente tiene 3 pedidos previos
  When navega a /my-orders
  Then se llama GET /api/orders
  And se listan los 3 pedidos con fecha, total y status
  And los pedidos están ordenados del más reciente al más antiguo

SCENARIO: Sin pedidos previos
  Given el cliente no ha realizado ningún pedido
  When navega a /my-orders
  Then se muestra una pantalla vacía con texto "Aún no has realizado pedidos"
  And hay un botón de CTA "Ver el Menú" que navega a /menu
```

---

## Task Breakdown

### Backend
- [ ] Verificar que `PUT /api/users/profile` retorna el usuario actualizado completo
- [ ] Verificar que `PUT /api/users/password` valida contraseña actual antes de cambiar
- [ ] Verificar que `GET /api/orders` excluye órdenes con `status: 'cart'`
- [ ] Verificar que `GET /api/orders` ordena por `createdAt: -1`

### Frontend (Profile.tsx)
- [ ] Al montar, leer `user` de `AuthContext` y pre-llenar el formulario de edición
- [ ] Al guardar datos de perfil, llamar `userApi.updateProfile({ name, phone, address })`
- [ ] Llamar `AuthContext.updateProfile()` para sincronizar el estado global post-guardado
- [ ] Reemplazar `alert()` por toast de `sonner` para éxito y error
- [ ] Agregar `isLoading` al botón de guardar (spinner + deshabilitar)
- [ ] Agregar formulario separado para cambio de contraseña con campos: contraseña actual, nueva, confirmación
- [ ] Validación client-side: nueva contraseña ≥ 6 caracteres, confirmación coincide
- [ ] Llamar `userApi.changePassword({ currentPassword, newPassword })` en el submit del formulario de contraseña

### Frontend (MyOrders.tsx — página nueva)
- [ ] Crear `src/pages/MyOrders.tsx`
- [ ] Agregar la ruta `/my-orders` en `App.tsx` envuelta en `PrivateRoute`
- [ ] Al montar, llamar `orderApi.getAll()` y guardar en estado local
- [ ] Mostrar skeleton loader durante la carga
- [ ] Para cada pedido mostrar: fecha, resumen de ítems (primero 2 + "y X más"), total, badge de status coloreado
- [ ] Estado vacío: imagen ilustrativa + "Sin pedidos aún" + botón "Ver el Menú"
- [ ] Agregar link a "Mis Pedidos" en el menú de navegación y en la página de perfil

### Pruebas
- [ ] Verificar que Profile muestra el nombre real del usuario autenticado (no "Juan Pérez")
- [ ] Verificar que cambiar nombre actualiza el nombre en el header/navbar sin recargar
- [ ] Verificar flujo completo de cambio de contraseña
- [ ] Verificar que `/my-orders` muestra pedidos reales después de realizar una compra
- [ ] Verificar estado vacío en `/my-orders` para usuario sin pedidos
