import React from 'react';

interface DiamondEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DiamondEmblem: React.FC<DiamondEmblemProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-6',
    md: 'w-12 h-9',
    lg: 'w-16 h-12',
  }[size];

  return (
    <div className={`flex items-center justify-center gap-2 select-none ${className}`}>
      <img
        src="/assets/gold-branch-flourish.png"
        alt=""
        className="h-2.5 object-contain opacity-70 transform -scale-x-100"
      />
      <img
        src="/assets/diamond-sparkle-emblem.png"
        alt="Diamond Sparkle Emblem"
        className={`${sizeClasses} object-contain filter drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]`}
      />
      <img
        src="/assets/gold-branch-flourish.png"
        alt=""
        className="h-2.5 object-contain opacity-70"
      />
    </div>
  );
};

