'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, FlaskConical, RotateCcw, Check } from 'lucide-react';


type ColorType = 'red' | 'blue' | 'yellow' | 'purple' | 'green' | 'orange' | 'brown' | 'clear';

// Mixing Rules
const mixColors = (c1: ColorType, c2: ColorType): ColorType => {
  if (c1 === 'clear') return c2;
  if (c1 === c2) return c1;
  const pair = [c1, c2].sort().join('-');
  if (pair === 'blue-red') return 'purple';
  if (pair === 'blue-yellow') return 'green';
  if (pair === 'red-yellow') return 'orange';
  return 'brown'; // Messy mix
};

// Target Recipes
const recipes = [
  { target: 'green', name: 'Slime', components: ['blue', 'yellow'] },
  { target: 'purple', name: 'Grape Fizz', components: ['red', 'blue'] },
  { target: 'orange', name: 'Lava', components: ['red', 'yellow'] },
];

export default function ScienceLab({ onBack }: { onBack: () => void }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [liquidColor, setLiquidColor] = useState<ColorType>('clear');
  const [ingredientsAdded, setIngredientsAdded] = useState<ColorType[]>([]);
  const [isBubbling, setIsBubbling] = useState(false);
  const [showWin, setShowWin] = useState(false);

  const targetRecipe = recipes[currentLevel % recipes.length];

  // RESET
  const resetBeaker = () => {
    setLiquidColor('clear');
    setIngredientsAdded([]);
    setIsBubbling(false);
    setShowWin(false);
  };

  
  const handleDragStart = (e: React.DragEvent, color: ColorType) => {
    e.dataTransfer.setData('color', color);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const color = e.dataTransfer.getData('color') as ColorType;
    
    if (ingredientsAdded.length < 2) {
        const newMix = [...ingredientsAdded, color];
        setIngredientsAdded(newMix);
        
        
        setLiquidColor(prev => mixColors(prev, color));
        
        
        new Audio('/sounds/pour.mp3').play().catch(() => {}); 
        
        
        setIsBubbling(true);
        setTimeout(() => setIsBubbling(false), 2000);

        
        const finalColor = mixColors(color, liquidColor);
        if (newMix.length === 2) {
            if (finalColor === targetRecipe.target) {
                setTimeout(() => {
                    setShowWin(true);
                    new Audio('/sounds/win.mp3').play().catch(() => {});
                }, 1000);
            } else {
               
               setTimeout(resetBeaker, 1500); 
            }
        }
    }
  };

  const nextLevel = () => {
      setCurrentLevel(prev => prev + 1);
      resetBeaker();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900">
      
      
      <div className="absolute inset-0 z-0">
        <Image src="/images/lab-bg.png" alt="Lab" fill className="object-cover opacity-50" />
      </div>

      
      <div className="relative z-10 w-full max-w-5xl h-[90vh] bg-slate-800/80 backdrop-blur-md rounded-[3rem] border-4 border-slate-600 shadow-2xl flex flex-col overflow-hidden">
        
        
        <div className="flex justify-between items-center p-6 border-b border-white/10">
            <button onClick={onBack} className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 text-white transition">
                <ArrowLeft size={24} />
            </button>
            <div className="bg-slate-900/80 px-8 py-3 rounded-2xl border border-blue-500/30">
                <h1 className="text-2xl font-black text-blue-300 uppercase tracking-widest flex items-center gap-2">
                    <FlaskConical /> Science Lab
                </h1>
            </div>
            <button onClick={resetBeaker} className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 text-white transition">
                <RotateCcw size={24} />
            </button>
        </div>

        
        <div className="flex-1 flex flex-col md:flex-row relative">
            
            
            <div className="w-full md:w-1/3 p-8 flex flex-col justify-center items-center z-20">
                <div className="bg-[#fef9c3] text-slate-800 p-6 rounded-xl shadow-lg -rotate-2 border-t-8 border-yellow-400 w-full max-w-xs relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-sm" />
                    <h2 className="font-black text-2xl mb-2 text-center uppercase">Mission</h2>
                    <p className="text-center font-bold text-lg mb-4">Create: <span className={`text-${targetRecipe.target === 'purple' ? 'purple-600' : targetRecipe.target === 'green' ? 'green-600' : 'orange-500'}`}>{targetRecipe.name}</span></p>
                    
                    <div className="flex justify-center items-center gap-2">
                        <div className={`w-10 h-10 rounded-full border-2 border-black/20 bg-${targetRecipe.components[0]}-500`} />
                        <span className="font-bold text-2xl">+</span>
                        <div className={`w-10 h-10 rounded-full border-2 border-black/20 bg-${targetRecipe.components[1]}-500`} />
                        <span className="font-bold text-2xl">=</span>
                        <div className={`w-12 h-12 rounded-full border-2 border-black/20 animate-pulse bg-${targetRecipe.target}-500`} />
                    </div>
                </div>
            </div>

            
            <div className="flex-1 flex flex-col items-center justify-end pb-12 relative">
                
                
                <div 
                    className="relative w-64 h-80"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    
                    <div className="absolute bottom-4 left-4 right-4 rounded-b-[3rem] overflow-hidden flex items-end justify-center transition-all duration-1000 ease-in-out"
                         style={{ height: ingredientsAdded.length === 0 ? '0%' : ingredientsAdded.length === 1 ? '40%' : '80%' }}
                    >
                        {/* The Liquid Color */}
                        <div 
                            className={`w-full h-full transition-colors duration-700 opacity-80`}
                            style={{ 
                                backgroundColor: liquidColor === 'clear' ? 'transparent' : 
                                                 liquidColor === 'purple' ? '#9333ea' : 
                                                 liquidColor === 'green' ? '#22c55e' : 
                                                 liquidColor === 'orange' ? '#f97316' : 
                                                 liquidColor === 'brown' ? '#78350f' :
                                                 liquidColor // red/blue/yellow fallback
                            }} 
                        >
                            {/* BUBBLES ANIMATION */}
                            {isBubbling && (
                                <div className="w-full h-full relative">
                                    <div className="absolute bottom-0 left-10 w-4 h-4 bg-white/30 rounded-full animate-bubble-up" style={{ animationDelay: '0s' }} />
                                    <div className="absolute bottom-0 left-20 w-6 h-6 bg-white/30 rounded-full animate-bubble-up" style={{ animationDelay: '0.2s' }} />
                                    <div className="absolute bottom-0 left-30 w-3 h-3 bg-white/30 rounded-full animate-bubble-up" style={{ animationDelay: '0.5s' }} />
                                    <div className="absolute bottom-0 left-40 w-5 h-5 bg-white/30 rounded-full animate-bubble-up" style={{ animationDelay: '0.1s' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    
                    <div className="absolute inset-0 pointer-events-none z-10">
                        <Image src="/images/beaker-outline2.png" alt="Beaker" fill className="object-contain" priority />
                    </div>

                </div>
            </div>

            
            <div className="w-full md:w-1/4 bg-slate-900/50 border-l border-white/5 p-6 flex flex-row md:flex-col justify-center items-center gap-8 z-20">
                <DraggablePotion color="red" img="/images/potion-red.png" />
                <DraggablePotion color="blue" img="/images/potion-blue.png" />
                <DraggablePotion color="yellow" img="/images/potion-yellow.png" />
            </div>

        </div>

        {/* WIN MODAL */}
        {showWin && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in zoom-in">
                <div className="bg-white rounded-3xl p-8 text-center max-w-md border-8 border-green-400 shadow-[0_0_50px_rgba(74,222,128,0.5)]">
                    <div className="text-6xl mb-4">🧪✨</div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2">SUCCESS!</h2>
                    <p className="text-lg text-slate-500 font-bold mb-6">You created {targetRecipe.name}!</p>
                    <button onClick={nextLevel} className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-full font-bold text-xl shadow-lg transition-transform hover:scale-105">
                        Next Experiment
                    </button>
                </div>
            </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes bubble-up {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-bubble-up {
            animation: bubble-up 2s infinite linear;
        }
      `}</style>
    </div>
  );
}

function DraggablePotion({ color, img }: { color: ColorType, img: string }) {
    return (
        <div 
            draggable 
            onDragStart={(e) => {
                e.dataTransfer.setData('color', color);
                
            }}
            className="group relative w-24 h-32 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
        >
            <Image src={img} alt={`${color} potion`} fill className="object-contain drop-shadow-xl" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity capitalize">
                {color}
            </div>
        </div>
    )
}