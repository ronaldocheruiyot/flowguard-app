export type TransactionType = 'income' | 'expense' | 'transfer';

export type CategoryGroup = 'needs' | 'wants' | 'savings' | 'debt' | 'income';

export type LeakType = 
  | 'zombie_subscription' 
  | 'micro_spending' 
  | 'budget_burn' 
  | 'impulse_regret' 
  | 'price_creep' 
  | 'convenience_fee';

export type DateRangeFilter = 'this_week' | 'this_month' | 'last_month' | 'full_year' | 'all_time' | 'custom';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  pin: string;
  adminPin?: string;
  biometricEnabled?: boolean;
  avatarText: string;
  avatarUrl?: string;
  role: string;
  bio?: string;
}

export interface IncomeStream {
  id: string;
  title: string;
  expectedMonthlyAmount: number;
  categoryId: string;
  defaultAccountId: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
  frequency?: 'monthly' | 'weekly' | 'seasonal' | 'irregular';
}

export interface ExpenseCenter {
  id: string;
  title: string;
  expectedMonthlyBudget: number;
  group: CategoryGroup;
  categoryId: string;
  envelopeId?: string;
  defaultAccountId: string;
  icon: string;
  color: string;
  description: string;
  isRecurringSubscription?: boolean;
  notes?: string;
}

export type DebtorStatus = 'pending' | 'partially_paid' | 'paid' | 'doubtful';

export interface DebtPaymentRecord {
  id: string;
  date: string;
  amount: number;
  accountId: string;
  accountName?: string;
  note?: string;
  txId?: string;
}

export interface Debtor {
  id: string;
  debtorName: string;
  phone?: string;
  amountOwed: number;
  amountPaid: number;
  dueDate?: string;
  description: string;
  status: DebtorStatus;
  notes?: string;
  createdAt: string;
  paymentHistory?: DebtPaymentRecord[];
}

export interface LoanRepaymentRecord {
  id: string;
  date: string;
  amount: number;
  accountId?: string;
  note?: string;
  txId?: string;
}

export interface Loan {
  id: string;
  title: string;
  lender: string; // e.g. K&M SACCO, Imarisha SACCO, Personal / Fuliza
  principalAmount: number;
  remainingBalance: number;
  interestRate: number; // e.g. 12% per annum or 1% per month
  monthlyInstallment: number;
  dueDate: string; // e.g. '15th of month' or '2026-10-15'
  startDate?: string;
  endDate?: string;
  envelopeId?: string;
  defaultAccountId?: string;
  status: 'active' | 'paid_off' | 'defaulted';
  description: string;
  color?: string;
  icon?: string;
  repaymentHistory?: LoanRepaymentRecord[];
}

export interface Category {
  id: string;
  name: string;
  group: CategoryGroup;
  icon: string;
  color: string;
  monthlyBudget: number;
  isCustom?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash' | 'investment';
  balance: number;
  color: string;
  icon: string;
  accountNumber?: string;
  description?: string;
}

export interface Envelope {
  id: string;
  name: string;
  group: CategoryGroup;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  isLocked?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO string
  categoryId: string;
  accountId: string;
  toAccountId?: string; // For transfers
  envelopeId?: string;
  incomeStreamId?: string;
  expenseCenterId?: string;
  debtorId?: string;
  loanId?: string;
  note?: string;
  tags?: string[];
  isSubscription?: boolean;
  subscriptionFrequency?: 'weekly' | 'monthly' | 'yearly';
  regretRating?: 1 | 2 | 3 | 4 | 5; // 1 = Great value, 5 = Total Regret / Leak
  isImpulse?: boolean;
  isConvenienceFee?: boolean;
  leakFlags?: LeakType[];
}

export interface AllocationSplit {
  envelopeId: string;
  percentage: number;
  fixedAmount?: number;
}

export interface AllocationPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  splits: {
    group: CategoryGroup;
    name: string;
    percentage: number;
    envelopeId?: string;
  }[];
}

export interface MoneyLeak {
  id: string;
  title: string;
  type: LeakType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  estimatedMonthlyLoss: number;
  estimatedYearlyLoss: number;
  description: string;
  recommendation: string;
  actionText: string;
  categoryName?: string;
  affectedTransactionsCount?: number;
  savingsPotentialBadge: string;
  dismissed?: boolean;
}

export interface CurrencySetting {
  code: string;
  symbol: string;
  rate: number;
  name: string;
}

export interface DeletedRecord {
  id: string;
  itemType: 'transaction' | 'debtor' | 'expense' | 'income' | 'envelope' | 'loan' | 'category' | 'account';
  title: string;
  deletedAt: string;
  reason?: string;
  data: any;
}

export interface FieldChange {
  field: string;
  label: string;
  oldVal: any;
  newVal: any;
}

export interface AuditLogEntry {
  id: string;
  entityType: 'envelope' | 'debtor' | 'loan' | 'income' | 'expense' | 'account' | 'transaction' | 'category' | 'system' | 'security';
  entityId: string;
  entityName: string;
  action: 'create' | 'update' | 'delete' | 'restore' | 'collect' | 'repay' | 'auth';
  changes?: FieldChange[];
  reason?: string;
  timestamp: string;
  performedBy: string;
}
