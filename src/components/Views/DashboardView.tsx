'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEvalia } from '../../context/EvaliaContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, BookOpen, Users, FileText, ArrowRight, Sparkles } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useEvalia();
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Panel Principal EvalIA
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white">
            Bienvenido nuevamente, {user?.name || 'Profesor'}
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Gestione sus asignaturas, organice listas de alumnos y corrija evaluaciones escritas asistidas por inteligencia artificial de forma rápida y segura.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => router.push('/cursos/nuevo')}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo curso</span>
            </button>

            <button
              onClick={() => router.push('/cursos')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Ver todos los cursos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cursos Recientes Section (Wireframe 3) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Cursos Recientes
          </h2>
          <Link
            href="/cursos"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Ver todos ({courses.length})
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => router.push(`/cursos/${course.id}`)}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800/40 rounded-md">
                    Año Lectivo {course.anioLectivo}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {course.anio} {course.division}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {course.materia} - {course.anio}{course.division}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {course.alumnosCount || 0} alumnos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    {course.examenesCount || 0} exámenes
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Abrir Curso</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
