import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getWishesFromGoogleSheet, WishItem } from '../../services/guestbookApi';

interface ActiveBubble {
  id: string;
  name: string;
  message: string;
  leftPercent: number; // 4% to 88%
  startY: string; // e.g. '105vh' or initial '55vh'
  duration: number; // in seconds
  swayAmount: number; // px left/right
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

  // 1. Initial 2 floating bubbles already on screen at start
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    const initialBubbles: ActiveBubble[] = isMobile
      ? [
          {
            id: 'init-1',
            name: 'Diễm Thy',
            message: 'Tui mừng cho pà 🥰',
            leftPercent: 6,
            startY: '60vh',
            duration: 16,
            swayAmount: 12,
          },
          {
            id: 'init-2',
            name: 'Bảo Trâm',
            message: 'Chúc Kim Cương tốt nghiệp rực rỡ! 🎓✨',
            leftPercent: 40,
            startY: '80vh',
            duration: 18,
            swayAmount: -12,
          },
        ]
      : [
          {
            id: 'init-1',
            name: 'Diễm Thy',
            message: 'Tui mừng cho pà 🥰',
            leftPercent: 6,
            startY: '45vh',
            duration: 20,
            swayAmount: 15,
          },
          {
            id: 'init-2',
            name: 'Phương An',
            message: 'Chúc chặng bay mới của Kim Cương thật rực rỡ ❤️',
            leftPercent: 74,
            startY: '65vh',
            duration: 22,
            swayAmount: -15,
          },
          {
            id: 'init-3',
            name: 'Bảo Trâm',
            message: '4 năm nỗ lực giờ đã hái quả ngọt rồi! Mãi tự hào về cậu 🎓✨',
            leftPercent: 12,
            startY: '85vh',
            duration: 24,
            swayAmount: 18,
          },
        ];

    setBubbles(initialBubbles);
  }, []);

  // 2. Fetch live wishes from Google Sheet + localStorage
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

    // 3. Listen to custom event when a user submits a new wish
    const handleNewWish = (e: Event) => {
      const customEvent = e as CustomEvent<WishItem>;
      if (customEvent.detail) {
        const { name, message } = customEvent.detail;
        setWishesPool((prev) => [{ name, message }, ...prev]);

        // Immediately launch highlighted new bubble from bottom
        const isMobile = window.innerWidth < 768;
        const newBubble: ActiveBubble = {
          id: `new-${nextIdRef.current++}-${Date.now()}`,
          name,
          message,
          leftPercent: isMobile ? 10 : 35 + Math.random() * 30,
          startY: '102vh',
          duration: isMobile ? 16 : 20,
          swayAmount: 20,
          isNew: true,
        };
        setBubbles((prev) => [...prev.slice(-5), newBubble]);
      }
    };

    window.addEventListener('new-graduation-wish', handleNewWish);
    return () => {
      isMounted = false;
      window.removeEventListener('new-graduation-wish', handleNewWish);
    };
  }, []);

  // 4. Periodic spawner to keep continuous floating stream
  useEffect(() => {
    if (wishesPool.length === 0) return;

    const interval = setInterval(() => {
      const isMobile = window.innerWidth < 768;
      const maxBubbles = isMobile ? 3 : 5;

      setBubbles((prev) => {
        if (prev.length >= maxBubbles) {
          return prev;
        }

        const wish = wishesPool[Math.floor(Math.random() * wishesPool.length)];
        
        let left: number;
        if (isMobile) {
          // Mobile: alternating sides, avoiding center
          left = Math.random() > 0.5 ? 5 + Math.random() * 8 : 42 + Math.random() * 10;
        } else {
          // Desktop: flanks & slight center
          const lane = Math.random();
          if (lane < 0.45) {
            left = 4 + Math.random() * 18;
          } else if (lane < 0.9) {
            left = 72 + Math.random() * 16;
          } else {
            left = 30 + Math.random() * 30;
          }
        }

        const newBubble: ActiveBubble = {
          id: `b-${nextIdRef.current++}-${Date.now()}`,
          name: wish.name,
          message: wish.message,
          leftPercent: left,
          startY: '104vh',
          duration: isMobile ? 18 + Math.random() * 6 : 22 + Math.random() * 6,
          swayAmount: (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 15),
        };

        return [...prev, newBubble];
      });
    }, 5500);

    return () => clearInterval(interval);
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
              scale: 0.9,
            }}
            animate={{
              y: '-25vh',
              x: [0, bubble.swayAmount, -bubble.swayAmount, 0],
              opacity: [0, 0.95, 0.95, 0.85, 0],
              scale: [0.9, 1, 1, 0.95, 0.9],
            }}
            transition={{
              y: {
                duration: bubble.duration,
                ease: 'linear',
              },
              x: {
                duration: bubble.duration / 3,
                repeat: Infinity,
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
            }}
            className="pointer-events-auto"
          >
            {/* The Wish Bubble Card - matching user reference image */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className={`group select-none cursor-default rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-xl backdrop-blur-md max-w-[190px] sm:max-w-[260px] pointer-events-none md:pointer-events-auto transition-all duration-200 border ${
                bubble.isNew
                  ? 'bg-amber-50/95 border-amber-300 shadow-amber-400/25 ring-2 ring-amber-400/40'
                  : 'bg-white/95 border-white/80 shadow-black/20'
              }`}
            >
              {/* Header: ♡ Name */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-[13px] font-bold text-slate-800">
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 fill-rose-500/25 group-hover:fill-rose-500 transition-colors shrink-0" />
                <span className="truncate">{bubble.name}</span>
                {bubble.isNew && (
                  <span className="text-[9px] sm:text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-bold ml-auto shrink-0 shadow-sm">
                    Mới ✨
                  </span>
                )}
              </div>

              {/* Message text */}
              <p className="text-[10px] sm:text-xs text-slate-600 font-medium mt-0.5 sm:mt-1 leading-snug line-clamp-3 break-words">
                {bubble.message}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
