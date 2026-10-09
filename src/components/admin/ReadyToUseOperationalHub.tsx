import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditApplication, DocumentType } from '../../types';
import { formatEUR } from '../../utils/financialCalculations';
import { WHATSAPP_KITS, WhatsAppKitItem, KitTemplateParams } from '../../data/whatsappKitsData';
import { dispatchKitInOneAction } from '../../utils/kitDispatcher';
import { generateLegalDocument } from '../../utils/legalTemplates';
import { exportDocumentToPdf } from '../../utils/pdfGenerator';
import {
  CLIENT_VOICE_NOTE_TEMPLATES,
  ClientVoiceNoteTemplate,
  generateInstitutionalWavBlob
} from '../../utils/audioMessageGenerator';
import {
  TEN_CASES_WITH_TEN_EXAMPLES,
  FULL_CONVERSATION_PLAYBOOKS,
  RAFFLE_HOOK_CAMPAIGNS
} from '../../data/tenByTenCompleteScriptsData';
import {
  Zap,
  MessageCircle,
  Volume2,
  Link2,
  FileText,
  BellRing,
  CheckCircle2,
  Send,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Play,
  Square,
  Award,
  Image as ImageIcon,
  Layers,
  Eye,
  Printer,
  UserCheck,
  BookOpen,
  Search,
  Gift,
  Compass,
  KeyRound,
  Lock,
  Users,
  MessagesSquare,
  Flame
} from 'lucide-react';

export const ReadyToUseOperationalHub: React.FC = () => {
  const {
    applications,
    advisorsList,
    currentAdvisor,
    setCurrentAdvisor,
    logAdvisorAction,
    openDocumentModal,
    openDidacticForm,
    openUserBankPortal,
    openApplicationModal
  } = useApp();

  // Isolated Advisor Workspace Filter ("Solo mis clientes propios" vs "Todos")
  const [onlyMyAssignedClients, setOnlyMyAssignedClients] = useState<boolean>(false);

  const advisorFilteredApplications = useMemo(() => {
    if (!onlyMyAssignedClients) return applications;
    const mine = applications.filter(
      (a) =>
        a.assignedAdvisorId === currentAdvisor.id ||
        a.advisorActionLogs.some((l) => l.advisorId === currentAdvisor.id)
    );
    return mine.length > 0 ? mine : applications;
  }, [applications, onlyMyAssignedClients, currentAdvisor]);

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [customClientName, setCustomClientName] = useState('');
  const [customClientPhone, setCustomClientPhone] = useState('');
  const [useCustomMode, setUseCustomMode] = useState(false);

  const [activeSection, setActiveSection] = useState<
    | 'matriz_10x10_casos'
    | 'accesos_privados_asesores'
    | 'panel_sorteos_ganchos'
    | 'libretos_conversaciones_largas'
    | 'recorrido_30min_guia_app'
    | 'rutina_diaria'
    | 'urls_directas'
    | 'audios_clientes'
    | 'no_responde_paquetes'
    | 'documentos_4_paginas'
    | 'todos_paquetes_whatsapp'
  >('matriz_10x10_casos');

  // State for 10x10 Matrix & Instant Google-style Search
  const [selectedTenCaseId, setSelectedTenCaseId] = useState<string>(TEN_CASES_WITH_TEN_EXAMPLES[0].id);
  const [globalLibrarySearch, setGlobalLibrarySearch] = useState<string>('');

  // State for Long Conversation Playbooks
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(FULL_CONVERSATION_PLAYBOOKS[0].id);

  // State for Raffle & Hooks Panel
  const [selectedRaffleId, setSelectedRaffleId] = useState<string>(RAFFLE_HOOK_CAMPAIGNS[0].id);
  const [customRafflePrize, setCustomRafflePrize] = useState<string>(RAFFLE_HOOK_CAMPAIGNS[0].defaultPrize);
  const [customRaffleDeadline, setCustomRaffleDeadline] = useState<number>(
    RAFFLE_HOOK_CAMPAIGNS[0].defaultDeadlineMinutes
  );
  const [customRaffleTicketCode, setCustomRaffleTicketCode] = useState<string>('VIP-ES-8842');

  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);
  const [completedRoutineSteps, setCompletedRoutineSteps] = useState<number[]>([1]);
  const [selectedDocTypePreview, setSelectedDocTypePreview] = useState<DocumentType>('contrato_mutuo');
  const [selectedDocPageIdx, setSelectedDocPageIdx] = useState<number>(0);

  const currentApp: CreditApplication | undefined =
    advisorFilteredApplications.find((a) => a.id === selectedAppId) ||
    advisorFilteredApplications[0] ||
    applications[0];

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://instacredit.es';

  const clientData = useMemo(() => {
    if (useCustomMode || !currentApp) {
      const name = customClientName.trim() || 'Carlos Martínez';
      return {
        clientName: name,
        clientFirstName: name.split(' ')[0],
        clientPhone: customClientPhone.trim() || '612345678',
        capitalAmount: '3.500,00 €',
        radicadoId: 'INSTA-ES-904812',
        digitalIban: 'ES91 2100 0418 4502 0005 8891',
        dueDate: '15 de noviembre de 2026',
        advisorName: currentAdvisor.name,
        advisorPhone: currentAdvisor.phone || '600112233',
        baseUrl
      };
    }

    const fullName = `${currentApp.personalData.firstName} ${currentApp.personalData.lastName}`;
    return {
      clientName: fullName,
      clientFirstName: currentApp.personalData.firstName,
      clientPhone: currentApp.personalData.phone,
      capitalAmount: formatEUR(currentApp.approvedAmount || currentApp.loanDetails.capital),
      radicadoId: currentApp.id,
      digitalIban: currentApp.digitalAccount.accountNumber,
      dueDate: currentApp.loanDetails.dueDate,
      advisorName: currentAdvisor.name,
      advisorPhone: currentAdvisor.phone || '600112233',
      baseUrl,
      bankName: currentApp.bankDetails.bankName,
      purpose: currentApp.economicData.loanPurpose
    };
  }, [useCustomMode, customClientName, customClientPhone, currentApp, currentAdvisor, baseUrl]);

  const showToast = (msg: string) => {
    setDispatchNotice(msg);
    setTimeout(() => setDispatchNotice(null), 4500);
  };

  const handleCopyText = (id: string, text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
    showToast(`✅ ${label} copiado al portapapeles listo para pegar en WhatsApp.`);
  };

  const handleOpenWhatsAppDirect = (text: string, actionLabel: string) => {
    const cleanPhone = clientData.clientPhone.replace(/\D/g, '');
    const targetPhone = cleanPhone.startsWith('34') ? cleanPhone : `34${cleanPhone || '600000000'}`;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`, '_blank');
    if (!useCustomMode && currentApp) {
      logAdvisorAction(currentApp.id, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'whatsapp',
        summary: `Enviado por WhatsApp: ${actionLabel}`
      });
    }
    showToast(`🚀 WhatsApp abierto con ${clientData.clientFirstName} (${actionLabel}).`);
  };

  const handleSendWhatsAppWithPdfDownload = (
    text: string,
    docType: DocumentType,
    actionLabel: string
  ) => {
    if (currentApp) {
      const renderedDoc = generateLegalDocument(currentApp, docType);
      exportDocumentToPdf(renderedDoc);
    }
    handleOpenWhatsAppDirect(text, `${actionLabel} + PDF Adjunto`);
    showToast(
      `📄 PDF Oficial de 4 páginas descargado + WhatsApp abierto con ${clientData.clientFirstName} listo para adjuntar.`
    );
  };

  const handleSendCompleteKit = async (kit: WhatsAppKitItem) => {
    const messageText = kit.getTemplate(clientData as KitTemplateParams);
    const result = await dispatchKitInOneAction({
      imageSrc: kit.image.src,
      imageTitle: kit.image.title,
      messageText,
      clientPhone: clientData.clientPhone,
      clientName: clientData.clientName,
      kitId: kit.id
    });
    if (result.success && !useCustomMode && currentApp) {
      logAdvisorAction(currentApp.id, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'whatsapp',
        summary: `Paquete Imagen+Mensaje enviado: ${kit.title}`
      });
    }
    showToast(result.message);
  };

  const handlePlayCustomSpeech = (id: string, scriptText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (playingAudioId === id) {
      setPlayingAudioId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.98;
    utterance.pitch = 1.0;
    utterance.onend = () => setPlayingAudioId(null);
    utterance.onerror = () => setPlayingAudioId(null);
    setPlayingAudioId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayVoiceNote = (item: ClientVoiceNoteTemplate) => {
    const directFormUrl = `${baseUrl}/?form=${item.pairedFormSlug || 'solicitud'}&exp=${clientData.radicadoId}`;
    const scriptText = item.getSpokenScript({
      ...clientData,
      directFormUrl
    });
    handlePlayCustomSpeech(item.id, scriptText);
  };

  const handleDownloadVoiceWav = (titleSlug: string) => {
    const wavBlob = generateInstitutionalWavBlob(4.5);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio_instacredit_${titleSlug}_${clientData.radicadoId}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    showToast(`🎵 Audio oficial .WAV descargado listo para enviar en WhatsApp.`);
  };

  // Direct URLs Catalog for every form, survey, verification & 4-page contract
  const directUrlsCatalog = useMemo(
    () => [
      {
        id: 'url-form-solicitud',
        code: 'URL-01',
        badge: 'Cuestionario 1: Solicitud + Cuenta',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
        title: 'Cuestionario URL 1: Solicitud Oficial, Encuesta de Solvencia e Inicio de Cuenta (Ley 16/2011)',
        purpose:
          'Al llenarlo el cliente confirma importe, plazo, motivo del préstamo y se empieza a configurar su Cuenta Digital de depósito.',
        url: `${baseUrl}/?form=solicitud&exp=${clientData.radicadoId}`,
        openAction: () => openDidacticForm(currentApp, 'solicitud'),
        whatsappMessage: `📋 *CUESTIONARIO URL 1: SOLICITUD Y CREACIÓN DE CUENTA (#${clientData.radicadoId})*\n\nHola *${clientData.clientFirstName}*, te saluda *${clientData.advisorName}* de *INSTACREDIT España*. 🇪🇸\n\nPor favor completa tu solicitud de *${clientData.capitalAmount}* en nuestro enlace oficial asistido por voz (toma 1 minuto y deja pre-configurada tu cuenta de depósito):\n\n🔗 *Pulsa aquí para abrir tu Cuestionario 1:*\n${baseUrl}/?form=solicitud&exp=${clientData.radicadoId}\n\nAvísame por este chat apenas pulses el botón verde de enviar. 👇`
      },
      {
        id: 'url-form-iban',
        code: 'URL-02',
        badge: 'Cuestionario 2: IBAN + Cuenta Depósito',
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        title: 'Cuestionario URL 2: Verificación de Titularidad Bancaria IBAN SEPA y Activación Bizum',
        purpose:
          'Para que el cliente vincule su banco español y código IBAN (ES...) con la Cuenta Digital donde se le depositará el préstamo.',
        url: `${baseUrl}/?form=iban&exp=${clientData.radicadoId}`,
        openAction: () => openDidacticForm(currentApp, 'iban'),
        whatsappMessage: `🏦 *CUESTIONARIO URL 2: VINCULACIÓN DE CUENTA E IBAN (#${clientData.radicadoId})*\n\nEstimado(a) *${clientData.clientFirstName}*, para dejar lista tu cuenta \`${clientData.digitalIban}\` donde se depositarán tus *${clientData.capitalAmount}*, valida tu banco e IBAN español en este enlace seguro:\n\n🔗 *Pulsa aquí para abrir el Cuestionario Bancario IBAN:*\n${baseUrl}/?form=iban&exp=${clientData.radicadoId}\n\n🔒 *Cumplimiento Ley 10/2010 SEPBLAC • Asistido con voz en español.*`
      },
      {
        id: 'url-form-firma',
        code: 'URL-03',
        badge: 'Cuestionario 3: Firma eIDAS + Depósito',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        title: 'Cuestionario URL 3: Firma Electrónica del Contrato y Pagaré eIDAS + Orden de Depósito',
        purpose:
          'Último paso antes del desembolso: el cliente dibuja su firma con el dedo desde el móvil y el sistema deposita el dinero en su cuenta creada.',
        url: `${baseUrl}/?form=cuota_firma&exp=${clientData.radicadoId}`,
        openAction: () => openDidacticForm(currentApp, 'cuota_firma'),
        whatsappMessage: `✍️ *CUESTIONARIO URL 3: FIRMA ELECTRÓNICA eIDAS Y DEPÓSITO EN CUENTA (#${clientData.radicadoId})*\n\n¡Enhorabuena, *${clientData.clientFirstName}*! Tus *${clientData.capitalAmount}* están aprobados. Entra a este enlace directo para firmar con el dedo desde tu móvil y depositar los fondos en tu cuenta creada:\n\n🔗 *Pulsa aquí para Firmar tu Contrato y Liberar tu Depósito:*\n${baseUrl}/?form=cuota_firma&exp=${clientData.radicadoId}\n\nEn cuanto te salga el sello verde de firmado, acreditamos tu saldo. 🚀`
      },
      {
        id: 'url-contratos-4pags',
        code: 'URL-04',
        badge: '5 Contratos Reales (4 Págs c/u)',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        title: 'Visor Público Directo de los 5 Contratos y Documentos Legales (4 Páginas por Documento)',
        purpose:
          'Abre directamente los 5 documentos legales españoles de 4 páginas con los datos del cliente listos para leer o bajar en PDF.',
        url: `${baseUrl}/?ver_contratos=${clientData.radicadoId}`,
        openAction: () => currentApp && openDocumentModal(currentApp, 'contrato_mutuo'),
        whatsappMessage: `📄 *EXPEDIENTE CONTRACTUAL OFICIAL DE 4 PÁGINAS (#${clientData.radicadoId})*\n\nHola *${clientData.clientFirstName}*, para tu total tranquilidad y transparencia bajo la Ley 16/2011, en este enlace directo puedes leer y descargar en PDF tus 5 documentos oficiales de 4 páginas cada uno (Contrato de Préstamo, Condiciones Cuenta Digital, Privacidad RGPD, Autorización ASNEF/CIRBE y Pagaré eIDAS):\n\n🔗 *Ver y Descargar Contratos Oficiales (4 Páginas):*\n${baseUrl}/?ver_contratos=${clientData.radicadoId}`
      },
      {
        id: 'url-banca-digital',
        code: 'URL-05',
        badge: 'Portal Cuenta Creada (Depósito)',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        title: 'Portal Directo de la Cuenta Digital Creada por el Cliente (Ver Depósito y Retirar SEPA/Bizum)',
        purpose:
          'Enlace directo donde el cliente ve sus fondos depositados tras llenar las URLs y los transfiere a su banco por SEPA Instant o Bizum.',
        url: `${baseUrl}/?banca_digital=${clientData.radicadoId}`,
        openAction: () => openUserBankPortal(currentApp),
        whatsappMessage: `🏦💸 *ACCESO DIRECTO A TU CUENTA DIGITAL CON TU DEPÓSITO (${clientData.digitalIban})*\n\nHola *${clientData.clientFirstName}*, una vez completados tus cuestionarios, accede desde aquí a tu Cuenta Digital creada para consultar tu depósito de *${clientData.capitalAmount}* y ordenar tu retiro SEPA Instantáneo o Bizum:\n\n🔗 *Entrar a mi Cuenta Digital INSTACREDIT:*\n${baseUrl}/?banca_digital=${clientData.radicadoId}`
      },
      {
        id: 'url-form-prorroga',
        code: 'URL-06',
        badge: 'Prórroga 15/30/45 Días',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        title: 'Formulario 4: Solicitud de Prórroga y Aplazamiento de Cuota sin ASNEF',
        purpose: 'Para clientes que necesitan aplazar su fecha de pago 15, 30 o 45 días sin penalización moratoria.',
        url: `${baseUrl}/?form=prorroga&exp=${clientData.radicadoId}`,
        openAction: () => openDidacticForm(currentApp, 'prorroga'),
        whatsappMessage: `⏱️ *SOLICITUD OFICIAL DE PRÓRROGA SIN PENALIZACIÓN (#${clientData.radicadoId})*\n\nHola *${clientData.clientFirstName}*, para ampliar tu fecha de pago por 15, 30 o 45 días adicionales y mantener tu historial 100% limpio ante ASNEF, completa este enlace en 1 minuto:\n\n🔗 *Solicitar Prórroga Oficial aquí:*\n${baseUrl}/?form=prorroga&exp=${clientData.radicadoId}`
      },
      {
        id: 'url-form-encuesta-sac',
        code: 'URL-07',
        badge: 'Encuesta Calidad y SAC BdE',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
        title: 'Formulario 5: Encuesta de Satisfacción, Consultas y Servicio de Atención (SAC)',
        purpose: 'Para que el cliente valore la atención recibida en menos de 30 minutos o solicite certificados.',
        url: `${baseUrl}/?form=reclamacion&exp=${clientData.radicadoId}`,
        openAction: () => openDidacticForm(currentApp, 'reclamacion'),
        whatsappMessage: `🌟 *ENCUESTA DE VERIFICACIÓN Y ATENCIÓN AL CLIENTE (#${clientData.radicadoId})*\n\nHola *${clientData.clientFirstName}*, tu opinión y tranquilidad son nuestra prioridad en *INSTACREDIT España*. Puedes completar nuestra encuesta de calidad o solicitar certificados oficiales en este enlace directo:\n\n🔗 *Abrir Encuesta y Canal Oficial SAC:*\n${baseUrl}/?form=reclamacion&exp=${clientData.radicadoId}`
      },
      {
        id: 'url-onboarding-completo',
        code: 'URL-08',
        badge: 'Alta Nuevo Cliente (4 Pasos)',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
        title: 'URL Directa de Alta Nueva Completa (Onboarding de 4 Pasos desde Cero)',
        purpose: 'Para clientes nuevos que escriben por primera vez y aún no tienen expediente creado.',
        url: `${baseUrl}/?solicitud_nueva=1`,
        openAction: () => openApplicationModal(3000, 30),
        whatsappMessage: `🇪🇸 *SOLICITUD OFICIAL DE PRÉSTAMO EN 30 MINUTOS — INSTACREDIT ESPAÑA*\n\n¡Hola, *${clientData.clientFirstName}*! Te saluda *${clientData.advisorName}*. Para radicar tu solicitud en 2 minutos, crear tu cuenta digital y recibir tu depósito en menos de 30 minutos, entra a nuestro enlace directo de alta:\n\n🔗 *Iniciar Solicitud Oficial aquí:*\n${baseUrl}/?solicitud_nueva=1\n\nAvísame apenas te genere tu número de expediente para darte prioridad inmediata. 🤝`
      }
    ],
    [baseUrl, clientData, currentApp, openDidacticForm, openDocumentModal, openUserBankPortal, openApplicationModal]
  );

  // Routine 6 Steps for Untrained Employees
  const dailyRoutineSteps = useMemo(
    () => [
      {
        stepNumber: 1,
        timeLabel: 'MINUTO 0 a 5',
        title: 'Paso 1: Saludo Oficial + Promesa 30 Minutos + Cuestionario URL 1 (Inicia Creación de Cuenta)',
        instruction:
          'Apenas entra el cliente, NO improvises. Pulsa el botón verde para enviarle el Paquete #1 (Imagen + Mensaje) y el enlace del Cuestionario 1.',
        kitId: 'kit-bienvenida-oficial',
        voiceId: 'audio-bienvenida-30min',
        urlItem: directUrlsCatalog[0]
      },
      {
        stepNumber: 2,
        timeLabel: 'MINUTO 5 a 10',
        title: 'Paso 2: Enviar Infografía de 4 Pasos + Cuestionario URL 1 de Solvencia',
        instruction:
          'Pídele que confirme su importe, plazo y finalidad enviando la URL Directa del Cuestionario 1 explicándole que así se va creando su cuenta.',
        kitId: 'kit-url-directa-encuesta-solvencia',
        voiceId: 'audio-solidez-trayectoria-12anos',
        urlItem: directUrlsCatalog[0]
      },
      {
        stepNumber: 3,
        timeLabel: 'MINUTO 10 a 18',
        title: 'Paso 3: Enviar Cuestionario URL 2 de Cuenta Bancaria IBAN SEPA y Bizum',
        instruction:
          'Envía el enlace directo del Cuestionario 2 para que registre su banco e IBAN español y quede lista la cuenta donde se depositará el dinero.',
        kitId: 'kit-url-directa-verificacion-iban',
        voiceId: 'audio-verificacion-iban-sepblac',
        urlItem: directUrlsCatalog[1]
      },
      {
        stepNumber: 4,
        timeLabel: 'SI NO RESPONDE / ANUNCIO',
        title: 'Paso 4: ¿Dejó en Visto o Vino del Anuncio hace Días? (Gancho + Reserva Activa)',
        instruction:
          'Si el cliente no contesta o respondió al anuncio hace días, envíale el Paquete de Reserva + Gancho de Sorteo VIP para reactivarlo.',
        kitId: 'kit-no-responde-2-horas',
        voiceId: 'audio-recordatorio-no-responde-1',
        urlItem: directUrlsCatalog[0]
      },
      {
        stepNumber: 5,
        timeLabel: 'MINUTO 18 a 25',
        title: 'Paso 5: Enviar los 5 Contratos Reales de 4 Páginas + Cuestionario URL 3 de Firma eIDAS',
        instruction:
          'Una vez aprobado, envíale el enlace de sus 5 contratos de 4 páginas (o bájalo en PDF) y la URL 3 para que firme con el dedo en su móvil.',
        kitId: 'kit-url-directa-firma-contratos-4pags',
        voiceId: 'audio-aprobacion-firma-eidas',
        urlItem: directUrlsCatalog[2]
      },
      {
        stepNumber: 6,
        timeLabel: 'MINUTO 25 a 30',
        title: 'Paso 6: Depósito Acreditado en la Cuenta Creada + Retiro por SEPA Instant / Bizum',
        instruction:
          'Confirma que, al haber llenado todas las URLs, su dinero ya está depositado en su Cuenta Digital creada y envíale la URL de su Banca Digital.',
        kitId: 'kit-desembolso-fondos-iban',
        voiceId: 'audio-desembolso-bizum-sepa',
        urlItem: directUrlsCatalog[4]
      }
    ],
    [directUrlsCatalog]
  );

  const nonResponsiveKits = useMemo(
    () => WHATSAPP_KITS.filter((k) => k.category === 'recordatorio_no_responde'),
    []
  );

  const legalDocsList: { type: DocumentType; number: string; title: string; law: string; summary: string }[] = [
    {
      type: 'contrato_mutuo',
      number: 'DOC-01 (4 Páginas)',
      title: 'Contrato de Préstamo Mercantil al Consumo y Ficha Europea INE',
      law: 'Ley 16/2011 de Contratos de Crédito al Consumo • Circular 5/2012 BdE',
      summary:
        'Incluye comparecencia societaria, cuadro INE (TIN, TAE, Aval FGA), amortización, domiciliación SEPA/Bizum y derecho de desistimiento de 14 días.'
    },
    {
      type: 'condiciones_generales',
      number: 'DOC-02 (4 Páginas)',
      title: 'Condiciones Generales de Apertura de Cuenta Digital IBAN y Pasarela SEPA',
      law: 'Real Decreto-ley 19/2018 de Servicios de Pago (PSD2) • SEPA Europeo',
      summary:
        'Regula la Cuenta Digital IBAN española creada por el cliente en los cuestionarios, donde se deposita el préstamo para retiro SEPA o Bizum.'
    },
    {
      type: 'politica_privacidad',
      number: 'DOC-03 (4 Páginas)',
      title: 'Política Oficial de Protección de Datos Personales y Derechos ARCO-POL',
      law: 'Reglamento (UE) 2016/679 (RGPD) • Ley Orgánica 3/2018 (LOPDGDD)',
      summary:
        'Detalla el responsable del tratamiento en Madrid, base jurídica, conservación por 10 años SEPBLAC y derechos ante la AEPD.'
    },
    {
      type: 'consentimiento_lopd',
      number: 'DOC-04 (4 Páginas)',
      title: 'Autorización Expresa de Solvencia ASNEF / EXPERIAN y Consulta CIRBE',
      law: 'Art. 20 LOPDGDD 3/2018 • Ley 44/2002 CIRBE Banco de España',
      summary:
        'Consentimiento informado para consultar solvencia patrimonial, validación policial DNI/NIE y preaviso legal de 10 días en caso de impago.'
    },
    {
      type: 'pagare_en_blanco',
      number: 'DOC-05 (4 Páginas)',
      title: 'Pagaré a la Orden Desmaterializado con Carta de Instrucciones y Sello eIDAS',
      law: 'Ley 19/1985 Cambiaria y del Cheque (Arts. 94-97) • Reglamento UE 910/2014 eIDAS',
      summary:
        'Título ejecutivo mercantil con promesa incondicional de pago, dispensa de protesto notarial ("Sin Gastos") y certificado SHA-256.'
    }
  ];

  const renderedPreviewDoc = useMemo(() => {
    if (!currentApp) return null;
    return generateLegalDocument(currentApp, selectedDocTypePreview);
  }, [currentApp, selectedDocTypePreview]);

  const activeTenCase = useMemo(
    () =>
      TEN_CASES_WITH_TEN_EXAMPLES.find((c) => c.id === selectedTenCaseId) ||
      TEN_CASES_WITH_TEN_EXAMPLES[0],
    [selectedTenCaseId]
  );

  const activePlaybook = useMemo(
    () =>
      FULL_CONVERSATION_PLAYBOOKS.find((p) => p.id === selectedPlaybookId) ||
      FULL_CONVERSATION_PLAYBOOKS[0],
    [selectedPlaybookId]
  );

  const activeRaffle = useMemo(
    () =>
      RAFFLE_HOOK_CAMPAIGNS.find((r) => r.id === selectedRaffleId) ||
      RAFFLE_HOOK_CAMPAIGNS[0],
    [selectedRaffleId]
  );

  // Instant Google-like search across all 100 examples
  const searchedExamplesAcrossAllCases = useMemo(() => {
    const q = globalLibrarySearch.trim().toLowerCase();
    if (!q) return [];
    const matches: {
      caseObj: (typeof TEN_CASES_WITH_TEN_EXAMPLES)[0];
      example: (typeof TEN_CASES_WITH_TEN_EXAMPLES)[0]['examples'][0];
    }[] = [];

    for (const c of TEN_CASES_WITH_TEN_EXAMPLES) {
      for (const ex of c.examples) {
        const msg = ex.whatsappReadyText(clientData).toLowerCase();
        if (
          c.title.toLowerCase().includes(q) ||
          c.whatClientSaidTrigger.toLowerCase().includes(q) ||
          ex.approachTitle.toLowerCase().includes(q) ||
          ex.advisorQuickQuestion.toLowerCase().includes(q) ||
          msg.includes(q)
        ) {
          matches.push({ caseObj: c, example: ex });
        }
      }
    }
    return matches.slice(0, 12);
  }, [globalLibrarySearch, clientData]);

  return (
    <div className="space-y-6">
      {/* Floating Toast Notification */}
      {dispatchNotice && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0B1B3D] text-white px-5 py-4 rounded-2xl shadow-2xl border-2 border-[#00E599] flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-[#00E599] shrink-0" />
          <p className="text-xs sm:text-sm font-bold leading-snug">{dispatchNotice}</p>
        </div>
      )}

      {/* TOP HERO BANNER: BIBLIOTECA & GOOGLE DEL ASESOR 100% LISTA PARA USAR */}
      <div className="bg-gradient-to-r from-[#0B1B3D] via-[#0F295E] to-[#0055FF] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00E599] text-[#0B1B3D] text-[11px] font-black uppercase px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Zap className="w-3.5 h-3.5" />
                CENTRAL TODO-EN-UNO EN &lt; 30 MINUTOS • 10 CASOS × 10 EJEMPLOS (100 GUIONES)
              </span>
              <span className="bg-amber-400 text-[#0B1B3D] text-xs font-black px-3 py-1 rounded-full">
                🏆 Incluye Panel de Sorteos VIP + Libretos Largos + Accesos Privados por Asesor
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Biblioteca Interactiva y Buscador Instantáneo del Asesor: 10 Formas por Caso, URLs de Creación de Cuenta, Sorteos VIP y Contratos de 4 Páginas
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Todo en un solo lugar listo para usar en <strong>menos de 30 minutos</strong>: por cada URL o cuestionario que el cliente va llenando, el sistema configura su <strong>Cuenta Digital (\`{clientData.digitalIban}\`)</strong> donde se le depositan sus <strong>{clientData.capitalAmount}</strong>. Toca cualquier botón para enviar el mensaje con su URL pública o adjuntar el contrato PDF de 4 páginas automáticamente.
            </p>
          </div>

          {/* Client Selector + Private Advisor Filter Box inside Hero */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full lg:w-[420px] shrink-0 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#00E599] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                Cliente Activo ({currentAdvisor.name}):
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyMyAssignedClients(!onlyMyAssignedClients)}
                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                    onlyMyAssignedClients
                      ? 'bg-[#00E599] text-[#0B1B3D] border-emerald-300'
                      : 'bg-white/10 text-blue-100 border-white/20 hover:bg-white/20'
                  }`}
                  title="Filtra para ver únicamente tus expedientes propios sin mezclar los de otros asesores"
                >
                  {onlyMyAssignedClients ? '🔒 Solo Mis Clientes' : '👥 Ver Todos'}
                </button>
                <button
                  type="button"
                  onClick={() => setUseCustomMode(!useCustomMode)}
                  className="text-[11px] font-bold underline text-blue-200 hover:text-white cursor-pointer"
                >
                  {useCustomMode ? 'Usar lista' : 'Manual'}
                </button>
              </div>
            </div>

            {!useCustomMode ? (
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B1B3D] text-white border border-blue-400/40 text-xs font-bold focus:outline-none"
              >
                {advisorFilteredApplications.map((app) => (
                  <option key={app.id} value={app.id}>
                    #{app.id} — {app.personalData.firstName} {app.personalData.lastName} (
                    {formatEUR(app.approvedAmount || app.loanDetails.capital)}) [{app.status}]
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nombre del cliente..."
                  value={customClientName}
                  onChange={(e) => setCustomClientName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0B1B3D] text-white border border-blue-400/40 text-xs font-bold"
                />
                <input
                  type="tel"
                  placeholder="Móvil (+34)..."
                  value={customClientPhone}
                  onChange={(e) => setCustomClientPhone(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0B1B3D] text-white border border-blue-400/40 text-xs font-bold"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-blue-100 bg-black/25 px-3 py-2 rounded-xl font-mono">
              <span>📱 +34 {clientData.clientPhone}</span>
              <span>💶 {clientData.capitalAmount}</span>
              <span>🏦 {clientData.digitalIban.slice(0, 12)}...</span>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs inside Hub */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSection('matriz_10x10_casos')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'matriz_10x10_casos'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>1. Matriz 10 Casos × 10 Formas (100 Respuestas y Preguntas en Vivo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('panel_sorteos_ganchos')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'panel_sorteos_ganchos'
                ? 'bg-amber-400 text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>2. Panel de Sorteos VIP, Ganchos y Actividades</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('libretos_conversaciones_largas')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'libretos_conversaciones_largas'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <MessagesSquare className="w-4 h-4" />
            <span>3. Libretos de Conversaciones Largas Completas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('accesos_privados_asesores')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'accesos_privados_asesores'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>4. Accesos Directos Privados por Asesor (Sin Pasar por Web Pública)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('recorrido_30min_guia_app')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'recorrido_30min_guia_app'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>5. Recorrido 30 Minutos y Guía de Uso App (Para Empleado y Cliente)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('rutina_diaria')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'rutina_diaria'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>6. Rutina Diaria 6 Pasos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('urls_directas')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'urls_directas'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>7. URLs Directas (8 Links)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('audios_clientes')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'audios_clientes'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>8. Audios .WAV ({CLIENT_VOICE_NOTE_TEMPLATES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('documentos_4_paginas')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'documentos_4_paginas'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>9. Contratos 4 Páginas (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('todos_paquetes_whatsapp')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'todos_paquetes_whatsapp'
                ? 'bg-[#00E599] text-[#0B1B3D] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>10. Paquetes Imagen+Mensaje ({WHATSAPP_KITS.length})</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: MATRIZ 10 CASOS × 10 EJEMPLOS (100 FORMAS LISTAS + BUSCADOR GOOGLE)
         ===================================================================== */}
      {activeSection === 'matriz_10x10_casos' && (
        <div className="space-y-6">
          {/* Google-Style Instant Search Bar for the Advisor */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full">
                  BUSCADOR INSTANTÁNEO TIPO GOOGLE + ACCESOS RÁPIDOS DE INTENCIÓN DEL CLIENTE
                </span>
                <h3 className="text-xl font-black text-[#0B1B3D] mt-1.5">
                  ¿Qué te dijo o cómo se siente {clientData.clientFirstName}? Elige uno de los 10 Casos y tendrás 10 Formas Exactas de Responder, Preguntar o Enviar en Audio/WhatsApp/PDF
                </h3>
              </div>

              <div className="relative w-full md:w-96 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={globalLibrarySearch}
                  onChange={(e) => setGlobalLibrarySearch(e.target.value)}
                  placeholder="Buscar en las 100 respuestas (ej: anuncio, duda, iban, sorteo, asnef)..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-[#0066FF] text-xs font-bold text-[#0B1B3D] focus:outline-none"
                />
              </div>
            </div>

            {/* Instant Search Results if query typed */}
            {searchedExamplesAcrossAllCases.length > 0 && (
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0B1B3D]">
                    🔍 Resultados instantáneos encontrados ({searchedExamplesAcrossAllCases.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setGlobalLibrarySearch('')}
                    className="text-xs font-bold text-rose-600 underline cursor-pointer"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchedExamplesAcrossAllCases.map(({ caseObj, example }) => {
                    const msg = example.whatsappReadyText(clientData);
                    return (
                      <div
                        key={`${caseObj.id}-${example.number}`}
                        className="bg-white p-4 rounded-xl border border-blue-200 space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-black text-[#0066FF]">
                            <span>{caseObj.intentBadge}</span>
                            <span>{example.styleBadge}</span>
                          </div>
                          <p className="text-xs font-black text-[#0B1B3D] mt-1">{example.approachTitle}</p>
                          <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap mt-2 bg-slate-50 p-2.5 rounded-lg max-h-32 overflow-y-auto">
                            {msg}
                          </pre>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsAppDirect(msg, example.approachTitle)}
                            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar WhatsApp + URL</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(`search-${caseObj.id}-${example.number}`, msg, example.approachTitle)
                            }
                            className="px-3 py-2 rounded-lg bg-slate-900 text-white font-black text-xs cursor-pointer"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 10 Quick Case Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
              {TEN_CASES_WITH_TEN_EXAMPLES.map((c) => {
                const isSelected = c.id === activeTenCase.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedTenCaseId(c.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#0B1B3D] text-white border-[#00E599] shadow-md'
                        : 'bg-slate-50 hover:bg-blue-50/50 text-[#0B1B3D] border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-lg">{c.iconEmoji}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#00E599] text-[#0B1B3D]' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        Caso {c.caseNumber} (10 Ejemplos)
                      </span>
                    </div>
                    <div className="mt-2 font-black text-xs leading-snug">{c.title.split(':')[1] || c.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Case Header + Image + Independent URL + 10 Examples Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900 text-white p-6 rounded-3xl">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#00E599] text-[#0B1B3D] font-black text-xs">
                    {activeTenCase.intentBadge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/15 text-blue-200 font-bold text-xs">
                    ⏱️ Objetivo en &lt; 30 Minutos
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black leading-tight">{activeTenCase.title}</h4>
                <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 space-y-1.5 text-xs">
                  <p>
                    <strong className="text-[#00E599]">🗣️ Lo que dijo o sintió el cliente:</strong>{' '}
                    <span className="italic text-blue-100">{activeTenCase.whatClientSaidTrigger}</span>
                  </p>
                  <p>
                    <strong className="text-amber-300">🎯 Qué debe lograr el asesor ahora mismo:</strong>{' '}
                    <span>{activeTenCase.advisorGoalIn30Min}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="bg-black/40 px-3 py-2 rounded-xl border border-blue-400/30 font-mono text-xs text-[#00E599]">
                    🔗 {activeTenCase.assignedUrlLabel}:{' '}
                    {activeTenCase.assignedUrlSlug === 'banca_digital'
                      ? `${baseUrl}/?banca_digital=${clientData.radicadoId}`
                      : `${baseUrl}/?form=${activeTenCase.assignedUrlSlug}&exp=${clientData.radicadoId}`}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#00E599] h-44 bg-slate-950">
                  <img
                    src={activeTenCase.pairedImageSrc}
                    alt={activeTenCase.pairedImageTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#00E599] text-[#0B1B3D]">
                      Imagen Corporativa Emparejada
                    </span>
                    <p className="text-white text-xs font-bold mt-1">{activeTenCase.pairedImageTitle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 10 Variations Grid for the Selected Case */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTenCase.examples.map((ex) => {
                const whatsappMsg = ex.whatsappReadyText(clientData);
                const audioScript = ex.spokenAudioScript(clientData);
                const audioPlayKey = `${activeTenCase.id}-ex-${ex.number}`;
                const isPlaying = playingAudioId === audioPlayKey;

                return (
                  <div
                    key={ex.number}
                    className="rounded-3xl border-2 border-slate-200 hover:border-[#0066FF] transition p-5 flex flex-col justify-between bg-slate-50/60 space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-lg bg-[#0B1B3D] text-[#00E599] font-black text-xs">
                          FORMA #{ex.number} DE 10
                        </span>
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs">
                          {ex.styleBadge}
                        </span>
                      </div>

                      <h5 className="font-black text-base text-[#0B1B3D]">{ex.approachTitle}</h5>

                      {/* Quick Question for Advisor Screen */}
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
                        <span className="font-black text-amber-950 uppercase block text-[10px]">
                          💬 Pregunta Directa Rápida para Hacerle al Cliente:
                        </span>
                        <p className="font-bold text-[#0B1B3D] mt-0.5">"{ex.advisorQuickQuestion}"</p>
                      </div>

                      {/* Exact WhatsApp Message with Emojis and Independent URL */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                          <span>Plantilla Lista con Emojis + URL Independiente:</span>
                          <span className="text-emerald-700">Lista para Enviar</span>
                        </div>
                        <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          {whatsappMsg}
                        </pre>
                      </div>

                      {/* Audio / Spoken Script Option */}
                      <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#00E599]">
                          <span>🎙️ Cómo Decirlo por Llamada o Nota de Voz:</span>
                          <button
                            type="button"
                            onClick={() => handlePlayCustomSpeech(audioPlayKey, audioScript)}
                            className="px-2.5 py-0.5 rounded bg-[#00E599] text-[#0B1B3D] font-black cursor-pointer flex items-center gap-1"
                          >
                            {isPlaying ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            <span>{isPlaying ? 'Detener Voz' : '🔊 Escuchar'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-blue-100 italic leading-relaxed">"{audioScript}"</p>
                      </div>
                    </div>

                    {/* Action Buttons: 1-Click WhatsApp + Image Kit + PDF Attach + Copy */}
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenWhatsAppDirect(
                              whatsappMsg,
                              `Caso ${activeTenCase.caseNumber} - Forma #${ex.number}`
                            )
                          }
                          className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar WhatsApp + URL (1 Clic)</span>
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            const res = await dispatchKitInOneAction({
                              imageSrc: activeTenCase.pairedImageSrc,
                              imageTitle: activeTenCase.pairedImageTitle,
                              messageText: whatsappMsg,
                              clientPhone: clientData.clientPhone,
                              clientName: clientData.clientName,
                              kitId: `${activeTenCase.id}-${ex.number}`
                            });
                            showToast(res.message);
                          }}
                          className="px-3 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Enviar con Imagen Oficial</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleSendWhatsAppWithPdfDownload(
                              whatsappMsg,
                              'contrato_mutuo',
                              `Caso ${activeTenCase.caseNumber} Forma #${ex.number}`
                            )
                          }
                          className="px-2.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          title="Descarga automáticamente el Contrato PDF de 4 páginas y abre WhatsApp con el mensaje"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>+ PDF 4 Págs</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadVoiceWav(`${activeTenCase.id}_f${ex.number}`)}
                          className="px-2.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Audio .WAV</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(
                              `${activeTenCase.id}-copy-${ex.number}`,
                              whatsappMsg,
                              `Forma #${ex.number}`
                            )
                          }
                          className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {copiedId === `${activeTenCase.id}-copy-${ex.number}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 2: PANEL DE SORTEOS VIP, GANCHOS Y ACTIVIDADES PERSONALIZABLES
         ===================================================================== */}
      {activeSection === 'panel_sorteos_ganchos' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-950 bg-amber-300 px-3 py-1 rounded-full">
                PANEL DE SORTEOS PREFERENTES, GANCHOS DE CIERRE Y ACTIVIDADES PARA EL CLIENTE
              </span>
              <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
                Ajusta y Personaliza el Sorteo o Beneficio VIP para Enganchar y Asegurar a {clientData.clientName} en Menos de 30 Minutos
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Si el asesor considera que el cliente necesita un incentivo adicional para completar sus enlaces hoy mismo, aquí puede personalizar el premio, el número de ticket y el tiempo límite, y enviarlo con su tarjeta gráfica VIP.
              </p>
            </div>
          </div>

          {/* Selector of 3 Raffle / Hook Campaigns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RAFFLE_HOOK_CAMPAIGNS.map((camp) => {
              const isSelected = camp.id === activeRaffle.id;
              return (
                <button
                  key={camp.id}
                  type="button"
                  onClick={() => {
                    setSelectedRaffleId(camp.id);
                    setCustomRafflePrize(camp.defaultPrize);
                    setCustomRaffleDeadline(camp.defaultDeadlineMinutes);
                    setCustomRaffleTicketCode(`VIP-ES-${clientData.radicadoId.slice(-4)}`);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1B3D] text-white border-amber-400 shadow-lg'
                      : 'bg-amber-50/40 hover:bg-amber-50 text-[#0B1B3D] border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-400 text-[#0B1B3D]">
                      {camp.code}
                    </span>
                    <span className="text-[11px] font-bold text-amber-500">{camp.badge}</span>
                  </div>
                  <h4 className="font-black text-sm mt-2">{camp.title}</h4>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-600'}`}>
                    {camp.hookObjective}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Customizer + Live Preview of Raffle Hook */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 h-52 bg-slate-900 shadow-md">
                <img
                  src={activeRaffle.pairedImageSrc}
                  alt={activeRaffle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                  <span className="px-2.5 py-0.5 rounded bg-amber-400 text-[#0B1B3D] font-black text-[10px] uppercase">
                    Imagen Oficial del Sorteo que Recibe el Cliente
                  </span>
                  <p className="text-white text-xs font-bold mt-1">{activeRaffle.title}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="font-black text-xs uppercase text-[#0B1B3D] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-500" />
                  Personalizar Gancho antes de Enviar a {clientData.clientFirstName}:
                </h5>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    🎁 Premio o Beneficio que Verá el Cliente:
                  </label>
                  <input
                    type="text"
                    value={customRafflePrize}
                    onChange={(e) => setCustomRafflePrize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#0B1B3D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      🎟️ Código de Ticket VIP:
                    </label>
                    <input
                      type="text"
                      value={customRaffleTicketCode}
                      onChange={(e) => setCustomRaffleTicketCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-[#0B1B3D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      ⏱️ Minutos Límite:
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={customRaffleDeadline}
                      onChange={(e) => setCustomRaffleDeadline(Number(e.target.value) || 25)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#0B1B3D]"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
                  <strong className="text-amber-950 block">📌 Actividad que debe hacer el cliente:</strong>
                  <span className="text-slate-700">{activeRaffle.activityForClient}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              {(() => {
                const raffleWhatsAppText = activeRaffle.buildWhatsAppHook(
                  clientData,
                  customRafflePrize,
                  customRaffleTicketCode,
                  customRaffleDeadline
                );
                const raffleVoiceText = activeRaffle.buildVoiceHook(
                  clientData,
                  customRafflePrize,
                  customRaffleTicketCode,
                  customRaffleDeadline
                );

                return (
                  <>
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 space-y-2">
                        <div className="flex items-center justify-between text-xs font-black text-amber-900">
                          <span>📲 MENSAJE DE WHATSAPP PERSONALIZADO CON URL DE ACTIVACIÓN:</span>
                          <span>Ticket: {customRaffleTicketCode}</span>
                        </div>
                        <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto bg-amber-50/30 p-3 rounded-xl">
                          {raffleWhatsAppText}
                        </pre>
                      </div>

                      <div className="bg-[#0B1B3D] text-white p-4 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-black text-amber-400">
                          <span>🔊 GUIÓN DE AUDIO / NOTA DE VOZ DEL SORTEO VIP:</span>
                          <button
                            type="button"
                            onClick={() => handlePlayCustomSpeech('raffle-voice', raffleVoiceText)}
                            className="px-3 py-1 rounded-lg bg-amber-400 text-[#0B1B3D] font-black text-xs cursor-pointer flex items-center gap-1"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Escuchar Audio del Sorteo</span>
                          </button>
                        </div>
                        <p className="text-xs text-blue-100 italic leading-relaxed">"{raffleVoiceText}"</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await dispatchKitInOneAction({
                            imageSrc: activeRaffle.pairedImageSrc,
                            imageTitle: activeRaffle.title,
                            messageText: raffleWhatsAppText,
                            clientPhone: clientData.clientPhone,
                            clientName: clientData.clientName,
                            kitId: activeRaffle.id
                          });
                          showToast(res.message);
                        }}
                        className="px-4 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#0B1B3D] font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Enviar Imagen Sorteo + Mensaje</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenWhatsAppDirect(raffleWhatsAppText, `Sorteo VIP ${customRaffleTicketCode}`)
                        }
                        className="px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Send className="w-4 h-4" />
                        <span>Enviar Gancho por WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadVoiceWav(`sorteo_${customRaffleTicketCode}`)}
                        className="px-4 py-3.5 rounded-2xl bg-[#0B1B3D] hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#00E599]" />
                        <span>Descargar Audio .WAV</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 3: LIBRETOS DE CONVERSACIONES LARGAS COMPLETAS (PREGUNTAS Y RESPUESTAS)
         ===================================================================== */}
      {activeSection === 'libretos_conversaciones_largas' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                LIBRETOS COMPLETOS DE CONVERSACIONES LARGAS DE PRINCIPIO A FIN (&lt; 30 MINUTOS)
              </span>
              <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
                Diálogos Completos Turno por Turno (Lo que Pregunta el Cliente y lo que Responde el Asesor hasta el Depósito en su Cuenta)
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Diseñado para que el asesor lleve al cliente potencial de la mano desde el saludo inicial, pasando por los 3 enlaces de creación de cuenta, hasta que recibe sus <strong>{clientData.capitalAmount}</strong> depositados.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {FULL_CONVERSATION_PLAYBOOKS.map((pb) => (
                <button
                  key={pb.id}
                  type="button"
                  onClick={() => setSelectedPlaybookId(pb.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    selectedPlaybookId === pb.id
                      ? 'bg-[#0B1B3D] text-[#00E599] shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pb.badge}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-black text-lg text-[#00E599]">{activePlaybook.title}</h4>
              <p className="text-xs text-blue-100 mt-0.5">{activePlaybook.subtitle}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-[11px] text-slate-300">
                <span>👤 <strong>Perfil:</strong> {activePlaybook.clientProfile}</span>
                <span>⏱️ <strong>Duración total:</strong> {activePlaybook.estimatedTime}</span>
                <span>🏆 <strong>Resultado:</strong> {activePlaybook.finalOutcome}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {activePlaybook.turns.map((turn) => {
              const text = turn.messageText(clientData);
              const isAdvisor = turn.speaker === 'ASESOR';

              return (
                <div
                  key={turn.turnNumber}
                  className={`p-5 rounded-3xl border-2 transition ${
                    isAdvisor
                      ? 'bg-emerald-50/40 border-emerald-300 ml-0 md:ml-8'
                      : 'bg-slate-50 border-slate-200 mr-0 md:mr-8'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          isAdvisor ? 'bg-[#0B1B3D] text-[#00E599]' : 'bg-slate-700 text-white'
                        }`}
                      >
                        TURNO #{turn.turnNumber} • {isAdvisor ? `👨‍💼 ASESOR (${clientData.advisorName})` : `🧑 CLIENTE (${clientData.clientFirstName})`}
                      </span>
                      <span className="text-xs font-bold text-[#0066FF] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                        {turn.intentTag}
                      </span>
                    </div>

                    {isAdvisor && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlayCustomSpeech(`pb-${activePlaybook.id}-${turn.turnNumber}`, text)}
                          className="px-3 py-1.5 rounded-xl bg-[#0B1B3D] text-white font-black text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#00E599]" />
                          <span>Escuchar Voz</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(`pb-copy-${turn.turnNumber}`, text, `Turno #${turn.turnNumber}`)
                          }
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsAppDirect(text, `Libreto Turno #${turn.turnNumber}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar a {clientData.clientFirstName}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
                    {text}
                  </pre>

                  <div className="mt-2.5 text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      <strong>Instrucción didáctica para el empleado:</strong> {turn.advisorInternalNote}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 4: ACCESOS DIRECTOS PRIVADOS WEB PARA CADA ASESOR (SIN PASAR POR WEB PÚBLICA)
         ===================================================================== */}
      {activeSection === 'accesos_privados_asesores' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
              ACCESOS DIRECTOS PRIVADOS WEB POR ASESOR (CON PRIVILEGIOS E INFORMACIÓN PROPIA AISLADA)
            </span>
            <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
              Enlaces Directos Privados para que Cada Asesor Entre Directo a su Consola de Trabajo sin Pasar por la Web Pública de Clientes
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Cada asesor tiene su propia URL privada (`/?asesor=ADV-01`, `/?asesor=ADV-02`, etc.) que abre directamente su panel con su nombre, teléfono corporativo, plantillas personalizadas con su firma y su cartera propia de clientes sin cruzarse con la de otros compañeros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {advisorsList.map((adv) => {
              const privateAdvisorUrl = `${baseUrl}/?asesor=${adv.id}`;
              const isCurrent = adv.id === currentAdvisor.id;
              const assignedCount = applications.filter((a) => a.assignedAdvisorId === adv.id).length;

              return (
                <div
                  key={adv.id}
                  className={`rounded-3xl border-2 p-5 flex flex-col justify-between space-y-4 transition ${
                    isCurrent
                      ? 'border-[#00E599] bg-emerald-50/30 shadow-md'
                      : 'border-slate-200 bg-slate-50/50 hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={adv.avatar}
                          alt={adv.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-[#0066FF]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-base text-[#0B1B3D]">{adv.name}</h4>
                            <span className="px-2 py-0.5 rounded bg-[#0B1B3D] text-[#00E599] font-mono font-black text-[10px]">
                              {adv.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-bold">{adv.roleTitle}</p>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="px-3 py-1 rounded-full bg-[#00E599] text-[#0B1B3D] font-black text-[10px] uppercase">
                          Sesión Activa
                        </span>
                      )}
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="text-[10px] font-black uppercase text-slate-400 flex items-center justify-between">
                        <span>🔗 URL Privada Directa del Asesor (Guardar en Favoritos):</span>
                        <span className="text-emerald-700">Acceso Directo con Privilegios</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-[#0066FF] break-all select-all">
                        {privateAdvisorUrl}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Móvil Corporativo Propio:</span>
                        <span className="font-black text-[#0B1B3D]">+34 {adv.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Clientes Asignados:</span>
                        <span className="font-black text-emerald-700">{assignedCount} expedientes propios</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          `adv-url-${adv.id}`,
                          privateAdvisorUrl,
                          `URL Privada de ${adv.name}`
                        )
                      }
                      className="px-3 py-2.5 rounded-xl bg-[#0B1B3D] hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#00E599]" />
                      <span>Copiar URL Privada</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentAdvisor(adv);
                        setOnlyMyAssignedClients(true);
                        showToast(
                          `🔒 Sesión privada activada para ${adv.name}. Mostrando únicamente su información y clientes propios.`
                        );
                      }}
                      className="px-3 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Activar Su Perfil Propio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = `🔐 *ACCESO DIRECTO PRIVADO DE ASESOR — INSTACREDIT ESPAÑA*\n\nHola *${adv.name}*, aquí tienes tu enlace web privado con privilegios de asesor para entrar directamente a tu panel sin pasar por la web pública:\n\n👉 ${privateAdvisorUrl}\n\n• ID Asesor: *${adv.id}*\n• Todas tus plantillas, audios y URLs ya salen firmadas con tu nombre.`;
                        window.open(
                          `https://wa.me/34${adv.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`,
                          '_blank'
                        );
                      }}
                      className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Acceso al Empleado</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 5: RECORRIDO EXPLICATIVO 30 MINUTOS Y GUÍA DE USO DE LA APP
         ===================================================================== */}
      {activeSection === 'recorrido_30min_guia_app' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
              RECORRIDO EXPLICATIVO DE LA APP EN &lt; 30 MINUTOS (PARA ENTREGAR AL CLIENTE Y CAPACITAR AL EMPLEADO)
            </span>
            <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
              Cómo Funciona la Creación de Cuenta por cada Cuestionario URL hasta el Depósito del Dinero
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Hay clientes que no tienen claro cómo aplicarse el préstamo y empleados nuevos que no conocen el flujo. Aquí tienes el recorrido visual exacto y el material listo para enviarle al cliente y explicarle cómo cada URL va configurando su cuenta hasta depositarle sus <strong>{clientData.capitalAmount}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900 text-white p-6 rounded-3xl">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#00E599] text-[#0B1B3D] font-black text-xs uppercase">
                Infografía Oficial de Recorrido en 30 Minutos
              </span>
              <h4 className="text-2xl font-black leading-tight">
                El Ciclo de 4 Pasos: De los Cuestionarios URL al Depósito Directo en la Cuenta Creada
              </h4>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Envía esta tarjeta visual junto con su explicación paso a paso a cualquier cliente que pregunte <em>"¿Cómo funciona la aplicación?"</em> o <em>"¿Cómo me entregan el dinero?"</em>.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const guideText =
                      `🧭 *GUÍA PASO A PASO: CÓMO RECIBES TUS ${clientData.capitalAmount} EN MENOS DE 30 MINUTOS (#${clientData.radicadoId})*\n\n` +
                      `Hola *${clientData.clientFirstName}*, te saluda *${clientData.advisorName}* de *INSTACREDIT España*. Te comparto el recorrido exacto de nuestra aplicación:\n\n` +
                      `1️⃣ *Cuestionario URL 1 (Minuto 0-5):* Confirmas tu importe, plazo y datos básicos.\n` +
                      `   👉 ${baseUrl}/?form=solicitud&exp=${clientData.radicadoId}\n\n` +
                      `2️⃣ *Cuestionario URL 2 (Minuto 5-15):* Vinculas tu código IBAN español (\`ES...\`) y el sistema deja creada tu *Cuenta Digital* (\`${clientData.digitalIban}\`).\n` +
                      `   👉 ${baseUrl}/?form=iban&exp=${clientData.radicadoId}\n\n` +
                      `3️⃣ *Cuestionario URL 3 (Minuto 15-22):* Revisas tus 5 contratos oficiales de 4 páginas y firmas con el dedo desde la pantalla de tu móvil.\n` +
                      `   👉 ${baseUrl}/?form=cuota_firma&exp=${clientData.radicadoId}\n\n` +
                      `4️⃣ *Depósito en tu Cuenta Creada (Minuto 22-30):* Una vez completado todo, tus *${clientData.capitalAmount}* aparecen depositados en tu Cuenta Digital para que los retires al instante por *SEPA Instant* o *Bizum*:\n` +
                      `   👉 ${baseUrl}/?banca_digital=${clientData.radicadoId}\n\n` +
                      `¡Estoy en línea para guiarte en cada enlace! 🤝🇪🇸`;

                    const res = await dispatchKitInOneAction({
                      imageSrc: '/src/assets/images/ws_recorrido_30_minutos_1791522034719.jpg',
                      imageTitle: 'Recorrido Oficial de 4 Pasos en Menos de 30 Minutos',
                      messageText: guideText,
                      clientPhone: clientData.clientPhone,
                      clientName: clientData.clientName,
                      kitId: 'guia-recorrido-30min'
                    });
                    showToast(res.message);
                  }}
                  className="px-5 py-3 rounded-2xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Guía Visual Completa + 4 Enlaces al Cliente</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border-2 border-[#00E599] shadow-xl">
                <img
                  src="/src/assets/images/ws_recorrido_30_minutos_1791522034719.jpg"
                  alt="Recorrido en menos de 30 minutos"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4 Didactic Cards Explaining Advisor Side vs Client Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: 'ETAPA 1 (Min 0 a 5)',
                title: '1. Cuestionario URL 1: Solicitud e Inicio de Cuenta',
                whatClientDoes:
                  'Abre el enlace 1 en su móvil, escucha la guía con el botón de altavoz 🔊, confirma el importe deseado y envía.',
                whatAdvisorDoes:
                  'En cuanto el cliente avisa que lo envió, le manda felicitación y el enlace del Cuestionario URL 2.',
                url: `${baseUrl}/?form=solicitud&exp=${clientData.radicadoId}`
              },
              {
                step: 'ETAPA 2 (Min 5 a 15)',
                title: '2. Cuestionario URL 2: Vinculación IBAN y Cuenta Digital',
                whatClientDoes:
                  'Indica su banco en España y pega su código IBAN (ES...) certificando que es el titular único.',
                whatAdvisorDoes:
                  'Verifica que el IBAN sea español y del mismo titular, y pasa el expediente a estado "Aprobado".',
                url: `${baseUrl}/?form=iban&exp=${clientData.radicadoId}`
              },
              {
                step: 'ETAPA 3 (Min 15 a 22)',
                title: '3. Cuestionario URL 3: Contratos 4 Págs y Firma eIDAS',
                whatClientDoes:
                  'Puede ver/descargar sus 5 contratos de 4 páginas y dibuja su firma con el dedo en el recuadro del móvil.',
                whatAdvisorDoes:
                  'Confirma la firma eIDAS y pulsa "Desembolsar Fondos" para acreditar el dinero en la cuenta creada.',
                url: `${baseUrl}/?form=cuota_firma&exp=${clientData.radicadoId}`
              },
              {
                step: 'ETAPA 4 (Min 22 a 30)',
                title: '4. Depósito en Cuenta Creada y Retiro SEPA / Bizum',
                whatClientDoes:
                  'Entra a su Portal de Banca Digital y ve sus fondos depositados listos para transferir a su banco o Bizum.',
                whatAdvisorDoes:
                  'Envía el comprobante de depósito acreditado y ofrece el enlace de satisfacción y aumento de cupo VIP.',
                url: `${baseUrl}/?banca_digital=${clientData.radicadoId}`
              }
            ].map((card, i) => (
              <div
                key={i}
                className="p-5 rounded-3xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0B1B3D] text-[#00E599] font-black text-[10px]">
                    {card.step}
                  </span>
                  <h5 className="font-black text-sm text-[#0B1B3D]">{card.title}</h5>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <p>
                      <strong className="text-[#0066FF]">📱 Qué hace el cliente:</strong> {card.whatClientDoes}
                    </p>
                    <p>
                      <strong className="text-emerald-700">👨‍💼 Qué hace el empleado:</strong> {card.whatAdvisorDoes}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenWhatsAppDirect(
                      `Hola *${clientData.clientFirstName}*, aquí tienes el enlace directo de la *${card.title}*:\n👉 ${card.url}`,
                      card.title
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Enlace de esta Etapa</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 6: RUTINA GUIADA PASO A PASO PARA EMPLEADOS SIN EXPERIENCIA
         ===================================================================== */}
      {activeSection === 'rutina_diaria' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full">
                  RUTINA DIARIA ESTÁNDAR (MODO PILOTO AUTOMÁTICO EN &lt; 30 MINUTOS)
                </span>
                <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
                  ¿Qué debo enviarle a {clientData.clientName} ahora mismo? Sigue estos 6 pasos en orden:
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  El empleado no tiene que inventar ni escribir nada. En cada paso tiene el <strong>Paquete Imagen + Mensaje</strong>, el <strong>Audio de Voz</strong> y la <strong>URL Directa</strong> listos para enviar tal cual.
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl text-right shrink-0">
                <div className="text-[10px] font-extrabold uppercase text-emerald-700">Progreso de Rutina con el Cliente</div>
                <div className="text-2xl font-black text-emerald-900">
                  {completedRoutineSteps.length} / {dailyRoutineSteps.length} Pasos
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              {dailyRoutineSteps.map((step) => {
                const kit = WHATSAPP_KITS.find((k) => k.id === step.kitId) || WHATSAPP_KITS[0];
                const voiceNote =
                  CLIENT_VOICE_NOTE_TEMPLATES.find((v) => v.id === step.voiceId) || CLIENT_VOICE_NOTE_TEMPLATES[0];
                const isDone = completedRoutineSteps.includes(step.stepNumber);
                const exactWhatsAppText = kit.getTemplate(clientData as KitTemplateParams);
                const directFormUrl = step.urlItem.url;
                const spokenScript = voiceNote.getSpokenScript({
                  ...clientData,
                  directFormUrl
                });

                return (
                  <div
                    key={step.stepNumber}
                    className={`rounded-3xl border-2 transition overflow-hidden ${
                      isDone
                        ? 'border-emerald-400 bg-emerald-50/20'
                        : 'border-slate-200 bg-white shadow-sm'
                    }`}
                  >
                    {/* Step Header */}
                    <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCompletedRoutineSteps((prev) =>
                              prev.includes(step.stepNumber)
                                ? prev.filter((n) => n !== step.stepNumber)
                                : [...prev, step.stepNumber]
                            )
                          }
                          className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center cursor-pointer transition ${
                            isDone
                              ? 'bg-[#00E599] text-[#0B1B3D]'
                              : 'bg-white/15 text-white hover:bg-white/25'
                          }`}
                        >
                          {isDone ? <Check className="w-5 h-5" /> : step.stepNumber}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#0066FF] text-white">
                              {step.timeLabel}
                            </span>
                            <h4 className="font-black text-sm sm:text-base">{step.title}</h4>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">{step.instruction}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!completedRoutineSteps.includes(step.stepNumber)) {
                            setCompletedRoutineSteps((prev) => [...prev, step.stepNumber]);
                          }
                          handleSendCompleteKit(kit);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-black text-xs flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Enviar Paquete Imagen + Mensaje Exacto (1 Clic)</span>
                      </button>
                    </div>

                    {/* Step 3 Columns: 1. Image + Message | 2. Audio Voice Note | 3. Direct URL */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Col 1: Image + Exact WhatsApp Template (5 cols) */}
                      <div className="lg:col-span-5 space-y-3 flex flex-col justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase text-[#0B1B3D] flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4 text-[#0066FF]" />
                              1. Paquete Imagen + Plantilla Exacta WhatsApp
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              {kit.badge}
                            </span>
                          </div>

                          <div className="relative rounded-xl overflow-hidden border border-slate-300 h-36 bg-slate-900">
                            <img
                              src={kit.image.src}
                              alt={kit.image.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5">
                              <p className="text-white text-xs font-bold leading-tight">{kit.image.title}</p>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-200 max-h-44 overflow-y-auto text-[11px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {exactWhatsAppText}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleSendCompleteKit(kit)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar Imagen+Texto</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(`routine-kit-${step.stepNumber}`, exactWhatsAppText, 'Mensaje exacto de WhatsApp')
                            }
                            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {copiedId === `routine-kit-${step.stepNumber}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Texto Tal Cual</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Col 2: Audio / Voice Note Ready for Client (4 cols) */}
                      <div className="lg:col-span-4 space-y-3 flex flex-col justify-between bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase text-amber-950 flex items-center gap-1.5">
                              <Volume2 className="w-4 h-4 text-amber-600" />
                              2. Audio / Nota de Voz para el Cliente
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                              {voiceNote.durationEstimate}
                            </span>
                          </div>

                          <p className="text-xs font-extrabold text-[#0B1B3D]">{voiceNote.title}</p>
                          <p className="text-[11px] text-amber-900 bg-amber-100/80 p-2 rounded-lg border border-amber-200">
                            💡 <strong>Cuándo aplicarlo:</strong> {voiceNote.whenToUse}
                          </p>

                          <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-slate-700 italic leading-relaxed max-h-36 overflow-y-auto">
                            "{spokenScript}"
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handlePlayVoiceNote(voiceNote)}
                              className={`px-3 py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                                playingAudioId === voiceNote.id
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-[#0B1B3D] hover:bg-slate-800 text-white'
                              }`}
                            >
                              {playingAudioId === voiceNote.id ? (
                                <>
                                  <Square className="w-3.5 h-3.5" />
                                  <span>Detener Audio</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 text-[#00E599]" />
                                  <span>🔊 Escuchar Voz</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadVoiceWav(voiceNote.id)}
                              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Bajar Audio .WAV</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenWhatsAppDirect(
                                voiceNote.getCompanionWhatsAppText({ ...clientData, directFormUrl }),
                                `Audio + Link: ${voiceNote.title}`
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Enviar Aviso de Nota de Voz + Link por WhatsApp</span>
                          </button>
                        </div>
                      </div>

                      {/* Col 3: Direct Verification / Survey Form URL (3 cols) */}
                      <div className="lg:col-span-3 space-y-3 flex flex-col justify-between bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
                        <div className="space-y-2.5">
                          <span className="text-[11px] font-black uppercase text-blue-950 flex items-center gap-1.5">
                            <Link2 className="w-4 h-4 text-[#0066FF]" />
                            3. URL Directa de Cuestionario
                          </span>

                          <p className="text-xs font-extrabold text-[#0B1B3D]">{step.urlItem.title}</p>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{step.urlItem.purpose}</p>

                          <div className="bg-white p-2.5 rounded-xl border border-blue-200 font-mono text-[11px] text-[#0066FF] break-all select-all">
                            {step.urlItem.url}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(`routine-url-${step.stepNumber}`, step.urlItem.url, 'URL directa del formulario')
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar URL Directa</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenWhatsAppDirect(step.urlItem.whatsappMessage, step.urlItem.title)
                            }
                            className="w-full px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar URL por WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={step.urlItem.openAction}
                            className="w-full px-3 py-2 rounded-xl bg-white hover:bg-blue-100 text-[#0B1B3D] border border-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir Formulario en Vivo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 7: URLS DIRECTAS PARA CADA FORMULARIO, VERIFICACIÓN Y ENCUESTA
         ===================================================================== */}
      {activeSection === 'urls_directas' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full">
                DIRECTORIO OFICIAL DE URLS DIRECTAS PARA ENVIAR POR WHATSAPP
              </span>
              <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
                Enlaces Directos Listos para Creación de Cuenta, Verificación IBAN, Contratos 4 Páginas y Firma
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Cada enlace abre automáticamente el cuestionario o documento exacto del cliente <strong>{clientData.clientName} (#{clientData.radicadoId})</strong> con lectura asistida por voz.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {directUrlsCatalog.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border-2 border-slate-200 hover:border-[#0066FF] transition p-5 flex flex-col justify-between bg-slate-50/50 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0B1B3D] text-[#00E599] font-mono font-black text-xs">
                      {item.code}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="font-black text-base text-[#0B1B3D]">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.purpose}</p>

                  <div className="bg-white p-3 rounded-xl border border-blue-200 space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400">
                      URL Pública Personalizada para el Cliente:
                    </div>
                    <div className="font-mono text-xs font-bold text-[#0066FF] break-all select-all">
                      {item.url}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400">
                      Plantilla Exacta con URL para Enviar por WhatsApp:
                    </div>
                    <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                      {item.whatsappMessage}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(item.id, item.url, `URL ${item.code}`)}
                    className="px-3 py-2.5 rounded-xl bg-[#0B1B3D] hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#00E599]" />
                    <span>Copiar Solo URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenWhatsAppDirect(item.whatsappMessage, item.title)}
                    className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar por WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={item.openAction}
                    className="px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Probar / Abrir Ahora</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 8: MENSAJES DE AUDIO LISTOS PARA APLICAR AL CLIENTE
         ===================================================================== */}
      {activeSection === 'audios_clientes' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              BIBLIOTECA DE NOTAS DE VOZ Y AUDIOS PARA CLIENTES DE WHATSAPP
            </span>
            <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
              {CLIENT_VOICE_NOTE_TEMPLATES.length} Mensajes de Audio Personalizados Listos para Reproducir o Descargar (.WAV)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Si el asesor considera que un audio acelerará el cierre de <strong>{clientData.clientName}</strong>, puede escucharlo en voz española (`es-ES`), reproducirlo con el altavoz mientras graba la nota de voz en WhatsApp, o descargar el archivo `.WAV`.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLIENT_VOICE_NOTE_TEMPLATES.map((voice) => {
              const directFormUrl = `${baseUrl}/?form=${voice.pairedFormSlug || 'solicitud'}&exp=${clientData.radicadoId}`;
              const spokenScript = voice.getSpokenScript({ ...clientData, directFormUrl });
              const companionText = voice.getCompanionWhatsAppText({ ...clientData, directFormUrl });
              const isPlaying = playingAudioId === voice.id;

              return (
                <div
                  key={voice.id}
                  className="rounded-3xl border-2 border-slate-200 hover:border-amber-400 transition p-5 flex flex-col justify-between bg-amber-50/30 space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase text-slate-500">
                        {voice.categoryLabel}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${voice.badgeColor}`}>
                        {voice.badge}
                      </span>
                    </div>

                    <h4 className="font-black text-base text-[#0B1B3D]">{voice.title}</h4>

                    <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                      <div>
                        <strong className="text-[#0B1B3D]">📌 Cuándo usar este audio:</strong>{' '}
                        <span className="text-slate-700">{voice.whenToUse}</span>
                      </div>
                      <div>
                        <strong className="text-emerald-800">🎙️ Consejo de entonación:</strong>{' '}
                        <span className="text-slate-700">{voice.advisorTip}</span>
                      </div>
                    </div>

                    <div className="bg-[#0B1B3D] text-white p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#00E599] font-bold">
                        <span>GUIÓN EXACTO DE LA NOTA DE VOZ (PERSONALIZADO):</span>
                        <span>Duración: {voice.durationEstimate}</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-blue-50 italic">
                        "{spokenScript}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayVoiceNote(voice)}
                        className={`px-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition ${
                          isPlaying
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-md'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Square className="w-4 h-4" />
                            <span>Detener Reproducción</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>🔊 Reproducir Audio en Voz Alta</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadVoiceWav(voice.id)}
                        className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B1B3D] font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar Archivo .WAV</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenWhatsAppDirect(companionText, `Mensaje Acompañante de Audio: ${voice.title}`)
                        }
                        className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Mensaje + Link por WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyText(voice.id, spokenScript, 'Guión de nota de voz')}
                        className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Guión de Voz</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 9: DOCUMENTOS LEGALES REALES (5 CONTRATOS DE 4 PÁGINAS CADA UNO)
         ===================================================================== */}
      {activeSection === 'documentos_4_paginas' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                DOCUMENTOS LEGALES REALES DE ESPAÑA • MÍNIMO 4 PÁGINAS POR CONTRATO
              </span>
              <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
                5 Contratos y Documentos Oficiales de 4 Páginas Listos para Enviar por URL o Descargar en PDF Adjunto
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Todos los documentos incluyen las 4 páginas completas con los datos reales de <strong>{clientData.clientName} (#{clientData.radicadoId})</strong> y la Cuenta Digital creada (`{clientData.digitalIban}`).
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  handleOpenWhatsAppDirect(
                    directUrlsCatalog[3].whatsappMessage,
                    'Envío de URL de los 5 Contratos de 4 Páginas'
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Enviar URL de Contratos por WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Selector of the 5 Documents */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {legalDocsList.map((doc) => {
              const isSelected = selectedDocTypePreview === doc.type;
              return (
                <button
                  key={doc.type}
                  type="button"
                  onClick={() => {
                    setSelectedDocTypePreview(doc.type);
                    setSelectedDocPageIdx(0);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0066FF] bg-blue-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-[#0B1B3D] text-[#00E599] font-mono font-black text-[10px]">
                      {doc.number}
                    </span>
                    <h4 className="font-black text-xs text-[#0B1B3D] mt-2 leading-snug">{doc.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-semibold">{doc.law}</p>
                </button>
              );
            })}
          </div>

          {/* Interactive 4-Page Document Reader & PDF Exporter */}
          {renderedPreviewDoc && currentApp && (
            <div className="rounded-3xl border-2 border-slate-300 overflow-hidden bg-slate-100">
              <div className="bg-[#0B1B3D] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#00E599] text-[#0B1B3D] font-black text-[10px] uppercase">
                      {renderedPreviewDoc.pages.length} Páginas Oficiales A4
                    </span>
                    <h4 className="font-black text-sm sm:text-base">{renderedPreviewDoc.title}</h4>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">{renderedPreviewDoc.subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openDocumentModal(currentApp, selectedDocTypePreview)}
                    className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Abrir en Pantalla Completa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportDocumentToPdf(renderedPreviewDoc)}
                    className="px-4 py-2 rounded-xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Descargar / Imprimir PDF (4 Páginas)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSendWhatsAppWithPdfDownload(
                        directUrlsCatalog[3].whatsappMessage,
                        selectedDocTypePreview,
                        renderedPreviewDoc.title
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B1B3D] font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Bajar PDF + Enviar WhatsApp al Cliente</span>
                  </button>
                </div>
              </div>

              {/* Page Selector Tabs (Page 1, Page 2, Page 3, Page 4) */}
              <div className="bg-slate-200 px-6 py-3 border-b border-slate-300 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {renderedPreviewDoc.pages.map((pageObj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDocPageIdx(idx)}
                      className={`px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer transition ${
                        selectedDocPageIdx === idx
                          ? 'bg-[#0066FF] text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      📄 Página {idx + 1}: {pageObj.pageTitle}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-bold text-slate-600">
                  Sello Criptográfico eIDAS • Expediente #{currentApp.id}
                </span>
              </div>

              {/* A4 Page Content Preview */}
              <div className="p-6 sm:p-10 flex justify-center">
                <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg border border-slate-300 p-8 sm:p-12 space-y-4">
                  <div className="border-b-2 border-[#0B1B3D] pb-4 flex items-center justify-between">
                    <div>
                      <div className="font-black text-lg text-[#0B1B3D]">
                        INSTACREDIT ESPAÑA FINTECH S.L. • NIF B-87942105
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        {renderedPreviewDoc.pages[selectedDocPageIdx]?.pageTitle || renderedPreviewDoc.title}
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs font-bold text-[#0066FF]">
                      PÁGINA {selectedDocPageIdx + 1} DE {renderedPreviewDoc.pages.length}
                    </div>
                  </div>

                  <div
                    className="text-xs sm:text-sm font-serif text-slate-800 leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{
                      __html: renderedPreviewDoc.pages[selectedDocPageIdx]?.contentHtml || ''
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SECTION 10: TODOS LOS PAQUETES IMAGEN + MENSAJE WHATSAPP (CATÁLOGO COMPLETO)
         ===================================================================== */}
      {activeSection === 'todos_paquetes_whatsapp' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full">
              CATÁLOGO COMPLETO DE PAQUETES IMAGEN + MENSAJE ({WHATSAPP_KITS.length} KITS)
            </span>
            <h3 className="text-xl font-black text-[#0B1B3D] mt-2">
              Todas las Plantillas Exactas con Imagen Oficial Emparejada Listas para Enviar en 1 Clic
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHATSAPP_KITS.map((kit) => {
              const messageText = kit.getTemplate(clientData as KitTemplateParams);
              return (
                <div
                  key={kit.id}
                  className="rounded-3xl border-2 border-slate-200 hover:border-[#0066FF] transition overflow-hidden flex flex-col justify-between bg-white shadow-xs"
                >
                  <div>
                    <div className="relative h-44 bg-slate-900">
                      <img src={kit.image.src} alt={kit.image.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${kit.badgeColor}`}>
                          {kit.categoryIcon} {kit.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3">
                        <p className="text-white text-xs font-bold">{kit.image.title}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <h4 className="font-black text-sm text-[#0B1B3D]">{kit.title}</h4>
                      <p className="text-[11px] text-slate-600">{kit.shortScenario}</p>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-40 overflow-y-auto text-[11px] font-mono text-slate-700 whitespace-pre-wrap">
                        {messageText}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendCompleteKit(kit)}
                      className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Kit (1 Clic)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyText(kit.id, messageText, kit.title)}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
