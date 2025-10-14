import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import MatriculaPage from './pages/MatriculaPage';
import AcademicoPage from './pages/AcademicoPage';
import AsistenciaPage from './pages/AsistenciaPage';
import ComunicacionesPage from './pages/ComunicacionesPage';
import ReportesPage from './pages/ReportesPage';
import RecursosPage from './pages/RecursosPage';
import AdminFinanzasPage from './pages/AdminFinanzasPage';
import AyudaPage from './pages/AyudaPage';
import QRScannerPage from './pages/QRScannerPage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { useSettingsStore } from './store/settingsStore';
import AvanceDocentesPage from './pages/AvanceDocentesPage';
import MonitoreoCursosPage from './pages/MonitoreoCursosPage';
import MonitoreoEstudiantesPage from './pages/MonitoreoEstudiantesPage';
import ActasCertificadosPage from './pages/ActasCertificadosPage';
import ReportesAcademicosPage from './pages/ReportesAcademicosPage';
import ConfiguracionAcademicaPage from './pages/ConfiguracionAcademicaPage';
import TeacherLayout from './components/layout/TeacherLayout';
import TeacherDashboard from './pages/TeacherDashboard';
import RegistrarNotasPage from './pages/RegistrarNotasPage';
import LibroCalificacionesPage from './pages/LibroCalificacionesPage';
import ConvivenciaPage from './pages/ConvivenciaPage';
import SettingsPage from './pages/SettingsPage';
import RolesPage from './pages/RolesPage';
import ActivityLogPage from './pages/ActivityLogPage';
import CalendarPage from './pages/CalendarPage';
import ToastProvider from './ui/ToastProvider';

const DirectorRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/usuarios" element={<UsersPage />} />
      <Route path="/matricula" element={<MatriculaPage />} />
      <Route path="/academico" element={<AcademicoPage />} />
      <Route path="/academico/avance-docentes" element={<AvanceDocentesPage />} />
      <Route path="/academico/monitoreo-cursos" element={<MonitoreoCursosPage />} />
      <Route path="/academico/monitoreo-estudiantes" element={<MonitoreoEstudiantesPage />} />
      <Route path="/academico/actas-certificados" element={<ActasCertificadosPage />} />
      <Route path="/academico/reportes-descargas" element={<ReportesAcademicosPage />} />
      <Route path="/academico/configuracion" element={<ConfiguracionAcademicaPage />} />
      <Route path="/asistencia" element={<AsistenciaPage />} />
      <Route path="/asistencia/scan" element={<QRScannerPage />} />
      <Route path="/comunicaciones" element={<ComunicacionesPage />} />
      <Route path="/reportes" element={<ReportesPage />} />
      <Route path="/recursos" element={<RecursosPage />} />
      <Route path="/admin" element={<AdminFinanzasPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/roles" element={<RolesPage />} />
      <Route path="/settings/activity-log" element={<ActivityLogPage />} />
      <Route path="/ayuda" element={<AyudaPage />} />
      <Route path="/convivencia" element={<ConvivenciaPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Layout>
);

const TeacherRoutes = () => (
  <TeacherLayout>
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="/registrar-notas" element={<RegistrarNotasPage />} />
      <Route path="/libro-calificaciones" element={<LibroCalificacionesPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </TeacherLayout>
);

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { setTheme } = useUIStore();
  const { uiFontFamily } = useSettingsStore();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [setTheme]);

  useEffect(() => {
    const fontMap: { [key: string]: string } = {
        'System Default': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
        'Poppins': "'Poppins', sans-serif",
        'Inter': "'Inter', sans-serif",
        'Roboto': "'Roboto', sans-serif",
        'Nunito Sans': "'Nunito Sans', sans-serif",
    };
    const fontFamily = fontMap[uiFontFamily] || fontMap['Poppins'];
    document.documentElement.style.setProperty('--font-family', fontFamily);
    document.body.dataset.font = uiFontFamily;
  }, [uiFontFamily]);


  let appContent;
  if (!isAuthenticated) {
    appContent = (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  } else {
    appContent = user?.role === 'director' ? <DirectorRoutes /> : <TeacherRoutes />;
  }

  return (
    <>
      {appContent}
      <ToastProvider />
    </>
  );
};

export default App;