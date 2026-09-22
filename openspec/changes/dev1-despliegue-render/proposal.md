# Propuesta: Despliegue Fullstack Unificado en Render y Base de Datos PostgreSQL (Tarea 1 - Sprint 3)

## Problema
Actualmente, el proyecto EvalIA se ejecuta únicamente en entornos locales mediante Docker / Node. Para que la plataforma esté accesible y funcional para los docentes y evaluadores, es necesario disponer de un despliegue unificado en la nube con un proveedor confiable y accesible.

Además:
1. El frontend (`Front`) y el backend (`Backend-App`) se encuentran en repositorios separados en GitHub y requieren una estrategia de comunicación coordinada (CORS, URLs públicas HTTPS y variables de entorno sincronizadas).
2. El uso de SQLite en contenedores cloud gratuitos de Render conlleva el riesgo de pérdida de datos por la naturaleza efímera del disco, por lo que se requiere adoptar **PostgreSQL** administrado en producción con Prisma.

## Solución Propuesta
1. **Infraestructura Cloud en Render:**
   - Crear una base de datos **PostgreSQL administrada** en Render (`evalia-db`) que suministre una cadena de conexión `DATABASE_URL` persistente y segura.
   - Desplegar el servicio web **`evalia-backend`** (NestJS) en Render configurado con migraciones automáticas de Prisma (`prisma migrate deploy`) y variables de entorno productivas.
   - Desplegar el servicio web **`evalia-frontend`** (Next.js) en Render conectado a la URL pública HTTPS del backend.
2. **Infraestructura como Código (Blueprint `render.yaml`):**
   - Diseñar el manifiesto `render.yaml` y la guía de despliegue para aprovisionar y orquestar ambos servicios de manera declarativa y reproducible.
3. **Sincronización de Variables de Entorno y CORS:**
   - Configurar `NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
   - Ajustar CORS y URLs de callback de Google OAuth para los dominios generados por Render (`https://*.onrender.com`).
4. **Verificación de Persistencia y Conectividad:**
   - Validar que los endpoints del backend respondan correctamente desde el frontend en producción sin bloqueos de red ni problemas de sesión.

## Alcance e Impacto
- **Frontend (`Front`):**
  - Creación del blueprint declarativo `render.yaml` y/o scripts de despliegue optimizados para Render.
  - Verificación del build productivo de Next.js (`output: 'standalone'` o `next start`).
  - Documentación detallada del paso a paso para el alta en Render Dashboard.
- **Backend (`Backend-App`):**
  - Configuración de `DATABASE_URL` con PostgreSQL y script de build con `prisma migrate deploy && prisma generate`.
  - Configuración de CORS para autorizar el dominio de producción del frontend.
