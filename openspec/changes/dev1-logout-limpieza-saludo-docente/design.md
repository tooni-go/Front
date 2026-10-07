# Diseño Técnico: Limpieza de Estado al Logout y Sincronización del Saludo Docente

## 📐 Arquitectura y Flujo de Datos

### 1. Modelo de Datos del Usuario en `AuthContext`

Se extiende la interfaz de `User` en `src/types/evalia.ts` (o dentro de `AuthContext.tsx`) para soportar los atributos detallados del profesor sincronizados con el backend:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  nombre?: string;
  apellido?: string;
  departamento?: string;
}

export interface BackendProfesorProfile {
  id: string;
  email: string;
  nombre?: string;
  apellido?: string;
  departamento?: string;
}
```

---

### 2. Flujo de Sincronización del Perfil (`AuthContext.tsx`)

```
               ┌───────────────────────────────┐
               │    NextAuth useSession()      │
               └──────────────┬────────────────┘
                              │ status === 'authenticated'
                              ▼
               ┌───────────────────────────────┐
               │   GET /api/v1/profesor/me     │
               └──────────────┬────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
    [ Éxito: Datos BD ]                 [ Error / Fallback ]
    nombre, apellido, depto             Usar datos de Google
    name: `${nombre} ${apellido}`       name: session.user.name
            │                                   │
            └─────────────────┬─────────────────┘
                              ▼
               ┌───────────────────────────────┐
               │   setUser({ ...profesor })    │
               │   + Exponer refreshProfile()  │
               └───────────────────────────────┘
```

#### Funcionalidades clave en `AuthContext`:
- **`loadProfile()` / `refreshProfile()`**:
  Función reutilizable que invoca `fetchApi<BackendProfesorProfile>('/api/v1/profesor/me')`. Actualiza el estado reactivo `user` y puede llamarse tanto al iniciar sesión como tras modificar el perfil en `MiPerfilView`.

---

### 3. Flujo de Limpieza Selectiva en Logout

Para evitar inconsistencias o llamadas cruzadas, centralizamos la limpieza selectiva en una utilidad de almacenamiento y la conectamos al cierre de sesión:

```typescript
// Limpieza selectiva de claves de EvalIA en localStorage
export function clearEvaliaStorage(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('evalia_') || key.startsWith('autosave_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch (error) {
    console.warn('Error al limpiar el almacenamiento local:', error);
  }
}
```

```
[ Usuario clickea "Cerrar sesión" ]
                │
                ▼
      clearEvaliaStorage()  ───► Purgar claves evalia_* y autosave_* de localStorage
                │           ───► sessionStorage.clear()
                ▼
      EvaliaContext.resetState() ─► Limpiar colecciones de React en memoria
                │
                ▼
      AuthContext.setUser(null)
                │
                ▼
      nextAuthSignOut({ callbackUrl: '/' })
```

---

### 4. Actualización Visual en el Dashboard (`DashboardView.tsx`)

- **Saludo Dinámico:**
  Se extrae el nombre a mostrar:
  ```typescript
  const displayName = user?.nombre || user?.name?.split(' ')[0] || user?.name;
  const greetingText = displayName 
    ? `¡Hola de nuevo, ${displayName}!` 
    : '¡Hola de nuevo, Profesor!';
  ```
- **Integración Visual:** Se mantiene el banner con gradiente `from-indigo-900/40 via-slate-900 to-slate-900`, la tipografía destacada y los chips de estado, reemplazando únicamente el texto fijo por la bienvenida personalizada y cálida.

---

### 5. Optimización en `MiPerfilView.tsx`

Al ejecutar `handleSave`:
1. Realizar `PUT /api/v1/profesor/me` con `{ nombre, apellido }`.
2. Al recibir respuesta `200 OK`, invocar `await refreshProfile()`.
3. Mostrar notificación de éxito ("Perfil actualizado con éxito") y cerrar el modo edición (`setIsEditing(false)`), eliminando por completo la necesidad de invocar `window.location.reload()`.
