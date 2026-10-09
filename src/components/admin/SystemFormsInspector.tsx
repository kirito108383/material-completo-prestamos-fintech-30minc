import React, { useState } from 'react';
import {
  FileText,
  Sliders,
  User,
  Briefcase,
  Building,
  KeyRound,
  ShieldAlert,
  Wallet,
  ArrowUpRight,
  Star,
  CheckCircle2,
  Info,
  Code2,
  Eye,
  ExternalLink,
  Sparkles,
  Landmark,
  Scale,
  Calendar,
  Zap,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPANISH_BANKS, COUNTRIES_OF_RESIDENCE } from '../../data/initialData';
import { formatEUR } from '../../utils/financialCalculations';

interface FormSchemaItem {
  fieldName: string;
  label: string;
  type: string;
  required: boolean;
  validationRule: string;
  description: string;
}

interface FormDefinition {
  id: string;
  number: string;
  title: string;
  category: 'Solicitud' | 'Banca Digital' | 'Regulatorio' | 'Fidelización' | 'Flexibilidad';
  purpose: string;
  intention: string;
  objective: string;
  legalNorm: string;
  channel: string;
  fields: FormSchemaItem[];
}

export const SystemFormsInspector: React.FC = () => {
  const {
    openApplicationModal,
    openPqrsModal,
    openReviewModal,
    openUserBankPortal,
    openDidacticForm
  } = useApp();

  const [selectedFormId, setSelectedFormId] = useState<string>('form-simulator');
  const [activeTabMode, setActiveTabMode] = useState<'vista' | 'esquema'>('vista');

  const forms: FormDefinition[] = [
    {
      id: 'form-simulator',
      number: 'FORM-01',
      title: 'Simulador de Crédito y Desglose Precontractual (INE / BdE)',
      category: 'Solicitud',
      purpose: 'Permite al cliente simular el importe y plazo del micropréstamo, calculando en tiempo real todas las partidas legales antes de contratar.',
      intention: 'Captación inicial de demanda crediticia con transparencia absoluta de costes.',
      objective: 'Cálculo en vivo de cuota, TIN (1,95%), TAE (26,8%), aval FGA (10%) y custodia eIDAS.',
      legalNorm: 'Ley 16/2011 (Crédito al Consumo) Art. 10 y 11 - Información normalizada europea precontractual',
      channel: 'Web Pública Landing • Modal Interactivo • Widget PWA',
      fields: [
        { fieldName: 'capital', label: 'Importe de Capital Solicitado', type: 'Range Slider / Number', required: true, validationRule: 'Min 100 €, Max 3.000 € en pasos de 50 €', description: 'Capital líquido que se desembolsará.' },
        { fieldName: 'termDays', label: 'Plazo en Días (15, 30, 60 o 90)', type: 'Radio / Selector', required: true, validationRule: 'Debe ser 15, 30, 60 o 90 días', description: 'Tiempo pactado para amortización de capital e intereses.' },
        { fieldName: 'dailyRate', label: 'Tipo de Interés Nominal (TIN)', type: 'Calculated (0.065% diario / 1.95% TIN)', required: true, validationRule: 'Fijada dentro de límites supervisados por el Banco de España', description: 'Equivalente al 26.8% TAE transparente.' },
        { fieldName: 'fgaGuaranteeRate', label: 'Aval de Garantía Europeo (10%)', type: 'Calculated (10%)', required: true, validationRule: '10% del capital financiado', description: 'Fondo de Garantías para evitar requerir avalistas solidarios.' },
        { fieldName: 'technologyAndSignature', label: 'Firma Digital eIDAS y Plataforma', type: 'Fixed (18,50 €)', required: true, validationRule: 'Tarifa fija contractual', description: 'Custodia notarial y token de firma Reglamento eIDAS.' },
        { fieldName: 'ivaAmount', label: 'IVA Régimen General (21%)', type: 'Calculated (21%)', required: true, validationRule: '21% sobre Aval + Tecnología', description: 'Impuesto sobre el valor añadido en España.' }
      ]
    },
    {
      id: 'form-personal',
      number: 'FORM-02',
      title: 'Identificación Fehaciente, DNI/NIE y Residencia (RGPD)',
      category: 'Solicitud',
      purpose: 'Identificación fehaciente del solicitante, validación de DNI/NIE y comprobación de residencia continuada en España.',
      intention: 'Prevención de suplantación de identidad y verificación de arraigo legal en España.',
      objective: 'Cotejo de DNI/NIE válido mediante algoritmo oficial módulo 23 y datos de contacto directos.',
      legalNorm: 'Reglamento General de Protección de Datos (RGPD UE 2016/679) y LOPDGDD 3/2018',
      channel: 'Onboarding Digital • WhatsApp Asistido por Asesor',
      fields: [
        { fieldName: 'documentType', label: 'Tipo de Documento Oficial', type: 'Select (DNI | NIE | Pasaporte)', required: true, validationRule: 'DNI español o NIE comunitario/no comunitario en vigor', description: 'Documento acreditativo de identidad.' },
        { fieldName: 'documentNumber', label: 'Número de Identificación', type: 'Text (8 dígitos + letra o X/Y/Z)', required: true, validationRule: 'Algoritmo módulo 23 para DNI/NIE español', description: 'Número identificativo oficial en España.' },
        { fieldName: 'countryOfResidence', label: 'País de Residencia', type: 'Select (España u otro)', required: true, validationRule: 'Debe residir en territorio español', description: 'Garantiza residencia legal para extranjeros.' },
        { fieldName: 'documentExpiryDate', label: 'Fecha de Caducidad del Documento', type: 'Date', required: true, validationRule: 'Debe estar en vigor', description: 'Control antifraude de caducidad.' },
        { fieldName: 'firstName', label: 'Nombre Completo', type: 'Text', required: true, validationRule: 'Mínimo 2 caracteres, solo letras', description: 'Nombre según documento oficial.' },
        { fieldName: 'lastName', label: 'Apellidos', type: 'Text', required: true, validationRule: 'Mínimo 2 caracteres, solo letras', description: 'Apellidos según DNI/NIE.' },
        { fieldName: 'phone', label: 'Teléfono Móvil (+34)', type: 'Tel (+34)', required: true, validationRule: '9 dígitos iniciando en 6 o 7', description: 'Línea donde se remitirá el código SMS OTP.' },
        { fieldName: 'email', label: 'Correo Electrónico', type: 'Email', required: true, validationRule: 'Formato de correo válido', description: 'Canal de entrega de contratos eIDAS.' }
      ]
    },
    {
      id: 'form-economic',
      number: 'FORM-03',
      title: 'Scoring de Solvencia, Ingresos Demostrables y Finalidad',
      category: 'Solicitud',
      purpose: 'Evaluación de capacidad de pago, actividad laboral, provincia de residencia y motivo de financiación.',
      intention: 'Concesión de crédito responsable y prevención de sobreendeudamiento familiar.',
      objective: 'Análisis de solvencia neta mensual y destino ético de los fondos.',
      legalNorm: 'Normativa Banco de España sobre evaluación de solvencia y crédito responsable',
      channel: 'Paso 3 Solicitud • Revisión por Asesor',
      fields: [
        { fieldName: 'province', label: 'Provincia de Residencia', type: 'Select (España)', required: true, validationRule: 'Provincia dentro del territorio español', description: 'Madrid, Barcelona, Valencia, Sevilla, etc.' },
        { fieldName: 'city', label: 'Municipio / Ciudad', type: 'Text / Select', required: true, validationRule: 'Municipio español', description: 'Ubicación física del domicilio.' },
        { fieldName: 'address', label: 'Dirección Completa', type: 'Text', required: true, validationRule: 'Calle, número, piso y puerta', description: 'Domicilio para notificaciones contractuales.' },
        { fieldName: 'occupation', label: 'Situación Laboral / Ocupación', type: 'Select', required: true, validationRule: 'Indefinido | Temporal | Autónomo | Funcionario | Pensionista', description: 'Fuente demostrable de ingresos.' },
        { fieldName: 'monthlyIncome', label: 'Ingresos Mensuales Netos (€ EUR)', type: 'Currency Number', required: true, validationRule: 'Mínimo 600 € mensuales demostrables', description: 'Nómina, pensión o facturación de autónomos.' },
        { fieldName: 'loanPurpose', label: 'Motivo del Préstamo *', type: 'Select (8 Categorías)', required: true, validationRule: 'Obligatorio', description: 'Reformas, Salud, Vehículo, Autónomos, Gastos familiares.' }
      ]
    },
    {
      id: 'form-banking',
      number: 'FORM-04',
      title: 'Titularidad Bancaria e IBAN (Antifraude SEPBLAC)',
      category: 'Banca Digital',
      purpose: 'Validación de la cuenta bancaria de destino para prevenir el blanqueo de capitales y asegurar que los fondos vayan al titular.',
      intention: 'Cumplimiento normativo estricto contra el fraude y blanqueo de capitales.',
      objective: 'Certificación jurada de que el IBAN pertenece al titular del DNI y habilitación de Bizum.',
      legalNorm: 'Ley 10/2010 de Prevención del Blanqueo de Capitales (SEPBLAC) y Circular 5/2012 BdE',
      channel: 'Formulario Didáctico 2 • Enlace Directo WhatsApp',
      fields: [
        { fieldName: 'bankName', label: 'Entidad Bancaria Española', type: 'Select (16 Entidades)', required: true, validationRule: 'Santander, BBVA, CaixaBank, Sabadell, ING, etc.', description: 'Banco donde se transferirá el saldo solicitado.' },
        { fieldName: 'iban', label: 'Código Internacional IBAN (ES...)', type: 'Text (24 caracteres)', required: true, validationRule: 'IBAN español que inicia en ES + 22 dígitos', description: 'Identificador único de cuenta SEPA.' },
        { fieldName: 'isOwnerCertified', label: 'Declaración de Titularidad Única', type: 'Checkbox (Obligatorio)', required: true, validationRule: 'True', description: 'Certificación jurada de titularidad bajo apercibimiento legal.' },
        { fieldName: 'bizumPayout', label: 'Abono Exprés por Bizum', type: 'Checkbox', required: false, validationRule: 'Teléfono asociado', description: 'Desembolso instantáneo al teléfono móvil.' }
      ]
    },
    {
      id: 'form-signature',
      number: 'FORM-05',
      title: 'Firma Digital de Pagaré eIDAS y Consentimiento ASNEF',
      category: 'Regulatorio',
      purpose: 'Perfeccionamiento del contrato de crédito y suscripción del pagaré notarial desmaterializado mediante código OTP SMS y rúbrica.',
      intention: 'Formalización de título ejecutivo contractual con plena validez judicial.',
      objective: 'Captura de rúbrica digital en pantalla + token 2FA por SMS conforme a Reglamento UE.',
      legalNorm: 'Reglamento (UE) Nº 910/2014 (eIDAS) sobre identificación electrónica y servicios de confianza',
      channel: 'Firma Electrónica eIDAS • Formulario Didáctico 3',
      fields: [
        { fieldName: 'signatureCanvas', label: 'Rúbrica Trazada en Pantalla', type: 'Canvas Vectorial', required: true, validationRule: 'Trazado gráfico no vacío', description: 'Firma manuscrita digitalizada.' },
        { fieldName: 'otpCode', label: 'Código de Firma OTP SMS (6 dígitos)', type: 'Security Code', required: true, validationRule: '6 dígitos numéricos recibidos en el móvil', description: 'Firma electrónica cualificada avanzada.' },
        { fieldName: 'asnefConsent', label: 'Consentimiento Consulta ASNEF / CIRBE', type: 'Checkbox', required: true, validationRule: 'True', description: 'Autorización expresa para consultar ficheros de solvencia.' }
      ]
    },
    {
      id: 'form-prorroga',
      number: 'FORM-06',
      title: 'Solicitud de Aplazamiento, Prórroga y Flexibilidad',
      category: 'Flexibilidad',
      purpose: 'Ampliación voluntaria del plazo de devolución para clientes con incidencias de liquidez, sin intereses de demora usureros.',
      intention: 'Alivio financiero y código ético de buenas prácticas bancarias.',
      objective: 'Reprogramar fecha de vencimiento (+15, +30 o +45 días) manteniendo historial crediticio positivo.',
      legalNorm: 'Código de Buenas Prácticas Financieras y Ley 16/2011 de Contratos de Crédito',
      channel: 'Portal Asesor WhatsApp • Formulario Didáctico 4',
      fields: [
        { fieldName: 'extensionDays', label: 'Días Adicionales de Gracia', type: 'Selector (15 | 30 | 45 días)', required: true, validationRule: '15, 30 o 45 días', description: 'Tiempo extra concedido antes del cobro.' },
        { fieldName: 'newDueDate', label: 'Nueva Fecha Límite de Pago', type: 'Calculated Date', required: true, validationRule: 'Fecha futura proyectada', description: 'Nuevo vencimiento formal.' },
        { fieldName: 'extensionReason', label: 'Motivo del Aplazamiento', type: 'Select', required: true, validationRule: 'Demora nómina, imprevisto médico, etc.', description: 'Justificación del cliente.' },
        { fieldName: 'extensionFee', label: 'Tasa Regulada de Gestión', type: 'Currency Number', required: true, validationRule: 'Tasa administrativa reducida', description: 'Sin penalizaciones abusivas ni usura.' }
      ]
    },
    {
      id: 'form-pqrs',
      number: 'FORM-07',
      title: 'Servicio de Atención al Cliente (SAC & Banco de España)',
      category: 'Regulatorio',
      purpose: 'Recepción formal de reclamaciones, quejas y consultas con plazo de resolución legal de 15 días hábiles.',
      intention: 'Garantía fehaciente de los derechos del consumidor financiero.',
      objective: 'Registro con número de radicado oficial y resolución motivada por escrito.',
      legalNorm: 'Orden ECO/734/2004 y Circular 5/2012 del Banco de España sobre departamentos de atención al cliente',
      channel: 'Modal SAC • Reclamaciones Oficiales • Formulario Didáctico 5',
      fields: [
        { fieldName: 'type', label: 'Tipo de Comunicación', type: 'Select', required: true, validationRule: 'Reclamación | Queja | Consulta | Derechos RGPD', description: 'Categorización de la solicitud ante el SAC.' },
        { fieldName: 'applicantName', label: 'Nombre Completo del Cliente', type: 'Text', required: true, validationRule: 'Mínimo 3 caracteres', description: 'Identificación del reclamante.' },
        { fieldName: 'documentNumber', label: 'DNI / NIE / Pasaporte', type: 'Text', required: true, validationRule: 'Documento oficial en España', description: 'Cotejo del expediente del consumidor.' },
        { fieldName: 'subject', label: 'Asunto de la Reclamación', type: 'Text', required: true, validationRule: 'Mínimo 5 caracteres', description: 'Resumen conciso del motivo.' },
        { fieldName: 'description', label: 'Descripción Detallada de los Hechos', type: 'Textarea', required: true, validationRule: 'Mínimo 20 caracteres', description: 'Exposición pormenorizada de los hechos reclamados.' }
      ]
    }
  ];

  const currentForm = forms.find(f => f.id === selectedFormId) || forms[0];

  const handleLaunchLiveForm = (formId: string) => {
    if (formId === 'form-pqrs') {
      openPqrsModal();
    } else if (formId === 'form-banking') {
      openDidacticForm();
    } else if (formId === 'form-signature') {
      openDidacticForm();
    } else if (formId === 'form-prorroga') {
      openDidacticForm();
    } else {
      openApplicationModal();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1B3D] text-white p-6 rounded-3xl shadow-lg border border-blue-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              Auditoría y Catálogo Técnico de Formularios
            </span>
            <span className="bg-white/10 text-xs font-semibold px-2 py-0.5 rounded-full text-slate-200">
              España • Banco de España
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Formularios del Sistema con Identidad Propia</h2>
          <p className="text-xs text-blue-100 max-w-2xl mt-1 leading-relaxed">
            Cada formulario ha sido adaptado con una identidad visual, tipología de campos, audio-guía pedagógica y fundamentación legal diferenciada según el caso, intención y objetivo operativo.
          </p>
        </div>

        <div className="bg-blue-900/40 border border-blue-700/50 p-4 rounded-2xl text-xs space-y-1 shrink-0 w-full md:w-auto">
          <div className="font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#00E599]" />
            Inventario Certificado
          </div>
          <div className="text-[11px] text-blue-200">
            • {forms.length} Formularios con identidad propia<br />
            • Validación estricta DNI/NIE y SEPBLAC<br />
            • Firma digital eIDAS & Prórrogas éticas
          </div>
        </div>
      </div>

      {/* Forms Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {forms.map((f) => {
          const isSelected = f.id === selectedFormId;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFormId(f.id)}
              className={`p-3 rounded-2xl text-left transition cursor-pointer border flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/20'
                  : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1 ${
                  isSelected ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {f.number}
                </span>
                <h4 className="text-xs font-black text-[#0B1B3D] line-clamp-2">
                  {f.title}
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
                {f.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Selected Form Inspector Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Top Details & Mode Toggle */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                {currentForm.number}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{currentForm.category}</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                Canal: {currentForm.channel}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
              {currentForm.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{currentForm.purpose}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleLaunchLiveForm(currentForm.id)}
              className="px-4 py-2 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Abrir este formulario en pantalla completa con sus campos interactivos"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Probar Formulario en Vivo</span>
            </button>

            <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold">
              <button
                onClick={() => setActiveTabMode('vista')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                  activeTabMode === 'vista' ? 'bg-white text-[#0B1B3D] shadow-xs' : 'text-slate-600'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Campos</span>
              </button>
              <button
                onClick={() => setActiveTabMode('esquema')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                  activeTabMode === 'esquema' ? 'bg-white text-[#0B1B3D] shadow-xs' : 'text-slate-600'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Intention & Objective Cards (Identidad Diferenciada) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#0066FF]">
              <Target className="w-4 h-4" />
              <span>Caso & Intención de este Formulario:</span>
            </div>
            <p className="text-slate-700 leading-snug">{currentForm.intention}</p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Objetivo Operativo Concreto:</span>
            </div>
            <p className="text-slate-700 leading-snug">{currentForm.objective}</p>
          </div>
        </div>

        {/* Legal norm pill */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-slate-700">
            <strong className="text-[#0B1B3D]">Fundamento Jurídico en España:</strong>{' '}
            <span>{currentForm.legalNorm}</span>
          </div>
        </div>

        {/* View Mode: Fields Table */}
        {activeTabMode === 'vista' && (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Campo / Variable</th>
                  <th className="p-3.5">Etiqueta UI</th>
                  <th className="p-3.5">Tipo de Dato</th>
                  <th className="p-3.5">Obligatorio</th>
                  <th className="p-3.5">Regla de Validación</th>
                  <th className="p-3.5">Finalidad Legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {currentForm.fields.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-mono text-[#0066FF] font-bold">{f.fieldName}</td>
                    <td className="p-3.5 font-bold text-slate-900">{f.label}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {f.type}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {f.required ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Sí
                        </span>
                      ) : (
                        <span className="text-slate-400">Opcional</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-700">{f.validationRule}</td>
                    <td className="p-3.5 text-slate-500 text-[11px]">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Schema Mode: JSON representation */}
        {activeTabMode === 'esquema' && (
          <div className="bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner">
            <pre>
              {JSON.stringify(
                {
                  formId: currentForm.id,
                  formTitle: currentForm.title,
                  caseIntention: currentForm.intention,
                  operationalObjective: currentForm.objective,
                  jurisdiction: 'Reino de España (BdE)',
                  applicableLaw: currentForm.legalNorm,
                  schemaVersion: '2026.1-ES',
                  properties: currentForm.fields.reduce((acc, curr) => {
                    return {
                      ...acc,
                      [curr.fieldName]: {
                        label: curr.label,
                        type: curr.type,
                        required: curr.required,
                        rule: curr.validationRule,
                        description: curr.description
                      }
                    };
                  }, {})
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
