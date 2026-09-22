import React from 'react';
import { 
  Home, 
  Calendar, 
  Timer, 
  TrendingUp, 
  Compass,
  Plus
} from 'lucide-react';
import { toPersianDigits } from '../utils/jalali';

export function BottomNav({ currentTab, onTabChange, onQuickAdd, pendingTasksCount }) {
  const tabs = [
    { id: 'today', label: 'امروز', icon: Home, badge: pendingTasksCount > 0 ? pendingTasksCount : null },
    { id: 'planner', label: 'برنامه‌ریزی', icon: Calendar },
    { id: 'focus', label: 'تمرکز', icon: Timer, special: true },
    { id: 'habits', label: 'عادت و مود', icon: TrendingUp },
    { id: 'explore', label: 'توسعه فردی', icon: Compass }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <nav className="relative flex items-center justify-around px-2 py-2 rounded-2xl bg-[#121212]/90 backdrop-blur-2xl border border-[#2E2E2E] shadow-2xl shadow-black/80">
          
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            if (tab.special) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative -top-5 flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-[#3ECF8E] text-black shadow-lg shadow-[#3ECF8E]/40 scale-110'
                      : 'bg-[#005936] text-[#3ECF8E] border-2 border-[#3ECF8E]/40 hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                  <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-black' : 'text-[#3ECF8E]'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'text-[#3ECF8E]' 
                    : 'text-[#898989] hover:text-[#FAFAFA]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#E54D2D] text-white text-[10px] font-bold flex items-center justify-center">
                      {toPersianDigits(tab.badge)}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] font-medium mt-1 transition-colors ${isActive ? 'font-bold text-[#3ECF8E]' : 'text-[#898989]'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E] mt-0.5 animate-pulse" />
                )}
              </button>
            );
          })}

        </nav>
      </div>
    </div>
  );
}
