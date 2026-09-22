import React from 'react';
import { 
  X, 
  Trophy, 
  Zap, 
  Flame, 
  Clock, 
  CheckCircle, 
  Award, 
  TrendingUp, 
  Crown,
  Sparkles
} from 'lucide-react';
import { toPersianDigits } from '../utils/jalali';
import { BADGES_LIST } from '../data/seedData';

export function AnalyticsModal({ isOpen, onClose, userStats, tasks, habits }) {
  if (!isOpen) return null;

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalFocusHours = (userStats.totalFocusMinutes / 60).toFixed(1);
  const xp = userStats.xp || 1420;
  const level = userStats.level || 4;
  const xpCurrentLevel = xp % 500;
  const xpPercent = Math.min(100, Math.round((xpCurrentLevel / 500) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8 bg-[#121212] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E2E2E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#005936] flex items-center justify-center text-[#3ECF8E]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">آمار عملکرد و رتبه کاربری</h3>
              <p className="text-[11px] text-[#898989]">گیمیفیکیشن و پیشرفت فردی در سامانه ARIAMIR</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1C1C1C] hover:bg-[#242424] text-[#898989] hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level & XP Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#171717] to-[#0D0D0D] border border-[#3ECF8E]/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#005936] to-[#3ECF8E] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#3ECF8E]/30">
                {toPersianDigits(level)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-base text-white">استاد برنامه‌ریزی ARIAMIR</span>
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-xs text-[#898989]">
                  {toPersianDigits(500 - xpCurrentLevel)} XP مانده تا ارتقا به سطح {toPersianDigits(level + 1)}
                </p>
              </div>
            </div>

            <div className="text-left">
              <span className="font-mono text-lg font-bold text-[#3ECF8E]">{toPersianDigits(xp)}</span>
              <span className="text-[10px] text-[#898989] block">امتیاز کل</span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-[#898989] mb-1 font-mono">
              <span>پیشرفت سطح</span>
              <span>{toPersianDigits(xpPercent)}٪</span>
            </div>
            <div className="w-full h-2.5 bg-[#242424] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#006239] via-[#249361] to-[#3ECF8E] rounded-full transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          
          <div className="p-3 rounded-2xl bg-[#171717] border border-[#2E2E2E] flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-[#7965FF]/10 text-[#7965FF] flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-mono text-base font-bold text-white">{toPersianDigits(totalFocusHours)}</span>
            <span className="text-[10px] text-[#898989]">ساعت تمرکز عمیق</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#171717] border border-[#2E2E2E] flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-[#3ECF8E]/10 text-[#3ECF8E] flex items-center justify-center mb-1.5">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="font-mono text-base font-bold text-white">{toPersianDigits(completedTasks)}</span>
            <span className="text-[10px] text-[#898989]">وظیفه تیک خورده</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#171717] border border-[#2E2E2E] flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-[#E54D2D]/10 text-[#E54D2D] flex items-center justify-center mb-1.5">
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-mono text-base font-bold text-white">{toPersianDigits(userStats.currentStreak || 14)}</span>
            <span className="text-[10px] text-[#898989]">روز زنجیره پیوسته</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#171717] border border-[#2E2E2E] flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-[#DA8D00]/10 text-[#DA8D00] flex items-center justify-center mb-1.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-mono text-base font-bold text-white">{toPersianDigits(completionRate)}٪</span>
            <span className="text-[10px] text-[#898989]">نرخ راندمان تسک‌ها</span>
          </div>

        </div>

        {/* Badges Section */}
        <div className="mt-5">
          <h4 className="font-heading font-bold text-sm text-white mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#3ECF8E]" />
            مدال‌ها و دستاوردها (Badges)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {BADGES_LIST.map((b) => (
              <div 
                key={b.id}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  b.unlocked 
                    ? 'bg-[#171717] border-[#3ECF8E]/40 shadow-sm' 
                    : 'bg-[#121212] border-[#242424] opacity-40 grayscale'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#242424] flex items-center justify-center text-xl shrink-0">
                  {b.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-white truncate">{b.title}</h5>
                    {b.unlocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#005936] text-[#3ECF8E] font-semibold shrink-0">
                        فعال
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#898989] mt-0.5 line-clamp-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
