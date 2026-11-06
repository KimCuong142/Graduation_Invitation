import React, { useRef, useState } from 'react';
import { X, Download, Printer, Sparkles, Check, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toSlug } from '../../data/guests';

interface PdfInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  salutation?: string;
  role?: string;
}

export const PdfInvitationModal: React.FC<PdfInvitationModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  salutation = 'Kính gửi',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution for crystal clear print
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#050B14',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const isLandscape = canvas.width > canvas.height;
      
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 12;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      const imgRatio = canvas.width / canvas.height;
      let finalWidth = maxWidth;
      let finalHeight = maxWidth / imgRatio;

      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = maxHeight * imgRatio;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

      const safeName = toSlug(recipientName || 'Khach-Quy');
      pdf.save(`Thiep_Moi_Tot_Nghiep_${safeName}.pdf`);

      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback to window.print if html2canvas/jspdf encounters an issue
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 rounded-3xl p-5 sm:p-7 border border-amber-400/40 shadow-2xl shadow-black text-left flex flex-col my-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 shrink-0 pr-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[2px] text-amber-300 font-bold bg-amber-500/10 border border-amber-400/40 px-3 py-1 rounded-full w-fit mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Xuất Thư Mời Cá Nhân Hoá</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Thiệp Mời Dành Cho <span className="text-amber-300">{recipientName}</span>
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Thiệp mời đã được gắn tên của bạn. Bạn có thể tải file PDF sắc nét để lưu giữ hoặc in trực tiếp.
          </p>
        </div>

        {/* Printable Card Preview Container */}
        <div className="flex-1 overflow-y-auto my-2 rounded-2xl border border-amber-400/30 p-2 sm:p-4 bg-black/60 flex items-center justify-center">
          <div
            ref={cardRef}
            id="printable-invitation"
            className="w-full max-w-lg bg-[#070E1A] text-stone-100 rounded-2xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden select-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15), transparent 70%)',
            }}
          >
            {/* Corner Decorative Borders */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />

            {/* Header: University & Ceremony */}
            <div className="text-center border-b border-[#D4AF37]/30 pb-4 mb-4">
              <p className="text-[10px] sm:text-xs uppercase tracking-[3px] text-[#D4AF37] font-semibold">
                ĐẠI HỌC FPT • LỄ TỐT NGHIỆP 2026
              </p>
              <h2 className="text-xl sm:text-2xl font-serif tracking-wider text-white mt-1 uppercase font-bold text-gradient-gold">
                THƯ MỜI THAM DỰ
              </h2>
              <p className="text-[11px] text-stone-400 italic">
                Graduation Ceremony • Class of 2022 - 2026
              </p>
            </div>

            {/* Recipient Section */}
            <div className="text-center my-4 py-2 bg-white/5 rounded-xl border border-[#D4AF37]/20">
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">
                {salutation}:
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mt-1 text-gradient-gold">
                {recipientName}
              </h3>
            </div>

            {/* Body Text */}
            <div className="text-center text-xs sm:text-sm text-stone-300 leading-relaxed space-y-2 mb-5">
              <p>
                Trân trọng kính mời bạn đến tham dự và chung vui tại buổi Lễ Trao Bằng Tốt Nghiệp của Cử nhân:
              </p>
              <p className="text-lg sm:text-xl font-bold text-amber-300 font-serif tracking-wide uppercase">
                HUỲNH KIM CƯƠNG
              </p>
              <p className="text-xs text-stone-400">
                Chuyên ngành Kỹ thuật Phần mềm (Software Engineering)
              </p>
            </div>

            {/* Time & Venue Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/10 mb-4">
              <div className="space-y-1">
                <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block">
                  Thời Gian
                </span>
                <p className="font-bold text-white">12:00 - Thứ Bảy</p>
                <p className="text-stone-300">07 Tháng 11, 2026</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block">
                  Địa Điểm
                </span>
                <p className="font-bold text-white">Hội Trường Grand Hall</p>
                <p className="text-stone-300 text-[11px] leading-tight">
                  Đại học FPT, Khu Công nghệ cao, TP. Thủ Đức, TP.HCM
                </p>
              </div>
            </div>

            {/* Footer Closing */}
            <div className="text-center pt-2 border-t border-[#D4AF37]/30">
              <p className="text-[11px] italic text-amber-200/90 font-serif">
                "Sự hiện diện của bạn là niềm vinh hạnh và kỷ niệm trọn vẹn nhất đối với Kim Cương."
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="text-xs text-stone-400">
            File định dạng chuẩn A4 sắc nét
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              type="button"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full liquid-glass border border-white/20 text-xs font-semibold text-stone-200 hover:text-white hover:border-amber-400/50 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>In Thiệp</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              type="button"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tạo PDF...</span>
                </>
              ) : isDone ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                  <span>Đã tải PDF về máy!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Tải File PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

