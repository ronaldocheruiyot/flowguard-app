import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobileSimulator } = useFinance();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isMobileSimulator) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col shadow-2xl transition-colors overflow-x-hidden relative border-x border-slate-200/60 dark:border-slate-800/80">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 transition-colors w-full overflow-x-hidden">
      {/* Phone Outer Chassis */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:shadow-mobile overflow-hidden relative flex flex-col min-h-screen sm:min-h-[850px] sm:max-h-[920px] transition-colors">
        
        {/* Dynamic Island / Notch & Top Status Bar */}
        <div className="bg-slate-100 dark:bg-slate-900 px-5 pt-3 pb-2 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 select-none z-40 border-b border-slate-200 dark:border-slate-800/40 shrink-0">
          <span className="font-bold text-xs tracking-tight">{currentTime}</span>
          
          {/* Simulated Dynamic Island Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black rounded-full text-[10px] text-emerald-400 font-semibold border border-slate-700 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>FlowGuard Active</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Signal size={12} />
            <Wifi size={12} />
            <BatteryMedium size={14} className="text-emerald-500 dark:text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors w-full">
          {children}
        </div>

        {/* Home Indicator Bar (iOS Style) */}
        <div className="hidden sm:flex justify-center pb-2 pt-1 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850 shrink-0">
          <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600/70 rounded-full" />
        </div>
      </div>
    </div>
  );
};
