import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playPaperSound } from '../../utils/audioPaper';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Maximize2,
  X,
  Hand,
  Sparkles,
  Layers
} from 'lucide-react';

export interface InvitationFlipbookProps {
  className?: string;
  enableSound?: boolean;
}

const IMAGES = {
  1: '/design/1.jpg', // Cánh 1 (Bìa ngoài)
  2: '/design/2.jpg', // Phần nền bên trong (Trái)
  3: '/design/3.jpg', // Phần nền bên trong (Giữa)
  4: '/design/4.jpg', // Phần nền bên trong (Phải)
  5: '/design/5.jpg', // Cánh 2 (Mở từ trái sang)
};

export const InvitationFlipbook: React.FC<InvitationFlipbookProps> = ({
  className = '',
  enableSound = true,
}) => {
  // 3 Distinct Folding Stages:
  // Stage 0: Closed -> Cánh 1 (Ảnh 1) covers everything
  // Stage 1: Semi-Open -> Cánh 1 opened to left. Shows Ảnh 2 (left) and Cánh 2 (Ảnh 5 on right)
  // Stage 2: Fully Unfolded -> Cánh 2 opened to right. Reveals Fixed Base: Ảnh 2, 3, 4
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  // Live drag state & progress (0 to 1) for real-time pointer tracking
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [activeDragAction, setActiveDragAction] = useState<
    'open-flap1' | 'open-flap2' | 'close-flap2' | 'close-flap1' | null
  >(null);

  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Preloading state
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const startXRef = useRef<number>(0);
  const currentDragProgressRef = useRef<number>(0);

  // Preload all 5 images
  useEffect(() => {
    let isMounted = true;
    let count = 0;
    const list = Object.values(IMAGES);
    const total = list.length;

    const preload = async () => {
      try {
        const promises = list.map((src) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            if (img.complete) {
              count++;
              if (isMounted) setLoadProgress(Math.round((count / total) * 100));
              resolve();
              return;
            }
            img.onload = () => {
              count++;
              if (isMounted) setLoadProgress(Math.round((count / total) * 100));
              resolve();
            };
            img.onerror = () => {
              count++;
              if (isMounted) setLoadProgress(Math.round((count / total) * 100));
              resolve();
            };
          });
        });

        await Promise.all(promises);
        if (isMounted) setImagesLoaded(true);
      } catch {
        if (isMounted) setImagesLoaded(true);
      }
    };

    preload();
    return () => {
      isMounted = false;
    };
  }, []);

  // Transition handler
  const transitionTo = (newStage: 0 | 1 | 2) => {
    if (newStage === stage) return;
    if (soundEnabled) {
      playPaperSound(newStage > stage ? 'unfold' : 'flip');
    }
    setStage(newStage);
    setDragProgress(0);
    setIsDragging(false);
    setActiveDragAction(null);

    if (newStage === 2) {
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#D4AF37', '#001E3D', '#FAF6ED', '#C59D5F'],
        });
      } catch {
        // ignore
      }
    }
  };

  // Auto-play presentation
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    transitionTo(0);

    setTimeout(() => {
      transitionTo(1);
      setTimeout(() => {
        transitionTo(2);
        setIsAutoPlaying(false);
      }, 1300);
    }, 1100);
  };

  // =========================================================================
  // POINTER EVENT HANDLERS (DRAG TO FLIP WITH RIGID 3D ROTATION)
  // =========================================================================
  const handlePointerDown = (
    e: React.PointerEvent,
    action: 'open-flap1' | 'open-flap2' | 'close-flap2' | 'close-flap1'
  ) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setActiveDragAction(action);
    startXRef.current = e.clientX;
    currentDragProgressRef.current = 0;
    setDragProgress(0);
    if (soundEnabled) {
      playPaperSound('rustle');
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !activeDragAction) return;
    const deltaX = e.clientX - startXRef.current;
    const dragDistanceNeeded = 220; // Pixels needed for 180 deg flip

    let progress = 0;
    if (activeDragAction === 'open-flap1') {
      // Dragging from right to left (deltaX is negative)
      progress = Math.max(0, Math.min(1, -deltaX / dragDistanceNeeded));
    } else if (activeDragAction === 'open-flap2') {
      // Dragging from left to right (deltaX is positive)
      progress = Math.max(0, Math.min(1, deltaX / dragDistanceNeeded));
    } else if (activeDragAction === 'close-flap2') {
      // Dragging from right to left to close flap 2
      progress = Math.max(0, Math.min(1, -deltaX / dragDistanceNeeded));
    } else if (activeDragAction === 'close-flap1') {
      // Dragging from left to right to close flap 1
      progress = Math.max(0, Math.min(1, deltaX / dragDistanceNeeded));
    }

    currentDragProgressRef.current = progress;
    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !activeDragAction) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const progress = currentDragProgressRef.current;
    const threshold = 0.35; // Snap open/closed if past 35%

    if (activeDragAction === 'open-flap1') {
      if (progress >= threshold) {
        transitionTo(1);
      } else {
        setDragProgress(0);
        setIsDragging(false);
        setActiveDragAction(null);
      }
    } else if (activeDragAction === 'open-flap2') {
      if (progress >= threshold) {
        transitionTo(2);
      } else {
        setDragProgress(0);
        setIsDragging(false);
        setActiveDragAction(null);
      }
    } else if (activeDragAction === 'close-flap2') {
      if (progress >= threshold) {
        transitionTo(1);
      } else {
        setDragProgress(0);
        setIsDragging(false);
        setActiveDragAction(null);
      }
    } else if (activeDragAction === 'close-flap1') {
      if (progress >= threshold) {
        transitionTo(0);
      } else {
        setDragProgress(0);
        setIsDragging(false);
        setActiveDragAction(null);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (stage === 0) transitionTo(1);
        else if (stage === 1) transitionTo(2);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (stage === 2) transitionTo(1);
        else if (stage === 1) transitionTo(0);
      } else if (e.key === 'Home') {
        transitionTo(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  // Compute live rotation angles for rigid 3D flaps
  // Flap 1 (Ảnh 1): rotates around LEFT hinge (0 to -180 deg)
  const flap1Angle = 
    stage === 0
      ? activeDragAction === 'open-flap1'
        ? dragProgress * 180
        : 0
      : stage >= 1
        ? activeDragAction === 'close-flap1'
          ? 180 - dragProgress * 180
          : 180
        : 0;

  // Flap 2 (Ảnh 5): rotates around RIGHT hinge (0 to 180 deg)
  const flap2Angle = 
    stage === 1
      ? activeDragAction === 'open-flap2'
        ? dragProgress * 180
        : 0
      : stage === 2
        ? activeDragAction === 'close-flap2'
          ? 180 - dragProgress * 180
          : 180
        : 0;

  if (!imagesLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[460px]">
        <div className="w-12 h-12 rounded-full border-2 border-[#C59D5F]/30 border-t-[#C59D5F] animate-spin mb-4" />
        <p className="font-cinzel text-sm text-[#F5DEB0] tracking-wider mb-2">
          Đang nạp các lớp thiệp Canva...
        </p>
        <div className="w-48 bg-stone-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#C59D5F] to-amber-200 h-full transition-all duration-200"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <span className="text-[11px] text-stone-400 font-mono mt-2">{loadProgress}%</span>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      
      {/* Top Breadcrumb Steps */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-2 px-3 py-2 mb-3 bg-stone-900/50 rounded-2xl border border-stone-800/80 backdrop-blur-md">
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => transitionTo(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              stage === 0
                ? 'bg-[#C59D5F] text-[#001E3D] shadow-md scale-105'
                : 'bg-stone-800/80 text-stone-300 hover:text-white'
            }`}
          >
            1. Cánh 1 (Ảnh 1)
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-600" />

          <button
            onClick={() => transitionTo(1)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              stage === 1
                ? 'bg-[#C59D5F] text-[#001E3D] shadow-md scale-105'
                : 'bg-stone-800/80 text-stone-300 hover:text-white'
            }`}
          >
            2. Cánh 2 (Ảnh 5)
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-600" />

          <button
            onClick={() => transitionTo(2)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              stage === 2
                ? 'bg-[#C59D5F] text-[#001E3D] shadow-md scale-105'
                : 'bg-stone-800/80 text-stone-300 hover:text-white'
            }`}
          >
            3. Trọn bộ (Ảnh 2, 3, 4)
          </button>
        </div>

        {/* Auto-play and Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001E3D] border border-[#C59D5F]/50 text-[#F5DEB0] text-xs font-semibold hover:bg-[#032B52] transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3 text-[#C59D5F]" />
            <span className="hidden sm:inline">{isAutoPlaying ? 'Đang mở...' : 'Tự động mở'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white border border-stone-700/60"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C59D5F]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Helpful Interactive Instruction Banner */}
      <div className="mb-3 sm:mb-4 flex items-center justify-center gap-2 text-stone-300 text-xs sm:text-sm font-sans px-4 py-1.5 rounded-full bg-stone-900/70 border border-stone-800/90 backdrop-blur-sm shadow-md animate-pulse">
        <Hand className="w-4 h-4 text-[#C59D5F]" />
        <span>
          {stage === 0 && '👉 Kéo mép phải Cánh 1 sang trái để mở thiệp (lật cứng nguyên trang)'}
          {stage === 1 && '👉 Kéo mép trái Cánh 2 (Ảnh 5) sang phải để mở trọn bộ 3 ảnh'}
          {stage === 2 && '🎉 Đã mở trọn bộ! Kéo mép phải sang trái hoặc nhấn "Đóng bìa" để gập lại'}
        </span>
      </div>

      {/* ===================================================================== */}
      {/* 3D TRIFOLD STAGE (UNIFIED PERSPECTIVE ENVIRONMENT)                    */}
      {/* ===================================================================== */}
      <div 
        className="w-full flex justify-center items-center py-2 sm:py-4 px-2 select-none"
        style={{ perspective: '2600px' }}
      >
        
        {/* =================================================================== */}
        {/* STAGE 0: CLOSED -> SHOWING CÁNH 1 (ẢNH 1)                           */}
        {/* =================================================================== */}
        {stage === 0 && (
          <div className="relative group transition-all duration-300">
            {/* Ambient Table Drop Shadow */}
            <div className="absolute -inset-4 bg-black/60 blur-2xl rounded-2xl transform translate-y-6 pointer-events-none" />

            {/* Base Container holding Image 2 underneath with Flap 1 on top */}
            <div className="relative w-[280px] sm:w-[340px] md:w-[380px] aspect-[1240/1748] rounded-xl overflow-visible shadow-2xl border border-[#D4AF37]/50 bg-stone-950">
              
              {/* Underlying Image 2 (Inside Left base panel, revealed as Flap 1 rotates open) */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <img
                  src={IMAGES[2]}
                  alt="Ảnh 2 lót dưới"
                  className="w-full h-full object-fill pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* LỚP CÁNH 1: ẢNH 1 (Bìa ngoài thiệp) */}
              {/* Trục xoay: Trục gập bên trái (origin-left). LẬT CỨNG NGUYÊN 1 TRANG */}
              <div 
                className="absolute inset-0 origin-left preserve-3d cursor-grab active:cursor-grabbing"
                style={{
                  transform: `rotateY(-${flap1Angle}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1)',
                  zIndex: 30,
                  transformStyle: 'preserve-3d',
                }}
                onPointerDown={e => handlePointerDown(e, 'open-flap1')}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Mặt trước Cánh 1: Ảnh 1 */}
                <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl bg-stone-900 border border-white/10">
                  <img
                    src={IMAGES[1]}
                    alt="Cánh 1 - Bìa trước Ảnh 1"
                    className="w-full h-full object-fill select-none pointer-events-none block"
                    draggable={false}
                  />

                  {/* Real-time Dynamic Specular Lighting Gradient */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-white/15 pointer-events-none"
                    style={{ opacity: 0.15 + (flap1Angle / 180) * 0.4 }}
                  />

                  {/* Pull Handle at Right Edge: "Kéo mở từ bên phải" */}
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#C59D5F]/35 via-transparent to-transparent flex items-center justify-end pr-2 pointer-events-none">
                    <div className="flex flex-col items-center gap-1 bg-[#001E3D]/95 border border-[#C59D5F] text-[#F5DEB0] px-2 py-3 rounded-l-xl shadow-2xl">
                      <ChevronRight className="w-5 h-5 text-[#C59D5F] animate-pulse" />
                      <span className="text-[9px] font-bold tracking-wider [writing-mode:vertical-rl]">KÉO MỞ</span>
                    </div>
                  </div>

                  {/* Bottom helper pill */}
                  <div className="absolute bottom-3 inset-x-4 bg-stone-900/90 backdrop-blur-md py-1.5 px-3 rounded-lg border border-[#C59D5F]/40 text-center text-[11px] text-[#F5DEB0] shadow font-medium pointer-events-none">
                    Kéo mép phải sang trái hoặc bấm "Mở nấc 1"
                  </div>

                  {/* Zoom Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedImage(IMAGES[1]);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/70 text-stone-200 hover:text-white z-40 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Phóng to Ảnh 1"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Cast Shadow underneath Cánh 1 onto the base */}
              <div 
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: (1 - flap1Angle / 180) * 0.45 }}
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STAGE 1: SEMI-OPEN -> ẢNH 2 (TRÁI) & CÁNH 2 (ẢNH 5 TRÊN PHẢI)       */}
        {/* =================================================================== */}
        {stage === 1 && (
          <div className="relative flex items-center shadow-2xl rounded-2xl border border-[#D4AF37]/50 bg-stone-950/80 p-1">
            {/* Ambient Shadow on table */}
            <div className="absolute -inset-5 bg-black/50 blur-2xl pointer-events-none" />

            {/* Left Panel: Ảnh 2 (Fixed Base Inside Left Panel) */}
            <div 
              className="relative w-[220px] sm:w-[280px] md:w-[330px] aspect-[1240/1748] rounded-l-xl overflow-hidden border-r border-[#D4AF37]/40 group"
              onPointerDown={e => handlePointerDown(e, 'close-flap1')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <img
                src={IMAGES[2]}
                alt="Ảnh 2 - Cử nhân Huỳnh Kim Cương"
                className="w-full h-full object-fill pointer-events-none block"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15 pointer-events-none" />
              
              {/* Fold-back handle on left */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center justify-start pl-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-4 h-4 text-[#C59D5F]" />
              </div>

              <button
                onClick={() => setZoomedImage(IMAGES[2])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/70 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to Ảnh 2"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Center Fold Crease Line */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Right Container: Holds Fixed Base Image 3 underneath, with CÁNH 2 (Ảnh 5) on top */}
            <div className="relative w-[220px] sm:w-[280px] md:w-[330px] aspect-[1240/1748] rounded-r-xl overflow-visible group">
              
              {/* Underlying Image 3 (Fixed Base Center panel, revealed as Flap 2 opens) */}
              <div className="absolute inset-0 rounded-r-xl overflow-hidden">
                <img
                  src={IMAGES[3]}
                  alt="Ảnh 3 lót bên dưới"
                  className="w-full h-full object-fill pointer-events-none block"
                  draggable={false}
                />
              </div>

              {/* LỚP CÁNH 2: ẢNH 5 */}
              {/* Trục xoay: Trục gập bên phải (origin-right). LẬT CỨNG NGUYÊN 1 TRANG (không bẻ cong mép ảnh) */}
              <div 
                className="absolute inset-0 origin-right preserve-3d cursor-grab active:cursor-grabbing"
                style={{
                  transform: `rotateY(${flap2Angle}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1)',
                  zIndex: 30,
                  transformStyle: 'preserve-3d',
                }}
                onPointerDown={e => handlePointerDown(e, 'open-flap2')}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Mặt trước Cánh 2: Ảnh 5 (Lật cứng nguyên 1 trang) */}
                <div className="absolute inset-0 backface-hidden rounded-r-xl overflow-hidden shadow-2xl bg-stone-900 border border-white/10">
                  <img
                    src={IMAGES[5]}
                    alt="Cánh 2 - Ảnh 5 Cảm ơn"
                    className="w-full h-full object-fill select-none pointer-events-none block"
                    draggable={false}
                  />

                  {/* Real-time Dynamic Lighting */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-white/15 pointer-events-none"
                    style={{ opacity: 0.15 + (flap2Angle / 180) * 0.4 }}
                  />
                  
                  {/* Pull Handle at Left Edge: "Kéo mở từ bên trái" */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#C59D5F]/40 via-transparent to-transparent flex items-center justify-start pl-2 pointer-events-none">
                    <div className="flex flex-col items-center gap-1 bg-[#001E3D]/95 border border-[#C59D5F] text-[#F5DEB0] px-2 py-3 rounded-r-xl shadow-2xl">
                      <ChevronRight className="w-5 h-5 text-[#C59D5F] animate-pulse" />
                      <span className="text-[9px] font-bold tracking-wider [writing-mode:vertical-rl]">KÉO MỞ</span>
                    </div>
                  </div>

                  {/* Bottom helper pill */}
                  <div className="absolute bottom-3 inset-x-4 bg-stone-900/90 backdrop-blur-md py-1.5 px-3 rounded-lg border border-[#C59D5F]/40 text-center text-[11px] text-[#F5DEB0] shadow font-medium pointer-events-none">
                    Kéo mép trái Ảnh 5 sang phải để mở trọn bộ 3 ảnh
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedImage(IMAGES[5]);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/70 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Phóng to Ảnh 5"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Cast Shadow under Cánh 2 onto Image 3 beneath */}
              <div 
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: (1 - flap2Angle / 180) * 0.45 }}
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STAGE 2: FULLY UNFOLDED -> PHẦN NỀN BÊN TRONG: ẢNH 2, 3, 4 CỐ ĐỊNH   */}
        {/* =================================================================== */}
        {stage === 2 && (
          <div className="relative flex items-center shadow-2xl rounded-2xl border border-[#D4AF37]/50 bg-stone-950/80 p-1 animate-fadeIn duration-500">
            {/* Ambient Shadow on table */}
            <div className="absolute -inset-6 bg-black/50 blur-2xl pointer-events-none" />

            {/* Panel 1: Ảnh 2 (Inside Left Panel) */}
            <div className="relative w-[170px] sm:w-[240px] md:w-[290px] lg:w-[330px] aspect-[1240/1748] rounded-l-xl overflow-hidden border-r border-[#D4AF37]/40 group">
              <img
                src={IMAGES[2]}
                alt="Ảnh 2 - Cử nhân & Diamond Report"
                className="w-full h-full object-fill pointer-events-none block"
                draggable={false}
              />
              <button
                onClick={() => setZoomedImage(IMAGES[2])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/70 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to Ảnh 2"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Crease Line 1 */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Panel 2: Ảnh 3 (Inside Center Panel - Thư mời chính) */}
            <div className="relative w-[170px] sm:w-[240px] md:w-[290px] lg:w-[330px] aspect-[1240/1748] overflow-hidden border-r border-[#D4AF37]/40 group">
              <img
                src={IMAGES[3]}
                alt="Ảnh 3 - Thư mời chính & Lịch trình"
                className="w-full h-full object-fill pointer-events-none block"
                draggable={false}
              />
              <button
                onClick={() => setZoomedImage(IMAGES[3])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/70 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to Ảnh 3"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Crease Line 2 */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Panel 3: Ảnh 4 (Inside Right Panel - Đánh giá chất lượng kim cương) */}
            <div 
              className="relative w-[170px] sm:w-[240px] md:w-[290px] lg:w-[330px] aspect-[1240/1748] rounded-r-xl overflow-hidden group cursor-grab active:cursor-grabbing"
              onPointerDown={e => handlePointerDown(e, 'close-flap2')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <img
                src={IMAGES[4]}
                alt="Ảnh 4 - Đánh giá chất lượng kim cương"
                className="w-full h-full object-fill pointer-events-none block"
                draggable={false}
              />
              
              {/* Fold back hint */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/40 via-transparent to-transparent flex items-center justify-end pr-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-5 h-5 text-[#C59D5F]" />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(IMAGES[4]);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/70 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to Ảnh 4"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Floating Minimalist Navigation Controls */}
      <div className="mt-3 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 bg-stone-950/80 border border-stone-800/90 rounded-2xl backdrop-blur-md shadow-xl text-xs text-stone-300">
        
        {/* Flip Prev */}
        <button
          onClick={() => transitionTo((stage - 1) as 0 | 1)}
          disabled={stage === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-[#C59D5F]/60 hover:text-amber-200 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          title="Trang trước"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 text-[#C59D5F]" />
          <span className="hidden sm:inline">Trang trước</span>
        </button>

        {/* Current status badge */}
        <div className="px-3 py-1 bg-stone-900 rounded-lg border border-stone-800/80 font-mono text-[11px] sm:text-xs text-[#F5DEB0] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#C59D5F]" />
          <span>
            {stage === 0 && 'Cánh 1: Bìa (Ảnh 1)'}
            {stage === 1 && 'Cánh 2: Mở nấc 1 (Ảnh 2 & 5)'}
            {stage === 2 && 'Trọn bộ: Phần nền (Ảnh 2, 3, 4)'}
          </span>
        </div>

        {/* Flip Next */}
        <button
          onClick={() => transitionTo((stage + 1) as 1 | 2)}
          disabled={stage === 2}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-[#C59D5F]/60 hover:text-amber-200 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          title="Trang tiếp theo"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Trang tiếp</span>
          <ChevronRight className="w-4 h-4 text-[#C59D5F]" />
        </button>

        <div className="w-[1px] h-4 bg-stone-800 hidden sm:block" />

        {/* Reset to Cover */}
        <button
          onClick={() => transitionTo(0)}
          disabled={stage === 0}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-[#C59D5F]/60 hover:text-amber-200 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          title="Về bìa trước"
          aria-label="Back to Cover"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#C59D5F]" />
          <span className="hidden md:inline">Đóng bìa</span>
        </button>

      </div>

      {/* Lightbox Zoom Modal for Any Image */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 p-2 text-stone-300 hover:text-white bg-stone-800/80 rounded-full transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Chi tiết ảnh gốc Canva"
              className="max-w-full max-h-[85vh] object-contain rounded-xl border border-[#D4AF37]/40 shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default InvitationFlipbook;
