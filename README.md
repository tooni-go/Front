# EvalIA

> Plataforma web de **asistencia inteligente para la corrección de exámenes manuscritos**. EvalIA utiliza Inteligencia Artificial para generar una **sugerencia de calificación** y observaciones por pregunta, manteniendo siempre al docente como responsable de la evaluación final.

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

EvalIA busca reducir el tiempo que los docentes dedican a corregir exámenes escritos en papel mediante una **asistencia basada en Inteligencia Artificial**.

La IA analiza cada entrega, interpreta las respuestas, propone una calificación y genera observaciones por pregunta. Sin embargo, **la decisión final siempre pertenece al docente**, quien puede aceptar o modificar cualquier sugerencia antes de publicar la corrección.

---

# Problema

Los docentes de nivel secundario dedican una gran cantidad de horas extra a corregir evaluaciones escritas manualmente, retrasando la devolución de resultados y aumentando su carga laboral.

---

# Objetivo

Desarrollar una aplicación web de asistencia a la corrección de exámenes escritos que utilice Inteligencia Artificial para:

- Analizar las respuestas del alumno.
- Generar una **sugerencia** de calificación.
- Producir observaciones por pregunta.
- Permitir que el docente revise y apruebe la corrección final.

---

# Público Objetivo

- Profesores de nivel secundario.

> **Nota:** El portal para alumnos queda fuera del MVP y podrá incorporarse en futuras versiones.

---

# Alcance del MVP

El profesor podrá:

- Iniciar sesión mediante Google.
- Crear exámenes.
- **Definir la rúbrica rápidamente mediante la Carga Inteligente (Copy-Paste asistido por IA) o formulario manual.**
- Asignar y redistribuir puntajes por pregunta de forma equitativa o personalizada.
- Registrar alumnos.
- Subir entregas para corregir.
- Obtener una sugerencia de corrección mediante IA con autoevaluación de certeza.
- Revisar la propuesta generada (con alertas especiales para preguntas gráficas o con letra ilegible).
- Modificar puntajes y observaciones.
- Aprobar la corrección definitiva.

## Formatos de entrega soportados

Una entrega podrá realizarse mediante:

- 📷 Fotografía tomada desde un dispositivo móvil.
- 🖼️ Imagen (`JPG`, `JPEG`, `PNG`, `WEBP`).
- 📄 Documento `PDF`.

En dispositivos móviles, el navegador permitirá utilizar la cámara directamente mediante el selector de archivos nativo.

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
- Notificaciones.
- Integraciones con plataformas educativas.

---

# Carga Inteligente de Exámenes (Opción C)

Para optimizar el tiempo de preparación del examen sin introducir la complejidad técnica de procesar archivos PDF/Word heterogéneos, el sistema utiliza un enfoque de **Copy-Paste Asistido por IA**:

1. **Entrada de datos simplificada:** El docente copia el texto completo de su examen y clave de respuestas desde su procesador de texto habitual y lo pega en un área de texto único (`<textarea>`).
2. **Estructuración por IA:** NestJS envía este texto crudo a Gemini con un *System Prompt* estricto de extracción.
3. **Generación del formulario:** La IA procesa el contenido y devuelve un esquema JSON estructurado con las preguntas separadas, sus respuestas esperadas y una distribución equitativa del puntaje (que suma 100).
4. **Validación docente:** El frontend renderiza automáticamente la rúbrica en un formulario dinámico, permitiendo al profesor hacer ajustes menores antes de guardar.

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
La entrega se marca automáticamente con el estado `REQUIERE_REVISION`. En la pantalla de revisión, el docente verá las preguntas de texto ya corregidas y la pregunta gráfica resaltada para asignarle la nota manualmente en segundos.

---

# Flujo de Trabajo

1. El profesor inicia sesión con Google.
2. Crea un examen utilizando el **Copy-Paste Inteligente** (o formulario manual).
3. La IA parsea el examen, extrae las preguntas y distribuye el puntaje automáticamente.
4. Los alumnos realizan el examen en papel.
5. El profesor crea una nueva entrega y carga imágenes o un PDF.
6. El backend procesa el archivo y lo envía al proveedor de IA con sus *System Prompts* y guardrails de seguridad.
7. El proveedor devuelve una respuesta estructurada en formato JSON con:
   - Texto detectado.
   - Nivel de confianza y estado de legibilidad.
   - Puntajes sugeridos por pregunta (o `null` si requiere validación humana).
   - Observaciones por pregunta.
8. El backend valida el JSON recibido.
9. Si el nivel de confianza es bajo, la letra es ilegible o hay preguntas gráficas marcadas para revisión, la entrega queda en estado **REQUIERE_REVISION**. Caso contrario, pasa a **PENDIENTE_APROBACION**.
10. El profesor revisa la propuesta.
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
              │    Frontend     │
              │ Next.js + React │
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

Tecnologías
Frontend
Next.js

React

Tailwind CSS

Auth.js (Google OAuth)

Backend
NestJS

Prisma ORM

Gemini API (Modelos multimodal con Structured Output)

OpenRouter (Fallback)

Base de Datos
Desarrollo: SQLite

Producción (Futura migración): PostgreSQL

Modelo de Datos
Profesor: id, googleId, nombre, email

Alumno: id, nombre, legajo

Examen: id, título, materia, curso, fecha

Pregunta: id, examenId, enunciado, respuestaEsperada, puntajeMáximo, esEvaluacionVisual (boolean)

Entrega: id, examenId, alumnoId, estado, fecha

Corrección: id, entregaId, notaIA, notaFinal, nivelConfianza (ALTO / MEDIO / BAJO), feedbackJSON, aprobadaPorProfesor, fechaAprobación

Estados de una Entrega
Plaintext
PENDIENTE ──► PROCESANDO ──► REQUIERE_REVISION ──► PENDIENTE_APROBACION ──► PUBLICADO
Mecanismo de Fallback
Para aumentar la disponibilidad del sistema, el backend implementará un mecanismo automático de contingencia.

Funcionamiento
El backend intenta procesar la solicitud utilizando Gemini.

Si Gemini no responde correctamente, el sistema redirige automáticamente la petición hacia un proveedor secundario compatible (por ejemplo, OpenRouter).

El usuario no percibe el cambio de proveedor.

Activación del Fallback
Se activará cuando ocurra alguno de los siguientes eventos:

Límite de cuota alcanzado (429 Too Many Requests).

Timeout.

Errores internos del servidor (500).

Servicio temporalmente no disponible (503).

User Stories
Profesor
Como profesor quiero iniciar sesión con Google para acceder de forma segura.

Como profesor quiero crear un examen pegando el texto completo para acelerar la definición de rúbricas.

Como profesor quiero ajustar y redistribuir puntajes de preguntas fácilmente antes de guardar un examen.

Como profesor quiero registrar alumnos para asociar las entregas.

Como profesor quiero subir imágenes o archivos PDF para iniciar la corrección.

Como profesor quiero obtener una sugerencia de corrección con advertencias automáticas en preguntas dudosas o gráficas.

Como profesor quiero editar puntajes y observaciones antes de publicar la corrección.

Como profesor quiero aprobar la nota definitiva.

Organización del Equipo
Frontend: Autenticación, Dashboard, Gestión de exámenes (Carga Inteligente & Formulario Dinámico), Formularios, Pantallas de corrección y revisión visual.

Backend: API REST, Lógica de negocio, Prisma ORM, Autenticación, Gestión del mecanismo de Fallback.

IA e Integración: Prompts de extracción (Copy-Paste a Rúbrica JSON), Prompts de corrección con Guardrails y Autoevaluación, Comunicación con Gemini y OpenRouter, Procesamiento de imágenes, Validación del JSON recibido, Manejo de errores.

Propuesta de Valor
La plataforma no reemplaza al docente.

EvalIA reduce significativamente el tiempo dedicado a la corrección de evaluaciones mediante una primera propuesta generada por Inteligencia Artificial, dejando siempre la decisión final en manos del profesor.

La IA asiste. El profesor siempre decide.

Flujo General
Plaintext
               Profesor crea examen
                         │
                         ▼
           Copia y pega texto del examen
                         │
                         ▼
            IA extrae preguntas y puntajes
             (Carga Inteligente Opción C)
                         │
                         ▼
          Los alumnos realizan el examen
                         │
                         ▼
          Profesor crea una nueva entrega
                         │
                         ▼
               Sube imágenes o PDF
                         │
                         ▼
             Backend procesa archivo
                         │
                         ▼
               Proveedor IA (Gemini)
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
     Correcto                      Error/Timeout
         │                               │
         │                      Fallback automático
         │                               │
         ▼                               ▼
                                     OpenRouter
                                         │
                                         ▼
                            Respuesta JSON estructurada
                             (Autoevaluación & Guardrails)
                                         │
                                         ▼
                              Backend valida respuesta
                                         │
                              ¿Es confiable / sin dudas
                                 gráficas complejas?
                                 ┌───────┴───────┐
                                 │               │
                                NO               SÍ
                                 │               │
                                 ▼               ▼
                         Requiere revisión    Pendiente aprobación
                                 │               │
                                 └───────┬───────┘
                                         │
                                         ▼
                                  Profesor revisa
                              (Evalúa gráficos si hay)
                                 Modifica si desea
                                         │
                                         ▼
                                 Aprueba corrección
                                         │
                                         ▼
                                Corrección publicada
