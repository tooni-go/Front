# Especificación de Requerimientos: Autenticación, Sesión y Saludo Docente

## 1. Limpieza de Estado y Cierre de Sesión (Logout)

### 1.1 Limpieza Selectiva de Almacenamiento Local (`localStorage`)
- **Regla:** Al ejecutar la acción de cerrar sesión (`logout`), el sistema debe recorrer y eliminar todas las claves de `localStorage` que correspondan a datos del dominio de EvalIA:
  - `evalia_students`
  - `evalia_exams`
  - `evalia_deliveries`
  - Todas las claves generadas por el sistema de autoguardado que comiencen con `evalia_autosave_` o `autosave_examen_`.
  - Cualquier otra clave con prefijo `evalia_`.
- **Regla de Aislamiento:** No se deben borrar claves ajenas de otras aplicaciones si existieran en el entorno local del navegador.

### 1.2 Limpieza de Almacenamiento de Sesión (`sessionStorage`)
- **Regla:** Se debe invocar `sessionStorage.clear()` para garantizar que no persistan tokens o identificadores temporales de sesión.

### 1.3 Reinicio de Estado en Memoria (React Contexts)
- **Regla:** `EvaliaContext` debe proveer una función `resetState()` que restaure:
  - `courses`: array vacío `[]`
  - `students`: colección inicial reseteada / limpia
  - `exams`: colección limpia
  - `deliveries`: colección limpia
  - `activeCourseId`, `activeExamId`, `activeDeliveryId`, `editingStudentId`, `pendingGeneratedExam`: `null`.
- **Regla:** `AuthContext` debe setear `user` a `null` y culminar el flujo con `signOut({ callbackUrl: '/' })`.

---

## 2. Sincronización del Perfil Docente y Saludo Dinámico

### 2.1 Consulta e Integración con `/api/v1/profesor/me`
- **Regla:** Al detectarse una sesión autenticada activa, `AuthContext` debe consultar `GET /api/v1/profesor/me` mediante `fetchApi`.
- **Regla:** Si la respuesta contiene `nombre` y/o `apellido`, `AuthContext` debe componer el nombre completo y exponerlo en el objeto de usuario:
  - `nombre`: string retornado por el backend
  - `apellido`: string retornado por el backend
  - `departamento`: string retornado por el backend
  - `name`: `${nombre} ${apellido}`.trim() o fallback al `name` de Google OAuth.
- **Regla:** `AuthContext` debe proveer una función asíncrona `refreshProfile()` que vuelva a consultar `/api/v1/profesor/me` y actualice el estado local de forma transparente.

### 2.2 Saludo Personalizado en el Dashboard
- **Regla:** En `DashboardView`, el saludo principal debe renderizarse con el formato:
  `¡Hola de nuevo, {nombre}!`
- **Regla:** Si el nombre del docente está disponible (ya sea por su perfil o por Google), se muestra su nombre de pila (o nombre completo si no se desglosa).
- **Regla de Fallback:** Si no se dispone de nombre, el saludo debe ser `¡Hola de nuevo, Profesor!`.

### 2.3 Edición de Perfil Reactiva
- **Regla:** Al guardar cambios en `MiPerfilView` vía `PUT /api/v1/profesor/me`, tras recibir respuesta exitosa se debe invocar `refreshProfile()` para actualizar el estado global en tiempo real y cerrar el modo edición, sin recargar la página completa.
