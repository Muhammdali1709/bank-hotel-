import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface AuthViewProps {
  onBack: () => void;
  onSuccess: () => void;
  language: Language;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onBack,
  onSuccess,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [phoneNumber, setPhoneNumber] = useState('90 123 45 67');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError(language === 'uz' ? 'Iltimos, telefon raqamingizni kiriting' : 'Please enter your phone number');
      return;
    }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setError(language === 'uz' ? '6 xonali kodni to‘liq kiriting' : 'Please enter the complete 6-digit code');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl min-h-[640px] p-6 flex flex-col justify-between text-slate-900 border border-slate-100">
      {/* Top Bar with Back Button */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={step === 'otp' ? () => setStep('phone') : onBack}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
            aria-label="Orqaga"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-bit Shifrlash</span>
          </div>
        </div>

        {step === 'phone' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {t.welcomeBack}
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {t.loginSubtitle}
              </p>
            </div>

            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.phoneLabel}
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-950/5 transition px-3 py-1 bg-slate-50/50">
                  <div className="flex items-center gap-1 text-slate-700 font-semibold text-sm border-r border-slate-200 pr-3 py-2">
                    <span className="text-base">🇺🇿</span>
                    <span>+998</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="90 123 45 67"
                    className="w-full pl-3 py-2 bg-transparent text-slate-900 font-semibold text-base focus:outline-none tracking-wider"
                    required
                  />
                </div>
                {error && <p className="text-xs text-rose-500 mt-1.5">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t.getCode
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium uppercase">
                {t.or}
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Social Logins matching Screen 02 */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onSuccess}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{t.continueWithGoogle}</span>
              </button>

              <button
                type="button"
                onClick={onSuccess}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.05-1.82.93-2.87-1 .04-2.14.67-2.77 1.41-.56.64-1.05 1.7-0.92 2.73 1.11.08 2.19-.57 2.76-1.27z" />
                </svg>
                <span>{t.continueWithApple}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {t.verifyCode}
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                +998 {phoneNumber} {t.enterSmsCode}
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* 6-box OTP digits */}
              <div className="flex justify-between gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const next = [...otpCode];
                      next[idx] = e.target.value;
                      setOtpCode(next);
                    }}
                    className="w-12 h-14 rounded-2xl border-2 border-slate-200 text-center text-xl font-extrabold text-slate-900 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 focus:outline-none bg-slate-50 transition"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>SMS kod kelmadimi?</span>
                <button
                  type="button"
                  onClick={() => setOtpCode(['1', '2', '3', '4', '5', '6'])}
                  className="font-bold text-emerald-600 hover:text-emerald-700"
                >
                  {t.resend} (123456)
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.confirm}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer notice matching Screen 02 */}
      <p className="text-[10px] text-center text-slate-400 mt-6 leading-relaxed">
        {t.termsNotice}
      </p>
    </div>
  );
};
