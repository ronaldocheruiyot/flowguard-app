import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown,
  Sparkles, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  ChevronRight,
  FileText,
  Star,
  Users,
  Building,
  GlassWater,
  Fuel,
  HeartHandshake,
  Award,
  Play,
  Search,
  Landmark,
  Wallet,
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';
import { VideoTourModal } from './VideoTourModal';

export const Dashboard: React.FC = () => {
  const { 
    user,
    netWorth, 
    monthlyIncome, 
    monthlyExpenses, 
    savingsRate, 
    formatMoney, 
    accounts, 
    envelopes, 
    transactions, 
    activeLeaks, 
    totalYearlyLeakLoss,
    incomeStreams,
    totalExpectedMonthlyIncome,
    expenseCenters,
    totalMonthlyExpenseBudget,
    debtors, 
    totalPendingDebtReceivables,
    loans,
    totalLoanDebtRemaining,
    setIsIncomeModalOpen, 
    setPendingIncomeAmount, 
    setSelectedTab,
    setIsCommandPaletteOpen,
    setSelectedAccountIdForDrawer,
    setSelectedTransactionForDetail,
    categories
  } = useFinance();

  const [showVideoTour, setShowVideoTour] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  const recentTransactions = transactions.slice(0, 6);

  const getCategory = (catId: string) => {
    return categories.find(c => c.id === catId);
  };

  return (
    <div className="space-y-4 pb-20 pt-1 animate-in fade-in duration-200">

      {/* Quick Search & Command Palette Banner */}
      <div 
        onClick={() => setIsCommandPaletteOpen(true)}
        className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-sm group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition">
            <Search size={15} />
          </div>
          <div>
            <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
              Quick Search & Module Navigator
            </span>
            <p className="text-[10px] text-slate-400">Jump to Debtors, Loans, Accounts, Envelopes or Statements</p>
          </div>
        </div>
        <kbd className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
          Ctrl + K
        </kbd>
      </div>

      {/* Video Tour Banner */}
      <div 
        onClick={() => setShowVideoTour(true)}
        className="p-3 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border border-emerald-500/30 dark:border-emerald-500/20 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shrink-0">
            <Play size={13} className="fill-white ml-0.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Watch Video Explainer & Tour</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded">DEMO</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Step-by-step phone navigation demo</p>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">Watch ▶</span>
      </div>
      
      {/* 1. Net Worth & Cashflow Card */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
          <div>
            <span>Welcome, </span>
            <strong className="text-white">{user.name}</strong>
          </div>
          <button
            onClick={() => setShowBreakdownModal(true)}
            className="flex items-center gap-1 text-emerald-400 text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 px-2 py-0.5 rounded-full border border-emerald-500/30 transition"
            title="Tap to see how this is calculated"
          >
            <TrendingUp size={12} /> {savingsRate}% Saved this month ℹ️
          </button>
        </div>

        <div 
          onClick={() => setShowBreakdownModal(true)}
          className="text-3xl font-black tracking-tight text-white mb-1 cursor-pointer hover:text-emerald-400 transition flex items-center justify-between group"
          title="Click to see full account breakdown"
        >
          <span>{formatMoney(netWorth)}</span>
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-300 border border-slate-700 group-hover:border-emerald-500/40 px-2 py-0.5 rounded-lg">
            View Breakdown ℹ️
          </span>
        </div>

        {/* Expected Monthly vs Actual */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between pb-3">
          <span>Expected Recurring Inflow:</span>
          <span className="font-bold text-emerald-400">{formatMoney(totalExpectedMonthlyIncome)}/mo</span>
        </div>

        {/* Monthly Income vs Expense Metric Pills */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800">
          <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                <ArrowDownRight size={12} />
              </div>
              <span>Received In</span>
            </div>
            <div className="text-base font-bold text-emerald-400 mt-1">
              +{formatMoney(monthlyIncome)}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <div className="p-1 rounded-full bg-rose-500/20 text-rose-400">
                <ArrowUpRight size={12} />
              </div>
              <span>Spent Out</span>
            </div>
            <div className="text-base font-bold text-rose-400 mt-1">
              -{formatMoney(monthlyExpenses)}
            </div>
          </div>
        </div>
      </div>

      {/* Account Breakdown Modal */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>📊</span> Overview Calculations Breakdown
                </h3>
                <p className="text-[10px] text-emerald-400 font-medium">
                  How {formatMoney(netWorth)} was computed
                </p>
              </div>
              <button onClick={() => setShowBreakdownModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Accounts Sum */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  1. Liquid Net Worth (All Accounts):
                </div>
                {accounts.map(acc => (
                  <div key={acc.id} className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-300">{acc.name}:</span>
                    <span className={`font-bold ${acc.balance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {formatMoney(acc.balance)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-800 font-black text-xs text-white">
                  <span>Total Net Worth:</span>
                  <span className="text-emerald-400">{formatMoney(netWorth)}</span>
                </div>
              </div>

              {/* 4 Inflow Streams Sum */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  2. Monthly Inflow (Recurring Streams):
                </div>
                {incomeStreams.map(inc => (
                  <div key={inc.id} className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-300">{inc.title}:</span>
                    <span className="font-bold text-cyan-400">{formatMoney(inc.expectedMonthlyAmount)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-800 font-black text-xs text-white">
                  <span>Expected Monthly Total:</span>
                  <span className="text-emerald-400">{formatMoney(totalExpectedMonthlyIncome)}/mo</span>
                </div>
              </div>

              {/* Cashflow & Savings rate */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-[11px] space-y-1">
                <div className="font-bold text-emerald-300">3. Monthly Savings Rate Formula:</div>
                <div className="text-slate-300">
                  Received ({formatMoney(monthlyIncome)}) - Spent ({formatMoney(monthlyExpenses)}) = <strong className="text-white">+{formatMoney(monthlyIncome - monthlyExpenses)} Net Surplus</strong>
                </div>
                <div className="text-emerald-400 font-bold text-[10px]">
                  ✓ Savings Rate: {savingsRate}% of total inflows preserved
                </div>
              </div>

            </div>

            <button
              onClick={() => setShowBreakdownModal(false)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {/* 2. Interactive Clickable Accounts Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
          <span className="flex items-center gap-1.5">
            <Wallet size={14} className="text-emerald-500" />
            <span>Liquid Accounts & Floats (Click to view ledger)</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{accounts.length} active</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {accounts.map((acc) => (
            <div 
              key={acc.id}
              onClick={() => setSelectedAccountIdForDrawer(acc.id)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500/60 cursor-pointer transition space-y-1.5 shadow-sm group"
              title={`Click to open ${acc.name} ledger and history`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center group-hover:scale-105 transition"
                  style={{ backgroundColor: acc.color + '22', color: acc.color }}
                >
                  <DynamicIcon name={acc.icon} className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  {acc.type}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-cyan-400 transition">
                  {acc.name}
                </div>
                <div className={`text-sm font-black ${acc.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                  {formatMoney(acc.balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Debtors & Loans Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Debtors Card */}
        <div 
          onClick={() => setSelectedTab('debtors')}
          className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/40 cursor-pointer hover:border-amber-400 transition space-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Users size={16} />
              </div>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Debtors Receivables
              </span>
            </div>
            <ChevronRight size={14} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-base font-black text-amber-600 dark:text-amber-400 pt-0.5">
            {formatMoney(totalPendingDebtReceivables)}
          </div>
          <p className="text-[10px] text-amber-700 dark:text-amber-300/80">
            {debtors.filter(d => d.status !== 'paid').length} uncollected receivables
          </p>
        </div>

        {/* Loans & SACCO Debt Card */}
        <div 
          onClick={() => setSelectedTab('loans')}
          className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 cursor-pointer hover:border-rose-400 transition space-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <Landmark size={16} />
              </div>
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Loans & SACCO Facilities
              </span>
            </div>
            <ChevronRight size={14} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-base font-black text-rose-600 dark:text-rose-400 pt-0.5">
            {formatMoney(totalLoanDebtRemaining)}
          </div>
          <p className="text-[10px] text-rose-700 dark:text-rose-300/80">
            {loans.filter(l => l.status === 'active').length} active commercial facilities
          </p>
        </div>
      </div>

      {/* 4. Quick Action Grid: "Payday Auto-Split" & "Statement Generator" */}
      <div className="grid grid-cols-2 gap-2">
        <div 
          onClick={() => {
            setPendingIncomeAmount(totalExpectedMonthlyIncome || 220000);
            setIsIncomeModalOpen(true);
          }}
          className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-gradient-to-br dark:from-emerald-600/25 dark:to-teal-600/20 border border-emerald-500/30 dark:border-emerald-500/40 cursor-pointer hover:border-emerald-500 transition space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-bold shadow-glow-green">
              <Sparkles size={16} />
            </div>
            <span className="text-[9px] bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950 font-black px-1.5 py-0.5 rounded-md">
              SPLIT
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white pt-1">Received Money?</div>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-300/80">Auto-allocate to vaults</p>
        </div>

        <div 
          onClick={() => setSelectedTab('statement')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition space-y-1 group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold border border-slate-200 dark:border-slate-700">
              <FileText size={16} />
            </div>
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              AUDIT
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white pt-1">Produce Statement</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Week / Month / Year</p>
        </div>
      </div>

      {/* 5. Virtual Envelopes Snapshot */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
          <span className="flex items-center gap-1.5">
            <PieChart size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Budget Vaults (Envelopes)</span>
          </span>
          <button 
            onClick={() => setSelectedTab('envelopes')}
            className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
          >
            Manage
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {envelopes.slice(0, 4).map((env) => {
            const fillPct = Math.min(100, Math.round((env.currentAmount / Math.max(env.targetAmount, 1)) * 100));
            return (
              <div key={env.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <div 
                      className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: env.color + '22', color: env.color }}
                    >
                      <DynamicIcon name={env.icon} className="w-3 h-3" />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">{env.name}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{formatMoney(env.currentAmount)}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">/ {formatMoney(env.targetAmount)}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${fillPct}%`, 
                      backgroundColor: env.color 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Interactive Clickable Recent Activity */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
          <span>Recent Activity (Click to inspect)</span>
          <button 
            onClick={() => setSelectedTab('transactions')}
            className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
          >
            See All ({transactions.length})
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((t) => {
            const cat = getCategory(t.categoryId);
            const isExpense = t.type === 'expense';
            const isIncome = t.type === 'income';

            return (
              <div 
                key={t.id}
                onClick={() => setSelectedTransactionForDetail(t)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition shadow-sm group"
                title="Click to view details or delete transaction"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition"
                    style={{ 
                      backgroundColor: cat ? cat.color + '22' : '#e2e8f0',
                      color: cat ? cat.color : '#64748b' 
                    }}
                  >
                    <DynamicIcon name={cat?.icon || 'Receipt'} className="w-5 h-5" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="truncate max-w-[140px] sm:max-w-[200px] group-hover:text-cyan-400 transition">{t.title}</span>
                      {t.regretRating && t.regretRating >= 4 && (
                        <span className="flex items-center text-[9px] px-1.5 py-0.2 bg-rose-500/20 text-rose-600 dark:text-rose-300 rounded font-bold border border-rose-500/30">
                          Regret 💔
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{cat?.name || 'General'}</span>
                      <span>•</span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-black ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : isExpense ? 'text-slate-900 dark:text-white' : 'text-cyan-600 dark:text-cyan-400'}`}>
                    {isIncome ? '+' : isExpense ? '-' : ''}{formatMoney(t.amount)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Tour & Explainer Modal */}
      <VideoTourModal 
        isOpen={showVideoTour} 
        onClose={() => setShowVideoTour(false)} 
      />
    </div>
  );
};
