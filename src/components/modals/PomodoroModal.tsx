import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Timer,
  CheckCircle,
  Coffee,
  Sparkles,
  Flame,
  CloudRain,
  Waves,
  Wind,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';

export const PomodoroModal: React.FC = () => {
  const {
    pomodoroModalOpen,
    setPomodoroModalOpen,
    tasks,
    toggleTaskComplete,
    gainXp,
    ambientSound,
    toggleAmbientSound,
    ambientVolume,
    setAmbientVolumeLevel,
    triggerCelebration,
    triggerHaptic,
  } = useApp();

  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const DURATIONS = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    setTimeLeft(DURATIONS[mode]);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      soundFx.playBell();
      triggerHaptic();
      triggerCelebration();

      if (mode === 'focus') {
        setCompletedSessions((c) => c + 1);
        gainXp(25);
        setMode('shortBreak');
        if (selectedTaskId) {
          toggleTaskComplete(selectedTaskId);
        }
      } else {
        setMode('focus');
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, selectedTaskId, toggleTaskComplete, gainXp, triggerCelebration, triggerHaptic]);

  if (!pomodoroModalOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = DURATIONS[mode];
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const activeTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col items-center overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Focus & Study Timer
            </h2>
          </div>
          <button
            onClick={() => setPomodoroModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl my-3 text-xs font-semibold w-full justify-center">
          <button
            onClick={() => setMode('focus')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              mode === 'focus'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              mode === 'shortBreak'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Break (5m)
          </button>
          <button
            onClick={() => setMode('longBreak')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              mode === 'longBreak'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Long (15m)
          </button>
        </div>

        {/* Circular Progress & Timer Display */}
        <div className="relative w-44 h-44 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-100 dark:text-slate-800 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`stroke-current transition-all duration-500 ${
                mode === 'focus' ? 'text-rose-500' : 'text-teal-500'
              }`}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
              {formattedTime}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              {mode === 'focus' ? 'Deep Work (+25 XP)' : 'Rest & Breathe'}
            </span>
          </div>
        </div>

        {/* Focus Audio Ambience in Timer */}
        <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 my-2">
          <button
            onClick={() => toggleAmbientSound('rain')}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition ${
              ambientSound === 'rain' ? 'bg-blue-600 text-white' : 'text-slate-500'
            }`}
          >
            <CloudRain className="w-3 h-3" /> Rain
          </button>
          <button
            onClick={() => toggleAmbientSound('binaural')}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition ${
              ambientSound === 'binaural' ? 'bg-indigo-600 text-white' : 'text-slate-500'
            }`}
          >
            <Waves className="w-3 h-3" /> Alpha Waves
          </button>
          <button
            onClick={() => toggleAmbientSound('whitenoise')}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition ${
              ambientSound === 'whitenoise' ? 'bg-teal-600 text-white' : 'text-slate-500'
            }`}
          >
            <Wind className="w-3 h-3" /> Brown Noise
          </button>
        </div>

        {/* Task Link Picker */}
        <div className="w-full my-2">
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Focusing on:
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs truncate"
          >
            <option value="">General Focus / Study</option>
            {activeTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.category})
              </option>
            ))}
          </select>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-4 my-2">
          <button
            onClick={() => {
              setTimeLeft(DURATIONS[mode]);
              setIsRunning(false);
              soundFx.playTap();
            }}
            aria-label="Reset timer"
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsRunning(!isRunning);
              soundFx.playTap();
              triggerHaptic();
            }}
            aria-label={isRunning ? 'Pause' : 'Start'}
            className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
              mode === 'focus'
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>

          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center text-xs font-bold text-amber-500">
            <Flame className="w-4 h-4 mr-0.5 fill-amber-500" />
            {completedSessions}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-2">
          Completed {completedSessions} focus block{completedSessions !== 1 ? 's' : ''} today
        </p>
      </div>
    </div>
  );
};
