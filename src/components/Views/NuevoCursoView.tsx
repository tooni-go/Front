'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, BookPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/src/lib/api';

export const NuevoCursoView: React.FC = () => {
  const router = useRouter();

  const [materia, setMateria] = useState('');
  const [anio, setAnio] = useState('2°');
  const [division, setDivision] = useState('A');
  const [anioLectivo, setAnioLectivo] = useState('2026');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materia.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await fetchApi('/api/v1/cursos', {
        method: 'POST',
        body: JSON.stringify({ 
          materia: materia.trim(), 
          nombre: `${materia.trim()} ${anio} ${division}`,
          anio,
          division,
          anioLectivo: parseInt(anioLectivo)
        })
      });

      setMessage({ type: 'success', text: 'Curso creado exitosamente.' });
      router.refresh(); // Invalida el caché para que la lista de cursos se actualice
      
      setTimeout(() => {
        router.push('/cursos');
      }, 1500);
    } catch (error: any) {
      console.error('Error al crear el curso:', error);
      setMessage({ type: 'error', text: error.message || 'Error al crear el curso.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <BookPlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">NUEVO CURSO</h1>
          <p className="text-xs text-slate-400">Ingrese las especificaciones de la nueva división</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2 ${
          message.type === 'success' 
            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50' 
            : 'bg-red-950/50 text-red-400 border border-red-800/50'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Materia / Asignatura <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            placeholder="Ej: Matemática, Historia, Biología..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            required
            disabled={isLoading || message?.type === 'success'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Año</label>
            <select
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              disabled={isLoading || message?.type === 'success'}
            >
              <option value="1°">1° Año</option>
              <option value="2°">2° Año</option>
              <option value="3°">3° Año</option>
              <option value="4°">4° Año</option>
              <option value="5°">5° Año</option>
              <option value="6°">6° Año</option>
              <option value="7°">7° Año</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">División</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              disabled={isLoading || message?.type === 'success'}
            >
              <option value="A">División A</option>
              <option value="B">División B</option>
              <option value="C">División C</option>
              <option value="D">División D</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Año Lectivo</label>
            <select
              value={anioLectivo}
              onChange={(e) => setAnioLectivo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              disabled={isLoading || message?.type === 'success'}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => router.push('/cursos')}
            className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || message?.type === 'success'}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-indigo-300 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
