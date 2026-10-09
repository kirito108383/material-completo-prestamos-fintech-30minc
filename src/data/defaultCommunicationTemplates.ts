import { CommunicationTemplate } from '../types/communicationTemplates';

export const DEFAULT_COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  // =========================================================================
  // PLANTILLAS DE CORREO ELECTRÓNICO (HTML CON IMAGEN INTEGRADA EN CABECERA)
  // =========================================================================
  {
    id: 'email-bienvenida-formal',
    name: 'Email: Bienvenida Formal y Asignación de Asesor Personal',
    channel: 'email',
    loanStatusTrigger: 'Pendiente',
    subject: 'Bienvenido(a) a INSTACREDIT España • Expediente #{EXPEDIENTE_ID} Asignado',
    content: `Estimado(a) {NOMBRE_CLIENTE},

Le damos la más cordial bienvenida a INSTACREDIT España. Mi nombre es {NOMBRE_ASESOR} y he sido asignado personalmente como su asesor financiero para acompañarle a lo largo de toda su operación.

Le confirmamos que su solicitud de micropréstamo online por importe de {MONTO_EUR} ha ingresado a nuestra mesa de análisis preferente bajo el expediente número #{EXPEDIENTE_ID}.

🏛️ Respaldo y Trayectoria que le Garantizan Tranquilidad:
• Más de 12 años facilitando crédito al consumo regulado en España.
• Supervisión y cumplimiento estricto de las directrices del Banco de España y la Ley 16/2011.
• Custodia digital cualificada bajo el reglamento europeo eIDAS (UE 910/2014).

⏱️ Compromiso de Calidad en el Servicio:
Nuestro equipo se compromete a emitir su resolución formal en un tiempo máximo de 30 minutos.

Para revisar los detalles precontractuales o consultar su Cuenta Digital IBAN ({IBAN_DIGITAL}), pulse en el botón inferior.`,
    callToActionLabel: 'Acceder a Mi Expediente en 1 Clic',
    callToActionUrl: '{ENLACE_PORTAL}',
    autoAttachStatusImage: true,
    description: 'Correo inicial enviado al registrarse. Incluye la tarjeta de bienvenida con sello de asesor personal en cabecera.',
    badge: 'Onboarding Email',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'email-docs-solicitud',
    name: 'Email: Requerimiento Oficial de Documentación (DNI/NIE, Nómina, IBAN)',
    channel: 'email',
    loanStatusTrigger: 'Pendiente',
    subject: 'Documentación requerida para su crédito de {MONTO_EUR} • Expediente #{EXPEDIENTE_ID}',
    content: `Estimado(a) {NOMBRE_CLIENTE},

Para proceder a la concesión definitiva de su préstamo por importe de {MONTO_EUR}, nuestro departamento de riesgos requiere cotejar los siguientes 3 justificantes básicos:

1️⃣ Documento de Identidad Oficial (en vigor):
   • DNI (ciudadanos españoles) o NIE / Tarjeta TIE con autorización de residencia en vigor (ciudadanos extranjeros). Foto nítida por ambas caras.

2️⃣ Acreditación de Ingresos Regulares:
   • Última nómina mensual (asalariados), certificado de pensión (jubilados) o Modelo 130/100 de IRPF (autónomos).

3️⃣ Justificante de Titularidad Bancaria:
   • Certificado o extracto de su banco ({BANCO_CLIENTE}) donde conste su nombre y el IBAN español de recepción.

Una vez recibidos sus soportes, nuestro motor emitirá su resolución en menos de 30 minutos.`,
    callToActionLabel: 'Subir Documentos de Forma Segura',
    callToActionUrl: '{ENLACE_PORTAL}/?form=asistido&expediente={EXPEDIENTE_ID}',
    autoAttachStatusImage: true,
    description: 'Solicita los justificantes de identidad e ingresos incorporando la infografía didáctica de documentos como cabecera.',
    badge: 'Solicitud Docs',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'email-estudio-garantia',
    name: 'Email: Expediente en Estudio Prioritario - Garantía 30 Minutos',
    channel: 'email',
    loanStatusTrigger: 'En Revisión',
    subject: 'Su expediente #{EXPEDIENTE_ID} está en estudio • Respuesta en máximo 30 min',
    content: `Estimado(a) {NOMBRE_CLIENTE},

Le informamos que su expediente #{EXPEDIENTE_ID} por importe de {MONTO_EUR} se encuentra actualmente en fase de revisión prioritaria por nuestros analistas senior.

Le recordamos nuestro compromiso institucional de respuesta en un máximo de 30 minutos desde la recepción completa de sus datos.

Toda la operativa se gestiona conforme al Reglamento General de Protección de Datos (RGPD UE 2016/679) con encriptación SSL de grado bancario.

En breves minutos recibirá la confirmación definitiva para la firma digital de su pagaré.`,
    callToActionLabel: 'Consultar Estado en Vivo',
    callToActionUrl: '{ENLACE_PORTAL}/?tiquete={EXPEDIENTE_ID}',
    autoAttachStatusImage: true,
    description: 'Informa al usuario de que su préstamo se encuentra en estudio con garantía SLA de 30 min y la infografía de trayectoria.',
    badge: 'En Estudio',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'email-aprobado-eidas',
    name: 'Email: ¡Crédito Aprobado! Formalización y Firma eIDAS',
    channel: 'email',
    loanStatusTrigger: 'Aprobado',
    subject: '¡ENHORABUENA {PRIMER_NOMBRE}! Crédito de {MONTO_EUR} APROBADO satisfactoriamente',
    content: `¡Enhorabuena, {NOMBRE_CLIENTE}!

Nos complace comunicarle formalmente que su solicitud de financiación por {MONTO_EUR} (Expediente #{EXPEDIENTE_ID}) ha sido APROBADA SATISFACTORIAMENTE por el comité de crédito.

Su Expediente Contractual Oficial de 4 páginas ya se encuentra emitido y custodiado:
• Contrato de Financiación al Consumo (Ley 16/2011).
• Apertura de Cuenta Digital IBAN ({IBAN_DIGITAL}).
• Póliza de Protección de Datos (RGPD y LOPD-GDD).
• Pagaré desmaterializado con Sello Notarial eIDAS.

Para liberar los fondos de forma instantánea a su Cuenta Digital, simplemente introduzca el código SMS de un solo uso (OTP) que ha recibido en su teléfono móvil.`,
    callToActionLabel: 'Firmar Pagaré y Recibir Dinero',
    callToActionUrl: '{ENLACE_PORTAL}',
    autoAttachStatusImage: true,
    description: 'Notificación de concesión del crédito con el Certificado Oficial de Aprobación incorporado en la cabecera del correo.',
    badge: '¡Aprobado!',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'email-desembolso-fondos',
    name: 'Email: Confirmación Oficial de Desembolso y Retiro por Bizum',
    channel: 'email',
    loanStatusTrigger: 'Desembolsado',
    subject: 'Desembolso Completado • Fondos disponibles en su Cuenta Digital IBAN',
    content: `Estimado(a) {NOMBRE_CLIENTE},

Le confirmamos oficialmente que la totalidad de los fondos correspondientes a su crédito de {MONTO_EUR} han sido acreditados en su Cuenta Digital Instacredit:

🏛️ Cuenta Digital IBAN: {IBAN_DIGITAL}
📅 Fecha de primer vencimiento pactada: {FECHA_VENCIMIENTO}

Opciones de Retiro Inmediato Habilitadas:
1. Retiro por Bizum en 15 Segundos: Directo a su número de móvil sin esperas.
2. Transferencia SEPA Instantánea: A su cuenta bancaria de {BANCO_CLIENTE} sin comisiones.

Agradecemos su confianza en nuestra entidad. Ha sido un honor atenderle.`,
    callToActionLabel: 'Transferir o Retirar Fondos por Bizum',
    callToActionUrl: '{ENLACE_PORTAL}',
    autoAttachStatusImage: true,
    description: 'Envía la confirmación de desembolso con la tarjeta fintech de abono y Bizum integrada como cabecera visual.',
    badge: 'Desembolsado',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'email-seguridad-cero-anticipos',
    name: 'Email: Notificación Oficial de Seguridad y Cero Cobros Previos',
    channel: 'email',
    loanStatusTrigger: 'cualquiera',
    subject: 'Aviso Institucional de Seguridad: En INSTACREDIT Cero Cobros Anticipados',
    content: `Estimado(a) {NOMBRE_CLIENTE},

En INSTACREDIT España la transparencia y la seguridad de nuestros usuarios son principios irrenunciables.

Por ello, queremos reiterarle de forma fehaciente una de nuestras directrices fundamentales:

🚫 JAMÁS SOLICITAMOS COBROS O ANTICIPOS PREVIOS:
Bajo ninguna circunstancia le solicitaremos transferencias, consignaciones previas ni depósitos para "liberar", "desbloquear" o "agilizar" la entrega de su crédito de {MONTO_EUR}.

Todos los costes de la operación se liquidan de forma transparente y se amortizan exclusivamente en la fecha fijada ({FECHA_VENCIMIENTO}).

Si alguna persona se pone en contacto con usted solicitándole dinero por adelantado en nuestro nombre, repórtelo de inmediato a través de nuestros canales oficiales.`,
    callToActionLabel: 'Verificar Mi Expediente Seguro',
    callToActionUrl: '{ENLACE_PORTAL}/?tiquete={EXPEDIENTE_ID}',
    autoAttachStatusImage: true,
    overrideImageSrc: '/src/assets/images/ws_seguridad_antifraude_1790894760624.jpg',
    customBannerTitle: 'Certificado Oficial de Seguridad y Cero Cobros Previos',
    customBannerSubtitle: 'Supervisión Banco de España • Ley 16/2011 • Protección al Consumidor',
    description: 'Comunicado antifraude de máxima relevancia institucional con el escudo de seguridad y cero anticipos integrado en cabecera.',
    badge: 'Seguridad Antifraude',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  // =========================================================================
  // PLANTILLAS DE SMS / MMS / RCS (CON IMAGEN INTEGRADA COMO TARJETA RICA)
  // =========================================================================
  {
    id: 'sms-bienvenida-rich',
    name: 'SMS/RCS: Bienvenida y Asignación de Asesor Personal',
    channel: 'sms',
    loanStatusTrigger: 'Pendiente',
    content: `INSTACREDIT: ¡Hola, {PRIMER_NOMBRE}! Tu solicitud por {MONTO_EUR} (Exp. #{EXPEDIENTE_ID}) ha sido asignada al asesor {NOMBRE_ASESOR}. Respuesta garantizada en máx 30 min. Consulta tu Cuenta IBAN en: {ENLACE_PORTAL}`,
    callToActionLabel: 'Ver Expediente',
    callToActionUrl: '{ENLACE_PORTAL}',
    autoAttachStatusImage: true,
    description: 'Mensaje SMS/RCS que adjunta en cabecera la tarjeta visual de bienvenida con el sello del asesor y compromiso de 30 min.',
    badge: 'SMS Bienvenida',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'sms-docs-rich',
    name: 'SMS/RCS: Solicitud de Documentos DNI y Nómina',
    channel: 'sms',
    loanStatusTrigger: 'Pendiente',
    content: `INSTACREDIT: {PRIMER_NOMBRE}, para formalizar tus {MONTO_EUR} solo necesitamos foto de tu DNI/NIE y última nómina. Sube tus fotos de forma segura en 1 clic aquí: {ENLACE_PORTAL}/?form=asistido&expediente={EXPEDIENTE_ID}`,
    callToActionLabel: 'Adjuntar Fotos',
    callToActionUrl: '{ENLACE_PORTAL}/?form=asistido&expediente={EXPEDIENTE_ID}',
    autoAttachStatusImage: true,
    description: 'SMS con imagen adjunta de la infografía didáctica de documentos requeridos.',
    badge: 'SMS Docs',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'sms-aprobado-otp-rich',
    name: 'SMS/RCS: ¡Crédito Aprobado! Token SMS y Firma de Pagaré',
    channel: 'sms',
    loanStatusTrigger: 'Aprobado',
    content: `INSTACREDIT: ¡ENHORABUENA {PRIMER_NOMBRE}! Crédito de {MONTO_EUR} APROBADO. Firma tu pagaré en 2 min con tu token SMS y recibe el dinero en tu Cuenta Digital: {ENLACE_PORTAL}`,
    callToActionLabel: 'Firmar Ahora',
    callToActionUrl: '{ENLACE_PORTAL}',
    autoAttachStatusImage: true,
    description: 'Notificación de concesión del crédito con el Certificado Oficial de Aprobación en la cabecera multimedia.',
    badge: 'SMS Aprobado',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'sms-desembolso-bizum-rich',
    name: 'SMS/RCS: Fondos Depositados y Retiro Inmediato por Bizum',
    channel: 'sms',
    loanStatusTrigger: 'Desembolsado',
    content: `INSTACREDIT: {PRIMER_NOMBRE}, tus {MONTO_EUR} ya están acreditados en tu Cuenta Digital IBAN ({IBAN_DIGITAL}). Puedes retirarlos de inmediato por Bizum en 15 seg desde: {ENLACE_PORTAL}`,
    callToActionLabel: 'Retirar por Bizum',
    callToActionUrl: '{ENLACE_PORTAL}',
    autoAttachStatusImage: true,
    description: 'Mensaje de confirmación de desembolso con tarjeta visual de Bizum y SEPA.',
    badge: 'SMS Desembolso',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  // =========================================================================
  // PLANTILLAS DE WHATSAPP (CON IMAGEN INTEGRADA COMO BURBUJA ÚNICA - FOTO + PIE)
  // =========================================================================
  {
    id: 'wa-bienvenida-autonomos-rich',
    name: 'WhatsApp: Bienvenida a Autónomos y Pymes (Estilo Tarjeta Unificada)',
    channel: 'whatsapp',
    loanStatusTrigger: 'Pendiente',
    content: `¡Hola, *{PRIMER_NOMBRE}*! Saludos de *{NOMBRE_ASESOR}*, especialista de crédito para autónomos en *INSTACREDIT España*. 💼🇪🇸

Sabemos lo importante que es la agilidad cuando necesitas liquidez para proveedores, material o impuestos. Tu expediente *#{EXPEDIENTE_ID}* por *{MONTO_EUR}* ha sido priorizado en nuestra unidad de empresas y profesionales.

⚡ *Ventajas exclusivas para tu actividad:*
• Tramitación con tu último Modelo 130 de IRPF o certificado de bases.
• Sin avales hipotecarios ni farragosos balances contables.
• Transferencia directa a tu IBAN comercial en minutos tras la aprobación.

¿Pudiste revisar el detalle de la liquidación en la plataforma? En *menos de 30 minutos* puedo tener tu resolución definitiva lista. 🚀`,
    autoAttachStatusImage: true,
    overrideImageSrc: '/src/assets/images/ws_bienvenida_1790860195015.jpg',
    customBannerTitle: 'Bienvenido a INSTACREDIT España',
    customBannerSubtitle: 'Tu Asesor Personal • Soluciones Financieras a tu Medida',
    description: 'Plantilla de WhatsApp que se envía con la imagen como cabecera dentro de la misma burbuja única (como en la captura oficial).',
    badge: 'WhatsApp Autónomos',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'wa-aprobado-rich',
    name: 'WhatsApp: Crédito Aprobado y Firma Notarial eIDAS',
    channel: 'whatsapp',
    loanStatusTrigger: 'Aprobado',
    content: `🎉 *¡ENHORABUENA, {PRIMER_NOMBRE}! CRÉDITO APROBADO* 🎉

Te saluda *{NOMBRE_ASESOR}*. Me alegra comunicarte que tu solicitud por *{MONTO_EUR}* (Expediente *#{EXPEDIENTE_ID}*) ha sido *APROBADA SATISFACTORIAMENTE*.

Ya se encuentra preparado tu *Expediente Contractual Oficial* con validez legal completa (4 páginas):
1️⃣ Contrato de Préstamo al Consumo (Ley 16/2011).
2️⃣ Condiciones Generales y Apertura de Cuenta Digital IBAN.
3️⃣ Política Integral de Protección de Datos (RGPD UE 2016/679).
4️⃣ Consentimiento LOPD-GDD y Pagaré eIDAS.

✍️ *Para firmar y liberar el dinero en 2 minutos:*
1. Accede a tu área de formalización: {ENLACE_PORTAL}
2. Introduce el código SMS OTP que recibirás en tu móvil verificado.
3. ¡El desembolso se acreditará de forma inmediata en tu Cuenta Digital!

Quedo atento(a) por aquí para asistirte con la firma digital. 📲`,
    autoAttachStatusImage: true,
    overrideImageSrc: '/src/assets/images/ws_cierre_aprob_1790860226017.jpg',
    customBannerTitle: '¡Crédito Concedido! • INSTACREDIT España',
    customBannerSubtitle: 'Firma Notarial eIDAS en 2 Minutos • Sin Papeleos',
    description: 'Mensaje de aprobación con la tarjeta de concesión unida en el encabezado de la burbuja verde.',
    badge: 'WhatsApp Aprobado',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  },

  {
    id: 'wa-desembolso-bizum-rich',
    name: 'WhatsApp: Desembolso en Cuenta Digital y Retiro Bizum',
    channel: 'whatsapp',
    loanStatusTrigger: 'Desembolsado',
    content: `💸 *CONFIRMACIÓN DE DESEMBOLSO REALIZADO* 💸

Hola, *{NOMBRE_CLIENTE}*. Te confirmo oficialmente que los fondos correspondientes a tu crédito de *{MONTO_EUR}* ya han sido acreditados con éxito en tu *Cuenta Digital INSTACREDIT*:

🏛️ *IBAN Digital:* \`{IBAN_DIGITAL}\`
📅 *Fecha de primera cuota:* {FECHA_VENCIMIENTO}

🚀 *Opciones para movilizar tu dinero de inmediato:*
• *Bizum Instantáneo:* Retiro directo a tu número de teléfono móvil en menos de 15 segundos.
• *Transferencia SEPA Instantánea:* A tu cuenta bancaria de {BANCO_CLIENTE} sin comisiones.

Accede a tu banca digital para mover los fondos: {ENLACE_PORTAL}

Agradecemos enormemente tu confianza en nuestra trayectoria y solvencia. ¡Disfruta de tus fondos!`,
    autoAttachStatusImage: true,
    overrideImageSrc: '/src/assets/images/ws_desembolso_bizum_1790894749766.jpg',
    customBannerTitle: 'Confirmación de Desembolso • INSTACREDIT España',
    customBannerSubtitle: 'Fondos Acreditados • Retiro Inmediato por Bizum o SEPA',
    description: 'Notificación de abono con la tarjeta oficial de Bizum y SEPA como cabecera integrada.',
    badge: 'WhatsApp Desembolso',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    updatedAt: '2026-10-01',
    isSystemDefault: true
  }
];
