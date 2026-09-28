import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Sparkles, 
  ShieldCheck, 
  PieChart, 
  Flame, 
  Zap, 
  Boxes, 
  ArrowRight, 
  Sliders, 
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';

export const IncomeFlowView: React.FC = () => {
  const { 
    envelopes, 
    allocationPresets, 
    formatMoney, 
    setIsIncomeModalOpen, 
    setPendingIncomeAmount,
    currency
  } = useFinance();

  const [simulatedIncome, setSimulatedIncome] = useState<number>(3000);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-50-30-20');

  const selectedPreset = allocationPresets.find(p => p.id === selectedPresetId) || allocationPresets[0];

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Hero Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Income Flow Blueprint
              </h2>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Automatic Paycheck Distribution
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPendingIncomeAmount(simulatedIncome);
              setIsIncomeModalOpen(true);
            }}
            className="py-1.5 px-3 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black shadow-glow-green hover:bg-emerald-400 transition"
          >
            Distribute Now
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          The secret to financial freedom is assigning every incoming dollar to a specific envelope <em>the second it hits your bank</em> before daily temptations eat it away.
        </p>
      </div>

      {/* Interactive Paycheck Flow Simulator */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders size={14} className="text-emerald-400" />
            <span>Paycheck Routing Simulator</span>
          </label>
          <span className="text-[10px] text-slate-400">Live preview</span>
        </div>

        {/* Input box */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">When you receive:</span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-emerald-400">{currency.symbol}</span>
            <input
              type="number"
              value={simulatedIncome}
              onChange={(e) => setSimulatedIncome(Math.max(0, parseFloat(e.target.value) || 0))}
              className="bg-transparent text-lg font-black text-white focus:outline-none w-28 text-right"
            />
          </div>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-2 gap-2">
          {allocationPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`p-2.5 rounded-2xl border text-left transition relative ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-950/40 border-emerald-500 text-white'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="text-xs font-bold text-slate-200">{preset.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{preset.description}</div>
            </button>
          ))}
        </div>

        {/* Breakdown Output */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Predicted Split Destinations:
          </div>

          <div className="space-y-2">
            {selectedPreset.splits.map((split, idx) => {
              const allocated = (simulatedIncome * split.percentage) / 100;
              return (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">{split.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold">({split.percentage}%)</span>
                  </div>
                  <div className="text-xs font-black text-emerald-400">
                    +{formatMoney(allocated)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            setPendingIncomeAmount(simulatedIncome);
            setIsIncomeModalOpen(true);
          }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 hover:opacity-95 transition"
        >
          <Lock size={14} />
          <span>Apply Allocation to Vaults</span>
        </button>
      </div>

      {/* Active Envelopes Summary */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Active Digital Vaults</span>
          <span className="text-[10px] text-emerald-400 font-bold">{envelopes.length} Buckets Ready</span>
        </div>

        <div className="space-y-2">
          {envelopes.map((env) => (
            <div key={env.id} className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: env.color + '22', color: env.color }}
                >
                  <DynamicIcon name={env.icon} className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{env.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{env.group}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-white">{formatMoney(env.currentAmount)}</div>
                <div className="text-[10px] text-slate-400">Target: {formatMoney(env.targetAmount)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
