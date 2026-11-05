import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animation';
import { UserCheck, Award, Camera, MessageSquareHeart } from 'lucide-react';

export const ScheduleSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  const scheduleItems = [
    {
      step: '01',
      time: '06:30 - 07:30',
      title: 'Check-in & Đón tiếp',
      description: 'Gặp gỡ, nhận thư mời và ổn định chỗ ngồi.',
      icon: UserCheck,
      color: 'emerald',
      borderColor: 'border-emerald-400/30 hover:border-emerald-400/60',
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      step: '02',
      time: '07:30 - 09:30',
      title: 'Lễ Trao Bằng',
      description: 'Khoảnh khắc vinh danh và nhận bằng tốt nghiệp chính thức.',
      icon: Award,
      color: 'amber',
      borderColor: 'border-amber-400/30 hover:border-amber-400/60',
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      step: '03',
      time: '09:30 - 11:30',
      title: 'Chụp ảnh Kỷ niệm',
      description: 'Chụp hình lưu niệm cùng gia đình, thầy cô và bạn bè.',
      icon: Camera,
      color: 'cyan',
      borderColor: 'border-cyan-400/30 hover:border-cyan-400/60',
      iconColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      step: '04',
      time: '11:30 - 13:00',
      title: 'Trò chuyện & Giao lưu',
      description: 'Dành thời gian trò chuyện, nhận lời chúc và tiệc ngọt thân mật.',
      icon: MessageSquareHeart,
      color: 'rose',
      borderColor: 'border-rose-400/30 hover:border-rose-400/60',
      iconColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
  ];

  return (
    <section
      id="schedule"
      className="relative w-full py-32 md:py-44 border-t border-amber-400/20 bg-black overflow-hidden px-6 sm:px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Area */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Label: "LỊCH TRÌNH BUỔI LỄ" in text-xs tracking-[3px] uppercase */}
          <motion.span
            {...fadeUp(0.1)}
            className="inline-block text-xs tracking-[3px] uppercase text-amber-300 font-semibold liquid-glass border border-amber-400/30 px-3.5 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            LỊCH TRÌNH BUỔI LỄ
          </motion.span>

          {/* Heading: text-4xl md:text-6xl — "Timeline for the Special Day" */}
          <motion.h2
            {...fadeUp(0.2)}
            className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white"
          >
            Timeline for the{' '}
            <span className="font-serif italic font-normal text-gradient-gold">
              Special Day
            </span>
          </motion.h2>
        </div>

        {/* Video: Rounded rounded-2xl, aspect-[3/1] in FULL VIBRANT COLOR */}
        <motion.div
          {...fadeUp(0.3)}
          className="w-full aspect-[2.5/1] sm:aspect-[3/1] rounded-2xl overflow-hidden mb-12 border border-amber-400/30 liquid-glass relative shadow-2xl shadow-black group"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 0.75;
            }}
            onPlay={(e) => {
              e.currentTarget.playbackRate = 0.75;
            }}
            className="w-full h-full object-cover brightness-100 transition-transform duration-700 group-hover:scale-105"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
              type="video/mp4"
            />
            <source src="/videos/banner.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-8 pointer-events-none">
            <span className="text-xs sm:text-sm tracking-[2px] uppercase text-amber-200 font-mono font-medium drop-shadow-md">
              FPT University Convention Hall • Hall Alpha
            </span>
          </div>
        </motion.div>

        {/* 4-column feature grid (md:grid-cols-4 gap-8) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {scheduleItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                {...fadeUp(0.35 + index * 0.1)}
                className={`liquid-glass rounded-2xl p-6 sm:p-7 flex flex-col justify-between border ${item.borderColor} shadow-lg transition-all duration-300 group relative`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border ${item.badgeBg}`}>
                      {item.step}
                    </span>
                    <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-200/90 block mb-1">
                    {item.time}
                  </span>
                  <h3 className="font-semibold text-base text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
