# Tareas: Exámenes en Modo Borrador (Drafts) (Tarea 4 - Sprint 3)

Lista de tareas desglosadas para implementar y verificar el ciclo de vida de exámenes en borrador:

## 1. Tipos de Datos y Contratos
- [x] **Actualizar Tipos TypeScript en Frontend:**
  - Agregar `type EstadoExamen = 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO'` en [`src/types/evalia.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/types/evalia.ts).
  - Extender las interfaces `Exam` y `BackendExamen` con la propiedad opcional `estado?: EstadoExamen`.
- [x] **Actualizar Modelo Prisma y Migración en Backend (`Backend-App`):**
  - Agregar `enum EstadoExamen` y campo `estado EstadoExamen @default(BORRADOR)` al modelo `Examen` en `prisma/schema.prisma`.
  - Aplicar migración con Prisma (`npx prisma migrate dev`).

## 2. Creación de Exámenes (Manual e Inteligente por IA)
- [x] **Actualizar [`ExamenManualView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenManualView.tsx):**
  - Implementar botones diferenciados en el pie del formulario: "Guardar como Borrador" (`estado: 'BORRADOR'`) y "Publicar Examen" (`estado: 'PUBLICADO'`).
- [x] **Actualizar [`ExamenRevisionGeneradoView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenRevisionGeneradoView.tsx):**
  - Permitir guardar el examen generado por IA en estado `BORRADOR` o directamente `PUBLICADO`.

## 3. Vista de Detalle y Transición de Estados
- [x] **Banner y Acción de Publicación en [`ExamenDetalleView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenDetalleView.tsx):**
  - Incorporar banner visual destacado cuando `exam.estado === 'BORRADOR'`.
  - Agregar botón **"📢 Publicar Examen"** que ejecute `PATCH /api/v1/examenes/:id/estado` con feedback visual (`Loader2` y actualización de estado inmediata).
  - Bloquear / deshabilitar el botón "Nueva entrega" cuando el examen esté en `BORRADOR` con mensaje explicativo.
- [x] **Badges de Estado en [`CursoDetalleView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/CursoDetalleView.tsx):**
  - Mostrar etiquetas coloreadas de estado (`🟡 Borrador`, `🟢 Publicado`, `⚪ Archivado`) en cada tarjeta de examen del listado del curso.

## 4. Bloqueo de Entregas y Endpoints Backend
- [x] **Protección en [`NuevaEntregaView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/NuevaEntregaView.tsx):**
  - Validar el estado del examen recibido; si es `BORRADOR`, mostrar un panel informativo bloqueante que impida adjuntar archivos y redirija al detalle del examen.
- [x] **Endpoints y Validaciones en Backend (`Backend-App`):**
  - Implementar endpoint `PATCH /api/v1/examenes/:id/estado` con validación de al menos una pregunta para publicar.
  - Validar en `POST /api/v1/entregas` que el examen esté en `PUBLICADO`, devolviendo `HTTP 400` en caso contrario.

## 5. Pruebas y Validación
- [x] **Pruebas de Flujo Completo:**
  - Crear un examen como borrador y verificar que aparezca el badge `🟡 Borrador`.
  - Intentar subir una entrega y verificar el bloqueo visual y a nivel de API.
  - Publicar el examen desde `ExamenDetalleView` y verificar que se habilite la subida de entregas.
