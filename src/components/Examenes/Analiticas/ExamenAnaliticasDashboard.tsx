'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/src/lib/api';
import { ExamenMetricasResponse } from '@/src/types/evalia';
import { ExamenMetricasKpis } from './ExamenMetricasKpis';
import { CurvaCalificaciones } from './CurvaCalificaciones';
import { MapaCalorPreguntas } from './MapaCalorPreguntas';
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
  Upload,
  FileText,
  BarChart3,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface ExamenAnaliticasDashboardProps {
  examenId: string;
  onGoToDeliveries?: () => void;
  onUploadDelivery?: () => void;
}

export const ExamenAnaliticasDashboard: React.FC<ExamenAnaliticasDashboardProps> = ({
  examenId,
  onGoToDeliveries,
  onUploadDelivery,
}) => {
  const [metricas, setMetricas] = useState<ExamenMetricasResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetricas = useCallback(async () => {
    if (!examenId) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchApi<ExamenMetricasResponse>(
        `/api/v1/examenes/${examenId}/metricas`
      );
      setMetricas(data);
    } catch (err: any) {
      setError(
        err?.message ||
          'No se pudieron obtener las métricas del examen. Verifica la conexión con el servidor.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [examenId]);

  useEffect(() => {
    loadMetricas();
  }, [loadMetricas]);

  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div className="h-3 w-24 bg-slate-800 rounded" />
              <div className="h-8 w-20 bg-slate-800 rounded my-2" />
              <div className="h-2 w-full bg-slate-800 rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton Curva y Heatmap */}
        <div className="space-y-6">
          <div className="h-64 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6" />
          <div className="h-96 bg-slate-900 border border-slate-800 rounded-3xl p-6" />
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !metricas) {
    return (
      <div className="bg-slate-900 border border-rose-900/40 rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Error al cargar analíticas</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
        </div>
        <button
          onClick={loadMetricas}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  // Empty state pedagógico: sin entregas publicadas aún
  const hasPublicadas = metricas.entregasPublicadas > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Barra de estado superior del dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Diagnóstico Pedagógico y Rendimiento
            </h2>
            <p className="text-[11px] text-slate-400">
              {hasPublicadas
                ? `${metricas.entregasPublicadas} de ${metricas.totalAlumnos} entregas consolidadas`
                : 'Esperando publicaciones de entrega para consolidar estadísticas'}
            </p>
          </div>
        </div>

        <button
          onClick={loadMetricas}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl text-xs font-semibold transition-all self-start sm:self-auto"
          title="Actualizar métricas"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Banner de estado vacío pedagógico si no hay publicaciones */}
      {!hasPublicadas && (
        <div className="bg-slate-900/90 border border-indigo-900/40 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-3xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
            <Flame className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">
              Analíticas listas para cuando publiques correcciones
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Las métricas consolidadas, la curva de calificaciones y el mapa de calor de preguntas más falladas se calcularán automáticamente cuando al menos una entrega esté en estado <strong className="text-emerald-400">Publicado</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onGoToDeliveries && (
              <button
                onClick={onGoToDeliveries}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Ver lista de entregas</span>
              </button>
            )}
            {onUploadDelivery && (
              <button
                onClick={onUploadDelivery}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Cargar nueva entrega</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. Tarjetas de KPIs */}
      <ExamenMetricasKpis metricas={metricas} />

      {/* 2. Curva de Calificaciones */}
      <CurvaCalificaciones metricas={metricas} />

      {/* 3. Mapa de Calor de Preguntas */}
      <MapaCalorPreguntas
        diagnosticoPorPregunta={metricas.diagnosticoPorPregunta}
        entregasPublicadas={metricas.entregasPublicadas}
      />
    </div>
  );
};
