import React from 'react';
import { CheckSquare, Rocket, Grid, User, Plus } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange, onQuickAddClick }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#141518]/95 backdrop-blur-lg border-t border-[#23262d] py-2 px-3 safe-area-bottom select-none">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Tab 1: Growth (رشد) */}
        <button
          onClick={() => onTabChange('growth')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'growth' ? 'text-[#3ECF8E]' : 'text-[#8b929e] hover:text-[#d1d5db]'
          }`}
        >
          <Rocket className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium">رشد</span>
        </button>

        {/* Tab 2: Tasks (کارها) */}
        <button
          onClick={() => onTabChange('tasks')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'tasks' ? 'text-[#3ECF8E]' : 'text-[#8b929e] hover:text-[#d1d5db]'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium">کارها</span>
        </button>

        {/* Center Elevated Floating Action Button (+) */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onQuickAddClick}
            className="w-13 h-13 rounded-full bg-[#3ECF8E] hover:bg-[#34b77d] active:scale-95 text-black flex items-center justify-center shadow-[0_4px_20px_rgba(62,207,142,0.45)] transition-all cursor-pointer border-4 border-[#141518]"
            aria-label="افزودن کار یا یادداشت سریع"
          >
            <Plus className="w-7 h-7 stroke-[2.8]" />
          </button>
        </div>

        {/* Tab 3: Tools (ابزارها) */}
        <button
          onClick={() => onTabChange('tools')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'tools' ? 'text-[#3ECF8E]' : 'text-[#8b929e] hover:text-[#d1d5db]'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium">ابزارها</span>
        </button>

        {/* Tab 4: Profile (پروفایل) */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'profile' ? 'text-[#3ECF8E]' : 'text-[#8b929e] hover:text-[#d1d5db]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium">پروفایل</span>
        </button>
      </div>
    </nav>
  );
}
