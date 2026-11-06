import { useState, useEffect } from 'react';
import { musicPlayer } from '../services/musicPlayer';

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize music player when app loads
    musicPlayer.init();

    // Subscribe to state changes
    const unsubscribe = musicPlayer.subscribe(() => {
      setIsPlaying(musicPlayer.getIsPlaying());
    });

    setIsPlaying(musicPlayer.getIsPlaying());
    return unsubscribe;
  }, []);

  return {
    isPlaying,
    play: () => musicPlayer.play(),
    pause: () => musicPlayer.pause(),
    toggle: () => musicPlayer.toggle(),
  };
}
