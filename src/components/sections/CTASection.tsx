import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animation';
import { Sparkles, Download, Heart } from 'lucide-react';
import Hls from 'hls.js';

interface CTASectionProps {
  onOpenGuestbook: () => void;
  onOpenPdf: () => void;
  guestName?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onOpenGuestbook,
  onOpenPdf,
  guestName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl =
      'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => {
          console.warn('HLS Autoplay prevented:', err);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.loadSource('/videos/hls/stream.m3u8');
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((err) => {
          console.warn('Safari autoplay prevented:', err);
        });
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <section
      id="rsvp"
      className="relative w-full py-32 md:py-44 border-t border-amber-400/20 overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background video (HLS via hls.js) in FULL VIBRANT COLOR */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 brightness-100 scale-105"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark Vignette Overlay with warm golden undertone */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/95 z-[1]" />

      {/* Content (z-10, centered) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        {/* Concentric circles logo icon in radiant gold */}
        <motion.div
          {...fadeUp(0.1)}
          className="w-10 h-10 rounded-full border-2 border-amber-400/80 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)] bg-black/40 backdrop-blur-sm"
        >
          <div className="w-5 h-5 rounded-full border-2 border-amber-400 bg-amber-400/30" />
        </motion.div>

        {/* Heading: text-4xl md:text-6xl font-medium tracking-[-1px] */}
        <motion.h2
          {...fadeUp(0.2)}
          className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white max-w-2xl mx-auto drop-shadow-md"
        >
          Be Part of My{' '}
          <span className="font-serif italic font-normal text-gradient-gold">
            Memory
          </span>
        </motion.h2>

        {/* Subtitle: text-lg */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-base sm:text-lg text-[hsl(var(--hero-subtitle))] max-w-xl mx-auto mt-4 mb-10 leading-relaxed font-normal"
        >
          {guestName ? (
            <>
              Sự hiện diện và lời chúc của <strong className="text-amber-300 font-bold">{guestName}</strong> là món quà ý nghĩa nhất cho ngày lễ tốt nghiệp của Huỳnh Kim Cương.
            </>
          ) : (
            'Sự hiện diện của bạn là mảnh ghép trọn vẹn nhất cho ngày lễ tốt nghiệp này.'
          )}
        </motion.p>

        {/* Two buttons */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          {/* Primary Button: Gửi Lời Chúc */}
          <motion.button
            onClick={onOpenGuestbook}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold rounded-full px-8 py-3.5 text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-slate-950" />
            <span>GỬI LỜI CHÚC (SỔ LƯU BÚT)</span>
          </motion.button>

          {/* Secondary Button: Tải PDF */}
          <motion.button
            onClick={onOpenPdf}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto liquid-glass liquid-glass-hover text-amber-200 hover:text-white font-bold rounded-full px-8 py-3.5 text-sm tracking-wide border border-amber-400/40 hover:border-amber-400 shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>TẢI THIỆP MỜI (PDF)</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
