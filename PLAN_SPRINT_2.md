# 📅 Plan de Sprint 2 - DevOps, Carga Inteligente de Exámenes y Gestión Avanzada

*   **Capacidad del Equipo:** 3 desarrolladores × 4 horas/día (máx) × 5 días hábiles = **60 horas teóricas máximas** (máximo **20 horas por desarrollador**).
*   **Capacidad Planificada Real:** Se planifica un total de **56 horas de desarrollo efectivo** (~18-19 horas por desarrollador) garantizando un reparto equitativo de carga y margen para pruebas e imprevistos.
*   **Enfoque de Desarrollo:** Completar la suite de administración (CRUD completo de Cursos, Alumnos, Perfil Docente y Exámenes), habilitar el motor generativo de IA ("Carga Inteligente de Exámenes" con fallback Gemini ➔ OpenRouter), y consolidar la infraestructura completa con Dockerización, CI/CD y despliegue en servidor.

---

## 🎯 Objetivos y Alcance del Sprint 2

1.  **DevOps & Infraestructura (CI/CD y Despliegue):** Contenerizar backend y frontend con Docker, resolver el mapeo de puertos, automatizar la integración con GitHub Actions y realizar el deploy inicial en el servidor.
2.  **Gestión y Administración Completa:** Cerrar los flujos de creación, edición, eliminación y duplicación de exámenes con validación visual de puntajes, más el CRUD completo de cursos y perfil del docente.
3.  **Carga Inteligente con IA y Resiliencia:** Permitir la generación automática de consignas a partir de texto o documentos (PDF/DOCX) y robustecer el backend con un mecanismo de fallback multimodelo ante caídas o límites de cuota.

---

## 👥 Asignación de Tareas (Reparto Equitativo ≤ 20 hs por Desarrollador)

### 👤 Desarrollador 1: DevOps, CI/CD, Dockerización y Seguridad de Entorno
*Enfocado en la contenerización del proyecto, pipeline de integración y despliegue continuo, y hardening de seguridad y variables de entorno.*

*   **Tarea 1: Dockerización Fullstack (Backend & Frontend) y Resolución de Puertos**
    *   Resolver conflicto de puerto 3000 entre backend y frontend (ej. Next.js en 3000, NestJS en 3001).
    *   Crear `Dockerfile` multi-stage optimizado para NestJS (Backend).
    *   Crear `Dockerfile` multi-stage optimizado para Next.js (Frontend).
    *   Configurar `docker-compose.yml` para levantar todo el stack localmente con persistencia SQLite y volumen de uploads.
    *   *Estimación:* 5 horas
*   **Tarea 2: Pipeline de Integración Continua (CI) en GitHub Actions**
    *   Configurar workflow de GitHub Actions para ejecutar linter (ESLint), chequeo de tipos TypeScript y build en cada PR/Push.
    *   Validar la correcta compilación y pruebas de consistencia entre ambos repositorios/paquetes.
    *   *Estimación:* 4 horas
*   **Tarea 3: Despliegue Continuo (CD) y Configuración en Servidor (Deploy Inicial)**
    *   Configurar workflow de CD para automatizar el despliegue al servidor de hosting/VPS.
    *   Ejecutar el despliegue inicial en producción/staging y verificar conectividad completa frontend-backend.
    *   *Estimación:* 6 horas
*   **Tarea 4: Seguridad, Rotación de Secretos y Estandarización de Entornos**
    *   Rotación inmediata de API keys de Gemini y OpenRouter expuestas en repositorios.
    *   Crear y documentar `.env.example` en backend y frontend detallando cada variable requerida.
    *   *Estimación:* 3 horas
*   **Esfuerzo Total Dev 1:** **18 horas** (2 horas de margen para soporte de despliegue y pruebas).

---

### 👤 Desarrollador 2: Gestión Integral de Cursos, Alumnos, Perfil y Administración de Exámenes
*Enfocado en completar el ciclo de vida de cursos, administración del perfil docente y la interfaz completa de gestión y validación de exámenes.*

*   **Tarea 5: Especificaciones OpenSpec y Endpoints Backend (Cursos & Perfil Docente)**
    *   Definir/actualizar contratos OpenSpec con DTOs para CRUD de Cursos y Perfil de Profesor.
    *   Completar endpoints backend `POST`, `PUT`, `DELETE` en `/cursos` y su lógica relacional.
    *   Crear endpoint `PUT /profesor/me` para la actualización de datos del perfil del profesor logueado.
    *   *Estimación:* 5 horas
*   **Tarea 6: Frontend de Cursos, Detalle y Gestión de Alumnos/Perfil**
    *   Crear y pulir las vistas de listado de Cursos (`/cursos`) y detalle de curso (`/cursos/[id]`).
    *   Desarrollar interfaz (formulario y tabla) para CRUD de Alumnos matriculados por curso.
    *   Crear vista/modal de edición del perfil del profesor conectado al backend.
    *   *Estimación:* 6 horas
*   **Tarea 7: Flujo de Alta y Creación Manual de Exámenes con Validación de Puntaje**
    *   Crear el flujo inicial/pantalla de selección de método de alta de examen (Manual vs Carga Inteligente por IA).
    *   Formulario de creación/edición manual de preguntas, respuestas esperadas y criterios adicionales de corrección.
    *   Implementar validación visual en tiempo real para asegurar que la suma de puntajes coincida con el total esperado del examen (con alertas visuales).
    *   *Estimación:* 4 horas
*   **Tarea 8: Administración Avanzada de Exámenes (Edición, Eliminación y Duplicación)**
    *   Implementar acciones de gestión de examen en frontend y backend: editar consignas existentes, eliminar examen y duplicar estructura de examen para nuevos cursos/fechas.
    *   Manejo de confirmaciones visuales (modales destructivos) y retroalimentación de estado.
    *   *Estimación:* 4 horas
*   **Esfuerzo Total Dev 2:** **19 horas** (1 hora de margen para pruebas e integración).

---

### 👤 Desarrollador 3: Motor de Carga Inteligente de Exámenes y Resiliencia de IA
*Enfocado en la extracción de texto de documentos, generación automática de consignas con IA, mecanismo de fallback multimodelo y la UI de edición interactiva.*

*   **Tarea 9: Especificaciones OpenSpec y Endpoint de Extracción de Documentos**
    *   Definir openspec para el Generador de Consignas (Carga Inteligente con entrada/salida estructurada).
    *   Implementar endpoint backend dedicado a la carga y extracción de texto de archivos fuente (PDF, DOCX, TXT, imágenes escaneadas) independiente del endpoint de entregas.
    *   *Estimación:* 4 horas
*   **Tarea 10: Generador de Consignas con IA (Prompt Engineering & Guardrails Backend)**
    *   Implementar servicio backend para procesar el temario/texto extraído y generar automáticamente preguntas, respuestas modelo, criterios de corrección sugeridos y puntajes mediante IA.
    *   Aplicar validación estricta de estructura JSON (Guardrails) para asegurar respuestas consistentes.
    *   *Estimación:* 5 horas
*   **Tarea 11: Mecanismo de Fallback de IA y Resiliencia (Gemini ➔ OpenRouter)**
    *   Implementar middleware/servicio de fallback automático en el backend: si Gemini API falla (rate limit 429, error 5xx, timeout o cuota agotada), redirigir la solicitud transparentemente a OpenRouter.
    *   Implementar logging y métricas de proveedor activo para trazabilidad.
    *   *Estimación:* 4 horas
*   **Tarea 12: Frontend de Carga Inteligente y Editor de Consignas Generadas**
    *   Crear modal/pantalla de "Carga Inteligente" que permita pegar texto directamente o subir archivo fuente.
    *   Desarrollar la vista interactiva donde el docente previsualiza, ajusta, edita o elimina las consignas generadas por la IA antes de guardarlas definitivamente en el curso.
    *   *Estimación:* 6 horas
*   **Esfuerzo Total Dev 3:** **19 horas** (1 hora de margen para pruebas e integración).

---

## 📊 Resumen de Carga de Trabajo y Horas

| Rol / Desarrollador | Área Principal de Foco | Tareas Asignadas | Horas Estimadas | Límite Máximo |
| :--- | :--- | :---: | :---: | :---: |
| **Desarrollador 1** | DevOps, CI/CD, Docker y Seguridad | 4 tareas | **18 hs** | 20 hs (Cumple ✅) |
| **Desarrollador 2** | Cursos, Alumnos, Perfil y Exámenes | 4 tareas | **19 hs** | 20 hs (Cumple ✅) |
| **Desarrollador 3** | Carga Inteligente IA, Extracción y Fallback | 4 tareas | **19 hs** | 20 hs (Cumple ✅) |
| **TOTAL** | **Full Project Sprint 2** | **12 tareas** | **56 hs** | **60 hs** |

---

## 🚀 Stretch Goals (Opcionales para este Sprint)

Si el equipo finaliza las tareas antes del tiempo estimado:
1.  **Pruebas End-to-End (E2E):** Implementar tests E2E básicos con Playwright para el flujo completo de creación de examen y entrega.
2.  **Exportación de Calificaciones:** Generar reporte descargable en PDF / CSV de las notas de un examen o curso.
3.  **Selector de Modelo de IA Dinámico:** Permitir configurar desde variables de entorno o panel cuál modelo de OpenRouter usar como respaldo prioritario (ej. Claude 3.5 Sonnet / Llama 3).
