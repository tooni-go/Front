'use client';
import React from 'react';
import { Trash2 } from 'lucide-react';

export interface PrevisualizacionRow {
  nombre: string;
  apellido: string;
  legajo: string;
  email: string;
}

interface TablaPrevisualizacionProps {
  data: PrevisualizacionRow[];
  onRemoveRow?: (index: number) => void;
}

export const TablaPrevisualizacion: React.FC<TablaPrevisualizacionProps> = ({ data, onRemoveRow }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/50 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Apellido</th>
            <th className="px-4 py-3 font-medium">Legajo / DNI</th>
            <th className="px-4 py-3 font-medium">Email</th>
            {onRemoveRow && <th className="px-4 py-3 font-medium text-right">Acción</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3">{row.nombre}</td>
              <td className="px-4 py-3">{row.apellido}</td>
              <td className="px-4 py-3">{row.legajo}</td>
              <td className="px-4 py-3">{row.email}</td>
              {onRemoveRow && (
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onRemoveRow(index)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-lg"
                    title="Eliminar fila"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
