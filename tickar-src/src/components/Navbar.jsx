import React from 'react';
import { getCurrentJalaliDate, toPersianDigits } from '../utils/jalali';
import { MessageSquare, MoreVertical, ArrowRight, Sparkles, Crown } from 'lucide-react';

export function Navbar({
  activeTab,
  currentSubView,
  onBack,
  onOpenAiAssistant,
  onOpenVipModal,
  onOpenInbox
}) {
  const jalali = getCurrentJalaliDate();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#121316]/95 backdrop-blur-md border-b border-[#22252a] px-4 py-3 flex items-center justify-between select-none">
      {/* Left: Inbox / AI assistant trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAiAssistant}
          className="w-10 h-10 rounded-2xl bg-[#1c1e22] border border-[#2a2d33] flex items-center justify-center text-[#9ca3af] hover:text-[#3ECF8E] hover:border-[#3ECF8E]/40 active:scale-95 transition-all shadow-sm"
          title="دستیار هوش مصنوعی ARIAMIR"
          aria-label="AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-[#3ECF8E]" />
        </button>
      </div>

      {/* Center: Shamsi Date & Gold-Rimmed Green Checkmark */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenVipModal}>
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-medium text-[#9ca3af] leading-tight">
            {jalali.dayName}
          </span>
          <span className="text-base font-bold text-white tracking-wide leading-tight">
            {toPersianDigits(jalali.day)} {jalali.monthName}
          </span>
        </div>

        {/* Gold-Rimmed Green Tickmark Icon */}
        <div className="relative w-8 h-8 rounded-xl bg-[#18231c] border-2 border-[#f59e0b] flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.25)]">
          <svg className="w-4 h-4 text-[#3ECF8E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-ping opacity-75"></div>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
        </div>
      </div>

      {/* Right: Back Button or VIP / Menu Button */}
      <div className="flex items-center gap-2">
        {currentSubView ? (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#1c1e22] border border-[#2a2d33] flex items-center justify-center text-white hover:text-[#3ECF8E] active:scale-95 transition-all"
            aria-label="Back"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onOpenVipModal}
            className="w-10 h-10 rounded-2xl bg-[#1c1e22] border border-[#2a2d33] flex items-center justify-center text-[#f59e0b] hover:border-[#f59e0b]/50 active:scale-95 transition-all shadow-sm"
            title="اشتراک طلایی تیک‌آر (VIP فعال)"
            aria-label="VIP Status"
          >
            <Crown className="w-5 h-5 fill-[#f59e0b]/20 text-[#f59e0b]" />
          </button>
        )}
      </div>
    </header>
  );
}
