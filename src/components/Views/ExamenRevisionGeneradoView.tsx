'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvalia } from '../../context/EvaliaContext';
import { Question } from '../../types/evalia';
import { fetchApi, ApiError } from '../../lib/api';
import {
  Save,
  Sparkles,
  Trash2,
  Plus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  AlertTriangle,
  History,
  RotateCcw,
} from 'lucide-react';
import { AjustarPreguntaIaModal } from '../Common/AjustarPreguntaIaModal';
import { useAutosaveDraft } from '@/src/hooks/useAutosaveDraft';
import { AutosaveBadge } from '../Common/AutosaveBadge';

interface BackendCreatedExam {
  id: string;
  titulo: string;
  fecha?: string;
  cursoId?: string;
}

interface ExamenRevisionDraft {
  titulo: string;
  fecha: string;
  preguntas: Question[];
}

export const ExamenRevisionGeneradoView: React.FC = () => {
  const {
    pendingGeneratedExam,
    setPendingGeneratedExam,
    getCourseById,
    getExamById,
  } = useEvalia();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const exam = getExamById(params.id);
  const course = getCourseById(exam?.courseId || params.id);
  const courseId = course?.id || exam?.courseId || params.id;

  const [titulo, setTitulo] = useState(
    pendingGeneratedExam?.titulo || 'Examen Generado por IA'
  );
  const [fecha, setFecha] = useState(
    pendingGeneratedExam?.fecha || new Date().toLocaleDateString('es-ES')
  );
  const [preguntas, setPreguntas] = useState<Question[]>(
    pendingGeneratedExam?.preguntas || [
      {
        id: 'q-1',
        numero: 1,
        consigna: 'Responda la consigna.',
        respuestaEsperada: 'Respuesta clave.',
        puntajeMaximo: 25,
        criteriosIA: '',
      },
    ]
  );
  const [ajustarModalQuestion, setAjustarModalQuestion] = useState<Question | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showRestoreBanner, setShowRestoreBanner] = useState(true);

  // Hook de autoguardado en localStorage
  const draftKey = courseId ? `evalia_draft_revision_${courseId}` : '';
  const currentFormData = useMemo<ExamenRevisionDraft>(
    () => ({
      titulo,
      fecha,
      preguntas,
    }),
    [titulo, fecha, preguntas]
  );

  const {
    lastSavedAt,
    isSaving: isAutosaving,
    hasSavedDraft,
    savedDraftData,
    savedDraftMeta,
    clearDraft,
    isOnline,
  } = useAutosaveDraft<ExamenRevisionDraft>({
    key: draftKey,
    data: currentFormData,
    enabled: Boolean(courseId && !isSaving),
  });

  const handleRestoreDraft = () => {
    if (!savedDraftData) return;
    if (typeof savedDraftData.titulo === 'string') setTitulo(savedDraftData.titulo);
    if (typeof savedDraftData.fecha === 'string') setFecha(savedDraftData.fecha);
    if (Array.isArray(savedDraftData.preguntas) && savedDraftData.preguntas.length > 0) {
      setPreguntas(savedDraftData.preguntas);
    }
    setShowRestoreBanner(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowRestoreBanner(false);
  };

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
        criteriosIA: '',
        esEvaluacionVisual: false,
      },
    ]);
  };

  const puntajeTotal = preguntas.reduce(
    (sum, q) => sum + (Number(q.puntajeMaximo) || 0),
    0
  );

  const handleSave = async () => {
    if (!courseId) {
      setSaveError('No se pudo determinar el curso al que pertenece el examen.');
      return;
    }
    if (!titulo.trim()) {
      setSaveError('Por favor ingrese un título para el examen.');
      return;
    }
    if (preguntas.length === 0) {
      setSaveError('El examen debe tener al menos una pregunta.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Mapeo inverso de campos Frontend (consigna) -> Backend (enunciado)
      const payload = {
        titulo: titulo.trim(),
        preguntas: preguntas.map((q) => ({
          enunciado: q.consigna.trim(),
          respuestaEsperada: q.respuestaEsperada.trim(),
          puntajeMaximo: Number(q.puntajeMaximo) || 0,
          criteriosIA: q.criteriosIA?.trim() || undefined,
          esEvaluacionVisual: q.esEvaluacionVisual ?? false,
        })),
      };

      const created = await fetchApi<BackendCreatedExam>(
        `/api/v1/cursos/${courseId}/examenes`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      // Limpiamos el borrador temporal tras guardar con éxito
      clearDraft();
      setPendingGeneratedExam(null);
      router.push(`/examenes/${created.id}`);
    } catch (err: any) {
      console.error('Error al guardar examen:', err);
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || 'Error al guardar el examen en el servidor. Por favor, intente nuevamente.';
      setSaveError(msg);
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => router.push(`/examenes/${courseId}/inteligente`)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la carga de archivo/texto</span>
        </button>

        <AutosaveBadge
          lastSavedAt={lastSavedAt}
          isSaving={isAutosaving}
          isOnline={isOnline}
        />
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
                <span>Borrador de revisión disponible</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-900/90 text-indigo-300 font-semibold border border-indigo-700/60">
                  {savedDraftMeta.updatedAt.toLocaleString('es-ES')}
                </span>
              </h3>
              <p className="text-xs text-indigo-200/80 leading-relaxed">
                Tenés modificaciones guardadas localmente de esta revisión ({savedDraftData?.preguntas?.length || 0} consignas). ¿Querés restaurarlas?
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
          Revise y ajuste las preguntas, respuestas modelo y criterios de corrección generados por la IA antes de guardar.
        </p>
      </div>

      {/* Aviso de revisión cuando el origen requería validación */}
      {pendingGeneratedExam?.requiereRevisionAviso && (
        <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-2xl flex items-start gap-3 text-amber-200 text-xs shadow-lg animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-300">
              Revisión recomendada por extracción OCR/IA
            </p>
            <p className="text-slate-300 mt-0.5">
              El texto original proviene de un documento procesado automáticamente. Verifique que las consignas y criterios reflejen con exactitud lo esperado.
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de Error al Guardar */}
      {saveError && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-start gap-3 text-rose-200 text-xs shadow-lg animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-300">Error al guardar el examen</p>
            <p className="text-slate-300 mt-0.5">{saveError}</p>
          </div>
        </div>
      )}

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

        {/* Lista de preguntas generadas */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white">
              PREGUNTAS DETECTADAS ({preguntas.length})
            </h2>
            <div className="text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800/40 px-3 py-1 rounded-xl">
              Puntaje Total: {puntajeTotal} pts
            </div>
          </div>

          <div className="space-y-5">
            {preguntas.map((q) => (
              <div
                key={q.id}
                className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">
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
                        className="p-1 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                        title="Eliminar pregunta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Consigna */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Consigna / Enunciado
                  </label>
                  <textarea
                    rows={2}
                    value={q.consigna}
                    onChange={(e) =>
                      handleUpdateQuestion(q.id, 'consigna', e.target.value)
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                {/* Respuesta Esperada y Puntaje */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Respuesta Esperada / Modelo
                    </label>
                    <textarea
                      rows={2}
                      value={q.respuestaEsperada}
                      onChange={(e) =>
                        handleUpdateQuestion(
                          q.id,
                          'respuestaEsperada',
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
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
                      onChange={(e) =>
                        handleUpdateQuestion(
                          q.id,
                          'puntajeMaximo',
                          Number(e.target.value)
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white font-bold text-center focus:outline-none"
                    />
                  </div>
                </div>

                {/* Criterios de Corrección IA (Subtarea 2) */}
                <div>
                  <label className="block text-[11px] font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Criterios de corrección IA</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      (opcional - guía para la evaluación de entregas)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={q.criteriosIA ?? ''}
                    onChange={(e) =>
                      handleUpdateQuestion(q.id, 'criteriosIA', e.target.value)
                    }
                    placeholder="Especifique conceptos clave obligatorios, penalizaciones o consideraciones para la IA..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddQuestion}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-indigo-400 font-bold text-xs rounded-xl border border-dashed border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar pregunta</span>
          </button>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="py-3 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Guardando examen...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar examen</span>
              </>
            )}
          </button>
        </div>
      </div>

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
            criteriosIA: ajustarModalQuestion.criteriosIA || '',
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