import React, { useState, useRef } from 'react';
import { playPaperSound } from '../../utils/audioPaper';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Volume2, 
  VolumeX,
  MousePointerClick,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const TrifoldBrochureRealistic: React.FC = () => {
  // Step 0: Đóng hoàn toàn -> Hiển thị Ảnh 1 (Bìa trước)
  // Step 1: Mở nấc 1 từ phải ra -> Lộ ra Ảnh 2 (bên trái) và Ảnh 5 (bên phải)
  // Step 2: Mở Ảnh 5 từ trái ra -> Lộ ra trọn bộ Ảnh 2, Ảnh 3, Ảnh 4
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Drag interaction
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  const images = {
    1: '/design/1.jpg',
    2: '/design/2.jpg',
    3: '/design/3.jpg',
    4: '/design/4.jpg',
    5: '/design/5.jpg',
  };

  const handleStepChange = (newStep: 0 | 1 | 2) => {
    if (newStep === step) return;
    if (soundEnabled) {
      playPaperSound(newStep > step ? 'unfold' : 'flip');
    }
    setStep(newStep);

    if (newStep === 2) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#001E3D', '#F5DEB0', '#C59D5F']
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    handleStepChange(0);

    setTimeout(() => {
      handleStepChange(1);
      setTimeout(() => {
        handleStepChange(2);
        setIsAutoPlaying(false);
      }, 1300);
    }, 1100);
  };

  const onDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragDeltaX(0);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragDeltaX(clientX - dragStartX);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    const threshold = 40;
    if (step === 0 && dragDeltaX > threshold) {
      handleStepChange(1);
    } else if (step === 1) {
      if (dragDeltaX > threshold) {
        handleStepChange(2);
      } else if (dragDeltaX < -threshold) {
        handleStepChange(0);
      }
    } else if (step === 2 && dragDeltaX < -threshold) {
      handleStepChange(1);
    }
    setIsDragging(false);
    setDragStartX(0);
    setDragDeltaX(0);
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-2 font-sans">
      
      {/* Top Controls Toolbar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-5 px-4 py-2 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 shadow-xl">
        
        {/* Step Indicator Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleStepChange(0)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === 0
                ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow-lg scale-105'
                : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            1. Bìa thiệp (Ảnh 1)
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-500" />

          <button
            onClick={() => handleStepChange(1)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === 1
                ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow-lg scale-105'
                : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            2. Mở nấc 1 (Ảnh 2 & 5)
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-500" />

          <button
            onClick={() => handleStepChange(2)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === 2
                ? 'bg-[#C59D5F] text-[#001E3D] font-bold shadow-lg scale-105'
                : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            3. Trọn bộ (Ảnh 2, 3, 4)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001E3D] border border-[#C59D5F]/40 text-[#F5DEB0] text-xs font-semibold hover:bg-[#032B52] transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3 text-[#C59D5F]" />
            <span>{isAutoPlaying ? 'Đang mở...' : 'Tự động mở'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Tắt âm thanh giấy' : 'Bật âm thanh giấy'}
            className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C59D5F]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Helpful Interactive Instructions Bar */}
      <div className="flex items-center gap-2 text-xs text-[#F5DEB0] bg-[#001E3D]/80 border border-[#C59D5F]/35 px-4 py-1.5 rounded-full mb-6 shadow-md">
        <MousePointerClick className="w-3.5 h-3.5 text-[#C59D5F] animate-bounce" />
        <span>
          {step === 0 && 'Cầm mép phải ảnh số 1 mở ra sẽ lộ ra ảnh số 2 và 5'}
          {step === 1 && 'Cầm mép trái ảnh số 5 mở ra sẽ lộ ra trọn bộ ảnh số 2, 3, 4'}
          {step === 2 && 'Trọn bộ thiệp Tri-fold A6 đã được mở hoàn toàn'}
        </span>
      </div>

      {/* 3D Perspective Stage */}
      <div 
        onMouseDown={e => onDragStart(e.clientX)}
        onMouseMove={e => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={e => e.touches.length && onDragStart(e.touches[0].clientX)}
        onTouchMove={e => e.touches.length && onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
        className="w-full flex justify-center items-center py-2 px-1 cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: '2200px' }}
      >
        
        {/* ========================================================== */}
        {/* BƯỚC 0: GẬP KÍN - CHỈ THẤY ẢNH SỐ 1                      */}
        {/* ========================================================== */}
        {step === 0 && (
          <div className="relative group transition-all duration-700 ease-out transform hover:scale-[1.015]">
            {/* Ambient Shadow on table */}
            <div className="absolute -inset-3 bg-black/45 blur-2xl rounded-2xl transform translate-y-6 pointer-events-none" />

            {/* Panel 1 Card Container */}
            <div 
              onClick={() => handleStepChange(1)}
              className="relative w-[300px] sm:w-[350px] md:w-[380px] aspect-[1240/1748] rounded-xl overflow-hidden shadow-2xl border border-[#D4AF37]/50 bg-stone-100 cursor-pointer"
            >
              <img
                src={images[1]}
                alt="Ảnh 1 - Bìa thiệp tốt nghiệp"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* Realistic Paper Lighting & Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/20 pointer-events-none" />

              {/* Right Pull-Tab / Flap Indicator: "Mở từ phải ra" */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#C59D5F]/40 via-transparent to-transparent flex items-center justify-end pr-2 pointer-events-none">
                <div className="p-1.5 rounded-full bg-[#001E3D]/90 text-[#F5DEB0] border border-[#C59D5F]/50 shadow-lg animate-pulse">
                  <ChevronRight className="w-5 h-5 text-[#C59D5F]" />
                </div>
              </div>

              {/* Bottom Cue */}
              <div className="absolute bottom-3 inset-x-4 bg-stone-900/80 backdrop-blur-sm py-1.5 px-3 rounded-lg border border-[#C59D5F]/40 text-center text-[10px] text-[#F5DEB0] shadow font-medium pointer-events-none">
                Mở từ phải ra để xem Ảnh 2 và 5
              </div>

              {/* Zoom Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(images[1]);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white hover:bg-stone-900/90 transition-all opacity-0 group-hover:opacity-100 z-30"
                title="Phóng to ảnh 1"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* BƯỚC 1: MỞ NẤC 1 - LỘ RA ẢNH SỐ 2 VÀ ẢNH SỐ 5           */}
        {/* ========================================================== */}
        {step === 1 && (
          <div className="relative flex items-center shadow-2xl rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-stone-900/60 p-1 animate-fadeIn duration-500">
            {/* Ambient Shadow */}
            <div className="absolute -inset-4 bg-black/45 blur-2xl pointer-events-none" />

            {/* Left Panel: Ảnh 2 (Cố định ở vị trí bên trái) */}
            <div className="relative w-[230px] sm:w-[290px] md:w-[340px] aspect-[1240/1748] rounded-l-lg overflow-hidden border-r border-[#D4AF37]/40 group">
              <img
                src={images[2]}
                alt="Ảnh 2 - Cử nhân & Diamond Report"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
              <button
                onClick={() => setZoomedImage(images[2])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white hover:bg-stone-900/90 transition-all opacity-0 group-hover:opacity-100 z-30"
                title="Phóng to ảnh 2"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Nếp gấp ở giữa với bóng đổ chân thực */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Right Panel: Ảnh 5 (Đang gập đè lên, mở từ mép trái ra) */}
            <div 
              onClick={() => handleStepChange(2)}
              className="relative w-[230px] sm:w-[290px] md:w-[340px] aspect-[1240/1748] rounded-r-lg overflow-hidden cursor-pointer group transition-transform hover:scale-[1.01]"
            >
              <img
                src={images[5]}
                alt="Ảnh 5 - Cảm ơn"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* Realistic Shadow of overlapping flap */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-white/10 pointer-events-none" />

              {/* Left Pull Indicator on Image 5: "mở từ trái ra" */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#C59D5F]/45 via-transparent to-transparent flex items-center justify-start pl-2 pointer-events-none">
                <div className="p-1.5 rounded-full bg-[#001E3D]/90 text-[#F5DEB0] border border-[#C59D5F]/50 shadow-lg animate-pulse">
                  <ChevronRight className="w-5 h-5 text-[#C59D5F]" />
                </div>
              </div>

              {/* Bottom Cue */}
              <div className="absolute bottom-3 inset-x-4 bg-stone-900/85 backdrop-blur-sm py-1.5 px-3 rounded-lg border border-[#C59D5F]/40 text-center text-[10px] text-[#F5DEB0] shadow font-medium pointer-events-none">
                Mở Ảnh 5 từ trái ra để lộ Ảnh 2, 3, 4
              </div>

              {/* Zoom Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(images[5]);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white hover:bg-stone-900/90 transition-all opacity-0 group-hover:opacity-100 z-30"
                title="Phóng to ảnh 5"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* BƯỚC 2: MỞ HOÀN TOÀN - LỘ RA ẢNH 2, ẢNH 3, ẢNH 4        */}
        {/* ========================================================== */}
        {step === 2 && (
          <div className="relative flex items-center shadow-2xl rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-stone-900/60 p-1 animate-fadeIn duration-700">
            {/* Ambient Shadow */}
            <div className="absolute -inset-5 bg-black/45 blur-2xl pointer-events-none" />

            {/* Panel 1: Ảnh 2 (Bên trái) */}
            <div className="relative w-[180px] sm:w-[250px] md:w-[310px] lg:w-[340px] aspect-[1240/1748] rounded-l-lg overflow-hidden border-r border-[#D4AF37]/40 group">
              <img
                src={images[2]}
                alt="Ảnh 2 - Cử nhân & Diamond Report"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <button
                onClick={() => setZoomedImage(images[2])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white hover:bg-stone-900/90 transition-all opacity-0 group-hover:opacity-100 z-30"
                title="Phóng to ảnh 2"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Nếp gấp 1 */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Panel 2: Ảnh 3 (Ở giữa) */}
            <div className="relative w-[180px] sm:w-[250px] md:w-[310px] lg:w-[340px] aspect-[1240/1748] overflow-hidden border-r border-[#D4AF37]/40 group">
              <img
                src={images[3]}
                alt="Ảnh 3 - Thư mời chính & Lịch trình"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <button
                onClick={() => setZoomedImage(images[3])}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white hover:bg-stone-900/90 transition-all opacity-0 group-hover:opacity-100 z-30"
                title="Phóng to ảnh 3"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Nếp gấp 2 */}
            <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-800 via-stone-950 to-stone-800 z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

            {/* Panel 3: Ảnh 4 (Bên phải) */}
            <div className="relative w-[180px] sm:w-[250px] md:w-[310px] lg:w-[340px] aspect-[1240/1748] rounded-r-lg overflow-hidden group">
              <img
                src={images[4]}
                alt="Ảnh 4 - Đánh giá chất lượng kim cương"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <button
                onClick={() => setZoomedImage(images[4])}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/60 text-stone-200 hover:text-white hover:bg-stone-900/90 transition-all opacity-0 group-hover:opacity-100 z-30"
                title="Phóng to ảnh 4"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Step Actions */}
      <div className="flex items-center gap-3 mt-4">
        {step > 0 && (
          <button
            onClick={() => handleStepChange((step - 1) as 0 | 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold shadow transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#C59D5F]" />
            <span>Gập lại bước trước</span>
          </button>
        )}

        {step < 2 && (
          <button
            onClick={() => handleStepChange((step + 1) as 1 | 2)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#001E3D] text-[#F5DEB0] border border-[#C59D5F]/50 hover:bg-[#032B52] text-xs font-bold shadow-lg transition-transform active:scale-95"
          >
            <span>Mở bước tiếp theo</span>
            <ChevronRight className="w-4 h-4 text-[#C59D5F]" />
          </button>
        )}

        {step === 2 && (
          <button
            onClick={() => handleStepChange(0)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold shadow transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C59D5F]" />
            <span>Gập kín lại về Ảnh 1</span>
          </button>
        )}
      </div>

      {/* Modal Zoom Viewer */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn cursor-zoom-out"
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
