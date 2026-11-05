import React from 'react';
import { GoldBorderFrame } from '../common/GoldBorderFrame';
import { InvitationData } from '../../types/invitation';

interface InsideLeftPanelProps {
  data: InvitationData;
}

export const InsideLeftPanel: React.FC<InsideLeftPanelProps> = ({ data }) => {
  return (
    <GoldBorderFrame className="aspect-[1/1.414]">
      {/* Top Banner Accent Clip */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden select-none z-10">
        <img
          src="/assets/navy-gold-ribbon-banner.png"
          alt=""
          className="absolute -top-1 -left-2 h-20 max-w-none object-contain"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between py-2 sm:py-3 z-10">
        
        {/* Top Header: Logo on left, Ceremony tag on right */}
        <div className="flex items-start justify-between border-b border-[#C59D5F]/30 pb-3 pt-2">
          <div className="flex items-center">
            <img
              src="/assets/fpt-university-logo.webp"
              alt={data.universityName}
              className="h-7 sm:h-9 object-contain"
            />
          </div>
          <div className="text-right">
            <p className="font-cinzel text-[10px] sm:text-xs font-bold tracking-widest text-[#001E3D] uppercase">
              GRADUATION
            </p>
            <p className="font-cinzel text-[9px] sm:text-[11px] font-semibold tracking-wider text-[#8B6B34] uppercase">
              CEREMONY
            </p>
            <p className="font-cinzel text-[9px] sm:text-[10px] font-bold text-[#5A6270] tracking-wider">
              {data.academicYears}
            </p>
          </div>
        </div>

        {/* Graduate Profile Row: Portrait & Credentials */}
        <div className="flex items-center gap-3 sm:gap-4 my-2 sm:my-3">
          {/* Portrait Container */}
          <div className="w-24 sm:w-28 h-32 sm:h-36 rounded-md overflow-hidden border border-[#C59D5F] shadow-md bg-stone-100 flex-shrink-0 relative group">
            <img
              src={data.portraitUrl}
              alt={data.graduateName}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {data.portraitCaption && (
              <div className="absolute bottom-0 inset-x-0 bg-stone-900/70 text-stone-200 text-[8px] sm:text-[9px] py-0.5 text-center font-sans">
                {data.portraitCaption}
              </div>
            )}
          </div>

          {/* Graduate Info */}
          <div className="flex-1 text-left space-y-1">
            <h3 className="font-cinzel text-base sm:text-lg md:text-xl font-bold text-[#001E3D] leading-snug">
              {data.graduateName}
            </h3>
            <p className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-[#8B6B34] font-medium">
              {data.degreeName}
            </p>
            <p className="font-cinzel text-xs sm:text-sm font-bold text-[#1E232B] leading-tight">
              {data.majorName}
            </p>
            <p className="font-sans text-[10px] sm:text-[11px] text-[#4A5568] leading-tight pt-0.5">
              {data.facultyName}
            </p>
            <p className="font-sans text-[10px] sm:text-[11px] text-[#4A5568] leading-tight">
              {data.universityName}
            </p>
            <div className="pt-1.5">
              <span className="inline-block px-2 py-0.5 rounded bg-[#FAF1DF] border border-[#C59D5F]/40 font-cinzel text-[9px] sm:text-[10px] text-[#8B6B34] font-semibold tracking-wider">
                {data.classCohort}
              </span>
            </div>
          </div>
        </div>

        {/* Diamond Report Section */}
        <div className="mt-auto border-t border-[#C59D5F]/30 pt-2">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="h-[1px] w-8 bg-[#C59D5F]/60" />
            <h4 className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#001E3D] uppercase">
              {data.diamondReportTitle}
            </h4>
            <div className="h-[1px] w-8 bg-[#C59D5F]/60" />
          </div>

          {/* Diamond Proportions Diagram */}
          <div className="flex justify-center my-1 select-none">
            <img
              src="/assets/diamond-proportions-diagram.png"
              alt="Diamond Proportions Diagram"
              className="h-14 sm:h-16 object-contain opacity-90 filter drop-shadow-sm"
            />
          </div>

          {/* Grading Specs Table */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-sans text-[10px] sm:text-[11px] px-1 sm:px-2 pt-1">
            <div className="flex justify-between border-b border-[#E2D8C3] py-0.5">
              <span className="text-[#64748B]">Cut Grade:</span>
              <span className="font-semibold text-[#001E3D]">{data.diamondGrading.cutGrade}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2D8C3] py-0.5">
              <span className="text-[#64748B]">Color Grade:</span>
              <span className="font-semibold text-[#001E3D]">{data.diamondGrading.colorGrade}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2D8C3] py-0.5">
              <span className="text-[#64748B]">Clarity Grade:</span>
              <span className="font-semibold text-[#001E3D]">{data.diamondGrading.clarityGrade}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2D8C3] py-0.5">
              <span className="text-[#64748B]">Carat Weight:</span>
              <span className="font-semibold text-[#8B6B34]">{data.diamondGrading.caratWeight}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-[#64748B]">Polish:</span>
              <span className="font-semibold text-[#001E3D]">{data.diamondGrading.polish}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-[#64748B]">Symmetry:</span>
              <span className="font-semibold text-[#001E3D]">{data.diamondGrading.symmetry}</span>
            </div>
          </div>
        </div>

      </div>
    </GoldBorderFrame>
  );
};

