import React, { useState } from 'react';
import {
  ChevronLeft,
  CreditCard,
  Building,
  ShieldCheck,
  RefreshCw,
  Plus,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import { BankAccount, CurrencyCode } from '../../types';
import { AVAILABLE_BANKS_FOR_CONNECTION } from '../../data/initialData';
import { formatMoney } from '../../utils/finance';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface BankSyncModalProps {
  accounts: BankAccount[];
  selectedAccountId: string;
  onSelectAccount: (accId: string) => void;
  currency: CurrencyCode;
  language: Language;
  onClose: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  onAddNewAccount: (account: Partial<BankAccount>) => void;
  onProceedToSuccess: (referenceCode: string, totalAmount: number) => void;
}

export const BankSyncModal: React.FC<BankSyncModalProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  currency,
  language,
  onClose,
  onTriggerSync,
  isSyncing,
  onAddNewAccount,
  onProceedToSuccess,
}) => {
  const t = TRANSLATIONS[language];
  const [showConnectWizard, setShowConnectWizard] = useState(false);
  const [selectedBankToConnect, setSelectedBankToConnect] = useState<string>('kapital');
  const [newCardNumber, setNewCardNumber] = useState('8600 1400 9921 5532');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Price calculations matching Screen 07
  const baseRate = 1590000;
  const nights = 3;
  const subtotal = baseRate * nights; // 4,770,000 so'm
  const discount = 143100; // -3% discount
  const grandTotal = subtotal - discount; // 4,626,900 so'm

  const handleConnectBank = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      const bankInfo = AVAILABLE_BANKS_FOR_CONNECTION.find((b) => b.id === selectedBankToConnect);
      const newAcc: Partial<BankAccount> = {
        id: `bank-${Date.now()}`,
        bankName: bankInfo ? bankInfo.name : 'Kapitalbank',
        accountType: 'card',
        accountNumber: `•••• ${newCardNumber.slice(-4) || '9921'}`,
        balance: 7500000,
        currency: 'UZS',
        status: 'connected',
        lastSynced: new Date().toISOString(),
        color: '#059669',
        badge: bankInfo ? bankInfo.name.split(' ')[0] : 'Bank',
        autoSync: true,
      };
      onAddNewAccount(newAcc);
      setShowConnectWizard(false);
    }, 1000);
  };

  const handlePayAndSync = () => {
    onProceedToSuccess('HB-2847-16', grandTotal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Header matching Screen 07 */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
              aria-label="Orqaga"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h2 className="font-extrabold text-base text-slate-900">
              Bronni tasdiqlash & To‘lov
            </h2>
          </div>

          <button
            onClick={() => setShowConnectWizard(true)}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Karta qo‘shish</span>
          </button>
        </div>

        {/* Scrollable Body matching Screen 07 */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {/* Hotel card header */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80"
              alt="Registon Palace Hotel"
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Registon Palace Hotel
              </h3>
              <p className="text-[11px] text-slate-500">Samarqand, O‘zbekiston</p>
              <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                <span>★ 4.9</span>
                <span className="text-slate-400 font-normal">(1 248 sharh)</span>
              </div>
            </div>
          </div>

          {/* Safari tafsilotlari matching Screen 07 */}
          <div className="rounded-2xl border border-slate-100 p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Safaringiz
              </h4>
              <button
                onClick={onClose}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                O‘zgartirish &gt;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Kirish</span>
                <span className="font-bold text-slate-900 block mt-0.5">Pay, 12-noyabr</span>
                <span className="text-[10px] text-slate-500">14:00 dan</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Chiqish (3 kecha)</span>
                <span className="font-bold text-slate-900 block mt-0.5">Yak, 15-noyabr</span>
                <span className="text-[10px] text-slate-500">12:00 gacha</span>
              </div>
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
              <span>👥 Mehmonlar: 2 kattalar</span>
              <span>🏨 Xona: Deluxe King - 1 ta</span>
            </div>
          </div>

          {/* To'lov usuli (Payment Method / Connected Cards) matching Screen 07 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                To‘lov usuli
              </h4>
              <button
                onClick={() => setShowConnectWizard(true)}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
              >
                Karta qo‘shish &gt;
              </button>
            </div>

            <div className="space-y-2">
              {accounts.map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => onSelectAccount(acc.id)}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-slate-950 bg-slate-50/70 ring-1 ring-slate-950'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">
                          {acc.bankName} {acc.accountNumber}
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          {acc.id === 'bank-humo' ? 'Asosiy karta' : 'Qo‘shimcha hisob'} • Balans:{' '}
                          <span className="font-semibold text-slate-800">
                            {formatMoney(acc.balance, acc.currency)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}

              {/* Cash option */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between opacity-80 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Mehmonxonada to‘lash</h5>
                    <p className="text-[10px] text-slate-400">Naqd yoki karta orqali kelganda</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
              </div>
            </div>
          </div>

          {/* Narx tafsilotlari (Price breakdown) matching Screen 07 */}
          <div className="rounded-2xl border border-slate-100 p-4 space-y-2 bg-slate-50/50">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
              Narx tafsilotlari
            </h4>

            <div className="flex justify-between text-xs text-slate-600">
              <span>{formatMoney(baseRate, currency)} x {nights} kecha</span>
              <span className="font-semibold text-slate-900">{formatMoney(subtotal, currency)}</span>
            </div>

            <div className="flex justify-between text-xs text-emerald-600 font-medium">
              <span>FinSync maxsus chegirmasi (-3%)</span>
              <span>-{formatMoney(discount, currency)}</span>
            </div>

            <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
              <span>Soliqlar va xizmat haqi</span>
              <span className="text-emerald-700 font-bold">Kiritilgan</span>
            </div>

            <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
              <span>Jami to‘lov:</span>
              <span className="text-base text-emerald-600">{formatMoney(grandTotal, currency)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Pay & Sync Button matching Screen 07 */}
        <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handlePayAndSync}
            disabled={isSyncing}
            className="w-full py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Bank bilan sinxronlanmoqda...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>To‘lash - {formatMoney(grandTotal, currency)}</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>To‘lov va sinxronizatsiya 256-bit SSL bilan himoyalangan</span>
          </p>
        </div>

        {/* Connect New Bank Open Banking Wizard Modal */}
        {showConnectWizard && (
          <div className="absolute inset-0 z-30 bg-white p-5 flex flex-col justify-between animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Open Banking: Yangi Bank Ulash
                  </h3>
                </div>
                <button
                  onClick={() => setShowConnectWizard(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConnectBank} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bankni tanlang
                  </label>
                  <select
                    value={selectedBankToConnect}
                    onChange={(e) => setSelectedBankToConnect(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:outline-none"
                  >
                    {AVAILABLE_BANKS_FOR_CONNECTION.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.logo} {b.name} ({b.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Karta yoki Hisob raqami
                  </label>
                  <input
                    type="text"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    placeholder="8600 •••• •••• ••••"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:outline-none tracking-wider"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tezkor avtorizatsiya va sinxronizatsiya</span>
                  </div>
                  <p>
                    Ushbu bank ulangandan so‘ng so‘nggi barcha xarajatlar avtomatik tarzda ilovaga yuklanadi.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isAuthorizing}
                  className="w-full py-3.5 rounded-xl bg-slate-950 text-white font-bold text-xs shadow-md transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  {isAuthorizing ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Bank hisobini tasdiqlash va ulash'
                  )}
                </button>
              </form>
            </div>

            <button
              onClick={() => setShowConnectWizard(false)}
              className="text-xs text-center text-slate-400 hover:text-slate-600 py-2 cursor-pointer font-medium"
            >
              Bekor qilish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
