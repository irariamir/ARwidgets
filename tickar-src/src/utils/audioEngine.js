/**
 * Procedural Web Audio Engine for TickAR & ARIAMIR
 * High-fidelity real-time soundscapes, binaural tones, and interactive sound effects
 */

class SoundscapesEngine {
  constructor() {
    this.ctx = null;
    this.activeNodes = {};
    this.masterGain = null;
    this.currentMusicType = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
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

  // Rain Sound
  startRain(volume = 0.5) {
    this.init();
    this.stop('rain');

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

  // Ocean Waves
  startOcean(volume = 0.5) {
    this.init();
    this.stop('ocean');

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(6);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
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

  // Forest & Birds
  startForest(volume = 0.5) {
    this.init();
    this.stop('forest');

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

  // Lo-Fi Electric Piano Chords ("ملایم")
  startLofi(volume = 0.5) {
    this.init();
    this.stop('lofi');

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

  // Positive Thinking Ambient ("مثبت اندیشی")
  startPositive(volume = 0.5) {
    this.init();
    this.stop('positive');

    const chords = [
      [293.66, 369.99, 440.00, 587.33], // D maj
      [329.63, 415.30, 493.88, 659.25], // E maj
      [369.99, 440.00, 554.37, 739.99], // F# min
      [392.00, 493.88, 587.33, 783.99]  // G maj
    ];
    let step = 0;

    const playNextPositive = () => {
      if (!this.activeNodes['positive']) return;
      const currentChord = chords[step % chords.length];
      step++;

      currentChord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime((volume * 0.15) / currentChord.length, now + 0.8 + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 4.8);
      });
    };

    playNextPositive();
    const interval = setInterval(playNextPositive, 4500);
    this.activeNodes['positive'] = { interval };
  }

  // Eastern Flute Ambient ("فلوت شرقی")
  startFlute(volume = 0.5) {
    this.init();
    this.stop('flute');

    // Drone note (D3)
    const droneOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneOsc.type = 'sawtooth';
    droneOsc.frequency.setValueAtTime(146.83, this.ctx.currentTime);

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(280, this.ctx.currentTime);

    droneGain.gain.setValueAtTime(volume * 0.12, this.ctx.currentTime);
    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start();

    // Flute melody notes (D minor pentatonic / Bayati scale)
    const notes = [293.66, 329.63, 349.23, 440.00, 523.25, 587.33, 659.25];
    const fluteInterval = setInterval(() => {
      if (!this.activeNodes['flute']) return;
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * 0.18, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.0);
    }, 2400);

    this.activeNodes['flute'] = { source: droneOsc, gain: droneGain, interval: fluteInterval };
  }

  // Mind Peace / Theta Binaural Wave ("آرامش ذهن")
  startPeace(volume = 0.5) {
    this.init();
    this.stop('peace');

    // Base carrier: 200 Hz, Beat: 6 Hz (Theta wave for deep focus)
    const leftOsc = this.ctx.createOscillator();
    const rightOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(216, this.ctx.currentTime);
    rightOsc.frequency.setValueAtTime(222, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume * 0.16, this.ctx.currentTime);

    leftOsc.connect(gain);
    rightOsc.connect(gain);
    gain.connect(this.masterGain);

    leftOsc.start();
    rightOsc.start();

    this.activeNodes['peace'] = { sources: [leftOsc, rightOsc], gain };
  }

  // Play Pomodoro Music Mode by ID
  playPomodoroMusic(musicId, volume = 0.5) {
    this.stopAll();
    this.currentMusicType = musicId;

    if (!musicId || musicId === 'none') return;

    if (musicId === 'gentle' || musicId === 'lofi') {
      this.startLofi(volume);
    } else if (musicId === 'positive') {
      this.startPositive(volume);
    } else if (musicId === 'flute') {
      this.startFlute(volume);
    } else if (musicId === 'peace') {
      this.startPeace(volume);
    } else if (musicId === 'waves' || musicId === 'sea') {
      this.startOcean(volume);
    } else if (musicId === 'rain') {
      this.startRain(volume);
    } else if (musicId === 'forest') {
      this.startForest(volume);
    }
  }

  // Stop specific ambient
  stop(type) {
    if (this.activeNodes[type]) {
      if (this.activeNodes[type].source) {
        try { this.activeNodes[type].source.stop(); } catch(e){}
      }
      if (this.activeNodes[type].sources) {
        this.activeNodes[type].sources.forEach(s => {
          try { s.stop(); } catch(e){}
        });
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
    this.currentMusicType = null;
  }

  // Sound Effects: Task Complete Ding
  playTaskComplete() {
    this.init();
    const now = this.ctx.currentTime;
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
