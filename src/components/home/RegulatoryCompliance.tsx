import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Scale,
  FileLock2,
  KeyRound,
  FileCheck,
  Search,
  AlertCircle,
  HelpCircle,
  Wallet,
  ShieldCheck
} from 'lucide-react';

export const RegulatoryCompliance: React.FC = () => {
  const { openLookupModal, openPqrsModal, findApplicationBySearch, setSelectedApplication } = useApp();
  const [quickQuery, setQuickQuery] = useState('');
  const [searchError, setSearchError] = useState(false);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    const found = findApplicationBySearch(quickQuery);
    if (found) {
      setSelectedApplication(found);
      openLookupModal();
      setSearchError(false);
    } else {
      setSearchError(true);
      setTimeout(() => openLookupModal(), 400);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1B3D] text-white text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E599]"></span>
            <span>Supervisado conforme a normativa del Banco de España (BdE)</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
            Ley 16/2011 de Contratos de Crédito al Consumo
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
            Firma Electrónica eIDAS (Reglamento UE Nº 910/2014)
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
            Transparencia Legal y Protección al Consumidor en España
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Operamos bajo el marco regulatorio del Reino de España y la Unión Europea. Tu seguridad jurídica, tus datos conforme al RGPD y tus derechos como consumidor financiero son nuestra máxima prioridad.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-4 font-bold">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Tipos Transparentes (TIN y TAE Normalizada)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cumplimos rigurosamente la fórmula europea de la TAE conforme al Anexo I de la <strong>Ley 16/2011</strong>. Sin letras pequeñas ni comisiones ocultas de intermediación.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0B1B3D] flex items-center justify-center mb-4 font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Desistimiento y Reembolso Anticipado
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Garantizamos tu <strong>derecho de desistimiento en 14 días naturales</strong> y la <strong>amortización anticipada total o parcial</strong> sin penalización abusiva alguna.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold">
              <FileLock2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Protección de Datos (RGPD y LOPDGDD)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tus datos están protegidos bajo supervisión de la <strong>AEPD</strong>. Solo consultamos ficheros de solvencia patrimonial como <strong>ASNEF / EQUIFAX y CIRBE</strong> con tu autorización previa.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-4 font-bold">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Firma Electrónica eIDAS (UE Nº 910/2014)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los pagarés notariales y contratos de 3 páginas se formalizan con <strong>código OTP dinámico por SMS</strong> y huella criptográfica SHA-256 inmutable con plena validez ejecutiva ante juzgados españoles.
            </p>
          </div>
        </div>

        {/* Interactive Quick Radicado Lookup & Reclamaciones Bar */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Quick search input */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B1B3D]">
                <Search className="w-4 h-4 text-[#0066FF]" />
                Rastreo Inmediato de Expediente, Cuenta IBAN o DNI/NIE
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                ¿Has presentado una solicitud? Consulta el estado de tu crédito o cuenta
              </h4>
              <p className="text-xs text-slate-600">
                Ingresa tu número de radicado (Ej: INSTA-ES-821943), tu código IBAN o tu DNI/NIE para consultar saldo en tiempo real, ticket y contratos.
              </p>

              <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-2 pt-2">
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Digita radicado INSTA-ES-... o tu DNI/NIE..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Rastrear Solicitud</span>
                </button>
              </form>
              {searchError && (
                <p className="text-xs text-amber-700 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Expediente no encontrado directamente. Abriendo buscador general...
                </p>
              )}
            </div>

            {/* Right: Reclamaciones SAC */}
            <div className="lg:col-span-5 bg-blue-50/60 p-6 rounded-3xl border border-blue-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B3D]">
                <FileCheck className="w-4 h-4 text-[#0066FF]" />
                Servicio de Atención al Cliente (SAC)
              </div>
              <h5 className="font-bold text-sm text-slate-900">
                Reclamaciones y Consultas Oficiales
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Formula tu solicitud ante el SAC conforme a la normativa del Banco de España. Recibirás radicado oficial con acuse de recibo y resolución en un plazo legal perentorio de <strong>15 días hábiles</strong>.
              </p>
              <button
                onClick={() => openPqrsModal()}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#0B1B3D] font-bold text-xs border border-blue-200 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Presentar reclamación ante el SAC</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
