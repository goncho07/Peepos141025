import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Wifi,
  WifiOff,
  LogOut,
  User,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  CheckCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useNotificationStore } from '@/store/notificationStore';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import es from 'date-fns/locale/es';
import { Link, useNavigate } from 'react-router-dom';
import Popover from '@/ui/Popover';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';

const NotificationsPanel: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.action) {
      navigate(notification.action.path);
    }
  };

  return (
    <div className="w-80 sm:w-96 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-2xl border border-[var(--color-border)] overflow-hidden">
      <header className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="font-bold text-lg text-[var(--color-text-primary)]">Notificaciones</h3>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="text"
            onClick={markAllAsRead}
            className="!text-xs !font-semibold !px-2 !h-auto"
            icon={CheckCheck}
            aria-label="Marcar todas como leídas"
          >
            Marcar todas como leídas
          </Button>
        )}
      </header>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Button
              key={n.id}
              variant="text"
              onClick={() => handleNotificationClick(n)}
              aria-label={`Ver notificación: ${n.message}`}
              className={`w-full !h-auto !justify-start text-left !p-4 !rounded-none transition-colors ${
                !n.read
                  ? 'bg-[var(--color-primary-light)]'
                  : 'hover:!bg-[var(--color-border-light)]'
              }`}
            >
              <div className="flex items-start gap-3">
                {!n.read && <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full mt-1.5 shrink-0"></div>}
                <div className="flex-1">
                  <p
                    className={`text-base ${
                      !n.read ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {n.message}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    {formatDistanceToNow(n.timestamp, { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
            </Button>
          ))
        ) : (
          <div className="p-8 text-center text-[var(--color-text-secondary)]">
            <p>No tienes notificaciones nuevas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const { toggleSidebar, isSidebarCollapsed, theme, toggleTheme } = useUIStore();
  const logout = useAuthStore((state) => state.logout);
  const isOnline = useOfflineStatus();
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-[var(--color-surface)] sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-4">
        <IconButton
          onClick={toggleSidebar}
          icon={isSidebarCollapsed ? ChevronsRight : ChevronsLeft}
          aria-label="Toggle Sidebar"
          variant="text"
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
        />
      </div>
      <div className="flex items-center gap-4">
        <IconButton
          onClick={toggleTheme}
          aria-label="Toggle theme"
          variant="text"
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          icon={() => (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
              </motion.div>
            </AnimatePresence>
          )}
        />

        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)]">
          {isOnline ? <Wifi size={20} className="text-[var(--color-success)]" /> : <WifiOff size={20} className="text-[var(--color-danger)]" />}
          <span className="hidden md:inline">{isOnline ? 'En línea' : 'Sin conexión'}</span>
        </div>

        <Popover
          trigger={
            <div className="relative">
              <IconButton
                icon={Bell}
                aria-label="Ver notificaciones"
                variant="text"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center h-5 w-5 bg-[var(--color-danger)] text-white text-xs font-bold rounded-full pointer-events-none">
                  {unreadCount}
                </span>
              )}
            </div>
          }
        >
          <NotificationsPanel />
        </Popover>

        <Popover
          trigger={
            <Button
              variant="text"
              aria-label="Abrir menú de perfil"
              className="!p-0 !w-auto !h-auto rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/50"
            >
              <img
                src="https://picsum.photos/seed/director/48/48"
                alt="Perfil"
                className="w-12 h-12 rounded-full border-4 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300"
              />
            </Button>
          }
        >
          <div className="w-56 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-border)]">
              <p className="font-bold text-lg text-[var(--color-text-primary)]">Ángel G. Morales</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Director(a)</p>
            </div>
            <Link
              to="/usuarios"
              className="flex items-center gap-3 px-4 py-3 text-base text-[var(--color-text-primary)] hover:bg-[var(--color-border-light)] transition-colors"
            >
              <User size={20} /> Perfil
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 text-base text-[var(--color-text-primary)] hover:bg-[var(--color-border-light)] transition-colors"
            >
              <Settings size={20} /> Ajustes
            </Link>
            <Button
              onClick={handleLogout}
              variant="text"
              icon={LogOut}
              aria-label="Cerrar Sesión"
              className="w-full !justify-start !text-[var(--color-danger)] hover:!bg-red-50 dark:hover:!bg-red-500/10 !px-4 !h-auto !py-3 !text-base"
            >
              Cerrar Sesión
            </Button>
          </div>
        </Popover>
      </div>
    </header>
  );
};

export default Header;