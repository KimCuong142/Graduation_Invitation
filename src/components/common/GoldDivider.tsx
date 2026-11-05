import React from 'react';

interface GoldDividerProps {
  className?: string;
  variant?: 'crest' | 'ornamental' | 'simple';
}

export const GoldDivider: React.FC<GoldDividerProps> = ({ 
  className = '', 
  variant = 'crest' 
}) => {
  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-center w-full my-3 ${className}`}>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C59D5F] to-transparent opacity-60" />
      </div>
    );
  }

  const src = variant === 'crest' 
    ? '/assets/gold-crest-divider.png' 
    : '/assets/gold-ornamental-divider.png';

  return (
    <div className={`flex justify-center items-center my-2 select-none ${className}`}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="w-48 sm:w-56 max-h-5 object-contain opacity-85"
      />
    </div>
  );
};

