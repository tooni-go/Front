'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Sparkles, Image, FileSearch, Cpu, CheckSquare, AlertTriangle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { fetchApi, ApiError } from '../../lib/api';

export const EntregaProcesandoView: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  const steps = [
    { title: 'Analizando imágenes...', icon: <Image className="w-5 h-5" /> },
    { title: 'Detectando texto con OCR...', icon: <FileSearch className="w-5 h-5" /> },
    { title: 'Comparando respuestas con clave de corrección...', icon: <Cpu className="w-5 h-5" /> },
    { title: 'Generando sugerencia de puntuación con IA...', icon: <CheckSquare className="w-5 h-5" /> },
  ];

  // Decorative steps animation
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    const elapsedTimer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stepTimer);
      clearInterval(elapsedTimer);
    };
  }, [steps.length]);

  // Real backend polling
  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      if (!params.id) return;

      try {
        const entrega = await fetchApi<{
          id: string;
          estado: 'PENDIENTE' | 'PROCESANDO' | 'REQUIERE_REVISION' | 'PENDIENTE_APROBACION' | 'PUBLICADO' | string;
        }>(`/api/v1/entregas/${params.id}`);

        if (!isMounted) return;

        // Reset error count on successful communication
        setErrorMessage(null);
        setErrorCount(0);

        if (
          entrega.estado === 'REQUIERE_REVISION' ||
          entrega.estado === 'PENDIENTE_APROBACION' ||
          entrega.estado === 'PUBLICADO'
        ) {
          if (pollInterval) clearInterval(pollInterval);
          router.push(`/entregas/${params.id}/correccion-ia`);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error durante polling de entrega:', err);

        setErrorCount((prev) => {
          const newCount = prev + 1;
          // If 3 consecutive failures, show error to avoid infinite silent errors
          if (newCount >= 3) {
            const msg =
              err instanceof ApiError
                ? err.message
                : err?.message || 'Error de conexión con el servidor al verificar el estado de la entrega.';
            setErrorMessage(msg);
          }
          return newCount;
        });
      }
    };

    // Execute immediately on mount
    checkStatus();

    // Poll every 2 seconds
    pollInterval = setInterval(checkStatus, 2000);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [params.id, router]);

  const isTakingTooLong = elapsedSeconds >= 60;

  const handleRetry = () => {
    setErrorMessage(null);
    setErrorCount(0);
    setElapsedSeconds(0);
  };

  return (
    <div className="max-w-md mx-auto py-12 text-center space-y-8 animate-in fade-in duration-300">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
        <div className="absolute top-0 right-0 p-1 bg-indigo-600 rounded-full text-white shadow-lg">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-white">PROCESANDO ENTREGA</h1>
        <p className="text-xs text-indigo-300">
          Evaluando examen escrito con el motor de IA...
        </p>
      </div>

      {/* Warning if taking too long (>= 60s) */}
      {isTakingTooLong && !errorMessage && (
        <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-2xl text-left space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Esto está tardando más de lo esperado...</span>
          </div>
          <p className="text-[11px] text-amber-200/80 leading-relaxed">
            El modelo de IA está analizando los manuscritos o resolviendo un fallback. El proceso sigue en curso en segundo plano.
          </p>
        </div>
      )}

      {/* Network / Server Error message */}
      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-left space-y-3">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Error al consultar el estado</span>
          </div>
          <p className="text-[11px] text-rose-200 leading-relaxed">
            {errorMessage}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleRetry}
              className="py-1.5 px-3 bg-rose-900/80 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar</span>
            </button>
            <button
              onClick={() => router.back()}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Steps List (Wireframe 15) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left space-y-3 shadow-xl">
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-indigo-950/60 border-indigo-500/50 text-white font-bold'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0" />
              )}

              <span className="text-xs font-semibold">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

