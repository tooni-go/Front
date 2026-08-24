import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la petición al servidor');
  }
  
  return response.json();
}

export class ApiError extends Error {
  statusCode?: number;
  data?: any;

  constructor(message: string, statusCode?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers = new Headers(options.headers || {});

  // Si el body es FormData, el navegador setea automáticamente el Content-Type con boundary
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // @ts-ignore - Inyectamos el JWT de EvalIA si el usuario está autenticado
  if (session?.backendJwt) {
    // @ts-ignore
    headers.set('Authorization', `Bearer ${session.backendJwt}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error en el servidor (${response.status})`;
    let errorData: any = null;
    try {
      errorData = await response.json();
      if (errorData) {
        if (typeof errorData.message === 'string') {
          errorMsg = errorData.message;
        } else if (Array.isArray(errorData.message)) {
          errorMsg = errorData.message.join(', ');
        } else if (errorData.error) {
          errorMsg = errorData.error;
        }
      }
    } catch {
      // Respuesta no es JSON
    }

    throw new ApiError(errorMsg, response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

export function getFileUrl(filePath?: string): string {
  if (!filePath) return '';
  if (
    filePath.startsWith('http://') ||
    filePath.startsWith('https://') ||
    filePath.startsWith('blob:') ||
    filePath.startsWith('data:')
  ) {
    return filePath;
  }
  const cleanPath = filePath.replace(/^\//, '');
  return `${API_BASE_URL.replace(/\/$/, '')}/${cleanPath}`;
}
