import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Trash2, 
  Edit3, 
  Tag, 
  Flag,
  Share2,
  Calendar as CalendarIcon,
  Quote,
  Check,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  getCurrentJalaliDate, 
  toPersianDigits, 
  formatJalaliFull 
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
  const [quickTitle, setQuickTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, urgent, ariamir, completed
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Filter tasks for today
  const todayTasks = tasks.filter(t => t.date === currentJalali.dateString || !t.date);
  
  const completedTodayCount = todayTasks.filter(t => t.completed).length;
  const totalTodayCount = todayTasks.length;
  const progressPercent = totalTodayCount > 0 ? Math.round((completedTodayCount / totalTodayCount) * 100) : 0;

  const currentQuote = DAILY_AFFIRMATIONS[quoteIndex % DAILY_AFFIRMATIONS.length];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    // NLP Tag parsing: check for #tag or !high
    let category = 'ariamir';
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
      date: currentJalali.dateString,
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

  const filteredTasks = todayTasks.filter(t => {
    if (selectedFilter === 'urgent') return t.priority === 'urgent' || t.priority === 'high';
    if (selectedFilter === 'ariamir') return t.category === 'ariamir';
    if (selectedFilter === 'completed') return t.completed;
    if (selectedFilter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="space-y-6 pb-24 text-right animate-in fade-in duration-300">
      
      {/* Hero Banner: Greeting & Jalali Date */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#171717] via-[#121212] to-[#0A0A0A] border border-[#2E2E2E] shadow-xl overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#005936]/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#3ECF8E] flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {currentJalali.dayName}، {toPersianDigits(currentJalali.day)} {currentJalali.monthName} {toPersianDigits(currentJalali.year)}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
              <span className="text-[11px] text-[#898989]">امروز</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              سلام، روزت پرانرژی! ⚡
            </h1>
            <p className="text-xs text-[#B4B4B4] mt-1">
              امروز {toPersianDigits(totalTodayCount)} برنامه داری که {toPersianDigits(completedTodayCount)} مورد انجام شده.
            </p>
          </div>

          {/* Progress Circular Widget */}
          <div className="flex items-center gap-4 self-start sm:self-auto bg-[#1C1C1C]/70 backdrop-blur-md p-3.5 rounded-2xl border border-[#2E2E2E]">
            <div className="relative w-14 h-14 flex items-center justify-center">
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
              <span className="absolute font-mono font-bold text-xs text-white">
                {toPersianDigits(progressPercent)}٪
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white block">پیشرفت روزانه</span>
              <span className="text-[10px] text-[#3ECF8E] font-medium">
                {progressPercent === 100 && totalTodayCount > 0 ? 'عالی! تمام اهداف انجام شد 🎉' : 'ادامه بده تا تسلط کامل!'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Habit Strip (Daily 1-Click Check-in) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            عادت‌های روزانه و زنجیره استمرار
          </h3>
          <span className="text-[11px] text-[#898989]">ثبت سریع امروز</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {habits.map((habit) => {
            const isCompletedToday = habit.completedDates && habit.completedDates.includes(currentJalali.dateString);
            return (
              <button
                key={habit.id}
                onClick={() => {
                  onToggleHabit(habit.id, currentJalali.dateString);
                  if (!isCompletedToday && soundEffects && playSparkSound) playSparkSound();
                }}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between min-h-[90px] relative overflow-hidden group ${
                  isCompletedToday
                    ? 'bg-gradient-to-br from-[#005936]/40 to-[#121212] border-[#3ECF8E]/60 shadow-sm'
                    : 'bg-[#141414] border-[#2E2E2E] hover:border-[#3ECF8E]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{habit.icon}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isCompletedToday ? 'bg-[#3ECF8E] border-[#3ECF8E] text-black' : 'border-[#4A4A4A]'
                  }`}>
                    {isCompletedToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white truncate group-hover:text-[#3ECF8E] transition-colors">
                    {habit.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-orange-400 font-mono">
                    <Flame className="w-3 h-3 fill-orange-400" />
                    <span>{toPersianDigits(habit.streak)} روز پیوسته</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Task Adder Input */}
      <form onSubmit={handleQuickAdd} className="relative">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#171717] border border-[#2E2E2E] focus-within:border-[#3ECF8E] focus-within:ring-1 focus-within:ring-[#3ECF8E] transition-all shadow-md">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="افزودن سریع وظیفه برای امروز... (مثال: آماده‌سازی پروپوزال !فوری #کار)"
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

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'همه وظایف' },
            { id: 'urgent', label: 'فوری و مهم ⚡' },
            { id: 'ariamir', label: 'پروژه‌های ARIAMIR 💼' },
            { id: 'pending', label: 'در انتظار' },
            { id: 'completed', label: 'تکمیل شده' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === f.id
                  ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/50'
                  : 'bg-[#171717] text-[#898989] hover:text-white border border-[#242424]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenAi}
          className="text-xs text-[#3ECF8E] hover:underline flex items-center gap-1 font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          پیشنهاد برنامه با AI
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#121212] border border-[#242424] text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#3ECF8E]/40 mx-auto" />
            <p className="text-sm font-bold text-[#FAFAFA]">هیچ وظیفه‌ای در این فیلتر یافت نشد!</p>
            <p className="text-xs text-[#898989]">با دکمه بالا یا دستیار هوش مصنوعی برنامه‌ات را کامل کن.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const categoryObj = categories.find(c => c.id === task.category) || categories[0];
            const isExpanded = expandedTaskId === task.id;
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
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  task.completed
                    ? 'bg-[#121212]/60 border-[#242424] opacity-60'
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

                        {/* Priority Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge.bg}`}>
                          {priorityBadge.text}
                        </span>

                        {/* Category Tag */}
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

                      {/* Meta Footer */}
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
                    
                    {/* Launch Pomodoro for this task */}
                    {!task.completed && (
                      <button
                        onClick={() => onStartPomodoroForTask(task)}
                        className="p-2 rounded-xl bg-[#005936] hover:bg-[#006239] text-[#3ECF8E] border border-[#3ECF8E]/30 transition-all"
                        title="شروع سشن تمرکز عمیق روی این تسک"
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

                {/* Expand Subtasks if any */}
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

      {/* Daily Affirmation / Quote Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#171717] to-[#121212] border border-[#2E2E2E] relative overflow-hidden">
        <Quote className="absolute -bottom-2 -left-2 w-20 h-20 text-white/5 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#3ECF8E] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            جمله و نگرش برنده روز
          </span>
          <button
            onClick={() => setQuoteIndex(prev => prev + 1)}
            className="text-[10px] text-[#898989] hover:text-white px-2 py-0.5 rounded-lg bg-[#242424]"
          >
            جمله بعدی ↻
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
