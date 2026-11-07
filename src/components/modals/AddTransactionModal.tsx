import React, { useState } from 'react';
import { X, Plus, Upload, CheckCircle2 } from 'lucide-react';
import { BankAccount, CurrencyCode, Transaction, TransactionCategory } from '../../types';
import { formatMoney } from '../../utils/finance';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface AddTransactionModalProps {
  accounts: BankAccount[];
  currency: CurrencyCode;
  language: Language;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  accounts,
  currency,
  language,
  onClose,
  onAddTransaction,
}) => {
  const t = TRANSLATIONS[language];
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [title, setTitle] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('150000');
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || 'bank-humo');
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/\s/g, ''));
    if (!title.trim()) {
      setError(language === 'uz' ? 'Xarajat nomini kiriting' : 'Please enter title');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(language === 'uz' ? 'Haqiqiy summani kiriting' : 'Please enter valid positive amount');
      return;
    }

    const selectedAcc = accounts.find((a) => a.id === selectedAccountId);
    const finalAmount = type === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount);

    const newTx: Transaction = {
      id: `tx-user-${Date.now()}`,
      title: title.trim(),
      merchant: merchant.trim() || title.trim(),
      category,
      amount: finalAmount,
      date: new Date().toISOString(),
      bankAccountId: selectedAccountId,
      status: 'cleared',
      referenceCode: `HB-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`,
      paymentMethod: selectedAcc ? `${selectedAcc.bankName} ${selectedAcc.accountNumber}` : 'Humo •••• 4417',
      notes: notes.trim() || undefined,
      receiptUrl: receiptUrl || undefined,
      syncedFromBank: true,
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 overflow-hidden my-auto border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-extrabold text-base text-slate-900">
            {type === 'expense' ? t.addExpense : 'Daromad kiritish'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Expense vs Income Segment */}
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 font-bold rounded-xl transition ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Xarajat (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 font-bold rounded-xl transition ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daromad (+)
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nom / Savdo nuqtasi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Registon Palace Hotel, Korzinka..."
              className="w-full p-3 rounded-2xl border border-slate-200 focus:border-slate-950 focus:outline-none bg-slate-50 font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Summa ({currency})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="150000"
              className="w-full p-3 rounded-2xl border border-slate-200 focus:border-slate-950 focus:outline-none bg-slate-50 font-extrabold text-base text-slate-900 tracking-wide"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Toifa</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 font-medium focus:outline-none"
              >
                <option value="food">Oziq-ovqat</option>
                <option value="housing">Mehmonxona</option>
                <option value="transport">Transport</option>
                <option value="shopping">Xaridlar</option>
                <option value="utilities">Kommunal</option>
                <option value="entertainment">Obunalar</option>
                <option value="salary">Maosh / Daromad</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank kartasi</label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 font-medium focus:outline-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} ({acc.accountNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Izoh (ixtiyoriy)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Safardagi xarajat, kechki ovqat..."
              className="w-full p-2.5 rounded-2xl border border-slate-200 bg-slate-50 font-medium focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Saqlash va hisobga qo‘shish</span>
          </button>
        </form>
      </div>
    </div>
  );
};
