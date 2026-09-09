# EspecificaciÃ³n OpenSpec: API Cursos, Alumnos y ExÃ¡menes

## 1. AutenticaciÃ³n y SesiÃ³n

### POST /auth/google/login
Flujo de login con Google OAuth para obtener el token JWT de sesiÃ³n.

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
    "accessToken": { "type": "string", "description": "JWT para autorizaciÃ³n" },
    "profesor": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
        "email": { "type": "string" }
      }
    }
  }
}
```

**Response 401 (Unauthorized):**
El token provisto es invÃ¡lido o expirÃ³.

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
      "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
      "materia": { "type": "string" },
      "fechaCreacion": { "type": "string", "format": "date-time" },
      "examenes": {
        "type": "array",
        "description": "AgrupaciÃ³n lÃ³gica de exÃ¡menes pertenecientes a este curso",
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
Obtiene el detalle de un curso especÃ­fico.

**Path Parameters:**
- `id`: Identificador del curso.

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
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
CreaciÃ³n bÃ¡sica de un curso.

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
    "materia": { "type": "string" }
  },
  "required": ["materia", "anio", "division", "anioLectivo"]
}
```

**Response 201 (Created):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
    "materia": { "type": "string" }
  }
}
```

**Response 400 (Bad Request):**
Datos invÃ¡lidos o faltantes.

---

## 3. Alumnos (`/alumnos`)

*Todos los endpoints requieren el header `Authorization: Bearer <accessToken>`.*


### PUT /cursos/{id}
Actualiza los datos de un curso.

**Path Parameters:**
- id: Identificador del curso.

**Request Schema:**
`json
{
  "type": "object",
  "properties": {
    "materia": { "type": "string" },
    "anio": { "type": "integer" },
    "division": { "type": "string" },
    "anioLectivo": { "type": "integer" }
  }
}
`

**Response 200 (Success):**
`json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "materia": { "type": "string" },
    "anio": { "type": "integer" },
    "division": { "type": "string" },
    "anioLectivo": { "type": "integer" }
  }
}
`

**Response 404 (Not Found):**
El curso no existe.

### DELETE /cursos/{id}
Elimina un curso.

**Path Parameters:**
- id: Identificador del curso.

**Response 200 (Success):**
`json
{
  "type": "object",
  "properties": {
    "success": { "type": "boolean" }
  }
}
`

**Response 404 (Not Found):**
El curso no existe.

### GET /alumnos
Lista los alumnos con paginaciÃ³n. Opcionalmente puede filtrarse por curso.

**Query Parameters:**
- `cursoId` (opcional): ID del curso para filtrar alumnos.
- `page` (opcional, integer, default: 1): PÃ¡gina de resultados.
- `limit` (opcional, integer, default: 10): Cantidad de resultados por pÃ¡gina.

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
          "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
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


### PUT /cursos/{id}
Actualiza los datos de un curso.

**Path Parameters:**
- id: Identificador del curso.

**Request Schema:**
`json
{
  "type": "object",
  "properties": {
    "materia": { "type": "string" },
    "anio": { "type": "integer" },
    "division": { "type": "string" },
    "anioLectivo": { "type": "integer" }
  }
}
`

**Response 200 (Success):**
`json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "materia": { "type": "string" },
    "anio": { "type": "integer" },
    "division": { "type": "string" },
    "anioLectivo": { "type": "integer" }
  }
}
`

**Response 404 (Not Found):**
El curso no existe.

### DELETE /cursos/{id}
Elimina un curso.

**Path Parameters:**
- id: Identificador del curso.

**Response 200 (Success):**
`json
{
  "type": "object",
  "properties": {
    "success": { "type": "boolean" }
  }
}
`

**Response 404 (Not Found):**
El curso no existe.

### GET /alumnos/{id}
Obtiene los detalles de un alumno especÃ­fico.

**Path Parameters:**
- `id`: Identificador del alumno.

**Response 200 (Success):**
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
    "legajo": { "type": "string" }
  }
}
```

**Response 404 (Not Found):**
El alumno no existe.

### POST /alumnos
CreaciÃ³n de un nuevo alumno.

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
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
    "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
    "legajo": { "type": "string" }
  }
}
```

**Response 400 (Bad Request):**
Error en validaciÃ³n de campos.

### PUT /alumnos/{id}
Actualiza los datos de un alumno existente.

**Path Parameters:**
- `id`: Identificador del alumno.

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
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
    "anio": { "type": "integer" }, "division": { "type": "string" }, "anioLectivo": { "type": "integer" },
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

## 4. ExÃ¡menes Manuales (`/examenes`)

*Requiere el header `Authorization: Bearer <accessToken>`.*

### GET /examenes
Lista los exÃ¡menes creados con paginaciÃ³n. Opcionalmente filtrable por curso.

**Query Parameters:**
- `cursoId` (opcional): ID del curso.
- `page` (opcional, integer, default: 1): PÃ¡gina de resultados.
- `limit` (opcional, integer, default: 10): Cantidad de resultados por pÃ¡gina.

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
Crea un examen vinculado a un curso (o materia) y define la lista de preguntas junto con sus criterios de evaluaciÃ³n.

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "titulo": { "type": "string" },
    "cursoId": { "type": "string" },
    "materia": { "type": "string" },
    "puntajeTotal": { "type": "number", "description": "Suma de los puntajes mÃ¡ximos de las preguntas" },
    "criteriosAdicionales": { "type": "string", "description": "Opcional: Criterios adicionales de correcciÃ³n para la IA" },
    "preguntas": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "enunciado": { "type": "string" },
          "respuestaEsperada": { "type": "string" },
          "puntajeMaximo": { "type": "number" },
          "esEvaluacionVisual": { "type": "boolean", "description": "Indica si la IA debe omitir calificar esta pregunta para revisiÃ³n manual" }
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
Error en validaciÃ³n (por ejemplo, si el puntaje total no coincide con la suma de los puntajes mÃ¡ximos, o faltan campos obligatorios).

---

## 5. Vistas y Ruteo (Frontend)

*Esta secciÃ³n detalla la organizaciÃ³n de pÃ¡ginas y lÃ³gica de interfaz en el cliente.*

### 5.1. Ruteo Real y PÃ¡ginas
Se reemplaza la navegaciÃ³n basada en estados locales (`setScreen`) por un ruteo real (`router.push`, `<Link>`, `useParams`).

Rutas a implementar:
- **`/cursos`**: PÃ¡gina con la lista general de cursos.
- **`/cursos/[id]`**: Detalle de un curso especÃ­fico (incluye la visualizaciÃ³n agrupada de alumnos y exÃ¡menes).
- **`/alumnos/[id]/editar`**: PÃ¡gina dedicada a la ediciÃ³n de un alumno existente.
- **`/examenes`**: Vista de gestiÃ³n y creaciÃ³n de exÃ¡menes.

### 5.2. GestiÃ³n de Cursos y Alumnos (Tarea 7)
- **Componentes CRUD**: Formularios y tablas para gestionar alumnos llamando a la API `/alumnos`.
- **Estados Visuales VacÃ­os (Empty States)**: 
  - Si no existen cursos: Mostrar diseÃ±o invitando a crear el primer curso.
  - Si un curso no tiene alumnos: Mostrar diseÃ±o orientado a aÃ±adir el primer alumno.

### 5.3. Formulario de CreaciÃ³n de Examen Manual (Tarea 8)
- **Campos del Examen**: TÃ­tulo, Materia, Puntaje Total, Curso (Selector) y Criterios Adicionales.
- **Lista de Preguntas (DinÃ¡mica)**: Permite aÃ±adir N preguntas, requiriendo Enunciado, Respuesta Esperada, Puntaje MÃ¡ximo, y un control booleano (checkbox) para `esEvaluacionVisual`.
- **ValidaciÃ³n Visual EstratÃ©gica**: El formulario bloquearÃ¡ el envÃ­o (submit) si la suma de los puntajes mÃ¡ximos de cada pregunta en la vista no coincide exactamente con el "Puntaje Total" esperado del examen.


