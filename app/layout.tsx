import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'EvalIA',
  description: 'Asistencia inteligente para corrección de exámenes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
