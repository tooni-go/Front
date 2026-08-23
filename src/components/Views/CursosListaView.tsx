'use client';

import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, Users, FileText, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Course {
  id: string;
  nombre: string;
  materia: string;
  anio: number;
  division: string;
  anioLectivo: number;
  alumnos?: any[];
  alumnosCount?: number;
  examenes?: any[];
}

export const CursosListaView: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/cursos', {
          headers: {
            'Authorization': 'Bearer test-token' // Token provisorio MVP
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleOpenCourse = (courseId: string) => {
    router.push(`/cursos/${courseId}`);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Cargando cursos...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Cursos</h1>
          <p className="text-xs text-slate-400 mt-1">
            Listado completo de cursos y divisiones asignadas
          </p>
        </div>

        <button
          onClick={() => router.push('/cursos/nuevo')}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span> Nuevo curso</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
          <BookOpen className="w-16 h-16 text-indigo-500/50 mb-2" />
          <h2 className="text-xl font-bold text-white">No tienes cursos creados</h2>
          <p className="text-sm text-slate-400 max-w-sm">
            Comienza creando tu primer curso para poder añadir alumnos y empezar a corregir exámenes con Inteligencia Artificial.
          </p>
          <button
            onClick={() => router.push('/cursos/nuevo')}
            className="mt-6 py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear mi primer curso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Año Lectivo: {course.anioLectivo || new Date().getFullYear()}
                  </span>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/40 px-2.5 py-0.5 rounded-md">
                    {course.anio || '1'} {course.division || 'A'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {course.nombre || `${course.materia} ${course.anio || ''} ${course.division || ''}`}
                  </h3>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>{course.alumnosCount ?? course.alumnos?.length ?? 0} alumnos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>{course.examenes?.length || 0} exámenes</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleOpenCourse(course.id)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  <span> Abrir </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
