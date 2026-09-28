import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Radar, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ArrowUpRight, 
  Flame, 
  HelpCircle, 
  TrendingUp, 
  Zap, 
  Repeat, 
  Coffee, 
  Tag, 
  AlertTriangle 
} from 'lucide-react';
import { LeakType } from '../types/finance';

export const LeakRadarView: React.FC = () => {
  const { 
    activeLeaks, 
    totalMonthlyLeakLoss, 
    totalYearlyLeakLoss, 
    formatMoney, 
    dismissLeak, 
    transactions,
    currency
  } = useFinance();

  const [filterType, setFilterType] = useState<string>('all');
  const [showSimulator, setShowSimulator] = useState(true);

  const filteredLeaks = activeLeaks.filter(leak => {
    if (filterType === 'all') return true;
    return leak.type === filterType;
  });

  // Calculate 5-year compounding wealth if leaks are plugged and invested at 8%
  const monthlySavings = totalMonthlyLeakLoss;
  const annualReturnRate = 0.08 / 12;
  const calculateCompoundSavings = (months: number) => {
    let total = 0;
    for (let i = 0; i < months; i++) {
      total = (total + monthlySavings) * (1 + annualReturnRate);
    }
    return total;
  };

  const fiveYearWealth = calculateCompoundSavings(60);

  const getLeakIcon = (type: LeakType) => {
    switch (type) {
      case 'zombie_subscription': return <Repeat className="w-5 h-5 text-purple-400" />;
      case 'micro_spending': return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'convenience_fee': return <Tag className="w-5 h-5 text-rose-400" />;
      case 'impulse_regret': return <Zap className="w-5 h-5 text-rose-500" />;
      case 'budget_burn': return <Flame className="w-5 h-5 text-orange-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-900 border border-rose-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <Radar size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                LeakRadar™ Intelligence
              </h2>
              <p className="text-[11px] text-rose-300/80 font-medium">
                Automated Financial Drain Detection
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            {activeLeaks.length} Active Drains
          </span>
        </div>

        {/* Big Drain Metric */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-rose-900/40">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Monthly Cash Bleed
            </div>
            <div className="text-xl font-black text-rose-400 mt-0.5">
              -{formatMoney(totalMonthlyLeakLoss)}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Annual Recoverable
            </div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              +{formatMoney(totalYearlyLeakLoss)}
              <span className="text-xs font-normal text-slate-400">/yr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compounding Wealth Calculator / "What If You Plug the Leaks?" */}
      {totalMonthlyLeakLoss > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={15} className="text-emerald-400" />
              <span>Wealth Multiplier (5-Year Projection)</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              @ 8% S&P500 Return
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            If you plug these money leaks and auto-invest the <strong className="text-emerald-400">{formatMoney(totalMonthlyLeakLoss)}/mo</strong> into index funds, you would amass:
          </p>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Estimated 5-Year Portfolio:</span>
            <span className="text-base font-black text-emerald-400">{formatMoney(fiveYearWealth)}</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'All Leaks' },
          { id: 'zombie_subscription', label: '🧟 Zombie Subs' },
          { id: 'micro_spending', label: '☕ Micro-Drains' },
          { id: 'impulse_regret', label: '💔 Impulse Buys' },
          { id: 'convenience_fee', label: '🧛 Fees' },
          { id: 'budget_burn', label: '🔥 Burn Rate' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-xs transition ${
              filterType === tab.id
                ? 'bg-rose-500 text-white shadow-glow-red'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leak Cards List */}
      <div className="space-y-3">
        {filteredLeaks.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-white">No Leaks in this Category!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your finances in this sector are completely locked down. No wasteful bleeding detected.
            </p>
          </div>
        ) : (
          filteredLeaks.map((leak) => (
            <div 
              key={leak.id}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition relative overflow-hidden"
            >
              {/* Severity accent strip */}
              <div 
                className={`absolute top-0 left-0 bottom-0 w-1 ${
                  leak.severity === 'critical' ? 'bg-rose-500' :
                  leak.severity === 'high' ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
              />

              {/* Card Header */}
              <div className="flex items-start justify-between pl-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                    {getLeakIcon(leak.type)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {leak.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-rose-400">
                        -{formatMoney(leak.estimatedMonthlyLoss)}/mo
                      </span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {leak.savingsPotentialBadge}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => dismissLeak(leak.id)}
                  className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition"
                  title="Dismiss this alert"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 pl-1 leading-relaxed">
                {leak.description}
              </p>

              {/* Recommendation Box */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1 pl-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>Fix Strategy:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {leak.recommendation}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(`Action initiated: "${leak.actionText}". We marked this alert to assist you in eliminating this drain.`);
                    dismissLeak(leak.id);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Zap size={14} className="text-rose-400" />
                  <span>{leak.actionText}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
