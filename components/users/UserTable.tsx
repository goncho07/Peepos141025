import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUpDown, ArrowUp, ArrowDown, Eye, KeyRound, Info, Send, Search, RefreshCw, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserRole, UserStatus, Student, Staff, ParentTutor, GenericUser, SortConfig, UserLevel } from '@/types';
import { formatUserName, getLevel, getUserType } from '@/utils/helpers';
import { roleConfig } from '@/data/constants';
import Button from '@/ui/Button';
import Pagination from '@/ui/Pagination';

const TableHeader: React.FC<{ columnKey: string, label: string, sortConfig: SortConfig, onSort: (key: string) => void, className?: string }> = ({ columnKey, label, sortConfig, onSort, className = '' }) => (
    <th className={`px-4 py-3 text-sm font-bold text-left text-[var(--color-text-secondary)] whitespace-nowrap ${className}`}>
        <button onClick={() => onSort(columnKey)} className="flex items-center gap-1 group w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">
            {label}
            <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                {sortConfig?.key === columnKey ? (sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />) : <ChevronsUpDown size={16} />}
            </div>
        </button>
    </th>
);

const UserTableRow: React.FC<{ user: GenericUser, onAction: (action: string, user: GenericUser, event: React.MouseEvent<HTMLButtonElement>) => void }> = React.memo(({ user, onAction }) => {
    const name = 'studentCode' in user ? user.fullName : user.name;
    const roleForIcon = getUserType(user);
    const roleData = roleConfig[roleForIcon as keyof typeof roleConfig] || roleConfig['N/A'];
    const RoleIcon = roleData.icon;
    const level = getLevel(user);

    let gradeSectionDisplay = 'N/A';
    if ('grade' in user && 'section' in user) {
      if (user.grade.includes('Grado') || user.grade.includes('Año')) {
          const gradeShort = user.grade.split(' ')[0];
          gradeSectionDisplay = `${gradeShort}${user.section}`;
      } else {
          gradeSectionDisplay = `${user.grade} ${user.section}`;
      }
    }

    return (
        <tr className="h-20">
            <td className="sticky left-0 bg-inherit px-4 truncate">
                <div className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={name} className="w-12 h-12 rounded-full" />
                    <div>
                        <div className="flex items-center gap-2">
                           <button onClick={(e) => onAction('view-details', user, e)} className="text-left font-bold text-base text-[var(--color-text-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] dark:focus-visible:ring-offset-slate-900 rounded">
                               {formatUserName(name)}
                           </button>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-4 text-[var(--color-text-secondary)] text-base truncate">
                <div className="flex items-center gap-2 font-semibold"><RoleIcon size={22} className={`shrink-0 ${roleData.color}`} /><span>{roleForIcon}</span></div>
            </td>
            <td className="px-4 text-[var(--color-text-secondary)] font-semibold text-base truncate">{level}</td>
            <td className="px-4 text-[var(--color-text-secondary)] font-semibold text-base truncate">{gradeSectionDisplay}</td>
            <td onClick={e => e.stopPropagation()} className="sticky right-0 bg-inherit px-4">
                 <button onClick={(e) => onAction('view-details', user, e)} className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-border-light)] text-[var(--color-text-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]" aria-label={`Ver detalles de ${name}`}>
                    <Eye size={22} />
                </button>
            </td>
        </tr>
    );
});

const EmptyState: React.FC<{ onClearFilters: () => void; onCreateUser: (e: React.MouseEvent<HTMLButtonElement>) => void; }> = ({ onClearFilters, onCreateUser }) => (
    <tr>
        <td colSpan={5} className="text-center py-16">
            <div className="max-w-md mx-auto">
                <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600" />
                <h3 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">No se encontraron resultados</h3>
                <p className="mt-2 text-base text-[var(--color-text-secondary)]">
                    Pruebe ajustar los filtros o el término de búsqueda para encontrar lo que busca.
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                    <Button variant="outlined" onClick={onClearFilters} icon={RefreshCw} aria-label="Limpiar Filtros">Limpiar Filtros</Button>
                    <Button variant="filled" onClick={onCreateUser} icon={Plus} aria-label="Crear Usuario">Crear Usuario</Button>
                </div>
            </div>
        </td>
    </tr>
);

interface UserTableProps {
    isLoading: boolean;
    users: GenericUser[];
    sortConfig: SortConfig | null;
    onSort: (key: string) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onAction: (action: string, user: GenericUser, event: React.MouseEvent<HTMLButtonElement>) => void;
    onClearFilters: () => void;
    onCreateUser: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const UserTable: React.FC<UserTableProps> = ({
    isLoading, users, sortConfig, onSort, currentPage, totalPages, onPageChange, onAction, onClearFilters, onCreateUser
}) => {
    const getId = (user: GenericUser) => 'studentCode' in user ? user.documentNumber : user.dni;

    return (
        <div className="flex-grow flex flex-col min-h-0 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border)] overflow-hidden">
            <div className="flex-grow overflow-y-auto">
                <table className="w-full table-fixed">
                    <thead className="sticky top-0 z-20 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <tr className="border-b-2 border-[var(--color-border)]">
                            <TableHeader columnKey="fullName" label="Nombre" sortConfig={sortConfig!} onSort={onSort} className="sticky left-0 w-2/5" />
                            <TableHeader columnKey="role" label="Rol" sortConfig={sortConfig!} onSort={onSort} className="w-1/5" />
                            <th className="px-4 py-3 text-sm font-bold text-left text-[var(--color-text-secondary)] whitespace-nowrap w-1/5">Nivel</th>
                            <th className="px-4 py-3 text-sm font-bold text-left text-[var(--color-text-secondary)] whitespace-nowrap w-1/5">Grado/Sección</th>
                            <th className="px-4 py-3 text-sm font-bold text-left text-[var(--color-text-secondary)] sticky right-0 bg-slate-50/80 dark:bg-slate-800/80 z-20 w-24">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-light)]">
                        {isLoading ? (
                           null
                        ) : users.length > 0 ? (
                            users.map(user => <UserTableRow key={getId(user)} user={user} onAction={onAction} />)
                        ) : (
                           <EmptyState onClearFilters={onClearFilters} onCreateUser={onCreateUser} />
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="p-4 border-t border-[var(--color-border-light)]">
                   <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                </div>
            )}
        </div>
    );
};

export default UserTable;