import React from 'react';
import { LayoutGrid, Database, Lock, Users, FileSpreadsheet, Server, Sparkles, CheckCircle } from 'lucide-react';

export const ModulosView: React.FC = () => {
  const modules = [
    {
      id: 'mod-1',
      title: 'Gestión de Usuarios y Roles',
      desc: 'Administra cuentas, permisos de acceso y roles (Administrador, Analista, Usuario).',
      icon: Users,
      badge: 'Activo',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'mod-2',
      title: 'Base de Datos y Almacenamiento',
      desc: 'Conexión segura con el backend Express y sincronización de registros.',
      icon: Database,
      badge: 'Activo',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'mod-3',
      title: 'Seguridad & Autenticación',
      desc: 'Módulo de autenticación con cifrado y validación de tokens.',
      icon: Lock,
      badge: 'Activo',
      color: 'from-violet-500 to-purple-600',
    },
    {
      id: 'mod-4',
      title: 'Generador de Reportes',
      desc: 'Exportación de métricas en formato estructurado e informes ejecutivos.',
      icon: FileSpreadsheet,
      badge: 'Listo',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'mod-5',
      title: 'Monitor de Servidor',
      desc: 'Seguimiento de latencia, disponibilidad de API y estado de servidores.',
      icon: Server,
      badge: 'Activo',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'mod-6',
      title: 'Asistente IA',
      desc: 'Procesamiento de datos inteligente usando modelos Gemini.',
      icon: Sparkles,
      badge: 'Integrado',
      color: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <LayoutGrid className="w-7 h-7 text-indigo-400" />
          <span>Módulos del Sistema</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Catálogo de funcionalidades y componentes disponibles en la plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 hover:border-slate-600 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${mod.color} text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-indigo-400" />
                    <span>{mod.badge}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{mod.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{mod.desc}</p>
              </div>

              <button
                onClick={() => alert(`Accediendo al módulo: ${mod.title}`)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white rounded-xl transition-colors text-center"
              >
                Abrir Módulo
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
