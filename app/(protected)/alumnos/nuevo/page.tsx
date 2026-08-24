import { Suspense } from 'react';
import { NuevoAlumnoView } from '../../../../src/components/Views/NuevoAlumnoView';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-slate-400">Cargando...</div>}>
      <NuevoAlumnoView />
    </Suspense>
  );
}
