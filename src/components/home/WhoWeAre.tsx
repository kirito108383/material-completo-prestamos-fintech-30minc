import React from 'react';
import { BookOpen, Eye, Zap, Check, Shield } from 'lucide-react';

export const WhoWeAre: React.FC = () => {
  return (
    <section id="quienes-somos" className="py-16 sm:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Nuestra Filosofía Fintech • España
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
            ¿Quiénes somos en INSTACREDIT España?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Somos una compañía fintech española pionera en microcréditos transparentes en línea y cuentas de pago digital independientes. Promovemos la inclusión financiera en España mediante una plataforma ética, sin letra pequeña y alineada con la Ley 16/2011 y las directrices del Banco de España (BdE).
          </p>
        </div>

        {/* 3 Core Value Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform font-bold">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">
              Sin lenguaje complicado
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hablamos claro. Sin términos incomprensibles ni costes ocultos. Conoces desde el primer segundo el valor exacto de intereses diarios (0.065% / 1.95% TIN), fianza europea, tecnología e IVA (21%).
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Liquidación previa vinculante visible</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Explicación al detalle de la TAE normalizada</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform font-bold">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">
              Sin condiciones ocultas
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lo que ves en nuestra calculadora precontractual es exactamente lo que pagas. Cumplimos con el marco legal de contratos de crédito al consumo en España (Ley 16/2011).
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Desembolso directo en tu Cuenta Digital IBAN creada</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tarjetas virtuales de débito y crédito vinculadas a tu saldo</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#0B1B3D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform font-bold">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">
              Sin pasos innecesarios
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Olvídate de desplazamientos a sucursales y papeleo físico. Todo tu préstamo se gestiona online desde tu móvil con verificación de DNI/NIE, Cuenta IBAN y firma digital eIDAS con token SMS.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Trámite 100% digital en 5 minutos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Firma electrónica eIDAS (Reglamento UE Nº 910/2014)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
