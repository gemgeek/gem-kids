'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Hash, CheckCircle } from 'lucide-react';

// LEVELS
const levels = [
  { target: 12, label: "Tens and Ones" }, 
  { target: 45, label: "Big Numbers" },   
  { target: 123, label: "Hundreds!" },    
  { target: 509, label: "Tricky Zero!" },    
  { target: 888, label: "Master Builder" },    
];

export default function Abacus({ onBack }: { onBack: () => void }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [beadState, setBeadState] = useState({ hundreds: 0, tens: 0, ones: 0 });
  const [isComplete, setIsComplete] = useState(false);
  
  const targetNum = levels[currentLevel % levels.length].target;
  const targetHundreds = Math.floor(targetNum / 100);
  const targetTens = Math.floor((targetNum % 100) / 10);
  const targetOnes = targetNum % 10;
  const currentVal = (beadState.hundreds * 100) + (beadState.tens * 10) + beadState.ones;


  useEffect(() => {
    setBeadState({ hundreds: 0, tens: 0, ones: 0 });
    setIsComplete(false);
  }, [currentLevel]);

  // CHECK WIN
  useEffect(() => {
    if (currentVal === targetNum) {
        const timer = setTimeout(() => {
            setIsComplete(true);
            new Audio('/sounds/win.mp3').play().catch(() => {});
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [currentVal, targetNum]);

  const handleBeadClick = (row: 'hundreds' | 'tens' | 'ones', count: number) => {
      
      if (isComplete) return;
      
      new Audio('/sounds/clack.mp3').play().catch(() => {});
      setBeadState(prev => ({ ...prev, [row]: count }));
  };

  const nextLevel = () => {
      setIsComplete(false); 
      setBeadState({ hundreds: 0, tens: 0, ones: 0 }); 
      setCurrentLevel(prev => prev + 1); 
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#2c1810]">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Image src="/images/abacus-bg.png" alt="Wood Background" fill className="object-cover opacity-80" />
         <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition backdrop-blur-md border border-white/20">
            <ArrowLeft />
         </button>
         <div className="bg-black/60 px-8 py-3 rounded-2xl border-2 border-amber-500/50 backdrop-blur-md shadow-xl">
            <h1 className="text-amber-400 font-black uppercase tracking-widest flex items-center gap-3 text-xl drop-shadow-md">
                <Hash /> Master Abacus
            </h1>
         </div>
         <div className="w-12" />
      </div>

      
      <div className="relative w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center gap-12 p-4 mt-8 md:mt-0">
        
        
        <div className="bg-[#fff8e1] rounded-4xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-[#d4a373] w-72 text-center shrink-0 relative overflow-hidden transform md:-rotate-2">
            <div className="absolute top-0 left-0 w-full h-4 bg-[#d4a373]" />
            <h2 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4 mt-2">Build This Number</h2>
            <div className="text-8xl font-black text-slate-800 mb-6 drop-shadow-sm">{targetNum}</div>
            
            <div className="flex justify-center gap-4 text-sm font-bold pb-4">
                <div className="flex flex-col items-center bg-red-100 p-2 rounded-xl border border-red-200">
                    <div className="text-3xl font-black text-red-500 mb-1">{targetHundreds}</div>
                    <span className="text-red-400 uppercase text-[10px] tracking-wider">Hundreds</span>
                </div>
                <div className="flex flex-col items-center bg-blue-100 p-2 rounded-xl border border-blue-200">
                    <div className="text-3xl font-black text-blue-500 mb-1">{targetTens}</div>
                    <span className="text-blue-400 uppercase text-[10px] tracking-wider">Tens</span>
                </div>
                <div className="flex flex-col items-center bg-green-100 p-2 rounded-xl border border-green-200">
                    <div className="text-3xl font-black text-green-500 mb-1">{targetOnes}</div>
                    <span className="text-green-400 uppercase text-[10px] tracking-wider">Ones</span>
                </div>
            </div>
        </div>

        
        <div className="relative bg-linear-to-b from-[#6d4c41] to-[#4e342e] p-8 rounded-4xl shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_0_30px_rgba(0,0,0,0.8)] border-12 border-[#3e2723] h-150 flex items-end justify-center gap-8">
            
            <div className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-[#a1887f] rounded-tl-lg opacity-50" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-[#a1887f] rounded-tr-lg opacity-50" />

            
            <AbacusColumn 
                label="Hundreds" 
                colorName="red" 
                count={beadState.hundreds} 
                max={9} 
                onClick={(n) => handleBeadClick('hundreds', n)} 
            />

            <AbacusColumn 
                label="Tens" 
                colorName="blue" 
                count={beadState.tens} 
                max={9} 
                onClick={(n) => handleBeadClick('tens', n)} 
            />

            <AbacusColumn 
                label="Ones" 
                colorName="green" 
                count={beadState.ones} 
                max={9} 
                onClick={(n) => handleBeadClick('ones', n)} 
            />

        </div>

      </div>

      
      {isComplete && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-200 flex items-center justify-center animate-in zoom-in duration-300">
             <div className="bg-[#fff8e1] p-12 rounded-[3rem] text-center shadow-[0_0_80px_rgba(251,191,36,0.8)] border-8 border-amber-400 transform scale-110 relative overflow-hidden max-w-lg w-full mx-4">
                 
                 <div className="absolute inset-0 bg-[url('/images/abacus-bg.png')] opacity-10 mix-blend-overlay" />
                 
                 <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
                 <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 uppercase">Perfect Match!</h2>
                 <p className="text-slate-600 font-bold text-xl md:text-2xl mb-8">You built the number <span className="text-amber-600">{targetNum}</span></p>
                 
                 <div className="flex flex-col gap-4">
                    <button 
                        onClick={nextLevel} 
                        className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-12 py-4 rounded-full font-black text-2xl shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer relative z-50"
                    >
                        Next Challenge
                    </button>
                    
                    <button 
                        onClick={onBack}
                        className="text-slate-400 font-bold hover:text-slate-600 transition underline z-50"
                    >
                        Exit Game
                    </button>
                 </div>
             </div>
        </div>
      )}

    </div>
  );
}

interface AbacusColumnProps {
    label: string;
    colorName: 'red' | 'blue' | 'green';
    count: number;
    max: number;
    onClick: (n: number) => void;
}

function AbacusColumn({ label, colorName, count, max, onClick }: AbacusColumnProps) {
    const colorStyles = {
        red: { text: 'text-red-400', bg: 'bg-red-500', border: 'border-red-900' },
        blue: { text: 'text-blue-400', bg: 'bg-blue-500', border: 'border-blue-900' },
        green: { text: 'text-green-400', bg: 'bg-green-500', border: 'border-green-900' }
    };
    const colors = colorStyles[colorName];

    return (
        <div className="flex flex-col items-center h-full relative w-24 md:w-28 group">
            
            <div className={`mb-4 w-16 h-14 md:w-20 md:h-16 bg-[#3e2723] rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black ${colors.text} border-4 ${colors.border} shadow-lg z-20 relative`}>
                {count}
                <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-20 blur-md transition-opacity rounded-2xl`} />
            </div>

            <div className="relative flex-1 w-full flex justify-center my-2">
                
                <div className="absolute top-[2%] bottom-[2%] w-4 md:w-6 z-0">
                    <Image src="/images/abacus-rod.png" alt="Rod" fill className="object-cover rounded-full shadow-[inset_0_5px_10px_rgba(0,0,0,0.8)]" />
                </div>
                
                
                <div className="relative z-10 flex flex-col-reverse gap-1 h-full py-2 w-full items-center justify-end">
                    
                    {[...Array(max)].map((_, i) => {
                        const beadNum = i + 1;
                        const isActive = beadNum <= count;
                        
                        return (
                            <div 
                                key={i}
                                onClick={() => onClick(beadNum)}
                                className={`
                                    relative w-20 h-10 md:w-24 md:h-12 cursor-pointer transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                                    ${isActive ? 'translate-y-0 z-10' : '-translate-y-62.5 opacity-40 grayscale-80 scale-90 z-0 hover:opacity-100 hover:grayscale-0'}
                                `}
                            >
                                <Image src="/images/bead-white.png" alt="Bead" fill className="object-contain drop-shadow-lg" />
                                <div className={`absolute inset-1 md:inset-2 rounded-full ${colors.bg} mix-blend-multiply opacity-80 shadow-inner`} />
                                <div className="absolute top-2 left-3 w-4 h-2 bg-white/50 rounded-full blur-[1px]" />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={`mt-2 font-black text-xs md:text-sm ${colors.text} uppercase tracking-widest drop-shadow-sm bg-[#3e2723]/80 px-3 py-1 rounded-full`}>
                {label}
            </div>
        </div>
    )
}