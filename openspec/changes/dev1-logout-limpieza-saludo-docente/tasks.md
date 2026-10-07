# Plan de Implementación: Tareas 2 y 4 (Frontend)

## 📋 Tareas de Desarrollo

### 1. Limpieza Selectiva y Logout Seguro (Tarea 2)
- [x] 1.1 Crear función utilitaria de purga `clearEvaliaStorage()` para eliminar de `localStorage` todas las claves con prefijo `evalia_` y `autosave_`, y ejecutar `sessionStorage.clear()`.
- [x] 1.2 Agregar método `resetState()` en [EvaliaContext.tsx](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/context/EvaliaContext.tsx) para reiniciar las colecciones de cursos, alumnos, exámenes, entregas y estados activos a sus valores iniciales vacíos.
- [x] 1.3 Actualizar el método `logout()` en [AuthContext.tsx](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/context/AuthContext.tsx) para encadenar la purga de almacenamiento, reset de estado y ejecución de `signOut({ callbackUrl: '/' })`.
- [x] 1.4 Verificar que los botones de cerrar sesión en [Navbar.tsx](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Layout/Navbar.tsx), [SidebarNav.tsx](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Layout/SidebarNav.tsx) y [MiPerfilView.tsx](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/MiPerfilView.tsx) invoquen correctamente el flujo unificado.

### 2. Sincronización del Perfil Docente y Saludo Dinámico (Tarea 4)
- [x] 2.1 Ampliar el tipo `User` en [types/evalia.ts](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/types/evalia.ts) para soportar `nombre`, `apellido` y `departamento`.
- [x] 2.2 En [AuthContext.tsx](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/context/AuthContext.tsx), enriquecer la función de carga de perfil desde `GET /api/v1/profesor/me` e implementar la función `refreshProfile()`.
- [x] 2.3 Actualizar [DashboardView.tsx](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/DashboardView.tsx) para renderizar el saludo dinámico `¡Hola de nuevo, {nombre}!` con fallback amigable a `¡Hola de nuevo, Profesor!`.
- [x] 2.4 Actualizar [MiPerfilView.tsx](file:///c:/Users/valen/OneDrive/Desktop/FrontPasantia/Front/src/components/Views/MiPerfilView.tsx) para utilizar `refreshProfile()` tras guardar cambios con `PUT /api/v1/profesor/me`, eliminando la recarga forzada (`window.location.reload()`).

### 3. Verificación y Pruebas
- [x] 3.1 Probar flujo de Logout y comprobar en DevTools (Application Tab) que no queden claves residuales en `localStorage` ni `sessionStorage`.
- [x] 3.2 Iniciar sesión con cuenta Google / credenciales y validar que el saludo del Dashboard refleje inmediatamente el nombre actualizado del profesor.
- [x] 3.3 Editar nombre/apellido en Mi Perfil y verificar que se refleje de inmediato en el Dashboard y Navbar sin recargar la página.
