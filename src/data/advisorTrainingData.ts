export interface VisualFlowStep {
  stepNumber: number;
  title: string;
  simpleExplanation: string;
  whatAdvisorSeesInSystem: string;
  whatAdvisorMustDo: string;
  colorClass: string;
  audioScript: string;
}

export interface TrafficLightRule {
  id: string;
  ruleNumber: number;
  title: string;
  whyItMattersSimple: string;
  greenDo: string[];
  redNeverDo: string[];
  legalReference: string;
  audioScript: string;
}

export interface BeginnerGlossaryItem {
  id: string;
  term: string;
  simpleMeaningForNewEmployee: string;
  realLifeAnalogy: string;
  howToExplainToClient: string;
  badge: string;
}

export interface InteractiveScenarioCard {
  id: string;
  clientSituation: string;
  clientMood: string;
  visualDiagnosis: string;
  systemButtonToClick: string;
  exactWordsToSay: string;
  mistakeToAvoid: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LOAN_FLOW_VISUAL_STEPS: VisualFlowStep[] = [
  {
    stepNumber: 1,
    title: 'El Cliente Solicita el Dinero en la Web',
    simpleExplanation:
      'El cliente entra desde su móvil u ordenador, elige cuánto dinero necesita (de 2.000 € a 100.000 €) y en cuántos meses quiere devolverlo.',
    whatAdvisorSeesInSystem:
      'Verás una tarjeta nueva con el estado en color AZUL ("Pendiente") y un código único que empieza por INSTA-ES.',
    whatAdvisorMustDo:
      'Saludarle por WhatsApp o teléfono en menos de 15 minutos usando su nombre de pila y transmitirle tranquilidad total.',
    colorClass: 'bg-blue-50 border-blue-300 text-blue-950',
    audioScript:
      'Paso 1: El cliente solicita el dinero en la web. En tu pantalla verás una solicitud nueva en estado Pendiente. Tu misión es saludarle por su nombre en menos de 15 minutos y darle confianza.'
  },
  {
    stepNumber: 2,
    title: 'Verificación de Identidad (DNI/NIE) y Cuenta IBAN',
    simpleExplanation:
      'Antes de prestar dinero, la ley española nos obliga a comprobar que la persona es quien dice ser y que la cuenta del banco es suya.',
    whatAdvisorSeesInSystem:
      'Verás su número de DNI o NIE y el código IBAN de su banco en España (empieza siempre por las letras E y S).',
    whatAdvisorMustDo:
      'Revisar que la foto del DNI tenga las 4 esquinas visibles y que el banco esté a su nombre exclusivo. Si le cuesta usar el móvil, envíale el Formulario Didáctico con Voz.',
    colorClass: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    audioScript:
      'Paso 2: Verificación de identidad y cuenta bancaria. Debes comprobar que la foto de su DNI se vea clara con las cuatro esquinas y que la cuenta bancaria IBAN esté a su nombre exclusivo. Nunca se envía dinero a cuentas de familiares ni amigos.'
  },
  {
    stepNumber: 3,
    title: 'Estudio Humano y Aprobación del Préstamo',
    simpleExplanation:
      'Comprobamos que el cliente tiene ingresos mensuales (nómina, pensión o autónomo) suficientes para pagar su cuota sin ahogarse.',
    whatAdvisorSeesInSystem:
      'El expediente pasa a color ÁMBAR ("En Revisión") y luego a MORADO ("Aprobado") con la cuota fija mensual calculada.',
    whatAdvisorMustDo:
      'Informar al cliente de la buena noticia, explicarle su cuota fija mensual sin letra pequeña y enviarle el enlace para firmar su contrato digital.',
    colorClass: 'bg-amber-50 border-amber-300 text-amber-950',
    audioScript:
      'Paso 3: Estudio y aprobación. Cuando el préstamo pasa a estado Aprobado, debes felicitar al cliente, confirmarle su cuota mensual fija y guiarle para que firme su contrato desde el móvil.'
  },
  {
    stepNumber: 4,
    title: 'Firma Digital del Pagaré en el Móvil (eIDAS)',
    simpleExplanation:
      'En lugar de ir a un notario físico con papeles, el cliente firma con su dedo en la pantalla del móvil y confirma con un código SMS.',
    whatAdvisorSeesInSystem:
      'Verás el código OTP de 6 dígitos y el sello criptográfico de que el contrato y el pagaré están firmados legalmente.',
    whatAdvisorMustDo:
      'Acompañar al cliente por teléfono o WhatsApp si no sabe cómo dibujar su firma en la pantalla o dónde poner el código SMS.',
    colorClass: 'bg-purple-50 border-purple-300 text-purple-950',
    audioScript:
      'Paso 4: Firma digital del pagaré en el móvil. El cliente dibuja su firma con el dedo en la pantalla y pone el código SMS. Tiene la misma validez que firmar ante un notario físico.'
  },
  {
    stepNumber: 5,
    title: 'Desembolso del Dinero y Seguimiento Amable',
    simpleExplanation:
      'Una vez firmado, el dinero se carga en su Cuenta Digital IBAN y se transfiere en minutos a su banco por Bizum o transferencia SEPA.',
    whatAdvisorSeesInSystem:
      'El estado cambia a color VERDE ("Desembolsado") y el saldo aparece reflejado en la Cuenta Digital del cliente.',
    whatAdvisorMustDo:
      'Enviar el comprobante oficial en PDF, recordarle que puede pagar sus cuotas por Bizum y anotar siempre tu gestión en la Bitácora del Asesor.',
    colorClass: 'bg-teal-50 border-teal-300 text-teal-950',
    audioScript:
      'Paso 5: Desembolso del dinero. El estado pasa a Desembolsado y el cliente recibe su dinero por Bizum o transferencia inmediata. Recuerda siempre anotar todo lo que hiciste en la Bitácora del sistema.'
  }
];

export const GOLDEN_RULES_TRAFFIC_LIGHT: TrafficLightRule[] = [
  {
    id: 'rule-1',
    ruleNumber: 1,
    title: 'PROHIBICIÓN ABSOLUTA DE COBROS PREVIOS (CERO ANTICIPOS)',
    whyItMattersSimple:
      'En internet existen estafadores que piden dinero antes de dar un préstamo. En INSTACREDIT España JAMÁS se le pide ni un solo euro por adelantado al cliente.',
    greenDo: [
      'Repetir siempre al cliente: "En Instacredit jamás le pediremos dinero por adelantado para seguros, aperturas ni fianzas".',
      'Explicar que el cliente recibe el 100% del capital aprobado limpio en su cuenta.',
      'Transmitir calma cuando el cliente pregunte con miedo si tiene que pagar algo antes.'
    ],
    redNeverDo: [
      'NUNCA pedir transferencias previas para "activar el crédito", "pagar seguro" o "gastos de notaría".',
      'NUNCA dar números de cuenta personales de empleados para recibir pagos.',
      'NUNCA dejar con la duda a un cliente que pregunta si hay costes ocultos.'
    ],
    legalReference: 'Ley 16/2011 de Contratos de Crédito al Consumo y Código Deontológico Instacredit.',
    audioScript:
      'Regla de oro número 1: Prohibición absoluta de cobros previos. En Instacredit jamás le pedimos ni un solo céntimo por adelantado al cliente. El cliente recibe el cien por cien de su dinero limpio. Nunca pidas dinero para activar créditos ni seguros.'
  },
  {
    id: 'rule-2',
    ruleNumber: 2,
    title: 'LA CUENTA BANCARIA (IBAN) DEBE SER 100% DEL CLIENTE',
    whyItMattersSimple:
      'Por ley contra el blanqueo de dinero y estafas (SEPBLAC), solo podemos enviar el dinero del préstamo a una cuenta donde el propio cliente sea el titular.',
    greenDo: [
      'Comprobar siempre que el nombre del cliente coincide con el titular de la cuenta IBAN.',
      'Ayudar al cliente a descargar su certificado de titularidad desde la app de su banco (CaixaBank, BBVA, Santander, etc.).',
      'Si el cliente no tiene cuenta propia, orientarle para que abra una cuenta online gratuita a su nombre en 5 minutos.'
    ],
    redNeverDo: [
      'NUNCA aceptar la cuenta bancaria del marido, esposa, hijo, madre, amigo o jefe, aunque traigan autorización.',
      'NUNCA aprobar un expediente si la foto del DNI está borrosa, recortada o en blanco y negro.'
    ],
    legalReference: 'Ley 10/2010 de Prevención del Blanqueo de Capitales (SEPBLAC).',
    audioScript:
      'Regla de oro número 2: La cuenta bancaria IBAN debe pertenecer siempre al cliente solicitante. Está prohibido por la ley antiblanqueo enviar el dinero a la cuenta de un familiar, pareja o amigo, aunque el cliente lo pida.'
  },
  {
    id: 'rule-3',
    ruleNumber: 3,
    title: 'TRATO HUMANO, EMPÁTICO Y POLÍTICA DE CERO ACOSO',
    whyItMattersSimple:
      'Nuestros clientes son personas trabajadoras que a veces pasan por una urgencia médica, avería o retraso de sueldo. Somos asesores que ayudan, nunca cobradores agresivos.',
    greenDo: [
      'Hablar siempre de "usted" o por su nombre con respeto, voz calmada y sonrisa telefónica.',
      'Si un cliente avisa que no puede pagar a tiempo, agradecerle su honestidad y ofrecerle la Prórroga de 15, 30 o 45 días.',
      'Usar los Formularios Didácticos con Voz cuando atiendas a personas mayores o que no entienden bien el móvil.'
    ],
    redNeverDo: [
      'NUNCA gritar, amenazar con juzgados ni asustar al cliente con meterle en listas negras mañana mismo.',
      'NUNCA llamar fuera del horario legal (solo de 9:00 a 20:00 horas) ni llamar a su trabajo o familiares.',
      'NUNCA hablar con palabras técnicas complicadas que el cliente no entienda.'
    ],
    legalReference: 'Circular 5/2012 del Banco de España y Código de Buenas Prácticas.',
    audioScript:
      'Regla de oro número 3: Trato humano y política de cero acoso. Nunca amenaces ni presiones a un cliente. Si un cliente no puede pagar a tiempo, agradécele por avisar y ofrécele una prórroga de 15, 30 o 45 días para proteger su historial.'
  },
  {
    id: 'rule-4',
    ruleNumber: 4,
    title: 'TRANSPARENCIA TOTAL Y REGISTRO EN LA BITÁCORA',
    whyItMattersSimple:
      'Todo lo que hablamos con el cliente debe ser claro como el agua y debe quedar escrito en el sistema para que cualquier compañero o supervisor sepa qué pasó.',
    greenDo: [
      'Explicar siempre la cuota mensual fija en euros y recordar que puede pagar antes de tiempo con 0% de penalización.',
      'Anotar en el botón "Añadir Nota / Bitácora" cada llamada, WhatsApp o acuerdo que hagas con el cliente.',
      'Bloquear o cerrar tu sesión con tu PIN cuando te levantes de tu puesto de trabajo.'
    ],
    redNeverDo: [
      'NUNCA prometer regalos o rebajas de intereses que no aparezcan en la calculadora oficial.',
      'NUNCA guardar fotos de DNI de clientes en tu teléfono móvil personal (es delito grave por la ley RGPD).',
      'NUNCA dejar un cliente atendido sin apuntar el resumen en la bitácora.'
    ],
    legalReference: 'Reglamento General de Protección de Datos (RGPD UE 2016/679) y LOPDGDD.',
    audioScript:
      'Regla de oro número 4: Transparencia y registro en bitácora. Nunca guardes fotos de documentos en tu móvil personal y apunta siempre un resumen de cada llamada o mensaje en la bitácora del sistema.'
  }
];

export const BEGINNER_GLOSSARY: BeginnerGlossaryItem[] = [
  {
    id: 'glos-1',
    term: 'IBAN y Transferencia SEPA',
    badge: 'Concepto Bancario Básico',
    simpleMeaningForNewEmployee:
      'El IBAN es la "matrícula" única de una cuenta bancaria en España. Siempre empieza por ES seguido de 22 números. SEPA Instant es el sistema que hace que el dinero llegue de un banco a otro en 10 segundos.',
    realLifeAnalogy:
      'Es como el número de teléfono de tu banco: si te equivocas en un número o no es tuyo, el dinero no puede enviarse.',
    howToExplainToClient:
      '"Señor(a) [Nombre], el IBAN es el número largo de su cuenta que empieza por ES. Lo necesitamos a su nombre para que el dinero le llegue en segundos a su banco."'
  },
  {
    id: 'glos-2',
    term: 'TIN y TAE (Tipos de Interés)',
    badge: 'Coste del Préstamo',
    simpleMeaningForNewEmployee:
      'El TIN (1,95% mensual) es lo que cuesta alquilar el dinero cada mes. La TAE (26,8% anual) es el cálculo total al año que exige mostrar el Banco de España para que el cliente pueda comparar entre bancos.',
    realLifeAnalogy:
      'El TIN es el precio del menú y la TAE es el ticket completo con todos los gastos incluidos para que no haya sorpresas.',
    howToExplainToClient:
      '"Su cuota mensual ya es fija y cerrada: incluye el interés mensual del 1,95% y todos los costes legales. Nunca le subirá ni un euro aunque suban los precios."'
  },
  {
    id: 'glos-3',
    term: 'Pagaré Notarial eIDAS y Código OTP',
    badge: 'Firma Digital Legal',
    simpleMeaningForNewEmployee:
      'El Pagaré es el documento donde el cliente se compromete a devolver el préstamo. "eIDAS" es la ley europea que permite firmarlo con el dedo en el móvil y un código de 6 números por SMS (OTP) con el mismo valor que ir a una notaría.',
    realLifeAnalogy:
      'Es como firmar con bolígrafo delante de un notario, pero desde el sofá de casa usando el móvil.',
    howToExplainToClient:
      '"Para no hacerle perder tiempo yendo a una notaría, usted firma con el dedo en la pantalla de su móvil y confirma con el código gratuito que le llega por SMS."'
  },
  {
    id: 'glos-4',
    term: 'ASNEF / Ficheros de Morosidad',
    badge: 'Solvencia y Riesgo',
    simpleMeaningForNewEmployee:
      'ASNEF es una lista donde las empresas apuntan a las personas que dejaron facturas sin pagar (como recibos de luz, teléfono o tarjetas). En Instacredit NO rechazamos automáticamente por estar en ASNEF si la deuda no es bancaria grande.',
    realLifeAnalogy:
      'Muchos bancos cierran la puerta si debes una factura de teléfono; nosotros miramos si hoy tienes ingresos para pagar.',
    howToExplainToClient:
      '"No se preocupe si tuvo algún recibo pendiente en el pasado. Aquí estudiamos su caso de forma humana viendo sus ingresos actuales gracias a nuestro Fondo de Garantías."'
  },
  {
    id: 'glos-5',
    term: 'Fondo Europeo de Garantías (FGA)',
    badge: 'Respaldo sin Avalista',
    simpleMeaningForNewEmployee:
      'Es un seguro o respaldo que cubre al cliente para que NO tenga que pedirle a ningún familiar o amigo que le firme como avalista.',
    realLifeAnalogy:
      'En vez de molestar a un familiar para que te avale, el propio préstamo incluye un escudo protector.',
    howToExplainToClient:
      '"Gracias al Fondo de Garantías incluido en su operación, usted no necesita molestar a ningún familiar ni poner propiedades como aval."'
  },
  {
    id: 'glos-6',
    term: 'Cuenta Digital IBAN en 0,00 €',
    badge: 'Operativa de Plataforma',
    simpleMeaningForNewEmployee:
      'Cuando un cliente se registra, el sistema le crea una bóveda o cuenta digital personal que empieza en 0,00 €. En cuanto se aprueba y desembolsa el préstamo, el dinero aparece ahí para pasarlo a su banco.',
    realLifeAnalogy:
      'Es su casillero bancario privado dentro de Instacredit: empieza vacío al abrirlo y se llena en cuanto aprobamos su dinero.',
    howToExplainToClient:
      '"Su Cuenta Digital empieza en cero euros mientras revisamos su solicitud. En cuanto firmemos el pagaré, verá ahí ingresado el 100% de su dinero listo para pasarlo a su banco."'
  }
];

export const INTERACTIVE_SCENARIOS: InteractiveScenarioCard[] = [
  {
    id: 'scen-1',
    clientSituation: 'El cliente es una persona mayor o dice: "No entiendo bien el móvil ni veo las letras pequeñas"',
    clientMood: 'Agobiado / Confundido con la tecnología',
    visualDiagnosis:
      'El cliente quiere el préstamo pero tiene miedo de equivocarse tocando botones pequeños. Necesita ayuda visual y auditiva.',
    systemButtonToClick:
      'Ve a la pestaña "Formularios Didácticos con Voz" -> Pulsa "Abrir Formulario Asistido" y envíaselo por WhatsApp.',
    exactWordsToSay:
      '"No se preocupe en absoluto, don/doña [Nombre]. Yo le voy a acompañar paso a paso. Le acabo de enviar a su WhatsApp un formulario especial con letras grandes y un botón verde de altavoz que le lee todo en voz alta. Ábralo tranquilo que yo no cuelgo."',
    mistakeToAvoid:
      'Nunca le digas "Búsquese a alguien joven que se lo rellene" ni te impacientes.'
  },
  {
    id: 'scen-2',
    clientSituation: 'El cliente pregunta con desconfianza: "¿Me vais a pedir que pague algo antes de darme el préstamo?"',
    clientMood: 'Desconfiado / Con miedo a ser engañado',
    visualDiagnosis:
      'Probablemente vio anuncios falsos en internet antes. Si le respondes con firmeza y claridad, ganarás su confianza al 100%.',
    systemButtonToClick:
      'Ve a "WhatsApp Toolkit" -> Etapa 1 (Bienvenida) -> Envía el mensaje con Sello Oficial del Banco de España.',
    exactWordsToSay:
      '"Rotundamente NO, [Nombre]. En INSTACREDIT España jamás le pediremos ni un solo céntimo por adelantado, ni para seguros ni para gastos. Usted recibe el 100% de su dinero íntegro en su banco. Somos una entidad legal en España con NIF B-87942105."',
    mistakeToAvoid:
      'Nunca respondas con dudas ni te ofendas porque el cliente desconfíe; es normal que pregunte.'
  },
  {
    id: 'scen-3',
    clientSituation: 'El cliente dice: "Mi cuenta está bloqueada, ¿podéis ingresarme el dinero en la cuenta de mi mujer o de mi hijo?"',
    clientMood: 'Urgido / Buscando un atajo rápido',
    visualDiagnosis:
      'Alerta legal SEPBLAC: La ley española prohíbe enviar préstamos a cuentas de otras personas. Hay que darle una solución legal fácil.',
    systemButtonToClick:
      'Ve a "Formularios Didácticos con Voz" -> Pestaña 2 (Verificación IBAN SEPBLAC).',
    exactWordsToSay:
      '"Entiendo su situación, [Nombre], pero la ley española contra el fraude nos prohíbe ingresar el dinero en una cuenta que no esté a su nombre, aunque sea de su familia. Lo que puede hacer hoy mismo es abrir desde el móvil una cuenta gratuita a su nombre en BBVA, CaixaBank Imagin u Openbank; tarda 5 minutos y ahí le enviamos el dinero al instante."',
    mistakeToAvoid:
      'Jamás aceptes el IBAN de un familiar pensando "total, se apellidan igual". El sistema bloqueará la transferencia.'
  },
  {
    id: 'scen-4',
    clientSituation: 'El cliente llama preocupado: "Este mes me pagaron tarde en el trabajo y no llego a pagar la cuota mañana"',
    clientMood: 'Angustiado / Con miedo a recargos o listas de morosos',
    visualDiagnosis:
      'Es un cliente honesto que da la cara antes de que venza el plazo. Debemos cuidarle y activar el protocolo de Alivio Financiero.',
    systemButtonToClick:
      'Ve a "Formularios Didácticos con Voz" -> Pestaña 4 (Solicitud de Aplazamiento / Prórroga +15, +30 o +45 días).',
    exactWordsToSay:
      '"Primero que nada, respire tranquilo(a), [Nombre], y muchas gracias por avisarnos con tiempo. En Instacredit no acosamos ni penalizamos a quien avisa. Vamos a activarle ahora mismo una prórroga de 15 o 30 días para cambiar su fecha al día que cobre su sueldo, así su historial queda limpio y sin ningún reporte a ASNEF."',
    mistakeToAvoid:
      'Nunca le regañes ni le digas "Pues consiga el dinero como sea hoy mismo".'
  },
  {
    id: 'scen-5',
    clientSituation: 'El cliente está molesto y quiere poner una queja formal o reclamación',
    clientMood: 'Enfadado / Exigiendo sus derechos legales',
    visualDiagnosis:
      'Todo consumidor en España tiene derecho al Servicio de Atención al Cliente (SAC). Si le atendemos con educación y le damos su número de radicado oficial, se calmará de inmediato.',
    systemButtonToClick:
      'Ve a "Formularios Didácticos con Voz" -> Pestaña 5 (Reclamación Formal SAC Banco de España).',
    exactWordsToSay:
      '"Lamento mucho la molestia que haya podido tener, [Nombre]. Como entidad supervisada bajo normativa del Banco de España, voy a registrar ahora mismo su reclamación oficial en nuestro Servicio de Atención al Cliente con su número de expediente garantizado para darle solución prioritaria."',
    mistakeToAvoid:
      'Nunca discutas ni le niegues la hoja o formulario de reclamaciones.'
  }
];

export const ADVISOR_ONBOARDING_QUIZ: QuizQuestion[] = [
  {
    id: 'q-1',
    question: '1. Un cliente nuevo pregunta si tiene que pagar 50 € por adelantado para activar su préstamo o pagar un seguro. ¿Qué debes responder?',
    options: [
      'Que sí, que debe hacer un Bizum antes de recibir el préstamo.',
      'Que rotundamente NO: en Instacredit España jamás se pide ni un solo euro por adelantado.',
      'Que depende de lo que diga el director ese día.'
    ],
    correctIndex: 1,
    explanation:
      '¡Exacto! Regla de Oro #1: En INSTACREDIT jamás se cobra nada por anticipado. El cliente recibe el 100% de su dinero limpio.'
  },
  {
    id: 'q-2',
    question: '2. El cliente nos pide ingresar el préstamo en la cuenta bancaria de su hermano porque le viene mejor. ¿Es válido?',
    options: [
      'Sí, si nos envía un audio dando permiso.',
      'No, está terminantemente prohibido por la Ley 10/2010 SEPBLAC. El IBAN debe estar 100% a nombre del solicitante.',
      'Sí, si el préstamo es menor de 5.000 €.'
    ],
    correctIndex: 1,
    explanation:
      '¡Correcto! Por ley antiblanqueo SEPBLAC, el titular del préstamo y el titular de la cuenta bancaria IBAN deben ser exactamente la misma persona.'
  },
  {
    id: 'q-3',
    question: '3. ¿Qué herramienta debes usar si atiendes a una persona mayor o que tiene dificultades para leer en el móvil?',
    options: [
      'Decirle que no podemos atenderle si no sabe usar internet.',
      'Enviar el Formulario Didáctico Asistido con Voz (que tiene letras grandes y lee todo en voz alta).',
      'Pedirle sus contraseñas privadas del banco.'
    ],
    correctIndex: 1,
    explanation:
      '¡Muy bien! Nuestros 5 Formularios Didácticos con Voz están diseñados especialmente para que cualquier persona pueda completar su trámite escuchando las instrucciones.'
  },
  {
    id: 'q-4',
    question: '4. Un cliente llama angustiado porque se le retrasó la nómina y no puede pagar mañana. ¿Qué haces?',
    options: [
      'Amenazarle con meterle en ASNEF mañana a primera hora.',
      'Agradecerle por avisar con tiempo, transmitirle calma y ofrecerle la Prórroga de Alivio (+15, +30 o +45 días).',
      'No contestarle el teléfono.'
    ],
    correctIndex: 1,
    explanation:
      '¡Perfecto! Aplicamos la política de Cero Acoso: ayudamos al cliente honesto con una prórroga formal que protege su historial crediticio.'
  },
  {
    id: 'q-5',
    question: '5. Al terminar de hablar con cualquier cliente por teléfono o WhatsApp, ¿qué es obligatorio hacer en el panel?',
    options: [
      'Nada, pasar al siguiente cliente sin apuntar nada.',
      'Guardar la foto de su DNI en mi móvil personal.',
      'Registrar un resumen de lo hablado en la Bitácora de Acciones del expediente.'
    ],
    correctIndex: 2,
    explanation:
      '¡Excelente! Toda llamada, mensaje o acuerdo debe registrarse en la Bitácora del expediente para mantener el orden y la auditoría.'
  }
];
