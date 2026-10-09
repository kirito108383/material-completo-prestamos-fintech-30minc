import { jsPDF } from 'jspdf';
import { CreditApplication, DocumentType } from '../types';
import { RenderedLegalDocument } from './legalTemplates';
import { formatEUR } from './financialCalculations';

export function exportDocumentToPdf(doc: RenderedLegalDocument): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Process each of the 4 pages
  doc.pages.forEach((page, index) => {
    if (index > 0) {
      pdf.addPage();
    }

    // Outer & Inner Legal Document Frame (Notarial Border)
    pdf.setDrawColor(11, 27, 61);
    pdf.setLineWidth(0.5);
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);
    pdf.setDrawColor(180, 195, 215);
    pdf.setLineWidth(0.2);
    pdf.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);

    // Top Brand Bar (Instacredit Blue & Emerald)
    pdf.setFillColor(11, 27, 61); // #0B1B3D Deep Tech Navy
    pdf.rect(10, 10, pageWidth - 20, 17, 'F');

    pdf.setFillColor(0, 102, 255); // #0066FF Electric Blue
    pdf.rect(10, 27, pageWidth - 20, 1.5, 'F');

    // Header Content
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('INSTACREDIT ESPAÑA FINTECH S.L. — DOCUMENTO CONTRACTUAL OFICIAL', margin, 18.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text(`NIF: B-89412093 | LEY 16/2011 CRÉDITO AL CONSUMO | REF: ${doc.id}`, margin, 23.5);

    // Right Header Circular/Box Seal Indicator
    pdf.setFillColor(0, 229, 153);
    pdf.roundedRect(pageWidth - margin - 42, 13, 42, 11, 1.5, 1.5, 'F');
    pdf.setTextColor(11, 27, 61);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.text('SELLO OFICIAL eIDAS', pageWidth - margin - 21, 17.5, { align: 'center' });
    pdf.setFontSize(6);
    pdf.text('PÁGINA ' + page.pageNumber + ' DE ' + page.totalPageCount, pageWidth - margin - 21, 21.8, { align: 'center' });

    // Watermark across page
    pdf.setTextColor(232, 237, 246);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.saveGraphicsState();
    pdf.text(doc.watermark, pageWidth / 2, pageHeight / 2 + 10, {
      align: 'center',
      angle: 35
    });
    pdf.restoreGraphicsState();

    // Document Titles (Page 1) or Header (Pages 2-4)
    let currentY = 35;

    if (page.pageNumber === 1) {
      pdf.setTextColor(11, 27, 61);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11.5);
      pdf.text(doc.title, pageWidth / 2, currentY, { align: 'center' });

      currentY += 5.5;
      pdf.setFontSize(8);
      pdf.setTextColor(0, 102, 255);
      pdf.text(doc.subtitle, pageWidth / 2, currentY, { align: 'center' });

      currentY += 4.5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.8);
      pdf.setTextColor(90, 100, 120);
      pdf.text(doc.legalBasis, pageWidth / 2, currentY, { align: 'center' });

      currentY += 7;
    } else {
      pdf.setTextColor(70, 80, 100);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.text(`${doc.title} — EXPEDIENTE ${doc.id} (HOJA ${page.pageNumber} DE ${page.totalPageCount})`, margin, currentY);
      currentY += 5.5;
    }

    // Page Section Title Bar
    pdf.setFillColor(242, 246, 252);
    pdf.setDrawColor(195, 210, 230);
    pdf.roundedRect(margin, currentY, contentWidth, 7, 1.5, 1.5, 'FD');

    pdf.setTextColor(11, 27, 61);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.8);
    pdf.text(page.pageTitle, margin + 3, currentY + 4.8);

    currentY += 11;

    // Body content parsing
    const cleanText = page.contentHtml
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<div class="p-4 bg-slate-50[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, ' • $1\n')
      .replace(/<div[^>]*>(.*?)<\/div>/gi, '\n$1')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&bull;/g, '•')
      .replace(/&aacute;/g, 'á')
      .replace(/&eacute;/g, 'é')
      .replace(/&iacute;/g, 'í')
      .replace(/&oacute;/g, 'ó')
      .replace(/&uacute;/g, 'ú')
      .replace(/&ntilde;/g, 'ñ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.2);
    pdf.setTextColor(30, 35, 50);

    const splitLines = pdf.splitTextToSize(cleanText, contentWidth);
    const maxLinesPerPage = page.pageNumber === page.totalPageCount ? 34 : 44;
    const pageLines = splitLines.slice(0, maxLinesPerPage);
    pdf.text(pageLines, margin, currentY, { lineHeightFactor: 1.38 });

    // Official Circular Seal Stamp on every page bottom-right corner
    const sealCenterX = pageWidth - margin - 20;
    const sealCenterY = page.pageNumber === page.totalPageCount ? pageHeight - 76 : pageHeight - 32;
    pdf.setDrawColor(5, 150, 105);
    pdf.setLineWidth(0.5);
    pdf.circle(sealCenterX, sealCenterY, 13, 'S');
    pdf.setLineWidth(0.2);
    pdf.circle(sealCenterX, sealCenterY, 11.2, 'S');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5);
    pdf.setTextColor(5, 150, 105);
    pdf.text('INSTACREDIT ESPAÑA S.L.', sealCenterX, sealCenterY - 4, { align: 'center' });
    pdf.text('CUMPLIMIENTO LEY 16/2011', sealCenterX, sealCenterY - 1, { align: 'center' });
    pdf.text('FIRMA CUALIFICADA eIDAS', sealCenterX, sealCenterY + 2, { align: 'center' });
    pdf.text('NIF B-89412093 • MADRID', sealCenterX, sealCenterY + 5, { align: 'center' });

    // If Last Page, print official Signature & Stamp Box
    if (page.pageNumber === page.totalPageCount) {
      const stampBoxY = pageHeight - 56;

      pdf.setFillColor(248, 250, 255);
      pdf.setDrawColor(0, 102, 255);
      pdf.setLineWidth(0.35);
      pdf.roundedRect(margin, stampBoxY, contentWidth, 35, 2, 2, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(11, 27, 61);
      pdf.text('CERTIFICADO DE FIRMA ELECTRÓNICA CUALIFICADA Y SELLO DE TIEMPO (REGLAMENTO UE 910/2014 eIDAS)', margin + 4, stampBoxY + 5.5);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(40, 45, 60);

      pdf.text(`Titular Firmante: ${doc.signatureBlock.signerName}`, margin + 4, stampBoxY + 11);
      pdf.text(`Documento Oficial: ${doc.signatureBlock.signerDocument}`, margin + 4, stampBoxY + 15);
      pdf.text(`Cuenta Digital IBAN Creada: ${doc.signatureBlock.accountNumber}`, margin + 4, stampBoxY + 19);
      pdf.text(`Plaza de Formalización: ${doc.signatureBlock.expeditionCity}`, margin + 4, stampBoxY + 23);

      pdf.text(`Estampa Temporal: ${doc.signatureBlock.timestamp}`, pageWidth / 2 + 2, stampBoxY + 11);
      pdf.text(`Dirección IP Auditada: ${doc.signatureBlock.ipAddress}`, pageWidth / 2 + 2, stampBoxY + 15);
      pdf.text(`Token SMS OTP 2FA: ${doc.signatureBlock.verifiedOtp} (Verificado)`, pageWidth / 2 + 2, stampBoxY + 19);
      pdf.text(`Garantía Contractual: Desembolso Directo en Cuenta Creada`, pageWidth / 2 + 2, stampBoxY + 23);

      pdf.setFont('courier', 'bold');
      pdf.setFontSize(5.8);
      pdf.setTextColor(0, 102, 255);
      pdf.text(`Huella Criptográfica SHA-256: ${doc.signatureBlock.hashSha256}`, margin + 4, stampBoxY + 30);
    }

    // Page Footer
    pdf.setDrawColor(210, 218, 230);
    pdf.setLineWidth(0.2);
    pdf.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.setTextColor(110, 118, 135);
    pdf.text('INSTACREDIT ESPAÑA FINTECH S.L. • Paseo de la Castellana 95, Planta 14, 28046 Madrid • NIF B-89412093', margin, pageHeight - 11.5);
    pdf.text(`Folio ${page.pageNumber} de ${page.totalPageCount}`, pageWidth - margin, pageHeight - 11.5, { align: 'right' });
  });

  // Save the PDF file
  const filename = `${doc.documentType.toUpperCase()}_${doc.id}.pdf`;
  pdf.save(filename);
}

export function exportReceiptTicketToPdf(app: CreditApplication): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [100, 210] // Receipt voucher size
  });

  const width = 100;
  const margin = 6;
  const contentWidth = width - margin * 2;

  // Header
  pdf.setFillColor(11, 27, 61);
  pdf.rect(0, 0, width, 24, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.text('INSTACREDIT', width / 2, 10, { align: 'center' });

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('COMPROBANTE OFICIAL DE PRÉSTAMO Y CUENTA', width / 2, 16, { align: 'center' });
  pdf.text('NIF: B-89412093 | LEY 16/2011 BANCO DE ESPAÑA', width / 2, 20, { align: 'center' });

  let y = 32;
  pdf.setTextColor(20, 25, 45);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text(`RADICADO: ${app.id}`, width / 2, y, { align: 'center' });

  y += 5;
  pdf.setFontSize(7.5);
  pdf.setTextColor(90, 95, 110);
  pdf.text(`IBAN Digital: ${app.digitalAccount.accountNumber}`, width / 2, y, { align: 'center' });
  y += 4;
  pdf.text(`Fecha Emisión: ${app.createdAt}`, width / 2, y, { align: 'center' });

  y += 6;
  pdf.setDrawColor(200, 210, 225);
  pdf.line(margin, y, width - margin, y);

  y += 6;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(11, 27, 61);
  pdf.text('DATOS DEL TITULAR', margin, y);

  y += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(40, 45, 60);
  pdf.text(`Titular: ${app.personalData.firstName} ${app.personalData.lastName}`, margin, y);
  y += 4;
  pdf.text(`Documento: ${app.personalData.documentType} ${app.personalData.documentNumber}`, margin, y);
  y += 4;
  pdf.text(`País de Residencia: ${app.personalData.countryOfResidence}`, margin, y);
  y += 4;
  pdf.text(`Teléfono: ${app.personalData.phone}`, margin, y);
  y += 4;
  pdf.text(`Banco / IBAN: ${app.bankDetails.bankName} - ${app.bankDetails.iban.substring(0, 14)}...`, margin, y);

  y += 6;
  pdf.line(margin, y, width - margin, y);

  y += 6;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(11, 27, 61);
  pdf.text('DESGLOSE FINANCIERO Y CUOTAS', margin, y);

  y += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  const items = [
    ['Capital Prestado:', formatEUR(app.loanDetails.capital)],
    ['Plazo Amortización:', `${app.loanDetails.termDays} días`],
    ['Interés Ordinario (0,065% día):', formatEUR(app.loanDetails.interestAmount)],
    ['Aval y Fianza Europea (10%):', formatEUR(app.loanDetails.fgaGuaranteeAmount)],
    ['Plataforma & Firma eIDAS:', formatEUR(app.loanDetails.technologyAndSignature)],
    ['IVA Repercutible (21%):', formatEUR(app.loanDetails.ivaAmount)],
    ['TOTAL A PAGAR:', formatEUR(app.loanDetails.totalToPay)],
    ['Fecha Límite Pago:', app.loanDetails.dueDate]
  ];

  for (const [k, v] of items) {
    if (k === 'TOTAL A PAGAR:') {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 102, 255);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(40, 45, 60);
    }
    pdf.text(k, margin, y);
    pdf.text(v, width - margin, y, { align: 'right' });
    y += 4.2;
  }

  y += 4;
  pdf.line(margin, y, width - margin, y);

  y += 6;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(0, 160, 90);
  pdf.text(`ESTADO: ${app.status.toUpperCase()}`, width / 2, y, { align: 'center' });

  y += 5;
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(5.8);
  pdf.setTextColor(110, 115, 130);
  pdf.text(`HASH SHA-256: ${app.signatureDetails.signatureHash.substring(0, 30)}...`, width / 2, y, { align: 'center' });
  y += 3;
  pdf.text(`OTP VALIDADO: ${app.signatureDetails.otpCode}`, width / 2, y, { align: 'center' });

  y += 6;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(6.2);
  pdf.setTextColor(90, 95, 110);
  const disclaimer = 'Comprobante válido con plena fuerza probatoria conforme a la Ley 16/2011 de Contratos de Crédito al Consumo.';
  const wrapped = pdf.splitTextToSize(disclaimer, contentWidth);
  pdf.text(wrapped, width / 2, y, { align: 'center' });

  pdf.save(`Comprobante_Instacredit_${app.id}.pdf`);
}
