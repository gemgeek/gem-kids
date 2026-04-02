'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Trophy, MapPin, Globe, Star } from 'lucide-react';

const EXPLORER_DATA = [
  { 
    id: 'ghana', 
    name: 'Independence Arch', 
    continent: 'Africa', 
    fact: 'This arch is in Accra, Ghana! It celebrates the country’s freedom.',
    img: '/images/item-ghana-arch.png' 
  },
  { 
    id: 'paris', 
    name: 'Eiffel Tower', 
    continent: 'Europe', 
    fact: 'This famous iron tower is in Paris, France. It is as tall as an 81-story building!',
    img: '/images/item-eiffel.png' 
  },
  { 
    id: 'china', 
    name: 'Great Wall of China', 
    continent: 'Asia', 
    fact: 'It is the longest wall in the world and can even be seen from space!',
    img: '/images/item-great-wall.png' 
  },
  { 
    id: 'usa', 
    name: 'Statue of Liberty', 
    continent: 'North America', 
    fact: 'A giant green lady in New York who represents friendship and freedom.',
    img: '/images/item-statue-liberty.png' 
  },
  { 
    id: 'brazil', 
    name: 'Amazon Rainforest', 
    continent: 'South America', 
    fact: 'The "Lungs of the Planet." It is home to millions of colorful birds and monkeys!',
    img: '/images/item-amazon.png' 
  },
  { 
    id: 'australia', 
    name: 'Kangaroo', 
    continent: 'Australia', 
    fact: 'These amazing jumpers carry their babies (Joeys) in a cozy pouch!',
    img: '/images/kangaroo.png' 
  },
  { 
    id: 'antartica', 
    name: 'Emperor Penguin', 
    continent: 'Antarctica', 
    fact: 'These birds love the ice! They huddle together to stay warm in the freezing snow.',
    img: '/images/penguin.png' 
  }
];

const CONTINENTS = [
  { id: 'North America', top: '25%', left: '20%' },
  { id: 'South America', top: '65%', left: '32%' },
  { id: 'Europe', top: '22%', left: '50%' },
  { id: 'Africa', top: '55%', left: '52%' },
  { id: 'Asia', top: '28%', left: '75%' },
  { id: 'Australia', top: '75%', left: '85%' },
  { id: 'Antarctica', top: '92%', left: '50%' },
];

export default function WorldExplorer({ onBack }: { onBack: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showFact, setShowFact] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [wrongChoice, setWrongChoice] = useState<string | null>(null);

    const popSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popSoundRef.current = new Audio('/sounds/pop.mp3');
        winSoundRef.current = new Audio('/sounds/win2.mp3');
    }, []);

    const playPop = () => popSoundRef.current?.play().catch(() => {});
    const playWin = () => winSoundRef.current?.play().catch(() => {});

    const handleContinentClick = (continentId: string) => {
        if (showFact || gameOver) return;

        const currentItem = EXPLORER_DATA[currentIndex];
        
        if (continentId === currentItem.continent) {
            playWin();
            setShowFact(true);
            setScore(prev => prev + 1);
            setWrongChoice(null);
        } else {
            playPop();
            setWrongChoice(continentId);
            setTimeout(() => setWrongChoice(null), 1000);
        }
    };

    const nextItem = () => {
        playPop();
        setShowFact(false);
        if (currentIndex + 1 < EXPLORER_DATA.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowFact(false);
        setGameOver(false);
    };

    const currentItem = EXPLORER_DATA[currentIndex];

    return (
        <div className="fixed inset-0 z-100 bg-[#0EA5E9] font-sans select-none overflow-hidden">
            
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition text-sky-600">
                    <ArrowLeft size={28} />
                </button>
                <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg font-black text-xl text-sky-700 border-2 border-sky-200">
                    Discoveries: {score} / {EXPLORER_DATA.length}
                </div>
                <button onClick={resetGame} className="bg-white p-3 rounded-full shadow-lg text-sky-600 hover:scale-110 transition">
                    <RefreshCw size={28} />
                </button>
            </div>

            {/* THE WORLD MAP */}
            <div className="absolute inset-0 z-0 flex items-center justify-center p-4">
                <div className="relative w-full max-w-6xl aspect-2/1">
                    {/* Map Image */}
                    <Image 
                        src="/images/bg-world-map.png" 
                        alt="World Map" 
                        fill 
                        className="object-contain drop-shadow-2xl" 
                        priority 
                    />

                    {/* Interactive Continent Buttons */}
                    {CONTINENTS.map((continent) => (
                        <button
                            key={continent.id}
                            onClick={() => handleContinentClick(continent.id)}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300 ${
                                wrongChoice === continent.id ? 'animate-shake' : ''
                            }`}
                            style={{ top: continent.top, left: continent.left }}
                        >
                            <div className={`p-2 rounded-full border-4 shadow-lg transition-all ${
                                showFact && continent.id === currentItem.continent 
                                ? 'bg-green-500 border-white scale-125' 
                                : 'bg-white/40 border-white/60 hover:bg-white hover:scale-110'
                            }`}>
                                <MapPin className={showFact && continent.id === currentItem.continent ? 'text-white' : 'text-sky-600'} size={24} />
                            </div>
                            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                {continent.id}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* CURRENT ITEM TO FIND */}
            {!showFact && !gameOver && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 animate-bounce-slow">
                    <div className="bg-white p-4 rounded-3xl shadow-2xl flex flex-col items-center border-t-8 border-sky-400 min-w-70">
                        <p className="text-sky-400 font-black uppercase text-xs tracking-tighter mb-2">Target Discovery</p>
                        <div className="relative w-24 h-24 mb-2">
                             <Image src={currentItem.img} alt={currentItem.name} fill className="object-contain" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase">{currentItem.name}</h2>
                        <p className="text-slate-500 font-bold text-sm">Where in the world is this?</p>
                    </div>
                </div>
            )}

            {/* SUCCESS MODAL (FUN FACT) */}
            {showFact && (
                <div className="absolute inset-0 flex items-center justify-center z-60 bg-black/40 backdrop-blur-sm animate-in zoom-in duration-300">
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl text-center max-w-md border-b-12 border-green-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Globe className="text-green-600 animate-spin-slow" size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase">Correct!</h2>
                        <div className="relative w-48 h-48 mx-auto mb-4 bg-slate-50 rounded-3xl p-4 border-2 border-slate-100">
                             <Image src={currentItem.img} alt={currentItem.name} fill className="object-contain p-4" />
                        </div>
                        <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8 italic">
                            "{currentItem.fact}"
                        </p>
                        <button 
                            onClick={nextItem}
                            className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition uppercase tracking-widest"
                        >
                            Keep Exploring!
                        </button>
                    </div>
                </div>
            )}

            {/* GAME OVER (TROPHY) */}
            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-70 bg-black/60 backdrop-blur-md animate-in fade-in">
                    <Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" />
                    <h2 className="text-5xl font-black text-white mb-2 uppercase drop-shadow-lg">World Explorer!</h2>
                    <p className="text-2xl text-white/90 font-bold mb-10">You pinned all locations!</p>
                    <div className="flex gap-4">
                        <button onClick={resetGame} className="bg-sky-500 text-white px-10 py-5 rounded-full font-black text-xl shadow-2xl hover:scale-110 transition uppercase">
                            Play Again
                        </button>
                        <button onClick={onBack} className="bg-white text-sky-600 px-10 py-5 rounded-full font-black text-xl shadow-2xl hover:scale-110 transition uppercase">
                            Arcade
                        </button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes bounce-slow { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -15px); } }
                .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
                @keyframes shake { 0%, 100% { transform: translate(-50%, -50%) translateX(0); } 25% { transform: translate(-50%, -50%) translateX(-5px); } 75% { transform: translate(-50%, -50%) translateX(5px); } }
                .animate-shake { animation: shake 0.2s ease-in-out 3; }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}</style>
        </div>
    );
}