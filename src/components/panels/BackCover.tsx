import React from 'react';
import { GoldBorderFrame } from '../common/GoldBorderFrame';
import { DiamondEmblem } from '../common/DiamondEmblem';
import { GoldDivider } from '../common/GoldDivider';
import { InvitationData } from '../../types/invitation';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

interface BackCoverProps {
  data: InvitationData;
}

export const BackCover: React.FC<BackCoverProps> = ({ data }) => {
  return (
    <GoldBorderFrame className="aspect-[1/1.414] shadow-2xl">
      <div className="flex-1 flex flex-col justify-between items-center text-center py-6 sm:py-8 px-4 select-none">
        
        {/* Top Logo */}
        <div className="pt-2 sm:pt-4 flex flex-col items-center">
          <img
            src="/assets/fpt-university-logo.webp"
            alt={data.universityName}
            className="h-10 sm:h-12 object-contain"
          />
          <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] text-[#8B6B34] font-bold uppercase mt-2">
            {data.universityName}
          </p>
        </div>

        {/* Center Thank You Section matching Canva Page 5 */}
        <div className="my-auto space-y-3 max-w-sm px-2">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-[#001E3D] uppercase">
            THANK YOU
          </h2>
          
          <GoldDivider variant="crest" />

          <p className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.14em] text-[#8B6B34] uppercase leading-relaxed">
            {data.thankYouMessage}
          </p>
        </div>

        {/* Contact & QR Section */}
        <div className="w-full space-y-3 pb-2">
          {data.qrCodeUrl && (
            <div className="flex flex-col items-center gap-1">
              <div className="p-1.5 bg-white rounded-lg border border-[#C59D5F]/40 shadow-sm inline-block">
                <img
                  src={data.qrCodeUrl}
                  alt="QR Code"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                />
              </div>
              <span className="font-sans text-[9px] text-[#64748B]">Quét mã xem bản đồ & thông tin</span>
            </div>
          )}

          {/* Contact Details */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-sans text-[10px] sm:text-[11px] text-[#4A5568] max-w-xs mx-auto">
            {data.contactEmail && (
              <a href={`mailto:${data.contactEmail}`} className="inline-flex items-center gap-1 hover:text-[#001E3D]">
                <Mail className="w-3 h-3 text-[#8B6B34]" />
                <span>{data.contactEmail}</span>
              </a>
            )}
            {data.contactPhone && (
              <a href={`tel:${data.contactPhone}`} className="inline-flex items-center gap-1 hover:text-[#001E3D]">
                <Phone className="w-3 h-3 text-[#8B6B34]" />
                <span>{data.contactPhone}</span>
              </a>
            )}
            {data.websiteUrl && (
              <a href={data.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[#001E3D]">
                <Globe className="w-3 h-3 text-[#8B6B34]" />
                <span>fpt.edu.vn</span>
              </a>
            )}
          </div>

          <div className="pt-2">
            <DiamondEmblem size="sm" />
          </div>
        </div>

      </div>
    </GoldBorderFrame>
  );
};

