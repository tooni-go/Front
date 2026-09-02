# 1. Compilación
FROM node:20-slim AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias asegurando los binarios nativos para Tailwind y Lightning CSS
RUN npm install --include=optional && npm install @tailwindcss/oxide-linux-x64-gnu lightningcss-linux-x64-gnu

# Copiar el resto del código y compilar
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 2. Imagen de ejecución
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001
CMD ["node", "server.js"]
