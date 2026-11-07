import { BankAccount, CategoryBudget, CurrencyCode, Transaction, TransactionCategory } from '../types';

export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  UZS: 1,
  USD: 12800, // 1 USD = 12,800 UZS
  EUR: 13900, // 1 EUR = 13,900 UZS
};

export function formatMoney(amount: number, currency: CurrencyCode = 'UZS'): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (currency === 'UZS') {
    // Format: 1 250 000 so'm
    const formatted = Math.round(absAmount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${isNegative ? '-' : ''}${formatted} so'm`;
  }

  if (currency === 'USD') {
    const formatted = absAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${isNegative ? '-' : ''}$${formatted}`;
  }

  if (currency === 'EUR') {
    const formatted = absAmount.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${isNegative ? '-' : ''}€${formatted}`;
  }

  return `${amount}`;
}

export function convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const amountInUZS = amount * EXCHANGE_RATES[from];
  return amountInUZS / EXCHANGE_RATES[to];
}

export function calculateTotalBalance(accounts: BankAccount[], targetCurrency: CurrencyCode = 'UZS'): number {
  return accounts.reduce((sum, acc) => {
    return sum + convertAmount(acc.balance, acc.currency, targetCurrency);
  }, 0);
}

export interface CashflowSummary {
  income: number;
  expense: number;
  net: number;
  savingsRate: number;
}

export function calculateCashflow(transactions: Transaction[], targetCurrency: CurrencyCode = 'UZS'): CashflowSummary {
  let income = 0;
  let expense = 0;

  for (const tx of transactions) {
    if (tx.amount > 0) {
      income += tx.amount;
    } else {
      expense += Math.abs(tx.amount);
    }
  }

  const net = income - expense;
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

  return { income, expense, net, savingsRate };
}

export interface CategorySummary {
  category: TransactionCategory;
  name: string;
  nameUz: string;
  spent: number;
  limit: number;
  percentage: number;
  color: string;
  count: number;
  isOverBudget: boolean;
}

export function calculateCategoryBreakdown(
  transactions: Transaction[],
  budgets: CategoryBudget[]
): CategorySummary[] {
  const categorySpentMap = new Map<TransactionCategory, { spent: number; count: number }>();

  for (const tx of transactions) {
    if (tx.amount < 0) {
      const existing = categorySpentMap.get(tx.category) || { spent: 0, count: 0 };
      existing.spent += Math.abs(tx.amount);
      existing.count += 1;
      categorySpentMap.set(tx.category, existing);
    }
  }

  return budgets.map((b) => {
    const data = categorySpentMap.get(b.category) || { spent: 0, count: 0 };
    const percentage = b.limit > 0 ? Math.min(200, Math.round((data.spent / b.limit) * 100)) : 0;
    return {
      category: b.category,
      name: b.name,
      nameUz: b.nameUz,
      spent: data.spent,
      limit: b.limit,
      percentage,
      color: b.color,
      count: data.count,
      isOverBudget: data.spent > b.limit,
    };
  });
}

export interface TransactionFilterOptions {
  query?: string;
  category?: TransactionCategory | 'all';
  bankAccountId?: string | 'all';
  status?: string | 'all';
  sortBy?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
  startDate?: string;
  endDate?: string;
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilterOptions
): Transaction[] {
  return transactions
    .filter((tx) => {
      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        const matchTitle = tx.title.toLowerCase().includes(q);
        const matchMerchant = tx.merchant.toLowerCase().includes(q);
        const matchRef = tx.referenceCode.toLowerCase().includes(q);
        const matchNotes = tx.notes ? tx.notes.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchMerchant && !matchRef && !matchNotes) {
          return false;
        }
      }

      if (filters.category && filters.category !== 'all') {
        if (tx.category !== filters.category) return false;
      }

      if (filters.bankAccountId && filters.bankAccountId !== 'all') {
        if (tx.bankAccountId !== filters.bankAccountId) return false;
      }

      if (filters.status && filters.status !== 'all') {
        if (tx.status !== filters.status) return false;
      }

      if (filters.startDate) {
        if (new Date(tx.date) < new Date(filters.startDate)) return false;
      }

      if (filters.endDate) {
        if (new Date(tx.date) > new Date(filters.endDate)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount_desc':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount_asc':
          return Math.abs(a.amount) - Math.abs(b.amount);
        case 'date_desc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
}

export interface BankSyncResult {
  updatedAccounts: BankAccount[];
  updatedTransactions: Transaction[];
  newTransactionsCount: number;
  totalSyncedAmount: number;
}

export function syncBankFeed(
  currentAccounts: BankAccount[],
  currentTransactions: Transaction[],
  incomingTransactions: Transaction[],
  targetBankAccountId?: string
): BankSyncResult {
  const existingRefs = new Set(currentTransactions.map((t) => t.referenceCode));
  const newTransactions: Transaction[] = [];
  let totalSyncedAmount = 0;

  for (const incoming of incomingTransactions) {
    if (targetBankAccountId && incoming.bankAccountId !== targetBankAccountId) {
      continue;
    }
    if (!existingRefs.has(incoming.referenceCode)) {
      newTransactions.push(incoming);
      existingRefs.add(incoming.referenceCode);
      totalSyncedAmount += Math.abs(incoming.amount);
    }
  }

  // Update bank account balances
  const updatedAccounts = currentAccounts.map((acc) => {
    if (targetBankAccountId && acc.id !== targetBankAccountId) {
      return acc;
    }
    const accNewTx = newTransactions.filter((t) => t.bankAccountId === acc.id);
    const balanceDelta = accNewTx.reduce((sum, t) => sum + t.amount, 0);

    return {
      ...acc,
      balance: acc.balance + balanceDelta,
      lastSynced: new Date().toISOString(),
      status: 'connected' as const,
    };
  });

  return {
    updatedAccounts,
    updatedTransactions: [...newTransactions, ...currentTransactions],
    newTransactionsCount: newTransactions.length,
    totalSyncedAmount,
  };
}
