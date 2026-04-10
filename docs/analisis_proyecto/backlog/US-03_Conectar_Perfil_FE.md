# US-03 — Perfil Dinámico y Cambio de Contraseña

**Feature:** [FEAT-03 — Perfil y Mis Pedidos](../features/FEAT-03_Perfil_y_Mis_Pedidos.md)
**Épica:** EPIC-01 — Completar MVP Core

---

## Definición

**Como** cliente autenticado,
**quiero** ver y editar mis datos reales de perfil y cambiar mi contraseña,
**para** gestionar mi cuenta de forma autónoma sin ver datos de otros usuarios.

**Prioridad:** `Must Have`

---

## Criterios de Aceptación (Gherkin)

```gherkin
Feature: Perfil de Usuario Dinámico

  Scenario: Perfil muestra datos reales del usuario
    Given soy "María López" autenticada
    When navego a /profile
    Then el campo "Nombre" muestra "María López"
    And el campo "Email" muestra mi email real
    And NO veo "Juan Pérez" ni ningún dato hardcodeado

  Scenario: Actualizar nombre y teléfono exitosamente
    Given estoy en /profile
    When cambio "Nombre" a "María G. López" y "Teléfono" a "(809) 555-0202"
    And hago click en "Guardar Cambios"
    Then se llama PUT /api/users/profile { name: "María G. López", phone: "(809) 555-0202" }
    And se muestra toast de éxito: "Perfil actualizado correctamente"
    And el nombre en el navbar/header se actualiza a "María G. López" sin recargar

  Scenario: Error al guardar perfil
    Given el servidor retorna error al guardar
    Then se muestra toast de error con el mensaje recibido
    And los campos muestran los últimos valores guardados exitosamente
    And NO aparece alert() nativo del browser

  Scenario: Cambio de contraseña exitoso
    Given estoy en la sección "Cambiar Contraseña" de /profile
    When ingreso: contraseña actual correcta, nueva contraseña "nuevaPass123", confirmación "nuevaPass123"
    And hago click en "Cambiar Contraseña"
    Then se llama PUT /api/users/password { currentPassword, newPassword }
    And se muestra toast de éxito: "Contraseña actualizada"
    And los campos de contraseña se limpian automáticamente

  Scenario: Contraseña actual incorrecta
    Given ingreso una contraseña actual incorrecta
    When hago click en "Cambiar Contraseña"
    Then el API retorna 400 "Contraseña actual incorrecta"
    And se muestra el mensaje de error en el formulario
    And la contraseña NO se cambia

  Scenario: Nueva contraseña demasiado corta
    Given intento ingresar una nueva contraseña de 4 caracteres
    Then el botón "Cambiar Contraseña" está deshabilitado
    And se muestra: "La contraseña debe tener al menos 6 caracteres"

  Scenario: Confirmación de contraseña no coincide
    Given ingreso nueva contraseña "miPass123" y confirmación "miPass124"
    Then se muestra mensaje inline: "Las contraseñas no coinciden"
    And el botón está deshabilitado hasta que coincidan
```

---

## Desglose de Tareas

### Backend
- [ ] Verificar que `PUT /api/users/profile` retorna el usuario actualizado completo (sin password)
- [ ] Verificar que `PUT /api/users/password` valida la contraseña actual con `comparePassword()` antes de actualizar
- [ ] Verificar que el backend retorna 400 con mensaje claro si la contraseña actual es incorrecta

### Frontend (Profile.tsx — refactoring)
- [ ] Al montar el componente: leer `user` de `AuthContext` y usarlo para llenar el formulario (nombre, teléfono, dirección)
- [ ] El campo email: display-only (mostrar el email del `AuthContext.user`, nunca editable)
- [ ] Usar `react-hook-form` para el formulario de datos de perfil
- [ ] Al hacer submit del formulario de datos: llamar `userApi.updateProfile({ name, phone, address? })`
- [ ] En éxito: llamar `AuthContext.updateProfile(result)` para actualizar el estado global
- [ ] Reemplazar el `alert()` existente por `toast.success()`/`toast.error()` de `sonner`
- [ ] Agregar `isLoading` state: spinner en botón durante el guardado
- [ ] Sección separada "Cambiar Contraseña":
  - 3 campos: contraseña actual, nueva contraseña, confirmar nueva contraseña
  - Validación client-side: nueva ≥ 6 chars, nueva === confirmar
  - Submit llama `userApi.changePassword({ currentPassword, newPassword })`
  - En éxito: limpiar los 3 campos + toast de éxito
  - En error: mostrar mensaje del servidor en el campo de contraseña actual

### Pruebas
- [ ] Test: Profile renderiza el nombre real del usuario (no "Juan Pérez")
- [ ] Test: Actualizar nombre → el navbar muestra el nombre nuevo
- [ ] Test: Cambio de contraseña exitoso limpia los campos
- [ ] Test: Contraseña actual incorrecta → error inline, no toast genérico
- [ ] Test: Confirmaciones que no coinciden → botón deshabilitado
