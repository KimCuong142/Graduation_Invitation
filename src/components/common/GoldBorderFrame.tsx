import React from 'react';

interface GoldBorderFrameProps {
  className?: string;
  children: React.ReactNode;
}

export const GoldBorderFrame: React.FC<GoldBorderFrameProps> = ({ className = '', children }) => {
  return (
    <div className={`relative w-full h-full bg-card-parchment overflow-hidden ${className}`}>
      {/* Decorative Outer Border Image from Canva */}
      <img
        src="/assets/gold-ornate-border.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-20"
      />
      
      {/* Inner Padding Container for Content */}
      <div className="relative z-10 w-full h-full px-6 py-7 sm:px-8 sm:py-9 flex flex-col">
        {children}
      </div>
    </div>
  );
};

