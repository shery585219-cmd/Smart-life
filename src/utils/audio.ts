// Web Audio API Synthesized Audio Effects & Ambient Soundscapes
class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbientType: string | null = null;

  constructor() {
    // Lazy initialized
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val && this.ambientGain) {
      this.stopAmbient();
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Marimba Success ping
  public playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      osc2.frequency.setValueAtTime(659.25, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.28); // C6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.12);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.48);
    } catch {
      // ignore
    }
  }

  // Level Up / Fanfare Sound
  public playLevelUp() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.2, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Streak Milestone
  public playStreakMilestone() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  public playTap() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  public playBell() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // ignore
    }
  }

  // Synthesized Ambient Sound Generator for Focus & Relaxation
  public startAmbient(type: 'rain' | 'binaural' | 'whitenoise', volume: number = 0.3) {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopAmbient();
    this.currentAmbientType = type;

    try {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'rain' || type === 'whitenoise') {
        // Generate Pink/Brownish noise using buffer
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.96 * b1 + white * 0.11;
          b2 = 0.86 * b2 + white * 0.25;
          output[i] = (b0 + b1 + b2) * 0.35;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        if (type === 'rain') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1100, ctx.currentTime);
        } else {
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(650, ctx.currentTime);
          filter.Q.setValueAtTime(1.0, ctx.currentTime);
        }

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        this.ambientSource = whiteNoise;
      } else if (type === 'binaural') {
        // 200Hz base tone with 10Hz alpha wave difference
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        oscLeft.type = 'sine';
        oscRight.type = 'sine';
        oscLeft.frequency.setValueAtTime(216, ctx.currentTime);
        oscRight.frequency.setValueAtTime(226, ctx.currentTime); // 10Hz alpha difference

        oscLeft.connect(masterGain);
        oscRight.connect(masterGain);
        oscLeft.start();
        oscRight.start();
        this.ambientSource = oscLeft;
      }
    } catch (e) {
      console.warn('Ambient audio error', e);
    }
  }

  public setAmbientVolume(val: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(val * 0.25, this.ctx.currentTime);
    }
  }

  public stopAmbient() {
    try {
      if (this.ambientSource) {
        (this.ambientSource as any).stop?.();
        this.ambientSource.disconnect();
        this.ambientSource = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
      this.currentAmbientType = null;
    } catch {
      // ignore
    }
  }

  public getCurrentAmbient(): string | null {
    return this.currentAmbientType;
  }

  // Text to Speech using Web Speech API
  public speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundFx = new SoundManager();
