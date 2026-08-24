'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, Image as ImageIcon, FileText, Camera, Trash2, ArrowLeft, Send, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchApi, ApiError } from '../../lib/api';

// Estos valores deben coincidir con MAX_UPLOAD_SIZE_MB y SUPPORTED_SUBMISSION_MIME_TYPES del backend (repo separado) — si se cambian de un lado, hay que avisar para cambiarlos del otro.
const MAX_UPLOAD_SIZE_MB = 10;
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
const SUPPORTED_SUBMISSION_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const;

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

type ArchivoAdjunto = {
  id: string;
  file: File;
  previewUrl?: string;
};

interface ExamenBackendResponse {
  id: string;
  titulo: string;
  fecha: string;
  cursoId: string;
  preguntas?: Array<{
    id: string;
    enunciado: string;
    respuestaEsperada: string;
    puntajeMaximo: number;
    esEvaluacionVisual?: boolean;
  }>;
  curso?: {
    id: string;
    materia: string;
    anio: number;
    division: string;
    anioLectivo: number;
    alumnos?: Array<{
      alumnoId: string;
      cursoId?: string;
      alumno?: {
        id: string;
        nombre: string;
        apellido: string;
        legajo: string;
      };
    }>;
  };
}

function isImageFile(file: File) {
  return IMAGE_MIME_TYPES.has(file.type);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}

function validateFile(file: File): string | null {
  const allowed = (SUPPORTED_SUBMISSION_MIME_TYPES as readonly string[]).includes(file.type);
  if (!allowed) {
    return `"${file.name}" no es un tipo permitido. Solo se aceptan JPEG, PNG, WebP y PDF.`;
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return `"${file.name}" supera el tamaño máximo de ${MAX_UPLOAD_SIZE_MB} MB.`;
  }
  return null;
}

function createAdjunto(file: File): ArchivoAdjunto {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: isImageFile(file) ? URL.createObjectURL(file) : undefined,
  };
}

export const NuevaEntregaView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examenId = searchParams.get('examenId') || '';

  const [examData, setExamData] = useState<ExamenBackendResponse | null>(null);
  const [isLoadingExam, setIsLoadingExam] = useState(true);
  const [loadExamError, setLoadExamError] = useState<string | null>(null);

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [archivos, setArchivos] = useState<ArchivoAdjunto[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const archivosRef = useRef(archivos);
  archivosRef.current = archivos;

  const loadExam = async () => {
    if (!examenId) {
      setLoadExamError('ID de examen no especificado en la URL.');
      setIsLoadingExam(false);
      return;
    }

    setIsLoadingExam(true);
    setLoadExamError(null);

    try {
      const data = await fetchApi<ExamenBackendResponse>(`/api/v1/examenes/${examenId}`);
      setExamData(data);

      const courseStudents = (data.curso?.alumnos || [])
        .map((item) => item.alumno)
        .filter((a): a is NonNullable<typeof a> => Boolean(a));

      if (courseStudents.length > 0) {
        setSelectedStudentId(courseStudents[0].id);
      }
      setIsLoadingExam(false);
    } catch (err: any) {
      console.error('Error al cargar el examen:', err);
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || 'No se pudo cargar el examen desde el servidor.';
      setLoadExamError(msg);
      setIsLoadingExam(false);
    }
  };

  useEffect(() => {
    loadExam();
  }, [examenId]);

  useEffect(() => {
    return () => {
      archivosRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const errors: string[] = [];
    const valid: ArchivoAdjunto[] = [];

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
        return;
      }
      valid.push(createAdjunto(file));
    });

    setUploadErrors(errors);
    if (valid.length > 0) {
      setArchivos((prev) => [...prev, ...valid]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setArchivos((prev) => {
      const item = prev[index];
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examData || !selectedStudentId || archivos.length === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    let firstEntregaId: string | null = null;

    try {
      const total = archivos.length;
      for (let i = 0; i < total; i++) {
        const item = archivos[i];
        if (total > 1) {
          setUploadProgress(`Subiendo hoja ${i + 1} de ${total}...`);
        } else {
          setUploadProgress('Subiendo archivo...');
        }

        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('examId', examData.id);
        formData.append('alumnoId', selectedStudentId);

        const created = await fetchApi<{
          id: string;
          examenId: string;
          alumnoId: string;
          archivo: string;
          estado: string;
        }>('/api/v1/entregas', {
          method: 'POST',
          body: formData,
        });

        // Limitación conocida: cuando se suben varias hojas, cada una genera una Entrega separada en el backend y solo se sigue el progreso de la primera.
        if (i === 0) {
          firstEntregaId = created.id;
        }
      }

      if (firstEntregaId) {
        router.push(`/entregas/${firstEntregaId}/procesando`);
      }
    } catch (err: any) {
      console.error('Error al subir entrega:', err);
      const message =
        err instanceof ApiError
          ? err.message
          : err?.message || 'Error al comunicarse con el servidor al subir la entrega.';
      setSubmitError(message);
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  if (isLoadingExam) {
    return (
      <div className="py-20 text-center space-y-4 animate-in fade-in">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Cargando datos del examen...</p>
      </div>
    );
  }

  if (loadExamError || !examData) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in fade-in">
        <div className="p-6 bg-rose-950/70 border border-rose-800 rounded-3xl space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h2 className="text-base font-bold text-white">No se pudo cargar el examen</h2>
          <p className="text-xs text-rose-200">{loadExamError || 'Examen no encontrado en el servidor.'}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={loadExam}
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

  const students = (examData.curso?.alumnos || [])
    .map((item) => item.alumno)
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const courseInfo = examData.curso
    ? `${examData.curso.materia} ${examData.curso.anio}°${examData.curso.division}`
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => router.push(`/examenes/${examData.id}`)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a {examData.titulo}</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">NUEVA ENTREGA</h1>
            <p className="text-xs text-slate-400">
              {courseInfo ? `${courseInfo} • ` : ''}{examData.titulo}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Seleccionar Alumno <span className="text-indigo-400">*</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              required
            >
              {students.length === 0 ? (
                <option value="">No hay alumnos registrados en este curso</option>
              ) : (
                students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.nombre} {st.apellido} (Legajo: {st.legajo})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Attachments Section (Wireframe 14) */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Archivos del examen (Fotografías / Hojas escaneadas)
            </label>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              multiple
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>+ Agregar imágenes</span>
              </button>

              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>+ Agregar PDF</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cámara</span>
              </button>
            </div>

            {uploadErrors.length > 0 && (
              <div className="space-y-1" role="alert">
                {uploadErrors.map((msg) => (
                  <p key={msg} className="text-xs text-rose-400 font-medium">
                    {msg}
                  </p>
                ))}
              </div>
            )}

            {/* List of Attached Files */}
            <div className="space-y-2 pt-2">
              {archivos.map((archivo, idx) => (
                <div
                  key={archivo.id}
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {archivo.previewUrl ? (
                      <img
                        src={archivo.previewUrl}
                        alt={archivo.file.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                      />
                    ) : (
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="block text-xs font-semibold text-slate-200 truncate">
                        Hoja {idx + 1}: {archivo.file.name}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {formatFileSize(archivo.file.size)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors text-xs flex items-center gap-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Quitar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-4 bg-rose-950/70 border border-rose-800/80 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={archivos.length === 0 || isSubmitting}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{uploadProgress || 'Subiendo entrega...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar a corregir</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
