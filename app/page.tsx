import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { LoginScreen } from '@/src/components/Login/LoginScreen';
import { Suspense } from 'react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <Suspense fallback={null}>
      <LoginScreen />
    </Suspense>
  );
}


