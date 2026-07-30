import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvalia } from '../../context/EvaliaContext';
import { User, Mail, LogOut, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export const MiPerfilView: React.FC = () => {
  const { user, logout } = useAuth();
  const { setScreen } = useEvalia();

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('dashboard')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al Dashboard</span>
      </button>

      {/* User Profile Card (Wireframe 18) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center">
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-indigo-400" />
              )}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-slate-950 border-2 border-slate-900" title="Cuenta Activa">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-black text-white">{user?.name || 'Juan Pérez'}</h1>
          <p className="text-xs text-indigo-300 font-semibold">Profesor Titular &bull; EvalIA</p>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 text-left">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold">Correo Electrónico</p>
              <p className="font-semibold text-white">{user?.email || 'juan@gmail.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold">Plan de Corrección IA</p>
              <p className="font-semibold text-indigo-300">Google Gemini 3.6 Flash Activado</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs rounded-xl border border-rose-800/50 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>[ Cerrar sesión ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
