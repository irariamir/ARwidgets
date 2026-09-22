import {
  INITIAL_CATEGORIES,
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_MOOD_LOGS,
  BADGES_LIST
} from '../data/seedData';
import { getCurrentJalaliDate } from './jalali';

const today = getCurrentJalaliDate().dateString;

export const INITIAL_NOTES = [
  {
    id: 'n-1',
    title: 'ai',
    content: 'همه چیز رو خوب بررسی کن و دقیق مثل این بساز',
    category: 'none',
    date: today,
    time: '۱۲:۴۴',
    createdAt: Date.now() - 3600000
  },
  {
    id: 'n-2',
    title: 'ایده‌های توسعه تیک‌آر (TickAR)',
    content: 'طراحی رابط کاربری تم تاریک شبیه لیمونی با فونت کلمه و ایران‌یکان، سیستم پومودورو با موزیک‌های آرامش‌بخش، تقویم شمسی دقیق و اشتراک طلایی رایگان برای تمام کاربران آریامیر.',
    category: 'ariamir',
    date: today,
    time: '۱۰:۱۵',
    createdAt: Date.now() - 7200000
  },
  {
    id: 'n-3',
    title: 'نکات کلیدی رشد فردی',
    content: 'استمرار کوچک روزانه (۱٪ در روز) در طول زمان معجزه می‌کند. تمرکز عمیق بدون چک کردن مداوم شبکه‌های اجتماعی.',
    category: 'study',
    date: today,
    time: '۰۹:۰۰',
    createdAt: Date.now() - 14400000
  }
];

const KEYS = {
  TASKS: 'tickar_tasks_v2',
  HABITS: 'tickar_habits_v2',
  MOODS: 'tickar_moods_v2',
  NOTES: 'tickar_notes_v2',
  CATEGORIES: 'tickar_categories_v2',
  BADGES: 'tickar_badges_v2',
  USER_STATS: 'tickar_user_stats_v2',
  SETTINGS: 'tickar_settings_v2'
};

export function loadData() {
  try {
    const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS)) || INITIAL_TASKS;
    const habits = JSON.parse(localStorage.getItem(KEYS.HABITS)) || INITIAL_HABITS;
    const moods = JSON.parse(localStorage.getItem(KEYS.MOODS)) || INITIAL_MOOD_LOGS;
    const notes = JSON.parse(localStorage.getItem(KEYS.NOTES)) || INITIAL_NOTES;
    const categories = JSON.parse(localStorage.getItem(KEYS.CATEGORIES)) || INITIAL_CATEGORIES;
    const badges = JSON.parse(localStorage.getItem(KEYS.BADGES)) || BADGES_LIST;
    const userStats = JSON.parse(localStorage.getItem(KEYS.USER_STATS)) || {
      xp: 1420,
      level: 4,
      totalFocusMinutes: 485,
      completedTasksCount: 28,
      currentStreak: 14,
      vipStatus: true,
      userName: 'مدیر ارشد ARIAMIR',
      organization: 'شرکت فناوری ARIAMIR'
    };
    const settings = JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || {
      theme: 'dark',
      soundEffects: true,
      fontFamily: 'Kalameh',
      pomodoroWorkMinutes: 25,
      pomodoroBreakMinutes: 5,
      pomodoroLongBreakMinutes: 15,
      autoStartBreaks: false
    };

    return { tasks, habits, moods, notes, categories, badges, userStats, settings };
  } catch (err) {
    console.error('Error loading data from localStorage', err);
    return {
      tasks: INITIAL_TASKS,
      habits: INITIAL_HABITS,
      moods: INITIAL_MOOD_LOGS,
      notes: INITIAL_NOTES,
      categories: INITIAL_CATEGORIES,
      badges: BADGES_LIST,
      userStats: {
        xp: 1420,
        level: 4,
        totalFocusMinutes: 485,
        completedTasksCount: 28,
        currentStreak: 14,
        vipStatus: true,
        userName: 'مدیر ارشد ARIAMIR',
        organization: 'شرکت فناوری ARIAMIR'
      },
      settings: {
        theme: 'dark',
        soundEffects: true,
        fontFamily: 'Kalameh',
        pomodoroWorkMinutes: 25,
        pomodoroBreakMinutes: 5,
        pomodoroLongBreakMinutes: 15,
        autoStartBreaks: false
      }
    };
  }
}

export function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key}`, err);
  }
}

export function exportAllData() {
  const allData = {
    tasks: JSON.parse(localStorage.getItem(KEYS.TASKS)) || INITIAL_TASKS,
    habits: JSON.parse(localStorage.getItem(KEYS.HABITS)) || INITIAL_HABITS,
    moods: JSON.parse(localStorage.getItem(KEYS.MOODS)) || INITIAL_MOOD_LOGS,
    notes: JSON.parse(localStorage.getItem(KEYS.NOTES)) || INITIAL_NOTES,
    categories: JSON.parse(localStorage.getItem(KEYS.CATEGORIES)) || INITIAL_CATEGORIES,
    userStats: JSON.parse(localStorage.getItem(KEYS.USER_STATS)) || {},
    settings: JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || {},
    exportDate: new Date().toISOString(),
    appName: 'TickAR by ARIAMIR',
    version: '2.5.0-PRO'
  };
  return JSON.stringify(allData, null, 2);
}

export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks) localStorage.setItem(KEYS.TASKS, JSON.stringify(data.tasks));
    if (data.habits) localStorage.setItem(KEYS.HABITS, JSON.stringify(data.habits));
    if (data.moods) localStorage.setItem(KEYS.MOODS, JSON.stringify(data.moods));
    if (data.notes) localStorage.setItem(KEYS.NOTES, JSON.stringify(data.notes));
    if (data.categories) localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data.categories));
    if (data.userStats) localStorage.setItem(KEYS.USER_STATS, JSON.stringify(data.userStats));
    if (data.settings) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings));
    return true;
  } catch (e) {
    console.error('Failed to import backup data', e);
    return false;
  }
}

export { KEYS };
