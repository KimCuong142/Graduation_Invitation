import React, { useState, useRef, useEffect } from 'react';
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
  Hand,
  Sparkles
} from 'lucide-react';

export const TrifoldInteractivePaper: React.FC = () => {
  // Stage 0: Folded -> Only Image 1
  // Stage 1: Semi-open -> Image 2 (left) and Image 5 (right)
  // Stage 2: Fully unfolded -> Image 2 (left), Image 3 (center), Image 4 (right)
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  // Live drag progress (0 to 1) during user hold & drag
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeDragAction, setActiveDragAction] = useState<'open-cover' | 'open-inner' | 'close-inner' | 'close-cover' | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const startXRef = useRef<number>(0);
  const currentDragProgressRef = useRef<number>(0);

  const images = {
    1: '/design/1.jpg',
    2: '/design/2.jpg',
    3: '/design/3.jpg',
    4: '/design/4.jpg',
    5: '/design/5.jpg',
  };

  // Sound & celebration trigger
  const triggerTransition = (newStage: 0 | 1 | 2) => {
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
          colors: ['#D4AF37', '#001E3D', '#FAF6ED', '#C59D5F']
        });
      } catch (e) {
        // ignore
      }
    }
  };

  // Auto-play presentation
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    triggerTransition(0);

    setTimeout(() => {
      triggerTransition(1);
      setTimeout(() => {
        triggerTransition(2);
        setIsAutoPlaying(false);
      }, 1400);
    }, 1200);
  };

  // =========================================================================
  // POINTER EVENT HANDLERS (HOLD & DRAG WITH REAL-TIME ANGLE TRACKING)
  // =========================================================================
  const handlePointerDown = (e: React.PointerEvent, action: 'open-cover' | 'open-inner' | 'close-inner' | 'close-cover') => {
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
    const dragDistanceNeeded = 260; // Pixels to complete 180 deg fold

    let progress = 0;
    if (activeDragAction === 'open-cover' || activeDragAction === 'open-inner') {
      // Dragging to the right to open
      progress = Math.max(0, Math.min(1, deltaX / dragDistanceNeeded));
    } else {
      // Dragging to the left to close
      progress = Math.max(0, Math.min(1, -deltaX / dragDistanceNeeded));
    }

    currentDragProgressRef.current = progress;
    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !activeDragAction) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}

    const progress = currentDragProgressRef.current;
    const threshold = 0.35; // Snap open if dragged past 35%

    if (activeDragAction === 'open-cover') {
      if (progress >= threshold) {
        triggerTransition(1);
      } else {
        setDragProgress(0);
        setIsDragging(false);
        setActiveDragAction(null);
      }
    } else if (activeDragAction === 'open-inner') {
      if (progress >= threshold) {
        triggerTransition(2);
      } else {
        setDragProgress(0);
        setIsDragging(false);
        setActiveDragAction(null);
      }
    } else if (activeDragAction === 'close-inner') {
      if (progress >= threshold) {
        triggerTransition(1);
      } else {
        setDragProgress(0);
        setIsDragging(false);
        setActiveDragAction(null);
      }
    } else if (activeDragAction === 'close-cover') {
      if (progress >= threshold) {
        triggerTransition(0);
      } else {
        setDragProgress(0);
        setIsDragging(false);
        setActiveDragAction(null);
      }
    }
  };

  // Compute angles for 3D rotation
  // When dragging open-cover: coverAngle goes from 0 to -180 deg
  const liveCoverAngle = activeDragAction === 'open-cover' ? dragProgress * 180 : 0;
  // When dragging open-inner: innerAngle goes from 0 to 180 deg
  const liveInnerAngle = activeDragAction === 'open-inner' ? dragProgress * 180 : (activeDragAction === 'close-inner' ? (1 - dragProgress) * 180 : 0);

  return (
    <div className="w-full flex flex-col items-center select-none py-3 font-sans">
      
      {/* Top Controls Toolbar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 px-4 py-2.5 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 shadow-2xl">
        
        {/* Step Indicator Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => triggerTransition(0)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              stage === 0
                ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow-lg scale-105'
                : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            1. Bìa thiệp (Ảnh 1)
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-500" />

          <button
            onClick={() => triggerTransition(1)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              stage === 1
                ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow-lg scale-105'
                : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            2. Mở nấc 1 (Ảnh 2 & 5)
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-500" />

          <button
            onClick={() => triggerTransition(2)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              stage === 2
                ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow-lg scale-105'
                : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            3. Trọn bộ (Ảnh 2, 3, 4)
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001E3D] border border-[#C59D5F]/40 text-[#F5DEB0] text-xs font-semibold hover:bg-[#032B52] transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-[#C59D5F]" />
            <span>{isAutoPlaying ? 'Đang mở...' : 'Tự động mở'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Tắt âm thanh giấy' : 'Bật âm thanh giấy'}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C59D5F]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Helpful Interactive Instructions Bar */}
      <div className="flex items-center gap-2 text-xs text-[#F5DEB0] bg-[#001E3D]/80 border border-[#C59D5F]/35 px-4 py-1.5 rounded-full mb-6 shadow-md">
        <Hand className="w-4 h-4 text-[#C59D5F] animate-pulse" />
        <span>
          {stage === 0 && '👉 Giữ (Hold) mép phải Ảnh 1 và kéo sang phải để mở thiệp'}
          {stage === 1 && '👉 Giữ (Hold) mép trái Ảnh 5 và kéo sang phải để mở trọn bộ 3 ảnh'}
          {stage === 2 && '🎉 Đã mở hoàn toàn! Có thể giữ mép phải Ảnh 4 kéo sang trái để gập lại'}
        </span>
      </div>

      {/* 3D BROCHURE STAGE */}
      <div 
        className="w-full flex justify-center items-center py-4 px-2 select-none"
        style={{ perspective: '2600px' }}
      >
        
        {/* ================================================================= */}
        {/* STAGE 0: FOLDED (SHOWING IMAGE 1)                                */}
        {/* ================================================================= */}
        {stage === 0 && (
          <div className="relative group transition-all duration-300">
            {/* Table Drop Shadow */}
            <div className="absolute -inset-4 bg-black/50 blur-2xl rounded-2xl transform translate-y-6 pointer-events-none" />

            {/* Base Card Unit */}
            <div className="relative w-[300px] sm:w-[350px] md:w-[380px] aspect-[1240/1748] rounded-xl overflow-hidden shadow-2xl border border-[#D4AF37]/50 bg-stone-100">
              
              {/* Underlying Image 2 (revealed as Image 1 folds open) */}
              <img
                src={images[2]}
                alt="Ảnh 2 lót dưới"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* The Foldable Front Flap (Image 1) that rotates with user drag */}
              <div 
                className="absolute inset-0 origin-left preserve-3d cursor-grab active:cursor-grabbing"
                style={{
                  transform: `rotateY(-${liveCoverAngle}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1)',
                  zIndex: 20
                }}
                onPointerDown={e => handlePointerDown(e, 'open-cover')}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Front Face: Image 1 */}
                <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden">
                  <img
                    src={images[1]}
                    alt="Ảnh 1 - Bìa thiệp tốt nghiệp"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Real-time lighting gradient that adjusts with angle */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-white/20 pointer-events-none"
                    style={{ opacity: 0.2 + (liveCoverAngle / 180) * 0.5 }}
                  />

                  {/* Right Edge Pull Handle with pulsing indicator */}
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#C59D5F]/40 via-transparent to-transparent flex items-center justify-end pr-2 pointer-events-none">
                    <div className="flex flex-col items-center gap-1 bg-[#001E3D]/90 border border-[#C59D5F] text-[#F5DEB0] px-2 py-3 rounded-l-xl shadow-2xl">
                      <ChevronRight className="w-5 h-5 text-[#C59D5F] animate-pulse" />
                      <span className="text-[9px] font-bold tracking-wider vertical-text">KÉO MỞ</span>
                    </div>
                  </div>

                  {/* Zoom Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedImage(images[1]);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Phóng to Ảnh 1"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Fold Crease Shadow under Image 1 */}
              <div 
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: (1 - liveCoverAngle / 180) * 0.35 }}
              />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 1: SEMI-OPEN (SHOWING IMAGE 2 ON LEFT, IMAGE 5 ON RIGHT)    */}
        {/* ================================================================= */}
        {stage === 1 && (
          <div className="relative flex items-center shadow-2xl rounded-xl border border-[#D4AF37]/50 bg-stone-900/60 p-1">
            {/* Ambient Shadow on table */}
            <div className="absolute -inset-5 bg-black/45 blur-2xl pointer-events-none" />

            {/* Left Panel: Image 2 */}
            <div 
              className="relative w-[230px] sm:w-[290px] md:w-[340px] aspect-[1240/1748] rounded-l-lg overflow-hidden border-r border-[#D4AF37]/40 group"
              onPointerDown={e => handlePointerDown(e, 'close-cover')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <img
                src={images[2]}
                alt="Ảnh 2 - Cử nhân & Diamond Report"
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
              
              {/* Optional pull handle to fold back to Image 1 */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/30 via-transparent to-transparent flex items-center justify-start pl-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-4 h-4 text-[#C59D5F]" />
              </div>

              <button
                onClick={() => setZoomedImage(images[2])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to Ảnh 2"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Center Fold Crease Line with Shadow */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Right Container: Holds Image 3 underneath, with Flap 5 on top rotating around right hinge */}
            <div className="relative w-[230px] sm:w-[290px] md:w-[340px] aspect-[1240/1748] rounded-r-lg overflow-hidden group">
              
              {/* Image 3 is sitting underneath, revealed as Flap 5 opens! */}
              <img
                src={images[3]}
                alt="Ảnh 3 lót bên dưới"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Flap 5 (hinged on the right edge, opens to the right to reveal Image 3 & 4) */}
              <div 
                className="absolute inset-0 origin-right preserve-3d cursor-grab active:cursor-grabbing"
                style={{
                  transform: `rotateY(${liveInnerAngle}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1)',
                  zIndex: 20
                }}
                onPointerDown={e => handlePointerDown(e, 'open-inner')}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Front Face: Image 5 (visible when rotated < 90 deg) */}
                <div className="absolute inset-0 backface-hidden rounded-r-lg overflow-hidden">
                  <img
                    src={images[5]}
                    alt="Ảnh 5 - Cảm ơn"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  
                  {/* Left Edge Pull Handle on Image 5: "mở từ trái ra" */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#C59D5F]/45 via-transparent to-transparent flex items-center justify-start pl-2 pointer-events-none">
                    <div className="flex flex-col items-center gap-1 bg-[#001E3D]/95 border border-[#C59D5F] text-[#F5DEB0] px-2 py-3 rounded-r-xl shadow-2xl">
                      <ChevronRight className="w-5 h-5 text-[#C59D5F] animate-pulse" />
                      <span className="text-[9px] font-bold tracking-wider vertical-text">KÉO MỞ</span>
                    </div>
                  </div>

                  {/* Bottom Indicator */}
                  <div className="absolute bottom-3 inset-x-4 bg-stone-900/85 backdrop-blur-sm py-1.5 px-3 rounded-lg border border-[#C59D5F]/40 text-center text-[10px] text-[#F5DEB0] shadow font-medium pointer-events-none">
                    Kéo mép trái Ảnh 5 sang phải để mở Ảnh 2, 3, 4
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedImage(images[5]);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Phóng to Ảnh 5"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Back Face: Image 4 (visible when rotated >= 90 deg) */}
                <div 
                  className="absolute inset-0 rounded-r-lg overflow-hidden"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={images[4]}
                    alt="Ảnh 4 - Đánh giá chất lượng kim cương"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              </div>

              {/* Dynamic shadow on Image 3 beneath */}
              <div 
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: (1 - liveInnerAngle / 180) * 0.4 }}
              />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 2: FULLY UNFOLDED (SHOWING ALL 3 PANELS: 2, 3, 4)           */}
        {/* ================================================================= */}
        {stage === 2 && (
          <div className="relative flex items-center shadow-2xl rounded-xl border border-[#D4AF37]/50 bg-stone-900/60 p-1 animate-fadeIn duration-500">
            {/* Ambient Shadow on table */}
            <div className="absolute -inset-6 bg-black/45 blur-2xl pointer-events-none" />

            {/* Panel 1: Image 2 (Left) */}
            <div className="relative w-[180px] sm:w-[250px] md:w-[310px] lg:w-[340px] aspect-[1240/1748] rounded-l-lg overflow-hidden border-r border-[#D4AF37]/40 group">
              <img
                src={images[2]}
                alt="Ảnh 2 - Cử nhân & Diamond Report"
                className="w-full h-full object-cover pointer-events-none"
              />
              <button
                onClick={() => setZoomedImage(images[2])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to Ảnh 2"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Crease 1 */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Panel 2: Image 3 (Center) */}
            <div className="relative w-[180px] sm:w-[250px] md:w-[310px] lg:w-[340px] aspect-[1240/1748] overflow-hidden border-r border-[#D4AF37]/40 group">
              <img
                src={images[3]}
                alt="Ảnh 3 - Thư mời chính & Lịch trình"
                className="w-full h-full object-cover pointer-events-none"
              />
              <button
                onClick={() => setZoomedImage(images[3])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to Ảnh 3"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Crease 2 */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Panel 3: Image 4 (Right) with fold-back gesture */}
            <div 
              className="relative w-[180px] sm:w-[250px] md:w-[310px] lg:w-[340px] aspect-[1240/1748] rounded-r-lg overflow-hidden group cursor-grab active:cursor-grabbing"
              onPointerDown={e => handlePointerDown(e, 'close-inner')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <img
                src={images[4]}
                alt="Ảnh 4 - Đánh giá chất lượng kim cương"
                className="w-full h-full object-cover pointer-events-none"
              />
              
              {/* Left Pull Handle to fold back */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/30 via-transparent to-transparent flex items-center justify-end pr-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-5 h-5 text-[#C59D5F]" />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(images[4]);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Phóng to Ảnh 4"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Step Actions */}
      <div className="flex items-center gap-3 mt-4">
        {stage > 0 && (
          <button
            onClick={() => triggerTransition((stage - 1) as 0 | 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold shadow transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#C59D5F]" />
            <span>Gập lại bước trước</span>
          </button>
        )}

        {stage < 2 && (
          <button
            onClick={() => triggerTransition((stage + 1) as 1 | 2)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#001E3D] text-[#F5DEB0] border border-[#C59D5F]/50 hover:bg-[#032B52] text-xs font-bold shadow-lg transition-transform active:scale-95"
          >
            <span>Mở nếp gấp tiếp theo</span>
            <ChevronRight className="w-4 h-4 text-[#C59D5F]" />
          </button>
        )}

        {stage === 2 && (
          <button
            onClick={() => triggerTransition(0)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold shadow transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C59D5F]" />
            <span>Gập kín lại về Ảnh 1</span>
          </button>
        )}
      </div>

      {/* Fullscreen High-Resolution Zoom Modal */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[95vh] rounded-xl overflow-hidden shadow-2xl border border-stone-700">
            <img 
              src={zoomedImage} 
              alt="Zoomed Design" 
              className="max-h-[92vh] w-auto object-contain"
            />
            <div className="absolute bottom-3 inset-x-0 text-center text-xs text-stone-300 font-sans pointer-events-none">
              Nhấp vào bất kỳ đâu để đóng lại
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

