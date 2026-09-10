# Propuesta: Pipeline de Integración Continua (CI) con GitHub Actions (Tarea 2)

## Problema
Actualmente, el repositorio no cuenta con una validación automatizada en GitHub Actions para asegurar que cada Pull Request y Push mantenga los estándares de calidad del código, la integridad de tipos de TypeScript y la compilación exitosa antes de fusionarse a las ramas protegidas (`Develop` y `main` en Frontend; `develop` y `main` en Backend).

Además, al contar con `eslint: ^10.8.0` y Next.js 16 sin un archivo `eslint.config.mjs` (Flat Config), la ejecución del linter (`pnpm run lint`) falla, impidiendo que el pipeline de CI pueda auditar el código estático.

## Solución Propuesta
1. **Configuración de Linter con Flat Config (`eslint.config.mjs`):**
   - Configurar el nuevo estándar de ESLint Flat Config (`eslint.config.mjs`) integrando las reglas oficiales de `eslint-config-next` para Next.js 16 y TypeScript.
   - Ajustar el script `lint` en `package.json` si es necesario para asegurar compatibilidad total.
2. **Workflow de GitHub Actions para Frontend (`.github/workflows/ci.yml`):**
   - Configurar disparadores para eventos `push` y `pull_request` dirigidos a las ramas `Develop` y `main`.
   - Implementar un job `frontend-ci` en Ubuntu Latest con Node.js 20 y `pnpm 9` (con caché automática de dependencias).
   - Ejecutar en orden:
     1. Instalación determinística de dependencias (`pnpm install --frozen-lockfile`).
     2. Verificación de Linter (`pnpm run lint`).
     3. Chequeo estricto de tipos (`pnpm exec tsc --noEmit`).
     4. Compilación de producción de Next.js (`pnpm run build`).
3. **Template y Especificación de CI para Backend (NestJS):**
   - Diseñar y proveer el workflow correspondiente para el repositorio `Backend-App` con disparadores para las ramas `develop` y `main`, contemplando la generación de cliente Prisma (`npx prisma generate`), linter, typecheck y build (`npm run build`).

## Alcance e Impacto
- **Frontend (`Front`):**
  - Creación de `eslint.config.mjs`.
  - Actualización y optimización de `.github/workflows/ci.yml`.
  - Validación local de todos los pasos del pipeline (`pnpm run lint`, `tsc`, `pnpm run build`).
- **Backend (`Backend-App`):**
  - Documentación del archivo `.github/workflows/ci.yml` adaptado para NestJS + Prisma en la propuesta y diseño.
