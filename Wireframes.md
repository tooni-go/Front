```text
==========================================================
                  INTERFACES DEL SISTEMA
                        EVALIA
==========================================================


FLUJO PRINCIPAL

Login
  │
  ▼
Dashboard
  │
  ▼
Evaluaciones
  │
  ├── Nueva evaluación
  │
  └── Abrir evaluación
          │
          ├── Ver preguntas
          ├── Editar evaluación
          ├── Nueva entrega
          └── Revisar entrega



==========================================================
1. LOGIN
(Se abre al ingresar a la aplicación)
==========================================================

+------------------------------------------------------+
|                                                      |
|                      EVALIA                          |
|                                                      |
| Asistencia inteligente para la corrección            |
| de evaluaciones manuscritas                          |
|                                                      |
|          [ Continuar con Google ]                    |
|                                                      |
| "La IA asiste. El profesor siempre decide."          |
|                                                      |
+------------------------------------------------------+



==========================================================
2. DASHBOARD
(Se abre luego de iniciar sesión)
==========================================================

--------------------------------------------------------

                    EVALIA

Bienvenido, Profesor

--------------------------------------------------------

          + Nueva evaluación

--------------------------------------------------------

          Ver evaluaciones

--------------------------------------------------------

Evaluaciones recientes

• Matemática 2°A

• Historia 4°C

• Física 5°B



==========================================================
3. LISTA DE EVALUACIONES
(Se abre al presionar "Ver evaluaciones")
==========================================================

--------------------------------------------------------

Evaluaciones

                    [+ Nueva evaluación]

--------------------------------------------------------

Matemática

Curso: 2°A

Fecha: 15/06/2026

20 preguntas

Puntaje total: 100

32 entregas

                     [Abrir]

--------------------------------------------------------

Historia

Curso: 4°C

Fecha: 10/06/2026

12 preguntas

Puntaje total: 60

28 entregas

                     [Abrir]



==========================================================
4. NUEVA EVALUACIÓN
(Se abre al presionar "Nueva evaluación")
==========================================================

Paso 1 de 2

Título

_____________________

Materia

_____________________

Curso

_____________________

Fecha

__/__/____

             [Siguiente]



==========================================================
5. CARGA DE PREGUNTAS
(Se abre al presionar "Siguiente")
==========================================================

+ Agregar pregunta

------------------------------------------------

Enunciado

_____________________________________

Respuesta esperada

_____________________________________

Puntaje máximo

[10]

                  [Eliminar]

------------------------------------------------

+ Agregar otra pregunta

------------------------------------------------

PUNTAJE TOTAL

100 puntos

(Se calcula automáticamente)

------------------------------------------------

         [Guardar evaluación]



==========================================================
6. DETALLE DE LA EVALUACIÓN
(Se abre al presionar "Abrir")
==========================================================

Matemática - 2°A

15/06/2026

20 preguntas

Puntaje total: 100

--------------------------------------------------------

[ Ver preguntas ]

[ Editar evaluación ]

--------------------------------------------------------

ENTREGAS

                [+ Nueva entrega]

--------------------------------------------------------

Filtros

[Todas]

[Pendientes]

[Procesando]

[Revisión]

[Pendiente aprobación]

[Publicadas]

--------------------------------------------------------

Alumno         Estado        IA      Docente

Juan Pérez     Publicada    86/100    90/100

Ana Gómez      Pendiente      --        --

Pedro López    Revisión     71/100      --

Laura Ruiz     Procesando     --        --

--------------------------------------------------------

(Hacer clic sobre cualquier fila abre la revisión.)



==========================================================
7. NUEVA ENTREGA
(Se abre al presionar "Nueva entrega")
==========================================================

Alumno

___________________________

(Si existe aparece en una lista)

Si no existe:

[Crear alumno]

--------------------------------------------------------

Archivos

Puede subir:

✓ Una o varias imágenes

✓ Un único PDF

--------------------------------------------------------

Archivos seleccionados

📷 hoja1.jpg

📷 hoja2.jpg

📷 hoja3.jpg

o

📄 examen.pdf

--------------------------------------------------------

        [Enviar para corregir]



==========================================================
8. PROCESANDO
(Aparece automáticamente al enviar la entrega)
==========================================================

+-----------------------------------------+

Procesando entrega...

⏳

Analizando archivos...

Extrayendo texto...

Generando sugerencias...

+-----------------------------------------+



==========================================================
9. REVISIÓN DE ENTREGA
(Se abre automáticamente cuando termina la IA
o al hacer clic sobre una entrega)
==========================================================

+========================================================+

Alumno

Juan Pérez

Estado

Pendiente de aprobación

----------------------------------------------------------

ARCHIVOS

[ Hoja 1 ]

[ Hoja 2 ]

[ Hoja 3 ]

(Cambiar de hoja mantiene la corrección visible)

----------------------------------------------------------

Vista previa

+------------------------------+

Imagen de la hoja seleccionada

+------------------------------+

----------------------------------------------------------

Texto detectado

"La célula es..."

----------------------------------------------------------

Pregunta 1

Enunciado

¿Qué es una célula?

----------------------------------------------------------

Respuesta esperada

"La unidad básica..."

----------------------------------------------------------

Respuesta detectada

"La célula es..."

----------------------------------------------------------

Comentario IA

"La respuesta es correcta aunque incompleta."

----------------------------------------------------------

Puntaje IA

8 / 10

[Editar]

----------------------------------------------------------

Pregunta 2

...

----------------------------------------------------------

NOTA IA

86 / 100

Proveedor:

Gemini

Tokens utilizados:

3.452

----------------------------------------------------------

NOTA DOCENTE

[90]

----------------------------------------------------------

Observaciones

______________________________________

----------------------------------------------------------

        [Aprobar corrección]

+========================================================+



==========================================================
10. REQUIERE REVISIÓN
(Se abre cuando la IA no logra interpretar correctamente
la entrega)
==========================================================

⚠ Revisión manual requerida

La IA no pudo interpretar correctamente
parte del examen.

Se recomienda revisar manualmente
antes de aprobar la corrección.

--------------------------------------------------------

[Revisar entrega]



==========================================================
11. PREGUNTAS DEL EXAMEN
(Se abre al presionar "Ver preguntas")
==========================================================

Pregunta 1

Puntaje: 10

Respuesta esperada

"La célula es..."

--------------------------------------------------------

Pregunta 2

Puntaje: 5

Respuesta esperada

"..."

--------------------------------------------------------

...

--------------------------------------------------------

TOTAL

100 puntos



==========================================================
12. EDITAR EVALUACIÓN
(Se abre al presionar "Editar evaluación")
==========================================================

Título

_____________________

Materia

_____________________

Curso

_____________________

Fecha

__/__/____

--------------------------------------------------------

[Editar preguntas]

--------------------------------------------------------

        [Guardar cambios]



==========================================================
MENÚ LATERAL
==========================================================

+------------------------------+
|          EVALIA              |
|------------------------------|
| 🏠 Dashboard                 |
| 📝 Evaluaciones              |
|                              |
| Profesor ▼                   |
+------------------------------+

Menú del usuario

• Mi perfil

• Cerrar sesión
```
