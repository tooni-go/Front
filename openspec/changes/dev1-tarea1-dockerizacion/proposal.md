# Propuesta: Dockerización Fullstack y Resolución de Puertos (Tarea 1)

## Problema
Actualmente, el proyecto no cuenta con una configuración de contenerización (Docker) para simplificar el entorno de desarrollo y el despliegue a producción. Además, tanto el frontend (Next.js) como el backend (NestJS) intentan correr en el puerto `3000` por defecto, lo que genera conflictos y colisiones de puertos al levantar el stack de manera conjunta localmente.

## Solución Propuesta
1. **Resolución de Puertos:** Reconfigurar el frontend (Next.js) para que se ejecute en el puerto `3001` (tanto en desarrollo local como en producción/Docker), dejando el puerto `3000` reservado para el backend (NestJS).
2. **Habilitar Compilación Standalone en Next.js:** Crear el archivo `next.config.mjs` en el Frontend habilitando `output: 'standalone'`. Esto instruye a Next.js a empaquetar únicamente los archivos necesarios para la ejecución del servidor de producción, reduciendo drásticamente el tamaño de la imagen Docker de ~1GB a ~120MB.
3. **Contenerización Multi-Stage (Frontend):** Crear un `Dockerfile` en el Frontend con tres etapas: instalación de dependencias, compilación del código standalone, y ejecución liviana sobre Node Alpine.
4. **Contenerización Multi-Stage (Backend):** Diseñar un `Dockerfile` compatible con NestJS, Prisma y SQLite que realice la compilación, aplique las migraciones en el arranque y sirva la app. El usuario copiará este archivo en su repositorio de backend.
5. **Orquestación con Docker Compose:** Crear el archivo `docker-compose.yml` en la raíz de `Front` para levantar ambos contenedores con persistencia de base de datos SQLite (`dev.db`) y subidas de archivos (`uploads`).

## Alcance e Impacto
- **Frontend (`Front`):**
  - Creación de `next.config.mjs`.
  - Creación de `Dockerfile` y `.dockerignore` en la raíz.
  - Creación de `docker-compose.yml` en la raíz (vinculando el backend de manera relativa).
- **Backend (`Backend-App`):**
  - Creación de `Dockerfile` en la raíz del repositorio de backend (acción a realizar por el desarrollador en su otro repositorio).
