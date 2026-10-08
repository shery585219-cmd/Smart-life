import React from 'react';
import { Volume2, VolumeX, CloudRain, Waves, Wind } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AmbientSoundPlayer: React.FC = () => {
  const { ambientSound, toggleAmbientSound, ambientVolume, setAmbientVolumeLevel } = useApp();

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1.5 pr-0.5">
        Ambience:
      </span>

      <button
        type="button"
        onClick={() => toggleAmbientSound('rain')}
        className={`px-2 py-1 rounded-xl font-bold flex items-center gap-1 transition ${
          ambientSound === 'rain'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <CloudRain className="w-3 h-3" />
        <span>Rain</span>
      </button>

      <button
        type="button"
        onClick={() => toggleAmbientSound('binaural')}
        className={`px-2 py-1 rounded-xl font-bold flex items-center gap-1 transition ${
          ambientSound === 'binaural'
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Waves className="w-3 h-3" />
        <span>Alpha 10Hz</span>
      </button>

      <button
        type="button"
        onClick={() => toggleAmbientSound('whitenoise')}
        className={`px-2 py-1 rounded-xl font-bold flex items-center gap-1 transition ${
          ambientSound === 'whitenoise'
            ? 'bg-teal-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Wind className="w-3 h-3" />
        <span>Brown Noise</span>
      </button>

      {ambientSound !== 'none' && (
        <div className="flex items-center gap-1 pl-1 ml-auto">
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={ambientVolume}
            onChange={(e) => setAmbientVolumeLevel(parseFloat(e.target.value))}
            className="w-14 h-1 accent-blue-600"
            title="Volume"
          />
          <button
            type="button"
            onClick={() => toggleAmbientSound('none')}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
            title="Stop audio"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
