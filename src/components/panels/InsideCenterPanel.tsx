import React from 'react';
import { GoldBorderFrame } from '../common/GoldBorderFrame';
import { DiamondEmblem } from '../common/DiamondEmblem';
import { GoldDivider } from '../common/GoldDivider';
import { InvitationData } from '../../types/invitation';
import { MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';

interface InsideCenterPanelProps {
  data: InvitationData;
}

export const InsideCenterPanel: React.FC<InsideCenterPanelProps> = ({ data }) => {
  return (
    <GoldBorderFrame className="aspect-[1/1.414]">
      {/* Top Banner Accent Clip */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden select-none z-10">
        <img
          src="/assets/navy-gold-ribbon-banner.png"
          alt=""
          className="absolute -top-1 left-1/2 -translate-x-1/2 h-20 max-w-none object-contain"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between items-center text-center py-2 sm:py-3 z-10 select-none">
        
        {/* Main Invitation Title */}
        <div className="pt-2 sm:pt-3 space-y-1">
          <p className="font-cinzel text-xs sm:text-sm font-extrabold tracking-[0.28em] text-[#8B6B34] uppercase">
            INVITATION
          </p>
          <h2 className="font-cinzel text-base sm:text-lg md:text-xl font-black tracking-[0.2em] text-[#001E3D] uppercase">
            {data.eventTitle}
          </h2>
        </div>

        {/* Recipient Section */}
        <div className="my-auto space-y-2 py-2 max-w-[92%]">
          <p className="font-sans text-[10px] sm:text-xs tracking-widest text-[#64748B] uppercase font-medium">
            {data.recipientTitle || 'You are cordially invited:'}
          </p>
          
          {/* Personalized Recipient Name */}
          <div className="py-1">
            <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[#001E3D] drop-shadow-sm">
              {data.recipientName}
            </h3>
          </div>

          <p className="font-garamond italic text-xs sm:text-sm md:text-base text-[#3A404D] leading-relaxed max-w-sm mx-auto px-2">
            {data.invitationMessage}
          </p>

          <GoldDivider variant="crest" className="my-1.5" />
        </div>

        {/* Event Schedule Info */}
        <div className="w-full space-y-2 px-1">
          <div className="inline-flex items-center gap-1.5 text-[#8B6B34]">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase text-[#001E3D]">
              EVENT INFORMATION
            </span>
          </div>

          <p className="font-sans text-xs sm:text-sm font-bold text-[#8B6B34]">
            {data.eventDateText}
          </p>

          {/* Schedule Breakdown */}
          <div className="bg-[#FAF1DF]/60 rounded border border-[#C59D5F]/30 p-2 sm:p-2.5 max-w-xs mx-auto space-y-1.5 text-left font-sans">
            {data.schedule.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[10px] sm:text-[11px]">
                <Clock className="w-3 h-3 text-[#8B6B34] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-bold text-[#001E3D]">{item.title}: </span>
                  <span className="text-[#8B6B34] font-semibold">{item.time}</span>
                  {item.description && (
                    <p className="text-[9px] text-[#64748B]">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Venue Info */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-1 text-[11px] font-cinzel font-bold text-[#001E3D] tracking-wider uppercase">
              <MapPin className="w-3 h-3 text-[#8B6B34]" />
              <span>{data.venueName}</span>
            </div>
            <p className="font-sans text-[9px] sm:text-[10px] text-[#64748B] max-w-xs mx-auto truncate px-2">
              {data.venueAddress}
            </p>
            
            {data.googleMapsUrl && (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-[9px] sm:text-[10px] font-sans font-semibold text-[#8B6B34] hover:text-[#001E3D] underline underline-offset-2 transition-colors"
              >
                <span>Xem bản đồ chỉ đường</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Diamond Sparkle */}
        <div className="pt-2">
          <DiamondEmblem size="sm" />
        </div>

      </div>
    </GoldBorderFrame>
  );
};

