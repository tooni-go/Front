'use client';

import React from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { AlertCircle, ArrowLeft, Edit3, Trash2, HelpCircle } from 'lucide-react';

export const ExamenPreguntasView: React.FC = () => {
  const { getActiveExam, getActiveCourse, setScreen } = useEvalia();

  const exam = getActiveExam();
  const course = getActiveCourse();

  if (!exam || !course) {
    return (
      <div className="text-center py-10 text-slate-400">
        Examen no encontrado.
      </div>
    );
  }

  const hasDeliveries = exam.entregasCount > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('examen_detalle')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a {exam.titulo}</span>
      </button>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
              {course.materia} {course.anio}{course.division}
            </span>
            <h1 className="text-2xl font-black text-white mt-2">
              PREGUNTAS - {exam.titulo}
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Puntaje Total</span>
            <span className="text-lg font-black text-indigo-300">{exam.puntajeTotal} pts</span>
          </div>
        </div>

        {/* Rule Notice matching Wireframe 13 */}
        {hasDeliveries && (
          <div className="p-4 bg-amber-950/60 border border-amber-800/60 rounded-2xl flex items-start gap-3 text-amber-200 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">Atención: Examen con entregas registradas</p>
              <p className="text-amber-300/80">
                Si el examen ya posee entregas ({exam.entregasCount} recibidas): No se pueden agregar, editar ni eliminar preguntas para mantener la consistencia académica.
              </p>
            </div>
          </div>
        )}

        {/* List of Questions */}
        <div className="space-y-4 pt-2">
          {exam.preguntas.map((q) => (
            <div
              key={q.id}
              className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Pregunta N° {q.numero}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                    {q.puntajeMaximo} pts max
                  </span>

                  {!hasDeliveries && (
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-white leading-relaxed">
                  {q.consigna}
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Respuesta Esperada
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {q.respuestaEsperada}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
