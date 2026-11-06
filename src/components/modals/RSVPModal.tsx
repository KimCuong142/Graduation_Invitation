import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, User, Phone, Users, MessageSquare } from 'lucide-react';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({
  isOpen,
  onClose,
  initialMessage = '',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestsCount, setGuestsCount] = useState('1');
  const [message, setMessage] = useState(initialMessage);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('grad_rsvps') || '[]');
      existing.push({
        id: Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        attending,
        guestsCount: attending === 'yes' ? guestsCount : '0',
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('grad_rsvps', JSON.stringify(existing));

      if (attending === 'yes') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#001E3D', '#E11D48', '#10B981', '#F59E0B', '#3B82F6'],
        });
      }
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl shadow-black text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              Xác nhận thành công!
            </h3>
            <p className="text-sm text-stone-300 max-w-xs mx-auto">
              Cảm ơn {name} đã phản hồi. Kim Cương rất trân trọng sự hiện diện và tình cảm của bạn!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[2px] text-amber-300 font-bold bg-amber-500/10 border border-amber-400/40 px-3 py-1 rounded-full">
                Xác Nhận Tham Dự
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-3">
                Lễ Tốt Nghiệp · <span className="text-gradient-gold">2026</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Vui lòng gửi thông tin để ban tổ chức chuẩn bị chỗ ngồi chu đáo nhất cho bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Attendance Choice */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    attending === 'yes'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                      : 'bg-white/5 border-white/10 text-stone-400 hover:border-emerald-400/50'
                  }`}
                >
                  ✓ Tôi sẽ tham dự
                </button>
                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    attending === 'no'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-400 shadow-md shadow-rose-600/30'
                      : 'bg-white/5 border-white/10 text-stone-400 hover:border-rose-400/50'
                  }`}
                >
                  ✕ Rất tiếc không thể đến
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs text-stone-300 mb-1.5 font-medium">
                  Họ và tên của bạn <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Tuấn Anh"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-stone-300 mb-1.5 font-medium">
                  Số điện thoại liên hệ
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 090 123 4567"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors"
                  />
                </div>
              </div>

              {/* Guests Count if attending */}
              {attending === 'yes' && (
                <div>
                  <label className="block text-xs text-stone-300 mb-1.5 font-medium">
                    Số người cùng tham dự
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/80 transition-colors"
                    >
                      <option value="1">Đi 1 mình</option>
                      <option value="2">Đi cùng 1 người bạn (+1)</option>
                      <option value="3">Đi cùng nhóm (+2 người trở lên)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Note / Message */}
              <div>
                <label className="block text-xs text-stone-300 mb-1.5 font-medium">
                  Lời nhắn gửi đến Kim Cương
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Để lại lời chúc mừng hoặc nhắn gửi..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold rounded-xl py-3 text-sm shadow-lg shadow-amber-500/25 hover:brightness-105 transition-all cursor-pointer"
              >
                Gửi phản hồi RSVP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
