import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ReceiptText, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Layers, 
  Users, 
  Landmark, 
  BarChart3, 
  FileSpreadsheet, 
  History, 
  BookOpen, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Search, 
  Menu, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  ChevronLeft,
  User,
  UserCheck
} from 'lucide-react';
import { useFinance, TabType } from '../context/FinanceContext';

export const Sidebar: React.FC = () => {
  const { 
    selectedTab, 
    setSelectedTab, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed, 
    setIsAddModalOpen,
    setIsCommandPaletteOpen,
    setIsUserProfileModalOpen,
    totalExpectedMonthlyIncome,
    totalPendingDebtReceivables,
    totalLoanDebtRemaining,
    user,
    logout,
    formatMoney
  } = useFinance();

  // Collapsible dropdown section states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    core: true,
    cashflow: true,
    credit: true,
    reports: true,
    system: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const incomeKBadge = `${Math.round(totalExpectedMonthlyIncome / 1000)}k`;

  interface NavItem {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }

  const sections: { id: string; title: string; items: NavItem[] }[] = [
    {
      id: 'core',
      title: 'Overview & Ledgers',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Overview',
          icon: <LayoutDashboard size={18} />
        },
        {
          id: 'transactions',
          label: 'Transactions Log',
          icon: <ReceiptText size={18} />
        }
      ]
    },
    {
      id: 'cashflow',
      title: 'Inflow & Budgeting',
      items: [
        {
          id: 'income-streams',
          label: `Income (${incomeKBadge})`,
          icon: <ArrowDownCircle size={18} />,
          badge: incomeKBadge,
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        },
        {
          id: 'envelopes',
          label: 'Auto-Split Vaults',
          icon: <Layers size={18} />
        },
        {
          id: 'expense-centers',
          label: 'Expense Centers',
          icon: <ArrowUpCircle size={18} />
        }
      ]
    },
    {
      id: 'credit',
      title: 'Credit & Obligations',
      items: [
        {
          id: 'debtors',
          label: 'Debtors & Receivables',
          icon: <Users size={18} />,
          badge: totalPendingDebtReceivables > 0 ? `${Math.round(totalPendingDebtReceivables / 1000)}k` : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        },
        {
          id: 'loans',
          label: 'Loans & SACCOs',
          icon: <Landmark size={18} />,
          badge: totalLoanDebtRemaining > 0 ? `${Math.round(totalLoanDebtRemaining / 1000)}k` : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Audit & Analytics',
      items: [
        {
          id: 'analytics',
          label: 'Analytics & Leaks',
          icon: <BarChart3 size={18} />
        },
        {
          id: 'statement',
          label: 'Financial Statements',
          icon: <FileSpreadsheet size={18} />
        },
        {
          id: 'audit-trail',
          label: 'Change Audit Trail',
          icon: <History size={18} />
        }
      ]
    },
    {
      id: 'system',
      title: 'Documentation & Config',
      items: [
        {
          id: 'user-manual',
          label: 'User Manual & Guides',
          icon: <BookOpen size={18} />
        },
        {
          id: 'settings',
          label: 'Settings & Security',
          icon: <Settings size={18} />
        }
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-950 border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-white text-base shadow-glow-blue">
              FG
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                <span>FlowGuard</span>
                <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30">PRO</span>
              </h1>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.name}</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-white text-base">
            FG
          </div>
        )}

        <button
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Quick Search & Add Action */}
      <div className="p-3 space-y-2 border-b border-slate-800/60">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className={`w-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-slate-800 transition flex items-center gap-2.5 ${
            isSidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5 px-3'
          }`}
          title="Global Search (Ctrl+K)"
        >
          <Search size={16} className="text-cyan-400 shrink-0" />
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between w-full text-xs">
              <span>Quick Search...</span>
              <kbd className="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500">
                ⌘K
              </kbd>
            </div>
          )}
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2 ${
            isSidebarCollapsed ? 'p-2.5' : 'py-2.5 px-3 text-xs'
          }`}
          title="Record Transaction (+)"
        >
          <Plus size={16} />
          {!isSidebarCollapsed && <span>Record Transaction</span>}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.map(sec => {
          const isOpen = openSections[sec.id] !== false;
          return (
            <div key={sec.id} className="space-y-1">
              {!isSidebarCollapsed ? (
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase hover:text-slate-300 transition"
                >
                  <span>{sec.title}</span>
                  {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
              ) : (
                <div className="h-px bg-slate-800/80 my-2" />
              )}

              {(!isSidebarCollapsed ? isOpen : true) && (
                <div className="space-y-0.5">
                  {sec.items.map(item => {
                    const isActive = selectedTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTab(item.id)}
                        className={`w-full rounded-2xl transition flex items-center gap-3 relative ${
                          isSidebarCollapsed ? 'p-3 justify-center' : 'p-2.5 px-3 text-xs font-semibold'
                        } ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                        title={item.label}
                      >
                        <div className={`${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                          {item.icon}
                        </div>
                        {!isSidebarCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile & Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90">
        {!isSidebarCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div 
              onClick={() => setIsUserProfileModalOpen(true)}
              className="flex items-center gap-2.5 min-w-0 flex-1 p-1.5 -ml-1 rounded-2xl hover:bg-slate-900 cursor-pointer transition group"
              title="Click to view and edit Benard Cheruiyot Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 border border-slate-700 flex items-center justify-center font-bold text-xs text-white shrink-0 group-hover:scale-105 transition">
                {user.avatarText || 'BC'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition truncate">{user.name}</p>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span>Online • Profile</span>
                  <span className="text-slate-500">⚙</span>
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-900 transition shrink-0"
              title="Lock / Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 flex flex-col items-center">
            <button
              onClick={() => setIsUserProfileModalOpen(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 border border-slate-700 flex items-center justify-center font-bold text-xs text-white hover:scale-105 transition"
              title="Benard Cheruiyot Profile"
            >
              {user.avatarText || 'BC'}
            </button>
            <button
              onClick={logout}
              className="w-full p-1.5 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-900 transition flex items-center justify-center"
              title="Lock / Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
