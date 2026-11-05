import React from 'react';
import { InvitationViewMode } from '../../types/invitation';
import { Sparkles, Sliders, Printer, BookOpen, Layers, LayoutGrid, FoldHorizontal } from 'lucide-react';

interface NavigationControlsProps {
  currentMode: InvitationViewMode;
  onModeChange: (mode: InvitationViewMode) => void;
  onOpenPersonalize: () => void;
  onPrint: () => void;
  recipientName: string;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentMode,
  onModeChange,
  onOpenPersonalize,
  onPrint,
  recipientName,
}) => {
  const modes: { id: InvitationViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'brochure', label: 'Tri-fold Gốc (Ảnh 1→2&5→2,3,4)', icon: <FoldHorizontal className="w-3.5 h-3.5 text-[#C59D5F]" /> },
    { id: '3d-fold', label: 'Mở thiệp 3D', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'inside-spread', label: '3 Mặt Trong', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'all-panels', label: 'Tất cả trang', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="w-full no-print bg-stone-900/90 backdrop-blur-md border-b border-stone-800 sticky top-0 z-40 px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#001E3D] border border-[#C59D5F] flex items-center justify-center shadow">
            <Sparkles className="w-4 h-4 text-[#C59D5F]" />
          </div>
          <div>
            <h1 className="font-cinzel text-xs sm:text-sm font-bold tracking-wider text-[#F5DEB0]">
              TRI-FOLD INVITATION
            </h1>
            <p className="text-[10px] text-stone-400 font-sans">
              Kính gửi: <span className="text-[#C59D5F] font-semibold">{recipientName}</span>
            </p>
          </div>
        </div>

        {/* Center View Mode Switcher */}
        <div className="flex items-center bg-stone-950 p-1 rounded-full border border-stone-800 shadow-inner overflow-x-auto max-w-full">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all ${
                currentMode === m.id
                  ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            title="In thiệp hoặc Lưu thành PDF"
            className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors border border-stone-700 shadow-sm"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPersonalize}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#C59D5F] text-[#001E3D] font-sans text-xs font-bold hover:bg-[#D4AF37] transition-all shadow-md active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tùy chỉnh</span>
          </button>
        </div>

      </div>
    </header>
  );
};
