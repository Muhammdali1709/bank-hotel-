import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMoney,
  convertAmount,
  calculateTotalBalance,
  calculateCashflow,
  calculateCategoryBreakdown,
  filterTransactions,
  syncBankFeed,
} from './finance';
import { BankAccount, CategoryBudget, Transaction } from '../types';

test('formatMoney formats correctly for UZS, USD, EUR', () => {
  assert.equal(formatMoney(1250000, 'UZS'), "1 250 000 so'm");
  assert.equal(formatMoney(-450000, 'UZS'), "-450 000 so'm");
  assert.equal(formatMoney(125.5, 'USD'), "$125.50");
  assert.equal(formatMoney(-15, 'USD'), "-$15.00");
  assert.ok(formatMoney(89, 'EUR').includes('89'));
});

test('convertAmount calculates currency conversions accurately', () => {
  const usdToUzs = convertAmount(10, 'USD', 'UZS');
  assert.equal(usdToUzs, 128000);

  const uzsToUsd = convertAmount(128000, 'UZS', 'USD');
  assert.equal(uzsToUsd, 10);
});

test('calculateTotalBalance aggregates multiple bank accounts', () => {
  const accounts: BankAccount[] = [
    {
      id: 'acc-1',
      bankName: 'Humo Card',
      accountType: 'card',
      accountNumber: '•••• 4417',
      balance: 4500000,
      currency: 'UZS',
      status: 'connected',
      lastSynced: '2026-11-06T12:00:00Z',
      color: '#10B981',
      badge: 'Humo',
      autoSync: true,
    },
    {
      id: 'acc-2',
      bankName: 'Kapitalbank USD',
      accountType: 'savings',
      accountNumber: '•••• 8920',
      balance: 100, // 100 USD = 1,280,000 UZS
      currency: 'USD',
      status: 'connected',
      lastSynced: '2026-11-06T12:00:00Z',
      color: '#3B82F6',
      badge: 'Visa',
      autoSync: true,
    },
  ];

  const totalInUzs = calculateTotalBalance(accounts, 'UZS');
  assert.equal(totalInUzs, 4500000 + 1280000);
});

test('calculateCashflow computes income, expenses and savings rate correctly', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Salary Deposit',
      merchant: 'Tech Company LLC',
      category: 'salary',
      amount: 15000000,
      date: '2026-11-01T09:00:00Z',
      bankAccountId: 'acc-1',
      status: 'cleared',
      referenceCode: 'TX-001',
      paymentMethod: 'Direct Deposit',
      syncedFromBank: true,
    },
    {
      id: '2',
      title: 'Korzinka Supermarket',
      merchant: 'Korzinka',
      category: 'food',
      amount: -1500000,
      date: '2026-11-02T14:30:00Z',
      bankAccountId: 'acc-1',
      status: 'cleared',
      referenceCode: 'TX-002',
      paymentMethod: 'Humo •••• 4417',
      syncedFromBank: true,
    },
    {
      id: '3',
      title: 'Yandex Go Taxi',
      merchant: 'Yandex Taxi',
      category: 'transport',
      amount: -500000,
      date: '2026-11-03T18:00:00Z',
      bankAccountId: 'acc-1',
      status: 'cleared',
      referenceCode: 'TX-003',
      paymentMethod: 'Humo •••• 4417',
      syncedFromBank: true,
    },
  ];

  const cashflow = calculateCashflow(transactions, 'UZS');
  assert.equal(cashflow.income, 15000000);
  assert.equal(cashflow.expense, 2000000);
  assert.equal(cashflow.net, 13000000);
  // (15000000 - 2000000) / 15000000 = 86.67% -> ~87%
  assert.equal(cashflow.savingsRate, 87);
});

test('calculateCategoryBreakdown computes percentages and detects overbudget', () => {
  const budgets: CategoryBudget[] = [
    { category: 'food', name: 'Food & Dining', nameUz: 'Oziq-ovqat', limit: 2000000, color: '#F97316', iconName: 'Utensils' },
    { category: 'transport', name: 'Transport', nameUz: 'Transport', limit: 1000000, color: '#3B82F6', iconName: 'Car' },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Dinner at Rayhon',
      merchant: 'Rayhon Restaurant',
      category: 'food',
      amount: -2500000, // over 2,000,000 limit
      date: '2026-11-02T19:00:00Z',
      bankAccountId: 'acc-1',
      status: 'cleared',
      referenceCode: 'TX-010',
      paymentMethod: 'Card',
      syncedFromBank: true,
    },
    {
      id: '2',
      title: 'Subway pass',
      merchant: 'Metro',
      category: 'transport',
      amount: -200000,
      date: '2026-11-03T08:00:00Z',
      bankAccountId: 'acc-1',
      status: 'cleared',
      referenceCode: 'TX-011',
      paymentMethod: 'Card',
      syncedFromBank: true,
    },
  ];

  const breakdown = calculateCategoryBreakdown(transactions, budgets);
  const food = breakdown.find((b) => b.category === 'food')!;
  const transport = breakdown.find((b) => b.category === 'transport')!;

  assert.equal(food.spent, 2500000);
  assert.equal(food.isOverBudget, true);
  assert.equal(transport.spent, 200000);
  assert.equal(transport.isOverBudget, false);
});

test('filterTransactions searches query, category, and sorts', () => {
  const txList: Transaction[] = [
    {
      id: '1',
      title: 'Registon Palace Hotel',
      merchant: 'Registon Hotel',
      category: 'housing',
      amount: -1250000,
      date: '2026-11-01T10:00:00Z',
      bankAccountId: 'acc-1',
      status: 'cleared',
      referenceCode: 'HB-2847-16',
      paymentMethod: 'Humo',
      syncedFromBank: true,
    },
    {
      id: '2',
      title: 'Korzinka Supermarket',
      merchant: 'Korzinka Market',
      category: 'food',
      amount: -300000,
      date: '2026-11-04T12:00:00Z',
      bankAccountId: 'acc-1',
      status: 'cleared',
      referenceCode: 'TX-555',
      paymentMethod: 'Humo',
      syncedFromBank: true,
    },
  ];

  const searchRegiston = filterTransactions(txList, { query: 'Registon' });
  assert.equal(searchRegiston.length, 1);
  assert.equal(searchRegiston[0].referenceCode, 'HB-2847-16');

  const filterFood = filterTransactions(txList, { category: 'food' });
  assert.equal(filterFood.length, 1);
  assert.equal(filterFood[0].title, 'Korzinka Supermarket');
});

test('syncBankFeed handles idempotent bank updates and balance adjustments', () => {
  const accounts: BankAccount[] = [
    {
      id: 'acc-humo',
      bankName: 'Humo Card',
      accountType: 'card',
      accountNumber: '•••• 4417',
      balance: 5000000,
      currency: 'UZS',
      status: 'connected',
      lastSynced: '2026-11-01T00:00:00Z',
      color: '#10B981',
      badge: 'Humo',
      autoSync: true,
    },
  ];

  const existingTx: Transaction[] = [
    {
      id: 'old-1',
      title: 'Previous purchase',
      merchant: 'Market',
      category: 'food',
      amount: -100000,
      date: '2026-11-01T10:00:00Z',
      bankAccountId: 'acc-humo',
      status: 'cleared',
      referenceCode: 'REF-OLD-1',
      paymentMethod: 'Humo',
      syncedFromBank: true,
    },
  ];

  const incomingFeed: Transaction[] = [
    {
      id: 'incoming-duplicate',
      title: 'Previous purchase duplicated',
      merchant: 'Market',
      category: 'food',
      amount: -100000,
      date: '2026-11-01T10:00:00Z',
      bankAccountId: 'acc-humo',
      status: 'cleared',
      referenceCode: 'REF-OLD-1', // duplicate!
      paymentMethod: 'Humo',
      syncedFromBank: true,
    },
    {
      id: 'incoming-new',
      title: 'Silk Road Boutique',
      merchant: 'Silk Road',
      category: 'shopping',
      amount: -980000,
      date: '2026-11-06T15:00:00Z',
      bankAccountId: 'acc-humo',
      status: 'cleared',
      referenceCode: 'HB-3190-02',
      paymentMethod: 'Humo •••• 4417',
      syncedFromBank: true,
    },
  ];

  const syncResult = syncBankFeed(accounts, existingTx, incomingFeed);

  assert.equal(syncResult.newTransactionsCount, 1);
  assert.equal(syncResult.totalSyncedAmount, 980000);
  assert.equal(syncResult.updatedTransactions.length, 2);
  // Account balance was 5,000,000, delta was -980,000 -> 4,020,000
  assert.equal(syncResult.updatedAccounts[0].balance, 4020000);
});
