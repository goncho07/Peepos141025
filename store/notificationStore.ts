import { create } from 'zustand';
import { Notification } from '../types';

const initialNotifications: Notification[] = [
  {
    id: 1,
    message: 'Se ha registrado una nueva solicitud de traslado para el estudiante L. Mendoza.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    action: { label: 'Ver Solicitud', path: '/matricula' },
  },
  {
    id: 2,
    message: 'El docente F. Sotelo ha completado la carga de notas para el curso de 6to Grado "B".',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    action: { label: 'Ver Avance', path: '/academico/avance-docentes' },
  },
  {
    id: 3,
    message: 'El acta de notas para 5to Grado "A" está pendiente de su aprobación.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    action: { label: 'Revisar Acta', path: '/academico/actas-certificados' },
  },
  {
    id: 4,
    message: 'Alerta de asistencia: 5to Grado "B" tiene una asistencia por debajo del 80% esta semana.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
    action: { label: 'Ver Asistencia', path: '/asistencia' },
  },
];

interface NotificationState {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialNotifications,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Math.max(0, ...state.notifications.map((n) => n.id)) + 1,
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
}));
