# EvalIA

> Aplicación móvil de **asistencia inteligente para la corrección de exámenes manuscritos**. EvalIA utiliza Inteligencia Artificial para generar una **sugerencia de calificación** y observaciones por pregunta, manteniendo siempre al docente como responsable de la evaluación final.

---

## Índice

- [Visión General](#visión-general)
- [Problema](#problema)
- [Objetivo](#objetivo)
- [Público Objetivo](#público-objetivo)
- [Alcance del MVP](#alcance-del-mvp)
- [Fuera del Alcance](#fuera-del-alcance)
- [Carga Inteligente de Exámenes (Opción C)](#carga-inteligente-de-exámenes-opción-c)
- [Tratamiento de Preguntas Gráficas y Guardrails de IA](#tratamiento-de-preguntas-gráficas-y-guardrails-de-ia)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Modelo de Datos](#modelo-de-datos)
- [Estados de una Entrega](#estados-de-una-entrega)
- [Mecanismo de Fallback](#mecanismo-de-fallback)
- [User Stories](#user-stories)
- [Organización del Equipo](#organización-del-equipo)
- [Propuesta de Valor](#propuesta-de-valor)
- [Flujo General](#flujo-general)

---

# Visión General

EvalIA busca reducir el tiempo que los docentes dedican a corregir exámenes escritos en papel mediante una **asistencia móvil basada en Inteligencia Artificial**.

Desde su dispositivo móvil, el profesor puede capturar fotos de las hojas de examen. La IA analiza cada entrega, interpreta las respuestas, propone una calificación y genera observaciones por pregunta. Sin embargo, **la decisión final siempre pertenece al docente**, quien puede aceptar o modificar cualquier sugerencia antes de publicar la corrección.

---

# Problema

Los docentes de nivel secundario dedican una gran cantidad de horas extra a corregir evaluaciones escritas manualmente, retrasando la devolución de resultados y aumentando su carga laboral.

---

# Objetivo

Desarrollar una aplicación móvil de asistencia a la corrección de exámenes escritos que utilice Inteligencia Artificial para:

- capturar fácilmente hojas de examen mediante la cámara del celular;
- analizar las respuestas del alumno;
- generar una **sugerencia** de calificación;
- producir observaciones por pregunta;
- permitir que el docente revise y apruebe la corrección final desde la app.

---

# Público Objetivo

- Profesores de nivel secundario.

> **Nota:** El portal para alumnos queda fuera del MVP y podrá incorporarse en futuras versiones.

---

# Alcance del MVP

El profesor podrá desde la app móvil:

- Iniciar sesión mediante Google Sign-In nativo.
- Crear exámenes.
- **Definir la rúbrica rápidamente mediante Carga Inteligente (Copy-Paste asistido por IA) o formulario manual.**
- Asignar y redistribuir puntajes por pregunta de forma equitativa o personalizada.
- Registrar alumnos.
- Capturar fotos directamente con la cámara del celular o seleccionar archivos desde la galería/almacenamiento.
- Obtener una sugerencia de corrección mediante IA con autoevaluación de certeza.
- Revisar la propuesta generada (con alertas especiales para preguntas gráficas o con letra ilegible).
- Modificar puntajes y observaciones desde la interfaz táctil.
- Aprobar la corrección definitiva.

## Formatos y origen de captura soportados

Una entrega podrá registrarse mediante:

- 📷 Captura directa utilizando la cámara integrada del dispositivo móvil.
- 🖼️ Selección de imágenes desde la galería del celular (`JPG`, `JPEG`, `PNG`, `WEBP`).
- 📄 Documentos `PDF` seleccionados desde el almacenamiento del dispositivo.

---

# Fuera del Alcance

Esta primera versión **no incluye**:

- Corrección completamente automática.
- Reemplazo de la decisión del docente.
- Reconocimiento perfecto de cualquier tipo de letra.
- Evaluación visual autónoma de gráficos complejos, esquemas geométricos o diagramas de árbol a mano alzada.
- Parsing directo de archivos PDF/Word para la creación de exámenes (reemplazado por el enfoque de Copy-Paste inteligente para el MVP).
- Portal para alumnos.
- Exámenes digitales.
- Estadísticas avanzadas.
- Exportación de informes en PDF.
- Notificaciones push.
- Integraciones con plataformas educativas.

---

# Carga Inteligente de Exámenes 

Para optimizar el tiempo de preparación del examen sin introducir la complejidad técnica de procesar archivos heterogéneos, la app móvil utiliza un enfoque de **Copy-Paste Asistido por IA**:

1. **Entrada de datos simplificada:** El docente copia el texto completo de su examen y clave de respuestas desde sus notas o mensajes y lo pega en un campo de texto en la app.
2. **Estructuración por IA:** NestJS envía este texto crudo a Gemini con un *System Prompt* estricto de extracción.
3. **Generación del formulario:** La IA procesa el contenido y devuelve un esquema JSON estructurado con las preguntas separadas, sus respuestas esperadas y una distribución equitativa del puntaje (que suma 100).
4. **Validación docente:** La app móvil renderiza automáticamente la rúbrica en pantallas dinámicas, permitiendo al profesor hacer ajustes menores antes de guardar.

---

# Tratamiento de Preguntas Gráficas y Guardrails de IA

Dado el límite actual de los modelos de visión para evaluar razonamiento espacial o trazados manuscritos imprecisos (funciones, grafos, esquemas), EvalIA aplica un principio de **Degradación Elegante (Graceful Degradation)** mediante instrucciones del sistema (*System Prompts*) y salida estructurada (*Structured Output*):

### 1. Autoevaluación y Nivel de Confianza
En cada corrección, la IA analiza el examen del alumno y asigna una métrica de autoevaluación (`nivel_confianza`: `ALTO`, `MEDIO` o `BAJO`).

### 2. Guardrail para Gráficos y Diagramas Visuales
Si una pregunta requiere evaluar un trazado manuscrito complejo (e.g., grafos, funciones continuas, diagramas de bloques) o la caligrafía es ilegible:
- La IA **no arriesga una nota ficticia** ni inventa una calificación.
- Asigna `puntaje_sugerido: null`.
- Activa la bandera `requiere_revision_manual: true`.
- Emite un comentario explícito: *"Pregunta de evaluación visual/gráfica: requiere validación directa del docente"*.

### 3. Red de Seguridad
La entrega se marca automáticamente con el estado `REQUIERE_REVISION`. En la pantalla de revisión de la app, el docente verá las preguntas de texto ya corregidas y la pregunta gráfica resaltada para asignarle la nota manualmente en segundos.

---

# Flujo de Trabajo

1. El profesor inicia sesión en la app móvil con Google.
2. Crea un examen utilizando la **Carga Inteligente** (o formulario manual).
3. La IA parsea el examen, extrae las preguntas y distribuye el puntaje automáticamente.
4. Los alumnos realizan el examen en papel.
5. El profesor crea una nueva entrega en la app y captura las fotos con la cámara de su celular (o selecciona imágenes/PDF).
6. El backend en NestJS recibe los archivos y los envía al proveedor de IA con sus *System Prompts* y guardrails de seguridad.
7. El proveedor devuelve una respuesta estructurada en formato JSON con:
   - texto detectado;
   - nivel de confianza y estado de legibilidad;
   - puntajes sugeridos por pregunta (o `null` si requiere validación humana);
   - observaciones por pregunta.
8. El backend valida el JSON recibido.
9. Si el nivel de confianza es bajo, la letra es ilegible o hay preguntas gráficas para revisión, la entrega queda en estado **REQUIERE_REVISION**. Caso contrario, pasa a **PENDIENTE_APROBACION**.
10. El profesor revisa la propuesta desde la app.
11. Puede modificar puntajes y completar las preguntas marcadas para revisión.
12. Aprueba la corrección definitiva (**PUBLICADO**).

---

# Arquitectura

```text
                    Profesor
                       │
                       │ Google OAuth
                       ▼
              ┌─────────────────┐
              │    App Móvil    │
              │ React Native    │
              │     (Expo)      │
              └────────┬────────┘
                       │
                    REST API
                       │
                       ▼
              ┌─────────────────┐
              │     Backend     │
              │     NestJS      │
              └───────┬─────────┘
                      │
      ┌───────────────┼────────────────┐
      │                                │
      ▼                                ▼
┌──────────────┐               ┌─────────────────┐
│ Prisma ORM   │               │ Proveedor IA    │
│ SQLite       │               │ Gemini          │
└──────────────┘               └────────┬────────┘
                                        │
                               (Fallback automático)
                                        │
                                        ▼
                                   OpenRouter
