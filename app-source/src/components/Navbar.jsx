import React from 'react';
import { AriaLogo } from './AriaLogo';
import { 
  Sparkles, 
  BarChart2, 
  Settings, 
  Sun, 
  Moon, 
  Crown, 
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toPersianDigits } from '../utils/jalali';

export function Navbar({ 
  userStats, 
  onOpenAi, 
  onOpenAnalytics, 
  onOpenSettings,
  theme,
  onToggleTheme,
  soundEffects,
  onToggleSound
}) {
  const currentXp = userStats.xp || 0;
  const level = userStats.level || 1;
  const xpForNextLevel = level * 500;
  const levelProgress = Math.min(100, Math.round(((currentXp % 500) / 500) * 100));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2E2E2E] bg-black/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <AriaLogo size={38} variant="green" />
        </div>

        {/* Center: Gamification Level & XP Progress */}
        <div 
          onClick={onOpenAnalytics}
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#171717] border border-[#2E2E2E] hover:border-[#3ECF8E]/50 cursor-pointer transition-all duration-200"
          title="مشاهده آمار و مدال‌های ARIAMIR"
        >
          <div className="w-7 h-7 rounded-lg bg-[#005936] flex items-center justify-center text-[#3ECF8E]">
            <Zap className="w-4 h-4 fill-[#3ECF8E]" />
          </div>
          <div className="flex flex-col text-right min-w-[100px]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#FAFAFA]">سطح {toPersianDigits(level)}</span>
              <span className="text-[#3ECF8E] font-mono text-[11px]">{toPersianDigits(currentXp)} XP</span>
            </div>
            <div className="w-full h-1.5 bg-[#242424] rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#006239] to-[#3ECF8E] rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* AI Task Planner Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#005936] to-[#15593B] hover:from-[#006239] hover:to-[#249361] text-[#3ECF8E] text-xs font-bold border border-[#3ECF8E]/40 shadow-sm hover:shadow-[#3ECF8E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-[#3ECF8E]" />
            <span className="hidden md:inline">دستیار هوش مصنوعی</span>
            <span className="md:hidden">AI</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="w-9 h-9 rounded-xl bg-[#171717] hover:bg-[#242424] border border-[#2E2E2E] text-[#B4B4B4] hover:text-[#FAFAFA] flex items-center justify-center transition-all"
            title={soundEffects ? 'قطع افکت‌های صوتی' : 'فعال‌سازی افکت‌های صوتی'}
          >
            {soundEffects ? <Volume2 className="w-4 h-4 text-[#3ECF8E]" /> : <VolumeX className="w-4 h-4 text-[#898989]" />}
          </button>

          {/* Analytics Modal Button */}
          <button
            onClick={onOpenAnalytics}
            className="w-9 h-9 rounded-xl bg-[#171717] hover:bg-[#242424] border border-[#2E2E2E] text-[#B4B4B4] hover:text-[#FAFAFA] flex items-center justify-center transition-all"
            title="آمار عملکرد و مدال‌ها"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-xl bg-[#171717] hover:bg-[#242424] border border-[#2E2E2E] text-[#B4B4B4] hover:text-[#FAFAFA] flex items-center justify-center transition-all"
            title="تغییر تم"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Settings / VIP Suite */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl bg-[#171717] hover:bg-[#242424] border border-[#2E2E2E] text-[#B4B4B4] hover:text-[#FAFAFA] flex items-center justify-center transition-all relative"
            title="تنظیمات VIP و نسخه پشتیبان"
          >
            <Settings className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#3ECF8E] rounded-full border-2 border-black" />
          </button>

        </div>

      </div>
    </header>
  );
}
