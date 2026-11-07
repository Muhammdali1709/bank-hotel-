import React from 'react';
import {
  Bell,
  MapPin,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Plus,
  Receipt,
  PiggyBank,
  ChevronRight,
  Star,
  Building2,
  UtensilsCrossed,
  Palmtree,
  ShoppingBag,
} from 'lucide-react';
import { BankAccount, CurrencyCode, Transaction, UserProfile } from '../../types';
import { calculateCashflow, calculateTotalBalance, formatMoney } from '../../utils/finance';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface HomeViewProps {
  user: UserProfile;
  accounts: BankAccount[];
  transactions: Transaction[];
  currency: CurrencyCode;
  language: Language;
  onNavigateToTransactions: () => void;
  onNavigateToBudgets: () => void;
  onNavigateToBanks: () => void;
  onOpenAddModal: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  accounts,
  transactions,
  currency,
  language,
  onNavigateToTransactions,
  onNavigateToBudgets,
  onNavigateToBanks,
  onOpenAddModal,
  onSelectTransaction,
  onTriggerSync,
  isSyncing,
}) => {
  const t = TRANSLATIONS[language];
  const totalBalance = calculateTotalBalance(accounts, currency);
  const cashflow = calculateCashflow(transactions, currency);
  const recentTransactions = transactions.slice(0, 4);

  // Recommendations matching Screen 03 carousel
  const recommendations = [
    {
      id: 'rec-1',
      title: 'Registon Palace Hotel',
      location: 'Samarqand, O‘zbekiston',
      rating: 4.9,
      reviews: '1 248',
      discount: '-15%',
      price: 1250000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      category: 'Turar joy',
    },
    {
      id: 'rec-2',
      title: 'Silk Road Boutique',
      location: 'Buxoro, O‘zbekiston',
      rating: 4.8,
      reviews: '890',
      tag: 'Yangi',
      price: 980000,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      category: 'Xaridlar',
    },
    {
      id: 'rec-3',
      title: 'Afrosiyob Garden Resort',
      location: 'Samarqand, O‘zbekiston',
      rating: 4.9,
      reviews: '740',
      price: 890000,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      category: 'Restoran',
    },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Header with Avatar, Greeting & Notification Bell matching Screen 03 */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-800 text-sm shadow-sm overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              'JA'
            )}
          </div>
          <div>
            <div className="flex items-center gap-1 text-slate-800 font-bold text-base leading-tight">
              <span>{t.greeting}, {user.name.split(' ')[0]}</span>
              <span className="inline-block text-amber-500">👋</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Toshkent, O‘zbekiston</span>
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateToBanks}
          className="relative w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition shadow-sm cursor-pointer"
          aria-label="Bildirishnomalar va bank holati"
        >
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
      </div>

      {/* 2. Total Balance & Live Sync Card (Hero widget) */}
      <div className="rounded-3xl bg-slate-950 text-white p-5 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {t.totalBalance}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                4 ta bank ulangan
              </span>
            </div>

            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition cursor-pointer font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? t.syncing : t.syncBanks}</span>
            </button>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {formatMoney(totalBalance, currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.syncedJustNow} • Humo, Uzcard & Kapitalbank</span>
            </p>
          </div>

          {/* Cashflow Income vs Expense mini bar */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.income}</span>
                <span className="font-semibold text-emerald-400">
                  +{formatMoney(cashflow.income, currency)}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                <TrendingDown className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.expense}</span>
                <span className="font-semibold text-rose-400">
                  -{formatMoney(cashflow.expense, currency)}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-slate-400 block">{t.savingsRate}</span>
              <span className="font-bold text-slate-200">{cashflow.savingsRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Buttons */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 shadow-sm transition active:scale-95 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
            {t.addExpense}
          </span>
        </button>

        <button
          onClick={onNavigateToBanks}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 shadow-sm transition active:scale-95 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
            {t.connectBank}
          </span>
        </button>

        <button
          onClick={onNavigateToBudgets}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 shadow-sm transition active:scale-95 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition">
            <PiggyBank className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
            {t.navBudgets}
          </span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 shadow-sm transition active:scale-95 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition">
            <Receipt className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
            {t.scanReceipt}
          </span>
        </button>
      </div>

      {/* 4. Quick Category Pills matching Screen 03 */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={onNavigateToTransactions}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-950 text-white text-xs font-semibold whitespace-nowrap shadow-sm cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Mehmonxona</span>
        </button>
        <button
          onClick={onNavigateToTransactions}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold whitespace-nowrap shadow-sm cursor-pointer"
        >
          <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
          <span>Kurort</span>
        </button>
        <button
          onClick={onNavigateToTransactions}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold whitespace-nowrap shadow-sm cursor-pointer"
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" />
          <span>Restoran & Oziq-ovqat</span>
        </button>
        <button
          onClick={onNavigateToTransactions}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold whitespace-nowrap shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-rose-500" />
          <span>Xaridlar</span>
        </button>
      </div>

      {/* 5. "Siz uchun tavsiyalar" matching Screen 03 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {t.recommendations}
          </h2>
          <button
            onClick={onNavigateToTransactions}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal scroll cards matching Screen 03 */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => {
                const matched = transactions.find((t) => t.title.toLowerCase().includes(rec.title.toLowerCase().slice(0, 8)));
                if (matched) {
                  onSelectTransaction(matched);
                } else {
                  onSelectTransaction(transactions[0]);
                }
              }}
              className="flex-none w-56 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={rec.image}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {rec.discount && (
                  <span className="absolute top-2 left-2 bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow">
                    {rec.discount}
                  </span>
                )}
                {rec.tag && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow">
                    {rec.tag}
                  </span>
                )}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{rec.rating}</span>
                </div>
              </div>

              <div className="p-3 space-y-1">
                <h3 className="font-bold text-xs text-slate-900 truncate">
                  {rec.title}
                </h3>
                <p className="text-[10px] text-slate-500 flex items-center gap-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 text-slate-400" />
                  <span>{rec.location}</span>
                </p>
                <div className="pt-1 flex items-baseline justify-between">
                  <span className="font-extrabold text-xs text-slate-900">
                    {formatMoney(rec.price, currency)}
                  </span>
                  <span className="text-[9px] text-slate-400">/ tranzaksiya</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Recent Synced Transactions Feed matching Screen 03 bottom */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {t.recentTransactions}
          </h2>
          <button
            onClick={onNavigateToTransactions}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction(tx)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden">
                  {tx.receiptUrl ? (
                    <img src={tx.receiptUrl} alt={tx.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>{tx.merchant.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{tx.title}</h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{tx.paymentMethod}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{tx.referenceCode}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-extrabold text-xs ${
                    tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}
                  {formatMoney(tx.amount, currency)}
                </span>
                <span className="block text-[9px] text-slate-400 mt-0.5">
                  {new Date(tx.date).toLocaleDateString(language === 'uz' ? 'uz-UZ' : 'en-US', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
