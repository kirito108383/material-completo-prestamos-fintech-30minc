import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditApplication } from '../../types';
import { formatEUR } from '../../utils/financialCalculations';
import { dispatchKitInOneAction } from '../../utils/kitDispatcher';
import {
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Eye,
  MessageCircle,
  Smartphone,
  Mail,
  Copy,
  Check,
  Send,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  FileText,
  User,
  PhoneCall,
  Printer,
  Search,
  Zap,
  Award,
  BookOpen,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface CallCenterLiveCopilotProps {
  preselectedAppId?: string;
  onOpenDidacticForm?: (app?: CreditApplication) => void;
}

interface CopilotScenarioStage {
  id: string;
  stageNumber: number;
  shortTitle: string;
  badgeText: string;
  badgeColor: string;
  whenToUse: string;
  imageAsset: string;
  // 1. ASISTENCIA VISUAL (Para empleados sin experiencia)
  visualWhatClientSees: string;
  visualSystemSteps: string[];
  greenMustDo: string[];
  redNeverDo: string[];
  // 2. ASISTENCIA AUDITIVA (Voz para capacitar al asesor + Voz modelo para el cliente)
  advisorTrainingAudioScript: string;
  // 3. ASISTENCIA ESCRITA Y HABLADA (Guion telefónico + Plantillas listas para enviar)
  buildPhoneCallScript: (p: CopilotTemplateParams) => string;
  buildWhatsAppTemplate: (p: CopilotTemplateParams) => string;
  buildSmsTemplate: (p: CopilotTemplateParams) => string;
  buildEmailSubject: (p: CopilotTemplateParams) => string;
  buildEmailBody: (p: CopilotTemplateParams) => string;
}

interface CopilotTemplateParams {
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
  advisorRole: string;
  portalUrl: string;
}

const CALL_CENTER_STAGES: CopilotScenarioStage[] = [
  {
    id: 'stage-1-bienvenida',
    stageNumber: 1,
    shortTitle: '1. Bienvenida y Primer Contacto (<15 min)',
    badgeText: 'ETAPA 1 • ONBOARDING',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    whenToUse: 'Cuando entra un cliente nuevo en estado "Pendiente" y hay que saludarle, darle confianza y pedirle validar su expediente.',
    imageAsset: '/assets/whatsapp/kit_01_bienvenida_oficial.png',
    visualWhatClientSees:
      'El cliente acaba de rellenar la solicitud en la web y está esperando saber si somos una empresa real y rápida.',
    visualSystemSteps: [
      'PASO 1: Mira el nombre del cliente y el importe solicitado en el selector superior.',
      'PASO 2: Pulsa el botón "🎧 Escuchar Instrucción para Asesor" si no sabes qué hacer.',
      'PASO 3: Pulsa "📲 Enviar WhatsApp Oficial" para mandarle su tarjeta de bienvenida con tu nombre.',
      'PASO 4: Llama al cliente leyendo el "Guion Telefónico palabra por palabra".'
    ],
    greenMustDo: [
      'Presentarte siempre con tu nombre y apellido como asesor oficial de INSTACREDIT España.',
      'Aclarar desde el minuto 1 que todo el recorrido se completa en menos de 30 minutos y el dinero se deposita en la cuenta creada.',
      'Mencionar su número de expediente oficial (INSTA-ES) para darle total seguridad.'
    ],
    redNeverDo: [
      'NUNCA hablar con prisa, desgana o sin saber cuánto dinero pidió el cliente.',
      'NUNCA pedirle claves de acceso a su banca online.'
    ],
    advisorTrainingAudioScript:
      'Instrucción para el asesor en la Etapa 1: Bienvenida. Cuando un cliente acaba de registrarse, tu objetivo es llamarle o escribirle por WhatsApp en menos de 15 minutos. Debes transmitirle mucha seguridad, decirle tu nombre, su número de expediente y explicarle que a medida que complete cada enlace de cuestionario se irá configurando su cuenta para depositarle el préstamo en menos de 30 minutos. Envía primero la plantilla de WhatsApp con un clic y luego llámale leyendo el guion en pantalla.',
    buildPhoneCallScript: (p) =>
      `"¡Hola, muy buenos días, ${p.clientFirstName}! Le habla ${p.advisorName}, su asesor personal asignado en INSTACREDIT España. Le llamo porque acabamos de recibir su solicitud de préstamo con número de expediente ${p.radicadoId} por importe de ${p.capitalAmount}. Quería darle la bienvenida personalmente, confirmarle que en menos de 30 minutos dejamos todo completado, y acompañarle en cada cuestionario para que tenga su dinero depositado en su cuenta hoy mismo. ¿Le acabo de enviar un WhatsApp oficial con el primer enlace, lo ha podido recibir?"`,
    buildWhatsAppTemplate: (p) =>
      `👋 *¡Hola, ${p.clientFirstName}! Bienvenido(a) a INSTACREDIT España*\n\n` +
      `Soy *${p.advisorName}* (${p.advisorRole}), tu asesor oficial asignado para gestionar tu solicitud de préstamo en *menos de 30 minutos*.\n\n` +
      `📋 *RESUMEN DE TU EXPEDIENTE OFICIAL:*\n` +
      `• *Nº de Radicado:* ${p.radicadoId}\n` +
      `• *Titular:* ${p.clientName}\n` +
      `• *Importe Solicitado:* ${p.capitalAmount}\n` +
      `• *Cuota Mensual Fija Estimada:* ${p.monthlyQuota} (${p.termMonths} meses)\n` +
      `• *Cuenta Digital Asignada:* \`${p.digitalIban}\`\n\n` +
      `🔒 *Respaldo Legal (Ley 16/2011):* Una vez completados tus cuestionarios, el dinero se deposita directamente en tu cuenta creada.\n\n` +
      `👉 *Accede aquí a tu Cuestionario 1 Asistido con Voz:*\n${p.portalUrl}\n\n` +
      `¿Me confirmas por aquí cuando lo hayas recibido para agilizar tu aprobación? 🤝`,
    buildSmsTemplate: (p) =>
      `INSTACREDIT ESPANA: Hola ${p.clientFirstName}, soy ${p.advisorName}. Tu solicitud ${p.radicadoId} por ${p.capitalAmount} esta en marcha (respuesta en 30 min). Entra aqui: ${p.portalUrl}`,
    buildEmailSubject: (p) =>
      `[INSTACREDIT España] Bienvenida Oficial y Asignación de Asesor - Expediente #${p.radicadoId}`,
    buildEmailBody: (p) =>
      `Estimado(a) ${p.clientName},\n\n` +
      `Bienvenido(a) a INSTACREDIT ESPAÑA FINTECH S.L. (NIF B-87942105). Le confirmamos que su solicitud de préstamo personal ha quedado registrada bajo el expediente oficial Nº ${p.radicadoId}.\n\n` +
      `DATOS DE SU OPERACIÓN EN CURSO:\n` +
      `- Importe solicitado: ${p.capitalAmount}\n` +
      `- Plazo seleccionado: ${p.termMonths} meses (Cuota fija: ${p.monthlyQuota}/mes)\n` +
      `- Cuenta Digital Asignada: ${p.digitalIban}\n` +
      `- Asesor personal asignado: ${p.advisorName} (${p.advisorRole})\n` +
      `- Compromiso de Agilidad (Ley 16/2011): Resolución y depósito en cuenta en menos de 30 minutos.\n\n` +
      `Puede acceder en cualquier momento a su expediente y cuestionarios asistidos por voz en:\n${p.portalUrl}\n\n` +
      `Atentamente,\n${p.advisorName}\nDepartamento de Atención al Cliente • INSTACREDIT España`
  },
  {
    id: 'stage-2-documentos-iban',
    stageNumber: 2,
    shortTitle: '2. Pedir DNI/NIE y Cuenta IBAN Propia (SEPBLAC)',
    badgeText: 'ETAPA 2 • DOCUMENTACIÓN',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    whenToUse: 'Cuando necesitas que el cliente envíe su DNI/NIE legible, justificante de ingresos o confirme que la cuenta IBAN está a su nombre.',
    imageAsset: '/assets/whatsapp/kit_02_requisitos_documentales.png',
    visualWhatClientSees:
      'El cliente no sabe exactamente qué documentos mandar o intenta dar la cuenta bancaria de un familiar.',
    visualSystemSteps: [
      'PASO 1: Revisa que el DNI/NIE del cliente esté en vigor y se vean las 4 esquinas en color.',
      'PASO 2: Verifica que el código IBAN (ES...) pertenezca exclusivamente al cliente solicitante.',
      'PASO 3: Envía la plantilla de WhatsApp o Correo con la lista visual de los 3 requisitos.',
      'PASO 4: Si el cliente no sabe adjuntar archivos, envíale el "Formulario Didáctico con Voz".'
    ],
    greenMustDo: [
      'Explicar que por la Ley 10/2010 antiblanqueo (SEPBLAC), la cuenta bancaria IBAN debe estar 100% a su nombre.',
      'Indicar que si no tiene cuenta propia, puede abrir una cuenta online gratuita en BBVA, CaixaBank Imagin u Openbank en 5 minutos.',
      'Darle la opción de enviar las fotos directamente por WhatsApp si le resulta más fácil.'
    ],
    redNeverDo: [
      'NUNCA aceptar la cuenta bancaria de su pareja, hijo, madre o amigo.',
      'NUNCA aceptar capturas de DNI borrosas, cortadas o caducadas.'
    ],
    advisorTrainingAudioScript:
      'Instrucción para el asesor en la Etapa 2: Documentación e IBAN. Para aprobar el crédito, la ley española SEPBLAC exige tres cosas sencillas: foto del DNI o NIE en color por ambas caras con las cuatro esquinas visibles, certificado o captura de titularidad de su cuenta bancaria IBAN donde aparezca su nombre, y su justificante de ingresos como nómina o pensión. Recuerda: está prohibido enviar dinero a cuentas de familiares. Usa los botones de abajo para enviarle la lista exacta por WhatsApp, SMS o correo.',
    buildPhoneCallScript: (p) =>
      `"${p.clientFirstName}, para dejar su expediente ${p.radicadoId} listo para aprobación hoy mismo, solo necesitamos verificar tres documentos muy sencillos que nos exige la normativa del Banco de España y SEPBLAC: primero, una foto clara de su DNI o NIE por ambas caras sin cortar las esquinas; segundo, confirmar que su cuenta bancaria IBAN está a su nombre exclusivo como titular; y tercero, su último justificante de ingresos, ya sea nómina, pensión o declaración de autónomo. Te acabo de enviar por WhatsApp la lista detallada para que puedas mandármelos por ahí mismo con el móvil."`,
    buildWhatsAppTemplate: (p) =>
      `📄 *REQUISITOS PARA COMPLETAR TU EXPEDIENTE ${p.radicadoId}*\n\n` +
      `Hola *${p.clientFirstName}*, te escribe *${p.advisorName}* de INSTACREDIT España. Para activar el desembolso de tus *${p.capitalAmount}*, por favor envíame por aquí o sube a la plataforma estos 3 documentos:\n\n` +
      `1️⃣ *DNI o TIE/NIE en vigor:* Foto en color por ambas caras (que se vean las 4 esquinas sin reflejos).\n` +
      `2️⃣ *Titularidad de Cuenta Bancaria (IBAN España):* Captura o PDF de tu banco donde se vea tu nombre como titular único (Normativa antiblanqueo Ley 10/2010 SEPBLAC).\n` +
      `3️⃣ *Justificante de Ingresos:* Última nómina, revalorización de pensión o recibo/modelo de autónomo.\n\n` +
      `🔊 *¿Prefieres que el formulario te guíe con voz paso a paso? Entra aquí:*\n${p.portalUrl}\n\n` +
      `En cuanto me los envíes, paso tu solicitud a aprobación prioritaria en menos de 30 minutos. ⚡`,
    buildSmsTemplate: (p) =>
      `INSTACREDIT: Hola ${p.clientFirstName}, para aprobar tus ${p.capitalAmount} (Exp. ${p.radicadoId}) sube tu DNI e IBAN titular en: ${p.portalUrl} o envialo por WhatsApp.`,
    buildEmailSubject: (p) =>
      `[INSTACREDIT España] Documentación Requerida para Aprobación - Expediente #${p.radicadoId}`,
    buildEmailBody: (p) =>
      `Estimado(a) ${p.clientName},\n\n` +
      `Para finalizar la verificación legal de su préstamo por importe de ${p.capitalAmount} (Expediente #${p.radicadoId}), le solicitamos adjuntar la siguiente documentación conforme a la Ley 10/2010 (SEPBLAC):\n\n` +
      `1. Documento de Identidad (DNI / TIE) en vigor por ambas caras.\n` +
      `2. Certificado de Titularidad Bancaria IBAN en España a su nombre exclusivo.\n` +
      `3. Justificante de ingresos regulares (Nómina, Pensión o IRPF Autónomos).\n\n` +
      `Suba sus documentos de forma asistida con guía por voz en:\n${p.portalUrl}\n\n` +
      `Cordialmente,\n${p.advisorName}\nComité de Verificación • INSTACREDIT España`
  },
  {
    id: 'stage-3-desconfianza-antifraude',
    stageNumber: 3,
    shortTitle: '3. Cliente con Dudas o Desconfianza (Respaldo Legal y 12 Años en España)',
    badgeText: 'ETAPA 3 • CONFIANZA Y LEGALIDAD',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    whenToUse: 'Cuando el cliente siente duda, intriga o desconfianza y pide pruebas de nuestra trayectoria legal y de cómo se le deposita su dinero.',
    imageAsset: '/assets/whatsapp/kit_04_transparencia_bde.png',
    visualWhatClientSees:
      'El cliente quiere estar 100% seguro de que trata con una entidad española formal y entender cómo se deposita el dinero en su cuenta creada.',
    visualSystemSteps: [
      'PASO 1: Mantén una voz tranquila, empática y segura; felicita al cliente por querer revisar su documentación.',
      'PASO 2: Envíale en 1 clic la "Plantilla de Respaldo Legal NIF B-87942105 y Acceso a los 5 Contratos de 4 Páginas".',
      'PASO 3: Recuérdale que al terminar sus cuestionarios recibe el 100% del dinero en su cuenta creada y cuenta con 14 días de desistimiento.'
    ],
    greenMustDo: [
      'Dar nuestro NIF oficial en España (B-87942105), 12 años de trayectoria y citar la Ley 16/2011 de Contratos de Crédito al Consumo.',
      'Enviar el enlace directo a sus 5 documentos contractuales completos de 4 páginas cada uno.',
      'Explicar que una vez completados los enlaces en menos de 30 minutos, el préstamo queda depositado en su Cuenta Digital IBAN.'
    ],
    redNeverDo: [
      'NUNCA molestarte ni discutir porque el cliente haga preguntas.',
      'NUNCA usar respuestas vagas; envía siempre el enlace oficial de sus contratos y su expediente.'
    ],
    advisorTrainingAudioScript:
      'Instrucción para el asesor en la Etapa 3: Cliente con dudas o desconfianza. Cuando un cliente quiere asegurarse de que somos una financiera legal en España, felicítalo por su prudencia. Compártele nuestro NIF B-87942105, nuestros más de 12 años de experiencia y envíale con un clic el enlace directo para que vea en su móvil sus 5 contratos reales de 4 páginas cada uno bajo la Ley 16/2011.',
    buildPhoneCallScript: (p) =>
      `"Me alegra muchísimo que me haga esa pregunta, ${p.clientFirstName}, porque para nosotros su tranquilidad es lo primero. En INSTACREDIT España llevamos más de 12 años operando legalmente con NIF español B-87942105 bajo la Ley 16/2011 de Crédito al Consumo. Además, le acabo de enviar por WhatsApp el enlace directo donde usted puede leer y descargar sus 5 contratos oficiales de 4 páginas cada uno, y ver su Cuenta Digital IBAN ${p.digitalIban} donde se le depositan sus ${p.capitalAmount} en cuanto completemos los cuestionarios en menos de 30 minutos."`,
    buildWhatsAppTemplate: (p) =>
      `🏛️ *CERTIFICADO DE RESPALDO LEGAL Y TRANSPARENCIA — INSTACREDIT ESPAÑA*\n\n` +
      `Hola *${p.clientFirstName}*, como tu asesor oficial (*${p.advisorName}*), te comparto las garantías legales de tu expediente *${p.radicadoId}*:\n\n` +
      `✅ *ENTIDAD REGISTRADA EN ESPAÑA:* INSTACREDIT ESPAÑA FINTECH S.L. (NIF *B-87942105*), sujeta a la *Ley 16/2011* y *Circular 5/2012 del Banco de España*.\n` +
      `✅ *5 CONTRATOS OFICIALES DE 4 PÁGINAS:* Disponibles para lectura y descarga en PDF con sello eIDAS.\n` +
      `✅ *DEPÓSITO EN TU CUENTA CREADA:* Al completar tus cuestionarios, recibes tus *${p.capitalAmount}* en tu cuenta \`${p.digitalIban}\` para retiro por SEPA o Bizum.\n` +
      `✅ *DERECHO DE DESISTIMIENTO:* Cuentas con 14 días naturales legales bajo el Art. 28 de la Ley 16/2011.\n\n` +
      `👉 *Revisa aquí tu expediente y contratos oficiales:*\n${p.portalUrl}`,
    buildSmsTemplate: (p) =>
      `GARANTIA INSTACREDIT (NIF B87942105): ${p.clientFirstName}, revisa tus 5 contratos oficiales de 4 paginas del credito ${p.radicadoId} (${p.capitalAmount}) en: ${p.portalUrl}`,
    buildEmailSubject: (p) =>
      `[Garantía Legal Ley 16/2011] Certificación Societaria y Contratos Oficiales - Expediente #${p.radicadoId}`,
    buildEmailBody: (p) =>
      `Estimado(a) ${p.clientName},\n\n` +
      `Por medio de la presente, INSTACREDIT ESPAÑA FINTECH S.L. (NIF B-87942105) certifica formalmente que su operación de crédito #${p.radicadoId} por importe de ${p.capitalAmount} se rige íntegramente por la Ley 16/2011 de Contratos de Crédito al Consumo:\n\n` +
      `1. TRAYECTORIA Y LEGALIDAD: Más de 12 años en el mercado español y 5 documentos contractuales de 4 páginas con firma reconocida eIDAS.\n` +
      `2. DEPÓSITO EN CUENTA DIGITAL: Una vez completados los cuestionarios de verificación, se acredita el 100% del capital aprobado en su cuenta IBAN (${p.digitalIban}).\n` +
      `3. AMORTIZACIÓN ANTICIPADA GRATUITA: 0% de comisión por cancelación total o parcial antes de plazo.\n\n` +
      `Consulte su documentación oficial en: ${p.portalUrl}\n\n` +
      `Atentamente,\n${p.advisorName}\nCumplimiento Normativo • INSTACREDIT España`
  },
  {
    id: 'stage-4-asnef-garantias',
    stageNumber: 4,
    shortTitle: '4. Cliente en ASNEF o Sin Avalista (Fondo FGA)',
    badgeText: 'ETAPA 4 • SOLVENCIA Y ASNEF',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    whenToUse: 'Cuando el cliente teme ser rechazado por estar en ASNEF (facturas de luz/teléfono) o porque no tiene avalista ni propiedades.',
    imageAsset: '/assets/whatsapp/kit_05_garantia_30_min.png',
    visualWhatClientSees:
      'Otros bancos tradicionales le han rechazado automáticamente por un recibo antiguo en ASNEF o le piden un familiar que le avale.',
    visualSystemSteps: [
      'PASO 1: Tranquiliza al cliente explicándole que nuestro comité evalúa sus ingresos actuales de forma humana.',
      'PASO 2: Explícale que su operación incluye el Fondo Europeo de Garantías (FGA), por lo que NO necesita avalista.',
      'PASO 3: Envíale por WhatsApp la plantilla de "Cobertura con Fondo de Garantías sin Avalista".'
    ],
    greenMustDo: [
      'Aclarar que apuntes menores en ASNEF (telefonía, suministros, pequeños recibos) NO impiden la aprobación.',
      'Explicar que el Fondo Europeo de Garantías (FGA) actúa como su aval institucional automático.'
    ],
    redNeverDo: [
      'NUNCA tratar al cliente con superioridad por haber tenido una deuda en ASNEF.',
      'NUNCA pedirle que busque un avalista externo.'
    ],
    advisorTrainingAudioScript:
      'Instrucción para el asesor en la Etapa 4: Clientes con ASNEF o sin aval. Muchos clientes llegan asustados porque su banco les rechazó por una factura de teléfono en ASNEF. Explícales con calidez que en Instacredit miramos su capacidad de pago hoy y que gracias a nuestro Fondo Europeo de Garantías no necesitan molestar a ningún familiar como avalista ni hipotecar nada.',
    buildPhoneCallScript: (p) =>
      `"No se preocupe en absoluto por eso, ${p.clientFirstName}. A diferencia de la banca tradicional que rechaza automáticamente por una factura de teléfono o luz en ASNEF, en INSTACREDIT hacemos un estudio humano basado en sus ingresos actuales. Además, su solicitud ${p.radicadoId} por ${p.capitalAmount} cuenta con el respaldo automático de nuestro Fondo Europeo de Garantías, lo que significa que usted no necesita presentar ningún familiar como avalista ni poner propiedades en garantía."`,
    buildWhatsAppTemplate: (p) =>
      `🏛️ *RESPALDO SIN AVALISTA Y ESTUDIO FLEXIBLE (FONDO DE GARANTÍAS)*\n\n` +
      `Hola *${p.clientFirstName}*, te informo sobre el estudio de tu expediente *${p.radicadoId}* por *${p.capitalAmount}*:\n\n` +
      `✔️ *Sin Avalistas ni Propiedades:* Tu préstamo incluye la cobertura del *Fondo Europeo de Garantías (FGA)*, por lo que no necesitas molestar a ningún familiar.\n` +
      `✔️ *Flexibilidad ante ASNEF:* Evaluamos tus ingresos actuales de forma humana; pequeños recibos de suministros o telefonía no bloquean tu solicitud.\n` +
      `✔️ *Cuota Fija Protegida:* ${p.monthlyQuota}/mes sin subidas por inflación.\n\n` +
      `👉 *Revisa el avance de tu estudio en:*\n${p.portalUrl}\n\n` +
      `Seguimos avanzando con tu aprobación. Atentamente, *${p.advisorName}*.`,
    buildSmsTemplate: (p) =>
      `INSTACREDIT: ${p.clientFirstName}, tu solicitud ${p.radicadoId} (${p.capitalAmount}) incluye respaldo del Fondo de Garantias SIN necesidad de avalista. Ver: ${p.portalUrl}`,
    buildEmailSubject: (p) =>
      `[INSTACREDIT España] Cobertura del Fondo Europeo de Garantías Sin Aval - Exp. #${p.radicadoId}`,
    buildEmailBody: (p) =>
      `Estimado(a) ${p.clientName},\n\n` +
      `Le confirmamos que su expediente #${p.radicadoId} por importe de ${p.capitalAmount} cuenta con la cobertura institucional del Fondo Europeo de Garantías (FGA).\n\n` +
      `Gracias a este respaldo:\n` +
      `- No requiere presentar terceros avalistas ni garantías hipotecarias.\n` +
      `- Nuestro Comité de Riesgos evalúa su solvencia actual de manera personalizada y humana.\n\n` +
      `Consulte su expediente en: ${p.portalUrl}\n\n` +
      `Atentamente,\n${p.advisorName}\nINSTACREDIT España`
  },
  {
    id: 'stage-5-adulto-mayor-voz',
    stageNumber: 5,
    shortTitle: '5. Cliente Mayor o que No Entiende el Móvil (Guía por Voz)',
    badgeText: 'ETAPA 5 • ACCESIBILIDAD Y VOZ',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    whenToUse: 'Cuando el cliente es pensionista, adulto mayor o dice que le cuesta leer la letra pequeña o manejar internet.',
    imageAsset: '/assets/whatsapp/kit_03_formulario_voz.png',
    visualWhatClientSees:
      'El cliente se siente abrumado por la pantalla del móvil y teme tocar algo mal.',
    visualSystemSteps: [
      'PASO 1: Habla más despacio (puedes poner la velocidad de voz en 0.9x) y dale mucha calma.',
      'PASO 2: Pulsa el botón "🔊 Abrir / Enviar Formulario Didáctico con Voz" de abajo.',
      'PASO 3: Envíaselo por WhatsApp y quédate en línea telefónica mientras él toca el botón verde de altavoz.'
    ],
    greenMustDo: [
      'Tratar al cliente con máximo cariño, paciencia y respeto ("Don / Doña").',
      'Explicarle que nuestro Formulario Especial tiene letras gigantes y le habla en voz alta paso por paso.'
    ],
    redNeverDo: [
      'NUNCA decirle "pídale a su nieto o a su hijo que se lo haga".',
      'NUNCA apurarle ni colgarle mientras intenta abrir el enlace.'
    ],
    advisorTrainingAudioScript:
      'Instrucción para el asesor en la Etapa 5: Atención a personas mayores o con dificultad digital. Si notas que al cliente le cuesta usar el móvil o ver la pantalla, jamás te impacientes. Tenemos una herramienta única: el Formulario Didáctico Asistido con Voz. Pulsa el botón de enviar por WhatsApp de esta pantalla para mandarle el enlace directo y dile que solo tiene que tocar el botón verde con el dibujo del altavoz para que el teléfono le lea todo en voz alta.',
    buildPhoneCallScript: (p) =>
      `"No se preocupe absolutamente de nada, don/doña ${p.clientFirstName}. Para eso estoy yo aquí con usted, para acompañarle sin ninguna prisa. Le acabo de enviar a su WhatsApp un enlace muy especial pensado para verse con letras grandes y claras. Cuando lo abra, verá un botón verde con un altavoz: al tocarlo, el propio teléfono le irá explicando con voz alta y clara cada casilla paso a paso. Ábralo con calma que yo me quedo aquí al teléfono con usted."`,
    buildWhatsAppTemplate: (p) =>
      `🔊 *FORMULARIO FÁCIL CON ASISTENTE DE VOZ (LETRAS GRANDES)*\n\n` +
      `Hola *${p.clientFirstName}*, soy tu asesor *${p.advisorName}* de INSTACREDIT España.\n\n` +
      `Para que puedas completar tu trámite del expediente *${p.radicadoId}* (*${p.capitalAmount}*) con total comodidad y sin leer letra pequeña, he activado para ti nuestra *Guía Interactiva por Voz*:\n\n` +
      `1️⃣ *Toca el enlace azul de abajo.*\n` +
      `2️⃣ *Pulsa el botón verde "🔊 Escuchar Guía por Voz".*\n` +
      `3️⃣ *El teléfono te explicará todo en voz alta paso a paso.*\n\n` +
      `👉 *TOCA AQUÍ PARA ABRIR TU FORMULARIO CON VOZ:*\n${p.portalUrl}\n\n` +
      `Si tienes cualquier duda, escríbeme o llámame y lo hacemos juntos paso a paso. 🤝`,
    buildSmsTemplate: (p) =>
      `INSTACREDIT: Hola ${p.clientFirstName}, abre aqui tu Formulario Facil con Asistente de Voz y letras grandes para tu prestamo ${p.radicadoId}: ${p.portalUrl}`,
    buildEmailSubject: (p) =>
      `[Asistencia Guiada por Voz] Acceso Fácil a su Solicitud #${p.radicadoId} - INSTACREDIT España`,
    buildEmailBody: (p) =>
      `Estimado(a) ${p.clientName},\n\n` +
      `Hemos habilitado para su expediente #${p.radicadoId} (${p.capitalAmount}) nuestro Formulario Didáctico Asistido por Voz, diseñado con tipografía de alta visibilidad y lectura automática en español.\n\n` +
      `Acceda directamente pulsando aquí:\n${p.portalUrl}\n\n` +
      `Su asesor personal ${p.advisorName} está a su entera disposición para guiarle paso a paso.\n\n` +
      `Con todo nuestro afecto y respeto,\n${p.advisorName}\nINSTACREDIT España`
  },
  {
    id: 'stage-6-aprobacion-firma-eidas',
    stageNumber: 6,
    shortTitle: '6. Préstamo Aprobado y Firma de Pagaré en Móvil (eIDAS)',
    badgeText: 'ETAPA 6 • APROBACIÓN Y FIRMA',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    whenToUse: 'Cuando el préstamo pasa a estado "Aprobado" y hay que felicitar al cliente y guiarle para firmar el Pagaré Digital con código SMS.',
    imageAsset: '/assets/whatsapp/kit_09_aprobacion_oficial.png',
    visualWhatClientSees:
      'El cliente recibe la gran noticia de que su préstamo está aprobado y ahora debe dibujar su firma con el dedo y poner el código OTP de 6 números.',
    visualSystemSteps: [
      'PASO 1: ¡Felicita al cliente con entusiasmo! Su préstamo ya está APROBADO.',
      'PASO 2: Envíale por WhatsApp y Correo el Certificado de Aprobación e Instrucciones de Firma eIDAS.',
      'PASO 3: Explícale cómo dibujar su firma con el dedo en el recuadro blanco y validar con el código SMS gratuito.'
    ],
    greenMustDo: [
      'Confirmar el importe exacto aprobado, la cuota mensual fija y la fecha del primer pago.',
      'Explicar que la firma electrónica eIDAS (Reglamento UE 910/2014) evita tener que desplazarse a una notaría física.'
    ],
    redNeverDo: [
      'NUNCA firmar tú por el cliente; la firma debe trazarla el titular en su dispositivo.',
      'NUNCA olvidar recordarle que pulse el botón "Confirmar y Firmar Pagaré" al terminar.'
    ],
    advisorTrainingAudioScript:
      'Instrucción para el asesor en la Etapa 6: Préstamo Aprobado y Firma Digital. ¡Esta es la llamada más alegre! Felicita al cliente porque su crédito ha sido aprobado. Ahora solo falta un paso: que firme desde su móvil el Contrato y Pagaré Digital eIDAS. Explícale que solo debe abrir el enlace que le mandas por WhatsApp, dibujar su firma con el dedo en el recuadro y escribir el código de 6 números del SMS para activar su desembolso.',
    buildPhoneCallScript: (p) =>
      `"¡Enhorabuena, ${p.clientFirstName}! Le llamo de INSTACREDIT España para darle una excelente noticia: nuestro Comité ha APROBADO oficialmente su préstamo del expediente ${p.radicadoId} por importe de ${p.capitalAmount}, con una cuota mensual fija de ${p.monthlyQuota}. Para no hacerle perder tiempo yendo a una notaría física, ya tiene listo su Pagaré Digital en el móvil bajo normativa europea eIDAS. Solo tiene que abrir el enlace que le acabo de mandar por WhatsApp, dibujar su firma con el dedo en la pantalla e introducir el código de 6 dígitos que le llega por SMS. En cuanto firme, pasamos el dinero a su cuenta."`,
    buildWhatsAppTemplate: (p) =>
      `🎉 *¡ENHORABUENA, ${p.clientFirstName.toUpperCase()}! TU PRÉSTAMO HA SIDO APROBADO*\n\n` +
      `El Comité de Crédito de *INSTACREDIT España* ha *APROBADO* oficialmente tu operación:\n\n` +
      `✅ *Expediente:* ${p.radicadoId}\n` +
      `✅ *Capital Aprobado:* *${p.capitalAmount}*\n` +
      `✅ *Cuota Fija Mensual:* ${p.monthlyQuota} (${p.termMonths} meses)\n` +
      `✅ *Cuenta Digital Asignada:* ${p.digitalIban}\n\n` +
      `✍️ *ÚLTIMO PASO — FIRMA DIGITAL eIDAS DESDE TU MÓVIL (2 MINUTOS):*\n` +
      `1. Entra al enlace oficial de abajo.\n` +
      `2. Dibuja tu firma con el dedo en el recuadro de firma biométrica.\n` +
      `3. Introduce el código gratuito de 6 dígitos (OTP SMS) para sellar tu Pagaré Digital.\n\n` +
      `👉 *ENTRA AQUÍ PARA FIRMAR Y RECIBIR TU DINERO:*\n${p.portalUrl}\n\n` +
      `¡Avísame por aquí apenas lo firmes para ordenar tu transferencia inmediata! 🚀 — *${p.advisorName}*`,
    buildSmsTemplate: (p) =>
      `ENHORABUENA ${p.clientFirstName}! Tu prestamo INSTACREDIT ${p.radicadoId} por ${p.capitalAmount} esta APROBADO. Firma tu pagare digital eIDAS aqui: ${p.portalUrl}`,
    buildEmailSubject: (p) =>
      `🎉 ¡ENHORABUENA! Resolución de Aprobación Oficial (${p.capitalAmount}) y Firma eIDAS - Exp. #${p.radicadoId}`,
    buildEmailBody: (p) =>
      `Estimado(a) ${p.clientName},\n\n` +
      `Nos complace notificarle que el Comité de Riesgos de INSTACREDIT ESPAÑA FINTECH S.L. ha APROBADO su solicitud de préstamo personal #${p.radicadoId}.\n\n` +
      `CONDICIONES APROBADAS:\n` +
      `- Capital Aprobado: ${p.capitalAmount}\n` +
      `- Cuota Mensual Fija: ${p.monthlyQuota} durante ${p.termMonths} meses\n` +
      `- Cuenta Digital IBAN Asignada: ${p.digitalIban}\n\n` +
      `INSTRUCCIONES DE FIRMA ELECTRÓNICA (Reglamento UE Nº 910/2014 eIDAS):\n` +
      `Acceda al enlace adjunto desde su teléfono móvil, trace su firma en el panel táctil y valide el código OTP de 6 dígitos para proceder al desembolso inmediato:\n${p.portalUrl}\n\n` +
      `Felicitaciones,\n${p.advisorName}\nINSTACREDIT España`
  },
  {
    id: 'stage-7-desembolso-bizum',
    stageNumber: 7,
    shortTitle: '7. Dinero Desembolsado en Cuenta IBAN y Retiro Bizum / SEPA',
    badgeText: 'ETAPA 7 • DESEMBOLSO Y RETIRO',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    whenToUse: 'Cuando el préstamo ya está en estado "Desembolsado" y quieres avisar al cliente de que ya tiene sus fondos y cómo retirarlos o pagar cuotas.',
    imageAsset: '/assets/whatsapp/kit_12_fondos_disponibles.png',
    visualWhatClientSees:
      'El cliente entra a su Portal de Banca Digital y ve su saldo cargado con el 100% del capital aprobado.',
    visualSystemSteps: [
      'PASO 1: Comprueba que el estado del expediente sea "Desembolsado" y el saldo esté acreditado.',
      'PASO 2: Envíale por WhatsApp el comprobante de Fondos Disponibles con su IBAN.',
      'PASO 3: Recuérdale su fecha de primer vencimiento y que puede amortizar antes con 0% de comisión.'
    ],
    greenMustDo: [
      'Informar que ya puede transferir desde su Cuenta Digital Instacredit a su banco habitual vía SEPA Instant o Bizum.',
      'Recordarle que si paga puntualmente podrá ampliar su cupo hasta 100.000 € en futuras operaciones.'
    ],
    redNeverDo: [
      'NUNCA olvidar registrar el desembolso y el envío del comprobante en la Bitácora del expediente.'
    ],
    advisorTrainingAudioScript:
      'Instrucción para el asesor en la Etapa 7: Confirmación de Desembolso. Cuando el dinero ya ha sido desembolsado en la Cuenta Digital IBAN del cliente, envíale de inmediato la notificación oficial por WhatsApp, SMS o correo. Explícale cómo entrar a su Bóveda Digital para retirar el dinero a su banco por transferencia SEPA inmediata o Bizum, y recuérdale con amabilidad la fecha de su primera cuota.',
    buildPhoneCallScript: (p) =>
      `"¡Excelentes noticias, ${p.clientFirstName}! Le confirmo que acabamos de completar el desembolso de sus ${p.capitalAmount} correspondientes al expediente ${p.radicadoId}. Ya tiene el 100% de los fondos disponibles en su Cuenta Digital IBAN ${p.digitalIban} para transferirlos en segundos a su banco habitual mediante transferencia SEPA inmediata o Bizum. Recuerde que su primera cuota fija será el día ${p.dueDate} y que puede adelantar pagos cuando quiera con 0% de comisión. Le acabo de mandar el justificante oficial a su WhatsApp."`,
    buildWhatsAppTemplate: (p) =>
      `💶 *¡FONDOS DESEMBOLSADOS Y DISPONIBLES EN TU CUENTA DIGITAL!*\n\n` +
      `Hola *${p.clientFirstName}*, te confirmamos que la tesorería de *INSTACREDIT España* ha completado el desembolso de tu préstamo:\n\n` +
      `🏦 *DETALLE DE LA OPERACIÓN LIQUIDA:*\n` +
      `• *Expediente:* ${p.radicadoId}\n` +
      `• *Importe Acreditado (100%):* *${p.capitalAmount}*\n` +
      `• *Cuenta Digital IBAN:* ${p.digitalIban}\n` +
      `• *Vencimiento Próxima Cuota:* ${p.dueDate} (${p.monthlyQuota})\n` +
      `• *Comisión por Pago Anticipado:* *0,00 % (Ley 16/2011)*\n\n` +
      `📲 *Accede aquí a tu Bóveda Digital para transferir a tu banco por SEPA Instant o Bizum:*\n${p.portalUrl}\n\n` +
      `Gracias por confiar en nosotros. Quedo a tu disposición, *${p.advisorName}*. 🤝`,
    buildSmsTemplate: (p) =>
      `INSTACREDIT: ${p.clientFirstName}, tus ${p.capitalAmount} (Exp. ${p.radicadoId}) ya estan DESEMBOLSADOS en tu Cuenta Digital ${p.digitalIban}. Retira en: ${p.portalUrl}`,
    buildEmailSubject: (p) =>
      `💶 Justificante Oficial de Desembolso (${p.capitalAmount}) - Expediente #${p.radicadoId}`,
    buildEmailBody: (p) =>
      `Estimado(a) ${p.clientName},\n\n` +
      `El Departamento de Tesorería SEPA de INSTACREDIT ESPAÑA FINTECH S.L. le confirma que se ha efectuado el desembolso íntegro de su préstamo personal #${p.radicadoId}.\n\n` +
      `RESUMEN DE LIQUIDACIÓN:\n` +
      `- Importe Neto Acreditado: ${p.capitalAmount}\n` +
      `- Cuenta Digital IBAN: ${p.digitalIban}\n` +
      `- Fecha de Vencimiento de Cuota: ${p.dueDate}\n\n` +
      `Acceda a su portal bancario para gestionar sus transferencias SEPA o Bizum y descargar su recibo oficial en PDF:\n${p.portalUrl}\n\n` +
      `Atentamente,\n${p.advisorName}\nINSTACREDIT España`
  },
  {
    id: 'stage-8-prorroga-alivio-sac',
    stageNumber: 8,
    shortTitle: '8. Retraso de Cuota / Prórroga (+15, +30, +45 días) y SAC',
    badgeText: 'ETAPA 8 • ALIVIO Y CERO ACOSO',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    whenToUse: 'Cuando un cliente avisa que no llega a pagar su cuota a tiempo (retraso de sueldo, imprevisto) o desea presentar una reclamación SAC.',
    imageAsset: '/assets/whatsapp/kit_14_alivio_prorroga.png',
    visualWhatClientSees:
      'El cliente tiene miedo de que le cobren recargos abusivos, le llamen para acosarle o le metan en ASNEF mañana mismo.',
    visualSystemSteps: [
      'PASO 1: Aplica la Regla de Oro #3: CERO ACOSO. Agradécele por ser honesto y avisar a tiempo.',
      'PASO 2: Ofrécele activar una Prórroga Oficial de +15, +30 o +45 días sin reporte a ASNEF.',
      'PASO 3: Envíale por WhatsApp el enlace al "Formulario #4 de Solicitud de Prórroga y Alivio Financiero".'
    ],
    greenMustDo: [
      'Tranquilizar al cliente inmediatamente: si pide su prórroga antes del vencimiento, su historial queda 100% limpio.',
      'Si el cliente quiere poner una queja formal, abrirle el Formulario #5 del Servicio de Atención al Cliente (SAC Banco de España).'
    ],
    redNeverDo: [
      'NUNCA amenazar con embargos, juzgados ni llamadas a su empresa.',
      'NUNCA negar el acceso a la hoja oficial de reclamaciones del SAC.'
    ],
    advisorTrainingAudioScript:
      'Instrucción para el asesor en la Etapa 8: Retraso de pago y prórrogas. En Instacredit España aplicamos una política estricta de Cero Acoso. Si un cliente te llama angustiado porque este mes cobró tarde o tuvo una urgencia médica, agradécele por avisar. Dile que vamos a proteger su historial activando una prórroga legal de 15, 30 o 45 días para que no tenga recargos de mora ni entre en ASNEF. Envíale ahora mismo la plantilla de WhatsApp con el formulario de prórroga.',
    buildPhoneCallScript: (p) =>
      `"Primero que todo, respire con total tranquilidad, ${p.clientFirstName}, y muchas gracias por su honestidad al avisarnos con tiempo. En INSTACREDIT España somos asesores humanos y jamás aplicamos prácticas de acoso. Como usted nos está avisando de buena fe, vamos a proteger su expediente ${p.radicadoId} activándole hoy mismo una Prórroga Oficial de Alivio Financiero de 15, 30 o 45 días. Así adaptamos la fecha al día que usted cobre su nómina o pensión, sin ningún recargo por mora y sin ningún reporte a ASNEF. Le acabo de enviar el enlace a su WhatsApp para dejarlo firmado en un minuto."`,
    buildWhatsAppTemplate: (p) =>
      `🤝 *PROGRAMA DE ALIVIO FINANCIERO Y PRÓRROGA SIN RECARGOS (CERO ACOSO)*\n\n` +
      `Hola *${p.clientFirstName}*, te escribe tu asesor *${p.advisorName}* de INSTACREDIT España.\n\n` +
      `Agradecemos tu honestidad al comunicarte con nosotros respecto a tu expediente *${p.radicadoId}*. Para proteger tu tranquilidad y tu historial crediticio, hemos habilitado para ti una *Prórroga Oficial de Vencimiento*:\n\n` +
      `🟢 *Opciones de Aplazamiento:* +15 días, +30 días o +45 días naturales.\n` +
      `🟢 *Protección ASNEF/EQUIFAX:* Tu historial se mantiene 100% limpio al día.\n` +
      `🟢 *Trato Digno (Código Buenas Prácticas BdE):* Cero penalizaciones por mora.\n\n` +
      `👉 *ACTIVA AQUÍ TU PRÓRROGA CON ASISTENCIA POR VOZ:*\n${p.portalUrl}\n\n` +
      `Cuenta con todo nuestro apoyo humano. Quedo pendiente para confirmarte el nuevo calendario. 🙌`,
    buildSmsTemplate: (p) =>
      `INSTACREDIT ALIVIO: Hola ${p.clientFirstName}, protege tu expediente ${p.radicadoId} sin recargos ni ASNEF solicitando tu prorroga de 15/30/45 dias aqui: ${p.portalUrl}`,
    buildEmailSubject: (p) =>
      `[Programa de Alivio Financiero] Activación de Prórroga Sin Penalización - Exp. #${p.radicadoId}`,
    buildEmailBody: (p) =>
      `Estimado(a) ${p.clientName},\n\n` +
      `En virtud de nuestra política institucional de Préstamo Responsable y Código de Buenas Prácticas del Banco de España, le informamos que tiene a su disposición la activación de una Prórroga Oficial de +15, +30 o +45 días para su expediente #${p.radicadoId}.\n\n` +
      `Este acuerdo congela cualquier recargo por demora y garantiza que no se realice ningún reporte a ficheros de solvencia (ASNEF/EQUIFAX).\n\n` +
      `Formalice su solicitud de aplazamiento o acceda al Servicio de Atención al Cliente (SAC) en:\n${p.portalUrl}\n\n` +
      `Con todo nuestro respaldo,\n${p.advisorName}\nINSTACREDIT España`
  }
];

export const CallCenterLiveCopilot: React.FC<CallCenterLiveCopilotProps> = ({
  preselectedAppId,
  onOpenDidacticForm
}) => {
  const { applications, currentAdvisor, logAdvisorAction, openDocumentModal } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(
    preselectedAppId || applications[0]?.id || ''
  );
  const [selectedStageId, setSelectedStageId] = useState<string>(CALL_CENTER_STAGES[0].id);
  const [activeSendFormat, setActiveSendFormat] = useState<'whatsapp' | 'sms' | 'email' | 'herramientas'>('whatsapp');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Custom override if agent is talking to a lead not yet in the list
  const [useCustomClient, setUseCustomClient] = useState<boolean>(false);
  const [customClientName, setCustomClientName] = useState<string>('María Carmen Gómez');
  const [customClientPhone, setCustomClientPhone] = useState<string>('612345678');
  const [customClientEmail, setCustomClientEmail] = useState<string>('cliente@correo.es');
  const [customCapital, setCustomCapital] = useState<number>(6000);

  // Audio speech state
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Copy & send feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionBanner, setActionBanner] = useState<string | null>(null);
  const [isDispatchingKit, setIsDispatchingKit] = useState<boolean>(false);

  const currentApp = useMemo(
    () => applications.find((a) => a.id === selectedAppId) || applications[0],
    [applications, selectedAppId]
  );

  // Build dynamic parameters for all templates
  const templateParams: CopilotTemplateParams = useMemo(() => {
    const portalUrl = typeof window !== 'undefined' ? window.location.origin : 'https://instacredit.es';
    if (useCustomClient || !currentApp) {
      const firstName = customClientName.trim().split(' ')[0] || 'Cliente';
      return {
        clientName: customClientName || 'Estimado(a) Cliente',
        clientFirstName: firstName,
        clientPhone: customClientPhone || '600000000',
        clientEmail: customClientEmail || 'cliente@correo.es',
        capitalAmount: formatEUR(customCapital),
        monthlyQuota: formatEUR(Math.round((customCapital / 24) * 1.19)),
        termMonths: 24,
        radicadoId: 'INSTA-ES-884920',
        digitalIban: 'ES91 2100 0418 4502 0005 9981',
        dueDate: '05 de noviembre de 2026',
        advisorName: currentAdvisor.name,
        advisorRole: currentAdvisor.roleTitle,
        portalUrl
      };
    }

    const fullName = `${currentApp.personalData.firstName} ${currentApp.personalData.lastName}`;
    const computedMonths = Math.max(1, Math.round((currentApp.loanDetails.termDays || 360) / 30));
    const computedMonthlyQuota = Math.round(
      (currentApp.loanDetails.totalToPay || currentApp.loanDetails.capital * 1.19) / computedMonths
    );
    return {
      clientName: fullName,
      clientFirstName: currentApp.personalData.firstName,
      clientPhone: currentApp.personalData.phone,
      clientEmail: currentApp.personalData.email,
      capitalAmount: formatEUR(currentApp.approvedAmount || currentApp.loanDetails.capital),
      monthlyQuota: formatEUR(computedMonthlyQuota),
      termMonths: computedMonths,
      radicadoId: currentApp.id,
      digitalIban: currentApp.digitalAccount.accountNumber,
      dueDate: currentApp.loanDetails.dueDate,
      advisorName: currentAdvisor.name,
      advisorRole: currentAdvisor.roleTitle,
      portalUrl
    };
  }, [
    useCustomClient,
    currentApp,
    customClientName,
    customClientPhone,
    customClientEmail,
    customCapital,
    currentAdvisor
  ]);

  // Auto-recommend stage based on selected customer's status
  const recommendedStageId = useMemo(() => {
    if (!currentApp || useCustomClient) return CALL_CENTER_STAGES[0].id;
    if (currentApp.status === 'Pendiente') return 'stage-1-bienvenida';
    if (currentApp.status === 'En Revisión') return 'stage-2-documentos-iban';
    if (currentApp.status === 'Aprobado') return 'stage-6-aprobacion-firma-eidas';
    if (currentApp.status === 'Desembolsado') return 'stage-7-desembolso-bizum';
    return 'stage-8-prorroga-alivio-sac';
  }, [currentApp, useCustomClient]);

  const activeStage = useMemo(
    () => CALL_CENTER_STAGES.find((s) => s.id === selectedStageId) || CALL_CENTER_STAGES[0],
    [selectedStageId]
  );

  const filteredStages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CALL_CENTER_STAGES;
    return CALL_CENTER_STAGES.filter(
      (s) =>
        s.shortTitle.toLowerCase().includes(q) ||
        s.whenToUse.toLowerCase().includes(q) ||
        s.visualWhatClientSees.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Speech Synthesis Helper
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

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  const triggerBanner = (msg: string) => {
    setActionBanner(msg);
    setTimeout(() => setActionBanner(null), 4000);
  };

  const handleCopy = (id: string, text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerBanner(`✅ ${label} copiado al portapapeles y listo para pegar y enviar.`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Auto-log helper when advisor sends a template to the client
  const recordSentTemplateInLog = (channelLabel: string, actionType: 'whatsapp' | 'llamada' | 'email') => {
    if (!useCustomClient && currentApp) {
      logAdvisorAction(currentApp.id, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType,
        summary: `[Copiloto Call Center] Envío de plantilla (${channelLabel}) — ${activeStage.shortTitle}`,
        clientNotes: `Asesor utilizó asistencia visual/auditiva y envió plantilla oficial a ${templateParams.clientName}.`
      });
    }
  };

  // 1-Click Send Handlers
  const handleSendWhatsAppDirect = () => {
    const text = activeStage.buildWhatsAppTemplate(templateParams);
    const cleanPhone = templateParams.clientPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('34') ? cleanPhone : `34${cleanPhone}`;
    navigator.clipboard.writeText(text);
    recordSentTemplateInLog('WhatsApp Directo', 'whatsapp');
    triggerBanner(`📲 Plantilla copiada y abriendo WhatsApp de ${templateParams.clientFirstName} (+${phoneWithCountry})...`);
    window.open(
      `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleDispatchVisualKitAndText = async () => {
    setIsDispatchingKit(true);
    const text = activeStage.buildWhatsAppTemplate(templateParams);
    try {
      const res = await dispatchKitInOneAction({
        imageSrc: activeStage.imageAsset,
        imageTitle: activeStage.shortTitle,
        messageText: text,
        clientPhone: templateParams.clientPhone,
        clientName: templateParams.clientName,
        kitId: activeStage.id
      });
      recordSentTemplateInLog('Kit Visual + Texto WhatsApp', 'whatsapp');
      triggerBanner(res.message);
    } finally {
      setIsDispatchingKit(false);
    }
  };

  const handleSendSmsDirect = () => {
    const smsText = activeStage.buildSmsTemplate(templateParams);
    const cleanPhone = templateParams.clientPhone.replace(/\D/g, '');
    navigator.clipboard.writeText(smsText);
    recordSentTemplateInLog('SMS Oficial', 'email');
    triggerBanner(`💬 SMS copiado y abriendo aplicación de mensajes para ${templateParams.clientPhone}...`);
    window.location.href = `sms:+34${cleanPhone}?body=${encodeURIComponent(smsText)}`;
  };

  const handleSendEmailDirect = () => {
    const subject = activeStage.buildEmailSubject(templateParams);
    const body = activeStage.buildEmailBody(templateParams);
    navigator.clipboard.writeText(`${subject}\n\n${body}`);
    recordSentTemplateInLog('Correo Electrónico Oficial', 'email');
    triggerBanner(`📧 Correo oficial preparado para ${templateParams.clientEmail} y registrado en bitácora.`);
    window.location.href = `mailto:${templateParams.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const phoneScriptText = activeStage.buildPhoneCallScript(templateParams);
  const whatsappText = activeStage.buildWhatsAppTemplate(templateParams);
  const smsText = activeStage.buildSmsTemplate(templateParams);
  const emailSubject = activeStage.buildEmailSubject(templateParams);
  const emailBody = activeStage.buildEmailBody(templateParams);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP BANNER: COPILOTO DE CALL CENTER (ASISTENCIA VISUAL, AUDITIVA Y ENVÍO) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#0B1B3D] via-[#0E275C] to-[#0044CC] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/60 print:bg-white print:text-black print:border-b-2 print:border-black">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00E599] text-[#0B1B3D] text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Headphones className="w-3.5 h-3.5" />
                Asistente de Call Center en Vivo • Auditivo + Visual + Escrito
              </span>
              <span className="bg-white/15 text-blue-100 text-xs font-bold px-3 py-0.5 rounded-full">
                Especial para Personal Sin Experiencia Previa
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Copiloto Interactivo de Atención al Cliente y Envío de Plantillas en 1 Clic
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Esta herramienta guía a cualquier operador de Call Center paso a paso: <strong>1) Escucha en audio qué hacer</strong>, <strong>2) Escucha cómo hablarle al cliente</strong>, <strong>3) Mira el semáforo visual</strong> y <strong>4) Envía en 1 clic la plantilla lista por WhatsApp, SMS, Correo o Formulario con Voz</strong>.
            </p>
          </div>

          {/* Global Voice Coach Bar */}
          <div className="flex flex-col gap-2.5 bg-blue-950/80 p-4 rounded-2xl border border-blue-800 shrink-0 print:hidden">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#00E599] flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              <span>Control General de Voz (es-ES)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  speakText(
                    'copilot-full-audio',
                    `${activeStage.advisorTrainingAudioScript} Y ahora escucha cómo debes decírselo al cliente por teléfono: ${phoneScriptText}`
                  )
                }
                className={`px-4 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-md ${
                  speakingId === 'copilot-full-audio'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D]'
                }`}
              >
                {speakingId === 'copilot-full-audio' ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Detener Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>🔊 Escuchar Qué Hacer + Qué Decir</span>
                  </>
                )}
              </button>

              {speakingId && (
                <button
                  type="button"
                  onClick={stopSpeech}
                  className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                  title="Silenciar voz inmediatamente"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-blue-900">
              <span className="text-blue-200 font-semibold">Velocidad de lectura:</span>
              <div className="flex gap-1">
                {[0.9, 1.0, 1.15].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSpeechRate(r)}
                    className={`px-2 py-0.5 rounded-md font-bold text-[11px] cursor-pointer ${
                      speechRate === r ? 'bg-[#0066FF] text-white' : 'text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-xs sm:text-sm font-black flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionBanner(null)}
            className="text-xs font-bold text-emerald-800 underline cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BARRA 1: SELECTOR DE CLIENTE (PERSONALIZA TODAS LAS PLANTILLAS AL INSTANTE) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] font-black">
              1
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wide">
                Paso 1: Selecciona al Cliente que estás atendiendo ahora mismo
              </h3>
              <p className="text-xs text-slate-500">
                Todos los guiones hablados, WhatsApp, SMS y Correos se rellenan solos con su nombre, teléfono, importe y expediente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUseCustomClient(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                !useCustomClient
                  ? 'bg-[#0B1B3D] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📋 Clientes en Sistema ({applications.length})
            </button>
            <button
              type="button"
              onClick={() => setUseCustomClient(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                useCustomClient
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ✍️ Escribir Cliente Nuevo Manual
            </button>
          </div>
        </div>

        {!useCustomClient ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="lg:col-span-6">
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                Cliente Activo en Cartera:
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedAppId(newId);
                  const found = applications.find((a) => a.id === newId);
                  if (found) {
                    if (found.status === 'Pendiente') setSelectedStageId('stage-1-bienvenida');
                    else if (found.status === 'En Revisión') setSelectedStageId('stage-2-documentos-iban');
                    else if (found.status === 'Aprobado') setSelectedStageId('stage-6-aprobacion-firma-eidas');
                    else if (found.status === 'Desembolsado') setSelectedStageId('stage-7-desembolso-bizum');
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-black text-[#0B1B3D] cursor-pointer"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.personalData.firstName} {app.personalData.lastName} — {app.id} — Estado: {app.status} ({formatEUR(app.approvedAmount || app.loanDetails.capital)})
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs space-y-0.5">
                <div className="font-black text-[#0B1B3D]">
                  📱 Móvil: <span className="font-mono text-[#0066FF]">{templateParams.clientPhone}</span> • 💶 Capital: <span className="text-emerald-700">{templateParams.capitalAmount}</span>
                </div>
                <div className="text-slate-500">
                  ✉️ {templateParams.clientEmail} • Cuota: {templateParams.monthlyQuota}/mes
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStageId(recommendedStageId)}
                className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-black flex items-center gap-1.5 cursor-pointer transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Ir a Etapa Recomendada ({currentApp?.status})</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre del Cliente</label>
              <input
                type="text"
                value={customClientName}
                onChange={(e) => setCustomClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Móvil WhatsApp (+34)</label>
              <input
                type="text"
                value={customClientPhone}
                onChange={(e) => setCustomClientPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={customClientEmail}
                onChange={(e) => setCustomClientEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Importe Solicitado (€)</label>
              <input
                type="number"
                value={customCapital}
                onChange={(e) => setCustomCapital(Number(e.target.value) || 2000)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BARRA 2: SELECTOR VISUAL DE LAS 8 SITUACIONES DE CALL CENTER */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black">
              2
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wide">
                Paso 2: Elige qué situación o pregunta tiene el cliente
              </h3>
              <p className="text-xs text-slate-500">
                Haz clic en cualquiera de los 8 escenarios para ver qué hacer, escuchar el audio y enviar la plantilla exacta.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar situación (ej. DNI, ASNEF, firma)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {filteredStages.map((stage) => {
            const isSelected = stage.id === activeStage.id;
            const isRecommended = stage.id === recommendedStageId && !useCustomClient;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0B1B3D] text-white border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/30'
                    : 'bg-slate-50/80 hover:bg-white text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isSelected ? 'bg-[#00E599] text-[#0B1B3D] border-transparent' : stage.badgeColor
                    }`}
                  >
                    {stage.badgeText}
                  </span>
                  {isRecommended && (
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                      ★ Sugerida
                    </span>
                  )}
                </div>
                <div className={`text-xs font-black leading-snug ${isSelected ? 'text-white' : 'text-[#0B1B3D]'}`}>
                  {stage.shortTitle}
                </div>
                <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                  {stage.whenToUse}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PANEL PRINCIPAL SINCRONIZADO: VISUAL + AUDITIVO + HABLADO + ENVÍO EN 1 CLIC */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA (5 COLS): ASISTENCIA VISUAL + ENTRENADOR AUDITIVO PARA EL ASESOR */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Asistencia Auditiva Doble */}
          <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#0066FF] flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                1. Asistencia Auditiva (Escucha antes de actuar)
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full">
                Voz Español (es-ES)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Si eres nuevo en el Call Center, pulsa el <strong>Botón Azul</strong> para que el sistema te explique al oído qué debes hacer, o el <strong>Botón Verde</strong> para escuchar cómo debes hablarle al cliente:
            </p>

            <div className="space-y-2.5">
              {/* Audio 1: Susurro capacitador para el empleado */}
              <button
                type="button"
                onClick={() => speakText(`coach-${activeStage.id}`, activeStage.advisorTrainingAudioScript)}
                className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                  speakingId === `coach-${activeStage.id}`
                    ? 'bg-red-600 text-white border-red-700 animate-pulse'
                    : 'bg-[#0066FF] hover:bg-blue-700 text-white border-blue-700 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 shrink-0 text-[#00E599]" />
                  <div>
                    <div className="text-xs font-black uppercase">
                      {speakingId === `coach-${activeStage.id}`
                        ? '⏹️ Detener Explicación del Asesor'
                        : '🎧 Audio 1: Escuchar Qué Debo Hacer (Capacitación)'}
                    </div>
                    <div className="text-[11px] text-blue-100">
                      Te explica en palabras sencillas qué hacer en esta situación
                    </div>
                  </div>
                </div>
                <Volume2 className="w-4 h-4 shrink-0" />
              </button>

              {/* Audio 2: Locución modelo para hablarle al cliente */}
              <button
                type="button"
                onClick={() => speakText(`script-${activeStage.id}`, phoneScriptText)}
                className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                  speakingId === `script-${activeStage.id}`
                    ? 'bg-red-600 text-white border-red-700 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 shrink-0 text-amber-300" />
                  <div>
                    <div className="text-xs font-black uppercase">
                      {speakingId === `script-${activeStage.id}`
                        ? '⏹️ Detener Locución del Guion'
                        : '🗣️ Audio 2: Escuchar Cómo Hablarle al Cliente'}
                    </div>
                    <div className="text-[11px] text-emerald-100">
                      Escucha la entonación exacta con los datos de {templateParams.clientFirstName}
                    </div>
                  </div>
                </div>
                <Volume2 className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* Texto escrito del entrenador para lectura rápida */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-black text-[#0B1B3D] block">
                💡 Resumen de capacitación para ti:
              </span>
              <p className="leading-relaxed">{activeStage.advisorTrainingAudioScript}</p>
            </div>
          </div>

          {/* Card 2: Asistencia Visual Paso a Paso + Semáforo */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#0B1B3D] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#0066FF]" />
                2. Guía Visual Paso a Paso y Semáforo de Reglas
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <strong className="font-black uppercase block mb-0.5 text-amber-900">
                👀 ¿Qué está viviendo el cliente ahora mismo?:
              </strong>
              <span>{activeStage.visualWhatClientSees}</span>
            </div>

            {/* Pasos visuales numerados */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase text-slate-500 block">
                🖱️ Pasos visuales que debes seguir en tu pantalla:
              </span>
              {activeStage.visualSystemSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-[#0B1B3D] text-[#00E599] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Semáforo Verde / Rojo */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-1.5">
                <div className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>🟢 LO QUE SÍ DEBES HACER SIEMPRE:</span>
                </div>
                <ul className="space-y-1 text-xs text-emerald-950">
                  {activeStage.greenMustDo.map((g, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-black text-emerald-600">✓</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 space-y-1.5">
                <div className="text-xs font-black uppercase text-red-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>🔴 PROHIBIDO DECIR O HACER:</span>
                </div>
                <ul className="space-y-1 text-xs text-red-950">
                  {activeStage.redNeverDo.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-black text-red-600">✗</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (7 COLS): GUION TELEFÓNICO + TODAS LAS PLANTILLAS LISTAS PARA ENVIAR */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 3: Teleprompter de Llamada Telefónica */}
          <div className="bg-white rounded-3xl border-2 border-emerald-400 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black uppercase flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  3. Guion Exacto para Leer por Teléfono (Teleprompter)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakText(`teleprompter-${activeStage.id}`, phoneScriptText)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>🔊 Escuchar Guion</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(`call-${activeStage.id}`, phoneScriptText, 'Guion telefónico')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === `call-${activeStage.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Guion</span>
                    </>
                  )}
                </button>
                <a
                  href={`tel:${templateParams.clientPhone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0B1B3D] hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#00E599]" />
                  <span>Llamar a {templateParams.clientFirstName}</span>
                </a>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {phoneScriptText}
            </div>
          </div>

          {/* Card 4: Centro Multicanal de Plantillas Listas para Enviar por el Asesor */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black uppercase text-[#0066FF] flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  4. Plantillas Escritas Listas para que el Asesor las Envíe al Cliente
                </span>
                <h4 className="text-lg font-black text-[#0B1B3D] mt-0.5">
                  Elige el Formato de Envío (WhatsApp, SMS, Correo o Formulario con Voz)
                </h4>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start print:hidden"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>🖨️ Imprimir Ficha</span>
              </button>
            </div>

            {/* Format Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 print:hidden">
              <button
                type="button"
                onClick={() => setActiveSendFormat('whatsapp')}
                className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition ${
                  activeSendFormat === 'whatsapp'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>1. WhatsApp Oficial</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSendFormat('sms')}
                className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition ${
                  activeSendFormat === 'sms'
                    ? 'bg-[#0066FF] text-white border-blue-700 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>2. SMS Directo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSendFormat('email')}
                className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition ${
                  activeSendFormat === 'email'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>3. Correo Oficial</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSendFormat('herramientas')}
                className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition ${
                  activeSendFormat === 'herramientas'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>4. Formularios Voz & PDF</span>
              </button>
            </div>

            {/* FORMAT 1: WHATSAPP TEMPLATE + VISUAL CARD */}
            {activeSendFormat === 'whatsapp' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Visual Card Preview */}
                  <div className="md:col-span-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">
                      🖼️ Tarjeta Visual Adjunta:
                    </span>
                    <img
                      src={activeStage.imageAsset}
                      alt={activeStage.shortTitle}
                      className="w-full h-40 object-cover rounded-xl border border-slate-200"
                    />
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Se adjunta automáticamente al pulsar &ldquo;Enviar Kit Visual + Texto&rdquo;.
                    </p>
                  </div>

                  {/* WhatsApp Text Preview */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-800 uppercase">
                        📲 Mensaje de WhatsApp Personalizado para {templateParams.clientFirstName}:
                      </span>
                      <button
                        type="button"
                        onClick={() => speakText(`wa-${activeStage.id}`, whatsappText)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>🔊 Escuchar</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-[#E7FFDB] border border-emerald-300 text-xs text-slate-900 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
                      {whatsappText}
                    </pre>
                  </div>
                </div>

                {/* 1-Click Send Buttons for WhatsApp */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleSendWhatsAppDirect}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>📲 Enviar por WhatsApp a {templateParams.clientFirstName} (1 Clic)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDispatchVisualKitAndText}
                    disabled={isDispatchingKit}
                    className="px-4 py-3 rounded-2xl bg-[#0B1B3D] hover:bg-slate-800 text-[#00E599] font-black text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {isDispatchingKit
                        ? 'Preparando Kit...'
                        : '⚡ Enviar Tarjeta Visual + Texto WhatsApp'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(`wa-copy-${activeStage.id}`, whatsappText, 'Plantilla de WhatsApp')
                    }
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {copiedId === `wa-copy-${activeStage.id}` ? '¡Copiado!' : '📋 Copiar Texto'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* FORMAT 2: SMS TEMPLATE */}
            {activeSendFormat === 'sms' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0066FF] uppercase">
                    💬 Plantilla SMS Corta Oficial ({smsText.length} caracteres):
                  </span>
                  <button
                    type="button"
                    onClick={() => speakText(`sms-${activeStage.id}`, smsText)}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0066FF] border border-blue-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>🔊 Escuchar SMS</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm font-mono text-blue-950 leading-relaxed">
                  {smsText}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSendSmsDirect}
                    className="px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>💬 Enviar SMS al Móvil ({templateParams.clientPhone})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(`sms-copy-${activeStage.id}`, smsText, 'Mensaje SMS')}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === `sms-copy-${activeStage.id}` ? '¡Copiado!' : '📋 Copiar SMS'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* FORMAT 3: EMAIL TEMPLATE */}
            {activeSendFormat === 'email' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs space-y-1">
                  <span className="font-black text-indigo-900 uppercase block">
                    📧 Asunto Oficial del Correo:
                  </span>
                  <div className="font-bold text-slate-900">{emailSubject}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto">
                  {emailBody}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSendEmailDirect}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>📧 Enviar por Correo a {templateParams.clientEmail}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `email-copy-${activeStage.id}`,
                        `Asunto: ${emailSubject}\n\n${emailBody}`,
                        'Correo electrónico completo'
                      )
                    }
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {copiedId === `email-copy-${activeStage.id}`
                        ? '¡Copiado!'
                        : '📋 Copiar Asunto y Cuerpo'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* FORMAT 4: INTERACTIVE VOICE FORMS & LEGAL PDFS FOR THE CLIENT */}
            {activeSendFormat === 'herramientas' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Desde aquí puedes abrir o enviarle directamente al cliente los <strong>Formularios Didácticos con Voz</strong> (ideales si no sabe usar bien el móvil) o sus <strong>Contratos y Pagarés Oficiales en PDF</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenDidacticForm) {
                        onOpenDidacticForm(currentApp);
                      }
                    }}
                    className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-left transition cursor-pointer space-y-1"
                  >
                    <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <span>🔊 Abrir Formulario Didáctico con Voz</span>
                    </div>
                    <p className="text-[11px] text-amber-900">
                      Abre el formulario interactivo que lee cada campo en voz alta para rellenarlo con el cliente o mandárselo por WhatsApp.
                    </p>
                  </button>

                  {currentApp && (
                    <button
                      type="button"
                      onClick={() => openDocumentModal(currentApp, 'pagare_en_blanco')}
                      className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-left transition cursor-pointer space-y-1"
                    >
                      <div className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#0066FF]" />
                        <span>📄 Ver / Descargar Pagaré eIDAS y Contrato PDF</span>
                      </div>
                      <p className="text-[11px] text-blue-900">
                        Abre los 6 documentos legales oficiales del cliente listos para descargar en PDF y enviarle.
                      </p>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
