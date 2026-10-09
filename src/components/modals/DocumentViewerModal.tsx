import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentType } from '../../types';
import { generateLegalDocument } from '../../utils/legalTemplates';
import { exportDocumentToPdf } from '../../utils/pdfGenerator';
import {
  X,
  Download,
  Printer,
  FileText,
  ShieldCheck,
  Award,
  Stamp,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Lock,
  Scale
} from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const {
    isDocumentModalOpen,
    closeDocumentModal,
    selectedApplication,
    selectedDocType,
    setSelectedDocType
  } = useApp();

  const [copiedHash, setCopiedHash] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  if (!isDocumentModalOpen || !selectedApplication) return null;

  const currentDoc = generateLegalDocument(selectedApplication, selectedDocType);
  const totalPages = currentDoc.pages.length;
  const activePage = currentDoc.pages[currentPageIndex] || currentDoc.pages[0];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(currentDoc.signatureBlock.hashSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadPdf = () => {
    exportDocumentToPdf(currentDoc);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-slate-300 relative flex flex-col max-h-[96vh]">
        
        {/* Modal Top Bar */}
        <div className="bg-[#0B1B3D] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 no-print border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#0066FF] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                Expediente Contractual Oficial INSTACREDIT España (4 Páginas por Documento)
              </h3>
              <p className="text-xs text-slate-300">
                Expediente: <strong>{selectedApplication.id}</strong> • IBAN Digital: <strong>{selectedApplication.digitalAccount.accountNumber}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={closeDocumentModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Document Type Selector Tabs (All 4 Legal Documents + Pagaré) */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex flex-wrap gap-1.5 shrink-0 no-print text-xs font-bold">
          <button
            onClick={() => {
              setSelectedDocType('contrato_mutuo');
              setCurrentPageIndex(0);
            }}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              selectedDocType === 'contrato_mutuo'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Contrato de Préstamo (4 Págs)</span>
          </button>

          <button
            onClick={() => {
              setSelectedDocType('condiciones_generales');
              setCurrentPageIndex(0);
            }}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              selectedDocType === 'condiciones_generales' || selectedDocType === 'contrato_apertura_plataforma'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>2. Condiciones Generales (4 Págs)</span>
          </button>

          <button
            onClick={() => {
              setSelectedDocType('politica_privacidad');
              setCurrentPageIndex(0);
            }}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              selectedDocType === 'politica_privacidad'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>3. Política Privacidad RGPD (4 Págs)</span>
          </button>

          <button
            onClick={() => {
              setSelectedDocType('consentimiento_lopd');
              setCurrentPageIndex(0);
            }}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              selectedDocType === 'consentimiento_lopd' || selectedDocType === 'autorizacion_centrales'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Consentimiento LOPD / ASNEF (4 Págs)</span>
          </button>

          <button
            onClick={() => {
              setSelectedDocType('pagare_en_blanco');
              setCurrentPageIndex(0);
            }}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              selectedDocType === 'pagare_en_blanco'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>📜 5. Pagaré Cambiario (4 Págs)</span>
          </button>
        </div>

        {/* Page Selector Strip (Exact 4 Pages) */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs shrink-0 no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Páginas del Documento:</span>
            {currentDoc.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentPageIndex(idx)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                  currentPageIndex === idx
                    ? 'bg-[#0B1B3D] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Página {p.pageNumber} de {totalPages}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <button
              disabled={currentPageIndex === 0}
              onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold">
              {currentPageIndex + 1} / {totalPages}
            </span>
            <button
              disabled={currentPageIndex === totalPages - 1}
              onClick={() => setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Paper Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-200/60 flex justify-center">
          <div className="bg-white max-w-2xl w-full p-8 sm:p-12 shadow-xl border border-slate-300 relative rounded-sm printable-document min-h-[640px] flex flex-col justify-between">
            
            {/* Watermark Diagonal Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.05] select-none">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 transform -rotate-35 uppercase text-center leading-relaxed">
                {currentDoc.watermark}
              </span>
            </div>

            <div>
              {/* Document Header with Logos & Seals */}
              <div className="flex items-start justify-between border-b-2 border-[#0B1B3D] pb-4 mb-6 relative">
                <div>
                  <div className="text-2xl font-black text-[#0B1B3D]">
                    INSTA<span className="text-[#0066FF]">CREDIT</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold tracking-tight">
                    INSTACREDIT ESPAÑA FINTECH S.L. • NIF: B-89412093
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Paseo de la Castellana 95, Planta 14, 28046 Madrid, España
                  </div>
                </div>

                {/* Official Seal Badge (Reino de España / Banco de España) */}
                <div className="w-28 h-28 border-2 border-emerald-600 rounded-full p-1.5 flex flex-col items-center justify-center text-center text-emerald-800 rotate-[-4deg] opacity-90 shadow-xs bg-emerald-50/50">
                  <div className="text-[7.5px] font-black uppercase tracking-wider leading-none mb-1">
                    REINO DE ESPAÑA
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-600 my-0.5" />
                  <div className="text-[7px] font-black leading-tight">
                    SUPERVISADO POR EL BANCO DE ESPAÑA
                  </div>
                  <div className="text-[6.5px] font-mono text-emerald-700 font-bold mt-0.5">
                    LEY 16/2011 • eIDAS
                  </div>
                </div>
              </div>

              {/* Document Titles */}
              <div className="text-center space-y-1 mb-6">
                <h1 className="text-lg sm:text-xl font-black text-[#0B1B3D] tracking-tight">
                  {currentDoc.title}
                </h1>
                <p className="text-xs font-bold text-[#0066FF] tracking-wide">
                  {currentDoc.subtitle}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {currentDoc.legalBasis}
                </p>
              </div>

              {/* Current Page Content */}
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-[#0B1B3D] uppercase border-b pb-1">
                  {activePage.pageTitle}
                </div>
                <div
                  className="prose prose-sm max-w-none text-slate-800"
                  dangerouslySetInnerHTML={{ __html: activePage.contentHtml }}
                />
              </div>
            </div>

            {/* Document Bottom Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-center">
              <span>INSTACREDIT España Fintech S.L. • Supervisado por el Banco de España</span>
              <span>Página {activePage.pageNumber} de {totalPages}</span>
            </div>

          </div>
        </div>

        {/* Modal Bottom Bar Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
          <div className="text-xs text-slate-600">
            Documento: <strong>{currentDoc.title}</strong> ({totalPages} Páginas)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-5 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF Oficial (4 Páginas)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
