import React, { useState } from 'react';
import { toPersianDigits } from '../utils/jalali';
import { audioEngine } from '../utils/audioEngine';
import {
  Music,
  Headphones,
  BookOpen,
  Trophy,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  Flame,
  Globe,
  Quote,
  Crown
} from 'lucide-react';
import { PODCAST_EPISODES } from '../data/seedData';

export function GrowthView({
  onSelectTool,
  onOpenVipModal,
  userStats,
  onRewardXp
}) {
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const [completedMissions, setCompletedMissions] = useState({
    m1: false,
    m2: true,
    m3: false,
    m4: false
  });

  const toggleMission = (id, xp) => {
    const updated = !completedMissions[id];
    setCompletedMissions({ ...completedMissions, [id]: updated });
    if (updated) {
      onRewardXp?.(xp);
      audioEngine.playTaskComplete();
    } else {
      audioEngine.playClick();
    }
  };

  const handlePlayAudio = (id, musicType) => {
    if (playingAudioId === id) {
      audioEngine.stopAll();
      setPlayingAudioId(null);
    } else {
      audioEngine.playPomodoroMusic(musicType || 'lofi', 0.6);
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4 select-none">
      {/* 1. Top Tutorial Banner (Matching Lemoni start_018.jpg) */}
      <div
        onClick={onOpenVipModal}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#fed7aa]/20 via-[#fef08a]/10 to-[#1c1e22] border border-[#fef08a]/20 p-5 cursor-pointer active:scale-98 transition-all shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold text-[#f59e0b] bg-[#f59e0b]/15 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              راهنمای کاربردی
            </span>
            <h2 className="text-base font-bold text-white pt-1">
              آموزش استفاده از تیک‌آر
            </h2>
            <p className="text-xs text-[#d1d5db] leading-relaxed max-w-[220px]">
              چگونه با متد پومودورو، عادت‌ساز و مدیریت زمان به اوج بازدهی برسیم؟
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-[#f59e0b]/30 shrink-0">
            ✓
          </div>
        </div>
      </div>

      {/* 2. Motivational Message Card (Exact text from Lemoni start_018.jpg) */}
      <div className="relative bg-[#191a1e] border border-[#272a31] rounded-3xl p-5 space-y-3 shadow-md">
        <div className="w-9 h-9 rounded-2xl bg-[#3ECF8E]/15 border border-[#3ECF8E]/30 flex items-center justify-center text-[#3ECF8E]">
          <Quote className="w-5 h-5 fill-[#3ECF8E]" />
        </div>

        <div className="space-y-1.5 text-xs sm:text-sm text-[#e5e7eb] leading-relaxed">
          <p className="font-bold text-white">سلام رفیق جان</p>
          <p>این روزها تعیین می‌کنه چند سال دیگه کجایی و چه حالی داری. 😉</p>
          <p>روزهایی که خیلی‌ها غر می‌زنن، تو در مسیر درست باقی بمون! 🤗</p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#9ca3af] bg-[#141518] p-2.5 rounded-2xl border border-[#23262d]">
          <Globe className="w-3.5 h-3.5 text-[#3ECF8E] shrink-0" />
          <span>پایگاه داده آفلاین و سرورهای همگام‌سازی ابری تیک‌آر فعال هستند.</span>
        </div>
      </div>

      {/* 3. 4 Tool Shortcuts (Matching Lemoni: موزیک / پادکست / کتاب صوتی / چالش‌ها) */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={() => onSelectTool('pomodoro_music')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ec4899]/15 border border-[#ec4899]/30 hover:border-[#ec4899] active:scale-95 transition-all text-center space-y-1.5 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#ec4899] text-white flex items-center justify-center shadow-md shadow-[#ec4899]/30">
            <Music className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">موزیک</span>
        </button>

        <button
          onClick={() => onSelectTool('podcasts')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/30 hover:border-[#10b981] active:scale-95 transition-all text-center space-y-1.5 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10b981] text-black flex items-center justify-center shadow-md shadow-[#10b981]/30">
            <Headphones className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">پادکست</span>
        </button>

        <button
          onClick={() => onSelectTool('audiobooks')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 hover:border-[#f59e0b] active:scale-95 transition-all text-center space-y-1.5 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f59e0b] text-black flex items-center justify-center shadow-md shadow-[#f59e0b]/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">کتاب صوتی</span>
        </button>

        <button
          onClick={() => onSelectTool('habits')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f97316]/15 border border-[#f97316]/30 hover:border-[#f97316] active:scale-95 transition-all text-center space-y-1.5 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f97316] text-white flex items-center justify-center shadow-md shadow-[#f97316]/30">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">چالش‌ها</span>
        </button>
      </div>

      {/* 4. ماموریت‌های امروز (Today's Missions) */}
      <section className="bg-[#191a1e] border border-[#272a31] rounded-3xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
            <h3 className="text-sm font-bold text-white">ماموریت‌های امروز</h3>
          </div>
          <span className="text-xs text-[#3ECF8E] font-medium">
            {toPersianDigits(Object.values(completedMissions).filter(Boolean).length)} از ۴
          </span>
        </div>

        <div className="space-y-2">
          {[
            { id: 'm1', title: 'تکمیل ۳ تسک کاری و آموزشی', xp: 50 },
            { id: 'm2', title: 'یک سشن پومودورو ۲۵ دقیقه‌ای تمرکز', xp: 40 },
            { id: 'm3', title: 'ثبت وضعیت احساسات و حال دل امروز', xp: 30 },
            { id: 'm4', title: 'گوش دادن به پادکست رشد روز', xp: 40 }
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => toggleMission(m.id, m.xp)}
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                completedMissions[m.id]
                  ? 'bg-[#1e2722] border-[#3ECF8E]/30 text-[#d1d5db]'
                  : 'bg-[#202227] border-[#2d313a] hover:border-[#3ECF8E]/40 text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    completedMissions[m.id]
                      ? 'bg-[#10b981] border-[#10b981] text-black'
                      : 'border-[#4b5563] bg-[#2a2d36]'
                  }`}
                >
                  {completedMissions[m.id] && <CheckCircle2 className="w-4 h-4 fill-current" />}
                </div>
                <span className={`text-xs ${completedMissions[m.id] ? 'line-through text-[#8b929e]' : ''}`}>
                  {m.title}
                </span>
              </div>

              <span className="text-[11px] font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-lg">
                +{toPersianDigits(m.xp)} XP
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Podcasts & Audiobooks */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-[#3ECF8E]" />
            پادکست‌ها و درس‌گفتارها
          </h3>
          <span className="text-xs text-[#f59e0b] flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" />
            برگزیده
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {PODCAST_EPISODES.map((pod) => {
            const isPlaying = playingAudioId === pod.id;
            return (
              <div
                key={pod.id}
                onClick={() => handlePlayAudio(pod.id, 'positive')}
                className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer shadow-sm flex flex-col justify-between h-36 ${
                  isPlaying
                    ? 'bg-[#192b22] border-[#3ECF8E] shadow-lg shadow-[#3ECF8E]/20'
                    : 'bg-[#191a1e] border-[#272a31] hover:bg-[#202227]'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-[#3ECF8E] bg-[#3ECF8E]/10 px-2 py-0.5 rounded-md">
                    {pod.duration}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {pod.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#252830]">
                  <span className="text-[10px] text-[#9ca3af] truncate max-w-[90px]">
                    {pod.speaker}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isPlaying ? 'bg-[#3ECF8E] text-black' : 'bg-[#2a2d36] text-white hover:bg-[#3ECF8E] hover:text-black'
                  }`}>
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
