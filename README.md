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
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Modelo de Datos](#modelo-de-datos)
- [Estados de una Entrega](#estados-de-una-entrega)
- [Mecanismo de Fallback](#mecanismo-de-fallback)
- [User Stories](#user-stories)
- [Organización del Equipo](#organización-del-equipo)
- [Roadmap](#roadmap)

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

- analizar las respuestas del alumno;
- generar una **sugerencia** de calificación;
- producir observaciones por pregunta;
- permitir que el docente revise y apruebe la corrección final.

---

# Público Objetivo

- Profesores de nivel secundario.

> **Nota:** El portal para alumnos queda fuera del MVP y podrá incorporarse en futuras versiones.

---

# Alcance del MVP

El profesor podrá:

- Iniciar sesión mediante Google.
- Crear exámenes.
- Definir preguntas, respuestas esperadas y puntajes.
- Registrar alumnos.
- Subir entregas para corregir.
- Obtener una sugerencia de corrección mediante IA.
- Revisar la propuesta generada.
- Modificar puntajes y observaciones.
- Aprobar la corrección definitiva.

## Formatos de entrega soportados

Una entrega podrá realizarse mediante:

- 📷 Fotografía tomada desde un dispositivo móvil.
- 🖼️ Imagen (`JPG`, `JPEG`, `PNG`, `WEBP`).
- 📄 Documento `PDF`.

En dispositivos móviles, el navegador permitirá utilizar la cámara directamente mediante el selector de archivos.

---

# Fuera del Alcance

Esta primera versión **no incluye**:

- Corrección completamente automática.
- Reemplazo de la decisión del docente.
- Reconocimiento perfecto de cualquier tipo de letra.
- Portal para alumnos.
- Exámenes digitales.
- Estadísticas avanzadas.
- Exportación de informes en PDF.
- Notificaciones.
- Integraciones con plataformas educativas.

---

# Flujo de Trabajo

1. El profesor inicia sesión con Google.
2. Crea un examen.
3. Define las preguntas, respuestas esperadas y puntajes.
4. Los alumnos realizan el examen en papel.
5. El profesor crea una nueva entrega y carga imágenes o un PDF.
6. El backend procesa el archivo y lo envía al proveedor de IA.
7. El proveedor devuelve una respuesta estructurada en formato JSON con:
   - texto detectado;
   - estado de legibilidad;
   - puntajes sugeridos;
   - observaciones por pregunta.
8. El backend valida el JSON recibido.
9. Si la respuesta no es suficientemente confiable, la entrega queda marcada como **Requiere revisión**.
10. El profesor revisa la propuesta.
11. Puede modificar puntajes y observaciones.
12. Aprueba la corrección definitiva.

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
┌──────────────┐              ┌─────────────────┐
│ Prisma ORM   │              │ Proveedor IA    │
│ SQLite       │              │ Gemini          │
└──────────────┘              └────────┬────────┘
                                       │
                              (Fallback automático)
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
- Auth.js (Google OAuth)

## Backend

- NestJS
- Prisma ORM
- Gemini API
- OpenRouter (Fallback)

## Base de Datos

Durante el desarrollo:

- SQLite

Arquitectura preparada para migrar posteriormente a:

- PostgreSQL

---

# Modelo de Datos

## Profesor

- id
- googleId
- nombre
- email

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

## Entrega

- id
- examenId
- alumnoId
- estado
- fecha

## Corrección

- id
- entregaId
- notaIA
- notaFinal
- feedbackJSON
- aprobadaPorProfesor
- fechaAprobación

---

# Estados de una Entrega

```text
PENDIENTE

PROCESANDO

REQUIERE_REVISION

PENDIENTE_APROBACION

PUBLICADO
```
Mecanismo de Fallback (Contingencia de IA en el Backend)
Para garantizar la estabilidad del sistema y asegurar que el proceso de corrección no dependa exclusivamente de un solo proveedor, el backend implementará un mecanismo de contingencia (Fallback) de forma invisible para el usuario.

Si la API principal falla, el sistema enrutará automáticamente la petición a un proveedor de IA secundario como OpenRouter.

Condiciones para activar el Fallback:

* Límite de Tokens o Cuota Excedida: Si la cuenta de Gemini se queda sin tokens disponibles o alcanza el límite de peticiones por minuto permitidas en su capa gratuita (Error 429 - Too Many Requests).

* Caída del Servicio o Timeout: Si los servidores de Gemini experimentan una caída (Errores 500/503) o si la respuesta demora más del tiempo máximo establecido, dejando el proceso colgado.

---

# Mecanismo de Fallback

Para aumentar la disponibilidad del sistema, el backend implementará un mecanismo automático de contingencia.

## Funcionamiento

1. El backend intenta procesar la solicitud utilizando **Gemini**.
2. Si Gemini no responde correctamente, el sistema redirige automáticamente la petición hacia un proveedor secundario compatible (por ejemplo, **OpenRouter**).
3. El usuario no percibe el cambio de proveedor.

## El Fallback se activará cuando ocurra alguno de los siguientes casos

- Límite de cuota alcanzado.
- Exceso de solicitudes (`429 Too Many Requests`).
- Timeout.
- Errores internos (`500`).
- Servicio temporalmente no disponible (`503`).

Este mecanismo evita que el proceso de corrección dependa exclusivamente de un único proveedor de Inteligencia Artificial.

---

# User Stories

## Profesor

- Como profesor quiero iniciar sesión con Google para acceder de forma segura.
- Como profesor quiero crear un examen para definir los criterios de evaluación.
- Como profesor quiero registrar alumnos para asociar las entregas.
- Como profesor quiero subir imágenes o archivos PDF para iniciar la corrección.
- Como profesor quiero obtener una sugerencia de corrección mediante IA.
- Como profesor quiero editar puntajes y observaciones antes de publicar la corrección.
- Como profesor quiero aprobar la nota definitiva.

---

# Organización del Equipo

## Frontend

- Autenticación.
- Dashboard.
- Gestión de exámenes.
- Formularios.
- Pantallas de corrección.

## Backend

- API REST.
- Lógica de negocio.
- Prisma.
- Autenticación.
- Gestión del mecanismo de Fallback.

## IA e Integración

- Comunicación con Gemini.
- Comunicación con OpenRouter.
- Procesamiento de imágenes.
- Validación del JSON recibido.
- Manejo de errores.

---

# Propuesta de Valor

La plataforma **no reemplaza al docente**.

EvalIA reduce significativamente el tiempo dedicado a la corrección de evaluaciones mediante una primera propuesta generada por Inteligencia Artificial, dejando siempre la decisión final en manos del profesor.

> **La IA asiste. El profesor siempre decide.**

---

# Flujo General

```text
                 Crear examen
                       │
                       ▼
      Agregar preguntas y respuestas
                       │
                       ▼
      Los alumnos realizan el examen
                       │
                       ▼
      Profesor crea una nueva entrega
                       │
                       ▼
      Sube imágenes o un PDF
                       │
                       ▼
      Backend procesa el archivo
                       │
                       ▼
      Proveedor IA (Gemini)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      Correcto                  Error/Timeout
         │                           │
         │                    Fallback automático
         │                           │
         ▼                           ▼
                    OpenRouter
                           │
                           ▼
              Respuesta JSON estructurada
                           │
                           ▼
               Backend valida respuesta
                           │
               ¿Resultado confiable?
                  ┌────────┴────────┐
                  │                 │
                 NO                SÍ
                  │                 │
                  ▼                 ▼
      Requiere revisión     Pendiente aprobación
                  │                 │
                  └────────┬────────┘
                           ▼
                Profesor revisa
                Modifica si desea
                           │
                           ▼
                Aprueba corrección
                           │
                           ▼
                  Corrección publicada
```

---
