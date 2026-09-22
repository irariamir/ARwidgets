import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles, 
  Play, 
  Trash2, 
  Edit3, 
  Calendar as CalendarIcon, 
  Quote, 
  Check, 
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Smile
} from 'lucide-react';
import { 
  getCurrentJalaliDate, 
  toPersianDigits, 
  formatJalaliFull,
  gregorianToJalali,
  jalaliToGregorian,
  PERSIAN_DAY_NAMES_SHORT,
  PERSIAN_MONTH_NAMES
} from '../utils/jalali';
import { DAILY_AFFIRMATIONS } from '../data/seedData';
import confetti from 'canvas-confetti';

export function TodayView({ 
  tasks = [], 
  habits = [], 
  categories = [],
  onToggleTask, 
  onDeleteTask, 
  onEditTask, 
  onAddTask,
  onToggleHabit,
  onStartPomodoroForTask,
  onOpenAi,
  userStats,
  soundEffects,
  playCompleteSound,
  playSparkSound
}) {
  const currentJalali = getCurrentJalaliDate();
  const [selectedDateStr, setSelectedDateStr] = useState(currentJalali.dateString);
  const [quickTitle, setQuickTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Generate 7-day horizontal strip around today
  const generateWeekDays = () => {
    const days = [];
    const now = new Date();
    for (let i = -2; i <= 4; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
      const dayIndex = (d.getDay() + 1) % 7;
      const dateString = `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`;
      days.push({
        dateString,
        dayNum: j.jd,
        dayNameShort: PERSIAN_DAY_NAMES_SHORT[dayIndex],
        monthName: PERSIAN_MONTH_NAMES[j.jm - 1],
        isToday: dateString === currentJalali.dateString
      });
    }
    return days;
  };

  const weekDays = generateWeekDays();

  // Tasks for selected date in the strip
  const dateTasks = tasks.filter(t => t.date === selectedDateStr || (!t.date && selectedDateStr === currentJalali.dateString));
  
  const completedCount = dateTasks.filter(t => t.completed).length;
  const totalCount = dateTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentQuote = DAILY_AFFIRMATIONS[quoteIndex % DAILY_AFFIRMATIONS.length];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    let category = selectedCategory !== 'all' ? selectedCategory : 'ariamir';
    let priority = 'medium';
    let cleanTitle = quickTitle;

    if (cleanTitle.includes('#کار') || cleanTitle.includes('#work')) {
      category = 'work';
      cleanTitle = cleanTitle.replace(/#(کار|work)/g, '').trim();
    } else if (cleanTitle.includes('#درس') || cleanTitle.includes('#study')) {
      category = 'study';
      cleanTitle = cleanTitle.replace(/#(درس|study)/g, '').trim();
    } else if (cleanTitle.includes('#ورزش') || cleanTitle.includes('#health')) {
      category = 'health';
      cleanTitle = cleanTitle.replace(/#(ورزش|health)/g, '').trim();
    }

    if (cleanTitle.includes('!فوری') || cleanTitle.includes('!urgent')) {
      priority = 'urgent';
      cleanTitle = cleanTitle.replace(/!(فوری|urgent)/g, '').trim();
    } else if (cleanTitle.includes('!مهم') || cleanTitle.includes('!high')) {
      priority = 'high';
      cleanTitle = cleanTitle.replace(/!(مهم|high)/g, '').trim();
    }

    const newTask = {
      id: 't-' + Date.now(),
      title: cleanTitle,
      description: '',
      category,
      priority,
      matrixQuadrant: priority === 'urgent' || priority === 'high' ? 'do_first' : 'schedule',
      date: selectedDateStr,
      time: '12:00',
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      completed: false,
      subtasks: [],
      recurrence: 'none'
    };

    onAddTask(newTask);
    setQuickTitle('');
  };

  const handleTaskCheck = (task) => {
    onToggleTask(task.id);
    if (!task.completed) {
      if (soundEffects && playCompleteSound) playCompleteSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3ECF8E', '#00C472', '#72E3AD', '#ffffff']
      });
    }
  };

  const filteredTasks = dateTasks.filter(t => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="space-y-5 pb-24 text-right animate-in fade-in duration-300">
      
      {/* 1. Lemoni-Style Top Hero Banner */}
      <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#171717] via-[#121212] to-[#0A0A0A] border border-[#2E2E2E] shadow-xl overflow-hidden">
        {/* Glow halo */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#005936]/25 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#3ECF8E] flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {currentJalali.dayName}، {toPersianDigits(currentJalali.day)} {currentJalali.monthName} {toPersianDigits(currentJalali.year)}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#005936] text-[#3ECF8E]">
                ARIAMIR VIP PRO
              </span>
            </div>
            
            <h1 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
              با تیک‌آر به زندگیت نظم بده 🍋
            </h1>
            <p className="text-xs text-[#B4B4B4] mt-1">
              امروز {toPersianDigits(totalCount)} برنامه داری که {toPersianDigits(completedCount)} مورد انجام شده است.
            </p>
          </div>

          {/* Progress Circular Widget */}
          <div className="flex items-center gap-3.5 self-start sm:self-auto bg-[#1C1C1C]/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#2E2E2E]">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#2A2A2A]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#3ECF8E] transition-all duration-700 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono font-bold text-[11px] text-white">
                {toPersianDigits(progressPercent)}٪
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white block">چک‌لیست کارها</span>
              <span className="text-[10px] text-[#3ECF8E] font-medium font-mono">
                {toPersianDigits(completedCount)} از {toPersianDigits(totalCount)} تکمیل
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lemoni Horizontal Day Strip (شنبه تا جمعه) */}
      <div className="bg-[#121212] border border-[#2E2E2E] rounded-3xl p-3 shadow-md">
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((day) => {
            const isSelected = selectedDateStr === day.dateString;
            return (
              <button
                key={day.dateString}
                onClick={() => setSelectedDateStr(day.dateString)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#3ECF8E] text-black font-black shadow-lg shadow-[#3ECF8E]/30 scale-105'
                    : day.isToday
                    ? 'bg-[#005936]/40 text-[#3ECF8E] border border-[#3ECF8E]/50'
                    : 'bg-[#171717] text-[#898989] hover:text-white hover:bg-[#242424]'
                }`}
              >
                <span className="text-[10px] font-semibold mb-0.5">{day.dayNameShort}</span>
                <span className="font-mono text-xs font-bold">{toPersianDigits(day.dayNum)}</span>
                {day.isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-[#3ECF8E] mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Lemoni Habit Tracker Quick Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            ردیاب عادت‌های روزانه
          </h3>
          <span className="text-[10px] text-[#898989]">ثبت سریع با یک لمس</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {habits.map((habit) => {
            const isDoneToday = habit.completedDates && habit.completedDates.includes(selectedDateStr);
            return (
              <button
                key={habit.id}
                onClick={() => {
                  onToggleHabit(habit.id, selectedDateStr);
                  if (!isDoneToday && soundEffects && playSparkSound) playSparkSound();
                }}
                className={`flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all ${
                  isDoneToday
                    ? 'bg-[#005936]/40 border-[#3ECF8E] shadow-sm'
                    : 'bg-[#141414] border-[#2E2E2E] hover:border-[#3ECF8E]/40'
                }`}
              >
                <span className="text-xl">{habit.icon}</span>
                <div className="text-right">
                  <span className="font-bold text-xs text-white block truncate max-w-[120px]">{habit.name}</span>
                  <span className="text-[10px] text-orange-400 font-mono font-bold flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-orange-400" />
                    {toPersianDigits(habit.streak)} روز پیوسته
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isDoneToday ? 'bg-[#3ECF8E] border-[#3ECF8E] text-black' : 'border-[#4A4A4A]'
                }`}>
                  {isDoneToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Add Task Input */}
      <form onSubmit={handleQuickAdd} className="relative">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#171717] border border-[#2E2E2E] focus-within:border-[#3ECF8E] focus-within:ring-1 focus-within:ring-[#3ECF8E] transition-all shadow-md">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="کاراتو برنامه‌ریزی کن... (مثال: بررسی تسک‌های روز !فوری #کار)"
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white outline-none placeholder:text-[#525252]"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-4 py-2 rounded-xl bg-[#3ECF8E] hover:bg-[#72E3AD] disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1 transition-all shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ثبت</span>
          </button>
        </div>
      </form>

      {/* 5. Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/50'
                : 'bg-[#171717] text-[#898989] hover:text-white border border-[#242424]'
            }`}
          >
            همه دسته‌ها
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'bg-[#171717] text-[#898989] border-[#242424]'
              }`}
              style={{
                borderColor: selectedCategory === cat.id ? cat.color : '#242424',
                color: selectedCategory === cat.id ? cat.color : '#898989'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenAi}
          className="text-xs text-[#3ECF8E] hover:underline flex items-center gap-1 font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          برنامه‌ریزی هوشمند AI
        </button>
      </div>

      {/* 6. Tasks List (Lemoni-Style Cards) */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#121212] border border-[#242424] text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#3ECF8E]/40 mx-auto" />
            <p className="text-sm font-bold text-[#FAFAFA]">هیچ برنامه‌ای در این روز یا دسته نیست</p>
            <p className="text-xs text-[#898989]">با کادر بالا یا دستیار هوش مصنوعی تسک جدیدت رو بنویس.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const categoryObj = categories.find(c => c.id === task.category) || categories[0];
            const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
            const totalSubtasks = task.subtasks ? task.subtasks.length : 0;

            const priorityBadge = {
              urgent: { text: 'فوری و حیاتی', bg: 'bg-[#E54D2D]/15 text-[#E54D2D] border-[#E54D2D]/30' },
              high: { text: 'اولویت بالا', bg: 'bg-[#DA8D00]/15 text-[#DA8D00] border-[#DA8D00]/30' },
              medium: { text: 'متوسط', bg: 'bg-[#3ECF8E]/15 text-[#3ECF8E] border-[#3ECF8E]/30' },
              low: { text: 'پایین', bg: 'bg-[#79C0FF]/15 text-[#79C0FF] border-[#79C0FF]/30' }
            }[task.priority] || { text: 'عادی', bg: 'bg-[#242424] text-[#898989] border-[#393939]' };

            return (
              <div
                key={task.id}
                className={`p-4 rounded-3xl border transition-all duration-200 ${
                  task.completed
                    ? 'bg-[#121212]/60 border-[#242424] opacity-50'
                    : 'bg-[#171717] border-[#2E2E2E] hover:border-[#3ECF8E]/40 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  
                  {/* Right: Checkbox & Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleTaskCheck(task)}
                      className={`w-6 h-6 mt-0.5 rounded-xl border flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-[#3ECF8E] border-[#3ECF8E] text-black shadow-md shadow-[#3ECF8E]/30' 
                          : 'border-[#4A4A4A] hover:border-[#3ECF8E] text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-bold truncate ${task.completed ? 'line-through text-[#898989]' : 'text-white'}`}>
                          {task.title}
                        </h4>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge.bg}`}>
                          {priorityBadge.text}
                        </span>

                        <span 
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                          style={{ 
                            backgroundColor: `${categoryObj.color}15`, 
                            borderColor: `${categoryObj.color}40`,
                            color: categoryObj.color 
                          }}
                        >
                          {categoryObj.name}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-[#898989] mt-1 line-clamp-2">{task.description}</p>
                      )}

                      {/* Meta info */}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#898989]">
                        {task.time && (
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-[#3ECF8E]" />
                            {task.time}
                          </span>
                        )}

                        {totalSubtasks > 0 && (
                          <span className="flex items-center gap-1 font-mono text-[#79C0FF]">
                            چک‌لیست: {toPersianDigits(completedSubtasks)}/{toPersianDigits(totalSubtasks)}
                          </span>
                        )}

                        {task.estimatedPomodoros > 0 && (
                          <span className="flex items-center gap-1 font-mono text-amber-400">
                            🍅 {toPersianDigits(task.completedPomodoros || 0)}/{toPersianDigits(task.estimatedPomodoros)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Left: Quick Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!task.completed && (
                      <button
                        onClick={() => onStartPomodoroForTask(task)}
                        className="p-2 rounded-xl bg-[#005936] hover:bg-[#006239] text-[#3ECF8E] border border-[#3ECF8E]/30 transition-all"
                        title="شروع تمرکز عمیق روی این تسک"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#3ECF8E]" />
                      </button>
                    )}

                    <button
                      onClick={() => onEditTask(task)}
                      className="p-2 rounded-xl bg-[#242424] hover:bg-[#2A2A2A] text-[#898989] hover:text-white transition-all"
                      title="ویرایش"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 rounded-xl bg-[#242424] hover:bg-[#2A2A2A] text-[#898989] hover:text-[#E54D2D] transition-all"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Subtasks */}
                {totalSubtasks > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#242424] space-y-1.5">
                    {task.subtasks.map((st) => (
                      <div key={st.id} className="flex items-center gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${st.completed ? 'bg-[#3ECF8E]' : 'bg-[#525252]'}`} />
                        <span className={st.completed ? 'line-through text-[#898989]' : 'text-[#B4B4B4]'}>
                          {st.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 7. Lemoni Daily Motivation Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#171717] to-[#121212] border border-[#2E2E2E] relative overflow-hidden">
        <Quote className="absolute -bottom-2 -left-2 w-20 h-20 text-white/5 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#3ECF8E] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            جمله انگیزشی روز
          </span>
          <button
            onClick={() => setQuoteIndex(prev => prev + 1)}
            className="text-[10px] text-[#898989] hover:text-white px-2 py-0.5 rounded-lg bg-[#242424]"
          >
            بعدی ↻
          </button>
        </div>

        <p className="text-sm font-heading font-medium text-[#FAFAFA] leading-relaxed">
          «{currentQuote.quote}»
        </p>
        <span className="text-[11px] text-[#898989] mt-2 block">
          — {currentQuote.author}
        </span>
      </div>

    </div>
  );
}
