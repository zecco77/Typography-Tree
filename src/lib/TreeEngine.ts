export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Festival = 'none' | 'christmas' | 'thanksgiving' | 'diwali' | 'halloween' | 'valentine' | 'holi' | 'easter' | 'newyear';
export type FontStyle = 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'display' | 'handwriting' | 'rounded' | 'classic';

export interface TreeSettings {
  season: Season;
  festival: Festival;
  fontFamily: FontStyle;
  wind: number;
  inkColor: string;
}

interface BranchNode {
  id: string;
  word: string;
  length: number;
  targetLength: number;
  angle: number;
  depth: number;
  children: BranchNode[];
  baseSwayOffset: number;
}

interface FallingLeaf {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  angle: number;
  rotSpeed: number;
}

interface SkyChar {
  x: number; y: number; char: string; speed: number; size: number;
}

interface BrownTruck {
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  stopped: boolean;
  active: boolean;
}

export class TreeEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;
  root!: BranchNode;
  settings: TreeSettings;
  fallingLeaves: FallingLeaf[] = [];
  skyChars: SkyChar[] = [];
  time: number = 0;
  animationFrameId: number = 0;
  branchTips: {x: number, y: number, word: string}[] = [];
  truck: BrownTruck = {
    x: -200,
    y: 0,
    vx: 2,
    width: 120,
    height: 60,
    stopped: false,
    active: false
  };

  constructor(canvas: HTMLCanvasElement, settings: TreeSettings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.settings = settings;
    this.initSky();
    this.reset(false);
    this.resize();
    window.addEventListener('resize', this.resize);
    this.start();
  }

  initSky() {
    this.skyChars = [];
    for(let i=0; i<30; i++) {
      this.skyChars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        char: ['.', ',', '"', "'", '`', '°', '~', '-'][Math.floor(Math.random()*8)],
        speed: Math.random() * 0.3 + 0.1,
        size: Math.random() * 24 + 10
      });
    }
  }

  reset(empty: boolean = true) {
    this.root = this.createNode('heritage', 0, 0);
    this.root.length = this.root.targetLength;
    this.fallingLeaves = [];
    this.truck.active = false;

    if (!empty) {
      const initialWords = ['language', 'meaning', 'form', 'space', 'glyph', 'type', 'sign', 'symbol', 'root', 'stem', 'leaf'];
      initialWords.forEach(w => this.addWord(w));
      const fastGrow = (node: BranchNode) => {
        node.length = node.targetLength;
        node.children.forEach(fastGrow);
      };
      fastGrow(this.root);
    }
  }

  resize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createNode(word: string, depth: number, angle: number): BranchNode {
    const fontSize = Math.max(12, 48 - depth * 6);
    const targetLength = Math.max(40, word.length * fontSize * 0.55);
    return {
      id: Math.random().toString(36).substring(2, 9),
      word: word || 'glyph',
      length: 0,
      targetLength: targetLength,
      angle: angle,
      depth: depth,
      children: [],
      baseSwayOffset: Math.random() * Math.PI * 2
    };
  }

  addWord(word: string) {
    if (word.toLowerCase() === 'truck') {
      this.spawnTruck();
      return;
    }
    const queue = [this.root];
    while(queue.length > 0) {
      const node = queue.shift()!;
      const maxChildren = node.depth === 0 ? 3 : 2;
      if (node.children.length < maxChildren && node.depth < 8) {
        const spread = Math.PI / 2.2;
        let angle = 0;
        if (maxChildren === 3) {
           if (node.children.length === 0) angle = -spread/1.5;
           else if (node.children.length === 1) angle = spread/1.5;
           else angle = 0;
        } else {
           angle = node.children.length === 0 ? -spread/2 : spread/2;
        }
        angle += (Math.random() - 0.5) * 0.4;
        node.children.push(this.createNode(word, node.depth + 1, angle));
        return;
      }
      queue.push(...node.children);
    }
  }

  updateSettings(newSettings: TreeSettings) {
    this.settings = newSettings;
  }

  spawnTruck() {
    this.truck.active = true;
    this.truck.width = 120;
    this.truck.x = -this.truck.width;
    this.truck.y = this.height - 50;
    this.truck.vx = 3;
    this.truck.stopped = false;
  }

  start() {
    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      this.time += dt;
      this.update(dt);
      this.draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.resize);
  }

  update(dt: number) {
    const growNode = (node: BranchNode) => {
      if (node.length < node.targetLength) {
        node.length += dt * 0.08;
        if (node.length > node.targetLength) node.length = node.targetLength;
      }
      node.children.forEach(growNode);
    };
    growNode(this.root);

    for (let i = this.fallingLeaves.length - 1; i >= 0; i--) {
      const leaf = this.fallingLeaves[i];
      leaf.x += leaf.vx + (this.settings.wind * 0.08);
      leaf.y += leaf.vy;
      leaf.angle += leaf.rotSpeed;
      leaf.vy += 0.08;
      if (leaf.y > this.height + 50) {
        this.fallingLeaves.splice(i, 1);
      }
    }

    this.skyChars.forEach(c => {
      c.x -= c.speed + (this.settings.wind * 0.03);
      if (c.x < -50) {
        c.x = this.width + 50;
        c.y = Math.random() * this.height;
      }
    });

    if (this.truck.active) {
      if (!this.truck.stopped) {
        this.truck.x += this.truck.vx * (dt * 0.06);
        
        // Check if truck reached the tree (tree is at this.width / 2)
        if (this.truck.x + this.truck.width >= this.width / 2 - 20) {
          this.truck.x = this.width / 2 - 20 - this.truck.width;
          this.truck.stopped = true;
        }
      }
    }

    if ((this.settings.season === 'autumn' || this.settings.wind > 60) && Math.random() < 0.15) {
      if (this.branchTips.length > 0) {
        const tip = this.branchTips[Math.floor(Math.random() * this.branchTips.length)];
        this.spawnLeaf(tip.x, tip.y, tip.word);
      }
    }
  }

  spawnLeaf(x: number, y: number, word: string) {
    const chars = word.split('');
    const char = chars[Math.floor(Math.random() * chars.length)] || '*';
    const colors = this.getSeasonColors(this.settings.season, this.settings.festival);
    const color = colors[Math.floor(Math.random() * colors.length)];
    this.fallingLeaves.push({
      id: Math.random().toString(),
      x, y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 2 - 1,
      char, color,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2
    });
  }

  getSeasonColors(season: Season, festival: Festival = 'none'): string[] {
    if (festival !== 'none') {
      switch(festival) {
        case 'christmas': return ['#dc2626', '#16a34a', '#fbbf24', '#ffffff'];
        case 'thanksgiving': return ['#d97706', '#92400e', '#b45309', '#78350f'];
        case 'diwali': return ['#fbbf24', '#e11d48', '#ea580c', '#9333ea'];
        case 'halloween': return ['#ea580c', '#111827', '#9333ea', '#84cc16'];
        case 'valentine': return ['#f43f5e', '#fb7185', '#fda4af', '#e11d48'];
        case 'holi': return ['#d946ef', '#06b6d4', '#eab308', '#22c55e'];
        case 'easter': return ['#fbcfe8', '#bfdbfe', '#fef08a', '#bbf7d0'];
        case 'newyear': return ['#fbbf24', '#94a3b8', '#1e293b', '#f8fafc'];
      }
    }
    switch(season) {
      case 'spring': return ['#a3e635', '#bef264', '#84cc16'];
      case 'summer': return ['#22c55e', '#16a34a', '#15803d'];
      case 'autumn': return ['#f97316', '#ef4444', '#eab308', '#b45309'];
      case 'winter': return ['#e2e8f0', '#cbd5e1', '#94a3b8'];
    }
  }

  getBranchColor(season: Season, depth: number, festival: Festival = 'none'): string {
    const d = Math.min(depth, 8);
    if (festival !== 'none') {
      switch(festival) {
        case 'christmas': return ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7'][d];
        case 'thanksgiving': return ['#451a03', '#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'][d];
        case 'diwali': return ['#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'][d];
        case 'halloween': return ['#000000', '#111827', '#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'][d];
        case 'valentine': return ['#881337', '#9f1239', '#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#ffe4e6'][d];
        case 'holi': return ['#701a75', '#86198f', '#a21caf', '#c026d3', '#d946ef', '#e879f9', '#f0abfc', '#f5d0fe', '#fae8ff'][d];
        case 'easter': return ['#064e3b', '#065f46', '#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'][d];
        case 'newyear': return ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9'][d];
      }
    }
    switch(season) {
      case 'spring':
        return ['#4a3b32', '#52482f', '#5a552c', '#626229', '#6a6f26', '#727c23', '#7a8920', '#82961d', '#8aa31a'][d];
      case 'summer':
        return ['#36251b', '#32311e', '#2e3d21', '#2a4924', '#265527', '#22612a', '#1e6d2d', '#1a7930', '#168533'][d];
      case 'autumn':
        return ['#3d281f', '#4f2b1c', '#612e19', '#733116', '#853413', '#973710', '#a93a0d', '#bb3d0a', '#cd4007'][d];
      case 'winter':
        return ['#1c1917', '#2a2827', '#383737', '#464647', '#545557', '#626467', '#707377', '#7e8287', '#8c9197'][d];
      default:
        return '#1a1a1a';
    }
  }

  getFontFamily(): string {
    switch(this.settings.fontFamily) {
      case 'serif': return '"Playfair Display", serif';
      case 'sans-serif': return '"Inter", sans-serif';
      case 'monospace': return '"JetBrains Mono", monospace';
      case 'cursive': return '"Dancing Script", cursive';
      case 'display': return '"Oswald", sans-serif';
      case 'handwriting': return '"Caveat", cursive';
      case 'rounded': return '"Fredoka", sans-serif';
      case 'classic': return '"Cinzel", serif';
      default: return 'serif';
    }
  }

  drawGround() {
    this.ctx.save();
    
    const colors = this.getSeasonColors(this.settings.season, this.settings.festival);
    
    // Distant hills
    this.ctx.fillStyle = colors[0] + '40';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height - 50);
    this.ctx.quadraticCurveTo(this.width * 0.2, this.height - 150, this.width * 0.6, this.height - 50);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(this.width * 0.4, this.height - 50);
    this.ctx.quadraticCurveTo(this.width * 0.8, this.height - 120, this.width, this.height - 50);
    this.ctx.fill();

    // Main ground
    this.ctx.fillStyle = colors[colors.length - 1] + '40';
    this.ctx.fillRect(0, this.height - 50, this.width, 50);

    // Ground baseline
    this.ctx.strokeStyle = this.getBranchColor(this.settings.season, 0, this.settings.festival);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height - 50);
    this.ctx.lineTo(this.width, this.height - 50);
    this.ctx.stroke();

    this.ctx.restore();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = this.getBranchColor(this.settings.season, 8, this.settings.festival) + '40';
    this.skyChars.forEach(c => {
      this.ctx.font = `${c.size}px ${this.getFontFamily()}`;
      this.ctx.fillText(c.char, c.x, c.y);
    });

    this.drawGround();

    this.ctx.fillStyle = this.getBranchColor(this.settings.season, 0, this.settings.festival);
    this.ctx.font = `14px ${this.getFontFamily()}`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText("the ground the tree grows from • a baseline of sentences • roots reaching deep into the earth", this.width / 2, this.height - 20);

    this.branchTips = [];

    if (this.truck.active) {
      this.ctx.save();
      this.ctx.translate(this.truck.x, this.height - 50);
      
      // Draw brown truck
      this.ctx.fillStyle = '#8B4513'; // SaddleBrown
      // Body
      this.ctx.fillRect(0, -50, this.truck.width - 30, 40);
      // Cab
      this.ctx.fillRect(this.truck.width - 30, -35, 30, 25);
      
      // Wheels
      this.ctx.fillStyle = '#111';
      this.ctx.beginPath();
      this.ctx.arc(20, -10, 10, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.beginPath();
      this.ctx.arc(this.truck.width - 15, -10, 10, 0, Math.PI * 2);
      this.ctx.fill();

      // Window
      this.ctx.fillStyle = '#87CEEB';
      this.ctx.fillRect(this.truck.width - 20, -30, 10, 10);

      // "Recognize tree" text if stopped
      if (this.truck.stopped) {
        this.ctx.fillStyle = this.getBranchColor(this.settings.season, 0, this.settings.festival);
        this.ctx.font = `bold 16px ${this.getFontFamily()}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText("Whoa, a tree!", this.truck.width / 2, -65);
      }

      this.ctx.restore();
    }

    this.ctx.save();
    this.ctx.translate(this.width / 2, this.height - 50);
    this.ctx.rotate(-Math.PI / 2);
    this.drawNode(this.root);
    this.ctx.restore();

    this.fallingLeaves.forEach(leaf => {
      this.ctx.save();
      this.ctx.translate(leaf.x, leaf.y);
      this.ctx.rotate(leaf.angle);
      this.ctx.fillStyle = leaf.color;
      this.ctx.font = `18px ${this.getFontFamily()}`;
      this.ctx.fillText(leaf.char, 0, 0);
      this.ctx.restore();
    });
  }

  drawNode(node: BranchNode) {
    const windFactor = this.settings.wind / 100;
    const sway = Math.sin(this.time * 0.0015 + node.baseSwayOffset) * 0.15 * windFactor * (node.depth + 1);
    
    this.ctx.save();
    this.ctx.rotate(node.angle + sway);

    const fontSize = Math.max(12, 48 - node.depth * 6);
    const isItalic = this.settings.wind > 50 ? 'italic ' : '';
    const fontWeight = node.depth === 0 ? 'bold ' : '';
    this.ctx.font = `${isItalic}${fontWeight}${fontSize}px ${this.getFontFamily()}`;
    this.ctx.fillStyle = this.getBranchColor(this.settings.season, node.depth, this.settings.festival);
    this.ctx.textBaseline = 'middle';

    const word = node.word;
    const charSpacing = node.targetLength / Math.max(1, word.length);

    for (let i = 0; i < word.length; i++) {
      if (i * charSpacing <= node.length) {
        this.ctx.fillText(word[i], i * charSpacing, 0);
      }
    }

    this.ctx.translate(node.length, 0);

    if (node.children.length === 0) {
      const transform = this.ctx.getTransform();
      this.branchTips.push({
        x: transform.e,
        y: transform.f,
        word: node.word
      });
    }

    if (this.settings.season !== 'winter' && node.length > 10 && node.depth > 0) {
      this.drawStaticLeaves(node);
    }

    if (node.children.length > 0) {
      node.children.forEach(child => this.drawNode(child));
    }

    this.ctx.restore();
  }

  drawStaticLeaves(node: BranchNode) {
    const colors = this.getSeasonColors(this.settings.season, this.settings.festival);
    let multiplier = this.settings.season === 'summer' ? 1.5 : (this.settings.season === 'spring' ? 1.0 : 0.8);
    if (node.children.length === 0) multiplier *= 2; // More leaves at the tips
    
    const numLeaves = Math.floor((node.length / 15) * multiplier);
    
    let seed = node.id.charCodeAt(0) + node.id.charCodeAt(1);
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < numLeaves; i++) {
      this.ctx.save();
      const lx = -random() * node.length;
      const spread = 20 + (node.depth * 2);
      const ly = (random() - 0.5) * spread;
      const angle = random() * Math.PI * 2;
      
      this.ctx.translate(lx, ly);
      this.ctx.rotate(angle);
      
      this.ctx.fillStyle = colors[Math.floor(random() * colors.length)];
      const leafSize = Math.max(10, 20 - node.depth);
      this.ctx.font = `${leafSize}px ${this.getFontFamily()}`;
      
      const char = node.word[Math.floor(random() * node.word.length)] || '*';
      this.ctx.fillText(char, 0, 0);
      
      this.ctx.restore();
    }
  }
}
