import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditApplication, DocumentType, LoanStatus } from '../../types';
import { formatEUR } from '../../utils/financialCalculations';
import { generateLegalDocument } from '../../utils/legalTemplates';
import { exportDocumentToPdf, exportReceiptTicketToPdf } from '../../utils/pdfGenerator';
import {
  Users,
  FileText,
  Settings,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Save,
  Phone,
  Mail,
  Share2,
  Calendar,
  Building,
  RefreshCw,
  LogOut,
  ChevronRight,
  Stamp,
  Wallet,
  DollarSign,
  Edit3,
  BookOpen,
  MessageSquare,
  SlidersHorizontal,
  Compass,
  Headphones,
  UserCheck,
  UserPlus,
  UserCog,
  Sparkles,
  Printer,
  Bot,
  FileJson,
  Zap
} from 'lucide-react';
import { AdvisorScriptsProtocol } from './AdvisorScriptsProtocol';
import { AdvisorOperationalManual } from './AdvisorOperationalManual';
import { AdvisorDetailedScriptsManual } from './AdvisorDetailedScriptsManual';
import { PrintableAdvisorProtocolsManual } from './PrintableAdvisorProtocolsManual';
import { CallCenterLiveCopilot } from './CallCenterLiveCopilot';
import { AdvisorSmartGlossaryAssistant } from './AdvisorSmartGlossaryAssistant';
import { ProjectBlueprintJsonExporter } from './ProjectBlueprintJsonExporter';
import { ReadyToUseOperationalHub } from './ReadyToUseOperationalHub';
import { SystemFormsInspector } from './SystemFormsInspector';
import { FacebookAdMarketingCreator } from './FacebookAdMarketingCreator';
import { WhatsAppAdvisorToolkit } from './WhatsAppAdvisorToolkit';
import { CommunicationTemplateManager } from './CommunicationTemplateManager';
import { AdminUserEditModal } from './AdminUserEditModal';
import { AdminManualRegisterModal } from './AdminManualRegisterModal';
import { DidacticCustomerFormModal } from '../forms/DidacticCustomerFormModal';

export const AdminDashboard: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    updateApplicationApprovedAmount,
    openDocumentModal,
    openTicketModal,
    openUserBankPortal,
    platformConfig,
    updatePlatformConfig,
    pqrsRecords,
    updatePqrsStatus,
    setIsAdminView,
    setIsAdvisorView,
    isAdvisorLoggedIn,
    openStaffAuthModal,
    logoutAdmin,
    advisorsList,
    assignAdvisorToApplication
  } = useApp();

  const [activeTab, setActiveTab] = useState<'centro_operativo_listo' | 'solicitudes' | 'blueprint_json' | 'glosario_asistente' | 'copiloto_callcenter' | 'documentos' | 'whatsapp_toolkit' | 'plantillas_comunicacion' | 'publicidad_facebook' | 'asesores' | 'libretos_imprimibles' | 'manual' | 'formularios' | 'configuracion' | 'pqrs'>('centro_operativo_listo');
  const [manualSubTab, setManualSubTab] = useState<'libretos_whatsapp' | 'operativo_bde'>('operativo_bde');
  const [isDidacticModalOpen, setIsDidacticModalOpen] = useState(false);
  const [didacticModalApp, setDidacticModalApp] = useState<CreditApplication | null>(null);
  const [isManualRegisterModalOpen, setIsManualRegisterModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<CreditApplication | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedAppIdForDocs, setSelectedAppIdForDocs] = useState<string>(applications[0]?.id || '');
  const [selectedDocTypeForViewer, setSelectedDocTypeForViewer] = useState<DocumentType>('contrato_mutuo');
  const [activeDocPageNum, setActiveDocPageNum] = useState<number>(1);

  // Modal to adjust approved amount (up to 100.000 €)
  const [editingAppForAmount, setEditingAppForAmount] = useState<CreditApplication | null>(null);
  const [newApprovedAmountInput, setNewApprovedAmountInput] = useState<number>(5000);

  // Config form local state
  const [configForm, setConfigForm] = useState(platformConfig);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.digitalAccount.accountNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.personalData.documentNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      `${app.personalData.firstName} ${app.personalData.lastName}`.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalApplications = applications.length;
  const totalDisbursed = applications
    .filter((a) => a.status === 'Desembolsado')
    .reduce((acc, a) => acc + (a.approvedAmount || a.loanDetails.capital), 0);
  const approvedCount = applications.filter((a) => a.status === 'Aprobado' || a.status === 'Desembolsado').length;
  const inReviewCount = applications.filter((a) => a.status === 'Pendiente' || a.status === 'En Revisión').length;

  const currentSelectedApp = applications.find((a) => a.id === selectedAppIdForDocs) || applications[0];
  const renderedDoc = currentSelectedApp ? generateLegalDocument(currentSelectedApp, selectedDocTypeForViewer) : null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformConfig(configForm);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleApplyApprovedAmount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppForAmount || newApprovedAmountInput <= 0) return;
    updateApplicationApprovedAmount(editingAppForAmount.id, newApprovedAmountInput);
    setEditingAppForAmount(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-[#0B1B3D] text-white shadow-lg sticky top-0 z-30 border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline font-black text-2xl tracking-tight">
              <span className="text-white">INSTA</span>
              <span className="text-[#0066FF] ml-0.5">CREDIT</span>
              <span className="text-[#00E599] text-xs font-bold ml-1.5 uppercase">España</span>
            </div>
            <span className="bg-[#0066FF]/20 text-[#00E599] border border-emerald-400/40 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full hidden sm:inline-block">
              Supervisión Banco de España (BdE)
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-bold">
            <button
              onClick={() => {
                if (isAdvisorLoggedIn) {
                  setIsAdminView(false);
                  setIsAdvisorView(true);
                } else {
                  openStaffAuthModal('advisor');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Ir al Portal de Asesores de Servicio al Cliente"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{isAdvisorLoggedIn ? 'Portal Asesor' : 'Portal Asesor (PIN)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('libretos_imprimibles')}
              className="px-3 py-1.5 rounded-xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-extrabold transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="Abrir dossier de libretos para imprimir y entregar a los asesores"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Libretos A4</span>
            </button>

            <button
              onClick={() => setIsAdminView(false)}
              className="px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-200 hover:text-white transition flex items-center gap-1 cursor-pointer border border-blue-800"
            >
              <span>Ver Web Pública</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-700 text-white transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
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
            onClick={() => setActiveTab('solicitudes')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'solicitudes'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>Solicitudes & Asignación ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blueprint_json')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'blueprint_json'
                ? 'border-[#00E599] text-white bg-purple-900/50'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <FileJson className="w-4 h-4 text-[#00E599]" />
            <span>📦 Archivo .JSON Maestro del Proyecto</span>
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
            <span>📖🤖 Glosario-Asistente (Te Guía y Lo Hace Todo)</span>
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
            <span>🎧 Copiloto Call Center (Voz + Plantillas)</span>
          </button>

          <button
            onClick={() => setActiveTab('documentos')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'documentos'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Documentos Legales (4 Páginas)</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp_toolkit')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'whatsapp_toolkit'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Toolkit & Libretos</span>
          </button>

          <button
            onClick={() => setActiveTab('plantillas_comunicacion')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'plantillas_comunicacion'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-300" />
            <span>Plantillas Correo & SMS</span>
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
            onClick={() => setActiveTab('libretos_imprimibles')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'libretos_imprimibles'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4 text-[#00E599]" />
            <span>🖨️ Libretos Imprimibles (4 Casos Asesor)</span>
          </button>

          <button
            onClick={() => setActiveTab('asesores')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'asesores'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#00E599]" />
            <span>Libretos & Protocolos Asesor</span>
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
            <span>🔊 Guía Instructiva Auditiva & Manual Asesor</span>
          </button>

          <button
            onClick={() => setActiveTab('formularios')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'formularios'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>Formularios del Sistema</span>
          </button>

          <button
            onClick={() => setActiveTab('configuracion')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'configuracion'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Canales & WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('pqrs')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'pqrs'
                ? 'border-[#0066FF] text-white bg-blue-900/40'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Reclamaciones SAC & BdE ({pqrsRecords.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* TAB 1: SOLICITUDES DE CRÉDITO */}
        {activeTab === 'solicitudes' && (
          <div className="space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Solicitudes</span>
                <div className="text-2xl font-black text-[#0B1B3D] mt-1">{totalApplications}</div>
                <div className="text-[11px] text-slate-500 mt-1">Registradas con Cuenta IBAN España</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase">Capital Desembolsado</span>
                <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                  {formatEUR(totalDisbursed)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Desembolsos SEPA Instant / Bizum</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase">Créditos Aprobados</span>
                <div className="text-2xl font-black text-[#0066FF] mt-1">{approvedCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Con pagaré eIDAS formalizado</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase">En Verificación</span>
                <div className="text-2xl font-black text-amber-500 mt-1">{inReviewCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Revisión ASNEF / Nómina / CIRBE</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Buscar por radicado, IBAN, DNI/NIE o nombre..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-600">Estado:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="todos">Todos los Estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Revisión">En Revisión</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Desembolsado">Desembolsado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>

                {/* Primary CTA: Register Manually */}
                <button
                  type="button"
                  onClick={() => setIsManualRegisterModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Dar de alta una nueva solicitud o cliente de forma manual"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Registrar Manualmente</span>
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Radicado / IBAN</th>
                      <th className="p-4">Solicitante</th>
                      <th className="p-4">Asesor Asignado</th>
                      <th className="p-4">Monto Solicitado</th>
                      <th className="p-4">Monto Aprobado</th>
                      <th className="p-4">Saldo IBAN</th>
                      <th className="p-4">Decisión Admin</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4">
                          <div className="font-mono font-bold text-[#0B1B3D]">{app.id}</div>
                          <div className="text-[10px] text-[#0066FF] font-mono">{app.digitalAccount.accountNumber}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">
                            {app.personalData.firstName} {app.personalData.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {app.personalData.documentType} {app.personalData.documentNumber} ({app.personalData.countryOfResidence})
                          </div>
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              <span>🎯</span>
                              <span>{app.economicData.loanPurpose || app.loanDetails.loanPurpose || 'Libre inversión'}</span>
                            </span>
                          </div>
                        </td>

                        {/* Asesor Asignado Dropdown */}
                        <td className="p-4">
                          <select
                            value={app.assignedAdvisorId || ''}
                            onChange={(e) => assignAdvisorToApplication(app.id, e.target.value)}
                            className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 cursor-pointer shadow-2xs focus:ring-2 focus:ring-[#0066FF]"
                          >
                            <option value="">-- Sin Asignar --</option>
                            {advisorsList.map((adv) => (
                              <option key={adv.id} value={adv.id}>
                                {adv.name}
                              </option>
                            ))}
                          </select>
                          {app.assignedAdvisorName && (
                            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                              Asignado: {app.assignedAdvisorName}
                            </div>
                          )}
                        </td>

                        <td className="p-4 tabular-nums">
                          <div className="font-bold text-slate-700">{formatEUR(app.loanDetails.capital)}</div>
                          <div className="text-[10px] text-slate-400">{app.loanDetails.termDays} días</div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-[#0066FF] tabular-nums">
                              {formatEUR(app.approvedAmount || app.loanDetails.capital)}
                            </span>
                            <button
                              onClick={() => {
                                setEditingAppForAmount(app);
                                setNewApprovedAmountInput(app.approvedAmount || app.loanDetails.capital);
                              }}
                              className="p-1 text-slate-400 hover:text-[#0066FF] rounded cursor-pointer"
                              title="Ajustar cantidad estimada aprobada"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-black text-emerald-700 tabular-nums">
                            {formatEUR(app.digitalAccount.balance)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {app.digitalAccount.balance === 0 ? 'Sin recarga/desembolso' : 'Saldo líquido'}
                          </div>
                        </td>

                        <td className="p-4">
                          <select
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value as LoanStatus)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-black border cursor-pointer ${
                              app.status === 'Desembolsado'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : app.status === 'Aprobado'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : app.status === 'En Revisión'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : app.status === 'Rechazado'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-gray-50 text-gray-700 border-gray-300'
                            }`}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Revisión">En Revisión</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="Desembolsado">Desembolsado</option>
                            <option value="Rechazado">Rechazado</option>
                          </select>
                        </td>

                        <td className="p-4 text-right space-x-1 whitespace-nowrap">
                          {/* Desembolsar Fondos Directos si está Aprobado */}
                          {app.status === 'Aprobado' && (
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'Desembolsado')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition cursor-pointer"
                              title="Desembolsar directamente al saldo de la Cuenta Digital del usuario"
                            >
                              Desembolsar
                            </button>
                          )}

                          {/* Ver y Editar Todos los Datos del Usuario (Corrección de errores) */}
                          <button
                            onClick={() => setUserToEdit(app)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Ver y editar todos los datos del usuario (corregir erratas en DNI, teléfono, IBAN o ingresos)"
                          >
                            <UserCog className="w-4 h-4" />
                          </button>

                          {/* Ver Cuenta Digital del Usuario */}
                          <button
                            onClick={() => openUserBankPortal(app)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Ver Cuenta Bancaria Digital de este solicitante"
                          >
                            <Wallet className="w-4 h-4" />
                          </button>

                          {/* Ver Ticket / Comprobante */}
                          <button
                            onClick={() => openTicketModal(app)}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                            title="Ver comprobante oficial con radicado"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Ver Documentos Legales */}
                          <button
                            onClick={() => openDocumentModal(app, 'pagare_en_blanco')}
                            className="p-1.5 text-[#0066FF] hover:bg-blue-50 rounded-lg transition"
                            title="Abrir visor legal de 3 páginas"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISOR CONTRACTUAL (4 PÁGINAS POR DOCUMENTO) */}
        {activeTab === 'documentos' && (
          <div className="space-y-6">
            {/* Header selection toolbar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Expediente de Solicitante a Visualizar:
                </label>
                <select
                  value={selectedAppIdForDocs}
                  onChange={(e) => {
                    setSelectedAppIdForDocs(e.target.value);
                    setActiveDocPageNum(1);
                  }}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white w-full sm:w-auto"
                >
                  {applications.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} • {a.personalData.firstName} {a.personalData.lastName} (Aprobado: {formatEUR(a.approvedAmount || a.loanDetails.capital)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Download Current PDF CTA */}
              {renderedDoc && (
                <button
                  onClick={() => exportDocumentToPdf(renderedDoc)}
                  className="px-5 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Documento Oficial en PDF (4 Páginas con Firma)</span>
                </button>
              )}
            </div>

            {/* Document Type Switcher (4 Legal Documents + Pagaré) */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedDocTypeForViewer('contrato_mutuo');
                  setActiveDocPageNum(1);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                  selectedDocTypeForViewer === 'contrato_mutuo'
                    ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                📑 1. Contrato de Préstamo (4 Págs - Ley 16/2011)
              </button>

              <button
                onClick={() => {
                  setSelectedDocTypeForViewer('condiciones_generales');
                  setActiveDocPageNum(1);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                  selectedDocTypeForViewer === 'condiciones_generales' || selectedDocTypeForViewer === 'contrato_apertura_plataforma'
                    ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                📜 2. Condiciones Generales (4 Págs - CGC)
              </button>

              <button
                onClick={() => {
                  setSelectedDocTypeForViewer('politica_privacidad');
                  setActiveDocPageNum(1);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                  selectedDocTypeForViewer === 'politica_privacidad'
                    ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🔒 3. Política de Privacidad (4 Págs - RGPD)
              </button>

              <button
                onClick={() => {
                  setSelectedDocTypeForViewer('consentimiento_lopd');
                  setActiveDocPageNum(1);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                  selectedDocTypeForViewer === 'consentimiento_lopd' || selectedDocTypeForViewer === 'autorizacion_centrales'
                    ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ⚖️ 4. Consentimiento LOPD & ASNEF (4 Págs)
              </button>

              <button
                onClick={() => {
                  setSelectedDocTypeForViewer('pagare_en_blanco');
                  setActiveDocPageNum(1);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                  selectedDocTypeForViewer === 'pagare_en_blanco'
                    ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ✍️ 5. Pagaré Notarial eIDAS (4 Págs)
              </button>
            </div>

            {/* Page Selector Tabs */}
            {renderedDoc && (
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 mr-2">Hojas del Documento:</span>
                {renderedDoc.pages.map((p) => (
                  <button
                    key={p.pageNumber}
                    onClick={() => setActiveDocPageNum(p.pageNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeDocPageNum === p.pageNumber
                        ? 'bg-[#0066FF] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Página {p.pageNumber} de {p.totalPageCount}
                  </button>
                ))}
              </div>
            )}

            {/* Canvas Page Display */}
            {renderedDoc && currentSelectedApp && (
              <div className="bg-slate-200/60 p-4 sm:p-8 rounded-2xl flex justify-center">
                <div className="bg-white max-w-3xl w-full p-8 sm:p-12 shadow-2xl border border-slate-300 relative rounded-sm min-h-[700px] flex flex-col justify-between">
                  
                  {/* Diagonal Watermark */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.06] select-none">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 transform -rotate-35 uppercase text-center leading-relaxed">
                      {renderedDoc.watermark}
                    </span>
                  </div>

                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between border-b-2 border-[#0B1B3D] pb-4 mb-6 relative">
                      <div>
                        <div className="text-2xl font-black text-[#0B1B3D]">
                          INSTA<span className="text-[#0066FF]">CREDIT</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold">
                          {platformConfig.companyName} • NIF: {platformConfig.companyNif}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          {platformConfig.companyAddress}
                        </div>
                      </div>

                      {/* Official Seal España */}
                      <div className="w-28 h-28 border-2 border-emerald-600 rounded-full p-1.5 flex flex-col items-center justify-center text-center text-emerald-800 rotate-[-4deg] opacity-90 shadow-xs bg-emerald-50/50">
                        <div className="text-[7.5px] font-black uppercase tracking-wider leading-none mb-1">
                          REINO DE ESPAÑA
                        </div>
                        <ShieldCheck className="w-6 h-6 text-emerald-600 my-0.5" />
                        <div className="text-[7px] font-black leading-tight">
                          BANCO DE ESPAÑA (BDE)
                        </div>
                        <div className="text-[6.5px] font-mono text-emerald-700 font-bold mt-0.5">
                          LEY 16/2011 & eIDAS
                        </div>
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="text-center space-y-1 mb-6">
                      <h2 className="text-lg sm:text-xl font-black text-[#0B1B3D]">
                        {renderedDoc.title}
                      </h2>
                      <p className="text-xs font-bold text-[#0066FF]">
                        {renderedDoc.subtitle}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {renderedDoc.legalBasis}
                      </p>
                    </div>

                    {/* Render Selected Page */}
                    {renderedDoc.pages
                      .filter(p => p.pageNumber === activeDocPageNum)
                      .map(p => (
                        <div key={p.pageNumber} className="space-y-4">
                          <div className="text-xs font-bold text-[#0B1B3D] uppercase border-b pb-1">
                            {p.pageTitle}
                          </div>
                          <div
                            className="prose prose-sm max-w-none text-slate-800"
                            dangerouslySetInnerHTML={{ __html: p.contentHtml }}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Footer on page 3 or bottom */}
                  <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-center">
                    <span>Documento Oficial Certificado • INSTACREDIT ESPAÑA FINTECH S.L.</span>
                    <span>Página {activeDocPageNum} de {renderedDoc.pages.length}</span>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: WHATSAPP TOOLKIT & LIBRETOS */}
        {activeTab === 'whatsapp_toolkit' && (
          <WhatsAppAdvisorToolkit
            onOpenDidacticForm={(app) => {
              setDidacticModalApp(app || null);
              setIsDidacticModalOpen(true);
            }}
          />
        )}

        {/* TAB: GESTIÓN DE PLANTILLAS CORREO Y SMS */}
        {activeTab === 'plantillas_comunicacion' && (
          <CommunicationTemplateManager />
        )}

        {/* TAB: PUBLICIDAD FACEBOOK */}
        {activeTab === 'publicidad_facebook' && (
          <FacebookAdMarketingCreator />
        )}

        {/* TAB: CENTRO OPERATIVO 100% LISTO PARA USAR */}
        {activeTab === 'centro_operativo_listo' && <ReadyToUseOperationalHub />}

        {/* TAB: ARCHIVO .JSON MAESTRO DEL PROYECTO */}
        {activeTab === 'blueprint_json' && <ProjectBlueprintJsonExporter />}

        {/* TAB: GLOSARIO-ASISTENTE INTELIGENTE */}
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

        {/* TAB 3: LIBRETOS Y PROTOCOLOS DE ASESORES */}
        {activeTab === 'asesores' && <AdvisorScriptsProtocol />}

        {/* TAB: LIBRETOS IMPRIMIBLES (4 CASOS & P&R) */}
        {activeTab === 'libretos_imprimibles' && <PrintableAdvisorProtocolsManual />}

        {/* TAB 4: MANUAL DEL ASESOR & LIBRETOS */}
        {activeTab === 'manual' && (
          <div className="space-y-6">
            {/* Sub navigation between detailed WhatsApp scripts manual and operational manual */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setManualSubTab('operativo_bde')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  manualSubTab === 'operativo_bde'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>🔊 Guía Instructiva Auditiva, Visual y Didáctica (Asesores Desde Cero)</span>
              </button>

              <button
                type="button"
                onClick={() => setManualSubTab('libretos_whatsapp')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  manualSubTab === 'libretos_whatsapp'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Manual Detallado de Libretos para WhatsApp (4 Categorías)</span>
              </button>
            </div>

            {manualSubTab === 'libretos_whatsapp' ? (
              <AdvisorDetailedScriptsManual />
            ) : (
              <AdvisorOperationalManual />
            )}
          </div>
        )}

        {/* TAB 5: FORMULARIOS DEL SISTEMA */}
        {activeTab === 'formularios' && <SystemFormsInspector />}

        {/* TAB 6: CONFIGURACIÓN DE CONTACTOS Y REDES SOCIALES */}
        {activeTab === 'configuracion' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#0B1B3D]">
                  Configuración de Canales de Contacto y Redes Oficiales
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Modifica los números telefónicos, líneas WhatsApp, correos de soporte, redes sociales y horarios que se muestran en toda la plataforma de Instacredit España.
                </p>
              </div>

              {saveSuccessNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>¡Datos de contacto actualizados correctamente en toda la plataforma!</span>
                </div>
              )}

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Línea Gratuita Nacional España
                    </label>
                    <input
                      type="text"
                      value={configForm.phoneNational}
                      onChange={(e) => setConfigForm({ ...configForm, phoneNational: e.target.value })}
                      placeholder="900 839 201"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sede Madrid (PBX)
                    </label>
                    <input
                      type="text"
                      value={configForm.phoneMadrid}
                      onChange={(e) => setConfigForm({ ...configForm, phoneMadrid: e.target.value })}
                      placeholder="(91) 078 3650"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Número WhatsApp Oficial (+34)
                    </label>
                    <input
                      type="text"
                      value={configForm.whatsappNumber}
                      onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                      placeholder="+34 613 892 401"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL Enlace Directo WhatsApp
                    </label>
                    <input
                      type="text"
                      value={configForm.whatsappUrl}
                      onChange={(e) => setConfigForm({ ...configForm, whatsappUrl: e.target.value })}
                      placeholder="https://wa.me/34613892401?text=..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo Electrónico de Soporte
                    </label>
                    <input
                      type="email"
                      value={configForm.supportEmail}
                      onChange={(e) => setConfigForm({ ...configForm, supportEmail: e.target.value })}
                      placeholder="ayuda@instacredit.es"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Entidad de Supervisión Oficial
                    </label>
                    <input
                      type="text"
                      value={configForm.supervisionEntity}
                      onChange={(e) => setConfigForm({ ...configForm, supervisionEntity: e.target.value })}
                      placeholder="Banco de España (BdE) & Ley 16/2011"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Horario de Atención (Lunes a Viernes)
                    </label>
                    <input
                      type="text"
                      value={configForm.businessHoursWeekdays}
                      onChange={(e) => setConfigForm({ ...configForm, businessHoursWeekdays: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Horario de Atención (Fines de Semana)
                    </label>
                    <input
                      type="text"
                      value={configForm.businessHoursWeekends}
                      onChange={(e) => setConfigForm({ ...configForm, businessHoursWeekends: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                {/* Social Networks Links */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900 mb-3">
                    Redes Sociales Oficiales
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Facebook URL</label>
                      <input
                        type="text"
                        value={configForm.facebookUrl}
                        onChange={(e) => setConfigForm({ ...configForm, facebookUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={configForm.instagramUrl}
                        onChange={(e) => setConfigForm({ ...configForm, instagramUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={configForm.linkedinUrl}
                        onChange={(e) => setConfigForm({ ...configForm, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">TikTok URL</label>
                      <input
                        type="text"
                        value={configForm.tiktokUrl}
                        onChange={(e) => setConfigForm({ ...configForm, tiktokUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios de Configuración</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 7: GESTIÓN DE RECLAMACIONES SAC & BDE */}
        {activeTab === 'pqrs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <h3 className="text-xl font-bold text-[#0B1B3D]">
                Servicio de Atención al Cliente (SAC) y Reclamaciones Banco de España
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Conforme a la Orden ECO/734/2004 y Circular 5/2012 del Banco de España, las reclamaciones formuladas por los consumidores deben atenderse en un plazo legal perentorio de 15 días hábiles.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Radicado SAC</th>
                    <th className="p-4">Ciudadano</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Motivo / Asunto</th>
                    <th className="p-4">Vencimiento Legal</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Respuesta Oficial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {pqrsRecords.map((pqrs) => (
                    <tr key={pqrs.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-[#0B1B3D]">
                        {pqrs.id}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{pqrs.applicantName}</div>
                        <div className="text-[11px] text-slate-400">{pqrs.documentNumber} • {pqrs.email}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {pqrs.type}
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-semibold text-slate-900">{pqrs.subject}</div>
                        <div className="text-[11px] text-slate-500 truncate">{pqrs.description}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-600">
                        {pqrs.officialResponseDate}
                      </td>
                      <td className="p-4">
                        <select
                          value={pqrs.status}
                          onChange={(e) => updatePqrsStatus(pqrs.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                            pqrs.status === 'Resuelto'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : pqrs.status === 'En Trámite'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-blue-50 text-blue-800 border-blue-300'
                          }`}
                        >
                          <option value="Radicado">Radicado</option>
                          <option value="En Trámite">En Trámite</option>
                          <option value="Resuelto">Resuelto</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs text-slate-600">
                        {pqrs.responseDetails || 'Pendiente de respuesta oficial'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: WHATSAPP TOOLKIT & LIBRETOS */}
        {activeTab === 'whatsapp_toolkit' && (
          <WhatsAppAdvisorToolkit
            onOpenDidacticForm={(app) => {
              setDidacticModalApp(app || currentSelectedApp);
              setIsDidacticModalOpen(true);
            }}
          />
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

      {/* Modal to adjust approved amount */}
      {editingAppForAmount && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-[#0B1B3D]">
                Ajustar Cantidad Estimada Aprobada
              </h4>
              <button onClick={() => setEditingAppForAmount(null)} className="p-1 text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
              <div>Solicitante: <strong>{editingAppForAmount.personalData.firstName} {editingAppForAmount.personalData.lastName}</strong></div>
              <div>Radicado: <strong>{editingAppForAmount.id}</strong></div>
              <div>Monto Solicitado: <strong>{formatEUR(editingAppForAmount.loanDetails.capital)}</strong></div>
              <div>Motivo Declarado: <strong className="text-purple-700">{editingAppForAmount.economicData.loanPurpose || editingAppForAmount.loanDetails.loanPurpose || 'Libre inversión'}</strong></div>
            </div>

            <form onSubmit={handleApplyApprovedAmount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nueva Cantidad Aprobada (€ EUR) - De 2.000 € a 100.000 €
                </label>
                <input
                  type="number"
                  step={500}
                  min={2000}
                  max={100000}
                  value={newApprovedAmountInput}
                  onChange={(e) => setNewApprovedAmountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-bold text-[#0066FF]"
                  required
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Al guardar, se recalculará de forma inmediata el cuadro de amortización, el aval de riesgo, la cuota y los 4 contratos legales de 4 páginas.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAppForAmount(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 rounded-xl shadow-sm cursor-pointer"
                >
                  Actualizar Monto y Contratos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ver y Editar Todos los Datos del Usuario */}
      {userToEdit && (
        <AdminUserEditModal
          isOpen={!!userToEdit}
          onClose={() => setUserToEdit(null)}
          application={userToEdit}
        />
      )}

      {/* Modal: Registrar Solicitud Manualmente */}
      {isManualRegisterModalOpen && (
        <AdminManualRegisterModal
          isOpen={isManualRegisterModalOpen}
          onClose={() => setIsManualRegisterModalOpen(false)}
        />
      )}

    </div>
  );
};
