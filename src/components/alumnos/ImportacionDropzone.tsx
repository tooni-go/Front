'use client';
import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImportacionDropzoneProps {
  onDataParsed: (data: any[]) => void;
}

export const ImportacionDropzone: React.FC<ImportacionDropzoneProps> = ({ onDataParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && file.type !== 'application/vnd.ms-excel') {
      alert('Por favor sube un archivo CSV válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        parseCSV(text);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    if (lines.length < 2) {
      alert('El archivo CSV debe tener al menos una fila de encabezados y una de datos.');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const parsedData = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((h, i) => {
        row[h] = values[i] || '';
      });
      return {
        nombre: row['nombre'] || row['name'] || '',
        apellido: row['apellido'] || row['last_name'] || row['lastname'] || '',
        legajo: row['legajo'] || row['dni'] || '',
        email: row['email'] || row['correo'] || ''
      };
    }).filter(r => r.nombre || r.apellido || r.legajo);

    onDataParsed(parsedData);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
      <p className="text-sm text-slate-300 font-semibold">
        Arrastra y suelta tu archivo CSV aquí
      </p>
      <p className="text-xs text-slate-500 mt-2">
        o haz clic para seleccionar un archivo
      </p>
      <div className="mt-4 text-[11px] text-slate-500 space-y-1">
        <p>Columnas soportadas: Nombre, Apellido, Legajo/DNI, Email/Correo</p>
        <p>Separador de columnas: coma (,)</p>
      </div>
    </div>
  );
};
