import React from 'react';
import { Smartphone, Download, QrCode, Star, ShieldCheck, CheckCircle2, Wallet } from 'lucide-react';

export const AppDownloadBanner: React.FC = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B1B3D] via-[#102A6B] to-[#071329] rounded-3xl p-8 sm:p-12 text-white relative shadow-2xl">
          {/* Subtle glowing orb */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Aplicación Móvil Oficial INSTACREDIT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Gestiona tu Cuenta Digital y Créditos en la palma de tu mano
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Descarga nuestra app en Google Play Store o App Store. Consulta tu saldo líquido en tiempo real, transfiere por ACH a cualquier banco, solicita desembolsos en 1 clic y descarga tus contratos y paz y salvos.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Biometría facial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transferencias ACH</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pagarés con token OTP</span>
                </div>
              </div>

              {/* Badges and QR code area */}
              <div className="pt-4 flex flex-wrap items-center gap-6">
                {/* Google Play simulated button */}
                <div className="flex items-center gap-3 bg-black/60 hover:bg-black/80 px-4 py-2.5 rounded-2xl border border-white/20 transition cursor-pointer select-none">
                  <div className="text-2xl">▶</div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Disponible en</div>
                    <div className="text-sm font-bold text-white">Google Play</div>
                  </div>
                </div>

                {/* App Store button */}
                <div className="flex items-center gap-3 bg-black/60 hover:bg-black/80 px-4 py-2.5 rounded-2xl border border-white/20 transition cursor-pointer select-none">
                  <div className="text-2xl">🍏</div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Consíguelo en</div>
                    <div className="text-sm font-bold text-white">App Store</div>
                  </div>
                </div>

                {/* QR Code preview */}
                <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl border border-white/15">
                  <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="text-[11px] leading-tight text-slate-200">
                    <strong className="text-white block">Escanea el código</strong>
                    Descarga directa a tu celular
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Phone mockup representation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 sm:w-72 bg-slate-950 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-700 relative">
                {/* Camera notch */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

                {/* Inner screen */}
                <div className="bg-[#F4F7FB] rounded-[2.2rem] p-4 text-slate-900 space-y-3 overflow-hidden shadow-inner">
                  {/* Mock app header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="font-extrabold text-sm text-[#0B1B3D]">
                      INSTA<span className="text-[#0066FF]">CREDIT</span>
                    </div>
                    <div className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                      Banca En Línea
                    </div>
                  </div>

                  {/* Mock balance card */}
                  <div className="bg-gradient-to-br from-[#0B1B3D] to-[#102A6B] text-white p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] text-slate-300">Saldo Disponible Cuenta</div>
                    <div className="text-2xl font-black text-white">$ 1.250.000</div>
                    <div className="text-[9px] text-[#00E599] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#00E599]" />
                      Score Experian Excelente (785 pts)
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                    <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 text-[#0066FF]">
                      ⚡ Recargar PSE
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 text-[#0B1B3D]">
                      💳 Transferir ACH
                    </div>
                  </div>

                  {/* Recent loan ticket snippet */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Radicado: INSTA-CO-821943</span>
                      <span className="text-emerald-600 font-bold">Al día</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">$ 750.000 COP</div>
                    <div className="text-[9px] text-slate-400">Vencimiento: 30 de Octubre</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
