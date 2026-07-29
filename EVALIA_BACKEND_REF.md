# EvalIA Backend - Referencia de la API REST y Modelos
Este archivo sirve como especificación técnica del backend de **EvalIA** para conectar el frontend (Next.js) de manera precisa.

---

## ⚙️ Configuración del Entorno de Desarrollo
- **URL Base:** `http://localhost:3000`
- **Carpeta de Uploads (Archivos Estáticos):** Servida públicamente en `http://localhost:3000/uploads/nombre_del_archivo`
- **Base de Datos:** SQLite local (`prisma/dev.db`).

---

## 🗄️ Modelo de Datos (Prisma v7)

### Estados de una Entrega (`Entrega.estado`)
1. **`PENDIENTE`**: Creado al subir la foto/PDF.
2. **`PROCESANDO`**: La IA está evaluando en segundo plano.
3. **`REQUIERE_REVISION`**: Se activa si el nivel de confianza de la IA es `BAJO` o el examen contiene preguntas marcadas con `esEvaluacionVisual = true`.
4. **`PENDIENTE_APROBACION`**: La IA corrigió con éxito y buena confianza; espera confirmación del docente.
5. **`PUBLICADO`**: Calificación final aprobada por el profesor.

---

## 📡 Endpoints de la API REST

### 1. Gestión de Cursos

#### **Crear un Curso**
- **Método & Ruta:** `POST /api/v1/cursos`
- **Headers (Opcional):**
  - `x-teacher-id`: ID de un profesor específico. Si se omite, el backend creará/usará un profesor por defecto para facilitar las pruebas.
- **Request Body (JSON):**
  ```json
  {
    "materia": "Matemática",
    "anio": 5,
    "division": "A",
    "anioLectivo": 2026
  }
  ```
- **Response (JSON):**
  ```json
  {
    "id": "bca52f39-7f37-4daa-93be-dc145bbbbe85",
    "materia": "Matemática",
    "anio": 5,
    "division": "A",
    "anioLectivo": 2026,
    "profesorId": "78eaae0a-e279-48a8-a69a-323f10cbdaaf"
  }
  ```

#### **Listar Cursos**
- **Método & Ruta:** `GET /api/v1/cursos`
- **Headers (Opcional):**
  - `x-teacher-id`: ID del profesor.
- **Response (JSON):** Retorna un array con los cursos asociados, incluyendo recuentos de exámenes e información de los alumnos matriculados.

---

### 2. Alumnos y Exámenes

#### **Registrar Alumno en un Curso**
- **Método & Ruta:** `POST /api/v1/cursos/:id/alumnos`
- **Request Body (JSON):**
  ```json
  {
    "nombre": "Juan",
    "apellido": "Pérez",
    "legajo": "L-12345"
  }
  ```
- **Response (JSON):** Retorna el objeto `Alumno` creado o asociado.

#### **Crear Examen en un Curso**
- **Método & Ruta:** `POST /api/v1/cursos/:id/examenes`
- **Request Body (JSON):**
  ```json
  {
    "titulo": "Examen de Álgebra",
    "preguntas": [
      {
        "enunciado": "¿Cuánto es 2 + 2?",
        "respuestaEsperada": "4",
        "puntajeMaximo": 5,
        "criteriosIA": "Aceptar resolución paso a paso (sinónimos o justificaciones equivalentes)",
        "esEvaluacionVisual": false
      },
      {
        "enunciado": "Dibuje una función lineal creciente.",
        "respuestaEsperada": "Un gráfico con una recta de pendiente positiva",
        "puntajeMaximo": 5,
        "criteriosIA": null,
        "esEvaluacionVisual": true
      }
    ]
  }
  ```
- **Response (JSON):** Retorna el examen creado junto a sus preguntas.

---

### 3. Entregas y Correcciones

#### **Crear y Subir una Entrega**
- **Método & Ruta:** `POST /api/v1/entregas`
- **Request Format:** `multipart/form-data`
- **Campos del Formulario:**
  - `examId` (string): ID del examen.
  - `alumnoId` (string): ID del alumno.
  - `file` (File/Blob): Archivo de la entrega (JPG, PNG, WEBP, PDF).
- **Response (JSON):**
  ```json
  {
    "id": "04d98354-7b61-4c96-9e99-bd360a4ac743",
    "examenId": "b4ac5b0d-6229-4323-85e5-d082cb3a4736",
    "alumnoId": "0c981beb-76ef-4fb2-b366-139ea83c97de",
    "archivo": "uploads/1785169025460-6fc2d9e3-57b2-4bcc-863d-7701100d1531.txt",
    "estado": "PENDIENTE"
  }
  ```
  *(Nota: El procesamiento de la IA con Gemini y fallback a OpenRouter se dispara de forma asíncrona inmediatamente después en segundo plano, cambiando el estado a `PROCESANDO` y luego a `REQUIERE_REVISION` o `PENDIENTE_APROBACION`)*.

#### **Obtener Detalles de una Entrega**
- **Método & Ruta:** `GET /api/v1/entregas/:id`
- **Response (JSON):**
  ```json
  {
    "id": "04d98354-7b61-4c96-9e99-bd360a4ac743",
    "examenId": "...",
    "alumnoId": "...",
    "archivo": "uploads/...",
    "estado": "REQUIERE_REVISION",
    "alumno": { "id": "...", "nombre": "...", "apellido": "...", "legajo": "..." },
    "examen": { "id": "...", "titulo": "...", "preguntas": [...] },
    "correccion": {
      "id": "...",
      "entregaId": "...",
      "notaIA": 5.0,
      "notaFinal": null,
      "nivelConfianza": "MEDIO",
      "feedbackJSON": "...", // Contiene observaciones y desglose de puntajes sugeridos por la IA
      "fechaAprobacion": null
    }
  }
  ```

#### **Aprobar Entrega por el Profesor**
- **Método & Ruta:** `PUT /api/v1/entregas/:id/aprobar`
- **Request Body (JSON):**
  ```json
  {
    "notaFinal": 8.5,
    "observaciones": "Buen intento, faltó precisión en el dibujo."
  }
  ```
- **Response (JSON):** Retorna la entrega en estado `PUBLICADO` y la corrección actualizada con la firma y nota definitiva del docente.
