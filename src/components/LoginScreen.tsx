import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Lock, 
  ShieldCheck, 
  Building, 
  Home, 
  Sprout, 
  Shield, 
  ArrowRight, 
  Fingerprint, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { user, login, theme, formatMoney, totalExpectedMonthlyIncome, incomeStreams } = useFinance();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (login(pin)) {
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (login(nextPin)) {
          setError(false);
        } else {
          setError(true);
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleQuickDemoUnlock = () => {
    login('1234');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="pt-6 text-center space-y-3 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
          <ShieldCheck size={14} />
          <span>FlowGuard Enterprise Vault</span>
        </div>

        {/* Avatar & Profile */}
        <div className="pt-2 flex flex-col items-center space-y-2">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-glow-green">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full rounded-[22px] object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-2xl font-black tracking-tight text-white">
                {user.avatarText}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              <span>{user.name}</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{user.role}</p>
          </div>
        </div>

        {/* Business Portfolios Tag Bar */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-1 max-w-xs mx-auto">
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700 font-semibold flex items-center gap-1">
            <Shield size={10} /> Security Co (100k)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-indigo-300 border border-slate-700 font-semibold flex items-center gap-1">
            <Home size={10} /> Lonjo Rentals (50k)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-emerald-300 border border-slate-700 font-semibold flex items-center gap-1">
            <Building size={10} /> Real Estate (50k)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-lime-300 border border-slate-700 font-semibold flex items-center gap-1">
            <Sprout size={10} /> Tea Farm (20k)
          </span>
        </div>
      </div>

      {/* Center PIN Authentication */}
      <div className="my-auto py-4 text-center space-y-4 z-10 max-w-xs mx-auto w-full">
        <div>
          <div className="text-xs font-bold text-slate-300 mb-2">Enter Secure Access PIN</div>
          
          {/* PIN Dots Display */}
          <div className="flex justify-center items-center gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  pin.length > idx
                    ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-glow-green'
                    : error
                    ? 'border-rose-500 bg-rose-500/20'
                    : 'border-slate-600 bg-slate-800/40'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-bold mt-2 animate-bounce">
              Incorrect PIN. (Default: 1234)
            </p>
          )}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeypadPress(digit)}
              className="h-14 rounded-2xl bg-slate-850/80 hover:bg-slate-750 active:scale-95 border border-slate-750 text-xl font-bold text-white transition-all shadow-md flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          
          {/* Quick Unlock */}
          <button
            type="button"
            onClick={handleQuickDemoUnlock}
            className="h-14 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all flex flex-col items-center justify-center gap-0.5"
            title="One-Tap Unlock"
          >
            <Fingerprint size={18} />
            <span className="text-[9px]">Unlock</span>
          </button>

          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="h-14 rounded-2xl bg-slate-850/80 hover:bg-slate-750 active:scale-95 border border-slate-750 text-xl font-bold text-white transition-all shadow-md flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-850/80 hover:bg-slate-750 active:scale-95 border border-slate-750 text-xs font-bold text-slate-300 transition-all shadow-md flex items-center justify-center"
          >
            Del
          </button>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="pb-4 text-center space-y-2 z-10">
        <button
          onClick={handleQuickDemoUnlock}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-95 active:scale-[0.98] transition"
        >
          <span>Continue as Benard Cheruiyot (PIN: 1234)</span>
          <ArrowRight size={14} />
        </button>

        <p className="text-[10px] text-slate-500">
          Managing 4 Monthly Income Streams totaling <strong className="text-emerald-400 font-bold">{formatMoney(totalExpectedMonthlyIncome)}</strong>
        </p>
      </div>
    </div>
  );
};
