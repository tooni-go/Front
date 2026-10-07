'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession, signIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { User } from '../types/evalia';
import { fetchApi } from '../lib/api';
import { clearEvaliaStorage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithCredentials: (email: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile?: (data: any) => void;
  login?: (email: string, pass: string) => Promise<void>;
  signup?: (name: string, email: string, pass: string) => Promise<void>;
  error?: string | null;
  clearError?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  const fetchProfileData = useCallback(async (): Promise<User | null> => {
    if (!session?.user) return null;

    let profesorData: any = null;
    try {
      profesorData = await fetchApi('/api/v1/profesor/me');
    } catch (error) {
      // Si falla, se usan datos de la sesión de Google o fallback
    }

    const nombre = profesorData?.nombre || (session.user.name ? session.user.name.split(' ')[0] : '');
    const apellido = profesorData?.apellido || (session.user.name ? session.user.name.split(' ').slice(1).join(' ') : '');
    const departamento = profesorData?.departamento || '';

    let resolvedName = session.user.name || 'Profesor';
    if (profesorData?.nombre || profesorData?.apellido) {
      resolvedName = `${profesorData.nombre || ''} ${profesorData.apellido || ''}`.trim();
    } else if (session.user.name) {
      resolvedName = session.user.name;
    }

    return {
      // @ts-ignore - Extraemos el ID si lo inyectamos en el callback
      id: session.user.id || profesorData?.id || 'google-usr-1',
      name: resolvedName,
      email: session.user.email || profesorData?.email || '',
      avatar: session.user.image || '',
      nombre,
      apellido,
      departamento,
    };
  }, [session]);

  const refreshProfile = useCallback(async () => {
    const profile = await fetchProfileData();
    if (profile) {
      setUser(profile);
    }
  }, [fetchProfileData]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (session?.user) {
        const profile = await fetchProfileData();
        if (isMounted && profile) {
          setUser(profile);
        }
      } else {
        if (isMounted) setUser(null);
      }
    };

    if (status !== 'loading') {
      loadProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [session, status, fetchProfileData]);

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!user;

  const loginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const loginWithCredentials = async (email: string) => {
    await signIn('credentials', { email, callbackUrl: '/dashboard' });
  };

  const logout = () => {
    clearEvaliaStorage();
    setUser(null);
    nextAuthSignOut({ callbackUrl: '/' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginWithGoogle,
        loginWithCredentials,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};