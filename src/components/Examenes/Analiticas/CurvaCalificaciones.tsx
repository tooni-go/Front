'use client';

import React from 'react';
import { ExamenMetricasResponse } from '@/src/types/evalia';
import { Award, Info, Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CurvaCalificacionesProps {
  metricas: ExamenMetricasResponse;
}

export const CurvaCalificaciones: React.FC<CurvaCalificacionesProps> = ({ metricas }) => {
  const {
    notaPromedio,
    notaMaxima,
    notaMinima,
    porcentajeAprobacion,
    puntajeTotalExamen,
    entregasPublicadas,
  } = metricas;

  const hasData = entregasPublicadas > 0 && notaPromedio !== null;
  const umbralAprobacion = Math.round(puntajeTotalExamen * 0.6 * 10) / 10;

  // Cálculo de posición porcentual en el eje 0 - puntajeTotal
  const getPositionPercent = (val: number | null) => {
    if (val === null || puntajeTotalExamen <= 0) return 0;
    return Math.min(Math.max((val / puntajeTotalExamen) * 100, 0), 100);
  };

  const umbralPos = getPositionPercent(umbralAprobacion);
  const promedioPos = getPositionPercent(notaPromedio);
  const minPos = getPositionPercent(notaMinima);
  const maxPos = getPositionPercent(notaMaxima);

  // Insights pedagógicos
  const getPedagogicInsight = () => {
    if (!hasData) {
      return {
        title: 'Sin datos consolidados',
        desc: 'Se requiere publicar correcciones para generar el diagnóstico de rendimiento.',
        icon: Info,
        color: 'text-slate-400',
        bg: 'bg-slate-900 border-slate-800',
      };
    }
    if (porcentajeAprobacion !== null && porcentajeAprobacion >= 75) {
      return {
        title: 'Excelente desempeño global',
        desc: `El ${porcentajeAprobacion}% del curso superó el umbral de aprobación con un promedio de ${notaPromedio} pts.`,
        icon: Sparkles,
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/40 border-emerald-800/40',
      };
    }
    if (porcentajeAprobacion !== null && porcentajeAprobacion >= 50) {
      return {
        title: 'Rendimiento aceptable con focos de mejora',
        desc: `La mayoría del curso aprobó (${porcentajeAprobacion}%), pero la dispersión sugiere reforzar conceptos específicos.`,
        icon: CheckCircle2,
        color: 'text-amber-400',
        bg: 'bg-amber-950/40 border-amber-800/40',
      };
    }
    return {
      title: 'Atención pedagógica requerida',
      desc: `Más del 50% del curso no alcanzó el umbral mínimo (${umbralAprobacion} pts). Revisar temas más fallados.`,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/40',
    };
  };

  const insight = getPedagogicInsight();
  const InsightIcon = insight.icon;

  return (
    <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-6 shadow-md space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/70">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Curva de Rendimiento y Umbral de Aprobación
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Distribución de notas respecto al puntaje total del examen ({puntajeTotalExamen} pts)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800/50 text-indigo-300 font-semibold">
            Umbral mínimo: {umbralAprobacion} pts (60%)
          </span>
        </div>
      </div>

      {/* Insight pedagógico banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${insight.bg}`}>
        <InsightIcon className={`w-5 h-5 shrink-0 mt-0.5 ${insight.color}`} />
        <div className="space-y-0.5">
          <h4 className={`text-xs font-bold ${insight.color}`}>{insight.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{insight.desc}</p>
        </div>
      </div>

      {/* Gráfico visual de distribución y curva (SVG Nativo + Tailwind) */}
      <div className="space-y-4 pt-2">
        <div className="relative pt-6 pb-2">
          {/* SVG de la curva de campana / distribución adaptada */}
          <div className="w-full h-24 overflow-hidden">
            <svg
              viewBox="0 0 500 100"
              preserveAspectRatio="none"
              className="w-full h-full text-indigo-500/20"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                  <stop offset={`${umbralPos}%`} stopColor="#f43f5e" stopOpacity="0.15" />
                  <stop offset={`${umbralPos}%`} stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset={`${umbralPos}%`} stopColor="#f43f5e" />
                  <stop offset={`${umbralPos}%`} stopColor="#10b981" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>

              {/* Área bajo la curva estimada */}
              <path
                d={
                  hasData
                    ? `M 0,95 Q ${Math.max(promedioPos * 5 - 50, 50)},${Math.max(
                        80 - (promedioPos / 100) * 60,
                        15
                      )} ${promedioPos * 5},${Math.max(
                        20,
                        90 - (porcentajeAprobacion || 50) * 0.7
                      )} T 500,95 L 500,100 L 0,100 Z`
                    : 'M 0,90 Q 250,30 500,90 L 500,100 L 0,100 Z'
                }
                fill="url(#curveGradient)"
              />

              {/* Trazo de la curva */}
              <path
                d={
                  hasData
                    ? `M 0,95 Q ${Math.max(promedioPos * 5 - 50, 50)},${Math.max(
                        80 - (promedioPos / 100) * 60,
                        15
                      )} ${promedioPos * 5},${Math.max(
                        20,
                        90 - (porcentajeAprobacion || 50) * 0.7
                      )} T 500,95`
                    : 'M 0,90 Q 250,30 500,90'
                }
                fill="none"
                stroke="url(#strokeGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Línea vertical del Umbral de Aprobación */}
              <line
                x1={`${umbralPos * 5}`}
                y1="0"
                x2={`${umbralPos * 5}`}
                y2="100"
                stroke="#e11d48"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.8"
              />

              {/* Línea vertical del Promedio */}
              {hasData && (
                <line
                  x1={`${promedioPos * 5}`}
                  y1="0"
                  x2={`${promedioPos * 5}`}
                  y2="100"
                  stroke="#818cf8"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          {/* Barra de eje con bandas cromáticas */}
          <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
            {/* Zona No Aprobado (< 60%) */}
            <div
              className="h-full bg-gradient-to-r from-rose-950 to-rose-900/60 border-r border-rose-700/50"
              style={{ width: `${umbralPos}%` }}
              title="Zona No Aprobada (< 60%)"
            />
            {/* Zona Aprobado Regular (60% - 80%) */}
            <div
              className="h-full bg-gradient-to-r from-amber-950/60 to-emerald-950/60 border-r border-slate-700/50"
              style={{ width: `${Math.max(getPositionPercent(puntajeTotalExamen * 0.8) - umbralPos, 0)}%` }}
              title="Zona Aprobada Regular (60% - 80%)"
            />
            {/* Zona Sobresaliente (> 80%) */}
            <div
              className="h-full bg-gradient-to-r from-emerald-950/60 to-indigo-950"
              style={{ width: `${100 - getPositionPercent(puntajeTotalExamen * 0.8)}%` }}
              title="Zona Sobresaliente (> 80%)"
            />
          </div>

          {/* Marcador del Promedio sobre el eje */}
          {hasData && (
            <div
              className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
              style={{ left: `${promedioPos}%` }}
            >
              <div className="px-2 py-0.5 bg-indigo-600 text-white font-black text-[10px] rounded-md shadow-lg shadow-indigo-600/50 whitespace-nowrap flex items-center gap-1 border border-indigo-400/30 animate-pulse">
                <span>Promedio: {notaPromedio} pts</span>
              </div>
              <div className="w-2 h-2 bg-indigo-600 rotate-45 -mt-1" />
            </div>
          )}

          {/* Marcador del Umbral 60% */}
          <div
            className="absolute top-12 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${umbralPos}%` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="text-[9px] font-bold text-rose-400/90 whitespace-nowrap mt-1">
              60% ({umbralAprobacion} pts)
            </span>
          </div>
        </div>

        {/* Eje de valores inferior */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold px-1 pt-4">
          <span>0 pts (0%)</span>
          {hasData && notaMinima !== null && (
            <span className="text-slate-400">Mín: {notaMinima} pts</span>
          )}
          {hasData && notaMaxima !== null && (
            <span className="text-slate-400">Máx: {notaMaxima} pts</span>
          )}
          <span>{puntajeTotalExamen} pts (100%)</span>
        </div>
      </div>
    </div>
  );
};
