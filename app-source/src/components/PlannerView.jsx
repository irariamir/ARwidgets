import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Flag, 
  Layers, 
  LayoutGrid, 
  ListTodo,
  Check,
  Edit3,
  Trash2,
  Zap
} from 'lucide-react';
import { 
  getCurrentJalaliDate, 
  toPersianDigits, 
  getDaysInJalaliMonth, 
  getFirstDayOfJalaliMonth, 
  PERSIAN_MONTH_NAMES, 
  PERSIAN_DAY_NAMES_SHORT,
  formatJalaliFull
} from '../utils/jalali';

export function PlannerView({ 
  tasks = [], 
  categories = [], 
  onToggleTask, 
  onDeleteTask, 
  onEditTask, 
  onOpenNewTaskModal 
}) {
  const currentJalali = getCurrentJalaliDate();
  
  const [selectedYear, setSelectedYear] = useState(currentJalali.year);
  const [selectedMonth, setSelectedMonth] = useState(currentJalali.month);
  const [selectedDay, setSelectedDay] = useState(currentJalali.day);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'matrix'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const selectedDateStr = `${selectedYear}/${String(selectedMonth).padStart(2, '0')}/${String(selectedDay).padStart(2, '0')}`;

  // Month navigation
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(12);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleJumpToToday = () => {
    setSelectedYear(currentJalali.year);
    setSelectedMonth(currentJalali.month);
    setSelectedDay(currentJalali.day);
  };

  // Calendar calculations
  const totalDays = getDaysInJalaliMonth(selectedYear, selectedMonth);
  const firstDayOfWeek = getFirstDayOfJalaliMonth(selectedYear, selectedMonth);

  // Tasks for the selected date
  const tasksForSelectedDate = tasks.filter(t => t.date === selectedDateStr);

  // Filter tasks by category
  const filteredTasksForDate = tasksForSelectedDate.filter(t => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  // Eisenhower Matrix grouping
  const matrixQuadrants = {
    do_first: tasks.filter(t => t.matrixQuadrant === 'do_first' || t.priority === 'urgent'),
    schedule: tasks.filter(t => t.matrixQuadrant === 'schedule' || (t.priority === 'high' && t.matrixQuadrant !== 'do_first')),
    delegate: tasks.filter(t => t.matrixQuadrant === 'delegate'),
    eliminate: tasks.filter(t => t.matrixQuadrant === 'eliminate')
  };

  return (
    <div className="space-y-6 pb-24 text-right animate-in fade-in duration-300">
      
      {/* Header & View Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-black text-2xl text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#3ECF8E]" />
            برنامه‌ریزی و تقویم شمسی
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">مدیریت وظایف روزانه، ماهانه و ماتریس تصمیم‌گیری آیزنهاور</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#171717] rounded-2xl border border-[#2E2E2E]">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/40'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            تقویم و روزها
          </button>
          
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'matrix'
                ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/40'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            ماتریس آیزنهاور
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Top: Interactive Calendar Grid */}
          <div className="lg:col-span-7 bg-[#121212] border border-[#2E2E2E] rounded-3xl p-5 shadow-xl">
            
            {/* Calendar Controls */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#242424]">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg text-white">
                  {PERSIAN_MONTH_NAMES[selectedMonth - 1]} {toPersianDigits(selectedYear)}
                </span>
                <button
                  onClick={handleJumpToToday}
                  className="px-2.5 py-1 rounded-lg bg-[#1C1C1C] hover:bg-[#242424] text-[#3ECF8E] border border-[#3ECF8E]/30 text-[10px] font-bold"
                >
                  امروز
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-xl bg-[#171717] hover:bg-[#242424] text-[#B4B4B4] hover:text-white flex items-center justify-center border border-[#2E2E2E] transition-all"
                  title="ماه قبل"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-xl bg-[#171717] hover:bg-[#242424] text-[#B4B4B4] hover:text-white flex items-center justify-center border border-[#2E2E2E] transition-all"
                  title="ماه بعد"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {PERSIAN_DAY_NAMES_SHORT.map((dayName, idx) => (
                <span 
                  key={idx} 
                  className={`text-xs font-bold py-1.5 ${idx === 6 ? 'text-[#E54D2D]' : 'text-[#898989]'}`}
                >
                  {dayName}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading offset cells */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-12 rounded-xl bg-transparent" />
              ))}

              {/* Day cells */}
              {Array.from({ length: totalDays }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${selectedYear}/${String(selectedMonth).padStart(2, '0')}/${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDay === dayNum;
                const isToday = currentJalali.dateString === dateStr;
                
                // Check tasks for this date
                const dayTasks = tasks.filter(t => t.date === dateStr);
                const hasCompleted = dayTasks.some(t => t.completed);
                const hasPending = dayTasks.some(t => !t.completed);
                const hasUrgent = dayTasks.some(t => t.priority === 'urgent');

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`h-12 rounded-2xl flex flex-col items-center justify-center relative transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#3ECF8E] text-black font-black shadow-lg shadow-[#3ECF8E]/30 scale-105 z-10'
                        : isToday
                        ? 'bg-[#005936]/40 text-[#3ECF8E] border-2 border-[#3ECF8E]'
                        : 'bg-[#171717] text-[#FAFAFA] hover:bg-[#242424] border border-[#242424]'
                    }`}
                  >
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-black' : ''}`}>
                      {toPersianDigits(dayNum)}
                    </span>

                    {/* Task status indicators */}
                    {dayTasks.length > 0 && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {hasUrgent ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E54D2D]" />
                        ) : hasPending ? (
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-amber-400'}`} />
                        ) : hasCompleted ? (
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-[#3ECF8E]'}`} />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="mt-4 pt-3 border-t border-[#242424] flex items-center justify-between text-[10px] text-[#898989] flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3ECF8E]" /> انجام شده
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> در جریان
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E54D2D]" /> اولویت فوری
              </span>
              <span className="flex items-center gap-1.5 font-bold text-[#3ECF8E]">
                مبنا: تقویم رسمی شمسی
              </span>
            </div>

          </div>

          {/* Right / Bottom: Selected Day Task Agenda Drawer */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#2E2E2E] rounded-3xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <div>
                <span className="text-[10px] text-[#3ECF8E] font-bold block">برنامه روز انتخاب شده</span>
                <h3 className="font-heading font-black text-base text-white">
                  {formatJalaliFull(selectedDateStr)}
                </h3>
              </div>
              <button
                onClick={onOpenNewTaskModal}
                className="p-2 rounded-xl bg-[#005936] hover:bg-[#006239] text-[#3ECF8E] border border-[#3ECF8E]/30 flex items-center gap-1 text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>تسک جدید</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#2E2E2E] text-white'
                    : 'bg-[#171717] text-[#898989]'
                }`}
              >
                همه
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white/10 text-white border'
                      : 'bg-[#171717] text-[#898989]'
                  }`}
                  style={{
                    borderColor: selectedCategory === cat.id ? cat.color : 'transparent'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Day Task Items */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredTasksForDate.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#171717] border border-[#242424] text-center">
                  <ListTodo className="w-8 h-8 text-[#525252] mx-auto mb-2" />
                  <p className="text-xs text-[#FAFAFA] font-bold">هیچ برنامه‌ای برای این روز ثبت نشده</p>
                  <button
                    onClick={onOpenNewTaskModal}
                    className="mt-3 text-xs text-[#3ECF8E] hover:underline font-semibold"
                  >
                    + اضافه کردن وظیفه
                  </button>
                </div>
              ) : (
                filteredTasksForDate.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all ${
                      task.completed 
                        ? 'bg-[#171717]/50 border-[#242424] opacity-50' 
                        : 'bg-[#171717] border-[#2E2E2E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-all ${
                            task.completed ? 'bg-[#3ECF8E] border-[#3ECF8E] text-black' : 'border-[#4A4A4A]'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold truncate ${task.completed ? 'line-through text-[#898989]' : 'text-white'}`}>
                            {task.title}
                          </h4>
                          {task.time && (
                            <span className="text-[10px] text-[#3ECF8E] font-mono block mt-0.5">
                              {task.time}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1.5 rounded-lg text-[#898989] hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-[#898989] hover:text-[#E54D2D]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      ) : (
        /* Eisenhower Decision Matrix View */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#005936]/20 border border-[#3ECF8E]/30 text-xs text-[#FAFAFA] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#3ECF8E] shrink-0" />
            <span>
              <strong>ماتریس آیزنهاور (Eisenhower Matrix):</strong> تفکیک وظایف بر مبنای ضرورت و اهمیت برای رسیدن به بالاترین نرخ راندمان کاری.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Q1: Do First (فوری و مهم) */}
            <div className="p-4 rounded-3xl bg-[#121212] border-2 border-[#E54D2D]/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E54D2D]" />
                  <h3 className="font-heading font-black text-sm text-white">۱. فوراً انجام دهید (فوری و مهم)</h3>
                </div>
                <span className="font-mono text-xs text-[#E54D2D] font-bold">
                  {toPersianDigits(matrixQuadrants.do_first.length)} مورد
                </span>
              </div>
              <p className="text-[11px] text-[#898989]">بحران‌ها، ددلاین‌های نزدیک و کارهای حیاتی ARIAMIR</p>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {matrixQuadrants.do_first.map(task => (
                  <div key={task.id} className="p-2.5 rounded-xl bg-[#171717] border border-[#2E2E2E] flex items-center justify-between">
                    <span className="text-xs text-white truncate">{task.title}</span>
                    <button onClick={() => onToggleTask(task.id)} className="text-[#3ECF8E] text-[11px] font-bold">
                      {task.completed ? '✓ تیک خورد' : 'تیک بزن'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Q2: Schedule (مهم ولی غیرفوری) */}
            <div className="p-4 rounded-3xl bg-[#121212] border-2 border-[#3ECF8E]/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#3ECF8E]" />
                  <h3 className="font-heading font-black text-sm text-white">۲. برنامه‌ریزی کنید (مهم، غیرفوری)</h3>
                </div>
                <span className="font-mono text-xs text-[#3ECF8E] font-bold">
                  {toPersianDigits(matrixQuadrants.schedule.length)} مورد
                </span>
              </div>
              <p className="text-[11px] text-[#898989]">رشد فردی، ورزش، یادگیری و برنامه‌ریزی بلندمدت</p>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {matrixQuadrants.schedule.map(task => (
                  <div key={task.id} className="p-2.5 rounded-xl bg-[#171717] border border-[#2E2E2E] flex items-center justify-between">
                    <span className="text-xs text-white truncate">{task.title}</span>
                    <button onClick={() => onToggleTask(task.id)} className="text-[#3ECF8E] text-[11px] font-bold">
                      {task.completed ? '✓ تیک خورد' : 'تیک بزن'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Q3: Delegate (فوری، غیرمهم) */}
            <div className="p-4 rounded-3xl bg-[#121212] border-2 border-[#DA8D00]/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#DA8D00]" />
                  <h3 className="font-heading font-black text-sm text-white">۳. واگذار کنید (فوری، غیرمهم)</h3>
                </div>
                <span className="font-mono text-xs text-[#DA8D00] font-bold">
                  {toPersianDigits(matrixQuadrants.delegate.length)} مورد
                </span>
              </div>
              <p className="text-[11px] text-[#898989]">وقفه‌ها، تماس‌ها و کارهایی که دیگران می‌توانند انجام دهند</p>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {matrixQuadrants.delegate.length === 0 ? (
                  <p className="text-[11px] text-[#525252] text-center py-4">موردی ثبت نشده</p>
                ) : (
                  matrixQuadrants.delegate.map(task => (
                    <div key={task.id} className="p-2.5 rounded-xl bg-[#171717] border border-[#2E2E2E] flex items-center justify-between">
                      <span className="text-xs text-white truncate">{task.title}</span>
                      <button onClick={() => onToggleTask(task.id)} className="text-[#3ECF8E] text-[11px] font-bold">
                        {task.completed ? '✓ تیک خورد' : 'تیک بزن'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Q4: Eliminate (نه فوری، نه مهم) */}
            <div className="p-4 rounded-3xl bg-[#121212] border-2 border-[#7965FF]/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#7965FF]" />
                  <h3 className="font-heading font-black text-sm text-white">۴. حذف کنید (نه مهم، نه فوری)</h3>
                </div>
                <span className="font-mono text-xs text-[#7965FF] font-bold">
                  {toPersianDigits(matrixQuadrants.eliminate.length)} مورد
                </span>
              </div>
              <p className="text-[11px] text-[#898989]">اتلاف وقت‌ها و وب‌گردی‌های بی‌هدف</p>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {matrixQuadrants.eliminate.length === 0 ? (
                  <p className="text-[11px] text-[#525252] text-center py-4">موردی ثبت نشده</p>
                ) : (
                  matrixQuadrants.eliminate.map(task => (
                    <div key={task.id} className="p-2.5 rounded-xl bg-[#171717] border border-[#2E2E2E] flex items-center justify-between">
                      <span className="text-xs text-white truncate">{task.title}</span>
                      <button onClick={() => onToggleTask(task.id)} className="text-[#3ECF8E] text-[11px] font-bold">
                        {task.completed ? '✓ تیک خورد' : 'تیک بزن'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
