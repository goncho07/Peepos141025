import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Activity as ActivityIcon, Save, Send, Pencil, Trash2, KeyRound, X } from 'lucide-react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import es from 'date-fns/locale/es';
import { UserStatus, Student, Staff, ParentTutor, GenericUser, UserRole } from '@/types';
import { gradesAndSections as gradesAndSectionsData } from '@/data/grades';
import { useDataStore } from '@/store/dataStore';
import { isStudent, getUserType, formatUserName } from '@/utils/helpers';
import { statusConfig } from '@/data/constants';
import Button from '@/ui/Button';
import Drawer from '@/ui/Drawer';
import UserProfileSummary from './UserProfileSummary';
import FamilyGroupView from './FamilyGroupView';
import IconButton from '@/ui/IconButton';
import Input from '@/ui/Input';
import Select from '@/ui/Select';

type UserFormData = Partial<Student & Staff & ParentTutor> & { userType: UserRole | 'Personal', level?: keyof typeof gradesAndSectionsData };

const BLANK_USER: UserFormData = {
    name: '',
    email: '',
    role: 'Estudiante',
    sede: 'Norte',
    condition: 'Regular',
    status: 'Pendiente',
    tags: [],
    userType: 'Estudiante',
    level: 'primaria',
    grade: '1° Grado',
    section: 'A',
};

interface UserDetailDrawerProps {
    isOpen: boolean;
    user: GenericUser | null;
    onClose: () => void;
    onSave: (user: UserFormData) => void;
    triggerElementRef: React.RefObject<HTMLButtonElement | null>;
    initialTab?: string;
}

const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({ isOpen, user, onClose, onSave, initialTab }) => {
    const { activityLogs: allLogs, gradesAndSections } = useDataStore();
    const isNewUser = !user;
    const [activeTab, setActiveTab] = useState(initialTab || 'resumen');
    const [formData, setFormData] = useState<UserFormData>(BLANK_USER);
    const [isEditing, setIsEditing] = useState(isNewUser);
    
    useEffect(() => {
        if (isOpen) {
            const newUserState: UserFormData = user ? { ...user, userType: getUserType(user) as any, level: 'primaria' } : { ...BLANK_USER };
            setFormData(newUserState);
            setIsEditing(isNewUser);
            setActiveTab(isNewUser ? 'resumen' : (initialTab || 'resumen'));
        }
    }, [isOpen, user, isNewUser, initialTab]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, userType: value as UserRole | 'Personal', role: value }));
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLevel = e.target.value as keyof typeof gradesAndSections;
        const newGrades = Object.keys(gradesAndSections[newLevel]);
        const newGrade = newGrades[0];
        const newSections = (gradesAndSections[newLevel] as any)[newGrade] || [];
        const newSection = newSections[0] || '';
        setFormData((prev) => ({
            ...prev,
            level: newLevel,
            grade: newGrade,
            section: newSection
        }));
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newGrade = e.target.value;
        const level = formData.level as keyof typeof gradesAndSections;
        const newSections = (gradesAndSections[level] as any)[newGrade] || [];
        const newSection = newSections[0] || '';
        setFormData((prev) => ({
            ...prev,
            grade: newGrade,
            section: newSection
        }));
    };
    
    const handleSaveClick = () => {
        onSave(formData);
        if (!isNewUser) {
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        if (isNewUser) {
            onClose();
        } else {
            setFormData(user ? { ...user, userType: getUserType(user) as any, level: 'primaria' } : { ...BLANK_USER });
            setIsEditing(false);
        }
    };

    const drawerTabs = [
        { id: 'resumen', label: 'Resumen', icon: Info },
        { id: 'actividad', label: 'Actividad', icon: ActivityIcon },
    ];

    const userLogs = useMemo(() => {
        if (!user) return [];
        const name = isStudent(user) ? user.fullName : user.name;
        return allLogs.filter(log => log.targetUser === name || log.user === name);
    }, [user, allLogs]);
    
    const name = user ? (isStudent(user) ? user.fullName : user.name) : 'Nuevo Usuario';
    const status = user ? user.status : 'Pendiente';

    const renderFormFields = () => {
        const userType = formData.userType;
        const currentLevel = formData.level;
        const gradesForLevel: string[] = (currentLevel && gradesAndSections[currentLevel]) ? Object.keys(gradesAndSections[currentLevel]) : [];
        const sectionsForGrade = (currentLevel && formData.grade && gradesAndSections[currentLevel]) ? (gradesAndSections[currentLevel] as any)[formData.grade] || [] : [];
        
        return (
            <div className="space-y-6 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <section>
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-2">Datos del Usuario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isNewUser && (
                             <div className="md:col-span-2">
                                <Select label="Tipo de Usuario" name="userType" value={formData.userType} onChange={handleUserTypeChange} aria-label="Tipo de Usuario">
                                    <option value="Estudiante">Estudiante</option>
                                    <option value="Docente">Docente</option>
                                    <option value="Administrativo">Administrativo</option>
                                    <option value="Apoyo">Personal de Apoyo</option>
                                    <option value="Apoderado">Apoderado</option>
                                </Select>
                            </div>
                        )}
                        <div className="md:col-span-2"><Input label="Nombre Completo" name="name" type="text" value={formData.name || ''} onChange={handleInputChange} aria-label="Nombre Completo"/></div>
                        <div className="md:col-span-2"><Input label="Email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} aria-label="Email"/></div>
                        {userType === 'Estudiante' && (
                            <>
                                <div className="md:col-span-2">
                                    <Select label="Nivel" name="level" value={currentLevel} onChange={handleLevelChange} className="capitalize" aria-label="Nivel educativo">
                                        {Object.keys(gradesAndSections).map(level => <option key={level} value={level}>{level}</option>)}
                                    </Select>
                                </div>
                                <div>
                                    <Select label="Grado" name="grade" value={formData.grade || ''} onChange={handleGradeChange} aria-label="Grado">
                                        {gradesForLevel.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                    </Select>
                                </div>
                                <div>
                                    <Select label="Sección" name="section" value={String(formData.section ?? '')} onChange={handleInputChange} aria-label="Sección">
                                        {sectionsForGrade.map((section: string) => <option key={section} value={section}>{section}</option>)}
                                    </Select>
                                </div>
                            </>
                        )}
                        {(userType === 'Docente' || userType === 'Administrativo' || userType === 'Apoyo' || userType === 'Personal') && (
                             <div><Select label="Área" name="area" value={formData.area || 'Inicial'} onChange={handleInputChange} aria-label="Área"><option>Inicial</option><option>Primaria</option><option>Secundaria</option><option>Secretaría Académica</option><option>Administración</option></Select></div>
                        )}
                    </div>
                </section>
            </div>
        );
    }

    const renderContent = () => {
        if (isEditing) {
            return renderFormFields();
        }

        switch(activeTab) {
            case 'resumen':
                return (
                    <div className="space-y-5">
                        <UserProfileSummary user={user as GenericUser} />
                        {isStudent(user) && <FamilyGroupView student={user} />}
                    </div>
                );
            case 'actividad':
                 return (
                    <div className="space-y-3">
                    {userLogs.length > 0 ? userLogs.map(log => (
                        <div key={log.id} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <img src={log.userAvatar} className="w-9 h-9 rounded-full mt-1 shrink-0" alt={log.user}/>
                            <div className="flex-1">
                                <p className="text-sm">
                                    <strong className="font-semibold text-slate-800 dark:text-slate-100">{formatUserName(log.user)}</strong> realizó la acción <strong className="font-semibold">{log.action}</strong>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 italic">"{log.details}"</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: es })}</p>
                            </div>
                        </div>
                    )) : <div className="text-center text-slate-500 p-8"><ActivityIcon size={40} className="mx-auto mb-2"/>No hay actividad reciente para este usuario.</div>}
                    </div>
                );
            default:
                return null;
        }
    }

    const headerContent = (
         <div className="flex justify-between items-start">
             <div className="flex items-center gap-4">
                <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=random`} alt={name} className="w-14 h-14 rounded-full" />
                <div>
                    <h2 id="drawer-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100">{!isNewUser ? formatUserName(name) : 'Crear Nuevo Usuario'}</h2>
                    {!isNewUser && user && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${statusConfig[status].colorClasses}`}>{status}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Último acceso: {user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true, locale: es }) : 'Nunca'}</span>
                    </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
               {!isNewUser && !isEditing && (
                   <Button variant="tonal" icon={Pencil} onClick={() => setIsEditing(true)} aria-label="Editar Usuario">Editar</Button>
               )}
               <IconButton icon={X} onClick={onClose} aria-label="Cerrar panel" variant="text" />
            </div>
        </div>
    );
    
    const footerContent = isEditing ? (
        <div className="flex justify-end items-center gap-2 w-full">
            <Button variant="tonal" onClick={handleCancelEdit} aria-label="Cancelar">Cancelar</Button>
            <Button variant="filled" onClick={handleSaveClick} aria-label={isNewUser ? "Crear y Enviar Invitación" : "Guardar Cambios"}>
                {isNewUser ? <Send /> : <Save />}
                {isNewUser ? "Crear y Enviar Invitación" : "Guardar Cambios"}
            </Button>
        </div>
    ) : (
        <div className="flex justify-between items-center w-full">
            <Button variant="danger" icon={Trash2} onClick={() => { /* Needs confirmation modal logic */ }} aria-label="Eliminar Usuario">Eliminar</Button>
            <Button variant="tonal" icon={KeyRound} onClick={() => { /* Needs toast/confirmation */ }} aria-label="Restablecer Contraseña">Restablecer</Button>
        </div>
    );

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={headerContent} footer={footerContent}>
            <>
                {!isNewUser && !isEditing && (
                     <nav className="-mt-5 -mx-5 mb-5 border-b border-slate-200 dark:border-slate-700 px-5 shrink-0">
                        <div className="flex space-x-1">
                        {drawerTabs.map(tab => (
                            <Button
                                key={tab.id}
                                variant="text"
                                onClick={() => setActiveTab(tab.id)}
                                aria-label={`Ver sección ${tab.label}`}
                                className={`relative !text-sm !h-auto !py-3 !rounded-b-none ${activeTab === tab.id ? '!text-indigo-600 dark:!text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                            >
                                <div className="flex items-center gap-1.5"><tab.icon size={18}/> {tab.label}</div>
                                {activeTab === tab.id && <motion.div layoutId="drawer-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                            </Button>
                        ))}
                        </div>
                    </nav>
                )}
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab + (isEditing ? '-editing' : '-viewing')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </>
        </Drawer>
    );
};

export default UserDetailDrawer;