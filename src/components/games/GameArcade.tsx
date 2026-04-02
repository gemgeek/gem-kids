'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, Lock } from 'lucide-react';

export const GAMES_DATA = [
  { id: 'world', label: 'World Explorer', img: '/images/world-explorer.png', active: true },
  { id: 'spelling', label: 'Spelling Bee', img: '/images/spelling-bee.png', active: true },
  { id: 'puzzle', label: 'Mini Puzzle', img: '/images/puzzle.png', active: true },
  { id: 'match', label: 'Match Pairs', img: '/images/match-thepairs.png', active: true },
  { id: 'quiz', label: 'Quiz Time', img: '/images/fun-quiz.png', active: true },
  { id: 'words', label: 'Word Play', img: '/images/word-play.png', active: true },
  { id: 'animal', label: 'Guess The Animal', img: '/images/guess-the-animal.png', active: true },
];

export default function GameArcade({ 
  onBack, 
  onSelectGame 
}: { 
  onBack: () => void;
  onSelectGame: (label: string) => void;
}) {
  const popSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSoundRef.current = new Audio('/sounds/pop.mp3');
  }, []);

  const playPop = () => popSoundRef.current?.play().catch(() => {});

  const handleGameSelect = (label: string, isActive: boolean) => {
    playPop();
    if (!isActive) return; 
    
    onSelectGame(label);
  };

  return (
    <div className="fixed inset-0 z-100 bg-black overflow-hidden font-sans select-none">
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Image src="/images/bg-game-arcade.jpg" alt="Arcade" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* HEADER */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50">
                <button onClick={onBack} className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full border-2 border-white/50 backdrop-blur-md transition shadow-xl">
                    <ArrowLeft size={28} />
                </button>
                <div className="bg-white/90 px-8 py-3 rounded-full border-4 border-lime-500 shadow-2xl transform -rotate-2">
                    <h1 className="text-2xl md:text-3xl font-black text-lime-600 tracking-wider uppercase drop-shadow-sm">GEM Arcade</h1>
                </div>
                <div className="w-12" />
            </div>

            {/* GAMES GRID */}
            <div className="absolute inset-0 z-40 flex items-center justify-center pt-24 pb-10 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl px-6">
                    {GAMES_DATA.map((game) => (
                        <button
                            key={game.id}
                            onClick={() => handleGameSelect(game.label, game.active)}
                            className={`group relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                game.active ? 'bg-white shadow-[0_10px_0_rgb(0,0,0,0.2)] hover:shadow-[0_15px_0_rgb(0,0,0,0.1)] cursor-pointer' : 'bg-gray-200/80 grayscale cursor-not-allowed opacity-80'
                            }`}
                        >
                            <div className="relative w-24 h-24 md:w-32 md:h-32 mb-2 drop-shadow-xl">
                                <Image src={game.img} alt={game.label} fill className="object-contain" />
                            </div>
                            <span className={`font-black text-sm md:text-lg uppercase text-center leading-tight ${game.active ? 'text-lime-600' : 'text-gray-500'}`}>
                                {game.label}
                            </span>
                            {!game.active && (
                                <div className="absolute inset-0 bg-black/10 rounded-3xl flex items-center justify-center">
                                    <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Lock size={12} /> Soon</div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
    </div>
  );
}