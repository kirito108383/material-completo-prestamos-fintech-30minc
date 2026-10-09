import React, { useState } from 'react';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { Bell, BellRing, Check, ShieldAlert, Smartphone, X, Sparkles, Send } from 'lucide-react';

export const PushNotificationManager: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { permission, isSupported, requestPermission, sendPushNotification, isGranted } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [testingStatus, setTestingStatus] = useState<string | null>(null);

  if (!isSupported || dismissed) return null;

  const handleEnable = async () => {
    const success = await requestPermission();
    if (success) {
      sendPushNotification(
        '🔔 ¡Notificaciones PWA Activadas!',
        'A partir de ahora recibirás alertas en tiempo real sobre tu solicitud y respuestas de asesores.'
      );
    }
  };

  const handleTest = async () => {
    setTestingStatus('Enviando push...');
    const ok = await sendPushNotification(
      '🚀 INSTACREDIT: Estado Actualizado',
      'Tu microcrédito personal está en fase de formalización con firma eIDAS. Toca para ver detalles.'
    );
    if (ok) {
      setTestingStatus('¡Enviada!');
      setTimeout(() => setTestingStatus(null), 3000);
    } else {
      setTestingStatus('Permiso requerido');
      setTimeout(() => setTestingStatus(null), 3000);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isGranted ? (
          <button
            type="button"
            onClick={handleTest}
            title="Notificaciones activas. Haz clic para probar."
            className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>{testingStatus || 'Push Activo'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEnable}
            className="px-2.5 py-1 text-[11px] font-bold text-[#0066FF] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Activar Avisos</span>
          </button>
        )}
      </div>
    );
  }

  // If permission is already granted, show an unobtrusive badge with test button
  if (isGranted) {
    return (
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
            <BellRing className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-bold block">Notificaciones Push PWA Activas</span>
            <span className="text-[11px] text-emerald-800">
              Recibirás alertas en tu dispositivo cuando cambie el estado de tu crédito o responda tu asesor.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleTest}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] shrink-0 transition flex items-center gap-1 cursor-pointer"
        >
          <Send className="w-3 h-3" />
          <span>{testingStatus || 'Probar Alerta'}</span>
        </button>
      </div>
    );
  }

  // Banner asking for permission if default
  return (
    <div className="bg-gradient-to-r from-[#0B1B3D] via-[#102a63] to-[#0B1B3D] text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-blue-800 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0066FF] flex items-center justify-center text-white shrink-0 shadow-md">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm sm:text-base text-white">
                Activa las Notificaciones Push en Tiempo Real
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00E599] text-[#0B1B3D]">
                PWA SERVICE WORKER
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Recibe avisos inmediatos en tu móvil u ordenador cuando se apruebe tu crédito (de 2.000 € a 100.000 €), cuando lleguen los fondos o cuando tu asesor asignado te escriba.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={handleEnable}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span>Permitir Notificaciones</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cerrar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
