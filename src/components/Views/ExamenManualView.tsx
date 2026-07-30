import React, { useState } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { Question } from '../../types/evalia';
import { Plus, Trash2, Save, ArrowLeft, HelpCircle } from 'lucide-react';

export const ExamenManualView: React.FC = () => {
  const { activeCourseId, saveExam, setScreen, getActiveCourse } = useEvalia();
  const course = getActiveCourse();

  const [titulo, setTitulo] = useState('Primer Parcial');
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('es-ES'));
  const [criteriosIA, setCriteriosIA] = useState('');

  const [preguntas, setPreguntas] = useState<Question[]>([
    {
      id: 'q-1',
      numero: 1,
      consigna: '',
      respuestaEsperada: '',
      puntajeMaximo: 25,
    },
  ]);

  const handleAddQuestion = () => {
    setPreguntas((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        numero: prev.length + 1,
        consigna: '',
        respuestaEsperada: '',
        puntajeMaximo: 25,
      },
    ]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (preguntas.length <= 1) return;
    setPreguntas((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, idx) => ({ ...q, numero: idx + 1 }))
    );
  };

  const handleUpdateQuestion = (id: string, field: keyof Question, value: any) => {
    setPreguntas((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const puntajeTotal = preguntas.reduce(
    (sum, q) => sum + (Number(q.puntajeMaximo) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        onClick={() => setScreen('examen_metodo')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Cambiar método de creación</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: DATOS DEL EXAMEN (Wireframe 11) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>DATOS DEL EXAMEN</span>
            <span className="text-xs text-indigo-400 font-semibold">
              Curso: {course ? `${course.materia} ${course.anio}${course.division}` : ''}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Título del Examen <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Primer Parcial"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fecha de Tomada
              </label>
              <input
                type="text"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: PREGUNTAS (Wireframe 11) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Preguntas ({preguntas.length})
            </h2>

            <div className="text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800/40 px-3 py-1 rounded-xl">
              Puntaje Total Calculado: {puntajeTotal} pts
            </div>
          </div>

          <div className="space-y-6">
            {preguntas.map((q) => (
              <div
                key={q.id}
                className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-400">
                    Pregunta N° {q.numero}
                  </span>

                  {preguntas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Consigna / Pregunta <span className="text-indigo-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={q.consigna}
                    onChange={(e) => handleUpdateQuestion(q.id, 'consigna', e.target.value)}
                    placeholder="Escriba la pregunta formulada al alumno..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Respuesta Esperada <span className="text-indigo-400">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={q.respuestaEsperada}
                      onChange={(e) => handleUpdateQuestion(q.id, 'respuestaEsperada', e.target.value)}
                      placeholder="Respuesta o conceptos clave requeridos..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Puntaje Máximo
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={q.puntajeMaximo}
                      onChange={(e) => handleUpdateQuestion(q.id, 'puntajeMaximo', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white font-bold text-center focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 font-bold text-xs rounded-2xl border border-dashed border-slate-800 hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>[ + Agregar otra pregunta ]</span>
          </button>
        </div>

        {/* Section 3: Criterios adicionales IA (Wireframe 11) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3 shadow-xl">
          <label className="block text-xs font-bold text-white">
            Criterios adicionales para la IA (Opcional)
          </label>
          <textarea
            rows={2}
            value={criteriosIA}
            onChange={(e) => setCriteriosIA(e.target.value)}
            placeholder="Ej: Tolerar sinónimos formales. Si falta el desarrollo pero el resultado final está bien, otorgar 50% de la nota."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="py-3 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>[ Guardar examen ]</span>
          </button>
        </div>
      </form>
    </div>
  );
};
