import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Copy,
  Trash2,
  Wifi,
  Utensils,
  Car,
  Dumbbell,
  Sparkles,
} from 'lucide-react';
import { CurrencyCode, Transaction, TransactionCategory } from '../../types';
import { formatMoney } from '../../utils/finance';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  currency: CurrencyCode;
  language: Language;
  onUpdateCategory: (txId: string, category: TransactionCategory) => void;
  onDeleteTransaction: (txId: string) => void;
  onConfirmBookingOrSync: (tx: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  currency,
  language,
  onUpdateCategory,
  onDeleteTransaction,
  onConfirmBookingOrSync,
}) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(true);

  if (!transaction) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const galleryImages = [
    transaction.receiptUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Gallery Header with Back, Share & Heart matching Screen 05 */}
        <div className="relative h-64 sm:h-72 w-full flex-shrink-0 bg-slate-900">
          <img
            src={galleryImages[0]}
            alt={transaction.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

          {/* Top Bar Actions */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center backdrop-blur-md shadow-md transition cursor-pointer"
              aria-label="Yopish"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyRef}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center backdrop-blur-md shadow-md transition cursor-pointer"
                title="Ma'lumot raqamini nusxalash"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center backdrop-blur-md shadow-md transition cursor-pointer"
                aria-label="Sevimlilar"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-800'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Photo Carousel Thumbnails matching Screen 05 */}
          <div className="absolute bottom-3 inset-x-4 flex items-center gap-2 z-10 overflow-x-auto no-scrollbar">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-lg border-2 border-white/80 overflow-hidden flex-shrink-0 shadow"
              >
                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="h-12 px-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/40 text-white font-bold text-xs flex items-center justify-center whitespace-nowrap">
              +21 foto
            </div>
          </div>
        </div>

        {/* Scrollable Body Content matching Screen 05 */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-slate-800">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-1">Mehmonxona & Xarajat</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Ajoyib 9.4
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-950 mt-1">{transaction.title}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Registon ko‘chasi 12, Samarqand • {transaction.merchant}</span>
            </p>
          </div>

          {/* 3 Metric Cards matching Screen 05 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.9</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">1 248 sharh</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <span className="font-bold text-sm text-slate-900 block">0.4 km</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Registongacha</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-sm">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>14:00</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Kirish vaqti</span>
            </div>
          </div>

          {/* Amenities / Qulayliklar matching Screen 05 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Qulayliklar & Xizmatlar
              </h3>
              <span className="text-xs font-semibold text-rose-600 cursor-pointer">Barchasi &gt;</span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-[10px] text-slate-600 font-medium">
              <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                <Wifi className="w-4 h-4 mb-1 text-slate-700" />
                <span>Wi-Fi</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                <Sparkles className="w-4 h-4 mb-1 text-slate-700" />
                <span>Hovuz</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                <Utensils className="w-4 h-4 mb-1 text-slate-700" />
                <span>Restoran</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                <Dumbbell className="w-4 h-4 mb-1 text-slate-700" />
                <span>Fitnes</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center">
                <Car className="w-4 h-4 mb-1 text-slate-700" />
                <span>Turargoh</span>
              </div>
            </div>
          </div>

          {/* Bank Sync & Receipt Verification Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Avtomatik bank orqali tasdiqlangan</span>
              </div>
              <span className="text-[10px] text-slate-400">{transaction.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">{t.refNumber}</span>
                <span className="font-mono font-bold text-white text-xs">{transaction.referenceCode}</span>
              </div>
              <button
                onClick={handleCopyRef}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs transition font-medium"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Nusxalandi!' : 'Nusxalash'}</span>
              </button>
            </div>

            {transaction.notes && (
              <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800">
                "{transaction.notes}"
              </p>
            )}
          </div>

          {/* Delete Action */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                if (confirm('Tranzaksiyani o‘chirmoqchimisiz?')) {
                  onDeleteTransaction(transaction.id);
                  onClose();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.deleteTransaction}</span>
            </button>
          </div>
        </div>

        {/* Bottom Sticky Action Footer matching Screen 05 */}
        <div className="border-t border-slate-100 bg-white p-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block">1 kecha / jami summa</span>
            <span className="text-lg font-black text-slate-950">
              {formatMoney(Math.abs(transaction.amount), currency)}
            </span>
          </div>

          <button
            onClick={() => {
              onConfirmBookingOrSync(transaction);
            }}
            className="flex-1 max-w-[200px] py-3 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-[0.98] cursor-pointer text-center"
          >
            Xona tanlash
          </button>
        </div>
      </div>
    </div>
  );
};
