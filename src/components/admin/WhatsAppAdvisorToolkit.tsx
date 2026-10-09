import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditApplication } from '../../types';
import { formatEUR } from '../../utils/financialCalculations';
import {
  WHATSAPP_KITS,
  CATEGORY_DEFINITIONS,
  KitCategory,
  WhatsAppKitItem,
  KitTemplateParams
} from '../../data/whatsappKitsData';
import { dispatchKitInOneAction } from '../../utils/kitDispatcher';
import {
  MessageCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  Clock,
  FileText,
  Smartphone,
  User,
  ShieldCheck,
  Search,
  Download,
  Image as ImageIcon,
  Zap,
  Eye,
  Info,
  CheckCircle2,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Bot,
  Layers,
  ArrowRight,
  CheckCircle,
  Share2
} from 'lucide-react';

interface WhatsAppAdvisorToolkitProps {
  onOpenDidacticForm?: (app?: CreditApplication) => void;
}

export const WhatsAppAdvisorToolkit: React.FC<WhatsAppAdvisorToolkitProps> = ({ onOpenDidacticForm }) => {
  const { applications, currentAdvisor, logAdvisorAction, openDocumentModal } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<KitCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKitId, setCopiedKitId] = useState<string | null>(null);
  const [dispatchingKitId, setDispatchingKitId] = useState<string | null>(null);
  const [dispatchSuccessKitId, setDispatchSuccessKitId] = useState<string | null>(null);
  const [dispatchToast, setDispatchToast] = useState<{ title: string; message: string } | null>(null);

  // Custom client override state
  const [customPhone, setCustomPhone] = useState('');
  const [customName, setCustomName] = useState('');

  // Modals
  const [previewKit, setPreviewKit] = useState<WhatsAppKitItem | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  // Autonomous Custom Generator State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorObjective, setGeneratorObjective] = useState<'bienvenida' | 'documentos' | 'garantia' | 'aprobado' | 'desembolso' | 'prorroga' | 'vip'>('bienvenida');
  const [generatorTone, setGeneratorTone] = useState<'institucional' | 'cercano' | 'directo' | 'accesible'>('institucional');

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const clientName = currentApp
    ? `${currentApp.personalData.firstName} ${currentApp.personalData.lastName}`
    : (customName || 'Estimado(a) Cliente');
  const clientFirstName = clientName.split(' ')[0];
  const clientPhone = currentApp ? currentApp.personalData.phone : (customPhone || '600000000');
  const capitalAmount = currentApp
    ? formatEUR(currentApp.approvedAmount || currentApp.loanDetails.capital)
    : '5.000,00 €';
  const radicadoId = currentApp ? currentApp.id : 'INSTA-ES-902143';
  const digitalIban = currentApp
    ? currentApp.digitalAccount.accountNumber
    : 'ES91 2100 0418 4502 0005 1234';
  const dueDate = currentApp ? currentApp.loanDetails.dueDate : '30 de octubre de 2026';
  const advisorName = currentAdvisor.name;
  const advisorPhone = currentAdvisor.phone || '612345678';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://instacredit.es';

  // Helper parameters passed to all template generators
  const templateParams: KitTemplateParams = useMemo(
    () => ({
      clientName,
      clientFirstName,
      clientPhone,
      capitalAmount,
      radicadoId,
      digitalIban,
      dueDate,
      advisorName,
      advisorPhone,
      baseUrl,
      bankName: currentApp?.bankDetails?.bankName,
      purpose: currentApp?.economicData?.loanPurpose
    }),
    [
      clientName,
      clientFirstName,
      clientPhone,
      capitalAmount,
      radicadoId,
      digitalIban,
      dueDate,
      advisorName,
      advisorPhone,
      baseUrl,
      currentApp
    ]
  );

  // Autonomous Engine: Auto-match the single best kit based on client state
  const recommendedKit = useMemo(() => {
    if (!currentApp) return WHATSAPP_KITS[0];
    switch (currentApp.status) {
      case 'Pendiente':
        return WHATSAPP_KITS.find((k) => k.id === 'kit-bienvenida-oficial') || WHATSAPP_KITS[0];
      case 'En Revisión':
        return WHATSAPP_KITS.find((k) => k.id === 'kit-garantia-30-minutos') || WHATSAPP_KITS[4];
      case 'Aprobado':
        return WHATSAPP_KITS.find((k) => k.id === 'kit-aprobacion-enhorabuena') || WHATSAPP_KITS[8];
      case 'Desembolsado':
        return WHATSAPP_KITS.find((k) => k.id === 'kit-desembolso-fondos-iban') || WHATSAPP_KITS[11];
      default:
        return WHATSAPP_KITS[0];
    }
  }, [currentApp]);

  // Filtered kits based on category and search query
  const filteredKits = useMemo(() => {
    return WHATSAPP_KITS.filter((kit) => {
      const matchesCategory = selectedCategory === 'todos' || kit.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        kit.title.toLowerCase().includes(q) ||
        kit.shortScenario.toLowerCase().includes(q) ||
        kit.tags.some((t) => t.toLowerCase().includes(q)) ||
        kit.keyPillar.toLowerCase().includes(q) ||
        kit.image.title.toLowerCase().includes(q) ||
        kit.getTemplate(templateParams).toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, templateParams]);

  // Unified 1-Action Dispatch Handler
  const handleDispatchKit = async (kit: WhatsAppKitItem) => {
    const text = kit.getTemplate(templateParams);
    setDispatchingKitId(kit.id);

    try {
      const result = await dispatchKitInOneAction({
        imageSrc: kit.image.src,
        imageTitle: kit.image.title,
        messageText: text,
        clientPhone,
        clientName,
        kitId: kit.id
      });

      setDispatchingKitId(null);

      if (result.success) {
        setDispatchSuccessKitId(kit.id);
        setTimeout(() => setDispatchSuccessKitId(null), 3000);

        setDispatchToast({
          title: '¡Kit Despachado en 1 Sola Acción!',
          message: `Imagen oficial adjuntada y mensaje con variables de ${clientFirstName} listos para WhatsApp.`
        });
        setTimeout(() => setDispatchToast(null), 4500);

        if (currentApp) {
          logAdvisorAction(currentApp.id, {
            advisorId: currentAdvisor.id,
            advisorName: currentAdvisor.name,
            actionType: 'whatsapp',
            summary: `Kit despachado en 1 acción: "${kit.title}" con imagen oficial "${kit.image.title}" para ${clientName}.`,
            clientNotes: text.substring(0, 120) + '...'
          });
        }
      }
    } catch (err) {
      console.error('Error al despachar kit:', err);
      setDispatchingKitId(null);
    }
  };

  // Copy text only handler
  const handleCopyTextOnly = (kitId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKitId(kitId);
    setTimeout(() => setCopiedKitId(null), 2500);

    if (currentApp) {
      logAdvisorAction(currentApp.id, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'whatsapp',
        summary: `Texto del kit copiado para ${clientName}.`,
        clientNotes: text.substring(0, 80) + '...'
      });
    }
  };

  // Autonomous bespoke kit generator
  const generatedBespokeKit = useMemo(() => {
    let baseImage = '/src/assets/images/ws_bienvenida_1790860195015.jpg';
    let imageTitle = 'Tarjeta Institucional de Asesor';
    let imageSubtitle = 'Respaldo de 12 años y garantía de respuesta en 30 minutos.';
    let messageBody = '';

    if (generatorObjective === 'bienvenida') {
      baseImage = '/src/assets/images/ws_bienvenida_1790860195015.jpg';
      imageTitle = 'Tarjeta de Bienvenida y Asesor Personal';
      imageSubtitle = 'Compromiso de atención 1 a 1 y resolución en 30 minutos.';
      messageBody = `¡Hola, *${clientFirstName}*! 👋 Te saluda *${advisorName}* de *INSTACREDIT España*.

He recibido tu solicitud por *${capitalAmount}* (Expediente *#${radicadoId}*). Con más de 12 años facilitando crédito responsable, nos comprometemos a darte respuesta en un *máximo de 30 minutos*.

¿Tienes alguna consulta inicial sobre plazos o cuotas? Estoy a tu disposición por este canal.`;
    } else if (generatorObjective === 'documentos') {
      baseImage = '/src/assets/images/ws_docs_guia_1790860205561.jpg';
      imageTitle = 'Guía Didáctica de Documentos Requeridos';
      imageSubtitle = 'Checklist paso a paso para DNI/NIE, nómina/IRPF y titularidad IBAN.';
      messageBody = `Estimado(a) *${clientName}*, te escribe *${advisorName}*. 📄🔍

Para formalizar la entrega de tus *${capitalAmount}*, requerimos únicamente 3 fotos nítidas:
1. DNI o NIE/TIE por ambas caras.
2. Última nómina mensual o justificante de ingresos.
3. Justificante de tu cuenta bancaria con IBAN español.

Respóndeme con las fotos por este chat y en *menos de 30 minutos* emitimos tu resolución.`;
    } else if (generatorObjective === 'garantia') {
      baseImage = '/src/assets/images/ws_seguridad_antifraude_1790894760624.jpg';
      imageTitle = 'Certificado de Seguridad y Cero Cobros Previos';
      imageSubtitle = 'Sello oficial de transparencia: jamás cobramos anticipos ni fianzas por adelantado.';
      messageBody = `Estimado(a) *${clientName}*, queremos recordarte que en *INSTACREDIT España* aplicamos una estricta política de *CERO COBROS O ANTICIPOS PREVIOS*. 🛡️🔒

Jamás te pediremos consignaciones para liberar tus fondos. Tu operación de *${capitalAmount}* está garantizada bajo la Ley 16/2011 y supervisión de conducta del Banco de España.`;
    } else if (generatorObjective === 'aprobado') {
      baseImage = '/src/assets/images/ws_cierre_aprob_1790860226017.jpg';
      imageTitle = 'Certificado Oficial de Crédito Concedido';
      imageSubtitle = 'Resolución favorable y firma electrónica eIDAS mediante código SMS OTP.';
      messageBody = `🎉 *¡ENHORABUENA, ${clientFirstName.toUpperCase()}! CRÉDITO APROBADO* 🎉

Tu préstamo por *${capitalAmount}* ha sido *APROBADO*. Para firmar tu pagaré en 2 minutos con código SMS OTP y recibir el dinero en tu Cuenta Digital:
👉 ${baseUrl}

¡Quedo atento por aquí para ayudarte a firmar!`;
    } else if (generatorObjective === 'desembolso') {
      baseImage = '/src/assets/images/ws_desembolso_bizum_1790894749766.jpg';
      imageTitle = 'Comprobante de Fondos Acreditados y Retiro Bizum';
      imageSubtitle = 'Dinero cargado en Cuenta Digital IBAN y retirable en 15 segundos por Bizum o SEPA.';
      messageBody = `💸 *FONDOS DESEMBOLSADOS CON ÉXITO* 💸

Hola, *${clientName}*. Tus *${capitalAmount}* ya están disponibles en tu Cuenta Digital:
🏛️ *IBAN:* \`${digitalIban}\`

Puedes transferirlo a tu banco o retirarlo por *Bizum en 15 segundos*: ${baseUrl}
¡Gracias por confiar en nosotros!`;
    } else if (generatorObjective === 'prorroga') {
      baseImage = '/src/assets/images/ws_prorroga_fidelidad_1790894773902.jpg';
      imageTitle = 'Certificado de Extensión de Plazo sin Penalizaciones';
      imageSubtitle = 'Aplazamiento de 15 o 30 días para proteger tu historial crediticio.';
      messageBody = `Hola, *${clientFirstName}*. Para tu tranquilidad, en *INSTACREDIT* dispones de la opción de *Extensión de Plazo por 15 o 30 días*.

Al abonar únicamente la fianza del período, aplazas el capital sin recargos ni reportes a ASNEF: ${baseUrl}
¡Estamos para ayudarte!`;
    } else {
      baseImage = '/src/assets/images/ws_prorroga_fidelidad_1790894773902.jpg';
      imageTitle = 'Insignia de Cliente Preferencial VIP y Cupo Ampliado';
      imageSubtitle = 'Reconocimiento a la puntualidad con aumento de cupo hasta 5.000 € y descuento en fianza.';
      messageBody = `🌟 *¡FELICIDADES, ${clientFirstName.toUpperCase()}! CUPO VIP DESBLOQUEADO* 🌟

Por tu cumplimiento puntual, has desbloqueado un cupo pre-aprobado de hasta *5.000,00 €* con aprobación exprés en 5 minutos y descuento del 10% en fianza: ${baseUrl}`;
    }

    return {
      title: `Kit Autónomo a Medida: ${generatorObjective.toUpperCase()}`,
      imageSrc: baseImage,
      imageTitle,
      imageSubtitle,
      text: messageBody
    };
  }, [generatorObjective, clientFirstName, clientName, advisorName, capitalAmount, radicadoId, digitalIban, baseUrl]);

  return (
    <div className="space-y-6">
      {/* Toast Notification for 1-Action Dispatch */}
      {dispatchToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1B3D] text-white border-2 border-[#00E599] rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-in slide-in-from-top max-w-md">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-[#00E599] flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm text-white">{dispatchToast.title}</h4>
            <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">{dispatchToast.message}</p>
          </div>
        </div>
      )}

      {/* HEADER COMMAND CENTER BANNER */}
      <div className="bg-gradient-to-r from-[#0B1B3D] via-[#0E2452] to-[#0055FF] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-blue-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <MessageCircle className="w-3.5 h-3.5" />
                Despacho Autónomo en 1 Acción • WhatsApp Business
              </span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Garantía Estricta: Respuesta ≤ 30 Minutos
              </span>
              <span className="bg-blue-400/20 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Asesor Activo: {advisorName}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
              Kits de Contenido Diverso con Imagen Adjunta en 1 Acción
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Cada plantilla está <strong>permanentemente unida a su imagen oficial y de alta resolución</strong>. Con un solo clic o toque, el sistema despacha conjuntamente la imagen y el mensaje sincronizado a WhatsApp, garantizando total coherencia narrativa, respaldo institucional de 12 años y cero cobros anticipados.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsGeneratorOpen(!isGeneratorOpen)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isGeneratorOpen ? 'Cerrar Generador' : 'Generador Autónomo a Medida'}</span>
            </button>

            {onOpenDidacticForm && (
              <button
                type="button"
                onClick={() => onOpenDidacticForm(currentApp)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Formularios Asistidos (Voz)</span>
              </button>
            )}

            {currentApp && (
              <button
                type="button"
                onClick={() => openDocumentModal(currentApp)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-cyan-300" />
                <span>Ver Contratos Oficiales (4 Págs)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AUTONOMOUS CUSTOM KIT GENERATOR ACCORDION */}
      {isGeneratorOpen && (
        <div className="bg-gradient-to-b from-amber-50/70 to-white rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Generador Autónomo de Kits a Medida en 1 Acción
                </h3>
                <p className="text-xs text-slate-600">
                  El motor sintetiza el mensaje y vincula la imagen oficial idónea para enviar en un solo clic:
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-200 text-amber-900">
              Modo Inteligente
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Objetivo del Mensaje:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'bienvenida', label: '👋 Bienvenida 30m' },
                  { id: 'documentos', label: '📄 Solicitar Docs' },
                  { id: 'garantia', label: '🛡️ Cero Anticipos' },
                  { id: 'aprobado', label: '🎉 Aprobado OTP' },
                  { id: 'desembolso', label: '💸 Retiro Bizum' },
                  { id: 'prorroga', label: '⏱️ Prórroga 15/30d' },
                  { id: 'vip', label: '⭐ Cupo VIP 5.000€' }
                ].map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setGeneratorObjective(obj.id as any)}
                    className={`p-2 rounded-xl text-xs font-bold text-left transition border cursor-pointer ${
                      generatorObjective === obj.id
                        ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {obj.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tono Comunicativo:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'institucional', label: '🏛️ Institucional Solvente' },
                  { id: 'cercano', label: '😊 Empático y Cercano' },
                  { id: 'directo', label: '⚡ Ultra Ágil y Directo' },
                  { id: 'accesible', label: '🎙️ Didáctico Asistido' }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setGeneratorTone(tone.id as any)}
                    className={`p-2 rounded-xl text-xs font-bold text-left transition border cursor-pointer ${
                      generatorTone === tone.id
                        ? 'bg-[#0B1B3D] text-white border-[#0B1B3D]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bespoke Generated Kit Preview */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-200">
              <img
                src={generatedBespokeKit.imageSrc}
                alt={generatedBespokeKit.imageTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 right-1 bg-black/70 text-[9px] text-white text-center py-0.5 rounded font-bold">
                Imagen Vinculada
              </span>
            </div>

            <div className="flex-1 space-y-1.5 text-left w-full">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Kit Unido Listo
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {generatedBespokeKit.imageTitle}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 whitespace-pre-line max-h-28 overflow-y-auto">
                {generatedBespokeKit.text}
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDispatchKit({
                    id: `bespoke-${generatorObjective}`,
                    category: 'bienvenida',
                    categoryName: 'A Medida',
                    categoryIcon: '✨',
                    title: generatedBespokeKit.title,
                    shortScenario: 'Kit generado autónomamente',
                    badge: 'A Medida',
                    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
                    targetClientState: 'Cualquiera',
                    image: {
                      src: generatedBespokeKit.imageSrc,
                      title: generatedBespokeKit.imageTitle,
                      subtitle: generatedBespokeKit.imageSubtitle,
                      themeBadge: 'Generado Autónomo',
                      relationReason: 'Kit autónomo generado en caliente para la necesidad actual.'
                    },
                    getTemplate: () => generatedBespokeKit.text,
                    keyPillar: 'Personalización inmediata.',
                    tags: ['Generado', generatorObjective]
                  })
                }
                disabled={dispatchingKitId === `bespoke-${generatorObjective}`}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {dispatchingKitId === `bespoke-${generatorObjective}` ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-emerald-200" />
                )}
                <span>Enviar Kit a Medida en 1 Clic</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTONOMOUS RECOMMENDATION BANNER (AUTO-MATCHING PER CURRENT CLIENT) */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0B1B3D] to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-blue-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#00E599] text-[#0B1B3D] flex items-center justify-center font-black text-xs">
                <Bot className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00E599]">
                Motor Autónomo de Recomendación y Despacho
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-blue-200">
                Estado: {currentApp?.status || 'Pendiente'}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white">
              Kit Recomendado para {clientFirstName}: {recommendedKit.title}
            </h3>

            <p className="text-xs text-blue-200 leading-relaxed">
              💡 <strong>Coherencia de la Unión:</strong> {recommendedKit.image.relationReason}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-blue-400/40 shadow-xs shrink-0 hidden sm:block">
              <img
                src={recommendedKit.image.src}
                alt={recommendedKit.image.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => handleDispatchKit(recommendedKit)}
              disabled={dispatchingKitId === recommendedKit.id}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#00E599] to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-[#0B1B3D] font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {dispatchingKitId === recommendedKit.id ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : dispatchSuccessKitId === recommendedKit.id ? (
                <Check className="w-4 h-4 text-emerald-950" />
              ) : (
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              )}
              <span>
                {dispatchSuccessKitId === recommendedKit.id
                  ? '¡Despachado con Éxito!'
                  : 'Despachar Ahora en 1 Clic (Imagen + Mensaje)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CLIENT SELECTOR & REAL-TIME SEARCH BAR */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Cliente en Cartera:</span>
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold text-[#0B1B3D] focus:ring-2 focus:ring-[#0066FF]"
            >
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} - {a.personalData.firstName} {a.personalData.lastName} ({formatEUR(a.approvedAmount || a.loanDetails.capital)}) - [{a.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Móvil WhatsApp Destino:</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">+34</span>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="600000000"
                className="w-full pl-11 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Importe en Gestión:</label>
            <div className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-black text-emerald-700">
              {capitalAmount}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Búsqueda Inteligente de Kits:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Bizum, DNI, 30m, NIE, Aprobado..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7 CATEGORY TABS WITH RICH METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('todos')}
          className={`p-3 rounded-2xl text-left transition flex flex-col justify-between cursor-pointer border ${
            selectedCategory === 'todos'
              ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-md ring-2 ring-[#0066FF]/40'
              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          <span className="text-xl mb-1">📚</span>
          <div>
            <h4 className="font-black text-xs leading-tight">Todos los Kits</h4>
            <span className={`text-[10px] font-bold ${selectedCategory === 'todos' ? 'text-[#00E599]' : 'text-slate-400'}`}>
              {WHATSAPP_KITS.length} kits
            </span>
          </div>
        </button>

        {(Object.keys(CATEGORY_DEFINITIONS) as KitCategory[]).map((catKey) => {
          const cat = CATEGORY_DEFINITIONS[catKey];
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setSelectedCategory(catKey)}
              className={`p-3 rounded-2xl text-left transition flex flex-col justify-between cursor-pointer border ${
                isSelected
                  ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-md ring-2 ring-[#0066FF]/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">{cat.icon}</span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-[#00E599] text-[#0B1B3D]' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </div>
              <div>
                <h4 className="font-black text-xs leading-tight line-clamp-1">{cat.name.split('. ')[1] || cat.name}</h4>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                  {cat.count} unidos
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE CATEGORY / SEARCH SUMMARY BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-sm uppercase tracking-wide text-slate-700 flex items-center gap-2">
            <span>
              {selectedCategory === 'todos'
                ? 'Catálogo Completo de Contenido Diverso (24 Kits)'
                : CATEGORY_DEFINITIONS[selectedCategory]?.name}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              ({filteredKits.length} plantillas con imagen adjunta obligatoria)
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Receptor activo:</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-bold">
            {clientFirstName} • +34 {clientPhone}
          </span>
        </div>
      </div>

      {/* KITS GRID: EVERY KIT HAS ITS PERMANENT ATTACHED IMAGE AND 1-ACTION DISPATCH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKits.map((kit) => {
          const renderedMessage = kit.getTemplate(templateParams);
          const isDispatching = dispatchingKitId === kit.id;
          const isSuccess = dispatchSuccessKitId === kit.id;

          return (
            <div
              key={kit.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* TOP IMAGE CARD (ATTACHED IMAGE PREVIEW) */}
              <div className="relative bg-slate-900 border-b border-slate-200 overflow-hidden">
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={kit.image.src}
                    alt={kit.image.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-[#00E599] text-[#0B1B3D] text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      Imagen Oficial Adjunta (1 Acción)
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewKit(kit)}
                      className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition cursor-pointer"
                      title="Ampliar Imagen y Contenido"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Subtitle on Image */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white space-y-0.5">
                    <span className="text-[10px] font-bold text-[#00E599] uppercase tracking-wide">
                      {kit.image.themeBadge}
                    </span>
                    <h5 className="font-black text-xs sm:text-sm line-clamp-1 drop-shadow-md">
                      {kit.image.title}
                    </h5>
                  </div>
                </div>

                {/* Relation Reason Card (Explains why text and image are connected) */}
                <div className="bg-slate-50 px-3.5 py-2 border-t border-slate-200 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 leading-tight">
                    <strong className="text-slate-800">Unión Estratégica:</strong> {kit.image.relationReason}
                  </p>
                </div>
              </div>

              {/* CARD BODY WITH SCRIPT TITLE & WHATSAPP CHAT BUBBLE */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-black text-sm text-[#0B1B3D] leading-snug">
                      {kit.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 border ${kit.badgeColor}`}>
                      {kit.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    {kit.shortScenario}
                  </p>

                  {/* WhatsApp Chat Preview Bubble - INTEGRAL UNIFIED MESSAGE (IMAGE + CAPTION IN ONE SINGLE BUBBLE) */}
                  <div className="p-3 bg-[#0B141A] rounded-2xl relative shadow-inner mt-2 border border-slate-700">
                    <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tr-xs overflow-hidden shadow-md border border-[#005C4B]/40">
                      {/* Embedded Image Header inside the bubble */}
                      <div className="relative w-full overflow-hidden bg-slate-950">
                        <img
                          src={kit.image.src}
                          alt={kit.image.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-36 object-cover"
                        />
                        {/* Institutional White Banner Ribbon */}
                        <div className="bg-white text-slate-900 px-3 py-1.5 text-center border-b border-slate-200">
                          <div className="font-black text-[11px] text-[#0B1B3D] tracking-tight">
                            {kit.image.title}
                          </div>
                          <div className="text-[9px] font-semibold text-slate-500">
                            {kit.image.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Text Body flowing directly underneath inside the same bubble */}
                      <div className="p-3 space-y-1.5">
                        <div className="text-xs font-sans whitespace-pre-line leading-relaxed text-[#E9EDEF]">
                          {renderedMessage}
                        </div>

                        <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696A0] font-mono pt-1">
                          <span>6:04 p. m.</span>
                          <span className="text-[#53BDEB] font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Pillar Notice */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{kit.keyPillar}</span>
                  </div>
                </div>

                {/* PRIMARY ACTION BUTTONS (DISPATCH IN 1 ACTION) */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleDispatchKit(kit)}
                    disabled={isDispatching}
                    className={`w-full py-3.5 px-4 rounded-xl font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] ${
                      isSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-[#0066FF] via-[#0052CC] to-[#0B1B3D] hover:from-blue-600 hover:to-blue-900 text-white'
                    }`}
                  >
                    {isDispatching ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isSuccess ? (
                      <CheckCircle className="w-4 h-4 text-[#00E599]" />
                    ) : (
                      <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                    )}
                    <span>
                      {isDispatching
                        ? 'Preparando y enviando kit...'
                        : isSuccess
                        ? '¡Kit Despachado en 1 Acción!'
                        : '⚡ Enviar Kit Completo (Imagen + Mensaje en 1 Acción)'}
                    </span>
                  </button>

                  {/* Secondary Auxiliary Controls */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyTextOnly(kit.id, renderedMessage)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      {copiedKitId === kit.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedKitId === kit.id ? '¡Copiado!' : 'Copiar Texto'}</span>
                    </button>

                    <a
                      href={kit.image.src}
                      download={`instacredit_${kit.id}.jpg`}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar Imagen</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setPreviewKit(kit)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                      title="Vista Previa"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL KIT PREVIEW MODAL */}
      {previewKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-300 relative">
            <div className="bg-[#0B1B3D] text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#00E599] fill-[#00E599]" />
                <div>
                  <h4 className="font-black text-sm sm:text-base">
                    Vista Previa del Kit Completo (Imagen + Mensaje Unidos)
                  </h4>
                  <p className="text-xs text-blue-200">
                    Así lo verá y recibirá el cliente en una sola acción coordinada
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewKit(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* WhatsApp Smartphone Frame with Unified Bubble (Screenshot 1 Match) */}
              <div className="max-w-md mx-auto bg-[#0B141A] rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Mobile Top Status Bar */}
                <div className="bg-[#1F2C34] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">←</span>
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-600">
                      <img src="/src/assets/images/ws_bienvenida_1790860195015.jpg" alt="Instacredit" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">INSTACREDIT España (Verificado)</div>
                      <div className="text-[10px] text-emerald-400 font-medium">Asesor {advisorName} • En línea</div>
                    </div>
                  </div>
                  <span className="text-white text-xs">⋮</span>
                </div>

                {/* Chat Background with the Unified Single Bubble */}
                <div className="p-4 bg-[#0B141A] space-y-3 min-h-[420px] flex flex-col justify-end">
                  <div className="flex justify-end">
                    <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tr-xs overflow-hidden max-w-sm shadow-xl border border-[#005C4B]/40">
                      {/* Integrated Image Header inside the bubble */}
                      <div className="relative w-full bg-slate-950 overflow-hidden">
                        <img
                          src={previewKit.image.src}
                          alt={previewKit.image.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-48 object-cover"
                        />
                        {/* Institutional White Banner Ribbon */}
                        <div className="bg-white text-slate-900 px-3 py-2 text-center border-b border-slate-200">
                          <div className="font-black text-xs text-[#0B1B3D] tracking-tight">
                            {previewKit.image.title}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                            {previewKit.image.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Text Caption flowing directly beneath inside the same bubble */}
                      <div className="p-3.5 space-y-2">
                        <div className="text-xs font-sans whitespace-pre-line leading-relaxed text-[#E9EDEF]">
                          {previewKit.getTemplate(templateParams)}
                        </div>

                        <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696A0] font-mono pt-1">
                          <span>6:04 p. m.</span>
                          <span className="text-[#53BDEB] font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Bottom Input Bar */}
                <div className="bg-[#1F2C34] p-3 flex items-center justify-between border-t border-slate-700/50 text-slate-400 text-xs">
                  <span>Mensaje para {clientFirstName}...</span>
                  <div className="w-8 h-8 rounded-full bg-[#00A884] flex items-center justify-center text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Strategic Explanation Card */}
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-1 max-w-md mx-auto">
                <p className="font-bold flex items-center gap-1.5 text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Unión Estratégica en 1 Sola Acción:</span>
                </p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  {previewKit.image.relationReason}
                </p>
              </div>

              {/* Action Toolbar in Modal */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  Destinatario: <strong>{clientName}</strong> (+34 {clientPhone}) • Importe: <strong>{capitalAmount}</strong>
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={previewKit.image.src}
                    download={`instacredit_${previewKit.id}.jpg`}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Imagen</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      handleDispatchKit(previewKit);
                      setPreviewKit(null);
                    }}
                    className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white text-white" />
                    <span>Despachar Kit en 1 Acción</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
