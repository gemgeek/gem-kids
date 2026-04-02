'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowLeft, Volume2, Sparkles } from 'lucide-react';


const levels = [
  { id: 1, word: 'CAT', image: '/images/word-cat.png' },
  { id: 2, word: 'DOG', image: '/images/word-dog.png' },
  { id: 3, word: 'SUN', image: '/images/word-sun.png' },
  { id: 4, word: 'BUS', image: '/images/word-bus.png' },
];

interface Balloon {
  id: number;
  text: string;
  x: number; // Left %
  y: number; // Bottom %
  speed: number;
  filter: string; 
  popped: boolean;
}


const filters = [
  'sepia(1) saturate(5) hue-rotate(0deg)',    // Red
  'sepia(1) saturate(5) hue-rotate(90deg)',   // Green
  'sepia(1) saturate(5) hue-rotate(180deg)',  // Cyan
  'sepia(1) saturate(5) hue-rotate(220deg)',  // Blue
  'sepia(1) saturate(5) hue-rotate(290deg)',  // Purple
  'sepia(1) saturate(10) hue-rotate(30deg)',  // Orange
];

export default function SpellingGame({ onBack }: { onBack: () => void }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [collected, setCollected] = useState<string[]>([]); 
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const requestRef = useRef<number | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const currentLevel = levels[levelIdx];
  const targetLetter = currentLevel.word[collected.length]; 

  
  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    }
  }, []);

  
  const spawnBalloon = useCallback(() => {
    if (isLevelComplete) return;

    setBalloons(prev => {
        if (prev.length > 6) return prev; 
        
        const isTarget = Math.random() > 0.4;
        let char = '';
        
        if (isTarget && targetLetter) {
            char = targetLetter;
        } else {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            char = alphabet[Math.floor(Math.random() * alphabet.length)];
        }

        return [...prev, {
            id: Date.now(),
            text: char,
            x: Math.random() * 80 + 10, 
            y: -20, 
            speed: Math.random() * 0.4 + 1.5, 
            
            filter: filters[Math.floor(Math.random() * filters.length)],
            popped: false
        }];
    });
  }, [targetLetter, isLevelComplete]);

  const handlePop = (id: number, text: string) => {
    if (isLevelComplete) return;

    if (text === targetLetter) {
        new window.Audio('/sounds/pop.mp3').play().catch(() => {});
        setCollected(prev => {
            const newCollected = [...prev, text];
            if (newCollected.length === currentLevel.word.length) {
                handleWin();
            } else {
                 speak(text);
            }
            return newCollected;
        });
        setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));

    } else {
        speak(`Not ${text}. Find ${targetLetter}`);
    }
  };

  const handleWin = () => {
      setIsLevelComplete(true);
      setBalloons([]); 
      new window.Audio('/sounds/win2.mp3').play().catch(() => {});
      speak(`You spelled ${currentLevel.word}! Great job!`);
  };

  const nextLevel = () => {
      if (levelIdx < levels.length - 1) {
          setLevelIdx(prev => prev + 1);
          setCollected([]);
          setIsLevelComplete(false);
          setBalloons([]);
      } else {
          setLevelIdx(0);
          setCollected([]);
          setIsLevelComplete(false);
      }
  };

  const startGame = () => {
      setIsPlaying(true);
      setCollected([]);
      setIsLevelComplete(false);
      speak(`Let's spell... ${currentLevel.word}`);
  };

  
  useEffect(() => {
    if (isPlaying && !isLevelComplete) {
        const animate = () => {
            setBalloons(prev => {
                return prev
                    .map(b => ({ ...b, y: b.y + b.speed * 0.2 })) 
                    .filter(b => b.y < 120); 
            });
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        const spawner = setInterval(spawnBalloon, 1500);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            clearInterval(spawner);
        };
    }
  }, [isPlaying, isLevelComplete, spawnBalloon]);

  
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-sky-300 overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Image src="/images/sky1-bg.png" alt="Sky" fill className="object-cover" />
         <div className="absolute inset-0 bg-white/10" />
      </div>

      
      <div className="absolute top-0 left-0 right-0 p-6 flex flex-col items-center z-50">
         <div className="absolute left-6 top-6">
            <button onClick={onBack} className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full shadow-lg transition backdrop-blur-md">
                <ArrowLeft />
            </button>
         </div>

         <div className="flex gap-4 items-center mt-2">
             
             
             <div className="bg-white/90 p-2 rounded-2xl shadow-xl border-4 border-white animate-bounce-slow">
                 <div className="relative w-16 h-16 md:w-20 md:h-20">
                     <Image src={currentLevel.image} alt="Target" fill className="object-contain" />
                 </div>
             </div>

             
             <div className="bg-white/80 px-6 py-4 rounded-3xl shadow-xl border-4 border-white backdrop-blur-md flex gap-2 md:gap-3">
                 {currentLevel.word.split('').map((char, i) => (
                     <div key={i} className={`
                        w-12 h-16 md:w-16 md:h-20 rounded-xl border-b-8 flex items-center justify-center text-4xl font-black transition-all
                        ${i < collected.length 
                            ? 'bg-green-500 border-green-700 text-white scale-110 shadow-lg' 
                            : 'bg-slate-200 border-slate-300 text-slate-400'
                        }
                     `}>
                         {i < collected.length ? char : '_'}
                     </div>
                 ))}
             </div>

         </div>
      </div>

      
      
      {!isPlaying && (
          <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 rounded-4xl font-black text-3xl shadow-[0_10px_0_#15803d] animate-bounce hover:scale-105 transition">
                  START SPELLING!
              </button>
          </div>
      )}

      
      {isLevelComplete && (
          <div className="absolute inset-0 z-60 flex items-center justify-center bg-green-500/20 backdrop-blur-md animate-in fade-in">
              <div className="bg-white p-8 rounded-[3rem] text-center shadow-2xl border-8 border-green-400 max-w-md w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_2px,transparent_2px)] bg-size-[16px_16px] opacity-50 pointer-events-none" />
                  
                  <h2 className="text-4xl font-black text-green-500 mb-2 flex items-center justify-center gap-2">
                      <Sparkles /> YOU DID IT!
                  </h2>
                  <div className="text-6xl font-black text-slate-800 mb-6 tracking-widest drop-shadow-sm">{currentLevel.word}</div>
                  
                  
                  <div className="relative w-48 h-48 mx-auto mb-8 bg-slate-100 rounded-4xl border-4 border-slate-200 overflow-hidden shadow-inner">
                       <Image src={currentLevel.image} alt={currentLevel.word} fill className="object-contain p-2" />
                  </div>

                  <button 
                    onClick={nextLevel} 
                    className="relative z-50 bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-full font-black text-2xl shadow-xl hover:scale-105 transition active:scale-95 cursor-pointer"
                  >
                      NEXT WORD
                  </button>
              </div>
          </div>
      )}

      
      <div ref={gameAreaRef} className="relative w-full h-full z-10 pointer-events-none">
          {balloons.map(b => (
              <div
                key={b.id}
                onClick={() => handlePop(b.id, b.text)}
                className={`
                    absolute w-28 h-36 md:w-36 md:h-48 flex items-center justify-center pointer-events-auto cursor-pointer transition-transform
                    ${b.popped ? 'scale-150 opacity-0 duration-200' : 'scale-100 hover:scale-105 duration-1000'}
                `}
                style={{ 
                    left: `${b.x}%`, 
                    bottom: `${b.y}%`,
                    transitionTimingFunction: 'linear'
                }}
              >
                  
                  <div 
                    className="relative w-full h-full drop-shadow-2xl"
                    style={{ filter: b.filter }} 
                   >
                      <Image src="/images/balloon.png" alt="Balloon" fill className="object-contain" />
                  </div>
                  
                  
                  <div className="absolute top-[25%] left-0 right-0 text-center">
                      <span 
                        className="text-slate-900 font-black text-5xl md:text-6xl"
                        style={{ 
                            textShadow: '3px 3px 0px white, -3px -3px 0px white, 3px -3px 0px white, -3px 3px 0px white' 
                        }}
                      >
                          {b.text}
                      </span>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}