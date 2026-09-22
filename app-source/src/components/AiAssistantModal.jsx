import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Cpu, 
  Check, 
  PlusCircle, 
  Clock,
  Layers
} from 'lucide-react';
import { getCurrentJalaliDate, toPersianDigits } from '../utils/jalali';

export function AiAssistantModal({ isOpen, onClose, onAddGeneratedTasks }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [imported, setImported] = useState(false);

  if (!isOpen) return null;

  const currentJalali = getCurrentJalaliDate();

  const presets = [
    '🎯 برنامه‌ریزی یک روز کاری پرانرژی برای تیم ARIAMIR',
    '⚡ شکستن هدف: یادگیری و تسلط بر معماری Clean در ۲ هفته',
    '🧠 روتین صبحگاهی برای به حداکثر رساندن تمرکز و انگیزه',
    '🔥 رفع اهمال‌کاری و پایان دادن به پروژه‌های نیمه‌تمام'
  ];

  const handleGenerate = (queryText) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setIsGenerating(true);
    setImported(false);

    // Realistic AI Plan Generation Engine
    setTimeout(() => {
      let tasks = [];
      let advice = '';

      if (q.includes('ARIAMIR') || q.includes('پروژه') || q.includes('کاری')) {
        advice = 'برای حداکثر بهره‌وری در پروژه‌های ARIAMIR، دو سشن تمرکز عمیق (Deep Work) اول صبح قبل از چک کردن پیام‌ها در نظر گرفته شد.';
        tasks = [
          {
            title: 'بررسی معماری سیستم و رفع باگ‌های کلیدی نسخه پروداکشن',
            description: 'تحلیل لاگ‌ها، بهینه‌سازی دیتابیس و اعتبارسنجی اندپوینت‌ها',
            category: 'ariamir',
            priority: 'urgent',
            matrixQuadrant: 'do_first',
            time: '09:00',
            estimatedPomodoros: 3,
            subtasks: [
              { text: 'بررسی متریک‌های پرفورمنس سرور', completed: false },
              { text: 'تست یکپارچگی ماژول احراز هویت', completed: false }
            ]
          },
          {
            title: 'جلسه اسپرینت استراتژیک و هماهنگی تارگت‌های محصول',
            description: 'بررسی KPIهای فصلی و اولویت‌بندی تسک‌های تیم توسعه',
            category: 'ariamir',
            priority: 'high',
            matrixQuadrant: 'do_first',
            time: '11:30',
            estimatedPomodoros: 2,
            subtasks: [
              { text: 'آماده‌سازی گزارش وضعیت هفتگی', completed: false }
            ]
          },
          {
            title: 'طراحی فیچرهای جدید بر اساس بازخورد مشتریان ویژه',
            description: 'ایجاد وایرفریم‌ها و نوشتن سند فنی نیازمندی‌ها',
            category: 'work',
            priority: 'medium',
            matrixQuadrant: 'schedule',
            time: '14:30',
            estimatedPomodoros: 3,
            subtasks: []
          },
          {
            title: '۳۰ دقیقه ورزش و تمرینات تنفسی ریکاوری ذهن',
            description: 'پیاده‌روی سریع و تنفس عمیق برای کاهش ترشح کورتیزول',
            category: 'health',
            priority: 'medium',
            matrixQuadrant: 'schedule',
            time: '17:30',
            estimatedPomodoros: 1,
            subtasks: []
          }
        ];
      } else if (q.includes('روتین') || q.includes('صبحگاهی') || q.includes('تمرکز')) {
        advice = 'روتین‌های برنده بر پایه ترشح دوپامین سالم و کاهش فرسودگی تصمیم‌گیری (Decision Fatigue) تنظیم می‌شوند.';
        tasks = [
          {
            title: 'نوشیدن نیم لیتر آب به همراه ۵ دقیقه کشش صبحگاهی',
            description: 'آبرسانی به سلول‌های مغز و فعال‌سازی جریان خون',
            category: 'health',
            priority: 'high',
            matrixQuadrant: 'do_first',
            time: '06:30',
            estimatedPomodoros: 1,
            subtasks: []
          },
          {
            title: '۱۰ دقیقه تمرین تنفس عمیق و ثبت احساسات در TickAR',
            description: 'ایجاد آرامش و شفافیت ذهنی قبل از ورود به کارهای روزمره',
            category: 'health',
            priority: 'medium',
            matrixQuadrant: 'schedule',
            time: '07:00',
            estimatedPomodoros: 1,
            subtasks: []
          },
          {
            title: 'بلوک ۹۰ دقیقه‌ای کار روی مهم‌ترین تسک روز (Eat That Frog)',
            description: 'انجام سنگین‌ترین کار با حداکثر توان ذهنی بدون نوتیفیکیشن',
            category: 'ariamir',
            priority: 'urgent',
            matrixQuadrant: 'do_first',
            time: '08:00',
            estimatedPomodoros: 3,
            subtasks: []
          }
        ];
      } else {
        advice = `هدف «${q}» به گام‌های اجرایی شفاف و قابل اندازه‌گیری شکسته شد تا نیروی مقاومت اولیه مغز به صفر برسد.`;
        tasks = [
          {
            title: `فاز اول: تحقیقات و نقشه‌راه برای ${q.slice(0, 30)}`,
            description: 'تعریف دقیق خروجی نهایی و جمع‌آوری منابع مورد نیاز',
            category: 'study',
            priority: 'high',
            matrixQuadrant: 'do_first',
            time: '10:00',
            estimatedPomodoros: 2,
            subtasks: [
              { text: 'بررسی ۳ منبع مرجع و بهترین الگوها', completed: false },
              { text: 'یادداشت‌برداری نکات کلیدی در ژورنال', completed: false }
            ]
          },
          {
            title: `فاز دوم: پیاده‌سازی نمونه اولیه و تست خروجی`,
            description: 'اجرای گام‌به‌گام اولین پروتوتایپ یا تمرین عملی',
            category: 'work',
            priority: 'medium',
            matrixQuadrant: 'schedule',
            time: '14:00',
            estimatedPomodoros: 3,
            subtasks: []
          },
          {
            title: `فاز سوم: بازبینی، رفع اشکالات و ثبت تجربیات`,
            description: 'ارزیابی نقاط قوت و بهبود فرآیند برای دفعات بعد',
            category: 'personal',
            priority: 'low',
            matrixQuadrant: 'schedule',
            time: '18:00',
            estimatedPomodoros: 1,
            subtasks: []
          }
        ];
      }

      setGeneratedPlan({
        query: q,
        advice,
        tasks
      });
      setSelectedTasks(tasks.map((_, i) => i));
      setIsGenerating(false);
    }, 900);
  };

  const handleToggleTaskSelection = (index) => {
    if (selectedTasks.includes(index)) {
      setSelectedTasks(selectedTasks.filter((i) => i !== index));
    } else {
      setSelectedTasks([...selectedTasks, index]);
    }
  };

  const handleImportToSchedule = () => {
    if (!generatedPlan || selectedTasks.length === 0) return;

    const tasksToImport = selectedTasks.map((idx) => {
      const raw = generatedPlan.tasks[idx];
      return {
        id: 't-ai-' + Date.now() + '-' + idx,
        title: raw.title,
        description: raw.description,
        category: raw.category,
        priority: raw.priority,
        matrixQuadrant: raw.matrixQuadrant,
        date: currentJalali.dateString,
        time: raw.time,
        estimatedPomodoros: raw.estimatedPomodoros,
        completedPomodoros: 0,
        completed: false,
        subtasks: raw.subtasks ? raw.subtasks.map((s, si) => ({ id: `st-ai-${Date.now()}-${si}`, text: s.text, completed: false })) : [],
        recurrence: 'none'
      };
    });

    onAddGeneratedTasks(tasksToImport);
    setImported(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8 bg-[#121212] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E2E2E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#005936] to-[#3ECF8E] flex items-center justify-center text-black shadow-md shadow-[#3ECF8E]/20">
              <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-1.5">
                دستیار هوشمند برنامه‌ریزی <span className="text-[#3ECF8E]">TickAR AI</span>
              </h3>
              <p className="text-[11px] text-[#898989]">مبتنی بر مدل‌های تحلیل راندمان و روانشناسی رفتاری</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1C1C1C] hover:bg-[#242424] text-[#898989] hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Box */}
        <div className="mt-4">
          <div className="relative">
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="هدف یا برنامه‌ای که می‌خواهی به تسک‌های شفاف تبدیل شود را بنویس..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E] text-white text-xs outline-none transition-all placeholder:text-[#525252] resize-none"
            />
            <button
              onClick={() => handleGenerate(prompt)}
              disabled={isGenerating || !prompt.trim()}
              className="absolute left-2.5 bottom-3.5 w-8 h-8 rounded-xl bg-[#3ECF8E] hover:bg-[#72E3AD] disabled:opacity-40 text-black flex items-center justify-center transition-all shadow-md"
            >
              <Send className="w-4 h-4 stroke-[2.5] rotate-180" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p);
                  handleGenerate(p);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#171717] hover:bg-[#242424] border border-[#2E2E2E] text-[#B4B4B4] hover:text-[#3ECF8E] transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {isGenerating && (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#3ECF8E]/20 border-t-[#3ECF8E] animate-spin" />
            <p className="text-xs text-[#3ECF8E] font-medium animate-pulse">در حال تحلیل هدف و ساخت برنامه بهینه...</p>
          </div>
        )}

        {/* Result Area */}
        {generatedPlan && !isGenerating && (
          <div className="mt-5 space-y-3.5 animate-in fade-in duration-300">
            
            {/* AI Advice Box */}
            <div className="p-3.5 rounded-2xl bg-[#005936]/20 border border-[#3ECF8E]/30 text-xs text-[#FAFAFA] leading-relaxed flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-[#3ECF8E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#3ECF8E] block mb-0.5">پیشنهاد بهینه‌سازی TickAR:</span>
                <p className="text-[#B4B4B4] text-[11px]">{generatedPlan.advice}</p>
              </div>
            </div>

            {/* Generated Tasks List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <div className="text-xs font-semibold text-[#898989] flex items-center justify-between">
                <span>وظایف تولید شده ({toPersianDigits(selectedTasks.length)} از {toPersianDigits(generatedPlan.tasks.length)} انتخاب شده)</span>
                <span className="text-[10px] text-[#3ECF8E]">قابل ویرایش و ذخیره</span>
              </div>

              {generatedPlan.tasks.map((task, idx) => {
                const isSelected = selectedTasks.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleTaskSelection(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#171717] border-[#3ECF8E]/50 shadow-sm' 
                        : 'bg-[#0E0E0E] border-[#242424] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#3ECF8E] border-[#3ECF8E] text-black' : 'border-[#4A4A4A]'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{task.title}</h4>
                          <span className="text-[10px] text-[#3ECF8E] font-mono flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            {toPersianDigits(task.estimatedPomodoros * 25)} دقیقه
                          </span>
                        </div>
                        <p className="text-[11px] text-[#898989] mt-1 line-clamp-1">{task.description}</p>
                        
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {task.subtasks.map((st, si) => (
                              <span key={si} className="text-[10px] px-1.5 py-0.5 rounded bg-[#242424] text-[#B4B4B4]">
                                • {st.text}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Import Button */}
            <div className="pt-3 border-t border-[#2E2E2E] flex items-center justify-between">
              <span className="text-[11px] text-[#898989]">
                افزودن به برنامه‌ریزی امروز ({currentJalali.dayName})
              </span>
              
              <button
                onClick={handleImportToSchedule}
                disabled={selectedTasks.length === 0 || imported}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  imported 
                    ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]' 
                    : 'bg-[#3ECF8E] hover:bg-[#72E3AD] text-black shadow-lg shadow-[#3ECF8E]/20'
                }`}
              >
                {imported ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    اضافه شد!
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                    افزودن {toPersianDigits(selectedTasks.length)} وظیفه به برنامه امروز
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
