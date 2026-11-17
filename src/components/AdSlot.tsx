import React from 'react';

interface AdSlotProps {
  /**
   * Set to true only when connected to a verified ad provider script (e.g., Google AdSense).
   * Remains omitted when false so no fake advertisements are ever displayed.
   */
  enabled?: boolean;
  slotId?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ enabled = false, slotId }) => {
  if (!enabled || !slotId) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className="relative z-10 w-full max-w-2xl mx-auto px-4 pb-2 hidden md:flex items-center justify-center"
    >
      <div
        id={slotId}
        className="w-full max-w-[728px] h-[90px] rounded-xl border border-white/10 bg-[#070D35]/60 flex items-center justify-center text-xs text-[#A7EEFF]/50"
      />
    </aside>
  );
};
