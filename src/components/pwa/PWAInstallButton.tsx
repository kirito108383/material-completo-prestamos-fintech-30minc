import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, ShieldCheck, Monitor, Info } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'hero' | 'portal';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // If already running as an installed PWA, hide or show pill
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold border border-emerald-500/20">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>PWA Instalada</span>
      </span>
    );
  }

  // Chromium / Android / Desktop standard install event
  if (isInstallable) {
    if (variant === 'hero') {
      return (
        <button
          onClick={install}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
        >
          <Download className="w-4 h-4" />
          <span>Instalar App PWA en tu dispositivo</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00E599] px-3 py-1.5 text-xs font-black text-[#0B1B3D] shadow-xs hover:opacity-95 transition cursor-pointer"
        title="Instalar como aplicación en tu móvil o PC"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50/80 px-3 py-1.5 text-xs font-bold text-[#0066FF] hover:bg-blue-100 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0066FF] text-white flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B1B3D]">Instalar en iPhone / iPad</h3>
                    <p className="text-[10px] text-slate-500">Acceso directo en pantalla de inicio</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[11px] font-black shrink-0">1</span>
                  <span>Pulsa el botón de <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en Safari.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[11px] font-black shrink-0">2</span>
                  <span>Selecciona <strong>&quot;Añadir a pantalla de inicio&quot;</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[11px] font-black shrink-0">3</span>
                  <span>Pulsa <strong>&quot;Añadir&quot;</strong>. ¡Tu cuenta estará disponible en 1 toque!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback modal guide without window.alert
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/90 hover:bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs transition cursor-pointer"
        title="Instalar App Instacredit España"
      >
        <Download className="w-3.5 h-3.5 text-[#0066FF]" />
        <span>Instalar PWA</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0066FF] text-white flex items-center justify-center font-bold">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0B1B3D]">Instalar Instacredit España</h3>
                  <p className="text-[10px] text-slate-500">App web progresiva instalable</p>
                </div>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Info className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                <span>
                  <strong>En Chrome / Edge (PC o Mac):</strong> Haz clic en el icono de instalación <strong>⊕</strong> situado en el extremo derecho de la barra de direcciones del navegador.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>En Android:</strong> Abre el menú de tres puntos de tu navegador y pulsa en <strong>&quot;Instalar aplicación&quot;</strong>.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowDesktopGuide(false)}
              className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
