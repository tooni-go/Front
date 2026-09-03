# Tareas: Dockerización Fullstack y Resolución de Puertos (Tarea 1)

Lista de tareas a realizar para completar la dockerización y resolución de puertos del frontend:

## Configuración y Desarrollo (Frontend)
- [x] **Crear `next.config.mjs`:**
  - Configurar `output: 'standalone'` para habilitar la compilación autocontenida de Next.js.
- [x] **Crear el `Dockerfile` de Frontend:**
  - Configurar las etapas con soporte de binarios nativos para Tailwind/LightningCSS.
  - Asegurar la exposición del puerto `3001`.
- [x] **Crear el archivo `.dockerignore`:**
  - Ignorar directorios pesados (`node_modules`, `.next`, `dist`, `out`, logs, etc.) para acelerar el build.
- [x] **Crear el archivo `docker-compose.yml`:**
  - Configurar el servicio `frontend` mapeando el puerto `3001`.
  - Configurar el servicio `backend` usando el contexto relativo `../../BackPasantia/Backend-App` y mapeando el puerto `3000`.
  - Declarar volúmenes persistentes y redes de intercomunicación.

## Pruebas y Verificación
- [x] **Build del Entorno Local:**
  - Ejecutar `docker compose build` y verificar que compile sin fallos.
- [x] **Despliegue Local del Contenedor:**
  - Correr `docker compose up -d`.
  - Comprobar logs de ambos servicios (`docker compose logs -f`).
- [x] **Pruebas de Ruteo e Integración:**
  - Acceder a `http://localhost:3001` desde el navegador.
  - Confirmar que el frontend y el backend se comunican en `http://localhost:3000`.
- [x] **Persistencia de Base de Datos SQLite:**
  - Sincronización automática de Prisma (`dev.db`) con volúmenes montados persistentes.
