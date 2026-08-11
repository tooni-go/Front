# 📅 Plan de Sprint 1 - Core MVP con Corrección por IA

*   **Fecha de Entrega:** 24 de Agosto de 2026 (24/08/26)
*   **Capacidad del Equipo:** 3 desarrolladores × 4 horas/día (máx) × 10 días hábiles = **120 horas teóricas máximas**.
*   **Capacidad Planificada Real:** Se planifica un total de **~65 - 75 horas de desarrollo efectivo** (~17-26 horas por desarrollador) para absorber la curva de aprendizaje, preparación de exámenes y dejar un margen de seguridad del 40%.
*   **Enfoque de Desarrollo:** Foco exclusivo en el flujo crítico (login, gestión de cursos/alumnos/exámenes, subida de entrega y pre-corrección con IA con aprobación docente). La infraestructura, despliegue y extras de IA se posponen al Sprint 2 o quedan como Stretch Goals.

---

## ✂️ Ajustes de Alcance (Simplificación para MVP)

Para garantizar la entrega en la fecha límite con el horario reducido de estudiantes:
1.  **Postergado a Sprint 2 (Infra y DevOps):** Se quita Docker, GitHub Actions y el despliegue automático.
2.  **Postergado a Sprint 2 (Administración Avanzada):** Se elimina la edición/eliminación/duplicación de exámenes y el CRUD completo de cursos (solo se creará y listará). El perfil del profesor no se podrá editar.
3.  **Movido a Stretch Goals (IA Extra):** La "Carga Inteligente de Exámenes" (extracción de texto de PDF para generar preguntas) y el "Mecanismo de Fallback" (Gemini -> OpenRouter) pasan a ser opcionales.

---

## 👥 Asignación de Tareas (4 Tareas por Desarrollador)

### 👤 Desarrollador 1: Base de Datos, Autenticación y Guard de Sesión Core
*Enfocado en asegurar la sesión del usuario, la base de datos local y la comunicación segura frontend-backend.*

*   **Tarea 1: Inicialización de Base de Datos y Prisma (MVP)**
    *   Definir el esquema Prisma SQLite local (`Profesor`, `Alumno`, `Examen`, `Pregunta`, `Entrega`, `Corrección`).
    *   Crear script de seed básico (`prisma/seed.ts`) para contar con datos de prueba al iniciar.
    *   *Estimación:* 3 horas
*   **Tarea 2: Autenticación NestJS (Backend)**
    *   Implementar validación de tokens de Google OAuth en el backend (NestJS) y DTOs correspondientes.
    *   Crear servicio y endpoint `/auth/login` para manejar el login y devolver el JWT de sesión interno.
    *   *Estimación:* 4 horas
*   **Tarea 3: Configuración NextAuth.js y Login UI (Frontend)**
    *   Configurar NextAuth.js con Google Provider en el frontend.
    *   Crear el componente y página de Login con redirección adecuada.
    *   *Estimación:* 5 horas
*   **Tarea 4: Guard de Sesión, Seguridad y Cliente API**
    *   Implementar middleware de protección de rutas privadas en el frontend.
    *   Conectar el routing raíz (`/`) y el layout protegido al estado de sesión real (bloquear acceso al dashboard si no está logueado).
    *   Crear cliente HTTP unificado (Axios/Fetch) con interceptor para adjuntar el JWT automáticamente.
    *   *Estimación:* 5 horas
*   **Esfuerzo Total Dev 1:** **17 horas** (tiempo libre para apoyo en integración y pruebas).

---

### 👤 Desarrollador 2: Gestión de Cursos, Alumnos y Exámenes (Estructura y Ruteo Real)
*Enfocado en la creación de los datos principales (alumnos, cursos, exámenes) y la migración a navegación web real.*

*   **Tarea 5: Definición de Contratos de API (OpenSpec - Fase 1)**
    *   Definir openspec con schemas JSON de entrada/salida para login, listado de cursos, CRUD de alumnos y creación manual de exámenes (incluyendo flag `esEvaluacionVisual`).
    *   *Estimación:* 4 horas
*   **Tarea 6: Endpoints Backend de Cursos y Alumnos (MVP)**
    *   Crear esquema DTO y endpoints CRUD (`GET`, `POST`, `PUT`, `DELETE` en `/alumnos`).
    *   Crear endpoint para obtener agrupaciones lógicas de exámenes por curso (`GET /cursos` + creación básica `POST /cursos`).
    *   *Estimación:* 5 horas
*   **Tarea 7: Gestión de Cursos y Alumnos en Frontend (Páginas y Routing Real)**
    *   Crear páginas `/cursos` (lista), `/cursos/[id]` (detalle) y el formulario/tabla CRUD de alumnos.
    *   **Routing Real:** Reemplazar la navegación basada en estados locales (`setScreen`) por ruteo real (`router.push`, `<Link>`, `useParams`).
    *   Crear la ruta `/alumnos/[id]/editar` y agregar estados visuales vacíos si no hay alumnos o cursos.
    *   *Estimación:* 8 horas
*   **Tarea 8: Creación de Examen Manual y Validación de Puntajes**
    *   Backend: Endpoint para crear examen y preguntas vinculadas a un curso (criterios de corrección y flag `esEvaluacionVisual`).
    *   Frontend: Vista `/examenes` y formulario de creación de examen manual con validación visual para que el puntaje de las preguntas sume el total esperado.
    *   *Estimación:* 8 horas
*   **Esfuerzo Total Dev 2:** **25 horas**.

---

### 👤 Desarrollador 3: Entregas y Motor de Corrección por IA
*Enfocado en la carga física de exámenes y la pre-corrección usando el SDK de Gemini.*

*   **Tarea 9: Definición de Contratos de IA y Cliente Gemini (Backend)**
    *   Definir openspec para el JSON de respuesta de IA (notaIA, confianza, feedbackJSON, etc.).
    *   Configurar cliente de Gemini API en NestJS para procesar imágenes/PDFs.
    *   *Estimación:* 5 horas
*   **Tarea 10: Backend de Entregas y Máquina de Estados**
    *   Crear endpoint multipart de subida de entregas (`POST /api/v1/entregas`) y procesamiento de archivos.
    *   Implementar máquina de estados del ciclo de entrega (`PENDIENTE` ➔ `PROCESANDO` ➔ `REQUIERE_REVISION`/`PENDIENTE_APROBACION` ➔ `PUBLICADO`).
    *   *Estimación:* 6 horas
*   **Tarea 11: Componente de Carga de Entregas (Frontend)**
    *   Migrar `NuevaEntregaView.tsx` para soportar carga de PDFs/imágenes.
    *   Habilitar soporte de cámara móvil nativa para la captura de fotos directamente desde el dispositivo del docente.
    *   *Estimación:* 5 horas
*   **Tarea 12: Servicio de Corrección y Pantalla de Aprobación Docente**
    *   Backend: Enviar respuestas de la entrega a Gemini, validar la salida mediante JSON estricto (Guardrails), y marcar como `REQUIERE_REVISION` si la confianza es baja o tiene preguntas de evaluación visual (`esEvaluacionVisual = true`).
    *   Frontend: Vista de revisión asistida (comparar nota IA vs final, observaciones por pregunta y botón para Aprobar/Publicar corrección). Conectar pantalla "Analizando..." al estado de carga real de la API.
    *   *Estimación:* 10 horas
*   **Esfuerzo Total Dev 3:** **26 horas**.

---

## 🚀 Stretch Goals (Opcionales para este Sprint)

Si el equipo avanza rápido y dispone de horas extra, se abordarán estas tareas en orden de prioridad:
1.  **Carga Inteligente de Examen (IA & Frontend):** Pegar el examen en formato texto y que la IA extraiga automáticamente las preguntas y respuestas sugeridas (Tarea 3.1 del documento original).
2.  **Dockerización de Desarrollo:** Configurar `docker-compose.yml` local y Dockerfiles resolviendo el conflicto de puerto 3000.
3.  **Seguridad de Entorno:** Rotación de API keys expuestas en el `.env` actual y creación del `.env.example`.
4.  **Mecanismo de Fallback de IA:** Gemini ➔ OpenRouter.
