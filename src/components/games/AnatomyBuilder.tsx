'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

type BodyPart = {
  id: string;
  name: string;
  img: string;
  targetStyle: { top: string; left: string; width: string; height: string };
};

const organsList: BodyPart[] = [
  { 
    id: 'brain', 
    name: 'Brain', 
    img: '/images/brain.png', 
    targetStyle: { top: '4%', left: '35%', width: '30%', height: '10%' } 
  },
  { 
    id: 'lungs', 
    name: 'Lungs', 
    img: '/images/lungs.png', 
    targetStyle: { top: '20%', left: '25%', width: '50%', height: '18%' } 
  },
  { 
    id: 'heart', 
    name: 'Heart', 
    img: '/images/heart.png', 
    targetStyle: { top: '24%', left: '38%', width: '24%', height: '10%' } 
  },
  { 
    id: 'liver', 
    name: 'Liver', 
    img: '/images/liver.png', 
    targetStyle: { top: '33%', left: '36%', width: '24%', height: '10%' } 
  },
  { 
    id: 'stomach', 
    name: 'Stomach', 
    img: '/images/stomach.png', 
    targetStyle: { top: '33%', left: '42%', width: '20%', height: '9%' } 
  },
  { 
    id: 'kidney-left', 
    name: 'Left Kidney', 
    img: '/images/kidney-left.png', 
    targetStyle: { top: '41%', left: '48%', width: '14%', height: '8%' } 
  },
  { 
    id: 'kidney-right', 
    name: 'Right Kidney', 
    img: '/images/kidney-right.png', 
    targetStyle: { top: '41%', left: '38%', width: '14%', height: '8%' } 
  },
  { 
    id: 'intestines', 
    name: 'Intestines', 
    img: '/images/intestines.png', 
    targetStyle: { top: '38%', left: '34%', width: '32%', height: '13%' } 
  },
];

interface AnatomyBuilderProps {
  onBack: () => void;
}

export default function AnatomyBuilder({ onBack }: AnatomyBuilderProps) {
  const [placedItems, setPlacedItems] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setIsDragging(id);
  };

  const handleDragEnd = () => {
    setIsDragging(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    
    if (itemId === targetId) {
       setPlacedItems((prev) => [...prev, itemId]);
       new Audio('/sounds/correct.mp3').play().catch(() => {});
    } else {
       new Audio('/sounds/wrong.mp3').play().catch(() => {});
    }
    setIsDragging(null);
  };

  const isComplete = placedItems.length === organsList.length;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-blue-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* GAME CONTAINER */}
      <div className="relative w-full max-w-7xl h-[95vh] bg-linear-to-br from-slate-900 to-slate-800 rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-blue-400/30 ring-4 ring-blue-500/20">
        
        <div className="absolute top-0 left-0 right-0 h-16 bg-white/5 backdrop-blur-md border-b border-white/10 z-30 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all text-white border border-white/10 hover:scale-105">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-blue-400 uppercase tracking-widest">
                        Human Anatomy Lab
                    </h1>
                    <p className="text-blue-300/60 text-[10px] font-mono uppercase tracking-widest">BIO-SCANNER ACTIVE</p>
                </div>
            </div>
        </div>

        {/* SCANNER AREA */}
        <div className="flex-1 relative flex items-center justify-center bg-[url('/images/grid-bg.png')] bg-repeat opacity-100 pt-16 pb-4 overflow-hidden px-8">
            
            {/* SCANNER LINE ANIMATION */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-1 bg-blue-400/50 blur-sm absolute animate-scan shadow-[0_0_20px_rgba(96,165,250,0.5)]" />
                <style jsx>{`
                    @keyframes scan {
                        0% { top: 0%; opacity: 0; }
                        15% { opacity: 1; }
                        85% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                    .animate-scan { animation: scan 6s linear infinite; }
                `}</style>
            </div>

            <div className="relative w-full max-w-md h-full border-x border-blue-500/10 bg-blue-500/5">
                
                {/* BASE SILHOUETTE */}
                <Image 
                    src="/images/body-outline.png" 
                    alt="Body Outline" 
                    fill 
                    className="object-contain opacity-90 drop-shadow-[0_0_15px_rgba(96,165,250,0.2)]" 
                    priority
                />

                {/* DROP ZONES */}
                {organsList.map((organ) => {
                    const isPlaced = placedItems.includes(organ.id);
                    const isTarget = isDragging === organ.id; 

                    return (
                        <div
                            key={organ.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, organ.id)}
                            className={`
                                absolute rounded-lg transition-all duration-300 flex items-center justify-center
                                ${isPlaced ? 'opacity-100 z-10' : 'z-20'}
                                /* GUIDE SYSTEM: Glows green only when needed */
                                ${!isPlaced && isTarget ? 'bg-green-400/20 border-2 border-green-400 animate-pulse scale-105 shadow-[0_0_20px_rgba(74,222,128,0.4)]' : 'border-transparent'}
                            `}
                            style={organ.targetStyle}
                        >
                            {/* PLACED ORGAN */}
                            {isPlaced && (
                                <div className="relative w-full h-full animate-in zoom-in spin-in-2 duration-500">
                                    <Image src={organ.img} alt={organ.name} fill className="object-contain drop-shadow-md" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* ORGAN TRAY */}
        <div className="w-full md:w-80 h-48 md:h-full bg-slate-900/50 backdrop-blur-xl border-t md:border-l border-white/10 flex flex-col z-20 shadow-2xl shrink-0">
            <div className="p-4 border-b border-white/10 hidden md:block">
                 <h2 className="text-white/80 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <RefreshCw size={14} className={isDragging ? 'animate-spin' : ''}/> Organ Bank
                 </h2>
            </div>

            <div className="flex-1 overflow-x-auto md:overflow-y-auto p-4 flex md:flex-col gap-4 items-center md:items-stretch custom-scrollbar">
                {organsList.map((organ) => {
                    const isPlaced = placedItems.includes(organ.id);
                    if (isPlaced) return null; 

                    return (
                        <div 
                            key={organ.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, organ.id)}
                            onDragEnd={handleDragEnd}
                            className="group shrink-0 w-24 md:w-full bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 hover:border-blue-400/50 rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all hover:scale-105 shadow-lg relative overflow-hidden flex flex-col items-center"
                        >
                            <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-16 h-16 md:w-24 md:h-24 mb-2">
                                <Image src={organ.img} alt={organ.name} fill className="object-contain drop-shadow-md" />
                            </div>
                            <span className="text-white/90 font-bold text-xs md:text-sm tracking-wide text-center">{organ.name}</span>
                        </div>
                    );
                })}

                {/* SUCCESS MESSAGE */}
                {isComplete && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 text-center animate-in zoom-in slide-in-from-bottom duration-500 w-full">
                        <Sparkles className="w-10 h-10 text-green-400 mx-auto mb-2 animate-spin" />
                        <h3 className="text-green-300 font-black text-lg mb-1">SCAN COMPLETE</h3>
                        <p className="text-white/60 text-xs mb-4">Subject is healthy.</p>
                        <button onClick={onBack} className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-all w-full">
                            Finish
                        </button>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}