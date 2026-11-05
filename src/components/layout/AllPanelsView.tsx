import React from 'react';
import { FrontCover } from '../panels/FrontCover';
import { InsideLeftPanel } from '../panels/InsideLeftPanel';
import { InsideCenterPanel } from '../panels/InsideCenterPanel';
import { InsideRightPanel } from '../panels/InsideRightPanel';
import { BackCover } from '../panels/BackCover';
import { InvitationData } from '../../types/invitation';

interface AllPanelsViewProps {
  data: InvitationData;
}

export const AllPanelsView: React.FC<AllPanelsViewProps> = ({ data }) => {
  const panels = [
    { title: 'Trang 1: Bìa Trước (Front Cover)', comp: <FrontCover data={data} /> },
    { title: 'Trang 2: Mặt Trong Trái (Graduate & Diamond Report)', comp: <InsideLeftPanel data={data} /> },
    { title: 'Trang 3: Mặt Trong Giữa (Main Invitation & Schedule)', comp: <InsideCenterPanel data={data} /> },
    { title: 'Trang 4: Mặt Trong Phải (Evaluation & Diamond Quality)', comp: <InsideRightPanel data={data} /> },
    { title: 'Trang 5: Bìa Sau (University & Contact Info)', comp: <BackCover data={data} /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      <div className="text-center mb-8">
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F5DEB0]">
          Trọn Bộ 5 Trang Thiết Kế Tri-fold Canva
        </h2>
        <p className="font-sans text-xs sm:text-sm text-stone-400 mt-1">
          Tái hiện đầy đủ, trung thực từng chi tiết từ các trang thiết kế gốc
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {panels.map((p, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="font-cinzel text-xs font-bold text-[#C59D5F] mb-2 uppercase tracking-wider">
              {p.title}
            </span>
            <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-300">
              {p.comp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

