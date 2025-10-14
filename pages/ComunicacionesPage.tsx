import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Inbox,
  Send,
  Edit,
  Trash2,
  Archive,
  Settings,
  CheckCircle,
  Clock,
  XCircle,
  CheckCheck,
  Save,
  Info,
  Users,
} from 'lucide-react';
import { track } from '@/analytics/track';
import { AutomaticNotification } from '@/types';
import { formatUserName } from '@/utils/helpers';
import { formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';
import parseISO from 'date-fns/parseISO';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import KpiCard from '@/ui/KpiCard';
import Card from '@/ui/Card';
import Input from '@/ui/Input';

const mockMessages = [
  {
    id: 1,
    from: 'Dirección Académica',
    subject: 'Recordatorio: Cierre de Notas del 2do Bimestre',
    snippet: 'Estimados docentes, se les recuerda que la fecha límite para el registro de notas...',
    timestamp: 'hace 2 horas',
    read: false,
    folder: 'inbox',
  },
  {
    id: 2,
    from: 'Secretaría',
    subject: 'Actualización de Ficha de Matrícula',
    snippet: 'Se solicita a los padres de familia del 3er Grado "B" acercarse a secretaría para...',
    timestamp: 'hace 1 día',
    read: true,
    folder: 'inbox',
  },
  {
    id: 3,
    to: 'Docentes de Primaria',
    subject: 'Convocatoria a Reunión de Coordinación',
    snippet: 'Se convoca a todos los docentes del nivel primario a la reunión de coordinación...',
    timestamp: 'hace 2 días',
    folder: 'sent',
  },
];

const mockAutomaticMessages: AutomaticNotification[] = [
    { id: 'noti-1', studentName: 'QUISPE MAMANI, JUAN CARLOS', studentId: '72345678', type: 'Entrada', message: 'Ingresó a la institución', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), status: 'Leído' },
    { id: 'noti-2', studentName: 'GONZALES DIAZ, MARIA FERNANDA', studentId: '79876543', type: 'Entrada', message: 'Ingresó a la institución', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), status: 'Entregado' },
    { id: 'noti-3', studentName: 'RODRIGUEZ GUTIERREZ, SOFIA', studentId: '83650193', type: 'Entrada', message: 'Ingresó a la institución', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: 'Enviado' },
    { id: 'noti-4', studentName: 'LOPEZ CASTILLO, MATEO', studentId: '81240865', type: 'Entrada', message: 'Ingresó a la institución', timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), status: 'Fallido', error: 'Número no registrado en WhatsApp.' },
    { id: 'noti-5', studentName: 'GARCIA MARTINEZ, VALENTINA', studentId: '82398471', type: 'Entrada', message: 'Ingresó a la institución', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), status: 'En cola' },
];

const StatusPill: React.FC<{ status: AutomaticNotification['status'] }> = ({ status }) => {
    const statusConfig: Record<AutomaticNotification['status'], { icon: React.ElementType, color: string }> = {
        'En cola': { icon: Clock, color: 'text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-700' },
        'Enviado': { icon: Send, color: 'text-sky-600 bg-sky-100 dark:text-sky-400 dark:bg-sky-500/20' },
        'Entregado': { icon: CheckCircle, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20' },
        'Leído': { icon: CheckCheck, color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20' },
        'Fallido': { icon: XCircle, color: 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/20' },
    };
    const { icon: Icon, color } = statusConfig[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
            <Icon size={14} />
            {status}
        </span>
    );
};

const AutomaticSendsTab = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <KpiCard title="Enviados Hoy" value="2,345" icon={Send} />
            <KpiCard title="En Cola" value="5" icon={Clock} />
            <KpiCard title="Fallidos Hoy" value="12" icon={XCircle} />
        </div>
        <Card>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Última Actividad</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {mockAutomaticMessages.map(msg => (
                    <div key={msg.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><Users size={20} className="text-slate-500"/></div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-100">{formatUserName(msg.studentName)}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{msg.message} a las {formatDistanceToNow(parseISO(msg.timestamp), { locale: es, addSuffix: true })}</p>
                                {msg.status === 'Fallido' && <p className="text-xs text-rose-500 mt-1">{msg.error}</p>}
                            </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <StatusPill status={msg.status} />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

const SettingsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Configuración de API de WhatsApp</h2>
            <form className="space-y-4">
                <Input label="Código de País" id="country-code" type="text" defaultValue="+51" aria-label="Código de País" />
                <Input label="Número de Teléfono de WhatsApp" id="phone-number" type="text" placeholder="Ej: 987654321" aria-label="Número de Teléfono" />
                <Input label="URL del Servidor (Webhook)" id="server-url" type="text" placeholder="https://..." aria-label="URL del Servidor" />
                <Input label="Token de Acceso" id="access-token" type="password" aria-label="Token de Acceso" />
                 <Button variant="filled" icon={Save} aria-label="Guardar Configuración">Guardar Configuración</Button>
            </form>
        </Card>
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Plantillas de Mensajes</h2>
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                    <p className="font-mono">"Su hijo/a {'{Nombre}'} ingresó a las {'{Hora}'} y se encuentra presente."</p>
                </div>
                <Button variant="tonal" className="mt-4 w-full !justify-center" aria-label="Gestionar Plantillas">Gestionar Plantillas</Button>
            </Card>
             <Card>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2"><Info size={20}/> Política de Consentimiento</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Para enviar notificaciones iniciadas por la institución (como avisos de asistencia), WhatsApp requiere el consentimiento explícito (Opt-In) de los padres. Asegúrese de obtener este permiso durante el proceso de matrícula.
                </p>
            </Card>
        </div>
    </div>
);

const InboxTab: React.FC<{ messages: any[], onSelectMessage: (msg: any) => void, selectedMessage: any }> = ({ messages, onSelectMessage, selectedMessage }) => {
    return (
      <div className="flex-grow grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-0">
        <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
          <nav className="space-y-1">
            {/* FIX: Add missing aria-label property */}
            <Button variant="tonal" icon={Inbox} className="w-full !justify-start !text-sm" aria-label="Bandeja de Entrada">Bandeja de Entrada</Button>
            {/* FIX: Add missing aria-label property */}
            <Button variant="text" icon={Send} className="w-full !justify-start !text-sm" aria-label="Enviados">Enviados</Button>
          </nav>
        </div>
        <div className="md:col-span-3 lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {messages.slice(0, 4).map((msg) => (
              <div key={msg.id} className="list-none">
                <Button
                  variant="text" onClick={() => onSelectMessage(msg)} aria-label={`Seleccionar mensaje: ${msg.subject}`}
                  className={`w-full !h-auto !justify-start text-left !p-3 !rounded-none border-l-4 ${selectedMessage?.id === msg.id ? 'border-indigo-500 bg-slate-50 dark:bg-slate-700/50' : `border-transparent ${!msg.read && 'font-bold'}`} hover:!bg-slate-50 dark:hover:!bg-slate-700/50`}>
                  <div>
                    <div className="flex justify-between items-baseline"><p className="text-sm text-slate-800 dark:text-slate-100">{msg.from || msg.to}</p><p className="text-xs text-slate-400">{msg.timestamp}</p></div>
                    <p className="text-sm mt-1 text-slate-700 dark:text-slate-200">{msg.subject}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">{msg.snippet}</p>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 p-5 overflow-y-auto">
          {selectedMessage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedMessage.subject}</h2>
                <div className="flex items-center gap-1"><IconButton aria-label="Archivar mensaje" variant="text" icon={Archive} /><IconButton aria-label="Eliminar mensaje" variant="text" icon={Trash2} /></div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">{selectedMessage.from ? selectedMessage.from.charAt(0) : 'Y'}</div>
                <div><p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{selectedMessage.from || 'Yo'}</p><p className="text-xs text-slate-500 dark:text-slate-400">Para: {selectedMessage.to || 'Mí'}</p></div>
              </div>
              <div className="mt-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3"><p>{selectedMessage.snippet}</p><p>Este es un cuerpo de mensaje de ejemplo.</p></div>
            </motion.div>
          )}
        </div>
      </div>
    );
};

const ComunicacionesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('automaticos');
  const [selectedMessage, setSelectedMessage] = useState(mockMessages.find(m => m.folder === 'inbox'));
  const filteredMessages = mockMessages.filter((m) => m.folder === 'inbox');

  const handleSelectMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      track('message_read', { messageId: msg.id });
    }
  };

  const tabs = [
    { id: 'bandeja', label: 'Bandeja de Entrada', icon: Inbox },
    { id: 'automaticos', label: 'Envíos Automáticos', icon: Send },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <ModulePage
      title="Comunicaciones Internas"
      description="Envíe y reciba comunicados, gestione avisos automáticos y configure integraciones."
      icon={MessageSquare}
      actionsRight={ activeTab === 'bandeja' && <Button variant="filled" aria-label="Redactar nuevo mensaje" icon={Edit} onClick={() => track('message_compose_started')}>Redactar</Button> }
      filters={
          <nav className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
            {tabs.map((tab) => (
                <Button key={tab.id} variant="text" onClick={() => setActiveTab(tab.id)} icon={tab.icon} aria-label={`Ver ${tab.label}`}
                className={`!rounded-b-none !border-b-2 ${activeTab === tab.id ? '!border-indigo-600 !text-indigo-600 dark:!text-indigo-400' : 'border-transparent text-slate-500 hover:!text-slate-800 dark:hover:!text-slate-200'}`}>
                    {tab.label}
                </Button>
            ))}
          </nav>
      }
      content={
        <div className="flex-grow min-h-0">
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                  {activeTab === 'bandeja' && <InboxTab messages={filteredMessages} onSelectMessage={handleSelectMessage} selectedMessage={selectedMessage} />}
                  {activeTab === 'automaticos' && <AutomaticSendsTab />}
                  {activeTab === 'configuracion' && <SettingsTab />}
                </motion.div>
            </AnimatePresence>
        </div>
      }
    />
  );
};

export default ComunicacionesPage;