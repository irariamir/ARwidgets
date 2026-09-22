import React, { useState } from 'react';
import { 
  TrendingUp, 
  Smile, 
  Flame, 
  Plus, 
  Check, 
  Calendar as CalendarIcon, 
  Heart, 
  BatteryCharging, 
  BookOpen, 
  Sparkles, 
  Trash2,
  Share2,
  Tag,
  Zap,
  Activity
} from 'lucide-react';
import { 
  getCurrentJalaliDate, 
  toPersianDigits, 
  PERSIAN_DAY_NAMES_SHORT 
} from '../utils/jalali';
import confetti from 'canvas-confetti';

export function HabitsMoodView({ 
  habits = [], 
  moodLogs = [], 
  onToggleHabit, 
  onAddHabit, 
  onDeleteHabit, 
  onSaveMoodLog,
  soundEffects,
  playSparkSound
}) {
  const currentJalali = getCurrentJalaliDate();
  const [activeTab, setActiveTab] = useState('habits'); // 'habits' | 'mood'
  
  // New Habit Modal State
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('⚡');
  const [habitCategory, setHabitCategory] = useState('ariamir');
  const [habitColor, setHabitColor] = useState('#3ECF8E');

  // Mood Form State
  const [selectedMood, setSelectedMood] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(8);
  const [selectedFactors, setSelectedFactors] = useState(['کار و پروژه‌ها', 'تمرکز عمیق']);
  const [journalNote, setJournalNote] = useState('');
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const moodLevels = [
    { level: 5, label: 'فوق‌العاده', emoji: '🤩', color: '#3ECF8E' },
    { level: 4, label: 'خوب و آرام', emoji: '😊', color: '#72E3AD' },
    { level: 3, label: 'معمولی', emoji: '😐', color: '#79C0FF' },
    { level: 2, label: 'خسته یا کم‌انرژی', emoji: '🥱', color: '#DA8D00' },
    { level: 1, label: 'پراسترس یا کلافه', emoji: '😣', color: '#E54D2D' }
  ];

  const availableFactors = [
    'کار و پروژه‌ها', 'تمرکز عمیق', 'ورزش و تمرین', 'خواب کافی',
    'تغذیه سالم', 'ارتباطات کاری', 'مطالعه و یادگیری', 'تفریح و استراحت',
    'قهوه و چای', 'موسیقی و آرامش'
  ];

  const handleToggleFactor = (factor) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const handleSaveMood = (e) => {
    e.preventDefault();
    const newLog = {
      id: 'm-' + Date.now(),
      date: currentJalali.dateString,
      mood: selectedMood,
      energy: energyLevel,
      factors: selectedFactors,
      note: journalNote,
      gratitude: gratitudeNote
    };
    onSaveMoodLog(newLog);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    const newHabit = {
      id: 'h-' + Date.now(),
      name: habitName.trim(),
      category: habitCategory,
      icon: habitIcon,
      streak: 0,
      bestStreak: 0,
      targetDays: [0, 1, 2, 3, 4, 5, 6],
      completedDates: [],
      color: habitColor,
      timeOfDay: 'anytime'
    };

    onAddHabit(newHabit);
    setHabitName('');
    setShowHabitModal(false);
  };

  return (
    <div className="space-y-6 pb-24 text-right animate-in fade-in duration-300">
      
      {/* Header & Sub-Tab Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-black text-2xl text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#3ECF8E]" />
            عادت‌ها و ردیاب حال‌و‌هوا (Mood)
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">مدیریت استمرار روزانه، ثبت انرژی روانی و دفترچه شکرگزاری</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#171717] rounded-2xl border border-[#2E2E2E]">
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'habits'
                ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/40'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
            ردیاب عادات ({toPersianDigits(habits.length)})
          </button>
          
          <button
            onClick={() => setActiveTab('mood')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mood'
                ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/40'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            <Smile className="w-4 h-4 text-[#3ECF8E]" />
            ردیاب مود و ژورنال
          </button>
        </div>
      </div>

      {activeTab === 'habits' ? (
        /* Habits Tracker View */
        <div className="space-y-4">
          
          {/* Top Bar for Habits */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#898989]">
                استمرار در هفته جاری ({currentJalali.monthName} {toPersianDigits(currentJalali.year)})
              </span>
            </div>

            <button
              onClick={() => setShowHabitModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#005936] hover:bg-[#006239] text-[#3ECF8E] border border-[#3ECF8E]/30 text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>تعریف عادت جدید</span>
            </button>
          </div>

          {/* Habits Card List */}
          <div className="space-y-3">
            {habits.map((habit) => {
              const isCompletedToday = habit.completedDates && habit.completedDates.includes(currentJalali.dateString);

              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-3xl border transition-all ${
                    isCompletedToday 
                      ? 'bg-[#121212] border-[#3ECF8E]/40 shadow-sm' 
                      : 'bg-[#141414] border-[#2E2E2E]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Habit Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                        style={{ backgroundColor: `${habit.color}15`, border: `1px solid ${habit.color}30` }}
                      >
                        {habit.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-white truncate">{habit.name}</h4>
                          <span className="flex items-center gap-1 text-[11px] text-orange-400 font-mono font-bold">
                            <Flame className="w-3.5 h-3.5 fill-orange-400" />
                            {toPersianDigits(habit.streak)} روز
                          </span>
                        </div>
                        <p className="text-[11px] text-[#898989] mt-0.5">
                          بهترین رکورد: {toPersianDigits(habit.bestStreak || habit.streak)} روز پیوسته
                        </p>
                      </div>
                    </div>

                    {/* Weekly Checkboxes (Sat to Fri) */}
                    <div className="flex items-center gap-1.5 self-center sm:self-auto">
                      {PERSIAN_DAY_NAMES_SHORT.map((dayLabel, dayIdx) => {
                        const isCurrentDay = dayIdx === currentJalali.dayOfWeek;
                        const isDone = isCurrentDay ? isCompletedToday : (dayIdx < currentJalali.dayOfWeek);

                        return (
                          <div key={dayIdx} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-[#898989] font-mono">{dayLabel}</span>
                            <button
                              onClick={() => {
                                if (isCurrentDay) {
                                  onToggleHabit(habit.id, currentJalali.dateString);
                                  if (!isCompletedToday && soundEffects && playSparkSound) playSparkSound();
                                }
                              }}
                              disabled={!isCurrentDay}
                              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-[#3ECF8E] text-black font-bold shadow-md shadow-[#3ECF8E]/20'
                                  : isCurrentDay
                                  ? 'bg-[#1C1C1C] text-[#898989] hover:border-[#3ECF8E] border border-[#393939]'
                                  : 'bg-[#141414] text-[#4A4A4A] border border-[#242424] opacity-50'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          </div>
                        );
                      })}

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        className="p-2 ml-1 text-[#525252] hover:text-[#E54D2D] transition-colors"
                        title="حذف عادت"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Mood Tracker & Micro Journal View */
        <div className="space-y-6">
          
          <form onSubmit={handleSaveMood} className="space-y-6 bg-[#121212] border border-[#2E2E2E] rounded-3xl p-6 shadow-xl">
            
            {/* Step 1: Mood Face Selector */}
            <div>
              <label className="block text-xs font-bold text-white mb-3">
                ۱. امروز چه حس و حالی داری؟ (احساس کلی شما)
              </label>
              
              <div className="grid grid-cols-5 gap-2">
                {moodLevels.map((m) => (
                  <button
                    type="button"
                    key={m.level}
                    onClick={() => setSelectedMood(m.level)}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedMood === m.level
                        ? 'bg-[#1C1C1C] border-[#3ECF8E] shadow-lg shadow-[#3ECF8E]/20 scale-105'
                        : 'bg-[#171717] border-[#242424] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-3xl">{m.emoji}</span>
                    <span className={`text-[11px] font-bold ${selectedMood === m.level ? 'text-[#3ECF8E]' : 'text-[#898989]'}`}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Energy Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BatteryCharging className="w-4 h-4 text-[#3ECF8E]" />
                  ۲. سطح انرژی بدنی و ذهنی شما (۱ تا ۱۰)
                </label>
                <span className="font-mono font-bold text-sm text-[#3ECF8E]">
                  {toPersianDigits(energyLevel)} از ۱۰
                </span>
              </div>
              
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full h-2 bg-[#242424] rounded-lg appearance-none cursor-pointer accent-[#3ECF8E]"
              />
            </div>

            {/* Step 3: Influencing Factors */}
            <div>
              <label className="block text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#7965FF]" />
                ۳. چه فاکتورهایی امروز بیشترین اثر را روی حال شما داشتند؟
              </label>

              <div className="flex flex-wrap gap-2">
                {availableFactors.map((factor) => {
                  const isSelected = selectedFactors.includes(factor);
                  return (
                    <button
                      type="button"
                      key={factor}
                      onClick={() => handleToggleFactor(factor)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-[#005936] text-[#3ECF8E] border-[#3ECF8E]'
                          : 'bg-[#171717] text-[#898989] border-[#2E2E2E] hover:text-white'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{factor}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Gratitude & Reflection Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#E54D2D]" />
                  شکرگزاری امروز (۳ مورد که بابتش شکرگزاری)
                </label>
                <textarea
                  rows={3}
                  value={gratitudeNote}
                  onChange={(e) => setGratitudeNote(e.target.value)}
                  placeholder="مثال: سلامتی، فرصت رشد در ARIAMIR، دوستان خوب..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] text-white text-xs outline-none resize-none placeholder:text-[#525252]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#79C0FF]" />
                  یادداشت و وقایع‌نگاری روزانه (Micro-Journal)
                </label>
                <textarea
                  rows={3}
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="درس مهم امروز، احساسات یا تصمیمات جدید..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] text-white text-xs outline-none resize-none placeholder:text-[#525252]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-[#242424]">
              {savedSuccess ? (
                <span className="text-xs text-[#3ECF8E] font-bold">✅ حال‌و‌هوای امروز با موفقیت ثبت شد!</span>
              ) : (
                <span className="text-[11px] text-[#898989]">ثبت روزانه باعث تحلیل روانشناختی بهتر می‌شود.</span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#005936] to-[#00C472] text-black font-bold text-xs shadow-lg shadow-[#3ECF8E]/20 transition-all hover:brightness-110"
              >
                ثبت در دفترچه هوشمند
              </button>
            </div>

          </form>

        </div>
      )}

      {/* Habit Creation Modal */}
      {showHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#121212] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-white">تعریف عادت طلایی جدید</h3>
            
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#898989] mb-1">نام عادت</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ۲۰ دقیقه مطالعه قبل از خواب"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#898989] mb-1">آیکون و ایموجی</label>
                <div className="flex gap-2 flex-wrap">
                  {['💻', '📚', '💧', '🧘', '🏃‍♂️', '🥗', '⚡', '🎯', '🎨', '🔥'].map((ico) => (
                    <button
                      type="button"
                      key={ico}
                      onClick={() => setHabitIcon(ico)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                        habitIcon === ico ? 'bg-[#3ECF8E]/20 border-[#3ECF8E]' : 'bg-[#171717] border-[#2E2E2E]'
                      }`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setShowHabitModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1C1C1C] text-xs font-semibold text-[#898989]"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3ECF8E] text-black font-bold text-xs"
                >
                  افزودن عادت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
