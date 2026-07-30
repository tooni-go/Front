import React from 'react';
import { useEvalia, Screen } from '../../context/EvaliaContext';
import { useAuth } from '../../context/AuthContext';
import { Home, BookOpen, User, LogOut, ChevronRight } from 'lucide-react';

export const SidebarNav: React.FC = () => {
  const { screen, setScreen } = useEvalia();
  const { logout } = useAuth();

  const navItems: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'cursos_lista', label: 'Cursos', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'perfil', label: 'Mi Perfil', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
          Navegación Principal
        </p>

        {navItems.map((item) => {
          const isActive =
            screen === item.id ||
            (item.id === 'cursos_lista' &&
              ['curso_nuevo', 'curso_detalle', 'alumnos_lista', 'alumno_nuevo', 'alumno_editar', 'examen_metodo', 'examen_manual', 'examen_inteligente', 'examen_revision_generado', 'examen_detalle', 'examen_preguntas', 'entrega_nueva', 'entrega_procesando', 'entrega_correccion_ia', 'entrega_revision_manual'].includes(screen));

          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="pt-4 border-t border-slate-800 mt-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>

        <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
          <p className="text-[10px] italic text-slate-400">
            "La IA asiste. El profesor siempre decide."
          </p>
        </div>
      </div>
    </aside>
  );
};
