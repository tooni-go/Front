import React from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { AlertTriangle, ArrowLeft, ChevronRight, Eye } from 'lucide-react';

export const EntregaRevisionManualView: React.FC = () => {
  const { getActiveDelivery, getActiveExam, setScreen } = useEvalia();

  const delivery = getActiveDelivery();
  const exam = getActiveExam();

  if (!delivery) {
    return <div className="text-center py-10 text-slate-400">Entrega no encontrada.</div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('examen_detalle')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a {exam?.titulo || 'examen'}</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        {/* Banner de Advertencia (Wireframe 17) */}
        <div className="p-5 bg-amber-950/80 border border-amber-800/80 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-200">
                ⚠ REVISIÓN MANUAL REQUERIDA
              </h2>
              <p className="text-xs text-amber-300/80">
                Entrega de {delivery.studentName}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-800/60 text-xs text-amber-100/90 leading-relaxed space-y-2">
            <p>
              <strong>Motivo detectado:</strong> {delivery.motivoRevision || 'Escritura ilegible / Pregunta gráfica.'}
            </p>
            <p className="text-[11px] text-amber-200/70">
              El motor de inteligencia artificial ha pausado la aprobación automática porque detectó trazos manuscritos ambiguos o diagramas gráficos que requieren la supervisión directa del docente.
            </p>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
          <p className="font-semibold text-slate-300">Resumen preliminar:</p>
          <div className="flex items-center justify-between text-slate-400 pt-1">
            <span>Fecha de Entrega:</span>
            <span className="text-white font-bold">{delivery.fechaEntrega}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Puntaje Provisorio IA:</span>
            <span className="text-indigo-400 font-bold">{delivery.notaIA} / 100</span>
          </div>
        </div>

        {/* Action button (Wireframe 17) */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setScreen('entrega_correccion_ia')}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>[ Revisar corrección ]</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
