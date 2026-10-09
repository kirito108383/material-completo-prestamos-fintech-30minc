import { LoanStatus } from './index';

export type CommunicationChannel = 'email' | 'sms' | 'whatsapp';

export interface DynamicStatusImageConfig {
  status: LoanStatus | 'Prorroga' | 'Fidelizacion' | 'Seguridad';
  imageSrc: string;
  bannerTitle: string;
  bannerSubtitle: string;
  themeColor: string;
  badgeText: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  channel: CommunicationChannel;
  loanStatusTrigger: LoanStatus | 'cualquiera';
  subject?: string; // For Email
  content: string; // Plain text or HTML body with dynamic tags
  callToActionLabel?: string;
  callToActionUrl?: string;
  
  // Dynamic Image Integration
  autoAttachStatusImage: boolean;
  overrideImageSrc?: string;
  customBannerTitle?: string;
  customBannerSubtitle?: string;
  
  // Metadata
  description: string;
  badge: string;
  badgeColor: string;
  updatedAt: string;
  isSystemDefault?: boolean;
}

export interface TemplateVariableOption {
  tag: string;
  description: string;
  exampleValue: string;
}

export const TEMPLATE_VARIABLES: TemplateVariableOption[] = [
  { tag: '{NOMBRE_CLIENTE}', description: 'Nombre completo del solicitante', exampleValue: 'Carmen Gómez' },
  { tag: '{PRIMER_NOMBRE}', description: 'Primer nombre de pila', exampleValue: 'Carmen' },
  { tag: '{MONTO_EUR}', description: 'Importe del crédito con formato en euros', exampleValue: '750,00 €' },
  { tag: '{EXPEDIENTE_ID}', description: 'Número de radicado / expediente', exampleValue: 'INSTA-ES-821943' },
  { tag: '{IBAN_DIGITAL}', description: 'Cuenta Digital IBAN asignada', exampleValue: 'ES91 2100 0418 4502 0005 1234' },
  { tag: '{FECHA_VENCIMIENTO}', description: 'Fecha límite de pago o primera cuota', exampleValue: '30 de octubre de 2026' },
  { tag: '{NOMBRE_ASESOR}', description: 'Nombre del asesor financiero asignado', exampleValue: 'Carlos Mendoza' },
  { tag: '{TELEFONO_ASESOR}', description: 'Teléfono corporativo del asesor', exampleValue: '+34 612 345 678' },
  { tag: '{ENLACE_PORTAL}', description: 'Enlace web directo a la formalización o consulta', exampleValue: 'https://instacredit.es' },
  { tag: '{BANCO_CLIENTE}', description: 'Entidad bancaria del usuario', exampleValue: 'Banco Santander' },
  { tag: '{ESTADO_SOLICITUD}', description: 'Estado actual del préstamo', exampleValue: 'Aprobado' }
];
