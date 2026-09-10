'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvalia } from '../../context/EvaliaContext';
import { fetchApi } from '../../lib/api';
import { AiModelConfigResponse } from '../../types/evalia';
import {
  User,
  Mail,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';

export const MiPerfilView: React.FC = () => {
  const { user, logout } = useAuth();
  const { setScreen } = useEvalia();

  const [aiConfig, setAiConfig] = useState<AiModelConfigResponse | null>(null);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);
  const [updatingModel, setUpdatingModel] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAiModelConfig = async () => {
    try {
      setLoadingConfig(true);
      setErrorMsg(null);
      const data = await fetchApi<AiModelConfigResponse>('/api/v1/ai/model');
      setAiConfig(data);
    } catch (err: any) {
      setErrorMsg(
        'No se pudo conectar con el servicio de configuración de IA. Verifica que el servidor backend esté activo.',
      );
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    loadAiModelConfig();
  }, []);

  const handleModelChange = async (newModelId: string) => {
    if (!newModelId || newModelId === aiConfig?.modeloActivo) return;

    try {
      setUpdatingModel(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const response = await fetchApi<AiModelConfigResponse>(
        '/api/v1/ai/model',
        {
          method: 'PATCH',
          body: JSON.stringify({ modelo: newModelId }),
        },
      );

      setAiConfig(response);
      const selectedModelObj = response.modelosDisponibles.find(
        (m) => m.id === newModelId,
      );
      const modelName = selectedModelObj ? selectedModelObj.nombre : newModelId;
      setSuccessMsg(`Modelo de respaldo actualizado a ${modelName}`);

      // Auto-ocultar mensaje de confirmación tras 4 segundos
      setTimeout(() => {
        setSuccessMsg((current) => (current ? null : current));
      }, 4000);
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Error al actualizar el modelo de respaldo de IA.',
      );
    } finally {
      setUpdatingModel(false);
    }
  };

  const currentSelectedModel = aiConfig?.modelosDisponibles.find(
    (m) => m.id === aiConfig.modeloActivo,
  );

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setScreen('dashboard')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al Dashboard</span>
      </button>

      {/* User Profile Card (Wireframe 18) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center">
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-indigo-400" />
              )}
            </div>
          </div>
          <div
            className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-slate-950 border-2 border-slate-900"
            title="Cuenta Activa"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-black text-white">
            {user?.name || 'Juan Pérez'}
          </h1>
          <p className="text-xs text-indigo-300 font-semibold">
            Profesor Titular &bull; EvalIA
          </p>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 text-left">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold">
                Correo Electrónico
              </p>
              <p className="font-semibold text-white">
                {user?.email || 'juan@gmail.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            {loadingConfig && !aiConfig ? (
              <>
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
                <div className="space-y-1 w-full">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Plan de Corrección IA Primario
                  </p>
                  <div className="h-3.5 bg-slate-800/80 rounded animate-pulse w-44" />
                </div>
              </>
            ) : errorMsg && !aiConfig ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Plan de Corrección IA Primario
                  </p>
                  <p className="font-semibold text-amber-400 text-xs">
                    No disponible — Error de conexión
                  </p>
                </div>
              </>
            ) : aiConfig?.geminiPrincipal?.configurado ? (
              <>
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Plan de Corrección IA Primario
                  </p>
                  <p className="font-semibold text-indigo-300">
                    Google {aiConfig.geminiPrincipal.modelo} Activado
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Plan de Corrección IA Primario
                  </p>
                  <p className="font-semibold text-amber-400">
                    Sin configurar — usando solo OpenRouter
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs rounded-xl border border-rose-800/50 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* AI Fallback Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Motor de Respaldo IA
              </h2>
              <p className="text-xs text-slate-400">
                Mecanismo de Fallback (OpenRouter)
              </p>
            </div>
          </div>
          <button
            onClick={loadAiModelConfig}
            disabled={loadingConfig || updatingModel}
            title="Recargar configuración"
            className="p-2 text-slate-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${loadingConfig ? 'animate-spin text-indigo-400' : ''}`}
            />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="flex-1 font-medium">{successMsg}</span>
          </div>
        )}

        {loadingConfig && !aiConfig ? (
          <div className="p-6 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">
              Cargando catálogo de modelos de IA...
            </p>
          </div>
        ) : aiConfig ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="ai-fallback-model-select"
                className="block text-xs font-semibold text-slate-300"
              >
                Modelo de contingencia activo:
              </label>
              <div className="relative">
                <select
                  id="ai-fallback-model-select"
                  value={aiConfig.modeloActivo}
                  disabled={updatingModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition-colors appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {aiConfig.modelosDisponibles.map((model) => (
                    <option
                      key={model.id}
                      value={model.id}
                      className="bg-slate-900 text-slate-200"
                    >
                      {model.nombre} ({model.proveedor}){' '}
                      {model.esMultimodal ? '• Multimodal' : '• Solo Texto'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  {updatingModel ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  ) : (
                    <span className="text-[10px] font-bold">▼</span>
                  )}
                </div>
              </div>
            </div>

            {/* Model Card Details */}
            {currentSelectedModel && (
              <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-2.5 text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-300">
                    {currentSelectedModel.nombre}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {currentSelectedModel.esMultimodal ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Eye className="w-2.5 h-2.5" />
                        Multimodal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Solo Texto
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {aiConfig.origen === 'memoria' ? 'En memoria' : '.env'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentSelectedModel.descripcion}
                </p>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Proveedor:{' '}
                    <strong className="text-slate-400 font-medium">
                      {currentSelectedModel.proveedor}
                    </strong>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[150px]">
                    {currentSelectedModel.id}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>
                Este modelo se activará automáticamente si la API principal
                (Gemini) experimenta saturación o caídas.
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

