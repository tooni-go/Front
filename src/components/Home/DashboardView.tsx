import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  FileText, 
  Sparkles, 
  Server, 
  ShieldCheck, 
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { RecentActivity } from '../../types/auth';

interface DashboardViewProps {
  onOpenProfile: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenProfile, setActiveTab }) => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  const formattedDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [activities, setActivities] = useState<RecentActivity[]>([
    {
      id: 'act-1',
      user: 'Carlos Mendoza',
      action: 'Creó nuevo módulo de auditoría',
      target: 'Módulo Seguridad',
      timestamp: 'Hace 10 min',
      status: 'Completado'
    },
    {
      id: 'act-2',
      user: 'Elena Rostova',
      action: 'Sincronización de base de datos',
      target: 'Servidor Principal',
      timestamp: 'Hace 35 min',
      status: 'Completado'
    },
    {
      id: 'act-3',
      user: 'Mateo Silva',
      action: 'Generación de reporte trimestral',
      target: 'Métricas & Finanzas',
      timestamp: 'Hace 2 horas',
      status: 'En Proceso'
    },
    {
      id: 'act-4',
      user: 'Sistema Automático',
      action: 'Respaldo de información',
      target: 'Cloud Storage',
      timestamp: 'Hace 4 horas',
      status: 'Completado'
    },
    {
      id: 'act-5',
      user: 'Carlos Mendoza',
      action: 'Revisión de permisos de usuario',
      target: 'Usuarios & Roles',
      timestamp: 'Ayer a las 18:30',
      status: 'Pendiente'
    }
  ]);

  const filteredActivities = filterStatus === 'Todos'
    ? activities
    : activities.filter(a => a.status === filterStatus);

  const stats = [
    {
      title: 'Proyectos Activos',
      value: '12',
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Usuarios en Línea',
      value: '48',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Eficiencia del Sistema',
      value: '99.4%',
      change: 'Óptimo',
      trend: 'up',
      icon: Activity,
      color: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Estado del Servidor',
      value: 'En Línea',
      change: '100% Up',
      trend: 'up',
      icon: Server,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-xl"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="capitalize">{formattedDate}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              ¡Hola de nuevo, {user?.name || 'Usuario'}! 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Bienvenido a tu panel principal. Aquí tienes el resumen general de la plataforma y el estado del sistema en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('modulos')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ver Módulos</span>
            </button>
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition-all"
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-5 hover:border-slate-600 transition-all duration-200 shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-white">{stat.value}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {stat.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Sections: Activity & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Table / Feed */}
        <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-lg flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700/60">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Actividad Reciente del Sistema</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Eventos y registros más recientes en la plataforma
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-700/60">
              {['Todos', 'Completado', 'En Proceso', 'Pendiente'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                    filterStatus === status
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No hay actividades encontradas para el filtro seleccionado.
              </div>
            ) : (
              filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-700/50 rounded-xl flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-semibold text-xs shrink-0">
                      {act.user.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{act.action}</div>
                      <div className="text-[11px] text-slate-400">
                        Por <span className="text-indigo-300">{act.user}</span> &bull; {act.target}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                        act.status === 'Completado'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : act.status === 'En Proceso'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {act.status}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">{act.timestamp}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & System Info */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Accesos Rápidos</span>
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('modulos')}
                className="w-full p-3 bg-slate-900/50 hover:bg-indigo-950/30 border border-slate-700 hover:border-indigo-500/50 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                    Explorar Módulos
                  </div>
                  <div className="text-[11px] text-slate-400">Acceso a las funcionalidades principales</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button
                onClick={() => setActiveTab('metricas')}
                className="w-full p-3 bg-slate-900/50 hover:bg-indigo-950/30 border border-slate-700 hover:border-indigo-500/50 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                    Ver Reportes & Métricas
                  </div>
                  <div className="text-[11px] text-slate-400">Análisis detallado de rendimiento</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className="w-full p-3 bg-slate-900/50 hover:bg-indigo-950/30 border border-slate-700 hover:border-indigo-500/50 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                    Configuración de Usuario
                  </div>
                  <div className="text-[11px] text-slate-400">Ajustes de cuenta y preferencias</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* User Status Card */}
          <div className="bg-gradient-to-br from-indigo-900/50 via-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Nivel de Acceso</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Estás conectado como <span className="font-bold text-indigo-300">{user?.role}</span>. Tienes permisos para gestionar tareas, visualizar reportes y modificar la configuración personal.
            </p>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Última conexión:</span>
              <span className="font-semibold text-slate-200">{user?.lastLogin || 'Hoy'}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
