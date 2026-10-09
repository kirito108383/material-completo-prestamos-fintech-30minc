import React, { useState } from 'react';
import { FacebookAdCampaign } from '../../types';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Share2,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Download,
  Image,
  Layers,
  Euro,
  Eye,
  CheckCircle2,
  Calendar,
  Smartphone,
  Award,
  Heart,
  BookOpen,
  Info
} from 'lucide-react';

export interface LifestyleAdCreative {
  id: string;
  imageSrc: string;
  themeTitle: string;
  targetConcept: string;
  recommendedCampaignId: string;
  aspectRatio: string;
}

export const LIFESTYLE_CREATIVES: LifestyleAdCreative[] = [
  {
    id: 'life-1',
    imageSrc: '/src/assets/images/fb_lifestyle_family_1790893967984.jpg',
    themeTitle: 'Hogar, Familia y Reformas',
    targetConcept: 'Familia disfrutando de su vivienda reformada con tranquilidad financiera.',
    recommendedCampaignId: 'fb-camp-3',
    aspectRatio: '1:1 (Feed Cuadrado)'
  },
  {
    id: 'life-2',
    imageSrc: '/src/assets/images/fb_lifestyle_entrepreneur_1790893984324.jpg',
    themeTitle: 'Autónomos, Pymes y Emprendimiento',
    targetConcept: 'Profesional independiente gestionando su negocio y circulante con éxito.',
    recommendedCampaignId: 'fb-camp-2',
    aspectRatio: '1:1 (Feed Cuadrado)'
  },
  {
    id: 'life-3',
    imageSrc: '/src/assets/images/fb_lifestyle_personal_1790893993475.jpg',
    themeTitle: 'Proyectos Personales y Tranquilidad',
    targetConcept: 'Persona joven con confirmación de crédito concedido y libertad financiera.',
    recommendedCampaignId: 'fb-camp-1',
    aspectRatio: '1:1 (Feed Cuadrado)'
  }
];

export const FACEBOOK_CAMPAIGNS: (FacebookAdCampaign & { lifestyleImage: string })[] = [
  {
    id: 'fb-camp-1',
    title: 'Préstamos Personales de 2.000 € a 100.000 € Sin Burocracia',
    category: 'Personal',
    targetAudience: 'Residentes en España de 21 a 65 años que buscan liquidez inmediata sin papeleos abusivos ni avales hipotecarios.',
    headline: 'Préstamos de 2.000 € a 100.000 € 100% Online en España | Respuesta Inmediata',
    lifestyleImage: '/src/assets/images/fb_lifestyle_personal_1790893993475.jpg',
    primaryText: `¿Necesitas liquidez hoy mismo para tus proyectos, imprevistos o compras importantes? 🇪🇸💶

En INSTACREDIT España te ofrecemos préstamos personales de 2.000 € a 100.000 € con las mejores condiciones del mercado:

✅ Sin avalistas ni hipotecas.
✅ Cuenta Digital propia con abono inmediato por Bizum o SEPA Instant.
✅ Tipo de interés transparente desde 6,95% TIN (7,82% TAE).
✅ Plazos a tu medida: de 3 a 72 meses con cuotas cómodas.
✅ Supervisado por el Banco de España y formalización con firma eIDAS.
🏛️ Más de 12 años de sólida trayectoria en España y 150.000 clientes satisfechos.

👉 Solicita tu estudio en 2 minutos sin compromiso desde tu móvil. ¡Garantía de respuesta en menos de 30 minutos!`,
    description: 'Estudio gratuito 100% digital. Fondos disponibles en tu Cuenta Digital.',
    callToAction: 'Solicitar Información',
    theme: 'blue',
    badgeText: 'RESPUESTA EN 30 MINUTOS',
    amountHighlight: '2.000 € a 100.000 €',
    bullets: ['Aprobación 100% Online', 'Más de 12 años de trayectoria en España', 'Abono instantáneo Bizum / SEPA'],
    complianceDisclaimer: 'Ejemplo representativo: Para un préstamo de 10.000 € a 24 meses: TIN 6,95%, TAE 7,82%. Cuota mensual: 447,48 €. Importe total adeudado: 10.739,52 €. Sujeto a evaluación de solvencia según Ley 16/2011 y Circular 4/2020 del Banco de España.'
  },
  {
    id: 'fb-camp-2',
    title: 'Liquidez Rápida para Autónomos y Pymes en España',
    category: 'Autónomos',
    targetAudience: 'Trabajadores autónomos, profesionales colegiados y pequeños negocios con actividad en España.',
    headline: 'Financiación Express para Autónomos y Pequeños Negocios (Hasta 100.000 €)',
    lifestyleImage: '/src/assets/images/fb_lifestyle_entrepreneur_1790893984324.jpg',
    primaryText: `¿Eres autónomo en España y tu banco tradicional te pide meses de papeleo? 💼⚡

En INSTACREDIT apoyamos el tejido productivo con créditos rápidos de 2.000 € hasta 100.000 € para:

🔹 Compra de stock, maquinaria o herramientas de trabajo.
🔹 Pago de impuestos, nóminas o circulante para tu negocio.
🔹 Reformas de locales comerciales y vehículos profesionales.

🚀 Tramitación 100% online con tu DNI/NIE y último modelo fiscal.
🛡️ Más de 12 años de trayectoria, respaldo sólido y respuesta garantizada en menos de 30 minutos.`,
    description: 'Crédito empresarial rápido sin desplazamientos ni burocracia.',
    callToAction: 'Enviar Mensaje de WhatsApp',
    theme: 'emerald',
    badgeText: 'ESPECIAL AUTÓNOMOS Y PYMES',
    amountHighlight: 'Hasta 100.000 €',
    bullets: ['Solo DNI/NIE y modelo IRPF', 'Desembolso en 24h laborables', 'Más de 150.000 clientes satisfechos'],
    complianceDisclaimer: 'Financiación mercantil para actividades económicas. Condiciones supervisadas conforme a la Ley 16/2011 de Contratos de Crédito y Banco de España.'
  },
  {
    id: 'fb-camp-3',
    title: 'Reforma del Hogar o Renovación Familiar',
    category: 'Reformas',
    targetAudience: 'Familias y propietarios que desean reformar su vivienda o renovar su equipamiento.',
    headline: 'Financia la Reforma de tu Hogar desde 2.000 € a 100.000 € en Cuotas Cómodas',
    lifestyleImage: '/src/assets/images/fb_lifestyle_family_1790893967984.jpg',
    primaryText: `Haz realidad la reforma de tu casa, renueva tu cocina, baños o aislamiento energético sin vaciar tus ahorros. 🏡👨‍👩‍👧

INSTACREDIT España te financia desde 2.000 € hasta 100.000 € en plazos flexibles de hasta 6 años:

🛋️ Reforma integral de vivienda, mobiliario o climatización.
⚡ Proyectos familiares y mejoras del bienestar en tu hogar.
📅 Paga mes a mes una cuota fija que encaja en tu presupuesto.
💳 Transferencia directa a tu cuenta bancaria de cualquier banco español.`,
    description: 'Cuotas fijas mensuales sin sorpresas. Consulta tu oferta personalizada.',
    callToAction: 'Más Información',
    theme: 'navy',
    badgeText: 'HOGAR Y FAMILIA',
    amountHighlight: 'De 2.000 € a 100.000 €',
    bullets: ['Plazos flexibles hasta 72 meses', 'Cuota fija mensual invariable', 'Abono directo en tu IBAN'],
    complianceDisclaimer: 'Ejemplo representativo: Para un préstamo de 20.000 € a 48 meses: TIN 6,95%, TAE 7,82%. Cuota mensual: 478,52 €. Importe total adeudado: 22.968,96 €. Formalización telemática bajo Reglamento eIDAS (UE 910/2014).'
  },
  {
    id: 'fb-camp-4',
    title: 'Unificación de Deudas: Paga una Sola Cuota Mensual Reducida',
    category: 'Unificación',
    targetAudience: 'Personas con varias tarjetas de crédito o pequeños préstamos que buscan reducir su pago mensual.',
    headline: 'Unifica tus Préstamos y Paga Hasta un 50% Menos Cada Mes en España',
    lifestyleImage: '/src/assets/images/fb_lifestyle_personal_1790893993475.jpg',
    primaryText: `¿Cansado de pagar varias cuotas de tarjetas y microcréditos cada fin de mes? 📉🧘‍♂️

Agrupa todas tus deudas en un solo préstamo INSTACREDIT de 2.000 € a 100.000 € y respira tranquilo:

✔️ Pagas un único recibo mensual mucho más bajo.
✔️ Reduces los intereses elevados de tarjetas revolving complejas.
✔️ Asesor personal asignado para tramitar la liquidación de tus antiguos créditos.
✔️ Sin necesidad de poner tu vivienda en garantía.

Escríbenos por WhatsApp y te hacemos un estudio de ahorro gratuito en menos de 30 minutos. 📲`,
    description: 'Ahorra en tu cuota mensual. Estudio gratuito y confidencial.',
    callToAction: 'Enviar Mensaje',
    theme: 'gold',
    badgeText: 'REDUCE TU CUOTA MENSUAL',
    amountHighlight: 'Unificación hasta 100.000 €',
    bullets: ['Un solo pago al mes', 'Ahorra en intereses elevados', 'Sin aval hipotecario'],
    complianceDisclaimer: 'Operación de refinanciación sujeta a análisis de solvencia responsable conforme a la Circular 5/2012 del Banco de España y Ley 16/2011.'
  },
  {
    id: 'fb-camp-5',
    title: 'Extranjeros Residentes en España: Financiación con DNI, NIE o TIE',
    category: 'Personal',
    targetAudience: 'Comunidad extranjera residente en España (europea y latinoamericana) con empleo o actividad demostrable.',
    headline: 'Préstamos en España para Residentes con DNI o NIE | Rápido y Seguro',
    lifestyleImage: '/src/assets/images/fb_lifestyle_entrepreneur_1790893984324.jpg',
    primaryText: `¿Vives y trabajas en España y necesitas un préstamo de 2.000 € a 100.000 €? 🇪🇸🤝

En INSTACREDIT facilitamos el acceso al crédito para personas con NIE Comunitario, TIE de Residencia o Pasaporte con estancia legal en España:

🌍 Valoramos tu arraigo y tu esfuerzo laboral (nómina o alta de autónomos).
💳 Recibe el dinero directamente en tu cuenta bancaria española.
🛡️ Todo el trámite 100% legal, auditado y seguro.
📲 Asesoría directa en español por WhatsApp en menos de 30 minutos.

Pide tu crédito hoy y gestiona todo cómodamente desde tu móvil.`,
    description: 'Inclusión financiera real en España. Trámite ágil con tu DNI/NIE.',
    callToAction: 'Contactar por WhatsApp',
    theme: 'blue',
    badgeText: 'INCLUSIÓN Y RESIDENCIA ESPAÑA',
    amountHighlight: '2.000 € a 100.000 €',
    bullets: ['Aceptamos NIE / TIE en vigor', 'Sin discriminación ni barreras', 'Atención personalizada por WhatsApp'],
    complianceDisclaimer: 'Se requiere residencia legal demostrable en territorio español y cuenta bancaria con IBAN español.'
  }
];

export const FacebookAdMarketingCreator: React.FC = () => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(FACEBOOK_CAMPAIGNS[0].id);
  const [visualMode, setVisualMode] = useState<'lifestyle' | 'graphic'>('lifestyle');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [randomNotice, setRandomNotice] = useState<string | null>(null);

  const currentCamp = FACEBOOK_CAMPAIGNS.find((c) => c.id === selectedCampaignId) || FACEBOOK_CAMPAIGNS[0];

  const handleCopyText = (sectionKey: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleRandomCampaign = () => {
    const remaining = FACEBOOK_CAMPAIGNS.filter((c) => c.id !== selectedCampaignId);
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const chosen = remaining[randomIndex];
    setSelectedCampaignId(chosen.id);
    setRandomNotice(`Campaña aleatoria activada: "${chosen.title}"`);
    setTimeout(() => setRandomNotice(null), 3500);
  };

  const handleCopyFullCampaignPack = () => {
    const fullPack = `[CAMPAÑA PUBLICITARIA FACEBOOK INSTACREDIT ESPAÑA]
TITULAR DEL ANUNCIO:
${currentCamp.headline}

TEXTO PRINCIPAL (COPY DE LA PUBLICACIÓN):
${currentCamp.primaryText}

DESCRIPCIÓN ENLACE:
${currentCamp.description}

LLAMADA A LA ACCIÓN (CTA):
${currentCamp.callToAction}

DESCARGO NORMATIVO BANCO DE ESPAÑA (CIRCULAR 4/2020):
${currentCamp.complianceDisclaimer}

IMAGEN LIFESTYLE RECOMENDADA:
${currentCamp.lifestyleImage}`;

    handleCopyText('full_pack', fullPack);
  };

  const getThemeClasses = (theme: FacebookAdCampaign['theme']) => {
    switch (theme) {
      case 'emerald':
        return 'from-emerald-900 via-teal-900 to-emerald-950 text-white border-emerald-500/40';
      case 'navy':
        return 'from-[#0B1B3D] via-[#0E2452] to-[#0B1B3D] text-white border-blue-500/40';
      case 'gold':
        return 'from-amber-950 via-slate-900 to-amber-900 text-white border-amber-500/40';
      default:
        return 'from-[#0B1B3D] via-[#0044CC] to-[#0B1B3D] text-white border-blue-400/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0B1B3D] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Estudio Creativo & Anuncios Facebook Ads
            </span>
            <span className="bg-blue-500/20 text-[#0066FF] text-[10px] font-bold px-2 py-0.5 rounded-full">
              Fotografía Lifestyle Financiero
            </span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Conforme Circular 4/2020 Banco de España
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Creatividades Publicitarias & Copys para Facebook
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Generador de anuncios con imágenes promocionales de <strong>estilo de vida ('lifestyle' financiero)</strong>, textos persuasivos de alta conversión y estricto cumplimiento del régimen de publicidad financiera en España (Ley 16/2011 y Orden ETD/699/2020).
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRandomCampaign}
            className="px-4 py-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-white font-bold text-xs border border-blue-700 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-cyan-300" />
            <span>Mostrar Anuncio Aleatorio</span>
          </button>

          <button
            type="button"
            onClick={handleCopyFullCampaignPack}
            className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            {copiedSection === 'full_pack' ? (
              <Check className="w-4 h-4 text-[#00E599]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copiedSection === 'full_pack' ? '¡Copiado Todo!' : 'Copiar Pack Completo'}</span>
          </button>
        </div>
      </div>

      {randomNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{randomNotice}</span>
        </div>
      )}

      {/* Campaigns Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {FACEBOOK_CAMPAIGNS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCampaignId(c.id)}
            className={`p-3.5 rounded-2xl text-left transition border cursor-pointer flex flex-col justify-between ${
              selectedCampaignId === c.id
                ? 'bg-[#0B1B3D] text-white border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                selectedCampaignId === c.id ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {c.category}
              </span>
              <h5 className="font-bold text-xs line-clamp-2 leading-snug">
                {c.title}
              </h5>
            </div>
            <div className="text-[10px] font-bold text-emerald-600 mt-2">
              {c.amountHighlight}
            </div>
          </button>
        ))}
      </div>

      {/* Main Studio: Left Preview (Facebook Feed Mockup) & Right Copy Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Facebook Mockup (Real Facebook Post Simulation) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#0066FF]" />
              Vista Previa en Feed de Facebook (Móvil / Web)
            </span>

            {/* Toggle visual mode */}
            <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setVisualMode('lifestyle')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  visualMode === 'lifestyle'
                    ? 'bg-white text-[#0B1B3D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📸 Lifestyle
              </button>
              <button
                type="button"
                onClick={() => setVisualMode('graphic')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  visualMode === 'graphic'
                    ? 'bg-white text-[#0B1B3D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎨 Gráfico
              </button>
            </div>
          </div>

          {/* Facebook Post Mockup Container */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden font-sans">
            
            {/* Facebook Post Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B1B3D] flex items-center justify-center text-white font-black text-xs border border-blue-500">
                  IC
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900 text-sm">INSTACREDIT España</span>
                    <span className="w-4 h-4 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span>Publicidad</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">🌐 España</span>
                  </div>
                </div>
              </div>
              <span className="text-slate-400 font-bold text-lg cursor-pointer">•••</span>
            </div>

            {/* Post Primary Text */}
            <div className="p-4 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line border-b border-slate-100">
              {currentCamp.primaryText}
            </div>

            {/* Visual Creative: Lifestyle Photography vs Banner Graphic */}
            {visualMode === 'lifestyle' ? (
              <div className="relative overflow-hidden bg-slate-900 group">
                <img
                  src={currentCamp.lifestyleImage}
                  alt={currentCamp.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />

                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#00E599] border border-emerald-400/40">
                    {currentCamp.badgeText}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#0066FF] text-white w-fit shadow-xs">
                    INSTACREDIT España
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 z-10">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-white/95 text-[#0B1B3D] shadow-lg border border-slate-200">
                    {currentCamp.amountHighlight}
                  </span>
                </div>

                {/* Download Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={currentCamp.lifestyleImage}
                    download={`anuncio_lifestyle_${currentCamp.id}.jpg`}
                    className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Imagen Lifestyle</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className={`p-6 sm:p-8 bg-gradient-to-br ${getThemeClasses(currentCamp.theme)} border-y relative overflow-hidden flex flex-col justify-between min-h-[300px]`}>
                <div className="flex items-center justify-between relative z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {currentCamp.badgeText}
                  </span>
                  <span className="text-xs font-black tracking-tight text-white/90">
                    INSTA<span className="text-cyan-300">CREDIT</span> España
                  </span>
                </div>

                <div className="my-6 space-y-2 relative z-10">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-slate-200 block">
                    Préstamos Personales Inmediatos
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {currentCamp.amountHighlight}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-sm">
                    Dinero en tu Cuenta Digital en 15 minutos. Sin avales ni desplazamientos.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 relative z-10 pt-2 border-t border-white/10">
                  {currentCamp.bullets.map((b, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-white/10 backdrop-blur-xs text-white border border-white/10 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-[#00E599]" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Facebook Post Link Preview Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  INSTACREDIT.ES
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                  {currentCamp.headline}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {currentCamp.description}
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg shrink-0 transition"
              >
                {currentCamp.callToAction}
              </button>
            </div>

            {/* Social Engagement Stats simulation */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">👍</span>
                <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">❤️</span>
                <span className="text-[11px] text-slate-500 font-semibold ml-1">348 Me gusta</span>
              </div>
              <div className="text-[11px] text-slate-500">
                <span>42 comentarios • 19 compartidos</span>
              </div>
            </div>
          </div>

          {/* Download and Share Creative */}
          <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">
              Creatividad lista para Publicar en Ads Manager
            </span>
            <a
              href={currentCamp.lifestyleImage}
              download={`fb_lifestyle_creative_${currentCamp.id}.jpg`}
              className="px-3 py-1.5 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Imagen</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Copy Editor & Compliance Disclaimers */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Copy className="w-4 h-4 text-[#0066FF]" />
              Textos de Anuncio Listos para Copiar (Facebook Ads)
            </span>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Alta Conversión
            </span>
          </div>

          {/* Copy Box 1: Primary Text */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase text-[#0B1B3D]">
                Texto Principal (Copy del Post)
              </label>
              <button
                type="button"
                onClick={() => handleCopyText('primary', currentCamp.primaryText)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedSection === 'primary' ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedSection === 'primary' ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 whitespace-pre-line font-mono max-h-60 overflow-y-auto leading-relaxed select-all">
              {currentCamp.primaryText}
            </div>
          </div>

          {/* Copy Box 2: Headline & Description */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase text-[#0B1B3D]">
                Titular del Anuncio (Headline)
              </label>
              <button
                type="button"
                onClick={() => handleCopyText('headline', currentCamp.headline)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedSection === 'headline' ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedSection === 'headline' ? '¡Copiado!' : 'Copiar Titular'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
              {currentCamp.headline}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase text-[#0B1B3D]">
                Descripción del Enlace
              </label>
              <button
                type="button"
                onClick={() => handleCopyText('desc', currentCamp.description)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedSection === 'desc' ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedSection === 'desc' ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
              {currentCamp.description}
            </div>
          </div>

          {/* SPANISH FINANCIAL COMPLIANCE BOX (BANCO DE ESPAÑA & ORDEN ETD/699/2020) */}
          <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-extrabold uppercase text-amber-950">
                  Descargo Normativo Obligatorio (Circular 4/2020 BdE)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText('legal', currentCamp.complianceDisclaimer)}
                className="px-3 py-1 rounded-xl bg-amber-200/60 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedSection === 'legal' ? (
                  <Check className="w-3 h-3 text-emerald-700" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>Copiar Ejemplo</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-900 leading-relaxed font-serif">
              {currentCamp.complianceDisclaimer}
            </p>

            <div className="pt-2 border-t border-amber-200/60 text-[10px] text-amber-800 flex items-center justify-between">
              <span>Rigor legal: Ley 16/2011 • Transparencia INE</span>
              <span className="font-bold">Banco de España Homologado</span>
            </div>
          </div>

          {/* LIFESTYLE CREATIVES GALLERY CARDS */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-[#0B1B3D] flex items-center gap-1.5">
              <Image className="w-4 h-4 text-[#0066FF]" />
              Galería de Creatividades 'Lifestyle' Financiero Disponibles
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {LIFESTYLE_CREATIVES.map((life) => (
                <div
                  key={life.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between"
                >
                  <img
                    src={life.imageSrc}
                    alt={life.themeTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-24 sm:h-28 object-cover"
                  />
                  <div className="p-2 space-y-1">
                    <h6 className="font-bold text-[11px] text-slate-900 line-clamp-1">
                      {life.themeTitle}
                    </h6>
                    <a
                      href={life.imageSrc}
                      download={`lifestyle_${life.id}.jpg`}
                      className="w-full py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
