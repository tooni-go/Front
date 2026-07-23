# Wireframes - EvalIA
---

# Flujo general

```text
                   LOGIN
                      │
                      ▼
                 DASHBOARD
                      │
                      ▼
                  CURSOS
                      │
                      ▼
             DETALLE DEL CURSO
              ┌────────┴────────┐
              ▼                 ▼
         Alumnos           Exámenes
```

---

# Menú principal

Disponible en todas las pantallas (excepto Login).

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ EVALIA                                        👤 Juan Pérez ▼             │
├───────────────┬────────────────────────────────────────────────────────────┤
│ 🏠 Dashboard  │                                                            │
│ 📚 Cursos     │                 Contenido                                  │
│               │                                                            │
│               │                                                            │
│               │                                                            │
│               │                                                            │
│               │                                                            │
├───────────────┴────────────────────────────────────────────────────────────┤
│ Mi perfil                                    Cerrar sesión                 │
└────────────────────────────────────────────────────────────────────────────┘
```

---

# 1. Login

**Se abre cuando**

Al ingresar a la aplicación.

## Objetivo

Permitir iniciar sesión utilizando Google.

```text
┌──────────────────────────────────────────────┐
│                                              │
│                  EVALIA                      │
│                                              │
│ Corrección inteligente de exámenes escritos  │
│                                              │
│                                              │
│        ┌──────────────────────────┐          │
│        │ Continuar con Google     │          │
│        └──────────────────────────┘          │
│                                              │
│ "La IA asiste. El profesor siempre decide."  │
│                                              │
└──────────────────────────────────────────────┘
```

### Botones

- Continuar con Google

### Navega a

```text
Continuar con Google
        │
        ▼
Dashboard
```

---

# 2. Dashboard

**Se abre cuando**

Después de iniciar sesión correctamente.

## Objetivo

Mostrar los accesos principales del sistema.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Dashboard                                                   👤 Juan Pérez  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Bienvenido nuevamente.                                                     │
│                                                                            │
│ ┌──────────────────────────┐      ┌──────────────────────────┐             │
│ │ + Nuevo curso            │      │ Ver cursos              │             │
│ └──────────────────────────┘      └──────────────────────────┘             │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Cursos recientes                                                           │
│                                                                            │
│ • Matemática - 2°A (2026)                                                  │
│ • Historia - 3°B (2026)                                                    │
│ • Física - 5°A (2026)                                                      │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Botones

- Nuevo curso
- Ver cursos

### Navega a

```text
Nuevo curso
      │
      ▼
Formulario Nuevo Curso


Ver cursos
      │
      ▼
Lista de Cursos
```

---

# 3. Lista de Cursos

**Se abre cuando**

Al presionar **"Ver cursos"**.

## Objetivo

Administrar todos los cursos del profesor.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Cursos                                                + Nuevo curso        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Matemática - 2°A                                  Año: 2026           │ │
│ │ 30 alumnos                                        4 exámenes          │ │
│ │                                                    [ Abrir ]          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Historia - 3°B                                    Año: 2026           │ │
│ │ 28 alumnos                                        2 exámenes          │ │
│ │                                                    [ Abrir ]          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Física - 5°A                                      Año: 2026           │ │
│ │ 24 alumnos                                        3 exámenes          │ │
│ │                                                    [ Abrir ]          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Botones

- + Nuevo curso
- Abrir

### Navega a

```text
+ Nuevo curso
      │
      ▼
Nuevo Curso


Abrir
      │
      ▼
Detalle del Curso
```

---

# 4. Nuevo Curso

**Se abre cuando**

Al presionar **"+ Nuevo curso"**.

## Objetivo

Registrar un curso donde luego se cargarán alumnos y exámenes.

```text
┌──────────────────────────────────────────────────────┐
│                  NUEVO CURSO                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Materia                                              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Matemática                                       │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ Año                                                  │
│ [ 2° ▼ ]                                             │
│                                                      │
│ División                                             │
│ [ A ▼ ]                                              │
│                                                      │
│ Año lectivo                                          │
│ [ 2026 ▼ ]                                           │
│                                                      │
│                                                      │
│      [ Guardar ]        [ Cancelar ]                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Botones

- Guardar
- Cancelar

### Navega a

```text
Guardar
    │
    ▼
Detalle del Curso


Cancelar
    │
    ▼
Lista de Cursos
```

---

# 5. Detalle del Curso

**Se abre cuando**

Al presionar **"Abrir"** sobre un curso.

## Objetivo

Administrar alumnos y exámenes pertenecientes al curso.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Matemática - 2°A                                      Año lectivo: 2026    │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ 30 alumnos                                  4 exámenes                     │
│                                                                            │
│ ┌────────────────────────┐     ┌────────────────────────┐                  │
│ │ + Nuevo alumno         │     │ + Nuevo examen         │                  │
│ └────────────────────────┘     └────────────────────────┘                  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Últimos alumnos registrados                                                │
│                                                                            │
│ • Juan Pérez                                                               │
│ • Ana Gómez                                                                │
│ • Pedro López                                                              │
│ • Sofía Martínez                                                           │
│ • Lucas Fernández                                                          │
│                                                                            │
│                                             [ Ver todos ]                  │
├────────────────────────────────────────────────────────────────────────────┤
│ Exámenes                                                                   │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Primer Parcial                                  20 preguntas          │ │
│ │ 30 entregas                                     [ Abrir ]             │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Segundo Parcial                                 18 preguntas          │ │
│ │ 26 entregas                                     [ Abrir ]             │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Botones

- Nuevo alumno
- Nuevo examen
- Ver todos
- Abrir

### Navega a

```text
+ Nuevo alumno
        │
        ▼
Lista de alumnos


+ Nuevo examen
        │
        ▼
Elegir método de creación


Ver todos
        │
        ▼
Lista completa de alumnos


Abrir
        │
        ▼
Detalle del examen
```
---

# 6. Lista de alumnos

**Se abre cuando**

Al presionar **"Ver todos"** desde el detalle del curso.

## Objetivo

Administrar los alumnos pertenecientes al curso.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Alumnos - Matemática 2°A                           + Nuevo alumno          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Buscar alumno...  ___________________________                              │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Juan Pérez                               Legajo: 1001                      │
│                                                    [ Editar ]             │
│                                                                            │
│ Ana Gómez                                Legajo: 1002                      │
│                                                    [ Editar ]             │
│                                                                            │
│ Pedro López                              Legajo: 1003                      │
│                                                    [ Editar ]             │
│                                                                            │
│ Sofía Martínez                           Legajo: 1004                      │
│                                                    [ Editar ]             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Botones

- Nuevo alumno
- Editar

### Navega a

```text
Nuevo alumno
      │
      ▼
Formulario Nuevo Alumno


Editar
      │
      ▼
Editar Alumno
```

---

# 7. Nuevo alumno

**Se abre cuando**

Al presionar **"+ Nuevo alumno"**.

## Objetivo

Registrar un alumno para el curso.

```text
┌──────────────────────────────────────────────────────┐
│                  NUEVO ALUMNO                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Nombre                                               │
│ ┌──────────────────────────────────────────────────┐ │
│ │                                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ Legajo                                               │
│ ┌──────────────────────────────────────────────────┐ │
│ │                                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│                                                      │
│        [ Guardar ]      [ Cancelar ]                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 8. Detalle del examen

**Se abre cuando**

Al presionar **"Abrir"** sobre un examen.

## Objetivo

Centralizar toda la información del examen.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Primer Parcial - Matemática 2°A                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Fecha: 15/04/2026                                                          │
│                                                                            │
│ Preguntas: 20                                                              │
│ Puntaje total: 100                                                         │
│ Entregas: 30                                                               │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ [ Ver preguntas ]                                                          │
│                                                                            │
│ [ Nueva entrega ]                                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Últimas entregas                                                           │
│                                                                            │
│ Juan Pérez                    ✔ Publicada        [ Abrir ]                 │
│ Ana Gómez                     ⏳ Pendiente        [ Abrir ]                 │
│ Pedro López                   ⚠ Revisión         [ Abrir ]                 │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Regla

```text
Si el examen ya posee entregas:

Las preguntas no podrán modificarse.
```

---

# 9. Elegir método de creación

**Se abre cuando**

Al presionar **"+ Nuevo examen"**.

## Objetivo

Elegir cómo crear el examen.

```text
┌──────────────────────────────────────────────────────┐
│               NUEVA EVALUACIÓN                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ¿Cómo desea crear el examen?                         │
│                                                      │
│ ( ) Crear manualmente                               │
│                                                      │
│ ( ) Carga Inteligente                               │
│                                                      │
│                                                      │
│              [ Continuar ]                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 10. Creación manual

**Se abre cuando**

Elegir **Crear manualmente**.

## Objetivo

Crear preguntas una por una.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ DATOS DEL EXAMEN                                                           │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Título ____________________________                                        │
│                                                                            │
│ Fecha _____________________________                                        │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Preguntas                                                                  │
│                                                                            │
│ + Agregar pregunta                                                         │
│                                                                            │
│ Pregunta:                                                                  │
│ ______________________________________________                             │
│                                                                            │
│ Respuesta esperada:                                                        │
│ ______________________________________________                             │
│                                                                            │
│ Puntaje máximo: [ 10 ]                                                     │
│                                                                            │
│ [ + Agregar otra pregunta ]                                                │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Puntaje total: 100 puntos                                                  │
│                                                                            │
│ Criterios adicionales para IA (Opcional)                                   │
│ ______________________________________________                             │
│                                                                            │
│                     [ Guardar examen ]                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

### Regla

```text
El puntaje total se calcula automáticamente
sumando el puntaje máximo de todas las preguntas.
```

---

# 11. Carga Inteligente

**Se abre cuando**

Elegir **Carga Inteligente**.

## Objetivo

Generar automáticamente un examen.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ CARGA INTELIGENTE                                                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ ¿Cómo desea cargar el examen?                                              │
│                                                                            │
│ ( ) Pegar texto                                                            │
│                                                                            │
│ ( ) Subir archivo                                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Si elige "Pegar texto"                                                     │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Pegar aquí el examen completo junto con las respuestas esperadas.     │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ---------------------------------------------                              │
│                                                                            │
│ Si elige "Subir archivo"                                                   │
│                                                                            │
│ [ Seleccionar archivo ]                                                    │
│                                                                            │
│ Formatos permitidos:                                                       │
│                                                                            │
│ • Word (.docx)                                                             │
│ • PDF                                                                      │
│ • TXT                                                                      │
│                                                                            │
│                    [ Generar examen ]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

# 12. Revisión del examen generado

**Se abre cuando**

La IA termina de generar el examen.

## Objetivo

Permitir revisar y editar antes de guardar.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ REVISAR EXAMEN                                                             │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Título: Primer Parcial                                                     │
│                                                                            │
│ Fecha: 15/04/2026                                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Pregunta 1                                                                 │
│                                                                            │
│ ¿Qué es una célula?                                                        │
│                                                                            │
│ Respuesta esperada:                                                        │
│ La unidad básica...                                                        │
│                                                                            │
│ Puntaje máximo: [ 10 ]                                                     │
│                                                                            │
│ [ Editar ]                                                                 │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Puntaje total: 100 puntos                                                  │
│                                                                            │
│ Criterios IA                                                               │
│ ________________________________________                                   │
│                                                                            │
│                     [ Guardar examen ]                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

### Navega a

```text
Guardar examen
        │
        ▼
Detalle del examen
```

---
---

# 13. Ver preguntas

**Se abre cuando**

Al presionar **"Ver preguntas"** desde el detalle del examen.

## Objetivo

Consultar las preguntas del examen. Si el examen aún no tiene entregas, también podrán editarse.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ PREGUNTAS - Primer Parcial                                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Puntaje total: 100 puntos                                                  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Pregunta 1                                                                 │
│                                                                            │
│ ¿Qué es una célula?                                                        │
│                                                                            │
│ Puntaje máximo: 10                                                         │
│                                                                            │
│                               [ Editar ] [ Eliminar ]                      │
├────────────────────────────────────────────────────────────────────────────┤
│ Pregunta 2                                                                 │
│                                                                            │
│ ...                                                                        │
│                                                                            │
│ Puntaje máximo: 5                                                          │
│                                                                            │
│                               [ Editar ] [ Eliminar ]                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                       [ + Agregar pregunta ]                               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Regla

```text
Si el examen tiene una o más entregas:

• No se pueden agregar preguntas.
• No se pueden editar preguntas.
• No se pueden eliminar preguntas.
```

---

# 14. Nueva entrega

**Se abre cuando**

Al presionar **"Nueva entrega"**.

## Objetivo

Registrar el examen realizado por un alumno.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ NUEVA ENTREGA                                                              │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Alumno                                                                     │
│                                                                            │
│ [ Buscar alumno... ▼ ]                                                     │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Archivos del examen                                                        │
│                                                                            │
│ [ + Agregar imágenes ]                                                     │
│                                                                            │
│ [ + Agregar PDF ]                                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Archivos seleccionados                                                     │
│                                                                            │
│ 📷 hoja1.jpg                                                               │
│ 📷 hoja2.jpg                                                               │
│ 📷 hoja3.jpg                                                               │
│                                                                            │
│                         [ Quitar ]                                         │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                     [ Enviar a corregir ]                                  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Soporta

```text
✓ Una o varias imágenes.

✓ Un único PDF.

✓ Cámara del celular.
```

### Navega a

```text
Enviar a corregir

        │

        ▼

Procesando
```

---

# 15. Procesando

**Se abre automáticamente.**

## Objetivo

Mostrar que la IA está analizando la entrega.

```text
┌────────────────────────────────────────────┐
│                                            │
│              PROCESANDO                    │
│                                            │
│                  ⏳                        │
│                                            │
│ Analizando imágenes...                     │
│                                            │
│ Detectando texto...                        │
│                                            │
│ Comparando respuestas...                   │
│                                            │
│ Generando sugerencia...                    │
│                                            │
└────────────────────────────────────────────┘
```

Cuando finaliza:

```text
Procesando

      │

      ▼

Corrección IA
```

---

# 16. Corrección IA

**Se abre automáticamente al finalizar el análisis.**

## Objetivo

Permitir revisar la propuesta de la IA y aprobar la nota definitiva.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ CORRECCIÓN - Juan Pérez                                                    │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Fotografías                                                                │
│                                                                            │
│ [ Hoja 1 ] [ Hoja 2 ] [ Hoja 3 ]                                           │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Pregunta 1 de 20                                                           │
│                                                                            │
│ Respuesta esperada                                                         │
│                                                                            │
│ La unidad básica de los seres vivos...                                     │
│                                                                            │
│ -------------------------------------------------------------------------  │
│                                                                            │
│ Texto detectado                                                            │
│                                                                            │
│ "La célula..."                                                             │
│                                                                            │
│ -------------------------------------------------------------------------  │
│                                                                            │
│ Comentario IA                                                              │
│                                                                            │
│ La respuesta es correcta, pero incompleta...                               │
│                                                                            │
│ -------------------------------------------------------------------------  │
│                                                                            │
│ Puntaje IA                                                                  │
│                                                                            │
│ 8 / 10                                                                     │
│                                                                            │
│ Puntaje docente                                                             │
│                                                                            │
│ [ 8 ]                                                                      │
│                                                                            │
│                      [ Anterior ] [ Siguiente ]                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ Nota IA...................... 86 / 100                                     │
│ Nota docente................. [ 90 ]                                       │
│                                                                            │
│ Tokens consumidos............. 3.452                                       │
│                                                                            │
│ Modelo utilizado.............. Gemini                                      │
│                                                                            │
│ Estado........................ Pendiente de aprobación                     │
│                                                                            │
│                         [ Aprobar corrección ]                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Observaciones

```text
• El profesor puede modificar únicamente
  los puntajes otorgados.

• La nota docente será la definitiva.

• La nota IA permanece visible como referencia.

• Si se utilizó OpenRouter por Fallback,
  reemplazar "Gemini" por "OpenRouter".
```

---

# 17. Revisión manual

**Se abre automáticamente cuando la IA no puede corregir correctamente.**

Ejemplos:

- Pregunta con gráficos.
- Escritura ilegible.
- Baja confianza.

```text
┌──────────────────────────────────────────────────────────────┐
│                    REVISIÓN MANUAL                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ⚠ Algunas respuestas requieren revisión del profesor.        │
│                                                              │
│ Motivo detectado:                                            │
│                                                              │
│ • Escritura ilegible.                                        │
│ • Pregunta gráfica.                                          │
│                                                              │
│ La IA no asignó puntaje automáticamente para                 │
│ esas preguntas.                                              │
│                                                              │
│                 [ Revisar corrección ]                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 18. Mi perfil

**Se abre cuando**

El profesor presiona su nombre en la barra superior.

```text
┌──────────────────────────────────────────────┐
│                 MI PERFIL                    │
├──────────────────────────────────────────────┤
│                                              │
│ Nombre                                       │
│ Juan Pérez                                   │
│                                              │
│ Email                                        │
│ juan@gmail.com                               │
│                                              │
│                                              │
│          [ Cerrar sesión ]                   │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 19. Responsive

## Desktop

```text
┌──────────────┬──────────────────────────────────────────────┐
│ Sidebar      │ Contenido                                    │
│ fijo         │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## Tablet

```text
┌──────────────────────────────────────────────┐
│ Sidebar colapsable                           │
├──────────────────────────────────────────────┤
│                                              │
│ Contenido                                    │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Celular

```text
┌────────────────────────────┐
│ ☰ EvalIA                   │
├────────────────────────────┤
│                            │
│ Tarjetas verticales        │
│                            │
│ Botones grandes            │
│                            │
│ Cámara disponible          │
│ desde "Nueva entrega".     │
│                            │
└────────────────────────────┘
```

---

# Flujo completo

```text
LOGIN
   │
   ▼
DASHBOARD
   │
   ▼
CURSOS
   │
   ▼
DETALLE DEL CURSO
   │
   ├──────────────► Alumnos
   │
   ▼
Exámenes
   │
   ▼
Detalle del examen
   │
   ├──────────────► Ver preguntas
   │
   └──────────────► Nueva entrega
                           │
                           ▼
                    Procesando
                           │
                           ▼
                    Corrección IA
                           │
                           ├────────► Revisión manual
                           │
                           ▼
                  Corrección aprobada
```

---

# Fin del documento


