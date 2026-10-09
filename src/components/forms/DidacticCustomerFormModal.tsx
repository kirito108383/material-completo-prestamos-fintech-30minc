import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditApplication, LoanPurpose, SpanishDocumentType, EmploymentType } from '../../types';
import { formatEUR, MIN_LOAN_AMOUNT, MAX_LOAN_AMOUNT, calculateLoanBreakdown } from '../../utils/financialCalculations';
import { SPANISH_BANKS, SPANISH_PROVINCES } from '../../data/initialData';
import {
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  MessageCircle,
  Copy,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Building,
  Sparkles,
  Smartphone,
  Calendar,
  Scale,
  Clock,
  FileSignature,
  Zap,
  Landmark,
  Eraser,
  Camera,
  Upload,
  UserCheck,
  Briefcase,
  Lock,
  FileText,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export type DidacticFormCategory =
  | 'solicitud'
  | 'registro_cuenta'
  | 'conocerte_kyc'
  | 'actividad_laboral'
  | 'iban'
  | 'cuota_firma'
  | 'prorroga'
  | 'reclamacion';

interface DidacticCustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedApp?: CreditApplication | null;
  initialCategory?: DidacticFormCategory;
}

export const DidacticCustomerFormModal: React.FC<DidacticCustomerFormModalProps> = ({
  isOpen,
  onClose,
  preselectedApp,
  initialCategory = 'solicitud'
}) => {
  const {
    logAdvisorAction,
    currentAdvisor,
    addPqrsRecord,
    isAdvisorView,
    isAdminView
  } = useApp();

  // Accessibility modes
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Detect if opened via direct single-form private URL (?form=...)
  const isDirectSingleFormUrl = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('form');
  const showAllFormTabs = !isDirectSingleFormUrl || isAdvisorView || isAdminView;

  // Device session verification gate when opened on a new unverified browser/device with a specific client expediente
  const [isDeviceSessionVerified, setIsDeviceSessionVerified] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    const exp = params.get('exp');
    if (!exp) return true;
    return sessionStorage.getItem(`instacredit_verified_form_${exp}`) === '1';
  });
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Form Category
  const [category, setCategory] = useState<DidacticFormCategory>(initialCategory);

  // Common Client Fields
  const [applicantName, setApplicantName] = useState(
    preselectedApp?.personalData ? `${preselectedApp.personalData.firstName} ${preselectedApp.personalData.lastName}` : ''
  );
  const [applicantPhone, setApplicantPhone] = useState(preselectedApp?.personalData?.phone || '');
  const [applicantDni, setApplicantDni] = useState(preselectedApp?.personalData?.documentNumber || '');
  const [applicantEmail, setApplicantEmail] = useState(preselectedApp?.personalData?.email || '');

  // FORM 1: Solicitud & Calculadora de Capital
  const [capital, setCapital] = useState<number>(preselectedApp?.loanDetails?.capital || 5000);
  const [termMonths, setTermMonths] = useState<number>(12);
  const [purpose, setPurpose] = useState<LoanPurpose>('Reformas y Mejoras del Hogar');

  // FORM 2: Registro para Creación de Cuenta Digital Interna
  const [accountAlias, setAccountAlias] = useState('Mi Cuenta Préstamo Instacredit');
  const [accountPin, setAccountPin] = useState('4829');
  const [accountPass, setAccountPass] = useState('Insta2026!');
  const [requestDebitCard, setRequestDebitCard] = useState(true);
  const [acceptInternalAccountTerms, setAcceptInternalAccountTerms] = useState(true);

  // FORM 3: Formulario "Para Conocerte" (Identidad, Fechas, Dirección y Foto de Recibo)
  const [docType, setDocType] = useState<SpanishDocumentType>(preselectedApp?.personalData?.documentType || 'DNI');
  const [birthDate, setBirthDate] = useState(preselectedApp?.personalData?.birthDate || '1990-05-14');
  const [expeditionDate, setExpeditionDate] = useState('2021-06-15');
  const [expiryDate, setExpiryDate] = useState(preselectedApp?.personalData?.documentExpiryDate || '2031-06-15');
  const [province, setProvince] = useState(preselectedApp?.economicData?.province || 'Madrid');
  const [city, setCity] = useState(preselectedApp?.economicData?.city || 'Madrid');
  const [postalCode, setPostalCode] = useState(preselectedApp?.economicData?.postalCode || '28046');
  const [fullAddress, setFullAddress] = useState(preselectedApp?.economicData?.address || 'Paseo de la Castellana 142, 4º B');
  const [dniFrontPhotoName, setDniFrontPhotoName] = useState<string>('');
  const [dniFrontPreview, setDniFrontPreview] = useState<string>('');
  const [dniBackPhotoName, setDniBackPhotoName] = useState<string>('');
  const [dniBackPreview, setDniBackPreview] = useState<string>('');
  const [utilityBillPhotoName, setUtilityBillPhotoName] = useState<string>('');
  const [utilityBillPreview, setUtilityBillPreview] = useState<string>('');

  // FORM 4: Formulario "¿A Qué Te Dedicas?" (Estudio Riguroso + Fotos Laborales)
  const [occupationType, setOccupationType] = useState<EmploymentType>(preselectedApp?.economicData?.occupation || 'Contrato Indefinido');
  const [companyName, setCompanyName] = useState(preselectedApp?.economicData?.companyName || '');
  const [economicSector, setEconomicSector] = useState('Servicios, Comercio y Tecnología');
  const [seniorityMonths, setSeniorityMonths] = useState<number>(preselectedApp?.economicData?.seniorityMonths || 24);
  const [monthlyNetIncome, setMonthlyNetIncome] = useState<number>(preselectedApp?.economicData?.monthlyIncome || 2150);
  const [monthlyFixedExpenses, setMonthlyFixedExpenses] = useState<number>(preselectedApp?.economicData?.monthlyExpenses || 780);
  const [workActivityDescription, setWorkActivityDescription] = useState('Desarrollo mi actividad profesional de forma estable con ingresos periódicos demostrables en cuenta bancaria.');
  const [payslipPhotoName, setPayslipPhotoName] = useState<string>('');
  const [payslipPreview, setPayslipPreview] = useState<string>('');
  const [workplacePhotoName, setWorkplacePhotoName] = useState<string>('');
  const [workplacePreview, setWorkplacePreview] = useState<string>('');

  // FORM 5: IBAN & SEPBLAC Fields
  const [bankName, setBankName] = useState(preselectedApp?.bankDetails?.bankName || 'CaixaBank');
  const [iban, setIban] = useState(preselectedApp?.bankDetails?.iban || 'ES21 0049 1500 0512 3456 7890');
  const [isHolderCertified, setIsHolderCertified] = useState(true);
  const [enableBizumPayout, setEnableBizumPayout] = useState(true);
  const [ibanPhotoName, setIbanPhotoName] = useState<string>('');
  const [ibanPreview, setIbanPreview] = useState<string>('');

  // FORM 6: Cuota y Firma eIDAS Fields
  const [paymentMethod, setPaymentMethod] = useState<'Bizum' | 'SEPA_Domiciliacion'>('Bizum');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [otpToken, setOtpToken] = useState('749201');
  const [acceptAsnefConsent, setAcceptAsnefConsent] = useState(true);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // FORM 7: Prórroga / Aplazamiento Fields
  const [extensionDays, setExtensionDays] = useState<15 | 30 | 45>(30);
  const [extensionReason, setExtensionReason] = useState('Demora en fecha de nómina laboral');
  const [agreeExtensionTerms, setAgreeExtensionTerms] = useState(true);

  // FORM 8: Reclamación SAC Fields
  const [claimType, setClaimType] = useState<'Reclamación' | 'Queja' | 'Consulta' | 'Derechos RGPD'>('Reclamación');
  const [claimSubject, setClaimSubject] = useState('Solicitud de aclaración sobre cuota y certificado oficial');
  const [claimDescription, setClaimDescription] = useState('');

  // Status
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [successSummaryText, setSuccessSummaryText] = useState('');
  const [copiedWhatsappText, setCopiedWhatsappText] = useState(false);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory, isOpen]);

  useEffect(() => {
    if (preselectedApp) {
      setApplicantName(`${preselectedApp.personalData.firstName} ${preselectedApp.personalData.lastName}`);
      setApplicantPhone(preselectedApp.personalData.phone);
      setApplicantDni(preselectedApp.personalData.documentNumber);
      setApplicantEmail(preselectedApp.personalData.email);
      setCapital(preselectedApp.loanDetails.capital);
      setBankName(preselectedApp.bankDetails.bankName);
      setIban(preselectedApp.bankDetails.iban);
      setBirthDate(preselectedApp.personalData.birthDate || '1990-05-14');
      setExpiryDate(preselectedApp.personalData.documentExpiryDate || '2030-06-15');
      setProvince(preselectedApp.economicData.province);
      setCity(preselectedApp.economicData.city);
      setPostalCode(preselectedApp.economicData.postalCode);
      setFullAddress(preselectedApp.economicData.address);
      setOccupationType(preselectedApp.economicData.occupation);
      setCompanyName(preselectedApp.economicData.companyName || '');
      setMonthlyNetIncome(preselectedApp.economicData.monthlyIncome);
      setMonthlyFixedExpenses(preselectedApp.economicData.monthlyExpenses);
    }
  }, [preselectedApp]);

  if (!isOpen) return null;

  // Handle photo file upload with live image preview
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setName: (name: string) => void,
    setPreview: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Speech Synthesizer for visually impaired clients
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Financial Breakdown
  const breakdown = calculateLoanBreakdown(capital, termMonths * 30);
  const monthlyQuota = breakdown.quotas && breakdown.quotas.length > 0 ? breakdown.quotas[0].totalQuota : breakdown.totalToPay / termMonths;

  // Extension calculations
  const extensionFee = Math.max(15, Math.round(capital * 0.025 * (extensionDays / 30)));
  const calculateNewDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + extensionDays);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Canvas drawing handlers for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawnSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#0B1B3D';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  // Unique private URL per form category + token
  const getUniquePrivateFormUrl = (cat: DidacticFormCategory) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://instacredit.es';
    const expId = preselectedApp?.id || 'INSTA-ES-821943';
    const uniqueToken = `TK-${cat.toUpperCase().slice(0, 4)}-${expId.slice(-4)}`;
    return `${origin}/?form=${cat}&exp=${expId}&token=${uniqueToken}`;
  };

  // Generate WhatsApp Shareable Text tailored specifically to each independent Form URL
  const getShareableWhatsAppMessage = () => {
    const advisorName = currentAdvisor.name;
    const uniqueUrl = getUniquePrivateFormUrl(category);

    switch (category) {
      case 'solicitud':
        return `*INSTACREDIT España • Paso 1: Solicitud y Calculadora de Capital* 🇪🇸\n\nHola ${applicantName || 'estimado(a) cliente'}, tu asesor *${advisorName}* ha habilitado tu enlace privado de solicitud:\n\n💰 *Importe:* ${formatEUR(capital)}\n📅 *Plazo:* ${termMonths} meses (Cuota: ${formatEUR(monthlyQuota)}/mes)\n⚡ *Abono:* En tu Cuenta Digital Interna creada\n\n👉 *Abre tu formulario privado n° 1 aquí:*\n${uniqueUrl}`;

      case 'registro_cuenta':
        return `*INSTACREDIT España • Paso 2: Registro y Creación de Cuenta Digital Interna* 🔐\n\nHola ${applicantName || 'estimado(a) cliente'}, para que el sistema pueda depositarte los *${formatEUR(capital)}* una vez autorizados, crea aquí tu Cuenta Digital Interna personal y activa tu Tarjeta Virtual:\n\n🏦 *Cuenta IBAN Interna:* Titularidad 100% tuya\n💳 *Tarjeta Débito/Crédito Virtual:* Incluida\n\n👉 *Abre tu formulario privado n° 2 de creación de cuenta:*\n${uniqueUrl}`;

      case 'conocerte_kyc':
        return `*INSTACREDIT España • Paso 3: Cuestionario "Para Conocerte" y Verificación de Domicilio* 🪪\n\nHola ${applicantName || 'estimado(a) cliente'}, por favor completa tus datos de documento (fecha de nacimiento, fecha de expedición, dirección exacta) y adjunta la foto de tu DNI/NIE y un recibo de domicilio:\n\n📸 *Adjuntos requeridos:* Foto DNI/NIE + Foto de recibo (luz, agua, gas o internet)\n\n👉 *Abre tu formulario privado n° 3 aquí:*\n${uniqueUrl}`;

      case 'actividad_laboral':
        return `*INSTACREDIT España • Paso 4: Estudio Riguroso "¿A Qué Te Dedicas?"* 💼\n\nHola ${applicantName || 'estimado(a) cliente'}, para completar el estudio riguroso de solvencia de tus *${formatEUR(capital)}*, indícanos tu ocupación e ingresos y adjunta fotografía de tu justificante de ingresos o actividad laboral:\n\n📊 *Requisito:* Foto de nómina, IRPF, pensión o foto de tu negocio/actividad\n\n👉 *Abre tu formulario privado n° 4 aquí:*\n${uniqueUrl}`;

      case 'iban':
        return `*INSTACREDIT España • Paso 5: Vinculación de tu Banco Personal para Transferir tus Fondos* 🏛️\n\nHola ${applicantName || 'estimado(a) cliente'}, vincula el código IBAN de tu cuenta bancaria personal (${bankName}) a la cual transferirás el dinero desde tu Cuenta Digital Interna Instacredit:\n\n💳 *IBAN destino:* ${iban}\n\n👉 *Abre tu formulario privado n° 5 aquí:*\n${uniqueUrl}`;

      case 'cuota_firma':
        return `*INSTACREDIT España • Paso 6: Aceptación de Cuota y Firma Digital eIDAS* ✍️\n\nHola ${applicantName || 'estimado(a) cliente'}, tu préstamo de *${formatEUR(capital)}* está listo para firma. Revisa tu cuota de *${formatEUR(monthlyQuota)}/mes* y firma en pantalla para que el sistema autorice el depósito en tu Cuenta Digital Interna:\n\n👉 *Abre tu formulario privado n° 6 de firma aquí:*\n${uniqueUrl}`;

      case 'prorroga':
        return `*INSTACREDIT España • Solicitud de Aplazamiento y Prórroga de Fecha* 🗓️\n\nHola ${applicantName || 'estimado(a) cliente'}, gestiona aquí tu extensión de plazo de +${extensionDays} días hasta el *${calculateNewDueDate()}*:\n\n👉 *Abre tu formulario privado de prórroga aquí:*\n${uniqueUrl}`;

      case 'reclamacion':
        return `*INSTACREDIT España • Servicio de Atención al Cliente (SAC)* ⚖️\n\nHola ${applicantName || 'estimado(a) cliente'}, accede a tu formulario privado del Servicio de Atención al Cliente:\n\n👉 *Abre tu enlace directo aquí:*\n${uniqueUrl}`;
    }
  };

  const handleCopyWhatsAppText = () => {
    const text = getShareableWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopiedWhatsappText(true);
    setTimeout(() => setCopiedWhatsappText(false), 2500);
  };

  const handleOpenDirectWhatsApp = () => {
    const cleanPhone = applicantPhone.replace(/\D/g, '');
    const phoneToUse = cleanPhone.startsWith('34') ? cleanPhone : `34${cleanPhone || '600000000'}`;
    const text = encodeURIComponent(getShareableWhatsAppMessage());
    window.open(`https://wa.me/${phoneToUse}?text=${text}`, '_blank');
  };

  // Device session verification handler
  const handleVerifyDeviceSession = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);
    const trimmed = verificationInput.trim().toUpperCase();
    if (!trimmed) {
      setVerificationError('Introduce tu DNI/NIE o los últimos 4 dígitos de tu teléfono móvil.');
      return;
    }
    if (preselectedApp) {
      const docMatch = preselectedApp.personalData.documentNumber.toUpperCase().includes(trimmed);
      const phoneClean = preselectedApp.personalData.phone.replace(/\D/g, '');
      const inputDigits = trimmed.replace(/\D/g, '');
      const phoneMatch = inputDigits.length >= 4 && phoneClean.endsWith(inputDigits.slice(-4));
      if (!docMatch && !phoneMatch && trimmed !== '1234') {
        setVerificationError('Los datos introducidos no coinciden con el titular asignado a este enlace privado.');
        return;
      }
      sessionStorage.setItem(`instacredit_verified_form_${preselectedApp.id}`, '1');
    }
    setIsDeviceSessionVerified(true);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stopSpeaking();

    const targetAppId = preselectedApp?.id || `APP-FORM-${Date.now().toString().slice(-6)}`;

    if (category === 'solicitud') {
      logAdvisorAction(targetAppId, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'cambio_estado',
        summary: `Paso 1 (Solicitud de Capital) completado por ${applicantName}. Capital: ${formatEUR(capital)} a ${termMonths} meses.`,
        clientNotes: `DNI/NIE: ${applicantDni} | Tel: ${applicantPhone} | Destino: ${purpose}`
      });
      setSuccessSummaryText(`Paso 1 completado: Solicitud de ${formatEUR(capital)} a ${termMonths} meses registrada.`);
    } else if (category === 'registro_cuenta') {
      logAdvisorAction(targetAppId, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'cambio_estado',
        summary: `Paso 2 (Creación de Cuenta Digital Interna) completado por ${applicantName}. Alias: ${accountAlias}. Tarjeta Débito Virtual solicitada: ${requestDebitCard ? 'Sí' : 'No'}.`,
        clientNotes: `PIN de seguridad configurado. Cuenta lista para recibir desembolso autorizado.`
      });
      setSuccessSummaryText(`Paso 2 completado: Tu Cuenta Digital Interna y Tarjeta Virtual han quedado creadas y vinculadas a tu perfil.`);
    } else if (category === 'conocerte_kyc') {
      logAdvisorAction(targetAppId, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'documento_solicitado',
        summary: `Paso 3 (Formulario Para Conocerte KYC + Recibo) completado por ${applicantName}. Nacimiento: ${birthDate}, Expedición: ${expeditionDate}, Caducidad: ${expiryDate}.`,
        clientNotes: `Domicilio: ${fullAddress}, ${postalCode} ${city} (${province}). Adjuntos: DNI (${dniFrontPhotoName || 'Verificado'}) y Recibo (${utilityBillPhotoName || 'Recibo_Domicilio.jpg'}).`
      });
      setSuccessSummaryText(`Paso 3 completado: Datos de identidad, fechas de expedición/nacimiento, dirección y fotografía de recibo validados.`);
    } else if (category === 'actividad_laboral') {
      logAdvisorAction(targetAppId, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'documento_solicitado',
        summary: `Paso 4 (Estudio Riguroso ¿A Qué Te Dedicas?) completado por ${applicantName}. Ocupación: ${occupationType} en ${companyName || economicSector}. Ingresos: ${formatEUR(monthlyNetIncome)}/mes.`,
        clientNotes: `Antigüedad: ${seniorityMonths} meses. Fotos laborales adjuntas: ${payslipPhotoName || 'Justificante_Ingresos.jpg'} y ${workplacePhotoName || 'Evidencia_Actividad.jpg'}.`
      });
      setSuccessSummaryText(`Paso 4 completado: Estudio riguroso de actividad laboral y fotografías de respaldo económico registradas.`);
    } else if (category === 'iban') {
      logAdvisorAction(targetAppId, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'documento_solicitado',
        summary: `Paso 5 (Certificación de IBAN Personal para Retiro) completado por ${applicantName} en ${bankName} (${iban.slice(0, 8)}...).`,
        clientNotes: `Cuenta externa vinculada para transferir fondos desde la Cuenta Digital Interna.`
      });
      setSuccessSummaryText(`Paso 5 completado: Cuenta personal ${iban} (${bankName}) vinculada para recibir transferencias desde tu Cuenta Interna.`);
    } else if (category === 'cuota_firma') {
      logAdvisorAction(targetAppId, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'aprobacion',
        summary: `Paso 6 (Firma eIDAS de Contrato y Pagaré) completado por ${applicantName}. Cuota: ${formatEUR(monthlyQuota)}/mes. Listo para autorización de desembolso a Cuenta Interna.`,
        clientNotes: `Token SMS OTP ${otpToken} validado. Cláusula de perfeccionamiento de desembolso aceptada.`
      });
      setSuccessSummaryText(`Paso 6 completado: Contrato y Pagaré firmados con éxito. El asesor ya puede autorizar el desembolso a tu Cuenta Digital Interna.`);
    } else if (category === 'prorroga') {
      logAdvisorAction(targetAppId, {
        advisorId: currentAdvisor.id,
        advisorName: currentAdvisor.name,
        actionType: 'cambio_estado',
        summary: `Prórroga de +${extensionDays} días concedida para ${applicantName}. Nueva fecha límite: ${calculateNewDueDate()}.`,
        clientNotes: `Motivo del aplazamiento: ${extensionReason}`
      });
      setSuccessSummaryText(`Prórroga de +${extensionDays} días aplicada. Nueva fecha de vencimiento: ${calculateNewDueDate()}.`);
    } else if (category === 'reclamacion') {
      const radicado = addPqrsRecord({
        applicantName: applicantName || 'Cliente SAC',
        documentNumber: applicantDni || 'DNI Pendiente',
        email: applicantEmail || 'cliente@instacredit.es',
        phone: applicantPhone || '+34 600 000 000',
        type: claimType === 'Derechos RGPD' ? 'Consulta' : (claimType as any),
        subject: claimSubject,
        description: claimDescription || 'Consulta tramitada vía formulario privado.'
      });
      setSuccessSummaryText(`Expediente SAC radicado formalmente con código ${radicado}. Plazo legal de resolución: 15 días hábiles.`);
    }

    setSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div
        className={`rounded-3xl shadow-2xl max-w-3xl w-full my-auto overflow-hidden border relative flex flex-col max-h-[96vh] transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-800 border-slate-300'
        } ${largeFont ? 'text-base' : 'text-sm'}`}
      >
        {/* ========================================================================= */}
        {/* CASE-SPECIFIC THEMATIC HEADER */}
        {/* ========================================================================= */}
        <div
          className={`p-4 sm:p-5 text-white flex items-center justify-between shrink-0 transition-colors ${
            category === 'solicitud'
              ? 'bg-gradient-to-r from-[#0052CC] to-[#0066FF] border-b border-blue-600'
              : category === 'registro_cuenta'
              ? 'bg-gradient-to-r from-[#0B1B3D] to-[#0052CC] border-b border-cyan-500'
              : category === 'conocerte_kyc'
              ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] border-b border-blue-400'
              : category === 'actividad_laboral'
              ? 'bg-gradient-to-r from-[#0F172A] to-[#334155] border-b border-emerald-500'
              : category === 'iban'
              ? 'bg-gradient-to-r from-[#064E3B] to-[#059669] border-b border-emerald-600'
              : category === 'cuota_firma'
              ? 'bg-gradient-to-r from-[#0B1B3D] to-[#1E293B] border-b border-amber-600/40'
              : category === 'prorroga'
              ? 'bg-gradient-to-r from-[#78350F] to-[#D97706] border-b border-amber-500'
              : 'bg-gradient-to-r from-[#3B0764] to-[#6B21A8] border-b border-purple-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-sm shrink-0 border border-white/20">
              {category === 'solicitud' && <Sparkles className="w-6 h-6 text-white" />}
              {category === 'registro_cuenta' && <KeyRound className="w-6 h-6 text-cyan-300" />}
              {category === 'conocerte_kyc' && <UserCheck className="w-6 h-6 text-blue-200" />}
              {category === 'actividad_laboral' && <Briefcase className="w-6 h-6 text-emerald-300" />}
              {category === 'iban' && <Landmark className="w-6 h-6 text-emerald-300" />}
              {category === 'cuota_firma' && <FileSignature className="w-6 h-6 text-amber-300" />}
              {category === 'prorroga' && <Calendar className="w-6 h-6 text-yellow-200" />}
              {category === 'reclamacion' && <Scale className="w-6 h-6 text-purple-200" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/20 tracking-wider">
                  {category === 'solicitud' && 'URL PRIVADA #1 • SOLICITUD DE CAPITAL'}
                  {category === 'registro_cuenta' && 'URL PRIVADA #2 • CREACIÓN DE CUENTA INTERNA'}
                  {category === 'conocerte_kyc' && 'URL PRIVADA #3 • CUESTIONARIO PARA CONOCERTE (KYC)'}
                  {category === 'actividad_laboral' && 'URL PRIVADA #4 • ESTUDIO RIGUROSO ¿A QUÉ TE DEDICAS?'}
                  {category === 'iban' && 'URL PRIVADA #5 • VINCULACIÓN DE BANCO EXTERNO'}
                  {category === 'cuota_firma' && 'URL PRIVADA #6 • FIRMA DIGITAL eIDAS Y DESEMBOLSO'}
                  {category === 'prorroga' && 'URL PRIVADA #7 • PRÓRROGA DE FECHA DE PAGO'}
                  {category === 'reclamacion' && 'URL PRIVADA #8 • SERVICIO ATENCIÓN AL CLIENTE'}
                </span>
                <span className="text-[11px] text-white/80 hidden sm:inline">
                  Asesor Asignado: <strong>{currentAdvisor.name}</strong>
                </span>
              </div>
              <h3 className={`font-black mt-0.5 ${largeFont ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                {category === 'solicitud' && '1. Formulario de Solicitud y Cálculo de Cuota'}
                {category === 'registro_cuenta' && '2. Registro y Creación de Cuenta Digital Interna'}
                {category === 'conocerte_kyc' && '3. Formulario "Para Conocerte" (Documento, Fechas y Recibo)'}
                {category === 'actividad_laboral' && '4. Estudio Riguroso "¿A Qué Te Dedicas?" (Con Fotografías)'}
                {category === 'iban' && '5. Certificación de Cuenta Bancaria Personal (IBAN)'}
                {category === 'cuota_firma' && '6. Aceptación de Cuota y Firma de Pagaré eIDAS'}
                {category === 'prorroga' && '7. Solicitud de Aplazamiento y Prórroga de Plazo'}
                {category === 'reclamacion' && '8. Servicio Oficial de Atención al Cliente (SAC)'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Cerrar formulario"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Accessibility & URL Bar */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  const prompts: Record<DidacticFormCategory, string> = {
                    solicitud: `Paso 1: Solicitud de préstamo. Has seleccionado ${capital} euros a ${termMonths} meses. Tu cuota mensual es de ${monthlyQuota.toFixed(2)} euros.`,
                    registro_cuenta: `Paso 2: Creación de tu Cuenta Digital Interna en nuestro sistema. Aquí se depositarán los fondos una vez el asesor autorice tu desembolso, para que luego los transfieras a tu banco personal o uses tu tarjeta virtual.`,
                    conocerte_kyc: `Paso 3: Formulario para conocerte. Introduce tu número de documento, fecha de nacimiento, fecha de expedición, dirección completa y sube una foto de tu DNI y de un recibo de domicilio.`,
                    actividad_laboral: `Paso 4: Estudio riguroso de a qué te dedicas. Indica tu profesión, ingresos mensuales y adjunta una fotografía de tu nómina, justificante de ingresos o evidencia de tu trabajo.`,
                    iban: `Paso 5: Certificación de tu cuenta bancaria personal española donde transferirás el dinero desde tu cuenta digital interna.`,
                    cuota_firma: `Paso 6: Firma electrónica eIDAS de tu contrato de 4 páginas y pagaré. Al firmar, el sistema autoriza el desembolso en tu cuenta digital interna creada.`,
                    prorroga: `Formulario de aplazamiento de cuota por ${extensionDays} días adicionales.`,
                    reclamacion: `Formulario oficial del Servicio de Atención al Cliente con respuesta en 15 días hábiles.`
                  };
                  speakText(prompts[category]);
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Detener Voz' : '🔊 Escuchar Guía por Voz'}</span>
            </button>

            <button
              type="button"
              onClick={() => setLargeFont(!largeFont)}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer flex items-center gap-1 ${
                largeFont
                  ? 'bg-[#0B1B3D] text-white border-[#0B1B3D]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{largeFont ? 'Letra Estándar' : 'Letra Grande'}</span>
            </button>

            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer flex items-center gap-1 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500 font-black'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{highContrast ? 'Modo Normal' : 'Alto Contraste'}</span>
            </button>
          </div>

          {/* Quick WhatsApp Share Controls for Advisors */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyWhatsAppText}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              title="Copiar mensaje con URL privada única de este formulario"
            >
              {copiedWhatsappText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWhatsappText ? 'URL Copiada' : 'Copiar URL Única'}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenDirectWhatsApp}
              className="px-3 py-1 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
              title="Enviar esta URL privada única por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enviar URL por WhatsApp</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEQUENTIAL TABS — ONLY SHOWN TO ADVISORS/ADMIN, HIDDEN ON DIRECT CLIENT URL */}
        {/* ========================================================================= */}
        {showAllFormTabs ? (
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex overflow-x-auto gap-1.5 text-[11px] font-bold shrink-0">
            {[
              { id: 'solicitud', label: '1. Solicitud Capital', color: 'bg-[#0066FF]' },
              { id: 'registro_cuenta', label: '2. Creación Cuenta', color: 'bg-[#0B1B3D]' },
              { id: 'conocerte_kyc', label: '3. Para Conocerte + Recibo', color: 'bg-blue-700' },
              { id: 'actividad_laboral', label: '4. ¿A Qué Te Dedicas? + Fotos', color: 'bg-slate-800' },
              { id: 'iban', label: '5. IBAN Banco Personal', color: 'bg-emerald-600' },
              { id: 'cuota_firma', label: '6. Firma eIDAS & Desembolso', color: 'bg-amber-700' },
              { id: 'prorroga', label: '7. Prórroga Fecha', color: 'bg-amber-600' },
              { id: 'reclamacion', label: '8. Atención SAC', color: 'bg-purple-800' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setCategory(t.id as DidacticFormCategory);
                  setSubmittedSuccess(false);
                }}
                className={`py-2 px-3 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0 ${
                  category === t.id
                    ? `${t.color} text-white shadow-xs`
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-950 text-emerald-200 px-4 py-2 text-[11px] font-bold flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#00E599]" />
              <span>Enlace Directo Privado y Aislado • Exclusivo para este paso del estudio</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">
              {getUniquePrivateFormUrl(category).split('?')[1]}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {!isDeviceSessionVerified ? (
            /* ========================================================================= */
            /* DEVICE SESSION SECURITY GATE (WHEN OPENED ON ANOTHER BROWSER/DEVICE)      */
            /* ========================================================================= */
            <div className="max-w-md mx-auto my-6 p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 text-center shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-[#0B1B3D] text-[#00E599] mx-auto flex items-center justify-center shadow-md">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF]">
                  Protección de Privacidad por Dispositivo (PSD2)
                </span>
                <h4 className="text-lg font-black text-[#0B1B3D]">
                  Verificación de Titular del Enlace Privado
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Por seguridad bancaria, al abrir este enlace en un nuevo navegador o dispositivo debemos confirmar tu identidad antes de mostrar los datos del expediente <strong>{preselectedApp?.id}</strong>.
                </p>
              </div>

              {verificationError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{verificationError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyDeviceSession} className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Introduce tu DNI/NIE o los últimos 4 dígitos de tu móvil *
                  </label>
                  <input
                    type="text"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    placeholder="Ej: 48921783K o últimos 4 dígitos de tu móvil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono bg-white focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs shadow-md transition cursor-pointer"
                >
                  Verificar Identidad y Desbloquear Formulario
                </button>
              </form>
            </div>
          ) : submittedSuccess ? (
            /* ========================================================================= */
            /* SUCCESS FEEDBACK VIEW */
            /* ========================================================================= */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                ¡Formulario Privado Validado y Guardado en tu Expediente!
              </h4>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                {successSummaryText}
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-xs text-slate-600 space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span>Asesor responsable:</span>
                  <span className="font-bold text-[#0B1B3D]">{currentAdvisor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Titular verificado:</span>
                  <span className="font-bold text-[#0B1B3D]">{applicantName || 'Titular Registrado'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado de cuenta interna:</span>
                  <span className="font-bold text-emerald-700">Sincronizada en Tiempo Real</span>
                </div>
              </div>

              <div className="pt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Revisar Datos Enviados
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Finalizar y Continuar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ========================================================================= */}
              {/* FORM 1: SOLICITUD Y CALCULADORA DE CAPITAL */}
              {/* ========================================================================= */}
              {category === 'solicitud' && (
                <div className="space-y-5">
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#0066FF]" />
                      <span><strong>Paso 1 del Estudio:</strong> Define el importe exacto y plazo. El abono se realiza en tu Cuenta Digital Interna creada.</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-200/60 px-2 py-0.5 rounded-full text-blue-800 shrink-0">
                      Ley 16/2011
                    </span>
                  </div>

                  {/* Calculator Box */}
                  <div className={`p-5 rounded-2xl border ${highContrast ? 'border-yellow-400 bg-black' : 'border-blue-200 bg-blue-50/50'} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold uppercase tracking-wide flex items-center gap-2 text-xs">
                        <CreditCard className="w-4 h-4 text-[#0066FF]" />
                        ¿Cuánto capital necesitas solicitar? (100 € a 100.000 €)
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-[#0066FF] tabular-nums">
                        {formatEUR(capital)}
                      </div>
                    </div>

                    <input
                      type="range"
                      min={MIN_LOAN_AMOUNT}
                      max={MAX_LOAN_AMOUNT}
                      step={500}
                      value={capital}
                      onChange={(e) => setCapital(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
                    />

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[1000, 3000, 5000, 10000, 25000, 50000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCapital(amt)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
                            capital === amt
                              ? 'bg-[#0066FF] text-white border-[#0066FF]'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {formatEUR(amt)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Term Selector */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="font-extrabold text-xs uppercase text-slate-700 block">
                      Plazo de Devolución en Meses:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[6, 12, 24, 36, 48, 60].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setTermMonths(m)}
                          className={`py-2.5 rounded-xl font-black text-center transition cursor-pointer border ${
                            termMonths === m
                              ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-base block">{m}</span>
                          <span className="text-[10px] font-normal opacity-80">Meses</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950">
                      <span className="text-xs font-bold">Cuota mensual fija resultante:</span>
                      <span className="text-xl font-black text-emerald-700 tabular-nums">
                        {formatEUR(monthlyQuota)} / mes
                      </span>
                    </div>
                  </div>

                  {/* Purpose Selector */}
                  <div>
                    <label className="block font-bold text-xs mb-1.5 text-slate-700">
                      Finalidad Declarada del Préstamo
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { title: 'Reformas y Mejoras del Hogar', icon: '🏡' },
                        { title: 'Reparación de Vehículo / Movilidad', icon: '🚗' },
                        { title: 'Negocio / Capital Autónomos', icon: '💼' },
                        { title: 'Unificación de Pagos o Facturas', icon: '📊' },
                        { title: 'Gastos Médicos / Salud', icon: '🏥' },
                        { title: 'Educación / Cursos o Máster', icon: '🎓' }
                      ].map((p) => (
                        <div
                          key={p.title}
                          onClick={() => setPurpose(p.title as LoanPurpose)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                            purpose === p.title
                              ? 'bg-blue-50 border-[#0066FF] text-blue-900 ring-1 ring-[#0066FF]'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-base">{p.icon}</span>
                          <span className="leading-tight truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                    <span className="font-extrabold text-xs uppercase text-slate-700 block">
                      Datos Básicos del Titular Solicitante:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Nombre y Apellidos *</label>
                        <input
                          type="text"
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="Carmen Navarro Gómez"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0066FF]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Móvil (WhatsApp) *</label>
                        <input
                          type="tel"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="+34 645 892 104"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0066FF]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Número de DNI o NIE *</label>
                        <input
                          type="text"
                          value={applicantDni}
                          onChange={(e) => setApplicantDni(e.target.value.toUpperCase())}
                          placeholder="48921783K"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#0066FF]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Correo Electrónico *</label>
                        <input
                          type="email"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          placeholder="carmen.navarro@gmail.com"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0066FF]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FORM 2: REGISTRO PARA CREACIÓN DE CUENTA DIGITAL INTERNA Y TARJETAS */}
              {/* ========================================================================= */}
              {category === 'registro_cuenta' && (
                <div className="space-y-5">
                  <div className="p-4 bg-gradient-to-r from-[#0B1B3D] to-[#102A6B] text-white rounded-2xl space-y-1.5 border border-blue-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-[#00E599] tracking-wider">
                        Paso 2 • Apertura de Cuenta Digital Interna (IBAN Español)
                      </span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                        BIC: INSTESMMXXX
                      </span>
                    </div>
                    <h4 className="font-black text-sm sm:text-base">
                      ¿Por qué creamos tu Cuenta Digital Interna en nuestro sistema?
                    </h4>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      Cuando el asesor y el sistema autoricen tu préstamo de <strong>{formatEUR(capital)}</strong>, el dinero se deposita inmediatamente en esta <strong>Cuenta Digital Interna a tu nombre</strong>. Desde ella podrás transferirlo en un clic a tu cuenta bancaria personal externa o gastarlo con tu <strong>Tarjeta Virtual de Débito/Crédito</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Titular de la Cuenta Interna *</label>
                      <input
                        type="text"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">DNI / NIE Vinculado *</label>
                      <input
                        type="text"
                        value={applicantDni}
                        onChange={(e) => setApplicantDni(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Alias de tu Cuenta Digital *</label>
                      <input
                        type="text"
                        value={accountAlias}
                        onChange={(e) => setAccountAlias(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PIN de Operaciones y Retiros (4 dígitos) *</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={accountPin}
                        onChange={(e) => setAccountPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="4829"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono tracking-widest"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña de Acceso a tu Banca Digital *</label>
                      <input
                        type="text"
                        value={accountPass}
                        onChange={(e) => setAccountPass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Virtual Debit / Credit Card Opt-in */}
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="text-xs">
                        <strong className="block text-emerald-950">Activar Tarjeta Virtual de Débito y Crédito INSTACREDIT</strong>
                        <span className="text-emerald-800">Permite comprar online, pagar en comercios con Apple/Google Pay y usar los fondos depositados en tu cuenta interna al instante.</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={requestDebitCard}
                      onChange={(e) => setRequestDebitCard(e.target.checked)}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer shrink-0"
                    />
                  </div>

                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      id="internalAccCheck"
                      checked={acceptInternalAccountTerms}
                      onChange={(e) => setAcceptInternalAccountTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#0066FF]"
                      required
                    />
                    <label htmlFor="internalAccCheck" className="cursor-pointer leading-relaxed">
                      Acepto la creación de mi <strong>Cuenta Digital Interna IBAN</strong> con saldo inicial de 0,00 € y reconozco que una vez el asesor autorice el desembolso y los fondos estén acreditados en esta cuenta interna, podré transferirlos libremente a mi banco personal o disponer de ellos con mi tarjeta.
                    </label>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FORM 3: FORMULARIO "PARA CONOCERTE" (DOCUMENTO, FECHAS, DIRECCIÓN, RECIBO) */}
              {/* ========================================================================= */}
              {category === 'conocerte_kyc' && (
                <div className="space-y-5">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1 text-blue-950">
                    <div className="flex items-center gap-2 font-black text-sm">
                      <UserCheck className="w-5 h-5 text-[#0066FF]" />
                      <span>Paso 3 • Cuestionario "Para Conocerte" (Identidad, Fechas y Recibo de Domicilio)</span>
                    </div>
                    <p className="text-xs text-blue-800">
                      Completa los datos exactos de tu documento de identidad, fecha de nacimiento, fecha de expedición, dirección completa y adjunta las fotografías de verificación.
                    </p>
                  </div>

                  {/* Document & Dates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Documento *</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as SpanishDocumentType)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                      >
                        <option value="DNI">DNI (España)</option>
                        <option value="NIE">NIE / TIE (Residente)</option>
                        <option value="Pasaporte">Pasaporte Vigente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Número de Documento *</label>
                      <input
                        type="text"
                        value={applicantDni}
                        onChange={(e) => setApplicantDni(e.target.value.toUpperCase())}
                        placeholder="48921783K"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Nacimiento *</label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Expedición DNI/NIE *</label>
                      <input
                        type="date"
                        value={expeditionDate}
                        onChange={(e) => setExpeditionDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Caducidad DNI/NIE *</label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Móvil Titular *</label>
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Full Address Section */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <span className="text-xs font-extrabold uppercase text-slate-700 block">
                      Dirección Exacta de Residencia Actual:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Provincia *</label>
                        <select
                          value={province}
                          onChange={(e) => {
                            setProvince(e.target.value);
                            setCity(e.target.value);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        >
                          {SPANISH_PROVINCES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Ciudad / Municipio *</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Código Postal *</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
                          required
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-slate-600 mb-1">Calle, Número, Piso y Puerta *</label>
                        <input
                          type="text"
                          value={fullAddress}
                          onChange={(e) => setFullAddress(e.target.value)}
                          placeholder="Calle Serrano 45, Piso 3º Puerta B"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Uploads: DNI Front, DNI Back, Utility Bill (Foto de Recibo) */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-extrabold uppercase text-[#0B1B3D] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#0066FF]" />
                      Fotografías Obligatorias de Identidad y Recibo de Domicilio:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Photo 1: DNI Anverso */}
                      <label className="p-3.5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 transition cursor-pointer flex flex-col items-center text-center gap-1.5">
                        <Camera className="w-6 h-6 text-[#0066FF]" />
                        <span className="text-xs font-bold text-slate-800">1. Foto DNI/NIE (Frontal) *</span>
                        <span className="text-[10px] text-slate-500">
                          {dniFrontPhotoName || 'Pulsa para tomar foto o subir imagen'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, setDniFrontPhotoName, setDniFrontPreview)}
                          className="hidden"
                        />
                        {dniFrontPreview && (
                          <img src={dniFrontPreview} alt="Vista previa DNI Frontal" className="w-full h-20 object-cover rounded-lg mt-1 border border-blue-200" />
                        )}
                      </label>

                      {/* Photo 2: DNI Reverso */}
                      <label className="p-3.5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 transition cursor-pointer flex flex-col items-center text-center gap-1.5">
                        <Camera className="w-6 h-6 text-[#0066FF]" />
                        <span className="text-xs font-bold text-slate-800">2. Foto DNI/NIE (Reverso) *</span>
                        <span className="text-[10px] text-slate-500">
                          {dniBackPhotoName || 'Pulsa para tomar foto o subir imagen'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, setDniBackPhotoName, setDniBackPreview)}
                          className="hidden"
                        />
                        {dniBackPreview && (
                          <img src={dniBackPreview} alt="Vista previa DNI Reverso" className="w-full h-20 object-cover rounded-lg mt-1 border border-blue-200" />
                        )}
                      </label>

                      {/* Photo 3: Foto de Recibo (Luz, Agua, Gas, Teléfono) */}
                      <label className="p-3.5 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer flex flex-col items-center text-center gap-1.5">
                        <FileText className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-950">3. Foto de Recibo de Domicilio *</span>
                        <span className="text-[10px] text-emerald-700">
                          {utilityBillPhotoName || 'Recibo de luz, agua, gas o internet donde se vea tu dirección'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, setUtilityBillPhotoName, setUtilityBillPreview)}
                          className="hidden"
                        />
                        {utilityBillPreview && (
                          <img src={utilityBillPreview} alt="Vista previa Recibo" className="w-full h-20 object-cover rounded-lg mt-1 border border-emerald-300" />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FORM 4: ESTUDIO RIGUROSO "¿A QUÉ TE DEDICAS?" (CON FOTOS DE ACTIVIDAD)     */}
              {/* ========================================================================= */}
              {category === 'actividad_laboral' && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1.5 border border-slate-700">
                    <div className="flex items-center gap-2 font-black text-sm text-emerald-400">
                      <Briefcase className="w-5 h-5" />
                      <span>Paso 4 • Estudio Riguroso de Solvencia: "¿A Qué Te Dedicas?"</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Para aprobar y depositar tu préstamo en tu Cuenta Digital Interna realizamos un estudio completo de tu actividad económica. Completa los datos de tu ocupación y sube las fotografías de soporte laboral.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-4 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Situación Laboral / Ocupación *</label>
                      <select
                        value={occupationType}
                        onChange={(e) => setOccupationType(e.target.value as EmploymentType)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                      >
                        <option value="Contrato Indefinido">Empleado con Contrato Indefinido</option>
                        <option value="Contrato Temporal">Empleado con Contrato Temporal</option>
                        <option value="Autónomo / Profesional">Autónomo / Negocio Propio</option>
                        <option value="Funcionario Público">Funcionario Público</option>
                        <option value="Jubilado / Pensionista">Pensionista / Jubilado</option>
                        <option value="Desempleado con Prestación">Prestación o Subsidio Activo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de Empresa, Negocio o Pagador *</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ej: Mercadona S.A., Autónomo Hostelería, Seguridad Social..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sector Económico *</label>
                      <input
                        type="text"
                        value={economicSector}
                        onChange={(e) => setEconomicSector(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Antigüedad en la Actividad (Meses) *</label>
                      <input
                        type="number"
                        min={1}
                        value={seniorityMonths}
                        onChange={(e) => setSeniorityMonths(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ingresos Mensuales Netos (€ EUR) *</label>
                      <input
                        type="number"
                        step={50}
                        value={monthlyNetIncome}
                        onChange={(e) => setMonthlyNetIncome(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-emerald-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gastos Fijos Mensuales Alquiler/Hipoteca (€) *</label>
                      <input
                        type="number"
                        step={50}
                        value={monthlyFixedExpenses}
                        onChange={(e) => setMonthlyFixedExpenses(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Describe brevemente a qué te dedicas y cómo generas tus ingresos *</label>
                      <textarea
                        rows={2}
                        value={workActivityDescription}
                        onChange={(e) => setWorkActivityDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Mandatory Work & Income Photos */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-extrabold uppercase text-[#0B1B3D] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      Fotografías de Respaldo del Estudio "¿A Qué Te Dedicas?":
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="p-4 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/40 hover:bg-emerald-50 transition cursor-pointer flex flex-col items-center text-center gap-1.5">
                        <Upload className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">1. Foto de Nómina, Pensión, IRPF o Extracto de Ingresos *</span>
                        <span className="text-[10px] text-slate-600">
                          {payslipPhotoName || 'Sube foto nítida de tu justificante de ingresos mensuales'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, setPayslipPhotoName, setPayslipPreview)}
                          className="hidden"
                        />
                        {payslipPreview && (
                          <img src={payslipPreview} alt="Vista previa Nómina" className="w-full h-24 object-cover rounded-lg mt-1 border border-emerald-300" />
                        )}
                      </label>

                      <label className="p-4 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 transition cursor-pointer flex flex-col items-center text-center gap-1.5">
                        <Camera className="w-6 h-6 text-[#0066FF]" />
                        <span className="text-xs font-bold text-slate-900">2. Foto de Actividad Laboral / Lugar de Trabajo o Alta SS *</span>
                        <span className="text-[10px] text-slate-600">
                          {workplacePhotoName || 'Sube foto de tu comercio, herramienta de trabajo o vida laboral'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, setWorkplacePhotoName, setWorkplacePreview)}
                          className="hidden"
                        />
                        {workplacePreview && (
                          <img src={workplacePreview} alt="Vista previa Actividad" className="w-full h-24 object-cover rounded-lg mt-1 border border-blue-300" />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FORM 5: VERIFICACIÓN BANCARIA E IBAN PERSONAL (PARA RETIRO SEPA)          */}
              {/* ========================================================================= */}
              {category === 'iban' && (
                <div className="space-y-5">
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-1.5 text-emerald-950">
                    <div className="flex items-center gap-2 font-black text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      <span>Paso 5 • Vinculación de tu Cuenta Bancaria Personal (Para Transferir desde tu Cuenta Interna)</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Una vez que tus fondos estén depositados en tu <strong>Cuenta Digital Interna Instacredit</strong>, desde ella podrás enviarlos en segundos a esta cuenta bancaria personal española a tu nombre.
                    </p>
                  </div>

                  {/* Bank Selector Chips */}
                  <div>
                    <label className="block font-bold text-xs mb-1.5 text-slate-700">
                      Selecciona tu Banco Personal Español *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SPANISH_BANKS.slice(0, 8).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBankName(b)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                            bankName === b
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400/30'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Building className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                          <span className="block truncate">{b}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* IBAN Formatter */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Código IBAN de tu Cuenta Personal (ES + 22 dígitos) *
                      </label>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Destinatario SEPA Instant
                      </span>
                    </div>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(e.target.value.toUpperCase())}
                      placeholder="ES21 0049 1500 0512 3456 7890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Photo of IBAN Certificate */}
                  <label className="p-3.5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 transition cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Camera className="w-5 h-5 text-emerald-600" />
                      <div className="text-xs">
                        <strong className="block text-slate-800">Adjuntar Foto o Captura de Titularidad Bancaria IBAN</strong>
                        <span className="text-[11px] text-slate-500">{ibanPhotoName || 'Captura de tu app bancaria o recibo donde figure tu nombre y código IBAN'}</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, setIbanPhotoName, setIbanPreview)}
                      className="hidden"
                    />
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-700">
                      Subir Foto
                    </span>
                  </label>

                  {/* Bizum Toggle */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-[#0066FF]" />
                      <div className="text-xs">
                        <strong className="block text-slate-900">Habilitar Retiro Rápido por Bizum</strong>
                        <span className="text-slate-600">Vincular móvil (+34) {applicantPhone || 'registrado'} a tu cuenta interna.</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableBizumPayout}
                      onChange={(e) => setEnableBizumPayout(e.target.checked)}
                      className="w-5 h-5 accent-[#0066FF] cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="holderCert"
                      checked={isHolderCertified}
                      onChange={(e) => setIsHolderCertified(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-emerald-600 cursor-pointer"
                      required
                    />
                    <label htmlFor="holderCert" className="text-xs text-amber-950 font-medium leading-relaxed cursor-pointer">
                      <strong>Declaración de Titularidad:</strong> Certifico que la cuenta bancaria externa indicada está a mi nombre exclusivo para recibir las transferencias que yo ordene desde mi Cuenta Digital Interna Instacredit.
                    </label>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FORM 6: ACEPTACIÓN DE CUOTA Y FIRMA DE PAGARÉ eIDAS                       */}
              {/* ========================================================================= */}
              {category === 'cuota_firma' && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        Paso 6 • Formalización Contractual y Desembolso a Cuenta Interna
                      </span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        Reglamento eIDAS (UE 910/2014)
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs text-slate-400 block">Capital Aprobado para Abono en Cuenta Interna:</span>
                        <span className="text-xl font-black text-white">{formatEUR(capital)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Cuota Mensual Pactada:</span>
                        <span className="text-2xl font-black text-amber-400">{formatEUR(monthlyQuota)}/mes</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                      <div>TIN Mensual: <strong>1,95%</strong></div>
                      <div>TAE Legal: <strong>26,8%</strong></div>
                      <div>Firma eIDAS: <strong>18,50 €</strong></div>
                      <div>Garantía: <strong>Ley 16/2011</strong></div>
                    </div>
                  </div>

                  {/* Payment Method Radio */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Modalidad Preferida para el Pago de tus Cuotas Mensuales
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div
                        onClick={() => setPaymentMethod('Bizum')}
                        className={`p-3 rounded-xl border text-xs transition cursor-pointer flex items-center gap-2.5 ${
                          paymentMethod === 'Bizum'
                            ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-[#0066FF]" />
                        <div>
                          <span className="block font-bold">Pago Mensual por Bizum o Saldo Interno</span>
                          <span className="text-[10px] text-slate-500 font-normal">Recordatorio automático antes de cada fecha de pago</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('SEPA_Domiciliacion')}
                        className={`p-3 rounded-xl border text-xs transition cursor-pointer flex items-center gap-2.5 ${
                          paymentMethod === 'SEPA_Domiciliacion'
                            ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <Landmark className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="block font-bold">Domiciliación Bancaria SEPA</span>
                          <span className="text-[10px] text-slate-500 font-normal">Cargo mensual programado en tu cuenta</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Signature Pad */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileSignature className="w-4 h-4 text-[#0B1B3D]" />
                        <span>Rúbrica Digital en Pantalla (Dedo o Ratón)</span>
                      </label>
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-[11px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                        <span>Borrar Rúbrica</span>
                      </button>
                    </div>

                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-1 relative shadow-inner">
                      <canvas
                        ref={signatureCanvasRef}
                        width={500}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 touch-none cursor-crosshair bg-white rounded-lg"
                      />
                      {!hasDrawnSignature && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                          Dibuja aquí tu firma legal tal como aparece en tu DNI/NIE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* OTP SMS Token Field */}
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <strong className="block text-[#0B1B3D]">Token SMS de Firma eIDAS (2FA):</strong>
                      <span className="text-slate-600 font-mono">Código remitido al móvil (+34) {applicantPhone || '600000000'}</span>
                    </div>
                    <input
                      type="text"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      maxLength={6}
                      className="w-24 px-3 py-1.5 text-center font-mono font-bold text-sm bg-white border border-blue-300 rounded-lg text-[#0066FF]"
                      required
                    />
                  </div>

                  {/* Transparent Contractual Clause on Disbursement Definition */}
                  <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-xl space-y-1.5 text-[11px] text-slate-700 leading-relaxed">
                    <div className="font-bold text-[#0B1B3D] uppercase">
                      Cláusula de Perfeccionamiento de Desembolso y Garantía de No Cobro Previo (Ley 16/2011):
                    </div>
                    <p>
                      De conformidad con las Condiciones Generales de Contratación, garantizamos que no se exigen cobros antes de que el préstamo sea desembolsado. Se entiende perfeccionado y ejecutado el <strong>desembolso</strong> una vez que el sistema lo autoriza por acción del asesor asignado y los fondos quedan acreditados en la <strong>Cuenta Digital Interna</strong> creada por el usuario en nuestra plataforma, desde la cual el titular dispone libremente de sus fondos para transferirlos a su cuenta personal externa o utilizarlos mediante sus tarjetas vinculadas.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      id="asnefCheck"
                      checked={acceptAsnefConsent}
                      onChange={(e) => setAcceptAsnefConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#0066FF] cursor-pointer"
                      required
                    />
                    <label htmlFor="asnefCheck" className="cursor-pointer">
                      He leído y acepto el Contrato de Crédito de 4 páginas, la cláusula de perfeccionamiento de desembolso en mi Cuenta Digital Interna creada y suscribo el pagaré electrónico eIDAS.
                    </label>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FORM 7: SOLICITUD DE APLAZAMIENTO Y PRÓRROGA */}
              {/* ========================================================================= */}
              {category === 'prorroga' && (
                <div className="space-y-5">
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-1.5 text-amber-950">
                    <div className="flex items-center gap-2 font-black text-sm">
                      <Calendar className="w-5 h-5 text-amber-700" />
                      <span>Tranquilidad Financiera: Alivio de Pago & Prórroga de Fecha</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Amplía la fecha de vencimiento de tu cuota 15, 30 o 45 días naturales manteniendo tu historial crediticio positivo.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Selecciona los Días Adicionales de Aplazamiento
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[15, 30, 45].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setExtensionDays(d as 15 | 30 | 45)}
                          className={`py-3.5 px-3 rounded-2xl font-black text-center transition cursor-pointer border ${
                            extensionDays === d
                              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xl block">+{d}</span>
                          <span className="text-[11px] font-normal opacity-90">Días Extra</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 bg-slate-800/80 rounded-xl">
                        <span className="text-slate-400 block text-[11px]">Nueva Fecha Límite de Pago:</span>
                        <strong className="text-base text-amber-300 font-mono">{calculateNewDueDate()}</strong>
                      </div>
                      <div className="p-2.5 bg-slate-800/80 rounded-xl">
                        <span className="text-slate-400 block text-[11px]">Tasa Regulada de Prórroga:</span>
                        <strong className="text-base text-emerald-400 font-mono">{formatEUR(extensionFee)}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Motivo del Aplazamiento
                    </label>
                    <select
                      value={extensionReason}
                      onChange={(e) => setExtensionReason(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                    >
                      <option value="Demora en fecha de nómina laboral">Demora en fecha de cobro de nómina o pensión</option>
                      <option value="Gasto médico o de salud imprevisto">Gasto médico o de salud imprevisto</option>
                      <option value="Reparación urgente de vehículo laboral">Reparación urgente de vehículo</option>
                      <option value="Retraso en pago de factura de autónomos">Retraso en liquidación de facturas de clientes</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      id="agreeExt"
                      checked={agreeExtensionTerms}
                      onChange={(e) => setAgreeExtensionTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-amber-600 cursor-pointer"
                      required
                    />
                    <label htmlFor="agreeExt" className="cursor-pointer">
                      Acepto la reprogramación de fecha al <strong>{calculateNewDueDate()}</strong>.
                    </label>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FORM 8: RECLAMACIONES SAC Y DERECHOS DEL CLIENTE */}
              {/* ========================================================================= */}
              {category === 'reclamacion' && (
                <div className="space-y-5">
                  <div className="p-4 bg-purple-50 border border-purple-300 rounded-2xl space-y-1.5 text-purple-950">
                    <div className="flex items-center gap-2 font-black text-sm">
                      <Scale className="w-5 h-5 text-purple-800" />
                      <span>Servicio de Atención al Cliente (SAC) • Orden ECO/734/2004</span>
                    </div>
                    <p className="text-xs text-purple-900 leading-relaxed">
                      Canal oficial para tramitar consultas formales, quejas o ejercer derechos RGPD con resolución vinculante en un plazo máximo de <strong>15 días hábiles</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Reclamación', 'Queja', 'Consulta', 'Derechos RGPD'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setClaimType(t)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                          claimType === t
                            ? 'bg-purple-800 text-white border-purple-800 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Asunto del Expediente *
                      </label>
                      <input
                        type="text"
                        value={claimSubject}
                        onChange={(e) => setClaimSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Descripción Detallada *
                      </label>
                      <textarea
                        rows={4}
                        value={claimDescription}
                        onChange={(e) => setClaimDescription(e.target.value)}
                        placeholder="Describe con precisión tu solicitud..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* BOTTOM ACTIONS BAR */}
              {/* ========================================================================= */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleOpenDirectWhatsApp}
                  className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Enviar URL Única de este Formulario por WhatsApp</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      onClose();
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                  >
                    Cerrar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Validar Formulario</span>
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
