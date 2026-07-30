import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Bell, Moon, Lock, Check } from 'lucide-react';

export const ConfigView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-indigo-400" />
          <span>Configuración del Sistema</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ajustes de tu cuenta, seguridad y preferencias.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Preferencias guardadas correctamente.</span>
        </div>
      )}

      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md space-y-6">
        <div>
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>Notificaciones & Alertas</span>
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/60 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-200">Notificaciones por Correo</div>
                <div className="text-[11px] text-slate-400">Recibir resúmenes de actividad en tu email</div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/60 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-200">Alertas de Seguridad</div>
                <div className="text-[11px] text-slate-400">Notificar inicios de sesión en nuevos dispositivos</div>
              </div>
              <input
                type="checkbox"
                checked={securityAlerts}
                onChange={(e) => setSecurityAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/60">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Seguridad de la Cuenta</span>
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">Cambiar Contraseña</div>
                <div className="text-[11px] text-slate-400">Actualiza tu contraseña de acceso</div>
              </div>
              <button
                type="button"
                onClick={() => alert('Para cambiar tu contraseña, sigue las instrucciones enviadas a tu correo.')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/60 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
