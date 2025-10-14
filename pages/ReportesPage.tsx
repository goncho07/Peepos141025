import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSpreadsheet,
  Download,
  ClipboardCheck,
  Users,
  BookOpen,
  Warehouse,
  Briefcase,
  ChevronDown,
  FileText,
  FileBarChart2,
  FileBox,
  FilePieChart,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  FileCog,
} from 'lucide-react';

import Button from '@/ui/Button';
import Card from '@/ui/Card';
import Modal from '@/ui/Modal';
import Select from '@/ui/Select';
import Input from '@/ui/Input';
import { ModulePage } from '@/layouts/ModulePage';

type ReportCategory = 'Asistencia' | 'Matrícula' | 'Académico' | 'Recursos' | 'Finanzas';
type GenerationStatus = 'En proceso' | 'Listo' | 'Fallido';

interface Report {
  id: string;
  category: ReportCategory;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface GenerationQueueItem {
  id: number;
  reportTitle: string;
  status: GenerationStatus;
}

interface DownloadHistoryItem {
  id: number;
  reportTitle: string;
  user: string;
  timestamp: Date;
}

const allReports: Report[] = [
  { id: 'asis-1', category: 'Asistencia', title: 'UGEL Asistencia Mensual', description: 'Consolidado oficial de asistencia mensual para la UGEL.', icon: FileBarChart2 },
  { id: 'asis-2', category: 'Asistencia', title: 'Tardanzas por Sección', description: 'Detalle de tardanzas acumuladas por estudiante y sección.', icon: ClipboardCheck },
  { id: 'mat-1', category: 'Matrícula', title: 'Nómina de Matrícula', description: 'Listado oficial de estudiantes matriculados por sección.', icon: Users },
  { id: 'acad-1', category: 'Académico', title: 'Consolidado de Notas', description: 'Acta consolidada de calificaciones finales por sección.', icon: BookOpen },
  { id: 'rec-1', category: 'Recursos', title: 'Inventario por Categoría', description: 'Reporte de stock y estado de los recursos del inventario.', icon: FileBox },
  { id: 'fin-1', category: 'Finanzas', title: 'Ejecución Presupuestal', description: 'Balance de ingresos y gastos del periodo seleccionado.', icon: FilePieChart },
];

const GenerateReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onGenerate: (reportTitle: string) => void;
}> = ({ isOpen, onClose, report, onGenerate }) => {
  if (!report) return null;

  const handleGenerate = () => {
    onGenerate(report.title);
    onClose();
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="tonal" onClick={onClose} aria-label="Cancelar">Cancelar</Button>
      <Button variant="filled" onClick={handleGenerate} aria-label="Generar Reporte">Generar Reporte</Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Generar: ${report.title}`} footer={footer} size="lg">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Filtros</h3>
            <Select label="Nivel" id="nivel-filter" aria-label="Filtrar por Nivel"><option>Todos</option><option>Primaria</option><option>Secundaria</option></Select>
            <Select label="Grado" id="grado-filter" aria-label="Filtrar por Grado"><option>Todos</option><option>1° Grado</option><option>2° Grado</option></Select>
            <Input label="Rango de Fechas" id="date-range" type="date" aria-label="Filtrar por Rango de Fechas" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Previsualización</h3>
            <div className="h-48 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-500">
                <FileCog size={32} />
                <span className="ml-2">Vista previa no disponible</span>
            </div>
            <div className="mt-4">
                 <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Exportar</h3>
                 <div className="flex gap-2">
                    {/* FIX: Add missing aria-label property */}
                    <Button variant="tonal" className="flex-1 !justify-center" aria-label="Exportar a PDF">PDF</Button>
                    {/* FIX: Add missing aria-label property */}
                    <Button variant="tonal" className="flex-1 !justify-center" aria-label="Exportar a Excel">Excel</Button>
                 </div>
            </div>
        </div>
      </div>
    </Modal>
  );
};

const ReportCard: React.FC<{ report: Report; onGenerate: () => void }> = ({ report, onGenerate }) => (
  <Card className="!p-4 flex flex-col h-full">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-lg">
        <report.icon size={24} />
      </div>
      <div>
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{report.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{report.description}</p>
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
      {/* FIX: Add missing aria-label property */}
      <Button variant="filled" onClick={onGenerate} className="flex-1 !h-9 !text-sm" aria-label={`Generar ${report.title}`}>Generar</Button>
      <Button variant="tonal" icon={Download} className="flex-1 !h-9 !text-sm" aria-label="Descargar">Descargar</Button>
    </div>
  </Card>
);

const ReportesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('Asistencia');
  const [period, setPeriod] = useState('bimestre-actual');
  const [modalState, setModalState] = useState<{ isOpen: boolean; report: Report | null }>({ isOpen: false, report: null });
  const [generationQueue, setGenerationQueue] = useState<GenerationQueueItem[]>([
     { id: 1, reportTitle: 'Nómina de Matrícula - 4° Grado', status: 'En proceso' },
  ]);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([
      { id: 1, reportTitle: 'Tardanzas por Sección - Septiembre', user: 'Ángel G. Morales', timestamp: new Date(Date.now() - 3600000) },
  ]);

  const filteredReports = useMemo(() => allReports.filter(r => r.category === activeCategory), [activeCategory]);
  
  const handleOpenModal = (report: Report) => setModalState({ isOpen: true, report });
  
  const handleGenerateReport = (reportTitle: string) => {
    const newItem: GenerationQueueItem = {
        id: Date.now(),
        reportTitle,
        status: 'En proceso',
    };
    setGenerationQueue(prev => [newItem, ...prev]);

    // Simulate generation process
    setTimeout(() => {
        setGenerationQueue(prev => prev.map(item => item.id === newItem.id ? { ...item, status: 'Listo' } : item));
    }, 3000 + Math.random() * 2000);
  };
  
  const categories: ReportCategory[] = ['Asistencia', 'Matrícula', 'Académico', 'Recursos', 'Finanzas'];

  const statusIcons: Record<GenerationStatus, React.ReactElement> = {
    'En proceso': <Loader2 size={16} className="text-sky-500 animate-spin" />,
    'Listo': <CheckCircle size={16} className="text-emerald-500" />,
    'Fallido': <XCircle size={16} className="text-rose-500" />,
  };
  
  return (
    <>
      <ModulePage
        title="Centro de Reportes"
        description="Genere, descargue y monitoree todos los informes institucionales desde un solo lugar."
        icon={FileSpreadsheet}
        filters={
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-[var(--radius-lg)] p-2 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 flex-wrap">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'filled' : 'text'}
                  onClick={() => setActiveCategory(cat)}
                  className="!h-9 !px-3 !text-sm !font-semibold !rounded-md"
                  aria-pressed={activeCategory === cat}
                  aria-label={`Filtrar por categoría ${cat}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <div className="relative">
              <Select value={period} onChange={e => setPeriod(e.target.value)} className="!h-10 !text-sm" aria-label="Seleccionar período">
                <option value="bimestre-actual">Este Bimestre</option>
                <option value="mes-actual">Este Mes</option>
                <option value="anio-2025">Año 2025</option>
              </Select>
            </div>
          </div>
        }
        content={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h2 className="font-bold text-lg text-slate-600 dark:text-slate-300">Reportes de {activeCategory}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredReports.map(report => (
                    <motion.div key={report.id} layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                      <ReportCard report={report} onGenerate={() => handleOpenModal(report)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-4 min-h-0">
              <Card className="flex-grow flex flex-col min-h-0">
                <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 shrink-0">Cola de Generación</h2>
                <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-2">
                  {generationQueue.map(item => (
                    <div key={item.id} className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{item.reportTitle}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {statusIcons[item.status]} {item.status}
                        </span>
                        {item.status === 'Fallido' && <Button variant="text" icon={RefreshCw} className="!text-xs !h-auto !px-1.5 !py-0.5" aria-label="Reintentar">Reintentar</Button>}
                        {item.status === 'Listo' && <Button variant="text" icon={Download} className="!text-xs !h-auto !px-1.5 !py-0.5" aria-label="Descargar">Descargar</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="flex-grow flex flex-col min-h-0">
                <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 shrink-0">Últimas Descargas</h2>
                <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-2">
                  {downloadHistory.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{item.reportTitle}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.user} - {item.timestamp.toLocaleTimeString()}</p>
                      </div>
                      <Button variant="text" icon={Eye} className="!text-xs !h-auto !px-1.5 !py-0.5" aria-label="Ver">Ver</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        }
      />
      <GenerateReportModal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, report: null })} report={modalState.report} onGenerate={handleGenerateReport} />
    </>
  );
};

export default ReportesPage;
