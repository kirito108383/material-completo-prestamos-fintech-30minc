import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import {
  SPANISH_BANKS,
  SPANISH_PROVINCES,
  COUNTRIES_OF_RESIDENCE
} from '../../data/initialData';
import {
  LoanTerm,
  LoanPurpose,
  SpanishDocumentType,
  EmploymentType,
  UploadedFileRecord
} from '../../types';
import {
  calculateLoanBreakdown,
  formatEUR,
  MIN_LOAN_AMOUNT,
  MAX_LOAN_AMOUNT,
  STEP_LOAN_AMOUNT,
  generateSha256Hash
} from '../../utils/financialCalculations';
import {
  X,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Lock,
  Building,
  CreditCard,
  User,
  FileText,
  Sparkles,
  Info,
  Wallet,
  Upload,
  FileCheck,
  Globe,
  Briefcase
} from 'lucide-react';

export const LoanApplicationModal: React.FC = () => {
  const {
    isApplicationModalOpen,
    closeApplicationModal,
    initialLoanConfig,
    createNewApplication,
    openTicketModal
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Step 1: Simulator & Financial Breakdown
  const [capital, setCapital] = useState<number>(initialLoanConfig.capital || 750);
  const [term, setTerm] = useState<LoanTerm>(initialLoanConfig.term || 30);

  // Step 2: Personal Identity & Nationality / Residence
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentType, setDocumentType] = useState<SpanishDocumentType>('DNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentExpiryDate, setDocumentExpiryDate] = useState('2029-06-30');
  const [birthDate, setBirthDate] = useState('1992-04-18');
  const [nationality, setNationality] = useState('España');
  const [countryOfResidence, setCountryOfResidence] = useState('España');
  const [hasSpanishResidenceCard, setHasSpanishResidenceCard] = useState(true);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Step 3: Domicile, Employment & Loan Purpose
  const [province, setProvince] = useState(SPANISH_PROVINCES[0] || 'Madrid');
  const [city, setCity] = useState('Madrid');
  const [postalCode, setPostalCode] = useState('28046');
  const [address, setAddress] = useState('');
  const [housingType, setHousingType] = useState<'Propiedad con Hipoteca' | 'Propiedad Pagada' | 'Alquiler' | 'Familiar'>('Alquiler');
  const [occupation, setOccupation] = useState<EmploymentType>('Contrato Indefinido');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(1850);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(750);
  const [companyName, setCompanyName] = useState('');
  const [seniorityMonths, setSeniorityMonths] = useState<number>(24);
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>('Negocio / Capital Autónomos');

  // Step 4: Strict Documentation & IBAN (SEPBLAC & BdE)
  const [uploadedFiles, setUploadedFiles] = useState<{
    dniAnverso: boolean;
    dniReverso: boolean;
    nominaIrpf: boolean;
    justificanteIban: boolean;
  }>({
    dniAnverso: false,
    dniReverso: false,
    nominaIrpf: false,
    justificanteIban: false
  });

  const [bankName, setBankName] = useState(SPANISH_BANKS[0]);
  const [accountType, setAccountType] = useState<'Cuenta Corriente' | 'Cuenta Nómina' | 'Cuenta Digital'>('Cuenta Nómina');
  const [iban, setIban] = useState('ES21 ');
  const [isOwnerCertified, setIsOwnerCertified] = useState(false);

  // Step 5: Digital Signature, ASNEF & OTP
  const [asnefConsent, setAsnefConsent] = useState(true);
  const [promissoryNoteConsent, setPromissoryNoteConsent] = useState(true);
  const [platformTermsConsent, setPlatformTermsConsent] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpSentNotification, setOtpSentNotification] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync initial configuration when opened
  useEffect(() => {
    if (isApplicationModalOpen) {
      if (initialLoanConfig.capital) setCapital(initialLoanConfig.capital);
      if (initialLoanConfig.term) setTerm(initialLoanConfig.term);
      setStep(1);
      setFormError(null);
      setGeneratedOtp('');
      setEnteredOtp('');
    }
  }, [isApplicationModalOpen, initialLoanConfig]);

  if (!isApplicationModalOpen) return null;

  const breakdown = calculateLoanBreakdown(capital, term);

  // Generate simulated OTP SMS when reaching step 5
  const handleSendOtp = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setOtpSentNotification(`Código SMS OTP enviado al (+34) ${phone || '612***456'}: ${randomCode}`);
    setEnteredOtp(randomCode);
  };

  const handleSimulateFileUpload = (docKey: 'dniAnverso' | 'dniReverso' | 'nominaIrpf' | 'justificanteIban') => {
    setUploadedFiles(prev => ({ ...prev, [docKey]: true }));
  };

  const handleNextStep = () => {
    setFormError(null);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!firstName.trim() || !lastName.trim() || !documentNumber.trim() || !phone.trim() || !email.trim()) {
        setFormError('Por favor completa todos los campos de identidad y contacto obligatorios.');
        return;
      }
      if (countryOfResidence !== 'España' && !hasSpanishResidenceCard) {
        setFormError('Para residentes extranjeros se requiere acreditar Tarjeta de Residencia o NIE en vigor en territorio español.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!address.trim() || !postalCode.trim() || monthlyIncome <= 0) {
        setFormError('Por favor indica tu dirección, código postal e ingresos mensuales netos demostrables.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!iban.trim() || iban.length < 15) {
        setFormError('Por favor introduce un IBAN bancario español válido (iniciado por ES).');
        return;
      }
      if (!isOwnerCertified) {
        setFormError('Debes certificar obligatoriamente la titularidad de tu cuenta conforme a la normativa antiblanqueo SEPBLAC.');
        return;
      }
      setStep(5);
      handleSendOtp();
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!asnefConsent || !promissoryNoteConsent || !platformTermsConsent) {
      setFormError('Debes aceptar las consultas a ficheros de solvencia (ASNEF/CIRBE), pagaré cambiario y contrato de crédito.');
      return;
    }

    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setFormError('Por favor introduce el código OTP de 6 dígitos enviado por SMS.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const signedTimestamp = `${now.toLocaleDateString('es-ES')} a las ${now.toLocaleTimeString('es-ES')} CET`;
      const hashToken = generateSha256Hash();

      // Build uploaded documents list
      const docsRecord: UploadedFileRecord[] = [
        {
          id: `DOC-DNI-A-${Date.now()}`,
          documentCategory: 'DNI_ANVERSO',
          fileName: uploadedFiles.dniAnverso ? `DNI_Anverso_${documentNumber}.pdf` : `DNI_Anverso_Digital_${documentNumber}.jpg`,
          status: 'Verificado',
          uploadedAt: 'Hoy'
        },
        {
          id: `DOC-DNI-R-${Date.now()}`,
          documentCategory: 'DNI_REVERSO',
          fileName: uploadedFiles.dniReverso ? `DNI_Reverso_${documentNumber}.pdf` : `DNI_Reverso_Digital_${documentNumber}.jpg`,
          status: 'Verificado',
          uploadedAt: 'Hoy'
        },
        {
          id: `DOC-NOM-${Date.now()}`,
          documentCategory: 'NOMINA_IRPF',
          fileName: uploadedFiles.nominaIrpf ? `Justificante_Ingresos_${documentNumber}.pdf` : `Nomina_Oficial_${documentNumber}.pdf`,
          status: 'Verificado',
          uploadedAt: 'Hoy'
        },
        {
          id: `DOC-IBAN-${Date.now()}`,
          documentCategory: 'JUSTIFICANTE_IBAN',
          fileName: uploadedFiles.justificanteIban ? `Certificado_IBAN_${bankName.replace(/\s+/g, '_')}.pdf` : `Certificado_Titularidad_IBAN.pdf`,
          status: 'Verificado',
          uploadedAt: 'Hoy'
        }
      ];

      const createdApp = createNewApplication({
        personalData: {
          firstName,
          lastName,
          documentType,
          documentNumber,
          documentExpiryDate,
          birthDate,
          nationality,
          countryOfResidence,
          phone: phone.startsWith('+34') ? phone : `+34 ${phone}`,
          email,
          hasSpanishResidenceCard
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
          companyName: companyName || 'Entidad Empleadora Confidencial',
          seniorityMonths,
          loanPurpose
        },
        bankDetails: {
          bankName,
          accountType,
          iban: iban.toUpperCase(),
          isOwnerCertified: true
        },
        loanDetails: {
          ...breakdown,
          loanPurpose
        },
        signatureDetails: {
          signedAt: signedTimestamp,
          otpCode: enteredOtp,
          ipAddress: '88.12.94.210',
          signatureHash: hashToken,
          asnefConsent: true,
          promissoryNoteConsent: true,
          platformTermsConsent: true
        }
      });

      // Update uploaded docs
      createdApp.uploadedDocuments = docsRecord;

      // Confetti celebratory explosion!
      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      setIsSubmitting(false);
      closeApplicationModal();
      openTicketModal(createdApp);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-auto overflow-hidden border border-slate-200 relative flex flex-col max-h-[95vh]">
        
        {/* Modal Top Bar */}
        <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00E599] flex items-center justify-center font-bold">
              {step}/5
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                Solicitud de Microcrédito y Cuenta Digital (España)
              </h3>
              <p className="text-xs text-slate-300">
                {step === 1 && 'Paso 1: Importe y Plazo de Amortización'}
                {step === 2 && 'Paso 2: Datos de Identidad, Nacionalidad y Residencia'}
                {step === 3 && 'Paso 3: Domicilio, Situación Laboral y Motivo del Préstamo'}
                {step === 4 && 'Paso 4: Verificación de Documentación y Cuenta IBAN (SEPBLAC)'}
                {step === 5 && 'Paso 5: Firma Electrónica eIDAS, Pagaré y Contrato'}
              </p>
            </div>
          </div>
          <button
            onClick={closeApplicationModal}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="w-full bg-slate-100 h-1.5 shrink-0">
          <div
            className="bg-[#0066FF] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {formError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: CALCULADORA DE CAPITAL Y CUOTAS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Capital Solicitado</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0066FF] tabular-nums">
                    {formatEUR(capital)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase">Plazo Acordado</span>
                  <div className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
                    {term} Días
                  </div>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Ajusta el importe en euros:
                </label>
                <input
                  type="range"
                  min={MIN_LOAN_AMOUNT}
                  max={MAX_LOAN_AMOUNT}
                  step={STEP_LOAN_AMOUNT}
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Mínimo: {formatEUR(MIN_LOAN_AMOUNT)}</span>
                  <span>Máximo: {formatEUR(MAX_LOAN_AMOUNT)}</span>
                </div>
              </div>

              {/* Term options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Selecciona el plazo de devolución:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([15, 30, 60, 90] as LoanTerm[]).map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setTerm(days)}
                      className={`py-2.5 rounded-2xl font-bold text-xs sm:text-sm border transition cursor-pointer ${
                        term === days
                          ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {days} Días
                    </button>
                  ))}
                </div>
              </div>

              {/* Precontractual Breakdown Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 border-b pb-2 flex justify-between">
                  <span>Desglose Normalizado INE (Ley 16/2011 • Banco de España)</span>
                  <span className="text-emerald-700 font-semibold">TIN 1.95% Mensual (26.8% TAE)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Interés nominal remuneratorio ({term} días):</span>
                  <span className="font-semibold text-slate-800">{formatEUR(breakdown.interestAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Fondo Europeo de Garantía de Riesgo (10%):</span>
                  <span className="font-semibold text-slate-800">{formatEUR(breakdown.fgaGuaranteeAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Plataforma y Firma Digital eIDAS:</span>
                  <span className="font-semibold text-slate-800">{formatEUR(breakdown.technologyAndSignature)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IVA aplicable en España (21%):</span>
                  <span className="font-semibold text-slate-800">{formatEUR(breakdown.ivaAmount)}</span>
                </div>
                <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm font-bold">
                  <span className="text-[#0B1B3D]">Total Exigible al Vencimiento:</span>
                  <span className="text-xl font-black text-[#0066FF] tabular-nums">{formatEUR(breakdown.totalToPay)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL IDENTITY & RESIDENCE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ej. Carmen"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apellidos Completos *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ej. Navarro Serrano"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Documento *</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as SpanishDocumentType)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="DNI">DNI (Nacional)</option>
                    <option value="NIE">NIE (Extranjero Residente)</option>
                    <option value="Pasaporte">Pasaporte Comunitario</option>
                    <option value="Certificado_Ciudadano_UE">Certificado de Registro UE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                    placeholder="Ej. 52918234M o X1234567A"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Caducidad Documento</label>
                  <input
                    type="date"
                    value={documentExpiryDate}
                    onChange={(e) => setDocumentExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Country of Residence Question (Extranjeros) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#0066FF]" />
                    País de Residencia Habitual *
                  </label>
                  <select
                    value={countryOfResidence}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCountryOfResidence(val);
                      if (val !== 'España') {
                        setNationality(val);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    {COUNTRIES_OF_RESIDENCE.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nacionalidad de Origen</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Ej. Española, Colombiana, Francesa..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                {countryOfResidence !== 'España' && (
                  <div className="sm:col-span-2 pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasSpanishResidenceCard}
                        onChange={(e) => setHasSpanishResidenceCard(e.target.checked)}
                        className="rounded text-[#0066FF]"
                      />
                      <span>Tengo tarjeta TIE o NIE de residencia legal y cuenta bancaria activa en territorio español</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Móvil (SMS / OTP) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+34</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="612345678"
                      className="w-full pl-12 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carmen.navarro@gmail.com"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ECONOMIC & LOAN PURPOSE */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provincia *</label>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setCity(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    {SPANISH_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Municipio / Ciudad *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej. Madrid"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código Postal (5 dígitos) *</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="28046"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dirección de Domicilio Habitual *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej. Calle Serrano 45, 3º Izquierda"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Situación Laboral / Régimen *</label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value as EmploymentType)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Empleado Indefinido">Empleado por Cuenta Ajena (Indefinido)</option>
                    <option value="Empleado Temporal">Empleado Temporal / Obra o Servicio</option>
                    <option value="Autónomo">Autónomo / Profesional Colegiado</option>
                    <option value="Funcionario">Funcionario de Carrera / Interino</option>
                    <option value="Pensionista">Pensionista / Jubilado</option>
                    <option value="Desempleado">Desempleado con Prestación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Empresa / Sector Profesional</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. Logística Ibérica S.L."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ingresos Mensuales Netos (€ EUR) *</label>
                  <input
                    type="number"
                    step={50}
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gastos Fijos Mensuales (€ EUR)</label>
                  <input
                    type="number"
                    step={50}
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              {/* Motivo de Préstamo - Requerido explícitamente */}
              <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200">
                <label className="block text-xs font-bold text-[#0B1B3D] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0066FF]" />
                  Motivo o Destino del Préstamo *
                </label>
                <select
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value as LoanPurpose)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-blue-300 bg-white font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="Negocio / Capital de Trabajo">Negocio / Capital de Trabajo</option>
                  <option value="Gastos Médicos / Salud">Gastos Médicos / Salud</option>
                  <option value="Calamidad Doméstica o Imprevisto">Calamidad Doméstica o Imprevisto</option>
                  <option value="Pago de Deudas o Servicios Públicos">Pago de Facturas o Deudas Bancarias</option>
                  <option value="Educación / Matrícula o Cursos">Educación, Máster o Formación</option>
                  <option value="Reparaciones y Mejoras del Hogar">Reparaciones del Hogar o Vehículo</option>
                  <option value="Compra de Electrodomésticos o Tecnología">Compra de Tecnología o Mobiliario</option>
                  <option value="Viaje / Gastos Personales">Gastos Personales / Viaje</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Requerido para la evaluación de solvencia y perfil de riesgo conforme a la Ley 16/2011 y directrices del Banco de España.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: STRICT DOCUMENT VERIFICATION & IBAN */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                  Verificación Documental Estricta y Normativa SEPBLAC (Ley 10/2010)
                </div>
                <p>
                  En INSTACREDIT cada cliente recibe una <strong>Cuenta Digital bancaria independiente</strong>. Por prevención de blanqueo de capitales del Banco de España, solicitamos verificación de identidad y vinculación de un IBAN externo español.
                </p>
              </div>

              {/* Strict Document Verification Upload Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Documentación Requerida (Sube o valida los archivos):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Doc 1: DNI Anverso */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0066FF]" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">DNI / NIE (Anverso)</div>
                        <div className="text-[10px] text-slate-500">Fotografía nítida frontal</div>
                      </div>
                    </div>
                    {uploadedFiles.dniAnverso ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Subido
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileUpload('dniAnverso')}
                        className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-xl border border-slate-300"
                      >
                        <Upload className="w-3 h-3" /> Subir
                      </button>
                    )}
                  </div>

                  {/* Doc 2: DNI Reverso */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0066FF]" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">DNI / NIE (Reverso)</div>
                        <div className="text-[10px] text-slate-500">Código de lectura óptica</div>
                      </div>
                    </div>
                    {uploadedFiles.dniReverso ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Subido
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileUpload('dniReverso')}
                        className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-xl border border-slate-300"
                      >
                        <Upload className="w-3 h-3" /> Subir
                      </button>
                    )}
                  </div>

                  {/* Doc 3: Justificante Nómina */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#0066FF]" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">Última Nómina / Modelo IRPF</div>
                        <div className="text-[10px] text-slate-500">O certificado de pensión</div>
                      </div>
                    </div>
                    {uploadedFiles.nominaIrpf ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Subido
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileUpload('nominaIrpf')}
                        className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-xl border border-slate-300"
                      >
                        <Upload className="w-3 h-3" /> Subir
                      </button>
                    )}
                  </div>

                  {/* Doc 4: Certificado IBAN */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#0066FF]" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">Certificado Titularidad IBAN</div>
                        <div className="text-[10px] text-slate-500">Expedido por tu entidad</div>
                      </div>
                    </div>
                    {uploadedFiles.justificanteIban ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Subido
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileUpload('justificanteIban')}
                        className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-xl border border-slate-300"
                      >
                        <Upload className="w-3 h-3" /> Subir
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* Spanish Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entidad Bancaria de Abono *</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    {SPANISH_BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Modalidad de Cuenta *</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Cuenta Nómina">Cuenta Nómina</option>
                    <option value="Cuenta Corriente">Cuenta Corriente</option>
                    <option value="Cuenta Digital">Cuenta Digital Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Código IBAN de Destino (España) *</label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  placeholder="ES21 0049 1500 0512 3456 7890"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                  required
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer text-xs text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={isOwnerCertified}
                    onChange={(e) => setIsOwnerCertified(e.target.checked)}
                    className="mt-0.5 rounded text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span>
                    <strong>Certificación legal de titularidad única (SEPBLAC):</strong> Certifico bajo mi entera responsabilidad que soy el titular único y legítimo del IBAN indicado y que los fondos no proceden de actividades ilícitas según la legislación española.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: DIGITAL SIGNATURE, ASNEF & OTP */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2 text-xs">
                <div className="font-bold text-[#0B1B3D] flex items-center gap-1.5 text-sm">
                  <Lock className="w-4 h-4 text-[#0066FF]" />
                  Firma Electrónica eIDAS, Pagaré Cambiario y Contrato de Cuenta Digital
                </div>
                <p className="text-slate-600">
                  Estás a punto de formalizar tu microcrédito de <strong>{formatEUR(capital)}</strong>. Tu Cuenta Digital bancaria iniciará con saldo en 0,00 € hasta que se proceda a la liquidación y desembolso por Bizum o transferencia SEPA.
                </p>
              </div>

              {/* Simulated SMS Alert Box */}
              {otpSentNotification && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>SMS de Seguridad:</strong> {otpSentNotification}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] underline font-bold hover:text-emerald-700 cursor-pointer"
                  >
                    Reenviar
                  </button>
                </div>
              )}

              {/* OTP Input */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Código de Verificación OTP SMS (6 Dígitos) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 123456"
                    className="px-4 py-2 text-lg font-mono tracking-widest text-center rounded-xl border border-slate-300 bg-white font-bold w-40 focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                  <span className="text-[11px] text-slate-500">
                    Estampa tu firma biométrica avanzada eIDAS (Reglamento UE 910/2014).
                  </span>
                </div>
              </div>

              {/* Legal Consents Checkboxes */}
              <div className="space-y-2.5 text-xs text-slate-600 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={asnefConsent}
                    onChange={(e) => setAsnefConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#0066FF]"
                  />
                  <span>
                    Autorizo expresamente la consulta de solvencia patrimonial en <strong>ASNEF (Equifax), BADEXCUG (Experian) y CIRBE del Banco de España</strong> conforme al RGPD UE 2016/679 y la Ley Orgánica 3/2018 (LOPDGDD).
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promissoryNoteConsent}
                    onChange={(e) => setPromissoryNoteConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#0066FF]"
                  />
                  <span>
                    Otorgo y firmo el <strong>Pagaré Cambiario a la Orden con Carta de Instrucciones</strong> regulado por la Ley 19/1985 Cambiaria y del Cheque de España con fuerza ejecutiva.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={platformTermsConsent}
                    onChange={(e) => setPlatformTermsConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#0066FF]"
                  />
                  <span>
                    Acepto el <strong>Contrato de Crédito al Consumo (Ley 16/2011)</strong>, la apertura de Cuenta Digital INSTACREDIT y reconozco mi derecho de desistimiento legal en 14 días naturales sin penalización.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Continuar al Paso {step + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-7 py-3 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Formalizando con eIDAS...' : 'Firmar Pagaré y Abrir Cuenta Digital'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
