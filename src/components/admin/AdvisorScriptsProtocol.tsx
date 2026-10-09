import React, { useState } from 'react';
import {
  MessageSquare,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Award,
  Sparkles,
  HelpCircle,
  Clock,
  Send,
  AlertTriangle,
  UserCheck,
  FileSpreadsheet,
  Headphones,
  Smartphone
} from 'lucide-react';

interface ScriptScenario {
  id: string;
  category: 'llamada' | 'whatsapp' | 'objeciones' | 'cobranza';
  title: string;
  triggerContext: string;
  scriptText: string;
  advisorGuidelines: string[];
  complianceNotes: string;
}

export const AdvisorScriptsProtocol: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'llamada' | 'whatsapp' | 'objeciones' | 'cobranza'>('llamada');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scripts: ScriptScenario[] = [
    {
      id: 'sc-1',
      category: 'llamada',
      title: '1. Bienvenida y Validación de Solicitud Inicial',
      triggerContext: 'Cuando un cliente radica una nueva solicitud en la web y queda en estado "Pendiente" o "En Revisión".',
      scriptText: `[ASESOR]: "¡Muy buenos días/tardes! Me comunico con don/doña [NOMBRE DEL CLIENTE]. Le saluda [NOMBRE DEL ASESOR], especialista de vinculación de INSTACREDIT España Fintech S.L. ¿Cómo se encuentra el día de hoy?"

[CLIENTE]: "[Respuesta del cliente]"

[ASESOR]: "Me alegra saludarle. El motivo de mi llamada es darle la bienvenida formal y confirmar los datos de su solicitud de micropréstamo online radicada bajo el expediente #[RADICADO_ID] por importe de [MONTO_EUR] €. ¿Dispone de un par de minutos para validar su identidad conforme a la normativa del Banco de España?"

[VALIDACIONES OBLIGATORIAS]:
1. Confirmar número de DNI o NIE y fecha de caducidad.
2. Confirmar país de procedencia y residencia continuada en España.
3. Confirmar que la cuenta bancaria [BANCO_DEL_CLIENTE] está a su nombre exclusivo para la prevención de blanqueo de capitales (SEPBLAC).
4. Preguntar amablemente el motivo del préstamo para validar coherencia de riesgo.

[CIERRE]: "Muchas gracias por verificar sus datos. Su expediente pasa a formalización inmediata. En breves minutos recibirá un SMS con su código OTP para la firma digital eIDAS de su pagaré notarial, y los fondos estarán acreditados en su Cuenta Digital IBAN."`,
      advisorGuidelines: [
        'Voz calmada, dicción profesional y tono empático.',
        'No apresurar al usuario al dictar su DNI/NIE o IBAN.',
        'Registrar en la bitácora interna cualquier observación relevante sobre su situación de residencia.'
      ],
      complianceNotes: 'Reglamentado por la Ley 16/2011 de Contratos de Crédito al Consumo y Ley 10/2010 de Prevención del Blanqueo de Capitales (SEPBLAC).'
    },
    {
      id: 'sc-2',
      category: 'llamada',
      title: '2. Explicación de la Cuenta Digital IBAN con Saldo en 0,00 €',
      triggerContext: 'Cuando el cliente pregunta por qué su cuenta dice saldo en 0,00 € o cómo retirar su dinero una vez aprobado.',
      scriptText: `[ASESOR]: "Con mucho gusto le aclaro cómo funciona su cuenta, don/doña [APELLIDO]. Al crear su perfil en INSTACREDIT España, el sistema le asigna de manera automática una Cuenta Digital IBAN independiente española, la cual inicia por defecto con saldo en 0,00 € por estricta transparencia contable europea."

[ASESOR CONTINÚA]: "En el momento exacto en que nuestro analista de riesgos aprueba su crédito, la totalidad de los fondos aprobados ([MONTO_APROBADO_EUR] €) se depositan como saldo líquido disponible en su cuenta. Desde allí usted tiene dos opciones sumamente sencillas:
1. Transferir el dinero a su cuenta bancaria externa habitual ([BANCO_USUARIO]) mediante Transferencia SEPA Instantánea, la cual se abona en menos de 15 segundos sin comisión alguna.
2. O mantener el saldo en su cuenta para realizar pagos directos."`,
      advisorGuidelines: [
        'Aclarar que la cuenta no genera gastos de apertura ni cuotas de mantenimiento mensual.',
        'Hacer énfasis en la inmediatez de la red SEPA Instant del Banco Central Europeo.',
        'Ofrecer asistencia paso a paso si el cliente está conectado desde el móvil.'
      ],
      complianceNotes: 'Transparencia de servicios de pago regulada por el Real Decreto-ley 19/2018 de servicios de pago (PSD2).'
    },
    {
      id: 'sc-3',
      category: 'whatsapp',
      title: '3. Plantilla WhatsApp: Notificación de Radicación y Desembolso',
      triggerContext: 'Mensaje que el asesor envía al móvil del cliente vía WhatsApp corporativo verificado tras registrarse.',
      scriptText: `*INSTACREDIT España • Notificación Oficial* 🇪🇸

¡Hola, *[NOMBRE_CLIENTE]*! 🚀 Tu solicitud de préstamo online en *INSTACREDIT España* ha sido radicada formalmente bajo el expediente *#[RADICADO_ID]*.

💶 Importe Solicitado: *[MONTO_EUR] €*
📅 Plazo de Devolución: *[PLAZO_DIAS] días*
🎯 Finalidad Declarada: *[MOTIVO_PRESTAMO]*
🏦 Cuenta IBAN Asignada: *[IBAN_DIGITAL]*

El saldo de tu Cuenta Digital Instacredit ahora está listo para recibir el desembolso tras la firma digital cualificada eIDAS.

Para revisar tus 4 contratos legales o firmar tu pagaré con el token SMS recibido, accede a tu área privada:
👉 [ENLACE_WEB_CLIENTE]

Si tienes alguna duda, responde directamente a este mensaje y un asesor te atenderá al instante.

_INSTACREDIT ESPAÑA FINTECH S.L. - Supervisado Banco de España & Ley 16/2011._`,
      advisorGuidelines: [
        'Solo enviar desde números corporativos autorizados de la empresa.',
        'Personalizar siempre los campos entre corchetes antes de enviar.',
        'Mantener el formato en negrita con asteriscos de WhatsApp para óptima legibilidad.'
      ],
      complianceNotes: 'Cumplimiento del Reglamento General de Protección de Datos (RGPD UE 2016/679) con consentimiento previo de comunicaciones electrónicas.'
    },
    {
      id: 'sc-4',
      category: 'whatsapp',
      title: '4. Plantilla WhatsApp: Desembolso Acreditado y Vía Bizum',
      triggerContext: 'Cuando el analista pulsa "Desembolsar Fondos" y el saldo del cliente pasa de 0,00 € al importe aprobado.',
      scriptText: `*¡ENHORABUENA, [NOMBRE_CLIENTE]! FONDOS DISPONIBLES* 💰🎉

Te confirmamos que tu micropréstamo *#[RADICADO_ID]* por valor de *[MONTO_APROBADO_EUR] €* ha sido acreditado exitosamente.

Tu saldo disponible en tu Cuenta Digital IBAN es de: *[SALDO_DISPONIBLE] €*.

Ya puedes:
1️⃣ Transferirlo a tu banco habitual por *Transferencia SEPA Inmediata* (abono en 10 segundos).
2️⃣ Pagar puntualmente tu cuota antes del *[FECHA_VENCIMIENTO]* por *Bizum* al número corporativo oficial.

Amortizar puntualmente te permite:
✅ Aumentar tu línea de financiación de 2.000 € hasta 100.000 €.
✅ Mantener un historial crediticio 100% positivo ante ASNEF y Banco de España.
✅ Atención prioritaria de tu asesor personal con respuesta en menos de 30 minutos.

Portal de Cliente: [ENLACE_PORTAL]`,
      advisorGuidelines: [
        'Enviar en cuanto se verifique el estado "Desembolsado".',
        'Recordar la opción de Bizum para que el cliente tenga máxima facilidad de amortización.'
      ],
      complianceNotes: 'Notificación contractual fehaciente según artículo 16 de la Ley 16/2011.'
    },
    {
      id: 'sc-5',
      category: 'objeciones',
      title: '5. Matriz de Manejo de Objeciones: Trayectoria, Respaldo y Seguridad',
      triggerContext: 'Cliente que pregunta sobre la solidez de la entidad, seguridad jurídica o rapidez del desembolso.',
      scriptText: `[OBJECIÓN]: "¿Qué garantías y trayectoria tiene INSTACREDIT España para confiar mi solicitud?"

[RESPUESTA DEL ASESOR]: "Comprendo perfectamente su interés, don/doña [APELLIDO]. En INSTACREDIT España contamos con más de 12 años de trayectoria continuada en el mercado financiero español y más de 150.000 operaciones formalizadas con total satisfacción. Operamos bajo el estricto amparo de la Ley 16/2011 de Contratos de Crédito al Consumo y las directrices de transparencia del Banco de España. No le exigimos avalistas solidarios ni hipotecas, y le garantizamos una respuesta personalizada en un máximo de 30 minutos. Sus fondos se abonan de inmediato en su Cuenta Digital protegida con firma electrónica cualificada eIDAS (Reglamento UE Nº 910/2014)."`,
      advisorGuidelines: [
        'Transmitir total serenidad, confianza y orgullo por la trayectoria de la compañía.',
        'Hacer hincapié en los más de 12 años de experiencia y la garantía de atención en máximo 30 minutos.',
        'Recordar que cada cliente cuenta con un asesor humano asignado.'
      ],
      complianceNotes: 'Transparencia institucional y protección del consumidor financiero bajo Circular 5/2012 del Banco de España.'
    },
    {
      id: 'sc-6',
      category: 'objeciones',
      title: '6. Matriz de Objeciones: Extranjeros y Validez del NIE',
      triggerContext: 'Solicitante extranjero que tiene dudas sobre si puede pedir crédito con NIE comunitario, no comunitario o pasaporte.',
      scriptText: `[OBJECIÓN]: "Soy extranjero con NIE/TIE, ¿puedo acceder al préstamo?"

[RESPUESTA DEL ASESOR]: "Por supuesto, don/doña [APELLIDO]. En INSTACREDIT España promovemos la inclusión financiera de la comunidad extranjera residente. Admitimos solicitudes con NIE Comunitario de la Unión Europea, NIE de Régimen General (tarjeta TIE) o Pasaporte con autorización de estancia y residencia fiscal demostrable en España. El único requisito indispensable es disponer de una cuenta bancaria con IBAN español abierta a su mismo nombre y una fuente de ingresos acreditada en territorio nacional (nómina, contrato temporal o indefinido, o alta de autónomos)."`,
      advisorGuidelines: [
        'Verificar que el documento TIE no esté caducado o conste con resguardo de prórroga en vigor.',
        'Comprobar la titularidad del IBAN en un banco español participante en el sistema SEPA.'
      ],
      complianceNotes: 'No discriminación conforme al artículo 14 de la Constitución Española y normativa europea de libre prestación de servicios financieros.'
    },
    {
      id: 'sc-7',
      category: 'cobranza',
      title: '7. Protocolo de Cobranza Preventiva y Negociación Respetuosa',
      triggerContext: 'Contacto con el cliente 3 días antes del vencimiento o en situación de mora temprana (1-5 días).',
      scriptText: `[ASESOR]: "Buenos días, don/doña [NOMBRE DEL CLIENTE]. Le saluda [NOMBRE DEL ASESOR] del departamento de soluciones de cartera de INSTACREDIT España. Me comunico dentro de la franja horaria hábil para consultarle sobre su crédito expediente #[RADICADO_ID], cuya cuota de [MONTO_CUOTA] € vence/ha vencido el [FECHA_VENCIMIENTO]. ¿Ha tenido algún imprevisto para realizar el abono?"

[CLIENTE]: "[Explica su situación económica actual]"

[ASESOR]: "Le comprendemos con total cercanía y nuestro objetivo es ayudarle a conservar su expediente limpio ante ASNEF y Banco de España. Para su tranquilidad, disponemos de dos alternativas inmediatas:
1. Una prórroga voluntaria del plazo por 15 o 30 días adicionales pagando únicamente el interés devengado.
2. Un abono parcial inmediato por Bizum o tarjeta para evitar costes de reclamación de deuda.
¿Cuál de las dos opciones le resulta más conveniente para activar hoy mismo?"`,
      advisorGuidelines: [
        'Tono rigurosamente respetuoso, constructivo y libre de amenazas.',
        'Jamás divulgar la deuda a terceros, familiares o compañeros de trabajo.',
        'Horarios estrictos: lunes a viernes de 9:00 a 20:00 h. Prohibido contactar festivos.'
      ],
      complianceNotes: 'Código de buenas prácticas de gestión de deuda de la Asociación Española de Fintech (AEFI) y Ley de Consumidores y Usuarios.'
    }
  ];

  const filteredScripts = scripts.filter((s) => s.category === activeCategory);

  const handleCopyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1B3D] text-white p-6 rounded-3xl shadow-lg border border-blue-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#00E599]/20 text-[#00E599] border border-emerald-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" />
              Guiones y Libretos de Asesoría Oficial
            </span>
            <span className="bg-white/10 text-xs font-semibold px-2 py-0.5 rounded-full text-slate-200">
              España • Banco de España & eIDAS
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Libretos de Retroalimentación y Protocolos de Asesor</h2>
          <p className="text-xs text-blue-100 max-w-2xl mt-1 leading-relaxed">
            Estructuras verbales estandarizadas para llamadas de vinculación, plantillas de WhatsApp corporativo, gestión de objeciones sobre TAE/avales y protocolo de cobranza preventiva.
          </p>
        </div>

        <div className="bg-blue-900/40 border border-blue-700/50 p-4 rounded-2xl text-xs space-y-1.5 shrink-0 w-full md:w-auto">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#00E599]" />
            Rúbrica de Auditoría de Calidad
          </div>
          <div className="text-[11px] text-blue-200">
            • 7 Guiones estandarizados<br />
            • Cumplimiento RGPD y Ley 16/2011<br />
            • Canales: Teléfono (+34), WhatsApp y Bizum
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('llamada')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeCategory === 'llamada'
              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Llamadas Telefónicas (+34)</span>
        </button>

        <button
          onClick={() => setActiveCategory('whatsapp')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeCategory === 'whatsapp'
              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp y SMS Corporativo</span>
        </button>

        <button
          onClick={() => setActiveCategory('objeciones')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeCategory === 'objeciones'
              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>Manejo de Objeciones (TAE / NIE)</span>
        </button>

        <button
          onClick={() => setActiveCategory('cobranza')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeCategory === 'cobranza'
              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Cobranza Preventiva & Respetuosa</span>
        </button>
      </div>

      {/* Script Cards Grid */}
      <div className="space-y-6">
        {filteredScripts.map((sc) => (
          <div key={sc.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#0B1B3D]">{sc.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  <strong>Momento de aplicación:</strong> {sc.triggerContext}
                </p>
              </div>

              <button
                onClick={() => handleCopyScript(sc.id, sc.scriptText)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copiedId === sc.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {copiedId === sc.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Libreto</span>
                  </>
                )}
              </button>
            </div>

            {/* Script Text Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {sc.scriptText}
            </div>

            {/* Guidelines & Compliance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
                <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider block">
                  Reglas de Oro para el Asesor:
                </span>
                <ul className="space-y-1 text-slate-700">
                  {sc.advisorGuidelines.map((g, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">
                  Sustento Legal y Cumplimiento Regulatorio:
                </span>
                <p className="text-amber-950 font-medium">{sc.complianceNotes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
