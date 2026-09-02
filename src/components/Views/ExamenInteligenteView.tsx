'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvalia } from '../../context/EvaliaContext';
import { fetchApi, ApiError } from '../../lib/api';
import {
  Sparkles,
  Upload,
  ArrowLeft,
  Loader2,
  AlertCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface BackendQuestion {
  enunciado: string;
  respuestaEsperada: string;
  puntajeMaximo: number;
  criteriosIA?: string;
  esEvaluacionVisual?: boolean;
}

interface BackendExamResponse {
  titulo: string;
  criteriosIA?: string;
  preguntas: BackendQuestion[];
}

interface TextExtractionResponse {
  textoExtraido: string;
  fuenteTipo: string;
  requiereRevision: boolean;
}

export const ExamenInteligenteView: React.FC = () => {
  const { setPendingGeneratedExam, getCourseById, getExamById } = useEvalia();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const exam = getExamById(params.id);
  const course = getCourseById(exam?.courseId || params.id);
  const wizardId = course?.id || params.id;

  const [modo, setModo] = useState<'texto' | 'archivo'>('texto');
  const [textoExamen, setTextoExamen] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    'Analizando con IA y generando preguntas...'
  );
  const [error, setError] = useState<string | null>(null);
  const [avisoRevision, setAvisoRevision] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setAvisoRevision(null);
    }
  };

  const handleGenerateExam = async () => {
    if (modo === 'texto' && !textoExamen.trim()) return;
    if (modo === 'archivo' && !selectedFile) return;

    setIsGenerating(true);
    setError(null);
    setAvisoRevision(null);

    try {
      let textoParaGenerar = '';
      let huboAvisoRevision = false;

      if (modo === 'archivo') {
        if (!selectedFile) return;

        setLoadingMessage('Extrayendo texto del documento...');
        const formData = new FormData();
        formData.append('file', selectedFile);

        const extraction = await fetchApi<TextExtractionResponse>(
          '/api/v1/documentos/extraer-texto',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!extraction.textoExtraido || !extraction.textoExtraido.trim()) {
          throw new Error(
            'No se pudo extraer texto legible del documento subido. Por favor verifique el archivo o pruebe pegando el texto directamente.'
          );
        }

        textoParaGenerar = extraction.textoExtraido;
        huboAvisoRevision = Boolean(extraction.requiereRevision);

        if (huboAvisoRevision) {
          setAvisoRevision(
            'El texto fue extraído por IA y puede contener errores. Podrás revisarlo en el siguiente paso.'
          );
        }
      } else {
        textoParaGenerar = textoExamen.trim();
      }

      setLoadingMessage('Analizando con IA y generando preguntas...');

      const result = await fetchApi<BackendExamResponse>(
        '/api/v1/examenes/generar',
        {
          method: 'POST',
          body: JSON.stringify({ texto: textoParaGenerar }),
        }
      );

      if (!result || !result.preguntas || result.preguntas.length === 0) {
        throw new Error(
          'El contenido provisto no tiene material pedagógico suficiente para generar un examen. Ingrese un temario o consignas más detalladas.'
        );
      }

      // Mapeo de campos Backend (enunciado, criteriosIA) -> Frontend (consigna, criteriosIA)
      setPendingGeneratedExam({
        courseId: course?.id,
        titulo: result.titulo || 'Examen Generado por IA',
        fecha: new Date().toLocaleDateString('es-ES'),
        criteriosIA: result.criteriosIA || '',
        requiereRevisionAviso: huboAvisoRevision,
        preguntas: result.preguntas.map((p, idx) => ({
          id: `q-gen-${idx + 1}`,
          numero: idx + 1,
          consigna: p.enunciado,
          respuestaEsperada: p.respuestaEsperada,
          puntajeMaximo: p.puntajeMaximo,
          criteriosIA: p.criteriosIA || '',
          esEvaluacionVisual: p.esEvaluacionVisual ?? false,
        })),
      });

      setIsGenerating(false);
      router.push(`/examenes/${wizardId}/revision`);
    } catch (err: any) {
      console.error('Error al generar examen:', err);
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message ||
            'No se pudo generar el examen con los servicios de IA disponibles. Por favor, intente nuevamente.';
      setError(msg);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => router.push(`/examenes/${wizardId}/metodo`)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Cambiar método de creación</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">
              CARGA INTELIGENTE DE EXAMEN
            </h1>
            <p className="text-xs text-slate-400">
              {course
                ? `${course.materia} ${course.anio}${course.division}`
                : 'Evaluación'}
            </p>
          </div>
        </div>

        {/* Mensaje de Error Visible con Reintento */}
        {error && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-start gap-3 text-rose-200 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-300">No se pudo generar el examen</p>
              <p className="text-slate-300">{error}</p>
            </div>
          </div>
        )}

        {/* Aviso de revisión cuando es PDF/imagen OCR */}
        {avisoRevision && (
          <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-2xl flex items-start gap-3 text-amber-200 text-xs animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>{avisoRevision}</p>
          </div>
        )}

        {/* Selector de Modo */}
        <div className="flex items-center gap-6 text-xs font-bold text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="modoInteligente"
              checked={modo === 'texto'}
              onChange={() => {
                setModo('texto');
                setError(null);
              }}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>( ) Pegar texto del examen</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="modoInteligente"
              checked={modo === 'archivo'}
              onChange={() => {
                setModo('archivo');
                setError(null);
              }}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>( ) Subir archivo (.docx, .pdf, .txt, imagen)</span>
          </label>
        </div>

        {/* Contenido según el modo */}
        {modo === 'texto' ? (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Copie y pegue aquí el documento completo del examen o temario:
            </label>
            <textarea
              rows={8}
              value={textoExamen}
              onChange={(e) => {
                setTextoExamen(e.target.value);
                if (error) setError(null);
              }}
              placeholder="1) Defina qué es el ciclo del agua...&#10;Respuesta esperada: Es el proceso de transformación y circulación...&#10;&#10;2) Mencione los estados de la materia...&#10;Respuesta esperada: Sólido, líquido, gaseoso y plasma."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Seleccione el archivo del examen:
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-8 text-center bg-slate-950/60 transition-colors">
              <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <p className="text-xs font-bold text-white mb-1">
                {selectedFile
                  ? selectedFile.name
                  : 'Haga clic para seleccionar o arrastre un archivo'}
              </p>
              <p className="text-[11px] text-slate-500">
                Formatos soportados: .pdf, .docx, .txt, .png, .jpg, .webp
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
                id="exam-file-input"
              />
              <label
                htmlFor="exam-file-input"
                className="mt-4 inline-block py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer border border-slate-700 transition-colors"
              >
                {selectedFile ? 'Cambiar archivo' : 'Buscar archivo'}
              </label>
            </div>
          </div>
        )}

        {/* Botón de Acción */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleGenerateExam}
            disabled={
              isGenerating ||
              (modo === 'texto' && !textoExamen.trim()) ||
              (modo === 'archivo' && !selectedFile)
            }
            className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{loadingMessage}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar examen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
