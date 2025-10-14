import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import IconButton from './IconButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg' | 'xl' | '7xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'lg' }) => {
  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    '7xl': 'max-w-7xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className={`bg-slate-50 dark:bg-slate-900 rounded-[var(--radius-lg)] shadow-xl w-full ${sizeClasses[size]} flex flex-col max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
              <IconButton
                icon={X}
                onClick={onClose}
                aria-label="Cerrar modal"
                variant="text"
                className="!w-9 !h-9"
              />
            </header>
            <div className="flex-grow overflow-y-auto p-5">{children}</div>
            {footer && (
              <footer className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-b-[var(--radius-lg)] shrink-0">
                {footer}
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;