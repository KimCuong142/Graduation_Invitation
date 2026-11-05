import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { X, Send, User, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getWishesFromGoogleSheet, postWishToGoogleSheet, WishItem } from '../../services/guestbookApi';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName?: string;
  initialMessage?: string;
}

const DEFAULT_WISHES: WishItem[] = [
  {
    id: 1,
    name: 'Thầy Trần Minh Hoàng',
    relationship: 'Giảng viên hướng dẫn',
    message:
      'Chúc mừng Kim Cương đã hoàn thành xuất sắc đồ án tốt nghiệp! Thầy tin với sự kiên trì và đam mê này, em sẽ còn tiến xa hơn nữa trong sự nghiệp.',
    timestamp: 'Hôm qua',
  },
  {
    id: 2,
    name: 'Nguyễn Lê Bảo Trâm',
    relationship: 'Bạn cùng lớp',
    message:
      'Chúc mừng Kim Cương tốt nghiệp rực rỡ! 4 năm qua cùng nhau nỗ lực giờ đã hái quả ngọt rồi. Mãi tự hào về cậu!',
    timestamp: '2 ngày trước',
  },
  {
    id: 3,
    name: 'Bác Nguyễn Văn Thành',
    relationship: 'Gia đình',
    message:
      'Tự hào về cháu Kim Cương! Chúc cháu luôn vững bước, gặt hái thêm nhiều thành công trên con đường sắp tới.',
    timestamp: '3 ngày trước',
  },
];

export const GuestbookModal: React.FC<GuestbookModalProps> = ({
  isOpen,
  onClose,
  guestName = '',
  initialMessage = '',
}) => {
  const [entries, setEntries] = useState<WishItem[]>(DEFAULT_WISHES);
  const [name, setName] = useState(guestName);
  const [relationship, setRelationship] = useState('Bạn bè');
  const [message, setMessage] = useState(initialMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justPosted, setJustPosted] = useState(false);

  // Sync guestName / initialMessage when modal opens
  useEffect(() => {
    if (isOpen) {
      if (guestName && !name) setName(guestName);
      if (initialMessage && !message) setMessage(initialMessage);
    }
  }, [isOpen, guestName, initialMessage]);

  const loadWishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const sheetWishes = await getWishesFromGoogleSheet();
      if (sheetWishes && sheetWishes.length > 0) {
        setEntries(sheetWishes);
      } else {
        // Fallback to local storage if Google Sheet empty or offline
        const stored = localStorage.getItem('grad_guestbook');
        if (stored) {
          setEntries([...JSON.parse(stored), ...DEFAULT_WISHES]);
        }
      }
    } catch (err) {
      console.warn('Error loading wishes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadWishes();
    }
  }, [isOpen, loadWishes]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const authorName = name.trim();
    const wishContent = message.trim();

    const newEntry: WishItem = {
      id: Date.now(),
      name: authorName,
      relationship,
      message: wishContent,
      timestamp: 'Vừa xong',
    };

    // Optimistic UI update
    setEntries((prev) => [newEntry, ...prev]);

    // Send to Google Sheet
    await postWishToGoogleSheet(authorName, wishContent);

    // Backup to localStorage
    try {
      const userCreated = JSON.parse(
        localStorage.getItem('grad_guestbook') || '[]',
      );
      localStorage.setItem(
        'grad_guestbook',
        JSON.stringify([newEntry, ...userCreated]),
      );
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#001E3D', '#E11D48', '#10B981', '#F59E0B'],
      });
    } catch (err) {
      console.error(err);
    }

    setIsSubmitting(false);
    setMessage('');
    setJustPosted(true);
    setTimeout(() => setJustPosted(false), 4000);

    // Silently re-sync from Google Sheet after 2s
    setTimeout(() => {
      loadWishes();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl shadow-black text-left max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[2px] text-amber-300 font-bold bg-amber-500/10 border border-amber-400/40 px-3 py-1 rounded-full w-fit mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sổ Lưu Bút Kỷ Niệm (Google Sheet Live)</span>
            </div>

            <button
              onClick={loadWishes}
              disabled={isLoading}
              title="Làm mới danh sách lời chúc từ Google Sheet"
              className="text-stone-400 hover:text-amber-300 transition-colors p-1 flex items-center gap-1 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Đồng bộ</span>
            </button>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Guestbook & Lời Chúc
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Gửi gắm những lời chúc tốt đẹp nhất đến <strong className="text-amber-300">Huỳnh Kim Cương</strong> nhân ngày tốt nghiệp.
          </p>
        </div>

        {/* Form to submit new wish */}
        <form onSubmit={handleSubmit} className="mb-5 shrink-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn *"
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors"
              />
            </div>

            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400/80 transition-colors"
            >
              <option value="Bạn bè">Bạn bè / Đồng môn</option>
              <option value="Gia đình">Gia đình / Người thân</option>
              <option value="Thầy cô">Thầy cô / Mentor</option>
              <option value="Đồng nghiệp">Đồng nghiệp</option>
              <option value="Khác">Người mến mộ</option>
            </select>
          </div>

          <div className="flex gap-2">
            <textarea
              required
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Viết lời chúc của bạn gửi đến Huỳnh Kim Cương..."
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold rounded-xl px-5 py-2 text-xs sm:text-sm hover:brightness-105 shadow-md shadow-amber-500/25 flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi'}</span>
            </button>
          </div>

          {justPosted && (
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-500/10 p-2 rounded-lg border border-amber-400/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Lời chúc của bạn đã được ghi vào Google Sheet và hiển thị cho mọi người!</span>
            </div>
          )}
        </form>

        {/* Existing Wishes Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {entries.map((entry, index) => (
            <div
              key={entry.id || index}
              className="liquid-glass rounded-2xl p-4 border border-white/10 text-left hover:border-amber-400/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {entry.name}
                  </span>
                  {entry.relationship && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-medium">
                      {entry.relationship}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-stone-400">
                  {entry.timestamp}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-wrap">
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
