'use client';

import React, { useState } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { Question } from '../../types/evalia';
import { Save, Sparkles, Trash2, Plus, ArrowLeft } from 'lucide-react';

export const ExamenRevisionGeneradoView: React.FC = () => {
  const {
    pendingGeneratedExam,
    activeCourseId,
    saveExam,
    setScreen,
    getActiveCourse,
  } = useEvalia();

  const course = getActiveCourse();

  const [titulo, setTitulo] = useState(
    pendingGeneratedExam?.titulo || 'Examen Generado por IA'
  );
  const [fecha, setFecha] = useState(
    pendingGeneratedExam?.fecha || new Date().toLocaleDateString('es-ES')
  );
  const [criteriosIA, setCriteriosIA] = useState(
    pendingGeneratedExam?.criteriosIA || ''
  );
  const [preguntas, setPreguntas] = useState<Question[]>(
    pendingGeneratedExam?.preguntas || [
      {
        id: 'q-1',
        numero: 1,
        consigna: 'Responda la consigna.',
        respuestaEsperada: 'Respuesta clave.',
        puntajeMaximo: 25,
      },
    ]
  );

  const handleUpdateQuestion = (id: string, field: keyof Question, value: any) => {
    setPreguntas((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleRemoveQuestion = (id: string) => {
    if (preguntas.length <= 1) return;
    setPreguntas((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, idx) => ({ ...q, numero: idx + 1 }))
    );
  };

  const handleAddQuestion = () => {
    setPreguntas((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        numero: prev.length + 1,
        consigna: '',
        respuestaEsperada: '',
        puntajeMaximo: 20,
      },
    ]);
  };

  const puntajeTotal = preguntas.reduce(
    (sum, q) => sum + (Number(q.puntajeMaximo) || 0),
    0
  );

  const handleSave = () => {
    if (!activeCourseId || !titulo.trim()) return;

    saveExam({
      courseId: activeCourseId,
      titulo: titulo.trim(),
      fecha,
      criteriosIA,
      preguntas,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('examen_inteligente')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Revolver a la carga de archivo/texto</span>
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Extracción Inteligente Completada
        </div>
        <h1 className="text-2xl font-black text-white">
          REVISIÓN DEL EXAMEN GENERADO
        </h1>
        <p className="text-xs text-slate-300">
          Revise y ajuste los datos extraídos por la IA antes de guardar la evaluación en el sistema.
        </p>
      </div>

      <div className="space-y-6">
        {/* Datos Básicos */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            DATOS GENERALES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Título del Examen
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fecha
              </label>
              <input
                type="text"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* List of generated questions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white">
              PREGUNTAS DETECTADAS ({preguntas.length})
            </h2>
            <div className="text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800/40 px-3 py-1 rounded-xl">
              Puntaje Total: {puntajeTotal} pts
            </div>
          </div>

          <div className="space-y-4">
            {preguntas.map((q) => (
              <div
                key={q.id}
                className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">
                    Pregunta N° {q.numero}
                  </span>
                  {preguntas.length > 1 && (
                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-1 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Consigna
                  </label>
                  <textarea
                    rows={2}
                    value={q.consigna}
                    onChange={(e) => handleUpdateQuestion(q.id, 'consigna', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Respuesta Esperada
                    </label>
                    <textarea
                      rows={2}
                      value={q.respuestaEsperada}
                      onChange={(e) => handleUpdateQuestion(q.id, 'respuestaEsperada', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Puntaje Máximo
                    </label>
                    <input
                      type="number"
                      value={q.puntajeMaximo}
                      onChange={(e) => handleUpdateQuestion(q.id, 'puntajeMaximo', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white font-bold text-center focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddQuestion}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-indigo-400 font-bold text-xs rounded-xl border border-dashed border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>[ + Agregar pregunta ]</span>
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="py-3 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>[ Guardar examen ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
