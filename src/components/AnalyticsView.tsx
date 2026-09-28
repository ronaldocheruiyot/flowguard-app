import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Info 
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';

export const AnalyticsView: React.FC = () => {
  const { 
    transactions, 
    categories, 
    monthlyIncome, 
    monthlyExpenses, 
    savingsRate, 
    formatMoney, 
    activeLeaks,
    currency,
    theme
  } = useFinance();

  const [activeChartTab, setActiveChartTab] = useState<'expenses' | 'classification' | 'revenue' | 'leaks'>('classification');

  // 1. Classification (Needs, Wants, Savings, Debt)
  let needsSpend = 0;
  let wantsSpend = 0;
  let savingsSpend = 0;
  let debtSpend = 0;

  transactions.forEach(t => {
    const cat = categories.find(c => c.id === t.categoryId);
    if (cat) {
      if (cat.group === 'needs' && t.type === 'expense') needsSpend += t.amount;
      if (cat.group === 'wants' && t.type === 'expense') wantsSpend += t.amount;
      if (cat.group === 'savings' && (t.type === 'expense' || t.type === 'transfer')) savingsSpend += t.amount;
      if (cat.group === 'debt' && (t.type === 'expense' || t.type === 'transfer')) debtSpend += t.amount;
    }
  });

  const totalExpenseSum = Math.max(monthlyExpenses, 1);

  const classificationData = [
    { name: 'Needs & Essentials (Goal 50%)', value: needsSpend, color: '#6366f1', group: 'needs' },
    { name: 'Guilt-Free Wants (Goal 30%)', value: wantsSpend, color: '#ec4899', group: 'wants' },
    { name: 'Savings & Investments (Goal 20%)', value: savingsSpend, color: '#10b981', group: 'savings' },
    { name: 'Debt & Fuliza Payoff', value: debtSpend, color: '#f43f5e', group: 'debt' }
  ].filter(d => d.value > 0);

  // 2. Detailed Category Expenses Data
  const categorySpendMap: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categorySpendMap[t.categoryId] = (categorySpendMap[t.categoryId] || 0) + t.amount;
    });

  const categoryExpensesData = categories
    .map(c => ({
      name: c.name,
      value: categorySpendMap[c.id] || 0,
      color: c.color,
      icon: c.icon,
      group: c.group
    }))
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value);

  // 3. Revenue / Income Sources Data
  const incomeCategoryMap: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'income')
    .forEach(t => {
      incomeCategoryMap[t.categoryId] = (incomeCategoryMap[t.categoryId] || 0) + t.amount;
    });

  const revenueData = categories
    .filter(c => c.group === 'income')
    .map(c => ({
      name: c.name,
      value: incomeCategoryMap[c.id] || 0,
      color: c.color,
      icon: c.icon
    }))
    .filter(c => c.value > 0);

  // 4. Leaks Breakdown
  const leakBreakdownData = [
    {
      name: 'Zombie Subscriptions',
      value: activeLeaks.filter(l => l.type === 'zombie_subscription').reduce((s, l) => s + l.estimatedMonthlyLoss, 0),
      color: '#8b5cf6'
    },
    {
      name: 'Micro-Spending Drain',
      value: activeLeaks.filter(l => l.type === 'micro_spending').reduce((s, l) => s + l.estimatedMonthlyLoss, 0),
      color: '#f59e0b'
    },
    {
      name: 'Impulse & Buyer Regret',
      value: activeLeaks.filter(l => l.type === 'impulse_regret').reduce((s, l) => s + l.estimatedMonthlyLoss, 0),
      color: '#ef4444'
    },
    {
      name: 'Convenience & ATM Fees',
      value: activeLeaks.filter(l => l.type === 'convenience_fee').reduce((s, l) => s + l.estimatedMonthlyLoss, 0),
      color: '#ec4899'
    },
    {
      name: 'Budget Burn Overheats',
      value: activeLeaks.filter(l => l.type === 'budget_burn').reduce((s, l) => s + l.estimatedMonthlyLoss, 0),
      color: '#f97316'
    }
  ].filter(d => d.value > 0);

  // Custom Tooltip for Pie Charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = activeChartTab === 'revenue' 
        ? Math.max(monthlyIncome, 1) 
        : activeChartTab === 'leaks' 
        ? Math.max(activeLeaks.reduce((s, l) => s + l.estimatedMonthlyLoss, 0), 1)
        : totalExpenseSum;
      const pct = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-3 rounded-2xl border border-slate-700 shadow-2xl text-xs space-y-1 z-50">
          <div className="font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-emerald-400 font-extrabold text-sm">
            {formatMoney(data.value)} <span className="text-slate-400 text-xs font-normal">({pct}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Top Header Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-900 dark:from-cyan-950/70 dark:via-slate-900 dark:to-slate-900 bg-cyan-900 text-white border border-cyan-500/30 shadow-2xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <PieIcon size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Visual Financial Analytics
              </h2>
              <p className="text-[11px] text-cyan-300/80 font-medium">
                Interactive Revenue, Expense & Drain Pie Charts
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {savingsRate}% Saved
          </span>
        </div>
      </div>

      {/* Interactive Pie Chart Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'classification', label: '📊 50/30/20 Classes' },
          { id: 'expenses', label: '💸 Expense Categories' },
          { id: 'revenue', label: '💰 Revenue Streams' },
          { id: 'leaks', label: '🚨 LeakRadar Drains' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveChartTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-xs transition ${
              activeChartTab === tab.id
                ? 'bg-cyan-500 text-slate-950 shadow-glow-blue'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Pie Chart Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        {/* Card Title & Total */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {activeChartTab === 'classification' && 'Expense Classes (50/30/20 Breakdown)'}
              {activeChartTab === 'expenses' && 'Detailed Expense Category Distribution'}
              {activeChartTab === 'revenue' && 'Income & Revenue Streams Breakdown'}
              {activeChartTab === 'leaks' && 'Active Money Leaks & Bleed Distribution'}
            </h3>
            <p className="text-[10px] text-slate-400">
              Touch or hover over slices for values & percentage share
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Total</span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {activeChartTab === 'revenue'
                ? formatMoney(monthlyIncome)
                : activeChartTab === 'leaks'
                ? formatMoney(activeLeaks.reduce((s, l) => s + l.estimatedMonthlyLoss, 0))
                : formatMoney(monthlyExpenses)}
            </span>
          </div>
        </div>

        {/* The Recharts Pie / Donut Chart */}
        <div className="h-64 sm:h-72 w-full relative flex items-center justify-center">
          {((activeChartTab === 'classification' && classificationData.length === 0) ||
            (activeChartTab === 'expenses' && categoryExpensesData.length === 0) ||
            (activeChartTab === 'revenue' && revenueData.length === 0) ||
            (activeChartTab === 'leaks' && leakBreakdownData.length === 0)) ? (
            <div className="text-center text-xs text-slate-400">
              No data available for this category view.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={
                    activeChartTab === 'classification'
                      ? classificationData
                      : activeChartTab === 'expenses'
                      ? categoryExpensesData
                      : activeChartTab === 'revenue'
                      ? revenueData
                      : leakBreakdownData
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(activeChartTab === 'classification'
                    ? classificationData
                    : activeChartTab === 'expenses'
                    ? categoryExpensesData
                    : activeChartTab === 'revenue'
                    ? revenueData
                    : leakBreakdownData
                  ).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={theme === 'dark' ? '#0f172a' : '#ffffff'} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPie>
            </ResponsiveContainer>
          )}
        </div>

        {/* Interactive Legend / Data Breakdown List */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Detailed Share Breakdown:
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {(activeChartTab === 'classification'
              ? classificationData
              : activeChartTab === 'expenses'
              ? categoryExpensesData
              : activeChartTab === 'revenue'
              ? revenueData
              : leakBreakdownData
            ).map((item, idx) => {
              const total = activeChartTab === 'revenue'
                ? Math.max(monthlyIncome, 1)
                : activeChartTab === 'leaks'
                ? Math.max(activeLeaks.reduce((s, l) => s + l.estimatedMonthlyLoss, 0), 1)
                : totalExpenseSum;
              const pct = ((item.value / total) * 100).toFixed(1);

              return (
                <div 
                  key={idx}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-850 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatMoney(item.value)}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1.5 font-semibold">
                      ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 50 / 30 / 20 Target Compliance Recommendation */}
      <div className="p-4 rounded-3xl bg-indigo-950/30 dark:bg-indigo-950/40 border border-indigo-500/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Budgeting Guideline Review</span>
          </span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
            50 / 30 / 20 Rule
          </span>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          Your current essentials constitute <strong>{Math.round((needsSpend / totalExpenseSum) * 100)}%</strong>, discretionary wants take <strong>{Math.round((wantsSpend / totalExpenseSum) * 100)}%</strong>, and you are achieving a <strong>{savingsRate}%</strong> monthly savings rate into SACCO/MMF.
        </p>
      </div>

    </div>
  );
};
