import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SpanishDocumentType,
  EmploymentType,
  LoanPurpose,
  CreditApplication,
  LoanTerm
} from '../../types';
import { SPANISH_PROVINCES, COUNTRIES_OF_RESIDENCE } from '../../data/initialData';
import { calculateLoanBreakdown, formatEUR, MIN_LOAN_AMOUNT, MAX_LOAN_AMOUNT } from '../../utils/financialCalculations';
import {
  X,
  UserPlus,
  User,
  Briefcase,
  CreditCard,
  SlidersHorizontal,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Calendar,
  Building,
  Phone,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AdminManualRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisteredSuccess?: (app: CreditApplication) => void;
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
  'Deutsche Bank España'
];

export const AdminManualRegisterModal: React.FC<AdminManualRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisteredSuccess
}) => {
  const { createNewApplication, advisorsList, addNotification } = useApp();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [createdApp, setCreatedApp] = useState<CreditApplication | null>(null);

  // Form Fields
  // 1. Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentType, setDocumentType] = useState<SpanishDocumentType>('DNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [birthDate, setBirthDate] = useState('1988-06-15');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('España');
  const [nationality, setNationality] = useState('Española');

  // Address
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState(SPANISH_PROVINCES[0] || 'Madrid');
  const [city, setCity] = useState('Madrid');
  const [postalCode, setPostalCode] = useState('28046');
  const [housingType, setHousingType] = useState<'Propiedad con Hipoteca' | 'Propiedad Pagada' | 'Alquiler' | 'Familiar'>('Alquiler');

  // 2. Economic
  const [occupation, setOccupation] = useState<EmploymentType>('Contrato Indefinido');
  const [companyName, setCompanyName] = useState('');
  const [seniorityMonths, setSeniorityMonths] = useState(18);
  const [monthlyIncome, setMonthlyIncome] = useState(2100);
  const [monthlyExpenses, setMonthlyExpenses] = useState(750);
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>('Reformas y Mejoras del Hogar');

  // 3. Bank
  const [bankName, setBankName] = useState(SPANISH_BANKS[0]);
  const [iban, setIban] = useState('ES91 2100 0418 4502 0005 1234');
  const [accountType, setAccountType] = useState<'Cuenta Corriente' | 'Cuenta Nómina' | 'Cuenta Digital'>('Cuenta Nómina');

  // 4. Loan Simulator
  const [capital, setCapital] = useState<number>(5000);
  const [termDays, setTermDays] = useState<LoanTerm>(365);
  const [assignedAdvisorId, setAssignedAdvisorId] = useState<string>(advisorsList[0]?.id || 'ADV-01');

  if (!isOpen) return null;

  const loanCalculation = calculateLoanBreakdown(capital, termDays);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !documentNumber.trim() || !phone.trim() || !email.trim()) {
      alert('Por favor completa todos los campos personales obligatorios.');
      return;
    }

    const payload = {
      personalData: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        documentType,
        documentNumber: documentNumber.trim().toUpperCase(),
        documentExpiryDate: '2030-12-31',
        birthDate,
        nationality,
        countryOfResidence,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        hasSpanishResidenceCard: true
      },
      economicData: {
        province,
        city,
        postalCode,
        address,
        housingType,
        occupation,
        monthlyIncome,
        monthlyExpenses,
        companyName: companyName.trim() || 'No especificada',
        seniorityMonths,
        loanPurpose
      },
      bankDetails: {
        bankName,
        iban: iban.trim().toUpperCase(),
        accountType,
        isOwnerCertified: true
      },
      loanDetails: {
        ...loanCalculation,
        loanPurpose
      },
      signatureDetails: {
        signedAt: new Date().toLocaleDateString('es-ES'),
        otpCode: 'ADMIN-DIRECT',
        ipAddress: '127.0.0.1 (Registro Admin Central)',
        signatureHash: `eIDAS-ADM-${Date.now()}`,
        asnefConsent: true,
        promissoryNoteConsent: true,
        platformTermsConsent: true
      }
    };

    const newApp = createNewApplication(payload as any);
    setCreatedApp(newApp);

    addNotification({
      recipientRole: 'admin',
      title: '📋 Solicitud Registrada Manualmente',
      message: `Se ha dado de alta manualmente al cliente ${firstName} ${lastName} (${newApp.id}) por ${formatEUR(capital)}.`,
      type: 'success'
    });

    if (onRegisteredSuccess) {
      onRegisteredSuccess(newApp);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0B1B3D] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0066FF] flex items-center justify-center font-bold text-white shadow-sm">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">
                  Registro Manual de Solicitud de Crédito
                </h3>
                <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Panel de Control Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Alta directa de expedientes de clientes recibidos vía llamada telefónica, oficina física o WhatsApp asistido.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Application Was Just Created: Success Screen */}
        {createdApp ? (
          <div className="p-8 text-center space-y-6 flex-1 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black uppercase px-3 py-1 rounded-full">
                ¡Alta Completada con Éxito!
              </span>
              <h3 className="text-2xl font-black text-[#0B1B3D] mt-3">
                Solicitud Radicada en el Sistema
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                El cliente ha sido registrado y se ha generado su Cuenta Bancaria Digital y radicado oficial bajo supervisión del Banco de España.
              </p>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg mx-auto text-left text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Número de Radicado:</span>
                <span className="font-mono font-black text-[#0B1B3D] text-sm">{createdApp.id}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Cliente Titular:</span>
                <span className="font-bold text-slate-800">
                  {createdApp.personalData.firstName} {createdApp.personalData.lastName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Documento:</span>
                <span className="font-mono font-bold text-slate-700">
                  {createdApp.personalData.documentType} {createdApp.personalData.documentNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Importe Solicitado:</span>
                <span className="font-black text-[#0066FF] text-sm tabular-nums">
                  {formatEUR(createdApp.loanDetails.capital)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Plazo Acordado:</span>
                <span className="font-bold text-slate-700">
                  {createdApp.loanDetails.termDays} días ({Math.round(createdApp.loanDetails.termDays / 30)} meses)
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold">Cuenta Digital IBAN:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {createdApp.digitalAccount.accountNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Asesor Asignado:</span>
                <span className="font-bold text-purple-700">
                  {createdApp.assignedAdvisorName || 'Asignado automáticamente'}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Volver a la Lista de Solicitudes
              </button>
            </div>
          </div>
        ) : (
          /* Step Navigation & Multi-section Form */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
            {/* Step Pills */}
            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                    activeStep === 1
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>1. Datos Personales</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                    activeStep === 2
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>2. Laboral & Ingresos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                    activeStep === 3
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>3. Datos Bancarios</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                    activeStep === 4
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>4. Monto & Préstamo</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-block">
                Paso {activeStep} de 4
              </span>
            </div>

            {/* Form Step Body */}
            <div className="p-5 sm:p-6 space-y-5 text-xs flex-1">
              {/* STEP 1: DATOS PERSONALES */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Introduce los datos oficiales de identidad del cliente. Los ciudadanos con DNI o NIE español tienen acceso directo a transferencias inmediatas por Bizum o SEPA Instant.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nombre(s) *</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ej: Alejandro"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Apellidos *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ej: García Morales"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tipo de Documento *</label>
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value as SpanishDocumentType)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      >
                        <option value="DNI">DNI (España)</option>
                        <option value="NIE">NIE (Extranjeros con residencia)</option>
                        <option value="Pasaporte">Pasaporte Internacional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Número de Documento *</label>
                      <input
                        type="text"
                        required
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                        placeholder="12345678Z ó X1234567L"
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
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="cliente@ejemplo.es"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">País de Residencia</label>
                      <select
                        value={countryOfResidence}
                        onChange={(e) => setCountryOfResidence(e.target.value)}
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
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Española"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="pt-3 border-t border-slate-200">
                    <h4 className="font-bold text-sm text-[#0B1B3D] mb-3 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#0066FF]" />
                      <span>Domicilio y Residencia</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">Dirección Completa *</label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Calle Alcalá 45, 3º D"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Provincia *</label>
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
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
                        <label className="block font-bold text-slate-700 mb-1">Ciudad / Población *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
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
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="28014"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#0066FF]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tipo de Vivienda</label>
                        <select
                          value={housingType}
                          onChange={(e) => setHousingType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                        >
                          <option value="Propiedad Pagada">Propiedad Pagada</option>
                          <option value="Propiedad con Hipoteca">Propiedad con Hipoteca</option>
                          <option value="Alquiler">Alquiler</option>
                          <option value="Familiar">Familiar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: LABORAL & INGRESOS */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-900">
                    <Briefcase className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Información de Solvencia:</strong> Registra la actividad económica y nivel de ingresos mensuales demostrables mediante nómina, IRPF o pensión contributiva.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Situación Laboral *</label>
                      <select
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value as EmploymentType)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      >
                        <option value="Contrato Indefinido">Contrato Indefinido</option>
                        <option value="Funcionario Público">Funcionario Público</option>
                        <option value="Autónomo / Profesional">Autónomo / Profesional</option>
                        <option value="Contrato Temporal">Contrato Temporal</option>
                        <option value="Jubilado / Pensionista">Jubilado / Pensionista</option>
                        <option value="Desempleado con Prestación">Desempleado con Prestación</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Empresa / Razón Social</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ej: Mercadona S.A. / Autónomo"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Antigüedad Laboral (Meses)</label>
                      <input
                        type="number"
                        min={0}
                        value={seniorityMonths}
                        onChange={(e) => setSeniorityMonths(parseInt(e.target.value) || 0)}
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
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
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
                          value={monthlyExpenses}
                          onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Finalidad del Préstamo *</label>
                      <select
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value as LoanPurpose)}
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

              {/* STEP 3: DATOS BANCARIOS */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-2.5 text-purple-900">
                    <CreditCard className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Recepción de Fondos:</strong> Introduce el IBAN de la cuenta donde el cliente desea recibir el dinero una vez aprobado.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Entidad Bancaria *</label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
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
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-[#0066FF]"
                      >
                        <option value="Cuenta Corriente">Cuenta Corriente</option>
                        <option value="Cuenta Nómina">Cuenta Nómina</option>
                        <option value="Cuenta Digital">Cuenta Digital</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        IBAN de Recepción (España: 24 caracteres iniciando con ES) *
                      </label>
                      <input
                        type="text"
                        required
                        value={iban}
                        onChange={(e) => setIban(e.target.value.toUpperCase())}
                        placeholder="ES91 2100 0418 4502 0005 1234"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0066FF] tracking-wider"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: MONTO & CONDICIONES DEL PRÉSTAMO */}
              {activeStep === 4 && (
                <div className="space-y-5">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Simulación y Parámetros del Crédito:</strong> Selecciona el capital a conceder (entre 2.000 € y 100.000 €) y el plazo acordado. El sistema calculará las cuotas mensuales conforme a la normativa del Banco de España (BdE).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Capital Solicitado (€) *
                      </label>
                      <input
                        type="number"
                        min={MIN_LOAN_AMOUNT}
                        max={MAX_LOAN_AMOUNT}
                        step={500}
                        required
                        value={capital}
                        onChange={(e) => setCapital(parseFloat(e.target.value) || 2000)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-lg text-[#0B1B3D] focus:ring-2 focus:ring-[#0066FF]"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Rango: 2.000 € a 100.000 € (Paso de 500 €)
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Plazo de Amortización *
                      </label>
                      <select
                        value={termDays}
                        onChange={(e) => setTermDays(parseInt(e.target.value) as LoanTerm)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#0066FF]"
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
                      <label className="block font-bold text-slate-700 mb-1">
                        Asesor Personal Asignado *
                      </label>
                      <select
                        value={assignedAdvisorId}
                        onChange={(e) => setAssignedAdvisorId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#0066FF]"
                      >
                        {advisorsList.map((adv) => (
                          <option key={adv.id} value={adv.id}>
                            {adv.name} ({adv.roleTitle})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Financial Simulation Card */}
                  <div className="bg-[#0B1B3D] text-white p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-900 pb-2">
                      <span className="text-xs font-bold text-[#00E599] uppercase">
                        Desglose Financiero Oficial (Normativa Banco de España)
                      </span>
                      <span className="text-[11px] text-blue-300 font-mono">TIN: 6.95% | TAE: ~7.18%</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-900">
                        <span className="text-[10px] text-slate-400 uppercase block">Capital Principal</span>
                        <span className="text-base font-black text-white tabular-nums">
                          {formatEUR(loanCalculation.capital)}
                        </span>
                      </div>

                      <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-900">
                        <span className="text-[10px] text-slate-400 uppercase block">Total Intereses</span>
                        <span className="text-base font-black text-blue-300 tabular-nums">
                          {formatEUR(loanCalculation.interestAmount)}
                        </span>
                      </div>

                      <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-900">
                        <span className="text-[10px] text-slate-400 uppercase block">Cuota Mensual Estimada</span>
                        <span className="text-base font-black text-[#00E599] tabular-nums">
                          {formatEUR((loanCalculation.quotas?.[0]?.totalQuota) || (loanCalculation.totalToPay / Math.max(1, Math.round(termDays / 30))))} / mes
                        </span>
                      </div>

                      <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-900">
                        <span className="text-[10px] text-slate-400 uppercase block">Total a Reembolsar</span>
                        <span className="text-base font-black text-amber-400 tabular-nums">
                          {formatEUR(loanCalculation.totalToPay)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div>
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
                  >
                    ← Anterior
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancelar
                </button>

                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                    className="px-5 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmar y Dar de Alta Solicitud</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
