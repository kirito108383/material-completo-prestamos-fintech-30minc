import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditApplication, LoanStatus } from '../../types';
import { formatEUR } from '../../utils/financialCalculations';
import {
  CommunicationTemplate,
  CommunicationChannel,
  TEMPLATE_VARIABLES
} from '../../types/communicationTemplates';
import { DEFAULT_COMMUNICATION_TEMPLATES } from '../../data/defaultCommunicationTemplates';
import {
  resolveTemplateImage,
  interpolateVariables,
  generateHtmlEmail,
  STATUS_IMAGE_CONFIGS
} from '../../utils/dynamicImageResolver';
import { dispatchKitInOneAction } from '../../utils/kitDispatcher';
import {
  Mail,
  Smartphone,
  MessageCircle,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Send,
  Eye,
  Sparkles,
  ShieldCheck,
  Clock,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  Code,
  Download,
  AlertCircle,
  User,
  Zap,
  Tag,
  ArrowRight
} from 'lucide-react';

const STORAGE_KEY = 'instacredit_communication_templates_v2';

export const CommunicationTemplateManager: React.FC = () => {
  const { applications, currentAdvisor, logAdvisorAction } = useApp();

  // Load custom or default templates from localStorage
  const [templates, setTemplates] = useState<CommunicationTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_COMMUNICATION_TEMPLATES;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  }, [templates]);

  // Selected filters and states
  const [activeChannel, setActiveChannel] = useState<CommunicationChannel | 'todos'>('todos');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');

  // Preview Mode
  const [previewDevice, setPreviewDevice] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [copiedHtmlNotice, setCopiedHtmlNotice] = useState(false);
  const [copiedTextNotice, setCopiedTextNotice] = useState(false);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Auto-switch preview device tab to match selected template channel
  useEffect(() => {
    if (selectedTemplate) {
      if (selectedTemplate.channel === 'email') setPreviewDevice('email');
      else if (selectedTemplate.channel === 'sms') setPreviewDevice('sms');
      else setPreviewDevice('whatsapp');
    }
  }, [selectedTemplateId]);

  // Filter templates list
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesChannel = activeChannel === 'todos' || tpl.channel === activeChannel;
      const matchesStatus = statusFilter === 'todos' || tpl.loanStatusTrigger === statusFilter || tpl.loanStatusTrigger === 'cualquiera';
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        (tpl.subject && tpl.subject.toLowerCase().includes(q)) ||
        tpl.content.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q);

      return matchesChannel && matchesStatus && matchesSearch;
    });
  }, [templates, activeChannel, statusFilter, searchQuery]);

  // Reset to system defaults
  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restablecer todas las plantillas a los valores predeterminados del sistema?')) {
      setTemplates(DEFAULT_COMMUNICATION_TEMPLATES);
      setSelectedTemplateId(DEFAULT_COMMUNICATION_TEMPLATES[0].id);
    }
  };

  // Open editor for existing or new template
  const handleOpenEditor = (tpl?: CommunicationTemplate) => {
    if (tpl) {
      setEditingTemplate({ ...tpl });
    } else {
      setEditingTemplate({
        id: `tpl-${Date.now()}`,
        name: 'Nueva Plantilla Personalizada',
        channel: activeChannel === 'todos' ? 'email' : activeChannel,
        loanStatusTrigger: 'Pendiente',
        subject: 'Información sobre su crédito en INSTACREDIT España',
        content: `Estimado(a) {NOMBRE_CLIENTE},\n\nLe contactamos en relación a su expediente #{EXPEDIENTE_ID} por importe de {MONTO_EUR}.\n\nPara consultar el estado, acceda a: {ENLACE_PORTAL}`,
        callToActionLabel: 'Ver Mi Solicitud',
        callToActionUrl: '{ENLACE_PORTAL}',
        autoAttachStatusImage: true,
        description: 'Plantilla personalizada creada por el administrador.',
        badge: 'Personalizada',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
        updatedAt: new Date().toISOString().split('T')[0],
        isSystemDefault: false
      });
    }
    setIsEditorOpen(true);
  };

  // Save template from modal
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === editingTemplate.id);
      if (exists) {
        return prev.map((t) => (t.id === editingTemplate.id ? { ...editingTemplate, updatedAt: new Date().toISOString().split('T')[0] } : t));
      } else {
        return [{ ...editingTemplate, updatedAt: new Date().toISOString().split('T')[0] }, ...prev];
      }
    });

    setSelectedTemplateId(editingTemplate.id);
    setIsEditorOpen(false);
    setEditingTemplate(null);
  };

  // Delete template
  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta plantilla?')) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (selectedTemplateId === id) {
        const remaining = templates.filter((t) => t.id !== id);
        if (remaining.length > 0) setSelectedTemplateId(remaining[0].id);
      }
    }
  };

  // Copy HTML of Email
  const handleCopyEmailHtml = () => {
    if (!selectedTemplate) return;
    const html = generateHtmlEmail({
      template: selectedTemplate,
      app: currentApp,
      advisorName: currentAdvisor.name
    });
    navigator.clipboard.writeText(html);
    setCopiedHtmlNotice(true);
    setTimeout(() => setCopiedHtmlNotice(false), 2500);
  };

  // Copy plain text or SMS
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextNotice(true);
    setTimeout(() => setCopiedTextNotice(false), 2000);
  };

  // Dispatch 1-Action Test
  const handleTestDispatch = async () => {
    if (!selectedTemplate) return;
    const imageInfo = resolveTemplateImage(selectedTemplate, currentApp);
    const body = interpolateVariables(selectedTemplate.content, currentApp, currentAdvisor.name);
    const clientPhone = currentApp ? currentApp.personalData.phone : '600000000';
    const clientName = currentApp ? `${currentApp.personalData.firstName} ${currentApp.personalData.lastName}` : 'Cliente';

    try {
      const result = await dispatchKitInOneAction({
        imageSrc: imageInfo.imageSrc,
        imageTitle: imageInfo.bannerTitle,
        messageText: body,
        clientPhone,
        clientName,
        kitId: selectedTemplate.id
      });

      if (result.success) {
        setDispatchNotice('¡Mensaje despachado en 1 sola acción con imagen adjunta en la cabecera!');
        setTimeout(() => setDispatchNotice(null), 3500);

        if (currentApp) {
          logAdvisorAction(currentApp.id, {
            advisorId: currentAdvisor.id,
            advisorName: currentAdvisor.name,
            actionType: selectedTemplate.channel === 'email' ? 'email' : 'whatsapp',
            summary: `Plantilla "${selectedTemplate.name}" probada y enviada a ${clientName} con imagen unificada.`,
            clientNotes: body.substring(0, 100) + '...'
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Available image choices for the manual override selector
  const AVAILABLE_IMAGES = [
    { src: '/src/assets/images/ws_bienvenida_1790860195015.jpg', label: 'Bienvenida & Asesor Personal (Compromiso 30 min)' },
    { src: '/src/assets/images/ws_docs_guia_1790860205561.jpg', label: 'Guía de Documentos (DNI/NIE, Nómina, IBAN)' },
    { src: '/src/assets/images/ws_seguimiento_1790860216261.jpg', label: 'Trayectoria 12 Años & Garantía 30m' },
    { src: '/src/assets/images/ws_cierre_aprob_1790860226017.jpg', label: 'Certificado de Aprobación Formal eIDAS' },
    { src: '/src/assets/images/ws_desembolso_bizum_1790894749766.jpg', label: 'Desembolso en Cuenta Digital & Bizum Instantáneo' },
    { src: '/src/assets/images/ws_seguridad_antifraude_1790894760624.jpg', label: 'Certificado Oficial CERO COBROS O ANTICIPOS PREVIOS' },
    { src: '/src/assets/images/ws_prorroga_fidelidad_1790894773902.jpg', label: 'Extensión de Plazo & Aumento de Cupo VIP' },
    { src: '/src/assets/images/fb_lifestyle_entrepreneur_1790893984324.jpg', label: 'Lifestyle Autónomos y Empresas' },
    { src: '/src/assets/images/fb_lifestyle_family_1790893967984.jpg', label: 'Lifestyle Hogar y Familia' },
    { src: '/src/assets/images/fb_lifestyle_personal_1790893993475.jpg', label: 'Lifestyle Proyectos Personales' }
  ];

  const resolvedImageInfo = selectedTemplate
    ? resolveTemplateImage(selectedTemplate, currentApp)
    : {
        imageSrc: '/src/assets/images/ws_bienvenida_1790860195015.jpg',
        bannerTitle: 'Bienvenido a INSTACREDIT España',
        bannerSubtitle: 'Tu Asesor Personal • Soluciones Financieras a tu Medida',
        themeColor: '#0066FF',
        badgeText: 'Oficial'
      };

  const renderedContent = selectedTemplate
    ? interpolateVariables(selectedTemplate.content, currentApp, currentAdvisor.name)
    : '';

  const renderedSubject = selectedTemplate?.subject
    ? interpolateVariables(selectedTemplate.subject, currentApp, currentAdvisor.name)
    : '';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {dispatchNotice && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1B3D] text-white border-2 border-[#00E599] rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-top">
          <CheckCircle2 className="w-5 h-5 text-[#00E599]" />
          <span className="font-bold text-xs">{dispatchNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B1B3D] via-[#0E2452] to-[#0055FF] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-blue-900 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <Mail className="w-3.5 h-3.5" />
              Panel de Control de Plantillas • Correo, SMS y Mensajería
            </span>
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Imágenes Dinámicas Integradas (Estilo Burbuja Única)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Gestor de Plantillas de Correo, SMS y Mensajería
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Administra los correos HTML, mensajes SMS y notificaciones. <strong>Cada plantilla integra automáticamente la imagen del estado del préstamo como cabecera indivisible del mensaje</strong>, evitando que la imagen aparezca de forma independiente o desvinculada.
          </p>
        </div>

        <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 relative z-10 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleOpenEditor()}
            className="px-4 py-2.5 bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#0B1B3D]" />
            <span>Crear Nueva Plantilla</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-cyan-300" />
            <span>Restablecer Predeterminadas</span>
          </button>
        </div>
      </div>

      {/* FILTER & APPLICANT SELECTOR BAR */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Channel Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos', label: 'Todas', icon: Layers, count: templates.length },
              { id: 'email', label: '✉️ Correo (HTML)', icon: Mail, count: templates.filter((t) => t.channel === 'email').length },
              { id: 'sms', label: '📱 SMS & RCS', icon: Smartphone, count: templates.filter((t) => t.channel === 'sms').length },
              { id: 'whatsapp', label: '💬 WhatsApp Unificado', icon: MessageCircle, count: templates.filter((t) => t.channel === 'whatsapp').length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeChannel === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveChannel(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#00E599] text-[#0B1B3D]' : 'bg-slate-200 text-slate-600'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Test Applicant Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#0066FF]" />
              Probar variables con:
            </span>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold bg-white text-[#0B1B3D]"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.personalData.firstName} {app.personalData.lastName} ({formatEUR(app.approvedAmount || app.loanDetails.capital)}) - [{app.status}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter: Status & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Filtrar por Estado de Disparo:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Pendiente">Pendiente (Onboarding inicial)</option>
              <option value="En Revisión">En Revisión (Mesa de riesgos)</option>
              <option value="Aprobado">Aprobado (Firma eIDAS)</option>
              <option value="Desembolsado">Desembolsado (Fondos acreditados)</option>
              <option value="Rechazado">Rechazado / Alerta</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Buscar en Asunto o Contenido:</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Bizum, Aprobado, DNI, Asesor, Fondos..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: TEMPLATE SELECTOR (LEFT) & LIVE SIMULATOR (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: TEMPLATES LIST (5 COLS) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Plantillas Configuradas ({filteredTemplates.length})
            </h3>
            <span className="text-[11px] text-[#0066FF] font-bold">
              Selecciona para previsualizar y editar
            </span>
          </div>

          <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
            {filteredTemplates.map((tpl) => {
              const isSelected = selectedTemplateId === tpl.id;
              const imgInfo = resolveTemplateImage(tpl, currentApp);

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/30'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        tpl.channel === 'email'
                          ? 'bg-purple-100 text-purple-700'
                          : tpl.channel === 'sms'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {tpl.channel === 'email' ? '✉️' : tpl.channel === 'sms' ? '📱' : '💬'}
                      </span>
                      <div>
                        <h4 className="font-black text-xs text-[#0B1B3D] line-clamp-1">{tpl.name}</h4>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Canal: {tpl.channel.toUpperCase()} • Disparador: <strong>{tpl.loanStatusTrigger}</strong>
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border shrink-0 ${tpl.badgeColor}`}>
                      {tpl.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {tpl.subject || tpl.content}
                  </p>

                  {/* Dynamic Image Binding Badge */}
                  <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-1.5 truncate">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="text-slate-600 truncate font-semibold">
                        {tpl.autoAttachStatusImage ? `Auto-Imagen: ${imgInfo.bannerTitle}` : `Imagen Manual: ${imgInfo.bannerTitle}`}
                      </span>
                    </div>

                    <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 border border-slate-300">
                      <img src={imgInfo.imageSrc} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Template Card Controls */}
                  <div className="pt-2 flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditor(tpl);
                      }}
                      className="p-1.5 text-slate-600 hover:text-[#0066FF] hover:bg-white rounded-lg transition"
                      title="Editar plantilla"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {!tpl.isSystemDefault && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(tpl.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition"
                        title="Eliminar plantilla"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE DEVICE SIMULATOR (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#0B1B3D]">
                    Simulador en Vivo: Imagen Integrada en el Mensaje
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Comprobación visual de cómo lo recibe el cliente (Estilo Tarjeta Unificada)
                  </p>
                </div>
              </div>
            </div>

            {/* Device View Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setPreviewDevice('whatsapp')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'whatsapp' ? 'bg-[#005C4B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice('email')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'email' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email HTML</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice('sms')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'sms' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS / RCS</span>
              </button>
            </div>
          </div>

          {/* SIMULATOR SCREEN CONTAINER */}
          <div className="rounded-3xl border border-slate-300 overflow-hidden shadow-inner bg-slate-900">
            
            {/* 1. WHATSAPP UNIFIED VIEW (EXACTLY MATCHING SCREENSHOT 1) */}
            {previewDevice === 'whatsapp' && (
              <div className="bg-[#0B141A] text-white p-3 sm:p-5 min-h-[520px] flex flex-col justify-between relative overflow-hidden">
                {/* WhatsApp Chat Top Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-emerald-500/40">
                      <img src="/src/assets/images/ws_bienvenida_1790860195015.jpg" alt="Advisor" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">INSTACREDIT Oficial España</h5>
                      <p className="text-[10px] text-emerald-400 font-medium">En línea • Cuenta de Empresa Verificada</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full font-mono">
                    Cifrado de extremo a extremo
                  </span>
                </div>

                {/* THE UNIFIED SENT MESSAGE BUBBLE (FOTO + PIE EN UNA SOLA BURBUJA VERDE) */}
                <div className="flex justify-end mb-4">
                  <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tr-xs overflow-hidden max-w-sm sm:max-w-md shadow-lg border border-[#005C4B]/50">
                    
                    {/* FLUSH TOP IMAGE (INTEGRAL HEADER OF THE BUBBLE) */}
                    <div className="relative w-full overflow-hidden bg-slate-950">
                      <img
                        src={resolvedImageInfo.imageSrc}
                        alt={resolvedImageInfo.bannerTitle}
                        className="w-full h-auto object-cover max-h-56 display-block"
                      />
                      
                      {/* Institutional White Ribbon at the base of the image */}
                      <div className="bg-white text-slate-900 px-3 py-2 text-center border-b border-slate-200">
                        <div className="font-black text-xs text-[#0B1B3D] tracking-tight">
                          {resolvedImageInfo.bannerTitle}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                          {resolvedImageInfo.bannerSubtitle}
                        </div>
                      </div>
                    </div>

                    {/* SEAMLESS TEXT CAPTION INSIDE THE SAME BUBBLE */}
                    <div className="p-3.5 space-y-2">
                      <div className="text-xs font-sans whitespace-pre-line leading-relaxed text-[#E9EDEF]">
                        {renderedContent}
                      </div>

                      {/* Timestamp & Double Blue Checkmark */}
                      <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696A0] font-mono pt-1">
                        <span>6:04 p. m.</span>
                        <span className="text-[#53BDEB] font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Footer Input Placeholder */}
                <div className="bg-[#202C33] rounded-2xl p-2.5 flex items-center justify-between text-xs text-slate-400">
                  <span>Mensaje para {currentApp?.personalData.firstName || 'Carmen'}...</span>
                  <div className="w-7 h-7 rounded-full bg-[#00A884] flex items-center justify-center text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* 2. EMAIL HTML VIEW (RESPONSIVE CARD WITH EMBEDDED HERO BANNER) */}
            {previewDevice === 'email' && (
              <div className="bg-slate-100 p-4 sm:p-6 min-h-[520px] max-h-[640px] overflow-y-auto">
                <div className="max-w-lg mx-auto bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                  {/* Top Email Bar */}
                  <div className="bg-[#0B1B3D] p-4 text-white flex items-center justify-between">
                    <div>
                      <span className="font-black text-sm text-white">
                        INSTACREDIT <span className="text-[#00E599]">España</span>
                      </span>
                      <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">
                        Plataforma Fintech Supervisada • Ley 16/2011
                      </p>
                    </div>
                    <span className="bg-[#00E599]/20 text-[#00E599] text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
                      {resolvedImageInfo.badgeText}
                    </span>
                  </div>

                  {/* Integral Hero Image Banner */}
                  <div className="relative bg-slate-950">
                    <img
                      src={resolvedImageInfo.imageSrc}
                      alt={resolvedImageInfo.bannerTitle}
                      className="w-full h-auto object-cover max-h-52"
                    />
                    <div className="bg-white p-2.5 text-center border-b border-slate-200">
                      <div className="font-black text-xs text-[#0B1B3D]">
                        {resolvedImageInfo.bannerTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">
                        {resolvedImageInfo.bannerSubtitle}
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="p-5 space-y-4 text-xs text-slate-800 leading-relaxed">
                    <div className="font-bold text-sm text-[#0B1B3D] border-b border-slate-100 pb-2">
                      {renderedSubject || 'Notificación Oficial de su Crédito'}
                    </div>

                    <div className="whitespace-pre-line leading-relaxed text-slate-700">
                      {renderedContent}
                    </div>

                    {/* Embedded Details Table */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expediente:</span>
                        <span className="font-bold text-[#0066FF] font-mono">#{currentApp?.id || 'INSTA-ES-821943'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Importe:</span>
                        <span className="font-black text-emerald-700">
                          {formatEUR(currentApp?.approvedAmount || currentApp?.loanDetails.capital || 750)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cuenta IBAN:</span>
                        <span className="font-bold text-slate-700 font-mono text-[10px]">
                          {currentApp?.digitalAccount.accountNumber || 'ES91 2100 0418 4502 0005 1234'}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-gradient-to-r from-[#0066FF] to-blue-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                      >
                        {selectedTemplate?.callToActionLabel || 'Acceder a Mi Expediente en 1 Clic'} →
                      </button>
                    </div>
                  </div>

                  {/* Email Footer */}
                  <div className="bg-slate-50 p-3 text-center border-t border-slate-200 text-[10px] text-slate-500">
                    <p className="font-bold text-slate-700">INSTACREDIT ESPAÑA FINTECH S.L. • Paseo de la Castellana 95, Madrid</p>
                    <p className="mt-0.5">Supervisión Banco de España & Ley 16/2011 de Contratos de Crédito.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SMS / RCS RICH CARD VIEW */}
            {previewDevice === 'sms' && (
              <div className="bg-slate-900 text-white p-4 sm:p-6 min-h-[520px] flex flex-col justify-center items-center">
                <div className="max-w-sm w-full bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                  {/* RCS Media Header Image */}
                  <div className="relative">
                    <img
                      src={resolvedImageInfo.imageSrc}
                      alt={resolvedImageInfo.bannerTitle}
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full text-white">
                      RCS Mensaje Enriquecido
                    </div>
                    <div className="bg-slate-950 p-2 text-center border-b border-slate-700">
                      <p className="text-xs font-black text-[#00E599]">{resolvedImageInfo.bannerTitle}</p>
                    </div>
                  </div>

                  {/* SMS Body */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                      {renderedContent}
                    </p>

                    <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-[10px] text-slate-400">
                      <span>INSTACREDIT SMS Seguro</span>
                      <span>Ahora • SIM 1</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIMULATOR ACTION BAR */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmailHtml}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedHtmlNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedHtmlNotice ? '¡HTML Copiado!' : 'Copiar HTML de Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyText(renderedContent)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedTextNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTextNotice ? '¡Texto Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleTestDispatch}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-200" />
              <span>⚡ Probar Envío Unificado (Imagen + Texto en 1 Acción)</span>
            </button>
          </div>
        </div>
      </div>

      {/* TEMPLATE EDITOR MODAL */}
      {isEditorOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl border border-slate-300 relative">
            <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#00E599]" />
                <h4 className="font-black text-sm sm:text-base">
                  {editingTemplate.id.startsWith('tpl-') ? 'Crear Nueva Plantilla' : `Editar: ${editingTemplate.name}`}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Plantilla:</label>
                  <input
                    type="text"
                    required
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Canal de Envío:</label>
                  <select
                    value={editingTemplate.channel}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, channel: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="email">✉️ Correo Electrónico (HTML)</option>
                    <option value="sms">📱 SMS / RCS Enriquecido</option>
                    <option value="whatsapp">💬 WhatsApp Business (Burbuja Única)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado de Disparo Asociado:</label>
                  <select
                    value={editingTemplate.loanStatusTrigger}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, loanStatusTrigger: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="Pendiente">Pendiente (Onboarding / Documentos)</option>
                    <option value="En Revisión">En Revisión (Mesa de Riesgos)</option>
                    <option value="Aprobado">Aprobado (Firma Notarial eIDAS)</option>
                    <option value="Desembolsado">Desembolsado (Abono & Bizum)</option>
                    <option value="Rechazado">Rechazado / Alerta</option>
                    <option value="cualquiera">Cualquier Estado (Transversal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Etiqueta Identificativa (Badge):</label>
                  <input
                    type="text"
                    value={editingTemplate.badge}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                    placeholder="ej. ¡Aprobado!, Onboarding, Desembolso..."
                  />
                </div>
              </div>

              {/* Subject (Only for Email) */}
              {editingTemplate.channel === 'email' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Línea de Asunto del Correo (Permite etiquetas como {'{PRIMER_NOMBRE}'}):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTemplate.subject || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              )}

              {/* DYNAMIC IMAGE CONFIGURATION BOX */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0066FF]" />
                    <span className="font-black text-xs text-[#0B1B3D]">
                      Integración de Imagen Dinámica en Cabecera
                    </span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingTemplate.autoAttachStatusImage}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          autoAttachStatusImage: e.target.checked
                        })
                      }
                      className="w-4 h-4 rounded text-[#0066FF]"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      Asociar automáticamente según el estado del préstamo
                    </span>
                  </label>
                </div>

                {!editingTemplate.autoAttachStatusImage && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Seleccionar Imagen Específica Manual:
                    </label>
                    <select
                      value={editingTemplate.overrideImageSrc || AVAILABLE_IMAGES[0].src}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          overrideImageSrc: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      {AVAILABLE_IMAGES.map((img, idx) => (
                        <option key={idx} value={img.src}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Título de la Cinta en Imagen:</label>
                    <input
                      type="text"
                      value={editingTemplate.customBannerTitle || ''}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, customBannerTitle: e.target.value })}
                      placeholder="ej. Bienvenido a INSTACREDIT España"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Subtítulo de la Cinta en Imagen:</label>
                    <input
                      type="text"
                      value={editingTemplate.customBannerSubtitle || ''}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, customBannerSubtitle: e.target.value })}
                      placeholder="ej. Tu Asesor Personal • Soluciones Financieras"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Variables Chips for 1-Click Insertion */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Variables Dinámicas Disponibles (Haz clic para insertar):
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {TEMPLATE_VARIABLES.map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() =>
                        setEditingTemplate({
                          ...editingTemplate,
                          content: editingTemplate.content + ' ' + v.tag
                        })
                      }
                      className="text-[10px] font-mono font-bold bg-white text-[#0066FF] border border-blue-200 px-2 py-0.5 rounded-md hover:bg-blue-50 transition cursor-pointer"
                      title={v.description}
                    >
                      {v.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cuerpo del Mensaje:
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                  className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 leading-relaxed"
                />
              </div>

              {/* Call to Action Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texto del Botón CTA:</label>
                  <input
                    type="text"
                    value={editingTemplate.callToActionLabel || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, callToActionLabel: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300"
                    placeholder="Acceder a Mi Expediente"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enlace del Botón CTA:</label>
                  <input
                    type="text"
                    value={editingTemplate.callToActionUrl || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, callToActionUrl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono"
                    placeholder="{ENLACE_PORTAL}"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Guardar Plantilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
