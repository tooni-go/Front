import React, { useState } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { Upload, Image as ImageIcon, FileText, Camera, Trash2, ArrowLeft, Send } from 'lucide-react';

export const NuevaEntregaView: React.FC = () => {
  const {
    getActiveExam,
    getActiveCourse,
    getCourseStudents,
    createDelivery,
    setScreen,
  } = useEvalia();

  const exam = getActiveExam();
  const course = getActiveCourse();

  const students = course ? getCourseStudents(course.id) : [];

  const [selectedStudentId, setSelectedStudentId] = useState(
    students[0]?.id || ''
  );
  const [archivos, setArchivos] = useState<string[]>([
    'hoja1_examen.jpg',
    'hoja2_examen.jpg',
  ]);

  const handleAddDemoImage = () => {
    setArchivos((prev) => [...prev, `hoja${prev.length + 1}_examen.jpg`]);
  };

  const handleRemoveFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !selectedStudentId) return;

    setScreen('entrega_procesando');

    // Trigger delivery creation and evaluation
    await createDelivery(exam.id, selectedStudentId, archivos);
  };

  if (!exam || !course) {
    return <div className="text-center py-10 text-slate-400">Examen no encontrado.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('examen_detalle')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a {exam.titulo}</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">NUEVA ENTREGA</h1>
            <p className="text-xs text-slate-400">
              {course.materia} {course.anio}{course.division} &bull; {exam.titulo}
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
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.nombre} (Legajo: {st.legajo})
                </option>
              ))}
            </select>
          </div>

          {/* Attachments Section (Wireframe 14) */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Archivos del examen (Fotografías / Hojas escaneadas)
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddDemoImage}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>[ + Agregar imágenes ]</span>
              </button>

              <button
                type="button"
                onClick={handleAddDemoImage}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>[ + Agregar PDF ]</span>
              </button>

              <button
                type="button"
                onClick={handleAddDemoImage}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cámara</span>
              </button>
            </div>

            {/* List of Attached Files */}
            <div className="space-y-2 pt-2">
              {archivos.map((archivo, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      Hoja {idx + 1}: {archivo}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>[ Quitar ]</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={archivos.length === 0}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>[ Enviar a corregir ]</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
