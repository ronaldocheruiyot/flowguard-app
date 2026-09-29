import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Users, 
  Landmark, 
  Layers, 
  ReceiptText, 
  BarChart3, 
  FileSpreadsheet, 
  History, 
  Settings, 
  BookOpen, 
  Wallet, 
  Shield, 
  Plus, 
  Sparkles,
  X 
} from 'lucide-react';
import { useFinance, TabType } from '../context/FinanceContext';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setSelectedTab, 
    setIsAddModalOpen,
    setIsStatementModalOpen,
    debtors, 
    loans, 
    accounts, 
    incomeStreams,
    setSelectedAccountIdForDrawer,
    formatMoney
  } = useFinance();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  interface CommandItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    category: 'Navigation' | 'Actions' | 'Accounts' | 'Debtors' | 'Loans' | 'Income Streams';
    action: () => void;
  }

  const allItems: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dash',
      title: 'Dashboard Overview',
      subtitle: 'Liquid balances, recent activity, and net worth overview',
      icon: <LayoutDashboard size={16} className="text-cyan-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('dashboard'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-debtors',
      title: 'Debtors & Receivables Ledger',
      subtitle: `Track ${debtors.length} debtors and collect payments`,
      icon: <Users size={16} className="text-amber-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('debtors'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-loans',
      title: 'Loans & SACCO Debt Manager',
      subtitle: `Manage ${loans.length} commercial SACCO facilities & Fuliza`,
      icon: <Landmark size={16} className="text-rose-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('loans'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-income-streams',
      title: 'Income Streams (Recurring & Windfalls)',
      subtitle: 'Security, Rentals, Real Estate, Tea Plantation',
      icon: <ArrowDownCircle size={16} className="text-emerald-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('income-streams'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-envelopes',
      title: 'Auto-Split Budget Vaults',
      subtitle: 'Envelope budgeting, target allocations, and balance rings',
      icon: <Layers size={16} className="text-indigo-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('envelopes'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-expenses',
      title: 'Expense Cost Centers',
      subtitle: 'Golf, vehicle fuel, office rent, power tokens, groceries',
      icon: <ArrowUpCircle size={16} className="text-orange-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('expense-centers'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-transactions',
      title: 'Transactions Log & Ledgers',
      subtitle: 'Full audit history of all incomes, expenses, and transfers',
      icon: <ReceiptText size={16} className="text-blue-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('transactions'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-analytics',
      title: 'Analytics & Money Leaks Radar',
      subtitle: 'Cashflow charts, regret ratings, and impulse trackers',
      icon: <BarChart3 size={16} className="text-purple-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('analytics'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-statement',
      title: 'Financial Statements & PDF Export',
      subtitle: 'Download audit PDF, CSV export, or upload to Google Drive',
      icon: <FileSpreadsheet size={16} className="text-teal-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('statement'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-audit',
      title: 'Audit Trail & Change Tracker',
      subtitle: 'Field-level diffs, modification timestamps, and deletion logs',
      icon: <History size={16} className="text-rose-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('audit-trail'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-settings',
      title: 'System Settings & Security',
      subtitle: 'PIN management, Admin Mode, Biometrics, and Backup Data',
      icon: <Settings size={16} className="text-slate-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('settings'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav-manual',
      title: 'User Manual & Interactive Guide',
      subtitle: 'Complete searchable documentation and visual walkthroughs',
      icon: <BookOpen size={16} className="text-amber-400" />,
      category: 'Navigation',
      action: () => { setSelectedTab('user-manual'); setIsCommandPaletteOpen(false); }
    },

    // Actions
    {
      id: 'act-add-tx',
      title: 'Record New Transaction (+)',
      subtitle: 'Log an expense, windfall income, or account transfer',
      icon: <Plus size={16} className="text-emerald-400" />,
      category: 'Actions',
      action: () => { setIsCommandPaletteOpen(false); setIsAddModalOpen(true); }
    },
    {
      id: 'act-export-pdf',
      title: 'Generate PDF Audit Statement',
      subtitle: 'Instant print-ready statement with date range filtering',
      icon: <FileSpreadsheet size={16} className="text-cyan-400" />,
      category: 'Actions',
      action: () => { setSelectedTab('statement'); setIsCommandPaletteOpen(false); }
    },

    // Accounts
    ...accounts.map(acc => ({
      id: `acc-${acc.id}`,
      title: `${acc.name} (${formatMoney(acc.balance)})`,
      subtitle: `Account type: ${acc.type} • Click to open dedicated ledger`,
      icon: <Wallet size={16} className="text-emerald-400" />,
      category: 'Accounts' as const,
      action: () => {
        setIsCommandPaletteOpen(false);
        setSelectedAccountIdForDrawer(acc.id);
      }
    })),

    // Debtors
    ...debtors.map(deb => ({
      id: `deb-${deb.id}`,
      title: `Debtor: ${deb.debtorName}`,
      subtitle: `Owed: ${formatMoney(deb.amountOwed)} • Paid: ${formatMoney(deb.amountPaid)} • Status: ${deb.status}`,
      icon: <Users size={16} className="text-amber-400" />,
      category: 'Debtors' as const,
      action: () => {
        setSelectedTab('debtors');
        setIsCommandPaletteOpen(false);
      }
    })),

    // Loans
    ...loans.map(ln => ({
      id: `ln-${ln.id}`,
      title: `Loan: ${ln.title}`,
      subtitle: `Remaining: ${formatMoney(ln.remainingBalance)} • Lender: ${ln.lender}`,
      icon: <Landmark size={16} className="text-rose-400" />,
      category: 'Loans' as const,
      action: () => {
        setSelectedTab('loans');
        setIsCommandPaletteOpen(false);
      }
    }))
  ];

  const filteredItems = allItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a section, debtor, account, loan or action (e.g. 'KCB', 'Apex', 'PDF')..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg">
            ESC
          </kbd>
          <button 
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Sparkles size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No matching modules or records found</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Try searching for 'loans', 'debtors', 'kcb', or 'statement'</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-2.5 rounded-2xl flex items-center justify-between transition ${
                    isSelected ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 shrink-0">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[9px] font-medium text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded-md border border-slate-800">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono text-cyan-400 shrink-0 pl-2">
                      Jump ↵
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 px-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">↑</kbd>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">↓</kbd>
            <span>Select:</span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">↵</kbd>
          </div>
          <span className="text-cyan-400 font-semibold">FlowGuard Navigator</span>
        </div>
      </div>
    </div>
  );
};
