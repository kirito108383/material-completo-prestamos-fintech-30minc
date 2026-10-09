import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatEUR } from '../../utils/financialCalculations';
import { exportReceiptTicketToPdf } from '../../utils/pdfGenerator';
import {
  X,
  Download,
  Printer,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  QrCode,
  Copy,
  Check,
  Wallet
} from 'lucide-react';

export const LoanReceiptTicketModal: React.FC = () => {
  const { isTicketModalOpen, closeTicketModal, selectedApplication, openDocumentModal, openUserBankPortal } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isTicketModalOpen || !selectedApplication) return null;

  const app = selectedApplication;
  const l = app.loanDetails;
  const acc = app.digitalAccount;

  const handleCopyRadicado = () => {
    navigator.clipboard.writeText(app.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    exportReceiptTicketToPdf(app);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full my-auto overflow-hidden border border-slate-200 relative flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00E599]"></span>
            <h3 className="font-extrabold text-base">Tiquete Oficial de Radicación INSTACREDIT</h3>
          </div>
          <button
            onClick={closeTicketModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 overflow-y-auto space-y-5 printable-document">
          {/* Top Brand & Radicado */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="font-black text-2xl text-[#0B1B3D]">
              INSTA<span className="text-[#0066FF]">CREDIT</span>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
              INSTACREDIT ESPAÑA FINTECH S.L. • NIF B-89412093
            </div>
            <div className="text-[10px] text-slate-400">
              Supervisado por el Banco de España (BdE) • Circular 5/2012 y Ley 16/2011
            </div>

            <div className="mt-4 p-3 bg-blue-50/70 rounded-2xl border border-blue-200 inline-block">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Número de Radicado / Expediente</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-black text-[#0B1B3D] tracking-wider">{app.id}</span>
                <button
                  type="button"
                  onClick={handleCopyRadicado}
                  className="p-1 rounded text-[#0066FF] hover:bg-blue-100 transition no-print cursor-pointer"
                  title="Copiar radicado"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[10px] text-[#0066FF] font-mono mt-0.5 font-bold">
                IBAN Cuenta Digital: {acc.accountNumber}
              </div>
              <div className="text-[10px] text-slate-400">Fecha de Alta: {app.createdAt}</div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Estado del Expediente:
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px]">
              {app.status.toUpperCase()}
            </span>
          </div>

          {/* Applicant & Bank Details */}
          <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="font-bold text-[#0B1B3D] mb-1 uppercase tracking-wide text-[11px]">
              Datos del Titular y Liquidación
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Titular:</span>
              <span className="font-bold text-slate-900">{app.personalData.firstName} {app.personalData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Documento Identidad:</span>
              <span className="font-semibold text-slate-900">{app.personalData.documentType} {app.personalData.documentNumber} ({app.personalData.countryOfResidence || 'España'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Móvil / Notificaciones:</span>
              <span className="font-semibold text-slate-900">{app.personalData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Motivo del Préstamo:</span>
              <span className="font-bold text-blue-700">{app.economicData.loanPurpose || app.loanDetails.loanPurpose || 'Libre disposición'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">IBAN Cuenta Instacredit:</span>
              <span className="font-mono font-bold text-[#0066FF]">{acc.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Banco de Abono Vinculado:</span>
              <span className="font-semibold text-slate-800">{app.bankDetails.bankName} - {app.bankDetails.iban}</span>
            </div>
          </div>

          {/* Detailed Financial Breakdown */}
          <div className="space-y-2 text-xs text-slate-700 border-t border-b border-slate-200 py-3">
            <div className="font-bold text-[#0B1B3D] uppercase tracking-wide text-[11px]">
              Liquidación Financiera INE (Ley 16/2011)
            </div>
            <div className="flex justify-between">
              <span>Capital Solicitado:</span>
              <span className="font-bold tabular-nums">{formatEUR(l.capital)}</span>
            </div>
            <div className="flex justify-between">
              <span>Plazo de Amortización:</span>
              <span className="font-semibold">{l.termDays} Días Calendario</span>
            </div>
            <div className="flex justify-between">
              <span>Interés Remuneratorio Nominal (1.95% TIN):</span>
              <span className="font-semibold tabular-nums">{formatEUR(l.interestAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Aval de Garantía Europeo (10%):</span>
              <span className="font-semibold tabular-nums">{formatEUR(l.fgaGuaranteeAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Plataforma Tecnológica y Firma eIDAS:</span>
              <span className="font-semibold tabular-nums">{formatEUR(l.technologyAndSignature)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA Régimen General (21% en España):</span>
              <span className="font-semibold tabular-nums">{formatEUR(l.ivaAmount)}</span>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline font-black text-sm">
              <span className="text-[#0B1B3D]">TOTAL A REEMBOLSAR:</span>
              <span className="text-lg text-[#0066FF] tabular-nums">{formatEUR(l.totalToPay)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-xs pt-1">
              <span>Fecha Límite de Vencimiento:</span>
              <span>{l.dueDate}</span>
            </div>
          </div>

          {/* Digital Signature Audit Stamp & QR Representation */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5 text-[10px] text-slate-500 font-mono">
              <div className="font-bold text-emerald-700 text-xs">FIRMA ELECTRÓNICA AVANZADA eIDAS (UE 910/2014)</div>
              <div>Hash SHA-256: {app.signatureDetails.signatureHash.substring(0, 24)}...</div>
              <div>Sello de tiempo: {app.signatureDetails.signedAt}</div>
              <div>Validación OTP SMS: {app.signatureDetails.otpCode} (Verificado)</div>
            </div>
            <div className="shrink-0 text-center">
              <div className="w-14 h-14 bg-white p-1 rounded-xl border border-slate-300 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">BdE VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeTicketModal();
                openUserBankPortal(app);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Mi Cuenta Bancaria</span>
            </button>

            <button
              onClick={() => {
                closeTicketModal();
                openDocumentModal(app, 'pagare_en_blanco');
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-bold text-xs flex items-center gap-1.5 border border-blue-200 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Ver 4 Contratos</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
