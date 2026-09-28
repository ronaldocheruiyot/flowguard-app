import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  Sparkles, 
  DollarSign, 
  Edit3, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Debtor, DebtorStatus } from '../types/finance';

export const DebtorsTrackerView: React.FC = () => {
  const { 
    debtors, 
    addDebtor, 
    updateDebtor, 
    deleteDebtor, 
    collectDebtPayment, 
    totalPendingDebtReceivables, 
    formatMoney, 
    accounts,
    currency
  } = useFinance();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [collectingDebtor, setCollectingDebtor] = useState<Debtor | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amountOwed, setAmountOwed] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  // Collect Payment Modal state
  const [collectedAmount, setCollectedAmount] = useState('');
  const [receivingAccountId, setReceivingAccountId] = useState(accounts[0]?.id || 'acc-1');
  const [triggerSplit, setTriggerSplit] = useState(true);

  const filteredDebtors = debtors.filter(d => {
    if (filterStatus === 'all') return true;
    return d.status === filterStatus;
  });

  const handleOpenAdd = () => {
    setName('');
    setPhone('');
    setAmountOwed('');
    setDueDate('');
    setDescription('');
    setNotes('');
    setShowAddModal(true);
  };

  const handleCreateDebtor = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountOwed);
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid debtor name and amount owed.');
      return;
    }

    addDebtor({
      debtorName: name.trim(),
      phone: phone.trim() || undefined,
      amountOwed: numAmount,
      amountPaid: 0,
      dueDate: dueDate || undefined,
      description: description.trim() || 'Pending payment',
      status: 'pending',
      notes: notes.trim() || undefined
    });

    setShowAddModal(false);
  };

  const handleOpenCollect = (debtor: Debtor) => {
    setCollectingDebtor(debtor);
    const remaining = Math.max(0, debtor.amountOwed - debtor.amountPaid);
    setCollectedAmount(remaining.toString());
    setReceivingAccountId(accounts[0]?.id || 'acc-1');
  };

  const handleConfirmCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingDebtor) return;

    const numAmount = parseFloat(collectedAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    collectDebtPayment(collectingDebtor.id, numAmount, receivingAccountId, triggerSplit);
    setCollectingDebtor(null);
  };

  const getStatusBadge = (status: DebtorStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 size={10} /> Fully Settled
          </span>
        );
      case 'partially_paid':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock size={10} /> Partially Paid
          </span>
        );
      case 'doubtful':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <AlertCircle size={10} /> High Risk
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <Clock size={10} /> Awaiting Payment
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Users size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Debtors & Uncertain Inflows
              </h2>
              <p className="text-[11px] text-amber-300/80 font-medium">
                Track who owes you & convert to income when received
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold transition shadow-md shadow-amber-500/20 flex items-center gap-1 text-xs"
          >
            <Plus size={16} />
            <span>Add Debtor</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400">Total Uncollected Receivables:</span>
          <span className="text-base font-black text-amber-400">
            {formatMoney(totalPendingDebtReceivables)}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'All Debtors' },
          { id: 'pending', label: '⏳ Awaiting' },
          { id: 'partially_paid', label: '⚡ Partially Paid' },
          { id: 'paid', label: '✅ Settled' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-xs transition ${
              filterStatus === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Debtors List */}
      <div className="space-y-3">
        {filteredDebtors.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs space-y-2">
            <CheckCircle2 size={24} className="text-emerald-500 mx-auto" />
            <p>No debtors matching this filter.</p>
          </div>
        ) : (
          filteredDebtors.map((debtor) => {
            const remaining = Math.max(0, debtor.amountOwed - debtor.amountPaid);
            const isSettled = debtor.status === 'paid' || remaining === 0;

            return (
              <div 
                key={debtor.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        {debtor.debtorName}
                      </h3>
                      {getStatusBadge(debtor.status)}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {debtor.description}
                    </p>
                    {debtor.phone && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <Phone size={10} />
                        <span>{debtor.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-black ${isSettled ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {formatMoney(remaining)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Total: {formatMoney(debtor.amountOwed)}
                    </span>
                  </div>
                </div>

                {debtor.notes && (
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 italic">
                    "{debtor.notes}"
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  {!isSettled ? (
                    <button
                      onClick={() => handleOpenCollect(debtor)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Sparkles size={14} className="text-emerald-500 dark:text-emerald-400" />
                      <span>Collect Payment ({formatMoney(remaining)})</span>
                    </button>
                  ) : (
                    <div className="flex-1 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 py-1.5">
                      ✓ Debt cleared & deposited
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Remove ${debtor.debtorName} from records?`)) {
                        deleteDebtor(debtor.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition"
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Debtor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold">Add Person / Entity Who Owes Money</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDebtor} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Debtor Name / Business
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tenant Unit 4, Farm produce buyer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    Amount Owed ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="15000"
                    value={amountOwed}
                    onChange={(e) => setAmountOwed(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="tel"
                    placeholder="+254 7..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Description / Origin of Debt
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lonjo house rent balance, tea leaf adjustment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Expected Payment Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 mt-2"
              >
                Save Debtor Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {collectingDebtor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold">Record Debt Payment</h3>
                <p className="text-[10px] text-slate-400">From {collectingDebtor.debtorName}</p>
              </div>
              <button onClick={() => setCollectingDebtor(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmCollection} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Amount Received ({currency.symbol})
                </label>
                <input
                  type="number"
                  required
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg rounded-xl px-3 py-2.5 focus:outline-none font-black text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Deposit Into Account
                </label>
                <select
                  value={receivingAccountId}
                  onChange={(e) => setReceivingAccountId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({formatMoney(a.balance)})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                    Trigger 50/30/20 Auto-Split
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={triggerSplit}
                  onChange={(e) => setTriggerSplit(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 mt-2 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={16} />
                <span>Confirm Payment & Deposit {formatMoney(parseFloat(collectedAmount) || 0)}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
