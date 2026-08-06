'use client';

import React, { useState } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { Save, X, BookPlus } from 'lucide-react';

export const NuevoCursoView: React.FC = () => {
  const { addCourse, setScreen, setActiveCourseId } = useEvalia();

  const [materia, setMateria] = useState('');
  const [anio, setAnio] = useState('2°');
  const [division, setDivision] = useState('A');
  const [anioLectivo, setAnioLectivo] = useState('2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materia.trim()) return;

    const created = addCourse(materia.trim(), anio, division, anioLectivo);
    setActiveCourseId(created.id);
    setScreen('curso_detalle');
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
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Año</label>
            <select
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
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
            onClick={() => setScreen('cursos_lista')}
            className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>[ Cancelar ]</span>
          </button>

          <button
            type="submit"
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>[ Guardar ]</span>
          </button>
        </div>
      </form>
    </div>
  );
};
