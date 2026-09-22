import React, { useState } from 'react';
import { toPersianDigits } from '../utils/jalali';
import {
  User,
  Crown,
  Settings,
  Bell,
  Download,
  Upload,
  MessageCircle,
  Info,
  Star,
  Moon,
  Sun,
  ShieldCheck,
  ChevronLeft,
  Share2,
  Sparkles,
  Camera
} from 'lucide-react';
import { exportAllData, importAllData } from '../utils/storage';
import { audioEngine } from '../utils/audioEngine';

export function ProfileView({
  userStats,
  settings,
  onUpdateSettings,
  onOpenVipModal,
  onOpenNotificationGuide
}) {
  const [importStatus, setImportStatus] = useState(null);

  const toggleTheme = () => {
    audioEngine.playClick();
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleExportBackup = () => {
    audioEngine.playClick();
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TickAR_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const success = importAllData(content);
      if (success) {
        setImportStatus('success');
        audioEngine.playTaskComplete();
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4 select-none">
      {/* 1. User Profile Card (Matching Lemoni scene_013.jpg) */}
      <div className="bg-[#191a1e] border border-[#272a31] rounded-3xl p-4.5 space-y-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar with Camera Badge */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#15593B] to-[#3ECF8E] flex items-center justify-center text-white text-xl font-bold border-2 border-[#3ECF8E]/40 shadow-md">
                👤
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2a2d36] border border-[#3a3e4a] flex items-center justify-center text-[#9ca3af]">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>وقت بخیر</span>
                <span className="text-[#3ECF8E]">{userStats.userName || 'مدیر ارشد ARIAMIR'}</span>
              </h2>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                آرزوهاتو با تیک‌آر تیک بزن! ✨
              </p>
            </div>
          </div>

          {/* Theme Switcher Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl bg-[#22242b] border border-[#2e323b] flex items-center justify-center text-[#f59e0b] hover:text-white active:scale-95 transition-all"
            title="تغییر حالت تم"
          >
            {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
          </button>
        </div>
      </div>

      {/* 2. Golden VIP Subscription Card (Matching Lemoni) */}
      <div
        onClick={onOpenVipModal}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#f59e0b]/25 via-[#fbbf24]/10 to-[#191a1e] border border-[#f59e0b]/30 p-4.5 cursor-pointer active:scale-98 transition-all shadow-lg flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] flex items-center justify-center text-black shadow-md shadow-[#f59e0b]/25 shrink-0">
            <Crown className="w-6 h-6 fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">اشتراک طلایی تیک‌آر (VIP)</h3>
              <span className="text-[10px] bg-[#3ECF8E] text-black font-extrabold px-2 py-0.5 rounded-full">
                فعال دائمی
              </span>
            </div>
            <p className="text-xs text-[#d1d5db] mt-0.5">
              تمام قابلیت‌های پرو برای کاربران ARIAMIR کاملاً رایگان است.
            </p>
          </div>
        </div>

        <ChevronLeft className="w-5 h-5 text-[#f59e0b] shrink-0" />
      </div>

      {/* 3. Settings & Options Menu List (Matching Lemoni scene_013.jpg) */}
      <div className="bg-[#191a1e] border border-[#272a31] rounded-3xl overflow-hidden divide-y divide-[#242730] shadow-md">
        {/* Item 1: مشخصات شخصی */}
        <div className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors">
          <div className="flex items-center gap-3 text-xs text-white">
            <User className="w-4 h-4 text-[#3ECF8E]" />
            <span>مشخصات شخصی و پروفایل</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 2: مدیریت اشتراک طلایی (VIP) */}
        <div
          onClick={onOpenVipModal}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white">
            <Crown className="w-4 h-4 text-[#f59e0b]" />
            <span>مدیریت اشتراک طلایی (امکانات VIP)</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 3: پشتیبان‌گیری و دانلود نسخه پشتیبان */}
        <div
          onClick={handleExportBackup}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white">
            <Download className="w-4 h-4 text-[#3b82f6]" />
            <span>پشتیبان‌گیری از داده‌ها (دانلود فایل JSON)</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 4: بازیابی فایل پشتیبان */}
        <label className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors">
          <div className="flex items-center gap-3 text-xs text-white">
            <Upload className="w-4 h-4 text-[#10b981]" />
            <span>بازیابی اطلاعات از فایل پشتیبان</span>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </label>

        {/* Item 5: راهنمای دریافت اعلان(نوتیفیکیشن) */}
        <div
          onClick={onOpenNotificationGuide}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white">
            <Bell className="w-4 h-4 text-[#f97316]" />
            <span>راهنمای دریافت اعلان (نوتیفیکیشن)</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 6: ارتباط با ما / پشتیبانی */}
        <div
          onClick={() => window.open('https://t.me/arsourser2', '_blank')}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white">
            <MessageCircle className="w-4 h-4 text-[#06b6d4]" />
            <span>ارتباط با ما و پشتیبانی تلگرام (@arsourser2)</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 7: درباره تیک‌آر */}
        <div className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors">
          <div className="flex items-center gap-3 text-xs text-white">
            <Info className="w-4 h-4 text-[#8b5cf6]" />
            <span>درباره تیک‌آر و گروه فناوری ARIAMIR</span>
          </div>
          <span className="text-[11px] text-[#6b7280]">v2.5.0-PRO</span>
        </div>
      </div>

      {/* Import Status feedback */}
      {importStatus === 'success' && (
        <div className="p-3 bg-[#10b981]/20 border border-[#10b981] rounded-2xl text-center text-xs text-[#10b981] font-bold">
          اطلاعات با موفقیت بازیابی شد! در حال بارگذاری مجدد...
        </div>
      )}
      {importStatus === 'error' && (
        <div className="p-3 bg-[#ef4444]/20 border border-[#ef4444] rounded-2xl text-center text-xs text-[#ef4444] font-bold">
          خطا در بازیابی فایل! لطفا یک فایل JSON معتبر تیک‌آر انتخاب کنید.
        </div>
      )}
    </div>
  );
}
