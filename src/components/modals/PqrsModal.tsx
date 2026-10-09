import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PqrsRecord } from '../../types';
import { X, FileCheck, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react';

export const PqrsModal: React.FC = () => {
  const { isPqrsModalOpen, closePqrsModal, addPqrsRecord } = useApp();

  const [applicantName, setApplicantName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<PqrsRecord['type']>('Consulta');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [submittedRadicado, setSubmittedRadicado] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isPqrsModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!applicantName.trim() || !documentNumber.trim() || !email.trim() || !subject.trim() || !description.trim()) {
      setErrorMsg('Por favor rellena todos los campos obligatorios para tramitar la reclamación formal.');
      return;
    }

    const radicado = addPqrsRecord({
      applicantName,
      documentNumber,
      email,
      phone: phone.startsWith('+34') ? phone : `+34 ${phone}`,
      type,
      subject,
      description
    });

    setSubmittedRadicado(radicado);
  };

  const handleClose = () => {
    setSubmittedRadicado(null);
    closePqrsModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full my-auto overflow-hidden border border-slate-200 relative flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#00E599]" />
            <h3 className="font-extrabold text-base">Servicio de Atención al Cliente (SAC) • INSTACREDIT</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {submittedRadicado ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  ¡Reclamación Registrada con Éxito!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Tu expediente ha sido registrado en el Servicio de Atención al Cliente de INSTACREDIT conforme a la Orden ECO/734/2004 y normativa del Banco de España.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 inline-block text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Número de Expediente SAC</span>
                <span className="text-xl font-black text-[#0B1B3D]">{submittedRadicado}</span>
                <div className="text-[11px] text-slate-600 mt-1">
                  Plazo legal máximo de resolución: <strong>15 días hábiles</strong>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hemos enviado acuse de recibo y copia de tu solicitud al correo <strong>{email}</strong>.
              </p>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Entendido y Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
                Conforme a la Orden ECO/734/2004 y la Ley 7/2017 de resolución alternativa de litigios, resolveremos tu solicitud en un plazo máximo de quince (15) días hábiles.
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Ej. Carmen Navarro Serrano"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">DNI o NIE *</label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                    placeholder="Ej. 52918234M"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carmen.navarro@gmail.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Móvil (+34)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="612345678"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Trámite *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="Consulta">Consulta (Información o certificado de deuda cero)</option>
                    <option value="Queja">Queja (Inconformidad con la atención o asesor)</option>
                    <option value="Reclamación">Reclamación (Liquidación, cuotas o cobro)</option>
                    <option value="Sugerencia">Sugerencia de Mejora</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asunto *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ej. Certificado de extinción de deuda tras pago"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción Detallada *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe detalladamente los hechos, fechas o número de expediente relacionado..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Registrar Reclamación Formal ante el SAC
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
