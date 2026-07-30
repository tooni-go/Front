import React from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { FileText, Calendar, HelpCircle, Award, Upload, Eye, CheckCircle2, Clock, AlertTriangle, ArrowLeft, ChevronRight } from 'lucide-react';

export const ExamenDetalleView: React.FC = () => {
  const {
    getActiveExam,
    getActiveCourse,
    getExamDeliveries,
    setScreen,
    setActiveDeliveryId,
  } = useEvalia();

  const exam = getActiveExam();
  const course = getActiveCourse();

  if (!exam || !course) {
    return (
      <div className="text-center py-10 text-slate-400">
        Examen no encontrado.
      </div>
    );
  }

  const deliveries = getExamDeliveries(exam.id);

  const handleOpenDelivery = (deliveryId: string, estado: string) => {
    setActiveDeliveryId(deliveryId);
    if (estado === 'Revisión') {
      setScreen('entrega_revision_manual');
    } else {
      setScreen('entrega_correccion_ia');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('curso_detalle')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a {course.materia} {course.anio}{course.division}</span>
      </button>

      {/* Header Info Banner (Wireframe 9) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
              {course.materia} - {course.anio}{course.division}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
              {exam.titulo}
            </h1>
          </div>

          {/* Action buttons (Wireframe 9) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setScreen('examen_preguntas')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>[ Ver preguntas ]</span>
            </button>

            <button
              onClick={() => setScreen('entrega_nueva')}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>[ Nueva entrega ]</span>
            </button>
          </div>
        </div>

        {/* Exam Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Fecha</p>
              <p className="text-xs font-bold text-white">{exam.fecha}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Preguntas</p>
              <p className="text-xs font-bold text-white">{exam.preguntasCount}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
            <Award className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Puntaje Total</p>
              <p className="text-xs font-bold text-white">{exam.puntajeTotal} pts</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Entregas</p>
              <p className="text-xs font-bold text-indigo-300">{deliveries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deliveries List (Wireframe 9) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Últimas entregas ({deliveries.length})
          </h2>

          <button
            onClick={() => setScreen('entrega_nueva')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Cargar Nueva Entrega</span>
          </button>
        </div>

        {deliveries.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-xs text-slate-500 italic">No se han registrado entregas para este examen aún.</p>
            <button
              onClick={() => setScreen('entrega_nueva')}
              className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Cargar primera entrega
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{delivery.studentName}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Fecha entrega: {delivery.fechaEntrega}</span>
                    <span>&bull;</span>
                    <span>Nota Docente: <strong className="text-white">{delivery.notaDocente}</strong>/100</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Badges */}
                  {delivery.estado === 'Publicada' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/40 rounded-full text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ✔ Publicada
                    </span>
                  )}

                  {delivery.estado === 'Pendiente' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800/40 rounded-full text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      ⏳ Pendiente
                    </span>
                  )}

                  {delivery.estado === 'Revisión' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800/40 rounded-full text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      ⚠ Revisión
                    </span>
                  )}

                  <button
                    onClick={() => handleOpenDelivery(delivery.id, delivery.estado)}
                    className="py-2 px-3.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <span>[ Abrir ]</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
