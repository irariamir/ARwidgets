import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Coffee, 
  Zap, 
  Headphones, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { toPersianDigits } from '../utils/jalali';
import { audioEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export function FocusView({ 
  tasks = [], 
  activeTaskId, 
  onSelectActiveTask, 
  onIncrementPomodoro,
  onAddFocusMinutes,
  soundEffects,
  playGongSound
}) {
  const [mode, setMode] = useState('work'); // 'work' | 'shortBreak' | 'longBreak'
  const [workDuration, setWorkDuration] = useState(25); // minutes
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [completedSessionsToday, setCompletedSessionsToday] = useState(4);
  const [totalMinutesFocused, setTotalMinutesFocused] = useState(100);

  // Soundscapes state
  const [soundVolumes, setSoundVolumes] = useState({
    rain: { active: false, volume: 0.5, name: 'باران ملایم', icon: '🌧️' },
    ocean: { active: false, volume: 0.5, name: 'امواج اقیانوس', icon: '🌊' },
    forest: { active: false, volume: 0.5, name: 'جنگل و پرندگان', icon: '🌲' },
    fire: { active: false, volume: 0.5, name: 'شومینه و آتش', icon: '🔥' },
    cafe: { active: false, volume: 0.5, name: 'فضای کافه', icon: '☕' },
    lofi: { active: false, volume: 0.5, name: 'بیت لوفای و پد', icon: '🎵' }
  });

  const totalDurationSeconds = (
    mode === 'work' ? workDuration : mode === 'shortBreak' ? shortBreakDuration : longBreakDuration
  ) * 60;

  // Timer Tick Interval
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  const handleSessionComplete = () => {
    setIsRunning(false);
    if (soundEffects && playGongSound) {
      playGongSound();
    }

    if (mode === 'work') {
      setCompletedSessionsToday((prev) => prev + 1);
      setTotalMinutesFocused((prev) => prev + workDuration);
      if (onAddFocusMinutes) onAddFocusMinutes(workDuration);
      if (activeTaskId && onIncrementPomodoro) onIncrementPomodoro(activeTaskId);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3ECF8E', '#72E3AD', '#00C472', '#ffffff']
      });

      // Switch to break
      setMode('shortBreak');
      setTimeLeft(shortBreakDuration * 60);
    } else {
      // Switch to work
      setMode('work');
      setTimeLeft(workDuration * 60);
    }
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') setTimeLeft(workDuration * 60);
    else if (newMode === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
    else if (newMode === 'longBreak') setTimeLeft(longBreakDuration * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') setTimeLeft(workDuration * 60);
    else if (mode === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
    else if (mode === 'longBreak') setTimeLeft(longBreakDuration * 60);
  };

  // Soundscape toggles
  const toggleSound = (key) => {
    const current = soundVolumes[key];
    const nextState = !current.active;
    setSoundVolumes({
      ...soundVolumes,
      [key]: { ...current, active: nextState }
    });

    if (nextState) {
      if (key === 'rain') audioEngine.startRain(current.volume);
      else if (key === 'ocean') audioEngine.startOcean(current.volume);
      else if (key === 'forest') audioEngine.startForest(current.volume);
      else if (key === 'fire') audioEngine.startFire(current.volume);
      else if (key === 'cafe') audioEngine.startCafe(current.volume);
      else if (key === 'lofi') audioEngine.startLofi(current.volume);
    } else {
      audioEngine.stop(key);
    }
  };

  const handleVolumeChange = (key, val) => {
    const num = parseFloat(val);
    setSoundVolumes({
      ...soundVolumes,
      [key]: { ...soundVolumes[key], volume: num }
    });
    audioEngine.setVolume(key, num);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Progress ratio
  const progressRatio = totalDurationSeconds > 0 ? (totalDurationSeconds - timeLeft) / totalDurationSeconds : 0;
  const strokeDashoffset = 754 - 754 * progressRatio;

  const currentTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className={`space-y-6 pb-24 text-right animate-in fade-in duration-300 ${isZenMode ? 'fixed inset-0 z-50 bg-black p-6 flex flex-col justify-center items-center pb-6' : ''}`}>
      
      {/* Top Bar / Header */}
      {!isZenMode && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-heading font-black text-2xl text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#3ECF8E]" />
              استودیو تمرکز عمیق (Pomodoro Pro)
            </h2>
            <p className="text-xs text-[#898989] mt-0.5">مدیریت زمان با روش پومودورو و ترکیب اصوات آرامش‌بخش نئورونی</p>
          </div>

          {/* Zen Mode Button */}
          <button
            onClick={() => setIsZenMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171717] hover:bg-[#242424] text-[#B4B4B4] hover:text-white border border-[#2E2E2E] text-xs font-semibold transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            حالت تمرکز تمام‌صفحه (Zen)
          </button>
        </div>
      )}

      {/* Main Focus Card */}
      <div className={`relative rounded-3xl bg-[#121212] border border-[#2E2E2E] shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden ${isZenMode ? 'w-full max-w-xl border-[#3ECF8E]/40' : ''}`}>
        
        {/* Zen Mode Exit Button */}
        {isZenMode && (
          <button
            onClick={() => setIsZenMode(false)}
            className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#242424] text-[#898989] hover:text-white transition-all flex items-center gap-1 text-xs"
          >
            <Minimize2 className="w-4 h-4" />
            خروج از تمام‌صفحه
          </button>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#171717] rounded-2xl border border-[#2E2E2E] mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'work'
                ? 'bg-[#3ECF8E] text-black shadow-lg shadow-[#3ECF8E]/30'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            🎯 کار عمیق (۲۵ یا ۵۰ دقیقه)
          </button>
          
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'shortBreak'
                ? 'bg-[#7965FF] text-white shadow-lg shadow-[#7965FF]/30'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            ☕ استراحت کوتاه (۵ دقیقه)
          </button>

          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'longBreak'
                ? 'bg-[#79C0FF] text-black shadow-lg shadow-[#79C0FF]/30'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            🌴 استراحت طولانی (۱۵ دقیقه)
          </button>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
          
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
            {/* Background Track */}
            <circle
              cx="130"
              cy="130"
              r="120"
              className="stroke-[#1C1C1C]"
              strokeWidth="12"
              fill="none"
            />
            
            {/* Progress Stroke */}
            <circle
              cx="130"
              cy="130"
              r="120"
              className={`transition-all duration-1000 ease-linear ${
                mode === 'work' ? 'stroke-[#3ECF8E]' : mode === 'shortBreak' ? 'stroke-[#7965FF]' : 'stroke-[#79C0FF]'
              }`}
              strokeWidth="12"
              strokeDasharray="754"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              style={{
                filter: isRunning ? 'drop-shadow(0 0 12px rgba(62, 207, 142, 0.5))' : 'none'
              }}
            />
          </svg>

          {/* Time & State in Center */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono font-black text-4xl sm:text-5xl text-white tracking-wider">
              {toPersianDigits(timeFormatted)}
            </span>
            <span className={`text-xs font-bold mt-2 px-3 py-0.5 rounded-full ${
              mode === 'work' ? 'bg-[#005936] text-[#3ECF8E]' : 'bg-[#7965FF]/20 text-[#BDA4FF]'
            }`}>
              {isRunning ? 'در حال تمرکز عمیق ⚡' : 'آماده برای شروع'}
            </span>
          </div>

        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-2xl bg-[#171717] hover:bg-[#242424] text-[#898989] hover:text-white border border-[#2E2E2E] flex items-center justify-center transition-all shadow-sm"
            title="شروع مجدد تایمر"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black text-xl shadow-2xl transition-all duration-300 transform active:scale-95 ${
              isRunning
                ? 'bg-[#E54D2D] hover:bg-[#E54D2D]/90 text-white shadow-[#E54D2D]/40'
                : 'bg-[#3ECF8E] hover:bg-[#72E3AD] text-black shadow-[#3ECF8E]/40 hover:scale-105'
            }`}
          >
            {isRunning ? (
              <Pause className="w-8 h-8 fill-white" />
            ) : (
              <Play className="w-8 h-8 fill-black translate-x-0.5" />
            )}
          </button>

          <button
            onClick={handleSessionComplete}
            className="w-12 h-12 rounded-2xl bg-[#171717] hover:bg-[#242424] text-[#898989] hover:text-white border border-[#2E2E2E] flex items-center justify-center transition-all shadow-sm"
            title="رد کردن و رفتن به بخش بعد"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Task Binding Selector */}
        <div className="w-full max-w-md mt-8 pt-6 border-t border-[#242424]">
          <label className="block text-xs font-semibold text-[#898989] mb-2 text-center">
            📌 در حال حاضر روی کدام وظیفه تمرکز دارید؟
          </label>
          <select
            value={activeTaskId || ''}
            onChange={(e) => onSelectActiveTask(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2E2E] text-white text-xs outline-none text-center focus:border-[#3ECF8E]"
          >
            <option value="">-- انتخاب وظیفه فعال --</option>
            {tasks.filter(t => !t.completed).map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({toPersianDigits(t.completedPomodoros || 0)}/{toPersianDigits(t.estimatedPomodoros || 1)} پومودورو)
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Soundscapes Ambient Mixer */}
      {!isZenMode && (
        <div className="rounded-3xl bg-[#121212] border border-[#2E2E2E] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-[#3ECF8E]" />
              <div>
                <h3 className="font-heading font-bold text-sm text-white">میکسر اصوات محیطی آرامش‌بخش (Soundscapes)</h3>
                <p className="text-[11px] text-[#898989]">تولید آنی صوت در فرکانس‌های آلفا و بتا برای افزایش تمرکز</p>
              </div>
            </div>

            <button
              onClick={() => {
                const anyActive = Object.values(soundVolumes).some(s => s.active);
                if (anyActive) {
                  audioEngine.stopAll();
                  const updated = { ...soundVolumes };
                  Object.keys(updated).forEach(k => updated[k].active = false);
                  setSoundVolumes(updated);
                }
              }}
              className="text-xs text-[#898989] hover:text-[#E54D2D] transition-colors"
            >
              خاموش کردن همه
            </button>
          </div>

          {/* Sound Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(soundVolumes).map(([key, item]) => (
              <div
                key={key}
                className={`p-3.5 rounded-2xl border transition-all ${
                  item.active 
                    ? 'bg-[#171717] border-[#3ECF8E]/50 shadow-sm' 
                    : 'bg-[#141414] border-[#242424]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-bold text-white">{item.name}</span>
                  </div>

                  <button
                    onClick={() => toggleSound(key)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      item.active
                        ? 'bg-[#3ECF8E] text-black shadow-md shadow-[#3ECF8E]/20'
                        : 'bg-[#242424] text-[#898989] hover:text-white'
                    }`}
                  >
                    {item.active ? 'روشن' : 'خاموش'}
                  </button>
                </div>

                {/* Volume Slider */}
                {item.active && (
                  <div className="mt-3 flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-[#898989]" />
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={item.volume}
                      onChange={(e) => handleVolumeChange(key, e.target.value)}
                      className="w-full h-1.5 bg-[#242424] rounded-lg appearance-none cursor-pointer accent-[#3ECF8E]"
                    />
                    <span className="text-[10px] font-mono text-[#898989] w-6 text-left">
                      {Math.round(item.volume * 100)}٪
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Focus Daily Stats Summary */}
      {!isZenMode && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#121212] border border-[#2E2E2E] text-center">
            <span className="text-[11px] text-[#898989] block">سشن‌های امروز</span>
            <span className="font-mono text-xl font-bold text-[#3ECF8E] mt-1 block">
              {toPersianDigits(completedSessionsToday)} پومودورو
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-[#2E2E2E] text-center">
            <span className="text-[11px] text-[#898989] block">مدت زمان تمرکز</span>
            <span className="font-mono text-xl font-bold text-white mt-1 block">
              {toPersianDigits(totalMinutesFocused)} دقیقه
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-[#2E2E2E] text-center">
            <span className="text-[11px] text-[#898989] block">کیفیت تمرکز</span>
            <span className="font-mono text-xl font-bold text-amber-400 mt-1 block">
              عالی (۹۵٪)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-[#2E2E2E] text-center">
            <span className="text-[11px] text-[#898989] block">پاداش امتیاز</span>
            <span className="font-mono text-xl font-bold text-[#7965FF] mt-1 block">
              +{toPersianDigits(completedSessionsToday * 25)} XP
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
