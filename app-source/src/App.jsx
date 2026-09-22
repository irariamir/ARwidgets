import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { TodayView } from './components/TodayView';
import { PlannerView } from './components/PlannerView';
import { FocusView } from './components/FocusView';
import { HabitsMoodView } from './components/HabitsMoodView';
import { ExploreView } from './components/ExploreView';
import { TaskModal } from './components/TaskModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { SettingsModal } from './components/SettingsModal';

import { loadData, saveData, KEYS } from './utils/storage';
import { audioEngine } from './utils/audioEngine';
import { getCurrentJalaliDate } from './utils/jalali';

export function App() {
  const initialData = loadData();

  const [currentTab, setCurrentTab] = useState('today');
  const [tasks, setTasks] = useState(initialData.tasks);
  const [habits, setHabits] = useState(initialData.habits);
  const [moodLogs, setMoodLogs] = useState(initialData.moods);
  const [categories, setCategories] = useState(initialData.categories);
  const [badges, setBadges] = useState(initialData.badges);
  const [userStats, setUserStats] = useState(initialData.userStats);
  const [settings, setSettings] = useState(initialData.settings);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Active focus task
  const [activeFocusTaskId, setActiveFocusTaskId] = useState(null);

  // Save to LocalStorage on changes
  useEffect(() => {
    saveData(KEYS.TASKS, tasks);
  }, [tasks]);

  useEffect(() => {
    saveData(KEYS.HABITS, habits);
  }, [habits]);

  useEffect(() => {
    saveData(KEYS.MOODS, moodLogs);
  }, [moodLogs]);

  useEffect(() => {
    saveData(KEYS.USER_STATS, userStats);
  }, [userStats]);

  useEffect(() => {
    saveData(KEYS.SETTINGS, settings);
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  }, [settings]);

  // Sound effects triggers
  const playClick = () => { if (settings.soundEffects) audioEngine.playClick(); };
  const playCompleteSound = () => { if (settings.soundEffects) audioEngine.playTaskComplete(); };
  const playGongSound = () => { if (settings.soundEffects) audioEngine.playPomodoroFinished(); };
  const playSparkSound = () => { if (settings.soundEffects) audioEngine.playStreakSpark(); };
  const playChimeSound = () => { if (settings.soundEffects) audioEngine.playTaskComplete(); };

  // Task Handlers
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        // Award XP on task completion
        if (nextState) {
          setUserStats(s => ({
            ...s,
            xp: (s.xp || 0) + 50,
            completedTasksCount: (s.completedTasksCount || 0) + 1,
            level: Math.floor(((s.xp || 0) + 50) / 500) + 1
          }));
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTasks(prev => [taskData, ...prev]);
      // Bonus XP for creating a structured task
      setUserStats(s => ({ ...s, xp: (s.xp || 0) + 15 }));
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleAddGeneratedTasks = (newTasksList) => {
    setTasks(prev => [...newTasksList, ...prev]);
    setUserStats(s => ({ ...s, xp: (s.xp || 0) + newTasksList.length * 20 }));
  };

  // Habit Handlers
  const handleToggleHabit = (habitId, dateStr) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const completedDates = h.completedDates ? [...h.completedDates] : [];
        const isDone = completedDates.includes(dateStr);
        let newDates;
        let newStreak = h.streak || 0;

        if (isDone) {
          newDates = completedDates.filter(d => d !== dateStr);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          newDates = [...completedDates, dateStr];
          newStreak = newStreak + 1;
          // Award XP
          setUserStats(s => ({
            ...s,
            xp: (s.xp || 0) + 30,
            currentStreak: Math.max(s.currentStreak || 0, newStreak)
          }));
        }

        const bestStreak = Math.max(h.bestStreak || 0, newStreak);
        return { ...h, completedDates: newDates, streak: newStreak, bestStreak };
      }
      return h;
    }));
  };

  const handleAddHabit = (newHabit) => {
    setHabits(prev => [...prev, newHabit]);
    setUserStats(s => ({ ...s, xp: (s.xp || 0) + 25 }));
  };

  const handleDeleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  // Mood Handlers
  const handleSaveMoodLog = (log) => {
    setMoodLogs(prev => [log, ...prev.filter(m => m.date !== log.date)]);
    setUserStats(s => ({ ...s, xp: (s.xp || 0) + 35 }));
  };

  // Pomodoro Focus Handlers
  const handleStartPomodoroForTask = (task) => {
    setActiveFocusTaskId(task.id);
    setCurrentTab('focus');
  };

  const handleIncrementPomodoro = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completedPomodoros: (t.completedPomodoros || 0) + 1 };
      }
      return t;
    }));
  };

  const handleAddFocusMinutes = (minutes) => {
    setUserStats(s => ({
      ...s,
      totalFocusMinutes: (s.totalFocusMinutes || 0) + minutes,
      xp: (s.xp || 0) + minutes * 2,
      level: Math.floor(((s.xp || 0) + minutes * 2) / 500) + 1
    }));
  };

  // Reset Data to seed
  const handleResetData = () => {
    localStorage.clear();
    const fresh = loadData();
    setTasks(fresh.tasks);
    setHabits(fresh.habits);
    setMoodLogs(fresh.moods);
    setUserStats(fresh.userStats);
    setSettings(fresh.settings);
  };

  const handleDataImported = () => {
    const refreshed = loadData();
    setTasks(refreshed.tasks);
    setHabits(refreshed.habits);
    setMoodLogs(refreshed.moods);
    setUserStats(refreshed.userStats);
    setSettings(refreshed.settings);
  };

  const currentJalali = getCurrentJalaliDate();
  const pendingTasksCount = tasks.filter(t => (t.date === currentJalali.dateString || !t.date) && !t.completed).length;

  return (
    <div className="min-h-screen bg-black text-[#FAFAFA] flex flex-col font-sans antialiased selection:bg-[#3ECF8E]/30 selection:text-white">
      
      {/* Top Brand Navigation Header */}
      <Navbar
        userStats={userStats}
        onOpenAi={() => { playClick(); setIsAiModalOpen(true); }}
        onOpenAnalytics={() => { playClick(); setIsAnalyticsModalOpen(true); }}
        onOpenSettings={() => { playClick(); setIsSettingsModalOpen(true); }}
        theme={settings.theme || 'dark'}
        onToggleTheme={() => {
          playClick();
          setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
        }}
        soundEffects={settings.soundEffects}
        onToggleSound={() => setSettings(s => ({ ...s, soundEffects: !s.soundEffects }))}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        
        {currentTab === 'today' && (
          <TodayView
            tasks={tasks}
            habits={habits}
            categories={categories}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onAddTask={(task) => { handleSaveTask(task); playClick(); }}
            onToggleHabit={handleToggleHabit}
            onStartPomodoroForTask={handleStartPomodoroForTask}
            onOpenAi={() => { playClick(); setIsAiModalOpen(true); }}
            userStats={userStats}
            soundEffects={settings.soundEffects}
            playCompleteSound={playCompleteSound}
            playSparkSound={playSparkSound}
          />
        )}

        {currentTab === 'planner' && (
          <PlannerView
            tasks={tasks}
            categories={categories}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onOpenNewTaskModal={handleNewTask}
          />
        )}

        {currentTab === 'focus' && (
          <FocusView
            tasks={tasks}
            activeTaskId={activeFocusTaskId}
            onSelectActiveTask={setActiveFocusTaskId}
            onIncrementPomodoro={handleIncrementPomodoro}
            onAddFocusMinutes={handleAddFocusMinutes}
            soundEffects={settings.soundEffects}
            playGongSound={playGongSound}
          />
        )}

        {currentTab === 'habits' && (
          <HabitsMoodView
            habits={habits}
            moodLogs={moodLogs}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            onSaveMoodLog={handleSaveMoodLog}
            soundEffects={settings.soundEffects}
            playSparkSound={playSparkSound}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreView
            soundEffects={settings.soundEffects}
            playChimeSound={playChimeSound}
          />
        )}

      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => { playClick(); setCurrentTab(tab); }}
        onQuickAdd={handleNewTask}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        categories={categories}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddGeneratedTasks={handleAddGeneratedTasks}
      />

      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        userStats={userStats}
        tasks={tasks}
        habits={habits}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onDataImported={handleDataImported}
        onResetData={handleResetData}
      />

    </div>
  );
}

export default App;
