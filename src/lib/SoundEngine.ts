export class SoundEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  delayNode: DelayNode | null = null;
  feedbackGain: GainNode | null = null;
  filterNode: BiquadFilterNode | null = null;
  season: 'spring' | 'summer' | 'autumn' | 'winter' = 'spring';
  isPlaying = false;
  timeoutIds: number[] = [];
  currentChordIndex = 0;

  // Convert MIDI note to frequency
  m2f(midi: number) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    
    // Soft overall volume
    this.masterGain.gain.value = 0.6;

    // Create a lush delay/reverb effect for the "soft instrumental" feel
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.value = 0.75; // 750ms delay

    this.feedbackGain = this.ctx.createGain();
    this.feedbackGain.gain.value = 0.4; // 40% feedback (echo tail)

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 1200; // Muffle the echoes for warmth

    // Routing: master -> destination
    this.masterGain.connect(this.ctx.destination);

    // Routing: delay loop
    this.delayNode.connect(this.feedbackGain);
    this.feedbackGain.connect(this.filterNode);
    this.filterNode.connect(this.delayNode);
    this.delayNode.connect(this.masterGain);
  }

  play(season: 'spring' | 'summer' | 'autumn' | 'winter') {
    this.season = season;
    if (!this.isPlaying) return;
    
    // Clear existing scheduled notes
    this.stopNodes();
    
    if (!this.ctx) this.init();
    if (this.ctx?.state === 'suspended') this.ctx.resume();
    
    // Start the generative music loop
    this.currentChordIndex = 0;
    this.scheduleChord();
    this.scheduleMelody();
  }

  toggle() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.init();
      this.play(this.season);
    } else {
      this.stopNodes();
    }
    return this.isPlaying;
  }

  stopNodes() {
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];
  }

  playInstrumentalNote(freq: number, now: number, duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    
    // Season specific instrument design
    if (this.season === 'spring') {
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now); // Octave up for brightness
    } else if (this.season === 'summer') {
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 0.5, now); // Sub octave for warmth
    } else if (this.season === 'autumn') {
      osc1.type = 'triangle';
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, now); // Perfect fifth for woody tone
    } else { // winter
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 4, now); // Two octaves up for icy sparkle
    }

    osc1.frequency.setValueAtTime(freq, now);

    const gainNode = this.ctx.createGain();
    
    // Mix the two oscillators
    const osc1Gain = this.ctx.createGain();
    osc1Gain.gain.value = this.season === 'winter' ? 0.5 : 0.7;
    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.value = this.season === 'winter' ? 0.5 : 0.3;

    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    
    osc1Gain.connect(gainNode);
    osc2Gain.connect(gainNode);
    
    gainNode.connect(this.masterGain);
    if (this.delayNode) gainNode.connect(this.delayNode);

    // Season specific envelopes
    gainNode.gain.setValueAtTime(0, now);
    
    if (this.season === 'spring') {
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    } else if (this.season === 'summer') {
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.2); // Slower attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5); // Longer decay
    } else if (this.season === 'autumn') {
      gainNode.gain.linearRampToValueAtTime(volume * 1.2, now + 0.02); // Plucky attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8); // Shorter decay
    } else { // winter
      gainNode.gain.linearRampToValueAtTime(volume * 0.8, now + 0.5); // Very slow attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration * 2); // Very long decay
    }

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration * 2);
    osc2.stop(now + duration * 2);
  }

  playPadChord(chord: number[], now: number, duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;

    chord.forEach(midi => {
      const freq = this.m2f(midi - 12); // Drop an octave for the pad
      const osc = this.ctx.createOscillator();
      
      if (this.season === 'spring') osc.type = 'sine';
      else if (this.season === 'summer') osc.type = 'triangle';
      else if (this.season === 'autumn') osc.type = 'triangle';
      else osc.type = 'sine'; // winter

      osc.frequency.setValueAtTime(freq, now);

      const gainNode = this.ctx.createGain();
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      
      if (this.season === 'spring') filter.frequency.value = 1000;
      else if (this.season === 'summer') filter.frequency.value = 600; // Warmer, muffled
      else if (this.season === 'autumn') filter.frequency.value = 800;
      else filter.frequency.value = 400; // Very muffled, deep winter pad

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);
      if (this.delayNode) gainNode.connect(this.delayNode);

      // Pad envelope (slow attack, slow release)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + duration * 0.4);
      gainNode.gain.setValueAtTime(volume, now + duration * 0.6);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  scheduleChord() {
    if (!this.isPlaying || !this.ctx) return;

    const progressions = {
      spring: [
        [60, 64, 67], // C
        [65, 69, 72], // F
        [69, 72, 76], // Am
        [67, 71, 74], // G
      ],
      summer: [
        [65, 69, 72], // F
        [70, 74, 77], // Bb
        [62, 65, 69], // Dm
        [60, 64, 67], // C
      ],
      autumn: [
        [69, 72, 76], // Am
        [62, 65, 69], // Dm
        [67, 71, 74], // G
        [60, 64, 67], // C
      ],
      winter: [
        [62, 65, 69], // Dm
        [70, 74, 77], // Bb
        [65, 69, 72], // F
        [69, 73, 76], // A
      ]
    };

    const prog = progressions[this.season];
    const chord = prog[this.currentChordIndex % prog.length];
    this.currentChordIndex++;

    const now = this.ctx.currentTime;
    const duration = 4.0; // 4 seconds per chord
    
    // Play the pad chord
    this.playPadChord(chord, now, duration, 0.08);

    const id = window.setTimeout(() => this.scheduleChord(), duration * 1000);
    this.timeoutIds.push(id);
  }

  scheduleMelody() {
    if (!this.isPlaying || !this.ctx) return;

    const scales = {
      spring: [60, 62, 64, 67, 69, 72, 74, 76], // C Major Pentatonic
      summer: [65, 67, 69, 72, 74, 77, 79, 81], // F Major Pentatonic
      autumn: [57, 60, 62, 64, 67, 69, 72, 74], // A Minor Pentatonic
      winter: [62, 65, 67, 69, 72, 74, 77, 79]  // D Minor Pentatonic
    };

    const scale = scales[this.season];
    const note = scale[Math.floor(Math.random() * scale.length)];
    const freq = this.m2f(note);

    const now = this.ctx.currentTime;
    const duration = 2.5;
    
    // Play the melody note
    this.playInstrumentalNote(freq, now, duration, 0.15);

    // Schedule next note
    let baseDelay = 400;
    let randomDelay = 600;
    
    if (this.season === 'spring') {
      baseDelay = 300; randomDelay = 400; // Playful, faster
    } else if (this.season === 'summer') {
      baseDelay = 600; randomDelay = 800; // Lazy, slow
    } else if (this.season === 'autumn') {
      baseDelay = 400; randomDelay = 500; // Steady
    } else { // winter
      baseDelay = 1000; randomDelay = 1500; // Sparse, very slow
    }

    const nextTime = baseDelay + Math.random() * randomDelay;

    const id = window.setTimeout(() => this.scheduleMelody(), nextTime);
    this.timeoutIds.push(id);
  }
}
