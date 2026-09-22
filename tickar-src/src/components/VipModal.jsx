import React, { useState } from 'react';
import { Crown, X, Check, Sparkles, Flame, Clock, Smile, FileText, CheckSquare, Rocket } from 'lucide-react';

export function VipModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('habits');

  if (!isOpen) return null;

  const VIP_FEATURES = {
    growth: {
      title: 'بخش رشد و خودسازی پیشرفته',
      desc: 'دسترسی نامحدود به تمامی پادکست‌های انگیزشی، کتاب‌های صوتی خلاصه شده و چالش‌های ۳۰ روزه ساخت انگیزه.',
      icon: Rocket,
      perks: [
        'پادکست‌های فوق‌العاده با کیفیت استودیویی',
        'خلاصه کتاب‌های برتر دنیا در حوزه بهره‌وری',
        'چالش‌های روزانه با جایزه XP'
      ]
    },
    tasks: {
      title: 'مدیریت حرفه‌ای کارها و تسک‌ها',
      desc: 'دسترسی به تمامی برچسب‌های رنگی، ماتریس آیزنهاور، زیرکارهای نامحدود و برنامه‌ریز هوش مصنوعی.',
      icon: CheckSquare,
      perks: [
        'برچسب‌ها و پرچم‌های اولویت رنگارنگ',
        'زیرکارهای نامحدود برای هر تسک',
        'برنامه‌ریزی هوشمند با هوش مصنوعی ARIAMIR'
      ]
    },
    habits: {
      title: 'ایجاد رنگ و آیکون اختصاصی برای عادت‌ها',
      desc: 'طراحی عادت‌ها با پالت رنگ‌های متنوع، آیکون‌های اختصاصی و دوره‌های استمرار ۲۱، ۳۰ و ۴۰ روزه.',
      icon: Flame,
      perks: [
        'پالت رنگ‌های نامحدود برای هر عادت',
        'آیکون‌های متنوع ورزشی، ذهن و کاری',
        'تحلیل زنجیره استمرار و گزارش هفتگی'
      ]
    },
    mood: {
      title: 'تحلیل پیشرفته وضعیت احساسات',
      desc: 'ردیابی احساسات روزانه، سطح انرژی روانی و مشاهده نمودارهای روانشناختی هفتگی و ماهانه.',
      icon: Smile,
      perks: [
        '۵ تیپ احساسی با ایموجی‌های زنده',
        'تحلیل همبستگی مود و بهره‌وری روزانه',
        'دفترچه شکرگزاری و ثبت خاطرات'
      ]
    },
    notes: {
      title: 'یادداشت‌های نامحدود و ابری',
      desc: 'فضای بی‌نهایت برای ثبت ایده‌ها، دسته‌بندی موضوعی و جستجوی آنی در متون.',
      icon: FileText,
      perks: [
        'دسته‌بندی‌های اختصاصی یادداشت‌ها',
        'جستجوی پیشرفته با سرعت بالا',
        'پشتیبان‌گیری خودکار و بدون انقضا'
      ]
    },
    pomodoro: {
      title: 'صداهای آرامش‌بخش و امواج تتا',
      desc: 'موزیک‌های اختصاصی پومودورو شامل پیانو لوفای، باران پاییزی، امواج دریا، فرکانس‌های تمرکز و فلوت شرقی.',
      icon: Clock,
      perks: [
        'موزیک‌های متمرکز و سنتز شده زنده',
        'فرکانس‌های امواج مغزی برای دیپ ورک',
        'تنظیم دقیق تایمرهای کار و استراحت'
      ]
    }
  };

  const current = VIP_FEATURES[activeTab] || VIP_FEATURES.habits;
  const CurrentIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4 select-none">
      <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl sm:rounded-3xl border border-[#2d3139] p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
        {/* Header (Matching Lemoni flow_007.jpg) */}
        <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] flex items-center justify-center text-black shadow-lg shadow-[#f59e0b]/30">
              <Crown className="w-7 h-7 fill-black" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">طلایی شو! (VIP)</h2>
              <p className="text-xs text-[#d1d5db]">
                با اشتراک طلایی به تمامی امکانات زیر دسترسی داری:
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Category Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'habits', label: 'عادت' },
            { id: 'tasks', label: 'کارها' },
            { id: 'pomodoro', label: 'پومودورو' },
            { id: 'growth', label: 'رشد' },
            { id: 'mood', label: 'احساسات' },
            { id: 'notes', label: 'یادداشت' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/25'
                  : 'bg-[#22242b] text-[#9ca3af] hover:text-white border border-[#2e323b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feature Showcase Card */}
        <div className="bg-[#1f2127] border border-[#2d313a] rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">{current.title}</h3>
          </div>

          <p className="text-xs text-[#9ca3af] leading-relaxed">
            {current.desc}
          </p>

          <div className="space-y-2 pt-2 border-t border-[#2a2d36]">
            {current.perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white">
                <div className="w-4 h-4 rounded-full bg-[#3ECF8E] text-black flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate VIP Badge Notice */}
        <div className="bg-[#192b22] border border-[#3ECF8E]/40 rounded-2xl p-3.5 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#3ECF8E] shrink-0" />
          <div className="text-xs text-white">
            <span className="font-bold text-[#3ECF8E] block">هدیه ویژه ARIAMIR:</span>
            <span>این اشتراک برای کلیه کاربران به صورت دائمی و ۱۰۰٪ رایگان فعال شده است.</span>
          </div>
        </div>

        {/* Bottom Button */}
        <div>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-extrabold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-[#10b981]/25"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>متوجه شدم (دسترسی نامحدود فعال است)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
