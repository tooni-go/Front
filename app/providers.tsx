'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/src/context/AuthContext';
import { EvaliaProvider } from '@/src/context/EvaliaContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <EvaliaProvider>
          {children}
        </EvaliaProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
