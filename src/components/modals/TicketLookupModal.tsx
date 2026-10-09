import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatEUR } from '../../utils/financialCalculations';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  CreditCard,
  Building,
  User,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Wallet
} from 'lucide-react';

export const TicketLookupModal: React.FC = () => {
  const {
    isLookupModalOpen,
    closeLookupModal,
    applications,
    findApplicationBySearch,
    openTicketModal,
    openDocumentModal,
    openUserBankPortal,
    advanceApplicationStep
  } = useApp();

  const [query, setQuery] = useState('');
  const [searchedAppId, setSearchedAppId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLookupModalOpen) return null;

  const currentApp = searchedAppId
    ? applications.find(a => a.id === searchedAppId) || null
    : applications[0] || null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!query.trim()) {
      setErrorMessage('Por favor introduce un número de expediente, IBAN digital o DNI/NIE.');
      return;
    }
    const found = findApplicationBySearch(query);
    if (found) {
      setSearchedAppId(found.id);
    } else {
      setErrorMessage(`No se encontró ningún registro asociado a "${query}". Comprueba los dígitos e intenta nuevamente.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-auto overflow-hidden border border-slate-200 relative flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#0066FF]" />
            <h3 className="font-extrabold text-base sm:text-lg">
              Rastreo de Expediente, Tiquete y Cuenta Digital INSTACREDIT
            </h3>
          </div>
          <button
            onClick={closeLookupModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Introduce tu número de expediente (Ej: INSTA-ES-821943), IBAN digital o DNI/NIE:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="INSTA-ES-... o IBAN o DNI/NIE..."
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMessage}
              </p>
            )}
          </form>

          {/* Quick pills of demo applicants for immediate user exploration */}
          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs">
            <span className="font-bold text-[#0B1B3D] block mb-1.5">
              Expedientes activos para demostración en España:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {applications.slice(0, 4).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setSearchedAppId(a.id);
                    setErrorMessage(null);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                    currentApp?.id === a.id
                      ? 'bg-[#0B1B3D] text-white border-[#0B1B3D]'
                      : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {a.id} ({a.personalData.firstName.split(' ')[0]} - {a.status})
                </button>
              ))}
            </div>
          </div>

          {/* Current Application Tracking Card */}
          {currentApp && (
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-5">
              {/* Top Meta info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Expediente Oficial</span>
                  <div className="text-lg font-black text-[#0B1B3D]">{currentApp.id}</div>
                  <div className="text-xs text-[#0066FF] font-mono font-bold">
                    IBAN Digital: {currentApp.digitalAccount.accountNumber}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Titular: <strong>{currentApp.personalData.firstName} {currentApp.personalData.lastName}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      🎯 Motivo: {currentApp.economicData.loanPurpose || currentApp.loanDetails.loanPurpose || 'Libre disposición'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Saldo Disponible</span>
                  <div className="text-xl font-black text-emerald-600 tabular-nums">
                    {formatEUR(currentApp.digitalAccount.balance)}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    Aprobado: {formatEUR(currentApp.approvedAmount || currentApp.loanDetails.capital)}
                  </span>
                </div>
              </div>

              {/* 4 STAGES PROGRESS TRACKER */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3D]">
                    Progreso en Tiempo Real del Trámite
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {currentApp.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  {/* Stage 1 */}
                  <div className={`p-3 rounded-xl border ${
                    currentApp.currentStep >= 1
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <CheckCircle2 className={`w-4 h-4 ${currentApp.currentStep >= 1 ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>1. Registro</span>
                    </div>
                    <p className="text-[10px] leading-tight">Cuenta asignada con cifrado SSL 256-bit y RGPD.</p>
                  </div>

                  {/* Stage 2 */}
                  <div className={`p-3 rounded-xl border ${
                    currentApp.currentStep >= 2
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <CheckCircle2 className={`w-4 h-4 ${currentApp.currentStep >= 2 ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>2. Validación</span>
                    </div>
                    <p className="text-[10px] leading-tight">Firma eIDAS y OTP SMS según normativa europea.</p>
                  </div>

                  {/* Stage 3 */}
                  <div className={`p-3 rounded-xl border ${
                    currentApp.currentStep >= 3
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <CheckCircle2 className={`w-4 h-4 ${currentApp.currentStep >= 3 ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>3. Análisis</span>
                    </div>
                    <p className="text-[10px] leading-tight">Comprobación en ASNEF/CIRBE y scoring de riesgo.</p>
                  </div>

                  {/* Stage 4 */}
                  <div className={`p-3 rounded-xl border ${
                    currentApp.currentStep >= 4
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <CheckCircle2 className={`w-4 h-4 ${currentApp.currentStep >= 4 ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>4. Desembolso</span>
                    </div>
                    <p className="text-[10px] leading-tight">Fondos acreditados en tu Cuenta Digital.</p>
                  </div>
                </div>

                {/* Live Step Advance Simulator control */}
                {currentApp.currentStep < 4 && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => advanceApplicationStep(currentApp.id)}
                      className="text-xs font-bold text-[#0066FF] hover:text-blue-700 flex items-center gap-1 underline cursor-pointer"
                    >
                      <span>Simular avance de etapa en vivo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons: Ticket, Banking & Legal Contracts */}
              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    closeLookupModal();
                    openUserBankPortal(currentApp);
                  }}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>Ver Cuenta Digital</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeLookupModal();
                    openTicketModal(currentApp);
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-[#0066FF]" />
                  <span>Ver Tiquete Oficial</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeLookupModal();
                    openDocumentModal(currentApp, 'pagare_en_blanco');
                  }}
                  className="px-4 py-2 bg-[#0B1B3D] hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#00E599]" />
                  <span>Ver 4 Contratos Legales</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
