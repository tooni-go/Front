import { CursoDetalleView } from '@/src/components/Views/CursoDetalleView';
import { use } from 'react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <CursoDetalleView courseId={resolvedParams.id} />;
}
