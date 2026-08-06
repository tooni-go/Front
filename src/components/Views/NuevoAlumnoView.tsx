'use client';

import React, { useState, useEffect } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { UserPlus, Save, X } from 'lucide-react';

export const NuevoAlumnoView: React.FC = () => {
  const {
    activeCourseId,
    students,
    editingStudentId,
    addStudent,
    updateStudent,
    setScreen,
  } = useEvalia();

  const isEditing = Boolean(editingStudentId);
  const editingStudent = students.find((s) => s.id === editingStudentId);

  const [nombre, setNombre] = useState('');
  const [legajo, setLegajo] = useState('');

  useEffect(() => {
    if (isEditing && editingStudent) {
      setNombre(editingStudent.nombre);
      setLegajo(editingStudent.legajo);
    } else {
      setNombre('');
      setLegajo('');
    }
  }, [isEditing, editingStudent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !legajo.trim()) return;

    if (isEditing && editingStudentId) {
      updateStudent(editingStudentId, nombre.trim(), legajo.trim());
    } else if (activeCourseId) {
      addStudent(activeCourseId, nombre.trim(), legajo.trim());
    }

    setScreen('alumnos_lista');
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">
            {isEditing ? 'EDITAR ALUMNO' : 'NUEVO ALUMNO'}
          </h1>
          <p className="text-xs text-slate-400">Ingrese los datos personales del estudiante</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Nombre y Apellido del Alumno <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Número de Legajo <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            value={legajo}
            onChange={(e) => setLegajo(e.target.value)}
            placeholder="Ej: 1001"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setScreen('alumnos_lista')}
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
