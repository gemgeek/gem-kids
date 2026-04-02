'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Settings, RefreshCw, Zap } from 'lucide-react';

// TYPES
type GearSize = 'small' | 'medium' | 'large';

interface GearSlot {
  id: string;
  size: GearSize;
  top: string;
  left: string;
  isPlaced: boolean;
}

const initialSlots: GearSlot[] = [
  { id: 'slot-1', size: 'small', top: '40%', left: '30%', isPlaced: false },
  { id: 'slot-2', size: 'large', top: '55%', left: '45%', isPlaced: false },
  { id: 'slot-3', size: 'medium', top: '35%', left: '60%', isPlaced: false },
];

export default function SimpleMachines({ onBack }: { onBack: () => void }) {
  const [slots, setSlots] = useState<GearSlot[]>(initialSlots);
  const [isRunning, setIsRunning] = useState(false);
  const [draggedGear, setDraggedGear] = useState<GearSize | null>(null);

  // Check if chain is complete
  const isComplete = slots.every(s => s.isPlaced);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
          setIsRunning(true);
          new Audio('/sounds/machine-start.mp3').play().catch(() => {}); 
      }, 500);
    }
  }, [isComplete]);

  // DRAG HANDLERS
  const handleDragStart = (e: React.DragEvent, size: GearSize) => {
    setDraggedGear(size);
    e.dataTransfer.setData('gearSize', size);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, slotId: string, requiredSize: GearSize) => {
    e.preventDefault();
    const size = e.dataTransfer.getData('gearSize');

    if (size === requiredSize) {
        // Correct Fit
        new Audio('/sounds/clank.mp3').play().catch(() => {}); 
        setSlots(prev => prev.map(slot => 
            slot.id === slotId ? { ...slot, isPlaced: true } : slot
        ));
    } else {
        // Wrong Size
        new Audio('/sounds/wrong.mp3').play().catch(() => {});
    }
    setDraggedGear(null);
  };

  const resetMachine = () => {
      setSlots(initialSlots);
      setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-800">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/factory-bg.png" alt="Factory" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />
      </div>

      {/* GAME CONTAINER */}
      <div className="relative z-10 w-full max-w-6xl h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6">
            <button onClick={onBack} className="bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-full shadow-lg transition">
                <ArrowLeft size={32} />
            </button>
            
            <div className="bg-slate-900/90 border-2 border-orange-500 px-8 py-3 rounded-xl shadow-lg">
                <h1 className="text-3xl font-black text-orange-400 uppercase tracking-widest flex items-center gap-3">
                    <Settings className={isRunning ? 'animate-spin' : ''} /> 
                    Gear Factory
                </h1>
            </div>

            <button onClick={resetMachine} className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg transition">
                <RefreshCw size={28} />
            </button>
        </div>

        {/* MACHINE AREA */}
        <div className="flex-1 relative mx-8 my-4 bg-slate-900/50 rounded-3xl border-4 border-slate-600 shadow-inner overflow-hidden">
            
            
            <div className="absolute top-[35%] left-[5%] w-32 h-32 flex flex-col items-center">
                <div className={`relative w-24 h-24 mb-2 ${isRunning ? 'animate-spin-slow' : 'animate-spin'}`}>
                    <Image src="/images/motor.png" alt="Motor" fill className="object-contain" />
                </div>
                <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-yellow-400 border border-yellow-500 uppercase tracking-wider">
                    Motor
                </div>
            </div>

            
            {slots.map((slot, index) => (
                <div
                    key={slot.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, slot.id, slot.size)}
                    className="absolute flex items-center justify-center transition-all"
                    style={{ 
                        top: slot.top, 
                        left: slot.left,
                        width: slot.size === 'small' ? '80px' : slot.size === 'medium' ? '120px' : '160px',
                        height: slot.size === 'small' ? '80px' : slot.size === 'medium' ? '120px' : '160px',
                    }}
                >
                    
                    {!slot.isPlaced && (
                        <div className={`
                            w-full h-full rounded-full border-4 border-dashed border-white/20 bg-black/20 flex items-center justify-center
                            ${draggedGear === slot.size ? 'border-green-400 bg-green-400/10 animate-pulse' : ''}
                        `}>
                            <div className="w-3 h-3 bg-slate-500 rounded-full" /> {/* Peg Center */}
                        </div>
                    )}

                    {/* Placed Gear */}
                    {slot.isPlaced && (
                        <div className={`relative w-full h-full drop-shadow-2xl ${isRunning ? (index % 2 === 0 ? 'animate-spin-reverse' : 'animate-spin-slow') : ''}`}>
                            <Image 
                                src={slot.size === 'small' ? '/images/gear-red.png' : slot.size === 'medium' ? '/images/gear-blue.png' : '/images/gear-green.png'} 
                                alt="Gear" 
                                fill 
                                className="object-contain" 
                            />
                        </div>
                    )}
                </div>
            ))}

            
            <div className="absolute top-[30%] right-[5%] w-40 h-40 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-2">
                    {/* Fan Blades */}
                    <div className={`relative w-full h-full ${isRunning ? 'animate-spin-fast' : ''}`}>
                        <Image src="/images/fan.png" alt="Fan" fill className="object-contain opacity-90" />
                    </div>
                    {/* Wind Effect */}
                    {isRunning && (
                        <div className="absolute top-0 -left-20 w-full h-full flex items-center">
                             <div className="w-20 h-10 bg-=linear-to-r from-transparent to-white/20 animate-pulse blur-md" />
                        </div>
                    )}
                </div>
                <div className={`bg-slate-800 px-4 py-1 rounded text-xs font-bold border uppercase tracking-wider ${isRunning ? 'text-green-400 border-green-500 shadow-[0_0_10px_lime]' : 'text-slate-500 border-slate-600'}`}>
                    {isRunning ? 'ONLINE' : 'OFFLINE'}
                </div>
            </div>

            
            <svg className="absolute inset-0 pointer-events-none opacity-20" width="100%" height="100%">
                <path d="M 100 300 L 250 300 L 400 450 L 600 300 L 850 300" fill="none" stroke="white" strokeWidth="4" strokeDasharray="10 10" />
            </svg>

        </div>

        
        <div className="h-48 bg-slate-800 border-t-4 border-slate-600 p-4 flex items-center justify-center gap-12 shadow-2xl relative z-20">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-600 text-white px-6 py-1 rounded-t-xl font-bold text-sm uppercase tracking-widest border-t border-x border-slate-500">
                Parts Bin
            </div>

            
            <DraggableGear size="small" img="/images/gear-red.png" label="Small" />
            <DraggableGear size="medium" img="/images/gear-blue.png" label="Medium" />
            <DraggableGear size="large" img="/images/gear-green.png" label="Large" />
        </div>

      </div>

      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-spin-reverse { animation: spin 4s linear infinite reverse; }
        .animate-spin-fast { animation: spin 0.5s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function DraggableGear({ size, img, label }: { size: GearSize, img: string, label: string }) {
    return (
        <div 
            draggable 
            onDragStart={(e) => {
                e.dataTransfer.setData('gearSize', size);
            }}
            className="flex flex-col items-center gap-2 group cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-transform"
        >
            <div className="relative w-24 h-24 drop-shadow-xl group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                <Image src={img} alt={label} fill className="object-contain" />
            </div>
            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider group-hover:text-white">{label}</span>
        </div>
    )
}