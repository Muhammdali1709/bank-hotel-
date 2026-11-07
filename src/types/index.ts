export type CurrencyCode = 'UZS' | 'USD' | 'EUR';

export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'utilities'
  | 'salary'
  | 'transfer';

export type TransactionStatus = 'cleared' | 'pending' | 'recurring';

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'card' | 'credit';
  accountNumber: string;
  balance: number;
  currency: CurrencyCode;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSynced: string;
  color: string;
  badge: string;
  institutionLogo?: string;
  autoSync: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  merchant: string;
  category: TransactionCategory;
  amount: number; // Negative for expense, positive for income
  date: string; // ISO date format YYYY-MM-DDTHH:mm:ss
  bankAccountId: string;
  status: TransactionStatus;
  referenceCode: string;
  paymentMethod: string;
  notes?: string;
  receiptUrl?: string;
  isRecurring?: boolean;
  syncedFromBank: boolean;
}

export interface CategoryBudget {
  category: TransactionCategory;
  name: string;
  nameUz: string;
  limit: number;
  color: string;
  iconName: string;
}

export interface RecurringSubscription {
  id: string;
  name: string;
  merchant: string;
  amount: number;
  category: TransactionCategory;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  status: 'active' | 'upcoming' | 'cancelled';
  bankAccountId: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  tier: string;
  score: number;
  language: 'uz' | 'en';
  preferredCurrency: CurrencyCode;
  notificationsEnabled: boolean;
  biometricsEnabled: boolean;
}

export interface SyncProgressState {
  isSyncing: boolean;
  step: 'idle' | 'connecting' | 'authorizing' | 'fetching' | 'categorizing' | 'completed';
  progressPercent: number;
  message: string;
  syncedCount: number;
}
