import React, { useState, useEffect } from 'react';
import { toPersianDigits } from '../utils/jalali';
import { audioEngine } from '../utils/audioEngine';
import {
  Play,
  Pause,
  RotateCcw,
  Music,
  HelpCircle,
  X,
  Check,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MUSIC_OPTIONS = [
  { id: 'none', title: 'بدون موزیک', isVip: false },
  { id: 'gentle', title: 'ملایم', isVip: false },
  { id: 'positive', title: 'مثبت اندیشی', isVip: true },
  { id: 'flute', title: 'فلوت شرقی', isVip: true },
  { id: 'peace', title: 'آرامش ذهن', isVip: true },
  { id: 'waves', title: 'موج', isVip: true },
  { id: 'sea', title: 'دریا', isVip: true },
  { id: 'rain', title: 'باران', isVip: true },
  { id: 'forest', title: 'جنگل', isVip: true }
];

export function PomodoroView({ onRewardXp }) {
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState('none');
  const [showMusicSheet, setShowMusicSheet] = useState(false);
  const [showGuideSheet, setShowGuideSheet] = useState(false);

  const totalTime = mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      audioEngine.playPomodoroFinished();
      audioEngine.stopAll();
      if (mode === 'focus') {
        onRewardXp?.(50);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6']
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, onRewardXp]);

  const handleModeChange = (newMode) => {
    audioEngine.playClick();
    setMode(newMode);
    setIsRunning(false);
    audioEngine.stopAll();
    if (newMode === 'focus') setTimeLeft(25 * 60);
    else if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    else if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const handleTogglePlay = () => {
    audioEngine.playClick();
    if (!isRunning) {
      setIsRunning(true);
      if (selectedMusic !== 'none') {
        audioEngine.playPomodoroMusic(selectedMusic, 0.6);
      }
    } else {
      setIsRunning(false);
      audioEngine.stopAll();
    }
  };

  const handleReset = () => {
    audioEngine.playClick();
    setIsRunning(false);
    audioEngine.stopAll();
    setTimeLeft(totalTime);
  };

  const handleSelectMusic = (musicId) => {
    audioEngine.playClick();
    setSelectedMusic(musicId);
    setShowMusicSheet(false);
    if (isRunning) {
      audioEngine.playPomodoroMusic(musicId, 0.6);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const padM = String(mins).padStart(2, '0');
    const padS = String(secs).padStart(2, '0');
    return `${toPersianDigits(padM)}:${toPersianDigits(padS)}`;
  };

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-6 select-none">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-white">پومودورو</h1>
      </div>

      {/* 3 Mode Switcher Pills (Matching Lemoni tools_022.jpg) */}
      <div className="grid grid-cols-3 gap-2 bg-[#191a1e] p-1.5 rounded-2xl border border-[#272a31]">
        <button
          onClick={() => handleModeChange('longBreak')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'longBreak'
              ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/25'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          استراحت طولانی
        </button>

        <button
          onClick={() => handleModeChange('shortBreak')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'shortBreak'
              ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/25'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          استراحت کوتاه
        </button>

        <button
          onClick={() => handleModeChange('focus')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'focus'
              ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/25'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          فعالیت متمرکز
        </button>
      </div>

      {/* Glowing Circular Timer Ring */}
      <div className="relative flex items-center justify-center py-6">
        <svg className="w-64 h-64 -rotate-90 transform" viewBox="0 0 260 260">
          <circle
            cx="130"
            cy="130"
            r="115"
            stroke="#1c1f24"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="130"
            cy="130"
            r="115"
            stroke="#10b981"
            strokeWidth="12"
            strokeDasharray="722"
            strokeDashoffset={722 - (722 * (totalTime - timeLeft)) / totalTime}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-linear"
          />
        </svg>

        {/* Digital Time */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-white tracking-wider font-mono">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-[#3ECF8E] font-medium mt-1">
            {mode === 'focus' ? 'تمرکز عمیق' : 'استراحت'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-2xl bg-[#1c1e22] border border-[#2a2d33] flex items-center justify-center text-[#9ca3af] hover:text-white active:scale-95 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Play/Pause */}
        <button
          onClick={handleTogglePlay}
          className="w-16 h-16 rounded-full bg-[#10b981] hover:bg-[#0ea372] active:scale-95 text-black flex items-center justify-center shadow-lg shadow-[#10b981]/30 transition-all cursor-pointer"
        >
          {isRunning ? (
            <Pause className="w-7 h-7 fill-current stroke-[2.5]" />
          ) : (
            <Play className="w-7 h-7 fill-current stroke-[2.5] ml-1" />
          )}
        </button>

        {/* Music Picker */}
        <button
          onClick={() => setShowMusicSheet(true)}
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center active:scale-95 transition-all ${
            selectedMusic !== 'none'
              ? 'bg-[#192b22] border-[#3ECF8E] text-[#3ECF8E]'
              : 'bg-[#1c1e22] border-[#2a2d33] text-[#9ca3af] hover:text-white'
          }`}
        >
          <Music className="w-5 h-5" />
        </button>
      </div>

      {/* Guide Link */}
      <div className="pt-2 text-center">
        <button
          onClick={() => setShowGuideSheet(true)}
          className="inline-flex items-center gap-1.5 text-xs text-[#8b929e] hover:text-[#3ECF8E] transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>راهنما پومودورو</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* POMODORO GUIDE BOTTOM SHEET (Matching Lemoni scene_012.jpg) */}
      {/* ========================================================================= */}
      {showGuideSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl border-t border-[#2d3139] p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="space-y-3 text-xs sm:text-sm text-[#e5e7eb] leading-relaxed">
              <p className="font-bold text-white text-base">
                زمانی که با کار بزرگی روبرو شدی، اون رو به اهداف کوچیک و کوتاه مدت با زمان محدود تقسیم‌بندی کن.
              </p>
              <p className="text-[#9ca3af]">
                این کار به ذهنت کمک می‌کنه تا روی هدف مشخصی متمرکز بشه و با جلوگیری از پرش ذهنی، باعث افزایش بازدهی و کاراییت میشه. تکنیک پومودورو بر همین اساس بنا شده.
              </p>

              <div className="pt-2 space-y-2 text-[#d1d5db]">
                <p className="font-bold text-white">برای انجام این تکنیک مراحل زیر رو اجرا کن:</p>
                <p>• یک تسک مشخص کن.</p>
                <p>• ۲۵ دقیقه زمان برای انجام اون در نظر بگیر.</p>
                <p>• به ازای هر ۲۵ دقیقه تمرکز و فعالیت، ۵ دقیقه استراحت کن.</p>
                <p>• بعد از ۴ مرتبه دوره‌ی (۵-۲۵) دقیقه‌ای، یک استراحت طولانی مدت ۲۰ دقیقه‌ای به خودت بده.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#252830]">
              <button
                onClick={() => setShowGuideSheet(false)}
                className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-bold text-sm transition-all shadow-lg shadow-[#10b981]/25"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MUSIC PICKER BOTTOM SHEET (Matching Lemoni tools_026.jpg) */}
      {/* ========================================================================= */}
      {showMusicSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl border-t border-[#2d3139] p-5 space-y-3 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
              <h3 className="text-sm font-bold text-white">موزیک همراه پومودورو</h3>
              <button
                onClick={() => setShowMusicSheet(false)}
                className="w-7 h-7 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {MUSIC_OPTIONS.map((opt) => {
                const isSelected = selectedMusic === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectMusic(opt.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#192b22] border-[#3ECF8E] text-[#3ECF8E]'
                        : 'bg-[#202227] border-[#2d313a] hover:bg-[#252830] text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.isVip && (
                        <Crown className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                      )}
                      <span className="text-xs font-medium">{opt.title}</span>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 stroke-[3] text-[#3ECF8E]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
