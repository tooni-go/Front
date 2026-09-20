import React, { useState } from 'react';
import { Settings, Printer, X } from 'lucide-react';

export interface PrintPreferences {
  institucion: string;
  docente: string;
  instrucciones: string;
  mostrarPuntajes: boolean;
  espacioRenglones: 'pequeno' | 'mediano' | 'grande';
}

interface ModalPreferenciasMembreteProps {
  onClose: () => void;
  onPrint: (prefs: PrintPreferences) => void;
}

export const ModalPreferenciasMembrete: React.FC<ModalPreferenciasMembreteProps> = ({ onClose, onPrint }) => {
  const [prefs, setPrefs] = useState<PrintPreferences>({
    institucion: 'Colegio Nacional',
    docente: '',
    instrucciones: 'Lee atentamente cada consigna antes de responder. Escribe con letra clara y legible.',
    mostrarPuntajes: true,
    espacioRenglones: 'mediano',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-indigo-400" /> Preferencias de Impresión
        </h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Institución</label>
            <input
              type="text"
              name="institucion"
              value={prefs.institucion}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Ej: Escuela Normal N°1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Nombre del Docente</label>
            <input
              type="text"
              name="docente"
              value={prefs.docente}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Ej: Prof. Juan Pérez"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Instrucciones para el alumno</label>
            <textarea
              name="instrucciones"
              value={prefs.instrucciones}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
              placeholder="Instrucciones generales..."
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="mostrarPuntajes"
              name="mostrarPuntajes"
              checked={prefs.mostrarPuntajes}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
            />
            <label htmlFor="mostrarPuntajes" className="text-xs text-slate-300 font-medium cursor-pointer">
              Mostrar puntaje máximo por pregunta
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Espacio para responder (renglones)</label>
            <select
              name="espacioRenglones"
              value={prefs.espacioRenglones}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="pequeno">Poco espacio (3 renglones)</option>
              <option value="mediano">Normal (5 renglones)</option>
              <option value="grande">Mucho espacio (8 renglones)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-6 mt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onPrint(prefs)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            Generar e Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};
