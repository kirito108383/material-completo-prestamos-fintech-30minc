import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditApplication, AdvisorActionLog, ClientLiveQuery } from '../types';
import { formatEUR } from '../utils/financialCalculations';
import {
  Users,
  MessageSquare,
  BookOpen,
  Phone,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  UserCheck,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Search,
  Filter,
  PlusCircle,
  HelpCircle,
  LogOut,
  Sparkles,
  Zap,
  ArrowRight,
  Calendar,
  Building,
  CreditCard,
  MessageCircle,
  PhoneCall,
  Save,
  Smartphone,
  Mail,
  X,
  Settings,
  Printer,
  Headphones,
  Volume2,
  Bot,
  FileJson
} from 'lucide-react';
import { AdvisorScriptsProtocol } from './admin/AdvisorScriptsProtocol';
import { AdvisorDetailedScriptsManual } from './admin/AdvisorDetailedScriptsManual';
import { PrintableAdvisorProtocolsManual } from './admin/PrintableAdvisorProtocolsManual';
import { AdvisorOperationalManual } from './admin/AdvisorOperationalManual';
import { CallCenterLiveCopilot } from './admin/CallCenterLiveCopilot';
import { AdvisorSmartGlossaryAssistant } from './admin/AdvisorSmartGlossaryAssistant';
import { ProjectBlueprintJsonExporter } from './admin/ProjectBlueprintJsonExporter';
import { ReadyToUseOperationalHub } from './admin/ReadyToUseOperationalHub';
import { WhatsAppAdvisorToolkit } from './admin/WhatsAppAdvisorToolkit';
import { FacebookAdMarketingCreator } from './admin/FacebookAdMarketingCreator';
import { CommunicationTemplateManager } from './admin/CommunicationTemplateManager';
import { DidacticCustomerFormModal } from './forms/DidacticCustomerFormModal';

export const AdvisorDashboard: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    currentAdvisor,
    setCurrentAdvisor,
    advisorsList,
    logAdvisorAction,
    clientQueries,
    sendClientMessageToQuery,
    updateQueryStatus,
    setIsAdvisorView,
    setIsAdminView,
    isAdvisorLoggedIn,
    logoutAdvisor,
    isAdminLoggedIn,
    openStaffAuthModal,
    openDocumentModal,
    openTicketModal,
    openUserBankPortal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'centro_operativo_listo' | 'procedimientos' | 'glosario_asistente' | 'copiloto_callcenter' | 'blueprint_json' | 'whatsapp_toolkit' | 'plantillas_correo_sms' | 'consultas' | 'formularios' | 'publicidad_facebook' | 'libretos' | 'manual' | 'expedientes'>('centro_operativo_listo');
  const [libretosSubTab, setLibretosSubTab] = useState<'manual_imprimible' | 'whatsapp_objeciones' | 'protocolos_llamadas'>('manual_imprimible');
  const [isDidacticModalOpen, setIsDidacticModalOpen] = useState(false);
  const [didacticModalApp, setDidacticModalApp] = useState<CreditApplication | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedQueryId, setSelectedQueryId] = useState<string>(clientQueries[0]?.id || '');
  const [replyMessage, setReplyMessage] = useState('');

  // Action log form modal
  const [isLogActionModalOpen, setIsLogActionModalOpen] = useState(false);
  const [logActionType, setLogActionType] = useState<AdvisorActionLog['actionType']>('llamada');
  const [logSummary, setLogSummary] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Filter applications assigned to this advisor or all
  const assignedApps = applications.filter(
    (app) => !app.assignedAdvisorId || app.assignedAdvisorId === currentAdvisor.id
  );

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.personalData.documentNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      `${app.personalData.firstName} ${app.personalData.lastName}`.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSearch;
  });

  const currentSelectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  // Procedure Guide Generator (Tailored SOP per applicant condition)
  const getProcedureGuide = (app: CreditApplication) => {
    const isForeign = app.personalData.documentType === 'NIE' || app.personalData.documentType === 'Pasaporte';
    const isSelfEmployed = app.economicData.occupation === 'Autónomo / Profesional';

    if (app.status === 'Pendiente') {
      return {
        priority: 'ALTA (Onboarding Nuevo)',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
        objective: 'Verificar identidad DNI/NIE, validar titularidad IBAN en España y completar documentación.',
        steps: [
          `Paso 1: Llamar al móvil (+34) ${app.personalData.phone} o enviar WhatsApp corporativo de bienvenida.`,
          isForeign
            ? `Paso 2 [EXTRANJERO RESIDENTE]: Cotejar vigencia de tarjeta TIE/NIE y verificar permiso de trabajo en vigor.`
            : `Paso 2: Confirmar fecha de caducidad del DNI (${app.personalData.documentExpiryDate || 'en verificación'}).`,
          `Paso 3: Validar que el IBAN (${app.bankDetails.bankName}) esté a su nombre conforme a normativa SEPBLAC.`,
          `Paso 4: Si todo está en orden, avanzar expediente a estado "En Revisión".`
        ],
        recommendedAction: 'Llamar al cliente para validar datos y solicitar justificantes.'
      };
    }

    if (app.status === 'En Revisión') {
      return {
        priority: 'URGENTE (Decisión de Crédito)',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        objective: 'Analizar solvencia en ASNEF/CIRBE y verificar capacidad de reembolso con nómina o IRPF.',
        steps: [
          isSelfEmployed
            ? `Paso 1 [AUTÓNOMO]: Revisar Modelo 130/100 de IRPF o certificado de bases de cotización de la Seguridad Social.`
            : `Paso 1: Cotejar última nómina mensual (ingresos declarados: ${formatEUR(app.economicData.monthlyIncome)}).`,
          `Paso 2: Comprobar que no conste en ASNEF con deudas financieras vivas superiores a 1.000 €.`,
          `Paso 3: Verificar que el ratio de endeudamiento no supere el 35% de los ingresos líquidos.`,
          `Paso 4: Aprobar el capital solicitado de ${formatEUR(app.loanDetails.capital)} o sugerir importe ajustado.`
        ],
        recommendedAction: 'Aprobar solicitud para habilitar firma de pagaré o solicitar documentación adicional.'
      };
    }

    if (app.status === 'Aprobado') {
      return {
        priority: 'MEDIA (Listo para Desembolso)',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        objective: 'Acreditar el desembolso en la Cuenta Digital Instacredit y guiar al cliente para transferir.',
        steps: [
          `Paso 1: Confirmar que el pagaré desmaterializado esté firmado con token OTP SMS (${app.signatureDetails.otpCode}).`,
          `Paso 2: Pulsar el botón "Desembolsar Fondos" en el panel para cargar ${formatEUR(app.approvedAmount || app.loanDetails.capital)} al saldo.`,
          `Paso 3: Enviar mensaje de WhatsApp/SMS informando que sus fondos ya están disponibles en su Cuenta Digital IBAN.`,
          `Paso 4: Explicar cómo retirar a su banco por Bizum o Transferencia SEPA Instantánea.`
        ],
        recommendedAction: 'Proceder al desembolso inmediato y notificar al cliente.'
      };
    }

    if (app.status === 'Desembolsado') {
      return {
        priority: 'SEGUIMIENTO Y FIDELIZACIÓN',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        objective: 'Acompañamiento en el disfrute del préstamo, recordatorio preventivo de cuota y Bizum.',
        steps: [
          `Paso 1: Verificar que el cliente haya recibido los fondos en su Cuenta Digital o en su banco externo.`,
          `Paso 2: Recordar amistosamente la fecha de vencimiento fijada para el ${app.loanDetails.dueDate}.`,
          `Paso 3: Informar que puede amortizar anticipadamente sin comisión en cualquier momento por Bizum.`,
          `Paso 4: Ofrecer aumento de cupo crediticio de hasta 3.000 € tras el pago puntual de la operación.`
        ],
        recommendedAction: 'Monitorear consultas del cliente y registrar interacciones de satisfacción.'
      };
    }

    return {
      priority: 'INFORMATIVA',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      objective: 'Notificar al cliente el motivo denegatorio y orientar sobre alternativas.',
      steps: [
        `Paso 1: Informar con cortesía que la operación no ha superado los filtros de solvencia conforme a Ley 16/2011.`,
        `Paso 2: Indicar que podrá formular nueva solicitud transcurridos 60 días naturales.`,
        `Paso 3: Registrar la resolución en la bitácora interna.`
      ],
      recommendedAction: 'Cerrar expediente con registro de motivos en el sistema.'
    };
  };

  const handleSaveActionLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logSummary.trim() || !currentSelectedApp) return;

    logAdvisorAction(currentSelectedApp.id, {
      advisorId: currentAdvisor.id,
      advisorName: currentAdvisor.name,
      actionType: logActionType,
      summary: logSummary,
      clientNotes: logNotes
    });

    setIsLogActionModalOpen(false);
    setLogSummary('');
    setLogNotes('');
    setActionSuccessNotice('¡Acción registrada en la bitácora del cliente correctamente!');
    setTimeout(() => setActionSuccessNotice(null), 3500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedQueryId) return;

    sendClientMessageToQuery(selectedQueryId, replyMessage, 'asesor');
    setReplyMessage('');
    setActionSuccessNotice('¡Mensaje enviado al cliente y notificación generada!');
    setTimeout(() => setActionSuccessNotice(null), 3000);
  };

  const selectedQuery = clientQueries.find((q) => q.id === selectedQueryId) || clientQueries[0];

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col font-sans">
      {/* Top Header for Advisors */}
      <header className="bg-[#0B1B3D] text-white shadow-lg sticky top-0 z-30 border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline font-black text-2xl tracking-tight">
              <span className="text-white">INSTA</span>
              <span className="text-[#0066FF] ml-0.5">CREDIT</span>
              <span className="text-[#00E599] text-xs font-bold ml-1.5 uppercase">España</span>
            </div>
            <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full hidden sm:inline-block">
              Portal del Asesor & Empleados
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Advisor Selector / Switcher */}
            <div className="flex items-center gap-2 bg-blue-950/80 px-3 py-1.5 rounded-2xl border border-blue-800">
              <img
                src={currentAdvisor.avatar}
                alt={currentAdvisor.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-400"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentAdvisor.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-blue-300 font-medium">{currentAdvisor.roleTitle}</div>
              </div>
              <select
                value={currentAdvisor.id}
                onChange={(e) => {
                  const adv = advisorsList.find((a) => a.id === e.target.value);
                  if (adv) setCurrentAdvisor(adv);
                }}
                className="bg-transparent text-slate-200 text-xs font-bold focus:outline-hidden cursor-pointer"
                title="Cambiar asesor en sesión"
              >
                {advisorsList.map((a) => (
                  <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                    {a.name} ({a.id})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveTab('blueprint_json')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Ver y Descargar Archivo .JSON Maestro de todo el Proyecto"
            >
              <FileJson className="w-3.5 h-3.5 text-[#00E599]" />
              <span>📦 .JSON Maestro</span>
            </button>

            <button
              onClick={() => setActiveTab('centro_operativo_listo')}
              className="px-3.5 py-1.5 rounded-xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Abrir todo el material listo para usar: Rutina guiada, Paquetes Imagen+Mensaje, Audios para clientes, URLs directas y Contratos 4 páginas"
            >
              <Zap className="w-4 h-4" />
              <span>⚡ Material Listo para Enviar (Audios + URLs + Kits)</span>
            </button>

            <button
              onClick={() => setActiveTab('glosario_asistente')}
              className="px-3 py-1.5 rounded-xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Abrir Glosario-Asistente que responde cualquier duda y lo hace todo por el asesor en 1 clic"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>🤖 Glosario-Asistente (Hazlo Todo)</span>
            </button>

            <button
              onClick={() => setActiveTab('copiloto_callcenter')}
              className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-blue-500 text-white font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Abrir Copiloto de Call Center en Tiempo Real (Voz, Visual y Plantillas de Envío)"
            >
              <Headphones className="w-3.5 h-3.5 text-[#00E599]" />
              <span>🎧 Copiloto Call Center</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B1B3D] font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Abrir Guía Instructiva Auditiva, Visual y Didáctica para Asesores (Desde Cero)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>🔊 Guía Asesor (De Cero)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('libretos');
                setLibretosSubTab('manual_imprimible');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Abrir e imprimir libretos oficiales de los 4 casos comunes para asesores"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Libretos A4</span>
            </button>

            <button
              onClick={() => setIsAdvisorView(false)}
              className="px-3 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition flex items-center gap-1 cursor-pointer border border-blue-700/50"
              title="Volver a la vista del cliente sin cerrar sesión"
            >
              <span>Ver Web Cliente</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setIsAdvisorView(false);
                  setIsAdminView(true);
                } else {
                  openStaffAuthModal('admin');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="Acceso al Panel Central de Administrador"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Panel Admin' : 'Admin (Clave)'}</span>
            </button>

            <button
              onClick={logoutAdvisor}
              className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-700 text-white font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="Cerrar sesión de asesor de forma segura"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-[#0E2452] px-4 sm:px-6 lg:px-8 border-t border-blue-950 flex overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('centro_operativo_listo')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'centro_operativo_listo'
                ? 'border-[#00E599] text-white bg-emerald-900/50'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-[#00E599]" />
            <span>⚡ Material Listo para Usar (Rutina + Audios + URLs Directas + Contratos 4 Págs)</span>
          </button>

          <button
            onClick={() => setActiveTab('procedimientos')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'procedimientos'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-[#00E599]" />
            <span>Guía de Procedimientos & Clientes ({assignedApps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('glosario_asistente')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'glosario_asistente'
                ? 'border-[#00E599] text-white bg-emerald-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-[#00E599]" />
            <span>📖🤖 Glosario-Asistente (Te Explica y Lo Hace Todo)</span>
          </button>

          <button
            onClick={() => setActiveTab('copiloto_callcenter')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'copiloto_callcenter'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4 text-[#00E599]" />
            <span>🎧 Copiloto Call Center (Voz + Plantillas de Envío)</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp_toolkit')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'whatsapp_toolkit'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Toolkit & Libretos por Etapas</span>
          </button>

          <button
            onClick={() => setActiveTab('plantillas_correo_sms')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'plantillas_correo_sms'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-300" />
            <span>Plantillas Correo & SMS</span>
          </button>

          <button
            onClick={() => setActiveTab('formularios')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'formularios'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Formularios Didácticos con Voz</span>
          </button>

          <button
            onClick={() => setActiveTab('publicidad_facebook')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'publicidad_facebook'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Publicidad Facebook (2.000€ a 100.000€)</span>
          </button>

          <button
            onClick={() => setActiveTab('consultas')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'consultas'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <span>Consultas en Vivo ({clientQueries.filter((q) => q.status === 'pendiente').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('libretos')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'libretos'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4 text-[#00E599]" />
            <span>Libretos & P&R Imprimibles (4 Casos)</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'manual'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>🔊 Guía Instructiva Auditiva & Visual (Desde Cero)</span>
          </button>

          <button
            onClick={() => setActiveTab('expedientes')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'expedientes'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Bitácora ({applications.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Banner notification notice */}
        {actionSuccessNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccessNotice}</span>
            </div>
            <button onClick={() => setActionSuccessNotice(null)} className="p-1 text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: GUÍA DE PROCEDIMIENTOS PERSONALIZADA POR CLIENTE */}
        {activeTab === 'procedimientos' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-gradient-to-r from-[#0B1B3D] via-[#0D245A] to-[#0055FF] text-white p-6 rounded-3xl shadow-lg border border-blue-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  Protocolo de Atención Personalizada en Vivo
                </span>
                <h2 className="text-2xl font-black tracking-tight">
                  Guía de Procedimientos para Asesores
                </h2>
                <p className="text-xs text-blue-100 max-w-2xl mt-1 leading-relaxed">
                  Sistema inteligente que evalúa la situación exacta de cada solicitante (nacionalidad, documentación aportada, score ASNEF/CIRBE) y le indica al asesor cómo proceder paso a paso para brindar una atención prioritaria de máxima excelencia.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-blue-100 space-y-1 shrink-0">
                <div className="font-bold text-[#00E599] flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Rúbrica de Calidad Activa
                </div>
                <div>• Turno: {currentAdvisor.name}</div>
                <div>• Cartera asignada: {assignedApps.length} clientes</div>
                <div>• Tiempo de respuesta medio: 4.8 min</div>
              </div>
            </div>

            {/* Main Interactive Grid: Client List on Left, Active SOP Guide on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Applications List (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Solicitudes en tu Cartera ({applications.length})
                  </span>
                  <span className="text-[11px] text-slate-500">Haz clic para ver su protocolo</span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Buscar por DNI/NIE, radicado o nombre..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {filteredApps.map((app) => {
                    const isSelected = app.id === currentSelectedApp?.id;
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/20'
                            : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="font-mono text-xs font-black text-[#0B1B3D]">{app.id}</span>
                            <h4 className="text-xs font-black text-slate-900 mt-0.5">
                              {app.personalData.firstName} {app.personalData.lastName}
                            </h4>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {app.personalData.documentType} {app.personalData.documentNumber} ({app.personalData.countryOfResidence})
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                                app.status === 'Desembolsado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'Aprobado'
                                  ? 'bg-purple-100 text-purple-800'
                                  : app.status === 'En Revisión'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {app.status}
                            </span>
                            <div className="text-xs font-black text-[#0066FF] mt-1 tabular-nums">
                              {formatEUR(app.approvedAmount || app.loanDetails.capital)}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="truncate max-w-[200px]">🎯 {app.loanDetails.loanPurpose}</span>
                          <span className="font-semibold text-[#0066FF] flex items-center gap-1">
                            <span>Ver Guía</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Dynamic Tailored SOP & Action Center (7 cols) */}
              {currentSelectedApp && (
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                  {/* Client Snapshot Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                          {currentSelectedApp.id}
                        </span>
                        <span className="text-xs text-slate-400">Expediente Oficial</span>
                      </div>
                      <h3 className="text-lg font-black text-[#0B1B3D]">
                        {currentSelectedApp.personalData.firstName} {currentSelectedApp.personalData.lastName}
                      </h3>
                      <div className="text-xs text-slate-600 flex flex-wrap gap-2 mt-1">
                        <span>📱 {currentSelectedApp.personalData.phone}</span>
                        <span>✉️ {currentSelectedApp.personalData.email}</span>
                        <span>📍 {currentSelectedApp.economicData.city} ({currentSelectedApp.economicData.province})</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsLogActionModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00E599] text-[#0B1B3D] font-black text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer hover:opacity-95"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Registrar Acción</span>
                      </button>
                    </div>
                  </div>

                  {/* SOP Guide Card based on Status & Demographics */}
                  {(() => {
                    const guide = getProcedureGuide(currentSelectedApp);
                    return (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#0066FF]" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#0B1B3D]">
                              Procedimiento Operativo Específico (SOP Asesor)
                            </h4>
                          </div>
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${guide.badgeColor}`}>
                            {guide.priority}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
                          <strong className="text-slate-900 block mb-0.5">Objetivo Inmediato del Asesor:</strong>
                          <span>{guide.objective}</span>
                        </div>

                        {/* Step by step checklist */}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-800 uppercase">
                            Checklist de Pasos a Seguir con este Cliente:
                          </div>
                          <div className="space-y-2">
                            {guide.steps.map((st, i) => (
                              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                                <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="leading-snug">{st}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Direct Trigger Action Bar */}
                        <div className="pt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                                const speechText = `Instrucción en tiempo real para atender a ${currentSelectedApp.personalData.firstName} ${currentSelectedApp.personalData.lastName}. Estado actual: ${currentSelectedApp.status}. Objetivo: ${guide.objective}. Pasos a seguir: ${guide.steps.join('. ')}`;
                                const utt = new SpeechSynthesisUtterance(speechText);
                                utt.lang = 'es-ES';
                                window.speechSynthesis.speak(utt);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B1B3D] font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>🔊 Escuchar Qué Hacer (Voz en Vivo)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab('copiloto_callcenter')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Headphones className="w-3.5 h-3.5 text-[#00E599]" />
                            <span>🎧 Abrir Copiloto y Plantillas para este Cliente</span>
                          </button>

                          <a
                            href={`tel:${currentSelectedApp.personalData.phone}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-black transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Llamar (+34)</span>
                          </a>

                          <a
                            href={`https://wa.me/${currentSelectedApp.personalData.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(currentSelectedApp.personalData.firstName)},%20te%20escribo%20de%20Instacredit%20Espa%C3%B1a%20en%20referencia%20a%20tu%20solicitud%20${currentSelectedApp.id}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Abrir WhatsApp</span>
                          </a>

                          <button
                            onClick={() => openDocumentModal(currentSelectedApp, 'pagare_en_blanco')}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0066FF] font-bold text-xs flex items-center gap-1.5 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Ver Pagaré eIDAS</span>
                          </button>

                          <button
                            onClick={() => openUserBankPortal(currentSelectedApp)}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center gap-1.5 border border-purple-200 hover:bg-purple-100 transition cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Ver Cuenta IBAN</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Financial & Economic Snapshot */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Capital Solicitado</span>
                      <span className="text-base font-black text-[#0B1B3D] tabular-nums">
                        {formatEUR(currentSelectedApp.loanDetails.capital)}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Plazo Amortización</span>
                      <span className="text-base font-black text-[#0B1B3D]">
                        {currentSelectedApp.loanDetails.termDays} días
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Ingresos Netos</span>
                      <span className="text-base font-black text-emerald-700 tabular-nums">
                        {formatEUR(currentSelectedApp.economicData.monthlyIncome)}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Ocupación</span>
                      <span className="text-xs font-bold text-slate-800 truncate block">
                        {currentSelectedApp.economicData.occupation}
                      </span>
                    </div>
                  </div>

                  {/* History of Actions & Comments on this client */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-[#0B1B3D] flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>Bitácora de Acciones Registradas ({currentSelectedApp.advisorActionLogs.length})</span>
                      </h4>
                      <button
                        onClick={() => setIsLogActionModalOpen(true)}
                        className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Añadir Nota</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {currentSelectedApp.advisorActionLogs.map((log) => (
                        <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#0B1B3D] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                              {log.advisorName} • {log.actionType.toUpperCase()}
                            </span>
                            <span className="text-slate-400 font-mono">{log.timestamp}</span>
                          </div>
                          <p className="text-slate-700 font-medium">{log.summary}</p>
                          {log.clientNotes && (
                            <p className="text-slate-500 italic text-[11px] bg-white p-2 rounded-lg border border-slate-100">
                              "{log.clientNotes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: WHATSAPP TOOLKIT */}
        {activeTab === 'whatsapp_toolkit' && (
          <WhatsAppAdvisorToolkit
            onOpenDidacticForm={(app) => {
              setDidacticModalApp(app || null);
              setIsDidacticModalOpen(true);
            }}
          />
        )}

        {/* TAB: PLANTILLAS CORREO Y SMS */}
        {activeTab === 'plantillas_correo_sms' && (
          <CommunicationTemplateManager />
        )}

        {/* TAB 2: CONSULTAS EN VIVO / CHAT PENDIENTE */}
        {activeTab === 'consultas' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-[#0066FF] uppercase">Bandeja de Consultas Omnicanal</span>
                <h3 className="text-xl font-black text-[#0B1B3D]">Atención de Clientes en Directo</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Responde a las preguntas formuladas desde la burbuja de chat web y el área de clientes PWA.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>En Línea: {currentAdvisor.name}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Queue of queries (4 cols) */}
              <div className="lg:col-span-4 space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400 px-1">Cola de Mensajes ({clientQueries.length})</div>
                <div className="space-y-2">
                  {clientQueries.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQueryId(q.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                        selectedQuery?.id === q.id
                          ? 'bg-white border-[#0066FF] shadow-sm ring-2 ring-[#0066FF]/20'
                          : 'bg-white/80 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#0B1B3D]">{q.clientName}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          q.status === 'pendiente' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 line-clamp-1">{q.topic}</div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">"{q.lastMessage}"</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread View (8 cols) */}
              {selectedQuery && (
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[500px]">
                  <div>
                    {/* Thread Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <h4 className="font-black text-sm text-[#0B1B3D]">{selectedQuery.clientName}</h4>
                        <p className="text-xs text-slate-500">{selectedQuery.topic} • Contacto: {selectedQuery.clientContact}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={selectedQuery.status}
                          onChange={(e) => updateQueryStatus(selectedQuery.id, e.target.value as any)}
                          className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-300 bg-white"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_gestion">En Gestión</option>
                          <option value="resuelta">Resuelta</option>
                        </select>
                      </div>
                    </div>

                    {/* Messages history */}
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {selectedQuery.history.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col ${msg.sender === 'asesor' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs ${
                              msg.sender === 'asesor'
                                ? 'bg-[#0066FF] text-white rounded-br-none'
                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span className={`text-[10px] block mt-1 ${msg.sender === 'asesor' ? 'text-blue-100' : 'text-slate-400'}`}>
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder={`Escribe una respuesta como ${currentAdvisor.name}...`}
                        className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CENTRO OPERATIVO 100% LISTO PARA USAR (RUTINA, AUDIOS, URLS, NO RESPONDE, CONTRATOS 4 PÁGS) */}
        {activeTab === 'centro_operativo_listo' && <ReadyToUseOperationalHub />}

        {/* TAB: ARCHIVO .JSON MAESTRO DEL PROYECTO */}
        {activeTab === 'blueprint_json' && <ProjectBlueprintJsonExporter />}

        {/* TAB: GLOSARIO-ASISTENTE INTELIGENTE (TE EXPLICA Y LO HACE TODO POR TI) */}
        {activeTab === 'glosario_asistente' && (
          <AdvisorSmartGlossaryAssistant
            preselectedAppId={currentSelectedApp?.id}
            onOpenDidacticForm={(app) => {
              setDidacticModalApp(app || currentSelectedApp);
              setIsDidacticModalOpen(true);
            }}
          />
        )}

        {/* TAB: COPILOTO DE CALL CENTER EN TIEMPO REAL */}
        {activeTab === 'copiloto_callcenter' && (
          <CallCenterLiveCopilot
            preselectedAppId={currentSelectedApp?.id}
            onOpenDidacticForm={(app) => {
              setDidacticModalApp(app || currentSelectedApp);
              setIsDidacticModalOpen(true);
            }}
          />
        )}

        {/* TAB 3: LIBRETOS & PROTOCOLOS */}
        {activeTab === 'libretos' && (
          <div className="space-y-6">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLibretosSubTab('manual_imprimible')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  libretosSubTab === 'manual_imprimible'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Printer className="w-3.5 h-3.5 text-[#00E599]" />
                <span>🖨️ Manual Imprimible A4: 4 Casos Comunes (P&R, Qué Saber y Qué Hacer)</span>
              </button>

              <button
                type="button"
                onClick={() => setLibretosSubTab('whatsapp_objeciones')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  libretosSubTab === 'whatsapp_objeciones'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Manual de Libretos para WhatsApp (4 Categorías & Objeciones)</span>
              </button>

              <button
                type="button"
                onClick={() => setLibretosSubTab('protocolos_llamadas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  libretosSubTab === 'protocolos_llamadas'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Protocolos Telefónicos & Scripts Institucionales</span>
              </button>
            </div>

            {libretosSubTab === 'manual_imprimible' && <PrintableAdvisorProtocolsManual />}
            {libretosSubTab === 'whatsapp_objeciones' && <AdvisorDetailedScriptsManual />}
            {libretosSubTab === 'protocolos_llamadas' && <AdvisorScriptsProtocol />}
          </div>
        )}

        {/* TAB 4: MANUAL OPERATIVO */}
        {activeTab === 'manual' && <AdvisorOperationalManual />}

        {/* TAB 5: BITÁCORA Y EXPEDIENTES GENERALES */}
        {activeTab === 'expedientes' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-xl font-black text-[#0B1B3D]">Historial de Solicitudes y Bitácoras de Asesoría</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Registro de trazabilidad y auditoría de todas las acciones tomadas por el equipo de atención al cliente.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Radicado / Cliente</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5">Asesor Asignado</th>
                    <th className="p-3.5">Capital</th>
                    <th className="p-3.5">Última Acción Registrada</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-[#0B1B3D]">{app.id}</div>
                        <div className="font-bold text-slate-900">{app.personalData.firstName} {app.personalData.lastName}</div>
                        <div className="text-[11px] text-slate-400">{app.personalData.documentType} {app.personalData.documentNumber}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-50 text-[#0066FF] border border-blue-200">
                          {app.status}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">
                          {app.assignedAdvisorName || 'Sin asignar'}
                        </span>
                      </td>

                      <td className="p-3.5 font-black text-[#0066FF] tabular-nums">
                        {formatEUR(app.approvedAmount || app.loanDetails.capital)}
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <div className="text-[11px] text-slate-700 truncate">
                          {app.advisorActionLogs[0]?.summary || 'Sin acciones registradas aún'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {app.advisorActionLogs[0]?.timestamp || ''}
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedAppId(app.id);
                            setActiveTab('procedimientos');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1B3D] font-bold text-xs transition cursor-pointer"
                        >
                          Ver Guía
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: WHATSAPP TOOLKIT & LIBRETOS POR ETAPAS */}
        {activeTab === 'whatsapp_toolkit' && (
          <WhatsAppAdvisorToolkit
            onOpenDidacticForm={(app) => {
              setDidacticModalApp(app || currentSelectedApp);
              setIsDidacticModalOpen(true);
            }}
          />
        )}

        {/* TAB: FORMULARIOS DIDÁCTICOS CON VOZ */}
        {activeTab === 'formularios' && (
          <div className="space-y-6">
            <div className="bg-[#0B1B3D] text-white p-6 rounded-3xl shadow-xl border border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5" />
                    Formularios Inclusivos & Didácticos
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  Formularios Interactivos con Asistente de Voz para Clientes
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                  Diseñados con letra grande, alto contraste y síntesis de voz en español para clientes con dificultades visuales, baja comprensión lectora o que prefieren una atención guiada paso a paso.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDidacticModalApp(currentSelectedApp);
                  setIsDidacticModalOpen(true);
                }}
                className="px-5 py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#00E599]" />
                <span>Abrir Formulario Asistido</span>
              </button>
            </div>

            {/* Quick Cards of all 8 private sequential forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  num: 'URL 1',
                  cat: 'solicitud' as const,
                  title: '1. Cuestionario de Solicitud e Importe',
                  desc: 'URL privada independiente para confirmar capital (2.000€ - 100.000€), plazo y propósito con voz.'
                },
                {
                  num: 'URL 2',
                  cat: 'registro_cuenta' as const,
                  title: '2. Registro y Creación de Cuenta Digital',
                  desc: 'URL privada donde el cliente crea su PIN y activa su Cuenta Interna + 2 Tarjetas Virtuales.'
                },
                {
                  num: 'URL 3',
                  cat: 'conocerte_kyc' as const,
                  title: '3. Formulario "Para Conocerte" + Fotos DNI/Recibo',
                  desc: 'Pide nº documento, fecha nacimiento y expedición, dirección y fotos de DNI y recibo domiciliario.'
                },
                {
                  num: 'URL 4',
                  cat: 'actividad_laboral' as const,
                  title: '4. Estudio "¿A Qué Te Dedicas?" + Fotos Laborales',
                  desc: 'Estudio riguroso de profesión, empresa, ingresos y fotos obligatorias de nómina/IRPF y actividad.'
                },
                {
                  num: 'URL 5',
                  cat: 'iban' as const,
                  title: '5. Vinculación de IBAN Personal + Foto Titularidad',
                  desc: 'Vincula el IBAN español propio (ES...) y foto bancaria para transferir desde la Cuenta Interna.'
                },
                {
                  num: 'URL 6',
                  cat: 'cuota_firma' as const,
                  title: '6. Contratos con Sellos, Garantía y Firma eIDAS',
                  desc: 'Revisión de contratos con marca de agua, cláusula de garantía sin comisiones previas y firma táctil.'
                },
                {
                  num: 'URL 7',
                  cat: 'prorroga' as const,
                  title: '7. Recordatorio de Pagos, Fechas y Prórroga',
                  desc: 'Gestión de calendario de vencimientos y solicitud de aplazamiento legal (+15, +30 o +45 días).'
                },
                {
                  num: 'URL 8',
                  cat: 'reclamacion' as const,
                  title: '8. Encuesta Post-Transferencia y Cupo VIP',
                  desc: 'Cuestionario final cuando el cliente ya transfirió a su banco personal para ampliar su cupo.'
                }
              ].map((item) => (
                <div
                  key={item.cat}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0B1B3D] text-[#00E599] text-[10px] font-black font-mono">
                        {item.num} • PRIVADA
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        /?form={item.cat}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#0B1B3D]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDidacticForm(currentSelectedApp, item.cat)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-blue-50 text-[#0066FF] font-black text-xs rounded-xl border border-slate-200 transition cursor-pointer"
                  >
                    Abrir URL Privada ({item.num})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PUBLICIDAD FACEBOOK */}
        {activeTab === 'publicidad_facebook' && (
          <FacebookAdMarketingCreator />
        )}

      </main>

      {/* Didactic Customer Form Modal */}
      {isDidacticModalOpen && (
        <DidacticCustomerFormModal
          isOpen={isDidacticModalOpen}
          onClose={() => setIsDidacticModalOpen(false)}
          preselectedApp={didacticModalApp || currentSelectedApp}
        />
      )}

      {/* Modal: Registrar Acción de Asesor */}
      {isLogActionModalOpen && currentSelectedApp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-black text-sm text-[#0B1B3D]">
                  Registrar Acción en Expediente
                </h4>
                <p className="text-[11px] text-slate-500">
                  Cliente: {currentSelectedApp.personalData.firstName} {currentSelectedApp.personalData.lastName} ({currentSelectedApp.id})
                </p>
              </div>
              <button onClick={() => setIsLogActionModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActionLog} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Acción Realizada</label>
                <select
                  value={logActionType}
                  onChange={(e) => setLogActionType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="llamada">Llamada Telefónica Realizada</option>
                  <option value="whatsapp">Mensaje de WhatsApp Enviado</option>
                  <option value="email">Correo Electrónico Remitido</option>
                  <option value="documento_solicitado">Justificante de Nómina/DNI Solicitado</option>
                  <option value="bizum_enviado">Instrucciones de Pago Bizum Enviadas</option>
                  <option value="aprobacion">Validación de Riesgo / Aprobación</option>
                  <option value="nota_interna">Nota Interna de Supervisión</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resumen de la Gestión *</label>
                <input
                  type="text"
                  value={logSummary}
                  onChange={(e) => setLogSummary(e.target.value)}
                  placeholder="Ej. Se valida DNI por videollamada y se confirma motivo de reforma."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Comentarios / Respuesta del Cliente (Opcional)</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Anotaciones sobre la disposición del cliente o acuerdos de fecha..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogActionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar en Bitácora</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Smart Glossary-Assistant Launcher for Untrained Advisors */}
      {activeTab !== 'glosario_asistente' && (
        <div className="fixed bottom-5 right-5 z-40 print:hidden">
          <button
            type="button"
            onClick={() => {
              setActiveTab('glosario_asistente');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3.5 rounded-2xl bg-[#0B1B3D] hover:bg-slate-900 text-white border-2 border-[#00E599] shadow-2xl flex items-center gap-3 cursor-pointer transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00E599] text-[#0B1B3D] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase text-[#00E599]">
                ¿No sabes qué significa algo o qué hacer?
              </div>
              <div className="text-xs font-black text-white">
                📖🤖 Abrir Glosario-Asistente (Te Guía y Lo Hace Todo)
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
