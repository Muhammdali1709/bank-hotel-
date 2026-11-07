import React from 'react';
import { ArrowRight, ShieldCheck, Zap, CreditCard } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface OnboardingViewProps {
  onStart: () => void;
  onLogin: () => void;
  language: Language;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onStart,
  onLogin,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="relative min-h-[640px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white rounded-3xl shadow-2xl p-6 select-none">
      {/* Background Image with Dark Gradient Overlay matching Screen 01 */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
          alt="Boutique Resort & Financial Freedom"
          className="w-full h-full object-cover object-center filter brightness-90 transform scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
      </div>

      {/* Top Bar with Brand Badge */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center font-black text-xs text-slate-950">
            FS
          </div>
          <span className="font-bold text-sm tracking-tight text-white">FinSync</span>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Humo & Uzcard Ready</span>
        </div>
      </div>

      {/* Hero Content matching Screen 01 */}
      <div className="relative z-10 space-y-4 my-auto pt-24">
        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-slate-200">
            <Zap className="w-3 h-3 text-amber-400" /> Tezkor sinxronlash
          </span>
          <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-slate-200">
            <CreditCard className="w-3 h-3 text-blue-400" /> Barcha kartalar
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {language === 'uz' ? (
            <>
              O‘zbekiston bo‘ylab <br />
              <span className="text-emerald-400">eng yaxshi</span> xarajatlar nazorati
            </>
          ) : (
            <>
              Smart Expense Tracking & <br />
              <span className="text-emerald-400">Real-Time</span> Bank Sync
            </>
          )}
        </h1>

        <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
          {language === 'uz'
            ? "Samarqanddan Xivagacha barcha xarajatlaringiz, Humo va Uzcard avtomatik sinxronizatsiyasi hamda 24/7 shaxsiy budjet nazorati."
            : "Connect your Humo, Uzcard, and international cards. Enjoy automatic transaction categorization, budget limits, and cash flow insights."}
        </p>
      </div>

      {/* Bottom Action Section matching Screen 01 */}
      <div className="relative z-10 space-y-3 pt-6">
        <button
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-base shadow-xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>{t.getStarted}</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>

        <button
          onClick={onLogin}
          className="w-full text-center text-xs text-slate-300 hover:text-white transition py-2 cursor-pointer font-medium"
        >
          {t.alreadyHaveAccount}
        </button>
      </div>
    </div>
  );
};
