import React from 'react';
import { Home, Search, PieChart, CalendarCheck2, User, Plus } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddModal: () => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const tabs = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'transactions', label: t.navSearch, icon: Search },
    { id: 'budgets', label: t.navBudgets, icon: PieChart },
    { id: 'subscriptions', label: t.navSubscriptions, icon: CalendarCheck2 },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav aria-label="Asosiy navigatsiya" className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-lg px-2 py-1.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-1 transition-all ${
                isActive ? 'text-slate-900 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label={tab.label}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-slate-950' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && <span className="w-1 h-1 bg-slate-900 rounded-full mt-0.5" />}
            </button>
          );
        })}

        {/* Center Quick Add Button */}
        <div className="flex-none px-1">
          <button
            onClick={onOpenAddModal}
            className="w-10 h-10 -mt-3 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 active:scale-95 transition-transform"
            title={t.addExpense}
            aria-label={t.addExpense}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {tabs.slice(2).map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-1 transition-all ${
                isActive ? 'text-slate-900 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label={tab.label}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-slate-950' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && <span className="w-1 h-1 bg-slate-900 rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
