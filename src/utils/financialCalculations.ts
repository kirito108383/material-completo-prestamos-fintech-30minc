import { LoanBreakdown, LoanTerm, InstallmentQuota } from '../types';

export const MIN_LOAN_AMOUNT = 2000; // 2.000 € (Monto mínimo solicitado)
export const MAX_LOAN_AMOUNT = 100000; // 100.000 € (Monto máximo solicitado)
export const STEP_LOAN_AMOUNT = 500; // Pasos de 500 €

// Tipos de interés regulados en España para préstamos personales de 2.000 € a 100.000 € (BdE)
export const ANNUAL_TIN_RATE = 0.0695; // 6.95% TIN Anual
export const DAILY_RATE = ANNUAL_TIN_RATE / 365; // ~0.0190% diario
export const MONTHLY_RATE = ANNUAL_TIN_RATE / 12; // ~0.579% mensual (TAE resultante 7.18% - 8.45%)
export const FGA_GUARANTEE_RATE = 0.03; // 3% Fondo de Garantía Europeo de Solvencia
export const TECH_PLATFORM_FEE = 25.00; // 25.00 € Firma Digital eIDAS y custodia notarial telemática
export const IVA_RATE = 0.21; // 21% IVA España

export function calculateLoanBreakdown(capital: number, termDays: LoanTerm): LoanBreakdown {
  const safeCapital = Math.min(Math.max(capital, MIN_LOAN_AMOUNT), MAX_LOAN_AMOUNT);
  
  // Calculate interest based on days
  const interestAmount = Number((safeCapital * DAILY_RATE * termDays).toFixed(2));
  
  // Aval / European Guarantee
  const fgaGuaranteeAmount = Number((safeCapital * FGA_GUARANTEE_RATE).toFixed(2));
  
  // Technology and eIDAS Digital Signature fee
  const technologyAndSignature = TECH_PLATFORM_FEE;
  
  // IVA 21% in Spain applies on services (Guarantee + Technology)
  const ivaAmount = Number(((fgaGuaranteeAmount + technologyAndSignature) * IVA_RATE).toFixed(2));
  
  const totalToPay = Number((safeCapital + interestAmount + fgaGuaranteeAmount + technologyAndSignature + ivaAmount).toFixed(2));

  const now = new Date();
  const dueDateObj = new Date();
  dueDateObj.setDate(now.getDate() + termDays);

  // Generate payment quotas (monthly installments)
  const quotasCount = Math.max(1, Math.round(termDays / 30));
  const quotas: InstallmentQuota[] = [];
  
  for (let i = 1; i <= quotasCount; i++) {
    const quotaDate = new Date();
    quotaDate.setDate(now.getDate() + Math.round((termDays / quotasCount) * i));
    
    quotas.push({
      quotaNumber: i,
      dueDate: formatDateToSpanish(quotaDate),
      capitalAmount: Number((safeCapital / quotasCount).toFixed(2)),
      interestAmount: Number((interestAmount / quotasCount).toFixed(2)),
      fgaAmount: Number((fgaGuaranteeAmount / quotasCount).toFixed(2)),
      techFeeAmount: Number((technologyAndSignature / quotasCount).toFixed(2)),
      ivaAmount: Number((ivaAmount / quotasCount).toFixed(2)),
      totalQuota: Number((totalToPay / quotasCount).toFixed(2)),
      status: 'Pendiente'
    });
  }

  return {
    capital: safeCapital,
    termDays,
    dailyRate: DAILY_RATE,
    monthlyRate: MONTHLY_RATE,
    interestAmount,
    fgaGuaranteeRate: FGA_GUARANTEE_RATE,
    fgaGuaranteeAmount,
    technologyAndSignature,
    ivaRate: IVA_RATE,
    ivaAmount,
    totalToPay,
    disbursementDate: formatDateToSpanish(now),
    dueDate: formatDateToSpanish(dueDateObj),
    quotas
  };
}

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Backwards compatibility alias
export const formatCOP = formatEUR;

export function formatDateToSpanish(date: Date): string {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

export function generateRadicado(prefix: 'INSTA' | 'PQRS' | 'REC' = 'INSTA'): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  if (prefix === 'PQRS' || prefix === 'REC') {
    return `REC-BDE-${randomDigits}`;
  }
  return `INSTA-ES-${randomDigits}`;
}

export function generateSpanishIBAN(): string {
  const bank = '2100'; // CaixaBank code
  const branch = '0418';
  const control = '45';
  const account = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  return `ES91 ${bank} ${branch} ${control} ${account.substring(0, 4)} ${account.substring(4)}`;
}

export function generateAccountNumber(): string {
  return generateSpanishIBAN();
}

export function generateSha256Hash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}
