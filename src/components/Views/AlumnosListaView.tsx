'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search, Edit2, ArrowLeft, UserCheck, Loader2 } from 'lucide-react';
import { fetchApi } from '@/src/lib/api';

interface BackendAlumno {
  id: string;
  nombre: string;
  apellido?: string;
  legajo: string;
}

interface BackendCurso {
  id: string;
  materia: string;
  anio: number;
  division: string;
  alumnos: { alumno: BackendAlumno }[];
}

export const AlumnosListaView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cursoId = searchParams.get('cursoId') || '';

  const [course, setCourse] = useState<BackendCurso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!cursoId) {
      setError('ID de curso invÇ­lido.');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const data = await fetchApi<BackendCurso>('/api/v1/cursos/' + cursoId);
        setCourse(data);
      } catch (err: any) {
        setError('No se pudo cargar el curso.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [cursoId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-indigo-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-xs font-semibold">Cargando nmina de alumnos...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-10 text-rose-400">
        {error || 'Curso no encontrado.'}
      </div>
    );
  }

  const students = course.alumnos.map(a => a.alumno);
  const filteredStudents = students.filter(
    (s) => {
      const fullName = (s.nombre + ' ' + (s.apellido || '')).toLowerCase();
      return fullName.includes(search.toLowerCase()) || s.legajo.toLowerCase().includes(search.toLowerCase());
    }
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => router.push('/cursos/' + course.id)}
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
            Nmina oficial de estudiantes inscriptos ({students.length} en total)
          </p>
        </div>

        <button
          onClick={() => router.push('/alumnos/nuevo?cursoId=' + course.id)}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo alumno</span>
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
                    <h3 className="text-sm font-bold text-white">{student.nombre} {student.apellido || ''}</h3>
                    <p className="text-[11px] text-slate-400">Legajo N: {student.legajo}</p>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/alumnos/' + student.id + '/editar?cursoId=' + course.id)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Editar</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};