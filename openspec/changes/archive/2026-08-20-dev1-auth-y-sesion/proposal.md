# Propuesta: Configuración de NextAuth.js y Login UI (Tarea 3)

## Problema
Actualmente, la aplicación de frontend (`evalia-frontend`) cuenta con el componente de inicio de sesión [`LoginScreen`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Login/LoginScreen.tsx) y el contexto [`AuthContext`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/context/AuthContext.tsx) pre-configurado para consumir NextAuth. 
Sin embargo:
1. No existe un archivo `.env` configurado localmente con las variables necesarias para Google OAuth.
2. El enrutamiento de la página raíz [`app/page.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/page.tsx) redirige incondicionalmente a `/dashboard`, omitiendo la verificación de sesión en el servidor y la visualización de la UI de login.

## Solución Propuesta
1. **Configuración de Variables de Entorno:** Generar el archivo `.env` local y configurar el `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
2. **Control de Acceso en el Raíz (`/`):** Modificar la página raíz [`app/page.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/page.tsx) para que actúe como un Server Component que obtenga la sesión del servidor:
   - Si existe sesión, redirigir a `/dashboard`.
   - Si no existe sesión, renderizar la interfaz [`LoginScreen`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Login/LoginScreen.tsx).

## Alcance e Impacto
* **Frontend (`evalia-frontend`):**
  - Modificación de [`app/page.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/page.tsx).
  - Creación del archivo `.env` local.
* **Backend (`evalia-backend`):** Ninguno. El backend no es modificado en esta fase (se integra en la Tarea 4).
* **Flujo de Usuario:** Los usuarios no autenticados verán la pantalla de login al ingresar a la plataforma, y serán redirigidos a su panel tras iniciar sesión exitosamente con Google.
