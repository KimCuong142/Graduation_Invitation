import React, { useState } from 'react';
import { FrontCover } from '../panels/FrontCover';
import { InsideLeftPanel } from '../panels/InsideLeftPanel';
import { InsideCenterPanel } from '../panels/InsideCenterPanel';
import { InsideRightPanel } from '../panels/InsideRightPanel';
import { BackCover } from '../panels/BackCover';
import { InvitationData } from '../../types/invitation';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCw, BookOpen, Layers } from 'lucide-react';

interface RealisticTrifold3DProps {
  data: InvitationData;
}

export const RealisticTrifold3D: React.FC<RealisticTrifold3DProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackCover, setShowBackCover] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setShowBackCover(false);

    // Gold & Navy celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#001E3D', '#FAF6ED', '#C59D5F']
      });
    } catch (e) {
      // ignore
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowBackCover(false);
  };

  const toggleBackCover = () => {
    setShowBackCover(prev => !prev);
    setIsOpen(false);
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-4">
      
      {/* Control Actions bar */}
      <div className="flex items-center gap-3 mb-6 z-20">
        <button
          onClick={isOpen ? handleClose : handleOpen}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#001E3D] text-[#F5DEB0] border border-[#C59D5F]/40 shadow-lg text-xs font-sans font-bold hover:bg-[#032B52] transition-transform active:scale-95"
        >
          {isOpen ? (
            <>
              <Layers className="w-4 h-4 text-[#C59D5F]" />
              <span>Gập thiệp lại (Close)</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4 text-[#C59D5F]" />
              <span>Mở thiệp mời 3D (Open 3D)</span>
            </>
          )}
        </button>

        {!isOpen && (
          <button
            onClick={toggleBackCover}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800 text-stone-200 border border-stone-700 shadow text-xs font-sans font-medium hover:bg-stone-700 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#C59D5F]" />
            <span>{showBackCover ? 'Xem bìa trước' : 'Lật xem bìa sau'}</span>
          </button>
        )}
      </div>

      {/* 3D Stage Container */}
      <div className="w-full max-w-5xl flex justify-center items-center perspective-2000 py-2">
        
        {/* State A: Folded Card (Front Cover or Back Cover) */}
        {!isOpen && (
          <div 
            onClick={!showBackCover ? handleOpen : undefined}
            className={`w-full max-w-sm cursor-pointer transition-all duration-700 transform hover:scale-[1.02] ${
              showBackCover ? 'rotate-y-180' : ''
            }`}
          >
            {showBackCover ? (
              <BackCover data={data} />
            ) : (
              <FrontCover data={data} onOpen={handleOpen} isInteractive={true} />
            )}
          </div>
        )}

        {/* State B: Unfolded 3-Panel Inside Spread with Realistic 3D Unfolding Animation */}
        {isOpen && (
          <div className="w-full transition-all duration-1000 ease-out animate-fadeIn">
            {/* 3-Panel Panoramic Grid */}
            <div className="relative w-full shadow-2xl rounded-sm overflow-hidden bg-card-parchment p-1 border border-[#D4AF37]/30">
              
              {/* Continuous Panoramic Top Ribbon Banner */}
              <div className="hidden lg:block absolute top-0 inset-x-0 h-20 pointer-events-none select-none z-30 overflow-hidden">
                <img
                  src="/assets/navy-gold-ribbon-banner.png"
                  alt=""
                  className="w-full h-full object-fill opacity-95 filter drop-shadow-[0_2px_5px_rgba(0,30,61,0.3)]"
                />
              </div>

              {/* 3 Inside Panels Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#C59D5F]/20 relative">
                
                {/* 3D Fold shadows on desktop */}
                <div className="hidden lg:block absolute top-0 bottom-0 left-1/3 -ml-2 w-4 pointer-events-none z-20 bg-gradient-to-r from-stone-900/10 via-stone-900/20 to-transparent" />
                <div className="hidden lg:block absolute top-0 bottom-0 right-1/3 -mr-2 w-4 pointer-events-none z-20 bg-gradient-to-l from-stone-900/10 via-stone-900/20 to-transparent" />

                {/* Left Panel */}
                <div className="w-full max-w-sm lg:max-w-none mx-auto">
                  <InsideLeftPanel data={data} />
                </div>

                {/* Center Panel */}
                <div className="w-full max-w-sm lg:max-w-none mx-auto">
                  <InsideCenterPanel data={data} />
                </div>

                {/* Right Panel */}
                <div className="w-full max-w-sm lg:max-w-none mx-auto">
                  <InsideRightPanel data={data} />
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* Helpful Hint */}
      <p className="mt-4 text-xs text-stone-400 font-sans flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#C59D5F]" />
        <span>
          {isOpen 
            ? 'Thiệp mời đã được mở hoàn toàn với trọn bộ 3 mặt trong liên hoàn' 
            : 'Nhấp trực tiếp vào bìa thiệp hoặc nút bấm để mở thiệp 3D'}
        </span>
      </p>

    </div>
  );
};

