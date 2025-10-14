import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { directorNavItems } from '@/data/nav';

const Sidebar: React.FC = () => {
  const { isSidebarCollapsed } = useUIStore();
  const { sidebarLogoUrl } = useSettingsStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const linkClasses =
    'flex items-center px-6 py-4 text-lg text-[var(--color-text-secondary)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary-light)] transition-all duration-200 group relative font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]';
  const activeLinkClasses = 'bg-[var(--color-primary-light)] text-[var(--color-primary-text)]';

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col z-40 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-32' : 'w-80'
      }`}
    >
      <div className="flex items-center justify-center h-20 border-b border-[var(--color-border)] shrink-0 px-4">
        <img
          src={sidebarLogoUrl}
          alt="Logo del Colegio"
          className={`transition-all duration-300 object-contain ${isSidebarCollapsed ? 'h-14 w-14' : 'h-14 w-14'}`}
        />
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="ml-4 text-xl font-black text-[var(--color-text-primary)] tracking-tight leading-tight"
            >
              IEE 6049
              <br />
              Ricardo Palma
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {directorNavItems.map((item) => (
            <li key={item.to} onMouseEnter={() => setHoveredItem(item.to)} onMouseLeave={() => setHoveredItem(null)}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
              >
                <item.icon
                  className={`h-7 w-7 shrink-0 transition-all duration-200 ${
                    isSidebarCollapsed ? 'mx-auto' : 'mr-5'
                  }`}
                />
                <AnimatePresence>
                  {!isSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.text}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isSidebarCollapsed && hoveredItem === item.to && (
                     <motion.div
                       initial={{ opacity: 0, x: 10, scale: 0.9 }}
                       animate={{ opacity: 1, x: 0, scale: 1 }}
                       exit={{ opacity: 0, x: 10, scale: 0.9 }}
                       className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-sm font-semibold rounded-md shadow-lg whitespace-nowrap z-50"
                     >
                       {item.text}
                     </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;