import React, { useRef, useEffect } from 'react';
import { LiquidGlass } from '@ybouane/liquidglass';

const SHADOW_PAD = 20;

export interface LiquidGlassBubbleProps {
  children: React.ReactNode;
  backgroundCanvasId?: string;
  cornerRadius?: number;
  isNew?: boolean;
  className?: string;
}

// Cache danh sách phần tử media thật của trang web (video và canvas 3D thiệp)
let cachedMediaElements: (HTMLVideoElement | HTMLCanvasElement)[] = [];
let lastMediaScanTime = 0;

const getMediaElements = (): (HTMLVideoElement | HTMLCanvasElement)[] => {
  const now = performance.now();
  if (now - lastMediaScanTime > 1000 || cachedMediaElements.length === 0) {
    // Chỉ lấy đúng thẻ video nền hoặc Canvas 3D thiệp, loại bỏ toàn bộ canvas phụ trợ
    cachedMediaElements = Array.from(
      document.querySelectorAll<HTMLVideoElement | HTMLCanvasElement>('video, #trifold-3d-canvas')
    );
    lastMediaScanTime = now;
  }
  return cachedMediaElements;
};

export const LiquidGlassBubble: React.FC<LiquidGlassBubbleProps> = ({
  children,
  backgroundCanvasId,
  cornerRadius = 40,
  isNew = false,
  className = '',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const mirrorCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let liquidInstance: LiquidGlass | null = null;
    let isDestroyed = false;
    let rafId: number | null = null;
    let attempts = 0;

    // 1. Khởi tạo LiquidGlass với đúng cấu hình defaults theo yêu cầu
    const initLG = async () => {
      if (
        !rootRef.current ||
        !glassRef.current ||
        glassRef.current.offsetWidth === 0
      ) {
        if (attempts < 25 && !isDestroyed) {
          attempts++;
          rafId = requestAnimationFrame(initLG);
        }
        return;
      }

      try {
        liquidInstance = await LiquidGlass.init({
          root: rootRef.current,
          glassElements: [glassRef.current],
          defaults: {
            blurAmount: 0,        // 0: Giữ nền trong suốt, sắc nét (không làm mờ đục)
            refraction: 1.5,      // Độ bẻ cong ánh sáng ở rìa kính (tạo cảm giác dày)
            chromAberration: 0.3, // Tán sắc viền quang học (viền cầu vồng nhẹ RGB)
            edgeHighlight: 0,     // Độ sáng viền (Dock 2026 để 0 cho viền tự nhiên)
            specular: 0,          // Độ bóng phản xạ ánh sáng điểm
            fresnel: 1,           // Hiệu ứng phản xạ Fresnel ở góc nghiêng
            distortion: 0.15,     // Độ gợn sóng biến dạng vi mô của bề mặt chất lỏng
            cornerRadius: cornerRadius, // 40: Bán kính bo góc (px) khớp với CSS border-radius
            zRadius: 30,          // Độ sâu mặt kính cong (bevel depth)
            opacity: 1,           // Độ trong suốt toàn phần
            saturation: 0.08,     // Tăng nhẹ độ tươi màu xuyên qua kính
            brightness: 0,        // Độ sáng bù trừ
            shadowOpacity: isNew ? 0.5 : 0.35,   // Độ đậm bóng đổ dưới đáy kính
            shadowSpread: 12,     // Bán kính lan toả của bóng
            bevelMode: 0,         // 0: Thấu kính hai mặt lồi (biconvex pill)
          },
        });

        if (isDestroyed && liquidInstance) {
          liquidInstance.destroy();
        }
      } catch (err) {
        console.warn('LiquidGlass init warning:', err);
      }
    };

    rafId = requestAnimationFrame(initLG);

    // 2. Dynamic Mirroring 60 FPS
    let cachedRect: DOMRect | null = null;
    let lastRectUpdate = 0;

    const refreshRect = () => {
      cachedRect = null;
    };

    window.addEventListener('resize', refreshRect);
    window.addEventListener('scroll', refreshRect, true);

    const updateMirror = (ts: number = 0) => {
      if (isDestroyed) return;

      const mirror = mirrorCanvasRef.current;
      const root = rootRef.current;

      if (mirror && root) {
        if (!cachedRect || ts - lastRectUpdate > 16) {
          cachedRect = root.getBoundingClientRect();
          lastRectUpdate = ts;
        }
        const rootRect = cachedRect;
        const dpr = 1;
        const targetW = Math.max(10, Math.round((rootRect.width + SHADOW_PAD * 2) * dpr));
        const targetH = Math.max(10, Math.round((rootRect.height + SHADOW_PAD * 2) * dpr));

        if (mirror.width !== targetW || mirror.height !== targetH) {
          mirror.width = targetW;
          mirror.height = targetH;
        }

        const ctx = mirror.getContext('2d', { alpha: false });
        if (ctx) {
          // Luôn phủ màu nền tối sâu của website (#050508) làm đáy để tránh lộ màu trắng mặc định #ffffff của thư viện
          ctx.fillStyle = '#050508';
          ctx.fillRect(0, 0, targetW, targetH);

          // 2.1. Tìm kiếm media (video hoặc 3D canvas) đang hiển thị phía sau bubble
          let bgMedia: HTMLVideoElement | HTMLCanvasElement | null = null;

          if (backgroundCanvasId) {
            const el = document.getElementById(backgroundCanvasId);
            if (el instanceof HTMLCanvasElement || el instanceof HTMLVideoElement) {
              bgMedia = el;
            }
          }

          if (!bgMedia) {
            const candidates = getMediaElements();
            for (let i = 0; i < candidates.length; i++) {
              const el = candidates[i];
              const elRect = el.getBoundingClientRect();
              if (
                elRect.width > 50 &&
                elRect.height > 50 &&
                elRect.bottom > rootRect.top &&
                elRect.top < rootRect.bottom &&
                elRect.right > rootRect.left &&
                elRect.left < rootRect.right
              ) {
                if (el instanceof HTMLVideoElement) {
                  if (el.readyState >= 2 && !el.paused && !el.ended) {
                    bgMedia = el;
                    break;
                  }
                } else if (el instanceof HTMLCanvasElement) {
                  bgMedia = el;
                  break;
                }
              }
            }
          }

          let drawnBg = false;
          if (bgMedia) {
            try {
              const elRect = bgMedia.getBoundingClientRect();
              const mediaW = bgMedia instanceof HTMLVideoElement ? bgMedia.videoWidth : bgMedia.width;
              const mediaH = bgMedia instanceof HTMLVideoElement ? bgMedia.videoHeight : bgMedia.height;

              if (mediaW > 0 && mediaH > 0 && elRect.width > 0 && elRect.height > 0) {
                const scaleX = mediaW / elRect.width;
                const scaleY = mediaH / elRect.height;
                const mirrorViewportX = rootRect.left - SHADOW_PAD - elRect.left;
                const mirrorViewportY = rootRect.top - SHADOW_PAD - elRect.top;
                const mirrorViewportW = rootRect.width + SHADOW_PAD * 2;
                const mirrorViewportH = rootRect.height + SHADOW_PAD * 2;

                const sx = Math.max(0, mirrorViewportX * scaleX);
                const sy = Math.max(0, mirrorViewportY * scaleY);
                const sw = Math.min(mediaW - sx, mirrorViewportW * scaleX);
                const sh = Math.min(mediaH - sy, mirrorViewportH * scaleY);

                if (sw > 0 && sh > 0) {
                  ctx.drawImage(bgMedia, sx, sy, sw, sh, 0, 0, targetW, targetH);
                  drawnBg = true;
                }
              }
            } catch {
              // Ignore cross-origin canvas errors
            }
          }

          // 2.2. Nếu không có video/canvas phía sau:
          // Phủ ánh sáng kính trong suốt nhẹ nhàng trên nền đen
          if (!drawnBg) {
            const grad = ctx.createLinearGradient(0, 0, targetW, targetH);
            if (isNew) {
              grad.addColorStop(0, '#1c1608');
              grad.addColorStop(0.5, '#2e2008');
              grad.addColorStop(1, '#181206');
            } else {
              grad.addColorStop(0, '#0d131d');
              grad.addColorStop(0.5, '#16202f');
              grad.addColorStop(1, '#090e16');
            }
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetW, targetH);
          }
        }
      }

      rafId = requestAnimationFrame(updateMirror);
    };

    rafId = requestAnimationFrame(updateMirror);

    // 3. Cleanup khi component unmount
    return () => {
      isDestroyed = true;
      window.removeEventListener('resize', refreshRect);
      window.removeEventListener('scroll', refreshRect, true);
      if (rafId) cancelAnimationFrame(rafId);
      if (liquidInstance) {
        liquidInstance.destroy();
      }
    };
  }, [backgroundCanvasId, cornerRadius, isNew]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-visible inline-block transition-transform duration-200 ${className}`}
      style={{ overflow: 'visible' }}
    >
      {/* Layer 1: Mirror Canvas đệm phía sau */}
      <canvas
        ref={mirrorCanvasRef}
        data-dynamic
        className="absolute pointer-events-none opacity-0"
        style={{
          left: -SHADOW_PAD,
          top: -SHADOW_PAD,
          width: `calc(100% + ${SHADOW_PAD * 2}px)`,
          height: `calc(100% + ${SHADOW_PAD * 2}px)`,
          zIndex: -10,
        }}
      />

      {/* Layer 2: Capsule kính lỏng (LiquidGlass WebGL shader) - bo góc 40px khớp với cornerRadius */}
      <div
        ref={glassRef}
        className={`absolute inset-0 pointer-events-none rounded-[40px] border ${
          isNew ? 'border-amber-300/40' : 'border-white/20'
        }`}
        style={{ overflow: 'visible' }}
      />

      {/* Layer 3: Nội dung tương tác bên trong */}
      <div className="relative z-10 px-4 py-3 sm:px-5 sm:py-3.5 max-w-[220px] sm:max-w-[280px]">
        {children}
      </div>
    </div>
  );
};
