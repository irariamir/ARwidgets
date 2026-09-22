import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Headphones, 
  Wind, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  Crown, 
  Clock, 
  BookOpen, 
  Share2, 
  Copy, 
  Check,
  Radio,
  Zap
} from 'lucide-react';
import { toPersianDigits } from '../utils/jalali';
import { PODCAST_EPISODES, DAILY_AFFIRMATIONS } from '../data/seedData';
import { audioEngine } from '../utils/audioEngine';

export function ExploreView({ soundEffects, playChimeSound }) {
  const [activeTab, setActiveTab] = useState('podcasts'); // 'podcasts' | 'breath' | 'affirmations' | 'lofi'
  
  // Podcast player state
  const [activePodcast, setActivePodcast] = useState(PODCAST_EPISODES[0]);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [podcastProgress, setPodcastProgress] = useState(15); // percent

  // Breathwork state
  const [breathPattern, setBreathPattern] = useState('box'); // 'box' (4-4-4-4) | '478' (4-7-8) | 'energize' (5-5)
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('آماده'); // دم، حبس، بازدم، سکون
  const [breathCount, setBreathCount] = useState(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState(0);

  // Affirmations & Copy
  const [copiedQuoteIndex, setCopiedQuoteIndex] = useState(null);

  // Lo-Fi State
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);

  // Breathwork Timer logic
  useEffect(() => {
    let timer = null;
    if (isBreathing) {
      const patterns = {
        box: [
          { name: 'دم عمیق از بینی 🌬️', duration: 4, scale: 1.35 },
          { name: 'حبس نفس در سینه 🧘', duration: 4, scale: 1.35 },
          { name: 'بازدم آرام از دهان 🍃', duration: 4, scale: 0.8 },
          { name: 'سکون و آرامش کامل 🌿', duration: 4, scale: 0.8 }
        ],
        '478': [
          { name: 'دم عمیق (۴ ثانیه) 🌬️', duration: 4, scale: 1.35 },
          { name: 'حبس نفس (۷ ثانیه) 🧘', duration: 7, scale: 1.35 },
          { name: 'بازدم کشیده (۸ ثانیه) 🍃', duration: 8, scale: 0.8 }
        ],
        energize: [
          { name: 'دم انرژی‌بخش (۵ ثانیه) ⚡', duration: 5, scale: 1.3 },
          { name: 'بازدم یکنواخت (۵ ثانیه) 🌿', duration: 5, scale: 0.85 }
        ]
      };

      const steps = patterns[breathPattern];
      let stepIndex = 0;
      let secondLeft = steps[stepIndex].duration;

      setBreathPhase(steps[stepIndex].name);
      setBreathCount(secondLeft);

      timer = setInterval(() => {
        secondLeft--;
        if (secondLeft <= 0) {
          stepIndex = (stepIndex + 1) % steps.length;
          if (stepIndex === 0) {
            setCompletedBreathCycles((prev) => prev + 1);
          }
          secondLeft = steps[stepIndex].duration;
          setBreathPhase(steps[stepIndex].name);
        }
        setBreathCount(secondLeft);
      }, 1000);
    } else {
      setBreathPhase('برای شروع دکمه را بزنید');
      setBreathCount(4);
    }

    return () => clearInterval(timer);
  }, [isBreathing, breathPattern]);

  const handleToggleLofi = () => {
    const next = !isLofiPlaying;
    setIsLofiPlaying(next);
    if (next) {
      audioEngine.startLofi(0.6);
    } else {
      audioEngine.stop('lofi');
    }
  };

  const handleTogglePodcastPlay = () => {
    setIsPlayingPodcast(!isPlayingPodcast);
    if (!isPlayingPodcast) {
      // Simulate audio play
      if (soundEffects && playChimeSound) playChimeSound();
    }
  };

  const handleCopyQuote = (quoteText, idx) => {
    navigator.clipboard.writeText(quoteText);
    setCopiedQuoteIndex(idx);
    setTimeout(() => setCopiedQuoteIndex(null), 2000);
  };

  return (
    <div className="space-y-6 pb-24 text-right animate-in fade-in duration-300">
      
      {/* Header & Category Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-black text-2xl text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#3ECF8E]" />
            هاب رسانه‌ای توسعه فردی TickAR
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">پادکست‌های تخصصی، تمرینات تنفسی هوشمند و کتابخانه انگیزشی</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#171717] rounded-2xl border border-[#2E2E2E]">
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'podcasts'
                ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/40'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            پادکست‌ها
          </button>

          <button
            onClick={() => setActiveTab('breath')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'breath'
                ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/40'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            تنفس درمانی
          </button>

          <button
            onClick={() => setActiveTab('affirmations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'affirmations'
                ? 'bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/40'
                : 'text-[#898989] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            جملات تأکیدی
          </button>
        </div>
      </div>

      {activeTab === 'podcasts' ? (
        /* Podcasts & Masterclasses */
        <div className="space-y-6">
          
          {/* Active Episode Player Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#171717] via-[#121212] to-[#0D0D0D] border border-[#3ECF8E]/30 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#005936] text-[#3ECF8E] border border-[#3ECF8E]/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#3ECF8E]" />
                نسخه کامل VIP (باز شده رایگان)
              </span>
              <span className="text-xs text-[#898989] font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#3ECF8E]" />
                {activePodcast.duration}
              </span>
            </div>

            <div>
              <h3 className="font-heading font-black text-lg text-white">
                {activePodcast.title}
              </h3>
              <p className="text-xs text-[#3ECF8E] font-medium mt-0.5">
                ارائه‌دهنده: {activePodcast.speaker}
              </p>
              <p className="text-xs text-[#B4B4B4] mt-2 leading-relaxed">
                {activePodcast.summary}
              </p>
            </div>

            {/* Audio Waveform / Progress */}
            <div className="space-y-1 pt-2">
              <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden cursor-pointer relative">
                <div 
                  className="h-full bg-gradient-to-r from-[#005936] to-[#3ECF8E] rounded-full"
                  style={{ width: `${podcastProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#898989] font-mono">
                <span>۰۲:۱۵</span>
                <span>{activePodcast.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all ${
                      playbackSpeed === speed ? 'bg-[#3ECF8E] text-black' : 'bg-[#242424] text-[#898989]'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePodcastPlay}
                  className="w-12 h-12 rounded-2xl bg-[#3ECF8E] hover:bg-[#72E3AD] text-black flex items-center justify-center font-bold shadow-lg shadow-[#3ECF8E]/30 transition-all"
                >
                  {isPlayingPodcast ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black translate-x-0.5" />}
                </button>
              </div>
            </div>

            {/* Transcript Snippet */}
            <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#242424] text-xs text-[#898989] leading-relaxed">
              <span className="font-bold text-white block mb-1">📜 متن و خلاصه نکات کلیدی:</span>
              <p className="text-[11px]">{activePodcast.transcript}</p>
            </div>

          </div>

          {/* Episode List */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">
              همه دوره‌ها و پادکست‌های موفقیت ({toPersianDigits(PODCAST_EPISODES.length)} اپیزود)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PODCAST_EPISODES.map((ep) => {
                const isCurrent = activePodcast.id === ep.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => {
                      setActivePodcast(ep);
                      setIsPlayingPodcast(true);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent 
                        ? 'bg-[#171717] border-[#3ECF8E] shadow-md shadow-[#3ECF8E]/10' 
                        : 'bg-[#121212] border-[#2E2E2E] hover:border-[#3ECF8E]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-[#3ECF8E] font-semibold block">{ep.category}</span>
                        <h5 className="font-bold text-xs text-white mt-1 truncate">{ep.title}</h5>
                        <span className="text-[11px] text-[#898989] mt-0.5 block">{ep.speaker}</span>
                      </div>

                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-[#3ECF8E] text-black' : 'bg-[#1C1C1C] text-[#898989]'
                      }`}>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : activeTab === 'breath' ? (
        /* Guided Breathwork Studio */
        <div className="p-8 rounded-3xl bg-[#121212] border border-[#2E2E2E] shadow-2xl flex flex-col items-center justify-center space-y-8 text-center">
          
          <div>
            <span className="text-xs font-bold text-[#3ECF8E] block mb-1">تمرین ذهن‌آگاهی و بازتنظیم سیستم عصبی</span>
            <h3 className="font-heading font-black text-2xl text-white">
              استودیو تنفس هدایت‌شده (Breathwork)
            </h3>
          </div>

          {/* Pattern Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#171717] rounded-2xl border border-[#2E2E2E]">
            {[
              { id: 'box', label: 'تنفس جعبه‌ای (Box 4-4-4-4)' },
              { id: '478', label: 'آرامش عمیق (4-7-8)' },
              { id: 'energize', label: 'انرژی‌بخش (5-5)' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setBreathPattern(p.id);
                  setIsBreathing(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  breathPattern === p.id 
                    ? 'bg-[#3ECF8E] text-black shadow-md shadow-[#3ECF8E]/20' 
                    : 'text-[#898989] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Animated Visual Glowing Orb */}
          <div className="relative w-64 h-64 flex items-center justify-center my-4">
            
            {/* Outer Glow Halo */}
            <div 
              className={`absolute inset-0 rounded-full bg-[#3ECF8E]/10 transition-transform duration-1000 ${
                isBreathing ? 'scale-125 animate-pulse' : 'scale-100'
              }`} 
            />

            {/* Expanding/Contracting Center Circle */}
            <div 
              className={`w-44 h-44 rounded-full bg-gradient-to-tr from-[#005936] to-[#3ECF8E] flex flex-col items-center justify-center shadow-2xl shadow-[#3ECF8E]/40 text-black transition-all duration-1000 ease-in-out ${
                isBreathing ? 'scale-110' : 'scale-95'
              }`}
            >
              <span className="font-heading font-black text-lg text-black px-4 text-center">
                {breathPhase}
              </span>
              {isBreathing && (
                <span className="font-mono font-black text-3xl text-black mt-1">
                  {toPersianDigits(breathCount)}
                </span>
              )}
            </div>

          </div>

          {/* Start / Stop Breathwork */}
          <div className="space-y-2">
            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className={`px-8 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${
                isBreathing
                  ? 'bg-[#E54D2D] hover:bg-[#E54D2D]/90 text-white shadow-[#E54D2D]/30'
                  : 'bg-[#3ECF8E] hover:bg-[#72E3AD] text-black shadow-[#3ECF8E]/30 scale-105'
              }`}
            >
              {isBreathing ? 'توقف تمرین تنفس' : 'شروع تمرین تنفس عمیق'}
            </button>

            <p className="text-xs text-[#898989] block">
              دوره‌های تکمیل شده: {toPersianDigits(completedBreathCycles)} چرخه
            </p>
          </div>

        </div>
      ) : (
        /* Affirmations & Daily Motivation */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-sm text-white">
              کارت‌های تأکید مثبت و باورهای برنده
            </h4>
            <span className="text-xs text-[#898989]">برای مرور روزانه و ذخیره‌سازی ذهن ناخودآگاه</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DAILY_AFFIRMATIONS.map((aff, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-[#121212] border border-[#2E2E2E] hover:border-[#3ECF8E]/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1">
                      {aff.tags.map((t, ti) => (
                        <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C1C1C] text-[#3ECF8E] border border-[#2E2E2E]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopyQuote(aff.quote, idx)}
                      className="text-[#898989] hover:text-white p-1 rounded-lg bg-[#171717]"
                      title="کپی متن"
                    >
                      {copiedQuoteIndex === idx ? <Check className="w-3.5 h-3.5 text-[#3ECF8E]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-sm font-heading font-medium text-white leading-relaxed">
                    «{aff.quote}»
                  </p>
                </div>

                <span className="text-xs text-[#898989] border-t border-[#242424] pt-2 block font-medium">
                  — {aff.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
