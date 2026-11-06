import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-8 md:px-28 border-t border-amber-400/20 bg-black flex flex-col md:flex-row justify-between items-center gap-6">
      {/* Left: Copyright */}
      <div>
        <p className="text-stone-400 text-sm text-center md:text-left">
          © 2026 <span className="text-white font-medium">Huỳnh Kim Cương</span>. All memories cherished.
        </p>
      </div>

      {/* Right: Contact, Location, Social links */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
        <a
          href="tel:+84901234567"
          className="text-stone-400 hover:text-amber-300 transition-colors duration-200"
        >
          Contact
        </a>

        <a
          href="https://maps.google.com/?q=Đại+học+FPT+TP.HCM"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-400 hover:text-amber-300 transition-colors duration-200"
        >
          Location
        </a>

        <a
          href="https://www.facebook.com/share/1Se4x8a3A5/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-400 hover:text-amber-300 transition-colors duration-200"
        >
          Facebook
        </a>

        <a
          href="https://www.instagram.com/_the.dia.mond?rpxt=aHp6OGl2M2kzYnZv"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-400 hover:text-amber-300 transition-colors duration-200"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
};
