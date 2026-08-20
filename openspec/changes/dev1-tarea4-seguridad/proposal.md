# Propuesta: Guard de Sesión, Seguridad y Cliente API (Tarea 4)

## Problema
Actualmente, las rutas protegidas del frontend (como `/dashboard`, `/cursos`, `/alumnos`, `/examenes`, etc.) no tienen protección real a nivel de navegación; cualquier usuario puede escribir la URL en el navegador y acceder a la interfaz sin haber iniciado sesión.
Además, no existe un cliente HTTP unificado que se comunique con el backend (`evalia-backend`) y adjunte automáticamente el token JWT de autenticación para realizar peticiones autorizadas.

## Solución Propuesta
1. **Middleware de Next.js (Guard de Rutas):** Implementar un archivo de middleware (`middleware.ts`) en la raíz del proyecto para proteger todas las rutas privadas de EvalIA. El middleware utilizará NextAuth para verificar si existe una sesión activa; de lo contrario, redirigirá al usuario a la página de login (`/`).
2. **Cliente API Unificado con Interceptor:** Desarrollar un cliente API centralizado utilizando `fetch` (o `axios`) que recupere dinámicamente el token JWT de la sesión activa de NextAuth e inyecte la cabecera `Authorization: Bearer <TOKEN>` en cada petición saliente hacia el backend.
3. **Intercambio de Tokens en NextAuth:** Modificar `authOptions` en [`app/api/auth/[...nextauth]/route.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/api/auth/%5B...nextauth%5D/route.ts) para agregar callbacks de sesión y de JWT. Esto nos permitirá intercambiar el token de Google por el JWT del backend en el login inicial y persistirlo en la sesión.

## Alcance e Impacto
- **Frontend (`evalia-frontend`):**
  - Creación del archivo `middleware.ts` en la raíz.
  - Creación del cliente API unificado en `src/lib/api.ts`.
  - Modificación de [`app/api/auth/[...nextauth]/route.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/api/auth/%5B...nextauth%5D/route.ts) para el intercambio de tokens.
- **Backend (`evalia-backend`):** Ninguno en esta tarea (se asume que el endpoint `/auth/login` ya está implementado).
