import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, User as UserIcon, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, signup, isLoading, error, clearError } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email || !email.includes('@')) {
      setFormError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!password || password.length < 4) {
      setFormError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setFormError('Por favor ingresa tu nombre completo.');
      return;
    }

    if (isSignUp) {
      await signup(name, { email, password, rememberMe });
    } else {
      await login({ email, password, rememberMe });
    }
  };

  const fillDemoCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('demo1234');
    setName(roleEmail.includes('admin') ? 'Carlos Mendoza' : roleEmail.includes('analista') ? 'Elena Rostova' : 'Mateo Silva');
    setFormError(null);
    clearError();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Plataforma Web
          </h1>
          <p className="text-sm text-slate-400">
            {isSignUp ? 'Crea tu cuenta para comenzar' : 'Ingresa tus credenciales para acceder'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl p-6 md:p-8">
          
          {/* Auth Tab Switcher */}
          <div className="flex bg-slate-900/60 p-1 rounded-xl mb-6 border border-slate-700/50">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setFormError(null); clearError(); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                !isSignUp 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setFormError(null); clearError(); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isSignUp 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Feedback Errors */}
          <AnimatePresence mode="wait">
            {(formError || error) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span>{formError || error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Nombre Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-2.5 pl-11 pr-11 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <span>Recordarme en este equipo</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Para restablecer tu contraseña, contacta al administrador del sistema.')}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 pt-6 border-t border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Carga rápida con cuentas de prueba:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@empresa.com')}
                className="py-1.5 px-2 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/60 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('usuario@empresa.com')}
                className="py-1.5 px-2 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/60 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all text-center"
              >
                Usuario
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('analista@empresa.com')}
                className="py-1.5 px-2 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/60 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all text-center"
              >
                Analista
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Plataforma Web v1.0.0 &bull; Sistema de Autenticación
        </p>
      </motion.div>
    </div>
  );
};
