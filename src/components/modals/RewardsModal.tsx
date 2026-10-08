import React, { useState } from 'react';
import {
  X,
  Trophy,
  Gift,
  Plus,
  Flame,
  Sparkles,
  Check,
  Star,
  Award,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RewardsModal: React.FC = () => {
  const {
    rewardsModalOpen,
    setRewardsModalOpen,
    profile,
    quests,
    claimQuest,
    rewards,
    redeemReward,
    addCustomReward,
    triggerCelebration,
  } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(150);
  const [newIcon, setNewIcon] = useState('🎁');
  const [newDesc, setNewDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!rewardsModalOpen) return null;

  const currentLevel = profile.level;
  const currentXp = profile.xp;
  const xpForNextLevel = currentLevel * 150;
  const xpCurrentLevelProgress = currentXp % 150;
  const levelProgressPct = Math.min(100, Math.round((xpCurrentLevelProgress / 150) * 100));

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCustomReward({
      title: newTitle.trim(),
      costXp: Number(newCost) || 100,
      icon: newIcon || '🎁',
      description: newDesc.trim() || 'Custom earned reward',
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
    triggerCelebration();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header Level Card */}
        <div className="p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white relative shrink-0">
          <button
            onClick={() => setRewardsModalOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black shadow-inner border border-white/30">
              Lv.{currentLevel}
            </div>

            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                Gamified Rhythm Engine
              </span>
              <h2 className="text-lg font-black tracking-tight leading-tight">
                Level {currentLevel} • Achiever
              </h2>
              <div className="flex items-center gap-2 text-xs font-semibold mt-0.5">
                <span>{currentXp} Total XP</span>
                <span>•</span>
                <span>💎 {profile.gems} Gems</span>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex justify-between text-[11px] font-bold mb-1">
              <span>Level Progress</span>
              <span>{xpCurrentLevelProgress} / 150 XP</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Quests & Rewards Shop */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Daily Quests */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Daily Power Quests
              </h3>
              <span className="text-[10px] text-slate-400">Resets daily</span>
            </div>

            <div className="space-y-2">
              {quests.map((q) => {
                const isReady = q.currentCount >= q.targetCount;
                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                      q.claimed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : isReady
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {q.title}
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">
                          +{q.xpReward} XP
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Progress: {q.currentCount}/{q.targetCount} completed
                      </div>
                    </div>

                    {q.claimed ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => claimQuest(q.id)}
                        disabled={!isReady}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-40 active:scale-95 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs"
                      >
                        Claim XP
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real Rewards Shop */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-rose-500" />
                Reward Yourself (Spend XP)
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> Add Custom
              </button>
            </div>

            {/* Custom Reward Creator */}
            {showAddForm && (
              <form onSubmit={handleCreateReward} className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2.5 mb-3 animate-in fade-in">
                <span className="font-bold text-blue-950 dark:text-blue-200 text-xs block">
                  Define a Real-Life Reward
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    placeholder="Emoji"
                    className="col-span-1 px-2 py-1.5 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-center text-sm"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Reward title (e.g. 1 hour gaming)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="col-span-3 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={50}
                    step={25}
                    value={newCost}
                    onChange={(e) => setNewCost(parseInt(e.target.value, 10))}
                    placeholder="XP Cost"
                    className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Save Reward
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rewards.map((r) => {
                const canAfford = currentXp >= r.costXp;
                return (
                  <div
                    key={r.id}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-2.5 mb-2">
                      <span className="text-2xl">{r.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">
                          {r.title}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {r.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        {r.costXp} XP
                      </span>

                      <button
                        onClick={() => redeemReward(r.id)}
                        disabled={!canAfford}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                          canAfford
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {canAfford ? 'Redeem' : 'Need XP'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
