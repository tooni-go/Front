'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, FileText, Plus, ArrowLeft, ChevronRight, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { fetchApi } from '@/src/lib/api';

interface BackendExamen {
  id: string;
  titulo: string;
  fecha: string;
  preguntas: { puntajeMaximo: number }[];
  _count?: { entregas: number };
}

interface BackendCurso {
  id: string;
  materia: string;
  anio: number;
  division: string;
  anioLectivo: number;
  examenes: BackendExamen[];
  alumnos: { alumno: { id: string; nombre: string; apellido: string; legajo: string } }[];
}

interface CursoDetalleViewProps {
  courseId?: string;
}

export const CursoDetalleView: React.FC<CursoDetalleViewProps> = ({ courseId: propCourseId }) => {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  
  const courseId = propCourseId || params.id;

  const [curso, setCurso] = useState<BackendCurso | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    setIsLoading(true);
    fetchApi<BackendCurso>(`/api/v1/cursos/${courseId}`)
      .then((data) => setCurso(data))
      .catch((err) => setLoadError(err?.message || 'No se pudo cargar el curso.'))
      .finally(() => setIsLoading(false));
  }, [courseId]);

  const handleDeleteAlumno = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este alumno?')) return;

    try {
      await fetchApi(`/api/v1/alumnos/${id}`, {
        method: 'DELETE',
      });
      if (curso) {
        setCurso({
          ...curso,
          alumnos: curso.alumnos.filter(ac => ac.alumno.id !== id)
        });
      }
    } catch (error) {
      console.error('Error deleting alumno:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span className="text-sm">Cargando curso...</span>
      </div>
    );
  }

  if (loadError || !curso) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
        <p className="text-slate-400 text-sm">{loadError || 'Curso no encontrado.'}</p>
        <button
          onClick={() => router.push('/cursos')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  const students = curso.alumnos.map((ac) => ac.alumno);
  const exams = curso.examenes || [];
  const anioStr = `${curso.anio}°`;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <button
        onClick={() => router.push('/cursos')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a la lista de cursos</span>
      </button>

      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
              Año Lectivo: {curso.anioLectivo}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {curso.materia} - {anioStr}{curso.division}
          </h1>
          <div className="flex items-center gap-6 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-indigo-400" />
              {students.length} alumnos registrados
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-indigo-400" />
              {exams.length} examenes programados
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => router.push(`/alumnos/nuevo?cursoId=${courseId}`)}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span> Nuevo alumno </span>
          </button>
          <button
            onClick={() => router.push(`/examenes/${courseId}/metodo`)}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span> Nuevo examen </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Alumnos ({students.length})
            </h2>
            <button
              onClick={() => router.push(`/alumnos?cursoId=${courseId}`)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Ver todos
            </button>
          </div>
          {students.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center">
              <Users className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-xs text-slate-400">El curso no tiene alumnos.</p>
              <button
                onClick={() => router.push(`/alumnos/nuevo?cursoId=${courseId}`)}
                className="mt-3 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-600/40"
              >
                Añadir primer alumno
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{student.nombre} {student.apellido || ''}</p>
                    <p className="text-[11px] text-slate-500">DNI / Legajo: {student.legajo}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/alumnos/${student.id}/editar`)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Editar alumno"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAlumno(student.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                      title="Eliminar alumno"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Examenes ({exams.length})
            </h2>
            <button
              onClick={() => router.push(`/examenes/${courseId}/metodo`)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Examen</span>
            </button>
          </div>
          {exams.length === 0 ? (
            <div className="text-center py-8 space-y-3 flex flex-col items-center">
              <FileText className="w-10 h-10 text-slate-700 mb-2" />
              <p className="text-xs text-slate-500 italic">No hay exámenes en este curso aún.</p>
              <button
                onClick={() => router.push(`/examenes/${courseId}/metodo`)}
                className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all"
              >
                Crear primer examen
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {exams.map((exam) => {
                const puntajeTotal = exam.preguntas ? exam.preguntas.reduce((sum, p) => sum + p.puntajeMaximo, 0) : 0;
                const fechaStr = exam.fecha ? new Date(exam.fecha).toLocaleDateString('es-ES') : '-';
                const entregasCount = exam._count?.entregas ?? 0;
                return (
                  <div key={exam.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">{exam.titulo}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                        <span>Fecha: {fechaStr}</span>
                        <span>&bull;</span>
                        <span>{exam.preguntas ? exam.preguntas.length : 0} preguntas</span>
                        <span>&bull;</span>
                        <span>Puntaje Total: {puntajeTotal} pts</span>
                        <span>&bull;</span>
                        <span className="text-indigo-300 font-semibold">{entregasCount} entregas</span>
                      </div>
                    </div>
                    <button onClick={() => router.push(`/examenes/${exam.id}`)} className="py-2 px-4 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 shrink-0">
                      <span>Abrir</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
