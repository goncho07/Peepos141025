import React, { useState, useMemo, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { UsersRound, Plus, UploadCloud, Download, Trash2 } from 'lucide-react';

// Data store
import { useUserStore } from '@/store/userStore';

// Types and Hooks
import {
  GenericUser,
  Student,
  ConfirmationModalState,
  ScheduleModalState,
  SearchTag,
  UserStatus,
} from '@/types';
import { track } from '@/analytics/track';
import { useAdvancedFilter, FilterConfig } from '@/hooks/useAdvancedFilter';
import { isStudent, getLevel, isStaff, isParent } from '@/utils/helpers';
import { gradeMap } from '@/data/constants';

// PDF Utils
import { generateStudentCarnetsPDF } from '@/utils/pdfGenerator';
import { useSettingsStore } from '@/store/settingsStore';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import Button from '@/ui/Button';
import UserKpiCards from '@/components/users/UserKpiCards';
import UserListHeader from '@/components/users/UserListHeader';
import UserTable from '@/components/users/UserTable';
import UserDetailDrawer from '@/components/users/UserDetailDrawer';
import UserImportModal from '@/components/users/UserImportModal';
import ConfirmationModal from '@/components/users/ConfirmationModal';
import ScheduleDeactivationModal from '@/components/users/ScheduleDeactivationModal';
import GenerateCarnetsModal from '@/components/users/GenerateCarnetsModal';
import BulkActionBar from '@/components/users/BulkActionBar';

const userFilterConfig: FilterConfig<GenericUser> = {
  getId: (user: GenericUser): string => (isStudent(user) ? user.documentNumber : user.dni),
  getFullName: (user: GenericUser): string => (isStudent(user) ? user.fullName : user.name),

  createSpecializedTag: (value: string, users: GenericUser[]): SearchTag | null => {
    const gradeRegex = /(?:(\d{1,2})|(primero|segundo|tercero|cuarto|quinto|sexto))\s?([A-F])/i;
    const match = value.match(gradeRegex);
    if (match) {
      const gradeNum = match[1];
      const gradeName = match[2];
      const section = match[3].toUpperCase();
      const gradeWord = gradeMap[gradeNum as keyof typeof gradeMap] || gradeMap[gradeName as keyof typeof gradeMap];
      if (gradeWord) {
        const isValid = users.some(
          (u) => isStudent(u) && u.grade.toLowerCase() === gradeWord.toLowerCase() && u.section === section
        );
        return { value: `${gradeWord} ${section}`, displayValue: `Grado: ${gradeWord} "${section}"`, type: 'grade', isValid };
      }
    }
    const statusValues: UserStatus[] = ['Activo', 'Inactivo', 'Suspendido', 'Egresado', 'Pendiente'];
    const foundStatus = statusValues.find(s => s.toLowerCase() === value.toLowerCase());
    if (foundStatus) {
      const isValid = users.some(u => u.status.toLowerCase() === value.toLowerCase());
      return { value: foundStatus, displayValue: `Estado: ${foundStatus}`, type: 'status', isValid };
    }
    return null;
  },

  applyTagFilters: (users: GenericUser[], tags: SearchTag[]): GenericUser[] => {
    const validTags = tags.filter((t) => t.isValid);
    if (validTags.length === 0) return users;

    return users.filter((user) => {
      return validTags.every((tag) => {
        if (tag.type === 'grade') {
          if (!isStudent(user)) return false;
          const [grade, section] = tag.value.split(' ');
          return user.grade === grade && user.section === section;
        }
        if (tag.type === 'status') {
            return user.status === tag.value;
        }
        const lowerValue = tag.value.toLowerCase();
        return (
          userFilterConfig.getFullName(user).toLowerCase().includes(lowerValue) ||
          userFilterConfig.getId(user).toLowerCase().includes(lowerValue)
        );
      });
    });
  },
};

const UsersPage: React.FC = () => {
  const { allUsers, setAllUsers } = useUserStore();
  const settings = useSettingsStore();

  const [activeTab, setActiveTab] = useState('Todos');
  const [detailDrawerState, setDetailDrawerState] = useState<{ isOpen: boolean; user: GenericUser | null; initialTab?: string }>({ isOpen: false, user: null });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [scheduleModal, setScheduleModal] = useState<ScheduleModalState>({ isOpen: false, onConfirm: () => {}, users: [] });
  const [carnetsModalOpen, setCarnetsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  
  const actionTriggerRef = useRef<HTMLButtonElement | null>(null);

  const usersForTab = useMemo(() => {
    if (activeTab === 'Todos') return allUsers;
    return allUsers.filter(user => {
      if (activeTab === 'Administrativos') return isStaff(user) && user.category === 'Administrativo';
      if (activeTab === 'Docentes') return isStaff(user) && (user.category === 'Docente' || user.category === 'Apoyo');
      if (activeTab === 'Estudiantes') return isStudent(user);
      if (activeTab === 'Apoderados') return isParent(user);
      return false;
    });
  }, [activeTab, allUsers]);

  const { paginatedItems, totalPages, currentPage, setCurrentPage, sortConfig, handleSort, searchTags, handleAddTag, handleRemoveTag, clearFilters, filteredCount } = useAdvancedFilter(
    usersForTab,
    userFilterConfig,
    4
  );

  // Reset selection when filters or tabs change
  useEffect(() => setSelectedUserIds(new Set()), [searchTags, activeTab]);

  const handleOpenDrawer = (user: GenericUser | null, initialTab: string = 'resumen', event?: React.MouseEvent<HTMLButtonElement>) => {
    actionTriggerRef.current = event?.currentTarget || null;
    setDetailDrawerState({ isOpen: true, user, initialTab });
  };
  const handleCloseDrawer = () => {
    setDetailDrawerState({ isOpen: false, user: null });
    actionTriggerRef.current?.focus();
  };

  const handleSaveUser = (formData: any) => {
    // This is a mock implementation
    toast.promise(
        new Promise(resolve => setTimeout(resolve, 500)).then(() => {
            console.log("Saving user:", formData);
            // In a real app, you would dispatch an action to update the user store
        }),
        {
            loading: 'Guardando usuario...',
            success: 'Usuario guardado con éxito.',
            error: 'Error al guardar el usuario.',
        }
    );
    handleCloseDrawer();
};

const handleImportUsers = (newUsers: GenericUser[]) => {
    setAllUsers([...allUsers, ...newUsers]);
    toast.success(`${newUsers.length} usuarios importados con éxito.`);
};

const handleGenerateCarnets = async (filters: { rol: string; level: string; grade: string; section: string }) => {
    const studentsToPrint = allUsers.filter(isStudent).filter(s => {
        if (filters.rol !== 'Estudiante') return false;
        if (filters.level !== 'Todos' && getLevel(s).toLowerCase() !== filters.level.toLowerCase()) return false;
        if (filters.grade !== 'Todos los Grados' && s.grade !== filters.grade) return false;
        if (filters.section !== 'Todas las Secciones' && s.section !== filters.section) return false;
        return true;
    });

    if (studentsToPrint.length === 0) {
        toast.error('No se encontraron estudiantes que coincidan con los filtros.');
        return;
    }

    toast.loading('Generando carnets... Esto puede tomar un momento.', { duration: Infinity });
    try {
        await generateStudentCarnetsPDF(studentsToPrint, settings);
        toast.dismiss();
        toast.success(`${studentsToPrint.length} carnets generados con éxito.`);
    } catch (error) {
        console.error("Failed to generate PDF", error);
        toast.dismiss();
        toast.error('Ocurrió un error al generar los carnets.');
    }
    setCarnetsModalOpen(false);
};

const handleBulkAction = (action: string) => {
  if (action === 'generate-carnets') {
    setCarnetsModalOpen(true);
  }
  if (action === 'delete-users') {
    setConfirmationModal({
      isOpen: true,
      title: `Eliminar ${selectedUserIds.size} usuarios`,
      message: '¿Está seguro que desea eliminar los usuarios seleccionados? Esta acción es irreversible.',
      onConfirm: () => {
        toast.success(`${selectedUserIds.size} usuarios eliminados.`);
        setSelectedUserIds(new Set());
      },
      confirmText: 'Sí, eliminar'
    });
  }
};
  
  return (
    <>
      <ModulePage
        title="Gestión de Usuarios"
        description="Administre la información de estudiantes, docentes y personal."
        icon={UsersRound}
        kpis={<UserKpiCards users={allUsers} activeTab={activeTab} onTabChange={setActiveTab} />}
        actionsRight={
          <>
            <Button variant="tonal" icon={Download} onClick={() => setCarnetsModalOpen(true)} aria-label="Generar Carnets">Generar Carnets</Button>
            <Button variant="tonal" icon={UploadCloud} onClick={() => setImportModalOpen(true)} aria-label="Importar Usuarios">Importar</Button>
            <Button variant="filled" icon={Plus} onClick={(e) => handleOpenDrawer(null, 'resumen', e)} aria-label="Crear Usuario">Crear Usuario</Button>
          </>
        }
        filters={<UserListHeader tags={searchTags} allUsers={usersForTab} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />}
        content={
          <UserTable
            isLoading={false}
            users={paginatedItems}
            sortConfig={sortConfig}
            onSort={handleSort}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onAction={(action, user, event) => handleOpenDrawer(user, 'resumen', event)}
            onClearFilters={clearFilters}
            onCreateUser={(e) => handleOpenDrawer(null, 'resumen', e)}
          />
        }
        bulkBar={<BulkActionBar count={selectedUserIds.size} onClear={() => setSelectedUserIds(new Set())} onAction={handleBulkAction} />}
      />
      
      <UserDetailDrawer
          isOpen={detailDrawerState.isOpen}
          user={detailDrawerState.user}
          onClose={handleCloseDrawer}
          onSave={handleSaveUser}
          triggerElementRef={actionTriggerRef}
          initialTab={detailDrawerState.initialTab}
      />
      <UserImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImportUsers} />
      <ConfirmationModal {...confirmationModal} onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))} />
      <ScheduleDeactivationModal {...scheduleModal} onClose={() => setScheduleModal(prev => ({...prev, isOpen: false }))} />
      <GenerateCarnetsModal isOpen={carnetsModalOpen} onClose={() => setCarnetsModalOpen(false)} onGenerate={handleGenerateCarnets} />
    </>
  );
};

export default UsersPage;