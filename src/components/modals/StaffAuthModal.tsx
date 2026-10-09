import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Headphones,
  Settings,
  X,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';

interface StaffAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'advisor' | 'admin';
}

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'advisor'
}) => {
  const {
    advisorsList,
    currentAdvisor,
    loginAdvisor,
    loginAdmin,
    isAdvisorLoggedIn,
    isAdminLoggedIn,
    platformConfig
  } = useApp();

  const [mode, setMode] = useState<'advisor' | 'admin'>(defaultMode);

  // Advisor login state
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>(currentAdvisor.id || advisorsList[0]?.id || 'ADV-01');
  const [advisorPin, setAdvisorPin] = useState<string>('');
  const [advisorError, setAdvisorError] = useState<string | null>(null);

  // Admin login state
  const [adminPass, setAdminPass] = useState<string>('');
  const [adminError, setAdminError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdvisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvisorError(null);
    const result = loginAdvisor(selectedAdvisorId, advisorPin);
    if (result.success) {
      onClose();
    } else {
      setAdvisorError(result.message);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    const success = loginAdmin(adminPass);
    if (success) {
      onClose();
    } else {
      setAdminError('Contraseña de administrador incorrecta. Utiliza "admin2026" para acceder.');
    }
  };

  const selectedAdvObj = advisorsList.find(a => a.id === selectedAdvisorId) || advisorsList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full my-auto overflow-hidden border border-slate-200 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/20 rounded-full transition z-10 cursor-pointer"
          title="Cerrar y volver a la web"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="bg-[#0B1B3D] text-white p-5 sm:p-6 border-b border-blue-900 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#00E599]">
              Área Restringida • Empleados y Dirección
            </span>
          </div>

          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#0066FF]" />
            Control de Acceso Seguro Instacredit
          </h3>
          <p className="text-xs text-blue-200 mt-1 leading-snug">
            Acceso estrictamente reservado a personal autorizado para la gestión de solicitudes, expedientes crediticios y supervisión del Banco de España.
          </p>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-[#06122C] rounded-2xl border border-blue-900/60">
            <button
              type="button"
              onClick={() => {
                setMode('advisor');
                setAdvisorError(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                mode === 'advisor'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Headphones className="w-4 h-4 text-[#00E599]" />
              <span>Portal de Asesores</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('admin');
                setAdminError(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                mode === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Administrador Central</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {mode === 'advisor' ? (
            /* ========================================================================= */
            /* ADVISOR LOGIN FORM */
            /* ========================================================================= */
            <form onSubmit={handleAdvisorSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3">
                <Info className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Identificación Corporativa:</strong> Selecciona tu perfil oficial de asesor e introduce tu PIN de seguridad asignado por Recursos Humanos.
                </div>
              </div>

              {/* Advisor Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Selecciona tu Asesor Corporativo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {advisorsList.map((adv) => {
                    const isSelected = adv.id === selectedAdvisorId;
                    return (
                      <div
                        key={adv.id}
                        onClick={() => setSelectedAdvisorId(adv.id)}
                        className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-blue-50 border-[#0066FF] ring-2 ring-[#0066FF]/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={adv.avatar}
                          alt={adv.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-[#0B1B3D] truncate flex items-center justify-between">
                            <span>{adv.name}</span>
                            <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-100/70 px-1 rounded">
                              {adv.id}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {adv.roleTitle.split(' ')[0]} {adv.roleTitle.split(' ')[1]}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Advisor Details Preview */}
              {selectedAdvObj && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Especialidad:</span>
                    <span className="font-bold text-[#0B1B3D]">{selectedAdvObj.specialty}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Teléfono Asignado:</span>
                    <span className="font-mono text-slate-600">{selectedAdvObj.phone}</span>
                  </div>
                </div>
              )}

              {/* PIN Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    PIN de Seguridad del Asesor
                  </label>
                  <span className="text-[11px] text-[#0066FF] font-mono font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                    PIN Demo: asesor2026
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={advisorPin}
                    onChange={(e) => setAdvisorPin(e.target.value)}
                    placeholder="Introduce el PIN de 4 a 10 dígitos..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0066FF] focus:outline-hidden"
                    autoFocus
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                {advisorError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {advisorError}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Volver a la Web
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-[#0066FF] hover:bg-blue-600 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Validar y Entrar como Asesor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================================= */
            /* ADMIN MASTER LOGIN FORM */
            /* ========================================================================= */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Acceso de Alta Dirección:</strong> Este panel permite autorizar desembolsos bancarios, modificar tipos de interés y auditar expedientes reportados al Banco de España (BdE).
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Contraseña Maestra de Administrador
                  </label>
                  <span className="text-[11px] text-amber-800 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded-md">
                    Clave Demo: admin2026
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Digita admin2026..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    autoFocus
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                {adminError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {adminError}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Entidad Emisora:</span>
                  <span className="font-bold text-[#0B1B3D]">{platformConfig.companyName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Supervisión Regulatoria:</span>
                  <span className="font-bold text-emerald-700">Banco de España (Circular 5/2012)</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-slate-900 hover:bg-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00E599]" />
                  <span>Autenticar y Entrar como Administrador</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firma eIDAS & RGPD UE 2016/679</span>
          </div>
          <span className="font-mono text-[10px]">Audit Log: Activo</span>
        </div>
      </div>
    </div>
  );
};
