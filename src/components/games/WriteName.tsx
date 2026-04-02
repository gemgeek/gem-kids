'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';

export default function WriteName({ onBack }: { onBack: () => void }) {
  // GAME STATES
  const [step, setStep] = useState<'input' | 'writing' | 'finish'>('input');
  const [name, setName] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // REFS
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLetter = name[currentIdx]?.toUpperCase() || '';

  
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
  };

  
  const setupCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 20;
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#f0abfc'; 
      }
  }, []);

  useEffect(() => {
      if (step === 'writing') {
          setTimeout(setupCanvas, 100); 
          speak(`Let's write the letter... ${currentLetter}`);
      }
  }, [step, currentIdx, currentLetter, setupCanvas]);


  
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 80%)`; 
      ctx.fill();
  };

  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      setIsDrawing(true);
      const { x, y } = getCoords(e);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          
          ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 60%)`; 
      }
      
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const { x, y } = getCoords(e);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
          ctx.lineTo(x, y);
          ctx.stroke();
          
          
          ctx.strokeStyle = `hsl(${(Date.now() / 5) % 360}, 80%, 60%)`;

          
          if (Math.random() > 0.8) { 
              const offsetX = (Math.random() - 0.5) * 20;
              const offsetY = (Math.random() - 0.5) * 20;
              drawStar(ctx, x + offsetX, y + offsetY, 5, 8, 4);
          }
      }
  };

  const stopDrawing = () => {
      setIsDrawing(false);
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.beginPath();
  };

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          new window.Audio('/sounds/pop.mp3').play().catch(() => {});
      }
  };

  const nextLetter = () => {
      new window.Audio('/sounds/magic-chime.mp3').play().catch(() => {});
      if (currentIdx < name.length - 1) {
          setCurrentIdx(prev => prev + 1);
          clearCanvas();
      } else {
          setStep('finish');
          speak(`You wrote your name! Amazing job ${name}!`);
      }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#f0f9ff] font-sans">
      
      
      <div className="absolute inset-0 z-0">
         <Image src="/images/art-desk-bg.png" alt="Desk" fill className="object-cover opacity-80" />
         <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
      </div>

      
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white hover:bg-slate-100 text-slate-800 p-3 rounded-full shadow-lg transition">
            <ArrowLeft />
         </button>
         
         <div className="bg-white/90 px-8 py-3 rounded-full shadow-xl border-2 border-blue-200">
             <h1 className="text-blue-500 font-black uppercase tracking-widest text-lg">
                 Write Your Name
             </h1>
         </div>
         <div className="w-12"/>
      </div>

      
      {step === 'input' && (
          <div className="relative z-10 bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-lg w-full border-8 border-blue-100 animate-in zoom-in">
              <h2 className="text-3xl font-black text-slate-700 mb-6">What is your name?</h2>
              
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="TYPE HERE..."
                className="w-full bg-slate-100 border-4 border-slate-300 rounded-2xl p-4 text-center text-4xl font-black text-blue-500 focus:outline-none focus:border-blue-500 mb-8 uppercase placeholder:text-slate-300"
                maxLength={12}
              />

              <button 
                onClick={() => { if(name.trim()) setStep('writing'); }}
                disabled={!name.trim()}
                className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white px-10 py-4 rounded-full font-black text-2xl shadow-xl transition hover:scale-105"
              >
                  LET'S WRITE!
              </button>
          </div>
      )}

      
      {step === 'writing' && (
          <div className="relative z-10 flex flex-col items-center w-full max-w-4xl h-full pt-24 pb-8 px-4">
              
              
              <div className="flex gap-2 mb-6">
                  {name.split('').map((char, i) => (
                      <div key={i} className={`
                          w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-black text-xl border-4 transition-all
                          ${i === currentIdx ? 'bg-blue-500 border-blue-600 text-white scale-125 shadow-lg' : 'bg-white border-slate-200 text-slate-300'}
                          ${i < currentIdx ? 'bg-green-100 border-green-300 text-green-500' : ''}
                      `}>
                          {char}
                      </div>
                  ))}
              </div>

              
              <div className="relative flex-1 w-full max-w-2xl bg-white rounded-4xl shadow-2xl border-8 border-slate-200 overflow-hidden flex items-center justify-center">
                  
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <span 
                        className="text-[300px] md:text-[400px] font-black text-slate-100" 
                        style={{ fontFamily: 'sans-serif', WebkitTextStroke: '3px #cbd5e1' }}
                      >
                          {currentLetter}
                      </span>
                  </div>

                  
                  <div ref={containerRef} className="absolute inset-0 z-20 cursor-crosshair touch-none">
                      <canvas 
                          ref={canvasRef}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                      />
                  </div>
              </div>

              
              <div className="flex gap-4 mt-6 items-center">
                  
                  <button 
                    onClick={clearCanvas} 
                    className="group bg-red-100 hover:bg-red-200 border-2 border-red-200 p-3 rounded-2xl shadow-lg transition transform hover:scale-105"
                    title="Clear"
                  >
                      <div className="relative w-10 h-10 md:w-12 md:h-12">
                          <Image src="/images/tool-eraser.png" alt="Eraser" fill className="object-contain" />
                      </div>
                  </button>
                  
                  
                  <button onClick={nextLetter} className="flex-1 bg-green-500 hover:bg-green-600 text-white h-16 md:h-20 px-8 rounded-full font-black text-2xl shadow-xl transition hover:scale-105 flex items-center justify-center gap-3">
                      NEXT <ArrowRight />
                  </button>

                  
                  <div className="hidden md:block absolute right-0 bottom-20 w-32 h-32 pointer-events-none animate-bounce">
                       <Image src="/images/tool-pencil.png" alt="Pencil" fill className="object-contain" />
                  </div>
              </div>

          </div>
      )}

      
      {step === 'finish' && (
          <div className="relative z-10 bg-white p-12 rounded-[3rem] shadow-2xl text-center border-8 border-yellow-300 animate-in zoom-in max-w-2xl">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 p-4 rounded-full shadow-lg">
                  <Sparkles size={48} className="text-white animate-spin-slow" />
              </div>
              
              <h2 className="text-4xl font-black text-slate-700 mt-6 mb-2">AMAZING!</h2>
              <p className="text-xl text-slate-500 font-bold mb-8">You wrote your name perfectly!</p>
              
              <div className="bg-slate-100 p-8 rounded-3xl mb-8">
                  <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 tracking-widest">
                      {name}
                  </span>
              </div>

              <div className="flex gap-4 justify-center">
                  <button onClick={() => { setName(''); setStep('input'); setCurrentIdx(0); }} className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-8 py-3 rounded-full font-bold transition">
                      New Name
                  </button>
                  <button onClick={() => { setStep('writing'); setCurrentIdx(0); }} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition">
                      Write Again
                  </button>
              </div>
          </div>
      )}

    </div>
  );
}