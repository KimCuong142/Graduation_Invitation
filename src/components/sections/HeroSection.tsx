import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animation';
import { Sparkles, ArrowRight } from 'lucide-react';
import Hls from 'hls.js';

interface HeroSectionProps {
  guestName?: string;
  onOpenGuestbook: (prefilledMessage?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  guestName,
  onOpenGuestbook,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const topVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = topVideoRef.current;
    if (!video) return;

    const hlsUrl =
      'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
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
          console.warn('Mux HLS Autoplay prevented:', err);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenGuestbook(inputValue.trim());
  };

  return (
    <section id="hero" className="relative w-full bg-black select-none mb-0 pb-0">
      {/* 1. Phần nền phía trên: Video Mux HLS */}
      <div className="relative w-full flex flex-col items-center justify-center overflow-hidden mb-0 pb-0">
        {/* Background: Video Mux HLS chạy tự động, loop vô tận, căn object-top để cắt phần đáy */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            ref={topVideoRef}
            id="hero-top-video"
            crossOrigin="anonymous"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-top"
          />
          {/* Lớp phủ tối nhẹ bg-black/20 để làm nổi bật tên và tiêu đề */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          {/* Fade đen dần về phía đáy: kết nối giáp với Tầng 2 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
        </div>

        {/* Content: Tiêu đề, Tên & Form RSVP nổi bật trên nền video Mux */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-8 text-center pt-24 sm:pt-28 md:pt-32 pb-0 mb-0 flex flex-col items-center">
          {/* Pill badge row: liquid-glass */}
          <motion.div
            {...fadeUp(0.1)}
            className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2.5 mb-5 sm:mb-6 border border-amber-400/30 text-xs text-amber-200/90 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          >
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wide uppercase shadow-sm">
              Graduation
            </span>
            <span className="font-medium text-amber-100/90 tracking-wide">
              Lễ Tốt Nghiệp • 2026
            </span>
          </motion.div>

          {/* Heading: text-4xl sm:text-6xl md:text-7xl font-medium tracking-[-2px] — "Celebrate Graduation with Us." */}
          <motion.h1
            {...fadeUp(0.25)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-2px] leading-[1.12] text-white max-w-5xl mx-auto mb-4 sm:mb-6 drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
          >
            Celebrate{' '}
            <span className="font-serif italic font-normal tracking-tight text-gradient-gold">
              Graduation
            </span>{' '}
            with Us.
          </motion.h1>

          {/* Subtitle: text-base sm:text-lg */}
          <motion.p
            {...fadeUp(0.4)}
            className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg text-[hsl(var(--hero-subtitle))] max-w-2xl mx-auto text-center font-normal leading-relaxed tracking-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]"
          >
            {guestName ? (
              <>
                Trân trọng kính mời <strong className="text-amber-300 font-bold">{guestName}</strong> đến chung vui và lưu giữ những khoảnh khắc thanh xuân đáng nhớ tại Lễ Tốt Nghiệp của Huỳnh Kim Cương.
              </>
            ) : (
              'Trân trọng kính mời bạn đến chung vui và lưu giữ những khoảnh khắc thanh xuân đáng nhớ tại Lễ Tốt Nghiệp của Huỳnh Kim Cương.'
            )}
          </motion.p>

          {/* Form container: liquid-glass rounded-full */}
          <motion.form
            {...fadeUp(0.55)}
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto liquid-glass rounded-full p-2 flex items-center justify-between gap-3 border border-amber-400/30 shadow-[0_0_35px_rgba(245,158,11,0.12)] mb-5 sm:mb-6"
          >
            <div className="flex items-center gap-2.5 pl-3 flex-1 min-w-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="relative flex-1 min-w-0 overflow-hidden flex items-center py-1">
                {/* Animated continuous marquee placeholder */}
                <div
                  className={`absolute inset-0 flex items-center pointer-events-none transition-opacity duration-300 ${
                    inputValue ? 'opacity-0' : isFocused ? 'opacity-20' : 'opacity-100'
                  }`}
                >
                  <motion.div
                    className="flex whitespace-nowrap text-sm md:text-base text-stone-400 select-none will-change-transform"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                      repeat: Infinity,
                      ease: 'linear',
                      duration: 12,
                    }}
                  >
                    <span className="pr-12 inline-block">
                      Gửi lời chúc mừng tốt nghiệp đến Kim Cương...
                    </span>
                    <span className="pr-12 inline-block">
                      Gửi lời chúc mừng tốt nghiệp đến Kim Cương...
                    </span>
                  </motion.div>
                </div>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent text-sm md:text-base text-white focus:outline-none relative z-10"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="shrink-0 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold rounded-full px-6 py-3 text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>GỬI LỜI CHÚC</span>
              <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </motion.button>
          </motion.form>

          {/* 3-avatar row indicator */}
          <motion.div
            {...fadeUp(0.65)}
            className="mt-1 flex items-center justify-center gap-3 text-xs text-stone-300"
          >
            <div className="flex -space-x-2 overflow-hidden drop-shadow-md">
              <img
                src="/avatar-1.png"
                alt="Friend 1"
                className="inline-block w-8 h-8 rounded-full border-2 border-black object-cover shadow-sm ring-1 ring-amber-400/40"
              />
              <img
                src="/avatar-2.png"
                alt="Friend 2"
                className="inline-block w-8 h-8 rounded-full border-2 border-black object-cover shadow-sm ring-1 ring-amber-400/40"
              />
              <img
                src="/avatar-3.png"
                alt="Friend 3"
                className="inline-block w-8 h-8 rounded-full border-2 border-black object-cover shadow-sm ring-1 ring-amber-400/40"
              />
            </div>
            <span className="font-medium tracking-wide text-amber-200/90">
              Cử nhân CNTT • Đại học FPT TP.HCM
            </span>
          </motion.div>
        </div>
      </div>

      {/* 2. Tầng 2: Video Kỷ Niệm (Ngôi sao kim cương & Phi hành gia) - 3 Icon & Milestones nằm TRỰC TIẾP TRÊN video này */}
      <div className="relative w-full overflow-hidden bg-black flex flex-col justify-between">
        {/* Background Video 2: Ngôi sao kim cương + Phi hành gia */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            id="hero-bottom-video"
            crossOrigin="anonymous"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-[center_20%] md:w-full md:h-auto md:absolute md:left-0 md:top-0 md:-translate-y-[26%] md:object-fill brightness-105 contrast-105"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
              type="video/mp4"
            />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          {/* Lớp phủ tối nhẹ để chữ và 3 thẻ thông tin hiển thị rõ nét trên nền video */}
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
          {/* Chuyển tiếp mượt giáp với đáy Tầng 1 */}
          <div className="absolute top-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none" />
          {/* Fade đáy nhẹ */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-[4]" />
        </div>

        {/* 4 Years of Dedication. A New Chapter Begins & 3 Thẻ Thông Tin Buổi Lễ - Nằm TRỰC TIẾP TRÊN Video Tầng 2 với Ngôi Sao Kim Cương */}
        <div
          id="milestones"
          className="relative z-20 max-w-6xl mx-auto px-4 sm:px-8 md:px-12 mt-0 pt-6 sm:pt-8 md:pt-12 pb-4 text-center"
        >
          {/* Heading */}
          <motion.h2
            {...fadeUp(0.1)}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-medium tracking-tight sm:tracking-[-2px] leading-[1.1] text-white max-w-5xl mx-auto drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
          >
            4 Years of Dedication.{' '}
            <span className="block sm:inline font-serif italic font-normal text-gradient-gold">
              A New Chapter
            </span>{' '}
            Begins.
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.25)}
            className="text-stone-300 text-xs sm:text-base md:text-lg max-w-2xl mx-auto mt-2 sm:mt-4 mb-6 sm:mb-10 text-center leading-relaxed font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]"
          >
            Chặng đường đại học khép lại, mở ra hành trình mới. Sự hiện diện của bạn là niềm vinh hạnh và món quà ý nghĩa nhất đối với tôi.
          </motion.p>

          {/* 3 milestone cards - Luôn 3 cột trong 1 hàng gọn gàng */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-4">
            {/* Card 1 (Date & Time): design asset Calener.svg */}
            <motion.div
              {...fadeUp(0.35)}
              className="liquid-glass rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 md:p-8 flex flex-col items-center text-center border border-amber-400/30 hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all duration-300 group backdrop-blur-md"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 flex items-center justify-center mb-2 md:mb-4 drop-shadow-lg">
                <img
                  src="/Calener.svg"
                  alt="Date & Time"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[9px] sm:text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1 line-clamp-1">
                Thời Gian Buổi Lễ
              </span>
              <h3 className="font-bold text-xs sm:text-base md:text-lg text-white tracking-tight mb-1 md:mb-2">
                07 / 11 / 2026
              </h3>
              <p className="text-stone-300 text-[10px] sm:text-xs md:text-sm leading-tight sm:leading-relaxed max-w-xs">
                12:00 - 19:00 (Lễ chính thức: 14:00 - 16:30)
              </p>
            </motion.div>

            {/* Card 2 (Location): design asset Location.svg */}
            <motion.div
              {...fadeUp(0.45)}
              className="liquid-glass rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 md:p-8 flex flex-col items-center text-center border border-emerald-400/30 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300 group backdrop-blur-md"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 flex items-center justify-center mb-2 md:mb-4 drop-shadow-lg">
                <img
                  src="/Location.svg"
                  alt="Location"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[9px] sm:text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1 line-clamp-1">
                Địa Điểm Tổ Chức
              </span>
              <h3 className="font-bold text-xs sm:text-base md:text-lg text-white tracking-tight mb-1 md:mb-2">
                Đại học FPT TP.HCM
              </h3>
              <p className="text-stone-300 text-[10px] sm:text-xs md:text-sm leading-tight sm:leading-relaxed max-w-xs">
                Lô E2a-7, Đường D1, Khu CNC, TP. Thủ Đức, TP.HCM
              </p>
            </motion.div>

            {/* Card 3 (Dresscode): design asset GraduateHat.svg */}
            <motion.div
              {...fadeUp(0.55)}
              className="liquid-glass rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 md:p-8 flex flex-col items-center text-center border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 group backdrop-blur-md"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 flex items-center justify-center mb-2 md:mb-4 drop-shadow-lg">
                <img
                  src="/GraduateHat.svg"
                  alt="Dresscode"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[9px] sm:text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 line-clamp-1">
                Quy Chuẩn Trang Phục
              </span>
              <h3 className="font-bold text-xs sm:text-base md:text-lg text-white tracking-tight mb-1 md:mb-2">
                Dresscode Tự Do
              </h3>
              <p className="text-stone-300 text-[10px] sm:text-xs md:text-sm leading-tight sm:leading-relaxed max-w-xs">
                Thoải mái, lịch sự (khuyến khích màu trang nhã)
              </p>
            </motion.div>
          </div>
        </div>

        {/* Khoảng không gian hiển thị mặt nước & phi hành gia */}
        <div className="relative z-20 w-full min-h-[60px] sm:min-h-[100px] md:min-h-[260px] pointer-events-none flex items-end pb-4 sm:pb-8 md:pb-12 px-6 sm:px-12">
          {/* Floating cinematic pill badge */}
          <span className="text-xs sm:text-sm tracking-[2px] uppercase text-amber-200 font-mono font-medium drop-shadow-lg liquid-glass px-4 py-2 rounded-full border border-amber-400/30 backdrop-blur-md">
            Graduation Ceremony • FPT University
          </span>
        </div>
      </div>

      {/* 3. Lớp Magical Glowing PNG nằm HOÀN TOÀN NGOÀI khung video Tầng 2 để che trọn cạnh đáy video và tràn tự nhiên xuống phía dưới mà không bị overflow-hidden cắt */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none z-30 flex items-center justify-center translate-y-[20%] md:translate-y-[18%]">
        <img
          src="/Magical_Glowing.png"
          alt="Magical Glowing Effect"
          className="w-full h-auto select-none pointer-events-none"
        />
      </div>
    </section>
  );
};
