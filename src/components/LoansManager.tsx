import React, { useState } from 'react';
import { 
  Landmark, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Percent, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  ChevronRight,
  History,
  CreditCard
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Loan } from '../types/finance';
import { ConfirmActionModal } from './ConfirmActionModal';

export const LoansManager: React.FC = () => {
  const { 
    loans, 
    addLoan, 
    updateLoan, 
    deleteLoan, 
    repayLoan, 
    accounts, 
    formatMoney, 
    currency 
  } = useFinance();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [repayingLoan, setRepayingLoan] = useState<Loan | null>(null);
  const [deletingLoan, setDeletingLoan] = useState<Loan | null>(null);

  // Repayment form state
  const [repayAmount, setRepayAmount] = useState('');
  const [repayAccountId, setRepayAccountId] = useState(accounts[1]?.id || accounts[0]?.id || 'acc-2');
  const [repayNote, setRepayNote] = useState('');

  // Add/Edit Form State
  const [title, setTitle] = useState('');
  const [lender, setLender] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [remainingBalance, setRemainingBalance] = useState('');
  const [interestRate, setInterestRate] = useState('12');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');

  const openAddModal = () => {
    setTitle('');
    setLender('');
    setPrincipalAmount('');
    setRemainingBalance('');
    setInterestRate('12');
    setMonthlyInstallment('');
    setDueDate('15th of every month');
    setDescription('');
    setReason('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (loan: Loan) => {
    setEditingLoan(loan);
    setTitle(loan.title);
    setLender(loan.lender);
    setPrincipalAmount(loan.principalAmount.toString());
    setRemainingBalance(loan.remainingBalance.toString());
    setInterestRate(loan.interestRate.toString());
    setMonthlyInstallment(loan.monthlyInstallment.toString());
    setDueDate(loan.dueDate);
    setDescription(loan.description || '');
    setReason('');
  };

  const openRepayModal = (loan: Loan) => {
    setRepayingLoan(loan);
    setRepayAmount(loan.monthlyInstallment.toString());
    setRepayAccountId(loan.defaultAccountId || accounts[0]?.id || 'acc-2');
    setRepayNote(`Monthly installment amortization to ${loan.lender}`);
  };

  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const principal = parseFloat(principalAmount);
    const remaining = parseFloat(remainingBalance);
    const rate = parseFloat(interestRate);
    const installment = parseFloat(monthlyInstallment);

    if (!title.trim() || isNaN(principal) || isNaN(remaining)) {
      alert('Please fill out all required numeric fields.');
      return;
    }

    if (editingLoan) {
      updateLoan(editingLoan.id, {
        title: title.trim(),
        lender: lender.trim(),
        principalAmount: principal,
        remainingBalance: remaining,
        interestRate: rate,
        monthlyInstallment: installment,
        dueDate: dueDate.trim(),
        description: description.trim()
      }, reason || 'Updated loan facility terms');
      setEditingLoan(null);
    } else {
      addLoan({
        title: title.trim(),
        lender: lender.trim(),
        principalAmount: principal,
        remainingBalance: remaining,
        interestRate: rate,
        monthlyInstallment: installment,
        dueDate: dueDate.trim(),
        description: description.trim(),
        status: remaining <= 0 ? 'paid_off' : 'active',
        defaultAccountId: accounts[1]?.id || 'acc-2'
      }, reason || 'Added new SACCO / bank credit facility');
      setIsAddModalOpen(false);
    }
  };

  const handleExecuteRepay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayingLoan) return;
    const numAmount = parseFloat(repayAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive repayment amount.');
      return;
    }

    repayLoan(repayingLoan.id, numAmount, repayAccountId, repayNote.trim());
    setRepayingLoan(null);
  };

  // Summaries
  const totalPrincipal = loans.reduce((sum, l) => sum + l.principalAmount, 0);
  const totalRemaining = loans.reduce((sum, l) => sum + l.remainingBalance, 0);
  const totalMonthlyDue = loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.monthlyInstallment, 0);
  const overallAmortizedPercent = totalPrincipal > 0 ? Math.round(((totalPrincipal - totalRemaining) / totalPrincipal) * 100) : 0;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-900/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Landmark size={20} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Liabilities & Debt Amortization
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Loans & SACCO Debt Manager
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Track commercial loan facilities (K&M SACCO, Imarisha SACCO, Personal/Fuliza), monitor amortization progress, and log monthly installments directly into your expense ledger.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition shrink-0"
          >
            <Plus size={16} />
            <span>Add Loan Facility</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Remaining Debt</p>
          <p className="text-xl font-black text-rose-400 mt-1">{formatMoney(totalRemaining)}</p>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">{overallAmortizedPercent}%</span> amortized so far
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Commitment</p>
          <p className="text-xl font-black text-white mt-1">{formatMoney(totalMonthlyDue)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Due every month</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original Borrowed</p>
          <p className="text-xl font-black text-slate-300 mt-1">{formatMoney(totalPrincipal)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Total principal baseline</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Facilities</p>
          <p className="text-xl font-black text-cyan-400 mt-1">
            {loans.filter(l => l.status === 'active').length} <span className="text-xs text-slate-400 font-normal">Active</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {loans.filter(l => l.status === 'paid_off').length} Paid in Full
          </p>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Active & Historical Facilities</span>
          <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {loans.length}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loans.map(loan => {
            const isPaidOff = loan.status === 'paid_off' || loan.remainingBalance <= 0;
            const paidAmount = Math.max(0, loan.principalAmount - loan.remainingBalance);
            const progressPercent = loan.principalAmount > 0 
              ? Math.min(100, Math.round((paidAmount / loan.principalAmount) * 100))
              : 100;

            return (
              <div 
                key={loan.id}
                className={`bg-slate-900/90 border rounded-3xl p-5 space-y-4 shadow-lg transition flex flex-col justify-between ${
                  isPaidOff ? 'border-emerald-500/30 opacity-80' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-2xl ${isPaidOff ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        <Landmark size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">{loan.title}</h3>
                        <p className="text-xs font-semibold text-slate-400">{loan.lender}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPaidOff 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {isPaidOff ? 'Paid Off' : 'Active'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Remaining Balance:</span>
                      <span className="font-bold text-white">{formatMoney(loan.remainingBalance)}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isPaidOff ? 'bg-emerald-400' : 'bg-rose-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Paid: {formatMoney(paidAmount)} ({progressPercent}%)</span>
                      <span>Principal: {formatMoney(loan.principalAmount)}</span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Monthly Installment</span>
                      <span className="font-bold text-slate-200">{formatMoney(loan.monthlyInstallment)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Interest Rate</span>
                      <span className="font-bold text-cyan-400">{loan.interestRate}% p.a.</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar size={12} /> {loan.dueDate}
                      </span>
                    </div>
                  </div>

                  {loan.description && (
                    <p className="text-[11px] text-slate-400 italic mt-3 line-clamp-2">
                      "{loan.description}"
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  {!isPaidOff && (
                    <button
                      onClick={() => openRepayModal(loan)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <CreditCard size={14} />
                      <span>Log Amortization Repayment</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditModal(loan)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingLoan(loan)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                      title="Delete Loan Facility"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Repay Modal */}
      {repayingLoan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-400" />
                <span>Log Loan Repayment</span>
              </h3>
              <button 
                onClick={() => setRepayingLoan(null)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Facility:</span>
                <span className="font-bold text-white">{repayingLoan.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lender:</span>
                <span className="text-slate-300">{repayingLoan.lender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Remaining Balance:</span>
                <span className="font-bold text-rose-400">{formatMoney(repayingLoan.remainingBalance)}</span>
              </div>
            </div>

            <form onSubmit={handleExecuteRepay} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Repayment Amount ({currency.code})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-lg font-bold text-emerald-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Deduct From Account
                </label>
                <select
                  value={repayAccountId}
                  onChange={(e) => setRepayAccountId(e.target.value)}
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
                  Note / Reference
                </label>
                <input
                  type="text"
                  value={repayNote}
                  onChange={(e) => setRepayNote(e.target.value)}
                  placeholder="e.g. September SACCO checkoff"
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRepayingLoan(null)}
                  className="py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/50"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Loan Modal */}
      {(isAddModalOpen || editingLoan) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Landmark size={18} className="text-rose-400" />
                <span>{editingLoan ? 'Edit Loan Facility' : 'Add New Credit Facility'}</span>
              </h3>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingLoan(null); }}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLoan} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. K&M SACCO Commercial Loan"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Lender / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={lender}
                    onChange={(e) => setLender(e.target.value)}
                    placeholder="e.g. Imarisha SACCO / KCB Bank"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Principal Amount *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={principalAmount}
                    onChange={(e) => setPrincipalAmount(e.target.value)}
                    placeholder="350000"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Remaining Balance *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={remainingBalance}
                    onChange={(e) => setRemainingBalance(e.target.value)}
                    placeholder="180000"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Monthly Installment *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={monthlyInstallment}
                    onChange={(e) => setMonthlyInstallment(e.target.value)}
                    placeholder="20000"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="12.0"
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Repayment Schedule / Due Date
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. 15th of every month"
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Security patrol vehicles procurement"
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              {editingLoan && (
                <div>
                  <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Reason for Modification (Audit Trail) *
                  </label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Restructured repayment period with SACCO"
                    className="w-full bg-slate-800 border border-amber-500/50 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingLoan(null); }}
                  className="py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/50"
                >
                  {editingLoan ? 'Save Changes' : 'Create Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Reason */}
      <ConfirmActionModal
        isOpen={!!deletingLoan}
        onClose={() => setDeletingLoan(null)}
        onConfirm={(deleteReason) => {
          if (deletingLoan) {
            deleteLoan(deletingLoan.id, deleteReason);
            setDeletingLoan(null);
          }
        }}
        title="Delete Loan Facility"
        message={`Are you sure you want to delete "${deletingLoan?.title}"? This action will remove it from active liabilities and record the event in the audit trail.`}
        confirmText="Confirm Deletion"
        requireReason={true}
        reasonPlaceholder="Mandatory reason for removing this loan facility from the ledger..."
        isDangerous={true}
        itemDetails={deletingLoan ? [
          { label: 'Facility', value: deletingLoan.title },
          { label: 'Lender', value: deletingLoan.lender },
          { label: 'Remaining Balance', value: formatMoney(deletingLoan.remainingBalance) }
        ] : []}
      />
    </div>
  );
};
