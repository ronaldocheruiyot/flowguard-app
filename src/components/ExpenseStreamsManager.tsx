import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Award, 
  UserCheck, 
  GlassWater, 
  Fuel, 
  HeartHandshake, 
  Shield, 
  Wrench, 
  Leaf, 
  ShoppingCart, 
  Plus, 
  Edit3, 
  Trash2, 
  MinusCircle, 
  Sparkles, 
  Sliders, 
  TrendingDown, 
  Wallet,
  Star
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';
import { CategoryGroup, ExpenseCenter } from '../types/finance';

export const ExpenseStreamsManager: React.FC = () => {
  const { 
    expenseCenters, 
    addExpenseCenter, 
    updateExpenseCenter, 
    deleteExpenseCenter, 
    totalMonthlyExpenseBudget, 
    formatMoney, 
    addTransaction,
    accounts, 
    envelopes,
    currency 
  } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseCenter | null>(null);
  const [quickLogExpense, setQuickLogExpense] = useState<ExpenseCenter | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [group, setGroup] = useState<CategoryGroup>('wants');
  const [description, setDescription] = useState('');
  const [defaultAccountId, setDefaultAccountId] = useState(accounts[0]?.id || 'acc-1');
  const [envelopeId, setEnvelopeId] = useState(envelopes[0]?.id || '');
  const [icon, setIcon] = useState('GlassWater');
  const [color, setColor] = useState('#f97316');
  const [isSubscription, setIsSubscription] = useState(false);

  // Quick Log Form fields
  const [quickAmount, setQuickAmount] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [quickAccountId, setQuickAccountId] = useState('');
  const [quickRegret, setQuickRegret] = useState<1 | 2 | 3 | 4 | 5>(1);

  const handleOpenAdd = () => {
    setTitle('');
    setBudget('');
    setGroup('wants');
    setDescription('');
    setIcon('GlassWater');
    setColor('#f97316');
    setIsSubscription(false);
    setEditingExpense(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (exp: ExpenseCenter) => {
    setEditingExpense(exp);
    setTitle(exp.title);
    setBudget(exp.expectedMonthlyBudget.toString());
    setGroup(exp.group);
    setDescription(exp.description);
    setDefaultAccountId(exp.defaultAccountId);
    setEnvelopeId(exp.envelopeId || '');
    setIcon(exp.icon);
    setColor(exp.color);
    setIsSubscription(exp.isRecurringSubscription || false);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numBudget = parseFloat(budget);
    if (!title.trim() || isNaN(numBudget) || numBudget <= 0) {
      alert('Please enter a valid expense name and budget amount.');
      return;
    }

    if (editingExpense) {
      updateExpenseCenter(editingExpense.id, {
        title: title.trim(),
        expectedMonthlyBudget: numBudget,
        group,
        description: description.trim(),
        defaultAccountId,
        envelopeId: envelopeId || undefined,
        icon,
        color,
        isRecurringSubscription: isSubscription
      });
    } else {
      addExpenseCenter({
        title: title.trim(),
        expectedMonthlyBudget: numBudget,
        group,
        categoryId: 'cat-fees',
        defaultAccountId,
        envelopeId: envelopeId || undefined,
        icon,
        color,
        description: description.trim(),
        isRecurringSubscription: isSubscription
      });
    }

    setShowAddModal(false);
    setEditingExpense(null);
  };

  const handleOpenQuickLog = (exp: ExpenseCenter) => {
    setQuickLogExpense(exp);
    setQuickAmount(exp.expectedMonthlyBudget.toString());
    setQuickAccountId(exp.defaultAccountId || accounts[0]?.id || 'acc-1');
    setQuickNote('');
    setQuickRegret(1);
  };

  const handleConfirmQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogExpense) return;

    const numAmount = parseFloat(quickAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    addTransaction({
      title: quickLogExpense.title,
      amount: numAmount,
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      categoryId: quickLogExpense.categoryId,
      accountId: quickAccountId,
      envelopeId: quickLogExpense.envelopeId,
      expenseCenterId: quickLogExpense.id,
      note: quickNote.trim() || undefined,
      isSubscription: quickLogExpense.isRecurringSubscription,
      regretRating: quickRegret,
      leakFlags: quickRegret >= 4 ? ['impulse_regret'] : undefined
    });

    setQuickLogExpense(null);
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-900 border border-rose-500/30 shadow-2xl text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <TrendingDown size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Benard Cheruiyot Expense Outflows
              </h2>
              <p className="text-[11px] text-rose-300/80 font-medium">
                Golf, Beer, Fuel, Harambee Donations & Operations
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="p-2 rounded-xl bg-rose-500 text-white font-bold transition shadow-md shadow-rose-500/20 flex items-center gap-1 text-xs"
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400">Monthly Planned Outflow Budget:</span>
          <span className="text-base font-black text-rose-400">
            -{formatMoney(totalMonthlyExpenseBudget)}
          </span>
        </div>
      </div>

      {/* Expense Cost Centers List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 px-1 flex items-center justify-between">
          <span>Active Cost Centers ({expenseCenters.length})</span>
          <span className="text-[10px] text-slate-400">Tap to edit or fast log</span>
        </div>

        {expenseCenters.map((exp) => {
          const acc = accounts.find(a => a.id === exp.defaultAccountId);
          const env = envelopes.find(e => e.id === exp.envelopeId);

          return (
            <div 
              key={exp.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: exp.color + '22', color: exp.color }}
                  >
                    <DynamicIcon name={exp.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                      <span>{exp.title}</span>
                      {exp.isRecurringSubscription && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded font-semibold border border-purple-500/30">
                          Monthly Card Sub
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {exp.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                    -{formatMoney(exp.expectedMonthlyBudget)}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {exp.group}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => handleOpenQuickLog(exp)}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <MinusCircle size={14} className="text-rose-500 dark:text-rose-400" />
                  <span>Log Expense ({formatMoney(exp.expectedMonthlyBudget)})</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Edit Expense"
                >
                  <Edit3 size={14} />
                </button>

                {expenseCenters.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${exp.title}" from expense centers?`)) {
                        deleteExpenseCenter(exp.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition"
                    title="Delete Expense"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold">
                {editingExpense ? 'Edit Expense Budget' : 'Add New Expense Item'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Expense Name / Activity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Golf Caddy Tips, Fuel, Beer, Harambee"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    Monthly Budget ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="15000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    Classification
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value as CategoryGroup)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-2 py-2.5 focus:outline-none"
                  >
                    <option value="needs">Needs (50%)</option>
                    <option value="wants">Wants / Leisure (30%)</option>
                    <option value="savings">Savings / Goals (20%)</option>
                    <option value="debt">Debt / Loan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly caddy payment, clubhouse drinks, Harambees"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Default Account</label>
                  <select
                    value={defaultAccountId}
                    onChange={(e) => setDefaultAccountId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-2 py-2 focus:outline-none"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Digital Envelope</label>
                  <select
                    value={envelopeId}
                    onChange={(e) => setEnvelopeId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-2 py-2 focus:outline-none"
                  >
                    <option value="">General Vault</option>
                    {envelopes.map(env => (
                      <option key={env.id} value={env.id}>{env.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-semibold">Recurring Monthly Subscription (Card)</span>
                <input
                  type="checkbox"
                  checked={isSubscription}
                  onChange={(e) => setIsSubscription(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 mt-2"
              >
                {editingExpense ? 'Save Changes' : 'Create Expense Item'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Log Expense Modal */}
      {quickLogExpense && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold">Log Expense</h3>
                <p className="text-[10px] text-slate-400">{quickLogExpense.title}</p>
              </div>
              <button onClick={() => setQuickLogExpense(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmQuickLog} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Amount Spent ({currency.symbol})
                </label>
                <input
                  type="number"
                  required
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg rounded-xl px-3 py-2.5 focus:outline-none font-black text-rose-600 dark:text-rose-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Deduct From Account
                </label>
                <select
                  value={quickAccountId}
                  onChange={(e) => setQuickAccountId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({formatMoney(a.balance)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Note / Location / Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Caddy tip on 18th hole, TotalEnergies fuel, Church fundraiser"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-600 dark:text-slate-300">Regret / Worth Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setQuickRegret(val as 1 | 2 | 3 | 4 | 5)}
                      className={`p-1 rounded ${
                        quickRegret >= val ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    >
                      <Star size={14} fill={quickRegret >= val ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 mt-2 flex items-center justify-center gap-1.5"
              >
                <MinusCircle size={16} />
                <span>Confirm & Deduct {formatMoney(parseFloat(quickAmount) || 0)}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
