import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Building, 
  Home, 
  Sprout, 
  Shield, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  DollarSign, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  TrendingUp 
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';
import { IncomeStream } from '../types/finance';

export const IncomeStreamsManager: React.FC = () => {
  const { 
    incomeStreams, 
    addIncomeStream, 
    updateIncomeStream, 
    deleteIncomeStream, 
    totalExpectedMonthlyIncome, 
    formatMoney, 
    setIsIncomeModalOpen, 
    setPendingIncomeAmount,
    accounts,
    currency
  } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStream, setEditingStream] = useState<IncomeStream | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [defaultAccountId, setDefaultAccountId] = useState(accounts[0]?.id || 'acc-2');
  const [icon, setIcon] = useState('Briefcase');
  const [color, setColor] = useState('#06b6d4');

  const handleOpenAdd = () => {
    setTitle('');
    setAmount('');
    setDescription('');
    setIcon('Briefcase');
    setColor('#06b6d4');
    setEditingStream(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (stream: IncomeStream) => {
    setEditingStream(stream);
    setTitle(stream.title);
    setAmount(stream.expectedMonthlyAmount.toString());
    setDescription(stream.description);
    setDefaultAccountId(stream.defaultAccountId);
    setIcon(stream.icon);
    setColor(stream.color);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid title and expected amount.');
      return;
    }

    if (editingStream) {
      updateIncomeStream(editingStream.id, {
        title: title.trim(),
        expectedMonthlyAmount: numAmount,
        description: description.trim(),
        defaultAccountId,
        icon,
        color
      });
    } else {
      addIncomeStream({
        title: title.trim(),
        expectedMonthlyAmount: numAmount,
        description: description.trim(),
        categoryId: 'cat-income-other',
        defaultAccountId,
        icon,
        color,
        isActive: true,
        frequency: 'monthly'
      });
    }

    setShowAddModal(false);
    setEditingStream(null);
  };

  const handleQuickReceiveFromStream = (stream: IncomeStream) => {
    setPendingIncomeAmount(stream.expectedMonthlyAmount);
    setIsIncomeModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-2xl text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Benard Cheruiyot Income Portfolios
              </h2>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Security, Real Estate, Lonjo Rentals & Tea Plantation
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20 flex items-center gap-1 text-xs"
          >
            <Plus size={16} />
            <span>Add Source</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400">Total Expected Monthly Inflow:</span>
          <span className="text-base font-black text-emerald-400">
            {formatMoney(totalExpectedMonthlyIncome)}
          </span>
        </div>
      </div>

      {/* Income Streams Cards */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 px-1 flex items-center justify-between">
          <span>Active Revenue Streams ({incomeStreams.length})</span>
          <span className="text-[10px] text-slate-400">Click to edit or receive</span>
        </div>

        {incomeStreams.map((stream) => {
          const acc = accounts.find(a => a.id === stream.defaultAccountId);

          return (
            <div 
              key={stream.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: stream.color + '22', color: stream.color }}
                  >
                    <DynamicIcon name={stream.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {stream.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {stream.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    +{formatMoney(stream.expectedMonthlyAmount)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {acc?.name || 'Account'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => handleQuickReceiveFromStream(stream)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles size={14} className="text-emerald-500 dark:text-emerald-400" />
                  <span>Receive & Auto-Split {formatMoney(stream.expectedMonthlyAmount)}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(stream)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Edit Stream"
                >
                  <Edit3 size={14} />
                </button>

                {incomeStreams.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${stream.title}" from income streams?`)) {
                        deleteIncomeStream(stream.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition"
                    title="Delete Stream"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Stream Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold">
                {editingStream ? 'Edit Income Stream' : 'Add New Income Stream'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Stream Title / Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Matatu Route 11, Commercial Warehouse"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Expected Monthly Inflow ({currency.symbol})
                </label>
                <input
                  type="number"
                  required
                  placeholder="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Description / Contract Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly tenant rentals, client retainers"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                  Receiving Bank / M-PESA Account
                </label>
                <select
                  value={defaultAccountId}
                  onChange={(e) => setDefaultAccountId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({formatMoney(a.balance)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Icon Style</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-2 py-2 focus:outline-none"
                  >
                    <option value="Shield">Shield (Security)</option>
                    <option value="Building">Building (Real Estate)</option>
                    <option value="Home">Home (Rentals)</option>
                    <option value="Sprout">Sprout (Farm/Tea)</option>
                    <option value="Briefcase">Briefcase (General)</option>
                    <option value="Truck">Truck (Transport)</option>
                    <option value="Store">Store (Retail)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Color Theme</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-2 py-2 focus:outline-none"
                  >
                    <option value="#06b6d4">Cyan</option>
                    <option value="#10b981">Emerald</option>
                    <option value="#6366f1">Indigo</option>
                    <option value="#84cc16">Lime Green</option>
                    <option value="#f59e0b">Amber</option>
                    <option value="#ec4899">Pink</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 mt-2"
              >
                {editingStream ? 'Save Changes' : 'Create Income Stream'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
