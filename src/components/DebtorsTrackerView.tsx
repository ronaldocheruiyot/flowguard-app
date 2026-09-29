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
  Check,
  CreditCard,
  Calendar,
  History,
  FileText,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Debtor, DebtorStatus } from '../types/finance';
import { ConfirmActionModal } from './ConfirmActionModal';

export const DebtorsTrackerView: React.FC = () => {
  const { 
    debtors, 
    addDebtor, 
    updateDebtor, 
    deleteDebtor, 
    collectDebtPayment, 
    totalPendingDebtReceivables,
    totalDebtCollected, 
    formatMoney, 
    accounts,
    currency
  } = useFinance();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState<Debtor | null>(null);
  const [deletingDebtor, setDeletingDebtor] = useState<Debtor | null>(null);
  const [collectingDebtor, setCollectingDebtor] = useState<Debtor | null>(null);
  const [expandedDebtorId, setExpandedDebtorId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amountOwed, setAmountOwed] = useState('');
  const [amountPaid, setAmountPaid] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [editReason, setEditReason] = useState('');

  // Collect Payment Modal state
  const [collectedAmount, setCollectedAmount] = useState('');
  const [receivingAccountId, setReceivingAccountId] = useState(accounts[0]?.id || 'acc-1');
  const [collectNote, setCollectNote] = useState('');
  const [triggerSplit, setTriggerSplit] = useState(true);

  const filteredDebtors = debtors.filter(d => {
    if (filterStatus === 'all') return true;
    return d.status === filterStatus;
  });

  const handleOpenAdd = () => {
    setName('');
    setPhone('');
    setAmountOwed('');
    setAmountPaid('0');
    setDueDate('');
    setDescription('');
    setNotes('');
    setEditReason('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (debtor: Debtor) => {
    setEditingDebtor(debtor);
    setName(debtor.debtorName);
    setPhone(debtor.phone || '');
    setAmountOwed(debtor.amountOwed.toString());
    setAmountPaid(debtor.amountPaid.toString());
    setDueDate(debtor.dueDate || '');
    setDescription(debtor.description);
    setNotes(debtor.notes || '');
    setEditReason('');
  };

  const handleSaveDebtor = (e: React.FormEvent) => {
    e.preventDefault();
    const numOwed = parseFloat(amountOwed);
    const numPaid = parseFloat(amountPaid) || 0;

    if (!name.trim() || isNaN(numOwed) || numOwed <= 0) {
      alert('Please enter a valid debtor name and positive amount owed.');
      return;
    }

    const computedStatus: DebtorStatus = numPaid >= numOwed ? 'paid' : numPaid > 0 ? 'partially_paid' : 'pending';

    if (editingDebtor) {
      updateDebtor(editingDebtor.id, {
        debtorName: name.trim(),
        phone: phone.trim() || undefined,
        amountOwed: numOwed,
        amountPaid: numPaid,
        dueDate: dueDate || undefined,
        description: description.trim() || 'Pending payment',
        status: computedStatus,
        notes: notes.trim() || undefined
      }, editReason || 'Updated debtor receivable record');
      setEditingDebtor(null);
    } else {
      addDebtor({
        debtorName: name.trim(),
        phone: phone.trim() || undefined,
        amountOwed: numOwed,
        amountPaid: numPaid,
        dueDate: dueDate || undefined,
        description: description.trim() || 'Pending payment',
        status: computedStatus,
        notes: notes.trim() || undefined
      }, editReason || 'Registered new debtor receivable');
      setShowAddModal(false);
    }
  };

  const handleOpenCollect = (debtor: Debtor) => {
    setCollectingDebtor(debtor);
    const remaining = Math.max(0, debtor.amountOwed - debtor.amountPaid);
    setCollectedAmount(remaining.toString());
    setReceivingAccountId(accounts[0]?.id || 'acc-1');
    setCollectNote(`Collected receivable from ${debtor.debtorName}`);
    setTriggerSplit(true);
  };

  const handleConfirmCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingDebtor) return;

    const numAmount = parseFloat(collectedAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    collectDebtPayment(
      collectingDebtor.id, 
      numAmount, 
      receivingAccountId, 
      collectNote.trim() || undefined, 
      triggerSplit
    );
    setCollectingDebtor(null);
  };

  const getStatusBadge = (status: DebtorStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 size={10} /> Fully Settled
          </span>
        );
      case 'partially_paid':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock size={10} /> Partially Paid
          </span>
        );
      case 'doubtful':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <AlertCircle size={10} /> High Risk
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <Clock size={10} /> Awaiting Payment
          </span>
        );
    }
  };

  const totalOwedAll = debtors.reduce((sum, d) => sum + d.amountOwed, 0);
  const paidCount = debtors.filter(d => d.status === 'paid').length;
  const partialCount = debtors.filter(d => d.status === 'partially_paid').length;
  const pendingCount = debtors.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6 pb-20 pt-1 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Users size={20} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Receivables & Debt Recovery
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Debtors & Uncertain Inflows Ledger
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Track outstanding tenant arrears (Lonjo Rentals), guard service invoices (Security Co), and tea leaf bonuses. Collecting payments directly registers as Income in your financial ledger.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-2xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition shrink-0"
          >
            <Plus size={16} />
            <span>Register Debtor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uncollected Receivables</p>
          <p className="text-xl font-black text-amber-400 mt-1">{formatMoney(totalPendingDebtReceivables)}</p>
          <p className="text-[10px] text-slate-400 mt-1">{pendingCount + partialCount} pending recovery</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recovered Inflow</p>
          <p className="text-xl font-black text-emerald-400 mt-1">+{formatMoney(totalDebtCollected)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Deposited into liquid accounts</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Debt Baseline</p>
          <p className="text-xl font-black text-slate-200 mt-1">{formatMoney(totalOwedAll)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Cumulative invoices & dues</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settlement Breakdown</p>
          <div className="flex items-center gap-2 mt-1 text-xs font-bold">
            <span className="text-emerald-400">{paidCount} Settled</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400">{partialCount} Partial</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{pendingCount} awaiting first payment</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: `All Debtors (${debtors.length})` },
          { id: 'pending', label: `⏳ Awaiting (${pendingCount})` },
          { id: 'partially_paid', label: `⚡ Partially Paid (${partialCount})` },
          { id: 'paid', label: `✅ Settled (${paidCount})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap text-xs transition border ${
              filterStatus === tab.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Debtors List */}
      <div className="space-y-3">
        {filteredDebtors.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs space-y-2">
            <CheckCircle2 size={32} className="text-emerald-500 mx-auto opacity-60" />
            <p className="font-bold text-slate-300">No debtors matching this filter.</p>
            <p className="text-slate-500">All balances are up to date.</p>
          </div>
        ) : (
          filteredDebtors.map((debtor) => {
            const remaining = Math.max(0, debtor.amountOwed - debtor.amountPaid);
            const isSettled = debtor.status === 'paid' || remaining === 0;
            const progressPercent = debtor.amountOwed > 0 
              ? Math.min(100, Math.round((debtor.amountPaid / debtor.amountOwed) * 100))
              : 100;
            const isExpanded = expandedDebtorId === debtor.id;

            return (
              <div 
                key={debtor.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition shadow-sm"
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {debtor.debtorName}
                      </h3>
                      {getStatusBadge(debtor.status)}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {debtor.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      {debtor.phone && (
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <Phone size={11} className="text-amber-400" />
                          <span>{debtor.phone}</span>
                        </span>
                      )}
                      {debtor.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-slate-500" />
                          <span>Due: {debtor.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Unpaid Balance</span>
                    <div className={`text-base font-black ${isSettled ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {formatMoney(remaining)}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Owed: {formatMoney(debtor.amountOwed)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-500 ${isSettled ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Collected: {formatMoney(debtor.amountPaid)} ({progressPercent}%)</span>
                    <span>Total Invoiced: {formatMoney(debtor.amountOwed)}</span>
                  </div>
                </div>

                {debtor.notes && (
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 italic flex items-center gap-2">
                    <FileText size={13} className="text-amber-400 shrink-0" />
                    <span>"{debtor.notes}"</span>
                  </div>
                )}

                {/* Payment History Toggle & Accordion */}
                {debtor.paymentHistory && debtor.paymentHistory.length > 0 && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setExpandedDebtorId(isExpanded ? null : debtor.id)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <History size={13} />
                      <span>{isExpanded ? 'Hide' : 'View'} Collection Payment History ({debtor.paymentHistory.length})</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-950/90 rounded-2xl p-3 border border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
                        {debtor.paymentHistory.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-400">+{formatMoney(p.amount)}</span>
                                <span className="text-[10px] text-slate-400">via {p.accountName || 'Account'}</span>
                              </div>
                              {p.note && <p className="text-[10px] text-slate-400 italic mt-0.5">{p.note}</p>}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{p.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  {!isSettled ? (
                    <button
                      onClick={() => handleOpenCollect(debtor)}
                      className="flex-1 py-2 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40"
                    >
                      <CreditCard size={14} />
                      <span>Collect & Deposit Payment</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 py-1">
                      <CheckCircle2 size={15} />
                      <span>Debt Fully Settled</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(debtor)}
                      className="py-2 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingDebtor(debtor)}
                      className="p-2 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                      title="Delete Debtor"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Collect Payment Modal */}
      {collectingDebtor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-400" />
                <span>Collect Debt Receivable</span>
              </h3>
              <button 
                onClick={() => setCollectingDebtor(null)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Debtor:</span>
                <span className="font-bold text-white">{collectingDebtor.debtorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="font-bold text-amber-400">
                  {formatMoney(Math.max(0, collectingDebtor.amountOwed - collectingDebtor.amountPaid))}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmCollection} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Amount Collected ({currency.code})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-lg font-bold text-emerald-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Deposit Into Account
                </label>
                <select
                  value={receivingAccountId}
                  onChange={(e) => setReceivingAccountId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatMoney(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Payment Note / Reference
                </label>
                <input
                  type="text"
                  value={collectNote}
                  onChange={(e) => setCollectNote(e.target.value)}
                  placeholder="e.g. Cleared 2 months back rent via M-PESA"
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="triggerSplitCheck"
                  checked={triggerSplit}
                  onChange={(e) => setTriggerSplit(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="triggerSplitCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Launch Auto-Split to ring-fence into Savings / MMF Vaults
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCollectingDebtor(null)}
                  className="py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/50"
                >
                  Confirm & Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Debtor Modal */}
      {(showAddModal || editingDebtor) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-amber-400" />
                <span>{editingDebtor ? 'Edit Debtor Record' : 'Register New Debtor Receivable'}</span>
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingDebtor(null); }}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDebtor} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Debtor / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kiprono (Lonjo Rentals Unit 4)"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Amount Owed *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amountOwed}
                    onChange={(e) => setAmountOwed(e.target.value)}
                    placeholder="15000"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Amount Already Paid
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Expected Settlement Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Description / Origin of Debt
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 2 months back rent arrears for Lonjo apartment"
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Internal Notes / Promises
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Promised to clear via M-PESA on 5th"
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              {editingDebtor && (
                <div>
                  <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Reason for Modification (Audit Trail) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder="e.g. Reconciled invoice amount with tenant"
                    className="w-full bg-slate-800 border border-amber-500/50 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingDebtor(null); }}
                  className="py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-950/50"
                >
                  {editingDebtor ? 'Save Changes' : 'Register Debtor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Reason */}
      <ConfirmActionModal
        isOpen={!!deletingDebtor}
        onClose={() => setDeletingDebtor(null)}
        onConfirm={(deleteReason) => {
          if (deletingDebtor) {
            deleteDebtor(deletingDebtor.id, deleteReason);
            setDeletingDebtor(null);
          }
        }}
        title="Delete Debtor Record"
        message={`Are you sure you want to delete "${deletingDebtor?.debtorName}"? This action will remove the receivable from the ledger and record the event in the audit trail.`}
        confirmText="Confirm Deletion"
        requireReason={true}
        reasonPlaceholder="Mandatory reason for removing this debtor record..."
        isDangerous={true}
        itemDetails={deletingDebtor ? [
          { label: 'Debtor Name', value: deletingDebtor.debtorName },
          { label: 'Amount Owed', value: formatMoney(deletingDebtor.amountOwed) },
          { label: 'Amount Paid', value: formatMoney(deletingDebtor.amountPaid) }
        ] : []}
      />
    </div>
  );
};
