'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Trophy, MousePointerClick, CheckCircle, Lightbulb } from 'lucide-react';

const LEVEL_DATA = [
    {
        id: 1,
        title: 'Level 1: Dog House',
        image: '/images/dog-house.png',
        gridSize: 3,
        piecesCount: 9,
    },
    {
        id: 2,
        title: 'Level 2: Ocean Wonders',
        image: '/images/ocean-icon.png',
        gridSize: 4,
        piecesCount: 16,
    },
    {
        id: 3,
        title: 'Level 3: Game Arcade',
        image: '/images/bg-game-arcade.jpg',
        gridSize: 5,
        piecesCount: 25,
    },
];


export default function MiniPuzzle({ onBack }: { onBack: () => void }) {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    // Array of indices [0, 1, ..., grid*grid-1] representing the pieces
    const [pieces, setPieces] = useState<number[]>([]);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [isLevelComplete, setIsLevelComplete] = useState(false); 
    const [moves, setMoves] = useState(0);
    const [helpVisible, setHelpVisible] = useState(false);

    // Audio Refs
    const popSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);
    const tadaSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popSoundRef.current = new Audio('/sounds/pop.mp3');
        winSoundRef.current = new Audio('/sounds/win2.mp3');
        tadaSoundRef.current = new Audio('/sounds/tada.mp3'); 

        // Load first level
        loadLevel(0);
    }, []);

    const playPop = () => popSoundRef.current?.play().catch(() => {});
    const playWin = () => winSoundRef.current?.play().catch(() => {});
    const playTada = () => tadaSoundRef.current?.play().catch(() => {});

    const loadLevel = (index: number) => {
        if (index >= LEVEL_DATA.length) {
            return;
        }

        setCurrentLevelIndex(index);
        const level = LEVEL_DATA[index];
        const piecesCount = level.piecesCount;
        
        // Create an array 0 to (piecesCount-1) and shuffle it
        let shuffled = [...Array(piecesCount).keys()];
        // Make sure it doesn't accidentally start solved
        do {
            shuffled = shuffled.sort(() => Math.random() - 0.5);
        } while (shuffled.every((val, i) => val === i));
        
        setPieces(shuffled);
        setSelectedIdx(null);
        setIsSolved(false);
        setIsLevelComplete(false);
        setMoves(0);
        setHelpVisible(false);
    };

    const handlePieceClick = (index: number) => {
        if (isSolved || helpVisible || isLevelComplete) return; 
        playPop();

        if (selectedIdx === null) {
            // Select the first piece
            setSelectedIdx(index);
        } else {
            if (selectedIdx === index) {
                // Deselect if clicked twice
                setSelectedIdx(null);
                return;
            }

            // Swap the two pieces
            const newPieces = [...pieces];
            const temp = newPieces[selectedIdx];
            newPieces[selectedIdx] = newPieces[index];
            newPieces[index] = temp;
            
            setPieces(newPieces);
            setSelectedIdx(null);
            setMoves(prev => prev + 1);

            // Check if solved
            const level = LEVEL_DATA[currentLevelIndex];
            if (newPieces.every((val, i) => val === i)) {
                setIsSolved(true);
                setIsLevelComplete(true);
                playWin();
                
                // If last level is complete, play tada!
                if (currentLevelIndex + 1 === LEVEL_DATA.length) {
                    setTimeout(() => playTada(), 500);
                }
            }
        }
    };

    const toggleHelp = () => {
        if (isSolved || isLevelComplete) return; 
        playPop();
        setHelpVisible(prev => !prev);
    };

    const nextLevel = () => {
        playPop();
        if (currentLevelIndex + 1 < LEVEL_DATA.length) {
            loadLevel(currentLevelIndex + 1);
        } else {
            // If all complete, go back to arcade
            onBack();
        }
    };

    const resetLevel = () => {
        playPop();
        loadLevel(currentLevelIndex);
    };

    const currentLevel = LEVEL_DATA[currentLevelIndex];
    const gridSize = currentLevel.gridSize;

    return (
        <div className="fixed inset-0 z-100 bg-pink-500 font-sans select-none overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* HEADER */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition text-pink-600">
                    <ArrowLeft size={28} />
                </button>
                <div className="bg-white px-6 py-2 rounded-full shadow-lg font-black text-xl text-pink-600">
                    {currentLevel.title} | Moves: {moves}
                </div>
                <div className="flex gap-2">
                    <button onClick={toggleHelp} disabled={isSolved || isLevelComplete} className={`p-3 rounded-full shadow-lg transition ${helpVisible ? 'bg-yellow-400 text-white' : 'bg-white text-pink-600 hover:bg-yellow-50 disabled:opacity-50'}`}>
                        <Lightbulb size={28} />
                    </button>
                    <button onClick={resetLevel} className="bg-white p-3 rounded-full shadow-lg text-pink-600 hover:scale-110 transition">
                        <RefreshCw size={28} />
                    </button>
                </div>
            </div>

            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-4 z-40 gap-8 md:gap-16">
                
                {/* Reference Image (Goal Picture - optional, as help overlay is more prominent) */}
                <div className="flex flex-col items-center">
                    <h2 className="text-white font-black text-xl mb-4 drop-shadow-md hidden md:block">Goal Picture</h2>
                    <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white/50 shadow-xl opacity-80 hidden md:block">
                        <Image src={currentLevel.image} alt="Goal" fill className="object-cover" />
                    </div>
                </div>

                {/* The Puzzle Grid */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-white font-bold mb-4 bg-black/20 px-4 py-2 rounded-full">
                        <MousePointerClick size={20} />
                        <span>Tap two pieces to swap them!</span>
                    </div>

                    <div className="grid p-2 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl relative w-75 h-75 md:w-112.5 md:h-112.5"
                        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)`, gap: `${gridSize === 5 ? '1px' : '2px'}`, padding: `${gridSize === 5 ? '1px' : '2px'}` }}
                    >
                        {pieces.map((pieceVal, index) => {
                            const isSelected = selectedIdx === index;
                            // Calculate background positions (0%, ..., 100%) to map to the grid
                            const bgX = (pieceVal % gridSize) * (100 / (gridSize - 1)); 
                            const bgY = Math.floor(pieceVal / gridSize) * (100 / (gridSize - 1));

                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePieceClick(index)}
                                    disabled={isSolved || helpVisible || isLevelComplete} // Disable clicks if solved, help visible, or level complete
                                    className={`relative w-full h-full rounded-lg overflow-hidden transition-all duration-200 disabled:cursor-not-allowed ${
                                        isSelected ? 'ring-4 ring-yellow-400 scale-95 z-10 opacity-80' : 'hover:opacity-90 hover:scale-[0.98]'
                                    }`}
                                >
                                    <div 
                                        className="absolute inset-0 w-full h-full bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(${currentLevel.image})`,
                                            backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                                            backgroundPosition: `${bgX}% ${bgY}%`
                                        }}
                                    />
                                    {/* Selected Overlay */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-yellow-400/30 flex items-center justify-center">
                                            <RefreshCw className="text-white animate-spin-slow" size={gridSize === 5 ? 24 : 32} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                        
                        {/* Help Overlay - Translucent full image */}
                        {helpVisible && (
                            <div className="absolute inset-0 z-20 bg-black/70 flex flex-col items-center justify-center p-4 rounded-xl animate-in fade-in duration-300">
                                 <button onClick={toggleHelp} className="absolute top-4 right-4 bg-white/30 text-white p-2 rounded-full hover:bg-white/50 transition"><Lightbulb /></button>
                                 <Image src={currentLevel.image} alt="Goal" fill className="object-contain opacity-60" />
                                 <span className="relative z-30 text-white font-black text-2xl drop-shadow-md">Guide Image</span>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>

            {/* Clear Win State Modal (For Level/Game Completion) */}
            {(isLevelComplete || (isSolved && currentLevelIndex + 1 === LEVEL_DATA.length)) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/70 backdrop-blur-sm animate-in zoom-in duration-500">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg flex flex-col items-center border-t-8 border-pink-500 w-[90vw] md:w-auto">
                        <CheckCircle size={100} className="text-green-500 mb-6 animate-pulse" />
                        <h2 className="text-4xl font-black text-pink-600 mb-2 uppercase drop-shadow-sm">
                            {(currentLevelIndex + 1 === LEVEL_DATA.length) ? 'Picture Fixed!' : 'Level Fixed!'}
                        </h2>
                        <p className="text-xl text-gray-700 font-bold mb-4">
                            You solved {currentLevel.title}!
                        </p>
                        <p className="text-lg text-gray-600 font-medium mb-10 bg-gray-100 px-6 py-2 rounded-full">
                            Total Moves: <span className="text-2xl text-pink-600 font-bold">{moves}</span>
                        </p>
                        
                        {(currentLevelIndex + 1 === LEVEL_DATA.length) ? (
                            // All Levels Complete
                            <div className="flex flex-col items-center gap-3">
                                <Trophy size={60} className="text-yellow-400 animate-bounce" />
                                <h3 className="text-3xl font-black text-yellow-500 mb-4 uppercase">All Fixed!</h3>
                                <div className="flex gap-4">
                                     <button onClick={resetLevel} className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                        Replay All
                                     </button>
                                     <button onClick={onBack} className="bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                        Arcade Menu
                                     </button>
                                </div>
                            </div>
                        ) : (
                            // Proceed to Next Level
                            <div className="flex gap-4">
                                <button onClick={resetLevel} className="bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                    Replay Level
                                </button>
                                <button onClick={nextLevel} className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition flex items-center gap-2">
                                    Next Level ({LEVEL_DATA[currentLevelIndex + 1].gridSize}x{LEVEL_DATA[currentLevelIndex + 1].gridSize})
                                </button>
                            </div>
                        )}
                        
                    </div>
                </div>
            )}
            
            <style jsx global>{`
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 3s linear infinite; }
                .clip-polygon { clip-path: polygon(0% 15%, 100% 0%, 100% 100%, 0% 85%); filter: drop-shadow(-4px 4px 4px rgba(0,0,0,0.2)); }
            `}</style>
        </div>
    );
}