import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpanishDocumentType } from '../../types';
import { COUNTRIES_OF_RESIDENCE } from '../../data/initialData';
import {
  User,
  Lock,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Wallet,
  ArrowRight,
  LogOut,
  CreditCard,
  Building,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export const UserAuthModal: React.FC = () => {
  const {
    isUserLoginModalOpen,
    closeUserLoginModal,
    currentUser,
    userAccounts,
    loginUser,
    registerUser,
    logoutUser,
    openUserBankPortal,
    openTicketModal,
    applications
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginEmailOrDoc, setLoginEmailOrDoc] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Register Form State
  const [fullName, setFullName] = useState('');
  const [documentType, setDocumentType] = useState<SpanishDocumentType>('DNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('España');
  const [phone, setPhone] = useState('+34 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isUserLoginModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!loginEmailOrDoc.trim() || !loginPassword.trim()) {
      setFeedback({ type: 'error', message: 'Por favor introduce tu correo o documento y contraseña.' });
      return;
    }

    const res = loginUser(loginEmailOrDoc, loginPassword);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!fullName.trim() || !documentNumber.trim() || !email.trim() || !password.trim()) {
      setFeedback({ type: 'error', message: 'Todos los campos marcados con (*) son obligatorios.' });
      return;
    }

    const res = registerUser({
      fullName,
      documentType,
      documentNumber,
      phone,
      email,
      passwordHash: password
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleQuickDemoUser = (user: typeof userAccounts[0]) => {
    setLoginEmailOrDoc(user.email);
    setLoginPassword(user.passwordHash || 'Insta2026!');
    loginUser(user.email, user.passwordHash || 'Insta2026!');
  };

  const userLinkedApp = currentUser
    ? applications.find(
        (a) => a.id === currentUser.applicationId || a.personalData.documentNumber === currentUser.documentNumber
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full my-auto overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0B1B3D] via-[#0E2452] to-[#0055FF] text-white p-6 relative">
          <button
            onClick={closeUserLoginModal}
            className="absolute top-5 right-5 p-2 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/30 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
              Banca Digital PWA • España
            </span>
            <span className="text-xs text-blue-200">Acceso Seguro 256-bit</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {currentUser ? 'Tu Cuenta Digital Instacredit' : 'Área de Clientes'}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            {currentUser
              ? `Sesión activa para ${currentUser.fullName}. Consulta tu saldo IBAN y préstamos.`
              : 'Ingresa con tus credenciales seguras para gestionar tus préstamos, saldo y transferencias.'}
          </p>
        </div>

        {/* Feedback message banner */}
        {feedback && (
          <div
            className={`p-3.5 text-xs font-bold flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'
                : 'bg-red-50 text-red-900 border-b border-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {/* LOGGED IN VIEW */}
          {currentUser ? (
            <div className="space-y-5">
              {/* User Snapshot Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0066FF] shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black text-[#0B1B3D] truncate">{currentUser.fullName}</h4>
                  <div className="text-xs text-slate-500 font-mono">
                    {currentUser.documentType}: <strong>{currentUser.documentNumber}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                </div>
                <button
                  onClick={logoutUser}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Linked Digital Bank & Application Summary */}
              {userLinkedApp ? (
                <div className="bg-gradient-to-br from-[#0B1B3D] to-[#122D68] text-white rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
                      Cuenta Digital IBAN
                    </span>
                    <span className="text-[10px] bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                      Estado: {userLinkedApp.status}
                    </span>
                  </div>

                  <div className="font-mono text-sm sm:text-base font-bold text-blue-200">
                    {userLinkedApp.digitalAccount.accountNumber}
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t border-blue-900/60">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-bold">Saldo Disponible</span>
                      <div className="text-2xl font-black text-white tabular-nums">
                        {userLinkedApp.digitalAccount.balance.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 block font-bold">Crédito Vinculado</span>
                      <div className="text-sm font-bold text-[#00E599] tabular-nums">
                        {userLinkedApp.loanDetails.capital.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                    <span>Sin crédito activo vinculado a esta cuenta aún</span>
                  </div>
                  <p className="text-blue-700">
                    Puedes solicitar tu primer préstamo de hasta 3.000 € con desembolso inmediato en tu nueva Cuenta Digital.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {userLinkedApp && (
                  <button
                    onClick={() => {
                      closeUserLoginModal();
                      openUserBankPortal(userLinkedApp);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Entrar a mi Cuenta Digital Bancaria</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                )}

                {userLinkedApp && (
                  <button
                    onClick={() => {
                      closeUserLoginModal();
                      openTicketModal(userLinkedApp);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#0B1B3D] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Ver Comprobante / Ticket Oficial ({userLinkedApp.id})</span>
                  </button>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">¿Cambiar de usuario de prueba?</span>
                  <button
                    onClick={() => logoutUser()}
                    className="text-xs font-bold text-[#0066FF] hover:underline"
                  >
                    Iniciar con otra cuenta
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* NOT LOGGED IN: TABS FOR LOGIN / REGISTER */
            <div className="space-y-5">
              {/* Tab Selector */}
              <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                    mode === 'login' ? 'bg-white text-[#0B1B3D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                    mode === 'register' ? 'bg-white text-[#0B1B3D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Crear Cuenta Nueva
                </button>
              </div>

              {/* TAB A: INICIAR SESIÓN */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo Electrónico o DNI/NIE *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={loginEmailOrDoc}
                        onChange={(e) => setLoginEmailOrDoc(e.target.value)}
                        placeholder="ejemplo@correo.es o 12345678Z"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF] focus:border-transparent bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Contraseña *</label>
                      <span className="text-[11px] text-[#0066FF] hover:underline cursor-pointer">
                        ¿Olvidaste tu clave?
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Introduce tu contraseña"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF] focus:border-transparent bg-slate-50/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Acceder a mi Cuenta Digital</span>
                  </button>

                  {/* Demo Quick Accounts */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Cuentas de Prueba Preconfiguradas:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {userAccounts.slice(0, 2).map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleQuickDemoUser(user)}
                          className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition cursor-pointer"
                        >
                          <div className="font-bold text-xs text-[#0B1B3D] truncate">{user.fullName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{user.documentNumber}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* TAB B: CREAR CUENTA NUEVA */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo y Apellidos *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej: Laura Gómez Sánchez"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Documento *</label>
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value as SpanishDocumentType)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="DNI">DNI (Español)</option>
                        <option value="NIE">NIE (Extranjero residente)</option>
                        <option value="Pasaporte">Pasaporte + TIE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Número de Documento *</label>
                      <input
                        type="text"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                        placeholder="12345678Z o Y1234567X"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono uppercase"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">País de Residencia *</label>
                    <select
                      value={countryOfResidence}
                      onChange={(e) => setCountryOfResidence(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      {COUNTRIES_OF_RESIDENCE.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Si eres extranjero, se requiere NIE comunitario o permiso de residencia en vigor en España.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Móvil (+34) *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+34 612 345 678"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña de Acceso *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Crear Mi Cuenta & Generar IBAN</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Banco de España & Ley 16/2011</span>
          </span>
          <span>NIF B-89412093</span>
        </div>
      </div>
    </div>
  );
};
