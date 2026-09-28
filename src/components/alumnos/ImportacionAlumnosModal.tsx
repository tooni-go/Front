'use client';
import React, { useState } from 'react';
import { X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { ImportacionDropzone } from './ImportacionDropzone';
import { TablaPrevisualizacion, PrevisualizacionRow } from './TablaPrevisualizacion';
import { fetchApi } from '@/src/lib/api';

interface ImportacionAlumnosModalProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportacionAlumnosModal: React.FC<ImportacionAlumnosModalProps> = ({
  courseId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [parsedData, setParsedData] = useState<PrevisualizacionRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDataParsed = (data: PrevisualizacionRow[]) => {
    setParsedData(data);
    setError(null);
  };

  const handleRemoveRow = (index: number) => {
    const newData = [...parsedData];
    newData.splice(index, 1);
    setParsedData(newData);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      await fetchApi(`/api/v1/cursos/${courseId}/alumnos/importar-masivo`, {
        method: 'POST',
        body: JSON.stringify({ alumnos: parsedData }),
      });
      onSuccess();
      onClose();
      setParsedData([]);
    } catch (err: any) {
      setError(err?.message || 'Error al importar los alumnos.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setParsedData([]);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Importar Alumnos Masivamente</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {parsedData.length === 0 ? (
            <ImportacionDropzone onDataParsed={handleDataParsed} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                <span>Se encontraron <strong className="text-white">{parsedData.length}</strong> alumnos. Revisa los datos antes de importar.</span>
                <button
                  onClick={() => setParsedData([])}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Subir otro archivo
                </button>
              </div>
              <TablaPrevisualizacion data={parsedData} onRemoveRow={handleRemoveRow} />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={parsedData.length === 0 || isUploading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Importando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirmar Importación</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
