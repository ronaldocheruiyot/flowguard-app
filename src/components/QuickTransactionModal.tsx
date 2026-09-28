import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  PlusCircle, 
  MinusCircle, 
  ArrowRightLeft, 
  Tag, 
  Calendar, 
  Wallet, 
  Repeat, 
  Zap, 
  Sparkles,
  Star
} from 'lucide-react';
import { TransactionType, LeakType } from '../types/finance';

export const QuickTransactionModal: React.FC = () => {
  const { 
    isAddModalOpen, 
    setIsAddModalOpen, 
    addTransaction, 
    categories, 
    accounts, 
    envelopes, 
    currency 
  } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<string>(categories[2]?.id || 'cat-groceries');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || 'acc-1');
  const [envelopeId, setEnvelopeId] = useState<string>(envelopes[1]?.id || 'env-groceries');
  const [note, setNote] = useState('');
  
  // Leak Flags
  const [isSubscription, setIsSubscription] = useState(false);
  const [isImpulse, setIsImpulse] = useState(false);
  const [isConvenienceFee, setIsConvenienceFee] = useState(false);
  const [regretRating, setRegretRating] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [triggerAllocationOnIncome, setTriggerAllocationOnIncome] = useState(true);

  if (!isAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid title and positive amount.');
      return;
    }

    const leakFlags: LeakType[] = [];
    if (isSubscription && regretRating >= 4) leakFlags.push('zombie_subscription');
    if (isImpulse) leakFlags.push('impulse_regret');
    if (isConvenienceFee) leakFlags.push('convenience_fee');
    if (numAmount <= 15 && type === 'expense') leakFlags.push('micro_spending');

    addTransaction(
      {
        title: title.trim(),
        amount: numAmount,
        type,
        date,
        categoryId: type === 'income' ? 'cat-income-salary' : categoryId,
        accountId,
        envelopeId: type === 'expense' ? envelopeId : undefined,
        note: note.trim() || undefined,
        isSubscription,
        isImpulse,
        isConvenienceFee,
        regretRating: type === 'expense' ? regretRating : undefined,
        leakFlags: leakFlags.length > 0 ? leakFlags : undefined
      },
      type === 'income' && triggerAllocationOnIncome
    );

    setIsAddModalOpen(false);
    // Reset form
    setTitle('');
    setAmount('');
    setNote('');
    setIsSubscription(false);
    setIsImpulse(false);
    setIsConvenienceFee(false);
    setRegretRating(1);
  };

  const filteredCategories = categories.filter(c => {
    if (type === 'income') return c.group === 'income';
    return c.group !== 'income';
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Record Transaction
          </h2>
          <button 
            onClick={() => setIsAddModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 text-sm font-semibold rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Type Selector (Expense / Income / Transfer) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-glow-red'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MinusCircle size={14} />
            <span>Expense</span>
          </button>

          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-glow-green'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle size={14} />
            <span>Income</span>
          </button>

          <button
            type="button"
            onClick={() => setType('transfer')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              type === 'transfer'
                ? 'bg-cyan-500 text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft size={14} />
            <span>Transfer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Amount Input */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 text-center">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {type === 'expense' ? 'Amount Spent' : type === 'income' ? 'Amount Received' : 'Transfer Amount'}
            </label>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className={`text-2xl font-black ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currency.symbol}
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-3xl font-black text-white focus:outline-none w-48 text-center"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Description / Merchant
            </label>
            <input
              type="text"
              required
              placeholder={type === 'expense' ? 'e.g. Starbucks, Netflix, Whole Foods' : 'e.g. Salary, Client Payout'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-sm text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category & Account Selectors */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Account
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* If Expense: Envelope Vault Assignment */}
          {type === 'expense' && (
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Deduct from Envelope Vault
              </label>
              <select
                value={envelopeId}
                onChange={(e) => setEnvelopeId(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="">None (Unbudgeted)</option>
                {envelopes.map(env => (
                  <option key={env.id} value={env.id}>
                    {env.name} (Remaining: {currency.symbol}{env.currentAmount.toFixed(0)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Leak Detection Flags (For Expenses) */}
          {type === 'expense' && (
            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>LeakRadar Tags</span>
                <span className="text-cyan-400 font-semibold">Helps find money drains</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubscription(!isSubscription)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition ${
                    isSubscription
                      ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Repeat size={12} />
                  <span>Subscription</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsImpulse(!isImpulse)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition ${
                    isImpulse
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Zap size={12} />
                  <span>Impulse Buy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsConvenienceFee(!isConvenienceFee)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition ${
                    isConvenienceFee
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Tag size={12} />
                  <span>Fee / Surcharge</span>
                </button>
              </div>

              {/* Regret / Value Rating */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Regret / Remorse Meter:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRegretRating(val as 1 | 2 | 3 | 4 | 5)}
                      className={`p-1 rounded hover:scale-110 transition ${
                        regretRating >= val ? 'text-amber-400' : 'text-slate-600'
                      }`}
                      title={val >= 4 ? 'High Regret (Leak)' : 'Good value'}
                    >
                      <Star size={16} fill={regretRating >= val ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Income specific: Trigger Allocation Flow */}
          {type === 'income' && (
            <div className="p-3 bg-emerald-950/30 rounded-2xl border border-emerald-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-200 font-semibold">
                  Launch Payday Allocation Wizard
                </span>
              </div>
              <input
                type="checkbox"
                checked={triggerAllocationOnIncome}
                onChange={(e) => setTriggerAllocationOnIncome(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>
          )}

          {/* Date & Optional Note */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl px-2.5 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Note (Optional)
              </label>
              <input
                type="text"
                placeholder="Details..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl px-2.5 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:opacity-95 active:scale-[0.98] transition mt-2"
          >
            Save Record
          </button>
        </form>
      </div>
    </div>
  );
};
