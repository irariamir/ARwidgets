import React from 'react';
import { Mail, X, Check, Bell, Sparkles } from 'lucide-react';
import { toPersianDigits, getCurrentJalaliDate } from '../utils/jalali';

export function InboxModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const jalali = getCurrentJalaliDate();

  const MESSAGES = [
    {
      id: 'msg-1',
      title: 'خوش آمدید به تیک‌آر (TickAR)! ✨',
      body: 'به نسخه ۲.۵.۱ خوش آمدید. از بخش پومودورو برای تمرکز عمیق، عادت‌ساز برای ساخت عادات پایدار و بخش رشد برای شنیدن پادکست‌ها استفاده کنید.',
      time: 'امروز ۱۲:۰۰',
      unread: true
    },
    {
      id: 'msg-2',
      title: 'یادآوری شروع پرانرژی روز 🚀',
      body: 'برای روز خود حداقل ۳ هدف و کار کلیدی مشخص کنید و با تکنیک پومودورو شروع کنید.',
      time: 'امروز ۰۸:۳۰',
      unread: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4 select-none">
      <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl sm:rounded-3xl border border-[#2d3139] p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">صندوق پیام‌ها</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {MESSAGES.map((m) => (
            <div
              key={m.id}
              className="bg-[#202227] border border-[#2d313a] rounded-2xl p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {m.unread && <span className="w-2 h-2 rounded-full bg-[#3ECF8E]"></span>}
                  {m.title}
                </span>
                <span className="text-[10px] text-[#8b929e]">{m.time}</span>
              </div>
              <p className="text-xs text-[#d1d5db] leading-relaxed">
                {m.body}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#252830]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#2a2d36] hover:bg-[#323642] text-white font-bold text-xs"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
