# 📅 Plan de Sprint 3 - Despliegue Fullstack Unificado (CD), Productividad Docente y Motores de IA

*   **Fecha de Inicio:** 14 de Septiembre de 2026 (14/09/26)
*   **Fecha de Finalización:** 28 de Septiembre de 2026 (28/09/26) — **Duración: 2 semanas (10 días hábiles)**.
*   **Capacidad del Equipo:** 3 desarrolladores × 4 horas/día (máx) = **60 horas de capacidad real planificada** (máximo **20 horas por desarrollador**).
*   **Capacidad Planificada Efectiva:** Se planifica un total de **56 horas de desarrollo efectivo** (~18-19 horas por desarrollador) garantizando un reparto equitativo de carga y margen de seguridad para pruebas e integración.
*   **Enfoque de Desarrollo:** Alojamiento conjunto y despliegue continuo (CD) del stack fullstack (Frontend Next.js y Backend NestJS juntos en la misma plataforma: Render, Railway o Vercel) e impulsar la productividad docente y la experiencia de aula mediante 5 mejoras clave seleccionadas de `mejoras.txt`:
    1. **Despliegue Continuo (CD) y Hosting Fullstack Unificado en la Nube (Render / Railway / Vercel)** (Mejora #15 + Pendiente DevOps)
    2. **Exámenes en Modo Borrador (Drafts)** (Mejora #1)
    3. **Importación Masiva de Alumnos vía Excel / CSV** (Mejora #17)
    4. **Generador de Exámenes Listos para Imprimir con Membrete** (Mejora #4)
    5. **Edición Atómica y Ajuste Focalizado de Consignas con IA** (Mejora #16)
    6. **Analíticas Pedagógicas y Mapa de Calor del Examen** (Mejoras #6 y #7)

---

## 🎯 Objetivos y Alcance del Sprint 3

1.  **DevOps, Hosting Unificado y Despliegue Continuo (CD):** Poner en producción la plataforma completa alojando **backend y frontend juntos en el mismo proveedor de hosting** (Render, Railway o Vercel), garantizando la conectividad en la misma red/plataforma y configurando el pipeline de auto-deploy continuo mediante GitHub Actions / Webhooks / Blueprints.
2.  **Ciclo de Vida y Modo Borrador de Exámenes:** Permitir a los docentes crear, pausar y retomar la elaboración de exámenes en estado "Borrador" antes de publicarlos y habilitar la recepción de entregas.
3.  **Onboarding Rápido de Estudiantes:** Permitir la carga de divisiones enteras mediante importación masiva de archivos `.xlsx` / `.csv` (SIU Guaraní / planillas de cálculo) con detección automática de columnas y previsualización de errores.
4.  **Maquetación de Exámenes para Aula Física:** Generar versiones imprimibles en PDF con membrete institucional configurable, datos del estudiante, tabla de puntajes y renglones de desarrollo.
5.  **IA Focalizada y Diagnóstico Pedagógico:** Habilitar la edición y regeneración atómica de preguntas con IA ("✨ Ajustar con IA") y brindar un panel de métricas post-corrección con mapa de calor de preguntas más falladas.

---

## 👥 Asignación de Tareas (Reparto Equitativo ≤ 20 hs por Desarrollador)

### 👤 Desarrollador 1: Despliegue Fullstack Unificado (CD en Render / Railway / Vercel) y Modo Borrador
*Enfocado en la puesta en producción y hosting conjunto de frontend y backend en la misma plataforma, automatización del pipeline CD y el ciclo de vida de exámenes en borrador.*

*   **Tarea 1: Hosting y Despliegue Unificado de Frontend y Backend en la Nube**
    *   Configurar el entorno fullstack conjunto en la plataforma seleccionada (Render Web Services compartidos / Blueprint `render.yaml`, Railway Project conjunto con ambos servicios, o Vercel con servidor backend integrado).
    *   Configurar el build y arranque de `evalia-backend` (NestJS) y `evalia-frontend` (Next.js) con Docker / Node runtimes en el mismo proyecto/cuenta.
    *   Verificar persistencia de la base de datos (SQLite / Postgres) y carpeta de uploads en el entorno productivo.
    *   *Estimación:* 5 horas
*   **Tarea 2: Configuración de Variables de Entorno, Red Interna, CORS y Autenticación**
    *   Vincular la comunicación directa entre frontend y backend dentro de la misma plataforma (`NEXT_PUBLIC_API_URL` apuntando a la URL del backend).
    *   Configurar variables de entorno productivas (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`).
    *   Actualizar los orígenes autorizados de CORS y las URIs de redirección de Google OAuth en Google Cloud Console para el dominio de producción.
    *   *Estimación:* 4 horas
*   **Tarea 3: Pipeline de Despliegue Continuo (CD) Automatizado y Health Check**
    *   Configurar el flujo de auto-deploy sincronizado (GitHub Actions / Webhooks / Blueprints) para que cada push o merge a la rama principal (`main` / `develop`) actualice ambos servicios automáticamente.
    *   Implementar endpoint liviano de Health Check (`GET /api/v1/health`) para monitoreo de uptime y estado de los servicios.
    *   *Estimación:* 4 horas
*   **Tarea 4: Exámenes en Modo Borrador (Drafts) - Backend & Frontend**
    *   Actualizar modelo `Examen` con enum `EstadoExamen` (`BORRADOR`, `PUBLICADO`, `ARCHIVADO`) y endpoint de cambio de estado (`PATCH /api/v1/examenes/:id/estado`).
    *   Bloquear subida de entregas a exámenes en borrador (HTTP 400 descriptivo).
    *   Frontend: Botón "Guardar como Borrador", badges de estado visual (`Borrador` vs `Publicado`) en el listado/detalle y acción destacada "Publicar Examen".
    *   *Estimación:* 5 horas
*   **Esfuerzo Total Dev 1:** **18 horas** (2 horas de margen para pruebas de infraestructura y soporte).

---

### 👤 Desarrollador 2: Importación Masiva de Alumnos (Excel/CSV) y Exámenes Imprimibles (PDF con Membrete)
*Enfocado en el onboarding masivo de estudiantes y en la exportación y maquetación de exámenes listos para el aula física.*

*   **Tarea 5: Backend - Endpoint de Importación Masiva de Alumnos (`POST /cursos/:id/alumnos/importar-masivo`)**
    *   Crear endpoint para procesar lotes de alumnos desde hojas `.xlsx` o `.csv` (compatible con SIU Guaraní y Excel).
    *   Validar duplicados por legajo dentro del curso y ejecutar transacciones en bloque con Prisma con reporte de filas exitosas y con error.
    *   *Estimación:* 4 horas
*   **Tarea 6: Frontend - Componente de Importación Masiva de Alumnos (Dropzone & Previsualización)**
    *   Crear zona drag & drop para subir archivos Excel/CSV en el detalle del curso (`/cursos/[id]`).
    *   Tabla de previsualización interactiva con detección automática de columnas (`Nombre`, `Apellido`, `Legajo`, `Email`), alertas de duplicados y confirmación de guardado.
    *   *Estimación:* 5 horas
*   **Tarea 7: Frontend - Motor de Maquetación de Examen para Impresión (PDF con Membrete)**
    *   Desarrollar la vista maquetada de examen lista para imprimir en papel: encabezado institucional (institución, materia, fecha, docente), recuadro para datos de alumno (Nombre, Legajo), grilla de puntajes por pregunta y renglones de desarrollo.
    *   Configurar reglas CSS de impresión (`@media print`) y botón de exportación rápida a PDF.
    *   *Estimación:* 6 horas
*   **Tarea 8: Frontend/Backend - Personalización y Preferencias de Membrete Institucional**
    *   Modal de configuración previo a la impresión (tamaño de renglones, mostrar/ocultar puntajes, instrucciones docentes).
    *   Persistir preferencias de membrete asociadas al docente/curso.
    *   *Estimación:* 4 horas
*   **Esfuerzo Total Dev 2:** **19 horas** (1 hora de margen para pruebas e integración).

---

### 👤 Desarrollador 3: Motor de IA Atómico ("Ajustar con IA") y Analíticas Pedagógicas (Mapa de Calor)
*Enfocado en la regeneración granular de consignas por IA y en el panel analítico de rendimiento estudiantil post-corrección.*

*   **Tarea 9: Backend - Endpoint de Regeneración Atómica con IA (`POST /api/v1/examenes/preguntas/regenerar-individual`)**
    *   Implementar endpoint que reciba una pregunta y parámetros de ajuste (cambio de dificultad, formato de pregunta o refraseo) y devuelva únicamente la consigna modificada con IA (Gemini con fallback a OpenRouter).
    *   Diseñar guardrails con validación estricta de esquema JSON para la respuesta individual.
    *   *Estimación:* 5 horas
*   **Tarea 10: Frontend - Edición Atómica y Modal "✨ Ajustar con IA" por Tarjeta de Pregunta**
    *   Inputs editables en tiempo real para enunciado, respuesta esperada y puntaje en `ExamenRevisionGeneradoView` y `ExamenEditarView`.
    *   Modal/Popover interactivo en cada tarjeta para seleccionar dificultad, tipo de consigna e instrucción personalizada, con preview comparativo antes/después (Aceptar/Descartar).
    *   *Estimación:* 5 horas
*   **Tarea 11: Backend - Endpoints de Métricas y Diagnóstico Pedagógico (`GET /examenes/:id/metricas`)**
    *   Calcular de forma agregada las estadísticas del examen (promedio del curso, nota máx/mín, % aprobación).
    *   Calcular el porcentaje de error y acierto por pregunta individual para el diagnóstico del curso.
    *   *Estimación:* 4 horas
*   **Tarea 12: Frontend - Dashboard de Analíticas y Mapa de Calor de Preguntas Más Falladas**
    *   Vista/tab de analíticas en el detalle del examen con tarjetas de resumen (KPIs) y curva de calificaciones.
    *   Componente de **Mapa de Calor** interactivo que destaca visualmente las preguntas más falladas para alertar al docente qué conceptos reforzar en clase.
    *   *Estimación:* 5 horas
*   **Esfuerzo Total Dev 3:** **19 horas** (1 hora de margen para pruebas e integración).

---

## 📊 Resumen de Carga de Trabajo y Horas

| Rol / Desarrollador | Área Principal de Foco | Tareas Asignadas | Horas Estimadas | Límite Máximo |
| :--- | :--- | :---: | :---: | :---: |
| **Desarrollador 1 (Tú)** | Despliegue Fullstack Unificado (CD) + Modo Borrador | 4 tareas | **18 hs** | 20 hs (Cumple ✅) |
| **Desarrollador 2** | Importación Masiva (Excel/CSV) + Exámenes Imprimibles (PDF) | 4 tareas | **19 hs** | 20 hs (Cumple ✅) |
| **Desarrollador 3** | Edición Atómica con IA + Analíticas (Mapa de Calor) | 4 tareas | **19 hs** | 20 hs (Cumple ✅) |
| **TOTAL** | **Full Project Sprint 3** | **12 tareas** | **56 hs** | **60 hs** |

---

## 🚀 Stretch Goals (Opcionales para este Sprint)

Si el equipo completa las tareas antes del 28/09/26:
1.  **Configuración de API Key Personalizada del Docente (BYOK - Bring Your Own Key):** Permitir al docente ingresar su propia clave de API y seleccionar un modelo alternativo (OpenAI, Claude, DeepSeek o cuenta propia de Gemini/OpenRouter) desde su perfil, liberando el consumo de la cuota global del servidor.
2.  **Autoguardado Local (Autosave con LocalStorage / IndexedDB):** Guardar en tiempo real el borrador de exámenes y revisiones de entregas ante cortes de conexión (Mejora #20 de backlog).
3.  **Modo de Corrección a Ciegas (Blind Grading / Anti-Sesgo):** Opción para ocultar la identidad del alumno durante la corrección para máxima objetividad (Mejora #19 de backlog).
4.  **Detección de Similitud y Alertas de Posible Copia:** Comparación entre textos de respuestas de alumnos para advertir patrones idénticos en preguntas de desarrollo (Mejora #5 de backlog).
---
