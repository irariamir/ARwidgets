import React from 'react';
import { Bell, X, CheckCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export function NotificationGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleRequestPermission = () => {
    audioEngine.playClick();
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('تیک‌آر (TickAR)', {
            body: 'اعلان‌های یادآوری تسک‌ها و عادت‌ها با موفقیت فعال شدند! 🚀',
            icon: '/brand/mark-green.png'
          });
        }
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4 select-none">
      <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl sm:rounded-3xl border border-[#2d3139] p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f97316]/20 text-[#f97316] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">
              راهنمای دریافت اعلان (نوتیفیکیشن)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description Text (Matching Lemoni flow_033.jpg) */}
        <div className="space-y-3 text-xs sm:text-sm text-[#e5e7eb] leading-relaxed">
          <p>
            سیستم‌عامل اندروید به‌طور پیش‌فرض برای بهینه‌سازی مصرف باتری اجازه نمی‌دهد که اپلیکیشن‌ها به راحتی و سر وقت اعلان ارسال کنند. برای همین لازمه که تنظیمات زیر رو دستی انجام بدی تا بتونی به‌موقع و بدون هیچ مشکلی از تیک‌آر اعلان دریافت کنی:
          </p>

          <div className="bg-[#202227] border border-[#2d313a] rounded-2xl p-3.5 space-y-2 text-xs text-[#d1d5db]">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#3ECF8E] shrink-0 mt-0.5" />
              <span><strong>۱. فعال‌سازی نوتیفیکیشن:</strong> در تنظیمات گوشی دسترسی Notifications را روشن کنید.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#3ECF8E] shrink-0 mt-0.5" />
              <span><strong>۲. بهینه‌سازی باتری (Battery Optimization):</strong> اپلیکیشن تیک‌آر را روی حالت «Unrestricted» یا «بدون محدودیت» قرار دهید.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#3ECF8E] shrink-0 mt-0.5" />
              <span><strong>۳. قفل در پس‌زمینه (Lock in Recents):</strong> در منوی برنامه‌های اخیر، آیکون قفل برنامه را فعال کنید.</span>
            </div>
          </div>

          <p className="text-[11px] text-[#9ca3af]">
            در ضمن ممکنه به خاطر مدل‌های مختلف گوشی بعضی از این تنظیمات در بخش‌های متفاوتی قرار داشته باشن (سامسونگ، شیائومی، هواوی).
          </p>
        </div>

        {/* Action Button (Matching Lemoni: فعالسازی دسترسی نوتیفیکیشن) */}
        <div className="pt-2 border-t border-[#252830]">
          <button
            onClick={handleRequestPermission}
            className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-[#10b981]/25"
          >
            <Bell className="w-4 h-4" />
            <span>فعالسازی دسترسی نوتیفیکیشن</span>
          </button>
        </div>
      </div>
    </div>
  );
}
