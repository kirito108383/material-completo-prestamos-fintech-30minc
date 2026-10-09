import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dispatchKitInOneAction } from '../../utils/kitDispatcher';
import { formatEUR } from '../../utils/financialCalculations';
import {
  BookOpen,
  MessageCircle,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  HeartHandshake,
  UserCheck,
  AlertCircle,
  Sparkles,
  Zap,
  Phone,
  FileCheck,
  Send,
  HelpCircle,
  Award,
  ChevronRight,
  Search,
  Filter,
  Image as ImageIcon,
  Download,
  Eye,
  User
} from 'lucide-react';

export interface DetailedScriptItem {
  id: string;
  category: 'saludo_inicial' | 'recopilacion_docs' | 'seguimiento' | 'manejo_objeciones';
  title: string;
  scenario: string;
  shortCopyWhatsApp: string;
  empathyGuideline: string;
  complianceRule: string;
  tags: string[];
  image: {
    src: string;
    title: string;
    subtitle: string;
    badge: string;
  };
}

export const AdvisorDetailedScriptsManual: React.FC = () => {
  const { applications, currentAdvisor, logAdvisorAction } = useApp();

  const [activeCategory, setActiveCategory] = useState<'todos' | 'saludo_inicial' | 'recopilacion_docs' | 'seguimiento' | 'manejo_objeciones'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [customPhone, setCustomPhone] = useState('');

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];
  const clientName = currentApp ? `${currentApp.personalData.firstName} ${currentApp.personalData.lastName}` : 'Estimado(a) Cliente';
  const clientFirstName = clientName.split(' ')[0];
  const clientPhone = currentApp ? currentApp.personalData.phone : (customPhone || '600000000');
  const capitalAmount = currentApp ? formatEUR(currentApp.approvedAmount || currentApp.loanDetails.capital) : '5.000,00 €';
  const radicadoId = currentApp ? currentApp.id : 'INSTA-ES-902143';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://instacredit.es';

  const MANUAL_SCRIPTS: DetailedScriptItem[] = [
    // -------------------------------------------------------------
    // BLOQUE 1: SALUDO INICIAL Y PRIMER CONTACTO EMPÁTICO
    // -------------------------------------------------------------
    {
      id: 'man-saludo-1',
      category: 'saludo_inicial',
      title: 'Saludo Inicial Cálido tras Registro en Web/PWA',
      scenario: 'El usuario acaba de solicitar su préstamo en la web y espera su primer contacto.',
      image: {
        src: '/src/assets/images/ws_bienvenida_1790860195015.jpg',
        title: 'Tarjeta Oficial de Bienvenida y Asesor Personal',
        subtitle: 'Respaldo de 12 años en España y garantía de respuesta en máximo 30 minutos.',
        badge: 'Bienvenida Oficial'
      },
      shortCopyWhatsApp: `¡Hola, *${clientFirstName}*! 👋 Te saluda *${currentAdvisor.name}* de *INSTACREDIT España*. 🇪🇸

He recibido tu solicitud por *${capitalAmount}* (Exp. *#${radicadoId}*). Es un placer acompañarte.

🏛️ Respaldados por más de 12 años de trayectoria en España y más de 150.000 clientes satisfechos.
⏱️ Tienes garantizada mi atención y respuesta en *máximo 30 minutos*.

¿Tienes 1 minuto para confirmar un par de datos y avanzar tu expediente? ¡Estoy a tu disposición! 😊`,
      empathyGuideline: 'Tono cercano y positivo. Llamar siempre al cliente por su primer nombre de pila.',
      complianceRule: 'Supervisión de conducta del Banco de España y Ley 16/2011 de Contratos de Crédito.',
      tags: ['Bienvenida', 'Registro', '30 Minutos']
    },
    {
      id: 'man-saludo-2',
      category: 'saludo_inicial',
      title: 'Respuesta Rápida a Cliente que Escribe por WhatsApp',
      scenario: 'El cliente pulsa el botón flotante de WhatsApp o la burbuja de la web con una consulta.',
      image: {
        src: '/src/assets/images/fb_lifestyle_personal_1790893993475.jpg',
        title: 'Atención Financiera Ágil y Personalizada',
        subtitle: 'Simulación inmediata de préstamos sin burocracia ni colas de espera.',
        badge: 'Trato Directo'
      },
      shortCopyWhatsApp: `¡Hola, *${clientFirstName}*! Un gusto saludarte. 😊 Soy *${currentAdvisor.name}*, tu asesor personal en *INSTACREDIT*.

Te confirmo que podemos financiarte desde *2.000 € hasta 100.000 €* de forma 100% digital, sin desplazamientos ni burocracia.

¿Qué importe tienes en mente para calcularte la cuota mensual más ajustada en menos de 10 minutos? 💶`,
      empathyGuideline: 'Respuesta inmediata. Mostrar agilidad y disposición sin presionar.',
      complianceRule: 'Transparencia de condiciones iniciales (Orden ETD/699/2020).',
      tags: ['WhatsApp Entrante', 'Simulación', 'Agilidad']
    },
    {
      id: 'man-saludo-3',
      category: 'saludo_inicial',
      title: 'Saludo Inclusivo con Enlace a Formulario con Asistencia de Voz',
      scenario: 'Para personas mayores, usuarios con dificultad visual o baja comprensión lectora.',
      image: {
        src: '/src/assets/images/ws_bienvenida_1790860195015.jpg',
        title: 'Asistencia Guiada con Formulario de Voz',
        subtitle: 'Soporte accesible e inclusivo para personas mayores y lectura asistida.',
        badge: 'Accesibilidad e Inclusión'
      },
      shortCopyWhatsApp: `Estimado(a) *${clientName}*, te saluda *${currentAdvisor.name}* de *INSTACREDIT*. 🎙️✨

Queremos que el trámite sea lo más sencillo posible. Si lo prefieres, puedes usar nuestro *Formulario Asistido con Voz*:

👉 Enlace: ${baseUrl}/?form=asistido&expediente=${radicadoId}

🔊 Incluye botón para escuchar las preguntas en voz alta y letra grande.
Si prefieres, también puedo tomarte los datos directamente por este chat. ¡Tú decides cómo te resulta más cómodo!`,
      empathyGuideline: 'Trato paciente y respetuoso, facilitando la inclusión de personas vulnerables.',
      complianceRule: 'Accesibilidad e inclusión conforme al Real Decreto Legislativo 1/2013.',
      tags: ['Inclusión', 'Audio', 'Accesibilidad']
    },

    // -------------------------------------------------------------
    // BLOQUE 2: RECOPILACIÓN DE DOCUMENTACIÓN
    // -------------------------------------------------------------
    {
      id: 'man-docs-1',
      category: 'recopilacion_docs',
      title: 'Solicitud Sencilla de los 3 Documentos Clave',
      scenario: 'Solicitar DNI/NIE, última nómina/IRPF y certificado de titularidad bancaria.',
      image: {
        src: '/src/assets/images/ws_docs_guia_1790860205561.jpg',
        title: 'Infografía Didáctica de Documentos Requeridos',
        subtitle: 'Guía visual oficial: DNI/NIE, última nómina o IRPF y titularidad IBAN en España.',
        badge: 'Checklist Oficial'
      },
      shortCopyWhatsApp: `Hola, *${clientFirstName}*. Para formalizar la concesión de tus *${capitalAmount}* (Exp. *#${radicadoId}*), solo necesitamos estos 3 soportes:

1️⃣ Foto nítida por ambas caras de tu *DNI o NIE en vigor*.
2️⃣ Tu última *nómina, pensión o modelo IRPF* (para certificar ingresos).
3️⃣ Justificante de tu *cuenta bancaria* (donde aparezca tu nombre e IBAN español).

📸 Puedes adjuntar las fotos respondiendo directamente a este WhatsApp. ¡En *menos de 30 minutos* lo tenemos resuelto! ⏱️`,
      empathyGuideline: 'Aclarar que no se piden avalistas ni nóminas de familiares, solo lo básico.',
      complianceRule: 'Verificación de identidad y prevención del blanqueo de capitales (SEPBLAC Ley 10/2010).',
      tags: ['Checklist', 'DNI/NIE', 'Nómina', 'IBAN']
    },
    {
      id: 'man-docs-2',
      category: 'recopilacion_docs',
      title: 'Aclaración Amable de Calidad de Fotos Ilegibles',
      scenario: 'El cliente envió fotos borrosas, recortadas o con reflejo en el DNI/NIE.',
      image: {
        src: '/src/assets/images/ws_docs_guia_1790860205561.jpg',
        title: 'Consejos de Enfoque y Nitidez para Documentos',
        subtitle: 'Instrucciones para fotografiar sobre mesa bien iluminada sin reflejos ni flash.',
        badge: 'Calidad Fotográfica'
      },
      shortCopyWhatsApp: `¡Gracias por enviarlo, *${clientFirstName}*! 📸

He recibido los documentos, pero la foto del documento ha salido con un reflejo/corte que impide leer los dígitos.

¿Serías tan amable de tomar una nueva foto sobre una mesa con buena luz? Así el sistema de firma notarial eIDAS lo validará a la primera sin retrasos. ¡Muchas gracias por tu ayuda! 👍`,
      empathyGuideline: 'Explicar el motivo técnico sin culpar al cliente, agradeciendo su colaboración.',
      complianceRule: 'Estándares de firma electrónica cualificada bajo Reglamento eIDAS (UE 910/2014).',
      tags: ['Foto Ilegible', 'Subsanación', 'Calidad']
    },
    {
      id: 'man-docs-3',
      category: 'recopilacion_docs',
      title: 'Requisitos para Ciudadanos Extranjeros Residentes en España',
      scenario: 'El usuario pregunta si puede solicitar con NIE comunitario, TIE o pasaporte.',
      image: {
        src: '/src/assets/images/ws_docs_guia_1790860205561.jpg',
        title: 'Inclusión de Extranjeros Residentes en España',
        subtitle: 'Aceptación de NIE Comunitario, TIE de Residencia y Pasaporte en vigor.',
        badge: 'Extranjería y NIE'
      },
      shortCopyWhatsApp: `Hola, *${clientName}*. ¡Por supuesto! En *INSTACREDIT* atendemos con total normalidad a ciudadanos extranjeros con residencia en España: 🌍🇪🇸

Aceptamos:
• *NIE Comunitario* + pasaporte.
• *Tarjeta TIE de Residencia* en vigor por ambas caras.

Solo requerimos que tu cuenta bancaria esté en España y cuentes con ingresos regulares demostrables. Adjúntanos tu foto por aquí y te damos respuesta en *menos de 30 minutos*.`,
      empathyGuideline: 'Transmitir hospitalidad y apertura, eliminando barreras de extranjería.',
      complianceRule: 'No discriminación por nacionalidad (Art. 14 CE y Directiva 2008/48/CE).',
      tags: ['Extranjería', 'NIE', 'TIE', 'Residencia']
    },

    // -------------------------------------------------------------
    // BLOQUE 3: SEGUIMIENTO DE SOLICITUDES PENDIENTES
    // -------------------------------------------------------------
    {
      id: 'man-seg-1',
      category: 'seguimiento',
      title: 'Seguimiento Preventivo: Documentación Pendiente de Envío',
      scenario: 'Han pasado 3 o 4 horas y el usuario no ha subido o enviado sus fotos.',
      image: {
        src: '/src/assets/images/ws_seguimiento_1790860216261.jpg',
        title: 'Acompañamiento Personalizado en el Estudio',
        subtitle: 'Respaldo institucional de 12 años y tiempo medio de resolución en 30 minutos.',
        badge: 'Acompañamiento Activo'
      },
      shortCopyWhatsApp: `Hola, *${clientFirstName}*. 👋 Te escribe *${currentAdvisor.name}* de *INSTACREDIT*.

Te comento que tengo tu expediente *#${radicadoId}* por *${capitalAmount}* reservado y listo en mi mesa de gestión.

Solo nos falta tu DNI/NIE para emitir la aprobación definitiva. ¿Has tenido algún imprevisto para hacer la foto o te gustaría que te ayude a revisarlo juntos? Estoy aquí para ti. 😊`,
      empathyGuideline: 'Interesarse genuinamente por si ha tenido alguna dificultad técnica.',
      complianceRule: 'Consentimiento para seguimiento según RGPD (UE 2016/679).',
      tags: ['Seguimiento', 'Pendiente Docs', 'Recordatorio']
    },
    {
      id: 'man-seg-2',
      category: 'seguimiento',
      title: 'Expediente Aprobado Pendiente de Firma OTP SMS',
      scenario: 'El crédito está aprobado pero el cliente aún no ha introducido el SMS de firma.',
      image: {
        src: '/src/assets/images/ws_cierre_aprob_1790860226017.jpg',
        title: 'Certificado Oficial de Crédito Concedido',
        subtitle: 'Firma de pagaré notarial eIDAS en 2 minutos con abono instantáneo en Cuenta Digital.',
        badge: '¡Aprobado!'
      },
      shortCopyWhatsApp: `¡Hola, *${clientFirstName}*! Buenas noticias: tu crédito por *${capitalAmount}* ya está *APROBADO* formalmente. 🎉

Para liberar los fondos a tu Cuenta Digital IBAN solo debes introducir el código SMS de 6 dígitos que te hemos remitido.

👉 Firma aquí en 2 minutos: ${baseUrl}

En cuanto firmes, el dinero queda disponible de inmediato para retirar por Bizum o Transferencia SEPA. ¿Necesitas que te reenvíe el SMS?`,
      empathyGuideline: 'Celebrar el aprobado con entusiasmo y facilitar el último paso.',
      complianceRule: 'Validez contractual y derecho de desistimiento de 14 días (Art. 28 Ley 16/2011).',
      tags: ['Aprobado', 'Firma SMS', 'Desembolso']
    },
    {
      id: 'man-seg-3',
      category: 'seguimiento',
      title: 'Seguimiento de Consulta en Estudio (Garantía 30 Minutos)',
      scenario: 'El cliente preguntó hace unos minutos si ya hay novedades de su expediente.',
      image: {
        src: '/src/assets/images/ws_seguimiento_1790860216261.jpg',
        title: 'Compromiso de Resolución Rápida SLA',
        subtitle: 'Garantía estricta de atención en menos de 30 minutos sin incertidumbre.',
        badge: 'Garantía 30m'
      },
      shortCopyWhatsApp: `Hola, *${clientFirstName}*. Tu expediente se encuentra en el tramo final de validación con el comité de crédito. ⏱️

Recuerda que tenemos el compromiso de darte la resolución definitiva en un *máximo de 30 minutos*.

Te escribo por este mismo chat en cuanto salte la confirmación. ¡Muchas gracias por tu paciencia! 👍`,
      empathyGuideline: 'Dar certidumbre inmediata y reafirmar el compromiso de 30 minutos.',
      complianceRule: 'Deber de información previa al contrato (Circular 5/2012 Banco de España).',
      tags: ['En Estudio', '30 Minutos', 'Tranquilidad']
    },

    // -------------------------------------------------------------
    // BLOQUE 4: MANEJO DE OBJECIONES Y SEGURIDAD ANTIFRAUDE
    // -------------------------------------------------------------
    {
      id: 'man-obj-1',
      category: 'manejo_objeciones',
      title: 'Objeción: "Me da desconfianza pedir dinero por internet"',
      scenario: 'El usuario tiene temor a fraudes online o dudas sobre la legitimidad de la empresa.',
      image: {
        src: '/src/assets/images/ws_seguridad_antifraude_1790894760624.jpg',
        title: 'Certificado de Seguridad Oficial y Cero Cobros Previos',
        subtitle: 'Sello de transparencia: jamás solicitamos transferencias previas para prestar.',
        badge: 'Seguridad Antifraude'
      },
      shortCopyWhatsApp: `Te comprendo al 100%, *${clientFirstName}*, es totalmente normal ser prudente con las finanzas en internet. 🤝

Quiero darte total tranquilidad:
🏛️ En *INSTACREDIT España* llevamos *más de 12 años operando* con sede en Paseo de la Castellana 95, Madrid.
🛡️ Jamás te pediremos *anticipos o cobros previos*.
📜 Operamos bajo la *Ley 16/2011 de Contratos de Crédito* y supervisión de buenas prácticas del Banco de España.
✍️ Tu contrato se formaliza con firma notarial cualificada eIDAS (Reglamento UE 910/2014) y tienes 14 días de desistimiento legal.

Además, cuentas conmigo personalmente como tu asesor asignado con respuesta en menos de 30 minutos. ¿Deseas que conversemos?`,
      empathyGuideline: 'Validar su temor. Nunca minimizar sus dudas, aportar datos de solvencia y sede física.',
      complianceRule: 'Transparencia de identidad mercantil (LSSI-CE Ley 34/2002 y NIF corporativo B-89412093).',
      tags: ['Seguridad', 'Desconfianza', 'Trayectoria 12 Años']
    },
    {
      id: 'man-obj-2',
      category: 'manejo_objeciones',
      title: 'Objeción: "¿Aceptáis ASNEF o registros de morosidad?"',
      scenario: 'El cliente teme ser rechazado por tener alguna factura impagada previa.',
      image: {
        src: '/src/assets/images/fb_lifestyle_family_1790893967984.jpg',
        title: 'Estudio de Crédito Humano y Global',
        subtitle: 'Evaluamos tu capacidad real de pago actual, no solo incidencias pasadas de telefonía.',
        badge: 'Inclusión Financiera'
      },
      shortCopyWhatsApp: `Hola, *${clientFirstName}*. En *INSTACREDIT* realizamos un análisis humano y global de solvencia. 💡

Si tu incidencia en ASNEF procede de discrepancias comerciales (ej. telefonía o suministros) y cuentas con ingresos regulares actuales (nómina, pensión o autónomo), *sí valoramos tu solicitud de 2.000 € a 100.000 €*.

Te invito a completar el estudio sin compromiso. Evaluamos tu capacidad de pago real hoy, no solo tu pasado. ¿Lo tramitamos? 😊`,
      empathyGuideline: 'Empatía ante situaciones de vulnerabilidad crediticia sin juzgar al usuario.',
      complianceRule: 'Evaluación prudencial de la solvencia (Orden EHA/2899/2011).',
      tags: ['ASNEF', 'Solvencia', 'Oportunidad']
    }
  ];

  const filtered = MANUAL_SCRIPTS.filter((s) => {
    const matchesCategory = activeCategory === 'todos' || s.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.scenario.toLowerCase().includes(q) ||
      s.shortCopyWhatsApp.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);

    if (currentApp) {
      logAdvisorAction(currentApp.id, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'whatsapp',
        summary: `Libreto de manual copiado para ${clientName}.`
      });
    }
  };

  const handleDispatchUnified = async (script: DetailedScriptItem) => {
    setDispatchingId(script.id);
    try {
      await dispatchKitInOneAction({
        imageSrc: script.image.src,
        imageTitle: script.image.title,
        messageText: script.shortCopyWhatsApp,
        clientPhone,
        clientName,
        kitId: script.id
      });
      setDispatchingId(null);

      if (currentApp) {
        logAdvisorAction(currentApp.id, {
          advisorId: currentAdvisor.id,
          advisorName: currentAdvisor.name,
          actionType: 'whatsapp',
          summary: `Kit despachado desde manual: "${script.title}" con imagen oficial para ${clientName}.`
        });
      }
    } catch {
      setDispatchingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1B3D] text-white p-6 rounded-3xl shadow-lg border border-blue-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Manual Operativo & Libretos Homologados
            </span>
            <span className="bg-white/10 text-xs font-semibold px-2 py-0.5 rounded-full text-slate-200">
              Imagen Adjunta Obligatoria en 1 Clic
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Manual de Mensajería, Empatía y Objeciones</h2>
          <p className="text-xs text-blue-100 max-w-2xl mt-1 leading-relaxed">
            Cada libreto incluye su correspondiente <strong>imagen oficial adjunta</strong>, pautas de empatía recomendadas y marco normativo del Banco de España, listos para enviar en una sola acción coordinada.
          </p>
        </div>

        {/* Client Selector */}
        <div className="bg-blue-950/60 border border-blue-800 p-3 rounded-2xl shrink-0 w-full md:w-72 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1">
            <User className="w-3 h-3 text-[#00E599]" />
            Personalizar con Cliente:
          </label>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded-xl bg-white text-slate-900 font-bold border border-slate-300"
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.personalData.firstName} {app.personalData.lastName} ({formatEUR(app.approvedAmount || app.loanDetails.capital)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'saludo_inicial', label: '👋 Saludos Iniciales' },
            { id: 'recopilacion_docs', label: '📄 Recopilación Docs' },
            { id: 'seguimiento', label: '⏱️ Seguimiento y SLA' },
            { id: 'manejo_objeciones', label: '🛡️ Objeciones & Confianza' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-[#0B1B3D] text-white border-[#0B1B3D]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por palabra clave..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 font-medium"
          />
        </div>
      </div>

      {/* Scripts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((script) => (
          <div
            key={script.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-black text-sm text-[#0B1B3D]">{script.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{script.scenario}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-[#0066FF] border border-blue-200 shrink-0">
                  {script.image.badge}
                </span>
              </div>

              {/* Paired Image Asset */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-32">
                <img
                  src={script.image.src}
                  alt={script.image.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5 text-white">
                  <div>
                    <span className="text-[9px] font-bold text-[#00E599] uppercase">
                      Imagen Oficial Adjunta (1 Acción)
                    </span>
                    <h5 className="font-bold text-xs line-clamp-1">{script.image.title}</h5>
                  </div>
                </div>
              </div>

              {/* WhatsApp Bubble Preview */}
              <div className="p-3 bg-[#EFEAE2] border border-slate-200 rounded-2xl shadow-inner">
                <div className="bg-[#E7FFDB] text-slate-900 rounded-2xl rounded-tr-xs p-3 text-xs font-sans whitespace-pre-line leading-relaxed shadow-xs">
                  {script.shortCopyWhatsApp}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 font-mono">
                    <span>12:05</span>
                    <span className="text-blue-500 font-bold">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <HeartHandshake className="w-3 h-3" /> Pauta de Empatía:
                  </span>
                  <p className="mt-0.5">{script.empathyGuideline}</p>
                </div>
                <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950">
                  <span className="font-bold text-blue-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Marco Legal:
                  </span>
                  <p className="mt-0.5">{script.complianceRule}</p>
                </div>
              </div>
            </div>

            {/* Unified 1-Action Dispatch & Copy Controls */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => handleDispatchUnified(script)}
                disabled={dispatchingId === script.id}
                className="w-full py-3 px-3 bg-gradient-to-r from-[#0066FF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {dispatchingId === script.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                )}
                <span>⚡ Enviar Kit Completo (Imagen + Mensaje en 1 Acción)</span>
              </button>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(script.id, script.shortCopyWhatsApp)}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  {copiedId === script.id ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedId === script.id ? '¡Copiado!' : 'Copiar Solo Texto'}</span>
                </button>

                <a
                  href={script.image.src}
                  download={`instacredit_${script.id}.jpg`}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar Imagen</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
