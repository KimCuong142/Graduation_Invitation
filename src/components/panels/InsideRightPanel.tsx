import React from 'react';
import { GoldBorderFrame } from '../common/GoldBorderFrame';
import { DiamondEmblem } from '../common/DiamondEmblem';
import { InvitationData } from '../../types/invitation';
import { CheckCircle2 } from 'lucide-react';

interface InsideRightPanelProps {
  data: InvitationData;
}

export const InsideRightPanel: React.FC<InsideRightPanelProps> = ({ data }) => {
  const g = data.diamondGrading;

  const qualityItems = [
    { label: 'COLOR', value: g.colorGrade },
    { label: `CLARITY (${g.clarityGrade})`, value: g.clarityGrade },
    { label: `CUT (${g.cutGrade.toUpperCase()})`, value: g.cutGrade },
    { label: `POLISH (${g.polish.toUpperCase()})`, value: g.polish },
    { label: `SYMMETRY (${g.symmetry.toUpperCase()})`, value: g.symmetry },
    { label: `FLUORESCENCE (${g.fluorescence.toUpperCase()})`, value: g.fluorescence },
  ];

  return (
    <GoldBorderFrame className="aspect-[1/1.414]">
      {/* Top Banner Accent Clip */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden select-none z-10">
        <img
          src="/assets/navy-gold-ribbon-banner.png"
          alt=""
          className="absolute -top-1 -right-2 h-20 max-w-none object-contain"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between py-2 sm:py-3 z-10 select-none">
        
        {/* Header */}
        <div className="text-center pt-2 sm:pt-3 space-y-0.5">
          <p className="font-cinzel text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#8B6B34] uppercase">
            EVALUATION
          </p>
          <h2 className="font-cinzel text-base sm:text-lg md:text-xl font-black tracking-[0.18em] text-[#001E3D] uppercase">
            DIAMOND QUALITY
          </h2>
        </div>

        {/* Cut Style & Diagram Section */}
        <div className="my-auto py-2">
          <p className="font-cinzel text-[11px] sm:text-xs font-bold tracking-widest text-[#001E3D] text-center uppercase mb-2">
            CUT STYLE · {g.cutStyle}
          </p>

          <div className="flex items-center gap-2 sm:gap-4 px-1">
            {/* 3D Cut Diagram from Canva */}
            <div className="w-1/2 flex justify-center items-center">
              <img
                src="/assets/diamond-cut-perspective.png"
                alt="3D Diamond Cut Perspective"
                className="max-h-36 sm:max-h-44 object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Quality Checklist */}
            <div className="w-1/2 space-y-1.5 font-sans text-[10px] sm:text-[11px]">
              {qualityItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#E2D8C3] pb-1">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#8B6B34] flex-shrink-0" />
                    <span className="font-medium text-[#4A5568]">{item.label}</span>
                  </div>
                  <span className="font-bold text-[#001E3D]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inspirational Quote Section */}
        <div className="text-center px-3 py-2 bg-[#FAF1DF]/50 rounded border border-[#C59D5F]/30 mx-1">
          <blockquote className="font-garamond italic text-xs sm:text-sm text-[#001E3D] font-medium leading-relaxed">
            "{data.inspirationalQuote}"
          </blockquote>
          {data.quoteAuthor && (
            <p className="font-sans text-[9px] text-[#8B6B34] tracking-wider uppercase font-semibold mt-1">
              — {data.quoteAuthor}
            </p>
          )}
        </div>

        {/* Bottom Diamond Accent */}
        <div className="pt-2">
          <DiamondEmblem size="sm" />
        </div>

      </div>
    </GoldBorderFrame>
  );
};

