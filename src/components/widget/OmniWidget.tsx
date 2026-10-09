import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageCircle,
  X,
  Phone,
  Search,
  FileCheck,
  Clock,
  Sparkles,
  Send,
  HelpCircle,
  Headphones,
  Wallet,
  ShieldCheck,
  Smartphone,
  Volume2
} from 'lucide-react';

export const OmniWidget: React.FC = () => {
  const {
    platformConfig,
    openLookupModal,
    openPqrsModal,
    openUserBankPortal,
    openUserLoginModal,
    openDidacticForm,
    triggerChatBubbleOpenNotice,
    currentUser
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '¡Hola! Te damos la bienvenida a INSTACREDIT España. ¿En qué podemos asesorarte hoy sobre tu micropréstamo, Bizum o Cuenta Digital IBAN?',
      time: 'Ahora'
    }
  ]);
  const [userMsgInput, setUserMsgInput] = useState('');

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      // Dispatches real-time notification to admin and customer service advisors!
      triggerChatBubbleOpenNotice(currentUser?.fullName || 'Visitante Web');
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsgInput.trim()) return;

    const userText = userMsgInput;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setUserMsgInput('');

    // Also trigger notification about the client query to admin & advisors
    triggerChatBubbleOpenNotice(currentUser ? `${currentUser.fullName} (${userText.slice(0, 30)}...)` : `Usuario web: "${userText.slice(0, 30)}..."`);

    setTimeout(() => {
      let botReply = 'Con gusto te oriento. En INSTACREDIT recibes tus fondos por Bizum o Transferencia SEPA Instantánea en menos de 15 minutos tras la firma digital cualificada eIDAS.';
      const lower = userText.toLowerCase();

      if (lower.includes('cuenta') || lower.includes('saldo') || lower.includes('iban') || lower.includes('banco')) {
        botReply = 'Cada usuario dispone de una Cuenta Digital IBAN española independiente que inicia con saldo en 0,00 € hasta que recibas tu desembolso o realices una recarga con Bizum o Tarjeta. Puedes acceder desde "Mi Cuenta IBAN".';
      } else if (lower.includes('pagar') || lower.includes('bizum') || lower.includes('cuota') || lower.includes('tarjeta')) {
        botReply = 'Puedes amortizar tu préstamo cómodamente: (1) Con cargo directo al saldo de tu Cuenta Digital; (2) Instantáneamente por Bizum al teléfono de la plataforma; o (3) Con tarjeta bancaria de débito o crédito.';
      } else if (lower.includes('radicado') || lower.includes('tiquete') || lower.includes('estado') || lower.includes('solicitud')) {
        botReply = 'Puedes rastrear tu expediente INSTA-ES-XXXXXX en cualquier momento pulsando el botón "Tiquete" o buscando por tu DNI/NIE en la barra superior.';
      } else if (lower.includes('tasa') || lower.includes('interes') || lower.includes('tae') || lower.includes('tin')) {
        botReply = 'Nuestra tasa está regulada conforme a la Ley 16/2011 de Contratos de Crédito al Consumo y supervisada por el Banco de España: 1.95% mensual nominal (26.8% TAE transparente).';
      } else if (lower.includes('extranjero') || lower.includes('nie') || lower.includes('pasaporte') || lower.includes('residencia')) {
        botReply = '¡Sí! Admitimos extranjeros residentes legales en España con NIE comunitario, NIE no comunitario o pasaporte con autorización de estancia y residencia fiscal en el territorio español.';
      } else if (lower.includes('asesor') || lower.includes('humano') || lower.includes('telefono') || lower.includes('hablar')) {
        botReply = `Hemos notificado a nuestro equipo de asesores en Madrid. También puedes llamar a la línea gratuita ${platformConfig.phoneNational} o escribirnos por WhatsApp directo.`;
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply, time: timeStr }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Omni Modal */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B1B3D] via-[#0E2452] to-[#0055FF] text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-[#00E599] flex items-center justify-center font-bold">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">Asesoría INSTACREDIT España</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse"></span>
                  <span>Equipo en línea • Responde en 2 min</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-300 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Buttons Bar */}
          <div className="bg-blue-50/70 p-2 border-b border-blue-100 grid grid-cols-4 gap-1 text-[10px] font-bold shrink-0">
            <button
              onClick={() => {
                setIsOpen(false);
                openUserBankPortal();
              }}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex flex-col items-center justify-center text-center transition cursor-pointer border border-emerald-200"
            >
              <Wallet className="w-4 h-4 text-emerald-600 mb-0.5" />
              <span>Mi IBAN</span>
            </button>

            <a
              href={platformConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 flex flex-col items-center justify-center text-center border border-slate-200 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${platformConfig.phoneNational}`}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 flex flex-col items-center justify-center text-center border border-slate-200 transition"
            >
              <Phone className="w-4 h-4 text-[#0066FF] mb-0.5" />
              <span>Llamar</span>
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                openLookupModal();
              }}
              className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-[#0066FF] flex flex-col items-center justify-center text-center transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#0066FF] mb-0.5" />
              <span>Tiquete</span>
            </button>
          </div>

          {/* Accessible Form Helper Banner */}
          <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200/80 flex items-center justify-between text-[11px]">
            <span className="text-amber-900 font-semibold flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>¿Ayuda visual o lectura?</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openDidacticForm();
              }}
              className="font-bold text-[#0066FF] hover:underline cursor-pointer"
            >
              Formulario con Voz →
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#0066FF] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendChat} className="p-2.5 bg-white border-t border-slate-200 flex gap-2 shrink-0">
            <input
              type="text"
              value={userMsgInput}
              onChange={(e) => setUserMsgInput(e.target.value)}
              placeholder="Pregunta sobre préstamos, Bizum o tu cuenta..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
            />
            <button
              type="submit"
              className="p-2 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer of widget with attention hours */}
          <div className="px-3 py-2 bg-slate-100 text-[10px] text-slate-500 border-t border-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#0066FF]" />
              <span>{platformConfig.businessHoursWeekdays}</span>
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                openPqrsModal();
              }}
              className="text-[#0066FF] font-bold hover:underline cursor-pointer"
            >
              Reclamaciones SAC
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleToggle}
        className="w-14 h-14 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer group active:scale-95"
        aria-label="Abrir asistente de ayuda Instacredit España"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00E599] border-2 border-white animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};
