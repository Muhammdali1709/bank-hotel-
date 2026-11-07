import React, { useState } from 'react';
import {
  Settings,
  Crown,
  ChevronRight,
  User,
  CreditCard,
  Bell,
  Globe,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Download,
  RotateCcw,
} from 'lucide-react';
import { CurrencyCode, UserProfile } from '../../types';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface ProfileViewProps {
  user: UserProfile;
  currency: CurrencyCode;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onCurrencyChange: (curr: CurrencyCode) => void;
  onNavigateToBanks: () => void;
  onExportData: () => void;
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currency,
  language,
  onLanguageChange,
  onCurrencyChange,
  onNavigateToBanks,
  onExportData,
  onResetData,
}) => {
  const t = TRANSLATIONS[language];
  const [notifications, setNotifications] = useState(user.notificationsEnabled);
  const [biometrics, setBiometrics] = useState(user.biometricsEnabled);

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Header with Gear icon matching Screen 10 */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {t.profileTitle}
        </h2>
        <button
          onClick={onNavigateToBanks}
          className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition"
          aria-label="Sozlamalar"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* 2. User Profile & Gold Membership Card matching Screen 10 */}
      <div className="rounded-3xl bg-slate-950 text-white p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-amber-200 border-2 border-amber-400 overflow-hidden flex-shrink-0 shadow">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">{user.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>
          </div>
        </div>

        {/* Gold tier gradient banner matching Screen 10 */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-3.5 text-slate-950 shadow-md space-y-2">
          <div className="flex items-center justify-between font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{user.tier}</span>
            </div>
            <span>2 450 ball</span>
          </div>

          {/* Progress bar to Platinum */}
          <div className="w-full bg-slate-950/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-slate-950 h-full rounded-full" style={{ width: '82%' }} />
          </div>

          <div className="text-[10px] text-slate-950/80 font-medium text-right">
            Platinum darajasigacha 550 ball qoldi
          </div>
        </div>
      </div>

      {/* 3. 3 Counter Statistics Cards matching Screen 10 */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm">
          <span className="font-black text-lg text-slate-900 block">12</span>
          <span className="text-[11px] text-slate-400">Bronlar</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm">
          <span className="font-black text-lg text-slate-900 block">8</span>
          <span className="text-[11px] text-slate-400">Shaharlar</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm">
          <span className="font-black text-lg text-slate-900 block">24</span>
          <span className="text-[11px] text-slate-400">Tranzaksiyalar</span>
        </div>
      </div>

      {/* 4. HISOB (Account) section matching Screen 10 */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Hisob
        </h3>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100 text-xs">
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <User className="w-4 h-4 text-slate-400" />
              <span>{t.accountSettings}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={onNavigateToBanks}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>{t.paymentCards}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-[11px] font-medium">4 ta karta</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <Bell className="w-4 h-4 text-slate-400" />
              <span>{t.notifications}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-950"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 5. SOZLAMALAR (Settings) section matching Screen 10 */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Sozlamalar
        </h3>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100 text-xs">
          {/* Language selector */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>{t.appLanguage}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onLanguageChange('uz')}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  language === 'uz' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                O‘zbekcha
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  language === 'en' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Currency selector */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <span className="w-4 h-4 text-center font-bold text-slate-500">$</span>
              <span>{t.currency}</span>
            </div>
            <div className="flex items-center gap-1">
              {(['UZS', 'USD', 'EUR'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    currency === c ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Biometrics */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.security}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={biometrics}
                onChange={() => setBiometrics(!biometrics)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Export Data */}
          <div
            onClick={onExportData}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <Download className="w-4 h-4 text-blue-500" />
              <span>{t.exportData}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Reset Demo Data */}
          <div
            onClick={onResetData}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <span>Boshlang‘ich ma‘lumotlarni qayta tiklash</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Help Center */}
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>{t.helpCenter}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
