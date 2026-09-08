import { getSession } from 'next-auth/react';
import { ApiError } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type ReportType = 'curso' | 'examen';
export type ReportFormat = 'pdf' | 'csv';

export interface DownloadReportOptions {
  type: ReportType;
  id: string;
  format: ReportFormat;
  fallbackFilename?: string;
}

/**
 * Extrae el nombre de archivo del encabezado Content-Disposition.
 * Soporta estándares RFC 6266 / RFC 5987:
 * - filename="notas-matematica-1a-2026-09-04.pdf"
 * - filename*=UTF-8''notas-matem%C3%A1tica.pdf
 */
export function extractFilenameFromContentDisposition(
  contentDisposition: string | null,
  fallbackFilename: string
): string {
  if (!contentDisposition) return fallbackFilename;

  // 1. Intentar formato codificado en UTF-8 (filename*=UTF-8''...)
  const utf8Match = contentDisposition.match(/filename\*=(?:UTF-8''|utf-8'')?([^;\n]+)/i);
  if (utf8Match && utf8Match[1]) {
    try {
      const decoded = decodeURIComponent(utf8Match[1].replace(/["']/g, '').trim());
      if (decoded) return decoded;
    } catch {
      // Si falla la decodificación, continuar con otros formatos
    }
  }

  // 2. Intentar formato estándar (filename="...")
  const standardMatch = contentDisposition.match(/filename=["']?([^"';\n]+)["']?/i);
  if (standardMatch && standardMatch[1]) {
    const clean = standardMatch[1].trim();
    if (clean) return clean;
  }

  return fallbackFilename;
}

/**
 * Descarga un reporte (PDF o CSV) de un curso o examen desde el backend de EvalIA.
 * Dispara la descarga nativa en el navegador mediante Blob y retorna el nombre final del archivo.
 */
export async function downloadReport({
  type,
  id,
  format,
  fallbackFilename,
}: DownloadReportOptions): Promise<string> {
  const session = await getSession();
  const url = `${API_BASE_URL.replace(/\/$/, '')}/api/v1/reportes/${type}/${id}/${format}`;

  const headers = new Headers();
  // @ts-ignore - Inyectamos el JWT de EvalIA si el usuario está autenticado
  if (session?.backendJwt) {
    // @ts-ignore
    headers.set('Authorization', `Bearer ${session.backendJwt}`);
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error al descargar el reporte (${response.status})`;
    try {
      const errorData = await response.json();
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
      // Si no es JSON, intentar leer texto
      const text = await response.text().catch(() => '');
      if (text && text.length < 200) {
        errorMsg = text;
      }
    }

    throw new ApiError(errorMsg, response.status);
  }

  const defaultFallback = `reporte-${type}-${id}.${format}`;
  const filename = extractFilenameFromContentDisposition(
    response.headers.get('content-disposition'),
    fallbackFilename || defaultFallback
  );

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Liberar el recurso Blob URL tras disparar la descarga
  setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
  }, 1000);

  return filename;
}
