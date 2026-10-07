/**
 * Utilidades de almacenamiento local (localStorage / sessionStorage) para EvalIA.
 */

/**
 * Elimina de forma selectiva y exhaustiva todos los datos persistidos en localStorage
 * que pertenezcan al dominio de EvalIA (claves que inicien con 'evalia_' o 'autosave_'),
 * y vacía por completo el sessionStorage.
 */
export function clearEvaliaStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('evalia_') || key.startsWith('autosave_'))) {
        keysToRemove.push(key);
      }
    }

    // Eliminamos cada una de las claves detectadas
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Limpiamos datos de sesión temporales
    sessionStorage.clear();
  } catch (error) {
    console.warn('Error al purgar almacenamiento local de EvalIA:', error);
  }
}
