import React, { useState } from 'react';
import { toPersianDigits, getCurrentJalaliDate, PERSIAN_DAY_NAMES_SHORT } from '../utils/jalali';
import { audioEngine } from '../utils/audioEngine';
import {
  Plus,
  Flame,
  Check,
  X,
  Clock,
  Calendar,
  Sparkles,
  Crown,
  ChevronLeft,
  Trash2,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

const HABIT_COLORS = [
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308'
];

const HABIT_ICONS = ['🧘', '💧', '📚', '🏃‍♂️', '💻', '🌙', '❤️', '🎧', '🎯', '🥗', '💊', '✍️'];

export function HabitMakerView({
  habits,
  onAddHabit,
  onToggleHabitDay,
  onDeleteHabit
}) {
  const [isCreatingHabit, setIsCreatingHabit] = useState(false);
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('بله');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [selectedIcon, setSelectedIcon] = useState('🧘');
  const [reminderTime, setReminderTime] = useState('none');
  const [targetDuration, setTargetDuration] = useState('21');

  const jalali = getCurrentJalaliDate();
  const todayStr = jalali.dateString;

  // Week days label array for 7 days
  const weekDayLabels = ['امروز', 'دیروز', 'ج', 'پ', 'چ', 'س', 'د'];

  const handleToggleDay = (habitId, dayOffset, e) => {
    e?.stopPropagation();
    onToggleHabitDay(habitId, dayOffset);
    audioEngine.playStreakSpark();
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#10b981', '#f59e0b', '#3b82f6']
    });
  };

  const handleSaveHabit = (e) => {
    e?.preventDefault();
    if (!name.trim()) return;

    const newHabit = {
      id: 'h-' + Date.now(),
      name: name.trim(),
      question: question.trim() || 'بله',
      icon: selectedIcon,
      color: selectedColor,
      streak: 1,
      targetDuration: parseInt(targetDuration, 10) || 21,
      reminderTime,
      completedDays: [0], // 0 means today is checked
      completedDates: [todayStr],
      createdAt: Date.now()
    };

    onAddHabit(newHabit);
    audioEngine.playClick();
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setQuestion('بله');
    setSelectedColor('#10b981');
    setSelectedIcon('🧘');
    setReminderTime('none');
    setTargetDuration('21');
    setIsCreatingHabit(false);
  };

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-[#3ECF8E]"></span>
          عادت‌ساز (ردیاب استمرار)
        </h1>
        <button
          onClick={() => setIsCreatingHabit(true)}
          className="text-xs text-black font-bold bg-[#10b981] hover:bg-[#0ea372] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-[#10b981]/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          عادت جدید
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const isDoneToday = habit.completedDates?.includes(todayStr) || (habit.completedDays && habit.completedDays.includes(0));
          return (
            <div
              key={habit.id}
              className="bg-[#191a1e] border border-[#272a31] rounded-3xl p-4.5 space-y-3.5 shadow-md"
            >
              {/* Card Top: Icon, Name, Streak Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md"
                    style={{ backgroundColor: `${habit.color || '#10b981'}20`, border: `1.5px solid ${habit.color || '#10b981'}` }}
                  >
                    {habit.icon || '🧘'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {habit.name}
                    </h3>
                    <p className="text-[11px] text-[#8b929e]">
                      طول دوره: {toPersianDigits(habit.targetDuration || habit.bestStreak || 21)} روز
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#22242b] border border-[#2e323b] px-3 py-1.5 rounded-2xl">
                  <Flame className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                  <span className="text-xs font-bold text-white">
                    {toPersianDigits(habit.streak || 1)} روز
                  </span>
                </div>
              </div>

              {/* Card Bottom: 7 Squircle Check-in Boxes (Matching Lemoni scene_009.jpg) */}
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {weekDayLabels.map((label, idx) => {
                  const isChecked = habit.completedDays ? habit.completedDays.includes(idx) : (idx === 0 && isDoneToday);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-[#8b929e] font-medium">
                        {label}
                      </span>
                      <button
                        onClick={(e) => handleToggleDay(habit.id, idx, e)}
                        className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#10b981] border-[#10b981] text-black shadow-md shadow-[#10b981]/30 scale-102'
                            : 'bg-[#202227] border-[#2d313a] hover:border-[#10b981]/50 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* CREATE HABIT MODAL (Matching Lemoni tools_007.jpg) */}
      {/* ========================================================================= */}
      {isCreatingHabit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl border-t border-[#2d3139] p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3ECF8E]"></span>
                ایجاد عادت
              </h2>
              <button
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title Input with (x) clear */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">عنوان</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مدیتیشن، ورزش، مطالعه..."
                  autoFocus
                  className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl px-4 py-3 text-sm text-white placeholder-[#6b7280] outline-none transition-all pl-10"
                />
                {name && (
                  <button
                    type="button"
                    onClick={() => setName('')}
                    className="absolute left-3 top-3.5 text-[#6b7280] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Question Input */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">سوال ثبت روزانه؟</label>
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="آیا امروز این کار را انجام دادی؟"
                  className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl px-4 py-3 text-sm text-white placeholder-[#6b7280] outline-none transition-all pl-10"
                />
                {question && (
                  <button
                    type="button"
                    onClick={() => setQuestion('')}
                    className="absolute left-3 top-3.5 text-[#6b7280] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Colors with VIP Crowns */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">رنگ اختصاصی:</label>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {HABIT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`relative w-9 h-9 rounded-xl transition-all shrink-0 ${
                      selectedColor === c ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    <Crown className="w-2.5 h-2.5 absolute -bottom-1 -left-1 text-[#f59e0b] fill-[#f59e0b]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">آیکون:</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {HABIT_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setSelectedIcon(ic)}
                    className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center transition-all shrink-0 ${
                      selectedIcon === ic
                        ? 'bg-[#3ECF8E]/20 border-2 border-[#3ECF8E] scale-105'
                        : 'bg-[#202227] border border-[#2d313a]'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Reminder Time */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">زمان یادآوری:</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'none', label: 'بدون یادآوری' },
                  { id: '8am', label: '۸ صبح' },
                  { id: '10am', label: '۱۰ صبح' },
                  { id: 'custom', label: '⏱️ زمان دلخواه' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setReminderTime(r.id)}
                    className={`px-3.5 py-2 rounded-xl font-medium shrink-0 transition-all ${
                      reminderTime === r.id
                        ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
                        : 'bg-[#202227] text-[#9ca3af] border border-[#2d313a]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Duration */}
            <div>
              <div className="flex items-center gap-1 text-xs text-[#9ca3af] mb-1.5">
                <span>طول دوره استمرار</span>
                <Info className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: '21', label: '۲۱ روز' },
                  { id: '30', label: '۳۰ روز' },
                  { id: '40', label: '۴۰ روز' },
                  { id: 'custom', label: 'طول دوره دلخواه' }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setTargetDuration(d.id)}
                    className={`px-3.5 py-2 rounded-xl font-medium shrink-0 transition-all ${
                      targetDuration === d.id
                        ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
                        : 'bg-[#202227] text-[#9ca3af] border border-[#2d313a]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Submit Button */}
            <div className="pt-3 border-t border-[#252830]">
              <button
                type="button"
                onClick={handleSaveHabit}
                disabled={!name.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] disabled:opacity-40 text-black font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-[#10b981]/25"
              >
                ذخیره عادت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
