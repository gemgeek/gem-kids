'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Trophy, Star } from 'lucide-react';

const ANIMAL_DATA = [
  { id: 'lion', name: 'Lion', img: '/images/lion.png', options: ['Tiger', 'Lion', 'Bear'] },
  { id: 'elephant', name: 'Elephant', img: '/images/elephant.png', options: ['Rhino', 'Hippo', 'Elephant'] },
  { id: 'monkey', name: 'Monkey', img: '/images/monkey.png', options: ['Monkey', 'Gorilla', 'Sloth'] },
  { id: 'penguin', name: 'Penguin', img: '/images/penguin.png', options: ['Penguin', 'Ostrich', 'Seagull'] },
  { id: 'zebra', name: 'Zebra', img: '/images/zebra.png', options: ['Horse', 'Zebra', 'Donkey'] },
];

export default function GuessTheAnimal({ onBack }: { onBack: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    
    const [currentOptions, setCurrentOptions] = useState<string[]>([]);

    const popSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);
    const tadaSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popSoundRef.current = new Audio('/sounds/pop.mp3');
        winSoundRef.current = new Audio('/sounds/win2.mp3');
        tadaSoundRef.current = new Audio('/sounds/tada.mp3'); 
        loadAnimal(0);
    }, []);

    const loadAnimal = (index: number) => {
        setRevealed(false);
        const animal = ANIMAL_DATA[index];
        // Shuffle the 3 options
        setCurrentOptions([...animal.options].sort(() => Math.random() - 0.5));
    };

    const playPop = () => popSoundRef.current?.play().catch(() => {});
    const playWin = () => winSoundRef.current?.play().catch(() => {});
    const playTada = () => tadaSoundRef.current?.play().catch(() => {});

    const handleGuess = (guess: string) => {
        if (revealed || gameOver) return;
        
        const isCorrect = guess === ANIMAL_DATA[currentIndex].name;
        
        if (isCorrect) {
            playWin();
            setRevealed(true);
            setScore(prev => prev + 1);
            
            setTimeout(() => {
                if (currentIndex + 1 < ANIMAL_DATA.length) {
                    setCurrentIndex(prev => prev + 1);
                    loadAnimal(currentIndex + 1);
                } else {
                    setGameOver(true);
                    playTada();
                }
            }, 2000); 
        } else {
            playPop();
            
        }
    };

    const resetGame = () => {
        setScore(0);
        setCurrentIndex(0);
        setGameOver(false);
        loadAnimal(0);
    };

    const currentAnimal = ANIMAL_DATA[currentIndex];

    return (
        <div className="fixed inset-0 z-100 bg-lime-400 font-sans select-none">
            
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition text-lime-600"><ArrowLeft size={28} /></button>
                <div className="bg-white px-6 py-2 rounded-full shadow-lg font-black text-xl text-lime-600">
                    Score: {score} / {ANIMAL_DATA.length}
                </div>
                <button onClick={resetGame} className="bg-white p-3 rounded-full shadow-lg text-lime-600 hover:scale-110 transition"><RefreshCw size={28} /></button>
            </div>

            {!gameOver ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-40">
                    <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-8 uppercase tracking-widest text-center">
                        Who's That Animal?
                    </h1>
                    
                    {/* The Stage */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white/30 backdrop-blur-md rounded-full border-8 border-white/50 shadow-2xl flex items-center justify-center mb-8 overflow-hidden">
                        
                        <div className={`absolute inset-0 bg-yellow-300 transition-opacity duration-1000 ${revealed ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`} />
                        
                        {/* Animal Image */}
                        <div className={`relative w-48 h-48 md:w-60 md:h-60 z-10 transition-all duration-700 ${revealed ? 'scale-110 drop-shadow-2xl' : 'scale-100 brightness-0 contrast-200 drop-shadow-md'}`}>
                            <Image src={currentAnimal.img} alt="Animal" fill className="object-contain" priority />
                        </div>
                    </div>

                    {/* Choices */}
                    <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
                        {currentOptions.map((option, idx) => {
                            const isCorrectAnswer = option === currentAnimal.name;
                            let buttonStyle = "bg-white text-lime-600 hover:bg-lime-50";
                            
                            if (revealed) {
                                if (isCorrectAnswer) buttonStyle = "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.6)] border-4 border-green-300 scale-110";
                                else buttonStyle = "bg-gray-300 text-gray-500 opacity-50 scale-95";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleGuess(option)}
                                    disabled={revealed}
                                    className={`px-8 py-4 rounded-2xl shadow-xl font-black text-xl md:text-2xl uppercase transition-all duration-300 ${buttonStyle}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Win Screen */
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40 backdrop-blur-sm animate-in zoom-in">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md flex flex-col items-center">
                        <Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" />
                        <h2 className="text-4xl font-black text-lime-600 mb-2 uppercase">Awesome Job!</h2>
                        <p className="text-xl text-gray-600 font-bold mb-8">You guessed {score} animals correctly!</p>
                        <div className="flex gap-4">
                            <button onClick={resetGame} className="bg-lime-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                Play Again
                            </button>
                            <button onClick={onBack} className="bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                Arcade
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style jsx global>{`
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 10s linear infinite; }
            `}</style>
        </div>
    );
}