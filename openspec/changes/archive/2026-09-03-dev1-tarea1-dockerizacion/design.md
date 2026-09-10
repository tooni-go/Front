# Diseño: Dockerización Fullstack y Resolución de Puertos (Tarea 1)

## Arquitectura de Red y Puertos

```
[Usuario] ────── (Puerto 3001) ─────> [ Contenedor Frontend (Next.js) ]
    │                                              │
    │                                   (Llamadas API internas/SSR)
    │                                              ▼
[Usuario] ────── (Puerto 3000) ─────> [ Contenedor Backend (NestJS) ]
                                                   │
                                            (Persistencia local)
                                                   ▼
                                         [ Volumen SQLite (data) ]
```

### Puertos Asignados:
- **Frontend (Next.js):** Puerto `3001` expuesto.
- **Backend (NestJS):** Puerto `3000` expuesto.

### Variables de Entorno del Frontend:
- `NEXT_PUBLIC_API_URL`: `http://localhost:3000` (desde el navegador del usuario).
- `NEXTAUTH_URL`: `http://localhost:3001` (para el flujo de redirecciones de autenticación).

---

## Estructura de Compilación Standalone (Next.js)

Para que el servidor de producción funcione de forma autónoma sin `node_modules` completos, se define `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
```

Esto generará el directorio `.next/standalone/server.js`, el cual copiaremos a la imagen final de ejecución junto con `public` y `.next/static`.

---

## Especificación del Dockerfile (Frontend)

```dockerfile
# 1. Instalación de dependencias
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN npm install -g pnpm && (pnpm install --frozen-lockfile || npm ci)

# 2. Compilación
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install -g pnpm && (pnpm run build || npm run build)

# 3. Imagen ligera de ejecución
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001
CMD ["node", "server.js"]
```

---

## Especificación de Docker Compose

El archivo `docker-compose.yml` se ubica en la raíz del frontend (`Front`) y orquesta el backend ubicado en la ruta relativa `../../BackPasantia/Backend-App`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ../../BackPasantia/Backend-App
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=file:/app/prisma/data/dev.db
    volumes:
      - backend-db:/app/prisma/data
      - backend-uploads:/app/uploads
    networks:
      - evalia-network
    restart: always

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000
      - NEXTAUTH_URL=http://localhost:3001
    depends_on:
      - backend
    networks:
      - evalia-network
    restart: always

volumes:
  backend-db:
  backend-uploads:

networks:
  evalia-network:
    driver: bridge
```
