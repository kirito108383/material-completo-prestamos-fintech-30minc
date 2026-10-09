/**
 * Real-Time Web Audio & Speech WAV Synthesizer for INSTACREDIT España
 * Generates downloadable, realistic voice & institutional notification WAV audio files
 * and speaks advisor voice notes for WhatsApp clients.
 * Focused 100% on 30-minute SLA, step-by-step URL questionnaires, and instant deposit into the client's Digital Account.
 */

export interface ClientVoiceNoteTemplate {
  id: string;
  category:
    | 'bienvenida'
    | 'recordatorio_no_responde'
    | 'verificacion_url'
    | 'solidez_confianza'
    | 'aprobacion_firma'
    | 'desembolso_bizum'
    | 'sorteo_gancho'
    | 'prorroga_alivio';
  categoryLabel: string;
  badge: string;
  badgeColor: string;
  durationEstimate: string;
  title: string;
  whenToUse: string;
  advisorTip: string;
  pairedFormSlug?: string;
  getSpokenScript: (params: {
    clientFirstName: string;
    clientName: string;
    advisorName: string;
    capitalAmount: string;
    radicadoId: string;
    digitalIban: string;
    dueDate: string;
    directFormUrl: string;
  }) => string;
  getCompanionWhatsAppText: (params: {
    clientFirstName: string;
    clientName: string;
    advisorName: string;
    capitalAmount: string;
    radicadoId: string;
    digitalIban: string;
    dueDate: string;
    directFormUrl: string;
  }) => string;
}

export const CLIENT_VOICE_NOTE_TEMPLATES: ClientVoiceNoteTemplate[] = [
  {
    id: 'audio-bienvenida-30min',
    category: 'bienvenida',
    categoryLabel: '1. Bienvenida y Compromiso 30 Minutos',
    badge: 'Audio de Bienvenida (32 seg)',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    durationEstimate: '0:32 seg',
    title: 'Nota de Voz 1: Bienvenida Personal y Ruta de Depósito en 30 Minutos',
    whenToUse: 'Enviar apenas el cliente escribe por WhatsApp o radica su solicitud web para generar confianza humana inmediata.',
    advisorTip: 'Habla con sonrisa telefónica, ritmo pausado y menciona el nombre de pila del cliente en los primeros 3 segundos.',
    pairedFormSlug: 'solicitud',
    getSpokenScript: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `¡Hola, ${clientFirstName}! Qué tal, muy buen día. Te saluda ${advisorName}, tu gestor personal asignado aquí en Instacredit España. Te envío esta nota de voz rapidito para confirmarte que ya tengo en mi pantalla tu expediente número ${radicadoId} por un importe de ${capitalAmount}. Nuestro compromiso oficial es completar todo el recorrido en menos de 30 minutos para que tengas el dinero depositado directamente en tu cuenta creada a medida que completas tus cuestionarios URL. Te acabo de dejar aquí abajo en el chat el primer enlace directo para verificar tus datos en dos minutos. Cualquier duda que tengas, respóndeme por aquí mismo que estoy conectado para ayudarte.`,
    getCompanionWhatsAppText: ({ clientFirstName, advisorName, capitalAmount, radicadoId, directFormUrl }) =>
      `🔊 *Nota de voz de tu asesor (${advisorName})*\n\n¡Hola, *${clientFirstName}*! 👋 Acabo de enviarte un audio explicándote el recorrido de tu solicitud *#${radicadoId}* por *${capitalAmount}* para dejarla lista en menos de 30 minutos.\n\n👉 *Enlace directo a tu Cuestionario 1 de Solicitud y Verificación:*\n${directFormUrl}\n\nQuedo atento a tu confirmación por aquí. 🇪🇸⚡`
  },
  {
    id: 'audio-recordatorio-no-responde-1',
    category: 'recordatorio_no_responde',
    categoryLabel: '2. Cliente No Responde (Seguimiento 2h)',
    badge: 'Seguimiento 2 Horas (28 seg)',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    durationEstimate: '0:28 seg',
    title: 'Nota de Voz 2: Seguimiento Cordial (Cliente No Responde tras Primer Mensaje)',
    whenToUse: 'Cuando el cliente pidió información o respondió al anuncio pero dejó el primer mensaje en visto.',
    advisorTip: 'Nunca reclames por no contestar. Transmite que le guardaste su cupo reservado para que reciba su depósito hoy mismo.',
    pairedFormSlug: 'solicitud',
    getSpokenScript: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `Hola de nuevo, ${clientFirstName}, te habla ${advisorName} de Instacredit España. Te dejo este audio corto porque sé que a veces con el trabajo o el día a día nos ocupamos. Solamente quería avisarte que sigo manteniendo reservado tu cupo preaprobado de ${capitalAmount} bajo el expediente ${radicadoId}. Solo nos falta que completes el cuestionario rápido en el enlace seguro que te adjunto aquí debajo para activar tu cuenta digital y pasar tu solicitud a depósito hoy mismo. En cuanto tengas dos minutitos, avísame por aquí.`,
    getCompanionWhatsAppText: ({ clientFirstName, capitalAmount, radicadoId, directFormUrl }) =>
      `🔔 *RECORDATORIO DE CUPO RESERVADO (#${radicadoId})*\n\nHola, *${clientFirstName}*. Te dejé una breve nota de voz 🔊. Mantenemos tu reserva activa por *${capitalAmount}* lista para depositar en tu cuenta.\n\n✅ *Completa tu cuestionario rápido en 1 clic aquí:*\n${directFormUrl}\n\n¿Te ayudo a completarlo paso a paso o prefieres hacerlo desde el enlace? 👇`
  },
  {
    id: 'audio-recordatorio-no-responde-24h',
    category: 'recordatorio_no_responde',
    categoryLabel: '2. Cliente No Responde (Reactivación Días Después)',
    badge: 'Reactivación Anuncio / 24h (35 seg)',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    durationEstimate: '0:35 seg',
    title: 'Nota de Voz 3: Reactivación de Cliente que Respondió al Anuncio hace Días',
    whenToUse: 'Cuando el cliente escribió por el anuncio hace días o dejó el proceso a medias y queremos reactivarlo con prioridad.',
    advisorTip: 'Hazle sentir especial: explicale que su perfil sigue preaprobado en bandeja preferente y que en 15 minutos terminamos.',
    pairedFormSlug: 'iban',
    getSpokenScript: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `Muy buenas, ${clientFirstName}, te saluda nuevamente ${advisorName} desde la mesa de formalización de Instacredit España. Me comunico contigo porque vimos tu interés en nuestro anuncio por los ${capitalAmount} bajo el expediente ${radicadoId}, y no quería que perdieras tu cupo asignado. Te he reactivado un enlace prioritario para que en menos de quince minutos dejemos tu cuenta configurada y lista para el depósito de tus fondos. Entra ahora mismo al link que te pongo abajo o dime un "Sí" por aquí para acompañarte en vivo.`,
    getCompanionWhatsAppText: ({ clientFirstName, capitalAmount, radicadoId, directFormUrl }) =>
      `⏳ *REACTIVACIÓN PRIORITARIA DE TU EXPEDIENTE #${radicadoId} (${capitalAmount})*\n\nEstimado(a) *${clientFirstName}*, escucha por favor el audio adjunto 🔊.\n\nHemos mantenido activo tu cupo de *${capitalAmount}*. Confirma tu cuenta bancaria en menos de 2 minutos aquí para programar tu depósito:\n👉 ${directFormUrl}\n\nResponde *"LISTO"* y lo terminamos en 15 minutos. 🚀`
  },
  {
    id: 'audio-verificacion-iban-sepblac',
    category: 'verificacion_url',
    categoryLabel: '3. Cuestionario URL de Cuenta e IBAN',
    badge: 'Guía Cuestionario URL (34 seg)',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    durationEstimate: '0:34 seg',
    title: 'Nota de Voz 4: Explicación Didáctica de Creación de Cuenta y Validación IBAN por URL',
    whenToUse: 'Enviar junto con la URL directa cuando el cliente quiere saber cómo se crea su cuenta y dónde se le deposita el dinero.',
    advisorTip: 'Explícale con claridad que cada cuestionario URL que llena va configurando su cuenta donde se le deposita el monto solicitado.',
    pairedFormSlug: 'iban',
    getSpokenScript: ({ clientFirstName, advisorName, capitalAmount }) =>
      `${clientFirstName}, te habla ${advisorName}. Te explico lo sencillo que funciona nuestra plataforma: a medida que vas completando cada enlace de cuestionario que te envío, el sistema va creando y verificando tu cuenta digital asignada para depositarte directamente tus ${capitalAmount}. Al tocar el enlace azul de aquí abajo, solo debes indicar tu banco habitual en España y tu código IBAN que empieza por E-S como titular único. Además, arriba tienes un botón de altavoz que te lee cada paso en voz alta.`,
    getCompanionWhatsAppText: ({ clientFirstName, capitalAmount, directFormUrl }) =>
      `🏦 *CUESTIONARIO URL 2: VINCULACIÓN DE CUENTA PARA DEPÓSITO DE ${capitalAmount}*\n\nHola *${clientFirstName}*, como te explico en el audio 🔊, al completar este enlace oficial queda configurada tu cuenta para recibir el abono por SEPA Instant o Bizum:\n\n🔗 *Abrir Cuestionario Oficial con Ayuda de Voz:*\n${directFormUrl}\n\n🔒 *Proceso 100% guiado bajo normativa española.*`
  },
  {
    id: 'audio-solidez-trayectoria-12anos',
    category: 'solidez_confianza',
    categoryLabel: '4. Solidez, 12 Años en España y Respaldo Legal',
    badge: 'Respaldo y Confianza (36 seg)',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    durationEstimate: '0:36 seg',
    title: 'Nota de Voz 5: Respaldo Institucional (12 Años en España, Ley 16/2011 y Contratos de 4 Páginas)',
    whenToUse: 'Cuando el cliente siente duda, intriga o desconfianza y quiere asegurarse de la seriedad de la empresa.',
    advisorTip: 'Transmite orgullo institucional: menciona nuestros 12 años en España, el NIF B-87942105 y los 5 contratos oficiales de 4 páginas.',
    pairedFormSlug: 'solicitud',
    getSpokenScript: ({ clientFirstName, advisorName, capitalAmount }) =>
      `Hola ${clientFirstName}, te habla ${advisorName}. Me encanta que seas una persona cuidadosa y quieras tener todo súper claro. En Instacredit España llevamos más de doce años de trayectoria ayudando a más de ciento cincuenta mil familias y autónomos bajo la Ley dieciséis barra dos mil once de contratos de crédito al consumo. Desde el primer momento tienes acceso a tus cinco documentos contractuales completos de cuatro páginas cada uno, y una vez completados los pasos en menos de treinta minutos, tus ${capitalAmount} quedan depositados en tu cuenta asignada.`,
    getCompanionWhatsAppText: ({ clientFirstName, capitalAmount, directFormUrl }) =>
      `🏛️ *RESPALDO INSTITUCIONAL INSTACREDIT ESPAÑA (NIF B-87942105)*\n\n*${clientFirstName}*, escucha mi nota de voz 🔊. Contamos con:\n• *+12 años de experiencia* y más de 150.000 operaciones en España.\n• *Contratos Homologados (Ley 16/2011):* 5 documentos oficiales de 4 páginas con sello eIDAS.\n• *Depósito Garantizado:* Una vez completado el proceso en menos de 30 min, recibes tus *${capitalAmount}* en tu cuenta.\n\n👉 *Revisa tu Simulación y Ficha Europea INE aquí:*\n${directFormUrl}`
  },
  {
    id: 'audio-aprobacion-firma-eidas',
    category: 'aprobacion_firma',
    categoryLabel: '5. Aprobación y Firma Digital eIDAS',
    badge: '¡Crédito Aprobado! (30 seg)',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    durationEstimate: '0:30 seg',
    title: 'Nota de Voz 6: Felicitación por Aprobación e Instrucción de Firma OTP eIDAS',
    whenToUse: 'Apenas el expediente pasa a estado APROBADO y necesitamos que el cliente firme el contrato en el cuestionario URL 3.',
    advisorTip: 'Transmite entusiasmo genuino y urgencia positiva: al firmar con el dedo en el móvil, el dinero se deposita en su Cuenta Digital.',
    pairedFormSlug: 'cuota_firma',
    getSpokenScript: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `¡Excelentes noticias, ${clientFirstName}! Te saluda ${advisorName} de Instacredit España. ¡Enhorabuena! El comité acaba de aprobar oficialmente tu préstamo por ${capitalAmount} bajo el expediente ${radicadoId}. Ya estamos en el último paso antes del depósito. Te acabo de poner aquí debajo el enlace directo al Cuestionario de Firma Electrónica eIDAS. Solo tienes que entrar, dibujar tu firma en el recuadro con el dedo desde el móvil y confirmar el código de seguridad para que depositemos tus fondos de inmediato en la cuenta que creaste.`,
    getCompanionWhatsAppText: ({ clientFirstName, capitalAmount, radicadoId, directFormUrl }) =>
      `🎉 *¡ENHORABUENA, ${clientFirstName.toUpperCase()}! PRÉSTAMO APROBADO (#${radicadoId})* 🎉\n\nEscucha el audio que te acabo de enviar 🔊. Tus *${capitalAmount}* están listos para ser depositados en tu cuenta.\n\n✍️ *ÚLTIMO PASO: Firma aquí tu Contrato y Pagaré Digital eIDAS en 1 minuto:*\n${directFormUrl}\n\nAvísame apenas te salga el sello verde de firmado para acreditar tu saldo. 🚀`
  },
  {
    id: 'audio-desembolso-bizum-sepa',
    category: 'desembolso_bizum',
    categoryLabel: '6. Depósito Acreditado en Cuenta y Retiro Bizum / SEPA',
    badge: 'Fondos Depositados (29 seg)',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    durationEstimate: '0:29 seg',
    title: 'Nota de Voz 7: Confirmación de Dinero Depositado en la Cuenta Creada y Retiro Bizum',
    whenToUse: 'Cuando el crédito está DESEMBOLSADO y el cliente ya tiene su dinero en la cuenta creada durante los cuestionarios.',
    advisorTip: 'Explícale que su Cuenta Digital IBAN ya tiene el saldo depositado y puede transferirlo gratis por SEPA Instant o Bizum.',
    pairedFormSlug: 'banca_digital',
    getSpokenScript: ({ clientFirstName, advisorName, capitalAmount, digitalIban }) =>
      `¡Hola ${clientFirstName}! Te habla ${advisorName}. Te confirmo que una vez completados todos tus cuestionarios, tus fondos por importe de ${capitalAmount} ya han sido depositados con éxito en la Cuenta Digital Instacredit que creaste, con IBAN terminado en ${digitalIban.slice(-4)}. Desde el enlace directo que te dejo aquí abajo puedes entrar a tu Portal de Banca Digital y mover el dinero en diez segundos a tu banco habitual mediante transferencia SEPA instantánea o por Bizum. ¡Disfrútalo mucho!`,
    getCompanionWhatsAppText: ({ clientFirstName, capitalAmount, digitalIban, directFormUrl }) =>
      `💸 *DINERO DEPOSITADO EN TU CUENTA CREADA (${capitalAmount})*\n\nHola *${clientFirstName}*, escucha las instrucciones en el audio 🔊.\n• *IBAN de tu Cuenta Creada:* \`${digitalIban}\`\n• *Saldo Depositado Disponible:* *${capitalAmount}*\n\n🏦 *Accede aquí a tu Portal de Banca Digital para retirar a tu banco o por Bizum:*\n${directFormUrl}`
  },
  {
    id: 'audio-sorteo-gancho-vip',
    category: 'sorteo_gancho',
    categoryLabel: '7. Sorteo VIP y Gancho de Cierre en 30 Minutos',
    badge: 'Gancho Sorteo VIP (31 seg)',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-400',
    durationEstimate: '0:31 seg',
    title: 'Nota de Voz 8: Invitación a Sorteo Preferente y Beneficio por Finalizar Hoy',
    whenToUse: 'Cuando el asesor quiere motivar, enganchar o recuperar a un cliente indeciso ofreciéndole un ticket de sorteo o bono de cuota.',
    advisorTip: 'Habla con energía entusiasta: el cliente siente que gana un premio exclusivo adicional por terminar su trámite en los próximos 15 minutos.',
    pairedFormSlug: 'solicitud',
    getSpokenScript: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `¡Hola ${clientFirstName}! Te saluda ${advisorName} de Instacredit España con una excelente noticia para ti. Por haber registrado tu expediente ${radicadoId} por ${capitalAmount}, el sistema te ha asignado un Ticket Dorado en nuestro Sorteo Mensual de Clientes Preferentes, donde premiamos tu puntualidad con la condonación de tu primera cuota mensual y bonos de hasta quinientos euros. Para dejar activado tu ticket del sorteo y recibir el depósito de tu préstamo en tu cuenta hoy mismo, solo debes completar el enlace que te dejo aquí debajo en los próximos quince minutos.`,
    getCompanionWhatsAppText: ({ clientFirstName, capitalAmount, radicadoId, directFormUrl }) =>
      `🎁🏆 *¡FELICIDADES, ${clientFirstName.toUpperCase()}! TIENES UN TICKET DE SORTEO VIP ACTIVO (#${radicadoId})* 🏆🎁\n\nEscucha mi nota de voz 🔊. Al finalizar hoy tu solicitud de *${capitalAmount}*, participas automáticamente en el *Sorteo de Condonación de Primera Cuota + Bono de 500 €*.\n\n👉 *Activa tu beneficio y completa tu verificación aquí:*\n${directFormUrl}`
  },
  {
    id: 'audio-prorroga-alivio-financiero',
    category: 'prorroga_alivio',
    categoryLabel: '8. Prórrogas, Encuesta y Alivio de Pago',
    badge: 'Alivio sin ASNEF (33 seg)',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    durationEstimate: '0:33 seg',
    title: 'Nota de Voz 9: Ofrecimiento Empático de Prórroga de 15 o 30 Días sin Penalización',
    whenToUse: 'Cuando se acerca la fecha de vencimiento o el cliente pregunta qué pasa si algún mes se retrasa en su cuota.',
    advisorTip: 'Posiciónate como su aliado que le ayuda a proteger su historial limpio en ASNEF y subir su cupo.',
    pairedFormSlug: 'prorroga',
    getSpokenScript: ({ clientFirstName, advisorName, dueDate }) =>
      `Hola ${clientFirstName}, te saluda ${advisorName} de Instacredit España. Te mando este audio con total confianza porque vemos que tu fecha de vencimiento es el ${dueDate}. Si este mes te ha surgido cualquier imprevisto en casa o se te ha retrasado la nómina, no te preocupes en absoluto. Antes de que te genere cualquier recargo o reporte en ASNEF, te he habilitado aquí abajo el enlace directo para solicitar una prórroga oficial de quince o treinta días adicionales sin multas. Entra al link y lo dejamos resuelto en un minuto.`,
    getCompanionWhatsAppText: ({ clientFirstName, dueDate, directFormUrl }) =>
      `🤝 *SOLUCIÓN DE FLEXIBILIDAD Y PRÓRROGA OFICIAL (Vencimiento: ${dueDate})*\n\nEstimado(a) *${clientFirstName}*, escucha mi mensaje de voz 🔊. En *INSTACREDIT España* cuidamos tu tranquilidad y tu historial crediticio.\n\n⏱️ *Solicita aquí tu Prórroga de 15, 30 o 45 días sin penalizaciones ni reportes ASNEF:*\n${directFormUrl}`
  }
];

/**
 * Generates a real downloadable WAV audio file containing an institutional
 * Spanish fintech notification chime + modulated voice cadence envelope so the
 * advisor can attach a physical audio file or play the spoken script immediately.
 */
export function generateInstitutionalWavBlob(durationSeconds = 4): Blob {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF identifier
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Create a pleasant corporate 3-note chime (C5 -> E5 -> G5 -> C6) followed by warm confirmation harmonic
  const notes = [523.25, 659.25, 783.99, 1046.5];
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    if (t < 0.8) {
      const noteIdx = Math.min(3, Math.floor(t / 0.2));
      const localT = t - noteIdx * 0.2;
      const freq = notes[noteIdx];
      const env = Math.exp(-localT * 8);
      sample = 0.45 * env * (Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * freq * 2 * t));
    } else {
      const chordT = t - 0.8;
      const env = Math.exp(-chordT * 1.4);
      sample =
        0.25 *
        env *
        (Math.sin(2 * Math.PI * 523.25 * t) +
          Math.sin(2 * Math.PI * 659.25 * t) +
          Math.sin(2 * Math.PI * 783.99 * t));
    }

    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, clamped * 32767, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
