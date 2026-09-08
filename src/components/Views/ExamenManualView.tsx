'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft, HelpCircle, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/src/lib/api';

export const ExamenManualView: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  const courseId = params.id;
  const [course, setCourse] = useState<any>(null);
  
  const [titulo, setTitulo] = useState('Primer Parcial');
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('es-ES'));
  const [criteriosIA, setCriteriosIA] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [preguntas, setPreguntas] = useState<any[]>([
    {
      id: 'q-1',
      numero: 1,
      consigna: '',
      respuestaEsperada: '',
      puntajeMaximo: '',
    },
  ]);

  useEffect(() => {
    if (!courseId) return;
    fetchApi('/api/v1/cursos/' + courseId)
      .then(data => setCourse(data))
      .catch(err => console.error(err));
  }, [courseId]);

  const handleAddQuestion = () => {
    setPreguntas((prev) => [
      ...prev,
      {
        id: 'q-' + Date.now(),
        numero: prev.length + 1,
        consigna: '',
        respuestaEsperada: '',
        puntajeMaximo: '',
      },
    ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setPreguntas((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, idx) => ({ ...q, numero: idx + 1 }))
    );
  };

  const handleUpdateQuestion = (id: string, field: string, value: any) => {
    setPreguntas((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const puntajeTotal = preguntas.reduce((sum, q) => sum + (Number(q.puntajeMaximo) || 0), 0);
  const hasEmptyPoints = preguntas.some(q => q.puntajeMaximo === '' || q.puntajeMaximo === 0 || q.puntajeMaximo === undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSaving(true);

    try {
      const payload = {
        titulo: titulo.trim(),
        fecha: fecha.trim(),
        criteriosAdicionales: criteriosIA.trim(),
        puntajeTotal: puntajeTotal,
        preguntas: preguntas.map((q, idx) => ({
          enunciado: q.consigna.trim(),
          respuestaEsperada: q.respuestaEsperada.trim(),
          puntajeMaximo: Number(q.puntajeMaximo) || 0,
          orden: idx + 1
        }))
      };

      await fetchApi('/api/v1/cursos/' + courseId + '/examenes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/cursos/' + courseId);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al guardar el examen');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => router.push(`/examenes/${courseId}/metodo`)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Cambiar método de creación</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {success && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 rounded-3xl flex flex-col items-center justify-center animate-in fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-white">Examen Guardado</h2>
            <p className="text-slate-400 mt-2">Redirigiendo al curso...</p>
          </div>
        )}

        {/* Section 1: DATOS DEL EXAMEN */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>DATOS DEL EXAMEN</span>
            <span className="text-xs text-indigo-400 font-semibold">
              Curso: {course ? `${course.materia} ${course.anio}${course.division}` : 'Cargando...'}
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

        {/* Validation Warning */}
        {(puntajeTotal !== 10 || hasEmptyPoints) && (
          <div className="bg-amber-950/40 border border-amber-900/50 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-400">Atención con los puntajes</h3>
              <p className="text-xs text-amber-200/70 mt-1">
                {puntajeTotal !== 10 && `El puntaje total del examen debe sumar exactamente 10. Actualmente suma ${puntajeTotal}. `}
                {hasEmptyPoints && "Hay preguntas sin puntaje asignado. Se guardarán con 0 puntos por defecto."}
              </p>
            </div>
          </div>
        )}

        {/* Section 2: PREGUNTAS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Preguntas ({preguntas.length})
            </h2>

            <div className={`text-xs font-bold px-3 py-1 rounded-xl border ${puntajeTotal === 10 ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/40' : 'text-amber-400 bg-amber-950/80 border-amber-800/40'}`}>
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
                      min={0}
                      max={10}
                      step="0.5"
                      value={q.puntajeMaximo}
                      onChange={(e) => handleUpdateQuestion(q.id, 'puntajeMaximo', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white font-bold text-center focus:outline-none"
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
            <span>Agregar otra pregunta</span>
          </button>
        </div>

        {/* Section 3: Criterios adicionales IA */}
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

        {errorMsg && (
          <div className="text-rose-400 text-sm font-semibold text-center">{errorMsg}</div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="py-3 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Guardar examen</span>
          </button>
        </div>
      </form>
    </div>
  );
};