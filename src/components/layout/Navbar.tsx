import React, { useState, useEffect } from 'react';
import { Menu, X, Play, Pause, Music } from 'lucide-react';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';

interface NavbarProps {
  onOpenGuestbook?: () => void;
  guestName?: string;
  hasInvitation?: boolean;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Instagram"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="LinkedIn"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Facebook"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGuestbook,
  guestName,
  hasInvitation = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isPlaying, toggle: toggleMusic } = useBackgroundMusic();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Trang chủ', href: '#hero' },
    { label: 'Cột mốc', href: '#milestones' },
    ...(hasInvitation ? [{ label: 'Thư mời 3D', href: '#invitation-3d' }] : []),
    { label: 'Lịch trình', href: '#schedule' },
    { label: 'Sổ lưu bút', href: '#guestbook' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === '#guestbook' && onOpenGuestbook) {
      onOpenGuestbook();
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-8 md:px-28 py-4 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-md border-b border-amber-400/20 shadow-lg shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo (concentric circles icon) + Graduation • 2026 */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, '#hero')}
          className="flex items-center gap-3 group text-foreground cursor-pointer select-none"
        >
          {/* Concentric circles icon in radiant gold */}
          <div className="w-7 h-7 rounded-full border-2 border-amber-400/70 flex items-center justify-center group-hover:border-amber-300 transition-colors duration-200">
            <div className="w-3 h-3 rounded-full border border-amber-400/80 bg-amber-400/30 group-hover:bg-amber-400/50 transition-colors duration-200" />
          </div>
          <span className="font-bold tracking-tight text-sm md:text-base text-white group-hover:text-amber-200 transition-colors">
            Graduation • <span className="text-gradient-gold">2026</span>
          </span>
        </a>

        {/* Center-left: Nav links separated by • dots */}
        <nav className="hidden lg:flex items-center gap-5 text-xs tracking-wider uppercase">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.label}>
              {index > 0 && <span className="text-amber-400/40">•</span>}
              <a
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-stone-300 hover:text-amber-300 transition-colors duration-200 py-1 font-medium"
              >
                {link.label}
              </a>
            </React.Fragment>
          ))}
        </nav>

        {/* Right: Music Play/Pause + Guest pill + Social icons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Topbar Music Play/Pause Button */}
          <button
            onClick={toggleMusic}
            type="button"
            aria-label={isPlaying ? 'Tạm dừng bài hát' : 'Phát bài hát'}
            title={isPlaying ? 'Tạm dừng: Cảm Ơn Người Đã Thức Cùng Tôi' : 'Phát: Cảm Ơn Người Đã Thức Cùng Tôi'}
            className={`h-9 px-3 rounded-full liquid-glass liquid-glass-hover flex items-center gap-2 text-xs font-medium transition-all duration-300 border select-none cursor-pointer ${
              isPlaying
                ? 'border-amber-400/60 bg-amber-400/20 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.25)]'
                : 'border-white/10 hover:border-amber-400/40 text-stone-300 hover:text-amber-300'
            }`}
          >
            {isPlaying ? (
              <>
                <span className="flex items-end gap-[2px] h-3">
                  <span className="w-[2px] h-2 bg-amber-400 rounded-full animate-pulse" />
                  <span className="w-[2px] h-3.5 bg-amber-300 rounded-full animate-bounce" />
                  <span className="w-[2px] h-1.5 bg-amber-400 rounded-full animate-pulse" />
                </span>
                <Pause className="w-3.5 h-3.5 fill-amber-300 shrink-0" />
                <span className="text-[11px] tracking-wide">Nhạc</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current shrink-0 ml-0.5 text-amber-400" />
                <span className="text-[11px] tracking-wide">Phát nhạc</span>
              </>
            )}
          </button>

          {guestName && (
            <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-medium">
              <span>Khách mời:</span>
              <span className="font-bold text-white">{guestName}</span>
            </div>
          )}

          <a
            href="https://www.instagram.com/_the.dia.mond?rpxt=aHp6OGl2M2kzYnZv"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-9 h-9 rounded-full liquid-glass liquid-glass-hover border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-stone-300 hover:text-amber-300 transition-all duration-200 shadow-sm"
          >
            <InstagramIcon />
          </a>

          <a
            href="https://www.linkedin.com/in/kim-cuong-huynh-26240b1a0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full liquid-glass liquid-glass-hover border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-stone-300 hover:text-amber-300 transition-all duration-200 shadow-sm"
          >
            <LinkedinIcon />
          </a>

          <a
            href="https://www.facebook.com/share/1Se4x8a3A5/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full liquid-glass liquid-glass-hover border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-stone-300 hover:text-amber-300 transition-all duration-200 shadow-sm"
          >
            <FacebookIcon />
          </a>
        </div>

        {/* Mobile: Music Play/Pause + Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleMusic}
            type="button"
            aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
            className={`w-9 h-9 rounded-full liquid-glass flex items-center justify-center transition-all duration-200 border cursor-pointer ${
              isPlaying
                ? 'border-amber-400/60 bg-amber-400/20 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                : 'border-white/10 text-stone-300'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-amber-300 text-amber-300" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5 text-amber-400" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-amber-300 p-2 border border-amber-400/30"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-amber-400/30 backdrop-blur-xl px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <button
            onClick={toggleMusic}
            type="button"
            className={`w-full py-2.5 px-4 rounded-xl liquid-glass flex items-center justify-between border transition-all ${
              isPlaying
                ? 'border-amber-400/50 bg-amber-400/20 text-amber-300'
                : 'border-white/10 text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <Music className="w-4 h-4 text-amber-400" />
              <span>Cảm Ơn Người Đã Thức Cùng Tôi</span>
            </div>
            {isPlaying ? (
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                <Pause className="w-3.5 h-3.5 fill-amber-300" />
                <span>Tạm dừng</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-stone-300 font-bold">
                <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>Phát nhạc</span>
              </div>
            )}
          </button>

          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base text-stone-300 hover:text-amber-300 transition-colors py-2 border-b border-white/10"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://www.instagram.com/_the.dia.mond?rpxt=aHp6OGl2M2kzYnZv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-stone-300 hover:text-amber-300 border border-white/10"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/kim-cuong-huynh-26240b1a0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-stone-300 hover:text-amber-300 border border-white/10"
            >
              <LinkedinIcon />
            </a>
            <a
              href="https://www.facebook.com/share/1Se4x8a3A5/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-stone-300 hover:text-amber-300 border border-white/10"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
