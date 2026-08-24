import { Suspense } from 'react';
import { NuevaEntregaView } from '../../../../src/components/Views/NuevaEntregaView';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-400">Cargando...</div>}>
      <NuevaEntregaView />
    </Suspense>
  );
}
