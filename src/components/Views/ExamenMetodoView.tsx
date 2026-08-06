'use client';

import React, { useState } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { FileEdit, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const ExamenMetodoView: React.FC = () => {
  const { setScreen, getActiveCourse } = useEvalia();
  const [metodo, setMetodo] = useState<'manual' | 'inteligente'>('inteligente');

  const course = getActiveCourse();

  const handleContinue = () => {
    if (metodo === 'manual') {
      setScreen('examen_manual');
    } else {
      setScreen('examen_inteligente');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('curso_detalle')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al curso</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-1 rounded-full">
            {course ? `${course.materia} - ${course.anio}${course.division}` : 'NUEVO EXAMEN'}
          </span>
          <h1 className="text-2xl font-black text-white pt-2">
            ¿Cómo desea crear el examen?
          </h1>
          <p className="text-xs text-slate-400">
            Seleccione la metodología para definir las preguntas y respuestas esperadas
          </p>
        </div>

        {/* Radio Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Carga Inteligente */}
          <div
            onClick={() => setMetodo('inteligente')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
              metodo === 'inteligente'
                ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <input
                  type="radio"
                  name="metodo"
                  checked={metodo === 'inteligente'}
                  onChange={() => setMetodo('inteligente')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
              </div>

              <h3 className="text-base font-bold text-white">Carga Inteligente</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pegue el texto completo del examen o suba un archivo Word/PDF. La IA extraerá automáticamente las consignas y respuestas.
              </p>
            </div>

            <span className="text-[11px] font-semibold text-indigo-400">
              ⚡ Recomendado &bull; Ahorra tiempo
            </span>
          </div>

          {/* Crear Manualmente */}
          <div
            onClick={() => setMetodo('manual')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
              metodo === 'manual'
                ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <FileEdit className="w-5 h-5" />
                </div>
                <input
                  type="radio"
                  name="metodo"
                  checked={metodo === 'manual'}
                  onChange={() => setMetodo('manual')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
              </div>

              <h3 className="text-base font-bold text-white">Crear Manualmente</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Escriba una a una las consignas, especifique la respuesta esperada y asigne el puntaje correspondiente a cada pregunta.
              </p>
            </div>

            <span className="text-[11px] font-semibold text-slate-400">
              ✍ Control total ítem por ítem
            </span>
          </div>
        </div>

        {/* Continue button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleContinue}
            className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <span>[ Continuar ]</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
