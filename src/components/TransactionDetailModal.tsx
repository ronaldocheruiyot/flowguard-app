import React, { useState } from 'react';
import { 
  ReceiptText, 
  Calendar, 
  Wallet, 
  Tag, 
  Layers, 
  AlertTriangle, 
  Trash2, 
  X, 
  CheckCircle2,
  Users,
  Landmark,
  FileText
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ConfirmActionModal } from './ConfirmActionModal';

export const TransactionDetailModal: React.FC = () => {
  const { 
    selectedTransactionForDetail, 
    setSelectedTransactionForDetail, 
    deleteTransaction, 
    categories, 
    accounts, 
    envelopes, 
    debtors, 
    loans, 
    formatMoney 
  } = useFinance();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!selectedTransactionForDetail) return null;
  const tx = selectedTransactionForDetail;

  const category = categories.find(c => c.id === tx.categoryId);
  const account = accounts.find(a => a.id === tx.accountId);
  const toAccount = tx.toAccountId ? accounts.find(a => a.id === tx.toAccountId) : null;
  const envelope = envelopes.find(e => e.id === tx.envelopeId);
  const debtor = tx.debtorId ? debtors.find(d => d.id === tx.debtorId) : null;
  const loan = tx.loanId ? loans.find(l => l.id === tx.loanId) : null;

  const isIncome = tx.type === 'income';
  const isTransfer = tx.type === 'transfer';

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl my-auto animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isIncome 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : isTransfer 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                <ReceiptText size={20} />
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isIncome 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : isTransfer 
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}>
                  {tx.type}
                </span>
                <h3 className="text-sm font-bold text-white tracking-tight mt-1 truncate max-w-[220px]">
                  {tx.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedTransactionForDetail(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Amount Display */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Transaction Total
            </span>
            <p className={`text-3xl font-black mt-1 ${
              isIncome ? 'text-emerald-400' : isTransfer ? 'text-cyan-400' : 'text-rose-400'
            }`}>
              {isIncome ? '+' : isTransfer ? '⇄ ' : '-'}{formatMoney(tx.amount)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1">
              <Calendar size={12} />
              <span>{tx.date}</span>
            </p>
          </div>

          {/* Metadata Cards */}
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Tag size={12} className="text-indigo-400" /> Category:
              </span>
              <span className="font-semibold text-slate-200">{category?.name || 'General'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Wallet size={12} className="text-emerald-400" /> Account:
              </span>
              <span className="font-semibold text-slate-200">
                {account?.name || 'Primary Account'}
                {toAccount && ` ➔ ${toAccount.name}`}
              </span>
            </div>

            {envelope && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers size={12} className="text-cyan-400" /> Budget Vault:
                </span>
                <span className="font-semibold text-slate-200">{envelope.name}</span>
              </div>
            )}

            {debtor && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users size={12} className="text-amber-400" /> Debtor Receivable:
                </span>
                <span className="font-semibold text-amber-400">{debtor.debtorName}</span>
              </div>
            )}

            {loan && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Landmark size={12} className="text-rose-400" /> Loan Facility:
                </span>
                <span className="font-semibold text-rose-400">{loan.title}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {tx.note && (
            <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 block mb-1">
                <FileText size={12} /> Notes & Audit Memo:
              </span>
              <p className="text-slate-300 italic">"{tx.note}"</p>
            </div>
          )}

          {/* Leak Flags (if any) */}
          {((tx.leakFlags && tx.leakFlags.length > 0) || tx.regretRating || tx.isImpulse) && (
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <AlertTriangle size={14} />
                <span>Leak Radar Telemetry</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {tx.isImpulse && (
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    ⚡ Impulse Purchase
                  </span>
                )}
                {tx.regretRating && (
                  <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                    Rating: {tx.regretRating}/5 Regret
                  </span>
                )}
                {tx.isSubscription && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                    🔄 Recurring Subscription
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="py-2.5 px-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-800/50"
            >
              <Trash2 size={14} />
              <span>Delete Transaction</span>
            </button>

            <button
              onClick={() => setSelectedTransactionForDetail(null)}
              className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={(reason) => {
          deleteTransaction(tx.id, reason);
          setIsDeleteModalOpen(false);
          setSelectedTransactionForDetail(null);
        }}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${tx.title}" (${formatMoney(tx.amount)})? Account and envelope balances will automatically be reversed.`}
        confirmText="Confirm Deletion"
        requireReason={true}
        reasonPlaceholder="Mandatory reason for deleting this transaction from the ledger..."
        isDangerous={true}
        itemDetails={[
          { label: 'Title', value: tx.title },
          { label: 'Amount', value: formatMoney(tx.amount) },
          { label: 'Date', value: tx.date }
        ]}
      />
    </>
  );
};
