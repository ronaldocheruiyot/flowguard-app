import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Sparkles, 
  ShieldCheck, 
  PieChart, 
  Flame, 
  Zap, 
  Boxes, 
  CheckCircle2, 
  ArrowRight, 
  Info 
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';

export const IncomeAllocatorModal: React.FC = () => {
  const { 
    isIncomeModalOpen, 
    setIsIncomeModalOpen, 
    pendingIncomeAmount, 
    formatMoney, 
    envelopes, 
    allocationPresets, 
    executeIncomeAllocation, 
    accounts,
    currency
  } = useFinance();

  const [incomeAmount, setIncomeAmount] = useState<number>(pendingIncomeAmount || 2500);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-50-30-20');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'acc-1');

  // Custom percentages map
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});

  useEffect(() => {
    if (pendingIncomeAmount) {
      setIncomeAmount(pendingIncomeAmount);
    }
  }, [pendingIncomeAmount]);

  useEffect(() => {
    const preset = allocationPresets.find(p => p.id === selectedPresetId);
    if (preset) {
      const initialMap: Record<string, number> = {};
      
      // Default mapping based on presets
      if (selectedPresetId === 'preset-50-30-20') {
        initialMap['env-rent'] = 35;
        initialMap['env-groceries'] = 15;
        initialMap['env-emergency'] = 10;
        initialMap['env-investments'] = 10;
        initialMap['env-fun'] = 20;
        initialMap['env-dining'] = 10;
      } else if (selectedPresetId === 'preset-fire-saver') {
        initialMap['env-rent'] = 25;
        initialMap['env-groceries'] = 10;
        initialMap['env-investments'] = 50;
        initialMap['env-emergency'] = 10;
        initialMap['env-fun'] = 5;
      } else if (selectedPresetId === 'preset-debt-destroyer') {
        initialMap['env-rent'] = 35;
        initialMap['env-groceries'] = 15;
        initialMap['env-investments'] = 35; // used for debt payoff
        initialMap['env-fun'] = 15;
      } else {
        // Zero based default
        const count = envelopes.length || 1;
        const each = Math.floor(100 / count);
        envelopes.forEach(env => {
          initialMap[env.id] = each;
        });
      }
      setCustomSplits(initialMap);
    }
  }, [selectedPresetId, allocationPresets, envelopes]);

  if (!isIncomeModalOpen) return null;

  const totalPercentage = Object.values(customSplits).reduce((sum, val) => sum + (val || 0), 0);

  const handleSliderChange = (envId: string, value: number) => {
    setCustomSplits(prev => ({
      ...prev,
      [envId]: value
    }));
  };

  const handleConfirmAllocation = () => {
    const splitsToApply = Object.entries(customSplits).map(([envId, pct]) => ({
      envelopeId: envId,
      percentage: pct,
      amount: (incomeAmount * pct) / 100
    }));

    executeIncomeAllocation(incomeAmount, splitsToApply, selectedAccountId);
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'PieChart': return <PieChart className="w-5 h-5 text-emerald-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-rose-400" />;
      default: return <Boxes className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-lg p-5 sm:p-6 space-y-5 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Glow accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-10 bg-emerald-500/30 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Instant Income Dispatcher
              </h2>
              <p className="text-xs text-slate-400">
                Rule #1: Route your money immediately before it can leak!
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsIncomeModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 text-lg font-semibold rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Income Amount Input */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Incoming Funds Received
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-400">{currency.symbol}</span>
            <input
              type="number"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="bg-transparent text-2xl font-black text-white focus:outline-none w-full"
              placeholder="0.00"
            />
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/50">
            <span>Depositing into:</span>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="bg-slate-900 text-xs text-slate-200 rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} ({formatMoney(acc.balance)})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Allocation Strategy Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>Select Allocation Blueprint</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {allocationPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  selectedPresetId === preset.id
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-glow-green text-white'
                    : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getPresetIcon(preset.icon)}
                  <span className="text-xs font-bold leading-tight">{preset.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
                {selectedPresetId === preset.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Live Envelope Distribution Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>Envelope Distribution</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                totalPercentage === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {totalPercentage}% Allocated
              </span>
            </label>
            <span className="text-[11px] text-slate-400">
              Total: <strong className="text-white">{formatMoney(incomeAmount)}</strong>
            </span>
          </div>

          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {envelopes.map((env) => {
              const pct = customSplits[env.id] || 0;
              const allocatedDollars = (incomeAmount * pct) / 100;

              return (
                <div 
                  key={env.id} 
                  className="p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: env.color + '33', color: env.color }}
                      >
                        <DynamicIcon name={env.icon} className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-200">{env.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400">+{formatMoney(allocatedDollars)}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({pct}%)</span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={pct}
                      onChange={(e) => handleSliderChange(env.id, parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Protection Tip */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-[11px]">
          <Info size={16} className="shrink-0 text-cyan-400" />
          <span>
            Allocating immediately rings-fences your essentials and savings, preventing impulsive money loss!
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            onClick={handleConfirmAllocation}
            disabled={incomeAmount <= 0}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <ShieldCheck size={18} />
            <span>Lock & Distribute {formatMoney(incomeAmount)}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
