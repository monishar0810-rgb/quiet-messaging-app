/**
 * Synthesizes a clean, pleasant notification chime using Web Audio API.
 * This is 100% client-side and requires no external audio assets.
 */
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Create oscillator and gain node
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Beautiful high-quality chime sound
    // Two notes in quick succession (sine wave)
    osc.type = 'sine';
    
    const now = ctx.currentTime;
    
    // First note (E6)
    osc.frequency.setValueAtTime(1318.51, now);
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    // Second note (A6) after 0.08 seconds
    osc.frequency.setValueAtTime(1760.00, now + 0.08);
    gainNode.gain.setValueAtTime(0.15, now + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (error) {
    // Gracefully handle browsers blocking AudioContext or missing support
    console.warn('Audio synthesis failed or blocked by browser:', error);
  }
}
