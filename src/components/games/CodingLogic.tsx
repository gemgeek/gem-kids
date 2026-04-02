'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Play, RotateCcw, Trash2, ArrowUp, ArrowRight, ArrowLeft as ArrowLeftIcon, CornerUpRight } from 'lucide-react';

// TYPES 
type CommandType = 'move' | 'left' | 'right' | 'jump';
type Direction = 'N' | 'E' | 'S' | 'W';

interface Level {
  id: number;
  start: { x: number; y: number; dir: Direction };
  goal: { x: number; y: number };
  rocks: { x: number; y: number }[];
  gridSize: number;
}

const levels: Level[] = [
  { 
    id: 1, 
    gridSize: 5, 
    start: { x: 0, y: 0, dir: 'E' }, 
    goal: { x: 3, y: 0 }, 
    rocks: [] 
  },
  { 
    id: 2, 
    gridSize: 5, 
    start: { x: 0, y: 2, dir: 'E' }, 
    goal: { x: 4, y: 0 }, 
    rocks: [{ x: 2, y: 2 }, { x: 2, y: 1 }] 
  },
  { 
    id: 3, 
    gridSize: 5, 
    start: { x: 0, y: 4, dir: 'N' }, 
    goal: { x: 4, y: 0 }, 
    rocks: [{ x: 1, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 1 }] 
  },
];

export default function CodingLogic({ onBack }: { onBack: () => void }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = levels[levelIndex];

  // Game State
  const [rover, setRover] = useState(currentLevel.start);
  const [queue, setQueue] = useState<CommandType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null); 
  const [isWin, setIsWin] = useState(false);
  const [isCrash, setIsCrash] = useState(false);

  // RESET LEVEL
  useEffect(() => {
    setRover(currentLevel.start);
    setQueue([]);
    setIsRunning(false);
    setIsWin(false);
    setIsCrash(false);
    setCurrentStep(null);
  }, [levelIndex]);

  // EXECUTION LOOP
  useEffect(() => {
    if (isRunning && currentStep !== null && currentStep < queue.length) {
      const timer = setTimeout(() => {
        executeCommand(queue[currentStep]);
        setCurrentStep(prev => (prev !== null ? prev + 1 : null));
      }, 600); 
      return () => clearTimeout(timer);
    } else if (isRunning && currentStep === queue.length) {
      // Finished all commands
      checkWinCondition();
      setIsRunning(false);
      setCurrentStep(null);
    }
  }, [isRunning, currentStep, queue]);

  // LOGIC: Execute one command
  const executeCommand = (cmd: CommandType) => {
    setRover(prev => {
      let { x, y, dir } = prev;
      
      if (cmd === 'left') {
        const dirs: Direction[] = ['N', 'E', 'S', 'W'];
        const newIdx = (dirs.indexOf(dir) - 1 + 4) % 4;
        new Audio('/sounds/servo.mp3').play().catch(() => {});
        return { ...prev, dir: dirs[newIdx] };
      }
      
      if (cmd === 'right') {
        const dirs: Direction[] = ['N', 'E', 'S', 'W'];
        const newIdx = (dirs.indexOf(dir) + 1) % 4;
        new Audio('/sounds/servo.mp3').play().catch(() => {});
        return { ...prev, dir: dirs[newIdx] };
      }

      if (cmd === 'move' || cmd === 'jump') {
        let nextX = x;
        let nextY = y;
        const dist = cmd === 'jump' ? 2 : 1; 

        if (dir === 'N') nextY -= dist;
        if (dir === 'S') nextY += dist;
        if (dir === 'E') nextX += dist;
        if (dir === 'W') nextX -= dist;

        // Boundary Check
        if (nextX < 0 || nextX >= currentLevel.gridSize || nextY < 0 || nextY >= currentLevel.gridSize) {
            handleCrash();
            return prev;
        }

        // Obstacle Check
        const hitRock = currentLevel.rocks.find(r => r.x === nextX && r.y === nextY);
        if (hitRock) {
            handleCrash();
            return prev;
        }

        new Audio('/sounds/move.mp3').play().catch(() => {});
        return { ...prev, x: nextX, y: nextY };
      }

      return prev;
    });
  };

  const handleCrash = () => {
      setIsCrash(true);
      setIsRunning(false);
      setCurrentStep(null);
      new Audio('/sounds/wrong.mp3').play().catch(() => {});
  };

  const checkWinCondition = () => {
    
  };

  // CHECK WIN 
  useEffect(() => {
      if (rover.x === currentLevel.goal.x && rover.y === currentLevel.goal.y) {
          setIsWin(true);
          new Audio('/sounds/win2.mp3').play().catch(() => {});
      }
  }, [rover]);


  // COMMAND QUEUE HANDLERS
  const addToQueue = (cmd: CommandType) => {
      if (isRunning || isWin) return;
      if (queue.length < 10) {
          setQueue(prev => [...prev, cmd]);
          new Audio('/sounds/pop.mp3').play().catch(() => {});
      }
  };

  const runCode = () => {
      if (queue.length === 0) return;
      setIsRunning(true);
      setCurrentStep(0);
      setIsWin(false);
      setIsCrash(false);
      setRover(currentLevel.start); 
  };

  const clearQueue = () => {
      setQueue([]);
      setRover(currentLevel.start);
      setIsWin(false);
      setIsCrash(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#0f172a]">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 opacity-20 bg-size-[50px_50px] bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)]" />

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-slate-800 text-white p-3 rounded-full hover:bg-slate-700 transition border border-slate-600">
            <ArrowLeft />
         </button>
         <div className="bg-slate-800/90 px-8 py-3 rounded-2xl border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <h1 className="text-green-400 font-black uppercase tracking-widest text-xl font-mono">
                &lt;CODE_ROVER /&gt;
            </h1>
         </div>
         <div className="text-slate-500 font-mono text-sm">LEVEL {levelIndex + 1}</div>
      </div>

      
      <div className="relative w-full max-w-6xl h-[85vh] mt-16 flex flex-col md:flex-row gap-8 p-4">
        
        
        <div className="flex-1 bg-slate-900/50 rounded-3xl border-4 border-slate-700 relative overflow-hidden flex items-center justify-center shadow-2xl">
            
            <div 
                className="grid gap-1 bg-slate-800/50 p-2 rounded-xl"
                style={{ 
                    gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
                    width: 'min(90%, 500px)',
                    aspectRatio: '1/1'
                }}
            >
                {[...Array(currentLevel.gridSize * currentLevel.gridSize)].map((_, i) => {
                    const x = i % currentLevel.gridSize;
                    const y = Math.floor(i / currentLevel.gridSize);
                    
                    const isGoal = x === currentLevel.goal.x && y === currentLevel.goal.y;
                    const isRock = currentLevel.rocks.some(r => r.x === x && r.y === y);
                    const isRover = rover.x === x && rover.y === y;

                    return (
                        <div key={i} className="relative bg-slate-700/50 rounded-lg border border-slate-600/30 w-full h-full">
                            {/* GOAL */}
                            {isGoal && (
                                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                                    <div className="relative w-[70%] h-[70%]">
                                        <Image src="/images/battery.png" alt="Goal" fill className="object-contain drop-shadow-[0_0_10px_lime]" />
                                    </div>
                                </div>
                            )}

                            {/* ROCK */}
                            {isRock && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-[80%] h-[80%]">
                                        <Image src="/images/rock.png" alt="Rock" fill className="object-contain drop-shadow-lg" />
                                    </div>
                                </div>
                            )}

                            {/* ROVER */}
                            {isRover && (
                                <div 
                                    className="absolute inset-0 flex items-center justify-center transition-all duration-500 z-20"
                                    style={{ 
                                        transform: `rotate(${rover.dir === 'E' ? 90 : rover.dir === 'S' ? 180 : rover.dir === 'W' ? 270 : 0}deg)` 
                                    }}
                                >
                                    <div className="relative w-[90%] h-[90%]">
                                        <Image src="/images/rover.png" alt="Rover" fill className="object-contain drop-shadow-2xl" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* STATUS OVERLAYS */}
            {isWin && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm animate-in zoom-in">
                    <div className="bg-slate-900 border-4 border-green-500 p-8 rounded-3xl text-center">
                        <h2 className="text-3xl font-black text-green-400 mb-4">MISSION SUCCESS!</h2>
                        <button onClick={() => setLevelIndex(prev => (prev + 1) % levels.length)} className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-full font-bold">
                            NEXT MISSION
                        </button>
                    </div>
                </div>
            )}
            {isCrash && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-sm animate-in zoom-in">
                    <div className="bg-slate-900 border-4 border-red-500 p-8 rounded-3xl text-center">
                        <h2 className="text-3xl font-black text-red-400 mb-4">SYSTEM CRASH!</h2>
                        <button onClick={clearQueue} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold">
                            TRY AGAIN
                        </button>
                    </div>
                </div>
            )}
        </div>

        
        <div className="w-full md:w-96 flex flex-col gap-4">
            
            
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-600">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-widest">Command Center</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => addToQueue('move')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-bold shadow-lg active:scale-95 transition">
                        <ArrowUp size={20} /> Move Fwd
                    </button>
                    <button onClick={() => addToQueue('jump')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl font-bold shadow-lg active:scale-95 transition">
                        <CornerUpRight size={20} /> Jump
                    </button>
                    <button onClick={() => addToQueue('left')} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-xl font-bold shadow-lg active:scale-95 transition">
                        <ArrowLeftIcon size={20} /> Turn Left
                    </button>
                    <button onClick={() => addToQueue('right')} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-xl font-bold shadow-lg active:scale-95 transition">
                        <ArrowRight size={20} /> Turn Right
                    </button>
                </div>
            </div>

            
            <div className="flex-1 bg-black/40 rounded-2xl border-2 border-slate-700 p-4 relative overflow-hidden flex flex-col">
                <h3 className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-widest font-mono">Main.exe</h3>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {queue.length === 0 && (
                        <div className="text-slate-600 text-center mt-10 italic">drag commands here...</div>
                    )}
                    {queue.map((cmd, i) => (
                        <div key={i} className={`
                            flex items-center gap-3 p-3 rounded-lg font-mono text-sm font-bold border-l-4 transition-all
                            ${currentStep === i ? 'bg-green-500/20 border-green-500 text-green-300 scale-105' : 'bg-slate-800 border-slate-600 text-slate-300'}
                        `}>
                            <span className="text-slate-500 w-4">{i + 1}</span>
                            {cmd === 'move' && <><ArrowUp size={16} className="text-blue-400"/> MOVE_FORWARD()</>}
                            {cmd === 'left' && <><RotateCcw size={16} className="text-orange-400"/> TURN_LEFT()</>}
                            {cmd === 'right' && <><RotateCcw size={16} className="scale-x-[-1] text-orange-400"/> TURN_RIGHT()</>}
                            {cmd === 'jump' && <><CornerUpRight size={16} className="text-purple-400"/> JUMP_OBSTACLE()</>}
                        </div>
                    ))}
                </div>
            </div>

            
            <div className="flex gap-3">
                <button 
                    onClick={runCode} 
                    disabled={isRunning}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-lg shadow-xl transition-all
                        ${isRunning ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-black hover:scale-105'}
                    `}
                >
                    <Play fill="black" /> {isRunning ? 'RUNNING...' : 'RUN CODE'}
                </button>
                <button onClick={clearQueue} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 p-4 rounded-xl border-2 border-red-500/50 transition">
                    <Trash2 />
                </button>
            </div>

        </div>

      </div>
    </div>
  );
}