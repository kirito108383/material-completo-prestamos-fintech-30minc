import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  FileText,
  Lock,
  MessageCircle,
  ExternalLink,
  Wallet
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { platformConfig, openLookupModal, openPqrsModal, openUserBankPortal, setIsAdminView } = useApp();

  return (
    <footer className="bg-[#071329] text-white pt-16 pb-12 border-t-4 border-[#0066FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-blue-950/80">
          
          {/* Col 1 & 2: Brand & Corporate Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline font-black tracking-tight">
              <span className="text-3xl text-white font-black">
                INSTA
              </span>
              <span className="text-3xl text-[#0066FF] font-black ml-0.5 flex items-center">
                CREDIT
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] ml-1 shadow-sm"></span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Plataforma tecnológica de inclusión financiera en línea y banca digital para España. Operada por <strong>{platformConfig.companyName}</strong>, con NIF <strong>{platformConfig.companyNif}</strong>. Cuentas digitales independientes con IBAN español, saldo en tiempo real y microcréditos 100% regulados por la Ley 16/2011 y supervisados por el Banco de España.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>{platformConfig.companyAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>Atención Nacional: <strong>{platformConfig.phoneNational}</strong> | Madrid: {platformConfig.phoneMadrid}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>{platformConfig.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00E599] shrink-0" />
                <span>{platformConfig.businessHoursWeekdays}</span>
              </div>
            </div>

            {/* Social media links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={platformConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-950 hover:bg-[#0066FF] flex items-center justify-center text-xs transition"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href={platformConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-950 hover:bg-[#0066FF] flex items-center justify-center text-xs transition"
                aria-label="Instagram"
              >
                ig
              </a>
              <a
                href={platformConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-950 hover:bg-[#0066FF] flex items-center justify-center text-xs transition"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href={platformConfig.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-950 hover:bg-[#0066FF] flex items-center justify-center text-xs transition"
                aria-label="TikTok"
              >
                tk
              </a>
            </div>
          </div>

          {/* Col 3: Navegación & Trámites */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400">
              Trámites en Línea
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => openUserBankPortal()}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer text-emerald-300 font-semibold"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#00E599]" />
                  Mi Cuenta Digital & Tarjetas
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLookupModal()}
                  className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3 h-3 text-[#0066FF]" />
                  Consultar Expediente / Radicado
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLookupModal()}
                  className="hover:text-white transition cursor-pointer"
                >
                  Pagar cuota con Bizum o SEPA
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLookupModal()}
                  className="hover:text-white transition cursor-pointer"
                >
                  Solicitar prórroga de fecha
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPqrsModal()}
                  className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-[#0066FF]" />
                  Servicio de Atención al Cliente (SAC)
                </button>
              </li>
              <li>
                <a
                  href={platformConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  Atención WhatsApp Oficial
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Régimen Legal y Normativo */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400">
              Marco Legal en España y UE
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>Ley 16/2011 de Contratos de Crédito al Consumo</li>
              <li>Reglamento (UE) 910/2014 de Firma Electrónica eIDAS</li>
              <li>Protección de Datos RGPD y LOPDGDD (Ley 3/2018)</li>
              <li>Prevención de Blanqueo de Capitales (Ley 10/2010)</li>
              <li>Amortización Anticipada 0% Comisión (Art. 30 Ley 16/2011)</li>
              <li>Derecho de Desistimiento en 14 Días Naturales</li>
            </ul>
          </div>

          {/* Col 5: Garantías Contractuales y Admin Portal */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400">
              Garantías y Transparencia
            </h4>
            
            {/* Regulatory badge cards */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                CUMPLIMIENTO LEY 16/2011
              </div>
              <p className="text-[10px] text-slate-300">
                Información Normalizada Europea (INE) y TAE transparente.
              </p>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-blue-300">
                FIRMA CUALIFICADA eIDAS
              </div>
              <p className="text-[10px] text-slate-300">
                Contratos de 4 páginas con huella criptográfica SHA-256.
              </p>
            </div>

            {/* Quick Admin Toggle */}
            <div className="pt-2">
              <button
                onClick={() => setIsAdminView(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-[#0066FF]" />
                <span>Panel Administrativo Fintech</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar Disclaimers */}
        <div className="pt-8 text-[11px] text-slate-400 space-y-3">
          <p className="leading-relaxed">
            <strong>INFORMACIÓN PRECONTRACTUAL Y DEFINICIÓN DE DESEMBOLSO (LEY 16/2011):</strong> Los préstamos al consumo otorgados por INSTACREDIT ESPAÑA FINTECH S.L. (NIF B-89412093) se formalizan mediante contrato mercantil de 4 páginas y pagaré electrónico eIDAS. Cada Cuenta Digital IBAN se apertura con saldo inicial de 0,00 € y es de titularidad personal e intransferible del cliente verificado. Se entiende perfeccionado el desembolso en el instante en que el sistema autoriza la operación y acredita los fondos en la Cuenta Digital interna creada por el usuario, desde la cual el titular dispone libremente de su saldo mediante transferencia SEPA Instantánea a su banco personal o mediante sus tarjetas virtuales de débito y crédito vinculadas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-blue-950 text-slate-500">
            <div>
              © 2026 INSTACREDIT España Fintech S.L. (NIF B-89412093) - Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Términos y Condiciones (Ley 16/2011)</span>
              <span>•</span>
              <span>Política de Privacidad RGPD</span>
              <span>•</span>
              <span>Seguridad PSD2 y Tarjetas</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
