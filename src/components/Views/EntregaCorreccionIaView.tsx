import React, { useState, useEffect } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Cpu, Award } from 'lucide-react';

export const EntregaCorreccionIaView: React.FC = () => {
  const {
    getActiveDelivery,
    getActiveExam,
    getActiveCourse,
    approveDeliveryCorrection,
    setScreen,
  } = useEvalia();

  const delivery = getActiveDelivery();
  const exam = getActiveExam();
  const course = getActiveCourse();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Local state for teacher scores per question
  const [evaluatedQuestions, setEvaluatedQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (delivery?.respuestasEvaluadas) {
      setEvaluatedQuestions(delivery.respuestasEvaluadas);
    }
  }, [delivery]);

  if (!delivery || !exam) {
    return <div className="text-center py-10 text-slate-400">Entrega no encontrada.</div>;
  }

  const currentQ = evaluatedQuestions[currentQuestionIndex] || {
    questionNumero: 1,
    consigna: '',
    respuestaEsperada: '',
    textoDetectado: '',
    comentarioIA: '',
    puntajeIA: 0,
    puntajeDocente: 0,
    puntajeMaximo: 10,
  };

  const handleScoreChange = (newScore: number) => {
    setEvaluatedQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex ? { ...q, puntajeDocente: newScore } : q
      )
    );
  };

  const totalNotaDocente = evaluatedQuestions.reduce(
    (sum, q) => sum + (Number(q.puntajeDocente) || 0),
    0
  );

  const handleApprove = () => {
    approveDeliveryCorrection(delivery.id, totalNotaDocente, evaluatedQuestions);
    setScreen('examen_detalle');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('examen_detalle')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al examen</span>
      </button>

      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
            CORRECCIÓN ASISTIDA POR IA
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            CORRECCIÓN - {delivery.studentName}
          </h1>
          <p className="text-xs text-slate-400">
            {course?.materia} &bull; {exam.titulo}
          </p>
        </div>

        <button
          onClick={handleApprove}
          className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>[ Aprobar corrección ]</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photograph Viewer (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                Fotografías del Examen ({delivery.archivos.length})
              </h2>
            </div>

            {/* Photo tabs (Hoja 1, Hoja 2...) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {delivery.archivos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    activePhotoIndex === idx
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  [ Hoja {idx + 1} ]
                </button>
              ))}
            </div>

            {/* Mock Image Display with clear handwritten simulation */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-4 min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-full text-left space-y-3 font-serif italic text-slate-300 text-xs bg-amber-950/20 p-4 border border-amber-900/30 rounded-xl leading-relaxed">
                <p className="font-sans not-italic font-bold text-[10px] uppercase text-amber-400">
                  Respuesta manuscrita en Hoja {activePhotoIndex + 1}:
                </p>
                <p className="text-slate-200">
                  "{currentQ.textoDetectado || 'Manuscrito del alumno...'}"
                </p>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Archivo: {delivery.archivos[activePhotoIndex]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Navigator & Scores (7 cols) (Wireframe 16) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            {/* Question Navigator Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Pregunta {currentQuestionIndex + 1} de {evaluatedQuestions.length}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>[ Anterior ]</span>
                </button>

                <button
                  disabled={currentQuestionIndex >= evaluatedQuestions.length - 1}
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(evaluatedQuestions.length - 1, prev + 1)
                    )
                  }
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <span>[ Siguiente ]</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Consigna */}
            <div>
              <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Consigna
              </p>
              <p className="text-xs font-bold text-white leading-relaxed">
                {currentQ.consigna}
              </p>
            </div>

            {/* Respuesta Esperada */}
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Respuesta Esperada
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.respuestaEsperada}
              </p>
            </div>

            {/* Texto Detectado (OCR/IA) */}
            <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                Texto Detectado (OCR / IA)
              </p>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{currentQ.textoDetectado}"
              </p>
            </div>

            {/* Comentario IA */}
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Comentario IA
              </p>
              <p className="text-xs text-indigo-100 leading-relaxed">
                {currentQ.comentarioIA}
              </p>
            </div>

            {/* Puntaje IA vs Puntaje Docente (Wireframe 16) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">
                  Puntaje Sugerido IA
                </p>
                <p className="text-base font-black text-indigo-300 mt-1">
                  {currentQ.puntajeIA} / {currentQ.puntajeMaximo} pts
                </p>
              </div>

              <div className="p-3 bg-indigo-950/60 border border-indigo-500/50 rounded-xl">
                <p className="text-[10px] font-bold text-indigo-300 uppercase">
                  Puntaje Docente (Editable)
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min={0}
                    max={currentQ.puntajeMaximo}
                    value={currentQ.puntajeDocente}
                    onChange={(e) => handleScoreChange(Number(e.target.value))}
                    className="w-20 bg-slate-900 border border-indigo-500/80 rounded-lg py-1 px-2 text-sm font-black text-white text-center focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-300">
                    / {currentQ.puntajeMaximo} pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Totals & Metadata Box (Wireframe 16) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              Resumen Total de Evaluación
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Nota IA</p>
                <p className="text-sm font-black text-indigo-300">{delivery.notaIA} / 100</p>
              </div>

              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl">
                <p className="text-[10px] text-emerald-400 uppercase font-semibold">Nota Docente</p>
                <p className="text-sm font-black text-emerald-200">{totalNotaDocente} / 100</p>
              </div>

              <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Tokens IA</p>
                <p className="text-xs font-bold text-slate-300">{delivery.tokensConsumidos || 3452}</p>
              </div>

              <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Modelo</p>
                <p className="text-[11px] font-bold text-indigo-300">{delivery.modeloUtilizado || 'Gemini 3.6 Flash'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
