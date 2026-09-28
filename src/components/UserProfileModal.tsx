import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Sliders, 
  Camera, 
  Check, 
  X, 
  Trash2, 
  Download, 
  Upload, 
  HelpCircle, 
  Play, 
  LogOut, 
  RefreshCw, 
  KeyRound,
  FileText,
  CreditCard,
  Edit3
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';
import { VideoTourModal } from './VideoTourModal';
import { RecycleBinModal } from './RecycleBinModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    updateUser, 
    logout, 
    expenseCenters, 
    updateExpenseCenter, 
    incomeStreams, 
    updateIncomeStream, 
    formatMoney, 
    exportData, 
    importData, 
    resetData,
    recycleBin,
    setSelectedTab
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'quick-expenses' | 'quick-income' | 'help'>('profile');
  
  // Profile form
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [avatarText, setAvatarText] = useState(user.avatarText);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');

  // Security / PIN form
  const [newPin, setNewPin] = useState(user.pin);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Modals inside profile
  const [showVideoTour, setShowVideoTour] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);

  // Expense budget edits
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [tempExpenseBudget, setTempExpenseBudget] = useState<string>('');

  // Income stream edits
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);
  const [tempIncomeAmount, setTempIncomeAmount] = useState<string>('');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || user.name,
      role: role.trim() || user.role,
      email: email.trim() || user.email,
      phone: phone.trim() || user.phone,
      avatarText: avatarText.trim().substring(0, 3) || 'BC',
      avatarUrl: avatarUrl.trim()
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      updateUser({ pin: newPin.trim() });
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 2500);
    } else {
      alert('Please enter at least a 4-digit PIN.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAvatarUrl(base64);
        updateUser({ avatarUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowguard-benard-cheruiyot-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && importData(content)) {
          alert('Data successfully imported!');
        } else {
          alert('Failed to parse backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const saveExpenseBudget = (id: string) => {
    const num = parseFloat(tempExpenseBudget);
    if (!isNaN(num) && num >= 0) {
      updateExpenseCenter(id, { expectedMonthlyBudget: num });
    }
    setEditingExpenseId(null);
  };

  const saveIncomeAmount = (id: string) => {
    const num = parseFloat(tempIncomeAmount);
    if (!isNaN(num) && num >= 0) {
      updateIncomeStream(id, { expectedMonthlyAmount: num });
    }
    setEditingIncomeId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-white transition-colors">
        
        {/* Top Executive Header */}
        <div className="p-4 px-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative group">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-glow-green">
                  {user.avatarText}
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 p-1 bg-slate-900 text-white rounded-full border border-slate-700 cursor-pointer hover:bg-emerald-500 transition shadow">
                <Camera size={10} />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white tracking-tight">{user.name}</h2>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                  EXECUTIVE PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{user.role}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 p-2 px-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <User size={13} />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound size={13} />
            <span>PIN & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('quick-expenses')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quick-expenses'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingDown size={13} />
            <span>Expense Shortcuts</span>
          </button>

          <button
            onClick={() => setActiveTab('quick-income')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quick-income'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp size={13} />
            <span>Income Shortcuts</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'help'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle size={13} />
            <span>Help & Guides</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* TAB 1: PROFILE DETAILS & PHOTO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Personal & Enterprise Details
                </h3>
                {profileSuccess && (
                  <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                    <Check size={13} /> Changes Saved!
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Full Legal / Account Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none"
                    placeholder="e.g. Benard Cheruiyot"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Business Role & Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none"
                    placeholder="e.g. Enterprise Owner & Property Investor"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Avatar Initials</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={avatarText}
                      onChange={(e) => setAvatarText(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-center font-bold"
                      placeholder="BC"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Profile Picture (Image URL or Upload above)</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-[11px]"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Check size={14} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* TAB 2: PIN & SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <form onSubmit={handleSavePin} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Change Personal Login PIN
                  </h3>
                  {pinSuccess && (
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <Check size={13} /> PIN Updated!
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Enter New 4-Digit PIN Code
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-center text-lg tracking-widest font-bold focus:border-emerald-500 outline-none"
                    placeholder="••••"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Benard can set his personal PIN to any digits he prefers.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={14} />
                  <span>Update PIN Code</span>
                </button>
              </form>

              {/* Admin Master Key Callout Box */}
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <KeyRound size={15} />
                  <span>Admin Master Key Override Active</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  As the system administrator, you can <strong>ALWAYS log in using the master PIN <code className="bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold text-emerald-500">1234</code></strong>, even if Benard changes his personal PIN to a different code.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: QUICK EXPENSE SHORTCUTS & BUDGET ADJUSTER */}
          {activeTab === 'quick-expenses' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Expenses & Cost Centers Shortcut
                  </h3>
                  <p className="text-[10px] text-slate-400">Quickly adjust monthly budgets directly</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTab('expense-centers');
                    onClose();
                  }}
                  className="text-[11px] text-rose-500 font-bold hover:underline"
                >
                  Open Full View →
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {expenseCenters.map((exp) => {
                  const isEditing = editingExpenseId === exp.id;

                  return (
                    <div 
                      key={exp.id}
                      className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: exp.color + '20', color: exp.color }}
                        >
                          <DynamicIcon name={exp.icon} size={15} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{exp.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{exp.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempExpenseBudget}
                              onChange={(e) => setTempExpenseBudget(e.target.value)}
                              className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-500 rounded-lg text-xs font-bold text-right outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => saveExpenseBudget(exp.id)}
                              className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                            >
                              <Check size={12} />
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => {
                              setEditingExpenseId(exp.id);
                              setTempExpenseBudget(exp.expectedMonthlyBudget.toString());
                            }}
                            className="text-right cursor-pointer group flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                            title="Click to adjust budget"
                          >
                            <div>
                              <div className="text-xs font-black text-rose-600 dark:text-rose-400">
                                {formatMoney(exp.expectedMonthlyBudget)}
                              </div>
                              <div className="text-[9px] text-slate-400 group-hover:text-emerald-500 font-semibold">
                                Edit ✏️
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: QUICK INCOME SHORTCUTS & ADJUSTER */}
          {activeTab === 'quick-income' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Business Income Streams Shortcut
                  </h3>
                  <p className="text-[10px] text-slate-400">Quickly adjust monthly revenue expectations</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTab('income-streams');
                    onClose();
                  }}
                  className="text-[11px] text-emerald-500 font-bold hover:underline"
                >
                  Open Full View →
                </button>
              </div>

              <div className="space-y-2">
                {incomeStreams.map((inc) => {
                  const isEditing = editingIncomeId === inc.id;

                  return (
                    <div 
                      key={inc.id}
                      className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: inc.color + '20', color: inc.color }}
                        >
                          <DynamicIcon name={inc.icon} size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{inc.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{inc.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempIncomeAmount}
                              onChange={(e) => setTempIncomeAmount(e.target.value)}
                              className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-500 rounded-lg text-xs font-bold text-right outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => saveIncomeAmount(inc.id)}
                              className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                            >
                              <Check size={12} />
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => {
                              setEditingIncomeId(inc.id);
                              setTempIncomeAmount(inc.expectedMonthlyAmount.toString());
                            }}
                            className="text-right cursor-pointer group flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                            title="Click to adjust amount"
                          >
                            <div>
                              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                {formatMoney(inc.expectedMonthlyAmount)}
                              </div>
                              <div className="text-[9px] text-slate-400 group-hover:text-emerald-500 font-semibold">
                                Edit ✏️
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: HELP, SUPPORT & EXPLAINERS */}
          {activeTab === 'help' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Help & Explainer Guides
              </h3>

              {/* Video Demo Button */}
              <button
                onClick={() => setShowVideoTour(true)}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border border-emerald-500/30 flex items-center justify-between text-left hover:border-emerald-500/60 transition shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow">
                    <Play size={14} className="fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Watch Interactive Video Tour</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Animated step-by-step phone walkthrough</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Play ▶</span>
              </button>

              {/* FAQ / Guidance Accordions */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>💡</span> What is the 50/30/20 Rule?
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Divides incoming revenue into <strong>50% Needs & Ops</strong> (Office rent, fuel, KPLC), <strong>30% Leisure</strong> (Golf, beer, shopping, harambee), and <strong>20% Growth</strong> (SACCO loans & MMF vault).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🤝</span> How does Debt Collection work?
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Go to the <strong>Debtors</strong> tab, find who paid you (e.g. rent arrears), tap <strong>Collect</strong>, and FlowGuard automatically deposits it into M-PESA and launches the instant money allocator.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>📄</span> How do I generate PDF Statements?
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Tap the <strong>Statements</strong> tab at the top. Select Weekly, Monthly, or Yearly, then tap <strong>"Print / Save PDF"</strong> for official SACCO/Bank copies.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Global Bottom Actions (Backup, Recycle Bin, Logout) */}
        <div className="p-3.5 px-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExport}
              className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition"
              title="Export JSON Backup"
            >
              <Download size={13} />
              <span>Backup</span>
            </button>

            <label className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 cursor-pointer transition">
              <Upload size={13} />
              <span>Restore</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            <button
              onClick={() => setShowRecycleBin(true)}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 transition"
              title="Open Recycle Bin"
            >
              <Trash2 size={13} />
              <span>Trash ({recycleBin.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <LogOut size={13} />
            <span>Lock & Log Out</span>
          </button>
        </div>

      </div>

      {/* Embedded Video Tour Modal */}
      <VideoTourModal 
        isOpen={showVideoTour} 
        onClose={() => setShowVideoTour(false)} 
      />

      {/* Embedded Recycle Bin Modal */}
      <RecycleBinModal 
        isOpen={showRecycleBin} 
        onClose={() => setShowRecycleBin(false)} 
      />
    </div>
  );
};
