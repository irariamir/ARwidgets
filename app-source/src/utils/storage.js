import {
  INITIAL_CATEGORIES,
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_MOOD_LOGS,
  BADGES_LIST
} from '../data/seedData';

const KEYS = {
  TASKS: 'tickar_tasks_v1',
  HABITS: 'tickar_habits_v1',
  MOODS: 'tickar_moods_v1',
  CATEGORIES: 'tickar_categories_v1',
  BADGES: 'tickar_badges_v1',
  USER_STATS: 'tickar_user_stats_v1',
  SETTINGS: 'tickar_settings_v1'
};

export function loadData() {
  try {
    const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS)) || INITIAL_TASKS;
    const habits = JSON.parse(localStorage.getItem(KEYS.HABITS)) || INITIAL_HABITS;
    const moods = JSON.parse(localStorage.getItem(KEYS.MOODS)) || INITIAL_MOOD_LOGS;
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

    return { tasks, habits, moods, categories, badges, userStats, settings };
  } catch (err) {
    console.error('Error loading data from localStorage', err);
    return {
      tasks: INITIAL_TASKS,
      habits: INITIAL_HABITS,
      moods: INITIAL_MOOD_LOGS,
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
