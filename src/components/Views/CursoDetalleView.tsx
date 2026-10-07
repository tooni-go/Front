'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, FileText, Plus, ArrowLeft, ChevronRight, Edit, Trash2, Loader2, AlertTriangle, UploadCloud } from 'lucide-react';
import { fetchApi } from '@/src/lib/api';
import { ReportExportDropdown } from '../Common/ReportExportDropdown';
import { ImportacionAlumnosModal } from '../alumnos/ImportacionAlumnosModal';

import { EstadoExamen } from '@/src/types/evalia';

interface BackendExamen {
  id: string;
  titulo: string;
  fecha: string;
  estado?: EstadoExamen;
  preguntas: { puntajeMaximo: number }[];
  _count?: { entregas: number };
}

interface BackendCurso {
  id: string;
  materia: string;
  anio: number;
  division: string;
  anioLectivo: number;
  examenes: BackendExamen[];
  alumnos: { alumno: { id: string; nombre: string; apellido: string; legajo: string } }[];
}

interface CursoDetalleViewProps {
  courseId?: string;
}

export const CursoDetalleView: React.FC<CursoDetalleViewProps> = ({ courseId: propCourseId }) => {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  
  const courseId = propCourseId || params.id;

  const [curso, setCurso] = useState<BackendCurso | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  
  const [editFormData, setEditFormData] = useState({
    materia: '',
    anio: '',
    division: '',
    anioLectivo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (curso) {
      setEditFormData({
        materia: curso.materia || '',
        anio: curso.anio ? curso.anio.toString() : '',
        division: curso.division || '',
        anioLectivo: curso.anioLectivo ? curso.anioLectivo.toString() : ''
      });
    }
  }, [curso]);

  const fetchCurso = () => {
    if (!courseId) return;
    setIsLoading(true);
    fetchApi<BackendCurso>(`/api/v1/cursos/${courseId}`)
      .then((data) => setCurso(data))
      .catch((err) => setLoadError(err?.message || 'No se pudo cargar el curso.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCurso();
  }, [courseId]);

  const handleDeleteAlumno = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este alumno?')) return;

    try {
      await fetchApi(`/api/v1/alumnos/${id}`, {
        method: 'DELETE',
      });
      if (curso) {
        setCurso({
          ...curso,
          alumnos: curso.alumnos.filter(ac => ac.alumno.id !== id)
        });
      }
    } catch (error) {
      console.error('Error deleting alumno:', error);
    }
  };

  const handleUpdateCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setIsSubmitting(true);
    try {
      await fetchApi(`/api/v1/cursos/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materia: editFormData.materia,
          anio: parseInt(editFormData.anio),
          division: editFormData.division,
          anioLectivo: parseInt(editFormData.anioLectivo)
        }),
      });
      setIsEditCourseModalOpen(false);
      alert('Curso actualizado exitosamente');
      fetchCurso();
    } catch (error: any) {
      alert(error?.message || 'Error actualizando curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCursoAction = async () => {
    if (!courseId) return;
    setIsSubmitting(true);
    try {
      await fetchApi(`/api/v1/cursos/${courseId}`, {
        method: 'DELETE',
      });
      setIsDeleteCourseModalOpen(false);
      alert('Curso eliminado exitosamente');
      router.push('/cursos');
    } catch (error: any) {
      alert(error?.message || 'Error eliminando curso');
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span className="text-sm">Cargando curso...</span>
      </div>
    );
  }

  if (loadError || !curso) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
        <p className="text-slate-400 text-sm">{loadError || 'Curso no encontrado.'}</p>
        <button
          onClick={() => router.push('/cursos')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  const students = curso.alumnos.map((ac) => ac.alumno);
  const exams = curso.examenes || [];
  const anioStr = `${curso.anio}°`;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <button
        onClick={() => router.push('/cursos')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a la lista de cursos</span>
      </button>

      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/40 px-3 py-0.5 rounded-md">
              Año Lectivo: {curso.anioLectivo}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {curso.materia} - {anioStr}{curso.division}
          </h1>
          <div className="flex items-center gap-6 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-indigo-400" />
              {students.length} alumnos registrados
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-indigo-400" />
              {exams.length} examenes programados
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsEditCourseModalOpen(true)}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            title="Editar Curso"
          >
            <Edit className="w-4 h-4 text-indigo-400" />
          </button>
          <button
            onClick={() => setIsDeleteCourseModalOpen(true)}
            className="py-2.5 px-3 bg-slate-800 hover:bg-rose-900/40 text-slate-200 hover:text-rose-400 font-bold text-xs rounded-xl border border-slate-700 hover:border-rose-800 transition-all flex items-center gap-2"
            title="Eliminar Curso"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ReportExportDropdown
            type="curso"
            id={curso.id}
            label="Exportar Calificaciones"
            pdfLabel="Descargar PDF"
            pdfDescription="Planilla consolidada con promedio"
            csvLabel="Descargar CSV"
            csvDescription="Planilla consolidada compatible con Excel"
            disabled={students.length === 0 && exams.length === 0}
            disabledReason="El curso no tiene alumnos ni exámenes para exportar"
          />
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span> Importar alumnos </span>
          </button>
          <button
            onClick={() => router.push(`/alumnos/nuevo?cursoId=${courseId}`)}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span> Nuevo alumno </span>
          </button>
          <button
            onClick={() => router.push(`/examenes/${courseId}/metodo`)}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span> Nuevo examen </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Alumnos ({students.length})
            </h2>
            <button
              onClick={() => router.push(`/alumnos?cursoId=${courseId}`)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Ver todos
            </button>
          </div>
          {students.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center">
              <Users className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-xs text-slate-400">El curso no tiene alumnos.</p>
              <button
                onClick={() => router.push(`/alumnos/nuevo?cursoId=${courseId}`)}
                className="mt-3 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-600/40"
              >
                Añadir primer alumno
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{student.nombre} {student.apellido || ''}</p>
                    <p className="text-[11px] text-slate-500">DNI / Legajo: {student.legajo}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/alumnos/${student.id}/editar`)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Editar alumno"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAlumno(student.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                      title="Eliminar alumno"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Examenes ({exams.length})
            </h2>
            <button
              onClick={() => router.push(`/examenes/${courseId}/metodo`)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Examen</span>
            </button>
          </div>
          {exams.length === 0 ? (
            <div className="text-center py-8 space-y-3 flex flex-col items-center">
              <FileText className="w-10 h-10 text-slate-700 mb-2" />
              <p className="text-xs text-slate-500 italic">No hay exámenes en este curso aún.</p>
              <button
                onClick={() => router.push(`/examenes/${courseId}/metodo`)}
                className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all"
              >
                Crear primer examen
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {exams.map((exam) => {
                const puntajeTotal = exam.preguntas ? exam.preguntas.reduce((sum, p) => sum + p.puntajeMaximo, 0) : 0;
                const fechaStr = exam.fecha ? new Date(exam.fecha).toLocaleDateString('es-ES') : '-';
                const entregasCount = exam._count?.entregas ?? 0;
                return (
                  <div key={exam.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-white">{exam.titulo}</h3>
                        {exam.estado === 'BORRADOR' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/40">
                            🟡 Borrador
                          </span>
                        )}
                        {exam.estado === 'PUBLICADO' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                            🟢 Publicado
                          </span>
                        )}
                        {exam.estado === 'ARCHIVADO' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            ⚪ Archivado
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                        <span>Fecha: {fechaStr}</span>
                        <span>&bull;</span>
                        <span>{exam.preguntas ? exam.preguntas.length : 0} preguntas</span>
                        <span>&bull;</span>
                        <span>Puntaje Total: {puntajeTotal} pts</span>
                        <span>&bull;</span>
                        <span className="text-indigo-300 font-semibold">{entregasCount} entregas</span>
                      </div>
                    </div>
                    <button onClick={() => router.push(`/examenes/${exam.id}`)} className="py-2 px-4 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 shrink-0">
                      <span>Abrir</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {courseId && (
        <ImportacionAlumnosModal
          courseId={courseId}
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => fetchCurso()}
        />
      )}

      {isEditCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Editar Curso</h3>
              <button onClick={() => setIsEditCourseModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpdateCurso} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Materia</label>
                <input
                  type="text"
                  required
                  value={editFormData.materia}
                  onChange={(e) => setEditFormData({ ...editFormData, materia: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Año</label>
                  <input
                    type="number"
                    required
                    value={editFormData.anio}
                    onChange={(e) => setEditFormData({ ...editFormData, anio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">División</label>
                  <input
                    type="text"
                    required
                    value={editFormData.division}
                    onChange={(e) => setEditFormData({ ...editFormData, division: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Año Lectivo</label>
                <input
                  type="number"
                  required
                  value={editFormData.anioLectivo}
                  onChange={(e) => setEditFormData({ ...editFormData, anioLectivo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditCourseModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 transition flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-xl">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-white font-black text-lg">¿Eliminar Curso?</h3>
            <p className="text-slate-400 text-sm">
              Esta acción eliminará permanentemente el curso, incluyendo todos sus alumnos y exámenes. Esta acción no se puede deshacer.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <button
                onClick={handleDeleteCursoAction}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl transition flex justify-center items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Sí, Eliminar Curso
              </button>
              <button
                onClick={() => setIsDeleteCourseModalOpen(false)}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
