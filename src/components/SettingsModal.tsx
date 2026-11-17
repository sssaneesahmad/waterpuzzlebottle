import React, { useState } from 'react';
import {
  BookOpen,
  Eye,
  Music,
  RotateCcw,
  Smartphone,
  Volume2,
  X,
} from 'lucide-react';
import { GameSettings } from '../game/types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (next: GameSettings) => void;
  onOpenHowToPlay: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  icon,
  label,
  description,
  checked,
  onToggle,
}) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-b-0">
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#18276E] text-[#27D9FF] shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-[#F3F8FF]">{label}</div>
        <div className="text-xs text-[#A7EEFF]/70">{description}</div>
      </div>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF] ${
        checked ? 'bg-[#087BFF] shadow-[0_0_14px_rgba(39,217,255,0.5)]' : 'bg-[#1D285E]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-[#F3F8FF] shadow-md transform transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onOpenHowToPlay,
  onResetProgress,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030620]/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#121D5E] to-[#090F3A] border border-[#56C6FF]/40 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2
            id="settings-title"
            className="font-display text-xl font-bold text-[#F3F8FF]"
          >
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-[#F3F8FF] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="mt-2">
          <ToggleRow
            icon={<Volume2 className="w-4 h-4" />}
            label="Sound Effects"
            description="Water pours and crystal chimes"
            checked={settings.soundEnabled}
            onToggle={() =>
              onUpdateSettings({
                ...settings,
                soundEnabled: !settings.soundEnabled,
              })
            }
          />
          <ToggleRow
            icon={<Music className="w-4 h-4" />}
            label="Ambient Music"
            description="Gentle soothing melody"
            checked={settings.musicEnabled}
            onToggle={() =>
              onUpdateSettings({
                ...settings,
                musicEnabled: !settings.musicEnabled,
              })
            }
          />
          <ToggleRow
            icon={<Smartphone className="w-4 h-4" />}
            label="Vibration Feedback"
            description="Subtle haptics on supported devices"
            checked={settings.vibrationEnabled}
            onToggle={() =>
              onUpdateSettings({
                ...settings,
                vibrationEnabled: !settings.vibrationEnabled,
              })
            }
          />
          <ToggleRow
            icon={<Eye className="w-4 h-4" />}
            label="Colorblind Symbols"
            description="Show letter markers on liquid layers"
            checked={settings.colorblindSymbols}
            onToggle={() =>
              onUpdateSettings({
                ...settings,
                colorblindSymbols: !settings.colorblindSymbols,
              })
            }
          />
        </div>

        {/* Secondary Actions */}
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="w-full py-3 px-4 rounded-xl bg-[#162770] hover:bg-[#1E338E] border border-[#56C6FF]/35 text-sm font-semibold text-[#F3F8FF] flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
          >
            <BookOpen className="w-4 h-4 text-[#27D9FF]" />
            <span>How to Play</span>
          </button>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#F13B52]/12 hover:bg-[#F13B52]/20 border border-[#F13B52]/35 text-sm font-semibold text-[#FF8A98] flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F13B52]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Progress</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#F13B52]/15 border border-[#F13B52]/45 text-center">
              <p className="text-xs text-[#FFD2D8] font-medium mb-3">
                Reset all levels, move history, and coins back to Level 1?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#F3F8FF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmReset(false);
                    onResetProgress();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#F13B52] hover:bg-[#FF4F66] text-xs font-bold text-[#F3F8FF] cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
