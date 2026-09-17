'use client';

import React, { useState, useMemo } from 'react';
import { DiagnosticoPregunta } from '@/src/types/evalia';
import {
  Flame,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Search,
  BookOpen,
  Filter,
} from 'lucide-react';

interface MapaCalorPreguntasProps {
  diagnosticoPorPregunta: DiagnosticoPregunta[];
  entregasPublicadas: number;
}

type SortOption = 'error_desc' | 'acierto_desc' | 'orden';

export const MapaCalorPreguntas: React.FC<MapaCalorPreguntasProps> = ({
  diagnosticoPorPregunta,
  entregasPublicadas,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('error_desc');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Clasificación de severidad
  const getSeverity = (errorPct: number | null) => {
    if (errorPct === null || entregasPublicadas === 0) {
      return {
        level: 'neutral',
        label: 'Sin evaluar',
        border: 'border-slate-800 hover:border-slate-700',
        bg: 'bg-slate-950/60',
        badgeBg: 'bg-slate-900 text-slate-400 border-slate-700',
        accentText: 'text-slate-400',
        barColor: 'bg-slate-700',
        isAlert: false,
      };
    }
    if (errorPct >= 40) {
      return {
        level: 'critical',
        label: 'Concepto crítico a reforzar',
        border: 'border-rose-800/60 hover:border-rose-600/80 bg-rose-950/20',
        bg: 'bg-rose-950/30',
        badgeBg: 'bg-rose-950 text-rose-300 border-rose-800/60',
        accentText: 'text-rose-400',
        barColor: 'bg-rose-500',
        isAlert: true,
      };
    }
    if (errorPct >= 20) {
      return {
        level: 'warning',
        label: 'Atención pedagógica',
        border: 'border-amber-800/60 hover:border-amber-600/80 bg-amber-950/15',
        bg: 'bg-amber-950/20',
        badgeBg: 'bg-amber-950 text-amber-300 border-amber-800/60',
        accentText: 'text-amber-400',
        barColor: 'bg-amber-500',
        isAlert: false,
      };
    }
    return {
      level: 'optimal',
      label: 'Concepto consolidado',
      border: 'border-emerald-800/60 hover:border-emerald-600/80 bg-emerald-950/15',
      bg: 'bg-emerald-950/20',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-800/60',
      accentText: 'text-emerald-400',
      barColor: 'bg-emerald-500',
      isAlert: false,
    };
  };

  // Preguntas con índice original guardado
  const enrichedQuestions = useMemo(() => {
    return diagnosticoPorPregunta.map((p, index) => ({
      ...p,
      originalIndex: index + 1,
    }));
  }, [diagnosticoPorPregunta]);

  // Filtrado y ordenamiento
  const filteredAndSorted = useMemo(() => {
    let list = [...enrichedQuestions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.enunciado.toLowerCase().includes(q) ||
          `pregunta ${p.originalIndex}`.includes(q)
      );
    }

    if (sortBy === 'error_desc') {
      list.sort((a, b) => (b.porcentajeError ?? -1) - (a.porcentajeError ?? -1));
    } else if (sortBy === 'acierto_desc') {
      list.sort((a, b) => (b.porcentajeAcierto ?? -1) - (a.porcentajeAcierto ?? -1));
    } else {
      list.sort((a, b) => a.originalIndex - b.originalIndex);
    }

    return list;
  }, [enrichedQuestions, sortBy, searchQuery]);

  // Contadores de alertas
  const criticalCount = enrichedQuestions.filter(
    (p) => p.porcentajeError !== null && p.porcentajeError >= 40
  ).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Encabezado y controles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">
              Mapa de Calor de Preguntas Más Falladas
            </h2>
            {criticalCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 text-[11px] font-bold">
                {criticalCount} {criticalCount === 1 ? 'crítica' : 'críticas'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Diagnóstico específico por consigna para identificar qué temas reforzar en clase.
          </p>
        </div>

        {/* Barra de herramientas (Buscador y Orden) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar consigna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44 md:w-52 transition-all"
            />
          </div>

          {/* Selector de ordenamiento */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 ml-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs font-semibold text-slate-300 focus:outline-none pr-2 py-1 cursor-pointer"
            >
              <option value="error_desc" className="bg-slate-900 text-slate-200">
                Mayor error primero
              </option>
              <option value="acierto_desc" className="bg-slate-900 text-slate-200">
                Mayor acierto primero
              </option>
              <option value="orden" className="bg-slate-900 text-slate-200">
                Orden del examen
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de consignas / Mapa de calor */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">
            No se encontraron preguntas que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSorted.map((pregunta) => {
            const severity = getSeverity(pregunta.porcentajeError);
            const isExpanded = expandedId === pregunta.preguntaId;
            const hasScore =
              pregunta.promedioObtenido !== null && pregunta.porcentajeError !== null;

            return (
              <div
                key={pregunta.preguntaId}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${severity.border} ${severity.bg}`}
              >
                {/* Cabecera de la pregunta (siempre visible y cliqueable) */}
                <div
                  onClick={() => toggleExpand(pregunta.preguntaId)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                >
                  {/* Lado izquierdo: Número + Enunciado resumido + Badges */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-white bg-slate-900/90 border border-slate-700/60 px-2.5 py-0.5 rounded-lg">
                        Pregunta {pregunta.originalIndex}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${severity.badgeBg}`}
                      >
                        {severity.isAlert && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                        {severity.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Valor: <strong className="text-slate-200">{pregunta.puntajeMaximo} pts</strong>
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 truncate pr-2">
                      {pregunta.enunciado}
                    </p>
                  </div>

                  {/* Lado derecho: Métricas de Error/Acierto + Barra + Flecha */}
                  <div className="flex items-center gap-4 shrink-0 sm:self-center">
                    {/* Indicadores numéricos */}
                    <div className="text-right">
                      {hasScore ? (
                        <div>
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">
                              Tasa de error
                            </span>
                            <span className={`text-base font-black ${severity.accentText}`}>
                              {pregunta.porcentajeError}%
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Promedio:{' '}
                            <strong className="text-slate-200">{pregunta.promedioObtenido}</strong> /{' '}
                            {pregunta.puntajeMaximo} pts
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-semibold italic">
                          Sin corregir
                        </span>
                      )}

                      {/* Mini barra de acierto/error */}
                      {hasScore && (
                        <div className="w-32 bg-slate-900/90 rounded-full h-1.5 mt-1.5 overflow-hidden border border-slate-800 flex">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${pregunta.porcentajeAcierto}%` }}
                            title={`Acierto: ${pregunta.porcentajeAcierto}%`}
                          />
                          <div
                            className="h-full bg-rose-500"
                            style={{ width: `${pregunta.porcentajeError}%` }}
                            title={`Error: ${pregunta.porcentajeError}%`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Botón expandir */}
                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900/60 border border-slate-800 transition-colors"
                      title={isExpanded ? 'Ocultar consigna' : 'Ver consigna completa'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Acordeón expandible con consigna completa */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/70 space-y-3 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Consigna Completa</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap">
                        {pregunta.enunciado}
                      </p>
                    </div>

                    {/* Recomendación pedagógica según nivel de error */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      {pregunta.porcentajeError !== null && pregunta.porcentajeError >= 40 ? (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Sugerencia: Dedicar 10-15 min en la próxima clase para repasar esta consigna.
                        </span>
                      ) : pregunta.porcentajeError !== null && pregunta.porcentajeError >= 20 ? (
                        <span className="text-amber-400 font-medium">
                          Observación: Varios alumnos tuvieron dudas parciales en el puntaje.
                        </span>
                      ) : hasScore ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Contenido asimilado correctamente por el curso.
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">
                          Esperando publicaciones de entrega para calcular la recomendación.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
