# Diseño: Despliegue Fullstack Unificado en Render (Tarea 1 - Sprint 3)

## Arquitectura de Despliegue en Render

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                       RENDER CLOUD                                      │
│                                                                                         │
│   ┌─────────────────────────────────────┐       ┌───────────────────────────────────┐   │
│   │ 🌐 Web Service: evalia-frontend     │       │ 🚀 Web Service: evalia-backend    │   │
│   │ • Repo: Front                       │       │ • Repo: Backend-App               │   │
│   │ • Runtime: Node 20 / Dockerfile     │       │ • Runtime: Node 20 / Dockerfile   │   │
│   │ • Puerto: 3001                      │       │ • Puerto: 3000                    │   │
│   │ • Dominio: evalia-front.onrender.com│       │ • Dominio: evalia-back.onrender.com│  │
│   │                                     │       │                                   │   │
│   │   NEXT_PUBLIC_API_URL ──────────────┼──────▶│ (REST API & Webhooks)             │   │
│   └──────────────────┬──────────────────┘       └─────────────────┬─────────────────┘   │
│                      │                                            │                     │
│                      ▼                                            ▼                     │
│         ┌─────────────────────────┐                 ┌───────────────────────────┐       │
│         │ Google Cloud OAuth      │                 │ 🐘 Managed PostgreSQL     │       │
│         │ • Authorized Origins    │                 │ • Database: evalia_db     │       │
│         │ • Callback URLs         │                 │ • DATABASE_URL            │       │
│         └─────────────────────────┘                 └───────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Configuración de Servicios en Render

### Servicio 1: Base de Datos PostgreSQL (`evalia-db`)
- **Tipo:** PostgreSQL (Free Tier de Render)
- **Base de Datos:** `evalia`
- **Usuario:** `evalia_user`
- **Genera:** Cadena de conexión `Internal Database URL` y `External Database URL`.

---

### Servicio 2: Backend NestJS (`evalia-backend`)
- **Repositorio:** `Backend-App` (rama `Develop` o `main`)
- **Environment:** `Node` o `Docker`
- **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
- **Start Command:** `npm run start:prod` (o `node dist/main.js`)
- **Variables de Entorno Clave:**
  - `NODE_ENV`: `production`
  - `PORT`: `3000`
  - `DATABASE_URL`: `[Internal Database URL de Render Postgres]`
  - `JWT_SECRET`: `[Clave secreta para tokens JWT]`
  - `GEMINI_API_KEY`: `[API Key de Google AI]`
  - `OPENROUTER_API_KEY`: `[API Key de OpenRouter]`
  - `FRONTEND_URL`: `https://evalia-frontend.onrender.com` (para configuración de CORS)

---

### Servicio 3: Frontend Next.js (`evalia-frontend`)
- **Repositorio:** `Front` (rama `Develop` o `feature/sprint3-dev1-cd-borradores`)
- **Environment:** `Node` o `Docker` (usando el `Dockerfile` optimizado)
- **Build Command (Node):** `npm install && npm run build`
- **Start Command (Node):** `npm run start` (o `node .next/standalone/server.js` si se usa standalone)
- **Variables de Entorno Clave:**
  - `NODE_ENV`: `production`
  - `PORT`: `3001`
  - `NEXT_PUBLIC_API_URL`: `https://evalia-backend.onrender.com`
  - `APP_URL`: `https://evalia-frontend.onrender.com`
  - `NEXTAUTH_URL`: `https://evalia-frontend.onrender.com`
  - `NEXTAUTH_SECRET`: `[Clave secreta NextAuth]`
  - `GOOGLE_CLIENT_ID`: `[Client ID de Google Cloud Console]`
  - `GOOGLE_CLIENT_SECRET`: `[Client Secret de Google Cloud Console]`

---

## 2. Manifiesto de Infraestructura como Código (`render.yaml`)

Se proveerá el archivo de Blueprint para Render en la raíz de `Front` para permitir la importación automatizada o como guía de referencia:

```yaml
services:
  # Frontend Next.js Web Service
  - type: web
    name: evalia-frontend
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: NEXT_PUBLIC_API_URL
        sync: false
      - key: NEXTAUTH_URL
        sync: false
      - key: NEXTAUTH_SECRET
        generateValue: true
      - key: APP_URL
        sync: false
```

---

## 3. Plan de Migración de Base de Datos (Prisma + PostgreSQL)
Para sincronizar el backend con la nueva base de datos PostgreSQL de Render:
1. En el repositorio de backend `Backend-App`, actualizar `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Generar y aplicar las migraciones iniciales para PostgreSQL:
   ```bash
   npx prisma migrate dev --name init_postgres
   ```
3. En Render, cada despliegue ejecutará `npx prisma migrate deploy` para mantener las tablas actualizadas sin intervención manual.

---

## 4. Configuración de Seguridad y Google OAuth
- **Google Cloud Console:**
  - Añadir en *Orígenes de JavaScript autorizados*: `https://evalia-frontend.onrender.com`
  - Añadir en *URIs de redireccionamiento autorizados*: `https://evalia-frontend.onrender.com/api/auth/callback/google`
- **CORS en Backend:**
  - Asegurar que `evalia-backend` admita peticiones desde `https://evalia-frontend.onrender.com` con credentials habilitadas.
