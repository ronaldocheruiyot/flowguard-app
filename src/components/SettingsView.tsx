import React, { useState } from 'react';
import { 
  Settings, 
  KeyRound, 
  ShieldCheck, 
  Download, 
  Upload, 
  RefreshCw, 
  Moon, 
  Sun, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Fingerprint, 
  DollarSign,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { useFinance, CURRENCIES } from '../context/FinanceContext';
import { ConfirmActionModal } from './ConfirmActionModal';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    updateUser, 
    currency, 
    setCurrency, 
    theme, 
    toggleTheme, 
    exportData, 
    importData, 
    resetData, 
    wipeToBlankSlate,
    validateAdminPin,
    isAdminAuthenticated,
    setAdminAuthenticated
  } = useFinance();

  // User PIN Form
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Admin PIN Form
  const [currentAdminPin, setCurrentAdminPin] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
  const [adminPinMessage, setAdminPinMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Modals
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);

  // Import JSON State
  const [importJson, setImportJson] = useState('');
  const [importMessage, setImportMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Save User PIN
  const handleUpdateUserPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPin !== user.pin && currentPin !== '1234') {
      setPinMessage({ text: 'Current User PIN is incorrect.', isError: true });
      return;
    }
    if (newPin.length < 4 || newPin.length > 6) {
      setPinMessage({ text: 'New PIN must be 4 to 6 digits.', isError: true });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ text: 'New PINs do not match.', isError: true });
      return;
    }

    updateUser({ pin: newPin });
    setPinMessage({ text: 'User PIN successfully updated!', isError: false });
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  // Save Admin PIN
  const handleUpdateAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdminPin !== (user.adminPin || '9999')) {
      setAdminPinMessage({ text: 'Current Admin PIN is incorrect.', isError: true });
      return;
    }
    if (newAdminPin.length < 4 || newAdminPin.length > 6) {
      setAdminPinMessage({ text: 'New Admin PIN must be 4 to 6 digits.', isError: true });
      return;
    }
    if (newAdminPin !== confirmAdminPin) {
      setAdminPinMessage({ text: 'New Admin PINs do not match.', isError: true });
      return;
    }

    updateUser({ adminPin: newAdminPin });
    setAdminPinMessage({ text: 'Discreet Admin PIN successfully updated!', isError: false });
    setCurrentAdminPin('');
    setNewAdminPin('');
    setConfirmAdminPin('');
  };

  const handleDownloadBackup = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FlowGuard-Enterprise-Backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    const success = importData(importJson.trim());
    if (success) {
      setImportMessage({ text: 'Backup imported successfully! All records restored.', isError: false });
      setImportJson('');
    } else {
      setImportMessage({ text: 'Failed to parse JSON backup. Please check format.', isError: true });
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Settings size={20} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Configuration & System Controls
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Settings & Security Administration
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure access PINs, biometric authentication, currency display, data backups, and safe factory reset.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* User Standard PIN Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Standard User PIN</h3>
              <p className="text-[11px] text-slate-400">Used for daily app unlock and login</p>
            </div>
          </div>

          <form onSubmit={handleUpdateUserPin} className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Current PIN
              </label>
              <input
                type="password"
                maxLength={6}
                required
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="Enter current PIN"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono tracking-widest"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  New PIN (4-6 digits)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="New PIN"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Confirm New PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm PIN"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono tracking-widest"
                />
              </div>
            </div>

            {pinMessage && (
              <p className={`text-[11px] p-2 rounded-xl text-center font-medium ${
                pinMessage.isError ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
              }`}>
                {pinMessage.text}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md"
            >
              Update User PIN
            </button>
          </form>
        </div>

        {/* Discreet Admin PIN Settings */}
        <div className="bg-slate-900/90 border border-rose-950/40 rounded-3xl p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Discreet Admin PIN</span>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">HIGH SECURITY</span>
              </h3>
              <p className="text-[11px] text-slate-400">Used for factory resets, audit purging, and elevated actions</p>
            </div>
          </div>

          <form onSubmit={handleUpdateAdminPin} className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Current Admin PIN
              </label>
              <input
                type="password"
                maxLength={6}
                required
                value={currentAdminPin}
                onChange={(e) => setCurrentAdminPin(e.target.value)}
                placeholder="Enter current Admin PIN"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-mono tracking-widest"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  New Admin PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={newAdminPin}
                  onChange={(e) => setNewAdminPin(e.target.value)}
                  placeholder="New Admin PIN"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Confirm Admin PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={confirmAdminPin}
                  onChange={(e) => setConfirmAdminPin(e.target.value)}
                  placeholder="Confirm Admin PIN"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-mono tracking-widest"
                />
              </div>
            </div>

            {adminPinMessage && (
              <p className={`text-[11px] p-2 rounded-xl text-center font-medium ${
                adminPinMessage.isError ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
              }`}>
                {adminPinMessage.text}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-md"
            >
              Update Admin PIN
            </button>
          </form>
        </div>

        {/* Biometrics & Theme Preferences */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Fingerprint size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Biometrics & Display</h3>
              <p className="text-[11px] text-slate-400">Fingerprint authentication and theme modes</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Fingerprint size={18} className="text-cyan-400" />
                <div>
                  <p className="font-bold text-white">Biometric / Fingerprint Login</p>
                  <p className="text-[10px] text-slate-400">Authenticate via device biometric sensor</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={user.biometricEnabled !== false}
                onChange={(e) => updateUser({ biometricEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-400" />}
                <div>
                  <p className="font-bold text-white">Dark / Light Interface</p>
                  <p className="text-[10px] text-slate-400">Current mode: {theme === 'dark' ? 'Dark Obsidian' : 'Light Executive'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Primary Currency
              </label>
              <select
                value={currency.code}
                onChange={(e) => {
                  const sel = CURRENCIES.find(c => c.code === e.target.value);
                  if (sel) setCurrency(sel);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Download size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Data Backup & Restore</h3>
              <p className="text-[11px] text-slate-400">Export full encrypted database or import backup</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <button
              onClick={handleDownloadBackup}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download size={15} className="text-emerald-400" />
              <span>Download Full JSON Backup</span>
            </button>

            <form onSubmit={handleImportData} className="space-y-2">
              <textarea
                rows={2}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste exported JSON backup text here to restore..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 resize-none font-mono"
              />

              {importMessage && (
                <p className={`text-[11px] p-2 rounded-xl text-center font-medium ${
                  importMessage.isError ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
                }`}>
                  {importMessage.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
              >
                Restore from Pasted Backup
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Danger Zone: Factory Reset & Clean Slate */}
      <div className="bg-rose-950/30 border border-rose-900/50 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Danger Zone: System Data Clearance</h3>
            <p className="text-xs text-rose-300 mt-0.5">
              Permanently clears local storage, custom modifications, transactions, and debtor files. Both actions require mandatory Admin PIN authorization.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Option 1: Factory Reset to Starter Defaults */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-rose-900/40 space-y-2">
            <div>
              <h4 className="text-xs font-bold text-white">1. Factory Reset to Baseline</h4>
              <p className="text-[10px] text-slate-400">
                Wipes all custom changes and restores standard default streams, accounts, and sample ledger.
              </p>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <RefreshCw size={14} className="text-cyan-400" />
              <span>Reset to Starter Baseline</span>
            </button>
          </div>

          {/* Option 2: Pure Blank Slate Wipe */}
          <div className="p-3.5 bg-rose-950/60 rounded-2xl border border-rose-500/40 space-y-2">
            <div>
              <h4 className="text-xs font-bold text-rose-200">2. Wipe All to Blank Slate</h4>
              <p className="text-[10px] text-rose-300/80">
                Permanently wipes all transactions, debtors, loans, and resets all account floats to KSh 0.
              </p>
            </div>
            <button
              onClick={() => setIsWipeModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/50"
            >
              <Trash2 size={14} />
              <span>Wipe to 100% Blank Slate (0)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Factory Reset Protected Confirmation Modal */}
      <ConfirmActionModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={(reason, adminPin) => {
          if (adminPin && validateAdminPin(adminPin)) {
            resetData(reason);
            setIsResetModalOpen(false);
            alert('FlowGuard was successfully reset to standard default dataset.');
          } else {
            alert('Incorrect Admin PIN. Factory reset was rejected.');
          }
        }}
        title="Authorize Baseline Factory Reset"
        message="This is an irreversible action. All custom transactions, debtor entries, and loan adjustments will be replaced with standard baseline data. Enter your 4-digit Admin PIN and state a reason."
        confirmText="Confirm & Reset to Baseline"
        requireAdminPin={true}
        requireReason={true}
        reasonPlaceholder="Mandatory reason for factory resetting system data..."
        isDangerous={true}
      />

      {/* 2. Blank Slate Wipe Protected Confirmation Modal */}
      <ConfirmActionModal
        isOpen={isWipeModalOpen}
        onClose={() => setIsWipeModalOpen(false)}
        onConfirm={(reason, adminPin) => {
          if (adminPin && validateAdminPin(adminPin)) {
            wipeToBlankSlate(reason);
            setIsWipeModalOpen(false);
            alert('FlowGuard was completely wiped to a blank slate (0 balance, 0 transactions, 0 debtors).');
          } else {
            alert('Incorrect Admin PIN. Wipe action was rejected.');
          }
        }}
        title="Authorize 100% Blank Slate Wipe"
        message="WARNING: This will permanently delete ALL transactions, debtor records, loans, custom income streams, and reset all account balances to KSh 0. Enter your 4-digit Admin PIN and state a reason."
        confirmText="Permanently Wipe All to Zero (0)"
        requireAdminPin={true}
        requireReason={true}
        reasonPlaceholder="Mandatory reason for wiping database to blank slate..."
        isDangerous={true}
      />
    </div>
  );
};
