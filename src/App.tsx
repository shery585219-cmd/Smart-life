import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/common/MobileFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { TodayTab } from './components/tabs/TodayTab';
import { TasksTab } from './components/tabs/TasksTab';
import { HabitsTab } from './components/tabs/HabitsTab';
import { ShoppingTab } from './components/tabs/ShoppingTab';
import { AiTab } from './components/tabs/AiTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { TaskModal } from './components/modals/TaskModal';
import { HabitModal } from './components/modals/HabitModal';
import { ShoppingModal } from './components/modals/ShoppingModal';
import { AIIdeaModal } from './components/modals/AIIdeaModal';
import { PomodoroModal } from './components/modals/PomodoroModal';
import { ProModal } from './components/modals/ProModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SearchModal } from './components/modals/SearchModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { RewardsModal } from './components/modals/RewardsModal';
import { RecipeLibraryModal } from './components/modals/RecipeLibraryModal';
import { PrintDailyPlannerModal } from './components/modals/PrintDailyPlannerModal';
import { WifiOff, BarChart2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, profile, isOnline } = useApp();

  // Sync dark class on root html tag
  useEffect(() => {
    if (profile.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.settings.darkMode]);

  return (
    <MobileFrame>
      {/* Top Header */}
      <Header />

      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-amber-950 px-3 py-1.5 text-center text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline mode active: all your changes are safely saved locally.</span>
        </div>
      )}

      {/* Navigation Sub-bar for Analytics Quick Toggle */}
      <div className="px-4 pt-2 max-w-2xl mx-auto w-full flex items-center justify-end">
        <button
          onClick={() => setActiveTab(activeTab === 'analytics' ? 'today' : 'analytics')}
          className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>{activeTab === 'analytics' ? 'Close Charts' : 'Progress Charts'}</span>
        </button>
      </div>

      {/* Active Tab Screen */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {activeTab === 'today' && <TodayTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'habits' && <HabitsTab />}
        {activeTab === 'shopping' && <ShoppingTab />}
        {activeTab === 'ai' && <AiTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>

      {/* Bottom Sticky Mobile Navigation */}
      <BottomNav />

      {/* Interactive Modals */}
      <TaskModal />
      <HabitModal />
      <ShoppingModal />
      <AIIdeaModal />
      <PomodoroModal />
      <ProModal />
      <SettingsModal />
      <SearchModal />
      <OnboardingModal />
      <RewardsModal />
      <RecipeLibraryModal />
      <PrintDailyPlannerModal />
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
