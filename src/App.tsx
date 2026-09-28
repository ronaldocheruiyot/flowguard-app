import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { IncomeFlowView } from './components/IncomeFlowView';
import { IncomeStreamsManager } from './components/IncomeStreamsManager';
import { ExpenseStreamsManager } from './components/ExpenseStreamsManager';
import { DebtorsTrackerView } from './components/DebtorsTrackerView';
import { LeakRadarView } from './components/LeakRadarView';
import { EnvelopesView } from './components/EnvelopesView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { FinancialStatementView } from './components/FinancialStatementView';
import { IncomeAllocatorModal } from './components/IncomeAllocatorModal';
import { QuickTransactionModal } from './components/QuickTransactionModal';
import { UndoToast } from './components/UndoToast';
import { MobileFrame } from './components/MobileFrame';
import { BarChart3, FileText, TrendingUp, TrendingDown, Users, ArrowLeft } from 'lucide-react';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  'income-streams': { title: 'Business Income Streams', subtitle: '4 Active Sources • KSh 220k/mo' },
  'expense-centers': { title: 'Expenses & Cost Centers', subtitle: 'Golf, Fuel, Shopping, SACCOs & Taxes' },
  'debtors': { title: 'Debtors & Receivables', subtitle: 'Unpaid Rent & Invoices' },
  'statement': { title: 'Financial Statements', subtitle: 'Weekly, Monthly & Yearly PDF/CSV' },
  'analytics': { title: 'Analytics & Expense Classes', subtitle: '50/30/20 & Donut Charts' },
  'leak-radar': { title: 'LeakRadar™ Money Drain', subtitle: 'Waste & Subscription Leaks' },
  'envelopes': { title: 'Cash Envelopes', subtitle: 'Zero-Based Category Buckets' },
  'transactions': { title: 'Transaction Records', subtitle: 'Full Inflow & Outflow History' },
  'income-flow': { title: 'Paycheck Allocator', subtitle: 'Instant 50/30/20 Inflow Split' }
};

const MainContent: React.FC = () => {
  const { selectedTab, setSelectedTab, isAuthenticated, goBack, canGoBack } = useFinance();

  if (!isAuthenticated) {
    return (
      <MobileFrame>
        <LoginScreen />
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <Header />

      {/* Back Navigation Bar for Inner Pages */}
      {selectedTab !== 'dashboard' && (
        <div className="px-4 pt-2.5 pb-1 print:hidden">
          <div className="flex items-center justify-between bg-white dark:bg-slate-850 p-2 px-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-xs hover:bg-slate-200 dark:hover:bg-slate-750 active:scale-95 transition-all"
              title="Go back to previous screen"
            >
              <ArrowLeft size={14} className="text-emerald-500" />
              <span>Back</span>
            </button>
            <div className="text-right">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {TAB_TITLES[selectedTab]?.title || 'FlowGuard'}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {TAB_TITLES[selectedTab]?.subtitle || 'Benard Cheruiyot'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top View Selector Bar */}
      <div className="px-4 pt-2 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar pb-1">
          <button
            onClick={() => setSelectedTab('dashboard')}
            className={`px-3 py-1 rounded-full font-bold transition whitespace-nowrap ${
              selectedTab === 'dashboard'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setSelectedTab('income-streams')}
            className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 whitespace-nowrap ${
              selectedTab === 'income-streams'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp size={12} />
            <span>Income (220k)</span>
          </button>

          <button
            onClick={() => setSelectedTab('expense-centers')}
            className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 whitespace-nowrap ${
              selectedTab === 'expense-centers'
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingDown size={12} />
            <span>Expenses</span>
          </button>

          <button
            onClick={() => setSelectedTab('debtors')}
            className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 whitespace-nowrap ${
              selectedTab === 'debtors'
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users size={12} />
            <span>Debtors</span>
          </button>
          
          <button
            onClick={() => setSelectedTab('statement')}
            className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 whitespace-nowrap ${
              selectedTab === 'statement'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText size={12} />
            <span>Statements</span>
          </button>

          <button
            onClick={() => setSelectedTab('analytics')}
            className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 whitespace-nowrap ${
              selectedTab === 'analytics'
                ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 size={12} />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      <main className="px-4 py-2 flex-1">
        {selectedTab === 'dashboard' && <Dashboard />}
        {selectedTab === 'income-streams' && <IncomeStreamsManager />}
        {selectedTab === 'expense-centers' && <ExpenseStreamsManager />}
        {selectedTab === 'debtors' && <DebtorsTrackerView />}
        {selectedTab === 'income-flow' && <IncomeFlowView />}
        {selectedTab === 'leak-radar' && <LeakRadarView />}
        {selectedTab === 'envelopes' && <EnvelopesView />}
        {selectedTab === 'transactions' && <TransactionsView />}
        {selectedTab === 'analytics' && <AnalyticsView />}
        {selectedTab === 'statement' && <FinancialStatementView />}
      </main>

      {/* Global Modals & Toast */}
      <IncomeAllocatorModal />
      <QuickTransactionModal />
      <UndoToast />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation />
    </MobileFrame>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
