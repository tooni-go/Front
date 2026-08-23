# Tareas: Guard de Sesión, Seguridad y Cliente API (Tarea 4)

Lista de tareas para asegurar el ruteo e implementar el cliente HTTP unificado:

## Configuración y Desarrollo
- [x] **Configurar Callbacks de Intercambio en NextAuth:**
  - Modificar [`app/api/auth/[...nextauth]/route.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/api/auth/%5B...nextauth%5D/route.ts).
  - Añadir el callback `jwt` para interceptar el token de Google y enviarlo a `POST /auth/login` en el backend, obteniendo e inyectando el `accessToken` interno.
  - Añadir el callback `session` para hacer accesible el `backendJwt` en el objeto de sesión del cliente.
- [x] **Crear el Middleware de Seguridad:**
  - Crear el archivo [`middleware.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/middleware.ts) en la raíz del proyecto.
  - Configurar `matcher` para proteger las rutas privadas: `/dashboard`, `/cursos`, `/alumnos`, `/examenes`, `/entregas` y `/perfil`.
- [x] **Crear el Cliente API Unificado:**
  - Crear el archivo [`src/lib/api.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/lib/api.ts).
  - Implementar la función `apiClient` de modo que lea dinámicamente el `backendJwt` mediante `getSession()` de NextAuth y lo envíe en las cabeceras.

## Pruebas y Verificación
- [x] **Validación de Bloqueo de Rutas (Middleware):**
  - Cerrar sesión en la aplicación.
  - Intentar ingresar directamente a la URL `http://localhost:3000/dashboard` escribiéndola en el navegador.
  - Verificar que el middleware te intercepta y te redirige automáticamente a la página de login (`/`).
- [x] **Validación de Cabeceras JWT en la API:**
  - Iniciar sesión en la aplicación.
  - Hacer una llamada a la API a través del `apiClient` y verificar en la consola de red (F12) que los requests salientes incluyen la cabecera `Authorization: Bearer <TOKEN_JWT>`.
