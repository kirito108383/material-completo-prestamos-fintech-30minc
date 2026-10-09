import { LoanStatus } from '../types';

export type KitCategory =
  | 'bienvenida'
  | 'solicitud_docs'
  | 'recordatorio_no_responde'
  | 'verificacion_urls_encuestas'
  | 'seguimiento_garantia'
  | 'aprobacion_eidas'
  | 'desembolso_bizum'
  | 'flexibilidad_prorrogas'
  | 'fidelizacion_cupo';

export interface KitTemplateParams {
  clientName: string;
  clientFirstName: string;
  clientPhone: string;
  capitalAmount: string;
  radicadoId: string;
  digitalIban: string;
  dueDate: string;
  advisorName: string;
  advisorPhone: string;
  baseUrl: string;
  bankName?: string;
  purpose?: string;
}

export interface WhatsAppKitItem {
  id: string;
  category: KitCategory;
  categoryName: string;
  categoryIcon: string;
  title: string;
  shortScenario: string;
  badge: string;
  badgeColor: string;
  targetClientState: LoanStatus | 'Cualquiera';

  // Image strictly paired with this kit
  image: {
    src: string;
    title: string;
    subtitle: string;
    themeBadge: string;
    relationReason: string; // Explains why message and image are unified and make sense together
  };

  // Dynamic template function
  getTemplate: (params: KitTemplateParams) => string;

  // Key pillar of compliance or customer experience
  keyPillar: string;
  tags: string[];
}

export const CATEGORY_DEFINITIONS: Record<
  KitCategory,
  { name: string; icon: string; description: string; count: number }
> = {
  bienvenida: {
    name: '1. Bienvenida y Saludo',
    icon: '👋',
    description: 'Primer contacto, bienvenida y garantía de 30 min',
    count: 4
  },
  solicitud_docs: {
    name: '2. Solicitud Documental',
    icon: '📄',
    description: 'Checklists didácticos de DNI/NIE, nómina e IBAN',
    count: 4
  },
  recordatorio_no_responde: {
    name: '3. Si el Cliente No Responde',
    icon: '🔔',
    description: 'Paquetes Imagen + Mensaje + URL por si el cliente deja en visto (2h, 12h, 24h)',
    count: 4
  },
  verificacion_urls_encuestas: {
    name: '4. URLs Directas y Encuestas',
    icon: '🔗',
    description: 'Enlaces directos a formularios de verificación, encuesta de solvencia y firma',
    count: 4
  },
  seguimiento_garantia: {
    name: '5. Garantía y Antifraude',
    icon: '🛡️',
    description: 'Compromiso 30 min, 12 años y Cero Anticipos',
    count: 4
  },
  aprobacion_eidas: {
    name: '6. Aprobación y Firma',
    icon: '✍️',
    description: 'Resolución favorable y firma OTP eIDAS en 2 min',
    count: 3
  },
  desembolso_bizum: {
    name: '7. Desembolso y Bizum',
    icon: '💸',
    description: 'Fondos en Cuenta Digital, retiro Bizum y SEPA',
    count: 3
  },
  flexibilidad_prorrogas: {
    name: '8. Prórrogas y Flexibilidad',
    icon: '⏱️',
    description: 'Recordatorio 48h y extensión 15/30 días',
    count: 3
  },
  fidelizacion_cupo: {
    name: '9. Fidelización y Cupo',
    icon: '⭐',
    description: 'Aumento de límite a 5.000 € y descuento puntual',
    count: 3
  }
};

export const WHATSAPP_KITS: WhatsAppKitItem[] = [
  // =========================================================================
  // CATEGORÍA 1: BIENVENIDA E INICIO INMEDIATO
  // =========================================================================
  {
    id: 'kit-bienvenida-oficial',
    category: 'bienvenida',
    categoryName: 'Bienvenida y Saludo',
    categoryIcon: '👋',
    title: 'Bienvenida Institucional con Garantía de 30 Minutos',
    shortScenario: 'Enviar tan pronto se radique la solicitud en la web para tranquilizar al usuario.',
    badge: 'Primer Contacto',
    badgeColor: 'bg-blue-50 text-[#0066FF] border-blue-200',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/ws_bienvenida_1790860195015.jpg',
      title: 'Tarjeta de Bienvenida y Asesor Personal',
      subtitle: 'Imagen con sello corporativo de atención preferencial y compromiso estricto de respuesta en máximo 30 min.',
      themeBadge: 'Acreditación Oficial',
      relationReason: 'La tarjeta visual con sello de asesor personal refuerza visualmente la promesa de respuesta inmediata en 30 minutos y elimina la incertidumbre del cliente.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `¡Hola, *${clientFirstName}*! 👋 Te damos la más cordial bienvenida a *INSTACREDIT España*. 🇪🇸

Soy *${advisorName}*, tu asesor financiero personal asignado. Es un auténtico placer atenderte.

Te confirmo que tu solicitud por *${capitalAmount}* (Expediente *#${radicadoId}*) ha ingresado a nuestra mesa de análisis preferencial.

🏛️ *Trayectoria y Confianza que te respaldan:*
• Más de 12 años facilitando soluciones de crédito responsable en España.
• Más de 150.000 operaciones formalizadas con total transparencia.
• Operativa bajo la Ley 16/2011 y supervisión de buenas prácticas del Banco de España.

⏱️ *Nuestro Compromiso de Calidad:*
Tienes garantizada una respuesta y acompañamiento en un *máximo de 30 minutos*.

¿Tienes alguna consulta sobre los plazos o el funcionamiento de tu Cuenta Digital IBAN? Estoy a tu entera disposición por aquí. 👇`,
    keyPillar: 'Garantía de respuesta en ≤ 30 minutos y asesor asignado 1 a 1.',
    tags: ['Bienvenida', '30 Minutos', 'Primer Contacto', 'Institucional']
  },

  {
    id: 'kit-bienvenida-agil-web',
    category: 'bienvenida',
    categoryName: 'Bienvenida y Saludo',
    categoryIcon: '👋',
    title: 'Saludo Cercano para Consultas Web y Redes Sociales',
    shortScenario: 'Para usuarios que pulsan el botón de WhatsApp desde móvil o redes buscando atención ágil.',
    badge: 'Atención Directa',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/fb_lifestyle_personal_1790893993475.jpg',
      title: 'Soluciones Financieras Digitales Inmediatas',
      subtitle: 'Diseño lifestyle dinámico enfocado en proyectos personales y respuesta 100% digital sin colas.',
      themeBadge: 'Trato Cercano',
      relationReason: 'Muestra cercanía humana y empatía cotidiana, conectando con las metas personales del usuario sin lenguaje burocrático.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `¡Hola, *${clientFirstName}*! Un gusto saludarte. 😊

Te escribe *${advisorName}* de *INSTACREDIT España*.

He recibido tu interés para financiar *${capitalAmount}* (Expediente *#${radicadoId}*). Con más de una década de trayectoria, nos caracterizamos por ofrecerte un trato cercano, humano y sin papeleos innecesarios.

🌟 *Lo que nos diferencia:*
• Asesoría directa 1 a 1 de principio a fin, sin contestadores automáticos.
• Respuesta garantizada en menos de 30 minutos.
• Firma electrónica cualificada eIDAS para que no tengas que imprimir ni desplazarte a ninguna oficina bancaria.

¿Qué proyecto o necesidad te gustaría financiar hoy para prepararte una propuesta a tu medida? 💶`,
    keyPillar: 'Atención humana sin contestadores y gestión 100% online.',
    tags: ['Cercano', 'Móvil', 'Sin Papeleos', 'Redes']
  },

  {
    id: 'kit-bienvenida-asistido-voz',
    category: 'bienvenida',
    categoryName: 'Bienvenida y Saludo',
    categoryIcon: '👋',
    title: 'Bienvenida Asistida con Formulario de Voz Accesible',
    shortScenario: 'Para personas mayores, con dificultad visual o que prefieran interactuar de forma muy sencilla.',
    badge: 'Inclusión Accesible',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/ws_bienvenida_1790860195015.jpg',
      title: 'Acceso Guiado y Asistencia Telefónica',
      subtitle: 'Material institucional con soporte de voz y lectura asistida en letra grande.',
      themeBadge: 'Accesibilidad Total',
      relationReason: 'Acompaña la explicación del formulario de voz con una credencial formal que da tranquilidad y guía clara al usuario senior.'
    },
    getTemplate: ({ clientName, advisorName, radicadoId, baseUrl }) =>
      `Estimado(a) *${clientName}*, te saluda *${advisorName}* de *INSTACREDIT*. 🎙️✨

Queremos que tu experiencia sea lo más sencilla y cómoda posible. Si prefieres completar tus datos con ayuda guiada, he preparado para ti un *Formulario Didáctico con Asistencia de Voz*:

👉 *Enlace directo:* ${baseUrl}/?form=asistido&expediente=${radicadoId}

🔊 *Ventajas del formulario asistido:*
• Puedes pulsar el botón del altavoz para escuchar cada instrucción en voz alta.
• Letra grande y formato interactivo muy fácil de responder paso a paso.
• Diseñado especialmente para personas con dificultades de vista o lectura.

Si lo prefieres, también puedo tomarte los datos directamente por este chat. ¡Estoy aquí para facilitarte el camino!`,
    keyPillar: 'Inclusión digital, lectura por sintetizador de voz y asistencia guiada.',
    tags: ['Voz', 'Accesibilidad', 'Mayores', 'Formulario']
  },

  {
    id: 'kit-bienvenida-autonomos-pymes',
    category: 'bienvenida',
    categoryName: 'Bienvenida y Saludo',
    categoryIcon: '👋',
    title: 'Bienvenida Especial para Autónomos, Pymes y Circulante',
    shortScenario: 'Para profesionales y trabajadores por cuenta propia que solicitan liquidez para su actividad.',
    badge: 'Empresas y Autónomos',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/fb_lifestyle_entrepreneur_1790893984324.jpg',
      title: 'Impulso Financiero a Negocios y Profesionales',
      subtitle: 'Gráfica profesional para autónomos con foco en rapidez de tesorería y abono en Cuenta Digital.',
      themeBadge: 'Circulante y Negocios',
      relationReason: 'La fotografía del entorno comercial y profesional sintoniza inmediatamente con la urgencia de liquidez y circulante de un autónomo.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `¡Hola, *${clientFirstName}*! Saludos de *${advisorName}*, especialista de crédito para autónomos en *INSTACREDIT España*. 💼🇪🇸

Sabemos lo importante que es la agilidad cuando necesitas liquidez para proveedores, material o impuestos. Tu expediente *#${radicadoId}* por *${capitalAmount}* ha sido priorizado en nuestra unidad de empresas y profesionales.

⚡ *Ventajas exclusivas para tu actividad:*
• Tramitación con tu último Modelo 130 de IRPF o certificado de bases.
• Sin avales hipotecarios ni farragosos balances contables.
• Transferencia directa a tu IBAN comercial en minutos tras la aprobación.

¿Pudiste revisar el detalle de la liquidación en la plataforma? En *menos de 30 minutos* puedo tener tu resolución definitiva lista. 🚀`,
    keyPillar: 'Solución de tesorería ágil para profesionales sin trabas bancarias.',
    tags: ['Autónomos', 'Pymes', 'Negocio', 'Modelo 130']
  },

  // =========================================================================
  // CATEGORÍA 2: SOLICITUD Y ASISTENCIA DOCUMENTAL DIDÁCTICA
  // =========================================================================
  {
    id: 'kit-docs-checklist-oficial',
    category: 'solicitud_docs',
    categoryName: 'Solicitud Documental',
    categoryIcon: '📄',
    title: 'Checklist Oficial de Documentación (DNI/NIE, Nómina, IBAN)',
    shortScenario: 'Enviar para recopilar los 3 documentos indispensables requeridos por la mesa de riesgos.',
    badge: 'Checklist Rápido',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/ws_docs_guia_1790860205561.jpg',
      title: 'Infografía Didáctica de Documentos Requeridos',
      subtitle: 'Ilustración paso a paso mostrando cómo fotografiar DNI anverso/reverso, justificante de nómina y certificado de titularidad IBAN.',
      themeBadge: 'Guía Visual Paso a Paso',
      relationReason: 'La infografía visual muestra de manera gráfica los 3 documentos exactos requeridos, evitando confusiones o envíos incompletos.'
    },
    getTemplate: ({ clientName, advisorName, capitalAmount, radicadoId }) =>
      `Estimado(a) *${clientName}*, te escribe *${advisorName}* de *INSTACREDIT*. 📄🔍

Para avanzar con la concesión de tu crédito por *${capitalAmount}* (Expediente *#${radicadoId}*), nuestro equipo de análisis requiere únicamente estos 3 sencillos justificantes:

1️⃣ *Documento de Identidad Oficial (en vigor):*
   • DNI (ciudadanos españoles) o NIE / Tarjeta TIE con permiso de residencia (extranjeros residentes). Foto nítida por ambas caras.

2️⃣ *Acreditación de Ingresos:*
   • Tu última nómina mensual (asalariados), certificado de pensión (jubilados) o modelo 130/100 de IRPF (autónomos).

3️⃣ *Justificante de Cuenta Bancaria:*
   • Certificado de titularidad o extracto donde aparezca tu nombre completo y el IBAN español donde transferiremos los fondos.

📸 *¿Cómo enviarlo?*
Puedes adjuntar las fotografías directamente respondiendo a este chat de WhatsApp. Con nuestra garantía de agilidad, validaremos tus documentos en *menos de 30 minutos*. ⏱️`,
    keyPillar: 'Verificación SEPBLAC y Banco de España en 3 simples pasos.',
    tags: ['Documentos', 'DNI', 'Nómina', 'IBAN', 'Checklist']
  },

  {
    id: 'kit-docs-extranjeros-nie',
    category: 'solicitud_docs',
    categoryName: 'Solicitud Documental',
    categoryIcon: '📄',
    title: 'Guía Específica para Extranjeros Residentes (NIE / TIE)',
    shortScenario: 'Para solicitantes de nacionalidad extranjera con residencia legal en España.',
    badge: 'Extranjería y NIE',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/ws_docs_guia_1790860205561.jpg',
      title: 'Guía de Identidad para Residentes Extranjeros',
      subtitle: 'Ilustración visual de la tarjeta TIE comunitaria y no comunitaria con permiso de residencia en España.',
      themeBadge: 'Inclusión Extranjería',
      relationReason: 'Demuestra con claridad fotográfica qué documentos de residencia (TIE o NIE verde con pasaporte) son legalmente aceptados por nuestro sistema.'
    },
    getTemplate: ({ clientName, advisorName, capitalAmount }) =>
      `Hola, *${clientName}*. Con respecto a los requisitos para ciudadanos extranjeros residentes en España: 🌍🇪🇸

En *INSTACREDIT* contamos con una amplia trayectoria de inclusión financiera. Atendemos solicitudes tanto con:
• *NIE Comunitario (hoja verde)* acompañado de tu pasaporte en vigor.
• *TIE (Tarjeta de Identidad de Extranjero)* con autorización de residencia vigente por ambas caras.

Los únicos dos requisitos indispensables para formalizar tu solicitud de *${capitalAmount}* son:
1️⃣ Acreditar ingresos regulares en España (nómina o actividad por cuenta propia).
2️⃣ Disponer de cuenta bancaria con IBAN español a tu mismo nombre.

Adjúntanos tus fotos por este chat y te confirmamos la viabilidad en *menos de 30 minutos*. ¡Estamos encantados de atenderte!`,
    keyPillar: 'Inclusión bancaria a residentes conforme a la normativa de extranjería.',
    tags: ['NIE', 'TIE', 'Extranjeros', 'Pasaporte', 'Residencia']
  },

  {
    id: 'kit-docs-autonomos-irpf',
    category: 'solicitud_docs',
    categoryName: 'Solicitud Documental',
    categoryIcon: '📄',
    title: 'Justificantes de Ingresos para Autónomos (Modelo 130/IRPF)',
    shortScenario: 'Instrucciones para profesionales independientes que no disponen de nómina tradicional.',
    badge: 'Autónomos e IRPF',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/fb_lifestyle_entrepreneur_1790893984324.jpg',
      title: 'Validación Simplificada para Trabajadores Autónomos',
      subtitle: 'Documentación fiscal mínima requerida para profesionales independientes y comercios.',
      themeBadge: 'Fiscalidad y Autónomos',
      relationReason: 'La imagen de entorno laboral y comercial valida el esfuerzo del trabajador independiente y clarifica que no se requiere nómina fija.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `Hola, *${clientFirstName}*. Como sabemos que trabajas por cuenta propia, en *INSTACREDIT* no te pedimos nómina para tu solicitud de *${capitalAmount}* (Exp. *#${radicadoId}*). 📊💼

Para validar tus ingresos solo requerimos:
1. Fotocopia de tu último *Modelo 130 de IRPF* (o Modelo 100 de la Declaración de la Renta).
2. Justificante de la cuota de la Seguridad Social de Autónomos (RETA) o extracto bancario con los cobros de tus clientes.
3. DNI o NIE en vigor y certificado de titularidad de tu IBAN bancario.

Envíanos el PDF o fotos de estos soportes por aquí y emitiremos tu aprobación en *menos de 30 minutos*. ¡Seguimos trabajando por tu proyecto!`,
    keyPillar: 'Evaluación de capacidad crediticia adaptada al colectivo autónomo.',
    tags: ['Autónomos', 'Modelo 130', 'IRPF', 'Sin Nómina']
  },

  {
    id: 'kit-docs-subsanacion-foto',
    category: 'solicitud_docs',
    categoryName: 'Solicitud Documental',
    categoryIcon: '📄',
    title: 'Subsanación Rápida por Foto Ilegible o con Reflejos en el DNI',
    shortScenario: 'Cuando el motor de OCR o analista detecta que la foto del DNI está cortada o borrosa.',
    badge: 'Subsanación OCR',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    targetClientState: 'En Revisión',
    image: {
      src: '/src/assets/images/ws_docs_guia_1790860205561.jpg',
      title: 'Guía de Enfoque y Nitidez para Documentos',
      subtitle: 'Consejos visuales: evitar flash, colocar sobre fondo plano y asegurar que las 4 esquinas sean visibles.',
      themeBadge: 'Calidad Fotográfica',
      relationReason: 'La infografía muestra visualmente cómo colocar el documento sobre fondo liso sin reflejos, solucionando el rechazo técnico de inmediato.'
    },
    getTemplate: ({ clientFirstName, advisorName, radicadoId }) =>
      `Hola, *${clientFirstName}*. Te saluda nuevamente *${advisorName}* de *INSTACREDIT*. 📸⚠️

Nuestro sistema de validación biométrica ha revisado la fotografía de tu documento en el expediente *#${radicadoId}*, pero presenta un leve reflejo / falta de nitidez que dificulta la lectura del número de soporte.

💡 *Consejos rápidos para repetirla en 10 segundos:*
• Coloca tu DNI/NIE sobre una mesa bien iluminada (sin usar el flash directo de la cámara).
• Asegúrate de que se vean las 4 esquinas del documento.
• Toma una foto del anverso y otra del reverso.

Por favor, reenvíamela respondiendo a este mensaje para activar tu aprobación en los próximos *15 minutos*. ¡Muchas gracias por tu colaboración!`,
    keyPillar: 'Validación biométrica conforme a la Ley 10/2010 y firma eIDAS.',
    tags: ['Subsanación', 'Foto Borrosa', 'DNI', 'Reflejos', 'OCR']
  },

  // =========================================================================
  // CATEGORÍA 3: TRAYECTORIA, GARANTÍA 30 MIN Y SEGURIDAD ANTIFRAUDE
  // =========================================================================
  {
    id: 'kit-garantia-30-minutos',
    category: 'seguimiento_garantia',
    categoryName: 'Garantía y Antifraude',
    categoryIcon: '🛡️',
    title: 'Compromiso Estricto de Respuesta en Máximo 30 Minutos',
    shortScenario: 'Enviar cuando el expediente está en estudio para transmitir seguridad y certidumbre.',
    badge: 'Garantía 30m',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    targetClientState: 'En Revisión',
    image: {
      src: '/src/assets/images/ws_seguimiento_1790860216261.jpg',
      title: 'Infografía de Trayectoria, Respaldo y Confianza',
      subtitle: 'Más de 12 años de experiencia, 150.000 clientes satisfechos y garantía de respuesta en máximo 30 min.',
      themeBadge: 'Compromiso 30m',
      relationReason: 'La imagen destaca el cronómetro institucional y el compromiso de puntualidad, aportando tranquilidad absoluta a quien espera su dinero.'
    },
    getTemplate: ({ clientName, advisorName, capitalAmount, radicadoId }) =>
      `Estimado(a) *${clientName}*, te escribe *${advisorName}* de *INSTACREDIT España*. ⏱️✨

Queremos confirmarte que tu expediente *#${radicadoId}* por *${capitalAmount}* se encuentra actualmente en fase de revisión prioritaria por nuestros analistas senior.

🛡️ *Nuestra Garantía de Calidad y Trayectoria:*
• Cumplimos con un estándar estricto de respuesta en un *máximo de 30 minutos*.
• Te mantendremos informado(a) en tiempo real por esta misma vía de cada paso.
• Toda la operativa se realiza bajo los más exigentes protocolos de seguridad y protección de datos (RGPD y LOPD-GDD).

Si surge cualquier consulta mientras tanto, puedes escribirme directamente a este WhatsApp. ¡Te mantengo informado(a) en breve!`,
    keyPillar: 'Estándar de calidad SLA ≤ 30 minutos en cada gestión de clientes.',
    tags: ['30 Minutos', 'SLA', 'Respuesta Rápida', 'Calidad']
  },

  {
    id: 'kit-garantia-trayectoria-12-anos',
    category: 'seguimiento_garantia',
    categoryName: 'Garantía y Antifraude',
    categoryIcon: '🛡️',
    title: 'Respaldo Institucional: 12 Años y 150.000 Clientes en España',
    shortScenario: 'Ideal para clientes precavidos que preguntan por la legalidad, fiabilidad y trayectoria de la entidad.',
    badge: '12 Años Trayectoria',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    targetClientState: 'En Revisión',
    image: {
      src: '/src/assets/images/ws_seguimiento_1790860216261.jpg',
      title: 'Solidez Financiera y Trayectoria en España',
      subtitle: 'Acreditación de más de 12 años en el mercado financiero y supervisión bajo la Ley 16/2011.',
      themeBadge: 'Autoridad Institucional',
      relationReason: 'La infografía de solvencia histórica proyecta la seriedad de una entidad con 12 años en el mercado y miles de familias respaldadas.'
    },
    getTemplate: ({ clientFirstName, capitalAmount }) =>
      `Hola, *${clientFirstName}*. Comprendemos perfectamente que solicitar financiación requiera total confianza. 🏛️🌟

Por eso queremos compartir contigo quiénes somos en *INSTACREDIT España*:

✅ *Más de 12 años de trayectoria* en el sector financiero digital español.
✅ Más de *150.000 operaciones formalizadas* con familias, autónomos y empresas.
✅ Contratos homologados conforme a la *Ley 16/2011 de Contratos de Crédito al Consumo*.
✅ Supervisión y transparencia conforme a las directrices de conducta del *Banco de España*.
✅ Firma digital cualificada con plena validez jurídica bajo el reglamento europeo *eIDAS (UE 910/2014)*.

Tu tranquilidad es nuestra prioridad absoluta. ¿Te gustaría que revisemos juntos las condiciones de tu préstamo de *${capitalAmount}*? Estoy a tu entera disposición.`,
    keyPillar: 'Cumplimiento exhaustivo de la Ley 16/2011 y normativa del Banco de España.',
    tags: ['Trayectoria', '12 Años', 'Banco de España', 'Solvencia']
  },

  {
    id: 'kit-garantia-cero-anticipos',
    category: 'seguimiento_garantia',
    categoryName: 'Garantía y Respaldo',
    categoryIcon: '🛡️',
    title: 'Certificado de Respaldo Legal y Depósito Directo en Cuenta Creada (Ley 16/2011)',
    shortScenario: 'Para dar total confianza jurídica sobre el depósito directo en la cuenta creada al finalizar los cuestionarios.',
    badge: 'Respaldo Oficial',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    targetClientState: 'Cualquiera',
    image: {
      src: '/src/assets/images/ws_recorrido_30_minutos_1791522034719.jpg',
      title: 'Recorrido Oficial de 4 Pasos para Recibir tu Préstamo en Menos de 30 Minutos',
      subtitle: '1. Cuestionario URL -> 2. Verificación DNI/IBAN -> 3. Firma eIDAS -> 4. Depósito Directo en Cuenta SEPA/Bizum.',
      themeBadge: 'Garantía 30 Minutos',
      relationReason: 'El mapa visual de 4 pasos explica con total claridad cómo se deposita el dinero en la cuenta creada por el cliente al completar sus enlaces.'
    },
    getTemplate: ({ clientName, advisorName, capitalAmount, radicadoId, digitalIban, baseUrl }) =>
      `Estimado(a) *${clientName}*, te saluda *${advisorName}* de *INSTACREDIT España*. 🛡️🇪🇸

Te comparto la infografía oficial de tu expediente *#${radicadoId}* para que tengas total claridad de cómo recibirás tus *${capitalAmount}* en *menos de 30 minutos*:

1️⃣ *Paso 1 (Cuestionario URL Solicitud):* Confirmas tu importe y plazo deseado.
2️⃣ *Paso 2 (Cuestionario URL Cuenta e IBAN):* Queda configurada tu Cuenta Digital (\`${digitalIban}\`) vinculada a tu banco español.
3️⃣ *Paso 3 (Firma Electrónica eIDAS):* Firmas tus contratos oficiales de 4 páginas desde tu móvil.
4️⃣ *Paso 4 (Depósito Inmediato):* Una vez completado todo el recorrido, el sistema deposita automáticamente tus *${capitalAmount}* en la cuenta que fuiste creando para que los retires por SEPA Instant o Bizum.

🔗 *Continúa tu paso actual aquí:*
${baseUrl}/?form=solicitud&exp=${radicadoId}

Tu expediente está 100% protegido bajo cifrado bancario de 256 bits y la Ley 16/2011. 🚀`,
    keyPillar: 'Claridad total del recorrido de 4 pasos con abono directo en la cuenta creada.',
    tags: ['Recorrido 30m', 'Depósito Directo', 'Seguridad', 'Ley 16/2011']
  },

  {
    id: 'kit-garantia-portal-envivo',
    category: 'seguimiento_garantia',
    categoryName: 'Garantía y Antifraude',
    categoryIcon: '🛡️',
    title: 'Portal de Seguimiento en Vivo con Radicado y Cuenta Digital',
    shortScenario: 'Facilitar al cliente el enlace directo para verificar su expediente en tiempo real.',
    badge: 'Portal en Vivo',
    badgeColor: 'bg-blue-50 text-[#0066FF] border-blue-200',
    targetClientState: 'En Revisión',
    image: {
      src: '/src/assets/images/ws_seguimiento_1790860216261.jpg',
      title: 'Rastreo de Expediente en Tiempo Real',
      subtitle: 'Monitoreo de estado, saldo en Cuenta Digital IBAN y descarga de documentación contractual.',
      themeBadge: 'Transparencia Digital',
      relationReason: 'La infografía de seguimiento respalda la invitación a ingresar al portal digital y consultar el expediente con total autonomía.'
    },
    getTemplate: ({ clientName, advisorName, radicadoId, digitalIban, baseUrl }) =>
      `Hola, *${clientName}*. Para tu total comodidad y transparencia, puedes consultar el estado en vivo de tu expediente en cualquier momento:

👉 *Portal de Seguimiento en Vivo:* ${baseUrl}/?tiquete=${radicadoId}

📱 *Desde tu portal puedes:*
• Ver la etapa exacta de tu solicitud (*En Revisión*, *Aprobado*, *Desembolsado*).
• Consultar tu Cuenta Digital IBAN (\`${digitalIban}\`).
• Descargar el expediente contractual completo de 4 páginas en PDF.

Cualquier duda, recuerda que tu asesor asignado (*${advisorName}*) te responde en un tiempo récord de *máximo 30 minutos*. 👍`,
    keyPillar: 'Autonomía y visibilidad en tiempo real para el solicitante.',
    tags: ['Portal', 'Seguimiento', 'En Vivo', 'IBAN']
  },

  // =========================================================================
  // CATEGORÍA 4: RESOLUCIÓN FAVORABLE Y FIRMA ELECTRÓNICA eIDAS
  // =========================================================================
  {
    id: 'kit-aprobacion-enhorabuena',
    category: 'aprobacion_eidas',
    categoryName: 'Aprobación y Firma',
    categoryIcon: '✍️',
    title: 'Notificación Oficial de Crédito Aprobado y Firma eIDAS',
    shortScenario: 'Enviar en cuanto el analista apruebe el préstamo para proceder a la formalización.',
    badge: '¡Aprobado!',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    targetClientState: 'Aprobado',
    image: {
      src: '/src/assets/images/ws_cierre_aprob_1790860226017.jpg',
      title: 'Certificado Oficial de Crédito Concedido',
      subtitle: 'Tarjeta oficial de aprobación con sello de firma electrónica cualificada eIDAS y abono en Cuenta Digital.',
      themeBadge: 'Aprobación Concedida',
      relationReason: 'El certificado visual de concesión transmite celebración formal, ratifica la cifra aprobada y motiva al prestatario a firmar sin dudar.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId, clientPhone, baseUrl }) =>
      `🎉 *¡ENHORABUENA, ${clientFirstName.toUpperCase()}! CRÉDITO APROBADO* 🎉

Te saluda *${advisorName}*. Me alegra comunicarte que tu solicitud por *${capitalAmount}* (Expediente *#${radicadoId}*) ha sido *APROBADA SATISFACTORIAMENTE*.

Ya se encuentra preparado tu *Expediente Contractual Oficial* con validez legal completa (4 páginas):
1️⃣ Contrato de Préstamo al Consumo (Ley 16/2011).
2️⃣ Condiciones Generales y Apertura de Cuenta Digital IBAN.
3️⃣ Política Integral de Protección de Datos (RGPD UE 2016/679).
4️⃣ Consentimiento LOPD-GDD y Pagaré eIDAS.

✍️ *Para firmar y liberar el dinero en 2 minutos:*
1. Accede a tu área de formalización: ${baseUrl}
2. Introduce el código SMS OTP que recibirás en tu móvil verificado (+34 ${clientPhone}).
3. ¡El desembolso se acreditará de forma inmediata en tu Cuenta Digital!

Quedo atento(a) por aquí para asistirte con la firma digital. 📲`,
    keyPillar: 'Firma electrónica eIDAS con plena validez probatoria civil y mercantil.',
    tags: ['Aprobado', 'Firma OTP', 'eIDAS', 'Contrato']
  },

  {
    id: 'kit-aprobacion-guia-otp',
    category: 'aprobacion_eidas',
    categoryName: 'Aprobación y Firma',
    categoryIcon: '✍️',
    title: 'Guía Rápida para Firma con Código SMS OTP en 2 Minutos',
    shortScenario: 'Para usuarios que necesitan orientación paso a paso para introducir su token de firma.',
    badge: 'Firma en 2 Minutos',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    targetClientState: 'Aprobado',
    image: {
      src: '/src/assets/images/ws_cierre_aprob_1790860226017.jpg',
      title: 'Pagaré Notarial Electrónico con Sello eIDAS',
      subtitle: 'Instrucciones visuales para validar el SMS de un solo uso (OTP) en el terminal móvil.',
      themeBadge: 'Seguridad OTP',
      relationReason: 'Muestra la pantalla de formalización y la seguridad de la firma digital sin papeles ni desplazamientos a notarías.'
    },
    getTemplate: ({ clientFirstName, advisorName, radicadoId, baseUrl }) =>
      `Hola, *${clientFirstName}*. Te asiste *${advisorName}* para la firma de tu expediente *#${radicadoId}*. 🔐📱

Firmar tu crédito te tomará menos de 2 minutos:

1. Entra al enlace oficial: ${baseUrl}
2. Revisa el resumen de tu pagaré con el importe pactado.
3. Haz clic en *"Firmar Documentos"*.
4. Te llegará un mensaje de texto (SMS) a tu móvil con un código de seguridad de 6 dígitos.
5. Ingrésalo en la pantalla y pulsa *"Confirmar Firma"*.

¡Listo! No tienes que imprimir papeles ni desplazarte. Los fondos se liberan en tu Cuenta Digital en el acto. ¿Te ha llegado el SMS o prefieres que te lo reenvíe?`,
    keyPillar: 'Firma desmaterializada sin papel y custodia con sello de tiempo criptográfico.',
    tags: ['SMS OTP', 'Token', 'Firma Digital', 'Pagaré']
  },

  {
    id: 'kit-aprobacion-cupo-ajustado',
    category: 'aprobacion_eidas',
    categoryName: 'Aprobación y Firma',
    categoryIcon: '✍️',
    title: 'Aprobación con Cupo Inicial Ajustado para Proteger Score',
    shortScenario: 'Cuando el analista aprueba un importe menor al solicitado para cuidar la capacidad de pago.',
    badge: 'Cupo Protegido',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    targetClientState: 'Aprobado',
    image: {
      src: '/src/assets/images/fb_lifestyle_family_1790893967984.jpg',
      title: 'Finanzas Saludables y Crecimiento de Cupo Progresivo',
      subtitle: 'Crédito responsable: cuidamos tu endeudamiento para garantizarte aumentos rápidos en las próximas operaciones.',
      themeBadge: 'Salud Crediticia',
      relationReason: 'La calidez de la imagen familiar refuerza que el ajuste busca cuidar la tranquilidad del hogar y abrir las puertas a un historial impecable.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId }) =>
      `Don/doña *${clientFirstName}*, le tengo muy buenas noticias: su crédito en *INSTACREDIT* ha sido aprobado favorablemente. 👏

Para cuidar su capacidad de endeudamiento y garantizarle una cuota perfectamente cómoda, nuestro comité de riesgos le ha concedido un cupo inicial preferente de *${capitalAmount}* (Exp. *#${radicadoId}*).

Lo grandioso de este crédito inicial es que al amortizarlo puntualmente, nuestro sistema le otorgará de forma automática:
• Un aumento de cupo crediticio de hasta 3.000 € en su siguiente solicitud.
• Un descuento del 10% en los costes de la fianza.
• Historial financiero 100% positivo reportado al CIRBE.

¿Desea que procedamos a emitir su pagaré digital por *${capitalAmount}* para que disponga del dinero hoy mismo?`,
    keyPillar: 'Crédito responsable y crecimiento progresivo de cupo crediticio.',
    tags: ['Ajuste Monto', 'Capacidad Pago', 'Fidelización', 'CIRBE']
  },

  // =========================================================================
  // CATEGORÍA 5: DESEMBOLSO Y MÉTODOS DE COBRO INSTANTÁNEO
  // =========================================================================
  {
    id: 'kit-desembolso-fondos-iban',
    category: 'desembolso_bizum',
    categoryName: 'Desembolso y Bizum',
    categoryIcon: '💸',
    title: 'Confirmación Oficial de Desembolso Acreditado en Cuenta Digital',
    shortScenario: 'Enviar inmediatamente tras activar el desembolso en la plataforma.',
    badge: 'Fondos Acreditados',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    targetClientState: 'Desembolsado',
    image: {
      src: '/src/assets/images/ws_desembolso_bizum_1790894749766.jpg',
      title: 'Comprobante Oficial de Fondos Desembolsados',
      subtitle: 'Notificación de capital abonado en Cuenta Digital IBAN y disponible para retiro instantáneo por Bizum o SEPA.',
      themeBadge: 'Desembolso Completado',
      relationReason: 'La tarjeta fintech con sellos de Bizum y SEPA confirma de forma gráfica e incontestable que el dinero ya está listo para su uso.'
    },
    getTemplate: ({ clientName, capitalAmount, digitalIban, dueDate, baseUrl }) =>
      `💸 *CONFIRMACIÓN DE DESEMBOLSO REALIZADO* 💸

Hola, *${clientName}*. Te confirmo oficialmente que los fondos correspondientes a tu crédito de *${capitalAmount}* ya han sido acreditados con éxito en tu *Cuenta Digital INSTACREDIT*:

🏛️ *IBAN Digital:* \`${digitalIban}\`
📅 *Fecha de primera cuota:* ${dueDate}

🚀 *Opciones para movilizar tu dinero de inmediato:*
• *Bizum Instantáneo:* Retiro directo a tu número de teléfono móvil registrado en menos de 15 segundos.
• *Transferencia SEPA Instantánea:* A tu cuenta de banco habitual (Santander, BBVA, CaixaBank, ING, etc.).

Accede a tu banca digital para mover los fondos: ${baseUrl}

Agradecemos enormemente tu confianza en nuestra trayectoria y solvencia. ¡Ha sido un placer atenderte!`,
    keyPillar: 'Disponibilidad inmediata de fondos en Cuenta Digital europea.',
    tags: ['Desembolso', 'Fondos Listos', 'IBAN', 'SEPA']
  },

  {
    id: 'kit-desembolso-retiro-bizum',
    category: 'desembolso_bizum',
    categoryName: 'Desembolso y Bizum',
    categoryIcon: '💸',
    title: 'Guía de Retiro Instantáneo por BIZUM en 15 Segundos',
    shortScenario: 'Instrucciones para retirar el saldo disponible a través de Bizum a su número de teléfono.',
    badge: 'Bizum en 15 seg',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    targetClientState: 'Desembolsado',
    image: {
      src: '/src/assets/images/ws_desembolso_bizum_1790894749766.jpg',
      title: 'Retiro Ultra Rápido por Bizum',
      subtitle: 'Transferencia directa a tu teléfono móvil sin esperas bancarias ni comisiones añadidas.',
      themeBadge: 'Bizum España',
      relationReason: 'El logo y la estética de Bizum reflejan la inmediatez española de cobro en 15 segundos en cualquier banco de la red.'
    },
    getTemplate: ({ clientFirstName, capitalAmount, baseUrl }) =>
      `¡Hola, *${clientFirstName}*! 📲⚡ ¿Sabías que puedes retirar tus *${capitalAmount}* directamente por *Bizum* a tu teléfono móvil?

Es la forma más rápida y cómoda de disponer de tu dinero:

1. Ingresa a tu portal: ${baseUrl}
2. Entra en la sección *"Mi Cuenta Digital"*.
3. Selecciona la opción *"Retirar por Bizum"*.
4. Confirma tu número de teléfono móvil.
5. ¡Listo! Recibirás la notificación de Bizum en tu banco en menos de 15 segundos.

Sin comisiones adicionales y con total seguridad bancaria. Si necesitas que te guíe en el proceso, avísame por aquí. 👍`,
    keyPillar: 'Retiro por Bizum en 15 segundos con liquidación interbancaria inmediata.',
    tags: ['Bizum', 'Móvil', 'Retiro Rápido', '15 Segundos']
  },

  {
    id: 'kit-desembolso-sepa-banco',
    category: 'desembolso_bizum',
    categoryName: 'Desembolso y Bizum',
    categoryIcon: '💸',
    title: 'Transferencia SEPA Instantánea a Cuenta Bancaria Tradicional',
    shortScenario: 'Para usuarios que prefieren recibir los fondos en su cuenta de banco principal.',
    badge: 'SEPA Instant',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    targetClientState: 'Desembolsado',
    image: {
      src: '/src/assets/images/ws_desembolso_bizum_1790894749766.jpg',
      title: 'Transferencia SEPA Instantánea del Banco Central Europeo',
      subtitle: 'Conexión directa con la red interbancaria española: abono instantáneo en Santander, BBVA, CaixaBank, etc.',
      themeBadge: 'SEPA Europea',
      relationReason: 'La gráfica técnica del circuito bancario europeo ratifica la validez y solidez de la transferencia SEPA sin comisiones de emisión.'
    },
    getTemplate: ({ clientName, capitalAmount, digitalIban, baseUrl }) =>
      `Estimado(a) *${clientName}*, tus fondos de *${capitalAmount}* están listos para transferir a tu cuenta habitual. 🏦🇪🇸

Puedes emitir una *Transferencia SEPA Instantánea* desde tu Cuenta Digital Instacredit (\`${digitalIban}\`):

• *Destino:* Tu cuenta en tu banco habitual (Santander, BBVA, CaixaBank, Sabadell, Bankinter, ING, etc.).
• *Tiempo de llegada:* Entre 10 y 20 segundos hábiles.
• *Coste:* 0,00 € (Totalmente gratuita para ti).

Accede ahora a tu cuenta para ordenar el traspaso: ${baseUrl}

Si deseas que lo tramitemos conjuntamente, confírmamelo por este chat. ¡Enhorabuena!`,
    keyPillar: 'Red SEPA Instant del Banco Central Europeo con coste cero.',
    tags: ['SEPA Instant', 'Bancos Españoles', 'Sin Comisiones', 'IBAN']
  },

  // =========================================================================
  // CATEGORÍA 6: FLEXIBILIDAD, PRÓRROGAS Y GESTIÓN PREVENTIVA
  // =========================================================================
  {
    id: 'kit-recordatorio-preventivo-48h',
    category: 'flexibilidad_prorrogas',
    categoryName: 'Prórrogas y Flexibilidad',
    categoryIcon: '⏱️',
    title: 'Recordatorio Preventivo Amistoso de Vencimiento (48 Horas)',
    shortScenario: 'Contacto preventivo y respetuoso conforme a la Ley 2300 para recordar la fecha de pago.',
    badge: 'Aviso 48 Horas',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    targetClientState: 'Desembolsado',
    image: {
      src: '/src/assets/images/ws_prorroga_fidelidad_1790894773902.jpg',
      title: 'Gestión Financiera Responsable y Puntualidad',
      subtitle: 'Aviso preventivo para proteger tu historial crediticio positivo y mantener tu cupo activo.',
      themeBadge: 'Acompañamiento Amable',
      relationReason: 'La imagen del calendario con días adicionales y sello positivo aleja el temor a cobros agresivos, transmitiendo un tono amigable de apoyo mutuo.'
    },
    getTemplate: ({ clientFirstName, advisorName, radicadoId, dueDate, baseUrl }) =>
      `Hola, *${clientFirstName}*. Te saluda *${advisorName}* de *INSTACREDIT*. 🗓️✨

Nos comunicamos contigo de manera preventiva y cordial para recordarte que tu préstamo *#${radicadoId}* tiene fecha de vencimiento fijada para el próximo *${dueDate}*.

💳 *Canales habilitados para tu comodidad:*
1. *Bizum al instante:* Desde tu portal con confirmación inmediata.
2. *Transferencia bancaria ordinaria:* Con el número de expediente como concepto.
3. *Pago con tarjeta de débito:* En 1 clic desde tu panel.

👉 Acceso directo a tu portal de pago: ${baseUrl}

Si por cualquier imprevisto no dispones de la liquidez completa, recuerda que tenemos la opción de *Extensión de Plazo* para que no afecte tu historial. ¡Estoy a tu orden!`,
    keyPillar: 'Recordatorio preventivo empático y respetuoso sin hostigamiento.',
    tags: ['Vencimiento', '48 Horas', 'Preventivo', 'Bizum']
  },

  {
    id: 'kit-prorroga-extension-plazo',
    category: 'flexibilidad_prorrogas',
    categoryName: 'Prórrogas y Flexibilidad',
    categoryIcon: '⏱️',
    title: 'Activación de Prórroga / Extensión de Plazo por 15 o 30 Días',
    shortScenario: 'Cuando el cliente manifiesta no tener el dinero completo y desea aplazar el pago.',
    badge: 'Extensión 15/30d',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    targetClientState: 'Desembolsado',
    image: {
      src: '/src/assets/images/ws_prorroga_fidelidad_1790894773902.jpg',
      title: 'Certificado de Extensión de Plazo sin Penalizaciones',
      subtitle: 'Aplazamiento formal de capital por 15 o 30 días cancelando únicamente los cargos del período.',
      themeBadge: 'Flexibilidad de Pago',
      relationReason: 'El certificado visual de extensión con el icono de calendario y garantía sin penalizaciones da certidumbre de que su historial se mantendrá intacto.'
    },
    getTemplate: ({ clientFirstName, advisorName, baseUrl }) =>
      `Don/doña *${clientFirstName}*, entiendo perfectamente la situación. En *INSTACREDIT* estamos precisamente para brindarte soluciones y cuidar tu tranquilidad. 🤝🛡️

Contamos con la opción de *Prórroga / Extensión de Plazo por 15 o 30 días adicionales*.

🌟 *¿Cómo te beneficia?*
• Al abonar únicamente los costes y fianza del período, postergamos la devolución del capital por un mes más.
• Tu historial crediticio se mantiene *100% positivo y al día* ante ASNEF y Banco de España.
• Cero penalizaciones ni comisiones moratorias abusivas.

Puedes activarla en 2 minutos desde tu portal web seleccionando la pestaña *"Cómo extender"* o avísame y te genero el enlace directo por Bizum. ¡Cuenta con nosotros!`,
    keyPillar: 'Solución preventiva de morosidad que protege el score crediticio.',
    tags: ['Prórroga', 'Extensión', '15 Días', '30 Días', 'ASNEF']
  },

  {
    id: 'kit-pago-anticipado-sin-multas',
    category: 'flexibilidad_prorrogas',
    categoryName: 'Prórrogas y Flexibilidad',
    categoryIcon: '⏱️',
    title: 'Amortización Anticipada sin Multas ni Penalizaciones (Ley 16/2011)',
    shortScenario: 'Para usuarios que desean liquidar su deuda antes de tiempo con descuento de intereses.',
    badge: 'Amortización 0% Multa',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    targetClientState: 'Desembolsado',
    image: {
      src: '/src/assets/images/ws_seguridad_antifraude_1790894760624.jpg',
      title: 'Transparencia Precontractual y Pago Anticipado Legal',
      subtitle: 'Derecho a liquidar total o parcialmente el préstamo en cualquier momento con reliquidación diaria de intereses.',
      themeBadge: 'Derecho del Consumidor',
      relationReason: 'El sello de garantía legal respalda el derecho del cliente a cancelar su deuda sin penalizaciones y con reliquidación favorable al instante.'
    },
    getTemplate: ({ clientFirstName, radicadoId, baseUrl }) =>
      `¡Excelente iniciativa, *${clientFirstName}*! 👏

En cumplimiento estricto del Art. 30 de la *Ley 16/2011 de Contratos de Crédito al Consumo*, en *INSTACREDIT*:
• Puedes pagar anticipadamente tu crédito *#${radicadoId}* en cualquier momento.
• *Cero multas, penalizaciones o recargos* por cancelación anticipada.
• Se te reliquidan de inmediato los intereses al día exacto en que realizas el pago, ahorrándote costes financieros.

Para consultar el importe exacto con intereses descontados a fecha de hoy, accede a tu perfil: ${baseUrl} o dime si prefieres que te genere el enlace por Bizum.`,
    keyPillar: 'Amortización anticipada sin penalización conforme a la Ley 16/2011.',
    tags: ['Pago Anticipado', 'Sin Multas', 'Ahorro Intereses', 'Ley 16/2011']
  },

  // =========================================================================
  // CATEGORÍA 7: FIDELIZACIÓN Y AUMENTO DE LÍMITE CREDITICIO
  // =========================================================================
  {
    id: 'kit-fidelizacion-cupo-vip',
    category: 'fidelizacion_cupo',
    categoryName: 'Fidelización y Cupo',
    categoryIcon: '⭐',
    title: 'Desbloqueo de Cupo VIP hasta 5.000 € por Pago Puntual',
    shortScenario: 'Enviar tras la cancelación exitosa de la primera operación.',
    badge: 'Cupo VIP 5.000 €',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    targetClientState: 'Desembolsado',
    image: {
      src: '/src/assets/images/ws_prorroga_fidelidad_1790894773902.jpg',
      title: 'Distinción al Cliente Cumplido y Aumento de Cupo',
      subtitle: 'Insignia de cliente VIP con desembolso exprés en 5 minutos y límite crediticio ampliado hasta 5.000 €.',
      themeBadge: 'Cliente Preferente VIP',
      relationReason: 'La insignia dorada y el indicador de subida de nivel premian visualmente la lealtad y el cumplimiento puntual del cliente.'
    },
    getTemplate: ({ clientFirstName, advisorName, baseUrl }) =>
      `🌟 *¡FELICIDADES, ${clientFirstName.toUpperCase()}! HAS DESBLOQUEADO CUPO VIP* 🌟

Te saluda *${advisorName}* de *INSTACREDIT*. Hemos registrado la liquidación impecable de tu crédito anterior y tu calificación en nuestro sistema ha alcanzado el nivel de *Cliente Preferente*.

🎁 *Beneficios exclusivos asignados a tu perfil:*
1. Cupo pre-aprobado ampliado de hasta *5.000,00 €*.
2. Aprobación exprés automática en tan solo *5 minutos*.
3. Descuento del 10% vitalicio en costes de gestión y fianza.
4. Desembolso directo por Bizum sin necesidad de volver a enviar documentación.

Cuando desees activar tu nuevo crédito, solo ingresa a tu panel: ${baseUrl} o escríbeme directamente por aquí. ¡Gracias por confiar en nosotros!`,
    keyPillar: 'Programa de fidelización y premiación al comportamiento de pago puntual.',
    tags: ['VIP', 'Aumento Cupo', '5.000 €', 'Cliente Cumplido']
  },

  {
    id: 'kit-fidelizacion-descuento-fianza',
    category: 'fidelizacion_cupo',
    categoryName: 'Fidelización y Cupo',
    categoryIcon: '⭐',
    title: 'Descuento del 10% en Fianza para Nueva Solicitud',
    shortScenario: 'Campaña de reactivación para clientes satisfechos con historial positivo.',
    badge: 'Descuento 10%',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    targetClientState: 'Cualquiera',
    image: {
      src: '/src/assets/images/fb_lifestyle_entrepreneur_1790893984324.jpg',
      title: 'Tarifas Reducidas y Preferenciales para Clientes Habituales',
      subtitle: 'Ahorro directo en la formalización de nuevos créditos de circulante y proyectos personales.',
      themeBadge: 'Ahorro Preferencial',
      relationReason: 'Conecta el crecimiento económico con un ahorro tangible en costes de formalización financiera.'
    },
    getTemplate: ({ clientFirstName, advisorName, baseUrl }) =>
      `Hola, *${clientFirstName}*. Te escribe *${advisorName}* de *INSTACREDIT España*. 💼🎁

Por ser un cliente ejemplar, te hemos activado un cupón preferente con un *10% de descuento directo* en la fianza de cualquier nueva solicitud que radicas este mes.

✨ *Condiciones activas en tu perfil:*
• Sin papeleos ni nuevas comprobaciones laborales.
• Desde 2.000 € hasta 10.000 € con plazos a tu medida.
• Dinero disponible en tu Cuenta Digital IBAN en menos de 15 minutos.

¿Tienes algún nuevo proyecto o imprevisto en mente? Accede a tu área de cliente y simula con tu tarifa reducida: ${baseUrl}`,
    keyPillar: 'Incentivos de fidelización con reducción de costes contractuales.',
    tags: ['Descuento 10%', 'Fianza', 'Reactivación', 'Tarifa Reducida']
  },

  {
    id: 'kit-fidelizacion-reformas-familia',
    category: 'fidelizacion_cupo',
    categoryName: 'Fidelización y Cupo',
    categoryIcon: '⭐',
    title: 'Financiación Especial para Reformas del Hogar o Proyectos Familiares',
    shortScenario: 'Propuesta de valor para mejoras del hogar, vehículos o estudios.',
    badge: 'Proyectos Hogar',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    targetClientState: 'Cualquiera',
    image: {
      src: '/src/assets/images/fb_lifestyle_family_1790893967984.jpg',
      title: 'Financiación para el Bienestar y Mejoras Familiares',
      subtitle: 'Plazos flexibles y cuotas mensuales adaptadas a la economía del hogar.',
      themeBadge: 'Hogar y Familia',
      relationReason: 'La fotografía de una familia feliz en su hogar conecta directamente con la aspiración de reformar la vivienda o cubrir proyectos de vida.'
    },
    getTemplate: ({ clientName, advisorName, baseUrl }) =>
      `Estimado(a) *${clientName}*, te saluda *${advisorName}* de *INSTACREDIT*. 🏡❤️

En nuestra entidad acompañamos los proyectos que de verdad importan: renovar tu cocina, acondicionar el hogar, reparar el coche o financiar los estudios de tus hijos.

Ponemos a tu disposición nuestra línea especial de *Crédito Familia & Hogar*:
• Financiación de hasta 5.000 € con cuotas mensuales comodísimas.
• Aprobación en menos de 30 minutos sin cambiar de banco.
• Desembolso inmediato a tu Cuenta Digital o por Bizum.

¿Te gustaría que te prepare una simulación personalizada sin ningún compromiso? Puedes responder a este mensaje o ingresar a: ${baseUrl}`,
    keyPillar: 'Crédito con propósito social enfocado en bienestar del hogar.',
    tags: ['Familia', 'Hogar', 'Reformas', 'Cuotas Cómodas']
  },

  // =========================================================================
  // CATEGORÍA 8: RECORDATORIOS POR SI EL CLIENTE NO RESPONDE (SEGUIMIENTO ACTIVO)
  // =========================================================================
  {
    id: 'kit-no-responde-2-horas',
    category: 'recordatorio_no_responde',
    categoryName: 'Si el Cliente No Responde',
    categoryIcon: '🔔',
    title: 'Recordatorio 1: Cliente No Responde tras 2 Horas (Cupo Reservado)',
    shortScenario: 'Enviar cuando el cliente dejó el chat en visto hace 2 horas sin terminar la verificación.',
    badge: 'No Responde (2h)',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/ws_recordatorio_no_responde_1791520687571.jpg',
      title: 'Expediente Reservado - Seguimos a tu Disposición',
      subtitle: 'Tarjeta visual oficial que confirma que los fondos siguen apartados a nombre del titular esperando su confirmación.',
      themeBadge: 'Reserva Activa 24h',
      relationReason: 'La imagen muestra el expediente preaprobado en espera de confirmación, reactivando la atención del cliente sin presionarlo.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId, baseUrl }) =>
      `¡Hola de nuevo, *${clientFirstName}*! 🔔 Te saluda *${advisorName}*, tu asesor asignado en *INSTACREDIT España*.

Sé que a veces con el trabajo o las ocupaciones del día es difícil contestar al momento, por eso te escribo brevemente para darte tranquilidad:

✅ *Mantenemos reservada tu partida de ${capitalAmount}* bajo tu expediente oficial *#${radicadoId}*.

Solo nos falta un pequeño paso de 2 minutos para pasar tu expediente a transferencia hoy mismo. Puedes completarlo directamente desde este enlace oficial:

👉 *Enlace Directo de Verificación y Solicitud:*
${baseUrl}/?form=solicitud&exp=${radicadoId}

¿Prefieres completarlo tú mismo en el enlace o que te ayude por aquí paso a paso? Quedo pendiente de ti. 🤝🇪🇸`,
    keyPillar: 'Reactivación empática a las 2 horas con enlace directo autogestionable.',
    tags: ['No Responde', '2 Horas', 'Visto', 'Seguimiento', 'Reserva']
  },

  {
    id: 'kit-no-responde-falta-documento',
    category: 'recordatorio_no_responde',
    categoryName: 'Si el Cliente No Responde',
    categoryIcon: '🔔',
    title: 'Recordatorio 2: Cliente No Responde al Pedirle DNI/NIE o IBAN (6 Horas)',
    shortScenario: 'Enviar cuando el cliente se detuvo justo en el momento de enviar su DNI/NIE o certificar su cuenta IBAN.',
    badge: 'Falta Verificación (6h)',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-300',
    targetClientState: 'En Revisión',
    image: {
      src: '/src/assets/images/ws_verificacion_formularios_url_1791520696726.jpg',
      title: 'Portal de Verificación Rápida DNI/NIE e IBAN SEPA',
      subtitle: 'Alternativa 100% digital mediante enlace directo para clientes que prefieren validar sus datos en el formulario oficial con voz.',
      themeBadge: 'Verificación en 1 Clic',
      relationReason: 'Ofrece una solución visual inmediata con los 3 sellos de seguridad (DNI/NIE, IBAN SEPA y eIDAS) para destrabar el miedo o la pereza documental.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId, baseUrl }) =>
      `Estimado(a) *${clientFirstName}*, te escribe *${advisorName}* de la mesa de verificación de *INSTACREDIT España*. 📋🛡️

Tenemos tu solicitud *#${radicadoId}* por *${capitalAmount}* al *90% de avance*, detenida únicamente a la espera de validar tu titularidad bancaria IBAN.

💡 *Para que no tengas que adjuntar documentos sueltos, te he activado este enlace directo con asistencia por voz:*

🔗 *Formulario Directo de Certificación Bancaria IBAN (SEPBLAC):*
${baseUrl}/?form=iban&exp=${radicadoId}

🔒 *Seguridad Bancaria:* Únicamente certificamos que el código IBAN \`ES...\` está a tu nombre como titular para depositarte el dinero en tu cuenta creada.

En cuanto lo envíes, me salta el aviso en pantalla para aprobarte. ¡Te espero! 👇`,
    keyPillar: 'Sustitución de fricción documental por enlace directo asistido por voz.',
    tags: ['No Responde', 'Falta IBAN', 'Falta DNI', '6 Horas', 'Enlace Directo']
  },

  {
    id: 'kit-no-responde-aprobado-sin-firma',
    category: 'recordatorio_no_responde',
    categoryName: 'Si el Cliente No Responde',
    categoryIcon: '🔔',
    title: 'Recordatorio 3: Préstamo Aprobado pero el Cliente No Ha Firmado eIDAS (12h)',
    shortScenario: 'Cuando el cliente ya fue aprobado pero no ha entrado al enlace de firma digital del contrato y pagaré.',
    badge: 'Falta Firma eIDAS (12h)',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    targetClientState: 'Aprobado',
    image: {
      src: '/src/assets/images/ws_recordatorio_no_responde_1791520687571.jpg',
      title: 'Crédito Aprobado Esperando tu Aceptación Final',
      subtitle: 'Tus fondos ya están autorizados por el comité y aguardan únicamente la rúbrica electrónica eIDAS.',
      themeBadge: 'Listo para Desembolso',
      relationReason: 'Visualiza en la pantalla del teléfono el estado "Expediente Aprobado - Esperando Confirmación", motivando el cierre inmediato.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId, digitalIban, baseUrl }) =>
      `🔔 *AVISO DE TESORERÍA: TUS ${capitalAmount} ESTÁN APROBADOS ESPERANDO FIRMA* 🔔

Hola, *${clientFirstName}*. Te saluda *${advisorName}* de *INSTACREDIT España*.

Te escribo porque tu préstamo *#${radicadoId}* por *${capitalAmount}* ya está *100% APROBADO* y asignado a tu Cuenta Digital (\`${digitalIban}\`), pero aún no nos figura tu firma electrónica en el contrato.

✍️ *Entra ahora a este enlace directo para firmar con el dedo desde tu móvil en 1 minuto:*
${baseUrl}/?form=cuota_firma&exp=${radicadoId}

📄 También puedes revisar y descargar tus 4 Contratos Oficiales de 4 páginas aquí:
${baseUrl}/?ver_contratos=${radicadoId}

Apenas pulses *"Firmar y Confirmar"*, ordenamos el abono inmediato por SEPA / Bizum. ¡Avísame por aquí! 🚀`,
    keyPillar: 'Recuperación de clientes aprobados pendientes de firma contractual.',
    tags: ['No Responde', 'Aprobado sin Firma', '12 Horas', 'Firma eIDAS']
  },

  {
    id: 'kit-no-responde-ultimo-aviso-24h',
    category: 'recordatorio_no_responde',
    categoryName: 'Si el Cliente No Responde',
    categoryIcon: '🔔',
    title: 'Recordatorio 4: Último Aviso 24h antes de Liberar Reserva de Fondos',
    shortScenario: 'Último mensaje formal tras 24 horas sin respuesta antes de archivar temporalmente la solicitud.',
    badge: 'Último Aviso 24h',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-300',
    targetClientState: 'Cualquiera',
    image: {
      src: '/src/assets/images/ws_recordatorio_no_responde_1791520687571.jpg',
      title: 'Últimas Horas de Garantía de Reserva de Fondos (24h)',
      subtitle: 'Notificación formal antes de liberar la partida de liquidez asignada al expediente del solicitante.',
      themeBadge: 'Cierre de Reserva',
      relationReason: 'El sello de Garantía de Reserva 24h refuerza que el cupo es real y tiene un tiempo límite de custodia financiera.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId, baseUrl }) =>
      `⏳ *ÚLTIMO AVISO DE RESERVA DE FONDOS — EXPEDIENTE #${radicadoId}*

Estimado(a) *${clientFirstName}*, te contacta *${advisorName}* del Departamento de Formalización de *INSTACREDIT España*.

Cumplidas las 24 horas de custodia de tu cupo reservado por *${capitalAmount}*, nuestro sistema liberará automáticamente los fondos en las próximas *2 horas* si no registramos movimiento.

✅ *Si aún necesitas el dinero y deseas mantener tu aprobación prioritaria:*
1️⃣ Responde con la palabra *"MANTENER"* a este mensaje, o
2️⃣ Completa tu paso pendiente directamente en tu enlace personal:
👉 ${baseUrl}/?form=solicitud&exp=${radicadoId}

Si ya has resuelto tu necesidad económica por otra vía, no tienes que hacer nada y tu expediente se cerrará sin ningún coste ni compromiso para ti. ¡Un cordial saludo! 🇪🇸`,
    keyPillar: 'Cierre ético con gatillo de urgencia real a las 24 horas.',
    tags: ['Último Aviso', '24 Horas', 'No Responde', 'Cierre Reserva']
  },

  // =========================================================================
  // CATEGORÍA 9: URLS DIRECTAS DE VERIFICACIÓN, ENCUESTAS Y FORMULARIOS
  // =========================================================================
  {
    id: 'kit-url-directa-encuesta-solvencia',
    category: 'verificacion_urls_encuestas',
    categoryName: 'URLs Directas y Encuestas',
    categoryIcon: '🔗',
    title: 'Envío de URL Directa: Encuesta Oficial de Solvencia y Estudio Precontractual (FORM-01)',
    shortScenario: 'Enviar el enlace directo para que el cliente complete la encuesta de ingresos, finalidad y simulación INE.',
    badge: 'URL Encuesta Solvencia',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
    targetClientState: 'Pendiente',
    image: {
      src: '/src/assets/images/ws_verificacion_formularios_url_1791520696726.jpg',
      title: 'Encuesta Oficial de Solvencia y Verificación Rápida (Ley 16/2011)',
      subtitle: 'Formulario interactivo asistido por voz para declarar finalidad del préstamo, ingresos mensuales y plazo.',
      themeBadge: 'URL Directa FORM-01',
      relationReason: 'La tarjeta oficial del Portal de Verificación y Encuesta de Solvencia indica claramente al usuario qué verá al abrir el link.'
    },
    getTemplate: ({ clientFirstName, advisorName, capitalAmount, radicadoId, baseUrl }) =>
      `📋 *ENCUESTA RÁPIDA DE SOLVENCIA Y VERIFICACIÓN DE DATOS (#${radicadoId})*

Hola, *${clientFirstName}*. Te saluda *${advisorName}* de *INSTACREDIT España*.

De acuerdo con la *Ley 16/2011 de Contratos de Crédito al Consumo*, para emitir tu resolución oficial sobre los *${capitalAmount}* necesitamos que completes esta breve encuesta y verificación de 4 puntos (toma menos de 90 segundos y cuenta con ayuda por voz 🔊):

🔗 *1. Pulsa en tu URL Directa de Verificación y Encuesta:*
${baseUrl}/?form=solicitud&exp=${radicadoId}

📌 *¿Qué confirmarás dentro del enlace?*
• Importe exacto deseado y número de cuotas mensuales.
• Finalidad del crédito (Hogar, Salud, Vehículo, Autónomos, etc.).
• Confirmación de DNI/NIE y teléfono móvil en España.

Cuando pulses el botón verde *"Enviar Confirmación"* al final del formulario, me llegará al instante. 👇`,
    keyPillar: 'URL directa lista para enviar con encuesta precontractual Ley 16/2011.',
    tags: ['URL Directa', 'Encuesta Solvencia', 'Verificación', 'Formulario 1']
  },

  {
    id: 'kit-url-directa-verificacion-iban',
    category: 'verificacion_urls_encuestas',
    categoryName: 'URLs Directas y Encuestas',
    categoryIcon: '🔗',
    title: 'Envío de URL Directa: Certificación de Titularidad Bancaria IBAN y Bizum (FORM-02)',
    shortScenario: 'Enviar la URL directa del formulario bancario para verificar el IBAN español bajo Ley 10/2010 SEPBLAC.',
    badge: 'URL Verificación IBAN',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    targetClientState: 'En Revisión',
    image: {
      src: '/src/assets/images/ws_verificacion_formularios_url_1791520696726.jpg',
      title: 'Validación Bancaria SEPA y Activación de Abono por Bizum',
      subtitle: 'Enlace cifrado para registrar el código IBAN español (ES...) y certificar titularidad única sin intermediarios.',
      themeBadge: 'URL Directa FORM-02',
      relationReason: 'Destaca el sello central "IBAN SEPA VALIDADO", dando confianza bancaria al cliente antes de hacer clic en la URL.'
    },
    getTemplate: ({ clientFirstName, capitalAmount, radicadoId, baseUrl }) =>
      `🏦 *ENLACE OFICIAL DE VERIFICACIÓN BANCARIA IBAN Y BIZUM (#${radicadoId})*

Estimado(a) *${clientFirstName}*, para vincular tu banco habitual en España y dejar programado el desembolso de tus *${capitalAmount}*, ingresa a tu formulario directo de titularidad bancaria:

🔗 *URL Directa — Formulario 2 (Validación IBAN SEPA):*
${baseUrl}/?form=iban&exp=${radicadoId}

🛡️ *Seguridad Bancaria Garantizada:*
• Cumplimiento estricto de la Ley 10/2010 (SEPBLAC).
• Incluye botón de *Lectura en Voz Alta (🔊)* y letra ampliada.
• Puedes elegir recibir el dinero por *Transferencia SEPA Instantánea* o *Bizum*.

Avísame por aquí apenas lo envíes. 🇪🇸✅`,
    keyPillar: 'Enlace directo para validación de cuenta IBAN y activación de Bizum.',
    tags: ['URL Directa', 'IBAN SEPA', 'Bizum', 'SEPBLAC', 'Formulario 2']
  },

  {
    id: 'kit-url-directa-firma-contratos-4pags',
    category: 'verificacion_urls_encuestas',
    categoryName: 'URLs Directas y Encuestas',
    categoryIcon: '🔗',
    title: 'Envío de URL Directa: Firma Electrónica eIDAS + Visor de Contratos de 4 Páginas (FORM-03)',
    shortScenario: 'Enviar los enlaces directos para que el cliente lea sus 4 documentos legales de 4 páginas y firme con OTP.',
    badge: 'URL Firma + Contratos',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    targetClientState: 'Aprobado',
    image: {
      src: '/src/assets/images/ws_verificacion_formularios_url_1791520696726.jpg',
      title: 'Firma Electrónica Reconocida eIDAS y Documentos Legales',
      subtitle: 'Acceso directo al recuadro de firma táctil, validación OTP y descarga de los 5 contratos de 4 páginas.',
      themeBadge: 'URL Directa FORM-03',
      relationReason: 'Resalta el sello "FIRMA ELECTRÓNICA eIDAS RECONOCIDA" junto al candado de seguridad europea.'
    },
    getTemplate: ({ clientFirstName, capitalAmount, radicadoId, baseUrl }) =>
      `✍️ *ENLACES DIRECTOS: CONTRATOS LEGALES (4 PÁGINAS) Y FIRMA DIGITAL eIDAS*

Hola, *${clientFirstName}*. Te comparto los enlaces oficiales de tu expediente *#${radicadoId}* por *${capitalAmount}* para tu total transparencia y seguridad jurídica:

📄 *1. URL para Leer y Descargar tus Contratos Oficiales (4 Páginas c/u):*
${baseUrl}/?ver_contratos=${radicadoId}
*(Incluye: Contrato de Préstamo Ley 16/2011, Condiciones Generales Cuenta Digital, Política RGPD, Consentimiento ASNEF/CIRBE y Pagaré eIDAS).*

✍️ *2. URL Directa para Firmar con el Dedo y Código OTP en 1 Minuto:*
${baseUrl}/?form=cuota_firma&exp=${radicadoId}

Cualquier cláusula que desees que te explique por teléfono o nota de voz, dímelo con total confianza. 🤝🇪🇸`,
    keyPillar: 'Transparencia documental completa con enlaces directos a contratos de 4 páginas y firma.',
    tags: ['URL Directa', 'Contratos 4 Páginas', 'Firma eIDAS', 'Formulario 3']
  },

  {
    id: 'kit-url-directa-prorroga-y-sac',
    category: 'verificacion_urls_encuestas',
    categoryName: 'URLs Directas y Encuestas',
    categoryIcon: '🔗',
    title: 'Envío de URL Directa: Solicitud de Prórroga (FORM-04) y Encuesta de Calidad / SAC (FORM-05)',
    shortScenario: 'Enviar enlaces directos de posventa para aplazar cuotas sin recargos o calificar la atención del asesor.',
    badge: 'URLs Prórroga y Encuesta',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
    targetClientState: 'Desembolsado',
    image: {
      src: '/src/assets/images/ws_prorroga_fidelidad_1790894773902.jpg',
      title: 'Portal de Autogestión: Prórrogas, Banca Digital y Encuesta de Satisfacción',
      subtitle: 'Enlaces directos para gestionar el préstamo activo sin esperas telefónicas.',
      themeBadge: 'URLs Posventa Oficiales',
      relationReason: 'Muestra las herramientas de flexibilidad y fidelización disponibles mediante acceso directo.'
    },
    getTemplate: ({ clientFirstName, advisorName, radicadoId, baseUrl }) =>
      `🌟 *TUS ENLACES DIRECTOS DE AUTOGESTIÓN Y ENCUESTA — EXPEDIENTE #${radicadoId}*

Hola, *${clientFirstName}*. Te saluda *${advisorName}* de *INSTACREDIT España*. Guarda este mensaje en tus destacados para tener siempre a mano tus accesos directos oficiales:

🏦 *1. Portal de Tu Cuenta Digital IBAN (Retiros SEPA / Bizum):*
${baseUrl}/?banca_digital=${radicadoId}

⏱️ *2. Formulario Directo de Prórroga de 15, 30 o 45 Días (Sin ASNEF):*
${baseUrl}/?form=prorroga&exp=${radicadoId}

🛡️ *3. Formulario Oficial de Consultas, Encuesta y Atención al Cliente (SAC BdE):*
${baseUrl}/?form=reclamacion&exp=${radicadoId}

¡Gracias por permitirnos acompañarte! 🇪🇸✨`,
    keyPillar: 'Ecosistema completo de URLs directas para autogestión del cliente.',
    tags: ['URL Directa', 'Prórroga', 'Encuesta Calidad', 'SAC', 'Banca Digital']
  }
];
