'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, loginWithCredentials, isLoading } = useAuth();
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [email, setEmail] = useState('');

  const handleGoogleClick = () => {
    loginWithGoogle();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      loginWithCredentials(email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full" />

      {/* Login Card matching Wireframe 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl text-center z-10"
      >
        {/* Logo Branding */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-black text-2xl shadow-xl shadow-indigo-500/25 mb-6">
          E
        </div>

        <h1 className="text-3xl font-black text-white tracking-wider mb-2">
          EVALIA
        </h1>

        <p className="text-sm font-medium text-indigo-300/90 mb-8 max-w-xs mx-auto">
          Corrección inteligente de exámenes escritos
        </p>

        {/* Main Action: Continuar con Google */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleClick}
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 border border-slate-200 disabled:opacity-50"
          >
            {/* Google Colorful Icon SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          {!showEmailOption ? (
            <button
              onClick={() => setShowEmailOption(true)}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors pt-2 block mx-auto underline decoration-slate-700 underline-offset-4"
            >
              Ingresar con correo o cuenta de prueba
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="pt-2 text-left space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Ingresar a EvalIA
              </button>
            </form>
          )}
        </div>

        {/* Motto at bottom of card matching wireframe */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs italic text-slate-400 font-medium">
            "La IA asiste. El profesor siempre decide."
          </p>
        </div>
      </motion.div>

      {/* Footer copyright */}
      <footer className="text-center text-xs text-slate-600 py-4">
        EvalIA &bull; Sistema de corrección inteligente
      </footer>
    </div>
  );
};
