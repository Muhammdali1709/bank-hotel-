import React from 'react';
import { Smartphone, Monitor, Globe, RefreshCw, Layers } from 'lucide-react';
import { CurrencyCode } from '../../types';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface HeaderProps {
  currentScreen: string;
  onSelectScreen: (screen: string) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleMobileFrame,
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  isSyncing,
  onTriggerSync,
}) => {
  const t = TRANSLATIONS[language];

  const screensList = [
    { id: 'onboarding', label: '01 • Onboarding' },
    { id: 'auth', label: '02 • Kirish (Auth)' },
    { id: 'home', label: '03 • Asosiy (Home)' },
    { id: 'transactions', label: '04 • Qidiruv (Expenses)' },
    { id: 'detail', label: '05 • Mehmonxona tafsilotlari' },
    { id: 'budgets', label: '06 • Xona & Budjet' },
    { id: 'banks', label: '07 • To‘lov & Bank Sinxronlash' },
    { id: 'success', label: '08 • Bron tasdiqlandi' },
    { id: 'subscriptions', label: '09 • Bronlarim & Obunalar' },
    { id: 'profile', label: '10 • Profil (Settings)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm px-3 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        {/* Brand & Active Screen Pill */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
            FS
          </div>
          <div>
            <span className="font-bold tracking-tight text-white hidden sm:inline">FinSync</span>
            <span className="text-slate-400 text-xs ml-1.5 hidden md:inline">Bank Synchronization</span>
          </div>
          
          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          {/* Screen Quick Jump Dropdown */}
          <div className="flex items-center gap-1 bg-slate-800/90 rounded-md px-2 py-1 border border-slate-700">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <select
              aria-label="Sahifani tanlash"
              value={currentScreen}
              onChange={(e) => onSelectScreen(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              {screensList.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controls: Device Frame Toggle, Currency, Language, Quick Sync */}
        <div className="flex items-center gap-2">
          {/* Quick Bank Sync Action */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-xs transition shadow-sm ${
              isSyncing
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
            }`}
            title="Avtomatik bank sinxronizatsiyasi"
            aria-label={t.syncBanks}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? t.syncing : t.syncBanks}</span>
          </button>

          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-800 rounded-md border border-slate-700 p-0.5">
            {(['UZS', 'USD', 'EUR'] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                  currency === c ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
                aria-label={`Valyutani ${c} ga o'zgartirish`}
              >
                {c === 'UZS' ? "so'm" : c === 'USD' ? '$' : '€'}
              </button>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-800 rounded-md border border-slate-700 p-0.5">
            <Globe className="w-3 h-3 text-slate-400 ml-1.5 hidden sm:inline" />
            <button
              onClick={() => onLanguageChange('uz')}
              className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                language === 'uz' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              UZ
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                language === 'en' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Frame Switcher */}
          <button
            onClick={onToggleMobileFrame}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition text-xs"
            title={isMobileFrame ? 'Keng ekran rejimiga o‘tish' : 'Mobil telefon qolipiga o‘tish'}
            aria-label="Telefon va kompyuter qolipini almashtirish"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Full</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Mobile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
