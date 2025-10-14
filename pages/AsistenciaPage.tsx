import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import es from 'date-fns/locale/es';
import {
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  BarChart2,
  AlertTriangle,
  Info as InfoIcon,
  Download,
  File,
  X,
  Loader2,
  ClipboardCheck,
} from 'lucide-react';
import Button from '@/ui/Button';
import BarChart from '@/ui/BarChart';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useDataStore } from '@/store/dataStore';
import { useUserStore } from '@/store/userStore';
import Skeleton from '@/ui/Skeleton';
import Drawer from '@/ui/Drawer';
import Modal from '@/ui/Modal';
import { PopulationFocus, TimeRange, Level } from '@/types';
import { ControlBar } from '@/components/asistencia/ControlBar';
import IconButton from '@/ui/IconButton';
import Select from '@/ui/Select';
import { ModulePage } from '@/layouts/ModulePage';

const KpiSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
    <div className="flex justify-between items-start">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
    <Skeleton className="h-8 w-20" />
    <Skeleton className="h-3 w-32" />
  </div>
);

const AttendanceKpiCard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}> = ({ title, value, change, icon: Icon, color }) => {
  const isNegative = change < 0;
  const changeColor = isNegative ? 'text-emerald-500' : 'text-rose-500';
  const changeSymbol = isNegative ? '↘' : '↗';

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Icon className={color} size={18} />
          <h3 className="font-semibold text-sm text-slate-600 dark:text-slate-300">{title}</h3>
        </div>
        <IconButton icon={MoreHorizontal} variant="text" aria-label="Más opciones" className="!w-7 !h-7" />
      </div>
      <p className="text-4xl font-bold mt-2 text-slate-800 dark:text-slate-100">{value}</p>
      <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${changeColor}`}>
        {changeSymbol} {Math.abs(change)} vs periodo anterior
      </p>
    </div>
  );
};

const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void; filters: any }> = ({ isOpen, onClose, filters }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onClose();
    }, 1500);
  };

  const footerContent = (
    <div className="flex justify-end gap-2">
      <Button variant="tonal" onClick={onClose} aria-label="Cancelar">
        Cancelar
      </Button>
      <Button
        variant="filled"
        onClick={handleGenerate}
        disabled={isGenerating}
        icon={isGenerating ? () => <Loader2 className="animate-spin" /> : Download}
        aria-label="Generar Reporte"
      >
        {isGenerating ? 'Generando...' : 'Generar'}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generar Reporte" size="md" footer={footerContent}>
      <div className="space-y-4">
        <p>Se generará un reporte con los siguientes filtros:</p>
        <ul className="text-sm list-disc list-inside bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
          <li>
            Población: <span className="font-semibold capitalize">{filters.populationFocus}</span>
          </li>
          <li>
            Periodo: <span className="font-semibold capitalize">{filters.timeRange}</span>
          </li>
        </ul>
        <Select label="Formato" aria-label="Seleccionar formato de reporte">
          <option>PDF</option>
          <option>XLSX</option>
        </Select>
      </div>
    </Modal>
  );
};

const AlertDetailDrawer: React.FC<{ isOpen: boolean; onClose: () => void; alert: any }> = ({ isOpen, onClose, alert }) => (
  <Drawer isOpen={isOpen} onClose={onClose} title={alert?.title || 'Detalle de Alerta'}>
    {alert && (
      <div className="space-y-4">
        <p>{alert.description}</p>
        <p className="text-sm text-slate-500">
          <strong>Sección:</strong> 5to Grado B
        </p>
        <h4 className="font-semibold pt-4 border-t border-slate-200 dark:border-slate-700">
          Estudiantes Involucrados:
        </h4>
        <ul className="text-sm list-disc list-inside">
          <li>Mendoza Castillo, Luis Fernando</li>
          <li>Quispe Rojas, Ana Sofía</li>
        </ul>
        <div className="pt-4 flex gap-2">
          <Button variant="tonal" aria-label="Contactar / Notificar">
            Contactar / Notificar
          </Button>
          <Button variant="filled" aria-label="Registrar Seguimiento">
            Registrar Seguimiento
          </Button>
        </div>
      </div>
    )}
  </Drawer>
);

const AsistenciaPage: React.FC = () => {
  const [filters, setFilters] = useState({
    populationFocus: 'Estudiantes' as PopulationFocus,
    timeRange: 'Semana' as TimeRange,
    level: 'Todos' as Level,
    grade: 'all',
    section: 'all',
  });

  const { attendanceData: data, isAttendanceLoading: isLoading, fetchAttendanceData } = useAttendanceStore();
  const { gradesAndSections } = useDataStore();
  const { students, staff } = useUserStore();

  useEffect(() => {
    fetchAttendanceData(
      {
        ...filters,
        populationFocus: filters.populationFocus.toLowerCase(),
        timeRange: filters.timeRange.toLowerCase(),
        level: filters.level.toLowerCase(),
      },
      students.length,
      staff.length
    );
  }, [filters, fetchAttendanceData, students.length, staff.length]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [alertDetail, setAlertDetail] = useState<{ isOpen: boolean; alert: any }>({ isOpen: false, alert: null });

  const chartTitle = useMemo(() => {
    const now = new Date(2025, 9, 5); // Sunday, Oct 5, 2025 for consistency
    let startDate: Date;
    let endDate: Date;

    switch (filters.timeRange) {
      case 'Hoy':
        startDate = now;
        endDate = now;
        return `Tendencia de ${filters.timeRange}: ${format(startDate, "d 'de' MMMM, yyyy", { locale: es })}`;
      case 'Semana':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'Mes':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'Bimestre':
        // A bimestre is 2 months. Let's approximate with quarters for simplicity
        startDate = startOfQuarter(now);
        endDate = endOfQuarter(now);
        break;
    }

    const startFormat = isSameMonth(startDate, endDate) ? 'd' : "d 'de' MMMM";
    const endFormat = "d 'de' MMMM, yyyy";

    return `Tendencia ${filters.timeRange}: ${format(startDate, startFormat, { locale: es })} al ${format(
      endDate,
      endFormat,
      { locale: es }
    )}`;
  }, [filters.timeRange]);

  const setPopulationFocus = (p: PopulationFocus) => setFilters((f) => ({ ...f, populationFocus: p }));
  const setTimeRange = (t: TimeRange) => setFilters((f) => ({ ...f, timeRange: t }));
  const setLevel = (l: Level) => setFilters((f) => ({ ...f, level: l, grade: 'all', section: 'all' }));
  const setGrade = (g: string) => setFilters((f) => ({ ...f, grade: g, section: 'all' }));
  const setSection = (s: string) => setFilters((f) => ({ ...f, section: s }));

  return (
    <>
      <ModulePage
        title="Módulo de Asistencia"
        description="Monitoree y gestione la asistencia de estudiantes y personal en tiempo real."
        icon={ClipboardCheck}
        actionsRight={
          <Button
            variant="filled"
            icon={Download}
            onClick={() => setIsReportModalOpen(true)}
            aria-label="Generar Reporte de Asistencia"
          >
            Generar Reporte
          </Button>
        }
        kpis={
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <KpiSkeleton key={i} />)
              : data.kpis.map((kpi, index) => (
                  <motion.div key={index} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <AttendanceKpiCard {...kpi} />
                  </motion.div>
                ))}
          </motion.div>
        }
        filters={
          <ControlBar
            populationFocus={filters.populationFocus}
            setPopulationFocus={setPopulationFocus}
            timeRange={filters.timeRange}
            setTimeRange={setTimeRange}
            level={filters.level}
            setLevel={setLevel}
            grade={filters.grade}
            setGrade={setGrade}
            section={filters.section}
            setSection={setSection}
            gradesAndSections={gradesAndSections}
          />
        }
        content={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col min-h-[450px]"
            >
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 capitalize">{chartTitle}</h2>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 rounded-full">
                  Asistencia (%)
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 rounded-full">
                  Tardanzas (%)
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 rounded-full">
                  Faltas (%)
                </span>
              </div>
              <div className="flex-grow mt-4">
                {isLoading ? <Skeleton className="w-full h-full" /> : <BarChart data={data.chartData} />}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <h2 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Alertas de Asistencia</h2>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : data.alerts.length > 0 ? (
                <div className="space-y-3">
                  {data.alerts.slice(0, 2).map((alert, i) => {
                    const colors = {
                      critical:
                        'border-rose-200 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300',
                      warning:
                        'border-amber-200 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300',
                      info: 'border-sky-200 dark:border-sky-500/50 bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-300',
                    };
                    const Icon = alert.icon;
                    return (
                      <div key={i} className={`p-3 rounded-xl border ${colors[alert.type as keyof typeof colors]}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Icon size={18} />
                            <h4 className="font-bold text-sm">{alert.title}</h4>
                          </div>
                          <IconButton icon={MoreHorizontal} variant="text" aria-label="Más opciones" className="!w-7 !h-7 -mt-1 -mr-1" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{alert.description}</p>
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-xs text-slate-400 dark:text-slate-500">{alert.time}</p>
                          <Button
                            variant="text"
                            onClick={() => setAlertDetail({ isOpen: true, alert: alert })}
                            aria-label={`Ver detalle de alerta: ${alert.title}`}
                            className="!h-auto !px-2 !text-xs"
                          >
                            Ver detalle
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={32} className="mx-auto text-emerald-500" />
                  <h4 className="font-semibold mt-2 text-sm">Todo en orden</h4>
                  <p className="text-xs text-slate-500">No hay alertas de asistencia activas.</p>
                </div>
              )}
            </motion.div>
          </div>
        }
      />
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} filters={filters} />
      <AlertDetailDrawer
        isOpen={alertDetail.isOpen}
        onClose={() => setAlertDetail({ isOpen: false, alert: null })}
        alert={alertDetail.alert}
      />
    </>
  );
};

export default AsistenciaPage;
