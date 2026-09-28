'use client';

import React from 'react';
import { ExamenMetricasResponse } from '@/src/types/evalia';
import {
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  AlertCircle,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface ExamenMetricasKpisProps {
  metricas: ExamenMetricasResponse;
}

export const ExamenMetricasKpis: React.FC<ExamenMetricasKpisProps> = ({ metricas }) => {
  const {
    totalAlumnos,
    entregasPublicadas,
    notaPromedio,
    notaMaxima,
    notaMinima,
    porcentajeAprobacion,
    puntajeTotalExamen,
  } = metricas;

  const hasPublicadas = entregasPublicadas > 0;
  const coberturaPorcentaje =
    totalAlumnos > 0 ? Math.round((entregasPublicadas / totalAlumnos) * 100) : 0;

  // Determinar color de tasa de aprobación
  const getAprobacionBadge = (pct: number | null) => {
    if (pct === null) {
      return {
        bg: 'bg-slate-800 text-slate-400 border-slate-700',
        label: 'Sin datos',
        color: 'text-slate-400',
      };
    }
    if (pct >= 70) {
      return {
        bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50',
        label: 'Rendimiento Alto',
        color: 'text-emerald-400',
      };
    }
    if (pct >= 50) {
      return {
        bg: 'bg-amber-950/80 text-amber-300 border-amber-800/50',
        label: 'Rendimiento Medio',
        color: 'text-amber-400',
      };
    }
    return {
      bg: 'bg-rose-950/80 text-rose-300 border-rose-800/50',
      label: 'Rendimiento Crítico',
      color: 'text-rose-400',
    };
  };

  const aprobacionBadge = getAprobacionBadge(porcentajeAprobacion);

  // Porcentaje promedio sobre el puntaje total
  const promedioRelativo =
    notaPromedio !== null && puntajeTotalExamen > 0
      ? Math.round((notaPromedio / puntajeTotalExamen) * 100)
      : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Tasa de Aprobación */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tasa de Aprobación
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                porcentajeAprobacion !== null ? aprobacionBadge.color : 'text-slate-500'
              }`}
            >
              {porcentajeAprobacion !== null ? `${porcentajeAprobacion}%` : '—'}
            </span>
            {porcentajeAprobacion !== null && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${aprobacionBadge.bg}`}
              >
                {aprobacionBadge.label}
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Umbral: ≥ 60%</span>
          <span>{hasPublicadas ? `${entregasPublicadas} calificados` : 'Sin corregir'}</span>
        </div>
      </div>

      {/* KPI 2: Nota Promedio */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Nota Promedio
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">
              {notaPromedio !== null ? notaPromedio : '—'}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              / {puntajeTotalExamen} pts
            </span>
          </div>

          {promedioRelativo !== null && (
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  promedioRelativo >= 70
                    ? 'bg-emerald-500'
                    : promedioRelativo >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(promedioRelativo, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Rendimiento relativo</span>
          <span className="font-semibold text-slate-400">
            {promedioRelativo !== null ? `${promedioRelativo}% del total` : 'Sin datos'}
          </span>
        </div>
      </div>

      {/* KPI 3: Rango de Calificaciones (Min / Max) */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Rango de Notas
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <BarChart2 className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          {hasPublicadas && notaMinima !== null && notaMaxima !== null ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Mínima</p>
                  <p className="text-sm font-black text-rose-300">{notaMinima} pts</p>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Máxima</p>
                  <p className="text-sm font-black text-emerald-300">{notaMaxima} pts</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-500">—</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Amplitud</span>
          <span className="font-semibold text-slate-400">
            {hasPublicadas && notaMinima !== null && notaMaxima !== null
              ? `${Math.round((notaMaxima - notaMinima) * 10) / 10} pts`
              : 'Sin datos'}
          </span>
        </div>
      </div>

      {/* KPI 4: Cobertura de Corrección */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Cobertura Corrección
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{entregasPublicadas}</span>
            <span className="text-xs font-semibold text-slate-500">
              de {totalAlumnos} alumnos
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${Math.min(coberturaPorcentaje, 100)}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Estado del curso</span>
          <span className="font-bold text-indigo-300">{coberturaPorcentaje}% corregido</span>
        </div>
      </div>
    </div>
  );
};
