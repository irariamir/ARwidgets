import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Palette, 
  Sliders, 
  Globe, 
  Info,
  Building
} from 'lucide-react';
import { exportAllData, importAllData } from '../utils/storage';

export function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings,
  onDataImported,
  onResetData
}) {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TickAR_ARIAMIR_Backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const ok = importAllData(event.target.result);
      if (ok) {
        setImportStatus('success');
        onDataImported();
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8 bg-[#121212] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E2E2E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#005936] to-[#3ECF8E] flex items-center justify-center text-black">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">تنظیمات VIP و هویت سازمانی</h3>
              <p className="text-[11px] text-[#898989]">نسخه اختصاصی TickAR برای شرکت فناوری ARIAMIR</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1C1C1C] hover:bg-[#242424] text-[#898989] hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VIP Status Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#005936] via-[#15593B] to-[#0D0D0D] border border-[#3ECF8E]/40 text-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3ECF8E]" />
              <span className="font-heading font-bold text-sm text-white">اشتراک دائمی نامحدود (Enterprise VIP)</span>
            </div>
            <span className="bg-[#3ECF8E] text-black text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
              100% رایگان
            </span>
          </div>
          <p className="text-xs text-[#FAFAFA]/80 mt-1.5 leading-relaxed">
            تمامی امکانات ویژه و پولی لمونی (پادکست‌ها، آنالیزهای هوشمند، نویزساز صوتی محیطی، ردیاب خلق‌وخو و برنامه‌ریزی با هوش مصنوعی) به صورت پیش‌فرض و نامحدود برای شما باز شده است.
          </p>
        </div>

        {/* Settings Sections */}
        <div className="mt-4 space-y-4">
          
          {/* Pomodoro Timers */}
          <div className="p-4 rounded-2xl bg-[#171717] border border-[#2E2E2E]">
            <h4 className="font-heading font-bold text-xs text-white mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#3ECF8E]" />
              تنظیمات تایمر پومودورو (دقیقه)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#898989] mb-1">زمان کار عمیق</label>
                <input 
                  type="number"
                  min="5"
                  max="90"
                  value={settings.pomodoroWorkMinutes || 25}
                  onChange={(e) => onUpdateSettings({ ...settings, pomodoroWorkMinutes: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#242424] border border-[#393939] text-white text-xs text-center font-mono outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#898989] mb-1">استراحت کوتاه</label>
                <input 
                  type="number"
                  min="1"
                  max="30"
                  value={settings.pomodoroBreakMinutes || 5}
                  onChange={(e) => onUpdateSettings({ ...settings, pomodoroBreakMinutes: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#242424] border border-[#393939] text-white text-xs text-center font-mono outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#898989] mb-1">استراحت بلند</label>
                <input 
                  type="number"
                  min="5"
                  max="60"
                  value={settings.pomodoroLongBreakMinutes || 15}
                  onChange={(e) => onUpdateSettings({ ...settings, pomodoroLongBreakMinutes: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#242424] border border-[#393939] text-white text-xs text-center font-mono outline-none"
                />
              </div>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="p-4 rounded-2xl bg-[#171717] border border-[#2E2E2E]">
            <h4 className="font-heading font-bold text-xs text-white mb-2 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#7965FF]" />
              مدیریت و پشتیبان‌گیری از اطلاعات (Backup & Restore)
            </h4>
            <p className="text-[11px] text-[#898989] mb-3">
              داده‌های شما در حافظه مرورگر امن است. می‌توانید یک نسخه پشتیبان JSON دانلود کنید یا در دستگاه دیگر بازیابی نمایید.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#242424] hover:bg-[#2A2A2A] border border-[#393939] text-white text-xs font-semibold transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#3ECF8E]" /> : <Download className="w-3.5 h-3.5" />}
                {copied ? 'دانلود شد!' : 'دانلود فایل پشتیبان (Export)'}
              </button>

              <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#242424] hover:bg-[#2A2A2A] border border-[#393939] text-white text-xs font-semibold cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5 text-[#3ECF8E]" />
                بازیابی اطلاعات (Import)
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>
            </div>

            {importStatus === 'success' && (
              <p className="text-[11px] text-[#3ECF8E] mt-2 font-medium">✅ اطلاعات با موفقیت بازیابی و اعمال شد.</p>
            )}
            {importStatus === 'error' && (
              <p className="text-[11px] text-[#E54D2D] mt-2 font-medium">❌ فایل انتخاب شده نامعتبر است.</p>
            )}
          </div>

          {/* Organization & Brand Info */}
          <div className="p-4 rounded-2xl bg-[#171717] border border-[#2E2E2E]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#3ECF8E]" />
                <span className="text-xs font-bold text-white">شرکت توسعه فناوری ARIAMIR</span>
              </div>
              <span className="text-[10px] text-[#898989] font-mono">v2.5.0 PRO</span>
            </div>
            <p className="text-[11px] text-[#898989] mt-1.5">
              طراحی شده بر اساس هویت بصری رسمی و برندبوک ARIAMIR همراه با فونت کلمه و ایران‌یکان.
            </p>
          </div>

          {/* Reset Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                if (window.confirm('آیا مطمئن هستید که می‌خواهید داده‌ها را به حالت اولیه بازنشانی کنید؟')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-[11px] text-[#E54D2D] hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              بازنشانی کلی داده‌ها به حالت اولیه
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
