import React, { useState, useEffect } from 'react';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BUDGETS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
  MOCK_NEW_BANK_TRANSACTIONS,
} from './data/initialData';
import { BankAccount, CategoryBudget, CurrencyCode, RecurringSubscription, Transaction, TransactionCategory, UserProfile } from './types';
import { syncBankFeed } from './utils/finance';
import { Language, TRANSLATIONS } from './utils/translations';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { OnboardingView } from './components/views/OnboardingView';
import { AuthView } from './components/views/AuthView';
import { HomeView } from './components/views/HomeView';
import { TransactionsView } from './components/views/TransactionsView';
import { BudgetView } from './components/views/BudgetView';
import { SubscriptionsView } from './components/views/SubscriptionsView';
import { ProfileView } from './components/views/ProfileView';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { BankSyncModal } from './components/modals/BankSyncModal';
import { SuccessModal } from './components/modals/SuccessModal';
import { AddTransactionModal } from './components/modals/AddTransactionModal';

export default function App() {
  // Check URL query parameters (?autostart=1 support for automated verification)
  const queryParams = new URLSearchParams(window.location.search);
  const autostart = queryParams.get('autostart') === '1';

  // Application State
  const [currentScreen, setCurrentScreen] = useState<string>(autostart ? 'home' : 'onboarding');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(INITIAL_BUDGETS);
  const [subscriptions, setSubscriptions] = useState<RecurringSubscription[]>(INITIAL_SUBSCRIPTIONS);

  // Preference Settings
  const [language, setLanguage] = useState<Language>('uz');
  const [currency, setCurrency] = useState<CurrencyCode>('UZS');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Modals & Interactive Overlays
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showBankSyncModal, setShowBankSyncModal] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('bank-humo');
  const [successData, setSuccessData] = useState<{ referenceCode: string; amount: number } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Handle Bank Feed Synchronization
  const handleTriggerSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncToastMessage(language === 'uz' ? 'Open Banking: Kapitalbank & Humo serveriga ulanmoqda...' : 'Connecting to Open Banking APIs...');

    setTimeout(() => {
      setSyncToastMessage(language === 'uz' ? 'Tranzaksiyalar shifrlanib qabul qilinmoqda...' : 'Ingesting encrypted bank transactions...');
      
      setTimeout(() => {
        const result = syncBankFeed(accounts, transactions, MOCK_NEW_BANK_TRANSACTIONS);
        setAccounts(result.updatedAccounts);
        setTransactions(result.updatedTransactions);
        setIsSyncing(false);

        if (result.newTransactionsCount > 0) {
          setSyncToastMessage(
            language === 'uz'
              ? `Muvaffaqiyatli! ${result.newTransactionsCount} ta yangi bank tranzaksiyasi sinxronlandi.`
              : `Success! ${result.newTransactionsCount} new transactions synced.`
          );
        } else {
          setSyncToastMessage(
            language === 'uz'
              ? 'Barcha kartalar eng so‘nggi holatda sinxronlangan.'
              : 'All bank accounts are up to date.'
          );
        }

        setTimeout(() => setSyncToastMessage(null), 4000);
      }, 900);
    }, 800);
  };

  // Add custom transaction
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    // update account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === newTx.bankAccountId) {
          return {
            ...acc,
            balance: acc.balance + newTx.amount,
          };
        }
        return acc;
      })
    );
    setSyncToastMessage(language === 'uz' ? 'Yangi xarajat muvaffaqiyatli saqlandi!' : 'New expense recorded!');
    setTimeout(() => setSyncToastMessage(null), 3000);
  };

  // Update budget limit
  const handleUpdateBudget = (category: TransactionCategory, newLimit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, limit: newLimit } : b))
    );
  };

  // Add new bank account
  const handleAddNewAccount = (newAccData: Partial<BankAccount>) => {
    const fullAcc: BankAccount = {
      id: newAccData.id || `bank-${Date.now()}`,
      bankName: newAccData.bankName || 'Yangi Bank',
      accountType: 'card',
      accountNumber: newAccData.accountNumber || '•••• 0000',
      balance: newAccData.balance || 5000000,
      currency: newAccData.currency || 'UZS',
      status: 'connected',
      lastSynced: new Date().toISOString(),
      color: newAccData.color || '#059669',
      badge: newAccData.badge || 'Bank',
      autoSync: true,
    };
    setAccounts((prev) => [...prev, fullAcc]);
    setSelectedAccountId(fullAcc.id);
    handleTriggerSync();
  };

  // Reset demo data
  const handleResetData = () => {
    if (confirm(language === 'uz' ? 'Haqiqatan ham barcha ma‘lumotlarni boshlang‘ich holatga qaytarmoqchimisiz?' : 'Reset to default seed data?')) {
      setAccounts(INITIAL_ACCOUNTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setBudgets(INITIAL_BUDGETS);
      setSubscriptions(INITIAL_SUBSCRIPTIONS);
      setUser(INITIAL_USER);
      setSyncToastMessage(language === 'uz' ? 'Ma‘lumotlar qayta tiklandi' : 'Data reset to defaults');
      setTimeout(() => setSyncToastMessage(null), 3000);
    }
  };

  // Export full JSON/CSV
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ accounts, transactions, budgets, subscriptions, user }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `FinSync_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Render main screen body
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingView
            onStart={() => setCurrentScreen('home')}
            onLogin={() => setCurrentScreen('auth')}
            language={language}
          />
        );
      case 'auth':
        return (
          <AuthView
            onBack={() => setCurrentScreen('onboarding')}
            onSuccess={() => setCurrentScreen('home')}
            language={language}
          />
        );
      case 'transactions':
        return (
          <TransactionsView
            transactions={transactions}
            accounts={accounts}
            currency={currency}
            language={language}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        );
      case 'budgets':
        return (
          <BudgetView
            budgets={budgets}
            transactions={transactions}
            currency={currency}
            language={language}
            onUpdateBudget={handleUpdateBudget}
            onProceedToBookingOrSync={() => setShowBankSyncModal(true)}
          />
        );
      case 'banks':
        return (
          <div className="space-y-4 pb-12">
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Bank Sinxronizatsiyasi
              </h2>
              <button
                onClick={() => setShowBankSyncModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                + Karta ulash
              </button>
            </div>
            {/* Embedded direct bank sync view */}
            <div className="space-y-3">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-xs">
                      {acc.badge}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{acc.bankName}</h4>
                      <p className="text-[10px] text-slate-500">{acc.accountNumber} • {acc.currency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-slate-900 block">
                      {acc.balance.toLocaleString()} {acc.currency === 'UZS' ? "so'm" : acc.currency}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-semibold">Ulangan • Auto-sync</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowBankSyncModal(true)}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition"
            >
              Bronni tasdiqlash & Bankni sinxronlash oynasini ochish
            </button>
          </div>
        );
      case 'subscriptions':
        return (
          <SubscriptionsView
            subscriptions={subscriptions}
            transactions={transactions}
            currency={currency}
            language={language}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={user}
            currency={currency}
            language={language}
            onLanguageChange={setLanguage}
            onCurrencyChange={setCurrency}
            onNavigateToBanks={() => setShowBankSyncModal(true)}
            onExportData={handleExportData}
            onResetData={handleResetData}
          />
        );
      case 'home':
      default:
        return (
          <HomeView
            user={user}
            accounts={accounts}
            transactions={transactions}
            currency={currency}
            language={language}
            onNavigateToTransactions={() => setCurrentScreen('transactions')}
            onNavigateToBudgets={() => setCurrentScreen('budgets')}
            onNavigateToBanks={() => setShowBankSyncModal(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            onTriggerSync={handleTriggerSync}
            isSyncing={isSyncing}
          />
        );
    }
  };

  const isNavVisible = !['onboarding', 'auth'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col antialiased">
      {/* 1. Global AI Studio build header & controls */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          if (screen === 'detail') {
            setSelectedTransaction(transactions[0]);
          } else if (screen === 'banks') {
            setShowBankSyncModal(true);
          } else if (screen === 'success') {
            setSuccessData({ referenceCode: 'HB-2847-16', amount: 4626900 });
          } else {
            setCurrentScreen(screen);
          }
        }}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        isSyncing={isSyncing}
        onTriggerSync={handleTriggerSync}
      />

      {/* 2. Live Notification Toast */}
      {syncToastMessage && (
        <div className="fixed top-14 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-bounce">
          <div className="bg-slate-950 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-emerald-500/40 flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{syncToastMessage}</span>
          </div>
        </div>
      )}

      {/* 3. Main Stage: Either Mobile Frame (matching the screenshot) or Full-width Responsive */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-x-hidden">
        {isMobileFrame ? (
          /* Phone Frame matching iPhone 16 Pro styling from screenshot */
          <div className="w-full max-w-[420px] bg-slate-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800/80 my-auto">
            {/* Phone Screen Container */}
            <div className="w-full bg-[#f8fafc] rounded-[36px] overflow-hidden flex flex-col min-h-[780px] max-h-[880px] relative shadow-inner">
              {/* iPhone Status Bar (9:41, Dynamic Island, Wifi, Battery) */}
              <div className="w-full bg-transparent pt-3 pb-1 px-7 flex items-center justify-between text-xs font-bold text-slate-800 select-none z-20">
                <span>9:41</span>
                {/* Dynamic island */}
                <div className="w-24 h-5 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1.5 text-slate-800">
                  <span className="text-[10px]">5G</span>
                  <div className="w-4 h-2.5 rounded-sm border border-slate-800 p-0.5 flex items-center">
                    <div className="w-full h-full bg-slate-800 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto px-4 pt-1 no-scrollbar">
                {renderScreenContent()}
              </div>

              {/* Bottom Navigation Bar */}
              {isNavVisible && (
                <BottomNav
                  currentTab={currentScreen}
                  onSelectTab={(tab) => setCurrentScreen(tab)}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  language={language}
                />
              )}

              {/* Home indicator bar */}
              <div className="w-full py-1.5 bg-white flex justify-center z-30">
                <div className="w-32 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Responsive Mode */
          <div className="w-full max-w-5xl bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 min-h-[80vh] flex flex-col">
            <div className="flex-1">
              {renderScreenContent()}
            </div>
            {isNavVisible && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <BottomNav
                  currentTab={currentScreen}
                  onSelectTab={(tab) => setCurrentScreen(tab)}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  language={language}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* 4. Interactive Modals */}
      {/* Screen 05: Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        currency={currency}
        language={language}
        onUpdateCategory={(txId, newCat) => {
          setTransactions((prev) =>
            prev.map((t) => (t.id === txId ? { ...t, category: newCat } : t))
          );
        }}
        onDeleteTransaction={(txId) => {
          setTransactions((prev) => prev.filter((t) => t.id !== txId));
        }}
        onConfirmBookingOrSync={(tx) => {
          setSelectedTransaction(null);
          setShowBankSyncModal(true);
        }}
      />

      {/* Screen 07: Bank Sync & Confirmation Modal */}
      {showBankSyncModal && (
        <BankSyncModal
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelectAccount={setSelectedAccountId}
          currency={currency}
          language={language}
          onClose={() => setShowBankSyncModal(false)}
          onTriggerSync={handleTriggerSync}
          isSyncing={isSyncing}
          onAddNewAccount={handleAddNewAccount}
          onProceedToSuccess={(ref, amount) => {
            setShowBankSyncModal(false);
            setSuccessData({ referenceCode: ref, amount });
          }}
        />
      )}

      {/* Screen 08: Success Modal */}
      {successData && (
        <SuccessModal
          referenceCode={successData.referenceCode}
          totalAmount={successData.amount}
          currency={currency}
          language={language}
          onClose={() => setSuccessData(null)}
          onViewBookings={() => {
            setSuccessData(null);
            setCurrentScreen('subscriptions');
          }}
          onBackToHome={() => {
            setSuccessData(null);
            setCurrentScreen('home');
          }}
        />
      )}

      {/* Add Custom Expense/Income Modal */}
      {isAddModalOpen && (
        <AddTransactionModal
          accounts={accounts}
          currency={currency}
          language={language}
          onClose={() => setIsAddModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}
    </div>
  );
}
