'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Cpu, Award, Loader2, AlertCircle, RefreshCw, FileText, ExternalLink } from 'lucide-react';
import { fetchApi, getFileUrl, ApiError } from '../../lib/api';

interface UiEvaluatedQuestion {
  questionId: string;
  questionNumero: number;
  consigna: string;
  respuestaEsperada: string;
  textoDetectado: string;
  comentarioIA: string;
  puntajeIA: number;
  puntajeDocente: number;
  puntajeMaximo: number;
}

export const EntregaCorreccionIaView: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [entrega, setEntrega] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [evaluatedQuestions, setEvaluatedQuestions] = useState<UiEvaluatedQuestion[]>([]);

  const loadEntrega = async () => {
    if (!params.id) return;
    setIsLoading(true);
    setFetchError(null);

    try {
      const data = await fetchApi<any>(`/api/v1/entregas/${params.id}`);
      setEntrega(data);

      // Parse feedbackJSON si viene como string JSON o como objeto
      let feedbackObj: any = {};
      if (data.correccion?.feedbackJSON) {
        if (typeof data.correccion.feedbackJSON === 'string') {
          try {
            feedbackObj = JSON.parse(data.correccion.feedbackJSON);
          } catch (e) {
            console.warn('Error parsing feedbackJSON:', e);
          }
        } else {
          feedbackObj = data.correccion.feedbackJSON;
        }
      }

      const feedbackPreguntas: any[] = Array.isArray(feedbackObj?.preguntas)
        ? feedbackObj.preguntas
        : [];

      const examenPreguntas: any[] = data.examen?.preguntas || [];

      let mapped: UiEvaluatedQuestion[] = [];
      if (examenPreguntas.length > 0) {
        mapped = examenPreguntas.map((q: any, idx: number) => {
          const fb =
            feedbackPreguntas.find((f: any) => f.preguntaId === q.id) ||
            feedbackPreguntas[idx];
          const puntajeIA =
            typeof fb?.puntajeSugerido === 'number'
              ? fb.puntajeSugerido
              : typeof fb?.puntajeIA === 'number'
              ? fb.puntajeIA
              : (typeof data.correccion?.notaIA === 'number' && examenPreguntas.length === 1
                  ? data.correccion.notaIA
                  : 0);

          return {
            questionId: q.id || `q-${idx + 1}`,
            questionNumero: q.numero || idx + 1,
            consigna: q.enunciado || q.consigna || `Pregunta ${idx + 1}`,
            respuestaEsperada: q.respuestaEsperada || '',
            textoDetectado: fb?.textoDetectado || '',
            comentarioIA: fb?.observaciones || fb?.comentarioIA || '',
            puntajeIA,
            puntajeDocente: puntajeIA,
            puntajeMaximo: typeof q.puntajeMaximo === 'number' ? q.puntajeMaximo : 10,
          };
        });
      } else if (feedbackPreguntas.length > 0) {
        mapped = feedbackPreguntas.map((fb: any, idx: number) => {
          const puntajeIA =
            typeof fb?.puntajeSugerido === 'number'
              ? fb.puntajeSugerido
              : typeof fb?.puntajeIA === 'number'
              ? fb.puntajeIA
              : 0;

          return {
            questionId: fb.preguntaId || `q-${idx + 1}`,
            questionNumero: idx + 1,
            consigna: `Pregunta ${idx + 1}`,
            respuestaEsperada: '',
            textoDetectado: fb.textoDetectado || '',
            comentarioIA: fb.observaciones || fb.comentarioIA || '',
            puntajeIA,
            puntajeDocente: puntajeIA,
            puntajeMaximo: 10,
          };
        });
      }

      setEvaluatedQuestions(mapped);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error al cargar la entrega:', err);
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || 'Error al comunicarse con el servidor al cargar la entrega.';
      setFetchError(msg);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntrega();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4 animate-in fade-in">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Cargando evaluación de la entrega...</p>
      </div>
    );
  }

  if (fetchError || !entrega) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in fade-in">
        <div className="p-6 bg-rose-950/70 border border-rose-800 rounded-3xl space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h2 className="text-base font-bold text-white">No se pudo cargar la entrega</h2>
          <p className="text-xs text-rose-200">{fetchError || 'Entrega no encontrada en el servidor.'}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={loadEntrega}
              className="py-2 px-4 bg-rose-900/80 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar</span>
            </button>
            <button
              onClick={() => router.back()}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rawArchivos = entrega.archivos || (entrega.archivo ? [entrega.archivo] : []);
  const archivosList: string[] = rawArchivos.length > 0 ? rawArchivos : ['archivo_entrega'];
  const currentFileName = archivosList[activePhotoIndex] || '';
  const currentFileUrl = getFileUrl(currentFileName);
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(currentFileName);
  const isPdf = /\.pdf$/i.test(currentFileName);

  const studentName = entrega.alumno
    ? `${entrega.alumno.nombre} ${entrega.alumno.apellido || ''}`.trim()
    : entrega.studentName || 'Alumno';

  const exam = entrega.examen;
  const examTitle = exam?.titulo || 'Examen';
  const examId = entrega.examenId || exam?.id;

  const currentQ = evaluatedQuestions[currentQuestionIndex] || {
    questionNumero: currentQuestionIndex + 1,
    consigna: 'Consigna',
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

  const handleApprove = async () => {
    if (isApproving) return;

    setIsApproving(true);
    setApproveError(null);

    try {
      // Shape de aprobación enviado al backend
      await fetchApi(`/api/v1/entregas/${params.id}/aprobar`, {
        method: 'PUT',
        body: JSON.stringify({
          notaFinal: totalNotaDocente,
          observacionesDocente: `Aprobado por el docente. Calificación final: ${totalNotaDocente}`,
          observaciones: `Aprobado por el docente. Calificación final: ${totalNotaDocente}`,
        }),
      });

      if (examId) {
        router.push(`/examenes/${examId}`);
      } else {
        router.push('/cursos');
      }
    } catch (err: any) {
      console.error('Error al aprobar entrega:', err);
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || 'Error al comunicarse con el servidor para aprobar la corrección.';
      setApproveError(msg);
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => (examId ? router.push(`/examenes/${examId}`) : router.back())}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a {examTitle}</span>
      </button>

      {/* Error banner si falló la aprobación */}
      {approveError && (
        <div className="p-4 bg-rose-950/70 border border-rose-800/80 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{approveError}</span>
        </div>
      )}

      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
              CORRECCIÓN ASISTIDA POR IA
            </span>
            {entrega.correccion?.nivelConfianza && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                entrega.correccion.nivelConfianza === 'ALTO'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800/40'
                  : entrega.correccion.nivelConfianza === 'MEDIO'
                  ? 'bg-amber-950 text-amber-300 border-amber-800/40'
                  : 'bg-rose-950 text-rose-300 border-rose-800/40'
              }`}>
                Confianza: {entrega.correccion.nivelConfianza}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-white mt-2">
            CORRECCIÓN - {studentName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {examTitle} {entrega.alumno?.legajo ? `• Legajo: ${entrega.alumno.legajo}` : ''}
          </p>
        </div>

        <button
          onClick={handleApprove}
          disabled={isApproving}
          className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 self-start md:self-auto disabled:opacity-50"
        >
          {isApproving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Aprobando...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprobar corrección</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photograph Viewer (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                Fotografías del Examen ({archivosList.length})
              </h2>
            </div>

            {/* Photo tabs (Hoja 1, Hoja 2...) */}
            {archivosList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {archivosList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      activePhotoIndex === idx
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Hoja {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Real File / OCR Preview Display */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-4 min-h-[320px] flex flex-col items-center justify-between relative overflow-hidden">
              {currentFileUrl && isImage ? (
                <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900 flex items-center justify-center">
                  <img
                    src={currentFileUrl}
                    alt={`Hoja ${activePhotoIndex + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : currentFileUrl && isPdf ? (
                <div className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span className="truncate max-w-[180px]">{currentFileName}</span>
                  </div>
                  <a
                    href={currentFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>Abrir PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : null}

              <div className="w-full text-left space-y-2 font-serif italic text-slate-300 text-xs bg-amber-950/20 p-4 border border-amber-900/30 rounded-xl leading-relaxed">
                <p className="font-sans not-italic font-bold text-[10px] uppercase text-amber-400">
                  Respuesta manuscrita detectada en Hoja {activePhotoIndex + 1}:
                </p>
                <p className="text-slate-200">
                  &ldquo;{currentQ.textoDetectado || 'Manuscrito del alumno...'}&rdquo;
                </p>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center gap-1.5 self-start">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate max-w-[280px]">Archivo: {currentFileName}</span>
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
                Pregunta {currentQuestionIndex + 1} de {evaluatedQuestions.length || 1}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
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
                  <span>Siguiente</span>
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
            {currentQ.respuestaEsperada && (
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Respuesta Esperada
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQ.respuestaEsperada}
                </p>
              </div>
            )}

            {/* Texto Detectado (OCR/IA) */}
            <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                Texto Detectado (OCR / IA)
              </p>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                &ldquo;{currentQ.textoDetectado || 'No se detectó texto para esta pregunta'}&rdquo;
              </p>
            </div>

            {/* Comentario IA */}
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Comentario IA
              </p>
              <p className="text-xs text-indigo-100 leading-relaxed">
                {currentQ.comentarioIA || 'Corrección evaluada automáticamente por el motor de IA.'}
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
                <p className="text-sm font-black text-indigo-300">{entrega.correccion?.notaIA ?? 0} pts</p>
              </div>

              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl">
                <p className="text-[10px] text-emerald-400 uppercase font-semibold">Nota Docente</p>
                <p className="text-sm font-black text-emerald-200">{totalNotaDocente} pts</p>
              </div>

              <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Confianza</p>
                <p className="text-xs font-bold text-slate-300">{entrega.correccion?.nivelConfianza || 'MEDIO'}</p>
              </div>

              <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Estado</p>
                <p className="text-[11px] font-bold text-indigo-300">{entrega.estado || 'PENDIENTE_APROBACION'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

