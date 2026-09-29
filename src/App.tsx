import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { IncomeFlowView } from './components/IncomeFlowView';
import { IncomeStreamsManager } from './components/IncomeStreamsManager';
import { ExpenseStreamsManager } from './components/ExpenseStreamsManager';
import { DebtorsTrackerView } from './components/DebtorsTrackerView';
import { LoansManager } from './components/LoansManager';
import { LeakRadarView } from './components/LeakRadarView';
import { EnvelopesView } from './components/EnvelopesView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { FinancialStatementView } from './components/FinancialStatementView';
import { AuditTrailView } from './components/AuditTrailView';
import { SettingsView } from './components/SettingsView';
import { UserManualView } from './components/UserManualView';
import { IncomeAllocatorModal } from './components/IncomeAllocatorModal';
import { QuickTransactionModal } from './components/QuickTransactionModal';
import { AccountDetailModal } from './components/AccountDetailModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { CommandPalette } from './components/CommandPalette';
import { UndoToast } from './components/UndoToast';
import { MobileFrame } from './components/MobileFrame';
import { InstallAppBanner } from './components/InstallAppBanner';
import { UserProfileModal } from './components/UserProfileModal';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ArrowLeft,
  Landmark,
  History,
  Settings,
  BookOpen
} from 'lucide-react';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  'income-streams': { title: 'Business Income Streams', subtitle: '4 Active Sources • Dynamic Baseline' },
  'expense-centers': { title: 'Expenses & Cost Centers', subtitle: 'Golf, Fuel, Shopping, SACCOs & Taxes' },
  'debtors': { title: 'Debtors & Receivables', subtitle: 'Unpaid Rent & Guard Shifts' },
  'loans': { title: 'Loans & SACCO Debt Manager', subtitle: 'K&M SACCO, Imarisha SACCO & Fuliza' },
  'statement': { title: 'Financial Statements', subtitle: 'Weekly, Monthly & Yearly PDF/CSV' },
  'analytics': { title: 'Analytics & Expense Classes', subtitle: '50/30/20 & Donut Charts' },
  'leak-radar': { title: 'LeakRadar™ Money Drain', subtitle: 'Waste & Subscription Leaks' },
  'envelopes': { title: 'Auto-Split Budget Vaults', subtitle: 'Zero-Based Category Rings' },
  'transactions': { title: 'Transaction Records', subtitle: 'Full Inflow & Outflow History' },
  'income-flow': { title: 'Paycheck Allocator', subtitle: 'Instant 50/30/20 Inflow Split' },
  'audit-trail': { title: 'Change Audit Trail', subtitle: 'Field-Level Diffs & Modification Logs' },
  'settings': { title: 'Settings & Security', subtitle: 'PINs, Biometrics & Data Backup' },
  'user-manual': { title: 'User Manual & Guides', subtitle: 'Interactive Documentation & Video Tour' }
};

const MainContent: React.FC = () => {
  const { 
    selectedTab, 
    setSelectedTab, 
    isAuthenticated, 
    goBack, 
    canGoBack,
    totalExpectedMonthlyIncome,
    isSidebarCollapsed,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen
  } = useFinance();

  if (!isAuthenticated) {
    return (
      <MobileFrame>
        <LoginScreen />
      </MobileFrame>
    );
  }

  const incomeKBadge = `${Math.round(totalExpectedMonthlyIncome / 1000)}k`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden">
      {/* Desktop Persistent Sidebar & Mobile Slide-Over Drawer */}
      <Sidebar />

      {/* Main Container */}
      <div 
        className={`flex-1 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <MobileFrame>
          <Header />

          <div className="px-3 sm:px-4 print:hidden w-full">
            <InstallAppBanner />
          </div>

          {/* Back Navigation Bar for Inner Pages */}
          {selectedTab !== 'dashboard' && (
            <div className="px-3 sm:px-4 pt-2.5 pb-1 print:hidden w-full">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-xs hover:bg-slate-200 dark:hover:bg-slate-750 active:scale-95 transition-all shrink-0"
                  title="Go back to previous screen"
                >
                  <ArrowLeft size={14} className="text-emerald-500" />
                  <span>Back</span>
                </button>
                <div className="text-right min-w-0 pl-2">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                    {TAB_TITLES[selectedTab]?.title || 'FlowGuard'}
                  </h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {TAB_TITLES[selectedTab]?.subtitle || 'Benard Cheruiyot'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Quick Category Pills for Mobile / Fast Switching */}
          <div className="px-3 sm:px-4 pt-2 flex items-center justify-between print:hidden w-full overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar pb-1 w-full">
              <button
                onClick={() => setSelectedTab('dashboard')}
                className={`px-3 py-1.5 rounded-2xl font-bold transition whitespace-nowrap shrink-0 ${
                  selectedTab === 'dashboard'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setSelectedTab('income-streams')}
                className={`px-3 py-1.5 rounded-2xl font-bold transition flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  selectedTab === 'income-streams'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <TrendingUp size={12} />
                <span>Income ({incomeKBadge})</span>
              </button>

              <button
                onClick={() => setSelectedTab('debtors')}
                className={`px-3 py-1.5 rounded-2xl font-bold transition flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  selectedTab === 'debtors'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Users size={12} />
                <span>Debtors</span>
              </button>

              <button
                onClick={() => setSelectedTab('loans')}
                className={`px-3 py-1.5 rounded-2xl font-bold transition flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  selectedTab === 'loans'
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Landmark size={12} />
                <span>Loans</span>
              </button>
              
              <button
                onClick={() => setSelectedTab('statement')}
                className={`px-3 py-1.5 rounded-2xl font-bold transition flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  selectedTab === 'statement'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <FileText size={12} />
                <span>Statements</span>
              </button>

              <button
                onClick={() => setSelectedTab('audit-trail')}
                className={`px-3 py-1.5 rounded-2xl font-bold transition flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  selectedTab === 'audit-trail'
                    ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <History size={12} />
                <span>Audit Trail</span>
              </button>
            </div>
          </div>

          <main className="px-3 sm:px-4 py-2 flex-1 w-full max-w-full overflow-x-hidden min-w-0">
            {selectedTab === 'dashboard' && <Dashboard />}
            {selectedTab === 'income-streams' && <IncomeStreamsManager />}
            {selectedTab === 'expense-centers' && <ExpenseStreamsManager />}
            {selectedTab === 'debtors' && <DebtorsTrackerView />}
            {selectedTab === 'loans' && <LoansManager />}
            {selectedTab === 'income-flow' && <IncomeFlowView />}
            {selectedTab === 'leak-radar' && <LeakRadarView />}
            {selectedTab === 'envelopes' && <EnvelopesView />}
            {selectedTab === 'transactions' && <TransactionsView />}
            {selectedTab === 'analytics' && <AnalyticsView />}
            {selectedTab === 'statement' && <FinancialStatementView />}
            {selectedTab === 'audit-trail' && <AuditTrailView />}
            {selectedTab === 'settings' && <SettingsView />}
            {selectedTab === 'user-manual' && <UserManualView />}
          </main>

          {/* Global Modals & Notifications */}
          <UserProfileModal 
            isOpen={isUserProfileModalOpen} 
            onClose={() => setIsUserProfileModalOpen(false)} 
          />
          <IncomeAllocatorModal />
          <QuickTransactionModal />
          <AccountDetailModal />
          <TransactionDetailModal />
          <CommandPalette />
          <UndoToast />

          {/* Bottom Navigation Bar with Prominent Middle + Button */}
          <BottomNavigation />
        </MobileFrame>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
