'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Check,
  X,
  RotateCcw,
  Loader2,
  AlertCircle,
  BarChart2,
  RefreshCw,
  FileText,
  Sliders,
  Eye,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { fetchApi } from '@/src/lib/api';

export type TipoAjuste = 'CAMBIO_DIFICULTAD' | 'CAMBIO_FORMATO' | 'REFRASEO';
export type NivelDificultad = 'FACIL' | 'MEDIO' | 'DIFICIL';
export type FormatoDestino = 'MULTIPLE_CHOICE' | 'DESARROLLO' | 'VERDADERO_FALSO';

export interface AjustarPreguntaIaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pregunta: {
    id: string;
    numero: number;
    consigna: string;
    respuestaEsperada: string;
    puntajeMaximo?: number;
    criteriosIA?: string;
    esEvaluacionVisual?: boolean;
  };
  onAplicarCambio: (cambios: {
    consigna: string;
    respuestaEsperada: string;
    esEvaluacionVisual?: boolean;
  }) => void;
}

interface SugerenciaIaResponse {
  enunciado: string;
  respuestaEsperada: string;
  esEvaluacionVisual: boolean;
}

export const AjustarPreguntaIaModal: React.FC<AjustarPreguntaIaModalProps> = ({
  isOpen,
  onClose,
  pregunta,
  onAplicarCambio,
}) => {
  const [tipoAjuste, setTipoAjuste] = useState<TipoAjuste>('CAMBIO_DIFICULTAD');
  const [nivelDificultad, setNivelDificultad] = useState<NivelDificultad>('MEDIO');
  const [formatoDestino, setFormatoDestino] = useState<FormatoDestino>('MULTIPLE_CHOICE');

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sugerencia, setSugerencia] = useState<SugerenciaIaResponse | null>(null);

  // Reiniciar estado al abrir modal o cambiar de pregunta
  useEffect(() => {
    if (isOpen) {
      setSugerencia(null);
      setError(null);
      setIsGenerating(false);
    }
  }, [isOpen, pregunta.id]);

  // Manejar tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGenerating) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isGenerating, onClose]);

  const handleGenerar = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        preguntaId: pregunta.id,
        tipoAjuste,
        parametros: {},
        preguntaData: {
          enunciado: pregunta.consigna.trim(),
          respuestaEsperada: pregunta.respuestaEsperada.trim(),
          puntajeMaximo: Number(pregunta.puntajeMaximo) || 10,
          criteriosIA: pregunta.criteriosIA?.trim() || undefined,
          esEvaluacionVisual: pregunta.esEvaluacionVisual ?? false,
        },
      };

      if (tipoAjuste === 'CAMBIO_DIFICULTAD') {
        payload.parametros.nivelDificultad = nivelDificultad;
      } else if (tipoAjuste === 'CAMBIO_FORMATO') {
        payload.parametros.formatoDestino = formatoDestino;
      }

      const response = await fetchApi<{
        preguntaOriginal: {
          id: string;
          enunciado: string;
          respuestaEsperada: string;
          puntajeMaximo?: number;
        };
        sugerencia: SugerenciaIaResponse;
        tipoAjuste: string;
        parametros?: any;
      }>('/api/v1/examenes/preguntas/regenerar-individual', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response?.sugerencia) {
        setSugerencia(response.sugerencia);
      } else {
        throw new Error(
          'La respuesta del servidor no contiene la sugerencia esperada.'
        );
      }
    } catch (err: any) {
      console.error('Error al generar sugerencia de IA:', err);
      setError(
        err?.message ||
          'No fue posible generar la sugerencia con la IA. Por favor, revise la conexión o intente nuevamente.'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [
    pregunta,
    tipoAjuste,
    nivelDificultad,
    formatoDestino,
  ]);

  const handleAplicar = () => {
    if (!sugerencia) return;
    onAplicarCambio({
      consigna: sugerencia.enunciado,
      respuestaEsperada: sugerencia.respuestaEsperada,
      esEvaluacionVisual: sugerencia.esEvaluacionVisual,
    });
    onClose();
  };

  const handleProbarOtro = () => {
    setSugerencia(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-ajustar-ia-title"
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isGenerating) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="modal-ajustar-ia-title"
                  className="text-base font-bold text-white tracking-wide"
                >
                  Ajustar Pregunta con IA
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-950/80 border border-indigo-800/40 text-indigo-300">
                  Pregunta N° {pregunta.numero}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ajuste atómico de dificultad, formato o redacción asistido por IA.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-40"
            title="Cerrar modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-130px)] overflow-y-auto">
          {/* Selector de Tipo de Ajuste */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Seleccione el tipo de ajuste
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Opción 1: Dificultad */}
              <button
                type="button"
                onClick={() => setTipoAjuste('CAMBIO_DIFICULTAD')}
                disabled={isGenerating}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  tipoAjuste === 'CAMBIO_DIFICULTAD'
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <span>Dificultad</span>
                  </div>
                  {tipoAjuste === 'CAMBIO_DIFICULTAD' && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Adapta la complejidad cognitiva, pistas o exigencia analítica.
                </p>
              </button>

              {/* Opción 2: Formato */}
              <button
                type="button"
                onClick={() => setTipoAjuste('CAMBIO_FORMATO')}
                disabled={isGenerating}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  tipoAjuste === 'CAMBIO_FORMATO'
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Formato</span>
                  </div>
                  {tipoAjuste === 'CAMBIO_FORMATO' && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Transforma a opción múltiple, desarrollo o V/F.
                </p>
              </button>

              {/* Opción 3: Refraseo */}
              <button
                type="button"
                onClick={() => setTipoAjuste('REFRASEO')}
                disabled={isGenerating}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  tipoAjuste === 'REFRASEO'
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <RefreshCw className="w-4 h-4 text-indigo-400" />
                    <span>Refrasear</span>
                  </div>
                  {tipoAjuste === 'REFRASEO' && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Reescribe la consigna renovando palabras sin alterar dificultad.
                </p>
              </button>
            </div>
          </div>

          {/* Parámetros Específicos según Tipo de Ajuste */}
          {tipoAjuste === 'CAMBIO_DIFICULTAD' && (
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
              <label className="block text-xs font-semibold text-slate-300">
                Nivel de dificultad deseado:
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'FACIL', label: '🟢 Fácil', desc: 'Simplifica pasos y añade contexto o pistas' },
                    { id: 'MEDIO', label: '🟡 Medio', desc: 'Equilibrio estándar teórico-práctico' },
                    { id: 'DIFICIL', label: '🔴 Difícil', desc: 'Mayor profundidad analítica y rigor' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNivelDificultad(item.id)}
                    disabled={isGenerating}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      nivelDificultad === item.id
                        ? item.id === 'FACIL'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm'
                          : item.id === 'MEDIO'
                          ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-sm'
                          : 'bg-rose-950 border-rose-500 text-rose-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 italic">
                {nivelDificultad === 'FACIL' && 'Simplificará la redacción, reducirá pasos de razonamiento y añadirá contexto orientador.'}
                {nivelDificultad === 'MEDIO' && 'Mantendrá un balance entre teoría y resolución práctica estándar.'}
                {nivelDificultad === 'DIFICIL' && 'Exigirá mayor profundidad analítica, combinación de conceptos y justificación rigurosa.'}
              </p>
            </div>
          )}

          {tipoAjuste === 'CAMBIO_FORMATO' && (
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
              <label className="block text-xs font-semibold text-slate-300">
                Formato de destino de la pregunta:
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'MULTIPLE_CHOICE', label: '🎯 Opción Múltiple (4 opciones)' },
                    { id: 'DESARROLLO', label: '📝 Desarrollo / Abierta' },
                    { id: 'VERDADERO_FALSO', label: '⚖️ Verdadero / Falso' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormatoDestino(item.id)}
                    disabled={isGenerating}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      formatoDestino === item.id
                        ? 'bg-indigo-950 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 italic">
                {formatoDestino === 'MULTIPLE_CHOICE' && 'Creará 4 alternativas (A, B, C, D) con 1 correcta y 3 distractores verosímiles.'}
                {formatoDestino === 'DESARROLLO' && 'Reformulará la consigna como pregunta abierta de explicación o desarrollo paso a paso.'}
                {formatoDestino === 'VERDADERO_FALSO' && 'Formulará una afirmación conceptual precisa con justificación de verdad/falsedad.'}
              </p>
            </div>
          )}

          {tipoAjuste === 'REFRASEO' && (
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-xs text-slate-300 space-y-1 animate-in fade-in duration-150">
              <p className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Refraseo pedagógico inteligente
              </p>
              <p className="text-[11px] text-slate-400">
                La IA mantendrá estrictamente el mismo nivel de dificultad, el contenido evaluado y el formato de respuesta, renovando la redacción.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-start gap-3 text-rose-200 text-xs shadow-lg animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-rose-300">Error al procesar la solicitud</p>
                <p className="text-slate-300 mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={handleGenerar}
                  disabled={isGenerating}
                  className="mt-2 text-xs font-bold text-rose-300 underline hover:text-white"
                >
                  Reintentar ahora
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="p-8 bg-slate-950/80 border border-indigo-500/30 rounded-3xl flex flex-col items-center justify-center gap-3 text-center animate-pulse">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Generando consigna adaptada con IA...
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Analizando el contexto de la pregunta y aplicando las reglas pedagógicas solicitadas.
                </p>
              </div>
            </div>
          )}

          {/* Preview Comparativo (Antes / Después) */}
          {sugerencia && !isGenerating && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>2. Comparación Antes vs Después</span>
                </h3>
                {sugerencia.esEvaluacionVisual && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-800/60 text-amber-300 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Requiere evaluación visual
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Columna 1: Original (Antes) */}
                <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wide">
                      Original (Antes)
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {pregunta.puntajeMaximo ? `${pregunta.puntajeMaximo} pts` : ''}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Consigna actual
                    </label>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                      {pregunta.consigna || '(Sin consigna definida)'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Respuesta esperada actual
                    </label>
                    <p className="text-xs text-slate-400 whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                      {pregunta.respuestaEsperada || '(Sin respuesta definida)'}
                    </p>
                  </div>
                </div>

                {/* Columna 2: Sugerencia IA (Después) */}
                <div className="p-4 bg-indigo-950/30 border border-indigo-500/40 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                    <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Sugerencia IA (Después)
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">
                      Listo para aplicar
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-indigo-300/80 mb-1">
                      Nueva consigna propuesta
                    </label>
                    <p className="text-xs text-white font-medium whitespace-pre-wrap bg-slate-900/90 p-2.5 rounded-xl border border-indigo-500/30 shadow-inner">
                      {sugerencia.enunciado}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-indigo-300/80 mb-1">
                      Nueva respuesta modelo
                    </label>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap bg-slate-900/90 p-2.5 rounded-xl border border-indigo-500/30 shadow-inner">
                      {sugerencia.respuestaEsperada}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vista inicial cuando aún no se generó sugerencia */}
          {!sugerencia && !isGenerating && (
            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-2">
              <label className="block text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                Consigna actual a adaptar:
              </label>
              <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                "{pregunta.consigna}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer / Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div>
            {sugerencia && !isGenerating && (
              <button
                type="button"
                onClick={handleProbarOtro}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Probar otro ajuste / Reintentar</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors disabled:opacity-40"
            >
              {sugerencia ? 'Descartar' : 'Cancelar'}
            </button>

            {!sugerencia ? (
              <button
                type="button"
                onClick={handleGenerar}
                disabled={isGenerating || !pregunta.consigna?.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Generar sugerencia con IA</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAplicar}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-100" />
                <span>Aplicar cambios</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
