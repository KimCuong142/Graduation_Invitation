import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { TriFoldSection } from './components/sections/TriFoldSection';
import { TributeSection } from './components/sections/TributeSection';
import { ScheduleSection } from './components/sections/ScheduleSection';
import { CTASection } from './components/sections/CTASection';
import { Footer } from './components/layout/Footer';
import { GuestbookModal } from './components/modals/GuestbookModal';
import { FloatingWishBubbles } from './components/wishes/FloatingWishBubbles';
import { resolveGuestFromUrl, GuestProfile, getGuestPanelKey } from './data/guests';

export const App: React.FC = () => {
  const [guest, setGuest] = useState<GuestProfile | null>(null);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState('');

  useEffect(() => {
    // Resolve guest from URL on mount (?to=... or /to/...)
    const detected = resolveGuestFromUrl();
    if (detected) {
      setGuest(detected);
      document.title = `Huỳnh Kim Cương | Thư Mời Tốt Nghiệp · Gửi ${detected.name}`;
    } else {
      document.title = 'Huỳnh Kim Cương | Lễ Tốt Nghiệp · Graduation Ceremony 2026';
    }
  }, []);

  const handleOpenGuestbook = (initialWish: string = '') => {
    setPrefilledMessage(initialWish);
    setIsGuestbookOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-black text-foreground selection:bg-white/20 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* 1. Navbar (fixed, transparent) */}
      <Navbar
        onOpenGuestbook={() => handleOpenGuestbook('')}
        guestName={guest?.name}
        hasInvitation={!!guest}
      />

      <main className="w-full">
        {/* 2. Hero Section */}
        <HeroSection
          guestName={guest?.name}
          onOpenGuestbook={handleOpenGuestbook}
        />

        {/* 3. 3D Tri-Fold Brochure Invitation Section (Only shown when guest is specified in URL) */}
        {guest && <TriFoldSection guestKey={getGuestPanelKey(guest)} />}

        {/* 4. Tribute & Gratitude Section (Scroll-driven Word Reveal) */}
        <TributeSection />

        {/* 5. Ceremony Schedule Section (Timeline) */}
        <ScheduleSection />

        {/* 6. CTA & Guestbook Section */}
        <CTASection
          guestName={guest?.name}
          onOpenGuestbook={() => handleOpenGuestbook('')}
        />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* Floating Wish Bubbles (drifting upward in background) */}
      <FloatingWishBubbles />

      {/* Interactive Modals */}
      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        guestName={guest?.name}
        initialMessage={prefilledMessage}
      />
    </div>
  );
};

export default App;
