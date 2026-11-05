import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animation';
import {
  TriFoldInvitation,
  TriFoldInvitationHandle,
} from '../invitation/TriFoldInvitation';
import { RotateCcw, Maximize2, Minimize2, BookOpen } from 'lucide-react';

export const TriFoldSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const invitationRef = useRef<TriFoldInvitationHandle>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
    }
  };

  const handleReset = () => {
    invitationRef.current?.resetView();
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    invitationRef.current?.toggleFlaps();
  };

  return (
    <section
      id="invitation-3d"
      className="relative w-full py-24 md:py-32 border-t border-amber-400/20 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header (text-center mb-10) */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          {/* Badge: "THƯ MỜI TƯƠNG TÁC 3D" in text-xs tracking-[3px] uppercase text-amber-300 */}
          <motion.div
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/40 liquid-glass text-xs tracking-[3px] uppercase text-amber-300 font-semibold mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            <span>THƯ MỜI TƯƠNG TÁC 3D</span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.2)}
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-1px] text-white"
          >
            Khám phá{' '}
            <span className="font-serif italic font-normal text-gradient-gold">
              Tri-Fold Invitation
            </span>
          </motion.h2>

          {/* Subtitle: "Chạm hoặc xoay để mở và tương tác với thiệp mời tốt nghiệp gấp ba" */}
          <motion.p
            {...fadeUp(0.3)}
            className="text-stone-300 text-sm sm:text-base mt-2 max-w-xl mx-auto font-normal leading-relaxed"
          >
            Chạm hoặc xoay để mở và tương tác với thiệp mời tốt nghiệp gấp ba
          </motion.p>
        </div>

        {/* Container: Khung liquid-glass rounded-3xl p-4 md:p-8 max-w-5xl mx-auto h-[550px] md:h-[700px] border border-amber-400/30 relative overflow-hidden */}
        <motion.div {...fadeUp(0.4)}>
          <div
            ref={containerRef}
            className={`liquid-glass rounded-3xl p-4 md:p-8 max-w-5xl mx-auto border border-amber-400/30 relative overflow-hidden flex flex-col justify-center items-center shadow-2xl shadow-black/80 transition-all duration-300 ${
              isFullscreen ? 'h-screen w-screen rounded-none p-6' : 'h-[550px] md:h-[700px]'
            }`}
          >
            {/* Integrated Three.js Canvas with lighting */}
            <TriFoldInvitation
              ref={invitationRef}
              onOpenStateChange={(open) => setIsOpen(open)}
            />

            {/* Floating Instructions Pill */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 px-4 py-1.5 rounded-full bg-black/80 border border-amber-400/40 text-[11px] sm:text-xs text-amber-200/90 backdrop-blur-md shadow-md">
              <span>Kéo cánh trái sang trái • Kéo cánh phải sang phải để mở thiệp</span>
            </div>

            {/* Bottom Utility Controls */}
            <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2.5">
              {/* Quick Toggle Flaps Button */}
              <button
                onClick={handleToggleOpen}
                className="liquid-glass liquid-glass-hover text-xs font-medium text-stone-200 hover:text-amber-300 hover:border-amber-400/50 px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/10 shadow-md backdrop-blur-md transition-all active:scale-95"
                title={isOpen ? 'Đóng thiệp lại' : 'Mở bung cả hai cánh thiệp'}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  {isOpen ? 'Đóng thiệp' : 'Mở thiệp'}
                </span>
              </button>

              {/* Reset angle button: Nút liquid-glass tròn nhỏ "Reset góc nhìn" */}
              <button
                onClick={handleReset}
                className="liquid-glass liquid-glass-hover text-xs font-medium text-stone-200 hover:text-amber-300 hover:border-amber-400/50 px-3.5 py-2.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-md backdrop-blur-md transition-all active:scale-95"
                title="Reset góc nhìn về mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Reset góc nhìn</span>
              </button>

              {/* Fullscreen button: Nút "Mở toàn màn hình" */}
              <button
                onClick={handleToggleFullscreen}
                className="liquid-glass liquid-glass-hover text-xs font-medium text-stone-200 hover:text-amber-300 hover:border-amber-400/50 p-2.5 sm:px-3.5 sm:py-2.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-md backdrop-blur-md transition-all active:scale-95"
                title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Mở toàn màn hình'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Thu nhỏ</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Mở toàn màn hình</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
