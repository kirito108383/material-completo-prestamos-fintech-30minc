import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditApplication, DocumentType, LoanStatus } from '../../types';
import { formatEUR } from '../../utils/financialCalculations';
import {
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  MessageCircle,
  PhoneCall,
  Mail,
  Smartphone,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Send,
  FileText,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Play,
  Award,
  Compass,
  Layers,
  Bot
} from 'lucide-react';

export type GlossaryCategory =
  | 'todos'
  | 'conceptos_basicos'
  | 'documentos_bancos'
  | 'dudas_clientes'
  | 'leyes_espana'
  | 'botones_sistema';

export interface SmartGlossaryItem {
  id: string;
  termTitle: string;
  shortTag: string;
  category: GlossaryCategory;
  searchKeywords: string[];
  questionTriggers: string[];
  // 1. Explicación ultra sencilla para un empleado que no sabe nada
  zeroKnowledgeExplanation: string;
  realWorldComparison: string;
  // 2. Lo que el asesor debe hacer y no hacer
  whatAdvisorMustDoStepByStep: string[];
  neverDoWarning: string;
  // 3. Lo que el asesor debe decir y enviar (Plantillas automáticas)
  buildSpokenAnswerForClient: (p: GlossaryClientParams) => string;
  buildWhatsAppReadyMessage: (p: GlossaryClientParams) => string;
  buildSmsReadyMessage: (p: GlossaryClientParams) => string;
  buildAutoBitacoraSummary: (p: GlossaryClientParams) => string;
  // 4. Acción automática del sistema ("Hazlo por mí")
  autoActionLabel: string;
  autoActionDescription: string;
  suggestedStatusChange?: LoanStatus;
  suggestedDocModal?: DocumentType;
  opensVoiceForm?: boolean;
}

export interface GlossaryClientParams {
  clientName: string;
  clientFirstName: string;
  clientPhone: string;
  clientEmail: string;
  capitalAmount: string;
  monthlyQuota: string;
  termMonths: number;
  radicadoId: string;
  digitalIban: string;
  dueDate: string;
  advisorName: string;
  portalUrl: string;
}

export const SMART_GLOSSARY_ITEMS: SmartGlossaryItem[] = [
  {
    id: 'glos-recorrido-30min-cuenta',
    termTitle: '¿Cómo funciona el Proceso en 30 Minutos y el Depósito en la Cuenta Creada? (Regla #1)',
    shortTag: 'Duda Frecuente #1',
    category: 'dudas_clientes',
    searchKeywords: ['proceso', '30 minutos', 'cuenta', 'deposito', 'cuestionario', 'url', 'como funciona', 'pasos', 'seguro'],
    questionTriggers: [
      '¿Cómo recibo el dinero en mi cuenta en 30 minutos?',
      '¿Para qué sirven los enlaces o cuestionarios URL que me envías?',
      '¿Dónde me depositan el préstamo una vez aprobado?'
    ],
    zeroKnowledgeExplanation:
      'En INSTACREDIT España el cliente va configurando y verificando su Cuenta Digital a medida que llena cada cuestionario URL que le enviamos por WhatsApp (Formulario 1 de Solicitud, Formulario 2 de IBAN y Formulario 3 de Firma). Una vez completado todo en menos de 30 minutos, el sistema deposita el monto solicitado en esa cuenta creada.',
    realWorldComparison:
      'Es como hacer el check-in online de un vuelo en 3 pantallas: al terminar el último paso, ya tienes tu tarjeta de embarque y tu dinero depositado listo para retirar por SEPA o Bizum.',
    whatAdvisorMustDoStepByStep: [
      '1. Explícale al cliente con entusiasmo: "A medida que vas llenando cada enlace de cuestionario, tu cuenta queda creada y verificada para recibir el depósito en menos de 30 minutos".',
      '2. Pulsa el botón verde "⚡ Hazlo Todo por Mí" de abajo para mandarle por WhatsApp la Ruta Oficial de 30 Minutos con su enlace directo y anotarlo en su expediente.'
    ],
    neverDoWarning:
      'NUNCA dejes al cliente sin su enlace directo correspondiente a la etapa en la que se encuentra.',
    buildSpokenAnswerForClient: (p) =>
      `"Es sumamente ágil, ${p.clientFirstName}. En INSTACREDIT España hacemos todo el proceso en menos de 30 minutos. A medida que usted va completando cada cuestionario desde el enlace que le envío por WhatsApp, el sistema va creando y verificando su cuenta digital asignada. En cuanto firma su contrato desde el móvil, sus ${p.capitalAmount} quedan depositados de inmediato en su cuenta para que disponga de ellos por transferencia SEPA instantánea o Bizum."`,
    buildWhatsAppReadyMessage: (p) =>
      `⚡ *RECORRIDO OFICIAL EN 30 MINUTOS Y DEPÓSITO EN TU CUENTA — INSTACREDIT ESPAÑA*\n\n` +
      `Hola *${p.clientFirstName}*, soy tu asesor *${p.advisorName}*. Así de fácil recibes tus *${p.capitalAmount}* del expediente *${p.radicadoId}*:\n\n` +
      `✅ *1. Cuestionarios por Enlace (URL):* Por cada formulario rápido que completas, tu cuenta digital (\`${p.digitalIban}\`) queda configurada.\n` +
      `✅ *2. Depósito Directo:* Una vez completado todo el recorrido, se te depositan tus *${p.capitalAmount}* según lo solicitado.\n` +
      `✅ *3. Respaldo Legal:* Entidad española con NIF B-87942105 sujeta a la Ley 16/2011.\n\n` +
      `👉 *Avanza tu cuestionario oficial aquí:*\n${p.portalUrl}`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT (NIF B87942105): ${p.clientFirstName}, completa tu cuestionario para recibir el deposito de ${p.capitalAmount} (Exp. ${p.radicadoId}) en 30 min: ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se explicó el recorrido de 30 minutos y depósito en cuenta creada a ${p.clientName} y se envió enlace por WhatsApp.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Enviar Ruta 30 Minutos + Registrar Bitácora',
    autoActionDescription:
      'Abre el WhatsApp del cliente con la explicación del recorrido de 30 minutos y depósito en cuenta creada, y guarda la nota en su expediente.'
  },
  {
    id: 'glos-iban-sepblac',
    termTitle: 'IBAN / Titularidad Bancaria y Ley SEPBLAC',
    shortTag: 'Concepto Bancario',
    category: 'documentos_bancos',
    searchKeywords: ['iban', 'cuenta', 'banco', 'sepblac', 'mujer', 'marido', 'hijo', 'hermano', 'familiar', 'titular'],
    questionTriggers: [
      '¿Qué es el IBAN?',
      '¿Puedo poner la cuenta bancaria de mi mujer, marido o hijo?',
      '¿Por qué me pedís certificado de titularidad?'
    ],
    zeroKnowledgeExplanation:
      'El IBAN es el número largo de la cuenta del banco en España (empieza por ES y tiene 24 caracteres). Por la ley española contra el blanqueo de dinero (SEPBLAC), el préstamo SOLO se puede ingresar en una cuenta donde el propio cliente sea el dueño titular.',
    realWorldComparison:
      'Es como el DNI del banco: no puedes cobrar un cheque nominal a tu nombre en la cuenta de un vecino o familiar.',
    whatAdvisorMustDoStepByStep: [
      '1. Revisa que la cuenta empiece por ES y que el titular sea exactamente el mismo cliente.',
      '2. Si el cliente quiere usar la cuenta de un familiar, dile amablemente que la ley lo prohíbe y que puede abrir una cuenta online gratuita a su nombre en 5 minutos (BBVA, Imagin, Openbank).',
      '3. Pulsa "⚡ Hazlo Todo por Mí" para enviarle la instrucción de IBAN y el Formulario con Voz.'
    ],
    neverDoWarning:
      'PROHIBIDO aceptar cuentas de esposos, hijos, padres o amigos aunque tengan el mismo apellido.',
    buildSpokenAnswerForClient: (p) =>
      `"${p.clientFirstName}, el código IBAN es el número de su cuenta bancaria en España que empieza por las letras ES. Por la Ley 10/2010 de prevención de blanqueo de capitales (SEPBLAC), estamos obligados a transferir los ${p.capitalAmount} únicamente a una cuenta donde usted figure como titular. Si no tiene una a mano, puede abrir una cuenta online gratuita a su nombre en 5 minutos desde el móvil."`,
    buildWhatsAppReadyMessage: (p) =>
      `🏦 *VERIFICACIÓN DE CUENTA BANCARIA IBAN (NORMATIVA SEPBLAC)*\n\n` +
      `Hola *${p.clientFirstName}*, te escribe *${p.advisorName}* de INSTACREDIT España.\n\n` +
      `Para transferir tus *${p.capitalAmount}* del expediente *${p.radicadoId}*, recuerda que por la *Ley 10/2010 (SEPBLAC)* la cuenta bancaria IBAN (*ES...*) debe estar *exclusivamente a tu nombre como titular*.\n\n` +
      `📌 *¿Cómo enviarnos tu justificante de titularidad?*\n` +
      `• Haz una captura en la App de tu banco donde se vea tu nombre y tu número IBAN, o descárgalo en PDF.\n` +
      `• Envíamelo por aquí o súbelo con ayuda por voz en:\n${p.portalUrl}`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT: ${p.clientFirstName}, recuerda que para ingresar tus ${p.capitalAmount} (Exp. ${p.radicadoId}) el IBAN debe estar a tu nombre (Ley SEPBLAC): ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se explicó requisito de titularidad única de IBAN (Ley 10/2010 SEPBLAC) a ${p.clientName} y se envió guía por WhatsApp.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Enviar Guía de IBAN Propio + Abrir Formulario Voz',
    autoActionDescription:
      'Envía al cliente la explicación legal del IBAN por WhatsApp, abre el Formulario Didáctico con Voz y registra la gestión en la Bitácora.',
    opensVoiceForm: true
  },
  {
    id: 'glos-tin-tae-cuota',
    termTitle: 'TIN, TAE y Cuota Mensual Fija (Intereses Explicados Fácil)',
    shortTag: 'Concepto Financiero',
    category: 'conceptos_basicos',
    searchKeywords: ['tin', 'tae', 'interes', 'intereses', 'cuota', 'sube', 'euribor', 'pagar al mes', 'coste'],
    questionTriggers: [
      '¿Qué diferencia hay entre TIN y TAE?',
      '¿La cuota mensual me puede subir en el futuro?',
      '¿Cuánto voy a pagar de intereses?'
    ],
    zeroKnowledgeExplanation:
      'El TIN (1,95% mensual) es el interés puro del préstamo cada mes. La TAE (26,8% anual) es el indicador anual que exige la ley española incluyendo todos los gastos. Lo único que el cliente necesita saber es que SU CUOTA EN EUROS ES 100% FIJA y jamás sube.',
    realWorldComparison:
      'El TIN es el precio del plato en un restaurante y la TAE es la cuenta final con todo incluido. Así el cliente sabe desde el primer día cuánto pagará exactamente cada mes.',
    whatAdvisorMustDoStepByStep: [
      '1. Tranquiliza al cliente: su cuota mensual de ' +
        'euros ya incluye absolutamente todo y nunca subirá aunque suba el Euríbor.',
      '2. Recuérdale que si paga antes de tiempo tiene 0% de comisión.',
      '3. Pulsa "⚡ Hazlo Todo por Mí" para mandarle su cuadro de cuota fija por WhatsApp.'
    ],
    neverDoWarning:
      'NUNCA inventes tipos de interés distintos a los que calcula el simulador oficial.',
    buildSpokenAnswerForClient: (p) =>
      `"Se lo explico de forma muy sencilla, ${p.clientFirstName}: el TIN del 1,95% mensual es el interés del préstamo y la TAE es el cálculo anual que exige mostrar el Banco de España. Lo más importante para su tranquilidad es que su cuota de ${p.monthlyQuota} al mes es 100% FIJA y cerrada: ya incluye todos los costes y jamás le subirá ni un solo euro. Además, puede cancelar antes cuando quiera con 0% de comisión."`,
    buildWhatsAppReadyMessage: (p) =>
      `📊 *RESUMEN TRANSPARENTE DE TU CUOTA FIJA — EXPEDIENTE ${p.radicadoId}*\n\n` +
      `Hola *${p.clientFirstName}*, te detallo las condiciones cerradas de tu préstamo en *INSTACREDIT España*:\n\n` +
      `• *Capital Solicitado:* ${p.capitalAmount}\n` +
      `• *Cuota Mensual Fija:* *${p.monthlyQuota}/mes* (Durante ${p.termMonths} meses)\n` +
      `• *Tipo de Interés:* Cuota 100% fija (no sube con el Euríbor ni la inflación)\n` +
      `• *Amortización Anticipada:* *0,00 % de comisión* (Ley 16/2011)\n\n` +
      `👉 *Consulta tu contrato completo aquí:*\n${p.portalUrl}`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT: ${p.clientFirstName}, tu cuota para los ${p.capitalAmount} es 100% FIJA (${p.monthlyQuota}/mes) y con 0% comision por pago anticipado: ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se explicó TIN/TAE y garantía de cuota fija (${p.monthlyQuota}/mes) a ${p.clientName}.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Enviar Desglose de Cuota Fija + Guardar en Bitácora',
    autoActionDescription:
      'Envía al cliente por WhatsApp el desglose exacto de su cuota fija mensual y guarda la nota en el historial.'
  },
  {
    id: 'glos-asnef-fga',
    termTitle: 'ASNEF / EQUIFAX y Fondo Europeo de Garantías (FGA)',
    shortTag: 'Solvencia y Riesgo',
    category: 'conceptos_basicos',
    searchKeywords: ['asnef', 'equifax', 'moroso', 'lista negra', 'deuda', 'aval', 'avalista', 'propiedad', 'fga', 'garantia'],
    questionTriggers: [
      'Estoy en ASNEF por una factura de teléfono, ¿me lo aprobáis?',
      'No tengo avalista ni casa en propiedad, ¿puedo pedir el préstamo?',
      '¿Qué es el Fondo Europeo de Garantías?'
    ],
    zeroKnowledgeExplanation:
      'ASNEF es una lista donde apuntan a quien debe algún recibo (luz, móvil, tarjeta). Los bancos tradicionales rechazan automáticamente si sales ahí. Nosotros NO rechazamos por deudas pequeñas no bancarias porque incluimos el Fondo Europeo de Garantías (FGA), que hace de "avalista automático" del cliente.',
    realWorldComparison:
      'En vez de obligar al cliente a pedirle el favor a su padre o a un amigo para que le avale, nuestro propio Fondo actúa como su respaldo.',
    whatAdvisorMustDoStepByStep: [
      '1. Dile al cliente que no se preocupe si tiene algún recibo de telefonía o luz en ASNEF.',
      '2. Explícale que no necesita avalista ni hipotecar nada gracias al Fondo Europeo de Garantías (FGA).',
      '3. Pulsa "⚡ Hazlo Todo por Mí" para mandarle la confirmación de estudio flexible por WhatsApp.'
    ],
    neverDoWarning:
      'NUNCA avergüences al cliente por estar en ASNEF ni le pidas que traiga un avalista.',
    buildSpokenAnswerForClient: (p) =>
      `"Esté totalmente tranquilo(a), ${p.clientFirstName}. En INSTACREDIT España sabemos que cualquiera puede tener un recibo pendiente de telefonía o suministros en ASNEF y por eso estudiamos sus ingresos actuales de forma humana. Además, su expediente ${p.radicadoId} cuenta con el respaldo automático del Fondo Europeo de Garantías, por lo que NO necesita presentar ningún familiar como avalista ni poner propiedades."`,
    buildWhatsAppReadyMessage: (p) =>
      `🏛️ *ESTUDIO FLEXIBLE Y RESPALDO SIN AVALISTA (FONDO DE GARANTÍAS)*\n\n` +
      `Hola *${p.clientFirstName}*, te escribe tu asesor *${p.advisorName}* sobre tu solicitud *${p.radicadoId}* (*${p.capitalAmount}*):\n\n` +
      `✔️ *Sin Avalistas:* Tu operación está respaldada por el *Fondo Europeo de Garantías (FGA)*; no necesitas molestar a familiares ni aportar propiedades.\n` +
      `✔️ *Estudio Humano ante ASNEF:* Pequeños apuntes de suministros o telefonía no impiden tu aprobación si cuentas con ingresos demostrables.\n\n` +
      `👉 *Sigue el estado de tu solicitud aquí:*\n${p.portalUrl}`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT: ${p.clientFirstName}, tu solicitud ${p.radicadoId} (${p.capitalAmount}) incluye Fondo de Garantias SIN avalista y estudio flexible ASNEF: ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se informó cobertura del Fondo Europeo de Garantías (sin avalista) y criterio flexible ASNEF a ${p.clientName}.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Enviar Cobertura Sin Aval / ASNEF + Anotar Bitácora',
    autoActionDescription:
      'Envía al cliente la explicación del Fondo de Garantías sin avalista por WhatsApp y registra la gestión automáticamente.'
  },
  {
    id: 'glos-pagare-eidas-otp',
    termTitle: 'Pagaré Digital eIDAS y Código SMS (OTP de 6 dígitos)',
    shortTag: 'Firma Digital Legal',
    category: 'documentos_bancos',
    searchKeywords: ['pagare', 'eidas', 'firma', 'firmar', 'dedo', 'otp', 'sms', 'codigo', 'notario', 'contrato'],
    questionTriggers: [
      '¿Qué es el Pagaré eIDAS y cómo se firma?',
      'El cliente dice que no sabe cómo firmar en el móvil',
      '¿Qué es el código OTP de 6 números?'
    ],
    zeroKnowledgeExplanation:
      'El Pagaré es el contrato donde el cliente acepta devolver el préstamo. Gracias a la ley europea "eIDAS", no hace falta ir a un notario físico: el cliente dibuja su firma con el dedo en la pantalla del móvil y escribe un código de 6 números (OTP) para dejarlo firmado legalmente.',
    realWorldComparison:
      'Igual que cuando recibes un paquete y firmas con el dedo en la maquinita del repartidor, pero certificado por la Unión Europea.',
    whatAdvisorMustDoStepByStep: [
      '1. Verifica que el préstamo esté en estado "Aprobado".',
      '2. Dile al cliente que abra el enlace, dibuje su firma con el dedo en el recuadro blanco y ponga el código de 6 dígitos.',
      '3. Pulsa "⚡ Hazlo Todo por Mí" para abrirle su Pagaré eIDAS y mandarle el enlace directo de firma por WhatsApp.'
    ],
    neverDoWarning:
      'NUNCA trazas tú la firma por el cliente; debe hacerlo él mismo desde su teléfono u ordenador.',
    buildSpokenAnswerForClient: (p) =>
      `"${p.clientFirstName}, para que usted no tenga que pedir cita ni desplazarse a una notaría física, utilizamos la Firma Electrónica Europea eIDAS. Es facilísimo: solo tiene que abrir el enlace que le acabo de mandar a su WhatsApp, dibujar su firma con el dedo dentro del recuadro blanco y confirmar con el código de 6 números. En cuanto lo pulse, su préstamo de ${p.capitalAmount} pasa a desembolso."`,
    buildWhatsAppReadyMessage: (p) =>
      `✍️ *CÓMO FIRMAR TU PAGARÉ DIGITAL DESDE EL MÓVIL (EN 1 MINUTO)*\n\n` +
      `Hola *${p.clientFirstName}*, tu préstamo *${p.radicadoId}* por *${p.capitalAmount}* está listo para firma digital (*Reglamento Europeo eIDAS*):\n\n` +
      `1️⃣ *Abre este enlace oficial:* ${p.portalUrl}\n` +
      `2️⃣ *Dibuja tu firma con el dedo* dentro del recuadro blanco.\n` +
      `3️⃣ *Introduce el código de 6 dígitos (OTP)* que aparece en pantalla o por SMS y pulsa *"Confirmar y Firmar"*.\n\n` +
      `¡Avísame por aquí apenas lo hagas para transferir tu dinero de inmediato! — *${p.advisorName}*`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT: ${p.clientFirstName}, firma con el dedo tu Pagare Digital eIDAS para recibir tus ${p.capitalAmount} (Exp. ${p.radicadoId}) entrando aqui: ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se enviaron instrucciones de Firma Digital eIDAS y Pagaré a ${p.clientName}.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Enviar Guía de Firma eIDAS + Abrir Pagaré Oficial',
    autoActionDescription:
      'Envía al cliente las instrucciones paso a paso por WhatsApp, muestra el Pagaré eIDAS en pantalla y lo anota en la Bitácora.',
    suggestedDocModal: 'pagare_en_blanco'
  },
  {
    id: 'glos-adulto-mayor-voz',
    termTitle: 'Formulario Didáctico con Voz (Para Mayores o Dificultad Digital)',
    shortTag: 'Accesibilidad por Voz',
    category: 'botones_sistema',
    searchKeywords: ['mayor', 'anciano', 'abuelo', 'pensionista', 'voz', 'no ve', 'letras pequeñas', 'no sabe', 'movil', 'ayuda'],
    questionTriggers: [
      'El cliente es mayor y dice que no entiende el móvil',
      'El cliente no ve bien las letras pequeñas',
      '¿Cómo le ayudo a rellenar los datos sin agobiarle?'
    ],
    zeroKnowledgeExplanation:
      'Nuestra aplicación tiene 5 Formularios Especiales con Voz en Español. Tienen letras gigantes, botones grandes y un altavoz que le habla al cliente en voz alta explicándole cada casilla como si estuvieras sentado a su lado.',
    realWorldComparison:
      'Es como un audiolibro interactivo que le va diciendo al cliente: "Ahora escribe aquí tu nombre, ahora sube aquí la foto de tu DNI".',
    whatAdvisorMustDoStepByStep: [
      '1. Háblale despacio, con muchísimo cariño y paciencia.',
      '2. Pulsa el botón verde "⚡ Hazlo Todo por Mí" de abajo: abrirá el Formulario con Voz en tu pantalla y se lo enviará al WhatsApp del cliente en 1 clic.'
    ],
    neverDoWarning:
      'NUNCA le digas "búsquese a alguien joven que le ayude" ni le hables rápido.',
    buildSpokenAnswerForClient: (p) =>
      `"No se preocupe absolutamente de nada, don/doña ${p.clientFirstName}. Yo le voy a guiar con toda la paciencia del mundo. Le acabo de mandar a su WhatsApp un Formulario Especial que tiene letras grandes y un botón verde de altavoz. Cuando usted lo toque, su propio teléfono le hablará en voz alta para explicarle todo paso a paso."`,
    buildWhatsAppReadyMessage: (p) =>
      `🔊 *TU FORMULARIO FÁCIL CON VOZ Y LETRAS GRANDES*\n\n` +
      `Hola *${p.clientFirstName}*, soy tu asesor *${p.advisorName}* de INSTACREDIT España.\n\n` +
      `He activado para ti nuestra *Guía Asistida por Voz* para tu solicitud *${p.radicadoId}* (*${p.capitalAmount}*). No tienes que leer letra pequeña:\n\n` +
      `👉 *Toca aquí para abrirlo:* ${p.portalUrl}\n` +
      `🔊 *Luego toca el botón verde "Escuchar Guía por Voz"* y el teléfono te irá hablando paso a paso.\n\n` +
      `Estoy aquí contigo al teléfono para ayudarte en lo que necesites. 🤝`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT: Hola ${p.clientFirstName}, abre aqui tu Formulario con Voz y letras grandes para tu solicitud ${p.radicadoId}: ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se activó y envió Formulario Didáctico Asistido con Voz para atención accesible a ${p.clientName}.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Abrir Formulario con Voz + Enviarlo al WhatsApp',
    autoActionDescription:
      'Abre inmediatamente el Formulario Didáctico con Voz para el cliente, le manda el acceso por WhatsApp y registra la asistencia.',
    opensVoiceForm: true
  },
  {
    id: 'glos-cuenta-digital-desembolso',
    termTitle: 'Cuenta Digital IBAN en 0,00 € y Desembolso por Bizum / SEPA',
    shortTag: 'Operativa de Dinero',
    category: 'documentos_bancos',
    searchKeywords: ['0 euros', 'cero euros', 'saldo', 'boveda', 'cuenta digital', 'bizum', 'sepa', 'retirar', 'desembolso', 'cuando llega'],
    questionTriggers: [
      '¿Por qué mi Cuenta Digital sale con saldo 0,00 €?',
      '¿Cómo paso el dinero de Instacredit a mi banco normal?',
      '¿Cuánto tarda en llegar el dinero por SEPA o Bizum?'
    ],
    zeroKnowledgeExplanation:
      'Al registrarse, cada cliente recibe una Cuenta Digital IBAN interna que empieza en 0,00 € mientras estudiamos su caso. En cuanto el préstamo pasa a estado "Desembolsado", el sistema ingresa ahí el 100% de sus euros para que los pase a su banco en segundos por SEPA Instant o Bizum.',
    realWorldComparison:
      'Es como abrir una hucha nueva: al principio marca 0 € hasta que aprobamos el préstamo y metemos todo el dinero dentro.',
    whatAdvisorMustDoStepByStep: [
      '1. Si está en Pendiente/Revisión, explícale que es normal que marque 0,00 € hasta que se desembolse.',
      '2. Si ya firmó el pagaré, pulsa el botón para pasar a Desembolsado y envíale la confirmación con 1 clic.'
    ],
    neverDoWarning:
      'NUNCA le digas que tiene que ingresar dinero suyo para activar la Cuenta Digital.',
    buildSpokenAnswerForClient: (p) =>
      `"${p.clientFirstName}, su Cuenta Digital IBAN ${p.digitalIban} empieza en 0,00 € de forma preventiva mientras completamos la verificación. En el mismo instante en que su expediente ${p.radicadoId} queda desembolsado, verá acreditados ahí el 100% de sus ${p.capitalAmount} listos para transferirlos en 10 segundos a su banco habitual por SEPA Instantánea o Bizum."`,
    buildWhatsAppReadyMessage: (p) =>
      `🏦 *INFORMACIÓN SOBRE TU CUENTA DIGITAL IBAN Y RETIRO SEPA / BIZUM*\n\n` +
      `Hola *${p.clientFirstName}*, te informo sobre el funcionamiento de tu Cuenta Digital asignada (*${p.digitalIban}*) en el expediente *${p.radicadoId}*:\n\n` +
      `• *Durante el estudio:* El saldo muestra *0,00 €* de forma preventiva (sin ningún coste para ti).\n` +
      `• *Al Desembolsar:* Se acreditan automáticamente tus *${p.capitalAmount}* íntegros.\n` +
      `• *Retiro Inmediato:* Desde tu portal puedes transferir el dinero a tu banco en segundos vía *SEPA Instant* o *Bizum*.\n\n` +
      `👉 *Accede a tu Bóveda Digital aquí:*\n${p.portalUrl}`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT: ${p.clientFirstName}, tu Cuenta Digital ${p.digitalIban} recibira el 100% de tus ${p.capitalAmount} al desembolsar para retiro SEPA/Bizum: ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se explicó el funcionamiento de la Cuenta Digital IBAN y retiro SEPA/Bizum a ${p.clientName}.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Enviar Explicación de Cuenta Digital y Retiro',
    autoActionDescription:
      'Envía por WhatsApp la explicación clara de la Cuenta Digital IBAN y cómo retirar por Bizum/SEPA, anotándolo en la Bitácora.'
  },
  {
    id: 'glos-prorroga-alivio-sac',
    termTitle: 'Prórroga de Pago (+15, +30, +45 días) y Quejas SAC (Cero Acoso)',
    shortTag: 'Alivio y Derechos',
    category: 'leyes_espana',
    searchKeywords: ['prorroga', 'aplazar', 'no puedo pagar', 'retraso', 'mora', 'acoso', 'queja', 'reclamacion', 'sac', 'banco de españa'],
    questionTriggers: [
      'El cliente dice que este mes no puede pagar la cuota a tiempo',
      '¿Cómo le activo una prórroga de 15, 30 o 45 días?',
      'El cliente está enfadado y quiere poner una reclamación en el SAC'
    ],
    zeroKnowledgeExplanation:
      'En INSTACREDIT está prohibido acosar o amenazar al cliente. Si un cliente avisa que se le retrasó el sueldo, le ayudamos con una Prórroga Oficial de 15, 30 o 45 días sin meterle en ASNEF. Y si quiere poner una queja, le damos acceso inmediato al Servicio de Atención al Cliente (SAC Banco de España).',
    realWorldComparison:
      'Si un buen cliente te avisa con educación que cobrará unos días tarde, le das la mano y le cambias la fecha en lugar de pelear.',
    whatAdvisorMustDoStepByStep: [
      '1. Agradécele por avisar y transmítele calma total.',
      '2. Pulsa "⚡ Hazlo Todo por Mí" para abrir el Formulario de Prórroga / SAC con Voz y enviárselo a su WhatsApp.'
    ],
    neverDoWarning:
      'PROHIBIDO amenazar con juicios, embargos o llamar fuera del horario legal (9:00 a 20:00 h).',
    buildSpokenAnswerForClient: (p) =>
      `"Respire tranquilo(a), ${p.clientFirstName}, y muchas gracias por avisarnos con tiempo. En INSTACREDIT España aplicamos una política de Cero Acoso y trato humano. Vamos a proteger su expediente ${p.radicadoId} activándole ahora mismo una Prórroga Oficial de 15, 30 o 45 días sin recargos por mora y sin ningún reporte a ASNEF. También tiene siempre a su disposición nuestro Servicio de Atención al Cliente supervisado bajo normativa del Banco de España."`,
    buildWhatsAppReadyMessage: (p) =>
      `🤝 *ACTIVACIÓN DE PRÓRROGA DE ALIVIO (+15, +30, +45 DÍAS) — CERO ACOSO*\n\n` +
      `Hola *${p.clientFirstName}*, soy tu asesor *${p.advisorName}* de INSTACREDIT España.\n\n` +
      `Para proteger tu tranquilidad y tu historial en el expediente *${p.radicadoId}*, hemos habilitado tu solicitud de *Prórroga Oficial Sin Penalización*:\n\n` +
      `🟢 *Elige tu nuevo plazo:* +15, +30 o +45 días.\n` +
      `🟢 *Historial Protegido:* 0,00 € de recargo de mora y sin reporte a ASNEF.\n` +
      `🟢 *Garantía SAC Banco de España:* Atención transparente y prioritaria.\n\n` +
      `👉 *Solicita tu prórroga aquí en 1 minuto:*\n${p.portalUrl}`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT ALIVIO: ${p.clientFirstName}, activa tu prorroga de 15, 30 o 45 dias sin recargos ni ASNEF para tu expediente ${p.radicadoId} aqui: ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se activó protocolo de Alivio Financiero / Prórroga (Política Cero Acoso) para ${p.clientName}.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Enviar Prórroga de Alivio + Abrir Formulario Voz',
    autoActionDescription:
      'Envía al cliente el enlace de Prórroga sin recargos por WhatsApp, abre el Formulario Asistido por Voz y lo registra en la Bitácora.',
    opensVoiceForm: true
  },
  {
    id: 'glos-botones-estados-sistema',
    termTitle: '¿Qué significan los 4 Estados del Sistema? (Pendiente, Revisión, Aprobado, Desembolsado)',
    shortTag: 'Uso del Panel',
    category: 'botones_sistema',
    searchKeywords: ['estados', 'pendiente', 'revision', 'aprobado', 'desembolsado', 'botones', 'como usar', 'que hago primero'],
    questionTriggers: [
      'No sé qué significan los colores de los clientes (Pendiente, Revisión, Aprobado, Desembolsado)',
      '¿Qué tengo que hacer en cada estado del cliente?',
      'Soy nuevo hoy, ¿cómo avanzo a un cliente?'
    ],
    zeroKnowledgeExplanation:
      'Todo préstamo pasa por 4 colores muy fáciles: 1) AZUL (Pendiente): Acaba de entrar, salúdale y pide DNI/IBAN. 2) ÁMBAR (En Revisión): Estamos mirando sus papeles. 3) MORADO (Aprobado): ¡Ya está aprobado! Pídele que firme con el dedo en el móvil. 4) VERDE (Desembolsado): Ya tiene el dinero en su cuenta.',
    realWorldComparison:
      'Es como pedir una pizza por internet: 1) Pedido recibido, 2) En el horno, 3) Lista para entregar, 4) Entregada en casa.',
    whatAdvisorMustDoStepByStep: [
      '1. Mira el color de la etiqueta del cliente.',
      '2. Pulsa el botón verde "⚡ Hazlo Todo por Mí" y el sistema enviará automáticamente el mensaje que corresponde al estado actual de ese cliente.'
    ],
    neverDoWarning:
      'NUNCA pases un cliente a Desembolsado sin haber comprobado antes su DNI y su firma digital.',
    buildSpokenAnswerForClient: (p) =>
      `"${p.clientFirstName}, le llamo para informarle del estado actualizado de su expediente ${p.radicadoId} por importe de ${p.capitalAmount}. Mi trabajo como su asesor personal ${p.advisorName} es acompañarle en cada paso hasta que tenga el dinero disponible en su banco sin ningún trámite complicado."`,
    buildWhatsAppReadyMessage: (p) =>
      `📋 *ACTUALIZACIÓN EN TIEMPO REAL DE TU EXPEDIENTE ${p.radicadoId}*\n\n` +
      `Hola *${p.clientFirstName}*, te escribe tu asesor *${p.advisorName}* de INSTACREDIT España.\n\n` +
      `Te informo que estamos gestionando prioritariamente tu solicitud por *${p.capitalAmount}* (Cuota fija: *${p.monthlyQuota}/mes*).\n\n` +
      `👉 *Consulta el estado en vivo y los siguientes pasos en tu portal:*\n${p.portalUrl}\n\n` +
      `Escríbeme por aquí si necesitas que te guíe por teléfono. 🤝`,
    buildSmsReadyMessage: (p) =>
      `INSTACREDIT: Hola ${p.clientFirstName}, tu asesor ${p.advisorName} ha actualizado tu expediente ${p.radicadoId} (${p.capitalAmount}). Ver estado: ${p.portalUrl}`,
    buildAutoBitacoraSummary: (p) =>
      `[Glosario-Asistente Automático] Se envió actualización de estado de expediente a ${p.clientName}.`,
    autoActionLabel: '⚡ Hacer Todo por Mí: Enviar Estado Actual al Cliente + Guardar Bitácora',
    autoActionDescription:
      'Envía automáticamente al cliente el resumen actualizado de su expediente por WhatsApp y guarda el registro en la Bitácora.'
  }
];

interface AdvisorSmartGlossaryAssistantProps {
  preselectedAppId?: string;
  onOpenDidacticForm?: (app?: CreditApplication) => void;
}

export const AdvisorSmartGlossaryAssistant: React.FC<AdvisorSmartGlossaryAssistantProps> = ({
  preselectedAppId,
  onOpenDidacticForm
}) => {
  const {
    applications,
    currentAdvisor,
    logAdvisorAction,
    openDocumentModal,
    updateApplicationStatus
  } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(
    preselectedAppId || applications[0]?.id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItemId, setActiveItemId] = useState<string>(SMART_GLOSSARY_ITEMS[0].id);

  // Voice synthesis state
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Feedback banner & copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoActionSuccess, setAutoActionSuccess] = useState<string | null>(null);

  const currentApp = useMemo(
    () => applications.find((a) => a.id === selectedAppId) || applications[0],
    [applications, selectedAppId]
  );

  const clientParams: GlossaryClientParams = useMemo(() => {
    const portalUrl = typeof window !== 'undefined' ? window.location.origin : 'https://instacredit.es';
    if (!currentApp) {
      return {
        clientName: 'Cliente Solicitante',
        clientFirstName: 'Cliente',
        clientPhone: '600000000',
        clientEmail: 'cliente@correo.es',
        capitalAmount: '5.000,00 €',
        monthlyQuota: '245,00 €',
        termMonths: 24,
        radicadoId: 'INSTA-ES-901122',
        digitalIban: 'ES91 2100 0418 4502 0005 1234',
        dueDate: '05 de noviembre de 2026',
        advisorName: currentAdvisor.name,
        portalUrl
      };
    }

    const months = Math.max(1, Math.round((currentApp.loanDetails.termDays || 360) / 30));
    const quota = Math.round(
      (currentApp.loanDetails.totalToPay || currentApp.loanDetails.capital * 1.19) / months
    );

    return {
      clientName: `${currentApp.personalData.firstName} ${currentApp.personalData.lastName}`,
      clientFirstName: currentApp.personalData.firstName,
      clientPhone: currentApp.personalData.phone,
      clientEmail: currentApp.personalData.email,
      capitalAmount: formatEUR(currentApp.approvedAmount || currentApp.loanDetails.capital),
      monthlyQuota: formatEUR(quota),
      termMonths: months,
      radicadoId: currentApp.id,
      digitalIban: currentApp.digitalAccount.accountNumber,
      dueDate: currentApp.loanDetails.dueDate,
      advisorName: currentAdvisor.name,
      portalUrl
    };
  }, [currentApp, currentAdvisor]);

  // Filter glossary items by search or category
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SMART_GLOSSARY_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'todos' || item.category === selectedCategory;
      if (!q) return matchesCat;
      const inTitle = item.termTitle.toLowerCase().includes(q);
      const inExp = item.zeroKnowledgeExplanation.toLowerCase().includes(q);
      const inKeywords = item.searchKeywords.some((k) => k.toLowerCase().includes(q));
      const inTriggers = item.questionTriggers.some((t) => t.toLowerCase().includes(q));
      return matchesCat && (inTitle || inExp || inKeywords || inTriggers);
    });
  }, [selectedCategory, searchQuery]);

  const activeItem = useMemo(
    () =>
      filteredItems.find((i) => i.id === activeItemId) ||
      filteredItems[0] ||
      SMART_GLOSSARY_ITEMS[0],
    [filteredItems, activeItemId]
  );

  // Speech helper
  const speakText = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }
    const cleanText = text.replace(/[*_#`~>]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = speechRate;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setAutoActionSuccess(`✅ ${label} copiado al portapapeles.`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // MAGIC 1-CLICK AUTOMATION: "HAZLO TODO POR MÍ"
  const handleDoEverythingForMe = (item: SmartGlossaryItem) => {
    const waText = item.buildWhatsAppReadyMessage(clientParams);
    const bitacoraNote = item.buildAutoBitacoraSummary(clientParams);
    const cleanPhone = clientParams.clientPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('34') ? cleanPhone : `34${cleanPhone}`;

    // 1. Copy message to clipboard
    navigator.clipboard.writeText(waText);

    // 2. Log automatically in client's Bitácora
    if (currentApp) {
      logAdvisorAction(currentApp.id, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'whatsapp',
        summary: bitacoraNote,
        clientNotes: `Ejecutado con 1 clic desde el Glosario-Asistente Inteligente (${item.termTitle}).`
      });
    }

    // 3. Open Voice Form or Legal Document Modal if applicable
    if (item.opensVoiceForm && onOpenDidacticForm) {
      onOpenDidacticForm(currentApp);
    }
    if (item.suggestedDocModal && currentApp) {
      openDocumentModal(currentApp, item.suggestedDocModal);
    }

    // 4. Open WhatsApp with personalized response ready to send
    window.open(
      `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(waText)}`,
      '_blank',
      'noopener,noreferrer'
    );

    setAutoActionSuccess(
      `⚡ ¡HECHO AUTOMÁTICAMENTE! Se copió la respuesta oficial, se abrió el WhatsApp de ${clientParams.clientFirstName} y se registró la gestión en su Bitácora.`
    );
    setTimeout(() => setAutoActionSuccess(null), 6000);
  };

  const spokenAnswer = activeItem.buildSpokenAnswerForClient(clientParams);
  const whatsappMessage = activeItem.buildWhatsAppReadyMessage(clientParams);
  const smsMessage = activeItem.buildSmsReadyMessage(clientParams);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP BANNER: GLOSARIO-ASISTENTE INTELIGENTE QUE LO HACE TODO POR EL ASESOR */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#0B1B3D] via-[#102A63] to-[#0055FF] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00E599] text-[#0B1B3D] text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Bot className="w-3.5 h-3.5" />
                Glosario-Asistente Inteligente • Te Explica y Lo Hace Todo por Ti
              </span>
              <span className="bg-white/15 text-blue-100 text-xs font-bold px-3 py-0.5 rounded-full">
                Para Empleados Sin Ninguna Experiencia
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              ¿No sabes qué significa algo o qué responder? Escríbelo aquí y el Asistente lo hace por ti
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Escribe cualquier palabra o duda del cliente (ej. <strong>&ldquo;IBAN&rdquo;, &ldquo;ASNEF&rdquo;, &ldquo;TAE&rdquo;, &ldquo;Pagaré&rdquo;, &ldquo;Desconfía&rdquo;, &ldquo;No puede pagar&rdquo;</strong>). El Glosario-Asistente te lo explica en voz alta como a un principiante, te da la respuesta exacta y tiene el botón <strong>&ldquo;⚡ Hacer Todo por Mí&rdquo;</strong> que le envía el mensaje al cliente y guarda la nota en su expediente solo.
            </p>
          </div>

          {/* Client Selector & Voice Speed */}
          <div className="bg-blue-950/85 p-4 rounded-2xl border border-blue-800 space-y-3 shrink-0 lg:w-80">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#00E599] mb-1">
                👤 Cliente al que estás asistiendo:
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white border border-blue-700 text-xs font-bold cursor-pointer"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.personalData.firstName} {app.personalData.lastName} ({formatEUR(app.approvedAmount || app.loanDetails.capital)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-blue-900">
              <span className="text-blue-200 font-bold">Velocidad del Asistente de Voz:</span>
              <div className="flex gap-1">
                {[0.9, 1.0, 1.15].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSpeechRate(r)}
                    className={`px-2 py-0.5 rounded-md font-bold text-[11px] cursor-pointer ${
                      speechRate === r ? 'bg-[#00E599] text-[#0B1B3D]' : 'text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Search Bar & Quick Question Pills */}
        <div className="mt-6 pt-5 border-t border-white/15 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escribe aquí tu duda o lo que pregunta el cliente (ej: qué es IBAN, ASNEF, TAE, pagaré, tiene miedo, es mayor)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-lg focus:outline-hidden focus:ring-4 focus:ring-[#00E599]/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-xs font-black text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Quick-Click Question Chips for Untrained Staff */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase text-[#00E599]">
              Preguntas Rápidas (Haz clic):
            </span>
            {[
              { label: '❓ ¿Piden dinero antes?', id: 'glos-anticipos-estafa' },
              { label: '🏦 ¿Qué es IBAN / SEPBLAC?', id: 'glos-iban-sepblac' },
              { label: '📊 ¿Qué es TIN y TAE?', id: 'glos-tin-tae-cuota' },
              { label: '🛡️ ¿Cliente en ASNEF o sin aval?', id: 'glos-asnef-fga' },
              { label: '✍️ ¿Cómo firma el Pagaré en el móvil?', id: 'glos-pagare-eidas-otp' },
              { label: '👴 ¿Cliente mayor no entiende el móvil?', id: 'glos-adulto-mayor-voz' },
              { label: '💶 ¿Por qué su cuenta sale en 0,00 €?', id: 'glos-cuenta-digital-desembolso' },
              { label: '🤝 ¿No puede pagar a tiempo / Prórroga?', id: 'glos-prorroga-alivio-sac' },
              { label: '🚦 ¿Qué significan los 4 estados?', id: 'glos-botones-estados-sistema' }
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setSelectedCategory('todos');
                  setSearchQuery('');
                  setActiveItemId(chip.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeItem.id === chip.id
                    ? 'bg-[#00E599] text-[#0B1B3D] shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {autoActionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-xs sm:text-sm font-black flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{autoActionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setAutoActionSuccess(null)}
            className="text-xs font-bold underline text-emerald-800 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY TABS */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'todos', label: '📚 Todo el Glosario-Asistente (9 Guías Clave)' },
          { id: 'dudas_clientes', label: '💬 Dudas y Miedos del Cliente' },
          { id: 'conceptos_basicos', label: '📊 Términos Financieros (TIN, TAE, ASNEF)' },
          { id: 'documentos_bancos', label: '🏦 Bancos, IBAN y Pagaré Digital' },
          { id: 'leyes_espana', label: '⚖️ Prórrogas, Leyes y SAC' },
          { id: 'botones_sistema', label: '🖱️ Cómo Usar el Sistema y Formularios Voz' }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id as GlossaryCategory)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#0B1B3D] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MAIN 2-COLUMN WORKSPACE: LIST OF TERMS ON LEFT, FULL ASSISTANT ON RIGHT */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (4 COLS): GLOSSARY LIST */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-black uppercase text-slate-400 px-1">
            Selecciona un término o situación ({filteredItems.length}):
          </div>

          {filteredItems.map((item) => {
            const isSelected = item.id === activeItem.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItemId(item.id)}
                className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-white border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/20'
                    : 'bg-white/80 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.shortTag}
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 ${isSelected ? 'text-[#0066FF]' : 'text-slate-400'}`}
                  />
                </div>

                <div className="text-xs sm:text-sm font-black text-[#0B1B3D] leading-snug">
                  {item.termTitle}
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-2">
                  {item.zeroKnowledgeExplanation}
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT COLUMN (8 COLS): EL ASISTENTE QUE EXPLICA, HABLA Y LO HACE TODO POR EL ASESOR */}
        <div className="lg:col-span-8 space-y-5">
          {/* =================================================================== */}
          {/* BLOQUE 1: BOTÓN MÁGICO "HAZLO TODO POR MÍ EN 1 CLIC" */}
          {/* =================================================================== */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-emerald-400/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block">
                  ⚡ Acción Automática para Empleados Sin Experiencia
                </span>
                <h3 className="text-lg sm:text-xl font-black">
                  ¿No sabes qué hacer? Pulsa este botón y la aplicación lo hace por ti:
                </h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  {activeItem.autoActionDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDoEverythingForMe(activeItem)}
                className="px-6 py-4 rounded-2xl bg-[#00E599] hover:bg-emerald-300 text-[#0B1B3D] font-black text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>{activeItem.autoActionLabel}</span>
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* BLOQUE 2: EXPLICACIÓN VISUAL Y AUDITIVA PARA EL ASESOR (DESDE CERO) */}
          {/* =================================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black uppercase text-[#0066FF]">
                  1. Explicación Fácil para Ti (Sin Tecnicismos)
                </span>
                <h3 className="text-xl font-black text-[#0B1B3D] mt-0.5">
                  {activeItem.termTitle}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  speakText(
                    `exp-${activeItem.id}`,
                    `Explicación fácil para ti sobre ${activeItem.termTitle}. ${activeItem.zeroKnowledgeExplanation}. Ejemplo sencillo: ${activeItem.realWorldComparison}. Pasos que debes hacer: ${activeItem.whatAdvisorMustDoStepByStep.join(' ')}`
                  )
                }
                className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer transition ${
                  speakingId === `exp-${activeItem.id}`
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {speakingId === `exp-${activeItem.id}` ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Detener Voz</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 Escuchar Explicación en Voz Alta</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1.5">
                <span className="text-xs font-black uppercase text-[#0066FF] block">
                  🧠 ¿Qué significa en palabras súper sencillas?:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {activeItem.zeroKnowledgeExplanation}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                <span className="text-xs font-black uppercase text-amber-900 block">
                  💡 Ejemplo de la vida diaria para que lo entiendas:
                </span>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                  {activeItem.realWorldComparison}
                </p>
              </div>
            </div>

            {/* Qué hacer paso a paso y Alerta Roja */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
              <div className="md:col-span-7 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
                <span className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  🟢 ¿Qué debes hacer ahora mismo?:
                </span>
                <ul className="space-y-1.5 text-xs font-semibold text-emerald-950">
                  {activeItem.whatAdvisorMustDoStepByStep.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-5 p-4 rounded-2xl bg-red-50 border border-red-300 space-y-2">
                <span className="text-xs font-black uppercase text-red-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  🔴 Prohibido Hacer:
                </span>
                <p className="text-xs font-semibold text-red-950 leading-relaxed">
                  {activeItem.neverDoWarning}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* BLOQUE 3: QUÉ DECIRLE AL CLIENTE Y PLANTILLA LISTA PARA ENVIAR */}
          {/* =================================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black uppercase text-emerald-700">
                  2. Lo que debes decirle y enviarle a {clientParams.clientName}
                </span>
                <h4 className="text-lg font-black text-[#0B1B3D]">
                  Guion Hablado y Mensaje de WhatsApp Listo (Ya rellenado con sus datos)
                </h4>
              </div>

              <button
                type="button"
                onClick={() => speakText(`ans-${activeItem.id}`, spokenAnswer)}
                className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>🗣️ Escuchar Cómo Decírselo al Cliente</span>
              </button>
            </div>

            {/* Guion Hablado */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#0B1B3D]">
                  📞 Léelo exactamente así por teléfono:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(`spk-${activeItem.id}`, spokenAnswer, 'Respuesta hablada')}
                  className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === `spk-${activeItem.id}` ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                {spokenAnswer}
              </p>
            </div>

            {/* Plantilla WhatsApp */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-800">
                  📲 Plantilla Escrita Lista para Enviar por WhatsApp o SMS:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(`wa-${activeItem.id}`, whatsappMessage, 'Plantilla WhatsApp')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === `wa-${activeItem.id}` ? '¡Copiado!' : 'Copiar WhatsApp'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(`sms-${activeItem.id}`, smsMessage, 'Plantilla SMS')}
                    className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs font-bold text-[#0066FF] flex items-center gap-1 cursor-pointer"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>{copiedId === `sms-${activeItem.id}` ? '¡Copiado!' : 'Copiar SMS'}</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-2xl bg-[#E7FFDB] border border-emerald-300 text-xs text-slate-900 whitespace-pre-wrap font-sans leading-relaxed">
                {whatsappMessage}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
