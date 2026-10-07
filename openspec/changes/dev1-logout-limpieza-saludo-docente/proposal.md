# Propuesta de Cambio: Limpieza de Estado al Logout y Sincronización del Saludo Docente (Tareas 2 y 4)

## 📌 Contexto y Motivación
Durante la demo del 27/09/2026 se identificaron dos problemas relacionados con la experiencia de usuario y la seguridad de sesión del docente:
1. **Fuga visual de datos residuales tras Logout (Tarea 2):** Al cerrar sesión, la sesión de NextAuth se finalizaba pero los datos almacenados en `localStorage` (`evalia_students`, `evalia_exams`, `evalia_deliveries`, borradores de exámenes) y el estado global en memoria (`EvaliaContext`) no se purgaban. Si otro usuario iniciaba sesión en el mismo navegador, existía riesgo de persistencia de datos visuales residuales.
2. **Saludo genérico desconectado del backend (Tarea 4):** El Dashboard mostraba el saludo estático *"Bienvenido nuevamente, Profesor"* en lugar de personalizarse con el nombre real del profesor autenticado, cuya sincronización ya fue provista en el backend mediante el endpoint `GET /api/v1/profesor/me` y upsert automático.

Este cambio implementa en el Frontend las **Tareas 2 y 4** asignadas al Desarrollador 1 según el [PLAN_SPRINT_4.md](../../PLAN_SPRINT_4.md).

---

## 🎯 Objetivos
- **Limpieza selectiva y exhaustiva en Logout:** Purgar de forma determinística todas las claves de `localStorage` pertenecientes a la aplicación (`evalia_*`, `autosave_*`), limpiar `sessionStorage`, resetear el estado de `EvaliaContext` y `AuthContext`, y redirigir al inicio de sesión de forma segura.
- **Sincronización del Perfil Docente en AuthContext:** Integrar la respuesta del backend (`/api/v1/profesor/me`) para almacenar y proveer `nombre`, `apellido`, `departamento` y exponer una función reactiva `refreshProfile()` para actualizar el perfil sin recargar la página.
- **Saludo Dinámico en el Dashboard:** Renderizar el saludo personalizado `¡Hola de nuevo, {nombre}!` utilizando el nombre real del docente (con fallback elegante si aún no está disponible).
- **Actualización fluida en MiPerfilView:** Conectar la edición de perfil a `refreshProfile()`, eliminando el parpadeo de `window.location.reload()`.

---

## 👥 Impacto en la Interfaz y Componentes
- **Dashboard (`DashboardView.tsx`):** Saludo dinámico actualizado a `¡Hola de nuevo, {nombre}!`.
- **Contextos Globales (`AuthContext.tsx`, `EvaliaContext.tsx`):** Funciones de limpieza `resetState()` y `logout()` mejoradas, soporte de `refreshProfile()`.
- **Barra de Navegación (`Navbar.tsx`):** Nombre y correo actualizados en el dropdown de usuario; cierre de sesión limpio y protegido.
- **Vista de Perfil (`MiPerfilView.tsx`):** Guardado reactivo sin refresco forzado del navegador.

---

## 🚫 No en Alcance
- Modificaciones a servicios de Backend (las Tareas 1 y 3 ya están finalizadas).
- Banner o avisos de perfil incompleto (descartado explícitamente por requerimiento del usuario).
