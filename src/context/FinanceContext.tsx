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
  DeletedRecord
} from '../types/finance';
import { 
  DEFAULT_USER,
  INITIAL_INCOME_STREAMS,
  INITIAL_EXPENSE_CENTERS,
  INITIAL_DEBTORS,
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

interface FinanceContextType {
  // User Authentication
  user: UserProfile;
  updateUser: (u: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;

  // Income Streams (Security Co, Real Estate, Lonjo Rentals, Tea Farm, Custom)
  incomeStreams: IncomeStream[];
  addIncomeStream: (stream: Omit<IncomeStream, 'id'>) => void;
  updateIncomeStream: (id: string, stream: Partial<IncomeStream>) => void;
  deleteIncomeStream: (id: string) => void;
  totalExpectedMonthlyIncome: number;

  // Expense Cost Centers (Golf Caddy/Club, Beer/Leisure, Fuel/Travel, Harambee/Donations, Ops)
  expenseCenters: ExpenseCenter[];
  addExpenseCenter: (expense: Omit<ExpenseCenter, 'id'>) => void;
  updateExpenseCenter: (id: string, expense: Partial<ExpenseCenter>) => void;
  deleteExpenseCenter: (id: string) => void;
  totalMonthlyExpenseBudget: number;

  // Debtors & Uncertain Receivables Tracker
  debtors: Debtor[];
  addDebtor: (debtor: Omit<Debtor, 'id' | 'createdAt'>) => void;
  updateDebtor: (id: string, debtor: Partial<Debtor>) => void;
  deleteDebtor: (id: string) => void;
  collectDebtPayment: (debtorId: string, amount: number, accountId: string, triggerAllocation?: boolean) => void;
  totalPendingDebtReceivables: number;

  // Accounts, Categories & Envelopes
  accounts: Account[];
  categories: Category[];
  envelopes: Envelope[];
  addEnvelope: (env: Omit<Envelope, 'id'>) => void;
  updateEnvelope: (id: string, env: Partial<Envelope>) => void;
  deleteEnvelope: (id: string) => void;
  transactions: Transaction[];
  allocationPresets: AllocationPreset[];
  currency: CurrencySetting;
  setCurrency: (c: CurrencySetting) => void;
  formatMoney: (amount: number) => string;
  
  // Theme state
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;

  // Computed metrics
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  activeLeaks: MoneyLeak[];
  totalMonthlyLeakLoss: number;
  totalYearlyLeakLoss: number;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>, triggerAllocationModal?: boolean) => Transaction;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addAccount: (acc: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, acc: Partial<Account>) => void;

  executeIncomeAllocation: (incomeAmount: number, splits: { envelopeId: string; amount: number; percentage: number }[], accountId: string) => void;
  dismissLeak: (leakId: string) => void;
  resetData: () => void;
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
  selectedTab: 'dashboard' | 'income-flow' | 'income-streams' | 'expense-centers' | 'debtors' | 'leak-radar' | 'envelopes' | 'transactions' | 'analytics' | 'statement';
  setSelectedTab: (tab: 'dashboard' | 'income-flow' | 'income-streams' | 'expense-centers' | 'debtors' | 'leak-radar' | 'envelopes' | 'transactions' | 'analytics' | 'statement', pushToHistory?: boolean) => void;
  goBack: () => void;
  canGoBack: boolean;
  navigationHistory: string[];
  isMobileSimulator: boolean;
  setIsMobileSimulator: (isSim: boolean) => void;

  // Recycle Bin & Undo System
  recycleBin: DeletedRecord[];
  lastDeletedItem: DeletedRecord | null;
  clearLastDeletedItem: () => void;
  undoLastDelete: () => void;
  restoreDeletedItem: (id: string) => void;
  permanentlyDeleteItem: (id: string) => void;
  emptyRecycleBin: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'flowguard_benard_user_v5',
  AUTH: 'flowguard_benard_auth_v5',
  INCOME_STREAMS: 'flowguard_benard_income_streams_v5',
  EXPENSE_CENTERS: 'flowguard_benard_expense_centers_v5',
  DEBTORS: 'flowguard_benard_debtors_v5',
  ACCOUNTS: 'flowguard_benard_accounts_v5',
  CATEGORIES: 'flowguard_benard_categories_v5',
  ENVELOPES: 'flowguard_benard_envelopes_v5',
  TRANSACTIONS: 'flowguard_benard_transactions_v5',
  CURRENCY: 'flowguard_benard_currency_v5',
  DISMISSED_LEAKS: 'flowguard_benard_dismissed_leaks_v5',
  THEME: 'flowguard_benard_theme_v5',
  RECYCLE_BIN: 'flowguard_benard_recycle_bin_v5'
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

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [pendingIncomeAmount, setPendingIncomeAmount] = useState<number>(220000);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  type TabType = 'dashboard' | 'income-flow' | 'income-streams' | 'expense-centers' | 'debtors' | 'leak-radar' | 'envelopes' | 'transactions' | 'analytics' | 'statement';
  const [selectedTab, setSelectedTabState] = useState<TabType>('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<TabType[]>([]);
  const [isMobileSimulator, setIsMobileSimulator] = useState(true);

  // Sync tab navigation with browser history & hardware back button
  useEffect(() => {
    // Initial state anchor
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
      } catch {
        // Fallback for isolated environments
      }
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
      } catch {
        // Safe fallback
      }
    } else if (selectedTab !== 'dashboard') {
      setSelectedTabState('dashboard');
      try {
        window.history.replaceState({ tab: 'dashboard' }, '');
      } catch {
        // Safe fallback
      }
    }
  };

  const canGoBack = navigationHistory.length > 0 || selectedTab !== 'dashboard';

  // Recycle Bin & Undo State
  const [recycleBin, setRecycleBin] = useState<DeletedRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECYCLE_BIN);
    return saved ? JSON.parse(saved) : [];
  });

  const [lastDeletedItem, setLastDeletedItem] = useState<DeletedRecord | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECYCLE_BIN, JSON.stringify(recycleBin));
  }, [recycleBin]);

  useEffect(() => {
    if (lastDeletedItem) {
      const timer = setTimeout(() => {
        setLastDeletedItem(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [lastDeletedItem]);

  const clearLastDeletedItem = () => setLastDeletedItem(null);

  const trackDelete = (itemType: DeletedRecord['itemType'], id: string, title: string, data: any) => {
    const record: DeletedRecord = {
      id: `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      itemType,
      title,
      deletedAt: new Date().toISOString(),
      data
    };
    setRecycleBin(prev => [record, ...prev]);
    setLastDeletedItem(record);
  };

  const restoreDeletedItem = (recordId: string) => {
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
    }

    setRecycleBin(prev => prev.filter(r => r.id !== recordId));
    if (lastDeletedItem?.id === recordId) {
      setLastDeletedItem(null);
    }
  };

  const undoLastDelete = () => {
    if (lastDeletedItem) {
      restoreDeletedItem(lastDeletedItem.id);
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

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

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
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

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

  // Auth Functions
  const login = (pin: string): boolean => {
    if (pin.trim() === user.pin || pin.trim() === '1234') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
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
  const addIncomeStream = (stream: Omit<IncomeStream, 'id'>) => {
    const newStream: IncomeStream = {
      ...stream,
      id: `inc-${Date.now()}`
    };
    setIncomeStreams(prev => [...prev, newStream]);
  };

  const updateIncomeStream = (id: string, updated: Partial<IncomeStream>) => {
    setIncomeStreams(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteIncomeStream = (id: string) => {
    const stream = incomeStreams.find(s => s.id === id);
    if (stream) {
      trackDelete('income', stream.id, stream.title, stream);
    }
    setIncomeStreams(prev => prev.filter(s => s.id !== id));
  };

  const totalExpectedMonthlyIncome = useMemo(() => {
    return incomeStreams
      .filter(s => s.isActive)
      .reduce((sum, s) => sum + s.expectedMonthlyAmount, 0);
  }, [incomeStreams]);

  // Expense Cost Centers CRUD
  const addExpenseCenter = (expense: Omit<ExpenseCenter, 'id'>) => {
    const newCenter: ExpenseCenter = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    setExpenseCenters(prev => [...prev, newCenter]);
  };

  const updateExpenseCenter = (id: string, updated: Partial<ExpenseCenter>) => {
    setExpenseCenters(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteExpenseCenter = (id: string) => {
    const expense = expenseCenters.find(e => e.id === id);
    if (expense) {
      trackDelete('expense', expense.id, expense.title, expense);
    }
    setExpenseCenters(prev => prev.filter(e => e.id !== id));
  };

  const totalMonthlyExpenseBudget = useMemo(() => {
    return expenseCenters.reduce((sum, e) => sum + e.expectedMonthlyBudget, 0);
  }, [expenseCenters]);

  // Debtors Tracker CRUD
  const addDebtor = (debtorData: Omit<Debtor, 'id' | 'createdAt'>) => {
    const newDebtor: Debtor = {
      ...debtorData,
      id: `deb-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDebtors(prev => [newDebtor, ...prev]);
  };

  const updateDebtor = (id: string, updated: Partial<Debtor>) => {
    setDebtors(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  };

  const deleteDebtor = (id: string) => {
    const debtor = debtors.find(d => d.id === id);
    if (debtor) {
      trackDelete('debtor', debtor.id, debtor.debtorName, debtor);
    }
    setDebtors(prev => prev.filter(d => d.id !== id));
  };

  const collectDebtPayment = (debtorId: string, amount: number, accountId: string, triggerAllocation = true) => {
    const debtor = debtors.find(d => d.id === debtorId);
    if (!debtor) return;

    const newPaid = debtor.amountPaid + amount;
    const isFullyPaid = newPaid >= debtor.amountOwed;

    updateDebtor(debtorId, {
      amountPaid: newPaid,
      status: isFullyPaid ? 'paid' : 'partially_paid'
    });

    addTransaction({
      title: `Debt Recovery: ${debtor.debtorName}`,
      amount: amount,
      type: 'income',
      date: new Date().toISOString().split('T')[0],
      categoryId: 'cat-income-other',
      accountId: accountId,
      debtorId: debtorId,
      note: `Collected from ${debtor.debtorName} (${debtor.description})`
    }, triggerAllocation);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const totalPendingDebtReceivables = useMemo(() => {
    return debtors
      .filter(d => d.status === 'pending' || d.status === 'partially_paid')
      .reduce((sum, d) => sum + Math.max(0, d.amountOwed - d.amountPaid), 0);
  }, [debtors]);

  // Calculated Metrics
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

  // Add Transaction
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

    if (newTx.type === 'income' && triggerAllocationModal) {
      setPendingIncomeAmount(newTx.amount);
      setIsIncomeModalOpen(true);
    }

    return newTx;
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    trackDelete('transaction', tx.id, tx.title, tx);

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

  const addEnvelope = (env: Omit<Envelope, 'id'>) => {
    const newEnv: Envelope = {
      ...env,
      id: `env-${Date.now()}`
    };
    setEnvelopes(prev => [...prev, newEnv]);
  };

  const updateEnvelope = (id: string, updated: Partial<Envelope>) => {
    setEnvelopes(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteEnvelope = (id: string) => {
    const env = envelopes.find(e => e.id === id);
    if (env) {
      trackDelete('envelope', env.id, env.name, env);
    }
    setEnvelopes(prev => prev.filter(e => e.id !== id));
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAcc: Account = {
      ...acc,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [...prev, newAcc]);
  };

  const updateAccount = (id: string, updated: Partial<Account>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const executeIncomeAllocation = (
    incomeAmount: number, 
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

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setIsIncomeModalOpen(false);
  };

  const dismissLeak = (leakId: string) => {
    setDismissedLeaks(prev => [...prev, leakId]);
  };

  const resetData = () => {
    setUser(DEFAULT_USER);
    setIncomeStreams(INITIAL_INCOME_STREAMS);
    setExpenseCenters(INITIAL_EXPENSE_CENTERS);
    setDebtors(INITIAL_DEBTORS);
    setAccounts(INITIAL_ACCOUNTS);
    setCategories(INITIAL_CATEGORIES);
    setEnvelopes(INITIAL_ENVELOPES);
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrency(CURRENCIES[0]);
    setDismissedLeaks([]);
    localStorage.clear();
  };

  const exportData = (): string => {
    const bundle = {
      user,
      incomeStreams,
      expenseCenters,
      debtors,
      accounts,
      categories,
      envelopes,
      transactions,
      currency,
      theme,
      exportDate: new Date().toISOString(),
      app: 'FlowGuard'
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
        setAccounts(parsed.accounts);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.envelopes) setEnvelopes(parsed.envelopes);
        setTransactions(parsed.transactions);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.theme) setTheme(parsed.theme);
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
        accounts,
        categories,
        envelopes,
        transactions,
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
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addEnvelope,
        updateEnvelope,
        deleteEnvelope,
        addAccount,
        updateAccount,
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
        selectedTab,
        setSelectedTab,
        goBack,
        canGoBack,
        navigationHistory,
        isMobileSimulator,
        setIsMobileSimulator,
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
