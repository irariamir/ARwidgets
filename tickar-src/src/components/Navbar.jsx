import React from 'react';
import { getCurrentJalaliDate, toPersianDigits } from '../utils/jalali';
import { Mail, ArrowRight, MoreVertical, Crown } from 'lucide-react';
import { AriaLogo } from './AriaLogo';

export function Navbar({
  currentSubView,
  onBack,
  onOpenInbox,
  onOpenVipModal
}) {
  const jalali = getCurrentJalaliDate();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#121316]/95 backdrop-blur-md border-b border-[#22252a] px-4 py-3 flex items-center justify-between select-none">
      {/* Left: Inbox / Messages button (Matching Lemoni [✉]) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenInbox}
          className="w-10 h-10 rounded-2xl bg-[#1c1e22] border border-[#2a2d33] flex items-center justify-center text-[#9ca3af] hover:text-white active:scale-95 transition-all shadow-sm"
          title="صندوق پیام‌ها"
          aria-label="Inbox"
        >
          <Mail className="w-5 h-5 text-[#9ca3af]" />
        </button>
      </div>

      {/* Center: Shamsi Date & Official App Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={onOpenVipModal}>
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-medium text-[#9ca3af] leading-tight">
            {jalali.dayName}
          </span>
          <span className="text-base font-bold text-white tracking-wide leading-tight">
            {toPersianDigits(jalali.day)} {jalali.monthName}
          </span>
        </div>

        {/* Official App Logo with gold border & rounded corners */}
        <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] shadow-[0_0_12px_rgba(245,158,11,0.25)]">
          <AriaLogo className="w-8 h-8" rounded="rounded-[13px]" />
        </div>
      </div>

      {/* Right: Back Button or VIP Golden Icon */}
      <div className="flex items-center gap-2">
        {currentSubView ? (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#1c1e22] border border-[#2a2d33] flex items-center justify-center text-white hover:text-[#3ECF8E] active:scale-95 transition-all"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onOpenVipModal}
            className="w-10 h-10 rounded-2xl bg-[#1c1e22] border border-[#2a2d33] flex items-center justify-center text-[#f59e0b] hover:border-[#f59e0b]/50 active:scale-95 transition-all shadow-sm"
            title="اشتراک طلایی"
            aria-label="VIP"
          >
            <Crown className="w-5 h-5 fill-[#f59e0b]/20 text-[#f59e0b]" />
          </button>
        )}
      </div>
    </header>
  );
}
