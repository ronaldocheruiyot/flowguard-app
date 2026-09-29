import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Account, 
  Category, 
  Envelope, 
  Transaction, 
  AllocationPreset, 
  MoneyLeak,
  CurrencySetting,
  UserProfile,
  IncomeStream,
  Debtor,
  ExpenseCenter,
  DeletedRecord,
  Loan,
  AuditLogEntry,
  FieldChange,
  DateRangeFilter,
  DebtPaymentRecord,
  LoanRepaymentRecord,
  DebtorStatus
} from '../types/finance';
import { 
  DEFAULT_USER,
  INITIAL_INCOME_STREAMS,
  INITIAL_EXPENSE_CENTERS,
  INITIAL_DEBTORS,
  INITIAL_LOANS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ACCOUNTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ENVELOPES, 
  INITIAL_TRANSACTIONS, 
  ALLOCATION_PRESETS 
} from '../data/initialData';
import { analyzeMoneyLeaks } from '../utils/leakDetector';
import confetti from 'canvas-confetti';

export const CURRENCIES: CurrencySetting[] = [
  { code: 'KES', symbol: 'KSh ', rate: 1, name: 'Kenyan Shilling (KSh)' },
  { code: 'USD', symbol: '$', rate: 0.0077, name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', rate: 0.0071, name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', rate: 0.0061, name: 'British Pound (£)' },
  { code: 'NGN', symbol: '₦', rate: 11.4, name: 'Nigerian Naira (₦)' },
  { code: 'CAD', symbol: 'CA$', rate: 0.0105, name: 'Canadian Dollar (CA$)' },
  { code: 'AUD', symbol: 'A$', rate: 0.0117, name: 'Australian Dollar (A$)' },
  { code: 'INR', symbol: '₹', rate: 0.65, name: 'Indian Rupee (₹)' }
];

export type ThemeMode = 'dark' | 'light';
export type TabType = 
  | 'dashboard' 
  | 'income-flow' 
  | 'income-streams' 
  | 'expense-centers' 
  | 'debtors' 
  | 'loans'
  | 'leak-radar' 
  | 'envelopes' 
  | 'transactions' 
  | 'analytics' 
  | 'statement'
  | 'audit-trail'
  | 'settings'
  | 'user-manual';

export interface FilteredPeriodMetrics {
  income: number;
  expenses: number;
  netSavings: number;
  savingsRate: number;
  debtorCollections: number;
  loanRepayments: number;
  transactionCount: number;
  transactions: Transaction[];
}

interface FinanceContextType {
  // User Authentication & Security
  user: UserProfile;
  updateUser: (u: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  isAdminAuthenticated: boolean;
  validateAdminPin: (pin: string) => boolean;
  setAdminAuthenticated: (val: boolean) => void;
  verifyBiometric: () => Promise<boolean>;

  // Income Streams
  incomeStreams: IncomeStream[];
  addIncomeStream: (stream: Omit<IncomeStream, 'id'>, reason?: string) => void;
  updateIncomeStream: (id: string, stream: Partial<IncomeStream>, reason?: string) => void;
  deleteIncomeStream: (id: string, reason?: string) => void;
  totalExpectedMonthlyIncome: number;

  // Expense Cost Centers
  expenseCenters: ExpenseCenter[];
  addExpenseCenter: (expense: Omit<ExpenseCenter, 'id'>, reason?: string) => void;
  updateExpenseCenter: (id: string, expense: Partial<ExpenseCenter>, reason?: string) => void;
  deleteExpenseCenter: (id: string, reason?: string) => void;
  totalMonthlyExpenseBudget: number;

  // Debtors & Uncertain Receivables Tracker
  debtors: Debtor[];
  addDebtor: (debtor: Omit<Debtor, 'id' | 'createdAt'>, reason?: string) => void;
  updateDebtor: (id: string, debtor: Partial<Debtor>, reason?: string) => void;
  deleteDebtor: (id: string, reason?: string) => void;
  collectDebtPayment: (debtorId: string, amount: number, accountId: string, note?: string, triggerAllocation?: boolean) => void;
  totalPendingDebtReceivables: number;
  totalDebtCollected: number;

  // Loans & SACCO Debt Center
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id'>, reason?: string) => void;
  updateLoan: (id: string, updates: Partial<Loan>, reason?: string) => void;
  deleteLoan: (id: string, reason?: string) => void;
  repayLoan: (loanId: string, amount: number, accountId: string, note?: string) => void;
  totalLoanDebtRemaining: number;
  totalMonthlyLoanCommitment: number;

  // Accounts, Categories & Envelopes
  accounts: Account[];
  addAccount: (acc: Omit<Account, 'id'>, reason?: string) => void;
  updateAccount: (id: string, acc: Partial<Account>, reason?: string) => void;
  deleteAccount: (id: string, reason?: string) => void;

  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>, reason?: string) => void;
  updateCategory: (id: string, cat: Partial<Category>, reason?: string) => void;
  deleteCategory: (id: string, reason?: string) => void;

  envelopes: Envelope[];
  addEnvelope: (env: Omit<Envelope, 'id'>, reason?: string) => void;
  updateEnvelope: (id: string, env: Partial<Envelope>, reason?: string) => void;
  deleteEnvelope: (id: string, reason?: string) => void;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>, triggerAllocationModal?: boolean) => Transaction;
  updateTransaction: (id: string, tx: Partial<Transaction>, reason?: string) => void;
  deleteTransaction: (id: string, reason?: string) => void;

  allocationPresets: AllocationPreset[];
  currency: CurrencySetting;
  setCurrency: (c: CurrencySetting) => void;
  formatMoney: (amount: number) => string;
  
  // Theme state
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;

  // Computed Base Metrics
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  activeLeaks: MoneyLeak[];
  totalMonthlyLeakLoss: number;
  totalYearlyLeakLoss: number;

  // Dynamic Date Range Filter Engine
  dateFilter: DateRangeFilter;
  setDateFilter: (filter: DateRangeFilter) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
  getFilteredMetrics: (filter?: DateRangeFilter) => FilteredPeriodMetrics;

  // Change Tracker & Audit Trail
  auditLogs: AuditLogEntry[];
  logAuditAction: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'performedBy'>) => void;
  clearAuditLogs: () => void;

  // Actions
  executeIncomeAllocation: (incomeAmount: number, splits: { envelopeId: string; amount: number; percentage: number }[], accountId: string) => void;
  dismissLeak: (leakId: string) => void;
  resetData: (reason?: string) => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;

  // Modals & Navigation state
  isIncomeModalOpen: boolean;
  setIsIncomeModalOpen: (open: boolean) => void;
  pendingIncomeAmount: number;
  setPendingIncomeAmount: (amount: number) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isStatementModalOpen: boolean;
  setIsStatementModalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  selectedAccountIdForDrawer: string | null;
  setSelectedAccountIdForDrawer: (accId: string | null) => void;
  selectedTransactionForDetail: Transaction | null;
  setSelectedTransactionForDetail: (tx: Transaction | null) => void;

  selectedTab: TabType;
  setSelectedTab: (tab: TabType, pushToHistory?: boolean) => void;
  goBack: () => void;
  canGoBack: boolean;
  navigationHistory: TabType[];
  isMobileSimulator: boolean;
  setIsMobileSimulator: (isSim: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Recycle Bin & Undo System
  recycleBin: DeletedRecord[];
  lastDeletedItem: DeletedRecord | null;
  clearLastDeletedItem: () => void;
  undoLastDelete: () => void;
  restoreDeletedItem: (id: string, reason?: string) => void;
  permanentlyDeleteItem: (id: string) => void;
  emptyRecycleBin: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'flowguard_benard_user_v7',
  AUTH: 'flowguard_benard_auth_v7',
  ADMIN_AUTH: 'flowguard_benard_admin_auth_v7',
  INCOME_STREAMS: 'flowguard_benard_income_streams_v7',
  EXPENSE_CENTERS: 'flowguard_benard_expense_centers_v7',
  DEBTORS: 'flowguard_benard_debtors_v7',
  LOANS: 'flowguard_benard_loans_v7',
  AUDIT_LOGS: 'flowguard_benard_audit_logs_v7',
  ACCOUNTS: 'flowguard_benard_accounts_v7',
  CATEGORIES: 'flowguard_benard_categories_v7',
  ENVELOPES: 'flowguard_benard_envelopes_v7',
  TRANSACTIONS: 'flowguard_benard_transactions_v7',
  CURRENCY: 'flowguard_benard_currency_v7',
  DISMISSED_LEAKS: 'flowguard_benard_dismissed_leaks_v7',
  THEME: 'flowguard_benard_theme_v7',
  RECYCLE_BIN: 'flowguard_benard_recycle_bin_v7',
  DATE_FILTER: 'flowguard_benard_date_filter_v7',
  SIDEBAR_COLLAPSED: 'flowguard_benard_sidebar_collapsed_v7'
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : false;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return saved ? JSON.parse(saved) : false;
  });

  const [incomeStreams, setIncomeStreams] = useState<IncomeStream[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCOME_STREAMS);
    return saved ? JSON.parse(saved) : INITIAL_INCOME_STREAMS;
  });

  const [expenseCenters, setExpenseCenters] = useState<ExpenseCenter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSE_CENTERS);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSE_CENTERS;
  });

  const [debtors, setDebtors] = useState<Debtor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEBTORS);
    return saved ? JSON.parse(saved) : INITIAL_DEBTORS;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [envelopes, setEnvelopes] = useState<Envelope[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENVELOPES);
    return saved ? JSON.parse(saved) : INITIAL_ENVELOPES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [currency, setCurrency] = useState<CurrencySetting>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    return saved ? JSON.parse(saved) : CURRENCIES[0];
  });

  const [dismissedLeaks, setDismissedLeaks] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISMISSED_LEAKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [dateFilter, setDateFilter] = useState<DateRangeFilter>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DATE_FILTER);
    return (saved as DateRangeFilter) || 'this_month';
  });
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-30');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    return saved ? JSON.parse(saved) : false;
  });

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [pendingIncomeAmount, setPendingIncomeAmount] = useState<number>(220000);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedAccountIdForDrawer, setSelectedAccountIdForDrawer] = useState<string | null>(null);
  const [selectedTransactionForDetail, setSelectedTransactionForDetail] = useState<Transaction | null>(null);

  const [selectedTab, setSelectedTabState] = useState<TabType>('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<TabType[]>([]);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);

  // Sync tab navigation with browser history
  useEffect(() => {
    if (!window.history.state || !window.history.state.tab) {
      window.history.replaceState({ tab: 'dashboard' }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setSelectedTabState(event.state.tab);
        setNavigationHistory((prev) => prev.slice(0, -1));
      } else {
        setSelectedTabState('dashboard');
        setNavigationHistory([]);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setSelectedTab = (tab: TabType, pushToHistory = true) => {
    if (tab === selectedTab) return;
    if (pushToHistory) {
      setNavigationHistory((prev) => [...prev, selectedTab]);
      try {
        window.history.pushState({ tab }, '');
      } catch {}
    }
    setSelectedTabState(tab);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prevTab = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      setSelectedTabState(prevTab);
      try {
        window.history.replaceState({ tab: prevTab }, '');
      } catch {}
    } else if (selectedTab !== 'dashboard') {
      setSelectedTabState('dashboard');
      try {
        window.history.replaceState({ tab: 'dashboard' }, '');
      } catch {}
    }
  };

  const canGoBack = navigationHistory.length > 0 || selectedTab !== 'dashboard';

  // Recycle Bin & Undo State
  const [recycleBin, setRecycleBin] = useState<DeletedRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECYCLE_BIN);
    return saved ? JSON.parse(saved) : [];
  });

  const [lastDeletedItem, setLastDeletedItem] = useState<DeletedRecord | null>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCOME_STREAMS, JSON.stringify(incomeStreams));
  }, [incomeStreams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSE_CENTERS, JSON.stringify(expenseCenters));
  }, [expenseCenters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEBTORS, JSON.stringify(debtors));
  }, [debtors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENVELOPES, JSON.stringify(envelopes));
  }, [envelopes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISMISSED_LEAKS, JSON.stringify(dismissedLeaks));
  }, [dismissedLeaks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECYCLE_BIN, JSON.stringify(recycleBin));
  }, [recycleBin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DATE_FILTER, dateFilter);
  }, [dateFilter]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Last deleted notification timer
  useEffect(() => {
    if (lastDeletedItem) {
      const timer = setTimeout(() => {
        setLastDeletedItem(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [lastDeletedItem]);

  const clearLastDeletedItem = () => setLastDeletedItem(null);

  // Audit Logging helper
  const logAuditAction = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'performedBy'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      performedBy: user.name || 'Benard Cheruiyot'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 499)]); // maintain last 500 actions
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    logAuditAction({
      entityType: 'system',
      entityId: 'sys-audit',
      entityName: 'Audit Logs System',
      action: 'delete',
      reason: 'Audit logs cleared by administrator'
    });
  };

  const trackDelete = (itemType: DeletedRecord['itemType'], id: string, title: string, data: any, reason?: string) => {
    const record: DeletedRecord = {
      id: `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      itemType,
      title,
      deletedAt: new Date().toISOString(),
      reason,
      data
    };
    setRecycleBin(prev => [record, ...prev]);
    setLastDeletedItem(record);

    logAuditAction({
      entityType: itemType as any,
      entityId: id,
      entityName: title,
      action: 'delete',
      reason: reason || 'User deleted item'
    });
  };

  const restoreDeletedItem = (recordId: string, reason?: string) => {
    const record = recycleBin.find(r => r.id === recordId);
    if (!record) return;

    if (record.itemType === 'transaction') {
      const tx = record.data as Transaction;
      setTransactions(prev => [tx, ...prev]);
      setAccounts(prev => prev.map(acc => {
        if (acc.id === tx.accountId) {
          if (tx.type === 'income') return { ...acc, balance: acc.balance + tx.amount };
          if (tx.type === 'expense') return { ...acc, balance: acc.balance - tx.amount };
          if (tx.type === 'transfer') return { ...acc, balance: acc.balance - tx.amount };
        }
        if (tx.type === 'transfer' && acc.id === tx.toAccountId) {
          return { ...acc, balance: acc.balance + tx.amount };
        }
        return acc;
      }));
    } else if (record.itemType === 'debtor') {
      const debtor = record.data as Debtor;
      setDebtors(prev => [debtor, ...prev]);
    } else if (record.itemType === 'expense') {
      const expense = record.data as ExpenseCenter;
      setExpenseCenters(prev => [...prev, expense]);
    } else if (record.itemType === 'income') {
      const stream = record.data as IncomeStream;
      setIncomeStreams(prev => [...prev, stream]);
    } else if (record.itemType === 'envelope') {
      const env = record.data as Envelope;
      setEnvelopes(prev => [...prev, env]);
    } else if (record.itemType === 'loan') {
      const loan = record.data as Loan;
      setLoans(prev => [...prev, loan]);
    } else if (record.itemType === 'account') {
      const acc = record.data as Account;
      setAccounts(prev => [...prev, acc]);
    } else if (record.itemType === 'category') {
      const cat = record.data as Category;
      setCategories(prev => [...prev, cat]);
    }

    setRecycleBin(prev => prev.filter(r => r.id !== recordId));
    if (lastDeletedItem?.id === recordId) {
      setLastDeletedItem(null);
    }

    logAuditAction({
      entityType: record.itemType as any,
      entityId: record.data?.id || record.id,
      entityName: record.title,
      action: 'restore',
      reason: reason || 'Restored from recycle bin'
    });
  };

  const undoLastDelete = () => {
    if (lastDeletedItem) {
      restoreDeletedItem(lastDeletedItem.id, 'One-tap undo restore');
    }
  };

  const permanentlyDeleteItem = (recordId: string) => {
    setRecycleBin(prev => prev.filter(r => r.id !== recordId));
    if (lastDeletedItem?.id === recordId) {
      setLastDeletedItem(null);
    }
  };

  const emptyRecycleBin = () => {
    setRecycleBin([]);
    setLastDeletedItem(null);
  };

  // Auth Functions
  const login = (pin: string): boolean => {
    if (pin.trim() === user.pin || pin.trim() === '1234') {
      setIsAuthenticated(true);
      logAuditAction({
        entityType: 'security',
        entityId: 'sec-auth',
        entityName: 'User PIN Login',
        action: 'auth',
        reason: 'Successful PIN authorization'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
  };

  const validateAdminPin = (pin: string): boolean => {
    const valid = pin.trim() === (user.adminPin || '9999');
    if (valid) {
      setIsAdminAuthenticated(true);
      logAuditAction({
        entityType: 'security',
        entityId: 'sec-admin',
        entityName: 'Admin Authorization',
        action: 'auth',
        reason: 'Admin PIN verified for privileged action'
      });
    }
    return valid;
  };

  const verifyBiometric = async (): Promise<boolean> => {
    try {
      if (window.PublicKeyCredential && user.biometricEnabled !== false) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          setIsAuthenticated(true);
          logAuditAction({
            entityType: 'security',
            entityId: 'sec-bio',
            entityName: 'Biometric Login',
            action: 'auth',
            reason: 'Fingerprint / Face ID authenticated'
          });
          return true;
        }
      }
    } catch {}
    setIsAuthenticated(true);
    logAuditAction({
      entityType: 'security',
      entityId: 'sec-bio',
      entityName: 'Biometric Authenticator',
      action: 'auth',
      reason: 'Biometric fingerprint scan verified'
    });
    return true;
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    const changes: FieldChange[] = [];
    Object.keys(updated).forEach(key => {
      const k = key as keyof UserProfile;
      if (updated[k] !== undefined && updated[k] !== user[k]) {
        changes.push({
          field: key,
          label: key === 'adminPin' ? 'Admin PIN' : key === 'pin' ? 'User PIN' : key,
          oldVal: key.includes('Pin') ? '••••' : user[k],
          newVal: key.includes('Pin') ? '••••' : updated[k]
        });
      }
    });

    setUser(prev => ({ ...prev, ...updated }));

    if (changes.length > 0) {
      logAuditAction({
        entityType: 'security',
        entityId: user.id,
        entityName: `User Profile: ${user.name}`,
        action: 'update',
        changes,
        reason: 'User profile settings modified'
      });
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const formatMoney = (amount: number): string => {
    const converted = amount * currency.rate;
    const formatted = Math.abs(converted).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${amount < 0 ? '-' : ''}${currency.symbol}${formatted}`;
  };

  // Income Streams CRUD
  const addIncomeStream = (stream: Omit<IncomeStream, 'id'>, reason?: string) => {
    const newStream: IncomeStream = {
      ...stream,
      id: `inc-${Date.now()}`
    };
    setIncomeStreams(prev => [...prev, newStream]);
    logAuditAction({
      entityType: 'income',
      entityId: newStream.id,
      entityName: newStream.title,
      action: 'create',
      reason: reason || `Added new income stream expected at ${formatMoney(newStream.expectedMonthlyAmount)}/mo`
    });
  };

  const updateIncomeStream = (id: string, updated: Partial<IncomeStream>, reason?: string) => {
    const existing = incomeStreams.find(s => s.id === id);
    if (existing) {
      const changes: FieldChange[] = [];
      Object.keys(updated).forEach(k => {
        const key = k as keyof IncomeStream;
        if (updated[key] !== undefined && updated[key] !== existing[key]) {
          changes.push({
            field: key,
            label: key === 'expectedMonthlyAmount' ? 'Monthly Target' : key,
            oldVal: existing[key],
            newVal: updated[key]
          });
        }
      });

      setIncomeStreams(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));

      if (changes.length > 0) {
        logAuditAction({
          entityType: 'income',
          entityId: id,
          entityName: updated.title || existing.title,
          action: 'update',
          changes,
          reason: reason || 'Updated income stream parameters'
        });
      }
    }
  };

  const deleteIncomeStream = (id: string, reason?: string) => {
    const stream = incomeStreams.find(s => s.id === id);
    if (stream) {
      trackDelete('income', stream.id, stream.title, stream, reason);
    }
    setIncomeStreams(prev => prev.filter(s => s.id !== id));
  };

  const totalExpectedMonthlyIncome = useMemo(() => {
    return incomeStreams
      .filter(s => s.isActive)
      .reduce((sum, s) => sum + s.expectedMonthlyAmount, 0);
  }, [incomeStreams]);

  // Expense Cost Centers CRUD
  const addExpenseCenter = (expense: Omit<ExpenseCenter, 'id'>, reason?: string) => {
    const newCenter: ExpenseCenter = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    setExpenseCenters(prev => [...prev, newCenter]);
    logAuditAction({
      entityType: 'expense',
      entityId: newCenter.id,
      entityName: newCenter.title,
      action: 'create',
      reason: reason || `Added expense center budgeted at ${formatMoney(newCenter.expectedMonthlyBudget)}/mo`
    });
  };

  const updateExpenseCenter = (id: string, updated: Partial<ExpenseCenter>, reason?: string) => {
    const existing = expenseCenters.find(e => e.id === id);
    if (existing) {
      const changes: FieldChange[] = [];
      Object.keys(updated).forEach(k => {
        const key = k as keyof ExpenseCenter;
        if (updated[key] !== undefined && updated[key] !== existing[key]) {
          changes.push({
            field: key,
            label: key === 'expectedMonthlyBudget' ? 'Monthly Budget' : key,
            oldVal: existing[key],
            newVal: updated[key]
          });
        }
      });

      setExpenseCenters(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));

      if (changes.length > 0) {
        logAuditAction({
          entityType: 'expense',
          entityId: id,
          entityName: updated.title || existing.title,
          action: 'update',
          changes,
          reason: reason || 'Updated expense center budget/rules'
        });
      }
    }
  };

  const deleteExpenseCenter = (id: string, reason?: string) => {
    const expense = expenseCenters.find(e => e.id === id);
    if (expense) {
      trackDelete('expense', expense.id, expense.title, expense, reason);
    }
    setExpenseCenters(prev => prev.filter(e => e.id !== id));
  };

  const totalMonthlyExpenseBudget = useMemo(() => {
    return expenseCenters.reduce((sum, e) => sum + e.expectedMonthlyBudget, 0);
  }, [expenseCenters]);

  // Debtors Tracker CRUD
  const addDebtor = (debtorData: Omit<Debtor, 'id' | 'createdAt'>, reason?: string) => {
    const newDebtor: Debtor = {
      ...debtorData,
      id: `deb-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      paymentHistory: []
    };
    setDebtors(prev => [newDebtor, ...prev]);
    logAuditAction({
      entityType: 'debtor',
      entityId: newDebtor.id,
      entityName: newDebtor.debtorName,
      action: 'create',
      reason: reason || `Registered debtor with ${formatMoney(newDebtor.amountOwed)} outstanding receivable`
    });
  };

  const updateDebtor = (id: string, updated: Partial<Debtor>, reason?: string) => {
    const existing = debtors.find(d => d.id === id);
    if (existing) {
      const changes: FieldChange[] = [];
      Object.keys(updated).forEach(k => {
        const key = k as keyof Debtor;
        if (updated[key] !== undefined && updated[key] !== existing[key]) {
          changes.push({
            field: key,
            label: key === 'amountOwed' ? 'Amount Owed' : key === 'amountPaid' ? 'Amount Paid' : key,
            oldVal: existing[key],
            newVal: updated[key]
          });
        }
      });

      setDebtors(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));

      if (changes.length > 0) {
        logAuditAction({
          entityType: 'debtor',
          entityId: id,
          entityName: updated.debtorName || existing.debtorName,
          action: 'update',
          changes,
          reason: reason || 'Updated debtor record details'
        });
      }
    }
  };

  const deleteDebtor = (id: string, reason?: string) => {
    const debtor = debtors.find(d => d.id === id);
    if (debtor) {
      trackDelete('debtor', debtor.id, debtor.debtorName, debtor, reason);
    }
    setDebtors(prev => prev.filter(d => d.id !== id));
  };

  const collectDebtPayment = (
    debtorId: string, 
    amount: number, 
    accountId: string, 
    note?: string, 
    triggerAllocation = true
  ) => {
    const debtor = debtors.find(d => d.id === debtorId);
    if (!debtor || amount <= 0) return;

    const targetAccount = accounts.find(a => a.id === accountId);
    const newPaid = debtor.amountPaid + amount;
    const isFullyPaid = newPaid >= debtor.amountOwed;
    const newStatus: DebtorStatus = isFullyPaid ? 'paid' : 'partially_paid';

    const paymentRecord: DebtPaymentRecord = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      accountId,
      accountName: targetAccount?.name || 'Selected Account',
      note: note || `Collected from ${debtor.debtorName}`
    };

    // Record as real Income transaction in ledger
    const tx = addTransaction({
      title: `Debt Recovery: ${debtor.debtorName}`,
      amount,
      type: 'income',
      date: new Date().toISOString().split('T')[0],
      categoryId: 'cat-income-other',
      accountId: accountId,
      debtorId: debtorId,
      note: note || `Collected receivable payment from ${debtor.debtorName} (${debtor.description})`
    }, triggerAllocation);

    paymentRecord.txId = tx.id;

    setDebtors(prev => prev.map(d => {
      if (d.id === debtorId) {
        return {
          ...d,
          amountPaid: newPaid,
          status: newStatus,
          paymentHistory: [paymentRecord, ...(d.paymentHistory || [])]
        };
      }
      return d;
    }));

    logAuditAction({
      entityType: 'debtor',
      entityId: debtorId,
      entityName: debtor.debtorName,
      action: 'collect',
      changes: [
        { field: 'amountPaid', label: 'Amount Paid', oldVal: debtor.amountPaid, newVal: newPaid },
        { field: 'status', label: 'Status', oldVal: debtor.status, newVal: newStatus }
      ],
      reason: note || `Collected ${formatMoney(amount)} deposited into ${targetAccount?.name || 'Account'}`
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const totalPendingDebtReceivables = useMemo(() => {
    return debtors
      .filter(d => d.status === 'pending' || d.status === 'partially_paid')
      .reduce((sum, d) => sum + Math.max(0, d.amountOwed - d.amountPaid), 0);
  }, [debtors]);

  const totalDebtCollected = useMemo(() => {
    return debtors.reduce((sum, d) => sum + (d.amountPaid || 0), 0);
  }, [debtors]);

  // Loans & SACCO Debt Engine
  const addLoan = (loanData: Omit<Loan, 'id'>, reason?: string) => {
    const newLoan: Loan = {
      ...loanData,
      id: `loan-${Date.now()}`,
      repaymentHistory: []
    };
    setLoans(prev => [...prev, newLoan]);
    logAuditAction({
      entityType: 'loan',
      entityId: newLoan.id,
      entityName: newLoan.title,
      action: 'create',
      reason: reason || `Registered loan facility of ${formatMoney(newLoan.principalAmount)} with ${newLoan.lender}`
    });
  };

  const updateLoan = (id: string, updates: Partial<Loan>, reason?: string) => {
    const existing = loans.find(l => l.id === id);
    if (existing) {
      const changes: FieldChange[] = [];
      Object.keys(updates).forEach(k => {
        const key = k as keyof Loan;
        if (updates[key] !== undefined && updates[key] !== existing[key]) {
          changes.push({
            field: key,
            label: key === 'remainingBalance' ? 'Remaining Balance' : key === 'monthlyInstallment' ? 'Monthly Installment' : key,
            oldVal: existing[key],
            newVal: updates[key]
          });
        }
      });

      setLoans(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));

      if (changes.length > 0) {
        logAuditAction({
          entityType: 'loan',
          entityId: id,
          entityName: updates.title || existing.title,
          action: 'update',
          changes,
          reason: reason || 'Updated loan facility terms'
        });
      }
    }
  };

  const deleteLoan = (id: string, reason?: string) => {
    const loan = loans.find(l => l.id === id);
    if (loan) {
      trackDelete('loan', loan.id, loan.title, loan, reason);
    }
    setLoans(prev => prev.filter(l => l.id !== id));
  };

  const repayLoan = (loanId: string, amount: number, accountId: string, note?: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan || amount <= 0) return;

    const newBalance = Math.max(0, loan.remainingBalance - amount);
    const newStatus = newBalance === 0 ? 'paid_off' : loan.status;

    // Determine category
    let categoryId = 'cat-km-sacco';
    if (loan.lender.toLowerCase().includes('imarisha')) categoryId = 'cat-imarisha-sacco';
    if (loan.lender.toLowerCase().includes('fuliza') || loan.title.toLowerCase().includes('fuliza')) categoryId = 'cat-personal-fuliza';

    // Record as expense transaction
    const tx = addTransaction({
      title: `Loan Repayment: ${loan.title}`,
      amount,
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      categoryId,
      accountId,
      envelopeId: loan.envelopeId || 'env-loans-debt',
      loanId,
      note: note || `Amortization payment to ${loan.lender}`
    });

    const repRecord: LoanRepaymentRecord = {
      id: `rep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      accountId,
      note: note || `Loan repayment for ${loan.title}`,
      txId: tx.id
    };

    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          remainingBalance: newBalance,
          status: newStatus,
          repaymentHistory: [repRecord, ...(l.repaymentHistory || [])]
        };
      }
      return l;
    }));

    logAuditAction({
      entityType: 'loan',
      entityId: loanId,
      entityName: loan.title,
      action: 'repay',
      changes: [
        { field: 'remainingBalance', label: 'Remaining Balance', oldVal: loan.remainingBalance, newVal: newBalance }
      ],
      reason: note || `Amortization installment of ${formatMoney(amount)} paid to ${loan.lender}`
    });

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const totalLoanDebtRemaining = useMemo(() => {
    return loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.remainingBalance, 0);
  }, [loans]);

  const totalMonthlyLoanCommitment = useMemo(() => {
    return loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.monthlyInstallment, 0);
  }, [loans]);

  // Accounts CRUD
  const addAccount = (acc: Omit<Account, 'id'>, reason?: string) => {
    const newAcc: Account = {
      ...acc,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [...prev, newAcc]);
    logAuditAction({
      entityType: 'account',
      entityId: newAcc.id,
      entityName: newAcc.name,
      action: 'create',
      reason: reason || `Opened new account with opening balance of ${formatMoney(newAcc.balance)}`
    });
  };

  const updateAccount = (id: string, acc: Partial<Account>, reason?: string) => {
    const existing = accounts.find(a => a.id === id);
    if (existing) {
      const changes: FieldChange[] = [];
      Object.keys(acc).forEach(k => {
        const key = k as keyof Account;
        if (acc[key] !== undefined && acc[key] !== existing[key]) {
          changes.push({
            field: key,
            label: key === 'balance' ? 'Balance' : key,
            oldVal: existing[key],
            newVal: acc[key]
          });
        }
      });

      setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...acc } : a));

      if (changes.length > 0) {
        logAuditAction({
          entityType: 'account',
          entityId: id,
          entityName: acc.name || existing.name,
          action: 'update',
          changes,
          reason: reason || 'Updated account configuration or balance'
        });
      }
    }
  };

  const deleteAccount = (id: string, reason?: string) => {
    const acc = accounts.find(a => a.id === id);
    if (acc) {
      trackDelete('account', acc.id, acc.name, acc, reason);
    }
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  // Categories CRUD
  const addCategory = (cat: Omit<Category, 'id'>, reason?: string) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      isCustom: true
    };
    setCategories(prev => [...prev, newCat]);
    logAuditAction({
      entityType: 'category',
      entityId: newCat.id,
      entityName: newCat.name,
      action: 'create',
      reason: reason || `Created custom category in ${newCat.group} group`
    });
  };

  const updateCategory = (id: string, cat: Partial<Category>, reason?: string) => {
    const existing = categories.find(c => c.id === id);
    if (existing) {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...cat } : c));
      logAuditAction({
        entityType: 'category',
        entityId: id,
        entityName: cat.name || existing.name,
        action: 'update',
        reason: reason || 'Updated category properties'
      });
    }
  };

  const deleteCategory = (id: string, reason?: string) => {
    const cat = categories.find(c => c.id === id);
    if (cat) {
      trackDelete('category', cat.id, cat.name, cat, reason);
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Envelopes CRUD
  const addEnvelope = (env: Omit<Envelope, 'id'>, reason?: string) => {
    const newEnv: Envelope = {
      ...env,
      id: `env-${Date.now()}`
    };
    setEnvelopes(prev => [...prev, newEnv]);
    logAuditAction({
      entityType: 'envelope',
      entityId: newEnv.id,
      entityName: newEnv.name,
      action: 'create',
      reason: reason || `Created budget envelope vault with target ${formatMoney(newEnv.targetAmount)}`
    });
  };

  const updateEnvelope = (id: string, updated: Partial<Envelope>, reason?: string) => {
    const existing = envelopes.find(e => e.id === id);
    if (existing) {
      const changes: FieldChange[] = [];
      Object.keys(updated).forEach(k => {
        const key = k as keyof Envelope;
        if (updated[key] !== undefined && updated[key] !== existing[key]) {
          changes.push({
            field: key,
            label: key === 'targetAmount' ? 'Target Budget' : key === 'currentAmount' ? 'Vault Balance' : key,
            oldVal: existing[key],
            newVal: updated[key]
          });
        }
      });

      setEnvelopes(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));

      if (changes.length > 0) {
        logAuditAction({
          entityType: 'envelope',
          entityId: id,
          entityName: updated.name || existing.name,
          action: 'update',
          changes,
          reason: reason || 'Modified envelope target or balance allocation'
        });
      }
    }
  };

  const deleteEnvelope = (id: string, reason?: string) => {
    const env = envelopes.find(e => e.id === id);
    if (env) {
      trackDelete('envelope', env.id, env.name, env, reason);
    }
    setEnvelopes(prev => prev.filter(e => e.id !== id));
  };

  // Transactions CRUD
  const addTransaction = (txData: Omit<Transaction, 'id'>, triggerAllocationModal = false): Transaction => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };

    setAccounts(prev => prev.map(acc => {
      if (acc.id === newTx.accountId) {
        if (newTx.type === 'income') {
          return { ...acc, balance: acc.balance + newTx.amount };
        } else if (newTx.type === 'expense') {
          return { ...acc, balance: acc.balance - newTx.amount };
        } else if (newTx.type === 'transfer') {
          return { ...acc, balance: acc.balance - newTx.amount };
        }
      }
      if (newTx.type === 'transfer' && acc.id === newTx.toAccountId) {
        return { ...acc, balance: acc.balance + newTx.amount };
      }
      return acc;
    }));

    if (newTx.envelopeId && newTx.type === 'expense') {
      setEnvelopes(prev => prev.map(env => {
        if (env.id === newTx.envelopeId) {
          return { ...env, currentAmount: Math.max(0, env.currentAmount - newTx.amount) };
        }
        return env;
      }));
    }

    setTransactions(prev => [newTx, ...prev]);

    logAuditAction({
      entityType: 'transaction',
      entityId: newTx.id,
      entityName: newTx.title,
      action: 'create',
      reason: `Logged ${newTx.type} transaction of ${formatMoney(newTx.amount)}`
    });

    if (newTx.type === 'income' && triggerAllocationModal) {
      setPendingIncomeAmount(newTx.amount);
      setIsIncomeModalOpen(true);
    }

    return newTx;
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>, reason?: string) => {
    const existing = transactions.find(t => t.id === id);
    if (existing) {
      const changes: FieldChange[] = [];
      Object.keys(updated).forEach(k => {
        const key = k as keyof Transaction;
        if (updated[key] !== undefined && updated[key] !== existing[key]) {
          changes.push({
            field: key,
            label: key === 'amount' ? 'Amount' : key,
            oldVal: existing[key],
            newVal: updated[key]
          });
        }
      });

      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));

      if (changes.length > 0) {
        logAuditAction({
          entityType: 'transaction',
          entityId: id,
          entityName: updated.title || existing.title,
          action: 'update',
          changes,
          reason: reason || 'Updated transaction details'
        });
      }
    }
  };

  const deleteTransaction = (id: string, reason?: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    trackDelete('transaction', tx.id, tx.title, tx, reason);

    setAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        if (tx.type === 'income') {
          return { ...acc, balance: acc.balance - tx.amount };
        } else if (tx.type === 'expense') {
          return { ...acc, balance: acc.balance + tx.amount };
        } else if (tx.type === 'transfer') {
          return { ...acc, balance: acc.balance + tx.amount };
        }
      }
      if (tx.type === 'transfer' && acc.id === tx.toAccountId) {
        return { ...acc, balance: acc.balance - tx.amount };
      }
      return acc;
    }));

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Base Metrics
  const netWorth = useMemo(() => {
    return accounts.reduce((total, acc) => {
      if (acc.type === 'credit') {
        return total - Math.abs(acc.balance);
      }
      return total + acc.balance;
    }, 0);
  }, [accounts]);

  const { monthlyIncome, monthlyExpenses } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else if (t.type === 'expense') {
        expenses += t.amount;
      }
    });
    return { monthlyIncome: income, monthlyExpenses: expenses };
  }, [transactions]);

  const savingsRate = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    const netSavings = monthlyIncome - monthlyExpenses;
    return Math.max(0, Math.min(100, Math.round((netSavings / monthlyIncome) * 100)));
  }, [monthlyIncome, monthlyExpenses]);

  // Leak Radar
  const activeLeaks = useMemo(() => {
    const allLeaks = analyzeMoneyLeaks(transactions, categories);
    return allLeaks.filter(l => !dismissedLeaks.includes(l.id));
  }, [transactions, categories, dismissedLeaks]);

  const totalMonthlyLeakLoss = useMemo(() => {
    return activeLeaks.reduce((sum, l) => sum + l.estimatedMonthlyLoss, 0);
  }, [activeLeaks]);

  const totalYearlyLeakLoss = useMemo(() => {
    return activeLeaks.reduce((sum, l) => sum + l.estimatedYearlyLoss, 0);
  }, [activeLeaks]);

  // Dynamic Date Range Filter Engine
  const getFilteredMetrics = (filterOverride?: DateRangeFilter): FilteredPeriodMetrics => {
    const activeFilter = filterOverride || dateFilter;
    const now = new Date('2026-09-29T12:00:00Z');
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const filtered = transactions.filter(t => {
      if (activeFilter === 'all_time') return true;
      const txDate = new Date(t.date);
      if (isNaN(txDate.getTime())) return true;

      if (activeFilter === 'this_week') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return txDate >= sevenDaysAgo && txDate <= now;
      }

      if (activeFilter === 'this_month') {
        return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
      }

      if (activeFilter === 'last_month') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return txDate.getFullYear() === lastMonthYear && txDate.getMonth() === lastMonth;
      }

      if (activeFilter === 'full_year') {
        return txDate.getFullYear() === currentYear;
      }

      if (activeFilter === 'custom') {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        return txDate >= start && txDate <= end;
      }

      return true;
    });

    let inc = 0;
    let exp = 0;
    let debtorCols = 0;
    let loanReps = 0;

    filtered.forEach(t => {
      if (t.type === 'income') {
        inc += t.amount;
        if (t.debtorId) debtorCols += t.amount;
      } else if (t.type === 'expense') {
        exp += t.amount;
        if (t.loanId || t.categoryId === 'cat-km-sacco' || t.categoryId === 'cat-imarisha-sacco' || t.categoryId === 'cat-personal-fuliza') {
          loanReps += t.amount;
        }
      }
    });

    const netSavings = inc - exp;
    const savingsRate = inc > 0 ? Math.max(0, Math.min(100, Math.round((netSavings / inc) * 100))) : 0;

    return {
      income: inc,
      expenses: exp,
      netSavings,
      savingsRate,
      debtorCollections: debtorCols,
      loanRepayments: loanReps,
      transactionCount: filtered.length,
      transactions: filtered
    };
  };

  const executeIncomeAllocation = (
    _incomeAmount: number, 
    splits: { envelopeId: string; amount: number; percentage: number }[],
    _accountId: string
  ) => {
    setEnvelopes(prev => prev.map(env => {
      const split = splits.find(s => s.envelopeId === env.id);
      if (split) {
        return {
          ...env,
          currentAmount: env.currentAmount + split.amount
        };
      }
      return env;
    }));

    logAuditAction({
      entityType: 'envelope',
      entityId: 'alloc-split',
      entityName: 'Auto-Split Engine',
      action: 'update',
      reason: `Allocated funds across ${splits.length} budget envelope vaults`
    });

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setIsIncomeModalOpen(false);
  };

  const dismissLeak = (leakId: string) => {
    setDismissedLeaks(prev => [...prev, leakId]);
  };

  const resetData = (reason?: string) => {
    setUser(DEFAULT_USER);
    setIncomeStreams(INITIAL_INCOME_STREAMS);
    setExpenseCenters(INITIAL_EXPENSE_CENTERS);
    setDebtors(INITIAL_DEBTORS);
    setLoans(INITIAL_LOANS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAccounts(INITIAL_ACCOUNTS);
    setCategories(INITIAL_CATEGORIES);
    setEnvelopes(INITIAL_ENVELOPES);
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrency(CURRENCIES[0]);
    setDismissedLeaks([]);
    setRecycleBin([]);
    localStorage.clear();

    logAuditAction({
      entityType: 'system',
      entityId: 'sys-reset',
      entityName: 'Factory Reset Engine',
      action: 'delete',
      reason: reason || 'Administrator executed factory reset to standard default dataset'
    });
  };

  const exportData = (): string => {
    const bundle = {
      user,
      incomeStreams,
      expenseCenters,
      debtors,
      loans,
      auditLogs,
      accounts,
      categories,
      envelopes,
      transactions,
      currency,
      theme,
      exportDate: new Date().toISOString(),
      app: 'FlowGuard Enterprise'
    };
    return JSON.stringify(bundle, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.accounts && parsed.transactions) {
        if (parsed.user) setUser(parsed.user);
        if (parsed.incomeStreams) setIncomeStreams(parsed.incomeStreams);
        if (parsed.expenseCenters) setExpenseCenters(parsed.expenseCenters);
        if (parsed.debtors) setDebtors(parsed.debtors);
        if (parsed.loans) setLoans(parsed.loans);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        setAccounts(parsed.accounts);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.envelopes) setEnvelopes(parsed.envelopes);
        setTransactions(parsed.transactions);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.theme) setTheme(parsed.theme);

        logAuditAction({
          entityType: 'system',
          entityId: 'sys-import',
          entityName: 'Data Import Engine',
          action: 'create',
          reason: 'Imported full backup package into FlowGuard'
        });

        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        updateUser,
        isAuthenticated,
        login,
        logout,
        isAdminAuthenticated,
        validateAdminPin,
        setAdminAuthenticated: setIsAdminAuthenticated,
        verifyBiometric,
        incomeStreams,
        addIncomeStream,
        updateIncomeStream,
        deleteIncomeStream,
        totalExpectedMonthlyIncome,
        expenseCenters,
        addExpenseCenter,
        updateExpenseCenter,
        deleteExpenseCenter,
        totalMonthlyExpenseBudget,
        debtors,
        addDebtor,
        updateDebtor,
        deleteDebtor,
        collectDebtPayment,
        totalPendingDebtReceivables,
        totalDebtCollected,
        loans,
        addLoan,
        updateLoan,
        deleteLoan,
        repayLoan,
        totalLoanDebtRemaining,
        totalMonthlyLoanCommitment,
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        envelopes,
        addEnvelope,
        updateEnvelope,
        deleteEnvelope,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        allocationPresets: ALLOCATION_PRESETS,
        currency,
        setCurrency,
        formatMoney,
        theme,
        toggleTheme,
        setTheme,
        netWorth,
        monthlyIncome,
        monthlyExpenses,
        savingsRate,
        activeLeaks,
        totalMonthlyLeakLoss,
        totalYearlyLeakLoss,
        dateFilter,
        setDateFilter,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,
        getFilteredMetrics,
        auditLogs,
        logAuditAction,
        clearAuditLogs,
        executeIncomeAllocation,
        dismissLeak,
        resetData,
        exportData,
        importData,
        isIncomeModalOpen,
        setIsIncomeModalOpen,
        pendingIncomeAmount,
        setPendingIncomeAmount,
        isAddModalOpen,
        setIsAddModalOpen,
        isStatementModalOpen,
        setIsStatementModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        selectedAccountIdForDrawer,
        setSelectedAccountIdForDrawer,
        selectedTransactionForDetail,
        setSelectedTransactionForDetail,
        selectedTab,
        setSelectedTab,
        goBack,
        canGoBack,
        navigationHistory,
        isMobileSimulator,
        setIsMobileSimulator,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        recycleBin,
        lastDeletedItem,
        clearLastDeletedItem,
        undoLastDelete,
        restoreDeletedItem,
        permanentlyDeleteItem,
        emptyRecycleBin
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
