import { Account, Category, Envelope, AllocationPreset, Transaction, IncomeStream, Debtor, UserProfile, ExpenseCenter } from '../types/finance';

export const DEFAULT_USER: UserProfile = {
  id: 'usr-benard-cheruiyot',
  name: 'Benard Cheruiyot',
  email: 'benard.cheruiyot@flowguard.ke',
  phone: '+254 712 345 678',
  pin: '1234',
  avatarText: 'BC',
  role: 'Enterprise Owner & Property Investor',
  bio: 'Owner of Security Services, Real Estate Agency, Lonjo Rentals & Tea Plantation.'
};

export const INITIAL_INCOME_STREAMS: IncomeStream[] = [
  {
    id: 'inc-security-co',
    title: 'Security Company',
    expectedMonthlyAmount: 100000,
    categoryId: 'cat-income-security',
    defaultAccountId: 'acc-2', // Equity/KCB business account
    icon: 'Shield',
    color: '#06b6d4',
    description: 'Guarding contracts, corporate security patrols & services',
    isActive: true,
    frequency: 'monthly'
  },
  {
    id: 'inc-real-estate',
    title: 'Real Estate Management Agency',
    expectedMonthlyAmount: 50000,
    categoryId: 'cat-income-realestate',
    defaultAccountId: 'acc-2',
    icon: 'Building',
    color: '#10b981',
    description: 'Property management retainers & agency service fees',
    isActive: true,
    frequency: 'monthly'
  },
  {
    id: 'inc-lonjo-rentals',
    title: 'Lonjo Rental Houses',
    expectedMonthlyAmount: 50000,
    categoryId: 'cat-income-rentals',
    defaultAccountId: 'acc-1', // M-PESA paybill / account
    icon: 'Home',
    color: '#6366f1',
    description: 'Monthly tenant rent collections from Lonjo properties',
    isActive: true,
    frequency: 'monthly'
  },
  {
    id: 'inc-tea-plantation',
    title: 'Tea Plantation Farm',
    expectedMonthlyAmount: 20000,
    categoryId: 'cat-income-tea',
    defaultAccountId: 'acc-1',
    icon: 'Sprout',
    color: '#84cc16',
    description: 'Tea green leaf factory delivery payments & harvest bonuses',
    isActive: true,
    frequency: 'monthly'
  }
];

export const INITIAL_EXPENSE_CENTERS: ExpenseCenter[] = [
  // --- Office, Bills & Connectivity ---
  {
    id: 'exp-office-rent',
    title: 'Office Rent',
    expectedMonthlyBudget: 25000,
    group: 'needs',
    categoryId: 'cat-office-rent',
    envelopeId: 'env-biz-operations',
    defaultAccountId: 'acc-2',
    icon: 'Building2',
    color: '#6366f1',
    description: 'Monthly office premises rent for agency and security business'
  },
  {
    id: 'exp-electricity',
    title: 'Electricity & KPLC Tokens',
    expectedMonthlyBudget: 8000,
    group: 'needs',
    categoryId: 'cat-utilities-electricity',
    envelopeId: 'env-household',
    defaultAccountId: 'acc-1',
    icon: 'Zap',
    color: '#eab308',
    description: 'Monthly prepaid KPLC electricity tokens for office & home'
  },
  {
    id: 'exp-internet-wifi',
    title: 'Internet & Wi-Fi Broadband',
    expectedMonthlyBudget: 5000,
    group: 'needs',
    categoryId: 'cat-internet-wifi',
    envelopeId: 'env-household',
    defaultAccountId: 'acc-1',
    icon: 'Wifi',
    color: '#06b6d4',
    description: 'High-speed fiber internet and office Wi-Fi connection'
  },

  // --- Loans, SACCOs & Debt Servicing ---
  {
    id: 'exp-km-sacco-loan',
    title: 'K&M SACCO Company Loan',
    expectedMonthlyBudget: 20000,
    group: 'debt',
    categoryId: 'cat-km-sacco',
    envelopeId: 'env-loans-debt',
    defaultAccountId: 'acc-2',
    icon: 'Landmark',
    color: '#f43f5e',
    description: 'Monthly commercial loan amortization to K&M SACCO'
  },
  {
    id: 'exp-imarisha-sacco-loan',
    title: 'Imarisha SACCO Loan',
    expectedMonthlyBudget: 25000,
    group: 'debt',
    categoryId: 'cat-imarisha-sacco',
    envelopeId: 'env-loans-debt',
    defaultAccountId: 'acc-2',
    icon: 'Landmark',
    color: '#e11d48',
    description: 'Monthly loan repayment and development dues to Imarisha SACCO'
  },
  {
    id: 'exp-personal-fuliza',
    title: 'Personal Loan & Fuliza Repayment',
    expectedMonthlyBudget: 8500,
    group: 'debt',
    categoryId: 'cat-personal-fuliza',
    envelopeId: 'env-loans-debt',
    defaultAccountId: 'acc-1',
    icon: 'Flame',
    color: '#ef4444',
    description: 'Personal loan installments and M-PESA Fuliza overdraft clearances'
  },

  // --- Taxes & Compliance ---
  {
    id: 'exp-kra-tax',
    title: 'KRA Taxes & Compliance',
    expectedMonthlyBudget: 18000,
    group: 'needs',
    categoryId: 'cat-kra-tax',
    envelopeId: 'env-biz-operations',
    defaultAccountId: 'acc-2',
    icon: 'FileSpreadsheet',
    color: '#dc2626',
    description: 'Kenya Revenue Authority monthly income / turnover taxes'
  },
  {
    id: 'exp-vat-stationeries',
    title: 'VAT & Office Stationeries',
    expectedMonthlyBudget: 7500,
    group: 'needs',
    categoryId: 'cat-vat-stationeries',
    envelopeId: 'env-biz-operations',
    defaultAccountId: 'acc-2',
    icon: 'Paperclip',
    color: '#64748b',
    description: 'Value Added Tax (VAT) & printing paper, files and office supplies'
  },

  // --- Vehicle & Travel ---
  {
    id: 'exp-travel-fuel',
    title: 'Travelling & Vehicle Fuel',
    expectedMonthlyBudget: 22000,
    group: 'needs',
    categoryId: 'cat-transport-fuel',
    envelopeId: 'env-transport-fuel',
    defaultAccountId: 'acc-2',
    icon: 'Fuel',
    color: '#f59e0b',
    description: 'Vehicle fuel for trips between tea farm, Lonjo rentals & security sites'
  },
  {
    id: 'exp-car-repairs-abrupt',
    title: 'Abrupt Car Repairs & Garage',
    expectedMonthlyBudget: 15000,
    group: 'needs',
    categoryId: 'cat-car-repairs',
    envelopeId: 'env-transport-fuel',
    defaultAccountId: 'acc-1',
    icon: 'Wrench',
    color: '#ea580c',
    description: 'Emergency mechanical repairs, garage checkups and abrupt part fixes'
  },
  {
    id: 'exp-car-enhancements',
    title: 'Car Enhancements & Upgrades',
    expectedMonthlyBudget: 10000,
    group: 'wants',
    categoryId: 'cat-car-enhancements',
    envelopeId: 'env-transport-fuel',
    defaultAccountId: 'acc-2',
    icon: 'Sparkles',
    color: '#0284c7',
    description: 'Tyre changes, vehicle accessories and car performance enhancements'
  },
  {
    id: 'exp-car-wash',
    title: 'Car Wash & Detailing',
    expectedMonthlyBudget: 2500,
    group: 'wants',
    categoryId: 'cat-car-wash',
    envelopeId: 'env-transport-fuel',
    defaultAccountId: 'acc-1',
    icon: 'Droplets',
    color: '#38bdf8',
    description: 'Regular car washing, vacuum cleaning and interior detailing'
  },

  // --- Personal, Golf, Grooming & Leisure ---
  {
    id: 'exp-golf-club',
    title: 'Golf Club Membership Dues',
    expectedMonthlyBudget: 12000,
    group: 'wants',
    categoryId: 'cat-golf-membership',
    envelopeId: 'env-golf-leisure',
    defaultAccountId: 'acc-4',
    icon: 'Award',
    color: '#8b5cf6',
    description: 'Monthly golf country club subscription & card charges',
    isRecurringSubscription: true
  },
  {
    id: 'exp-golf-caddy',
    title: 'Golf Caddy Fees & Tips',
    expectedMonthlyBudget: 8000,
    group: 'wants',
    categoryId: 'cat-golf-caddy',
    envelopeId: 'env-golf-leisure',
    defaultAccountId: 'acc-1',
    icon: 'UserCheck',
    color: '#06b6d4',
    description: 'Weekly caddy allowances and tips during golf rounds'
  },
  {
    id: 'exp-barber-shaving',
    title: 'Barber Shop & Shaving Grooming',
    expectedMonthlyBudget: 3000,
    group: 'wants',
    categoryId: 'cat-barber-grooming',
    envelopeId: 'env-fun',
    defaultAccountId: 'acc-1',
    icon: 'Scissors',
    color: '#14b8a6',
    description: 'Executive barber haircuts, beard shaving and personal grooming'
  },
  {
    id: 'exp-beer-entertainment',
    title: 'Beer, Drinks & Entertainment',
    expectedMonthlyBudget: 15000,
    group: 'wants',
    categoryId: 'cat-entertainment-beer',
    envelopeId: 'env-fun',
    defaultAccountId: 'acc-1',
    icon: 'GlassWater',
    color: '#f97316',
    description: 'Clubhouse drinks, weekend outings & social entertainment'
  },
  {
    id: 'exp-house-amenities',
    title: 'House Amenities & Upkeep',
    expectedMonthlyBudget: 12000,
    group: 'needs',
    categoryId: 'cat-house-amenities',
    envelopeId: 'env-household',
    defaultAccountId: 'acc-1',
    icon: 'Home',
    color: '#10b981',
    description: 'Home amenities, household items and domestic maintenance'
  },
  {
    id: 'exp-donations-harambee',
    title: 'Donations & Harambee Support',
    expectedMonthlyBudget: 15000,
    group: 'wants',
    categoryId: 'cat-donations-harambee',
    envelopeId: 'env-community-giving',
    defaultAccountId: 'acc-1',
    icon: 'HeartHandshake',
    color: '#ec4899',
    description: 'Community Harambees, church tithe/fundraisers & social contributions'
  },

  // --- Core Operations & Living ---
  {
    id: 'exp-biz-operations',
    title: 'Security Operations & Guards',
    expectedMonthlyBudget: 35000,
    group: 'needs',
    categoryId: 'cat-operations',
    envelopeId: 'env-biz-operations',
    defaultAccountId: 'acc-2',
    icon: 'Shield',
    color: '#6366f1',
    description: 'Security guard logistics, shift deployment & equipment'
  },
  {
    id: 'exp-lonjo-maintenance',
    title: 'Lonjo Rentals Repairs & Upkeep',
    expectedMonthlyBudget: 10000,
    group: 'needs',
    categoryId: 'cat-maintenance',
    envelopeId: 'env-rentals-maintenance',
    defaultAccountId: 'acc-1',
    icon: 'Wrench',
    color: '#0ea5e9',
    description: 'Plumbing, painting & gate repairs for rental houses'
  },
  {
    id: 'exp-tea-farm',
    title: 'Tea Farm Labor & Fertilizer',
    expectedMonthlyBudget: 6000,
    group: 'needs',
    categoryId: 'cat-farm-inputs',
    defaultAccountId: 'acc-1',
    icon: 'Leaf',
    color: '#22c55e',
    description: 'Tea pluckers seasonal wages & farm fertilizer'
  },
  {
    id: 'exp-household-groceries',
    title: 'Family Living & Groceries',
    expectedMonthlyBudget: 25000,
    group: 'needs',
    categoryId: 'cat-groceries',
    envelopeId: 'env-household',
    defaultAccountId: 'acc-1',
    icon: 'ShoppingCart',
    color: '#10b981',
    description: 'Naivas supermarket shopping & household provisions'
  },
  {
    id: 'exp-shopping',
    title: 'Shopping (Clothes, Gadgets & Retail)',
    expectedMonthlyBudget: 20000,
    group: 'wants',
    categoryId: 'cat-shopping',
    envelopeId: 'env-shopping',
    defaultAccountId: 'acc-1',
    icon: 'ShoppingBag',
    color: '#a855f7',
    description: 'Clothing, personal accessories, shoes, electronics and lifestyle shopping'
  }
];

export const INITIAL_DEBTORS: Debtor[] = [
  {
    id: 'deb-1',
    debtorName: 'Kiprono (Lonjo Rentals Unit 4)',
    phone: '+254 722 112 334',
    amountOwed: 15000,
    amountPaid: 0,
    dueDate: '2026-10-05',
    description: '2 months back rent arrears for Lonjo apartment',
    status: 'pending',
    notes: 'Promised to clear via M-PESA on 5th',
    createdAt: '2026-09-15'
  },
  {
    id: 'deb-2',
    debtorName: 'Apex Logistics (Security Contract)',
    phone: '+254 733 998 877',
    amountOwed: 35000,
    amountPaid: 10000,
    dueDate: '2026-09-30',
    description: 'Outstanding invoice for guard shift deployment',
    status: 'partially_paid',
    notes: 'KSh 10,000 paid on 20th; KSh 25,000 remaining balance pending verification',
    createdAt: '2026-09-01'
  },
  {
    id: 'deb-3',
    debtorName: 'Tea Factory Green Leaf Adjustment',
    phone: '+254 700 445 566',
    amountOwed: 12500,
    amountPaid: 0,
    dueDate: '2026-10-15',
    description: 'Factory weight disparity reconciliation payment',
    status: 'pending',
    notes: 'Pending factory audit signoff',
    createdAt: '2026-09-10'
  }
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'M-PESA Business / Till',
    type: 'cash',
    balance: 58400.00,
    color: '#22c55e',
    icon: 'Smartphone',
    accountNumber: '••254-712'
  },
  {
    id: 'acc-2',
    name: 'KCB / Equity Business Account',
    type: 'checking',
    balance: 285000.00,
    color: '#06b6d4',
    icon: 'Building2',
    accountNumber: '••4019'
  },
  {
    id: 'acc-3',
    name: 'High-Yield MMF / SACCO Reserve',
    type: 'savings',
    balance: 540000.00,
    color: '#10b981',
    icon: 'ShieldCheck',
    accountNumber: '••8832'
  },
  {
    id: 'acc-4',
    name: 'Credit Card / Visa Gold',
    type: 'credit',
    balance: -12500.00,
    color: '#f43f5e',
    icon: 'CreditCard',
    accountNumber: '••6190'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  // Income
  { id: 'cat-income-security', name: 'Security Company Revenue', group: 'income', icon: 'Shield', color: '#06b6d4', monthlyBudget: 0 },
  { id: 'cat-income-realestate', name: 'Real Estate Agency Income', group: 'income', icon: 'Building', color: '#10b981', monthlyBudget: 0 },
  { id: 'cat-income-rentals', name: 'Lonjo Rental Houses', group: 'income', icon: 'Home', color: '#6366f1', monthlyBudget: 0 },
  { id: 'cat-income-tea', name: 'Tea Plantation Farm', group: 'income', icon: 'Sprout', color: '#84cc16', monthlyBudget: 0 },
  { id: 'cat-income-other', name: 'Debtor Recovery / Other Income', group: 'income', icon: 'Zap', color: '#f59e0b', monthlyBudget: 0 },
  
  // Office, Bills & Connectivity
  { id: 'cat-office-rent', name: 'Office Premises Rent', group: 'needs', icon: 'Building2', color: '#6366f1', monthlyBudget: 25000 },
  { id: 'cat-utilities-electricity', name: 'Electricity & KPLC Tokens', group: 'needs', icon: 'Zap', color: '#eab308', monthlyBudget: 8000 },
  { id: 'cat-internet-wifi', name: 'Internet & Wi-Fi Broadband', group: 'needs', icon: 'Wifi', color: '#06b6d4', monthlyBudget: 5000 },
  { id: 'cat-kra-tax', name: 'KRA Taxes & Compliance', group: 'needs', icon: 'FileSpreadsheet', color: '#dc2626', monthlyBudget: 18000 },
  { id: 'cat-vat-stationeries', name: 'VAT & Office Stationeries', group: 'needs', icon: 'Paperclip', color: '#64748b', monthlyBudget: 7500 },

  // Loans & SACCO Repayments
  { id: 'cat-km-sacco', name: 'K&M SACCO Company Loan', group: 'debt', icon: 'Landmark', color: '#f43f5e', monthlyBudget: 20000 },
  { id: 'cat-imarisha-sacco', name: 'Imarisha SACCO Loan', group: 'debt', icon: 'Landmark', color: '#e11d48', monthlyBudget: 25000 },
  { id: 'cat-personal-fuliza', name: 'Personal Loan & Fuliza', group: 'debt', icon: 'Flame', color: '#ef4444', monthlyBudget: 8500 },

  // Vehicle & Travelling
  { id: 'cat-transport-fuel', name: 'Travelling & Vehicle Fuel', group: 'needs', icon: 'Fuel', color: '#f59e0b', monthlyBudget: 22000 },
  { id: 'cat-car-repairs', name: 'Abrupt Car Repairs & Garage', group: 'needs', icon: 'Wrench', color: '#ea580c', monthlyBudget: 15000 },
  { id: 'cat-car-enhancements', name: 'Car Enhancements & Upgrades', group: 'wants', icon: 'Sparkles', color: '#0284c7', monthlyBudget: 10000 },
  { id: 'cat-car-wash', name: 'Car Wash & Detailing', group: 'wants', icon: 'Droplets', color: '#38bdf8', monthlyBudget: 2500 },

  // Golf, Grooming & Leisure
  { id: 'cat-golf-membership', name: 'Golf Club Membership Dues', group: 'wants', icon: 'Award', color: '#8b5cf6', monthlyBudget: 12000 },
  { id: 'cat-golf-caddy', name: 'Golf Caddy Fees & Tips', group: 'wants', icon: 'UserCheck', color: '#06b6d4', monthlyBudget: 8000 },
  { id: 'cat-barber-grooming', name: 'Barber Shop & Shaving', group: 'wants', icon: 'Scissors', color: '#14b8a6', monthlyBudget: 3000 },
  { id: 'cat-entertainment-beer', name: 'Beer, Drinks & Entertainment', group: 'wants', icon: 'GlassWater', color: '#f97316', monthlyBudget: 15000 },
  { id: 'cat-house-amenities', name: 'House Amenities & Upkeep', group: 'needs', icon: 'Home', color: '#10b981', monthlyBudget: 12000 },
  { id: 'cat-donations-harambee', name: 'Donations & Harambee Support', group: 'wants', icon: 'HeartHandshake', color: '#ec4899', monthlyBudget: 15000 },
  
  // Operations & Living
  { id: 'cat-operations', name: 'Security Operations & Guards', group: 'needs', icon: 'Shield', color: '#6366f1', monthlyBudget: 35000 },
  { id: 'cat-maintenance', name: 'Lonjo Rentals Maintenance', group: 'needs', icon: 'Wrench', color: '#0ea5e9', monthlyBudget: 10000 },
  { id: 'cat-farm-inputs', name: 'Tea Farm Fertilizer & Labor', group: 'needs', icon: 'Leaf', color: '#22c55e', monthlyBudget: 6000 },
  { id: 'cat-groceries', name: 'Family Living & Groceries', group: 'needs', icon: 'ShoppingCart', color: '#10b981', monthlyBudget: 25000 },
  { id: 'cat-shopping', name: 'Shopping & Retail Purchases', group: 'wants', icon: 'ShoppingBag', color: '#a855f7', monthlyBudget: 20000 },
  { id: 'cat-fees', name: 'M-PESA & Bank Paybill Fees', group: 'wants', icon: 'AlertCircle', color: '#ef4444', monthlyBudget: 3000 },
  
  // Savings & Growth
  { id: 'cat-emergency', name: 'Emergency SACCO Vault', group: 'savings', icon: 'ShieldAlert', color: '#14b8a6', monthlyBudget: 30000 },
  { id: 'cat-invest', name: 'MMF Wealth Building & Land', group: 'savings', icon: 'TrendingUp', color: '#22c55e', monthlyBudget: 30000 }
];

export const INITIAL_ENVELOPES: Envelope[] = [
  {
    id: 'env-biz-operations',
    name: 'Office, Tax & Business Ops',
    group: 'needs',
    targetAmount: 85500,
    currentAmount: 85500,
    color: '#6366f1',
    icon: 'Briefcase'
  },
  {
    id: 'env-loans-debt',
    name: 'SACCO Loans & Fuliza Debt',
    group: 'debt',
    targetAmount: 53500,
    currentAmount: 53500,
    color: '#f43f5e',
    icon: 'Landmark'
  },
  {
    id: 'env-transport-fuel',
    name: 'Vehicle Fuel & Garage Repairs',
    group: 'needs',
    targetAmount: 49500,
    currentAmount: 42000,
    color: '#f59e0b',
    icon: 'Fuel'
  },
  {
    id: 'env-household',
    name: 'House Living, Power & Wi-Fi',
    group: 'needs',
    targetAmount: 50000,
    currentAmount: 40000,
    color: '#10b981',
    icon: 'Home'
  },
  {
    id: 'env-golf-leisure',
    name: 'Golf Club, Caddy & Leisure',
    group: 'wants',
    targetAmount: 20000,
    currentAmount: 14000,
    color: '#8b5cf6',
    icon: 'Award'
  },
  {
    id: 'env-fun',
    name: 'Beer, Barber & Social Outings',
    group: 'wants',
    targetAmount: 18000,
    currentAmount: 11000,
    color: '#f97316',
    icon: 'GlassWater'
  },
  {
    id: 'env-shopping',
    name: 'Shopping & Retail Outflows',
    group: 'wants',
    targetAmount: 20000,
    currentAmount: 16000,
    color: '#a855f7',
    icon: 'ShoppingBag'
  },
  {
    id: 'env-community-giving',
    name: 'Donations & Harambee Pool',
    group: 'wants',
    targetAmount: 15000,
    currentAmount: 10000,
    color: '#ec4899',
    icon: 'HeartHandshake'
  },
  {
    id: 'env-investments',
    name: 'MMF Growth & SACCO Vault',
    group: 'savings',
    targetAmount: 40000,
    currentAmount: 40000,
    color: '#22c55e',
    icon: 'TrendingUp'
  }
];

export const ALLOCATION_PRESETS: AllocationPreset[] = [
  {
    id: 'preset-50-30-20',
    name: 'Enterprise 50 / 30 / 20 Blueprint',
    description: '50% Operations/Living/Fuel, 30% Golf/Beer/Harambees, 20% SACCO/MMF',
    icon: 'PieChart',
    splits: [
      { group: 'needs', name: 'Business, Fuel & Living (50%)', percentage: 50, envelopeId: 'env-biz-operations' },
      { group: 'wants', name: 'Golf, Beer & Harambee (30%)', percentage: 30, envelopeId: 'env-golf-leisure' },
      { group: 'savings', name: 'SACCO & MMF Growth (20%)', percentage: 20, envelopeId: 'env-investments' }
    ]
  },
  {
    id: 'preset-debt-crusher',
    name: 'SACCO & Debt Accelerator (40% Debt)',
    description: 'Attack Imarisha & K&M SACCO loans + Fuliza with 40% of incoming funds',
    icon: 'Flame',
    splits: [
      { group: 'needs', name: 'Core Operations & Living (40%)', percentage: 40, envelopeId: 'env-biz-operations' },
      { group: 'debt', name: 'SACCO & Fuliza Clearance (40%)', percentage: 40, envelopeId: 'env-loans-debt' },
      { group: 'wants', name: 'Personal Pocket Allowance (10%)', percentage: 10, envelopeId: 'env-fun' },
      { group: 'savings', name: 'SACCO Reserve (10%)', percentage: 10, envelopeId: 'env-investments' }
    ]
  },
  {
    id: 'preset-zero-based',
    name: 'Zero-Based Comprehensive Budget',
    description: 'Every shilling is ring-fenced across Office, Taxes, Fuel, Golf, Beer & Debt',
    icon: 'Boxes',
    splits: [
      { group: 'needs', name: 'Office, Taxes & Operations (25%)', percentage: 25, envelopeId: 'env-biz-operations' },
      { group: 'debt', name: 'K&M / Imarisha SACCO Loans (20%)', percentage: 20, envelopeId: 'env-loans-debt' },
      { group: 'needs', name: 'Travelling & Vehicle Fuel (10%)', percentage: 10, envelopeId: 'env-transport-fuel' },
      { group: 'needs', name: 'Household, Power & Wi-Fi (15%)', percentage: 15, envelopeId: 'env-household' },
      { group: 'wants', name: 'Golf, Caddy & Club (10%)', percentage: 10, envelopeId: 'env-golf-leisure' },
      { group: 'wants', name: 'Beer, Barber & Leisure (5%)', percentage: 5, envelopeId: 'env-fun' },
      { group: 'wants', name: 'Donations & Harambee (5%)', percentage: 5, envelopeId: 'env-community-giving' },
      { group: 'savings', name: 'MMF Wealth Expansion (10%)', percentage: 10, envelopeId: 'env-investments' }
    ]
  }
];

const today = new Date();
const formatDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(today.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Security Company Monthly Contract Revenue',
    amount: 100000.00,
    type: 'income',
    date: formatDate(1),
    categoryId: 'cat-income-security',
    accountId: 'acc-2',
    incomeStreamId: 'inc-security-co',
    note: 'Corporate security contract receipts'
  },
  {
    id: 'tx-2',
    title: 'Real Estate Management Agency Retainer',
    amount: 50000.00,
    type: 'income',
    date: formatDate(2),
    categoryId: 'cat-income-realestate',
    accountId: 'acc-2',
    incomeStreamId: 'inc-real-estate',
    note: 'Agency commission & management fees'
  },
  {
    id: 'tx-3',
    title: 'Lonjo Rental Houses Tenant Collection',
    amount: 50000.00,
    type: 'income',
    date: formatDate(3),
    categoryId: 'cat-income-rentals',
    accountId: 'acc-1',
    incomeStreamId: 'inc-lonjo-rentals',
    note: 'Direct tenant M-PESA rent collection'
  },
  {
    id: 'tx-4',
    title: 'Tea Plantation Green Leaf Factory Payout',
    amount: 20000.00,
    type: 'income',
    date: formatDate(4),
    categoryId: 'cat-income-tea',
    accountId: 'acc-1',
    incomeStreamId: 'inc-tea-plantation',
    note: 'Factory monthly delivery harvest proceeds'
  },
  {
    id: 'tx-5',
    title: 'Office Premises Monthly Rent',
    amount: 25000.00,
    type: 'expense',
    date: formatDate(4),
    categoryId: 'cat-office-rent',
    accountId: 'acc-2',
    envelopeId: 'env-biz-operations',
    expenseCenterId: 'exp-office-rent',
    note: 'Commercial office lease payment'
  },
  {
    id: 'tx-6',
    title: 'Imarisha SACCO Monthly Loan Installment',
    amount: 25000.00,
    type: 'expense',
    date: formatDate(5),
    categoryId: 'cat-imarisha-sacco',
    accountId: 'acc-2',
    envelopeId: 'env-loans-debt',
    expenseCenterId: 'exp-imarisha-sacco-loan',
    note: 'Bank standing order to Imarisha SACCO'
  },
  {
    id: 'tx-7',
    title: 'K&M SACCO Monthly Loan Servicing',
    amount: 20000.00,
    type: 'expense',
    date: formatDate(5),
    categoryId: 'cat-km-sacco',
    accountId: 'acc-2',
    envelopeId: 'env-loans-debt',
    expenseCenterId: 'exp-km-sacco-loan',
    note: 'Company development loan servicing'
  },
  {
    id: 'tx-8',
    title: 'KRA Monthly Tax Assessment Filing',
    amount: 18000.00,
    type: 'expense',
    date: formatDate(6),
    categoryId: 'cat-kra-tax',
    accountId: 'acc-2',
    envelopeId: 'env-biz-operations',
    expenseCenterId: 'exp-kra-tax',
    note: 'Turnover tax & statutory declaration'
  },
  {
    id: 'tx-9',
    title: 'Abrupt Vehicle Garage Repair & Alternator Fix',
    amount: 14500.00,
    type: 'expense',
    date: formatDate(6),
    categoryId: 'cat-car-repairs',
    accountId: 'acc-1',
    envelopeId: 'env-transport-fuel',
    expenseCenterId: 'exp-car-repairs-abrupt',
    note: 'Emergency alternator replacement at garage'
  },
  {
    id: 'tx-10',
    title: 'Golf Club Card Monthly Membership Fee',
    amount: 12000.00,
    type: 'expense',
    date: formatDate(7),
    categoryId: 'cat-golf-membership',
    accountId: 'acc-4',
    envelopeId: 'env-golf-leisure',
    isSubscription: true,
    subscriptionFrequency: 'monthly',
    expenseCenterId: 'exp-golf-club',
    note: 'Country club membership card auto-charge'
  },
  {
    id: 'tx-11',
    title: 'Golf Game Caddy Fee & Course Tip',
    amount: 2500.00,
    type: 'expense',
    date: formatDate(7),
    categoryId: 'cat-golf-caddy',
    accountId: 'acc-1',
    envelopeId: 'env-golf-leisure',
    expenseCenterId: 'exp-golf-caddy',
    note: '18-hole weekend round caddy payment'
  },
  {
    id: 'tx-12',
    title: 'Clubhouse Beers & Social Drinks',
    amount: 3800.00,
    type: 'expense',
    date: formatDate(8),
    categoryId: 'cat-entertainment-beer',
    accountId: 'acc-1',
    envelopeId: 'env-fun',
    expenseCenterId: 'exp-beer-entertainment',
    note: 'Post-game drinks with business associates'
  },
  {
    id: 'tx-13',
    title: 'Executive Barber Shop Shaving & Haircut',
    amount: 1500.00,
    type: 'expense',
    date: formatDate(8),
    categoryId: 'cat-barber-grooming',
    accountId: 'acc-1',
    envelopeId: 'env-fun',
    expenseCenterId: 'exp-barber-shaving',
    note: 'Haircut and clean shave'
  },
  {
    id: 'tx-14',
    title: 'KPLC Prepaid Electricity Power Tokens',
    amount: 5000.00,
    type: 'expense',
    date: formatDate(9),
    categoryId: 'cat-utilities-electricity',
    accountId: 'acc-1',
    envelopeId: 'env-household',
    expenseCenterId: 'exp-electricity',
    note: 'Home & office power units via M-PESA'
  },
  {
    id: 'tx-15',
    title: 'Monthly High-Speed Fiber Internet Wi-Fi',
    amount: 5000.00,
    type: 'expense',
    date: formatDate(9),
    categoryId: 'cat-internet-wifi',
    accountId: 'acc-1',
    envelopeId: 'env-household',
    expenseCenterId: 'exp-internet-wifi',
    note: 'Broadband Wi-Fi connection payment'
  },
  {
    id: 'tx-16',
    title: 'TotalEnergies / Shell Fuel Top-Up',
    amount: 7500.00,
    type: 'expense',
    date: formatDate(10),
    categoryId: 'cat-transport-fuel',
    accountId: 'acc-2',
    envelopeId: 'env-transport-fuel',
    expenseCenterId: 'exp-travel-fuel',
    note: 'Full tank for travel to tea farm & rentals'
  },
  {
    id: 'tx-17',
    title: 'Executive Car Wash & Interior Detailing',
    amount: 1200.00,
    type: 'expense',
    date: formatDate(10),
    categoryId: 'cat-car-wash',
    accountId: 'acc-1',
    envelopeId: 'env-transport-fuel',
    expenseCenterId: 'exp-car-wash',
    note: 'Full wash & vacuum'
  },
  {
    id: 'tx-18',
    title: 'Community Fundraiser / Harambee Contribution',
    amount: 5000.00,
    type: 'expense',
    date: formatDate(11),
    categoryId: 'cat-donations-harambee',
    accountId: 'acc-1',
    envelopeId: 'env-community-giving',
    expenseCenterId: 'exp-donations-harambee',
    note: 'Local education bursary Harambee support'
  },
  {
    id: 'tx-19',
    title: 'Fuliza Overdraft Partial Clearance',
    amount: 4500.00,
    type: 'expense',
    date: formatDate(12),
    categoryId: 'cat-personal-fuliza',
    accountId: 'acc-1',
    envelopeId: 'env-loans-debt',
    expenseCenterId: 'exp-personal-fuliza',
    note: 'Cleared M-PESA Fuliza overdraft'
  },
  {
    id: 'tx-20',
    title: 'VAT Filing & Office Printing Stationeries',
    amount: 4800.00,
    type: 'expense',
    date: formatDate(13),
    categoryId: 'cat-vat-stationeries',
    accountId: 'acc-2',
    envelopeId: 'env-biz-operations',
    expenseCenterId: 'exp-vat-stationeries',
    note: 'Printing reams, invoice books & VAT return'
  }
];
