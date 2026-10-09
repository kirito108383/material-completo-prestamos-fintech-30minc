/**
 * Biblioteca Maestra 10x10 de INSTACREDIT España
 * - 10 Casos e Intenciones Emocionales del Cliente con 10 Formas/Ejemplos Exactos por Caso (100 variaciones listas con emojis y URL independiente).
 * - Libretos de Conversaciones Largas Completas (Preguntas y Respuestas de principio a fin hasta el depósito en la cuenta creada).
 * - Panel de Sorteos VIP, Ganchos y Actividades Personalizables por el Asesor.
 * - Recorridos Visuales Didácticos de Uso y Manejo de la App (<30 minutos) para Empleados y Clientes.
 */

export interface TenWaysCaseParams {
  clientName: string;
  clientFirstName: string;
  clientPhone: string;
  capitalAmount: string;
  radicadoId: string;
  digitalIban: string;
  dueDate: string;
  advisorName: string;
  baseUrl: string;
}

export interface TenVariationExample {
  number: number;
  styleBadge: string;
  approachTitle: string;
  advisorQuickQuestion: string;
  whatsappReadyText: (p: TenWaysCaseParams) => string;
  spokenAudioScript: (p: TenWaysCaseParams) => string;
  targetUrlSlug: string;
}

export interface ClientIntentTenCase {
  id: string;
  caseNumber: number;
  intentBadge: string;
  intentColor: string;
  iconEmoji: string;
  title: string;
  clientFeelingSummary: string;
  whatClientSaidTrigger: string;
  advisorGoalIn30Min: string;
  assignedUrlLabel: string;
  assignedUrlSlug: string;
  pairedImageSrc: string;
  pairedImageTitle: string;
  examples: TenVariationExample[];
}

export interface LongConversationTurn {
  turnNumber: number;
  speaker: 'ASESOR' | 'CLIENTE';
  intentTag: string;
  messageText: (p: TenWaysCaseParams) => string;
  attachedUrlSlug?: string;
  advisorInternalNote: string;
}

export interface FullConversationPlaybook {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  clientProfile: string;
  estimatedTime: string;
  finalOutcome: string;
  pairedImageSrc: string;
  turns: LongConversationTurn[];
}

export interface RaffleHookCampaign {
  id: string;
  code: string;
  title: string;
  badge: string;
  defaultPrize: string;
  defaultDeadlineMinutes: number;
  hookObjective: string;
  activityForClient: string;
  pairedImageSrc: string;
  urlSlug: string;
  buildWhatsAppHook: (
    p: TenWaysCaseParams,
    customPrize: string,
    ticketCode: string,
    deadlineMinutes: number
  ) => string;
  buildVoiceHook: (
    p: TenWaysCaseParams,
    customPrize: string,
    ticketCode: string,
    deadlineMinutes: number
  ) => string;
}

const STYLES_10 = [
  { badge: 'Opción 1 • Directa y Ejecutiva ⚡', title: 'Enfoque de Velocidad 30 Minutos y Enlace Directo' },
  { badge: 'Opción 2 • Empática y Cercana 🤝', title: 'Acompañamiento Humano 1 a 1 Paso a Paso' },
  { badge: 'Opción 3 • Enfoque Cuenta Creada 🏦', title: 'Explicación de Depósito en la Cuenta Configurada por URL' },
  { badge: 'Opción 4 • Autoridad Legal BdE 🏛️', title: 'Respaldo de 12 Años en España y Ley 16/2011' },
  { badge: 'Opción 5 • Gancho de Reserva Activa 🔔', title: 'Partida de Liquidez Apartada a Nombre del Cliente' },
  { badge: 'Opción 6 • Solución sin Papeleos 📱', title: 'Autogestión en 90 Segundos desde el Móvil' },
  { badge: 'Opción 7 • Beneficio Bizum / SEPA 💶', title: 'Abono Inmediato en Cuenta para Retiro Instantáneo' },
  { badge: 'Opción 8 • Accesibilidad con Voz 🔊', title: 'Cuestionario Asistido con Altavoz y Letra Clara' },
  { badge: 'Opción 9 • Gancho de Sorteo VIP 🎁', title: 'Activación de Ticket Preferente por Completar Hoy' },
  { badge: 'Opción 10 • Cierre Definitivo con Pregunta 🎯', title: 'Doble Alternativa para Asegurar Respuesta Inmediata' }
];

function createTenVariationsForCase(config: {
  caseCode: string;
  urlSlug: string;
  urlName: string;
  coreTopic: string;
  customMessages: ((p: TenWaysCaseParams, url: string) => string)[];
  customAudios: ((p: TenWaysCaseParams, url: string) => string)[];
  quickQuestions: string[];
}): TenVariationExample[] {
  return STYLES_10.map((style, idx) => {
    const getMsg = config.customMessages[idx] || config.customMessages[0];
    const getAud = config.customAudios[idx] || config.customAudios[0];
    return {
      number: idx + 1,
      styleBadge: style.badge,
      approachTitle: style.title,
      advisorQuickQuestion: config.quickQuestions[idx] || config.quickQuestions[0],
      targetUrlSlug: config.urlSlug,
      whatsappReadyText: (p) => {
        const fullUrl = `${p.baseUrl}/?form=${config.urlSlug}&exp=${p.radicadoId}`;
        return getMsg(p, fullUrl);
      },
      spokenAudioScript: (p) => {
        const fullUrl = `${p.baseUrl}/?form=${config.urlSlug}&exp=${p.radicadoId}`;
        return getAud(p, fullUrl);
      }
    };
  });
}

export const TEN_CASES_WITH_TEN_EXAMPLES: ClientIntentTenCase[] = [
  // ===========================================================================
  // CASO 1: RESPONDIÓ DE INMEDIATO CON INTERÉS ALTO
  // ===========================================================================
  {
    id: 'caso-1-interes-inmediato',
    caseNumber: 1,
    intentBadge: 'CASO 1 • INTERÉS Y RAPIDEZ',
    intentColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    iconEmoji: '🚀',
    title: 'Caso 1: El Cliente Contestó con Interés ("Quiero mi préstamo hoy mismo")',
    clientFeelingSummary: 'Siente entusiasmo y urgencia positiva; quiere recibir el dinero en menos de 30 minutos.',
    whatClientSaidTrigger: '"Hola, sí me interesa el préstamo, ¿qué tengo que hacer para recibirlo hoy?"',
    advisorGoalIn30Min: 'Enviarle de inmediato la URL 1 (Cuestionario de Solicitud) explicándole que al llenarla se empieza a crear su cuenta para el depósito.',
    assignedUrlLabel: 'URL Cuestionario 1 (Solicitud y Creación de Cuenta)',
    assignedUrlSlug: 'solicitud',
    pairedImageSrc: '/src/assets/images/ws_recorrido_30_minutos_1791522034719.jpg',
    pairedImageTitle: 'Recorrido Oficial de 4 Pasos en Menos de 30 Minutos',
    examples: createTenVariationsForCase({
      caseCode: 'C1',
      urlSlug: 'solicitud',
      urlName: 'Cuestionario 1 de Solicitud',
      coreTopic: 'Inicio inmediato en menos de 30 minutos',
      quickQuestions: [
        '¿Entras ahora mismo al enlace 1 para dejarte los fondos listos en 20 minutos?',
        '¿Prefieres llenar el cuestionario 1 tú mismo en 1 minuto o lo hacemos juntos por aquí?',
        '¿Confirmamos tus datos en este primer link para dejar creada tu cuenta de depósito?',
        '¿Verificamos tu importe y plazo en el enlace oficial bajo la Ley 16/2011?',
        '¿Activamos ya tu reserva prioritaria de fondos entrando al enlace azul?',
        '¿Tienes tu DNI/NIE a mano para validar este primer cuestionario en 90 segundos?',
        '¿Deseas que al terminar los enlaces te depositemos para retirar por SEPA o por Bizum?',
        '¿Sabías que al abrir el enlace tienes un botón de altavoz 🔊 que te guía paso a paso?',
        '¿Completamos este paso en los próximos 10 minutos para incluirte tu ticket de Sorteo VIP?',
        '¿Me avisas con un "LISTO" apenas pulses el botón verde de enviar en el formulario?'
      ],
      customMessages: [
        (p, url) =>
          `🚀 *¡PERFECTO, ${p.clientFirstName.toUpperCase()}! ACTIVAMOS TU PRÉSTAMO EN MENOS DE 30 MINUTOS*\n\nSoy *${p.advisorName}* de *INSTACREDIT España*. 🇪🇸 Ya tengo listo tu expediente *#${p.radicadoId}* por *${p.capitalAmount}*.\n\nPara que tengas el dinero depositado hoy mismo en tu cuenta creada, entra a este primer cuestionario rápido (toma 1 minuto):\n\n🔗 *1. Cuestionario Oficial de Solicitud y Cuenta:*\n${url}\n\nAvísame por aquí apenas pulses *"Enviar"* para pasarte al paso 2. 👇`,
        (p, url) =>
          `🤝 *¡Qué alegría saludarte, ${p.clientFirstName}! Vamos a hacerlo súper fácil*\n\nTe acompaña *${p.advisorName}* en *INSTACREDIT España*. Mi trabajo es que en *menos de 30 minutos* tengas tus *${p.capitalAmount}* depositados y listos.\n\nPor cada cuestionario URL que vas completando, el sistema configura tu cuenta digital (\`${p.digitalIban}\`). Empecemos con el Paso 1 aquí:\n\n👉 ${url}\n\nEstoy conectado en vivo esperando tu confirmación. 😊`,
        (p, url) =>
          `🏦 *CREACIÓN DE TU CUENTA Y DEPÓSITO DE ${p.capitalAmount} (#${p.radicadoId})*\n\nHola *${p.clientFirstName}*, te explica tu asesor *${p.advisorName}*: en *INSTACREDIT España* el dinero se deposita directamente en la cuenta que vas creando al responder tus enlaces oficiales.\n\n✅ *Abre aquí tu Cuestionario 1 para activar tu cuenta y confirmar importe:*\n${url}\n\nEn cuanto lo completes, avanzamos al depósito. 💶⚡`,
        (p, url) =>
          `🏛️ *TRAMITACIÓN OFICIAL LEY 16/2011 — EXPEDIENTE #${p.radicadoId}*\n\nEstimado(a) *${p.clientName}*, le atiende *${p.advisorName}* de *INSTACREDIT España (NIF B-87942105)*. Con más de 12 años de trayectoria, garantizamos su resolución en *máximo 30 minutos*.\n\n🔗 *Complete su Ficha y Cuestionario Inicial en este enlace seguro:*\n${url}\n\nQuedo atento a su envío para validar su cuenta bancaria. 🇪🇸`,
        (p, url) =>
          `🔔 *PARTIDA DE ${p.capitalAmount} APARTADA A TU NOMBRE (#${p.radicadoId})*\n\n¡Hola, *${p.clientFirstName}*! Ya dejé bloqueada en tesorería tu solicitud de *${p.capitalAmount}* para que salga en el corte de los próximos *30 minutos*.\n\nSolo necesitas validar este primer enlace de 4 preguntas:\n👉 ${url}\n\n¡Dime *"HECHO"* por aquí cuando termines! 🚀`,
        (p, url) =>
          `📱 *SOLICITUD 100% DESDE TU MÓVIL SIN PAPELEOS (${p.capitalAmount})*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Olvídate de colas bancarias. Todo lo hacemos desde este chat en menos de 30 minutos.\n\n1️⃣ Toca este enlace seguro:\n${url}\n2️⃣ Confirma tu importe y datos básicos.\n3️⃣ Tu cuenta \`${p.digitalIban}\` quedará lista para el siguiente paso.\n\n¿Lo abres ahora mismo? 👍`,
        (p, url) =>
          `💶 *PREPARA TU DEPÓSITO PARA RETIRO POR SEPA O BIZUM (#${p.radicadoId})*\n\n¡Hola *${p.clientFirstName}*! Te saluda *${p.advisorName}* de *INSTACREDIT España*. Para que puedas retirar tus *${p.capitalAmount}* hoy mismo desde tu cuenta creada, inicia el Cuestionario 1 aquí:\n\n🔗 ${url}\n\n¡En menos de 30 minutos dejamos todo completado! ⚡`,
        (p, url) =>
          `🔊 *CUESTIONARIO GUIADO CON VOZ PARA TUS ${p.capitalAmount}*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. He preparado tu enlace directo con *lectura asistida por voz* y letra clara para que lo rellenes en 1 minuto con total comodidad:\n\n👉 *Pulsa aquí para abrir tu Cuestionario 1:*\n${url}\n\nSi tienes cualquier pregunta mientras lo abres, escríbeme por aquí. 😊`,
        (p, url) =>
          `🎁 *¡INICIA AHORA Y ACTIVA TU BENEFICIO PREFERENTE! (#${p.radicadoId})*\n\nHola *${p.clientFirstName}*, te escribe *${p.advisorName}*. Si completamos tu recorrido de *${p.capitalAmount}* dentro de esta media hora, además de recibir tu depósito en tu cuenta creada, quedas inscrito(a) en nuestro *Sorteo VIP de Condonación de Primera Cuota*.\n\n🔗 *Empieza tu Paso 1 aquí:*\n${url}`,
        (p, url) =>
          `🎯 *PASO 1 LISTO PARA TUS ${p.capitalAmount}, ${p.clientFirstName.toUpperCase()}*\n\nSoy *${p.advisorName}* de *INSTACREDIT España*. Aquí tienes la URL directa que inicia la creación de tu cuenta y valida tu solicitud *#${p.radicadoId}*:\n\n👉 ${url}\n\n¿Prefieres rellenarlo tú ahora en 1 minuto o quieres que te vaya guiando pregunta por pregunta desde aquí? 🤝`
      ],
      customAudios: [
        (p) =>
          `¡Hola ${p.clientFirstName}! Soy ${p.advisorName} de Instacredit España. Qué alegría que me escribas. Ya tengo activo tu expediente ${p.radicadoId} por ${p.capitalAmount}. Como anunciamos, hacemos todo en menos de 30 minutos. Entra ahora mismo al enlace que te acabo de poner aquí abajo para completar el primer cuestionario rápido; así el sistema empieza a configurar tu cuenta donde te depositaremos el dinero. Avísame apenas le des a enviar.`,
        (p) =>
          `Muy buenas ${p.clientFirstName}, te habla ${p.advisorName}. Estoy aquí para acompañarte paso a paso. Te acabo de mandar el enlace número uno. Es súper sencillo y a medida que vas llenando cada cuestionario se deja lista tu cuenta digital para el depósito de tus ${p.capitalAmount}. Ábrelo desde tu móvil y dime por aquí cuando lo tengas en pantalla.`
      ]
    })
  },

  // ===========================================================================
  // CASO 2: VIO EL ANUNCIO HACE DÍAS O NO RESPONDIÓ AL PRIMER MENSAJE
  // ===========================================================================
  {
    id: 'caso-2-anuncio-dias-sin-responder',
    caseNumber: 2,
    intentBadge: 'CASO 2 • REACTIVACIÓN DE ANUNCIO / SIN RESPUESTA',
    intentColor: 'bg-amber-100 text-amber-900 border-amber-300',
    iconEmoji: '🔔',
    title: 'Caso 2: Respondió al Anuncio hace Días pero No Contestó al Primer Mensaje del Asesor',
    clientFeelingSummary: 'Pidió información en el anuncio publicitario pero se distrajo, estuvo ocupado o dejó en visto al asesor.',
    whatClientSaidTrigger: '(El cliente dejó en visto el primer saludo o lleva días desde que tocó el anuncio en redes)',
    advisorGoalIn30Min: 'Volver a atraer su atención con un gancho positivo (cupo reservado + cuenta pre-creada) y lograr que toque la URL.',
    assignedUrlLabel: 'URL Independiente de Reactivación Rápida',
    assignedUrlSlug: 'solicitud',
    pairedImageSrc: '/src/assets/images/ws_recordatorio_no_responde_1791520687571.jpg',
    pairedImageTitle: 'Reserva de Cupo Activa — Seguimos a tu Disposición',
    examples: createTenVariationsForCase({
      caseCode: 'C2',
      urlSlug: 'solicitud',
      urlName: 'URL de Reactivación de Anuncio',
      coreTopic: 'Rescate de cliente que vino del anuncio hace días',
      quickQuestions: [
        '¿Sigues necesitando los fondos solicitados en el anuncio para depositártelos hoy?',
        '¿Te mantengo reservada la partida en tu cuenta digital o prefieres cambiar el importe?',
        '¿Tienes 2 minutos ahora para terminar el cuestionario que quedó pendiente?',
        '¿Te viene mejor que lo dejemos firmado y depositado en los próximos 20 minutos?',
        '¿Pudiste ver que ya tienes pre-asignada tu cuenta IBAN para recibir el dinero?',
        '¿Quieres aprovechar el turno prioritario sin espera que te guardé hoy?',
        '¿Te gustaría sumar el ticket del Sorteo VIP por reactivar tu solicitud hoy?',
        '¿Prefieres que te envíe una nota de voz de 20 segundos explicándote lo fácil que es?',
        '¿Activamos el envío a tu banco por SEPA Instant o por Bizum al terminar este link?',
        '¿Me respondes con un "SÍ" para no liberar tu cupo reservado a otro solicitante?'
      ],
      customMessages: [
        (p, url) =>
          `🔔 *¡HOLA ${p.clientFirstName.toUpperCase()}! GUARDAMOS TU CUPO DEL ANUNCIO (#${p.radicadoId})*\n\nTe saluda *${p.advisorName}* de *INSTACREDIT España*. 🇪🇸 Hace unos días respondiste a nuestro anuncio por *${p.capitalAmount}* y quiero darte una gran noticia: *he mantenido tu partida reservada*.\n\nEn menos de 30 minutos podemos dejar todo listo y el dinero depositado en tu cuenta creada. Retómalo en 1 clic aquí:\n\n🔗 *Enlace Directo de Reactivación:*\n${url}\n\n¿Seguimos adelante hoy mismo? 🤝`,
        (p, url) =>
          `👋 *Hola de nuevo, ${p.clientFirstName}. Sé que a veces vamos con mil cosas al día*\n\nSoy *${p.advisorName}*, tu asesor en *INSTACREDIT España*. Te escribo porque no quiero que pierdas la pre-aprobación de *${p.capitalAmount}* que generaste desde nuestro anuncio.\n\nYa tienes pre-creada tu cuenta \`${p.digitalIban}\` esperando únicamente que confirmes este cuestionario corto:\n👉 ${url}\n\n¿Tienes 2 minutitos ahora para dejarte el dinero depositado hoy? 😊`,
        (p, url) =>
          `⚡ *TURNO EXPRÉS DE 30 MINUTOS HABILITADO PARA TI, ${p.clientFirstName.toUpperCase()}*\n\nTe escribe *${p.advisorName}* de *INSTACREDIT España*. Revisando las solicitudes del anuncio de esta semana, vi que tu expediente *#${p.radicadoId}* por *${p.capitalAmount}* quedó en el paso 1.\n\nSi entras ahora a tu URL personal, te doy prioridad absoluta para depositarte en tu cuenta hoy mismo:\n🔗 ${url}\n\nRespóndeme *"QUIERO AVANZAR"* y te asisto al segundo. 🚀`,
        (p, url) =>
          `🏦 *TU CUENTA DIGITAL SIGUE LISTA PARA RECIBIR TUS ${p.capitalAmount}*\n\nEstimado(a) *${p.clientFirstName}*, desde *INSTACREDIT España* te confirmamos que la cuenta vinculada a tu solicitud del anuncio (\`${p.digitalIban}\`) sigue activa.\n\nRecuerda que a medida que completas tus enlaces se habilita el depósito directo de tus *${p.capitalAmount}*:\n👉 *Continuar aquí:* ${url}\n\n¿Deseas mantener el mismo importe o ajustarlo? 💶`,
        (p, url) =>
          `🎁 *GANCHO ESPECIAL DE REACTIVACIÓN + TICKET SORTEO VIP (#${p.radicadoId})*\n\n¡Hola *${p.clientFirstName}*! Soy *${p.advisorName}*. Para premiar tu interés en nuestro anuncio, si completamos hoy tu solicitud de *${p.capitalAmount}* en menos de 30 minutos, te activo un *Ticket Dorado para el Sorteo de Condonación de la 1ª Cuota*.\n\n🔗 *Actívalo completando tu cuestionario aquí:*\n${url}\n\n¡Aprovecha tu ventaja hoy! 🏆`,
        (p, url) =>
          `⏳ *AVISO CORDIAL: ¿MANTENEMOS TUS ${p.capitalAmount} RESERVADOS, ${p.clientFirstName.toUpperCase()}?*\n\nTe saluda *${p.advisorName}* de *INSTACREDIT España*. Hoy cerramos las reservas pendientes del anuncio publicitario y quería consultarte antes de liberar tus *${p.capitalAmount}*.\n\nSi aún necesitas la liquidez en tu cuenta hoy mismo:\n1️⃣ Responde *"SÍ"* a este mensaje, o\n2️⃣ Completa en 1 minuto tu enlace:\n👉 ${url}`,
        (p, url) =>
          `📲 *SOLO 3 PASOS CORTOS Y EL DINERO QUEDA EN TU CUENTA (${p.capitalAmount})*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. A veces pensamos que pedir un préstamo lleva días, pero con nosotros en *menos de 30 minutos* completas los enlaces y recibes el depósito en tu cuenta para sacarlo por Bizum o SEPA.\n\n🔗 *Comienza tu Paso 1 en 60 segundos aquí:*\n${url}`,
        (p, url) =>
          `🔊 *TE AYUDO CON VOZ PASO A PASO, ${p.clientFirstName.toUpperCase()}*\n\nHola *${p.clientFirstName}*, te escribe *${p.advisorName}* de *INSTACREDIT España*. Si el otro día no pudiste continuar tras ver nuestro anuncio porque tenías alguna duda, este enlace tiene asistencia por voz que te explica todo:\n\n👉 ${url}\n\nO dime por aquí qué duda tienes y te mando un audio explicándotelo al instante. 🤝`,
        (p, url) =>
          `🌟 *BENEFICIO DE CUOTA CÓMODA PARA TU SOLICITUD #${p.radicadoId}*\n\n¡Buen día, *${p.clientFirstName}*! Soy *${p.advisorName}*. He actualizado tu simulación de *${p.capitalAmount}* para ofrecerte las cuotas más cómodas del mes y depósito directo en tu cuenta creada.\n\n🔗 *Mira tu cuadro actualizado y confírmalo aquí:*\n${url}\n\n¿Qué te parece cómo queda tu cuota? 😊`,
        (p, url) =>
          `🎯 *PREGUNTA RÁPIDA SOBRE TUS ${p.capitalAmount}, ${p.clientFirstName.toUpperCase()}*\n\nTe saluda *${p.advisorName}* de *INSTACREDIT España*. Para dejar cerrado o avanzar tu expediente *#${p.radicadoId}* hoy en 20 minutos:\n\n👉 *Opción A:* Entras aquí ${url} y hoy mismo te depositamos en tu cuenta.\n👉 *Opción B:* Me dices qué hora de hoy te viene mejor para guiarte por este chat.\n\n¿Con cuál opción nos quedamos? 👇`
      ],
      customAudios: [
        (p) =>
          `¡Hola ${p.clientFirstName}! Te habla ${p.advisorName} de Instacredit España. Te mando este audio rapidito porque vi que hace unos días nos escribiste por nuestro anuncio para los ${p.capitalAmount}, pero no alcanzamos a conversar. Quería darte la buena noticia de que te guardé el cupo reservado y tu cuenta digital ya está pre-creada. Si tienes diez minutitos ahora, toca el enlace que te dejé aquí abajo y dejamos tu dinero depositado hoy mismo.`,
        (p) =>
          `Muy buenas ${p.clientFirstName}, soy ${p.advisorName}. Antes de que el sistema libere la reserva de tus ${p.capitalAmount}, quería preguntarte si todavía necesitas el dinero. Recuerda que con nosotros en menos de treinta minutos llenas tus enlaces sencillos y el préstamo queda depositado en tu cuenta. Dime un "Sí" por aquí y te ayudo al instante.`
      ]
    })
  },

  // ===========================================================================
  // CASO 3: DUDA ("¿CÓMO FUNCIONA EL PROCESO Y LA CREACIÓN DE CUENTA?")
  // ===========================================================================
  {
    id: 'caso-3-duda-como-funciona',
    caseNumber: 3,
    intentBadge: 'CASO 3 • DUDA SOBRE EL FUNCIONAMIENTO',
    intentColor: 'bg-blue-100 text-blue-900 border-blue-300',
    iconEmoji: '❓',
    title: 'Caso 3: El Cliente Siente Duda ("¿Cómo funciona y cómo recibo el dinero en mi cuenta?")',
    clientFeelingSummary: 'No tiene claro cómo son los pasos, para qué sirven las URLs o dónde se le deposita el préstamo.',
    whatClientSaidTrigger: '"No entiendo muy bien cómo funciona, ¿cómo me entregan el dinero?"',
    advisorGoalIn30Min: 'Explicarle didácticamente los 4 pasos en <30 minutos: cada URL va configurando su cuenta hasta depositarle el total.',
    assignedUrlLabel: 'URL Cuestionario 1 + Infografía 4 Pasos',
    assignedUrlSlug: 'solicitud',
    pairedImageSrc: '/src/assets/images/ws_recorrido_30_minutos_1791522034719.jpg',
    pairedImageTitle: 'Mapa Visual Explicativo de los 4 Pasos en 30 Minutos',
    examples: createTenVariationsForCase({
      caseCode: 'C3',
      urlSlug: 'solicitud',
      urlName: 'Cuestionario Explicativo Paso 1',
      coreTopic: 'Explicación didáctica del recorrido y depósito en cuenta creada',
      quickQuestions: [
        '¿Te quedó claro cómo cada enlace va dejando lista tu cuenta para el depósito?',
        '¿Empezamos con el Cuestionario 1 ahora que viste lo sencillo que es?',
        '¿Prefieres retirar el dinero de tu cuenta creada por transferencia SEPA o por Bizum?',
        '¿Quieres que te acompañe en vivo mientras abres el primer enlace?',
        '¿Viste en la imagen adjunta que todo el proceso toma menos de 30 minutos?',
        '¿Te gustaría usar el botón de voz del formulario para que te lea cada paso?',
        '¿Confirmamos primero el importe de tu préstamo en este enlace?',
        '¿Tienes alguna otra pregunta o pasamos directamente al enlace número 1?',
        '¿Sabías que desde tu cuenta creada puedes ver tus 5 contratos de 4 páginas?',
        '¿Me avisas cuando abras el enlace para guiarte en el segundo paso?'
      ],
      customMessages: [
        (p, url) =>
          `❓ *TE EXPLICO EN 30 SEGUNDOS CÓMO RECIBES TUS ${p.capitalAmount}, ${p.clientFirstName.toUpperCase()}*\n\nSoy *${p.advisorName}* de *INSTACREDIT España*. Es súper sencillo y todo se completa en *menos de 30 minutos*:\n\n1️⃣ *Cuestionario URL 1 (5 min):* Confirmas tu importe y datos.\n2️⃣ *Cuestionario URL 2 (10 min):* Vinculas tu IBAN y se configura tu Cuenta Digital (\`${p.digitalIban}\`).\n3️⃣ *Cuestionario URL 3 (5 min):* Firmas con el dedo en pantalla tus contratos oficiales.\n4️⃣ *Depósito Inmediato:* Una vez completado todo, tus *${p.capitalAmount}* se depositan en esa cuenta que creaste para que los pases a tu banco por SEPA o Bizum.\n\n🔗 *Empieza el Paso 1 aquí:*\n${url}`,
        (p, url) =>
          `🏦 *¿DÓNDE Y CÓMO SE DEPOSITA TU PRÉSTAMO DE ${p.capitalAmount}?*\n\nHola *${p.clientFirstName}*, te saluda *${p.advisorName}*. A medida que vas llenando cada cuestionario que te envío por enlace, nuestra plataforma va creando y verificando tu *Cuenta Digital INSTACREDIT* (\`${p.digitalIban}\`).\n\nEn cuanto terminas el último enlace, el sistema deposita automáticamente tus *${p.capitalAmount}* en tu cuenta.\n\n👉 *Completa aquí el primer enlace para avanzar:*\n${url}`,
        (p, url) =>
          `📲 *SIN PAPELEOS NI COMPLICACIONES — GUÍA PASO A PASO (#${p.radicadoId})*\n\nEstimado(a) *${p.clientFirstName}*, entiendo que quieras tener todo claro. Aquí no tienes que ir a ninguna oficina ni imprimir papeles:\n\n• Yo te envío 3 enlaces cortos por este WhatsApp.\n• Tú los rellenas desde tu móvil con mi ayuda.\n• Al finalizar (en menos de 30 min), tienes tus *${p.capitalAmount}* depositados en tu cuenta.\n\n🔗 *Toca aquí para abrir el Enlace 1:*\n${url}`,
        (p, url) =>
          `🏛️ *TRANSPARENCIA LEGAL LEY 16/2011 EN CADA PASO (#${p.radicadoId})*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Todo nuestro procedimiento cumple la normativa española de crédito al consumo:\n\n✅ Cuestionarios verificados con lectura por voz.\n✅ 5 Contratos oficiales de 4 páginas cada uno con sello europeo eIDAS.\n✅ Depósito directo de *${p.capitalAmount}* en tu cuenta asignada.\n\n👉 *Revisa y confirma tu Paso 1 aquí:*\n${url}`,
        (p, url) =>
          `⏱️ *¿POR QUÉ TARDAMOS MENOS DE 30 MINUTOS EN DEPOSITARTE?*\n\n¡Hola *${p.clientFirstName}*! Porque en lugar de pedirte decenas de papeles físicos, usamos enlaces inteligentes de verificación rápida.\n\nCada enlace que completas desbloquea el siguiente hasta depositar tus *${p.capitalAmount}* en tu cuenta \`${p.digitalIban}\`.\n\n🔗 *Haz clic aquí para completar el primero en 90 segundos:*\n${url}`,
        (p, url) =>
          `🔊 *EXPLICACIÓN CON VOZ INCLUIDA DENTRO DEL ENLACE*\n\n*${p.clientFirstName}*, si no tienes claro cómo llenar la solicitud, no te preocupes: al abrir este enlace verás arriba un botón que dice *"Escuchar Explicación con Voz"* que te habla y te explica cada casilla:\n\n👉 ${url}\n\nAdemás, yo estoy aquí en el chat para ayudarte en todo momento. 🤝`,
        (p, url) =>
          `💶 *DEL CUESTIONARIO DIRECTO A TU BIZUM O BANCO HABITUAL (${p.capitalAmount})*\n\nHola *${p.clientFirstName}*, te escribe *${p.advisorName}*. Así viaja tu dinero:\n\n1. Rellenas tus enlaces de verificación.\n2. Se depositan los *${p.capitalAmount}* en tu Cuenta Digital creada (\`${p.digitalIban}\`).\n3. Desde ahí pulsas *"Retirar por SEPA Instant"* o *"Bizum"* hacia tu banco de siempre.\n\n🔗 *Inicia aquí:* ${url}`,
        (p, url) =>
          `✨ *EJEMPLO REAL DE CÓMO LO HACEMOS EN 20 MINUTOS, ${p.clientFirstName.toUpperCase()}*\n\nImagina que es como hacer el check-in de un billete en el móvil:\n• *Pantalla 1:* Confirmas cuánto dinero quieres (*${p.capitalAmount}*).\n• *Pantalla 2:* Pones tu IBAN español.\n• *Pantalla 3:* Firmas con el dedo y recibes el depósito en tu cuenta.\n\n👉 *Abre la Pantalla 1 aquí:* ${url}`,
        (p, url) =>
          `🎁 *ADEMÁS DE SER FÁCIL, TIENES PREMIO POR COMPLETARLO HOY (#${p.radicadoId})*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Al completar tus 3 enlaces sencillos en menos de 30 minutos no solo recibes el depósito de tus *${p.capitalAmount}* en tu cuenta, sino que participas en nuestro *Sorteo VIP Mensual*.\n\n🔗 *Avanza tu primer enlace aquí:*\n${url}`,
        (p, url) =>
          `🎯 *¿LO HACEMOS JUNTOS AHORA MISMO, ${p.clientFirstName.toUpperCase()}?*\n\nYa viste que son solo 3 enlaces rápidos para dejar creada tu cuenta y depositarte tus *${p.capitalAmount}*.\n\n👉 *Toca aquí para abrir el primero:*\n${url}\n\n¿Te parece bien abrirlo ahora y me avisas apenas lo veas en pantalla? 👇`
      ],
      customAudios: [
        (p) =>
          `Hola ${p.clientFirstName}, te habla ${p.advisorName}. Te explico con todo gusto cómo funciona para que te quedes súper tranquilo. Nuestro proceso dura menos de treinta minutos y se hace mediante tres enlaces cortos que te voy enviando por este WhatsApp. A medida que tú vas llenando cada cuestionario en el enlace, el sistema va creando y activando tu cuenta digital asignada. En cuanto completas el último paso de firma desde el móvil, tus ${p.capitalAmount} se depositan directamente en esa cuenta para que los pases a tu banco o por Bizum. Toca el primer enlace aquí abajo y empezamos.`
      ]
    })
  },

  // ===========================================================================
  // CASO 4: INTRIGA / CURIOSIDAD ("QUIERO VER CONDICIONES, CUOTAS Y CONTRATOS")
  // ===========================================================================
  {
    id: 'caso-4-intriga-condiciones',
    caseNumber: 4,
    intentBadge: 'CASO 4 • INTRIGA Y CONDICIONES',
    intentColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    iconEmoji: '🔍',
    title: 'Caso 4: El Cliente Siente Intriga ("Quiero ver qué intereses, cuotas y contratos manejan")',
    clientFeelingSummary: 'Tiene curiosidad analítica; quiere ver números exactos, TAE, plazos y leer los contratos antes de decidirse.',
    whatClientSaidTrigger: '"Quiero saber cuánto pagaría al mes, qué interés tiene y ver el contrato antes."',
    advisorGoalIn30Min: 'Mostrarle transparencia total con la Ficha Europea INE y la URL directa a sus 5 contratos reales de 4 páginas.',
    assignedUrlLabel: 'URL Visor de 5 Contratos de 4 Páginas + Simulación INE',
    assignedUrlSlug: 'solicitud',
    pairedImageSrc: '/src/assets/images/ws_verificacion_formularios_url_1791520696726.jpg',
    pairedImageTitle: 'Ficha Europea INE y Acceso a los 5 Contratos de 4 Páginas',
    examples: createTenVariationsForCase({
      caseCode: 'C4',
      urlSlug: 'solicitud',
      urlName: 'Simulador INE y Contratos de 4 Páginas',
      coreTopic: 'Transparencia de cuotas, intereses y contratos de 4 páginas',
      quickQuestions: [
        '¿Qué plazo de meses te resulta más cómodo viendo el simulador del enlace?',
        '¿Pudiste abrir el enlace donde están tus 5 contratos completos de 4 páginas?',
        '¿Viste que puedes amortizar anticipadamente con 0% de penalización bajo la Ley 16/2011?',
        '¿Prefieres una cuota mensual más baja ampliando el plazo o liquidarlo rápido?',
        '¿Te gustaría que te envíe en PDF adjunto el Contrato de Préstamo de 4 páginas?',
        '¿Notaste que tienes 14 días legales de derecho de desistimiento tras el depósito?',
        '¿Te parece bien confirmar esa cuota en el enlace para pasar a configurar tu cuenta?',
        '¿Quieres escuchar con el altavoz del formulario el desglose de tu Ficha INE?',
        '¿Te gustaría aplicar al descuento del 10% en tu segunda operación por pago puntual?',
        '¿Dejamos fijado este importe de préstamo para depositártelo hoy en menos de 30 minutos?'
      ],
      customMessages: [
        (p, url) =>
          `🔍 *TRANSPARENCIA TOTAL: CUOTAS Y 5 CONTRATOS DE 4 PÁGINAS (#${p.radicadoId})*\n\n¡Excelente pregunta, *${p.clientFirstName}*! Te saluda *${p.advisorName}* de *INSTACREDIT España*. Bajo la *Ley 16/2011*, puedes ver cada número antes de firmar:\n\n📊 *1. Ajusta y verifica tu cuota mensual e intereses (Ficha INE) aquí:*\n${url}\n\n📄 *2. Lee tus 5 Contratos Oficiales completos (4 páginas c/u) aquí:*\n${p.baseUrl}/?ver_contratos=${p.radicadoId}\n\nRevísalo y dime si esa cuota se adapta bien a tu bolsillo. 👍`,
        (p, url) =>
          `💶 *SIMULACIÓN EXACTA A TU MEDIDA PARA ${p.capitalAmount}*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. En *INSTACREDIT España* las cuotas son 100% fijas (nunca suben aunque cambie el Euríbor) y tienes *0% de comisión por cancelación anticipada*.\n\n🔗 *Entra a tu cuestionario interactivo para elegir tu plazo ideal:*\n${url}\n\nEn cuanto lo confirmes, dejamos lista tu cuenta para el depósito en menos de 30 minutos. ⚡`,
        (p, url) =>
          `📄 *TUS 5 DOCUMENTOS LEGALES DE 4 PÁGINAS ABIERTOS AL PÚBLICO (#${p.radicadoId})*\n\nEstimado(a) *${p.clientFirstName}*, pocas entidades te muestran sus contratos completos desde el minuto uno. Con nosotros tienes acceso inmediato a:\n1. Contrato de Préstamo (4 págs)\n2. Condiciones Cuenta Digital IBAN (4 págs)\n3. Privacidad RGPD (4 págs)\n4. Consentimiento ASNEF/CIRBE (4 págs)\n5. Pagaré Digital eIDAS (4 págs)\n\n🔗 *Ver Contratos:* ${p.baseUrl}/?ver_contratos=${p.radicadoId}\n🔗 *Confirmar Solicitud:* ${url}`,
        (p, url) =>
          `🏛️ *FICHA EUROPEA NORMALIZADA (INE) — BANCO DE ESPAÑA*\n\nHola *${p.clientFirstName}*, te escribe *${p.advisorName}*. En este enlace oficial tienes desglosado el TIN, la TAE y el cuadro de amortización de tus *${p.capitalAmount}*:\n\n👉 ${url}\n\nRecuerda que al completar los enlaces el importe se deposita íntegro en tu cuenta creada (\`${p.digitalIban}\`). 🇪🇸`,
        (p, url) =>
          `🛡️ *14 DÍAS DE DERECHO DE DESISTIMIENTO + PRÓRROGAS SIN MULTA*\n\n*${p.clientFirstName}*, para que veas la flexibilidad de *INSTACREDIT España*:\n• Tienes 14 días legales para desistir del contrato (Art. 28 Ley 16/2011).\n• Si algún mes necesitas más tiempo, puedes pedir prórroga de 15 o 30 días desde tu móvil.\n\n🔗 *Confirma tus condiciones aquí:*\n${url}`,
        (p, url) =>
          `📱 *CALCULA Y AJUSTA TU CUOTA EN TIEMPO REAL DESDE EL ENLACE*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Dentro de tu enlace personal puedes mover el selector de importe y plazo para ver al instante cómo queda tu cuota mensual:\n\n👉 ${url}\n\nCuando encuentres la cuota perfecta para ti, pulsa *"Enviar Confirmación"* y seguimos al depósito. 🚀`,
        (p, url) =>
          `🔊 *ESCUCHA TUS CONDICIONES EN VOZ ALTA PASO A PASO*\n\n*${p.clientFirstName}*, he activado en tu enlace el reproductor de voz que te lee el resumen de tu préstamo de *${p.capitalAmount}* y tus derechos como consumidor en España:\n\n🔗 ${url}\n\n¡Cualquier término que quieras que te aclare, pregúntame con total confianza! 🤝`,
        (p, url) =>
          `⭐ *BENEFICIO DE CRECIMIENTO DE CUPO HASTA 10.000 €*\n\nHola *${p.clientFirstName}*, te comenta *${p.advisorName}*: al formalizar este primer crédito de *${p.capitalAmount}* y pagarlo puntualmente, tu perfil desbloquea aumentos automáticos de cupo y rebaja de tasa.\n\n🔗 *Revisa y valida tu solicitud inicial aquí:*\n${url}`,
        (p, url) =>
          `🎁 *PARTICIPA EN LA CONDONACIÓN DE TU PRIMERA CUOTA (#${p.radicadoId})*\n\n¿Sabías, *${p.clientFirstName}*, que al confirmar hoy tus condiciones en menos de 30 minutos entras en el sorteo mensual donde *INSTACREDIT España paga tu primera cuota por ti*?\n\n👉 *Revisa tus condiciones y activa tu participación aquí:*\n${url}`,
        (p, url) =>
          `🎯 *TODO CLARO Y POR ESCRITO PARA TUS ${p.capitalAmount}, ${p.clientFirstName.toUpperCase()}*\n\nAquí tienes ambos accesos directos de tu expediente *#${p.radicadoId}*:\n1️⃣ *Confirmar Cuota y Solicitud:* ${url}\n2️⃣ *Descargar Contratos 4 Páginas PDF:* ${p.baseUrl}/?ver_contratos=${p.radicadoId}\n\n¿Te parece bien la cuota mensual asignada para pasar ya al enlace de tu cuenta bancaria? 👇`
      ],
      customAudios: [
        (p) =>
          `Hola ${p.clientFirstName}, te habla ${p.advisorName}. Me parece excelente que quieras revisar todas las condiciones y los contratos antes de avanzar. Te acabo de poner aquí en el chat dos enlaces directos: en el primero puedes ver y ajustar tu cuota mensual fija bajo la Ficha Europea INE, y en el segundo puedes abrir y descargar en PDF tus cinco contratos oficiales de cuatro páginas cada uno. Échales un vistazo y dime si te queda cómoda la cuota para depositarte hoy mismo.`
      ]
    })
  },

  // ===========================================================================
  // CASO 5: DESCONFIANZA / MIEDO ("¿SOIS UNA EMPRESA REAL Y SEGURA EN ESPAÑA?")
  // ===========================================================================
  {
    id: 'caso-5-desconfianza-seguridad',
    caseNumber: 5,
    intentBadge: 'CASO 5 • DESCONFIANZA Y RESPALDO LEGAL',
    intentColor: 'bg-rose-100 text-rose-900 border-rose-300',
    iconEmoji: '🛡️',
    title: 'Caso 5: El Cliente Siente Desconfianza ("Quiero estar seguro de que la empresa es real y legal")',
    clientFeelingSummary: 'Tiene precaución al dar sus datos en internet y busca pruebas sólidas de trayectoria, NIF español y contratos reales.',
    whatClientSaidTrigger: '"No me fío mucho por internet, ¿cómo sé que sois una financiera legal en España?"',
    advisorGoalIn30Min: 'Aportar pruebas verificables inmediatas (NIF B-87942105, 12 años en España, 5 contratos de 4 páginas, sello eIDAS) y guiarlo a la URL.',
    assignedUrlLabel: 'URL Visor Oficial de Contratos + Verificación Segura',
    assignedUrlSlug: 'solicitud',
    pairedImageSrc: '/src/assets/images/ws_seguimiento_1790860216261.jpg',
    pairedImageTitle: 'Acreditación de 12 Años de Trayectoria y Supervisión Ley 16/2011',
    examples: createTenVariationsForCase({
      caseCode: 'C5',
      urlSlug: 'solicitud',
      urlName: 'Portal Cifrado eIDAS y Contratos',
      coreTopic: 'Seguridad jurídica, NIF español B-87942105 y 12 años de trayectoria',
      quickQuestions: [
        '¿Pudiste comprobar nuestro NIF español B-87942105 y tus 5 contratos de 4 páginas en el enlace?',
        '¿Te da tranquilidad ver que tu cuenta digital tiene IBAN español oficial bajo normativa SEPA?',
        '¿Sabías que todos tus datos están protegidos por la Agencia Española de Protección de Datos (RGPD)?',
        '¿Quieres que te llame 1 minuto por teléfono para que escuches mi voz y me conozcas?',
        '¿Viste que la firma se realiza con sello criptográfico europeo eIDAS (UE 910/2014)?',
        '¿Te gustaría descargar primero en PDF tus contratos de 4 páginas con tu nombre y DNI?',
        '¿Te transmite confianza saber que llevamos más de 12 años y 150.000 clientes en España?',
        '¿Revisamos juntos el primer enlace sin ningún compromiso hasta que estés 100% seguro?',
        '¿Notaste que nunca te pedimos claves de tu banco, solo el número IBAN para depositarte?',
        '¿Avanzamos con el cuestionario 1 ahora que tienes toda nuestra documentación legal en mano?'
      ],
      customMessages: [
        (p, url) =>
          `🛡️ *ACREDITACIÓN LEGAL OFICIAL — INSTACREDIT ESPAÑA FINTECH S.L.*\n\nHola *${p.clientFirstName}*, te saluda *${p.advisorName}*. Te felicito por ser precavido(a) en internet. Aquí tienes nuestras credenciales oficiales verificables en España:\n\n🏛️ *Razón Social:* INSTACREDIT ESPAÑA FINTECH S.L.\n📋 *NIF Español:* B-87942105 (Sede en Paseo de la Castellana 140, Madrid).\n⚖️ *Marco Legal:* Ley 16/2011 de Contratos de Crédito al Consumo y RGPD (LOPDGDD 3/2018).\n🏆 *Trayectoria:* Más de 12 años y 150.000 operaciones en España.\n\n🔗 *Comprueba tus Contratos Oficiales de 4 páginas aquí:*\n${p.baseUrl}/?ver_contratos=${p.radicadoId}\n\n🔗 *Accede a tu Cuestionario Oficial Cifrado aquí:*\n${url}`,
        (p, url) =>
          `🔒 *SEGURIDAD BANCARIA: SOLO USAMOS TU IBAN PARA DEPOSITARTE (${p.capitalAmount})*\n\nEstimado(a) *${p.clientFirstName}*, para tu absoluta tranquilidad te explico cómo protegemos tu seguridad en el expediente *#${p.radicadoId}*:\n\n1️⃣ Jamás te pedimos contraseñas ni claves de acceso de tu banco.\n2️⃣ Únicamente verificamos tu identidad DNI/NIE y tu número IBAN (\`ES...\`) para depositarte el dinero en la cuenta creada.\n3️⃣ Toda la operación queda respaldada con firma electrónica europea *eIDAS*.\n\n👉 *Revisa tu portal seguro aquí:*\n${url}`,
        (p, url) =>
          `📄 *PRUEBA REAL: TUS 5 CONTRATOS DE 4 PÁGINAS YA REDACTADOS A TU NOMBRE*\n\n*${p.clientFirstName}*, una empresa seria y regulada te entrega contratos completos de 4 páginas con sello criptográfico SHA-256 antes de que tomes cualquier decisión.\n\nEntra aquí y verás tu nombre (*${p.clientName}*), tu expediente (*#${p.radicadoId}*) y tu cuenta asignada (\`${p.digitalIban}\`) en los 5 documentos legales:\n👉 ${p.baseUrl}/?ver_contratos=${p.radicadoId}\n\nY cuando estés listo(a), confirma tu paso 1 aquí: ${url}`,
        (p, url) =>
          `🇪🇸 *MÁS DE 12 AÑOS APOYANDO A FAMILIAS Y AUTÓNOMOS EN ESPAÑA*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*, una persona real que te atiende desde Madrid. No hablas con robots.\n\nNuestro compromiso es que en *menos de 30 minutos* completes tus cuestionarios con total confianza y veas tus *${p.capitalAmount}* depositados en tu cuenta.\n\n🔗 *Entra con total tranquilidad a tu enlace oficial:*\n${url}`,
        (p, url) =>
          `⚖️ *PROTEGIDO POR LA AGENCIA ESPAÑOLA DE PROTECCIÓN DE DATOS (AEPD)*\n\n*${p.clientFirstName}*, toda la información que registras en nuestros cuestionarios URL viaja bajo cifrado bancario SSL de 256 bits conforme a la *Ley Orgánica 3/2018 (LOPDGDD)*.\n\n🔗 *Puedes verificar nuestra Política RGPD de 4 páginas y tu solicitud aquí:*\n${url}`,
        (p, url) =>
          `🏦 *CUENTA DIGITAL IBAN ESPAÑOLA BAJO NORMATIVA SEPA PSD2*\n\nHola *${p.clientFirstName}*, te escribe *${p.advisorName}*. Cuando vas llenando tus enlaces oficiales, el sistema te habilita una Cuenta Digital con formato IBAN español (\`${p.digitalIban}\`) conectada a la red SEPA del Banco Central Europeo para depositarte tus *${p.capitalAmount}*.\n\n👉 *Verifica tu expediente aquí:*\n${url}`,
        (p, url) =>
          `🔊 *ESCUCHA MI VOZ O USA EL ASISTENTE AUDITIVO DEL PORTAL*\n\n*${p.clientFirstName}*, entiendo tu cautela. Por eso te acabo de mandar una nota de voz con mi propia voz y, además, al entrar a tu enlace oficial puedes escuchar toda la explicación legal con el altavoz:\n\n🔗 ${url}\n\nEstoy contigo en cada paso. 🤝`,
        (p, url) =>
          `✅ *SIN LETRA PEQUEÑA Y CON 14 DÍAS DE DESISTIMIENTO LEGAL*\n\nEstimado(a) *${p.clientFirstName}*, por el Artículo 28 de la Ley 16/2011, incluso después de recibir el depósito de tus *${p.capitalAmount}* en tu cuenta, dispones de 14 días naturales de garantía legal.\n\n👉 *Avanza tu cuestionario oficial con total respaldo aquí:*\n${url}`,
        (p, url) =>
          `🏅 *CALIFICACIÓN EXCELENTE Y ATENCIÓN PERSONALIZADA (#${p.radicadoId})*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Puedes consultar en cualquier momento nuestro canal oficial de Atención al Cliente (SAC Orden ECO/734/2004) y verificar tu solicitud en vivo:\n\n🔗 ${url}\n\n¿Qué duda específica te gustaría que te despeje ahora mismo? 😊`,
        (p, url) =>
          `🎯 *COMPRUÉBALO TÚ MISMO EN 1 MINUTO SIN COMPROMISO, ${p.clientFirstName.toUpperCase()}*\n\nTe invito a abrir tu enlace oficial ${url} y el visor de tus 5 contratos ${p.baseUrl}/?ver_contratos=${p.radicadoId}.\n\nLéelo con calma y dime por aquí: ¿te transmite la seguridad que buscabas para que dejemos depositados tus *${p.capitalAmount}* en menos de 30 minutos? 👇`
      ],
      customAudios: [
        (p) =>
          `Hola ${p.clientFirstName}, te habla ${p.advisorName} de Instacredit España. Quiero decirte que te entiendo al cien por cien y me parece muy bien que seas precavido en internet. Soy una persona real atendiéndote desde nuestra sede en Madrid, con NIF español B guion ocho siete nueve cuatro dos uno cero cinco. Nunca te vamos a pedir contraseñas de tu banco; solo usamos enlaces seguros para verificar tus datos y depositarte tus ${p.capitalAmount} en la cuenta creada. Te dejé aquí abajo el enlace para que veas tus cinco contratos legales de cuatro páginas a tu nombre.`
      ]
    })
  },

  // ===========================================================================
  // CASO 6: FALTA VERIFICAR CUENTA BANCARIA IBAN (CUESTIONARIO URL 2)
  // ===========================================================================
  {
    id: 'caso-6-verificacion-iban-cuenta',
    caseNumber: 6,
    intentBadge: 'CASO 6 • VINCULACIÓN DE CUENTA E IBAN',
    intentColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    iconEmoji: '🏦',
    title: 'Caso 6: El Cliente Está en el Paso Bancario ("¿Por qué debo poner mi IBAN en el enlace 2?")',
    clientFeelingSummary: 'Ya completó el paso 1 pero se detuvo en el Formulario 2 de titularidad bancaria IBAN y creación de cuenta.',
    whatClientSaidTrigger: '"Ya llené el primer enlace, ¿ahora qué debo poner en el de la cuenta bancaria?"',
    advisorGoalIn30Min: 'Lograr que complete la URL 2 (`?form=iban`) explicándole que ahí queda lista la cuenta donde se depositará el dinero.',
    assignedUrlLabel: 'URL Cuestionario 2 (Titularidad IBAN SEPA y Bizum)',
    assignedUrlSlug: 'iban',
    pairedImageSrc: '/src/assets/images/ws_verificacion_formularios_url_1791520696726.jpg',
    pairedImageTitle: 'Validación Bancaria SEPA y Configuración de Cuenta de Depósito',
    examples: createTenVariationsForCase({
      caseCode: 'C6',
      urlSlug: 'iban',
      urlName: 'Cuestionario 2 de Cuenta e IBAN',
      coreTopic: 'Vinculación de IBAN español y activación de cuenta para el depósito',
      quickQuestions: [
        '¿Tienes a mano los 24 caracteres de tu IBAN que empiezan por ES para ponerlos en el enlace 2?',
        '¿Con qué banco de España operas habitualmente (CaixaBank, BBVA, Santander, ING, etc.)?',
        '¿Confirmaste en el enlace que eres el titular único de la cuenta bajo la Ley SEPBLAC?',
        '¿Prefieres recibir el retiro desde tu cuenta creada hacia tu IBAN por SEPA Instant o por Bizum?',
        '¿Sabías que puedes copiar tu IBAN desde la app de tu banco y pegarlo directo en este enlace?',
        '¿No tienes cuenta propia? ¿Te explico cómo abrir una online gratis en 5 minutos (Imagin/BBVA)?',
        '¿Usaste el botón de voz del Formulario 2 para que te guíe en las 3 casillas bancarias?',
        '¿Me avisas apenas pulses el botón verde de validar IBAN para pasarte a la firma final?',
        '¿Viste que tu Cuenta Digital asignada ya tiene reservado el saldo de tu préstamo?',
        '¿Terminamos este paso 2 en los próximos 5 minutos para cumplir el depósito en menos de 30 min?'
      ],
      customMessages: [
        (p, url) =>
          `🏦 *PASO 2 DE 3: CONFIGURA TU CUENTA PARA EL DEPÓSITO DE ${p.capitalAmount} (#${p.radicadoId})*\n\n¡Muy bien hecho con el Paso 1, *${p.clientFirstName}*! 👏 Te saluda *${p.advisorName}*.\n\nAhora entra a este *Cuestionario URL 2* para vincular tu código IBAN español (\`ES...\`) con tu Cuenta Digital creada (\`${p.digitalIban}\`), que es donde te depositaremos el dinero:\n\n🔗 *2. Abrir Cuestionario Bancario IBAN y Bizum:*\n${url}\n\nToma solo 60 segundos. ¡Avísame al enviarlo! 👇`,
        (p, url) =>
          `🔒 *¿POR QUÉ CERTIFICAMOS TU IBAN EN ESTE ENLACE? (LEY 10/2010 SEPBLAC)*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Por normativa del Banco de España y prevención de blanqueo (SEPBLAC), debemos certificar que el préstamo de *${p.capitalAmount}* se deposita en una cuenta donde *tú eres el titular*.\n\n✅ *Solo indica el nombre de tu banco y tu número IBAN (ES...) aquí:*\n${url}\n\n*(Recuerda: solo es el número IBAN donde recibes transferencias, jamás pedimos claves).* 🛡️`,
        (p, url) =>
          `📲 *ELIGE SI RETIRARÁS TUS ${p.capitalAmount} POR SEPA INSTANT O POR BIZUM*\n\n¡Hola *${p.clientFirstName}*! En este segundo cuestionario URL dejas conectada tu Cuenta Digital INSTACREDIT (\`${p.digitalIban}\`) con tu banco habitual en España (Santander, BBVA, CaixaBank, Sabadell, ING, etc.):\n\n🔗 *Configurar Cuenta de Depósito aquí:*\n${url}\n\nEn cuanto lo envíes, pasamos al último paso de firma. 🚀`,
        (p, url) =>
          `💡 *TRUCO RÁPIDO PARA COPIAR TU IBAN EN 10 SEGUNDOS, ${p.clientFirstName.toUpperCase()}*\n\nSi no te sabes tu número IBAN de memoria:\n1. Abre la App de tu banco y toca en *"Ver número de cuenta / IBAN"*.\n2. Pulsa *"Copiar"*.\n3. Abre este enlace oficial y pégalo en la casilla:\n👉 ${url}\n\n¡Así evitamos errores de dígitos y te depositamos más rápido! 👍`,
        (p, url) =>
          `⏱️ *ESTAMOS AL 75% DE TU PRÉSTAMO EN MENOS DE 30 MINUTOS (#${p.radicadoId})*\n\n*${p.clientFirstName}*, ya casi terminamos. Solo nos falta que completes este Cuestionario URL 2 de titularidad bancaria para que el comité libere el depósito de tus *${p.capitalAmount}* en tu cuenta creada:\n\n🔗 ${url}\n\n¡Te espero en línea! ⚡`,
        (p, url) =>
          `🔊 *FORMULARIO BANCARIO CON AYUDA DE VOZ PASO A PASO*\n\nHola *${p.clientFirstName}*, te escribe *${p.advisorName}*. Si tienes cualquier duda al rellenar los datos de tu banco, entra a este enlace y pulsa el botón amarillo *"Escuchar Guía con Voz"*:\n\n👉 ${url}\n\nO pásame tu número IBAN escrito por este chat y yo mismo te ayudo a verificarlo. 🤝`,
        (p, url) =>
          `🆕 *¿NO TIENES CUENTA A TU NOMBRE? SOLUCIÓN EN 5 MINUTOS*\n\n*${p.clientFirstName}*, recuerda que por ley no podemos depositar en cuentas de familiares. Si ahora mismo no tienes cuenta propia, puedes descargar gratis *Imagin (CaixaBank)*, *BBVA Online* o *Revolut ES* en 5 minutos, obtener tu IBAN español y registrarlo en tu enlace:\n\n🔗 ${url}`,
        (p, url) =>
          `🏛️ *CONEXIÓN DIRECTA CON LA PASARELA SEPA DEL BANCO CENTRAL EUROPEO*\n\nEstimado(a) *${p.clientName}*, al registrar tu IBAN en este cuestionario oficial, nuestro motor bancario verifica que la cuenta esté activa en España para que el depósito de *${p.capitalAmount}* llegue sin rechazos:\n\n👉 ${url}`,
        (p, url) =>
          `🎁 *COMPLETA EL PASO 2 Y ASEGURA TU TICKET DE SORTEO PREFERENTE*\n\n¡Vas genial con el tiempo, *${p.clientFirstName}*! Completa ahora tu Cuestionario 2 de Cuenta Bancaria para mantener tu solicitud dentro de los 30 minutos y conservar tu *Ticket Dorado de Sorteo VIP*:\n\n🔗 ${url}`,
        (p, url) =>
          `🎯 *SOLO FALTA ESTE CLIC BANCARIO PARA PASAR A LA FIRMA, ${p.clientFirstName.toUpperCase()}*\n\nAquí tienes tu URL independiente del Formulario 2:\n👉 ${url}\n\n¿Prefieres pegarlo tú mismo en el enlace ahora o me escribes tu IBAN por aquí para revisarlo juntos? 👇`
      ],
      customAudios: [
        (p) =>
          `¡Excelente avance, ${p.clientFirstName}! Ya tenemos tu primer paso validado. Ahora te acabo de enviar aquí abajo el segundo enlace, que es donde queda configurada tu cuenta bancaria para el depósito de tus ${p.capitalAmount}. Solo tienes que entrar, seleccionar el nombre de tu banco en España y escribir tu código IBAN que empieza por E-S, confirmando que eres el titular. Apenas lo envíes, pasamos al último paso de firma digital.`
      ]
    })
  },

  // ===========================================================================
  // CASO 7: PREOCUPACIÓN POR ASNEF, AUTÓNOMO, EXTRANJERO NIE O SIN AVAL
  // ===========================================================================
  {
    id: 'caso-7-asnef-nie-autonomo',
    caseNumber: 7,
    intentBadge: 'CASO 7 • ASNEF / NIE / AUTÓNOMOS / SIN AVAL',
    intentColor: 'bg-purple-100 text-purple-900 border-purple-300',
    iconEmoji: '🌍',
    title: 'Caso 7: El Cliente Teme Ser Rechazado ("Estoy en ASNEF / Soy Extranjero con NIE / Soy Autónomo / No tengo aval")',
    clientFeelingSummary: 'Cree que no le darán el préstamo por tener un apunte en ASNEF, tener NIE/TIE, ser autónomo o no tener propiedades.',
    whatClientSaidTrigger: '"Es que estoy en ASNEF por una factura / tengo NIE / cobro pensión o soy autónomo, ¿me lo aprueban igual?"',
    advisorGoalIn30Min: 'Darle seguridad absoluta de inclusión financiera (aprobamos con ASNEF leve, NIE/TIE, pensión o autónomos sin avalista) y enviarlo a la URL 1.',
    assignedUrlLabel: 'URL Cuestionario de Solvencia Inclusiva (ASNEF / NIE / Autónomos)',
    assignedUrlSlug: 'solicitud',
    pairedImageSrc: '/src/assets/images/ws_docs_guia_1790860205561.jpg',
    pairedImageTitle: 'Inclusión Financiera en España: DNI/NIE, ASNEF Leve, Autónomos y Pensionistas',
    examples: createTenVariationsForCase({
      caseCode: 'C7',
      urlSlug: 'solicitud',
      urlName: 'Cuestionario de Solvencia Flexible',
      coreTopic: 'Viabilidad para ASNEF, NIE/TIE, autónomos y pensionistas sin aval',
      quickQuestions: [
        '¿Sabías que evaluamos tu capacidad de pago actual y un apunte menor en ASNEF no frena tu aprobación?',
        '¿Tienes tu tarjeta TIE/NIE o pasaporte en vigor para validarlo en el enlace en 1 minuto?',
        '¿Cuentas con ingresos demostrables en España (nómina, pensión, prestación o actividad de autónomo)?',
        '¿Te tranquiliza saber que tu operación lleva cobertura del Fondo Europeo (FGA) y NO necesitas avalista?',
        '¿Registramos ya tus datos en el cuestionario URL para darte el visto bueno en menos de 20 minutos?',
        '¿Quieres usar parte del préstamo para reunificar y limpiar ese apunte de ASNEF?',
        '¿Prefieres enviarme la foto de tu NIE o justificante de ingresos por este chat mientras llenas el link?',
        '¿Viste que para autónomos aceptamos el último Modelo 130 o extracto de ingresos sin balances complejos?',
        '¿Activamos tu cuenta digital ahora mismo completando el enlace azul?',
        '¿Me confirmas apenas envíes el formulario para priorizar tu expediente en el comité?'
      ],
      customMessages: [
        (p, url) =>
          `✅ *¡SÍ ES VIABLE TU SOLICITUD, ${p.clientFirstName.toUpperCase()}! ESTUDIO FLEXIBLE EN 30 MINUTOS*\n\nTe saluda *${p.advisorName}* de *INSTACREDIT España*. Quiero darte total tranquilidad respecto a tu expediente *#${p.radicadoId}* por *${p.capitalAmount}*:\n\n• *¿Apunte en ASNEF?* Si es por telefonía, suministros o importes menores, *SÍ aprobamos* evaluando tus ingresos actuales.\n• *¿Sin avalista ni hipoteca?* Incluimos cobertura del *Fondo Europeo de Garantías (FGA)*.\n• *¿Extranjero con NIE/TIE o Autónomo?* 100% admitido con cuenta IBAN en España.\n\n🔗 *Completa tu cuestionario de viabilidad aquí:*\n${url}`,
        (p, url) =>
          `🌍 *INCLUSIÓN FINANCIERA PARA RESIDENTES CON NIE / TIE EN ESPAÑA*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. En *INSTACREDIT España* atendemos a miles de ciudadanos extranjeros residentes con total igualdad.\n\nSolo necesitas tu *NIE Comunitario o Tarjeta TIE en vigor*, ingresos regulares y tu cuenta IBAN española para recibir el depósito de tus *${p.capitalAmount}*.\n\n👉 *Valida tu documento en este enlace directo:*\n${url}`,
        (p, url) =>
          `🛡️ *APROBACIÓN SIN AVALISTAS NI PROPIEDADES (#${p.radicadoId})*\n\nEstimado(a) *${p.clientFirstName}*, no tienes que molestar a ningún familiar para que te avale. Tu préstamo de *${p.capitalAmount}* queda respaldado automáticamente por el *Fondo de Garantías (FGA)* dentro de tu misma solicitud.\n\n🔗 *Confirma tu solicitud aquí para configurar tu cuenta de depósito:*\n${url}`,
        (p, url) =>
          `💼 *LÍNEA ESPECIAL PARA AUTÓNOMOS, PENSIONISTAS Y CONTRATOS TEMPORALES*\n\nHola *${p.clientFirstName}*, te escribe *${p.advisorName}*. Ya seas trabajador por cuenta propia (Modelo 130 / extracto), jubilado/pensionista o asalariado, nuestro sistema valida tu solvencia en *menos de 30 minutos*.\n\n👉 *Registra tus ingresos mensuales aproximados en este enlace:*\n${url}`,
        (p, url) =>
          `🧹 *USA TU PRÉSTAMO PARA SALIR DE ASNEF Y MEJORAR TU HISTORIAL*\n\n*${p.clientFirstName}*, muchos de nuestros clientes solicitan sus *${p.capitalAmount}* precisamente para cancelar pequeñas deudas pendientes, salir de ASNEF y quedarse con una sola cuota mensual cómoda.\n\n🔗 *Selecciona "Unificación de Deudas" en tu enlace oficial aquí:*\n${url}`,
        (p, url) =>
          `📸 *ENVÍO FÁCIL DE TU DNI/NIE E INGRESOS SIN BUROCRACIA*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Para aprobar tus *${p.capitalAmount}* en menos de 30 minutos, completa primero este enlace rápido:\n\n👉 ${url}\n\nY si quieres ganar aún más tiempo, respóndeme por aquí con una foto clara de tu DNI/NIE por ambas caras. ⚡`,
        (p, url) =>
          `🔊 *FORMULARIO INCLUSIVO CON VOZ PARA TODAS LAS PERSONAS*\n\nEstimado(a) *${p.clientName}*, nuestro cuestionario está diseñado para que cualquier persona, sin importar su edad o manejo del móvil, pueda completarlo escuchando las instrucciones por voz:\n\n🔗 ${url}\n\n¡Estoy aquí para apoyarte en cada paso! 🤝`,
        (p, url) =>
          `🏦 *TU CUENTA DIGITAL (\`${p.digitalIban}\`) YA ESTÁ RESERVADA PARA TI*\n\n*${p.clientFirstName}*, tu perfil ya cuenta con pre-aprobación operativa. A medida que completas este cuestionario y el de tu IBAN, dejamos todo listo para depositarte tus *${p.capitalAmount}*:\n\n👉 ${url}`,
        (p, url) =>
          `🎁 *PRIORIDAD DE COMITÉ + TICKET DE SORTEO VIP PARA TU EXPEDIENTE #${p.radicadoId}*\n\nHola *${p.clientFirstName}*, he marcado tu solicitud con *Prioridad Especial de Analista* para darte resolución positiva en los próximos 20 minutos y sumarte al Sorteo Preferente.\n\n🔗 *Entra ahora a tu enlace:*\n${url}`,
        (p, url) =>
          `🎯 *AVANCEMOS SIN MIEDO, ${p.clientFirstName.toUpperCase()}: TIENES PRE-VIABILIDAD FAVORABLE*\n\nComo asesor tuyo (*${p.advisorName}*), ya revisé tu perfil inicial y cumple nuestros parámetros flexibles.\n\n👉 *Toca aquí para confirmar tu Cuestionario 1:*\n${url}\n\n¿Lo abres ahora y me avisas para pasarlo directo a firma? 👇`
      ],
      customAudios: [
        (p) =>
          `Hola ${p.clientFirstName}, te habla ${p.advisorName} de Instacredit España. Quédate totalmente tranquilo por lo que me comentas. En nuestra entidad evaluamos a las personas por su capacidad de pago actual: aceptamos DNI español, tarjeta TIE o NIE de residencia, autónomos, pensionistas e incluso solicitudes con apuntes menores en ASNEF, y no te pedimos avalista porque incluimos el Fondo Europeo de Garantías. Entra con total confianza al enlace que te dejé aquí abajo para completar tu cuestionario y en menos de treinta minutos dejamos listo tu depósito.`
      ]
    })
  },

  // ===========================================================================
  // CASO 8: APROBADO PERO PENDIENTE DE FIRMA DIGITAL eIDAS (CUESTIONARIO URL 3)
  // ===========================================================================
  {
    id: 'caso-8-aprobado-falta-firma',
    caseNumber: 8,
    intentBadge: 'CASO 8 • APROBADO / FALTA FIRMA eIDAS',
    intentColor: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    iconEmoji: '✍️',
    title: 'Caso 8: El Préstamo Está Aprobado pero Falta la Firma Digital en la URL 3',
    clientFeelingSummary: 'Ya tiene el crédito aprobado, pero no sabe cómo firmar en el móvil o no ha entrado al enlace 3 (`?form=cuota_firma`).',
    whatClientSaidTrigger: '"¡Qué bien que esté aprobado! ¿Cómo firmo ahora para que me depositéis el dinero?"',
    advisorGoalIn30Min: 'Guiarlo en 60 segundos a abrir la URL 3 (`?form=cuota_firma`), dibujar su firma con el dedo y liberar el depósito en su cuenta.',
    assignedUrlLabel: 'URL Cuestionario 3 (Firma Electrónica eIDAS + Depósito)',
    assignedUrlSlug: 'cuota_firma',
    pairedImageSrc: '/src/assets/images/ws_cierre_aprob_1790860226017.jpg',
    pairedImageTitle: 'Certificado de Aprobación Concedida y Firma Electrónica eIDAS',
    examples: createTenVariationsForCase({
      caseCode: 'C8',
      urlSlug: 'cuota_firma',
      urlName: 'Cuestionario 3 de Firma Electrónica eIDAS',
      coreTopic: 'Firma táctil con el dedo y código OTP para liberar el depósito inmediato',
      quickQuestions: [
        '¿Entras ahora al enlace 3 para dibujar tu firma con el dedo y recibir el depósito en tu cuenta?',
        '¿Viste que no necesitas imprimir nada porque la firma se hace directo en la pantalla del móvil?',
        '¿Elegiste en el formulario si prefieres pagar tus cuotas futuras por domiciliación SEPA, tarjeta o Bizum?',
        '¿Ya pudiste descargar tus 5 contratos oficiales de 4 páginas en PDF?',
        '¿Te salió ya el sello verde de firmado en pantalla para ordenar tu transferencia?',
        '¿Necesitas que te guíe por teléfono mientras dibujas tu firma en el recuadro blanco?',
        '¿Sabías que apenas pulses "Firmar y Confirmar" el saldo pasa a tu Cuenta Digital creada?',
        '¿Confirmaste el código OTP en la casilla de firma electrónica eIDAS?',
        '¿Activamos también tu participación en el Sorteo VIP al dejar firmado hoy tu contrato?',
        '¿Me envías captura o me escribes "FIRMADO" apenas termines este último enlace?'
      ],
      customMessages: [
        (p, url) =>
          `🎉✍️ *¡ENHORABUENA, ${p.clientFirstName.toUpperCase()}! ÚLTIMO PASO: FIRMA EN 1 MINUTO Y RECIBE TU DEPÓSITO*\n\nTe saluda *${p.advisorName}* de *INSTACREDIT España*. Tu préstamo *#${p.radicadoId}* por *${p.capitalAmount}* está *100% APROBADO*.\n\nSolo falta que entres a este *Cuestionario URL 3*, dibujes tu firma con el dedo en la pantalla de tu móvil y pulses confirmar para depositar el dinero en tu cuenta creada (\`${p.digitalIban}\`):\n\n🔗 *3. Enlace Directo de Firma Electrónica eIDAS:*\n${url}\n\n¡Avísame apenas te salga el sello verde! 🚀`,
        (p, url) =>
          `📱 *CÓMO FIRMAR DESDE TU MÓVIL EN 3 PASOS MUY FÁCILES (#${p.radicadoId})*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Para liberar tus *${p.capitalAmount}* sin papeles ni impresoras:\n\n1️⃣ Toca este enlace oficial: ${url}\n2️⃣ Elige el día del mes que prefieres para tus cuotas.\n3️⃣ Dibuja tu firma con el dedo dentro del recuadro blanco y pulsa el botón verde.\n\nEn el acto ordenamos el depósito en tu cuenta. 💶⚡`,
        (p, url) =>
          `📄 *TUS 5 CONTRATOS DE 4 PÁGINAS + ENLACE DE FIRMA OFICIAL eIDAS*\n\nEstimado(a) *${p.clientName}*, en cumplimiento de la *Ley 16/2011* y el *Reglamento Europeo eIDAS (UE 910/2014)*, tienes listos tus dos enlaces finales:\n\n🔗 *Leer/Descargar tus 5 Contratos (4 págs c/u):*\n${p.baseUrl}/?ver_contratos=${p.radicadoId}\n\n✍️ *Firmar Electrónicamente para Recibir Depósito:*\n${url}`,
        (p, url) =>
          `🏦 *TUS ${p.capitalAmount} ESTÁN LISTOS PARA ENTRAR EN TU CUENTA \`${p.digitalIban}\`*\n\n¡Hola *${p.clientFirstName}*! Tesorería ya tiene autorizada la orden de abono de tus *${p.capitalAmount}* hacia la cuenta que fuiste creando en los pasos anteriores.\n\nEl sistema solo espera tu rúbrica digital aquí:\n👉 ${url}\n\n¡Entra ahora y lo dejamos depositado en menos de 5 minutos! 🤝`,
        (p, url) =>
          `🔔 *RECORDATORIO DE TESORERÍA: FALTA TU FIRMA DIGITAL PARA EL CORTE SEPA*\n\n*${p.clientFirstName}*, te escribe *${p.advisorName}*. En 15 minutos sale el bloque de transferencias SEPA Instantáneas y quiero que tus *${p.capitalAmount}* entren ahora mismo.\n\n🔗 *Firma tu contrato en 60 segundos aquí:*\n${url}`,
        (p, url) =>
          `🔊 *FIRMA ASISTIDA CON GUÍA DE VOZ EN PANTALLA*\n\nHola *${p.clientFirstName}*, si nunca has firmado un documento en el teléfono, ¡es facilísimo! Al abrir este enlace, el asistente de voz te indica dónde apoyar el dedo para trazar tu firma:\n\n👉 ${url}\n\nEstoy en línea por si necesitas ayuda. 😊`,
        (p, url) =>
          `🔐 *VALIDEZ JURÍDICA EUROPEA CON CÓDIGO OTP Y SELLO SHA-256*\n\n*${p.clientFirstName}*, tu firma en este enlace genera automáticamente tu certificado criptográfico oficial sin que tengas que desplazarte a ninguna notaría:\n\n🔗 *Firmar Pagaré y Contrato aquí:*\n${url}\n\nAl terminar, tus *${p.capitalAmount}* quedan depositados en tu cuenta.`,
        (p, url) =>
          `💳 *ELIGE CÓMO PAGARÁS TUS CUOTAS Y FIRMA TU ABONO DE ${p.capitalAmount}*\n\nHola *${p.clientFirstName}*, dentro de este tercer enlace puedes elegir si prefieres abonar tus cuotas mensuales por recibo SEPA, tarjeta o Bizum, y estampar tu firma final:\n\n👉 ${url}`,
        (p, url) =>
          `🎁 *AL FIRMAR AHORA QUEDA ACTIVADO TU TICKET DORADO DEL SORTEO VIP*\n\n¡Felicidades *${p.clientFirstName}*! Estás a un solo paso de recibir tus *${p.capitalAmount}* en tu cuenta y activar tu participación en el sorteo de *Condonación de la 1ª Cuota*.\n\n🔗 *Firma aquí en 1 minuto:*\n${url}`,
        (p, url) =>
          `🎯 *ÚLTIMO CLIC PARA VER TU SALDO DEPOSITADO, ${p.clientFirstName.toUpperCase()}*\n\nAquí tienes tu URL directa de Firma Final:\n👉 ${url}\n\n¿Entras ahora mismo y me escribes *"LISTO"* apenas veas la confirmación verde en pantalla? 👇`
      ],
      customAudios: [
        (p) =>
          `¡Enhorabuena, ${p.clientFirstName}! Te habla ${p.advisorName}. Tu préstamo de ${p.capitalAmount} ya está aprobado y estamos en el tercer y último enlace antes del depósito en tu cuenta creada. Solo tienes que tocar el link que te acabo de mandar aquí abajo, dibujar tu firma con el dedo dentro del recuadro blanco en la pantalla de tu móvil y pulsar el botón verde de confirmar. En cuanto lo hagas, el dinero se deposita inmediatamente en tu cuenta digital.`
      ]
    })
  },

  // ===========================================================================
  // CASO 9: DINERO DEPOSITADO EN LA CUENTA CREADA Y RETIRO BIZUM / SEPA
  // ===========================================================================
  {
    id: 'caso-9-deposito-cuenta-creada',
    caseNumber: 9,
    intentBadge: 'CASO 9 • DEPÓSITO EN CUENTA CREADA Y RETIRO',
    intentColor: 'bg-teal-100 text-teal-900 border-teal-300',
    iconEmoji: '💸',
    title: 'Caso 9: Explicar que el Dinero Ya Está Depositado en la Cuenta Creada y Cómo Usarlo',
    clientFeelingSummary: 'Completó los cuestionarios y quiere ver su dinero en la cuenta que fue creando y pasarlo a su banco o Bizum.',
    whatClientSaidTrigger: '"Ya completé y firmé todo, ¿dónde veo mi dinero depositado y cómo lo paso a mi banco?"',
    advisorGoalIn30Min: 'Enviarle la URL directa de su Portal de Banca Digital (`?banca_digital=`) donde ve sus fondos acreditados y retira por SEPA o Bizum.',
    assignedUrlLabel: 'URL Portal de Cuenta Digital Creada (Retiro SEPA / Bizum)',
    assignedUrlSlug: 'banca_digital',
    pairedImageSrc: '/src/assets/images/ws_desembolso_bizum_1790894749766.jpg',
    pairedImageTitle: 'Fondos Depositados en tu Cuenta Creada — Retiro Instantáneo SEPA y Bizum',
    examples: createTenVariationsForCase({
      caseCode: 'C9',
      urlSlug: 'banca_digital',
      urlName: 'Portal de Banca Digital del Cliente',
      coreTopic: 'Fondos depositados en la cuenta creada y retiro inmediato',
      quickQuestions: [
        '¿Ya entraste al enlace de tu Cuenta Digital creada para ver tu saldo depositado?',
        '¿Vas a transferir los fondos a tu banco habitual por SEPA Instantánea o por Bizum?',
        '¿Viste que la transferencia desde tu Cuenta Digital hacia tu IBAN tiene 0,00 € de comisión?',
        '¿Quieres descargar desde tu portal el justificante bancario en PDF de la operación?',
        '¿Sabías que al pagar puntualmente tu primera cuota tu cupo sube automáticamente hasta 5.000 €?',
        '¿Necesitas que te guíe en pantalla para pulsar el botón "Retirar Fondos a mi Banco"?',
        '¿Recibiste también tu código de participación en el Sorteo VIP de clientes cumplidos?',
        '¿Qué tal te pareció nuestra rapidez en menos de 30 minutos? ¿Nos calificas en la encuesta?',
        '¿Recuerdas que tu primera cuota vence en la fecha indicada en tu contrato de 4 páginas?',
        '¿Te puedo ayudar en algo más hoy o ya estás disfrutando de tus fondos?'
      ],
      customMessages: [
        (p) =>
          `💸🎉 *¡DEPÓSITO COMPLETADO! TUS ${p.capitalAmount} YA ESTÁN EN TU CUENTA CREADA (#${p.radicadoId})*\n\n¡Lo logramos en menos de 30 minutos, *${p.clientFirstName}*! Te saluda *${p.advisorName}* de *INSTACREDIT España*.\n\nComo completaste todos tus cuestionarios, el sistema ya depositó tus *${p.capitalAmount}* en la *Cuenta Digital* que fuiste creando:\n• *IBAN de tu Cuenta Creada:* \`${p.digitalIban}\`\n• *Saldo Depositado Disponible:* *${p.capitalAmount}*\n\n🏦 *Entra aquí a tu Banca Digital para retirarlo a tu banco por SEPA Instant o Bizum:*\n${p.baseUrl}/?banca_digital=${p.radicadoId}`,
        (p) =>
          `📲 *CÓMO PASAR TUS ${p.capitalAmount} DE TU CUENTA CREADA A TU BIZUM O BANCO EN 15 SEGUNDOS*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. Tu dinero ya está depositado en tu cuenta \`${p.digitalIban}\`. Para moverlo a tu banco de siempre:\n\n1️⃣ Abre tu Portal de Banca Digital: ${p.baseUrl}/?banca_digital=${p.radicadoId}\n2️⃣ Pulsa en *"Transferir a mi IBAN (SEPA Instant)"* o *"Retiro por Bizum"*.\n3️⃣ Confirma el importe y ¡listo!\n\nCualquier duda mientras estás dentro, avísame por aquí. 🚀`,
        (p) =>
          `🏛️ *CERTIFICADO DE LIQUIDACIÓN Y DEPÓSITO ACREDITADO (#${p.radicadoId})*\n\nEstimado(a) *${p.clientName}*, le confirmamos oficialmente que su préstamo por *${p.capitalAmount}* ha sido desembolsado e ingresado en su Cuenta Digital asignada (\`${p.digitalIban}\`).\n\n🔗 *Acceso Directo a su Cuenta Digital:*\n${p.baseUrl}/?banca_digital=${p.radicadoId}\n\n🔗 *Descarga de sus 5 Contratos Firmados (4 págs c/u):*\n${p.baseUrl}/?ver_contratos=${p.radicadoId}`,
        (p) =>
          `⚡ *CUMPLIMOS NUESTRA PROMESA DE MENOS DE 30 MINUTOS, ${p.clientFirstName.toUpperCase()}*\n\nViste qué sencillo fue: por cada enlace que completaste se configuró tu cuenta y ya tienes tus *${p.capitalAmount}* depositados.\n\n👉 *Consulta tu saldo en vivo y opera aquí:*\n${p.baseUrl}/?banca_digital=${p.radicadoId}\n\n¡Ha sido un verdadero placer asesorarte hoy! 🤝🇪🇸`,
        (p) =>
          `⭐ *BENEFICIO DESBLOQUEADO: SUBIDA DE CUPO HASTA 5.000 € EN TU PRÓXIMO CRÉDITO*\n\nHola *${p.clientFirstName}*, ahora que ya tienes tus *${p.capitalAmount}* depositados en tu cuenta (\`${p.digitalIban}\`), recuerda que al abonar puntualmente antes del *${p.dueDate}* desbloqueas automáticamente el *Nivel VIP*.\n\n🔗 *Entra a tu Banca Digital aquí:*\n${p.baseUrl}/?banca_digital=${p.radicadoId}`,
        (p) =>
          `🆓 *0,00 € DE COMISIÓN EN TODAS TUS TRANSFERENCIAS SEPA DESDE TU CUENTA DIGITAL*\n\n*${p.clientFirstName}*, te recuerda *${p.advisorName}*: tu Cuenta Digital INSTACREDIT (\`${p.digitalIban}\`) no tiene comisiones de mantenimiento ni de transferencia hacia ningún banco español.\n\n👉 *Gestiona tus ${p.capitalAmount} aquí:*\n${p.baseUrl}/?banca_digital=${p.radicadoId}`,
        (p) =>
          `🎁 *TU TICKET DEL SORTEO PREFERENTE HA QUEDADO OFICIALMENTE ACTIVO (#${p.radicadoId})*\n\n¡Enhorabuena por partida doble, *${p.clientFirstName}*! Ya tienes tus *${p.capitalAmount}* depositados en tu cuenta creada y además participas en el sorteo de *Condonación de tu Primera Cuota*.\n\n🔗 *Revisa tu cuenta aquí:*\n${p.baseUrl}/?banca_digital=${p.radicadoId}`,
        (p) =>
          `📅 *RESUMEN DE TU PRIMERA CUOTA Y CANALES DE PAGO CÓMODOS*\n\nHola *${p.clientFirstName}*, tus *${p.capitalAmount}* ya están disponibles en \`${p.digitalIban}\`. Recuerda que tu primera fecha de pago es el *${p.dueDate}* y podrás abonarla en 1 clic desde el mismo enlace:\n\n👉 ${p.baseUrl}/?banca_digital=${p.radicadoId}`,
        (p) =>
          `🌟 *¿NOS REGALAS 30 SEGUNDOS EN LA ENCUESTA DE CALIDAD?*\n\n*${p.clientFirstName}*, me encantaría saber cómo te sentiste con mi atención hoy al gestionar y depositar tus *${p.capitalAmount}*.\n\n🏦 *Ver tu Cuenta Digital:* ${p.baseUrl}/?banca_digital=${p.radicadoId}\n🌟 *Encuesta Rápida de Satisfacción:* ${p.baseUrl}/?form=reclamacion&exp=${p.radicadoId}`,
        (p) =>
          `🎯 *CONFÍRMAME CUANDO ESTÉS DENTRO DE TU BANCA DIGITAL, ${p.clientFirstName.toUpperCase()}*\n\nToca aquí para abrir tu cuenta creada con tus *${p.capitalAmount}*:\n👉 ${p.baseUrl}/?banca_digital=${p.radicadoId}\n\n¿Ya puedes ver el saldo verde en pantalla o quieres que te guíe para retirarlo por Bizum? 👇`
      ],
      customAudios: [
        (p) =>
          `¡Muchísimas felicidades, ${p.clientFirstName}! Te habla ${p.advisorName}. Como completaste todos tus cuestionarios, el sistema ya depositó oficialmente tus ${p.capitalAmount} en la Cuenta Digital que fuiste creando, terminada en ${p.digitalIban.slice(-4)}. Toca el enlace directo que te dejé aquí abajo para entrar a tu Banca Digital y transferir el dinero en segundos a tu banco habitual por SEPA instantánea o por Bizum. ¡Que lo disfrutes muchísimo!`
      ]
    })
  },

  // ===========================================================================
  // CASO 10: CLIENTE INDECISO ("LO VOY A PENSAR") -> GANCHO Y SORTEO VIP
  // ===========================================================================
  {
    id: 'caso-10-indeciso-gancho-sorteo',
    caseNumber: 10,
    intentBadge: 'CASO 10 • GANCHO DE CIERRE Y SORTEO VIP',
    intentColor: 'bg-amber-100 text-amber-950 border-amber-400',
    iconEmoji: '🎁',
    title: 'Caso 10: El Cliente Está Indeciso ("Lo voy a pensar / Mañana te aviso") — Aplicar Gancho o Sorteo',
    clientFeelingSummary: 'Tiene interés pero posterga la decisión; necesita un gancho atractivo (sorteo, bono de cuota o prioridad 30 min) para cerrar hoy.',
    whatClientSaidTrigger: '"Déjame pensarlo un poco y mañana o luego te escribo..."',
    advisorGoalIn30Min: 'Activarle un Gancho Irresistible (Ticket de Sorteo de Primera Cuota Gratis + Reserva Garantizada por 30 min) para que complete la URL ahora.',
    assignedUrlLabel: 'URL Activación de Beneficio VIP y Solicitud',
    assignedUrlSlug: 'solicitud',
    pairedImageSrc: '/src/assets/images/ws_sorteo_gancho_vip_1791522025879.jpg',
    pairedImageTitle: 'Ticket Dorado de Sorteo Preferente y Beneficio por Finalizar Hoy',
    examples: createTenVariationsForCase({
      caseCode: 'C10',
      urlSlug: 'solicitud',
      urlName: 'URL con Beneficio y Sorteo VIP Activo',
      coreTopic: 'Gancho persuasivo con sorteo, beneficio de cuota y depósito en 30 minutos',
      quickQuestions: [
        '¿Qué te parece si dejamos asegurado tu Ticket Dorado del Sorteo de 1ª Cuota Gratis completando el enlace hoy?',
        '¿Sabías que tienes 14 días legales para desistir sin coste si después decides no usar el dinero?',
        '¿Prefieres que te reduzcamos la cuota mensual ajustando el plazo en el enlace ahora mismo?',
        '¿Te gustaría dejar creada tu cuenta digital con el cupo aprobado para tener el dinero listo cuando quieras?',
        '¿Aprovechamos que tu expediente ya tiene prioridad de 30 minutos hoy para no empezar de cero mañana?',
        '¿Quieres aplicar el bono de 10% de descuento en costes de gestión cerrando tu solicitud en este turno?',
        '¿Qué es lo único que te detiene ahora mismo para resolvértelo en 1 minuto por aquí?',
        '¿Viste la tarjeta de premio VIP que te acabo de adjuntar con tu número de expediente?',
        '¿Dejamos completado al menos este enlace de 60 segundos para bloquearte la tasa baja de hoy?',
        '¿Entras tú al enlace para activar el beneficio o lo rellenamos juntos en 2 minutos?'
      ],
      customMessages: [
        (p, url) =>
          `🎁🏆 *¡ESPERA, ${p.clientFirstName.toUpperCase()}! TE HE ACTIVADO UN BENEFICIO EXCLUSIVO EN TU EXPEDIENTE #${p.radicadoId}*\n\nTe saluda *${p.advisorName}* de *INSTACREDIT España*. Entiendo que quieras pensarlo, pero antes de cerrar tu turno quiero regalarte una ventaja única:\n\n✨ Si completamos tu solicitud de *${p.capitalAmount}* en los próximos *30 minutos*, el sistema te asigna un *Ticket Dorado VIP* para el sorteo mensual donde *condonamos el 100% de tu primera cuota + Bono de 500 €*.\n\n🔗 *Activa tu beneficio y deja creada tu cuenta aquí:*\n${url}\n\n¡Solo te toma 1 minuto! 🚀`,
        (p, url) =>
          `🛡️ *VENTAJA INTELIGENTE: RECIBE EL DEPÓSITO HOY Y TIENES 14 DÍAS PARA DECIDIR*\n\nHola *${p.clientFirstName}*, soy *${p.advisorName}*. ¿Sabías que por el Art. 28 de la *Ley 16/2011* tienes *14 días naturales de desistimiento legal*?\n\nEso significa que puedes terminar tus enlaces hoy en 20 minutos, recibir los *${p.capitalAmount}* depositados en tu cuenta creada (\`${p.digitalIban}\`), y si en los próximos días ya no los necesitas, los devuelves sin penalización.\n\n👉 *Asegura tu liquidez hoy aquí:*\n${url}`,
        (p, url) =>
          `⏳ *NO PIERDAS TU APROBACIÓN RÁPIDA DE 30 MINUTOS (#${p.radicadoId})*\n\n*${p.clientFirstName}*, hoy tu expediente ya pasó el primer filtro y tiene cupo asignado por *${p.capitalAmount}*. Si lo dejamos para otro día, el sistema libera la partida y habría que iniciar cola nuevamente.\n\n🔗 *Déjalo asegurado en 90 segundos tocando aquí:*\n${url}\n\n¿Te ayudo a completarlo ahora mismo? 🤝`,
        (p, url) =>
          `💶 *BONO DE REDUCCIÓN DE CUOTA ACTIVADO PARA TI, ${p.clientFirstName.toUpperCase()}*\n\nTe escribe *${p.advisorName}* de *INSTACREDIT España*. Si el motivo para pensarlo es la cuota mensual, acabo de habilitar en tu enlace la opción de plazo flexible con *bonificación del 10% por cliente preferente*:\n\n👉 *Mira tu nueva cuota reducida aquí:*\n${url}`,
        (p, url) =>
          `🏦 *DEJA TU CUENTA DIGITAL CREADA Y CON EL SALDO LISTO (${p.capitalAmount})*\n\nHola *${p.clientFirstName}*, mi consejo como tu asesor es que dejemos creada tu Cuenta Digital (\`${p.digitalIban}\`) con los *${p.capitalAmount}* ya depositados hoy mismo.\n\nAsí, ante cualquier urgencia esta tarde o mañana, ya tienes el dinero en tu bolsillo listo para sacar por Bizum.\n\n🔗 *Completa tu enlace en 1 minuto aquí:*\n${url}`,
        (p, url) =>
          `🎟️ *TICKET PREFERENTE #VIP-${p.radicadoId.slice(-4)} ASIGNADO A TU NOMBRE*\n\nEstimado(a) *${p.clientFirstName}*, he vinculado tu expediente *#${p.radicadoId}* a nuestra campaña de premios para clientes digitales.\n\n🎁 *Beneficio 1:* Depósito en cuenta en menos de 30 minutos.\n🎁 *Beneficio 2:* Participación en 1ª Cuota Gratis.\n🎁 *Beneficio 3:* Aumento de cupo a 5.000 € en tu 2º préstamo.\n\n👉 *Valídalo aquí:* ${url}`,
        (p, url) =>
          `🤝 *DIME QUÉ DUDA TE QUEDA Y LA RESOLVEMOS EN 30 SEGUNDOS*\n\n*${p.clientFirstName}*, soy *${p.advisorName}*. Muchas veces postergamos porque nos quedó una pequeña duda sobre los plazos o la cuenta.\n\nPregúntame con total confianza por aquí o abre tu cuestionario asistido por voz sin compromiso:\n🔗 ${url}`,
        (p, url) =>
          `⚡ *SOLO TE FALTAN 2 MINUTOS PARA TENER TUS ${p.capitalAmount} EN CUENTA*\n\nHola *${p.clientFirstName}*, ya hiciste lo más importante que fue contactarnos. No te quedes a un paso de recibir tus *${p.capitalAmount}*.\n\n👉 *Toca aquí, confirma tus datos y en 20 minutos lo dejamos depositado:*\n${url}`,
        (p, url) =>
          `🌟 *TASA PREFERENCIAL CONGELADA SOLO DURANTE EL TURNO DE HOY*\n\nEstimado(a) *${p.clientName}*, he bloqueado las condiciones preferenciales de tu expediente *#${p.radicadoId}* durante los próximos 30 minutos para que conserves la mejor tasa del mes.\n\n🔗 *Confírmala en 1 clic aquí:*\n${url}`,
        (p, url) =>
          `🎯 *HAGAMOS ESTE TRATO, ${p.clientFirstName.toUpperCase()}: COMPLETA EL PASO 1 Y TÚ DECIDES*\n\nEntra ahora a ${url}, revisa cómo queda configurada tu cuenta y tu cuadro de cuotas oficial, y con los números exactos en tu pantalla decides con total libertad.\n\n¿Lo abres ahora mismo? 👇`
      ],
      customAudios: [
        (p) =>
          `¡Hola ${p.clientFirstName}! Te habla ${p.advisorName}. Entiendo perfectamente que quieras pensarlo, pero antes de que cierres el chat te acabo de activar un gancho muy especial en tu expediente ${p.radicadoId}: si completamos tus enlaces en los próximos veinte minutos, además de dejarte los ${p.capitalAmount} depositados hoy mismo en tu cuenta creada, te llevas un Ticket Dorado para nuestro sorteo mensual donde te regalamos la primera cuota completa. Además, recuerda que por ley tienes catorce días de desistimiento. Toca el enlace de aquí abajo y dejémoslo asegurado hoy mismo.`
      ]
    })
  }
];

// =============================================================================
// LIBRETOS DE CONVERSACIONES LARGAS COMPLETAS (DE PRINCIPIO A FIN EN <30 MIN)
// =============================================================================
export const FULL_CONVERSATION_PLAYBOOKS: FullConversationPlaybook[] = [
  {
    id: 'playbook-1-flujo-completo-30min',
    title: 'Libreto Completo 1: Conversación de Principio a Fin con Depósito en Cuenta Creada (<30 Minutos)',
    subtitle: 'Desde que el cliente escribe por el anuncio hasta que llena las 3 URLs y ve su dinero depositado en su Cuenta Digital.',
    badge: 'CONVERSACIÓN ESTÁNDAR 100% ÉXITO',
    clientProfile: 'Cliente que pide información, tiene dudas normales, llena cada cuestionario URL y recibe su depósito.',
    estimatedTime: '18 a 25 minutos en total',
    finalOutcome: 'Cliente firma eIDAS y recibe sus fondos depositados en la cuenta que fue creando para retirar por SEPA/Bizum.',
    pairedImageSrc: '/src/assets/images/ws_recorrido_30_minutos_1791522034719.jpg',
    turns: [
      {
        turnNumber: 1,
        speaker: 'CLIENTE',
        intentTag: 'Primer Contacto del Anuncio',
        messageText: (p) => `Hola, vi vuestro anuncio de préstamos rápidos en España. Necesito ${p.capitalAmount}, ¿cómo funciona y cuánto tarda?`,
        advisorInternalNote: 'El cliente acaba de entrar. Responde en menos de 1 minuto con entusiasmo, presenta el recorrido de 30 minutos y envía la URL 1.'
      },
      {
        turnNumber: 2,
        speaker: 'ASESOR',
        intentTag: 'Saludo + Promesa 30 Min + URL 1 (Solicitud)',
        attachedUrlSlug: 'solicitud',
        messageText: (p) =>
          `👋 *¡Hola, ${p.clientFirstName}! Bienvenido(a) a INSTACREDIT España* 🇪🇸\n\nTe atiende *${p.advisorName}*, tu asesor personal. Ya registré tu solicitud *#${p.radicadoId}* por *${p.capitalAmount}*.\n\n⚡ *¿Cómo funciona en menos de 30 minutos?*\nA medida que vas completando los 3 cuestionarios cortos que te envío por enlace (URL), el sistema va creando y verificando tu *Cuenta Digital* (\`${p.digitalIban}\`). Al terminar el último enlace, tus *${p.capitalAmount}* se depositan directamente en esa cuenta para que los retires a tu banco por SEPA Instant o Bizum.\n\n🔗 *Paso 1: Abre aquí tu Cuestionario Inicial de Solicitud (toma 1 minuto):*\n${p.baseUrl}/?form=solicitud&exp=${p.radicadoId}\n\nAvísame por aquí apenas pulses el botón verde de enviar. 👇`,
        advisorInternalNote: 'Envía siempre el enlace directo del Formulario 1 para que el cliente entre en acción de inmediato.'
      },
      {
        turnNumber: 3,
        speaker: 'CLIENTE',
        intentTag: 'Duda de Seguridad + Confirmación Paso 1',
        messageText: () => `Vale, ya entré y envié el primer cuestionario. Pero tengo una duda: ¿sois una empresa española legal y dónde veo mi contrato?`,
        advisorInternalNote: 'El cliente ya llenó la URL 1 y pide seguridad. Refuerza con el NIF B-87942105, el link de los 5 contratos de 4 páginas y pásalo de inmediato a la URL 2 (IBAN).'
      },
      {
        turnNumber: 4,
        speaker: 'ASESOR',
        intentTag: 'Respaldo Legal 4 Páginas + URL 2 (Cuenta e IBAN)',
        attachedUrlSlug: 'iban',
        messageText: (p) =>
          `✅ *¡Recibido tu Paso 1 al instante, ${p.clientFirstName}!* 👏\n\nMe encanta que me preguntes: somos *INSTACREDIT ESPAÑA FINTECH S.L. (NIF B-87942105)* con más de 12 años en España bajo la *Ley 16/2011*. Aquí puedes ver y descargar tus *5 Contratos Oficiales de 4 páginas cada uno* a tu nombre:\n📄 ${p.baseUrl}/?ver_contratos=${p.radicadoId}\n\n🏦 *Ahora vamos al Paso 2 de 3 (Configurar tu Cuenta e IBAN):*\nEntra a este segundo enlace para indicar tu banco en España y tu número IBAN (\`ES...\`) como titular único. Así queda lista tu cuenta \`${p.digitalIban}\` donde depositaremos tus *${p.capitalAmount}*:\n\n🔗 *Paso 2: Abrir Cuestionario Bancario IBAN y Bizum:*\n${p.baseUrl}/?form=iban&exp=${p.radicadoId}`,
        advisorInternalNote: 'Nunca respondas una duda sin encadenar el siguiente enlace URL del flujo.'
      },
      {
        turnNumber: 5,
        speaker: 'CLIENTE',
        intentTag: 'Confirmación de IBAN Enviado',
        messageText: () => `Perfecto, acabo de poner mi banco y mi número IBAN en el segundo enlace y le di a enviar. ¿Qué sigue ahora?`,
        advisorInternalNote: 'El cliente ya completó el Paso 2. Felicítalo por la aprobación y envíale la URL 3 de Firma Electrónica eIDAS.'
      },
      {
        turnNumber: 6,
        speaker: 'ASESOR',
        intentTag: 'Aprobación + URL 3 (Firma Digital eIDAS)',
        attachedUrlSlug: 'cuota_firma',
        messageText: (p) =>
          `🎉 *¡ENHORABUENA, ${p.clientFirstName.toUpperCase()}! CUENTA VERIFICADA Y PRÉSTAMO APROBADO (#${p.radicadoId})* 🎉\n\nTu cuenta \`${p.digitalIban}\` ya quedó configurada y el comité aprobó tus *${p.capitalAmount}*.\n\n✍️ *Último Paso (Paso 3 de 3 — Firma Electrónica eIDAS):*\nEntra a este enlace final, elige tu día de pago mensual, dibuja tu firma con el dedo en el recuadro de tu móvil y pulsa confirmar para que el sistema deposite de inmediato el dinero en tu cuenta:\n\n🔗 *Paso 3: Firmar Contrato y Liberar Depósito aquí:*\n${p.baseUrl}/?form=cuota_firma&exp=${p.radicadoId}\n\n¡Escríbeme *"FIRMADO"* apenas te salga el sello verde! 🚀`,
        advisorInternalNote: 'Transmite emoción y urgencia positiva para que firme en menos de 2 minutos.'
      },
      {
        turnNumber: 7,
        speaker: 'CLIENTE',
        intentTag: 'Firma Completada',
        messageText: () => `¡Listo! Ya firmé con el dedo en el móvil y me salió el mensaje verde de confirmado. ¿Dónde veo el dinero depositado?`,
        advisorInternalNote: 'Cierre exitoso en menos de 30 minutos. Envíale la URL de su Banca Digital con el depósito acreditado.'
      },
      {
        turnNumber: 8,
        speaker: 'ASESOR',
        intentTag: 'Depósito Acreditado en Cuenta Creada + Retiro SEPA/Bizum',
        attachedUrlSlug: 'banca_digital',
        messageText: (p) =>
          `💸🏦 *¡FONDOS DEPOSITADOS EN TU CUENTA CREADA, ${p.clientFirstName.toUpperCase()}!* 🏦💸\n\nTal como te prometimos en menos de 30 minutos, tus *${p.capitalAmount}* ya están depositados en la Cuenta Digital que fuiste creando al llenar tus enlaces:\n\n• *Titular:* ${p.clientName}\n• *IBAN Cuenta Creada:* \`${p.digitalIban}\`\n• *Saldo Depositado Disponible:* *${p.capitalAmount}*\n\n👉 *Entra aquí a tu Portal de Banca Digital para transferirlos a tu banco por SEPA Instantánea o Bizum:*\n${p.baseUrl}/?banca_digital=${p.radicadoId}\n\n¡Gracias por confiar en *INSTACREDIT España*! Estoy a tu disposición siempre que me necesites. 🤝🇪🇸`,
        advisorInternalNote: 'Registra en la bitácora el cierre exitoso y ofrece ayuda si desea guía dentro de su Banca Digital.'
      }
    ]
  },
  {
    id: 'playbook-2-rescate-anuncio-y-gancho',
    title: 'Libreto Completo 2: Rescate de Cliente que No Respondía al Anuncio + Gancho de Sorteo VIP',
    subtitle: 'Cómo reactivar a un cliente frío que escribió hace días, vencer su indecisión con el Sorteo VIP y llevarlo al depósito en 20 min.',
    badge: 'REACTIVACIÓN + GANCHO VIP',
    clientProfile: 'Cliente que respondió al anuncio hace días, dejó en visto el primer mensaje y tenía dudas sobre su ASNEF/ingresos.',
    estimatedTime: '20 minutos desde que vuelve a contestar',
    finalOutcome: 'Cliente reactivado mediante el Ticket Dorado de Sorteo completa sus enlaces y recibe el depósito en su cuenta.',
    pairedImageSrc: '/src/assets/images/ws_sorteo_gancho_vip_1791522025879.jpg',
    turns: [
      {
        turnNumber: 1,
        speaker: 'ASESOR',
        intentTag: 'Mensaje de Rescate con Gancho de Sorteo VIP',
        attachedUrlSlug: 'solicitud',
        messageText: (p) =>
          `🔔🎁 *¡HOLA ${p.clientFirstName.toUpperCase()}! GUARDAMOS TU CUPO DE ${p.capitalAmount} + TICKET DE SORTEO VIP (#${p.radicadoId})*\n\nTe saluda *${p.advisorName}* de *INSTACREDIT España*. Hace unos días nos contactaste por nuestro anuncio y hoy, antes de liberar tu partida reservada, te he activado un beneficio especial:\n\n🏆 Si completamos tu trámite hoy en *menos de 30 minutos*, recibes tus *${p.capitalAmount}* depositados en tu cuenta creada y participas con un *Ticket Dorado en la Condonación de tu 1ª Cuota Mensual*.\n\n🔗 *Reactiva tu solicitud en 1 minuto tocando aquí:*\n${p.baseUrl}/?form=solicitud&exp=${p.radicadoId}\n\n¿Todavía te viene bien recibir los *${p.capitalAmount}* hoy mismo? 👇`,
        advisorInternalNote: 'Combinamos el recordatorio de cupo reservado con el premio del Sorteo VIP y una pregunta abierta final.'
      },
      {
        turnNumber: 2,
        speaker: 'CLIENTE',
        intentTag: 'Respuesta del Cliente + Miedo a Rechazo',
        messageText: () => `Hola, disculpa que estuve liado en el trabajo. Sí me interesa mucho el dinero hoy, pero no contesté antes porque tengo un pequeño apunte en ASNEF de una compañía telefónica y pensé que no saldría.`,
        advisorInternalNote: 'El cliente reveló el verdadero freno. Desmiente el temor con empatía inmediata y guíalo al enlace 1.'
      },
      {
        turnNumber: 3,
        speaker: 'ASESOR',
        intentTag: 'Solución ASNEF + Impulso a URL 1',
        attachedUrlSlug: 'solicitud',
        messageText: (p) =>
          `🤝 *¡Qué bueno que me lo dices, ${p.clientFirstName}! No te preocupes en absoluto por ese recibo telefónico*\n\nEn *INSTACREDIT España* evaluamos tu capacidad de ingresos actual y los apuntes menores de telefonía o suministros *NO impiden tu aprobación*, porque tu operación incluye el *Fondo Europeo de Garantías (FGA)* sin necesidad de avalista.\n\n⚡ *Vamos a dejarlo listo en 15 minutos:*\nEntra ahora a este primer enlace y confirma tus datos e ingresos:\n👉 ${p.baseUrl}/?form=solicitud&exp=${p.radicadoId}\n\nAsí dejamos activo tu Ticket del Sorteo VIP y empezamos a crear tu cuenta de depósito. ¡Avísame al darle a enviar!`,
        advisorInternalNote: 'Transformamos su objeción en confianza total y le damos una instrucción única.'
      },
      {
        turnNumber: 4,
        speaker: 'CLIENTE',
        intentTag: 'Paso 1 Completado',
        messageText: () => `¡Genial! Qué alivio. Ya acabo de rellenar y enviar ese primer enlace. ¿Ahora cómo se crea la cuenta para el depósito?`,
        advisorInternalNote: 'Cliente motivado. Envía de inmediato la URL 2 (IBAN).'
      },
      {
        turnNumber: 5,
        speaker: 'ASESOR',
        intentTag: 'Envío de URL 2 (Cuenta e IBAN)',
        attachedUrlSlug: 'iban',
        messageText: (p) =>
          `🏦 *¡Excelente, ${p.clientFirstName}! Ya tienes pre-creada tu Cuenta Digital \`${p.digitalIban}\`*\n\nAhora entra a este *Cuestionario URL 2* y pon el nombre de tu banco en España y tu código IBAN (\`ES...\`) para que quede conectada y podamos depositarte los *${p.capitalAmount}*:\n\n🔗 *Abrir Cuestionario 2 de Cuenta e IBAN:*\n${p.baseUrl}/?form=iban&exp=${p.radicadoId}\n\nEn cuanto lo envíes, te paso el enlace final de firma. 🚀`,
        advisorInternalNote: 'Mantén el ritmo ágil para cumplir los 30 minutos.'
      },
      {
        turnNumber: 6,
        speaker: 'CLIENTE',
        intentTag: 'IBAN Validado',
        messageText: () => `Hecho, ya puse mi IBAN y lo envié.`,
        advisorInternalNote: 'Envía la URL 3 de Firma Electrónica eIDAS.'
      },
      {
        turnNumber: 7,
        speaker: 'ASESOR',
        intentTag: 'Envío de URL 3 (Firma Final eIDAS) + Contratos 4 Páginas',
        attachedUrlSlug: 'cuota_firma',
        messageText: (p) =>
          `✍️🎉 *¡APROBADO OFICIALMENTE, ${p.clientFirstName.toUpperCase()}! ÚLTIMO ENLACE PARA DEPOSITARTE*\n\nEntra aquí, dibuja tu firma con el dedo en la pantalla de tu móvil y pulsa confirmar:\n👉 ${p.baseUrl}/?form=cuota_firma&exp=${p.radicadoId}\n\n📄 *(Aquí tienes también tus 5 contratos legales de 4 páginas: ${p.baseUrl}/?ver_contratos=${p.radicadoId}).*\n\nApenas firmes, tus *${p.capitalAmount}* se depositan en tu cuenta creada y queda sellado tu Ticket Dorado del Sorteo. 🏆`,
        advisorInternalNote: 'Cierre inminente.'
      },
      {
        turnNumber: 8,
        speaker: 'CLIENTE',
        intentTag: 'Contrato Firmado',
        messageText: () => `¡Firmado! Ya me salió la confirmación. Mil gracias por ayudarme tan rápido.`,
        advisorInternalNote: 'Entrega el enlace del Portal de Banca Digital con los fondos depositados.'
      },
      {
        turnNumber: 9,
        speaker: 'ASESOR',
        intentTag: 'Confirmación de Depósito en Cuenta + Ticket Sorteo Activo',
        attachedUrlSlug: 'banca_digital',
        messageText: (p) =>
          `💸🏆 *¡DINERO DEPOSITADO EN TU CUENTA + TICKET SORTEO #VIP-${p.radicadoId.slice(-4)} ACTIVO!*\n\nFelicidades *${p.clientFirstName}*, ya tienes tus *${p.capitalAmount}* depositados en tu Cuenta Digital (\`${p.digitalIban}\`).\n\n🏦 *Accede aquí a tu Banca Digital para retirarlos por SEPA Instant o Bizum:*\n${p.baseUrl}/?banca_digital=${p.radicadoId}\n\n¡Que los disfrutes mucho! 🇪🇸✨`,
        advisorInternalNote: 'Expediente completado en menos de 30 minutos.'
      }
    ]
  }
];

// =============================================================================
// PANEL DE SORTEOS VIP, GANCHOS Y ACTIVIDADES PERSONALIZABLES POR EL ASESOR
// =============================================================================
export const RAFFLE_HOOK_CAMPAIGNS: RaffleHookCampaign[] = [
  {
    id: 'sorteo-1-primera-cuota-gratis',
    code: 'GANCHO-SORTEO-01',
    title: 'Sorteo Estrella: Condonación del 100% de la Primera Cuota Mensual + Bono 500 €',
    badge: '🔥 Mayor Conversión (Recomendado)',
    defaultPrize: 'Condonación 100% de tu 1ª Cuota + Bono de 500 € en efectivo',
    defaultDeadlineMinutes: 25,
    hookObjective: 'Convencer al cliente indeciso o que no responde para que termine sus cuestionarios URL en los próximos 25 minutos.',
    activityForClient: 'Completar el cuestionario URL pendiente y responder con la palabra "PARTICIPO" en el chat.',
    pairedImageSrc: '/src/assets/images/ws_sorteo_gancho_vip_1791522025879.jpg',
    urlSlug: 'solicitud',
    buildWhatsAppHook: (p, customPrize, ticketCode, deadlineMinutes) =>
      `🎁🏆 *¡FELICIDADES, ${p.clientFirstName.toUpperCase()}! TICKET DORADO ASIGNADO A TU EXPEDIENTE #${p.radicadoId}* 🏆🎁\n\n` +
      `Hola *${p.clientFirstName}*, te saluda tu asesor *${p.advisorName}* de *INSTACREDIT España*. 🇪🇸\n\n` +
      `He activado manualmente en tu perfil una invitación preferente para nuestro *Sorteo y Beneficio de Clientes Digitales*:\n\n` +
      `🎟️ *Nº de Ticket Oficial:* \`${ticketCode}\`\n` +
      `🎁 *Premio / Beneficio Activo:* *${customPrize}*\n` +
      `💶 *Préstamo Listo para Depósito:* *${p.capitalAmount}* en tu cuenta \`${p.digitalIban}\`\n` +
      `⏱️ *Tiempo para Activarlo:* Próximos *${deadlineMinutes} minutos*\n\n` +
      `✅ *¿Qué actividad sencilla debes hacer para asegurar tu premio y recibir tu depósito hoy?*\n` +
      `1️⃣ Entra ahora a tu enlace oficial y completa tu cuestionario pendiente:\n` +
      `👉 ${p.baseUrl}/?form=solicitud&exp=${p.radicadoId}\n` +
      `2️⃣ Respóndeme a este mensaje con la palabra *"PARTICIPO"*.\n\n` +
      `¡Estoy en línea para acreditarte el depósito y sellar tu ticket de inmediato! 🚀`,
    buildVoiceHook: (p, customPrize, ticketCode, deadlineMinutes) =>
      `¡Hola ${p.clientFirstName}! Te habla ${p.advisorName} de Instacredit España con una gran sorpresa para ti. Acabo de asignarte manualmente el ticket número ${ticketCode} para que, además de recibir hoy mismo el depósito de tus ${p.capitalAmount} en tu cuenta creada, participes por ${customPrize}. Para dejarlo activado solo tienes que completar el enlace que te puse aquí abajo en los próximos ${deadlineMinutes} minutos y escribirme la palabra PARTICIPO.`
  },
  {
    id: 'sorteo-2-bono-puntualidad-rebaja-tasa',
    code: 'GANCHO-SORTEO-02',
    title: 'Gancho Financiero: 15% de Descuento Directo en Intereses + Duplicación de Cupo a 6.000 €',
    badge: '💶 Ahorro Directo en Cuota',
    defaultPrize: '15% de Descuento en Intereses + Cupo Preaprobado de 6.000 €',
    defaultDeadlineMinutes: 30,
    hookObjective: 'Atraer a clientes analíticos que comparan intereses o que pidieron un monto menor y quieren más liquidez.',
    activityForClient: 'Confirmar su cuenta bancaria IBAN en el enlace URL 2 dentro de los próximos 30 minutos.',
    pairedImageSrc: '/src/assets/images/ws_sorteo_gancho_vip_1791522025879.jpg',
    urlSlug: 'iban',
    buildWhatsAppHook: (p, customPrize, ticketCode, deadlineMinutes) =>
      `💎💶 *BENEFICIO PREFERENTE DESBLOQUEADO PARA ${p.clientFirstName.toUpperCase()} (#${p.radicadoId})* 💶💎\n\n` +
      `Estimado(a) *${p.clientFirstName}*, te escribe *${p.advisorName}* de *INSTACREDIT España*.\n\n` +
      `Para ayudarte a tomar la mejor decisión hoy mismo, nuestro comité ha autorizado un beneficio especial vinculado a tu solicitud de *${p.capitalAmount}*:\n\n` +
      `🏷️ *Código de Beneficio:* \`${ticketCode}\`\n` +
      `🌟 *Ventaja Concedida:* *${customPrize}*\n` +
      `🏦 *Cuenta de Depósito Asignada:* \`${p.digitalIban}\`\n\n` +
      `📌 *Actividad rápida (en menos de ${deadlineMinutes} min):*\n` +
      `Valida tu titularidad bancaria IBAN en este enlace directo para dejar bloqueado el descuento y depositar tus fondos:\n` +
      `👉 ${p.baseUrl}/?form=iban&exp=${p.radicadoId}\n\n` +
      `Confírmame con un *"ACTIVAR BONO"* apenas envíes el formulario. 🤝`,
    buildVoiceHook: (p, customPrize, ticketCode, deadlineMinutes) =>
      `Hola ${p.clientFirstName}, te habla ${p.advisorName}. Quiero comentarte que he conseguido autorizar para tu expediente ${p.radicadoId} el código ${ticketCode} que te otorga ${customPrize}. Para que quede aplicado en tu contrato y te depositemos tus ${p.capitalAmount} en tu cuenta creada, solo debes completar el enlace bancario de aquí abajo en los próximos ${deadlineMinutes} minutos.`
  },
  {
    id: 'sorteo-3-premio-firma-expres-bizum',
    code: 'GANCHO-SORTEO-03',
    title: 'Gancho de Cierre Exprés: Sorteo Tarjeta Regalo El Corte Inglés / Amazon 300 € + Abono Prioritario',
    badge: '⚡ Especial Cierre de Firma',
    defaultPrize: 'Tarjeta Regalo de 300 € + Abono SEPA/Bizum Prioritario en 10 Minutos',
    defaultDeadlineMinutes: 15,
    hookObjective: 'Motivar a clientes que ya están aprobados pero no han firmado el enlace 3 (`?form=cuota_firma`).',
    activityForClient: 'Estampar su firma digital con el dedo en el Cuestionario URL 3 en los próximos 15 minutos.',
    pairedImageSrc: '/src/assets/images/ws_sorteo_gancho_vip_1791522025879.jpg',
    urlSlug: 'cuota_firma',
    buildWhatsAppHook: (p, customPrize, ticketCode, deadlineMinutes) =>
      `⚡🎁 *CIERRE EXPRÉS CON PREMIO PARA TU PRÉSTAMO APROBADO DE ${p.capitalAmount}* 🎁⚡\n\n` +
      `¡Hola, *${p.clientFirstName}*! Soy *${p.advisorName}* de *INSTACREDIT España*.\n\n` +
      `Tus *${p.capitalAmount}* ya están listos para entrar en tu Cuenta Digital (\`${p.digitalIban}\`). Además, si realizas tu firma digital en los próximos *${deadlineMinutes} minutos*, entras directo con el ticket \`${ticketCode}\` por:\n` +
      `🏆 *${customPrize}*\n\n` +
      `✍️ *Firma ahora con el dedo desde tu móvil en este enlace:*\n` +
      `👉 ${p.baseUrl}/?form=cuota_firma&exp=${p.radicadoId}\n\n` +
      `¡Avísame apenas firmes para enviarte tu comprobante de depósito y tu ticket! 🚀`,
    buildVoiceHook: (p, customPrize, ticketCode, deadlineMinutes) =>
      `¡Hola ${p.clientFirstName}! Te saluda ${p.advisorName}. Como tu préstamo de ${p.capitalAmount} ya está aprobado, si firmas en el enlace de aquí abajo durante los próximos ${deadlineMinutes} minutos, además de recibir el depósito inmediato en tu cuenta creada, te activamos el ticket ${ticketCode} para ${customPrize}. ¡Entra ahora mismo y lo dejamos listo!`
  }
];
