'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Trophy, Star, Delete } from 'lucide-react';

const WORD_PUZZLES = [
  { word: 'APPLE', hint: 'A red or green crunchy fruit' },
  { word: 'STAR', hint: 'It shines bright in the night sky' },
  { word: 'TRAIN', hint: 'It runs on tracks and goes choo-choo!' },
  { word: 'WATER', hint: 'You drink this when you are thirsty' },
  { word: 'TIGER', hint: 'A big wild cat with orange and black stripes' },
  { word: 'MUSIC', hint: 'You listen and dance to this' },
  { word: 'BREAD', hint: 'You use this to make a sandwich' },
  { word: 'CLOCK', hint: 'It has hands and tells you the time' }
];

export default function WordPlay({ onBack }: { onBack: () => void }) {
    const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
    const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isError, setIsError] = useState(false);

    const popSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);
    const tadaSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popSoundRef.current = new Audio('/sounds/pop.mp3');
        winSoundRef.current = new Audio('/sounds/win2.mp3');
        tadaSoundRef.current = new Audio('/sounds/tada.mp3');
        loadPuzzle(0);
    }, []);

    const playPop = () => popSoundRef.current?.play().catch(() => {});
    const playWin = () => winSoundRef.current?.play().catch(() => {});
    const playTada = () => tadaSoundRef.current?.play().catch(() => {});

    const loadPuzzle = (index: number) => {
        const puzzle = WORD_PUZZLES[index];
        let arr = puzzle.word.split('');
        let shuffled;
        
        do {
            shuffled = [...arr].sort(() => Math.random() - 0.5);
        } while (shuffled.join('') === puzzle.word && puzzle.word.length > 1);

        setScrambledLetters(shuffled);
        setSelectedIndices([]);
        setIsError(false);
    };

    const handleLetterTap = (index: number) => {
        if (selectedIndices.includes(index) || isError) return;
        playPop();

        const newSelected = [...selectedIndices, index];
        setSelectedIndices(newSelected);

        const currentWord = WORD_PUZZLES[currentPuzzleIdx].word;

        if (newSelected.length === currentWord.length) {
            const spelledWord = newSelected.map(i => scrambledLetters[i]).join('');
            
            if (spelledWord === currentWord) {
                // Correct!
                playWin();
                setScore(prev => prev + 1);
                
                setTimeout(() => {
                    if (currentPuzzleIdx + 1 < WORD_PUZZLES.length) {
                        setCurrentPuzzleIdx(prev => prev + 1);
                        loadPuzzle(currentPuzzleIdx + 1);
                    } else {
                        setGameOver(true);
                        playTada();
                    }
                }, 1500);
            } else {
                // Wrong! Show error state briefly, then clear
                setIsError(true);
                setTimeout(() => {
                    setSelectedIndices([]);
                    setIsError(false);
                }, 1000);
            }
        }
    };

    const handleUndo = () => {
        if (selectedIndices.length === 0 || isError) return;
        playPop();
        setSelectedIndices(prev => prev.slice(0, -1));
    };

    const resetGame = () => {
        setCurrentPuzzleIdx(0);
        setScore(0);
        setGameOver(false);
        loadPuzzle(0);
    };

    const currentPuzzle = WORD_PUZZLES[currentPuzzleIdx];

    return (
        <div className="fixed inset-0 z-100 bg-purple-600 font-sans select-none overflow-hidden">
            {/* Background with a purple overlay */}
            <div className="absolute inset-0 z-0">
                <Image src="/images/bg-game-arcade.jpg" alt="Arcade" fill className="object-cover opacity-20 mix-blend-overlay" priority />
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition text-purple-600">
                    <ArrowLeft size={28} />
                </button>
                <div className="bg-white px-6 py-2 rounded-full shadow-lg font-black text-xl text-purple-600">
                    Score: {score} / {WORD_PUZZLES.length}
                </div>
                <button onClick={resetGame} className="bg-white p-3 rounded-full shadow-lg text-purple-600 hover:scale-110 transition">
                    <RefreshCw size={28} />
                </button>
            </div>

            {!gameOver ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-40 max-w-4xl mx-auto">
                    
                    {/* The Hint */}
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl w-full max-w-2xl text-center mb-8">
                        <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-2">Unscramble the word</p>
                        <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">
                            "{currentPuzzle.hint}"
                        </h2>
                    </div>

                    {/* Word Slots (Where tapped letters go) */}
                    <div className={`flex gap-2 md:gap-4 mb-10 transition-transform ${isError ? 'animate-bounce' : ''}`}>
                        {currentPuzzle.word.split('').map((_, idx) => {
                            const hasLetter = idx < selectedIndices.length;
                            const letterIndex = hasLetter ? selectedIndices[idx] : null;
                            const letter = letterIndex !== null ? scrambledLetters[letterIndex] : '';

                            return (
                                <div 
                                    key={idx} 
                                    className={`w-14 h-16 md:w-20 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-black shadow-inner border-b-8 transition-colors ${
                                        hasLetter 
                                            ? (isError ? 'bg-red-500 text-white border-red-700' : 'bg-green-500 text-white border-green-700') 
                                            : 'bg-white/40 text-transparent border-white/20'
                                    }`}
                                >
                                    {letter}
                                </div>
                            );
                        })}
                    </div>

                    {/* Scrambled Letters Pool */}
                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-2xl">
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-4">
                            {scrambledLetters.map((letter, idx) => {
                                const isSelected = selectedIndices.includes(idx);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleLetterTap(idx)}
                                        disabled={isSelected}
                                        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg border-b-8 transition-all ${
                                            isSelected 
                                                ? 'bg-purple-800 text-purple-900 border-purple-900 opacity-30 translate-y-2' 
                                                : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50 active:translate-y-2 active:border-b-0'
                                        }`}
                                    >
                                        {letter}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Undo Button */}
                        <div className="flex justify-center">
                            <button 
                                onClick={handleUndo}
                                disabled={selectedIndices.length === 0 || isError}
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-400 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold text-lg shadow-md transition"
                            >
                                <Delete size={24} /> Undo Last Letter
                            </button>
                        </div>
                    </div>

                </div>
            ) : (
                /* Win Screen */
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/60 backdrop-blur-sm animate-in zoom-in">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md flex flex-col items-center border-t-8 border-purple-500">
                        <Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" />
                        <h2 className="text-4xl font-black text-purple-600 mb-2 uppercase">Word Master!</h2>
                        <p className="text-xl text-gray-600 font-bold mb-8">
                            You unscrambled all {WORD_PUZZLES.length} words!
                        </p>
                        <div className="flex gap-4">
                            <button onClick={resetGame} className="bg-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                Play Again
                            </button>
                            <button onClick={onBack} className="bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                Arcade Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}