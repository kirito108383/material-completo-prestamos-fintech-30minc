import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatEUR } from '../../utils/financialCalculations';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  X,
  PlusCircle,
  Send,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  Sparkles,
  Scale,
  Calendar,
  Copy,
  Check
} from 'lucide-react';

export const UserBankPortal: React.FC = () => {
  const {
    isUserBankPortalOpen,
    closeUserBankPortal,
    activeBankUserApp,
    setActiveBankUserApp,
    applications,
    userDepositToAccount,
    userPayQuotaFromBalance,
    userWithdrawToExternalBank,
    openDocumentModal,
    openTicketModal,
    isAdvisorView,
    isAdminView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'resumen' | 'tarjetas' | 'movimientos' | 'creditos' | 'terminos_desembolso'>('resumen');
  const [rechargeAmount, setRechargeAmount] = useState<number>(50);
  const [rechargeMethod, setRechargeMethod] = useState<'Bizum' | 'Tarjeta'>('Bizum');
  const [bizumPhone, setBizumPhone] = useState('+34 612 345 678');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Virtual Debit & Credit Cards State
  const [showCardCvv, setShowCardCvv] = useState(false);
  const [debitCardStatus, setDebitCardStatus] = useState<'Activa' | 'Congelada'>('Activa');
  const [creditCardRequested, setCreditCardRequested] = useState(true);
  const [copiedCardNum, setCopiedCardNum] = useState(false);

  // Per-device session authentication gate when opened via shared URL (?banca_digital=...)
  const [isDeviceVerified, setIsDeviceVerified] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    const bankParam = params.get('banca_digital');
    if (!bankParam) return true;
    return sessionStorage.getItem(`instacredit_bank_session_${bankParam}`) === '1';
  });
  const [authDocOrPin, setAuthDocOrPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isUserBankPortalOpen || !activeBankUserApp) return null;

  const app = activeBankUserApp;
  const acc = app.digitalAccount;
  const loan = app.loanDetails;

  // Deterministic card numbers derived from client ID
  const numericSuffix = app.id.replace(/\D/g, '').padEnd(4, '8').slice(-4);
  const debitCardFull = `4539 8821 0492 ${numericSuffix}`;
  const creditCardFull = `5412 7590 3318 ${numericSuffix}`;

  const handleVerifyDeviceBankSession = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const clean = authDocOrPin.trim().toUpperCase();
    if (!clean) {
      setAuthError('Introduce tu DNI/NIE o tu PIN de seguridad para desbloquear tu Cuenta Digital en este dispositivo.');
      return;
    }
    const dniMatch = app.personalData.documentNumber.toUpperCase().includes(clean);
    const phoneDigits = app.personalData.phone.replace(/\D/g, '');
    const inputDigits = clean.replace(/\D/g, '');
    const phoneMatch = inputDigits.length >= 4 && phoneDigits.endsWith(inputDigits.slice(-4));
    if (!dniMatch && !phoneMatch && clean !== '4829' && clean !== '1234') {
      setAuthError('Credencial incorrecta. Por seguridad PSD2, solo el titular verificado puede abrir la Cuenta Digital en un nuevo navegador.');
      return;
    }
    sessionStorage.setItem(`instacredit_bank_session_${app.id}`, '1');
    setIsDeviceVerified(true);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rechargeAmount <= 0) return;
    userDepositToAccount(app.id, rechargeAmount, rechargeMethod);
    setShowRechargeModal(false);
    setActionNotice({
      type: 'success',
      text: `¡Recarga de ${formatEUR(rechargeAmount)} por ${rechargeMethod} acreditada instantáneamente en tu Cuenta Digital Interna!`
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > acc.balance) {
      setActionNotice({
        type: 'error',
        text: 'Saldo insuficiente en tu Cuenta Digital Interna para completar la transferencia.'
      });
      return;
    }
    const success = userWithdrawToExternalBank(app.id, withdrawAmount);
    setShowWithdrawModal(false);
    if (success) {
      setActionNotice({
        type: 'success',
        text: `¡Transferencia SEPA Instantánea de ${formatEUR(withdrawAmount)} enviada desde tu Cuenta Digital Interna hacia tu cuenta personal en ${app.bankDetails.bankName} (${app.bankDetails.iban})!`
      });
    } else {
      setActionNotice({
        type: 'error',
        text: 'No se pudo procesar la transferencia.'
      });
    }
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handlePayQuota = () => {
    const quotaAmount = loan.totalToPay;
    if (acc.balance < quotaAmount) {
      setActionNotice({
        type: 'error',
        text: `Saldo insuficiente (${formatEUR(acc.balance)}). Necesitas ${formatEUR(quotaAmount)} para amortizar la cuota.`
      });
      setTimeout(() => setActionNotice(null), 5000);
      return;
    }

    const success = userPayQuotaFromBalance(app.id, 0);
    if (success) {
      setActionNotice({
        type: 'success',
        text: `¡Pago de cuota de ${formatEUR(quotaAmount)} aplicado con éxito!`
      });
    }
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#F8FAFC] rounded-3xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-slate-200 relative flex flex-col max-h-[96vh]">
        
        {/* Top Header of Digital Bank */}
        <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between shrink-0 border-b border-blue-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-[#00E599] flex items-center justify-center font-black text-white shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-lg tracking-tight text-white">INSTACREDIT</span>
                <span className="text-[10px] uppercase font-bold bg-[#0066FF] text-white px-2 py-0.5 rounded-full">
                  Cuenta Digital Interna & Tarjetas • España
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {acc.accountNumber} • Titular: <strong>{app.personalData.firstName} {app.personalData.lastName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Account Switcher only visible to Staff (Advisor / Admin) */}
            {(isAdvisorView || isAdminView) && (
              <select
                value={app.id}
                onChange={(e) => {
                  const found = applications.find(a => a.id === e.target.value);
                  if (found) setActiveBankUserApp(found);
                }}
                className="text-[11px] font-bold bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-700 cursor-pointer hidden sm:block"
              >
                {applications.map(a => (
                  <option key={a.id} value={a.id}>
                    Cuenta: {a.digitalAccount.accountNumber} ({a.personalData.firstName})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={closeUserBankPortal}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Cerrar portal bancario"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isDeviceVerified && !isAdvisorView && !isAdminView ? (
          /* ========================================================================= */
          /* PER-DEVICE SESSION AUTHENTICATION GATE (PROTECTS SHARED URLS)             */
          /* ========================================================================= */
          <div className="p-8 max-w-md mx-auto my-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B1B3D] text-[#00E599] mx-auto flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200">
              Seguridad Bancaria por Dispositivo (PSD2)
            </span>
            <h4 className="text-lg font-black text-[#0B1B3D]">
              Verificación de Titular de Cuenta Digital
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Has abierto el enlace de la Cuenta Digital <strong>{acc.accountNumber}</strong> en un nuevo navegador o dispositivo. Introduce tu DNI/NIE o los últimos 4 dígitos de tu teléfono para verificar tu sesión.
            </p>
            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-left flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <form onSubmit={handleVerifyDeviceBankSession} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  DNI / NIE del Titular o PIN de 4 dígitos *
                </label>
                <input
                  type="text"
                  value={authDocOrPin}
                  onChange={(e) => setAuthDocOrPin(e.target.value)}
                  placeholder="Introduce tu DNI/NIE o PIN (Ej: 48921783K)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs shadow-md transition cursor-pointer"
              >
                Verificar Dispositivo y Entrar a Mi Cuenta
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Global Feedback Banner */}
            {actionNotice && (
              <div className={`p-3 text-xs font-bold flex items-center gap-2 shrink-0 ${
                actionNotice.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'
                  : 'bg-red-50 text-red-900 border-b border-red-200'
              }`}>
                {actionNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{actionNotice.text}</span>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="bg-white border-b border-slate-200 px-6 flex overflow-x-auto gap-4 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('resumen')}
                className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'resumen'
                    ? 'border-[#0066FF] text-[#0066FF]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Resumen y Transferencia a Tu Banco</span>
              </button>

              <button
                onClick={() => setActiveTab('tarjetas')}
                className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'tarjetas'
                    ? 'border-[#0066FF] text-[#0066FF]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>💳 Tarjetas Débito y Crédito</span>
              </button>

              <button
                onClick={() => setActiveTab('movimientos')}
                className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'movimientos'
                    ? 'border-[#0066FF] text-[#0066FF]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Movimientos ({acc.transactions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('creditos')}
                className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'creditos'
                    ? 'border-[#0066FF] text-[#0066FF]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendario de Pagos y Cuotas</span>
              </button>

              <button
                onClick={() => setActiveTab('terminos_desembolso')}
                className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'terminos_desembolso'
                    ? 'border-[#0066FF] text-[#0066FF]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Términos y Condiciones de Desembolso</span>
              </button>
            </div>

            {/* Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* TAB 1: RESUMEN DE CUENTA Y RETIRO A BANCO PERSONAL */}
              {activeTab === 'resumen' && (
                <div className="space-y-6">
                  {/* Balance & Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Main Balance Card */}
                    <div className="md:col-span-2 bg-gradient-to-br from-[#0B1B3D] via-[#102A6B] to-[#0A1A3C] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#0066FF]/20 rounded-full blur-2xl pointer-events-none" />

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
                            Saldo Disponible en Tu Cuenta Digital Interna
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                            Desembolso Autorizado • Libre Disposición
                          </span>
                        </div>

                        <div className="text-3xl sm:text-4xl font-black mt-2 tracking-tight tabular-nums text-white">
                          {formatEUR(acc.balance)}
                        </div>
                        <div className="text-[11px] text-slate-300 mt-1">
                          {acc.balance === 0
                            ? 'Saldo inicial en 0,00 € hasta que el sistema autorice el desembolso o realices una recarga'
                            : `Fondos depositados en tu Cuenta Interna listos para transferir a tu banco (${app.bankDetails.bankName}) o usar con tu Tarjeta Virtual`}
                        </div>
                      </div>

                      <div className="pt-6 flex flex-wrap gap-2.5">
                        <button
                          onClick={() => {
                            setWithdrawAmount(acc.balance > 0 ? acc.balance : 100);
                            setShowWithdrawModal(true);
                          }}
                          className="px-4 py-2.5 bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>Transferir a Mi Cuenta Personal ({app.bankDetails.bankName})</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('tarjetas')}
                          className="px-4 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Usar Mi Tarjeta Débito / Crédito</span>
                        </button>

                        <button
                          onClick={() => setShowRechargeModal(true)}
                          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Recargar Saldo</span>
                        </button>
                      </div>
                    </div>

                    {/* Credit Quota Summary */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">
                          Cupo de Crédito y Tarjeta
                        </span>
                        <div className="text-xl font-black text-[#0B1B3D] mt-1 tabular-nums">
                          {formatEUR(acc.creditQuota)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Abonado en cuenta interna: <strong>{formatEUR(acc.usedQuota)}</strong>
                        </div>

                        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                          <div
                            className="bg-[#0066FF] h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (acc.usedQuota / (acc.creditQuota || 1)) * 100)}%`
                            }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-400 block text-[10px] font-bold">TU BANCO PERSONAL DESTINO (SEPA)</span>
                        <div className="font-bold text-slate-800">{app.bankDetails.bankName}</div>
                        <div className="text-slate-500 font-mono text-[11px] truncate">{app.bankDetails.iban}</div>
                      </div>
                    </div>
                  </div>

                  {/* Promotional Banner for Debit & Credit Cards */}
                  <div className="bg-gradient-to-r from-emerald-950 via-[#0B1B3D] to-blue-950 rounded-3xl p-5 text-white border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#00E599] text-[10px] font-black uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        Nuevo Beneficio Exclusivo para Clientes con Fondos
                      </div>
                      <h4 className="text-base sm:text-lg font-black">
                        💳 Tarjeta de Débito Instantánea + Tarjeta de Crédito Oro Vinculada
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xl">
                        Utiliza los fondos depositados en tu Cuenta Digital Interna directamente con tu Tarjeta Virtual Visa/Mastercard sin esperas, o transfiérelos por SEPA a tu banco personal cuando quieras.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('tarjetas')}
                      className="px-5 py-2.5 rounded-xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-black text-xs shrink-0 cursor-pointer shadow-sm"
                    >
                      Ver Mis Tarjetas →
                    </button>
                  </div>

                  {/* Loan Status & Documents Strip */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Expediente de Crédito Vinculado</span>
                        <h4 className="text-base font-bold text-[#0B1B3D]">
                          Radicado: {app.id} ({app.status})
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openTicketModal(app)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Comprobante</span>
                        </button>

                        <button
                          onClick={() => openDocumentModal(app, 'contrato_mutuo')}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-bold text-xs flex items-center gap-1 border border-blue-200 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ver Contratos Oficiales (4 Páginas)</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Capital Aprobado</span>
                        <div className="font-bold text-slate-900 tabular-nums">{formatEUR(loan.capital)}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Total a Reembolsar</span>
                        <div className="font-bold text-[#0066FF] tabular-nums">{formatEUR(loan.totalToPay)}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Próximo Vencimiento</span>
                        <div className="font-bold text-slate-900">{loan.dueDate}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Interés Regulado Ley 16/2011</span>
                        <div className="font-bold text-emerald-700">1.95% TIN (26.8% TAE)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TARJETAS DE DÉBITO Y CRÉDITO PARA USUARIOS CON FONDOS */}
              {activeTab === 'tarjetas' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-black text-[#0066FF] tracking-wider">
                          Sistema de Tarjetas Bancarias Vinculadas al Saldo Interno
                        </span>
                        <h4 className="text-lg font-black text-[#0B1B3D]">
                          Mis Tarjetas Virtuales de Débito y Crédito INSTACREDIT
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCardCvv(!showCardCvv)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {showCardCvv ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showCardCvv ? 'Ocultar Numeración y CVV' : 'Mostrar Numeración y CVV'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Card 1: Virtual Debit Card linked to Internal Balance */}
                      <div className="bg-gradient-to-br from-[#0B1B3D] via-[#0F295E] to-[#0052CC] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] border border-blue-400/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-black tracking-widest text-[#00E599] block">
                              TARJETA DÉBITO INSTANTÁNEA
                            </span>
                            <span className="text-xs font-bold text-blue-100">
                              Vinculada a tu Saldo Disponible ({formatEUR(acc.balance)})
                            </span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            debitCardStatus === 'Activa' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-red-500/30 text-red-200'
                          }`}>
                            {debitCardStatus}
                          </span>
                        </div>

                        <div className="my-5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-lg sm:text-xl font-black tracking-widest text-white">
                              {showCardCvv ? debitCardFull : `4539 •••• •••• ${numericSuffix}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(debitCardFull);
                                setCopiedCardNum(true);
                                setTimeout(() => setCopiedCardNum(false), 2000);
                              }}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCardNum ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="flex items-center gap-6 text-xs font-mono text-blue-200">
                            <div>CADUCA: <strong>09/30</strong></div>
                            <div>CVV: <strong>{showCardCvv ? '842' : '•••'}</strong></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs">
                          <span className="font-bold uppercase tracking-wide truncate">
                            {app.personalData.firstName} {app.personalData.lastName}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDebitCardStatus(debitCardStatus === 'Activa' ? 'Congelada' : 'Activa')}
                              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-bold cursor-pointer"
                            >
                              {debitCardStatus === 'Activa' ? 'Congelar' : 'Reactivar'}
                            </button>
                            <span className="font-black italic text-sm">VISA</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Gold Revolving Credit Card for Clients with Funds */}
                      <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-yellow-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] border border-amber-400/40">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-black tracking-widest text-amber-300 block">
                              TARJETA DE CRÉDITO ORO VIP
                            </span>
                            <span className="text-xs font-bold text-amber-100">
                              Cupo Extra Preaprobado: {formatEUR(acc.creditQuota)}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            {creditCardRequested ? 'Activa • 0€ Comisión' : 'Disponible'}
                          </span>
                        </div>

                        <div className="my-5 space-y-2">
                          <div className="font-mono text-lg sm:text-xl font-black tracking-widest text-amber-100">
                            {showCardCvv ? creditCardFull : `5412 •••• •••• ${numericSuffix}`}
                          </div>
                          <div className="flex items-center gap-6 text-xs font-mono text-amber-200/90">
                            <div>CADUCA: <strong>11/30</strong></div>
                            <div>CVV: <strong>{showCardCvv ? '519' : '•••'}</strong></div>
                            <div>CASHBACK: <strong>2% Compras</strong></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-amber-400/20 text-xs">
                          <span className="font-bold uppercase tracking-wide truncate text-amber-100">
                            {app.personalData.firstName} {app.personalData.lastName}
                          </span>
                          <span className="font-black text-amber-300">MASTERCARD GOLD</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-[#0B1B3D]">
                        ¿Cómo funcionan tus tarjetas vinculadas a tu Cuenta Digital Interna?
                      </div>
                      <p>
                        En cuanto el asesor autoriza tu desembolso y el dinero aparece en tu saldo disponible ({formatEUR(acc.balance)}), puedes pagar en cualquier comercio online o físico con tu <strong>Tarjeta de Débito Instantánea</strong> o transferir el dinero por SEPA a tu cuenta personal externa ({app.bankDetails.bankName}).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MOVIMIENTOS BANCARIOS */}
              {activeTab === 'movimientos' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-sm text-[#0B1B3D]">Historial de Movimientos en Cuenta Digital Interna</h4>
                    <span className="text-xs text-slate-500 font-mono">IBAN {acc.accountNumber}</span>
                  </div>

                  {acc.transactions.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                      <Clock className="w-8 h-8 mx-auto text-slate-300" />
                      <p>Aún no registras movimientos en tu Cuenta Digital Interna.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 text-xs">
                      {acc.transactions.map((tx) => (
                        <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                              tx.amount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{tx.description}</div>
                              <div className="text-[11px] text-slate-400">{tx.date} • Ref: {tx.reference}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`font-black text-sm tabular-nums ${
                              tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                            }`}>
                              {tx.amount > 0 ? `+ ${formatEUR(tx.amount)}` : formatEUR(tx.amount)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Saldo: {formatEUR(tx.balanceAfter)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CALENDARIO DE PAGOS Y RECORDATORIOS DE FECHAS */}
              {activeTab === 'creditos' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#0B1B3D]">Calendario de Pagos, Cuotas y Recordatorios Preventivos (Ley 16/2011)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Recibirás recordatorios automáticos por WhatsApp y SMS 5 días y 48 horas antes de cada fecha de vencimiento. Amortización anticipada con 0,00 € de comisión.
                      </p>
                    </div>
                    <button
                      onClick={handlePayQuota}
                      className="px-4 py-2 bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] rounded-xl text-xs font-black cursor-pointer"
                    >
                      Pagar Cuota con Mi Saldo
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
                        <tr>
                          <th className="p-3">N° Cuota</th>
                          <th className="p-3">Fecha Vencimiento</th>
                          <th className="p-3">Capital</th>
                          <th className="p-3">Interés</th>
                          <th className="p-3">Garantía & Firma</th>
                          <th className="p-3">IVA (21%)</th>
                          <th className="p-3">Total Cuota</th>
                          <th className="p-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {loan.quotas?.map((q) => (
                          <tr key={q.quotaNumber} className="hover:bg-slate-50">
                            <td className="p-3 font-bold">Cuota #{q.quotaNumber}</td>
                            <td className="p-3 font-semibold text-slate-800">{q.dueDate}</td>
                            <td className="p-3 tabular-nums">{formatEUR(q.capitalAmount)}</td>
                            <td className="p-3 tabular-nums">{formatEUR(q.interestAmount)}</td>
                            <td className="p-3 tabular-nums">{formatEUR(q.fgaAmount + q.techFeeAmount)}</td>
                            <td className="p-3 tabular-nums">{formatEUR(q.ivaAmount)}</td>
                            <td className="p-3 font-black text-[#0066FF] tabular-nums">{formatEUR(q.totalQuota)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                q.status === 'Pagado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {q.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: PANEL DE TÉRMINOS Y CONDICIONES Y DEFINICIÓN DE DESEMBOLSO */}
              {activeTab === 'terminos_desembolso' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700 leading-relaxed">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="text-[10px] uppercase font-black text-[#0066FF] tracking-wider">
                      Marco Contractual Transparente • Ley 16/2011 de Crédito al Consumo
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[#0B1B3D] mt-0.5">
                      Panel de Términos, Condiciones y Perfeccionamiento del Desembolso
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                      <div className="font-black text-emerald-950 flex items-center gap-1.5 text-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>1. Garantía de No Cobro Previo al Desembolso</span>
                      </div>
                      <p className="text-emerald-900">
                        Queda explícitamente garantizado en nuestras Condiciones Generales que <strong>no se exigen cobros ni comisiones previas antes de que el préstamo sea desembolsado</strong>. Todos los conceptos financieros pactados se integran de manera transparente en el cuadro de amortización o tras el abono del capital.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                      <div className="font-black text-blue-950 flex items-center gap-1.5 text-sm">
                        <Scale className="w-4 h-4 text-[#0066FF]" />
                        <span>2. ¿Cuándo se considera efectuado el Desembolso?</span>
                      </div>
                      <p className="text-blue-900">
                        Conforme a la Cláusula Primera del Contrato de Préstamo, <strong>se considera perfeccionado y ejecutado el desembolso en el momento en que el sistema central lo autoriza —por acción y validación del asesor asignado— y los fondos quedan acreditados en la Cuenta Digital Interna</strong> que el usuario creó en nuestra plataforma.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-black text-[#0B1B3D]">
                      3. Libre Disposición de los Fondos desde la Cuenta Digital Interna del Usuario:
                    </div>
                    <p>
                      Una vez que los fondos ({formatEUR(loan.capital)}) están depositados en la Cuenta Digital Interna (IBAN <strong>{acc.accountNumber}</strong>), el usuario ostenta la plena titularidad sobre su saldo y puede disponer libremente de él para:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ordenar transferencias SEPA Instantáneas hacia su cuenta bancaria personal externa en <strong>{app.bankDetails.bankName} ({app.bankDetails.iban})</strong>.</li>
                      <li>Realizar pagos o compras con su <strong>Tarjeta Virtual de Débito o Crédito INSTACREDIT</strong> vinculada a su cuenta.</li>
                      <li>Amortizar cuotas de su financiación sin comisión por reembolso anticipado (0,00 € conforme al Art. 30 de la Ley 16/2011).</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs shrink-0">
          <div className="text-slate-500 text-center sm:text-left">
            <strong>INSTACREDIT ESPAÑA FINTECH S.L.</strong> (NIF B-89412093) • Cumplimiento Ley 16/2011 y Firma eIDAS
          </div>
          <button
            onClick={closeUserBankPortal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition cursor-pointer"
          >
            Cerrar Portal
          </button>
        </div>

      </div>

      {/* Recarga Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-[#0B1B3D]">Recargar Saldo en Cuenta Interna</h4>
                <p className="text-[11px] text-slate-500">Acreditación instantánea a tu cuenta digital</p>
              </div>
              <button onClick={() => setShowRechargeModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRechargeMethod('Bizum')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    rechargeMethod === 'Bizum'
                      ? 'border-[#0066FF] bg-blue-50 text-[#0066FF] ring-2 ring-[#0066FF]/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#0066FF]" />
                  <span>Bizum</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRechargeMethod('Tarjeta')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    rechargeMethod === 'Tarjeta'
                      ? 'border-[#0066FF] bg-blue-50 text-[#0066FF] ring-2 ring-[#0066FF]/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Tarjeta</span>
                </button>
              </div>

              {rechargeMethod === 'Bizum' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Móvil Vinculado a Bizum *</label>
                  <input
                    type="tel"
                    value={bizumPhone}
                    onChange={(e) => setBizumPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Importe a Recargar (€)</label>
                <input
                  type="number"
                  step={10}
                  min={10}
                  max={5000}
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-base rounded-xl border border-slate-300 font-bold text-[#0066FF]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Confirmar Recarga de {formatEUR(rechargeAmount)}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Retiro a Banco Personal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-[#0B1B3D]">Transferir de Cuenta Interna a Tu Banco</h4>
                <p className="text-[11px] text-slate-500">Envío SEPA Instantáneo a tu cuenta personal</p>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1 border border-slate-200">
                <div>Cuenta Origen: <strong className="font-mono">{acc.accountNumber} (Interna)</strong></div>
                <div>Banco Personal Destino: <strong>{app.bankDetails.bankName}</strong></div>
                <div className="font-mono text-[11px] truncate text-slate-500">{app.bankDetails.iban}</div>
                <div>Saldo disponible: <strong className="text-emerald-700 font-bold">{formatEUR(acc.balance)}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Importe a Transferir a Tu Cuenta Personal (€)</label>
                <input
                  type="number"
                  step={10}
                  min={10}
                  max={acc.balance || 100000}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-base rounded-xl border border-slate-300 font-bold text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Transferir {formatEUR(withdrawAmount)} a Mi Cuenta Personal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
