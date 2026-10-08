import React, { useRef } from 'react';
import {
  X,
  User,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Shield,
  Download,
  Upload,
  RotateCcw,
  CloudCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PersonaType } from '../../types';

export const SettingsModal: React.FC = () => {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    profile,
    updateProfile,
    switchPersona,
    tasks,
    habits,
    shoppingItems,
    schedule,
    triggerCelebration,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!settingsModalOpen) return null;

  const personas: { id: PersonaType; title: string; subtitle: string; emoji: string }[] = [
    { id: 'kid', title: 'Kid Explorer', subtitle: 'Simple tasks, cute routines & chores', emoji: '⭐' },
    { id: 'teen', title: 'Student / Teen', subtitle: 'Homework, exams, soccer, study blocks', emoji: '🎒' },
    { id: 'adult', title: 'Adult / Work', subtitle: 'Full work-life balance & productivity', emoji: '💼' },
  ];

  // Export JSON backup
  const handleExportData = () => {
    const backup = {
      profile,
      tasks,
      habits,
      shoppingItems,
      schedule,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartlife-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile) updateProfile(parsed.profile);
        if (parsed.tasks) localStorage.setItem('smartlife_tasks_v1', JSON.stringify(parsed.tasks));
        if (parsed.habits) localStorage.setItem('smartlife_habits_v1', JSON.stringify(parsed.habits));
        if (parsed.shoppingItems) localStorage.setItem('smartlife_shopping_v1', JSON.stringify(parsed.shoppingItems));
        triggerCelebration();
        alert('Data imported successfully! The app will refresh.');
        window.location.reload();
      } catch {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Settings & Preferences
          </h2>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Persona Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Select User Persona & Experience
            </label>
            <div className="space-y-2">
              {personas.map((p) => {
                const isSelected = profile.persona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => switchPersona(p.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xl">{p.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-xs">{p.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {p.subtitle}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme & Display Controls */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Display & Audio Controls
            </label>
            <div className="space-y-2">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2.5">
                  {profile.settings.darkMode ? (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Dark Theme</div>
                    <div className="text-[10px] text-slate-400">Reduce eye strain in low light</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !profile.settings.darkMode;
                    updateProfile({
                      settings: { ...profile.settings, darkMode: nextMode },
                    });
                    if (nextMode) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    profile.settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      profile.settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2.5">
                  {profile.settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Sound Chimes</div>
                    <div className="text-[10px] text-slate-400">Marimba completion feedback</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateProfile({
                      settings: {
                        ...profile.settings,
                        soundEnabled: !profile.settings.soundEnabled,
                      },
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    profile.settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      profile.settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Phone Frame Mockup Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Phone Shell Frame</div>
                    <div className="text-[10px] text-slate-400">Realistic smartphone mockup view</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateProfile({
                      settings: {
                        ...profile.settings,
                        mobileFrameView: !profile.settings.mobileFrameView,
                      },
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    profile.settings.mobileFrameView ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      profile.settings.mobileFrameView ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Cloud Sync & Storage */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Privacy & Cloud Storage
            </label>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                    Local-First & Private
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    Data stored safely on your device. Zero trackers.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2.5">
              <button
                type="button"
                onClick={handleExportData}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 flex items-center justify-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                Export Backup
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 flex items-center justify-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                <Upload className="w-3.5 h-3.5 text-teal-500" />
                Import Backup
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-400">
            SmartLife v2.4 • Built with Google AI Studio
          </div>
        </div>
      </div>
    </div>
  );
};
