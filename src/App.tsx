import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { TriFoldSection } from './components/sections/TriFoldSection';
import { TributeSection } from './components/sections/TributeSection';
import { ScheduleSection } from './components/sections/ScheduleSection';
import { CTASection } from './components/sections/CTASection';
import { Footer } from './components/layout/Footer';
import { GuestbookModal } from './components/modals/GuestbookModal';
import { PdfInvitationModal } from './components/modals/PdfInvitationModal';
import { resolveGuestFromUrl, GuestProfile } from './data/guests';

export const App: React.FC = () => {
  const [guest, setGuest] = useState<GuestProfile | null>(null);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState('');

  useEffect(() => {
    // Resolve guest from URL on mount (?to=... or /to/...)
    const detected = resolveGuestFromUrl();
    if (detected) {
      setGuest(detected);
    }
  }, []);

  const handleOpenGuestbook = (initialWish: string = '') => {
    setPrefilledMessage(initialWish);
    setIsGuestbookOpen(true);
  };

  const handleOpenPdf = () => {
    setIsPdfModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-black text-foreground selection:bg-white/20 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* 1. Navbar (fixed, transparent) */}
      <Navbar
        onOpenGuestbook={() => handleOpenGuestbook('')}
        onOpenPdf={handleOpenPdf}
        guestName={guest?.name}
      />

      <main className="w-full">
        {/* 2. Hero Section */}
        <HeroSection
          guestName={guest?.name}
          onOpenGuestbook={handleOpenGuestbook}
          onOpenPdf={handleOpenPdf}
        />

        {/* 3. 3D Tri-Fold Brochure Invitation Section */}
        <TriFoldSection />

        {/* 4. Tribute & Gratitude Section (Scroll-driven Word Reveal) */}
        <TributeSection />

        {/* 5. Ceremony Schedule Section (Timeline) */}
        <ScheduleSection />

        {/* 6. CTA & Guestbook Section */}
        <CTASection
          guestName={guest?.name}
          onOpenGuestbook={() => handleOpenGuestbook('')}
          onOpenPdf={handleOpenPdf}
        />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* Interactive Modals */}
      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        guestName={guest?.name}
        initialMessage={prefilledMessage}
      />

      <PdfInvitationModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        recipientName={guest?.name || 'Quý Khách'}
        salutation={guest?.salutation || 'Kính gửi'}
        role={guest?.role}
      />
    </div>
  );
};

export default App;
