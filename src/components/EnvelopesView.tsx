import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Layers, 
  Plus, 
  Sparkles, 
  ArrowRightLeft, 
  PieChart, 
  Check, 
  AlertCircle,
  Edit2,
  Trash2,
  Sliders,
  DollarSign
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';
import { CategoryGroup, Envelope } from '../types/finance';

export const EnvelopesView: React.FC = () => {
  const { envelopes, addEnvelope, updateEnvelope, deleteEnvelope, formatMoney, currency } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingEnv, setEditingEnv] = useState<Envelope | null>(null);

  // New envelope state
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<CategoryGroup>('needs');
  const [newTarget, setNewTarget] = useState('');
  const [newInitial, setNewInitial] = useState('');
  const [newColor, setNewColor] = useState('#10b981');
  const [newIcon, setNewIcon] = useState('Layers');

  // Edit envelope state
  const [editName, setEditName] = useState('');
  const [editGroup, setEditGroup] = useState<CategoryGroup>('needs');
  const [editTarget, setEditTarget] = useState('');
  const [editCurrent, setEditCurrent] = useState('');
  const [editColor, setEditColor] = useState('#10b981');
  const [editIcon, setEditIcon] = useState('Layers');

  // Transfer state
  const [fromEnvId, setFromEnvId] = useState(envelopes[0]?.id || '');
  const [toEnvId, setToEnvId] = useState(envelopes[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');

  const groups: { key: CategoryGroup; label: string; color: string }[] = [
    { key: 'needs', label: 'Needs & Essentials (50%)', color: 'text-indigo-400' },
    { key: 'wants', label: 'Guilt-Free Wants (30%)', color: 'text-pink-400' },
    { key: 'savings', label: 'Savings & Goals (20%)', color: 'text-emerald-400' },
    { key: 'debt', label: 'Debt Accelerator', color: 'text-rose-400' }
  ];

  const handleCreateEnvelope = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTarget) return;

    addEnvelope({
      name: newName.trim(),
      group: newGroup,
      targetAmount: parseFloat(newTarget) || 0,
      currentAmount: parseFloat(newInitial) || 0,
      color: newColor,
      icon: newIcon
    });

    setShowAddModal(false);
    setNewName('');
    setNewTarget('');
    setNewInitial('');
  };

  const openEditModal = (env: Envelope) => {
    setEditingEnv(env);
    setEditName(env.name);
    setEditGroup(env.group);
    setEditTarget(env.targetAmount.toString());
    setEditCurrent(env.currentAmount.toString());
    setEditColor(env.color || '#10b981');
    setEditIcon(env.icon || 'Layers');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnv || !editName.trim()) return;

    updateEnvelope(editingEnv.id, {
      name: editName.trim(),
      group: editGroup,
      targetAmount: parseFloat(editTarget) || 0,
      currentAmount: parseFloat(editCurrent) || 0,
      color: editColor,
      icon: editIcon
    });

    setEditingEnv(null);
  };

  const handleDeleteEnvelope = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? You can restore it with the Undo button.`)) {
      deleteEnvelope(id);
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0 || fromEnvId === toEnvId) return;

    const fromEnv = envelopes.find(e => e.id === fromEnvId);
    const toEnv = envelopes.find(e => e.id === toEnvId);

    if (fromEnv && toEnv) {
      if (fromEnv.currentAmount < amount) {
        alert('Insufficient funds in source envelope!');
        return;
      }
      updateEnvelope(fromEnv.id, { currentAmount: fromEnv.currentAmount - amount });
      updateEnvelope(toEnv.id, { currentAmount: toEnv.currentAmount + amount });
      setShowTransferModal(false);
      setTransferAmount('');
    }
  };

  const totalVaultBalance = envelopes.reduce((sum, e) => sum + e.currentAmount, 0);
  const totalTargetBalance = envelopes.reduce((sum, e) => sum + e.targetAmount, 0);

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Digital Budget Vaults
              </h2>
              <p className="text-[11px] text-indigo-300/80 font-medium">
                Edit, Manage & Manipulate Envelopes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowTransferModal(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Transfer between vaults"
            >
              <ArrowRightLeft size={16} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/30 flex items-center gap-1"
              title="Add New Vault"
            >
              <Plus size={15} />
              <span>Add Vault</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-indigo-900/40 text-xs">
          <span className="text-slate-400">Total In Envelopes:</span>
          <span className="font-bold text-white">
            {formatMoney(totalVaultBalance)} <span className="text-slate-400 font-normal">/ {formatMoney(totalTargetBalance)}</span>
          </span>
        </div>
      </div>

      {/* Grouped Envelopes */}
      {groups.map(group => {
        const groupEnvelopes = envelopes.filter(e => e.group === group.key);
        if (groupEnvelopes.length === 0) return null;

        return (
          <div key={group.key} className="space-y-2">
            <div className={`text-xs font-bold ${group.color} px-1 flex items-center justify-between`}>
              <span>{group.label}</span>
              <span className="text-[10px] text-slate-400 font-normal">{groupEnvelopes.length} vaults</span>
            </div>

            <div className="space-y-2">
              {groupEnvelopes.map(env => {
                const fillPct = Math.min(100, Math.round((env.currentAmount / Math.max(env.targetAmount, 1)) * 100));
                const isOver = env.currentAmount > env.targetAmount;
                const isLow = env.currentAmount < (env.targetAmount * 0.2);

                return (
                  <div 
                    key={env.id}
                    className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5 hover:border-slate-700 transition relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
                          style={{ backgroundColor: (env.color || '#10b981') + '22', color: env.color || '#10b981' }}
                        >
                          <DynamicIcon name={env.icon || 'Layers'} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{env.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Target: <span className="text-slate-300 font-semibold">{formatMoney(env.targetAmount)}/mo</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-black text-white">{formatMoney(env.currentAmount)}</div>
                          <div className={`text-[10px] font-bold ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {fillPct}% funded
                          </div>
                        </div>

                        {/* Action buttons (Edit & Delete) */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(env)}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Edit / Manipulate Vault"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteEnvelope(env.id, env.name)}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                            title="Delete Vault"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${fillPct}%`, 
                          backgroundColor: isLow ? '#ef4444' : env.color || '#10b981' 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Add Envelope Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Create New Budget Vault</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateEnvelope} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Vault Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff Salaries & Operations"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Category Group</label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value as CategoryGroup)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-2 py-2 focus:outline-none"
                  >
                    <option value="needs">Needs (50%)</option>
                    <option value="wants">Wants (30%)</option>
                    <option value="savings">Savings (20%)</option>
                    <option value="debt">Debt Accelerator</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Amount ({currency.symbol})</label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Initial Balance ({currency.symbol})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newInitial}
                  onChange={(e) => setNewInitial(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                />
                <span className="text-[9px] text-slate-500 mt-0.5 block">Leave 0 if starting fresh.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-md mt-2"
              >
                Create Vault
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Envelope Modal */}
      {editingEnv && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Edit2 size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Edit & Manipulate Vault</h3>
              </div>
              <button onClick={() => setEditingEnv(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Vault Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Category Group</label>
                  <select
                    value={editGroup}
                    onChange={(e) => setEditGroup(e.target.value as CategoryGroup)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-2 py-2 focus:outline-none"
                  >
                    <option value="needs">Needs (50%)</option>
                    <option value="wants">Wants (30%)</option>
                    <option value="savings">Savings (20%)</option>
                    <option value="debt">Debt Accelerator</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Monthly ({currency.symbol})</label>
                  <input
                    type="number"
                    required
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-emerald-400 uppercase block mb-1 flex items-center justify-between">
                  <span>Current Balance ({currency.symbol})</span>
                  <span className="text-[9px] text-slate-400 font-normal">Directly manipulate balance</span>
                </label>
                <input
                  type="number"
                  required
                  value={editCurrent}
                  onChange={(e) => setEditCurrent(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-500/60 text-sm font-black text-emerald-400 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteEnvelope(editingEnv.id, editingEnv.name);
                    setEditingEnv(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Between Envelopes Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Transfer Between Vaults</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">From Vault</label>
                <select
                  value={fromEnvId}
                  onChange={(e) => setFromEnvId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                >
                  {envelopes.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({formatMoney(e.currentAmount)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">To Vault</label>
                <select
                  value={toEnvId}
                  onChange={(e) => setToEnvId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                >
                  {envelopes.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({formatMoney(e.currentAmount)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transfer Amount ({currency.symbol})</label>
                <input
                  type="number"
                  required
                  placeholder="50.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-xs shadow-md mt-2"
              >
                Transfer Funds
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
