import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { TasksView } from './components/TasksView';
import { GrowthView } from './components/GrowthView';
import { ToolsView } from './components/ToolsView';
import { ProfileView } from './components/ProfileView';
import { VipModal } from './components/VipModal';
import { NotificationGuideModal } from './components/NotificationGuideModal';
import { InboxModal } from './components/InboxModal';
import { loadData, saveData, KEYS } from './utils/storage';
import { audioEngine } from './utils/audioEngine';

export function App() {
  const initialData = loadData();

  // Navigation State
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'growth' | 'tools' | 'profile'
  const [subTool, setSubTool] = useState(null); // null | 'habits' | 'pomodoro' | 'mood' | 'notes' | 'calendar'

  // Data State
  const [tasks, setTasks] = useState(initialData.tasks || []);
  const [habits, setHabits] = useState(initialData.habits || []);
  const [moods, setMoods] = useState(initialData.moods || []);
  const [notes, setNotes] = useState(initialData.notes || []);
  const [categories, setCategories] = useState(initialData.categories || []);
  const [userStats, setUserStats] = useState(initialData.userStats || {});
  const [settings, setSettings] = useState(initialData.settings || {});

  // Modals
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isNotificationGuideOpen, setIsNotificationGuideOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => { saveData(KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { saveData(KEYS.HABITS, habits); }, [habits]);
  useEffect(() => { saveData(KEYS.MOODS, moods); }, [moods]);
  useEffect(() => { saveData(KEYS.NOTES, notes); }, [notes]);
  useEffect(() => { saveData(KEYS.USER_STATS, userStats); }, [userStats]);
  useEffect(() => {
    saveData(KEYS.SETTINGS, settings);
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  }, [settings]);

  // Tab & SubTool Navigation Handlers
  const handleTabChange = (tab) => {
    audioEngine.playClick();
    setActiveTab(tab);
    setSubTool(null);
  };

  const handleSelectToolFromGrowth = (toolKey) => {
    audioEngine.playClick();
    setActiveTab('tools');
    if (toolKey === 'habits' || toolKey === 'pomodoro' || toolKey === 'pomodoro_music') {
      setSubTool(toolKey);
    } else {
      setSubTool(null);
    }
  };

  const handleBackToHub = () => {
    audioEngine.playClick();
    setSubTool(null);
  };

  // Task Handlers
  const handleAddTask = (newTask) => {
    setTasks([newTask, ...tasks]);
    handleRewardXp(20);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const next = !t.completed;
        if (next) handleRewardXp(50);
        return { ...t, completed: next };
      }
      return t;
    }));
  };

  // Habit Handlers
  const handleAddHabit = (newHabit) => {
    setHabits([newHabit, ...habits]);
    handleRewardXp(30);
  };

  const handleToggleHabitDay = (habitId, dayOffset) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const completedDays = h.completedDays ? [...h.completedDays] : [];
        const exists = completedDays.includes(dayOffset);
        let newDays;
        let newStreak = h.streak || 1;

        if (exists) {
          newDays = completedDays.filter(d => d !== dayOffset);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          newDays = [...completedDays, dayOffset];
          newStreak = newStreak + 1;
          handleRewardXp(25);
        }
        return { ...h, completedDays: newDays, streak: newStreak };
      }
      return h;
    }));
  };

  const handleDeleteHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
  };

  // Mood Handlers
  const handleAddMood = (newMood) => {
    setMoods([newMood, ...moods]);
    handleRewardXp(30);
  };

  // Notes Handlers
  const handleAddNote = (newNote) => {
    setNotes([newNote, ...notes]);
    handleRewardXp(15);
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  // XP Reward Handler
  const handleRewardXp = (amount) => {
    setUserStats(prev => {
      const newXp = (prev.xp || 1420) + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  return (
    <div className="min-h-screen bg-[#111214] text-[#fafafa] flex flex-col font-body antialiased selection:bg-[#3ECF8E]/30 selection:text-white">
      {/* Top Header */}
      <Navbar
        currentSubView={subTool}
        onBack={handleBackToHub}
        onOpenInbox={() => setIsInboxOpen(true)}
        onOpenVipModal={() => setIsVipModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto">
        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            categories={categories}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        )}

        {activeTab === 'growth' && (
          <GrowthView
            onSelectTool={handleSelectToolFromGrowth}
            onOpenVipModal={() => setIsVipModalOpen(true)}
            userStats={userStats}
            onRewardXp={handleRewardXp}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsView
            subTool={subTool}
            onSelectSubTool={(tool) => setSubTool(tool)}
            habits={habits}
            onAddHabit={handleAddHabit}
            onToggleHabitDay={handleToggleHabitDay}
            onDeleteHabit={handleDeleteHabit}
            moods={moods}
            onAddMood={handleAddMood}
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            categories={categories}
            onRewardXp={handleRewardXp}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            userStats={userStats}
            onUpdateUserStats={setUserStats}
            settings={settings}
            onUpdateSettings={setSettings}
            onOpenVipModal={() => setIsVipModalOpen(true)}
            onOpenNotificationGuide={() => setIsNotificationGuideOpen(true)}
          />
        )}
      </main>

      {/* Bottom Floating Navigation (Matching Lemoni 4 Tabs + Floating Center Button) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onQuickAddClick={() => {
          setActiveTab('tasks');
          setSubTool(null);
          const evt = new CustomEvent('open-quick-add');
          window.dispatchEvent(evt);
        }}
      />

      {/* Modals */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
      />

      <NotificationGuideModal
        isOpen={isNotificationGuideOpen}
        onClose={() => setIsNotificationGuideOpen(false)}
      />

      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </div>
  );
}

export default App;
