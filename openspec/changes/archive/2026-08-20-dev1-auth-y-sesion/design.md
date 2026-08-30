# Diseño: Configuración de NextAuth.js y Login UI (Tarea 3)

## Arquitectura y Flujo de Datos

El flujo de renderizado en la página raíz (`/`) se realizará de forma híbrida mediante Server Component y Client Component:

```
[Cliente]                         [Next.js Server Component]                     [NextAuth.js]
    │                                         │                                        │
    │  ─── Accede a http://localhost:3000 ──> │                                        │
    │                                         │  ─── getServerSession(authOptions) ──> │
    │                                         │  <── Retorna objeto Session o null ─── │
    │                                         │                                        │
    │                                         │  Si tiene Sesión:                      │
    │                                         │  ─── redirect('/dashboard') ─────────> │
    │                                         │                                        │
    │                                         │  Si NO tiene Sesión:                   │
    │  <── Renderiza HTML de <LoginScreen /> ─│                                        │
```

## Cambios de Archivos y Componentes

### 1. Variables de Entorno (`.env`)
Crearemos el archivo `.env` en la raíz del proyecto para alojar de forma segura las claves de autenticación en local. Este archivo estará en el `.gitignore`.

* `NEXTAUTH_URL`: `http://localhost:3000` (URL base del servidor de desarrollo).
* `NEXTAUTH_SECRET`: Clave de cifrado simétrico para firmar las cookies JWT de NextAuth.
* `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: Credenciales OAuth del proyecto en Google Cloud Console.

### 2. Controlador de Página Raíz (`app/page.tsx`)
Modificaremos [`app/page.tsx`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/page.tsx) para transformarlo en un componente de servidor asincrónico:

```typescript
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { LoginScreen } from '@/src/components/Login/LoginScreen';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return <LoginScreen />;
}
```

## Integraciones y Seguridad
* **Protección del Lado del Servidor:** Al usar `getServerSession`, evitamos parpadeos de UI (FOUC) donde el Login se muestra brevemente antes de redirigir al Dashboard, ya que la validación ocurre antes de enviar el HTML al cliente.
* **Seguridad en Cookies:** La cookie de NextAuth utiliza por defecto atributos `HttpOnly`, `SameSite=Lax` y cifrado JWE, asegurando que el token de Google esté protegido.
