# Diseño: Exámenes en Modo Borrador (Drafts) (Tarea 4 - Sprint 3)

## 1. Arquitectura y Flujo de Estados

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               FLUJO DE ESTADOS DE EXAMEN                               │
│                                                                                        │
│     [ Nueva Creación ]                                                                 │
│     (Manual / IA)                                                                      │
│            │                                                                           │
│            ├────────────────────────────────────────┐                                  │
│            ▼                                        ▼                                  │
│   [Guardar como Borrador]                   [Publicar Examen]                          │
│            │                                        │                                  │
│            ▼                                        │                                  │
│   ┌───────────────────┐                             │                                  │
│   │     BORRADOR      │                             │                                  │
│   │ • Estado: BORRADOR│                             │                                  │
│   │ • Entregas: ❌ OFF │                             │                                  │
│   │ • Edición: ✅ Libre│                             │                                  │
│   └─────────┬─────────┘                             │                                  │
│             │                                       │                                  │
│             │ Acción: PATCH /examenes/:id/estado    │                                  │
│             │         { estado: 'PUBLICADO' }       │                                  │
│             ▼                                       ▼                                  │
│   ┌────────────────────────────────────────────────────┐                               │
│   │                     PUBLICADO                      │◀────────────────┐             │
│   │ • Estado: PUBLICADO                                │                 │             │
│   │ • Entregas: ✅ Habilitadas                          │                 │             │
│   │ • Corrección por IA: ✅ Habilitada                 │                 │             │
│   └─────────────────────────┬──────────────────────────┘                 │             │
│                             │                                            │             │
│                             │ Acción: PATCH /examenes/:id/estado         │             │
│                             │         { estado: 'ARCHIVADO' }            │ Desarchivar │
│                             ▼                                            │             │
│   ┌────────────────────────────────────────────────────┐                 │             │
│   │                     ARCHIVADO                      │─────────────────┘             │
│   │ • Estado: ARCHIVADO                                │                               │
│   │ • Entregas: ❌ Cerradas                             │                               │
│   │ • Reportes y Consulta: ✅ Lectura                   │                               │
│   └────────────────────────────────────────────────────┘                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Contratos de Datos y Tipos TypeScript

### A. Tipos en Frontend ([`src/types/evalia.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/types/evalia.ts))

```typescript
export type EstadoExamen = 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';

export interface Exam {
  id: string;
  courseId: string;
  titulo: string;
  fecha: string;
  estado?: EstadoExamen; // <- Nuevo campo
  preguntasCount: number;
  puntajeTotal: number;
  entregasCount: number;
  preguntas: Question[];
}

export interface BackendExamen {
  id: string;
  titulo: string;
  fecha: string;
  estado: EstadoExamen;
  cursoId: string;
  preguntas: BackendPregunta[];
  curso?: BackendCurso;
  _count?: { entregas: number };
}
```

---

## 3. Endpoints de la API REST

### 1. Cambio de Estado del Examen
- **Método & Ruta:** `PATCH /api/v1/examenes/:id/estado`
- **Request Body (JSON):**
  ```json
  {
    "estado": "PUBLICADO"
  }
  ```
- **Response Exitosa (`HTTP 200`):**
  ```json
  {
    "id": "b4ac5b0d-6229-4323-85e5-d082cb3a4736",
    "titulo": "Primer Parcial de Matemáticas",
    "estado": "PUBLICADO",
    "fechaActualizacion": "2026-09-17T12:00:00.000Z"
  }
  ```
- **Validaciones en Backend:**
  - Si el examen intenta pasar a `PUBLICADO` y no posee preguntas: `HTTP 400 Bad Request: "El examen debe contener al menos una pregunta para poder publicarse."`

---

### 2. Creación de Examen con Estado Inicial
- **Método & Ruta:** `POST /api/v1/cursos/:id/examenes`
- **Request Body (JSON):**
  ```json
  {
    "titulo": "Parcial 1",
    "estado": "BORRADOR",
    "preguntas": [ ... ]
  }
  ```
- Si `estado` no se envía, el backend asigna por defecto `BORRADOR`.

---

### 3. Guard de Entregas
- **Método & Ruta:** `POST /api/v1/entregas`
- **Validación:**
  - Si `examen.estado !== 'PUBLICADO'`, responder `HTTP 400`:
    ```json
    {
      "statusCode": 400,
      "message": "No se pueden subir entregas a un examen en estado BORRADOR o ARCHIVADO. Debe publicarlo previamente."
    }
    ```

---

## 4. Diseño de Componentes e Interfaz de Usuario (UI/UX)

### A. Vista de Detalle de Examen ([`ExamenDetalleView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenDetalleView.tsx))
1. **Banner de Modo Borrador:**
   - Si `exam.estado === 'BORRADOR'`, se muestra un banner superior en tono ámbar/índigo:
     > ℹ️ **Examen en Modo Borrador:** Este examen aún no está visible para la recepción de entregas. Podés editar preguntas y puntajes libremente antes de publicarlo.
2. **Botón Principal de Publicación:**
   - Botón destacado en el header con icono `Send` o `Sparkles`: **"Publicar Examen"**.
   - Al hacer clic, ejecuta `PATCH /api/v1/examenes/:id/estado` con `{ estado: 'PUBLICADO' }`, mostrando spinner `Loader2` y actualizando el estado local de inmediato.
3. **Bloqueo del Botón "Nueva Entrega":**
   - Si `exam.estado === 'BORRADOR'`, el botón "Nueva entrega" se muestra deshabilitado (o con un tooltip/modal explicativo que invita a publicarlo primero).

---

### B. Formularios de Creación de Examen ([`ExamenManualView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenManualView.tsx) y [`ExamenRevisionGeneradoView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/ExamenRevisionGeneradoView.tsx))
1. Barra de acciones inferior con dos opciones:
   - Botón Secundario: **"Guardar como Borrador"** (guarda con `estado: 'BORRADOR'`).
   - Botón Primario: **"Publicar Examen"** (guarda con `estado: 'PUBLICADO'`).

---

### C. Badges de Estado en Listados ([`CursoDetalleView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/CursoDetalleView.tsx))
* `BORRADOR`: `<span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800/40">🟡 Borrador</span>`
* `PUBLICADO`: `<span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">🟢 Publicado</span>`
* `ARCHIVADO`: `<span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">⚪ Archivado</span>`

---

### D. Pantalla de Carga de Entrega ([`NuevaEntregaView.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/NuevaEntregaView.tsx))
* Si un usuario navega directamente a `/entregas/nueva?examenId=...` de un examen en borrador, la vista muestra un panel de aviso:
  > **Examen no disponible para entregas**
  > *Este examen se encuentra en borrador. El docente debe publicarlo antes de cargar entregas.*
  > `[ Botón: Volver al Examen ]`
