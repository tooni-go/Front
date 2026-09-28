# Propuesta: Exámenes en Modo Borrador (Drafts) (Tarea 4 - Sprint 3)

## Problema
Actualmente en EvalIA, cuando un docente crea un examen (de forma manual o mediante el asistente de IA), el examen se almacena e inmediatamente queda disponible como activo para recibir entregas.

Esto genera las siguientes dificultades:
1. **Falta de etapa de preparación:** Los docentes no pueden guardar un examen a medio armar o revisar sus preguntas y puntajes antes de abrirlo oficialmente para la cursada.
2. **Riesgo de entregas accidentales:** Si un examen incompleto queda disponible en el listado, se pueden cargar entregas de alumnos antes de que las consignas y criterios de corrección estén finalizados.
3. **Falta de visibilidad del estado del examen:** En los listados de cursos y vistas de examen no existe distinción visual entre exámenes en preparación, exámenes vigentes y exámenes finalizados.

## Solución Propuesta
Implementar el ciclo de vida completo de exámenes mediante el estado `EstadoExamen` (`BORRADOR`, `PUBLICADO`, `ARCHIVADO`):

1. **Gestión de Estados en Creación y Edición:**
   - En [`ExamenManualView`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenManualView.tsx) y [`ExamenRevisionGeneradoView`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenRevisionGeneradoView.tsx), ofrecer dos acciones al guardar:
     * **"Guardar como Borrador"** (crea el examen en estado `BORRADOR`).
     * **"Publicar Examen"** (crea o guarda el examen directamente en estado `PUBLICADO`).
2. **Protección y Bloqueo de Entregas:**
   - Bloquear la carga de nuevas entregas (`NuevaEntregaView`) para exámenes en estado `BORRADOR` o `ARCHIVADO`, mostrando una alerta clara si se intenta acceder.
   - En el backend, validar que `POST /api/v1/entregas` rechace con `HTTP 400` entregas dirigidas a exámenes en borrador.
3. **Experiencia de Usuario y Transición de Estado:**
   - En [`ExamenDetalleView`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenDetalleView.tsx), mostrar un banner informativo cuando el examen esté en `BORRADOR` con una acción destacada **"📢 Publicar Examen"** (que actualiza el estado mediante `PATCH /api/v1/examenes/:id/estado`).
   - Deshabilitar el botón de "Nueva entrega" mientras el examen se encuentre en `BORRADOR`.
4. **Identificación Visual:**
   - Incorporar badges de estado en las tarjetas de examen en [`CursoDetalleView`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/CursoDetalleView.tsx) y [`DashboardView`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/DashboardView.tsx):
     * `🟡 Borrador` (Ámbar)
     * `🟢 Publicado` (Esmeralda)
     * `⚪ Archivado` (Slate)

## Alcance e Impacto
- **Frontend (`Front`):**
  - Actualización de interfaces TypeScript (`Exam`, `BackendExamen`, `EstadoExamen`).
  - Modificación de vistas: `ExamenManualView`, `ExamenRevisionGeneradoView`, `ExamenDetalleView`, `CursoDetalleView`, `NuevaEntregaView`.
  - Conexión con el endpoint `PATCH /api/v1/examenes/:id/estado`.
- **Backend (`Backend-App`):**
  - Modelo Prisma con `enum EstadoExamen { BORRADOR, PUBLICADO, ARCHIVADO }` con default `BORRADOR`.
  - Endpoint `PATCH /api/v1/examenes/:id/estado`.
  - Guard de validación en `POST /api/v1/entregas`.
