import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  Calendar,
  Tv,
  Wifi,
  Phone,
  Dumbbell,
  Music,
} from 'lucide-react';
import { CurrencyCode, RecurringSubscription, Transaction } from '../../types';
import { formatMoney } from '../../utils/finance';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface SubscriptionsViewProps {
  subscriptions: RecurringSubscription[];
  transactions: Transaction[];
  currency: CurrencyCode;
  language: Language;
  onSelectTransaction: (tx: Transaction) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  transactions,
  currency,
  language,
  onSelectTransaction,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'cancelled'>('active');
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);

  // Bookings / Stays matching Screen 09
  const bookings = [
    {
      id: 'book-1',
      hotelName: 'Registon Palace H...',
      location: 'Samarqand, O‘zbekiston',
      status: 'active',
      statusLabel: 'Tasdiqlangan',
      statusColor: 'text-emerald-700 bg-emerald-100',
      checkIn: '12-noy, Pay',
      checkOut: '15-noy, Yak',
      guests: '2 kishi',
      refCode: 'HB-2847-16',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'book-2',
      hotelName: 'Silk Road Boutique',
      location: 'Buxoro, O‘zbekiston',
      status: 'active',
      statusLabel: 'Kutilmoqda',
      statusColor: 'text-amber-700 bg-amber-100',
      checkIn: '24-dek, Pay',
      checkOut: '27-dek, Yak',
      guests: '2 kishi',
      refCode: 'HB-3190-02',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'book-3',
      hotelName: 'Chimyon Mountain...',
      location: 'Bo‘stonliq, O‘zbekiston',
      status: 'past',
      statusLabel: 'Yakunlangan',
      statusColor: 'text-slate-600 bg-slate-100',
      checkIn: '10-okt, Shan',
      checkOut: '12-okt, Dush',
      guests: '4 kishi',
      refCode: 'HB-4029-22',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return b.status === 'active';
    if (activeTab === 'past') return b.status === 'past';
    return b.status === 'cancelled';
  });

  const getSubIcon = (name: string) => {
    if (name.includes('Netflix')) return <Tv className="w-4 h-4 text-rose-500" />;
    if (name.includes('Internet')) return <Wifi className="w-4 h-4 text-blue-500" />;
    if (name.includes('Beeline') || name.includes('Aloqa')) return <Phone className="w-4 h-4 text-amber-500" />;
    if (name.includes('Gym') || name.includes('Sport')) return <Dumbbell className="w-4 h-4 text-emerald-500" />;
    return <Music className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Header with Search matching Screen 09 */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Bronlarim & Obunalar
        </h2>
        <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm">
          <Search className="w-4 h-4" />
        </div>
      </div>

      {/* 2. 3 Tabs matching Screen 09: Faol | O'tgan | Bekor qilingan */}
      <div className="flex items-center bg-slate-200/70 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'active'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Faol ({bookings.filter((b) => b.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'past'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          O‘tgan
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'cancelled'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Bekor qilingan
        </button>
      </div>

      {/* 3. Bookings List Cards matching Screen 09 */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs">
            Hozircha ushbu bo‘limda ma‘lumot mavjud emas.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:border-slate-200 transition space-y-3"
            >
              {/* Hotel / merchant header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={b.image}
                    alt={b.hotelName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">{b.hotelName}</h3>
                    <p className="text-[10px] text-slate-400">{b.location}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.statusColor}`}>
                  {b.statusLabel}
                </span>
              </div>

              {/* Booking Dates Table matching Screen 09 */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Kirish</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{b.checkIn}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Chiqish</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{b.checkOut}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Mehmonlar</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{b.guests}</span>
                </div>
              </div>

              {/* Bottom Row: Ref code + "Batafsil" button + QR code button matching Screen 09 */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 block">Bron raqami:</span>
                  <span className="font-mono font-bold text-xs text-slate-900">{b.refCode}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const matched = transactions.find((t) => t.referenceCode === b.refCode);
                      if (matched) onSelectTransaction(matched);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition cursor-pointer"
                  >
                    Batafsil
                  </button>

                  <button
                    onClick={() => setSelectedQrCode(b.refCode)}
                    className="p-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800 transition cursor-pointer"
                    title="QR kodni ko‘rsatish"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Bank Synchronized Recurring Subscriptions Section */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
            Avtomatik Bank Obunalari & Oylik To‘lovlar
          </h3>
          <span className="text-xs text-slate-400">{subscriptions.length} ta faol</span>
        </div>

        <div className="space-y-2">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {getSubIcon(sub.name)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{sub.name}</h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>To‘lov kuni: {sub.nextBillingDate}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-xs text-slate-900">
                  {formatMoney(sub.amount, currency)}
                </span>
                <span className="block text-[9px] text-emerald-600 font-semibold mt-0.5">
                  Avto-to‘lov yoqilgan
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 text-center max-w-xs w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-sm text-slate-900">Tekshiruv QR kodi</h3>
            <div className="w-48 h-48 mx-auto bg-slate-100 rounded-2xl p-4 flex items-center justify-center border-2 border-dashed border-slate-300">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>
            <p className="text-xs font-mono font-bold text-slate-700">{selectedQrCode}</p>
            <button
              onClick={() => setSelectedQrCode(null)}
              className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs cursor-pointer"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
