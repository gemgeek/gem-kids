'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Trash2, Download, Sparkles, Repeat, Smile } from 'lucide-react';

// TYPES 
type ToolType = 'pencil' | 'marker' | 'brush' | 'neon' | 'eraser' | 'sticker';
type StickerType = 'star' | 'heart' | 'gem';

const colors = [
  '#000000', 
  '#ef4444', 
  '#f97316', 
  '#eab308', 
  '#22c55e', 
  '#3b82f6', 
  '#a855f7', 
  '#ec4899', 
  '#ffffff', 
];

const stickers: StickerType[] = ['star', 'heart', 'gem'];

export default function DrawStudio({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // STATE
  const [activeTool, setActiveTool] = useState<ToolType>('marker');
  const [activeColor, setActiveColor] = useState('#ef4444');
  const [activeSticker, setActiveSticker] = useState<StickerType>('star');
  const [isSymmetry, setIsSymmetry] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // SETUP CANVAS
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // DRAWING LOGIC
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(e);

    // STICKER LOGIC
    if (activeTool === 'sticker') {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const img = new window.Image();
        img.src = `/images/sticker-${activeSticker}.png`; 
        
        img.onload = () => {
            const size = 80; 
            ctx.shadowBlur = 0; 
            ctx.globalAlpha = 1;
            ctx.drawImage(img, x - size/2, y - size/2, size, size);

            if (isSymmetry && canvas) {
                 const mirrorX = canvas.width - x;
                 ctx.save();
                 ctx.translate(canvas.width, 0);
                 ctx.scale(-1, 1);
                 ctx.restore();
                 ctx.drawImage(img, mirrorX - size/2, y - size/2, size, size);
            }
        };

        new Audio('/sounds/stamp.mp3').play().catch(() => {});
        return;
    }

    // NORMAL DRAWING LOGIC 
    setIsDrawing(true);
    draw(x, y, false); 
    if (activeTool === 'pencil') new Audio('/sounds/scribble.mp3').play().catch(() => {});
  };

  const draw = (x: number, y: number, isMove: boolean) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // CONFIGURE BRUSH STYLE
    ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : activeColor;
    
    if (activeTool === 'pencil') {
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
    } else if (activeTool === 'marker') {
        ctx.lineWidth = 8;
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.8; 
    } else if (activeTool === 'brush') {
        ctx.lineWidth = 15;
        ctx.shadowBlur = 2;
        ctx.shadowColor = activeColor;
        ctx.globalAlpha = 1;
    } else if (activeTool === 'neon') {
        ctx.lineWidth = 6;
        ctx.shadowBlur = 15; 
        ctx.shadowColor = activeColor;
        ctx.globalAlpha = 1;
    } else if (activeTool === 'eraser') {
        ctx.lineWidth = 30;
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    if (isMove) {
        ctx.lineTo(x, y);
        ctx.stroke();

        
        if (isSymmetry) {
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.stroke(); 
            ctx.restore();
        }
    } else {
        ctx.beginPath();
        ctx.moveTo(x, y);
        if (isSymmetry) {

        }
    }
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    draw(x, y, true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath(); 
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          new Audio('/sounds/stamp.mp3').play().catch(() => {});
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
  };

  const saveDrawing = () => {
      const canvas = canvasRef.current;
      if (canvas) {
          const link = document.createElement('a');
          link.download = 'my-masterpiece.png';
          link.href = canvas.toDataURL();
          link.click();
          new Audio('/sounds/magic-chime.mp3').play().catch(() => {});
      }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#f0f4f8]">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Image src="/images/art-desk-bg.png" alt="Desk" fill className="object-cover" />
         <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 pointer-events-none">
         <button onClick={onBack} className="pointer-events-auto bg-white hover:bg-slate-100 text-slate-800 p-3 rounded-full shadow-lg transition transform hover:scale-105">
            <ArrowLeft />
         </button>
         
         <div className="bg-white/90 px-6 py-2 rounded-2xl shadow-xl backdrop-blur-sm pointer-events-auto flex gap-4">
             <button onClick={clearCanvas} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Clear">
                <Trash2 />
             </button>
             <button onClick={() => setIsSymmetry(!isSymmetry)} className={`p-2 rounded-lg transition ${isSymmetry ? 'bg-purple-100 text-purple-600' : 'text-slate-400 hover:bg-slate-100'}`} title="Symmetry Mode">
                <Repeat />
             </button>
             <button onClick={saveDrawing} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="Save">
                <Download />
             </button>
         </div>
         <div className="w-12" />
      </div>

      <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center gap-4 p-4 md:pr-8">
        
        {/* CANVAS */}
        <div ref={containerRef} className="relative w-full max-w-4xl aspect-4/3 bg-white rounded-xl shadow-2xl overflow-hidden cursor-crosshair transform rotate-1 border-2 border-slate-200">
             <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-20 pointer-events-none z-10" />
             <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={onMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={onMove}
                onTouchEnd={stopDrawing}
                className="block touch-none"
             />
        </div>

        {/* TOOL TRAY */}
        <div className="flex md:flex-col items-center justify-center gap-2 md:gap-4 bg-white/80 backdrop-blur-md p-4 rounded-4xl shadow-xl border border-white/50">
            
            
            <div className="grid grid-cols-3 md:grid-cols-2 gap-2 mb-2 md:mb-6">
                
                {activeTool !== 'sticker' ? (
                    // SHOW COLORS
                    colors.map(c => (
                        <button
                            key={c}
                            onClick={() => setActiveColor(c)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${activeColor === c ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))
                ) : (
                    // SHOW STICKERS
                    stickers.map(s => (
                        <button
                            key={s}
                            onClick={() => setActiveSticker(s)}
                            className={`w-10 h-10 rounded-xl border-2 transition-transform hover:scale-110 flex items-center justify-center bg-slate-100 ${activeSticker === s ? 'border-blue-500 bg-blue-50 scale-110 shadow-md' : 'border-transparent'}`}
                        >
                            <div className="relative w-8 h-8">
                                <Image src={`/images/sticker-${s}.png`} alt={s} fill className="object-contain" />
                            </div>
                        </button>
                    ))
                )}
            </div>

            <div className="w-full h-px bg-slate-300 hidden md:block" />

            {/* TOOLS */}
            <ToolButton id="pencil" img="/images/tool-pencil.png" isActive={activeTool === 'pencil'} onClick={() => setActiveTool('pencil')} />
            <ToolButton id="marker" img="/images/tool-marker.png" isActive={activeTool === 'marker'} onClick={() => setActiveTool('marker')} />
            <ToolButton id="brush" img="/images/tool-brush.png" isActive={activeTool === 'brush'} onClick={() => setActiveTool('brush')} />
            <ToolButton id="neon" img="/images/tool-neon.png" isActive={activeTool === 'neon'} onClick={() => setActiveTool('neon')} isSpecial />
            
            
            <button
                onClick={() => setActiveTool('sticker')}
                className={`
                    relative w-16 h-16 md:w-24 md:h-12 flex items-center justify-center transition-all duration-300 rounded-xl
                    ${activeTool === 'sticker' ? 'bg-yellow-100 scale-110 -translate-y-2 z-10 border-2 border-yellow-400' : 'hover:bg-slate-100 opacity-80 hover:opacity-100'}
                `}
            >
                <Smile className="text-yellow-600" size={28} />
            </button>

            <div className="mt-2">
                <ToolButton id="eraser" img="/images/tool-eraser.png" isActive={activeTool === 'eraser'} onClick={() => setActiveTool('eraser')} />
            </div>

        </div>

      </div>

      {isSymmetry && (
          <div className="absolute top-20 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg animate-pulse pointer-events-none">
              <Sparkles size={12} className="inline mr-1"/> Symmetry Mode Active
          </div>
      )}

    </div>
  );
}

function ToolButton({ id, img, isActive, onClick, isSpecial }: { id: string, img: string, isActive: boolean, onClick: () => void, isSpecial?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`
                relative w-16 h-16 md:w-24 md:h-12 flex items-center justify-center transition-all duration-300
                ${isActive ? 'scale-125 -translate-y-2 z-10' : 'hover:scale-110 opacity-80 hover:opacity-100'}
            `}
        >
            <div className={`relative w-full h-full ${id === 'brush' || id === 'pencil' || id === 'marker' ? 'md:rotate-45' : ''}`}>
                <Image 
                    src={img} 
                    alt={id} 
                    fill 
                    className={`
                        object-contain drop-shadow-md 
                        ${isSpecial && isActive ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]' : ''}
                    `} 
                />
            </div>
        </button>
    )
}