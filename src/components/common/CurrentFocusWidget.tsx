import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle, Clock, Sparkles, ChevronRight, Timer } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';

export const CurrentFocusWidget: React.FC = () => {
  const { tasks, toggleTaskComplete, setPomodoroModalOpen, triggerCelebration } = useApp();

  // Find the first pending urgent/high task or top task
  const activeFocusTask = tasks.find((t) => !t.completed && (t.priority === 'urgent' || t.priority === 'high')) ||
    tasks.find((t) => !t.completed);

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      soundFx.playBell();
      triggerCelebration();
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, triggerCelebration]);

  if (!activeFocusTask) return null;

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="p-3.5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-blue-500/30 backdrop-blur-md flex items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-blue-500/25">
          <Timer className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
              Current Target
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
              {activeFocusTask.priority}
            </span>
          </div>

          <div className="font-bold text-slate-900 dark:text-white truncate text-xs">
            {activeFocusTask.title}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono font-bold text-xs text-slate-700 dark:text-blue-300 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {timeFormatted}
        </span>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition active:scale-90 ${
            isRunning ? 'bg-amber-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title={isRunning ? 'Pause' : 'Start Focus Interval'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button
          onClick={() => toggleTaskComplete(activeFocusTask.id)}
          className="w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition active:scale-90"
          title="Mark Completed"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
