import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2, RotateCcw, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RecycleBinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecycleBinModal: React.FC<RecycleBinModalProps> = ({ isOpen, onClose }) => {
  const { recycleBin, restoreDeletedItem, permanentlyDeleteItem, emptyRecycleBin, formatMoney } = useFinance();

  if (!isOpen) return null;

  const typeBadges: Record<string, { label: string; color: string }> = {
    transaction: { label: 'Transaction', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    debtor: { label: 'Debtor', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    expense: { label: 'Expense Stream', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    income: { label: 'Income Stream', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    envelope: { label: 'Envelope', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Trash2 size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recycle Bin & Audit Trail</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {recycleBin.length} deleted {recycleBin.length === 1 ? 'item' : 'items'} available to undo
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
          {recycleBin.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-500 opacity-60" />
              <p className="text-sm font-semibold">Recycle Bin is empty</p>
              <p className="text-xs mt-0.5">Nothing has been deleted.</p>
            </div>
          ) : (
            recycleBin.map((record) => {
              const badge = typeBadges[record.itemType] || { label: record.itemType, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
              const dateStr = new Date(record.deletedAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={record.id}
                  className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2.5 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{dateStr}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {record.title}
                    </h3>
                    {record.itemType === 'transaction' && record.data?.amount && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Amount: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatMoney(record.data.amount)}</span>
                      </p>
                    )}
                    {record.itemType === 'debtor' && record.data?.amountOwed && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Debt Claim: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatMoney(record.data.amountOwed)}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => restoreDeletedItem(record.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold hover:bg-emerald-500/20 active:scale-95 transition"
                      title="Restore item back"
                    >
                      <RotateCcw size={12} />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => permanentlyDeleteItem(record.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="Permanently remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {recycleBin.length > 0 && (
          <div className="p-3 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Items can be restored anytime
            </span>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to empty the Recycle Bin permanently?')) {
                  emptyRecycleBin();
                }
              }}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-500/10"
            >
              <Trash2 size={12} />
              <span>Empty Bin</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
