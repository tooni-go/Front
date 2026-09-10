# Diseño: Pipeline de Integración Continua (CI) con GitHub Actions (Tarea 2)

## 1. Arquitectura del Pipeline de CI (Frontend)

El flujo de integración continua del frontend se ejecuta en cada Push y Pull Request hacia `Develop` y `main`:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 GitHub Actions Runner (ubuntu-latest)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. actions/checkout@v4                                                      │
│    Clona el código fuente del frontend.                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. pnpm/action-setup@v4                                                     │
│    Instala pnpm v9 de forma optimizada.                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. actions/setup-node@v4                                                    │
│    Configura Node.js 20 con caché nativo para pnpm (`cache: 'pnpm'`).      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. pnpm install --frozen-lockfile                                           │
│    Descarga e instala paquetes garantizando reproducibilidad idéntica.      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. pnpm run lint                                                            │
│    Ejecuta ESLint con el nuevo flat config (eslint.config.mjs).             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. pnpm exec tsc --noEmit                                                   │
│    Comprueba tipos e interfaces de TypeScript sin generar archivos JS.      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 7. pnpm run build                                                           │
│    Compila la aplicación Next.js validando rutas, layouts y empaquetado.   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Configuración de ESLint (`eslint.config.mjs`)

Para compatibilidad completa con ESLint v9/v10 y Next.js 16:

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;
```

## 3. Configuración del Workflow Frontend (`.github/workflows/ci.yml`)

```yaml
name: Frontend CI

on:
  push:
    branches: [ Develop, main ]
  pull_request:
    branches: [ Develop, main ]

jobs:
  lint-typecheck-build:
    name: Lint, Typecheck & Build
    runs-on: ubuntu-latest
    env:
      NEXTAUTH_SECRET: "ci_dummy_nextauth_secret_for_build"
      NEXTAUTH_URL: "http://localhost:3001"
      NEXT_PUBLIC_API_URL: "http://localhost:3000"

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm run lint

      - name: Check TypeScript types
        run: pnpm exec tsc --noEmit

      - name: Build Next.js application
        run: pnpm run build
```

## 4. Workflow de CI para Backend NestJS (Guía para `Backend-App`)

Para replicar en el repositorio de Backend (`.github/workflows/ci.yml`):

```yaml
name: Backend CI

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  lint-and-build:
    name: Lint, Test & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run Linter
        run: npm run lint

      - name: Build NestJS application
        run: npm run build
```
