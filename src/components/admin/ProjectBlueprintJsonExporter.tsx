import React, { useState } from 'react';
import { PROJECT_MASTER_BLUEPRINT_JSON } from '../../data/projectMasterBlueprintData';
import {
  FileJson,
  Download,
  Copy,
  Check,
  Volume2,
  VolumeX,
  BookOpen,
  ShieldCheck,
  Users,
  FileText,
  Sparkles,
  CheckCircle2,
  Eye,
  Code
} from 'lucide-react';

export const ProjectBlueprintJsonExporter: React.FC = () => {
  const [viewMode, setViewMode] = useState<'both' | 'json_code' | 'visual_cards'>('both');
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const jsonFormattedString = JSON.stringify(PROJECT_MASTER_BLUEPRINT_JSON, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonFormattedString);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadJsonFile = () => {
    const blob = new Blob([jsonFormattedString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'instacredit_espana_master_blueprint.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSpeakSummary = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const text =
      `Archivo JSON Maestro del Proyecto Instacredit España. ` +
      `Intención principal: ${PROJECT_MASTER_BLUEPRINT_JSON.intencion_esencia_y_filosofia.intencion_principal} ` +
      `Esencia del sistema: ${PROJECT_MASTER_BLUEPRINT_JSON.intencion_esencia_y_filosofia.esencia_del_sistema} ` +
      `Incluye 7 perfiles completos de clientes en España, 6 contratos y documentos oficiales, 5 formularios asistidos por voz, catálogo de URLs de fotos de WhatsApp y todos los ganchos comerciales y rebate de objeciones.`;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES';
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B1B3D] via-[#112A63] to-[#0055FF] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00E599] text-[#0B1B3D] text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                <FileJson className="w-3.5 h-3.5" />
                Archivo .JSON Maestro del Proyecto • Arquitectura y Biblia Completa
              </span>
              <span className="bg-white/15 text-blue-100 text-xs font-bold px-3 py-0.5 rounded-full">
                Listo para Descargar o Copiar en 1 Clic
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Blueprint Maestro (.JSON): Intención, Esencia, Documentos, Casos, Fotos URLs y Ganchos para España
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Este archivo <code>instacredit_espana_master_blueprint.json</code> contiene toda la estructura, lógica, normativa española, perfiles de todo tipo de clientes, documentos legales, formularios con voz, URLs de fotos y ganchos comerciales para capacitar desde cero a tus empleados y replicar o alimentar tu ecosistema.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadJsonFile}
              className="px-5 py-3 rounded-2xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>📥 Descargar Archivo .JSON Maestro</span>
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>¡JSON Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#00E599]" />
                  <span>📋 Copiar Todo el Código .JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSpeakSummary}
              className="px-4 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {speaking ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#00E599]" />}
              <span>{speaking ? 'Detener Voz' : '🔊 Escuchar Resumen en Voz Alta'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap gap-2">
          {[
            { id: 'both', label: '👁️‍🗨️ Ver Tarjetas Explicativas + Código .JSON Completo' },
            { id: 'json_code', label: '💻 Ver Solo el Archivo .JSON Puro' },
            { id: 'visual_cards', label: '📚 Ver Resumen Visual Didáctico' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setViewMode(m.id as 'both' | 'json_code' | 'visual_cards')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                viewMode === m.id
                  ? 'bg-[#00E599] text-[#0B1B3D]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* VISUAL SUMMARY CARDS */}
      {(viewMode === 'both' || viewMode === 'visual_cards') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Intención y Esencia */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0066FF]">
              <Sparkles className="w-4 h-4" />
              <span>1. Intención, Esencia y Filosofía del Proyecto</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {PROJECT_MASTER_BLUEPRINT_JSON.intencion_esencia_y_filosofia.intencion_principal}
            </p>
            <div className="space-y-2">
              {PROJECT_MASTER_BLUEPRINT_JSON.intencion_esencia_y_filosofia.pilares_didacticos_para_empleados_sin_capacitacion.map(
                (pilar, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold"
                  >
                    {pilar}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Card 2: Los 7 Perfiles de Clientes y Ganchos en España */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-700">
              <Users className="w-4 h-4" />
              <span>2. Todos los Casos y Perfiles de Personas en España (7 Perfiles)</span>
            </div>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {PROJECT_MASTER_BLUEPRINT_JSON.tipologia_completa_de_clientes_y_casos_en_espana.map(
                (perf) => (
                  <div
                    key={perf.id_perfil}
                    className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 text-xs"
                  >
                    <div className="font-black text-[#0B1B3D]">{perf.titulo}</div>
                    <div className="text-emerald-900">
                      <strong>🎣 Gancho:</strong> {perf.gancho_comercial}
                    </div>
                    <div className="text-slate-600">
                      <strong>⚡ Qué hace el asesor:</strong> {perf.que_debe_hacer_el_asesor}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* RAW JSON CODE VIEWER & COPY BLOCK */}
      {(viewMode === 'both' || viewMode === 'json_code') && (
        <div className="bg-[#0B1B3D] rounded-3xl border border-blue-900 shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-slate-950/60 border-b border-blue-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00E599]">
              <Code className="w-4 h-4" />
              <span>/public/instacredit_espana_master_blueprint.json</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJsonFile}
                className="px-3.5 py-1.5 rounded-xl bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D] text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .JSON</span>
              </button>
            </div>
          </div>

          <pre className="p-6 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[650px] overflow-y-auto leading-relaxed">
            {jsonFormattedString}
          </pre>
        </div>
      )}
    </div>
  );
};
