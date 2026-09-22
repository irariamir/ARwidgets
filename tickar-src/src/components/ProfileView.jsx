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
  ChevronLeft,
  X,
  Check,
  Volume2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { exportAllData, importAllData } from '../utils/storage';
import { audioEngine } from '../utils/audioEngine';
import { AriaLogo } from './AriaLogo';
import confetti from 'canvas-confetti';

export function ProfileView({
  userStats,
  onUpdateUserStats,
  settings,
  onUpdateSettings,
  onOpenVipModal,
  onOpenNotificationGuide
}) {
  const [importStatus, setImportStatus] = useState(null);

  // Modals inside Profile
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  // Profile Form States
  const [profileName, setProfileName] = useState(userStats.userName || 'مدیر ارشد');
  const [profileOrg, setProfileOrg] = useState(userStats.organization || 'تیم تیک‌آر');

  // Settings Form States
  const [workMins, setWorkMins] = useState(settings.pomodoroWorkMinutes || 25);
  const [breakMins, setBreakMins] = useState(settings.pomodoroBreakMinutes || 5);
  const [longBreakMins, setLongBreakMins] = useState(settings.pomodoroLongBreakMinutes || 15);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEffects !== false);

  const toggleTheme = () => {
    audioEngine.playClick();
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    audioEngine.playClick();
    onUpdateUserStats({
      ...userStats,
      userName: profileName.trim() || 'مدیر ارشد',
      organization: profileOrg.trim() || 'تیم تیک‌آر'
    });
    setIsEditProfileOpen(false);
  };

  const handleSaveSettings = (e) => {
    e?.preventDefault();
    audioEngine.playClick();
    onUpdateSettings({
      ...settings,
      pomodoroWorkMinutes: parseInt(workMins, 10) || 25,
      pomodoroBreakMinutes: parseInt(breakMins, 10) || 5,
      pomodoroLongBreakMinutes: parseInt(longBreakMins, 10) || 15,
      soundEffects: soundEnabled
    });
    setIsAdvancedSettingsOpen(false);
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

  const handleRatingSubmit = () => {
    audioEngine.playTaskComplete();
    setIsRatingSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6']
    });
    setTimeout(() => {
      setIsRatingOpen(false);
      setIsRatingSubmitted(false);
    }, 1800);
  };

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4 select-none">
      {/* 1. User Profile Card (Matching Lemoni scene_013.jpg) */}
      <div className="bg-[#191a1e] border border-[#272a31] rounded-3xl p-4.5 space-y-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3.5 cursor-pointer"
            onClick={() => setIsEditProfileOpen(true)}
          >
            {/* Logo from image-1.png with rounded squircle corners */}
            <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-[#15593B] to-[#3ECF8E] shadow-md">
              <AriaLogo className="w-14 h-14" rounded="rounded-2xl" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>وقت بخیر</span>
                <span className="text-[#3ECF8E]">{userStats.userName || 'مدیر ارشد'}</span>
              </h2>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                آرزوهاتو با تیک‌آر تیک بزن! ✨
              </p>
            </div>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl bg-[#22242b] border border-[#2e323b] flex items-center justify-center text-[#f59e0b] hover:text-white active:scale-95 transition-all"
            title="تغییر حالت تم"
          >
            {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
          </button>
        </div>
      </div>

      {/* 2. VIP Status Card */}
      <div
        onClick={onOpenVipModal}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#f59e0b]/20 via-[#fbbf24]/10 to-[#191a1e] border border-[#f59e0b]/30 p-4.5 cursor-pointer active:scale-98 transition-all shadow-lg flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] flex items-center justify-center text-black shadow-md shadow-[#f59e0b]/25 shrink-0">
            <Crown className="w-6 h-6 fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">اشتراک طلایی تیک‌آر</h3>
              <span className="text-[10px] bg-[#3ECF8E] text-black font-extrabold px-2 py-0.5 rounded-full">
                فعال
              </span>
            </div>
            <p className="text-xs text-[#d1d5db] mt-0.5">
              تمامی امکانات پیشرفته و ابزارها در دسترس شماست.
            </p>
          </div>
        </div>

        <ChevronLeft className="w-5 h-5 text-[#f59e0b] shrink-0" />
      </div>

      {/* 3. Settings Menu List (Matching Lemoni scene_013.jpg) */}
      <div className="bg-[#191a1e] border border-[#272a31] rounded-3xl overflow-hidden divide-y divide-[#242730] shadow-md">
        {/* Item 1: مشخصات شخصی */}
        <div
          onClick={() => setIsEditProfileOpen(true)}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white font-medium">
            <User className="w-4 h-4 text-[#3ECF8E]" />
            <span>مشخصات شخصی</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 2: اشتراک طلایی */}
        <div
          onClick={onOpenVipModal}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white font-medium">
            <Crown className="w-4 h-4 text-[#f59e0b]" />
            <span>وضعیت اشتراک طلایی</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 3: تنظیمات پیشرفته و پومودورو */}
        <div
          onClick={() => setIsAdvancedSettingsOpen(true)}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white font-medium">
            <Sliders className="w-4 h-4 text-[#06b6d4]" />
            <span>تنظیمات تایمرها و صداها</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 4: پشتیبان‌گیری از داده‌ها */}
        <div
          onClick={handleExportBackup}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white font-medium">
            <Download className="w-4 h-4 text-[#3b82f6]" />
            <span>پشتیبان‌گیری از داده‌ها (دانلود JSON)</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 5: بازیابی اطلاعات */}
        <label className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors">
          <div className="flex items-center gap-3 text-xs text-white font-medium">
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

        {/* Item 6: راهنمای اعلان‌ها */}
        <div
          onClick={onOpenNotificationGuide}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white font-medium">
            <Bell className="w-4 h-4 text-[#f97316]" />
            <span>راهنمای دریافت اعلان (نوتیفیکیشن)</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 7: ارتباط با ما / پشتیبانی */}
        <div
          onClick={() => window.open('https://t.me/arsourser2', '_blank')}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white font-medium">
            <MessageCircle className="w-4 h-4 text-[#3ECF8E]" />
            <span>ارتباط با ما و پشتیبانی تلگرام (@arsourser2)</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </div>

        {/* Item 8: درباره تیک‌آر */}
        <div
          onClick={() => setIsAboutOpen(true)}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white font-medium">
            <Info className="w-4 h-4 text-[#8b5cf6]" />
            <span>درباره تیک‌آر</span>
          </div>
          <span className="text-[11px] text-[#6b7280]">v2.5.1-PRO</span>
        </div>

        {/* Item 9: امتیاز به تیک‌آر */}
        <div
          onClick={() => setIsRatingOpen(true)}
          className="p-4 flex items-center justify-between hover:bg-[#202227] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 text-xs text-white font-medium">
            <Star className="w-4 h-4 text-[#eab308]" />
            <span>امتیاز به تیک‌آر</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
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
          خطا در بازیابی فایل! لطفا یک فایل JSON معتبر انتخاب کنید.
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl sm:rounded-3xl border border-[#2d3139] p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#3ECF8E]" />
                ویرایش مشخصات شخصی
              </h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#9ca3af] block mb-1">نام یا عنوان شما:</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="مثلا: مدیر ارشد"
                  className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#9ca3af] block mb-1">تیم یا سازمان:</label>
                <input
                  type="text"
                  value={profileOrg}
                  onChange={(e) => setProfileOrg(e.target.value)}
                  placeholder="مثلا: تیم تیک‌آر"
                  className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#252830]">
              <button
                onClick={handleSaveProfile}
                className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-bold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-[#10b981]/25"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                ذخیره مشخصات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADVANCED SETTINGS MODAL */}
      {/* ========================================================================= */}
      {isAdvancedSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl sm:rounded-3xl border border-[#2d3139] p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#06b6d4]" />
                تنظیمات تایمرها و صداها
              </h2>
              <button
                onClick={() => setIsAdvancedSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#9ca3af] block mb-1">مدت زمان فعالیت متمرکز پومودورو (دقیقه):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 25, 30, 45].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWorkMins(m)}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        workMins === m
                          ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/25'
                          : 'bg-[#202227] text-[#9ca3af] border border-[#2d313a]'
                      }`}
                    >
                      {toPersianDigits(m)} دقیقه
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#9ca3af] block mb-1">مدت زمان استراحت کوتاه (دقیقه):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setBreakMins(m)}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        breakMins === m
                          ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/25'
                          : 'bg-[#202227] text-[#9ca3af] border border-[#2d313a]'
                      }`}
                    >
                      {toPersianDigits(m)} دقیقه
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#9ca3af] block mb-1">مدت زمان استراحت طولانی (دقیقه):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 30].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setLongBreakMins(m)}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        longBreakMins === m
                          ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/25'
                          : 'bg-[#202227] text-[#9ca3af] border border-[#2d313a]'
                      }`}
                    >
                      {toPersianDigits(m)} دقیقه
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound toggle */}
              <div className="flex items-center justify-between bg-[#202227] p-3 rounded-2xl border border-[#2d313a] mt-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#3ECF8E]" />
                  <span className="text-white">افکت‌های صوتی و زنگ پایان تایمر</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#3ECF8E] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#252830]">
              <button
                onClick={handleSaveSettings}
                className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-bold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-[#10b981]/25"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ABOUT MODAL */}
      {/* ========================================================================= */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl sm:rounded-3xl border border-[#2d3139] p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl text-center">
            <div className="flex justify-end">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* App Logo */}
            <div className="flex justify-center">
              <AriaLogo className="w-20 h-20" rounded="rounded-3xl" />
            </div>

            <div>
              <h2 className="text-lg font-black text-white">تیک‌آر (TickAR)</h2>
              <span className="text-xs text-[#3ECF8E] font-bold bg-[#3ECF8E]/15 px-3 py-1 rounded-full inline-block mt-1">
                نسخه ۲.۵.۱-PRO
              </span>
            </div>

            <p className="text-xs text-[#d1d5db] leading-relaxed">
              تیک‌آر یک ابزار جامع برنامه‌ریزی روزانه، مدیریت تسک‌ها، ردیابی استمرار عادات، تایمر پومودورو با امواج صوتی آرامش‌بخش، یادداشت‌های سریع و ثبت احساسات است که به شما کمک می‌کند به حداکثر بهره‌وری و انگیزه برسید.
            </p>

            <div className="bg-[#202227] p-3 rounded-2xl border border-[#2d313a] text-[11px] text-[#9ca3af] space-y-1">
              <p>توسعه و طراحی تحت استانداردهای برندبوک ARIAMIR</p>
              <p>پشتیبانی: @arsourser2 در تلگرام</p>
            </div>

            <div>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#2a2d36] hover:bg-[#323642] text-white font-bold text-xs"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RATING MODAL */}
      {/* ========================================================================= */}
      {isRatingOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl sm:rounded-3xl border border-[#2d3139] p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl text-center">
            <div className="flex justify-end">
              <button
                onClick={() => setIsRatingOpen(false)}
                className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isRatingSubmitted ? (
              <>
                <h2 className="text-base font-bold text-white">امتیاز به تیک‌آر</h2>
                <p className="text-xs text-[#9ca3af]">
                  تجربه شما از استفاده از تیک‌آر چگونه بوده است؟
                </p>

                {/* 5 Stars */}
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingStars(star)}
                      className="text-3xl transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= ratingStars
                            ? 'text-[#f59e0b] fill-[#f59e0b]'
                            : 'text-[#4b5563]'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="نظر یا پیشنهادی برای بهبود تیک‌آر داری بنویس..."
                  rows={3}
                  className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl p-3 text-xs text-white placeholder-[#6b7280] outline-none resize-none"
                />

                <button
                  onClick={handleRatingSubmit}
                  className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-bold text-sm shadow-md shadow-[#10b981]/25"
                >
                  ثبت نظر و امتیاز
                </button>
              </>
            ) : (
              <div className="py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h3 className="text-sm font-bold text-white">با تشکر از امتیاز شما!</h3>
                <p className="text-xs text-[#9ca3af]">نظر ارزشمند شما با موفقیت ثبت شد.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
