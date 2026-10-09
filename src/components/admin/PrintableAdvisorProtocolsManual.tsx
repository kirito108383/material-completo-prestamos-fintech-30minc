import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Download,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Building,
  UserCheck,
  Calendar,
  Sparkles,
  FileText,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  FileSignature,
  Volume2,
  VolumeX,
  Copy
} from 'lucide-react';
import { formatEUR } from '../../utils/financialCalculations';

interface QuestionAnswerItem {
  id: string;
  question: string;
  clientPsychology: string;
  exactAdvisorScript: string;
  tips: string;
}

interface CommonCaseHandbook {
  id: string;
  caseNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  targetProfile: string;
  legalNorm: string;
  whatAdvisorMustKnow: {
    corePrinciples: string[];
    neverSay: string[];
    alwaysSay: string[];
    regulatoryFramework: string;
  };
  whatAdvisorMustDo: {
    phase1: { title: string; steps: string[] };
    phase2: { title: string; steps: string[] };
    phase3: { title: string; steps: string[] };
    printableChecklist: string[];
  };
  qaList: QuestionAnswerItem[];
  sampleDialogue: {
    whatsappCopy: string;
    phoneScript: string;
  };
}

export const PrintableAdvisorProtocolsManual: React.FC = () => {
  const { currentAdvisor, platformConfig, advisorsList } = useApp();

  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [targetAdvisorName, setTargetAdvisorName] = useState<string>(currentAdvisor?.name || 'Carlos Mendoza');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedQA, setExpandedQA] = useState<Record<string, boolean>>({});
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const speakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.98;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleQA = (id: string) => {
    setExpandedQA((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllQA = () => {
    const allExpanded: Record<string, boolean> = {};
    HANDBOOK_CASES.forEach((caseItem) => {
      caseItem.qaList.forEach((q) => {
        allExpanded[q.id] = true;
      });
    });
    setExpandedQA(allExpanded);
  };

  const collapseAllQA = () => {
    setExpandedQA({});
  };

  const handlePrintFullManual = () => {
    setViewMode('all');
    expandAllQA();
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handlePrintCurrentCase = () => {
    setViewMode('single');
    const allExpanded: Record<string, boolean> = { ...expandedQA };
    HANDBOOK_CASES[activeCaseIndex].qaList.forEach((q) => {
      allExpanded[q.id] = true;
    });
    setExpandedQA(allExpanded);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const HANDBOOK_CASES: CommonCaseHandbook[] = [
    // =========================================================================
    // CASO 1
    // =========================================================================
    {
      id: 'caso-1',
      caseNumber: 1,
      title: 'Cliente Nuevo con Desconfianza y Miedo al Fraude',
      subtitle: 'Atención al solicitante de primera vez, prevención de fraudes y garantía de cero cobros previos',
      badge: 'PRIMER CONTACTO • ONBOARDING',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      targetProfile: 'Solicitante que acaba de registrarse en la web o ha preguntado por WhatsApp, pero teme ser estafado o que le pidan dinero por adelantado.',
      legalNorm: 'Ley 16/2011 de Contratos de Crédito al Consumo y Circular 5/2012 del Banco de España',
      whatAdvisorMustKnow: {
        corePrinciples: [
          'En INSTACREDIT España NUNCA se cobra ni solicita un solo céntimo por anticipado (ni gastos de apertura, ni fianza, ni seguros obligatorios). Es una infracción gravísima insinuar o permitir cualquier cobro previo.',
          'Operamos con NIF oficial B-87942105, domicilio fiscal en España y cumplimiento de las directrices de conducta supervisadas por el Banco de España.',
          'El desembolso se ejecuta de forma íntegra por Bizum o Transferencia SEPA Instantánea en 15 minutos una vez validada la identidad.',
          'El cliente escéptico busca seguridad humana, no discursos mecánicos. Hablar con calma, firmeza y profesionalidad.'
        ],
        neverSay: [
          'NUNCA digas: "Para activarlo debe transferir 30 euros de póliza o gestión". (Falso y terminantemente prohibido)',
          'NUNCA digas: "Si no me responde ahora mismo perderá el crédito para siempre". (Genera desconfianza y sensación de trampa)',
          'NUNCA digas: "Nosotros no tenemos nada que ver con el Banco de España". (Somos entidad financiera supervisada en transparencia)'
        ],
        alwaysSay: [
          'SIEMPRE declara: "En Instacredit jamás le pediremos dinero por adelantado. Usted recibe el 100% de su dinero limpio."',
          'SIEMPRE declara: "Somos una entidad legalmente inscrita en España sujeta a la Ley 16/2011 de Crédito al Consumo."',
          'SIEMPRE declara: "Mi nombre es [Tu Nombre], soy su asesor asignado y responderé personalmente ante cualquier duda."'
        ],
        regulatoryFramework: 'Circular 5/2012 del Banco de España (Transparencia en operaciones de crédito) y Ley 16/2011 art. 10 y 11 sobre información normalizada precontractual.'
      },
      whatAdvisorMustDo: {
        phase1: {
          title: 'Fase 1: Diagnóstico y Derribo de la Objeción (Minutos 0 - 5)',
          steps: [
            'Llamar al cliente o remitir el WhatsApp oficial de bienvenida dentro de los primeros 15 minutos de su solicitud.',
            'Llamar al cliente siempre por su primer nombre de pila con tono cordial y respetuoso.',
            'Adelantarse a su temor antes de que lo plantee: "Le llamo/escribo para informarle de las condiciones y quiero recalcarle que en Instacredit nunca cobramos anticipos."'
          ]
        },
        phase2: {
          title: 'Fase 2: Presentación del Respaldo y Kit Oficial (Minutos 5 - 15)',
          steps: [
            'Enviar el Kit Oficial de Bienvenida con la imagen certificada institucional por WhatsApp.',
            'Confirmar los datos de la solicitud: importe deseado, plazo y finalidad del crédito.',
            'Explicar el procedimiento transparente de 3 pasos: cotejo de DNI, verificación de IBAN y firma digital del pagaré eIDAS.'
          ]
        },
        phase3: {
          title: 'Fase 3: Cierre y Registro en el Sistema (Minutos 15 - 30)',
          steps: [
            'Resolver las preguntas frecuentes con las respuestas textuales autorizadas.',
            'Registrar la acción en la bitácora del cliente como "llamada" o "whatsapp" indicando "Cliente informado sobre política cero anticipos".',
            'Avanzar el estado del expediente en el panel a "En Revisión" si el cliente acepta continuar.'
          ]
        },
        printableChecklist: [
          'Se ha verificado el número de radicado oficial de la solicitud.',
          'Se ha comunicado explícitamente la regla de CERO anticipos previos.',
          'Se ha remitido la imagen oficial del kit de bienvenida por WhatsApp.',
          'Se ha registrado el resultado de la conversación en la bitácora del CRM.',
          'El cliente ha confirmado que comprende las condiciones sin presión.'
        ]
      },
      qaList: [
        {
          id: 'c1-q1',
          question: '¿Tengo que ingresar algún dinero previo por gastos de seguro, fianza o apertura?',
          clientPsychology: 'El cliente ha sido víctima de estafas en internet donde prometen un préstamo a cambio de pagar 50 o 100 euros antes.',
          exactAdvisorScript: 'Rotundamente NO, estimado(a) [Nombre]. En INSTACREDIT España tenemos una política de tolerancia cero con los cobros previos. Jamás le pediremos que nos ingrese ni un solo céntimo por anticipado para seguros, comisiones ni aperturas. Usted recibe el 100% de su capital líquido en su cuenta bancaria. Si en algún momento alguien en internet le pide dinero antes de prestarle, desconfíe.',
          tips: 'Pronunciar la palabra "Rotundamente NO" con tono firme y pausado para generar alivio inmediato.'
        },
        {
          id: 'c1-q2',
          question: '¿Cuánto tiempo tarda realmente en llegar el dinero a mi cuenta bancaria?',
          clientPsychology: 'Urgencia de liquidez y miedo a perder el tiempo con trámites interminables.',
          exactAdvisorScript: 'El desembolso se realiza en un plazo de 5 a 15 minutos tras verificar su DNI y formalizar la firma electrónica. Realizamos los envíos por Bizum inmediato o Transferencia SEPA Instantánea, por lo que el saldo queda disponible en su banco de forma prácticamente inmediata.',
          tips: 'Mencionar Bizum transmite inmediatez y cercanía para clientes españoles.'
        },
        {
          id: 'c1-q3',
          question: '¿Cómo sé que esta empresa es legal en España y no una página falsa?',
          clientPsychology: 'Necesidad de respaldo formal e institucional comprobable.',
          exactAdvisorScript: 'INSTACREDIT España es una entidad fintech registrada en el Registro Mercantil de Madrid con NIF B-87942105. Operamos en estricto cumplimiento de la Ley 16/2011 de Contratos de Crédito al Consumo y bajo la supervisión de transparencia del Banco de España (Circular 5/2012). Puede consultar nuestros datos legales y nuestra política de protección de datos en cualquier momento en el pie de página de nuestra plataforma.',
          tips: 'Dar el NIF con naturalidad demuestra solvencia jurídica.'
        },
        {
          id: 'c1-q4',
          question: '¿Qué pasa si estoy en ficheros de morosidad como ASNEF o no tengo nómina fija?',
          clientPsychology: 'Temor al rechazo automático o a ser juzgado por su situación financiera.',
          exactAdvisorScript: 'En Instacredit no emitimos rechazos automáticos. Analizamos cada solicitud de manera humana e individualizada. Si cuenta con cualquier fuente regular de ingresos (pensión, desempleo, ingresos de autónomo o nómina temporal), su operación puede ser aprobada gracias a nuestro Fondo de Garantías FGA, sin necesidad de avalistas personales.',
          tips: 'Enfocarse en la solución humana y en la alternativa del fondo FGA.'
        },
        {
          id: 'c1-q5',
          question: '¿Para qué necesitan mi DNI y cómo sé que no lo usarán para otras cosas?',
          clientPsychology: 'Miedo al robo de identidad y suplantación.',
          exactAdvisorScript: 'Por la Ley 10/2010 de prevención de blanqueo de capitales, todas las entidades financieras en España estamos obligadas a identificar fehacientemente al solicitante antes de transferir dinero. Sus documentos se procesan bajo cifrado militar SSL de 256 bits y quedan bajo la custodia exclusiva del Reglamento General de Protección de Datos de la Unión Europea (RGPD). Nadie ajeno a su expediente tendrá acceso jamás a su información.',
          tips: 'Citar el RGPD y el cifrado SSL calma los temores tecnológicos.'
        }
      ],
      sampleDialogue: {
        whatsappCopy: `¡Hola, *[Nombre]*! 👋 Te saluda *${currentAdvisor.name}*, tu asesor personal en *INSTACREDIT España* 🇪🇸.

He recibido tu solicitud por *[Importe]* (Exp. *#[Radicado]*).

🛡️ *Antes de nada, tu tranquilidad es lo primero:* En Instacredit **JAMÁS** te cobraremos ningún dinero por adelantado ni comisiones ocultas. Nuestro servicio está supervisado bajo la normativa del Banco de España.

⚡ El proceso es 100% online y podemos desembolsar tu dinero por **Bizum en 15 minutos**.

¿Tienes 2 minutos para confirmar tus datos y avanzar tu expediente? ¡Quedo a tu disposición! 😊`,
        phoneScript: `"Buenos días/tardes, ¿hablo con [Nombre del Cliente]? Le saluda [Tu Nombre], asesor asignado de INSTACREDIT España. Me pongo en contacto con usted porque acabamos de recibir su solicitud de micropréstamo por [Importe] euros. 

Antes de entrar en detalle, quiero transmitirle la total seguridad de que nuestra entidad está registrada en España y jamás le pedirá ningún pago por adelantado. Mi labor es verificar con usted que los datos sean correctos para que pueda recibir el dinero hoy mismo por Bizum o transferencia. ¿Tiene un par de minutos para revisar su expediente?"`
      }
    },

    // =========================================================================
    // CASO 2
    // =========================================================================
    {
      id: 'caso-2',
      caseNumber: 2,
      title: 'Documentación Incompleta, DNI Dudoso y Verificación de IBAN',
      subtitle: 'Cumplimiento normativo antiblanqueo SEPBLAC, cotejo documental fehaciente y titularidad bancaria',
      badge: 'RIESGOS • SEPBLAC & ANTIFRAUDE',
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      targetProfile: 'Cliente que ha enviado una foto ilegible de su documento, DNI caducado con justificante de cita, o solicita recibir el dinero en la cuenta bancaria de un familiar o amigo.',
      legalNorm: 'Ley 10/2010 de Prevención del Blanqueo de Capitales (SEPBLAC) y Orden ECO/734/2004',
      whatAdvisorMustKnow: {
        corePrinciples: [
          'La cuenta bancaria española receptora del préstamo DEBE pertenecer al solicitante al 100%. Queda TERMINANTEMENTE PROHIBIDO transferir fondos a cuentas de cónyuges, padres, hijos o conocidos.',
          'Se admiten DNI en vigor, NIE comunitario y TIE de residentes legales en España.',
          'Si el DNI/NIE está caducado, se acepta si viene acompañado del justificante oficial de cita previa de renovación de la Policía Nacional y documento de identidad complementario (pasaporte o permiso de conducir).',
          'Toda documentación borrosa, recortada o en blanco y negro debe ser subsanada antes de aprobar el crédito.'
        ],
        neverSay: [
          'NUNCA digas: "No se preocupe, páseme la cuenta de su primo que igual le ingresamos". (Infracción legal grave ante el SEPBLAC)',
          'NUNCA digas: "Una fotocopia borrosa ya me sirve para aprobarlo". (Genera riesgo de suplantación de identidad)',
          'NUNCA digas: "Usted no califica porque su DNI está caducado". (Existe la alternativa de subsanación con resguardo)'
        ],
        alwaysSay: [
          'SIEMPRE declara: "Por normativa europea contra el fraude, el dinero solo puede transferirse a una cuenta a su nombre exclusivo."',
          'SIEMPRE declara: "Podemos aceptar su documento con el justificante oficial de cita de renovación de la Policía Nacional."',
          'SIEMPRE declara: "Le guiaré paso a paso para obtener su justificante bancario desde la app móvil en 1 minuto."'
        ],
        regulatoryFramework: 'Ley 10/2010 de Prevención del Blanqueo de Capitales (art. 3 a 7 de diligencia debida) y Circular 5/2012 del Banco de España.'
      },
      whatAdvisorMustDo: {
        phase1: {
          title: 'Fase 1: Revisión y Detección de Inconsistencias (Minutos 0 - 5)',
          steps: [
            'Examinar en el panel de expedientes la calidad visual del documento y la concordancia del IBAN.',
            'Comprobar la fecha de caducidad del DNI/NIE y el módulo 23 del dígito de control.',
            'Detectar si el IBAN pertenece a una entidad española autorizada (inicia por ES).'
          ]
        },
        phase2: {
          title: 'Fase 2: Asistencia Pedagógica y Solicitud Amable (Minutos 5 - 15)',
          steps: [
            'Enviar el Formulario Didáctico de Verificación de IBAN con lectura por voz si el cliente tiene dificultades.',
            'Explicar pedagógicamente por qué es una medida de protección a favor del propio cliente.',
            'Ofrecer instrucciones guiadas según el banco del cliente (Santander, BBVA, CaixaBank, Sabadell, ING, etc.).'
          ]
        },
        phase3: {
          title: 'Fase 3: Cotejo y Validación en Sistema (Minutos 15 - 30)',
          steps: [
            'Recibir la foto nítida y el justificante de titularidad bancaria.',
            'Registrar en bitácora: "Documentación subsanada y cotejada conforme a normativa SEPBLAC".',
            'Avanzar el estado del expediente a "Aprobado" si cumple con los requisitos de solvencia.'
          ]
        },
        printableChecklist: [
          'El documento de identidad muestra las 4 esquinas completas y sin reflejos.',
          'El número de DNI/NIE coincide exactamente con la solicitud radicada.',
          'La cuenta bancaria está certificada a nombre exclusivo del solicitante.',
          'Se ha verificado la entidad española en el listado de bancos supervisados.',
          'El expediente cuenta con acuse de cotejo en la bitácora del asesor.'
        ]
      },
      qaList: [
        {
          id: 'c2-q1',
          question: '¿Por qué no me sirve una foto recortada o una fotocopia en blanco y negro de mi DNI?',
          clientPsychology: 'Pereza o frustración por tener que buscar el documento físico y volver a fotografiarlo.',
          exactAdvisorScript: 'Le comprendo perfectamente, [Nombre], pero nuestro sistema notarial eIDAS y el Banco de España nos exigen cotejar los elementos de seguridad y hologramas del documento en color. Es una medida que protege su propia identidad para garantizar que nadie pueda solicitar créditos a su nombre con una simple fotocopia encontrada en internet. Si le hace una foto rápida con el móvil sobre una mesa con buena luz, se valida en 30 segundos.',
          tips: 'Enmarcar la molestia como un beneficio directo de seguridad para el cliente.'
        },
        {
          id: 'c2-q2',
          question: '¿Puedo dar el IBAN de mi marido/esposa o de mi madre si ellos firman una autorización?',
          clientPsychology: 'Clientes que no tienen cuenta propia, tienen cuenta embargada o prefieren no usar su cuenta.',
          exactAdvisorScript: 'Lamentablemente la legislación española de prevención del blanqueo de capitales (Ley 10/2010 SEPBLAC) lo prohíbe de forma taxativa. Aunque cuente con la autorización firmada de su familiar, los fondos solo pueden abonarse a una cuenta donde usted figure como titular. Si no dispone de cuenta a su nombre, hoy en día entidades como Openbank, BBVA o CaixaBank le permiten abrir una cuenta online gratuita en 5 minutos desde el móvil.',
          tips: 'Explicar que es una ley estatal obligatoria y no un capricho de la financiera.'
        },
        {
          id: 'c2-q3',
          question: 'Mi DNI está caducado pero tengo cita para renovarlo el mes que viene, ¿me lo aceptáis?',
          clientPsychology: 'Angustia de que se le deniegue el dinero por los retrasos de citas en la Policía Nacional.',
          exactAdvisorScript: '¡Por supuesto que sí, [Nombre]! Somos conscientes de las demoras en las citas de expedición. Si nos envía una foto de su DNI actual junto con el resguardo oficial en PDF de su cita previa de la Policía Nacional y un documento complementario (como su pasaporte en vigor o carné de conducir español), su expediente queda completamente validado.',
          tips: 'Dar una solución viable de inmediato genera una enorme lealtad en el cliente.'
        },
        {
          id: 'c2-q4',
          question: '¿Cómo saco el justificante de cuenta desde la app del banco? No sé cómo hacerlo.',
          clientPsychology: 'Dificultad tecnológica o brecha digital en personas mayores.',
          exactAdvisorScript: 'No se preocupe, le indico paso a paso. ¿Qué banco utiliza usted? [Esperar respuesta: ej. CaixaBank]. Perfecto: abra la app de CaixaBank, toque en su cuenta corriente, luego en los tres puntitos arriba a la derecha y verá una opción que dice "Compartir IBAN" o "Descargar justificante de titularidad". Si pulsa ahí, le saldrá un documento en PDF que me puede enviar directamente por este chat de WhatsApp.',
          tips: 'Ofrecerse a guiarlo en tiempo real por teléfono mientras el cliente opera en su app.'
        },
        {
          id: 'c2-q5',
          question: 'Soy extranjero con NIE comunitario y pasaporte, ¿tengo los mismos derechos de préstamo?',
          clientPsychology: 'Inseguridad sobre posibles trabas por su condición de ciudadano extranjero residente.',
          exactAdvisorScript: 'Absolutamente sí. Todos los ciudadanos con residencia legal acreditada en España, ya sea mediante NIE comunitario o tarjeta de residencia TIE, tienen exactamente los mismos derechos y condiciones que un ciudadano con DNI español. Solo necesitamos su NIE en vigor y su comprobante de residencia habitual en territorio español.',
          tips: 'Trato inclusivo, cordial y garantista de derechos de residencia.'
        }
      ],
      sampleDialogue: {
        whatsappCopy: `Hola, *[Nombre]*. 👋 Te escribe *${currentAdvisor.name}* de *INSTACREDIT*. 🇪🇸

He revisado tu documentación para el préstamo de *[Importe]*:

⚠️ Para poder transferirte el dinero por Bizum necesitamos un pequeño ajuste:
1️⃣ La foto de tu DNI/NIE debe mostrar las **4 esquinas completas** y verse con claridad en color.
2️⃣ El código IBAN debe ser de una **cuenta a tu nombre exclusivo** (Ley antiblanqueo SEPBLAC).

📱 Puedes adjuntármelo directamente respondiendo a este mensaje o a través de nuestro formulario fácil:
👉 [Enlace al Formulario de IBAN]

¡En cuanto lo recibamos, tu transferencia se emite de inmediato! 😊`,
        phoneScript: `"Hola [Nombre], le llama [Tu Nombre] de Instacredit. Estaba procesando la transferencia de sus [Importe] euros y quería pedirle un favor muy sencillo: la foto de su documento que nos llegó está algo borrosa y el sistema notarial requiere una imagen nítida para cotejar los datos. Además, necesitamos confirmar que el IBAN de [Banco] está a su nombre exclusivo. ¿Podría enviarme una foto rápida por WhatsApp para que pueda autorizar el envío de los fondos ahora mismo?"`
      }
    },

    // =========================================================================
    // CASO 3
    // =========================================================================
    {
      id: 'caso-3',
      caseNumber: 3,
      title: 'Aprobación, Firma del Pagaré Notarial eIDAS y Dudas de Cuotas',
      subtitle: 'Formalización del contrato, transparencia de costes, rúbrica digital y operativa de pago por Bizum',
      badge: 'CONTRATACIÓN • VALIDEZ JURÍDICA',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
      targetProfile: 'Cliente cuyo préstamo ha sido aprobado y tiene en pantalla el contrato/pagaré, pero duda antes de rubricar por miedo a la letra pequeña o no sabe cómo pagará sus cuotas.',
      legalNorm: 'Reglamento (UE) Nº 910/2014 (eIDAS) y Ley Cambiaria y del Cheque 19/1985',
      whatAdvisorMustKnow: {
        corePrinciples: [
          'El pagaré notarial en blanco con carta de instrucciones es un instrumento mercantil legal regulado por la Ley 19/1985 que respalda la operación crediticia.',
          'La firma electrónica avanzada bajo el Reglamento eIDAS tiene el mismo valor jurídico y probatorio que la firma ológrafa ante notario.',
          'Transparencia total de costes: Desglosar siempre TIN (1,95%), TAE (26,8%), aval de garantía FGA (10%) y gastos notariales fijos de custodia (18,50 €).',
          'La amortización anticipada está permitida en cualquier fecha con CERO comisión de cancelación anticipada (0% coste).'
        ],
        neverSay: [
          'NUNCA digas: "Usted firme eso rápido que es un trámite sin importancia". (Resta seriedad jurídica y genera desconfianza)',
          'NUNCA digas: "Si amortiza antes le cobraremos una penalización por intereses no devengados". (Falso por Ley 16/2011)',
          'NUNCA digas: "La cuota puede subir si sube el Euribor". (Nuestros micropréstamos son a tipo fijo transparente)'
        ],
        alwaysSay: [
          'SIEMPRE declara: "Su préstamo es a tipo fijo garantizado: su cuota jamás subirá ni tendrá sorpresas."',
          'SIEMPRE declara: "Puede rubricar directamente en la pantalla de su móvil con el dedo y validar con el SMS gratuito."',
          'SIEMPRE declara: "Le remitiremos el recordatorio 3 días antes de cada cuota con enlace directo de Bizum."'
        ],
        regulatoryFramework: 'Reglamento (UE) 910/2014 (eIDAS), Ley 19/1985 Cambiaria y del Cheque y Ley 16/2011 de Contratos de Crédito al Consumo.'
      },
      whatAdvisorMustDo: {
        phase1: {
          title: 'Fase 1: Notificación de la Aprobación (Minutos 0 - 5)',
          steps: [
            'Felicitar al cliente por la aprobación formal de su solicitud de crédito.',
            'Indicar la cuantía exacta aprobada y la cuota mensual final calculada.',
            'Remitir el enlace al visualizador del pagaré notarial eIDAS.'
          ]
        },
        phase2: {
          title: 'Fase 2: Explicación Transparente de la Firma Digital (Minutos 5 - 15)',
          steps: [
            'Desglosar el calendario de pagos pactado y las fechas de vencimiento.',
            'Guiar al cliente en la rúbrica sobre la pantalla táctil de su móvil o con el ratón.',
            'Indicar la introducción del código OTP de 6 dígitos recibido por SMS en su móvil.'
          ]
        },
        phase3: {
          title: 'Fase 3: Ejecución del Desembolso y Entrega del Contrato (Minutos 15 - 30)',
          steps: [
            'Confirmar la recepción del token criptográfico SHA-256 en el panel.',
            'Avanzar el estado del expediente en el sistema a "Desembolsado".',
            'Remitir al cliente el comprobante de transferencia y la copia del contrato en PDF.'
          ]
        },
        printableChecklist: [
          'El cliente ha visualizado el importe aprobado y el desglose de cuotas.',
          'Se ha explicado la modalidad de pago mensual preferida (Bizum o SEPA).',
          'La rúbrica en pantalla ha quedado guardada con token eIDAS válido.',
          'Se ha acreditado el saldo en la Cuenta Digital IBAN del cliente.',
          'Se ha enviado copia oficial del contrato de 4 páginas y comprobante al cliente.'
        ]
      },
      qaList: [
        {
          id: 'c3-q1',
          question: '¿Qué es exactamente un pagaré notarial y por qué debo rubricarlo en pantalla?',
          clientPsychology: 'Miedo a firmar algo que pueda comprometer sus bienes personales o vivienda.',
          exactAdvisorScript: 'El pagaré notarial es el documento mercantil regulado por la Ley Cambiaria española que formaliza el préstamo y protege sus derechos como consumidor. Firmarlo en pantalla mediante la tecnología cualificada eIDAS tiene exactamente el mismo valor legal que firmar en papel ante un notario. En él se fija con total transparencia que usted solo responde por la cuantía convenida de [Importe] euros más los intereses pactados, sin ninguna cláusula abusiva.',
          tips: 'Transmitir serenidad jurídica y explicar que el contrato fija un límite exacto de deuda.'
        },
        {
          id: 'c3-q2',
          question: '¿Si decido pagar la totalidad del préstamo antes de la fecha me ahorro intereses?',
          clientPsychology: 'Clientes que esperan un cobro o nómina y quieren saldar la deuda cuanto antes para no pagar de más.',
          exactAdvisorScript: '¡Por supuesto que sí, [Nombre]! En Instacredit España fomentamos la salud financiera: puede liquidar anticipadamente la totalidad o parte de su préstamo en el momento que lo desee con un 0% de penalización por amortización anticipada. Solo se computarán los intereses devengados hasta el día exacto en que realice el pago por Bizum o transferencia.',
          tips: 'Destacar el 0% de penalización como ventaja competitiva frente a la banca tradicional.'
        },
        {
          id: 'c3-q3',
          question: '¿Cómo y cuándo tengo que pagar mi cuota para no despistarme?',
          clientPsychology: 'Miedo a descuidos, retrasos involuntarios o cargos sorpresa.',
          exactAdvisorScript: 'Se lo ponemos muy fácil: 3 días antes de la fecha de vencimiento, nuestro sistema le enviará un recordatorio automático por SMS y WhatsApp con el importe exacto y un botón de Bizum. Bastará con pulsar ese enlace y confirmar el pago en la app de su banco en 10 segundos. Si lo prefiere, también puede domiciliar el recibo para que se cargue automáticamente en su cuenta corriente.',
          tips: 'Enfatizar los recordatorios preventivos para transmitir acompañamiento.'
        },
        {
          id: 'c3-q4',
          question: '¿Qué ocurre si el día pactado de cobro coincide con sábado, domingo o festivo?',
          clientPsychology: 'Temor a que le apliquen intereses de mora por un festivo bancario.',
          exactAdvisorScript: 'Conforme a la normativa del Banco de España y el Código Civil, cuando una fecha de vencimiento cae en fin de semana o festivo nacional/autonómico, el plazo se traslada de pleno derecho al siguiente día hábil laborable. No se le aplicará ningún recargo ni penalización por este motivo.',
          tips: 'Citar la norma civil de traslación de vencimientos da máxima tranquilidad.'
        },
        {
          id: 'c3-q5',
          question: '¿Dónde puedo ver mi contrato y descargar mis justificantes de pago?',
          clientPsychology: 'Necesidad de conservar justificantes oficiales para su contabilidad personal.',
          exactAdvisorScript: 'En su Área de Clientes y Portal de Cuenta Digital IBAN tiene disponible en todo momento el contrato completo de 4 páginas con firma notarial eIDAS, la tabla de amortización y los justificantes de cada pago en formato PDF oficial con sello de tiempo criptográfico.',
          tips: 'Recordar que los documentos son descargables 24/7 en formato PDF.'
        }
      ],
      sampleDialogue: {
        whatsappCopy: `¡Enhorabuena, *[Nombre]*! 🎉 Tu micropréstamo de *[Importe]* ha sido **APROBADO** formalmente por el comité de riesgos.

📋 *Condiciones Oficiales Aprobadas:*
• Capital: *[Importe]*
• Cuota pactada: *[Cuota Mensual]/mes*
• Plazo: *[Plazo]*
• Tipo: Tipo Fijo Garantizado (TIN 1,95% • TAE 26,8%)

✍️ Para que podamos emitir tu dinero de inmediato por Bizum, formaliza tu rúbrica digital protegida eIDAS en este enlace seguro:
👉 [Enlace a Firma de Pagaré eIDAS]

¡Quedo pendiente de tu confirmación para notificarte la transferencia al instante! 🚀`,
        phoneScript: `"¡Buenas noticias, [Nombre]! Le llama [Tu Nombre] de Instacredit para confirmarle que su solicitud de [Importe] euros ha sido aprobada con éxito. Su cuota mensual queda fijada en [Cuota] euros a tipo fijo garantizado. Le he remitido el enlace seguro a su móvil para que pueda rubricar el pagaré en la pantalla de su teléfono. Es un proceso de apenas un minuto y, en cuanto registre su firma, emito la orden de Bizum para que disponga de sus fondos hoy mismo. ¿Le parece bien que lo revisemos juntos?"`
      }
    },

    // =========================================================================
    // CASO 4
    // =========================================================================
    {
      id: 'caso-4',
      caseNumber: 4,
      title: 'Alivio Financiero, Solicitud de Prórroga y Prevención de Mora',
      subtitle: 'Protocolo de empatía ante dificultades de pago, prórroga ética a 15, 30 o 45 días y política Cero Acoso',
      badge: 'FIDELIZACIÓN • ALIVIO Y REFINANCIACIÓN',
      badgeColor: 'bg-purple-100 text-purple-950 border-purple-300',
      targetProfile: 'Cliente que se pone en contacto porque no podrá hacer frente al pago en la fecha límite pactada debido a retraso de nómina, gastos imprevistos de salud o avería de vehículo.',
      legalNorm: 'Código de Buenas Prácticas Financieras de Instacredit y Ley 16/2011',
      whatAdvisorMustKnow: {
        corePrinciples: [
          'Política Institucional de "CERO ACOSO Y TRATO HUMANO": Queda terminantemente prohibido amenazar, presionar o elevar el tono de voz ante un cliente con dificultades de liquidez.',
          'Disponemos de prórroga formal de +15, +30 o +45 días adicionales que paraliza de inmediato cualquier gestión de cobro.',
          'Al solicitar y abonar la tasa regulada de prórroga (desde 15 €), el cliente preserva su historial crediticio con calificación positiva y NO es reportado a ASNEF ni EXPERIAN.',
          'Un cliente que avisa de una dificultad de pago debe ser tratado como un cliente honesto y valioso, no como un deudor moroso.'
        ],
        neverSay: [
          'NUNCA digas: "Si no paga hoy le meteremos en ASNEF y le embargaremos la nómina mañana". (Ilegal, abusivo y prohibido)',
          'NUNCA digas: "A nosotros no nos importan sus problemas personales, consiga el dinero como sea". (Vulnera el código ético)',
          'NUNCA digas: "Ya no tiene solución, su expediente pasará a un departamento contencioso". (Destruye la relación con el cliente)'
        ],
        alwaysSay: [
          'SIEMPRE declara: "Muchas gracias por comunicarse con antelación. Demuestra una gran responsabilidad y estamos aquí para ayudarle."',
          'SIEMPRE declara: "Quédese tranquilo(a): con nuestra prórroga formal su historial crediticio queda 100% protegido."',
          'SIEMPRE declara: "Podemos ampliar su fecha 15, 30 o 45 días por una tasa mínima para que se recupere sin estrés."'
        ],
        regulatoryFramework: 'Código de Buenas Prácticas Financieras, Circular 5/2012 del Banco de España y Ley 16/2011 de Crédito al Consumo.'
      },
      whatAdvisorMustDo: {
        phase1: {
          title: 'Fase 1: Escucha Empática y Desactivación de la Angustia (Minutos 0 - 5)',
          steps: [
            'Agradecer al cliente que se haya puesto en contacto antes del vencimiento.',
            'Escuchar la causa del imprevisto sin interrumpir ni juzgar su situación personal.',
            'Transmitirle calma absoluta: confirmar que no habrá acoso ni recargos usureros.'
          ]
        },
        phase2: {
          title: 'Fase 2: Presentación de Opciones de Alivio (+15, +30 o +45 Días) (Minutos 5 - 15)',
          steps: [
            'Calcular la nueva fecha de vencimiento proyectada según la fecha en que cobrará su nómina.',
            'Informar de la tasa administrativa reducida de gestión de prórroga.',
            'Enviar el Formulario Didáctico de Prórroga por WhatsApp para confirmación en 1 clic.'
          ]
        },
        phase3: {
          title: 'Fase 3: Formalización y Emisión del Comprobante de Extensión (Minutos 15 - 30)',
          steps: [
            'Registrar en el sistema la prórroga concedida y actualizar la fecha de vencimiento.',
            'Emitir el nuevo certificado oficial de prórroga en PDF y remitírselo al cliente.',
            'Registrar en bitácora: "Prórroga acordada cordialmente conforme a Código de Buenas Prácticas".'
          ]
        },
        printableChecklist: [
          'Se ha escuchado la causa del retraso con empatía y respeto.',
          'Se ha verificado la nueva fecha de cobro de ingresos del cliente.',
          'Se ha seleccionado el plazo de prórroga óptimo (+15, +30 o +45 días).',
          'Se ha emitido el compromiso formal de aplazamiento sin penalización de mora.',
          'El expediente se mantiene en cumplimiento positivo sin reporte negativo.'
        ]
      },
      qaList: [
        {
          id: 'c4-q1',
          question: 'Se me ha retrasado la nómina y no podré pagar en la fecha, ¿me van a demandar o meter en ASNEF?',
          clientPsychology: 'Pánico a ser incluido en listas negras de morosidad o recibir cartas judiciales amenazantes.',
          exactAdvisorScript: 'Le agradezco enormemente que nos haya avisado con tiempo, [Nombre]. Quédese con la absoluta tranquilidad de que en Instacredit no amenazamos ni acosamos a nuestros clientes. Comprendemos perfectamente que los imprevistos ocurren. Al comunicarse con nosotros antes de la fecha, activamos su prórroga formal: esto paraliza cualquier acción de cobro y mantiene su expediente crediticio 100% limpio y protegido, sin ningún reporte negativo a ficheros de solvencia.',
          tips: 'Agradecer la comunicación con tiempo transforma la angustia del cliente en agradecimiento.'
        },
        {
          id: 'c4-q2',
          question: '¿Cuánto cuesta solicitar una prórroga y cuántos días adicionales me podéis conceder?',
          clientPsychology: 'Miedo a que la prórroga tenga un coste desorbitado o inasumible.',
          exactAdvisorScript: 'Disponemos de tres plazos flexibles de aplazamiento: 15, 30 o 45 días adicionales. La gestión tiene una tasa administrativa reducida y transparente fijada desde solo 15 euros, sin comisiones de mora ocultas ni penalizaciones abusivas. De este modo, traslada su fecha al día que mejor le convenga según el cobro de sus ingresos.',
          tips: 'Desglosar el coste como una tasa administrativa accesible.'
        },
        {
          id: 'c4-q3',
          question: '¿Puedo pagar una parte de lo que tenga ahorrado hoy y aplazar solamente el resto?',
          clientPsychology: 'Voluntad de pago genuina pero fondos insuficientes para la cuota completa.',
          exactAdvisorScript: '¡Por supuesto que sí, [Nombre], es una magnífica opción! Puede realizar hoy mismo una entrega a cuenta por Bizum de la cantidad que tenga disponible. Eso reducirá de inmediato el capital pendiente y calcularemos la prórroga únicamente sobre el saldo restante, lo que hará que su cuota final sea mucho más cómoda y económica.',
          tips: 'Aceptar pagos parciales demuestra flexibilidad real y reduce el riesgo de impago.'
        },
        {
          id: 'c4-q4',
          question: '¿Qué diferencia hay entre pedir una prórroga y simplemente dejar pasar los días sin pagar?',
          clientPsychology: 'Duda sobre si realmente vale la pena hacer el trámite de extensión.',
          exactAdvisorScript: 'La diferencia es total: si no se solicita prórroga, el sistema automatizado computa un impago al vencimiento y se envían notificaciones formales. En cambio, al activar la prórroga formal, su préstamo continúa en estado de CUMPLIMIENTO POSITIVO, no se generan intereses de mora abusivos y su reputación crediticia se mantiene impecable para futuros créditos.',
          tips: 'Explicar la diferencia entre "morosidad no comunicada" y "prórroga pactada".'
        },
        {
          id: 'c4-q5',
          question: '¿Si solicito una prórroga podré volver a pedir otro crédito con vosotros cuando lo termine de pagar?',
          clientPsychology: 'Miedo a quedar "marcado" internamente y no volver a recibir financiación.',
          exactAdvisorScript: '¡Rotundamente sí! En INSTACREDIT valoramos a los clientes honestos que gestionan sus dificultades con comunicación y responsabilidad. Los clientes que utilizan el sistema de prórrogas y liquidan su compromiso mantienen su cupo de cliente preferente abierto e incluso pueden optar a ampliaciones de límite crediticio en su siguiente solicitud.',
          tips: 'Reforzar que la prórroga no penaliza el cupo futuro.'
        }
      ],
      sampleDialogue: {
        whatsappCopy: `Hola, *[Nombre]*. 👋 Te escribe *${currentAdvisor.name}*, tu asesor en *INSTACREDIT*. 🇪🇸

Muchas gracias por avisarme con antelación sobre tu imprevisto. Demuestra una gran responsabilidad por tu parte. 🤝

🛡️ *Quédate con total tranquilidad:* En Instacredit no acosamos ni aplicamos penalizaciones abusivas. Vamos a activar tu **Prórroga Formal de Alivio**:
• Días adicionales disponibles: *+15, +30 o +45 días*
• Tu expediente se mantiene en **CUMPLIMIENTO POSITIVO** sin reportes a ASNEF.
• Nueva fecha sugerida: *[Nueva Fecha]*

Confírmame cuántos días extra necesitas respondiendo a este mensaje o a través de este enlace:
👉 [Enlace a Solicitud de Prórroga]

¡Estamos aquí para ayudarte a superar cualquier bache sin estrés! 😊`,
        phoneScript: `"Hola [Nombre], entiendo perfectamente su situación y lo primero que quiero es que respire tranquilo(a). En Instacredit no somos un banco tradicional que sanciona a sus clientes cuando tienen un imprevisto. Le agradezco que me haya llamado para avisar. Disponemos de un sistema de prórroga a 15, 30 o 45 días que congela cualquier aviso y traslada su vencimiento a la fecha en que cobre su dinero. ¿Qué día le viene mejor a usted para reprogramarlo sin agobios?"`
      }
    }
  ];

  const casesToRender = viewMode === 'all' ? HANDBOOK_CASES : [HANDBOOK_CASES[activeCaseIndex]];

  return (
    <div className="space-y-6">
      {/* Print-specific style tags */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 10mm 12mm;
              }
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background: white !important;
                color: black !important;
              }
              .print-break-before {
                page-break-before: always !important;
                break-before: page !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `
        }}
      />

      {/* ========================================================================= */}
      {/* SCREEN / PRINT DUAL HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1B3D] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/60 relative overflow-hidden print:bg-white print:text-black print:border-b-2 print:border-black print:rounded-none print:p-4 print:shadow-none">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 print:border-black print:text-black">
                <BookOpen className="w-3.5 h-3.5" />
                Material Oficial de Formación & Operaciones 2026
              </span>
              <span className="bg-white/10 text-xs font-semibold px-2 py-0.5 rounded-full text-slate-200 print:text-black">
                Supervisión Banco de España • Circular 5/2012
              </span>
              <span className="text-[10px] text-blue-300 font-mono hidden sm:inline print:hidden">
                NIF: {platformConfig.companyNif}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight print:text-2xl">
              Libretos Oficiales de Asesoría: 4 Casos Críticos
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed print:text-xs print:text-slate-800">
              Manual operativo completo con todo lo que el asesor <strong>DEBE SABER</strong> y <strong>DEBE HACER</strong> en cada situación, protocolos paso a paso, diálogos textuales y batería exhaustiva de Preguntas & Respuestas reales para entregar e imprimir.
            </p>

            {/* Recipient Advisor Picker (Screen Only) */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs print:hidden">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#00E599]" />
                Asesor Destinatario de Entrega:
              </span>
              <select
                value={targetAdvisorName}
                onChange={(e) => setTargetAdvisorName(e.target.value)}
                className="bg-blue-900/60 border border-blue-700 text-white rounded-xl px-3 py-1 font-bold focus:ring-2 focus:ring-[#00E599] cursor-pointer"
              >
                {advisorsList.map((adv) => (
                  <option key={adv.id} value={adv.name} className="bg-[#0B1B3D] text-white">
                    {adv.name} ({adv.id} - {adv.roleTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons (Hidden during printing) */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0 print:hidden">
            <button
              onClick={handlePrintFullManual}
              className="px-5 py-3 bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              title="Prepara e imprime los 4 casos completos en formato A4 listo para encuadernar o entregar"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ Imprimir Dossier Completo (4 Casos A4)</span>
            </button>

            <button
              onClick={handlePrintCurrentCase}
              className="px-5 py-2.5 bg-blue-900/60 hover:bg-blue-800 text-white font-bold text-xs rounded-xl border border-blue-700/60 transition flex items-center justify-center gap-2 cursor-pointer"
              title="Imprime únicamente la ficha del caso seleccionado"
            >
              <Download className="w-3.5 h-3.5 text-blue-300" />
              <span>Imprimir Solo Caso {activeCaseIndex + 1}</span>
            </button>

            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-blue-950/80 p-1 border border-blue-800/60">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg transition ${
                  viewMode === 'all' ? 'bg-[#0066FF] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Ver Todos (Dossier)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg transition ${
                  viewMode === 'single' ? 'bg-[#0066FF] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Ver por Ficha
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE SELECTOR TABS (Screen Only) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print:hidden">
        {HANDBOOK_CASES.map((item, idx) => {
          const isSelected = viewMode === 'single' && idx === activeCaseIndex;
          return (
            <div
              key={item.id}
              onClick={() => {
                setActiveCaseIndex(idx);
                setViewMode('single');
                setSearchFilter('');
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/20'
                  : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    CASO {item.caseNumber}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {item.qaList.length} P&R Clave
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#0B1B3D] leading-snug">
                  {item.title}
                </h4>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search and Expand all bar (Screen only) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar por palabra clave en preguntas o respuestas (ej. anticipo, ASNEF, IBAN, prórroga)..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0066FF]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={expandAllQA}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-bold text-xs rounded-xl transition"
          >
            Desplegar Todas las P&R
          </button>
          <button
            onClick={collapseAllQA}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
          >
            Plegar
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASES RENDER LOOP (Screen Interactive + Print Paginated) */}
      {/* ========================================================================= */}
      <div className="space-y-10">
        {casesToRender.map((caseItem, caseIndex) => {
          const filteredQA = caseItem.qaList.filter(
            (q) =>
              q.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
              q.exactAdvisorScript.toLowerCase().includes(searchFilter.toLowerCase())
          );

          return (
            <div
              key={caseItem.id}
              className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 print:border-none print:shadow-none print:p-0 ${
                caseIndex > 0 ? 'print-break-before' : ''
              }`}
            >
              {/* Case Title Banner */}
              <div className="border-b border-slate-200 pb-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${caseItem.badgeColor}`}>
                      CASO {caseItem.caseNumber} • {caseItem.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                      Normativa: {caseItem.legalNorm}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 print:text-black">
                    Manual Asignado: <strong>{targetAdvisorName}</strong> • Instacredit España
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#0B1B3D]">
                  {caseItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {caseItem.subtitle}
                </p>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                  <strong>Perfil del Cliente y Escenario:</strong> {caseItem.targetProfile}
                </div>
              </div>

              {/* SECTION 1: QUÉ DEBE SABER EL ASESOR */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#0B1B3D] uppercase tracking-wide">
                    ¿Qué DEBE SABER el Asesor en este Caso? (Conocimiento Obligatorio)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                    <span className="text-xs font-black text-[#0066FF] uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Principios Inquebrantables de la Entidad
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                      {caseItem.whatAdvisorMustKnow.corePrinciples.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    {/* Never Say */}
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl space-y-1 text-red-950">
                      <span className="text-xs font-black text-red-700 uppercase flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Lo que NUNCA debe decir el asesor (Faltas Graves)
                      </span>
                      <ul className="text-[11px] text-red-900 space-y-1 list-disc pl-4 leading-snug">
                        {caseItem.whatAdvisorMustKnow.neverSay.map((ns, i) => (
                          <li key={i}>{ns}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Always Say */}
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-emerald-950">
                      <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Lo que SIEMPRE debe declarar el asesor (Afirmaciones Clave)
                      </span>
                      <ul className="text-[11px] text-emerald-900 space-y-1 list-disc pl-4 leading-snug">
                        {caseItem.whatAdvisorMustKnow.alwaysSay.map((as, i) => (
                          <li key={i}>{as}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: QUÉ DEBE HACER EL ASESOR */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#0B1B3D] uppercase tracking-wide">
                    ¿Qué DEBE HACER el Asesor? (Protocolo Cronológico Paso a Paso)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Phase 1 */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-xs font-black text-[#0B1B3D] uppercase block">
                      {caseItem.whatAdvisorMustDo.phase1.title}
                    </span>
                    <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
                      {caseItem.whatAdvisorMustDo.phase1.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Phase 2 */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-xs font-black text-[#0B1B3D] uppercase block">
                      {caseItem.whatAdvisorMustDo.phase2.title}
                    </span>
                    <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
                      {caseItem.whatAdvisorMustDo.phase2.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-xs font-black text-[#0B1B3D] uppercase block">
                      {caseItem.whatAdvisorMustDo.phase3.title}
                    </span>
                    <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
                      {caseItem.whatAdvisorMustDo.phase3.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Printable Checklist */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                  <span className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-amber-700" />
                    Checklist de Control Operativo (Para marcar con bolígrafo al tramitar el caso)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950 font-medium">
                    {caseItem.whatAdvisorMustDo.printableChecklist.map((ch, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/70 p-2 rounded-xl border border-amber-200">
                        <div className="w-4 h-4 border-2 border-amber-700 rounded-sm shrink-0 bg-white" />
                        <span className="leading-tight">{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: GUIONES MODELO (WHATSAPP & LLAMADA) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#0B1B3D] uppercase tracking-wide">
                    Guiones Textuales Modelo (Llamada y WhatsApp)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div className="p-4 bg-[#0B141A] text-white rounded-2xl space-y-2 font-sans border border-slate-700 print:bg-slate-900">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-bold border-b border-slate-800 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" /> Mensaje Oficial de WhatsApp
                      </span>
                      <div className="flex items-center gap-2 print:hidden">
                        <button
                          type="button"
                          onClick={() => handleCopyText(`${caseItem.id}-wa`, caseItem.sampleDialogue.whatsappCopy)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === `${caseItem.id}-wa` ? '¡Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
                      {caseItem.sampleDialogue.whatsappCopy}
                    </pre>
                  </div>

                  {/* Phone Script */}
                  <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#0B1B3D] font-bold border-b border-slate-200 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-[#0066FF]" /> Guion de Llamada Telefónica Oficial
                      </span>
                      <div className="flex items-center gap-2 print:hidden">
                        <button
                          type="button"
                          onClick={() => speakText(`${caseItem.id}-phone`, caseItem.sampleDialogue.phoneScript)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                            speakingId === `${caseItem.id}-phone`
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-blue-100 text-[#0066FF] hover:bg-blue-200'
                          }`}
                        >
                          {speakingId === `${caseItem.id}-phone` ? (
                            <>
                              <VolumeX className="w-3 h-3" />
                              <span>Detener Voz</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>🔊 Escuchar Entonación</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      {caseItem.sampleDialogue.phoneScript}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: BATERÍA COMPLETA DE PREGUNTAS Y RESPUESTAS (Q&A) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-[#0B1B3D] uppercase tracking-wide">
                      Batería de Preguntas & Respuestas Textuales para Asesores (FAQ)
                    </h4>
                  </div>
                  {speakingId && (
                    <button
                      type="button"
                      onClick={stopSpeech}
                      className="px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 print:hidden cursor-pointer"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Detener Locución Activa</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {filteredQA.map((qa, index) => {
                    const isExpanded = expandedQA[qa.id] ?? true;
                    return (
                      <div
                        key={qa.id}
                        className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs print:border-slate-300 print:shadow-none"
                      >
                        {/* Question header */}
                        <div
                          onClick={() => toggleQA(qa.id)}
                          className="p-4 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer flex items-center justify-between gap-3 print:bg-white print:p-2"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 print:bg-slate-900">
                              {index + 1}
                            </span>
                            <h5 className="text-sm font-bold text-[#0B1B3D] leading-snug">
                              {qa.question}
                            </h5>
                          </div>
                          <div className="shrink-0 text-slate-400 print:hidden">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>

                        {/* Answer Body */}
                        {isExpanded && (
                          <div className="p-4 sm:p-5 border-t border-slate-200 space-y-3 print:p-3 print:border-t">
                            {/* Psychology Behind Question */}
                            <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-2">
                              <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                              <div>
                                <strong>Psicología & Temor del Cliente:</strong> {qa.clientPsychology}
                              </div>
                            </div>

                            {/* Exact Script to Speak */}
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider block">
                                  Respuesta Exacta Palabra por Palabra (Qué debe decir el asesor):
                                </span>
                                <div className="flex items-center gap-2 print:hidden">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      speakText(
                                        qa.id,
                                        `Pregunta del cliente: ${qa.question}. Respuesta oficial del asesor: ${qa.exactAdvisorScript}`
                                      )
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                      speakingId === qa.id
                                        ? 'bg-red-600 text-white animate-pulse'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    }`}
                                  >
                                    {speakingId === qa.id ? (
                                      <>
                                        <VolumeX className="w-3 h-3" />
                                        <span>Detener</span>
                                      </>
                                    ) : (
                                      <>
                                        <Volume2 className="w-3 h-3" />
                                        <span>🔊 Escuchar Respuesta</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleCopyText(qa.id, qa.exactAdvisorScript)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>{copiedId === qa.id ? '¡Copiado!' : 'Copiar Texto'}</span>
                                  </button>
                                </div>
                              </div>
                              <div className="p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                                &ldquo;{qa.exactAdvisorScript}&rdquo;
                              </div>
                            </div>

                            {/* Tips */}
                            <div className="text-[11px] text-slate-500 italic flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span><strong>Consejo de Ejecución:</strong> {qa.tips}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SIGN-OFF & PHYSICAL HANDOVER RECEIPT (For Printing) */}
              <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 print:mt-10 print:border-t-2 print:border-black space-y-4">
                <div className="flex items-center justify-between text-xs font-black uppercase text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4 text-[#0066FF]" />
                    Acuse de Recibo y Compromiso Ético del Asesor (Firma de Entrega Física)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">INSTACREDIT-ES-SOP-CASO-{caseItem.caseNumber}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Por la presente, el/la asesor(a) abajo firmante declara haber recibido copia íntegra y comprensible del libreto para el <strong>Caso {caseItem.caseNumber}: {caseItem.title}</strong>, comprometiéndose a aplicar con rigor los protocolos de atención, las reglas de cero cobros previos y el código de buenas prácticas supervisado por el Banco de España.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 print:bg-white print:border-black">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Nombre Completo del Asesor:</span>
                    <span className="font-bold text-slate-900 block mt-1">{targetAdvisorName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">Dpto. Atención al Cliente</span>
                  </div>

                  <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 print:bg-white print:border-black">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Fecha de Entrega Física:</span>
                    <span className="font-bold text-slate-900 block mt-1">
                      {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold">Entrega Certificada</span>
                  </div>

                  <div className="border-2 border-dashed border-slate-400 rounded-xl p-3 bg-white print:border-black min-h-[70px] flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Firma Manuscrita del Asesor:</span>
                    <div className="border-b border-slate-400 mt-6 print:mt-10" />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
