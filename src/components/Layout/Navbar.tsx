import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvalia } from '../../context/EvaliaContext';
import { User, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { setScreen } = useEvalia();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setScreen('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-black text-white text-lg shadow-md group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <span className="font-black text-lg tracking-wider text-white group-hover:text-indigo-400 transition-colors">
              EVALIA
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 px-2 py-0.5 rounded-full ml-2">
              IA Asistida
            </span>
          </div>
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 py-1.5 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-sm font-medium text-slate-200 transition-all focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <span className="hidden sm:inline-block font-medium text-slate-100">
              {user?.name || 'Prof. Juan Pérez'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setScreen('perfil');
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mi perfil</span>
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2 border-t border-slate-800/60"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
