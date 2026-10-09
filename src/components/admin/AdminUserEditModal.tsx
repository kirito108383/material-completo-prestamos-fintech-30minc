import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditApplication, LoanStatus, SpanishDocumentType, EmploymentType, LoanPurpose } from '../../types';
import { SPANISH_PROVINCES, COUNTRIES_OF_RESIDENCE } from '../../data/initialData';
import { calculateLoanBreakdown, formatEUR } from '../../utils/financialCalculations';
import {
  X,
  Save,
  User,
  Briefcase,
  Building,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

interface AdminUserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CreditApplication | null;
}

const SPANISH_BANKS = [
  'Banco Santander',
  'BBVA',
  'CaixaBank',
  'Banco Sabadell',
  'ING Direct',
  'Bankinter',
  'Unicaja Banco',
  'Abanca',
  'Kutxabank',
  'Ibercaja',
  'Openbank',
  'N26 Bank',
  'Revolut Bank',
  'Cajamar Caja Rural',
  'Banca March',
  'Deutsche Bank España',
  'Laboral Kutxa'
];

export const AdminUserEditModal: React.FC<AdminUserEditModalProps> = ({
  isOpen,
  onClose,
  application
}) => {
  const { updateApplicationFullData, advisorsList, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'personal' | 'economico' | 'bancario' | 'prestamo'>('personal');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form state initialized from application
  const [formData, setFormData] = useState<CreditApplication | null>(null);

  useEffect(() => {
    if (application) {
      setFormData(JSON.parse(JSON.stringify(application)));
    }
  }, [application]);

  if (!isOpen || !application || !formData) return null;

  const handlePersonalChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        personalData: {
          ...prev.personalData,
          [field]: value
        }
      };
    });
  };

  const handleEconomicChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        economicData: {
          ...prev.economicData,
          [field]: value
        }
      };
    });
  };

  const handleBankChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      };
    });
  };

  const handleLoanChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        loanDetails: {
          ...prev.loanDetails,
          [field]: value
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Recalculate loan breakdown if capital or term was modified
    const currentCapital = formData.loanDetails.capital;
    const currentTerm = formData.loanDetails.termDays;
    const recalculated = calculateLoanBreakdown(currentCapital, currentTerm);
    recalculated.loanPurpose = formData.economicData.loanPurpose || formData.loanDetails.loanPurpose;

    const assignedAdvisor = advisorsList.find((a) => a.id === formData.assignedAdvisorId);

    const updatedPayload: Partial<CreditApplication> = {
      personalData: formData.personalData,
      economicData: formData.economicData,
      bankDetails: formData.bankDetails,
      loanDetails: {
        ...formData.loanDetails,
        interestAmount: recalculated.interestAmount,
        fgaGuaranteeAmount: recalculated.fgaGuaranteeAmount,
        ivaAmount: recalculated.ivaAmount,
        totalToPay: recalculated.totalToPay,
        quotas: recalculated.quotas
      },
      status: formData.status,
      approvedAmount: Number(formData.approvedAmount) || currentCapital,
      assignedAdvisorId: formData.assignedAdvisorId,
      assignedAdvisorName: assignedAdvisor ? assignedAdvisor.name : formData.assignedAdvisorName,
      adminNotes: formData.adminNotes
    };

    updateApplicationFullData(formData.id, updatedPayload);

    addNotification({
      recipientRole: 'admin',
      title: '✅ Expediente Actualizado',
      message: `Los datos del cliente ${formData.personalData.firstName} ${formData.personalData.lastName} (${formData.id}) han sido corregidos correctamente.`,
      type: 'success'
    });

    setSuccessNotice('¡Todos los datos han sido actualizados con éxito en el sistema!');
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0B1B3D] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0066FF] flex items-center justify-center font-bold text-white shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">
                  Ver y Editar Datos del Usuario
                </h3>
                <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Expediente #{formData.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Herramienta administrativa para corregir datos erróneos introducidos por el cliente y recalcular condiciones.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 px-5 pt-3 border-b border-slate-200 flex gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-2.5 px-4 text-xs font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-white text-[#0066FF] border-t-2 border-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Datos Personales & DNI/NIE</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('economico')}
            className={`py-2.5 px-4 text-xs font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'economico'
                ? 'bg-white text-[#0066FF] border-t-2 border-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. Situación Laboral & Ingresos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bancario')}
            className={`py-2.5 px-4 text-xs font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bancario'
                ? 'bg-white text-[#0066FF] border-t-2 border-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>3. Datos Bancarios & IBAN</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prestamo')}
            className={`py-2.5 px-4 text-xs font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'prestamo'
                ? 'bg-white text-[#0066FF] border-t-2 border-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>4. Préstamo, Estado & Asesor</span>
          </button>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-5 py-3 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          
          {/* TAB 1: DATOS PERSONALES */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-blue-900">
                <AlertCircle className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Corrección de Datos Personales:</strong> Verifica que el nombre, número de documento y teléfono coincidan con el DNI o NIE físico del solicitante para evitar rechazos en pasarelas bancarias y firma eIDAS.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre(s) *</label>
                  <input
                    type="text"
                    required
                    value={formData.personalData.firstName}
                    onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.personalData.lastName}
                    onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Documento *</label>
                  <select
                    value={formData.personalData.documentType}
                    onChange={(e) => handlePersonalChange('documentType', e.target.value as SpanishDocumentType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="DNI">DNI (Documento Nacional de Identidad)</option>
                    <option value="NIE">NIE (Número de Identidad de Extranjero)</option>
                    <option value="Pasaporte">Pasaporte Internacional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    required
                    value={formData.personalData.documentNumber}
                    onChange={(e) => handlePersonalChange('documentNumber', e.target.value.toUpperCase())}
                    placeholder="Ej: 12345678Z ó Y1234567L"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil (España) *</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-600">
                      +34
                    </span>
                    <input
                      type="tel"
                      required
                      value={formData.personalData.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      placeholder="612 345 678"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.personalData.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={formData.personalData.birthDate}
                    onChange={(e) => handlePersonalChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">País de Residencia</label>
                  <select
                    value={formData.personalData.countryOfResidence || 'España'}
                    onChange={(e) => handlePersonalChange('countryOfResidence', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    {COUNTRIES_OF_RESIDENCE.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nacionalidad</label>
                  <input
                    type="text"
                    value={formData.personalData.nationality || 'Española'}
                    onChange={(e) => handlePersonalChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              {/* Domicilio */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-sm text-[#0B1B3D] mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0066FF]" />
                  <span>Domicilio en España</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Dirección Completa (Calle, Número, Piso) *</label>
                    <input
                      type="text"
                      required
                      value={formData.economicData.address || ''}
                      onChange={(e) => handleEconomicChange('address', e.target.value)}
                      placeholder="Calle Gran Vía 28, 4º B"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Provincia *</label>
                    <select
                      value={formData.economicData.province || 'Madrid'}
                      onChange={(e) => handleEconomicChange('province', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                    >
                      {SPANISH_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ciudad / Municipio *</label>
                    <input
                      type="text"
                      required
                      value={formData.economicData.city || ''}
                      onChange={(e) => handleEconomicChange('city', e.target.value)}
                      placeholder="Madrid"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Código Postal (5 dígitos) *</label>
                    <input
                      type="text"
                      maxLength={5}
                      required
                      value={formData.economicData.postalCode || ''}
                      onChange={(e) => handleEconomicChange('postalCode', e.target.value)}
                      placeholder="28013"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Régimen de Vivienda</label>
                    <select
                      value={formData.economicData.housingType || 'Alquiler'}
                      onChange={(e) => handleEconomicChange('housingType', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                    >
                      <option value="Propiedad Pagada">Propiedad Pagada (Sin Hipoteca)</option>
                      <option value="Propiedad con Hipoteca">Propiedad con Hipoteca</option>
                      <option value="Alquiler">Alquiler</option>
                      <option value="Familiar">Vivienda Familiar / Padres</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SITUACIÓN LABORAL & INGRESOS */}
          {activeTab === 'economico' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Evaluación de Solvencia (Ley 16/2011 & Banco de España):</strong> Registra con exactitud los ingresos netos demostrables mediante nómina, IRPF o pensión para garantizar el cálculo correcto de la tasa de endeudamiento.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Situación Laboral *</label>
                  <select
                    value={formData.economicData.occupation}
                    onChange={(e) => handleEconomicChange('occupation', e.target.value as EmploymentType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="Contrato Indefinido">Contrato Indefinido</option>
                    <option value="Funcionario Público">Funcionario Público</option>
                    <option value="Autónomo / Profesional">Autónomo / Profesional</option>
                    <option value="Contrato Temporal">Contrato Temporal</option>
                    <option value="Jubilado / Pensionista">Jubilado / Pensionista</option>
                    <option value="Desempleado con Prestación">Desempleado con Prestación</option>
                    <option value="Otro">Otro Régimen</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa Empleadora / Negocio</label>
                  <input
                    type="text"
                    value={formData.economicData.companyName || ''}
                    onChange={(e) => handleEconomicChange('companyName', e.target.value)}
                    placeholder="Ej: Inditex S.A. / Profesional Freelance"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Antigüedad Laboral (Meses)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.economicData.seniorityMonths || 12}
                    onChange={(e) => handleEconomicChange('seniorityMonths', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ingresos Netos Mensuales (€) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">€</span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={50}
                      value={formData.economicData.monthlyIncome}
                      onChange={(e) => handleEconomicChange('monthlyIncome', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gastos Fijos Mensuales (€)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">€</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={formData.economicData.monthlyExpenses}
                      onChange={(e) => handleEconomicChange('monthlyExpenses', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Finalidad Declarada del Préstamo *</label>
                  <select
                    value={formData.economicData.loanPurpose}
                    onChange={(e) => handleEconomicChange('loanPurpose', e.target.value as LoanPurpose)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="Reformas y Mejoras del Hogar">Reformas y Mejoras del Hogar</option>
                    <option value="Gastos Médicos / Salud">Gastos Médicos / Salud</option>
                    <option value="Reparación de Vehículo / Movilidad">Reparación de Vehículo / Movilidad</option>
                    <option value="Negocio / Capital Autónomos">Negocio / Capital Autónomos</option>
                    <option value="Educación / Cursos o Máster">Educación / Cursos o Máster</option>
                    <option value="Imprevisto o Calamidad Familiar">Imprevisto o Calamidad Familiar</option>
                    <option value="Unificación de Pagos o Facturas">Unificación de Pagos o Facturas</option>
                    <option value="Viaje / Gastos Personales">Viaje / Gastos Personales</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATOS BANCARIOS */}
          {activeTab === 'bancario' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>IBAN de Recepción de Fondos:</strong> Cuando los clientes escriben su IBAN erróneamente, la transferencia SEPA Instant o Bizum es rechazada. Corrige aquí los dígitos con la cartilla o extracto bancario aportado por el cliente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Entidad Bancaria *</label>
                  <select
                    value={formData.bankDetails.bankName}
                    onChange={(e) => handleBankChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    {SPANISH_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Cuenta</label>
                  <select
                    value={formData.bankDetails.accountType}
                    onChange={(e) => handleBankChange('accountType', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="Cuenta Corriente">Cuenta Corriente</option>
                    <option value="Cuenta Nómina">Cuenta Nómina</option>
                    <option value="Cuenta Digital">Cuenta Digital</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    IBAN Bancario de Recepción (España: 24 caracteres que inician con ES) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.iban}
                    onChange={(e) => handleBankChange('iban', e.target.value.toUpperCase())}
                    placeholder="ES91 2100 0418 4502 0005 1234"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0066FF] tracking-wider"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Formato: ES + 2 dígitos de control + 20 dígitos de código de cuenta bancaria.
                  </span>
                </div>

                <div className="sm:col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-700 text-xs block">
                      Cuenta Digital Neo-Bank Asignada por Instacredit
                    </span>
                    <span className="font-mono text-[11px] text-[#0066FF] font-bold">
                      {formData.digitalAccount.accountNumber} (BIC: {formData.digitalAccount.bicSwift})
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                    Activa
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRÉSTAMO, ESTADO & ASESOR */}
          {activeTab === 'prestamo' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capital Solicitado (€) *</label>
                  <input
                    type="number"
                    min={2000}
                    max={100000}
                    step={500}
                    required
                    value={formData.loanDetails.capital}
                    onChange={(e) => handleLoanChange('capital', parseFloat(e.target.value) || 2000)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-base text-[#0B1B3D] focus:ring-2 focus:ring-[#0066FF]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Rango: 2.000 € a 100.000 €</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capital Aprobado (€) *</label>
                  <input
                    type="number"
                    min={500}
                    max={100000}
                    step={100}
                    required
                    value={formData.approvedAmount || formData.loanDetails.capital}
                    onChange={(e) => setFormData(prev => prev ? ({ ...prev, approvedAmount: parseFloat(e.target.value) || 0 }) : null)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-base text-[#0066FF] focus:ring-2 focus:ring-[#0066FF]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Monto que se autoriza a desembolsar</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plazo de Financiación (Días) *</label>
                  <select
                    value={formData.loanDetails.termDays}
                    onChange={(e) => handleLoanChange('termDays', parseInt(e.target.value) || 365)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value={90}>90 Días (3 Meses)</option>
                    <option value={180}>180 Días (6 Meses)</option>
                    <option value={365}>365 Días (12 Meses / 1 Año)</option>
                    <option value={730}>730 Días (24 Meses / 2 Años)</option>
                    <option value={1095}>1095 Días (36 Meses / 3 Años)</option>
                    <option value={1460}>1460 Días (48 Meses / 4 Años)</option>
                    <option value={1825}>1825 Días (60 Meses / 5 Años)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado del Expediente *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => prev ? ({ ...prev, status: e.target.value as LoanStatus }) : null)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-slate-900 focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Revisión">En Revisión</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Desembolsado">Desembolsado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asesor Asignado</label>
                  <select
                    value={formData.assignedAdvisorId || ''}
                    onChange={(e) => {
                      const adv = advisorsList.find(a => a.id === e.target.value);
                      setFormData(prev => prev ? ({
                        ...prev,
                        assignedAdvisorId: e.target.value,
                        assignedAdvisorName: adv ? adv.name : ''
                      }) : null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="">-- Sin Asignar --</option>
                    {advisorsList.map((adv) => (
                      <option key={adv.id} value={adv.id}>
                        {adv.name} ({adv.roleTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paso Actual del Embudo</label>
                  <select
                    value={formData.currentStep}
                    onChange={(e) => setFormData(prev => prev ? ({ ...prev, currentStep: parseInt(e.target.value) || 1 }) : null)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value={1}>Paso 1: Solicitud Inicial</option>
                    <option value={2}>Paso 2: Verificación Documental</option>
                    <option value={3}>Paso 3: Aprobación y Firma eIDAS</option>
                    <option value={4}>Paso 4: Desembolso en Cuenta Digital</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">
                    Notas Administrativas e Internas del Expediente
                  </label>
                  <textarea
                    rows={3}
                    value={formData.adminNotes || ''}
                    onChange={(e) => setFormData(prev => prev ? ({ ...prev, adminNotes: e.target.value }) : null)}
                    placeholder="Añade observaciones sobre la corrección de datos, verificación en ASNEF/CIRBE o justificación de cambio..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-slate-500">
              Expediente: <strong>{formData.id}</strong> • Última actualización: <strong>{formData.updatedAt}</strong>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios del Usuario</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
