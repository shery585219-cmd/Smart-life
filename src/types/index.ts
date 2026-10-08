export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Category = 'Work' | 'School' | 'Home' | 'Personal' | 'Health' | 'Shopping' | 'Finance';

export type PersonaType = 'adult' | 'teen' | 'kid';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskRecurrence = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status?: TaskStatus;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedMinutes?: number;
  subtasks: Subtask[];
  favorite?: boolean;
  reminderSet?: boolean;
  recurrence?: TaskRecurrence;
  createdAt: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  title: string;
  category: Category;
  icon: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  targetDaysPerWeek: number;
  streak: number;
  bestStreak: number;
  completedDates: string[]; // List of 'YYYY-MM-DD'
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  favorite?: boolean;
  color: string;
  reminderTime?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'Produce' | 'Dairy & Eggs' | 'Bakery' | 'Meat & Seafood' | 'Pantry' | 'Beverages' | 'Snacks' | 'Household';
  quantity: string;
  estimatedPrice?: number;
  completed: boolean;
  inPantry?: boolean; // If item is already at home / pantry
  favorite?: boolean;
  addedAt: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  xpReward: number;
  targetCount: number;
  currentCount: number;
  type: 'tasks' | 'habits' | 'focus' | 'shop';
  claimed: boolean;
}

export interface CustomReward {
  id: string;
  title: string;
  costXp: number;
  icon: string;
  description: string;
  claimedTimes: number;
}

export interface GoalRoadmap {
  id: string;
  title: string;
  timeframe: string;
  progressPercent: number;
  dailyHabitSuggestion?: string;
  milestones: {
    phase: string;
    title: string;
    description: string;
    keyActions: string[];
    completed?: boolean;
  }[];
  createdAt: string;
}

export interface ScheduleBlock {
  id: string;
  time: string;
  title: string;
  type: 'task' | 'habit' | 'break' | 'personal' | 'study';
  tip?: string;
  completed?: boolean;
}

export interface DailySummary {
  date: string;
  highlight: string;
  summary: string;
  score: number;
  strengths: string[];
  nextDaySuggestion: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  persona: PersonaType;
  avatarSeed: string;
  isPro: boolean;
  proExpiryDate?: string;
  streakDays: number;
  totalTasksCompleted: number;
  referralCode: string;
  friendsReferred: number;
  aiCreditsLeft: number;
  // Gamification
  xp: number;
  level: number;
  gems: number;
  settings: {
    darkMode: boolean;
    soundEnabled: boolean;
    hapticFeedback: boolean;
    notificationsEnabled: boolean;
    largeFontMode: boolean;
    mobileFrameView: boolean;
    speechAudioEnabled: boolean;
    wakeTime: string;
    bedTime: string;
  };
}

export interface AppReminder {
  id: string;
  title: string;
  time: string;
  category: string;
  read: boolean;
}
