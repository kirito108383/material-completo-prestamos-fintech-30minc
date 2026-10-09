import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Wallet,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Smartphone,
  CreditCard,
  Building
} from 'lucide-react';

export const HowItWorksTabs: React.FC = () => {
  const { openApplicationModal, openLookupModal, openUserBankPortal } = useApp();
  const [activeTab, setActiveTab] = useState<'solicitar' | 'pagar' | 'extender'>('solicitar');

  return (
    <section id="como-solicitar" className="py-16 sm:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Guía Paso a Paso • España
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
            ¿Cómo funciona INSTACREDIT España?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Descubre lo fácil y rápido que es solicitar tu micropréstamo, recibir tus euros en tu Cuenta Digital IBAN y pagar cómodamente por Bizum o tarjeta.
          </p>
        </div>

        {/* 3 Step Tabs Navigation */}
        <div className="mt-12 flex justify-center">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-wrap gap-1 max-w-2xl w-full">
            <button
              onClick={() => setActiveTab('solicitar')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'solicitar'
                  ? 'bg-white text-[#0B1B3D] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-[#0066FF]" />
              <span>1. Cómo solicitar</span>
            </button>

            <button
              onClick={() => setActiveTab('pagar')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'pagar'
                  ? 'bg-white text-[#0B1B3D] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>2. Cómo pagar (Bizum)</span>
            </button>

            <button
              onClick={() => setActiveTab('extender')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'extender'
                  ? 'bg-white text-[#0B1B3D] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-purple-600" />
              <span>3. Cómo extender plazo</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="mt-10">
          {/* TAB 1: CÓMO SOLICITAR */}
          {activeTab === 'solicitar' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Badge Banner */}
                <div className="lg:col-span-4 bg-gradient-to-br from-[#0B1B3D] to-[#102A6B] rounded-2xl p-8 text-white text-center relative overflow-hidden flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl mb-4 shadow-inner">
                    🚀
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-[#00E599]">
                    Fintech España
                  </span>
                  <h4 className="text-xl font-extrabold mt-1">Despega tu Dinero</h4>
                  <p className="text-xs text-blue-200 mt-2">
                    Proceso 100% digital respaldado con DNI/NIE, cuenta IBAN española y firma electrónica cualificada eIDAS.
                  </p>
                  <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                    Desembolso en 15 minutos
                  </div>
                </div>

                {/* 3 Step Details */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] font-black text-lg flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Calcula y solicita tu importe y plazo exacto
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Elige desde 100 € hasta 100.000 € y selecciona tu plazo de amortización. Conoce de antemano el desglose exacto de intereses (TIN y TAE Ley 16/2011) y fianza antes de formalizar.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] font-black text-lg flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Apertura de Cuenta Digital y validación SEPBLAC
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Ingresa tu DNI o NIE, datos laborales y certifica tu cuenta bancaria española vinculada (Santander, BBVA, CaixaBank, Sabadell, ING, etc.) para desembolso inmediato y prevención de suplantación.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] font-black text-lg flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Firma tu pagaré con OTP SMS y recibe el saldo en euros
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Recibe un código SMS de 6 dígitos para firmar electrónicamente tu pagaré notarial eIDAS. Una vez aprobado, tu Cuenta Digital IBAN recibe el saldo y puedes transferirlo por SEPA Instant en segundos.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
                    <button
                      onClick={() => openApplicationModal()}
                      className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>¡Solicitar mi préstamo en 5 min!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CÓMO PAGAR */}
          {activeTab === 'pagar' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-[#0B1B3D]">
                    Canales de Pago Oficiales en España
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Paga oportunamente tu cuota para mantener un expediente positivo ante ASNEF y Banco de España, y acceder a importes superiores en Instacredit.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  {/* Channel 1: Saldo de Cuenta Digital IBAN */}
                  <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl mb-4">
                        <Wallet className="w-6 h-6 text-emerald-700" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Saldo de Cuenta Digital IBAN</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Paga tus cuotas en 1 solo clic utilizando el saldo disponible de tu Cuenta Digital Instacredit sin comisiones intermediarias ni esperas.
                      </p>
                    </div>
                    <button
                      onClick={() => openUserBankPortal()}
                      className="mt-4 w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition cursor-pointer"
                    >
                      Pagar con mi saldo IBAN
                    </button>
                  </div>

                  {/* Channel 2: Bizum Instantáneo */}
                  <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0066FF] flex items-center justify-center font-black text-base mb-4">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Pago Inmediato por Bizum</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Envía tu pago desde cualquier app bancaria española por Bizum indicando tu número de radicado oficial INSTA-ES-XXXXXX.
                      </p>
                    </div>
                    <button
                      onClick={() => openLookupModal()}
                      className="mt-4 w-full py-2.5 bg-[#0066FF] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition cursor-pointer"
                    >
                      Pagar con Bizum
                    </button>
                  </div>

                  {/* Channel 3: Tarjeta bancaria PSD2 */}
                  <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl mb-4">
                        <CreditCard className="w-6 h-6 text-amber-700" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Tarjeta Débito / Crédito</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Paga con Visa o Mastercard mediante pasarela de pago segura con autenticación reforzada 3D Secure PSD2.
                      </p>
                    </div>
                    <button
                      onClick={() => openLookupModal()}
                      className="mt-4 w-full py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition cursor-pointer"
                    >
                      Pagar con Tarjeta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CÓMO EXTENDER */}
          {activeTab === 'extender' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    Flexibilidad Garantizada
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B1B3D]">
                    ¿No llegas a la fecha límite? ¡Pide una prórroga!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    En INSTACREDIT entendemos que los imprevistos ocurren. Nuestra opción de prórroga te protege de intereses de demora y registros en ASNEF.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <Clock className="w-5 h-5" />
                      Prórroga por 15 o 30 días adicionales
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Abonas únicamente los gastos del período y aplazas la devolución del capital principal por hasta un mes adicional. Tu pagaré se mantiene formalizado sin necesidad de iniciar una nueva solicitud.
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mantiene tu expediente limpio en ASNEF y CIRBE</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Evita costes de reclamación de posiciones deudoras</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[#0B1B3D] text-sm">
                        ¿Cómo activar la extensión de tu cuota?
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Accede a tu Cuenta Digital con tu DNI/NIE o comunícate antes de la fecha límite a nuestra línea gratuita nacional <strong>900 839 201</strong> o vía WhatsApp oficial.
                      </p>
                    </div>
                    <button
                      onClick={() => openLookupModal()}
                      className="w-full py-2.5 bg-[#0066FF] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition cursor-pointer"
                    >
                      Consultar opción de prórroga
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
