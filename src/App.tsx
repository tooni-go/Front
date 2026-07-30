import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EvaliaProvider, useEvalia } from './context/EvaliaContext';
import { LoginScreen } from './components/Login/LoginScreen';
import { Navbar } from './components/Layout/Navbar';
import { SidebarNav } from './components/Layout/SidebarNav';

import { DashboardView } from './components/Views/DashboardView';
import { CursosListaView } from './components/Views/CursosListaView';
import { NuevoCursoView } from './components/Views/NuevoCursoView';
import { CursoDetalleView } from './components/Views/CursoDetalleView';
import { AlumnosListaView } from './components/Views/AlumnosListaView';
import { NuevoAlumnoView } from './components/Views/NuevoAlumnoView';
import { ExamenDetalleView } from './components/Views/ExamenDetalleView';
import { ExamenMetodoView } from './components/Views/ExamenMetodoView';
import { ExamenManualView } from './components/Views/ExamenManualView';
import { ExamenInteligenteView } from './components/Views/ExamenInteligenteView';
import { ExamenRevisionGeneradoView } from './components/Views/ExamenRevisionGeneradoView';
import { ExamenPreguntasView } from './components/Views/ExamenPreguntasView';
import { NuevaEntregaView } from './components/Views/NuevaEntregaView';
import { EntregaProcesandoView } from './components/Views/EntregaProcesandoView';
import { EntregaCorreccionIaView } from './components/Views/EntregaCorreccionIaView';
import { EntregaRevisionManualView } from './components/Views/EntregaRevisionManualView';
import { MiPerfilView } from './components/Views/MiPerfilView';

const MainContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { screen } = useEvalia();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Cargando EvalIA...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <DashboardView />;
      case 'cursos_lista':
        return <CursosListaView />;
      case 'curso_nuevo':
        return <NuevoCursoView />;
      case 'curso_detalle':
        return <CursoDetalleView />;
      case 'alumnos_lista':
        return <AlumnosListaView />;
      case 'alumno_nuevo':
      case 'alumno_editar':
        return <NuevoAlumnoView />;
      case 'examen_detalle':
        return <ExamenDetalleView />;
      case 'examen_metodo':
        return <ExamenMetodoView />;
      case 'examen_manual':
        return <ExamenManualView />;
      case 'examen_inteligente':
        return <ExamenInteligenteView />;
      case 'examen_revision_generado':
        return <ExamenRevisionGeneradoView />;
      case 'examen_preguntas':
        return <ExamenPreguntasView />;
      case 'entrega_nueva':
        return <NuevaEntregaView />;
      case 'entrega_procesando':
        return <EntregaProcesandoView />;
      case 'entrega_correccion_ia':
        return <EntregaCorreccionIaView />;
      case 'entrega_revision_manual':
        return <EntregaRevisionManualView />;
      case 'perfil':
        return <MiPerfilView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <SidebarNav />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <EvaliaProvider>
        <MainContent />
      </EvaliaProvider>
    </AuthProvider>
  );
}
