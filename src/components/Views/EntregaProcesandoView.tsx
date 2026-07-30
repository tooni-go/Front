import React, { useEffect, useState } from 'react';
import { useEvalia } from '../../context/EvaliaContext';
import { motion } from 'motion/react';
import { Loader2, CheckCircle2, Sparkles, Image, FileSearch, Cpu, CheckSquare } from 'lucide-react';

export const EntregaProcesandoView: React.FC = () => {
  const { getActiveDelivery, setScreen } = useEvalia();
  const delivery = getActiveDelivery();

  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { title: 'Analizando imágenes...', icon: <Image className="w-5 h-5" /> },
    { title: 'Detectando texto con OCR...', icon: <FileSearch className="w-5 h-5" /> },
    { title: 'Comparando respuestas con clave de corrección...', icon: <Cpu className="w-5 h-5" /> },
    { title: 'Generando sugerencia de puntuación con IA...', icon: <CheckSquare className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 900);
    const timer2 = setTimeout(() => setStepIndex(2), 1800);
    const timer3 = setTimeout(() => setStepIndex(3), 2700);

    const timerFinish = setTimeout(() => {
      if (delivery?.requiereRevisionManual) {
        setScreen('entrega_revision_manual');
      } else {
        setScreen('entrega_correccion_ia');
      }
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinish);
    };
  }, [delivery, setScreen]);

  return (
    <div className="max-w-md mx-auto py-12 text-center space-y-8 animate-in fade-in duration-300">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
        <div className="absolute top-0 right-0 p-1 bg-indigo-600 rounded-full text-white shadow-lg">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-white">PROCESANDO ENTREGA</h1>
        <p className="text-xs text-indigo-300">
          Evaluando examen escrito con Gemini 3.6 Flash...
        </p>
      </div>

      {/* Progress Steps List (Wireframe 15) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left space-y-3 shadow-xl">
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-indigo-950/60 border-indigo-500/50 text-white font-bold'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0" />
              )}

              <span className="text-xs font-semibold">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
