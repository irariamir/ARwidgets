/**
 * Procedural Web Audio Engine for TickAR & ARIAMIR
 * High-fidelity real-time soundscapes and interactive sound effects
 */

class SoundscapesEngine {
  constructor() {
    this.ctx = null;
    this.activeNodes = {};
    this.masterGain = null;
    this.lofiInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create White/Pink Noise Buffer
  createPinkNoiseBuffer(duration = 5) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // Ambient: Rain
  startRain(volume = 0.5) {
    this.init();
    if (this.activeNodes['rain']) this.stop('rain');

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(6);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.6, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    this.activeNodes['rain'] = { source: noise, gain: gain };
  }

  // Ambient: Ocean Waves
  startOcean(volume = 0.5) {
    this.init();
    if (this.activeNodes['ocean']) this.stop('ocean');

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(6);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    // LFO for wave movement
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Wave period ~8s
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(volume * 0.5, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes['ocean'] = { source: noise, lfo: lfo, gain: gain };
  }

  // Ambient: Forest & Birds
  startForest(volume = 0.5) {
    this.init();
    if (this.activeNodes['forest']) this.stop('forest');

    // Wind/leaves
    const wind = this.ctx.createBufferSource();
    wind.buffer = this.createPinkNoiseBuffer(6);
    wind.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(volume * 0.3, this.ctx.currentTime);

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    wind.start();

    // Procedural bird chirps interval
    const birdInterval = setInterval(() => {
      if (!this.activeNodes['forest']) return;
      if (Math.random() > 0.4) {
        this.playBirdChirp(volume * 0.35);
      }
    }, 2800);

    this.activeNodes['forest'] = { source: wind, gain: windGain, interval: birdInterval };
  }

  playBirdChirp(vol = 0.2) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const startFreq = 2200 + Math.random() * 800;
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 600, this.ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(startFreq - 200, this.ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  // Ambient: Campfire / Fireplace
  startFire(volume = 0.5) {
    this.init();
    if (this.activeNodes['fire']) this.stop('fire');

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(5);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.45, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    // Random crackle clicks
    const crackleInterval = setInterval(() => {
      if (!this.activeNodes['fire']) return;
      if (Math.random() > 0.3) {
        this.playCrackle(volume * 0.4);
      }
    }, 350);

    this.activeNodes['fire'] = { source: noise, gain: gain, interval: crackleInterval };
  }

  playCrackle(vol = 0.2) {
    if (!this.ctx) return;
    const click = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(600 + Math.random() * 1200, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol * (0.3 + Math.random() * 0.7), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
    click.connect(gain);
    gain.connect(this.masterGain);
    click.start();
    click.stop(this.ctx.currentTime + 0.05);
  }

  // Ambient: Coffee Shop / Cafe Ambiance
  startCafe(volume = 0.5) {
    this.init();
    if (this.activeNodes['cafe']) this.stop('cafe');

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(6);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.5, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    this.activeNodes['cafe'] = { source: noise, gain: gain };
  }

  // Ambient: Lo-Fi Chords (Synthesized Electric Piano Chords)
  startLofi(volume = 0.5) {
    this.init();
    if (this.activeNodes['lofi']) this.stop('lofi');

    // Chords progression: Cmaj9, Am9, Dm9, G13
    const chords = [
      [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
      [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
      [146.83, 220.00, 261.63, 349.23, 440.00], // Dm9
      [196.00, 246.94, 293.66, 349.23, 440.00]  // G9/13
    ];
    let step = 0;

    const playNextChord = () => {
      if (!this.activeNodes['lofi']) return;
      const currentChord = chords[step % chords.length];
      step++;

      currentChord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() * 1.5 - 0.75), this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + idx * 80, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime((volume * 0.18) / currentChord.length, now + 0.2 + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.04);
        osc.stop(now + 4.0);
      });
    };

    playNextChord();
    const chordInterval = setInterval(playNextChord, 4000);
    this.activeNodes['lofi'] = { interval: chordInterval, isPlaying: true };
  }

  // Set individual volume
  setVolume(type, volume) {
    if (this.activeNodes[type] && this.activeNodes[type].gain) {
      this.activeNodes[type].gain.gain.setValueAtTime(volume * 0.6, this.ctx.currentTime);
    }
  }

  // Stop specific ambient
  stop(type) {
    if (this.activeNodes[type]) {
      if (this.activeNodes[type].source) {
        try { this.activeNodes[type].source.stop(); } catch(e){}
      }
      if (this.activeNodes[type].lfo) {
        try { this.activeNodes[type].lfo.stop(); } catch(e){}
      }
      if (this.activeNodes[type].interval) {
        clearInterval(this.activeNodes[type].interval);
      }
      delete this.activeNodes[type];
    }
  }

  // Stop all ambient
  stopAll() {
    Object.keys(this.activeNodes).forEach((k) => this.stop(k));
  }

  // Sound Effects: Task Complete Ding
  playTaskComplete() {
    this.init();
    const now = this.ctx.currentTime;
    
    // Two-tone bell (E5 -> B5)
    [659.25, 987.77].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.7);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.75);
    });
  }

  // Sound Effect: Pomodoro Session Finished (Deep Tibetan Singing Gong)
  playPomodoroFinished() {
    this.init();
    const now = this.ctx.currentTime;
    const baseFreqs = [220, 440, 660, 880];
    
    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 3.6);
    });
  }

  // Sound Effect: Subtle click/toggle
  playClick() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Sound Effect: Streak Flame Spark
  playStreakSpark() {
    this.init();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.45);
    });
  }
}

export const audioEngine = new SoundscapesEngine();
