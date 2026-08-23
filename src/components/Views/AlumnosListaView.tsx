'use client';

import React, { useState } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { Plus, Search, Edit2, ArrowLeft, UserCheck } from 'lucide-react';

export const AlumnosListaView: React.FC = () => {
  const {
    getActiveCourse,
    getCourseStudents,
    setScreen,
    setEditingStudentId,
  } = useEvalia();

  const [search, setSearch] = useState('');

  const course = getActiveCourse();
  if (!course) {
    return (
      <div className="text-center py-10 text-slate-400">
        Curso no encontrado.
      </div>
    );
  }

  const students = getCourseStudents(course.id);
  const filteredStudents = students.filter(
    (s) =>
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.legajo.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (studentId: string) => {
    setEditingStudentId(studentId);
    setScreen('alumno_editar');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('curso_detalle')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a {course.materia} {course.anio}{course.division}</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">
            Alumnos - {course.materia} {course.anio}{course.division}
          </h1>
          <p className="text-xs text-slate-400">
            Nómina oficial de estudiantes inscriptos ({students.length} en total)
          </p>
        </div>

        <button
          onClick={() => setScreen('alumno_nuevo')}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>[ Nuevo alumno ]</span>
        </button>
      </div>

      {/* Search Input (Wireframe 7) */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar alumno por nombre o legajo..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Students List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs italic">
            No se encontraron alumnos coincidentes.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-800/40 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{student.nombre}</h3>
                    <p className="text-[11px] text-slate-400">Legajo N°: {student.legajo}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(student.id)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>[ Editar ]</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
