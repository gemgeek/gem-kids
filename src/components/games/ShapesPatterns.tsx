'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Star, Gem } from 'lucide-react';


type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'hexagon';

interface Level {
  id: number;
  sequence: ShapeType[]; 
  missingIndex: number;  
  options: ShapeType[];  
}

const levels: Level[] = [
  { 
    id: 1, 
    sequence: ['circle', 'circle', 'circle', 'circle', 'circle'], 
    missingIndex: 4, 
    options: ['circle', 'square', 'triangle'] 
  },
  { 
    id: 2, 
    sequence: ['square', 'triangle', 'square', 'triangle', 'square'], 
    missingIndex: 3, 
    options: ['square', 'triangle', 'circle'] 
  },
  { 
    id: 3, 
    sequence: ['star', 'star', 'hexagon', 'star', 'star'], 
    missingIndex: 2, 
    options: ['star', 'hexagon', 'square'] 
  },
  { 
    id: 4, 
    sequence: ['circle', 'square', 'triangle', 'circle', 'square'], 
    missingIndex: 4, 
    options: ['triangle', 'square', 'star'] 
  },
];

export default function ShapesPatterns({ onBack }: { onBack: () => void }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedShape, setDraggedShape] = useState<ShapeType | null>(null);
  
  const currentLevel = levels[levelIdx % levels.length];
  const targetShape = currentLevel.sequence[currentLevel.missingIndex];

  // RESET
  useEffect(() => {
    setIsCorrect(false);
  }, [levelIdx]);

  // HANDLERS
  const handleDragStart = (e: React.DragEvent, shape: ShapeType) => {
    setDraggedShape(shape);
    e.dataTransfer.setData('shape', shape);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedShape = e.dataTransfer.getData('shape') as ShapeType;
    
    if (droppedShape === targetShape) {
        new Audio('/sounds/clink.mp3').play().catch(() => {}); // Glass sound
        setIsCorrect(true);
        
        setTimeout(() => {
            new Audio('/sounds/chime.mp3').play().catch(() => {});
        }, 300);
    } else {
        new Audio('/sounds/wrong.mp3').play().catch(() => {});
    }
    setDraggedShape(null);
  };

  const nextLevel = () => {
      setLevelIdx(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#1a1a2e]">
      
      
      <div className="absolute inset-0 z-0">
         <Image src="/images/pattern-bg.png" alt="Mosaic" fill className="object-cover opacity-60" />
         <div className="absolute inset-0 bg-linear-to-t from-[#1a1a2e] via-transparent to-[#1a1a2e]" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full border border-white/10 transition backdrop-blur-md">
            <ArrowLeft />
         </button>
         <div className="bg-black/50 px-8 py-3 rounded-full border border-purple-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <h1 className="text-purple-300 font-black uppercase tracking-widest flex items-center gap-3 text-xl">
                <Gem size={24} /> Mosaic Master
            </h1>
         </div>
         <div className="w-12" />
      </div>

      
      <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center gap-12 p-4">
        
        
        <div className="bg-[#2d2d44]/80 p-8 md:p-12 rounded-4xl border-4 border-[#4c4c74] shadow-2xl flex items-center justify-center gap-4 md:gap-8 backdrop-blur-sm overflow-x-auto max-w-full">
            
            {currentLevel.sequence.map((shape, index) => {
                
                if (index === currentLevel.missingIndex) {
                    return (
                        <div 
                            key={index}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={`
                                relative w-20 h-20 md:w-32 md:h-32 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all duration-500
                                ${isCorrect 
                                    ? 'border-green-400 bg-green-400/20 shadow-[0_0_50px_rgba(74,222,128,0.6)] scale-110 z-10' 
                                    : 'border-white/30 bg-black/40 hover:border-purple-400 hover:bg-purple-400/10'
                                }
                            `}
                        >
                            {isCorrect ? (
                                <div className="animate-in zoom-in duration-500">
                                    <Image src={`/images/shape-${shape}.png`} alt={shape} width={100} height={100} className="object-contain drop-shadow-xl" />
                                </div>
                            ) : (
                                <div className="text-white/20 text-4xl font-black">?</div>
                            )}
                        </div>
                    );
                }

                
                return (
                    <div key={index} className="w-20 h-20 md:w-32 md:h-32 flex items-center justify-center bg-black/20 rounded-2xl border border-white/5">
                        <Image src={`/images/shape-${shape}.png`} alt={shape} width={90} height={90} className="object-contain opacity-100 drop-shadow-lg" />
                    </div>
                );
            })}

        </div>

        
        {!isCorrect && (
            <div className="bg-black/60 p-6 rounded-3xl border border-white/10 flex gap-8 animate-in slide-in-from-bottom duration-500">
                {currentLevel.options.map((shape, i) => (
                    <div
                        key={i}
                        draggable
                        onDragStart={(e) => handleDragStart(e, shape)}
                        className="group w-24 h-24 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-purple-400 cursor-grab active:cursor-grabbing flex items-center justify-center transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(168,85,247,0.3)]"
                    >
                        <Image src={`/images/shape-${shape}.png`} alt={shape} width={70} height={70} className="object-contain group-hover:scale-110 transition-transform" />
                    </div>
                ))}
            </div>
        )}

        
        {isCorrect && (
            <button 
                onClick={nextLevel}
                className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-12 py-4 rounded-full font-black text-2xl shadow-[0_0_40px_rgba(168,85,247,0.6)] animate-in zoom-in duration-300 hover:scale-105 active:scale-95"
            >
                Next Pattern
            </button>
        )}

      </div>
    </div>
  );
}