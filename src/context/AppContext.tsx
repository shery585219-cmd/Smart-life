import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Habit,
  ShoppingItem,
  UserProfile,
  ScheduleBlock,
  PersonaType,
  AppReminder,
  DailyQuest,
  CustomReward,
  TaskStatus,
} from '../types';
import {
  DEFAULT_ADULT_PROFILE,
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_SHOPPING,
  INITIAL_SCHEDULE,
  INITIAL_QUESTS,
  INITIAL_REWARDS,
  PERSONA_PRESETS,
  getTodayDateString,
} from '../utils/storage';
import { soundFx } from '../utils/audio';

interface AppContextType {
  // Navigation & UI
  activeTab: 'today' | 'tasks' | 'habits' | 'shopping' | 'ai' | 'analytics';
  setActiveTab: (tab: 'today' | 'tasks' | 'habits' | 'shopping' | 'ai' | 'analytics') => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Modals
  taskModalOpen: boolean;
  setTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;

  habitModalOpen: boolean;
  setHabitModalOpen: (open: boolean) => void;
  editingHabit: Habit | null;
  setEditingHabit: (habit: Habit | null) => void;

  shoppingModalOpen: boolean;
  setShoppingModalOpen: (open: boolean) => void;
  editingShoppingItem: ShoppingItem | null;
  setEditingShoppingItem: (item: ShoppingItem | null) => void;

  aiIdeaModalOpen: boolean;
  setAiIdeaModalOpen: (open: boolean) => void;

  pomodoroModalOpen: boolean;
  setPomodoroModalOpen: (open: boolean) => void;

  proModalOpen: boolean;
  setProModalOpen: (open: boolean) => void;

  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;

  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;

  rewardsModalOpen: boolean;
  setRewardsModalOpen: (open: boolean) => void;

  recipeLibraryOpen: boolean;
  setRecipeLibraryOpen: (open: boolean) => void;

  plannerPrintOpen: boolean;
  setPlannerPrintOpen: (open: boolean) => void;

  // Data & Mutators
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskFavorite: (id: string) => void;
  addBulkTasks: (tasks: Array<Omit<Task, 'id' | 'createdAt'>>) => void;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDate: (id: string, dateStr?: string) => void;
  toggleHabitFavorite: (id: string) => void;

  shoppingItems: ShoppingItem[];
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'addedAt'>) => void;
  updateShoppingItem: (item: ShoppingItem) => void;
  deleteShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  togglePantryItem: (id: string) => void;
  clearCompletedShopping: () => void;
  addBulkShoppingItems: (items: Array<Omit<ShoppingItem, 'id' | 'addedAt'>>) => void;

  schedule: ScheduleBlock[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleBlock[]>>;

  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchPersona: (persona: PersonaType) => void;
  upgradeToPro: (code?: string) => boolean;

  // Gamification & Rewards
  quests: DailyQuest[];
  claimQuest: (id: string) => void;
  rewards: CustomReward[];
  redeemReward: (id: string) => boolean;
  addCustomReward: (reward: Omit<CustomReward, 'id' | 'claimedTimes'>) => void;
  gainXp: (amount: number, reason?: string) => void;

  // Ambient Focus Audio
  ambientSound: 'none' | 'rain' | 'binaural' | 'whitenoise';
  ambientVolume: number;
  toggleAmbientSound: (sound: 'none' | 'rain' | 'binaural' | 'whitenoise') => void;
  setAmbientVolumeLevel: (vol: number) => void;

  // Reminders
  reminders: AppReminder[];
  dismissReminder: (id: string) => void;
  addReminder: (title: string, category: string) => void;

  // Speech & Feedback
  speakText: (text: string) => void;
  triggerCelebration: () => void;
  triggerHaptic: () => void;
  isOnline: boolean;
}

const STORAGE_KEYS = {
  TASKS: 'smartlife_tasks_v1',
  HABITS: 'smartlife_habits_v1',
  SHOPPING: 'smartlife_shopping_v1',
  SCHEDULE: 'smartlife_schedule_v1',
  PROFILE: 'smartlife_profile_v1',
  QUESTS: 'smartlife_quests_v1',
  REWARDS: 'smartlife_rewards_v1',
  ONBOARDED: 'smartlife_onboarded_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'tasks' | 'habits' | 'shopping' | 'ai' | 'analytics'>('today');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const [shoppingModalOpen, setShoppingModalOpen] = useState(false);
  const [editingShoppingItem, setEditingShoppingItem] = useState<ShoppingItem | null>(null);

  const [aiIdeaModalOpen, setAiIdeaModalOpen] = useState(false);
  const [pomodoroModalOpen, setPomodoroModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [recipeLibraryOpen, setRecipeLibraryOpen] = useState(false);
  const [plannerPrintOpen, setPlannerPrintOpen] = useState(false);

  // Ambient Sound
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'binaural' | 'whitenoise'>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.3);

  // Persistent States
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_ADULT_PROFILE;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_HABITS;
  });

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOPPING);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SHOPPING;
  });

  const [schedule, setSchedule] = useState<ScheduleBlock[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SCHEDULE;
  });

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_QUESTS;
  });

  const [rewards, setRewards] = useState<CustomReward[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REWARDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REWARDS;
  });

  const [reminders, setReminders] = useState<AppReminder[]>([
    { id: 'rem-1', title: 'Q4 Review starts in 30 mins', time: '10:30', category: 'Work', read: false },
    { id: 'rem-2', title: 'Hydration goal: drink 500ml water', time: '12:00', category: 'Health', read: false },
  ]);

  // Check onboarding on first visit
  useEffect(() => {
    try {
      const hasOnboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
      if (!hasOnboarded) {
        setOnboardingOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync sound settings with soundFx manager
  useEffect(() => {
    soundFx.setEnabled(profile.settings.soundEnabled);
  }, [profile.settings.soundEnabled]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage quota error', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.warn('Storage quota error', e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(shoppingItems));
    } catch (e) {
      console.warn('Storage quota error', e);
    }
  }, [shoppingItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
    } catch (e) {
      console.warn('Storage quota error', e);
    }
  }, [schedule]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage quota error', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    } catch (e) {
      console.warn('Storage quota error', e);
    }
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    } catch (e) {
      console.warn('Storage quota error', e);
    }
  }, [rewards]);

  // Haptic Feedback Helper
  const triggerHaptic = useCallback(() => {
    if (profile.settings.hapticFeedback && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }
  }, [profile.settings.hapticFeedback]);

  // Confetti Celebratory Burst
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }
  }, []);

  // Text-To-Speech
  const speakText = useCallback((text: string) => {
    if (profile.settings.speechAudioEnabled) {
      soundFx.speak(text);
    }
  }, [profile.settings.speechAudioEnabled]);

  // Gamification: Gain XP & Level Up check
  const gainXp = useCallback((amount: number) => {
    setProfile((prev) => {
      const newXp = prev.xp + amount;
      const nextLevel = Math.floor(newXp / 150) + 1;
      if (nextLevel > prev.level) {
        soundFx.playLevelUp();
        triggerCelebration();
      }
      return {
        ...prev,
        xp: newXp,
        level: nextLevel,
        gems: prev.gems + (nextLevel > prev.level ? 10 : 0),
      };
    });
  }, [triggerCelebration]);

  // Claim Daily Quest
  const claimQuest = useCallback((id: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id && !q.claimed) {
          gainXp(q.xpReward);
          soundFx.playStreakMilestone();
          triggerCelebration();
          return { ...q, claimed: true };
        }
        return q;
      })
    );
  }, [gainXp, triggerCelebration]);

  // Redeem Reward
  const redeemReward = useCallback((id: string): boolean => {
    const target = rewards.find((r) => r.id === id);
    if (!target) return false;

    if (profile.xp >= target.costXp) {
      setProfile((prev) => ({
        ...prev,
        xp: prev.xp - target.costXp,
      }));
      setRewards((prev) =>
        prev.map((r) => (r.id === id ? { ...r, claimedTimes: r.claimedTimes + 1 } : r))
      );
      soundFx.playLevelUp();
      triggerCelebration();
      return true;
    }
    return false;
  }, [profile.xp, rewards, triggerCelebration]);

  const addCustomReward = useCallback((data: Omit<CustomReward, 'id' | 'claimedTimes'>) => {
    const newReward: CustomReward = {
      ...data,
      id: `rew-${Date.now()}`,
      claimedTimes: 0,
    };
    setRewards((prev) => [newReward, ...prev]);
    soundFx.playTap();
  }, []);

  // Ambient Sound Controls
  const toggleAmbientSound = useCallback((sound: 'none' | 'rain' | 'binaural' | 'whitenoise') => {
    if (sound === 'none' || ambientSound === sound) {
      soundFx.stopAmbient();
      setAmbientSound('none');
    } else {
      setAmbientSound(sound);
      soundFx.startAmbient(sound, ambientVolume);
    }
    soundFx.playTap();
  }, [ambientSound, ambientVolume]);

  const setAmbientVolumeLevel = useCallback((vol: number) => {
    setAmbientVolume(vol);
    soundFx.setAmbientVolume(vol);
  }, []);

  // Task Mutators
  const addTask = useCallback((data: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: data.status || 'todo',
      recurrence: data.recurrence || 'none',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    soundFx.playTap();
    triggerHaptic();
  }, [triggerHaptic]);

  const updateTask = useCallback((updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    soundFx.playTap();
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    soundFx.playTap();
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            soundFx.playSuccess();
            triggerHaptic();
            gainXp(15);
            setProfile((p) => ({
              ...p,
              totalTasksCompleted: p.totalTasksCompleted + 1,
            }));
            // Update quests progress
            setQuests((qList) =>
              qList.map((q) =>
                q.type === 'tasks'
                  ? { ...q, currentCount: Math.min(q.targetCount, q.currentCount + 1) }
                  : q
              )
            );
          } else {
            soundFx.playTap();
          }
          return {
            ...t,
            completed: nextState,
            status: nextState ? 'completed' : 'todo',
            completedAt: nextState ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  }, [gainXp, triggerHaptic]);

  const setTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDone = status === 'completed';
          if (isDone && !t.completed) {
            gainXp(15);
            soundFx.playSuccess();
          }
          return {
            ...t,
            status,
            completed: isDone,
            completedAt: isDone ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  }, [gainXp]);

  const toggleTaskFavorite = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t))
    );
    soundFx.playTap();
  }, []);

  const addBulkTasks = useCallback((newItems: Array<Omit<Task, 'id' | 'createdAt'>>) => {
    const created: Task[] = newItems.map((item, index) => ({
      ...item,
      id: `task-ai-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
    }));
    setTasks((prev) => [...created, ...prev]);
    soundFx.playSuccess();
    triggerCelebration();
  }, [triggerCelebration]);

  // Habit Mutators
  const addHabit = useCallback((data: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...data,
      id: `habit-${Date.now()}`,
      streak: 0,
      bestStreak: 0,
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
    soundFx.playTap();
  }, []);

  const updateHabit = useCallback((updated: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    soundFx.playTap();
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    soundFx.playTap();
  }, []);

  const toggleHabitDate = useCallback((id: string, dateStr = getTodayDateString()) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const isDone = h.completedDates.includes(dateStr);
          let newDates: string[];
          let newStreak = h.streak;

          if (isDone) {
            newDates = h.completedDates.filter((d) => d !== dateStr);
            newStreak = Math.max(0, newStreak - 1);
            soundFx.playTap();
          } else {
            newDates = [...h.completedDates, dateStr];
            newStreak = h.streak + 1;
            soundFx.playSuccess();
            triggerHaptic();
            gainXp(12);

            // Update quest progress
            setQuests((qList) =>
              qList.map((q) =>
                q.type === 'habits'
                  ? { ...q, currentCount: Math.min(q.targetCount, q.currentCount + 1) }
                  : q
              )
            );

            if (newStreak >= 7 && newStreak % 7 === 0) {
              soundFx.playStreakMilestone();
              triggerCelebration();
            }
          }

          const newBest = Math.max(h.bestStreak, newStreak);
          return {
            ...h,
            completedDates: newDates,
            streak: newStreak,
            bestStreak: newBest,
          };
        }
        return h;
      })
    );
  }, [gainXp, triggerHaptic, triggerCelebration]);

  const toggleHabitFavorite = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h))
    );
  }, []);

  // Shopping Mutators
  const addShoppingItem = useCallback((item: Omit<ShoppingItem, 'id' | 'addedAt'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: `shop-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    setShoppingItems((prev) => [newItem, ...prev]);
    soundFx.playTap();
  }, []);

  const updateShoppingItem = useCallback((updated: ShoppingItem) => {
    setShoppingItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    soundFx.playTap();
  }, []);

  const deleteShoppingItem = useCallback((id: string) => {
    setShoppingItems((prev) => prev.filter((item) => item.id !== id));
    soundFx.playTap();
  }, []);

  const toggleShoppingItem = useCallback((id: string) => {
    setShoppingItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.completed;
          if (next) soundFx.playSuccess();
          return { ...item, completed: next };
        }
        return item;
      })
    );
  }, []);

  const togglePantryItem = useCallback((id: string) => {
    setShoppingItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, inPantry: !item.inPantry };
        }
        return item;
      })
    );
    soundFx.playTap();
  }, []);

  const clearCompletedShopping = useCallback(() => {
    setShoppingItems((prev) => prev.filter((item) => !item.completed));
    soundFx.playTap();
  }, []);

  const addBulkShoppingItems = useCallback((items: Array<Omit<ShoppingItem, 'id' | 'addedAt'>>) => {
    const created: ShoppingItem[] = items.map((it, idx) => ({
      ...it,
      id: `shop-bulk-${Date.now()}-${idx}`,
      addedAt: new Date().toISOString(),
    }));
    setShoppingItems((prev) => [...created, ...prev]);
    soundFx.playSuccess();
    triggerCelebration();
  }, [triggerCelebration]);

  // Profile & Persona
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      settings: updates.settings ? { ...prev.settings, ...updates.settings } : prev.settings,
    }));
  }, []);

  const switchPersona = useCallback((persona: PersonaType) => {
    const preset = PERSONA_PRESETS[persona];
    if (preset) {
      setProfile((prev) => ({
        ...prev,
        persona,
        name: preset.name,
      }));
      setTasks(preset.tasks);
      setHabits(preset.habits);
      soundFx.playSuccess();
      triggerCelebration();
    }
  }, [triggerCelebration]);

  const upgradeToPro = useCallback((code?: string): boolean => {
    const validCodes = ['SMART2026', 'STUDENT', 'VIP', 'TRIAL', 'PROMO'];
    if (!code || validCodes.includes(code.trim().toUpperCase())) {
      setProfile((prev) => ({
        ...prev,
        isPro: true,
        proExpiryDate: '2027-12-31',
        aiCreditsLeft: 9999,
        gems: prev.gems + 100,
      }));
      soundFx.playStreakMilestone();
      triggerCelebration();
      return true;
    }
    return false;
  }, [triggerCelebration]);

  // Reminders
  const dismissReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    soundFx.playTap();
  }, []);

  const addReminder = useCallback((title: string, category: string) => {
    const newRem: AppReminder = {
      id: `rem-${Date.now()}`,
      title,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
      read: false,
    };
    setReminders((prev) => [newRem, ...prev]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchOpen,
        setSearchOpen,
        searchQuery,
        setSearchQuery,
        taskModalOpen,
        setTaskModalOpen,
        editingTask,
        setEditingTask,
        habitModalOpen,
        setHabitModalOpen,
        editingHabit,
        setEditingHabit,
        shoppingModalOpen,
        setShoppingModalOpen,
        editingShoppingItem,
        setEditingShoppingItem,
        aiIdeaModalOpen,
        setAiIdeaModalOpen,
        pomodoroModalOpen,
        setPomodoroModalOpen,
        proModalOpen,
        setProModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        onboardingOpen,
        setOnboardingOpen,
        rewardsModalOpen,
        setRewardsModalOpen,
        recipeLibraryOpen,
        setRecipeLibraryOpen,
        plannerPrintOpen,
        setPlannerPrintOpen,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        setTaskStatus,
        toggleTaskFavorite,
        addBulkTasks,
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitDate,
        toggleHabitFavorite,
        shoppingItems,
        addShoppingItem,
        updateShoppingItem,
        deleteShoppingItem,
        toggleShoppingItem,
        togglePantryItem,
        clearCompletedShopping,
        addBulkShoppingItems,
        schedule,
        setSchedule,
        profile,
        updateProfile,
        switchPersona,
        upgradeToPro,
        quests,
        claimQuest,
        rewards,
        redeemReward,
        addCustomReward,
        gainXp,
        ambientSound,
        ambientVolume,
        toggleAmbientSound,
        setAmbientVolumeLevel,
        reminders,
        dismissReminder,
        addReminder,
        speakText,
        triggerCelebration,
        triggerHaptic,
        isOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
