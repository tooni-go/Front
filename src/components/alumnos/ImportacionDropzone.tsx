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

  const handleFile = async (file: File) => {
    const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.type.includes('excel') || file.type.includes('spreadsheetml');

    if (!isCsv && !isExcel) {
      alert('Por favor sube un archivo CSV o Excel (.xlsx, .xls) válido.');
      return;
    }

    if (isExcel) {
      try {
        const xlsx = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const workbook = xlsx.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          alert('El archivo Excel debe tener al menos una fila de encabezados y una de datos.');
          return;
        }

        const headers = jsonData[0].map(h => String(h).trim().toLowerCase());
        const parsedData = jsonData.slice(1).map(row => {
          const rowData: any = {};
          headers.forEach((h, i) => {
            rowData[h] = row[i] !== undefined ? String(row[i]).trim() : '';
          });
          return {
            nombre: rowData['nombre'] || rowData['name'] || '',
            apellido: rowData['apellido'] || rowData['last_name'] || rowData['lastname'] || '',
            legajo: rowData['legajo'] || rowData['dni'] || '',
            email: rowData['email'] || rowData['correo'] || ''
          };
        }).filter(r => r.nombre || r.apellido || r.legajo);

        onDataParsed(parsedData);
      } catch (error) {
        console.error("Error leyendo excel:", error);
        alert('Hubo un error al leer el archivo Excel.');
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          parseCSV(text);
        }
      };
      reader.readAsText(file);
    }
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
        accept=".csv,text/csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
      <p className="text-sm text-slate-300 font-semibold">
        Arrastra y suelta tu archivo CSV o Excel aquí
      </p>
      <p className="text-xs text-slate-500 mt-2">
        o haz clic para seleccionar un archivo (.csv, .xlsx, .xls)
      </p>
      <div className="mt-4 text-[11px] text-slate-500 space-y-1">
        <p>Columnas soportadas: Nombre, Apellido, Legajo/DNI, Email/Correo</p>
      </div>
    </div>
  );
};
