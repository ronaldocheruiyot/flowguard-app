import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowRightLeft, 
  ReceiptText, 
  Plus, 
  X, 
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building2,
  Smartphone
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const AccountDetailModal: React.FC = () => {
  const { 
    selectedAccountIdForDrawer, 
    setSelectedAccountIdForDrawer, 
    accounts, 
    transactions, 
    categories, 
    formatMoney,
    setIsAddModalOpen,
    setSelectedTransactionForDetail
  } = useFinance();

  if (!selectedAccountIdForDrawer) return null;

  const account = accounts.find(a => a.id === selectedAccountIdForDrawer);
  if (!account) return null;

  const accountTransactions = transactions.filter(
    t => t.accountId === account.id || (t.type === 'transfer' && t.toAccountId === account.id)
  );

  const totalInflow = accountTransactions
    .filter(t => t.type === 'income' || (t.type === 'transfer' && t.toAccountId === account.id))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = accountTransactions
    .filter(t => t.type === 'expense' || (t.type === 'transfer' && t.accountId === account.id))
    .reduce((sum, t) => sum + t.amount, 0);

  const getAccountIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone size={24} className="text-emerald-400" />;
      case 'Building2':
        return <Building2 size={24} className="text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck size={24} className="text-emerald-400" />;
      case 'CreditCard':
        return <CreditCard size={24} className="text-rose-400" />;
      default:
        return <Wallet size={24} className="text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-5 sm:p-6 space-y-5 shadow-2xl my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
              {getAccountIcon(account.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{account.name}</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {account.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {account.accountNumber ? `Account: ${account.accountNumber}` : 'Dedicated Liquid Facility'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedAccountIdForDrawer(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Current Available Liquid Balance
          </span>
          <p className="text-3xl font-black text-white tracking-tight">
            {formatMoney(account.balance)}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block">Total Account Inflow</span>
              <span className="font-bold text-emerald-400">+{formatMoney(totalInflow)}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block">Total Account Outflow</span>
              <span className="font-bold text-rose-400">-{formatMoney(totalOutflow)}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              setSelectedAccountIdForDrawer(null);
              setIsAddModalOpen(true);
            }}
            className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <Plus size={15} />
            <span>Record on this Account</span>
          </button>

          <button
            onClick={() => {
              setSelectedAccountIdForDrawer(null);
              setIsAddModalOpen(true);
            }}
            className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <ArrowRightLeft size={15} className="text-cyan-400" />
            <span>Transfer Funds</span>
          </button>
        </div>

        {/* Account Transaction History */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ReceiptText size={14} className="text-cyan-400" />
              <span>Recent Account Ledger ({accountTransactions.length})</span>
            </h3>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5 divide-y divide-slate-800/40">
            {accountTransactions.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No recorded transactions on this account yet.
              </div>
            ) : (
              accountTransactions.map(tx => {
                const category = categories.find(c => c.id === tx.categoryId);
                const isIncome = tx.type === 'income' || (tx.type === 'transfer' && tx.toAccountId === account.id);

                return (
                  <div
                    key={tx.id}
                    onClick={() => {
                      setSelectedAccountIdForDrawer(null);
                      setSelectedTransactionForDetail(tx);
                    }}
                    className="pt-2 pb-1 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 px-2 rounded-xl transition"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-white truncate">{tx.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="truncate">{category?.name || 'General'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Close */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => setSelectedAccountIdForDrawer(null)}
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            Close Account Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
