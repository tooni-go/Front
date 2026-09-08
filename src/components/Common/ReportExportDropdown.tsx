'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { downloadReport, ReportType, ReportFormat } from '@/src/lib/reportes';

export interface ReportExportDropdownProps {
  type: ReportType;
  id: string;
  label?: string;
  pdfLabel?: string;
  pdfDescription?: string;
  csvLabel?: string;
  csvDescription?: string;
  disabled?: boolean;
  disabledReason?: string;
  align?: 'left' | 'right';
  className?: string;
}

export const ReportExportDropdown: React.FC<ReportExportDropdownProps> = ({
  type,
  id,
  label = 'Exportar',
  pdfLabel = 'Descargar PDF',
  pdfDescription = 'Planilla tabular para imprimir',
  csvLabel = 'Descargar CSV',
  csvDescription = 'Compatible con Excel / planillas',
  disabled = false,
  disabledReason,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<ReportFormat | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showFeedback = useCallback((type: 'success' | 'error', message: string) => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setFeedback({ type, message });
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
    }, 4500);
  }, []);

  // Cerrar dropdown al hacer clic fuera o al presionar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const handleDownload = async (format: ReportFormat) => {
    if (loadingFormat || disabled) return;

    setLoadingFormat(format);
    setFeedback(null);

    try {
      const filename = await downloadReport({
        type,
        id,
        format,
      });
      showFeedback('success', `Archivo descargado: ${filename}`);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error al exportar reporte:', error);
      const msg = error?.message || 'No se pudo generar el archivo de reporte.';
      showFeedback('error', msg);
    } finally {
      setLoadingFormat(null);
    }
  };

  const isDownloading = loadingFormat !== null;

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Botón principal trigger */}
      <button
        type="button"
        onClick={() => !disabled && !isDownloading && setIsOpen((prev) => !prev)}
        disabled={disabled || isDownloading}
        title={disabled && disabledReason ? disabledReason : undefined}
        className={`py-2.5 px-4 font-bold text-xs rounded-xl border transition-all flex items-center gap-2 select-none ${
          disabled
            ? 'bg-slate-800/50 text-slate-500 border-slate-800 cursor-not-allowed'
            : isDownloading
            ? 'bg-slate-800 text-slate-300 border-slate-700 cursor-wait'
            : isOpen
            ? 'bg-slate-700 text-white border-indigo-500/50 shadow-lg shadow-indigo-950/40'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700 shadow-sm'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
        ) : (
          <Download className="w-4 h-4 text-indigo-400 shrink-0" />
        )}
        <span>{isDownloading ? 'Generando...' : label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div
          role="menu"
          className={`absolute mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="px-3 py-1.5 border-b border-slate-800/80 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Formato de Exportación
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold">
              {type === 'curso' ? 'Curso' : 'Examen'}
            </span>
          </div>

          {/* Opción PDF */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleDownload('pdf')}
            disabled={isDownloading}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3 group focus:outline-none focus:bg-slate-800"
          >
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-400 group-hover:scale-105 group-hover:bg-rose-900/50 transition-all shrink-0">
              {loadingFormat === 'pdf' ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-300" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                  {pdfLabel}
                </span>
                <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/30">
                  PDF
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{pdfDescription}</p>
            </div>
          </button>

          {/* Opción CSV */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleDownload('csv')}
            disabled={isDownloading}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3 group focus:outline-none focus:bg-slate-800 mt-1"
          >
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-900/50 transition-all shrink-0">
              {loadingFormat === 'csv' ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                  {csvLabel}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/30">
                  CSV
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{csvDescription}</p>
            </div>
          </button>
        </div>
      )}

      {/* Notificación flotante de feedback (éxito o error) */}
      {feedback && (
        <div
          role="status"
          className={`absolute top-full mt-2 z-50 flex items-center gap-2 px-3 py-2 rounded-xl text-xs shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200 min-w-[260px] max-w-sm ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${
            feedback.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-800/60'
              : 'bg-rose-950/95 text-rose-200 border-rose-800/60'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="flex-1 text-[11px] font-medium leading-tight line-clamp-2">
            {feedback.message}
          </span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors shrink-0"
            title="Cerrar notificación"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
