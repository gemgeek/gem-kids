'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';

const FILL_TOLERANCE = 50; 

const pages = [
  { id: 1, name: 'Page 1', src: '/images/coloring-page-1.png' },
  { id: 2, name: 'Page 2', src: '/images/coloring-page-2.png' },
  { id: 3, name: 'Page 3', src: '/images/coloring-page-3.png' },
  { id: 4, name: 'Page 4', src: '/images/coloring-page-4.png' },
  { id: 5, name: 'Page 5', src: '/images/coloring-page-5.png' },
  { id: 6, name: 'Page 6', src: '/images/coloring-page-6.png' },
  { id: 7, name: 'Page 7', src: '/images/coloring-page-7.png' },
  { id: 8, name: 'Page 8', src: '/images/coloring-page-8.png' },
  { id: 9, name: 'Page 9', src: '/images/coloring-page-9.png' },
  { id: 10, name: 'Page 10', src: '/images/coloring-page-10.png' },
];

const palette = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#78350f', // Brown
  '#000000', // Black
  '#ffffff', // Eraser (White)
];

export default function ColoringBook({ onBack }: { onBack: () => void }) {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const page = pages[currentPageIdx];

  
  const loadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new window.Image();
    img.src = page.src;
    img.onload = () => {
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [page.src]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const resetCanvas = () => {
    new Audio('/sounds/stamp.mp3').play().catch(() => {});
    loadImage();
  };

  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    // Read image data
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColorRgb = getPixelColor(imgData, x, y);
    const fillColorRgb = hexToRgb(selectedColor);

    
    if (colorsMatch(targetColorRgb, fillColorRgb, 0)) return;

    
    floodFill(imgData, x, y, targetColorRgb, fillColorRgb, FILL_TOLERANCE);
    
    
    ctx.putImageData(imgData, 0, 0);
    new Audio('/sounds/pop.mp3').play().catch(() => {});
  };

  
  const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  };

  
  const getPixelColor = (imgData: ImageData, x: number, y: number) => {
      const idx = (y * imgData.width + x) * 4;
      return { r: imgData.data[idx], g: imgData.data[idx+1], b: imgData.data[idx+2] };
  };

  
  const colorsMatch = (c1: any, c2: any, tolerance: number) => {
      const dr = Math.abs(c1.r - c2.r);
      const dg = Math.abs(c1.g - c2.g);
      const db = Math.abs(c1.b - c2.b);
      return dr <= tolerance && dg <= tolerance && db <= tolerance;
  };

  
  const floodFill = (imgData: ImageData, startX: number, startY: number, targetColor: any, fillColor: any, tolerance: number) => {
      const width = imgData.width;
      const height = imgData.height;
      const data = imgData.data;
      const stack = [[startX, startY]];
      const visited = new Set(); 

      while (stack.length > 0) {
          const [x, y] = stack.pop()!;
          const key = `${x},${y}`;

          if (x < 0 || x >= width || y < 0 || y >= height || visited.has(key)) continue;
          visited.add(key);

          const idx = (y * width + x) * 4;
          const currentColor = { r: data[idx], g: data[idx+1], b: data[idx+2] };

          
          if (colorsMatch(currentColor, targetColor, tolerance)) {
              data[idx] = fillColor.r;
              data[idx+1] = fillColor.g;
              data[idx+2] = fillColor.b;
              

              stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
          }
      }
  };
  


  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fdf2f8]">
      
      
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white hover:bg-pink-50 text-slate-800 p-3 rounded-full shadow-lg transition">
            <ArrowLeft />
         </button>
         
         <div className="bg-white px-6 py-2 rounded-2xl shadow-md border-2 border-pink-100 flex gap-4">
             <span className="font-bold text-pink-500 uppercase tracking-widest">{page.name}</span>
         </div>
         
         <div className="flex gap-2">
             
             <button onClick={resetCanvas} className="bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-full shadow-lg transition" title="Reset Page">
                <RefreshCw />
             </button>
         </div>
      </div>

      
      <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 p-4 pt-20">
        
        
        <div className="relative shadow-2xl rounded-xl overflow-hidden border-4 border-white bg-white">
             
             <canvas 
                ref={canvasRef}
                width={500}
                height={500}
                onClick={handleCanvasClick}
                className="cursor-crosshair w-87.5 h-87.5 md:w-125 md:h-125 object-contain touch-none"
             />
        </div>

        
        <div className="bg-white p-6 rounded-4xl shadow-xl border border-pink-100 flex flex-col items-center gap-4">
            <h3 className="text-pink-300 font-bold uppercase text-xs tracking-widest">Colors</h3>
            <div className="grid grid-cols-2 gap-3">
                {palette.map(color => (
                    <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-4 transition-transform hover:scale-110 ${selectedColor === color ? 'border-slate-800 scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                    >
                        {selectedColor === color && <Check className="text-white/50 mx-auto" size={20}/>}
                    </button>
                ))}
            </div>

            {/* Page Switcher */}
            <div className="mt-4 flex gap-2 border-t pt-4 border-slate-100 w-full justify-center">
                {pages.map((p, i) => (
                    <button 
                        key={p.id} 
                        onClick={() => setCurrentPageIdx(i)}
                        className={`w-3 h-3 rounded-full transition-all ${currentPageIdx === i ? 'bg-pink-500 scale-125' : 'bg-slate-300 hover:bg-pink-300'}`} 
                    />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}