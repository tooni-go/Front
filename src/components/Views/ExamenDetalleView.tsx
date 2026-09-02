'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { Exam, Course, Question } from '../../types/evalia';
import {
  FileText,
  Calendar,
  HelpCircle,
  Award,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

interface BackendPregunta {
  id: string;
  enunciado: string;
  respuestaEsperada: string;
  puntajeMaximo: number;
  criteriosIA?: string | null;
  esEvaluacionVisual?: boolean;
}

interface BackendCurso {
  id: string;
  materia: string;
  anio: number;
  division: string;
  anioLectivo: number;
}

interface BackendExamen {
  id: string;
  titulo: string;
  fecha: string;
  cursoId: string;
  preguntas: BackendPregunta[];
  curso?: BackendCurso;
}

interface LocalDelivery {
  id: string;
  examId: string;
  studentName: string;
  fechaEntrega: string;
  estado: 'Publicada' | 'Pendiente' | 'Revisión';
  notaDocente: number;
}

function mapBackendExam(be: BackendExamen): { exam: Exam; course: Course | null } {
  const preguntas: Question[] = be.preguntas.map((p, idx) => ({
    id: p.id,
    numero: idx + 1,
    consigna: p.enunciado,
    respuestaEsperada: p.respuestaEsperada,
    puntajeMaximo: p.puntajeMaximo,
    criteriosIA: p.criteriosIA ?? undefined,
    esEvaluacionVisual: p.esEvaluacionVisual ?? false,
  }));

  const exam: Exam = {
    id: be.id,
    courseId: be.cursoId,
    titulo: be.titulo,
    fecha: be.fecha ? new Date(be.fecha).toLocaleDateString('es-ES') : '—',
    preguntasCount: preguntas.length,
    puntajeTotal: preguntas.reduce((sum, q) => sum + q.puntajeMaximo, 0),
    entregasCount: 0,
    preguntas,
  };

  const course: Course | null = be.curso
    ? {
        id: be.curso.id,
        materia: be.curso.materia,
        anio: `${be.curso.anio}°`,
        division: be.curso.division,
        anioLectivo: String(be.curso.anioLectivo),
      }
    : null;

  return { exam, course };
}

export const ExamenDetalleView: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<LocalDelivery[]>([]);

  useEffect(() => {
    if (!params.id) return;
    setIsLoading(true);
    setLoadError(null);

    fetchApi<BackendExamen>(`/api/v1/examenes/${params.id}`)
      .then((data) => {
        const { exam: mappedExam, course: mappedCourse } = mapBackendExam(data);
        setExam(mappedExam);
        setCourse(mappedCourse);
        try {
          const saved = localStorage.getItem('evalia_deliveries');
          if (saved) {
            const all: LocalDelivery[] = JSON.parse(saved);
            setDeliveries(all.filter((d) => d.examId === params.id));
          }
        } catch { /* localStorage no disponible */ }
      })
      .catch((err) => {
        setLoadError(err?.message || 'No se pudo cargar el examen. Verificá que el servidor esté activo.');
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleOpenDelivery = (deliveryId: string, estado: string) => {
    if (estado === 'Revisión') {
      router.push(`/entregas/${deliveryId}/revision-manual`);
    } else {
      router.push(`/entregas/${deliveryId}/correccion-ia`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span className="text-sm">Cargando examen...</span>
      </div>
    );
  }

  if (loadError || !exam) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <p className="text-sm font-bold text-rose-300">No se pudo cargar el examen</p>
        <p className="text-xs text-slate-400">{loadError}</p>
        <button
          onClick={() => router.back()}
          className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <button
        onClick={() => course ? router.push(`/cursos/${course.id}`) : router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{course ? `Volver a ${course.materia} ${course.anio}${course.division}` : 'Volver'}</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            {course && (
              <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
                {course.materia} - {course.anio}{course.division}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-black text-white mt-2">{exam.titulo}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push(`/examenes/${exam.id}/preguntas`)}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Ver preguntas</span>
            </button>

            <button
              onClick={() => router.push(`/entregas/nueva?examenId=${exam.id}`)}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Nueva entrega</span>
            </button>
          </div>
        </div>

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

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Últimas entregas ({deliveries.length})
          </h2>
          <button
            onClick={() => router.push(`/entregas/nueva?examenId=${exam.id}`)}
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
              onClick={() => router.push(`/entregas/nueva?examenId=${exam.id}`)}
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
                  {delivery.estado === 'Publicada' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/40 rounded-full text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ✔ Publicada
                    </span>
                  )}
                  {delivery.estado === 'Pendiente' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800/40 rounded-full text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> ⏳ Pendiente
                    </span>
                  )}
                  {delivery.estado === 'Revisión' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800/40 rounded-full text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> ⚠ Revisión
                    </span>
                  )}
                  <button
                    onClick={() => handleOpenDelivery(delivery.id, delivery.estado)}
                    className="py-2 px-3.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <span>Abrir</span>
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
