'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Star } from 'lucide-react';

// TYPES 
export type DraggableItem = {
  id: string;
  name: string;
  img: string;
  matchId: string;
};

export type TargetZone = {
  id: string;
  name: string;
  img: string;
};

export interface GameLevel {
  id: string;
  successMessage?: string; 
  draggables: DraggableItem[];
  targets: TargetZone[];
}

interface DragDropGameProps {
  title: string;
  levelData: GameLevel;
  bgImage?: string;
  onBack: () => void;
}

// CONFETTI COMPONENT 
const Confetti = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-60">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 md:w-4 md:h-4 rounded-sm animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            backgroundColor: ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7'][Math.floor(Math.random() * 5)],
            animationDuration: `${Math.random() * 3 + 2}s`, 
            animationDelay: `${Math.random() * 2}s`, 
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

// MAIN COMPONENT 
export default function DragDropGame({ title, levelData, bgImage, onBack }: DragDropGameProps) {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [matches, setMatches] = useState<{ [key: string]: DraggableItem | null }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);

  useEffect(() => {
    resetGame();
  }, [levelData]);

  const resetGame = () => {
    const shuffled = [...levelData.draggables].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setMatches({});
    setIsComplete(false);
  };

  useEffect(() => {
    const totalTargets = levelData.targets.length;
    const currentMatches = Object.keys(matches).length;
    
    if (currentMatches === totalTargets && totalTargets > 0) {
      setIsComplete(true);
      new Audio('/sounds/win.mp3').play().catch(() => {});
    }
  }, [matches, levelData.targets.length]);

  const handleDragStart = (e: React.DragEvent, item: DraggableItem) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.matchId === targetId) {
       new Audio('/sounds/pop.mp3').play().catch(() => {});
       setMatches(prev => ({ ...prev, [targetId]: draggedItem }));
       setItems(prev => prev.filter(i => i.id !== draggedItem.id));
    } else {
       new Audio('/sounds/wrong.mp3').play().catch(() => {});
    }
    setDraggedItem(null);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black">
      
      
      <div className="absolute inset-0 z-0">
          <Image 
            src={bgImage || "/images/forest-bg.png"} 
            alt="Background" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      
      <div className="relative z-10 w-full max-w-7xl h-full md:h-[90vh] flex flex-col">
        
        
        <div className="flex justify-between items-center px-6 py-4 shrink-0">
            <button 
                onClick={onBack}
                className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-3 shadow-lg transition-transform hover:scale-105"
            >
                <ArrowLeft size={28} strokeWidth={3} />
            </button>
            
            <div className="bg-yellow-400 border-4 border-yellow-600 px-8 py-2 rounded-2xl shadow-lg transform -rotate-1">
                <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-wider">{title}</h1>
            </div>

            <div className="w-14" />
        </div>

        
        <div className="flex-1 flex flex-col justify-center gap-8 p-4 overflow-hidden">
            
            
            <div className="w-full">
                <div className="flex gap-4 overflow-x-auto pb-4 px-4 justify-start md:justify-center items-center custom-scrollbar min-h-35">
                    {items.length === 0 && !isComplete && (
                         <div className="text-white/60 font-bold animate-pulse">Select a destination below...</div>
                    )}
                    
                    {items.map((item) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            className="shrink-0 w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl border-4 border-white shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                        >
                             <div className="relative w-16 h-16 md:w-24 md:h-24 pointer-events-none">
                                <Image src={item.img} alt={item.name} fill className="object-contain" />
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            
            <div className="text-center text-white/90 font-bold text-lg md:text-xl animate-pulse shrink-0">
                {items.length > 0 ? "Drag the animal to its correct home!" : ""}
            </div>

            
            <div className="w-full">
                <div className="flex gap-4 overflow-x-auto pb-6 px-4 justify-start md:justify-center items-center custom-scrollbar">
                    {levelData.targets.map((target) => {
                        const matchedItem = matches[target.id];

                        return (
                            <div
                                key={target.id}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, target.id)}
                                className={`
                                    shrink-0 relative w-32 h-32 md:w-48 md:h-40 rounded-3xl border-4 transition-all overflow-hidden
                                    ${matchedItem 
                                        ? 'border-green-400' 
                                        : 'border-white/50 bg-black/30 hover:border-white'
                                    }
                                `}
                            >
                                <div className={`absolute inset-0 z-0 ${matchedItem ? 'opacity-100' : 'opacity-80'}`}>
                                    <Image 
                                        src={target.img} 
                                        alt={target.name} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                                
                                
                                <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-sm text-center z-10">
                                    <span className="text-white text-xs md:text-sm font-bold">
                                        {target.name}
                                    </span>
                                </div>

                                
                                {matchedItem && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 animate-in zoom-in spin-in-6 duration-500">
                                        <div className="relative w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl">
                                            <Image src={matchedItem.img} alt={matchedItem.name} fill className="object-contain" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                            <Star fill="white" size={16} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
      </div>

      
      {isComplete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
            <Confetti />
            
            <div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full text-center relative shadow-[0_0_50px_rgba(255,255,255,0.5)] transform scale-110 mx-4 border-8 border-yellow-400">
                
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 rounded-full p-4 border-8 border-white shadow-xl animate-bounce">
                    <Star size={48} fill="white" className="text-white" />
                </div>

                <div className="mt-8 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-yellow-500 drop-shadow-sm uppercase tracking-tighter">
                        Awesome!
                    </h2>
                    
                    
                    <p className="text-xl text-gray-500 font-bold">
                        {levelData.successMessage || "Level Complete!"}
                    </p>

                    <div className="pt-6">
                        <button 
                            onClick={resetGame}
                            className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full font-black text-xl shadow-xl transition-transform hover:scale-105 active:scale-95 w-full md:w-auto"
                        >
                             PLAY AGAIN
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
      `}</style>

    </div>
  );
}