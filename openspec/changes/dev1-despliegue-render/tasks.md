# Tareas: Despliegue Fullstack Unificado en Render (Tarea 1 - Sprint 3)

Lista de tareas desglosadas para implementar y verificar el hosting unificado en Render:

## 1. Preparación de Infraestructura y Configuración
- [x] **Crear `render.yaml` (Blueprint):**
  - Declarar la especificación del servicio web de frontend y variables para Render.
- [x] **Ajustar Scripts de Inicio y Build en `package.json` de Frontend:**
  - Asegurar que `npm run build` y `npm run start` expongan el puerto configurado y funcionen en el entorno de producción de Render.
- [x] **Crear la Base de Datos PostgreSQL en Render:**
  - Dar de alta la instancia gratuita `evalia-db` en Render y obtener la `Internal Database URL`.

## 2. Configuración y Despliegue del Backend (`Backend-App`)
- [ ] **Actualizar Datasource de Prisma a PostgreSQL:**
  - Configurar `provider = "postgresql"` en `prisma/schema.prisma` del backend.
  - Generar el cliente de Prisma y verificar migraciones (`prisma migrate deploy`).
- [ ] **Crear el Web Service de Backend en Render (`evalia-backend`):**
  - Conectar el repositorio de GitHub `Backend-App`.
  - Configurar las variables de entorno (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `PORT=3000`).
  - Desplegar y validar logs de arranque exitoso.

## 3. Configuración y Despliegue del Frontend (`Front`)
- [ ] **Crear el Web Service de Frontend en Render (`evalia-frontend`):**
  - Conectar el repositorio de GitHub `Front`.
  - Configurar las variables de entorno (`NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
  - Desplegar y validar build exitoso de Next.js.

## 4. Integración, Seguridad y Pruebas
- [ ] **Actualizar Credenciales de Google OAuth:**
  - Registrar la URL de producción de Render en Google Cloud Console.
- [ ] **Validación End-to-End en Producción:**
  - Iniciar sesión en `https://evalia-frontend.onrender.com`.
  - Crear un curso/examen de prueba y verificar que se persiste en PostgreSQL en Render.
  - Verificar que no existan errores de CORS ni bloqueos en consola.
