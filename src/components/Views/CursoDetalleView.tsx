'use client';

import React from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { Users, FileText, Plus, ArrowRight, ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';

export const CursoDetalleView: React.FC = () => {
  const {
    getActiveCourse,
    getCourseStudents,
    getCourseExams,
    setScreen,
    setActiveExamId,
  } = useEvalia();

  const course = getActiveCourse();
  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-sm">Curso no encontrado.</p>
        <button
          onClick={() => setScreen('cursos_lista')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  const students = getCourseStudents(course.id);
  const exams = getCourseExams(course.id);

  const handleOpenExam = (examId: string) => {
    setActiveExamId(examId);
    setScreen('examen_detalle');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={() => setScreen('cursos_lista')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a la lista de cursos</span>
      </button>

      {/* Header Info Banner (Wireframe 6) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
              Año Lectivo: {course.anioLectivo}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {course.materia} - {course.anio}{course.division}
          </h1>
          <div className="flex items-center gap-6 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-indigo-400" />
              {students.length} alumnos registrados
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-indigo-400" />
              {exams.length} exámenes programados
            </span>
          </div>
        </div>

        {/* Action buttons matching Wireframe 6 */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setScreen('alumno_nuevo')}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>[ + Nuevo alumno ]</span>
          </button>

          <button
            onClick={() => setScreen('examen_metodo')}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>[ + Nuevo examen ]</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 1: Alumnos registrados (1 col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Alumnos ({students.length})
            </h2>

            <button
              onClick={() => setScreen('alumnos_lista')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              [ Ver todos ]
            </button>
          </div>

          {students.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              Aún no hay alumnos registrados.
            </p>
          ) : (
            <div className="space-y-2">
              {students.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-200">{student.nombre}</p>
                    <p className="text-[11px] text-slate-500">Legajo: {student.legajo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Exámenes del curso (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Exámenes ({exams.length})
            </h2>

            <button
              onClick={() => setScreen('examen_metodo')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Examen</span>
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-500 italic">No hay exámenes en este curso aún.</p>
              <button
                onClick={() => setScreen('examen_metodo')}
                className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Crear primer examen
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {exam.titulo}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                      <span>Fecha: {exam.fecha}</span>
                      <span>&bull;</span>
                      <span>{exam.preguntasCount} preguntas</span>
                      <span>&bull;</span>
                      <span>Puntaje Total: {exam.puntajeTotal} pts</span>
                      <span>&bull;</span>
                      <span className="text-indigo-300 font-semibold">{exam.entregasCount} entregas</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenExam(exam.id)}
                    className="py-2 px-4 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>[ Abrir ]</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
