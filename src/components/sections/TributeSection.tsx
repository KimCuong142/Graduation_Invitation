import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Heart } from 'lucide-react';

interface WordProps {
  text: string;
  range: [number, number];
  progress: MotionValue<number>;
  isHighlight?: boolean;
}

const Word: React.FC<WordProps> = ({ text, range, progress, isHighlight }) => {
  const opacity = useTransform(progress, range, [0.35, 1.0]);

  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.25em] transition-colors duration-150 ${
        isHighlight
          ? 'text-amber-400 font-bold drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]'
          : 'text-stone-100'
      }`}
    >
      {text}
    </motion.span>
  );
};

export const TributeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.46'],
  });

  const paragraph1Text =
    'Bốn năm đại học không chỉ là điểm số hay đồ án — đó là nơi lòng kiên trì gặp gỡ đam mê, nơi những người bạn tri kỷ cùng nhau tạo nên một thời thanh xuân rực rỡ.';
  const p1Words = paragraph1Text.split(' ');

  const paragraph2Text =
    'Gửi lời tri ân chân thành nhất đến gia đình, thầy cô và những người bạn đã luôn tin tưởng, đồng hành cùng tôi trên mọi nẻo đường.';
  const p2Words = paragraph2Text.split(' ');

  // Define highlight tokens for paragraph 1: "kiên trì", "đam mê", "thanh xuân"
  const isHighlightP1 = (word: string) => {
    const clean = word.toLowerCase().replace(/[—.,!]/g, '');
    return (
      clean === 'kiên' ||
      clean === 'trì' ||
      clean === 'đam' ||
      clean === 'mê' ||
      clean === 'thanh' ||
      clean === 'xuân'
    );
  };

  return (
    <section
      ref={sectionRef}
      id="tribute"
      className="relative w-full py-16 md:py-24 px-4 sm:px-8 md:px-12 bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* Outer Card Container with Video directly in Background */}
      <div className="relative w-full max-w-4xl min-h-[500px] sm:min-h-[560px] md:min-h-[600px] rounded-3xl md:rounded-[40px] overflow-hidden border border-amber-400/30 liquid-glass shadow-2xl shadow-black flex flex-col items-center justify-between p-6 sm:p-10 md:p-12 text-center">
        {/* Background Video Layer */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain object-center opacity-100 brightness-105 scale-[0.88] sm:scale-90"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
              type="video/mp4"
            />
            <source src="/videos/tribute.mp4" type="video/mp4" />
          </video>
          {/* Lớp làm mờ nhẹ toàn thẻ, trong suốt 100% không thêm màu đen làm tối video */}
          <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />
        </div>

        {/* Top: Section Badge */}
        <div className="relative z-10 shrink-0 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-rose-400/30 liquid-glass text-xs tracking-[3px] uppercase text-rose-300 font-semibold shadow-[0_0_15px_rgba(244,63,94,0.15)] bg-black/60">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
            <span>TRI ÂN & KỶ NIỆM</span>
          </div>
        </div>

        {/* Center: Scroll-driven Word-by-Word Reveal Text directly ON the video (No backdrop-blur or box) */}
        <div className="relative z-10 my-auto max-w-2xl text-center space-y-5 sm:space-y-7 px-2">
          {/* Paragraph 1 */}
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.38] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            {p1Words.map((word, i) => {
              const start = (i / p1Words.length) * 0.44;
              const end = start + (1 / p1Words.length) * 0.44;
              return (
                <Word
                  key={`p1-${i}-${word}`}
                  text={word}
                  range={[start, end]}
                  progress={scrollYProgress}
                  isHighlight={isHighlightP1(word)}
                />
              );
            })}
          </p>

          {/* Paragraph 2 */}
          <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-stone-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]">
            {p2Words.map((word, i) => {
              const start = 0.44 + (i / p2Words.length) * 0.36;
              const end = start + (1 / p2Words.length) * 0.36;
              return (
                <Word
                  key={`p2-${i}-${word}`}
                  text={word}
                  range={[start, end]}
                  progress={scrollYProgress}
                />
              );
            })}
          </p>
        </div>

        {/* Bottom Tag */}
        <div className="relative z-10 shrink-0 pt-4">
          <span className="text-[11px] sm:text-xs text-amber-200/90 tracking-[2.5px] uppercase font-mono font-medium drop-shadow-md bg-black/60 px-3.5 py-1 rounded-full border border-amber-400/30">
            2022 — 2026 • FPT UNIVERSITY
          </span>
        </div>
      </div>
    </section>
  );
};
