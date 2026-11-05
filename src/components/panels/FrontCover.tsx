import React from 'react';
import { GoldBorderFrame } from '../common/GoldBorderFrame';
import { DiamondEmblem } from '../common/DiamondEmblem';
import { InvitationData } from '../../types/invitation';

interface FrontCoverProps {
  data: InvitationData;
  onOpen?: () => void;
  isInteractive?: boolean;
}

export const FrontCover: React.FC<FrontCoverProps> = ({ 
  data, 
  onOpen, 
  isInteractive = false 
}) => {
  return (
    <GoldBorderFrame className="aspect-[1/1.414] shadow-2xl">
      <div className="flex-1 flex flex-col justify-between items-center text-center py-8 sm:py-12 px-4 select-none">
        
        {/* Top Decorative Space with University Tag */}
        <div className="pt-4 sm:pt-6">
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase text-[#8B6B34] font-semibold">
            {data.universityName}
          </p>
          <div className="w-12 h-[1px] bg-[#C59D5F]/50 mx-auto mt-2" />
        </div>

        {/* Center Main Titles matching Canva Page 1 */}
        <div className="my-auto space-y-3 sm:space-y-4">
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.18em] text-[#001E3D] leading-tight">
            GRADUATION
          </h1>
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.22em] text-[#8B6B34] leading-tight">
            CEREMONY
          </h2>

          <div className="pt-4 sm:pt-6">
            <p className="font-garamond italic text-lg sm:text-xl md:text-2xl text-[#3A404D] tracking-wide font-normal">
              You're warmly invited
            </p>
          </div>
        </div>

        {/* Bottom Diamond & Open Prompt */}
        <div className="pb-4 sm:pb-6 flex flex-col items-center gap-3">
          <DiamondEmblem size="md" />

          {isInteractive && (
            <button
              onClick={onOpen}
              className="mt-3 group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#001E3D] text-[#F5DEB0] font-sans text-xs tracking-wider uppercase font-semibold transition-all duration-300 hover:bg-[#032B52] hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <span>Mở thiệp mời</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </GoldBorderFrame>
  );
};

