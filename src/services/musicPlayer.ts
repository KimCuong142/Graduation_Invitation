/**
 * Background Music Player for Graduation Invitation Web
 * Song: "Cảm Ơn Người Đã Thức Cùng Tôi" (Phùng Khánh Linh)
 * File: /camon.m4a (starts from 5.0s, skipping intro)
 */

class BackgroundMusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private userPaused: boolean = false;
  private listeners: Set<() => void> = new Set();
  private initialized: boolean = false;
  private initialSeekDone: boolean = false;

  public init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    try {
      this.audio = new Audio('/camon.m4a');
      this.audio.loop = true;
      this.audio.volume = 0.65;
      this.audio.preload = 'auto';

      // Seek to 5 seconds as requested (skip first 5s)
      const setStartOffset = () => {
        if (!this.initialSeekDone && this.audio) {
          try {
            this.audio.currentTime = 5.0;
            this.initialSeekDone = true;
          } catch {
            // Some browsers require loadedmetadata before seeking
          }
        }
      };

      this.audio.addEventListener('loadedmetadata', setStartOffset, { once: true });
      setStartOffset();

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        if (this.audio) {
          this.audio.currentTime = 5.0;
          this.audio.play().catch(() => {});
        }
      });

      // Attempt immediate autoplay on entry
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.notify();
          })
          .catch(() => {
            // Autoplay blocked by browser policy -> start on first user interaction
            this.setupInteractionFallback();
          });
      }
    } catch (err) {
      console.warn('MusicPlayer init error:', err);
    }
  }

  private setupInteractionFallback() {
    const handleFirstGesture = () => {
      if (this.userPaused) {
        cleanup();
        return;
      }
      if (this.audio && this.audio.paused) {
        if (this.audio.currentTime < 5.0) {
          this.audio.currentTime = 5.0;
        }
        this.audio
          .play()
          .then(() => {
            this.isPlaying = true;
            this.notify();
          })
          .catch(() => {});
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
  }

  public play() {
    this.userPaused = false;
    if (!this.audio) {
      this.init();
    }
    if (this.audio) {
      if (this.audio.currentTime < 5.0) {
        this.audio.currentTime = 5.0;
      }
      this.audio.play().catch((err) => {
        console.warn('Failed to resume playback:', err);
      });
    }
  }

  public pause() {
    this.userPaused = true;
    if (this.audio) {
      this.audio.pause();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in musicPlayer listener:', err);
      }
    });
  }
}

export const musicPlayer = new BackgroundMusicPlayer();
