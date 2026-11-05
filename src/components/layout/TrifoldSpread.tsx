import React, { useState } from 'react';
import { InsideLeftPanel } from '../panels/InsideLeftPanel';
import { InsideCenterPanel } from '../panels/InsideCenterPanel';
import { InsideRightPanel } from '../panels/InsideRightPanel';
import { InvitationData } from '../../types/invitation';

interface TrifoldSpreadProps {
  data: InvitationData;
}

export const TrifoldSpread: React.FC<TrifoldSpreadProps> = ({ data }) => {
  const [activeMobileTab, setActiveMobileTab] = useState<0 | 1 | 2>(1);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center select-none">
      
      {/* Mobile Tab Selector (Visible only on small screens) */}
      <div className="lg:hidden flex items-center bg-stone-800/80 p-1 rounded-full mb-4 border border-stone-700/50 shadow-md">
        <button
          onClick={() => setActiveMobileTab(0)}
          className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${
            activeMobileTab === 0 
              ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow' 
              : 'text-stone-300 hover:text-white'
          }`}
        >
          Cử nhân & Diamond
        </button>
        <button
          onClick={() => setActiveMobileTab(1)}
          className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${
            activeMobileTab === 1 
              ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow' 
              : 'text-stone-300 hover:text-white'
          }`}
        >
          Thư mời chính
        </button>
        <button
          onClick={() => setActiveMobileTab(2)}
          className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${
            activeMobileTab === 2 
              ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow' 
              : 'text-stone-300 hover:text-white'
          }`}
        >
          Đánh giá chất lượng
        </button>
      </div>

      {/* Desktop 3-Panel Panoramic Container */}
      <div className="relative w-full shadow-2xl rounded-sm overflow-hidden bg-card-parchment p-1 border border-[#D4AF37]/30">
        
        {/* Continuous Panoramic Top Ribbon Banner across all 3 inside panels */}
        <div className="hidden lg:block absolute top-0 inset-x-0 h-20 pointer-events-none select-none z-30 overflow-hidden">
          <img
            src="/assets/navy-gold-ribbon-banner.png"
            alt=""
            className="w-full h-full object-fill opacity-95 filter drop-shadow-[0_2px_5px_rgba(0,30,61,0.3)]"
          />
        </div>

        {/* 3 Panels Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-0 divide-x divide-[#C59D5F]/20 relative">
          
          {/* Subtle 3D Fold Crease Shadows between panels */}
          <div className="absolute top-0 bottom-0 left-1/3 -ml-2 w-4 pointer-events-none z-20 bg-gradient-to-r from-stone-900/10 via-stone-900/20 to-transparent" />
          <div className="absolute top-0 bottom-0 right-1/3 -mr-2 w-4 pointer-events-none z-20 bg-gradient-to-l from-stone-900/10 via-stone-900/20 to-transparent" />

          {/* Panel 1: Inside Left (Page 2) */}
          <div className="relative">
            <InsideLeftPanel data={data} />
          </div>

          {/* Panel 2: Inside Center (Page 3) */}
          <div className="relative">
            <InsideCenterPanel data={data} />
          </div>

          {/* Panel 3: Inside Right (Page 4) */}
          <div className="relative">
            <InsideRightPanel data={data} />
          </div>
        </div>

        {/* Mobile Single Panel View with Tabs */}
        <div className="lg:hidden w-full max-w-sm mx-auto">
          {activeMobileTab === 0 && <InsideLeftPanel data={data} />}
          {activeMobileTab === 1 && <InsideCenterPanel data={data} />}
          {activeMobileTab === 2 && <InsideRightPanel data={data} />}
        </div>

      </div>

      {/* Caption & Instructions */}
      <div className="mt-3 text-center text-xs text-stone-400 font-sans hidden sm:block">
        Trọn bộ 3 mặt trong trải rộng (Panoramic Inside Spread) · Chuẩn tỉ lệ thiệp gập Tri-fold A6
      </div>

    </div>
  );
};

