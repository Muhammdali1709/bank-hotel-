import React, { useEffect } from 'react';
import { Check, Copy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurrencyCode } from '../../types';
import { formatMoney } from '../../utils/finance';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface SuccessModalProps {
  referenceCode: string;
  totalAmount: number;
  currency: CurrencyCode;
  language: Language;
  onClose: () => void;
  onViewBookings: () => void;
  onBackToHome: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  referenceCode,
  totalAmount,
  currency,
  language,
  onClose,
  onViewBookings,
  onBackToHome,
}) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#0F172A'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 overflow-hidden my-auto border border-slate-100 flex flex-col justify-between">
        {/* Top Close Button matching Screen 08 */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Green Circular Checkmark matching Screen 08 */}
        <div className="my-6 text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 ring-8 ring-emerald-100">
              <Check className="w-12 h-12 stroke-[3]" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'uz' ? 'Bron tasdiqlandi!' : 'Booking & Sync Confirmed!'}
            </h2>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
              {language === 'uz'
                ? 'Tabriklaymiz! To‘lov muvaffaqiyatli amalga oshirildi va barcha ma’lumotlar bank orqali tasdiqlandi.'
                : 'Congratulations! Payment was processed and transaction has been synchronized with your bank account.'}
            </p>
          </div>
        </div>

        {/* Booking & Bank Sync Details Table matching Screen 08 */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80"
              alt="Registon Palace Hotel"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900">Registon Palace Hotel</h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  To‘langan
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Samarqand, O‘zbekiston</p>
            </div>
          </div>

          <div className="space-y-2 p-3 bg-slate-50 rounded-2xl text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Bron raqami</span>
              <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                <span>{referenceCode}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:text-emerald-600 cursor-pointer"
                  title="Nusxalash"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-1.5">
              <span className="text-slate-400">Sana</span>
              <span className="font-semibold text-slate-900">12 - 15 noyabr</span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-1.5">
              <span className="text-slate-400">Xona</span>
              <span className="font-semibold text-slate-900">Deluxe King - 2 mehmon</span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900">
              <span className="text-slate-500">Jami to‘lov:</span>
              <span className="text-emerald-600 font-extrabold">
                {formatMoney(totalAmount, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons matching Screen 08 */}
        <div className="space-y-2.5">
          <button
            onClick={onViewBookings}
            className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-[0.99] cursor-pointer"
          >
            {language === 'uz' ? 'Bronni ko‘rish' : 'View Bookings & History'}
          </button>

          <button
            onClick={onBackToHome}
            className="w-full py-3 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
};
