import {
  CreditApplication,
  CustomerReview,
  PlatformConfig,
  PqrsRecord,
  Advisor,
  UserAccount,
  ClientLiveQuery,
  AppNotification
} from '../types';
import { calculateLoanBreakdown } from '../utils/financialCalculations';

export const SPANISH_BANKS = [
  'Banco Santander',
  'BBVA',
  'CaixaBank',
  'Banco Sabadell',
  'Bankinter',
  'ING España',
  'Openbank',
  'N26 España',
  'Revolut España',
  'Abanca',
  'Unicaja Banco',
  'Kutxabank',
  'Ibercaja',
  'Cajasur',
  'Caja Rural / Banco Cooperativo',
  'Deutsche Bank España'
];

// Compatibility alias
export const COLOMBIAN_BANKS = SPANISH_BANKS;

export const SPANISH_PROVINCES_CITIES: Record<string, string[]> = {
  'Madrid': ['Madrid', 'Móstoles', 'Alcalá de Henares', 'Fuenlabrada', 'Leganés', 'Getafe', 'Alcorcón', 'Torrejón de Ardoz', 'Parla', 'Alcobendas'],
  'Barcelona': ['Barcelona', 'L\'Hospitalet de Llobregat', 'Badalona', 'Terrassa', 'Sabadell', 'Mataró', 'Santa Coloma de Gramenet', 'Sant Cugat del Vallès', 'Cornellà de Llobregat'],
  'Valencia': ['Valencia', 'Torrent', 'Gandia', 'Paterna', 'Sagunto', 'Alzira', 'Mislata', 'Burjassot'],
  'Sevilla': ['Sevilla', 'Dos Hermanas', 'Alcalá de Guadaíra', 'Utrera', 'Mairena del Aljarafe', 'Écija'],
  'Zaragoza': ['Zaragoza', 'Calatayud', 'Utebo', 'Ejea de los Caballeros'],
  'Málaga': ['Málaga', 'Marbella', 'Mijas', 'Fuengirola', 'Vélez-Málaga', 'Torremolinos', 'Benalmádena', 'Estepona'],
  'Murcia': ['Murcia', 'Cartagena', 'Lorca', 'Molina de Segura', 'Alcantarilla'],
  'Baleares': ['Palma de Mallorca', 'Calvià', 'Ibiza / Eivissa', 'Manacor', 'Santa Eulària des Riu', 'Ciutadella de Menorca'],
  'Las Palmas': ['Las Palmas de Gran Canaria', 'Telde', 'Santa Lucía de Tirajana', 'Arrecife', 'San Bartolomé de Tirajana'],
  'Santa Cruz de Tenerife': ['Santa Cruz de Tenerife', 'San Cristóbal de La Laguna', 'Arona', 'Adeje', 'La Orotava'],
  'Bizkaia': ['Bilbao', 'Barakaldo', 'Getxo', 'Portugalete', 'Santurtzi', 'Basauri'],
  'Alicante': ['Alicante', 'Elche', 'Torrevieja', 'Orihuela', 'Benidorm', 'Alcoy', 'Elda'],
  'A Coruña': ['A Coruña', 'Santiago de Compostela', 'Ferrol', 'Oleiros', 'Carballo'],
  'Asturias': ['Gijón', 'Oviedo', 'Avilés', 'Siero', 'Langreo'],
  'Granada': ['Granada', 'Motril', 'Almuñécar', 'Armilla', 'Macarena'],
  'Pontevedra': ['Vigo', 'Pontevedra', 'Vilagarcía de Arousa', 'Redondela'],
  'Valladolid': ['Valladolid', 'Laguna de Duero', 'Medina del Campo', 'Arroyo de la Encomienda'],
  'Navarra': ['Pamplona', 'Tudela', 'Barañáin', 'Valle de Egüés', 'Burlada']
};

// Compatibility alias
export const COLOMBIAN_DEPARTMENTS_CITIES = SPANISH_PROVINCES_CITIES;
export const SPANISH_PROVINCES = Object.keys(SPANISH_PROVINCES_CITIES);

export const COUNTRIES_OF_RESIDENCE = [
  'España',
  'Colombia',
  'Venezuela',
  'Ecuador',
  'Perú',
  'Argentina',
  'Marruecos',
  'Rumanía',
  'Italia',
  'Francia',
  'Portugal',
  'Reino Unido',
  'Brasil',
  'México',
  'Chile',
  'Otro país UE / Extranjero con residencia'
];

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  phoneNational: '900 839 201', // Línea gratuita nacional
  phoneMadrid: '(91) 078 3650',
  whatsappNumber: '+34 613 892 401',
  whatsappUrl: 'https://wa.me/34613892401?text=Hola%20Instacredit%20Espa%C3%B1a,%20deseo%20informaci%C3%B3n%20sobre%20mi%20pr%C3%A9stamo%20y%20cuenta%20digital',
  supportEmail: 'ayuda@instacredit.es',
  businessHoursWeekdays: 'Lunes a Viernes: 8:00 a 21:00 h (Horario Peninsular)',
  businessHoursWeekends: 'Sábados: 9:00 a 14:00 h',
  companyName: 'INSTACREDIT ESPAÑA FINTECH S.L.',
  companyNif: 'B-89412093',
  companyAddress: 'Paseo de la Castellana 95, Planta 14, 28046 Madrid, España',
  supervisionEntity: 'Banco de España (BdE) & Ley 16/2011 de Crédito al Consumo',
  facebookUrl: 'https://facebook.com/instacreditespana',
  instagramUrl: 'https://instagram.com/instacredit.es',
  linkedinUrl: 'https://linkedin.com/company/instacredit-espana',
  tiktokUrl: 'https://tiktok.com/@instacredites'
};

export const DEFAULT_ADVISORS: Advisor[] = [
  {
    id: 'ADV-01',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@instacredit.es',
    roleTitle: 'Especialista Senior en Financiación y Riesgos',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+34 613 892 401',
    specialty: 'Crédito al consumo, verificación laboral y Bizum',
    rating: 4.95,
    assignedCount: 4,
    isOnline: true
  },
  {
    id: 'ADV-02',
    name: 'Elena García Serrano',
    email: 'elena.garcia@instacredit.es',
    roleTitle: 'Analista de Documentación y Prevención Blanqueo (SEPBLAC)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    phone: '+34 613 892 402',
    specialty: 'Cotejo DNI/NIE, nóminas, autónomos y CIRBE',
    rating: 4.92,
    assignedCount: 3,
    isOnline: true
  },
  {
    id: 'ADV-03',
    name: 'David Sánchez Pardo',
    email: 'david.sanchez@instacredit.es',
    roleTitle: 'Asesor de Atención Omnicanal y Soporte en Vivo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+34 613 892 403',
    specialty: 'Chat en directo, onboarding PWA y firma eIDAS',
    rating: 4.88,
    assignedCount: 2,
    isOnline: true
  },
  {
    id: 'ADV-04',
    name: 'Lucía Navarro Gil',
    email: 'lucia.navarro@instacredit.es',
    roleTitle: 'Gestora de Acuerdos de Pago y Prevención Morosidad',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    phone: '+34 613 892 404',
    specialty: 'Prórrogas, refinanciaciones y mediación ASNEF',
    rating: 4.97,
    assignedCount: 2,
    isOnline: false
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-ES-01',
    email: 'carmen.navarro@gmail.com',
    passwordHash: 'Insta2026!',
    fullName: 'Carmen Navarro Gómez',
    documentType: 'DNI',
    documentNumber: '48921783K',
    phone: '+34 645 892 104',
    role: 'customer',
    createdAt: '28 de septiembre de 2026',
    applicationId: 'INSTA-ES-821943',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'USR-ES-02',
    email: 'javier.rodriguez@gmail.com',
    passwordHash: 'Insta2026!',
    fullName: 'Javier Rodríguez Alonso',
    documentType: 'DNI',
    documentNumber: '53419082M',
    phone: '+34 678 123 905',
    role: 'customer',
    createdAt: '29 de septiembre de 2026',
    applicationId: 'INSTA-ES-910452',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'USR-ES-03',
    email: 'diego.silva@gmail.com',
    passwordHash: 'Insta2026!',
    fullName: 'Diego Silva Morales',
    documentType: 'NIE',
    documentNumber: 'Y8920143P',
    phone: '+34 690 451 882',
    role: 'customer',
    createdAt: '30 de septiembre de 2026',
    applicationId: 'INSTA-ES-638201',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_APPLICATIONS: CreditApplication[] = [
  {
    id: 'INSTA-ES-821943',
    createdAt: '28 de septiembre de 2026',
    updatedAt: '28 de septiembre de 2026',
    status: 'Desembolsado',
    currentStep: 4,
    assignedAdvisorId: 'ADV-01',
    assignedAdvisorName: 'Carlos Mendoza',
    personalData: {
      firstName: 'Carmen',
      lastName: 'Navarro Gómez',
      documentType: 'DNI',
      documentNumber: '48921783K',
      documentExpiryDate: '2029-06-15',
      birthDate: '1992-04-12',
      nationality: 'España',
      countryOfResidence: 'España',
      phone: '+34 645 892 104',
      email: 'carmen.navarro@gmail.com',
      hasSpanishResidenceCard: true
    },
    economicData: {
      province: 'Madrid',
      city: 'Madrid',
      postalCode: '28046',
      address: 'Paseo de la Castellana 142, 4º B',
      housingType: 'Alquiler',
      occupation: 'Contrato Indefinido',
      monthlyIncome: 2450, // 2.450 €
      monthlyExpenses: 950,
      companyName: 'Indra Soluciones TI',
      seniorityMonths: 36,
      loanPurpose: 'Reformas y Mejoras del Hogar'
    },
    bankDetails: {
      bankName: 'CaixaBank',
      iban: 'ES91 2100 0418 4502 0005 1234',
      accountType: 'Cuenta Nómina',
      isOwnerCertified: true
    },
    loanDetails: {
      ...calculateLoanBreakdown(750, 30), // 750 € a 30 días
      loanPurpose: 'Reformas y Mejoras del Hogar'
    },
    approvedAmount: 750,
    digitalAccount: {
      accountNumber: 'ES91 2100 0418 4502 0005 1234',
      bicSwift: 'INSTESMMXXX',
      balance: 750, // 750 € desembolsados
      creditQuota: 1500,
      usedQuota: 750,
      transactions: [
        {
          id: 'TXN-ES-101',
          type: 'Desembolso de Crédito',
          amount: 750,
          date: '28/09/2026 14:35',
          description: 'Desembolso micropréstamo INSTA-ES-821943 a Cuenta Digital',
          reference: 'SEPA-DISP-91024',
          status: 'Completado',
          balanceAfter: 750
        }
      ],
      linkedExternalBank: {
        bankName: 'CaixaBank',
        iban: 'ES91 2100 0418 4502 0005 1234',
        holderName: 'Carmen Navarro Gómez'
      }
    },
    signatureDetails: {
      signedAt: '28/09/2026 14:30 CEST',
      otpCode: '849201',
      ipAddress: '88.12.94.201',
      signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      asnefConsent: true,
      promissoryNoteConsent: true,
      platformTermsConsent: true
    },
    advisorActionLogs: [
      {
        id: 'LOG-01',
        advisorId: 'ADV-01',
        advisorName: 'Carlos Mendoza',
        timestamp: '28/09/2026 14:28',
        actionType: 'llamada',
        summary: 'Verificación telefónica de DNI y titularidad de cuenta CaixaBank.',
        clientNotes: 'Cliente muy amable. Confirma que el dinero es para reforma urgente del baño.'
      },
      {
        id: 'LOG-02',
        advisorId: 'ADV-01',
        advisorName: 'Carlos Mendoza',
        timestamp: '28/09/2026 14:34',
        actionType: 'aprobacion',
        summary: 'Aprobación de 750 € y desembolso automático en Cuenta Digital.',
        clientNotes: 'Score en CIRBE y ASNEF completamente limpio.'
      }
    ],
    uploadedDocuments: [
      {
        id: 'DOC-01',
        documentCategory: 'DNI_ANVERSO',
        fileName: 'dni_anverso_carmen_navarro.pdf',
        status: 'Verificado',
        uploadedAt: '28/09/2026 14:22'
      },
      {
        id: 'DOC-02',
        documentCategory: 'NOMINA_IRPF',
        fileName: 'nomina_agosto_indra_2450.pdf',
        status: 'Verificado',
        uploadedAt: '28/09/2026 14:23'
      }
    ],
    adminNotes: 'Aprobación de riesgo completada conforme a criterios del Banco de España. Solicitud 100% formalizada.'
  },
  {
    id: 'INSTA-ES-910452',
    createdAt: '29 de septiembre de 2026',
    updatedAt: '29 de septiembre de 2026',
    status: 'En Revisión',
    currentStep: 2,
    assignedAdvisorId: 'ADV-02',
    assignedAdvisorName: 'Elena García Serrano',
    personalData: {
      firstName: 'Javier',
      lastName: 'Rodríguez Alonso',
      documentType: 'DNI',
      documentNumber: '53419082M',
      documentExpiryDate: '2028-11-20',
      birthDate: '1987-11-05',
      nationality: 'España',
      countryOfResidence: 'España',
      phone: '+34 678 123 905',
      email: 'javier.rodriguez@gmail.com',
      hasSpanishResidenceCard: true
    },
    economicData: {
      province: 'Barcelona',
      city: 'Barcelona',
      postalCode: '08029',
      address: 'Avinguda Diagonal 405, 2º 1ª',
      housingType: 'Propiedad con Hipoteca',
      occupation: 'Autónomo / Profesional',
      monthlyIncome: 2900,
      monthlyExpenses: 1200,
      companyName: 'Estudio de Arquitectura JR',
      seniorityMonths: 48,
      loanPurpose: 'Negocio / Capital Autónomos'
    },
    bankDetails: {
      bankName: 'Banco Santander',
      iban: 'ES04 0049 1500 0512 3456 7890',
      accountType: 'Cuenta Corriente',
      isOwnerCertified: true
    },
    loanDetails: {
      ...calculateLoanBreakdown(1200, 60), // 1.200 € a 60 días
      loanPurpose: 'Negocio / Capital Autónomos'
    },
    approvedAmount: 1200,
    digitalAccount: {
      accountNumber: 'ES04 0049 1500 0512 3456 7890',
      bicSwift: 'INSTESMMXXX',
      balance: 0, // Inicia en 0 € hasta aprobación y desembolso
      creditQuota: 2000,
      usedQuota: 0,
      transactions: [],
      linkedExternalBank: {
        bankName: 'Banco Santander',
        iban: 'ES04 0049 1500 0512 3456 7890',
        holderName: 'Javier Rodríguez Alonso'
      }
    },
    signatureDetails: {
      signedAt: '29/09/2026 11:15 CEST',
      otpCode: '492018',
      ipAddress: '80.28.14.88',
      signatureHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      asnefConsent: true,
      promissoryNoteConsent: true,
      platformTermsConsent: true
    },
    advisorActionLogs: [
      {
        id: 'LOG-03',
        advisorId: 'ADV-02',
        advisorName: 'Elena García Serrano',
        timestamp: '29/09/2026 11:40',
        actionType: 'documento_solicitado',
        summary: 'Se solicita Modelo 130 IRPF del segundo trimestre para validar ingresos de autónomo.',
        clientNotes: 'Pendiente de adjuntar por el cliente en su área PWA.'
      }
    ],
    uploadedDocuments: [
      {
        id: 'DOC-03',
        documentCategory: 'DNI_ANVERSO',
        fileName: 'dni_javier_rodriguez.pdf',
        status: 'Verificado',
        uploadedAt: '29/09/2026 11:10'
      }
    ],
    adminNotes: 'Pendiente validar justificación de ingresos trimestrales de autónomo (Modelo 130).'
  },
  {
    id: 'INSTA-ES-638201',
    createdAt: '30 de septiembre de 2026',
    updatedAt: '30 de septiembre de 2026',
    status: 'Pendiente',
    currentStep: 1,
    assignedAdvisorId: 'ADV-03',
    assignedAdvisorName: 'David Sánchez Pardo',
    personalData: {
      firstName: 'Diego',
      lastName: 'Silva Morales',
      documentType: 'NIE',
      documentNumber: 'Y8920143P',
      documentExpiryDate: '2027-08-30',
      birthDate: '1995-09-18',
      nationality: 'Colombia',
      countryOfResidence: 'España',
      phone: '+34 690 451 882',
      email: 'diego.silva@gmail.com',
      hasSpanishResidenceCard: true
    },
    economicData: {
      province: 'Valencia',
      city: 'Valencia',
      postalCode: '46002',
      address: 'Calle Colón 28, 3º A',
      housingType: 'Alquiler',
      occupation: 'Contrato Temporal',
      monthlyIncome: 1650,
      monthlyExpenses: 650,
      companyName: 'Hostelería Levante SL',
      seniorityMonths: 14,
      loanPurpose: 'Reparación de Vehículo / Movilidad'
    },
    bankDetails: {
      bankName: 'BBVA',
      iban: 'ES18 0182 0340 1020 3040 5060',
      accountType: 'Cuenta Nómina',
      isOwnerCertified: true
    },
    loanDetails: {
      ...calculateLoanBreakdown(450, 30),
      loanPurpose: 'Reparación de Vehículo / Movilidad'
    },
    approvedAmount: 450,
    digitalAccount: {
      accountNumber: 'ES18 0182 0340 1020 3040 5060',
      bicSwift: 'INSTESMMXXX',
      balance: 0,
      creditQuota: 900,
      usedQuota: 0,
      transactions: [],
      linkedExternalBank: {
        bankName: 'BBVA',
        iban: 'ES18 0182 0340 1020 3040 5060',
        holderName: 'Diego Silva Morales'
      }
    },
    signatureDetails: {
      signedAt: '30/09/2026 09:20 CEST',
      otpCode: '319082',
      ipAddress: '213.97.45.10',
      signatureHash: 'f4e3d2c1b0a9876543210fedcba9876543210fedcba9876543210fedcba98765',
      asnefConsent: true,
      promissoryNoteConsent: true,
      platformTermsConsent: true
    },
    advisorActionLogs: [
      {
        id: 'LOG-04',
        advisorId: 'ADV-03',
        advisorName: 'David Sánchez Pardo',
        timestamp: '30/09/2026 09:25',
        actionType: 'nota_interna',
        summary: 'Nueva solicitud registrada por el usuario extranjero residente (NIE Y8920143P).',
        clientNotes: 'Asignado para validación de tarjeta de residencia TIE y última nómina.'
      }
    ],
    uploadedDocuments: [],
    adminNotes: 'Nuevo cliente en cola de verificación. Residente con NIE vigente.'
  }
];

export const INITIAL_LIVE_QUERIES: ClientLiveQuery[] = [
  {
    id: 'QRY-01',
    applicationId: 'INSTA-ES-821943',
    clientName: 'Carmen Navarro Gómez',
    clientContact: '+34 645 892 104',
    topic: 'Consulta sobre transferencia por Bizum a mi cuenta CaixaBank',
    status: 'pendiente',
    assignedAdvisorId: 'ADV-01',
    createdAt: 'Hace 8 minutos',
    lastMessage: 'Hola, veo los 750 € en mi Cuenta Digital. ¿Cómo puedo pasarlos a mi Bizum?',
    unreadByAdvisor: true,
    history: [
      {
        sender: 'cliente',
        text: 'Hola, veo los 750 € en mi Cuenta Digital. ¿Cómo puedo pasarlos a mi Bizum?',
        time: '15:52'
      }
    ]
  },
  {
    id: 'QRY-02',
    applicationId: 'INSTA-ES-910452',
    clientName: 'Javier Rodríguez Alonso',
    clientContact: '+34 678 123 905',
    topic: 'Envío de Modelo 130 de IRPF para autónomos',
    status: 'en_gestion',
    assignedAdvisorId: 'ADV-02',
    createdAt: 'Hace 25 minutos',
    lastMessage: 'Ya tengo descargado el PDF del Modelo 130 de la Agencia Tributaria. ¿Lo subo por la app PWA?',
    unreadByAdvisor: false,
    history: [
      {
        sender: 'cliente',
        text: 'Buenas tardes, ¿qué documento exacto necesitáis para la actividad de autónomo?',
        time: '15:20'
      },
      {
        sender: 'asesor',
        text: 'Hola Javier, necesitamos el Modelo 130 del último trimestre presentado ante Hacienda o el certificado de bases de cotización de la Seguridad Social.',
        time: '15:24'
      },
      {
        sender: 'cliente',
        text: 'Ya tengo descargado el PDF del Modelo 130 de la Agencia Tributaria. ¿Lo subo por la app PWA?',
        time: '15:35'
      }
    ]
  },
  {
    id: 'QRY-03',
    applicationId: 'INSTA-ES-638201',
    clientName: 'Diego Silva Morales',
    clientContact: '+34 690 451 882',
    topic: 'Tiempo estimado de aprobación con NIE',
    status: 'pendiente',
    assignedAdvisorId: 'ADV-03',
    createdAt: 'Hace 40 minutos',
    lastMessage: 'Acabo de radicar la solicitud con mi NIE, ¿cuánto tiempo suele tardar la aprobación?',
    unreadByAdvisor: true,
    history: [
      {
        sender: 'cliente',
        text: 'Acabo de radicar la solicitud con mi NIE, ¿cuánto tiempo suele tardar la aprobación?',
        time: '15:15'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-01',
    recipientRole: 'admin',
    title: '🔔 Nueva Solicitud Radicada',
    message: 'Diego Silva ha solicitado 450 € a 30 días para reparación de vehículo (NIE Y8920143P).',
    type: 'info',
    timestamp: 'Hace 10 minutos',
    read: false,
    linkAction: 'solicitudes'
  },
  {
    id: 'NOTIF-02',
    recipientRole: 'admin',
    title: '💬 Consulta en Burbuja de Chat',
    message: 'Carmen Navarro ha abierto una consulta directa sobre retiro por Bizum.',
    type: 'urgent',
    timestamp: 'Hace 8 minutos',
    read: false,
    linkAction: 'asesores'
  },
  {
    id: 'NOTIF-03',
    recipientRole: 'advisor',
    recipientId: 'ADV-01',
    title: '👤 Cliente Asignado a tu Cartera',
    message: 'Se te ha asignado la solicitud de Carmen Navarro (INSTA-ES-821943). Préstamo desembolsado.',
    type: 'success',
    timestamp: 'Hace 30 minutos',
    read: false
  },
  {
    id: 'NOTIF-04',
    recipientRole: 'user',
    recipientId: 'USR-ES-01',
    title: '🎉 ¡Préstamo Desembolsado con Éxito!',
    message: 'Tienes 750,00 € disponibles en tu Cuenta Digital Instacredit. Puedes transferirlos a tu banco o pagar cuotas.',
    type: 'success',
    timestamp: 'Hace 1 hora',
    read: false
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'REV-01',
    author: 'Alejandro Morales',
    city: 'Madrid (Barrio de Salamanca)',
    rating: 5,
    date: '27 de septiembre de 2026',
    comment: 'Increíble rapidez. Necesitaba 600 € para la reparación del coche antes de viajar y en 15 minutos tenía el dinero en mi cuenta del Santander por Bizum. Contratos 100% claros conforme a la ley española.',
    verifiedLoan: true,
    amountRequested: 600
  },
  {
    id: 'REV-02',
    author: 'Montserrat Puig',
    city: 'Barcelona (Eixample)',
    rating: 5,
    date: '25 de septiembre de 2026',
    comment: 'La mejor fintech en España. Sin papeleos absurdos, todo firmado digitalmente con token OTP y la Cuenta Digital te permite gestionar el saldo a tu ritmo. Totalmente recomendado.',
    verifiedLoan: true,
    amountRequested: 1000
  },
  {
    id: 'REV-03',
    author: 'Carlos Benítez',
    city: 'Valencia',
    rating: 5,
    date: '22 de septiembre de 2026',
    comment: 'Excelente atención al cliente por WhatsApp. Tenía dudas sobre el aval y el asesor Carlos me explicó el desglose con total transparencia. Pagué a los 20 días sin ninguna penalización.',
    verifiedLoan: true,
    amountRequested: 500
  },
  {
    id: 'REV-04',
    author: 'Beatriz Herrera',
    city: 'Sevilla',
    rating: 5,
    date: '19 de septiembre de 2026',
    comment: 'Súper fiable. Cumple estrictamente con las directrices del Banco de España y el contrato de crédito al consumo te llega al correo de inmediato en PDF con sello oficial.',
    verifiedLoan: true,
    amountRequested: 850
  },
  {
    id: 'REV-05',
    author: 'Iñigo Etxebarria',
    city: 'Bilbao',
    rating: 5,
    date: '15 de septiembre de 2026',
    comment: 'Me aprobaron 1.200 € para comprar material de trabajo de mi empresa. El interés diario es transparente y la devolución por transferencia SEPA instantánea es muy cómoda.',
    verifiedLoan: true,
    amountRequested: 1200
  },
  {
    id: 'REV-06',
    author: 'Raquel Domínguez',
    city: 'Málaga',
    rating: 5,
    date: '10 de septiembre de 2026',
    comment: 'La app instalable PWA funciona como si fuera la app de un banco tradicional. Consulto mi saldo, veo mis cuotas y descargo mi pagaré sin complicaciones.',
    verifiedLoan: true,
    amountRequested: 400
  }
];

export const FAQ_ARTICLES = [
  {
    id: 'faq-1',
    category: 'Normativa y Legalidad en España',
    question: '¿Está regulado INSTACREDIT en España y qué marco legal ampara los préstamos?',
    answer: 'Sí. INSTACREDIT ESPAÑA FINTECH S.L. opera bajo el marco regulatorio español y comunitario: la Ley 16/2011, de 24 de junio, de contratos de crédito al consumo (incorporando la Directiva Europea 2008/48/CE), la Ley 22/2007 sobre comercialización a distancia de servicios financieros y la supervisión en materia de transparencia bancaria del Banco de España (BdE). Asimismo, los contratos y pagarés cuentan con firma electrónica cualificada conforme al Reglamento eIDAS (UE) 910/2014 y la Ley 6/2020.'
  },
  {
    id: 'faq-2',
    category: 'Cuenta Digital con IBAN',
    question: '¿Por qué cada usuario recibe una Cuenta Digital independiente y cómo funciona el saldo?',
    answer: 'Al darte de alta en INSTACREDIT, se te asigna una Cuenta Digital independiente con IBAN español. Toda cuenta inicia con saldo en 0 € hasta que se produce la aprobación y desembolso del crédito, o hasta que efectúes una recarga voluntaria por Bizum o tarjeta. Este modelo te otorga autonomía absoluta: puedes retirar los fondos a tu banco habitual (Santander, BBVA, CaixaBank, ING, etc.) o usarlos para abonar cuotas sin comisiones abusivas.'
  },
  {
    id: 'faq-3',
    category: 'Extranjeros y Residentes',
    question: '¿Pueden solicitar préstamos personas extranjeras residentes en España?',
    answer: 'Sí. En INSTACREDIT atendemos tanto a ciudadanos españoles con DNI como a ciudadanos extranjeros con NIE comunitario o TIE (Tarjeta de Identidad de Extranjero / Permiso de Residencia vigente) con cuenta bancaria activa en España e ingresos demostrables (nómina, pensión o rendimiento de autónomos).'
  },
  {
    id: 'faq-4',
    category: 'Ficheros de Morosidad (ASNEF / CIRBE)',
    question: '¿Consultáis ASNEF, Experian o CIRBE y qué ocurre si tengo una deuda registrada?',
    answer: 'En cumplimiento del deber de concesión responsable de crédito, consultamos ficheros de solvencia patrimonial (ASNEF/Equifax, Badexcug/Experian y CIRBE del Banco de España). Una anotación por discrepancias comerciales (ej. telefonía) no implica el rechazo automático; nuestro algoritmo evalúa tu capacidad de pago real e ingresos mensuales recurrentes.'
  },
  {
    id: 'faq-5',
    category: 'Desembolso y Medios de Pago',
    question: '¿Cómo recibo el dinero y cómo puedo pagar mi cuota?',
    answer: 'El desembolso se acredita en cuestión de minutos en tu Cuenta Digital Instacredit. Puedes transferirlo de inmediato a tu banco por Transferencia SEPA Instantánea o Bizum. Para abonar tus cuotas, dispones de 3 vías sencillas: (1) Débito directo de tu saldo digital; (2) Pago exprés por Bizum indicando tu número de radicado; (3) Tarjeta de débito/crédito Visa o Mastercard con verificación 3D Secure.'
  },
  {
    id: 'faq-6',
    category: 'Derecho de Desistimiento y Cancelación',
    question: '¿Puedo cancelar o devolver el préstamo antes del plazo pactado?',
    answer: 'Por supuesto. Conforme al artículo 28 de la Ley 16/2011, tienes derecho al pago anticipado en cualquier momento sin penalizaciones ni comisiones por cancelación total o parcial, pagando únicamente los intereses devengados hasta la fecha exacta de abono. Asimismo, dispones de un plazo de desistimiento legal de catorce (14) días naturales desde la firma del contrato sin necesidad de justificación.'
  }
];
