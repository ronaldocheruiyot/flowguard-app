import React, { useState } from 'react';
import { useFinance, CURRENCIES } from '../context/FinanceContext';
import { 
  Bell, 
  ShieldAlert, 
  RefreshCw, 
  Download, 
  Upload, 
  Smartphone, 
  Monitor, 
  Check, 
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  User,
  Trash2
} from 'lucide-react';
import { RecycleBinModal } from './RecycleBinModal';
import { UserProfileModal } from './UserProfileModal';

export const Header: React.FC = () => {
  const { 
    user,
    logout,
    currency, 
    setCurrency, 
    activeLeaks, 
    setSelectedTab, 
    isMobileSimulator, 
    setIsMobileSimulator,
    resetData,
    exportData,
    importData,
    theme,
    toggleTheme,
    recycleBin
  } = useFinance();

  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  return (
    <>
      <header className="px-3 sm:px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between transition-colors w-full max-w-full overflow-hidden">
        {/* User Profile / Logo - Clickable to open Profile & Shortcuts Modal */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition active:scale-95 group min-w-0 flex-1 mr-2" 
          onClick={() => setShowProfileModal(true)}
          title="Click to open Benard Cheruiyot Profile, PIN Settings & Shortcuts"
        >
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-8 h-8 rounded-xl object-cover border border-emerald-500 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-glow-green text-white font-black text-xs shrink-0">
              {user.avatarText}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-xs tracking-tight text-slate-900 dark:text-white flex items-center gap-1 truncate">
              <span className="truncate">{user.name}</span>
              <span className="text-[8px] uppercase font-bold tracking-wider px-1 py-0.2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/30 shrink-0">
                PRO
              </span>
            </h1>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium group-hover:text-emerald-500 transition truncate">
              Security • Real Estate • Rentals • Tea
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={14} className="text-amber-400" />
            ) : (
              <Moon size={14} className="text-indigo-600" />
            )}
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 transition"
            >
              <span>{currency.code}</span>
              <ChevronDown size={11} className="text-slate-500 dark:text-slate-400" />
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select Currency
                </div>
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c);
                      setShowCurrencyDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-xs flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition"
                  >
                    <span>{c.name}</span>
                    {currency.code === c.code && <Check size={14} className="text-emerald-500 dark:text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Leak Alert Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative"
              title="Leak Alerts"
            >
              <Bell size={15} />
              {activeLeaks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-black rounded-full flex items-center justify-center text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {activeLeaks.length}
                </span>
              )}
            </button>

            {showNotificationPopup && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 dark:text-rose-400">
                    <ShieldAlert size={14} />
                    <span>Active Money Leaks ({activeLeaks.length})</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedTab('leak-radar');
                      setShowNotificationPopup(false);
                    }}
                    className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-56 overflow-y-auto pr-1">
                  {activeLeaks.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                      🎉 No active money leaks detected! Great job!
                    </div>
                  ) : (
                    activeLeaks.slice(0, 3).map((leak) => (
                      <div 
                        key={leak.id}
                        onClick={() => {
                          setSelectedTab('leak-radar');
                          setShowNotificationPopup(false);
                        }}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer border border-slate-200 dark:border-slate-700/60 text-left transition"
                      >
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{leak.title}</div>
                        <div className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold mt-0.5">{leak.savingsPotentialBadge}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            title="Settings"
          >
            <RefreshCw size={15} />
          </button>

          {/* Logout button */}
          <button
            onClick={logout}
            className="p-1.5 sm:p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition"
            title="Lock & Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold">Benard Cheruiyot Profile & Settings</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Profile Info */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs font-bold">{user.name}</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.role}</p>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                PIN Code: {user.pin}
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              >
                <span className="flex items-center gap-2"><Download size={14} className="text-cyan-500 dark:text-cyan-400" /> Export Backup (JSON)</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Download</span>
              </button>

              <label className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer transition">
                <span className="flex items-center gap-2"><Upload size={14} className="text-emerald-500 dark:text-emerald-400" /> Restore / Import Backup</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Upload</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>

              {/* Recycle Bin & Audit Log */}
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowRecycleBin(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              >
                <span className="flex items-center gap-2">
                  <Trash2 size={14} className="text-rose-500 dark:text-rose-400" />
                  <span>Recycle Bin & Undo Log</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  {recycleBin.length}
                </span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset to Benard Cheruiyot default portfolios?')) {
                    resetData();
                    setShowSettingsModal(false);
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-300 border border-rose-500/30 transition"
              >
                <span className="flex items-center gap-2"><RefreshCw size={14} className="text-rose-500 dark:text-rose-400" /> Reset to Default Data</span>
                <span className="text-[10px] text-rose-500 dark:text-rose-400">Reset</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recycle Bin & Audit Trail Modal */}
      <RecycleBinModal 
        isOpen={showRecycleBin} 
        onClose={() => setShowRecycleBin(false)} 
      />

      {/* User Executive Profile & Shortcuts Modal */}
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
};
