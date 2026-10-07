import { NuevoAlumnoView } from '@/src/components/Views/NuevoAlumnoView';
import { use } from 'react';

export default function NuevoAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <NuevoAlumnoView cursoId={resolvedParams.id} />;
}
