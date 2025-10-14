import {
  Users,
  BookOpen,
  MessageSquare,
  FileSpreadsheet,
  QrCode,
  TrendingUp,
  AlertTriangle,
  FileText,
  Sparkles,
  BookCheck,
} from 'lucide-react';

// For Director Dashboard
export const directorKpiData = [
  { title: 'Matrícula Activa', value: 1681, icon: Users, gradient: 'bg-gradient-to-br from-blue-400 to-blue-700' },
  { title: 'Asistencia Hoy', value: '0%', icon: TrendingUp, gradient: 'bg-gradient-to-br from-emerald-400 to-teal-600' },
  { title: 'Incidencias Diarias', value: 0, icon: AlertTriangle, gradient: 'bg-gradient-to-br from-red-500 to-rose-700' },
  { title: 'Actas Pendientes', value: 0, icon: FileText, gradient: 'bg-gradient-to-br from-amber-500 to-orange-700' },
];

export const directorQuickActions = [
  { text: 'Tomar Asistencia QR', icon: QrCode, path: '/asistencia/scan' },
  { text: 'Revisar Carga de Notas', icon: BookOpen, path: '/academico/avance-docentes' },
  { text: 'Enviar Comunicado', icon: MessageSquare, path: '/comunicaciones' },
  { text: 'Generar Reporte UGEL', icon: FileSpreadsheet, path: '/reportes' },
];

export const directorTaskItems = [
  { id: 1, text: 'Aprobar acta de 5to Grado "A"', status: 'Pendiente', priority: 'high' },
  { id: 2, text: 'Revisar solicitud de traslado de L. Mendoza', status: 'Pendiente', priority: 'medium' },
  { id: 3, text: 'Preparar informe de asistencia mensual', status: 'En progreso', priority: 'medium' },
  { id: 4, text: 'Planificar reunión de personal para el 05/08', status: 'Completo', priority: 'low' },
];

// For Teacher Dashboard
export const teacherQuickActions = [
  {
    text: 'Tomar Asistencia QR',
    icon: QrCode,
    path: '/asistencia/scan',
    styleClasses: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300',
  },
  {
    text: 'Revisar Notas',
    icon: BookCheck,
    path: '/registrar-notas',
    styleClasses: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  },
  {
    text: 'Nuevo Comunicado',
    icon: MessageSquare,
    path: '/comunicaciones',
    styleClasses: 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300',
  },
  {
    text: 'Generar Reporte UGEL',
    icon: FileText,
    path: '/reportes',
    styleClasses: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300',
  },
  {
    text: 'Ver Prompt del Sistema',
    icon: Sparkles,
    path: '#prompt',
    styleClasses: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300',
  },
];
