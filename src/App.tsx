import React, { useEffect, useRef, useState } from 'react';
import { TreeEngine, TreeSettings, Season, FontStyle, Festival } from './lib/TreeEngine';
import { SoundEngine } from './lib/SoundEngine';
import { Settings2, Wind, Leaf, Type, Palette, Trash2, Truck as TruckIcon, Mic, Volume2, VolumeX, Download, Sparkles, Award, X } from 'lucide-react';

const themes = {
  spring: {
    bg: 'bg-[#f7fcf0]',
    panel: 'bg-white/60 border-[#bef264]/40',
    input: 'bg-white/80 border-[#bef264]/50 focus:ring-[#84cc16]/30',
    button: 'bg-[#4d7c0f] hover:bg-[#3f6212] text-white',
    text: 'text-[#3f6212]',
    textMuted: 'text-[#3f6212]/60 hover:text-[#3f6212]',
    iconBg: 'bg-[#4d7c0f]',
    activeTab: 'bg-[#4d7c0f] text-white',
    accent: 'accent-[#4d7c0f]'
  },
  summer: {
    bg: 'bg-[#f0fdf4]',
    panel: 'bg-white/60 border-[#86efac]/40',
    input: 'bg-white/80 border-[#86efac]/50 focus:ring-[#22c55e]/30',
    button: 'bg-[#166534] hover:bg-[#14532d] text-white',
    text: 'text-[#14532d]',
    textMuted: 'text-[#14532d]/60 hover:text-[#14532d]',
    iconBg: 'bg-[#166534]',
    activeTab: 'bg-[#166534] text-white',
    accent: 'accent-[#166534]'
  },
  autumn: {
    bg: 'bg-[#fff7ed]',
    panel: 'bg-white/60 border-[#fdba74]/40',
    input: 'bg-white/80 border-[#fdba74]/50 focus:ring-[#f97316]/30',
    button: 'bg-[#9a3412] hover:bg-[#7c2d12] text-white',
    text: 'text-[#7c2d12]',
    textMuted: 'text-[#7c2d12]/60 hover:text-[#7c2d12]',
    iconBg: 'bg-[#9a3412]',
    activeTab: 'bg-[#9a3412] text-white',
    accent: 'accent-[#9a3412]'
  },
  winter: {
    bg: 'bg-[#f8fafc]',
    panel: 'bg-white/60 border-[#cbd5e1]/40',
    input: 'bg-white/80 border-[#cbd5e1]/50 focus:ring-[#64748b]/30',
    button: 'bg-[#1e293b] hover:bg-[#0f172a] text-white',
    text: 'text-[#0f172a]',
    textMuted: 'text-[#0f172a]/60 hover:text-[#0f172a]',
    iconBg: 'bg-[#1e293b]',
    activeTab: 'bg-[#1e293b] text-white',
    accent: 'accent-[#1e293b]'
  },
  christmas: {
    bg: 'bg-[#fef2f2]',
    panel: 'bg-white/60 border-red-200/40',
    input: 'bg-white/80 border-red-200/50 focus:ring-red-400/30',
    button: 'bg-red-700 hover:bg-red-800 text-white',
    text: 'text-red-900',
    textMuted: 'text-red-900/60 hover:text-red-900',
    iconBg: 'bg-red-700',
    activeTab: 'bg-red-700 text-white',
    accent: 'accent-red-700'
  },
  thanksgiving: {
    bg: 'bg-[#fffbeb]',
    panel: 'bg-white/60 border-amber-200/40',
    input: 'bg-white/80 border-amber-200/50 focus:ring-amber-400/30',
    button: 'bg-amber-700 hover:bg-amber-800 text-white',
    text: 'text-amber-900',
    textMuted: 'text-amber-900/60 hover:text-amber-900',
    iconBg: 'bg-amber-700',
    activeTab: 'bg-amber-700 text-white',
    accent: 'accent-amber-700'
  },
  diwali: {
    bg: 'bg-[#fdf4ff]',
    panel: 'bg-white/60 border-fuchsia-200/40',
    input: 'bg-white/80 border-fuchsia-200/50 focus:ring-fuchsia-400/30',
    button: 'bg-fuchsia-700 hover:bg-fuchsia-800 text-white',
    text: 'text-fuchsia-900',
    textMuted: 'text-fuchsia-900/60 hover:text-fuchsia-900',
    iconBg: 'bg-fuchsia-700',
    activeTab: 'bg-fuchsia-700 text-white',
    accent: 'accent-fuchsia-700'
  },
  halloween: {
    bg: 'bg-[#f9fafb]',
    panel: 'bg-white/60 border-gray-200/40',
    input: 'bg-white/80 border-gray-200/50 focus:ring-gray-400/30',
    button: 'bg-gray-800 hover:bg-gray-900 text-white',
    text: 'text-gray-900',
    textMuted: 'text-gray-900/60 hover:text-gray-900',
    iconBg: 'bg-gray-800',
    activeTab: 'bg-gray-800 text-white',
    accent: 'accent-gray-800'
  },
  valentine: {
    bg: 'bg-[#fff1f2]',
    panel: 'bg-white/60 border-rose-200/40',
    input: 'bg-white/80 border-rose-200/50 focus:ring-rose-400/30',
    button: 'bg-rose-600 hover:bg-rose-700 text-white',
    text: 'text-rose-900',
    textMuted: 'text-rose-900/60 hover:text-rose-900',
    iconBg: 'bg-rose-600',
    activeTab: 'bg-rose-600 text-white',
    accent: 'accent-rose-600'
  },
  holi: {
    bg: 'bg-[#faf5ff]',
    panel: 'bg-white/60 border-purple-200/40',
    input: 'bg-white/80 border-purple-200/50 focus:ring-purple-400/30',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
    text: 'text-purple-900',
    textMuted: 'text-purple-900/60 hover:text-purple-900',
    iconBg: 'bg-purple-600',
    activeTab: 'bg-purple-600 text-white',
    accent: 'accent-purple-600'
  },
  easter: {
    bg: 'bg-[#f0fdfa]',
    panel: 'bg-white/60 border-teal-200/40',
    input: 'bg-white/80 border-teal-200/50 focus:ring-teal-400/30',
    button: 'bg-teal-600 hover:bg-teal-700 text-white',
    text: 'text-teal-900',
    textMuted: 'text-teal-900/60 hover:text-teal-900',
    iconBg: 'bg-teal-600',
    activeTab: 'bg-teal-600 text-white',
    accent: 'accent-teal-600'
  },
  newyear: {
    bg: 'bg-[#f1f5f9]',
    panel: 'bg-white/60 border-slate-200/40',
    input: 'bg-white/80 border-slate-200/50 focus:ring-slate-400/30',
    button: 'bg-slate-700 hover:bg-slate-800 text-white',
    text: 'text-slate-900',
    textMuted: 'text-slate-900/60 hover:text-slate-900',
    iconBg: 'bg-slate-700',
    activeTab: 'bg-slate-700 text-white',
    accent: 'accent-slate-700'
  }
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TreeEngine | null>(null);
  const [wordInput, setWordInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const soundEngineRef = useRef<SoundEngine | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certName, setCertName] = useState('');
  const [treesPlanted, setTreesPlanted] = useState(2);
  
  const [settings, setSettings] = useState<TreeSettings>({
    season: 'summer',
    festival: 'none',
    fontFamily: 'serif',
    wind: 20,
    inkColor: '#1a1a1a'
  });

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new TreeEngine(canvasRef.current, settings);
    }
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateSettings(settings);
    }

    if (soundEngineRef.current) {
      soundEngineRef.current.play(settings.season);
    }
  }, [settings]);

  useEffect(() => {
    soundEngineRef.current = new SoundEngine();

    const handleFirstInteraction = () => {
      if (!isPlaying && soundEngineRef.current) {
        soundEngineRef.current.init();
        soundEngineRef.current.isPlaying = true;
        soundEngineRef.current.play(settings.season);
        setIsPlaying(true);
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      if (soundEngineRef.current) {
        soundEngineRef.current.stopNodes();
      }
    };
  }, []);

  const handleGrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordInput.trim() && engineRef.current) {
      const words = wordInput.trim().split(/\s+/);
      words.forEach(w => engineRef.current?.addWord(w));
      setWordInput('');
    }
  };

  const handleReset = () => {
    if (engineRef.current) {
      engineRef.current.reset(true);
    }
  };

  const toggleAudio = () => {
    if (soundEngineRef.current) {
      const playing = soundEngineRef.current.toggle();
      setIsPlaying(playing);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setWordInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const exportImage = (format: 'png' | 'jpeg') => {
    if (!engineRef.current || !canvasRef.current) return;
    
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    
    const targetWidth = 3840; // Always Large resolution (4K)
    
    const aspect = window.innerHeight / window.innerWidth;
    const targetHeight = targetWidth * aspect;
    const scale = targetWidth / window.innerWidth;
    
    const origWidth = canvas.width;
    const origHeight = canvas.height;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    engine.ctx.setTransform(1, 0, 0, 1, 0, 0);
    engine.ctx.scale(scale, scale);
    
    engine.draw();
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      const themeColors: Record<string, string> = {
        spring: '#f7fcf0',
        summer: '#f0fdf4',
        autumn: '#fff7ed',
        winter: '#f8fafc',
        christmas: '#fef2f2',
        thanksgiving: '#fffbeb',
        diwali: '#fdf4ff',
        halloween: '#f9fafb',
        valentine: '#fff1f2',
        holi: '#faf5ff',
        easter: '#f0fdfa',
        newyear: '#f1f5f9'
      };
      const themeKey = settings.festival !== 'none' ? settings.festival : settings.season;
      tempCtx.fillStyle = themeColors[themeKey] || '#ffffff';
      tempCtx.fillRect(0, 0, targetWidth, targetHeight);
      tempCtx.drawImage(canvas, 0, 0);
      
      const dataUrl = tempCanvas.toDataURL(`image/${format}`, 0.9);
      const link = document.createElement('a');
      link.download = `typography-tree-${settings.season}-large.${format === 'jpeg' ? 'jpg' : 'png'}`;
      link.href = dataUrl;
      link.click();
    }
    
    canvas.width = origWidth;
    canvas.height = origHeight;
    engine.ctx.setTransform(1, 0, 0, 1, 0, 0);
    engine.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    engine.draw();
    
    setIsExportMenuOpen(false);
  };

  const downloadCertificate = () => {
    if (!certName.trim() || !engineRef.current || !canvasRef.current) return;

    const engine = engineRef.current;
    const treeCanvas = canvasRef.current;

    const canvas = document.createElement('canvas');
    // 4K Resolution
    canvas.width = 3840;
    canvas.height = 2160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const themeKey = settings.festival !== 'none' ? settings.festival : settings.season;
    
    const bgColors: Record<string, string> = {
      spring: '#f7fcf0', summer: '#f0fdf4', autumn: '#fff7ed', winter: '#f8fafc',
      christmas: '#fef2f2', thanksgiving: '#fffbeb', diwali: '#fdf4ff', halloween: '#f9fafb',
      valentine: '#fff1f2', holi: '#faf5ff', easter: '#f0fdfa', newyear: '#f1f5f9'
    };
    
    const textColors: Record<string, string> = {
      spring: '#3f6212', summer: '#14532d', autumn: '#7c2d12', winter: '#0f172a',
      christmas: '#7f1d1d', thanksgiving: '#78350f', diwali: '#701a75', halloween: '#111827',
      valentine: '#881337', holi: '#581c87', easter: '#134e4a', newyear: '#0f172a'
    };

    const bgColor = bgColors[themeKey] || '#ffffff';
    const textColor = textColors[themeKey] || '#1e293b';

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 20;
    ctx.strokeRect(100, 100, canvas.width - 200, canvas.height - 200);
    ctx.lineWidth = 5;
    ctx.strokeRect(130, 130, canvas.width - 260, canvas.height - 260);

    // --- Draw High-Res Tree (4K) ---
    const targetTreeWidth = 3840;
    const aspect = window.innerHeight / window.innerWidth;
    const targetTreeHeight = targetTreeWidth * aspect;
    const treeScale = targetTreeWidth / window.innerWidth;
    
    const origWidth = treeCanvas.width;
    const origHeight = treeCanvas.height;
    
    treeCanvas.width = targetTreeWidth;
    treeCanvas.height = targetTreeHeight;
    engine.ctx.setTransform(1, 0, 0, 1, 0, 0);
    engine.ctx.scale(treeScale, treeScale);
    engine.draw();

    // Left pane bounds: x: 200 to 1700 (width 1500), y: 200 to 1700 (height 1500)
    const maxTreeW = 1400;
    const maxTreeH = 1500;
    const drawScale = Math.min(maxTreeW / targetTreeWidth, maxTreeH / targetTreeHeight);
    const treeW = targetTreeWidth * drawScale;
    const treeH = targetTreeHeight * drawScale;
    const treeX = 200 + (maxTreeW - treeW) / 2;
    const treeY = 200 + (maxTreeH - treeH) / 2;
    
    ctx.drawImage(treeCanvas, treeX, treeY, treeW, treeH);

    // Restore original canvas
    treeCanvas.width = origWidth;
    treeCanvas.height = origHeight;
    engine.ctx.setTransform(1, 0, 0, 1, 0, 0);
    engine.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    engine.draw();
    // --------------------------

    // Logo below tree
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.font = 'bold 70px "Playfair Display", serif';
    ctx.fillText('Typography Tree', 200 + maxTreeW / 2, 1850);

    // Divider Line
    ctx.beginPath();
    ctx.moveTo(1800, 200);
    ctx.lineTo(1800, 1960);
    ctx.lineWidth = 3;
    ctx.stroke();

    // Text Setup (Right Side)
    const textCenterX = 2760; // Center of the right pane
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    // Title
    ctx.font = 'bold 110px "Playfair Display", serif';
    ctx.fillText('Certificate of Commitment', textCenterX, 500);

    // Subtitle
    ctx.font = 'italic 60px "Playfair Display", serif';
    ctx.fillText('This certifies that', textCenterX, 700);

    // Name
    ctx.font = 'bold 100px "Inter", sans-serif';
    ctx.fillText(certName, textCenterX, 900);

    // Oath
    ctx.font = '45px "Inter", sans-serif';
    ctx.fillText('has pledged to contribute to environmental sustainability', textCenterX, 1100);
    ctx.fillText('by planting a real tree as part of this initiative.', textCenterX, 1170);
    ctx.fillText('This act serves as a meaningful step toward creating', textCenterX, 1290);
    ctx.fillText('a greener and healthier planet.', textCenterX, 1360);
    
    ctx.fillText('In recognition of this commitment and dedication', textCenterX, 1500);
    ctx.fillText('to positive change.', textCenterX, 1570);

    // Signature
    ctx.font = '90px "Dancing Script", cursive';
    ctx.fillText('Zecco', textCenterX, 1800);
    
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(textCenterX - 200, 1820);
    ctx.lineTo(textCenterX + 200, 1820);
    ctx.stroke();

    ctx.font = '35px "Inter", sans-serif';
    ctx.fillText('Creator', textCenterX, 1880);
    
    // LinkedIn Link
    ctx.font = '30px "Inter", sans-serif';
    ctx.globalAlpha = 0.7;
    ctx.fillText('https://www.linkedin.com/in/zalak-zecco-patel-3a618890/', textCenterX, 1940);
    ctx.globalAlpha = 1.0;

    // Download
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `typography-tree-certificate-${certName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();

    setTreesPlanted(prev => prev + 1);
    setIsCertModalOpen(false);
    setCertName('');
  };

  const theme = settings.festival !== 'none' ? themes[settings.festival as keyof typeof themes] : themes[settings.season];

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${theme.bg}`}>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        {/* Certificate Control */}
        <button
          onClick={() => setIsCertModalOpen(true)}
          className={`w-12 h-12 rounded-full backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-center transition-all duration-1000 ${theme.panel} ${theme.text}`}
          title="Get Certificate"
        >
          <Award size={20} />
        </button>

        {/* Export Control */}
        <div className="relative">
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className={`w-12 h-12 rounded-full backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-center transition-all duration-1000 ${theme.panel} ${theme.text}`}
            title="Export Image"
          >
            <Download size={20} />
          </button>
          
          {isExportMenuOpen && (
            <div className={`absolute right-0 mt-3 w-64 p-4 rounded-2xl backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col gap-4 transition-all duration-1000 ${theme.panel} ${theme.text}`}>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-60 px-1">Export Image (4K)</div>
              
              <div className="flex flex-col gap-2">
                <button onClick={() => exportImage('png')} className={`py-2 rounded-lg text-xs font-medium bg-white/50 hover:bg-white transition-colors shadow-sm ${theme.text}`}>
                  Download PNG
                </button>
                <button onClick={() => exportImage('jpeg')} className={`py-2 rounded-lg text-xs font-medium bg-white/50 hover:bg-white transition-colors shadow-sm ${theme.text}`}>
                  Download JPG
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audio Control */}
        <button
          onClick={toggleAudio}
          className={`w-12 h-12 rounded-full backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-center transition-all duration-1000 ${theme.panel} ${theme.text}`}
          title={isPlaying ? "Mute Background Audio" : "Play Background Audio"}
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Control Panel */}
      <div className={`absolute top-4 left-4 w-[300px] p-5 rounded-2xl backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col gap-5 z-10 transition-colors duration-1000 ${theme.panel}`}>
        <div className={`flex items-center justify-between pb-3 border-b transition-colors duration-1000 border-black/5`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-1000 ${theme.iconBg}`}>
              <Type size={14} />
            </div>
            <div>
              <h1 className={`font-serif text-base font-medium leading-tight transition-colors duration-1000 ${theme.text}`}>Typography Tree</h1>
              <p className={`text-[10px] font-sans uppercase tracking-widest transition-colors duration-1000 ${theme.textMuted}`}>
                MADE BY <a href="https://www.linkedin.com/in/zalak-zecco-patel-3a618890/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">ZECCO</a>
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => {
                if (engineRef.current) {
                  engineRef.current.spawnTruck();
                }
              }}
              className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${theme.textMuted}`}
              title="Spawn Truck"
            >
              <TruckIcon size={14} />
            </button>
            <button 
              onClick={handleReset}
              className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${theme.textMuted}`}
              title="Reset Tree"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <label className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-1000 ${theme.textMuted}`}>
            <Type size={12} /> Species (Typeface)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(['serif', 'sans-serif', 'monospace', 'cursive', 'display', 'handwriting', 'rounded', 'classic'] as FontStyle[]).map(font => {
              const fontNames: Record<FontStyle, string> = {
                'serif': 'Oak (Serif)',
                'sans-serif': 'Birch (Sans)',
                'monospace': 'Topiary (Mono)',
                'cursive': 'Willow (Script)',
                'display': 'Maple (Display)',
                'handwriting': 'Cherry (Hand)',
                'rounded': 'Baobab (Round)',
                'classic': 'Sequoia (Classic)'
              };
              const fontFamilies: Record<FontStyle, string> = {
                'serif': 'Playfair Display',
                'sans-serif': 'Inter',
                'monospace': 'JetBrains Mono',
                'cursive': 'Dancing Script',
                'display': 'Oswald',
                'handwriting': 'Caveat',
                'rounded': 'Fredoka',
                'classic': 'Cinzel'
              };
              return (
                <button
                  key={font}
                  onClick={() => setSettings(s => ({ ...s, fontFamily: font }))}
                  className={`px-2 py-1.5 rounded-lg text-xs transition-all duration-500 ${
                    settings.fontFamily === font 
                      ? `${theme.activeTab} shadow-sm` 
                      : `bg-white/50 hover:bg-white ${theme.textMuted}`
                  }`}
                  style={{ fontFamily: fontFamilies[font] }}
                >
                  {fontNames[font]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Season */}
        <div className="space-y-2">
          <label className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-1000 ${theme.textMuted}`}>
            <Leaf size={12} /> Season
          </label>
          <div className="flex gap-1 bg-white/50 p-1 rounded-xl">
            {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map(season => (
              <button
                key={season}
                onClick={() => setSettings(s => ({ ...s, season, festival: 'none' }))}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all duration-500 ${
                  settings.season === season && settings.festival === 'none'
                    ? `bg-white shadow-sm ${theme.text}` 
                    : theme.textMuted
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* Festival */}
        <div className="space-y-2">
          <label className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-1000 ${theme.textMuted}`}>
            <Sparkles size={12} /> Festival Theme
          </label>
          <div className="grid grid-cols-3 gap-1 bg-white/50 p-1 rounded-xl">
            {(['none', 'christmas', 'thanksgiving', 'diwali', 'halloween', 'valentine', 'holi', 'easter', 'newyear'] as Festival[]).map(festival => (
              <button
                key={festival}
                onClick={() => setSettings(s => ({ ...s, festival }))}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium capitalize transition-all duration-500 ${
                  settings.festival === festival 
                    ? `bg-white shadow-sm ${theme.text}` 
                    : theme.textMuted
                }`}
              >
                {festival}
              </button>
            ))}
          </div>
        </div>

        {/* Wind */}
        <div className="space-y-2">
          <label className={`flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider transition-colors duration-1000 ${theme.textMuted}`}>
            <span className="flex items-center gap-2"><Wind size={12} /> Wind Speed</span>
            <span>{settings.wind}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={settings.wind}
            onChange={(e) => setSettings(s => ({ ...s, wind: parseInt(e.target.value) }))}
            className={`w-full h-1.5 rounded-full appearance-none bg-black/10 ${theme.accent} [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-current`}
          />
        </div>
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md z-10">
        <form onSubmit={handleGrow} className={`relative flex items-center p-2 rounded-full backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-colors duration-1000 ${theme.panel}`}>
          <input
            type="text"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type a word to grow..."}
            className={`w-full pl-6 pr-32 py-3 bg-transparent outline-none font-serif text-lg transition-all duration-1000 ${theme.text} placeholder:opacity-50`}
          />
          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : `hover:bg-black/5 ${theme.textMuted}`}`}
              title="Voice Input"
            >
              <Mic size={20} />
            </button>
            <button 
              type="submit"
              disabled={!wordInput.trim()}
              className={`px-6 py-2.5 rounded-full font-medium text-sm disabled:opacity-50 transition-all duration-1000 ${theme.button}`}
            >
              Grow
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Right Banner */}
      <div className={`absolute bottom-6 right-6 px-4 py-3 rounded-2xl backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center gap-3 transition-colors duration-1000 z-10 ${theme.panel} ${theme.text}`}>
        <span className="text-2xl">🌳</span>
        <div className="flex flex-col">
          <span className="font-bold text-sm">{treesPlanted} real {treesPlanted === 1 ? 'tree' : 'trees'} planted</span>
          <span className={`text-xs opacity-80 ${theme.textMuted}`}>through your words</span>
        </div>
      </div>

      {/* Certificate Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative w-full max-w-lg p-8 rounded-3xl shadow-2xl ${theme.panel} ${theme.text}`}>
            <button 
              onClick={() => setIsCertModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${theme.iconBg}`}>
                  <Award size={32} />
                </div>
              </div>
              
              <h2 className="text-2xl font-serif font-bold">Certificate of Commitment</h2>
              
              <div className="space-y-4">
                <p className={`text-sm ${theme.textMuted}`}>
                  Enter your full name to receive your certificate.
                </p>
                <input
                  type="text"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="Your Full Name"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${theme.input} ${theme.text}`}
                  autoFocus
                />
              </div>

              <div className={`p-4 rounded-xl bg-white/50 border text-sm italic ${theme.textMuted}`}>
                "I pledge to contribute to environmental sustainability by planting a real tree as part of this initiative."
              </div>

              <div className="pt-4">
                <button
                  onClick={downloadCertificate}
                  disabled={!certName.trim()}
                  className={`w-full py-3 rounded-xl font-medium transition-all disabled:opacity-50 ${theme.button}`}
                >
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
