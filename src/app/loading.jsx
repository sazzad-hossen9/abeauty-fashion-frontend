import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-white">
      <div className="w-12 h-12 rounded-full border-4 border-brand-roseLight border-t-brand-rose animate-spin" />
      <span className="text-[14px] font-semibold text-brand-muted tracking-wider uppercase">
        Loading...
      </span>
    </div>
  );
}

