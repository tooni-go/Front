'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvalia } from '../../context/EvaliaContext';
import { useRouter } from 'next/navigation';
import { User, Mail, LogOut, ArrowLeft, ShieldCheck, Sparkles, Edit2, Save, X, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/src/lib/api';

export const MiPerfilView: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(user?.name?.split(' ')[0] || '');
  const [apellido, setApellido] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetchApi('/api/v1/profesor/me', {
        method: 'PUT',
        body: JSON.stringify({ nombre: nombre.trim(), apellido: apellido.trim() })
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsEditing(false);
        // Ideally we'd refresh the AuthContext user here.
        // As a fallback, we can force reload the page to get the new token/data if needed.
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => router.push('/dashboard')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al Dashboard</span>
      </button>

      {/* User Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden">
        
        {success && (
          <div className="absolute inset-0 bg-emerald-950/90 z-10 flex flex-col items-center justify-center animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
            <p className="text-sm font-bold text-emerald-300">Perfil actualizado</p>
          </div>
        )}

        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || ''} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-indigo-400" />
              )}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-slate-950 border-2 border-slate-900" title="Cuenta Activa">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre</label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Apellido</label>
              <input 
                type="text" 
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none transition-colors" 
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={handleSave}
                disabled={isSaving || !nombre.trim()}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Guardar</span>
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 relative group">
            <h1 className="text-xl font-black text-white">{user?.name || 'Profesor'}</h1>
            <p className="text-xs text-indigo-300 font-semibold">Profesor Titular &bull; EvalIA</p>
            
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -top-1 -right-2 p-1.5 bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              title="Editar perfil"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 text-left">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold">Correo Electrnico</p>
              <p className="font-semibold text-white">{user?.email || 'profesor@evalia.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold">Plan de Correccin IA</p>
              <p className="font-semibold text-indigo-300">Google Gemini Flash Activado</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs rounded-xl border border-rose-800/50 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesin</span>
          </button>
        </div>
      </div>
    </div>
  );
};