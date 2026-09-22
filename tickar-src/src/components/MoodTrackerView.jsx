import React, { useState } from 'react';
import { toPersianDigits, getCurrentJalaliDate } from '../utils/jalali';
import { audioEngine } from '../utils/audioEngine';
import { Smile, Heart, Check, Sparkles, MessageCircle, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOODS = [
  { id: 5, label: 'عالی', emoji: '🤩', color: '#10b981', ringColor: 'ring-[#10b981]' },
  { id: 4, label: 'خوب', emoji: '😊', color: '#3b82f6', ringColor: 'ring-[#3b82f6]' },
  { id: 3, label: 'معمولی', emoji: '😐', color: '#eab308', ringColor: 'ring-[#eab308]' },
  { id: 2, label: 'بد', emoji: '😔', color: '#f97316', ringColor: 'ring-[#f97316]' },
  { id: 1, label: 'افتضاح', emoji: '😫', color: '#ef4444', ringColor: 'ring-[#ef4444]' }
];

export function MoodTrackerView({ moods, onAddMood, onRewardXp }) {
  const [selectedMood, setSelectedMood] = useState(5);
  const [note, setNote] = useState('');
  const [energyLevel, setEnergyLevel] = useState(8);

  const jalali = getCurrentJalaliDate();

  const handleSave = (e) => {
    e?.preventDefault();
    const newMood = {
      id: 'm-' + Date.now(),
      date: jalali.dateString,
      mood: selectedMood,
      energy: energyLevel,
      note: note.trim(),
      createdAt: Date.now()
    };

    onAddMood(newMood);
    onRewardXp?.(30);
    audioEngine.playStreakSpark();
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#10b981', '#f59e0b', '#ec4899']
    });

    setNote('');
  };

  const getMoodObj = (id) => MOODS.find(m => m.id === id) || MOODS[0];

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-5 select-none">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-white">ثبت احساسات و حال دل</h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          احساسات امروزت رو ثبت کن تا الگوی انرژی و روحیه ات رو تحلیل کنیم
        </p>
      </div>

      {/* 5 Mood Avatars (Matching Lemoni scene_011.jpg) */}
      <div className="grid grid-cols-5 gap-2">
        {MOODS.map((m) => {
          const isSelected = selectedMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                audioEngine.playClick();
                setSelectedMood(m.id);
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#182a20] border-[#3ECF8E] ring-2 ring-[#3ECF8E] scale-105 shadow-lg shadow-[#3ECF8E]/25'
                  : 'bg-[#191a1e] border-[#272a31] hover:bg-[#202227] opacity-75'
              }`}
            >
              <span className="text-3xl mb-1.5">{m.emoji}</span>
              <span className={`text-[11px] font-bold ${isSelected ? 'text-[#3ECF8E]' : 'text-[#8b929e]'}`}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Energy Slider */}
      <div className="bg-[#191a1e] border border-[#272a31] rounded-3xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span>میزان انرژی و سرزندگی:</span>
          <span className="text-[#3ECF8E] bg-[#3ECF8E]/10 px-2 py-0.5 rounded-lg">
            {toPersianDigits(energyLevel)} از ۱۰
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(parseInt(e.target.value, 10))}
          className="w-full accent-[#3ECF8E] cursor-pointer"
        />
      </div>

      {/* Note Textarea (Matching Lemoni scene_011.jpg) */}
      <div className="bg-[#191a1e] border border-[#272a31] rounded-3xl p-4 space-y-2">
        <label className="text-xs text-[#9ca3af] block">یادداشت کوتاه (اختیاری):</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="امروز چه اتفاقی افتاد که روی حالت تاثیر داشت؟"
          rows={3}
          className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl p-3 text-xs text-white placeholder-[#6b7280] outline-none transition-all resize-none"
        />
      </div>

      {/* Save Button (Matching Lemoni: ذخیره) */}
      <div>
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-[#10b981]/25"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>ذخیره وضعیت احساسی</span>
        </button>
      </div>

      {/* Mood History Log */}
      {moods && moods.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-[#252830]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#ec4899]" />
            تاریخچه احساسات اخیر
          </h3>

          <div className="space-y-2">
            {moods.slice(0, 5).map((m) => {
              const mObj = getMoodObj(m.mood);
              return (
                <div
                  key={m.id}
                  className="bg-[#191a1e] border border-[#272a31] rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mObj.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{mObj.label}</span>
                        <span className="text-[10px] text-[#8b929e]">
                          انرژی: {toPersianDigits(m.energy || 8)}/۱۰
                        </span>
                      </div>
                      {m.note && (
                        <p className="text-[11px] text-[#9ca3af] mt-0.5 line-clamp-1">
                          {m.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-[#6b7280]">
                    {toPersianDigits(m.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
