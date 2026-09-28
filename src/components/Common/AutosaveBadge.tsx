'use client';

import React from 'react';
import { Cloud, CheckCircle2, Loader2, WifiOff } from 'lucide-react';

export interface AutosaveBadgeProps {
  lastSavedAt: Date | null;
  isSaving?: boolean;
  isOnline?: boolean;
  className?: string;
}

export const AutosaveBadge: React.FC<AutosaveBadgeProps> = ({
  lastSavedAt,
  isSaving = false,
  isOnline = true,
  className = '',
}) => {
  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // 1. Estado Offline (Sin conexión a internet)
  if (!isOnline) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-950/70 border border-amber-800/80 text-amber-300 shadow-sm transition-all duration-200 select-none ${className}`}
        title="No hay conexión a internet. Los cambios se conservan a salvo en el almacenamiento de este navegador."
      >
        <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Sin conexión - Cambios guardados en este equipo</span>
      </div>
    );
  }

  // 2. Estado Guardando
  if (isSaving) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 border border-slate-800 text-slate-400 shadow-sm transition-all duration-200 select-none ${className}`}
      >
        <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
        <span>Guardando borrador...</span>
      </div>
    );
  }

  // 3. Estado Guardado con timestamp
  if (lastSavedAt) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 border border-slate-800 text-slate-400 shadow-sm transition-all duration-200 select-none ${className}`}
        title={`Último autoguardado: ${lastSavedAt.toLocaleString('es-ES')}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          Borrador guardado localmente{' '}
          <strong className="text-slate-300 font-semibold">[{formatTime(lastSavedAt)}]</strong>
        </span>
      </div>
    );
  }

  // 4. Estado inicial / Neutro
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/60 border border-slate-800/60 text-slate-500 shadow-sm transition-all duration-200 select-none ${className}`}
    >
      <Cloud className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span>Autoguardado activo</span>
    </div>
  );
};
