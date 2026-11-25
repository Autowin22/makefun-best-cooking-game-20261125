export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.sizzleNodes = new Map(); // slotId -> { osc, gain, filter }
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      // AudioContext not supported or blocked
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted) {
      this.stopAllSizzles();
    }
  }

  playTone(freq, type, duration, startGain = 0.1, endGain = 0.001) {
    if (this.muted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(startGain, now);
      gain.gain.exponentialRampToValueAtTime(endGain, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  chop() {
    // Thock wood sound
    this.playTone(120, 'triangle', 0.08, 0.3, 0.01);
  }

  ding() {
    // Service bell ding
    if (this.muted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(1320, now); // E6
      osc2.frequency.setValueAtTime(2637, now); // E7

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {}
  }

  error() {
    // Error buzz
    this.playTone(150, 'sawtooth', 0.25, 0.15, 0.01);
  }

  tick() {
    // Urgent clock tick
    this.playTone(800, 'sine', 0.04, 0.05, 0.001);
  }

  servePop(combo) {
    const base = 440;
    const freq = base * Math.pow(1.05946, Math.min(combo, 12));
    this.playTone(freq, 'sine', 0.3, 0.2, 0.001);
  }

  updateSizzle(activeSlots) {
    if (this.muted || !this.ctx) {
      this.stopAllSizzles();
      return;
    }

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;

      // activeSlots is an array of slot IDs currently sizzling
      const activeSet = new Set(activeSlots);

      // Stop sizzles no longer active
      for (const [slotId, node] of this.sizzleNodes.entries()) {
        if (!activeSet.has(slotId)) {
          try {
            node.gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
            setTimeout(() => {
              try { node.source.stop(); } catch(e){}
            }, 100);
          } catch(e){}
          this.sizzleNodes.delete(slotId);
        }
      }

      // Start new sizzles
      for (const slotId of activeSet) {
        if (!this.sizzleNodes.has(slotId)) {
          const bufferSize = this.ctx.sampleRate * 2;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          noise.loop = true;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1000;
          filter.Q.value = 1.0;

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.08, now);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          noise.start(now);
          this.sizzleNodes.set(slotId, { source: noise, gain, filter });
        }
      }
    } catch(e) {}
  }

  stopAllSizzles() {
    for (const [slotId, node] of this.sizzleNodes.entries()) {
      try {
        node.source.stop();
      } catch(e){}
    }
    this.sizzleNodes.clear();
  }
}
