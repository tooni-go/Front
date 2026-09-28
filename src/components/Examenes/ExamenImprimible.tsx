import React, { forwardRef } from 'react';
import { Exam, Course } from '../../types/evalia';
import { PrintPreferences } from './ModalPreferenciasMembrete';

interface ExamenImprimibleProps {
  exam: Exam;
  course: Course | null;
  prefs: PrintPreferences | null;
}

export const ExamenImprimible = forwardRef<HTMLDivElement, ExamenImprimibleProps>(({ exam, course, prefs }, ref) => {
  if (!prefs) return null;

  const linesCount = prefs.espacioRenglones === 'pequeno' ? 3 : prefs.espacioRenglones === 'grande' ? 8 : 5;

  return (
    <div ref={ref} className="hidden print:block print:bg-white print:text-black w-full min-h-screen font-serif p-8 absolute top-0 left-0 z-50 bg-white">
      {/* Estilos específicos para impresión */}
      <style type="text/css" media="print">
        {`
          @page { size: A4; margin: 20mm; }
          body { visibility: hidden; background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          #evalia-print-root { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: black !important; }
          #evalia-print-root * { visibility: visible; }
        `}
      </style>

      <div id="evalia-print-root" className="print-container">
        {/* Membrete institucional */}
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider">{prefs.institucion}</h1>
              <p className="text-sm">
                <span className="font-semibold">Materia:</span> {course ? course.materia : '________________'}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Curso:</span> {course ? `${course.anio} ${course.division}` : '________________'} - {course?.anioLectivo || new Date().getFullYear()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm"><span className="font-semibold">Fecha:</span> ___/___/20__</p>
              <p className="text-sm"><span className="font-semibold">Docente:</span> {prefs.docente || '________________'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-100 p-4 border border-gray-300 rounded">
            <div className="flex-1">
              <span className="font-semibold">Apellido y Nombre:</span> _________________________________________
            </div>
            <div>
              <span className="font-semibold">Nota:</span> _______
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">{exam.titulo}</h2>
        
        {prefs.instrucciones && (
          <div className="mb-6 p-3 border border-gray-400 bg-gray-50 italic text-sm">
            <strong>Instrucciones:</strong> {prefs.instrucciones}
          </div>
        )}

        {/* Grilla de puntajes (opcional) */}
        {prefs.mostrarPuntajes && exam.preguntas && exam.preguntas.length > 0 && (
          <div className="mb-8">
            <table className="w-full border-collapse border border-black text-sm text-center">
              <thead>
                <tr>
                  <th className="border border-black p-1 bg-gray-100">Pregunta</th>
                  {exam.preguntas.map(q => (
                    <th key={q.id} className="border border-black p-1 w-8">{q.numero}</th>
                  ))}
                  <th className="border border-black p-1 bg-gray-100 w-16">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1 font-semibold text-left px-2">Puntaje Máx.</td>
                  {exam.preguntas.map(q => (
                    <td key={q.id} className="border border-black p-1">{q.puntajeMaximo}</td>
                  ))}
                  <td className="border border-black p-1 font-bold">{exam.puntajeTotal}</td>
                </tr>
                <tr>
                  <td className="border border-black p-1 font-semibold text-left px-2">Puntaje Obtenido</td>
                  {exam.preguntas.map(q => (
                    <td key={q.id} className="border border-black p-1"></td>
                  ))}
                  <td className="border border-black p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Preguntas */}
        <div className="space-y-8">
          {exam.preguntas?.map((pregunta) => (
            <div key={pregunta.id} className="break-inside-avoid">
              <div className="flex gap-2">
                <span className="font-bold">{pregunta.numero}.</span>
                <div className="flex-1">
                  <p className="font-medium text-justify mb-1">
                    {pregunta.consigna}
                    {prefs.mostrarPuntajes && (
                      <span className="text-xs font-normal text-gray-600 ml-2">({pregunta.puntajeMaximo} pts)</span>
                    )}
                  </p>
                  <div className="mt-4 space-y-4 w-full">
                    {Array.from({ length: linesCount }).map((_, i) => (
                      <div key={i} className="border-b border-gray-400 w-full h-6"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ExamenImprimible.displayName = 'ExamenImprimible';
