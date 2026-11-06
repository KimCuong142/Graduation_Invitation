import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getWishesFromGoogleSheet, WishItem } from '../../services/guestbookApi';
import { LiquidGlassBubble } from './LiquidGlassBubble';

interface ActiveBubble {
  id: string;
  name: string;
  message: string;
  leftPercent: number; // 4% to 88%
  startY: string; // e.g. '104vh' or initial '40vh'
  duration: number; // in seconds
  swayAmount: number; // px left/right
  createdAt: number; // timestamp
  isNew?: boolean;
}

const INITIAL_BACKUP_WISHES: { name: string; message: string }[] = [
  { name: 'Diễm Thy', message: 'Tui mừng cho pà 🥰' },
  { name: 'Bảo Trâm', message: 'Chúc Kim Cương tốt nghiệp rực rỡ! 4 năm nỗ lực tuyệt vời 🎓✨' },
  { name: 'Thầy Minh Hoàng', message: 'Thầy tin em sẽ còn tiến thật xa trên con đường sự nghiệp!' },
  { name: 'Phương An', message: 'Cảm ơn vì đã đến và chúc chặng bay mới của Kim Cương thật rực rỡ ❤️' },
  { name: 'Minh Khoa', message: 'Hẹn gặp Kim Cương ở FPT ngày 07/11 nha bạn hiền! 🎉' },
  { name: 'Hoàng Nam', message: 'Tự hào về cậu bạn cùng bàn! Chúc mừng tân cử nhân! 🥂' },
];

export const FloatingWishBubbles: React.FC = () => {
  const [wishesPool, setWishesPool] = useState<{ name: string; message: string }[]>(INITIAL_BACKUP_WISHES);
  const [bubbles, setBubbles] = useState<ActiveBubble[]>([]);
  const nextIdRef = useRef(1);
  const wishIndexRef = useRef(0);
  const laneIndexRef = useRef(0);

  // 1. Khởi tạo sẵn 3-4 bong bóng trên màn hình khi mới vào trang
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const now = Date.now();
    
    const initialBubbles: ActiveBubble[] = isMobile
      ? [
          {
            id: 'init-1',
            name: 'Diễm Thy',
            message: 'Tui mừng cho pà 🥰',
            leftPercent: 6,
            startY: '30vh',
            duration: 10,
            swayAmount: 12,
            createdAt: now - 5000,
          },
          {
            id: 'init-2',
            name: 'Phương An',
            message: 'Chúc chặng bay mới của Kim Cương thật rực rỡ ❤️',
            leftPercent: 42,
            startY: '60vh',
            duration: 11,
            swayAmount: -12,
            createdAt: now - 3000,
          },
          {
            id: 'init-3',
            name: 'Bảo Trâm',
            message: 'Chúc Kim Cương tốt nghiệp rực rỡ! 🎓✨',
            leftPercent: 16,
            startY: '85vh',
            duration: 10,
            swayAmount: 10,
            createdAt: now - 1000,
          },
        ]
      : [
          {
            id: 'init-1',
            name: 'Diễm Thy',
            message: 'Tui mừng cho pà 🥰',
            leftPercent: 5,
            startY: '25vh',
            duration: 11,
            swayAmount: 14,
            createdAt: now - 7000,
          },
          {
            id: 'init-2',
            name: 'Phương An',
            message: 'Chúc chặng bay mới của Kim Cương thật rực rỡ ❤️',
            leftPercent: 76,
            startY: '45vh',
            duration: 12,
            swayAmount: -14,
            createdAt: now - 4000,
          },
          {
            id: 'init-3',
            name: 'Bảo Trâm',
            message: 'Chúc Kim Cương tốt nghiệp rực rỡ! 4 năm nỗ lực tuyệt vời 🎓✨',
            leftPercent: 20,
            startY: '68vh',
            duration: 12,
            swayAmount: 12,
            createdAt: now - 2000,
          },
          {
            id: 'init-4',
            name: 'Thầy Minh Hoàng',
            message: 'Thầy tin em sẽ còn tiến thật xa trên con đường sự nghiệp!',
            leftPercent: 56,
            startY: '88vh',
            duration: 13,
            swayAmount: -12,
            createdAt: now - 500,
          },
        ];

    wishIndexRef.current = 4;
    setBubbles(initialBubbles);
  }, []);

  // 2. Fetch live wishes từ Google Sheet + LocalStorage
  useEffect(() => {
    let isMounted = true;
    const fetchWishes = async () => {
      try {
        const sheetWishes = await getWishesFromGoogleSheet();
        const localWishes: WishItem[] = JSON.parse(
          localStorage.getItem('grad_guestbook') || '[]'
        );

        const combined = [...localWishes, ...sheetWishes]
          .filter((w) => w.message && w.message.trim().length > 0)
          .map((w) => ({
            name: w.name || 'Người chúc ẩn danh',
            message: w.message,
          }));

        if (isMounted && combined.length > 0) {
          const uniqueMap = new Map<string, string>();
          [...combined, ...INITIAL_BACKUP_WISHES].forEach((item) => {
            uniqueMap.set(item.name + ':' + item.message, item.message);
          });
          const merged = Array.from(uniqueMap.entries()).map(([key, val]) => ({
            name: key.split(':')[0],
            message: val,
          }));
          setWishesPool(merged);
        }
      } catch (err) {
        console.warn('Could not load floating wishes:', err);
      }
    };

    fetchWishes();

    // 3. Lắng nghe event khi có người gửi lời chúc mới
    const handleNewWish = (e: Event) => {
      const customEvent = e as CustomEvent<WishItem>;
      if (customEvent.detail) {
        const { name, message } = customEvent.detail;
        setWishesPool((prev) => [{ name, message }, ...prev]);

        const isMobile = window.innerWidth < 768;
        const targetMax = isMobile ? 4 : 6;
        const newBubble: ActiveBubble = {
          id: `new-${nextIdRef.current++}-${Date.now()}`,
          name,
          message,
          leftPercent: isMobile ? 8 : 36 + Math.random() * 20,
          startY: '102vh',
          duration: isMobile ? 10 : 12,
          swayAmount: 16,
          createdAt: Date.now(),
          isNew: true,
        };
        // Giữ tối đa targetMax bong bóng
        setBubbles((prev) => [...prev.slice(-(targetMax - 1)), newBubble]);
      }
    };

    window.addEventListener('new-graduation-wish', handleNewWish);
    return () => {
      isMounted = false;
      window.removeEventListener('new-graduation-wish', handleNewWish);
    };
  }, []);

  // 4. Vòng lặp liên tục: Duy trì 3-6 bong bóng lời chúc nổi lên liên tục với tốc độ nhanh
  useEffect(() => {
    if (wishesPool.length === 0) return;

    // Quét và bổ sung đều đặn mỗi 1.2 giây
    const loopInterval = setInterval(() => {
      const isMobile = window.innerWidth < 768;
      const targetMax = isMobile ? 4 : 6;
      const now = Date.now();

      setBubbles((prev) => {
        // Tự động dọn dẹp các bong bóng đã sống quá thời gian duration (đã bay khỏi đỉnh màn hình)
        const alive = prev.filter((b) => now - b.createdAt < (b.duration + 1) * 1000);

        // Nếu đã đủ targetMax bong bóng đang bay thì giữ nguyên
        if (alive.length >= targetMax) {
          return alive;
        }

        // Lấy lời chúc tuần tự theo vòng lặp (round-robin)
        const poolIndex = wishIndexRef.current % wishesPool.length;
        const wish = wishesPool[poolIndex];
        wishIndexRef.current++;

        // Phân bổ 5 làn bay luân phiên trên Desktop và 3 làn trên Mobile để rải đều không đè lên nhau
        let left: number;
        if (isMobile) {
          const lane = laneIndexRef.current % 3;
          laneIndexRef.current++;
          if (lane === 0) left = 5 + Math.random() * 8;
          else if (lane === 1) left = 38 + Math.random() * 8;
          else left = 20 + Math.random() * 10;
        } else {
          const lane = laneIndexRef.current % 5;
          laneIndexRef.current++;
          if (lane === 0) {
            left = 4 + Math.random() * 10; // Cánh trái ngoài
          } else if (lane === 1) {
            left = 76 + Math.random() * 10; // Cánh phải ngoài
          } else if (lane === 2) {
            left = 18 + Math.random() * 12; // Cánh trái trong
          } else if (lane === 3) {
            left = 60 + Math.random() * 12; // Cánh phải trong
          } else {
            left = 36 + Math.random() * 16; // Ở giữa
          }
        }

        // Tốc độ nhanh hơn 50% (thời gian bay rút ngắn từ 22-26s xuống 11-14s desktop, 9-12s mobile)
        const duration = isMobile ? 9 + Math.random() * 3 : 11 + Math.random() * 3.5;

        const newBubble: ActiveBubble = {
          id: `b-${nextIdRef.current++}-${now}`,
          name: wish.name,
          message: wish.message,
          leftPercent: left,
          startY: '104vh',
          duration,
          swayAmount: (Math.random() > 0.5 ? 1 : -1) * (14 + Math.random() * 12),
          createdAt: now,
        };

        return [...alive, newBubble];
      });
    }, 1200);

    return () => clearInterval(loopInterval);
  }, [wishesPool]);

  const handleBubbleComplete = (id: string) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{
              y: bubble.startY,
              x: 0,
              opacity: 0,
              scale: 0.94,
            }}
            animate={{
              y: '-25vh',
              x: [0, bubble.swayAmount, -bubble.swayAmount, 0],
              opacity: [0, 0.98, 0.98, 0.9, 0],
              scale: [0.94, 1, 1, 0.96, 0.94],
            }}
            transition={{
              y: {
                duration: bubble.duration,
                ease: 'linear',
              },
              x: {
                duration: bubble.duration / 3,
                repeat: 6, // 6 chu kỳ lắc lư trong suốt hành trình thay vì Infinity
                repeatType: 'mirror',
                ease: 'easeInOut',
              },
              opacity: {
                duration: bubble.duration,
                times: [0, 0.08, 0.78, 0.92, 1],
                ease: 'linear',
              },
              scale: {
                duration: bubble.duration,
                times: [0, 0.08, 0.8, 0.95, 1],
                ease: 'easeOut',
              },
            }}
            onAnimationComplete={() => handleBubbleComplete(bubble.id)}
            style={{
              position: 'absolute',
              top: 0,
              left: `${bubble.leftPercent}%`,
              overflow: 'visible',
              willChange: 'transform',
            }}
            className="pointer-events-auto"
          >
            {/* Liquid Glass Wish Bubble */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="group select-none cursor-default transition-transform duration-200"
              style={{ overflow: 'visible' }}
            >
              <LiquidGlassBubble isNew={bubble.isNew} cornerRadius={40}>
                {/* Header: ♡ Name */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-[13px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-tight">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/50 group-hover:fill-rose-500 transition-colors shrink-0 drop-shadow-sm" />
                  <span className="truncate">{bubble.name}</span>
                  {bubble.isNew && (
                    <span className="text-[9px] sm:text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-extrabold ml-auto shrink-0 shadow-sm">
                      Mới ✨
                    </span>
                  )}
                </div>

                {/* Message text */}
                <p className="text-[11px] sm:text-xs text-slate-100 font-medium mt-1 leading-snug line-clamp-3 break-words drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {bubble.message}
                </p>
              </LiquidGlassBubble>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
