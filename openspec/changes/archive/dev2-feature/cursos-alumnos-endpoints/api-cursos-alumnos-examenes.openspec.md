# Especificación OpenSpec: API Cursos, Alumnos y Exámenes

## 1. Autenticación y Sesión

### POST /auth/google/login
Flujo de login con Google OAuth para obtener el token JWT de sesión.

**Headers Requeridos:**
- `Content-Type: application/json`

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "idToken": { "type": "string", "description": "Google OAuth ID Token" }
  },
  "required": ["idToken"]
}
```

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "accessToken": { "type": "string", "description": "JWT para autorización" },
    "profesor": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "nombre": { "type": "string" },
        "email": { "type": "string" }
      }
    }
  }
}
```

**Response 401 (Unauthorized):**
El token provisto es inválido o expiró.

---

## 2. Cursos (`/cursos`)

*Todos los endpoints requieren el header `Authorization: Bearer <accessToken>`.*

### GET /cursos
Listado de cursos creados o administrados por el profesor autenticado.

**Response 200 (Success):**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "nombre": { "type": "string" },
      "materia": { "type": "string" },
      "fechaCreacion": { "type": "string", "format": "date-time" },
      "examenes": {
        "type": "array",
        "description": "Agrupación lógica de exámenes pertenecientes a este curso",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "titulo": { "type": "string" },
            "fecha": { "type": "string", "format": "date-time" },
            "estado": { "type": "string" }
          }
        }
      }
    }
  }
}
```

### GET /cursos/{id}
Obtiene el detalle de un curso específico.

**Path Parameters:**
- `id`: Identificador del curso.

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "nombre": { "type": "string" },
    "materia": { "type": "string" },
    "fechaCreacion": { "type": "string", "format": "date-time" },
    "examenes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "titulo": { "type": "string" },
          "fecha": { "type": "string", "format": "date-time" },
          "estado": { "type": "string" }
        }
      }
    }
  }
}
```

**Response 404 (Not Found):**
El curso no existe.

### POST /cursos
Creación básica de un curso.

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "nombre": { "type": "string" },
    "materia": { "type": "string" }
  },
  "required": ["nombre", "materia"]
}
```

**Response 201 (Created):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "nombre": { "type": "string" },
    "materia": { "type": "string" }
  }
}
```

**Response 400 (Bad Request):**
Datos inválidos o faltantes.

---

## 3. Alumnos (`/alumnos`)

*Todos los endpoints requieren el header `Authorization: Bearer <accessToken>`.*

### GET /alumnos
Lista los alumnos con paginación. Opcionalmente puede filtrarse por curso.

**Query Parameters:**
- `cursoId` (opcional): ID del curso para filtrar alumnos.
- `page` (opcional, integer, default: 1): Página de resultados.
- `limit` (opcional, integer, default: 10): Cantidad de resultados por página.

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "nombre": { "type": "string" },
          "legajo": { "type": "string" }
        }
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "total": { "type": "integer", "description": "Total de alumnos encontrados" },
        "page": { "type": "integer" },
        "limit": { "type": "integer" },
        "totalPages": { "type": "integer" }
      }
    }
  }
}
```

### GET /alumnos/{id}
Obtiene los detalles de un alumno específico.

**Path Parameters:**
- `id`: Identificador del alumno.

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "nombre": { "type": "string" },
    "legajo": { "type": "string" }
  }
}
```

**Response 404 (Not Found):**
El alumno no existe.

### POST /alumnos
Creación de un nuevo alumno.

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "nombre": { "type": "string" },
    "legajo": { "type": "string" },
    "cursoId": { "type": "string", "description": "ID del curso al que se asocia el alumno" }
  },
  "required": ["nombre", "legajo", "cursoId"]
}
```

**Response 201 (Created):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "nombre": { "type": "string" },
    "legajo": { "type": "string" }
  }
}
```

**Response 400 (Bad Request):**
Error en validación de campos.

### PUT /alumnos/{id}
Actualiza los datos de un alumno existente.

**Path Parameters:**
- `id`: Identificador del alumno.

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "nombre": { "type": "string" },
    "legajo": { "type": "string" }
  }
}
```

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "nombre": { "type": "string" },
    "legajo": { "type": "string" }
  }
}
```

**Response 404 (Not Found):**
El alumno no existe.

### DELETE /alumnos/{id}
Elimina un alumno.

**Path Parameters:**
- `id`: Identificador del alumno.

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "success": { "type": "boolean" }
  }
}
```

**Response 404 (Not Found):**
El alumno no existe.

---

## 4. Exámenes Manuales (`/examenes`)

*Requiere el header `Authorization: Bearer <accessToken>`.*

### GET /examenes
Lista los exámenes creados con paginación. Opcionalmente filtrable por curso.

**Query Parameters:**
- `cursoId` (opcional): ID del curso.
- `page` (opcional, integer, default: 1): Página de resultados.
- `limit` (opcional, integer, default: 10): Cantidad de resultados por página.

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "titulo": { "type": "string" },
          "fecha": { "type": "string", "format": "date-time" },
          "estado": { "type": "string" },
          "cursoId": { "type": "string" }
        }
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "total": { "type": "integer" },
        "page": { "type": "integer" },
        "limit": { "type": "integer" },
        "totalPages": { "type": "integer" }
      }
    }
  }
}
```

### POST /examenes
Crea un examen vinculado a un curso (o materia) y define la lista de preguntas junto con sus criterios de evaluación.

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "titulo": { "type": "string" },
    "cursoId": { "type": "string" },
    "materia": { "type": "string" },
    "puntajeTotal": { "type": "number", "description": "Suma de los puntajes máximos de las preguntas" },
    "criteriosAdicionales": { "type": "string", "description": "Opcional: Criterios adicionales de corrección para la IA" },
    "preguntas": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "enunciado": { "type": "string" },
          "respuestaEsperada": { "type": "string" },
          "puntajeMaximo": { "type": "number" },
          "esEvaluacionVisual": { "type": "boolean", "description": "Indica si la IA debe omitir calificar esta pregunta para revisión manual" }
        },
        "required": ["enunciado", "respuestaEsperada", "puntajeMaximo", "esEvaluacionVisual"]
      }
    }
  },
  "required": ["titulo", "cursoId", "materia", "puntajeTotal", "preguntas"]
}
```

**Response 201 (Created):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "titulo": { "type": "string" },
    "fecha": { "type": "string", "format": "date-time" },
    "estado": { "type": "string" }
  }
}
```

**Response 400 (Bad Request):**
Error en validación (por ejemplo, si el puntaje total no coincide con la suma de los puntajes máximos, o faltan campos obligatorios).

---

## 5. Vistas y Ruteo (Frontend)

*Esta sección detalla la organización de páginas y lógica de interfaz en el cliente.*

### 5.1. Ruteo Real y Páginas
Se reemplaza la navegación basada en estados locales (`setScreen`) por un ruteo real (`router.push`, `<Link>`, `useParams`).

Rutas a implementar:
- **`/cursos`**: Página con la lista general de cursos.
- **`/cursos/[id]`**: Detalle de un curso específico (incluye la visualización agrupada de alumnos y exámenes).
- **`/alumnos/[id]/editar`**: Página dedicada a la edición de un alumno existente.
- **`/examenes`**: Vista de gestión y creación de exámenes.

### 5.2. Gestión de Cursos y Alumnos (Tarea 7)
- **Componentes CRUD**: Formularios y tablas para gestionar alumnos llamando a la API `/alumnos`.
- **Estados Visuales Vacíos (Empty States)**: 
  - Si no existen cursos: Mostrar diseño invitando a crear el primer curso.
  - Si un curso no tiene alumnos: Mostrar diseño orientado a añadir el primer alumno.

### 5.3. Formulario de Creación de Examen Manual (Tarea 8)
- **Campos del Examen**: Título, Materia, Puntaje Total, Curso (Selector) y Criterios Adicionales.
- **Lista de Preguntas (Dinámica)**: Permite añadir N preguntas, requiriendo Enunciado, Respuesta Esperada, Puntaje Máximo, y un control booleano (checkbox) para `esEvaluacionVisual`.
- **Validación Visual Estratégica**: El formulario bloqueará el envío (submit) si la suma de los puntajes máximos de cada pregunta en la vista no coincide exactamente con el "Puntaje Total" esperado del examen.
