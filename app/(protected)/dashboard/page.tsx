import { DashboardView } from '@/src/components/Views/DashboardView';

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row max-w-7xl w-full mx-auto">
      {/* El Navbar y Sidebar están ahora en el layout (si corresponde) o aquí */}
      {/* Necesitamos asegurarnos de que el layout general (o un layout del dashboard) los incluya */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        <DashboardView />
      </main>
    </div>
  );
}
