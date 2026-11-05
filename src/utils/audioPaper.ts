// Web Audio API Paper Rustle Sound Synthesizer (Zero external dependencies)
let audioCtx: AudioContext | null = null;

export const playPaperSound = (type: 'flip' | 'unfold' | 'rustle' = 'flip') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const duration = type === 'unfold' ? 0.35 : 0.22;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise with exponential decay envelope
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.pow(1 - i / bufferSize, 1.8);
      // Pink/Brownish noise filter approximation
      const white = Math.random() * 2 - 1;
      data[i] = white * decay * 0.45;
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to simulate paper rustling (bandpass around 1200Hz - 3500Hz)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(type === 'unfold' ? 1400 : 2200, audioCtx.currentTime);
    filter.Q.setValueAtTime(0.9, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start();
  } catch (err) {
    // Ignore audio restrictions if user hasn't interacted
  }
};

