import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { teacherQuickActions } from '@/data/dashboard';
import {
  QrCode,
  BookCheck,
  MessageSquare,
  FileText,
  Sparkles,
  ArrowRight,
  X,
  Copy,
} from 'lucide-react';
import Modal from '@/ui/Modal';
import Button from '@/ui/Button';

const PROMPT_TEXT = `Eres un asistente de IA experto en el desarrollo de sistemas de gestión escolar (SGE) para colegios públicos en Perú. Tu tarea es describir en detalle el SGE "chat pro bv" para la IEE 6049 Ricardo Palma.

**Nombre del Sistema:** chat pro bv (Sistema de Gestión Escolar Moderno)

**Contexto:**
El sistema está diseñado para la Institución Educativa Emblemática 6049 Ricardo Palma en Lima, Perú. Atiende las necesidades de directores, docentes, estudiantes y apoderados, enfocándose en la simplicidad, un diseño mobile-first y la digitalización de procesos clave.

**Principios de Diseño y Tecnología:**
- **Mobile-First y Responsivo:** Interfaz optimizada para cualquier dispositivo (móvil, tablet, escritorio).
- **Offline-First (PWA):** Funcionalidades críticas como la toma de asistencia funcionan sin conexión a internet y se sincronizan automáticamente al recuperar la conexión.
- **UI/UX Moderna:** Interfaz limpia, intuitiva y estéticamente agradable, construida con TailwindCSS y animaciones fluidas con Framer Motion para una experiencia de usuario superior.
- **Accesibilidad (ARIA):** Cumple con estándares de accesibilidad para ser usable por todos.
- **Centralización:** Unifica la información y procesos en una sola plataforma, evitando la dispersión de datos.

**Sistema de Diseño y Estilo Visual (Implementado con React, TailwindCSS y Framer Motion):**

- **Paleta de Colores:**
    - **Primario:** Índigo (indigo-600) para acciones principales, enlaces activos y branding, creando una sensación de profesionalismo y confianza.
    - **Neutrales:** Una escala de grises "Slate" (slate-50 a slate-800) para textos, fondos y bordes, asegurando una alta legibilidad y una apariencia limpia.
    - **Acentos y Estados:**
        - **Éxito:** Esmeralda (emerald-500) para notificaciones de éxito y estados positivos.
        - **Alerta/Advertencia:** Ámbar (amber-500) para alertas y estados que requieren atención.
        - **Peligro/Error:** Rosa (rose-500) para errores, acciones destructivas y alertas críticas.
    - **Gradientes:** Uso de degradados sutiles (\`bg-gradient-to-br\`) en los KPIs del dashboard (ej. \`from-sky-400 to-blue-500\`) para darles profundidad y atractivo visual.

- **Tipografía:**
    - **Fuente Principal:** 'Poppins' (importada de Google Fonts), una fuente sans-serif geométrica que es moderna, legible y amigable.
    - **Jerarquía:**
        - **Títulos (\`h1\`, \`h2\`):** \`font-bold\` o \`font-extrabold\` para un fuerte impacto visual.
        - **Texto de Párrafo:** \`font-normal\` (400) para una lectura cómoda.
        - **Botones y Etiquetas:** \`font-semibold\` o \`font-medium\` (600/500) para resaltar acciones e información clave.

- **Layout y Componentes:**
    - **Estructura General:** Un layout de 2 columnas con una barra lateral (\`Sidebar\`) fija a la izquierda (colapsable) y un área de contenido principal a la derecha que incluye una cabecera (\`Header\`) fija en la parte superior.
    - **Tarjetas (Cards):** Componente base para encapsular información. Utilizan esquinas redondeadas (\`rounded-xl\` o \`rounded-2xl\`), una sombra sutil que se intensifica al pasar el mouse (\`shadow-sm hover:shadow-lg\`) y un borde fino (\`border-gray-100\`) para una apariencia elevada.
    - **Botones:** Estilos consistentes con esquinas redondeadas (\`rounded-lg\` o \`rounded-full\`), efectos de hover claros y, para acciones primarias, un color de fondo sólido con sombra.
    - **Tablas:** Diseñadas para ser limpias y legibles, con cabeceras de color sutil (\`bg-slate-50\`), divisores de fila finos y un efecto de hover (\`hover:bg-slate-50\`) para mejorar la usabilidad.
    - **Espaciado:** Uso generoso de padding y márgenes para evitar una interfaz abarrotada y mejorar la claridad visual.

- **Iconografía:**
    - **Biblioteca:** \`lucide-react\`. Se utiliza un único set de iconos para garantizar la consistencia visual en toda la aplicación. Los íconos son limpios, modernos y fáciles de entender.

- **Animaciones y Microinteracciones (Framer Motion):**
    - **Transiciones de Página:** Las páginas se desvanecen y deslizan suavemente al navegar, proporcionando una experiencia de aplicación de una sola página (SPA) fluida.
    - **Interacción con Elementos:** Los botones y tarjetas tienen animaciones sutiles al pasar el mouse (\`whileHover\`) y al hacer clic (\`whileTap\`), como un ligero levantamiento o escalado, que proporcionan retroalimentación visual al usuario.
    - **Aparición de Elementos:** Listas y elementos de la interfaz aparecen de forma escalonada (\`staggerChildren\`) para guiar la atención del usuario.
    - **Modales y Pop-ups:** Emergen con animaciones de escala y desvanecimiento (\`AnimatePresence\`), centrando la atención del usuario en la tarea actual.

**Módulos Principales y Funcionalidades:**

1.  **Inicio (Dashboard):**
    *   **Público:** Director.
    *   **Función:** Vista panorámica del estado de la institución.
    *   **Componentes:**
        *   **KPIs (Indicadores Clave):** Matrícula activa, asistencia del periodo, incidencias diarias, hitos próximos.
        *   **Acciones Frecuentes:** Atajos a tareas críticas como tomar asistencia por QR, revisar notas, enviar comunicados y generar reportes.
        *   **Tareas y Alertas:** Notificaciones sobre actas pendientes de aprobación, estudiantes con inasistencias, solicitudes de materiales, etc.
        *   **Calendario Académico:** Vista de eventos, fechas de cierre, y actividades programadas.

2.  **Usuarios:**
    *   **Público:** Director/Administrador.
    *   **Función:** Gestión integral de perfiles de personal y estudiantes.
    *   **Componentes:**
        *   **Pestaña Personal:** Búsqueda, filtrado por nivel y área, y edición de datos del personal docente y administrativo. Vistas en formato lista y grilla.
        *   **Pestaña Estudiantes:** Navegación por niveles (Inicial, Primaria, Secundaria), visualización por grado y sección, y acceso a la ficha de cada estudiante.

3.  **Matrícula:**
    *   **Público:** Director/Administrador.
    *   **Función:** Administrar el proceso de matrícula y traslados.
    *   **Componentes:**
        *   **Listado de Estudiantes:** Búsqueda, paginación, y vista rápida del estado de matrícula (Matriculado, Trasladado, Retirado).
        *   **Integración SIAGIE (simulada):** Botones para importar datos desde la plataforma oficial del MINEDU.
        *   **Registro de Nueva Matrícula:** Formulario para matricular nuevos estudiantes.
        *   **Ficha del Estudiante:** Modal con detalles completos del alumno.

4.  **Módulo Académico (Exclusivo para Director):**
    *   **Público:** Director.
    *   **Función:** Supervisión y gestión de todo el proceso académico del periodo.
    *   **Componentes:**
        *   **Panel Principal:** Resumen del avance de carga de notas, estado de actas y alumnos en riesgo.
        *   **Avance por Docente:** Tabla detallada del progreso de cada docente en el registro de calificaciones, con barras de progreso y estado (Al día, En riesgo, Atrasado).
        *   **Monitoreo de Cursos y Estudiantes:** Módulos para supervisar el rendimiento por materia y detectar alumnos con bajo rendimiento o ausentismo.
        *   **Gestión de Actas y Certificados:** Flujo de aprobación para actas de notas y generación de certificados oficiales.
        *   **Reportes Académicos:** Descarga de informes consolidados.
        *   **Configuración:** Definición de periodos, ponderaciones y competencias.

5.  **Asistencia:**
    *   **Público:** Director, Docentes.
    *   **Función:** Registro y monitoreo de la asistencia en tiempo real.
    *   **Componentes:**
        *   **Escáner QR:** Utiliza la cámara del dispositivo para leer el código QR del carnet del estudiante y registrar su asistencia instantáneamente. Funciona offline.
        *   **Lista de Asistencia en Vivo:** Muestra en tiempo real los estudiantes registrados, con su foto, nombre y hora de ingreso.
        *   **Dashboard de Asistencia:** Resumen diario y por periodo de la asistencia de estudiantes y docentes, con KPIs y reportes.
        *   **Justificación de Faltas:** Sistema para registrar y aprobar justificaciones de inasistencias.

6.  **Comunicaciones:**
    *   **Público:** Director, Docentes.
    *   **Función:** Sistema de mensajería interna para comunicados oficiales y coordinación.
    *   **Componentes:**
        *   **Bandeja de Entrada/Enviados:** Interfaz similar a un cliente de correo electrónico.
        *   **Compositor de Mensajes:** Permite enviar mensajes a individuos o grupos de contacto (ej. "Docentes de Primaria").
        *   **Integración Multicanal (simulada):** Opciones para enviar copias por Email o WhatsApp.

7.  **Módulos Adicionales (en desarrollo):**
    *   **Reportes:** Generador de informes personalizables para UGEL y uso interno.
    *   **Recursos:** Inventario de biblioteca, laboratorios y reserva de espacios.
    *   **Administración y Finanzas:** Gestión de ingresos, gastos y cuotas de APAFA.
    *   **Convivencia Escolar:** Registro de incidencias y enlace a la plataforma SíseVe del MINEDU.
    *   **Ayuda:** Centro de soporte con manuales y FAQs.`;

const PromptModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const footerContent = (
    <div className="flex justify-end">
      <Button
        variant="filled"
        onClick={handleCopy}
        disabled={copied}
        icon={Copy}
        aria-label={copied ? 'Prompt copiado' : 'Copiar Prompt'}
      >
        {copied ? '¡Copiado!' : 'Copiar Prompt'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prompt Detallado del Sistema"
      size="7xl"
      footer={footerContent}
    >
      <div className="bg-slate-50 dark:bg-slate-900 -m-6 p-6 h-[calc(90vh-150px)] overflow-y-auto">
        <pre className="text-sm whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
          {PROMPT_TEXT}
        </pre>
      </div>
    </Modal>
  );
};

const quickActions = teacherQuickActions;

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isPromptModalOpen, setPromptModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Hola de nuevo, Docente 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">Aquí tiene acceso rápido a sus tareas principales.</p>
        </div>

        <div className="space-y-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.text}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98, y: -1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={() => {
                if (action.path === '#prompt') {
                  setPromptModalOpen(true);
                } else {
                  navigate(action.path);
                }
              }}
              className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl font-semibold hover:shadow-md dark:hover:bg-slate-700/50 border border-slate-200/80 dark:border-slate-700/80 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${action.styleClasses}`}>
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }}>
                    <action.icon size={24} />
                  </motion.div>
                </div>
                <span className="text-base font-semibold text-slate-700 dark:text-slate-100">{action.text}</span>
              </div>
              <ArrowRight
                size={20}
                className="text-slate-400 dark:text-slate-500 mr-2 transition-transform group-hover:translate-x-1"
              />
            </motion.button>
          ))}
        </div>
      </div>
      <PromptModal isOpen={isPromptModalOpen} onClose={() => setPromptModalOpen(false)} />
    </>
  );
};

export default TeacherDashboard;
