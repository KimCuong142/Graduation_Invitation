import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Heart } from 'lucide-react';

interface NavbarProps {
  onOpenGuestbook?: () => void;
  onOpenPdf?: () => void;
  guestName?: string;
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

const TwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Twitter / X"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGuestbook,
  onOpenPdf,
  guestName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { label: 'Thư mời 3D', href: '#invitation-3d' },
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

        {/* Right: Guest pill + PDF Button + Social icons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {guestName && (
            <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-medium">
              <span>Khách mời:</span>
              <span className="font-bold text-white">{guestName}</span>
            </div>
          )}

          {onOpenPdf && (
            <button
              onClick={onOpenPdf}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass border border-amber-400/40 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải PDF</span>
            </button>
          )}

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-9 h-9 rounded-full liquid-glass liquid-glass-hover border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-stone-300 hover:text-amber-300 transition-all duration-200 shadow-sm"
          >
            <InstagramIcon />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full liquid-glass liquid-glass-hover border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-stone-300 hover:text-amber-300 transition-all duration-200 shadow-sm"
          >
            <LinkedinIcon />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="w-10 h-10 rounded-full liquid-glass liquid-glass-hover border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-stone-300 hover:text-amber-300 transition-all duration-200 shadow-sm"
          >
            <TwitterIcon />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-amber-300 p-2 border border-amber-400/30"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-amber-400/30 backdrop-blur-xl px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
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
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-stone-300 hover:text-amber-300 border border-white/10"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-stone-300 hover:text-amber-300 border border-white/10"
            >
              <LinkedinIcon />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-stone-300 hover:text-amber-300 border border-white/10"
            >
              <TwitterIcon />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
