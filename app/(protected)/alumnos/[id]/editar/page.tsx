import { NuevoAlumnoView } from '@/src/components/Views/NuevoAlumnoView';
import { use } from 'react';

export default function EditarAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <NuevoAlumnoView alumnoId={resolvedParams.id} />;
}
