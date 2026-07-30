import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/evalia';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (email?: string) => Promise<boolean>;
  loginWithCredentials: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'evalia_teacher_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error loading session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async (customEmail?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customEmail || 'juan@gmail.com' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
          setIsLoading(false);
          return true;
        }
      }
    } catch (e) {
      console.warn('Backend endpoint unavailable, applying fallback auth:', e);
    }

    // Fallback
    const fallbackUser: User = {
      id: 'usr-google-1001',
      name: customEmail && customEmail !== 'juan@gmail.com' ? customEmail.split('@')[0] : 'Juan Pérez',
      email: customEmail || 'juan@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(fallbackUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
    setIsLoading(false);
    return true;
  };

  const loginWithCredentials = async (email: string): Promise<boolean> => {
    return loginWithGoogle(email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
