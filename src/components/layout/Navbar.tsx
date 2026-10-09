import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  Phone,
  Search,
  LogIn,
  Menu,
  X,
  ShieldCheck,
  Clock,
  Mail,
  MessageCircle,
  Settings,
  HelpCircle,
  FileText,
  Wallet,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  User,
  Headphones,
  Check,
  Trash2,
  Volume2,
  Lock
} from 'lucide-react';
import { PushNotificationManager } from '../pwa/PushNotificationManager';

export const Navbar: React.FC = () => {
  const {
    platformConfig,
    openLookupModal,
    openPqrsModal,
    openUserBankPortal,
    openUserLoginModal,
    openDidacticForm,
    currentUser,
    isAdminLoggedIn,
    isAdminView,
    setIsAdminView,
    isAdvisorView,
    setIsAdvisorView,
    isAdvisorLoggedIn,
    currentAdvisor,
    openStaffAuthModal,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    clearAllNotifications
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (isAdminView) setIsAdminView(false);
    if (isAdvisorView) setIsAdvisorView(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top micro-bar for regulatory oversight (Spain / Banco de España) */}
      <div className="bg-[#0B1B3D] text-white text-[11px] py-1 px-4 tracking-wide border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
            <span className="font-semibold text-emerald-400">Banco de España (BdE) • Circular 5/2012</span>
            <span className="text-slate-400">|</span>
            <span>Ley 16/2011 de Contratos de Crédito al Consumo</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">NIF: {platformConfig.companyNif}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => openPqrsModal()}
              className="hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3 h-3 text-[#00E599]" />
              <span>Reclamaciones y SAC</span>
            </button>
            <span className="text-slate-500">|</span>
            <a
              href={`tel:${platformConfig.phoneNational}`}
              className="flex items-center gap-1 text-white hover:text-blue-300 font-bold"
            >
              <Phone className="w-3 h-3 text-[#0066FF]" />
              <span>{platformConfig.phoneNational}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo INSTACREDIT España */}
          <div
            onClick={() => {
              if (isAdminView) setIsAdminView(false);
              if (isAdvisorView) setIsAdvisorView(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="flex items-baseline font-black tracking-tight">
              <span className="text-3xl sm:text-4xl text-[#0B1B3D] font-black group-hover:text-[#0066FF] transition-colors">
                INSTA
              </span>
              <span className="text-3xl sm:text-4xl text-[#0066FF] font-black ml-0.5 flex items-center">
                CREDIT
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] ml-1 shadow-sm"></span>
              </span>
            </div>
            <span className="hidden md:inline-block ml-2 text-[10px] uppercase font-extrabold text-[#00E599] bg-[#0B1B3D] px-2 py-0.5 rounded-md tracking-wider">
              España • PWA
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-slate-700">
            <button
              onClick={() => scrollToSection('como-solicitar')}
              className="hover:text-[#0066FF] transition-colors cursor-pointer"
            >
              Cómo solicitar
            </button>
            <button
              onClick={() => scrollToSection('como-pagar')}
              className="hover:text-[#0066FF] transition-colors cursor-pointer"
            >
              Pagar con Bizum
            </button>
            <button
              onClick={() => scrollToSection('como-extender')}
              className="hover:text-[#0066FF] transition-colors cursor-pointer"
            >
              Plazos y Prórrogas
            </button>
            <button
              onClick={() => scrollToSection('quienes-somos')}
              className="hover:text-[#0066FF] transition-colors cursor-pointer"
            >
              Regulación BdE
            </button>
            <button
              onClick={() => scrollToSection('dudas-frecuentes')}
              className="hover:text-[#0066FF] transition-colors cursor-pointer"
            >
              Preguntas Frecuentes
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* PWA Push Notification Status & Trigger */}
            <PushNotificationManager compact={true} />

            {/* Didactic Form Accessible Helper */}
            <button
              type="button"
              onClick={() => openDidacticForm()}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-850 text-xs font-bold border border-cyan-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Formularios Didácticos con lectura por voz para personas con dificultades visuales o de lectura"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden lg:inline">Formulario con Voz</span>
            </button>

            {/* In-App PWA Install Button */}
            <PWAInstallButton />

            {/* Notification Center Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl text-slate-700 hover:text-[#0066FF] hover:bg-slate-100 transition cursor-pointer"
                title="Centro de Notificaciones en Vivo"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Center Dropdown */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="bg-[#0B1B3D] text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#00E599]" />
                      <h4 className="text-xs font-black">Notificaciones del Sistema</h4>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-blue-200 hover:text-white flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Limpiar</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No tienes notificaciones pendientes.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3 text-xs transition cursor-pointer flex items-start gap-2.5 rounded-xl ${
                            !notif.read ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50 opacity-80'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            {notif.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />}
                            {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                            {notif.type === 'info' && <Info className="w-4 h-4 text-[#0066FF]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-[11px] mb-0.5">
                              <span className="font-bold text-[#0B1B3D] truncate">{notif.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-snug">{notif.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Portal de Asesores (Atención al Cliente) - Protegido por PIN */}
            {isAdvisorLoggedIn ? (
              <button
                onClick={() => {
                  setIsAdminView(false);
                  setIsAdvisorView(!isAdvisorView);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition shadow-2xs cursor-pointer ${
                  isAdvisorView
                    ? 'bg-[#0066FF] text-white border-[#0066FF]'
                    : 'bg-sky-50 text-sky-950 hover:bg-sky-100 border-sky-300'
                }`}
                title={`Sesión activa: ${currentAdvisor.name} (${currentAdvisor.id})`}
              >
                <Headphones className="w-3.5 h-3.5 text-[#0066FF]" />
                <span className="hidden md:inline">{currentAdvisor.name.split(' ')[0]}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
              </button>
            ) : (
              <button
                onClick={() => openStaffAuthModal('advisor')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition shadow-2xs cursor-pointer"
                title="Acceso exclusivo para asesores autorizados (PIN corporativo)"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Portal Asesor</span>
              </button>
            )}

            {/* Mi Cuenta Bancaria Digital */}
            <button
              onClick={() => openUserBankPortal()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition shadow-2xs cursor-pointer"
              title="Ver mi cuenta bancaria digital Instacredit y saldo IBAN"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cuenta IBAN</span>
            </button>

            {/* Área Clientes / Login */}
            <button
              onClick={() => openUserLoginModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 rounded-xl shadow-xs transition cursor-pointer"
              title="Iniciar sesión o registrar cuenta de usuario"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser ? currentUser.fullName.split(' ')[0] : 'Área Clientes'}</span>
            </button>

            {/* Admin Switcher / Login button */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setIsAdvisorView(false);
                  setIsAdminView(!isAdminView);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  isAdminView
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-900 text-white hover:bg-black'
                }`}
                title="Panel de Administración Central"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isAdminView ? 'Web Pública' : 'Admin'}</span>
              </button>
            ) : (
              <button
                onClick={() => openStaffAuthModal('admin')}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
                title="Acceso reservado a Administración Central"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-bold hidden xl:inline text-slate-600">Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={() => openUserLoginModal()}
              className="p-2 text-[#0066FF] bg-blue-50 rounded-xl"
              title="Área Clientes"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => openUserBankPortal()}
              className="p-2 text-emerald-700 bg-emerald-50 rounded-xl"
              title="Mi Cuenta IBAN"
            >
              <Wallet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-black focus:outline-hidden"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-3">
            <div className="flex flex-col space-y-2 font-semibold text-slate-800 text-xs">
              <button
                onClick={() => scrollToSection('como-solicitar')}
                className="text-left py-2 px-2 hover:bg-slate-50 rounded-xl"
              >
                Cómo solicitar
              </button>
              <button
                onClick={() => scrollToSection('como-pagar')}
                className="text-left py-2 px-2 hover:bg-slate-50 rounded-xl"
              >
                Pagar con Bizum
              </button>
              <button
                onClick={() => scrollToSection('como-extender')}
                className="text-left py-2 px-2 hover:bg-slate-50 rounded-xl"
              >
                Plazos y Prórrogas
              </button>
              <button
                onClick={() => scrollToSection('quienes-somos')}
                className="text-left py-2 px-2 hover:bg-slate-50 rounded-xl"
              >
                Regulación BdE
              </button>
              <button
                onClick={() => scrollToSection('dudas-frecuentes')}
                className="text-left py-2 px-2 hover:bg-slate-50 rounded-xl"
              >
                Preguntas frecuentes
              </button>
              
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openUserLoginModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#0066FF] rounded-xl shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>{currentUser ? `Mi Cuenta (${currentUser.fullName.split(' ')[0]})` : 'Área de Clientes (PWA)'}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openUserBankPortal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-50 rounded-xl border border-emerald-200"
                >
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>Cuenta Digital IBAN y Saldo</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isAdvisorLoggedIn) {
                      setIsAdminView(false);
                      setIsAdvisorView(true);
                    } else {
                      openStaffAuthModal('advisor');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-sky-950 bg-sky-50 rounded-xl border border-sky-200"
                >
                  <Headphones className="w-4 h-4 text-[#0066FF]" />
                  <span>{isAdvisorLoggedIn ? `Portal Asesor (${currentAdvisor.name.split(' ')[0]})` : 'Acceso Asesores (PIN)'}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLookupModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-[#0B1B3D] bg-slate-100 rounded-xl"
                >
                  <Search className="w-4 h-4 text-slate-600" />
                  <span>Rastrear Radicado / Tiquete</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isAdminLoggedIn) {
                      setIsAdvisorView(false);
                      setIsAdminView(!isAdminView);
                    } else {
                      openStaffAuthModal('admin');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <Settings className="w-4 h-4" />
                  <span>{isAdminLoggedIn ? (isAdminView ? 'Ver Web Pública' : 'Panel de Admin') : 'Acceso Administrador (Clave)'}</span>
                </button>
              </div>

              {/* Operating hours & phone info */}
              <div className="mt-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>{platformConfig.businessHoursWeekdays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Línea Gratuita: <strong>{platformConfig.phoneNational}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>{platformConfig.supportEmail}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
