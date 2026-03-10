---
name: creador-de-habilidades
description: Una habilidad para crear nuevas habilidades de Antigravity siguiendo la documentación oficial. Úsala cuando el usuario quiera crear una nueva habilidad o workflow.
---

# Creador de Habilidades

Esta habilidad te guía en el proceso de creación de nuevas habilidades para Antigravity. Las habilidades son flujos de trabajo reutilizables que permiten al agente realizar tareas complejas de manera estandarizada.

## Pasos para crear una habilidad

1.  **Recopilar Información**:
    Interactúa con el usuario para obtener la siguiente información clave (si no se ha proporcionado ya):
    -   **Nombre de la habilidad**: Debe ser un nombre corto, en minúsculas y separado por guiones (kebab-case). Este será el nombre del directorio.
    -   **Descripción**: Una frase clara que explique *qué* hace la habilidad y *cuándo* debe usarse. Esta descripción va en el `frontmatter` YAML.
    -   **Instrucciones detalladas**: Una lista de pasos, reglas o procedimientos que el agente debe seguir cuando ejecute esta habilidad.

2.  **Estructura de Archivos**:
    Crea la siguiente estructura en el espacio de trabajo del usuario:
    ```text
    .agent/skills/<nombre-de-la-habilidad>/SKILL.md
    ```
    *Nota: Si el usuario menciona scripts o ejemplos, puedes crear también carpetas `scripts/` o `examples/` dentro del directorio de la habilidad.*

3.  **Contenido de SKILL.md**:
    El archivo `SKILL.md` debe tener el siguiente formato OBLIGATORIO:

    ```markdown
    ---
    name: <nombre-de-la-habilidad>
    description: <descripción corta>
    ---

    # <Título de la Habilidad>

    <Instrucciones detalladas...>
    ```

4.  **Validación**:
    -   Confirma con el usuario que la estructura y el contenido son correctos.
    -   Asegúrate de que la ruta sea absoluta o relativa a la raíz del workspace actual (`.agent/skills/...`).

## Ejemplo de interacción

**Agente**: "¿Cómo quieres llamar a la nueva habilidad?"
**Usuario**: "revisar-pr"
**Agente**: "¿Cuál es el propósito?"
**Usuario**: "Revisar Pull Requests en busca de errores."
**Agente**: "Perfecto, ¿qué instrucciones debo seguir?"
**Usuario**: "Verificar sintaxis, buscar console.logs olvidados y revisar tests."

**Acción del Agente**:
Crear `.agent/skills/revisar-pr/SKILL.md` con el contenido apropiado.
