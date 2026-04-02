'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, Volume2, Star } from 'lucide-react';

const SPELLING_WORDS = [
  { word: 'LION', hint: 'The King of the Jungle' },
  { word: 'SPACE', hint: 'Where astronauts go' },
  { word: 'PIZZA', hint: 'Cheesy round food' },
  { word: 'ROBOT', hint: 'A machine that moves' },
  { word: 'HAPPY', hint: 'Feeling good and smiling' },
  { word: 'SCHOOL', hint: 'Where you go to learn' },
];

export default function SpellingBee({ onBack }: { onBack: () => void }) {
    const [level, setLevel] = useState(0);
    const [input, setInput] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    // Audio Refs
    const popSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popSoundRef.current = new Audio('/sounds/pop.mp3');
        winSoundRef.current = new Audio('/sounds/win2.mp3');
    }, []);

    const playPop = () => popSoundRef.current?.play().catch(() => {});
    const playWin = () => winSoundRef.current?.play().catch(() => {});

    const currentWordObj = SPELLING_WORDS[level % SPELLING_WORDS.length];
    const targetWord = currentWordObj.word;

    const speakWord = () => {
        const utterance = new SpeechSynthesisUtterance(targetWord);
        utterance.rate = 0.8; 
        window.speechSynthesis.speak(utterance);
    };

    const handleLetterClick = (letter: string) => {
        playPop();
        if (input.length < targetWord.length) {
            const newInput = input + letter;
            setInput(newInput);
            
            if (newInput === targetWord) {
                setIsCorrect(true);
                playWin();
                setTimeout(() => {
                    setInput('');
                    setIsCorrect(false);
                    setLevel(l => l + 1);
                }, 2000);
            }
        }
    };

    const handleDelete = () => {
        playPop();
        setInput(prev => prev.slice(0, -1));
    };

    return (
        <div className="fixed inset-0 z-100 bg-black font-sans select-none">
            <Image src="/images/bg-garden.jpg" alt="Garden" fill className="object-cover" />
            
            {/* Header */}
            <div className="absolute top-6 left-6 z-50">
                <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition"><ArrowLeft /></button>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-40 p-4">
                
                {/* Bee Character */}
                <div className="relative w-40 h-40 mb-4 animate-bounce">
                    <Image src="/images/char-bee.png" alt="Bee" fill className="object-contain" />
                </div>

                {/* Question */}
                <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-xl mb-6 text-center max-w-md">
                    <p className="text-gray-500 font-bold uppercase text-sm mb-1">Spell the word:</p>
                    <div className="flex items-center justify-center gap-2">
                         <h2 className="text-2xl font-black text-amber-600">"{currentWordObj.hint}"</h2>
                         <button onClick={speakWord} className="bg-amber-100 p-2 rounded-full text-amber-600 hover:bg-amber-200 transition animate-pulse">
                             <Volume2 size={24} />
                         </button>
                    </div>
                </div>

                {/* Word Slots */}
                <div className="flex gap-2 mb-8">
                    {targetWord.split('').map((char, index) => (
                        <div key={index} className={`w-12 h-14 md:w-16 md:h-20 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl font-black border-b-8 ${isCorrect ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-200 text-slate-700'}`}>
                            {input[index] || ''}
                        </div>
                    ))}
                </div>

                {/* Keyboard */}
                <div className="bg-white/30 backdrop-blur-md p-4 rounded-3xl max-w-2xl">
                    <div className="flex flex-wrap justify-center gap-2">
                        {'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').map(letter => (
                            <button
                                key={letter}
                                onClick={() => handleLetterClick(letter)}
                                className="w-10 h-12 md:w-14 md:h-14 bg-white rounded-lg shadow-md font-bold text-xl hover:bg-amber-100 hover:scale-105 active:scale-95 transition text-slate-700"
                            >
                                {letter}
                            </button>
                        ))}
                        <button onClick={handleDelete} className="w-auto px-6 h-12 md:h-14 bg-red-100 text-red-600 rounded-lg shadow-md font-bold hover:bg-red-200">
                            DEL
                        </button>
                    </div>
                </div>

                {/* Success Overlay */}
                {isCorrect && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 animate-in zoom-in">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center transform scale-125">
                            <Star size={60} className="text-yellow-400 mx-auto mb-2 animate-spin-slow" fill="currentColor" />
                            <h2 className="text-4xl font-black text-green-500">Correct!</h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}