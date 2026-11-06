import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Send, User, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import { postWishToGoogleSheet, WishItem } from '../../services/guestbookApi';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName?: string;
  initialMessage?: string;
  onWishCreated?: (wish: WishItem) => void;
}

export const GuestbookModal: React.FC<GuestbookModalProps> = ({
  isOpen,
  onClose,
  guestName = '',
  initialMessage = '',
  onWishCreated,
}) => {
  const [name, setName] = useState(guestName);
  const [relationship, setRelationship] = useState('Bạn bè');
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justPosted, setJustPosted] = useState(false);

  // Sync guestName / initialMessage when modal opens
  useEffect(() => {
    if (isOpen) {
      if (guestName && !name) setName(guestName);
      if (initialMessage) setMessage(initialMessage);
      setJustPosted(false);
    }
  }, [isOpen, guestName, initialMessage]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const authorName = name.trim();
    const wishContent = message.trim();

    const newEntry: WishItem = {
      id: `wish-${Date.now()}`,
      name: authorName,
      relationship,
      message: wishContent,
      timestamp: 'Vừa xong',
    };

    // Backup to localStorage
    try {
      const userCreated = JSON.parse(
        localStorage.getItem('grad_guestbook') || '[]',
      );
      localStorage.setItem(
        'grad_guestbook',
        JSON.stringify([newEntry, ...userCreated]),
      );
    } catch (err) {
      console.error('Failed to save wish to localStorage:', err);
    }

    // Dispatch global event for floating bubbles
    window.dispatchEvent(
      new CustomEvent('new-graduation-wish', { detail: newEntry })
    );
    if (onWishCreated) {
      onWishCreated(newEntry);
    }

    // Confetti celebration
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F59E0B', '#E11D48', '#38BDF8', '#10B981'],
    });

    // Send to Google Sheet in background
    postWishToGoogleSheet(authorName, wishContent).catch((err) => {
      console.warn('Google Sheet submission warning:', err);
    });

    setIsSubmitting(false);
    setMessage('');
    setJustPosted(true);

    // Auto close after 2.2 seconds so user can see their wish floating outside
    setTimeout(() => {
      setJustPosted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950/95 rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-2xl shadow-black text-left flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 shrink-0">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[2px] text-amber-300 font-bold bg-amber-500/10 border border-amber-400/40 px-3 py-1 rounded-full w-fit mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sổ Lưu Bút Kỷ Niệm</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Gửi Lời Chúc</span>
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400 inline" />
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
            Gửi gắm những lời chúc tốt đẹp nhất đến <strong className="text-amber-300">Huỳnh Kim Cương</strong>. Lời chúc của bạn sẽ bay lên cùng những khoảnh khắc thanh xuân rực rỡ!
          </p>
        </div>

        {/* Form to submit new wish */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn *"
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors"
              />
            </div>

            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/80 transition-colors cursor-pointer"
            >
              <option value="Bạn bè">Bạn bè / Đồng môn</option>
              <option value="Gia đình">Gia đình / Người thân</option>
              <option value="Thầy cô">Thầy cô / Mentor</option>
              <option value="Đồng nghiệp">Đồng nghiệp</option>
              <option value="Khác">Người mến mộ</option>
            </select>
          </div>

          <div>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Viết lời chúc hoặc lời nhắn nhủ của bạn gửi đến Huỳnh Kim Cương..."
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors resize-none leading-relaxed"
            />
          </div>

          {justPosted ? (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-400/30 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Lời chúc của bạn đã được gửi thành công và đang bay lên ngoài trang ✨</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold rounded-xl py-3 text-sm hover:brightness-105 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all duration-200"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Đang gửi...' : 'GỬI LỜI CHÚC'}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
