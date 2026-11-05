import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animation';

export const MilestonesSection: React.FC = () => {
  return (
    <section
      id="milestones"
      className="relative w-full mt-0 pt-6 sm:pt-8 md:pt-12 pb-16 md:pb-24 px-6 sm:px-8 md:px-16 lg:px-24 bg-black overflow-hidden"
    >
      {/* Subtle warm amber ambient glow on pure black background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading: text-5xl md:text-7xl lg:text-8xl text-center — "4 Years of Dedication. A New Chapter Begins." */}
        <motion.h2
          {...fadeUp(0.1)}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center font-medium tracking-[-2px] leading-[1.08] text-white max-w-5xl mx-auto"
        >
          4 Years of Dedication.{' '}
          <span className="block sm:inline font-serif italic font-normal text-gradient-gold">
            A New Chapter
          </span>{' '}
          Begins.
        </motion.h2>

        {/* Subtitle: text-muted-foreground text-lg max-w-2xl mx-auto mb-24 text-center */}
        <motion.p
          {...fadeUp(0.25)}
          className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto mt-6 mb-24 text-center leading-relaxed font-normal"
        >
          Chặng đường đại học khép lại, mở ra hành trình mới. Sự hiện diện của bạn là niềm vinh hạnh và món quà ý nghĩa nhất đối với tôi.
        </motion.p>

        {/* 3 milestone cards (grid md:grid-cols-3 gap-12 md:gap-8 mb-20) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-20">
          {/* Card 1 (Date & Time): design asset Calener.svg */}
          <motion.div
            {...fadeUp(0.35)}
            className="liquid-glass rounded-3xl p-8 flex flex-col items-center text-center border border-amber-400/20 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 group"
          >
            <div className="w-[200px] h-[200px] flex items-center justify-center mb-6 drop-shadow-lg">
              <img
                src="/Calener.svg"
                alt="Date & Time"
                className="w-[200px] h-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xs uppercase tracking-[2px] text-amber-400 font-semibold mb-1">
              Thời Gian Buổi Lễ
            </span>
            <h3 className="font-bold text-lg text-white tracking-tight mb-2">
              07 / 11 / 2026
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed max-w-xs">
              06:00 - 13:00 (Lễ tốt nghiệp chính thức: 07:00 - 09:30)
            </p>
          </motion.div>

          {/* Card 2 (Location): design asset Location.svg */}
          <motion.div
            {...fadeUp(0.45)}
            className="liquid-glass rounded-3xl p-8 flex flex-col items-center text-center border border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 group"
          >
            <div className="w-[200px] h-[200px] flex items-center justify-center mb-6 drop-shadow-lg">
              <img
                src="/Location.svg"
                alt="Location"
                className="w-[200px] h-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xs uppercase tracking-[2px] text-emerald-400 font-semibold mb-1">
              Địa Điểm Tổ Chức
            </span>
            <h3 className="font-bold text-lg text-white tracking-tight mb-2">
              Đại học FPT TP.HCM
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed max-w-xs">
              Lô E2a-7, Đường D1, Khu Công nghệ cao, TP. Thủ Đức, TP.HCM
            </p>
          </motion.div>

          {/* Card 3 (Dresscode): design asset GraduateHat.svg */}
          <motion.div
            {...fadeUp(0.55)}
            className="liquid-glass rounded-3xl p-8 flex flex-col items-center text-center border border-cyan-400/20 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 group"
          >
            <div className="w-[200px] h-[200px] flex items-center justify-center mb-6 drop-shadow-lg">
              <img
                src="/GraduateHat.svg"
                alt="Dresscode"
                className="w-[200px] h-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xs uppercase tracking-[2px] text-cyan-400 font-semibold mb-1">
              Quy Chuẩn Trang Phục
            </span>
            <h3 className="font-bold text-lg text-white tracking-tight mb-2">
              Dresscode Tự Do
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed max-w-xs">
              Thoải mái, lịch sự, thanh lịch (khuyến khích tông màu trang nhã)
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
