'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { User } from '../types/evalia';
import { fetchApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithCredentials: (email: string) => Promise<void>;
  logout: () => void;
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

  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      if (session?.user) {
        let dbName = null;
        try {
          const dbProfile = await fetchApi('/api/v1/profesor/me');
          if (dbProfile && (dbProfile.nombre || dbProfile.apellido)) {
            dbName = (dbProfile.nombre || '') + (dbProfile.apellido ? ' ' + dbProfile.apellido : '');
            dbName = dbName.trim();
          }
        } catch (error) {
          // Si falla, silenciosamente usamos los datos de sesin (Google)
        }

        if (isMounted) {
          setUser({
            // @ts-ignore - Extraemos el ID si lo inyectamos en el callback
            id: session.user.id || 'google-usr-1',
            name: dbName || session.user.name || 'Usuario',
            email: session.user.email || '',
            avatar: session.user.image || '',
          });
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
  }, [session, status]);

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!user;

  const loginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const loginWithCredentials = async (email: string) => {
    // Si bien mantenemos la interfaz por retrocompatibilidad visual con el LoginScreen,
    // en este setup forzamos Google OAuth segǧn la especificacin.
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const logout = () => {
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