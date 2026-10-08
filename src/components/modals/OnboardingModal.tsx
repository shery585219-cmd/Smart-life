import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Flame,
  Check,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PersonaType } from '../../types';
import { soundFx } from '../../utils/audio';

export const OnboardingModal: React.FC = () => {
  const {
    onboardingOpen,
    setOnboardingOpen,
    switchPersona,
    profile,
    updateProfile,
    triggerCelebration,
  } = useApp();

  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('adult');
  const [selectedHabit, setSelectedHabit] = useState('Morning Glass of Water');

  if (!onboardingOpen) return null;

  const starterHabits = [
    'Drink a glass of water first thing',
    '15 minutes of deep reading',
    'Quick evening desk / room reset',
    '30-minute daily walk / movement',
  ];

  const handleFinish = () => {
    localStorage.setItem('smartlife_onboarded_v1', 'true');
    switchPersona(selectedPersona);
    updateProfile({
      streakDays: Math.max(1, profile.streakDays),
    });
    soundFx.playStreakMilestone();
    triggerCelebration();
    setOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col p-6 text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-6 justify-center">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                step === s
                  ? 'w-8 bg-blue-600'
                  : step > s
                  ? 'w-3 bg-emerald-500'
                  : 'w-3 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome & Value Prop */}
        {step === 1 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30 text-3xl font-black">
              S
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Welcome to SmartLife
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                The all-in-one assistant built for children, teens, and adults.
                Organize tasks, track habits, create schedules, and crush everyday goals with AI.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left pt-2">
              <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Clear Mind
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Never forget homework, chores, or work deadlines.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
                <div className="text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Streaks & Habits
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Build consistency with rewarding visual streaks.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playTap();
                setStep(2);
              }}
              className="w-full mt-4 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Choose Persona */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold">Who is using SmartLife?</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We'll tailor the language, default routines, and simplicity for you.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { id: 'kid', title: 'Kid Explorer', desc: 'Chore charts, school bags, piano, and pet care', icon: '⭐' },
                { id: 'teen', title: 'Student / Teen', desc: 'Homework, exam prep, soccer, study blocks', icon: '🎒' },
                { id: 'adult', title: 'Adult / Work', desc: 'Projects, home, fitness, errands, & finances', icon: '💼' },
              ].map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPersona(p.id as PersonaType);
                      soundFx.playTap();
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-xs">{p.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-600 dark:text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => {
                  soundFx.playTap();
                  setStep(3);
                }}
                className="flex-1 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-98"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Starter Habit & First Streak */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <Flame className="w-6 h-6 fill-amber-500" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Lock in your Day 1 Streak</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pick 1 tiny habit to kickstart your momentum right now.
              </p>
            </div>

            <div className="space-y-2 text-left pt-1">
              {starterHabits.map((h, i) => {
                const isSelected = selectedHabit === h;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedHabit(h);
                      soundFx.playTap();
                    }}
                    className={`w-full p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{h}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleFinish}
              className="w-full mt-2 py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:brightness-105 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Zap className="w-4 h-4" />
              Enter SmartLife & Claim Streak!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
