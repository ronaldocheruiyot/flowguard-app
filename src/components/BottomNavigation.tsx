import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LayoutDashboard, 
  Split, 
  Radar, 
  Layers, 
  ReceiptText, 
  Plus 
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { selectedTab, setSelectedTab, setIsAddModalOpen, activeLeaks } = useFinance();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto transition-colors">
      <div className="flex items-center justify-around px-2 py-2 relative">
        {/* Floating Fast Add Center Action button */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all border-4 border-slate-100 dark:border-slate-950"
            title="Fast Log Expense or Income"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab 1: Home */}
        <button
          onClick={() => setSelectedTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            selectedTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* Tab 2: Income Flow (Auto Split) */}
        <button
          onClick={() => setSelectedTab('income-flow')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
            selectedTab === 'income-flow'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Split size={20} />
          <span className="text-[10px] mt-1">Auto-Split</span>
          <span className="absolute -top-1 right-0 text-[8px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold px-1 rounded-full border border-emerald-500/30">
            NEW
          </span>
        </button>

        {/* Space for center + button */}
        <div className="w-10 pointer-events-none" />

        {/* Tab 3: LeakRadar */}
        <button
          onClick={() => setSelectedTab('leak-radar')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
            selectedTab === 'leak-radar'
              ? 'text-rose-600 dark:text-rose-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Radar size={20} />
          <span className="text-[10px] mt-1">LeakRadar</span>
          {activeLeaks.length > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 bg-rose-500 text-[9px] text-white font-black rounded-full flex items-center justify-center animate-pulse">
              {activeLeaks.length}
            </span>
          )}
        </button>

        {/* Tab 4: Records / Ledger */}
        <button
          onClick={() => setSelectedTab('transactions')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            selectedTab === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ReceiptText size={20} />
          <span className="text-[10px] mt-1">Records</span>
        </button>
      </div>
    </div>
  );
};
