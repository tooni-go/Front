import React from 'react';
import { BarChart2, TrendingUp, Zap, Clock, ShieldCheck, Download } from 'lucide-react';

export const MetricasView: React.FC = () => {
  return (
    <div className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <BarChart2 className="w-7 h-7 text-indigo-400" />
            <span>Métricas & Reportes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualización del rendimiento y estadísticas generales.
          </p>
        </div>

        <button
          onClick={() => alert('Generando reporte PDF del sistema...')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Informe</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase">Tiempo de Respuesta</span>
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white mb-2">12 ms</div>
          <p className="text-xs text-emerald-400 font-medium">99.9% de solicitudes procesadas sin demora</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase">Consumo de Memoria</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mb-2">28%</div>
          <p className="text-xs text-slate-300 font-medium">Uso estable en contenedores Cloud Run</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase">Índice de Seguridad</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mb-2">100 / 100</div>
          <p className="text-xs text-emerald-400 font-medium">Sin vulnerabilidades o alertas críticas</p>
        </div>
      </div>

      {/* Visual Chart Placeholder */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md">
        <h3 className="text-sm font-bold text-white mb-4">Actividad Semanal</h3>
        <div className="h-48 flex items-end justify-between gap-2 pt-6 px-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
          {[
            { day: 'Lun', val: 65 },
            { day: 'Mar', val: 80 },
            { day: 'Mié', val: 45 },
            { day: 'Jue', val: 95 },
            { day: 'Vie', val: 75 },
            { day: 'Sáb', val: 30 },
            { day: 'Dom', val: 20 },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                style={{ height: `${bar.val}%` }}
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-500 hover:brightness-125"
              />
              <span className="text-[10px] font-semibold text-slate-400">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
