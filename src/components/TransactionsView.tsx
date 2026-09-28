import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  ReceiptText, 
  Search, 
  Download, 
  Trash2, 
  Star, 
  Plus 
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';

export const TransactionsView: React.FC = () => {
  const { 
    transactions, 
    categories, 
    accounts, 
    deleteTransaction, 
    formatMoney, 
    setIsAddModalOpen,
    currency 
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [leakOnly, setLeakOnly] = useState<boolean>(false);

  const filteredTransactions = transactions.filter(t => {
    // Search filter
    if (searchTerm) {
      const matchTitle = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchNote = t.note?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchTitle && !matchNote) return false;
    }

    // Type filter
    if (selectedType !== 'all' && t.type !== selectedType) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) {
      return false;
    }

    // Leak only filter
    if (leakOnly) {
      const hasFlags = (t.leakFlags && t.leakFlags.length > 0) || (t.regretRating && t.regretRating >= 4) || t.isImpulse;
      if (!hasFlags) return false;
    }

    return true;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Title', 'Amount', 'Currency', 'Category', 'Account', 'RegretRating', 'Note'];
    const rows = filteredTransactions.map(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || '';
      const acc = accounts.find(a => a.id === t.accountId)?.name || '';
      return [
        t.id,
        t.date,
        t.type,
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount,
        currency.code,
        `"${cat}"`,
        `"${acc}"`,
        t.regretRating || '',
        `"${(t.note || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowguard-records-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCategory = (catId: string) => categories.find(c => c.id === catId);

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Financial Ledger
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold">
              {filteredTransactions.length} items
            </span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Complete immutable record keeping</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Export CSV Spreadsheet"
          >
            <Download size={14} />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 rounded-xl bg-emerald-500 text-white dark:text-slate-950 font-bold transition flex items-center gap-1 text-xs shadow-md shadow-emerald-500/20"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
        {/* Search input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search merchants, coffee, subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-slate-400 dark:focus:border-slate-700"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none text-[11px]"
          >
            <option value="all">All Types (Income & Expenses)</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
            <option value="transfer">Transfers Only</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none text-[11px]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Leak Tag Filter Toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={leakOnly}
              onChange={(e) => setLeakOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-rose-500 rounded"
            />
            <span>Show Only Flagged Drains / Regret Purchases 💔</span>
          </label>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            No matching transaction records found.
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const cat = getCategory(t.categoryId);
            const isExpense = t.type === 'expense';
            const isIncome = t.type === 'income';

            return (
              <div 
                key={t.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition space-x-2 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundColor: cat ? cat.color + '22' : '#e2e8f0',
                      color: cat ? cat.color : '#64748b' 
                    }}
                  >
                    <DynamicIcon name={cat?.icon || 'Receipt'} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                      <span className="truncate">{t.title}</span>
                      {t.isSubscription && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded font-semibold border border-purple-500/30">
                          Sub
                        </span>
                      )}
                      {t.isImpulse && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded font-semibold border border-rose-500/30">
                          Impulse
                        </span>
                      )}
                      {t.regretRating && t.regretRating >= 4 && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded font-semibold border border-amber-500/30">
                          Regret {t.regretRating}★
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{t.date}</span>
                      <span>•</span>
                      <span>{cat?.name || 'Uncategorized'}</span>
                      {t.note && (
                        <>
                          <span>•</span>
                          <span className="italic truncate max-w-[120px]">"{t.note}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className={`text-xs font-black ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : isExpense ? 'text-slate-900 dark:text-white' : 'text-cyan-600 dark:text-cyan-400'}`}>
                      {isIncome ? '+' : isExpense ? '-' : ''}{formatMoney(t.amount)}
                    </div>
                    {t.regretRating && (
                      <div className="flex items-center justify-end gap-0.5 text-amber-500 dark:text-amber-400 text-[9px]">
                        <Star size={9} fill="currentColor" />
                        <span>{t.regretRating}/5</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Delete transaction "${t.title}" and update balances?`)) {
                        deleteTransaction(t.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    title="Delete record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
