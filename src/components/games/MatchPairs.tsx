'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';

const MEMORY_ICONS = [
  '/images/icon-kite-gold.png',
  '/images/icon-atom-gold.png',
  '/images/icon-pyramid-gold.png',
  '/images/icon-bulb-gold.png',
  '/images/icon-map-gold.png',
  '/images/icon-rocket.png', 
];

export default function MatchPairs({ onBack }: { onBack: () => void }) {
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState<number[]>([]);

    // Audio Refs
    const popSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popSoundRef.current = new Audio('/sounds/pop.mp3');
        winSoundRef.current = new Audio('/sounds/win2.mp3');
        resetGame();
    }, []);

    const playPop = () => popSoundRef.current?.play().catch(() => {});
    const playWin = () => winSoundRef.current?.play().catch(() => {});

    const resetGame = () => {
        const deck = [...MEMORY_ICONS, ...MEMORY_ICONS]
            .sort(() => Math.random() - 0.5)
            .map((img, index) => ({ id: index, img }));
        setCards(deck);
        setSolved([]);
        setFlipped([]);
    };

    const handleCardClick = (index: number) => {
        if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
        
        playPop();
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].img === cards[second].img) {
                playWin();
                setSolved([...solved, first, second]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-100 bg-black font-sans select-none">
            <Image src="/images/bg-card-table.jpg" alt="Table" fill className="object-cover" />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between z-50">
                <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg"><ArrowLeft /></button>
                <button onClick={resetGame} className="bg-white p-3 rounded-full shadow-lg text-lime-600"><RefreshCw /></button>
            </div>

            {/* Grid */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl">
                    {cards.map((card, index) => {
                        const isFlipped = flipped.includes(index) || solved.includes(index);
                        return (
                            <button
                                key={card.id}
                                onClick={() => handleCardClick(index)}
                                className={`relative w-24 h-32 md:w-32 md:h-44 rounded-xl shadow-2xl transition-all duration-500 transform ${isFlipped ? 'rotate-y-180' : ''}`}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Front (Face Up) */}
                                <div className={`absolute inset-0 bg-white rounded-xl flex items-center justify-center border-4 border-lime-500 ${isFlipped ? '' : 'hidden'}`}>
                                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                                        <Image src={card.img} alt="icon" fill className="object-contain" />
                                    </div>
                                </div>

                                {/* Back (Face Down) */}
                                <div className={`absolute inset-0 rounded-xl overflow-hidden border-4 border-white bg-blue-600 flex items-center justify-center ${isFlipped ? 'hidden' : ''}`}>
                                     <Image src="/images/card-back.png" alt="Back" fill className="object-cover" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Win Screen */}
            {solved.length === cards.length && cards.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-60 animate-in zoom-in">
                    <Trophy size={80} className="text-yellow-400 mb-4 animate-bounce" />
                    <h1 className="text-5xl font-black text-white mb-8">YOU WON!</h1>
                    <button onClick={resetGame} className="bg-lime-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-110 transition">
                        Play Again
                    </button>
                    <button onClick={onBack} className="mt-4 text-white hover:underline">
                        Back to Arcade
                    </button>
                </div>
            )}
        </div>
    );
}