export type LoanTerm = 30 | 60 | 90 | 180 | 365 | 730 | 1095 | 1825 | number;

export type LoanStatus = 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Desembolsado' | 'Rechazado';

export type SpanishDocumentType = 'DNI' | 'NIE' | 'Pasaporte';

export type EmploymentType = 
  | 'Contrato Indefinido'
  | 'Contrato Temporal'
  | 'Autónomo / Profesional'
  | 'Funcionario Público'
  | 'Jubilado / Pensionista'
  | 'Desempleado con Prestación'
  | 'Otro';

export type LoanPurpose = 
  | 'Reformas y Mejoras del Hogar'
  | 'Gastos Médicos / Salud'
  | 'Reparación de Vehículo / Movilidad'
  | 'Negocio / Capital Autónomos'
  | 'Educación / Cursos o Máster'
  | 'Imprevisto o Calamidad Familiar'
  | 'Unificación de Pagos o Facturas'
  | 'Viaje / Gastos Personales';

export interface UserAccount {
  id: string; // e.g. "USR-ES-9102"
  email: string;
  passwordHash: string; // Plain/hashed for demo
  fullName: string;
  documentType: SpanishDocumentType;
  documentNumber: string;
  phone: string;
  role: 'customer' | 'advisor' | 'admin';
  createdAt: string;
  applicationId?: string;
  avatar?: string;
}

export interface Advisor {
  id: string; // e.g. "ADV-01"
  name: string;
  email: string;
  roleTitle: string;
  avatar: string;
  phone: string;
  specialty: string;
  rating: number;
  assignedCount: number;
  isOnline: boolean;
}

export interface AdvisorActionLog {
  id: string;
  advisorId: string;
  advisorName: string;
  timestamp: string;
  actionType: 'llamada' | 'whatsapp' | 'email' | 'aprobacion' | 'documento_solicitado' | 'bizum_enviado' | 'cambio_estado' | 'nota_interna';
  summary: string;
  clientNotes?: string;
}

export interface ClientLiveQuery {
  id: string;
  applicationId?: string;
  clientName: string;
  clientContact: string;
  topic: string;
  status: 'pendiente' | 'en_gestion' | 'resuelta';
  assignedAdvisorId: string;
  createdAt: string;
  lastMessage: string;
  unreadByAdvisor: boolean;
  history: {
    sender: 'cliente' | 'asesor' | 'sistema';
    text: string;
    time: string;
  }[];
}

export interface AppNotification {
  id: string;
  recipientRole: 'user' | 'advisor' | 'admin';
  recipientId?: string; // Specific user ID or advisor ID, or empty for all
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
  linkAction?: string;
  badge?: string;
}

export interface BankTransaction {
  id: string;
  type: 'Desembolso de Crédito' | 'Recarga Bizum' | 'Recarga Tarjeta' | 'Pago de Cuota' | 'Transferencia SEPA' | 'Ajuste Administrativo';
  amount: number; // In Euros (€)
  date: string;
  description: string;
  reference: string;
  status: 'Completado' | 'En Proceso' | 'Pendiente';
  balanceAfter: number;
}

export interface DigitalBankAccount {
  accountNumber: string; // IBAN format e.g. "ES91 2100 0418 4502 0005 1234"
  bicSwift: string; // e.g. "INSTESMMXXX"
  balance: number; // Starts at 0 € until recharge or disbursement
  creditQuota: number; // In Euros (€)
  usedQuota: number;
  transactions: BankTransaction[];
  linkedExternalBank?: {
    bankName: string;
    iban: string;
    holderName: string;
  };
}

export interface InstallmentQuota {
  quotaNumber: number;
  dueDate: string;
  capitalAmount: number;
  interestAmount: number;
  fgaAmount: number;
  techFeeAmount: number;
  ivaAmount: number;
  totalQuota: number;
  status: 'Pendiente' | 'Pagado' | 'En Mora';
}

export interface LoanBreakdown {
  capital: number; // In Euros (€)
  termDays: LoanTerm;
  dailyRate: number; // e.g. 0.00065 (0.065% daily)
  monthlyRate: number; // e.g. 0.0195 (1.95% monthly / 26.8% TAE)
  interestAmount: number;
  fgaGuaranteeRate: number; // e.g. 0.10 (10% European Risk Guarantee)
  fgaGuaranteeAmount: number;
  technologyAndSignature: number; // e.g. 18.50 € eIDAS compliance
  ivaRate: number; // 0.21 (21% IVA España)
  ivaAmount: number;
  totalToPay: number;
  disbursementDate: string;
  dueDate: string;
  loanPurpose?: LoanPurpose;
  quotas?: InstallmentQuota[];
}

export interface BankDisbursementDetails {
  bankName: string;
  iban: string;
  accountType: 'Cuenta Corriente' | 'Cuenta Nómina' | 'Cuenta Digital';
  isOwnerCertified: boolean;
}

export interface ApplicantPersonalData {
  firstName: string;
  lastName: string;
  documentType: SpanishDocumentType;
  documentNumber: string; // DNI (8 digits + 1 letter) or NIE (X/Y/Z + 7 digits + 1 letter)
  documentExpiryDate: string;
  birthDate: string;
  nationality: string;
  countryOfResidence: string; // Spain or other country
  phone: string; // Spanish phone (+34)
  email: string;
  hasSpanishResidenceCard?: boolean;
}

export interface ApplicantEconomicData {
  province: string; // e.g. Madrid, Barcelona, Valencia...
  city: string;
  postalCode: string; // 5 digits e.g. 28046
  address: string;
  housingType: 'Propiedad con Hipoteca' | 'Propiedad Pagada' | 'Alquiler' | 'Familiar';
  occupation: EmploymentType;
  monthlyIncome: number; // In Euros (€)
  monthlyExpenses: number; // Rent/Mortgage, bills
  companyName?: string;
  seniorityMonths?: number;
  loanPurpose: LoanPurpose;
}

export interface UploadedFileRecord {
  id: string;
  documentCategory: 'DNI_ANVERSO' | 'DNI_REVERSO' | 'NOMINA_IRPF' | 'JUSTIFICANTE_IBAN' | 'RECIBO_DOMICILIO' | 'FOTO_ACTIVIDAD_LABORAL' | 'SELFIE_VERIFICACION';
  fileName: string;
  status: 'Verificado' | 'En Revisión' | 'Rechazado';
  uploadedAt: string;
  fileDataUrl?: string;
}

export interface VirtualBankCard {
  id: string;
  cardType: 'Débito Instantáneo' | 'Crédito Revolving Oro';
  cardNumberMasked: string;
  cardNumberFull: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
  status: 'Activa' | 'Congelada' | 'Pendiente Activación';
  dailyLimit: number;
  linkedBalanceOrQuota: number;
}

export interface CreditApplication {
  id: string; // e.g. "INSTA-ES-821943"
  createdAt: string;
  updatedAt: string;
  status: LoanStatus;
  currentStep: number;
  personalData: ApplicantPersonalData;
  economicData: ApplicantEconomicData;
  bankDetails: BankDisbursementDetails;
  loanDetails: LoanBreakdown;
  approvedAmount?: number; // In Euros (€)
  digitalAccount: DigitalBankAccount;
  assignedAdvisorId?: string; // Assigned advisor ID e.g. "ADV-01"
  assignedAdvisorName?: string;
  advisorActionLogs: AdvisorActionLog[];
  uploadedDocuments: UploadedFileRecord[];
  signatureDetails: {
    signedAt: string;
    otpCode: string;
    ipAddress: string;
    signatureHash: string; // SHA-256 eIDAS token
    asnefConsent: boolean; // ASNEF / Experian / CIRBE check
    promissoryNoteConsent: boolean;
    platformTermsConsent: boolean;
  };
  adminNotes?: string;
}

export interface PlatformConfig {
  phoneNational: string;
  phoneMadrid: string;
  whatsappNumber: string;
  whatsappUrl: string;
  supportEmail: string;
  businessHoursWeekdays: string;
  businessHoursWeekends: string;
  companyName: string;
  companyNif: string; // NIF B-89412093
  companyAddress: string;
  supervisionEntity: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  tiktokUrl: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string; // Madrid, Barcelona, Valencia, Sevilla, Bilbao, etc.
  rating: number;
  date: string;
  comment: string;
  verifiedLoan: boolean;
  amountRequested?: number;
}

export interface PqrsRecord {
  id: string; // e.g. "REC-BDE-90214"
  createdAt: string;
  applicantName: string;
  documentNumber: string;
  email: string;
  phone: string;
  type: 'Reclamación' | 'Queja' | 'Consulta' | 'Derecho de Retracto' | 'Agradecimiento';
  subject: string;
  description: string;
  status: 'Radicado' | 'En Trámite' | 'Resuelto';
  officialResponseDate: string; // 15 working days legal deadline
  responseDetails?: string;
}

export type DocumentType = 
  | 'contrato_mutuo'
  | 'condiciones_generales'
  | 'politica_privacidad'
  | 'consentimiento_lopd'
  | 'pagare_en_blanco'
  | 'autorizacion_centrales'
  | 'contrato_apertura_plataforma';

export interface FacebookAdCampaign {
  id: string;
  title: string;
  category: 'Personal' | 'Autónomos' | 'Reformas' | 'Unificación' | 'Urgente';
  targetAudience: string;
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
  theme: 'blue' | 'emerald' | 'navy' | 'gold';
  badgeText: string;
  amountHighlight: string;
  bullets: string[];
  complianceDisclaimer: string;
}

export interface WhatsAppCustomerFormSubmission {
  id: string;
  formType: 'solicitud_rapida' | 'verificacion_iban' | 'confirmacion_cuota' | 'aplazamiento';
  customerName: string;
  phone: string;
  submittedAt: string;
  data: Record<string, any>;
  status: 'completado' | 'en_revision' | 'aprobado';
}
