import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // @ts-ignore - Inyectamos el JWT de EvalIA si el usuario está autenticado
  if (session?.backendJwt) {
    // @ts-ignore
    headers.set('Authorization', `Bearer ${session.backendJwt}`);
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la petición al servidor');
  }
  
  return response.json();
}
