import { Suspense } from 'react';
import { AlumnosListaView } from '@/src/components/Views/AlumnosListaView';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-400">Cargando...</div>}>
      <AlumnosListaView />
    </Suspense>
  );
}
