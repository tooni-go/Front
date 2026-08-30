'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { AlertCircle, ArrowLeft, HelpCircle, Loader2, AlertTriangle, Sparkles } from 'lucide-react';

interface BackendPregunta {
  id: string;
  enunciado: string;
  respuestaEsperada: string;
  puntajeMaximo: number;
  criteriosIA?: string | null;
  esEvaluacionVisual?: boolean;
}

interface BackendCurso {
  id: string;
  materia: string;
  anio: number;
  division: string;
}

interface BackendExamen {
  id: string;
  titulo: string;
  preguntas: BackendPregunta[];
  curso?: BackendCurso;
  _count?: { entregas: number };
}

export const ExamenPreguntasView: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [exam, setExam] = useState<BackendExamen | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    setIsLoading(true);
    fetchApi<BackendExamen>(`/api/v1/examenes/${params.id}`)
      .then((data) => setExam(data))
      .catch((err) => setLoadError(err?.message || 'No se pudo cargar el examen.'))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span className="text-sm">Cargando preguntas...</span>
      </div>
    );
  }

  if (loadError || !exam) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <p className="text-sm font-bold text-rose-300">No se pudo cargar el examen</p>
        <p className="text-xs text-slate-400">{loadError}</p>
        <button
          onClick={() => router.back()}
          className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver
        </button>
      </div>
    );
  }

  const puntajeTotal = exam.preguntas?.reduce((sum, p) => sum + (Number(p.puntajeMaximo) || 0), 0) ?? 0;
  const entregasCount = exam._count?.entregas ?? 0;
  const hasDeliveries = entregasCount > 0;
  const curso = exam.curso;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => router.push(`/examenes/${exam.id}`)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a {exam.titulo}</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            {curso && (
              <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
                {curso.materia} {curso.anio}°{curso.division}
              </span>
            )}
            <h1 className="text-2xl font-black text-white mt-2">
              PREGUNTAS - {exam.titulo}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Puntaje Total</span>
            <span className="text-lg font-black text-indigo-300">{puntajeTotal} pts</span>
          </div>
        </div>

        {hasDeliveries && (
          <div className="p-4 bg-amber-950/60 border border-amber-800/60 rounded-2xl flex items-start gap-3 text-amber-200 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">Atención: Examen con entregas registradas</p>
              <p className="text-amber-300/80">
                Este examen ya posee {entregasCount} entrega(s) recibida(s). No se pueden modificar las preguntas para mantener la consistencia académica.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4 pt-2">
          {exam.preguntas?.map((p, idx) => (
            <div
              key={p.id || idx}
              className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Pregunta N° {idx + 1}
                  {p.esEvaluacionVisual && (
                    <span className="ml-1 px-2 py-0.5 bg-violet-950 border border-violet-800/40 text-violet-300 rounded-full text-[10px]">
                      Visual
                    </span>
                  )}
                </span>
                <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                  {p.puntajeMaximo} pts max
                </span>
              </div>

              <p className="text-xs font-bold text-white leading-relaxed">{p.enunciado}</p>

              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Respuesta Esperada
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">{p.respuestaEsperada}</p>
              </div>

              {p.criteriosIA && (
                <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Criterios de corrección IA
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.criteriosIA}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
