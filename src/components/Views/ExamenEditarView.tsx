'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  HelpCircle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Sparkles,
  History,
  RotateCcw,
} from 'lucide-react';
import { fetchApi } from '@/src/lib/api';
import { AjustarPreguntaIaModal } from '@/src/components/Common/AjustarPreguntaIaModal';
import { useAutosaveDraft } from '@/src/hooks/useAutosaveDraft';
import { AutosaveBadge } from '../Common/AutosaveBadge';

interface ExamenEditarDraft {
  titulo: string;
  fecha: string;
  criteriosIA: string;
  preguntas: any[];
}

export const ExamenEditarView: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  const examId = params.id;
  const [courseId, setCourseId] = useState<string | null>(null);
  
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [criteriosIA, setCriteriosIA] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRestoreBanner, setShowRestoreBanner] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [entregasCount, setEntregasCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [ajustarModalQuestion, setAjustarModalQuestion] = useState<any | null>(null);

  // Hook de autoguardado en localStorage
  const draftKey = examId ? `evalia_draft_editar_${examId}` : '';
  const currentFormData = useMemo<ExamenEditarDraft>(
    () => ({
      titulo,
      fecha,
      criteriosIA,
      preguntas,
    }),
    [titulo, fecha, criteriosIA, preguntas]
  );

  const {
    lastSavedAt,
    isSaving: isAutosaving,
    hasSavedDraft,
    savedDraftData,
    savedDraftMeta,
    clearDraft,
    isOnline,
  } = useAutosaveDraft<ExamenEditarDraft>({
    key: draftKey,
    data: currentFormData,
    enabled: Boolean(examId && !isLoading && !success && !isSaving),
  });

  const handleRestoreDraft = () => {
    if (!savedDraftData) return;
    if (typeof savedDraftData.titulo === 'string') setTitulo(savedDraftData.titulo);
    if (typeof savedDraftData.fecha === 'string') setFecha(savedDraftData.fecha);
    if (typeof savedDraftData.criteriosIA === 'string') setCriteriosIA(savedDraftData.criteriosIA);
    if (Array.isArray(savedDraftData.preguntas) && savedDraftData.preguntas.length > 0) {
      setPreguntas(savedDraftData.preguntas);
    }
    setShowRestoreBanner(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowRestoreBanner(false);
  };

  useEffect(() => {
    if (!examId) return;
    setIsLoading(true);
    fetchApi(`/api/v1/examenes/${examId}`)
      .then(data => {
        setTitulo(data.titulo);
        setFecha(data.fecha ? new Date(data.fecha).toLocaleDateString('es-ES') : '');
        setCourseId(data.cursoId);
        setEntregasCount(data.entregas?.length || 0);
        
        if (data.preguntas && data.preguntas.length > 0) {
          const firstWithCriteria = data.preguntas.find((p: any) => p.criteriosIA);
          if (firstWithCriteria?.criteriosIA) {
            setCriteriosIA(firstWithCriteria.criteriosIA);
          }

          const loadedPreguntas = data.preguntas.map((p: any, idx: number) => ({
            id: p.id || `q-${idx}`,
            numero: idx + 1,
            consigna: p.enunciado,
            respuestaEsperada: p.respuestaEsperada,
            puntajeMaximo: p.puntajeMaximo,
            criteriosIA: p.criteriosIA || '',
            esEvaluacionVisual: p.esEvaluacionVisual ?? false,
          }));
          setPreguntas(loadedPreguntas);
        } else {
          setPreguntas([
            {
              id: 'q-1',
              numero: 1,
              consigna: '',
              respuestaEsperada: '',
              puntajeMaximo: '',
              esEvaluacionVisual: false,
            },
          ]);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('Error al cargar el examen');
      })
      .finally(() => setIsLoading(false));
  }, [examId]);

  const handleAddQuestion = () => {
    setPreguntas((prev) => [
      ...prev,
      {
        id: 'q-' + Date.now(),
        numero: prev.length + 1,
        consigna: '',
        respuestaEsperada: '',
        puntajeMaximo: '',
        esEvaluacionVisual: false,
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

  const triggerSubmit = async () => {
    setErrorMsg(null);
    setIsSaving(true);
    setShowWarningModal(false);

    try {
      const payload = {
        titulo: titulo.trim(),
        fecha: fecha.trim() || undefined,
        puntajeTotal: puntajeTotal,
        preguntas: preguntas.map((q, idx) => ({
          enunciado: q.consigna.trim(),
          respuestaEsperada: q.respuestaEsperada.trim(),
          puntajeMaximo: Number(q.puntajeMaximo) || 0,
          orden: idx + 1,
          criteriosIA: q.criteriosIA || criteriosIA.trim() || undefined,
          esEvaluacionVisual: q.esEvaluacionVisual ?? false,
        }))
      };

      await fetchApi(`/api/v1/examenes/${examId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      // Limpiamos el borrador local tras guardar exitosamente
      clearDraft();

      setSuccess(true);
      setTimeout(() => {
        router.push(`/examenes/${examId}`);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al guardar el examen');
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entregasCount > 0) {
      setShowWarningModal(true);
    } else {
      triggerSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span className="text-sm">Cargando examen...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al examen</span>
        </button>

        <div className="flex items-center gap-3">
          <AutosaveBadge
            lastSavedAt={lastSavedAt}
            isSaving={isAutosaving}
            isOnline={isOnline}
          />
          <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400">
            MODO EDICIÓN
          </span>
        </div>
      </div>

      {/* Banner de recuperación de borrador previo */}
      {hasSavedDraft && showRestoreBanner && savedDraftMeta && (
        <div className="bg-indigo-950/70 border border-indigo-500/40 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                <span>Borrador no guardado disponible</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-900/90 text-indigo-300 font-semibold border border-indigo-700/60">
                  {savedDraftMeta.updatedAt.toLocaleString('es-ES')}
                </span>
              </h3>
              <p className="text-xs text-indigo-200/80 leading-relaxed">
                Tenés modificaciones guardadas en este equipo para este examen con {savedDraftData?.preguntas?.length || 0} consignas. ¿Querés restaurarlas?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-rose-300 transition-colors"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar borrador</span>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {success && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 rounded-3xl flex flex-col items-center justify-center animate-in fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-white">Examen Actualizado</h2>
            <p className="text-slate-400 mt-2">Redirigiendo...</p>
          </div>
        )}

        {/* Section 1: HEADER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Editar Examen
              </h2>
              <p className="text-xs text-slate-400 mt-1">Estás modificando un examen existente.</p>
            </div>
            {entregasCount > 0 && (
              <span className="px-3 py-1 bg-rose-950/80 border border-rose-800/40 rounded-xl text-[10px] font-bold text-rose-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {entregasCount} entregas registradas
              </span>
            )}
          </div>

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

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAjustarModalQuestion(q)}
                      className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Ajustar con IA</span>
                    </button>

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
            <span>Actualizar examen</span>
          </button>
        </div>
      </form>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5"/> Cuidado
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Este examen ya tiene <strong>{entregasCount} entregas registradas</strong>. Modificar las consignas o los puntajes afectará la coherencia del historial académico y las correcciones de IA.
            </p>
            <p className="text-xs text-slate-400 italic">
              ¿Estás seguro de que deseas guardar los cambios?
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setShowWarningModal(false)} 
                disabled={isSaving}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={triggerSubmit} 
                disabled={isSaving}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                Sí, Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajustar Pregunta con IA */}
      {ajustarModalQuestion && (
        <AjustarPreguntaIaModal
          isOpen={!!ajustarModalQuestion}
          onClose={() => setAjustarModalQuestion(null)}
          pregunta={{
            id: ajustarModalQuestion.id,
            numero: ajustarModalQuestion.numero,
            consigna: ajustarModalQuestion.consigna,
            respuestaEsperada: ajustarModalQuestion.respuestaEsperada,
            puntajeMaximo: Number(ajustarModalQuestion.puntajeMaximo) || 0,
            criteriosIA: ajustarModalQuestion.criteriosIA || criteriosIA || '',
            esEvaluacionVisual: ajustarModalQuestion.esEvaluacionVisual ?? false,
          }}
          onAplicarCambio={(cambios) => {
            setPreguntas((prev) =>
              prev.map((q) =>
                q.id === ajustarModalQuestion.id
                  ? {
                      ...q,
                      consigna: cambios.consigna,
                      respuestaEsperada: cambios.respuestaEsperada,
                      ...(cambios.esEvaluacionVisual !== undefined
                        ? { esEvaluacionVisual: cambios.esEvaluacionVisual }
                        : {}),
                    }
                  : q
              )
            );
          }}
        />
      )}
    </div>
  );
};

