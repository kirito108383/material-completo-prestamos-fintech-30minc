import { LoanStatus, CreditApplication } from '../types';
import { CommunicationTemplate, DynamicStatusImageConfig } from '../types/communicationTemplates';
import { formatEUR } from './financialCalculations';

export const STATUS_IMAGE_CONFIGS: Record<LoanStatus, DynamicStatusImageConfig> = {
  Pendiente: {
    status: 'Pendiente',
    imageSrc: '/src/assets/images/ws_bienvenida_1790860195015.jpg',
    bannerTitle: 'Bienvenido a INSTACREDIT España',
    bannerSubtitle: 'Tu Asesor Personal • Soluciones Financieras a tu Medida',
    themeColor: '#0066FF',
    badgeText: 'Solicitud Recibida'
  },
  'En Revisión': {
    status: 'En Revisión',
    imageSrc: '/src/assets/images/ws_seguimiento_1790860216261.jpg',
    bannerTitle: 'INSTACREDIT España • Mesa de Riesgos',
    bannerSubtitle: 'Compromiso de Calidad • Garantía de Respuesta en 30 min',
    themeColor: '#D97706',
    badgeText: 'En Estudio Prioritario'
  },
  Aprobado: {
    status: 'Aprobado',
    imageSrc: '/src/assets/images/ws_cierre_aprob_1790860226017.jpg',
    bannerTitle: '¡Crédito Concedido! • INSTACREDIT España',
    bannerSubtitle: 'Firma Notarial eIDAS en 2 Minutos • Sin Papeleos',
    themeColor: '#059669',
    badgeText: '¡Aprobado Satisfactoriamente!'
  },
  Desembolsado: {
    status: 'Desembolsado',
    imageSrc: '/src/assets/images/ws_desembolso_bizum_1790894749766.jpg',
    bannerTitle: 'Confirmación de Desembolso • INSTACREDIT España',
    bannerSubtitle: 'Fondos Acreditados • Retiro Inmediato por Bizum o SEPA',
    themeColor: '#059669',
    badgeText: 'Fondos Disponibles'
  },
  Rechazado: {
    status: 'Rechazado',
    imageSrc: '/src/assets/images/ws_seguridad_antifraude_1790894760624.jpg',
    bannerTitle: 'Garantía y Seguridad • INSTACREDIT España',
    bannerSubtitle: 'Cero Cobros o Anticipos Previos • Ley 16/2011',
    themeColor: '#DC2626',
    badgeText: 'Resolución Notificada'
  }
};

/**
 * Resolves the dynamic image, banner title, and subtitle for a template given a loan application.
 */
export function resolveTemplateImage(
  template: CommunicationTemplate,
  app?: CreditApplication | null
): { imageSrc: string; bannerTitle: string; bannerSubtitle: string; themeColor: string; badgeText: string } {
  // If the template has an explicit manual override image
  if (template.overrideImageSrc && !template.autoAttachStatusImage) {
    return {
      imageSrc: template.overrideImageSrc,
      bannerTitle: template.customBannerTitle || 'INSTACREDIT España • Tu Asesor Personal',
      bannerSubtitle: template.customBannerSubtitle || 'Soluciones Financieras a tu Medida',
      themeColor: '#0066FF',
      badgeText: template.badge || 'Comunicación Oficial'
    };
  }

  // Determine the effective status
  const effectiveStatus: LoanStatus =
    app?.status ||
    (template.loanStatusTrigger !== 'cualquiera' ? (template.loanStatusTrigger as LoanStatus) : 'Pendiente');

  const config = STATUS_IMAGE_CONFIGS[effectiveStatus] || STATUS_IMAGE_CONFIGS['Pendiente'];

  return {
    imageSrc: template.overrideImageSrc || config.imageSrc,
    bannerTitle: template.customBannerTitle || config.bannerTitle,
    bannerSubtitle: template.customBannerSubtitle || config.bannerSubtitle,
    themeColor: config.themeColor,
    badgeText: config.badgeText
  };
}

/**
 * Replaces dynamic variables in text ({NOMBRE_CLIENTE}, {MONTO_EUR}, etc.)
 */
export function interpolateVariables(
  text: string,
  app?: CreditApplication | null,
  advisorName?: string,
  baseUrl?: string
): string {
  if (!text) return '';

  const clientName = app ? `${app.personalData.firstName} ${app.personalData.lastName}` : 'Carmen Gómez';
  const firstName = clientName.split(' ')[0];
  const capitalAmount = app ? formatEUR(app.approvedAmount || app.loanDetails.capital) : '750,00 €';
  const radicadoId = app ? app.id : 'INSTA-ES-821943';
  const digitalIban = app ? app.digitalAccount.accountNumber : 'ES91 2100 0418 4502 0005 1234';
  const dueDate = app ? app.loanDetails.dueDate : '30 de octubre de 2026';
  const effectiveAdvisorName = advisorName || 'Carlos Mendoza';
  const advisorPhone = '+34 612 345 678';
  const effectiveBaseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://instacredit.es');
  const bankName = app?.bankDetails?.bankName || 'Banco Santander';
  const status = app?.status || 'Aprobado';

  return text
    .replace(/{NOMBRE_CLIENTE}/g, clientName)
    .replace(/{PRIMER_NOMBRE}/g, firstName)
    .replace(/{MONTO_EUR}/g, capitalAmount)
    .replace(/{EXPEDIENTE_ID}/g, radicadoId)
    .replace(/{IBAN_DIGITAL}/g, digitalIban)
    .replace(/{FECHA_VENCIMIENTO}/g, dueDate)
    .replace(/{NOMBRE_ASESOR}/g, effectiveAdvisorName)
    .replace(/{TELEFONO_ASESOR}/g, advisorPhone)
    .replace(/{ENLACE_PORTAL}/g, effectiveBaseUrl)
    .replace(/{BANCO_CLIENTE}/g, bankName)
    .replace(/{ESTADO_SOLICITUD}/g, status);
}

/**
 * Builds a complete, responsive HTML Email where the dynamic status image is an integral hero header banner.
 */
export function generateHtmlEmail(options: {
  template: CommunicationTemplate;
  app?: CreditApplication | null;
  advisorName?: string;
  baseUrl?: string;
}): string {
  const { template, app, advisorName, baseUrl } = options;
  const imageInfo = resolveTemplateImage(template, app);
  const subject = interpolateVariables(template.subject || 'Notificación Oficial INSTACREDIT España', app, advisorName, baseUrl);
  const bodyText = interpolateVariables(template.content, app, advisorName, baseUrl);
  const ctaLabel = template.callToActionLabel || 'Acceder a Mi Expediente en 1 Clic';
  const ctaUrl = interpolateVariables(template.callToActionUrl || '{ENLACE_PORTAL}', app, advisorName, baseUrl);
  const clientName = app ? `${app.personalData.firstName} ${app.personalData.lastName}` : 'Carmen Gómez';
  const capitalAmount = app ? formatEUR(app.approvedAmount || app.loanDetails.capital) : '750,00 €';
  const radicadoId = app ? app.id : 'INSTA-ES-821943';
  const digitalIban = app ? app.digitalAccount.accountNumber : 'ES91 2100 0418 4502 0005 1234';

  const fullImageSrc = imageInfo.imageSrc.startsWith('http')
    ? imageInfo.imageSrc
    : `${typeof window !== 'undefined' ? window.location.origin : 'https://instacredit.es'}${imageInfo.imageSrc}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #F4F7FB; font-family: 'Segoe UI', Arial, sans-serif; color: #0F172A; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(11,27,61,0.08); border: 1px solid #E2E8F0;">
    
    <!-- Top Branded Header Bar -->
    <tr>
      <td style="background-color: #0B1B3D; padding: 18px 24px; text-align: left;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td>
              <span style="font-size: 20px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px;">
                INSTACREDIT <span style="color: #00E599;">España</span>
              </span>
              <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-top: 2px;">
                Plataforma Fintech Supervisada • Ley 16/2011
              </div>
            </td>
            <td align="right">
              <span style="display: inline-block; background-color: rgba(0, 229, 153, 0.15); color: #00E599; border: 1px solid rgba(0, 229, 153, 0.4); padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
                ${imageInfo.badgeText}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- INTEGRATED DYNAMIC HERO IMAGE (SEAMLESS PART OF THE MESSAGE) -->
    <tr>
      <td style="padding: 0; position: relative; background-color: #0B1B3D;">
        <img src="${fullImageSrc}" alt="${imageInfo.bannerTitle}" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
        <!-- Institutional Banner directly attached under/over the image -->
        <div style="background-color: #FFFFFF; padding: 12px 20px; border-bottom: 2px solid #E2E8F0; text-align: center;">
          <div style="font-size: 14px; font-weight: 900; color: #0B1B3D; letter-spacing: -0.3px;">
            ${imageInfo.bannerTitle}
          </div>
          <div style="font-size: 11px; color: #64748B; font-weight: 600; margin-top: 2px;">
            ${imageInfo.bannerSubtitle}
          </div>
        </div>
      </td>
    </tr>

    <!-- Message Content Body -->
    <tr>
      <td style="padding: 28px 24px;">
        <div style="font-size: 15px; color: #1E293B; white-space: pre-line; line-height: 1.65;">
          ${bodyText}
        </div>

        <!-- Financial Summary Card Embedded -->
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0; background-color: #F8FAFC; border-radius: 14px; border: 1px solid #E2E8F0; overflow: hidden;">
          <tr>
            <td style="padding: 14px 18px; border-bottom: 1px solid #E2E8F0; background-color: #F1F5F9;">
              <span style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                Resumen Oficial de la Operación
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 18px;">
              <table width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px;">
                <tr>
                  <td style="color: #64748B; font-weight: 600;">Titular:</td>
                  <td align="right" style="color: #0F172A; font-weight: 800;">${clientName}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; font-weight: 600;">Expediente:</td>
                  <td align="right" style="color: #0066FF; font-weight: 800; font-family: monospace;">#${radicadoId}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; font-weight: 600;">Importe:</td>
                  <td align="right" style="color: #059669; font-weight: 900; font-size: 16px;">${capitalAmount}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; font-weight: 600;">Cuenta Digital IBAN:</td>
                  <td align="right" style="color: #0F172A; font-weight: 700; font-family: monospace; font-size: 11px;">${digitalIban}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Call to Action Button -->
        <div style="text-align: center; margin: 30px 0 10px 0;">
          <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%); color: #FFFFFF; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0, 102, 255, 0.35);">
            ${ctaLabel} →
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer with Banco de España, Ley 16/2011 Compliance -->
    <tr>
      <td style="background-color: #F8FAFC; padding: 20px 24px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #64748B; line-height: 1.5;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #334155;">
          INSTACREDIT ESPAÑA FINTECH S.L. • NIF B-89412093
        </p>
        <p style="margin: 0 0 6px 0;">
          Paseo de la Castellana 95, 28046 Madrid, España.
        </p>
        <p style="margin: 0; font-size: 10px; color: #94A3B8;">
          Regulado bajo la Ley 16/2011 de Contratos de Crédito al Consumo y supervisión de conducta del Banco de España. Firma cualificada eIDAS (Reglamento UE 910/2014).
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
