import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Smile,
  FileText,
  Calendar,
  Grid,
  Sparkles,
  ChevronLeft,
  Crown,
  Activity,
  Layers
} from 'lucide-react';
import { HabitMakerView } from './HabitMakerView';
import { PomodoroView } from './PomodoroView';
import { MoodTrackerView } from './MoodTrackerView';
import { NotesView } from './NotesView';
import { PlannerView } from './PlannerView';

export function ToolsView({
  subTool,
  onSelectSubTool,
  habits,
  onAddHabit,
  onToggleHabitDay,
  onDeleteHabit,
  moods,
  onAddMood,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  categories,
  onRewardXp,
  onOpenAiPlanner,
  onOpenVipModal
}) {
  // If a subtool is selected, render that subtool directly
  if (subTool === 'habits') {
    return (
      <HabitMakerView
        habits={habits}
        onAddHabit={onAddHabit}
        onToggleHabitDay={onToggleHabitDay}
        onDeleteHabit={onDeleteHabit}
      />
    );
  }

  if (subTool === 'pomodoro' || subTool === 'pomodoro_music') {
    return <PomodoroView onRewardXp={onRewardXp} />;
  }

  if (subTool === 'mood') {
    return <MoodTrackerView moods={moods} onAddMood={onAddMood} onRewardXp={onRewardXp} />;
  }

  if (subTool === 'notes') {
    return (
      <NotesView
        notes={notes}
        onAddNote={onAddNote}
        onUpdateNote={onUpdateNote}
        onDeleteNote={onDeleteNote}
      />
    );
  }

  if (subTool === 'calendar' || subTool === 'matrix') {
    return (
      <PlannerView
        tasks={tasks}
        categories={categories}
        onAddTask={onAddTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onToggleTask={onToggleTask}
      />
    );
  }

  // Hub View (List of All Tools)
  const TOOLS_LIST = [
    {
      id: 'habits',
      title: 'عادت‌ساز (ردیاب استمرار)',
      subtitle: 'ساخت عادات مثبت و شکستن زنجیره تنبلی با ثبت روزانه',
      icon: Flame,
      color: '#f59e0b',
      badge: 'محبوب‌ترین'
    },
    {
      id: 'pomodoro',
      title: 'تایمر پومودورو با موزیک فوکوس',
      subtitle: 'سشن‌های تمرکز عمیق ۲۵ دقیقه‌ای همراه با امواج ذهنی',
      icon: Clock,
      color: '#10b981',
      badge: 'تکنیک طلایی'
    },
    {
      id: 'mood',
      title: 'ثبت احساسات و حال دل',
      subtitle: 'ردیابی سطح انرژی روزانه و الگوی خلقی ذهنی',
      icon: Smile,
      color: '#ec4899',
      badge: 'روانشناسی'
    },
    {
      id: 'notes',
      title: 'یادداشت‌ها و ایده‌های سریع',
      subtitle: 'فضای ذخیره‌سازی نامحدود افکار و برنامه‌های کاری',
      icon: FileText,
      color: '#3b82f6',
      badge: 'کاربردی'
    },
    {
      id: 'calendar',
      title: 'تقویم شمسی و ماتریس آیزنهاور',
      subtitle: 'برنامه‌ریزی ماهانه و دسته‌بندی کارها بر اساس فوری و مهم',
      icon: Calendar,
      color: '#8b5cf6',
      badge: 'برنامه‌ریز'
    }
  ];

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4 select-none">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-[#3ECF8E]"></span>
          ابزارهای رشد و بهره‌وری
        </h1>
        <span className="text-xs text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold">
          <Crown className="w-3.5 h-3.5" />
          VIP رایگان
        </span>
      </div>

      {/* AI Assistant Banner */}
      <div
        onClick={onOpenAiPlanner}
        className="bg-gradient-to-l from-[#182a20] via-[#14201a] to-[#191a1e] border border-[#3ECF8E]/30 rounded-3xl p-4.5 cursor-pointer active:scale-98 transition-all shadow-md flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#3ECF8E] text-black flex items-center justify-center shadow-lg shadow-[#3ECF8E]/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">دستیار هوشمند تیک‌آر (AI)</h3>
              <span className="text-[10px] bg-[#3ECF8E]/20 text-[#3ECF8E] px-2 py-0.5 rounded-full font-bold">
                ARIAMIR AI
              </span>
            </div>
            <p className="text-xs text-[#9ca3af]">
              برنامه‌ریزی خودکار اهداف و تبدیل به گام‌های عملیاتی
            </p>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-[#3ECF8E]" />
      </div>

      {/* Tools List */}
      <div className="space-y-2.5">
        {TOOLS_LIST.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onSelectSubTool(tool.id)}
              className="bg-[#191a1e] hover:bg-[#202227] border border-[#272a31] hover:border-[#3ECF8E]/30 rounded-3xl p-4 cursor-pointer transition-all shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${tool.color}20`, border: `1.5px solid ${tool.color}` }}
                >
                  <Icon className="w-6 h-6" style={{ color: tool.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#3ECF8E] transition-colors">
                      {tool.title}
                    </h3>
                    <span className="text-[10px] text-[#8b929e] bg-[#22242b] px-2 py-0.5 rounded-md">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#8b929e] mt-0.5 line-clamp-1">
                    {tool.subtitle}
                  </p>
                </div>
              </div>

              <ChevronLeft className="w-5 h-5 text-[#6b7280] group-hover:text-white transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
