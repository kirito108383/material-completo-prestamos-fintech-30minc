import React, { useState, useId } from 'react';
import { useApp } from '../../context/AppContext';
import { LoanTerm } from '../../types';
import {
  calculateLoanBreakdown,
  formatEUR,
  MIN_LOAN_AMOUNT,
  MAX_LOAN_AMOUNT,
  STEP_LOAN_AMOUNT
} from '../../utils/financialCalculations';
import {
  Sparkles,
  Rocket,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  Gift,
  Award,
  Clock,
  Info,
  Wallet
} from 'lucide-react';

export const HeroSimulator: React.FC = () => {
  const { openApplicationModal, openUserBankPortal, platformConfig } = useApp();

  const [capital, setCapital] = useState<number>(5000);
  const [term, setTerm] = useState<LoanTerm>(365);
  const [showFeeDetails, setShowFeeDetails] = useState<boolean>(false);
  const sliderId = useId();

  const breakdown = calculateLoanBreakdown(capital, term);
  const sliderPercentage = ((capital - MIN_LOAN_AMOUNT) / (MAX_LOAN_AMOUNT - MIN_LOAN_AMOUNT)) * 100;
  const monthlyQuota = breakdown.quotas && breakdown.quotas.length > 0 ? breakdown.quotas[0].totalQuota : (breakdown.totalToPay / (term / 30));

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-16 bg-gradient-to-b from-[#F4F7FB] via-[#EEF3FA] to-[#FFFFFF]">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Campaign Headline & Loyalty Presentation */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top promo pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0066FF] text-xs font-extrabold shadow-xs">
              <Sparkles className="w-4 h-4 text-[#0066FF] animate-spin-slow" />
              <span>Campaña Oficial España 2026: ¡Con Instacredit Todos Ganan!</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1B3D] tracking-tight leading-[1.1]">
                Todos <span className="text-[#0066FF] relative inline-block">
                  ganan
                  <span className="absolute -top-3 -right-6 text-2xl select-none">✨</span>
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">
                Con cada préstamo, siempre hay algo por ganar.
              </p>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Dinero en tu <strong>Cuenta Digital IBAN en 15 minutos</strong> por Bizum o Transferencia SEPA Instantánea. Sin papeleos, pagaré notarial con firma digital eIDAS y supervisión del Banco de España.
              </p>
            </div>

            {/* 3 Loyalty Benefit Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-2 font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0B1B3D]">10% Descuento</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">En el aval de tu segundo préstamo al pagar con puntualidad.</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 font-bold">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0B1B3D]">Límite hasta 100.000 €</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Financiación personal y empresarial de 2.000 € a 100.000 € en tu Cuenta IBAN.</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#0B1B3D] flex items-center justify-center mb-2 font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0B1B3D]">Cero Penalidad</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Amortiza antes de tiempo sin comisión (Ley 16/2011).</p>
                </div>
              </div>
            </div>

            {/* Account independence reassurance banner */}
            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-xs text-emerald-950">
                <span className="font-bold block">Cuenta Digital Bancaria IBAN Independiente</span>
                <span>Tu cuenta se apertura con saldo en 0,00 € y recibe el abono al instante. Puedes transferir por Bizum o SEPA cuando desees.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Loan Simulator Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 relative overflow-hidden">
              
              {/* Calculator Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#0066FF] block">
                    Calculadora Oficial de Crédito y Cuotas
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
                    ¿Cuánto capital necesitas hoy?
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ley 16/2011 • España
                </div>
              </div>

              {/* Slider 1: Capital Amount */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor={sliderId} className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Importe solicitado (€ EUR):
                  </label>
                  <span className="text-2xl sm:text-3xl font-black text-[#0066FF] tabular-nums">
                    {formatEUR(capital)}
                  </span>
                </div>

                {/* Range Slider Container with Rocket Thumb styling */}
                <div className="relative py-2">
                  <input
                    id={sliderId}
                    type="range"
                    min={MIN_LOAN_AMOUNT}
                    max={MAX_LOAN_AMOUNT}
                    step={STEP_LOAN_AMOUNT}
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    aria-label="Importe del préstamo en euros"
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0066FF] focus:outline-hidden"
                    style={{
                      background: `linear-gradient(to right, #0066FF 0%, #0066FF ${sliderPercentage}%, #E2E8F0 ${sliderPercentage}%, #E2E8F0 100%)`
                    }}
                  />
                  
                  {/* Floating rocket indicator above the slider thumb */}
                  <div
                    className="absolute -top-4 pointer-events-none transform -translate-x-1/2 transition-all duration-75 text-lg"
                    style={{ left: `${sliderPercentage}%` }}
                  >
                    🚀
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Mínimo: {formatEUR(MIN_LOAN_AMOUNT)}</span>
                  <span>Máximo: {formatEUR(MAX_LOAN_AMOUNT)}</span>
                </div>
              </div>

              {/* Slider 2: Term Selector (Meses) */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                    Plazo de amortización acordado:
                  </label>
                  <span className="text-xs font-extrabold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    Cuota: {formatEUR(monthlyQuota)} / mes
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { days: 90, label: '3 Meses', sub: '90 Días' },
                    { days: 180, label: '6 Meses', sub: '180 Días' },
                    { days: 365, label: '12 Meses', sub: '1 Año' },
                    { days: 730, label: '24 Meses', sub: '2 Años' }
                  ].map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setTerm(item.days)}
                      className={`py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all cursor-pointer ${
                        term === item.days
                          ? 'bg-[#0B1B3D] text-white shadow-md ring-2 ring-[#0B1B3D]/30'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{item.label}</span>
                      <span className="text-[9px] opacity-80 font-normal">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transparent Financial Breakdown Table (BdE & INE Compliance) */}
              <div className="mt-6 bg-slate-50/90 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-medium">
                  <span className="text-slate-600">Fecha de abono estimada:</span>
                  <span className="font-bold text-slate-900">{breakdown.disbursementDate}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-medium">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                    Fecha límite de pago:
                  </span>
                  <span className="font-bold text-[#0B1B3D]">{breakdown.dueDate}</span>
                </div>

                {/* Collapsible details for statutory transparency */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowFeeDetails(!showFeeDetails)}
                    className="w-full flex items-center justify-between text-slate-600 hover:text-slate-900 text-[11px] font-semibold cursor-pointer py-1"
                  >
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <Info className="w-3.5 h-3.5 text-[#0066FF]" />
                      Ver desglose precontractual de costes (Ley 16/2011)
                    </span>
                    <span className="text-[#0066FF] font-bold">
                      {showFeeDetails ? 'Ocultar ▲' : 'Ver detalle ▼'}
                    </span>
                  </button>

                  {showFeeDetails && (
                    <div className="mt-2 pt-2 border-t border-dashed border-slate-300 space-y-1.5 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Capital solicitado:</span>
                        <span className="font-semibold text-slate-800 tabular-nums">{formatEUR(breakdown.capital)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span title="0.065% diario / 1.95% mensual nominal (26.8% TAE)">
                          Interés nominal ({term} días al 1.95% TIN):
                        </span>
                        <span className="font-semibold text-slate-800 tabular-nums">{formatEUR(breakdown.interestAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span title="Fondo Europeo de Garantía de Riesgo (10%)">
                          Aval de Garantía Europeo (10%):
                        </span>
                        <span className="font-semibold text-slate-800 tabular-nums">{formatEUR(breakdown.fgaGuaranteeAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span title="Firma electrónica eIDAS y custodia notarial">
                          Plataforma y Firma Digital eIDAS:
                        </span>
                        <span className="font-semibold text-slate-800 tabular-nums">{formatEUR(breakdown.technologyAndSignature)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (21% sobre aval y tecnología en España):</span>
                        <span className="font-semibold text-slate-800 tabular-nums">{formatEUR(breakdown.ivaAmount)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total highlight */}
                <div className="pt-2 border-t border-slate-300 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Total a Reembolsar:
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Sin cobros sorpresa ni letra pequeña
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tabular-nums">
                      {formatEUR(breakdown.totalToPay)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => openApplicationModal(capital, term)}
                  className="w-full py-4 px-6 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Solicitar {formatEUR(capital)} Ahora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href={platformConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>¿Prefieres asesoría personalizada? WhatsApp oficial</span>
                </a>
              </div>

              {/* Security footprint note */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transacción encriptada con certificado SSL de 256 bits y RGPD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Bar / Allies Gateways Logos Bar (Spain & EU Ecosystem) */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">
            Ecosistema Regulatorio, Pasarelas y Entidades Adheridas en España
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100">
            <div className="flex items-center gap-1.5 font-black text-slate-700 text-sm">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              ASNEF EQUIFAX
            </div>
            <div className="flex items-center gap-1.5 font-black text-slate-700 text-sm">
              <span className="w-3 h-3 rounded-full bg-cyan-600"></span>
              CIRBE BANCO DE ESPAÑA
            </div>
            <div className="flex items-center gap-1.5 font-black text-slate-700 text-sm">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              AEFI FINTECH ESPAÑA
            </div>
            <div className="flex items-center gap-1.5 font-black text-[#0B1B3D] text-sm">
              <span className="w-3 h-3 rounded-full bg-[#00E599]"></span>
              BIZUM ESPAÑA
            </div>
            <div className="flex items-center gap-1.5 font-black text-blue-700 text-sm">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              SEPA INSTANT
            </div>
            <div className="flex items-center gap-1.5 font-black text-red-600 text-sm">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              REDSYS 3D SECURE
            </div>
            <div className="flex items-center gap-1.5 font-black text-emerald-700 text-sm">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              eIDAS CONFIANZA UE
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
