# Tareas: Pipeline de Integración Continua (CI) con GitHub Actions (Tarea 2)

Lista de tareas para configurar y validar el pipeline de CI:

## Configuración y Desarrollo (Frontend)
- [x] **Crear `eslint.config.mjs`:**
  - Configurar Flat Config importando nativamente `eslint-config-next`.
  - Soporte completo para ESLint v10 y Next.js 16.
- [x] **Configurar Workflow de GitHub Actions (`.github/workflows/ci.yml`):**
  - Ajustar disparadores para ramas `Develop` y `main`.
  - Configurar pasos de Setup (Node 20, pnpm 9 con caché de store).
  - Configurar steps: `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm exec tsc --noEmit` y `pnpm run build`.
  - Definir variables de entorno simuladas para el build (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_API_URL`).

## Documentación y Guía (Backend)
- [x] **Documentar Workflow de CI para Backend (`Backend-App`):**
  - Implementado y verificado en el repositorio de backend con ramas `develop` y `main`, `prisma generate` y `npm run build`.

## Pruebas y Verificación
- [x] **Validación Local del Linter:**
  - Ejecutado `npx eslint .` exitosamente con 0 errores y 0 warnings.
- [x] **Validación Local de Tipos TypeScript:**
  - Ejecutado `npx tsc --noEmit` exitosamente con 0 errores de tipos.
- [x] **Validación Local del Build:**
  - Ejecutado `next build` exitosamente generando todas las páginas estáticas y dinámicas.
