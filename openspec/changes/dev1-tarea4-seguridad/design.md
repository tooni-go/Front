# Diseño: Guard de Sesión, Seguridad y Cliente API (Tarea 4)

## Flujo Técnico de Intercambio y Autorización

```
[Usuario]                 [NextAuth.js (Next.js)]                   [NestJS (Backend)]
    │                                │                                      │
    │  ─── Login con Google ───────> │                                      │
    │                                │  ─── POST /auth/login (Google Token) ─>│
    │                                │  <── Retorna JWT de EvalIA ──────────│
    │                                │                                      │
    │  <── Retorna Sesión + JWT ─────│                                      │
    │                                │                                      │
    │  ─── Realiza Petición (API) ─> │  ─── Petición con Bearer JWT ───────>│
```

## Cambios de Código Detallados

### 1. Intercambio de Tokens en NextAuth
Modificaremos [`app/api/auth/[...nextauth]/route.ts`](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/app/api/auth/%5B...nextauth%5D/route.ts) para interceptar el login inicial y obtener el JWT del backend:

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: account.id_token }),
          });

          if (response.ok) {
            const data = await response.json();
            token.backendJwt = data.accessToken;
          }
        } catch (error) {
          console.error("Error al intercambiar el token de Google con el backend:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.backendJwt = token.backendJwt;
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
```

### 2. Middleware de Rutas (`middleware.ts`)
Crearemos el archivo `middleware.ts` en la raíz del proyecto para asegurar que ningún usuario sin sesión pueda ver vistas privadas:

```typescript
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cursos/:path*',
    '/alumnos/:path*',
    '/examenes/:path*',
    '/entregas/:path*',
    '/perfil/:path*',
  ],
};
```

### 3. Cliente API Unificado (`src/lib/api.ts`)
Crearemos un cliente HTTP unificado utilizando `fetch` para facilitar las llamadas autorizadas en los componentes de cliente:

```typescript
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // @ts-ignore
  if (session?.backendJwt) {
    // @ts-ignore
    headers.set('Authorization', `Bearer ${session.backendJwt}`);
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la petición');
  }
  
  return response.json();
}
```
