'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Save, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AlumnoFormViewProps {
  cursoId?: string;
  alumnoId?: string; // Si existe, estamos editando
}

export const NuevoAlumnoView: React.FC<AlumnoFormViewProps> = ({ cursoId, alumnoId }) => {
  const router = useRouter();
  const isEditing = Boolean(alumnoId);

  const [nombre, setNombre] = useState('');
  const [legajo, setLegajo] = useState('');
  const [legajoTouched, setLegajoTouched] = useState(false);
  const [legajoError, setLegajoError] = useState<string | null>(null);
  
  const [isFetching, setIsFetching] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Validador de DNI / Legajo
  const validateLegajo = (value: string): string | null => {
    if (!value) {
      return 'El DNI / Legajo es obligatorio';
    }
    if (!/^\d+$/.test(value)) {
      return 'El campo solo debe contener números (sin puntos ni letras)';
    }
    if (value.length < 7 || value.length > 8) {
      return 'El DNI debe tener 7 u 8 números';
    }
    return null;
  };

  useEffect(() => {
    if (isEditing && alumnoId) {
      const fetchAlumno = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/v1/alumnos/${alumnoId}`, {
            headers: { 'Authorization': 'Bearer test-token' }
          });
          if (res.ok) {
            const data = await res.json();
            setNombre(data.nombre || '');
            const rawLegajo = (data.legajo || '').replace(/\D/g, '');
            setLegajo(rawLegajo);
          }
        } catch (error) {
          console.error('Error fetching alumno:', error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchAlumno();
    }
  }, [isEditing, alumnoId]);

  const handleLegajoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitimos dígitos numéricos y máximo 8 caracteres
    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 8);
    setLegajo(numericValue);
    
    if (legajoTouched || numericValue.length > 0) {
      setLegajoError(validateLegajo(numericValue));
    }
  };

  const handleLegajoBlur = () => {
    setLegajoTouched(true);
    setLegajoError(validateLegajo(legajo));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLegajoTouched(true);
    
    const error = validateLegajo(legajo);
    if (error) {
      setLegajoError(error);
      return;
    }

    if (!nombre.trim()) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const url = isEditing 
        ? `http://localhost:3000/api/v1/alumnos/${alumnoId}` 
        : `http://localhost:3000/api/v1/alumnos`;
      
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing 
        ? JSON.stringify({ nombre: nombre.trim(), legajo: legajo.trim() })
        : JSON.stringify({ nombre: nombre.trim(), legajo: legajo.trim(), cursoId });

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token' 
        },
        body
      });

      if (response.ok) {
        setMessage({ type: 'success', text: isEditing ? 'Alumno actualizado exitosamente.' : 'Alumno registrado exitosamente.' });
        router.refresh(); // Refresca el caché del cliente para que los componentes padre vean los cambios

        setTimeout(() => {
          if (cursoId) {
            router.push(`/cursos/${cursoId}`);
          } else {
            router.back();
          }
        }, 1500);
      } else {
        const errorData = await response.json();
        const errorMsg = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
        setMessage({ type: 'error', text: errorMsg || 'Error al guardar el alumno.' });
      }
    } catch (error) {
      console.error('Error saving alumno:', error);
      setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isSaving && message?.type !== 'success') {
      router.back();
    }
  };

  if (isFetching) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Cargando datos del alumno...</p>
      </div>
    );
  }

  const isFormValid = nombre.trim().length > 0 && !validateLegajo(legajo);

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">
            {isEditing ? 'EDITAR ALUMNO' : 'NUEVO ALUMNO'}
          </h1>
          <p className="text-xs text-slate-400">Ingrese los datos personales del estudiante</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2 ${
          message.type === 'success' 
            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50' 
            : 'bg-red-950/50 text-red-400 border border-red-800/50'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Nombre y Apellido del Alumno <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            required
            disabled={isSaving || message?.type === 'success'}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            DNI / Legajo <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={legajo}
            onChange={handleLegajoChange}
            onBlur={handleLegajoBlur}
            placeholder="Ej: 38123456"
            maxLength={8}
            className={`w-full bg-slate-950 border ${
              legajoError ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-indigo-500'
            } rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors`}
            required
            disabled={isSaving || message?.type === 'success'}
          />
          {legajoError && (
            <p className="mt-1.5 text-[11px] font-medium text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{legajoError}</span>
            </p>
          )}
          <p className="mt-1 text-[10px] text-slate-500">
            Debe ingresar entre 7 y 8 dígitos numéricos sin puntos ni espacios.
          </p>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving || message?.type === 'success'}
            className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>[ Cancelar ]</span>
          </button>

          <button
            type="submit"
            disabled={isSaving || !isFormValid || message?.type === 'success'}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>[ Guardando... ]</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>[ Guardar ]</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
