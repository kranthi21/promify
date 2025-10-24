let audioContext: AudioContext | null = null;

export const initAudioContext = () => {
  if (typeof AudioContext !== 'undefined' && !audioContext) {
    audioContext = new AudioContext();
  }
};

export const playNotificationSound = () => {
  if (!audioContext) {
    initAudioContext();
  }

  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.05;

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 180);
};

export const vibrate = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
};
