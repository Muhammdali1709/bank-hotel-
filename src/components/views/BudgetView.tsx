import React, { useState } from 'react';
import {
  Building2,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Tv,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { CategoryBudget, CurrencyCode, Transaction, TransactionCategory } from '../../types';
import { calculateCategoryBreakdown, formatMoney } from '../../utils/finance';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface BudgetViewProps {
  budgets: CategoryBudget[];
  transactions: Transaction[];
  currency: CurrencyCode;
  language: Language;
  onUpdateBudget: (category: TransactionCategory, newLimit: number) => void;
  onProceedToBookingOrSync: () => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  budgets,
  transactions,
  currency,
  language,
  onUpdateBudget,
  onProceedToBookingOrSync,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedRoom, setSelectedRoom] = useState<'deluxe' | 'standard'>('deluxe');
  const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);

  const breakdown = calculateCategoryBreakdown(transactions, budgets);
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = breakdown.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalLimit > 0 ? Math.min(100, Math.round((totalSpent / totalLimit) * 100)) : 0;

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Header summary card */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {t.budgetOverview}
            </span>
            <span className="text-xs font-bold text-emerald-400">
              {overallPercentage}% sarflandi
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {formatMoney(totalSpent, currency)}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">
                / {formatMoney(totalLimit, currency)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage > 90 ? 'bg-rose-500' : overallPercentage > 75 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>{t.spent}: {formatMoney(totalSpent, currency)}</span>
            <span>{t.remaining}: {formatMoney(Math.max(0, totalLimit - totalSpent), currency)}</span>
          </div>
        </div>
      </div>

      {/* 2. Room / Package Selector matching Screen 06 ("06 • Xona tanlash") */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
            {language === 'uz' ? 'Xona va Budjet paketi tanlovi' : 'Room & Spending Package'}
          </h3>
          <span className="text-xs text-emerald-600 font-semibold">Registon Palace Hotel</span>
        </div>

        {/* Deluxe King Room Card matching Screen 06 */}
        <div
          onClick={() => setSelectedRoom('deluxe')}
          className={`rounded-2xl border transition p-4 cursor-pointer relative bg-white shadow-sm ${
            selectedRoom === 'deluxe'
              ? 'border-slate-950 ring-2 ring-slate-950/5'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="relative h-32 rounded-xl overflow-hidden mb-3">
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
              alt="Deluxe King Room"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Eng ommabop
            </span>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-md">
              8 ta rasm
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Deluxe King xona</h4>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mt-1">
                  <span>📐 32 m²</span>
                  <span>🛏️ King karavot</span>
                  <span>👥 2 mehmon</span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRoom === 'deluxe'
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-300'
                }`}
              >
                {selectedRoom === 'deluxe' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-100">
              <p>✓ Nonushta kiritilgan</p>
              <p>✓ Bepul bekor qilish (24 soat)</p>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="font-extrabold text-base text-slate-900">
                  {formatMoney(1590000, currency)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">/ kecha</span>
                <span className="block text-[10px] text-slate-400">
                  3 kecha: {formatMoney(4770000, currency)}
                </span>
              </div>

              <button
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedRoom === 'deluxe'
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {selectedRoom === 'deluxe' ? 'Tanlangan' : 'Tanlash'}
              </button>
            </div>
          </div>
        </div>

        {/* Standard Room Card */}
        <div
          onClick={() => setSelectedRoom('standard')}
          className={`rounded-2xl border transition p-4 cursor-pointer relative bg-white shadow-sm ${
            selectedRoom === 'standard'
              ? 'border-slate-950 ring-2 ring-slate-950/5'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Standart xona</h4>
              <p className="text-[10px] text-slate-500">22 m² • Queen karavot • 2 mehmon</p>
              <p className="font-extrabold text-xs text-slate-900 mt-1">
                {formatMoney(1100000, currency)} / kecha
              </p>
            </div>
            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedRoom === 'standard'
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {selectedRoom === 'standard' ? 'Tanlangan' : 'Tanlash'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Budgets breakdown list with live sliders */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
          Oylik toifalar budjeti (Limitlarni boshqarish)
        </h3>

        <div className="space-y-2.5">
          {breakdown.map((item) => (
            <div
              key={item.category}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:border-slate-200 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-sm"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.nameUz.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{item.nameUz}</h4>
                    <span className="text-[10px] text-slate-400">{item.count} ta to‘lov</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-xs text-slate-900">
                    {formatMoney(item.spent, currency)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    / {formatMoney(item.limit, currency)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    item.isOverBudget ? 'bg-rose-500' : 'bg-slate-900'
                  }`}
                  style={{ width: `${Math.min(100, item.percentage)}%` }}
                />
              </div>

              {/* Slider for limit adjustment */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 text-[10px]">
                <span className="text-slate-500">
                  {item.isOverBudget ? (
                    <span className="text-rose-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Budjetdan oshib ketdi!
                    </span>
                  ) : (
                    <span>{100 - item.percentage}% limit qoldi</span>
                  )}
                </span>

                <button
                  onClick={() => setEditingCategory(editingCategory === item.category ? null : item.category)}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  {editingCategory === item.category ? 'Yopish' : 'Limitni o‘zgartirish'}
                </button>
              </div>

              {editingCategory === item.category && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Yangi oylik limit:</span>
                    <span>{formatMoney(item.limit, currency)}</span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={10000000}
                    step={250000}
                    value={item.limit}
                    onChange={(e) => onUpdateBudget(item.category, Number(e.target.value))}
                    className="w-full accent-slate-950 cursor-pointer"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Sticky Proceed Bar matching Screen 06 */}
      <div className="sticky bottom-16 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-3 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block">Jami • 3 kecha</span>
          <span className="text-base font-black text-slate-950">
            {formatMoney(selectedRoom === 'deluxe' ? 4770000 : 3300000, currency)}
          </span>
        </div>

        <button
          onClick={onProceedToBookingOrSync}
          className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-[0.98] cursor-pointer"
        >
          Davom etish
        </button>
      </div>
    </div>
  );
};
