import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, LogOut, User, Shield, ChevronDown, Check, X, Sparkles, Settings } from 'lucide-react';
import { NotificationItem } from '../../types/auth';

interface HeaderProps {
  onOpenProfile: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Inicio de sesión exitoso',
      message: 'Se ha detectado tu acceso desde este navegador.',
      time: 'Hace 2 min',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Actualización del sistema',
      message: 'El módulo principal ha sido actualizado a v1.0.',
      time: 'Hace 1 hora',
      read: false,
      type: 'success'
    },
    {
      id: '3',
      title: 'Alerta de seguridad',
      message: 'Recuerda mantener actualizadas tus credenciales.',
      time: 'Ayer',
      read: true,
      type: 'warning'
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Left Branding / Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            PW
          </div>
          <span className="font-bold text-lg text-white tracking-tight hidden sm:inline">
            Plataforma<span className="text-indigo-400">Web</span>
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar proyectos, módulos o registros..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3.5 border-b border-slate-700 flex items-center justify-between bg-slate-800/90">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Marcar leídas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/60">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 text-xs transition-colors hover:bg-slate-700/40 ${
                      !item.read ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-semibold text-slate-200">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-slate-300">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/60"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">
                {user?.name || 'Usuario'}
              </div>
              <div className="text-[10px] text-indigo-400 font-medium">
                {user?.role || 'Usuario'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2.5 border-b border-slate-700">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenProfile();
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Mi Perfil & Ajustes</span>
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setActiveTab('config');
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Configuración de Cuenta</span>
              </button>

              <div className="border-t border-slate-700 mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
