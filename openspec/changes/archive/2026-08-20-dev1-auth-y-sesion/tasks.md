# Tareas: Configuración de NextAuth.js y Login UI (Tarea 3)

Lista de tareas para completar e implementar el flujo de inicio de sesión:

## Preparación y Configuración
- [x] **Configurar Variables de Entorno Locales:**
  - Copiar `.env.example` a un nuevo archivo `.env` en la raíz del proyecto.
  - Generar un `NEXTAUTH_SECRET` de manera local usando un comando de terminal (ej. `openssl rand -base64 32`).
  - Obtener e ingresar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` desde la consola de desarrolladores de Google Cloud.

## Desarrollo del Código
- [x] **Actualizar Página Raíz (`app/page.tsx`):**
  - Modificar [`app/page.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/page.tsx) para hacerlo asincrónico.
  - Importar `getServerSession` de `next-auth/next`.
  - Importar `authOptions` de [`app/api/auth/[...nextauth]/route.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/api/auth/%5B...nextauth%5D/route.ts).
  - Validar la existencia de la sesión y redirigir a `/dashboard` si existe, o renderizar el componente [`LoginScreen`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Login/LoginScreen.tsx) en caso contrario.

## Pruebas y Verificación
- [x] **Validación de Redirección:**
  - Iniciar el servidor local (`npm run dev`) y abrir `http://localhost:3000`.
  - Verificar que se muestra la interfaz de inicio de sesión (`LoginScreen`) al no estar autenticado.
- [x] **Validación de Inicio de Sesión de Google:**
  - Presionar el botón "Continuar con Google".
  - Completar el flujo de autenticación de Google y verificar que redirige correctamente a `http://localhost:3000/dashboard`.
