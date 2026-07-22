# EvalIA

> Aplicación web responsiva de asistencia inteligente para la corrección de exámenes escritos.

EvalIA utiliza Inteligencia Artificial para analizar exámenes manuscritos, generar una sugerencia de corrección y brindar observaciones por pregunta. La IA actúa únicamente como asistente: **la decisión final siempre pertenece al docente**.

---

# Índice

- Visión General
- Problema
- Objetivo
- Público Objetivo
- Alcance del MVP
- Funcionalidades principales
- Flujo de trabajo
- Arquitectura
- Tecnologías
- Modelo de datos
- Estados de una entrega
- Mecanismo de Fallback
- User Stories
- Organización del equipo
- Futuras mejoras
- Propuesta de valor

---

# Visión General

Los docentes dedican una gran cantidad de tiempo a corregir evaluaciones escritas en papel. Este proceso suele realizarse fuera del horario laboral y retrasa la devolución de resultados a los estudiantes.

EvalIA busca reducir ese tiempo mediante un sistema de corrección asistido por Inteligencia Artificial que:

- analiza fotografías o documentos PDF de exámenes;
- interpreta las respuestas del alumno;
- compara las respuestas con la solución esperada;
- genera una sugerencia de puntaje;
- produce observaciones por pregunta.

El profesor conserva siempre el control de la evaluación, pudiendo modificar cualquier sugerencia antes de aprobar la corrección.

---

# Problema

La corrección manual de exámenes representa una de las tareas más repetitivas y demandantes para los docentes.

Además del tiempo invertido, la devolución de resultados suele demorarse varios días debido a la cantidad de exámenes que deben corregirse.

---

# Objetivo

Desarrollar una aplicación web responsiva que permita asistir al docente durante el proceso de corrección mediante Inteligencia Artificial, reduciendo el tiempo necesario para evaluar exámenes escritos sin reemplazar el criterio profesional del profesor.

---

# Público Objetivo

- Profesores de nivel secundario.

> El portal para alumnos queda fuera del MVP y podrá desarrollarse en futuras versiones.

---

# Alcance del MVP

El profesor podrá:

- iniciar sesión con Google;
- crear exámenes;
- utilizar una carga inteligente para generar preguntas automáticamente;
- editar preguntas y respuestas esperadas;
- agregar criterios adicionales de corrección;
- registrar alumnos;
- subir entregas;
- corregir mediante IA;
- revisar la sugerencia;
- modificar la nota;
- aprobar la corrección definitiva.

---

# Funcionalidades principales

## Autenticación

- Google OAuth mediante Auth.js.

---

## Gestión de exámenes

Cada examen podrá contener:

- título;
- materia;
- curso;
- preguntas;
- respuestas esperadas;
- puntajes;
- criterios adicionales de corrección.

---

## Carga Inteligente

Como alternativa al ingreso manual, el profesor podrá pegar el contenido completo del examen junto con las respuestas esperadas.

La IA procesará ese texto y generará automáticamente:

- preguntas;
- respuestas esperadas;
- puntajes sugeridos.

Antes de guardar el examen, el profesor podrá revisar y modificar cualquier dato generado.

---

## Criterios adicionales de corrección

Opcionalmente, el profesor podrá agregar instrucciones adicionales para orientar la evaluación de la IA.

Ejemplos:

- aceptar sinónimos;
- no descontar errores ortográficos;
- aceptar respuestas parciales;
- permitir distintas formas de resolución.

Estos criterios serán enviados junto con la consulta a la IA para obtener una corrección más cercana al criterio del docente.

---

## Carga de entregas

Una entrega podrá cargarse mediante:

- fotografías tomadas desde un dispositivo móvil;
- imágenes JPG, JPEG, PNG o WEBP;
- documentos PDF.

El navegador permitirá abrir directamente la cámara del teléfono cuando el sistema se utilice desde un dispositivo móvil.

---

## Corrección asistida

La IA analizará la entrega y devolverá:

- texto detectado;
- estado de legibilidad;
- nivel de confianza;
- puntaje sugerido;
- observaciones por pregunta.

---

## Preguntas gráficas

Si una pregunta requiere interpretar gráficos, esquemas, diagramas o trazados manuscritos complejos, la IA no asignará una nota automáticamente.

La pregunta será marcada para revisión manual por parte del docente.

---

# Flujo de trabajo

1. El profesor inicia sesión con Google.
2. Crea un nuevo examen.
3. Agrega preguntas manualmente o utiliza la Carga Inteligente.
4. Revisa las preguntas generadas.
5. Define criterios adicionales de corrección (opcional).
6. Los alumnos realizan el examen en papel.
7. El profesor crea una nueva entrega.
8. Sube imágenes o un archivo PDF.
9. El backend envía la información a la IA.
10. La IA devuelve una propuesta de corrección.
11. El backend valida la respuesta.
12. Si la confianza es baja o existen preguntas gráficas, la entrega queda en revisión manual.
13. El profesor revisa la propuesta.
14. Modifica la nota si lo considera necesario.
15. Aprueba la corrección.

---

# Arquitectura

```text
                    Profesor
                        │
                        ▼
      Navegador (PC / Tablet / Celular)
                        │
                        ▼
              Frontend (Next.js)
                        │
                     REST API
                        │
                        ▼
               Backend (NestJS)
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
 Prisma + SQLite                Gemini API
                                        │
                              Fallback automático
                                        │
                                        ▼
                                  OpenRouter
```

---

# Tecnologías

## Frontend

- Next.js
- React
- Tailwind CSS
- Auth.js

## Backend

- NestJS
- Prisma ORM

## Base de datos

- SQLite (desarrollo)
- PostgreSQL (futuro)

## Inteligencia Artificial

- Gemini API
- OpenRouter (Fallback)

---

# Modelo de datos

## Profesor

- id
- nombre
- email
- googleId

## Alumno

- id
- nombre
- legajo

## Examen

- id
- título
- materia
- curso
- fecha

## Pregunta

- id
- examenId
- enunciado
- respuestaEsperada
- puntajeMáximo
- criteriosIA
- esEvaluacionVisual

## Entrega

- id
- examenId
- alumnoId
- archivo
- estado

## Corrección

- id
- entregaId
- notaIA
- notaFinal
- nivelConfianza
- feedbackJSON
- fechaAprobación

---

# Estados de una entrega

```text
PENDIENTE
      │
      ▼
PROCESANDO
      │
      ├──────────────► REQUIERE_REVISION
      │
      ▼
PENDIENTE_APROBACION
      │
      ▼
PUBLICADO
```

---

# Mecanismo de Fallback

El backend utilizará Gemini como proveedor principal de Inteligencia Artificial.

Si Gemini no puede responder correctamente debido a:

- límite de cuota;
- timeout;
- errores internos;
- indisponibilidad del servicio;

la solicitud será reenviada automáticamente a OpenRouter.

Este proceso será completamente transparente para el usuario.

---

# User Stories

## Profesor

- Iniciar sesión con Google.
- Crear un examen.
- Utilizar la Carga Inteligente.
- Editar preguntas y puntajes.
- Agregar criterios adicionales de corrección.
- Registrar alumnos.
- Subir fotografías o PDF.
- Obtener una sugerencia de corrección.
- Revisar preguntas marcadas para validación manual.
- Editar la nota.
- Aprobar la corrección.

---

# Organización del equipo

## Frontend

- Autenticación.
- Dashboard.
- Gestión de exámenes.
- Gestión de alumnos.
- Pantallas de corrección.

## Backend

- API REST.
- Lógica de negocio.
- Prisma.
- Integración con IA.
- Sistema de Fallback.

## Inteligencia Artificial

- Integración con Gemini.
- Integración con OpenRouter.
- Validación del JSON recibido.
- Procesamiento de imágenes.
- Ingeniería de prompts.

---

# Futuras mejoras

- Aplicación móvil.
- Portal para alumnos.
- Estadísticas de rendimiento.
- Exportación de informes.
- Integración con plataformas educativas.
- Soporte para múltiples modelos de IA.

---

# Propuesta de valor

EvalIA no busca reemplazar al docente.

Su objetivo es reducir significativamente el tiempo dedicado a la corrección de exámenes escritos mediante una primera evaluación asistida por Inteligencia Artificial.

La IA analiza, sugiere y explica.

**El profesor siempre decide.**
````
