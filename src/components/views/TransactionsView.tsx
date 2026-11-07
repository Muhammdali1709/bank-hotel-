import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Zap,
  Tv,
  Wallet,
  ArrowUpDown,
  Download,
  Heart,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { BankAccount, CurrencyCode, Transaction, TransactionCategory } from '../../types';
import { filterTransactions, formatMoney } from '../../utils/finance';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  currency: CurrencyCode;
  language: Language;
  onSelectTransaction: (tx: Transaction) => void;
  onOpenAddModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  accounts,
  currency,
  language,
  onSelectTransaction,
  onOpenAddModal,
}) => {
  const t = TRANSLATIONS[language];
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | 'all'>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(['tx-001']));

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return filterTransactions(transactions, {
      query,
      category: selectedCategory,
      bankAccountId: selectedAccount,
      status: selectedStatus,
      sortBy,
    });
  }, [transactions, query, selectedCategory, selectedAccount, selectedStatus, sortBy]);

  const categoriesList: { id: TransactionCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: t.all, icon: Wallet },
    { id: 'housing', label: 'Mehmonxona', icon: Building2 },
    { id: 'food', label: 'Oziq-ovqat', icon: UtensilsCrossed },
    { id: 'transport', label: 'Transport', icon: Car },
    { id: 'shopping', label: 'Xaridlar', icon: ShoppingBag },
    { id: 'utilities', label: 'Kommunal', icon: Zap },
    { id: 'entertainment', label: 'Obunalar', icon: Tv },
  ];

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Merchant', 'Category', 'Amount', 'Currency', 'Date', 'Bank', 'Status', 'RefCode'];
    const rows = filtered.map((tx) => [
      tx.id,
      `"${tx.title.replace(/"/g, '""')}"`,
      `"${tx.merchant.replace(/"/g, '""')}"`,
      tx.category,
      tx.amount,
      currency,
      tx.date,
      `"${tx.paymentMethod}"`,
      tx.status,
      tx.referenceCode,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinSync_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Search Bar matching Screen 04 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-sm focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-950/5 transition">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
            aria-label="Xarajatlarni qidirish"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter / Sort Button */}
        <div className="relative">
          <button
            onClick={() => {
              setSortBy((prev) => (prev === 'date_desc' ? 'amount_desc' : prev === 'amount_desc' ? 'amount_asc' : 'date_desc'));
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-sm transition cursor-pointer"
            title="Saralash"
            aria-label="Saralash tartibi"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">
              {sortBy === 'date_desc' ? t.newest : sortBy === 'amount_desc' ? t.highest : t.lowest}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Category Filter Pills matching Screen 04 */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {categoriesList.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Account & Status Quick Chips & Results Count matching Screen 04 ("128 ta mehmonxona topildi") */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-bold text-slate-900">{filtered.length} ta</span>
          <span>tranzaksiya topildi</span>
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-700 focus:outline-none cursor-pointer"
            aria-label="Bank hisobini tanlash"
          >
            <option value="all">Barcha kartalar</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.bankName} ({acc.accountNumber})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
            title="CSV faylga eksport qilish"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* 4. Transaction Cards List matching Screen 04 */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Hech qanday tranzaksiya topilmadi</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Qidiruv so‘zini o‘zgartiring yoki yangi xarajat qo‘shing.
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs"
            >
              + Xarajat qo‘shish
            </button>
          </div>
        ) : (
          filtered.map((tx) => {
            const isFav = favoriteIds.has(tx.id);
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="bg-white rounded-2xl border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow transition p-3.5 flex gap-3.5 cursor-pointer relative group"
              >
                {/* Left Thumbnail with discount or status badge */}
                <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative">
                  {tx.receiptUrl ? (
                    <img
                      src={tx.receiptUrl}
                      alt={tx.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2 text-center">
                      <span className="font-bold text-xs">{tx.merchant.slice(0, 3).toUpperCase()}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{tx.category}</span>
                    </div>
                  )}

                  {tx.category === 'housing' && (
                    <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      -15%
                    </span>
                  )}
                </div>

                {/* Right Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition">
                        {tx.title}
                      </h3>

                      {/* Heart Favorite button matching Screen 04 */}
                      <button
                        onClick={(e) => toggleFavorite(e, tx.id)}
                        className="text-slate-300 hover:text-rose-500 transition p-1"
                        aria-label="Sevimlilarga qo'shish"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFav ? 'fill-rose-500 text-rose-500' : 'stroke-[1.5]'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>{tx.merchant}</span>
                      <span>•</span>
                      <span>{tx.paymentMethod}</span>
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {tx.status === 'cleared' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-500" />
                        )}
                        <span>{tx.status === 'cleared' ? t.cleared : t.pending}</span>
                      </span>

                      <span className="text-slate-400 font-mono">{tx.referenceCode}</span>
                    </div>
                  </div>

                  {/* Price & Date Bottom Row */}
                  <div className="pt-2 flex items-baseline justify-between border-t border-slate-50 mt-1">
                    <div>
                      <span
                        className={`font-black text-sm ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {formatMoney(tx.amount, currency)}
                      </span>
                      {tx.category === 'housing' && (
                        <span className="text-[9px] text-slate-400 ml-1">/ kecha</span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(tx.date).toLocaleDateString(language === 'uz' ? 'uz-UZ' : 'en-US', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
