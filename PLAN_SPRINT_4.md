# 📅 Plan de Sprint Cierre - Estabilización, Seguridad Crítica y Pulido Final

*   **Fecha de Inicio:** 29 de Septiembre de 2026 (29/09/26)
*   **Fecha de Finalización:** 10 de Octubre de 2026 (10/10/26) — **Duración: 2 semanas (10 días hábiles)**
*   **Capacidad del Equipo:** 3 desarrolladores × 4 horas/día (máx) = **60 horas de capacidad real planificada** (máximo **20 horas por desarrollador**).
*   **Capacidad Planificada Efectiva:** Se planifica un total de **50 horas de desarrollo efectivo** (~16-17 horas por desarrollador) garantizando un reparto equitativo de carga y margen de seguridad amplio para pruebas de regresión y cierre.
*   **Enfoque de Desarrollo:** Corregir **todos los bugs críticos detectados en la demo del 27/09/2026**, implementar las mejoras de seguridad y UX más urgentes, y dejar la plataforma en condiciones de entrega final. Las tareas se distribuyen en tres ejes:
    1. **Aislamiento de datos y seguridad de sesión** (Mejoras #5 y #6 de `mejoras.txt`)
    2. **CRUD completo de Cursos y corrección de UX en corrección IA** (Mejoras #7 y #17 de `mejoras.txt`)
    3. **Resiliencia del motor de IA y compatibilidad de PDFs** (Mejoras #10 y #16 de `mejoras.txt`)
    4. **Validaciones y parser resiliente** (Mejoras #14 y #15 de `mejoras.txt`)

---

## 🎯 Objetivos y Alcance del Sprint Cierre

1.  **Seguridad Crítica — Aislamiento de Datos por Docente:** Corregir la vulnerabilidad detectada en demo donde un profesor autenticado podía visualizar datos de otros. Filtrar estrictamente por `profesorId` en todos los servicios backend y limpiar el estado global al hacer logout.
2.  **Sincronización del Perfil Docente:** Conectar el saludo del Dashboard y el perfil al nombre real del profesor logueado, con upsert automático en login y endpoint `PUT /profesor/me` funcional.
3.  **Eliminación de Cursos:** Implementar botón y endpoint `DELETE /cursos/:id` con borrado en cascada (alumnos y exámenes) y modal de confirmación destructiva.
4.  **Control y Experiencia en Corrección con IA:** Agregar botón "Reintentar Corrección" y banners de estado claros para los estados `PROCESANDO` y `REQUIERE_REVISION`, evitando que fallos de red asignen ceros automáticos.
5.  **Resiliencia y Compatibilidad del Motor de IA:** Implementar reintentos con exponential backoff ante errores 429/503, ajustar timeout global a 30–45s, y asegurar compatibilidad de PDFs con todos los modelos de OpenRouter.
6.  **Parser Resiliente para Importación Excel/CSV:** Corregir el fallo al importar planillas con filas de encabezado institucional previas al listado de alumnos.
7.  **Restricción de Fecha en Creación de Exámenes:** Impedir la selección de fechas pasadas en los formularios de creación de exámenes (frontend y backend).

---

## 👥 Asignación de Tareas (Reparto Equitativo ≤ 20 hs por Desarrollador)

### 👤 Desarrollador 1: Seguridad Crítica — Aislamiento de Datos y Sincronización del Perfil Docente
*Enfocado en resolver los dos hallazgos de mayor impacto de la demo: la fuga de datos entre docentes y el perfil desconectado del backend.*

*   **Tarea 1: Aislamiento de Datos por Docente en el Backend (CRÍTICO)**
    *   En `CursosService`, actualizar `findMany` para filtrar estrictamente:
        `prisma.curso.findMany({ where: { profesorId: usuarioLogueado.id } })`.
    *   Asegurar que `POST /cursos` asocie automáticamente el curso al `profesorId` extraído del JWT.
    *   Agregar Guards de acceso en `GET /cursos/:id`, `PUT /cursos/:id` y `DELETE /cursos/:id` para validar pertenencia al docente autenticado antes de ejecutar cualquier acción.
    *   Aplicar el mismo patrón de filtrado en los servicios de `Exámenes`, `Alumnos` y `Entregas` para blindar el acceso cruzado por cualquier ruta.
    *   *Estimación:* 6 horas

*   **Tarea 2: Limpieza de Estado Global al Hacer Logout (Frontend)**
    *   Asegurar que el token JWT se incluya en el header de cada petición al backend (`Authorization: Bearer <token>`).
    *   Limpiar de forma exhaustiva el Context global (cursos, alumnos, exámenes) y el almacenamiento local (`localStorage`, `sessionStorage`) al ejecutar la acción de Logout, impidiendo que el próximo usuario vea datos residuales en pantalla.
    *   *Estimación:* 3 horas

*   **Tarea 3: Sincronización del Perfil Docente (`/profesor/me`) — Backend**
    *   Implementar lógica de **Upsert automático** en el flujo de login: si el profesor no existe en la base de datos, crearlo; si ya existe, retornar sus datos actualizados.
    *   El JWT debe incluir el `id`, `email` y `nombre` del profesor para que el frontend pueda usarlo en el saludo.
    *   Completar y conectar el endpoint `PUT /api/v1/profesor/me` para actualizar Nombre, Apellido y Departamento del docente.
    *   *Estimación:* 5 horas

*   **Tarea 4: Sincronización del Saludo y Perfil en el Dashboard (Frontend)**
    *   Actualizar el `AuthContext` para que almacene y exponga el nombre real del profesor tras el login.
    *   Reemplazar el texto fijo "Bienvenido nuevamente, Profesor" en el Dashboard por el nombre dinámico del profesor logueado (`"Bienvenido, {nombre} {apellido}"`).
    *   Mostrar un prompt de completar perfil si el nombre no está disponible en la sesión.
    *   *Estimación:* 3 horas

*   **Esfuerzo Total Dev 1:** **17 horas** (3 horas de margen para pruebas de seguridad y regresión).

---

### 👤 Desarrollador 2: CRUD Completo de Cursos, Validación de Fechas y Parser Resiliente de Excel/CSV
*Enfocado en el cierre funcional de la gestión de cursos (edición y eliminación), la corrección de la validación temporal y la robustez del importador de alumnos.*

*   **Tarea 5: Eliminación y Edición de Cursos — Backend (CRÍTICO)**
    *   Implementar endpoint `DELETE /api/v1/cursos/:id`: eliminar el curso con borrado en cascada (o borrado lógico) de alumnos y exámenes asociados, validando previamente pertenencia al docente autenticado.
    *   Asegurar que el endpoint `PUT /api/v1/cursos/:id` esté completo y protegido, permitiendo actualizar materia, año, división y ciclo lectivo.
    *   *Estimación:* 4 horas

*   **Tarea 6: Eliminación y Edición de Cursos — Frontend (CRÍTICO)**
    *   Agregar un botón **"Editar Curso"** en la vista de detalle del curso con formulario precargado.
    *   Agregar un botón **"Eliminar Curso"** con modal de confirmación destructiva (alerta roja con mensaje: *"Esta acción eliminará permanentemente el curso, los alumnos matriculados y sus exámenes. ¿Deseas continuar?"*).
    *   Mostrar toast de éxito y redirigir al listado de cursos tras la eliminación.
    *   *Estimación:* 4 horas

*   **Tarea 7: Restricción de Fecha Mínima en Creación de Exámenes (Frontend y Backend)**
    *   **Frontend:** Configurar `min={today}` en todos los inputs `<input type="date">` de los formularios de creación de examen (flujo Manual y flujo IA). Agregar validación visual que alerte si se ingresa una fecha inválida antes del envío.
    *   **Backend:** Validar en el DTO / servicio de creación de examen que `fecha >= hoy`, retornando un error 400 descriptivo si se viola la restricción.
    *   *Estimación:* 3 horas

*   **Tarea 8: Parser Resiliente para Importación Masiva de Alumnos (Excel/CSV)**
    *   Implementar **escaneo inteligente de encabezados**: recorrer automáticamente las primeras 10 filas del archivo buscando la fila que contenga columnas reconocibles (`nombre`, `apellido`, `email`, `legajo` / `dni`), tolerando títulos institucionales, logos o filas vacías previas.
    *   Agregar un paso de **mapeador interactivo de columnas** como fallback: si la detección automática no es concluyente, mostrar al docente una tabla de previsualización donde pueda asignar manualmente cada campo.
    *   Ignorar silenciosamente filas de totales, firmas o comentarios al final del archivo sin abortar la importación.
    *   *Estimación:* 5 horas

*   **Esfuerzo Total Dev 2:** **16 horas** (4 horas de margen para pruebas de integración e imprevistos).

---

### 👤 Desarrollador 3: Resiliencia del Motor de IA, Compatibilidad de PDFs y Control Docente en Corrección
*Enfocado en blindar el backend de IA ante caídas de proveedores, asegurar compatibilidad de PDFs con cualquier modelo y mejorar el control del docente durante la corrección.*

*   **Tarea 9: Reintentos con Exponential Backoff y Timeout Global de IA (Backend)**
    *   Implementar política de **reintentos con exponential backoff**: ante errores 429 (rate limit) o 503 (alta demanda) de Gemini u OpenRouter, reintentar automáticamente 2 veces con esperas de 1.5s y 3s antes de propagar el error.
    *   Ajustar el **timeout global** de las llamadas a proveedores de IA al rango seguro de 30s–45s para permitir el análisis de PDFs extensos sin cortes prematuros.
    *   Agregar validación proactiva de credenciales (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`) al iniciar el servicio, con warning en logs si alguna clave está ausente.
    *   *Estimación:* 5 horas

*   **Tarea 10: Compatibilidad de PDFs para Modelos sin Soporte Data-URL (Backend)**
    *   Detectar el modelo activo de OpenRouter y, si no admite PDFs como base64 data-url (ej. `gpt-4o-mini`), convertir automáticamente cada página del PDF a imagen (PNG/JPEG) o extraer el texto plano antes de estructurar el prompt.
    *   Establecer `anthropic/claude-3.5-sonnet` como **modelo de respaldo predeterminado** cuando la entrada sea un PDF multimodal, documentándolo en el `.env.example`.
    *   *Estimación:* 5 horas

*   **Tarea 11: Botón "Reintentar Corrección con IA" y Banners de Estado (Frontend)**
    *   Agregar un botón prominente **"Reintentar Corrección con IA"** en la vista de revisión de entrega (`ExamenRevisionGeneradoView`) visible cuando el estado es `REQUIERE_REVISION` por fallo de red o timeout.
    *   Implementar banners contextuales claros según el estado de la entrega:
        *   `PROCESANDO`: Spinner visible + texto dinámico *"Analizando y corrigiendo examen con IA..."*.
        *   `REQUIERE_REVISION` (por fallo): Banner de advertencia en naranja *"No se pudo conectar con el servicio de IA. Podés calificar manualmente o reintentar la corrección."* — **eliminando la asignación de 0 puntos por defecto**.
    *   *Estimación:* 4 horas

*   **Tarea 12: Indicador de Estado del Motor de IA en el Dashboard Docente (Frontend)**
    *   Agregar un pequeño **chip de estado** en el header del Dashboard o en el perfil del docente que muestre si el motor de IA está conectado y operativo (verde: *"IA Activa"* / rojo: *"Servicio de IA no disponible"*), consultando el endpoint `GET /api/v1/health` o `GET /api/v1/ai/status`.
    *   *Estimación:* 3 horas

*   **Esfuerzo Total Dev 3:** **17 horas** (3 horas de margen para pruebas de regresión E2E y ajuste fino de prompts).

---

## 📊 Resumen de Carga de Trabajo y Horas

| Rol / Desarrollador | Área Principal de Foco | Tareas Asignadas | Horas Estimadas | Límite Máximo |
| :--- | :--- | :---: | :---: | :---: |
| **Desarrollador 1** | Aislamiento de datos (Seguridad) + Perfil Docente | 4 tareas | **17 hs** | 20 hs (Cumple ✅) |
| **Desarrollador 2** | CRUD Cursos + Validación de Fechas + Parser CSV | 4 tareas | **16 hs** | 20 hs (Cumple ✅) |
| **Desarrollador 3** | Resiliencia IA + Compatibilidad PDFs + UX Corrección | 4 tareas | **17 hs** | 20 hs (Cumple ✅) |
| **TOTAL** | **Full Project Sprint Cierre** | **12 tareas** | **50 hs** | **60 hs** |

---

## 🐛 Bugs Críticos de la Demo (27/09/2026) — Matriz de Seguimiento

| # | Bug Detectado | Prioridad | Desarrollador | Tarea Asociada |
| :---: | :--- | :---: | :---: | :---: |
| B-01 | Al loguearse con otra cuenta se ven cursos de otros profesores | CRÍTICA | Dev 1 | Tarea 1 |
| B-02 | Eliminar cursos no está implementado en la interfaz | CRÍTICA | Dev 2 | Tareas 5 y 6 |
| B-03 | El saludo muestra "Bienvenido, Profesor" en lugar del nombre real | ALTA | Dev 1 | Tareas 3 y 4 |
| B-04 | Importador falla con archivos que tienen encabezados institucionales | ALTA | Dev 2 | Tarea 8 |
| B-05 | Selector de fecha permite fechas pasadas en creación de exámenes | ALTA | Dev 2 | Tarea 7 |
| B-06 | Sin reintentos ante errores 503/429 del motor de IA | ALTA | Dev 3 | Tarea 9 |
| B-07 | PDFs fallan con modelos de OpenRouter que no admiten data-url | MEDIA | Dev 3 | Tarea 10 |
| B-08 | Sin botón para reintentar corrección ni banners de estado IA claros | MEDIA | Dev 3 | Tarea 11 |

---

## ✅ Criterios de Aceptación para Cierre de Sprint

Al finalizar el Sprint Cierre, la plataforma deberá cumplir los siguientes criterios para considerarse **lista para entrega final**:

- [ ] Un profesor logueado **solo visualiza sus propios cursos, alumnos y exámenes**. Verificado con dos cuentas de Google distintas.
- [x] Al hacer Logout, **no quedan datos residuales** visibles al iniciar sesión con otra cuenta en el mismo navegador.
- [x] El saludo del Dashboard muestra el **nombre real del profesor** desde el primer login.
- [ ] Existe un botón de **"Eliminar Curso"** con confirmación que elimina el curso y sus datos asociados exitosamente.
- [ ] El formulario de creación de exámenes **impide seleccionar fechas pasadas** tanto en frontend como en backend.
- [ ] El importador de alumnos **procesa correctamente planillas** con encabezados institucionales en las primeras filas.
- [ ] El motor de IA **reintenta automáticamente** ante errores 429/503 sin propagar el fallo al usuario en el primer intento.
- [ ] PDFs son procesados **correctamente por todos los modelos configurados** en OpenRouter (conversión automática si el modelo no admite data-url).
- [ ] La vista de revisión de entrega muestra un **botón "Reintentar Corrección"** y banners de estado descriptivos sin asignar ceros por defecto.

---

## 🚀 Stretch Goals (Opcionales si el equipo finaliza antes del 10/10/26)

Si el equipo completa todas las tareas obligatorias antes de la fecha de cierre:

1.  **Autoguardado de Borradores (Autosave con LocalStorage / IndexedDB):** Guardar en tiempo real el borrador de exámenes y revisiones de entregas ante cortes de conexión. (Mejora #20 del backlog — pendiente de sprint 3).
2.  **Modo de Corrección a Ciegas (Blind Grading / Anti-Sesgo):** Ocultar la identidad del alumno durante la corrección mostrando solo "Entrega #1, Entrega #2"; revelar identidades al publicar las notas. (Mejora #12 del backlog).
3.  **Sistema de Logging Estructurado (tslog):** Integrar `tslog` como logger global de NestJS, configurar transportes a `logs/error.log` y `logs/app.log` en formato JSON estructurado. (Mejora #8 del backlog).
4.  **Envío de Feedback por Email:** Permitir al docente enviar la devolución en PDF a un alumno individual o de forma masiva al curso completo una vez aprobadas las notas. (Mejora #4 del backlog).
