import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUIStore } from '@/store/uiStore';
import Breadcrumbs from '@/ui/Breadcrumbs';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-32' : 'ml-80'
        }`}
      >
        <Header />
        <main className="flex-1 p-4 flex flex-col min-h-0">
          <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;