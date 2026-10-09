export interface AdvisorRule {
  id: string;
  number: number;
  title: string;
  category: 'Legal' | 'Operativa' | 'Seguridad' | 'Servicio';
  rule: string;
  impact: string;
}

export interface AdvisorScript {
  id: string;
  title: string;
  scenario: string;
  channel: 'Llamada Telefónica' | 'WhatsApp Oficial' | 'Ambos';
  goal: string;
  dialogue: Array<{
    speaker: 'Asesor' | 'Cliente';
    text: string;
    internalNote?: string;
  }>;
  keyAdvice: string[];
}

export const ADVISOR_RULES: AdvisorRule[] = [
  {
    id: 'rule-1',
    number: 1,
    title: 'CERO COBROS O ANTICIPOS PREVIOS',
    category: 'Legal',
    rule: 'Bajo ninguna circunstancia se debe solicitar dinero, consignaciones, depósitos o transferencias previas al cliente para "desbloquear", "agilizar" o "desembolsar" un crédito. Instacredit jamás cobra por adelantado.',
    impact: 'El cobro anticipado constituye una infracción gravísima a la Ley 1480 de 2011 y tipifica estafa conforme al Código Penal.'
  },
  {
    id: 'rule-2',
    number: 2,
    title: 'EXPLICACIÓN CLARA DEL SALDO EN $0 COP DE LA CUENTA DIGITAL',
    category: 'Operativa',
    rule: 'Instruir al cliente que toda Cuenta Digital Instacredit se crea con saldo inicial en $0 COP de manera independiente. El saldo disponible únicamente se incrementa tras la aprobación y desembolso por parte del comité de crédito o mediante recarga del usuario por PSE.',
    impact: 'Evita reclamos por confusión de saldo disponible y refuerza la confianza en la funcionalidad de banca digital.'
  },
  {
    id: 'rule-3',
    number: 3,
    title: 'VERIFICACIÓN SARLAFT DE TITULARIDAD BANCARIA',
    category: 'Seguridad',
    rule: 'El desembolso sólo puede ser transferido a una cuenta o billetera digital (Nequi, Daviplata, Bancolombia, etc.) de la exclusiva titularidad del solicitante con su misma cédula. Queda terminantemente prohibido desembolsar a cuentas de terceros o familiares.',
    impact: 'Cumplimiento estricto de las directrices de la UIAF y la SFC para prevención del Lavado de Activos y Suplantación.'
  },
  {
    id: 'rule-4',
    number: 4,
    title: 'CUMPLIMIENTO DE LEY 2300 DE 2023 (DEJEN DE FREGAR)',
    category: 'Legal',
    rule: 'Las comunicaciones de cobranza o seguimiento sólo pueden realizarse de Lunes a Viernes de 7:00 a.m. a 7:00 p.m., y Sábados de 8:00 a.m. a 3:00 p.m. Queda prohibido contactar domingos, festivos o realizar más de 2 contactos por semana sobre la misma obligación.',
    impact: 'Sanciones severas de la SIC por hostigamiento o contacto en días inhábiles.'
  },
  {
    id: 'rule-5',
    number: 5,
    title: 'TRANSPARENCIA PRECONTRACTUAL DE COSTOS (SIC)',
    category: 'Servicio',
    rule: 'El asesor debe desglosar verbalmente y por escrito: Capital, Interés remuneratorio legal (0.0717% día / 2.15% MV), Aval FGA (12%), Tecnología y firma digital ($27.500) e IVA (19%). Nunca presentar estos costos como "cargos ocultos".',
    impact: 'Garantiza el consentimiento informado del consumidor financiero conforme a la Circular SIC.'
  },
  {
    id: 'rule-6',
    number: 6,
    title: 'INFORMACIÓN OBLIGATORIA DEL DERECHO DE RETRACTO (5 DÍAS)',
    category: 'Legal',
    rule: 'Informar al usuario que conforme al Art. 47 de la Ley 1480 de 2011 cuenta con cinco (5) días hábiles siguientes al desembolso para retractarse sin penalidades, devolviendo el capital transferido.',
    impact: 'Protección constitucional del consumidor en comercio electrónico.'
  },
  {
    id: 'rule-7',
    number: 7,
    title: 'DERECHO AL PAGO ANTICIPADO SIN MULTAS (LEY 1555)',
    category: 'Legal',
    rule: 'Indicar que el cliente puede pagar anticipadamente la totalidad o cuotas parciales en cualquier momento con reliquidación inmediata de intereses al día del pago, sin incurrir en sanciones o cobros de penalidad.',
    impact: 'Erradica prácticas restrictivas y fomenta la fidelización de clientes puntuales.'
  },
  {
    id: 'rule-8',
    number: 8,
    title: 'PREAVISO DE 20 DÍAS PARA REPORTE NEGATIVO',
    category: 'Legal',
    rule: 'Antes de realizar cualquier reporte negativo ante Datacrédito Experian o TransUnion, debe notificarse al deudor con al menos 20 días calendario de antelación vía correo electrónico o SMS (Art. 12 Ley 1266 de 2008).',
    impact: 'Evita tutelas y multas de la Delegatura de Protección de Datos Personales de la SIC.'
  },
  {
    id: 'rule-9',
    number: 9,
    title: 'OFRECIMIENTO PROACTIVO DE PRÓRROGA / EXTENSIÓN',
    category: 'Operativa',
    rule: 'Si el cliente manifiesta no contar con la liquidez completa al vencimiento, ofrecer de inmediato la opción de extensión de 15 o 30 días cancelando únicamente los cargos del período para proteger su historial positivo.',
    impact: 'Reduce la cartera vencida en un 38% y conserva al cliente activo sin reportes desfavorables.'
  },
  {
    id: 'rule-10',
    number: 10,
    title: 'MANEJO ÉTICO, RESPETO Y NO COACCIÓN',
    category: 'Servicio',
    rule: 'Mantener un tono empático, profesional y conciliador. Queda prohibido amenazar con embargos no iniciados, contactar referencias familiares para cobrar o vulnerar la intimidad del ciudadano.',
    impact: 'Reputación de marca y código ético de Colombia Fintech.'
  }
];

export const ADVISOR_SCRIPTS: AdvisorScript[] = [
  {
    id: 'script-1',
    title: 'Apertura y Validación Inicial de Identidad (Hábeas Data y SARLAFT)',
    scenario: 'Llamada entrante o primer contacto por WhatsApp de un usuario interesado en solicitar crédito.',
    channel: 'Ambos',
    goal: 'Presentarse profesionalmente, validar identidad del titular y autorizaciones de consulta.',
    dialogue: [
      {
        speaker: 'Asesor',
        text: '¡Muy buenos días/tardes! Le saluda [Nombre del Asesor] de INSTACREDIT Colombia. Es un placer atenderle. ¿Con quién tengo el gusto de hablar hoy?',
        internalNote: 'Tono cálido, vocalización clara y saludo institucional.'
      },
      {
        speaker: 'Cliente',
        text: 'Hola, buenas tardes. Habla con [Nombre del Cliente]. Quisiera saber si me pueden prestar plata hoy mismo.',
        internalNote: 'Escuchar activamente el motivo y la urgencia del cliente.'
      },
      {
        speaker: 'Asesor',
        text: '¡Claro que sí, don/doña [Nombre]! En INSTACREDIT le ofrecemos desembolsos desde $100.000 hasta $2.500.000 COP en tan solo 20 minutos directo a su Cuenta Digital o cuenta bancaria. Para asesorarle con total seguridad y conforme a la Ley de Hábeas Data 1266 de 2008, ¿me confirma por favor su número de cédula y departamento de residencia?',
        internalNote: 'Validar en pantalla el radicado y consultar el historial en el sistema.'
      }
    ],
    keyAdvice: [
      'Nunca solicite la clave personal del banco del cliente.',
      'Verifique que el número telefónico de contacto coincida con el radicado registrado en el sistema.'
    ]
  },
  {
    id: 'script-2',
    title: 'Explicación del Funcionamiento de la Cuenta Digital y Saldo Inicial en $0',
    scenario: 'El cliente pregunta por qué ve su Cuenta Digital en $0 COP tras registrarse o cómo le llegará el dinero.',
    channel: 'Ambos',
    goal: 'Aclarar con total transparencia la naturaleza bancaria digital y el proceso de fondeo.',
    dialogue: [
      {
        speaker: 'Cliente',
        text: 'Mire señorita/joven, me acabo de registrar y me salió un número de cuenta, pero dice saldo $0. ¿Dónde está mi préstamo?',
        internalNote: 'El cliente tiene dudas sobre el saldo en cero.'
      },
      {
        speaker: 'Asesor',
        text: 'Entiendo perfectamente su inquietud, don/doña [Nombre], permítame explicarle con total claridad: Al registrarse en INSTACREDIT, nuestro sistema le apertura una Cuenta Digital bancaria propia e independiente, número [CTA-INSTA-XXXXXX]. Toda cuenta inicia con saldo en $0 COP por su seguridad.',
        internalNote: 'Explicar con tranquilidad y solvencia técnica.'
      },
      {
        speaker: 'Asesor',
        text: 'En este momento su solicitud se encuentra en validación por nuestro motor de crédito. Una vez firmado su pagaré electrónico con el código OTP que le enviamos por SMS, el comité aprueba el monto y automáticamente verá reflejado el saldo en su cuenta digital, desde donde podrá transferirlo en 1 clic a su cuenta externa de [Banco del Cliente] o retirarlo.',
        internalNote: 'Dar certeza del proceso y los tiempos de desembolso.'
      },
      {
        speaker: 'Cliente',
        text: 'Ah perfecto, o sea que no tengo que pagar nada por adelantado, ¿verdad?',
        internalNote: 'Objeción típica de fraude en el mercado informal.'
      },
      {
        speaker: 'Asesor',
        text: '¡Exactamente! Tenga la total seguridad de que INSTACREDIT está vigilado por la Superintendencia de Industria y Comercio (SIC). Jamás le pediremos consignaciones ni anticipos para desembolsar su dinero.',
        internalNote: 'Reforzar la legalidad y tranquilidad jurídica del cliente.'
      }
    ],
    keyAdvice: [
      'Recalcar que INSTACREDIT no cobra estudios de crédito previos.',
      'Orientar al usuario a revisar el botón "Mi Cuenta Digital" en la plataforma.'
    ]
  },
  {
    id: 'script-3',
    title: 'Manejo de Objeciones sobre Fianza FGA y Plataforma Tecnológica',
    scenario: 'El cliente pregunta por qué hay rubros de fianza o costos de tecnología en el desglose.',
    channel: 'Ambos',
    goal: 'Justificar de forma técnica y legal cada concepto de la liquidación precontractual.',
    dialogue: [
      {
        speaker: 'Cliente',
        text: 'Veo en la tabla que me cobran un valor de fianza FGA y plataforma tecnológica, ¿eso por qué es si solo pedí el capital?',
        internalNote: 'Pregunta recurrente sobre los costos del microcrédito.'
      },
      {
        speaker: 'Asesor',
        text: 'Con mucho gusto le explico con total transparencia, don/doña [Nombre]: En INSTACREDIT no le solicitamos fiadores, codeudores con finca raíz ni hipotecas para prestarle. Para hacer posible esto, su crédito cuenta con el respaldo del Fondo de Garantías FGA, el cual asume el aval de su préstamo.',
        internalNote: 'Destacar el beneficio de no requerir codeudor.'
      },
      {
        speaker: 'Asesor',
        text: 'El concepto de plataforma tecnológica cubre la custodia del pagaré desmaterializado, el sello criptográfico de tiempo y la validación biométrica antifraude bajo la Ley 527 de 1999. Todos estos costos, junto con el IVA legal, se le desglosan de antemano antes de firmar para que usted tenga la certeza total de lo que va a cancelar el día [Fecha Vencimiento].',
        internalNote: 'Demostrar cumplimiento estricto del Estatuto del Consumidor.'
      }
    ],
    keyAdvice: [
      'Utilice analogías sencillas: el aval FGA es como una póliza de respaldo que le evita buscar un fiador.',
      'Recuerde al cliente que la tasa de interés remuneratorio está al 0.0717% diario, regulada por la Superfinanciera.'
    ]
  },
  {
    id: 'script-4',
    title: 'Orientación para Negociación de Monto Aprobado Ajustado por Analista',
    scenario: 'El cliente solicitó $1.500.000 pero el administrador o motor aprobó $800.000 por score.',
    channel: 'Ambos',
    goal: 'Explicar de forma asertiva el ajuste de monto protegiendo el score y promoviendo el aumento progresivo de cupo.',
    dialogue: [
      {
        speaker: 'Asesor',
        text: 'Don/doña [Nombre], le tengo muy buenas noticias: su crédito ha sido aprobado en INSTACREDIT. Para cuidar su capacidad de endeudamiento y garantizarle una cuota cómoda, nuestro comité le ha preaprobado un cupo inicial de [Monto Ajustado, ej. $800.000 COP].',
        internalNote: 'Presentar el ajuste como una noticia positiva y de protección financiera.'
      },
      {
        speaker: 'Cliente',
        text: 'Pero yo había pedido $1.500.000, ¿por qué me bajaron el valor?',
        internalNote: 'Manejar la frustración con empatía.'
      },
      {
        speaker: 'Asesor',
        text: 'Comprendo perfectamente su expectativa. Como es su primera operación con nosotros, evaluamos sus gastos e ingresos para que el pago no afecte su economía familiar. Lo grandioso es que al pagar puntualmente este crédito de [Monto Ajustado], nuestro sistema le otorgará de forma automática un descuento del 10% en la fianza y le aumentaremos su cupo disponible hasta el límite máximo de $2.500.000 COP.',
        internalNote: 'Resaltar el programa de fidelización "Todos Ganan" y aumento de cupo.'
      }
    ],
    keyAdvice: [
      'Enfoque la respuesta en la construcción de historial positivo.',
      'Indique que en el panel administrativo sus contratos se ajustaron automáticamente a la cifra aprobada.'
    ]
  },
  {
    id: 'script-5',
    title: 'Protocolo de Cobranza Preventiva y Activación de Prórroga / Extensión',
    scenario: 'Contacto a clientes que tienen crédito próximo a vencer en 2 días o que manifiestan dificultad de pago.',
    channel: 'Ambos',
    goal: 'Evitar mora, ofrecer canales de pago (PSE, Efecty) o activar extensión sin reporte a centrales.',
    dialogue: [
      {
        speaker: 'Asesor',
        text: 'Don/doña [Nombre], le saluda [Nombre Asesor] de INSTACREDIT. Le contacto de manera preventiva para recordarle que su crédito radicado [ID] vence este próximo [Fecha]. ¿Desea que le genere el enlace directo de PSE o el código de convenio Efecty?',
        internalNote: 'Tono respetuoso, sin presiones indebidas conforme a Ley 2300.'
      },
      {
        speaker: 'Cliente',
        text: 'Uy joven, la verdad se me presentó un imprevisto con mi sueldo y no alcanzo a pagar la totalidad para esa fecha. ¿Me van a reportar a Datacrédito?',
        internalNote: 'Identificar necesidad de prórroga.'
      },
      {
        speaker: 'Asesor',
        text: 'Tranquilo/a, para eso estamos aquí. En INSTACREDIT contamos con la opción de Extensión de Plazo por 15 o 30 días adicionales. Al cancelar únicamente los cargos y fianza causados, aplazamos la devolución del capital por un mes más. De esa manera su historial crediticio se mantiene 100% positivo y al día ante Datacrédito y TransUnion.',
        internalNote: 'Presentar la solución de extensión de inmediato.'
      },
      {
        speaker: 'Cliente',
        text: '¡Excelente alternativa! ¿Cómo hago para activar esa extensión?',
        internalNote: 'Cierre del acuerdo.'
      },
      {
        speaker: 'Asesor',
        text: 'Puede ingresar directamente a la opción "Cómo extender" en la página o en su Cuenta Digital, seleccionar 15 o 30 días y confirmar con PSE. También le acabo de enviar el link oficial a su WhatsApp para que lo haga en 2 minutos.',
        internalNote: 'Enviar enlace seguro y verificar recepción.'
      }
    ],
    keyAdvice: [
      'Cumpla estrictamente los horarios de contacto permitidos por la Ley 2300 de 2023.',
      'Recuerde que antes de cualquier reporte negativo legal se requiere enviar una comunicación previa con 20 días de antelación.'
    ]
  }
];
