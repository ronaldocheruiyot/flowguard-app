import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running in standalone PWA / WebAPK mode
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    
    setIsStandalone(isRunningStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (isStandalone || dismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
        setDismissed(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Sleek Top/Bottom Install Pill Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-2.5 px-3 flex items-center justify-between shadow-xl my-2 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Smartphone size={16} />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Install FlowGuard App</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                PWA • WebAPK
              </span>
            </div>
            <div className="text-[10px] text-slate-300">
              Clean app icon in App Drawer (No Chrome badge)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-1"
          >
            <Download size={13} />
            <span>Install</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-slate-200 transition"
            title="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Guide Modal for Manual Add / WebAPK info */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck size={18} />
                <span>How to Install Pure Standalone App</span>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1">
                  <Sparkles size={14} />
                  <span>Eliminating the Small Chrome Badge:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Android mints a pure WebAPK without the Chrome logo when the app is installed from an HTTPS domain or via the Chrome install prompt.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-white text-[11px] uppercase tracking-wider">
                  Quick Steps on Android Phone:
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <li>Tap the <strong>three dots (⋮)</strong> at the top-right in Chrome.</li>
                  <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Android will build the standalone <strong>WebAPK</strong> and place the clean FlowGuard icon in your phone's App Drawer!</li>
                </ol>
              </div>

              <div className="space-y-1 text-[10px] text-slate-400">
                <span>💡 On iOS Safari: Tap <strong>Share (⬆️)</strong> ➔ <strong>"Add to Home Screen"</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
            >
              Got it, let's go!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
