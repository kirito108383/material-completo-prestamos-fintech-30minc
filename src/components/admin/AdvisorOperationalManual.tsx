import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Printer,
  Sparkles,
  HelpCircle,
  Compass,
  Award,
  Layers,
  MessageCircle,
  Copy,
  Check,
  XCircle,
  Play,
  RefreshCw
} from 'lucide-react';
import {
  LOAN_FLOW_VISUAL_STEPS,
  GOLDEN_RULES_TRAFFIC_LIGHT,
  BEGINNER_GLOSSARY,
  INTERACTIVE_SCENARIOS,
  ADVISOR_ONBOARDING_QUIZ
} from '../../data/advisorTrainingData';

type TrainingModuleTab =
  | 'paso_a_paso_cero'
  | 'reglas_semaforo'
  | 'diccionario_visual'
  | 'simulador_casos'
  | 'normativa_bde'
  | 'test_evaluacion';

export const AdvisorOperationalManual: React.FC = () => {
  const [activeModule, setActiveModule] = useState<TrainingModuleTab>('paso_a_paso_cero');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(INTERACTIVE_SCENARIOS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const speakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = speechRate;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakCurrentModuleOverview = () => {
    const fullText =
      'Bienvenido a la Guía Instructiva Auditiva y Visual para Asesores de Instacredit España. ' +
      'Aunque empieces desde cero y no tengas experiencia previa en finanzas, aquí aprenderás paso a paso todo lo que debes saber y hacer. ' +
      LOAN_FLOW_VISUAL_STEPS.map((s) => s.audioScript).join(' ') +
      ' ' +
      GOLDEN_RULES_TRAFFIC_LIGHT.map((r) => r.audioScript).join(' ');
    speakText('full-course-audio', fullText);
  };

  const activeScenario =
    INTERACTIVE_SCENARIOS.find((s) => s.id === selectedScenarioId) || INTERACTIVE_SCENARIOS[0];

  const correctQuizCount = ADVISOR_ONBOARDING_QUIZ.filter(
    (q) => quizAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP BANNER: ACADEMIA AUDITIVA, VISUAL Y DIDÁCTICA DESDE CERO */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1B3D] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/60 print:bg-white print:text-black print:border-b-2 print:border-black print:rounded-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                Guía Auditiva, Visual y Didáctica • Para Empleados Desde Cero
              </span>
              <span className="bg-white/10 text-xs font-semibold px-2.5 py-0.5 rounded-full text-blue-200">
                Normativa España (BdE, Ley 16/2011 & SEPBLAC)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Manual Instructivo del Asesor: Todo lo que Debes Saber y Hacer
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Diseñado especialmente para que <strong>cualquier asesor nuevo aprenda desde cero sin conocimientos previos</strong>. Pulsa los botones de <strong>🔊 Altavoz</strong> para escuchar las explicaciones en voz alta, revisa los semáforos visuales de reglas y practica con casos reales.
            </p>
          </div>

          {/* Audio Instructor & Print Controls */}
          <div className="flex flex-col gap-2.5 shrink-0 print:hidden">
            <button
              type="button"
              onClick={speakCurrentModuleOverview}
              className={`px-5 py-3 rounded-2xl font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                speakingId === 'full-course-audio'
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-[#00E599] hover:bg-emerald-400 text-[#0B1B3D]'
              }`}
            >
              {speakingId === 'full-course-audio' ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Detener Instructor de Voz</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>🔊 Escuchar Curso Rápido en Audio</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between gap-2 bg-blue-950/80 px-3 py-2 rounded-xl border border-blue-800 text-xs">
              <span className="text-blue-200 font-bold">Velocidad de Voz:</span>
              <div className="flex gap-1">
                {[0.9, 1.0, 1.15].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeechRate(rate)}
                    className={`px-2 py-0.5 rounded-md font-bold text-[11px] cursor-pointer ${
                      speechRate === rate ? 'bg-[#0066FF] text-white' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#00E599]" />
              <span>🖨️ Imprimir Guía Instructiva (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6 VISUAL MODULE SELECTOR TABS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 print:hidden">
        {[
          {
            id: 'paso_a_paso_cero',
            step: 'MÓDULO 1',
            title: '¿Cómo Funciona? (De Cero)',
            icon: Compass,
            color: 'text-blue-600'
          },
          {
            id: 'reglas_semaforo',
            step: 'MÓDULO 2',
            title: 'Semáforo de Reglas de Oro',
            icon: ShieldCheck,
            color: 'text-emerald-600'
          },
          {
            id: 'diccionario_visual',
            step: 'MÓDULO 3',
            title: 'Diccionario Sin Tecnicismos',
            icon: BookOpen,
            color: 'text-purple-600'
          },
          {
            id: 'simulador_casos',
            step: 'MÓDULO 4',
            title: '¿Qué Hago Si...? (Simulador)',
            icon: MessageCircle,
            color: 'text-amber-600'
          },
          {
            id: 'normativa_bde',
            step: 'MÓDULO 5',
            title: 'Leyes de España y Derechos',
            icon: Scale,
            color: 'text-indigo-600'
          },
          {
            id: 'test_evaluacion',
            step: 'MÓDULO 6',
            title: 'Test Rápido del Asesor',
            icon: Award,
            color: 'text-rose-600'
          }
        ].map((mod) => {
          const IconComponent = mod.icon;
          const isSelected = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setActiveModule(mod.id as TrainingModuleTab)}
              className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/20'
                  : 'bg-white/80 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {mod.step}
                </span>
                <IconComponent className={`w-4 h-4 ${mod.color}`} />
              </div>
              <div className="text-xs font-black text-[#0B1B3D] leading-snug">{mod.title}</div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MÓDULO 1: ¿CÓMO FUNCIONA EL PRÉSTAMO PASO A PASO? (DESDE CERO) */}
      {/* ========================================================================= */}
      {activeModule === 'paso_a_paso_cero' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase text-[#0066FF]">
                Módulo 1 • Explicación Visual y Auditiva Desde Cero
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
                Las 5 Etapas de un Préstamo: ¿Qué ve el Cliente y Qué haces Tú?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sigue el orden del 1 al 5. Pulsa el botón de voz en cada tarjeta para escuchar qué debes hacer en tu pantalla.
              </p>
            </div>
            {speakingId && (
              <button
                type="button"
                onClick={stopSpeech}
                className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <VolumeX className="w-4 h-4" />
                <span>Detener Audio</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {LOAN_FLOW_VISUAL_STEPS.map((step) => {
              const audioKey = `flow-step-${step.stepNumber}`;
              return (
                <div
                  key={step.stepNumber}
                  className={`p-5 rounded-2xl border-2 ${step.colorClass} transition space-y-3`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-2xl bg-[#0B1B3D] text-white font-black text-base flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-[#0B1B3D]">
                        {step.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakText(audioKey, step.audioScript)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer print:hidden ${
                        speakingId === audioKey
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-[#0B1B3D] text-white hover:bg-blue-900'
                      }`}
                    >
                      {speakingId === audioKey ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Detener</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#00E599]" />
                          <span>🔊 Escuchar Paso {step.stepNumber}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="bg-white/90 p-3.5 rounded-xl border border-black/10 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">
                        1. ¿Qué significa en lenguaje sencillo?
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {step.simpleExplanation}
                      </p>
                    </div>

                    <div className="bg-white/90 p-3.5 rounded-xl border border-black/10 space-y-1">
                      <span className="text-[10px] font-black uppercase text-[#0066FF] block">
                        2. ¿Qué verás tú en el ordenador?
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {step.whatAdvisorSeesInSystem}
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border-2 border-emerald-500/40 space-y-1">
                      <span className="text-[10px] font-black uppercase text-emerald-700 block">
                        3. ¿Qué debes hacer tú exactamente?
                      </span>
                      <p className="text-xs text-emerald-950 leading-relaxed font-bold">
                        {step.whatAdvisorMustDo}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO 2: SEMÁFORO VISUAL DE LAS REGLAS DE ORO (PERMITIDO VS PROHIBIDO) */}
      {/* ========================================================================= */}
      {activeModule === 'reglas_semaforo' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-black uppercase text-emerald-600">
              Módulo 2 • Semáforo de Conducta Obligatoria
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
              Las 4 Reglas de Oro del Asesor: 🟢 Qué Hacer vs. 🔴 Qué está Prohibido
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Todo empleado debe memorizar y respetar este semáforo desde su primer día de trabajo.
            </p>
          </div>

          <div className="space-y-6">
            {GOLDEN_RULES_TRAFFIC_LIGHT.map((rule) => (
              <div
                key={rule.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#0B1B3D] text-[#00E599] font-black text-xs">
                      REGLA DE ORO #{rule.ruleNumber}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[#0B1B3D]">
                      {rule.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakText(rule.id, rule.audioScript)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer print:hidden ${
                      speakingId === rule.id
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-[#0066FF] text-white hover:bg-blue-700'
                    }`}
                  >
                    {speakingId === rule.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Detener Voz</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>🔊 Escuchar Regla</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 font-medium">
                  💡 <strong>Explicación sencilla:</strong> {rule.whyItMattersSimple}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GREEN LIGHT */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>🟢 LUZ VERDE: Lo que SIEMPRE debes hacer</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-950 list-disc pl-4 leading-relaxed font-medium">
                      {rule.greenDo.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>

                  {/* RED LIGHT */}
                  <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-red-900">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>🔴 LUZ ROJA: Terminantemente PROHIBIDO</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-red-950 list-disc pl-4 leading-relaxed font-medium">
                      {rule.redNeverDo.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  Respaldo Legal: {rule.legalReference}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO 3: DICCIONARIO VISUAL SIN TECNICISMOS */}
      {/* ========================================================================= */}
      {activeModule === 'diccionario_visual' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-black uppercase text-purple-600">
              Módulo 3 • Vocabulario Fácil para Empleados Nuevos
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
              Diccionario Visual sin Tecnicismos: ¿Qué significa cada palabra?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Si no sabes qué es IBAN, TAE, ASNEF o eIDAS, aquí tienes qué significa con ejemplos de la vida diaria y cómo explicárselo al cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BEGINNER_GLOSSARY.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                      {item.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          item.id,
                          `${item.term}. Significado sencillo: ${item.simpleMeaningForNewEmployee}. Cómo explicarlo al cliente: ${item.howToExplainToClient}`
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer print:hidden ${
                        speakingId === item.id
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{speakingId === item.id ? 'Detener' : '🔊 Escuchar'}</span>
                    </button>
                  </div>

                  <h4 className="text-base font-black text-[#0B1B3D]">{item.term}</h4>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>¿Qué es?:</strong> {item.simpleMeaningForNewEmployee}
                  </p>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    💡 <strong>Ejemplo fácil:</strong> {item.realLifeAnalogy}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-800">
                      💬 Qué decirle al cliente si pregunta:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.howToExplainToClient)}
                      className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer print:hidden"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === item.id ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium italic">
                    {item.howToExplainToClient}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO 4: SIMULADOR INTERACTIVO "¿QUÉ HAGO SI EL CLIENTE ME DICE...?" */}
      {/* ========================================================================= */}
      {activeModule === 'simulador_casos' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-black uppercase text-amber-600">
              Módulo 4 • Entrenador Práctico de Situaciones Reales
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
              Simulador Didáctico: ¿Qué Hago y Qué Botón Toco si el Cliente me Dice...?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Selecciona una de las 5 situaciones reales de la izquierda para ver exactamente qué botón pulsar en el sistema y qué responderle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left selector */}
            <div className="lg:col-span-5 space-y-2.5">
              {INTERACTIVE_SCENARIOS.map((scen, idx) => {
                const isSelected = scen.id === selectedScenarioId;
                return (
                  <button
                    key={scen.id}
                    type="button"
                    onClick={() => setSelectedScenarioId(scen.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-md'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="text-[10px] font-black uppercase text-[#00E599] mb-1">
                      SITUACIÓN REAL #{idx + 1} • {scen.clientMood}
                    </div>
                    <div className="text-xs font-bold leading-snug">{scen.clientSituation}</div>
                  </button>
                );
              })}
            </div>

            {/* Right solution card */}
            <div className="lg:col-span-7 bg-slate-50 rounded-3xl border-2 border-blue-200 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                  Estado del Cliente: {activeScenario.clientMood}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    speakText(
                      activeScenario.id,
                      `Situación: ${activeScenario.clientSituation}. Qué hacer en el sistema: ${activeScenario.systemButtonToClick}. Respuesta exacta al cliente: ${activeScenario.exactWordsToSay}`
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    speakingId === activeScenario.id
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-[#0066FF] text-white hover:bg-blue-700'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>
                    {speakingId === activeScenario.id
                      ? 'Detener Voz'
                      : '🔊 Escuchar Instrucción y Respuesta'}
                  </span>
                </button>
              </div>

              <h4 className="text-base font-black text-[#0B1B3D]">
                {activeScenario.clientSituation}
              </h4>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                <span className="font-black uppercase block text-[#0066FF]">
                  👀 1. Diagnóstico Rápido (Lo que debes entender):
                </span>
                <p>{activeScenario.visualDiagnosis}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
                <span className="font-black uppercase block text-purple-800">
                  🖱️ 2. ¿Qué botón debes tocar en tu pantalla?:
                </span>
                <p className="font-bold">{activeScenario.systemButtonToClick}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-xs sm:text-sm text-emerald-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase text-emerald-800 text-xs">
                    💬 3. Dilo o escríbelo exactamente así:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeScenario.id, activeScenario.exactWordsToSay)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-[11px] font-bold text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === activeScenario.id ? '¡Copiado!' : 'Copiar Respuesta'}</span>
                  </button>
                </div>
                <p className="font-medium leading-relaxed">{activeScenario.exactWordsToSay}</p>
              </div>

              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Error de principiante que debes evitar:</strong>{' '}
                  {activeScenario.mistakeToAvoid}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO 5: RESUMEN LEGAL DE ESPAÑA EXPLICADO FÁCIL */}
      {/* ========================================================================= */}
      {activeModule === 'normativa_bde' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-black uppercase text-indigo-600">
              Módulo 5 • Respaldo Legal en España
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
              Las 4 Leyes Españolas que Protegen al Cliente y a nuestra Empresa
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Mencionar estas leyes con seguridad transmite máxima seriedad institucional a cualquier cliente en España.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                law: 'Ley 16/2011 de Contratos de Crédito al Consumo',
                summary:
                  'Obliga a informar con total claridad de la cuota fija, garantiza el derecho del cliente a cancelar su préstamo en los primeros 14 días (desistimiento) y permite pagar antes de tiempo con 0% de comisión.',
                advisorPhrase:
                  '"Su contrato está protegido por la Ley 16/2011 de Crédito al Consumo de España: sin letra pequeña y con 0% de coste si decide liquidarlo antes."'
              },
              {
                law: 'Circular 5/2012 del Banco de España (Transparencia)',
                summary:
                  'Regula la transparencia bancaria en España y el Servicio de Atención al Cliente (SAC), que debe responder cualquier reclamación formal en máximo 15 días hábiles.',
                advisorPhrase:
                  '"Cumplimos con las normas de transparencia de la Circular 5/2012 del Banco de España."'
              },
              {
                law: 'Ley 10/2010 de Prevención del Blanqueo (SEPBLAC)',
                summary:
                  'Exige identificar al cliente con su DNI/NIE en color y verificar que la cuenta bancaria IBAN donde se envía el préstamo esté a su nombre exclusivo.',
                advisorPhrase:
                  '"Por la Ley 10/2010 antiblanqueo del SEPBLAC, solo podemos transferir los fondos a una cuenta donde usted sea el titular."'
              },
              {
                law: 'Reglamento Europeo (UE) Nº 910/2014 (Firma eIDAS)',
                summary:
                  'Otorga a la firma digital en pantalla del móvil con código SMS exactamente la misma validez jurídica que una firma manuscrita ante notario público.',
                advisorPhrase:
                  '"Su firma en la pantalla del móvil con código SMS está certificada bajo el Reglamento Europeo eIDAS con plena validez notarial."'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0066FF] uppercase">{item.law}</span>
                  <button
                    type="button"
                    onClick={() => speakText(`law-${i}`, `${item.law}. ${item.summary}. Frase para el asesor: ${item.advisorPhrase}`)}
                    className="px-2.5 py-1 bg-blue-100 text-[#0066FF] rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer print:hidden"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>🔊 Escuchar</span>
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{item.summary}</p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-emerald-900 font-semibold italic">
                  Frase lista para usar: {item.advisorPhrase}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO 6: TEST DE AUTOEVALUACIÓN RÁPIDA PARA EMPLEADOS NUEVOS */}
      {/* ========================================================================= */}
      {activeModule === 'test_evaluacion' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase text-rose-600">
                Módulo 6 • Comprueba si ya estás listo para atender clientes
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
                Test Didáctico de 5 Preguntas para Asesores Nuevos
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Marca la respuesta correcta en cada caso y pulsa &ldquo;Comprobar Respuestas&rdquo; para validar tu aprendizaje.
              </p>
            </div>

            {quizSubmitted && (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-black flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>
                  Resultado: {correctQuizCount} de {ADVISOR_ONBOARDING_QUIZ.length} aciertos
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {ADVISOR_ONBOARDING_QUIZ.map((q) => {
              const selectedOption = quizAnswers[q.id];
              const isCorrect = selectedOption === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-black text-[#0B1B3D]">{q.question}</h4>
                    <button
                      type="button"
                      onClick={() => speakText(q.id, q.question)}
                      className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-[10px] font-bold text-slate-700 shrink-0 cursor-pointer"
                    >
                      🔊 Leer
                    </button>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOption === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                            isChosen
                              ? 'bg-[#0066FF] text-white border-[#0066FF]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isChosen && <Check className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && selectedOption !== undefined && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-red-100 text-red-950 border border-red-300'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                      )}
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              className="px-6 py-3 bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Comprobar Mis Respuestas
            </button>

            <button
              type="button"
              onClick={() => {
                setQuizAnswers({});
                setQuizSubmitted(false);
              }}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reiniciar Test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
