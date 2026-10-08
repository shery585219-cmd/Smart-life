import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { profile } = useApp();
  const isMobileFrame = profile.settings.mobileFrameView;

  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (!isMobileFrame) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-2 sm:p-6 transition-colors">
      {/* Phone Hardware Mockup Outer Shell */}
      <div className="w-full max-w-[425px] h-[92vh] max-h-[890px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-slate-800/80 flex flex-col relative overflow-hidden">
        {/* Screen Bezel & Container */}
        <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[38px] flex flex-col overflow-hidden relative shadow-inner">
          {/* iOS Style Status Bar */}
          <div className="w-full h-9 bg-transparent flex items-center justify-between px-6 shrink-0 z-30 select-none text-[11px] font-semibold text-slate-800 dark:text-slate-200">
            <span>{currentTime}</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-4.5 bg-black rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 ml-auto mr-2" />
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Body Content with independent scrolling */}
          <div className="flex-1 overflow-y-auto flex flex-col relative">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-full h-4 bg-transparent flex items-center justify-center shrink-0 z-30 pointer-events-none pb-1">
            <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
