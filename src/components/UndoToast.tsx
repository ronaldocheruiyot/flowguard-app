import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { RotateCcw, Trash2, X } from 'lucide-react';

export const UndoToast: React.FC = () => {
  const { lastDeletedItem, undoLastDelete, clearLastDeletedItem } = useFinance();

  if (!lastDeletedItem) return null;

  const typeLabels: Record<string, string> = {
    transaction: 'Transaction',
    debtor: 'Debtor',
    expense: 'Expense Stream',
    income: 'Income Stream',
    envelope: 'Envelope'
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900 dark:bg-slate-800 text-white p-3 px-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Trash2 size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate leading-tight">
              {lastDeletedItem.title}
            </p>
            <p className="text-[10px] text-slate-400">
              {typeLabels[lastDeletedItem.itemType] || 'Item'} deleted
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={undoLastDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold shadow-md transition-all"
          >
            <RotateCcw size={12} />
            <span>Undo</span>
          </button>
          <button
            onClick={clearLastDeletedItem}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
